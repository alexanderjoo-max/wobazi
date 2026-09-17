/* ═══════════════════════════════════════
   WOBAZI — Pair facts (deterministic)
   relationships/scoring.js

   Everything numeric or structural about a pair is computed here from the two charts.
   The LLM only receives these facts and writes wording; it never calculates.
   "a" is always the reader (the list owner), "b" the other person.
═══════════════════════════════════════ */

'use strict';

const bazi = require('../bazi-engine');
const { dayMasterArchetype, pairArchetype } = require('./archetypes');

const FACTS_VERSION = 1;
const ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
const PILLAR_WEIGHT = { Year: 0.5, Month: 0.7, Day: 1.0, Hour: 0.5 };
const PILLAR_AREA = {
  Year: 'social circle and background',
  Month: 'work habits and daily routines',
  Day: 'private self and close relationships',
  Hour: 'long-term plans and ideas',
};
const RELATION_VALUE = { combine: 1.0, harmony: 0.7, same: 0.3, clash: -1.0, punish: -0.8, harm: -0.6 };
const STEM_COMBINE = { '甲': '己', '己': '甲', '乙': '庚', '庚': '乙', '丙': '辛', '辛': '丙', '丁': '壬', '壬': '丁', '戊': '癸', '癸': '戊' };
const STEM_CLASH = { '甲': '庚', '庚': '甲', '乙': '辛', '辛': '乙', '丙': '壬', '壬': '丙', '丁': '癸', '癸': '丁' };

/* Gender-neutral role language keyed by Ten God family. */
const FAMILY_NEEDS = {
  peer: 'equality, independence and a partner who acts like a teammate',
  output: 'room to express themselves and to be appreciated for it',
  wealth: 'tangible care, reliability and plans they can see',
  officer: 'clear commitments, structure and mutual respect',
  resource: 'patience, reassurance and a feeling of being backed',
};
const ELEMENT_OFFERS = {
  Wood: 'encouragement, growth and forward plans',
  Fire: 'warmth, visibility and enthusiasm',
  Earth: 'steadiness, reliability and practical care',
  Metal: 'clarity, standards and follow-through',
  Water: 'adaptability, insight and good listening',
};
const ELEMENT_PITCH = {
  Wood: 'Show where the idea grows next; lead with vision and momentum.',
  Fire: 'Make it visible and exciting; give them a role people will notice.',
  Earth: 'Bring proof, numbers and a low-risk path; avoid surprises.',
  Metal: 'Be precise and structured; state the ask and the standard clearly.',
  Water: 'Offer options and context; let them see the whole picture first.',
};
const ELEMENT_TRIGGERS = {
  Wood: 'feeling boxed in or having growth blocked',
  Fire: 'being ignored or having credit taken',
  Earth: 'sudden changes and unreliable follow-through',
  Metal: 'sloppiness, vague asks and broken rules',
  Water: 'pressure without options or time to think',
};
const FAMILY_DECISION = {
  peer: 'decides independently and wants autonomy over the how',
  output: 'decides quickly on what feels interesting or creative',
  wealth: 'decides on return, cost and practical outcomes',
  officer: 'decides through process, reputation and precedent',
  resource: 'decides slowly and needs context and trust first',
};

function round(n) { return Math.round(n); }
function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

function shares(pillars) {
  const raw = bazi.calcElementsDetailed(pillars);
  const total = ELEMENTS.reduce((s, e) => s + raw[e], 0) || 1;
  const out = {};
  ELEMENTS.forEach(e => { out[e] = raw[e] / total; });
  return out;
}

function familyWeights(pillars) {
  const dm = pillars[2] && pillars[2].stem;
  const prof = bazi.calcTenGodsProfile(pillars, dm);
  const fam = {};
  prof.list.forEach(g => { fam[g.family] = (fam[g.family] || 0) + g.percent; });
  const top = Object.entries(fam).sort((x, y) => y[1] - x[1])[0];
  return { families: fam, top: top ? top[0] : 'peer' };
}

