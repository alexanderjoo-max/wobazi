# SEO overhaul — handoff

Last updated: 2026-09-17. Launch: **2026-09-24**. Site: https://wobazi.com (Render, behind Cloudflare).

## 1. Current state

### `main`
Up to date with `origin/main`. Latest commits:

| Commit | What |
|---|---|
| `c28369d` | Oracle date awareness: `oracle/prompt.js` puts today's Asia/Bangkok date, the annual (流年) and day pillars, the user's running 10-year luck pillar, this-week/next-week ranges and a "never suggest a past date" rule into every `/api/oracle` prompt. Tests in `test/oracle.test.js` (unit + live "best date next week"). Pushed, deploys independently of the SEO work. |
| `de1d94b` | Today tab shows the day's Power Day tier; Actions card back to DO / AVOID / WATCH only. |
| `bc96bfa` | People tab rename, menu reorder, luck pillar removed from My Wobazi. |

### PR #1 — SEO Phase 1 (`seo/phase-1` → `main`)
https://github.com/alexanderjoo-max/wobazi/pull/1 — **open, mergeable, not merged**. Head `a0406a3` (Phase 1 commit `da2fce9` plus a merge of `main` that resolved a one-line `require` conflict in `server.js`).

What it contains:
- **Homepage:** title "Free BaZi Calculator – Four Pillars of Destiny Chart | Wobazi"; description (147 chars, no diacritics); H1 is the visible hero subheading `h1.logo-sub` "Free BaZi Calculator — Four Pillars of Destiny" (approved, wraps to two lines on mobile, ~17px push); the wordmark is a `<p>`; the app's hidden empty H1 is a `div`; `og:url` = canonical `https://wobazi.com/`; `twitter:site` removed; viewport zoom lock removed.
- **Content pages:** keyword-first titles/descriptions from `seo/meta.js` `PAGES`; one H1 each; absolute canonical identical to `og:url`; brand spelled "Wobazi".
- **URLs:** no trailing slash (301); `/Master-Alice.html` and `/about` 301 → `/master-alice`; `/bazi-calculator` 301 → `/`; internal links updated.
- **robots.txt:** `Disallow: /api/` (share-image endpoints explicitly allowed), `/auth/`, `/wobazi2`. Sitemap referenced.
- **Share/invite routes** (`/i/`, `/r/`, `/s/`, `/api/share-viral|share-image|share-story`): crawlable, `X-Robots-Tag: noindex` header, meta robots noindex on pages.
- **sitemap.xml:** 9 public pages from `PAGES`, hand-set `lastmod`.
- **JSON-LD:** `/` WebApplication + Organization (+ existing FAQPage); guide pages Article + BreadcrumbList (+ FAQPage); `/master-alice` Person + BreadcrumbList; `/privacy`, `/terms` BreadcrumbList. structured-data-testing-tool (Google presets): 0 failures, 0 warnings.
- **Performance:** Outfit self-hosted (`public/fonts/outfit-latin*.woff2`, variable, `font-weight: 300 700`, preloaded, pixel-identical); Chinese/Thai Google Fonts CSS non-blocking (preload + onload swap, `<noscript>`, `display=swap`, pixel-identical final render in 中文/ไทย); `?v=` static assets cached 1 year immutable, unversioned 1 day; below-fold images lazy; Master Alice photo 113 KB → 65 KB.
- **Mobile:** `.oracle-input`, `.oracle-drawer-input`, `.viral-caption`, `.pd-select` 16px at ≤768px (iOS focus zoom).

Pre-merge verification (local server on a DB copy): all required URLs 200/301 as expected; guest chart plot, Oracle, share sheet, EN/ไทย/中文 toggle work; `npm test` 41 pass; relationships tests 25 pass; Oracle tests 6 pass.

Lighthouse mobile, **local** (no Cloudflare compression), before → after:

| Page | Perf | A11y | Best practices | SEO | FCP | LCP |
|---|---|---|---|---|---|---|
| `/` | 55 → 64 | 78 → 84 | 100 | 100 | 11.7s → 4.4s | 18.9s → 10.4s |
| `/what-is-bazi` | 58 → 71 | 89 | 100 | 100 | 7.1s → 3.8s | 10.3s → 5.6s |

**Production baseline before Phase 1** (mobile): `/` 56 / 78 / 100 / 100, FCP 11.0s, LCP 14.6s; `/what-is-bazi` 59 / 89 / 100 / 100, LCP 8.6s. TTFB 0.23–0.48s (first `/what-is-bazi` hit 0.83s).

