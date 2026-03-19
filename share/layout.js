/**
 * share/layout.js — Satori layout definitions for share images
 *
 * Builds JSX-like object trees that Satori can render to SVG.
 * Two formats: 1080×1080 (square) and 1080×1920 (story).
 */

// ── Shared styles ──
const COLORS = {
  bg1: '#0f0520',
  bg2: '#1a0a3d',
  bg3: '#12082a',
  gold: '#f0c040',
  goldDim: 'rgba(240,192,64,0.15)',
  goldBorder: 'rgba(240,192,64,0.3)',
  white: '#f0f0ff',
  muted: 'rgba(240,240,255,0.5)',
  mutedLight: 'rgba(240,240,255,0.35)',
};

// ── Helper: create Satori element ──
function el(type, style, ...children) {
  const flatChildren = children.flat().filter(Boolean);
  // Satori requires display:flex on any element with multiple children
  const finalStyle = { display: 'flex', ...style };
  return {
    type,
    props: {
      style: finalStyle,
      children: flatChildren.length === 1 && typeof flatChildren[0] === 'string'
        ? flatChildren[0]
        : flatChildren,
    },
  };
}

// ── Score bar component ──
function scoreItem(initial, color, label, value, isStory) {
  const fontSize = isStory ? 28 : 24;
  const valSize = isStory ? 36 : 30;
  const badgeSize = isStory ? 44 : 36;
  return el('div', {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '48%',
    padding: isStory ? '16px 20px' : '12px 16px',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.06)',
  },
    el('div', {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: badgeSize,
      height: badgeSize,
      borderRadius: '50%',
      background: color + '22',
      color: color,
      fontSize: isStory ? 20 : 16,
      fontWeight: 700,
      flexShrink: 0,
    }, initial),
    el('div', { display: 'flex', flexDirection: 'column', flex: '1' },
      el('span', { fontSize: fontSize - 6, color: COLORS.muted, fontWeight: 500 }, label),
      el('span', { fontSize: valSize, fontWeight: 700, color: COLORS.white }, String(value)),
    ),
  );
}

// ── Divider line ──
function divider(isStory) {
  return el('div', {
    width: '60px',
    height: '2px',
    background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
    margin: isStory ? '16px 0' : '8px 0',
  });
}

/**
 * Build the 1080×1080 square share image layout.
 */
