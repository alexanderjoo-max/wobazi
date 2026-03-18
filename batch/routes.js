/* ═══════════════════════════════════════
   WOBAZI — Batch & Daily Reading Routes
   batch/routes.js
   Express Router with:
   - POST /api/batch/generate-daily-readings (manual trigger)
   - GET  /api/daily-reading?date=YYYY-MM-DD  (read endpoint)
═══════════════════════════════════════ */

'use strict';

const express = require('express');
const { generateDailyReadings } = require('./generate');

/**
 * Create and return an Express Router.
 * @param {Database} db - better-sqlite3 instance (same one used by server.js)
 */
function createRoutes(db) {
  const router = express.Router();

  /* ── POST /api/batch/generate-daily-readings ──
     Manual trigger for batch generation.
     Protected by BATCH_SECRET env var. */
  router.post('/api/batch/generate-daily-readings', async (req, res) => {
    // Auth: check secret key
    const secret = req.headers['x-batch-secret'] || req.body.secret;
    if (!process.env.BATCH_SECRET || secret !== process.env.BATCH_SECRET) {
      return res.status(403).json({ error: 'Invalid or missing batch secret' });
    }

    try {
      const result = await generateDailyReadings(db);
      res.json({ ok: true, ...result });
    } catch (err) {
      console.error('[Batch Route] Generation error:', err.message);
      res.status(500).json({ error: 'Batch generation failed', message: err.message });
    }
  });

  /* ── GET /api/daily-reading?date=YYYY-MM-DD ──
     Returns the authenticated user's reading for the given date.
     Uses the same session-based auth as the rest of the app. */
  router.get('/api/daily-reading', (req, res) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ error: 'Not logged in' });
    }

    const userId = req.session.user.googleId;
    const date = req.query.date || new Date().toISOString().slice(0, 10);

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    const reading = db.prepare(`
      SELECT * FROM daily_readings WHERE user_id = ? AND date = ?
    `).get(userId, date);

    if (!reading) {
      return res.status(404).json({ error: 'No reading found for this date' });
    }

    // Parse JSON fields before sending
    try {
      reading.better_timing_windows = JSON.parse(reading.better_timing_windows || '[]');
    } catch {
      reading.better_timing_windows = [];
    }

    res.json(reading);
  });

  return router;
}

module.exports = { createRoutes };
