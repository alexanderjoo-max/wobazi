/* ═══════════════════════════════════════
   WOBAZI — Daily Reading Batch Generator
   batch/generate.js
   Core logic: iterate users, compute chart,
   call AI (DeepSeek → Gemini fallback),
   parse, validate, save to daily_readings.
═══════════════════════════════════════ */

'use strict';

const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const bazi = require('../bazi-engine');
const helpers = require('./bazi-helpers');
const { SYSTEM_PROMPT, buildUserPrompt } = require('./prompt');

/* ── AI Clients (lazy-initialized) ── */
let _deepseek = null;
let _genAI = null;

function getDeepSeek() {
  if (!_deepseek) {
    _deepseek = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com',
    });
  }
  return _deepseek;
}

function getGemini() {
  if (!_genAI) {
    _genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return _genAI;
}

/* ── Compute full chart context for a user ── */
function buildChartContext(user, today) {
  const { name, year, month, day, hour, gender } = user;

  // User's natal pillars
  const pillars = bazi.calcBazi(year, month, day, hour);
  const elements = bazi.calcElements(pillars);
  const dayPillar = pillars[2];
  const dmEl = dayPillar.stem.element;
  const dmPol = dayPillar.stem.polarity;

  // Today's pillar
  const todayPillar = helpers.calcTodayPillar(today);
  const todayStem = todayPillar.stem;
  const todayBranch = todayPillar.branch;

  // Favorable / unfavorable elements
  const { favorable, unfavorable } = helpers.analyzeFavorableElements(dmEl, elements);

  // Luck pillar
  const birthDate = new Date(year, month, day);
  const userAge = Math.floor((today - birthDate) / (365.25 * 86400000));
  const monthStemIdx = bazi.STEMS.indexOf(pillars[1].stem);
  const monthBranchIdx = bazi.BRANCHES.indexOf(pillars[1].branch);
  const luckPillar = helpers.calcLuckPillar(
    gender || 'M', // Default to Male if gender unknown
    pillars[0].stem.polarity,
    monthStemIdx >= 0 ? monthStemIdx : 0,
    monthBranchIdx >= 0 ? monthBranchIdx : 0,
    Math.max(0, userAge)
  );

  // Clashes & combinations
  const clashes = helpers.findClashes(pillars, todayBranch.animal);
  const combinations = helpers.findCombinations(pillars, todayBranch.animal);

  // Stars
  const noblemanActive = helpers.isNobleman(dayPillar.stem.char, todayBranch.animal);
  const wealthStar = helpers.hasWealthStar(dmEl, dmPol, todayStem);
  const indirectWealth = wealthStar && wealthStar.includes('Indirect') ? wealthStar : null;
  const directWealth = wealthStar && wealthStar.includes('Direct') ? wealthStar : null;
  const resourceStar = helpers.hasResourceStar(dmEl, dmPol, todayStem);

  // Format pillar strings
  const fmtPillar = (p) => {
    if (!p.known || !p.stem) return 'Unknown';
    return `${p.stem.char} ${p.branch.char} (${p.stem.element} ${p.branch.animal})`;
  };

  const todayDateStr = today.toISOString().slice(0, 10);

  return {
    name: name || 'User',
    dayMaster: { char: dayPillar.stem.char, element: dmEl, polarity: dmPol },
    yearStem: `${pillars[0].stem.char} (${pillars[0].stem.element} ${pillars[0].stem.polarity})`,
    yearBranch: `${pillars[0].branch.char} (${pillars[0].branch.animal})`,
    monthStem: `${pillars[1].stem.char} (${pillars[1].stem.element} ${pillars[1].stem.polarity})`,
    monthBranch: `${pillars[1].branch.char} (${pillars[1].branch.animal})`,
    dayStem: `${dayPillar.stem.char} (${dmEl} ${dmPol})`,
    dayBranch: `${dayPillar.branch.char} (${dayPillar.branch.animal})`,
    hourStem: pillars[3].known ? `${pillars[3].stem.char} (${pillars[3].stem.element} ${pillars[3].stem.polarity})` : 'Unknown',
    hourBranch: pillars[3].known ? `${pillars[3].branch.char} (${pillars[3].branch.animal})` : 'Unknown',
    favorableElements: favorable.join(', '),
    unfavorableElements: unfavorable.join(', '),
    luckStem: `${luckPillar.stem.char} (${luckPillar.stem.element})`,
    luckBranch: `${luckPillar.branch.char} (${luckPillar.branch.animal})`,
    luckStart: luckPillar.startAge,
    luckEnd: luckPillar.endAge,
    todayDate: todayDateStr,
    todayDayStem: `${todayStem.char} (${todayStem.element} ${todayStem.polarity})`,
    todayDayBranch: `${todayBranch.char} (${todayBranch.animal})`,
    clashes: clashes.length ? clashes.join(', ') : 'None',
    combinations: combinations.length ? combinations.join(', ') : 'None',
    nobleman: noblemanActive ? `Active — ${todayBranch.animal} is nobleman for ${dayPillar.stem.char}` : 'Inactive',
    wealthStars: directWealth || 'None',
    indirectWealth: indirectWealth || 'None',
    resourceStars: resourceStar || 'None',
    // Raw data for DB storage
    _todayStemChar: todayStem.char,
    _todayBranchChar: todayBranch.char,
  };
}

/* ── Call DeepSeek ── */
async function callDeepSeek(userPrompt) {
  const ds = getDeepSeek();
  const completion = await ds.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: 800,
    temperature: 0.7,
  });
  return completion.choices?.[0]?.message?.content?.trim() || '';
}

