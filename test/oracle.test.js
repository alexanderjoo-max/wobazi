/* ═══════════════════════════════════════
   Oracle date awareness.
   node --test test/oracle.test.js
   The live test calls DeepSeek (same model and prompt as /api/oracle) when DEEPSEEK_API_KEY
   is set (loaded from .env.local); it is skipped otherwise.
═══════════════════════════════════════ */
'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { buildSystemPrompt, dayMasterOf, bangkokToday, currentPillars, currentLuck, addDaysIso } = require('../oracle/prompt');

const CHART = {
  animal: 'Pig', element: 'Wood', polarity: 'Yin', dominantEl: 'Metal',
  fortune: { love: 88, career: 74, health: 78, wealth: 76 },
  pillars: [
    { label: 'Year', known: true, stem: { char: '乙', element: 'Wood', polarity: 'Yin' }, branch: { char: '亥', animal: 'Pig' } },
    { label: 'Month', known: true, stem: { char: '庚', element: 'Metal', polarity: 'Yang' }, branch: { char: '辰', animal: 'Dragon' } },
    { label: 'Day', known: true, stem: { char: '庚', element: 'Metal', polarity: 'Yang' }, branch: { char: '寅', animal: 'Tiger' } },
    { label: 'Hour', known: true, stem: { char: '庚', element: 'Metal', polarity: 'Yang' }, branch: { char: '辰', animal: 'Dragon' } },
  ],
  today: { stem: '甲', branch: '午', animal: 'Horse', isClash: false, isCompat: false, score: 64, nobleman: false },
};
const BIRTH = { year: 1995, month: 4, day: 29, hour: 8, minute: 45, gender: 'F' };

describe('Oracle date context', () => {
  it('uses the Bangkok date, not the server (UTC) date', () => {
    // 18:30 UTC on 17 Sep is 01:30 on 18 Sep in Bangkok.
    assert.equal(bangkokToday(new Date('2026-09-17T18:30:00Z')).iso, '2026-09-18');
    assert.equal(bangkokToday(new Date('2026-09-17T10:00:00Z')).iso, '2026-09-17');
  });

  it('annual pillar turns at 立春, not 1 January', () => {
    assert.equal(currentPillars(bangkokToday(new Date('2026-09-17T05:00:00Z'))).year.chars, '丙午');
    assert.equal(currentPillars(bangkokToday(new Date('2026-01-20T05:00:00Z'))).year.chars, '乙巳');
  });

  it('finds the running luck pillar (reference chart: 癸未 2017–2027)', () => {
    const l = currentLuck(BIRTH, bangkokToday(new Date('2026-09-17T05:00:00Z')));
    assert.equal(l.chars, '癸未');
    assert.equal(currentLuck({ ...BIRTH, gender: null }, bangkokToday()), null);
  });

  it('puts today, the annual pillar, the luck pillar and a future-only rule in the prompt', () => {
    const now = new Date('2026-09-17T05:00:00Z');
    const p = buildSystemPrompt(CHART, { now, birth: BIRTH });
    assert.match(p, /Today is Thursday, 2026-09-17 \(Asia\/Bangkok\)/);
    assert.match(p, /Annual pillar \(流年\) for 2026: 丙午/);
    assert.match(p, /10-year luck pillar \(大运\): 癸未/);
    assert.match(p, /"next week" means 2026-09-21 to 2026-09-27/);
    assert.match(p, /on or after 2026-09-17/);
  });

  it('is rebuilt per request (the date is not frozen at startup)', () => {
    const a = buildSystemPrompt(CHART, { now: new Date('2026-09-17T05:00:00Z'), birth: BIRTH });
    const b = buildSystemPrompt(CHART, { now: new Date('2026-09-24T05:00:00Z'), birth: BIRTH });
    assert.match(a, /2026-09-17/);
    assert.match(b, /Today is Thursday, 2026-09-24/);
  });
});

