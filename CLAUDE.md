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
- `DB_PATH` — SQLite file path. Local dev defaults to `./wobazi.db`. In production (`RENDER=true`, `NODE_ENV=production`, or an https `BASE_URL`) `server.js` and `batch-worker.js` refuse to start without it. On Render it is `/var/data/wobazi.db` (1 GB persistent disk).
- `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET` — Litestream backup target (Cloudflare R2), read only by `litestream.yml`.

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
- `people`, `relationship_readings`, `relationship_invites`, `relationship_share_links`, `user_birth_places` — Relationships (see below)
- `daily_readings` — AI-generated daily BaZi readings (added by batch system)
  - Indexed on (user_id, date) for fast lookup
  - One record per user per day

## Backups — Litestream (added 2026-09-16)
- Render Build Command downloads a pinned, checksum-verified Litestream (v0.5.17, linux x86_64) into `./bin/`. Start Command: `./bin/litestream replicate -config litestream.yml -restore-if-db-not-exists -exec "npm start"` (`npm start` is unchanged).
- `litestream.yml` expands every value from the environment (no secrets in the file). Replica: `s3://$R2_BUCKET/wobazi.db` on R2. Snapshot every 24h, restore points kept 7 days. Litestream owns WAL checkpoints; the app keeps WAL mode + better-sqlite3's default 5s busy timeout.
- `-restore-if-db-not-exists`: if the disk file is missing at boot, restore from R2 before the app starts instead of creating an empty database.
- Two layers: Render disk snapshots + Litestream to R2.
- Restore (Render Shell): `cd /opt/render/project/src && ./bin/litestream restore -config litestream.yml -o /var/data/restored.db -integrity-check full "$DB_PATH"`, check it, move `wobazi.db*` and `.wobazi.db-litestream` aside, rename `restored.db` → `wobazi.db`, restart the service.

## Batch System (NOT MOUNTED — added 2026-03-18)

> Status 2026-09-16: `server.js` does **not** call `require('./batch').mount(app, db)`, so no cron runs, the batch routes don't exist, and there is no `daily_readings` table in production. The frontend doesn't call `/api/daily-reading`. Mounting it is a separate post-launch decision: node-cron uses server time (UTC on Render, so "midnight" = 07:00 Bangkok) and dates are UTC; a separate Render Cron Job cannot reach this service's disk.

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

## Registered User Portal (added 2026-09-14)

Google sign-in only. Mounted in `server.js` via `require('./portal').mount(app, db)`. Client: `app/portal.js` (loaded before `script.js`) + `app/portal.css`, one `#portal` screen in `app/index.html`, reached from the header menu ("My Wobazi", signed-in only). No new env vars.

- **Routes (hash)**: `#portal` home · `#history` · `#history/YYYY-MM-DD` · `#account`
- **Snapshots** (`reading_snapshots`): after the Today reading renders for a signed-in user, `WobaziPortal.captureToday()` stores the context strip + hero card markup and a text summary (incl. luck pillar as rendered). One per user per local day; `INSERT OR IGNORE`, never regenerated.
- **Journal** (`journal_entries`): note + reaction (`accurate|off|unsure`) per snapshot day. Private; never used for training or aggregate.
- **Continuity**: days read, of last 30 days, days noted — no streak resets.
- **Account**: export `/api/portal/export?format=json|md`; `POST /api/portal/delete-account {confirm:"DELETE"}` wipes users, readings, oracle_chats, snapshots, journal, daily_readings, legacy sessions.
- **Guest conversion**: one dismissible "Keep this chart" card per device (`localStorage wobazi_keep_prompt_v1`). After sign-in, `onAuth()` saves the browser's chart to `readings` only if the account has none.
- Hooks in `script.js`: `captureToday` at the end of the daily-guidance IIFE, `onAuth` in `checkAuth`, `isRoute/route` in `applyRoute`.

## Relationships: people, pair readings, invites, sharing (added 2026-09-17)

Mounted in `server.js` via `require('./relationships').mount(app, db, { deepseek, genAI })` (reuses the existing AI clients). Everything lives inside the existing Relationships tab (labelled **People** in the tab bar since 2026-09-17; the hash stays `#relationships`): `#res-rel-people` ("My People") is the first section; the older sections (Love forecast, Compatibility, Profile, Compatibility Check, Soul Animals, Business) are unchanged below it. Client: `app/rel-form.js` (shared birth form) + `app/relationships.js` + `app/relationships.css`, loaded after `script.js`. No new env vars except the optional paywall flag.

