/* ═══════════════════════════════════════
   WOBAZI — Chinese Destiny Engine
   script.js
═══════════════════════════════════════ */

/* ── Heavenly Stems ── */
const STEMS = [
  { char:'甲', pinyin:'Jiǎ',  element:'Wood',  polarity:'Yang' },
  { char:'乙', pinyin:'Yǐ',   element:'Wood',  polarity:'Yin'  },
  { char:'丙', pinyin:'Bǐng', element:'Fire',  polarity:'Yang' },
  { char:'丁', pinyin:'Dīng', element:'Fire',  polarity:'Yin'  },
  { char:'戊', pinyin:'Wù',   element:'Earth', polarity:'Yang' },
  { char:'己', pinyin:'Jǐ',   element:'Earth', polarity:'Yin'  },
  { char:'庚', pinyin:'Gēng', element:'Metal', polarity:'Yang' },
  { char:'辛', pinyin:'Xīn',  element:'Metal', polarity:'Yin'  },
  { char:'壬', pinyin:'Rén',  element:'Water', polarity:'Yang' },
  { char:'癸', pinyin:'Guǐ',  element:'Water', polarity:'Yin'  },
];

/* ── Earthly Branches ── */
const BRANCHES = [
  { char:'子', pinyin:'Zǐ',   animal:'Rat',     element:'Water', emoji:'🐀' },
  { char:'丑', pinyin:'Chǒu', animal:'Ox',      element:'Earth', emoji:'🐂' },
  { char:'寅', pinyin:'Yín',  animal:'Tiger',   element:'Wood',  emoji:'🐅' },
  { char:'卯', pinyin:'Mǎo',  animal:'Rabbit',  element:'Wood',  emoji:'🐇' },
  { char:'辰', pinyin:'Chén', animal:'Dragon',  element:'Earth', emoji:'🐉' },
  { char:'巳', pinyin:'Sì',   animal:'Snake',   element:'Fire',  emoji:'🐍' },
  { char:'午', pinyin:'Wǔ',   animal:'Horse',   element:'Fire',  emoji:'🐎' },
  { char:'未', pinyin:'Wèi',  animal:'Goat',    element:'Earth', emoji:'🐑' },
  { char:'申', pinyin:'Shēn', animal:'Monkey',  element:'Metal', emoji:'🐒' },
  { char:'酉', pinyin:'Yǒu',  animal:'Rooster', element:'Metal', emoji:'🐓' },
  { char:'戌', pinyin:'Xū',   animal:'Dog',     element:'Earth', emoji:'🐕' },
  { char:'亥', pinyin:'Hài',  animal:'Pig',     element:'Water', emoji:'🐗' },
];