/* ── Call Gemini (fallback) ── */
async function callGemini(userPrompt) {
  const genAI = getGemini();
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  });
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    generationConfig: { maxOutputTokens: 800, temperature: 0.7, thinkingBudget: 0 },
  });
  return result.response.text().trim();
}

/* ── Parse and validate AI response ── */
function parseReading(raw) {
  // Strip markdown fences
  let cleaned = raw.replace(/```json?\s*/gi, '').replace(/```/g, '').trim();

  const parsed = JSON.parse(cleaned);

  // Validate required fields
  const requiredStrings = [
    'hero_text', 'do_action', 'avoid_action', 'watch_action',
    'insight_career', 'insight_wealth', 'insight_relationships', 'insight_risk',
    'favorable_verdict',
  ];
  for (const f of requiredStrings) {
    if (typeof parsed[f] !== 'string' || !parsed[f]) {
      throw new Error(`Missing or empty field: ${f}`);
    }
  }

  // Clamp scores to 0-100
  const scoreFields = [
    'overall_score', 'career_score', 'wealth_score', 'love_score',
    'health_score', 'travel_score', 'energy_score',
  ];
  for (const f of scoreFields) {
    const val = Number(parsed[f]) || 50;
    parsed[f] = Math.max(0, Math.min(100, Math.round(val)));
  }

  // Validate verdict
  const validVerdicts = ['auspicious', 'neutral', 'caution'];
  if (!validVerdicts.includes(parsed.favorable_verdict)) {
    parsed.favorable_verdict = 'neutral';
  }

  // Ensure better_timing_windows is an array
  if (!Array.isArray(parsed.better_timing_windows)) {
    parsed.better_timing_windows = [];
  }

  return parsed;
}

/* ── Generate a fallback/template reading when both AI calls fail ── */
function generateFallbackReading(chartContext) {
  const dm = chartContext.dayMaster;
  return {
    hero_text: `${dm.element} ${dm.polarity} day master meets ${chartContext.todayDayStem} energy today. Review your chart for specific interactions.`,
    do_action: `Align with your ${chartContext.favorableElements.split(',')[0] || dm.element} energy today.`,
    avoid_action: `Watch for ${chartContext.unfavorableElements.split(',')[0] || 'opposing'} element friction.`,
    watch_action: `Monitor ${chartContext.clashes !== 'None' ? 'active clash' : 'branch'} energy shifts.`,
    insight_career: `Today's pillar ${chartContext.todayDayStem} interacts with your ${dm.element} Day Master. Check the Ten God relationship for career implications this period.`,
    insight_wealth: `The wealth element ${chartContext.wealthStars !== 'None' ? 'is active' : 'is quiet'} today. Align financial decisions with your favorable elements: ${chartContext.favorableElements}.`,
    insight_relationships: `Your Day Master ${dm.char} ${dm.element} meets today's branch ${chartContext.todayDayBranch}. ${chartContext.combinations !== 'None' ? 'Harmonious combinations support connection.' : 'Neutral relationship energy.'}`,
    insight_risk: `${chartContext.clashes !== 'None' ? 'Active clashes detected: ' + chartContext.clashes + '. Exercise caution.' : 'No major clashes today. Standard risk level applies.'}`,
    overall_score: 50,
    career_score: 50,
    wealth_score: 50,
    love_score: 50,
    health_score: 50,
    travel_score: 50,
    energy_score: 50,
    favorable_verdict: 'neutral',
    better_timing_windows: [],
  };
}

