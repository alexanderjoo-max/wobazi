/* ═══════════════════════════════════════
   WOBAZI — LLM output validation
   relationships/validate.js
   Returns { ok, errors, value }. value is a cleaned copy safe to store.
═══════════════════════════════════════ */

'use strict';

const LIMITS = {
  description: 200,
  watch_out: 160,
  line: 150,
  title: 70,
  pattern: 220,
  tip: 190,
  section: 220,
};

/* Tone rules: no fatalism, no mysticism, gender-neutral, no dates. */
const BANNED = [
  /\bdoom(ed)?\b/i, /\bdestin(ed|y)\b/i, /\bfated?\b/i, /\bsoul ?mates?\b/i, /\bcursed?\b/i,
  /\bkarma\b/i, /\bnever work\b/i, /\btoxic\b/i, /\bincompatible\b/i, /\bdivorce\b/i,
  /\bbreak ?up\b/i, /\bspirit(s|ual)?\b/i, /\bthe universe\b/i,
  /\b(he|she|him|her|his|hers|himself|herself|husband|wife|boyfriend|girlfriend)\b/i,
  /\b(19|20)\d{2}\b/,
];

const SECTION_KEYS = {
  romantic: ['you_need', 'they_offer', 'they_need', 'you_offer'],
  business: ['pitch', 'triggers', 'decision_style'],
};

function text(v, max, path, errors) {
  if (typeof v !== 'string' || !v.trim()) {
    errors.push(`${path}: missing`);
    return '';
  }
  let s = v.replace(/\s+/g, ' ').trim();
  if (s.length > max * 1.5) {
    errors.push(`${path}: too long (${s.length})`);
    return '';
  }
  if (s.length > max) {
    const cut = s.slice(0, max);
    const stop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('; '), cut.lastIndexOf(', '));
    s = (stop > max * 0.6 ? cut.slice(0, stop + 1) : cut.replace(/\s+\S*$/, '')).replace(/[,;]$/, '.');
  }
  const hit = BANNED.find(re => re.test(s));
  if (hit) errors.push(`${path}: banned wording ${hit}`);
  return s;
}

/**
 * @param {object} raw    parsed LLM JSON
 * @param {object} ctx    { type, candidateIds: string[] }
 */
function validateReading(raw, ctx) {
  const errors = [];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, errors: ['root: not an object'], value: null };
  }
  const h = raw.headline || {};
  const s = raw.scores || {};
  const value = {
    headline: {
      description: text(h.description, LIMITS.description, 'headline.description', errors),
      watch_out: text(h.watch_out, LIMITS.watch_out, 'headline.watch_out', errors),
    },
    scores: {
      element: { line: text(s.element && s.element.line, LIMITS.line, 'scores.element.line', errors) },
      day_master: { line: text(s.day_master && s.day_master.line, LIMITS.line, 'scores.day_master.line', errors) },
      branches: { line: text(s.branches && s.branches.line, LIMITS.line, 'scores.branches.line', errors) },
    },
    friction: [],
  };

  const ids = ctx.candidateIds || [];
  const min = Math.min(3, ids.length);
  const items = Array.isArray(raw.friction) ? raw.friction : [];
  const used = new Set();
  items.forEach((f, i) => {
    if (!f || typeof f !== 'object') { errors.push(`friction[${i}]: not an object`); return; }
    if (!ids.includes(f.id)) { errors.push(`friction[${i}].id: unknown "${f.id}"`); return; }
    if (used.has(f.id)) { errors.push(`friction[${i}].id: duplicate`); return; }
    used.add(f.id);
    value.friction.push({
      id: f.id,
      title: text(f.title, LIMITS.title, `friction[${i}].title`, errors),
      pattern: text(f.pattern, LIMITS.pattern, `friction[${i}].pattern`, errors),
      tip: text(f.tip, LIMITS.tip, `friction[${i}].tip`, errors),
    });
  });
  if (value.friction.length < min) errors.push(`friction: need at least ${min}, got ${value.friction.length}`);
  if (value.friction.length > 5) value.friction = value.friction.slice(0, 5);

  const keys = SECTION_KEYS[ctx.type];
  if (keys) {
    const sec = raw[ctx.type] || {};
    value[ctx.type] = {};
    keys.forEach(k => { value[ctx.type][k] = text(sec[k], LIMITS.section, `${ctx.type}.${k}`, errors); });
  }

  const ok = errors.length === 0;
  return { ok, errors, value: ok ? value : null };
}

module.exports = { validateReading, BANNED, LIMITS };
