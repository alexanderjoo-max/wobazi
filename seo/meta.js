/* ═══════════════════════════════════════
   WOBAZI — SEO page table, sitemap dates, structured data
   seo/meta.js

   One list of public pages drives the per-page title/description/canonical,
   the sitemap (hand-maintained lastmod) and the Article + BreadcrumbList JSON-LD.
   URL policy: absolute https://wobazi.com, no trailing slash (except "/").
═══════════════════════════════════════ */

'use strict';

const SITE = 'https://wobazi.com';

const ORGANIZATION = {
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: 'Wobazi',
  url: `${SITE}/`,
  logo: { '@type': 'ImageObject', url: `${SITE}/public/favicon-512.png`, width: 512, height: 512 },
  sameAs: ['https://www.instagram.com/wo.bazi/'],
  parentOrganization: { '@type': 'Organization', name: 'U Destiny', url: 'https://www.udestinyglobal.com/en' },
};

/* Public, indexable pages.
   published / lastmod are set by hand (YYYY-MM-DD). Update `lastmod` whenever the page's
   visible content changes — not on deploys, refactors or markup-only edits. Deploys have no
   reliable git history or file dates, and a lastmod that moves on every deploy gets ignored. */
const PAGES = [
  {
    path: '/', published: '2026-02-27', lastmod: '2026-09-17',
    title: 'Free BaZi Calculator – Four Pillars of Destiny Chart | Wobazi',
    description: 'Free BaZi calculator. Enter your birth date to get your Four Pillars chart, Day Master, element balance and 10-year luck cycles. No account needed.',
  },
  {
    path: '/what-is-bazi', published: '2026-03-17', lastmod: '2026-09-14', article: true, crumb: 'What Is BaZi?',
    title: 'What Is BaZi? Four Pillars of Destiny Explained | Wobazi',
    description: 'BaZi reads your birth date and time as four pillars of stems and branches. Learn how the Five Elements and your Day Master shape your chart.',
  },
  {
    path: '/four-pillars-of-destiny', published: '2026-03-17', lastmod: '2026-08-20', article: true, crumb: 'Four Pillars of Destiny',
    title: 'Four Pillars of Destiny: How a BaZi Chart Works | Wobazi',
    description: 'The Four Pillars of Destiny explained: year, month, day and hour pillars, Heavenly Stems, Earthly Branches and 10-year luck pillars.',
  },
  {
    path: '/chinese-astrology', published: '2026-03-17', lastmod: '2026-09-16', article: true, crumb: 'Chinese Astrology',
    title: 'Chinese Astrology: BaZi, Zodiac and Five Elements | Wobazi',
    description: 'How Chinese astrology works: BaZi Four Pillars, the Chinese zodiac, Zi Wei Dou Shu and the Five Elements, and how it differs from Western astrology.',
  },
  {
    path: '/day-master', published: '2026-03-17', lastmod: '2026-09-16', article: true, crumb: 'Day Master',
    title: 'BaZi Day Master: All 10 Day Masters Explained | Wobazi',
    description: 'Your Day Master is the core of your BaZi chart. See all 10, from Jia Wood to Gui Water, and what each says about personality and strengths.',
  },
  {
    path: '/bazi-compatibility', published: '2026-03-17', lastmod: '2026-08-20', article: true, crumb: 'BaZi Compatibility',
    title: 'BaZi Compatibility: Love and Business Chart Matching | Wobazi',
    description: 'How BaZi compatibility works: Day Master dynamics, branch clashes and combinations, and element balance for love, friendship and business.',
  },
  {
    path: '/master-alice', published: '2026-09-11', lastmod: '2026-09-14', crumb: 'Master Alice',
    title: 'Master Alice: BaZi and Feng Shui Master in Bangkok | Wobazi',
    description: 'Master Alice is the Bangkok-based BaZi and Feng Shui master behind Wobazi, with 15+ years of practice. A U Destiny product.',
  },
  {
    path: '/privacy', published: '2026-08-20', lastmod: '2026-09-13', crumb: 'Privacy Policy',
    title: 'Privacy Policy | Wobazi',
    description: 'How Wobazi collects, uses, and protects your information, including Google sign-in, birth data, and AI-generated readings.',
  },
  {
    path: '/terms', published: '2026-08-20', lastmod: '2026-08-20', crumb: 'Terms of Service',
    title: 'Terms of Service | Wobazi',
    description: 'Terms of Service for Wobazi, the free BaZi (Four Pillars of Destiny) reading app.',
  },
];
const BY_PATH = Object.fromEntries(PAGES.map(p => [p.path, p]));

function absolute(p) {
  return p === '/' ? `${SITE}/` : `${SITE}${p}`;
}

/* Locals for res.render: title, description, canonical, jsonLd (array of JSON-LD blocks). */
function pageLocals(p) {
  const page = BY_PATH[p];
  if (!page) throw new Error(`seo/meta: unknown page ${p}`);
  const graph = [];
  if (page.crumb) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: page.crumb, item: absolute(page.path) },
      ],
    });
  }
  if (page.article) {
    graph.push({
      '@type': 'Article',
      headline: page.title.replace(/ \| Wobazi$/, ''),
      description: page.description,
      url: absolute(page.path),
      mainEntityOfPage: absolute(page.path),
      image: `${SITE}/og-card.jpg`,
      inLanguage: 'en',
      datePublished: page.published,
      dateModified: page.lastmod,
      author: { '@type': 'Person', name: 'Master Alice', url: `${SITE}/master-alice` },
      // Inline publisher (name + logo): validators and some crawlers don't resolve @id references.
      publisher: { '@type': 'Organization', name: ORGANIZATION.name, url: ORGANIZATION.url, logo: ORGANIZATION.logo },
    });
  }
  return {
    title: page.title,
    description: page.description,
    canonical: page.path,
    // One block per type (clearer for validators than a single @graph).
    jsonLd: graph.map(node => Object.assign({ '@context': 'https://schema.org' }, node)),
  };
}

/* Homepage structured data (WebApplication + Organization). The FAQPage block stays in app/index.html. */
function homeJsonLd() {
  const page = BY_PATH['/'];
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Wobazi BaZi Calculator',
      url: `${SITE}/`,
      description: page.description,
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript',
      inLanguage: ['en', 'th', 'zh-Hans'],
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@id': `${SITE}/#organization` },
    },
    Object.assign({ '@context': 'https://schema.org' }, ORGANIZATION),
  ];
}

function sitemapXml() {
  const urls = PAGES.map(p => `  <url>
    <loc>${absolute(p.path)}</loc>
    <lastmod>${p.lastmod}</lastmod>
  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

/* JSON for a <script type="application/ld+json"> block: escape "<" so the data can't close the tag. */
function jsonLdScript(data) {
  return JSON.stringify(data, null, 2).replace(/</g, '\\u003c');
}

module.exports = { SITE, PAGES, pageLocals, homeJsonLd, sitemapXml, jsonLdScript, absolute };
