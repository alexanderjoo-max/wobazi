/* ═══════════════════════════════════════
   WOBAZI — Relationship reading prompts
   relationships/prompt.js

   The model gets computed facts only: no names, no birth dates. It writes "{name}"
   wherever the other person is meant; the client substitutes the saved name at render,
   so renaming someone never needs a new reading.
═══════════════════════════════════════ */

'use strict';

const TYPE_FRAME = {
  romantic: 'a romantic partnership',
  friend: 'a friendship',
  family: 'a family relationship',
  business: 'a working or business relationship',
};

const GOD_ROLE = {
  friend: 'a peer who mirrors them', rob_wealth: 'a peer who competes with them',
  eating_god: 'an outlet for their ease and creativity', hurting_officer: 'an outlet for their sharp, critical expression',
  direct_wealth: 'someone they steadily take care of', indirect_wealth: 'someone they chase and want to win over',
  direct_officer: 'a steady source of structure and standards', seven_killings: 'a source of pressure and challenge',
  direct_resource: 'a source of support and reassurance', indirect_resource: 'an unconventional source of support',
};

function systemPrompt(type) {
  return `You write relationship readings for Wobazi, a practical personality app built on BaZi (Four Pillars).

VOICE
- Behavioral and practical, like a good Myers-Briggs team report. Plain English, short sentences.
- Describe what each person tends to DO ("you speed up, {name} slows down"), not what fate holds.
- Friction is always a manageable pattern with a concrete fix. Never fatalistic.
- Never use: doomed, destined, fate, soulmate, karma, toxic, incompatible, "never work", break up, divorce, spiritual, the universe.
- No Chinese terms, no pillar or element jargon in the wording unless it helps a plain reader. No emojis.

PEOPLE
- The reader is "you". The other person is always written exactly as {name} (with the braces). Never invent a name.
- Gender-neutral only: never he, she, him, her, his, husband, wife, boyfriend, girlfriend. Use {name}, they, them.
- Do not use gendered spouse-star logic. Partner needs come from the element and role facts given.

DATA
- Use only the facts provided. Do not calculate or change any score, pillar or archetype.
- This is ${TYPE_FRAME[type] || 'a relationship'}; frame every line for that context.
- If confidence is "lower", do not mention it; the app shows its own note.

OUTPUT
Return ONLY a JSON object, no markdown, with exactly this shape:
{
  "headline": { "description": "≤160 chars, what this pairing is like day to day", "watch_out": "≤130 chars, the one pattern to watch" },
  "scores": {
    "element": { "line": "≤120 chars, what the element balance means in practice" },
    "day_master": { "line": "≤120 chars, how the core temperaments interact" },
    "branches": { "line": "≤120 chars, where things flow easily vs. where they snag" }
  },
  "friction": [ { "id": "<one of the candidate ids>", "title": "≤60 chars", "pattern": "≤180 chars, behavioral: you do X, {name} does Y", "tip": "≤150 chars, one practical thing to try" } ]${type === 'romantic' ? `,
  "romantic": { "you_need": "≤180", "they_offer": "≤180", "they_need": "≤180", "you_offer": "≤180" }` : ''}${type === 'business' ? `,
  "business": { "pitch": "≤180, how to pitch {name}", "triggers": "≤180, what sets {name} off", "decision_style": "≤180, how {name} decides" }` : ''}
}
Friction: one item per candidate id, in the given order, between 3 and 5 items, using each id at most once.`;
}

function userPrompt(facts) {
  const s = facts.scores;
  const payload = {
    relationship_type: facts.type,
    confidence: facts.confidence,
    archetype: { name: facts.archetype.name.en, summary: facts.archetype.desc },
    you: {
      day_master: `${facts.you.dayMaster.char} — ${facts.you.dayMaster.polarity} ${facts.you.dayMaster.element} (${facts.you.dayMaster.archetype}), the Day pillar's stem`,
      strongest_role_family: facts.you.family,
    },
    name: {
      day_master: `${facts.them.dayMaster.char} — ${facts.them.dayMaster.polarity} ${facts.them.dayMaster.element} (${facts.them.dayMaster.archetype}), the Day pillar's stem`,
      strongest_role_family: facts.them.family,
    },
    scores: {
      element_complementarity: { score: s.element.score, name_brings_you: s.element.theyBring, you_bring_name: s.element.youBring, both_heavy_in: s.element.sharedExcess },
      day_master_dynamic: {
        score: s.dayMaster.score, label: s.dayMaster.label.en,
        name_is_for_you: GOD_ROLE[s.dayMaster.theirRoleForYou], you_are_for_name: GOD_ROLE[s.dayMaster.yourRoleForThem],
        stems_combine: s.dayMaster.combine, stems_clash: s.dayMaster.stemClash,
      },
      branch_harmony_vs_clash: { score: s.branches.score, harmony: s.branches.harmony, clash: s.branches.clash, tone: s.branches.tone },
    },
    friction_candidates: facts.friction.map(f => ({
      id: f.id, kind: f.kind, where_for_you: f.areas.you, where_for_name: f.areas.them,
    })),
  };
  if (facts.spousePalace) {
    const sp = facts.spousePalace;
    payload.partner_needs = {
      you_need: sp.you.needs, you_offer: sp.you.offers,
      name_needs: sp.them.needs, name_offers: sp.them.offers,
      name_naturally_meets_your_need: sp.them.otherMatchesPalace,
      you_naturally_meet_name_need: sp.you.otherMatchesPalace,
      close_life_areas_relation: sp.palaceRelation,
    };
  }
  if (facts.workStyle) {
    const w = facts.workStyle;
    payload.work_style_of_name = { pitch_hint: w.pitchHint, trigger_hint: w.triggerHint, decision_hint: w.decisionHint };
  }
  return `Write the reading for these facts. In the facts, "name" means {name}.\n${JSON.stringify(payload, null, 2)}`;
}

module.exports = { systemPrompt, userPrompt };
