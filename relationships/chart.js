/* ═══════════════════════════════════════
   WOBAZI — Relationships chart input
   relationships/chart.js

   Turns stored birth data into engine charts. No timezone is passed, so every chart
   uses the engine default (+08:00) — identical to how the user's own chart is drawn.
═══════════════════════════════════════ */

'use strict';

const bazi = require('../bazi-engine');

const TYPES = ['romantic', 'friend', 'family', 'business'];

function int(v) {
  const n = typeof v === 'number' ? v : parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}

function validSolar(y, m, d) {
  if (!y || !m || !d || y < 1900 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return false;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

/**
 * Validate birth input from a form. Returns { value } or { error }.
 * value holds solar Y/M/D (lunar converted) plus the original lunar fields.
 */
function parseBirthInput(body) {
  const b = body || {};
  const calendar = b.calendar === 'lunar' ? 'lunar' : 'solar';
  let year = int(b.year);
  let month = int(b.month);
  let day = int(b.day);
  const leap = !!b.leapMonth;
  const out = { calendar_type: calendar, leap_month: 0, lunar_year: null, lunar_month: null, lunar_day: null };

  if (calendar === 'lunar') {
    if (!year || !month || !day || year < 1900 || year > 2099 || month < 1 || month > 12 || day < 1 || day > 30) {
      return { error: 'Please enter a valid birth date.' };
    }
    try {
      const conv = bazi.lunarToSolar(year, month, day, leap);
      out.lunar_year = year; out.lunar_month = month; out.lunar_day = day; out.leap_month = leap ? 1 : 0;
      year = conv.year; month = conv.month; day = conv.day;
    } catch (e) {
      return { error: 'Could not convert that lunar date. Check the month, day, and leap month.' };
    }
  }
  if (!validSolar(year, month, day)) return { error: 'Please enter a valid birth date.' };

  const hourKnown = !!b.hourKnown;
  let hour = null;
  let minute = null;
  if (hourKnown) {
    hour = int(b.hour);
    minute = int(b.minute) || 0;
    if (hour == null || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return { error: 'Please enter a valid birth time, or choose "I don\'t know the hour".' };
    }
  }

  const place = b.place && typeof b.place === 'object' ? b.place : {};
  const lat = Number(place.lat);
  const lon = Number(place.lon);
  Object.assign(out, {
    year, month, day,
    hour_known: hourKnown ? 1 : 0,
    hour, minute,
    birthplace: String(b.birthplace || place.label || '').trim().slice(0, 120) || null,
    birth_lat: Number.isFinite(lat) && Math.abs(lat) <= 90 ? lat : null,
    birth_lon: Number.isFinite(lon) && Math.abs(lon) <= 180 ? lon : null,
    birth_country: /^[A-Z]{2}$/.test(place.countryCode || '') ? place.countryCode : null,
  });
  return { value: out };
}

/* Chart for a people row (manual birth data). */
function chartFromPerson(row) {
  if (!row || !row.year) return null;
  const hourKnown = !!row.hour_known && row.hour != null;
  const r = bazi.calcBaziAccurate({
    year: row.year, month: row.month, day: row.day,
    hour: hourKnown ? row.hour : null,
    minute: hourKnown ? (row.minute || 0) : 0,
    calendar: 'solar',
  });
  return { pillars: r.pillars, hourKnown };
}

/* Chart for an account holder, drawn exactly like the app draws it from the readings row
   (hour null = unknown, twin settings applied). */
function chartFromReadingsRow(row) {
  if (!row || !row.year) return null;
  const hourKnown = row.hour != null;
  const twin = row.twin ? { enabled: true, order: row.twin_order || 'elder', method: row.twin_method || 'luck' } : null;
  const r = bazi.calcBaziAccurate({
    year: row.year, month: row.month, day: row.day,
    hour: hourKnown ? row.hour : null,
    minute: hourKnown ? (row.minute || 0) : 0,
    calendar: 'solar',
    gender: row.gender === 'M' || row.gender === 'F' ? row.gender : undefined,
    twin: twin || undefined,
  });
  return { pillars: r.pillars, hourKnown };
}

function chartKey(chart) {
  if (!chart) return 'none';
  return chart.pillars.map(p => (p.known ? p.stem.char + p.branch.char : '--')).join('');
}

function firstName(name) {
  const clean = String(name || '').normalize('NFC').replace(/[^\p{L}\p{M}\s'’-]/gu, ' ').trim();
  const first = clean.split(/\s+/)[0] || '';
  return first.slice(0, 20);
}

module.exports = { TYPES, parseBirthInput, chartFromPerson, chartFromReadingsRow, chartKey, firstName, validSolar };
