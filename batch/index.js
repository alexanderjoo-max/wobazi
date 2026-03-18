/* ═══════════════════════════════════════
   WOBAZI — Batch System Entry Point
   batch/index.js
   Wires together schema, routes, and cron.

   Usage (add one line to server.js):
     require('./batch').mount(app, db);
═══════════════════════════════════════ */

'use strict';

const { migrate } = require('./schema');
const { createRoutes } = require('./routes');
const { startCron, stopCron } = require('./cron');

/**
 * Mount the batch system onto an existing Express app.
 * - Creates the daily_readings table if needed
 * - Registers API routes
 * - Starts the daily cron job
 *
 * @param {Express.Application} app - Express app instance
 * @param {Database} db - better-sqlite3 database instance
 * @param {Object} [options]
 * @param {boolean} [options.cron=true] - Whether to start the cron scheduler
 * @param {string} [options.cronSchedule='0 0 * * *'] - Cron expression
 */
function mount(app, db, options = {}) {
  const { cron = true, cronSchedule = '0 0 * * *' } = options;

  // Step 1: Ensure table exists
  migrate(db);
  console.log('[Batch] daily_readings table ready');

  // Step 2: Mount routes
  const router = createRoutes(db);
  app.use(router);
  console.log('[Batch] Routes mounted: POST /api/batch/generate-daily-readings, GET /api/daily-reading');

  // Step 3: Start cron (optional)
  if (cron) {
    startCron(db, cronSchedule);
  }
}

module.exports = { mount, migrate, createRoutes, startCron, stopCron };
