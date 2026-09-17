/* ═══════════════════════════════════════
   WOBAZI — Daily guidance prompt (DO / AVOID / WATCH)
   guidance/prompt.js

   Split out of server.js so the prompt and the reply parsing can be unit tested.
   The Day Master (日主) is always the Day pillar's stem and is stated explicitly:
   the model must never infer it from the year/zodiac element.
═══════════════════════════════════════ */

'use strict';

const bazi = require('../bazi-engine');
const { dayMasterOf, currentLuck, bangkokToday } = require('../oracle/prompt');
const { dayMasterArchetype } = require('../relationships/archetypes');

function calcTenGod(dayMasterEl, dayMasterPolarity, targetEl, targetPolarity) {
  const same = dayMasterEl === targetEl;
  const sameP = dayMasterPolarity === targetPolarity;
  const prod = bazi.PRODUCTION_CYCLE;
  const ctrl = bazi.CONTROL_CYCLE;
  const iIdx = prod.indexOf(dayMasterEl);
  const tIdx = prod.indexOf(targetEl);
  // What I produce
  if (prod[(iIdx + 1) % 5] === targetEl) return sameP ? '食神 Eating God' : '傷官 Hurting Officer';
  // What produces me
  if (prod[(tIdx + 1) % 5] === dayMasterEl) return sameP ? '偏印 Indirect Resource' : '正印 Direct Resource';
  // What I control
  if (ctrl[dayMasterEl] === targetEl) return sameP ? '偏財 Indirect Wealth' : '正財 Direct Wealth';
  // What controls me
  if (ctrl[targetEl] === dayMasterEl) return sameP ? '七殺 Seven Killings' : '正官 Direct Officer';
  // Same element
  if (same) return sameP ? '比肩 Friend' : '劫財 Rob Wealth';
  return 'unknown';
}

/* Daily guidance asks for JSON with English and Chinese for do/avoid/watch. Measured replies
   run 258-342 completion tokens (measured over 6 charts), so the old 300-token cap truncated
   many of them mid-JSON and JSON.parse failed.
   The cap is set well above the worst observed reply; it bounds cost, it is not a target. */
const GUIDANCE_MAX_TOKENS = 900;

/* The model is asked for six flat string keys (do_en, do_zh, …) because a nested bilingual
   object is what it kept mangling: replies came back as {"do":"…","zh":"…"},"avoid":… , which
   is not valid JSON. The client contract is unchanged, so normalise back to {do:{en,zh},…}.
   A correctly nested reply is accepted too. Returns null when anything is missing. */
function normalizeGuidance(g) {
  if (!g || typeof g !== 'object') return null;
  const text = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null);
  const out = {};
  for (const k of ['do', 'avoid', 'watch']) {
    const nested = g[k] && typeof g[k] === 'object' ? g[k] : null;
    const en = text(g[`${k}_en`]) || (nested && text(nested.en));
    const zh = text(g[`${k}_zh`]) || (nested && text(nested.zh));
    if (!en || !zh) return null;
    out[k] = { en, zh };
  }
  return out;
}

/* The running 10-year luck pillar (大运), resolved by the same helper the Oracle uses.
   It needs a birth date and a gender: with either missing we say so rather than let the
   model invent a pillar. `opts.birth` is the signed-in user's saved chart, else what the
   browser sent (server.js birthForLuck). */
function luckLine(birth, todayIso) {
  const l = currentLuck(birth, { iso: todayIso || bangkokToday().iso });
  if (l && l.chars) return `Current 10-year luck pillar (大运): ${l.chars} (${l.element} ${l.animal}), ${l.startYear}–${l.endYear}`;
  if (l && l.before) return `Current 10-year luck pillar (大运): not started yet${l.startYear ? ` (first one starts ${l.startYear})` : ''} — read today from the natal chart alone`;
  return "Current 10-year luck pillar (大运): unknown (no gender or birth date on file) — don't invent one, and don't name a luck pillar in the output";
}

