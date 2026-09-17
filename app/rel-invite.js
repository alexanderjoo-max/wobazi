/* ═══════════════════════════════════════
   WOBAZI — Invite landing page
   app/rel-invite.js  (views/pages/rel-invite.ejs)

   Teaser works for anyone. Linking needs Google sign-in: the birth data is kept in the
   session (draft), sign-in runs, and the app finishes the link on return
   (app/relationships.js reads the wobazi_rel_invite_pending flag).
═══════════════════════════════════════ */
(function () {
  'use strict';

  const root = document.getElementById('rel-invite');
  if (!root || !window.WobaziRelForm) return;
  const F = window.WobaziRelForm;
  const token = root.dataset.token;
  const signedIn = !!root.dataset.signedIn;
  const hasChart = !!root.dataset.hasChart;
  const PENDING_KEY = 'wobazi_rel_invite_pending';
  const ua = navigator.userAgent || '';

  const EL_ZH = { Wood: '木', Fire: '火', Earth: '土', Metal: '金', Water: '水' };
  const EL_TH = { Wood: 'ไม้', Fire: 'ไฟ', Earth: 'ดิน', Metal: 'โลหะ', Water: 'น้ำ' };
  const POL_ZH = { Yang: '阳', Yin: '阴' };

  /* In-app browsers: LINE can hand off to the system browser; Instagram/Facebook cannot. */
  const params = new URLSearchParams(location.search);
  if (/\bLine\//i.test(ua) && !params.has('openExternalBrowser')) {
    params.set('openExternalBrowser', '1');
    location.replace(location.pathname + '?' + params.toString());
    return;
  }
  const blockedWebview = /Instagram|FBAN|FBAV|FB_IAB|MicroMessenger/i.test(ua);

  const $ = id => document.getElementById(id);
  const form = $('inv-form');
  let lastBody = null;

  function showError(el, msg) {
    if (!el) return;
    el.innerHTML = msg ? F.tri(msg.en, msg.zh || msg.en, msg.th || msg.en) : '';
    el.classList.toggle('hide', !msg);
  }

  async function post(url, body) {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) });
    let data = {};
    try { data = await r.json(); } catch (e) { data = {}; }
    if (!r.ok) {
      const err = new Error(data.error || 'Request failed');
      err.code = data.code;
      throw err;
    }
    return data;
  }

  function showTeaser(t) {
    const dm = t.dayMaster;
    const a = t.archetype || { name: { en: '' }, line: { en: '' } };
    $('inv-dm-char').textContent = dm.char;
    $('inv-dm-char').dataset.el = dm.element;
    $('inv-dm-name').innerHTML = F.tri(F.esc(a.name.en), F.esc(a.name.zh), F.esc(a.name.th));
    $('inv-dm-el').innerHTML = F.tri(`${dm.polarity} ${dm.element}`, `${POL_ZH[dm.polarity]}${EL_ZH[dm.element]}`, `${EL_TH[dm.element]} ${dm.polarity}`);
    $('inv-dm-line').innerHTML = F.tri(F.esc(a.line.en), F.esc(a.line.zh), F.esc(a.line.th));
    $('inv-teaser').classList.remove('hide');
    $('inv-link').classList.remove('hide');
    if (blockedWebview && !signedIn) {
      $('inv-inapp').classList.remove('hide');
      $('inv-connect').disabled = true;
    }
    $('inv-teaser').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  if (form) {
    F.bind(form, 'inv');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const r = F.read(form, 'inv');
      if (r.error) return showError($('inv-error'), r.error);
      showError($('inv-error'), null);
      const btn = $('inv-preview');
      btn.disabled = true;
      try {
        const d = await post(`/api/rel/invites/${encodeURIComponent(token)}/teaser`, r.body);
        lastBody = r.body;
        showTeaser(d.teaser);
      } catch (err) {
        showError($('inv-error'), { en: err.message });
      } finally {
        btn.disabled = false;
      }
    });
  } else if (signedIn && hasChart) {
    post(`/api/rel/invites/${encodeURIComponent(token)}/teaser`, { useSaved: true })
      .then(d => showTeaser(d.teaser))
      .catch(err => showError($('inv-link-error'), { en: err.message }));
  }

  const copyBtn = $('inv-copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const url = location.origin + location.pathname;
      (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(() => {
        copyBtn.innerHTML = F.tri('Copied', '已复制', 'คัดลอกแล้ว');
      }).catch(() => { window.prompt('Copy this link', url); });
    });
  }

  const connect = $('inv-connect');
  if (connect) {
    connect.addEventListener('click', async () => {
      showError($('inv-link-error'), null);
      connect.disabled = true;
      try {
        const body = hasChart && signedIn ? { useSaved: true } : lastBody;
        if (!body) throw new Error('Enter your birth details first.');
        const d = await post(`/api/rel/invites/${encodeURIComponent(token)}/draft`, body);
        if (d.signedIn) {
          const acc = await post('/api/rel/invites/accept', {});
          location.href = '/chart#relationships' + (acc.personId ? '/p/' + acc.personId : '');
          return;
        }
        try { localStorage.setItem(PENDING_KEY, String(Date.now())); } catch (e) { /* private mode: link finishes from the Relationships tab */ }
        location.href = '/auth/google';
      } catch (err) {
        showError($('inv-link-error'), { en: err.message });
        connect.disabled = false;
      }
    });
  }
})();
