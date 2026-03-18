/* ═══════════════════════════════════════
   WOBAZI — Daily Reading Cron Scheduler
   batch/cron.js
   Runs generateDailyReadings once per day
   at midnight server time using node-cron.
═══════════════════════════════════════ */

'use strict';

const cron = require('node-cron');
const { generateDailyReadings } = require('./generate');

let _task = null;

/**
 * Start the daily cron job.
 * @param {Database} db - better-sqlite3 instance
 * @param {string} [schedule='0 0 * * *'] - cron expression (default: midnight daily)
 */
function startCron(db, schedule = '0 0 * * *') {
  if (_task) {
    console.log('[Cron] Already running, skipping start.');
    return _task;
  }

  _task = cron.schedule(schedule, async () => {
    console.log(`[Cron] Triggered at ${new Date().toISOString()}`);
    try {
      const result = await generateDailyReadings(db);
      console.log(`[Cron] Done: ${result.success}/${result.total} readings generated`);
    } catch (err) {
      console.error('[Cron] Batch generation error:', err.message);
    }
  }, {
    scheduled: true,
    timezone: undefined, // Use server timezone
  });

  console.log(`[Cron] Daily reading generation scheduled: "${schedule}"`);
  return _task;
}

/**
 * Stop the cron job.
 */
function stopCron() {
  if (_task) {
    _task.stop();
    _task = null;
    console.log('[Cron] Stopped.');
  }
}

module.exports = { startCron, stopCron };
