/* URL normalisation: one canonical spelling, no redirect loops, no off-site Locations.
   Run: node --test test/url.test.js  (also part of `npm test`) */

'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert');
const { normalizePath, normalizeUrl } = require('../seo/url');

describe('normalizePath', () => {
  test('leaves canonical paths alone', () => {
    for (const p of ['/', '/what-is-bazi', '/chart', '/master-alice', '/app/', '/api/oracle', '/auth/google', '/i/abc', '/r/abc']) {
      assert.strictEqual(normalizePath(p), p, p);
    }
  });

  test('strips trailing slashes', () => {
    assert.strictEqual(normalizePath('/what-is-bazi/'), '/what-is-bazi');
    assert.strictEqual(normalizePath('/chart/'), '/chart');
    assert.strictEqual(normalizePath('/what-is-bazi///'), '/what-is-bazi');
  });

  test('collapses repeated slashes', () => {
    assert.strictEqual(normalizePath('//what-is-bazi'), '/what-is-bazi');
    assert.strictEqual(normalizePath('///what-is-bazi'), '/what-is-bazi');
    assert.strictEqual(normalizePath('/four//pillars'), '/four/pillars');
    assert.strictEqual(normalizePath('//app//'), '/app/');
  });

  /* https://wobazi.com//?begin=1 used to 301 to itself: ERR_TOO_MANY_REDIRECTS. */
  test('a bare // becomes the root, not an empty path', () => {
    for (const p of ['//', '///', '////']) {
      assert.strictEqual(normalizePath(p), '/', p);
    }
  });

  /* A Location of "//host/path" is protocol-relative: the browser leaves the site. */
  test('never returns a protocol-relative path', () => {
    for (const p of ['//evil.example.com/', '//evil.example.com//x', '///evil.example.com', '//what-is-bazi//']) {
      const out = normalizePath(p);
      assert.ok(out.startsWith('/'), out);
      assert.ok(!out.startsWith('//'), `protocol-relative: ${out}`);
    }
    assert.strictEqual(normalizePath('//evil.example.com/'), '/evil.example.com');
    assert.strictEqual(normalizePath('//what-is-bazi//'), '/what-is-bazi');
  });

  test('normalising twice changes nothing (the redirect cannot loop)', () => {
    for (const p of ['//', '//x//', '/a//b/', '/app//', '/api//x/', '/what-is-bazi/']) {
      const once = normalizePath(p);
      assert.strictEqual(normalizePath(once), once, p);
    }
  });

  test('handles odd input without throwing', () => {
    assert.strictEqual(normalizePath(''), '/');
    assert.strictEqual(normalizePath(null), '/');
    assert.strictEqual(normalizePath('no-leading-slash'), '/no-leading-slash');
  });
});

describe('normalizeUrl middleware', () => {
  const run = (method, originalUrl) => {
    const path = originalUrl.split('?')[0];
    const req = { method, path, originalUrl };
    let redirect = null, nexted = false;
    const res = { redirect: (code, to) => { redirect = { code, to }; } };
    normalizeUrl(req, res, () => { nexted = true; });
    return { redirect, nexted };
  };

  test('301s //?begin=1 to /?begin=1 once', () => {
    const { redirect } = run('GET', '//?begin=1');
    assert.deepStrictEqual(redirect, { code: 301, to: '/?begin=1' });
    // and the target itself is stable
    assert.strictEqual(run('GET', '/?begin=1').redirect, null);
  });

  test('keeps the query string', () => {
    assert.strictEqual(run('GET', '//what-is-bazi//?a=1&b=2').redirect.to, '/what-is-bazi?a=1&b=2');
  });

  test('passes canonical URLs through', () => {
    for (const u of ['/', '/chart#input', '/what-is-bazi', '/app/', '/api/oracle']) {
      const { redirect, nexted } = run('GET', u.split('#')[0]);
      assert.strictEqual(redirect, null, u);
      assert.ok(nexted, u);
    }
  });

  test('leaves non-GET requests alone', () => {
    const { redirect, nexted } = run('POST', '//api/daily-guidance');
    assert.strictEqual(redirect, null);
    assert.ok(nexted);
  });
});
