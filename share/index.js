/**
 * share/index.js — Share image generation module
 *
 * Usage in server.js:
 *   require('./share').mount(app);
 */

const routes = require('./routes');
const { loadFonts } = require('./render');

function mount(app) {
  // Pre-load fonts at startup
  loadFonts();

  // Wire routes
  app.use(routes);

  console.log('[share] Share image endpoints mounted: /api/share-image, /api/share-story');
}

module.exports = { mount };
