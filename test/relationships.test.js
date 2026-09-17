/* ═══════════════════════════════════════
   WoBazi relationships: deterministic facts, validation, LLM fallback,
   account wipe/export, share-card privacy.
   node --test test/relationships.test.js
═══════════════════════════════════════ */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const Database = require('better-sqlite3');

const { parseBirthInput, chartFromPerson, chartFromReadingsRow, firstName } = require('../relationships/chart');
const { pairFacts } = require('../relationships/scoring');
const { validateReading } = require('../relationships/validate');
const { generateJSON } = require('../relationships/llm');
const { systemPrompt, userPrompt } = require('../relationships/prompt');
const { cardData } = require('../relationships/share-card');
const { resolveTimezone } = require('../relationships/tz');
const schema = require('../relationships/schema');
const account = require('../relationships/account');
const { entitlements } = require('../relationships/flags');

const A = chartFromPerson({ year: 1995, month: 4, day: 29, hour_known: 1, hour: 8, minute: 45 });
const B = chartFromPerson({ year: 1988, month: 2, day: 14, hour_known: 1, hour: 14, minute: 0 });
const B_NOHOUR = chartFromPerson({ year: 1988, month: 2, day: 14, hour_known: 0 });

function goodText(facts) {
  const out = {
    headline: { description: 'You set the pace and {name} keeps things steady.', watch_out: 'You push for speed when {name} wants time to think.' },
    scores: {
      element: { line: '{name} brings the grounding you often skip.' },
      day_master: { line: 'You tend to lead, {name} tends to back you.' },
      branches: { line: 'Daily routines flow; big plans need a check-in.' },
    },
    friction: facts.friction.slice(0, 3).map(f => ({ id: f.id, title: 'Pace gap', pattern: 'You speed up, {name} slows down.', tip: 'Agree on a deadline before starting.' })),
  };
  if (facts.type === 'romantic') out.romantic = { you_need: 'Reliability.', they_offer: 'Steadiness.', they_need: 'Space.', you_offer: 'Clarity.' };
  if (facts.type === 'business') out.business = { pitch: 'Bring numbers.', triggers: 'Surprises.', decision_style: 'Slow and careful.' };
  return out;
}

describe('chart input', () => {
  it('matches the engine reference chart (1995-04-29 08:45 → 乙亥 庚辰 庚寅 庚辰)', () => {
    assert.deepEqual(A.pillars.map(p => p.stem.char + p.branch.char), ['乙亥', '庚辰', '庚寅', '庚辰']);
  });
  it('unknown hour gives three pillars', () => {
    assert.equal(B_NOHOUR.pillars[3].known, false);
    assert.equal(B_NOHOUR.hourKnown, false);
  });
  it('converts lunar input to solar before charting', () => {
    const r = parseBirthInput({ calendar: 'lunar', year: 1995, month: 4, day: 29, hourKnown: false });
    assert.deepEqual([r.value.year, r.value.month, r.value.day], [1995, 5, 28]);
    assert.equal(r.value.lunar_month, 4);
  });
  it('rejects impossible dates and missing times', () => {
    assert.ok(parseBirthInput({ year: 1995, month: 2, day: 30 }).error);
    assert.ok(parseBirthInput({ year: 1995, month: 2, day: 3, hourKnown: true, hour: 25 }).error);
  });
  it('readings rows with hour null are hour-unknown (same as the app)', () => {
    const c = chartFromReadingsRow({ year: 1995, month: 4, day: 29, hour: null });
    assert.equal(c.hourKnown, false);
  });
  it('first names strip surnames, emoji and markup', () => {
    assert.equal(firstName('Alex Joo'), 'Alex');
    assert.equal(firstName('<b>Sam</b> 🙂'), 'b');
    assert.equal(firstName('  สมชาย ใจดี'), 'สมชาย');
  });
});

describe('pair facts', () => {
  it('is deterministic', () => {
    assert.deepEqual(pairFacts(A, B, 'friend'), pairFacts(A, B, 'friend'));
  });
  it('scores stay in range and friction has 3–5 unique candidates', () => {
    for (const t of ['romantic', 'friend', 'family', 'business']) {
      const f = pairFacts(A, B, t);
      for (const k of ['element', 'dayMaster', 'branches']) {
        assert.ok(f.scores[k].score >= 10 && f.scores[k].score <= 96, `${t} ${k}`);
      }
      assert.ok(f.friction.length >= 3 && f.friction.length <= 5);
      assert.equal(new Set(f.friction.map(x => x.id)).size, f.friction.length);
      assert.ok(f.archetype.name.en);
    }
  });
  it('adds only the sections for the type', () => {
    assert.ok(pairFacts(A, B, 'romantic').spousePalace);
    assert.equal(pairFacts(A, B, 'romantic').workStyle, undefined);
    assert.ok(pairFacts(A, B, 'business').workStyle);
    const fr = pairFacts(A, B, 'family');
    assert.equal(fr.spousePalace, undefined);
    assert.equal(fr.workStyle, undefined);
  });
  it('marks lower confidence when either hour is unknown', () => {
    assert.equal(pairFacts(A, B, 'friend').confidence, 'normal');
    assert.equal(pairFacts(A, B_NOHOUR, 'friend').confidence, 'lower');
  });
  it('prompt carries no names or birth dates', () => {
    const u = userPrompt(pairFacts(A, B, 'romantic'));
    assert.ok(!/1995|1988|Alex|Sam/.test(u));
    assert.ok(/\{name\}/.test(systemPrompt('romantic')));
  });
});