function buildSquareLayout(data) {
  const { name, date, archetype, love, career, health, wealth, oracle } = data;

  return el('div', {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1080px',
    height: '1080px',
    background: `linear-gradient(160deg, ${COLORS.bg2} 0%, ${COLORS.bg1} 40%, ${COLORS.bg3} 100%)`,
    fontFamily: '"Space Grotesk", "Noto Sans SC", sans-serif',
    padding: '60px',
  },
    // ── Inner card ──
    el('div', {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      border: `1px solid ${COLORS.goldBorder}`,
      borderRadius: '32px',
      padding: '48px 40px',
      background: 'rgba(255,255,255,0.02)',
      gap: '20px',
    },
      // Header
      el('div', { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
        el('span', {
          fontSize: 26,
          fontWeight: 700,
          color: COLORS.gold,
          letterSpacing: '0.05em',
        }, `${name || 'Your'} WoBazi Destiny`),
        el('span', {
          fontSize: 18,
          color: COLORS.muted,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }, date || ''),
      ),

      divider(false),

      // Archetype
      el('div', {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
      },
        el('span', {
          fontSize: 14,
          color: COLORS.mutedLight,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }, 'DESTINY ARCHETYPE'),
        el('span', {
          fontSize: 38,
          fontWeight: 700,
          color: COLORS.white,
          textAlign: 'center',
          letterSpacing: '0.02em',
        }, archetype || ''),
      ),

      divider(false),

      // Fortune scores (2×2 grid)
      el('div', {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        width: '100%',
        justifyContent: 'center',
        maxWidth: '600px',
      },
        scoreItem('L', '#f43f5e', 'Love', love, false),
        scoreItem('C', '#8b5cf6', 'Career', career, false),
        scoreItem('H', '#22c55e', 'Health', health, false),
        scoreItem('W', '#f59e0b', 'Wealth', wealth, false),
      ),

      divider(false),

      // Oracle
      el('div', {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        maxWidth: '680px',
      },
        el('span', {
          fontSize: 13,
          color: COLORS.mutedLight,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }, 'ORACLE MESSAGE'),
        el('span', {
          fontSize: 20,
          fontWeight: 400,
          color: 'rgba(240,240,255,0.75)',
          textAlign: 'center',
          lineHeight: '1.5',
          fontStyle: 'italic',
        }, oracle ? `"${oracle}"` : ''),
      ),

      // Footer
      el('div', {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        marginTop: '8px',
      },
        el('span', {
          fontSize: 20,
          fontWeight: 700,
          color: COLORS.gold,
          letterSpacing: '0.08em',
        }, 'wobazi.com'),
        el('span', {
          fontSize: 13,
          color: COLORS.mutedLight,
        }, 'Generated by WoBazi'),
      ),
    ),
  );
}

/**
 * Build the 1080×1920 story share image layout.
 */
function buildStoryLayout(data) {
  const { name, date, archetype, love, career, health, wealth, oracle } = data;

  return el('div', {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1080px',
    height: '1920px',
    background: `linear-gradient(180deg, ${COLORS.bg2} 0%, ${COLORS.bg1} 50%, ${COLORS.bg3} 100%)`,
    fontFamily: '"Space Grotesk", "Noto Sans SC", sans-serif',
    padding: '80px 60px',
  },
    // ── Inner card ──
    el('div', {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      flex: '1',
      border: `1px solid ${COLORS.goldBorder}`,
      borderRadius: '40px',
      padding: '64px 48px',
      background: 'rgba(255,255,255,0.02)',
      gap: '40px',
    },
      // Top logo
      el('span', {
        fontSize: 18,
        color: COLORS.mutedLight,
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
      }, '-- WOBAZI --'),

      // Header
      el('div', { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
        el('span', {
          fontSize: 32,
          fontWeight: 700,
          color: COLORS.gold,
          letterSpacing: '0.05em',
          textAlign: 'center',
        }, `${name || 'Your'} WoBazi Destiny`),
        el('span', {
          fontSize: 22,
          color: COLORS.muted,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }, date || ''),
      ),

      divider(true),

      // Archetype
      el('div', {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      },
        el('span', {
          fontSize: 16,
          color: COLORS.mutedLight,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }, 'DESTINY ARCHETYPE'),
        el('span', {
          fontSize: 48,
          fontWeight: 700,
          color: COLORS.white,
          textAlign: 'center',
          letterSpacing: '0.02em',
        }, archetype || ''),
      ),

      divider(true),

      // Fortune scores (2×2 grid)
      el('div', {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        width: '100%',
        justifyContent: 'center',
      },
        scoreItem('L', '#f43f5e', 'Love', love, true),
        scoreItem('C', '#8b5cf6', 'Career', career, true),
        scoreItem('H', '#22c55e', 'Health', health, true),
        scoreItem('W', '#f59e0b', 'Wealth', wealth, true),
      ),

      divider(true),

      // Oracle
      el('div', {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        maxWidth: '780px',
      },
        el('span', {
          fontSize: 15,
          color: COLORS.mutedLight,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }, 'ORACLE MESSAGE'),
        el('span', {
          fontSize: 26,
          fontWeight: 400,
          color: 'rgba(240,240,255,0.75)',
          textAlign: 'center',
          lineHeight: '1.6',
          fontStyle: 'italic',
        }, oracle ? `"${oracle}"` : ''),
      ),

      // Footer
      el('div', {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        marginTop: '16px',
      },
        el('span', {
          fontSize: 24,
          fontWeight: 700,
          color: COLORS.gold,
          letterSpacing: '0.08em',
        }, 'wobazi.com'),
        el('span', {
          fontSize: 15,
          color: COLORS.mutedLight,
        }, 'Generated by WoBazi'),
      ),
    ),
  );
}

module.exports = { buildSquareLayout, buildStoryLayout };
