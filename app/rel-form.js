/* ═══════════════════════════════════════
   WOBAZI — Relationships birth form (shared)
   app/rel-form.js

   Used by the invite page and the Relationships tab. Markup comes from
   views/partials/rel-birth-fields.ejs or WobaziRelForm.markup() (same ids/classes).
═══════════════════════════════════════ */
(function () {
  'use strict';

  function $(root, id) { return root.querySelector('#' + id); }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function tri(en, zh, th) {
    return `<span class="en">${en}</span><span class="zh hide">${zh}</span><span class="th hide">${th}</span>`;
  }

  /* Same fields as the EJS partial, for screens rendered in the SPA. */
  function markup(prefix, opts) {
    opts = opts || {};
    const p = prefix;
    return `
      ${opts.withName ? `<div class="field">
        <label for="${p}-name">${opts.nameLabel || tri('Name', '名字', 'ชื่อ')}</label>
        <input type="text" id="${p}-name" maxlength="60" autocomplete="off" spellcheck="false">
      </div>` : ''}
      <div class="field field-date-block">
        <label for="${p}-day">${tri('Date of birth <span class="label-req">*Required</span>', '出生日期 <span class="label-req">*必填</span>', 'วันเกิด <span class="label-req">*จำเป็น</span>')}</label>
        <div class="date-trio">
          <input type="number" id="${p}-day" class="date-part" placeholder="DD" min="1" max="31" inputmode="numeric" aria-label="Day">
          <span class="date-sep">/</span>
          <input type="number" id="${p}-month" class="date-part" placeholder="MM" min="1" max="12" inputmode="numeric" aria-label="Month">
          <span class="date-sep">/</span>
          <input type="number" id="${p}-year" class="date-part year" placeholder="YYYY" min="1900" max="2100" inputmode="numeric" aria-label="Year">
        </div>
        <div class="cal-seg" role="radiogroup" aria-label="Calendar type">
          <button type="button" class="cal-seg-btn active" data-cal="solar" role="radio" aria-checked="true"><span aria-hidden="true">☀️</span> ${tri('Solar', '阳历', 'สุริยคติ')}</button>
          <button type="button" class="cal-seg-btn" data-cal="lunar" role="radio" aria-checked="false"><span aria-hidden="true">🌙</span> ${tri('Lunar', '农历', 'จันทรคติ')}</button>
        </div>
        <label class="leap-opt hide" data-leap-wrap>
          <input type="checkbox" id="${p}-leap"> ${tri('Leap month', '闰月', 'เดือนอธิกมาส')}
        </label>
      </div>
      <div class="field">
        <label for="${p}-time">${tri('Birth time <span class="label-opt">local clock</span>', '出生时间 <span class="label-opt">当地钟点</span>', 'เวลาเกิด <span class="label-opt">นาฬิกาท้องถิ่น</span>')}</label>
        <input type="time" id="${p}-time" class="time-input">
        <label class="time-unknown-opt">
          <input type="checkbox" id="${p}-time-unknown"> ${tri("I don't know the hour", '我不知道出生时辰', 'ฉันไม่ทราบเวลาเกิด')}
        </label>
      </div>
      <div class="field">
        <label for="${p}-place">${tri('Birth city <span class="label-opt">for time zone</span>', '出生城市 <span class="label-opt">用于时区</span>', 'เมืองเกิด <span class="label-opt">สำหรับเขตเวลา</span>')}</label>
        <div class="city-wrap">
          <input type="text" id="${p}-place" autocomplete="off" spellcheck="false" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="${p}-place-list" placeholder="Start typing a city...">
          <ul id="${p}-place-list" class="city-suggest hide" role="listbox"></ul>
        </div>
      </div>`;
  }

  const state = new WeakMap();

  function bind(root, prefix) {
    const st = { calendar: 'solar', place: null };
    state.set(root, st);

    const segs = root.querySelectorAll('.cal-seg-btn[data-cal]');
    const leapWrap = root.querySelector('[data-leap-wrap]');
    segs.forEach(btn => btn.addEventListener('click', () => {
      st.calendar = btn.dataset.cal === 'lunar' ? 'lunar' : 'solar';
      segs.forEach(b => {
        const on = b === btn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-checked', on ? 'true' : 'false');
      });
      if (leapWrap) leapWrap.classList.toggle('hide', st.calendar !== 'lunar');
    }));

    const time = $(root, prefix + '-time');
    const unknown = $(root, prefix + '-time-unknown');
    if (unknown && time) {
      unknown.addEventListener('change', () => {
        time.disabled = unknown.checked;
        if (unknown.checked) time.value = '';
      });
    }

    const input = $(root, prefix + '-place');
    const list = $(root, prefix + '-place-list');
    if (input && list) {
      let timer = null;
      let items = [];
      let active = -1;
      let seq = 0;
      const close = () => { list.classList.add('hide'); input.setAttribute('aria-expanded', 'false'); active = -1; };
      const choose = i => {
        const it = items[i];
        if (!it) return;
        st.place = it;
        input.value = it.label;
        close();
      };
      const render = () => {
        list.innerHTML = items.map((it, i) =>
          `<li role="option" id="${prefix}-place-opt-${i}" class="${i === active ? 'is-active' : ''}" data-i="${i}">${esc(it.label)}</li>`).join('');
        list.classList.toggle('hide', !items.length);
        input.setAttribute('aria-expanded', items.length ? 'true' : 'false');
      };
      input.addEventListener('input', () => {
        st.place = null;
        clearTimeout(timer);
        const q = input.value.trim();
        if (q.length < 2) { items = []; render(); return; }
        timer = setTimeout(() => {
          const my = ++seq;
          fetch('/api/rel/place-suggest?q=' + encodeURIComponent(q))
            .then(r => r.json())
            .then(d => { if (my === seq) { items = (d && d.places) || []; active = -1; render(); } })
            .catch(() => {});
        }, 250);
      });
      input.addEventListener('keydown', e => {
        if (list.classList.contains('hide')) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(items.length - 1, active + 1); render(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(0, active - 1); render(); }
        else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); choose(active); }
        else if (e.key === 'Escape') close();
      });
      list.addEventListener('mousedown', e => {
        const li = e.target.closest('li[data-i]');
        if (li) { e.preventDefault(); choose(parseInt(li.dataset.i, 10)); }
      });
      input.addEventListener('blur', () => setTimeout(close, 120));
    }
  }

  /* Prefill from an API person.birth object. */
  function fill(root, prefix, birth, name) {
    const st = state.get(root);
    if (name != null && $(root, prefix + '-name')) $(root, prefix + '-name').value = name;
    if (!birth) return;
    $(root, prefix + '-day').value = birth.day || '';
    $(root, prefix + '-month').value = birth.month || '';
    $(root, prefix + '-year').value = birth.year || '';
    const lunarBtn = root.querySelector('.cal-seg-btn[data-cal="lunar"]');
    const solarBtn = root.querySelector('.cal-seg-btn[data-cal="solar"]');
    (birth.calendar === 'lunar' ? lunarBtn : solarBtn).click();
    if ($(root, prefix + '-leap')) $(root, prefix + '-leap').checked = !!birth.leapMonth;
    const unknown = $(root, prefix + '-time-unknown');
    if (birth.hourKnown && birth.hour != null) {
      $(root, prefix + '-time').value = String(birth.hour).padStart(2, '0') + ':' + String(birth.minute || 0).padStart(2, '0');
      unknown.checked = false;
    } else {
      unknown.checked = true;
    }
    unknown.dispatchEvent(new Event('change'));
    if (birth.birthplace) $(root, prefix + '-place').value = birth.birthplace;
    if (st) st.place = null;
  }

  /**
   * @returns {{ body: object } | { error: { en, zh, th } }}
   */
  function read(root, prefix) {
    const st = state.get(root) || { calendar: 'solar', place: null };
    const num = id => parseInt(($(root, prefix + '-' + id) || {}).value, 10);
    const day = num('day');
    const month = num('month');
    const year = num('year');
    if (!day || !month || !year || year < 1900 || year > 2100) {
      return { error: { en: 'Please enter a valid birth date.', zh: '请输入有效的出生日期。', th: 'กรุณากรอกวันเกิดที่ถูกต้อง' } };
    }
    const unknown = $(root, prefix + '-time-unknown');
    const timeVal = ($(root, prefix + '-time') || {}).value || '';
    const hourKnown = !(unknown && unknown.checked) && !!timeVal;
    if (!(unknown && unknown.checked) && !timeVal) {
      return { error: { en: 'Enter a birth time, or tick "I don\'t know the hour".', zh: '请输入出生时间，或勾选「我不知道出生时辰」。', th: 'กรอกเวลาเกิด หรือเลือก "ฉันไม่ทราบเวลาเกิด"' } };
    }
    const [h, m] = timeVal.split(':').map(v => parseInt(v, 10));
    const placeInput = $(root, prefix + '-place');
    const label = placeInput ? placeInput.value.trim() : '';
    const place = st.place && st.place.label === label ? st.place : null;
    const body = {
      calendar: st.calendar,
      year, month, day,
      leapMonth: st.calendar === 'lunar' && !!($(root, prefix + '-leap') || {}).checked,
      hourKnown,
      hour: hourKnown ? h : null,
      minute: hourKnown ? (m || 0) : null,
      birthplace: label || null,
      place: place ? { label: place.label, lat: place.lat, lon: place.lon, countryCode: place.countryCode } : null,
    };
    const nameEl = $(root, prefix + '-name');
    if (nameEl) body.name = nameEl.value.trim();
    return { body };
  }

  window.WobaziRelForm = { markup, bind, fill, read, esc, tri };
})();
