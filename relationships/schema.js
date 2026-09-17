/* ═══════════════════════════════════════
   WOBAZI — Relationships Schema
   relationships/schema.js
   up(db) creates the tables (idempotent). down(db) drops them (see migrate.js).
═══════════════════════════════════════ */

'use strict';

const TABLES = [
  'relationship_share_links',
  'relationship_readings',
  'relationship_invites',
  'people',
  'user_birth_places',
];

function up(db) {
  db.exec(`
    /* Saved people. Manual rows hold the birth data the owner typed.
       Invite-linked rows hold NO birth data: it is read live from the linked user's readings row. */
    CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id TEXT NOT NULL REFERENCES users(google_id),
      name TEXT NOT NULL,
      rel_type TEXT NOT NULL CHECK (rel_type IN ('romantic', 'friend', 'family', 'business')),
      calendar_type TEXT NOT NULL DEFAULT 'solar',
      year INTEGER, month INTEGER, day INTEGER,
      leap_month INTEGER NOT NULL DEFAULT 0,
      lunar_year INTEGER, lunar_month INTEGER, lunar_day INTEGER,
      hour_known INTEGER NOT NULL DEFAULT 0,
      hour INTEGER, minute INTEGER,
      birthplace TEXT,
      birth_lat REAL, birth_lon REAL, birth_country TEXT,
      birth_tz TEXT, birth_tz_source TEXT,
      linked_user_id TEXT,
      invite_token TEXT,
      share_show_name INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_people_owner ON people(owner_id);
    CREATE INDEX IF NOT EXISTS idx_people_linked ON people(linked_user_id);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_people_owner_linked
      ON people(owner_id, linked_user_id) WHERE linked_user_id IS NOT NULL;

    /* One cached pair reading per person row (the owner's point of view).
       input_hash covers both charts + type; a mismatch means regenerate. */
    CREATE TABLE IF NOT EXISTS relationship_readings (
      person_id INTEGER PRIMARY KEY REFERENCES people(id),
      input_hash TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('pending', 'ready', 'error')),
      facts TEXT NOT NULL DEFAULT '{}',
      text TEXT,
      model TEXT,
      error TEXT,
      attempts INTEGER NOT NULL DEFAULT 0,
      started_at TEXT,
      generated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS relationship_invites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT NOT NULL UNIQUE,
      inviter_id TEXT NOT NULL REFERENCES users(google_id),
      rel_type TEXT NOT NULL CHECK (rel_type IN ('romantic', 'friend', 'family', 'business')),
      invitee_label TEXT,
      status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'accepted', 'cancelled')),
      accepted_by TEXT,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      accepted_at TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_rel_invites_inviter ON relationship_invites(inviter_id);

    CREATE TABLE IF NOT EXISTS relationship_share_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT NOT NULL UNIQUE,
      person_id INTEGER NOT NULL REFERENCES people(id),
      owner_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      revoked_at TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_rel_share_person ON relationship_share_links(person_id);

    /* Birth location + resolved IANA timezone for account holders, recorded for the
       future true-timezone migration. Not used in any calculation yet (all charts use +08:00). */
    CREATE TABLE IF NOT EXISTS user_birth_places (
      google_id TEXT PRIMARY KEY,
      birthplace TEXT,
      lat REAL, lon REAL, country TEXT,
      tz TEXT, tz_source TEXT,
      resolved_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

function down(db) {
  const drop = db.transaction(() => {
    TABLES.forEach(t => db.exec(`DROP TABLE IF EXISTS ${t}`));
  });
  drop();
}

module.exports = { up, down, TABLES };
