/* ═══════════════════════════════════════
   WOBAZI — Oracle Backend
   server.js
═══════════════════════════════════════ */

require('dotenv').config({ path: '.env.local' });
const express = require('express');
const cookieSession = require('cookie-session');
const Database = require('better-sqlite3');
const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const bazi = require('./bazi-engine');
const seo = require('./seo/meta');
const { buildSystemPrompt: buildOraclePrompt } = require('./oracle/prompt');
const { buildGuidancePrompt, normalizeGuidance, luckLine, GUIDANCE_MAX_TOKENS } = require('./guidance/prompt');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

/* ── SQLite Database ── */
// Production must use the persistent disk: without DB_PATH the file would land on ephemeral storage and be wiped on deploy.
if (!process.env.DB_PATH && (process.env.RENDER === 'true' || process.env.NODE_ENV === 'production' || BASE_URL.startsWith('https'))) {
  console.error('[db] FATAL: DB_PATH is not set in production. Set it to the persistent disk path (e.g. /var/data/wobazi.db). Refusing to start.');
  process.exit(1);
}
const db = new Database(process.env.DB_PATH || path.join(__dirname, 'wobazi.db'));
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

function ensureColumn(table, name, def) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all();
  if (!cols.some(c => c.name === name)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${name} ${def}`);
  }
}
ensureColumn('readings', 'calendar_type', "TEXT DEFAULT 'solar'");
ensureColumn('readings', 'leap_month', 'INTEGER DEFAULT 0');
ensureColumn('readings', 'lunar_year', 'INTEGER');
ensureColumn('readings', 'lunar_month', 'INTEGER');
ensureColumn('readings', 'lunar_day', 'INTEGER');
ensureColumn('readings', 'minute', 'INTEGER');
ensureColumn('readings', 'monthly_forecasts', 'TEXT');
ensureColumn('readings', 'twin', 'INTEGER DEFAULT 0');
ensureColumn('readings', 'twin_order', 'TEXT');
ensureColumn('readings', 'twin_method', 'TEXT');

/* ── Cookie-based Session (survives Render deploys — no server-side store needed) ── */
const isProduction = process.env.NODE_ENV === 'production' || (process.env.BASE_URL || '').startsWith('https');
if (isProduction) app.set('trust proxy', 1); // trust first proxy (Render, Railway, etc.)

app.use(cookieSession({
  name: 'wobazi.session',
  keys: [process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex')],
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  sameSite: 'lax',
  httpOnly: true,
  secure: isProduction,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* One URL per page: a single leading slash, no repeated slashes, no trailing slash
   (except "/" itself, /app/ and the /api/ + /auth/ namespaces). See seo/url.js. */
app.use(require('./seo/url').normalizeUrl);

/* Static assets: versioned URLs (?v=) are immutable for a year; unversioned ones revalidate daily.
   Bump the ?v= on every file change. */
function staticCache(req, res, next) {
  res.set('Cache-Control', req.query.v ? 'public, max-age=31536000, immutable' : 'public, max-age=86400');
  next();
}

/* Share and invite links must preview on social apps (so they stay crawlable) but never be indexed. */
app.use(['/i', '/r', '/s', '/api/share-viral', '/api/share-image', '/api/share-story'], (req, res, next) => {
  res.set('X-Robots-Tag', 'noindex');
  next();
});

/* Signed-in user for server-rendered pages (nav + footer member links). */
app.use((req, res, next) => {
  res.locals.user = (req.session && req.session.user) || null;
  next();
});

/* ── EJS Templating ── */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* ── Static Files ── */
app.get('/app/index.html', (req, res, next) => sendApp(req, res, next));
app.use('/public', staticCache, express.static(path.join(__dirname, 'public'), { cacheControl: false }));
app.use('/app', staticCache, express.static(path.join(__dirname, 'app'), {
  index: false,
  redirect: false,
  cacheControl: false,
}));
// Serve logos and og-card from root for backward compat
app.use('/Logos', express.static(path.join(__dirname, 'Logos')));
app.use('/app/Logos', express.static(path.join(__dirname, 'Logos')));
app.use('/og-card.png', express.static(path.join(__dirname, 'og-card.png')));
app.use('/og-card.jpg', express.static(path.join(__dirname, 'og-card.jpg'), { maxAge: '7d' }));
app.get('/site.webmanifest', (req, res) => {
  res.type('application/manifest+json');
  res.set('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, 'public', 'site.webmanifest'));
});
app.get('/bazi-engine.js', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'bazi-engine.js'));
});
app.get('/verdict.js', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'share', 'verdict.js'));
});
app.get('/favicon.ico', (req, res) => {
  res.set('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});
app.get('/apple-touch-icon.png', (req, res) => {
  res.set('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, 'public', 'apple-touch-icon.png'));
});

/* ── SEO: Sitemap & Robots ── */
app.get('/sitemap.xml', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');
  res.type('application/xml').send(seo.sitemapXml());
});

app.get('/robots.txt', (req, res) => {
  // Share-card images live under /api/ but must stay fetchable: X and others obey robots.txt for previews.
  // /i/, /r/ and /s/ stay crawlable so links preview on X and others; they send X-Robots-Tag: noindex instead.
  res.type('text/plain').send(`User-agent: *
Allow: /
Allow: /api/share-viral
Allow: /api/share-image
Allow: /api/share-story
Disallow: /api/
Disallow: /auth/
Disallow: /wobazi2

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

/* The SPA shell gets the same footer partial as the EJS pages: every
   <!-- SITE_FOOTER --> marker in app/index.html is replaced at request time. */
const APP_INDEX = path.join(__dirname, 'app', 'index.html');
let appIndexCache = { mtime: 0, html: '' };
function appIndexHtml() {
  const mtime = fs.statSync(APP_INDEX).mtimeMs;
  if (mtime !== appIndexCache.mtime) appIndexCache = { mtime, html: fs.readFileSync(APP_INDEX, 'utf8') };
  return appIndexCache.html;
}
function renderPartial(view, locals) {
  return new Promise((resolve, reject) => app.render(view, locals, (err, html) => (err ? reject(err) : resolve(html))));
}
/* The app shell gets the same footer and header menu as the site pages, rendered for the signed-in state:
   <!-- SITE_FOOTER --> and <!-- NAV_MENU:<screen> --> markers are replaced per request. */
async function sendApp(req, res, next) {
  try {
    const user = res.locals.user;
    let html = appIndexHtml();
    const footer = await renderPartial('partials/footer', { user });
    /* The app is per-user: noindex, follow (its links are real pages). The indexable homepage
       is a separate server-rendered page (views/pages/landing.ejs) since Phase 2. */
    const meta = seo.chartLocals();
    const esc = v => String(v || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    html = html.replace('<!-- APP_HEAD_SEO: title, description, robots and social tags are rendered by sendApp -->', () => [
      `<title>${esc(meta.title)}</title>`,
      `  <meta name="description" content="${esc(meta.description)}">`,
      `  <meta name="robots" content="${esc(meta.robots)}">`,
      `  <meta property="og:url"         content="${seoBase.baseUrl}${meta.canonical}">`,
      `  <meta property="og:title"       content="${esc(meta.title)}">`,
      `  <meta property="og:description" content="${esc(meta.description)}">`,
      `  <meta property="og:image"       content="${seoBase.baseUrl}/og-card.jpg">`,
      `  <meta name="twitter:title"       content="${esc(meta.title)}">`,
      `  <meta name="twitter:description" content="${esc(meta.description)}">`,
      `  <meta name="twitter:image"       content="${seoBase.baseUrl}/og-card.jpg">`,
    ].join('\n'));
    html = html.split('<!-- SITE_FOOTER -->').join(footer);
    const screens = [...new Set([...html.matchAll(/<!-- NAV_MENU:(\w+) -->/g)].map(m => m[1]))];
    for (const ctx of screens) {
      const menu = await renderPartial('partials/nav-menu', { user, ctx });
      html = html.split(`<!-- NAV_MENU:${ctx} -->`).join(menu);
    }
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.type('html').send(html);
  } catch (err) {
    next(err);
  }
}
/* ── Landing (/) and the app (/chart) ──
   Phase 2 split them: `/` is a lean, indexable, server-rendered page; the app shell (input,
   results, portal, oracle, relationships) is served at /chart and is noindex, follow. */
app.get('/', (req, res, next) => {
  // Old entry points into the app keep working.
  if (req.query.begin === '1') return res.redirect(301, '/chart#input');
  if (req.query.auth) {
    const qs = Object.entries(req.query).filter(([k]) => k !== 'begin')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    return res.redirect(302, `/chart${qs ? `?${qs}` : ''}`);
  }
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate'); // guest vs member markup
    res.render('pages/landing', {
      ...seoBase,
      ...seo.pageLocals('/'),
      jsonLd: seo.homeJsonLd(),
      user: res.locals.user,
    });
  } catch (err) {
    next(err);
  }
});
app.get(['/index.html', '/index'], (req, res) => res.redirect(301, '/'));
app.get('/chart', sendApp);

app.use('/wobazi2-assets', express.static(path.join(__dirname, 'wobazi2-assets')));
app.get('/wobazi2', (req, res) => {
  res.sendFile(path.join(__dirname, 'wobazi2.html'));
});
app.get('/wobazi2.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'wobazi2.html'));
});

