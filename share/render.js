/**
 * share/render.js — PNG generation via Satori + Resvg
 *
 * Loads fonts once at startup, then renders Satori layout trees to PNG buffers.
 */

const fs = require('fs');
const path = require('path');
const satori = require('satori').default;
const { Resvg } = require('@resvg/resvg-js');

// ── Font cache (loaded once) ──
let _fonts = null;

function loadFonts() {
  if (_fonts) return _fonts;

  const fontsDir = path.join(__dirname, 'fonts');
  const regularBuf = fs.readFileSync(path.join(fontsDir, 'SpaceGrotesk-Regular.ttf'));
  const boldBuf = fs.readFileSync(path.join(fontsDir, 'SpaceGrotesk-Bold.ttf'));

  _fonts = [
    { name: 'Space Grotesk', data: regularBuf, weight: 400, style: 'normal' },
    { name: 'Space Grotesk', data: boldBuf, weight: 700, style: 'normal' },
  ];

  // Load Noto Sans SC for Chinese character support (optional, may be large)
  const notoPath = path.join(fontsDir, 'NotoSansSC-Bold.ttf');
  if (fs.existsSync(notoPath)) {
    const notoBuf = fs.readFileSync(notoPath);
    _fonts.push({ name: 'Noto Sans SC', data: notoBuf, weight: 700, style: 'normal' });
  }

  console.log(`[share] Loaded ${_fonts.length} fonts for image generation`);
  return _fonts;
}

/**
 * Render a Satori layout tree to a PNG buffer.
 * @param {object} layout  — Satori-compatible element tree
 * @param {number} width   — Image width in px
 * @param {number} height  — Image height in px
 * @returns {Promise<Buffer>} PNG image buffer
 */
async function renderImage(layout, width, height) {
  const fonts = loadFonts();

  // Satori → SVG string
  const svg = await satori(layout, {
    width,
    height,
    fonts,
  });

  // Resvg → PNG buffer
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
  });
  const pngData = resvg.render();
  return pngData.asPng();
}

module.exports = { renderImage, loadFonts };
