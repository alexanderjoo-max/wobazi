/* ═══════════════════════════════════════
   WOBAZI — BaZi Calculation Engine (UMD)
   Shared between client (script.js) and server (server.js)
═══════════════════════════════════════ */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BaziEngine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

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

  /* ── Zodiac Data ── */
  const ZODIAC = {
    Rat:     { traits:['Clever','Charming','Resourceful'],  compat:['Ox','Dragon','Monkey'],  clash:['Horse','Rooster'],  lucky:{ colors:['Blue','Gold','Green'],    numbers:[2,3],    dir:'North'    }, fortune:{ love:78, career:88, health:72, wealth:85 }, desc_en:'The Rat is a master strategist — endlessly curious, quick-witted, and magnetic.' },
    Ox:      { traits:['Dependable','Patient','Strong'],    compat:['Rat','Snake','Rooster'], clash:['Goat','Dragon'],    lucky:{ colors:['Yellow','White','Green'], numbers:[1,4],    dir:'Northeast' }, fortune:{ love:70, career:85, health:80, wealth:82 }, desc_en:'The Ox is the bedrock of the zodiac — steadfast, hardworking, and deeply reliable.' },
    Tiger:   { traits:['Bold','Magnetic','Fearless'],       compat:['Horse','Dog','Pig'],     clash:['Monkey','Snake'],   lucky:{ colors:['Blue','Grey','Orange'],   numbers:[1,3,4],  dir:'East'     }, fortune:{ love:82, career:80, health:85, wealth:74 }, desc_en:'The Tiger commands any room it enters — brave, passionate, and intensely driven.' },
    Rabbit:  { traits:['Graceful','Intuitive','Diplomatic'],compat:['Goat','Pig','Dog'],     clash:['Rooster','Dragon'], lucky:{ colors:['Pink','Purple','Blue'],   numbers:[3,4,9],  dir:'East'     }, fortune:{ love:88, career:74, health:78, wealth:76 }, desc_en:'The Rabbit moves through life with effortless grace and emotional intelligence.' },
    Dragon:  { traits:['Visionary','Powerful','Lucky'],     compat:['Rat','Monkey','Rooster'],clash:['Dog','Rabbit'],     lucky:{ colors:['Gold','Silver','Teal'],  numbers:[1,6,7],  dir:'East'     }, fortune:{ love:80, career:92, health:76, wealth:90 }, desc_en:'The Dragon is ambitious, lucky, and destined for greatness.' },
    Snake:   { traits:['Wise','Mysterious','Elegant'],      compat:['Ox','Rooster','Monkey'], clash:['Tiger','Pig'],      lucky:{ colors:['Black','Red','Yellow'],   numbers:[2,8,9],  dir:'South'    }, fortune:{ love:85, career:86, health:70, wealth:88 }, desc_en:'The Snake is the philosopher of the zodiac — profound, perceptive, and quietly powerful.' },
    Horse:   { traits:['Free-spirited','Energetic','Wild'], compat:['Tiger','Dog','Goat'],    clash:['Rat','Ox'],         lucky:{ colors:['Yellow','Green','Brown'],  numbers:[2,3,7],  dir:'South'    }, fortune:{ love:84, career:78, health:90, wealth:72 }, desc_en:'The Horse lives for freedom and adventure — wildly independent and full of energy.' },
    Goat:    { traits:['Creative','Gentle','Empathetic'],   compat:['Rabbit','Horse','Pig'],  clash:['Ox','Dog'],         lucky:{ colors:['Brown','Red','Purple'],   numbers:[2,7],    dir:'Southwest' }, fortune:{ love:86, career:72, health:76, wealth:70 }, desc_en:'The Goat is the artist and healer of the zodiac — creative and deeply empathetic.' },
    Monkey:  { traits:['Inventive','Witty','Unstoppable'],  compat:['Rat','Dragon','Snake'],  clash:['Tiger','Pig'],      lucky:{ colors:['White','Blue','Gold'],    numbers:[1,7,8],  dir:'Northwest' }, fortune:{ love:76, career:90, health:82, wealth:86 }, desc_en:'The Monkey is pure intellectual electricity — inventive, adaptable, and clever.' },
    Rooster: { traits:['Precise','Confident','Loyal'],      compat:['Ox','Snake','Dragon'],   clash:['Rabbit','Dog'],     lucky:{ colors:['Gold','Brown','Yellow'],  numbers:[5,7,8],  dir:'West'     }, fortune:{ love:74, career:84, health:80, wealth:82 }, desc_en:'The Rooster sets the standard — meticulous, disciplined, and supremely self-aware.' },
    Dog:     { traits:['Loyal','Just','Protective'],        compat:['Tiger','Rabbit','Horse'], clash:['Dragon','Rooster'], lucky:{ colors:['Green','Red','Purple'],   numbers:[3,4,9],  dir:'East'     }, fortune:{ love:90, career:76, health:84, wealth:74 }, desc_en:'The Dog is the guardian of the zodiac — fiercely loyal, principled, and protective.' },
    Pig:     { traits:['Generous','Sincere','Optimistic'],  compat:['Tiger','Rabbit','Goat'], clash:['Snake','Monkey'],   lucky:{ colors:['Yellow','Grey','Brown'],  numbers:[2,5,8],  dir:'Northwest' }, fortune:{ love:88, career:74, health:78, wealth:76 }, desc_en:'The Pig radiates warmth and abundance — generous, optimistic, and sincere.' },
  };

  /* ── Element Colors ── */
  const EL_COLOR = {
    Wood:  '#22c55e',
    Fire:  '#ef4444',
    Earth: '#f59e0b',
    Metal: '#94a3b8',
    Water: '#3b82f6',
  };
  const EL_ZH    = { Wood:'木', Fire:'火', Earth:'土', Metal:'金', Water:'水' };
  const ANIMAL_ZH = {
    Rat:'鼠', Ox:'牛', Tiger:'虎', Rabbit:'兔', Dragon:'龙', Snake:'蛇',
    Horse:'马', Goat:'羊', Monkey:'猴', Rooster:'鸡', Dog:'狗', Pig:'猪',
  };

  /* ── Month Branch lookup ── */
  const MONTH_BRANCH = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0];

  /* ── Hour Branch ── */
  function hourToBranch(h) {
    return Math.floor(((h + 1) % 24) / 2);
  }

  /* ── BaZi Calculation ── */
  function calcBazi(year, month, day, hour) {
    const yStemIdx   = ((year - 4) % 10 + 10) % 10;
    const yBranchIdx = ((year - 4) % 12 + 12) % 12;

    const mBranchIdx = MONTH_BRANCH[month];
    const mStemBase  = (yStemIdx % 5) * 2;
    const mOffset    = (mBranchIdx - 2 + 12) % 12;
    const mStemIdx   = (mStemBase + mOffset) % 10;

    const ref = new Date(2000, 0, 7);
    const birthDay = new Date(year, month, day);
    const diffDays = Math.round((birthDay - ref) / 86400000);
    const dCyclePos = ((diffDays % 60) + 60) % 60;
    const dStemIdx   = dCyclePos % 10;
    const dBranchIdx = dCyclePos % 12;

    let hStemIdx = null, hBranchIdx = null;
    if (hour !== null) {
      hBranchIdx = hourToBranch(hour);
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

  /* ── Element Balance ── */
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

  /* ── Fortune Scores ── */
  function calcFortune(animal, elements) {
    const base = { ...ZODIAC[animal].fortune };
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

  /* ── Get Dominant Element ── */
  function getDominant(elements) {
    return Object.entries(elements).sort((a,b) => b[1]-a[1])[0][0];
  }

  /* ── Five Element Cycles ── */
  const PRODUCTION_CYCLE = ['Wood','Fire','Earth','Metal','Water'];
  const CONTROL_CYCLE = { Wood:'Earth', Earth:'Water', Water:'Fire', Fire:'Metal', Metal:'Wood' };

  return {
    STEMS, BRANCHES, ZODIAC, EL_COLOR, EL_ZH, ANIMAL_ZH,
    MONTH_BRANCH, hourToBranch,
    calcBazi, calcElements, calcFortune, getDominant,
    PRODUCTION_CYCLE, CONTROL_CYCLE,
  };
}));