/* ── Zodiac Personality Data ── */
const ZODIAC = {
  Rat:     { traits:['Clever','Charming','Resourceful'],  compat:['Ox','Dragon','Monkey'],  clash:['Horse','Rooster'],  lucky:{ colors:['Blue','Gold','Green'],    numbers:[2,3],    dir:'North'    }, fortune:{ love:78, career:88, health:72, wealth:85 }, desc_en:'The Rat is a master strategist — endlessly curious, quick-witted, and magnetic. You navigate complexity with ease and see opportunity where others see obstacles. Your social intelligence is your greatest asset.', desc_zh:'鼠年生人机智过人，善于发现机遇。天生的战略家，魅力四射，社交能力极强。在复杂局势中游刃有余，总能化危为机。' },
  Ox:      { traits:['Dependable','Patient','Strong'],    compat:['Rat','Snake','Rooster'], clash:['Goat','Dragon'],    lucky:{ colors:['Yellow','White','Green'], numbers:[1,4],    dir:'Northeast' }, fortune:{ love:70, career:85, health:80, wealth:82 }, desc_en:'The Ox is the bedrock of the zodiac — steadfast, hardworking, and deeply reliable. Your quiet determination builds empires slowly and surely. Others may sprint past you, but you always finish the race.', desc_zh:'牛年生人勤勉踏实，是十二生肖中最可靠的存在。低调的毅力造就非凡成就，别人冲刺时你稳步前行，终将抵达终点。' },
  Tiger:   { traits:['Bold','Magnetic','Fearless'],       compat:['Horse','Dog','Pig'],     clash:['Monkey','Snake'],   lucky:{ colors:['Blue','Grey','Orange'],   numbers:[1,3,4],  dir:'East'     }, fortune:{ love:82, career:80, health:85, wealth:74 }, desc_en:'The Tiger commands any room it enters. Brave, passionate, and intensely driven, you live life at full throttle. Your charisma is electric — people are drawn to your fire. Just learn to trust, not control.', desc_zh:'虎年生人霸气侧漏，天生领袖。勇敢、热情、充满活力，以全力以赴的姿态投入生活。你的魅力如电，吸引众人。学会信任，方能成就大业。' },
  Rabbit:  { traits:['Graceful','Intuitive','Diplomatic'],compat:['Goat','Pig','Dog'],     clash:['Rooster','Dragon'], lucky:{ colors:['Pink','Purple','Blue'],   numbers:[3,4,9],  dir:'East'     }, fortune:{ love:88, career:74, health:78, wealth:76 }, desc_en:'The Rabbit moves through life with effortless grace. Deeply intuitive and emotionally intelligent, you read the room before anyone else does. Your sensitivity is your superpower — protect your energy.', desc_zh:'兔年生人优雅从容，直觉敏锐，情商极高。能在他人察觉之前读懂氛围。你的敏感是超能力，善加保护，方能大放异彩。' },
  Dragon:  { traits:['Visionary','Powerful','Lucky'],     compat:['Rat','Monkey','Rooster'],clash:['Dog','Rabbit'],     lucky:{ colors:['Gold','Silver','Teal'],  numbers:[1,6,7],  dir:'East'     }, fortune:{ love:80, career:92, health:76, wealth:90 }, desc_en:'The Dragon is the only mythical creature in the zodiac — and for good reason. You are ambitious, lucky, and destined for greatness. Your vision is ten steps ahead of everyone else. Dream big. Act bigger.', desc_zh:'龙是十二生肖中唯一的神话生物，象征着雄心、好运与命中注定的伟大。你的眼光超越常人十步，梦想要大，行动要更大。' },
  Snake:   { traits:['Wise','Mysterious','Elegant'],      compat:['Ox','Rooster','Monkey'], clash:['Tiger','Pig'],      lucky:{ colors:['Black','Red','Yellow'],   numbers:[2,8,9],  dir:'South'    }, fortune:{ love:85, career:86, health:70, wealth:88 }, desc_en:'The Snake is the philosopher of the zodiac — profound, perceptive, and quietly powerful. You process the world at a depth others rarely reach. Your wisdom is ageless. Trust your gut; it is rarely wrong.', desc_zh:'蛇年生人是十二生肖中的智者——深刻、洞察力强、静水流深。你对世界的理解远超常人。你的智慧超越时代，相信直觉，它鲜少出错。' },
  Horse:   { traits:['Free-spirited','Energetic','Wild'], compat:['Tiger','Dog','Goat'],    clash:['Rat','Ox'],         lucky:{ colors:['Yellow','Green','Brown'],  numbers:[2,3,7],  dir:'South'    }, fortune:{ love:84, career:78, health:90, wealth:72 }, desc_en:'The Horse lives for freedom and adventure. Wildly independent and brimming with energy, you charge at life with unstoppable momentum. Love comes easily; commitment takes practice. Ride your own path.', desc_zh:'马年生人热爱自由与冒险，独立性强，精力充沛，以无可阻挡的势头冲向生活。感情来得容易，承诺需要修炼。走自己的路，无怨无悔。' },
  Goat:    { traits:['Creative','Gentle','Empathetic'],   compat:['Rabbit','Horse','Pig'],  clash:['Ox','Dog'],         lucky:{ colors:['Brown','Red','Purple'],   numbers:[2,7],    dir:'Southwest' }, fortune:{ love:86, career:72, health:76, wealth:70 }, desc_en:'The Goat is the artist and healer of the zodiac. Your empathy runs bone-deep and your creativity knows no ceiling. You are at your best when given freedom to roam and create without restriction.', desc_zh:'羊年生人是十二生肖中的艺术家与治愈者。你的共情能力极深，创造力无可限量。给予自由的空间，你便能绽放出最美的光彩。' },
  Monkey:  { traits:['Inventive','Witty','Unstoppable'],  compat:['Rat','Dragon','Snake'],  clash:['Tiger','Pig'],      lucky:{ colors:['White','Blue','Gold'],    numbers:[1,7,8],  dir:'Northwest' }, fortune:{ love:76, career:90, health:82, wealth:86 }, desc_en:'The Monkey is pure intellectual electricity. Inventive, adaptable, and devastatingly clever, you can solve problems on the fly that stump everyone else. Boredom is your only enemy.', desc_zh:'猴年生人聪明绝顶，充满创造力。适应能力强，能即兴解决难倒众人的难题。对你而言，唯一的敌人是无聊。' },
  Rooster: { traits:['Precise','Confident','Loyal'],      compat:['Ox','Snake','Dragon'],   clash:['Rabbit','Dog'],     lucky:{ colors:['Gold','Brown','Yellow'],  numbers:[5,7,8],  dir:'West'     }, fortune:{ love:74, career:84, health:80, wealth:82 }, desc_en:'The Rooster sets the standard. Meticulous, disciplined, and supremely self-aware, you demand excellence from yourself first. Your loyalty runs deep and your work ethic is unmatched.', desc_zh:'鸡年生人树立标准。一丝不苟、严于律己，对自己的要求最为苛刻。你的忠诚深沉，职业道德无人能及。' },
  Dog:     { traits:['Loyal','Just','Protective'],        compat:['Tiger','Rabbit','Horse'], clash:['Dragon','Rooster'], lucky:{ colors:['Green','Red','Purple'],   numbers:[3,4,9],  dir:'East'     }, fortune:{ love:90, career:76, health:84, wealth:74 }, desc_en:'The Dog is the guardian of the zodiac. Fiercely loyal, deeply principled, and instinctively protective of those you love. You are the person everyone calls when things go wrong. That is your gift.', desc_zh:'狗年生人是十二生肖中的守护者。对挚爱之人忠诚、有原则、全力守护。当事情出错时，每个人都会想到你。这是你的天赋。' },
  Pig:     { traits:['Generous','Sincere','Optimistic'],  compat:['Tiger','Rabbit','Goat'], clash:['Snake','Monkey'],   lucky:{ colors:['Yellow','Grey','Brown'],  numbers:[2,5,8],  dir:'Northwest' }, fortune:{ love:88, career:74, health:78, wealth:76 }, desc_en:'The Pig radiates warmth and abundance. Generous to a fault, joyfully optimistic, and sincerely kind — your heart is the biggest thing about you. People gravitate to your light. Let them.', desc_zh:'猪年生人温暖慷慨、乐观真诚。你的善良是最大的财富，人们自然而然地被你的光芒所吸引。大方地让他们靠近吧。' },
};

