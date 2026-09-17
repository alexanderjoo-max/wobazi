/* ═══════════════════════════════════════
   WOBAZI — Landing page (/)
   public/js/landing.js

   SEO Phase 2 moved the app out of the homepage: `/` is now a server-rendered page and the
   app lives at /chart. This carries the handful of behaviours the landing markup needs — the
   star field, the hero parallax, the scroll reveal and the CTA state — with the same function
   names the markup calls, so the markup itself is unchanged.

   The star field and parallax are copied verbatim from app/script.js (buildStars /
   initSplashExperience) so the landing renders and moves identically.
═══════════════════════════════════════ */

(function () {
  'use strict';

  var CHART_STORE_KEY = 'wobazi_chart_v1';
  var APP = '/chart';

  function getStoredChart() {
    try {
      var raw = localStorage.getItem(CHART_STORE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function hasStoredChart() {
    var p = getStoredChart();
    return !!(p && p.year && p.month && p.day);
  }

  /* Called from the markup (same names as in the app). */
  window.haptic = function haptic(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern || 10);
  };
  window.closeAppNav = function closeAppNav() {
    document.querySelectorAll('.app-nav.is-open, .site-nav.is-open').forEach(function (n) {
      n.classList.remove('is-open');
      n.querySelectorAll('[aria-expanded="true"]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    });
  };
  window.goToLanding = function goToLanding() { closeAppNav(); };
  window.goToInput = function goToInput() { closeAppNav(); location.href = APP + '#input'; };
  window.continueReading = function continueReading() { closeAppNav(); location.href = APP + '#today'; };
  window.onLandingPrimary = function onLandingPrimary() {
    if (hasStoredChart()) continueReading();
    else goToInput();
  };
  window.logout = function logout() { location.href = '/auth/logout'; };
  window.loginWithGoogle = function loginWithGoogle() { location.href = '/auth/google'; };

  /* Header menu (views/partials/nav-menu.ejs) — on the landing every action is a real link into
     the app, so let the browser follow the href instead of routing in place. */
  window.appNav = function appNav(e, action) {
    if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) return true;
    closeAppNav();
    window.haptic(6);
    if (action === 'logout') { if (e) e.preventDefault(); window.logout(); return false; }
    if (action === 'login') { if (e) e.preventDefault(); window.loginWithGoogle(); return false; }
    return true;
  };

  /* Guest CTA state: "Plot Your Chart" until this browser has a chart, then "Continue Your
     Reading" plus the secondary "New reading". Guest vs member is decided server-side. */
  function updateLandingCtas() {
    var has = hasStoredChart();
    var primary = document.getElementById('splash-cta-primary');
    var secondary = document.getElementById('splash-cta-secondary');
    if (primary) {
      primary.querySelectorAll('.cta-begin').forEach(function (el) { el.classList.toggle('hide', has); });
      primary.querySelectorAll('.cta-continue').forEach(function (el) { el.classList.toggle('hide', !has); });
    }
    if (secondary) secondary.classList.toggle('hide', !has);
  }
  window.updateLandingCtas = updateLandingCtas;

  /* Verbatim from app/script.js buildStars(): same counts, sizes, hues and timings. */
  function buildStars() {
    var container = document.getElementById('stars');
    if (!container || container.dataset.built) return;
    container.dataset.built = '1';
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var count = reduce ? 40 : 110;
    for (var i = 0; i < count; i++) {
      var s = document.createElement('div');
      var isDust = !reduce && i < 14;
      s.className = isDust ? 'star star-dust' : (!reduce && i % 5 === 0 ? 'star star-drift' : 'star');
      var hues = ['#ff8ad8', '#7ce7ff', '#c4a2ff', '#ffb4a2'];
      var dust = hues[i % hues.length];
      var size = isDust ? Math.random() * 2 + 1.2 : Math.random() * 2.5 + 0.5;
      var dx = ((Math.random() * 18) - 6).toFixed(1);
      var dy = ((Math.random() * -22) - 4).toFixed(1);
      s.style.cssText = `
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      width:${size}px; height:${size}px;
      --dur:${2 + Math.random() * 3}s;
      --drift:${14 + Math.random() * 16}s;
      --dx:${dx}px; --dy:${dy}px;
      animation-delay:${Math.random() * 4}s;
      ${isDust ? `background:${dust}; box-shadow:0 0 7px ${dust};` : ''}
    `;
      container.appendChild(s);
    }
  }

  function initSplashExperience() {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var revealEls = document.querySelectorAll('.feat-card, .splash-bazi');
    if (reduce) {
      revealEls.forEach(function (el) { el.classList.add('is-in'); });
    } else if (revealEls.length && 'IntersectionObserver' in window) {
      var root = document.getElementById('splash');
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      }, { root: root, threshold: 0.16, rootMargin: '0px 0px -16px 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-in'); });
    }

    var sigil = document.getElementById('hero-sigil');
    var splash = document.getElementById('splash');
    if (!sigil || !splash || reduce) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    var raf = 0;
    var tx = 0, ty = 0;
    splash.addEventListener('pointermove', function (e) {
      var r = splash.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 12;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 10;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        sigil.style.transform = 'translate3d(' + tx.toFixed(2) + 'px, ' + ty.toFixed(2) + 'px, 0)';
        raf = 0;
      });
    });
  }

  /* Old in-app links were hashes on the homepage (/#input, /#you, /#relationships/p/3 ...).
     They still arrive here, so hand them to the app. Kept as a replace() so the landing does
     not linger in history. */
  var APP_ROUTES = /^(input|begin|today|you|actions|relationships|portal|history|account|oracle)(\/|$)/;
  function redirectAppHash() {
    var h = (location.hash || '').replace(/^#/, '');
    if (!h || !APP_ROUTES.test(h)) return false;
    location.replace(APP + location.search + '#' + h);
    return true;
  }

  function init() {
    if (redirectAppHash()) return;
    buildStars();
    initSplashExperience();
    updateLandingCtas();
  }

  /* Run the hash check before first paint, not on DOMContentLoaded, so an old link does not
     flash the landing first. */
  if (!redirectAppHash()) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  }
  window.addEventListener('hashchange', redirectAppHash);
})();
