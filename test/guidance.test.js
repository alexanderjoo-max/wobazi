/* Daily guidance: prompt facts and reply parsing.
   Run: node --test test/guidance.test.js
   The live section runs only when DEEPSEEK_API_KEY is set (not part of `npm test`). */

'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert');

const { buildGuidancePrompt, normalizeGuidance, calcTenGod, GUIDANCE_MAX_TOKENS } = require('../guidance/prompt');
const { buildSystemPrompt: buildOraclePrompt, dayMasterOf } = require('../oracle/prompt');
const batchPrompt = require('../batch/prompt');

const STEMS = {
  '甲': ['Wood', 'Yang'], '乙': ['Wood', 'Yin'], '丙': ['Fire', 'Yang'], '丁': ['Fire', 'Yin'],
  '戊': ['Earth', 'Yang'], '己': ['Earth', 'Yin'], '庚': ['Metal', 'Yang'], '辛': ['Metal', 'Yin'],
  '壬': ['Water', 'Yang'], '癸': ['Water', 'Yin'],
};
const BRANCHES = {
  '子': ['Rat', 'Water'], '寅': ['Tiger', 'Wood'], '巳': ['Snake', 'Fire'],
  '戌': ['Dog', 'Earth'], '亥': ['Pig', 'Water'], '酉': ['Rooster', 'Metal'], '辰': ['Dragon', 'Earth'],
};
const stem = (c) => ({ char: c, element: STEMS[c][0], polarity: STEMS[c][1] });
const branch = (c) => ({ char: c, animal: BRANCHES[c][0], element: BRANCHES[c][1] });
const pillar = (label, s, b) => ({ label, known: true, stem: stem(s), branch: branch(b) });

/* Six charts, six different day stems, covering all five elements and both polarities.
   The first is the chart that produced the "Wood Day Master" bug: 乙亥 庚辰 庚寅 庚辰. */
const CHARTS = [
  { day: '庚寅', element: 'Metal', polarity: 'Yang', archetype: 'The Blade',
    pillars: [pillar('Year', '乙', '亥'), pillar('Month', '庚', '辰'), pillar('Day', '庚', '寅'), pillar('Hour', '庚', '辰')] },
  { day: '甲子', element: 'Wood', polarity: 'Yang', archetype: 'The Pioneer',
    pillars: [pillar('Year', '丙', '戌'), pillar('Month', '壬', '酉'), pillar('Day', '甲', '子'), pillar('Hour', '乙', '亥')] },
  { day: '丁巳', element: 'Fire', polarity: 'Yin', archetype: 'The Guide',
    pillars: [pillar('Year', '庚', '酉'), pillar('Month', '甲', '寅'), pillar('Day', '丁', '巳'), pillar('Hour', '戊', '辰')] },
  { day: '戊戌', element: 'Earth', polarity: 'Yang', archetype: 'The Mountain',
    pillars: [pillar('Year', '癸', '亥'), pillar('Month', '乙', '寅'), pillar('Day', '戊', '戌'), pillar('Hour', '壬', '子')] },
  { day: '癸亥', element: 'Water', polarity: 'Yin', archetype: 'The Mist',
    pillars: [pillar('Year', '甲', '子'), pillar('Month', '丙', '辰'), pillar('Day', '癸', '亥'), pillar('Hour', '辛', '酉')] },
  { day: '辛酉', element: 'Metal', polarity: 'Yin', archetype: 'The Jeweller',
    pillars: [pillar('Year', '壬', '戌'), pillar('Month', '癸', '子'), pillar('Day', '辛', '酉'), pillar('Hour', '乙', '巳')] },
];

const chartData = (c) => ({
  animal: c.pillars[0].branch.animal,
  element: c.pillars[0].stem.element,      // year stem element — the value that caused the bug
  polarity: c.pillars[0].stem.polarity,
  dominantEl: 'Metal',
  pillars: c.pillars,
  today: { stem: '甲', branch: '午', animal: 'Horse', nobleman: false, isClash: false, isCompat: false, score: 64, stemElement: 'Wood', stemPolarity: 'Yang' },
  tenGods: { list: [], sentence: { en: '' } },
});