/* ── Element Colors ── */
const EL_COLOR = {
  Wood:  '#22c55e',
  Fire:  '#ef4444',
  Earth: '#f59e0b',
  Metal: '#94a3b8',
  Water: '#3b82f6',
};

/* ── Month Branch lookup (approximate, solar calendar) ── */
// [Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec]
const MONTH_BRANCH = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0];
// Jan=Ox(1), Feb=Tiger(2), ..., Dec=Rat(0)

/* ── Hour Branch lookup ── */
// hour 23–1=Rat(0), 1–3=Ox(1), 3–5=Tiger(2), 5–7=Rabbit(3),
// 7–9=Dragon(4), 9–11=Snake(5), 11–13=Horse(6), 13–15=Goat(7),
// 15–17=Monkey(8), 17–19=Rooster(9), 19–21=Dog(10), 21–23=Pig(11)
function hourToBranch(h) {
  return Math.floor(((h + 1) % 24) / 2);
}

/* ── Bazi Calculation ── */
function calcBazi(year, month, day, hour) {
  // Year Pillar
  const yStemIdx   = ((year - 4) % 10 + 10) % 10;
  const yBranchIdx = ((year - 4) % 12 + 12) % 12;

  // Month Pillar (approximate)
  const mBranchIdx = MONTH_BRANCH[month];
  // Month stem: depends on year stem group (5 groups of 2)
  const mStemBase  = (yStemIdx % 5) * 2;
  // Tiger month (index 2) is month 1 in the cycle
  const mOffset    = (mBranchIdx - 2 + 12) % 12;
  const mStemIdx   = (mStemBase + mOffset) % 10;

  // Day Pillar (referenced from known Jiazi day: 2000-01-07)
  const ref = new Date(2000, 0, 7);
  const birthDay = new Date(year, month, day);
  const diffDays = Math.round((birthDay - ref) / 86400000);
  const dCyclePos = ((diffDays % 60) + 60) % 60;
  const dStemIdx   = dCyclePos % 10;
  const dBranchIdx = dCyclePos % 12;

  // Hour Pillar
  let hStemIdx = null, hBranchIdx = null;
  if (hour !== null) {
    hBranchIdx = hourToBranch(hour);
    // Hour stem based on day stem group
    const hStemBase = (dStemIdx % 5) * 2;
    hStemIdx = (hStemBase + hBranchIdx) % 10;
  }

  return [
    { label:'Year',  stem: STEMS[yStemIdx],   branch: BRANCHES[yBranchIdx],  known: true },
    { label:'Month', stem: STEMS[mStemIdx],   branch: BRANCHES[mBranchIdx],  known: true },
    { label:'Day',   stem: STEMS[dStemIdx],   branch: BRANCHES[dBranchIdx],  known: true },
    { label:'Hour',  stem: hour !== null ? STEMS[hStemIdx] : null,
                     branch: hour !== null ? BRANCHES[hBranchIdx] : null,    known: hour !== null },
  ];
}

