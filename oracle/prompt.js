/* ═══════════════════════════════════════
   WOBAZI — Oracle system prompt
   oracle/prompt.js

   Built fresh on every request. The model has no clock, so today's date (Asia/Bangkok),
   the annual pillar and the user's running 10-year luck pillar are stated explicitly;
   without them it anchors "next week" to its training data and suggests past dates.
═══════════════════════════════════════ */

'use strict';

/* Day Master archetype catalog (plain data, shared with the relationships readings). */
const { dayMasterArchetype } = require('../relationships/archetypes');

const bazi = require('../bazi-engine');

const TIME_ZONE = 'Asia/Bangkok';
const DAY_MS = 86400000;

/* Today's civil date in Bangkok, independent of the server clock's zone (Render runs UTC). */
function bangkokToday(now) {
  const d = now instanceof Date ? now : new Date(now == null ? Date.now() : now);
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long',
  }).formatToParts(d).map(p => [p.type, p.value]));
  const iso = `${parts.year}-${parts.month}-${parts.day}`;
  return { iso, year: +parts.year, month: +parts.month, day: +parts.day, weekday: parts.weekday };
}

function addDaysIso(iso, n) {
  return new Date(Date.parse(iso + 'T00:00:00Z') + n * DAY_MS).toISOString().slice(0, 10);
}

/* Annual (流年) and day pillars for a Bangkok civil date. Year changes at 立春. */
function currentPillars(today) {
  const r = bazi.calcBaziAccurate({ year: today.year, month: today.month, day: today.day, hour: 12, calendar: 'solar' });
  const gz = p => ({ chars: p.stem.char + p.branch.char, element: p.stem.element, polarity: p.stem.polarity, animal: p.branch.animal });
  return { year: gz(r.pillars[0]), day: gz(r.pillars[2]) };
}

/* Sanitized birth data (solar, month 1-indexed). Returns null unless a real date is present. */
function normalizeBirth(b) {
  if (!b || typeof b !== 'object') return null;
  const num = v => (v === null || v === undefined || v === '' ? null : Number(v));
  const year = num(b.year);
  const month = num(b.month);
  const day = num(b.day);
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return null;
  const hour = num(b.hour);
  const minute = num(b.minute);
  const gender = b.gender === 'M' || b.gender === 'F' ? b.gender : null;
  const twin = b.twin && b.twin.enabled ? { enabled: true, order: b.twin.order === 'younger' ? 'younger' : 'elder', method: b.twin.method === 'hour' ? 'hour' : 'luck' } : null;
  return {
    year, month, day,
    hour: Number.isInteger(hour) && hour >= 0 && hour <= 23 ? hour : null,
    minute: Number.isInteger(minute) && minute >= 0 && minute <= 59 ? minute : 0,
    gender, twin,
  };
}

/* The luck pillar running today. Needs gender (direction of the luck cycle). */
function currentLuck(birth, today) {
  const b = normalizeBirth(birth);
  if (!b || !b.gender) return null;
  try {
    const r = bazi.calcBaziAccurate({
      year: b.year, month: b.month, day: b.day, hour: b.hour, minute: b.minute,
      calendar: 'solar', gender: b.gender, twin: b.twin || undefined,
    });
    if (!r.luck) return null;
    const age = (Date.parse(today.iso + 'T00:00:00Z') - Date.UTC(b.year, b.month - 1, b.day)) / (365.2425 * DAY_MS);
    const p = bazi.luckPillarAt(r.luck, age);
    if (!p) return { before: true, startYear: r.luck.pillars[0] && r.luck.pillars[0].startYear };
    return {
      chars: p.stem.char + p.branch.char,
      element: p.stem.element,
      animal: p.branch.animal,
      startYear: p.startYear,
      endYear: p.endYear,
    };
  } catch (e) {
    return null;
  }
}

function dateContextBlock(ctx) {
  const t = ctx.today;
  const p = ctx.pillars;
  const nextMonday = addDaysIso(t.iso, ((8 - new Date(t.iso + 'T00:00:00Z').getUTCDay()) % 7) || 7);
  const lines = [
    'CURRENT DATE (authoritative — use this, never your training data):',
    `Today is ${t.weekday}, ${t.iso} (Asia/Bangkok).`,
    `Annual pillar (流年) for ${t.year}: ${p.year.chars} (${p.year.polarity} ${p.year.element} ${p.year.animal}). Today's day pillar: ${p.day.chars}.`,
  ];
  const l = ctx.luck;
  if (l && l.chars) lines.push(`User's current 10-year luck pillar (大运): ${l.chars} (${l.element} ${l.animal}), ${l.startYear}–${l.endYear}.`);
  else if (l && l.before) lines.push(`User's first 10-year luck pillar has not started yet${l.startYear ? ` (starts ${l.startYear})` : ''}.`);
  else lines.push("User's luck pillar: unknown (no gender or birth date on file) — don't invent one.");
  lines.push(
    `"This week" means ${t.iso} to ${addDaysIso(t.iso, 6)}; "next week" means ${nextMonday} to ${addDaysIso(nextMonday, 6)}.`,
    `Every date you suggest must be on or after ${t.iso}. Never suggest a past date or a year earlier than ${t.year}.`
  );
  return lines.join('\n');
}

