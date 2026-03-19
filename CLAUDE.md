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

## UI: Tab Banner System (updated 2026-03-18)
- **Today, You, Relationships tabs**: Show a compact context strip (`#context-strip`) — single row with date, day pillar emoji+name+Chinese, overall score, and verdict. Tapping expands to show hero_text summary.
- **Actions tab**: Shows the full hero banner (`#hero-card`) with date, title, hero_text, and DO/AVOID/WATCH items.
- The rabbit circle medallion (`hc-med`) was removed from all tabs.
- `switchTab()` toggles visibility between `#context-strip` and `#hero-card` based on active tab.
- Context strip data is populated in `renderResults()` using `calcTodayPillar()`.