app.get('/s/:id', (req, res) => {
  const verdict = require('./share/verdict');
  const v = verdict.decodePayload(req.params.id);
  if (!v || !v.hook) return res.redirect(302, '/');
  const id = req.params.id;
  const img = `${seoBase.baseUrl}/api/share-viral?p=${encodeURIComponent(id)}&fmt=og`;
  const story = `${seoBase.baseUrl}/api/share-viral?p=${encodeURIComponent(id)}`;
  res.render('pages/share-card', {
    ...seoBase,
    title: `${v.hook} · Wobazi`,
    description: v.body || v.dare || v.hook,
    canonical: `/s/${id}`,
    noindex: true,
    ogImage: img,
    storyImage: story,
    verdict: v,
    shareId: id,
  });
});

app.get('/master-alice', (req, res) => {
  res.render('pages/master-alice', { ...seoBase, ...seo.pageLocals('/master-alice') });
});
app.get('/Master-Alice.html', (req, res) => res.redirect(301, '/master-alice'));
app.get('/about', (req, res) => res.redirect(301, '/master-alice'));

app.get('/what-is-bazi', (req, res) => {
  res.render('pages/what-is-bazi', { ...seoBase, ...seo.pageLocals('/what-is-bazi'), bazi });
});

app.get('/bazi-calculator', (req, res) => res.redirect(301, '/'));