/* ── Element Complementarity ── */
function elementScore(pa, pb) {
  const a = shares(pa);
  const b = shares(pb);
  const IDEAL = 0.2;
  let cover = 0;
  let need = 0;
  const bGivesA = [];
  const aGivesB = [];
  ELEMENTS.forEach(e => {
    const defA = Math.max(0, IDEAL - a[e]);
    const defB = Math.max(0, IDEAL - b[e]);
    const surB = Math.max(0, b[e] - IDEAL);   // what they have to spare
    const surA = Math.max(0, a[e] - IDEAL);   // what you have to spare
    const ca = Math.min(defA, surB);
    const cb = Math.min(defB, surA);
    cover += ca + cb;
    need += defA + defB;
    if (ca > 0.03) bGivesA.push(e);
    if (cb > 0.03) aGivesB.push(e);
  });
  const ratio = need < 0.05 ? 0.6 : cover / need;
  let pile = 0;
  const sharedExcess = [];
  ELEMENTS.forEach(e => {
    const over = Math.max(0, a[e] - 0.3) * Math.max(0, b[e] - 0.3);
    if (over > 0) { pile += over; sharedExcess.push(e); }
  });
  const score = clamp(round(35 + 60 * ratio - pile * 150), 10, 96);
  return { score, theyBring: bGivesA, youBring: aGivesB, sharedExcess, shares: { you: roundShares(a), them: roundShares(b) } };
}

function roundShares(s) {
  const o = {};
  ELEMENTS.forEach(e => { o[e] = Math.round(s[e] * 100); });
  return o;
}

/* ── Day Master Dynamic ── */
const DM_BASE = { same: 66, produces: 72, produced_by: 74, controls: 56, controlled_by: 54, none: 60 };
const DM_LABEL = {
  same: { en: 'Same element', zh: '同气', th: 'ธาตุเดียวกัน' },
  produces: { en: 'You fuel them', zh: '你生对方', th: 'คุณหนุนเขา' },
  produced_by: { en: 'They fuel you', zh: '对方生你', th: 'เขาหนุนคุณ' },
  controls: { en: 'You shape them', zh: '你克对方', th: 'คุณขัดเกลาเขา' },
  controlled_by: { en: 'They shape you', zh: '对方克你', th: 'เขาขัดเกลาคุณ' },
  combine: { en: 'Magnetic pull', zh: '天干相合', th: 'แรงดึงดูด' },
};

function dayMasterScore(pa, pb) {
  const A = pa[2].stem;
  const B = pb[2].stem;
  const link = bazi.elementLink(A.element, B.element);
  let score = DM_BASE[link] != null ? DM_BASE[link] : 60;
  if (link === 'same') score += A.polarity === B.polarity ? -2 : 4;
  const combine = STEM_COMBINE[A.char] === B.char;
  const stemClash = STEM_CLASH[A.char] === B.char;
  if (combine) score += 16;
  if (stemClash) score -= 8;
  const dynamic = combine ? 'combine' : (link === 'none' ? 'same' : link);
  return {
    score: clamp(round(score), 10, 96),
    link,
    dynamic,
    label: DM_LABEL[dynamic],
    combine,
    stemClash,
    theirRoleForYou: bazi.calcTenGod(A.element, A.polarity, B.element, B.polarity),
    yourRoleForThem: bazi.calcTenGod(B.element, B.polarity, A.element, A.polarity),
  };
}

/* ── Branch Harmony vs Clash (every known branch against every other) ── */
function branchScore(pa, pb) {
  let H = 0;
  let C = 0;
  const hits = [];
  pa.forEach(x => {
    if (!x.known) return;
    pb.forEach(y => {
      if (!y.known) return;
      const ai = bazi.BRANCHES.findIndex(br => br.char === x.branch.char);
      const bi = bazi.BRANCHES.findIndex(br => br.char === y.branch.char);
      const rel = bazi.branchRelation(ai, bi);
      const v = RELATION_VALUE[rel];
      if (v == null) return;
      const w = PILLAR_WEIGHT[x.label] * PILLAR_WEIGHT[y.label];
      if (v > 0) H += v * w; else C += -v * w;
      hits.push({ relation: rel, you: x.label, them: y.label, youBranch: x.branch, themBranch: y.branch, value: v * w });
    });
  });
  // Saturating 0–100 scale: one Day↔Day hit ≈ 39, three strong hits ≈ 75.
  const harmony = round(100 * (1 - Math.exp(-H / 2)));
  const clash = round(100 * (1 - Math.exp(-C / 2)));
  const net = clamp(round(55 + 35 * Math.tanh(H - C)), 10, 96);
  const tone = H - C > 0.35 ? 'harmony' : C - H > 0.35 ? 'tension' : 'mixed';
  return { score: net, harmony, clash, tone, hits };
}