## 2. Pending post-deploy checks (after the owner merges PR #1 and Render deploys)
Do not merge the PR yourself.

1. `curl` status codes on production for: `/`, `/?begin=1`, `/#input`, `/#you`, `/what-is-bazi`, `/four-pillars-of-destiny`, `/chinese-astrology`, `/day-master`, `/bazi-compatibility`, `/Master-Alice.html` (expect 301 → `/master-alice`), `/master-alice`, `/privacy`, `/terms`, `/auth/google` (302 to Google), `/about` (301), `/bazi-calculator` (301), `/what-is-bazi/` (301).
2. `X-Robots-Tag: noindex` present on `/i/…`, `/r/…`, `/s/…` and `/api/share-viral…`; absent on content pages.
3. Live `https://wobazi.com/sitemap.xml` (9 URLs, hand-set `lastmod`, no `/Master-Alice.html`) and `https://wobazi.com/robots.txt` (no `/i/` disallow; share-image allows).
4. Production Lighthouse mobile on `/` and `/what-is-bazi` (`npx -y lighthouse@12 … --form-factor=mobile`, not added to package.json). Report Performance, Accessibility, SEO, Best practices, FCP, LCP, TTFB against the production baseline above.
5. Spot-check: `Cache-Control: public, max-age=31536000, immutable` on a `?v=` asset; `/public/fonts/outfit-latin.woff2?v=15` serves `font/woff2`.
6. Oracle on production: ask "best date next week" and confirm the date is after today (Bangkok).
7. Report results to the owner.

## 3. Standing decisions and constraints

**Process**
- **Additive only.** Don't change visual design, CSS, layout, copy tone or app behaviour unless a step explicitly requires it. If a step would change UI, stop and ask first, with before/after screenshots (mobile 390px and desktop).
- Don't delete files; deprecate with redirects. Every URL that works today must keep working (200 or 301).
- Google OAuth, daily readings, the Oracle and share cards must keep working exactly as before.
- Render: don't change the service plan or infra config without asking.
- One branch + PR per phase; finish and verify a phase before starting the next. **Phase 2 and Phase 3 wait for the owner's explicit go-ahead.**
- Owner merges PRs. Separate, non-SEO fixes go to `main` as their own commits, not into an SEO PR.
- Tools like Lighthouse run via `npx`, never added to `package.json`. `node-html-parser` is approved **for Phase 3 only**, installed on the Phase 3 branch, server/build-side only (must not ship to the client).