app.get('/four-pillars-of-destiny', (req, res) => {
  res.render('pages/four-pillars', { ...seoBase, ...seo.pageLocals('/four-pillars-of-destiny'), bazi });
});

app.get('/chinese-astrology', (req, res) => {
  res.render('pages/chinese-astrology', { ...seoBase, ...seo.pageLocals('/chinese-astrology'), bazi });
});

app.get('/day-master', (req, res) => {
  res.render('pages/day-master', { ...seoBase, ...seo.pageLocals('/day-master'), bazi });
});

app.get('/bazi-compatibility', (req, res) => {
  res.render('pages/compatibility', { ...seoBase, ...seo.pageLocals('/bazi-compatibility'), bazi });
});

app.get('/privacy', (req, res) => {
  res.render('pages/privacy', { ...seoBase, ...seo.pageLocals('/privacy') });
});
app.get('/privacy-policy', (req, res) => res.redirect(301, '/privacy'));

app.get('/terms', (req, res) => {
  res.render('pages/terms', { ...seoBase, ...seo.pageLocals('/terms') });
});
app.get('/terms-of-service', (req, res) => res.redirect(301, '/terms'));
app.get('/tos', (req, res) => res.redirect(301, '/terms'));

/* ── SPA App (same front page as /; /app stays 200 to avoid a loop with cached 301s) ── */
app.get(['/app', '/app/'], sendApp);
app.get('/app/*', (req, res, next) => {
  if (path.extname(req.path)) return next();
  sendApp(req, res, next);
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

    // Set session and wait for it to persist before redirecting
    req.session.user = {
      googleId: profile.id,
      name: profile.name,
      email: profile.email,
      avatar: profile.picture,
    };

    console.log(`[auth] Session set for ${profile.name}`);
    res.redirect('/?auth=success');
  } catch (err) {
    console.error('[Google OAuth error]', err.message);
    res.redirect('/?auth=error');
  }
});

