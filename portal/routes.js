/* ═══════════════════════════════════════
   WOBAZI — Portal Routes
   portal/routes.js
   - POST /api/portal/snapshots             save today's reading (first write wins)
   - GET  /api/portal/history               paged archive, newest first (with journal)
   - GET  /api/portal/history/months        months that have readings
   - GET  /api/portal/history/dates         read + noted dates within one month
   - GET  /api/portal/history/:date         one stored reading (with journal)
   - PUT  /api/portal/journal/:date         private note + reaction for a stored reading
   - GET  /api/portal/summary               account + continuity numbers
   - GET  /api/portal/export?format=json|md download readings, notes, birth data
   - POST /api/portal/delete-account        irreversible; body { confirm: "DELETE" }
═══════════════════════════════════════ */

'use strict';

const express = require('express');

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_RE = /^\d{4}-\d{2}$/;
const MAX_HTML = 40000;
const MAX_SUMMARY = 8000;
const MAX_NOTE = 2000;
const PAGE_MAX = 50;
const REACTIONS = ['accurate', 'off', 'unsure'];

function utcMidnight(now) {
  const d = new Date(now);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/* The client sends its local date; accept only yesterday/today/tomorrow in UTC terms,
   so history can't be backfilled with invented days. */
function isPlausibleToday(date) {
  const t = Date.parse(date + 'T00:00:00Z');
  if (Number.isNaN(t)) return false;
  return Math.abs(t - utcMidnight(Date.now())) <= 86400000;
}

function addDays(date, n) {
  return new Date(Date.parse(date + 'T00:00:00Z') + n * 86400000).toISOString().slice(0, 10);
}

function parseSummary(row) {
  try { return JSON.parse(row.summary || '{}'); } catch { return {}; }
}

function journalOf(row) {
  if (row.j_note == null && row.j_reaction == null) return null;
  return { note: row.j_note || '', reaction: row.j_reaction || null, updatedAt: row.j_updated_at || null };
}

function tableExists(db, name) {
  return !!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(name);
}

const REACTION_LABEL = { accurate: 'Accurate', off: 'Off', unsure: 'Unsure' };

function toMarkdown(data) {
  const lines = [];
  const a = data.account || {};
  lines.push(`# Wobazi export — ${a.name || 'My readings'}`, '');
  lines.push(`Exported ${data.exportedAt}${a.memberSince ? ` · Member since ${a.memberSince.slice(0, 10)}` : ''}`, '');
  lines.push('Your notes are private to you. This file is your copy.', '');

  const b = data.birthChart;
  if (b) {
    lines.push('## Birth data', '');
    if (b.name) lines.push(`- Name: ${b.name}`);
    const cal = b.calendar_type === 'lunar'
      ? `Lunar ${b.lunar_year}-${b.lunar_month}-${b.lunar_day}${b.leap_month ? ' (leap month)' : ''} → Solar ${b.year}-${b.month}-${b.day}`
      : `Solar ${b.year}-${b.month}-${b.day}`;
    lines.push(`- Date: ${cal}`);
    if (b.hour != null) lines.push(`- Time: ${String(b.hour).padStart(2, '0')}:${String(b.minute || 0).padStart(2, '0')}`);
    if (b.birthplace) lines.push(`- Birthplace: ${b.birthplace}`);
    if (b.gender) lines.push(`- Gender: ${b.gender}`);
    lines.push('');
  }

  lines.push(`## Daily readings (${data.readings.length})`, '');
  data.readings.forEach(r => {
    const s = r.summary || {};
    const head = [s.pillar, s.pillarLabel].filter(Boolean).join(' ');
    const score = s.score != null ? ` · ${s.score}` : '';
    lines.push(`### ${r.date}${head ? ` — ${head}` : ''}${score}${s.verdict ? ` ${s.verdict}` : ''}`, '');
    if (s.heroText && s.heroText.en) lines.push(s.heroText.en, '');
    (s.guidance || []).forEach(g => { if (g.en) lines.push(`- **${g.key}:** ${g.en}`); });
    if ((s.guidance || []).length) lines.push('');
    if (r.journal) {
      if (r.journal.reaction) lines.push(`**Your reaction:** ${REACTION_LABEL[r.journal.reaction] || r.journal.reaction}`, '');
      if (r.journal.note) lines.push('**Your note:**', '', r.journal.note.split('\n').map(l => `> ${l}`).join('\n'), '');
    }
  });
  return lines.join('\n');
}

function createRoutes(db) {
  const router = express.Router();

  /* Cookie sessions outlive the SQLite file (a fresh disk after a deploy leaves a signed-in
     cookie with no users row). Restore the row from the session instead of bouncing the user. */
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

  const insertSnapshot = db.prepare(`
    INSERT OR IGNORE INTO reading_snapshots (google_id, date, summary, strip_html, hero_html)
    VALUES (?, ?, ?, ?, ?)
  `);
  const JOURNAL_COLS = 'j.note AS j_note, j.reaction AS j_reaction, j.updated_at AS j_updated_at';
  const JOURNAL_JOIN = 'LEFT JOIN journal_entries j ON j.google_id = s.google_id AND j.date = s.date';

  router.post('/api/portal/snapshots', (req, res) => {
    const gid = requireUser(req, res);
    if (!gid) return;
    const { date, summary, stripHtml, heroHtml } = req.body || {};
    if (!DATE_RE.test(date || '') || !isPlausibleToday(date)) {
      return res.status(400).json({ error: 'Invalid date' });
    }
    if (typeof stripHtml !== 'string' || typeof heroHtml !== 'string'
      || stripHtml.length > MAX_HTML || heroHtml.length > MAX_HTML) {
      return res.status(400).json({ error: 'Invalid reading' });
    }
    if (/<script|javascript:/i.test(stripHtml + heroHtml)) {
      return res.status(400).json({ error: 'Invalid reading' });
    }
    const summaryStr = JSON.stringify(summary && typeof summary === 'object' ? summary : {});
    if (summaryStr.length > MAX_SUMMARY) return res.status(400).json({ error: 'Invalid reading' });

    const info = insertSnapshot.run(gid, date, summaryStr, stripHtml, heroHtml);
    res.json({ ok: true, created: info.changes > 0 });
  });

  router.get('/api/portal/history', (req, res) => {
    const gid = requireUser(req, res);
    if (!gid) return;
    const limit = Math.min(PAGE_MAX, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const before = req.query.before;
    if (before && !DATE_RE.test(before)) return res.status(400).json({ error: 'Invalid cursor' });

    const rows = before
      ? db.prepare(`SELECT s.date, s.summary, s.strip_html, ${JOURNAL_COLS} FROM reading_snapshots s ${JOURNAL_JOIN}
          WHERE s.google_id = ? AND s.date < ? ORDER BY s.date DESC LIMIT ?`).all(gid, before, limit + 1)
      : db.prepare(`SELECT s.date, s.summary, s.strip_html, ${JOURNAL_COLS} FROM reading_snapshots s ${JOURNAL_JOIN}
          WHERE s.google_id = ? ORDER BY s.date DESC LIMIT ?`).all(gid, limit + 1);

    const more = rows.length > limit;
    const items = rows.slice(0, limit).map(r => ({
      date: r.date, summary: parseSummary(r), stripHtml: r.strip_html, journal: journalOf(r),
    }));
    res.json({ items, next: more ? items[items.length - 1].date : null });
  });

  router.get('/api/portal/history/months', (req, res) => {
    const gid = requireUser(req, res);
    if (!gid) return;
    const months = db.prepare(`
      SELECT substr(date, 1, 7) AS month, COUNT(*) AS count
      FROM reading_snapshots WHERE google_id = ?
      GROUP BY month ORDER BY month DESC
    `).all(gid);
    res.json({ months });
  });

  router.get('/api/portal/history/dates', (req, res) => {
    const gid = requireUser(req, res);
    if (!gid) return;
    const month = req.query.month;
    if (!MONTH_RE.test(month || '')) return res.status(400).json({ error: 'Invalid month' });
    const rows = db.prepare(`
      SELECT s.date, ${JOURNAL_COLS} FROM reading_snapshots s ${JOURNAL_JOIN}
      WHERE s.google_id = ? AND s.date >= ? AND s.date <= ? ORDER BY s.date
    `).all(gid, month + '-01', month + '-31');
    res.json({
      dates: rows.map(r => r.date),
      noted: rows.filter(r => journalOf(r)).map(r => r.date),
    });
  });

  router.get('/api/portal/history/:date', (req, res) => {
    const gid = requireUser(req, res);
    if (!gid) return;
    const { date } = req.params;
    if (!DATE_RE.test(date)) return res.status(400).json({ error: 'Invalid date' });
    const row = db.prepare(`
      SELECT s.date, s.summary, s.strip_html, s.hero_html, s.created_at, ${JOURNAL_COLS}
      FROM reading_snapshots s ${JOURNAL_JOIN} WHERE s.google_id = ? AND s.date = ?
    `).get(gid, date);
    if (!row) return res.status(404).json({ error: 'No reading found for this date' });
    res.json({
      date: row.date,
      summary: parseSummary(row),
      stripHtml: row.strip_html,
      heroHtml: row.hero_html,
      createdAt: row.created_at,
      journal: journalOf(row),
    });
  });

  router.put('/api/portal/journal/:date', (req, res) => {
    const gid = requireUser(req, res);
    if (!gid) return;
    const { date } = req.params;
    if (!DATE_RE.test(date)) return res.status(400).json({ error: 'Invalid date' });
    const body = req.body || {};
    const note = typeof body.note === 'string' ? body.note.slice(0, MAX_NOTE) : '';
    const reaction = REACTIONS.includes(body.reaction) ? body.reaction : null;
    if (body.reaction != null && body.reaction !== '' && !reaction) {
      return res.status(400).json({ error: 'Invalid reaction' });
    }
    const snap = db.prepare('SELECT 1 FROM reading_snapshots WHERE google_id = ? AND date = ?').get(gid, date);
    if (!snap) return res.status(404).json({ error: 'No reading found for this date' });

    if (!note.trim() && !reaction) {
      db.prepare('DELETE FROM journal_entries WHERE google_id = ? AND date = ?').run(gid, date);
      return res.json({ ok: true, journal: null });
    }
    db.prepare(`
      INSERT INTO journal_entries (google_id, date, note, reaction)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(google_id, date) DO UPDATE SET
        note = excluded.note, reaction = excluded.reaction, updated_at = datetime('now')
    `).run(gid, date, note, reaction);
    res.json({ ok: true, journal: { note, reaction } });
  });

  router.get('/api/portal/summary', (req, res) => {
    const gid = requireUser(req, res);
    if (!gid) return;
    const user = db.prepare('SELECT name, email, avatar, created_at FROM users WHERE google_id = ?').get(gid);
    if (!user) return res.status(401).json({ error: 'Not logged in' });

    const today = DATE_RE.test(req.query.today || '') && isPlausibleToday(req.query.today)
      ? req.query.today
      : new Date().toISOString().slice(0, 10);
    const from30 = addDays(today, -29);

    const totals = db.prepare(`
      SELECT COUNT(*) AS total, MIN(date) AS first, MAX(date) AS last,
        SUM(CASE WHEN date >= ? AND date <= ? THEN 1 ELSE 0 END) AS last30,
        SUM(CASE WHEN date = ? THEN 1 ELSE 0 END) AS today
      FROM reading_snapshots WHERE google_id = ?
    `).get(from30, today, today, gid);
    const notes = db.prepare(`
      SELECT COUNT(*) AS noted,
        SUM(CASE WHEN reaction = 'accurate' THEN 1 ELSE 0 END) AS accurate,
        SUM(CASE WHEN reaction = 'off' THEN 1 ELSE 0 END) AS off,
        SUM(CASE WHEN reaction = 'unsure' THEN 1 ELSE 0 END) AS unsure
      FROM journal_entries WHERE google_id = ?
    `).get(gid);
    const hasChart = !!db.prepare('SELECT 1 FROM readings WHERE google_id = ?').get(gid);

    res.json({
      account: {
        name: user.name, email: user.email, avatar: user.avatar,
        memberSince: user.created_at, provider: 'google',
      },
      hasChart,
      readings: {
        total: totals.total || 0,
        first: totals.first || null,
        last: totals.last || null,
        last30: totals.last30 || 0,
        today: !!totals.today,
      },
      journal: {
        noted: notes.noted || 0,
        accurate: notes.accurate || 0,
        off: notes.off || 0,
        unsure: notes.unsure || 0,
      },
    });
  });

  router.get('/api/portal/export', (req, res) => {
    const gid = requireUser(req, res);
    if (!gid) return;
    const user = db.prepare('SELECT name, email, created_at FROM users WHERE google_id = ?').get(gid);
    if (!user) return res.status(401).json({ error: 'Not logged in' });
    const birth = db.prepare('SELECT * FROM readings WHERE google_id = ?').get(gid) || null;
    if (birth) { delete birth.google_id; delete birth.monthly_forecasts; }
    const rows = db.prepare(`
      SELECT s.date, s.summary, s.created_at, ${JOURNAL_COLS}
      FROM reading_snapshots s ${JOURNAL_JOIN} WHERE s.google_id = ? ORDER BY s.date DESC
    `).all(gid);
    const chat = db.prepare('SELECT messages FROM oracle_chats WHERE google_id = ?').get(gid);
    let oracleChat = [];
    try { oracleChat = chat ? JSON.parse(chat.messages) : []; } catch { oracleChat = []; }

    const data = {
      exportedAt: new Date().toISOString(),
      account: { name: user.name, email: user.email, memberSince: user.created_at, signIn: 'Google' },
      birthChart: birth,
      readings: rows.map(r => ({ date: r.date, savedAt: r.created_at, summary: parseSummary(r), journal: journalOf(r) })),
      oracleChat,
    };
    const stamp = new Date().toISOString().slice(0, 10);
    if (req.query.format === 'md') {
      res.set('Content-Type', 'text/markdown; charset=utf-8');
      res.set('Content-Disposition', `attachment; filename="wobazi-export-${stamp}.md"`);
      return res.send(toMarkdown(data));
    }
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.set('Content-Disposition', `attachment; filename="wobazi-export-${stamp}.json"`);
    res.send(JSON.stringify(data, null, 2));
  });

  router.post('/api/portal/delete-account', (req, res) => {
    const gid = requireUser(req, res);
    if (!gid) return;
    if (!req.body || req.body.confirm !== 'DELETE') {
      return res.status(400).json({ error: 'Type DELETE to confirm' });
    }
    const wipe = db.transaction(id => {
      db.prepare('DELETE FROM journal_entries WHERE google_id = ?').run(id);
      db.prepare('DELETE FROM reading_snapshots WHERE google_id = ?').run(id);
      if (tableExists(db, 'daily_readings')) db.prepare('DELETE FROM daily_readings WHERE user_id = ?').run(id);
      db.prepare('DELETE FROM oracle_chats WHERE google_id = ?').run(id);
      db.prepare('DELETE FROM readings WHERE google_id = ?').run(id);
      // Legacy express-session store (pre cookie-session) may still hold this user's profile.
      if (tableExists(db, 'sessions')) {
        const cols = db.prepare('PRAGMA table_info(sessions)').all().map(c => c.name);
        if (cols.includes('sess')) db.prepare('DELETE FROM sessions WHERE sess LIKE ?').run(`%"googleId":"${id.replace(/[%_"]/g, '')}"%`);
      }
      db.prepare('DELETE FROM users WHERE google_id = ?').run(id);
    });
    try {
      wipe(gid);
    } catch (err) {
      console.error('[Portal] delete-account failed:', err.message);
      return res.status(500).json({ error: 'Could not delete account' });
    }
    req.session = null;
    res.json({ ok: true });
  });

  return router;
}

module.exports = { createRoutes };
