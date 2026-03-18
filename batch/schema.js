/* ═══════════════════════════════════════
   WOBAZI — Daily Readings Schema
   batch/schema.js
   Creates the daily_readings table (idempotent)
═══════════════════════════════════════ */

'use strict';

/**
 * Run the migration on the given better-sqlite3 database instance.
 * Safe to call multiple times (CREATE IF NOT EXISTS).
 */
function migrate(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL REFERENCES users(google_id),
      date TEXT NOT NULL,
      day_pillar_stem TEXT,
      day_pillar_branch TEXT,
      hero_text TEXT,
      do_action TEXT,
      avoid_action TEXT,
      watch_action TEXT,
      insight_career TEXT,
      insight_wealth TEXT,
      insight_relationships TEXT,
      insight_risk TEXT,
      overall_score INTEGER DEFAULT 0,
      career_score INTEGER DEFAULT 0,
      wealth_score INTEGER DEFAULT 0,
      love_score INTEGER DEFAULT 0,
      health_score INTEGER DEFAULT 0,
      travel_score INTEGER DEFAULT 0,
      energy_score INTEGER DEFAULT 0,
      favorable_verdict TEXT DEFAULT 'neutral',
      better_timing_windows TEXT DEFAULT '[]',
      generated_at TEXT DEFAULT (datetime('now')),
      model_used TEXT DEFAULT 'deepseek'
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_readings_user_date
      ON daily_readings(user_id, date);
  `);
}

module.exports = { migrate };
