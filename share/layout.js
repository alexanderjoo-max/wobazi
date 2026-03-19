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
    fontSize: s ? 15 : 12,
    fontWeight: 600,
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

// ── Fortune bar with visual indicator ──
function fortuneBar(label, value, color, s) {
  const barW = s ? 320 : 240;
  const filled = Math.round((value / 100) * barW);
  const fs = s ? 18 : 15;
  const valFs = s ? 22 : 18;

  return el('div', {
    alignItems: 'center',
    gap: s ? '16px' : '12px',
    width: '100%',
  },
    // Label
    el('span', {
      fontSize: fs,
      fontWeight: 600,
      color: COLORS.muted,
      width: s ? '80px' : '64px',
      textAlign: 'right',
    }, label),
    // Bar track
    el('div', {
      width: barW + 'px',
      height: s ? '14px' : '10px',
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '99px',
      overflow: 'hidden',
    },
      el('div', {
        width: filled + 'px',
        height: '100%',
        background: color,
        borderRadius: '99px',
      }),
    ),
    // Value
    el('span', {
      fontSize: valFs,
      fontWeight: 700,
      color: COLORS.white,
      width: s ? '44px' : '36px',
    }, String(value)),
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
      padding: '36px 40px',
      background: 'rgba(255,255,255,0.015)',
      gap: '18px',
    },
      // Header
      el('div', { flexDirection: 'column', alignItems: 'center', gap: '4px' },
        el('span', {
          fontSize: 22, fontWeight: 700, color: COLORS.gold,
          letterSpacing: '0.12em', textTransform: 'uppercase',
        }, `${name || 'YOUR'}'S DESTINY`),
        el('span', {
          fontSize: 14, color: COLORS.muted, letterSpacing: '0.15em', textTransform: 'uppercase',
        }, date || ''),
      ),

      divider(false),

      // Chinese Name (prominent)
      chineseNameCharacters ? el('div', {
        flexDirection: 'column', alignItems: 'center', gap: '6px',
      },
        el('span', {
          fontSize: 64, fontWeight: 700, color: COLORS.goldBright,
          letterSpacing: '0.15em',
          fontFamily: '"Noto Sans SC", sans-serif',
        }, chineseNameCharacters),
        pinyinName ? el('span', {
          fontSize: 16, fontWeight: 500, color: COLORS.muted,
          letterSpacing: '0.08em',
        }, pinyinName) : null,
        englishMeaning ? el('span', {
          fontSize: 13, color: COLORS.mutedLight, letterSpacing: '0.06em',
        }, englishMeaning) : null,
      ) : null,

      divider(false),

      // Archetype (largest text)
      el('div', { flexDirection: 'column', alignItems: 'center', gap: '6px' },
        sectionLabel('DESTINY ARCHETYPE', false),
        el('span', {
          fontSize: 40, fontWeight: 700, color: COLORS.white,
          textAlign: 'center', letterSpacing: '0.04em',
        }, archetype || ''),
        elementAnimal ? el('span', {
          fontSize: 15, color: COLORS.muted, letterSpacing: '0.08em',
        }, elementAnimal) : null,
      ),

      divider(false),

      // Oracle message box
      oracle ? el('div', {
        flexDirection: 'column', alignItems: 'center', gap: '8px',
        padding: '16px 28px',
        background: COLORS.oracleBox,
        border: `1px solid ${COLORS.oracleBorder}`,
        borderRadius: '16px',
        maxWidth: '700px',
      },
        sectionLabel('ORACLE', false),
        el('span', {
          fontSize: 17, fontWeight: 400, color: 'rgba(240,240,255,0.7)',
          textAlign: 'center', lineHeight: '1.5', fontStyle: 'italic',
        }, `"${oracle}"`),
      ) : null,

      // Fortune bars
      el('div', {
        flexDirection: 'column', gap: '8px', width: '100%',
        alignItems: 'center', maxWidth: '500px',
      },
        sectionLabel("TODAY'S FORTUNE", false),
        el('div', { height: '6px' }),
        fortuneBar('Love', love, '#f43f5e', false),
        fortuneBar('Career', career, '#8b5cf6', false),
        fortuneBar('Health', health, '#22c55e', false),
        fortuneBar('Wealth', wealth, '#f59e0b', false),
      ),

      // Footer
      el('div', { flexDirection: 'column', alignItems: 'center', gap: '3px', marginTop: '4px' },
        el('span', {
          fontSize: 14, color: COLORS.gold, letterSpacing: '0.15em',
          textTransform: 'uppercase', fontWeight: 600,
        }, 'Discover Your Chinese Destiny'),
        el('span', { fontSize: 18, fontWeight: 700, color: COLORS.gold }, 'wobazi.com'),
        el('span', { fontSize: 11, color: COLORS.mutedLight }, 'Generated by WoBazi'),
      ),
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
      gap: '32px',
    },
      // Header
      el('div', { flexDirection: 'column', alignItems: 'center', gap: '8px' },
        el('span', {
          fontSize: 28, fontWeight: 700, color: COLORS.gold,
          letterSpacing: '0.12em', textTransform: 'uppercase',
        }, `${name || 'YOUR'}'S DESTINY`),
        el('span', {
          fontSize: 18, color: COLORS.muted, letterSpacing: '0.15em', textTransform: 'uppercase',
        }, date || ''),
      ),

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
        flexDirection: 'column', alignItems: 'center', gap: '12px',
        padding: '24px 36px',
        background: COLORS.oracleBox,
        border: `1px solid ${COLORS.oracleBorder}`,
        borderRadius: '20px',
        maxWidth: '840px',
      },
        sectionLabel('ORACLE MESSAGE', true),
        el('span', {
          fontSize: 24, fontWeight: 400, color: 'rgba(240,240,255,0.7)',
          textAlign: 'center', lineHeight: '1.6', fontStyle: 'italic',
        }, `"${oracle}"`),
      ) : null,

      // Fortune bars
      el('div', {
        flexDirection: 'column', gap: '12px', width: '100%',
        alignItems: 'center', maxWidth: '620px',
      },
        sectionLabel("TODAY'S FORTUNE", true),
        el('div', { height: '4px' }),
        fortuneBar('Love', love, '#f43f5e', true),
        fortuneBar('Career', career, '#8b5cf6', true),
        fortuneBar('Health', health, '#22c55e', true),
        fortuneBar('Wealth', wealth, '#f59e0b', true),
      ),

      // Footer
      el('div', { flexDirection: 'column', alignItems: 'center', gap: '6px', marginTop: '8px' },
        el('span', {
          fontSize: 17, color: COLORS.gold, letterSpacing: '0.15em',
          textTransform: 'uppercase', fontWeight: 600,
        }, 'Discover Your Chinese Destiny'),
        el('span', { fontSize: 24, fontWeight: 700, color: COLORS.gold }, 'wobazi.com'),
        el('span', { fontSize: 13, color: COLORS.mutedLight }, 'Generated by WoBazi'),
      ),
    ),
  );
}

module.exports = { buildSquareLayout, buildStoryLayout };
