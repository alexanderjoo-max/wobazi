/* WoBazi i18n — English, Thai, Chinese */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'wobazi-lang';
  var LANGS = { en: 'EN', th: 'ไทย', zh: '中文' };
  var LABELS = {
    en: { en: 'English', th: 'ไทย', zh: '中文' },
    th: { en: 'English', th: 'ไทย', zh: '中文' },
    zh: { en: 'English', th: 'ไทย', zh: '中文' }
  };

  var STR = {
    'nav.privacy': { en: 'Privacy Policy', th: 'นโยบายความเป็นส่วนตัว', zh: '隐私政策' },
    'nav.terms': { en: 'Terms of Service', th: 'ข้อกำหนดการให้บริการ', zh: '服务条款' },
    'nav.begin': { en: 'Begin your free reading', th: 'เริ่มดูดวงฟรี', zh: '开始免费解读' },
    'nav.beginShort': { en: 'Free reading', th: 'ดูดวงฟรี', zh: '免费解读' },
    'nav.signin': { en: 'Sign in', th: 'เข้าสู่ระบบ', zh: '登录' },
    'nav.logout': { en: 'Logout', th: 'ออกจากระบบ', zh: '退出' },
    'nav.menu': { en: 'Menu', th: 'เมนู', zh: '菜单' },
    'nav.language': { en: 'Language', th: 'ภาษา', zh: '语言' },
    'footer.learn': { en: 'Learn', th: 'เรียนรู้', zh: '学习' },
    'footer.explore': { en: 'Explore', th: 'สำรวจ', zh: '探索' },
    'footer.app': { en: 'App', th: 'แอป', zh: '应用' },
    'footer.legal': { en: 'Legal', th: 'กฎหมาย', zh: '法律' },
    'footer.what': { en: 'What is BaZi?', th: 'ปาจื้อคืออะไร?', zh: '什么是八字？' },
    'footer.pillars': { en: 'Four Pillars of Destiny', th: 'สี่เสาแห่งโชคชะตา', zh: '四柱命理' },
    'footer.astrology': { en: 'Chinese Astrology', th: 'โหราศาสตร์จีน', zh: '中国占星' },
    'footer.daymaster': { en: 'Day Master Guide', th: 'คู่มือวันมาสเตอร์', zh: '日主指南' },
    'footer.compat': { en: 'Compatibility', th: 'ความเข้ากัน', zh: '合婚' },
    'footer.calculator': { en: 'Free Calculator', th: 'เครื่องคำนวณฟรี', zh: '免费排盘' },
    'footer.tagline': {
      en: 'Decode your destiny through the ancient art of the Four Pillars.',
      th: 'ถอดรหัสโชคชะตาด้วยศาสตร์โบราณแห่งสี่เสา.',
      zh: '以四柱古法解码你的命运。'
    },
    'footer.copy': { en: 'All rights reserved.', th: 'สงวนลิขสิทธิ์', zh: '保留所有权利。' },
    'cta.begin': { en: 'Begin your free reading', th: 'เริ่มดูดวงฟรี', zh: '开始免费解读' },
    'legal.binding': {
      en: 'The English version of this document is the binding agreement. Other languages are provided for convenience only.',
      th: 'ฉบับภาษาอังกฤษของเอกสารนี้เป็นข้อตกลงที่มีผลผูกพัน ภาษาอื่นจัดไว้เพื่อความสะดวกเท่านั้น',
      zh: '本文档以英文版本为准。其他语言译本仅供参考。'
    }
  };

  function normalize(code) {
    if (!code) return 'en';
    code = String(code).toLowerCase();
    if (code.indexOf('zh') === 0) return 'zh';
    if (code.indexOf('th') === 0) return 'th';
    if (code.indexOf('en') === 0) return 'en';
    return LANGS[code] ? code : 'en';
  }

  function readStored() {
    try { return normalize(localStorage.getItem(STORAGE_KEY)); } catch (e) { return 'en'; }
  }

  var current = (function () {
    try {
      var params = new URLSearchParams(location.search);
      if (params.get('lang')) return normalize(params.get('lang'));
    } catch (e) {}
    return readStored();
  })();

  function t(key, lang) {
    lang = lang || current;
    var row = STR[key];
    if (!row) return key;
    return row[lang] || row.en || key;
  }

  function htmlLang(code) {
    return code === 'zh' ? 'zh-CN' : code === 'th' ? 'th' : 'en';
  }

  function applySpans(lang) {
    var nodes = document.querySelectorAll('.en, .zh, .th');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var want = el.classList.contains('zh') ? 'zh' : el.classList.contains('th') ? 'th' : 'en';
      var show = want === lang;
      if (lang === 'th' && want === 'en' && el.parentElement && !el.parentElement.querySelector('.th')) {
        show = true;
      }
      el.classList.toggle('hide', !show);
    }
  }

  function applyData(lang) {
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var key = el.getAttribute('data-i18n');
      if (!key || !STR[key]) continue;
      var text = t(key, lang);
      var target = el.querySelector('[data-i18n-label]') || el;
      if (target.childNodes.length === 1 && target.childNodes[0].nodeType === 3) {
        target.textContent = text;
      } else if (target.hasAttribute('data-i18n-label') || target === el) {
        var label = el.querySelector('[data-i18n-label]');
        if (label) label.textContent = text;
        else if (!el.querySelector('svg, img')) el.textContent = text;
        else {
          var span = el.querySelector('span:not(.cta-short)');
          if (span && !span.querySelector('svg')) span.textContent = text;
        }
      }
    }
    var ph = document.querySelectorAll('[data-i18n-placeholder]');
    for (var j = 0; j < ph.length; j++) {
      var pkey = ph[j].getAttribute('data-i18n-placeholder');
      if (STR[pkey]) ph[j].placeholder = t(pkey, lang);
    }
  }

  function updateSwitchers(lang) {
    var switches = document.querySelectorAll('[data-lang-switch]');
    for (var i = 0; i < switches.length; i++) {
      var root = switches[i];
      var label = root.querySelector('.lang-switch-label');
      if (label) label.textContent = LANGS[lang] || 'EN';
      var opts = root.querySelectorAll('[data-lang]');
      for (var k = 0; k < opts.length; k++) {
        opts[k].setAttribute('aria-selected', opts[k].getAttribute('data-lang') === lang ? 'true' : 'false');
      }
    }
  }

  function apply(lang) {
    lang = normalize(lang);
    current = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    document.documentElement.lang = htmlLang(lang);
    document.documentElement.setAttribute('data-lang', lang);
    applySpans(lang);
    applyData(lang);
    updateSwitchers(lang);
    try {
      document.dispatchEvent(new CustomEvent('wobazi:lang', { detail: { lang: lang } }));
    } catch (e) {}
  }

  function closeMenus() {
    var open = document.querySelectorAll('.lang-switch.is-open, .site-nav.is-open');
    for (var i = 0; i < open.length; i++) {
      open[i].classList.remove('is-open');
      var btn = open[i].querySelector('[aria-expanded]');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  }

  function bind() {
    document.addEventListener('click', function (e) {
      var langBtn = e.target.closest('[data-lang]');
      if (langBtn && langBtn.getAttribute('data-lang')) {
        apply(langBtn.getAttribute('data-lang'));
        closeMenus();
        return;
      }
      var toggle = e.target.closest('.lang-switch-btn');
      if (toggle) {
        var root = toggle.closest('.lang-switch');
        var willOpen = !root.classList.contains('is-open');
        closeMenus();
        if (willOpen) {
          root.classList.add('is-open');
          toggle.setAttribute('aria-expanded', 'true');
        }
        return;
      }
      var menuBtn = e.target.closest('.site-nav-toggle');
      if (menuBtn) {
        var nav = menuBtn.closest('.site-nav');
        var open = !nav.classList.contains('is-open');
        nav.classList.toggle('is-open', open);
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        return;
      }
      if (!e.target.closest('.lang-switch') && !e.target.closest('.site-nav-toggle') && !e.target.closest('.site-nav-drawer')) {
        closeMenus();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenus();
    });
  }

  function init() {
    bind();
    apply(current);
  }

  global.WoBaziI18n = {
    t: t,
    get: function () { return current; },
    set: apply,
    apply: apply,
    langs: LANGS,
    labels: LABELS
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window);