function buildGuidancePrompt(chartData, opts) {
  const { pillars, today, animal, dominantEl, tenGods } = chartData;

  /* Day Master details, from the one shared resolver (oracle/prompt.js). The Day Master is the
     Day pillar's stem and nothing else: with no day pillar we say so rather than defaulting to
     甲 Wood, which silently mislabels the chart. */
  const dayPillar = (pillars || []).find(p => p && p.label === 'Day') || (pillars || [])[2];
  const dm = dayMasterOf(pillars);
  const dmKnown = !!dm;
  const dmEl = dm ? dm.element : null;
  const dmPol = dm ? dm.polarity : null;
  const dmChar = dm ? dm.char : null;
  const dmArch = dm ? dayMasterArchetype(dmChar) : null;

  // Today's Ten God relationship (only meaningful once the Day Master is known)
  const todayTenGod = dmKnown ? calcTenGod(dmEl, dmPol, today.stemElement, today.stemPolarity) : 'unknown';

  // Branch interactions
  const dayBranch = dayPillar?.branch?.animal || 'unknown';
  const clashPairs = {Rat:'Horse',Horse:'Rat',Ox:'Goat',Goat:'Ox',Tiger:'Monkey',Monkey:'Tiger',Rabbit:'Rooster',Rooster:'Rabbit',Dragon:'Dog',Dog:'Dragon',Snake:'Pig',Pig:'Snake'};
  const todayClash = clashPairs[today.animal] || '';
  const branchClashes = [];
  for (const p of pillars) {
    if (p.known && p.branch && clashPairs[p.branch.animal] === today.animal) {
      branchClashes.push(`${p.label} ${p.branch.animal}`);
    }
  }

  // Nobleman (貴人) check — today's branch is in user's compatible animals
  const nobStr = today.nobleman ? 'ACTIVE today' : 'inactive';

  return `You are a BaZi (Four Pillars of Destiny) master generating today's DO / AVOID / WATCH for one specific person.

USER'S CHART:
Day Master (日主): ${dmKnown
    ? `${dmChar} ${dmEl} ${dmPol}${dmArch ? ` — ${dmArch.name.en}` : ''} (the Day pillar's stem; never read the Day Master off any other pillar)`
    : "unknown (no birth day pillar on file) — don't invent one, and don't describe any other stem as the Day Master"}
Year Pillar: ${pillars[0]?.stem?.char || '?'}${pillars[0]?.branch?.char || '?'} (${pillars[0]?.stem?.element || '?'} ${pillars[0]?.branch?.animal || '?'})
Month Pillar: ${pillars[1]?.stem?.char || '?'}${pillars[1]?.branch?.char || '?'} (${pillars[1]?.stem?.element || '?'} ${pillars[1]?.branch?.animal || '?'})
Day Pillar: ${dayPillar?.stem?.char || '?'}${dayPillar?.branch?.char || '?'} (${dmEl || '?'} ${dayBranch}) ← Day Master (日主) is this stem
Hour Pillar: ${pillars[3]?.known ? pillars[3].stem.char + pillars[3].branch.char + ' (' + pillars[3].stem.element + ' ' + pillars[3].branch.animal + ')' : 'Unknown'}
Dominant Element: ${dominantEl}
Zodiac Animal: ${animal}
${luckLine(opts && opts.birth, opts && opts.todayIso)}

TODAY'S DAY PILLAR: ${today.stem}${today.branch} (${today.stemElement} ${today.animal})
Ten God of Today's Stem vs Day Master: ${todayTenGod}
Branch clashes with user's pillars: ${branchClashes.length ? branchClashes.join(', ') : 'None'}
Nobleman (貴人) star: ${nobStr}
Day Force Score: ${today.score}/100
Ten Gods: ${tenGods && tenGods.list ? tenGods.list.map(g => g.en + ' ' + g.percent + '%').join(', ') : (Array.isArray(tenGods) ? tenGods.map(g => g.en + ' ' + g.percent + '%').join(', ') : (tenGods && tenGods.sentence && tenGods.sentence.en) || 'n/a')}

RULES — you MUST follow ALL of these:
1. Return EXACTLY this JSON object, nothing else. Six keys, every value a plain string:
{"do_en":"...","do_zh":"...","avoid_en":"...","avoid_zh":"...","watch_en":"...","watch_zh":"..."}
Do not nest objects, do not add keys, do not wrap the object in anything.

2. Each item MUST reference a specific BaZi mechanism by name (e.g. "your ${todayTenGod} star", "the ${today.animal}-${dayBranch} ${branchClashes.length ? 'clash' : 'relationship'}", "your 貴人 Nobleman star"${dmKnown ? `, "your Day Master's ${dmEl} energy"` : ''}).

3. Each item MUST include a specific time window where relevant (e.g. "before noon", "during ${today.animal} hour", "this morning", "after 3pm").

4. Each item must be IMPOSSIBLE to apply to a different person's chart. If it could appear on anyone's ${dmEl || 'same-element'} day reading, rewrite it.

5. NEVER output generic wellness advice (grounding, hydration, sugar, meditation). NEVER output vague action items ("opportunities aligned with goals").

6. The "do" should be a specific actionable task tied to the Ten God activation or Nobleman star.
7. The "avoid" should warn about a specific risk created by today's pillar interaction with their chart.
8. The "watch" should flag a specific energy shift or timing window based on branch interactions.

9. Chinese translations must be natural, not machine-translated.
10. Keep each item to 1-2 sentences max.`;
}

module.exports = { buildGuidancePrompt, normalizeGuidance, calcTenGod, luckLine, GUIDANCE_MAX_TOKENS };
