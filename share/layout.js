/**
 * share/layout.js — Dramatic mystical share image layouts
 *
 * Builds Satori-compatible object trees for social share images.
 * Two formats: 1080x1080 (square) and 1080x1920 (story).
 */

const COLORS = {
  bg1: '#07030f',
  bg2: '#1a0a3d',
  bg3: '#0d0520',
  gold: '#f0c040',
  goldBright: '#ffd666',
  goldDim: 'rgba(240,192,64,0.12)',
  goldBorder: 'rgba(240,192,64,0.25)',
  goldGlow: 'rgba(240,192,64,0.08)',
  white: '#f0f0ff',
  muted: 'rgba(240,240,255,0.5)',
  mutedLight: 'rgba(240,240,255,0.3)',
  oracleBox: 'rgba(240,192,64,0.06)',
  oracleBorder: 'rgba(240,192,64,0.18)',
  cellBg: 'rgba(255,255,255,0.04)',
  cellBorder: 'rgba(255,255,255,0.08)',
};

// Fortune score colors
const FORTUNE_COLORS = {
  love: '#f43f5e',
  career: '#8b5cf6',
  health: '#22c55e',
  wealth: '#f59e0b',
};

// ── Satori element helper ──
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

// ── Section label ──
function sectionLabel(text, s) {
  return el('span', {
    fontSize: s ? 16 : 13,
    fontWeight: 700,
    color: COLORS.gold,
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
  }, text);
}

// ── Gold divider ──
function divider(s) {
  return el('div', {
    width: s ? '80px' : '60px',
    height: '2px',
    background: COLORS.gold,
    opacity: 0.4,
    margin: s ? '4px 0' : '2px 0',
  });
}

// ── Fortune cell (2x2 grid item) ──
function fortuneCell(emoji, value, label, color, s) {
  return el('div', {
    alignItems: 'center',
    gap: s ? '12px' : '8px',
    padding: s ? '18px 24px' : '12px 16px',
    background: COLORS.cellBg,
    border: `1px solid ${COLORS.cellBorder}`,
    borderRadius: s ? '16px' : '12px',
    flex: '1',
  },
    el('span', { fontSize: s ? 28 : 22 }, emoji),
    el('span', {
      fontSize: s ? 32 : 26,
      fontWeight: 800,
      color: color,
    }, String(value)),
    el('span', {
      fontSize: s ? 16 : 13,
      fontWeight: 500,
      color: COLORS.muted,
    }, label),
  );
}

// ── 2x2 Fortune grid ──
function fortuneGrid(love, career, health, wealth, s) {
  const gap = s ? '16px' : '10px';
  return el('div', {
    flexDirection: 'column', gap, width: '100%', maxWidth: s ? '700px' : '560px',
  },
    el('div', { gap, width: '100%' },
      fortuneCell('❤️', love, 'Love', FORTUNE_COLORS.love, s),
      fortuneCell('💼', career, 'Career', FORTUNE_COLORS.career, s),
    ),
    el('div', { gap, width: '100%' },
      fortuneCell('🌿', health, 'Health', FORTUNE_COLORS.health, s),
      fortuneCell('💰', wealth, 'Wealth', FORTUNE_COLORS.wealth, s),
    ),
  );
}

// ── WoBazi logo footer (text-based since we can't embed SVG easily in Satori) ──
function logoFooter(s) {
  return el('div', { alignItems: 'baseline', gap: s ? '6px' : '4px', marginTop: s ? '8px' : '4px' },
    // 八字 characters
    el('span', {
      fontSize: s ? 26 : 20,
      fontWeight: 700,
      color: '#e8753a', // orange like the logo
      fontFamily: '"Noto Sans SC", sans-serif',
    }, '八字'),
    // WoBaZi text
    el('span', {
      fontSize: s ? 26 : 20,
      fontWeight: 800,
      color: COLORS.white,
      letterSpacing: '0.02em',
    }, 'WoBaZi'),
    // .com
    el('span', {
      fontSize: s ? 22 : 17,
      fontWeight: 600,
      color: COLORS.gold,
      marginLeft: s ? '4px' : '2px',
    }, '.com'),
  );
}

/**
 * Build 1080x1080 square layout.
 */