/* ── Logout ── */
app.get('/auth/logout', (req, res) => {
  req.session = null; // cookie-session: clear by setting to null
  res.redirect('/');
});

/* ── Current user ── */
app.get('/api/city-suggest', async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (q.length < 2 || q.length > 80) return res.json({ suggestions: [] });
  try {
    const url = 'https://photon.komoot.io/api/?limit=6&lang=en&q=' + encodeURIComponent(q);
    const r = await fetch(url, { headers: { 'User-Agent': 'WoBazi/1.0 (https://wobazi.com)' } });
    if (!r.ok) throw new Error('photon ' + r.status);
    const data = await r.json();
    const seen = new Set();
    const suggestions = [];
    (data.features || []).forEach(f => {
      const p = f.properties || {};
      const name = p.name || '';
      const city = p.city || p.county || '';
      const state = p.state || p.region || '';
      const country = p.country || '';
      const parts = [name];
      if (city && city !== name) parts.push(city);
      if (state && state !== city && state !== name) parts.push(state);
      if (country) parts.push(country);
      const label = parts.filter(Boolean).join(', ');
      if (label && !seen.has(label)) {
        seen.add(label);
        suggestions.push(label);
      }
    });
    res.json({ suggestions });
  } catch (err) {
    console.error('[city-suggest]', err.message);
    res.json({ suggestions: [] });
  }
});

app.get('/api/me', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ user: req.session.user });
  }
  res.json({ user: null });
});

/* ═══════════════════════════════════════
   DATA PERSISTENCE API
═══════════════════════════════════════ */

/* ── Save reading ── */
app.post('/api/save-reading', (req, res) => {
  if (!req.session || !req.session.user) return res.status(401).json({ error: 'Not logged in' });
  const {
    name, year, month, day, hour, minute, birthplace, bloodType, gender,
    calendarType, leapMonth, lunarYear, lunarMonth, lunarDay, monthlyForecasts,
    twin, twinOrder, twinMethod,
  } = req.body;
  db.prepare(`
    INSERT INTO readings (
      google_id, name, year, month, day, hour, birthplace, blood_type, gender,
      calendar_type, leap_month, lunar_year, lunar_month, lunar_day, minute, monthly_forecasts,
      twin, twin_order, twin_method, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(google_id) DO UPDATE SET
      name=excluded.name, year=excluded.year, month=excluded.month, day=excluded.day,
      hour=excluded.hour, birthplace=excluded.birthplace, blood_type=excluded.blood_type,
      gender=excluded.gender, calendar_type=excluded.calendar_type, leap_month=excluded.leap_month,
      lunar_year=excluded.lunar_year, lunar_month=excluded.lunar_month, lunar_day=excluded.lunar_day,
      minute=excluded.minute, monthly_forecasts=excluded.monthly_forecasts,
      twin=excluded.twin, twin_order=excluded.twin_order, twin_method=excluded.twin_method, updated_at=datetime('now')
  `).run(
    req.session.user.googleId, name, year, month, day, hour || null, birthplace || null, bloodType || null, gender || null,
    calendarType || 'solar', leapMonth ? 1 : 0, lunarYear || null, lunarMonth || null, lunarDay || null,
    minute != null ? minute : null,
    monthlyForecasts ? JSON.stringify(monthlyForecasts) : null,
    twin ? 1 : 0,
    twin && twinOrder === 'younger' ? 'younger' : (twin ? 'elder' : null),
    twin && ['luck', 'hour'].includes(twinMethod) ? twinMethod : null
  );
  res.json({ ok: true });
});

