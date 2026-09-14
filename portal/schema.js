/* ═══════════════════════════════════════
   WOBAZI — Registered User Portal Schema
   portal/schema.js
   Creates portal tables (idempotent)
═══════════════════════════════════════ */

'use strict';

/**
 * Run the migration on the given better-sqlite3 database instance.
 * Safe to call multiple times (CREATE IF NOT EXISTS).
 */
function migrate(db) {
  db.exec(`
    /* One immutable snapshot of the Today reading per user per local day. */
    CREATE TABLE IF NOT EXISTS reading_snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      google_id TEXT NOT NULL REFERENCES users(google_id),
      date TEXT NOT NULL,
      summary TEXT NOT NULL DEFAULT '{}',
      strip_html TEXT,
      hero_html TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_reading_snapshots_user_date
      ON reading_snapshots(google_id, date);

    /* Private journal: one note + reaction per user per reading day. Never shared or aggregated. */
    CREATE TABLE IF NOT EXISTS journal_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      google_id TEXT NOT NULL REFERENCES users(google_id),
      date TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      reaction TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_journal_entries_user_date
      ON journal_entries(google_id, date);
  `);
}

module.exports = { migrate };
