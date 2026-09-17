/* ═══════════════════════════════════════
   WOBAZI — Pair share cards (Satori + Resvg)
   relationships/share-card.js

   Story 1080×1920 and OG 1200×630. Content is limited to first names, the pair
   archetype and the three sub-scores: never birth dates, times, places or pillars.
   PNGs are cached on disk next to the database; the cache is disposable.
═══════════════════════════════════════ */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const satori = require('satori').default;
const { Resvg } = require('@resvg/resvg-js');
const { loadFonts } = require('../share/render');

const BG = '#07070f';
const CARD = '#0f0f1c';
const GOLD = '#f0c040';
const TEXT = '#f0f0ff';
const MAX_CACHE_FILES = 600;

const LOGO_URI = 'data:image/png;base64,' +
  fs.readFileSync(path.join(__dirname, '..', 'app', 'assets', 'logo-horiz.png')).toString('base64');
const LOGO_RATIO = 1641 / 315;

let fonts = null;
function allFonts() {
  if (fonts) return fonts;
  fonts = loadFonts().slice();
  const thai = path.join(__dirname, 'fonts', 'NotoSansThai-Bold.ttf');
  if (fs.existsSync(thai)) fonts.push({ name: 'Noto Sans Thai', data: fs.readFileSync(thai), weight: 700, style: 'normal' });
  return fonts;
}

function rgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

function el(type, style, ...children) {
  const flat = children.flat().filter(c => c !== null && c !== undefined && c !== false);
  return {
    type,
    props: {
      style: { display: 'flex', ...style },
      children: flat.length === 1 && typeof flat[0] === 'string' ? flat[0] : flat,
    },
  };
}

function logo(h) {
  return { type: 'img', props: { src: LOGO_URI, width: Math.round(h * LOGO_RATIO), height: h } };
}

const FONT = 'Space Grotesk, Noto Sans SC, Noto Sans Thai';