/* ── Save Oracle chat ── */
app.post('/api/save-chat', (req, res) => {
  if (!req.session || !req.session.user) return res.status(401).json({ error: 'Not logged in' });
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
  if (!req.session || !req.session.user) return res.status(401).json({ error: 'Not logged in' });
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

/* Model ids in one place. Defaults are the models in use; the env vars exist so a model can be
   rolled forward or back without a deploy of new code. */
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* Oracle system prompt (with today's Bangkok date, annual and luck pillars): oracle/prompt.js */

async function streamDeepSeek(systemPrompt, messages, res) {
  const stream = await deepseek.chat.completions.create({
    model: DEEPSEEK_MODEL,
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
    model: GEMINI_MODEL,
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
const guidanceCache = new Map(); // key: sha1(natal pillars | today's pillar | zodiac | luck pillar) → { date, data }

/* Birth data for the running luck pillar (大运): the saved chart for signed-in users, else
   what the browser sent. Used by both the Oracle and the daily guidance prompt. */
function birthForLuck(req, chartData) {
  const saved = req.session && req.session.user
    ? db.prepare('SELECT year, month, day, hour, minute, gender, twin, twin_order, twin_method FROM readings WHERE google_id = ?').get(req.session.user.googleId)
    : null;
  return saved
    ? { ...saved, twin: saved.twin ? { enabled: true, order: saved.twin_order, method: saved.twin_method } : null }
    : (chartData && chartData.birth) || null;
}

app.post('/api/daily-guidance', async (req, res) => {
  try {
    const { chartData } = req.body;
    if (!chartData?.pillars || !chartData?.today) {
      return res.status(400).json({ error: 'Missing chart data' });
    }

    /* Cache key: every natal pillar plus today's pillar and the running luck pillar. The old key
       was day stem + today + zodiac animal, so two different charts that happened to share those
       got each other's reading — more visible now the prompt carries the luck pillar. */
    const birth = birthForLuck(req, chartData);
    const chartKey = (chartData.pillars || [])
      .map(p => (p && p.known !== false && p.stem ? p.stem.char + (p.branch ? p.branch.char : '') : '--')).join('');
    const cacheKey = crypto.createHash('sha1')
      .update([chartKey, chartData.today.stem, chartData.today.branch, chartData.animal, luckLine(birth)].join('|'))
      .digest('hex').slice(0, 16);
    const todayStr = new Date().toISOString().slice(0, 10);
    /* GUIDANCE_CACHE=off makes every request hit the model — used by test/guidance.test.js
       to exercise the real parse path; unset in normal runs. */
    const useCache = process.env.GUIDANCE_CACHE !== 'off';
    const cached = useCache ? guidanceCache.get(cacheKey) : null;
    if (cached && cached.date === todayStr) {
      return res.json(cached.data);
    }

    // Enrich today data with element info for the prompt
    const todayStemObj = bazi.STEMS.find(s => s.char === chartData.today.stem);
    chartData.today.stemElement = todayStemObj?.element || 'Wood';
    chartData.today.stemPolarity = todayStemObj?.polarity || 'Yang';

    const prompt = buildGuidancePrompt(chartData, { birth });

    /* Attempts: DeepSeek in JSON mode, then DeepSeek again (a truncated or malformed reply is
       usually a one-off), then Gemini. Each returns the raw text so a failure can be logged. */
    const userTurn = 'Generate today\'s DO/AVOID/WATCH for this chart.';
    const askDeepSeek = async () => {
      const completion = await deepseek.chat.completions.create({
        model: DEEPSEEK_MODEL,
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: userTurn },
        ],
        response_format: { type: 'json_object' },
        max_tokens: GUIDANCE_MAX_TOKENS,
        temperature: 0.7,
      });
      return {
        source: 'deepseek',
        text: completion.choices?.[0]?.message?.content?.trim(),
        finish: completion.choices?.[0]?.finish_reason,
        usage: completion.usage?.completion_tokens,
      };
    };
    const askGemini = async () => {
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL, systemInstruction: prompt });
      const gemResult = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: userTurn }] }],
        generationConfig: {
          maxOutputTokens: GUIDANCE_MAX_TOKENS,
          temperature: 0.7,
          /* thinkingBudget belongs under thinkingConfig; at the top level the API 400s,
             which is why this fallback never actually ran. */
          thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: 'application/json',
        },
      });
      const cand = gemResult.response?.candidates?.[0];
      return {
        source: 'gemini',
        text: gemResult.response.text().trim(),
        finish: cand?.finishReason,
        usage: gemResult.response?.usageMetadata?.candidatesTokenCount,
      };
    };

    let parsed = null;
    const failures = [];
    for (const attempt of [askDeepSeek, askDeepSeek, askGemini]) {
      let out;
      try {
        out = await attempt();
      } catch (e) {
        failures.push(`${attempt === askGemini ? 'gemini' : 'deepseek'}: request failed — ${e.message}`);
        continue;
      }
      try {
        const jsonStr = String(out.text || '').replace(/```json?\n?/g, '').replace(/```/g, '').trim();
        const candidate = normalizeGuidance(JSON.parse(jsonStr));
        if (!candidate) throw new Error('missing do/avoid/watch text in either language');
        parsed = candidate;
        break;
      } catch (e) {
        /* Log enough to diagnose: finish_reason 'length' means the reply was truncated. */
        failures.push(`${out.source}: ${e.message} (finish_reason=${out.finish}, completion_tokens=${out.usage}, chars=${(out.text || '').length})`);
        console.error(`[daily-guidance] unparseable ${out.source} reply (finish_reason=${out.finish}, completion_tokens=${out.usage}):`, JSON.stringify(String(out.text || '').slice(0, 1000)));
      }
    }

    if (!parsed) {
      console.error(`[daily-guidance] all attempts failed for ${cacheKey}: ${failures.join(' | ')}`);
      return res.status(503).json({ error: 'Guidance unavailable', code: 'guidance_unavailable', attempts: failures.length });
    }

    // Cache it
    if (useCache) guidanceCache.set(cacheKey, { date: todayStr, data: parsed });

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

  const systemPrompt = buildOraclePrompt(chartData, { birth: birthForLuck(req, chartData) });
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