**SEO rules now in the code**
- **`lastmod` rule:** `published` / `lastmod` in `seo/meta.js` are set by hand (YYYY-MM-DD). Update `lastmod` only when a page's visible content changes. Never derive it from git history or file mtimes (Render deploys don't reliably carry either; moving dates get ignored).
- New public page → add it to `PAGES` in `seo/meta.js` (title, description, crumb, dates; `article: true` for guide content).
- **Share/invite routes preview but are never indexed:** keep them crawlable (not in robots.txt `Disallow`) and send `X-Robots-Tag: noindex` + meta robots noindex. Applies to `/i/`, `/r/`, `/s/`, `/api/share-*` and any future share/invite route.
- URL policy: absolute `https://wobazi.com`, no trailing slash except `/`, canonical = `og:url`.
- `twitter:site`: omit until an X handle is confirmed. Instagram is @wo.bazi.
- Homepage H1 must be visible text — no visually hidden keyword headings.
- Static assets: bump `?v=` on every change to a CSS/JS/font/image file (versioned URLs are cached for a year).
- Fonts: Outfit self-hosted; DM Serif Display is not used and must not be added. Noto (SC/Thai/Serif SC) from Google Fonts, non-blocking.
- JSON-LD: one `<script type="application/ld+json">` block per type; inline publisher details (don't rely on `@id` references).
- Oracle: prompt is rebuilt per request with the Bangkok date; keep `test/oracle.test.js` passing before launch.

## 4. Open items
- **Logo WebP (post-launch):** serve `logo-stack.png`, `logo-horiz.png`, `udestiny-logo.png` as lossless WebP with PNG fallback (`<picture>`). 256-colour PNG quantization was tried and bands the gold/silver gradients, so it was skipped. Logged in CLAUDE.md.
- **Render-blocking translation scripts in `<head>`:** `public/js/i18n.js`, `i18n-ui.js`, `i18n-copy.js`, `i18n-copy-more.js`, `i18n-app-th.js` (~230 KB uncompressed, ~0.9–2.1s each in local Lighthouse) plus `style.css` (176 KB). Phase 3's one-language pages should remove most of this for content pages; no change made yet.
- **Accessibility audits still failing on `/`:** `aria-allowed-attr`, `button-name`, `heading-order`, `select-name`. Not in scope so far; fixes may touch markup, so ask first.
- Production Lighthouse "after" numbers are pending deploy (section 2).

## 5. Phase 2 spec (owner's original brief) — waits for go-ahead

**Problem:** the homepage HTML contains the whole app (the empty chart sections, Oracle modal, share modal, and about six duplicate navs) plus the full explainer, which duplicates `/what-is-bazi`.

1. Move the chart/app experience to `/chart` (propose a name if something else fits the stack better).
2. Homepage server-rendered HTML should contain only: nav (once), hero with the birth-data form or a CTA into `/chart`, the three value props, a short "What is BaZi" teaser linking to `/what-is-bazi`, the FAQ, and the footer.
3. Keep old entry points working:
   - `/?begin=1` redirects to `/chart`.
   - `/#input` and `/#you` land in the right place via client-side redirect.
   - Existing share-card links resolve.
   - Returning signed-in users land where they do today.
4. `/chart` gets `noindex, follow` if its content is per-user. Otherwise give it its own title and description.
5. Remove the duplicated explainer from the homepage DOM. The canonical version lives on `/what-is-bazi`.
6. The nav renders once per page. Use CSS or JS for the mobile/desktop variants, not duplicate markup.

**Verify Phase 2:** same checks as Phase 1 (curl every URL, validate JSON-LD, Lighthouse mobile on `/` and one content page, confirm login, plotting a chart, the Oracle, sharing and the language toggle work), plus a diff of the homepage HTML size and heading outline before and after.

Implementation notes from recon (proposal, not yet approved in detail):
- `/` is currently `sendApp` serving `app/index.html` (all screens: splash, about/explainer, input, loading, results, portal, oracle-chat) with server-side NAV_MENU / SITE_FOOTER / SPLASH markers. Hash routing (`#input`, `#you`, `#today`, `#actions`, `#relationships[/p/:id]`, `#portal`, `#history[/DATE]`, `#account`).
- Things that point at `/` today and would need to move to `/chart`: Google OAuth callback (`/?auth=success`), `relationships.js` invite completion, `/r/` and `/i/` page links (`/#relationships`), menu links (`/#portal`, `/#history`, `/#you`, `/#input`), portal return flags, `site.webmanifest` start_url.
- `/app` and `/app/` currently also serve the app shell.

## 6. Phase 3 spec (owner's original brief) — waits for go-ahead

**Problem:** EN, 中文, and ไทย text is all in one DOM on one URL.

1. URL structure: English at `/`, Thai at `/th/...`, Simplified Chinese at `/zh/...`. Mirror every content page and the homepage.
2. Each URL serves only its own language in the HTML, server-rendered or pre-rendered, never all three hidden via CSS or JS.
3. Set `<html lang="en|th|zh-Hans">` per page.
4. Add hreflang alternates (`en`, `th`, `zh-Hans`, `x-default` pointing to English) to every page, and to the sitemap as `xhtml:link` entries.
5. Each page is self-canonical per language. Don't canonicalize `/th/` to the English page.
6. The language toggle becomes links to the equivalent URL. Remember the choice in a cookie. Don't auto-redirect based on IP or Accept-Language.
7. Translate titles, meta descriptions, H1s, and JSON-LD per language. Reuse the existing translations already in the codebase. Where a translation is missing, list it for the owner instead of machine-translating silently.
8. Signed-in app views keep working in all three languages.

**Verify Phase 3:**
- For one page in each language: curl it, confirm the HTML contains only that language, and confirm hreflang is reciprocal.
- Validate the sitemap.
- Rerun Lighthouse.

Implementation notes from recon (proposal):
- Today: `.en/.zh/.th` sibling spans toggled by CSS on `html[data-lang]` (from `localStorage wobazi-lang`), plus client dictionaries in `public/js/i18n*.js` (`data-i18n` keys, `WoBaziI18n.lookup`). Plan: load those dictionaries server-side and strip non-matching language spans with `node-html-parser` (Phase 3 branch only).
- The app (`/chart` after Phase 2) stays one URL with the in-app toggle, reading the same `wobazi_lang` cookie.
- Before rendering, produce the list of missing Thai/Chinese strings (titles, descriptions, H1s, JSON-LD, page copy) for the owner.

## Deliverables at the end of each phase
- Summary of changed files
- Redirect map (old URL → new URL, status code)
- Verification results
- Anything skipped or needing the owner's decision