describe('validation', () => {
  const facts = pairFacts(A, B, 'romantic');
  const ctx = { type: 'romantic', candidateIds: facts.friction.map(f => f.id) };
  it('accepts a well-formed reading', () => {
    const r = validateReading(goodText(facts), ctx);
    assert.ok(r.ok, r.errors.join('; '));
  });
  it('rejects unknown friction ids, missing sections, gendered and fatalistic wording', () => {
    const bad = goodText(facts);
    bad.friction[0].id = 'made-up';
    assert.ok(!validateReading(bad, ctx).ok);
    const noSec = goodText(facts);
    delete noSec.romantic;
    assert.ok(!validateReading(noSec, ctx).ok);
    const gendered = goodText(facts);
    gendered.headline.description = 'She will calm you down.';
    assert.ok(!validateReading(gendered, ctx).ok);
    const doom = goodText(facts);
    doom.headline.watch_out = 'This pairing is doomed.';
    assert.ok(!validateReading(doom, ctx).ok);
  });
});

describe('LLM fallback', () => {
  const facts = pairFacts(A, B, 'business');
  const req = {
    system: systemPrompt('business'), user: userPrompt(facts),
    validate: o => validateReading(o, { type: 'business', candidateIds: facts.friction.map(f => f.id) }),
  };
  const gemini = text => ({ getGenerativeModel: () => ({ generateContent: async () => ({ response: { text: () => text } }) }) });
  const deepseek = impl => ({ chat: { completions: { create: impl } } });

  it('uses DeepSeek when its JSON validates', async () => {
    const r = await generateJSON({
      deepseek: deepseek(async () => ({ choices: [{ message: { content: JSON.stringify(goodText(facts)) } }] })),
      genAI: gemini('{}'),
    }, req);
    assert.equal(r.model, 'deepseek');
  });
  it('falls back to Gemini on unparseable DeepSeek output', async () => {
    const r = await generateJSON({
      deepseek: deepseek(async () => ({ choices: [{ message: { content: 'Sure! Here is your reading' } }] })),
      genAI: gemini('```json\n' + JSON.stringify(goodText(facts)) + '\n```'),
    }, req);
    assert.equal(r.model, 'gemini');
  });
  it('falls back to Gemini when DeepSeek errors', async () => {
    const r = await generateJSON({
      deepseek: deepseek(async () => { throw new Error('503'); }),
      genAI: gemini(JSON.stringify(goodText(facts))),
    }, req);
    assert.equal(r.model, 'gemini');
  });
  it('throws when both fail validation', async () => {
    await assert.rejects(generateJSON({
      deepseek: deepseek(async () => ({ choices: [{ message: { content: '{"headline":{}}' } }] })),
      genAI: gemini('{"nope":true}'),
    }, req), /deepseek: invalid.*gemini: invalid/);
  });
});

describe('share card privacy', () => {
  const facts = pairFacts(A, B, 'romantic');
  it('hides the other name by default with a type-based fallback', () => {
    assert.equal(cardData({ ownerFirst: 'Alex', personFirst: 'Sam', showName: false, type: 'romantic', facts }).names, 'Alex & their partner');
    assert.equal(cardData({ ownerFirst: 'Alex', personFirst: 'Sam', showName: false, type: 'friend', facts }).names, 'Alex & a friend');
    assert.equal(cardData({ ownerFirst: 'Alex', personFirst: 'Sam', showName: false, type: 'family', facts }).names, 'Alex & a family member');
    assert.equal(cardData({ ownerFirst: 'Alex', personFirst: 'Sam', showName: false, type: 'business', facts }).names, 'Alex & a business partner');
    assert.equal(cardData({ ownerFirst: 'Alex', personFirst: 'Sam', showName: true, type: 'business', facts }).names, 'Alex & Sam');
  });
  it('contains no birth data or pillars', () => {
    const s = JSON.stringify(cardData({ ownerFirst: 'Alex', personFirst: 'Sam', showName: true, type: 'romantic', facts }));
    assert.ok(!/1995|1988|08:45|[甲乙丙丁戊己庚辛壬癸]/.test(s));
  });
});

