/* ═══════════════════════════════════════
   WOBAZI — Chinese Destiny Engine
   script.js
═══════════════════════════════════════ */

/* ── Haptic Feedback ── */
function haptic(pattern = 10) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

/* ── Custom Animal SVG Illustrations ── */
const ANIMAL_SVGS = {
  Rat: `
    <ellipse cx="34" cy="25" rx="10" ry="13" fill="currentColor" opacity="0.85"/>
    <ellipse cx="66" cy="25" rx="10" ry="13" fill="currentColor" opacity="0.85"/>
    <ellipse cx="34" cy="25" rx="6.5" ry="9" fill="currentColor" opacity="0.3"/>
    <ellipse cx="66" cy="25" rx="6.5" ry="9" fill="currentColor" opacity="0.3"/>
    <ellipse cx="50" cy="67" rx="24" ry="20" fill="currentColor"/>
    <circle cx="50" cy="44" r="17" fill="currentColor"/>
    <ellipse cx="50" cy="52" rx="8" ry="6" fill="currentColor" opacity="0.65"/>
    <circle cx="43" cy="40" r="3" fill="white"/><circle cx="57" cy="40" r="3" fill="white"/>
    <circle cx="44" cy="41" r="1.5" fill="#0a0a1a"/><circle cx="58" cy="41" r="1.5" fill="#0a0a1a"/>
    <circle cx="44.5" cy="40" r="0.7" fill="white"/><circle cx="58.5" cy="40" r="0.7" fill="white"/>
    <ellipse cx="50" cy="53" rx="2.5" ry="2" fill="#ff8aaa"/>
    <line x1="58" y1="50" x2="74" y2="47" stroke="currentColor" stroke-width="1" opacity="0.45"/>
    <line x1="58" y1="53" x2="74" y2="53" stroke="currentColor" stroke-width="1" opacity="0.45"/>
    <line x1="42" y1="50" x2="26" y2="47" stroke="currentColor" stroke-width="1" opacity="0.45"/>
    <line x1="42" y1="53" x2="26" y2="53" stroke="currentColor" stroke-width="1" opacity="0.45"/>
    <path d="M74,64 Q90,54 86,40 Q83,28 91,22" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.75"/>`,

  Ox: `
    <path d="M32,30 Q20,14 28,7" stroke="currentColor" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M68,30 Q80,14 72,7" stroke="currentColor" stroke-width="5" fill="none" stroke-linecap="round"/>
    <ellipse cx="50" cy="70" rx="26" ry="19" fill="currentColor"/>
    <rect x="38" y="50" width="24" height="20" rx="8" fill="currentColor"/>
    <ellipse cx="50" cy="42" rx="18" ry="16" fill="currentColor"/>
    <ellipse cx="50" cy="52" rx="12" ry="8" fill="currentColor" opacity="0.65"/>
    <circle cx="45" cy="53" r="2.5" fill="currentColor" opacity="0.4"/>
    <circle cx="55" cy="53" r="2.5" fill="currentColor" opacity="0.4"/>
    <circle cx="41" cy="38" r="3.5" fill="white"/><circle cx="59" cy="38" r="3.5" fill="white"/>
    <circle cx="42" cy="39" r="1.8" fill="#0a0a1a"/><circle cx="60" cy="39" r="1.8" fill="#0a0a1a"/>
    <circle cx="42.5" cy="38.5" r="0.7" fill="white"/><circle cx="60.5" cy="38.5" r="0.7" fill="white"/>`,

  Tiger: `
    <path d="M30,30 L24,13 L41,24" fill="currentColor" opacity="0.9"/>
    <path d="M70,30 L76,13 L59,24" fill="currentColor" opacity="0.9"/>
    <path d="M32,29 L27,16 L40,25" fill="currentColor" opacity="0.35"/>
    <path d="M68,29 L73,16 L60,25" fill="currentColor" opacity="0.35"/>
    <ellipse cx="50" cy="70" rx="25" ry="18" fill="currentColor"/>
    <circle cx="50" cy="46" r="22" fill="currentColor"/>
    <ellipse cx="50" cy="55" rx="11" ry="8" fill="currentColor" opacity="0.6"/>
    <path d="M46,50 L50,55 L54,50" stroke="currentColor" stroke-width="1.5" fill="currentColor" opacity="0.75"/>
    <ellipse cx="41" cy="43" rx="5" ry="3.5" fill="white"/>
    <ellipse cx="59" cy="43" rx="5" ry="3.5" fill="white"/>
    <circle cx="41.5" cy="43.5" r="2.5" fill="#111"/>
    <circle cx="59.5" cy="43.5" r="2.5" fill="#111"/>
    <circle cx="42" cy="43" r="0.9" fill="white"/>
    <circle cx="60" cy="43" r="0.9" fill="white"/>
    <path d="M47,29 Q50,25 53,29" stroke="currentColor" stroke-width="2.5" fill="none" opacity="0.45" stroke-linecap="round"/>
    <path d="M43,34 Q50,30 57,34" stroke="currentColor" stroke-width="2" fill="none" opacity="0.35" stroke-linecap="round"/>
    <line x1="61" y1="53" x2="77" y2="49" stroke="currentColor" stroke-width="1.2" opacity="0.45"/>
    <line x1="61" y1="56" x2="77" y2="56" stroke="currentColor" stroke-width="1.2" opacity="0.45"/>
    <line x1="39" y1="53" x2="23" y2="49" stroke="currentColor" stroke-width="1.2" opacity="0.45"/>
    <line x1="39" y1="56" x2="23" y2="56" stroke="currentColor" stroke-width="1.2" opacity="0.45"/>`,

  Rabbit: `
    <ellipse cx="37" cy="22" rx="9" ry="19" fill="currentColor" opacity="0.9"/>
    <ellipse cx="63" cy="22" rx="9" ry="19" fill="currentColor" opacity="0.9"/>
    <ellipse cx="37" cy="22" rx="5.5" ry="14" fill="currentColor" opacity="0.3"/>
    <ellipse cx="63" cy="22" rx="5.5" ry="14" fill="currentColor" opacity="0.3"/>
    <ellipse cx="50" cy="70" rx="22" ry="19" fill="currentColor"/>
    <circle cx="50" cy="49" r="17" fill="currentColor"/>
    <circle cx="37" cy="54" r="8" fill="currentColor" opacity="0.45"/>
    <circle cx="63" cy="54" r="8" fill="currentColor" opacity="0.45"/>
    <ellipse cx="50" cy="52" rx="2.5" ry="2" fill="#ff8aaa"/>
    <circle cx="43" cy="45" r="3.5" fill="white"/><circle cx="57" cy="45" r="3.5" fill="white"/>
    <circle cx="44" cy="46" r="2" fill="#111"/><circle cx="58" cy="46" r="2" fill="#111"/>
    <circle cx="44.5" cy="45.5" r="0.7" fill="white"/><circle cx="58.5" cy="45.5" r="0.7" fill="white"/>
    <circle cx="50" cy="86" r="6" fill="currentColor" opacity="0.55"/>`,

  Dragon: `
    <path d="M50,82 Q72,70 70,54 Q68,40 50,36 Q32,32 30,20 Q28,10 38,6" stroke="currentColor" stroke-width="11" fill="none" stroke-linecap="round" opacity="0.8"/>
    <path d="M50,82 Q72,70 70,54 Q68,40 50,36 Q32,32 30,20 Q28,10 38,6" stroke="currentColor" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.25"/>
    <ellipse cx="42" cy="15" rx="13" ry="9" fill="currentColor" transform="rotate(-22,42,15)"/>
    <path d="M34,8 Q27,1 32,-3" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M46,7 Q44,-1 50,-4" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <circle cx="37" cy="12" r="3" fill="white"/>
    <circle cx="37.5" cy="12.5" r="1.8" fill="#111"/>
    <circle cx="38" cy="12" r="0.7" fill="white"/>
    <path d="M55,18 Q64,13 60,22 Q68,17 62,27" fill="currentColor" opacity="0.55"/>
    <path d="M64,58 L68,64 M64,58 L70,61 M64,58 L66,54" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.65"/>`,

  Snake: `
    <circle cx="50" cy="58" r="28" fill="none" stroke="currentColor" stroke-width="9" opacity="0.7"/>
    <circle cx="50" cy="58" r="17" fill="none" stroke="currentColor" stroke-width="9" opacity="0.8"/>
    <circle cx="50" cy="58" r="7" fill="currentColor" opacity="0.65"/>
    <path d="M50,30 Q50,18 62,13" stroke="currentColor" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.85"/>
    <ellipse cx="66" cy="10" rx="10" ry="7" fill="currentColor" transform="rotate(28,66,10)"/>
    <circle cx="69" cy="7" r="2.5" fill="white"/>
    <circle cx="69.5" cy="7.5" r="1.4" fill="#111"/>
    <path d="M74,14 L80,11 M74,14 L80,17" stroke="#ff4466" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,

  Horse: `
    <ellipse cx="52" cy="65" rx="30" ry="16" fill="currentColor"/>
    <ellipse cx="74" cy="58" rx="13" ry="13" fill="currentColor"/>
    <ellipse cx="30" cy="59" rx="11" ry="14" fill="currentColor"/>
    <path d="M27,47 Q23,33 32,22" stroke="currentColor" stroke-width="14" fill="none" stroke-linecap="round"/>
    <ellipse cx="31" cy="16" rx="9" ry="12" fill="currentColor" transform="rotate(12,31,16)"/>
    <ellipse cx="24" cy="24" rx="7" ry="4.5" fill="currentColor" opacity="0.75"/>
    <ellipse cx="20" cy="26" rx="1.8" ry="1.2" fill="currentColor" opacity="0.35"/>
    <path d="M34,5 L31,0 L38,6" fill="currentColor"/>
    <path d="M39,7 L38,1 L43,8" fill="currentColor" opacity="0.6"/>
    <circle cx="37" cy="13" r="4" fill="white"/>
    <circle cx="36.5" cy="13.5" r="2.3" fill="#111"/>
    <circle cx="37.2" cy="13" r="0.8" fill="white"/>
    <path d="M35,5 Q46,16 47,32 Q48,42 43,50" stroke="currentColor" stroke-width="9" fill="none" stroke-linecap="round" opacity="0.5"/>
    <path d="M38,4 Q50,15 51,30 Q52,40 47,48" stroke="currentColor" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.3"/>
    <path d="M81,60 Q93,50 91,70 Q89,84 84,93" stroke="currentColor" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.6"/>
    <rect x="27" y="78" width="7" height="18" rx="3.5" fill="currentColor"/>
    <rect x="36" y="79" width="7" height="17" rx="3.5" fill="currentColor" opacity="0.65"/>
    <rect x="60" y="77" width="7" height="19" rx="3.5" fill="currentColor"/>
    <rect x="69" y="78" width="7" height="18" rx="3.5" fill="currentColor" opacity="0.65"/>`,

  Goat: `
    <ellipse cx="50" cy="70" rx="26" ry="20" fill="currentColor"/>
    <circle cx="36" cy="68" r="10" fill="currentColor" opacity="0.65"/>
    <circle cx="64" cy="68" r="10" fill="currentColor" opacity="0.65"/>
    <circle cx="50" cy="64" r="10" fill="currentColor" opacity="0.65"/>
    <rect x="42" y="51" width="16" height="17" rx="6" fill="currentColor"/>
    <circle cx="50" cy="44" r="14" fill="currentColor"/>
    <path d="M40,34 Q33,21 39,14" stroke="currentColor" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M60,34 Q67,21 61,14" stroke="currentColor" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="50" cy="57" rx="5" ry="9" fill="currentColor" opacity="0.6"/>
    <ellipse cx="43" cy="41" rx="3.5" ry="2.5" fill="white"/>
    <ellipse cx="57" cy="41" rx="3.5" ry="2.5" fill="white"/>
    <ellipse cx="43.5" cy="41.5" rx="2" ry="1.5" fill="#111"/>
    <ellipse cx="57.5" cy="41.5" rx="2" ry="1.5" fill="#111"/>
    <ellipse cx="50" cy="49" rx="7" ry="5" fill="currentColor" opacity="0.6"/>`,

  Monkey: `
    <ellipse cx="50" cy="70" rx="22" ry="18" fill="currentColor"/>
    <circle cx="50" cy="44" r="18" fill="currentColor"/>
    <circle cx="27" cy="44" r="11" fill="currentColor" opacity="0.85"/>
    <circle cx="27" cy="44" r="7" fill="currentColor" opacity="0.35"/>
    <circle cx="73" cy="44" r="11" fill="currentColor" opacity="0.85"/>
    <circle cx="73" cy="44" r="7" fill="currentColor" opacity="0.35"/>
    <ellipse cx="50" cy="47" rx="12" ry="13" fill="currentColor" opacity="0.5"/>
    <circle cx="43" cy="40" r="3.5" fill="white"/>
    <circle cx="57" cy="40" r="3.5" fill="white"/>
    <circle cx="44" cy="41" r="2" fill="#111"/>
    <circle cx="58" cy="41" r="2" fill="#111"/>
    <circle cx="44.5" cy="40.5" r="0.7" fill="white"/>
    <circle cx="58.5" cy="40.5" r="0.7" fill="white"/>
    <circle cx="47" cy="47" r="2" fill="currentColor" opacity="0.55"/>
    <circle cx="53" cy="47" r="2" fill="currentColor" opacity="0.55"/>
    <path d="M43,52 Q50,57 57,52" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.55"/>
    <path d="M72,62 Q86,52 84,40 Q82,29 76,27" stroke="currentColor" stroke-width="4.5" fill="none" stroke-linecap="round" opacity="0.65"/>`,

  Rooster: `
    <ellipse cx="48" cy="68" rx="22" ry="18" fill="currentColor"/>
    <path d="M68,62 Q82,49 86,38" stroke="currentColor" stroke-width="5.5" fill="none" stroke-linecap="round" opacity="0.7"/>
    <path d="M68,66 Q84,57 90,50" stroke="currentColor" stroke-width="5.5" fill="none" stroke-linecap="round" opacity="0.65"/>
    <path d="M68,71 Q84,69 90,64" stroke="currentColor" stroke-width="5.5" fill="none" stroke-linecap="round" opacity="0.55"/>
    <ellipse cx="44" cy="53" rx="11" ry="15" fill="currentColor" transform="rotate(-5,44,53)"/>
    <circle cx="40" cy="36" r="14" fill="currentColor"/>
    <path d="M35,23 Q40,12 45,21 Q47,11 52,20 Q54,9 57,17" stroke="currentColor" stroke-width="2.5" fill="currentColor" opacity="0.75"/>
    <ellipse cx="31" cy="43" rx="5.5" ry="9" fill="currentColor" opacity="0.65"/>
    <path d="M25,36 L18,34 L25,31" fill="currentColor" opacity="0.85"/>
    <circle cx="38" cy="32" r="3.5" fill="white"/>
    <circle cx="38.5" cy="32.5" r="2" fill="#111"/>
    <circle cx="39" cy="32" r="0.7" fill="white"/>`,

  Dog: `
    <ellipse cx="50" cy="70" rx="24" ry="19" fill="currentColor"/>
    <path d="M75,62 Q88,51 84,40" stroke="currentColor" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.65"/>
    <circle cx="50" cy="44" r="18" fill="currentColor"/>
    <ellipse cx="27" cy="49" rx="10" ry="17" fill="currentColor" opacity="0.85" transform="rotate(14,27,49)"/>
    <ellipse cx="73" cy="49" rx="10" ry="17" fill="currentColor" opacity="0.85" transform="rotate(-14,73,49)"/>
    <ellipse cx="50" cy="51" rx="11" ry="9" fill="currentColor" opacity="0.6"/>
    <ellipse cx="50" cy="46" rx="6" ry="4.5" fill="currentColor" opacity="0.8"/>
    <circle cx="47" cy="46" r="1.8" fill="white" opacity="0.35"/>
    <circle cx="41" cy="40" r="3.5" fill="white"/>
    <circle cx="59" cy="40" r="3.5" fill="white"/>
    <circle cx="41.5" cy="40.5" r="2.2" fill="#111"/>
    <circle cx="59.5" cy="40.5" r="2.2" fill="#111"/>
    <circle cx="42" cy="40" r="0.8" fill="white"/>
    <circle cx="60" cy="40" r="0.8" fill="white"/>
    <path d="M37,36 Q41,34 45,36" stroke="currentColor" stroke-width="2" fill="none" opacity="0.5"/>
    <path d="M55,36 Q59,34 63,36" stroke="currentColor" stroke-width="2" fill="none" opacity="0.5"/>
    <path d="M44,55 Q50,62 56,55" fill="currentColor" opacity="0.45"/>`,

  Pig: `
    <circle cx="50" cy="68" r="24" fill="currentColor"/>
    <circle cx="50" cy="44" r="20" fill="currentColor"/>
    <ellipse cx="32" cy="28" rx="9" ry="8.5" fill="currentColor" opacity="0.85"/>
    <ellipse cx="68" cy="28" rx="9" ry="8.5" fill="currentColor" opacity="0.85"/>
    <ellipse cx="32" cy="28" rx="5.5" ry="5" fill="currentColor" opacity="0.3"/>
    <ellipse cx="68" cy="28" rx="5.5" ry="5" fill="currentColor" opacity="0.3"/>
    <circle cx="50" cy="51" r="13" fill="currentColor" opacity="0.6"/>
    <circle cx="45" cy="52" r="3.5" fill="currentColor" opacity="0.5"/>
    <circle cx="55" cy="52" r="3.5" fill="currentColor" opacity="0.5"/>
    <circle cx="40" cy="38" r="4" fill="white"/>
    <circle cx="60" cy="38" r="4" fill="white"/>
    <circle cx="40.5" cy="38.5" r="2.3" fill="#111"/>
    <circle cx="60.5" cy="38.5" r="2.3" fill="#111"/>
    <circle cx="41" cy="38" r="0.8" fill="white"/>
    <circle cx="61" cy="38" r="0.8" fill="white"/>
    <path d="M40,57 Q50,64 60,57" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.45"/>
    <path d="M74,66 Q83,58 80,52 Q78,47 83,45" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.65"/>`,
};

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

/* ── Branch → Chinese character quick lookup ── */
const BRANCH_CHARS = {
  Rat:'子', Ox:'丑', Tiger:'寅', Rabbit:'卯', Dragon:'辰', Snake:'巳',
  Horse:'午', Goat:'未', Monkey:'申', Rooster:'酉', Dog:'戌', Pig:'亥'
};

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
const EL_ZH    = { Wood:'木', Fire:'火', Earth:'土', Metal:'金', Water:'水' };
const EL_TH    = { Wood:'ไม้', Fire:'ไฟ', Earth:'ดิน', Metal:'โลหะ', Water:'น้ำ' };
const ANIMAL_ZH = {
  Rat:'鼠', Ox:'牛', Tiger:'虎', Rabbit:'兔', Dragon:'龙', Snake:'蛇',
  Horse:'马', Goat:'羊', Monkey:'猴', Rooster:'鸡', Dog:'狗', Pig:'猪',
};
const ANIMAL_TH = {
  Rat:'หนู', Ox:'วัว', Tiger:'เสือ', Rabbit:'กระต่าย', Dragon:'มังกร', Snake:'งู',
  Horse:'ม้า', Goat:'แพะ', Monkey:'ลิง', Rooster:'ไก่', Dog:'สุนัข', Pig:'หมู',
};
const COLOR_ZH = {
  Blue:'蓝色', Gold:'金色', Green:'绿色', Yellow:'黄色', White:'白色',
  Grey:'灰色', Orange:'橙色', Pink:'粉色', Purple:'紫色', Black:'黑色',
  Red:'红色', Brown:'棕色', Silver:'银色', Teal:'青绿色',
};
const DIR_ZH = {
  North:'北', Northeast:'东北', East:'东', Southeast:'东南',
  South:'南', Southwest:'西南', West:'西', Northwest:'西北',
};
const TRAIT_ZH = {
  Clever:'机智', Charming:'魅力四射', Resourceful:'随机应变',
  Dependable:'可靠', Patient:'耐心', Strong:'坚强',
  Bold:'大胆', Magnetic:'磁场强', Fearless:'无畏',
  Graceful:'优雅', Intuitive:'直觉敏锐', Diplomatic:'圆融',
  Visionary:'远见卓识', Powerful:'强大', Lucky:'幸运',
  Wise:'睿智', Mysterious:'神秘', Elegant:'雅致',
  'Free-spirited':'自由奔放', Energetic:'充满活力', Wild:'热烈奔放',
  Creative:'创意无限', Gentle:'温和', Empathetic:'共情力强',
  Inventive:'富有创意', Witty:'机智', Unstoppable:'锐不可当',
  Precise:'精准', Confident:'自信', Loyal:'忠诚',
  Just:'正直', Protective:'守护',
  Generous:'慷慨', Sincere:'真诚', Optimistic:'乐观',
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

/* ── Bazi Calculation (thin wrapper → bazi-engine.js) ──
   month is 0-indexed (legacy JS Date). Prefer calcBaziAccurate for new code. */
function calcBazi(year, month, day, hour, minute) {
  if (window.BaziEngine && typeof BaziEngine.calcBaziAccurate === 'function') {
    return BaziEngine.calcBaziAccurate({
      year,
      month: Number(month) + 1,
      day,
      hour: hour === undefined ? null : hour,
      minute: minute || 0,
      calendar: 'solar',
    }).pillars;
  }
  return [];
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
let _prevAboutFrom = 'splash';

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'results') {
    document.getElementById('results').querySelector('.scroll-body').scrollTop = 0;
  }
  // Show/hide floating Oracle FAB
  const fab = document.getElementById('oracle-fab');
  if (fab) fab.classList.toggle('hide', id !== 'results');
  if (typeof applyI18n === 'function') applyI18n();
}

function showAbout() {
  const active = document.querySelector('.screen.active');
  _prevAboutFrom = active ? active.id : 'splash';
  showScreen('about');
}

function scrollAbout(id) {
  const el = document.getElementById(id);
  const scroll = document.querySelector('#about .about-scroll');
  if (!el || !scroll) return;
  const top = el.getBoundingClientRect().top - scroll.getBoundingClientRect().top + scroll.scrollTop - 8;
  scroll.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

function scrollResults(id) {
  const el = document.getElementById(id);
  const scroll = document.querySelector('#results .scroll-body');
  if (!el || !scroll) return;
  const top = el.getBoundingClientRect().top - scroll.getBoundingClientRect().top + scroll.scrollTop - 8;
  scroll.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

/* Monthly forecast strips open with the current month centred. A strip on a hidden tab has no width,
   so it is centred the first time it is visible (switchTab calls this again). */
function centerNowMonths() {
  document.querySelectorAll('.love-months-strip').forEach(strip => {
    if (strip.dataset.centered || !strip.clientWidth) return;
    const tile = strip.querySelector('.now-month');
    if (!tile) return;
    const offset = tile.getBoundingClientRect().left - strip.getBoundingClientRect().left;
    strip.scrollLeft = Math.max(0, strip.scrollLeft + offset - (strip.clientWidth - tile.offsetWidth) / 2);
    strip.dataset.centered = '1';
  });
}

function switchTab(tab, opts) {
  opts = opts || {};
  if (tab === 'luck') tab = 'you';   // Luck Cycle now lives under Your Chart; old #luck links still land.
  ['you', 'today', 'actions', 'relationships'].forEach(t => {
    const btn = document.getElementById('tab-btn-' + t);
    if (btn) btn.classList.toggle('active', t === tab);
    const toc = document.getElementById('toc-' + t);
    if (toc) toc.classList.toggle('hide', t !== tab);
  });
  document.querySelectorAll('#results .section[data-tab]').forEach(el => {
    el.classList.toggle('hide', el.dataset.tab !== tab || el.classList.contains('data-hidden'));
  });
  // Toggle banner: full hero on Actions, compact strip on others
  const heroCard = document.getElementById('hero-card');
  const ctxStrip = document.getElementById('context-strip');
  if (heroCard) heroCard.classList.toggle('hide', tab !== 'actions');
  if (ctxStrip) ctxStrip.classList.add('hide'); // Today's Fortune card shows the day pillar + score now; strip is kept for history snapshots
  document.querySelector('#results .scroll-body').scrollTop = 0;
  requestAnimationFrame(centerNowMonths);
  if (!opts.skipHash && typeof currentHash === 'function' && currentHash() !== tab) {
    history.pushState({ wobazi: tab }, '', location.pathname + location.search + '#' + tab);
  }

  // Render prev/next tab navigation
  const TAB_ORDER = ['you', 'today', 'actions', 'relationships'];
  const TAB_LABELS = { you: 'Your Chart', today: 'Today', actions: 'Actions', relationships: 'People' };
  const TAB_LABELS_ZH = { you: '你的命盘', today: '今日', actions: '行动', relationships: '身边的人' };
  const TAB_LABELS_TH = { you: 'แผนภูมิของคุณ', today: 'วันนี้', actions: 'การกระทำ', relationships: 'ผู้คน' };
  const idx = TAB_ORDER.indexOf(tab);
  const prev = idx > 0 ? TAB_ORDER[idx - 1] : null;
  const next = idx < TAB_ORDER.length - 1 ? TAB_ORDER[idx + 1] : null;
  const navEl = document.getElementById('tab-nav');
  if (navEl) {
    navEl.innerHTML = `
      ${prev ? `<button class="tab-nav-btn tab-nav-prev" onclick="haptic(6); switchTab('${prev}')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        ${_t(TAB_LABELS[prev], TAB_LABELS_ZH[prev], TAB_LABELS_TH[prev])}
      </button>` : '<div></div>'}
      ${next ? `<button class="tab-nav-btn tab-nav-next" onclick="haptic(6); switchTab('${next}')">
        ${_t(TAB_LABELS[next], TAB_LABELS_ZH[next], TAB_LABELS_TH[next])}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>` : '<div></div>'}
    `;
  }
}

/* ═══════════════════════════════════════
   Hash routing + birth persistence
═══════════════════════════════════════ */
// 'luck' is kept so bookmarked #luck links still route; switchTab sends them to 'you'.
const RESULT_TABS = ['you', 'luck', 'today', 'actions', 'relationships'];
const CHART_STORE_KEY = 'wobazi_chart_v1';
let _birthMeta = { calendarType: 'solar', leapMonth: false, minute: 0 };
let _lastAccurate = null;
let _appNavigating = false;
let _currentUser = null;
let _savedReading = null;
let _lastPartner = null;
let _calFilter = 'personal'; // objective within it (engine DATE_OBJECTIVES)
let _calView = 0;         // month grid offset from the current month
let _powerSel = null;     // selected date { y, m (0-indexed), d }
const _powerCache = new Map();

/* GA4 event; a no-op when analytics is blocked. Consent Mode decides what is stored. */
function track(name, params) {
  try { if (typeof window.gtag === 'function') window.gtag('event', name, params || {}); } catch (e) {}
}

function currentHash() {
  return (location.hash || '').replace(/^#/, '');
}

function goHash(hash, opts) {
  opts = opts || {};
  const h = hash || '';
  const url = location.pathname + (location.search || '').replace(/[?&]begin=1/, '').replace(/^&/, '?') + (h ? '#' + h : '');
  const push = !opts.replace && currentHash() !== h;
  // inApp: the entry before this one is also a Wobazi screen, so history.back() stays in the app.
  const state = { wobazi: h || 'landing', inApp: push || !!(history.state && history.state.inApp) };
  _appNavigating = true;
  if (opts.replace) history.replaceState(state, '', url || location.pathname);
  else if (push) history.pushState(state, '', url || location.pathname);
  else history.replaceState(state, '', url || location.pathname);
  _appNavigating = false;
  applyRoute(h);
}

function closeAppNav() {
  document.querySelectorAll('.app-nav.is-open, .site-nav.is-open').forEach(n => {
    n.classList.remove('is-open');
    n.querySelectorAll('[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
  });
}
/* Header menu actions (views/partials/nav-menu.ejs). Links keep real hrefs; modified clicks open them normally. */
function appNav(e, action) {
  if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) return true;
  if (e) e.preventDefault();
  closeAppNav();
  haptic(6);
  switch (action) {
    case 'portal': goHash('portal'); break;
    case 'chart': goHash('you'); break;
    case 'history': goHash('history'); break;
    case 'share': showShareCard(); break;
    case 'edit':
    case 'plot': goToInput(); break;
    case 'login': loginWithGoogle(); break;
    case 'logout': logout(); break;
  }
  return false;
}
function goToLanding() { closeAppNav(); goHash(''); }
function goToInput() {
  closeAppNav();
  fillFormFromStore();
  updateInputMode();
  goHash('input');
}
function onLandingPrimary() {
  if (hasStoredChart()) continueReading();
  else goToInput();
}
function backFromInput() {
  if (history.length > 1 && (history.state && history.state.wobazi === 'input' || currentHash() === 'input')) {
    history.back();
  } else {
    goToLanding();
  }
}

function currentUserKey() {
  if (typeof _currentUser !== 'undefined' && _currentUser && _currentUser.googleId) return _currentUser.googleId;
  try {
    let id = localStorage.getItem('wobazi_guest_id');
    if (!id) {
      id = 'g_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem('wobazi_guest_id', id);
    }
    return id;
  } catch (e) { return 'guest'; }
}

function getStoredChart() {
  try {
    const raw = localStorage.getItem(CHART_STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}
function hasStoredChart() {
  const p = getStoredChart();
  return !!(p && p.year && p.month && p.day);
}
function saveLocalChart(payload) {
  try {
    const prev = getStoredChart() || {};
    const next = Object.assign({}, prev, payload, { savedAt: Date.now() });
    localStorage.setItem(CHART_STORE_KEY, JSON.stringify(next));
    updateLandingCtas();
    updateInputMode();
  } catch (e) { /* quota / private mode */ }
}

function collectBirthPayload() {
  const name = document.getElementById('name')?.value.trim() || '';
  const d = parseInt(document.getElementById('birth-day')?.value, 10);
  const m = parseInt(document.getElementById('birth-month')?.value, 10);
  const y = parseInt(document.getElementById('birth-year')?.value, 10);
  const unknown = document.getElementById('time-unknown')?.checked;
  const timeVal = document.getElementById('birthtime')?.value;
  let hour = null, minute = 0;
  if (!unknown && timeVal) {
    const parts = timeVal.split(':');
    hour = parseInt(parts[0], 10);
    minute = parseInt(parts[1] || '0', 10);
  }
  const calendarType = getCalendarType();
  const leapMonth = !!document.getElementById('leap-month')?.checked;
  const birthplace = document.getElementById('birthplace')?.value.trim() || '';
  const bloodType = document.getElementById('blood-type')?.value || null;
  const gender = document.querySelector('input[name="gender"]:checked')?.value || null;
  const twin = collectTwin();
  if (!y || !m || !d) return null;
  let solarY = y, solarM = m, solarD = d;
  if (calendarType === 'lunar' && window.BaziEngine) {
    try {
      const conv = BaziEngine.lunarToSolar(y, m, d, leapMonth);
      solarY = conv.year; solarM = conv.month; solarD = conv.day;
    } catch (e) { return null; }
  }
  return {
    name, year: solarY, month: solarM, day: solarD, hour, minute,
    calendarType, leapMonth,
    lunarYear: calendarType === 'lunar' ? y : null,
    lunarMonth: calendarType === 'lunar' ? m : null,
    lunarDay: calendarType === 'lunar' ? d : null,
    birthplace, bloodType, gender, twin,
  };
}

/* Twin option → { enabled, order: 'elder'|'younger', method: 'luck'|'hour' } or null */
function collectTwin() {
  if (!document.getElementById('is-twin')?.checked) return null;
  return {
    enabled: true,
    order: document.querySelector('input[name="twin-order"]:checked')?.value || 'elder',
    method: document.getElementById('twin-method')?.value || 'luck',
  };
}
function onTwinToggle() {
  const on = !!document.getElementById('is-twin')?.checked;
  document.getElementById('twin-options')?.classList.toggle('hide', !on);
  updateTwinHint();
}
function updateTwinHint() {
  const younger = document.querySelector('input[name="twin-order"]:checked')?.value === 'younger';
  document.getElementById('twin-method-wrap')?.classList.toggle('hide', !younger);
}
function fillTwin(t) {
  const box = document.getElementById('is-twin');
  if (box) box.checked = !!(t && t.enabled);
  const order = (t && t.order) || 'elder';
  const radio = document.querySelector(`input[name="twin-order"][value="${order}"]`);
  if (radio) radio.checked = true;
  const method = document.getElementById('twin-method');
  if (method) method.value = (t && t.method) || 'luck';
  onTwinToggle();
}
/* Server row → twin object */
function twinFromRow(r) {
  if (!r || !r.twin) return null;
  return { enabled: true, order: r.twin_order || 'elder', method: r.twin_method || 'luck' };
}

function persistBirthIfValid() {
  const p = collectBirthPayload();
  if (!p) return;
  const y = p.calendarType === 'lunar' ? p.lunarYear : p.year;
  const m = p.calendarType === 'lunar' ? p.lunarMonth : p.month;
  const d = p.calendarType === 'lunar' ? p.lunarDay : p.day;
  if (!isValidBirthDate(y, m, d)) return;
  saveLocalChart(p);
}

/* The form always opens on Solar. A chart first entered as Lunar is prefilled with its
   solar-equivalent date (p.year/month/day are always solar), so the same chart comes out,
   and Lunar is only used when someone taps it again. */
function fillFormFromPayload(p) {
  if (!p) return;
  setCalendarType('solar', { silent: true });
  const nameEl = document.getElementById('name');
  const dayEl = document.getElementById('birth-day');
  const monthEl = document.getElementById('birth-month');
  const yearEl = document.getElementById('birth-year');
  const timeEl = document.getElementById('birthtime');
  const placeEl = document.getElementById('birthplace');
  const bloodEl = document.getElementById('blood-type');
  const leapEl = document.getElementById('leap-month');
  const unkEl = document.getElementById('time-unknown');
  if (nameEl) nameEl.value = p.name || '';
  if (dayEl) dayEl.value = p.day || '';
  if (monthEl) monthEl.value = p.month || '';
  if (yearEl) yearEl.value = p.year || '';
  if (leapEl) leapEl.checked = false;
  if (unkEl) unkEl.checked = false;
  if (timeEl) {
    if (p.hour != null) {
      timeEl.value = String(p.hour).padStart(2, '0') + ':' + String(p.minute || 0).padStart(2, '0');
      timeEl.disabled = false;
    } else {
      timeEl.value = '';
      timeEl.disabled = false;
    }
  }
  if (placeEl) placeEl.value = p.birthplace || '';
  if (bloodEl) bloodEl.value = p.bloodType || p.blood_type || '';
  if (p.gender) {
    const radio = document.querySelector(`input[name="gender"][value="${p.gender}"]`);
    if (radio) radio.checked = true;
  }
  fillTwin(p.twin);
  updateLunarPreview();
  onTimeUnknownToggle();
}

function fillFormFromStore() {
  const p = getStoredChart();
  if (p) fillFormFromPayload(p);
}

function updateInputMode() {
  const has = hasStoredChart();
  document.querySelectorAll('.submit-reveal').forEach(el => el.classList.toggle('hide', has));
  document.querySelectorAll('.submit-recalc').forEach(el => el.classList.toggle('hide', !has));
}

function updateLandingCtas() {
  const has = hasStoredChart() || !!(typeof _savedReading !== 'undefined' && _savedReading);
  const primary = document.getElementById('splash-cta-primary');
  const secondary = document.getElementById('splash-cta-secondary');
  /* Guest CTAs vs. the member welcome are chosen server-side in sendApp; only the chart state is decided here. */
  if (primary) {
    primary.querySelectorAll('.cta-begin').forEach(el => el.classList.toggle('hide', has));
    primary.querySelectorAll('.cta-continue').forEach(el => el.classList.toggle('hide', !has));
  }
  if (secondary) secondary.classList.toggle('hide', !has);
}

function getCalendarType() {
  return document.getElementById('cal-lunar')?.classList.contains('active') ? 'lunar' : 'solar';
}
function setCalendarType(type, opts) {
  opts = opts || {};
  const solar = type !== 'lunar';
  const solarBtn = document.getElementById('cal-solar');
  const lunarBtn = document.getElementById('cal-lunar');
  if (solarBtn) {
    solarBtn.classList.toggle('active', solar);
    solarBtn.setAttribute('aria-checked', solar ? 'true' : 'false');
  }
  if (lunarBtn) {
    lunarBtn.classList.toggle('active', !solar);
    lunarBtn.setAttribute('aria-checked', solar ? 'false' : 'true');
  }
  const leapWrap = document.getElementById('leap-month-wrap');
  if (leapWrap) leapWrap.classList.toggle('hide', solar);
  updateLunarPreview();
  if (!opts.silent) persistBirthIfValid();
}
/* Glyph on the submit button: the year animal of the date entered, via the engine so the
   立春 cutoff applies (a January birthday belongs to the previous animal year). 八 until a date is set. */
function updateSubmitGlyph() {
  const el = document.querySelector('#submit-reading .btn-char');
  if (!el) return;
  let char = '八';
  const p = collectBirthPayload();
  if (p && window.BaziEngine) {
    const y = p.calendarType === 'lunar' ? p.lunarYear : p.year;
    const m = p.calendarType === 'lunar' ? p.lunarMonth : p.month;
    const d = p.calendarType === 'lunar' ? p.lunarDay : p.day;
    if (isValidBirthDate(y, m, d)) {
      try {
        const r = BaziEngine.calcBaziAccurate({ year: p.year, month: p.month, day: p.day, hour: 12 });
        const animal = r.pillars[0] && r.pillars[0].branch && r.pillars[0].branch.animal;
        if (animal && ANIMAL_ZH[animal]) char = ANIMAL_ZH[animal];
      } catch (e) {}
    }
  }
  el.textContent = char;
}

function updateLunarPreview() {
  updateSubmitGlyph();
  const eq = document.getElementById('solar-equivalent');
  const leapWrap = document.getElementById('leap-month-wrap');
  if (!eq) return;
  if (getCalendarType() !== 'lunar' || !window.BaziEngine) {
    eq.classList.add('hide');
    eq.textContent = '';
    return;
  }
  const y = parseInt(document.getElementById('birth-year')?.value, 10);
  const m = parseInt(document.getElementById('birth-month')?.value, 10);
  const leap = !!document.getElementById('leap-month')?.checked;
  if (leapWrap && y) {
    const lm = BaziEngine.leapMonth(y);
    leapWrap.classList.toggle('hide', false);
    leapWrap.title = lm ? ('闰' + lm + '月') : '';
  }
  const d = parseInt(document.getElementById('birth-day')?.value, 10);
  if (!y || !m || !d) { eq.classList.add('hide'); return; }
  try {
    const s = BaziEngine.lunarToSolar(y, m, d, leap);
    const pad = n => String(n).padStart(2, '0');
    const iso = s.year + '-' + pad(s.month) + '-' + pad(s.day);
    eq.innerHTML = _t('Solar equivalent: ' + iso, '阳历对应：' + iso, 'เทียบสุริยคติ: ' + iso);
    eq.classList.remove('hide');
  } catch (err) {
    eq.textContent = err.message || '';
    eq.classList.remove('hide');
  }
}
function onTimeUnknownToggle() {
  const unk = document.getElementById('time-unknown');
  const timeEl = document.getElementById('birthtime');
  if (!unk || !timeEl) return;
  timeEl.disabled = !!unk.checked;
  if (unk.checked) timeEl.value = '';
}
function setPartnerCalendarType(type) {
  const solar = type !== 'lunar';
  const solarBtn = document.getElementById('partner-cal-solar');
  const lunarBtn = document.getElementById('partner-cal-lunar');
  if (solarBtn) {
    solarBtn.classList.toggle('active', solar);
    solarBtn.setAttribute('aria-checked', solar ? 'true' : 'false');
  }
  if (lunarBtn) {
    lunarBtn.classList.toggle('active', !solar);
    lunarBtn.setAttribute('aria-checked', solar ? 'false' : 'true');
  }
  const leapWrap = document.getElementById('partner-leap-month-wrap');
  if (leapWrap) leapWrap.classList.toggle('hide', solar);
}
function onPartnerTimeUnknownToggle() {
  const unk = document.getElementById('partner-time-unknown');
  const timeEl = document.getElementById('partner-time');
  if (!unk || !timeEl) return;
  timeEl.disabled = !!unk.checked;
  if (unk.checked) timeEl.value = '';
}

function restoreResults(p, opts) {
  opts = opts || {};
  if (!p || !p.year) { goToInput(); return; }
  fillFormFromPayload(p);
  const hour = p.hour != null ? Number(p.hour) : null;
  _birthMeta = {
    calendarType: p.calendarType || 'solar',
    leapMonth: !!p.leapMonth,
    minute: p.minute || 0,
    lunarYear: p.lunarYear, lunarMonth: p.lunarMonth, lunarDay: p.lunarDay,
    twin: p.twin || null,
  };
  const go = () => {
    renderResults(p.name || '', p.year, p.month - 1, p.day, hour, p.birthplace || '', p.bloodType || p.blood_type || null, p.gender || null, {
      skipHash: opts.skipHash,
      monthlyCache: p.monthlyForecasts,
      minute: p.minute || 0,
    });
  };
  if (opts.skipLoader) go();
  else runLoader(go);
}

function continueReading() {
  const local = getStoredChart();
  const p = (typeof _savedReading !== 'undefined' && _savedReading)
    ? Object.assign({}, local || {}, {
        name: _savedReading.name,
        year: _savedReading.year,
        month: _savedReading.month,
        day: _savedReading.day,
        hour: _savedReading.hour,
        minute: _savedReading.minute || (local && local.minute) || 0,
        birthplace: _savedReading.birthplace,
        bloodType: _savedReading.blood_type,
        gender: _savedReading.gender,
        calendarType: _savedReading.calendar_type || (local && local.calendarType) || 'solar',
        leapMonth: !!(_savedReading.leap_month || (local && local.leapMonth)),
        lunarYear: _savedReading.lunar_year,
        lunarMonth: _savedReading.lunar_month,
        lunarDay: _savedReading.lunar_day,
        twin: twinFromRow(_savedReading),
      })
    : local;
  if (!p) { goToInput(); return; }
  restoreResults(p);
}

function applyRoute(hash) {
  const h = (hash == null ? currentHash() : hash);
  if (h === 'begin') {
    showScreen('input');
    fillFormFromStore();
    updateInputMode();
    return;
  }
  if (!h || h === 'landing') {
    showScreen('splash');
    updateLandingCtas();
    return;
  }
  if (h === 'input') {
    showScreen('input');
    fillFormFromStore();
    updateInputMode();
    return;
  }
  if (RESULT_TABS.indexOf(h) >= 0) {
    const p = getStoredChart() || (typeof _savedReading !== 'undefined' && _savedReading ? {
      name: _savedReading.name, year: _savedReading.year, month: _savedReading.month, day: _savedReading.day,
      hour: _savedReading.hour, birthplace: _savedReading.birthplace, bloodType: _savedReading.blood_type, gender: _savedReading.gender,
      calendarType: _savedReading.calendar_type || 'solar',
      leapMonth: !!_savedReading.leap_month, minute: _savedReading.minute || 0,
      lunarYear: _savedReading.lunar_year, lunarMonth: _savedReading.lunar_month, lunarDay: _savedReading.lunar_day,
      twin: twinFromRow(_savedReading),
    } : null);
    if (!p || !p.year) {
      goHash('input', { replace: true });
      return;
    }
    const resultsOn = document.getElementById('results')?.classList.contains('active');
    if (!resultsOn || !_shareData) {
      restoreResults(p, { skipHash: true, skipLoader: true });
    } else {
      showScreen('results');
      switchTab(h, { skipHash: true });
    }
    return;
  }
  if (window.WobaziRel && WobaziRel.isRoute(h)) {
    WobaziRel.route(h);
    return;
  }
  if (window.WobaziPortal && WobaziPortal.isRoute(h)) {
    WobaziPortal.route(h);
    return;
  }
  showScreen('splash');
}

window.addEventListener('popstate', () => {
  if (_appNavigating) return;
  applyRoute(currentHash());
});

/* ── Stars (splash background) ── */
function buildStars() {
  const container = document.getElementById('stars');
  if (!container || container.dataset.built) return;
  container.dataset.built = '1';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count = reduce ? 40 : 110;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    const isDust = !reduce && i < 14;
    s.className = isDust ? 'star star-dust' : (!reduce && i % 5 === 0 ? 'star star-drift' : 'star');
    const hues = ['#ff8ad8', '#7ce7ff', '#c4a2ff', '#ffb4a2'];
    const dust = hues[i % hues.length];
    const size = isDust ? Math.random() * 2 + 1.2 : Math.random() * 2.5 + 0.5;
    const dx = ((Math.random() * 18) - 6).toFixed(1);
    const dy = ((Math.random() * -22) - 4).toFixed(1);
    s.style.cssText = `
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      width:${size}px; height:${size}px;
      --dur:${2 + Math.random() * 3}s;
      --drift:${14 + Math.random() * 16}s;
      --dx:${dx}px; --dy:${dy}px;
      animation-delay:${Math.random() * 4}s;
      ${isDust ? `background:${dust}; box-shadow:0 0 7px ${dust};` : ''}
    `;
    container.appendChild(s);
  }
}

function initSplashExperience() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.feat-card, .splash-bazi');
  if (reduce) {
    revealEls.forEach(el => el.classList.add('is-in'));
  } else if (revealEls.length && 'IntersectionObserver' in window) {
    const root = document.getElementById('splash');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { root, threshold: 0.16, rootMargin: '0px 0px -16px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-in'));
  }

  const sigil = document.getElementById('hero-sigil');
  const splash = document.getElementById('splash');
  if (!sigil || !splash || reduce) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;
  let raf = 0;
  let tx = 0, ty = 0;
  splash.addEventListener('pointermove', (e) => {
    const r = splash.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 12;
    ty = ((e.clientY - r.top) / r.height - 0.5) * 10;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      sigil.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
      raf = 0;
    });
  });
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
const LOADING_MSGS_ZH = [
  '正在对齐天干…',
  '解读地支中…',
  '推算四柱命盘…',
  '卜问易经…',
  '绘制命运图谱…',
  '即将完成…',
];
const LOADING_MSGS_TH = [
  'กำลังจัดก้านฟ้า…',
  'กำลังอ่านกิ่งดิน…',
  'กำลังคำนวณสี่เสา…',
  'กำลังปรึกษาอี้จิง…',
  'กำลังวางแผนที่โชคชะตา…',
  'ใกล้แล้ว…',
];

let _loadingAnimId = null;
function initLoadingStars() {
  const canvas = document.getElementById('loading-stars-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  function resize() {
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
  }
  resize();
  const W = () => canvas.offsetWidth;
  const H = () => canvas.offsetHeight;
  const stars = Array.from({ length: 60 }, () => ({
    x: Math.random() * W(),
    y: Math.random() * H(),
    r: Math.random() * 1.5 + 0.3,
    a: Math.random(),
    s: Math.random() * 0.008 + 0.003,
    d: Math.random() > 0.5 ? 1 : -1,
  }));
  function draw() {
    ctx.clearRect(0, 0, W(), H());
    stars.forEach(st => {
      st.a += st.s * st.d;
      if (st.a >= 1 || st.a <= 0.1) st.d *= -1;
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240,192,64,${st.a * 0.5})`;
      ctx.fill();
    });
    // Draw faint constellation lines between nearby stars
    ctx.strokeStyle = 'rgba(240,192,64,0.06)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        if (dx * dx + dy * dy < 6000) {
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.stroke();
        }
      }
    }
    _loadingAnimId = requestAnimationFrame(draw);
  }
  draw();
}

function stopLoadingStars() {
  if (_loadingAnimId) { cancelAnimationFrame(_loadingAnimId); _loadingAnimId = null; }
}

function runLoader(callback) {
  showScreen('loading');
  initLoadingStars();
  const msgEl  = document.getElementById('loading-msg');
  const fillEl = document.getElementById('loading-fill');
  let step = 0;
  const total = LOADING_MSGS.length;
  const setLoadMsg = (i) => {
    if (!msgEl) return;
    msgEl.innerHTML = _t(LOADING_MSGS[i], LOADING_MSGS_ZH[i], LOADING_MSGS_TH[i]);
  };
  setLoadMsg(0);
  const iv = setInterval(() => {
    setLoadMsg(step);
    fillEl.style.width = ((step + 1) / total * 100) + '%';
    step++;
    if (step >= total) {
      clearInterval(iv);
      setTimeout(() => { stopLoadingStars(); callback(); }, 400);
    }
  }, 380);
}

/* ═══════════════════════════════════════
   UI — Form Submit
═══════════════════════════════════════ */
function setDobError(msg) {
  const hint = document.getElementById('dob-error');
  const trio = document.querySelector('#bazi-form .date-trio');
  if (hint) {
    hint.textContent = msg || '';
    hint.classList.toggle('hide', !msg);
  }
  if (trio) trio.classList.toggle('is-invalid', !!msg);
}

function isValidBirthDate(y, m, d) {
  if (!d || !m || !y) return false;
  if (y < 1900 || y > 2100) return false;
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  if (getCalendarType() === 'lunar' && window.BaziEngine) {
    const leap = !!document.getElementById('leap-month')?.checked;
    const max = BaziEngine.getLunarMonthLength(y, m, leap);
    return max > 0 && d >= 1 && d <= max;
  }
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

function handleSubmit(e) {
  e.preventDefault();
  haptic([15, 50, 15]);
  const payload = collectBirthPayload();
  const y = payload && (payload.calendarType === 'lunar' ? payload.lunarYear : payload.year);
  const m = payload && (payload.calendarType === 'lunar' ? payload.lunarMonth : payload.month);
  const d = payload && (payload.calendarType === 'lunar' ? payload.lunarDay : payload.day);
  if (!payload || !isValidBirthDate(y, m, d)) {
    const lang = currentLang();
    const dobMsg = lang === 'zh' ? '请填写出生日期。' : lang === 'th' ? 'กรุณากรอกวันเกิด' : 'Please enter your date of birth.';
    setDobError(dobMsg);
    const dayEl = document.getElementById('birth-day');
    if (dayEl) dayEl.focus();
    return;
  }
  setDobError('');

  _birthMeta = {
    calendarType: payload.calendarType,
    leapMonth: payload.leapMonth,
    minute: payload.minute || 0,
    lunarYear: payload.lunarYear,
    lunarMonth: payload.lunarMonth,
    lunarDay: payload.lunarDay,
    twin: payload.twin || null,
  };
  saveLocalChart(payload);
  track('chart_calculated', {
    calendar: payload.calendarType,
    has_time: payload.hour != null,
    has_gender: !!payload.gender,
    twin: payload.twin ? payload.twin.order : 'no',
  });

  runLoader(() => {
    try {
      renderResults(payload.name, payload.year, payload.month - 1, payload.day, payload.hour, payload.birthplace, payload.bloodType, payload.gender, { minute: payload.minute || 0 });
    } catch (err) {
      console.error('[renderResults error]', err);
      showScreen('input');
      goHash('input', { replace: true });
      alert(_plainLoc({ en: 'Something went wrong generating your reading. Please try again.', zh: '生成解读时出错，请重试。', th: 'เกิดข้อผิดพลาดในการสร้างผลการอ่านดวง โปรดลองอีกครั้ง' }));
    }
  });
}

/* ═══════════════════════════════════════
   UI — Render Results
═══════════════════════════════════════ */
function renderResults(name, year, month, day, hour, birthplace = '', bloodType = null, gender = null, opts = {}) {
  const minute = (opts && opts.minute != null) ? opts.minute : (_birthMeta.minute || 0);
  let accurate = null;
  let pillars;
  if (window.BaziEngine && typeof BaziEngine.calcBaziAccurate === 'function') {
    accurate = BaziEngine.calcBaziAccurate({
      year,
      month: month + 1,
      day,
      hour,
      minute,
      calendar: 'solar',
      gender,
      twin: (opts && opts.twin) || _birthMeta.twin || null,
    });
    pillars = accurate.pillars;
    _lastAccurate = accurate;
  } else {
    pillars = calcBazi(year, month, day, hour, minute);
  }
  const yearPillar = pillars[0];
  const animal   = yearPillar.branch.animal;
  const zData    = ZODIAC[animal];
  const elements = calcElements(pillars);
  const fortune  = calcFortune(animal, elements);

  // Apply blood type fortune modifiers (optional)
  if (bloodType && BLOOD_TYPE[bloodType]) {
    const mods = BLOOD_TYPE[bloodType].mod;
    Object.keys(mods).forEach(k => {
      if (fortune[k] !== undefined) {
        fortune[k] = Math.min(99, Math.max(1, fortune[k] + mods[k]));
      }
    });
  }

  // Greeting — simple name
  const greetEn = name ? `Hello, ${name} ✦` : 'Your Destiny ✦';
  const greetZh = name ? `你好，${name} ✦` : '你的命运 ✦';
  const greetTh = name ? `สวัสดี, ${name} ✦` : 'โชคชะตาของคุณ ✦';
  document.getElementById('greeting').innerHTML = _t(greetEn, greetZh, greetTh);

  const elColor = EL_COLOR[yearPillar.stem.element];
  const dominantEl = Object.entries(elements).sort((a,b)=>b[1]-a[1])[0][0];

  // Store share data
  _shareData = { name, animal, element: yearPillar.stem.element, polarity: yearPillar.stem.polarity, year, fortune, dominantEl, bloodType, tenGods: accurate && accurate.tenGods, pillars, elements };
  window._shareData = _shareData;

  // Hero card
  document.getElementById('hero-bg').style.background =
    `linear-gradient(135deg, ${elColor}28, ${elColor}55, #0f0f1c)`;
  const _heroMed = document.getElementById('hero-medallion');
  if (_heroMed) _heroMed.innerHTML = makeMedallion(animal, elColor, 'hero-med');
  document.getElementById('hero-year-tag').innerHTML =
    _t(`Year of the ${animal} · ${year}`, `${ANIMAL_ZH[animal]}年 · ${year}`, `ปี${ANIMAL_TH[animal]} · ${year}`);
  document.getElementById('hero-name').innerHTML = _t(animal, ANIMAL_ZH[animal], ANIMAL_TH[animal]);
  document.getElementById('hero-chinese').textContent =
    yearPillar.stem.char + yearPillar.branch.char;

  const badgeEl = document.getElementById('hero-badges');
  badgeEl.innerHTML = [
    _t(yearPillar.stem.element, EL_ZH[yearPillar.stem.element], EL_TH[yearPillar.stem.element]),
    _t(yearPillar.stem.polarity, yearPillar.stem.polarity === 'Yang' ? '阳' : '阴', yearPillar.stem.polarity === 'Yang' ? 'หยาง' : 'หยิน'),
    yearPillar.branch.pinyin,
  ].map(t => `<span class="badge">${t}</span>`).join('');

  document.getElementById('trait-pills').innerHTML =
    zData.traits.map(t => `<span class="trait-pill">${_t(t, TRAIT_ZH[t] || t)}</span>`).join('');

  // Compact hero: Today Summary
  const heroNow = new Date();
  const heroDateStr = heroNow.toLocaleDateString(dateLocale(), { day:'numeric', month:'short' });
  const heroTodayIdx  = calcDayBranch(heroNow.getFullYear(), heroNow.getMonth(), heroNow.getDate());
  const heroTodayAnimal = BRANCHES[heroTodayIdx].animal;
  const heroIsCompat  = zData.compat.includes(heroTodayAnimal);
  const heroIsClash   = zData.clash.includes(heroTodayAnimal);
  const heroMsgEn = heroIsCompat
    ? `Today's ${heroTodayAnimal} day flows with your chart — make bold moves.`
    : heroIsClash
    ? `Today's ${heroTodayAnimal} day creates friction with your chart — move slowly.`
    : `A steady ${heroTodayAnimal} day — stay consistent and trust the process.`;
  const heroMsgZh = heroIsCompat
    ? `今日${ANIMAL_ZH[heroTodayAnimal]}日与命盘相合，大胆行动。`
    : heroIsClash
    ? `今日${ANIMAL_ZH[heroTodayAnimal]}日与命盘有冲，放缓节奏。`
    : `今日${ANIMAL_ZH[heroTodayAnimal]}日平稳，坚持一致，相信过程。`;
  const heroMsgTh = heroIsCompat
    ? `วัน${ANIMAL_TH[heroTodayAnimal]}วันนี้ไหลไปกับแผนภูมิของคุณ — กล้าได้`
    : heroIsClash
    ? `วัน${ANIMAL_TH[heroTodayAnimal]}วันนี้เสียดกับแผนภูมิ — ขยับช้าๆ`
    : `วัน${ANIMAL_TH[heroTodayAnimal]}ที่มั่นคง — สม่ำเสมอและเชื่อกระบวนการ`;
  // Static fallbacks for DO/AVOID/WATCH (used while AI loads or on failure)
  const fallbackDo    = MORNING_RITUAL[dominantEl][0];
  const fallbackAvoidEn = LUCKY_FOODS[dominantEl].avoid[0];
  const fallbackAvoidZh = LUCKY_FOODS[dominantEl].avoid_zh[0];
  const fallbackWatchEn = heroIsCompat ? 'Opportunities aligned with your long-term goals'
                    : heroIsClash  ? 'Impulsive decisions — pause before acting'
                    : 'Distraction — keep focus on one thing today';
  const fallbackWatchZh = heroIsCompat ? '与长期目标相符的机遇'
                    : heroIsClash  ? '冲动决定——行动前先暂停'
                    : '分心——今天专注一件事';
  const heroEmoji = BRANCHES.find(b => b.animal === animal)?.emoji || '';
  document.getElementById('hero-today-label').innerHTML = _t(`TODAY · ${heroDateStr}`, `今日 · ${heroDateStr}`, `วันนี้ · ${heroDateStr}`);
  document.getElementById('hero-zodiac-title').innerHTML =
    `${heroEmoji} ${_t(`${yearPillar.stem.element} ${animal}`, `${EL_ZH[yearPillar.stem.element]}${ANIMAL_ZH[animal]}`, `${EL_TH[yearPillar.stem.element]} ${ANIMAL_TH[animal]}`)}`;
  document.getElementById('hero-profile-chip').innerHTML = '';
  document.getElementById('hero-summary-msg').innerHTML = _t(heroMsgEn, heroMsgZh, heroMsgTh);

  // Compact context strip (Today, You, Relationships tabs)
  const csTodayPillar = calcTodayPillar();
  const csTodayEmoji = BRANCHES.find(b => b.animal === csTodayPillar.animal)?.emoji || '';
  const csScore = dailyFortuneScore(heroIsCompat, heroIsClash);
  const csVerdictEn = heroIsCompat ? 'AUSPICIOUS' : heroIsClash ? 'CHALLENGING' : 'BALANCED';
  const csVerdictZh = heroIsCompat ? '大吉' : heroIsClash ? '冲煞' : '平稳';
  const csVerdictTh = heroIsCompat ? 'มงคล' : heroIsClash ? 'ท้าทาย' : 'สมดุล';
  document.getElementById('cs-bg').style.background =
    `linear-gradient(135deg, ${elColor}28, ${elColor}55, #0f0f1c)`;
  document.getElementById('cs-date').textContent = heroDateStr;
  document.getElementById('cs-pillar').innerHTML =
    `${csTodayEmoji} ${_t(`${csTodayPillar.stem.element} ${csTodayPillar.animal}`, `${EL_ZH[csTodayPillar.stem.element]}${ANIMAL_ZH[csTodayPillar.animal]}`, `${EL_TH[csTodayPillar.stem.element]} ${ANIMAL_TH[csTodayPillar.animal]}`)}`;
  document.getElementById('cs-chinese').textContent = `${csTodayPillar.stem.char}${csTodayPillar.branch.char}`;
  document.getElementById('cs-score').textContent = csScore;
  document.getElementById('cs-verdict').innerHTML = _t(csVerdictEn, csVerdictZh, csVerdictTh);
  document.getElementById('cs-hero-text').innerHTML = _t(heroMsgEn, heroMsgZh, heroMsgTh);
  // Default: show strip (Today tab is default), hide hero card
  document.getElementById('hero-card').classList.add('hide');
  document.getElementById('context-strip').classList.remove('hide');

  // Show loading shimmer for DO/AVOID/WATCH, then fetch AI guidance
  document.getElementById('hero-bullets').innerHTML = `
    <div class="hc-bullet"><span class="hc-bullet-key">${_t('DO','做','ทำ')}</span><span class="guidance-loading">✦ ${_t('Reading your chart…','正在解读命盘…','กำลังอ่านแผนภูมิ…')}</span></div>
    <div class="hc-bullet"><span class="hc-bullet-key">${_t('AVOID','避')}</span><span class="guidance-loading">✦</span></div>
    <div class="hc-bullet"><span class="hc-bullet-key">${_t('WATCH','注意')}</span><span class="guidance-loading">✦</span></div>`;

  // Today / You tab new sections
  renderLifeAreas(fortune, heroIsCompat, heroIsClash);
  renderInsightCards(_t(heroMsgEn, heroMsgZh, heroMsgTh), fortune, dominantEl);
  renderActionsPreview({ title: 'Loading…', title_zh: '加载中…' }, 'Loading…', '加载中…', 'Loading…', '加载中…');

  // Fetch AI-generated daily guidance
  (async () => {
    try {
      const todayPillar = calcTodayPillar();
      const guidanceChart = {
        animal,
        dominantEl,
        pillars: pillars.map(p => ({
          label: p.label,
          known: p.known,
          stem: p.known ? { char: p.stem.char, element: p.stem.element, polarity: p.stem.polarity } : null,
          branch: p.known ? { char: p.branch.char, animal: p.branch.animal, element: p.branch.element } : null,
        })),
        today: {
          stem: todayPillar.stem.char,
          branch: todayPillar.branch.char,
          animal: todayPillar.animal,
          nobleman: isNoblemanDay(animal, todayPillar.animal),
          isClash: heroIsClash,
          isCompat: heroIsCompat,
          score: csScore,
        },
        tenGods: accurate && accurate.tenGods ? accurate.tenGods.list.map(g => ({
          id: g.id, en: g.en, zh: g.zh, percent: g.percent,
        })) : null,
        tenGodsSentence: accurate && accurate.tenGods ? accurate.tenGods.sentence : null,
      };
      const resp = await fetch('/api/daily-guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chartData: guidanceChart }),
      });
      if (!resp.ok) throw new Error('API error');
      const g = await resp.json();
      // Update hero bullets with AI guidance
      document.getElementById('hero-bullets').innerHTML = `
        <div class="hc-bullet"><span class="hc-bullet-key">${_t('DO','做')}</span><span>${_t(g.do.en, g.do.zh)}</span></div>
        <div class="hc-bullet"><span class="hc-bullet-key">${_t('AVOID','避')}</span><span>${_t(g.avoid.en, g.avoid.zh)}</span></div>
        <div class="hc-bullet"><span class="hc-bullet-key">${_t('WATCH','注意')}</span><span>${_t(g.watch.en, g.watch.zh)}</span></div>`;
      // Update actions preview card
      renderActionsPreview({ title: g.do.en, title_zh: g.do.zh }, g.avoid.en, g.avoid.zh, g.watch.en, g.watch.zh);
    } catch (err) {
      console.warn('Daily guidance fallback:', err.message);
      /* Fall back to static guidance — and say so, so a silent AI outage doesn't read as a
         personalised note (the static lines are chart-generic). */
      const gnote = `<div class="hc-bullet hc-bullet-note">${_t(
        "Today's personalised note didn't load — showing general guidance for this day.",
        '今日的个性化提示未能加载，以下为当日通用指引。',
        'โน้ตเฉพาะบุคคลของวันนี้โหลดไม่สำเร็จ — แสดงคำแนะนำทั่วไปของวันนี้แทน')}</div>`;
      document.getElementById('hero-bullets').innerHTML = gnote + `
        <div class="hc-bullet"><span class="hc-bullet-key">${_t('DO','做')}</span><span>${_t(fallbackDo.title, fallbackDo.title_zh)}</span></div>
        <div class="hc-bullet"><span class="hc-bullet-key">${_t('AVOID','避')}</span><span>${_t(fallbackAvoidEn, fallbackAvoidZh)}</span></div>
        <div class="hc-bullet"><span class="hc-bullet-key">${_t('WATCH','注意')}</span><span>${_t(fallbackWatchEn, fallbackWatchZh)}</span></div>`;
      renderActionsPreview(fallbackDo, fallbackAvoidEn, fallbackAvoidZh, fallbackWatchEn, fallbackWatchZh);
    }
    if (window.WobaziPortal) WobaziPortal.captureToday({ dominantEl });
  })();
  renderYouHero(animal, yearPillar, elColor);
  renderTenGods(accurate && accurate.tenGods, pillars);
  renderNowOverlays(pillars, accurate && accurate.dayMaster);
  renderNobleCard(pillars);

  // Daily fortune
  renderDailyFortune(animal);

  // Pillars
  renderPillars(pillars);

  // Radar / element balance
  renderRadar(elements);

  // Fortune
  renderFortune(fortune);

  // 2026 Forecast (pre-calc once so love section shares same overall score)
  const forecast2026 = calc2026Fortune(animal, elements);
  render2026Fortune(animal, elements, forecast2026);

  cacheMonthlyWithChart(pillars, accurate && accurate.dayMaster, opts.monthlyCache);

  // Love & Relationships
  renderLoveSection(animal, elements, forecast2026.overall);

  // Work & Career monthly
  renderWorkSection(animal, elements, forecast2026);

  // Career + season + yin/yang
  renderCareerArchetype(dominantEl);
  renderPowerSeason(dominantEl);
  renderYinYang(pillars);

  // Reading
  document.getElementById('reading-en').textContent = zData.desc_en;
  document.getElementById('reading-zh').textContent = zData.desc_zh;

  // Compatibility
  renderCompat(animal, zData);

  // Relationships tab sections
  renderRelProfile(animal, yearPillar, pillars[2], dominantEl);
  renderSoulAnimals(animal);
  renderBusinessCompat(animal, dominantEl, elements);

  // Lucky
  renderLucky(zData.lucky);

  // Optional personality sections — reset first, then populate if data provided
  document.getElementById('blood-section').classList.add('data-hidden');
  document.getElementById('birthplace-section').classList.add('data-hidden');
  document.getElementById('kua-section').classList.add('data-hidden');
  renderBloodTypeSection(bloodType, dominantEl);
  renderBirthplaceSection(birthplace, dominantEl);

  // New feature renders
  const nowMonth = new Date().getMonth(); // 0-indexed
  renderOutfitSection(dominantEl, nowMonth);
  renderLuckyNumbers(year, month, day, animal, dominantEl);
  renderAuspiciousDates(animal, dominantEl);
  renderLuckyFoods(dominantEl);
  renderCrystals(dominantEl);
  renderMorningRitual(dominantEl);
  if (gender) {
    const kua = calcKua(year, gender);
    document.getElementById('kua-section').classList.remove('data-hidden');
    renderKuaSection(kua, dominantEl);
  }
  renderLifeDecades(year, dominantEl, accurate && accurate.luck, month, day);

  // Oracle deep read (includes career timing)
  renderOracleTab(animal, elements, fortune, pillars, forecast2026, dominantEl);

  showScreen('results');
  haptic([20, 60, 20]);

  const hashTab = currentHash();
  const initTab = RESULT_TABS.indexOf(hashTab) >= 0 ? hashTab : 'you';
  switchTab(initTab, { skipHash: true });
  if (!opts.skipHash && currentHash() !== 'you') {
    _appNavigating = true;
    history.pushState({ wobazi: 'you' }, '', location.pathname + location.search + '#you');
    _appNavigating = false;
  }

  applyI18n();

  // Animate progress rings after screen shows
  setTimeout(() => animateFortune(fortune), 300);
}

/* ── Four Pillars ── */
/* Displayed Hour → Day → Month → Year, the way a 命盘 is written (right to left).
   The pillars array itself stays Year, Month, Day, Hour everywhere else. */
function renderPillars(pillars) {
  const labels = ['Year','Month','Day','Hour'];
  const row = document.getElementById('pillars-row');
  row.innerHTML = [3, 2, 1, 0].map(i => {
    const p = pillars[i];
    if (!p.known) {
      return `<div class="pillar-card dimmed">
        <div class="pillar-label">${_t(labels[i], {Year:'年',Month:'月',Day:'日',Hour:'时'}[labels[i]], {Year:'ปี',Month:'เดือน',Day:'วัน',Hour:'ชั่วโมง'}[labels[i]])}</div>
        <div style="font-size:11px;color:var(--muted);margin-top:8px">${_t('Unknown','未知','ไม่ทราบ')}</div>
      </div>`;
    }
    const elColor = EL_COLOR[p.stem.element];
    const twinTag = p.twinShifted
      ? `<div class="pillar-twin-tag" title="${p.natal ? p.natal.stem.char + p.natal.branch.char : ''}">${_t('Twin', '双胞', 'แฝด')}</div>`
      : '';
    return `<div class="pillar-card${i === 2 ? ' pillar-self' : ''}${p.twinShifted ? ' pillar-twin' : ''}">
      <div class="pillar-label">${_t(labels[i], {Year:'年',Month:'月',Day:'日',Hour:'时'}[labels[i]], {Year:'ปี',Month:'เดือน',Day:'วัน',Hour:'ชั่วโมง'}[labels[i]])}</div>
      <div class="pillar-stem-char" style="color:${elColor}">${p.stem.char}</div>
      <div class="pillar-stem-name">${p.stem.pinyin}</div>
      <div class="pillar-sep"></div>
      <div class="pillar-branch-char">${p.branch.char}</div>
      ${makeMedallion(p.branch.animal, EL_COLOR[p.branch.element], 'pillar-med')}
      <div class="pillar-animal-name">${_t(p.branch.animal, ANIMAL_ZH[p.branch.animal])}</div>
      <div class="pillar-el-dot" style="background:${EL_COLOR[p.branch.element]}"></div>
      ${twinTag}
    </div>`;
  }).join('');
  renderChartBasis();
  const disc = document.getElementById('pillar-disclaimer');
  if (disc) {
    disc.innerHTML = _t(
      'Chart uses local clock time (not true solar time). Year changes at 立春; month at 节气.',
      '命盘使用当地钟点（非真太阳时）。年柱以立春为界，月柱以节气为界。',
      'แผนใช้เวลาตามนาฬิกาท้องถิ่น (ไม่ใช่สุริยคติแท้) ปีเปลี่ยนที่立春 เดือนเปลี่ยนที่节气'
    );
  }
}

/* "Chart for 29 Apr 1995 · 08:45 · Solar" — so a lunar/solar mix-up is visible at a glance. */
function renderChartBasis() {
  const el = document.getElementById('chart-basis');
  const a = _lastAccurate;
  if (!el) return;
  if (!a || !a.solar) { el.innerHTML = ''; return; }
  const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const pad = n => String(n).padStart(2, '0');
  const s = a.solar;
  const dateEn = `${s.day} ${MON[s.month - 1]} ${s.year}`;
  const dateZh = `${s.year}年${s.month}月${s.day}日`;
  const dateTh = new Date(Date.UTC(s.year, s.month - 1, s.day)).toLocaleDateString('th-TH-u-ca-gregory', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  const time = s.hour == null ? '' : ` · ${pad(s.hour)}:${pad(s.minute || 0)}`;
  const timeUnk = s.hour == null ? _t(' · time unknown', ' · 时辰未知', ' · ไม่ทราบเวลา') : '';
  let cal = _t('Solar', '阳历', 'สุริยคติ');
  const m = _birthMeta || {};
  if (m.calendarType === 'lunar' && m.lunarYear) {
    const lunarStr = `${m.lunarYear}-${pad(m.lunarMonth)}-${pad(m.lunarDay)}${m.leapMonth ? ' 闰' : ''}`;
    cal = _t('from Lunar ' + lunarStr, '农历 ' + lunarStr + ' 换算', 'จากจันทรคติ ' + lunarStr);
  }
  let twin = '';
  if (a.twin) {
    const order = a.twin.order === 'younger' ? _t('younger twin', '双胞胎（后出生）', 'แฝดคนน้อง') : _t('older twin', '双胞胎（先出生）', 'แฝดคนพี่');
    let how = '';
    if (a.twin.applied && a.twin.method === 'luck') how = _t(' · month from 1st luck pillar', ' · 月柱取第一步大运', ' · เสาเดือนจากวัยจรแรก');
    else if (a.twin.applied && a.twin.method === 'hour') how = _t(' · hour moved one 时辰', ' · 时柱后移一位', ' · เลื่อนเสายามหนึ่งช่วง');
    else if (a.twin.reason === 'needs_gender') how = _t(' · add gender to apply', ' · 需填写性别', ' · กรุณาระบุเพศ');
    else if (a.twin.reason === 'needs_time') how = _t(' · add birth time to apply', ' · 需填写出生时间', ' · กรุณาระบุเวลาเกิด');
    twin = ` · ${order}${how}`;
  }
  el.innerHTML = `${_t('Chart for', '命盘', 'แผนภูมิของ')} <strong>${_t(dateEn, dateZh, dateTh)}${time}</strong>${timeUnk} · ${cal}${twin}`;
}

function renderTenGods(profile, pillars) {
  const lead = document.getElementById('tengods-lead');
  const list = document.getElementById('tengods-list');
  if (!list) return;
  if (!profile || !profile.list) {
    if (lead) lead.innerHTML = '';
    list.innerHTML = '';
    return;
  }
  if (lead) lead.innerHTML = _t(profile.sentence.en, profile.sentence.zh, profile.sentence.th);
  const maxAxis = Math.max(33.3, ...profile.list.map(g => g.percent));
  list.innerHTML = profile.list.map((g, i) => {
    const fam = (g.family === 'peer' || g.family === 'resource') ? 'fam-peer' : 'fam-power';
    const PILLAR_NAME = { Year: ['年', 'ปี'], Month: ['月', 'เดือน'], Day: ['日', 'วัน'], Hour: ['时', 'ชั่วโมง'] };
    const locIn = li => (g.sources || []).slice(0, 4).map(s => (li < 0 ? s.pillar : (PILLAR_NAME[s.pillar] || [])[li] || s.pillar) + ' ' + s.char);
    const loc = locIn(-1).join(', ');
    const meaning = g.meaning || {};
    const how = loc
      ? _t('Shows up in ' + loc + '.', '出现在：' + locIn(0).join('、') + '。', 'ปรากฏที่ ' + locIn(1).join(', '))
      : '';
    return `<div class="tengods-row${g.percent === 0 ? ' is-zero' : ''}" onclick="toggleTenGod(this)">
      <div class="tengods-name">${_t(`${g.en}<span class="tg-zh">${g.zh}</span>`, g.zh, `${g.th || g.en}<span class="tg-zh">${g.zh}</span>`)}</div>
      <div class="tengods-bar-track"><div class="tengods-bar-fill ${fam}" style="width:${Math.min(100, (g.percent / maxAxis) * 100)}%"></div></div>
      <div class="tengods-pct">${g.percent}%</div>
      <div class="tengods-detail hide">${_t(meaning.en || '', meaning.zh || '', meaning.th || '')}${how ? ' ' + how : ''}</div>
    </div>`;
  }).join('');
}
function godLabel(id) {
  if (window.BaziEngine && BaziEngine.tenGodLabel) {
    const g = BaziEngine.tenGodLabel(id);
    if (g) return _t(g.en, g.zh, g.th);
  }
  return id || '';
}

function renderNowOverlays(pillars, dayMaster) {
  const nowEl = document.getElementById('tengods-now');
  const elNow = document.getElementById('elements-now');
  if (!window.BaziEngine || !BaziEngine.analyzeNowOverlay || !pillars) {
    if (nowEl) nowEl.innerHTML = '';
    if (elNow) elNow.innerHTML = '';
    return;
  }
  const o = BaziEngine.analyzeNowOverlay(pillars, dayMaster);
  const yStem = o.year.stem;
  const mStem = o.month.stem;
  const yBr = o.year.branch;
  const mBr = o.month.branch;
  const yLabel = `${yStem.char}${yBr.char}`;
  const mLabel = `${mStem.char}${mBr.char}`;
  const kindLine = (line, whenEn, whenZh, whenTh, stem, br) => {
    const who = stem && br ? `${stem.char}${br.char} ${stem.element} ${br.animal}` : '';
    const whoZh = stem && br ? `${stem.char}${br.char} ${EL_ZH[stem.element] || ''}${ANIMAL_ZH[br.animal] || ''}` : '';
    const whoTh = stem && br ? `${stem.char}${br.char} ${ANIMAL_TH[br.animal] || br.animal}${EL_TH[stem.element] || stem.element}` : '';
    const elTh = line ? (EL_TH[line.el] || line.el) : '';
    if (line && line.kind === 'strengthen') return _t(whenEn + ' strengthens ' + line.el + (who ? ' — ' + who : '') + '.', whenZh + '生助' + (EL_ZH[line.el] || line.el) + (whoZh ? '（' + whoZh + '）' : '') + '。', whenTh + 'เสริมพลังธาตุ' + elTh + (whoTh ? ' — ' + whoTh : ''));
    if (line && line.kind === 'drain') return _t(whenEn + ' drains ' + line.el + (who ? ' — ' + who : '') + '.', whenZh + '泄/克' + (EL_ZH[line.el] || line.el) + (whoZh ? '（' + whoZh + '）' : '') + '。', whenTh + 'ถอนพลังธาตุ' + elTh + (whoTh ? ' — ' + whoTh : ''));
    return _t(whenEn + ' sits as ' + (who || 'a mixed month') + ' beside your Day Master.', whenZh + '为' + (whoZh || '驳杂') + '，与日主并立。', whenTh + 'คือ ' + (whoTh || 'ผสม') + ' ข้างวันมาสเตอร์');
  };
  const clashNote = o.clashMonth
    ? _t(' This month clashes a natal branch.', ' 本月冲本命地支。', ' เดือนนี้ชงกิ่งกำเนิด')
    : o.clashYear
      ? _t(' This year clashes a natal branch.', ' 流年冲本命地支。', ' ปีนี้ชงกิ่งกำเนิด')
      : '';
  if (nowEl) {
    nowEl.innerHTML = `
      <div class="now-kicker">${_t('Now — 流年 / 流月', '此刻 — 流年 / 流月', 'ตอนนี้ — 流年 / 流月')}</div>
      <div class="now-pills">
        <span class="now-pill">${_t('Year', '年', 'ปี')} ${yLabel}${o.yearGod ? ' · ' + godLabel(o.yearGod) : ''}</span>
        <span class="now-pill">${_t('Month', '月', 'เดือน')} ${mLabel}${o.monthGod ? ' · ' + godLabel(o.monthGod) : ''}</span>
      </div>
      <p class="now-line">${kindLine(o.monthLine, 'This month', '本月', 'เดือนนี้', mStem, mBr)}${clashNote}</p>
      <p class="now-sub">${kindLine(o.yearLine, 'This year', '流年', 'ปีนี้', yStem, yBr)}</p>`;
  }
  if (elNow) {
    elNow.innerHTML = `
      <div class="now-kicker">${_t('Now vs natal elements', '此刻与本命五行', 'ธาตุตอนนี้เทียบแผนกำเนิด')}</div>
      <p class="now-line">${kindLine(o.monthLine, 'This month', '本月', 'เดือนนี้', mStem, mBr)}</p>
      <p class="now-sub">${kindLine(o.yearLine, 'This year', '流年', 'ปีนี้', yStem, yBr)}</p>`;
  }
}

function renderNobleCard(pillars) {
  const el = document.getElementById('noble-card');
  if (!el) return;
  if (!window.BaziEngine || !BaziEngine.getNatalNobles) {
    el.innerHTML = '';
    return;
  }
  const n = BaziEngine.getNatalNobles(pillars);
  const animals = (n.tianyiBranches || []).map(b => _t(b.animal, ANIMAL_ZH[b.animal] || b.animal)).join(' · ');
  const hits = (n.tianyi || []).map(h =>
    `<span class="noble-chip">${_t(h.pillar)} · ${h.branch}${_t(' ' + h.animal, ANIMAL_ZH[h.animal] || '')}</span>`
  ).join('');
  const extra = [];
  if (n.yuede) extra.push(`${_t('Moon Virtue 月德', '月德贵人', '月德')} ${n.yuede.stem}${n.yuede.present ? _t(' — in this chart', ' — 入盘', ' — ในแผนนี้') : _t(' — not in the four pillars', ' — 未入四柱', ' — ไม่อยู่ในสี่เสา')}`);
  if (n.tiande) extra.push(`${_t('Heavenly Virtue 天德', '天德贵人', '天德')} ${n.tiande.token}${n.tiande.present ? _t(' — in this chart', ' — 入盘', ' — ในแผนนี้') : _t(' — not in the four pillars', ' — 未入四柱', ' — ไม่อยู่ในสี่เสา')}`);
  el.innerHTML = `
    <div class="noble-card">
      <p class="noble-lead">${_t('Helpful people, mentors, earth angels. Natal BaZi marks them as 天乙贵人 — and, from the month, 月德 and 天德.', '贵人是助你的人、导师、人间天使。八字以天乙贵人标出，并以月柱看月德、天德。', 'ผู้เอื้อ พี่เลี้ยง เทวดาบนดิน ในปาจื้อดูที่ 天乙贵人 และจากเสาเดือน 月德 天德')}</p>
      <div class="noble-block">
        <div class="noble-label">天乙贵人</div>
        <p class="noble-animals">${_t('Noble branches for your Day Master: ', '日主天乙地支：', 'กิ่ง贵人ของวันมาสเตอร์คุณ: ')}${animals || '—'}</p>
        <div class="noble-hits">${hits || `<span class="noble-empty">${_t('None of those branches sit in the four pillars — support still arrives in time, just not as a natal star.', '四柱未见天乙地支——助力仍会按时出现，只是不在本命星。', 'ไม่มีกิ่งเหล่านั้นในสี่เสา — ความช่วยเหลือยังมาตามเวลา แค่ไม่ใช่ดาวกำเนิด')}</span>`}</div>
      </div>
      ${extra.length ? `<ul class="noble-extra">${extra.map(x => `<li>${x}</li>`).join('')}</ul>` : ''}
      <p class="noble-qm">${_t('Qi Men Dunjia locates helpful direction in time — Chief Deity 值符, and the Three Wonders 乙 (Sun Noble), 丙 (Moon Noble), 丁 (Jade Maiden). Wobazi shows natal stars; a full Qi Men plate is a later map.', '奇门遁甲在时间里找贵人方位——值符，以及三奇：乙（日奇）、丙（月奇）、丁（星奇 / 玉女）。Wobazi 先呈现本命星；完整奇门盘是下一张地图。', '奇门遁甲 หาทิศผู้เอื้อในเวลา — 值符 และสามอัศจรรย์ 乙 丙 丁 Wobazi โชว์ดาวกำเนิดก่อน')}</p>
    </div>`;
}

function toggleTenGod(row) {
  if (!row) return;
  const open = row.classList.contains('is-open');
  document.querySelectorAll('.tengods-row.is-open').forEach(r => {
    r.classList.remove('is-open');
    const d = r.querySelector('.tengods-detail');
    if (d) d.classList.add('hide');
  });
  if (!open) {
    row.classList.add('is-open');
    const d = row.querySelector('.tengods-detail');
    if (d) d.classList.remove('hide');
  }
}

function birthChartKeyFromPillars(pillars) {
  const dm = pillars[2] && pillars[2].stem ? pillars[2].stem.char : '';
  const ys = pillars[0] && pillars[0].stem ? pillars[0].stem.char : '';
  const ms = pillars[1] && pillars[1].stem ? pillars[1].stem.char : '';
  const db = pillars[2] && pillars[2].branch ? pillars[2].branch.char : '';
  return dm + ys + ms + db;
}

function cacheMonthlyWithChart(pillars, dayMaster, cached) {
  if (!window.BaziEngine || !pillars) return;
  const year = new Date().getFullYear();
  const key = birthChartKeyFromPillars(pillars);
  let bundle = cached;
  if (!bundle || bundle.year !== year || bundle.chartKey !== key) {
    const love = BaziEngine.calcMonthlyForecast({
      year, domain: 'love', pillars, dayMaster, userId: currentUserKey(), birthChartKey: key,
    });
    const career = BaziEngine.calcMonthlyForecast({
      year, domain: 'career', pillars, dayMaster, userId: currentUserKey(), birthChartKey: key,
    });
    bundle = { year, chartKey: key, love, career };
  }
  _lastAccurate = _lastAccurate || {};
  _lastAccurate.monthly = bundle;
  saveLocalChart({ monthlyForecasts: bundle });
}

function getCachedMonthly(domain) {
  const b = _lastAccurate && _lastAccurate.monthly;
  if (b && b[domain]) return b[domain];
  const store = getStoredChart();
  if (store && store.monthlyForecasts && store.monthlyForecasts[domain]) return store.monthlyForecasts[domain];
  return null;
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
  const EL_ZH_NAMES = { Wood:'木', Fire:'火', Earth:'土', Metal:'金', Water:'水' };
  const labelEls = els.map((el, i) => {
    const [x,y] = pt(i, 1.18);
    return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle"
      font-family="Space Grotesk, sans-serif" font-size="9" font-weight="700"
      fill="${EL_COLOR[el]}" letter-spacing="1" class="en">${el.toUpperCase()}</text>` +
      `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle"
      font-family="Noto Sans SC, sans-serif" font-size="11" font-weight="700"
      fill="${EL_COLOR[el]}" class="zh hide">${EL_ZH_NAMES[el]}</text>`;
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
        <span class="legend-name">${_t(el, EL_ZH_NAMES[el])}</span>
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
  { key:'love',   icon:'❤️',  label:'Love',   label_zh:'爱情', label_th:'ความรัก', color:'#f43f5e', circ:138 },
  { key:'career', icon:'💼',  label:'Career', label_zh:'事业', label_th:'อาชีพ', color:'#8b5cf6', circ:138 },
  { key:'health', icon:'🌿',  label:'Health', label_zh:'健康', label_th:'สุขภาพ', color:'#22c55e', circ:138 },
  { key:'wealth', icon:'💰',  label:'Wealth', label_zh:'财运', label_th:'ทรัพย์', color:'#f59e0b', circ:138 },
];

function renderFortune(fortune) {
  const grid = document.getElementById('fortune-grid');
  grid.className = 'fortune-bento';
  grid.innerHTML = FORTUNE_META.map(m => {
    const s = fortune[m.key];
    const tierEn = s >= 75 ? 'Excellent ✦' : s >= 55 ? 'Steady' : 'Low';
    const tierZh = s >= 75 ? '极佳 ✦'        : s >= 55 ? '平稳'   : '低迷';
    const tierTh = s >= 75 ? 'ยอดเยี่ยม ✦'   : s >= 55 ? 'มั่นคง' : 'ต่ำ';
    return `
    <div class="gyro-stat" style="--ga:${m.color}">
      <div class="gyro-stat-label">${_t(m.label, m.label_zh, m.label_th)}</div>
      <div class="gyro-stat-num" id="score-${m.key}" style="color:${m.color}">0</div>
      <div class="gyro-stat-tier">${_t(tierEn, tierZh, tierTh)}</div>
      <div class="gyro-spark">${_sparkSVG(_sparkPts(s), m.color)}</div>
    </div>`;
  }).join('');
}

function animateFortune(fortune) {
  FORTUNE_META.forEach(m => {
    const el = document.getElementById(`score-${m.key}`);
    if (!el) return;
    let n = 0;
    const target = fortune[m.key];
    const iv = setInterval(() => {
      n = Math.min(n + 2, target);
      el.textContent = n;
      if (n >= target) clearInterval(iv);
    }, 20);
  });
}

/* ── Compatibility ── */
function renderCompat(animal, zData) {
  const wrap = document.getElementById('compat-wrap');
  const chipWithYears = (a, cls) => {
    const yrs = getAnimalYears(a).slice(-4).join(' · ');
    return `<div class="compat-chip-wrap ${cls}">
      <span class="compat-chip ${cls}">${BRANCHES.find(b=>b.animal===a)?.emoji} ${_t(a, ANIMAL_ZH[a])}</span>
      <span class="compat-chip-years">${yrs}</span>
    </div>`;
  };
  const goodRow = zData.compat.map(a => chipWithYears(a, 'good')).join('');
  const badRow = zData.clash.map(a => chipWithYears(a, 'bad')).join('');
  wrap.innerHTML = `
    <div class="compat-group">
      <div class="compat-group-label">${_t('Best matches ✦','最佳配对 ✦')}</div>
      <div class="compat-row">${goodRow}</div>
    </div>
    <div class="compat-group">
      <div class="compat-group-label">${_t('Challenging','冲克')}</div>
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
      <div class="lucky-title">${_t('Colors','幸运颜色')}</div>
      <div class="lucky-values">
        ${lucky.colors.map(c=>`<span class="lucky-val">${_t(c, COLOR_ZH[c] || c)}</span>`).join('')}
      </div>
    </div>
    <div class="lucky-card">
      <div class="lucky-icon">🎲</div>
      <div class="lucky-title">${_t('Numbers','幸运数字')}</div>
      <div class="lucky-values">
        ${lucky.numbers.map(n=>`<span class="lucky-val">${n}</span>`).join('')}
      </div>
    </div>
    <div class="lucky-card">
      <div class="lucky-icon">🧭</div>
      <div class="lucky-title">${_t('Direction','幸运方位')}</div>
      <div class="lucky-values">
        <span class="lucky-val">${_t(lucky.dir, DIR_ZH[lucky.dir] || lucky.dir)}</span>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════
   Language Toggle
═══════════════════════════════════════ */
let isZh = false;

function currentLang() {
  return (window.WoBaziI18n && WoBaziI18n.get()) || (isZh ? 'zh' : 'en');
}

function toggleLang() {
  const order = ['en', 'th', 'zh'];
  const cur = currentLang();
  const next = order[(Math.max(0, order.indexOf(cur)) + 1) % order.length];
  if (window.WoBaziI18n) WoBaziI18n.set(next);
  else applyLangSpans(next);
}

function applyLangSpans(lang) {
  isZh = lang === 'zh';
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang === 'th' ? 'th' : 'en';
}

let _langRerender = false;   // renderAuspiciousDates calls applyI18n, which fires wobazi:lang again
document.addEventListener('wobazi:lang', (e) => {
  applyLangSpans(e.detail && e.detail.lang ? e.detail.lang : 'en');
  if (_langRerender) return;
  if (_shareData && _shareData.animal && document.querySelector('#power-days-card .pd-select')) {
    _langRerender = true;
    try { renderAuspiciousDates(_shareData.animal, _shareData.dominantEl); } catch (err) {}
    _langRerender = false;
  }
});

/* ── Bilingual text helper ── */
function _t(en, zh, th) {
  if (window.WoBaziI18n && typeof WoBaziI18n.lookup === 'function') {
    if (!th) th = WoBaziI18n.lookup(en, 'th') || '';
    if (!zh) zh = WoBaziI18n.lookup(en, 'zh') || zh;
  }
  if (!zh && !th) return en;
  const lang = currentLang();
  const enHide = (lang === 'zh' && zh) || (lang === 'th' && th) ? ' hide' : '';
  const zhHide = lang !== 'zh' ? ' hide' : '';
  const thHide = lang !== 'th' ? ' hide' : '';
  let html = `<span class="en${enHide}">${en}</span>`;
  if (zh) html += `<span class="zh${zhHide}">${zh}</span>`;
  if (th) html += `<span class="th${thHide}">${th}</span>`;
  return html;
}

function applyI18n() {
  if (window.WoBaziI18n) WoBaziI18n.apply(WoBaziI18n.get());
}

function dateLocale() {
  const lang = currentLang();
  return lang === 'zh' ? 'zh-CN' : lang === 'th' ? 'th-TH' : 'en-GB';
}

/* ── Sparkline helpers (Gyroscope-style) ── */
function _sparkPts(score) {
  return [0,1,2,3,4,5,6,7].map(i => {
    const wave = Math.sin(i * 1.1 + score * 0.05) * 11 + Math.sin(i * 2.3) * 5;
    return Math.min(99, Math.max(18, score - 20 + i * (20/7) + wave));
  });
}
function _sparkSVG(pts, color) {
  const W = 100, H = 26;
  const lo = Math.min(...pts), hi = Math.max(...pts);
  const range = hi - lo || 1;
  const coords = pts.map((v, i) => [
    (i / (pts.length - 1)) * W,
    H - ((v - lo) / range) * (H - 6) - 3
  ]);
  const d = coords.map((p, i) =>
    (i === 0 ? 'M' : 'L') + ` ${p[0].toFixed(1)} ${p[1].toFixed(1)}`
  ).join(' ');
  const [lx, ly] = coords[coords.length - 1];
  return `<svg viewBox="0 0 100 26" preserveAspectRatio="none">
    <path d="${d}" fill="none" stroke="${color}" stroke-width="1.5"
      stroke-linecap="round" stroke-linejoin="round" opacity="0.65"/>
    <circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="2" fill="${color}"/>
  </svg>`;
}

/* ═══════════════════════════════════════
   BLOOD TYPE + BIRTHPLACE DATA
═══════════════════════════════════════ */
const BLOOD_TYPE = {
  A: {
    nature: 'The Perfectionist', color: '#ef4444',
    traits: ['Organised', 'Reliable', 'Sensitive'],
    desc_en: 'Detail-oriented and conscientious — you bring structure to chaos and take pride in doing things right. In relationships and work your standards are high. Your growth edge: releasing the need for control.',
    desc_zh: '注重细节、认真负责，善于将混乱化为有序。感情和工作中标准极高。成长方向：放下对掌控的执念。',
    mod: { career:+4, health:+3, love:-2, wealth:+2 },
  },
  B: {
    nature: 'The Free Spirit', color: '#3b82f6',
    traits: ['Creative', 'Passionate', 'Independent'],
    desc_en: 'You live by your own rules — creative, curious, and delightfully unpredictable. Freedom is your oxygen. You thrive when given space and wither under rigid constraints.',
    desc_zh: '活在自己的规则里——创意无限、热情飞扬。自由是你的氧气，束缚是你的天敌。能量充沛却难以持久。',
    mod: { love:+5, career:+2, health:-2, wealth:-1 },
  },
  AB: {
    nature: 'The Enigma', color: '#8b5cf6',
    traits: ['Rational', 'Empathetic', 'Dual-natured'],
    desc_en: 'You contain multitudes — logic and emotion, introvert and extrovert. This rarity makes you fascinating. You see all sides of every situation: your greatest gift and greatest burden.',
    desc_zh: '集多面于一身——理性与感性并存，内向与外向交织。能看清局势全貌，既是天赋也是负担。',
    mod: { career:+5, wealth:+3, love:+3, health:+1 },
  },
  O: {
    nature: 'The Leader', color: '#f59e0b',
    traits: ['Decisive', 'Competitive', 'Resilient'],
    desc_en: 'The natural leader — bold, goal-driven, built to endure. You recover fast, compete hard, and inspire through sheer will. Blind spot: slowing down to truly listen.',
    desc_zh: '天生的领导者——果断、目标明确、意志坚韧。恢复力强，以意志力激励他人。盲点是不善倾听与示弱。',
    mod: { career:+6, wealth:+5, love:-1, health:+2 },
  },
};

const BT_SYNERGY = {
  'A_Wood':  `Type A precision × Wood patience — a meticulous, methodical builder.`,
  'A_Fire':  `Type A structure tames Fire's impulsivity — raw passion becomes disciplined output.`,
  'A_Earth': `Earth's reliability amplifies your Type A drive — exceptionally steady and dependable.`,
  'A_Metal': `Double precision: Metal sharpness × Type A meticulousness. Exceptional standards, exceptional results.`,
  'A_Water': `Water's intuition softens your rigidity — you think and feel your way to answers.`,
  'B_Wood':  `Wood's expansive creative energy × Type B freedom = unstoppable originality.`,
  'B_Fire':  `Maximum creative heat — brilliant output. Pace yourself; burnout is real.`,
  'B_Earth': `Earth's grounding gives your Type B spirit the anchor it occasionally needs.`,
  'B_Metal': `Metal's discipline can feel like a cage — treat it as a creative framework instead.`,
  'B_Water': `Two free-flowing energies: fluid, artistic, boundless. Deeply intuitive.`,
  'AB_Wood': `Wood's dual growth mirrors your dual nature — you expand in multiple directions at once.`,
  'AB_Fire': `Fire ignites one side of you; your rational side channels it into something powerful.`,
  'AB_Earth':`Earth's stability grounds your inner contradictions, giving them form and direction.`,
  'AB_Metal':`Metal's clarity cuts through your complexity — an unusually sharp, effective combination.`,
  'AB_Water':`The deepest pairing: Water flows, you adapt. Profoundly intuitive and empathetic.`,
  'O_Wood':  `Wood's long vision × Type O ambition = a builder of legacies.`,
  'O_Fire':  `Explosive leadership energy. You move mountains — don't burn bridges getting there.`,
  'O_Earth': `Earth's loyalty × Type O resilience — unshakeable, enduring presence.`,
  'O_Metal': `Metal sharpens Type O's edge to a fine point: precise, decisive, formidable.`,
  'O_Water': `Water adds emotional intelligence to Type O's drive — a rare, powerful balance.`,
};

const PLACE_ELEMENT_MAP = [
  { el:'Wood',  keys:['china','japan','korea','taiwan','hong kong','singapore','vietnam','thailand','cambodia','myanmar','tokyo','beijing','shanghai','seoul','taipei','east asia','southeast asia'] },
  { el:'Fire',  keys:['india','australia','brazil','south africa','argentina','mexico','colombia','nigeria','kenya','egypt','indonesia','philippines','malaysia','sri lanka','miami','tropical'] },
  { el:'Metal', keys:['uk','england','france','germany','italy','spain','europe','london','paris','berlin','rome','madrid','amsterdam','switzerland','austria','portugal','netherlands','western europe'] },
  { el:'Water', keys:['canada','russia','norway','sweden','finland','denmark','iceland','alaska','scotland','ireland','new zealand','scandinavia','north','vancouver','montreal','toronto','chicago','seattle','minneapolis'] },
  { el:'Earth', keys:['usa','united states','america','new york','california','texas','ohio','illinois','central','turkey','iran','saudi','israel','middle east','midwest'] },
];

function getPlaceElement(place) {
  if (!place) return null;
  const low = place.toLowerCase();
  for (const { el, keys } of PLACE_ELEMENT_MAP) {
    if (keys.some(k => low.includes(k))) return el;
  }
  return 'Earth'; // geographic centre default
}

/* ── Blood Type Section ── */
function renderBloodTypeSection(bloodType, dominantEl) {
  if (!bloodType || !BLOOD_TYPE[bloodType]) return;
  const bt       = BLOOD_TYPE[bloodType];
  const elColor  = EL_COLOR[dominantEl];
  const synergy  = BT_SYNERGY[`${bloodType}_${dominantEl}`] || '';

  const modHTML = Object.entries(bt.mod)
    .filter(([,v]) => v !== 0)
    .map(([k, v]) => `<span class="bt-mod-chip ${v > 0 ? 'bt-pos' : 'bt-neg'}">${v > 0 ? '+' : ''}${v} ${k[0].toUpperCase() + k.slice(1)}</span>`)
    .join('');

  document.getElementById('blood-section').classList.remove('data-hidden');
  document.getElementById('blood-card').innerHTML = `
    <div class="love-card" style="border-color:${bt.color}28;background:${bt.color}06">
      <div class="love-top" style="padding-bottom:12px">
        <div class="bt-badge" style="background:${bt.color};color:#07070f">Type ${bloodType}</div>
        <div class="love-tier-label" style="color:${bt.color}">${bt.nature}</div>
        <div class="love-traits" style="justify-content:center;margin-top:8px">
          ${bt.traits.map(t => `<span class="love-trait">${t}</span>`).join('')}
        </div>
      </div>
      <div class="love-desc">
        <p class="en">${bt.desc_en}</p>
        <p class="zh hide">${bt.desc_zh}</p>
      </div>
      ${synergy ? `<div class="bt-synergy" style="border-top:1px solid ${elColor}20">
        <div class="bt-synergy-label" style="color:${elColor}">🧬 Type ${bloodType} × ${dominantEl}</div>
        <div class="bt-synergy-text">${synergy}</div>
      </div>` : ''}
      <div class="bt-mods">
        <div class="bt-mods-label">Fortune modifiers from blood type</div>
        <div class="bt-mods-row">${modHTML}</div>
      </div>
    </div>`;
}

/* ── Birthplace / Geographic Energy Section ── */
function renderBirthplaceSection(birthplace, dominantEl) {
  if (!birthplace) return;
  const el       = getPlaceElement(birthplace);
  const elColor  = EL_COLOR[el];
  const domColor = EL_COLOR[dominantEl];
  const EL_DIR   = { Wood:'East', Fire:'South', Earth:'Centre', Metal:'West', Water:'North' };
  const EL_ZH    = { Wood:'木', Fire:'火', Earth:'土', Metal:'金', Water:'水' };
  const PRODUCE  = { Wood:'Fire', Fire:'Earth', Earth:'Metal', Metal:'Water', Water:'Wood' };
  const CONTROL  = { Wood:'Earth', Earth:'Water', Water:'Fire', Fire:'Metal', Metal:'Wood' };

  let interaction, interactColor;
  if (el === dominantEl) {
    interaction   = `Your birthplace and birth chart share ${el} energy — a resonant, amplifying combination. You are naturally in your element wherever you are.`;
    interactColor = elColor;
  } else if (PRODUCE[el] === dominantEl) {
    interaction   = `${el} (birthplace) feeds ${dominantEl} (birth chart) — your environment has always quietly nurtured your natural strengths.`;
    interactColor = '#22c55e';
  } else if (PRODUCE[dominantEl] === el) {
    interaction   = `Your birth chart's ${dominantEl} energy flows outward into ${el} — you were born to transform the world around you.`;
    interactColor = '#f0c040';
  } else if (CONTROL[el] === dominantEl) {
    interaction   = `${el} (birthplace) presses against ${dominantEl} (birth chart) — a formative pressure that built your resilience and depth.`;
    interactColor = '#f59e0b';
  } else {
    interaction   = `${el} and ${dominantEl} exist in creative tension — two independent forces that shaped a complex, multifaceted character.`;
    interactColor = '#94a3b8';
  }

  document.getElementById('birthplace-section').classList.remove('data-hidden');
  document.getElementById('birthplace-card').innerHTML = `
    <div class="birthplace-card">
      <div class="birthplace-top">
        <div class="birthplace-el-pill" style="background:${elColor}18;border-color:${elColor}35;color:${elColor}">
          <span class="birthplace-zh">${EL_ZH[el]}</span>${el} · ${EL_DIR[el]}
        </div>
        <div class="birthplace-name">${birthplace}</div>
      </div>
      <p class="birthplace-interact" style="color:${interactColor}">${interaction}</p>
    </div>`;
}

/* ═══════════════════════════════════════
   Extra Zodiac Data — Career + Season
═══════════════════════════════════════ */
const CAREER_ARCHETYPE = {
  Wood:  { icon:'🌿', name:'The Cultivator',  name_zh:'耕耘者',  tagline:'Builder · Educator · Healer',        tagline_zh:'建设者 · 教育者 · 治愈者',     roles:['Medicine','Education','Architecture','Environmental Science','Coaching'],       roles_zh:['医疗','教育','建筑','环境科学','教练'] },
  Fire:  { icon:'🔥', name:'The Visionary',   name_zh:'远见者',  tagline:'Leader · Artist · Performer',         tagline_zh:'领袖 · 艺术家 · 表演者',        roles:['Entrepreneurship','Entertainment','Marketing','Politics','Design'],            roles_zh:['创业','娱乐','市场营销','政治','设计'] },
  Earth: { icon:'🌍', name:'The Anchor',      name_zh:'定锚者',  tagline:'Manager · Mediator · Founder',        tagline_zh:'管理者 · 调解者 · 创始人',      roles:['Business','Real Estate','Finance','HR','Consulting'],                          roles_zh:['商业','房地产','金融','人力资源','咨询'] },
  Metal: { icon:'⚡', name:'The Executor',    name_zh:'执行者',  tagline:'Engineer · Analyst · Strategist',     tagline_zh:'工程师 · 分析师 · 战略家',      roles:['Engineering','Law','Finance','Science','Military'],                            roles_zh:['工程','法律','金融','科学','军事'] },
  Water: { icon:'💧', name:'The Strategist',  name_zh:'谋略者',  tagline:'Thinker · Writer · Philosopher',      tagline_zh:'思想家 · 作家 · 哲学家',        roles:['Writing','Research','Philosophy','Tech','Intelligence'],                       roles_zh:['写作','研究','哲学','科技','情报'] },
};

const POWER_SEASON = {
  Wood:  { season:'Spring', season_zh:'春季', emoji:'🌸', vibe:'Growth & new beginnings',     vibe_zh:'生长与新开始' },
  Fire:  { season:'Summer', season_zh:'夏季', emoji:'☀️', vibe:'Peak energy & visibility',    vibe_zh:'巅峰能量与曝光度' },
  Earth: { season:'Harvest',season_zh:'收获季',emoji:'🍂', vibe:'Stability & abundance',      vibe_zh:'稳定与丰收' },
  Metal: { season:'Autumn', season_zh:'秋季', emoji:'🍁', vibe:'Precision & clarity',         vibe_zh:'精确与清晰' },
  Water: { season:'Winter', season_zh:'冬季', emoji:'❄️', vibe:'Reflection & strategy',       vibe_zh:'省思与谋略' },
};

const ALL_SEASONS = [
  { key:'Wood',  label:'Spring', label_zh:'春季', emoji:'🌸', vibe:'Growth',      vibe_zh:'生长' },
  { key:'Fire',  label:'Summer', label_zh:'夏季', emoji:'☀️', vibe:'Visibility',  vibe_zh:'曝光' },
  { key:'Earth', label:'Harvest',label_zh:'收获季',emoji:'🍂', vibe:'Abundance',  vibe_zh:'丰收' },
  { key:'Metal', label:'Autumn', label_zh:'秋季', emoji:'🍁', vibe:'Clarity',     vibe_zh:'清晰' },
];
// Water = Winter wraps around; displayed separately in the card footer

/* ── Medallion — constellation star generator ── */
function genMedStars(animal) {
  const seed = animal.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const pts  = [];
  for (let i = 0; i < 8; i++) {
    const angle = ((seed * (i + 1) * 137.508) % 360) * Math.PI / 180;
    const r     = 32 + (seed * (i + 3)) % 12;
    pts.push({
      x:  +(50 + r * Math.cos(angle)).toFixed(1),
      y:  +(50 + r * Math.sin(angle)).toFixed(1),
      r:  0.55 + (i % 3) * 0.45,
      op: +(0.22 + (i % 4) * 0.08).toFixed(2)
    });
  }
  let s = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const dx = pts[i+1].x - pts[i].x, dy = pts[i+1].y - pts[i].y;
    if (Math.sqrt(dx*dx + dy*dy) < 28) {
      s += `<line x1="${pts[i].x}" y1="${pts[i].y}" x2="${pts[i+1].x}" y2="${pts[i+1].y}" stroke="white" stroke-width="0.35" opacity="0.18"/>`;
    }
  }
  pts.forEach(p => {
    s += `<circle cx="${p.x}" cy="${p.y}" r="${p.r}" fill="white" opacity="${p.op}"/>`;
  });
  return s;
}

/* ── Medallion helper ── */
function makeMedallion(animal, elColor, cls = 'hero-med') {
  const svg    = ANIMAL_SVGS[animal] || '';
  const brChar = BRANCH_CHARS[animal] || '';
  const stars  = genMedStars(animal);
  const isHero = cls === 'hero-med';
  return `<div class="animal-medallion ${cls}" style="background:radial-gradient(circle at 40% 35%, ${elColor}55, ${elColor}18);">
    ${isHero ? `<div class="med-halo" style="background:radial-gradient(circle, ${elColor}88, transparent 70%)"></div>` : ''}
    <svg class="med-stars" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${stars}</svg>
    <div class="med-ring med-r1"></div>
    <div class="med-ring med-r2"></div>
    <svg class="med-anim" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="color:white;filter:drop-shadow(0 0 10px ${elColor}bb)">${svg}</svg>
    ${isHero ? `<div class="med-char">${brChar}</div>` : ''}
  </div>`;
}

/* ── Daily Fortune ── */
function calcDayBranch(year, month, day) {
  if (window.BaziEngine && BaziEngine.calcBaziAccurate) {
    const r = BaziEngine.calcBaziAccurate({ year, month: month + 1, day, hour: null });
    return BRANCHES.findIndex(b => b.char === r.pillars[2].branch.char);
  }
  const ref = new Date(2000, 0, 7);
  const d   = new Date(year, month, day);
  const diff = Math.round((d - ref) / 86400000);
  return ((diff % 12) + 12) % 12;
}

/* Today's Power Days verdict (personal calendar) + a link to the calendar on the Actions tab. */
function todayPowerDayHTML() {
  const pillars = _shareData && _shareData.pillars;
  if (!pillars || !window.BaziEngine || !BaziEngine.scoreDayForChart) return '';
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let s;
  try {
    s = _scoredMonth(pillars, today.getFullYear(), today.getMonth() + 1, 'personal').find(x => x.day === today.getDate());
  } catch (e) { return ''; }
  if (!s) return '';
  const tier = {
    power: _t('Today is a Power Day', '今天是吉日', 'วันนี้เป็นวันพลัง'),
    good: _t('Today is a Good Day', '今天是吉', 'วันนี้เป็นวันดี'),
    avoid: _t('Today is a day to avoid', '今天宜避', 'วันนี้ควรเลี่ยง'),
    plain: _t('Today is an Ordinary Day', '今天是平日', 'วันนี้เป็นวันธรรมดา'),
  }[s.tier] || '';
  const reason = s.tier === 'avoid'
    ? s.reasons.find(r => !r.good)
    : s.reasons.find(r => r.good && r.code !== 'purpose-fit');
  // When today isn't a Power Day, point to the next one.
  let next = null;
  if (s.tier !== 'power') {
    const end = new Date(today); end.setDate(end.getDate() + POWER_WINDOW_DAYS);
    for (let y = today.getFullYear(), m = today.getMonth(); !next && new Date(y, m, 1) <= end; m === 11 ? (y++, m = 0) : m++) {
      next = _scoredMonth(pillars, y, m + 1, 'personal').find(x => {
        const dt = new Date(x.year, x.month - 1, x.day);
        return x.tier === 'power' && dt > today && dt <= end;
      }) || null;
    }
  }
  const nextLbl = next
    ? new Date(next.year, next.month - 1, next.day).toLocaleDateString(dateLocale(), { weekday: 'short', day: 'numeric', month: 'short' })
    : '';
  return `<div class="daily-power is-${s.tier}">
    <div class="daily-power-main">
      <span class="pick-score is-${s.tier}">${s.score}</span>
      <span class="daily-power-tier">${tier}</span>
      ${reason ? `<span class="daily-power-why">· ${_loc(reason.short)}</span>` : ''}
    </div>
    ${next ? `<div class="daily-power-next">${_t('Next Power Day', '下一个吉日', 'วันพลังถัดไป')}: <strong>${nextLbl}</strong></div>` : ''}
    <button type="button" class="daily-power-link" onclick="haptic(6); openPowerDays()">${_t('See Power Days', '查看吉日', 'ดูวันพลัง')} →</button>
  </div>`;
}

function openPowerDays() {
  const now = new Date();
  switchTab('actions');
  if (typeof selectPowerDate === 'function' && _shareData && _shareData.animal) {
    _calView = 0;
    selectPowerDate(now.getFullYear(), now.getMonth(), now.getDate());
  }
  setTimeout(() => scrollResults('res-power-days'), 60);
}

function renderDailyFortune(userAnimal) {
  const now = new Date();
  const todayBranchIdx = calcDayBranch(now.getFullYear(), now.getMonth(), now.getDate());
  const todayAnimal    = BRANCHES[todayBranchIdx].animal;
  const userZodiac     = ZODIAC[userAnimal];

  let score, color, levelLabel, levelLabel_zh, levelLabel_th, msg_en, msg_zh, msg_th;
  if (userZodiac.compat.includes(todayAnimal)) {
    score = dailyFortuneScore(true, false);
    color = '#22c55e'; levelLabel = 'Auspicious'; levelLabel_zh = '大吉'; levelLabel_th = 'มงคล';
    msg_en = `Today's energy flows with you. The ${todayAnimal} day amplifies your natural power — make your boldest moves now.`;
    msg_zh = `今日能量与你同频。${ANIMAL_ZH[todayAnimal]}日增强你的天赋能量，大胆出击，正当时。`;
    msg_th = `พลังวันนี้ไหลไปกับคุณ วัน${ANIMAL_TH[todayAnimal]}เสริมพลังธรรมชาติ — กล้าได้เลย`;
  } else if (userZodiac.clash.includes(todayAnimal)) {
    score = dailyFortuneScore(false, true);
    color = '#ef4444'; levelLabel = 'Challenging'; levelLabel_zh = '冲煞'; levelLabel_th = 'ท้าทาย';
    msg_en = `The ${todayAnimal} day creates friction with your chart. Navigate slowly, hold decisions until tomorrow, and protect your energy.`;
    msg_zh = `今日${ANIMAL_ZH[todayAnimal]}日与你的命盘有冲突。放缓节奏，重要决定推迟到明天，注意保护自己的能量。`;
    msg_th = `วัน${ANIMAL_TH[todayAnimal]}เสียดกับแผนภูมิ ช้าลง เลื่อนตัดสินใจไปพรุ่งนี้ และปกป้องพลัง`;
  } else {
    score = dailyFortuneScore(false, false);
    color = '#f0c040'; levelLabel = 'Balanced'; levelLabel_zh = '平稳'; levelLabel_th = 'สมดุล';
    msg_en = `A steady ${todayAnimal} day — neither tailwind nor headwind. Focus on consistency, refine the details, and trust the process.`;
    msg_zh = `今日${ANIMAL_ZH[todayAnimal]}日平稳，无明显顺逆之风。专注于一致性，打磨细节，相信过程。`;
    msg_th = `วัน${ANIMAL_TH[todayAnimal]}ที่มั่นคง — ไม่ท้ายลมหรือทวนลม โฟกัสความสม่ำเสมอ ขัดรายละเอียด และเชื่อกระบวนการ`;
  }

  const dateLabel = now.toLocaleDateString(dateLocale(), { year:'numeric', month:'long', day:'numeric' });
  document.getElementById('today-date-label').textContent = dateLabel;

  const card = document.getElementById('daily-card');
  const tp = calcTodayPillar();
  const tpEl = tp.stem.element;
  const cardEl = EL_COLOR[(_shareData && _shareData.element) || tpEl] || color;
  const shortDate = now.toLocaleDateString(dateLocale(), { day: 'numeric', month: 'short' });
  card.innerHTML = `<div class="daily-fortune-card">
    <div class="daily-fortune-bg" style="background:linear-gradient(135deg, ${cardEl}28, ${cardEl}55, #0f0f1c)"></div>
    <div class="daily-top">
      <div>
        <div class="daily-kicker">${_t('Today · ' + shortDate, '今日 · ' + shortDate, 'วันนี้ · ' + shortDate)}</div>
        <div class="daily-animal-chip">
          <svg viewBox="0 0 100 100" width="22" height="22" style="color:${color}">${ANIMAL_SVGS[todayAnimal]||''}</svg>
          ${_t(`${tpEl} ${todayAnimal}`, `${EL_ZH[tpEl]}${ANIMAL_ZH[todayAnimal]}`, `${EL_TH[tpEl]} ${ANIMAL_TH[todayAnimal]}`)}
          <span class="daily-pillar-cn">${tp.stem.char}${tp.branch.char}</span>
        </div>
      </div>
      <div class="daily-score-wrap">
        <div class="daily-score-num" id="daily-score-num" style="color:${color}">0</div>
        <div class="daily-score-label">${_t(levelLabel, levelLabel_zh, levelLabel_th)}</div>
      </div>
    </div>
    <div class="daily-bar-track">
      <div class="daily-bar-fill" id="daily-bar" style="background:${color}" data-pct="${score}"></div>
    </div>
    <div class="daily-msg">
      <span class="daily-level-dot" style="background:${color}"></span>
      ${_t(msg_en, msg_zh, msg_th)}
    </div>
    ${todayPowerDayHTML()}
  </div>`;

  setTimeout(() => {
    document.getElementById('daily-bar').style.width = score + '%';
    let n = 0;
    const iv = setInterval(() => {
      n = Math.min(n + 3, score);
      const el = document.getElementById('daily-score-num');
      if (el) el.textContent = n;
      if (n >= score) clearInterval(iv);
    }, 18);
  }, 400);
}

/* ── Career Archetype ── */
function renderCareerArchetype(dominantEl) {
  const ca = CAREER_ARCHETYPE[dominantEl];
  const col = EL_COLOR[dominantEl];
  document.getElementById('career-card').innerHTML = `
    <div class="career-card" style="border-color:${col}22">
      <div class="career-icon-wrap">${ca.icon}</div>
      <div class="career-info">
        <div class="career-archetype-name" style="color:${col}">${_t('Talent · ', '天赋 · ', 'พรสวรรค์ · ')}${_t(ca.name, ca.name_zh)}</div>
        <div class="career-tagline">${_t(ca.tagline, ca.tagline_zh)}</div>
        <div class="career-roles">
          ${ca.roles.map((r,i)=>`<span class="career-role-chip">${_t(r, ca.roles_zh?.[i])}</span>`).join('')}
        </div>
      </div>
    </div>`;
}

/* ── Power Season ── */
function renderPowerSeason(dominantEl) {
  const ps = POWER_SEASON[dominantEl];
  const seasons = [
    { key:'Wood',  label:'Spring', label_zh:'春季', emoji:'🌸', vibe:'Growth & new beginnings',  vibe_zh:'生长与新开始' },
    { key:'Fire',  label:'Summer', label_zh:'夏季', emoji:'☀️', vibe:'Peak energy & visibility', vibe_zh:'巅峰能量与曝光度' },
    { key:'Earth', label:'Harvest',label_zh:'收获季',emoji:'🍂', vibe:'Stability & abundance',   vibe_zh:'稳定与丰收' },
    { key:'Metal', label:'Autumn', label_zh:'秋季', emoji:'🍁', vibe:'Precision & clarity',      vibe_zh:'精确与清晰' },
    { key:'Water', label:'Winter', label_zh:'冬季', emoji:'❄️', vibe:'Reflection & strategy',    vibe_zh:'省思与谋略' },
  ];
  const segmentColors = { Wood:'#22c55e', Fire:'#ef4444', Earth:'#f59e0b', Metal:'#94a3b8', Water:'#3b82f6' };

  const barHTML = seasons.map(s =>
    `<div class="season-segment" style="background:${segmentColors[s.key]};opacity:${s.key===dominantEl?1:0.25}"></div>`
  ).join('');

  const bodyHTML = seasons.map(s => `
    <div class="season-item ${s.key===dominantEl?'active':''}">
      <div class="season-emoji">${s.emoji}</div>
      <div class="season-name" style="${s.key===dominantEl?`color:${segmentColors[s.key]}`:''}">
        ${_t(s.label, s.label_zh)}
      </div>
      ${s.key===dominantEl?`<span class="power-badge">${_t('YOUR PEAK','你的旺季')}</span>`:`<div class="season-vibe">${_t(s.vibe, s.vibe_zh)}</div>`}
    </div>`).join('');

  document.getElementById('season-card').innerHTML = `
    <div class="season-card">
      <div class="season-bar">${barHTML}</div>
      <div class="season-body">${bodyHTML}</div>
    </div>`;
}

/* ── Yin Yang Balance ── */
function renderYinYang(pillars) {
  let yin = 0, yang = 0;
  pillars.forEach(p => {
    if (!p.known) return;
    if (p.stem)   p.stem.polarity   === 'Yin' ? yin++ : yang++;
    if (p.branch) {
      const branchPolarity = BRANCHES.indexOf(p.branch) % 2 === 0 ? 'Yang' : 'Yin';
      branchPolarity === 'Yin' ? yin++ : yang++;
    }
  });
  const total = yin + yang || 1;
  const yinPct  = Math.round(yin  / total * 100);
  const yangPct = Math.round(yang / total * 100);

  const summary = yinPct > 65 ? 'Deeply Yin — intuitive, receptive, and internally focused.'
    : yangPct > 65 ? 'Strongly Yang — action-driven, expressive, and outward-facing.'
    : 'Well Balanced — a rare and powerful equilibrium between Yin and Yang.';

  const sumZh = yinPct > 65 ? '阴气较重，直觉敏锐，内敛而深邃。'
    : yangPct > 65 ? '阳气充足，行动力强，外向而积极。'
    : '阴阳均衡，难得的平衡之气，内外兼修。';

  const sumTh = yinPct > 65 ? 'หยินเด่นชัด — มีสัญชาตญาณดี เปิดรับ และให้ความสำคัญกับโลกภายใน'
    : yangPct > 65 ? 'หยางเด่นชัด — มุ่งลงมือทำ แสดงออก และเปิดรับโลกภายนอก'
    : 'สมดุลดี — ความสมดุลระหว่างหยินและหยางที่หาได้ยากและทรงพลัง';

  document.getElementById('yinyang-card').innerHTML = `
    <div class="yinyang-card">
      <div class="yy-row">
        <div class="yy-label" style="color:#a78bfa">阴</div>
        <div class="yy-track">
          <div class="yy-fill-yin" id="yy-yin" data-pct="${yinPct}"></div>
        </div>
        <div class="yy-count" style="color:#a78bfa">${yin}</div>
      </div>
      <div class="yy-row">
        <div class="yy-label" style="color:#f59e0b">阳</div>
        <div class="yy-track">
          <div class="yy-fill-yang" id="yy-yang" data-pct="${yangPct}"></div>
        </div>
        <div class="yy-count" style="color:#f59e0b">${yang}</div>
      </div>
      <div class="yy-symbols">
        ${Array(yin).fill('<div class="yy-dot yin"></div>').join('')}
        ${Array(yang).fill('<div class="yy-dot yang"></div>').join('')}
      </div>
      <div class="yy-summary en">${summary}</div>
      <div class="yy-summary zh hide">${sumZh}</div>
      <div class="yy-summary th hide">${sumTh}</div>
    </div>`;

  setTimeout(() => {
    const yinEl  = document.getElementById('yy-yin');
    const yangEl = document.getElementById('yy-yang');
    if (yinEl)  yinEl.style.width  = yinPct  + '%';
    if (yangEl) yangEl.style.width = yangPct + '%';
  }, 400);
}

/* ── Chinese Name Generator data ── */
const CN_SURNAME_MAP = {
  A:{char:'安',pinyin:'Ān',meaning:'Peace'},       B:{char:'宝',pinyin:'Bǎo',meaning:'Treasure'},
  C:{char:'澄',pinyin:'Chéng',meaning:'Clarity'},  D:{char:'道',pinyin:'Dào',meaning:'The Way'},
  E:{char:'恩',pinyin:'Ēn',meaning:'Grace'},        F:{char:'风',pinyin:'Fēng',meaning:'Wind'},
  G:{char:'光',pinyin:'Guāng',meaning:'Light'},     H:{char:'惠',pinyin:'Huì',meaning:'Wisdom'},
  I:{char:'逸',pinyin:'Yì',meaning:'Freedom'},      J:{char:'景',pinyin:'Jǐng',meaning:'Brilliance'},
  K:{char:'坤',pinyin:'Kūn',meaning:'Earth power'}, L:{char:'龙',pinyin:'Lóng',meaning:'Dragon'},
  M:{char:'明',pinyin:'Míng',meaning:'Radiant'},    N:{char:'宁',pinyin:'Níng',meaning:'Serenity'},
  O:{char:'欧',pinyin:'Ōu',meaning:'Vast horizon'}, P:{char:'鹏',pinyin:'Péng',meaning:'Great bird'},
  Q:{char:'乾',pinyin:'Qián',meaning:'Heaven'},     R:{char:'瑞',pinyin:'Ruì',meaning:'Fortune'},
  S:{char:'圣',pinyin:'Shèng',meaning:'Sacred'},    T:{char:'天',pinyin:'Tiān',meaning:'Heaven'},
  U:{char:'宇',pinyin:'Yǔ',meaning:'Universe'},     V:{char:'伟',pinyin:'Wěi',meaning:'Greatness'},
  W:{char:'文',pinyin:'Wén',meaning:'Wisdom'},      X:{char:'熙',pinyin:'Xī',meaning:'Radiant light'},
  Y:{char:'云',pinyin:'Yún',meaning:'Cloud'},       Z:{char:'震',pinyin:'Zhèn',meaning:'Thunder'},
};

const CN_ELEMENT_CHAR = {
  Wood:  [{char:'林',pinyin:'Lín',meaning:'Forest'},{char:'青',pinyin:'Qīng',meaning:'Vibrant green'},{char:'苍',pinyin:'Cāng',meaning:'Deep verdure'}],
  Fire:  [{char:'炎',pinyin:'Yán',meaning:'Blazing'},{char:'辉',pinyin:'Huī',meaning:'Brilliant light'},{char:'烨',pinyin:'Yè',meaning:'Blazing glory'}],
  Earth: [{char:'坤',pinyin:'Kūn',meaning:'Earth strength'},{char:'厚',pinyin:'Hòu',meaning:'Abundant'},{char:'嵩',pinyin:'Sōng',meaning:'Mountain spirit'}],
  Metal: [{char:'锋',pinyin:'Fēng',meaning:'Sharp brilliance'},{char:'铭',pinyin:'Míng',meaning:'Inscribed legacy'},{char:'钧',pinyin:'Jūn',meaning:'Noble gold'}],
  Water: [{char:'泽',pinyin:'Zé',meaning:'Flowing grace'},{char:'渊',pinyin:'Yuān',meaning:'Deep wisdom'},{char:'澜',pinyin:'Lán',meaning:'Great waves'}],
};

const CN_ANIMAL_CHAR = {
  Rat:     {char:'聪',pinyin:'Cōng',meaning:'Brilliance'},    Ox:      {char:'毅',pinyin:'Yì',meaning:'Steadfast will'},
  Tiger:   {char:'威',pinyin:'Wēi',meaning:'Majestic power'}, Rabbit:  {char:'瑛',pinyin:'Yīng',meaning:'Jade grace'},
  Dragon:  {char:'龙',pinyin:'Lóng',meaning:'Dragon spirit'}, Snake:   {char:'慧',pinyin:'Huì',meaning:'Deep wisdom'},
  Horse:   {char:'骏',pinyin:'Jùn',meaning:'Noble steed'},    Goat:    {char:'艺',pinyin:'Yì',meaning:'Artistry'},
  Monkey:  {char:'灵',pinyin:'Líng',meaning:'Clever spirit'}, Rooster: {char:'鸣',pinyin:'Míng',meaning:'Brilliant call'},
  Dog:     {char:'忠',pinyin:'Zhōng',meaning:'Loyalty'},      Pig:     {char:'福',pinyin:'Fú',meaning:'Prosperity'},
};

const DESTINY_ARCHETYPES = {
  Wood:  ['The Silent Builder','The Ancient Grove','The Jade Architect'],
  Fire:  ['The Burning Star','The Phoenix Rising','The Solar Sovereign'],
  Earth: ['The Unshakeable','The Mountain Lord','The Harvest Oracle'],
  Metal: ['The Iron Sovereign','The Blade of Truth','The Gold Arbiter'],
  Water: ['The Deep Current','The Mystic Tide','The Hidden Oracle'],
};

const SHARE_VERDICTS = [
  'Most people in your life cannot handle your depth.',
  'You were never meant to fit in — you were meant to lead.',
  'Your sensitivity is your greatest weapon, not your weakness.',
  'You have been playing small. The stars say it ends now.',
  'People misread you constantly. That is their limitation.',
  'You feel everything deeply. That is not a flaw — it is your gift.',
  'You are built to lead empires, not follow orders.',
  'The one you are settling for is not the one you are destined for.',
  'Your instincts are sharper than your logic. Trust them.',
  'You do not need their validation. You never did.',
];

function genChineseName(name, animal, dominantEl) {
  const clean   = ((name || '').trim().toUpperCase());
  const initial = clean[0] || 'W';
  const surname = CN_SURNAME_MAP[initial] || CN_SURNAME_MAP['W'];
  const elChars = CN_ELEMENT_CHAR[dominantEl] || CN_ELEMENT_CHAR.Water;
  const elIdx   = clean[1] ? clean.charCodeAt(1) % elChars.length : 0;
  const elChar  = elChars[elIdx];
  const anChar  = CN_ANIMAL_CHAR[animal] || CN_ANIMAL_CHAR.Rat;
  return { surname, elChar, anChar };
}

/* ── Share Card ── */
let _shareData = {};

function showShareCard() {
  const o = _shareData;
  if (!o.animal) return;
  const elColor  = EL_COLOR[o.element];
  const cn       = genChineseName(o.name, o.animal, o.dominantEl);
  const arcList  = DESTINY_ARCHETYPES[o.dominantEl] || DESTINY_ARCHETYPES.Water;
  const arcIdx   = (o.year + BRANCHES.findIndex(b => b.animal === o.animal)) % arcList.length;
  const archetype = arcList[arcIdx];
  const vIdx     = (o.year * 7 + BRANCHES.findIndex(b => b.animal === o.animal) * 3) % SHARE_VERDICTS.length;
  const verdict  = SHARE_VERDICTS[vIdx];
  const cnChars  = cn.surname.char + cn.elChar.char + cn.anChar.char;
  const cnPin    = [cn.surname.pinyin, cn.elChar.pinyin, cn.anChar.pinyin].join(' ');
  const cnMean   = `${cn.surname.meaning} · ${cn.elChar.meaning} · ${cn.anChar.meaning}`;
  const polLabel = o.polarity === 'Yang' ? 'Yang' : 'Yin';
  const todayStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const card = document.getElementById('share-card-preview');
  card.style.cssText = `background:linear-gradient(160deg,#1a0a3d,#07030f 45%,#0d0520);border:1px solid rgba(240,192,64,0.25);`;

  card.innerHTML = `
    <div class="share-date-top">${todayStr.toUpperCase()}</div>
    <div class="share-header-line">${(o.name || 'YOUR').toUpperCase()}'S DESTINY</div>
    <div class="share-cn-big" style="color:${elColor}">${cnChars}</div>
    <div class="share-cn-sub">${cnPin}</div>
    <div class="share-cn-meaning">${cnMean}</div>
    <div class="share-section-label">DESTINY ARCHETYPE</div>
    <div class="share-archetype-title">${archetype}</div>
    <div class="share-element-tag">${o.element} ${o.animal} (${polLabel})</div>
    <div class="share-oracle-box">
      <div class="share-oracle-label">ORACLE</div>
      <div class="share-oracle-text">"${verdict}"</div>
    </div>
    <div class="share-fortune-section">
      <div class="share-section-label">TODAY'S FORTUNE</div>
      <div class="share-fortune-grid">
        <div class="share-fortune-cell"><span class="share-fortune-emoji">❤️</span><span class="share-fortune-num" style="color:#f43f5e">${o.fortune.love}</span><span class="share-fortune-lbl">Love</span></div>
        <div class="share-fortune-cell"><span class="share-fortune-emoji">💼</span><span class="share-fortune-num" style="color:#8b5cf6">${o.fortune.career}</span><span class="share-fortune-lbl">Career</span></div>
        <div class="share-fortune-cell"><span class="share-fortune-emoji">🌿</span><span class="share-fortune-num" style="color:#22c55e">${o.fortune.health}</span><span class="share-fortune-lbl">Health</span></div>
        <div class="share-fortune-cell"><span class="share-fortune-emoji">💰</span><span class="share-fortune-num" style="color:#f59e0b">${o.fortune.wealth}</span><span class="share-fortune-lbl">Wealth</span></div>
      </div>
    </div>
    <div class="share-footer-logo">
      <img src="/app/assets/logo-horiz.png?v=6" class="share-logo-img" alt="WoBazi">
      <span class="share-footer-dot">.com</span>
    </div>`;

  // Hide oracle bottom bar, show overlay
  const fab = document.getElementById('oracle-fab');
  if (fab) fab.classList.add('hide');
  document.getElementById('share-overlay').classList.remove('hide');
}

function closeShare() {
  document.getElementById('share-overlay').classList.add('hide');
  // Restore oracle bottom bar if on results screen
  const onResults = document.querySelector('#results.screen.active');
  const fab = document.getElementById('oracle-fab');
  if (onResults && fab) fab.classList.remove('hide');
}

async function doShare() {
  haptic(15);
  track('share', { method: 'card', content_type: 'reading' });
  const o       = _shareData;
  const cn      = genChineseName(o.name, o.animal, o.dominantEl);
  const cnFull  = cn.surname.char + cn.elChar.char + cn.anChar.char;
  const cnPin   = [cn.surname.pinyin, cn.elChar.pinyin, cn.anChar.pinyin].join(' ');
  const cnMean  = `${cn.surname.meaning} · ${cn.elChar.meaning} · ${cn.anChar.meaning}`;
  const arcList = DESTINY_ARCHETYPES[o.dominantEl] || DESTINY_ARCHETYPES.Water;
  const arcIdx  = (o.year + BRANCHES.findIndex(b => b.animal === o.animal)) % arcList.length;
  const archetype = arcList[arcIdx];
  const vIdx    = (o.year * 7 + BRANCHES.findIndex(b => b.animal === o.animal) * 3) % SHARE_VERDICTS.length;
  const verdict = SHARE_VERDICTS[vIdx];

  const text = [
    `✦ My Chinese destiny name is ${cnFull}`,
    `(${cnPin} — "${cnMean}")`,
    ``,
    `I am ${archetype} — ${o.element} ${o.animal} (${o.polarity})`,
    ``,
    `"${verdict}"`,
    ``,
    `Love ${o.fortune.love} · Career ${o.fortune.career} · Health ${o.fortune.health} · Wealth ${o.fortune.wealth}`,
    ``,
    `→ Discover your Chinese destiny at wobazi.com`,
  ].join('\n');

  // Try generating + sharing image
  const imageFile = await generateShareImage(o, archetype, verdict);

  if (navigator.share) {
    // When sharing with an image, omit the URL to prevent apps from
    // fetching and displaying the static OG image alongside our custom PNG
    if (imageFile && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
      try { await navigator.share({ title: 'My WoBazi Destiny', text, files: [imageFile] }); } catch (_) {}
    } else {
      try { await navigator.share({ title: 'My WoBazi Destiny', text, url: 'https://wobazi.com' }); } catch (_) {}
    }
  } else if (navigator.clipboard) {
    await navigator.clipboard.writeText(text + '\nhttps://wobazi.com');
    alert(_plainLoc({ en: 'Copied to clipboard! ✦', zh: '已复制到剪贴板！✦', th: 'คัดลอกไปยังคลิปบอร์ดแล้ว ✦' }));
  }
}

/**
 * Generate a share image from the current reading data.
 * Returns a File object or null if generation fails.
 */
async function generateShareImage(o, archetype, verdict) {
  try {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const cn = genChineseName(o.name, o.animal, o.dominantEl);
    const cnChars = cn.surname.char + cn.elChar.char + cn.anChar.char;
    const cnPin = [cn.surname.pinyin, cn.elChar.pinyin, cn.anChar.pinyin].join(' ');
    const cnMean = `${cn.surname.meaning} · ${cn.elChar.meaning} · ${cn.anChar.meaning}`;
    const polLabel = o.polarity === 'Yang' ? 'Yang' : 'Yin';
    const params = new URLSearchParams({
      name: o.name || '',
      date: dateStr,
      chineseNameCharacters: cnChars,
      pinyinName: cnPin,
      englishMeaning: cnMean,
      archetype: archetype || '',
      elementAnimal: `${o.element} ${o.animal} (${polLabel})`,
      oracle: verdict || '',
      love: String(o.fortune?.love || 50),
      career: String(o.fortune?.career || 50),
      health: String(o.fortune?.health || 50),
      wealth: String(o.fortune?.wealth || 50),
    });
    const res = await fetch(`/api/share-image?${params}`);
    if (!res.ok) return null;
    const blob = await res.blob();
    return new File([blob], 'wobazi-destiny.png', { type: 'image/png' });
  } catch (err) {
    console.warn('[share] Image generation failed, sharing text only:', err);
    return null;
  }
}

/* ── Date input auto-advance ── */
function initDateInputs() {
  const dayEl   = document.getElementById('birth-day');
  const monEl   = document.getElementById('birth-month');
  const yearEl  = document.getElementById('birth-year');
  if (!dayEl) return;

  dayEl.addEventListener('input', () => {
    setDobError('');
    if (dayEl.value.length >= 2) monEl.focus();
    updateLunarPreview();
  });
  monEl.addEventListener('input', () => {
    setDobError('');
    if (monEl.value.length >= 2) yearEl.focus();
    updateLunarPreview();
  });
  yearEl.addEventListener('input', () => { setDobError(''); updateLunarPreview(); });
  [dayEl, monEl, yearEl].forEach(el => el.addEventListener('blur', persistBirthIfValid));
  const timeEl = document.getElementById('birthtime');
  if (timeEl) timeEl.addEventListener('blur', persistBirthIfValid);
}

function initCityAutocomplete() {
  bindCityAutocomplete('birthplace', 'city-suggest');
  bindCityAutocomplete('partner-birthplace', 'partner-city-suggest');
}
function bindCityAutocomplete(inputId, boxId) {
  const input = document.getElementById(inputId);
  const box = document.getElementById(boxId);
  if (!input || !box) return;

  let timer = null;
  let abort = null;
  let items = [];
  let active = -1;

  function hide() {
    box.classList.add('hide');
    box.innerHTML = '';
    input.setAttribute('aria-expanded', 'false');
    active = -1;
    items = [];
  }

  function render(list) {
    items = list;
    active = -1;
    if (!list.length) { hide(); return; }
    box.innerHTML = list.map((label, i) =>
      `<li role="option" data-i="${i}">${label.replace(/</g, '&lt;')}</li>`
    ).join('');
    box.classList.remove('hide');
    input.setAttribute('aria-expanded', 'true');
  }

  function pick(i) {
    if (items[i]) input.value = items[i];
    hide();
  }

  input.addEventListener('input', () => {
    const q = input.value.trim();
    if (timer) clearTimeout(timer);
    if (q.length < 2) { hide(); return; }
    timer = setTimeout(async () => {
      if (abort) abort.abort();
      abort = new AbortController();
      try {
        const res = await fetch('/api/city-suggest?q=' + encodeURIComponent(q), { signal: abort.signal });
        const data = await res.json();
        render(data.suggestions || []);
      } catch (e) {
        if (e.name !== 'AbortError') hide();
      }
    }, 220);
  });

  box.addEventListener('mousedown', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    e.preventDefault();
    pick(+li.dataset.i);
  });

  input.addEventListener('keydown', (e) => {
    if (box.classList.contains('hide') || !items.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      active = Math.min(active + 1, items.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      active = Math.max(active - 1, 0);
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault();
      pick(active);
      return;
    } else if (e.key === 'Escape') {
      hide();
      return;
    }
    [...box.children].forEach((li, i) => li.classList.toggle('is-active', i === active));
  });

  input.addEventListener('blur', () => setTimeout(hide, 160));
}

/* ═══════════════════════════════════════
   WORK — Monthly Career Section
═══════════════════════════════════════ */
const WORK_ACTIONS = {
  high: [
    { emoji:'🚀', action:'Push hard this month',  action_zh:'本月全力冲刺',  sub:'Energy and output are at their peak',      sub_zh:'能量与产出达到顶峰' },
    { emoji:'💡', action:'Pitch the big idea',     action_zh:'提出大想法',    sub:'Momentum is firmly on your side',          sub_zh:'势头正在你这边' },
    { emoji:'📈', action:'Take on more',           action_zh:'承担更多',      sub:'Your capacity is higher than usual',        sub_zh:'你的承载力高于平时' },
    { emoji:'🏆', action:'Go for the promotion',  action_zh:'争取晋升',      sub:'Visibility and recognition are strong',     sub_zh:'曝光度与认可度双高' },
  ],
  mid: [
    { emoji:'📋', action:'Focus on the plan',      action_zh:'聚焦执行计划', sub:'Steady execution beats inspiration now',   sub_zh:'稳健执行胜过灵感爆发' },
    { emoji:'🤝', action:'Strengthen alliances',   action_zh:'巩固合作关系', sub:'Collaboration will move things forward',   sub_zh:'协作将推动事情前进' },
    { emoji:'📚', action:'Invest in skills',       action_zh:'投资自我提升', sub:'A quieter month is good for learning',     sub_zh:'较平静的月份适合学习' },
    { emoji:'⚙️', action:'Handle the details',     action_zh:'处理细节',     sub:'Systems and processes need attention now', sub_zh:'系统与流程需要关注' },
  ],
  low: [
    { emoji:'🔇', action:'Keep a low profile',    action_zh:'保持低调',     sub:'Not the time to draw attention',            sub_zh:'现在不是出风头的时候' },
    { emoji:'⏸',  action:'Pause major moves',     action_zh:'暂停重大行动', sub:'Obstacles will resolve on their own',       sub_zh:'障碍将自行化解' },
    { emoji:'🛠',  action:'Fix what is broken',    action_zh:'修复问题',     sub:'Maintenance over ambition this month',      sub_zh:'本月以维护为主，非进取' },
    { emoji:'🧘', action:'Conserve your energy',  action_zh:'保存精力',     sub:"Pushing hard won't pay off right now",      sub_zh:'强行推进本月无法获益' },
  ],
};

function calcWork2026(animal, elements, overall2026) {
  const dominant = Object.entries(elements).sort((a,b) => b[1]-a[1])[0][0];
  const zodiacCareer = ZODIAC[animal].fortune.career;
  const WORK_BOOST = { Dragon:+12, Ox:+9, Rooster:+8, Monkey:+7, Tiger:+5 };
  const WORK_DRAG  = { Goat:-6, Pig:-4 };
  const animalMod  = WORK_BOOST[animal] || WORK_DRAG[animal] || 0;
  const elWorkMod  = { Metal:+8, Earth:+6, Wood:+3, Water:+2, Fire:-2 };
  return Math.min(95, Math.max(30, Math.round(
    zodiacCareer * 0.4 + overall2026 * 0.3 + 20 + animalMod + (elWorkMod[dominant] || 0)
  )));
}

function monthlyToneLevel(tone) {
  if (tone === 'pursue' || tone === 'celebrate') return 'high';
  if (tone === 'receive' || tone === 'deepen' || tone === 'repair') return 'mid';
  return 'low';
}

function genWorkMonthly(workScore) {
  const fc = getCachedMonthly('career');
  if (fc && fc.months) {
    return fc.months.map(m => Object.assign({
      emoji: m.emoji,
      action: m.title_en, action_zh: m.title_zh, action_th: m.title_th,
      sub: m.sub_en, sub_zh: m.sub_zh, sub_th: m.sub_th,
      level: monthlyToneLevel(m.tone),
    }, m));
  }
  const boost = [-5, -2, +4, +7, +5, +8, +9, +6, +3, -1, -4, -6];
  return boost.map((b, i) => {
    const score = Math.min(95, Math.max(20, Math.round(workScore + b)));
    const level = score >= 65 ? 'high' : score >= 45 ? 'mid' : 'low';
    const pool  = WORK_ACTIONS[level];
    const pick  = pool[(i * 5 + Math.round(workScore)) % pool.length];
    return Object.assign({}, pick, { score, level });
  });
}

function renderWorkSection(animal, elements, forecast2026) {
  const dominant  = Object.entries(elements).sort((a,b) => b[1]-a[1])[0][0];
  const ca        = CAREER_ARCHETYPE[dominant];
  const elColor   = EL_COLOR[dominant];
  const workScore = calcWork2026(animal, elements, forecast2026.overall);
  const nowMonth  = new Date().getMonth();

  const tier = workScore >= 75
    ? { label:'High Momentum 🚀', color:'#8b5cf6', zh:'事业腾飞' }
    : workScore >= 55
    ? { label:'Steady Progress 📈', color:'#3b82f6', zh:'稳步前行' }
    : { label:'Consolidation Phase 🛠', color:'#64748b', zh:'蓄势待发' };

  const MONTHS    = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const MONTHS_ZH = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  const monthly = genWorkMonthly(workScore);
  const monthlyHTML = monthly.map((d, i) => `
    <div class="love-month-tile level-${d.level}${i === nowMonth ? ' now-month work-now' : ''}">
      <div class="love-month-name">${_t(MONTHS[i], MONTHS_ZH[i])}</div>
      <div class="love-month-emoji">${d.emoji}</div>
      <div class="love-month-action">${_t(d.action, d.action_zh, d.action_th)}</div>
      <div class="love-month-sub">${_t(d.sub, d.sub_zh, d.sub_th)}</div>
    </div>`).join('');

  document.getElementById('work-card').innerHTML = `
    <div class="love-card work-card-inner">
      <div class="love-top">
        <div class="work-score-wrap">
          <div class="work-score-num" id="work-score-num">0</div>
          <div class="work-score-label">/ 100</div>
        </div>
        <div class="love-tier-label" style="color:${tier.color}">${_t(tier.label, tier.zh)}</div>
        <div class="love-sublabel en">Your 2026 career momentum</div>
        <div class="love-sublabel zh hide">${tier.zh} · 2026年事业运</div>
        <div class="love-sublabel th hide">แรงส่งด้านการงานของคุณในปี 2026</div>
      </div>
      <div class="love-archetype" style="border-color:${elColor}25">
        <div class="love-archetype-emoji">${ca.icon}</div>
        <div class="love-archetype-info">
          <div class="love-archetype-title" style="color:${elColor}">${_t(ca.name, ca.name_zh)}</div>
          <div class="love-archetype-tagline">${_t(ca.tagline, ca.tagline_zh)}</div>
          <div class="love-traits">${ca.roles.slice(0,3).map((r,i)=>`<span class="love-trait">${_t(r, ca.roles_zh?.[i])}</span>`).join('')}</div>
        </div>
      </div>
      <div class="love-months-wrap">
        <div class="love-months-label">${_t('Monthly Career Forecast · 月份事业运', '月份事业运', 'พยากรณ์การงานรายเดือน · 月份事业运')}</div>
        <div class="love-months-strip" id="work-months-strip">
          <div class="love-months-row">${monthlyHTML}</div>
        </div>
      </div>
    </div>`;

  setTimeout(() => {
    // Count up score
    let n = 0;
    const iv = setInterval(() => {
      n = Math.min(n + 2, workScore);
      const el = document.getElementById('work-score-num');
      if (el) el.textContent = n;
      if (n >= workScore) clearInterval(iv);
    }, 22);
    // Scroll strip horizontally to current month (no vertical page jump)
    centerNowMonths();
  }, 400);
}

/* ═══════════════════════════════════════
   LOVE — Archetype Data
═══════════════════════════════════════ */
const HEART_PATH = 'M 50 78 C 20 62 2 48 2 32 C 2 16 15 10 26 10 C 36 10 45 15 50 22 C 55 15 64 10 74 10 C 85 10 98 16 98 32 C 98 48 80 62 50 78 Z';

const LOVE_ARCHETYPE = {
  Wood:  {
    title: 'The Nurturer', title_zh: '守护者', emoji: '🌿',
    tagline: 'Patient · Devoted · Slow-burning', tagline_zh: '耐心·专一·慢热',
    desc_en: 'You love through acts of care and quiet consistency. You build slowly, but what you build lasts a lifetime. Partners feel deeply safe with you.',
    desc_zh: '你以关怀与持久表达爱意，缓慢建立却经久不衰，伴侣在你身边感到深深的安全感。',
    traits: ['Devoted', 'Patient', 'Nurturing'], traits_zh: ['专一','耐心','呵护'],
    language: 'Acts of Service', language_zh: '行动服务',
  },
  Fire:  {
    title: 'The Flame', title_zh: '烈焰', emoji: '❤️‍🔥',
    tagline: 'Intense · Magnetic · All-or-nothing', tagline_zh: '炽烈·磁场·全或无',
    desc_en: 'You love like wildfire — consuming, electric, impossible to ignore. You draw people in effortlessly. The challenge is sustaining that heat over time.',
    desc_zh: '你的爱如烈火——炽烈、充满电力、势不可挡。魅力自然流露，挑战在于持久燃烧。',
    traits: ['Magnetic', 'Passionate', 'Bold'], traits_zh: ['磁场强','热情','大胆'],
    language: 'Words of Affirmation', language_zh: '肯定话语',
  },
  Earth: {
    title: 'The Anchor', title_zh: '锚点', emoji: '🤎',
    tagline: 'Loyal · Steady · The one who stays', tagline_zh: '忠诚·稳定·永远在场',
    desc_en: 'You love with unshakeable loyalty. You\'re the person who shows up — in storms and in stillness. You give quietly and endlessly. You need to feel truly needed.',
    desc_zh: '你以不可动摇的忠诚去爱，风雨晴朗都始终出现，默默付出。你需要被人真正需要。',
    traits: ['Loyal', 'Reliable', 'Grounding'], traits_zh: ['忠诚','可靠','踏实'],
    language: 'Quality Time', language_zh: '共处时光',
  },
  Metal: {
    title: 'The Enigma', title_zh: '谜', emoji: '🩶',
    tagline: 'Selective · Precise · Fiercely devoted', tagline_zh: '挑剔·精准·绝对忠诚',
    desc_en: 'You don\'t fall easily — but when you do, it\'s absolute. Your love is a fortress: rare entry, total protection. Vulnerability is your greatest frontier.',
    desc_zh: '你不轻易动情，但一旦爱上便是全然投入。你的爱是堡垒，难以进入，却给予全面守护。',
    traits: ['Selective', 'Devoted', 'Protective'], traits_zh: ['挑剔','忠诚','守护'],
    language: 'Acts of Service', language_zh: '行动服务',
  },
  Water: {
    title: 'The Dreamer', title_zh: '梦想家', emoji: '💙',
    tagline: 'Romantic · Intuitive · Soul-deep', tagline_zh: '浪漫·直觉·灵魂深处',
    desc_en: 'You love with your whole soul — poetic, intuitive, and boundlessly empathetic. You feel what others feel before they say it. Guard your heart wisely.',
    desc_zh: '你以整个灵魂去爱——浪漫、直觉敏锐、共情力无边。能在对方开口前感知其情绪，守护好自己的心。',
    traits: ['Romantic', 'Empathetic', 'Intuitive'], traits_zh: ['浪漫','共情','直觉'],
    language: 'Physical Touch', language_zh: '肢体接触',
  },
};

/* ── Love 2026 Score ── */
function calcLove2026(animal, elements, overall2026) {
  const dominant = Object.entries(elements).sort((a,b) => b[1]-a[1])[0][0];
  const zodiacLove = ZODIAC[animal].fortune.love;
  const ROMANTIC_BOOST = { Tiger:+10, Dog:+8, Goat:+8, Rabbit:+6, Horse:+5 };
  const ROMANCE_DRAG   = { Rat:-8, Ox:-6 };
  const animalMod = ROMANTIC_BOOST[animal] || ROMANCE_DRAG[animal] || 0;
  const elLoveMod = { Wood:+7, Fire:+10, Earth:+2, Metal:-3, Water:+5 };
  return Math.min(96, Math.max(35, Math.round(
    zodiacLove * 0.45 + overall2026 * 0.25 + 25 + animalMod + (elLoveMod[dominant] || 0)
  )));
}

/* ── Animal birth years ── */
const ANIMAL_BASE_YEAR = {
  Rat:1960, Ox:1961, Tiger:1962, Rabbit:1963, Dragon:1964, Snake:1965,
  Horse:1966, Goat:1967, Monkey:1968, Rooster:1969, Dog:1970, Pig:1971,
};
function getAnimalYears(animal) {
  const base = ANIMAL_BASE_YEAR[animal];
  const years = [];
  for (let y = base; y <= 2024; y += 12) years.push(y);
  return years;
}

/* ── Compatibility love notes (by match animal's element) ── */
const LOVE_NOTES = {
  Wood:  ['Nurtures your growth',        'Grows alongside you',          'Steady and patient with you'  ],
  Fire:  ['Pure electric chemistry',     'Ignites your passion',         'Matches your fire'            ],
  Earth: ['Your rock — always shows up', 'Deep unshakeable devotion',    'Makes you feel at home'       ],
  Metal: ['A sharpening connection',     'Loyal beyond measure',         'Brings out your precision'    ],
  Water: ['Flows into your soul',        'Understands your silences',    'Deep emotional resonance'     ],
};
function getLoveNote(userAnimal, matchAnimal) {
  const el   = BRANCHES.find(b => b.animal === matchAnimal)?.element || 'Fire';
  const pool = LOVE_NOTES[el];
  const idx  = (userAnimal.charCodeAt(0) + matchAnimal.charCodeAt(0)) % pool.length;
  return pool[idx];
}

/* ── Monthly love advice ── */
const LOVE_ACTIONS = {
  high: [
    { emoji:'✨', action:'Ask once, then wait', action_zh:'问一次就停',      sub:'Name a time and stop circling the maybe.',  sub_zh:'把时间说清楚，别再绕着“也许”转。' },
    { emoji:'❤️', action:'Choose one person',   action_zh:'只选一个人',      sub:'Scatter dilutes whatever is already warming.',      sub_zh:'分散会把已经在升温的东西稀释掉。' },
    { emoji:'🔥', action:'Send the unsent note',     action_zh:'把没发的话发出去',      sub:'A short honest line beats another week of drafts.',     sub_zh:'一句老实话，胜过再改一周的草稿。' },
    { emoji:'🌟', action:'Make a small plan',action_zh:'定一个小计划',        sub:'Coffee on a real day outranks a floating hope.',  sub_zh:'把咖啡约在具体的一天，比悬着的希望有用。' },
  ],
  mid: [
    { emoji:'🌿', action:'Deepen what you have',  action_zh:'深化已有关系',  sub:'Quality over new connections',           sub_zh:'质量胜于新缘分' },
    { emoji:'💬', action:'Have the conversation', action_zh:'开口说清楚',    sub:'Clarity will bring you much closer',     sub_zh:'清晰表达会让你们更近' },
    { emoji:'🕊', action:'Keep showing up',       action_zh:'持续出现',      sub:'Consistency is your love language now',  sub_zh:'稳定是此刻的爱语' },
    { emoji:'💛', action:'Love gently',           action_zh:'温柔去爱',      sub:'Small moments carry the most weight',    sub_zh:'小细节承载最大份量' },
  ],
  low: [
    { emoji:'💔', action:"Don't do anything",   action_zh:'什么都别做',    sub:'Low chance of love this month',           sub_zh:'本月爱情机遇极低' },
    { emoji:'🚫', action:'Skip it this month',   action_zh:'本月略过',      sub:"The energy isn't there — just wait",     sub_zh:'时机未到，静待即可' },
    { emoji:'🌙', action:'Stay in this month',   action_zh:'宅家陪自己',    sub:'Chasing will only lead to disappointment',sub_zh:'强求只会带来失落' },
    { emoji:'🛡', action:'Protect your heart',   action_zh:'守护内心',      sub:'Low love energy — focus inward',          sub_zh:'爱情能量低，向内看' },
  ],
};

function genLoveMonthly(loveScore) {
  const fc = getCachedMonthly('love');
  if (fc && fc.months) {
    return fc.months.map(m => Object.assign({
      emoji: m.emoji,
      action: m.title_en, action_zh: m.title_zh, action_th: m.title_th,
      sub: m.sub_en, sub_zh: m.sub_zh, sub_th: m.sub_th,
      level: monthlyToneLevel(m.tone),
    }, m));
  }
  const boost = [-4, +9, +5, +4, +1, +7, +5, +3, -1, -3, -6, +2];
  return boost.map((b, i) => {
    const score = Math.min(96, Math.max(20, Math.round(loveScore + b)));
    const level = score >= 68 ? 'high' : score >= 48 ? 'mid' : 'low';
    const pool  = LOVE_ACTIONS[level];
    const pick  = pool[(i * 7 + Math.round(loveScore)) % pool.length];
    return Object.assign({}, pick, { score, level });
  });
}

/* ── Render Love Section ── */
function renderLoveSection(animal, elements, overall2026) {
  const dominant  = Object.entries(elements).sort((a,b) => b[1]-a[1])[0][0];
  const la        = LOVE_ARCHETYPE[dominant];
  const elColor   = EL_COLOR[dominant];
  const loveScore = calcLove2026(animal, elements, overall2026);
  const zData     = ZODIAC[animal];
  const nowMonth  = new Date().getMonth(); // 0-indexed Jan=0

  const tier = loveScore >= 80
    ? { label:'High Potential 💘', color:'#f43f5e', zh:'桃花运旺' }
    : loveScore >= 60
    ? { label:'Promising 💛',      color:'#fb923c', zh:'情缘可期' }
    : { label:'Patience Required 🤍', color:'#94a3b8', zh:'修心静待' };

  /* Monthly strip */
  const MONTHS    = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const MONTHS_ZH = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  const monthly = genLoveMonthly(loveScore);
  const monthlyHTML = monthly.map((d, i) => `
    <div class="love-month-tile level-${d.level}${i === nowMonth ? ' now-month' : ''}">
      <div class="love-month-name">${_t(MONTHS[i], MONTHS_ZH[i])}</div>
      <div class="love-month-emoji">${d.emoji}</div>
      <div class="love-month-action">${_t(d.action, d.action_zh, d.action_th)}</div>
      <div class="love-month-sub">${_t(d.sub, d.sub_zh, d.sub_th)}</div>
    </div>`).join('');

  /* Expanded soul animal cards */
  const soulHTML = zData.compat.map(a => {
    const br    = BRANCHES.find(b => b.animal === a);
    const col   = EL_COLOR[br?.element || 'Fire'];
    const years = getAnimalYears(a).map(y => `'${String(y).slice(2)}`);
    const note  = getLoveNote(animal, a);
    return `<div class="love-soul-card" style="border-left:3px solid ${col}">
      ${makeMedallion(a, col, 'pillar-med')}
      <div class="love-soul-info">
        <div class="love-soul-name" style="color:${col}">${_t(a)}</div>
        <div class="love-soul-note">"${_t(note)}"</div>
        <div class="love-soul-years">${years.map(y=>`<span class="love-soul-year">${y}</span>`).join('')}</div>
      </div>
    </div>`;
  }).join('');

  /* Clash chips */
  const clashHTML = zData.clash.map(a =>
    `<div class="love-clash-chip">
      <svg viewBox="0 0 100 100" width="14" height="14" style="color:rgba(255,255,255,0.35)">${ANIMAL_SVGS[a]||''}</svg>${_t(a)}
    </div>`
  ).join('');

  document.getElementById('love-card').innerHTML = `
    <div class="love-card">

      <div class="love-top">
        <div class="love-heart-wrap">
          <svg viewBox="0 0 100 88" class="love-heart-svg">
            <defs>
              <clipPath id="loveClip">
                <rect id="love-clip-rect" x="-5" y="78" width="110" height="90"/>
              </clipPath>
              <linearGradient id="loveGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stop-color="#f43f5e"/>
                <stop offset="100%" stop-color="#fb7185"/>
              </linearGradient>
            </defs>
            <path d="${HEART_PATH}" fill="rgba(244,63,94,0.1)" stroke="rgba(244,63,94,0.22)" stroke-width="1.5"/>
            <path d="${HEART_PATH}" fill="url(#loveGrad)" clip-path="url(#loveClip)" opacity="0.9"/>
          </svg>
          <div class="love-score-over">
            <span class="love-score-num" id="love-score-num">0</span>
            <span class="love-score-pct">%</span>
          </div>
        </div>
        <div class="love-tier-label" style="color:${tier.color}">${_t(tier.label, tier.zh)}</div>
        <div class="love-sublabel en">Chance of a meaningful connection in 2026</div>
        <div class="love-sublabel zh hide">${tier.zh} · 2026年情感运势</div>
        <div class="love-sublabel th hide">โอกาสพบความสัมพันธ์ที่มีความหมายในปี 2026</div>
      </div>

      <div class="love-archetype" style="border-color:${elColor}25">
        <div class="love-archetype-emoji">${la.emoji}</div>
        <div class="love-archetype-info">
          <div class="love-archetype-title" style="color:${elColor}">${_t(la.title, la.title_zh)}</div>
          <div class="love-archetype-tagline">${_t(la.tagline, la.tagline_zh)}</div>
          <div class="love-traits">${la.traits.map((t,i)=>`<span class="love-trait">${_t(t, la.traits_zh?.[i])}</span>`).join('')}</div>
        </div>
        <div class="love-lang-badge">
          <div class="love-lang-icon">🗣</div>
          <div class="love-lang-text">${_t(la.language, la.language_zh)}</div>
        </div>
      </div>

      <div class="love-desc">
        <p class="en">${la.desc_en}</p>
        <p class="zh hide">${la.desc_zh}</p>
      </div>

      <div class="love-months-wrap">
        <div class="love-months-label">${_t('Monthly Love Forecast · 月份情感运', '月份情感运', 'พยากรณ์ความรักรายเดือน · 月份情感运')}</div>
        <div class="love-months-strip">
          <div class="love-months-row">${monthlyHTML}</div>
        </div>
      </div>

      <div class="love-matches">
        <div class="love-match-label" style="margin-bottom:12px">${_t('♥ Soul Animals — who to look for','♥ 灵魂生肖 — 寻找这些人')}</div>
        <div class="love-soul-cards">${soulHTML}</div>
        <div class="love-match-label" style="margin-top:16px;color:rgba(255,255,255,0.3)">${_t('⚡ Handle With Care','⚡ 需要谨慎相处')}</div>
        <div class="love-clash-row" style="margin-top:8px">${clashHTML}</div>
      </div>

    </div>`;

  /* Animate heart fill */
  setTimeout(() => {
    const rect = document.getElementById('love-clip-rect');
    if (!rect) return;
    const targetY   = 78 - (loveScore / 100) * 68;
    const startTime = performance.now();
    function step(now) {
      const t    = Math.min((now - startTime) / 1600, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      rect.setAttribute('y', (78 + (targetY - 78) * ease).toFixed(2));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    /* Count up score */
    let n = 0;
    const iv = setInterval(() => {
      n = Math.min(n + 2, loveScore);
      const el = document.getElementById('love-score-num');
      if (el) el.textContent = n;
      if (n >= loveScore) clearInterval(iv);
    }, 22);
    /* Auto-scroll strip to current month */
    centerNowMonths();
  }, 700);
}

/* ═══════════════════════════════════════
   ORACLE — Deep Read Tab
═══════════════════════════════════════ */
const ORACLE_ANIMAL_INTRO = {
  Rat:     `Wired for survival, sharper than you let on. 2026 is asking whether you've been surviving or actually living.`,
  Ox:      `You build slowly and well. The question this year: are you building what you actually want, or what you think you should?`,
  Tiger:   `The Fire Horse recognises your fire. 2026 doesn't ask if you're capable — it asks if you're brave enough to act on what you already know.`,
  Rabbit:  `You navigate quietly. But 2026 is not a quiet year — it will ask something of you that requires being seen.`,
  Dragon:  `Everyone expects things from you. That expectation has shaped you — some of it beautifully, some like a cage. This year, choose which parts to keep.`,
  Snake:   `You know more than you say, and see more than most notice. 2026 rewards the move you've been holding back.`,
  Horse:   `A Fire Horse year is your element — but even the wildest horse must decide which direction it's actually running.`,
  Goat:    `Your read on people is almost always right. The problem is you talk yourself out of it. 2026: stop doing that.`,
  Monkey:  `You thrive in chaos, and 2026 is chaos. Most signs are stressed by this year. You're in your element — use it.`,
  Rooster: `You have standards most people don't meet. That's not arrogance — it's accuracy. This year asks if those standards protect you or isolate you.`,
  Dog:     `Your loyalty is your superpower and your most exploited vulnerability. 2026 will show you clearly which relationships actually deserve it.`,
  Pig:     `You give freely, sometimes recklessly. This year will show you exactly who gives back — and the answer may surprise you.`,
};

const ORACLE_LOVE = {
  high: `Your romantic energy is genuinely strong this year. The right people are being drawn toward you — don't overthink it. If you're in a relationship, this is the year to deepen it intentionally rather than coast. Say the thing you've been leaving unsaid.`,
  mid:  `Your love life works — but working isn't the same as thriving. Something is being left unsaid, tolerated rather than resolved. The Fire Horse strips away comfortable illusions. Whatever has been quietly bothering you will get louder. Address it before it becomes a crisis.`,
  low:  `The honest read: something in your love life isn't right, and you already know it. If you're with someone who doesn't make you feel fully chosen — who you're managing more than enjoying — this year makes that impossible to ignore. That's not a punishment. It's clarity you can act on.`,
};
const ORACLE_LOVE_ZH = {
  high: `今年你的桃花运确实旺盛。合适的人正被你吸引——不要想太多。若你身处一段关系中，这正是深化它的一年，而非得过且过。把那句一直没说出口的话说出来。`,
  mid:  `你的感情生活运作着，但运作并不等于蓬勃。有些话没说，有些事被容忍而非解决。火马年剥去舒适的幻象。那些悄悄困扰你的事情会越来越响。在它演变成危机之前，正面面对。`,
  low:  `说实话：你感情生活里有些事不对劲，你自己也知道。若你身边的人没有让你感到被全然选择——你是在管理这段关系而非享受它——2026年会让这一切无法再被忽视。这不是惩罚，而是你可以行动的清醒。`,
};

const ORACLE_CAREER = {
  high: `Career momentum is real this year. Opportunities in the first half of 2026 are genuine — your only obstacle is your own hesitation. Whatever move you've been deliberating, the window is open. Walk through it before it closes.`,
  mid:  `Career is moving, not at the speed you want. The bottleneck is almost certainly internal: a conversation not yet had, a decision kept deferring, a gap you're aware of but haven't closed. The Fire Horse rewards those who remove their own obstacles. What's yours?`,
  low:  `This is not the year to force career momentum — conditions aren't right for aggressive expansion. But it's ideal for strategic repositioning. Quiet, deliberate moves made now will pay off enormously in 2027. Protect what you've built. Don't sprint just because you're anxious.`,
};
const ORACLE_CAREER_ZH = {
  high: `今年职业势头真实存在。2026年上半年机会千载难逢，唯一的障碍是你自己的犹豫。无论你在考虑哪步棋，窗口已经打开。在它关闭之前走进去。`,
  mid:  `职业在推进，但不是你想要的速度。瓶颈几乎肯定是内部的：一次未进行的谈话，一个不断推迟的决定，一个你知道却没有填补的缺口。火马年奖励那些清除自身障碍的人。你的障碍是什么？`,
  low:  `今年不是强推职业势头的时机，条件不适合激进扩张。但这是战略性重新定位的理想时机。现在做出的安静而刻意的举动，将在2027年带来巨大回报。保护你已建立的成果，不要因焦虑而狂奔。`,
};

const ORACLE_HEALTH = {
  high: `Physical energy is solid this year. Your risk isn't weakness — it's overextension. You'll be tempted to push harder than your body wants, especially in high-pressure months. The months you ignore what your body asks for are the ones that create problems later.`,
  mid:  `Energy will be inconsistent in 2026. Some stretches feel sharp and strong; others drain you unexpectedly. The months you resist slowing down are usually the ones that demand it most. Sleep isn't optional this year — it's strategy.`,
  low:  `Your body is carrying more than it should. Stress will show up physically in 2026 — it's already starting. Sleep, food, and what you consume mentally matter more right now than they have in years. Start there before trying to fix anything else.`,
};
const ORACLE_HEALTH_ZH = {
  high: `今年身体能量扎实。你的风险不是虚弱，而是过度延伸。你会被诱惑推得比身体想要的更猛，尤其在高压月份。那些你无视身体需求的月份，正是日后制造问题的月份。`,
  mid:  `2026年能量会不稳定。某些时段感觉锐利而强壮，另一些时段则出乎意料地耗尽你。那些你抗拒放慢的月份，通常是最需要放慢的月份。今年睡眠不是可选项，而是策略。`,
  low:  `你的身体承载了超过它应有的重量。2026年压力将以身体的方式显现，而且已经开始了。睡眠、饮食和你精神上消化的东西，现在比多年来都更重要。先从这里开始，再尝试修复其他事情。`,
};

const ORACLE_WEALTH = {
  high: `Wealth conditions are favourable. Opportunities for meaningful financial progress are real — but they require you to act, not just notice. Identify where you want money to go before it arrives, or it will dissolve into noise.`,
  mid:  `Money flows, but not freely. There are leaks you're not tracking — costs, energy, commitments that don't pay back what they take. Audit before you expand. Tightening now creates the room to move later.`,
  low:  `2026 is not the year for financial risk. Not because you can't handle it — because the conditions are wrong. Protect what you have. Decisions that feel urgent probably aren't. Patience is the correct move, and it will pay off.`,
};
const ORACLE_WEALTH_ZH = {
  high: `财运条件有利。实现有意义财务进展的机会是真实的，但需要你行动，而不仅仅是注意到它。在钱到来之前就确定它要去哪里，否则它将消散在噪音中。`,
  mid:  `金钱在流动，但不自由。有些漏洞你没有追踪——成本、精力、那些付出比回报多的承诺。扩张前先审计。现在收紧，才能为日后行动创造空间。`,
  low:  `2026年不是承担财务风险的时机。不是因为你承受不了，而是因为条件不对。保护你所拥有的。那些感觉紧迫的决定可能并不紧迫。耐心是正确的举动，而且会有回报。`,
};

function makeOracleArcSVG(months, nowMonth, maxIdx, minIdx) {
  const W = 340, H = 110, PL = 6, PR = 6, PT = 12, PB = 22;
  const cW = W - PL - PR, cH = H - PT - PB;
  const xs = months.map((_, i) => PL + (i / 11) * cW);
  const ys = months.map(v => PT + cH - (Math.min(100, Math.max(0, v)) / 100) * cH);
  let line = `M ${xs[0].toFixed(1)},${ys[0].toFixed(1)}`;
  for (let i = 1; i < months.length; i++) {
    const cpx = ((xs[i - 1] + xs[i]) / 2).toFixed(1);
    line += ` C ${cpx},${ys[i-1].toFixed(1)} ${cpx},${ys[i].toFixed(1)} ${xs[i].toFixed(1)},${ys[i].toFixed(1)}`;
  }
  const area = `${line} L ${xs[11].toFixed(1)},${H-PB} L ${xs[0].toFixed(1)},${H-PB} Z`;
  const LABELS = ['J','F','M','A','M','J','J','A','S','O','N','D'];
  const labels = LABELS.map((l, i) =>
    `<text x="${xs[i].toFixed(1)}" y="${H-5}" text-anchor="middle" font-size="8" fill="${i === nowMonth ? '#f0c040' : 'rgba(255,255,255,0.28)'}">${l}</text>`
  ).join('');
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block;overflow:visible">
    <defs><linearGradient id="oArcGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f0c040" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="#f0c040" stop-opacity="0.02"/>
    </linearGradient></defs>
    <path d="${area}" fill="url(#oArcGrad)"/>
    <path d="${line}" fill="none" stroke="#f0c040" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="${xs[nowMonth].toFixed(1)}" y1="${PT}" x2="${xs[nowMonth].toFixed(1)}" y2="${H-PB}" stroke="rgba(255,255,255,0.2)" stroke-width="1" stroke-dasharray="3,3"/>
    <circle cx="${xs[maxIdx].toFixed(1)}" cy="${ys[maxIdx].toFixed(1)}" r="4.5" fill="#f0c040" stroke="#07070f" stroke-width="1.5"/>
    <circle cx="${xs[minIdx].toFixed(1)}" cy="${ys[minIdx].toFixed(1)}" r="4" fill="#475569" stroke="#07070f" stroke-width="1.5"/>
    <circle cx="${xs[nowMonth].toFixed(1)}" cy="${ys[nowMonth].toFixed(1)}" r="4" fill="white" stroke="#07070f" stroke-width="2"/>
    ${labels}
  </svg>`;
}

function renderOracleTab(animal, elements, fortune, pillars, forecast2026, dominantEl) {
  const monthScores = gen2026Monthly(forecast2026.overall);
  const now         = new Date();
  const nowMonth    = now.getMonth();
  const MONTH_FULL    = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const MONTH_FULL_ZH = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
  const tier = s => s >= 68 ? 'high' : s >= 45 ? 'mid' : 'low';

  const { love, career, health, wealth } = fortune;
  const overall  = forecast2026.overall;
  const elColor  = EL_COLOR[dominantEl] || '#f0c040';

  const maxIdx   = monthScores.indexOf(Math.max(...monthScores));
  const minIdx   = monthScores.indexOf(Math.min(...monthScores));
  const nowScore = monthScores[nowMonth];
  const nowTier  = tier(nowScore);

  const THIS_MONTH_ACTIONS = {
    high: [
      `Your most important project needs a concrete next step today — not a plan, an action.`,
      `Reach out to someone you've been meaning to contact. The window is open right now.`,
      `Make the decision you've been sitting on. Conditions are as good as they'll get.`,
    ],
    mid: [
      `Pick one thing — only one — to focus on this month. Scattered effort won't land.`,
      `There's a conversation in your life that needs to happen before the month ends. Have it.`,
      `Look at what's quietly draining you. One commitment probably deserves to be cut.`,
    ],
    low: [
      `This is a recovery month, not a forcing month. What do you actually need right now?`,
      `Protect your energy deliberately — say no to at least two non-essential things.`,
      `Use the slower pace to make a decision you've been avoiding. Clarity now beats confusion later.`,
    ],
  };

  const MONTH_THEMES = {
    high: { emoji: '🔥', label: 'Peak Window',   label_zh: '旺月',  note: `Push hard. Conditions won't be this favourable again for months.`,      note_zh: `全力冲刺。这样的好时机数月内不会再有。` },
    mid:  { emoji: '⚡', label: 'Steady Ground',  label_zh: '稳月', note: `Consistent effort beats sporadic bursts. Show up every day.`,            note_zh: `持续努力胜过零散爆发。每天都要出现。` },
    low:  { emoji: '🌊', label: 'Rest & Reset',   label_zh: '缓月', note: `Don't force it. Strategic patience now pays forward.`,                   note_zh: `不要强迫。此刻的战略耐心将换来未来回报。` },
  };

  const loveCalloutEn = love < 50
    ? `If you're with someone right now and it doesn't feel right — it probably isn't. The person you're currently dating may not be for you, and 2026 will make that undeniable. Trust what you already know.`
    : love < 65
    ? `Be honest about what you actually want from your relationship or romantic life. Comfortable and right are not the same thing.`
    : `Your love energy is genuine this year. Don't overthink what's working.`;
  const loveCalloutZh = love < 50
    ? `如果你现在和某人在一起但感觉不对——很可能确实不对。你目前约会的人可能不适合你，2026年会让这一点无可否认。相信你已经知道的。`
    : love < 65
    ? `诚实面对你真正想从这段关系或情感生活中得到什么。舒适和正确不是同一件事。`
    : `今年你的爱情能量是真实的。不要把正在运作的事情想太复杂。`;
  const loveCallout = loveCalloutEn; // used for loveCalloutType logic
  const loveCalloutType = love < 65 ? 'warn' : 'note';

  const verdictTextEn = overall >= 70
    ? `2026 is genuinely yours to shape — not because everything will be easy, but because your chart aligns with this year's energy. The only thing between you and real progress is whether you actually move. Stop waiting for certainty. It won't come. Move anyway.`
    : overall >= 50
    ? `2026 is a year of honest reckoning. Not punishing — clarifying. The things that aren't working will become impossible to ignore. That's useful information, not bad luck. Use the friction to make better choices instead of managing around problems you've been tolerating.`
    : `2026 is a hard year for your chart — and pretending otherwise doesn't help. The Fire Horse is exposing what's out of alignment in your life. That's uncomfortable, but it's also the clearest map you've had in years. The question isn't whether to change. It's what, and how fast.`;
  const verdictTextZh = overall >= 70
    ? `2026年真正属于你去塑造——不是因为一切都会简单，而是因为你的命盘与今年的能量契合。站在你和真正进步之间的唯一事物，是你是否真的行动了。停止等待确定性，它不会来。无论如何，动起来。`
    : overall >= 50
    ? `2026年是诚实清算的一年。不是惩罚——而是澄清。那些不运作的事情将变得无法忽视。这是有用的信息，不是坏运气。用这种摩擦做出更好的选择，而不是继续管理那些你一直在容忍的问题。`
    : `2026年对你的命盘来说是艰难的一年——假装不是这样没有帮助。火马年正在暴露你生活中不对齐的地方。这不舒服，但也是你多年来拥有的最清晰的地图。问题不是是否要改变，而是改变什么，以及多快。`;
  const verdictText = verdictTextEn; // used for verdictIcon logic below

  const verdictIcon = overall >= 70 ? '✦' : overall >= 50 ? '◈' : '◇';

  const bar = (score, color) =>
    `<div class="orc-bar-wrap">
      <div class="orc-bar-track"><div class="orc-bar-fill" style="width:${score}%;background:${color}"></div></div>
      <span class="orc-bar-num">${score}</span>
    </div>`;

  const arcSVG = makeOracleArcSVG(monthScores, nowMonth, maxIdx, minIdx);

  const next3 = [0, 1, 2].map(offset => {
    const idx = (nowMonth + offset) % 12;
    return { name: _t(MONTH_FULL[idx], MONTH_FULL_ZH[idx]), score: Math.round(monthScores[idx]), t: tier(monthScores[idx]), isnow: offset === 0 };
  });

  const introTextEn = ORACLE_ANIMAL_INTRO[animal] || `Your chart holds more than most people see. 2026 will show whether you're ready to act on it.`;
  const introTextZh = `你的命盘蕴含的，远比大多数人所见的更多。2026年将揭示你是否准备好付诸行动。`;

  const oracleCardEl = document.getElementById('oracle-card');
  if (!oracleCardEl) return; // Oracle section moved to drawer
  oracleCardEl.innerHTML = `
    <div class="orc-intro-card" style="border-color:${elColor}35;background:linear-gradient(160deg,${elColor}09,transparent 60%)">
      <div class="orc-intro-eyebrow">${_t("The Oracle's Read · 2026",'神谕解读 · 2026')}</div>
      <p class="orc-intro-text">${_t(introTextEn, introTextZh)}</p>
      <div class="orc-overall-row">
        <div class="orc-overall-block">
          <div class="orc-overall-num" style="color:${elColor}">${overall}</div>
          <div class="orc-overall-label">${_t('Year Score','年度总分')}</div>
        </div>
        <div class="orc-quadrant">
          <div class="orc-q-item"><span class="orc-q-label">${_t('Love','爱情')}</span><span class="orc-q-val">${love}</span></div>
          <div class="orc-q-item"><span class="orc-q-label">${_t('Career','事业')}</span><span class="orc-q-val">${career}</span></div>
          <div class="orc-q-item"><span class="orc-q-label">${_t('Health','健康')}</span><span class="orc-q-val">${health}</span></div>
          <div class="orc-q-item"><span class="orc-q-label">${_t('Wealth','财运')}</span><span class="orc-q-val">${wealth}</span></div>
        </div>
      </div>
    </div>

    <div class="orc-sticky-head">${_t('The Hard Truths','关键洞见')}</div>

    <div class="orc-truth-block">
      <div class="orc-truth-label" style="color:#f43f5e">${_t('❤ Love &amp; Relationships','❤ 爱情与关系')}</div>
      ${bar(love, '#f43f5e')}
      <p class="orc-truth-body">${_t(ORACLE_LOVE[tier(love)], ORACLE_LOVE_ZH[tier(love)])}</p>
      <div class="orc-callout orc-callout-${loveCalloutType}">${_t(loveCalloutEn, loveCalloutZh)}</div>
    </div>

    <div class="orc-truth-block">
      <div class="orc-truth-label" style="color:#8b5cf6">${_t('💼 Career &amp; Ambition','💼 事业与抱负')}</div>
      ${bar(career, '#8b5cf6')}
      <p class="orc-truth-body">${_t(ORACLE_CAREER[tier(career)], ORACLE_CAREER_ZH[tier(career)])}</p>
    </div>

    <div class="orc-truth-block">
      <div class="orc-truth-label" style="color:#22c55e">${_t('⚡ Health &amp; Energy','⚡ 健康与能量')}</div>
      ${bar(health, '#22c55e')}
      <p class="orc-truth-body">${_t(ORACLE_HEALTH[tier(health)], ORACLE_HEALTH_ZH[tier(health)])}</p>
    </div>

    <div class="orc-truth-block" style="border-bottom:none;margin-bottom:0">
      <div class="orc-truth-label" style="color:#f59e0b">${_t('💰 Wealth &amp; Resources','💰 财运与资源')}</div>
      ${bar(wealth, '#f59e0b')}
      <p class="orc-truth-body">${_t(ORACLE_WEALTH[tier(wealth)], ORACLE_WEALTH_ZH[tier(wealth)])}</p>
    </div>

    <div class="orc-sticky-head">${_t('Your 2026 Arc','2026年运势弧线')}</div>

    <div class="orc-arc-card">
      <div class="orc-arc-meta">
        <div class="orc-arc-peak"><span class="orc-arc-dot" style="background:#f0c040"></span>${_t('Peak:','最旺月：')} <strong>${_t(MONTH_FULL[maxIdx], MONTH_FULL_ZH[maxIdx])}</strong></div>
        <div class="orc-arc-trough"><span class="orc-arc-dot" style="background:#475569"></span>${_t('Lowest:','最低月：')} <strong>${_t(MONTH_FULL[minIdx], MONTH_FULL_ZH[minIdx])}</strong></div>
      </div>
      <div class="orc-arc-svg">${arcSVG}</div>
      <div class="orc-arc-now">▲ ${_t('You are here:','当前所在：')} ${_t(MONTH_FULL[nowMonth], MONTH_FULL_ZH[nowMonth])} · ${Math.round(nowScore)}</div>
    </div>

    <div class="orc-sticky-head">${_t('Next 90 Days','未来90天')}</div>

    ${next3.map(m => `
      <div class="orc-month-block${m.isnow ? ' orc-month-now' : ''}">
        <div class="orc-month-top">
          <div class="orc-month-name">${m.name}${m.isnow ? ` · ${_t('Now','当前')}` : ''}</div>
          <div class="orc-month-score" style="color:${m.t === 'high' ? '#f0c040' : m.t === 'mid' ? '#94a3b8' : '#64748b'}">${m.score}</div>
        </div>
        <div class="orc-month-theme">${MONTH_THEMES[m.t].emoji} ${_t(MONTH_THEMES[m.t].label, MONTH_THEMES[m.t].label_zh)}</div>
        <p class="orc-month-note">${_t(MONTH_THEMES[m.t].note, MONTH_THEMES[m.t].note_zh)}</p>
        ${m.isnow ? `<ul class="orc-actions">${THIS_MONTH_ACTIONS[nowTier].map(a => `<li class="orc-action-item">→ ${a}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('')}

    <div class="orc-sticky-head">${_t('The Verdict','命运裁决')}</div>

    <div class="orc-verdict">
      <div class="orc-verdict-icon" style="color:${elColor}">${verdictIcon}</div>
      <p class="orc-verdict-text">${_t(verdictTextEn, verdictTextZh)}</p>
    </div>
  `;
}

/* ═══════════════════════════════════════
   TIPS — Tooltip Content Dictionary
═══════════════════════════════════════ */
const TIPS = {
  'zodiac': {
    icon: '🐉',
    title_en: 'Your Zodiac Animal',
    title_zh: '生肖',
    body_en: 'Your zodiac animal is set by your birth year. In Chinese astrology it forms the Year Pillar — your outer persona, how the world sees you, and the core energy you were born with.',
    body_zh: '生肖由出生年份决定，构成年柱，代表你的外在个性与生俱来的核心能量。',
    title_th: 'นักษัตรประจำปีเกิด',
    body_th: 'นักษัตรของคุณกำหนดจากปีเกิด ในโหราศาสตร์จีนถือเป็นเสาปี ซึ่งสะท้อนบุคลิกภายนอก ภาพที่ผู้อื่นมองเห็น และพลังพื้นฐานที่ติดตัวมาตั้งแต่เกิด',
  },
  'four-pillars': {
    icon: '柱',
    title_en: 'Four Pillars of Destiny',
    title_zh: '四柱八字',
    body_en: 'The Four Pillars (八字 Bāzì — "Eight Characters") are Year, Month, Day, and Hour. Each pillar has a Heavenly Stem on top and an Earthly Branch below. These 8 characters form the complete map of your destiny.',
    body_zh: '四柱即年、月、日、时，每柱含天干与地支各一字，合为八字，是命运的完整蓝图。',
    title_th: 'สี่เสาแห่งโชคชะตา',
    body_th: 'สี่เสา (八字 Bāzì — “แปดตัวอักษร”) ได้แก่ เสาปี เสาเดือน เสาวัน และเสาชั่วโมง แต่ละเสามีก้านฟ้าอยู่ด้านบนและกิ่งดินอยู่ด้านล่าง ตัวอักษรทั้งแปดนี้รวมกันเป็นแผนที่ชะตาชีวิตที่สมบูรณ์ของคุณ',
  },
  'ten-gods': {
    icon: '十',
    title_en: 'Ten Gods 十神',
    title_zh: '十神',
    body_en: 'Ten Gods are the Day Master read against every stem in the chart — visible stems plus hidden stems in the branches. They describe how you compete, create, earn, answer to authority, and take in support.',
    body_zh: '十神是日主对照盘中每一干（含地支藏干）的关系：比劫、食伤、财、官杀、印。用来看你如何竞争、创造、取财、面对权威与受助。',
    title_th: 'สิบเทพ 十神',
    body_th: 'สิบเทพคือความสัมพันธ์ระหว่างวันมาสเตอร์กับก้านฟ้าทุกตัวในแผนภูมิ ทั้งก้านที่ปรากฏและก้านที่แฝงอยู่ในกิ่งดิน ใช้อธิบายวิธีที่คุณแข่งขัน สร้างสรรค์ หารายได้ รับมือกับผู้มีอำนาจ และรับการสนับสนุนจากผู้อื่น',
  },
  'daily-fortune': {
    icon: '📅',
    title_en: 'Daily Fortune',
    title_zh: '日运势',
    body_en: 'Every day is governed by one of the 12 Earthly Branches. When today\'s ruling animal is compatible with yours, energy flows your way. When they clash, tread carefully and conserve your power.',
    body_zh: '每天由十二地支之一掌管。当日生肖与你相合则万事顺遂；相冲时宜谨慎行事，保存能量。',
    title_th: 'ดวงประจำวัน',
    body_th: 'แต่ละวันอยู่ภายใต้กิ่งดินหนึ่งในสิบสองกิ่ง หากนักษัตรประจำวันเข้ากันกับนักษัตรของคุณ พลังจะเอื้อต่อคุณ หากชงกัน ควรระมัดระวังและรักษาพลังไว้',
  },
  'element-balance': {
    icon: '⬠',
    title_en: 'Element Balance',
    title_zh: '五行平衡',
    body_en: 'The Five Elements — Wood, Fire, Earth, Metal, Water — are Chinese cosmology\'s foundation. Your eight birth characters each carry an element. The balance (or imbalance) shapes your strengths and blind spots.',
    body_zh: '五行（木火土金水）是宇宙的基础。八字中每个字都带有五行属性，其平衡或偏颇决定你的优势与盲点。',
    title_th: 'สมดุลธาตุ',
    body_th: 'ธาตุทั้งห้า ได้แก่ ไม้ ไฟ ดิน โลหะ และน้ำ เป็นรากฐานของจักรวาลวิทยาจีน ตัวอักษรทั้งแปดในดวงของคุณล้วนมีธาตุประจำ ความสมดุลหรือความไม่สมดุลของธาตุเป็นตัวกำหนดจุดแข็งและจุดบอดของคุณ',
  },
  'fortune-cards': {
    icon: '🔮',
    title_en: 'Life Fortune',
    title_zh: '命运分值',
    body_en: 'These four scores reflect the intrinsic energy patterns in your birth chart across Love, Career, Health, and Wealth. They represent your lifetime baseline — not a single year — shaped by your elements and animal.',
    body_zh: '四项分值反映命盘中爱情、事业、健康与财富的内在能量格局，代表终身基础运势，由五行与生肖共同塑造。',
    title_th: 'ดวงชะตาตลอดชีวิต',
    body_th: 'คะแนนทั้งสี่สะท้อนรูปแบบพลังที่มีอยู่ในแผนภูมิวันเกิดของคุณ ด้านความรัก การงาน สุขภาพ และการเงิน เป็นพื้นฐานตลอดชีวิต ไม่ใช่เฉพาะปีใดปีหนึ่ง และได้รับอิทธิพลจากธาตุและนักษัตรของคุณ',
  },
  'career-archetype': {
    icon: '🎭',
    title_en: 'Talent',
    title_zh: '天赋',
    body_en: 'Your dominant element determines your natal talent — what you are built for, not this year\'s job luck. It is the work where your energy flows most freely.',
    body_zh: '主导五行决定你的先天天赋——你被造就去做的事，而非今年的事业运。那是能量最顺的工作方向。',
    title_th: 'พรสวรรค์',
    body_th: 'ธาตุเด่นของคุณบ่งบอกพรสวรรค์ติดตัว คือสิ่งที่คุณถนัดโดยธรรมชาติ ไม่ใช่โชคด้านการงานของปีนี้ เป็นงานที่พลังของคุณไหลเวียนได้อย่างเป็นธรรมชาติที่สุด',
  },
  'power-season': {
    icon: '🌸',
    title_en: 'Power Season',
    title_zh: '旺季',
    body_en: 'Each element rules a season. Your power season is when your dominant element peaks in nature, amplifying your natural qi. Use this window for your biggest decisions and boldest moves.',
    body_zh: '五行各主一季。你的旺季是主导五行在自然界能量最强的时节，此时气场加持，是做出重大决策的最佳时机。',
    title_th: 'ฤดูแห่งพลัง',
    body_th: 'แต่ละธาตุเป็นเจ้าของฤดูหนึ่ง ฤดูแห่งพลังของคุณคือช่วงที่ธาตุเด่นของคุณมีกำลังสูงสุดในธรรมชาติ ซึ่งช่วยเสริมชี่ของคุณ ควรใช้ช่วงนี้สำหรับการตัดสินใจสำคัญและการลงมือครั้งใหญ่',
  },
  'yin-yang': {
    icon: '☯',
    title_en: 'Yin · Yang Balance',
    title_zh: '阴阳平衡',
    body_en: 'Yin (阴) is receptive, inward, reflective energy. Yang (阳) is active, outward, expressive. The balance in your chart reveals whether you naturally move through life more inwardly or outwardly.',
    body_zh: '阴为内敛接纳之能，阳为主动外放之能。命盘中阴阳的比例，揭示你天生的处世方式。',
    title_th: 'สมดุลหยิน · หยาง',
    body_th: 'หยิน (阴) คือพลังที่รับ มุ่งเข้าด้านใน และใคร่ครวญ หยาง (阳) คือพลังที่กระตือรือร้น มุ่งออกด้านนอก และแสดงออก สัดส่วนในแผนภูมิของคุณบอกว่าคุณมีแนวโน้มดำเนินชีวิตแบบเก็บตัวหรือแบบเปิดเผยมากกว่า',
  },
  'compatibility': {
    icon: '💫',
    title_en: 'Compatibility',
    title_zh: '生肖相合',
    body_en: 'Based on the ancient San He (三合) and Liu He (六合) harmony systems. Compatible animals create flowing, supportive energy. Challenging pairings create friction — but also the heat that drives growth.',
    body_zh: '依据三合、六合古法。相合生肖带来流畅相助的能量，相冲生肖虽摩擦，却也是激发成长的动力。',
    title_th: 'ความเข้ากัน',
    body_th: 'อ้างอิงระบบความกลมกลืนโบราณ ซานเหอ (三合) และลิ่วเหอ (六合) นักษัตรที่เข้ากันจะสร้างพลังที่ไหลลื่นและเกื้อหนุนกัน ส่วนคู่ที่ท้าทายจะเกิดแรงเสียดทาน แต่ก็เป็นแรงผลักดันให้เติบโต',
  },
  'lucky-vibes': {
    icon: '✨',
    title_en: 'Lucky Vibes',
    title_zh: '吉祥元素',
    body_en: 'Your lucky colors, numbers, and compass direction are derived from your animal\'s elemental essence. Surrounding yourself with these creates resonance between your environment and your innate energy.',
    body_zh: '吉祥色彩、数字与方位由生肖五行属性决定，以此布置环境，有助于与天生能量共鸣。',
    title_th: 'สิ่งมงคลประจำตัว',
    body_th: 'สีมงคล ตัวเลข และทิศทางของคุณมาจากธาตุประจำนักษัตร การอยู่ท่ามกลางสิ่งเหล่านี้ช่วยให้สภาพแวดล้อมสอดคล้องกับพลังที่ติดตัวคุณมา',
  },
  'forecast-2026': {
    icon: '🔮',
    title_en: '2026 Annual Forecast',
    title_zh: '2026年运势',
    body_en: '2026 is 丙午 (Bǐng Wǔ) — the Year of the Fire Horse. This score shows how your birth chart interacts with the Horse\'s blazing, free-spirited energy. Fire Horse years reward boldness and punish hesitation.',
    body_zh: '2026年为丙午年——火马之年。分数反映命盘与火马奔放能量的互动。火马年奖励大胆者，惩罚犹豫者。',
    title_th: 'ดวงประจำปี 2026',
    body_th: 'ปี 2026 คือปี 丙午 (Bǐng Wǔ) หรือปีม้าไฟ คะแนนนี้แสดงว่าแผนภูมิวันเกิดของคุณมีปฏิสัมพันธ์กับพลังที่ร้อนแรงและอิสระของม้าไฟอย่างไร ปีม้าไฟให้รางวัลแก่ความกล้าตัดสินใจ และไม่เอื้อต่อความลังเล',
  },
  'monthly-energy': {
    icon: '📊',
    title_en: 'Monthly Energy',
    title_zh: '月份运势',
    body_en: 'Each bar shows the relative strength of qi flowing through that month in 2026. Peak bars are when Fire Horse energy aligns best with your chart — ideal for bold moves, launches, and key decisions.',
    body_zh: '每根柱子代表2026年该月气场强弱。最高峰处为火马能量与你命盘最契合之时，宜大胆行动、启动计划与做出关键决策。',
    title_th: 'พลังรายเดือน',
    body_th: 'แต่ละแท่งแสดงความแรงของชี่ในแต่ละเดือนของปี 2026 แท่งที่สูงที่สุดคือช่วงที่พลังม้าไฟสอดคล้องกับแผนภูมิของคุณมากที่สุด เหมาะสำหรับการลงมือครั้งสำคัญ การเริ่มโครงการ และการตัดสินใจที่สำคัญ',
  },
  'work-section': {
    icon: '💼',
    title_en: 'Work',
    title_zh: '事业运势',
    body_en: 'Your career momentum score blends your zodiac\'s natural professional energy with the 2026 Fire Horse year. Fire Horse years reward those who move decisively — the monthly strip shows when to push and when to pace.',
    body_zh: '事业运势综合了你生肖天然的职业能量与2026火马年的影响。火马年奖励果断行动者，月份运势指引你何时发力、何时蓄势。',
    title_th: 'การงาน',
    body_th: 'คะแนนแรงส่งด้านการงานรวมพลังด้านอาชีพตามธรรมชาติของนักษัตรของคุณเข้ากับอิทธิพลของปีม้าไฟ 2026 ปีม้าไฟให้ผลดีแก่ผู้ที่ตัดสินใจอย่างเด็ดขาด แถบรายเดือนแสดงว่าช่วงใดควรเร่งและช่วงใดควรชะลอ',
  },
  'love-section': {
    icon: '❤️',
    title_en: 'Love & Relationships',
    title_zh: '爱情与关系',
    body_en: 'Your love forecast blends your zodiac\'s natural romantic energy with how the 2026 Fire Horse year activates the heart. The archetype reveals how you give and receive love — shaped by your dominant element.',
    body_zh: '爱情运融合了生肖天然的感情能量与2026年火马年对情感的激活。爱情原型揭示了你基于主导五行的给予与接受爱的方式。',
    title_th: 'ความรักและความสัมพันธ์',
    body_th: 'คำพยากรณ์ความรักผสมผสานพลังด้านความรักตามธรรมชาติของนักษัตรของคุณกับอิทธิพลของปีม้าไฟ 2026 ต่อหัวใจ ต้นแบบความรักบอกวิธีที่คุณให้และรับความรัก ซึ่งได้รับอิทธิพลจากธาตุเด่นของคุณ',
  },
  'blood-type': {
    icon: '🩸',
    title_en: 'Blood Type Profile',
    title_zh: '血型个性',
    body_en: 'East Asian tradition associates blood type with personality and fortune. This profile blends your blood type\'s characteristic energy with your dominant element to reveal a unique combination — and shows how it subtly shifts your fortune scores.',
    body_zh: '东亚传统将血型与性格及运势相联系。此档案将血型特质与主导五行结合，揭示独特的能量组合，并展示其对运势分数的细微影响。',
    title_th: 'โปรไฟล์กรุ๊ปเลือด',
    body_th: 'ความเชื่อในเอเชียตะวันออกเชื่อมโยงกรุ๊ปเลือดกับบุคลิกและโชคชะตา โปรไฟล์นี้ผสมผสานลักษณะพลังของกรุ๊ปเลือดกับธาตุเด่นของคุณ เพื่อแสดงรูปแบบเฉพาะตัว และแสดงว่ามีผลต่อคะแนนดวงของคุณเล็กน้อยอย่างไร',
  },
  'birthplace': {
    icon: '🌍',
    title_en: 'Geographic Energy',
    title_zh: '地理能量',
    body_en: 'Every place on Earth carries elemental energy based on its direction, climate, and geography. Understanding how your birth chart\'s dominant element interacts with your birthplace element reveals the environmental forces that shaped your earliest years.',
    body_zh: '地球上每个地方都因方位、气候与地理而蕴含特定五行能量。了解命盘主导五行与出生地五行的互动关系，可揭示塑造你早年成长的环境力量。',
    title_th: 'พลังภูมิศาสตร์',
    body_th: 'ทุกสถานที่บนโลกมีพลังธาตุตามทิศทาง ภูมิอากาศ และภูมิประเทศ การเข้าใจว่าธาตุเด่นในแผนภูมิของคุณสัมพันธ์กับธาตุของบ้านเกิดอย่างไร ช่วยให้เห็นอิทธิพลของสภาพแวดล้อมที่หล่อหลอมคุณในช่วงแรกของชีวิต',
  },
  'noble-stars': {
    icon: '✦',
    title_en: 'Nobleman · 贵人',
    title_zh: '贵人',
    body_en: '贵人 are helpful people — mentors, "earth angels." In natal BaZi, 天乙贵人, 月德, and 天德 mark where support sits in your chart. Qi Men Dunjia later locates helpful direction in time (值符 and the Three Wonders 乙丙丁); Wobazi shows the natal stars first.',
    body_zh: '贵人是助你之人——贵人、导师、人间天使。八字本命看天乙、月德、天德。奇门遁甲再在时间里找贵人方位（值符与三奇乙丙丁）；Wobazi 先呈现本命贵人。',
    title_th: 'กุ้ยเหริน · 贵人',
    body_th: '贵人 (กุ้ยเหริน) คือผู้ที่ให้ความช่วยเหลือ เช่น ผู้ใหญ่ที่เมตตาและพี่เลี้ยง ในดวงปาจื้อพื้นฐาน 天乙贵人 月德 และ 天德 บ่งบอกตำแหน่งของความช่วยเหลือในแผนภูมิของคุณ ส่วนวิชาฉีเหมินตุ้นเจี่ยจะใช้หาทิศทางแห่งความช่วยเหลือตามเวลา (值符 และสามมหัศจรรย์ 乙丙丁) Wobazi แสดงดาวในดวงพื้นฐานก่อน',
  },
};

/* ── Tooltip Functions ── */
function showTip(key) {
  const tip = TIPS[key];
  if (!tip) return;
  haptic(8);
  // One language per sheet: the selected one, English when a field is missing.
  const lang = currentLang();
  const pick = f => (lang !== 'en' && tip[f + '_' + lang]) || tip[f + '_en'];
  document.getElementById('tip-icon').textContent     = tip.icon;
  document.getElementById('tip-title-en').textContent = pick('title');
  document.getElementById('tip-body-en').textContent  = pick('body');
  document.getElementById('tip-title-zh').hidden = true;
  document.getElementById('tip-body-zh').hidden = true;
  document.getElementById('tip-overlay').classList.add('active');
}

function closeTip() {
  document.getElementById('tip-overlay').classList.remove('active');
}

function initTooltips() {
  document.getElementById('results').addEventListener('click', function(e) {
    const tipEl = e.target.closest('[data-tip]');
    if (tipEl) {
      e.stopPropagation();
      showTip(tipEl.dataset.tip);
    }
  });
}

/* ═══════════════════════════════════════
   2026 ANNUAL FORECAST
═══════════════════════════════════════ */
/* Stable 0–1 value for this chart + label (FNV-1a → mulberry32). Same birth data gives the same
   scores on every render: yearly labels hold all year, daily labels hold all day. */
function chartUnit(label) {
  const pillars = (_shareData && _shareData.pillars) || [];
  const chart = pillars.map(p => (p && p.known !== false && p.stem && p.branch) ? p.stem.char + p.branch.char : '-').join('');
  const key = chart + '|' + label;
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619); }
  h = (h + 0x6D2B79F5) | 0;
  h = Math.imul(h ^ (h >>> 15), h | 1);
  h ^= h + Math.imul(h ^ (h >>> 7), h | 61);
  return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
}
function todayKey() {
  const d = new Date();
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

/* Today's score for this chart. The context strip, Today's Fortune card, Oracle panel and
   guidance prompts all read this, so the app never shows two different numbers for one day. */
function dailyFortuneScore(isCompat, isClash) {
  const u = chartUnit('daily|' + todayKey());
  if (isCompat) return 85 + Math.floor(u * 12);
  if (isClash) return 38 + Math.floor(u * 18);
  return 60 + Math.floor(u * 22);
}

function calc2026Fortune(animal, elements) {
  // 2026 = 丙午 Fire Horse
  const HORSE_COMPAT = ['Tiger', 'Dog', 'Goat'];
  const HORSE_CLASH  = ['Rat', 'Ox'];
  let base;
  if (HORSE_COMPAT.includes(animal))      base = 80;
  else if (HORSE_CLASH.includes(animal))  base = 42;
  else if (animal === 'Horse')            base = 74;
  else                                    base = 62;

  // Dominant element vs Fire year
  const dominant = Object.entries(elements).sort((a,b) => b[1]-a[1])[0][0];
  const elMod = { Wood:+9, Fire:+5, Earth:+3, Metal:-4, Water:-8 };
  base = Math.min(95, Math.max(28, base + (elMod[dominant] || 0)));

  // Aspect scores with small variance
  const v = k => Math.floor(chartUnit('2026|' + k) * 10) - 5;
  const aspects = {
    career: Math.min(95, Math.max(25, base + v('career') + (dominant === 'Fire'  ? 5 : 0))),
    love:   Math.min(95, Math.max(25, base + v('love') + (dominant === 'Wood'  ? 4 : 0))),
    wealth: Math.min(95, Math.max(25, base + v('wealth') + (dominant === 'Earth' ? 5 : 0))),
    health: Math.min(95, Math.max(25, base + v('health') + (dominant === 'Metal' ? 4 : 0))),
  };
  return { overall: base, aspects };
}

function gen2026Monthly(base) {
  // Fire Horse peaks in summer; dips in winter
  const boost = [-6, -8, -2, 4, 8, 14, 12, 9, 4, 0, -4, -5];
  return boost.map((b, i) => Math.min(98, Math.max(22,
    Math.round(base + b + (chartUnit('2026|month' + i) * 8 - 4))
  )));
}

function render2026Fortune(animal, elements, preCalc = null) {
  const { overall, aspects } = preCalc || calc2026Fortune(animal, elements);
  const months = gen2026Monthly(overall);
  const dominant = Object.entries(elements).sort((a,b) => b[1]-a[1])[0][0];

  const arcLen  = 306.3; // Full arc for 270° at r=65
  const fillLen = (overall / 100) * arcLen;

  const levelEn = overall >= 75 ? 'Auspicious Year ✦' : overall >= 55 ? 'Steady Year' : 'Challenging Year';
  const levelZh = overall >= 75 ? '大吉之年 ✦'        : overall >= 55 ? '平稳之年'    : '多磨之年';
  const levelTh = overall >= 75 ? 'ปีมงคล ✦'          : overall >= 55 ? 'ปีที่มั่นคง'   : 'ปีที่ท้าทาย';

  const insightEn = overall >= 75
    ? `The Fire Horse's blazing momentum aligns strongly with your chart. 2026 rewards your boldest moves — especially mid-year when Fire peaks. Lean in hard.`
    : overall >= 55
    ? `A mixed year: Fire Horse energy creates push-and-pull. Focus efforts in summer when Fire peaks, pace carefully through winter, and stay consistent.`
    : `2026's wild energy may feel turbulent against your chart. Prioritise patience, strategy, and long-game thinking over impulsive risks. Build — don't sprint.`;
  const insightZh = overall >= 75
    ? `火马年的强劲势头与你的命盘高度契合。2026年大胆行动，尤以年中火能量最旺时为佳。`
    : overall >= 55
    ? `2026年喜忧参半，夏季发力，冬季蓄势，以稳健一致贯穿全年。`
    : `火马年能量对你的命盘有压力，以耐心、谋略为主，避免冒进，以长远视角稳步前行。`;
  const insightTh = overall >= 75
    ? `แรงส่งอันร้อนแรงของปีม้าไฟสอดคล้องกับแผนภูมิของคุณอย่างมาก ปี 2026 ให้ผลดีแก่การตัดสินใจที่กล้าหาญที่สุด โดยเฉพาะช่วงกลางปีที่ธาตุไฟมีกำลังสูงสุด ควรทุ่มเทอย่างเต็มที่`
    : overall >= 55
    ? `เป็นปีที่มีทั้งแรงผลักและแรงต้านจากพลังม้าไฟ ควรทุ่มเทในฤดูร้อนที่ธาตุไฟมีกำลังสูงสุด ดำเนินการอย่างระมัดระวังในฤดูหนาว และรักษาความสม่ำเสมอ`
    : `พลังที่รุนแรงของปี 2026 อาจทำให้รู้สึกไม่มั่นคงเมื่อเทียบกับแผนภูมิของคุณ ควรให้ความสำคัญกับความอดทน การวางกลยุทธ์ และการมองระยะยาว มากกว่าการเสี่ยงอย่างหุนหันพลันแล่น ค่อย ๆ สร้าง อย่าเร่งรีบ`;

  const ASPECT_META = [
    { key:'career', label:'Career', label_zh:'事业', icon:'💼', color:'#8b5cf6' },
    { key:'love',   label:'Love',   label_zh:'爱情', icon:'❤️',  color:'#f43f5e' },
    { key:'wealth', label:'Wealth', label_zh:'财运', icon:'💰',  color:'#f59e0b' },
    { key:'health', label:'Health', label_zh:'健康', icon:'🌿',  color:'#22c55e' },
  ];

  const maxM = Math.max(...months);
  const MLABELS = ['J','F','M','A','M','J','J','A','S','O','N','D'];
  const sparkH = 52;
  const sparkCoords = months.map((v, i) => [
    (i / 11) * 100,
    sparkH - 4 - ((v / maxM) * (sparkH - 10))
  ]);
  const sparkD = sparkCoords.map((p, i) =>
    (i === 0 ? 'M' : 'L') + ` ${p[0].toFixed(1)} ${p[1].toFixed(1)}`
  ).join(' ');
  const peakIdx = months.indexOf(maxM);
  const [px, py] = sparkCoords[peakIdx];
  const sparklineHTML = `
<div class="forecast-sparkline">
  <div class="forecast-monthly-title" data-tip="monthly-energy">${_t('Monthly Energy · 2026', '月份运势 · 2026')}</div>
  <svg class="forecast-sparkline-svg" viewBox="0 0 100 52" preserveAspectRatio="none">
    <path d="${sparkD}" fill="none" stroke="rgba(240,192,64,0.4)"
      stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="2.5" fill="#f0c040"/>
  </svg>
  <div class="forecast-spark-labels">
    ${MLABELS.map((l, i) => `<span>${_t(l, String(i + 1), String(i + 1))}</span>`).join('')}
  </div>
</div>`;

  const aspectsHTML = ASPECT_META.map(m => `
    <div class="aspect-item">
      <div class="aspect-header">
        <div class="aspect-name">${m.icon} ${_t(m.label, m.label_zh)}</div>
        <div class="aspect-score" style="color:${m.color}">${aspects[m.key]}</div>
      </div>
      <div class="aspect-bar-track">
        <div class="aspect-bar-fill" id="asp-bar-${m.key}" style="background:${m.color}" data-pct="${aspects[m.key]}"></div>
      </div>
    </div>`).join('');

  document.getElementById('forecast-card').innerHTML = `
    <div class="forecast-card">
      <div class="forecast-year-badge">丙午 2026</div>
      <div class="forecast-top">
        <div class="forecast-arc-wrap">
          <svg class="forecast-arc-svg" viewBox="0 0 200 130">
            <defs>
              <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stop-color="#3b82f6"/>
                <stop offset="50%"  stop-color="#f0c040"/>
                <stop offset="100%" stop-color="#ef4444"/>
              </linearGradient>
            </defs>
            <path d="M 54 126 A 65 65 0 1 1 146 126"
              fill="none" stroke="rgba(255,255,255,0.07)"
              stroke-width="10" stroke-linecap="round"/>
            <path id="forecast-arc-fill" d="M 54 126 A 65 65 0 1 1 146 126"
              fill="none" stroke="url(#arcGrad)"
              stroke-width="10" stroke-linecap="round"
              stroke-dasharray="0 306.3"/>
          </svg>
          <div class="forecast-score-over">
            <div class="forecast-score-num" id="forecast-score-num">0</div>
            <div class="forecast-score-pct">/ 100</div>
          </div>
        </div>
        <div class="forecast-label en">${levelEn}</div>
        <div class="forecast-label zh hide">${levelZh}</div>
        <div class="forecast-label th hide">${levelTh}</div>
        <div class="forecast-sublabel en">Your 2026 Fortune Score</div>
        <div class="forecast-sublabel zh hide">2026年运势综合评分</div>
        <div class="forecast-sublabel th hide">คะแนนดวงปี 2026 ของคุณ</div>
      </div>
      <div class="forecast-aspects">${aspectsHTML}</div>
      ${sparklineHTML}
      <div class="forecast-insight">
        <span class="en">${insightEn}</span>
        <div class="forecast-insight-zh zh hide">${insightZh}</div>
        <span class="th hide">${insightTh}</span>
      </div>
    </div>`;

  setTimeout(() => {
    // Animate arc
    const arcEl = document.getElementById('forecast-arc-fill');
    if (arcEl) {
      arcEl.style.transition = 'stroke-dasharray 1.6s ease';
      arcEl.setAttribute('stroke-dasharray', `${fillLen} 306.3`);
    }
    // Count up score
    let n = 0;
    const iv = setInterval(() => {
      n = Math.min(n + 2, overall);
      const el = document.getElementById('forecast-score-num');
      if (el) el.textContent = n;
      if (n >= overall) clearInterval(iv);
    }, 20);
    // Aspect bars
    ASPECT_META.forEach(m => {
      const bar = document.getElementById(`asp-bar-${m.key}`);
      if (bar) bar.style.width = aspects[m.key] + '%';
    });
  }, 500);
}

/* ═══════════════════════════════════════
   NEW FEATURE DATA CONSTANTS
═══════════════════════════════════════ */

/* ── Monthly Outfit Colors (2026 Wood Snake Year) ── */
const OUTFIT_COLORS = [
  { month:'Jan', hex:'#1e3a5f', hex2:'#3b6ea8', name:'Navy',          name_zh:'深蓝',     name2:'Steel Blue',  name2_zh:'钢蓝',     avoid:'Bright White', avoid_zh:'亮白色',    why:'Water feeds the Wood Snake — deep blues draw in flow and wisdom.',           why_zh:'水生木蛇——深蓝汲引流动与智慧之气。' },
  { month:'Feb', hex:'#2d6a2d', hex2:'#52a452', name:'Forest Green',  name_zh:'深林绿',   name2:'Sage',        name2_zh:'鼠尾草绿', avoid:'Dull Gray',    avoid_zh:'暗灰色',    why:'Wood month: anchor the year in your element with grounding greens.',          why_zh:'木月，以深绿稳固根基，锚定全年能量。' },
  { month:'Mar', hex:'#6d28d9', hex2:'#a78bfa', name:'Violet',        name_zh:'紫色',     name2:'Lavender',    name2_zh:'薰衣草紫', avoid:'Muddy Brown',  avoid_zh:'泥棕色',    why:'Spring Wood peaks — violet bridges earth and sky for growth.',                why_zh:'春木盛极——紫色桥接天地，助力生长。' },
  { month:'Apr', hex:'#c2185b', hex2:'#f06292', name:'Crimson',       name_zh:'深红',     name2:'Rose',        name2_zh:'玫瑰红',   avoid:'Black',        avoid_zh:'黑色',      why:'Fire energy rises — reds draw social magnetism and confidence.',              why_zh:'火气上升——红色凝聚社交魅力与自信之力。' },
  { month:'May', hex:'#b45309', hex2:'#f59e0b', name:'Amber',         name_zh:'琥珀色',   name2:'Ochre',       name2_zh:'赭黄色',   avoid:'Cold White',   avoid_zh:'冷白色',    why:'Earth month — warm yellows and ambers ground your energy.',                   why_zh:'土月——暖黄与琥珀稳固能量根基。' },
  { month:'Jun', hex:'#9ca3af', hex2:'#e5e7eb', name:'Silver',        name_zh:'银色',     name2:'Pearl White', name2_zh:'珍珠白',   avoid:'Neon Colors',  avoid_zh:'霓虹色',    why:'Metal energy sharpens — silver and white bring clarity.',                     why_zh:'金气锐利——银白带来清醒与澄明之境。' },
  { month:'Jul', hex:'#1e40af', hex2:'#312e81', name:'Midnight Blue', name_zh:'午夜蓝',   name2:'Indigo',      name2_zh:'靛蓝',     avoid:'Red',          avoid_zh:'红色',      why:'Water cools peak Fire — blues protect and recalibrate energy.',               why_zh:'水凉顶火——蓝色守护并重新校准能量。' },
  { month:'Aug', hex:'#0d9488', hex2:'#5eead4', name:'Teal',          name_zh:'青绿',     name2:'Seafoam',     name2_zh:'海沫绿',   avoid:'Harsh Yellow', avoid_zh:'刺眼黄',    why:'Late summer — teal bridges Water and Wood for steady flow.',                  why_zh:'夏末青绿桥接水木，维持稳定流动之气。' },
  { month:'Sep', hex:'#92400e', hex2:'#d97706', name:'Bronze',        name_zh:'古铜色',   name2:'Tan',         name2_zh:'棕褐',     avoid:'Bright Pink',  avoid_zh:'亮粉色',    why:'Earth element harvests — bronze and tan call in abundance.',                  why_zh:'土旺收获之时——铜棕召唤丰盛入门。' },
  { month:'Oct', hex:'#6b7280', hex2:'#d1d5db', name:'Steel Gray',    name_zh:'钢灰',     name2:'Silver',      name2_zh:'银色',     avoid:'Orange',       avoid_zh:'橙色',      why:'Metal month sharpens — neutral tones keep you decisive.',                     why_zh:'金月锐利——中性色调保持清晰果断。' },
  { month:'Nov', hex:'#1c1917', hex2:'#374151', name:'Charcoal',      name_zh:'炭灰',     name2:'Dark Slate',  name2_zh:'深石板',   avoid:'Loud Prints',  avoid_zh:'大印花',    why:'Water season deepens — dark colors protect inner energy.',                    why_zh:'水季加深——深色护持内在能量储备。' },
  { month:'Dec', hex:'#dc2626', hex2:'#fca5a5', name:'Scarlet',       name_zh:'深红',     name2:'Blush Red',   name2_zh:'腮红',     avoid:'Gray',         avoid_zh:'灰色',      why:'Year-end Fire surge — reds call in celebration and luck.',                    why_zh:'年末火气上涌——红色召唤喜悦与好运。' },
];

/* ── Lucky Foods per Element ── */
const LUCKY_FOODS = {
  Wood:  {
    eat:      ['Leafy greens', 'Bean sprouts', 'Lemon & lime', 'Liver (chicken)', 'Walnuts', 'Broccoli'],
    eat_zh:   ['绿叶蔬菜', '豆芽', '柠檬青柠', '鸡肝', '核桃', '西兰花'],
    avoid:    ['Excess fried foods', 'Heavy dairy', 'Processed meats'],
    avoid_zh: ['过度油炸食物', '厚重乳制品', '加工肉类'],
    power: 'Spirulina', power_zh: '螺旋藻',
    powerWhy:    'Concentrated chlorophyll directly feeds Wood energy — detoxifying and growth-boosting.',
    powerWhy_zh: '浓缩叶绿素直接滋养木元素——排毒促进生长。',
  },
  Fire:  {
    eat:      ['Dark berries', 'Red peppers', 'Bitter greens', 'Dark chocolate (70%+)', 'Beets', 'Pomegranate'],
    eat_zh:   ['深色浆果', '红椒', '苦绿蔬', '黑巧克力（70%+）', '甜菜', '石榴'],
    avoid:    ['Alcohol', 'Cold drinks with ice', 'Excess spice'],
    avoid_zh: ['酒精', '加冰冷饮', '过度辛辣'],
    power: 'Pomegranate', power_zh: '石榴',
    powerWhy:    'Loaded with antioxidants that protect Fire\'s most vulnerable organ — the heart.',
    powerWhy_zh: '富含抗氧化剂，守护火最脆弱的器官——心脏。',
  },
  Earth: {
    eat:      ['Sweet potato', 'Millet', 'Raw honey', 'Pumpkin', 'Brown rice', 'Butternut squash'],
    eat_zh:   ['红薯', '小米', '天然蜂蜜', '南瓜', '糙米', '牛油果南瓜'],
    avoid:    ['Refined sugar', 'Cold/raw foods in excess', 'Dairy excess'],
    avoid_zh: ['精制糖', '过度生冷食物', '乳制品过量'],
    power: 'Turmeric', power_zh: '姜黄',
    powerWhy:    'Warms and supports Earth\'s spleen-stomach system — the center of your body\'s qi.',
    powerWhy_zh: '温暖并支撑土的脾胃系统——你身体气机的中枢。',
  },
  Metal: {
    eat:      ['White radish (daikon)', 'Asian pear', 'Firm tofu', 'Cauliflower', 'Almonds', 'White sesame'],
    eat_zh:   ['白萝卜', '亚洲梨', '嫩豆腐', '花椰菜', '杏仁', '白芝麻'],
    avoid:    ['Excess spicy food', 'Processed/packaged meat', 'Smoking'],
    avoid_zh: ['过度辛辣', '加工包装肉类', '吸烟'],
    power: 'Ginger', power_zh: '生姜',
    powerWhy:    'Warms Metal\'s lungs and improves respiratory qi — your body\'s chief weakness.',
    powerWhy_zh: '温暖金之肺气，改善呼吸之气——你身体最薄弱之处。',
  },
  Water: {
    eat:      ['Black sesame seeds', 'Seafood', 'Walnuts', 'Black beans', 'Seaweed', 'Blueberries'],
    eat_zh:   ['黑芝麻', '海鲜', '核桃', '黑豆', '海藻', '蓝莓'],
    avoid:    ['Too much salt', 'Excess caffeine', 'Cold raw foods in winter'],
    avoid_zh: ['过多盐分', '过量咖啡因', '冬季生冷食物'],
    power: 'Miso', power_zh: '味噌',
    powerWhy:    'Fermented salt — nourishes Water\'s kidneys and adrenals without overwhelming them.',
    powerWhy_zh: '发酵盐——滋养水之肾脏与肾上腺，而不致过量。',
  },
};

/* ── Crystals per Element ── */
const CRYSTALS = {
  Wood:  [
    { name:'Green Aventurine', emoji:'🟢', effect:'Amplifies growth and opportunity windows',     effect_zh:'放大成长机遇窗口',         carry:'Left wrist',          carry_zh:'左手腕' },
    { name:'Malachite',        emoji:'🌿', effect:'Breaks stuck patterns and drives change',      effect_zh:'打破困局，推动改变',         carry:'Pocket',              carry_zh:'口袋' },
    { name:'Moss Agate',       emoji:'🪨', effect:'Builds slow, steady momentum and patience',   effect_zh:'积累缓慢稳定的势头与耐心',   carry:'Desk or workspace',   carry_zh:'书桌或工作区' },
  ],
  Fire:  [
    { name:'Carnelian',        emoji:'🔴', effect:'Ignites motivation, courage, and passion',    effect_zh:'点燃动力、勇气与热情',       carry:'Right pocket',        carry_zh:'右口袋' },
    { name:'Garnet',           emoji:'💎', effect:'Sustains vitality and long-term stamina',      effect_zh:'维持活力与长期耐力',         carry:'Left wrist',          carry_zh:'左手腕' },
    { name:'Red Jasper',       emoji:'🧱', effect:'Grounds fiery energy — prevents burnout',     effect_zh:'接地火焰能量，防止燃尽',     carry:'Desk',                carry_zh:'书桌' },
  ],
  Earth: [
    { name:'Citrine',          emoji:'🌟', effect:'Attracts abundance and mental clarity',        effect_zh:'吸引丰盛与心智清晰',         carry:'Purse or wallet',     carry_zh:'钱包或手提包' },
    { name:"Tiger's Eye",      emoji:'🐯', effect:'Builds decisive confidence under pressure',   effect_zh:'在压力下建立果断自信',       carry:'Left wrist',          carry_zh:'左手腕' },
    { name:'Yellow Calcite',   emoji:'🪨', effect:'Dissolves self-doubt and indecision',         effect_zh:'化解自我怀疑与优柔寡断',     carry:'Pocket',              carry_zh:'口袋' },
  ],
  Metal: [
    { name:'Clear Quartz',     emoji:'💠', effect:'Amplifies any intention you set clearly',     effect_zh:'放大任何你清晰设定的意图',   carry:'Anywhere',            carry_zh:'随处皆可' },
    { name:'Selenite',         emoji:'🤍', effect:'Clears mental clutter — use it daily',        effect_zh:'清除心智杂乱——每日使用',     carry:'Bedside',             carry_zh:'床头' },
    { name:'Amethyst',         emoji:'💜', effect:'Disciplines overthinking, sharpens focus',    effect_zh:'约束过度思虑，锐化专注',     carry:'Left wrist',          carry_zh:'左手腕' },
  ],
  Water: [
    { name:'Lapis Lazuli',     emoji:'🔵', effect:'Deepens wisdom and activates insight',        effect_zh:'深化智慧，激活洞察',         carry:'Throat or chest',     carry_zh:'喉部或胸前' },
    { name:'Sodalite',         emoji:'🫐', effect:'Sharpens intuition signals — trust your gut', effect_zh:'强化直觉信号——相信本能',     carry:'Left pocket',         carry_zh:'左口袋' },
    { name:'Blue Lace Agate',  emoji:'🩵', effect:'Calms anxiety and smooths communication',    effect_zh:'平息焦虑，顺畅沟通',         carry:'Left wrist',          carry_zh:'左手腕' },
  ],
};

/* ── Morning Ritual per Element ── */
const MORNING_RITUAL = {
  Wood: [
    { step:1, icon:'🌅', title:'Face East at Sunrise',    title_zh:'日出时朝向东方',
      body:'Stand tall and face east — your element\'s direction. Breathe in for 4 counts, hold 2, out for 4. Do this for 3 minutes. Wood energy rises with the sun and you must rise with it.',
      body_zh:'站直身体，面朝东方——你元素的方向。吸气4秒，屏息2秒，呼气4秒，持续3分钟。木气随日出而升，你亦须随之而起。' },
    { step:2, icon:'🍋', title:'Warm Lemon Water First',  title_zh:'先饮温柠檬水',
      body:'Drink warm water with half a fresh lemon before any food, coffee, or phone. This activates Wood\'s liver-gallbladder detox cycle within 15 minutes of waking.',
      body_zh:'进食、喝咖啡或看手机前，先饮加半颗新鲜柠檬的温水。此举可在醒后15分钟内激活木之肝胆排毒周期。' },
    { step:3, icon:'✍️', title:'Write One Living Intention', title_zh:'书写一个成长意图',
      body:'Not a to-do list. Write one sentence: what you will grow today. "Today I will deepen X" or "Today I will start Y." Wood energy requires direction or it stagnates.',
      body_zh:'不是待办清单——写一句话：今天你将培育什么。"今天我将深耕X"或"今天我将开启Y"。木能需要方向，否则会停滞。' },
  ],
  Fire: [
    { step:1, icon:'☀️', title:'5 Minutes of Morning Light', title_zh:'5分钟晨光浴',
      body:'Get actual sunlight on your face within 30 minutes of waking. Step outside — no glass. Fire needs the sun to activate. Even 5 minutes on an overcast day counts.',
      body_zh:'醒后30分钟内让阳光直射脸部。走到室外——不隔玻璃。火需要太阳来激活。即便阴天，5分钟也有效。' },
    { step:2, icon:'📣', title:'Say Your Biggest Goal Aloud', title_zh:'大声说出你最大的目标',
      body:'Fire energy requires expression. Say your most important goal out loud — not in your head. Say it like you mean it. This activates Fire\'s heart-qi more than any journaling.',
      body_zh:'火能需要表达。大声说出你最重要的目标——不要只在脑中默想。要说得像你真心相信。这比任何日记更能激活火之心气。' },
    { step:3, icon:'🍳', title:'Eat a Warm Breakfast', title_zh:'吃温热早餐',
      body:'Cold food first thing dampens your Fire. Eggs, oats, congee, anything warm. Your digestive fire is most active at 7-9am — use it. Cold smoothies work against you.',
      body_zh:'起床就吃冷食会抑制你的火气。鸡蛋、燕麦、粥品——任何温热的食物。你的消化之火在早上7-9点最旺——善加利用。' },
  ],
  Earth: [
    { step:1, icon:'🦶', title:'Bare Feet on Ground First', title_zh:'先赤脚踩地',
      body:'Before your phone — two minutes of bare feet on floor or ground. Earth element activates through physical contact with surfaces. This isn\'t metaphor; it resets your nervous system.',
      body_zh:'先于手机之前——赤脚踩在地板或地面两分钟。土元素通过与地表的物理接触来激活。这并非比喻，它真实重置你的神经系统。' },
    { step:2, icon:'🌅', title:'Breakfast Before Any Screen', title_zh:'先吃早餐再看屏幕',
      body:'Earth\'s spleen-stomach qi peaks from 7-9am. Eat before checking messages, news, or email. You are most metabolically efficient right now — don\'t waste it on cortisol.',
      body_zh:'土的脾胃气在早上7-9点最旺。先用餐，再查信息、新闻或邮件。此时你的代谢效率最高——不要浪费在皮质醇上。' },
    { step:3, icon:'💧', title:'One Act of Care', title_zh:'做一件关怀之事',
      body:'Water a plant. Text someone "good morning" and mean it. Feed an animal. Earth energy activates through giving — it must flow outward to recharge inward. Do this before it\'s convenient.',
      body_zh:'浇一棵植物。真心地给某人发"早安"。喂一只动物。土能通过给予而激活——必须向外流动才能向内充电。在还不方便时就去做。' },
  ],
  Metal: [
    { step:1, icon:'💧', title:'Cold Water Face Splash', title_zh:'冷水拍脸',
      body:'Splash cold water on your face 5-7 times immediately after waking. Metal sharpens through contrast. This activates the lung meridian (Metal\'s organ) and raises alertness faster than coffee.',
      body_zh:'醒来后立即用冷水拍脸5-7次。金通过对比而锐化。这比咖啡更快激活肺经（金的器官），提升清醒度。' },
    { step:2, icon:'🎯', title:'State One Clear Goal', title_zh:'设定一个清晰目标',
      body:'Not "be productive" — one concrete, measurable goal. "Finish the report by noon." "Call Marcus before 10am." Metal energy flows through precision. Vague intentions waste it.',
      body_zh:'不是"要高效"——而是一个具体可量化的目标。"中午前完成报告。""上午10点前联系Marcus。"金能通过精确而流动，模糊的意图会消耗它。' },
    { step:3, icon:'🧹', title:'Tidy One Surface', title_zh:'整理一个平面',
      body:'Clear your desk, your bedside, or your kitchen counter before leaving the room. Metal flows through order. A cluttered space creates static in your thinking all day.',
      body_zh:'离开房间前清理书桌、床头或厨房台面。金通过秩序流动。杂乱的空间会给你整天的思维造成干扰。' },
  ],
  Water: [
    { step:1, icon:'🌑', title:'Sit in Quiet Darkness First', title_zh:'先在静暗中独坐',
      body:'Before any light or sound — five minutes of stillness. Sit on the edge of your bed in the dark. Water needs this stillness to surface what your subconscious processed overnight.',
      body_zh:'在任何光线或声音之前——五分钟的静默。坐在黑暗中床沿。水需要这份静默，让潜意识夜间处理的内容浮现。' },
    { step:2, icon:'📓', title:'Write 3 Lines — Don\'t Edit', title_zh:'写三行——不要修改',
      body:'In a notebook, write whatever surfaces: feelings, images, fragments. No editing, no rereading. Water thinks through writing. Suppressing this creates the brain fog Water types often report.',
      body_zh:'在笔记本上写下浮现的任何内容：感受、意象、碎片。不修改，不重读。水通过书写思考。压抑这一过程会造成水型人常有的脑雾。' },
    { step:3, icon:'💧', title:'Room-Temperature Mineral Water', title_zh:'饮室温矿泉水',
      body:'Your kidneys (Water\'s organs) processed everything overnight. Drink room-temperature mineral water — not cold, not filtered tap — before coffee. Support your kidneys first.',
      body_zh:'你的肾脏（水的器官）整夜运转。在喝咖啡前先饮室温矿泉水——不要冰的，不要普通过滤水。先滋养肾脏。' },
  ],
};

/* ── Kua Directions ── */
const KUA_DIRS = {
  1: { dir:'North',     zh:'北',   compass:'N',  angle:0,   color:'#3b82f6', desc:'Aligns with career, wisdom, and life-path energy.',       desc_zh:'与事业、智慧、人生道路的能量对齐。' },
  2: { dir:'Southwest', zh:'西南', compass:'SW', angle:225, color:'#f59e0b', desc:'Grounds relationships, nurturing, and home.',               desc_zh:'稳固情感、滋养之气与家庭根基。' },
  3: { dir:'East',      zh:'东',   compass:'E',  angle:90,  color:'#22c55e', desc:'Channels vitality, growth, and fresh starts.',             desc_zh:'汇聚生命力、成长与新开始之气。' },
  4: { dir:'Southeast', zh:'东南', compass:'SE', angle:135, color:'#10b981', desc:'Activates wealth, communication, and abundance.',          desc_zh:'激活财富、沟通与丰盛能量。' },
  6: { dir:'Northwest', zh:'西北', compass:'NW', angle:315, color:'#94a3b8', desc:'Draws in mentors, authority, and leadership.',             desc_zh:'招引贵人、权威与领导力量。' },
  7: { dir:'West',      zh:'西',   compass:'W',  angle:270, color:'#ec4899', desc:'Enhances joy, creativity, and connection.',                desc_zh:'增进喜悦、创意与人际连结。' },
  8: { dir:'Northeast', zh:'东北', compass:'NE', angle:45,  color:'#a78bfa', desc:'Sharpens knowledge, stillness, and discernment.',          desc_zh:'磨砺知识、静定与洞察力。' },
  9: { dir:'South',     zh:'南',   compass:'S',  angle:180, color:'#ef4444', desc:'Amplifies recognition, fame, and social energy.',          desc_zh:'放大声誉、名望与社交能量。' },
};

/* ── Life Decade Theme Colors per Element ── */
const DECADE_THEMES = {
  Wood:  [
    { phase:'Plant',   phase_zh:'播种', emoji:'🌱', note:'Foundation years. Build without expecting harvest yet.',       note_zh:'奠基之年，播种耕耘，无需急于收获。' },
    { phase:'Grow',    phase_zh:'生长', emoji:'🌿', note:'Momentum builds. Compound effort now.',                        note_zh:'势头累积，此时复利耕耘效果最佳。' },
    { phase:'Bloom',   phase_zh:'绽放', emoji:'🌸', note:'Peak expression. Visibility and recognition come.',            note_zh:'巅峰绽放，能见度与认可纷至沓来。' },
    { phase:'Harvest', phase_zh:'收获', emoji:'🌾', note:'Reap what you cultivated. Teach and share.',                   note_zh:'收获所耕，传授分享。' },
    { phase:'Rest',    phase_zh:'休养', emoji:'🍂', note:'Let go gracefully. Your roots sustain others.',                note_zh:'从容放手，你的根仍在滋养他人。' },
  ],
  Fire:  [
    { phase:'Spark',   phase_zh:'点火', emoji:'✨', note:'Raw potential ignites. Take risks — this is the time.',        note_zh:'原始潜能点燃，冒险此刻当时。' },
    { phase:'Ignite',  phase_zh:'燃起', emoji:'🔥', note:'Ambition peaks. Pursue boldly, pace carefully.',              note_zh:'雄心顶峰，大胆追求，节奏需稳。' },
    { phase:'Blaze',   phase_zh:'烈焰', emoji:'☀️', note:'Maximum output and impact. Lead, create, shine.',             note_zh:'最大产出与影响力，领导、创造、发光。' },
    { phase:'Ember',   phase_zh:'余烬', emoji:'🕯️', note:'Deep warmth over flashy heat. Mentor others.',               note_zh:'以深沉温暖代替耀眼热度，成为他人的导师。' },
    { phase:'Return',  phase_zh:'回归', emoji:'🌑', note:'Fire returns to soil. Your heat fuels the next cycle.',       note_zh:'火归于土，你的热量滋养下一个循环。' },
  ],
  Earth: [
    { phase:'Till',    phase_zh:'耕耘', emoji:'⛏️', note:'Prepare the ground. Hard, invisible, necessary work.',        note_zh:'准备土壤，艰辛而隐形，但不可或缺。' },
    { phase:'Sow',     phase_zh:'播种', emoji:'🌰', note:'Plant intentionally. Not everything — the right things.',     note_zh:'有意识地播种，不求量多——只种对的事。' },
    { phase:'Tend',    phase_zh:'培育', emoji:'🌻', note:'Consistent care over dramatic action. Trust the process.',    note_zh:'持续呵护胜于大动作，相信过程。' },
    { phase:'Reap',    phase_zh:'收获', emoji:'🧺', note:'Abundance arrives. Share generously — Earth replenishes.',    note_zh:'丰盛到来，慷慨分享——土元素自会补给。' },
    { phase:'Compost', phase_zh:'转化', emoji:'♻️', note:'Transform experience into wisdom. Enrich what comes next.',  note_zh:'将经历化为智慧，为下一阶段注入养分。' },
  ],
  Metal: [
    { phase:'Mine',    phase_zh:'挖掘', emoji:'⛏️', note:'Excavate raw talent. Dig deep into what you\'re made of.',   note_zh:'挖掘原始天赋，深探你的本质所在。' },
    { phase:'Refine',  phase_zh:'提炼', emoji:'🔩', note:'Remove impurities. Develop mastery, shed distraction.',      note_zh:'去除杂质，精炼技艺，舍弃干扰。' },
    { phase:'Forge',   phase_zh:'锻造', emoji:'⚒️', note:'Peak precision. Your skills become your identity.',          note_zh:'精准顶峰，技艺成为你的身份标识。' },
    { phase:'Polish',  phase_zh:'抛光', emoji:'💎', note:'Excellence recognized. Let others see the work.',            note_zh:'卓越获认可，让他人看见你的成就。' },
    { phase:'Archive', phase_zh:'传承', emoji:'📚', note:'Your legacy crystallizes. Preserve and pass it down.',       note_zh:'遗产结晶，保存并传承下去。' },
  ],
  Water: [
    { phase:'Source',  phase_zh:'源头', emoji:'💧', note:'Still and deep. Gather before you flow.',                    note_zh:'静而深邃，蓄积于内，方能流动。' },
    { phase:'Flow',    phase_zh:'流动', emoji:'🌊', note:'Movement gains power. Follow your natural course.',          note_zh:'流动积蓄力量，顺势而为，走自己的路。' },
    { phase:'Deepen',  phase_zh:'深化', emoji:'🌀', note:'Wisdom accumulates. Others seek your depth.',               note_zh:'智慧积淀，他人慕你之深邃而来。' },
    { phase:'Still',   phase_zh:'沉静', emoji:'🏞️', note:'Mastery is quiet. True depth needs no performance.',        note_zh:'精通归于平静，真正的深度无需表演。' },
    { phase:'Return',  phase_zh:'归源', emoji:'🌧️', note:'Experience cycles back. You become the source.',            note_zh:'经历轮回，你已成为源头。' },
  ],
};

/* ═══════════════════════════════════════
   NEW FEATURE CALCULATION FUNCTIONS
═══════════════════════════════════════ */

/* ── Calculate Kua Number (1-9) from birth year + gender ── */
function calcKua(year, gender) {
  let s = year.toString().split('').reduce((a,d) => a + parseInt(d), 0);
  while (s > 9) s = s.toString().split('').reduce((a,d) => a + parseInt(d), 0);
  let kua;
  if (gender === 'M') {
    kua = (year < 2000) ? 10 - s : 9 - s;
    if (kua <= 0) kua = kua + 9;
  } else {
    kua = (year < 2000) ? s + 5 : s + 6;
    while (kua > 9) kua = kua.toString().split('').reduce((a,d) => a + parseInt(d), 0);
  }
  if (kua === 5) kua = (gender === 'M') ? 2 : 8;
  return kua;
}

/* ── Get personal lucky numbers ── */
function getLuckyNumbers(year, month, day, animal, dominantEl) {
  // Numerology: reduce birth date
  const sum = year + month + day;
  const digits = sum.toString().split('').map(Number);
  let n = digits.reduce((a, b) => a + b, 0);
  while (n > 9) n = n.toString().split('').map(Number).reduce((a, b) => a + b, 0);
  // Element numbers
  const elNums = { Wood:[3,4], Fire:[7,2], Earth:[5,0], Metal:[4,9], Water:[6,1] };
  const animalNum = (BRANCHES.findIndex(b => b.animal === animal) + 1) || 1;
  const base = elNums[dominantEl] || [1,2];
  return [n === 0 ? 9 : n, base[0], base[1], animalNum].filter((v,i,a) => a.indexOf(v)===i);
}

/* ── Get power days for current + next month ── */
/* Personal date selection. Every day is scored against THIS chart by the engine:
   sound in the almanac (建除十二神), in harmony with the natal pillars, and never
   clashing the year animal (冲太岁). See BaziEngine.scoreDayForChart. */
function getPersonalDates(pillars, year, month, purpose) {
  if (!pillars || !window.BaziEngine || !BaziEngine.bestDatesInMonth) return [];
  try {
    return BaziEngine.bestDatesInMonth({ year: year, month: month, pillars: pillars, purpose: purpose });
  } catch (e) {
    console.error('[power days]', e);
    return [];
  }
}

/* ═══════════════════════════════════════
   NEW FEATURE RENDER FUNCTIONS
═══════════════════════════════════════ */

/* ── Render Today's Action Plan (compact card on Fortune tab) ── */
/* ── Render Outfit Section ── */
function renderOutfitSection(dominantEl, nowMonth) {
  const elColor = EL_COLOR[dominantEl];
  // Show prev, current, next month
  const months = [-1, 0, 1].map(offset => {
    const idx = ((nowMonth + offset) % 12 + 12) % 12;
    return { ...OUTFIT_COLORS[idx], isCurrent: offset === 0 };
  });

  const monthCards = months.map(m => `
    <div class="outfit-month-card${m.isCurrent ? ' outfit-current' : ''}">
      <div class="outfit-month-label">${_t(m.month)}${m.isCurrent ? ` · ${_t('Now','当前')}` : ''}</div>
      <div class="outfit-swatches-row">
        <div class="outfit-swatch" style="background:${m.hex}" title="${m.name}">
          <span class="outfit-swatch-name">${_t(m.name, m.name_zh || m.name)}</span>
        </div>
        <div class="outfit-swatch" style="background:${m.hex2}" title="${m.name2}">
          <span class="outfit-swatch-name">${_t(m.name2, m.name2_zh || m.name2)}</span>
        </div>
      </div>
      ${m.isCurrent ? `<div class="outfit-why">${_t(m.why, m.why_zh)}</div>` : ''}
      <div class="outfit-avoid">${_t('Avoid','忌穿')}: ${_t(m.avoid, m.avoid_zh)}</div>
    </div>
  `).join('');

  // Element-based always-wear tip
  const elTips = {
    Wood:  ['Always: weave in green accessories — even one item anchors your element.', '常备：佩戴绿色配饰——哪怕一件也能锚定你的元素能量。'],
    Fire:  ['Always: one red or orange accent draws your qi outward into action.',      '常备：一件红色或橙色点缀，将气机向外引向行动。'],
    Earth: ['Always: warm neutrals (cream, tan, amber) keep you grounded and magnetic.','常备：暖中性色（米色、棕褐、琥珀）令你沉稳而有磁场。'],
    Metal: ['Always: clean lines and silver/white tones sharpen your natural precision.','常备：简洁线条与银白色调，磨砺你天生的精准之气。'],
    Water: ['Always: deep blues and blacks protect your energy in public settings.',     '常备：深蓝与黑色在公共场合守护你的能量。'],
  };

  document.getElementById('outfit-card').innerHTML = `
    <div class="outfit-card">
      <div class="outfit-months-row">${monthCards}</div>
      <div class="outfit-el-tip" style="border-left-color:${elColor}">
        <span class="outfit-el-icon">✦ ${_t(dominantEl + ' Element', (EL_ZH[dominantEl] || dominantEl) + ' 元素', 'ธาตุ' + (EL_TH[dominantEl] || dominantEl))}</span> — ${_t(elTips[dominantEl][0], elTips[dominantEl][1])}
      </div>
    </div>
  `;
}

/* ── Render Lucky Numbers ── */
function renderLuckyNumbers(year, month, day, animal, dominantEl) {
  const elColor = EL_COLOR[dominantEl];
  const nums = getLuckyNumbers(year, month, day, animal, dominantEl);

  function genLottery() {
    const picks = [];
    while (picks.length < 6) {
      const n = Math.floor(Math.random() * 49) + 1;
      if (!picks.includes(n)) picks.push(n);
    }
    return picks.sort((a,b) => a - b);
  }

  const ballsHTML = nums.map(n =>
    `<div class="num-ball" style="background:${elColor}22;border-color:${elColor};color:${elColor}">${n}</div>`
  ).join('');

  document.getElementById('lucky-num-card').innerHTML = `
    <div class="lucky-num-card">
      <div class="lucky-num-section">
        <div class="lucky-num-label">${_t('Your Personal Numbers', '你的专属数字')}</div>
        <div class="lucky-num-balls">${ballsHTML}</div>
      </div>
      <div class="lucky-num-section">
        <div class="lucky-num-label">${_t('Lottery Pick', '彩票选号')} <span class="lottery-label-sub">${_t('tap to regenerate', '点击重新生成')}</span></div>
        <div class="lottery-balls" id="lottery-balls-wrap">
          ${genLottery().map(n => `<div class="lottery-ball">${n}</div>`).join('')}
        </div>
        <button class="lottery-btn" onclick="haptic(8); const w=document.getElementById('lottery-balls-wrap'); const picks=[]; while(picks.length<6){const n=Math.floor(Math.random()*49)+1;if(!picks.includes(n))picks.push(n);} picks.sort((a,b)=>a-b); w.innerHTML=picks.map(n=>'<div class=\\'lottery-ball\\'>' +n+ '</div>').join('');">
          🎱 ${_t('New Pick', '换一组', 'สุ่มใหม่')}
        </button>
      </div>
    </div>
  `;
}

/* ── Render Auspicious Power Days ──
   Pick a category (Business, Career, Love…) then what you're planning. The engine
   scores every date against the chart; the top upcoming fits are the answer, the
   month grid shows the rest, and any date can be explained. */
const POWER_WINDOW_DAYS = 56;   // "next best dates" look this far ahead
const POWER_MAX_MONTHS = 12;    // how far the month grid can be paged

function _loc(o) {
  if (!o) return '';
  return _t(o.en, o.zh, o.th);
}
function _plainLoc(o) {
  if (!o) return '';
  const lang = currentLang();
  return o[lang] || o.en;
}
function _powerObjective(key) {
  const all = (window.BaziEngine && BaziEngine.DATE_OBJECTIVES) || {};
  return all[key] || all.personal;
}
function _powerGroups() {
  return (window.BaziEngine && BaziEngine.DATE_OBJECTIVE_GROUPS) || [];
}

function _scoredMonth(pillars, year, month1, purpose) {
  const key = (pillars || []).map(p => (p && p.known && p.stem) ? p.stem.char + p.branch.char : '-').join('') + `|${year}-${month1}|${purpose}`;
  if (!_powerCache.has(key)) {
    if (_powerCache.size > 60) _powerCache.clear();
    _powerCache.set(key, getPersonalDates(pillars, year, month1, purpose));
  }
  return _powerCache.get(key);
}

function _powerFits(s) {
  if (!s || s.tier === 'avoid') return false;
  return _calFilter === 'personal' || s.reasons.some(r => r.code === 'purpose-fit');
}

/* Best dates from today forward, across month boundaries. */
function _powerPicks(pillars) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start); end.setDate(end.getDate() + POWER_WINDOW_DAYS);
  const days = [];
  for (let y = start.getFullYear(), m = start.getMonth(); new Date(y, m, 1) <= end; m === 11 ? (y++, m = 0) : m++) {
    _scoredMonth(pillars, y, m + 1, _calFilter).forEach(s => {
      const dt = new Date(s.year, s.month - 1, s.day);
      if (dt >= start && dt <= end) days.push(s);
    });
  }
  let pool = days.filter(_powerFits);
  const classic = pool.length > 0 || _calFilter === 'personal';
  if (!pool.length) pool = days.filter(s => s.tier !== 'avoid');
  const picks = pool.slice().sort((a, b) => b.score - a.score || (a.month - b.month) || a.day - b.day).slice(0, 3);
  picks.sort((a, b) => new Date(a.year, a.month - 1, a.day) - new Date(b.year, b.month - 1, b.day));
  return { picks, classic };
}

function setCalFilter(key) {
  _calFilter = (window.BaziEngine && BaziEngine.DATE_OBJECTIVES && BaziEngine.DATE_OBJECTIVES[key]) ? key : 'personal';
  _powerSel = null;
  if (_shareData && _shareData.animal) renderAuspiciousDates(_shareData.animal, _shareData.dominantEl, { selectBest: true });
}

function shiftPowerMonth(delta) {
  _calView = Math.max(0, Math.min(POWER_MAX_MONTHS - 1, _calView + delta));
  if (_shareData && _shareData.animal) renderAuspiciousDates(_shareData.animal, _shareData.dominantEl);
}

function renderAuspiciousDates(animal, dominantEl, opts) {
  const card = document.getElementById('power-days-card');
  if (!card) return;
  opts = opts || {};
  const elColor = EL_COLOR[dominantEl] || '#f0c040';
  const pillars = _shareData && _shareData.pillars;
  const obj = _powerObjective(_calFilter);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Picks first: they are the answer to "when should I…?"
  const { picks, classic } = _powerPicks(pillars);
  if (opts.selectBest && picks.length) {
    const best = picks.slice().sort((a, b) => b.score - a.score)[0];
    _powerSel = { y: best.year, m: best.month - 1, d: best.day };
  }
  if (!_powerSel) _powerSel = { y: today.getFullYear(), m: today.getMonth(), d: today.getDate() };
  if (opts.selectBest || opts.followSel) {
    _calView = Math.max(0, (_powerSel.y - today.getFullYear()) * 12 + _powerSel.m - today.getMonth());
  }

  const view = new Date(today.getFullYear(), today.getMonth() + _calView, 1);
  const year = view.getFullYear();
  const month = view.getMonth();
  const scored = _scoredMonth(pillars, year, month + 1, _calFilter);
  const byDay = {};
  scored.forEach(s => { byDay[s.day] = s; });

  const partnerOk = {};
  if (_lastPartner && _lastPartner.pillars) {
    _scoredMonth(_lastPartner.pillars, year, month + 1, _calFilter)
      .forEach(s => { if (s.tier === 'power' || s.tier === 'good') partnerOk[s.day] = true; });
  }
  const hasPartner = Object.keys(partnerOk).length > 0;

  /* One grouped dropdown: category → what you're planning. Plain text, so it is
     rebuilt in the current language (see the wobazi:lang listener below). */
  const groups = _powerGroups();
  const optionText = k => {
    const o = _powerObjective(k);
    return (k === 'personal' ? '✦ ' : '') + _plainLoc(o.label);
  };
  const selectHTML = `
    <select class="pd-select" aria-label="${_plainLoc({ en: 'What are you planning?', zh: '你打算做什么？', th: 'คุณกำลังวางแผนทำอะไร' })}" onchange="haptic(6); setCalFilter(this.value)">
      ${groups.map(g => g.objectives.length === 1
        ? `<option value="${g.objectives[0]}"${g.objectives[0] === _calFilter ? ' selected' : ''}>${optionText(g.objectives[0])}</option>`
        : `<optgroup label="${g.icon} ${_plainLoc(g)}">${g.objectives.map(k =>
            `<option value="${k}"${k === _calFilter ? ' selected' : ''}>${optionText(k)}</option>`).join('')}</optgroup>`).join('')}
    </select>`;

  /* Next best dates — short content, so columns */
  const purposeFit = s => s.reasons.some(r => r.code === 'purpose-fit');
  const picksHTML = picks.map(p => {
    const dt = new Date(p.year, p.month - 1, p.day);
    const on = _powerSel && _powerSel.y === p.year && _powerSel.m === p.month - 1 && _powerSel.d === p.day;
    const why = p.reasons.filter(r => r.good && r.code !== 'purpose-fit').slice(0, 1)
      .map(r => _loc(r.short)).join('');
    return `
      <button type="button" class="pick-col${on ? ' is-on' : ''}" onclick="haptic(6); selectPowerDate(${p.year}, ${p.month - 1}, ${p.day})">
        <span class="pick-top">
          <span class="pick-dow">${dt.toLocaleDateString(dateLocale(), { weekday: 'short' })}</span>
          <span class="pick-score is-${p.tier}">${p.score}</span>
        </span>
        <span class="pick-date" style="color:${elColor}">${dt.toLocaleDateString(dateLocale(), { day: 'numeric', month: 'short' })}</span>
        <span class="pick-why">${why || _t('Steady day', '平稳之日', 'วันราบรื่น')}</span>
      </button>`;
  }).join('');
  const personal = _calFilter === 'personal';
  const picksSub = classic
    ? _t('Top 3 in the next 8 weeks · tap any date to see why', '未来 8 周最佳 3 天 · 点任意日期看原因', '3 วันดีสุดใน 8 สัปดาห์ · แตะวันที่เพื่อดูเหตุผล')
    : _t(`No classic ${obj.en} date in the next 8 weeks — these are your strongest days instead`, `未来 8 周没有宜${obj.zh}的正日，以下是你最强的日子`, `ไม่มีวันหลักสำหรับ${obj.th}ใน 8 สัปดาห์ — นี่คือวันที่แข็งแรงที่สุดของคุณแทน`);

  /* Month grid */
  const dayHeaders = ['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => `<div class="cal-header">${_t(d)}</div>`).join('');
  const blanks = Array(view.getDay()).fill('<div class="cal-day cal-blank"></div>').join('');
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1;
    const s = byDay[d];
    const dt = new Date(year, month, d);
    let cls = 'cal-day';
    if (s) {
      cls += s.tier === 'power' ? ' cal-power' : s.tier === 'good' ? ' cal-good' : s.tier === 'avoid' ? ' cal-avoid' : ' cal-plain';
      if (partnerOk[d] && (s.tier === 'power' || s.tier === 'good')) cls += ' cal-both';
      if (!personal && s.tier !== 'avoid' && purposeFit(s)) cls += ' cal-fit';
    }
    if (dt < today) cls += ' cal-past';
    if (dt.getTime() === today.getTime()) cls += ' cal-today';
    const on = _powerSel.y === year && _powerSel.m === month && _powerSel.d === d;
    if (on) cls += ' cal-selected';
    const title = s ? `${s.pillar} · ${s.officer ? s.officer.char + ' ' + s.officer.en : ''} · ${s.score}/100` : '';
    return `<button type="button" class="${cls}" data-day="${d}" title="${title}" aria-pressed="${on}" onclick="haptic(6); selectPowerDate(${year}, ${month}, ${d})">${d}</button>`;
  }).join('');
  const monthLabel = view.toLocaleDateString(dateLocale(), { month: 'long', year: 'numeric' });

  /* Legend: Avoid, then the score scale every other date sits on */
  const legendHTML = `
    <div class="cal-legend">
      <div class="cal-scale" role="img" aria-label="${_plainLoc({ en: 'Day types: Avoid on clash days, Ordinary under 60, Good 60 to 71, Power Day 72 and up', zh: '日子分类：冲日为忌，60 以下平日，60–71 吉，72 以上吉日', th: 'ประเภทวัน: วันชงควรเลี่ยง, ต่ำกว่า 60 วันธรรมดา, 60–71 วันดี, 72 ขึ้นไป วันพลัง' })}">
        <span class="cal-scale-seg is-avoid"></span><span class="cal-scale-seg is-plain"></span><span class="cal-scale-seg is-good"></span><span class="cal-scale-seg is-power"></span>
        <span class="cal-scale-lbl is-avoid">${_t('Avoid', '忌', 'เลี่ยง')}<small>${_t('Clash', '冲日', 'วันชง')}</small></span>
        <span class="cal-scale-lbl">${_t('Ordinary', '平日', 'วันธรรมดา')}<small>0–59</small></span>
        <span class="cal-scale-lbl is-good">${_t('Good', '吉', 'วันดี')}<small>60–71</small></span>
        <span class="cal-scale-lbl is-power">${_t('Power Day', '吉日', 'วันพลัง')}<small>72–100</small></span>
      </div>
      ${!personal || hasPartner ? `<div class="cal-legend-row">
        ${!personal ? `<div class="cal-legend-item"><span class="cal-legend-dot cal-legend-fit"></span> ${_t(`Suits ${obj.en}`, `宜${obj.zh}`, `เหมาะกับ${obj.th}`)}</div>` : ''}
        ${hasPartner ? `<div class="cal-legend-item"><span class="cal-legend-dot cal-legend-both"></span> ${_t('Works for both charts', '两盘皆宜', 'เหมาะทั้งสองแผน')}</div>` : ''}
      </div>` : ''}
    </div>`;


  const officerNames = obj.officers.map(i => {
    const o = BaziEngine.DAY_OFFICERS[i];
    return { en: `${o.char} ${o.en}`, zh: o.zh, th: `วัน${o.char}` };
  });
  const methodNote = personal
    ? _t('Each date is read against your own four pillars: its almanac officer (建除), harmony with your year and day animals, your Nobleman days, and the element your chart needs. Days that clash your year animal are always Avoid.',
         '每一天都按你的四柱来看：建除十二神、与你年支日支的合、天乙贵人日，以及你命盘所需的五行。冲生肖太岁之日一律为忌。',
         'ทุกวันอ่านจากสี่เสาของคุณ: เจ้าวันตามปฏิทิน (建除) ความเข้ากับนักษัตรปีและวัน วันกุ้ยเหริน และธาตุที่ดวงคุณต้องการ วันที่ชงปีนักษัตรของคุณจะเป็นวันควรเลี่ยงเสมอ')
    : _t(`For ${obj.en}, the almanac favours ${officerNames.map(o => o.en).join(', ')} days. Wobazi then keeps only the ones that also suit your chart${obj.noble ? ', and gives extra weight to your Nobleman days, when helpful people show up' : ''}.`,
         `${obj.zh}宜取${officerNames.map(o => o.zh).join('、')}，再只保留与你命盘相合的日子${obj.noble ? '，并加重天乙贵人日' : ''}。`,
         `สำหรับ${obj.th} ปฏิทินจีนเน้น${officerNames.map(o => o.th).join(' ')} แล้ว Wobazi เก็บเฉพาะวันที่เข้ากับดวงคุณ${obj.noble ? ' และให้น้ำหนักวันกุ้ยเหรินเพิ่ม' : ''}`);

  card.innerHTML = `
    <div class="power-days-card">
      <div class="pd-ask">
        <span class="pd-ask-lbl">${_t('Best dates for', '最宜', 'วันที่ดีที่สุดสำหรับ')}</span>
        <span class="pd-select-wrap">${selectHTML}</span>
      </div>
      ${picksHTML ? `<div class="cal-picks">
        <div class="cal-picks-sub">${picksSub}</div>
        <div class="pick-cols">${picksHTML}</div>
      </div>` : ''}
      <div class="pd-split">
        <div class="cal-month">
          <div class="cal-month-bar">
            <button type="button" class="cal-nav" onclick="haptic(6); shiftPowerMonth(-1)" ${_calView === 0 ? 'disabled' : ''} aria-label="${_plainLoc({ en: 'Previous month', zh: '上个月', th: 'เดือนก่อนหน้า' })}">‹</button>
            <div class="cal-month-label">${monthLabel}</div>
            <button type="button" class="cal-nav" onclick="haptic(6); shiftPowerMonth(1)" ${_calView >= POWER_MAX_MONTHS - 1 ? 'disabled' : ''} aria-label="${_plainLoc({ en: 'Next month', zh: '下个月', th: 'เดือนถัดไป' })}">›</button>
          </div>
          <div class="cal-grid">${dayHeaders}${blanks}${days}</div>
          ${legendHTML}
        </div>
        <div class="cal-detail" id="power-day-detail" aria-live="polite">${powerDayDetailHTML(_powerDetailScore(), elColor)}</div>
      </div>
      <div class="cal-note">${methodNote}</div>
    </div>`;
  if (typeof applyI18n === 'function') applyI18n();
}

function _powerDetailScore() {
  if (!_powerSel || !_shareData) return null;
  return _scoredMonth(_shareData.pillars, _powerSel.y, _powerSel.m + 1, _calFilter).find(x => x.day === _powerSel.d) || null;
}

/* Tap a date: a plain verdict, then each reason with what it means. */
function powerDayDetailHTML(s, elColor) {
  if (!s) return '';
  const obj = _powerObjective(_calFilter);
  const personal = _calFilter === 'personal';
  const dt = new Date(s.year, s.month - 1, s.day);
  const fit = s.reasons.some(r => r.code === 'purpose-fit');
  const tierLbl = {
    power: _t('Power Day', '吉日', 'วันพลัง'),
    good:  _t('Good Day', '吉', 'วันดี'),
    avoid: _t('Avoid', '忌', 'ควรเลี่ยง'),
    plain: _t('Ordinary day', '平日', 'วันธรรมดา'),
  }[s.tier] || '';
  let verdict;
  if (s.tier === 'avoid') verdict = _t('Avoid for anything important', '重要之事避开', 'เลี่ยงเรื่องสำคัญ');
  else if (personal) verdict = s.tier === 'plain' ? _t('An ordinary day for you', '于你是平常之日', 'วันธรรมดาสำหรับคุณ') : _t(`${s.tier === 'power' ? 'Power Day' : 'Good Day'} for you`, s.tier === 'power' ? '你的吉日' : '于你吉', `${s.tier === 'power' ? 'วันพลัง' : 'วันดี'}สำหรับคุณ`);
  else if (fit && s.tier !== 'plain') verdict = _t(`${s.tier === 'power' ? 'Power Day' : 'Good Day'} for ${obj.en}`, `${s.tier === 'power' ? '吉日' : '吉'} · 宜${obj.zh}`, `${s.tier === 'power' ? 'วันพลัง' : 'วันดี'}สำหรับ${obj.th}`);
  else if (fit) verdict = _t(`Suits ${obj.en}, but little else in your favour`, `宜${obj.zh}，但于你助力不多`, `เหมาะกับ${obj.th} แต่ไม่ค่อยมีอะไรหนุนคุณ`);
  else if (s.tier !== 'plain') verdict = _t(`Good for you, but not a classic day for ${obj.en}`, `于你吉，但非${obj.zh}正日`, `ดีสำหรับคุณ แต่ไม่ใช่วันหลักสำหรับ${obj.th}`);
  else verdict = _t(`Not a day for ${obj.en}`, `不宜${obj.zh}`, `ไม่ใช่วันสำหรับ${obj.th}`);

  const officer = s.officer ? ` · ${_t(s.officer.char + ' ' + s.officer.en + ' day', s.officer.zh, 'วัน' + s.officer.char)}` : '';
  const animalLbl = _t(`${s.element} ${s.animal}`, `${EL_ZH[s.element] || ''}${ANIMAL_ZH[s.animal] || ''}`, `${EL_TH[s.element] || s.element} ${ANIMAL_TH[s.animal] || s.animal}`);
  const reasons = (s.reasons || []).map(r => `
    <li class="${r.good ? 'is-good' : 'is-bad'}">
      <span class="cr-ico" aria-hidden="true">${r.good ? '✓' : '✕'}</span>
      <div class="cr-body"><strong>${_loc(r.short) || _t(r.en, r.zh, r.th)}</strong>${r.hint ? `<span class="cr-hint">${_loc(r.hint)}</span>` : ''}</div>
    </li>`).join('');
  return `
    <div class="cal-detail-head">
      <div class="cd-date" style="--el-c:${elColor}">
        <span class="cd-dow">${dt.toLocaleDateString(dateLocale(), { weekday: 'short' })}</span>
        <span class="cd-day">${s.day}</span>
        <span class="cd-mon">${dt.toLocaleDateString(dateLocale(), { month: 'short' })}</span>
      </div>
      <div class="cd-main">
        <div class="cd-verdict">${verdict}</div>
        <div class="pick-gz">${s.pillar} ${animalLbl}${officer}</div>
      </div>
      <span class="cal-detail-tier is-${s.tier}" title="${s.score}/100">${tierLbl} · ${s.score}</span>
    </div>
    ${reasons ? `<ul class="cal-reasons">${reasons}</ul>` : `<p class="cal-detail-empty">${_t('Nothing for or against your chart — a neutral day.', '于你命盘无特别吉凶——平常之日。', 'ไม่มีข้อดีข้อเสียต่อดวงคุณ — วันกลางๆ')}</p>`}
    <p class="cd-scale">${_t('Every date starts at 50. Each ✓ adds points and each ✕ takes them away: 72+ is a Power Day, 60+ a Good Day.', '每天从 50 分起算，✓ 加分、✕ 扣分：72 分以上为吉日，60 分以上为吉。', 'ทุกวันเริ่มที่ 50 คะแนน ✓ บวกคะแนน ✕ ลบคะแนน: 72+ คือวันพลัง 60+ คือวันดี')}</p>`;
}

function selectPowerDate(y, m, d) {
  _powerSel = { y, m, d };
  const now = new Date();
  const offset = (y - now.getFullYear()) * 12 + m - now.getMonth();
  if (offset !== _calView && _shareData && _shareData.animal) {
    _calView = Math.max(0, Math.min(POWER_MAX_MONTHS - 1, offset));
    renderAuspiciousDates(_shareData.animal, _shareData.dominantEl);
    return;
  }
  const card = document.getElementById('power-days-card');
  if (!card) return;
  card.querySelectorAll('.cal-day[data-day]').forEach(b => {
    const on = Number(b.dataset.day) === d;
    b.classList.toggle('cal-selected', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  card.querySelectorAll('.pick-col').forEach(b => b.classList.remove('is-on'));
  const detail = document.getElementById('power-day-detail');
  if (detail) {
    detail.innerHTML = powerDayDetailHTML(_powerDetailScore(), EL_COLOR[_shareData && _shareData.dominantEl] || '#f0c040');
    if (typeof applyI18n === 'function') applyI18n();
    // Stacked layout: bring the verdict up under the calendar if it is off-screen.
    const head = detail.querySelector('.cal-detail-head');
    if (head && head.getBoundingClientRect().top > window.innerHeight - 90) {
      head.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
  }
}

/* ── Render Lucky Foods ── */
function renderLuckyFoods(dominantEl) {
  const elColor = EL_COLOR[dominantEl];
  const foods = LUCKY_FOODS[dominantEl];
  if (!foods) return;

  const eatChips = foods.eat.map((f,i) =>
    `<div class="food-chip food-eat">${_t(f, foods.eat_zh?.[i])}</div>`
  ).join('');
  const avoidChips = foods.avoid.map((f,i) =>
    `<div class="food-chip food-avoid">${_t(f, foods.avoid_zh?.[i])}</div>`
  ).join('');

  document.getElementById('foods-card').innerHTML = `
    <div class="foods-card">
      <div class="food-power-card" style="border-left-color:${elColor}">
        <div class="food-power-icon">⚡</div>
        <div>
          <div class="food-power-label">${_t('Power Food · ' + dominantEl + ' Element', '核心食物 · ' + (EL_ZH[dominantEl] || dominantEl) + '元素', 'อาหารเสริมพลัง · ธาตุ' + (EL_TH[dominantEl] || dominantEl))}</div>
          <div class="food-power-name">${_t(foods.power, foods.power_zh)}</div>
          <div class="food-power-why">${_t(foods.powerWhy, foods.powerWhy_zh)}</div>
        </div>
      </div>
      <div class="food-section">
        <div class="food-section-label" style="color:${elColor}">${_t('↑ Eat More', '↑ 多吃')}</div>
        <div class="food-chips-row">${eatChips}</div>
      </div>
      <div class="food-section">
        <div class="food-section-label" style="color:#f87171">${_t('↓ Limit or Avoid', '↓ 少吃或避免')}</div>
        <div class="food-chips-row">${avoidChips}</div>
      </div>
    </div>
  `;
}

/* ── Render Crystals ── */
function renderCrystals(dominantEl) {
  const elColor = EL_COLOR[dominantEl];
  const stones = CRYSTALS[dominantEl];
  if (!stones) return;

  const cards = stones.map(s => `
    <div class="crystal-card" style="border-left-color:${elColor}">
      <div class="crystal-emoji">${s.emoji}</div>
      <div class="crystal-info">
        <div class="crystal-name">${_t(s.name)}</div>
        <div class="crystal-effect">${_t(s.effect, s.effect_zh)}</div>
        <div class="crystal-carry-badge">${_t('Carry', '携带')}: ${_t(s.carry, s.carry_zh)}</div>
      </div>
    </div>
  `).join('');

  document.getElementById('crystals-card').innerHTML = `
    <div class="crystals-card">${cards}</div>
  `;
}

/* ── Render Morning Ritual ── */
function renderMorningRitual(dominantEl) {
  const elColor = EL_COLOR[dominantEl];
  const steps = MORNING_RITUAL[dominantEl];
  if (!steps) return;

  const stepsHTML = steps.map(s => `
    <div class="ritual-step" style="border-left-color:${elColor}">
      <div class="ritual-step-num" style="color:${elColor}">${s.step}</div>
      <div class="ritual-step-body">
        <div class="ritual-step-icon">${s.icon}</div>
        <div class="ritual-step-title">${_t(s.title, s.title_zh)}</div>
        <div class="ritual-step-text">${_t(s.body, s.body_zh)}</div>
      </div>
    </div>
  `).join('');

  document.getElementById('ritual-card').innerHTML = `
    <div class="ritual-card">${stepsHTML}</div>
  `;
}

/* ── Render Kua / Sleep Direction ── */
function renderKuaSection(kua, dominantEl) {
  const kuaData = KUA_DIRS[kua] || KUA_DIRS[1];
  const elColor = EL_COLOR[dominantEl];
  const dirColor = kuaData.color;
  const angle = kuaData.angle;

  // Simple compass SVG with arrow
  const arrowX = 80 + 55 * Math.sin(angle * Math.PI / 180);
  const arrowY = 80 - 55 * Math.cos(angle * Math.PI / 180);

  const compassSvg = `
    <svg class="kua-compass-svg" viewBox="0 0 160 160">
      <circle cx="80" cy="80" r="72" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
      <circle cx="80" cy="80" r="50" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
      ${['N','NE','E','SE','S','SW','W','NW'].map((dir, i) => {
        const a = i * 45;
        const tx = 80 + 62 * Math.sin(a * Math.PI/180);
        const ty = 80 - 62 * Math.cos(a * Math.PI/180);
        const isMain = dir === kuaData.compass;
        return `<text x="${tx}" y="${ty}" text-anchor="middle" dominant-baseline="middle"
          font-size="${isMain ? 11 : 9}" font-weight="${isMain ? 800 : 400}"
          fill="${isMain ? dirColor : 'rgba(255,255,255,0.3)'}">${dir}</text>`;
      }).join('')}
      <line x1="80" y1="80" x2="${arrowX}" y2="${arrowY}" stroke="${dirColor}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="${arrowX}" cy="${arrowY}" r="6" fill="${dirColor}" opacity="0.9"/>
      <circle cx="80" cy="80" r="5" fill="rgba(255,255,255,0.15)" stroke="${dirColor}" stroke-width="1.5"/>
    </svg>
  `;

  document.getElementById('kua-card').innerHTML = `
    <div class="kua-card">
      <div class="kua-compass-wrap">
        ${compassSvg}
        <div class="kua-num-badge" style="color:${dirColor}">Kua ${kua}</div>
      </div>
      <div class="kua-info">
        <div class="kua-dir-name" style="color:${dirColor}">${_t(kuaData.dir + ' · ' + kuaData.zh, kuaData.zh, (window.WoBaziI18n && WoBaziI18n.lookup(kuaData.dir, 'th')) || kuaData.dir)}</div>
        <div class="kua-dir-label">${_t('Your optimal sleep direction', '你的最佳睡眠方向')}</div>
        <div class="kua-dir-desc">${_t(kuaData.desc, kuaData.desc_zh)}</div>
        <div class="kua-tip">${_t('Point the top of your head toward', '睡眠时头顶朝向')} <strong>${_t(kuaData.dir, kuaData.zh)}</strong>${_t(' when sleeping. Even approximate alignment activates this qi.', '。即使大致对齐也能激活此气场。', ' แม้หันไปใกล้เคียงทิศนี้ก็ช่วยกระตุ้นชี่ได้')}</div>
      </div>
    </div>
  `;
}

/* ── Render Luck Cycle 大运 ──
   Real 10-year luck pillars from the engine when gender is known (direction depends on it).
   Without gender, fall back to the element-theme life phases and ask for it. */
function renderLifeDecades(year, dominantEl, luck, month0, day) {
  const host = document.getElementById('decades-card');
  if (!host) return;
  if (luck && luck.pillars && luck.pillars.length) {
    renderLuckPillars(host, luck, year, month0, day);
    return;
  }
  const elColor = EL_COLOR[dominantEl];
  const themes = DECADE_THEMES[dominantEl] || DECADE_THEMES.Water;
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  const currentDecadeIdx = Math.min(Math.floor(age / 14), themes.length - 1);

  const blocks = themes.map((t, i) => {
    const startAge = i * 14;
    const endAge   = startAge + 13;
    const isCurrent = i === currentDecadeIdx;
    return `
      <div class="decade-block${isCurrent ? ' decade-current' : ''}" style="${isCurrent ? `border-color:${elColor};` : ''}">
        <div class="decade-emoji">${t.emoji}</div>
        <div class="decade-phase" style="${isCurrent ? `color:${elColor}` : ''}">${_t(t.phase, t.phase_zh)}</div>
        <div class="decade-age">${_t('Age', '年龄')} ${startAge}–${endAge}</div>
        ${isCurrent ? `<div class="decade-note">${_t(t.note, t.note_zh)}</div>` : ''}
      </div>
    `;
  }).join('');

  if (_shareData) {
    _shareData.luckPhase = themes[currentDecadeIdx].phase;
    window._shareData = _shareData;
  }
  host.innerHTML = `
    <div class="decades-card">
      <div class="decades-bar">${blocks}</div>
      <div class="decade-current-detail">
        <span style="color:${elColor}">${_t('You are in the', '你正处于', 'ตอนนี้คุณอยู่ในช่วง')} <strong>${_t(themes[currentDecadeIdx].phase, themes[currentDecadeIdx].phase_zh)}</strong> ${_t('phase', '阶段', 'ของชีวิต')}</span> (${_t('age','年龄', 'อายุ')} ~${currentDecadeIdx*14}–${currentDecadeIdx*14+13}).
        <span class="decade-note-text">${_t(themes[currentDecadeIdx].note, themes[currentDecadeIdx].note_zh)}</span>
        <span class="decade-note-text">${_t('Add your gender on the birth form to see your real 10-year luck pillars — their direction depends on it.', '在出生信息中填写性别，即可查看真实的十年大运（顺逆排取决于性别）。', 'ระบุเพศในฟอร์มวันเกิดเพื่อดูเสาโชค 10 ปีจริง (ทิศทางขึ้นกับเพศ)')}</span>
      </div>
    </div>
  `;
}

function renderLuckPillars(host, luck, year, month0, day) {
  const now = new Date();
  const birth = new Date(year, month0 || 0, day || 1);
  const age = Math.max(0, (now - birth) / (365.25 * 86400000));
  const current = BaziEngine.luckPillarAt(luck, age);
  const curIdx = current ? current.index : -1;
  const fmtAge = a => Math.floor(a);
  const startLabel = _t(
    `${luck.startYears} yrs ${luck.startMonths} mo`,
    `${luck.startYears}岁${luck.startMonths}个月`,
    `${luck.startYears} ปี ${luck.startMonths} เดือน`
  );

  const pre = `
    <div class="luck-block luck-pre${curIdx === -1 ? ' is-current' : ''}">
      <div class="luck-age">0–${fmtAge(luck.startAge)}</div>
      <div class="luck-chars luck-pre-mark">童限</div>
      <div class="luck-god">${_t('Before luck', '起运前', 'ก่อนเข้าวัยจร')}</div>
      <div class="luck-years">${year}</div>
    </div>`;
  const blocks = luck.pillars.map(p => {
    const isCur = p.index === curIdx;
    return `
      <div class="luck-block${isCur ? ' is-current' : ''}${p.startYear > now.getFullYear() ? ' is-future' : ''}"${isCur ? ' aria-current="true"' : ''}>
        <div class="luck-age">${fmtAge(p.ageFrom)}–${fmtAge(p.ageTo) - 1}</div>
        <div class="luck-chars">
          <span style="color:${EL_COLOR[p.stem.element]}">${p.stem.char}</span><span style="color:${EL_COLOR[p.branch.element]}">${p.branch.char}</span>
        </div>
        <div class="luck-god">${godLabel(p.stemGod)}</div>
        <div class="luck-years">${p.startYear}–${p.endYear - 1}</div>
      </div>`;
  }).join('');

  let detail;
  if (current) {
    const branchGod = current.branchGod ? godLabel(current.branchGod) : '';
    detail = `${_t('You are in', '当前大运', 'ตอนนี้อยู่ในวัยจร')} <strong>${current.stem.char}${current.branch.char}</strong>
      (${_t('age', '年龄', 'อายุ')} ${fmtAge(current.ageFrom)}–${fmtAge(current.ageTo) - 1}, ${current.startYear}–${current.endYear - 1}).
      <span class="decade-note-text">${_t('Stem', '天干', 'ก้าน')} ${current.stem.char} ${_t(current.stem.element, EL_ZH[current.stem.element], EL_TH[current.stem.element])}: ${godLabel(current.stemGod)}${branchGod ? ` · ${_t('Branch', '地支', 'กิ่ง')} ${current.branch.char} ${_t(current.branch.animal, ANIMAL_ZH[current.branch.animal], ANIMAL_TH[current.branch.animal])}: ${branchGod}` : ''}</span>`;
  } else {
    detail = _t(`Your first luck pillar starts at ${startLabel}.`, `${startLabel}起运。`, `วัยจรแรกเริ่มที่ ${startLabel}`);
  }
  const dirNote = _t(
    `Starts at ${startLabel} · runs ${luck.forward ? 'forward' : 'backward'} from the month pillar (${luck.jie}).`,
    `${startLabel}起运 · 由月柱${luck.forward ? '顺' : '逆'}排（${luck.jie}）。`,
    `เริ่มที่ ${startLabel} · นับ${luck.forward ? 'เดินหน้า' : 'ถอยหลัง'}จากเสาเดือน (${luck.jie})`
  );

  if (_shareData) {
    _shareData.luckPhase = current ? current.stem.char + current.branch.char : '';
    window._shareData = _shareData;
  }
  host.innerHTML = `
    <div class="decades-card">
      <div class="luck-bar">${pre}${blocks}</div>
      <p class="luck-dir">${dirNote}</p>
      <div class="decade-current-detail">${detail}</div>
    </div>`;
  const cur = host.querySelector('.luck-block.is-current');
  const bar = host.querySelector('.luck-bar');
  if (cur && bar) requestAnimationFrame(() => { bar.scrollLeft = Math.max(0, cur.offsetLeft - bar.clientWidth / 2 + cur.clientWidth / 2); });
}

/* ── Add TIPS entries for new sections ── */
const NEW_TIPS = {
  'outfit': {
    icon: '👗',
    title_en: 'Feng Shui Outfit Guide',
    title_zh: '风水穿搭',
    body_en: 'In feng shui, colors carry elemental qi. Wearing the monthly auspicious color surrounds you with resonant energy before you even say a word. Think of it as portable feng shui — your environment, on your body.',
    body_zh: '在风水学中，颜色承载五行之气。穿着当月吉祥色彩，等于随身携带风水，以共鸣能量环绕自身。',
    title_th: 'คู่มือการแต่งกายตามหลักฮวงจุ้ย',
    body_th: 'ในหลักฮวงจุ้ย สีมีชี่ของธาตุ การสวมสีมงคลประจำเดือนช่วยให้คุณอยู่ท่ามกลางพลังที่สอดคล้อง ก่อนที่คุณจะเอ่ยคำใดเสียอีก เปรียบเสมือนฮวงจุ้ยที่พกติดตัวไปได้',
  },
  'lucky-nums': {
    icon: '🔢',
    title_en: 'Lucky Numbers',
    title_zh: '幸运数字',
    body_en: 'Your personal numbers are derived from your birth date using numerological reduction, combined with your element\'s archetypal numbers from Chinese cosmology. Use them as apartment numbers, PIN patterns, or lottery picks.',
    body_zh: '您的幸运数字由生日数字归纳与五行宇宙论中的原型数字共同推算。可用于选择门牌、密码模式或彩票号码。',
    title_th: 'เลขมงคล',
    body_th: 'เลขประจำตัวของคุณคำนวณจากวันเกิดด้วยการทอนตัวเลข ร่วมกับเลขประจำธาตุตามจักรวาลวิทยาจีน สามารถใช้เลือกเลขที่พัก รูปแบบรหัส หรือเลขลอตเตอรี่',
  },
  'power-days': {
    icon: '📅',
    title_en: 'Power Days',
    title_zh: '吉日',
    body_en: 'Choose a category and what you are planning — pitching, signing, a first date, a move. Every date is scored against your own four pillars, starting at 50: its Chinese almanac officer (建除), harmony with your year and day animals, your Nobleman 天乙贵人 days, and whether its element is one your chart needs. The almanac lists which officers suit each undertaking. Days that clash your year animal (冲太岁) are always Avoid. Tap any date for its reasons.',
    body_zh: '先选类别和你要做的事——提案、签约、约会、搬家。每一天从 50 分起，按你的四柱打分：建除十二神、与你年支日支的合、天乙贵人日，以及当日五行是否为你所需。黄历写明各事宜取哪些日神。冲你生肖太岁的日子一律为忌。点任意日期看原因。',
    title_th: 'วันพลัง',
    body_th: 'เลือกหมวดหมู่และสิ่งที่คุณวางแผนจะทำ เช่น การนำเสนองาน การลงนามสัญญา การนัดพบครั้งแรก หรือการย้ายที่อยู่ ทุกวันเริ่มต้นที่ 50 คะแนนและประเมินจากสี่เสาของคุณ ได้แก่ เจ้าวันตามปฏิทินจีน (建除) ความเข้ากันกับนักษัตรปีและวันของคุณ วันกุ้ยเหริน 天乙贵人 และธาตุของวันที่ดวงของคุณต้องการหรือไม่ ปฏิทินจีนระบุว่าเจ้าวันใดเหมาะกับกิจแต่ละประเภท วันที่ชงนักษัตรปีเกิดของคุณ (冲太岁) ถือเป็นวันควรเลี่ยงเสมอ แตะวันที่ใดก็ได้เพื่อดูเหตุผล',
  },
  'foods': {
    icon: '🥗',
    title_en: 'Lucky Foods',
    title_zh: '饮食运势',
    body_en: 'In Traditional Chinese Medicine, food directly nourishes or depletes your elemental energy. Eating in alignment with your dominant element supports the organs that are most vital — and most vulnerable — for your type.',
    body_zh: '中医认为食物直接滋养或耗损五行能量。按照主导五行调整饮食，有助于支持你最重要也最脆弱的脏腑系统。',
    title_th: 'อาหารมงคล',
    body_th: 'ตามหลักการแพทย์แผนจีน อาหารช่วยบำรุงหรือบั่นทอนพลังธาตุของคุณโดยตรง การรับประทานอาหารให้สอดคล้องกับธาตุเด่นช่วยสนับสนุนอวัยวะที่สำคัญและเปราะบางที่สุดสำหรับคุณ',
  },
  'crystals': {
    icon: '💎',
    title_en: 'Crystals & Gems',
    title_zh: '水晶宝石',
    body_en: 'Each crystal carries a natural electromagnetic frequency that interacts with human bioelectricity. These recommendations pair your element\'s energy pattern with stones known to amplify, balance, or protect it — based on both Western crystal tradition and Chinese elemental resonance.',
    body_zh: '每种水晶都带有与人体生物电相互作用的自然电磁频率。这些推荐基于西方水晶传统与中国五行共鸣理论，为你的元素能量配对最佳宝石。',
    title_th: 'คริสตัลและอัญมณี',
    body_th: 'คริสตัลแต่ละชนิดเชื่อกันว่ามีความถี่ตามธรรมชาติที่มีปฏิสัมพันธ์กับพลังงานในร่างกาย คำแนะนำนี้จับคู่รูปแบบพลังของธาตุคุณกับหินที่เชื่อว่าช่วยเสริม สร้างสมดุล หรือปกป้องพลังนั้น โดยอ้างอิงทั้งความเชื่อเรื่องคริสตัลของตะวันตกและหลักธาตุของจีน',
  },
  'ritual': {
    icon: '🌅',
    title_en: 'Morning Ritual',
    title_zh: '元素晨练',
    body_en: 'The morning is when your qi is most malleable. These three steps are calibrated specifically to your element — they activate the organs, directions, and energy types that give your element maximum momentum for the day ahead.',
    body_zh: '清晨是气场最易塑造的时刻。这三个步骤专为您的五行定制，激活对应的脏腑、方位与能量类型，为新的一天充分蓄力。',
    title_th: 'กิจวัตรยามเช้า',
    body_th: 'ยามเช้าคือช่วงที่ชี่ของคุณปรับเปลี่ยนได้ง่ายที่สุด สามขั้นตอนนี้ออกแบบมาเฉพาะสำหรับธาตุของคุณ เพื่อกระตุ้นอวัยวะ ทิศทาง และรูปแบบพลังที่ช่วยให้ธาตุของคุณมีแรงส่งเต็มที่สำหรับวันนั้น',
  },
  'kua': {
    icon: '🧭',
    title_en: 'Sleep Direction (Kua)',
    title_zh: '卦数睡眠方向',
    body_en: 'Your Kua number is a personal feng shui number calculated from your birth year and gender. Aligning your sleeping position so your head points toward your Kua direction is one of the most powerful and effortless feng shui adjustments you can make.',
    body_zh: '卦数是根据出生年份与性别推算的个人风水数字。将头部朝向卦数方位入睡，是最有效且最省力的风水调整之一。',
    title_th: 'ทิศการนอน (Kua)',
    body_th: 'เลข Kua คือเลขฮวงจุ้ยประจำตัวที่คำนวณจากปีเกิดและเพศ การนอนโดยหันศีรษะไปทางทิศ Kua ของคุณเป็นการปรับฮวงจุ้ยที่ได้ผลดีและทำได้ง่ายที่สุดวิธีหนึ่ง',
  },
  'decades': {
    icon: '🕰️',
    title_en: 'Luck Cycle 大运',
    title_zh: '大运',
    body_en: '大运 (Dà Yùn) means "Major Luck Cycles" — the 10-year phases that color each chapter of life. Work with the climate of the decade, not against it.',
    body_zh: '大运是十年一程的气运周期，为人生各章着色。顺势，而不是硬顶。',
    title_th: 'รอบโชค 大运',
    body_th: '大运 (Dà Yùn) หมายถึง “รอบโชคใหญ่” คือช่วงสิบปีที่กำหนดบรรยากาศของแต่ละบทในชีวิต ควรดำเนินชีวิตให้สอดคล้องกับสภาพของทศวรรษนั้น ไม่ใช่ฝืนต้าน',
  },
};

// Merge new tips into TIPS
Object.assign(TIPS, NEW_TIPS);

/* ── Life Areas (Today tab) ── */
function renderLifeAreas(fortune, heroIsCompat, heroIsClash) {
  const el = document.getElementById('life-areas-grid');
  if (!el) return;
  const col = s => s >= 66 ? '#22c55e' : s >= 40 ? '#f0c040' : '#ef4444';
  const lbl = s => s >= 66 ? ['Strong','旺','แข็งแรง'] : s >= 40 ? ['Mixed','平','ปนกัน'] : ['Caution','弱','ระวัง'];
  const socialScore = heroIsCompat ? 80 : heroIsClash ? 30 : 60;
  const avg = Math.round((fortune.love + fortune.career + fortune.health + fortune.wealth) / 4);
  const riskScore = 100 - avg;
  const riskLbl = riskScore < 34 ? ['Low','低','ต่ำ'] : riskScore < 60 ? ['Medium','中','กลาง'] : ['High','高','สูง'];
  const areas = [
    { icon:'💼', en:'Work',   zh:'事业', th:'งาน',     s: fortune.career, l: lbl(fortune.career) },
    { icon:'💰', en:'Money',  zh:'财运', th:'เงิน',    s: fortune.wealth, l: lbl(fortune.wealth) },
    { icon:'❤️', en:'Love',   zh:'爱情', th:'ความรัก', s: fortune.love,   l: lbl(fortune.love)   },
    { icon:'🌐', en:'Social', zh:'社交', th:'สังคม',   s: socialScore,    l: lbl(socialScore)    },
    { icon:'🌿', en:'Energy', zh:'精力', th:'พลังงาน', s: fortune.health, l: lbl(fortune.health) },
    { icon:'⚡', en:'Risk',   zh:'风险', th:'ความเสี่ยง', s: riskScore,    l: riskLbl, inv: true  },
  ];
  el.innerHTML = areas.map(a => `
    <div class="life-area-tile">
      <div class="la-icon">${a.icon}</div>
      <div class="la-name">${_t(a.en, a.zh, a.th)}</div>
      <div class="la-status" style="color:${a.inv ? col(100 - a.s) : col(a.s)}">
        ${_t(a.l[0], a.l[1], a.l[2])}
      </div>
    </div>`).join('');
}

/* ── Insight Cards (Today tab) ── */
function renderInsightCards(todayMsg, fortune, dominantEl) {
  const el = document.getElementById('insight-cards');
  if (!el) return;
  const loveScore = fortune.love, careerScore = fortune.career;
  const loveTip = loveScore >= 66
    ? _t('Connections flow easily — a good time to reach out and deepen bonds.', '感情顺畅，适合主动联系、深化关系。', 'ความสัมพันธ์ไหลง่าย — เหมาะที่จะเอื้อมและลึกความผูกพัน')
    : loveScore >= 40
    ? _t('Keep expectations balanced — focus on understanding before action.', '保持平衡期望，行动前先寻求理解。', 'รักษาความคาดหวังให้สมดุล — เข้าใจก่อนลงมือ')
    : _t('Protect your emotional energy today — quality over quantity in social time.', '今日注意保护情感能量，社交质量优于数量。', 'ปกป้องพลังใจวันนี้ — คุณภาพกว่าปริมาณในสังคม');
  const workTip = careerScore >= 66
    ? _t('Career energy is high — take initiative and present bold ideas.', '事业运旺，主动出击，大胆提出想法。', 'พลังงานอาชีพสูง — ริเริ่มและเสนอไอเดียกล้า')
    : careerScore >= 40
    ? _t('Steady progress over bold moves — finish what is already in motion.', '稳扎稳打优于冒进，完成手头已有的工作。', 'คืบหน้ามั่นคงดีกว่าก้าวใหญ่ — ปิดงานที่กำลังทำ')
    : _t('Avoid major work decisions today — observe and gather information instead.', '今日避免重大工作决定，以观察与收集信息为主。', 'เลี่ยงตัดสินใจงานใหญ่วันนี้ — สังเกตและเก็บข้อมูลก่อน');
  const elTips = {
    Wood:  _t('Your Wood energy favors growth and collaboration — say yes to new connections.', '木气利于成长与合作，对新连接说是。', 'พลังไม้เอื้อการเติบโตและความร่วมมือ — รับการเชื่อมใหม่'),
    Fire:  _t('Your Fire energy brings charisma today — lead, inspire, and be visible.', '火气今日带来魅力，引领他人，展现自我。', 'พลังไฟนำเสน่ห์วันนี้ — นำ สร้างแรงบันดาลใจ และปรากฏตัว'),
    Earth: _t('Your Earth energy grounds you — trust your gut and support those around you.', '土气令你沉稳，相信直觉，支持身边的人。', 'พลังดินทำให้มั่น — เชื่อสัญชาตญาณและซัพพอร์ตคนรอบตัว'),
    Metal: _t('Your Metal energy sharpens focus today — ideal for precision and detail work.', '金气今日提升专注，适合精细与细节工作。', 'พลังโลหะคมโฟกัสวันนี้ — เหมาะกับงานละเอียด'),
    Water: _t('Your Water energy flows — adapt quickly and listen more than you speak.', '水气流动，迅速适应，多听少说。', 'พลังน้ำไหล — ปรับเร็ว และฟังมากกว่าพูด'),
  };
  const cards = [
    { icon:'🌅', text: todayMsg },
    { icon:'❤️', text: loveTip },
    { icon:'💼', text: workTip },
    { icon:'✨', text: elTips[dominantEl] || '' },
  ];
  el.innerHTML = cards.map(c => `
    <div class="insight-card">
      <span class="insight-icon">${c.icon}</span>
      <p class="insight-text">${c.text}</p>
    </div>`).join('');
}

/* ── Actions Preview Card (Today tab) ── */
function renderActionsPreview(heroDo, heroAvoidEn, heroAvoidZh, heroWatchEn, heroWatchZh) {
  const el = document.getElementById('actions-preview-list');
  if (!el) return;
  el.innerHTML = [
    { key:'DO',    key_zh:'做',  key_th:'ทำ',  en: heroDo.title, zh: heroDo.title_zh },
    { key:'AVOID', key_zh:'避',  key_th:'เลี่ยง', en: heroAvoidEn,  zh: heroAvoidZh     },
    { key:'WATCH', key_zh:'注意',key_th:'ระวัง', en: heroWatchEn,  zh: heroWatchZh     },
  ].map(item => `
    <div class="hc-bullet">
      <span class="hc-bullet-key">${_t(item.key, item.key_zh, item.key_th)}</span>
      <span>${_t(item.en, item.zh)}</span>
    </div>`).join('');
}

/* ── You tab hero: the year animal first (e.g. "Earth Horse"), with traits and chart basis ── */
function renderYouHero(animal, yearPillar, elColor) {
  const card = document.getElementById('you-hero-card');
  if (!card) return;
  const stem = yearPillar.stem;
  const zData = ZODIAC[animal] || { traits: [] };
  const emoji = BRANCHES.find(b => b.animal === animal)?.emoji || '✦';
  card.style.setProperty('--hero-el', elColor);
  document.getElementById('you-hero-glow').style.background =
    `radial-gradient(120% 90% at 85% 0%, ${elColor}55, transparent 60%), radial-gradient(90% 80% at 0% 100%, ${elColor}22, transparent 70%)`;
  document.getElementById('you-hero-gz').textContent = stem.char + yearPillar.branch.char;
  document.getElementById('you-hero-emoji').textContent = emoji;
  document.getElementById('you-hero-title').innerHTML =
    _t(`${stem.element} ${animal}`, `${EL_ZH[stem.element]}${ANIMAL_ZH[animal]}`, `${EL_TH[stem.element]} ${ANIMAL_TH[animal]}`);
  document.getElementById('you-hero-sub').innerHTML = _t(
    `${stem.polarity} ${stem.element} · Year of the ${animal}`,
    `${stem.polarity === 'Yang' ? '阳' : '阴'}${EL_ZH[stem.element]} · ${ANIMAL_ZH[animal]}年`,
    `${stem.polarity === 'Yang' ? 'หยาง' : 'หยิน'} ${EL_TH[stem.element]} · ปี${ANIMAL_TH[animal]}`
  );
  document.getElementById('you-hero-traits').innerHTML =
    (zData.traits || []).map(t => `<span class="you-hero-trait">${_t(t, TRAIT_ZH[t] || t)}</span>`).join('');
}

/* ═══════════════════════════════════════
   ORACLE AI CHAT
═══════════════════════════════════════ */
let _oracleHistory = [];   // conversation history for context
let _oracleSending = false;

/* ── Calculate today's full day pillar ── */
function calcTodayPillar() {
  const now = new Date();
  if (window.BaziEngine && BaziEngine.calcBaziAccurate) {
    const r = BaziEngine.calcBaziAccurate({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      hour: now.getHours(),
      minute: now.getMinutes(),
      calendar: 'solar',
    });
    const p = r.pillars[2];
    return { stem: p.stem, branch: p.branch, animal: p.branch.animal };
  }
  const y = now.getFullYear(), m = now.getMonth(), d = now.getDate();
  const ref = new Date(2000, 0, 7);
  const diffDays = Math.round((new Date(y, m, d) - ref) / 86400000);
  const cyclePos = ((diffDays % 60) + 60) % 60;
  const stemIdx = cyclePos % 10;
  const branchIdx = cyclePos % 12;
  return {
    stem: STEMS[stemIdx],
    branch: BRANCHES[branchIdx],
    animal: BRANCHES[branchIdx].animal,
  };
}

/* ── Nobleman check: today's branch compatible with user animal ── */
function isNoblemanDay(userAnimal, todayAnimal) {
  const z = ZODIAC[userAnimal];
  return z && z.compat.includes(todayAnimal);
}

/* ── Show Oracle screen ── */
function showOracle() {
  openOracleDrawer();
  return;
  // Legacy full-screen mode below (kept for reference)
  if (!_shareData || !_shareData.animal) {
    alert(_plainLoc({ en: 'Complete your BaZi profile first to unlock the Oracle', zh: '请先完善你的八字资料，以解锁神谕', th: 'กรุณากรอกข้อมูลปาจื้อของคุณให้ครบก่อน เพื่อปลดล็อกเทพพยากรณ์' }));
    return;
  }
  showScreen('oracle-chat');
  _oracleHistory = [];

  // Populate context bar
  const today = calcTodayPillar();
  const userAnimal = _shareData.animal;
  const zData = ZODIAC[userAnimal];
  const isClash = zData.clash.includes(today.animal);
  const isCompat = zData.compat.includes(today.animal);
  const nobleman = isNoblemanDay(userAnimal, today.animal);

  const score = dailyFortuneScore(isCompat, isClash);

  const clashColor = isClash ? '#ef4444' : isCompat ? '#22c55e' : '#f0c040';
  const clashLabel = isClash ? 'Clash' : isCompat ? 'Harmony' : 'Neutral';

  document.getElementById('oracle-ctx-bar').innerHTML = `
    <div class="oracle-ctx-pill">
      <span class="ctx-dot" style="background:${EL_COLOR[today.stem.element]}"></span>
      ${today.stem.char}${today.branch.char} ${_t(today.animal + ' Day', (ANIMAL_ZH[today.animal] || '') + '日', 'วัน' + (ANIMAL_TH[today.animal] || today.animal))}
    </div>
    <div class="oracle-ctx-pill">
      <span class="ctx-dot" style="background:${clashColor}"></span>
      ${_t(clashLabel)}
    </div>
    <div class="oracle-ctx-pill">
      ${_t('Force', '气势', 'พลัง')} ${score}
    </div>
    <div class="oracle-ctx-pill" style="${nobleman ? 'color:var(--gold);border-color:rgba(240,192,64,0.3)' : ''}">
      ${nobleman ? _t('✦ Nobleman', '✦ 贵人日', '✦ วันกุ้ยเหริน') : _t('No Nobleman', '无贵人', 'ไม่มีกุ้ยเหริน')}
    </div>
  `;

  // Store today data for API calls
  _oracleTodayData = { stem: today.stem.char, branch: today.branch.char, animal: today.animal, isClash, isCompat, score, nobleman };

  // Reset messages
  document.getElementById('oracle-messages').innerHTML = `
    <div class="oracle-welcome">
      <span class="oracle-welcome-icon">✦</span>
      <p class="en">I see your chart. Ask me anything about your destiny, timing, or path forward.</p>
      <p class="zh hide">我已看到你的命盘。尽管问我关于命运、时机或前路的任何问题。</p>
    </div>`;
  document.getElementById('oracle-chips').classList.remove('hide');
  document.getElementById('oracle-input').value = '';
}

let _oracleTodayData = null;
/* Solar birth data so the Oracle can place today inside the user's 10-year luck pillar. */
function oracleBirth() {
  const p = getStoredChart();
  if (!p || !p.year) return null;
  return { year: p.year, month: p.month, day: p.day, hour: p.hour, minute: p.minute, gender: p.gender, twin: p.twin || null };
}

/* ── Send chip question ── */
function sendOracleChip(btn) {
  const msg = btn.textContent.trim();
  document.getElementById('oracle-input').value = msg;
  sendOracleMessage();
}

/* ── Rate limit check (client-side) ── */
function checkOracleRateLimit() {
  const today = new Date().toISOString().slice(0, 10);
  const stored = localStorage.getItem('wobazi_oracle_date');
  if (stored !== today) {
    localStorage.setItem('wobazi_oracle_date', today);
    localStorage.setItem('wobazi_oracle_count', '0');
  }
  const count = parseInt(localStorage.getItem('wobazi_oracle_count') || '0', 10);
  return count < 10;
}

function incrementOracleCount() {
  const count = parseInt(localStorage.getItem('wobazi_oracle_count') || '0', 10);
  localStorage.setItem('wobazi_oracle_count', String(count + 1));
}

/* ── Parse verdict + date tags from response ── */
function parseOracleResponse(text) {
  // Extract and replace verdict tags
  let html = text;
  html = html.replace(/\[VERDICT:favorable\]/gi,
    '<div class="oracle-verdict-badge oracle-verdict-favorable">✦ Favorable conditions</div>');
  html = html.replace(/\[VERDICT:defer\]/gi,
    '<div class="oracle-verdict-badge oracle-verdict-defer">◇ Defer if possible</div>');
  html = html.replace(/\[VERDICT:neutral\]/gi,
    '<div class="oracle-verdict-badge oracle-verdict-neutral">— Neutral — timing is secondary</div>');

  // Extract and replace date tags
  html = html.replace(/\[DATE:(\d{4}-\d{2}-\d{2})\]/g, (_, dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    const label = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    return `<span class="oracle-date-pill">${label}</span>`;
  });

  return html;
}

/* ── Send message ── */
async function sendOracleMessage() {
  if (_oracleSending) return;
  const input = document.getElementById('oracle-input');
  const msg = input.value.trim();
  if (!msg) return;
  track('oracle_question', { surface: 'tab' });

  // Rate limit
  if (!checkOracleRateLimit()) {
    const messagesEl = document.getElementById('oracle-messages');
    messagesEl.insertAdjacentHTML('beforeend',
      `<div class="oracle-limit-msg">You've reached your daily Oracle limit (10 questions). Return tomorrow for fresh guidance.</div>`);
    messagesEl.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
    return;
  }

  _oracleSending = true;
  input.value = '';
  input.style.height = 'auto';

  // Hide chips after first message
  document.getElementById('oracle-chips').classList.add('hide');

  const messagesEl = document.getElementById('oracle-messages');

  // Add user bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'oracle-msg oracle-msg-user';
  userBubble.textContent = msg;
  messagesEl.appendChild(userBubble);

  // Add typing indicator
  const typingEl = document.createElement('div');
  typingEl.className = 'oracle-typing';
  typingEl.innerHTML = '<div class="oracle-typing-dot"></div><div class="oracle-typing-dot"></div><div class="oracle-typing-dot"></div>';
  messagesEl.appendChild(typingEl);
  typingEl.scrollIntoView({ behavior: 'smooth', block: 'end' });

  // Build chart data for API
  const chartData = {
    animal: _shareData.animal,
    element: _shareData.element,
    polarity: _shareData.polarity,
    dominantEl: _shareData.dominantEl,
    fortune: _shareData.fortune,
    pillars: _shareData.pillars || null,
    tenGods: _shareData.tenGods || null,
    today: _oracleTodayData,
    birth: oracleBirth(),
  };

  try {
    const response = await fetch('/api/oracle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: msg,
        chartData,
        conversationHistory: _oracleHistory,
      }),
    });

    if (response.status === 429) {
      typingEl.remove();
      const data = await response.json();
      messagesEl.insertAdjacentHTML('beforeend',
        `<div class="oracle-limit-msg">${data.error}</div>`);
      messagesEl.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
      _oracleSending = false;
      return;
    }

    // Create oracle response bubble
    const oracleBubble = document.createElement('div');
    oracleBubble.className = 'oracle-msg oracle-msg-oracle';
    oracleBubble.textContent = '';

    let fullText = '';
    let firstToken = true;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep incomplete line

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const payload = line.slice(6);
        if (payload === '[DONE]') continue;

        try {
          const data = JSON.parse(payload);
          if (data.error) {
            typingEl.remove();
            messagesEl.insertAdjacentHTML('beforeend',
              `<div class="oracle-error-msg">${_t(data.error)}</div>`);
            messagesEl.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
            _oracleSending = false;
            return;
          }
          if (data.token) {
            if (firstToken) {
              typingEl.remove();
              messagesEl.appendChild(oracleBubble);
              firstToken = false;
            }
            fullText += data.token;
            oracleBubble.innerHTML = parseOracleResponse(fullText);
            oracleBubble.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        } catch (e) { /* skip malformed JSON */ }
      }
    }

    // If no tokens were received
    if (firstToken) {
      typingEl.remove();
      messagesEl.insertAdjacentHTML('beforeend',
        `<div class="oracle-error-msg">The Oracle is temporarily unavailable — try again in a moment.</div>`);
      messagesEl.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } else {
      // Store in history
      _oracleHistory.push({ role: 'user', content: msg });
      _oracleHistory.push({ role: 'assistant', content: fullText });
      incrementOracleCount();
    }
  } catch (err) {
    console.error('[Oracle fetch error]', err);
    typingEl.remove();
    messagesEl.insertAdjacentHTML('beforeend',
      `<div class="oracle-error-msg">The Oracle is temporarily unavailable — try again in a moment.</div>`);
    messagesEl.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  _oracleSending = false;
}

/* ═══════════════════════════════════════
   GOOGLE AUTH & DATA PERSISTENCE
═══════════════════════════════════════ */
function loginWithGoogle() {
  track('login', { method: 'Google' });
  window.location.href = '/auth/google';
}

function logout() {
  window.location.href = '/auth/logout';
}

async function checkAuth() {
  try {
    const res = await fetch('/api/me');
    const data = await res.json();
    if (data.user) {
      _currentUser = data.user;
      await loadUserData();
      if (window.WobaziPortal) WobaziPortal.onAuth();
      updateLandingCtas();
      const h = currentHash();
      if (RESULT_TABS.indexOf(h) >= 0 || h === 'input') applyRoute(h);
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('auth')) {
        const keepHash = location.hash || '';
        window.history.replaceState({ wobazi: currentHash() || 'landing' }, '', window.location.pathname + keepHash);
      }
    }
  } catch (e) { /* guest mode — file:// or server down, continue as guest */ }
}

async function loadUserData() {
  try {
    const res = await fetch('/api/my-data');
    const data = await res.json();
    if (data.reading) {
      _savedReading = data.reading;
      const r = data.reading;
      const local = getStoredChart() || {};
      const same = local.year === r.year && local.month === r.month && local.day === r.day && local.hour === r.hour;
      saveLocalChart({
        name: r.name,
        year: r.year, month: r.month, day: r.day, hour: r.hour,
        minute: r.minute != null ? r.minute : (local.minute || 0),
        birthplace: r.birthplace,
        bloodType: r.blood_type,
        gender: r.gender,
        calendarType: r.calendar_type || local.calendarType || 'solar',
        leapMonth: !!r.leap_month,
        lunarYear: r.lunar_year, lunarMonth: r.lunar_month, lunarDay: r.lunar_day,
        twin: twinFromRow(r),
        monthlyForecasts: same ? local.monthlyForecasts : local.monthlyForecasts,
      });
    }
    // Restore Oracle chat history if available
    if (data.chat && data.chat.length > 0) {
      _oracleHistory = data.chat;
    }
  } catch (e) { /* no saved data */ }
}

async function loadSavedReading() {
  if (!_savedReading && _currentUser) await loadUserData();
  continueReading();
}

/* ── Save reading after form submit (if logged in) ── */
const _origHandleSubmit = handleSubmit;
handleSubmit = function(e) {
  _origHandleSubmit(e);
  if (_currentUser) {
    const p = collectBirthPayload();
    if (!p) return;
    fetch('/api/save-reading', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: p.name, year: p.year, month: p.month, day: p.day, hour: p.hour,
        minute: p.minute, birthplace: p.birthplace, bloodType: p.bloodType, gender: p.gender,
        calendarType: p.calendarType, leapMonth: p.leapMonth,
        lunarYear: p.lunarYear, lunarMonth: p.lunarMonth, lunarDay: p.lunarDay,
        twin: !!p.twin, twinOrder: p.twin ? p.twin.order : null, twinMethod: p.twin ? p.twin.method : null,
      }),
    }).catch(() => {});
  }
};

/* ── Save Oracle chat when leaving oracle screen ── */
const _origShowScreen = showScreen;
showScreen = function(id) {
  // If leaving oracle chat and logged in, save conversation
  const wasOracle = document.querySelector('#oracle-chat.screen.active');
  if (wasOracle && _currentUser && _oracleHistory.length > 0) {
    fetch('/api/save-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: _oracleHistory }),
    }).catch(() => {});
  }
  _origShowScreen(id);
};

/* ═══════════════════════════════════════
   ORACLE DRAWER
═══════════════════════════════════════ */
let _drawerOracleHistory = [];
let _drawerOracleSending = false;
let _drawerOracleTodayData = null;

function openOracleDrawer() {
  if (!_shareData || !_shareData.animal) {
    alert(_plainLoc({ en: 'Complete your BaZi profile first to unlock the Oracle', zh: '请先完善你的八字资料，以解锁神谕', th: 'กรุณากรอกข้อมูลปาจื้อของคุณให้ครบก่อน เพื่อปลดล็อกเทพพยากรณ์' }));
    return;
  }

  const backdrop = document.getElementById('oracle-drawer-backdrop');
  const drawer = document.getElementById('oracle-drawer');
  backdrop.classList.remove('hide');
  drawer.classList.remove('hide');
  // Force layout before adding show class for CSS transition
  void drawer.offsetHeight;
  backdrop.classList.add('show');
  drawer.classList.add('show');

  // Populate context bar
  const today = calcTodayPillar();
  const userAnimal = _shareData.animal;
  const zData = ZODIAC[userAnimal];
  const isClash = zData.clash.includes(today.animal);
  const isCompat = zData.compat.includes(today.animal);
  const nobleman = isNoblemanDay(userAnimal, today.animal);

  const score = dailyFortuneScore(isCompat, isClash);

  const clashColor = isClash ? '#ef4444' : isCompat ? '#22c55e' : '#f0c040';
  const clashLabel = isClash ? 'Clash' : isCompat ? 'Harmony' : 'Neutral';

  document.getElementById('oracle-drawer-ctx').innerHTML = `
    <div class="oracle-ctx-pill">
      <span class="ctx-dot" style="background:${EL_COLOR[today.stem.element]}"></span>
      ${today.stem.char}${today.branch.char} ${_t(today.animal + ' Day', (ANIMAL_ZH[today.animal] || '') + '日', 'วัน' + (ANIMAL_TH[today.animal] || today.animal))}
    </div>
    <div class="oracle-ctx-pill">
      <span class="ctx-dot" style="background:${clashColor}"></span>
      ${_t(clashLabel)}
    </div>
    <div class="oracle-ctx-pill">${_t('Force', '气势', 'พลัง')} ${score}</div>
    <div class="oracle-ctx-pill" style="${nobleman ? 'color:var(--gold);border-color:rgba(240,192,64,0.3)' : ''}">
      ${nobleman ? _t('✦ Nobleman', '✦ 贵人日', '✦ วันกุ้ยเหริน') : _t('No Nobleman', '无贵人', 'ไม่มีกุ้ยเหริน')}
    </div>
  `;

  _drawerOracleTodayData = { stem: today.stem.char, branch: today.branch.char, animal: today.animal, isClash, isCompat, score, nobleman };
}

function closeOracleDrawer() {
  const backdrop = document.getElementById('oracle-drawer-backdrop');
  const drawer = document.getElementById('oracle-drawer');
  backdrop.classList.remove('show');
  drawer.classList.remove('show');
  setTimeout(() => {
    backdrop.classList.add('hide');
    drawer.classList.add('hide');
  }, 350);
}

function sendOracleChipDrawer(btn) {
  const msg = btn.textContent.trim();
  document.getElementById('oracle-drawer-input').value = msg;
  sendOracleDrawerMessage();
}

async function sendOracleDrawerMessage() {
  if (_drawerOracleSending) return;
  const input = document.getElementById('oracle-drawer-input');
  const msg = input.value.trim();
  if (!msg) return;
  track('oracle_question', { surface: 'drawer' });

  if (!checkOracleRateLimit()) {
    const messagesEl = document.getElementById('oracle-drawer-messages');
    messagesEl.insertAdjacentHTML('beforeend',
      `<div class="oracle-limit-msg">You've reached your daily Oracle limit (10 questions). Return tomorrow for fresh guidance.</div>`);
    messagesEl.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
    return;
  }

  _drawerOracleSending = true;
  input.value = '';
  input.style.height = 'auto';

  document.getElementById('oracle-drawer-chips').classList.add('hide');

  const messagesEl = document.getElementById('oracle-drawer-messages');

  const userBubble = document.createElement('div');
  userBubble.className = 'oracle-msg oracle-msg-user';
  userBubble.textContent = msg;
  messagesEl.appendChild(userBubble);

  const typingEl = document.createElement('div');
  typingEl.className = 'oracle-typing';
  typingEl.innerHTML = '<div class="oracle-typing-dot"></div><div class="oracle-typing-dot"></div><div class="oracle-typing-dot"></div>';
  messagesEl.appendChild(typingEl);
  typingEl.scrollIntoView({ behavior: 'smooth', block: 'end' });

  const chartData = {
    animal: _shareData.animal,
    element: _shareData.element,
    polarity: _shareData.polarity,
    dominantEl: _shareData.dominantEl,
    fortune: _shareData.fortune,
    pillars: _shareData.pillars || null,
    tenGods: _shareData.tenGods || null,
    today: _drawerOracleTodayData,
    birth: oracleBirth(),
  };

  try {
    const response = await fetch('/api/oracle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: msg,
        chartData,
        conversationHistory: _drawerOracleHistory,
      }),
    });

    if (response.status === 429) {
      typingEl.remove();
      const data = await response.json();
      messagesEl.insertAdjacentHTML('beforeend',
        `<div class="oracle-limit-msg">${data.error}</div>`);
      messagesEl.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
      _drawerOracleSending = false;
      return;
    }

    const oracleBubble = document.createElement('div');
    oracleBubble.className = 'oracle-msg oracle-msg-oracle';
    oracleBubble.textContent = '';

    let fullText = '';
    let firstToken = true;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const payload = line.slice(6);
        if (payload === '[DONE]') continue;

        try {
          const data = JSON.parse(payload);
          if (data.error) {
            typingEl.remove();
            messagesEl.insertAdjacentHTML('beforeend',
              `<div class="oracle-error-msg">${_t(data.error)}</div>`);
            messagesEl.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
            _drawerOracleSending = false;
            return;
          }
          if (data.token) {
            if (firstToken) {
              typingEl.remove();
              messagesEl.appendChild(oracleBubble);
              firstToken = false;
            }
            fullText += data.token;
            oracleBubble.innerHTML = parseOracleResponse(fullText);
            oracleBubble.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        } catch (e) { /* skip */ }
      }
    }

    if (firstToken) {
      typingEl.remove();
      messagesEl.insertAdjacentHTML('beforeend',
        `<div class="oracle-error-msg">The Oracle is temporarily unavailable — try again in a moment.</div>`);
      messagesEl.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } else {
      _drawerOracleHistory.push({ role: 'user', content: msg });
      _drawerOracleHistory.push({ role: 'assistant', content: fullText });
      incrementOracleCount();
    }
  } catch (err) {
    console.error('[Oracle drawer fetch error]', err);
    typingEl.remove();
    messagesEl.insertAdjacentHTML('beforeend',
      `<div class="oracle-error-msg">The Oracle is temporarily unavailable — try again in a moment.</div>`);
    messagesEl.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  _drawerOracleSending = false;
}

/* ═══════════════════════════════════════
   COMPATIBILITY CHECK (Relationships tab)
═══════════════════════════════════════ */
/* ── Relationship Profile Data (10 Day Stems) ── */
const REL_PROFILE = {
  'Wood_Yang':  { title: 'The Protector', title_zh: '守护者', emoji: '🌳', traits: ['Loyal','Direct','Principled'], traits_zh: ['忠诚','直接','有原则'], love: 'Acts of service — shows love through doing', love_zh: '以行动表达爱', blind: 'Can be controlling or rigid about how things should be', blind_zh: '可能过于控制或固执' },
  'Wood_Yin':   { title: 'The Diplomat', title_zh: '外交家', emoji: '🌿', traits: ['Gentle','Adaptable','Intuitive'], traits_zh: ['温柔','适应力强','直觉敏锐'], love: 'Quality time — thrives on presence and attention', love_zh: '以陪伴表达爱', blind: 'Avoids conflict to a fault, may suppress real feelings', blind_zh: '回避冲突，可能压抑真实感受' },
  'Fire_Yang':  { title: 'The Spark', title_zh: '火花', emoji: '☀️', traits: ['Passionate','Generous','Magnetic'], traits_zh: ['热情','慷慨','有魅力'], love: 'Grand gestures — loves visibly and openly', love_zh: '以大方式表达爱', blind: 'Burns bright then fades — can lose interest quickly', blind_zh: '热情来得快去得也快' },
  'Fire_Yin':   { title: 'The Candle', title_zh: '烛光', emoji: '🕯️', traits: ['Intense','Focused','Deeply romantic'], traits_zh: ['深沉','专注','极致浪漫'], love: 'Words of affirmation — articulate and emotionally present', love_zh: '以言语表达爱', blind: 'Perfectionism in relationships — impossible standards', blind_zh: '对感情追求完美，标准过高' },
  'Earth_Yang': { title: 'The Foundation', title_zh: '基石', emoji: '⛰️', traits: ['Steady','Reliable','Patient'], traits_zh: ['稳重','可靠','耐心'], love: 'Physical comfort — creates safety and stability', love_zh: '以稳定和安全感表达爱', blind: 'Slow to open up — partner may feel shut out', blind_zh: '不轻易敞开心扉' },
  'Earth_Yin':  { title: 'The Nurturer', title_zh: '养育者', emoji: '🌾', traits: ['Caring','Selfless','Grounded'], traits_zh: ['关爱','无私','踏实'], love: 'Caretaking — anticipates needs before being asked', love_zh: '以照顾表达爱', blind: 'Self-sacrificing to the point of resentment', blind_zh: '过度牺牲自我' },
  'Metal_Yang': { title: 'The Knight', title_zh: '骑士', emoji: '⚔️', traits: ['Principled','Protective','Decisive'], traits_zh: ['有原则','保护欲强','果断'], love: 'Protection — fiercely loyal and dependable', love_zh: '以守护表达爱', blind: 'Emotionally guarded — struggles with vulnerability', blind_zh: '情感上设有防线' },
  'Metal_Yin':  { title: 'The Jewel', title_zh: '珠宝', emoji: '💎', traits: ['Refined','Sensitive','Discerning'], traits_zh: ['精致','敏感','有品味'], love: 'Gifts and beauty — shows love through elegance', love_zh: '以美好事物表达爱', blind: 'High standards can make partners feel inadequate', blind_zh: '高标准可能让伴侣感到不足' },
  'Water_Yang': { title: 'The Explorer', title_zh: '探索者', emoji: '🌊', traits: ['Free-spirited','Exciting','Ambitious'], traits_zh: ['自由','刺激','有抱负'], love: 'Adventure — bonds through shared experiences', love_zh: '以共同冒险表达爱', blind: 'Commitment-wary — freedom feels more important than settling', blind_zh: '对承诺犹豫不决' },
  'Water_Yin':  { title: 'The Mystic', title_zh: '神秘者', emoji: '🌙', traits: ['Intuitive','Deep','Emotionally complex'], traits_zh: ['直觉强','深沉','情感复杂'], love: 'Emotional depth — craves soul-level connection', love_zh: '以灵魂深处的连接表达爱', blind: 'Secretive — partner may never fully know them', blind_zh: '神秘感强，伴侣难以完全了解' },
};

/* ── Secret Friends (Six Harmonies 六合) ── */
const SECRET_FRIENDS = {
  Rat: 'Ox', Ox: 'Rat', Tiger: 'Pig', Pig: 'Tiger',
  Rabbit: 'Dog', Dog: 'Rabbit', Dragon: 'Rooster', Rooster: 'Dragon',
  Snake: 'Monkey', Monkey: 'Snake', Horse: 'Goat', Goat: 'Horse',
};

/* ── Three Harmony Trios (三合) ── */
const HARMONY_TRIOS = {
  Water: ['Rat', 'Dragon', 'Monkey'],
  Wood:  ['Rabbit', 'Goat', 'Pig'],
  Fire:  ['Tiger', 'Horse', 'Dog'],
  Metal: ['Snake', 'Rooster', 'Ox'],
};

/* ── Five Element Business Dynamics ── */
const ELEMENT_PRODUCES = { Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood' };
const ELEMENT_PRODUCED_BY = { Fire: 'Wood', Earth: 'Fire', Metal: 'Earth', Water: 'Metal', Wood: 'Water' };
const ELEMENT_CONTROLS = { Wood: 'Earth', Fire: 'Metal', Earth: 'Water', Metal: 'Wood', Water: 'Fire' };
const ELEMENT_CONTROLLED_BY = { Earth: 'Wood', Metal: 'Fire', Water: 'Earth', Wood: 'Metal', Fire: 'Water' };

const BIZ_ADVICE = {
  Wood: { icon: '🌿', role: 'The Strategist', role_zh: '战略家', note: 'Vision, growth, expansion', note_zh: '远见、成长、扩展' },
  Fire: { icon: '🔥', role: 'The Motivator', role_zh: '推动者', note: 'Marketing, leadership, energy', note_zh: '营销、领导力、能量' },
  Earth: { icon: '🏔️', role: 'The Stabilizer', role_zh: '稳定者', note: 'Operations, trust, systems', note_zh: '运营、信任、系统' },
  Metal: { icon: '⚙️', role: 'The Executor', role_zh: '执行者', note: 'Precision, quality, structure', note_zh: '精确、质量、结构' },
  Water: { icon: '💧', role: 'The Networker', role_zh: '连接者', note: 'Sales, adaptability, flow', note_zh: '销售、适应力、流通' },
};

/* ── Render Relationship Profile ── */
function renderRelProfile(animal, yearPillar, dayPillar, dominantEl) {
  const el = document.getElementById('rel-profile-card');
  if (!el || !dayPillar?.known) return;
  const key = `${dayPillar.stem.element}_${dayPillar.stem.polarity}`;
  const p = REL_PROFILE[key];
  if (!p) return;
  const elColor = EL_COLOR[dayPillar.stem.element];

  el.innerHTML = `
    <div class="rel-profile-wrap" style="border-left:3px solid ${elColor}">
      <div class="rel-profile-top">
        <span class="rel-profile-emoji">${p.emoji}</span>
        <div>
          <div class="rel-profile-title">${_t(p.title, p.title_zh)}</div>
          <div class="rel-profile-sub">${dayPillar.stem.char} ${_t(`${dayPillar.stem.polarity} ${dayPillar.stem.element}`, (dayPillar.stem.polarity === 'Yang' ? '阳' : '阴') + (EL_ZH[dayPillar.stem.element] || ''), `${EL_TH[dayPillar.stem.element] || dayPillar.stem.element}${dayPillar.stem.polarity === 'Yang' ? 'หยาง' : 'หยิน'}`)} · ${_t('Day Stem', '日主')}</div>
        </div>
      </div>
      <div class="rel-profile-traits">
        ${p.traits.map((t, i) => `<span class="rel-profile-trait">${_t(t, p.traits_zh[i])}</span>`).join('')}
      </div>
      <div class="rel-profile-section">
        <div class="rel-profile-label">${_t('LOVE LANGUAGE', '爱的语言')}</div>
        <div class="rel-profile-text">${_t(p.love, p.love_zh)}</div>
      </div>
      <div class="rel-profile-section">
        <div class="rel-profile-label">${_t('BLIND SPOT', '盲点')}</div>
        <div class="rel-profile-text">${_t(p.blind, p.blind_zh)}</div>
      </div>
    </div>`;
}

/* ── Render Soul Animals ── */
function renderSoulAnimals(animal) {
  const el = document.getElementById('soul-animals-card');
  if (!el) return;

  const secretFriend = SECRET_FRIENDS[animal];
  const sfEmoji = BRANCHES.find(b => b.animal === secretFriend)?.emoji || '';
  const sfElement = BRANCHES.find(b => b.animal === secretFriend)?.element || '';

  // Find which trio the user belongs to
  let trioElement = null, trioMembers = [];
  for (const [elName, members] of Object.entries(HARMONY_TRIOS)) {
    if (members.includes(animal)) {
      trioElement = elName;
      trioMembers = members.filter(a => a !== animal);
      break;
    }
  }

  const yrsStr = (a) => getAnimalYears(a).slice(-5).join(' · ');

  const trioCards = trioMembers.map(a => {
    const emoji = BRANCHES.find(b => b.animal === a)?.emoji || '';
    const aEl = BRANCHES.find(b => b.animal === a)?.element || '';
    return `<div class="soul-card">
      <span class="soul-emoji">${emoji}</span>
      <div class="soul-info">
        <span class="soul-name">${_t(a, ANIMAL_ZH[a])}<span class="soul-tag" style="color:${EL_COLOR[aEl]}">${_t(aEl, EL_ZH[aEl], EL_TH[aEl])}</span></span>
        <div class="soul-years">${yrsStr(a)}</div>
        <div class="soul-note">${_t(`${trioElement} Trio ally — amplifies your ${trioElement.toLowerCase()} energy when together`, `${EL_ZH[trioElement]}三合 — 与你在一起时增强${EL_ZH[trioElement]}能量`, `พันธมิตรกลุ่มสามประสานธาตุ${EL_TH[trioElement]} — ช่วยเสริมพลังธาตุ${EL_TH[trioElement]}ของคุณเมื่ออยู่ด้วยกัน`)}</div>
      </div>
    </div>`;
  }).join('');

  el.innerHTML = `<div class="soul-grid">
    <div class="soul-card" style="border-color:${EL_COLOR[sfElement]}44">
      <span class="soul-emoji">${sfEmoji}</span>
      <div class="soul-info">
        <span class="soul-name">${_t(secretFriend, ANIMAL_ZH[secretFriend])}<span class="soul-tag" style="color:var(--gold)">${_t('SECRET FRIEND', '暗合')}</span></span>
        <div class="soul-years">${yrsStr(secretFriend)}</div>
        <div class="soul-note">${_t(`Your hidden ally — a deep, intuitive bond. ${animal} and ${secretFriend} form one of the Six Harmonies.`, `你的隐秘盟友 — 深层直觉联系。${ANIMAL_ZH[animal]}与${ANIMAL_ZH[secretFriend]}组成六合之一。`, `พันธมิตรที่ซ่อนอยู่ของคุณ — ความผูกพันที่ลึกซึ้งและเข้าใจกันโดยสัญชาตญาณ ${ANIMAL_TH[animal]}และ${ANIMAL_TH[secretFriend]}เป็นหนึ่งในคู่หกประสาน (六合)`)}</div>
      </div>
    </div>
    ${trioCards}
  </div>`;
}

/* ── Render Business Compatibility ── */
function renderBusinessCompat(animal, dominantEl, elements) {
  const el = document.getElementById('business-compat-card');
  if (!el) return;

  const produces = ELEMENT_PRODUCES[dominantEl];
  const producedBy = ELEMENT_PRODUCED_BY[dominantEl];
  const controls = ELEMENT_CONTROLS[dominantEl];
  const controlledBy = ELEMENT_CONTROLLED_BY[dominantEl];

  const bizCard = (elName, relationship, relZh, relTh) => {
    const b = BIZ_ADVICE[elName];
    return `<div class="biz-card">
      <div class="biz-el-icon" style="color:${EL_COLOR[elName]}">${b.icon} ${_t(EL_ZH[elName], EL_ZH[elName])}</div>
      <div class="biz-el-name">${_t(b.role, b.role_zh)}</div>
      <div class="biz-el-note">${_t(relationship, relZh, relTh)}</div>
    </div>`;
  };

  const relKey = {
    combine: { en: 'Combine 合', zh: '合', th: 'ประสาน · 合' },
    clash: { en: 'Crash 冲', zh: '冲', th: 'ชง · 冲' },
    harm: { en: 'Harm 害', zh: '害', th: 'ทำร้าย · 害' },
    punish: { en: 'Punishment 刑', zh: '刑', th: 'ลงโทษ · 刑' },
    harmony: { en: 'Harmony 三合', zh: '三合', th: 'สามประสาน · 三合' },
    same: { en: 'Same branch', zh: '同支', th: 'กิ่งเดียวกัน' },
    neutral: { en: 'Neutral', zh: '中性', th: 'กลาง' },
  };
  const pairNote = _lastPartner && _lastPartner.pillars && window.BaziEngine && BaziEngine.pairBranchRelations
    ? BaziEngine.pairBranchRelations(_shareData && _shareData.pillars ? _shareData.pillars : [], _lastPartner.pillars)
    : [];
  const pairHtml = pairNote.length ? `
    <div class="biz-section-label">${_t('FOUR-PILLAR ANIMALS', '四柱生肖', 'สัตว์สี่เสา')}</div>
    <div class="biz-branch-list">${pairNote.map(r => {
      const lab = relKey[r.relation] || relKey.neutral;
      return `<div class="biz-branch-row"><span>${_t(r.pillar)}</span><span>${r.a.emoji} ${_t(r.a.animal, ANIMAL_ZH[r.a.animal])} · ${r.b.emoji} ${_t(r.b.animal, ANIMAL_ZH[r.b.animal])}</span><strong>${_t(lab.en, lab.zh, lab.th)}</strong></div>`;
    }).join('')}</div>
    <p class="biz-climate">${_t('Read length as climate, not an expiry date. Combine and Harmony thicken the weather; Crash and Punishment are storm cells you plan around.', '合伙长短当气候读，不是保质期。合与三合让天气变厚；冲与刑是你要绕开的风暴。', 'อ่านระยะเป็นภูมิอากาศ ไม่ใช่วันหมดอายุ 合 และ 三合 ทำให้ฟ้าหนา 冲 และ 刑 คือพายุที่ต้องวางแผน')}</p>` : `<p class="biz-hint">${_t('Enter a partner birth date in Compatibility Check to see pillar-by-pillar Combine / Crash / Harmony.', '在合婚中输入对方生日，即可看到逐柱合 / 冲 / 三合。', 'กรอกวันเกิดของคู่ในส่วนตรวจความเข้ากัน เพื่อดู 合 / 冲 / 三合 ทีละเสา')}</p>`;

  el.innerHTML = `<div class="biz-compat-wrap">
    <div class="biz-section-label">${_t('PRODUCTIVE PARTNERSHIPS', '生产合作')}</div>
    <div class="biz-grid">
      ${bizCard(producedBy, `Fuels your ${dominantEl} — they support your growth`, `为你的${EL_ZH[dominantEl]}提供能量`, `หล่อเลี้ยงธาตุ${EL_TH[dominantEl]}ของคุณ — ช่วยสนับสนุนการเติบโตของคุณ`)}
      ${bizCard(produces, `You inspire their ${produces} — natural mentorship`, `你激发他们的${EL_ZH[produces]} — 天然导师`, `คุณช่วยเสริมธาตุ${EL_TH[produces]}ของพวกเขา — เป็นพี่เลี้ยงโดยธรรมชาติ`)}
    </div>
    <div class="biz-section-label">${_t('STRESS / CRASH POINTS', '压力 / 冲克')}</div>
    <div class="biz-grid">
      ${bizCard(controlledBy, `Challenges your ${dominantEl} — pushes you to evolve`, `挑战你的${EL_ZH[dominantEl]} — 推动你进化`, `ท้าทายธาตุ${EL_TH[dominantEl]}ของคุณ — ผลักดันให้คุณพัฒนา`)}
      ${bizCard(controls, `You overpower their ${controls} — be mindful of dominance`, `你压制他们的${EL_ZH[controls]} — 注意平衡`, `คุณข่มธาตุ${EL_TH[controls]}ของพวกเขา — ควรระวังการครอบงำ`)}
    </div>
    ${pairHtml}
  </div>`;
}

/* ── Compatibility deep dive ──
   Presentation of engine outputs only (pairBranchRelations, calcTenGod, calcElements,
   favorableElements, getNatalNobles, getPeachBlossom). Scores are untouched. */
const COMPAT_PILLAR_AREA = {
  Year:  { en: 'Family & social circles', zh: '家庭与社交', th: 'ครอบครัวและสังคม' },
  Month: { en: 'Daily life & work rhythm', zh: '日常与工作节奏', th: 'ชีวิตประจำวันและจังหวะงาน' },
  Day:   { en: 'The relationship itself · spouse palace 夫妻宫', zh: '感情本身 · 夫妻宫', th: 'ตัวความสัมพันธ์ · วังคู่ครอง 夫妻宫' },
  Hour:  { en: 'Long-term plans & later years', zh: '长远规划与晚年', th: 'แผนระยะยาวและบั้นปลาย' },
};
const COMPAT_PILLAR_NAME = {
  Year: ['Year', '年', 'ปี'], Month: ['Month', '月', 'เดือน'], Day: ['Day', '日', 'วัน'], Hour: ['Hour', '时', 'ยาม'],
};
const COMPAT_REL = {
  combine: { mark: '合', tone: 'good', en: 'Combine 六合', zh: '六合', th: 'รวม 六合',
    note: ['A natural bond — you pull toward each other here.', '天然相合，这一处彼此靠拢。', 'สายสัมพันธ์ธรรมชาติ — ดึงเข้าหากันตรงนี้'] },
  harmony: { mark: '三合', tone: 'good', en: 'Three Harmony 三合', zh: '三合', th: 'สามประสาน 三合',
    note: ['Shared direction — it’s easy to agree on where this goes.', '方向一致，容易对未来达成共识。', 'ทิศทางเดียวกัน — ตกลงเรื่องอนาคตได้ง่าย'] },
  same: { mark: '同', tone: 'neutral', en: 'Same branch', zh: '同支', th: 'กิ่งเดียวกัน',
    note: ['A mirror — familiar and easy, sometimes too alike.', '像照镜子——熟悉自在，有时太像。', 'เหมือนกระจก — คุ้นเคย บางทีเหมือนกันเกินไป'] },
  clash: { mark: '冲', tone: 'bad', en: 'Clash 六冲', zh: '六冲', th: 'ปะทะ 六冲',
    note: ['Push-pull — real chemistry and real friction. Give each other room.', '一推一拉——有火花也有摩擦，彼此留出空间。', 'ผลักดึง — มีเคมีและมีแรงเสียดทาน ให้พื้นที่กัน'] },
  harm: { mark: '害', tone: 'bad', en: 'Harm 六害', zh: '六害', th: 'ทำร้าย 六害',
    note: ['Small hurts and misread signals — say things plainly.', '小伤小误会，话要说清楚。', 'แผลเล็กและสัญญาณผิด — พูดให้ตรง'] },
  punish: { mark: '刑', tone: 'bad', en: 'Punishment 刑', zh: '相刑', th: 'ลงโทษ 刑',
    note: ['Friction that tests you — patience matters most here.', '考验型的摩擦，这一处最需要耐心。', 'แรงเสียดทานที่ทดสอบ — ความอดทนสำคัญที่สุด'] },
  neutral: { mark: '·', tone: 'neutral', en: 'Neutral', zh: '平', th: 'กลาง',
    note: ['No strong pull either way.', '无明显牵引。', 'ไม่มีแรงดึงชัดเจน'] },
};
const COMPAT_GOD_NOTE = {
  friend:            ['An equal — they feel like a peer and a teammate.', '平起平坐——像同伴，也像队友。', 'คนเท่าเทียม — เหมือนเพื่อนร่วมทีม'],
  rob_wealth:        ['A magnetic rival — attraction with a streak of competition.', '有吸引力的对手——心动里带点较劲。', 'คู่แข่งที่มีเสน่ห์ — ดึงดูดแต่มีการแข่งกัน'],
  eating_god:        ['Someone you nurture easily — warmth and play come naturally.', '你自然想照顾的人——温暖与玩乐都很自然。', 'คนที่คุณดูแลได้ง่าย — อบอุ่นและสนุกโดยธรรมชาติ'],
  hurting_officer:   ['They bring out your candid side — lively, honest, sometimes prickly.', '激发你直率的一面——热闹、坦白，偶尔带刺。', 'ดึงด้านตรงไปตรงมาของคุณ — มีชีวิตชีวา บางทีแหลมคม'],
  direct_wealth:     ['Steady devotion — someone you want to take care of and build with.', '稳定的投入——想照顾、想一起经营的人。', 'ความทุ่มเทมั่นคง — คนที่อยากดูแลและสร้างด้วยกัน'],
  indirect_wealth:   ['Excitement and desire — a thrilling, less predictable pull.', '兴奋与渴望——刺激、难以预料的吸引。', 'ความตื่นเต้นและปรารถนา — แรงดึงที่คาดเดายาก'],
  direct_officer:    ['A stabiliser — they bring structure, commitment and standards.', '稳定器——带来规矩、承诺与标准。', 'ตัวสร้างความมั่นคง — นำโครงสร้างและพันธะมา'],
  seven_killings:    ['Intensity — they challenge you and push you to grow. Keep respect high.', '强烈——挑战你、推你成长，需要彼此尊重。', 'ความเข้มข้น — ท้าทายและผลักให้โต ต้องเคารพกัน'],
  direct_resource:   ['Care and support — they look after you and make you feel safe.', '照顾与支持——让你被照顾、有安全感。', 'การดูแลและแรงหนุน — ทำให้รู้สึกปลอดภัย'],
  indirect_resource: ['An unconventional ally — quiet insight and understanding.', '非典型的支持——安静的洞察与理解。', 'พันธมิตรไม่ธรรมดา — ความเข้าใจอย่างเงียบๆ'],
};
function compatElLabel(el) { return _t(el, EL_ZH[el] + ' ' + el, (EL_TH[el] || el)); }

function renderCompatDeep(userPillars, partnerPillars, userDominant, partnerDominant, partnerElements) {
  if (!window.BaziEngine || !userPillars || !partnerPillars) return '';
  const E = BaziEngine;
  const labels = ['Year', 'Month', 'Day', 'Hour'];
  const known = p => p && p.known !== false && p.stem && p.branch;
  const rels = {};
  (E.pairBranchRelations(userPillars, partnerPillars) || []).forEach(r => { rels[r.pillar] = r.relation; });

  /* 1 · Side by side (Hour → Day → Month → Year, as on Your Chart) */
  const order = [3, 2, 1, 0];
  const cell = p => known(p)
    ? `<div class="cd-cell"><span style="color:${EL_COLOR[p.stem.element]}">${p.stem.char}</span><span style="color:${EL_COLOR[p.branch.element]}">${p.branch.char}</span><small>${_t(p.branch.animal, ANIMAL_ZH[p.branch.animal], ANIMAL_TH[p.branch.animal])}</small></div>`
    : `<div class="cd-cell is-unknown"><span>?</span><small>${_t('Unknown', '未知', 'ไม่ทราบ')}</small></div>`;
  const grid = `
    <div class="cd-grid">
      <div></div>${order.map(i => `<div class="cd-col-h">${_t(...COMPAT_PILLAR_NAME[labels[i]])}</div>`).join('')}
      <div class="cd-row-h">${_t('You', '你', 'คุณ')}</div>${order.map(i => cell(userPillars[i])).join('')}
      <div></div>${order.map(i => {
        const rel = COMPAT_REL[rels[labels[i]]];
        return rel ? `<div class="cd-rel is-${rel.tone}" title="${rel.en}">${rel.mark}</div>` : '<div class="cd-rel"></div>';
      }).join('')}
      <div class="cd-row-h">${_t('Them', '对方', 'เขา')}</div>${order.map(i => cell(partnerPillars[i])).join('')}
    </div>`;

  /* 2 · Pillar by pillar, spouse palace first */
  const pillarRows = ['Day', 'Year', 'Month', 'Hour'].filter(l => rels[l]).map(l => {
    const rel = COMPAT_REL[rels[l]] || COMPAT_REL.neutral;
    const a = COMPAT_PILLAR_AREA[l];
    return `<li class="cd-item">
      <span class="cd-tag is-${rel.tone}">${rel.mark}</span>
      <div><div class="cd-item-t">${_t(a.en, a.zh, a.th)} — ${_t(rel.en, rel.zh, rel.th)}</div>
      <div class="cd-item-s">${_t(...rel.note)}</div></div>
    </li>`;
  }).join('');
  const missing = labels.filter(l => !rels[l]).map(l => _t(...COMPAT_PILLAR_NAME[l]));
  const pillarSection = pillarRows ? `
    <div class="cd-sec">
      <div class="cd-h">${_t('Pillar by pillar', '逐柱对照', 'เทียบทีละเสา')}</div>
      <ul class="cd-list">${pillarRows}</ul>
      ${missing.length ? `<p class="cd-foot">${_t(`Both birth times are needed to compare the ${missing.join(', ')} pillar.`, `需双方出生时间才能对照${missing.join('、')}柱。`, `ต้องมีเวลาเกิดของทั้งสองคนจึงเทียบเสา ${missing.join(', ')} ได้`)}</p>` : ''}
    </div>` : '';

  /* 3 · Day Masters: what each of you is to the other */
  const uDM = known(userPillars[2]) ? userPillars[2].stem : null;
  const pDM = known(partnerPillars[2]) ? partnerPillars[2].stem : null;
  let godSection = '';
  if (uDM && pDM) {
    const theyAre = E.calcTenGod(uDM.element, uDM.polarity, pDM.element, pDM.polarity);
    const youAre = E.calcTenGod(pDM.element, pDM.polarity, uDM.element, uDM.polarity);
    const dm = s => `<span class="cd-dm" style="color:${EL_COLOR[s.element]}">${s.char}</span> ${_t(`${s.polarity} ${s.element}`, `${s.polarity === 'Yang' ? '阳' : '阴'}${EL_ZH[s.element]}`, `${s.polarity === 'Yang' ? 'หยาง' : 'หยิน'} ${EL_TH[s.element] || s.element}`)}`;
    godSection = `
      <div class="cd-sec">
        <div class="cd-h">${_t('Day Master to Day Master', '日主对日主', 'วันมาสเตอร์ต่อวันมาสเตอร์')}</div>
        <div class="cd-dm-row"><div>${_t('You', '你', 'คุณ')} ${dm(uDM)}</div><div>${_t('Them', '对方', 'เขา')} ${dm(pDM)}</div></div>
        <ul class="cd-list">
          <li class="cd-item"><span class="cd-tag">→</span><div>
            <div class="cd-item-t">${_t(`They are your ${godLabel(theyAre)}`, `对方是你的${godLabel(theyAre)}`, `เขาคือ ${godLabel(theyAre)} ของคุณ`)}</div>
            <div class="cd-item-s">${_t(...(COMPAT_GOD_NOTE[theyAre] || ['', '', '']))}</div></div></li>
          <li class="cd-item"><span class="cd-tag">←</span><div>
            <div class="cd-item-t">${_t(`You are their ${godLabel(youAre)}`, `你是对方的${godLabel(youAre)}`, `คุณคือ ${godLabel(youAre)} ของเขา`)}</div>
            <div class="cd-item-s">${_t(...(COMPAT_GOD_NOTE[youAre] || ['', '', '']))}</div></div></li>
        </ul>
      </div>`;
  }

  /* 4 · Element balance */
  const uEls = calcElements(userPillars);
  const pEls = partnerElements || calcElements(partnerPillars);
  const uTot = Object.values(uEls).reduce((a, b) => a + b, 0) || 1;
  const pTot = Object.values(pEls).reduce((a, b) => a + b, 0) || 1;
  const elRows = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'].map(el => `
    <div class="cd-el-row">
      <span class="cd-el-name" style="color:${EL_COLOR[el]}">${EL_ZH[el]} ${_t(el, el, EL_TH[el] || el)}</span>
      <div class="cd-el-bars">
        <div class="cd-el-bar"><i style="width:${Math.round(uEls[el] / uTot * 100)}%;background:${EL_COLOR[el]}"></i></div>
        <div class="cd-el-bar is-them"><i style="width:${Math.round(pEls[el] / pTot * 100)}%;background:${EL_COLOR[el]}"></i></div>
      </div>
      <span class="cd-el-num">${uEls[el]} · ${pEls[el]}</span>
    </div>`).join('');
  const favU = E.favorableElements(userPillars);
  const favP = E.favorableElements(partnerPillars);
  const elLines = [];
  if (partnerDominant && favU.favorable.indexOf(partnerDominant) >= 0) {
    elLines.push(_t(`Their strongest element, ${partnerDominant}, is one your chart needs — they tend to restore you.`, `对方最旺的${EL_ZH[partnerDominant]}正是你命盘所喜——对方容易让你回血。`, `ธาตุเด่นของเขา (${EL_TH[partnerDominant] || partnerDominant}) คือธาตุที่แผนภูมิคุณต้องการ — เขามักช่วยเติมพลังให้คุณ`));
  } else if (partnerDominant && favU.unfavorable.indexOf(partnerDominant) >= 0) {
    elLines.push(_t(`Their strongest element, ${partnerDominant}, is one your chart already has plenty of — protect your own recharge time.`, `对方最旺的${EL_ZH[partnerDominant]}是你命盘已偏多的——记得留给自己充电的时间。`, `ธาตุเด่นของเขา (${EL_TH[partnerDominant] || partnerDominant}) แผนภูมิคุณมีมากพอแล้ว — รักษาเวลาชาร์จพลังของตัวเอง`));
  }
  if (userDominant && favP.favorable.indexOf(userDominant) >= 0) {
    elLines.push(_t(`Your strongest element, ${userDominant}, is one their chart needs — you steady them.`, `你最旺的${EL_ZH[userDominant]}正是对方所喜——你能稳住对方。`, `ธาตุเด่นของคุณ (${EL_TH[userDominant] || userDominant}) คือธาตุที่เขาต้องการ — คุณช่วยให้เขามั่นคง`));
  } else if (userDominant && favP.unfavorable.indexOf(userDominant) >= 0) {
    elLines.push(_t(`Your strongest element, ${userDominant}, is one they already have plenty of — don’t overdo it.`, `你最旺的${EL_ZH[userDominant]}对方已偏多——别用力过猛。`, `ธาตุเด่นของคุณ (${EL_TH[userDominant] || userDominant}) เขามีมากแล้ว — อย่ามากเกินไป`));
  }
  const elSection = `
    <div class="cd-sec">
      <div class="cd-h">${_t('Element balance', '五行对照', 'สมดุลธาตุ')}</div>
      <div class="cd-el-legend"><span><i class="cd-key"></i>${_t('You', '你', 'คุณ')}</span><span><i class="cd-key is-them"></i>${_t('Them', '对方', 'เขา')}</span></div>
      ${elRows}
      ${elLines.map(l => `<p class="cd-foot">${l}</p>`).join('')}
    </div>`;

  /* 5 · Stars between you */
  const starLines = [];
  const branchHits = (pillars, chars) => labels.filter((l, i) => known(pillars[i]) && chars.indexOf(pillars[i].branch.char) >= 0).map(l => _t(...COMPAT_PILLAR_NAME[l]));
  const nobU = E.getNatalNobles(userPillars);
  const nobP = E.getNatalNobles(partnerPillars);
  const theyNoble = branchHits(partnerPillars, (nobU.tianyiBranches || []).map(b => b.char));
  const youNoble = branchHits(userPillars, (nobP.tianyiBranches || []).map(b => b.char));
  if (theyNoble.length) starLines.push(_t(`They carry your Nobleman 天乙贵人 (their ${theyNoble.join(', ')} pillar) — they tend to show up as help when it counts.`, `对方命带你的天乙贵人（${theyNoble.join('、')}柱）——关键时刻容易成为助力。`, `เขามีดาวอุปถัมภ์ 天乙贵人 ของคุณ (เสา ${theyNoble.join(', ')}) — มักช่วยในยามสำคัญ`));
  if (youNoble.length) starLines.push(_t(`You carry their Nobleman 天乙贵人 (your ${youNoble.join(', ')} pillar) — you’re a helper in their story.`, `你命带对方的天乙贵人（${youNoble.join('、')}柱）——你是对方故事里的贵人。`, `คุณมีดาวอุปถัมภ์ 天乙贵人 ของเขา (เสา ${youNoble.join(', ')}) — คุณคือผู้ช่วยในเรื่องราวของเขา`));
  const peachU = E.getPeachBlossom(userPillars);
  const peachP = E.getPeachBlossom(partnerPillars);
  const theyPeach = peachU.branch ? branchHits(partnerPillars, [peachU.branch]) : [];
  const youPeach = peachP.branch ? branchHits(userPillars, [peachP.branch]) : [];
  if (theyPeach.length) starLines.push(_t(`They carry your Peach Blossom 桃花 branch (${peachU.branch} ${peachU.animal}) — a strong romantic spark.`, `对方带着你的桃花支（${peachU.branch}）——浪漫火花明显。`, `เขามีกิ่งดอกท้อ 桃花 ของคุณ (${peachU.branch}) — ประกายโรแมนติกชัด`));
  if (youPeach.length) starLines.push(_t(`You carry their Peach Blossom 桃花 branch (${peachP.branch} ${peachP.animal}) — you read as attractive to them.`, `你带着对方的桃花支（${peachP.branch}）——在对方眼里很有吸引力。`, `คุณมีกิ่งดอกท้อ 桃花 ของเขา (${peachP.branch}) — เขามองว่าคุณมีเสน่ห์`));
  if (peachU.present) starLines.push(_t(`Peach Blossom sits in your own ${peachU.pillars.join(', ')} pillar — you draw attention easily.`, `你自己的${peachU.pillars.join('、')}柱带桃花——天生容易吸引目光。`, `ดอกท้ออยู่ในเสา ${peachU.pillars.join(', ')} ของคุณ — ดึงดูดความสนใจง่าย`));
  if (peachP.present) starLines.push(_t(`Peach Blossom sits in their ${peachP.pillars.join(', ')} pillar — they draw attention easily.`, `对方的${peachP.pillars.join('、')}柱带桃花——对方也很吸睛。`, `ดอกท้ออยู่ในเสา ${peachP.pillars.join(', ')} ของเขา — เขาดึงดูดความสนใจง่าย`));
  const starSection = starLines.length ? `
    <div class="cd-sec">
      <div class="cd-h">${_t('Stars between you', '你们之间的神煞', 'ดาวระหว่างคุณ')}</div>
      <ul class="cd-list">${starLines.map(l => `<li class="cd-item"><span class="cd-tag is-good">✦</span><div class="cd-item-s">${l}</div></li>`).join('')}</ul>
    </div>` : '';

  return `<div class="cd">
    <div class="cd-sec">
      <div class="cd-h">${_t('Your charts side by side', '双方命盘对照', 'แผนภูมิเทียบกัน')}</div>
      ${grid}
    </div>
    ${pillarSection}${godSection}${elSection}${starSection}
  </div>`;
}

function checkCompatibility() {
  let day = parseInt(document.getElementById('partner-day').value);
  let month = parseInt(document.getElementById('partner-month').value);
  let year = parseInt(document.getElementById('partner-year').value);
  const timeUnknown = !!document.getElementById('partner-time-unknown')?.checked;
  const timeVal = timeUnknown ? '' : (document.getElementById('partner-time')?.value || '');
  const bloodVal = document.getElementById('partner-blood')?.value || '';
  const resultEl = document.getElementById('compat-result');
  const lunar = document.getElementById('partner-cal-lunar')?.classList.contains('active');
  const leap = !!document.getElementById('partner-leap-month')?.checked;

  const partnerError = (en, zh, th) => {
    resultEl.innerHTML = `<p class="field-error compat-error" role="alert">${_t(en, zh, th)}</p>`;
  };
  const solarDateOk = !lunar && day && month && year && (() => {
    const dt = new Date(year, month - 1, day);
    return dt.getFullYear() === year && dt.getMonth() === month - 1 && dt.getDate() === day;
  })();
  if (!day || !month || !year || year < 1900 || year > 2100 || (!lunar && !solarDateOk)) {
    partnerError('Please enter a valid birth date.', '请输入有效的出生日期。', 'กรุณากรอกวันเกิดที่ถูกต้อง');
    return;
  }

  if (lunar && window.BaziEngine) {
    try {
      const conv = BaziEngine.lunarToSolar(year, month, day, leap);
      year = conv.year; month = conv.month; day = conv.day;
    } catch (e) {
      partnerError('Could not convert that lunar date. Check the month, day, and leap month.', '无法换算该农历日期，请检查月、日与闰月。', 'แปลงวันจันทรคตินี้ไม่ได้ ตรวจสอบเดือน วัน และเดือนอธิกมาส');
      return;
    }
  }

  const userAnimal = _shareData ? _shareData.animal : null;
  if (!userAnimal) {
    partnerError('Complete your own reading first.', '请先完成你自己的命盘。', 'กรุณาดูดวงของคุณก่อน');
    return;
  }

  // Calculate partner's full BaZi
  let partnerHour = null;
  let partnerMinute = 0;
  if (timeVal) {
    const parts = timeVal.split(':');
    partnerHour = parseInt(parts[0], 10);
    partnerMinute = parseInt(parts[1] || '0', 10);
  }
  let partnerPillars;
  if (window.BaziEngine && typeof BaziEngine.calcBaziAccurate === 'function') {
    partnerPillars = BaziEngine.calcBaziAccurate({
      year, month, day, hour: partnerHour, minute: partnerMinute, calendar: 'solar',
    }).pillars;
  } else {
    partnerPillars = calcBazi(year, month - 1, day, partnerHour, partnerMinute);
  }
  const partnerAnimal = partnerPillars[0].branch.animal;
  const partnerElements = calcElements(partnerPillars);
  const partnerDominant = Object.entries(partnerElements).sort((a,b) => b[1]-a[1])[0][0];
  const partnerDayKnown = partnerPillars[2]?.known;

  const zData = ZODIAC[userAnimal];
  const isCompat = zData.compat.includes(partnerAnimal);
  const isClash = zData.clash.includes(partnerAnimal);
  const isSecretFriend = SECRET_FRIENDS[userAnimal] === partnerAnimal;

  // Element interaction
  const userEl = _shareData.dominantEl;
  const pEl = partnerDominant;
  const elProduces = ELEMENT_PRODUCES[userEl] === pEl;
  const elSupports = ELEMENT_PRODUCED_BY[userEl] === pEl;
  const elClash = ELEMENT_CONTROLS[userEl] === pEl || ELEMENT_CONTROLLED_BY[userEl] === pEl;

  let verdict, color, details = [];
  if (isCompat || isSecretFriend) {
    verdict = isSecretFriend ? 'Secret Friend Bond' : 'Harmonious Match';
    color = '#22c55e';
    details.push(_t(
      `Your ${userAnimal} and their ${partnerAnimal} form a natural alliance.`,
      `你的${ANIMAL_ZH[userAnimal]}与${ANIMAL_ZH[partnerAnimal]}形成天然联盟。`
    ));
  } else if (isClash) {
    verdict = 'Challenging Dynamic'; color = '#ef4444';
    details.push(_t(
      `Your ${userAnimal} and their ${partnerAnimal} sit in opposition — tension but chemistry.`,
      `你的${ANIMAL_ZH[userAnimal]}与${ANIMAL_ZH[partnerAnimal]}对冲 — 有张力但也有吸引力。`
    ));
  } else {
    verdict = 'Neutral Energy'; color = '#f0c040';
    details.push(_t(
      `Your ${userAnimal} and their ${partnerAnimal} have neutral energy.`,
      `你的${ANIMAL_ZH[userAnimal]}与${ANIMAL_ZH[partnerAnimal]}能量中性。`
    ));
  }

  // Element analysis
  if (elProduces) details.push(_t(`Your ${userEl} produces their ${pEl} — you naturally support them.`, `你的${EL_ZH[userEl]}生他们的${EL_ZH[pEl]} — 你天然支持他们。`));
  else if (elSupports) details.push(_t(`Their ${pEl} fuels your ${userEl} — they energize you.`, `他们的${EL_ZH[pEl]}生你的${EL_ZH[userEl]} — 他们为你注入能量。`));
  else if (elClash) details.push(_t(`${userEl} and ${pEl} have a controlling dynamic — requires balance.`, `${EL_ZH[userEl]}与${EL_ZH[pEl]}存在克制关系 — 需要平衡。`));

  // Day stem analysis
  if (partnerDayKnown) {
    const pKey = `${partnerPillars[2].stem.element}_${partnerPillars[2].stem.polarity}`;
    const pProfile = REL_PROFILE[pKey];
    if (pProfile) details.push(_t(`Their relationship style: ${pProfile.title}`, `对方感情风格：${pProfile.title_zh}`));
  }

  // Blood type note
  if (bloodVal && _shareData.bloodType) {
    const goodBT = { A: ['O','AB'], B: ['O','AB'], O: ['A','B'], AB: ['A','B'] };
    const isBTGood = goodBT[_shareData.bloodType]?.includes(bloodVal);
    if (isBTGood) details.push(_t(`Blood type ${_shareData.bloodType} + ${bloodVal}: complementary temperaments.`, `血型 ${_shareData.bloodType} + ${bloodVal}：互补气质。`));
  }

  const pEmoji = BRANCHES.find(b => b.animal === partnerAnimal)?.emoji || '';
  const uEmoji = BRANCHES.find(b => b.animal === userAnimal)?.emoji || '';

  const scored = (window.BaziEngine && BaziEngine.scoreLovePair)
    ? BaziEngine.scoreLovePair(_shareData.pillars || [], partnerPillars, userAnimal, partnerAnimal)
    : null;
  _lastPartner = { year, month, day, animal: partnerAnimal, pillars: partnerPillars, elements: partnerElements, dominant: partnerDominant };
  if (_shareData) {
    try { renderAuspiciousDates(_shareData.animal, _shareData.dominantEl); } catch (e) {}
    try { renderBusinessCompat(_shareData.animal, _shareData.dominantEl, _shareData.elements); } catch (e) {}
  }

  const scoreKeys = [
    ['love', 'Love compatibility', '感情合盘', 'ความเข้ากันทางรัก'],
    ['attraction', 'Attraction', '吸引', 'แรงดึงดูด'],
    ['lifestyle', 'Lifestyle', '生活节奏', 'ไลฟ์สไตล์'],
    ['communication', 'Communication', '沟通', 'การสื่อสาร'],
    ['longTerm', 'Long-term partner', '长期伴侣', 'คู่ระยะยาว'],
  ];
  const scoreHtml = scored ? `<div class="compat-scores">${scoreKeys.map(([k, en, zh, th]) => `
    <div class="compat-score">
      <span class="compat-score-label">${_t(en, zh, th)}</span>
      <span class="compat-score-num">${scored.scores[k]}</span>
      <div class="compat-score-track"><div class="compat-score-fill" style="width:${scored.scores[k]}%;background:${color}"></div></div>
    </div>`).join('')}</div>
    <p class="compat-guide">${_t('Guidance, not fate.', '参考，不是宿命。', 'แนวทาง ไม่ใช่ชะตา')}</p>` : '';

  resultEl.innerHTML = `
    <div style="margin-top:16px;padding:16px;background:rgba(255,255,255,0.03);border:1px solid ${color}33;border-radius:var(--radius-md);text-align:center">
      <div style="font-size:24px;margin-bottom:8px">${uEmoji} + ${pEmoji}</div>
      <div style="font-size:15px;font-weight:700;color:${color};margin-bottom:10px">${_t(verdict, verdict)}</div>
      ${scoreHtml}
      ${details.map(d => `<p style="font-size:12px;color:var(--muted);line-height:1.5;margin-top:6px">${d}</p>`).join('')}
      ${renderCompatDeep(_shareData.pillars || [], partnerPillars, userEl, pEl, partnerElements)}
    </div>
  `;
}

/* ── Light mode ── */
function applyLightMode(on) {
  document.body.classList.toggle('light-mode', on);
  const label = document.getElementById('light-mode-toggle-label');
  if (label) label.textContent = on ? 'Dark Mode' : 'Light Mode';
}
function toggleLightMode() {
  const on = !document.body.classList.contains('light-mode');
  applyLightMode(on);
  localStorage.setItem('lightMode', on ? '1' : '0');
}
function initLightMode() {
  document.body.classList.remove('light-mode');
}

/* ── Init ── */
buildStars();
initSplashExperience();
initDateInputs();
initCityAutocomplete();
initTooltips();
initLightMode();
updateLandingCtas();
if (/[?&]begin=1(?:&|$)/.test(location.search) && !currentHash()) {
  history.replaceState({ wobazi: 'input' }, '', location.pathname + '#input');
}
applyRoute(currentHash());
checkAuth();