function buildSquareLayout(data) {
  const {
    name, date, chineseNameCharacters, pinyinName, englishMeaning,
    archetype, elementAnimal, oracle, love, career, health, wealth,
  } = data;

  return el('div', {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1080px',
    height: '1080px',
    background: `linear-gradient(170deg, ${COLORS.bg2} 0%, ${COLORS.bg1} 45%, ${COLORS.bg3} 100%)`,
    fontFamily: '"Space Grotesk", "Noto Sans SC", sans-serif',
    padding: '48px',
  },
    // ── Card ──
    el('div', {
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      border: `1px solid ${COLORS.goldBorder}`,
      borderRadius: '28px',
      padding: '32px 40px',
      background: 'rgba(255,255,255,0.015)',
      gap: '14px',
    },
      // Date at top
      el('span', {
        fontSize: 13, color: COLORS.muted, letterSpacing: '0.15em', textTransform: 'uppercase',
      }, date || ''),

      // Header
      el('span', {
        fontSize: 20, fontWeight: 700, color: COLORS.gold,
        letterSpacing: '0.12em', textTransform: 'uppercase',
      }, `${name || 'YOUR'}'S DESTINY`),

      // Chinese Name (prominent)
      chineseNameCharacters ? el('div', {
        flexDirection: 'column', alignItems: 'center', gap: '4px',
      },
        el('span', {
          fontSize: 58, fontWeight: 700, color: COLORS.goldBright,
          letterSpacing: '0.15em',
          fontFamily: '"Noto Sans SC", sans-serif',
        }, chineseNameCharacters),
        pinyinName ? el('span', {
          fontSize: 15, fontWeight: 500, color: COLORS.muted,
          letterSpacing: '0.08em',
        }, pinyinName) : null,
        englishMeaning ? el('span', {
          fontSize: 12, color: COLORS.mutedLight, letterSpacing: '0.06em',
        }, englishMeaning) : null,
      ) : null,

      // Archetype
      el('div', { flexDirection: 'column', alignItems: 'center', gap: '4px' },
        sectionLabel('DESTINY ARCHETYPE', false),
        el('span', {
          fontSize: 36, fontWeight: 700, color: COLORS.white,
          textAlign: 'center', letterSpacing: '0.04em',
        }, archetype || ''),
        elementAnimal ? el('span', {
          fontSize: 14, color: COLORS.muted, letterSpacing: '0.08em',
        }, elementAnimal) : null,
      ),

      // Oracle message box
      oracle ? el('div', {
        flexDirection: 'column', alignItems: 'center', gap: '6px',
        padding: '14px 24px',
        background: COLORS.oracleBox,
        border: `1px solid ${COLORS.oracleBorder}`,
        borderRadius: '14px',
        maxWidth: '700px',
        width: '100%',
      },
        sectionLabel('ORACLE', false),
        el('span', {
          fontSize: 16, fontWeight: 500, color: 'rgba(240,240,255,0.85)',
          textAlign: 'center', lineHeight: '1.5',
        }, `\u201C${oracle}\u201D`),
      ) : null,

      // Fortune grid (2x2 with emojis)
      el('div', {
        flexDirection: 'column', gap: '6px', width: '100%', alignItems: 'center',
      },
        sectionLabel("TODAY'S FORTUNE", false),
        el('div', { height: '2px' }),
        fortuneGrid(love, career, health, wealth, false),
      ),

      // Footer logo
      logoFooter(false),
    ),
  );
}

/**
 * Build 1080x1920 story layout.
 */
function buildStoryLayout(data) {
  const {
    name, date, chineseNameCharacters, pinyinName, englishMeaning,
    archetype, elementAnimal, oracle, love, career, health, wealth,
  } = data;

  return el('div', {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1080px',
    height: '1920px',
    background: `linear-gradient(180deg, ${COLORS.bg2} 0%, ${COLORS.bg1} 50%, ${COLORS.bg3} 100%)`,
    fontFamily: '"Space Grotesk", "Noto Sans SC", sans-serif',
    padding: '72px 56px',
  },
    el('div', {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      flex: '1',
      border: `1px solid ${COLORS.goldBorder}`,
      borderRadius: '36px',
      padding: '56px 48px',
      background: 'rgba(255,255,255,0.015)',
      gap: '28px',
    },
      // Date at top
      el('span', {
        fontSize: 18, color: COLORS.muted, letterSpacing: '0.15em', textTransform: 'uppercase',
      }, date || ''),

      // Header
      el('span', {
        fontSize: 28, fontWeight: 700, color: COLORS.gold,
        letterSpacing: '0.12em', textTransform: 'uppercase',
      }, `${name || 'YOUR'}'S DESTINY`),

      divider(true),

      // Chinese Name (very prominent in story)
      chineseNameCharacters ? el('div', {
        flexDirection: 'column', alignItems: 'center', gap: '10px',
      },
        el('span', {
          fontSize: 96, fontWeight: 700, color: COLORS.goldBright,
          letterSpacing: '0.2em',
          fontFamily: '"Noto Sans SC", sans-serif',
        }, chineseNameCharacters),
        pinyinName ? el('span', {
          fontSize: 22, fontWeight: 500, color: COLORS.muted,
          letterSpacing: '0.1em',
        }, pinyinName) : null,
        englishMeaning ? el('span', {
          fontSize: 16, color: COLORS.mutedLight, letterSpacing: '0.06em',
        }, englishMeaning) : null,
      ) : null,

      divider(true),

      // Archetype
      el('div', { flexDirection: 'column', alignItems: 'center', gap: '10px' },
        sectionLabel('DESTINY ARCHETYPE', true),
        el('span', {
          fontSize: 52, fontWeight: 700, color: COLORS.white,
          textAlign: 'center', letterSpacing: '0.04em',
        }, archetype || ''),
        elementAnimal ? el('span', {
          fontSize: 20, color: COLORS.muted, letterSpacing: '0.1em',
        }, elementAnimal) : null,
      ),

      divider(true),

      // Oracle box
      oracle ? el('div', {
        flexDirection: 'column', alignItems: 'center', gap: '10px',
        padding: '24px 36px',
        background: COLORS.oracleBox,
        border: `1px solid ${COLORS.oracleBorder}`,
        borderRadius: '20px',
        maxWidth: '840px',
        width: '100%',
      },
        sectionLabel('ORACLE', true),
        el('span', {
          fontSize: 24, fontWeight: 500, color: 'rgba(240,240,255,0.85)',
          textAlign: 'center', lineHeight: '1.6',
        }, `\u201C${oracle}\u201D`),
      ) : null,

      // Fortune grid (2x2 with emojis)
      el('div', {
        flexDirection: 'column', gap: '10px', width: '100%', alignItems: 'center',
      },
        sectionLabel("TODAY'S FORTUNE", true),
        el('div', { height: '4px' }),
        fortuneGrid(love, career, health, wealth, true),
      ),

      // Footer logo
      logoFooter(true),
    ),
  );
}

module.exports = { buildSquareLayout, buildStoryLayout };
