/* ═══════════════════════════════════════
   WOBAZI — Registered User Portal
   portal/index.js

   Integration (one line in server.js, before the 404 handler):
     require('./portal').mount(app, db);
═══════════════════════════════════════ */

'use strict';

const { migrate } = require('./schema');
const { createRoutes } = require('./routes');

/**
 * Mount the portal: run migrations and register API routes.
 * @param {Express} app
 * @param {Database} db - better-sqlite3 instance
 */
function mount(app, db) {
  migrate(db);
  app.use(createRoutes(db));
  console.log('[Portal] Mounted: history, journal, account');
}

module.exports = { mount };
