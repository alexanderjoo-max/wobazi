/* ═══════════════════════════════════════
   WOBAZI — Structured JSON generation
   relationships/llm.js
   DeepSeek (JSON mode) → validate → Gemini (JSON mime type) → validate.
   Uses the client instances server.js already created.
═══════════════════════════════════════ */

'use strict';

const TIMEOUT_MS = 60000;

function parseJson(text) {
  if (typeof text !== 'string') throw new Error('empty response');
  const cleaned = text.replace(/```json?\s*/gi, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error('no JSON object in response');
  return JSON.parse(cleaned.slice(start, end + 1));
}

function withTimeout(promise, ms, label) {
  let t;
  return Promise.race([
    promise,
    new Promise((_, rej) => { t = setTimeout(() => rej(new Error(`${label} timed out`)), ms); }),
  ]).finally(() => clearTimeout(t));
}

async function callDeepSeek(deepseek, system, user) {
  const completion = await deepseek.chat.completions.create({
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    response_format: { type: 'json_object' },
    max_tokens: 1800,
    temperature: 0.6,
  }, { timeout: TIMEOUT_MS, maxRetries: 0 });
  return completion.choices?.[0]?.message?.content;
}

async function callGemini(genAI, system, user) {
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.5-flash', systemInstruction: system });
  const result = await withTimeout(model.generateContent({
    contents: [{ role: 'user', parts: [{ text: user }] }],
    generationConfig: { maxOutputTokens: 4096, temperature: 0.6, responseMimeType: 'application/json' },
  }), TIMEOUT_MS, 'gemini');
  return result.response.text();
}

/**
 * @param {object} clients  { deepseek, genAI }
 * @param {object} req      { system, user, validate(obj) → { ok, errors, value } }
 * @returns {Promise<{ value, model }>}  throws with .attempts when both fail
 */
async function generateJSON(clients, req) {
  const attempts = [];
  const providers = [
    ['deepseek', () => callDeepSeek(clients.deepseek, req.system, req.user)],
    ['gemini', () => callGemini(clients.genAI, req.system, req.user)],
  ];
  for (const [name, call] of providers) {
    try {
      const raw = await call();
      const parsed = parseJson(raw);
      const check = req.validate(parsed);
      if (check.ok) return { value: check.value, model: name };
      attempts.push({ model: name, error: 'invalid: ' + check.errors.slice(0, 6).join('; ') });
    } catch (err) {
      attempts.push({ model: name, error: err.message || String(err) });
    }
  }
  const err = new Error(attempts.map(a => `${a.model}: ${a.error}`).join(' | '));
  err.attempts = attempts;
  throw err;
}

module.exports = { generateJSON, parseJson };
