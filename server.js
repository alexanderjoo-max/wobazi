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
const bazi = require('./bazi-engine');

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

/* ── SQLite Session Store (survives server restarts) ── */
db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    sid TEXT PRIMARY KEY,
    sess TEXT NOT NULL,
    expired INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_sessions_expired ON sessions(expired);
`);

class SqliteStore extends session.Store {
  constructor() { super(); this._cleanup(); }
  _cleanup() {
    db.prepare('DELETE FROM sessions WHERE expired < ?').run(Date.now());
    setTimeout(() => this._cleanup(), 15 * 60 * 1000); // every 15 min
  }
  get(sid, cb) {
    try {
      const row = db.prepare('SELECT sess FROM sessions WHERE sid = ? AND expired > ?').get(sid, Date.now());
      cb(null, row ? JSON.parse(row.sess) : null);
    } catch (e) { cb(e); }
  }
  set(sid, sess, cb) {
    try {
      const maxAge = sess.cookie?.maxAge || 30 * 24 * 60 * 60 * 1000;
      const expired = Date.now() + maxAge;
      db.prepare('INSERT OR REPLACE INTO sessions (sid, sess, expired) VALUES (?, ?, ?)').run(sid, JSON.stringify(sess), expired);
      cb?.(null);
    } catch (e) { cb?.(e); }
  }
  destroy(sid, cb) {
    try {
      db.prepare('DELETE FROM sessions WHERE sid = ?').run(sid);
      cb?.(null);
    } catch (e) { cb?.(e); }
  }
  touch(sid, sess, cb) { this.set(sid, sess, cb); }
}

/* ── Session ── */
app.use(session({
  store: new SqliteStore(),
  secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: 'lax' },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ── EJS Templating ── */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* ── Static Files ── */
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/app', express.static(path.join(__dirname, 'app')));
// Serve logos and og-card from root for backward compat
app.use('/Logos', express.static(path.join(__dirname, 'Logos')));
app.use('/app/Logos', express.static(path.join(__dirname, 'Logos')));
app.use('/og-card.png', express.static(path.join(__dirname, 'og-card.png')));

/* ── SEO: Sitemap & Robots ── */
app.get('/sitemap.xml', (req, res) => {
  const pages = [
    { loc: '/what-is-bazi', priority: '1.0', changefreq: 'monthly' },
    { loc: '/four-pillars-of-destiny', priority: '0.8', changefreq: 'monthly' },
    { loc: '/chinese-astrology', priority: '0.8', changefreq: 'monthly' },
    { loc: '/day-master', priority: '0.8', changefreq: 'monthly' },
    { loc: '/bazi-compatibility', priority: '0.8', changefreq: 'monthly' },
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>https://wobazi.com${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  res.type('application/xml').send(xml);
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *
Allow: /
Disallow: /app/
Disallow: /api/
Disallow: /auth/

Sitemap: https://wobazi.com/sitemap.xml
`);
});

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
   SEO PAGES
═══════════════════════════════════════ */
const seoBase = { baseUrl: 'https://wobazi.com' };

app.get('/', (req, res) => {
  res.redirect(301, '/app');
});

app.get('/what-is-bazi', (req, res) => {
  res.render('pages/what-is-bazi', {
    ...seoBase,
    title: 'What is BaZi? Chinese Astrology & Four Pillars Explained | WoBazi',
    description: 'Learn about BaZi (八字), the ancient Chinese astrology system based on your birth date and time. Understand the Four Pillars of Destiny, Heavenly Stems, Earthly Branches, and Five Elements.',
    canonical: '/what-is-bazi',
    bazi,
  });
});

app.get('/bazi-calculator', (req, res) => {
  res.redirect(301, '/app');
});

app.get('/four-pillars-of-destiny', (req, res) => {
  res.render('pages/four-pillars', {
    ...seoBase,
    title: 'Four Pillars of Destiny | BaZi Chinese Astrology Guide | WoBazi',
    description: 'Complete guide to the Four Pillars of Destiny (BaZi). Learn about Year, Month, Day, and Hour pillars, Heavenly Stems, Earthly Branches, and 10-Year Luck Pillars.',
    canonical: '/four-pillars-of-destiny',
    bazi,
  });
});

app.get('/chinese-astrology', (req, res) => {
  res.render('pages/chinese-astrology', {
    ...seoBase,
    title: 'Chinese Astrology | BaZi, Four Pillars & Chinese Zodiac | WoBazi',
    description: 'Explore Chinese astrology systems: BaZi (Four Pillars), Chinese Zodiac, Zi Wei Dou Shu, and Five Elements. Compare Chinese vs Western astrology.',
    canonical: '/chinese-astrology',
    bazi,
  });
});