/* ── Friction candidates (3–5, ranked) ── */
const BRANCH_KIND = { clash: 'clash', punish: 'punishment', harm: 'harm', combine: 'combination', harmony: 'three-harmony' };

function frictionCandidates(dm, br, el, pa, pb) {
  const list = [];
  const byBranchPair = new Map();
  br.hits.forEach(h => {
    if (h.relation === 'same') return;
    // The same two branches can meet in several pillar pairs; keep the heaviest one.
    const pairKey = `${h.relation}:${h.youBranch.char}${h.themBranch.char}`;
    const prev = byBranchPair.get(pairKey);
    if (prev && Math.abs(prev.value) >= Math.abs(h.value)) return;
    byBranchPair.set(pairKey, h);
  });
  byBranchPair.forEach(h => {
    const kind = BRANCH_KIND[h.relation];
    const id = `${h.relation}-${h.you.toLowerCase()}-${h.them.toLowerCase()}`;
    list.push({
      id,
      kind,
      pillars: { you: h.you, them: h.them },
      branches: { you: `${h.youBranch.char} ${h.youBranch.animal}`, them: `${h.themBranch.char} ${h.themBranch.animal}` },
      areas: { you: PILLAR_AREA[h.you], them: PILLAR_AREA[h.them] },
      // Tension ranks first; combinations are included as "too close / merge" patterns.
      rank: h.value < 0 ? -h.value + 1 : h.value * 0.6,
    });
  });
  if (dm.stemClash) {
    list.push({ id: 'stem-clash', kind: 'day-master clash', pillars: { you: 'Day', them: 'Day' },
      branches: { you: pa[2].stem.char, them: pb[2].stem.char }, areas: { you: PILLAR_AREA.Day, them: PILLAR_AREA.Day }, rank: 1.9 });
  }
  if (dm.link === 'controls' || dm.link === 'controlled_by') {
    list.push({ id: 'dm-control', kind: dm.link === 'controls' ? 'you pressure them' : 'they pressure you',
      pillars: { you: 'Day', them: 'Day' }, branches: { you: pa[2].stem.element, them: pb[2].stem.element },
      areas: { you: 'core temperament', them: 'core temperament' }, rank: 1.2 });
  }
  if (el.sharedExcess.length) {
    list.push({ id: 'element-overload', kind: 'shared excess', pillars: { you: 'All', them: 'All' },
      branches: { you: el.sharedExcess.join('/'), them: el.sharedExcess.join('/') },
      areas: { you: 'overall style', them: 'overall style' }, rank: 0.9 });
  }
  // Always-available fallbacks so every pair has at least three patterns.
  list.push({ id: 'dm-dynamic', kind: `day-master dynamic (${dm.link})`, pillars: { you: 'Day', them: 'Day' },
    branches: { you: pa[2].stem.element, them: pb[2].stem.element }, areas: { you: 'core temperament', them: 'core temperament' }, rank: 0.3 });
  list.push({ id: 'element-gap', kind: 'element balance', pillars: { you: 'All', them: 'All' },
    branches: { you: dominant(el.shares.you), them: dominant(el.shares.them) }, areas: { you: 'overall style', them: 'overall style' }, rank: 0.2 });
  list.push({ id: 'pace', kind: 'pace and energy', pillars: { you: 'Day', them: 'Day' },
    branches: { you: pa[2].stem.polarity, them: pb[2].stem.polarity }, areas: { you: 'pace', them: 'pace' }, rank: 0.1 });

  const seen = new Set();
  return list
    .filter(c => (seen.has(c.id) ? false : seen.add(c.id)))
    .sort((x, y) => y.rank - x.rank)
    .slice(0, 5)
    .map(({ rank, ...c }) => c);
}