/* ── Element Balance (from 8 characters) ── */
function calcElements(pillars) {
  const counts = { Wood:0, Fire:0, Earth:0, Metal:0, Water:0 };
  for (const p of pillars) {
    if (p.known) {
      if (p.stem)   counts[p.stem.element]++;
      if (p.branch) counts[p.branch.element]++;
    }
  }
  return counts;
}

/* ── Fortune Scores (base from zodiac + element modifier) ── */
function calcFortune(animal, elements) {
  const base = { ...ZODIAC[animal].fortune };
  // Dominant element boosts relevant areas
  const dominant = Object.entries(elements).sort((a,b) => b[1]-a[1])[0][0];
  const boosts = {
    Wood:  { health:+5 },
    Fire:  { love:+5, career:+4 },
    Earth: { wealth:+5 },
    Metal: { career:+5, wealth:+4 },
    Water: { career:+4, health:+4 },
  };
  const b = boosts[dominant] || {};
  for (const k in b) base[k] = Math.min(98, base[k] + b[k]);
  return base;
}

/* ═══════════════════════════════════════
   UI — Screen Navigation
═══════════════════════════════════════ */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'results') {
    document.getElementById('results').querySelector('.scroll-body').scrollTop = 0;
  }
}

/* ── Stars (splash background) ── */
function buildStars() {
  const container = document.getElementById('stars');
  if (!container) return;
  for (let i = 0; i < 120; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    s.style.cssText = `
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      width:${size}px; height:${size}px;
      --dur:${2 + Math.random() * 3}s;
      animation-delay:${Math.random() * 4}s;
    `;
    container.appendChild(s);
  }
}