- **Routes (hash)**: `#relationships` list · `#relationships/p/:id` person page. Hook: `WobaziRel.isRoute/route` in `applyRoute` (before the portal hook). While a person page is open, `#results.rel-detail-open` hides the other Relationships sections and chip bar.
- **Tables** (`relationships/schema.js`, `up`/`down`): `people` (manual rows hold the birth data the owner typed; invite-linked rows hold none and read the other account's `readings` live), `relationship_readings` (one per person row, keyed by `input_hash` of both charts + type), `relationship_invites` (14 days, single use), `relationship_share_links` (`revoked_at`), `user_birth_places`. Drop all: `node relationships/migrate.js down --confirm` (note a Litestream restore point first).
- **Calculation vs wording**: `relationships/scoring.js` computes everything deterministically (Element Complementarity, Day Master Dynamic, Branch Harmony vs Clash across all known branch pairs, 3–5 friction candidates, Spouse Palace needs/offers for romantic, work style for business). Pair archetype names come from the fixed catalog in `archetypes.js`, never from the LLM. The LLM (`prompt.js`) gets facts only, no names or dates, and writes `{name}` for the other person; the client substitutes the first name.
- **Generation** (`readings.js` + `llm.js`): once per person on add, cached; regenerated only when `input_hash` changes (either chart or the type). Rename does not regenerate. DeepSeek (`response_format: json_object`) → `validate.js` → Gemini 2.5 Flash (`responseMimeType: application/json`) → validate. Both fail → `status: 'error'`, scores/archetype still show, Retry button. Facts are stored at `pending`, so archetype + scores render immediately; `pending` older than 2 min after a restart is restarted.
- **Validation rules**: required keys and lengths, friction ids must come from the candidates, only the type's section, banned wording (fatalism, mysticism, gendered pronouns/roles, years).
- **Invites**: `/i/:token` (public) shows a Day Master teaser; birth data is kept in the cookie session (`relInvite`) during Google sign-in; `relationships.js` finishes `POST /api/rel/invites/accept` on return (`localStorage wobazi_rel_invite_pending` or `?auth=success`). Accept saves the recipient's chart to `readings` if they have none and creates a linked `people` row on both accounts. LINE in-app browser is bounced out with `openExternalBrowser=1`; Instagram/Facebook webviews show an "Open in browser" note (Google blocks sign-in there).
- **Sharing**: `/r/:token` public page + `/r/:token/story.png` (1080×1920) and `/og.png` (1200×630), rendered with the share fonts + `relationships/fonts/NotoSansThai-Bold.ttf`, cached as PNGs in `rel-share-cache/` next to `DB_PATH` (temp dir locally; disposable). Content: first names, archetype, catalog description, three scores. The other person's first name is off by default for every person (manual and linked); fallback is "their partner / a friend / a family member / a business partner". Revoked or unknown tokens render `rel-gone.ejs` with 404.
- **Paywall**: `RELATIONSHIPS_PAYWALL=on` enables free = 1 person + headline + scorecard; paid = unlimited + friction map + type sections. Unset = off (default). `flags.isPaidUser` is the billing hook (always false). Invite and share pages ignore it.
- **Account delete / export**: `portal/routes.js` calls `relationships/account.js` `wipeUser` inside the same transaction as the rest of the delete. It removes the user's people, rows in other users' lists linked to them (deleted outright, not left as placeholders), their pair readings and share links, invites they sent or accepted, and `user_birth_places`; cached share PNGs are purged after commit. Export lists people with birth data only for rows the user typed.
- Tests: `node --test test/relationships.test.js` (not in `npm test`).

### Known accuracy issue: every chart uses +08:00 (first post-launch task)
Every chart, including the user's own chart and all people, is calculated in the engine default `tzOffsetMinutes: +480`, whatever the birth place. Births outside UTC+8 (e.g. Bangkok +7, Sydney +10, US) can land in the wrong hour pillar, and near midnight or a 节 boundary the wrong day or month pillar. It was kept deliberately so existing readings don't change.

Data is being collected now: `people.birth_lat/lon/country/birth_tz/birth_tz_source` for new people, and `user_birth_places` for account holders (from invite drafts, or geocoded in the background from `readings.birthplace` when the People list loads). `tz_source` is `country` (exact, single-zone country) or `longitude` (nearest standard offset among the country's zones; approximate).

Migration plan:
1. Resolve IANA zones precisely from stored lat/lon (a coordinate→tz lookup) and backfill `user_birth_places` for users whose birthplace label never geocoded; ask users with no birthplace to confirm one.
2. Compute the historical UTC offset for the birth instant from the IANA zone (DST and pre-1970 rules), and pass it as `tzOffsetMinutes` in `calcBaziAccurate` from the app, portal, batch and relationships (`relationships/chart.js`) at the same time, so every side of a pair uses the same convention.
3. Show a one-time "Your chart was updated for your birth time zone" notice where a pillar changes; don't rewrite stored `reading_snapshots` history.
4. Bump `FACTS_VERSION` in `relationships/scoring.js` so pair readings regenerate on next open.
5. Consider true solar time (longitude + equation of time) as a separate, later option.

## Shared nav + footer (updated 2026-09-16)
- `views/partials/footer.ejs` is the one site footer. EJS pages include it; `sendApp` in `server.js` renders it into every `<!-- SITE_FOOTER -->` marker in `app/index.html` (landing + results). Footer CSS lives in `app/style.css` (`.seo-footer*`).
- `views/partials/nav-menu.ejs` is the right side of every header plus its menu. EJS pages include it with `ctx: 'site'`; `sendApp` renders it into each `<!-- NAV_MENU:<ctx> -->` marker (`landing`, `input`, `results`, `portal`, `oracle`). Signed-in state comes from `res.locals.user` (cookie session), so the header is correct on first paint.
  - Guest: BaZi Explainer + Master Alice text links (desktop), Google "Sign in", menu button. Members: avatar button only. CTA on `site`/`landing`: "Plot Your Chart" for guests, "See Your Chart" (`/#you`) for members.
  - Menu (icons): member head · My Wobazi (star) · Reading History · Share + Edit birth data (results) · See Your Chart (members, site/landing) · BaZi Explainer · Master Alice · Language · Log out. Guests also get Sign in with Google (+ Plot Your Chart CTA).
  - App links keep real hrefs and call `appNav(event, action)` in `script.js`.
- Every header uses the same 10px vertical padding (safe-area aware) and, ≥768px, the centred content column gutters.
- Landing auth block is chosen server-side too: `sendApp` keeps `<!-- SPLASH_GUEST -->…` (Plot/Continue CTA + "No account needed" line) for guests or `<!-- SPLASH_MEMBER -->…` (welcome card, name filled at `<!-- SPLASH_WELCOME -->`, HTML-escaped) for members, and strips the other. The client only toggles guest chart state (Plot Your Chart vs Continue Your Reading).

## i18n (EN / TH / ZH) (updated 2026-09-16)
- Custom system in `public/js/i18n.js`: `.en/.zh/.th` sibling spans, `data-i18n` / `data-i18n-placeholder` / `data-i18n-aria` keys, and a phrase lookup (`WoBaziI18n.lookup(english, lang)`) used when a Thai or Chinese copy is missing. `_t(en, zh, th)` in `script.js` falls back to that lookup.
- `public/js/i18n-app-th.js` (app only): Thai keyed by English phrase for the content tables in `script.js`, plus a few Thai+Chinese rows and keyed rows (Oracle chips, form placeholders, aria labels). New table text needs a row here or a `_th` value.
- `public/js/i18n-site.js` (website pages via `head.ejs`): Thai + Chinese for `/chinese-astrology` and `/day-master`, keyed by the English of each `.en` element.
- All three languages share one font stack (`Outfit, Noto Sans SC, Noto Sans Thai`); no per-language font or size overrides.
- The ⓘ explanation sheet shows only the selected language (`TIPS[key].title_th/body_th`).
- Not translated: AI output (daily DO/AVOID/WATCH has no Thai; Oracle replies), share-image text, pinyin/BaZi terms, `/privacy` and `/terms`.

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

API: `calcBaziAccurate({ year, month, day, hour, calendar, leapMonth, tzOffsetMinutes, minute, gender, twin })` — `month` is **1-indexed**. Legacy `calcBazi(y, month0, d, h)` still uses 0-indexed month.

### Display order
The Four Pillars row renders **Hour → Day → Month → Year** (traditional right-to-left 命盘, matches FengshuiX). The `pillars` array stays `[Year, Month, Day, Hour]` everywhere in code. A "Chart for 29 Apr 1995 · 08:45 · Solar" line sits above it so a Lunar/Solar mix-up is visible (a lunar 1995-04-29 gives 乙亥 辛巳 己未 戊辰, not 乙亥 庚辰 庚寅 庚辰).

### 大运 Luck Pillars (added 2026-09-13)
- Returned as `result.luck` when `gender` is `'M'|'F'` (null otherwise).
- Yang year + male or Yin year + female → forward from the month pillar; else backward.
- Start age = days to next 节 (forward) / since previous 节 (backward) ÷ 3 (1 day = 4 months). 9 pillars (~90 years).
- Reference: 1995-04-29 08:45 female → starts 2 yrs 4 mo, 辛巳 1997, 壬午 2007, 癸未 2017, 甲申 2027 (FengshuiX).
- `luckPillarAt(luck, age)` returns the running pillar. Batch prompts use it (gender defaults to M there).

### Twins 双胞胎 (added 2026-09-13)
- `twin: { enabled, order: 'elder'|'younger', method: 'luck'|'hour' }`. Elder keeps the natal chart.
- Younger, `luck` 大运法: month pillar ← first luck pillar; luck list starts one step later, same start age. Needs gender.
- Younger, `hour` 时柱法: hour pillar → next in the 60 cycle. Needs birth time.
- Shifted pillars carry `twinShifted: true` and `natal`; `result.twin` records `applied` / `reason`.
- Stored in `readings.twin`, `twin_order`, `twin_method`; localStorage payload `twin`.

Fixtures: `npm test` (`test/bazi-engine.test.js`) vs lunar-javascript / BaZi Lab 排盘 (no true solar time).

### Power Days 择日 (updated 2026-09-15)
- Engine: `DATE_OBJECTIVE_GROUPS` (For you · Business · Career · Love & family · Home & travel · Wellbeing) → `DATE_OBJECTIVES` (pitch, negotiate, contract, launch, business, job, startjob, raise, study, date, propose, wedding, reconcile, travel, move, renovate, purchase, health, declutter, newlook, personal). Each lists the 建除 officers it favours; `noble: true` objectives weight 天乙贵人 days +20 instead of +14.
- `scoreDayForChart` reasons carry `short` and `hint` ({en,zh,th}) so the UI can explain each ✓/✕ in plain words. `personal` never earns `purpose-fit`.
- UI (Actions tab, right after Today's Action Plan): "Best dates for [grouped dropdown ▾]" → top 3 in the next 8 weeks as compact columns → pageable month grid (12 months) → explained date card (side by side when the card is ≥680px). Outfit guide sits last on the Actions tab.
- Calendar cells: plain number = Ordinary (<60), green ring = Good (60–71), gold disc = Power (72+), red struck-through = Avoid (clash year/day branch or 破 day, regardless of score). Legend is a score scale plus a separate Avoid line.
- A branch relation (六合/三合/六害/相刑) hitting both year and day branch is one reason (`punish-year-day` etc.), scored per branch.

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
- **Context strip** (`#context-strip`) is rendered but hidden on every tab; Today's Fortune (`#daily-card`) shows the day pillar + the single daily score on the strip's gradient. The strip markup is still captured for portal history snapshots. Previously it showed a compact context strip (`#context-strip`) — single row with date, day pillar emoji+name+Chinese, overall score, and verdict. Tapping expands to show hero_text summary.
- **Actions tab**: Shows the full hero banner (`#hero-card`) with date, title, hero_text, and DO/AVOID/WATCH items.
- The rabbit circle medallion (`hc-med`) was removed from all tabs.
- `switchTab()` toggles visibility between `#context-strip` and `#hero-card` based on active tab.
- Context strip data is populated in `renderResults()` using `calcTodayPillar()`.
