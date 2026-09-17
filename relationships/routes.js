/* ═══════════════════════════════════════
   WOBAZI — Relationships routes
   relationships/routes.js

   Signed-in (401 otherwise):
   - GET    /api/rel/config
   - GET    /api/rel/people                      list (+ one-line archetype)
   - POST   /api/rel/people                      add manually
   - GET    /api/rel/people/:id                  one person (birth data only for manual rows)
   - PATCH  /api/rel/people/:id                  name / type / birth data / share name toggle
   - DELETE /api/rel/people/:id
   - GET    /api/rel/people/:id/reading          cached reading; starts generation when needed
   - POST   /api/rel/people/:id/reading/retry
   - POST   /api/rel/invites                     create invite link
   - DELETE /api/rel/invites/:token              cancel
   - POST   /api/rel/invites/accept              link accounts using the draft in the session
   - POST   /api/rel/people/:id/share            active public link (created if needed)
   - DELETE /api/rel/share/:token                revoke
   Public (no sign-in, always free):
   - GET    /api/rel/place-suggest?q=            places with coordinates + timezone
   - GET    /i/:token                            invite landing
   - POST   /api/rel/invites/:token/teaser       Day Master teaser (nothing stored)
   - POST   /api/rel/invites/:token/draft        keep recipient's birth data in the session
   - GET    /r/:token                            public share page
   - GET    /r/:token/story.png | /r/:token/og.png
═══════════════════════════════════════ */

'use strict';

const express = require('express');
const crypto = require('crypto');
const { TYPES, parseBirthInput, chartFromPerson, chartFromReadingsRow, firstName } = require('./chart');
const { dayMasterArchetype } = require('./archetypes');
const { entitlements } = require('./flags');
const { cardData } = require('./share-card');
const { searchPlaces, resolveTimezone } = require('./tz');
const { elementScore } = require('./scoring');

const INVITE_DAYS = 14;
const MAX_NAME = 60;

function token() {
  return crypto.randomBytes(18).toString('base64url');
}

/* Tiny in-memory rate limiter for public endpoints. */
function limiter(max, windowMs) {
  const hits = new Map();
  return function allow(key) {
    const now = Date.now();
    const e = hits.get(key);
    if (!e || now - e.start > windowMs) {
      hits.set(key, { start: now, n: 1 });
      if (hits.size > 5000) hits.clear();
      return true;
    }
    e.n += 1;
    return e.n <= max;
  };
}

