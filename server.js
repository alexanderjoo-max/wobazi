/* ═══════════════════════════════════════
   WOBAZI — Oracle Backend
   server.js
═══════════════════════════════════════ */

require('dotenv').config({ path: '.env.local' });
const express = require('express');
const session = require('express-session');
const Database = require('better-sqlite3');
const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

/* ── SQLite Database ── */
const db = new Database(path.join(__dirname, 'wobazi.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    google_id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    avatar TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS readings (
    google_id TEXT PRIMARY KEY REFERENCES users(google_id),
    name TEXT,
    year INTEGER, month INTEGER, day INTEGER, hour INTEGER,
    birthplace TEXT, blood_type TEXT, gender TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS oracle_chats (
    google_id TEXT PRIMARY KEY REFERENCES users(google_id),
    messages TEXT DEFAULT '[]',
    updated_at TEXT DEFAULT (datetime('now'))
  );
`);

/* ── Session ── */
app.use(session({
  secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: 'lax' },
}));

app.use(express.json());
app.use(express.static(path.join(__dirname), {
  index: 'index.html',
  extensions: ['html'],
}));

/* ── Rate Limiting (in-memory, IP-based) ── */
const rateLimits = new Map();
const DAILY_LIMIT = 10;

function checkRateLimit(ip) {
  const today = new Date().toISOString().slice(0, 10);
  const entry = rateLimits.get(ip);
  if (!entry || entry.date !== today) {
    rateLimits.set(ip, { date: today, count: 1 });
    return { allowed: true, remaining: DAILY_LIMIT - 1 };
  }
  if (entry.count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }
  entry.count++;
  return { allowed: true, remaining: DAILY_LIMIT - entry.count };
}

/* ═══════════════════════════════════════
   GOOGLE OAUTH
═══════════════════════════════════════ */
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = `${BASE_URL}/auth/google/callback`;

/* ── Step 1: Redirect to Google ── */
app.get('/auth/google', (req, res) => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid profile email',
    access_type: 'offline',
    prompt: 'consent',
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

/* ── Step 2: Handle callback ── */
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect('/?auth=error');

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });
    const tokens = await tokenRes.json();
    if (!tokens.access_token) throw new Error('No access token');

    // Fetch user profile
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await profileRes.json();

    // Upsert user in SQLite
    db.prepare(`
      INSERT INTO users (google_id, name, email, avatar)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(google_id) DO UPDATE SET name=excluded.name, email=excluded.email, avatar=excluded.avatar
    `).run(profile.id, profile.name, profile.email, profile.picture);

    // Set session
    req.session.user = {
      googleId: profile.id,
      name: profile.name,
      email: profile.email,
      avatar: profile.picture,
    };

    res.redirect('/?auth=success');
  } catch (err) {
    console.error('[Google OAuth error]', err.message);
    res.redirect('/?auth=error');
  }
});

/* ── Logout ── */
app.get('/auth/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

/* ── Current user ── */
app.get('/api/me', (req, res) => {
  if (req.session.user) {
    return res.json({ user: req.session.user });
  }
  res.json({ user: null });
});

/* ═══════════════════════════════════════
   DATA PERSISTENCE API
═══════════════════════════════════════ */

/* ── Save reading ── */
app.post('/api/save-reading', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });
  const { name, year, month, day, hour, birthplace, bloodType, gender } = req.body;
  db.prepare(`
    INSERT INTO readings (google_id, name, year, month, day, hour, birthplace, blood_type, gender, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(google_id) DO UPDATE SET
      name=excluded.name, year=excluded.year, month=excluded.month, day=excluded.day,
      hour=excluded.hour, birthplace=excluded.birthplace, blood_type=excluded.blood_type,
      gender=excluded.gender, updated_at=datetime('now')
  `).run(req.session.user.googleId, name, year, month, day, hour || null, birthplace || null, bloodType || null, gender || null);
  res.json({ ok: true });
});

/* ── Save Oracle chat ── */
app.post('/api/save-chat', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });
  const { messages } = req.body;
  db.prepare(`
    INSERT INTO oracle_chats (google_id, messages, updated_at)
    VALUES (?, ?, datetime('now'))
    ON CONFLICT(google_id) DO UPDATE SET messages=excluded.messages, updated_at=datetime('now')
  `).run(req.session.user.googleId, JSON.stringify(messages || []));
  res.json({ ok: true });
});

/* ── Get saved data ── */
app.get('/api/my-data', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });
  const gid = req.session.user.googleId;
  const reading = db.prepare('SELECT * FROM readings WHERE google_id = ?').get(gid);
  const chat = db.prepare('SELECT messages FROM oracle_chats WHERE google_id = ?').get(gid);
  res.json({
    reading: reading || null,
    chat: chat ? JSON.parse(chat.messages) : [],
  });
});

/* ═══════════════════════════════════════
   AI — DeepSeek + Gemini
═══════════════════════════════════════ */

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function buildSystemPrompt(chartData) {
  const { animal, element, polarity, dominantEl, fortune, pillars, today } = chartData;

  const pillarStr = (pillars || []).map(p => {
    if (!p.known) return `${p.label}: unknown`;
    return `${p.label}: ${p.stem.char} ${p.branch.char} (${p.stem.element} ${p.stem.polarity} / ${p.branch.animal})`;
  }).join('\n');

  const todayStr = today
    ? `Today's Day Pillar: ${today.stem} ${today.branch} (${today.animal} day)\nClash with user: ${today.isClash ? 'YES — friction day' : today.isCompat ? 'NO — harmonious day' : 'Neutral day'}\nDay Force Score: ${today.score}/100\nNobleman Status: ${today.nobleman ? 'Active — helpful people energy today' : 'Inactive'}`
    : '';

  return `You are the Wobazi Oracle — a direct, authoritative BaZi destiny advisor. You interpret Chinese metaphysics (Four Pillars of Destiny) with confidence and clarity.

USER'S BAZI CHART:
Animal: ${animal}
Element: ${element} (${polarity})
Dominant Element: ${dominantEl}
Fortune Scores — Love: ${fortune?.love}, Career: ${fortune?.career}, Health: ${fortune?.health}, Wealth: ${fortune?.wealth}

FOUR PILLARS:
${pillarStr}

${todayStr}

RULES:
- Speak as an oracle — direct, confident, no hedging or disclaimers
- Keep responses concise (3-5 sentences max)
- Reference the user's specific chart data in your answers
- When timing matters, include date suggestions as [DATE:YYYY-MM-DD] tags
- When giving a clear verdict, include exactly one: [VERDICT:favorable], [VERDICT:defer], or [VERDICT:neutral]
- Use the Five Element relationships (producing/controlling cycles) in your analysis
- Reference today's day pillar energy when relevant to "should I do X today" questions
- Never say "I'm just an AI" or add disclaimers — you ARE the Oracle`;
}

async function streamDeepSeek(systemPrompt, messages, res) {
  const stream = await deepseek.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    max_tokens: 400,
    temperature: 0.7,
    stream: true,
  });

  for await (const chunk of stream) {
    const token = chunk.choices?.[0]?.delta?.content;
    if (token) {
      res.write(`data: ${JSON.stringify({ token })}\n\n`);
    }
  }
  res.write('data: [DONE]\n\n');
  res.end();
}

