/* ═══════════════════════════════════════
   WOBAZI — Birth place → IANA timezone (recorded, not yet used)
   relationships/tz.js

   Resolved with no extra dependency: the country's zones come from ICU
   (Intl.Locale#getTimeZones). One zone → exact ("country"). Several zones →
   the one whose standard offset is closest to the longitude's solar offset
   ("longitude", approximate). Lat/lon are stored too, so the timezone migration
   can re-resolve precisely later.
═══════════════════════════════════════ */

'use strict';

function zonesForCountry(cc) {
  if (!/^[A-Z]{2}$/.test(cc || '')) return [];
  try {
    const loc = new Intl.Locale('und-' + cc);
    const zones = typeof loc.getTimeZones === 'function' ? loc.getTimeZones() : loc.timeZones;
    return Array.isArray(zones) ? zones : [];
  } catch (e) {
    return [];
  }
}

function offsetMinutes(tz, date) {
  try {
    const part = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'longOffset' })
      .formatToParts(date).find(p => p.type === 'timeZoneName');
    const m = /GMT([+-])(\d{2}):?(\d{2})?/.exec(part && part.value || '');
    if (!m) return 0;
    return (m[1] === '-' ? -1 : 1) * (parseInt(m[2], 10) * 60 + parseInt(m[3] || '0', 10));
  } catch (e) {
    return null;
  }
}

function standardOffset(tz) {
  const y = new Date().getUTCFullYear();
  const jan = offsetMinutes(tz, new Date(Date.UTC(y, 0, 15)));
  const jul = offsetMinutes(tz, new Date(Date.UTC(y, 6, 15)));
  if (jan == null || jul == null) return null;
  return Math.min(jan, jul);
}

/** @returns {{ tz: string|null, source: 'country'|'longitude'|null }} */
function resolveTimezone(countryCode, lon) {
  const zones = zonesForCountry(countryCode);
  if (!zones.length) return { tz: null, source: null };
  if (zones.length === 1) return { tz: zones[0], source: 'country' };
  if (!Number.isFinite(lon)) return { tz: null, source: null };
  const solar = lon * 4;
  let best = null;
  zones.forEach(z => {
    const off = standardOffset(z);
    if (off == null) return;
    const d = Math.abs(off - solar);
    if (!best || d < best.d) best = { z, d };
  });
  return best ? { tz: best.z, source: 'longitude' } : { tz: null, source: null };
}

/* Photon (the geocoder /api/city-suggest already uses) with coordinates + country code. */
async function searchPlaces(q, limit) {
  const url = `https://photon.komoot.io/api/?limit=${limit || 6}&lang=en&q=${encodeURIComponent(q)}`;
  const r = await fetch(url, { headers: { 'User-Agent': 'WoBazi/1.0 (https://wobazi.com)' }, signal: AbortSignal.timeout(6000) });
  if (!r.ok) throw new Error('photon ' + r.status);
  const data = await r.json();
  const seen = new Set();
  const out = [];
  (data.features || []).forEach(f => {
    const p = f.properties || {};
    const coords = (f.geometry && f.geometry.coordinates) || [];
    const parts = [p.name];
    const city = p.city || p.county || '';
    const state = p.state || p.region || '';
    if (city && city !== p.name) parts.push(city);
    if (state && state !== city && state !== p.name) parts.push(state);
    if (p.country) parts.push(p.country);
    const label = parts.filter(Boolean).join(', ');
    if (!label || seen.has(label)) return;
    seen.add(label);
    const lon = Number(coords[0]);
    const lat = Number(coords[1]);
    const cc = String(p.countrycode || '').toUpperCase();
    const tz = resolveTimezone(cc, lon);
    out.push({ label, lat, lon, countryCode: cc || null, tz: tz.tz, tzSource: tz.source });
  });
  return out;
}

module.exports = { resolveTimezone, searchPlaces };
