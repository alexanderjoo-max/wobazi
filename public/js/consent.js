/* ═══════════════════════════════════════
   Cookie consent (Google Consent Mode v2)
   The page head sets consent to denied by default (see CONSENT_DEFAULT snippet).
   This banner asks once, stores the choice, and updates gtag.
   Any element with [data-cookie-settings] reopens it.
═══════════════════════════════════════ */
(function () {
  'use strict';
  var KEY = 'wobazi-consent';
  var COPY = {
    en: {
      body: 'We use a sign-in cookie that the site needs, and Google Analytics cookies to see which pages help people. Analytics stays off unless you allow it.',
      accept: 'Allow analytics', decline: 'Only necessary', more: 'Privacy Policy', label: 'Cookie consent'
    },
    zh: {
      body: '我们使用登录所必需的 Cookie，以及 Google Analytics 分析 Cookie 来了解哪些页面有帮助。未经你允许，分析功能保持关闭。',
      accept: '允许分析', decline: '仅必要', more: '隐私政策', label: 'Cookie 同意'
    },
    th: {
      body: 'เราใช้คุกกี้ที่จำเป็นสำหรับการเข้าสู่ระบบ และคุกกี้ Google Analytics เพื่อดูว่าหน้าไหนมีประโยชน์ การวิเคราะห์จะปิดอยู่จนกว่าคุณจะอนุญาต',
      accept: 'อนุญาตการวิเคราะห์', decline: 'เฉพาะที่จำเป็น', more: 'นโยบายความเป็นส่วนตัว', label: 'ความยินยอมคุกกี้'
    }
  };

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function lang() {
    var l = document.documentElement.getAttribute('data-lang') || document.documentElement.lang || 'en';
    l = String(l).toLowerCase();
    return l.indexOf('zh') === 0 ? 'zh' : l.indexOf('th') === 0 ? 'th' : 'en';
  }
  function apply(v) {
    if (typeof window.gtag !== 'function') return;
    var granted = v === 'granted' ? 'granted' : 'denied';
    window.gtag('consent', 'update', { analytics_storage: granted });
  }

  var CSS = '' +
    '.wz-consent{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:2147483000;' +
    'max-width:560px;margin:0 auto;padding:16px 16px 14px;border-radius:16px;background:rgba(17,14,28,.97);color:#f3efe6;' +
    'border:1px solid rgba(232,194,106,.35);box-shadow:0 18px 50px rgba(0,0,0,.45);font:14px/1.5 Outfit,system-ui,-apple-system,sans-serif;' +
    'transform:translateY(0);transition:transform .25s ease,opacity .25s ease}' +
    '.wz-consent[hidden]{display:none}' +
    '.wz-consent p{margin:0 0 12px;color:rgba(243,239,230,.86)}' +
    '.wz-consent a{color:#e8c26a;text-decoration:underline;text-underline-offset:2px}' +
    '.wz-consent-row{display:flex;gap:8px;flex-wrap:wrap}' +
    '.wz-consent button{flex:1 1 140px;min-height:44px;border-radius:999px;font:600 14px/1 Outfit,system-ui,sans-serif;cursor:pointer;padding:0 16px}' +
    '.wz-consent .wz-yes{background:linear-gradient(90deg,#f2cf6e,#e89a4a);color:#1a1206;border:0}' +
    '.wz-consent .wz-no{background:transparent;color:#f3efe6;border:1px solid rgba(243,239,230,.3)}' +
    '.wz-consent button:focus-visible{outline:2px solid #e8c26a;outline-offset:2px}' +
    '@media (prefers-reduced-motion:reduce){.wz-consent{transition:none}}';

  var el = null;
  function build() {
    if (el) return el;
    var t = COPY[lang()];
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    el = document.createElement('div');
    el.className = 'wz-consent';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-label', t.label);
    el.hidden = true;
    el.innerHTML = '<p>' + t.body + ' <a href="/privacy#cookies">' + t.more + '</a></p>' +
      '<div class="wz-consent-row"><button type="button" class="wz-no">' + t.decline + '</button>' +
      '<button type="button" class="wz-yes">' + t.accept + '</button></div>';
    el.querySelector('.wz-yes').addEventListener('click', function () { choose('granted'); });
    el.querySelector('.wz-no').addEventListener('click', function () { choose('denied'); });
    document.body.appendChild(el);
    return el;
  }
  function choose(v) {
    write(v);
    apply(v);
    if (el) el.hidden = true;
  }
  function open() { build().hidden = false; }

  function init() {
    if (!read()) open();
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest && e.target.closest('[data-cookie-settings]');
      if (!trigger) return;
      e.preventDefault();
      open();
    });
  }
  window.wobaziConsent = { open: open, get: read };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