/* ── Save reading to DB ── */
function saveReading(db, userId, date, reading, todayStem, todayBranch, modelUsed) {
  const stmt = db.prepare(`
    INSERT INTO daily_readings (
      user_id, date, day_pillar_stem, day_pillar_branch,
      hero_text, do_action, avoid_action, watch_action,
      insight_career, insight_wealth, insight_relationships, insight_risk,
      overall_score, career_score, wealth_score, love_score,
      health_score, travel_score, energy_score,
      favorable_verdict, better_timing_windows,
      generated_at, model_used
    ) VALUES (
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?,
      datetime('now'), ?
    )
    ON CONFLICT(user_id, date) DO UPDATE SET
      day_pillar_stem=excluded.day_pillar_stem,
      day_pillar_branch=excluded.day_pillar_branch,
      hero_text=excluded.hero_text,
      do_action=excluded.do_action,
      avoid_action=excluded.avoid_action,
      watch_action=excluded.watch_action,
      insight_career=excluded.insight_career,
      insight_wealth=excluded.insight_wealth,
      insight_relationships=excluded.insight_relationships,
      insight_risk=excluded.insight_risk,
      overall_score=excluded.overall_score,
      career_score=excluded.career_score,
      wealth_score=excluded.wealth_score,
      love_score=excluded.love_score,
      health_score=excluded.health_score,
      travel_score=excluded.travel_score,
      energy_score=excluded.energy_score,
      favorable_verdict=excluded.favorable_verdict,
      better_timing_windows=excluded.better_timing_windows,
      generated_at=datetime('now'),
      model_used=excluded.model_used
  `);

  stmt.run(
    userId, date, todayStem, todayBranch,
    reading.hero_text, reading.do_action, reading.avoid_action, reading.watch_action,
    reading.insight_career, reading.insight_wealth, reading.insight_relationships, reading.insight_risk,
    reading.overall_score, reading.career_score, reading.wealth_score, reading.love_score,
    reading.health_score, reading.travel_score, reading.energy_score,
    reading.favorable_verdict, JSON.stringify(reading.better_timing_windows),
    modelUsed
  );
}

/* ── Process a single user ── */
async function processUser(db, user, today, todayDateStr) {
  const chartContext = buildChartContext(user, today);
  const userPrompt = buildUserPrompt(chartContext);

  let reading;
  let modelUsed = 'deepseek';

  // Try DeepSeek first
  try {
    const raw = await callDeepSeek(userPrompt);
    reading = parseReading(raw);
    modelUsed = 'deepseek';
  } catch (dsErr) {
    console.warn(`[Batch] DeepSeek failed for ${user.google_id}: ${dsErr.message}. Trying Gemini...`);

    // Fallback to Gemini
    try {
      const raw = await callGemini(userPrompt);
      reading = parseReading(raw);
      modelUsed = 'gemini';
    } catch (gemErr) {
      console.warn(`[Batch] Gemini failed for ${user.google_id}: ${gemErr.message}. Using fallback.`);
      reading = generateFallbackReading(chartContext);
      modelUsed = 'fallback';
    }
  }

  saveReading(
    db, user.google_id, todayDateStr, reading,
    chartContext._todayStemChar, chartContext._todayBranchChar,
    modelUsed
  );

  return { userId: user.google_id, modelUsed };
}

/* ── Sleep helper ── */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ═══════════════════════════════════════
   Main batch generation function.
   @param {Database} db - better-sqlite3 instance
   @param {Date} [targetDate] - defaults to today
   @returns {Object} { total, success, failed, results }
═══════════════════════════════════════ */
async function generateDailyReadings(db, targetDate) {
  const today = targetDate || new Date();
  const todayDateStr = today.toISOString().slice(0, 10);

  console.log(`[Batch] Starting daily reading generation for ${todayDateStr}`);

  // Get all active users who have birth data but no reading for today
  const users = db.prepare(`
    SELECT r.google_id, r.name, r.year, r.month, r.day, r.hour, r.gender
    FROM readings r
    INNER JOIN users u ON u.google_id = r.google_id
    WHERE r.google_id NOT IN (
      SELECT user_id FROM daily_readings WHERE date = ?
    )
    AND r.year IS NOT NULL
    AND r.month IS NOT NULL
    AND r.day IS NOT NULL
  `).all(todayDateStr);

  console.log(`[Batch] Found ${users.length} users without readings for today`);

  if (users.length === 0) {
    return { total: 0, success: 0, failed: 0, results: [] };
  }

  const BATCH_SIZE = 10;
  const results = [];
  let success = 0;
  let failed = 0;

  for (let i = 0; i < users.length; i += BATCH_SIZE) {
    const batch = users.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(users.length / BATCH_SIZE);

    console.log(`[Batch] Processing batch ${batchNum}/${totalBatches} (${batch.length} users)`);

    const batchResults = await Promise.all(
      batch.map(async (user) => {
        try {
          const result = await processUser(db, user, today, todayDateStr);
          success++;
          return { ...result, status: 'ok' };
        } catch (err) {
          failed++;
          console.error(`[Batch] Fatal error for ${user.google_id}: ${err.message}`);
          return { userId: user.google_id, status: 'error', error: err.message };
        }
      })
    );

    results.push(...batchResults);

    // 1-second delay between batches (skip after the last batch)
    if (i + BATCH_SIZE < users.length) {
      await sleep(1000);
    }
  }

  console.log(`[Batch] Complete: ${success} success, ${failed} failed out of ${users.length} total`);

  return { total: users.length, success, failed, results };
}

module.exports = { generateDailyReadings, buildChartContext, processUser };