describe('Oracle Day Master', () => {
  const NOW = new Date('2026-09-17T05:00:00Z');

  it('reads the Day Master from the Day pillar, not the year stem', () => {
    assert.deepEqual(dayMasterOf(CHART.pillars), { char: '\u5e9a', element: 'Metal', polarity: 'Yang' });
  });

  it('states the Day Master explicitly for the reference chart (\u5e9a Metal Yang)', () => {
    const p = buildSystemPrompt(CHART, { now: NOW, birth: BIRTH });
    assert.match(p, /Day Master \(\u65e5\u4e3b\): \u5e9a Metal Yang/);
  });

  it('never labels the year element (Wood/Yin) as the Day Master', () => {
    const p = buildSystemPrompt(CHART, { now: NOW, birth: BIRTH });
    // The old prompt printed a bare "Element: Wood (Yin)" line that the model read as the Day Master.
    assert.doesNotMatch(p, /^Element: /m);
    assert.match(p, /Year element[^\n]*Wood \(Yin\)/);
    // No line that identifies the Day Master may name Wood: the explicit statement and the
    // marker on the Day pillar are the only two places the chart block declares one.
    const declaring = p.split('\n').filter(l => /^Day Master \(\u65e5\u4e3b\)/.test(l) || /\u2190 Day Master/.test(l));
    assert.equal(declaring.length, 2);
    for (const line of declaring) {
      assert.doesNotMatch(line, /Wood/, `"Day Master" line mentions Wood: ${line}`);
      assert.match(line, /Metal/);
    }
    assert.match(p, /The Day Master is the Day pillar's stem; never describe the user's Day Master as any other element/);
  });

  it('says so when the day pillar is unknown instead of falling back to the year stem', () => {
    const noDay = { ...CHART, pillars: CHART.pillars.map(p => (p.label === 'Day' ? { label: 'Day', known: false } : p)) };
    assert.equal(dayMasterOf(noDay.pillars), null);
    const p = buildSystemPrompt(noDay, { now: NOW, birth: BIRTH });
    assert.match(p, /Day Master \(\u65e5\u4e3b\): unknown/);
    assert.doesNotMatch(p, /Day Master \(\u65e5\u4e3b\): \u4e59/);
  });

  it('survives a missing pillars array', () => {
    assert.equal(dayMasterOf(undefined), null);
    assert.match(buildSystemPrompt({ ...CHART, pillars: null }, { now: NOW }), /Day Master \(\u65e5\u4e3b\): unknown/);
  });
});

describe('Oracle live: "best date next week"', { skip: !process.env.DEEPSEEK_API_KEY && 'DEEPSEEK_API_KEY not set' }, () => {
  it('suggests a date in the future, inside next week', async () => {
    const OpenAI = require('openai');
    const deepseek = new OpenAI({ apiKey: process.env.DEEPSEEK_API_KEY, baseURL: 'https://api.deepseek.com' });
    const today = bangkokToday();
    const completion = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: buildSystemPrompt(CHART, { birth: BIRTH }) },
        { role: 'user', content: 'What is the best date next week to sign a contract?' },
      ],
      max_tokens: 400,
      temperature: 0.7,
    }, { timeout: 60000 });
    const text = completion.choices[0].message.content;
    const dates = [...text.matchAll(/\b(20\d{2}-\d{2}-\d{2})\b/g)].map(m => m[1]);
    assert.ok(dates.length > 0, `no YYYY-MM-DD date in reply: ${text}`);
    const dow = new Date(today.iso + 'T00:00:00Z').getUTCDay();
    const nextMonday = addDaysIso(today.iso, ((8 - dow) % 7) || 7);
    for (const d of dates) {
      assert.ok(d > today.iso, `date ${d} is not after today ${today.iso}: ${text}`);
      assert.ok(d <= addDaysIso(nextMonday, 6), `date ${d} is beyond next week: ${text}`);
    }
  });
});