app.get('/day-master', (req, res) => {
  res.render('pages/day-master', {
    ...seoBase,
    title: 'BaZi Day Master | What is Your Day Master? | WoBazi',
    description: 'Discover your BaZi Day Master. Learn about all 10 Day Masters from Jia Wood to Gui Water, and how your Day Master shapes your personality and destiny.',
    canonical: '/day-master',
    bazi,
  });
});

app.get('/bazi-compatibility', (req, res) => {
  res.render('pages/compatibility', {
    ...seoBase,
    title: 'BaZi Compatibility | Chinese Astrology Relationship Guide | WoBazi',
    description: 'Explore BaZi compatibility and Chinese astrology relationship analysis. Learn about zodiac clashes, combinations, and how to assess romantic and business compatibility.',
    canonical: '/bazi-compatibility',
    bazi,
  });
});

/* ── SPA App ── */
app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'app', 'index.html'));
});
app.get('/app/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'app', 'index.html'));
});

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
    prompt: 'select_account',
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

/* ── Step 2: Handle callback ── */
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect('/app?auth=error');

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

    res.redirect('/app?auth=success');
  } catch (err) {
    console.error('[Google OAuth error]', err.message);
    res.redirect('/app?auth=error');
  }
});

/* ── Logout ── */
app.get('/auth/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/app');
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

/* ── Daily Guidance (AI-generated DO/AVOID/WATCH) ── */
const guidanceCache = new Map(); // key: `${dayMasterEl}-${todayStem}-${todayBranch}` → { ts, data }

function calcTenGod(dayMasterEl, dayMasterPolarity, targetEl, targetPolarity) {
  const same = dayMasterEl === targetEl;
  const sameP = dayMasterPolarity === targetPolarity;
  const prod = bazi.PRODUCTION_CYCLE;
  const ctrl = bazi.CONTROL_CYCLE;
  const iIdx = prod.indexOf(dayMasterEl);
  const tIdx = prod.indexOf(targetEl);
  // What I produce
  if (prod[(iIdx + 1) % 5] === targetEl) return sameP ? '食神 Eating God' : '傷官 Hurting Officer';
  // What produces me
  if (prod[(tIdx + 1) % 5] === dayMasterEl) return sameP ? '偏印 Indirect Resource' : '正印 Direct Resource';
  // What I control
  if (ctrl[dayMasterEl] === targetEl) return sameP ? '偏財 Indirect Wealth' : '正財 Direct Wealth';
  // What controls me
  if (ctrl[targetEl] === dayMasterEl) return sameP ? '七殺 Seven Killings' : '正官 Direct Officer';
  // Same element
  if (same) return sameP ? '比肩 Friend' : '劫財 Rob Wealth';
  return 'unknown';
}