/* The Day Master (日主) is the Day pillar's stem — never the year stem. The client sends
   pillars in [Year, Month, Day, Hour] order with labels; prefer the label, fall back to index 2. */
function dayMasterOf(pillars) {
  const list = Array.isArray(pillars) ? pillars : [];
  const dayPillar = list.find(p => p && p.label === 'Day') || list[2];
  if (!dayPillar || dayPillar.known === false || !dayPillar.stem || !dayPillar.stem.char) return null;
  const s = dayPillar.stem;
  return { char: s.char, element: s.element || 'unknown', polarity: s.polarity || 'unknown' };
}

function buildSystemPrompt(chartData, opts) {
  const { animal, element, polarity, dominantEl, fortune, pillars, today, tenGods } = chartData || {};
  const now = opts && opts.now;
  const ctxToday = bangkokToday(now);
  const ctx = {
    today: ctxToday,
    pillars: currentPillars(ctxToday),
    luck: currentLuck(opts && opts.birth, ctxToday),
  };

  const pillarStr = (pillars || []).map(p => {
    if (!p.known) return `${p.label}: unknown`;
    const mark = p.label === 'Day' ? ' ← Day Master (日主) is this stem' : '';
    return `${p.label}: ${p.stem.char} ${p.branch.char} (${p.stem.element} ${p.stem.polarity} / ${p.branch.animal})${mark}`;
  }).join('\n');

  const dm = dayMasterOf(pillars);
  const dmArch = dm ? dayMasterArchetype(dm.char) : null;
  const dmStr = dm
    ? `Day Master (日主): ${dm.char} ${dm.element} ${dm.polarity}${dmArch ? ` — ${dmArch.name.en}: ${dmArch.line.en}` : ''} — this is the user's Day Master, taken from the Day pillar's stem.`
    : "Day Master (日主): unknown (no birth day pillar on file) — don't invent one.";

  const todayStr = today
    ? `Today's Day Pillar: ${today.stem} ${today.branch} (${today.animal} day)\nClash with user: ${today.isClash ? 'YES — friction day' : today.isCompat ? 'NO — harmonious day' : 'Neutral day'}\nDay Force Score: ${today.score}/100\nNobleman Status: ${today.nobleman ? 'Active — helpful people energy today' : 'Inactive'}`
    : '';

  return `You are the Wobazi Oracle — a direct, authoritative BaZi destiny advisor. You interpret Chinese metaphysics (Four Pillars of Destiny) with confidence and clarity.

${dateContextBlock(ctx)}

USER'S BAZI CHART:
${dmStr}
Animal (生肖): ${animal}
Year element (生肖/zodiac profile, NOT the Day Master): ${element} (${polarity})
Dominant Element: ${dominantEl}
Fortune Scores — Love: ${fortune?.love}, Career: ${fortune?.career}, Health: ${fortune?.health}, Wealth: ${fortune?.wealth}

FOUR PILLARS:
${pillarStr}

${todayStr}

TEN GODS (十神 vs Day Master, visible stem 1.0 / main hidden 0.5 / mid 0.3 / residual 0.2):
${tenGods && tenGods.list ? tenGods.list.map(g => `${g.en} ${g.zh}: ${g.percent}%`).join(', ') : (Array.isArray(tenGods) ? tenGods.map(g => `${g.en} ${g.zh}: ${g.percent}%`).join(', ') : 'n/a')}
${tenGods && tenGods.sentence ? tenGods.sentence.en : ''}

RULES:
- Speak as an oracle — direct, confident, no hedging or disclaimers
- Keep responses concise (3-5 sentences max)
- Reference the user's specific chart data in your answers
- When timing matters, include date suggestions as [DATE:YYYY-MM-DD] tags, always on or after today (${ctx.today.iso})
- When giving a clear verdict, include exactly one: [VERDICT:favorable], [VERDICT:defer], or [VERDICT:neutral]
- The Day Master is the Day pillar's stem; never describe the user's Day Master as any other element (the year/zodiac element above is not the Day Master)
- Use the Five Element relationships (producing/controlling cycles) in your analysis
- Reference today's day pillar energy when relevant to "should I do X today" questions
- Never say "I'm just an AI" or add disclaimers — you ARE the Oracle`;
}

module.exports = { buildSystemPrompt, dayMasterOf, bangkokToday, currentPillars, currentLuck, normalizeBirth, addDaysIso, TIME_ZONE };