// ── Registered user portal ──
require('./portal').mount(app, db);

// ── Relationships (people, pair readings, invites, public share pages) ──
require('./relationships').mount(app, db, { deepseek, genAI });

/* ── 404 + error pages (must stay after every route) ── */
function wantsJson(req) {
  return req.path.startsWith('/api/') || req.path.startsWith('/auth/') || (req.get('accept') || '').indexOf('text/html') === -1;
}
app.use((req, res) => {
  if (wantsJson(req)) return res.status(404).json({ error: 'Not found' });
  res.status(404).render('pages/404', {
    ...seoBase,
    title: 'Page not found | Wobazi',
    description: 'This page could not be found. Plot your free BaZi chart instead.',
    canonical: req.path,
    noindex: true,
  });
});
app.use((err, req, res, next) => {
  console.error('[Unhandled error]', req.method, req.path, err && err.stack || err);
  if (res.headersSent) return next(err);
  if (wantsJson(req)) return res.status(500).json({ error: 'Something went wrong' });
  res.status(500).render('pages/404', {
    ...seoBase,
    title: 'Something went wrong | Wobazi',
    description: 'Something went wrong on our side. Please try again.',
    canonical: req.path,
    noindex: true,
    errorPage: true,
  });
});

app.listen(PORT, () => {
  console.log(`Wobazi server running on ${BASE_URL}`);
  // Shows on every deploy whether the database survived (it must live on the persistent disk in production).
  try {
    const count = t => db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get().n;
    console.log(`[db] ${db.name} · ${count('users')} users · ${count('reading_snapshots')} saved readings`);
  } catch (err) {
    console.error('[db] Could not read database stats:', err.message);
  }
});