function scoreRow(s, size) {
  const big = size === 'story';
  return el('div', { flexDirection: 'column', width: '100%', gap: big ? 14 : 8 },
    el('div', { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', width: '100%' },
      el('div', { fontSize: big ? 32 : 21, color: rgba(TEXT, 0.72), letterSpacing: '0.02em' }, s.label),
      el('div', { fontSize: big ? 44 : 28, fontWeight: 700, color: TEXT }, String(s.value))
    ),
    el('div', { width: '100%', height: big ? 14 : 9, borderRadius: 20, background: rgba(TEXT, 0.1) },
      el('div', { width: `${Math.max(4, s.value)}%`, height: '100%', borderRadius: 20, background: `linear-gradient(90deg, ${rgba(GOLD, 0.55)}, ${GOLD})` })
    )
  );
}

function nameSize(text, base) {
  const n = String(text || '').length;
  if (n > 34) return Math.round(base * 0.7);
  if (n > 24) return Math.round(base * 0.84);
  return base;
}

function storyLayout(d) {
  return el('div', {
    width: '100%', height: '100%', flexDirection: 'column', alignItems: 'center',
    padding: '120px 96px 110px', color: TEXT, fontFamily: FONT, position: 'relative',
    background: `radial-gradient(circle at 50% 28%, ${rgba(GOLD, 0.16)} 0%, rgba(0,0,0,0) 45%), linear-gradient(180deg, #11111f 0%, ${BG} 55%, #040409 100%)`,
  },
    el('div', { position: 'absolute', left: 40, top: 40, right: 40, bottom: 40, border: `2px solid ${rgba(GOLD, 0.45)}`, borderRadius: 36 }),
    logo(64),
    el('div', { fontSize: 24, letterSpacing: '0.32em', color: rgba(TEXT, 0.55), marginTop: 70 }, d.kicker),
    el('div', { fontSize: nameSize(d.names, 52), color: rgba(TEXT, 0.85), marginTop: 26, textAlign: 'center' }, d.names),
    el('div', { flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' },
      el('div', { fontSize: 24, letterSpacing: '0.3em', color: GOLD, fontWeight: 700 }, 'PAIR ARCHETYPE'),
      el('div', { fontSize: nameSize(d.archetype, 104), fontWeight: 700, color: TEXT, marginTop: 28, textAlign: 'center', lineHeight: 1.08, letterSpacing: '-0.02em' }, d.archetype),
      el('div', { fontSize: 34, lineHeight: 1.45, color: rgba(TEXT, 0.7), marginTop: 36, textAlign: 'center', maxWidth: 820 }, d.description)
    ),
    el('div', { flexDirection: 'column', width: '100%', gap: 40, padding: '52px 56px', background: rgba(CARD, 0.9), border: `1px solid ${rgba(TEXT, 0.1)}`, borderRadius: 32 },
      ...d.scores.map(s => scoreRow(s, 'story'))
    ),
    el('div', { flexDirection: 'column', alignItems: 'center', marginTop: 64, gap: 12 },
      el('div', { fontSize: 44, fontWeight: 700, color: GOLD }, 'wobazi.com'),
      el('div', { fontSize: 28, color: rgba(TEXT, 0.6) }, '@wo.bazi')
    )
  );
}

function ogLayout(d) {
  return el('div', {
    width: '100%', height: '100%', flexDirection: 'row', alignItems: 'center', gap: 56,
    padding: '0 72px', color: TEXT, fontFamily: FONT, position: 'relative',
    background: `radial-gradient(circle at 26% 40%, ${rgba(GOLD, 0.14)} 0%, rgba(0,0,0,0) 42%), linear-gradient(135deg, #11111f 0%, ${BG} 60%, #040409 100%)`,
  },
    el('div', { position: 'absolute', left: 20, top: 20, right: 20, bottom: 20, border: `2px solid ${rgba(GOLD, 0.4)}`, borderRadius: 24 }),
    el('div', { flexDirection: 'column', flex: 1.15, gap: 14 },
      logo(40),
      el('div', { fontSize: 17, letterSpacing: '0.3em', color: GOLD, fontWeight: 700, marginTop: 18 }, d.kicker),
      el('div', { fontSize: nameSize(d.names, 28), color: rgba(TEXT, 0.8) }, d.names),
      el('div', { fontSize: nameSize(d.archetype, 64), fontWeight: 700, lineHeight: 1.06, letterSpacing: '-0.02em' }, d.archetype),
      el('div', { fontSize: 22, lineHeight: 1.4, color: rgba(TEXT, 0.66), marginTop: 4 }, d.description),
      el('div', { fontSize: 18, color: rgba(TEXT, 0.5), marginTop: 10 }, 'wobazi.com  ·  @wo.bazi')
    ),
    el('div', { flexDirection: 'column', flex: 0.85, gap: 26, padding: '36px 34px', background: rgba(CARD, 0.9), border: `1px solid ${rgba(TEXT, 0.1)}`, borderRadius: 22 },
      ...d.scores.map(s => scoreRow(s, 'og'))
    )
  );
}

const TYPE_FALLBACK = {
  romantic: 'their partner',
  friend: 'a friend',
  family: 'a family member',
  business: 'a business partner',
};

/** Public card data. Only first names (other person's only when the owner opted in). */
function cardData({ ownerFirst, personFirst, showName, type, facts }) {
  const other = showName && personFirst ? personFirst : TYPE_FALLBACK[type] || 'someone';
  const s = facts.scores;
  return {
    kicker: 'COMPATIBILITY',
    names: `${ownerFirst || 'Someone'} & ${other}`,
    archetype: facts.archetype.name.en,
    description: facts.archetype.desc,
    scores: [
      { label: 'Element Complementarity', value: s.element.score },
      { label: 'Day Master Dynamic', value: s.dayMaster.score },
      { label: 'Branch Harmony', value: s.branches.score },
    ],
  };
}

function createCardCache(dir) {
  fs.mkdirSync(dir, { recursive: true });
  const inflight = new Map();

  function prune() {
    let files;
    try { files = fs.readdirSync(dir).filter(f => f.endsWith('.png')); } catch (e) { return; }
    if (files.length <= MAX_CACHE_FILES) return;
    files.map(f => ({ f, t: fs.statSync(path.join(dir, f)).mtimeMs }))
      .sort((a, b) => a.t - b.t)
      .slice(0, files.length - MAX_CACHE_FILES + 100)
      .forEach(x => { try { fs.unlinkSync(path.join(dir, x.f)); } catch (e) { /* gone */ } });
  }

  function purge(prefix) {
    try {
      fs.readdirSync(dir).filter(f => f.startsWith(prefix + '-')).forEach(f => {
        try { fs.unlinkSync(path.join(dir, f)); } catch (e) { /* gone */ }
      });
    } catch (e) { /* no dir */ }
  }

  /** @returns {Promise<Buffer>} */
  async function get(prefix, format, data) {
    const w = format === 'og' ? 1200 : 1080;
    const h = format === 'og' ? 630 : 1920;
    const key = crypto.createHash('sha1').update(JSON.stringify(data)).digest('hex').slice(0, 12);
    const file = path.join(dir, `${prefix}-${format}-${key}.png`);
    try { return fs.readFileSync(file); } catch (e) { /* miss */ }
    if (inflight.has(file)) return inflight.get(file);
    const job = (async () => {
      const layout = format === 'og' ? ogLayout(data) : storyLayout(data);
      const svg = await satori(layout, { width: w, height: h, fonts: allFonts() });
      const png = new Resvg(svg, { fitTo: { mode: 'width', value: w } }).render().asPng();
      // Replace older renders of this card (e.g. before the name toggle changed).
      try {
        fs.readdirSync(dir).filter(f => f.startsWith(`${prefix}-${format}-`)).forEach(f => fs.unlinkSync(path.join(dir, f)));
      } catch (e) { /* ignore */ }
      const tmp = file + '.' + process.pid + '.tmp';
      fs.writeFileSync(tmp, png);
      fs.renameSync(tmp, file);
      prune();
      return png;
    })().finally(() => inflight.delete(file));
    inflight.set(file, job);
    return job;
  }

  return { get, purge, dir };
}

module.exports = { cardData, createCardCache, storyLayout, ogLayout, TYPE_FALLBACK };