/* ═══════════════════════════════════════
   UI — Loading Sequence
═══════════════════════════════════════ */
const LOADING_MSGS = [
  'Aligning the heavenly stems…',
  'Reading the earthly branches…',
  'Calculating your four pillars…',
  'Consulting the I Ching…',
  'Mapping your destiny…',
  'Almost there…',
];

function runLoader(callback) {
  showScreen('loading');
  const msgEl  = document.getElementById('loading-msg');
  const fillEl = document.getElementById('loading-fill');
  let step = 0;
  const total = LOADING_MSGS.length;
  const iv = setInterval(() => {
    msgEl.textContent = LOADING_MSGS[step];
    fillEl.style.width = ((step + 1) / total * 100) + '%';
    step++;
    if (step >= total) {
      clearInterval(iv);
      setTimeout(callback, 400);
    }
  }, 380);
}

/* ═══════════════════════════════════════
   UI — Form Submit
═══════════════════════════════════════ */
function handleSubmit(e) {
  e.preventDefault();
  const name      = document.getElementById('name').value.trim();
  const dateVal   = document.getElementById('birthdate').value;
  const timeVal   = document.getElementById('birthtime').value;
  if (!dateVal) return;

  const [y, m, d] = dateVal.split('-').map(Number);
  let hour = null;
  if (timeVal) {
    hour = parseInt(timeVal.split(':')[0], 10);
  }

  runLoader(() => renderResults(name, y, m - 1, d, hour));
}

/* ═══════════════════════════════════════
   UI — Render Results
═══════════════════════════════════════ */
function renderResults(name, year, month, day, hour) {
  const pillars  = calcBazi(year, month, day, hour);
  const yearPillar = pillars[0];
  const animal   = yearPillar.branch.animal;
  const zData    = ZODIAC[animal];
  const elements = calcElements(pillars);
  const fortune  = calcFortune(animal, elements);

  // Greeting
  const greet = name ? `Hey, ${name} ✦` : 'Your Destiny ✦';
  document.getElementById('greeting').textContent = greet;

  // Hero card
  const elColor = EL_COLOR[yearPillar.stem.element];
  document.getElementById('hero-bg').style.background =
    `linear-gradient(135deg, ${elColor}22, ${elColor}55, #0f0f1c)`;
  document.getElementById('hero-emoji').textContent = yearPillar.branch.emoji;
  document.getElementById('hero-year-tag').textContent =
    `Year of the ${animal} · ${year}`;
  document.getElementById('hero-name').textContent = animal;

  const badgeEl = document.getElementById('hero-badges');
  badgeEl.innerHTML = [
    yearPillar.stem.element,
    yearPillar.stem.polarity,
    yearPillar.branch.pinyin,
  ].map(t => `<span class="badge">${t}</span>`).join('');

  document.getElementById('trait-pills').innerHTML =
    zData.traits.map(t => `<span class="trait-pill">${t}</span>`).join('');

  // Pillars
  renderPillars(pillars);

  // Radar / element balance
  renderRadar(elements);

  // Fortune
  renderFortune(fortune);

  // Reading
  document.getElementById('reading-en').textContent = zData.desc_en;
  document.getElementById('reading-zh').textContent = zData.desc_zh;

  // Compatibility
  renderCompat(animal, zData);

  // Lucky
  renderLucky(zData.lucky);

  showScreen('results');

  // Animate progress rings after screen shows
  setTimeout(() => animateFortune(fortune), 300);
}

/* ── Four Pillars ── */
function renderPillars(pillars) {
  const labels = ['Year','Month','Day','Hour'];
  const row = document.getElementById('pillars-row');
  row.innerHTML = pillars.map((p, i) => {
    if (!p.known) {
      return `<div class="pillar-card dimmed">
        <div class="pillar-label">${labels[i]}</div>
        <div style="font-size:11px;color:var(--muted);margin-top:8px">Unknown</div>
      </div>`;
    }
    const elColor = EL_COLOR[p.stem.element];
    return `<div class="pillar-card">
      <div class="pillar-label">${labels[i]}</div>
      <div class="pillar-stem-char" style="color:${elColor}">${p.stem.char}</div>
      <div class="pillar-stem-name">${p.stem.pinyin}</div>
      <div class="pillar-sep"></div>
      <div class="pillar-branch-char">${p.branch.char}</div>
      <div class="pillar-animal-emoji">${p.branch.emoji}</div>
      <div class="pillar-animal-name">${p.branch.animal}</div>
      <div class="pillar-el-dot" style="background:${EL_COLOR[p.branch.element]}"></div>
    </div>`;
  }).join('');
}

