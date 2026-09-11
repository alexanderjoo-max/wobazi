/**
 * Satori layouts for viral Today / Year cards.
 * Story 1080×1920, OG 1200×630, square 1080×1080.
 */
const EL_HEX = {
  Wood: '#22c55e',
  Fire: '#ef4444',
  Earth: '#f59e0b',
  Metal: '#c0c8d4',
  Water: '#3b82f6',
};

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

function storyLayout(v) {
  const accent = EL_HEX[v.accentEl] || EL_HEX.Metal;
  const kindLabel = v.kind === 'year' ? (v.yearLabel || 'THIS YEAR') : 'TODAY';
  const chars = v.kind === 'year' ? (v.flowYearChars || v.yearChars) : (v.todayChars || v.dayChars);
  return el('div', {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: '72px 64px 56px',
    background: `linear-gradient(165deg, #07030f 0%, #12081c 42%, #0a0610 100%)`,
    color: '#f0f0ff',
    fontFamily: 'Space Grotesk',
    position: 'relative',
  },
    el('div', { flexDirection: 'column', gap: '22px' },
      el('div', { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
        el('div', { fontSize: 22, fontWeight: 700, letterSpacing: '0.28em', color: '#f0c040' }, 'WOBAZI'),
        el('div', { fontSize: 18, letterSpacing: '0.22em', color: 'rgba(240,240,255,0.45)', textTransform: 'uppercase' }, kindLabel)
      ),
      el('div', { flexDirection: 'row', alignItems: 'flex-end', gap: '28px', marginTop: '20px' },
        el('div', {
          fontSize: 168,
          fontWeight: 700,
          fontFamily: 'Noto Sans SC',
          color: accent,
          lineHeight: 0.9,
          letterSpacing: '-0.04em',
        }, v.dmChar || '八'),
        el('div', { flexDirection: 'column', gap: '8px', paddingBottom: '16px' },
          el('div', { fontSize: 22, color: 'rgba(240,240,255,0.5)', letterSpacing: '0.18em' }, 'DAY MASTER'),
          el('div', { fontSize: 36, fontFamily: 'Noto Sans SC', color: '#f0f0ff' }, chars || ''),
          v.name ? el('div', { fontSize: 22, color: 'rgba(240,240,255,0.45)' }, v.name) : null
        )
      )
    ),
    el('div', { flexDirection: 'column', gap: '22px' },
      el('div', {
        alignSelf: 'flex-start',
        padding: '8px 18px',
        border: `1px solid ${accent}`,
        color: accent,
        fontSize: 22,
        letterSpacing: '0.24em',
        textTransform: 'uppercase',
        fontWeight: 700,
      }, v.weatherLabel || v.weather),
      el('div', {
        fontSize: 54,
        fontWeight: 700,
        lineHeight: 1.15,
        color: '#fff8e8',
        letterSpacing: '-0.02em',
      }, v.hook),
      el('div', { width: 80, height: 2, background: '#f0c040', opacity: 0.55 }),
      el('div', { fontSize: 28, lineHeight: 1.4, color: 'rgba(240,240,255,0.78)' }, v.body),
      el('div', { fontSize: 26, fontWeight: 700, color: accent, marginTop: 8 }, v.dare)
    ),
    el('div', { flexDirection: 'column', gap: '10px', marginTop: 'auto' },
      el('div', { fontSize: 22, letterSpacing: '0.16em', color: '#f0c040', fontWeight: 700 }, 'wobazi.com  ·  Plot your chart'),
      el('div', { fontSize: 16, color: 'rgba(240,240,255,0.32)' }, 'Terrain, not a prison sentence.')
    )
  );
}

function ogLayout(v) {
  const accent = EL_HEX[v.accentEl] || EL_HEX.Metal;
  return el('div', {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    padding: '48px 56px',
    background: 'linear-gradient(135deg, #07030f, #160b22 60%, #0a0610)',
    color: '#f0f0ff',
    fontFamily: 'Space Grotesk',
    alignItems: 'center',
    gap: '40px',
  },
    el('div', {
      fontSize: 180,
      fontWeight: 700,
      fontFamily: 'Noto Sans SC',
      color: accent,
      lineHeight: 1,
    }, v.dmChar || '八'),
    el('div', { flexDirection: 'column', gap: '16px', flex: 1 },
      el('div', { fontSize: 20, letterSpacing: '0.28em', color: '#f0c040', fontWeight: 700 }, 'WOBAZI  ·  ' + (v.weatherLabel || '')),
      el('div', { fontSize: 42, fontWeight: 700, lineHeight: 1.2, color: '#fff8e8' }, v.hook),
      el('div', { fontSize: 22, color: 'rgba(240,240,255,0.7)' }, v.dare),
      el('div', { fontSize: 18, color: '#f0c040', marginTop: 8 }, 'wobazi.com · Plot your chart')
    )
  );
}

module.exports = { storyLayout, ogLayout, EL_HEX };
