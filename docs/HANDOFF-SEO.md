# SEO overhaul — handoff

Last updated: 2026-09-17 (Phase 1b merged). Launch: **2026-09-24**. Site: https://wobazi.com (Render, behind Cloudflare).

## 1. Current state

### `main`
Up to date with `origin/main`. Latest commits:

| Commit | What |
|---|---|
| `c28369d` | Oracle date awareness: `oracle/prompt.js` puts today's Asia/Bangkok date, the annual (流年) and day pillars, the user's running 10-year luck pillar, this-week/next-week ranges and a "never suggest a past date" rule into every `/api/oracle` prompt. Tests in `test/oracle.test.js` (unit + live "best date next week"). Pushed, deploys independently of the SEO work. |
| `de1d94b` | Today tab shows the day's Power Day tier; Actions card back to DO / AVOID / WATCH only. |
| `bc96bfa` | People tab rename, menu reorder, luck pillar removed from My Wobazi. |

### PR #1 — SEO Phase 1 (`seo/phase-1` → `main`) — **MERGED** `a4508ee`
Merged and deployed. Contents unchanged from the description below; production verified 2026-09-17.

<details>
<summary>What it contained</summary>

- **Homepage:** title "Free BaZi Calculator – Four Pillars of Destiny Chart | Wobazi"; H1 is the visible hero subheading `h1.logo-sub`; wordmark is a `<p>`; `og:url` = canonical; `twitter:site` removed; viewport zoom lock removed.
- **Content pages:** keyword-first titles/descriptions from `seo/meta.js` `PAGES`; one H1 each; absolute canonical identical to `og:url`.
- **URLs:** no trailing slash (301); `/Master-Alice.html` and `/about` 301 → `/master-alice`; `/bazi-calculator` 301 → `/`.
- **robots.txt**, **sitemap.xml** (9 pages, hand-set `lastmod`), **JSON-LD** (WebApplication + Organization, Article, BreadcrumbList, Person, FAQPage).
- **Performance:** Outfit self-hosted; Chinese/Thai Google Fonts non-blocking; `?v=` assets cached 1 year immutable; below-fold images lazy.
- **Mobile:** 16px inputs at ≤768px (iOS focus zoom).
</details>

### PR #2 — SEO Phase 1b (`seo/phase-1b` → `main`) — **MERGED** `fbaf87e`
https://github.com/alexanderjoo-max/wobazi/pull/2. No URL changes, no visual changes.

- **WebP logos:** `logo-stack` 77 → 49 KB, `logo-horiz` 62 → 35 KB, lossless (decoded RGBA byte-identical to the PNGs). `<picture class="logo-pic">` + WebP `<source>`, PNG kept as fallback, in `app/index.html` (×6), `nav.ejs`, `footer.ejs`. Hero logo has `fetchpriority="high"` and is not lazy. Canvas/Satori share images still read the PNGs.
  - `picture.logo-pic { display: contents }` **and** `> source { display: none }` — without the second rule Chrome treats `<source>` as a flex item and the nav gains a 10px gap.
- **Accessibility (attributes only):** `aria-label` + `data-i18n-aria` on 3 back buttons, 2 Oracle send buttons, the blood-type select (new keys `aria.send`, `aria.bloodType`). `updateSwitchers` matched `[data-lang]`, which put `aria-selected` on `<html>` — now `button[data-lang]` with `aria-pressed` (and `.drawer-lang button[aria-pressed="true"]` in CSS). `/what-is-bazi` section headings no longer carry `role="button"`/`tabindex`; the existing "Read more" button remains the keyboard control.
- **Heading order:** guide-page section headings h3 → h2 (sub-headings h4 → h3 with inline `font-weight:700;letter-spacing:normal`), footer column headings h4 → h3. `public.css` already styled `.seo-main .about-section h2, h3` identically.
- **Verified:** computed styles + boxes identical to `main` on 9 pages × 2 widths; pixel diff on `/` and `/what-is-bazi` × 3 languages × 2 widths shows only logo pixels, max Δ 2/255 (PNG vs WebP downscaling); tests 41 + 25 + 11 pass.

**Production after Phase 1b (mobile, 3 runs, median):**

| Page | Perf | A11y | BP | SEO | FCP | LCP | TTFB |
|---|---|---|---|---|---|---|---|
| `/` before Phase 1 | 56 | 78 | 100 | 100 | 11.0s | 14.6s | 0.23–0.48s |
| `/` after Phase 1 | 66 | 84 | 100 | 100 | 4.2s | 6.0s | 0.23–0.40s |
| **`/` after Phase 1b** | 61 (56–70) | **100** | 100 | 100 | 4.2s | 6.3s (5.2–14.5) | 374ms |
| `/what-is-bazi` before Phase 1 | 59 | 89 | 100 | 100 | — | 8.6s | — |
| `/what-is-bazi` after Phase 1 | 77 | 89 | 100 | 100 | 3.8s | 4.2s | 0.22–0.70s |
| **`/what-is-bazi` after Phase 1b** | 76 (59–79) | **96** | 100 | 100 | 3.9s | 4.4s (3.9–8.3) | 369ms |

