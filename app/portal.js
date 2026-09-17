/* ═══════════════════════════════════════
   WOBAZI — Registered User Portal (client)
   app/portal.js

   Loaded before script.js so applyRoute() can reach it on first paint.
   It only defines window.WobaziPortal; the script.js helpers it uses
   (_t, goHash, showScreen, dateLocale, _currentUser, _savedReading,
   getStoredChart, continueReading, goToInput, loginWithGoogle, logout)
   are read at call time.

   Routes (all inside the #portal screen):
     #portal          home — chart, today, record, luck pillar, recent readings
     #history         archive, newest first, month + day strips
     #history/DATE    one stored reading + private journal
     #account         sign-in method, export, sign out, delete account

   Reading history: when a signed-in user's Today reading has rendered,
   the context strip + hero card are stored exactly as shown (first write
   of the day wins). History replays that stored markup — it never
   recalculates or regenerates a past day.
═══════════════════════════════════════ */
(function () {
  'use strict';

  const PAGE = 20;
  const KEEP_PROMPT_KEY = 'wobazi_keep_prompt_v1';
  const RETURN_KEY = 'wobazi_return_hash';
  const TABS = ['you', 'luck', 'today', 'actions', 'relationships'];

  let pending = null;   // today's snapshot, waiting for auth
  let sentDate = null;  // date already posted this page load
  let mePromise = null;
  const hist = { loaded: false, stale: false, next: null, months: [], month: null, lastMonthHead: null, loading: false };

  /* ── Small helpers ── */
  function pad(n) { return String(n).padStart(2, '0'); }
  function localDate(d) {
    d = d || new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
  function parseYmd(s) {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d || 1);
  }
  function fmtDate(s, opts) {
    return parseYmd(s).toLocaleDateString(dateLocale(), opts || { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function el(id) { return document.getElementById(id); }
  function plain(en, zh, th) {
    const lang = typeof currentLang === 'function' ? currentLang() : 'en';
    return lang === 'zh' ? zh : lang === 'th' ? th : en;
  }
  function plural(n, word) { return `${n} ${word}${n === 1 ? '' : 's'}`; }
  function signedIn() {
    return typeof _currentUser !== 'undefined' && !!_currentUser;
  }
  function storage(kind) {
    try { return kind === 'session' ? window.sessionStorage : window.localStorage; } catch (e) { return null; }
  }
  function getFlag(key, kind) {
    const s = storage(kind);
    try { return s ? s.getItem(key) : null; } catch (e) { return null; }
  }
  function setFlag(key, val, kind) {
    const s = storage(kind);
    try { if (s) { if (val == null) s.removeItem(key); else s.setItem(key, val); } } catch (e) { /* private mode */ }
  }
  function whoami() {
    if (signedIn()) return Promise.resolve(true);
    if (!mePromise) {
      mePromise = fetch('/api/me').then(r => r.json()).then(d => !!(d && d.user)).catch(() => null);
    }
    return mePromise;
  }

  const REACTIONS = {
    accurate: { icon: '✓', label: () => _t('Accurate', '准', 'แม่น') },
    off: { icon: '✕', label: () => _t('Off', '不准', 'ไม่ตรง') },
    unsure: { icon: '?', label: () => _t('Unsure', '说不准', 'ไม่แน่ใจ') },
  };
  function privacyLine() {
    return `<p class="portal-private">🔒&nbsp;${_t(
      'Private to you. Your notes are never used to train AI, never shown to anyone else, and never counted in aggregate.',
      '仅你可见。你的笔记绝不会用于训练 AI，绝不会展示给他人，也不会被汇总统计。',
      'เป็นส่วนตัว บันทึกของคุณจะไม่ถูกใช้ฝึก AI ไม่แสดงให้ใครเห็น และไม่ถูกนำไปรวมสถิติ'
    )}</p>`;
  }

  /* ═══════════ Capture ═══════════ */
  function textOf(node) {
    if (!node) return '';
    const en = node.querySelector('.en');
    return (en ? en.textContent : node.textContent).trim();
  }
  function langText(node, cls) {
    const s = node && node.querySelector('.' + cls);
    return s ? s.textContent.trim() : '';
  }
  function scrub(root) {
    root.removeAttribute('id');
    root.removeAttribute('onclick');
    root.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
    root.querySelectorAll('[onclick]').forEach(n => n.removeAttribute('onclick'));
  }

  /* Luck pillar position exactly as the Your Chart tab rendered it (never recalculated here). */
  function readLuck() {
    const cur = document.querySelector('#decades-card .luck-block.is-current');
    if (!cur) return null;
    const pick = b => b ? {
      chars: textOf(b.querySelector('.luck-chars')),
      years: textOf(b.querySelector('.luck-years')),
      ages: textOf(b.querySelector('.luck-age')),
      pre: b.classList.contains('luck-pre'),
    } : null;
    const nxt = cur.nextElementSibling && cur.nextElementSibling.classList.contains('luck-block') ? cur.nextElementSibling : null;
    return { current: pick(cur), next: pick(nxt) };
  }

  function captureToday(meta) {
    const strip = el('context-strip');
    const hero = el('hero-card');
    if (!strip || !hero || hero.querySelector('.guidance-loading')) return;

    const s = strip.cloneNode(true);
    const h = hero.cloneNode(true);
    h.querySelectorAll('[style*="display:none"]').forEach(n => n.remove());
    scrub(s);
    scrub(h);

    const heroText = el('cs-hero-text');
    const guidance = Array.from(hero.querySelectorAll('.hc-bullets .hc-bullet')).map(b => ({
      key: textOf(b.children[0]),
      en: textOf(b.children[1]),
      zh: langText(b.children[1], 'zh'),
    }));

    pending = {
      date: localDate(),
      summary: {
        pillar: (el('cs-chinese') || {}).textContent || '',
        pillarLabel: textOf(el('cs-pillar')),
        score: parseInt((el('cs-score') || {}).textContent, 10) || null,
        verdict: textOf(el('cs-verdict')),
        heroText: { en: textOf(heroText), zh: langText(heroText, 'zh'), th: langText(heroText, 'th') },
        guidance,
        dominantEl: (meta && meta.dominantEl) || null,
        luck: readLuck(),
      },
      stripHtml: s.innerHTML,
      heroHtml: h.innerHTML,
    };
    flush();
    maybeOfferKeep();
  }

  function flush() {
    if (!pending || !signedIn()) return;
    const body = pending;
    pending = null;
    if (sentDate === body.date) return;
    sentDate = body.date;
    fetch('/api/portal/snapshots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(r => {
      if (!r.ok) { sentDate = null; return; }
      hist.stale = true;
    }).catch(() => { sentDate = null; });
  }

  /* ═══════════ Guest conversion ═══════════ */
  const GOOGLE_SVG = '<svg class="google-logo" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>';

  /* One prompt per device, after a guest's reading has rendered. Dismissible; never shown again. */
  async function maybeOfferKeep() {
    if (signedIn() || getFlag(KEEP_PROMPT_KEY) || el('portal-keep')) return;
    const known = await whoami();
    if (known !== false || signedIn()) return;
    const results = el('results');
    const body = results && results.querySelector('.scroll-body');
    if (!body || !results.classList.contains('active') || getFlag(KEEP_PROMPT_KEY)) return;

    const card = document.createElement('section');
    card.id = 'portal-keep';
    card.className = 'you-profile-card portal-card portal-keep';
    card.setAttribute('aria-label', 'Keep this chart');
    card.innerHTML = `
      <div class="you-profile-label">${_t('Keep this chart', '保存这张命盘', 'เก็บแผนภูมินี้ไว้')}</div>
      <p class="portal-copy">${_t(
        'Keep your chart and a private day-by-day record of your readings and notes. Nothing to re-enter — this reading comes with you.',
        '保存你的命盘，以及每日解读与笔记的私人记录。无需重新输入——这次的解读会一并保留。',
        'เก็บแผนภูมิของคุณ พร้อมบันทึกดวงรายวันและโน้ตส่วนตัว ไม่ต้องกรอกใหม่ ดวงนี้จะถูกเก็บไว้ให้'
      )}</p>
      <div class="portal-actions">
        <button type="button" class="google-login-btn portal-keep-signin">${GOOGLE_SVG}<span>${_t('Keep it with Google', '用 Google 保存', 'เก็บไว้ด้วย Google')}</span></button>
        <button type="button" class="btn-guest portal-keep-dismiss">${_t('Not now', '以后再说', 'ไว้ก่อน')}</button>
      </div>`;
    body.insertBefore(card, body.firstChild);
    setFlag(KEEP_PROMPT_KEY, 'shown');
    applyI18n();

    card.querySelector('.portal-keep-dismiss').addEventListener('click', () => {
      haptic(6);
      setFlag(KEEP_PROMPT_KEY, 'dismissed');
      card.remove();
    });
    card.querySelector('.portal-keep-signin').addEventListener('click', () => {
      setFlag(KEEP_PROMPT_KEY, 'accepted');
      const h = currentHash();
      setFlag(RETURN_KEY, TABS.indexOf(h) >= 0 ? h : 'today', 'session');
      haptic(10);
      loginWithGoogle();
    });
  }

  /* After sign-in: if the account has no chart yet, attach the one this browser already has. */
  async function attachGuestChart() {
    if (typeof _savedReading !== 'undefined' && _savedReading) return;
    const p = getStoredChart();
    if (!p || !p.year || !p.month || !p.day) return;
    try {
      await fetch('/api/save-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: p.name, year: p.year, month: p.month, day: p.day, hour: p.hour,
          minute: p.minute, birthplace: p.birthplace, bloodType: p.bloodType, gender: p.gender,
          calendarType: p.calendarType, leapMonth: p.leapMonth,
          lunarYear: p.lunarYear, lunarMonth: p.lunarMonth, lunarDay: p.lunarDay,
          twin: !!p.twin, twinOrder: p.twin ? p.twin.order : null, twinMethod: p.twin ? p.twin.method : null,
        }),
      });
    } catch (e) { /* stays local; the next form submit saves it */ }
  }

  /* Header menu: show who is signed in above the member links. */
  function fillMemberMenu() {
    if (!signedIn()) return;
    document.body.classList.add('is-authed');
    document.querySelectorAll('.nav-member').forEach(n => n.classList.remove('hide'));
    document.querySelectorAll('.nav-member-avatar').forEach(img => { if (_currentUser.avatar) img.src = _currentUser.avatar; });
    document.querySelectorAll('.drawer-member').forEach(m => {
      m.querySelector('.drawer-member-name').textContent = _currentUser.name || '';
      m.querySelector('.drawer-member-email').textContent = _currentUser.email || '';
      const img = m.querySelector('.drawer-member-avatar');
      if (img && _currentUser.avatar) {
        img.src = _currentUser.avatar;
        img.classList.remove('hide');
      }
    });
  }

  async function onAuth() {
    fillMemberMenu();
    const card = el('portal-keep');
    if (card) card.remove();
    await attachGuestChart();
    flush();
    const ret = getFlag(RETURN_KEY, 'session');
    if (ret) {
      setFlag(RETURN_KEY, null, 'session');
      if (TABS.indexOf(ret) >= 0 && !currentHash() && typeof hasStoredChart === 'function' && hasStoredChart()) goHash(ret);
    }
  }

  /* ═══════════ API ═══════════ */
  async function api(url, opts) {
    const r = await fetch(url, opts);
    if (r.status === 401) {
      goHash('', { replace: true });
      throw new Error('signed-out');
    }
    if (!r.ok) {
      const e = new Error('http ' + r.status);
      e.status = r.status;
      throw e;
    }
    return r.json();
  }
  function sendJson(url, method, data) {
    return api(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  }

  /* Stored markup came from our own DOM; still drop anything executable before replaying it. */
  function sanitize(html) {
    const tpl = document.createElement('template');
    tpl.innerHTML = html || '';
    tpl.content.querySelectorAll('script, iframe, object, embed, link, meta').forEach(n => n.remove());
    tpl.content.querySelectorAll('*').forEach(n => {
      Array.from(n.attributes).forEach(a => {
        if (/^on/i.test(a.name) || /^\s*javascript:/i.test(a.value)) n.removeAttribute(a.name);
      });
    });
    return tpl.innerHTML;
  }

  function loadError(host) {
    host.innerHTML = `<p class="portal-empty">${_t('Could not load this. Try again in a moment.', '暂时无法载入，请稍后再试。', 'โหลดไม่ได้ ลองใหม่อีกครั้ง')}</p>`;
    applyI18n();
  }

  /* ═══════════ Routing ═══════════ */
  const VIEWS = ['portal-home', 'portal-history', 'portal-reading', 'portal-account'];

  function route(hash) {
    showScreen('portal');
    if (hash.indexOf('history/') === 0) openReading(hash.slice('history/'.length));
    else if (hash === 'history') openHistory();
    else if (hash === 'account') openAccount();
    else openHome();
  }

  function back() {
    // Return to whatever screen opened this one (e.g. the reading, via the menu).
    if (history.state && history.state.inApp) { history.back(); return; }
    const h = currentHash();
    if (h.indexOf('history/') === 0) goHash('history');
    else if (h === 'history' || h === 'account') goHash('portal');
    else goToLanding();
  }

  function setView(id, title) {
    VIEWS.forEach(v => el(v).classList.toggle('hide', v !== id));
    const strips = id === 'portal-history' && hist.months.length > 0;
    el('portal-months').classList.toggle('hide', !strips);
    el('portal-days').classList.toggle('hide', !strips);
    el('portal-title').innerHTML = title;
    const scroll = document.querySelector('#portal .scroll-body');
    if (scroll && id !== 'portal-history') scroll.scrollTop = 0;
    applyI18n();
  }

  /* ── Shared row renderer: the stored Today strip + journal marker ── */
  function journalLine(j) {
    if (!j) return '';
    const r = j.reaction && REACTIONS[j.reaction];
    const note = (j.note || '').trim();
    const snippet = note.length > 90 ? note.slice(0, 90).trim() + '…' : note;
    return `<p class="portal-note-line">${r ? `<span class="portal-reaction-tag is-${j.reaction}">${r.icon} ${r.label()}</span>` : ''}${snippet ? `<span class="portal-note-snippet">“${esc(snippet)}”</span>` : ''}</p>`;
  }
  function rowHtml(item) {
    return `<div class="portal-row-wrap">
      <section class="context-strip portal-row" role="button" tabindex="0" data-date="${item.date}">${sanitize(item.stripHtml)}</section>
      ${journalLine(item.journal)}
    </div>`;
  }
  function cleanRows(host) {
    host.querySelectorAll('.portal-row .cs-expand').forEach(n => n.remove());
  }

  /* ═══════════ Home ═══════════ */
  function chartBadges() {
    const p = getStoredChart() || (typeof _savedReading !== 'undefined' && _savedReading ? {
      name: _savedReading.name, year: _savedReading.year, month: _savedReading.month, day: _savedReading.day,
      hour: _savedReading.hour, minute: _savedReading.minute, calendarType: _savedReading.calendar_type,
      lunarYear: _savedReading.lunar_year, lunarMonth: _savedReading.lunar_month, lunarDay: _savedReading.lunar_day,
    } : null);
    if (!p || !p.year || !p.month || !p.day) return null;
    const solar = fmtDate(`${p.year}-${pad(p.month)}-${pad(p.day)}`);
    const time = p.hour != null && p.hour !== '' ? `${pad(p.hour)}:${pad(p.minute || 0)}` : _t('Time unknown', '时辰未知', 'ไม่ทราบเวลา');
    const cal = p.calendarType === 'lunar'
      ? _t(`Lunar ${p.lunarYear}-${p.lunarMonth}-${p.lunarDay}`, `农历 ${p.lunarYear}-${p.lunarMonth}-${p.lunarDay}`, `จันทรคติ ${p.lunarYear}-${p.lunarMonth}-${p.lunarDay}`)
      : _t('Solar', '公历', 'สุริยคติ');
    return { name: p.name, html: [solar, time, cal].map(t => `<span class="you-profile-badge">${t}</span>`).join('') };
  }

  function luckHtml(luck) {
    if (!luck || !luck.current) return '';
    const c = luck.current;
    const n = luck.next;
    const nextStart = n && n.years ? n.years.split(/[–-]/)[0] : '';
    let line;
    if (c.pre) {
      line = n
        ? _t(`Your first 10-year luck pillar, <strong>${esc(n.chars)}</strong>, begins in ${esc(nextStart)}.`,
          `你的第一步大运 <strong>${esc(n.chars)}</strong> 于 ${esc(nextStart)} 年开始。`,
          `เสาโชค 10 ปีแรกของคุณ <strong>${esc(n.chars)}</strong> เริ่มปี ${esc(nextStart)}`)
        : '';
    } else {
      line = _t(`You are in <strong>${esc(c.chars)}</strong> (${esc(c.years)}).`, `当前大运 <strong>${esc(c.chars)}</strong>（${esc(c.years)}）。`, `ตอนนี้อยู่ในวัยจร <strong>${esc(c.chars)}</strong> (${esc(c.years)})`)
        + (n ? ' ' + _t(`Next: <strong>${esc(n.chars)}</strong> from ${esc(nextStart)}.`, `下一步 <strong>${esc(n.chars)}</strong>，自 ${esc(nextStart)} 年起。`, `ถัดไป <strong>${esc(n.chars)}</strong> เริ่มปี ${esc(nextStart)}`) : '');
    }
    if (!line) return '';
    return `<section class="section">
      <div class="section-head"><h3>${_t('Luck Pillar', '大运', 'เสาโชค')}</h3><span class="section-sub">大运</span></div>
      <div class="decade-current-detail">${line}</div>
    </section>`;
  }

  /* ── My People: the first few saved people, linking into the Relationships tab ── */
  const PEOPLE_PREVIEW = 3;
  const REL_TYPE = {
    romantic: () => _t('Romantic', '恋人', 'คนรัก'),
    friend: () => _t('Friend', '朋友', 'เพื่อน'),
    family: () => _t('Family', '家人', 'ครอบครัว'),
    business: () => _t('Business', '事业', 'ธุรกิจ'),
  };
  function peopleHtml(data) {
    if (!data || !Array.isArray(data.people)) return '';
    const list = data.people;
    const rows = list.slice(0, PEOPLE_PREVIEW).map(p => {
      const a = p.archetype;
      const initial = esc((p.name || '?').trim().charAt(0).toUpperCase());
      return `<button type="button" class="rel-row" onclick="haptic(6); goHash('relationships/p/${Number(p.id)}')">
        <span class="rel-avatar" data-el="${a ? esc(a.element) : ''}" aria-hidden="true">${initial}</span>
        <span class="rel-row-main">
          <span class="rel-row-top"><span class="rel-row-name">${esc(p.name)}</span><span class="rel-chip">${(REL_TYPE[p.type] || REL_TYPE.friend)()}</span>${p.linked ? `<span class="rel-chip rel-chip-linked">${_t('Linked', '已连接', 'เชื่อมแล้ว')}</span>` : ''}</span>
          ${a ? `<span class="rel-row-line">${_t(esc(a.name.en), esc(a.name.zh), esc(a.name.th))}</span>` : ''}
        </span>
        <svg class="rel-chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
      </button>`;
    }).join('');
    return `
      <section class="section">
        <div class="section-head"><h3>${_t('My People', '我的人', 'คนของฉัน')}</h3>${list.length ? `<span class="section-sub">${list.length}</span>` : ''}</div>
        ${list.length
          ? `<div class="rel-list">${rows}</div>`
          : `<p class="portal-copy">${_t('Add a partner, friend, family member or colleague to see where you click and where you clash.', '添加伴侣、朋友、家人或同事，看看你们哪里合拍、哪里容易摩擦。', 'เพิ่มคู่ เพื่อน ครอบครัว หรือเพื่อนร่วมงาน เพื่อดูว่าตรงไหนเข้ากันและตรงไหนขัดกัน')}</p>`}
        <div class="portal-more"><button type="button" class="btn-secondary" onclick="haptic(6); goHash('relationships')${list.length ? '' : "; if (window.WobaziRel) WobaziRel.openAdd()"}">${list.length > PEOPLE_PREVIEW
          ? _t(`All people (${list.length})`, `全部（${list.length}）`, `ทั้งหมด (${list.length})`) + ' →'
          : list.length ? _t('Open Relationships', '打开关系', 'เปิดความสัมพันธ์') + ' →' : _t('Add someone', '添加一个人', 'เพิ่มคน')}</button></div>
      </section>`;
  }

  async function openHome() {
    setView('portal-home', _t('My Wobazi', '我的 Wobazi', 'Wobazi ของฉัน'));
    const host = el('portal-home');
    if (!host.innerHTML.trim()) host.innerHTML = `<p class="portal-empty">✦</p>`;
    try {
      const [sum, recent, people] = await Promise.all([
        api('/api/portal/summary?today=' + localDate()),
        api('/api/portal/history?limit=5'),
        // Relationships is optional here: a failure hides the section, never the home screen.
        fetch('/api/rel/people').then(res => (res.ok ? res.json() : null)).catch(() => null),
      ]);
      if (currentHash() !== 'portal') return;
      const a = sum.account || {};
      const r = sum.readings || {};
      const j = sum.journal || {};
      const items = recent.items || [];
      const today = localDate();
      const todayItem = items.find(i => i.date === today);
      const chart = chartBadges();
      const liveLuck = readLuck();
      const luck = liveLuck || (items[0] && items[0].summary && items[0].summary.luck) || null;
      const member = a.memberSince ? fmtDate(a.memberSince.slice(0, 10), { month: 'long', year: 'numeric' }) : '';

      const avatar = a.avatar ? `<img src="${esc(a.avatar)}" class="nav-authed-avatar" alt="" referrerpolicy="no-referrer">` : '';
      const idCard = `
        <section class="section">
          <div class="you-profile-card portal-card">
            <div class="you-profile-label">${_t('Your chart', '你的命盘', 'แผนภูมิของคุณ')}</div>
            <div class="portal-id-row">
              ${avatar}
              <div>
                <div class="portal-id-name">${esc((chart && chart.name) || a.name || '')}</div>
                <div class="section-sub">${member ? _t(`Member since ${member}`, `${member} 加入`, `สมาชิกตั้งแต่ ${member}`) : ''}</div>
              </div>
            </div>
            ${chart ? `<div class="you-profile-identity">${chart.html}</div>
            <div class="portal-actions"><button type="button" class="btn-secondary" onclick="haptic(6); goToInput()">${_t('Edit birth data', '修改出生资料', 'แก้ข้อมูลเกิด')}</button></div>` : ''}
          </div>
        </section>`;

      const todayCta = chart
        ? `<button type="button" class="btn-primary btn-full" onclick="haptic(10); continueReading()">${_t('Open Today’s Reading', '打开今日解读', 'เปิดดวงวันนี้')}</button>`
        : `<button type="button" class="btn-primary btn-full" onclick="haptic(12); goToInput()">${_t('Plot Your Chart', '排出你的命盘', 'จัดแผนภูมิของคุณ')}</button>`;
      const todaySection = `
        <section class="section">
          <div class="section-head"><h3>${_t('Today', '今日', 'วันนี้')}</h3><span class="section-sub">${fmtDate(today, { weekday: 'short', day: 'numeric', month: 'short' })}</span></div>
          ${todayItem ? rowHtml(todayItem) : ''}
          ${todayItem ? `<p class="portal-copy">${todayItem.journal
            ? _t('Noted. Tap the reading to change your note.', '已记录。点按解读可修改笔记。', 'บันทึกแล้ว แตะที่ดวงเพื่อแก้โน้ต')
            : _t('Tap the reading to note whether it landed.', '点按解读，记下它准不准。', 'แตะที่ดวงเพื่อจดว่าแม่นไหม')}</p>` : ''}
          ${todayCta}
        </section>`;

      const since = r.first ? fmtDate(r.first) : '';
      const record = `
        <section class="section">
          <div class="section-head"><h3>${_t('Your record', '你的记录', 'บันทึกของคุณ')}</h3></div>
          <div class="portal-stats">
            <div class="portal-stat"><span class="portal-stat-num">${r.total || 0}</span><span class="portal-stat-lbl">${_t('days read', '天已读', 'วันที่อ่าน')}</span></div>
            <div class="portal-stat"><span class="portal-stat-num">${r.last30 || 0}</span><span class="portal-stat-lbl">${_t('of the last 30 days', '近 30 天', 'ใน 30 วันล่าสุด')}</span></div>
            <div class="portal-stat"><span class="portal-stat-num">${j.noted || 0}</span><span class="portal-stat-lbl">${_t('days noted', '天有笔记', 'วันที่จดโน้ต')}</span></div>
          </div>
          <p class="portal-copy">${r.total
            ? _t(`Every day you read is kept, starting ${since}. Gaps are fine — nothing resets.`, `自 ${since} 起，你读过的每一天都会保留。中断也没关系，记录不会清零。`, `ทุกวันที่คุณอ่านถูกเก็บไว้ ตั้งแต่ ${since} ขาดบางวันก็ไม่เป็นไร ไม่มีการรีเซ็ต`)
            : _t('Open Today while signed in and each day is kept here.', '登录后打开「今日」，每一天都会保存在这里。', 'เปิดวันนี้ขณะเข้าสู่ระบบ แล้วแต่ละวันจะถูกเก็บไว้ที่นี่')}</p>
        </section>`;

      const recentRows = items.filter(i => i.date !== today);
      const recentSection = `
        <section class="section">
          <div class="section-head"><h3>${_t('Recent readings', '最近解读', 'ดวงล่าสุด')}</h3></div>
          ${recentRows.length ? recentRows.map(rowHtml).join('') : `<p class="portal-copy">${_t('Past days will appear here.', '过去的解读会出现在这里。', 'วันที่ผ่านมาจะแสดงที่นี่')}</p>`}
          ${r.total ? `<div class="portal-more"><button type="button" class="btn-secondary" onclick="haptic(6); goHash('history')">${_t('All history', '全部记录', 'ประวัติทั้งหมด')} →</button></div>` : ''}
        </section>`;

      const links = `
        <section class="section">
          <button type="button" class="drawer-link portal-link" onclick="haptic(6); goHash('account')">${_t('Account &amp; your data', '账户与数据', 'บัญชีและข้อมูลของคุณ')} →</button>
        </section>`;

      host.innerHTML = idCard + todaySection + peopleHtml(people) + record + luckHtml(luck) + recentSection + links;
      cleanRows(host);
      applyI18n();
    } catch (e) {
      if (e.message !== 'signed-out') loadError(host);
    }
  }

  /* ═══════════ History list ═══════════ */
  async function openHistory() {
    setView('portal-history', _t('Reading History', '解读记录', 'ประวัติการดูดวง'));
    if (hist.loaded && !hist.stale) return;
    hist.loaded = true;
    hist.stale = false;
    el('portal-list').innerHTML = '';
    el('portal-more').classList.add('hide');
    try {
      const m = await api('/api/portal/history/months');
      hist.months = m.months || [];
      renderMonths();
      setView('portal-history', _t('Reading History', '解读记录', 'ประวัติการดูดวง'));
      if (!hist.months.length) {
        el('portal-list').innerHTML = `<p class="portal-empty">${_t(
          'Your readings collect here. Open Today while signed in and each day is kept, exactly as it appeared.',
          '你的每日解读会保存在这里。登录后打开「今日」，每一天都会按原样保留。',
          'ดวงรายวันของคุณจะถูกเก็บไว้ที่นี่ เปิดแท็บวันนี้ขณะเข้าสู่ระบบ แล้วแต่ละวันจะถูกบันทึกไว้ตามที่เห็น'
        )}</p>`;
        applyI18n();
        return;
      }
      await selectMonth(hist.months[0].month, { jump: false });
      await loadPage(null, true);
    } catch (e) {
      if (e.message !== 'signed-out') {
        hist.loaded = false;
        loadError(el('portal-list'));
      }
    }
  }

  function monthLabel(month) {
    return parseYmd(month + '-01').toLocaleDateString(dateLocale(), { month: 'long', year: 'numeric' });
  }

  function renderMonths() {
    el('portal-months-inner').innerHTML = hist.months.map(m =>
      `<button type="button" class="results-toc-chip${m.month === hist.month ? ' is-on' : ''}" data-month="${m.month}">${monthLabel(m.month)} · ${m.count}</button>`
    ).join('');
  }

  async function selectMonth(month, opts) {
    hist.month = month;
    renderMonths();
    const [y, m] = month.split('-').map(Number);
    const daysIn = new Date(y, m, 0).getDate();
    let read = [], noted = [];
    try {
      const d = await api('/api/portal/history/dates?month=' + month);
      read = d.dates || [];
      noted = d.noted || [];
    } catch (e) { /* strip stays empty */ }
    const readSet = new Set(read);
    const notedSet = new Set(noted);
    let html = '';
    for (let d = 1; d <= daysIn; d++) {
      const date = `${month}-${pad(d)}`;
      html += readSet.has(date)
        ? `<button type="button" class="results-toc-chip portal-day is-read${notedSet.has(date) ? ' is-noted' : ''}" data-date="${date}">${d}</button>`
        : `<button type="button" class="results-toc-chip portal-day" disabled>${d}</button>`;
    }
    el('portal-days-inner').innerHTML = html;

    if (opts && opts.jump) {
      const nextMonth = m === 12 ? `${y + 1}-01` : `${y}-${pad(m + 1)}`;
      el('portal-list').innerHTML = '';
      hist.lastMonthHead = null;
      await loadPage(nextMonth + '-01', true);
    }
  }

  async function loadPage(before, reset) {
    if (hist.loading) return;
    hist.loading = true;
    if (reset) hist.lastMonthHead = null;
    try {
      const q = '/api/portal/history?limit=' + PAGE + (before ? '&before=' + before : '');
      const data = await api(q);
      const list = el('portal-list');
      let html = '';
      (data.items || []).forEach(item => {
        const month = item.date.slice(0, 7);
        if (month !== hist.lastMonthHead) {
          hist.lastMonthHead = month;
          const count = (hist.months.find(x => x.month === month) || {}).count || '';
          html += `<div class="section-head portal-month-head"><h3>${monthLabel(month)}</h3><span class="section-sub">${count ? _t(count + ' readings', count + ' 篇解读', count + ' ครั้ง') : ''}</span></div>`;
        }
        html += rowHtml(item);
      });
      list.insertAdjacentHTML('beforeend', html);
      cleanRows(list);
      hist.next = data.next;
      el('portal-more').classList.toggle('hide', !data.next);
      applyI18n();
    } finally {
      hist.loading = false;
    }
  }

  /* ═══════════ One stored reading + journal ═══════════ */
  async function openReading(date) {
    setView('portal-reading', _t('Reading History', '解读记录', 'ประวัติการดูดวง'));
    const host = el('portal-reading');
    host.innerHTML = '';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { goHash('history', { replace: true }); return; }
    const long = fmtDate(date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    try {
      const r = await api('/api/portal/history/' + date);
      host.innerHTML = `
        <div class="section-head portal-month-head"><h3>${long}</h3><span class="section-sub">${_t('As it appeared that day', '当日原样保存', 'บันทึกไว้ตามที่เห็นในวันนั้น')}</span></div>
        <section class="context-strip portal-strip">${sanitize(r.stripHtml)}</section>
        <section class="hero-compact">${sanitize(r.heroHtml)}</section>
        ${journalHtml(date)}`;
      bindJournal(host, date, r.journal);
    } catch (e) {
      if (e.message === 'signed-out') return;
      host.innerHTML = `
        <div class="section-head portal-month-head"><h3>${long}</h3></div>
        <p class="portal-empty">${e.status === 404
          ? _t('No reading was saved for this day.', '这一天没有保存的解读。', 'ไม่มีดวงที่บันทึกไว้ในวันนี้')
          : _t('Could not load this reading. Try again in a moment.', '暂时无法载入，请稍后再试。', 'โหลดไม่ได้ ลองใหม่อีกครั้ง')}</p>`;
    }
    applyI18n();
  }

  function journalHtml(date) {
    const isToday = date === localDate();
    return `
      <section class="section portal-journal">
        <div class="section-head"><h3>${_t('Your journal', '你的笔记', 'บันทึกของคุณ')}</h3><span class="section-sub">${_t('Only you can see this', '仅你可见', 'เห็นได้เฉพาะคุณ')}</span></div>
        <p class="portal-copy">${isToday
          ? _t('Did today’s reading land?', '今天的解读准吗？', 'ดวงวันนี้แม่นไหม?')
          : _t('Looking back, did it land?', '回头看，它准吗？', 'มองย้อนกลับไป แม่นไหม?')}</p>
        <div class="portal-reactions" role="group" aria-label="Reaction">
          ${Object.keys(REACTIONS).map(k => `<button type="button" class="btn-secondary portal-reaction-btn" data-reaction="${k}" aria-pressed="false">${REACTIONS[k].icon} ${REACTIONS[k].label()}</button>`).join('')}
        </div>
        <label class="portal-copy portal-note-label" for="portal-note">${_t('What actually happened?', '实际发生了什么？', 'จริงๆ แล้วเกิดอะไรขึ้น?')}</label>
        <textarea id="portal-note" class="oracle-input portal-note-input" rows="4" maxlength="2000"></textarea>
        <p class="portal-save-state" id="portal-save-state" aria-live="polite"></p>
        ${privacyLine()}
      </section>`;
  }

  function bindJournal(host, date, journal) {
    const state = { note: (journal && journal.note) || '', reaction: (journal && journal.reaction) || null };
    const ta = host.querySelector('#portal-note');
    const status = host.querySelector('#portal-save-state');
    const buttons = Array.from(host.querySelectorAll('.portal-reaction-btn'));
    let timer = null;
    let saved = JSON.stringify(state);
    ta.value = state.note;
    ta.placeholder = plain('A line or two is plenty.', '一两句就够了。', 'แค่หนึ่งสองบรรทัดก็พอ');

    function paint() {
      buttons.forEach(b => {
        const on = b.dataset.reaction === state.reaction;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }
    function say(en, zh, th) {
      status.innerHTML = en ? _t(en, zh, th) : '';
      applyI18n();
    }
    async function save() {
      clearTimeout(timer);
      const snapshot = JSON.stringify(state);
      if (snapshot === saved) return;
      say('Saving…', '保存中…', 'กำลังบันทึก…');
      try {
        await sendJson('/api/portal/journal/' + date, 'PUT', state);
        saved = snapshot;
        hist.stale = true;
        say('Saved', '已保存', 'บันทึกแล้ว');
      } catch (e) {
        if (e.message !== 'signed-out') say('Couldn’t save — check your connection and try again.', '保存失败，请检查网络后重试。', 'บันทึกไม่ได้ ตรวจสอบการเชื่อมต่อแล้วลองใหม่');
      }
    }

    buttons.forEach(b => b.addEventListener('click', () => {
      haptic(8);
      state.reaction = state.reaction === b.dataset.reaction ? null : b.dataset.reaction;
      paint();
      save();
    }));
    ta.addEventListener('input', () => {
      state.note = ta.value;
      clearTimeout(timer);
      timer = setTimeout(save, 900);
    });
    ta.addEventListener('blur', save);
    paint();
  }

  /* ═══════════ Account ═══════════ */
  async function openAccount() {
    setView('portal-account', _t('Account', '账户', 'บัญชี'));
    const host = el('portal-account');
    try {
      const sum = await api('/api/portal/summary?today=' + localDate());
      if (currentHash() !== 'account') return;
      const a = sum.account || {};
      host.innerHTML = `
        <section class="section">
          <div class="section-head"><h3>${_t('Sign-in', '登录方式', 'การเข้าสู่ระบบ')}</h3></div>
          <div class="you-profile-card portal-card">
            <div class="portal-id-row">
              ${GOOGLE_SVG}
              <div>
                <div class="portal-id-name">Google</div>
                <div class="section-sub">${esc(a.email || a.name || '')}</div>
              </div>
            </div>
            <div class="portal-actions"><button type="button" class="btn-secondary" onclick="haptic(6); logout()">${_t('Sign out', '退出登录', 'ออกจากระบบ')}</button></div>
          </div>
        </section>

        <section class="section">
          <div class="section-head"><h3>${_t('Your data', '你的数据', 'ข้อมูลของคุณ')}</h3></div>
          <p class="portal-copy">${_t(
            'Download every saved reading, your notes and your birth data. It’s yours — keep a copy, or take it with you.',
            '下载所有保存的解读、笔记和出生资料。数据属于你——留个备份，或随时带走。',
            'ดาวน์โหลดดวงที่บันทึกไว้ทั้งหมด โน้ต และข้อมูลวันเกิด ข้อมูลเป็นของคุณ เก็บสำรองหรือนำไปได้เสมอ'
          )}</p>
          <div class="portal-actions">
            <a class="btn-secondary" href="/api/portal/export?format=md" download>${_t('Download Markdown', '下载 Markdown', 'ดาวน์โหลด Markdown')}</a>
            <a class="btn-secondary" href="/api/portal/export?format=json" download>${_t('Download JSON', '下载 JSON', 'ดาวน์โหลด JSON')}</a>
          </div>
          ${privacyLine()}
        </section>

        <section class="section">
          <div class="section-head"><h3>${_t('Delete account', '删除账户', 'ลบบัญชี')}</h3></div>
          <p class="portal-copy">${_t(
            `This permanently deletes your account, your birth data, ${plural(sum.readings.total, 'saved reading')}, ${plural(sum.journal.noted, 'journal note')} and your Oracle chat. It can’t be undone. Download your data first if you want a copy.`,
            `这将永久删除你的账户、出生资料、全部 ${sum.readings.total} 条保存的解读、${sum.journal.noted} 条笔记以及神谕对话，且无法恢复。如需保留，请先下载数据。`,
            `การลบจะลบบัญชี ข้อมูลวันเกิด ดวงที่บันทึกไว้ ${sum.readings.total} วัน โน้ต ${sum.journal.noted} รายการ และแชทเทพพยากรณ์อย่างถาวร ย้อนกลับไม่ได้ ดาวน์โหลดข้อมูลก่อนหากต้องการเก็บไว้`
          )}</p>
          <label class="portal-copy portal-note-label" for="portal-delete-input">${_t('Type DELETE to confirm', '输入 DELETE 以确认', 'พิมพ์ DELETE เพื่อยืนยัน')}</label>
          <input id="portal-delete-input" class="oracle-input portal-input" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false">
          <div class="portal-actions">
            <button type="button" id="portal-delete-btn" class="btn-secondary portal-danger" disabled>${_t('Delete my account', '删除我的账户', 'ลบบัญชีของฉัน')}</button>
          </div>
          <p class="portal-save-state" id="portal-delete-state" aria-live="polite"></p>
        </section>`;
      applyI18n();

      const input = host.querySelector('#portal-delete-input');
      const btn = host.querySelector('#portal-delete-btn');
      const status = host.querySelector('#portal-delete-state');
      input.addEventListener('input', () => { btn.disabled = input.value.trim() !== 'DELETE'; });
      btn.addEventListener('click', async () => {
        if (input.value.trim() !== 'DELETE') return;
        btn.disabled = true;
        status.innerHTML = _t('Deleting…', '删除中…', 'กำลังลบ…');
        applyI18n();
        try {
          const r = await fetch('/api/portal/delete-account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ confirm: 'DELETE' }),
          });
          if (!r.ok) throw new Error('http ' + r.status);
          ['wobazi_chart_v1', 'wobazi_oracle_date', 'wobazi_oracle_count', KEEP_PROMPT_KEY].forEach(k => setFlag(k, null));
          window.location.href = '/';
        } catch (e) {
          btn.disabled = false;
          status.innerHTML = _t('Could not delete your account. Nothing was removed — try again.', '删除失败，未移除任何数据，请重试。', 'ลบบัญชีไม่สำเร็จ ยังไม่มีข้อมูลถูกลบ ลองใหม่อีกครั้ง');
          applyI18n();
        }
      });
    } catch (e) {
      if (e.message !== 'signed-out') loadError(host);
    }
  }

  /* ═══════════ Events (delegated; markup lives in index.html #portal) ═══════════ */
  document.addEventListener('click', e => {
    if (!e.target.closest || !e.target.closest('#portal')) return;
    const row = e.target.closest('.portal-row, .portal-day.is-read');
    if (row && row.dataset.date) { haptic(6); goHash('history/' + row.dataset.date); return; }
    const chip = e.target.closest('[data-month]');
    if (chip) { haptic(6); selectMonth(chip.dataset.month, { jump: true }); return; }
    const strip = e.target.closest('.portal-strip');
    if (strip) { const x = strip.querySelector('.cs-expand'); if (x) x.classList.toggle('hide'); return; }
    if (e.target.closest('#portal-more') && hist.next) { haptic(6); loadPage(hist.next, false); }
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const row = e.target.closest && e.target.closest('#portal .portal-row');
    if (row) { e.preventDefault(); goHash('history/' + row.dataset.date); }
  });

  window.WobaziPortal = {
    captureToday,
    onAuth,
    route,
    back,
    isRoute: h => h === 'portal' || h === 'account' || h === 'history' || h.indexOf('history/') === 0,
  };
})();
