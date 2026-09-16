/* ═══════════════════════════════════════
   WOBAZI — Standalone Batch Worker
   batch-worker.js
   Runs the daily reading generation as a
   standalone process. Use for:
   - Render cron jobs (node batch-worker.js)
   - Manual CLI execution
   - Testing
═══════════════════════════════════════ */

'use strict';

require('dotenv').config({ path: '.env.local' });

const Database = require('better-sqlite3');
const path = require('path');
const { migrate } = require('./batch/schema');
const { generateDailyReadings } = require('./batch/generate');

async function main() {
  const startTime = Date.now();
  console.log(`[Worker] Starting batch-worker at ${new Date().toISOString()}`);

  // Connect to the same database (production must use the persistent disk; never fall back to ephemeral storage)
  if (!process.env.DB_PATH && (process.env.RENDER === 'true' || process.env.NODE_ENV === 'production' || (process.env.BASE_URL || '').startsWith('https'))) {
    console.error('[Worker] FATAL: DB_PATH is not set in production. Refusing to start.');
    process.exit(1);
  }
  const db = new Database(process.env.DB_PATH || path.join(__dirname, 'wobazi.db'));
  console.log(`[Worker] Database: ${db.name}`);
  db.pragma('journal_mode = WAL');

  // Ensure table exists
  migrate(db);

  try {
    const result = await generateDailyReadings(db);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log(`[Worker] Finished in ${elapsed}s`);
    console.log(`[Worker] Total: ${result.total}, Success: ${result.success}, Failed: ${result.failed}`);

    if (result.failed > 0) {
      const failures = result.results.filter(r => r.status === 'error');
      console.log('[Worker] Failed users:', failures.map(f => `${f.userId}: ${f.error}`).join('; '));
    }

    db.close();
    process.exit(result.failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('[Worker] Fatal error:', err);
    db.close();
    process.exit(1);
  }
}

main();