describe('timezone recording', () => {
  it('single-zone countries resolve exactly; multi-zone by longitude', () => {
    assert.deepEqual(resolveTimezone('TH', 100.5), { tz: 'Asia/Bangkok', source: 'country' });
    assert.equal(resolveTimezone('US', -118.24).tz, 'America/Los_Angeles');
    assert.equal(resolveTimezone('ID', 106.8).tz, 'Asia/Jakarta');
  });
});

describe('paywall flag', () => {
  it('is off by default', () => {
    const prev = process.env.RELATIONSHIPS_PAYWALL;
    delete process.env.RELATIONSHIPS_PAYWALL;
    const e = entitlements(null, 'x');
    assert.equal(e.paywall, false);
    assert.equal(e.maxPeople, null);
    assert.ok(e.friction && e.typeSections);
    process.env.RELATIONSHIPS_PAYWALL = 'on';
    assert.equal(entitlements(null, 'x').maxPeople, 1);
    if (prev === undefined) delete process.env.RELATIONSHIPS_PAYWALL; else process.env.RELATIONSHIPS_PAYWALL = prev;
  });
});

describe('schema up/down', () => {
  it('is idempotent and reversible', () => {
    const db = new Database(':memory:');
    db.exec('CREATE TABLE users (google_id TEXT PRIMARY KEY, name TEXT)');
    schema.up(db);
    schema.up(db);
    const names = () => db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(r => r.name);
    schema.TABLES.forEach(t => assert.ok(names().includes(t), t));
    schema.down(db);
    schema.TABLES.forEach(t => assert.ok(!names().includes(t), t));
    assert.ok(names().includes('users'));
  });
});

describe('account wipe + export', () => {
  function seed() {
    const db = new Database(':memory:');
    db.pragma('foreign_keys = ON');
    db.exec(`CREATE TABLE users (google_id TEXT PRIMARY KEY, name TEXT);
      CREATE TABLE readings (google_id TEXT PRIMARY KEY REFERENCES users(google_id), name TEXT, year INT, month INT, day INT, hour INT);`);
    schema.up(db);
    ['u1', 'u2', 'u3'].forEach(u => db.prepare('INSERT INTO users VALUES (?, ?)').run(u, u));
    const add = db.prepare(`INSERT INTO people (owner_id, name, rel_type, year, month, day, linked_user_id) VALUES (?, ?, 'friend', ?, ?, ?, ?)`);
    add.run('u1', 'Manual', 1990, 1, 1, null);
    add.run('u1', 'U2', null, null, null, 'u2');
    add.run('u2', 'U1', null, null, null, 'u1');
    add.run('u3', 'Other', 1991, 2, 2, null);
    db.prepare("INSERT INTO relationship_readings (person_id, input_hash, status) VALUES (1,'h','ready'),(2,'h','ready'),(3,'h','ready'),(4,'h','ready')").run();
    db.prepare("INSERT INTO relationship_share_links (token, person_id, owner_id) VALUES ('t1',1,'u1'),('t3',3,'u2'),('t4',4,'u3')").run();
    db.prepare("INSERT INTO relationship_invites (token, inviter_id, rel_type, expires_at, status, accepted_by) VALUES ('i1','u1','friend','2099-01-01','accepted','u2'),('i2','u1','family','2099-01-01','open',NULL),('i3','u3','friend','2099-01-01','open',NULL)").run();
    return db;
  }

  it('removes the user\'s people, rows linked to them elsewhere, readings, links and invites; leaves others', () => {
    const db = seed();
    const ids = db.transaction(() => {
      const r = account.wipeUser(db, 'u1');
      db.prepare('DELETE FROM users WHERE google_id = ?').run('u1');
      return r;
    })();
    assert.deepEqual(ids.sort(), [1, 2, 3]);
    assert.deepEqual(db.prepare('SELECT id FROM people').all().map(r => r.id), [4]);
    assert.deepEqual(db.prepare('SELECT person_id FROM relationship_readings').all().map(r => r.person_id), [4]);
    assert.deepEqual(db.prepare('SELECT token FROM relationship_share_links').all().map(r => r.token), ['t4']);
    assert.deepEqual(db.prepare('SELECT token FROM relationship_invites').all().map(r => r.token), ['i3']);
  });

  it('rolls back everything if the surrounding transaction fails', () => {
    const db = seed();
    assert.throws(() => db.transaction(() => {
      account.wipeUser(db, 'u1');
      throw new Error('later step failed');
    })());
    assert.equal(db.prepare('SELECT COUNT(*) n FROM people').get().n, 4);
    assert.equal(db.prepare('SELECT COUNT(*) n FROM relationship_share_links').get().n, 3);
  });

  it('export includes only birth data the user typed', () => {
    const db = seed();
    const ex = account.exportUser(db, 'u1');
    assert.equal(ex.people.length, 2);
    const manual = ex.people.find(p => p.name === 'Manual');
    const linked = ex.people.find(p => p.name === 'U2');
    assert.ok(manual.birth);
    assert.equal(linked.birth, undefined);
    assert.equal(linked.linkedAccount, true);
  });
});
