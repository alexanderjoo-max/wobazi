/**
 * share/routes.js — Express routes for dynamic share image generation
 *
 * GET /api/share-image  → 1080×1080 PNG (square, social)
 * GET /api/share-story  → 1080×1920 PNG (vertical, Instagram Stories)
 */

const { Router } = require('express');
const { buildSquareLayout, buildStoryLayout } = require('./layout');
const { renderImage } = require('./render');

const router = Router();

/**
 * Parse and validate query params shared by both endpoints.
 */
function parseShareParams(query) {
  const {
    name, date, chineseNameCharacters, pinyinName, englishMeaning,
    archetype, elementAnimal, oracle, love, career, health, wealth,
  } = query;

  if (!archetype) {
    return { error: 'Missing required param: archetype' };
  }

  return {
    data: {
      name: (name || '').slice(0, 50),
      date: (date || '').slice(0, 40),
      chineseNameCharacters: (chineseNameCharacters || '').slice(0, 10),
      pinyinName: (pinyinName || '').slice(0, 60),
      englishMeaning: (englishMeaning || '').slice(0, 80),
      archetype: (archetype || '').slice(0, 60),
      elementAnimal: (elementAnimal || '').slice(0, 40),
      oracle: (oracle || '').slice(0, 200),
      love: Math.min(99, Math.max(0, parseInt(love, 10) || 50)),
      career: Math.min(99, Math.max(0, parseInt(career, 10) || 50)),
      health: Math.min(99, Math.max(0, parseInt(health, 10) || 50)),
      wealth: Math.min(99, Math.max(0, parseInt(wealth, 10) || 50)),
    },
  };
}

// ── Square image (1080×1080) ──
router.get('/api/share-image', async (req, res) => {
  try {
    const result = parseShareParams(req.query);
    if (result.error) return res.status(400).json({ error: result.error });

    const layout = buildSquareLayout(result.data);
    const png = await renderImage(layout, 1080, 1080);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(png);
  } catch (err) {
    console.error('[share-image] Error generating image:', err);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

// ── Story image (1080×1920) ──
router.get('/api/share-story', async (req, res) => {
  try {
    const result = parseShareParams(req.query);
    if (result.error) return res.status(400).json({ error: result.error });

    const layout = buildStoryLayout(result.data);
    const png = await renderImage(layout, 1080, 1920);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(png);
  } catch (err) {
    console.error('[share-story] Error generating image:', err);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

module.exports = router;