/* ── Element Radar (pentagon SVG) ── */
function renderRadar(elements) {
  const svg = document.getElementById('radar-svg');
  const cx = 100, cy = 95, r = 75;
  const els = ['Wood','Fire','Earth','Metal','Water'];
  const angles = [-90, -18, 54, 126, 198].map(a => a * Math.PI / 180);
  const total = Object.values(elements).reduce((a,b) => a+b, 0) || 1;

  function pt(idx, scale) {
    const a = angles[idx];
    return [cx + r * scale * Math.cos(a), cy + r * scale * Math.sin(a)];
  }

  // Background pentagon
  const bgPts = angles.map((_,i) => pt(i, 1).join(',')).join(' ');
  // Inner grid lines (25%, 50%, 75%)
  const gridLines = [0.25, 0.5, 0.75].map(s => {
    const pts = angles.map((_,i) => pt(i, s).join(',')).join(' ');
    return `<polygon points="${pts}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>`;
  }).join('');

  // Data polygon
  const scores = els.map(el => (elements[el] / total));
  const dataPts = scores.map((s, i) => pt(i, 0.15 + s * 0.85).join(',')).join(' ');
  const dominantEl = els[scores.indexOf(Math.max(...scores))];
  const fillColor = EL_COLOR[dominantEl];

  // Axis lines
  const axisLines = angles.map((_,i) => {
    const [x,y] = pt(i, 1);
    return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>`;
  }).join('');

  // Labels
  const labelOffsets = [[0,-14],[18,-4],[12,14],[-12,14],[-18,-4]];
  const labelEls = els.map((el, i) => {
    const [x,y] = pt(i, 1.18);
    return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle"
      font-family="Space Grotesk, sans-serif" font-size="9" font-weight="700"
      fill="${EL_COLOR[el]}" letter-spacing="1">${el.toUpperCase()}</text>`;
  }).join('');

  svg.innerHTML = `
    ${gridLines}
    <polygon points="${bgPts}" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    ${axisLines}
    <polygon id="data-poly" points="${dataPts}" fill="${fillColor}25" stroke="${fillColor}" stroke-width="1.5" opacity="0">
      <animate attributeName="opacity" from="0" to="1" dur="0.8s" fill="freeze" begin="0.2s"/>
    </polygon>
    ${labelEls}
  `;

  // Legend bars
  const legend = document.getElementById('element-legend');
  legend.innerHTML = els.map(el => {
    const count = elements[el];
    const pct = Math.round(count / total * 100);
    return `<div class="legend-item">
      <div class="legend-dot" style="background:${EL_COLOR[el]}"></div>
      <div class="legend-info">
        <span class="legend-name">${el}</span>
        <div class="legend-bar-track">
          <div class="legend-bar-fill" style="width:0%;background:${EL_COLOR[el]}"
            data-pct="${pct}"></div>
        </div>
      </div>
    </div>`;
  }).join('');

  // Animate bars
  setTimeout(() => {
    legend.querySelectorAll('.legend-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.pct + '%';
    });
  }, 300);
}

/* ── Fortune Cards ── */
const FORTUNE_META = [
  { key:'love',   icon:'❤️',  label:'Love',   color:'#f43f5e', circ:138 },
  { key:'career', icon:'💼',  label:'Career', color:'#8b5cf6', circ:138 },
  { key:'health', icon:'🌿',  label:'Health', color:'#22c55e', circ:138 },
  { key:'wealth', icon:'💰',  label:'Wealth', color:'#f59e0b', circ:138 },
];

