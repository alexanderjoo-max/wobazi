/* ═══════════════════════════════════════
   WOBAZI — Advanced BaZi Helpers
   batch/bazi-helpers.js
   Calculations beyond the core engine:
   nobleman stars, wealth/resource stars,
   clashes, combinations, luck pillars,
   favorable/unfavorable elements.
═══════════════════════════════════════ */

'use strict';

const bazi = require('../bazi-engine');

const { STEMS, BRANCHES, PRODUCTION_CYCLE, CONTROL_CYCLE, ZODIAC } = bazi;

/* ── Ten God Relationship ── */
function calcTenGod(dayMasterEl, dayMasterPol, targetEl, targetPol) {
  const sameP = dayMasterPol === targetPol;
  const prod = PRODUCTION_CYCLE;
  const ctrl = CONTROL_CYCLE;
  const iIdx = prod.indexOf(dayMasterEl);
  const tIdx = prod.indexOf(targetEl);
  if (prod[(iIdx + 1) % 5] === targetEl) return sameP ? 'Eating God' : 'Hurting Officer';
  if (prod[(tIdx + 1) % 5] === dayMasterEl) return sameP ? 'Indirect Resource' : 'Direct Resource';
  if (ctrl[dayMasterEl] === targetEl) return sameP ? 'Indirect Wealth' : 'Direct Wealth';
  if (ctrl[targetEl] === dayMasterEl) return sameP ? 'Seven Killings' : 'Direct Officer';
  if (dayMasterEl === targetEl) return sameP ? 'Friend' : 'Rob Wealth';
  return 'unknown';
}

/* ── Nobleman Stars (天乙贵人) ──
   Based on Day Stem, certain branches are nobleman branches. */
const NOBLEMAN_MAP = {
  '甲': ['Ox', 'Goat'],
  '戊': ['Ox', 'Goat'],
  '乙': ['Rat', 'Monkey'],
  '己': ['Rat', 'Monkey'],
  '丙': ['Pig', 'Rooster'],
  '丁': ['Pig', 'Rooster'],
  '壬': ['Snake', 'Rabbit'],
  '癸': ['Snake', 'Rabbit'],
  '庚': ['Horse', 'Tiger'],
  '辛': ['Horse', 'Tiger'],
};

function getNoblemanBranches(dayStemChar) {
  return NOBLEMAN_MAP[dayStemChar] || [];
}

function isNobleman(dayStemChar, branchAnimal) {
  return getNoblemanBranches(dayStemChar).includes(branchAnimal);
}

/* ── Wealth Stars ──
   Direct Wealth = element the Day Master controls, opposite polarity.
   Indirect Wealth = element the Day Master controls, same polarity. */
function getWealthElement(dayMasterEl) {
  return CONTROL_CYCLE[dayMasterEl];
}

/* ── Resource Stars ──
   The element that produces the Day Master. */
function getResourceElement(dayMasterEl) {
  const idx = PRODUCTION_CYCLE.indexOf(dayMasterEl);
  return PRODUCTION_CYCLE[(idx - 1 + 5) % 5];
}

/* ── Branch Clashes (六冲) ── */
const CLASH_PAIRS = {
  Rat: 'Horse', Horse: 'Rat',
  Ox: 'Goat', Goat: 'Ox',
  Tiger: 'Monkey', Monkey: 'Tiger',
  Rabbit: 'Rooster', Rooster: 'Rabbit',
  Dragon: 'Dog', Dog: 'Dragon',
  Snake: 'Pig', Pig: 'Snake',
};

function getBranchClash(animal) {
  return CLASH_PAIRS[animal] || null;
}

/* ── Six Harmonies (六合) ── */
const SIX_HARMONIES = {
  Rat: 'Ox', Ox: 'Rat',
  Tiger: 'Pig', Pig: 'Tiger',
  Rabbit: 'Dog', Dog: 'Rabbit',
  Dragon: 'Rooster', Rooster: 'Dragon',
  Snake: 'Monkey', Monkey: 'Snake',
  Horse: 'Goat', Goat: 'Horse',
};

function getSixHarmony(animal) {
  return SIX_HARMONIES[animal] || null;
}

/* ── Three Harmonies (三合) ── */
const THREE_HARMONIES = [
  ['Monkey', 'Rat', 'Dragon'],    // Water frame
  ['Snake', 'Rooster', 'Ox'],     // Metal frame
  ['Tiger', 'Horse', 'Dog'],      // Fire frame
  ['Pig', 'Rabbit', 'Goat'],      // Wood frame
];

function getThreeHarmonyGroup(animal) {
  return THREE_HARMONIES.find(g => g.includes(animal)) || [];
}

/* ── Find active clashes between today's branch and user's pillars ── */
function findClashes(userPillars, todayBranchAnimal) {
  const clashes = [];
  for (const p of userPillars) {
    if (p.known && p.branch && CLASH_PAIRS[p.branch.animal] === todayBranchAnimal) {
      clashes.push(`${p.label} Pillar ${p.branch.animal}`);
    }
  }
  return clashes;
}

