/* Markup guards that are easy to lose in a refactor.
   Run: node --test test/markup.test.js  (part of `npm test`) */

'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const APP_HTML = fs.readFileSync(path.join(__dirname, '..', 'app', 'index.html'), 'utf8');
const LANDING = fs.readFileSync(path.join(__dirname, '..', 'views', 'pages', 'landing.ejs'), 'utf8');

describe('app shell', () => {
  /* Since Phase 2, /chart is a fresh page load: the form is server-rendered and visible before
     script.js has executed. An unguarded onsubmit falls through to a native GET, navigating to
     /chart?name=...&gender=... and losing the birth data the visitor just typed. */
  test('the birth form cannot submit natively before script.js is ready', () => {
    const form = APP_HTML.match(/<form id="bazi-form"[^>]*>/);
    assert.ok(form, 'no #bazi-form');
    assert.match(form[0], /typeof handleSubmit === 'function'/, 'onsubmit is not guarded');
    assert.match(form[0], /preventDefault/, 'the fallback does not prevent the native submit');
  });

  test('the shell no longer carries the landing or the in-app explainer', () => {
    assert.ok(!/id="splash"/.test(APP_HTML), 'the splash screen is back in the app shell');
    assert.ok(!/id="about"/.test(APP_HTML), 'the in-app explainer is back in the app shell');
  });

  test('sendApp still has its markers to fill', () => {
    for (const marker of ['<!-- APP_HEAD_SEO', '<!-- SITE_FOOTER -->', '<!-- NAV_MENU:']) {
      assert.ok(APP_HTML.includes(marker), `missing marker: ${marker}`);
    }
  });
});

describe('landing page', () => {
  test('old app hashes are redirected before first paint', () => {
    const head = LANDING.slice(0, LANDING.indexOf('</head>'));
    assert.match(head, /location\.replace\('\/chart'/, 'no pre-paint redirect to /chart');
    assert.match(head, /input\|begin\|today\|you/, 'the app route list is missing');
  });
});