Performance is unchanged within run-to-run noise (one slow run per page each time; medians shown). The homepage LCP element is now the WebP hero logo. Accessibility: `/` has **no failing audits**; content pages fail only `color-contrast`.

Also verified on production after the deploy: every URL in §2.1 returns its expected 200/301/302; `X-Robots-Tag: noindex` on `/i/`, `/r/`, `/s/`, `/api/share-*` and absent on content pages; sitemap 9 URLs with matching `lastmod`; robots.txt unchanged; `?v=` assets 1-year immutable; WebP served as `image/webp`.

## 2. Post-deploy checks — done for Phase 1 and Phase 1b
Both rounds passed (2026-09-17). Repeat this list after each future deploy:

1. `curl` status codes for: `/`, `/?begin=1`, `/#input`, `/#you`, the 5 guide pages, `/master-alice`, `/Master-Alice.html` (301), `/privacy`, `/terms`, `/auth/google` (302), `/about` (301), `/bazi-calculator` (301), `/what-is-bazi/` (301).
2. `X-Robots-Tag: noindex` on `/i/…`, `/r/…`, `/s/…`, `/api/share-viral…`; absent on content pages.
3. Live `sitemap.xml` (9 URLs, hand-set `lastmod`) and `robots.txt`.
4. Lighthouse mobile ×3 (median) on `/` and `/what-is-bazi`; compare with the table above.
5. `Cache-Control: public, max-age=31536000, immutable` on a `?v=` asset.
6. Oracle: ask "best date next week", confirm the date is on or after today (Bangkok).
7. Report results to the owner.

## 3. Standing decisions and constraints

**Process**
- **Additive only.** Don't change visual design, CSS, layout, copy tone or app behaviour unless a step explicitly requires it. If a step would change UI, stop and ask first, with before/after screenshots (mobile 390px and desktop).
- Don't delete files; deprecate with redirects. Every URL that works today must keep working (200 or 301).
- Google OAuth, daily readings, the Oracle and share cards must keep working exactly as before.
- Render: don't change the service plan or infra config without asking.
- One branch + PR per phase; finish and verify a phase before starting the next. Phase 2 and Phase 3 are approved (2026-09-17), each still gated on the previous PR being merged and production-verified.
- **Launch freeze:** nothing merges to `main` 2026-09-23 to 2026-09-25 except bug fixes. Any phase not fully verified by end of 2026-09-22 waits until 2026-09-26.
- Every PR description carries the rollback target (last good commit on `main`) and a redirect map.
- Owner merges PRs. (Exception, one-off: the owner asked Claude to merge PR #2 on 2026-09-17; that authorization was for that PR only and does not carry to later ones.) Separate, non-SEO fixes go to `main` as their own commits or their own PR, not into an SEO PR.
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
- **Logo WebP:** done for `logo-stack` and `logo-horiz` in Phase 1b. `udestiny-logo.png` (footer) is still PNG-only.
- **Render-blocking translation scripts in `<head>`:** `public/js/i18n.js`, `i18n-ui.js`, `i18n-copy.js`, `i18n-copy-more.js`, `i18n-app-th.js` (~230 KB uncompressed, ~0.9–2.1s each in local Lighthouse) plus `style.css` (176 KB). Phase 3's one-language pages should remove most of this for content pages; no change made yet.
- **Accessibility:** the attribute-level failures were fixed in Phase 1b (`/` is now 100). What remains is **colour contrast only**, deliberately unchanged because it is a visual-design decision:
  - Footer text (`--muted` #71707d on #090813) **4.08:1**, needs 4.5:1 — tagline, contact, all column links, copyright, uDestiny line, on every content page.
  - Footer disclaimer (#575663) **2.76:1** — the worst on the site.
  - Small muted captions (10–13px) inside cards on `/four-pillars-of-destiny`, `/day-master`, `/bazi-compatibility`, `/chinese-astrology`: 4.09–4.15:1.
  - "Yin 阴" heading span (#6366f1) on `/chinese-astrology`: 4.45:1 — a hair under.
  Fixing means lifting `--muted` (and the disclaimer colour) a few steps; it changes the look of every page footer, so it needs the owner's sign-off with before/after screenshots.
- **Non-SEO bug fixes found while verifying Phase 1b** (PR #4, `fix/guidance-prompt`, open): `/api/daily-guidance` intermittent 500s (truncation at `max_tokens: 300` + the model flattening the nested JSON shape; the Gemini fallback had never run because `thinkingBudget` was in the wrong place), and the Day Master being inferred rather than stated in the Oracle/guidance/batch/relationships prompts. Both are launch-blocking. PR #3 (`fix/oracle-day-master`) was closed as superseded.

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
