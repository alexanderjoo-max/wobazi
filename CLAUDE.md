# WoBazi — Project Guide

## Overview
BaZi (Four Pillars of Destiny) web app with AI Oracle. Express + SQLite + vanilla JS SPA.

## Tech Stack
- **Backend**: Express 4.21, Node.js
- **Database**: SQLite3 via better-sqlite3 (WAL mode), file: `wobazi.db`
- **AI**: DeepSeek (primary, via OpenAI SDK), Gemini 2.5 Flash (fallback)
- **Auth**: Google OAuth 2.0 + express-session (SQLite session store)
- **Frontend**: Vanilla JS SPA in `app/`
- **SEO**: EJS pages in `views/pages/`
- **BaZi Engine**: `bazi-engine.js` (UMD, shared client/server)

## Key Commands
```bash
npm start          # Start server (port 3000)
npm run dev        # Same as start
node batch-worker.js  # Run daily reading batch manually
```

## Environment Variables
- `DEEPSEEK_API_KEY` — DeepSeek API
- `GEMINI_API_KEY` — Google Gemini API
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — OAuth
- `SESSION_SECRET` — Session signing
- `BATCH_SECRET` — Protects the manual batch trigger endpoint
- `BASE_URL` — Server URL (defaults to http://localhost:3000)
- `PORT` — Server port (defaults to 3000)

## Project Structure
```
server.js              Main Express server
bazi-engine.js         Shared BaZi calculation engine (UMD)
batch-worker.js        Standalone batch job runner
batch/                 Daily reading batch generation system
  index.js             Entry point — mount(app, db) wires everything
  schema.js            daily_readings table migration
  generate.js          Core batch logic (AI calls, parsing, saving)
  prompt.js            AI prompt builder (system + user prompts)
  bazi-helpers.js      Advanced BaZi calculations (stars, clashes, etc.)
  routes.js            API routes (batch trigger + read endpoint)
  cron.js              node-cron scheduler (midnight daily)
share/                 Dynamic share image generation (Satori + Resvg)
  index.js             Entry point — mount(app) wires routes
  layout.js            Satori layout definitions (square + story)
  render.js            PNG generation (font loading, Satori → SVG → PNG)
  routes.js            API routes (/api/share-image, /api/share-story)
  fonts/               TTF fonts (Space Grotesk, Noto Sans SC)
app/                   Frontend SPA
views/                 EJS SEO pages
public/                Static assets for SEO pages
```

## Database Tables
- `users` — Google OAuth users (PK: google_id)
- `readings` — User birth data (PK: google_id)
- `oracle_chats` — Chat history (PK: google_id)
- `sessions` — Express sessions
- `daily_readings` — AI-generated daily BaZi readings (added by batch system)
  - Indexed on (user_id, date) for fast lookup
  - One record per user per day

## Batch System (NEW — added 2026-03-18)

### What it does
Generates personalized daily BaZi readings for every active user using DeepSeek V3.2 (Gemini 2.0 Flash fallback). Processes users in batches of 10 with 1-second delays.

### How to integrate
Add one line to `server.js` before `app.listen()`:
```js
require('./batch').mount(app, db);
```

### API Endpoints (batch system)
- `POST /api/batch/generate-daily-readings` — Manual batch trigger
  - Header: `x-batch-secret: <BATCH_SECRET>`
- `GET /api/daily-reading?date=YYYY-MM-DD` — Get authenticated user's reading
  - Uses existing session auth

### Standalone runner
```bash
node batch-worker.js   # For Render cron jobs or manual runs
```

### Cron
When mounted, runs at midnight server time daily via node-cron. Configure schedule via `mount(app, db, { cronSchedule: '0 0 * * *' })`.

## Share Image System (added 2026-03-19)

### What it does
Generates dynamic 1080×1080 (square) and 1080×1920 (story) PNG share images using Satori + @resvg/resvg-js. Dark purple gradient with gold card layout showing archetype, fortune scores, and oracle message.

### How to integrate
Add one line to `server.js` before `app.listen()`:
```js
require('./share').mount(app);
```

### API Endpoints (share system)
- `GET /api/share-image?name=...&date=...&archetype=...&love=...&career=...&health=...&wealth=...&oracle=...` — 1080×1080 PNG
- `GET /api/share-story?...` (same params) — 1080×1920 PNG

### Frontend integration
`doShare()` in `script.js` calls `generateShareImage()` which fetches the PNG, creates a File object, and passes it to `navigator.share({ files: [...] })` for native image sharing on mobile.

## API Conventions
- Routes: kebab-case (`/api/daily-reading`)
- Auth check: `if (!req.session.user)` → 401
- Responses: `{ ok: true }`, `{ error: "..." }`, or data objects
- No API versioning

## BaZi Engine (updated 2026-08-28)

`bazi-engine.js` is the shared UMD source of truth (client + server).

### Calendar type vs true solar time
- **Calendar type** converts the *date*: Solar/Gregorian vs Lunar/农历 (with 闰月). Lunar Y/M/D is converted to a Gregorian civil date **before** any 排盘.
- **True solar time** (longitude + equation of time) is **not** in this pass. The UI states: “Chart uses local clock time (not true solar time).”
- Default `tzOffsetMinutes` is `+480` (UTC+8), the usual 排盘 default when no birth timezone is stored.

### 排盘 rules
- **Year pillar** changes at **立春**, not Jan 1 and not 春节.
- **Month pillar** follows the 12 节: 立春, 惊蛰, 清明, 立夏, 芒种, 小暑, 立秋, 白露, 寒露, 立冬, 大雪, 小寒.
- **Day pillar** is the sexagenary day from Julian Day at civil noon (offset −11; 2000-01-07 = 甲子). Day changes at **00:00**, not 23:00.
- **Hour convention (夜子时)**: 子时 = 23:00–00:59. Early 子 (23:00–23:59) keeps today’s day pillar but takes the **next civil day’s hour stem**. Late 子 (00:00–00:59) uses the current day’s stem.
- **藏干** are attached to each branch. Ten Gods weight visible stem 1.0 / main hidden 0.5 / mid 0.3 / residual 0.2.

API: `calcBaziAccurate({ year, month, day, hour, calendar, leapMonth, tzOffsetMinutes, minute })` — `month` is **1-indexed**. Legacy `calcBazi(y, month0, d, h)` still uses 0-indexed month.

Fixtures: `npm test` (`test/bazi-engine.test.js`) vs lunar-javascript / BaZi Lab 排盘 (no true solar time).

### Hash routing (SPA)
- `/` landing
- `/#input` birth form (prefilled from `localStorage` `wobazi_chart_v1`)
- `/#today` `/#you` `/#actions` `/#relationships` — each tab is a history state
- Begin → push `#input`. Calculate → push `#today`. Back: tab → tab → input (fields kept) → landing.
- Refresh on `/#today` restores the last chart. Guest cache is localStorage; signed-in `readings` remain source of truth.

### Ten Gods + monthly forecasts
- Ten Gods bars live on the You tab; the vector is sent to `/api/oracle` and daily-guidance / batch prompts.
- Monthly love + career strips are deterministic: `hash(userId, birthChartKey, domain, year)` + 流月 pillar / 十神 / clash-combine. Cached with the chart; recalc when year or birth data changes.

## UI: Tab Banner System (updated 2026-03-18)
- **Today, You, Relationships tabs**: Show a compact context strip (`#context-strip`) — single row with date, day pillar emoji+name+Chinese, overall score, and verdict. Tapping expands to show hero_text summary.
- **Actions tab**: Shows the full hero banner (`#hero-card`) with date, title, hero_text, and DO/AVOID/WATCH items.
- The rabbit circle medallion (`hc-med`) was removed from all tabs.
- `switchTab()` toggles visibility between `#context-strip` and `#hero-card` based on active tab.
- Context strip data is populated in `renderResults()` using `calcTodayPillar()`.
