/* ═══════════════════════════════════════
   WOBAZI — URL normalisation
   seo/url.js

   One canonical spelling per URL: a single leading slash, no repeated slashes, no trailing
   slash (except "/" itself and the few prefixes that keep theirs).

   Two bugs this fixes, both from the old "strip trailing slashes" middleware:
   - `//` redirected to `` (the empty string), which the browser resolved back to the same
     URL — ERR_TOO_MANY_REDIRECTS on https://wobazi.com//?begin=1
   - `//what-is-bazi//` redirected to `//what-is-bazi`, and a Location starting with two
     slashes is protocol-relative: the browser left the site for http://what-is-bazi/.
     Anything emitted here must therefore start with exactly one slash.
═══════════════════════════════════════ */

'use strict';

/* Paths that keep their trailing slash (the SPA shell and the API/auth namespaces). */
const KEEP_TRAILING = ['/app/'];
const KEEP_TRAILING_PREFIXES = ['/api/', '/auth/'];

function normalizePath(pathname) {
  let out = String(pathname == null ? '' : pathname);
  if (!out.startsWith('/')) out = '/' + out;
  out = out.replace(/\/{2,}/g, '/');            // // -> /, /// -> / ...
  const keep = KEEP_TRAILING.includes(out) || KEEP_TRAILING_PREFIXES.some(p => out.startsWith(p));
  if (!keep && out.length > 1) out = out.replace(/\/+$/, '') || '/';
  return out;
}

/* Express middleware: one 301 to the canonical spelling, preserving the query string. */
function normalizeUrl(req, res, next) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  const canonical = normalizePath(req.path);
  if (canonical === req.path) return next();
  const query = req.originalUrl.slice(req.path.length);  // "?a=1" or ""
  return res.redirect(301, canonical + query);
}

module.exports = { normalizePath, normalizeUrl };