async function streamGemini(systemPrompt, messages, res) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: systemPrompt,
  });

  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({
    history,
    generationConfig: {
      maxOutputTokens: 400,
      temperature: 0.7,
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  const lastMsg = messages[messages.length - 1].content;
  const result = await chat.sendMessageStream(lastMsg);

  for await (const chunk of result.stream) {
    const token = chunk.text();
    if (token) {
      res.write(`data: ${JSON.stringify({ token })}\n\n`);
    }
  }
  res.write('data: [DONE]\n\n');
  res.end();
}

/* ── Oracle Endpoint ── */
app.post('/api/oracle', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const limit = checkRateLimit(ip);

  if (!limit.allowed) {
    return res.status(429).json({
      error: "You've reached your daily Oracle limit (10 questions). Return tomorrow for fresh guidance.",
      remaining: 0,
    });
  }

  const { message, chartData, conversationHistory } = req.body;

  if (!message || !chartData) {
    return res.status(400).json({ error: 'Missing message or chart data' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Remaining', limit.remaining);
  res.flushHeaders();

  const systemPrompt = buildSystemPrompt(chartData);
  const messages = [
    ...(conversationHistory || []),
    { role: 'user', content: message },
  ];

  try {
    await streamDeepSeek(systemPrompt, messages, res);
  } catch (err) {
    console.error('[DeepSeek error]', err.message);
    try {
      await streamGemini(systemPrompt, messages, res);
    } catch (err2) {
      console.error('[Gemini error]', err2.message);
      res.write(`data: ${JSON.stringify({ error: 'The Oracle is temporarily unavailable — try again in a moment.' })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Wobazi server running on ${BASE_URL}`);
});