function buildGuidancePrompt(chartData) {
  const { pillars, today, animal, dominantEl } = chartData;

  // Day Master details
  const dayPillar = pillars.find(p => p.label === 'Day');
  const dmEl = dayPillar?.stem?.element || 'Wood';
  const dmPol = dayPillar?.stem?.polarity || 'Yang';
  const dmChar = dayPillar?.stem?.char || '甲';

  // Today's Ten God relationship
  const todayTenGod = calcTenGod(dmEl, dmPol, today.stemElement, today.stemPolarity);

  // Branch interactions
  const dayBranch = dayPillar?.branch?.animal || 'Rat';
  const clashPairs = {Rat:'Horse',Horse:'Rat',Ox:'Goat',Goat:'Ox',Tiger:'Monkey',Monkey:'Tiger',Rabbit:'Rooster',Rooster:'Rabbit',Dragon:'Dog',Dog:'Dragon',Snake:'Pig',Pig:'Snake'};
  const todayClash = clashPairs[today.animal] || '';
  const branchClashes = [];
  for (const p of pillars) {
    if (p.known && p.branch && clashPairs[p.branch.animal] === today.animal) {
      branchClashes.push(`${p.label} ${p.branch.animal}`);
    }
  }

  // Nobleman (貴人) check — today's branch is in user's compatible animals
  const nobStr = today.nobleman ? 'ACTIVE today' : 'inactive';

  return `You are a BaZi (Four Pillars of Destiny) master generating today's DO / AVOID / WATCH for one specific person.

USER'S CHART:
Day Master: ${dmChar} ${dmEl} ${dmPol} (日主)
Year Pillar: ${pillars[0]?.stem?.char || '?'}${pillars[0]?.branch?.char || '?'} (${pillars[0]?.stem?.element || '?'} ${pillars[0]?.branch?.animal || '?'})
Month Pillar: ${pillars[1]?.stem?.char || '?'}${pillars[1]?.branch?.char || '?'} (${pillars[1]?.stem?.element || '?'} ${pillars[1]?.branch?.animal || '?'})
Day Pillar: ${dayPillar?.stem?.char || '?'}${dayPillar?.branch?.char || '?'} (${dmEl} ${dayBranch})
Hour Pillar: ${pillars[3]?.known ? pillars[3].stem.char + pillars[3].branch.char + ' (' + pillars[3].stem.element + ' ' + pillars[3].branch.animal + ')' : 'Unknown'}
Dominant Element: ${dominantEl}
Zodiac Animal: ${animal}

TODAY'S DAY PILLAR: ${today.stem}${today.branch} (${today.stemElement} ${today.animal})
Ten God of Today's Stem vs Day Master: ${todayTenGod}
Branch clashes with user's pillars: ${branchClashes.length ? branchClashes.join(', ') : 'None'}
Nobleman (貴人) star: ${nobStr}
Day Force Score: ${today.score}/100

RULES — you MUST follow ALL of these:
1. Return EXACTLY this JSON format, nothing else:
{"do":{"en":"...","zh":"..."},"avoid":{"en":"...","zh":"..."},"watch":{"en":"...","zh":"..."}}

2. Each item MUST reference a specific BaZi mechanism by name (e.g. "your ${todayTenGod} star", "the ${today.animal}-${dayBranch} ${branchClashes.length ? 'clash' : 'relationship'}", "your 貴人 Nobleman star", "your Day Master's ${dmEl} energy").

3. Each item MUST include a specific time window where relevant (e.g. "before noon", "during ${today.animal} hour", "this morning", "after 3pm").

4. Each item must be IMPOSSIBLE to apply to a different person's chart. If it could appear on anyone's ${dmEl} day reading, rewrite it.

5. NEVER output generic wellness advice (grounding, hydration, sugar, meditation). NEVER output vague action items ("opportunities aligned with goals").

6. The "do" should be a specific actionable task tied to the Ten God activation or Nobleman star.
7. The "avoid" should warn about a specific risk created by today's pillar interaction with their chart.
8. The "watch" should flag a specific energy shift or timing window based on branch interactions.

9. Chinese translations must be natural, not machine-translated.
10. Keep each item to 1-2 sentences max.`;
}

app.post('/api/daily-guidance', async (req, res) => {
  try {
    const { chartData } = req.body;
    if (!chartData?.pillars || !chartData?.today) {
      return res.status(400).json({ error: 'Missing chart data' });
    }

    // Cache key: unique per day master + today's pillar + full chart
    const dayPillar = chartData.pillars.find(p => p.label === 'Day');
    const cacheKey = `${dayPillar?.stem?.char}-${chartData.today.stem}-${chartData.today.branch}-${chartData.animal}`;
    const todayStr = new Date().toISOString().slice(0, 10);
    const cached = guidanceCache.get(cacheKey);
    if (cached && cached.date === todayStr) {
      return res.json(cached.data);
    }

    // Enrich today data with element info for the prompt
    const todayStemObj = bazi.STEMS.find(s => s.char === chartData.today.stem);
    chartData.today.stemElement = todayStemObj?.element || 'Wood';
    chartData.today.stemPolarity = todayStemObj?.polarity || 'Yang';

    const prompt = buildGuidancePrompt(chartData);

    let result;
    try {
      const completion = await deepseek.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: 'Generate today\'s DO/AVOID/WATCH for this chart.' },
        ],
        max_tokens: 300,
        temperature: 0.7,
      });
      result = completion.choices?.[0]?.message?.content?.trim();
    } catch (e) {
      // Fallback to Gemini
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: prompt,
      });
      const gemResult = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: 'Generate today\'s DO/AVOID/WATCH for this chart.' }] }],
        generationConfig: { maxOutputTokens: 300, temperature: 0.7, thinkingBudget: 0 },
      });
      result = gemResult.response.text().trim();
    }

    // Parse JSON from response (handle markdown code blocks)
    let parsed;
    try {
      const jsonStr = result.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      return res.status(500).json({ error: 'Failed to parse guidance' });
    }

    // Cache it
    guidanceCache.set(cacheKey, { date: todayStr, data: parsed });

    res.json(parsed);
  } catch (err) {
    console.error('Daily guidance error:', err.message);
    res.status(500).json({ error: 'Guidance generation failed' });
  }
});

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

// ── Share image generation ──
require('./share').mount(app);

app.listen(PORT, () => {
  console.log(`Wobazi server running on ${BASE_URL}`);
});
