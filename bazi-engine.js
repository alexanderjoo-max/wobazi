/* ═══════════════════════════════════════
   WOBAZI — BaZi Calculation Engine (UMD)
   Shared between client (script.js) and server (server.js)

   Accuracy rules (this file is the source of truth):
   A. Year pillar changes at 立春 (Lichun), NOT Jan 1 and NOT 春节.
   B. Month pillar follows the 12 节 (立春/惊蛰/清明/立夏/芒种/小暑/
      立秋/白露/寒露/立冬/大雪/小寒), not civil months.
   C. Day pillar is the sexagenary day from Julian Day at civil noon
      (offset −11; 2000-01-07 = 甲子).
   D. Hour convention — 夜子时 / “Exact2 day + Exact hour” (6tail sect 2):
      - 子时 = 23:00–00:59.
      - Day pillar changes at 00:00 civil midnight, NOT at 23:00.
      - Early 子时 (23:00–23:59): hour stem from the NEXT civil day’s stem.
      - Late 子时 (00:00–00:59): hour stem from the current civil day’s stem.
   E. Lunar input is converted to a Gregorian civil date first, then A–D.
   F. Hidden stems (藏干) are attached to each branch for 十神 / counts.

   Calendar type (solar/lunar) converts the DATE. It is not true solar time.
   True solar time (longitude + equation of time) is Phase 2.
   Default tzOffsetMinutes = +480 (UTC+8), the usual 排盘 default when
   no birth timezone is supplied. 节气 instants ~5–10 min vs 寿星天文历.
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

  /* Legacy civil-month lookup — WRONG for BaZi. Kept only so old callers
     that still index MONTH_BRANCH do not explode. Do not use for 排盘. */
  const MONTH_BRANCH = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0];

  const PRODUCTION_CYCLE = ['Wood','Fire','Earth','Metal','Water'];
  const CONTROL_CYCLE = { Wood:'Earth', Earth:'Water', Water:'Fire', Fire:'Metal', Metal:'Wood' };

  const HOUR_CONVENTION = {
    id: 'ye-zi-hour-stem',
    name: 'Early 子时 uses next civil day’s hour stem',
    dayBoundary: '00:00 civil midnight — the day pillar does not change at 23:00',
    earlyZi: '23:00–23:59 is 子时; hour stem from the next civil day’s stem',
    lateZi: '00:00–00:59 is 子时; hour stem from the current civil day’s stem',
  };

  /* Ziping 藏干: main / mid / residual */
  const HIDDEN_STEMS = [
    [{ i:9, role:'main' }],                         // 子 癸
    [{ i:5, role:'main' }, { i:9, role:'mid' }, { i:7, role:'residual' }], // 丑 己癸辛
    [{ i:0, role:'main' }, { i:2, role:'mid' }, { i:4, role:'residual' }], // 寅 甲丙戊
    [{ i:1, role:'main' }],                         // 卯 乙
    [{ i:4, role:'main' }, { i:1, role:'mid' }, { i:9, role:'residual' }], // 辰 戊乙癸
    [{ i:2, role:'main' }, { i:6, role:'mid' }, { i:4, role:'residual' }], // 巳 丙庚戊
    [{ i:3, role:'main' }, { i:5, role:'mid' }],     // 午 丁己
    [{ i:5, role:'main' }, { i:3, role:'mid' }, { i:1, role:'residual' }], // 未 己丁乙
    [{ i:6, role:'main' }, { i:8, role:'mid' }, { i:4, role:'residual' }], // 申 庚壬戊
    [{ i:7, role:'main' }],                         // 酉 辛
    [{ i:4, role:'main' }, { i:7, role:'mid' }, { i:3, role:'residual' }], // 戌 戊辛丁
    [{ i:8, role:'main' }, { i:0, role:'mid' }],     // 亥 壬甲
  ];
  const HIDDEN_WEIGHT = { main: 0.5, mid: 0.3, residual: 0.2 };

  const TEN_GODS = [
    { id:'friend',             en:'Friend',             zh:'比肩', th:'เพื่อน',     family:'peer' },
    { id:'rob_wealth',         en:'Rob Wealth',         zh:'劫財', th:'ชิงทรัพย์',  family:'peer' },
    { id:'eating_god',         en:'Eating God',         zh:'食神', th:'食神',        family:'output' },
    { id:'hurting_officer',    en:'Hurting Officer',    zh:'傷官', th:'ทำร้ายราช',  family:'output' },
    { id:'direct_wealth',      en:'Direct Wealth',      zh:'正財', th:'ทรัพย์ตรง',   family:'wealth' },
    { id:'indirect_wealth',    en:'Indirect Wealth',    zh:'偏財', th:'ทรัพย์เอียง', family:'wealth' },
    { id:'direct_officer',     en:'Direct Officer',     zh:'正官', th:'ขุนนางตรง',  family:'officer' },
    { id:'seven_killings',     en:'Seven Killings',     zh:'七殺', th:'เจ็ดฆ่า',    family:'officer' },
    { id:'direct_resource',    en:'Direct Resource',    zh:'正印', th:'ตราประทับ',  family:'resource' },
    { id:'indirect_resource',  en:'Indirect Resource',  zh:'偏印', th:'ตราเอียง',    family:'resource' },
  ];
  const TEN_GOD_BY_ID = {};
  TEN_GODS.forEach(g => { TEN_GOD_BY_ID[g.id] = g; });

  const TEN_GOD_MEANING = {
    friend:            { en:'Your own tribe — peers, comparison, “I do it myself.”', zh:'同辈与自我对照，凡事亲力亲为。', th:'เผ่าของตัวเอง — เพื่อน การเทียบ และทำเอง' },
    rob_wealth:        { en:'Competition beside you — charm, rivalry, shared pots.', zh:'身边的竞争与魅力，资源容易被分走。', th:'การแข่งขันข้างตัว — เสน่ห์และการแย่งส่วน' },
    eating_god:        { en:'Talent that feeds you — making, teaching, gentle output.', zh:'才情养活自己：创作、传授、温和的输出。', th:'พรสวรรค์ที่เลี้ยงคุณ — สร้าง สอน ปล่อยอย่างนุ่ม' },
    hurting_officer:   { en:'Sharp expression — critique, style, breaking stale rules.', zh:'锋芒表达：挑剔、风格、打破旧规。', th:'การแสดงที่คม — วิจารณ์ สไตล์ ทำลายกฎเก่า' },
    direct_wealth:     { en:'Earned assets — salary, stewardship, what you can count.', zh:'正当之财：薪水、经营、数得清的东西。', th:'ทรัพย์ที่ได้มา — เงินเดือน การดูแล สิ่งที่นับได้' },
    indirect_wealth:   { en:'Windfall and appetite — deals, desire, other people’s money.', zh:'偏财与欲望：机会、交易、别人口袋里的钱。', th:'โชคและปาก — ดีล ความอยาก เงินของคนอื่น' },
    direct_officer:    { en:'Structure that holds you — titles, law, a boss you respect.', zh:'约束与名分：职位、规矩、你服气的权威。', th:'โครงสร้างที่พยุง — ตำแหน่ง กติกา เจ้านายที่นับถือ' },
    seven_killings:    { en:'Pressure that forges you — conflict, courage, high stakes.', zh:'压力炼人：冲突、勇气、高风险的局。', th:'แรงกดที่หล่อคุณ — ขัดแย้ง กล้า เดิมพันสูง' },
    direct_resource:   { en:'Support that mothers you — study, rest, being backed.', zh:'正印生身：学习、休养、被人托住。', th:'แรงหนุนที่โอบ — เรียน พัก และมีคนรับ' },
    indirect_resource: { en:'Unconventional fuel — odd mentors, intuition, sideways help.', zh:'偏印杂气：奇人指点、直觉、斜里来的助力。', th:'เชื้อเพลิงแปลก — พี่เลี้ยงไม่ธรรมดา สัญชาตญาณ' },
  };

  /* ── 六冲 / 六合 / 六害 ── */
  const CLASH =  { 0:6, 6:0, 1:7, 7:1, 2:8, 8:2, 3:9, 9:3, 4:10, 10:4, 5:11, 11:5 };
  const COMBINE = { 0:1, 1:0, 2:11, 11:2, 3:10, 10:3, 4:9, 9:4, 5:8, 8:5, 6:7, 7:6 };
  const HARM =    { 0:7, 7:0, 1:6, 6:1, 2:5, 5:2, 3:4, 4:3, 8:11, 11:8, 9:10, 10:9 };

  function isPunish(a, b) {
    const groups = [[2, 5, 8], [1, 7, 10]]; // 寅巳申, 丑未戌
    for (let g = 0; g < groups.length; g++) {
      if (groups[g].indexOf(a) >= 0 && groups[g].indexOf(b) >= 0 && a !== b) return true;
    }
    if ((a === 0 && b === 3) || (a === 3 && b === 0)) return true; // 子卯
    if (a === b && (a === 4 || a === 6 || a === 9 || a === 11)) return true; // 自刑
    return false;
  }

  /* ═══════════════════════════════════════
     Lunar calendar 1900–2100
     Classic bit table (春节 lengths + leap month).
     1900-01-31 Gregorian = lunar 1900-01-01.
  ═══════════════════════════════════════ */
  const LUNAR_INFO = [
    0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
    0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
    0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
    0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
    0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
    0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,
    0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
    0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,
    0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
    0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
    0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
    0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
    0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
    0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
    0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
    0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0,
    0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,
    0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,
    0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,
    0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,
    0x0d520,
  ];

  function leapMonth(y) {
    if (y < 1900 || y > 2100) return 0;
    return LUNAR_INFO[y - 1900] & 0xf;
  }
  function leapDays(y) {
    if (!leapMonth(y)) return 0;
    return (LUNAR_INFO[y - 1900] & 0x10000) ? 30 : 29;
  }
  function lunarMonthDays(y, m) {
    return (LUNAR_INFO[y - 1900] & (0x10000 >> m)) ? 30 : 29;
  }
  function lYearDays(y) {
    let sum = 348;
    for (let i = 0x8000; i > 0x8; i >>= 1) sum += (LUNAR_INFO[y - 1900] & i) ? 1 : 0;
    return sum + leapDays(y);
  }

  function lunarToSolar(ly, lm, ld, isLeap) {
    if (ly < 1900 || ly > 2100) throw new Error('Lunar year out of range (1900–2100)');
    if (lm < 1 || lm > 12) throw new Error('Lunar month must be 1–12');
    const leap = leapMonth(ly);
    if (isLeap && leap !== lm) {
      throw new Error('No leap month ' + lm + ' in lunar year ' + ly + (leap ? ' (leap is ' + leap + ')' : ''));
    }
    const maxDay = isLeap ? leapDays(ly) : lunarMonthDays(ly, lm);
    if (ld < 1 || ld > maxDay) throw new Error('Lunar day out of range for that month');

    let offset = 0;
    for (let y = 1900; y < ly; y++) offset += lYearDays(y);
    for (let m = 1; m < lm; m++) {
      offset += lunarMonthDays(ly, m);
      if (leap === m) offset += leapDays(ly);
    }
    if (isLeap) offset += lunarMonthDays(ly, lm);
    offset += ld - 1;
    const dt = new Date(Date.UTC(1900, 0, 31) + offset * 86400000);
    return { year: dt.getUTCFullYear(), month: dt.getUTCMonth() + 1, day: dt.getUTCDate() };
  }

  function getLunarMonthLength(ly, lm, isLeap) {
    if (ly < 1900 || ly > 2100) return 30;
    if (isLeap) return leapMonth(ly) === lm ? leapDays(ly) : 0;
    return lunarMonthDays(ly, lm);
  }

  /* ═══════════════════════════════════════
     节气 — Meeus apparent solar longitude
     termIndex 0=小寒 (285°) … 23=冬至 (270°)
     The 12 节 (month boundaries) are the even indices.
  ═══════════════════════════════════════ */
  const JIE_NAMES = [
    '小寒','大寒','立春','雨水','惊蛰','春分','清明','谷雨',
    '立夏','小满','芒种','夏至','小暑','大暑','立秋','处暑',
    '白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至',
  ];
  /* Even-index 节 → month branch after that 节 fires */
  const JIE_TO_BRANCH = {
    0: 1,  // 小寒 → 丑
    2: 2,  // 立春 → 寅
    4: 3,  // 惊蛰 → 卯
    6: 4,  // 清明 → 辰
    8: 5,  // 立夏 → 巳
    10: 6, // 芒种 → 午
    12: 7, // 小暑 → 未
    14: 8, // 立秋 → 申
    16: 9, // 白露 → 酉
    18: 10,// 寒露 → 戌
    20: 11,// 立冬 → 亥
    22: 0, // 大雪 → 子
  };

  function sind(deg) { return Math.sin(deg * Math.PI / 180); }

  function julianDay(y, m, d, hour, minute) {
    let year = y, month = m;
    const day = d + ((hour || 0) + (minute || 0) / 60) / 24;
    if (month <= 2) { year -= 1; month += 12; }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
  }

  function apparentSolarLongitude(jd) {
    const T = (jd - 2451545.0) / 36525.0;
    let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    L0 = ((L0 % 360) + 360) % 360;
    const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sind(M)
            + (0.019993 - 0.000101 * T) * sind(2 * M)
            + 0.000289 * sind(3 * M);
    const omega = 125.04 - 1934.136 * T;
    let lambda = L0 + C - 0.00569 - 0.00478 * sind(omega);
    return ((lambda % 360) + 360) % 360;
  }

  function deltaTSeconds(year) {
    const t = year - 2000;
    return 62.92 + 0.32217 * t + 0.005589 * t * t;
  }

  const _jieqiCache = {};
  function jieqiJD(year, termIndex) {
    const key = year + ':' + termIndex;
    if (_jieqiCache[key] != null) return _jieqiCache[key];
    const target = (285 + termIndex * 15) % 360;
    const approxDay = 5.5 + termIndex * 15.2184;
    let jd = julianDay(year, 1, 1, 0, 0) + approxDay;
    for (let i = 0; i < 16; i++) {
      const lon = apparentSolarLongitude(jd);
      let diff = target - lon;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      jd += diff / 0.98564736;
    }
    jd -= deltaTSeconds(year) / 86400;
    _jieqiCache[key] = jd;
    return jd;
  }

  function getLichunJD(year) { return jieqiJD(year, 2); }

  /* ── Hour branch: 23–00 子, 1–2 丑, … 21–22 亥 ── */
  function hourToBranch(h) {
    return Math.floor(((h + 1) % 24) / 2);
  }

  function hiddenForBranch(branchIdx) {
    return (HIDDEN_STEMS[branchIdx] || []).map(h => ({
      stem: STEMS[h.i],
      role: h.role,
      weight: HIDDEN_WEIGHT[h.role],
    }));
  }

  /* 十神: Day Master vs a target stem */
  function calcTenGod(dmEl, dmPol, targetEl, targetPol) {
    const sameP = dmPol === targetPol;
    const prod = PRODUCTION_CYCLE;
    const ctrl = CONTROL_CYCLE;
    const iIdx = prod.indexOf(dmEl);
    const tIdx = prod.indexOf(targetEl);
    if (prod[(iIdx + 1) % 5] === targetEl) return sameP ? 'eating_god' : 'hurting_officer';
    if (prod[(tIdx + 1) % 5] === dmEl) return sameP ? 'indirect_resource' : 'direct_resource';
    if (ctrl[dmEl] === targetEl) return sameP ? 'indirect_wealth' : 'direct_wealth';
    if (ctrl[targetEl] === dmEl) return sameP ? 'seven_killings' : 'direct_officer';
    if (dmEl === targetEl) return sameP ? 'friend' : 'rob_wealth';
    return 'friend';
  }

  function tenGodLabel(id) {
    return TEN_GOD_BY_ID[id] || TEN_GODS[0];
  }

  function makePillar(label, stemIdx, branchIdx, known) {
    if (!known) {
      return { label, stem: null, branch: null, known: false, hidden: [] };
    }
    const stem = STEMS[stemIdx];
    const branch = BRANCHES[branchIdx];
    return {
      label,
      stem,
      branch,
      known: true,
      hidden: hiddenForBranch(branchIdx),
    };
  }

  /* Sexagenary day from civil Y-M-D (midnight convention).
     JDN at noon − 11; 2000-01-07 = 甲子. */
  function dayCycleFromYmd(y, m, d) {
    const jdNoon = julianDay(y, m, d, 12, 0);
    const offset = Math.floor(jdNoon) - 11;
    const cycle = ((offset % 60) + 60) % 60;
    return { stemIdx: cycle % 10, branchIdx: cycle % 12, cycle };
  }

  function yearStemBranchFromGregorianYear(gYear, utcJd, tzOffsetMinutes) {
    const lichunUtc = getLichunJD(gYear);
    let baziYear = gYear;
    if (utcJd < lichunUtc) baziYear = gYear - 1;
    const yStemIdx = ((baziYear - 4) % 10 + 10) % 10;
    const yBranchIdx = ((baziYear - 4) % 12 + 12) % 12;
    return { baziYear, yStemIdx, yBranchIdx, lichunUtc };
  }

  function monthStemBranchAt(utcJd, gYear) {
    /* Walk 节 of gYear-1 and gYear to find the latest 节 ≤ utcJd. */
    let bestTerm = 22; // 大雪 of previous year as fallback
    let bestYear = gYear - 1;
    let bestJd = jieqiJD(gYear - 1, 22);
    const scan = [gYear - 1, gYear, gYear + 1];
    for (let s = 0; s < scan.length; s++) {
      const yy = scan[s];
      for (let t = 0; t < 24; t += 2) {
        const jd = jieqiJD(yy, t);
        if (jd <= utcJd && jd >= bestJd) {
          bestJd = jd;
          bestTerm = t;
          bestYear = yy;
        }
      }
    }
    const mBranchIdx = JIE_TO_BRANCH[bestTerm];
    /* Month stem (五虎遁) uses the BaZi year that owns this 寅-based month.
       寅 months belong to the year of that 立春; 丑/子 after 大雪/小寒
       still belong to the previous BaZi year. */
    let yearForMonth = bestYear;
    if (bestTerm === 0) {
      /* 小寒: still the previous BaZi year (before 立春 of bestYear) */
      yearForMonth = bestYear - 1;
    } else if (bestTerm === 22) {
      /* 大雪: after 立春 of bestYear? 大雪 is Dec, after 立春 of same year. */
      yearForMonth = bestYear;
    }
    /* 立春 (term 2) and later 节 in the same year use that year's stem,
       except 小寒 (term 0) which is still last year — handled above.
       大雪 (term 22, Dec) is still that civil/BaZi year (after 立春). */
    const yStemIdx = ((yearForMonth - 4) % 10 + 10) % 10;
    /* 甲己 → 丙寅 as month 1 (寅). */
    const yinStem = (yStemIdx % 5) * 2 + 2;
    const monthOffset = (mBranchIdx - 2 + 12) % 12; // 寅 = 0
    const mStemIdx = (yinStem + monthOffset) % 10;
    return { mStemIdx, mBranchIdx, jieName: JIE_NAMES[bestTerm], jieJd: bestJd, yearForMonth };
  }

  /**
   * Accurate Four Pillars.
   * @param {object} opts
   * @param {number} opts.year
   * @param {number} opts.month  1–12
   * @param {number} opts.day
   * @param {number|null} [opts.hour]  0–23, or null if unknown
   * @param {number} [opts.minute]
   * @param {'solar'|'lunar'} [opts.calendar]
   * @param {boolean} [opts.leapMonth]
   * @param {number} [opts.tzOffsetMinutes]  east of UTC; default +480
   */
  function calcBaziAccurate(opts) {
    const calendar = (opts && opts.calendar) || 'solar';
    const leapMonthFlag = !!(opts && opts.leapMonth);
    const tzOffsetMinutes = (opts && opts.tzOffsetMinutes != null) ? opts.tzOffsetMinutes : 480;
    let year = opts.year, month = opts.month, day = opts.day;
    const hour = (opts.hour === undefined || opts.hour === null || opts.hour === '') ? null : Number(opts.hour);
    const minute = opts.minute != null ? Number(opts.minute) : 0;

    let lunar = null;
    if (calendar === 'lunar') {
      lunar = { year, month, day, leap: leapMonthFlag };
      const solar = lunarToSolar(year, month, day, leapMonthFlag);
      year = solar.year; month = solar.month; day = solar.day;
    }

    const localHour = hour == null ? 12 : hour;
    const localMin = hour == null ? 0 : minute;
    const localJd = julianDay(year, month, day, localHour, localMin);
    const utcJd = localJd - tzOffsetMinutes / 1440;

    const yInfo = yearStemBranchFromGregorianYear(year, utcJd, tzOffsetMinutes);
    const mInfo = monthStemBranchAt(utcJd, year);

    /* Day pillar: civil date at midnight. Early 子 does NOT roll the day. */
    let dayY = year, dayM = month, dayD = day;
    const dInfo = dayCycleFromYmd(dayY, dayM, dayD);

    let hStemIdx = null, hBranchIdx = null;
    if (hour != null) {
      hBranchIdx = hourToBranch(hour);
      let stemForHour = dInfo.stemIdx;
      if (hour === 23) {
        /* Early 子: next civil day’s stem */
        const next = new Date(Date.UTC(dayY, dayM - 1, dayD + 1));
        const nInfo = dayCycleFromYmd(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate());
        stemForHour = nInfo.stemIdx;
      }
      const hStemBase = (stemForHour % 5) * 2;
      hStemIdx = (hStemBase + hBranchIdx) % 10;
    }

    const pillars = [
      makePillar('Year',  yInfo.yStemIdx, yInfo.yBranchIdx, true),
      makePillar('Month', mInfo.mStemIdx, mInfo.mBranchIdx, true),
      makePillar('Day',   dInfo.stemIdx,  dInfo.branchIdx,  true),
      makePillar('Hour',  hStemIdx,       hBranchIdx,       hour != null),
    ];

    const dayMaster = pillars[2].stem;
    const tenGods = calcTenGodsProfile(pillars, dayMaster);

    return {
      pillars,
      solar: { year, month, day, hour, minute: hour == null ? null : minute },
      lunar,
      dayMaster,
      tenGods,
      hourConvention: HOUR_CONVENTION,
      usesTrueSolarTime: false,
      tzOffsetMinutes,
      jieqi: { monthJie: mInfo.jieName, baziYear: yInfo.baziYear },
    };
  }

  /* Legacy wrapper: month is 0-indexed (JS Date), hour integer or null.
     Existing client callers pass (y, m-1, d, h). */
  function calcBazi(year, month, day, hour) {
    const result = calcBaziAccurate({
      year,
      month: Number(month) + 1,
      day,
      hour: hour === undefined ? null : hour,
      calendar: 'solar',
    });
    return result.pillars;
  }

  function calcElements(pillars) {
    const counts = { Wood:0, Fire:0, Earth:0, Metal:0, Water:0 };
    for (let i = 0; i < pillars.length; i++) {
      const p = pillars[i];
      if (!p.known) continue;
      if (p.stem) counts[p.stem.element]++;
      if (p.branch) counts[p.branch.element]++;
    }
    return counts;
  }

  function calcElementsDetailed(pillars) {
    const counts = { Wood:0, Fire:0, Earth:0, Metal:0, Water:0 };
    for (let i = 0; i < pillars.length; i++) {
      const p = pillars[i];
      if (!p.known) continue;
      if (p.stem) counts[p.stem.element] += 1;
      const hidden = p.hidden || (p.branch ? hiddenForBranch(BRANCHES.indexOf(p.branch)) : []);
      for (let h = 0; h < hidden.length; h++) {
        counts[hidden[h].stem.element] += hidden[h].weight;
      }
    }
    return counts;
  }

  function calcFortune(animal, elements) {
    const base = Object.assign({}, ZODIAC[animal].fortune);
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

  function getDominant(elements) {
    return Object.entries(elements).sort((a,b) => b[1]-a[1])[0][0];
  }

  function calcTenGodsProfile(pillars, dayMaster) {
    const weights = {};
    const sources = {};
    TEN_GODS.forEach(g => { weights[g.id] = 0; sources[g.id] = []; });
    const dm = dayMaster || (pillars[2] && pillars[2].stem);
    if (!dm) {
      return { list: TEN_GODS.map(g => Object.assign({}, g, { weight: 0, percent: 0, sources: [] })), total: 0 };
    }

    function add(id, w, loc) {
      weights[id] += w;
      sources[id].push(loc);
    }

    for (let i = 0; i < pillars.length; i++) {
      const p = pillars[i];
      if (!p.known) continue;
      if (p.stem) {
        const id = calcTenGod(dm.element, dm.polarity, p.stem.element, p.stem.polarity);
        add(id, 1.0, { pillar: p.label, kind: 'stem', char: p.stem.char });
      }
      const hidden = p.hidden || hiddenForBranch(BRANCHES.indexOf(p.branch));
      for (let h = 0; h < hidden.length; h++) {
        const hs = hidden[h];
        const id = calcTenGod(dm.element, dm.polarity, hs.stem.element, hs.stem.polarity);
        add(id, hs.weight, { pillar: p.label, kind: 'hidden', role: hs.role, char: hs.stem.char });
      }
    }

    const total = Object.keys(weights).reduce((s, k) => s + weights[k], 0) || 1;
    const list = TEN_GODS.map(g => ({
      id: g.id,
      en: g.en,
      zh: g.zh,
      th: g.th,
      family: g.family,
      weight: weights[g.id],
      percent: Math.round((weights[g.id] / total) * 1000) / 10,
      sources: sources[g.id],
      meaning: TEN_GOD_MEANING[g.id],
    })).sort((a, b) => b.percent - a.percent || a.en.localeCompare(b.en));

    const top = list.filter(g => g.percent > 0).slice(0, 3);
    const sentence = {
      en: top.length
        ? 'This chart leans ' + top.map(g => g.en + ' ' + g.zh + ' (' + g.percent + '%)').join(', ') + '.'
        : 'Ten Gods are unreadable without a Day Master.',
      zh: top.length
        ? '此盘偏于' + top.map(g => g.zh + g.en + '（' + g.percent + '%）').join('、') + '。'
        : '缺少日主，十神无法排盘。',
      th: top.length
        ? 'แผนนี้เอียงไปทาง ' + top.map(g => g.en + ' ' + g.zh + ' (' + g.percent + '%)').join(', ')
        : 'ไม่มีวันมาสเตอร์ จึงจัดสิบเทพไม่ได้',
    };

    return { list, total, sentence, dayMaster: dm };
  }

  /* ── 流月: 节气 month that covers a civil month card ── */
  const FLOW_SAFE_DAY = [0, 8, 6, 8, 7, 7, 8, 9, 9, 9, 10, 9, 9];

  function getFlowMonth(civilYear, civilMonth) {
    const day = FLOW_SAFE_DAY[civilMonth] || 10;
    const r = calcBaziAccurate({
      year: civilYear,
      month: civilMonth,
      day,
      hour: 12,
      minute: 0,
      calendar: 'solar',
      tzOffsetMinutes: 480,
    });
    return {
      stem: r.pillars[1].stem,
      branch: r.pillars[1].branch,
      pillar: r.pillars[1].stem.char + r.pillars[1].branch.char,
      jie: r.jieqi.monthJie,
    };
  }

  function branchRelation(flowIdx, natalDayIdx, natalMonthIdx) {
    if (CLASH[flowIdx] === natalDayIdx || CLASH[flowIdx] === natalMonthIdx) return 'clash';
    if (COMBINE[flowIdx] === natalDayIdx || COMBINE[flowIdx] === natalMonthIdx) return 'combine';
    if (isPunish(flowIdx, natalDayIdx) || isPunish(flowIdx, natalMonthIdx)) return 'punish';
    if (HARM[flowIdx] === natalDayIdx || HARM[flowIdx] === natalMonthIdx) return 'harm';
    return null;
  }

  function elementRelation(flowEl, dmEl) {
    if (PRODUCTION_CYCLE[(PRODUCTION_CYCLE.indexOf(flowEl) + 1) % 5] === dmEl) return 'support';
    if (PRODUCTION_CYCLE[(PRODUCTION_CYCLE.indexOf(dmEl) + 1) % 5] === flowEl) return 'drain';
    if (CONTROL_CYCLE[flowEl] === dmEl) return 'control';
    if (CONTROL_CYCLE[dmEl] === flowEl) return 'wealth';
    if (flowEl === dmEl) return 'peer';
    return 'neutral';
  }

  function hash32(str) {
    let h = 2166136261;
    const s = String(str);
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  const TONE_EMOJI = {
    pursue: '🔥', receive: '💗', wait: '🌙', repair: '🕊', protect: '🛡',
    celebrate: '✨', reset: '🌪', deepen: '🌿', 'cut-clean': '✂', 'low-profile': '🕶',
  };

  const MONTHLY_DECKS = {
    love: {
      pursue: [
        { title_en:'Ask once, then wait', sub_en:'Name a time and stop circling the maybe.', title_zh:'问一次就停', sub_zh:'把时间说清楚，别再绕着“也许”转。', title_th:'ถามครั้งเดียว แล้วรอ', sub_th:'นัดเวลาให้ชัด แล้วเลิกวนคำว่า อาจจะ' },
        { title_en:'Choose one person', sub_en:'Scatter dilutes whatever is already warming.', title_zh:'只选一个人', sub_zh:'分散会把已经在升温的东西稀释掉。', title_th:'เลือกคนเดียว', sub_th:'การกระจายทำให้สิ่งที่อุ่นอยู่แล้วจาง' },
        { title_en:'Send the unsent note', sub_en:'A short honest line beats another week of drafts.', title_zh:'把没发的话发出去', sub_zh:'一句老实话，胜过再改一周的草稿。', title_th:'ส่งข้อความที่ค้าง', sub_th:'ประโยคสั้นที่จริง ดีกว่าแก้ร่างอีกอาทิตย์' },
        { title_en:'Make a small plan', sub_en:'Coffee on a real day outranks a floating hope.', title_zh:'定一个小计划', sub_zh:'把咖啡约在具体的一天，比悬着的希望有用。', title_th:'วางแผนเล็ก ๆ', sub_th:'กาแฟในวันจริง ดีกว่าความหวังลอย ๆ' },
      ],
      receive: [
        { title_en:'Let them come closer', sub_en:'You do not have to earn what is already walking in.', title_zh:'让对方走近', sub_zh:'已经走进来的，不必再靠表现去换。', title_th:'ให้เขาเข้ามาใกล้', sub_th:'ไม่ต้องหาให้ได้ สิ่งที่กำลังเดินเข้ามา' },
        { title_en:'Answer, don’t chase', sub_en:'The next move is a reply, not a campaign.', title_zh:'回应，而不是追', sub_zh:'下一步是回复，不是发动攻势。', title_th:'ตอบ อย่าไล่', sub_th:'ตาต่อไปคือการตอบ ไม่ใช่การรณรงค์' },
        { title_en:'Take the invitation', sub_en:'Someone already chose you this month — notice it.', title_zh:'接受邀请', sub_zh:'这个月已有人选定你，看见即可。', title_th:'รับคำชวน', sub_th:'เดือนนี้มีคนเลือกคุณแล้ว — สังเกตไว้' },
        { title_en:'Soften the armour', sub_en:'Receiving is the work; performing is the dodge.', title_zh:'把盔甲松一松', sub_zh:'真正的功课是接收，不是表演。', title_th:'ผ่อนเกราะ', sub_th:'งานคือการรับ การแสดงเป็นทางหนี' },
      ],
      wait: [
        { title_en:'Hold the line', sub_en:'Silence this month is information, not a verdict.', title_zh:'先守住', sub_zh:'这个月的沉默是信息，不是判决。', title_th:'รั้งเส้นไว้', sub_th:'ความเงียบเดือนนี้คือข้อมูล ไม่ใช่คำตัดสิน' },
        { title_en:'Do not fill the gap', sub_en:'The empty space is doing work you cannot rush.', title_zh:'别急着填空', sub_zh:'空档正在做事，你催不来。', title_th:'อย่าเติมช่องว่าง', sub_th:'ที่ว่างกำลังทำงาน คุณเร่งไม่ได้' },
        { title_en:'Keep your calendar light', sub_en:'One clear no protects three future yeses.', title_zh:'把日程留白', sub_zh:'一次清楚的拒绝，护住以后三次愿意。', title_th:'ปฏิทินให้โล่ง', sub_th:'คำว่าไม่ที่ชัด คุ้มสามคำว่าได้ในภายหลัง' },
        { title_en:'Watch, don’t interpret', sub_en:'What they do this month is the text. Skip the footnotes.', title_zh:'看行为，少解读', sub_zh:'这个月看对方做什么，别写脚注。', title_th:'ดู อย่าตีความ', sub_th:'สิ่งที่เขาทำคือเนื้อเรื่อง ข้ามเชิงอรรถ' },
      ],
      repair: [
        { title_en:'Name the old bruise', sub_en:'One precise apology beats a month of niceness.', title_zh:'把旧伤说清楚', sub_zh:'一句准确的道歉，胜过一个月的客气。', title_th:'เรียกชื่อรอยเก่า', sub_th:'คำขอโทษที่ตรง ดีกว่าสุภาพทั้งเดือน' },
        { title_en:'Fix the small slight', sub_en:'The tiny ignored thing is what keeps looping.', title_zh:'修那个小亏欠', sub_zh:'被忽略的小事，才是循环的源头。', title_th:'แก้เรื่องเล็กที่ค้าง', sub_th:'เรื่องเล็กที่ถูกมองข้าม คือสิ่งที่วนซ้ำ' },
        { title_en:'Reopen one door', sub_en:'A check-in, not a trial. Keep it short and clean.', title_zh:'重新开一扇门', sub_zh:'是问候，不是审判。短、干净。', title_th:'เปิดประตูบานหนึ่ง', sub_th:'ทัก ไม่ใช่ไต่สวน ให้สั้นและสะอาด' },
        { title_en:'Trade blame for timing', sub_en:'Ask when it went sideways, not who is worse.', title_zh:'用时机换指责', sub_zh:'问事情何时走偏，别比谁更坏。', title_th:'เอาจังหวะแทนโทษ', sub_th:'ถามว่าหลุดเมื่อไร ไม่ใช่ใครแย่กว่า' },
      ],
      protect: [
        { title_en:'Guard your evenings', sub_en:'Unavailable is a complete sentence this month.', title_zh:'守住晚上', sub_zh:'这个月，“我没空”已经是完整的句子。', title_th:'เฝ้าช่วงเย็น', sub_th:'เดือนนี้ คำว่าไม่ว่าง คือประโยคครบ' },
        { title_en:'Keep the circle small', sub_en:'New attention is noisy. Old trust is the filter.', title_zh:'圈子收小', sub_zh:'新的注意很吵，旧信任才是滤网。', title_th:'วงให้เล็ก', sub_th:'ความสนใจใหม่เสียงดัง ความไว้ใจเก่าคือตัวกรอง' },
        { title_en:'Do not explain the no', sub_en:'Over-explaining invites a negotiation you do not want.', title_zh:'拒绝不必解释', sub_zh:'解释太多，会把你拖进不想谈的价。', title_th:'ไม่ต้องอธิบายคำว่าไม่', sub_th:'อธิบายเกิน ชวนต่อรองที่คุณไม่ต้องการ' },
        { title_en:'Sleep before you reply', sub_en:'Heat in the chart; delay is the safety rail.', title_zh:'先睡再回', sub_zh:'盘上有火气，延迟就是护栏。', title_th:'นอนก่อนค่อยตอบ', sub_th:'ไฟในดวง ดีเลย์คือราวกันตก' },
      ],
      celebrate: [
        { title_en:'Mark a private win', sub_en:'Tell one person who already knows how to cheer you.', title_zh:'记下一次私下的胜', sub_zh:'只告诉那个本来就会为你高兴的人。', title_th:'ฉลองชัยส่วนตัว', sub_th:'บอกคนที่รู้วิธียินดีกับคุณอยู่แล้ว' },
        { title_en:'Keep the good night going', sub_en:'Do not audit a warm evening. Stay in it.', title_zh:'让好夜晚继续', sub_zh:'别审查一个温暖的晚上，留在里面。', title_th:'ค้างคืนดีไว้', sub_th:'อย่าตรวจทานค่ำที่อุ่น อยู่ในนั้น' },
        { title_en:'Say the fond thing', sub_en:'Affection unused this month goes stale. Spend it.', title_zh:'把喜欢说出口', sub_zh:'这个月不用的喜欢会变质，花掉它。', title_th:'พูดคำเอ็นดู', sub_th:'ความชอบที่ไม่ได้ใช้เดือนนี้จะเหม็น ใช้มัน' },
        { title_en:'Share a table', sub_en:'A meal together is the whole ritual. Nothing extra.', title_zh:'同坐一桌', sub_zh:'一起吃饭就是全部仪式，不必加戏。', title_th:'นั่งโต๊ะด้วยกัน', sub_th:'มื้อร่วมกันคือพิธีทั้งหมด ไม่ต้องเพิ่ม' },
      ],
      reset: [
        { title_en:'Clear the old thread', sub_en:'Archive the chat you reread. Start from a blank line.', title_zh:'清掉旧对话', sub_zh:'把反复翻看的聊天归档，从空白行开始。', title_th:'ล้างเธรดเก่า', sub_th:'เก็บแชทที่เปิดซ้ำ เริ่มจากบรรทัดว่าง' },
        { title_en:'Change the usual place', sub_en:'Same person, new room. Patterns crack easier that way.', title_zh:'换一个常去的地方', sub_zh:'还是那个人，换房间。惯性比较容易裂开。', title_th:'เปลี่ยนที่คุ้น', sub_th:'คนเดิม ห้องใหม่ แพทเทิร์นแตกง่ายกว่า' },
        { title_en:'Drop the old nickname', sub_en:'Language from last year does not fit this month.', title_zh:'丢掉旧称呼', sub_zh:'去年的叫法，套不上这个月。', title_th:'เลิกชื่อเล่นเก่า', sub_th:'ภาษาเมื่อปีก่อน ไม่เข้าเดือนนี้' },
        { title_en:'Begin as a stranger', sub_en:'Assume you do not know them yet. Ask a new question.', title_zh:'当陌生人重新开始', sub_zh:'假设你还不认识对方，问一个新问题。', title_th:'เริ่มแบบคนแปลกหน้า', sub_th:'สมมติว่ายังไม่รู้จัก ถามคำใหม่' },
      ],
      deepen: [
        { title_en:'Stay for the second hour', sub_en:'The useful conversation starts after the performance ends.', title_zh:'留下第二小时', sub_zh:'有用的话，出现在表演结束之后。', title_th:'อยู่ชั่วโมงที่สอง', sub_th:'บทสนทนาที่ใช้ได้ เริ่มหลังการแสดงจบ' },
        { title_en:'Ask a slower question', sub_en:'Not “how are you” — “what is heavy this week.”', title_zh:'问一个更慢的问题', sub_zh:'不是“你好吗”，是“这周什么最沉”。', title_th:'ถามคำที่ช้าลง', sub_th:'ไม่ใช่ สบายดีไหม — แต่ สัปดาห์นี้ อะไรหนัก' },
        { title_en:'Keep the same night', sub_en:'Repetition is intimacy this month, not boredom.', title_zh:'重复同一个夜晚', sub_zh:'这个月的亲密是重复，不是新鲜。', title_th:'คืนเดิม', sub_th:'เดือนนี้การซ้ำคือความใกล้ ไม่ใช่เบื่อ' },
        { title_en:'Tell the unspectacular truth', sub_en:'The ordinary detail is what actually binds you.', title_zh:'说那句不精彩的实话', sub_zh:'真正绑住你们的，是普通细节。', title_th:'พูดความจริงที่ไม่หวือหวา', sub_th:'รายละเอียดธรรมดา คือสิ่งที่ผูกจริง' },
      ],
      'cut-clean': [
        { title_en:'End the maybe', sub_en:'A clean close this month costs less than another loop.', title_zh:'结束那个也许', sub_zh:'这个月干净地结束，比再循环一轮便宜。', title_th:'จบคำว่าอาจจะ', sub_th:'ปิดให้สะอาดเดือนนี้ ถูกกว่าวนอีกรอบ' },
        { title_en:'Return the key', sub_en:'Literal or not. Something still in your pocket is overdue.', title_zh:'把钥匙还回去', sub_zh:'无论是不是真钥匙，口袋里还有不该留的东西。', title_th:'คืนกุญแจ', sub_th:'จริงหรือไม่ ของในกระเป๋ายังเกินกำหนด' },
        { title_en:'Stop the courtesy texts', sub_en:'Polite contact is keeping a door you mean to shut.', title_zh:'停掉客气的短信', sub_zh:'礼貌联络，是在撑一扇你打算关的门。', title_th:'เลิกข้อความสุภาพ', sub_th:'การทักสุภาพ กำลังค้างประตูที่ตั้งใจจะปิด' },
        { title_en:'Write it, don’t send twice', sub_en:'One message. Then the mute is the boundary.', title_zh:'写一次，别发第二次', sub_zh:'一条就够。然后免打扰就是边界。', title_th:'เขียนครั้งเดียว อย่าส่งซ้ำ', sub_th:'ข้อความเดียว จากนั้นปิดเสียงคือเส้น' },
      ],
      'low-profile': [
        { title_en:'Stay off the stage', sub_en:'Love that needs an audience will misread you this month.', title_zh:'别上台', sub_zh:'需要观众的感情，这个月会看错你。', title_th:'อย่าขึ้นเวที', sub_th:'รักที่ต้องการผู้ชม เดือนนี้จะอ่านคุณผิด' },
        { title_en:'Keep plans unposted', sub_en:'Private is not secretive. It is just quieter weather.', title_zh:'计划不必公开', sub_zh:'私下不是隐瞒，只是天气更静。', title_th:'ไม่ต้องโพสต์นัด', sub_th:'ส่วนตัวไม่ใช่ลับ แค่ลมฟ้าที่เงียบกว่า' },
        { title_en:'Skip the group night', sub_en:'One-to-one, or nothing. Crowds scramble the signal.', title_zh:'跳过群体之夜', sub_zh:'一对一，或者不要。人多会把信号搅乱。', title_th:'ข้ามคืนกลุ่ม', sub_th:'ตัวต่อตัว หรือไม่ต้อง ฝูงชนกวนสัญญาณ' },
        { title_en:'Wear the plain evening', sub_en:'No performance date. A walk is enough if it is honest.', title_zh:'过一个朴素的晚上', sub_zh:'不必演出约会。诚实的散步就够。', title_th:'เย็นธรรมดา', sub_th:'ไม่ต้องเดทโชว์ เดินที่จริงก็พอ' },
      ],
    },
    career: {
      pursue: [
        { title_en:'Put the ask in writing', sub_en:'A named request travels farther than a hinted one.', title_zh:'把请求写成字', sub_zh:'点名的请求，比暗示走得更远。', title_th:'เขียนคำขอลงไป', sub_th:'คำขอที่มีชื่อ เดินไกลกว่าคำใบ้' },
        { title_en:'Ship the ugly draft', sub_en:'Visible unfinished work beats a perfect private file.', title_zh:'交出难看的草稿', sub_zh:'能被看见的半成品，胜过完美的私藏。', title_th:'ส่งฉบับไม่สวย', sub_th:'งานที่ไม่เสร็จแต่เห็นได้ ดีกว่าไฟล์ส่วนตัวที่เพอร์เฟกต์' },
        { title_en:'Book the harder meeting', sub_en:'The room you are avoiding is the one that moves the number.', title_zh:'约那个更难的会', sub_zh:'你在躲的房间，才是能动数字的地方。', title_th:'จองประชุมที่ยากกว่า', sub_th:'ห้องที่เลี่ยง คือห้องที่ขยับตัวเลข' },
        { title_en:'Raise one stake', sub_en:'Pick a single deliverable and make it uncomfortably public.', title_zh:'把一个赌注抬高', sub_zh:'选一件交付，让它公开到让你发烫。', title_th:'ยกเดิมพันชิ้นเดียว', sub_th:'เลือกของส่งชิ้นเดียว แล้วทำให้สาธารณะจนร้อน' },
      ],
      receive: [
        { title_en:'Take the credit cleanly', sub_en:'Do not dilute a win by naming every helper first.', title_zh:'干净地接下功劳', sub_zh:'别先把每个帮手点名，把胜利稀释掉。', title_th:'รับเครดิตให้สะอาด', sub_th:'อย่าทำให้ชัยจางด้วยการยกทุกคนก่อน' },
        { title_en:'Let the intro land', sub_en:'Someone is opening a door. Walk through before you repay.', title_zh:'让介绍落地', sub_zh:'有人在开门。先走进去，再谈回报。', title_th:'ให้การแนะนำ落地', sub_th:'มีคนเปิดประตู เดินผ่านก่อนค่อยทดแทน' },
        { title_en:'Accept the slower yes', sub_en:'A delayed approval is still an approval. Stop poking it.', title_zh:'接受慢一点的同意', sub_zh:'迟到的批准仍是批准。别再戳。', title_th:'รับคำว่าได้ที่ช้า', sub_th:'การอนุมัติที่ช้า ก็ยังใช่ เลิกแหย่' },
        { title_en:'Use the offered help', sub_en:'Refusing support this month looks like control, not humility.', title_zh:'用上人家给的帮助', sub_zh:'这个月拒绝支援，看起来像控制，不像谦虚。', title_th:'ใช้ความช่วยที่ยื่นมา', sub_th:'เดือนนี้ปฏิเสธแรงหนุน ดูเป็นการควบคุม ไม่ใช่ถ่อม' },
      ],
      wait: [
        { title_en:'Hold the announcement', sub_en:'The chart wants a pause between done and declared.', title_zh:'先别宣布', sub_zh:'盘要你在做完和对外说之间留白。', title_th:'ชะลอประกาศ', sub_th:'ดวงอยากให้มีพัก ระหว่างเสร็จกับประกาศ' },
        { title_en:'Let the other side blink', sub_en:'Chasing a reply now trains them to stall.', title_zh:'让对方先眨眼', sub_zh:'现在去追回复，是在教对方拖延。', title_th:'ให้ฝั่งนั้นกระพริบก่อน', sub_th:'ไล่คำตอบตอนนี้ คือฝึกให้เขาถ่วง' },
        { title_en:'Keep the calendar honest', sub_en:'Pad the estimate. Speed is not the virtue this month.', title_zh:'把工期说老实', sub_zh:'把预估留余量。这个月快不是美德。', title_th:'ปฏิทินให้จริง', sub_th:'เผื่อเวลา เดือนนี้ความเร็วไม่ใช่คุณธรรม' },
        { title_en:'Watch the inbox, idle hands', sub_en:'Information is arriving. New initiatives can wait a beat.', title_zh:'看信箱，手别动', sub_zh:'信息在来。新动作可以再停一拍。', title_th:'ดูอินบ็อกซ์ มืออยู่นิ่ง', sub_th:'ข้อมูลกำลังมา โครงการใหม่รอจังหวะ' },
      ],
      repair: [
        { title_en:'Fix the quiet bug', sub_en:'The ignored process is what will trip the launch.', title_zh:'修那个没人提的漏洞', sub_zh:'被忽略的流程，会绊倒发布。', title_th:'แก้บั๊กเงียบ', sub_th:'กระบวนการที่ถูกมองข้าม จะสะดุดงานเปิดตัว' },
        { title_en:'Rewrite the messy brief', sub_en:'Alignment is cheaper now than a heroic salvage later.', title_zh:'重写混乱的简报', sub_zh:'现在对齐，比以后英勇抢救便宜。', title_th:'เขียนบรีฟใหม่', sub_th:'จัดให้ตรงตอนนี้ ถูกกว่ากู้ทีหลัง' },
        { title_en:'Own the missed date', sub_en:'A specific new date restores more trust than a vibe.', title_zh:'认下错过的日期', sub_zh:'一个具体的新日期，比气氛更能修信任。', title_th:'รับวันที่พลาด', sub_th:'วันใหม่ที่ชัด กู้ความไว้ใจได้มากกว่าโทน' },
        { title_en:'Patch the handoff', sub_en:'The gap between teams is the actual bottleneck.', title_zh:'补上交接缝', sub_zh:'组与组之间的缝，才是瓶颈。', title_th:'ปะจุดส่งมอบ', sub_th:'ช่องว่างระหว่างทีม คือคอขวดจริง' },
      ],
      protect: [
        { title_en:'Decline the extra scope', sub_en:'A polite no now is cheaper than a slip in public.', title_zh:'拒绝加塞的范围', sub_zh:'现在客气地拒绝，比当众延误便宜。', title_th:'ปฏิเสธสโคปเพิ่ม', sub_th:'คำว่าไม่ที่สุภาพตอนนี้ ถูกกว่าพลาดต่อหน้าคน' },
        { title_en:'Lock the calendar edges', sub_en:'Protect the deep-work block like a client meeting.', title_zh:'锁住日程两头', sub_zh:'把深工时段当成客户会议来守。', title_th:'ล็อกขอบปฏิทิน', sub_th:'ปกป้องบล็อกงานลึกเหมือนนัดลูกค้า' },
        { title_en:'Keep the draft internal', sub_en:'Half-built ideas leak badly under this month’s weather.', title_zh:'草稿先留在内部', sub_zh:'半成品在这个月的天气里，泄漏会很难看。', title_th:'ฉบับร่างให้อยู่ในทีม', sub_th:'ไอเดียครึ่งทาง รั่วแล้วแย่ใต้ลมเดือนนี้' },
        { title_en:'Do not volunteer first', sub_en:'Let the room show its hand before you add yours.', title_zh:'别第一个举手', sub_zh:'先让房间亮牌，再决定你出不出。', title_th:'อย่าอาสาคนแรก', sub_th:'ให้ห้องโชว์ไพ่ก่อน ค่อยลงมือคุณ' },
      ],
      celebrate: [
        { title_en:'Name the win out loud', sub_en:'A short note to the team makes the result real.', title_zh:'把胜利用嘴说出来', sub_zh:'给团队一张短条，结果才算落地。', title_th:'พูดชัยให้ดัง', sub_th:'โน้ตสั้นถึงทีม ทำให้ผลจริงขึ้น' },
        { title_en:'Pay the favour back', sub_en:'Someone paved this. A public thanks compounds.', title_zh:'把人情还回去', sub_zh:'有人铺过路。当众一声谢会生利息。', title_th:'คืนบุญคุณ', sub_th:'มีคนปูทางนี้ คำขอบคุณสาธารณะทบต้น' },
        { title_en:'Stop raising the bar today', sub_en:'Let a finished thing stay finished for a week.', title_zh:'今天别再加码', sub_zh:'让完成的事完成着，至少一周。', title_th:'วันนี้พอเถอะ', sub_th:'ปล่อยของที่เสร็จ ให้เสร็จอยู่สักอาทิตย์' },
        { title_en:'Take the nicer lunch', sub_en:'Mark the close with a body, not another slide.', title_zh:'吃一顿更好的午饭', sub_zh:'用身体记下收官，而不是再做一页幻灯。', title_th:'กินข้าวกลางวันที่ดีกว่า', sub_th:'ปิดงานด้วยร่างกาย ไม่ใช่สไลด์อีกใบ' },
      ],
      reset: [
        { title_en:'Kill one zombie project', sub_en:'A buried maybe is still taking a desk and a brain.', title_zh:'杀掉一个僵尸项目', sub_zh:'被埋的“也许”仍占桌子和脑子。', title_th:'ฆ่าโปรเจกต์ซอมบี้', sub_th:'คำว่าอาจจะที่ฝัง ยังกินโต๊ะและสมอง' },
        { title_en:'Rename the messy thread', sub_en:'Fresh title, same work — people will treat it as new.', title_zh:'给乱线程改名', sub_zh:'换标题，还是那件事——别人会当新的对待。', title_th:'ตั้งชื่อเธรดใหม่', sub_th:'ชื่อใหม่ งานเดิม คนจะปฏิบัติเหมือนของใหม่' },
        { title_en:'Swap the weekly ritual', sub_en:'The old standup is theatre. Change the questions.', title_zh:'换掉每周仪式', sub_zh:'旧站会是演戏。把问题换掉。', title_th:'สลับพิธีรายสัปดาห์', sub_th:'สแตนด์อัพเก่าคือละคร เปลี่ยนคำถาม' },
        { title_en:'Start from a blank doc', sub_en:'Copy-paste from last quarter is how the error travels.', title_zh:'从空白页开始', sub_zh:'从上季度复制，是错误旅行的方式。', title_th:'เริ่มจากเอกสารว่าง', sub_th:'ก็อปจากไตรมาสก่อน คือทางที่ข้อผิดพลาดเดินทาง' },
      ],
      deepen: [
        { title_en:'Stay in the details', sub_en:'One layer deeper on the same problem beats a new one.', title_zh:'留在细节里', sub_zh:'同一问题再下一层，胜过开新题。', title_th:'อยู่ในรายละเอียด', sub_th:'ลึกชั้นเดียวบนปัญหาเดิม ดีกว่าเปิดอันใหม่' },
        { title_en:'Ask the quiet expert', sub_en:'The person who rarely speaks has the missing constraint.', title_zh:'去问那个安静的行家', sub_zh:'很少开口的人，手里有你缺的约束条件。', title_th:'ถามผู้เชี่ยวชาญที่เงียบ', sub_th:'คนที่แทบไม่พูด มีข้อจำกัดที่คุณขาด' },
        { title_en:'Document the why', sub_en:'Future-you will need the reason, not the vibe.', title_zh:'把原因写下来', sub_zh:'未来的你需要理由，不需要气氛。', title_th:'จดเหตุผล', sub_th:'คุณในอนาคตต้องการเหตุผล ไม่ใช่โทน' },
        { title_en:'Teach the step once', sub_en:'Explaining the craft is how it becomes a system.', title_zh:'把步骤教一遍', sub_zh:'把手艺讲清楚，它才会变成系统。', title_th:'สอนขั้นตอนครั้งหนึ่ง', sub_th:'อธิบายงานฝีมือ คือทางที่มันกลายเป็นระบบ' },
      ],
      'cut-clean': [
        { title_en:'Close the dead thread', sub_en:'A written “we’re done” frees two calendars.', title_zh:'关掉死掉的线程', sub_zh:'写一句“到此为止”，解放两个日程。', title_th:'ปิดเธรดที่ตาย', sub_th:'ข้อความว่าเราจบแล้ว ปลดสองปฏิทิน' },
        { title_en:'Drop the vanity metric', sub_en:'If it does not change a decision, stop collecting it.', title_zh:'丢掉虚荣指标', sub_zh:'如果它不改变决策，就别再收集。', title_th:'เลิกเมตริกโชว์', sub_th:'ถ้าไม่เปลี่ยนการตัดสินใจ ก็เลิกเก็บ' },
        { title_en:'Exit the polite committee', sub_en:'Meetings that cannot decide are a tax. Resign the seat.', title_zh:'退出客气委员会', sub_zh:'不能做决定的会是税。把座位还回去。', title_th:'ออกจากคณะสุภาพ', sub_th:'ประชุมที่ตัดสินไม่ได้คือภาษี คืนที่นั่ง' },
        { title_en:'Archive last season’s plan', sub_en:'Keeping it open implies a promise you will not keep.', title_zh:'把上季计划归档', sub_zh:'开着它，等于许一个你不会守的诺。', title_th:'เก็บแผนฤดูกาลก่อน', sub_th:'เปิดค้างไว้ คือสัญญาที่คุณจะไม่รักษา' },
      ],
      'low-profile': [
        { title_en:'Work without an audience', sub_en:'Quiet output this month lands better than a status tour.', title_zh:'没有观众地干活', sub_zh:'这个月安静的产出，比巡回汇报更有用。', title_th:'ทำงานไร้ผู้ชม', sub_th:'ผลเงียบเดือนนี้ ลงได้ดีกว่าทัวร์สถานะ' },
        { title_en:'Skip the all-hands shine', sub_en:'Save the speech. Send a precise note to the two people who matter.', title_zh:'跳过全员闪光', sub_zh:'演讲留着。给两个关键的人发精确的短笺。', title_th:'ข้ามการโชว์ทั้งบริษัท', sub_th:'เก็บสุนทรพจน์ ส่งโน้ตตรงถึงสองคนที่สำคัญ' },
        { title_en:'Keep the win unposted', sub_en:'Let results travel by rumour. You stay at the desk.', title_zh:'胜利先不发帖', sub_zh:'让结果靠传闻走。人留在桌前。', title_th:'อย่าโพสต์ชัย', sub_th:'ให้ผลเดินทางด้วยข่าวลือ คุณอยู่ที่โต๊ะ' },
        { title_en:'Choose the side door', sub_en:'A private channel moves this faster than the stage.', title_zh:'走侧门', sub_zh:'私下通道，比舞台更快。', title_th:'เลือกประตูข้าง', sub_th:'ช่องทางส่วนตัว ขยับสิ่งนี้เร็วกว่าเวที' },
      ],
    },
  };

  function toneFromContext(relation, godId, rng) {
    const byRel = {
      clash: ['protect', 'cut-clean', 'low-profile'],
      combine: ['celebrate', 'deepen', 'receive'],
      punish: ['repair', 'wait', 'protect'],
      harm: ['low-profile', 'protect', 'wait'],
      support: ['receive', 'deepen', 'celebrate'],
      drain: ['pursue', 'celebrate', 'reset'],
      control: ['wait', 'low-profile', 'protect'],
      wealth: ['pursue', 'receive', 'celebrate'],
      peer: ['reset', 'deepen', 'pursue'],
      neutral: ['wait', 'deepen', 'reset'],
    };
    const byGod = {
      friend: 'reset', rob_wealth: 'pursue',
      eating_god: 'celebrate', hurting_officer: 'cut-clean',
      direct_wealth: 'pursue', indirect_wealth: 'receive',
      direct_officer: 'wait', seven_killings: 'protect',
      direct_resource: 'deepen', indirect_resource: 'repair',
    };
    const pool = (byRel[relation] || byRel.neutral).slice();
    const g = byGod[godId];
    if (g && pool.indexOf(g) < 0) pool.push(g);
    return pool[Math.floor(rng() * pool.length) % pool.length];
  }

  /**
   * Deterministic 12-month forecast for one domain.
   * Recalc only when year or birthChartKey changes — callers should cache.
   */
  function calcMonthlyForecast(opts) {
    const year = opts.year;
    const domain = opts.domain || 'love';
    const pillars = opts.pillars;
    const dayMaster = opts.dayMaster || (pillars && pillars[2] && pillars[2].stem);
    const userKey = opts.userId || opts.localGuestId || 'guest';
    const dmChar = dayMaster ? dayMaster.char : '?';
    const yStem = pillars[0] && pillars[0].stem ? pillars[0].stem.char : '?';
    const mStem = pillars[1] && pillars[1].stem ? pillars[1].stem.char : '?';
    const dBranch = pillars[2] && pillars[2].branch ? pillars[2].branch.char : '?';
    const birthChartKey = opts.birthChartKey || (dmChar + yStem + mStem + dBranch);
    const seed = hash32([userKey, birthChartKey, domain, year].join('|'));
    const rng = mulberry32(seed);
    const decks = MONTHLY_DECKS[domain] || MONTHLY_DECKS.love;
    const natalDayIdx = BRANCHES.findIndex(b => pillars[2] && pillars[2].branch && b.char === pillars[2].branch.char);
    const natalMonthIdx = BRANCHES.findIndex(b => pillars[1] && pillars[1].branch && b.char === pillars[1].branch.char);

    const months = [];
    const usedTitle = new Set();
    const usedSub = new Set();

    for (let m = 1; m <= 12; m++) {
      const flow = getFlowMonth(year, m);
      const godId = calcTenGod(dayMaster.element, dayMaster.polarity, flow.stem.element, flow.stem.polarity);
      const god = tenGodLabel(godId);
      const brRel = branchRelation(
        BRANCHES.findIndex(b => b.char === flow.branch.char),
        natalDayIdx, natalMonthIdx
      );
      const elRel = elementRelation(flow.branch.element, dayMaster.element);
      const relation = brRel || elRel || 'neutral';
      let tone = toneFromContext(relation, godId, rng);
      const bucket = decks[tone] || decks.wait;
      let pick = null;
      const start = Math.floor(rng() * bucket.length);
      for (let tries = 0; tries < bucket.length * 3; tries++) {
        const cand = bucket[(start + tries) % bucket.length];
        const prev = months[months.length - 1];
        const clashAdj = prev && (prev.title_en === cand.title_en || prev.sub_en === cand.sub_en);
        if (usedTitle.has(cand.title_en) || usedSub.has(cand.sub_en) || clashAdj) continue;
        pick = cand;
        break;
      }
      if (!pick) {
        /* Fallback: steal from another tone so we never emit a 4-card loop. */
        const tones = Object.keys(decks);
        for (let t = 0; t < tones.length && !pick; t++) {
          const altTone = tones[(t + m) % tones.length];
          const alt = decks[altTone];
          for (let i = 0; i < alt.length; i++) {
            const cand = alt[i];
            const prev = months[months.length - 1];
            const clashAdj = prev && (prev.title_en === cand.title_en || prev.sub_en === cand.sub_en);
            if (!usedTitle.has(cand.title_en) && !usedSub.has(cand.sub_en) && !clashAdj) {
              pick = cand;
              tone = altTone;
              break;
            }
          }
        }
      }
      if (!pick) pick = bucket[0];
      usedTitle.add(pick.title_en);
      usedSub.add(pick.sub_en);
      months.push({
        month: m,
        pillar: flow.pillar,
        god: god.en,
        god_zh: god.zh,
        god_id: godId,
        relation: brRel || elRel || 'neutral',
        tone,
        emoji: TONE_EMOJI[tone] || '✦',
        title_en: pick.title_en,
        sub_en: pick.sub_en,
        title_zh: pick.title_zh,
        sub_zh: pick.sub_zh,
        title_th: pick.title_th,
        sub_th: pick.sub_th,
      });
    }

    return { year, domain, birthChartKey, months };
  }

  return {
    STEMS, BRANCHES, ZODIAC, EL_COLOR, EL_ZH, ANIMAL_ZH,
    MONTH_BRANCH, hourToBranch,
    calcBazi, calcBaziAccurate, calcElements, calcElementsDetailed,
    calcFortune, getDominant,
    PRODUCTION_CYCLE, CONTROL_CYCLE,
    HIDDEN_STEMS, HIDDEN_WEIGHT, TEN_GODS, TEN_GOD_MEANING, TEN_GOD_BY_ID,
    HOUR_CONVENTION,
    calcTenGod, calcTenGodsProfile, tenGodLabel,
    lunarToSolar, leapMonth, getLunarMonthLength,
    jieqiJD, getLichunJD, julianDay, JIE_NAMES,
    getFlowMonth, calcMonthlyForecast,
    CLASH, COMBINE, HARM, isPunish,
  };
}));
