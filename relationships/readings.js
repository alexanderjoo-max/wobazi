/* ═══════════════════════════════════════
   WOBAZI — Pair reading cache + generation
   relationships/readings.js

   A reading is generated once per (person, input_hash) and cached. Facts are stored
   the moment generation starts, so the headline archetype and scores render
   immediately while the wording is written in the background.
═══════════════════════════════════════ */

'use strict';

const crypto = require('crypto');
const { chartFromPerson, chartFromReadingsRow, chartKey } = require('./chart');
const { pairFacts, FACTS_VERSION } = require('./scoring');
const { systemPrompt, userPrompt } = require('./prompt');
const { validateReading } = require('./validate');
const { generateJSON } = require('./llm');

const STALE_PENDING_MS = 2 * 60 * 1000;
const PROMPT_VERSION = 1;

function createReadings(db, clients, opts) {
  const log = (opts && opts.log) || console;
  const running = new Map();   // person_id → hash currently generating in this process

  const qReadingsRow = db.prepare('SELECT * FROM readings WHERE google_id = ?');
  const qReading = db.prepare('SELECT * FROM relationship_readings WHERE person_id = ?');
  const upsertPending = db.prepare(`
    INSERT INTO relationship_readings (person_id, input_hash, status, facts, text, model, error, attempts, started_at, generated_at)
    VALUES (?, ?, 'pending', ?, NULL, NULL, NULL, 1, datetime('now'), NULL)
    ON CONFLICT(person_id) DO UPDATE SET
      input_hash = excluded.input_hash, status = 'pending', facts = excluded.facts, text = NULL, model = NULL,
      error = NULL, attempts = CASE WHEN relationship_readings.input_hash = excluded.input_hash
        THEN relationship_readings.attempts + 1 ELSE 1 END,
      started_at = datetime('now'), generated_at = NULL
  `);
  const markReady = db.prepare(`UPDATE relationship_readings SET status = 'ready', text = ?, model = ?, error = NULL,
    generated_at = datetime('now') WHERE person_id = ? AND input_hash = ?`);
  const markError = db.prepare(`UPDATE relationship_readings SET status = 'error', model = 'none', error = ?,
    generated_at = datetime('now') WHERE person_id = ? AND input_hash = ?`);

  function ownerChart(googleId) {
    return chartFromReadingsRow(qReadingsRow.get(googleId));
  }

  function personChart(person) {
    if (person.linked_user_id) return chartFromReadingsRow(qReadingsRow.get(person.linked_user_id));
    return chartFromPerson(person);
  }

  function inputs(person) {
    const a = ownerChart(person.owner_id);
    if (!a) return { error: 'owner_chart_missing' };
    const b = personChart(person);
    if (!b) return { error: 'person_chart_missing' };
    const hash = crypto.createHash('sha1').update(JSON.stringify({
      f: FACTS_VERSION, p: PROMPT_VERSION, t: person.rel_type,
      a: chartKey(a), ah: a.hourKnown, b: chartKey(b), bh: b.hourKnown,
    })).digest('hex');
    return { a, b, hash };
  }

  function parseRow(row) {
    if (!row) return null;
    let facts = {};
    let text = null;
    try { facts = JSON.parse(row.facts || '{}'); } catch (e) { facts = {}; }
    try { text = row.text ? JSON.parse(row.text) : null; } catch (e) { text = null; }
    return { status: row.status, hash: row.input_hash, facts, text, model: row.model, error: row.error,
      attempts: row.attempts, startedAt: row.started_at, generatedAt: row.generated_at };
  }

  function start(person, inp) {
    const facts = pairFacts(inp.a, inp.b, person.rel_type);
    upsertPending.run(person.id, inp.hash, JSON.stringify(facts));
    running.set(person.id, inp.hash);
    const candidateIds = facts.friction.map(f => f.id);
    generateJSON(clients, {
      system: systemPrompt(person.rel_type),
      user: userPrompt(facts),
      validate: obj => validateReading(obj, { type: person.rel_type, candidateIds }),
    }).then(({ value, model }) => {
      markReady.run(JSON.stringify(value), model, person.id, inp.hash);
      log.log(`[relationships] reading ${person.id} ready via ${model}`);
    }).catch(err => {
      markError.run(String(err.message || err).slice(0, 1000), person.id, inp.hash);
      log.error(`[relationships] reading ${person.id} failed: ${err.message}`);
    }).finally(() => {
      if (running.get(person.id) === inp.hash) running.delete(person.id);
    });
  }

  /**
   * Current reading for a person; starts generation when missing, stale (birth data or
   * type changed), or stuck pending after a restart. Errors are not retried automatically.
   * @returns {{ status, facts, text, ... } | { error }}
   */
  function ensure(person, opts) {
    const retry = !!(opts && opts.retry);
    const inp = inputs(person);
    if (inp.error) return { error: inp.error };
    const row = parseRow(qReading.get(person.id));
    const sameInput = row && row.hash === inp.hash;
    const isRunning = running.get(person.id) === inp.hash;
    const stuck = row && row.status === 'pending' && !isRunning
      && Date.now() - Date.parse((row.startedAt || '').replace(' ', 'T') + 'Z') > STALE_PENDING_MS;

    if (!row || !sameInput || stuck || (retry && row.status === 'error')) {
      if (!isRunning) start(person, inp);
      return parseRow(qReading.get(person.id));
    }
    return row;
  }

  function peek(personId) {
    return parseRow(qReading.get(personId));
  }

  return { ensure, peek, ownerChart, personChart };
}

module.exports = { createReadings };
