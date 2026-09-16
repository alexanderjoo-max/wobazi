/* Viral Today / Year share sheet */
(function () {
  const EL_HEX = { Wood: '#22c55e', Fire: '#ef4444', Earth: '#f59e0b', Metal: '#c0c8d4', Water: '#3b82f6' };
  const YEAR_ANIMAL_EN = { Rat:'Rat', Ox:'Ox', Tiger:'Tiger', Rabbit:'Rabbit', Dragon:'Dragon', Snake:'Snake', Horse:'Horse', Goat:'Goat', Monkey:'Monkey', Rooster:'Rooster', Dog:'Dog', Pig:'Pig' };

  let state = { kind: 'today', tone: 'oracle', lang: 'en', verdict: null, comboYear: null, file: null };
  let buildSeq = 0;

  function lang() {
    if (window.WoBaziI18n && WoBaziI18n.get) return WoBaziI18n.get();
    return document.documentElement.getAttribute('data-lang') || 'en';
  }

  function bIdx(br) {
    if (!br || !window.BaziEngine) return -1;
    return BaziEngine.BRANCHES.findIndex(b => b.char === br.char);
  }

  function collectFacts() {
    const o = window._shareData || {};
    const pillars = o.pillars;
    if (!pillars || !window.BaziEngine) return null;
    const E = BaziEngine;
    const dm = pillars[2] && pillars[2].known ? pillars[2].stem : null;
    const now = new Date();
    const todayR = E.calcBaziAccurate({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate(), hour: 12 });
    const yearR = E.calcBaziAccurate({ year: now.getFullYear(), month: 6, day: 15, hour: 12 });
    const todayP = todayR.pillars[2];
    const yearP = yearR.pillars[0];
    let todayRel = 'neutral';
    let yearRel = 'neutral';
    pillars.forEach(p => {
      if (!p.known || !p.branch) return;
      const a = bIdx(p.branch);
      const tRel = E.branchRelation(a, bIdx(todayP.branch));
      const yRel = E.branchRelation(a, bIdx(yearP.branch));
      if (tRel === 'clash') todayRel = 'clash';
      else if (todayRel !== 'clash' && (tRel === 'combine' || tRel === 'harmony')) todayRel = tRel;
      if (yRel === 'clash') yearRel = 'clash';
      else if (yearRel !== 'clash' && (yRel === 'combine' || yRel === 'harmony')) yearRel = yRel;
    });
    const todayGod = dm && todayP.stem ? E.calcTenGod(dm.element, dm.polarity, todayP.stem.element, todayP.stem.polarity) : null;
    const yearGod = dm && yearP.stem ? E.calcTenGod(dm.element, dm.polarity, yearP.stem.element, yearP.stem.polarity) : null;
    const peach = E.getPeachBlossom(pillars);
    const nobles = E.getNatalNobles(pillars);
    const todayAnimal = todayP.branch && todayP.branch.animal;
    const nobleToday = !!(nobles && nobles.tianyiBranches && nobles.tianyiBranches.some(b => b.animal === todayAnimal));
    const yearLink = dm && yearP.stem ? E.elementLink(yearP.stem.element, dm.element) : 'none';
    const yEl = yearP.stem.element;
    const yAn = yearP.branch.animal;
    return {
      dmChar: dm ? dm.char : '',
      dmEl: dm ? dm.element : (o.dominantEl || ''),
      dmPol: dm ? dm.polarity : '',
      dayChars: pillars[2] && pillars[2].known ? pillars[2].stem.char + pillars[2].branch.char : '',
      yearNatalChars: pillars[0] && pillars[0].known ? pillars[0].stem.char + pillars[0].branch.char : '',
      todayChars: todayP.stem.char + todayP.branch.char,
      flowYearChars: yearP.stem.char + yearP.branch.char,
      todayGod: todayGod,
      todayGodFamily: todayGod ? (WobaziVerdict.GOD_FAMILY[todayGod] || '') : '',
      yearGod: yearGod,
      yearGodFamily: yearGod ? (WobaziVerdict.GOD_FAMILY[yearGod] || '') : '',
      todayRel: todayRel,
      yearRel: yearRel,
      peach: !!(peach && peach.present),
      nobleToday: nobleToday,
      yearLink: yearLink,
      yearLabel: now.getFullYear() + ' · ' + yEl + ' ' + (YEAR_ANIMAL_EN[yAn] || yAn),
      luckPhase: o.luckPhase || '',
      name: (o.name || '').split(' ')[0]
    };
  }

  function rebuild() {
    if (!window.WobaziVerdict) return;
    const facts = collectFacts();
    if (!facts) return;
    state.lang = lang();
    state.verdict = WobaziVerdict.build({ kind: state.kind === 'year' ? 'year' : 'today', tone: state.tone, lang: state.lang, facts: facts });
    if (state.kind === 'both') {
      state.comboYear = WobaziVerdict.build({ kind: 'year', tone: state.tone, lang: state.lang, facts: facts });
    } else {
      state.comboYear = null;
    }
    drawPreview();
    state.file = null;
    const seq = ++buildSeq;
    ensureFonts(state.verdict)
      .then(() => { drawPreview(); return renderFile(); })
      .then(f => { if (seq === buildSeq) state.file = f; });
    const cap = document.getElementById('viral-caption');
    if (cap) cap.value = WobaziVerdict.caption(state.verdict, shareUrl());
  }

  function shareUrl() {
    if (!state.verdict) return 'https://wobazi.com';
    const id = WobaziVerdict.encodePayload(state.kind === 'both' && state.comboYear
      ? Object.assign({}, state.verdict, { kind: 'both' })
      : state.verdict);
    return location.origin + '/s/' + id;
  }

  /* ── Oracle-slip card: Wobazi logo, luopan dial, cinnabar seal, verdict ── */
  const GOLD = '#e8c26a';
  const PAPER = '#f6ecd8';
  const CINNABAR = '#c8412c';
  const DISPLAY = 'Outfit, "Noto Sans SC", "Noto Sans Thai", sans-serif';
  const HAN = '"Noto Sans SC", sans-serif';
  const LOGO = new Image();
  LOGO.src = '/app/assets/logo-horiz.png?v=6';
  const logoReady = (LOGO.decode ? LOGO.decode() : Promise.resolve()).catch(() => null);
  const SANS = 'Outfit, "Noto Sans SC", "Noto Sans Thai", sans-serif';
  const BRANCH_CHARS = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const SEAL_ZH = { Peak: ['巅', '峰'], Open: ['开', '运'], Friction: ['冲'], Hidden: ['暗', '助'] };
  const TONE_LABEL = { oracle: 'Oracle', roast: 'Roast', power: 'Power' };
  const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

  function rgba(hex, a) {
    const n = parseInt(String(hex).slice(1), 16);
    return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  function isCJK(s) { return /[฀-๿　-鿿]/.test(String(s || '')); }

  /* Letter-spaced text (canvas letterSpacing is not universal yet). */
  function spaced(ctx, text, x, y, gap, align) {
    const chars = Array.from(String(text || ''));
    const widths = chars.map(c => ctx.measureText(c).width);
    const total = widths.reduce((a, b) => a + b, 0) + gap * Math.max(0, chars.length - 1);
    let cx = align === 'center' ? x - total / 2 : (align === 'right' ? x - total : x);
    const prev = ctx.textAlign;
    ctx.textAlign = 'left';
    chars.forEach((c, i) => { ctx.fillText(c, cx, y); cx += widths[i] + gap; });
    ctx.textAlign = prev;
    return total;
  }

  function wrapLines(ctx, text, maxW) {
    const src = String(text || '');
    const units = isCJK(src) && !/\s/.test(src.trim()) ? Array.from(src) : src.split(/\s+/);
    const joiner = isCJK(src) && !/\s/.test(src.trim()) ? '' : ' ';
    const lines = [];
    let line = '';
    units.forEach(u => {
      const test = line ? line + joiner + u : u;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = u; }
      else line = test;
    });
    if (line) lines.push(line);
    return lines;
  }

  function grain(ctx, w, h, seed) {
    let s = seed || 7;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 2600; i++) {
      ctx.fillStyle = rnd() > 0.5 ? 'rgba(246,236,216,' + (0.02 + rnd() * 0.05) + ')' : 'rgba(0,0,0,' + (0.1 + rnd() * 0.15) + ')';
      ctx.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 1.6, 1 + rnd() * 1.6);
    }
  }

  function frame(ctx, w, h) {
    ctx.strokeStyle = rgba(GOLD, 0.55);
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, w - 80, h - 80);
    ctx.strokeStyle = rgba(GOLD, 0.2);
    ctx.lineWidth = 1;
    ctx.strokeRect(54, 54, w - 108, h - 108);
    [[40, 40], [w - 40, 40], [40, h - 40], [w - 40, h - 40]].forEach(([x, y]) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = '#0e0718';
      ctx.fillRect(-11, -11, 22, 22);
      ctx.strokeStyle = GOLD;
      ctx.lineWidth = 2;
      ctx.strokeRect(-11, -11, 22, 22);
      ctx.fillStyle = GOLD;
      ctx.fillRect(-4, -4, 8, 8);
      ctx.restore();
    });
  }

  /* Luopan: tick ring + 12 branches, the day's (or year's) branch lit in the element colour. */
  function dial(ctx, cx, cy, R, accent, litBranch) {
    ctx.save();
    ctx.strokeStyle = rgba(GOLD, 0.6);
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = rgba(GOLD, 0.22);
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, R - 28, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = rgba(GOLD, 0.55);
    ctx.beginPath(); ctx.arc(cx, cy, R * 0.66, 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i < 120; i++) {
      const a = (i * 3 - 90) * Math.PI / 180;
      const long = i % 10 === 0;
      const r2 = R - (long ? 22 : 11);
      ctx.strokeStyle = rgba(GOLD, long ? 0.95 : 0.4);
      ctx.lineWidth = long ? 2.4 : 1.2;
      ctx.beginPath();
      ctx.moveTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
      ctx.lineTo(cx + r2 * Math.cos(a), cy + r2 * Math.sin(a));
      ctx.stroke();
    }
    const rb = R * 0.83;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    BRANCH_CHARS.forEach((ch, i) => {
      const a = (i * 30 - 90) * Math.PI / 180;
      const x = cx + rb * Math.cos(a);
      const y = cy + rb * Math.sin(a);
      const lit = ch === litBranch;
      if (lit) {
        ctx.fillStyle = accent;
        ctx.shadowColor = accent;
        ctx.shadowBlur = 30;
        ctx.beginPath(); ctx.arc(x, y, 30, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((i * 30) * Math.PI / 180);
      ctx.fillStyle = lit ? '#0e0718' : rgba(GOLD, 0.82);
      ctx.font = '700 34px ' + HAN;
      ctx.fillText(ch, 0, 2);
      ctx.restore();
    });
    const disc = ctx.createRadialGradient(cx, cy - R * 0.2, 0, cx, cy, R * 0.66);
    disc.addColorStop(0, rgba(accent, 0.18));
    disc.addColorStop(1, 'rgba(14,7,24,0.2)');
    ctx.fillStyle = disc;
    ctx.beginPath(); ctx.arc(cx, cy, R * 0.66 - 1, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function seal(ctx, x, y, size, weather) {
    const chars = SEAL_ZH[weather] || SEAL_ZH.Open;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-7 * Math.PI / 180);
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = CINNABAR;
    ctx.fillRect(-size / 2, -size / 2, size, size);
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = rgba(PAPER, 0.88);
    ctx.lineWidth = 4;
    ctx.strokeRect(-size / 2 + 9, -size / 2 + 9, size - 18, size - 18);
    ctx.fillStyle = PAPER;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (chars.length === 1) {
      ctx.font = '700 ' + Math.round(size * 0.6) + 'px ' + HAN;
      ctx.fillText(chars[0], 0, 4);
    } else {
      ctx.font = '700 ' + Math.round(size * 0.34) + 'px ' + HAN;
      ctx.fillText(chars[0], 0, -size * 0.2);
      ctx.fillText(chars[1], 0, size * 0.22);
    }
    ctx.restore();
  }

  function pillarStrip(ctx, cx, y, blocks) {
    const live = blocks.filter(b => b.chars);
    if (!live.length) return;
    const colW = 260;
    const x0 = cx - (colW * live.length) / 2 + colW / 2;
    live.forEach((b, i) => {
      const x = x0 + i * colW;
      ctx.fillStyle = rgba(PAPER, 0.5);
      ctx.font = '600 17px ' + SANS;
      ctx.textBaseline = 'alphabetic';
      spaced(ctx, b.label, x, y, 5, 'center');
      ctx.fillStyle = PAPER;
      ctx.font = '700 50px ' + HAN;
      ctx.textAlign = 'center';
      spaced(ctx, b.chars, x, y + 64, 10, 'center');
      if (i > 0) {
        ctx.fillStyle = rgba(GOLD, 0.35);
        ctx.fillRect(x - colW / 2, y - 14, 1, 88);
      }
    });
  }

  function drawCard(ctx, w, h, v, y0) {
    const accent = EL_HEX[v.accentEl] || GOLD;
    const isYear = v.kind === 'year';
    const cjk = isCJK(v.hook);
    ctx.save();
    ctx.translate(0, y0 || 0);

    // Ground: plum night, element glow behind the dial, film grain.
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#1d0f2a');
    g.addColorStop(0.5, '#0e0718');
    g.addColorStop(1, '#07030d');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2;
    const cy = 590;
    const R = 318;
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.7);
    glow.addColorStop(0, rgba(accent, 0.34));
    glow.addColorStop(0.45, rgba(accent, 0.08));
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
    grain(ctx, w, h, (v.dmChar || '八').charCodeAt(0));
    frame(ctx, w, h);

    // Header
    ctx.textBaseline = 'alphabetic';
    if (LOGO.complete && LOGO.naturalWidth) {
      const lh = 58;
      ctx.drawImage(LOGO, 100, 88, lh * LOGO.naturalWidth / LOGO.naturalHeight, lh);
    } else {
      ctx.fillStyle = GOLD;
      ctx.font = '700 24px ' + SANS;
      spaced(ctx, 'WOBAZI', 104, 136, 9, 'left');
    }
    const now = new Date();
    const kindLabel = isYear ? (v.yearLabel || 'THIS YEAR').toUpperCase() : 'TODAY · ' + MONTHS[now.getMonth()] + ' ' + now.getDate();
    ctx.fillStyle = rgba(PAPER, 0.55);
    ctx.font = '600 19px ' + SANS;
    spaced(ctx, kindLabel, w - 104, 124, 5, 'right');

    // Dial + Day Master
    const strip = isYear ? (v.flowYearChars || v.yearChars) : (v.todayChars || v.dayChars);
    dial(ctx, cx, cy, R, accent, strip ? Array.from(strip)[1] : '');
    ctx.textAlign = 'center';
    if (v.name) {
      ctx.fillStyle = rgba(PAPER, 0.72);
      ctx.font = '500 32px ' + DISPLAY;
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(v.name, cx, cy - 128);
    }
    ctx.save();
    ctx.fillStyle = accent;
    ctx.shadowColor = accent;
    ctx.shadowBlur = 60;
    ctx.font = '700 196px ' + HAN;
    ctx.textBaseline = 'middle';
    ctx.fillText(v.dmChar || '八', cx, cy + 6);
    ctx.restore();
    ctx.fillStyle = rgba(PAPER, 0.55);
    ctx.font = '600 16px ' + SANS;
    ctx.textBaseline = 'alphabetic';
    spaced(ctx, 'DAY MASTER', cx, cy + 150, 6, 'center');
    seal(ctx, cx + R * 0.78, cy + R * 0.74, 132, v.weather);

    // Pillar strip
    const stripY = cy + R + 96;
    pillarStrip(ctx, cx, stripY, isYear
      ? [{ label: '流年 FLOW YEAR', chars: v.flowYearChars }, { label: 'YOUR DAY', chars: v.dayChars }]
      : [{ label: 'TODAY', chars: v.todayChars }, { label: 'YOUR DAY', chars: v.dayChars }]);

    // Verdict block, fitted between the strip and the footer.
    const top = stripY + 120;
    const bottom = h - 250;
    const maxW = w - 220;
    let layout = null;
    for (let s = 1; s >= 0.6; s -= 0.05) {
      const hookSize = Math.round(84 * s);
      ctx.font = '700 ' + hookSize + 'px ' + DISPLAY;
      const hook = wrapLines(ctx, v.hook, maxW);
      const hookLh = Math.round(hookSize * (cjk ? 1.3 : 1.12));
      const bodySize = Math.round(32 * Math.max(s, 0.8));
      ctx.font = '400 ' + bodySize + 'px ' + SANS;
      const body = wrapLines(ctx, v.body, maxW - 60);
      const bodyLh = Math.round(bodySize * 1.45);
      const dareSize = Math.round(32 * Math.max(s, 0.8));
      ctx.font = '700 ' + dareSize + 'px ' + SANS;
      const dare = wrapLines(ctx, '「 ' + v.dare + ' 」', maxW - 60);
      const dareLh = Math.round(dareSize * 1.4);
      const total = 36 + hook.length * hookLh + 64 + body.length * bodyLh + 40 + dare.length * dareLh;
      layout = { hookSize, hook, hookLh, bodySize, body, bodyLh, dareSize, dare, dareLh, total };
      if (total <= bottom - top && hook.length <= 4) break;
    }
    let y = top + Math.max(0, (bottom - top - layout.total) / 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = accent;
    ctx.font = '700 18px ' + SANS;
    spaced(ctx, (v.weatherLabel || v.weather || '').toUpperCase() + '  ·  ' + (TONE_LABEL[v.tone] || 'Oracle').toUpperCase(), cx, y, 6, 'center');
    y += 36 + layout.hookSize * 0.9;
    ctx.fillStyle = PAPER;
    ctx.font = '700 ' + layout.hookSize + 'px ' + DISPLAY;
    layout.hook.forEach(l => { ctx.fillText(l, cx, y); y += layout.hookLh; });
    y += 4 - layout.hookLh * 0.1;
    ctx.fillStyle = rgba(GOLD, 0.6);
    ctx.fillRect(cx - 120, y, 100, 1.5);
    ctx.fillRect(cx + 20, y, 100, 1.5);
    ctx.save();
    ctx.translate(cx, y + 1);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = GOLD;
    ctx.fillRect(-6, -6, 12, 12);
    ctx.restore();
    y += 60;
    ctx.fillStyle = rgba(PAPER, 0.74);
    ctx.font = '400 ' + layout.bodySize + 'px ' + SANS;
    layout.body.forEach(l => { ctx.fillText(l, cx, y); y += layout.bodyLh; });
    y += 30;
    ctx.fillStyle = accent;
    ctx.font = '700 ' + layout.dareSize + 'px ' + SANS;
    layout.dare.forEach(l => { ctx.fillText(l, cx, y); y += layout.dareLh; });

    // Footer
    const fy = h - 170;
    if (v.luckPhase && isYear) {
      ctx.fillStyle = rgba(PAPER, 0.45);
      ctx.font = '500 20px ' + SANS;
      ctx.fillText('大运 · ' + v.luckPhase, cx, fy - 44);
    }
    ctx.fillStyle = GOLD;
    ctx.font = '700 40px ' + DISPLAY;
    ctx.fillText('wobazi.com', cx, fy);
    ctx.fillStyle = rgba(PAPER, 0.55);
    ctx.font = '600 17px ' + SANS;
    spaced(ctx, 'PLOT YOUR CHART  ·  BY MASTER ALICE', cx, fy + 44, 4, 'center');
    ctx.fillStyle = rgba(PAPER, 0.3);
    ctx.font = '400 17px ' + SANS;
    ctx.fillText('Terrain, not a prison sentence.', cx, fy + 78);
    ctx.restore();
  }

  function fontSample(v) {
    return [v.hook, v.body, v.dare, v.dmChar, v.name, v.todayChars, v.dayChars, v.flowYearChars,
      BRANCH_CHARS.join(''), '巅峰开运冲暗助流年大运八「」'].join('');
  }

  function ensureFonts(v) {
    if (!document.fonts || !document.fonts.load || !v) return Promise.resolve();
    const text = fontSample(v);
    return Promise.all([
      '700 80px Outfit', '500 32px Outfit', '400 32px Outfit', '600 18px Outfit',
      '700 80px "Noto Sans SC"', '700 32px "Noto Sans Thai"'
    ].map(f => document.fonts.load(f, text).catch(() => null)).concat(logoReady));
  }

  function canvasFor(v, combo) {
    const c = document.createElement('canvas');
    const frames = combo ? 2 : 1;
    c.width = 1080;
    c.height = 1920 * frames;
    const ctx = c.getContext('2d');
    drawCard(ctx, 1080, 1920, v, 0);
    if (combo && state.comboYear) drawCard(ctx, 1080, 1920, state.comboYear, 1920);
    return c;
  }

  function drawPreview() {
    const host = document.getElementById('viral-preview');
    if (!host || !state.verdict) return;
    const c = canvasFor(state.verdict, false);
    host.innerHTML = '';
    c.className = 'viral-preview-canvas';
    host.appendChild(c);
  }

  function renderFile() {
    return new Promise(resolve => {
      const c = canvasFor(state.verdict, state.kind === 'both');
      c.toBlob(blob => {
        resolve(blob ? new File([blob], 'wobazi-verdict.png', { type: 'image/png' }) : null);
      }, 'image/png');
    });
  }

  /* Pre-rendered after each rebuild, so share/copy run inside the tap's user activation. */
  async function pngFile() {
    if (state.file) return state.file;
    await ensureFonts(state.verdict);
    if (state.comboYear) await ensureFonts(state.comboYear);
    return renderFile();
  }

  function track(dest) {
    try {
      navigator.sendBeacon('/api/share-event', new Blob([JSON.stringify({
        kind: state.kind, tone: state.tone, dest: dest || '', locale: state.lang
      })], { type: 'application/json' }));
    } catch (e) {}
  }

  function toast(msg) {
    const t = document.getElementById('viral-toast');
    if (!t) return;
    const lang = window.WoBaziI18n ? WoBaziI18n.get() : 'en';
    t.textContent = (lang !== 'en' && WoBaziI18n.lookup(msg, lang)) || msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2200);
  }

  async function nativeShare() {
    const url = shareUrl();
    const text = document.getElementById('viral-caption')?.value || WobaziVerdict.caption(state.verdict, url);
    const file = await pngFile();
    track('native');
    if (navigator.share) {
      try {
        if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ title: 'Wobazi', text, files: [file] });
        } else {
          await navigator.share({ title: 'Wobazi', text, url });
        }
        toast('Posted? Tag a friend.');
        return;
      } catch (e) { if (e && e.name === 'AbortError') return; }
    }
    toast(await copyText(text) ? 'Caption copied.' : 'Could not copy the caption.');
  }

  async function downloadPng(msg) {
    const file = await pngFile();
    if (!file) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = file.name;
    a.click();
    if (!msg) track('download');
    toast(msg || 'Image saved.');
  }

  async function copyImage() {
    const file = await pngFile();
    if (!file || !navigator.clipboard || !window.ClipboardItem) {
      toast('Copy image is not supported here.');
      return;
    }
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': file })]);
      track('copy-image');
      toast('Image copied.');
    } catch (e) { toast('Could not copy image.'); }
  }

  /* Clipboard API first; fall back to execCommand where it is blocked (in-app browsers, unfocused pages). */
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (_) {}
      ta.remove();
      return ok;
    }
  }

  async function copyLink() {
    if (await copyText(shareUrl())) {
      track('copy-link');
      toast('Link copied.');
    } else {
      toast('Could not copy the link.');
    }
  }

  function social(dest) {
    const url = encodeURIComponent(shareUrl());
    const text = encodeURIComponent(document.getElementById('viral-caption')?.value || '');
    const map = {
      x: 'https://twitter.com/intent/tweet?text=' + text + '&url=' + url,
      facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + url,
      line: 'https://social-plugins.line.me/lineit/share?url=' + url + '&text=' + text,
      whatsapp: 'https://wa.me/?text=' + text + '%20' + url
    };
    track(dest);
    if (dest === 'instagram') return shareInstagram();
    if (map[dest]) window.open(map[dest], '_blank', 'noopener');
  }

  /* Instagram has no web share link. On phones the system share sheet hands the card
     straight to Instagram (Stories or Feed); on desktop we save the card and open Instagram. */
  function shareInstagram() {
    const file = state.file;
    const phone = window.matchMedia && matchMedia('(pointer: coarse)').matches;
    if (phone && file && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file] }).catch(() => {});
      return;
    }
    window.open('https://www.instagram.com/', '_blank', 'noopener');
    downloadPng('Card saved. Upload it on Instagram.');
  }

  function openViralShare(kind) {
    if (!(window._shareData && _shareData.pillars)) return;
    state.kind = kind === 'year' ? 'year' : (kind === 'both' ? 'both' : 'today');
    if (typeof window.track === 'function') window.track('share', { method: 'verdict', content_type: state.kind });
    state.tone = 'oracle';
    const overlay = document.getElementById('viral-overlay');
    overlay.classList.remove('hide');
    const fab = document.getElementById('oracle-fab');
    if (fab) fab.classList.add('hide');
    document.querySelectorAll('[data-viral-kind]').forEach(b => b.classList.toggle('is-on', b.getAttribute('data-viral-kind') === state.kind));
    document.querySelectorAll('[data-viral-tone]').forEach(b => b.classList.toggle('is-on', b.getAttribute('data-viral-tone') === state.tone));
    rebuild();
  }

  function closeViralShare() {
    document.getElementById('viral-overlay')?.classList.add('hide');
    const onResults = document.querySelector('#results.screen.active');
    const fab = document.getElementById('oracle-fab');
    if (onResults && fab) fab.classList.remove('hide');
  }

  window.openViralShare = openViralShare;
  window.closeViralShare = closeViralShare;
  window.showShareCard = function () { openViralShare('today'); };

  document.addEventListener('click', (e) => {
    const kind = e.target.closest('[data-viral-kind]');
    if (kind) {
      state.kind = kind.getAttribute('data-viral-kind');
      document.querySelectorAll('[data-viral-kind]').forEach(b => b.classList.toggle('is-on', b === kind));
      rebuild();
    }
    const tone = e.target.closest('[data-viral-tone]');
    if (tone) {
      state.tone = tone.getAttribute('data-viral-tone');
      document.querySelectorAll('[data-viral-tone]').forEach(b => b.classList.toggle('is-on', b === tone));
      rebuild();
    }
    if (e.target.closest('[data-viral-native]')) nativeShare();
    if (e.target.closest('[data-viral-download]')) downloadPng();
    if (e.target.closest('[data-viral-copy-img]')) copyImage();
    if (e.target.closest('[data-viral-copy-link]')) copyLink();
    const soc = e.target.closest('[data-viral-social]');
    if (soc) social(soc.getAttribute('data-viral-social'));
  });
})();