function dominant(sharesObj) {
  return Object.entries(sharesObj).sort((x, y) => y[1] - x[1])[0][0];
}

/* ── Romantic: Spouse Palace (Day branch), gender-neutral ── */
function spousePalace(pa, pb) {
  function side(p, other) {
    const dm = p[2].stem;
    const br = p[2].branch;
    const main = (p[2].hidden || []).find(h => h.role === 'main') || p[2].hidden[0];
    const god = bazi.calcTenGod(dm.element, dm.polarity, main.stem.element, main.stem.polarity);
    const family = bazi.TEN_GOD_BY_ID[god].family;
    return {
      palace: `${br.char} ${br.animal}`,
      palaceElement: main.stem.element,
      needs: FAMILY_NEEDS[family],
      needsFamily: family,
      offers: ELEMENT_OFFERS[dm.element],
      otherMatchesPalace: other[2].stem.element === main.stem.element,
    };
  }
  const ai = bazi.BRANCHES.findIndex(b => b.char === pa[2].branch.char);
  const bi = bazi.BRANCHES.findIndex(b => b.char === pb[2].branch.char);
  return { you: side(pa, pb), them: side(pb, pa), palaceRelation: bazi.branchRelation(ai, bi) };
}

/* ── Business: how to work with them ── */
function workStyle(pb) {
  const dm = pb[2].stem;
  const fam = familyWeights(pb);
  return {
    element: dm.element,
    polarity: dm.polarity,
    topFamily: fam.top,
    pitchHint: ELEMENT_PITCH[dm.element],
    triggerHint: ELEMENT_TRIGGERS[dm.element],
    decisionHint: FAMILY_DECISION[fam.top],
  };
}

/**
 * All deterministic facts for a pair.
 * @param {object} a  chart { pillars, hourKnown } — the reader
 * @param {object} b  chart { pillars, hourKnown } — the other person
 * @param {string} type romantic|friend|family|business
 */
function pairFacts(a, b, type) {
  const pa = a.pillars;
  const pb = b.pillars;
  const el = elementScore(pa, pb);
  const dm = dayMasterScore(pa, pb);
  const br = branchScore(pa, pb);
  const archetype = pairArchetype(dm.dynamic, br.tone);
  const facts = {
    version: FACTS_VERSION,
    type,
    confidence: a.hourKnown && b.hourKnown ? 'normal' : 'lower',
    hourUnknown: { you: !a.hourKnown, them: !b.hourKnown },
    archetype,
    you: { dayMaster: stemInfo(pa[2].stem), family: familyWeights(pa).top },
    them: { dayMaster: stemInfo(pb[2].stem), family: familyWeights(pb).top },
    scores: {
      element: { score: el.score, theyBring: el.theyBring, youBring: el.youBring, sharedExcess: el.sharedExcess },
      dayMaster: { score: dm.score, link: dm.link, dynamic: dm.dynamic, label: dm.label, combine: dm.combine,
        stemClash: dm.stemClash, theirRoleForYou: dm.theirRoleForYou, yourRoleForThem: dm.yourRoleForThem },
      branches: { score: br.score, harmony: br.harmony, clash: br.clash, tone: br.tone },
    },
    friction: frictionCandidates(dm, br, el, pa, pb),
  };
  if (type === 'romantic') facts.spousePalace = spousePalace(pa, pb);
  if (type === 'business') facts.workStyle = workStyle(pb);
  return facts;
}

function stemInfo(s) {
  const arch = dayMasterArchetype(s.char);
  return { char: s.char, element: s.element, polarity: s.polarity, archetype: arch ? arch.name.en : null };
}

module.exports = { pairFacts, FACTS_VERSION, elementScore, dayMasterScore, branchScore };
