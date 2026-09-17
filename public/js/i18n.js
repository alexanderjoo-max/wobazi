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
    'nav.explainer': { en: 'BaZi Explainer', th: 'คู่มือปาจื้อ', zh: '八字讲解' },
    'nav.about': { en: 'Master Alice', th: 'มาสเตอร์อลิซ', zh: 'Master Alice' },
    'nav.back': { en: 'Back', th: 'กลับ', zh: '返回' },
    'nav.begin': { en: 'Plot Your Chart', th: 'จัดแผนภูมิของคุณ', zh: '排出你的命盘' },
    'nav.seeChart': { en: 'See Your Chart', th: 'ดูแผนภูมิของคุณ', zh: '查看你的命盘' },
    'nav.beginShort': { en: 'Plot chart', th: 'จัดแผนภูมิ', zh: '排盘' },
    'nav.signin': { en: 'Sign in', th: 'เข้าสู่ระบบ', zh: '登录' },
    'nav.signinGoogle': { en: 'Sign in with Google', th: 'เข้าสู่ระบบด้วย Google', zh: '使用 Google 登录' },
    'nav.logout': { en: 'Logout', th: 'ออกจากระบบ', zh: '退出' },
    'nav.menu': { en: 'Menu', th: 'เมนู', zh: '菜单' },
    'nav.language': { en: 'Language', th: 'ภาษา', zh: '语言' },
    'nav.share': { en: 'Share', th: 'แชร์', zh: '分享' },
    'nav.editBirth': { en: 'Edit birth data', th: 'แก้ข้อมูลเกิด', zh: '修改出生资料' },
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
    'footer.udestiny': { en: 'A U Destiny product', th: 'ผลิตภัณฑ์จาก U Destiny', zh: 'U Destiny 旗下产品' },
    'footer.tagline': {
      en: 'Decode your destiny through the ancient art of the Four Pillars.',
      th: 'ถอดรหัสโชคชะตาด้วยศาสตร์โบราณแห่งสี่เสา.',
      zh: '以四柱古法解码你的命运。'
    },
    'footer.cookies': { en: 'Cookie settings', th: 'ตั้งค่าคุกกี้', zh: 'Cookie 设置' },
    'footer.contact': { en: 'Contact', th: 'ติดต่อ', zh: '联系' },
    'footer.copy': { en: 'All rights reserved.', th: 'สงวนลิขสิทธิ์', zh: '保留所有权利。' },
    'footer.member': { en: 'My Wobazi', th: 'Wobazi ของฉัน', zh: '我的 Wobazi' },
    'footer.portal': { en: 'My Wobazi', th: 'Wobazi ของฉัน', zh: '我的 Wobazi' },
    'footer.history': { en: 'Reading History', th: 'ประวัติการดูดวง', zh: '解读记录' },
    'footer.account': { en: 'Account', th: 'บัญชี', zh: '账户' },
    'footer.logout': { en: 'Log out', th: 'ออกจากระบบ', zh: '退出登录' },
    'footer.disclaimer': { en: 'For entertainment & self-reflection purposes only. Not a substitute for professional advice.', th: 'เพื่อความบันเทิงและการใคร่ครวญเท่านั้น ไม่ใช่คำแนะนำจากผู้เชี่ยวชาญ', zh: '仅供娱乐与自我反思。不能替代专业建议。' },
    'nav.myWobazi': { en: 'My Wobazi', th: 'Wobazi ของฉัน', zh: '我的 Wobazi' },
    'cta.begin': { en: 'Plot Your Chart', th: 'จัดแผนภูมิของคุณ', zh: '排出你的命盘' },
    'legal.binding': {
      en: 'The English version of this document is the binding agreement. Other languages are provided for convenience only.',
      th: 'ฉบับภาษาอังกฤษของเอกสารนี้เป็นข้อตกลงที่มีผลผูกพัน ภาษาอื่นจัดไว้เพื่อความสะดวกเท่านั้น',
      zh: '本文档以英文版本为准。其他语言译本仅供参考。'
    },
    'toc.overview': { en: 'Overview', th: 'ภาพรวม', zh: '总览' },
    'toc.pillars': { en: 'Four Pillars', th: 'สี่เสา', zh: '四柱' },
    'toc.elements': { en: 'Five Elements', th: 'ธาตุทั้งห้า', zh: '五行' },
    'toc.yinyang': { en: 'Yin & Yang', th: 'หยินหยาง', zh: '阴阳' },
    'toc.zodiac': { en: 'Zodiac', th: 'นักษัตร', zh: '生肖' },
    'toc.daymaster': { en: 'Day Master', th: 'วันมาสเตอร์', zh: '日主' },
    'toc.compat': { en: 'Compatibility', th: 'ความเข้ากัน', zh: '合婚' },
    'toc.how': { en: 'How It Works', th: 'วิธีอ่านดวง', zh: '如何排盘' },
    'page.what.title': { en: 'What is BaZi?', th: 'ปาจื้อคืออะไร?', zh: '什么是八字？' },
    'page.what.sub': {
      en: 'The ancient Chinese system of Four Pillars astrology that decodes your destiny from the moment you were born.',
      th: 'ระบบโหราศาสตร์จีนโบราณแห่งสี่เสา ที่ถอดรหัสโชคชะตาจากวินาทีที่คุณเกิด',
      zh: '源自出生时刻的古代中国四柱命理，用以解读命运。'
    },
    'page.pillars.title': { en: 'Four Pillars of Destiny', th: 'สี่เสาแห่งโชคชะตา', zh: '四柱命理' },
    'page.astrology.title': { en: 'Chinese Astrology', th: 'โหราศาสตร์จีน', zh: '中国占星' },
    'page.daymaster.title': { en: 'BaZi Day Master Guide', th: 'คู่มือวันมาสเตอร์', zh: '八字日主指南' },
    'page.compat.title': { en: 'BaZi Compatibility', th: 'ความเข้ากันทางปาจื้อ', zh: '八字合婚' }
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

  function normPhrase(s) {
    return String(s || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&nbsp;/g, ' ')
      .replace(/&middot;/g, '·')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  var byEn = null;
  function indexByEn() {
    byEn = Object.create(null);
    for (var k in STR) {
      if (!Object.prototype.hasOwnProperty.call(STR, k)) continue;
      var row = STR[k];
      if (!row || !row.en) continue;
      var key = normPhrase(row.en);
      if (key) byEn[key] = row;
    }
  }

  function lookup(en, lang) {
    if (!en || !lang || lang === 'en') return '';
    if (!byEn) indexByEn();
    var row = byEn[normPhrase(en)];
    if (!row) return '';
    return row[lang] || '';
  }

  function setHtmlOrText(el, text) {
    if (/<[a-z][\s\S]*>/i.test(text)) el.innerHTML = text;
    else el.textContent = text;
  }

  function langOf(el) {
    if (el.classList.contains('zh')) return 'zh';
    if (el.classList.contains('th')) return 'th';
    return 'en';
  }

  function hasLangSibling(el, lang) {
    var p = el.parentElement;
    if (!p) return false;
    for (var n = p.firstElementChild; n; n = n.nextElementSibling) {
      if (n === el) continue;
      if (n.tagName === el.tagName && n.classList.contains(lang)) return true;
    }
    return false;
  }

  function ensureOrig(el) {
    if (!el.hasAttribute('data-i18n-orig')) el.setAttribute('data-i18n-orig', el.innerHTML);
  }

  function restoreOrig(el) {
    if (el.hasAttribute('data-i18n-orig')) el.innerHTML = el.getAttribute('data-i18n-orig');
  }

  function applySpans(lang) {
    var nodes = document.querySelectorAll('.en, .zh, .th');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var want = langOf(el);

      if (want === 'en') {
        ensureOrig(el);
        if (lang === 'en') {
          restoreOrig(el);
          el.classList.remove('hide');
          continue;
        }
        if (hasLangSibling(el, lang)) {
          restoreOrig(el);
          el.classList.add('hide');
          continue;
        }
        var orig = el.getAttribute('data-i18n-orig');
        var tr = lookup(orig, lang);
        if (tr) setHtmlOrText(el, tr);
        else restoreOrig(el);
        el.classList.remove('hide');
        continue;
      }

      if (!hasLangSibling(el, 'en')) {
        el.classList.remove('hide');
        continue;
      }
      el.classList.toggle('hide', want !== lang);
    }
  }

  function applyData(lang) {
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var key = el.getAttribute('data-i18n');
      if (!key || !STR[key]) continue;
      var text = t(key, lang);
      var labeled = el.querySelector('[data-i18n-label]');
      if (labeled) {
        labeled.textContent = text;
        continue;
      }
      if (el.querySelector('svg, img, canvas')) continue;
      if (el.querySelector('.en, .zh, .th')) continue;
      setHtmlOrText(el, text);
    }
    var ph = document.querySelectorAll('[data-i18n-placeholder]');
    for (var j = 0; j < ph.length; j++) {
      var pkey = ph[j].getAttribute('data-i18n-placeholder');
      if (STR[pkey]) ph[j].placeholder = t(pkey, lang);
    }
    var ar = document.querySelectorAll('[data-i18n-aria]');
    for (var a = 0; a < ar.length; a++) {
      var akey = ar[a].getAttribute('data-i18n-aria');
      if (STR[akey]) ar[a].setAttribute('aria-label', t(akey, lang));
    }
  }

  function add(map) {
    if (!map) return;
    for (var k in map) {
      if (Object.prototype.hasOwnProperty.call(map, k)) STR[k] = map[k];
    }
    byEn = null;
    if (document.readyState !== 'loading') apply(current);
  }

  function updateSwitchers(lang) {
    var switches = document.querySelectorAll('[data-lang-switch]');
    for (var i = 0; i < switches.length; i++) {
      var root = switches[i];
      var label = root.querySelector('.lang-switch-label');
      if (label) label.textContent = LANGS[lang] || 'EN';
    }
    var opts = document.querySelectorAll('button[data-lang]');
    for (var k = 0; k < opts.length; k++) {
      opts[k].setAttribute('aria-pressed', opts[k].getAttribute('data-lang') === lang ? 'true' : 'false');
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
    var backs = document.querySelectorAll('[data-wobazi-back]');
    for (var b = 0; b < backs.length; b++) backs[b].setAttribute('aria-label', t('nav.back'));
    try {
      document.dispatchEvent(new CustomEvent('wobazi:lang', { detail: { lang: lang } }));
    } catch (e) {}
  }

  function closeMenus() {
    var open = document.querySelectorAll('.lang-switch.is-open, .app-nav.is-open, .site-nav.is-open');
    for (var i = 0; i < open.length; i++) {
      open[i].classList.remove('is-open');
      var btns = open[i].querySelectorAll('[aria-expanded="true"]');
      for (var b = 0; b < btns.length; b++) btns[b].setAttribute('aria-expanded', 'false');
    }
  }

  function fromEvent(el) {
    if (!el) return null;
    if (el.nodeType === 3) el = el.parentElement;
    return el;
  }

  function toggleLangMenu(btn, e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    btn = fromEvent(btn);
    if (!btn) return;
    var root = btn.closest ? btn.closest('.lang-switch') : btn.parentElement;
    if (!root) return;
    var willOpen = !root.classList.contains('is-open');
    closeMenus();
    if (willOpen) {
      root.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
    }
  }

  function toggleSiteNav(btn, e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    btn = fromEvent(btn);
    if (!btn) return;
    var nav = btn.closest ? (btn.closest('.app-nav') || btn.closest('.site-nav')) : null;
    if (!nav) return;
    var willOpen = !nav.classList.contains('is-open');
    closeMenus();
    if (willOpen) {
      nav.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
    }
  }

  function setLangFromUi(code, e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    apply(code);
    var open = document.querySelectorAll('.lang-switch.is-open');
    for (var i = 0; i < open.length; i++) {
      open[i].classList.remove('is-open');
      var btn = open[i].querySelector('[aria-expanded="true"]');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  }

  function bind() {
    document.addEventListener('click', function (e) {
      var t = fromEvent(e.target);
      if (!t || !t.closest) { closeMenus(); return; }
      if (t.closest('.lang-switch') || t.closest('.site-nav-toggle') || t.closest('.drawer-card')) return;
      closeMenus();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenus();
    });
  }

  function sameOriginRef() {
    try {
      if (!document.referrer) return false;
      var u = new URL(document.referrer);
      if (u.origin !== location.origin) return false;
      return (u.pathname + u.search) !== (location.pathname + location.search);
    } catch (e) { return false; }
  }

  function wobaziGoBack() {
    var fallback = '/';
    try { fallback = sessionStorage.getItem('wobazi-return') || '/'; } catch (e) {}
    if (sameOriginRef() && window.history.length > 1) {
      var left = false;
      window.addEventListener('pagehide', function () { left = true; }, { once: true });
      history.back();
      setTimeout(function () {
        if (!left) location.href = fallback;
      }, 350);
      return;
    }
    location.href = fallback;
  }

  function bindBackButtons() {
    var btns = document.querySelectorAll('[data-wobazi-back]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute('aria-label', t('nav.back'));
      btns[i].addEventListener('click', function (e) {
        e.preventDefault();
        wobaziGoBack();
      });
    }
  }

  function rememberReturn() {
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (!href || href.charAt(0) === '#' || href.indexOf('http') === 0 || href.indexOf('mailto:') === 0) return;
      if (href.indexOf('/auth') === 0 || href === '/' || href.indexOf('/?') === 0) return;
      try {
        sessionStorage.setItem('wobazi-return', location.pathname + location.search + location.hash);
      } catch (err) {}
    });
  }

  function init() {
    bind();
    bindBackButtons();
    rememberReturn();
    if (global.__WOBAZI_I18N_PENDING) {
      var pending = global.__WOBAZI_I18N_PENDING;
      global.__WOBAZI_I18N_PENDING = null;
      for (var k in pending) {
        if (Object.prototype.hasOwnProperty.call(pending, k)) STR[k] = pending[k];
      }
      byEn = null;
    }
    apply(current);
  }

  global.WoBaziI18n = {
    t: t,
    lookup: lookup,
    get: function () { return current; },
    set: apply,
    apply: apply,
    add: add,
    langs: LANGS,
    labels: LABELS
  };
  global.toggleLangMenu = toggleLangMenu;
  global.toggleSiteNav = toggleSiteNav;
  global.setWobaziLang = setLangFromUi;
  global.wobaziGoBack = wobaziGoBack;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window);