function createRoutes(db, deps) {
  const { readings, cards, baseUrl } = deps;
  const router = express.Router();

  const allowTeaser = limiter(30, 60 * 60 * 1000);
  const allowPlace = limiter(60, 10 * 60 * 1000);
  const allowCreate = limiter(40, 60 * 60 * 1000);

  const restoreUser = db.prepare('INSERT OR IGNORE INTO users (google_id, name, email, avatar) VALUES (?, ?, ?, ?)');
  function requireUser(req, res) {
    const u = req.session && req.session.user;
    if (!u || !u.googleId) {
      res.status(401).json({ error: 'Not logged in' });
      return null;
    }
    restoreUser.run(u.googleId, u.name || null, u.email || null, u.avatar || null);
    return u.googleId;
  }

  const qPerson = db.prepare('SELECT * FROM people WHERE id = ? AND owner_id = ?');
  const qPeople = db.prepare('SELECT * FROM people WHERE owner_id = ? ORDER BY created_at, id');
  const qReadingsRow = db.prepare('SELECT * FROM readings WHERE google_id = ?');
  const qUser = db.prepare('SELECT google_id, name FROM users WHERE google_id = ?');
  const qInvite = db.prepare('SELECT * FROM relationship_invites WHERE token = ?');
  const qShareByToken = db.prepare('SELECT * FROM relationship_share_links WHERE token = ?');
  const qActiveShare = db.prepare('SELECT * FROM relationship_share_links WHERE person_id = ? AND revoked_at IS NULL ORDER BY id DESC LIMIT 1');

  function clientIp(req) {
    return req.ip || (req.connection && req.connection.remoteAddress) || 'unknown';
  }

  function ownerFirstName(googleId) {
    const r = qReadingsRow.get(googleId);
    const u = qUser.get(googleId);
    return firstName((r && r.name) || (u && u.name) || '');
  }

  /* Which rows are locked when the paywall is on: everything past the free allowance. */
  function lockedIds(ent, people) {
    if (!ent.maxPeople) return new Set();
    return new Set(people.slice(ent.maxPeople).map(p => p.id));
  }

  function personArchetype(person) {
    const chart = person.linked_user_id
      ? chartFromReadingsRow(qReadingsRow.get(person.linked_user_id))
      : chartFromPerson(person);
    if (!chart) return null;
    const dm = chart.pillars[2].stem;
    const a = dayMasterArchetype(dm.char);
    return a ? { name: a.name, line: a.line, element: dm.element, polarity: dm.polarity } : null;
  }

  function publicPerson(p, extra) {
    const out = {
      id: p.id,
      name: p.name,
      type: p.rel_type,
      linked: !!p.linked_user_id,
      shareShowName: !!p.share_show_name,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    };
    if (!p.linked_user_id) {
      out.birth = {
        calendar: p.calendar_type,
        year: p.calendar_type === 'lunar' ? p.lunar_year : p.year,
        month: p.calendar_type === 'lunar' ? p.lunar_month : p.month,
        day: p.calendar_type === 'lunar' ? p.lunar_day : p.day,
        leapMonth: !!p.leap_month,
        hourKnown: !!p.hour_known,
        hour: p.hour,
        minute: p.minute,
        birthplace: p.birthplace,
      };
    }
    return Object.assign(out, extra || {});
  }

  function parseName(v) {
    const s = String(v || '').replace(/\s+/g, ' ').trim().slice(0, MAX_NAME);
    return s || null;
  }

  function withTz(birth) {
    if (birth.birth_country) {
      const tz = resolveTimezone(birth.birth_country, birth.birth_lon);
      birth.birth_tz = tz.tz;
      birth.birth_tz_source = tz.source;
    } else {
      birth.birth_tz = null;
      birth.birth_tz_source = null;
    }
    return birth;
  }

  /* Record the account holder's birth place + timezone (for the future timezone migration). */
  function recordUserPlace(googleId, place) {
    if (!place || !place.birthplace) return;
    db.prepare(`
      INSERT INTO user_birth_places (google_id, birthplace, lat, lon, country, tz, tz_source, resolved_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(google_id) DO UPDATE SET birthplace = excluded.birthplace, lat = excluded.lat, lon = excluded.lon,
        country = excluded.country, tz = excluded.tz, tz_source = excluded.tz_source, resolved_at = datetime('now')
    `).run(googleId, place.birthplace, place.birth_lat, place.birth_lon, place.birth_country, place.birth_tz, place.birth_tz_source);
  }

  /* Users who typed their birthplace in the main form have a label only: geocode it once, in the background. */
  const placeSyncing = new Set();
  function syncUserPlace(googleId) {
    const r = qReadingsRow.get(googleId);
    const label = r && r.birthplace && String(r.birthplace).trim();
    if (!label || placeSyncing.has(googleId)) return;
    const have = db.prepare('SELECT birthplace FROM user_birth_places WHERE google_id = ?').get(googleId);
    if (have && have.birthplace === label) return;
    placeSyncing.add(googleId);
    searchPlaces(label, 1).then(list => {
      const p = list[0];
      recordUserPlace(googleId, {
        birthplace: label,
        birth_lat: p ? p.lat : null, birth_lon: p ? p.lon : null, birth_country: p ? p.countryCode : null,
        birth_tz: p ? p.tz : null, birth_tz_source: p ? p.tzSource : null,
      });
    }).catch(() => { /* retried on a later visit */ }).finally(() => placeSyncing.delete(googleId));
  }

  /* Trim the stored reading to what the viewer may see. The LLM text keeps {name}; the client substitutes. */
  function readingPayload(row, ent, type) {
    if (!row) return null;
    const facts = row.facts || {};
    const out = {
      status: row.status,
      generatedAt: row.generatedAt,
      canRetry: row.status === 'error',
      facts: {
        type: facts.type,
        confidence: facts.confidence,
        hourUnknown: facts.hourUnknown,
        archetype: facts.archetype,
        you: facts.you,
        them: facts.them,
        scores: facts.scores,
        friction: ent.friction ? facts.friction : undefined,
        spousePalace: ent.typeSections && type === 'romantic' ? facts.spousePalace : undefined,
        workStyle: ent.typeSections && type === 'business' ? facts.workStyle : undefined,
      },
      text: null,
      locked: { friction: !ent.friction, typeSections: !ent.typeSections },
    };
    if (row.text) {
      out.text = {
        headline: row.text.headline,
        scores: row.text.scores,
        friction: ent.friction ? row.text.friction : undefined,
        romantic: ent.typeSections && type === 'romantic' ? row.text.romantic : undefined,
        business: ent.typeSections && type === 'business' ? row.text.business : undefined,
      };
    }
    return out;
  }

  /* ═══════════ Config + people ═══════════ */

  router.get('/api/rel/config', (req, res) => {
    const gid = requireUser(req, res);
    if (!gid) return;
    const ent = entitlements(db, gid);
    res.json({ paywall: ent.paywall, paid: ent.paid, maxPeople: ent.maxPeople, hasChart: !!qReadingsRow.get(gid) });
  });

  router.get('/api/rel/people', (req, res) => {
    const gid = requireUser(req, res);
    if (!gid) return;
    syncUserPlace(gid);
    const ent = entitlements(db, gid);
    const people = qPeople.all(gid);
    const locked = lockedIds(ent, people);
    res.json({
      people: people.map(p => publicPerson(p, { archetype: personArchetype(p), locked: locked.has(p.id) }))
        .map(p => { delete p.birth; return p; }),
      paywall: ent.paywall,
      maxPeople: ent.maxPeople,
      hasChart: !!qReadingsRow.get(gid),
    });
  });

  router.post('/api/rel/people', (req, res) => {
    const gid = requireUser(req, res);
    if (!gid) return;
    if (!allowCreate(gid)) return res.status(429).json({ error: 'Too many changes. Try again later.' });
    if (!qReadingsRow.get(gid)) return res.status(409).json({ error: 'Save your own chart first.', code: 'owner_chart_missing' });
    const ent = entitlements(db, gid);
    if (ent.maxPeople && qPeople.all(gid).length >= ent.maxPeople) {
      return res.status(402).json({ error: 'Upgrade to save more people.', code: 'paywall' });
    }
    const body = req.body || {};
    const name = parseName(body.name);
    if (!name) return res.status(400).json({ error: 'Please enter a name.' });
    if (!TYPES.includes(body.type)) return res.status(400).json({ error: 'Choose a relationship type.' });
    const parsed = parseBirthInput(body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });
    const b = withTz(parsed.value);
    const info = db.prepare(`
      INSERT INTO people (owner_id, name, rel_type, calendar_type, year, month, day, leap_month, lunar_year, lunar_month, lunar_day,
        hour_known, hour, minute, birthplace, birth_lat, birth_lon, birth_country, birth_tz, birth_tz_source)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(gid, name, body.type, b.calendar_type, b.year, b.month, b.day, b.leap_month, b.lunar_year, b.lunar_month, b.lunar_day,
      b.hour_known, b.hour, b.minute, b.birthplace, b.birth_lat, b.birth_lon, b.birth_country, b.birth_tz, b.birth_tz_source);
    const person = qPerson.get(info.lastInsertRowid, gid);
    readings.ensure(person);
    res.json({ ok: true, person: publicPerson(person, { archetype: personArchetype(person) }) });
  });

  router.get('/api/rel/people/:id', (req, res) => {
    const gid = requireUser(req, res);
    if (!gid) return;
    const person = qPerson.get(parseInt(req.params.id, 10) || 0, gid);
    if (!person) return res.status(404).json({ error: 'Not found' });
    const ent = entitlements(db, gid);
    const locked = lockedIds(ent, qPeople.all(gid)).has(person.id);
    const share = qActiveShare.get(person.id);
    res.json({
      person: publicPerson(person, { archetype: personArchetype(person), locked }),
      share: share ? shareInfo(share) : null,
    });
  });

  router.patch('/api/rel/people/:id', (req, res) => {
    const gid = requireUser(req, res);
    if (!gid) return;
    const person = qPerson.get(parseInt(req.params.id, 10) || 0, gid);
    if (!person) return res.status(404).json({ error: 'Not found' });
    const body = req.body || {};
    const sets = [];
    const vals = [];
    if (body.name !== undefined) {
      const name = parseName(body.name);
      if (!name) return res.status(400).json({ error: 'Please enter a name.' });
      sets.push('name = ?'); vals.push(name);
    }
    if (body.type !== undefined) {
      if (!TYPES.includes(body.type)) return res.status(400).json({ error: 'Choose a relationship type.' });
      sets.push('rel_type = ?'); vals.push(body.type);
    }
    if (body.shareShowName !== undefined) {
      sets.push('share_show_name = ?'); vals.push(body.shareShowName ? 1 : 0);
    }
    if (body.birth !== undefined) {
      if (person.linked_user_id) return res.status(400).json({ error: 'Birth details for a linked account are managed by that account.' });
      const parsed = parseBirthInput(body.birth);
      if (parsed.error) return res.status(400).json({ error: parsed.error });
      const b = withTz(parsed.value);
      ['calendar_type', 'year', 'month', 'day', 'leap_month', 'lunar_year', 'lunar_month', 'lunar_day', 'hour_known', 'hour', 'minute',
        'birthplace', 'birth_lat', 'birth_lon', 'birth_country', 'birth_tz', 'birth_tz_source'].forEach(k => { sets.push(`${k} = ?`); vals.push(b[k]); });
    }
    if (!sets.length) return res.status(400).json({ error: 'Nothing to update' });
    db.prepare(`UPDATE people SET ${sets.join(', ')}, updated_at = datetime('now') WHERE id = ? AND owner_id = ?`).run(...vals, person.id, gid);
    const updated = qPerson.get(person.id, gid);
    const share = qActiveShare.get(person.id);
    if (body.shareShowName !== undefined) cards.purge(`p${person.id}`);
    res.json({ ok: true, person: publicPerson(updated, { archetype: personArchetype(updated) }), share: share ? shareInfo(share) : null });
  });

  router.delete('/api/rel/people/:id', (req, res) => {
    const gid = requireUser(req, res);
    if (!gid) return;
    const person = qPerson.get(parseInt(req.params.id, 10) || 0, gid);
    if (!person) return res.status(404).json({ error: 'Not found' });
    db.transaction(() => {
      db.prepare('DELETE FROM relationship_share_links WHERE person_id = ?').run(person.id);
      db.prepare('DELETE FROM relationship_readings WHERE person_id = ?').run(person.id);
      db.prepare('DELETE FROM people WHERE id = ?').run(person.id);
    })();
    cards.purge(`p${person.id}`);
    res.json({ ok: true });
  });

  /* ═══════════ Readings ═══════════ */

  function readingRoute(retry) {
    return (req, res) => {
      const gid = requireUser(req, res);
      if (!gid) return;
      const person = qPerson.get(parseInt(req.params.id, 10) || 0, gid);
      if (!person) return res.status(404).json({ error: 'Not found' });
      const ent = entitlements(db, gid);
      if (lockedIds(ent, qPeople.all(gid)).has(person.id)) {
        return res.status(402).json({ error: 'Upgrade to see this reading.', code: 'paywall' });
      }
      const row = readings.ensure(person, { retry });
      if (row.error === 'owner_chart_missing') return res.status(409).json({ error: 'Save your own chart first.', code: row.error });
      if (row.error) return res.status(409).json({ error: 'Birth details for this person are unavailable.', code: row.error });
      const payload = readingPayload(row, ent, person.rel_type);
      // Element mix (% per element) for the owner's chart view. Computed live, never stored or shared.
      const a = readings.ownerChart(person.owner_id);
      const b = readings.personChart(person);
      if (a && b) payload.facts.elements = elementScore(a.pillars, b.pillars).shares;
      res.json({ reading: payload });
    };
  }
  router.get('/api/rel/people/:id/reading', readingRoute(false));
  router.post('/api/rel/people/:id/reading/retry', readingRoute(true));

  /* ═══════════ Sharing ═══════════ */

  function shareInfo(s) {
    return {
      token: s.token,
      url: `${baseUrl}/r/${s.token}`,
      storyUrl: `${baseUrl}/r/${s.token}/story.png`,
      ogUrl: `${baseUrl}/r/${s.token}/og.png`,
      createdAt: s.created_at,
    };
  }

  router.post('/api/rel/people/:id/share', (req, res) => {
    const gid = requireUser(req, res);
    if (!gid) return;
    const person = qPerson.get(parseInt(req.params.id, 10) || 0, gid);
    if (!person) return res.status(404).json({ error: 'Not found' });
    const row = readings.peek(person.id);
    if (!row || !row.facts || !row.facts.archetype) return res.status(409).json({ error: 'The reading is not ready yet.' });
    let share = qActiveShare.get(person.id);
    if (!share) {
      db.prepare('INSERT INTO relationship_share_links (token, person_id, owner_id) VALUES (?, ?, ?)').run(token(), person.id, gid);
      share = qActiveShare.get(person.id);
    }
    res.json({ ok: true, share: shareInfo(share) });
  });

  router.delete('/api/rel/share/:token', (req, res) => {
    const gid = requireUser(req, res);
    if (!gid) return;
    const share = qShareByToken.get(String(req.params.token || ''));
    if (!share || share.owner_id !== gid) return res.status(404).json({ error: 'Not found' });
    db.prepare("UPDATE relationship_share_links SET revoked_at = datetime('now') WHERE id = ? AND revoked_at IS NULL").run(share.id);
    cards.purge(`p${share.person_id}`);
    res.json({ ok: true });
  });

  /* Public share data: first names + archetype + scores. Nothing else leaves the database. */
  function publicShare(tok) {
    const share = qShareByToken.get(String(tok || ''));
    if (!share || share.revoked_at) return null;
    const person = db.prepare('SELECT * FROM people WHERE id = ?').get(share.person_id);
    if (!person) return null;
    const row = readings.peek(person.id);
    if (!row || !row.facts || !row.facts.archetype) return null;
    return {
      share, person,
      card: cardData({
        ownerFirst: ownerFirstName(person.owner_id),
        personFirst: firstName(person.name),
        showName: !!person.share_show_name,
        type: person.rel_type,
        facts: row.facts,
      }),
    };
  }

  function renderGone(res, kind) {
    res.status(404).render('pages/rel-gone', {
      baseUrl, title: 'Link not available | Wobazi', canonical: '/', noindex: true,
      description: 'This link is no longer available. Get your own compatibility reading on Wobazi.',
      kind,
    });
  }

  router.get('/r/:token', (req, res) => {
    const data = publicShare(req.params.token);
    if (!data) return renderGone(res, 'share');
    res.set('Cache-Control', 'no-cache');
    res.render('pages/rel-share', {
      baseUrl,
      title: `${data.card.archetype} · ${data.card.names} | Wobazi`,
      description: data.card.description,
      canonical: `/r/${data.share.token}`,
      noindex: true,
      ogImage: `${baseUrl}/r/${data.share.token}/og.png`,
      card: data.card,
      token: data.share.token,
    });
  });

  ['story', 'og'].forEach(format => {
    router.get(`/r/:token/${format}.png`, async (req, res) => {
      const data = publicShare(req.params.token);
      if (!data) return res.status(404).type('text/plain').send('Not found');
      try {
        const png = await cards.get(`p${data.person.id}`, format, data.card);
        res.set('Content-Type', 'image/png');
        res.set('Cache-Control', 'public, max-age=300');
        res.send(png);
      } catch (err) {
        console.error('[relationships] share image failed:', err.message);
        res.status(500).type('text/plain').send('Image unavailable');
      }
    });
  });

  /* ═══════════ Places ═══════════ */

  router.get('/api/rel/place-suggest', async (req, res) => {
    const q = String(req.query.q || '').trim();
    if (q.length < 2 || q.length > 80) return res.json({ places: [] });
    if (!allowPlace(clientIp(req))) return res.json({ places: [] });
    try {
      res.json({ places: await searchPlaces(q, 6) });
    } catch (err) {
      console.error('[relationships] place-suggest', err.message);
      res.json({ places: [] });
    }
  });

  /* ═══════════ Invites ═══════════ */

  function inviteState(inv) {
    if (!inv) return 'missing';
    if (inv.status !== 'open') return inv.status;
    if (Date.parse(inv.expires_at.replace(' ', 'T') + 'Z') < Date.now()) return 'expired';
    return 'open';
  }

  router.post('/api/rel/invites', (req, res) => {
    const gid = requireUser(req, res);
    if (!gid) return;
    if (!allowCreate(gid)) return res.status(429).json({ error: 'Too many invites. Try again later.' });
    if (!qReadingsRow.get(gid)) return res.status(409).json({ error: 'Save your own chart first.', code: 'owner_chart_missing' });
    const body = req.body || {};
    if (!TYPES.includes(body.type)) return res.status(400).json({ error: 'Choose a relationship type.' });
    const tok = token();
    const expires = new Date(Date.now() + INVITE_DAYS * 86400000).toISOString().replace('T', ' ').slice(0, 19);
    db.prepare('INSERT INTO relationship_invites (token, inviter_id, rel_type, invitee_label, expires_at) VALUES (?, ?, ?, ?, ?)')
      .run(tok, gid, body.type, parseName(body.label), expires);
    const first = ownerFirstName(gid);
    res.json({
      ok: true,
      invite: { token: tok, url: `${baseUrl}/i/${tok}`, expiresAt: expires, type: body.type },
      shareText: `${first ? first + ' wants' : 'I want'} to compare charts with you on Wobazi.`,
    });
  });

  router.delete('/api/rel/invites/:token', (req, res) => {
    const gid = requireUser(req, res);
    if (!gid) return;
    const inv = qInvite.get(String(req.params.token || ''));
    if (!inv || inv.inviter_id !== gid) return res.status(404).json({ error: 'Not found' });
    db.prepare("UPDATE relationship_invites SET status = 'cancelled' WHERE id = ? AND status = 'open'").run(inv.id);
    res.json({ ok: true });
  });

  router.get('/i/:token', (req, res) => {
    const inv = qInvite.get(String(req.params.token || ''));
    const state = inviteState(inv);
    const user = res.locals.user;
    if (state === 'accepted' && user && (inv.accepted_by === user.googleId || inv.inviter_id === user.googleId)) {
      return res.redirect(302, '/#relationships');
    }
    if (state !== 'open') return renderGone(res, 'invite');
    const inviterFirst = ownerFirstName(inv.inviter_id) || 'Someone';
    const ownInvite = !!(user && user.googleId === inv.inviter_id);
    const userHasChart = !!(user && qReadingsRow.get(user.googleId));
    res.set('Cache-Control', 'no-store');
    res.render('pages/rel-invite', {
      baseUrl,
      title: `${inviterFirst} invited you to compare charts | Wobazi`,
      description: 'See your Day Master in seconds, then link up to get your compatibility reading.',
      canonical: `/i/${inv.token}`,
      noindex: true,
      inviteToken: inv.token,
      inviterFirst,
      relType: inv.rel_type,
      ownInvite,
      userHasChart,
    });
  });

  function openInvite(tok, res) {
    const inv = qInvite.get(String(tok || ''));
    const state = inviteState(inv);
    if (state !== 'open') {
      res.status(410).json({ error: 'This invite is no longer available.', code: `invite_${state}` });
      return null;
    }
    return inv;
  }

  function teaserFor(chart) {
    const dm = chart.pillars[2].stem;
    const a = dayMasterArchetype(dm.char);
    return { dayMaster: { char: dm.char, element: dm.element, polarity: dm.polarity }, archetype: a };
  }

  router.post('/api/rel/invites/:token/teaser', (req, res) => {
    if (!allowTeaser(clientIp(req))) return res.status(429).json({ error: 'Too many tries. Try again later.' });
    if (!openInvite(req.params.token, res)) return;
    const user = req.session && req.session.user;
    if (req.body && req.body.useSaved && user) {
      const chart = chartFromReadingsRow(qReadingsRow.get(user.googleId));
      if (chart) return res.json({ teaser: teaserFor(chart) });
    }
    const parsed = parseBirthInput(req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });
    res.json({ teaser: teaserFor(chartFromPerson(parsed.value)) });
  });

  router.post('/api/rel/invites/:token/draft', (req, res) => {
    if (!allowTeaser(clientIp(req))) return res.status(429).json({ error: 'Too many tries. Try again later.' });
    const inv = openInvite(req.params.token, res);
    if (!inv) return;
    const body = req.body || {};
    let birth = null;
    if (!body.useSaved) {
      const parsed = parseBirthInput(body);
      if (parsed.error) return res.status(400).json({ error: parsed.error });
      birth = withTz(parsed.value);
    }
    req.session.relInvite = { token: inv.token, name: parseName(body.name), birth, at: Date.now() };
    res.json({ ok: true, signedIn: !!(req.session.user && req.session.user.googleId) });
  });

  router.post('/api/rel/invites/accept', (req, res) => {
    const gid = requireUser(req, res);
    if (!gid) return;
    const draft = req.session.relInvite;
    if (!draft || !draft.token || Date.now() - (draft.at || 0) > 60 * 60 * 1000) {
      req.session.relInvite = null;
      return res.status(400).json({ error: 'No pending invite.', code: 'no_draft' });
    }
    const inv = qInvite.get(draft.token);
    const state = inviteState(inv);
    if (state === 'accepted' && inv.accepted_by === gid) {
      req.session.relInvite = null;
      const mine = db.prepare('SELECT id FROM people WHERE owner_id = ? AND linked_user_id = ?').get(gid, inv.inviter_id);
      return res.json({ ok: true, personId: mine ? mine.id : null, already: true });
    }
    if (state !== 'open') {
      req.session.relInvite = null;
      return res.status(410).json({ error: 'This invite is no longer available.', code: `invite_${state}` });
    }
    if (inv.inviter_id === gid) return res.status(400).json({ error: 'This is your own invite. Send it to someone else.', code: 'own_invite' });
    if (!qReadingsRow.get(inv.inviter_id)) return res.status(410).json({ error: 'This invite is no longer available.', code: 'inviter_chart_missing' });

    const hadChart = !!qReadingsRow.get(gid);
    if (!hadChart && !draft.birth) return res.status(400).json({ error: 'Enter your birth details first.', code: 'no_birth' });

    let myPersonId = null;
    try {
      db.transaction(() => {
        const sessionUser = req.session.user;
        if (!hadChart) {
          const b = draft.birth;
          db.prepare(`
            INSERT INTO readings (google_id, name, year, month, day, hour, minute, birthplace, calendar_type, leap_month,
              lunar_year, lunar_month, lunar_day, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
          `).run(gid, draft.name || sessionUser.name || null, b.year, b.month, b.day, b.hour_known ? b.hour : null,
            b.hour_known ? b.minute : null, b.birthplace, b.calendar_type, b.leap_month, b.lunar_year, b.lunar_month, b.lunar_day);
          recordUserPlace(gid, b);
        }
        const recipientName = firstName(draft.name || (qReadingsRow.get(gid) || {}).name || sessionUser.name) || 'Friend';
        const inviterName = ownerFirstName(inv.inviter_id) || 'Friend';
        const insert = db.prepare(`INSERT INTO people (owner_id, name, rel_type, linked_user_id, invite_token) VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(owner_id, linked_user_id) WHERE linked_user_id IS NOT NULL DO NOTHING`);
        insert.run(inv.inviter_id, inv.invitee_label || recipientName, inv.rel_type, gid, inv.token);
        insert.run(gid, inviterName, inv.rel_type, inv.inviter_id, inv.token);
        db.prepare("UPDATE relationship_invites SET status = 'accepted', accepted_by = ?, accepted_at = datetime('now') WHERE id = ?").run(gid, inv.id);
        myPersonId = db.prepare('SELECT id FROM people WHERE owner_id = ? AND linked_user_id = ?').get(gid, inv.inviter_id).id;
      })();
    } catch (err) {
      console.error('[relationships] accept failed:', err.message);
      return res.status(500).json({ error: 'Could not link accounts. Try again.' });
    }
    req.session.relInvite = null;
    // Start both readings now so they are ready when either side opens them.
    db.prepare('SELECT * FROM people WHERE invite_token = ?').all(inv.token).forEach(p => {
      try { readings.ensure(p); } catch (e) { /* generated on open instead */ }
    });
    res.json({ ok: true, personId: myPersonId, savedChart: !hadChart });
  });

  return router;
}

module.exports = { createRoutes };