function renderFortune(fortune) {
  const grid = document.getElementById('fortune-grid');
  grid.innerHTML = FORTUNE_META.map(m => `
    <div class="fortune-card">
      <div class="fortune-icon">${m.icon}</div>
      <div class="fortune-label">${m.label}</div>
      <div class="fortune-ring-wrap">
        <svg class="fortune-ring-svg" viewBox="0 0 44 44">
          <circle class="ring-bg"   cx="22" cy="22" r="18"/>
          <circle class="ring-fill" cx="22" cy="22" r="18"
            id="ring-${m.key}" stroke="${m.color}" stroke-dasharray="0 113"/>
        </svg>
        <div class="fortune-score" id="score-${m.key}" style="color:${m.color}">0</div>
      </div>
    </div>
  `).join('');
}

function animateFortune(fortune) {
  FORTUNE_META.forEach(m => {
    const pct   = fortune[m.key] / 100;
    const circ  = 113; // 2πr where r=18
    const dash  = pct * circ;
    const ring  = document.getElementById(`ring-${m.key}`);
    const score = document.getElementById(`score-${m.key}`);
    if (!ring) return;
    ring.style.transition = 'stroke-dasharray 1.4s ease';
    ring.setAttribute('stroke-dasharray', `${dash} ${circ}`);
    // Count up number
    let n = 0;
    const target = fortune[m.key];
    const iv = setInterval(() => {
      n = Math.min(n + 2, target);
      score.textContent = n;
      if (n >= target) clearInterval(iv);
    }, 20);
  });
}

/* ── Compatibility ── */
function renderCompat(animal, zData) {
  const wrap = document.getElementById('compat-wrap');
  const goodRow = zData.compat.map(a => {
    const d = ZODIAC[a];
    return `<span class="compat-chip good">${BRANCHES.find(b=>b.animal===a)?.emoji} ${a}</span>`;
  }).join('');
  const badRow = zData.clash.map(a => {
    return `<span class="compat-chip bad">${BRANCHES.find(b=>b.animal===a)?.emoji} ${a}</span>`;
  }).join('');
  wrap.innerHTML = `
    <div class="compat-group">
      <div class="compat-group-label">Best matches ✦</div>
      <div class="compat-row">${goodRow}</div>
    </div>
    <div class="compat-group">
      <div class="compat-group-label">Challenging</div>
      <div class="compat-row">${badRow}</div>
    </div>
  `;
}

/* ── Lucky Items ── */
function renderLucky(lucky) {
  const grid = document.getElementById('lucky-grid');
  grid.innerHTML = `
    <div class="lucky-card">
      <div class="lucky-icon">🎨</div>
      <div class="lucky-title">Colors</div>
      <div class="lucky-values">
        ${lucky.colors.map(c=>`<span class="lucky-val">${c}</span>`).join('')}
      </div>
    </div>
    <div class="lucky-card">
      <div class="lucky-icon">🎲</div>
      <div class="lucky-title">Numbers</div>
      <div class="lucky-values">
        ${lucky.numbers.map(n=>`<span class="lucky-val">${n}</span>`).join('')}
      </div>
    </div>
    <div class="lucky-card">
      <div class="lucky-icon">🧭</div>
      <div class="lucky-title">Direction</div>
      <div class="lucky-values">
        <span class="lucky-val">${lucky.dir}</span>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════
   Language Toggle
═══════════════════════════════════════ */
let isZh = false;

function toggleLang() {
  isZh = !isZh;
  document.querySelectorAll('.en').forEach(el => el.classList.toggle('hide', isZh));
  document.querySelectorAll('.zh').forEach(el => el.classList.toggle('hide', !isZh));
  const btn = document.getElementById('lang-btn');
  btn.textContent = isZh ? 'EN' : '中文';
  btn.classList.toggle('zh-active', isZh);
}

/* ── Init ── */
buildStars();