/* ── Find active combinations between today's branch and user's pillars ── */
function findCombinations(userPillars, todayBranchAnimal) {
  const combos = [];
  for (const p of userPillars) {
    if (!p.known || !p.branch) continue;
    // Six Harmony
    if (SIX_HARMONIES[p.branch.animal] === todayBranchAnimal) {
      combos.push(`${p.label} ${p.branch.animal}-${todayBranchAnimal} Six Harmony`);
    }
    // Three Harmony partial
    const group = getThreeHarmonyGroup(todayBranchAnimal);
    if (group.includes(p.branch.animal) && p.branch.animal !== todayBranchAnimal) {
      combos.push(`${p.label} ${p.branch.animal}-${todayBranchAnimal} Three Harmony partial`);
    }
  }
  return combos;
}

/* ── Favorable / Unfavorable Elements ──
   Simplified strength analysis based on element counts.
   Weak Day Master → favorable: same + resource; unfavorable: output + wealth + power
   Strong Day Master → favorable: output + wealth + power; unfavorable: same + resource */
function analyzeFavorableElements(dayMasterEl, elementCounts) {
  const total = Object.values(elementCounts).reduce((a, b) => a + b, 0);
  const dmCount = elementCounts[dayMasterEl] || 0;
  const resourceEl = getResourceElement(dayMasterEl);
  const resourceCount = elementCounts[resourceEl] || 0;
  const supportRatio = (dmCount + resourceCount) / total;

  const prod = PRODUCTION_CYCLE;
  const idx = prod.indexOf(dayMasterEl);
  const outputEl = prod[(idx + 1) % 5];
  const wealthEl = CONTROL_CYCLE[dayMasterEl];
  const powerEl = Object.keys(CONTROL_CYCLE).find(k => CONTROL_CYCLE[k] === dayMasterEl);

  if (supportRatio < 0.4) {
    // Weak Day Master — needs support
    return {
      favorable: [dayMasterEl, resourceEl],
      unfavorable: [outputEl, wealthEl, powerEl].filter(Boolean),
    };
  } else {
    // Strong Day Master — needs draining
    return {
      favorable: [outputEl, wealthEl, powerEl].filter(Boolean),
      unfavorable: [dayMasterEl, resourceEl],
    };
  }
}

/* ── Luck Pillar Calculation (simplified) ──
   Direction: Yang male / Yin female = forward; else backward
   Start age approximation based on birth day within the month.
   Each luck pillar = 10 years, derived from month pillar stem/branch. */
function calcLuckPillar(userGender, yearStemPolarity, monthStemIdx, monthBranchIdx, userAge) {
  // Direction
  const isYang = yearStemPolarity === 'Yang';
  const isMale = userGender === 'M';
  const forward = (isYang && isMale) || (!isYang && !isMale);

  // Approximate start age (simplified: use 4 as average)
  const startAge = 4;
  if (userAge < startAge) {
    return { stem: STEMS[monthStemIdx], branch: BRANCHES[monthBranchIdx], startAge, endAge: startAge + 9 };
  }

  const pillarIndex = Math.floor((userAge - startAge) / 10);
  const direction = forward ? 1 : -1;

  const stemIdx = ((monthStemIdx + direction * (pillarIndex + 1)) % 10 + 10) % 10;
  const branchIdx = ((monthBranchIdx + direction * (pillarIndex + 1)) % 12 + 12) % 12;

  const lpStart = startAge + pillarIndex * 10;
  const lpEnd = lpStart + 9;

  return {
    stem: STEMS[stemIdx],
    branch: BRANCHES[branchIdx],
    startAge: lpStart,
    endAge: lpEnd,
  };
}

/* ── Check if today's branch activates wealth star for user ── */
function hasWealthStar(dayMasterEl, dayMasterPol, todayStem) {
  const wealthEl = getWealthElement(dayMasterEl);
  if (todayStem.element === wealthEl) {
    return todayStem.polarity === dayMasterPol ? 'Indirect Wealth' : 'Direct Wealth';
  }
  return null;
}

/* ── Check if today's branch activates resource star for user ── */
function hasResourceStar(dayMasterEl, dayMasterPol, todayStem) {
  const resourceEl = getResourceElement(dayMasterEl);
  if (todayStem.element === resourceEl) {
    return todayStem.polarity === dayMasterPol ? 'Indirect Resource' : 'Direct Resource';
  }
  return null;
}

/* ── Calculate today's pillar from a Date object ── */
function calcTodayPillar(date) {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  const pillars = bazi.calcBazi(y, m, d, null);
  const dayPillar = pillars[2]; // Day pillar
  return dayPillar;
}

module.exports = {
  calcTenGod,
  getNoblemanBranches,
  isNobleman,
  getWealthElement,
  getResourceElement,
  getBranchClash,
  getSixHarmony,
  getThreeHarmonyGroup,
  findClashes,
  findCombinations,
  analyzeFavorableElements,
  calcLuckPillar,
  hasWealthStar,
  hasResourceStar,
  calcTodayPillar,
  CLASH_PAIRS,
  SIX_HARMONIES,
  THREE_HARMONIES,
};
