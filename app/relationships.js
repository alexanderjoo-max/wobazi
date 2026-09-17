/* ═══════════════════════════════════════
   WOBAZI — Relationships: people, pair readings, invites, sharing (client)
   app/relationships.js

   Lives inside the existing Relationships tab (#res-rel-people). Loaded after script.js;
   uses its globals at call time (goHash, currentHash, applyRoute, haptic, track,
   loadUserData, loginWithGoogle, WobaziPortal).

   Routes:
     #relationships            list (the tab itself)
     #relationships/p/:id      one person, single scrolling page
═══════════════════════════════════════ */
(function () {
  'use strict';

  const F = window.WobaziRelForm;
  const section = document.getElementById('res-rel-people');
  if (!F || !section) return;

  const ROUTE = /^relationships\/p\/(\d+)$/;
  const TYPES = ['romantic', 'friend', 'family', 'business'];
  const TYPE_LABEL = {
    romantic: ['Romantic', '恋人', 'คนรัก'],
    friend: ['Friend', '朋友', 'เพื่อน'],
    family: ['Family', '家人', 'ครอบครัว'],
    business: ['Business', '事业', 'ธุรกิจ'],
  };
  const EL_ZH = { Wood: '木', Fire: '火', Earth: '土', Metal: '金', Water: '水' };
  const PENDING_KEY = 'wobazi_rel_invite_pending';
  const RETURN_KEY = 'wobazi_return_hash';
  const POLL_MS = 2500;
  const POLL_MAX = 40;
  const SEARCH_AT = 5;

  const T = F.tri;
  const esc = F.esc;
  const tl = type => T(...(TYPE_LABEL[type] || TYPE_LABEL.friend));

  const st = {
    loaded: false,
    loading: false,
    people: [],
    meta: null,          // { paywall, maxPeople, hasChart }
    guest: false,
    query: '',
    detailId: null,
    detail: null,        // { person, share }
    reading: null,
    polls: 0,
    pollTimer: null,
  };

  /* ═══════════ helpers ═══════════ */
  function hapt(n) { try { if (typeof haptic === 'function') haptic(n); } catch (e) { /* ignore */ } }
  function tr(name, params) { try { if (typeof track === 'function') track(name, params); } catch (e) { /* ignore */ } }
  function results() { return document.getElementById('results'); }

  async function api(url, opts) {
    const o = Object.assign({ headers: {} }, opts || {});
    if (o.json !== undefined) {
      o.headers['Content-Type'] = 'application/json';
      o.body = JSON.stringify(o.json);
      delete o.json;
    }
    const r = await fetch(url, o);
    let data = {};
    try { data = await r.json(); } catch (e) { data = {}; }
    if (!r.ok) {
      const err = new Error(data.error || 'Something went wrong. Try again.');
      err.status = r.status;
      err.code = data.code;
      throw err;
    }
    return data;
  }

  function errHtml(err) {
    return `<p class="field-error" role="alert">${esc(err && err.message ? err.message : err)}</p>`;
  }

  /* LLM text refers to the other person as {name}. */
  function named(text, name) {
    return esc(text || '').split('{name}').join(`<span class="rel-name">${esc(first(name))}</span>`);
  }
  function first(name) {
    return String(name || '').trim().split(/\s+/)[0] || name;
  }

  function toast(html) {
    let el = document.getElementById('rel-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'rel-toast';
      el.className = 'rel-toast';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.innerHTML = html;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 2600);
  }

  function scrollTop() {
    const sb = results() && results().querySelector('.scroll-body');
    if (sb) sb.scrollTop = 0;
  }

  /* ═══════════ bottom sheet (same component as the ⓘ sheet) ═══════════ */
  function openSheet(html, onMount) {
    closeSheet();
    const wrap = document.createElement('div');
    wrap.className = 'tip-overlay rel-overlay';
    wrap.id = 'rel-sheet';
    wrap.innerHTML = `<div class="tip-backdrop" data-close></div>
      <div class="tip-sheet rel-sheet" role="dialog" aria-modal="true">
        <div class="tip-handle"></div>
        <button type="button" class="rel-sheet-close" data-close aria-label="Close">×</button>
        <div class="rel-sheet-body">${html}</div>
      </div>`;
    document.body.appendChild(wrap);
    wrap.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeSheet(); });
    requestAnimationFrame(() => wrap.classList.add('active'));
    if (onMount) onMount(wrap.querySelector('.rel-sheet-body'));
    return wrap;
  }
  function closeSheet() {
    const old = document.getElementById('rel-sheet');
    if (!old) return;
    old.classList.remove('active');
    setTimeout(() => old.remove(), 300);
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });

  /* ═══════════ list ═══════════ */
  function head(title, sub) {
    return `<div class="section-head"><h3>${title}</h3>${sub ? `<span class="section-sub">${sub}</span>` : ''}</div>`;
  }

  function skeletonList() {
    return head(T('People', '身边的人', 'ผู้คน')) +
      `<div class="rel-list" aria-busy="true">${[0, 1, 2].map(() => `
        <div class="rel-row rel-skel"><div class="rel-row-main"><span class="skel skel-w40"></span><span class="skel skel-w70"></span></div></div>`).join('')}</div>`;
  }

  async function loadList(force) {
    if (st.loading || (st.loaded && !force)) return;
    st.loading = true;
    if (!st.detailId) section.innerHTML = skeletonList();
    try {
      const d = await api('/api/rel/people');
      st.people = d.people || [];
      st.meta = { paywall: d.paywall, maxPeople: d.maxPeople, hasChart: d.hasChart };
      st.guest = false;
      st.error = null;
    } catch (err) {
      st.people = [];
      st.guest = err.status === 401;
      st.meta = null;
      st.error = st.guest ? null : err;
    }
    st.loaded = true;
    st.loading = false;
    if (!st.detailId) renderList();
  }

  function renderList() {
    const sub = T('Compatibility with the people in your life', '你与身边人的相处方式', 'ความเข้ากันกับคนในชีวิตคุณ');
    if (st.guest) {
      section.innerHTML = head(T('People', '身边的人', 'ผู้คน'), sub) + `
        <div class="rel-card rel-empty">
          <p class="rel-card-title">${T('Save the people in your life', '保存你身边的人', 'บันทึกคนในชีวิตคุณ')}</p>
          <p class="rel-muted">${T('Sign in to add partners, friends, family and colleagues and see how you work together.', '登录后可添加伴侣、朋友、家人和同事，看看你们如何相处。', 'เข้าสู่ระบบเพื่อเพิ่มคู่ เพื่อน ครอบครัว และเพื่อนร่วมงาน แล้วดูว่าคุณเข้ากันอย่างไร')}</p>
          <button type="button" class="btn-primary btn-full" data-act="signin">${T('Sign in with Google', '使用 Google 登录', 'เข้าสู่ระบบด้วย Google')}</button>
        </div>`;
      return;
    }
    if (st.error) {
      section.innerHTML = head(T('People', '身边的人', 'ผู้คน'), sub) + `<div class="rel-card">${errHtml(st.error)}
        <button type="button" class="btn-secondary" data-act="reload">${T('Try again', '重试', 'ลองอีกครั้ง')}</button></div>`;
      return;
    }
    if (st.meta && !st.meta.hasChart) {
      section.innerHTML = head(T('People', '身边的人', 'ผู้คน'), sub) + `
        <div class="rel-card rel-empty">
          <p class="rel-card-title">${T('Save your chart to your account first', '请先把命盘保存到账号', 'บันทึกแผนภูมิของคุณลงบัญชีก่อน')}</p>
          <p class="rel-muted">${T('Pair readings compare your saved chart with theirs.', '合盘解读会用你保存的命盘与对方比较。', 'ผลความเข้ากันจะเทียบแผนภูมิที่บันทึกไว้ของคุณกับของเขา')}</p>
          <button type="button" class="btn-primary btn-full" data-act="save-chart">${T('Save my chart', '保存我的命盘', 'บันทึกแผนภูมิของฉัน')}</button>
        </div>`;
      return;
    }
    if (!st.people.length) {
      section.innerHTML = head(T('People', '身边的人', 'ผู้คน'), sub) + `
        <div class="rel-card rel-empty">
          <p class="rel-card-title">${T('No one here yet', '还没有添加任何人', 'ยังไม่มีใครในนี้')}</p>
          <p class="rel-muted">${T('Add a partner, friend, family member or colleague to see where you click and where you clash.', '添加伴侣、朋友、家人或同事，看看你们哪里合拍、哪里容易摩擦。', 'เพิ่มคู่ เพื่อน ครอบครัว หรือเพื่อนร่วมงาน เพื่อดูว่าตรงไหนเข้ากันและตรงไหนขัดกัน')}</p>
          <button type="button" class="btn-primary btn-full" data-act="add">${T('Add someone', '添加一个人', 'เพิ่มคน')}</button>
        </div>`;
      return;
    }
    const q = st.query.trim().toLowerCase();
    const rows = st.people.filter(p => !q || p.name.toLowerCase().includes(q) || p.type.includes(q));
    section.innerHTML = head(T('People', '身边的人', 'ผู้คน'), sub) + `
      ${st.people.length >= SEARCH_AT ? `<div class="field rel-search"><input type="search" id="rel-search" value="${esc(st.query)}" placeholder="Search people" aria-label="Search people" autocomplete="off"></div>` : ''}
      <div class="rel-list" id="rel-list">${rows.map(rowHtml).join('') || `<p class="rel-muted rel-pad">${T('No matches.', '没有匹配的人。', 'ไม่พบผลลัพธ์')}</p>`}</div>
      <button type="button" class="btn-primary btn-full" data-act="add">${T('Add someone', '添加一个人', 'เพิ่มคน')}</button>`;
    const search = document.getElementById('rel-search');
    if (search) {
      search.addEventListener('input', () => {
        st.query = search.value;
        const list = document.getElementById('rel-list');
        const qq = st.query.trim().toLowerCase();
        list.innerHTML = st.people.filter(p => !qq || p.name.toLowerCase().includes(qq) || p.type.includes(qq)).map(rowHtml).join('')
          || `<p class="rel-muted rel-pad">${T('No matches.', '没有匹配的人。', 'ไม่พบผลลัพธ์')}</p>`;
      });
    }
  }

  function rowHtml(p) {
    const a = p.archetype;
    const line = a ? T(esc(a.name.en) + ' · ' + esc(a.line.en), esc(a.name.zh) + ' · ' + esc(a.line.zh), esc(a.name.th) + ' · ' + esc(a.line.th)) : '';
    return `<button type="button" class="rel-row" data-open="${p.id}">
      <span class="rel-avatar" data-el="${a ? esc(a.element) : ''}" aria-hidden="true">${esc((p.name || '?').trim().charAt(0).toUpperCase())}</span>
      <span class="rel-row-main">
        <span class="rel-row-top"><span class="rel-row-name">${esc(p.name)}</span><span class="rel-chip">${tl(p.type)}</span>${p.linked ? `<span class="rel-chip rel-chip-linked">${T('Linked', '已连接', 'เชื่อมแล้ว')}</span>` : ''}${p.locked ? `<span class="rel-chip">🔒</span>` : ''}</span>
        <span class="rel-row-line">${line}</span>
      </span>
      <svg class="rel-chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
    </button>`;
  }

  /* ═══════════ add: choose path ═══════════ */
  function typeSeg(name, selected) {
    return `<div class="cal-seg rel-type-seg" role="radiogroup" aria-label="Relationship type" data-seg="${name}">
      ${TYPES.map(t => `<button type="button" class="cal-seg-btn${t === selected ? ' active' : ''}" role="radio" aria-checked="${t === selected}" data-type="${t}">${tl(t)}</button>`).join('')}
    </div>`;
  }
  function bindTypeSeg(root) {
    root.querySelectorAll('.rel-type-seg').forEach(seg => {
      seg.addEventListener('click', e => {
        const b = e.target.closest('.cal-seg-btn');
        if (!b) return;
        seg.querySelectorAll('.cal-seg-btn').forEach(x => {
          x.classList.toggle('active', x === b);
          x.setAttribute('aria-checked', x === b ? 'true' : 'false');
        });
      });
    });
  }
  function segValue(root) {
    const b = root.querySelector('.rel-type-seg .cal-seg-btn.active');
    return b ? b.dataset.type : null;
  }

  function openAdd() {
    hapt(8);
    if (st.meta && st.meta.maxPeople && st.people.length >= st.meta.maxPeople) {
      openSheet(`<p class="rel-sheet-title">${T('Upgrade to add more people', '升级以添加更多人', 'อัปเกรดเพื่อเพิ่มคนได้มากขึ้น')}</p>
        <p class="rel-muted">${T('The free plan includes one saved person.', '免费版可保存一个人。', 'แพ็กเกจฟรีบันทึกได้หนึ่งคน')}</p>`);
      return;
    }
    openSheet(`
      <p class="rel-sheet-title">${T('Add someone', '添加一个人', 'เพิ่มคน')}</p>
      <div class="rel-choice">
        <button type="button" class="rel-choice-btn" data-path="manual">
          <span class="rel-choice-title">${T('Enter their details', '填写对方资料', 'กรอกข้อมูลของเขา')}</span>
          <span class="rel-muted">${T('You know their birth date. Their details stay private to you.', '你知道对方的生日，资料只有你能看到。', 'คุณรู้วันเกิดของเขา ข้อมูลนี้เห็นแค่คุณ')}</span>
        </button>
        <button type="button" class="rel-choice-btn" data-path="invite">
          <span class="rel-choice-title">${T('Send an invite link', '发送邀请链接', 'ส่งลิงก์คำเชิญ')}</span>
          <span class="rel-muted">${T('They add their own details and you both see the reading.', '对方自己填写资料，你们都能看到解读。', 'เขากรอกข้อมูลเอง และคุณทั้งคู่ได้เห็นผล')}</span>
        </button>
      </div>`, body => {
      body.addEventListener('click', e => {
        const b = e.target.closest('[data-path]');
        if (!b) return;
        if (b.dataset.path === 'manual') openManual();
        else openInvite();
      });
    });
  }

  /* ═══════════ add / edit manually ═══════════ */
  function openManual(person) {
    const editing = !!person;
    const linked = editing && person.linked;
    openSheet(`
      <p class="rel-sheet-title">${editing ? T('Edit details', '编辑资料', 'แก้ไขข้อมูล') : T('Enter their details', '填写对方资料', 'กรอกข้อมูลของเขา')}</p>
      <form class="bazi-mini-form" id="rel-manual" novalidate>
        <div class="field">
          <label>${T('Relationship', '关系', 'ความสัมพันธ์')}</label>
          ${typeSeg('type', editing ? person.type : null)}
        </div>
        ${linked ? `<div class="field"><label for="relm-name">${T('Name', '名字', 'ชื่อ')}</label><input type="text" id="relm-name" maxlength="60" autocomplete="off"></div>
          <p class="rel-muted">${T('Birth details for a linked account are managed by that person.', '已连接账号的出生资料由对方自己管理。', 'ข้อมูลเกิดของบัญชีที่เชื่อมแล้ว เจ้าของบัญชีเป็นผู้จัดการ')}</p>`
        : F.markup('relm', { withName: true })}
        <div id="relm-error"></div>
        <button type="submit" class="btn-primary btn-full">${editing ? T('Save changes', '保存修改', 'บันทึกการเปลี่ยนแปลง') : T('Save and see reading', '保存并查看解读', 'บันทึกและดูผล')}</button>
      </form>`, body => {
      const form = body.querySelector('#rel-manual');
      bindTypeSeg(form);
      if (!linked) {
        F.bind(form, 'relm');
        if (editing) F.fill(form, 'relm', person.birth, person.name);
      } else {
        form.querySelector('#relm-name').value = person.name;
      }
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const errEl = form.querySelector('#relm-error');
        errEl.innerHTML = '';
        const type = segValue(form);
        const name = form.querySelector('#relm-name').value.trim();
        if (!name) { errEl.innerHTML = errHtml({ message: 'Please enter a name.' }); return; }
        if (!type) { errEl.innerHTML = errHtml({ message: 'Choose a relationship type.' }); return; }
        let birth = null;
        if (!linked) {
          const r = F.read(form, 'relm');
          if (r.error) { errEl.innerHTML = `<p class="field-error" role="alert">${T(r.error.en, r.error.zh, r.error.th)}</p>`; return; }
          birth = r.body;
        }
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        try {
          if (editing) {
            await api(`/api/rel/people/${person.id}`, { method: 'PATCH', json: Object.assign({ name, type }, birth ? { birth } : {}) });
            closeSheet();
            st.loaded = false;
            openDetail(person.id, { refresh: true });
          } else {
            const d = await api('/api/rel/people', { method: 'POST', json: Object.assign({ name, type }, birth) });
            tr('relationship_add', { method: 'manual', type });
            closeSheet();
            st.loaded = false;
            goHash('relationships/p/' + d.person.id);
          }
        } catch (err) {
          errEl.innerHTML = errHtml(err);
          btn.disabled = false;
        }
      });
    });
  }

  /* ═══════════ invite ═══════════ */
  function openInvite() {
    openSheet(`
      <p class="rel-sheet-title">${T('Send an invite link', '发送邀请链接', 'ส่งลิงก์คำเชิญ')}</p>
      <form class="bazi-mini-form" id="rel-inv" novalidate>
        <div class="field">
          <label>${T('Relationship', '关系', 'ความสัมพันธ์')}</label>
          ${typeSeg('type', null)}
        </div>
        <div class="field">
          <label for="reli-label">${T('Their name <span class="label-opt">only you see this</span>', '对方名字 <span class="label-opt">仅你可见</span>', 'ชื่อของเขา <span class="label-opt">เห็นแค่คุณ</span>')}</label>
          <input type="text" id="reli-label" maxlength="60" autocomplete="off">
        </div>
        <div id="reli-error"></div>
        <button type="submit" class="btn-primary btn-full">${T('Create invite link', '生成邀请链接', 'สร้างลิงก์คำเชิญ')}</button>
      </form>`, body => {
      const form = body.querySelector('#rel-inv');
      bindTypeSeg(form);
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const errEl = form.querySelector('#reli-error');
        const type = segValue(form);
        if (!type) { errEl.innerHTML = errHtml({ message: 'Choose a relationship type.' }); return; }
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        try {
          const d = await api('/api/rel/invites', { method: 'POST', json: { type, label: form.querySelector('#reli-label').value.trim() } });
          tr('relationship_invite_create', { type });
          showInviteLink(body, d);
        } catch (err) {
          errEl.innerHTML = errHtml(err);
          btn.disabled = false;
        }
      });
    });
  }

  function linkButtons(url, text, withX) {
    const enc = encodeURIComponent;
    return `<div class="rel-share-row">
      ${navigator.share ? `<button type="button" class="btn-secondary" data-share-native>${T('Share…', '分享…', 'แชร์…')}</button>` : ''}
      <a class="btn-secondary" href="https://wa.me/?text=${enc(text + ' ' + url)}" target="_blank" rel="noopener">WhatsApp</a>
      <a class="btn-secondary" href="https://social-plugins.line.me/lineit/share?url=${enc(url)}" target="_blank" rel="noopener">LINE</a>
      <button type="button" class="btn-secondary" data-copy>${T('Copy link', '复制链接', 'คัดลอกลิงก์')}</button>
      ${withX ? `<a class="btn-secondary" href="https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}" target="_blank" rel="noopener">X</a>` : ''}
    </div>`;
  }
  function bindLinkButtons(root, url, text) {
    const native = root.querySelector('[data-share-native]');
    if (native) native.addEventListener('click', () => { navigator.share({ title: 'Wobazi', text, url }).catch(() => {}); });
    const copy = root.querySelector('[data-copy]');
    if (copy) {
      copy.addEventListener('click', () => {
        (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(() => {
          copy.innerHTML = T('Copied', '已复制', 'คัดลอกแล้ว');
          hapt(6);
        }).catch(() => window.prompt('Copy this link', url));
      });
    }
  }

  function showInviteLink(body, d) {
    const url = d.invite.url;
    body.innerHTML = `
      <p class="rel-sheet-title">${T('Invite link ready', '邀请链接已生成', 'ลิงก์คำเชิญพร้อมแล้ว')}</p>
      <p class="rel-muted">${T('When they add their details and sign in, you\'ll both see each other in Relationships. The link works once and expires in 14 days.', '对方填写资料并登录后，你们会出现在彼此的关系列表中。链接只能使用一次，14 天后失效。', 'เมื่อเขากรอกข้อมูลและเข้าสู่ระบบ คุณทั้งคู่จะเห็นกันในความสัมพันธ์ ลิงก์ใช้ได้ครั้งเดียวและหมดอายุใน 14 วัน')}</p>
      <div class="rel-link-box"><code>${esc(url)}</code></div>
      ${linkButtons(url, d.shareText)}`;
    bindLinkButtons(body, url, d.shareText);
  }

  /* ═══════════ detail ═══════════ */
  function setDetailMode(on) {
    const r = results();
    if (r) r.classList.toggle('rel-detail-open', !!on);
  }

  function stopPoll() {
    clearTimeout(st.pollTimer);
    st.pollTimer = null;
  }

  function closeDetail() {
    if (!st.detailId) return;
    stopPoll();
    closeSheet();
    st.detailId = null;
    st.detail = null;
    st.reading = null;
    setDetailMode(false);
    if (st.loaded) renderList(); else loadList();
  }

  function detailSkeleton() {
    return `<button type="button" class="rel-back" data-act="back">‹ ${T('People', '身边的人', 'ผู้คน')}</button>
      <div class="rel-card rel-headline" aria-busy="true">
        <span class="skel skel-w30"></span><span class="skel skel-h28 skel-w70"></span>
        <span class="skel skel-w100"></span><span class="skel skel-w80"></span>
      </div>
      <div class="rel-card" aria-busy="true">${[0, 1, 2].map(() => '<span class="skel skel-w50"></span><span class="skel skel-bar"></span>').join('')}</div>`;
  }

  async function openDetail(id, opts) {
    opts = opts || {};
    const changed = st.detailId !== id;
    st.detailId = id;
    setDetailMode(true);
    stopPoll();
    if (changed || opts.refresh) {
      st.detail = null;
      st.reading = null;
      st.polls = 0;
      section.innerHTML = detailSkeleton();
      scrollTop();
    }
    try {
      const d = await api(`/api/rel/people/${id}`);
      if (st.detailId !== id) return;
      st.detail = d;
      renderDetail();
      await fetchReading(false);
    } catch (err) {
      if (st.detailId !== id) return;
      if (err.status === 401) { closeDetailToList(); return; }
      section.innerHTML = `<button type="button" class="rel-back" data-act="back">‹ ${T('People', '身边的人', 'ผู้คน')}</button>
        <div class="rel-card">${err.status === 404 ? `<p>${T('This person is no longer in your list.', '此人已不在你的列表中。', 'คนนี้ไม่อยู่ในรายชื่อของคุณแล้ว')}</p>` : errHtml(err)}</div>`;
    }
  }

  function closeDetailToList() {
    closeDetail();
    goHash('relationships', { replace: true });
  }

  async function fetchReading(retry) {
    const id = st.detailId;
    try {
      const d = await api(`/api/rel/people/${id}/reading${retry ? '/retry' : ''}`, retry ? { method: 'POST' } : undefined);
      if (st.detailId !== id) return;
      st.reading = d.reading;
      st.readingError = null;
    } catch (err) {
      if (st.detailId !== id) return;
      st.reading = null;
      st.readingError = err;
    }
    renderDetail();
    if (st.reading && st.reading.status === 'pending') {
      st.polls += 1;
      if (st.polls < POLL_MAX) st.pollTimer = setTimeout(() => fetchReading(false), POLL_MS);
    }
  }

  function scoreRow(label, score, line, extra) {
    return `<div class="rel-score">
      <div class="rel-score-top"><span class="rel-score-label">${label}</span><span class="rel-score-val">${score}</span></div>
      <div class="rel-bar"><div class="rel-bar-fill" style="width:${Math.max(4, score)}%"></div></div>
      ${extra || ''}
      ${line}
    </div>`;
  }

  function textLine(t, name, pending) {
    if (t) return `<p class="rel-score-line">${named(t, name)}</p>`;
    return pending ? '<span class="skel skel-w80"></span>' : '';
  }

  const PILLAR_LABEL = { Year: ['Year', '年柱', 'ปี'], Month: ['Month', '月柱', 'เดือน'], Day: ['Day', '日柱', 'วัน'], Hour: ['Hour', '时柱', 'ชั่วโมง'] };

  function renderDetail() {
    if (!st.detail) return;
    const p = st.detail.person;
    const r = st.reading;
    const f = r && r.facts;
    const txt = r && r.text;
    const pending = !!(r && r.status === 'pending');
    const failed = !!(r && r.status === 'error');
    const stalled = pending && st.polls >= POLL_MAX;
    const name = p.name;

    let html = `<button type="button" class="rel-back" data-act="back">‹ ${T('People', '身边的人', 'ผู้คน')}</button>
      <div class="rel-person-head">
        <h3 class="rel-person-name">${esc(name)}</h3>
        <span class="rel-chip">${tl(p.type)}</span>
        ${p.linked ? `<span class="rel-chip rel-chip-linked">${T('Linked account', '已连接账号', 'บัญชีที่เชื่อมแล้ว')}</span>` : ''}
      </div>`;

    if (st.readingError) {
      const code = st.readingError.code;
      html += `<div class="rel-card">${code === 'paywall'
        ? `<p class="rel-card-title">${T('Upgrade to see this reading', '升级以查看此解读', 'อัปเกรดเพื่อดูผลนี้')}</p>`
        : errHtml(st.readingError)}</div>`;
      html += manageHtml(p);
      section.innerHTML = html;
      return;
    }
    if (!f || !f.archetype) {
      section.innerHTML = html + detailSkeleton().replace(/^<button[\s\S]*?<\/button>/, '') + manageHtml(p);
      return;
    }

    const a = f.archetype;
    const s = f.scores;

    /* Headline */
    html += `<div class="rel-card rel-headline">
      <p class="rel-kicker">${T('Pair archetype', '组合类型', 'ต้นแบบคู่')}</p>
      <h2 class="rel-archetype-name">${T(esc(a.name.en), esc(a.name.zh), esc(a.name.th))}</h2>
      ${txt && txt.headline ? `<p class="rel-headline-desc">${named(txt.headline.description, name)}</p>`
        : pending ? '<span class="skel skel-w100"></span><span class="skel skel-w80"></span>'
        : `<p class="rel-headline-desc">${esc(a.desc)}</p>`}
      ${txt && txt.headline ? `<p class="rel-watch"><span class="rel-watch-label">${T('Watch out for', '需要留意', 'ระวัง')}</span> ${named(txt.headline.watch_out, name)}</p>`
        : pending ? '<span class="skel skel-w70"></span>' : ''}
    </div>`;

    if (f.confidence === 'lower') {
      html += `<p class="rel-confidence">${T('Lower confidence: birth hour unknown', '可信度较低：出生时辰未知', 'ความแม่นยำต่ำลง: ไม่ทราบเวลาเกิด')}</p>`;
    }
    if (failed || stalled) {
      html += `<div class="rel-card rel-note">
        <p>${failed ? T('We couldn\'t write the detailed wording this time. Your scores are ready.', '这次未能生成详细文字，分数已就绪。', 'ครั้งนี้เขียนคำอธิบายละเอียดไม่สำเร็จ แต่คะแนนพร้อมแล้ว')
          : T('This is taking longer than usual.', '比平时慢一些。', 'ใช้เวลานานกว่าปกติ')}</p>
        <button type="button" class="btn-secondary" data-act="retry">${T('Try again', '重试', 'ลองอีกครั้ง')}</button>
      </div>`;
    }

    /* Scorecard */
    const ts = txt && txt.scores;
    const branchExtra = `<div class="rel-dual">
      <span class="rel-dual-item"><span class="rel-muted">${T('Harmony', '合', 'กลมกลืน')}</span><span class="rel-mini"><span style="width:${s.branches.harmony}%"></span></span></span>
      <span class="rel-dual-item"><span class="rel-muted">${T('Clash', '冲', 'ปะทะ')}</span><span class="rel-mini rel-mini-clash"><span style="width:${s.branches.clash}%"></span></span></span>
    </div>`;
    html += `<div class="rel-card rel-scorecard">
      <p class="rel-kicker">${T('Scorecard', '评分', 'สกอร์การ์ด')}</p>
      ${scoreRow(T('Element Complementarity', '五行互补', 'ธาตุเติมเต็มกัน'), s.element.score, textLine(ts && ts.element.line, name, pending))}
      ${scoreRow(`${T('Day Master Dynamic', '日主互动', 'พลวัตเจ้าวัน')} <span class="rel-chip">${T(esc(s.dayMaster.label.en), esc(s.dayMaster.label.zh), esc(s.dayMaster.label.th))}</span>`, s.dayMaster.score, textLine(ts && ts.day_master.line, name, pending))}
      ${scoreRow(T('Branch Harmony vs Clash', '地支合冲', 'กิ่งกลมกลืน / ปะทะ'), s.branches.score, textLine(ts && ts.branches.line, name, pending), branchExtra)}
    </div>`;

    /* Friction map (collapsed) */
    if (r.locked && r.locked.friction) {
      html += lockedCard(T('Friction map', '摩擦地图', 'แผนที่จุดเสียดสี'));
    } else if (f.friction) {
      const items = txt && txt.friction ? txt.friction : null;
      const byId = {};
      f.friction.forEach(c => { byId[c.id] = c; });
      html += `<details class="rel-card rel-friction">
        <summary><span class="rel-kicker">${T('Friction map', '摩擦地图', 'แผนที่จุดเสียดสี')}</span><span class="rel-muted">${items ? items.length : f.friction.length} ${T('patterns', '个模式', 'รูปแบบ')}</span></summary>
        ${items ? items.map(it => {
          const c = byId[it.id] || {};
          const where = c.pillars && c.pillars.you !== 'All'
            ? `${T(...PILLAR_LABEL[c.pillars.you])} ↔ ${T(...PILLAR_LABEL[c.pillars.them])} · ${esc(c.kind)}` : esc(c.kind || '');
          return `<div class="rel-friction-item">
            <p class="rel-friction-where">${where}</p>
            <p class="rel-friction-title">${named(it.title, name)}</p>
            <p>${named(it.pattern, name)}</p>
            <p class="rel-tip"><span class="rel-tip-label">${T('Try', '试试', 'ลองทำ')}</span> ${named(it.tip, name)}</p>
          </div>`;
        }).join('') : pending ? '<span class="skel skel-w100"></span><span class="skel skel-w80"></span>' : `<p class="rel-muted">${T('Detailed patterns are unavailable right now.', '暂时无法显示详细模式。', 'ยังแสดงรูปแบบโดยละเอียดไม่ได้ในตอนนี้')}</p>`}
      </details>`;
    }

    /* Type-specific */
    if (p.type === 'romantic') {
      if (r.locked && r.locked.typeSections) html += lockedCard(T('Spouse Palace', '夫妻宫', 'วังคู่ครอง'));
      else if (f.spousePalace) {
        const t = txt && txt.romantic;
        const cell = (label, v) => `<div class="rel-grid-cell"><p class="rel-muted">${label}</p>${t ? `<p>${named(v, name)}</p>` : pending ? '<span class="skel skel-w80"></span>' : ''}</div>`;
        html += `<div class="rel-card">
          <p class="rel-kicker">${T('Spouse Palace', '夫妻宫', 'วังคู่ครอง')}</p>
          <p class="rel-muted rel-sub">${T('What each of you needs, and what the other naturally offers.', '你们各自需要什么，对方天生能给什么。', 'แต่ละคนต้องการอะไร และอีกฝ่ายให้อะไรได้โดยธรรมชาติ')}</p>
          <div class="rel-grid">
            ${cell(T('You need', '你需要', 'คุณต้องการ'), t && t.you_need)}
            ${cell(`<span class="rel-name">${esc(first(name))}</span> ${T('offers', '能给', 'ให้ได้')}`, t && t.they_offer)}
            ${cell(`<span class="rel-name">${esc(first(name))}</span> ${T('needs', '需要', 'ต้องการ')}`, t && t.they_need)}
            ${cell(T('You offer', '你能给', 'คุณให้ได้'), t && t.you_offer)}
          </div>
        </div>`;
      }
    }
    if (p.type === 'business') {
      if (r.locked && r.locked.typeSections) html += lockedCard(T('How to work with them', '如何与对方共事', 'วิธีทำงานกับเขา'));
      else if (f.workStyle) {
        const t = txt && txt.business;
        const item = (label, v) => `<div class="rel-work-item"><p class="rel-muted">${label}</p>${t ? `<p>${named(v, name)}</p>` : pending ? '<span class="skel skel-w80"></span>' : ''}</div>`;
        html += `<div class="rel-card">
          <p class="rel-kicker">${T('How to work with', '如何共事：', 'วิธีทำงานกับ')} <span class="rel-name">${esc(first(name))}</span></p>
          ${item(T('How to pitch', '怎么提案', 'วิธีเสนองาน'), t && t.pitch)}
          ${item(T('What triggers them', '什么会触发对方', 'อะไรที่ทำให้เขาไม่พอใจ'), t && t.triggers)}
          ${item(T('Decision style', '决策方式', 'สไตล์การตัดสินใจ'), t && t.decision_style)}
        </div>`;
      }
    }

    /* One primary action: share */
    html += `<button type="button" class="btn-primary btn-full rel-share-btn" data-act="share">${T('Share this pairing', '分享这个组合', 'แชร์คู่นี้')}</button>`;
    html += manageHtml(p);
    section.innerHTML = html;
  }

  function lockedCard(title) {
    return `<div class="rel-card rel-locked"><p class="rel-kicker">${title}</p>
      <p class="rel-muted">🔒 ${T('Included with the full plan.', '完整版包含此内容。', 'มีในแพ็กเกจเต็ม')}</p></div>`;
  }

  function manageHtml(p) {
    return `<div class="rel-manage">
      <button type="button" class="rel-link-btn" data-act="edit">${p.linked ? T('Edit name or type', '修改名字或关系', 'แก้ชื่อหรือประเภท') : T('Edit details', '编辑资料', 'แก้ไขข้อมูล')}</button>
      <button type="button" class="rel-link-btn rel-danger" data-act="remove">${p.linked ? T('Remove link', '解除连接', 'ยกเลิกการเชื่อม') : T('Remove', '删除', 'ลบ')}</button>
    </div>`;
  }

  /* ═══════════ share sheet ═══════════ */
  async function openShare() {
    const p = st.detail && st.detail.person;
    if (!p) return;
    hapt(8);
    const sheet = openSheet(`<p class="rel-sheet-title">${T('Share this pairing', '分享这个组合', 'แชร์คู่นี้')}</p>
      <div class="rel-share-preview"><span class="skel skel-card"></span></div>`);
    let share;
    try {
      share = (await api(`/api/rel/people/${p.id}/share`, { method: 'POST' })).share;
    } catch (err) {
      sheet.querySelector('.rel-sheet-body').innerHTML += errHtml(err);
      return;
    }
    st.detail.share = share;
    renderShare(sheet.querySelector('.rel-sheet-body'), p, share);
  }

  function renderShare(body, p, share) {
    const bust = '?v=' + Date.now();
    const text = 'Our compatibility on Wobazi';
    body.innerHTML = `
      <p class="rel-sheet-title">${T('Share this pairing', '分享这个组合', 'แชร์คู่นี้')}</p>
      <div class="rel-share-preview"><img src="${esc(share.ogUrl)}${bust}" alt="" width="1200" height="630"></div>
      <label class="time-unknown-opt rel-toggle">
        <input type="checkbox" id="rel-show-name"${p.shareShowName ? ' checked' : ''}>
        ${T(`Show ${esc(first(p.name))}'s first name on the card`, `在卡片上显示 ${esc(first(p.name))} 的名字`, `แสดงชื่อ ${esc(first(p.name))} บนการ์ด`)}
      </label>
      <p class="rel-muted rel-sub">${T('Cards show first names, the archetype and scores only. Never birth dates, times or places.', '卡片只显示名字、组合类型和分数，绝不显示出生日期、时间或地点。', 'การ์ดแสดงเฉพาะชื่อ ต้นแบบ และคะแนน ไม่แสดงวันเวลาหรือสถานที่เกิด')}</p>
      <button type="button" class="btn-primary btn-full" data-story>${T('Share to Stories', '分享到快拍', 'แชร์ลงสตอรี่')}</button>
      ${linkButtons(share.url, text, true)}
      <button type="button" class="rel-link-btn rel-danger" data-revoke>${T('Turn off this link', '关闭此链接', 'ปิดลิงก์นี้')}</button>`;
    bindLinkButtons(body, share.url, text);

    body.querySelector('#rel-show-name').addEventListener('change', async e => {
      const on = e.target.checked;
      try {
        const d = await api(`/api/rel/people/${p.id}`, { method: 'PATCH', json: { shareShowName: on } });
        st.detail.person = d.person;
        body.querySelector('.rel-share-preview img').src = share.ogUrl + '?v=' + Date.now();
      } catch (err) {
        e.target.checked = !on;
        toast(esc(err.message));
      }
    });

    body.querySelector('[data-story]').addEventListener('click', async ev => {
      const btn = ev.currentTarget;
      btn.disabled = true;
      tr('relationship_share', { format: 'story' });
      try {
        const blob = await fetch(share.storyUrl + '?v=' + Date.now()).then(r => { if (!r.ok) throw new Error('image'); return r.blob(); });
        const file = new File([blob], 'wobazi-pair.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: 'Wobazi', text: share.url });
        } else {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'wobazi-pair.png';
          document.body.appendChild(a);
          a.click();
          setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
        }
      } catch (err) {
        if (err && err.name !== 'AbortError') toast(T('Could not prepare the image. Try again.', '图片生成失败，请重试。', 'เตรียมรูปไม่สำเร็จ ลองอีกครั้ง'));
      } finally {
        btn.disabled = false;
      }
    });

    body.querySelector('[data-revoke]').addEventListener('click', async () => {
      if (!window.confirm('Turn off this link? Anyone who opens it will see a "no longer shared" page.')) return;
      try {
        await api(`/api/rel/share/${encodeURIComponent(share.token)}`, { method: 'DELETE' });
        st.detail.share = null;
        closeSheet();
        toast(T('Link turned off', '链接已关闭', 'ปิดลิงก์แล้ว'));
      } catch (err) {
        toast(esc(err.message));
      }
    });
  }

  /* ═══════════ actions ═══════════ */
  section.addEventListener('click', async e => {
    const open = e.target.closest('[data-open]');
    if (open) {
      hapt(6);
      goHash('relationships/p/' + open.dataset.open);
      return;
    }
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const act = b.dataset.act;
    if (act === 'add') openAdd();
    else if (act === 'reload') { st.loaded = false; loadList(true); }
    else if (act === 'signin') {
      try { sessionStorage.setItem(RETURN_KEY, 'relationships'); } catch (err) { /* ignore */ }
      if (typeof loginWithGoogle === 'function') loginWithGoogle(); else location.href = '/auth/google';
    } else if (act === 'save-chart') {
      b.disabled = true;
      try { if (window.WobaziPortal) await WobaziPortal.onAuth(); } catch (err) { /* ignore */ }
      st.loaded = false;
      loadList(true);
    } else if (act === 'back') {
      hapt(6);
      if (history.state && history.state.inApp) history.back();
      else closeDetailToList();
    } else if (act === 'retry') {
      st.polls = 0;
      fetchReading(true);
    } else if (act === 'share') openShare();
    else if (act === 'edit' && st.detail) openManual(st.detail.person);
    else if (act === 'remove' && st.detail) {
      const p = st.detail.person;
      const msg = p.linked
        ? `Remove ${p.name} from your list? They stay in their own account, and you can be linked again with a new invite.`
        : `Remove ${p.name}? Their details and reading will be deleted.`;
      if (!window.confirm(msg)) return;
      try {
        await api(`/api/rel/people/${p.id}`, { method: 'DELETE' });
        st.loaded = false;
        closeDetailToList();
      } catch (err) {
        toast(esc(err.message));
      }
    }
  });

  /* Leaving the tab via the tab bar closes the person page. */
  document.addEventListener('click', e => {
    if (st.detailId && e.target.closest('.results-tab-bar .tab-btn')) closeDetail();
  }, true);

  window.addEventListener('popstate', () => {
    const h = typeof currentHash === 'function' ? currentHash() : '';
    if (!ROUTE.test(h) && st.detailId) closeDetail();
  });

  /* Load the list the first time the section becomes visible. */
  function visible() { return !section.classList.contains('hide') && results() && results().classList.contains('active'); }
  // Watch both the section (tab switches) and the results screen (first render straight onto this tab).
  const onShow = new MutationObserver(() => {
    if (visible() && !st.detailId) {
      if (!st.loaded) loadList();
      else if (!section.querySelector('.rel-list, .rel-empty, .rel-card')) renderList();
    }
  });
  onShow.observe(section, { attributes: true, attributeFilter: ['class'] });
  if (results()) onShow.observe(results(), { attributes: true, attributeFilter: ['class'] });

  /* ═══════════ routing (called from applyRoute) ═══════════ */
  function isRoute(h) { return ROUTE.test(h || ''); }

  function route(h) {
    const m = ROUTE.exec(h || '');
    if (!m) return;
    const id = parseInt(m[1], 10);
    const onTab = results() && results().classList.contains('active')
      && document.getElementById('tab-btn-relationships')
      && document.getElementById('tab-btn-relationships').classList.contains('active');
    if (!onTab) {
      applyRoute('relationships');
      if (!results() || !results().classList.contains('active')) return;   // no chart: applyRoute sent them to input
      // A fresh render picks its tab from the hash, and this hash isn't a plain tab name.
      if (typeof switchTab === 'function') switchTab('relationships', { skipHash: true });
    }
    openDetail(id);
  }

  /* ═══════════ finish an invite after Google sign-in ═══════════ */
  async function finishPendingInvite() {
    let flagged = false;
    try {
      const at = parseInt(localStorage.getItem(PENDING_KEY) || '0', 10);
      flagged = at && Date.now() - at < 60 * 60 * 1000;
      if (at && !flagged) localStorage.removeItem(PENDING_KEY);
    } catch (e) { /* private mode */ }
    const returning = new URLSearchParams(location.search).get('auth') === 'success';
    if (!flagged && !returning) return;
    try {
      const d = await api('/api/rel/invites/accept', { method: 'POST', json: {} });
      try { localStorage.removeItem(PENDING_KEY); } catch (e) { /* ignore */ }
      tr('relationship_invite_accept', {});
      if (typeof loadUserData === 'function') await loadUserData();
      st.loaded = false;
      goHash(d.personId ? 'relationships/p/' + d.personId : 'relationships');
    } catch (err) {
      if (err.status === 401) return;   // not signed in yet; keep the flag
      try { localStorage.removeItem(PENDING_KEY); } catch (e) { /* ignore */ }
      if (err.code && err.code !== 'no_draft') toast(esc(err.message));
    }
  }
  finishPendingInvite();

  window.WobaziRel = { isRoute, route, reload: () => { st.loaded = false; if (visible()) loadList(true); } };

  /* script.js may have routed before this file loaded (refresh on #relationships/p/:id). */
  const initial = typeof currentHash === 'function' ? currentHash() : '';
  if (isRoute(initial)) route(initial);
  else if (visible()) loadList();
})();
