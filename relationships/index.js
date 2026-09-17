/* ═══════════════════════════════════════
   WOBAZI — Relationships (people, pair readings, invites, sharing)
   relationships/index.js

   Integration (one line in server.js, before the 404 handler):
     require('./relationships').mount(app, db, { deepseek, genAI });
═══════════════════════════════════════ */

'use strict';

const os = require('os');
const path = require('path');
const schema = require('./schema');
const { createReadings } = require('./readings');
const { createRoutes } = require('./routes');
const { createCardCache } = require('./share-card');
const account = require('./account');

function mount(app, db, clients) {
  schema.up(db);
  const baseUrl = (process.env.BASE_URL || 'https://wobazi.com').replace(/\/+$/, '');
  const readings = createReadings(db, clients);
  // Production: next to the database on the persistent disk. Local dev: temp dir, so nothing lands in the repo.
  const cacheDir = process.env.DB_PATH
    ? path.join(path.dirname(process.env.DB_PATH), 'rel-share-cache')
    : path.join(os.tmpdir(), 'wobazi-rel-share-cache');
  const cards = createCardCache(cacheDir);
  account.setCardCache(cards);
  app.use(createRoutes(db, { readings, cards, baseUrl }));
  console.log('[relationships] Mounted: people, pair readings, invites, share links');
  return { readings, cards };
}

module.exports = { mount };
