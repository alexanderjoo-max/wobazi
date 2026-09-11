/* Viral Today / Year share sheet */
(function () {
  const EL_HEX = { Wood: '#22c55e', Fire: '#ef4444', Earth: '#f59e0b', Metal: '#c0c8d4', Water: '#3b82f6' };
  const YEAR_ANIMAL_EN = { Rat:'Rat', Ox:'Ox', Tiger:'Tiger', Rabbit:'Rabbit', Dragon:'Dragon', Snake:'Snake', Horse:'Horse', Goat:'Goat', Monkey:'Monkey', Rooster:'Rooster', Dog:'Dog', Pig:'Pig' };

  let state = { kind: 'today', tone: 'oracle', lang: 'en', verdict: null, comboYear: null };

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
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawPreview);
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

  function drawCard(ctx, w, h, v, y0) {
    const accent = EL_HEX[v.accentEl] || '#f0c040';
    y0 = y0 || 0;
    const pad = Math.round(w * 0.08);
    ctx.fillStyle = '#07030f';
    ctx.fillRect(0, y0, w, h);
    const g = ctx.createLinearGradient(0, y0, w * 0.2, y0 + h * 0.55);
    g.addColorStop(0, '#1a1028');
    g.addColorStop(0.45, '#0c0814');
    g.addColorStop(1, '#07030f');
    ctx.fillStyle = g;
    ctx.fillRect(0, y0, w, h);
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.14;
    ctx.beginPath();
    ctx.arc(w * 0.92, y0 + h * 0.08, w * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    let y = y0 + Math.round(h * 0.055);
    ctx.fillStyle = '#f0c040';
    ctx.font = '700 26px Outfit, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('WOBAZI ✦', pad, y);
    ctx.fillStyle = 'rgba(240,240,255,0.42)';
    ctx.font = '600 20px Outfit, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText((v.kind === 'year' ? (v.yearLabel || 'YEAR') : 'TODAY').toUpperCase(), w - pad, y);
    ctx.textAlign = 'left';

    y += Math.round(h * 0.09);
    const glyph = Math.round(h * 0.13);
    ctx.fillStyle = accent;
    ctx.font = '700 ' + glyph + 'px "Noto Serif SC", "Noto Sans SC", serif';
    ctx.fillText(v.dmChar || '八', pad, y + glyph * 0.82);
    const metaX = pad + Math.round(glyph * 1.15);
    ctx.fillStyle = 'rgba(240,240,255,0.45)';
    ctx.font = '600 18px Outfit, sans-serif';
    ctx.fillText('DAY MASTER', metaX, y + glyph * 0.28);
    ctx.fillStyle = '#f0f0ff';
    ctx.font = '700 40px "Noto Serif SC", "Noto Sans SC", serif';
    const strip = v.kind === 'year' ? (v.flowYearChars || v.yearChars) : (v.todayChars || v.dayChars);
    ctx.fillText(strip || '', metaX, y + glyph * 0.55);
    if (v.name) {
      ctx.fillStyle = 'rgba(240,240,255,0.45)';
      ctx.font = '500 22px Outfit, sans-serif';
      ctx.fillText(v.name, metaX, y + glyph * 0.74);
    }

    y += glyph + Math.round(h * 0.045);
    const weather = (v.weatherLabel || v.weather || '').toUpperCase();
    ctx.font = '700 18px Outfit, sans-serif';
    const ww = ctx.measureText(weather).width + 32;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.strokeRect(pad, y, ww, 40);
    ctx.fillStyle = accent;
    ctx.fillText(weather, pad + 16, y + 27);
    y += 72;

    ctx.fillStyle = '#fff8e8';
    ctx.font = '700 48px Outfit, "Noto Serif SC", sans-serif';
    y = wrapText(ctx, v.hook, pad, y, w - pad * 2, 56);
    y += 22;
    ctx.fillStyle = '#f0c040';
    ctx.globalAlpha = 0.7;
    ctx.fillRect(pad, y, 72, 3);
    ctx.globalAlpha = 1;
    y += 36;
    ctx.fillStyle = 'rgba(240,240,255,0.8)';
    ctx.font = '400 28px Outfit, sans-serif';
    y = wrapText(ctx, v.body, pad, y, w - pad * 2, 38);
    y += 28;
    ctx.fillStyle = accent;
    ctx.font = '700 28px Outfit, sans-serif';
    wrapText(ctx, v.dare, pad, y, w - pad * 2, 38);

    const foot = y0 + h - Math.round(h * 0.07);
    if (v.luckPhase && v.kind === 'year') {
      ctx.fillStyle = 'rgba(240,240,255,0.4)';
      ctx.font = '500 20px Outfit, sans-serif';
      ctx.fillText('大运 · ' + v.luckPhase, pad, foot - 48);
    }
    ctx.fillStyle = '#f0c040';
    ctx.font = '700 22px Outfit, sans-serif';
    ctx.fillText('wobazi.com  ·  Plot your chart', pad, foot);
    ctx.fillStyle = 'rgba(240,240,255,0.32)';
    ctx.font = '400 16px Outfit, sans-serif';
    ctx.fillText('Terrain, not a prison sentence.', pad, foot + 28);
  }

  function wrapText(ctx, text, x, y, maxW, lh) {
    const src = String(text || '');
    let yy = y;
    const isCJK = /[\u0E00-\u0E7F\u4e00-\u9fff]/.test(src);
    if (isCJK) {
      let buf = '';
      for (const ch of src) {
        const test = buf + ch;
        if (ctx.measureText(test).width > maxW && buf) {
          ctx.fillText(buf, x, yy);
          buf = ch;
          yy += lh;
        } else buf = test;
      }
      if (buf) { ctx.fillText(buf, x, yy); yy += lh; }
      return yy;
    }
    let line = '';
    for (const word of src.split(/\s+/)) {
      const test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line, x, yy);
        line = word;
        yy += lh;
      } else line = test;
    }
    if (line) { ctx.fillText(line, x, yy); yy += lh; }
    return yy;
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

  function pngFile() {
    return new Promise(resolve => {
      const c = canvasFor(state.verdict, state.kind === 'both');
      c.toBlob(blob => {
        resolve(blob ? new File([blob], 'wobazi-verdict.png', { type: 'image/png' }) : null);
      }, 'image/png');
    });
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
    t.textContent = msg;
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
    await navigator.clipboard.writeText(text);
    toast('Caption copied.');
  }

  async function downloadPng() {
    const file = await pngFile();
    if (!file) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = file.name;
    a.click();
    track('download');
    toast('PNG saved.');
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

  async function copyLink() {
    const url = shareUrl();
    await navigator.clipboard.writeText(url);
    track('copy-link');
    toast('Link copied.');
  }

  function social(dest) {
    const url = encodeURIComponent(shareUrl());
    const text = encodeURIComponent(document.getElementById('viral-caption')?.value || '');
    const map = {
      x: 'https://twitter.com/intent/tweet?text=' + text + '&url=' + url,
      facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + url,
      line: 'https://social-plugins.line.me/lineit/share?url=' + url,
      whatsapp: 'https://wa.me/?text=' + text + '%20' + url
    };
    track(dest);
    if (dest === 'ig') {
      toast('Save the PNG, then add it to Instagram Stories.');
      downloadPng();
      return;
    }
    if (map[dest]) window.open(map[dest], '_blank', 'noopener');
  }

  function openViralShare(kind) {
    if (!(window._shareData && _shareData.pillars)) return;
    state.kind = kind === 'year' ? 'year' : (kind === 'both' ? 'both' : 'today');
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
