#!/usr/bin/env node
/* ═══════════════════════════════════════
   WOBAZI — Relationships migration CLI
   node relationships/migrate.js up
   node relationships/migrate.js down --confirm

   down drops every relationships table (people, pair readings, invites, share links,
   user birth places). Note a Litestream restore point before running it in production.
═══════════════════════════════════════ */

'use strict';

require('dotenv').config({ path: '.env.local' });
const path = require('path');
const Database = require('better-sqlite3');
const schema = require('./schema');

const cmd = process.argv[2];
const confirmed = process.argv.includes('--confirm');
const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'wobazi.db');

if (cmd !== 'up' && cmd !== 'down') {
  console.log('Usage: node relationships/migrate.js up | down --confirm');
  process.exit(1);
}
if (cmd === 'down' && !confirmed) {
  console.error(`Refusing to drop ${schema.TABLES.join(', ')} in ${dbPath} without --confirm.`);
  console.error('In production, note a Litestream restore point first.');
  process.exit(1);
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
if (cmd === 'up') schema.up(db);
else schema.down(db);
console.log(`[relationships] migrate ${cmd} done on ${dbPath}`);
db.close();
