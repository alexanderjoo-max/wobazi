/* ═══════════════════════════════════════
   WOBAZI — Daily Reading AI Prompt Builder
   batch/prompt.js
   Builds the system + user prompt per the spec,
   injecting all BaZi variables.
═══════════════════════════════════════ */

'use strict';

const SYSTEM_PROMPT = `You are a BaZi analyst generating a personalized daily reading. You must return ONLY valid JSON — no preamble, no markdown, no explanation. Any non-JSON output will break the system.`;

function buildUserPrompt(data) {
  const {
    name,
    dayMaster,        // { char, element, polarity }
    yearStem, yearBranch,
    monthStem, monthBranch,
    dayStem, dayBranch,
    hourStem, hourBranch,
    favorableElements,
    unfavorableElements,
    luckStem, luckBranch,
    luckStart, luckEnd,
    todayDate,
    todayDayStem, todayDayBranch,
    clashes,
    combinations,
    nobleman,
    wealthStars,
    indirectWealth,
    resourceStars,
  } = data;

  return `Generate today's BaZi reading for this person.

CHART DATA:
Name: ${name}
Day Master: ${dayMaster.char} (${dayMaster.element} ${dayMaster.polarity})
Year Pillar: ${yearStem} ${yearBranch}
Month Pillar: ${monthStem} ${monthBranch}
Day Pillar: ${dayStem} ${dayBranch}
Hour Pillar: ${hourStem} ${hourBranch}
Favorable elements: ${favorableElements}
Unfavorable elements: ${unfavorableElements}
Current luck pillar: ${luckStem} ${luckBranch}
Luck pillar phase: age ${luckStart} to ${luckEnd}

TODAY (${todayDate}):
Day pillar: ${todayDayStem} ${todayDayBranch}
Active clashes: ${clashes}
Active combinations: ${combinations}
Nobleman stars: ${nobleman}
Wealth stars: ${wealthStars}
Indirect wealth stars: ${indirectWealth}
Resource stars: ${resourceStars}

SCORING RULES:
Score each category 0-100 based on how today's pillar interacts with this specific chart.
- 85-100: today's energy strongly activates this area
- 65-84: favorable conditions
- 45-64: neutral, neither helped nor hindered
- 25-44: some friction or weakness today
- 0-24: direct clash or significant unfavorable interaction

CONTENT RULES — CRITICAL:
Every text field must reference a specific BaZi mechanism.
Never write generic wellness advice.
Never write text that could apply to any user on any day.
Always name the specific star, clash, combination, or pillar interaction causing the condition.
Include time windows (e.g. "before noon", "Tiger hour") where the BaZi calculation supports it.

DO / AVOID / WATCH rules:
- Must be the intersection of the user's chart + today's pillar + active stars
- Must name the specific mechanism driving it
- Must be impossible to copy-paste onto a different user's reading
- 15 words maximum each
- No generic wellness (no grounding, hydration, sugar)

INSIGHT rules:
- 30-50 words each
- Must name specific stars or pillar interactions
- Strategic advisor tone — not horoscope language
- If a star is not active today, do not mention it

Return ONLY this JSON structure:
{
  "hero_text": "",
  "do_action": "",
  "avoid_action": "",
  "watch_action": "",
  "insight_career": "",
  "insight_wealth": "",
  "insight_relationships": "",
  "insight_risk": "",
  "overall_score": 0,
  "career_score": 0,
  "wealth_score": 0,
  "love_score": 0,
  "health_score": 0,
  "travel_score": 0,
  "energy_score": 0,
  "favorable_verdict": "",
  "better_timing_windows": []
}`;
}

module.exports = { SYSTEM_PROMPT, buildUserPrompt };
