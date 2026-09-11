/**
 * Satori layouts for viral Today / Year cards.
 * Story 1080×1920, OG 1200×630. Mirrors the client canvas card in app/share-viral.js:
 * luopan dial with the Day Master at its heart, a cinnabar weather seal, and the verdict.
 */
const EL_HEX = {
  Wood: '#22c55e',
  Fire: '#ef4444',
  Earth: '#f59e0b',
  Metal: '#c0c8d4',
  Water: '#3b82f6',
};
const GOLD = '#e8c26a';
const PAPER = '#f6ecd8';
const CINNABAR = '#c8412c';
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const SEAL_ZH = { Peak: ['巅', '峰'], Open: ['开', '运'], Friction: ['冲'], Hidden: ['暗', '助'] };
const TONE_LABEL = { oracle: 'ORACLE', roast: 'ROAST', power: 'POWER' };

function el(type, style, ...children) {
  const flat = children.flat().filter(Boolean);
  return {
    type,
    props: {
      style: { display: 'flex', ...style },
      children: flat.length === 1 && typeof flat[0] === 'string' ? flat[0] : flat,
    },
  };
}

function rgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/* Ring, ticks and inner disc as one SVG (no text, so resvg needs no fonts for it). */
function dialSvg(size, accent) {
  const c = size / 2;
  const R = c - 4;
  let ticks = '';
  for (let i = 0; i < 120; i++) {
    const a = ((i * 3 - 90) * Math.PI) / 180;
    const long = i % 10 === 0;
    const r2 = R - (long ? 22 : 11);
    ticks += `<line x1="${(c + R * Math.cos(a)).toFixed(1)}" y1="${(c + R * Math.sin(a)).toFixed(1)}" x2="${(c + r2 * Math.cos(a)).toFixed(1)}" y2="${(c + r2 * Math.sin(a)).toFixed(1)}" stroke="${GOLD}" stroke-opacity="${long ? 0.95 : 0.4}" stroke-width="${long ? 2.4 : 1.2}"/>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs><radialGradient id="d" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="${accent}" stop-opacity="0.22"/><stop offset="1" stop-color="#0e0718" stop-opacity="0.2"/></radialGradient></defs>
    <circle cx="${c}" cy="${c}" r="${R * 0.66}" fill="url(#d)" stroke="${GOLD}" stroke-opacity="0.55" stroke-width="1.5"/>
    <circle cx="${c}" cy="${c}" r="${R}" fill="none" stroke="${GOLD}" stroke-opacity="0.6" stroke-width="2"/>
    <circle cx="${c}" cy="${c}" r="${R - 28}" fill="none" stroke="${GOLD}" stroke-opacity="0.22" stroke-width="1"/>
    ${ticks}
  </svg>`;
  return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
}

function dial(size, accent, lit, center) {
  const c = size / 2;
  const rb = (c - 4) * 0.83;
  const box = Math.round(size * 0.1);
  const branches = BRANCHES.map((ch, i) => {
    const a = ((i * 30 - 90) * Math.PI) / 180;
    const on = ch === lit;
    return el('div', {
      position: 'absolute',
      left: c + rb * Math.cos(a) - box / 2,
      top: c + rb * Math.sin(a) - box / 2,
      width: box,
      height: box,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: box,
      background: on ? accent : 'transparent',
      boxShadow: on ? `0 0 30px ${accent}` : 'none',
      color: on ? '#0e0718' : rgba(GOLD, 0.82),
      fontFamily: 'Noto Sans SC',
      fontSize: Math.round(size * 0.053),
      fontWeight: 700,
      transform: `rotate(${i * 30}deg)`,
    }, ch);
  });
  return el('div', { position: 'relative', width: size, height: size, alignItems: 'center', justifyContent: 'center' },
    { type: 'img', props: { src: dialSvg(size, accent), width: size, height: size, style: { position: 'absolute', left: 0, top: 0 } } },
    ...branches,
    center
  );
}

function seal(size, weather) {
  const chars = SEAL_ZH[weather] || SEAL_ZH.Open;
  return el('div', {
    width: size,
    height: size,
    padding: 9,
    background: CINNABAR,
    transform: 'rotate(-7deg)',
    boxShadow: '0 10px 24px rgba(0,0,0,0.5)',
  },
    el('div', {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: `4px solid ${rgba(PAPER, 0.88)}`,
      color: PAPER,
      fontFamily: 'Noto Sans SC',
      fontWeight: 700,
      fontSize: chars.length === 1 ? Math.round(size * 0.6) : Math.round(size * 0.32),
      lineHeight: 1.05,
    }, ...chars.map(ch => el('div', {}, ch)))
  );
}

function corner(pos) {
  return el('div', {
    position: 'absolute', ...pos, width: 22, height: 22,
    background: '#0e0718', border: `2px solid ${GOLD}`, transform: 'rotate(45deg)',
    alignItems: 'center', justifyContent: 'center',
  }, el('div', { width: 8, height: 8, background: GOLD }));
}

function hookSize(text, base) {
  const n = String(text || '').length;
  const cjk = /[　-鿿]/.test(text || '');
  const len = cjk ? n * 2 : n;
  if (len > 70) return Math.round(base * 0.72);
  if (len > 48) return Math.round(base * 0.84);
  return base;
}

function storyLayout(v) {
  const accent = EL_HEX[v.accentEl] || GOLD;
  const isYear = v.kind === 'year';
  const kindLabel = isYear ? (v.yearLabel || 'THIS YEAR') : 'TODAY';
  const chars = isYear ? (v.flowYearChars || v.yearChars) : (v.todayChars || v.dayChars);
  const lit = chars ? Array.from(chars)[1] : '';
  const strips = (isYear
    ? [{ label: '流年 FLOW YEAR', chars: v.flowYearChars }, { label: 'YOUR DAY', chars: v.dayChars }]
    : [{ label: 'TODAY', chars: v.todayChars }, { label: 'YOUR DAY', chars: v.dayChars }]).filter(s => s.chars);

  const dialCenter = el('div', { flexDirection: 'column', alignItems: 'center' },
    v.name ? el('div', { fontSize: 30, color: rgba(PAPER, 0.72), marginBottom: 6 }, v.name) : null,
    el('div', {
      fontSize: 190, fontFamily: 'Noto Sans SC', fontWeight: 700, color: accent, lineHeight: 1,
      textShadow: `0 0 50px ${accent}`,
    }, v.dmChar || '八'),
    el('div', { fontSize: 16, letterSpacing: '0.38em', color: rgba(PAPER, 0.55), marginTop: 14 }, 'DAY MASTER')
  );

  return el('div', {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '110px 104px 96px',
    background: `radial-gradient(circle at 50% 30%, ${rgba(accent, 0.3)} 0%, ${rgba(accent, 0.06)} 30%, rgba(0,0,0,0) 52%), linear-gradient(180deg, #1d0f2a 0%, #0e0718 50%, #07030d 100%)`,
    color: PAPER,
    fontFamily: 'Space Grotesk',
    position: 'relative',
  },
    el('div', { position: 'absolute', left: 40, top: 40, right: 40, bottom: 40, border: `2px solid ${rgba(GOLD, 0.55)}` }),
    el('div', { position: 'absolute', left: 54, top: 54, right: 54, bottom: 54, border: `1px solid ${rgba(GOLD, 0.2)}` }),
    corner({ left: 29, top: 29 }), corner({ right: 29, top: 29 }), corner({ left: 29, bottom: 29 }), corner({ right: 29, bottom: 29 }),

    el('div', { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
      el('div', { fontSize: 24, fontWeight: 700, letterSpacing: '0.38em', color: GOLD }, 'WOBAZI'),
      el('div', { fontSize: 19, letterSpacing: '0.26em', color: rgba(PAPER, 0.55), textTransform: 'uppercase' }, kindLabel)
    ),

    el('div', { position: 'relative', marginTop: 44 },
      dial(636, accent, lit, dialCenter),
      el('div', { position: 'absolute', left: 318 + 318 * 0.78 - 66, top: 318 + 318 * 0.74 - 66 }, seal(132, v.weather))
    ),

    strips.length ? el('div', { flexDirection: 'row', marginTop: 44 },
      ...strips.map((s, i) => el('div', {
        width: 260, flexDirection: 'column', alignItems: 'center', gap: 10,
        borderLeft: i ? `1px solid ${rgba(GOLD, 0.35)}` : 'none',
      },
        el('div', { fontSize: 17, letterSpacing: '0.3em', color: rgba(PAPER, 0.5), fontFamily: 'Noto Sans SC' }, s.label),
        el('div', { fontSize: 50, fontFamily: 'Noto Sans SC', fontWeight: 700, letterSpacing: '0.2em', color: PAPER }, s.chars)
      ))
    ) : null,

    el('div', { flex: 1, width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' },
      el('div', { fontSize: 18, fontWeight: 700, letterSpacing: '0.34em', color: accent, marginBottom: 26 },
        `${(v.weatherLabel || v.weather || '').toUpperCase()}  ·  ${TONE_LABEL[v.tone] || 'ORACLE'}`),
      el('div', {
        fontSize: hookSize(v.hook, 70), fontWeight: 700, lineHeight: 1.14, color: PAPER,
        letterSpacing: '-0.02em', textAlign: 'center', justifyContent: 'center', fontFamily: 'Space Grotesk, Noto Sans SC',
      }, v.hook),
      el('div', { flexDirection: 'row', alignItems: 'center', gap: 14, margin: '34px 0 30px' },
        el('div', { width: 100, height: 1.5, background: rgba(GOLD, 0.6) }),
        el('div', { width: 12, height: 12, background: GOLD, transform: 'rotate(45deg)' }),
        el('div', { width: 100, height: 1.5, background: rgba(GOLD, 0.6) })
      ),
      el('div', { fontSize: 30, lineHeight: 1.45, color: rgba(PAPER, 0.74), textAlign: 'center', justifyContent: 'center', maxWidth: 800, fontFamily: 'Space Grotesk, Noto Sans SC' }, v.body),
      el('div', { fontSize: 30, fontWeight: 700, color: accent, marginTop: 26, textAlign: 'center', justifyContent: 'center', maxWidth: 800, fontFamily: 'Space Grotesk, Noto Sans SC' }, `「 ${v.dare} 」`)
    ),

    el('div', { flexDirection: 'column', alignItems: 'center', gap: 12 },
      v.luckPhase && isYear ? el('div', { fontSize: 20, color: rgba(PAPER, 0.45), fontFamily: 'Noto Sans SC' }, '大运 · ' + v.luckPhase) : null,
      el('div', { fontSize: 42, fontWeight: 700, color: GOLD, letterSpacing: '0.02em' }, 'wobazi.com'),
      el('div', { fontSize: 17, letterSpacing: '0.26em', color: rgba(PAPER, 0.55) }, 'PLOT YOUR CHART  ·  BY MASTER ALICE'),
      el('div', { fontSize: 17, color: rgba(PAPER, 0.3) }, 'Terrain, not a prison sentence.')
    )
  );
}

function ogLayout(v) {
  const accent = EL_HEX[v.accentEl] || GOLD;
  const isYear = v.kind === 'year';
  const chars = isYear ? (v.flowYearChars || v.yearChars) : (v.todayChars || v.dayChars);
  const lit = chars ? Array.from(chars)[1] : '';
  const center = el('div', {
    fontSize: 150, fontFamily: 'Noto Sans SC', fontWeight: 700, color: accent, lineHeight: 1,
    textShadow: `0 0 40px ${accent}`,
  }, v.dmChar || '八');
  return el('div', {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '0 64px 0 40px',
    gap: 44,
    background: `radial-gradient(circle at 24% 50%, ${rgba(accent, 0.3)} 0%, rgba(0,0,0,0) 40%), linear-gradient(135deg, #1d0f2a 0%, #0e0718 60%, #07030d 100%)`,
    color: PAPER,
    fontFamily: 'Space Grotesk',
    position: 'relative',
  },
    el('div', { position: 'absolute', left: 20, top: 20, right: 20, bottom: 20, border: `2px solid ${rgba(GOLD, 0.5)}` }),
    el('div', { position: 'relative' },
      dial(500, accent, lit, center),
      el('div', { position: 'absolute', left: 250 + 250 * 0.74 - 50, top: 250 + 250 * 0.7 - 50 }, seal(100, v.weather))
    ),
    el('div', { flexDirection: 'column', flex: 1, gap: 18 },
      el('div', { fontSize: 18, fontWeight: 700, letterSpacing: '0.32em', color: GOLD },
        `WOBAZI  ·  ${(v.weatherLabel || '').toUpperCase()}`),
      el('div', { fontSize: hookSize(v.hook, 50), fontWeight: 700, lineHeight: 1.14, color: PAPER, letterSpacing: '-0.02em', fontFamily: 'Space Grotesk, Noto Sans SC' }, v.hook),
      el('div', { fontSize: 24, fontWeight: 700, color: accent, fontFamily: 'Space Grotesk, Noto Sans SC' }, `「 ${v.dare} 」`),
      el('div', { fontSize: 20, color: rgba(PAPER, 0.55), letterSpacing: '0.2em', marginTop: 6 }, 'WOBAZI.COM  ·  PLOT YOUR CHART')
    )
  );
}

module.exports = { storyLayout, ogLayout, EL_HEX };