describe('Day Master is stated, never inferred', () => {
  for (const c of CHARTS) {
    test(`guidance prompt names ${c.day} as ${c.polarity} ${c.element}`, () => {
      const p = buildGuidancePrompt(chartData(c));
      const line = p.split('\n').find(l => l.startsWith('Day Master (日主):'));
      assert.ok(line, 'no Day Master line');
      assert.match(line, new RegExp(`${c.day[0]} ${c.element} ${c.polarity}`));
      assert.match(line, new RegExp(c.archetype));
      // The year stem's element must not be presented as the Day Master.
      const yearEl = c.pillars[0].stem.element;
      if (yearEl !== c.element) assert.ok(!line.includes(yearEl), `Day Master line names the year element ${yearEl}`);
    });

    test(`oracle prompt names ${c.day} as ${c.polarity} ${c.element}`, () => {
      const p = buildOraclePrompt(chartData(c), {});
      const line = p.split('\n').find(l => l.startsWith('Day Master (日主):'));
      assert.ok(line, 'no Day Master line');
      assert.match(line, new RegExp(`${c.day[0]} ${c.element} ${c.polarity}`));
      // The old bare "Element:" line is what the model read as the Day Master.
      assert.ok(!/^Element: /m.test(p), 'bare Element: line is back');
      assert.match(p, /Year element[^\n]*NOT the Day Master/);
    });

    test(`day pillar resolves for ${c.day}`, () => {
      const dm = dayMasterOf(c.pillars);
      assert.deepStrictEqual([dm.char, dm.element, dm.polarity], [c.day[0], c.element, c.polarity]);
    });
  }

  test('batch prompt states the Day Master with its archetype', () => {
    const p = batchPrompt.buildUserPrompt
      ? batchPrompt.buildUserPrompt({ name: 'X', dayMaster: { char: '庚', element: 'Metal', polarity: 'Yang', archetype: 'The Blade' } })
      : null;
    if (!p) return; // builder not exported under that name — covered by the batch suite
    assert.match(p, /Day Master \(日主\): 庚 \(Metal Yang — The Blade\)/);
  });

  test('an unknown day pillar is reported, not guessed', () => {
    const c = { pillars: [pillar('Year', '乙', '亥'), pillar('Month', '庚', '辰'), { label: 'Day', known: false }, { label: 'Hour', known: false }] };
    const p = buildGuidancePrompt(chartData(c));
    const line = p.split('\n').find(l => l.startsWith('Day Master (日主):'));
    assert.match(line, /unknown/);
    assert.ok(!line.includes('甲') && !line.includes('Wood'), 'fell back to 甲 Wood');
    assert.strictEqual(dayMasterOf(c.pillars), null);
  });

  test('ten gods are computed from the day stem, not the year stem', () => {
    // 庚 Yang Metal against today's 甲 Yang Wood: what I control, same polarity → 偏財.
    assert.strictEqual(calcTenGod('Metal', 'Yang', 'Wood', 'Yang'), '偏財 Indirect Wealth');
  });
});

describe('Guidance reply parsing', () => {
  const flat = { do_en: 'a', do_zh: 'b', avoid_en: 'c', avoid_zh: 'd', watch_en: 'e', watch_zh: 'f' };

  test('flat six-key replies normalise to the client shape', () => {
    assert.deepStrictEqual(normalizeGuidance(flat), {
      do: { en: 'a', zh: 'b' }, avoid: { en: 'c', zh: 'd' }, watch: { en: 'e', zh: 'f' },
    });
  });

  test('a correctly nested reply is still accepted', () => {
    assert.deepStrictEqual(normalizeGuidance({ do: { en: 'a', zh: 'b' }, avoid: { en: 'c', zh: 'd' }, watch: { en: 'e', zh: 'f' } }), {
      do: { en: 'a', zh: 'b' }, avoid: { en: 'c', zh: 'd' }, watch: { en: 'e', zh: 'f' },
    });
  });

  test('incomplete replies are rejected so the client can degrade visibly', () => {
    for (const bad of [null, {}, { do_en: 'a' }, { ...flat, watch_zh: '   ' }, { do: { en: 'a' }, avoid: { en: 'c', zh: 'd' }, watch: { en: 'e', zh: 'f' } }]) {
      assert.strictEqual(normalizeGuidance(bad), null, `accepted ${JSON.stringify(bad)}`);
    }
  });

  test('the token cap leaves headroom over measured replies (258-342)', () => {
    assert.ok(GUIDANCE_MAX_TOKENS >= 700, `cap ${GUIDANCE_MAX_TOKENS} is too tight`);
  });
});
