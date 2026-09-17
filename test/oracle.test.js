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
const { buildSystemPrompt, bangkokToday, currentPillars, currentLuck, addDaysIso } = require('../oracle/prompt');

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
