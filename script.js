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
    <ellipse cx="52" cy="70" rx="28" ry="18" fill="currentColor" transform="rotate(-8,52,70)"/>
    <path d="M38,56 Q31,42 40,29" stroke="currentColor" stroke-width="15" fill="none" stroke-linecap="round"/>
    <ellipse cx="40" cy="24" rx="10" ry="14" fill="currentColor" transform="rotate(18,40,24)"/>
    <path d="M38,31 Q27,27 29,18 Q21,20 23,11 Q15,13 20,5" stroke="currentColor" stroke-width="5.5" fill="none" stroke-linecap="round" opacity="0.65"/>
    <ellipse cx="46" cy="28" rx="3" ry="2.5" fill="currentColor" opacity="0.45"/>
    <circle cx="35" cy="20" r="3" fill="white"/>
    <circle cx="35.5" cy="20.5" r="1.8" fill="#111"/>
    <circle cx="36" cy="20" r="0.7" fill="white"/>
    <line x1="36" y1="83" x2="34" y2="96" stroke="currentColor" stroke-width="5.5" stroke-linecap="round" opacity="0.75"/>
    <line x1="50" y1="85" x2="50" y2="96" stroke="currentColor" stroke-width="5.5" stroke-linecap="round" opacity="0.75"/>
    <line x1="64" y1="83" x2="66" y2="96" stroke="currentColor" stroke-width="5.5" stroke-linecap="round" opacity="0.75"/>`,

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
  haptic([15, 50, 15]);
  const name  = document.getElementById('name').value.trim();
  const d     = parseInt(document.getElementById('birth-day').value,   10);
  const m     = parseInt(document.getElementById('birth-month').value, 10);
  const y     = parseInt(document.getElementById('birth-year').value,  10);
  if (!d || !m || !y || y < 1900 || y > 2025) return;

  const timeVal = document.getElementById('birthtime').value;
  let hour = null;
  if (timeVal) hour = parseInt(timeVal.split(':')[0], 10);

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

  const elColor = EL_COLOR[yearPillar.stem.element];
  const dominantEl = Object.entries(elements).sort((a,b)=>b[1]-a[1])[0][0];

  // Store share data
  _shareData = { animal, element: yearPillar.stem.element, polarity: yearPillar.stem.polarity, year, fortune };

  // Hero card
  document.getElementById('hero-bg').style.background =
    `linear-gradient(135deg, ${elColor}28, ${elColor}55, #0f0f1c)`;
  document.getElementById('hero-medallion').innerHTML =
    makeMedallion(animal, elColor, 'hero-med');
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

  // Love & Relationships
  renderLoveSection(animal, elements, forecast2026.overall);

  // Career + season + yin/yang
  renderCareerArchetype(dominantEl);
  renderPowerSeason(dominantEl);
  renderYinYang(pillars);

  // Reading
  document.getElementById('reading-en').textContent = zData.desc_en;
  document.getElementById('reading-zh').textContent = zData.desc_zh;

  // Compatibility
  renderCompat(animal, zData);

  // Lucky
  renderLucky(zData.lucky);

  showScreen('results');
  haptic([20, 60, 20]);

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
      ${makeMedallion(p.branch.animal, EL_COLOR[p.branch.element], 'pillar-med')}
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

/* ═══════════════════════════════════════
   Extra Zodiac Data — Career + Season
═══════════════════════════════════════ */
const CAREER_ARCHETYPE = {
  Wood:  { icon:'🌿', name:'The Cultivator',  tagline:'Builder · Educator · Healer', roles:['Medicine','Education','Architecture','Environmental Science','Coaching'] },
  Fire:  { icon:'🔥', name:'The Visionary',   tagline:'Leader · Artist · Performer',  roles:['Entrepreneurship','Entertainment','Marketing','Politics','Design'] },
  Earth: { icon:'🌍', name:'The Anchor',      tagline:'Manager · Mediator · Founder', roles:['Business','Real Estate','Finance','HR','Consulting'] },
  Metal: { icon:'⚡', name:'The Executor',    tagline:'Engineer · Analyst · Strategist', roles:['Engineering','Law','Finance','Science','Military'] },
  Water: { icon:'💧', name:'The Strategist',  tagline:'Thinker · Writer · Philosopher', roles:['Writing','Research','Philosophy','Tech','Intelligence'] },
};

const POWER_SEASON = {
  Wood:  { season:'Spring', emoji:'🌸', vibe:'Growth & new beginnings' },
  Fire:  { season:'Summer', emoji:'☀️', vibe:'Peak energy & visibility' },
  Earth: { season:'Harvest',emoji:'🍂', vibe:'Stability & abundance' },
  Metal: { season:'Autumn', emoji:'🍁', vibe:'Precision & clarity' },
  Water: { season:'Winter', emoji:'❄️', vibe:'Reflection & strategy' },
};

const ALL_SEASONS = [
  { key:'Wood',  label:'Spring', emoji:'🌸', vibe:'Growth' },
  { key:'Fire',  label:'Summer', emoji:'☀️', vibe:'Visibility' },
  { key:'Earth', label:'Harvest',emoji:'🍂', vibe:'Abundance' },
  { key:'Metal', label:'Autumn', emoji:'🍁', vibe:'Clarity' },
];
// Water = Winter wraps around; displayed separately in the card footer

/* ── Medallion helper ── */
function makeMedallion(animal, elColor, cls = 'hero-med') {
  const svg = ANIMAL_SVGS[animal] || '';
  return `<div class="animal-medallion ${cls}" style="background:radial-gradient(circle at 40% 35%, ${elColor}55, ${elColor}18);">
    <div class="med-ring"></div>
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="color:white">${svg}</svg>
  </div>`;
}

/* ── Daily Fortune ── */
function calcDayBranch(year, month, day) {
  const ref = new Date(2000, 0, 7);
  const d   = new Date(year, month, day);
  const diff = Math.round((d - ref) / 86400000);
  return ((diff % 12) + 12) % 12;
}

function renderDailyFortune(userAnimal) {
  const now = new Date();
  const todayBranchIdx = calcDayBranch(now.getFullYear(), now.getMonth(), now.getDate());
  const todayAnimal    = BRANCHES[todayBranchIdx].animal;
  const userZodiac     = ZODIAC[userAnimal];

  let score, color, levelLabel, msg_en, msg_zh;
  if (userZodiac.compat.includes(todayAnimal)) {
    score = 85 + Math.floor(Math.random() * 12);
    color = '#22c55e'; levelLabel = 'Auspicious';
    msg_en = `Today's energy flows with you. The ${todayAnimal} day amplifies your natural power — make your boldest moves now.`;
    msg_zh = `今日能量与你同频。${todayAnimal}日增强你的天赋能量，大胆出击，正当时。`;
  } else if (userZodiac.clash.includes(todayAnimal)) {
    score = 38 + Math.floor(Math.random() * 18);
    color = '#ef4444'; levelLabel = 'Challenging';
    msg_en = `The ${todayAnimal} day creates friction with your chart. Navigate slowly, hold decisions until tomorrow, and protect your energy.`;
    msg_zh = `今日${todayAnimal}日与你的命盘有冲突。放缓节奏，重要决定推迟到明天，注意保护自己的能量。`;
  } else {
    score = 60 + Math.floor(Math.random() * 22);
    color = '#f0c040'; levelLabel = 'Balanced';
    msg_en = `A steady ${todayAnimal} day — neither tailwind nor headwind. Focus on consistency, refine the details, and trust the process.`;
    msg_zh = `今日${todayAnimal}日平稳，无明显顺逆之风。专注于一致性，打磨细节，相信过程。`;
  }

  const dateLabel = now.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
  document.getElementById('today-date-label').textContent = dateLabel;

  const card = document.getElementById('daily-card');
  card.innerHTML = `<div class="daily-fortune-card">
    <div class="daily-top">
      <div>
        <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin-bottom:6px">Today's Day Animal</div>
        <div class="daily-animal-chip">
          <svg viewBox="0 0 100 100" width="22" height="22" style="color:${color}">${ANIMAL_SVGS[todayAnimal]||''}</svg>
          ${todayAnimal}
        </div>
      </div>
      <div class="daily-score-wrap">
        <div class="daily-score-num" id="daily-score-num" style="color:${color}">0</div>
        <div class="daily-score-label">${levelLabel}</div>
      </div>
    </div>
    <div class="daily-bar-track">
      <div class="daily-bar-fill" id="daily-bar" style="background:${color}" data-pct="${score}"></div>
    </div>
    <div class="daily-msg">
      <span class="daily-level-dot" style="background:${color}"></span>
      <span class="en">${msg_en}</span>
      <span class="zh hide">${msg_zh}</span>
    </div>
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
        <div class="career-archetype-name" style="color:${col}">${ca.name}</div>
        <div class="career-tagline en">${ca.tagline}</div>
        <div class="career-roles">
          ${ca.roles.map(r=>`<span class="career-role-chip">${r}</span>`).join('')}
        </div>
      </div>
    </div>`;
}

/* ── Power Season ── */
function renderPowerSeason(dominantEl) {
  const ps = POWER_SEASON[dominantEl];
  const seasons = [
    { key:'Wood',  label:'Spring', emoji:'🌸', vibe:'Growth & new beginnings' },
    { key:'Fire',  label:'Summer', emoji:'☀️',  vibe:'Peak energy & visibility' },
    { key:'Earth', label:'Harvest',emoji:'🍂', vibe:'Stability & abundance' },
    { key:'Metal', label:'Autumn', emoji:'🍁', vibe:'Precision & clarity' },
    { key:'Water', label:'Winter', emoji:'❄️',  vibe:'Reflection & strategy' },
  ];
  const segmentColors = { Wood:'#22c55e', Fire:'#ef4444', Earth:'#f59e0b', Metal:'#94a3b8', Water:'#3b82f6' };

  const barHTML = seasons.map(s =>
    `<div class="season-segment" style="background:${segmentColors[s.key]};opacity:${s.key===dominantEl?1:0.25}"></div>`
  ).join('');

  const bodyHTML = seasons.map(s => `
    <div class="season-item ${s.key===dominantEl?'active':''}">
      <div class="season-emoji">${s.emoji}</div>
      <div class="season-name" style="${s.key===dominantEl?`color:${segmentColors[s.key]}`:''}">
        ${s.label}${s.key===dominantEl?'':''}
      </div>
      ${s.key===dominantEl?`<span class="power-badge">YOUR PEAK</span>`:`<div class="season-vibe">${s.vibe}</div>`}
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
    </div>`;

  setTimeout(() => {
    const yinEl  = document.getElementById('yy-yin');
    const yangEl = document.getElementById('yy-yang');
    if (yinEl)  yinEl.style.width  = yinPct  + '%';
    if (yangEl) yangEl.style.width = yangPct + '%';
  }, 400);
}

/* ── Share Card ── */
let _shareData = {};

function showShareCard() {
  const o = _shareData;
  if (!o.animal) return;
  const elColor = EL_COLOR[o.element];
  document.getElementById('share-card-preview').innerHTML = `
    <div class="share-wobazi-logo">✦ WOBAZI ✦</div>
    <div class="share-animal-big">
      <svg viewBox="0 0 100 100" width="80" height="80" style="color:${elColor}">${ANIMAL_SVGS[o.animal]||''}</svg>
    </div>
    <div class="share-animal-name">${o.animal}</div>
    <div class="share-sub">${o.element} ${o.polarity} · Year ${o.year}</div>
    <div class="share-fortune-row">
      ${[['❤️','Love',o.fortune.love,'#f43f5e'],['💼','Career',o.fortune.career,'#8b5cf6'],
         ['🌿','Health',o.fortune.health,'#22c55e'],['💰','Wealth',o.fortune.wealth,'#f59e0b']]
        .map(([ic,lb,sc,cl])=>`<div class="share-fortune-item">
          <div class="share-fortune-icon">${ic}</div>
          <div class="share-fortune-score" style="color:${cl}">${sc}</div>
          <div class="share-fortune-lbl">${lb}</div>
        </div>`).join('')}
    </div>
    <div class="share-url">wobazi.com</div>`;

  document.getElementById('share-overlay').classList.remove('hide');
}

function closeShare() {
  document.getElementById('share-overlay').classList.add('hide');
}

async function doShare() {
  haptic(15);
  const o = _shareData;
  const text = `I'm a ${o.element} ${o.animal} (${o.polarity}) 🐉\nLove ${o.fortune.love} · Career ${o.fortune.career} · Health ${o.fortune.health} · Wealth ${o.fortune.wealth}\nDiscover your Chinese destiny →`;
  if (navigator.share) {
    try {
      await navigator.share({ title: 'My Wobazi Reading', text, url: 'https://wobazi.com' });
    } catch (_) {}
  } else if (navigator.clipboard) {
    await navigator.clipboard.writeText(text + '\nhttps://wobazi.com');
    alert('Copied to clipboard!');
  }
}

/* ── Date input auto-advance ── */
function initDateInputs() {
  const dayEl   = document.getElementById('birth-day');
  const monEl   = document.getElementById('birth-month');
  const yearEl  = document.getElementById('birth-year');
  if (!dayEl) return;

  dayEl.addEventListener('input', () => {
    if (dayEl.value.length >= 2) monEl.focus();
  });
  monEl.addEventListener('input', () => {
    if (monEl.value.length >= 2) yearEl.focus();
  });
}

/* ═══════════════════════════════════════
   LOVE — Archetype Data
═══════════════════════════════════════ */
const HEART_PATH = 'M 50 78 C 20 62 2 48 2 32 C 2 16 15 10 26 10 C 36 10 45 15 50 22 C 55 15 64 10 74 10 C 85 10 98 16 98 32 C 98 48 80 62 50 78 Z';

const LOVE_ARCHETYPE = {
  Wood:  {
    title: 'The Nurturer', emoji: '🌿',
    tagline: 'Patient · Devoted · Slow-burning',
    desc_en: 'You love through acts of care and quiet consistency. You build slowly, but what you build lasts a lifetime. Partners feel deeply safe with you.',
    desc_zh: '你以关怀与持久表达爱意，缓慢建立却经久不衰，伴侣在你身边感到深深的安全感。',
    traits: ['Devoted', 'Patient', 'Nurturing'], language: 'Acts of Service',
  },
  Fire:  {
    title: 'The Flame', emoji: '❤️‍🔥',
    tagline: 'Intense · Magnetic · All-or-nothing',
    desc_en: 'You love like wildfire — consuming, electric, impossible to ignore. You draw people in effortlessly. The challenge is sustaining that heat over time.',
    desc_zh: '你的爱如烈火——炽烈、充满电力、势不可挡。魅力自然流露，挑战在于持久燃烧。',
    traits: ['Magnetic', 'Passionate', 'Bold'], language: 'Words of Affirmation',
  },
  Earth: {
    title: 'The Anchor', emoji: '🤎',
    tagline: 'Loyal · Steady · The one who stays',
    desc_en: 'You love with unshakeable loyalty. You\'re the person who shows up — in storms and in stillness. You give quietly and endlessly. You need to feel truly needed.',
    desc_zh: '你以不可动摇的忠诚去爱，风雨晴朗都始终出现，默默付出。你需要被人真正需要。',
    traits: ['Loyal', 'Reliable', 'Grounding'], language: 'Quality Time',
  },
  Metal: {
    title: 'The Enigma', emoji: '🩶',
    tagline: 'Selective · Precise · Fiercely devoted',
    desc_en: 'You don\'t fall easily — but when you do, it\'s absolute. Your love is a fortress: rare entry, total protection. Vulnerability is your greatest frontier.',
    desc_zh: '你不轻易动情，但一旦爱上便是全然投入。你的爱是堡垒，难以进入，却给予全面守护。',
    traits: ['Selective', 'Devoted', 'Protective'], language: 'Acts of Service',
  },
  Water: {
    title: 'The Dreamer', emoji: '💙',
    tagline: 'Romantic · Intuitive · Soul-deep',
    desc_en: 'You love with your whole soul — poetic, intuitive, and boundlessly empathetic. You feel what others feel before they say it. Guard your heart wisely.',
    desc_zh: '你以整个灵魂去爱——浪漫、直觉敏锐、共情力无边。能在对方开口前感知其情绪，守护好自己的心。',
    traits: ['Romantic', 'Empathetic', 'Intuitive'], language: 'Physical Touch',
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
    { emoji:'✨', action:'Say yes to everything', sub:'High chance of getting what you want'  },
    { emoji:'❤️', action:'Make the first move',   sub:'Stars are aligned in your favour'      },
    { emoji:'🔥', action:'Be bold — act now',     sub:'Your energy is magnetic right now'     },
    { emoji:'🌟', action:'Put yourself out there',sub:'A meaningful connection is very close'  },
  ],
  mid: [
    { emoji:'🌿', action:'Deepen what you have',  sub:'Quality over new connections'           },
    { emoji:'💬', action:'Have the conversation', sub:'Clarity will bring you much closer'     },
    { emoji:'🕊', action:'Keep showing up',       sub:'Consistency is your love language now'  },
    { emoji:'💛', action:'Love gently',           sub:'Small moments carry the most weight'    },
  ],
  low: [
    { emoji:'💔', action:"Don't do anything",   sub:'Low chance of love this month'           },
    { emoji:'🚫', action:'Skip it this month',   sub:"The energy isn't there — just wait"     },
    { emoji:'🌙', action:'Stay in this month',   sub:'Chasing will only lead to disappointment'},
    { emoji:'🛡', action:'Protect your heart',   sub:'Low love energy — focus inward'          },
  ],
};

function genLoveMonthly(loveScore) {
  // Valentine's Feb peaks, summer high, winter quieter
  const boost = [-4, +9, +5, +4, +1, +7, +5, +3, -1, -3, -6, +2];
  return boost.map((b, i) => {
    const score = Math.min(96, Math.max(20, Math.round(loveScore + b)));
    const level = score >= 68 ? 'high' : score >= 48 ? 'mid' : 'low';
    const pool  = LOVE_ACTIONS[level];
    const pick  = pool[(i * 7 + Math.round(loveScore)) % pool.length];
    return { ...pick, score, level };
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
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthly = genLoveMonthly(loveScore);
  const monthlyHTML = monthly.map((d, i) => `
    <div class="love-month-tile level-${d.level}${i === nowMonth ? ' now-month' : ''}">
      <div class="love-month-name">${MONTHS[i]}</div>
      <div class="love-month-emoji">${d.emoji}</div>
      <div class="love-month-action">${d.action}</div>
      <div class="love-month-sub">${d.sub}</div>
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
        <div class="love-soul-name" style="color:${col}">${a}</div>
        <div class="love-soul-note">"${note}"</div>
        <div class="love-soul-years">${years.map(y=>`<span class="love-soul-year">${y}</span>`).join('')}</div>
      </div>
    </div>`;
  }).join('');

  /* Clash chips */
  const clashHTML = zData.clash.map(a =>
    `<div class="love-clash-chip">
      <svg viewBox="0 0 100 100" width="14" height="14" style="color:rgba(255,255,255,0.35)">${ANIMAL_SVGS[a]||''}</svg>${a}
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
        <div class="love-tier-label" style="color:${tier.color}">${tier.label}</div>
        <div class="love-sublabel en">Chance of a meaningful connection in 2026</div>
        <div class="love-sublabel zh hide">${tier.zh} · 2026年情感运势</div>
      </div>

      <div class="love-archetype" style="border-color:${elColor}25">
        <div class="love-archetype-emoji">${la.emoji}</div>
        <div class="love-archetype-info">
          <div class="love-archetype-title" style="color:${elColor}">${la.title}</div>
          <div class="love-archetype-tagline">${la.tagline}</div>
          <div class="love-traits">${la.traits.map(t=>`<span class="love-trait">${t}</span>`).join('')}</div>
        </div>
        <div class="love-lang-badge">
          <div class="love-lang-icon">🗣</div>
          <div class="love-lang-text">${la.language}</div>
        </div>
      </div>

      <div class="love-desc">
        <p class="en">${la.desc_en}</p>
        <p class="zh hide">${la.desc_zh}</p>
      </div>

      <div class="love-months-wrap">
        <div class="love-months-label">Monthly Love Forecast · 月份情感运</div>
        <div class="love-months-strip">
          <div class="love-months-row">${monthlyHTML}</div>
        </div>
      </div>

      <div class="love-matches">
        <div class="love-match-label" style="margin-bottom:12px">♥ Soul Animals — who to look for</div>
        <div class="love-soul-cards">${soulHTML}</div>
        <div class="love-match-label" style="margin-top:16px;color:rgba(255,255,255,0.3)">⚡ Handle With Care</div>
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
    const strip = document.querySelector('.love-months-strip');
    if (strip) {
      const tileW  = 92;
      strip.scrollLeft = Math.max(0, nowMonth * tileW - strip.clientWidth / 2 + tileW / 2);
    }
  }, 700);
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
    body_zh: '生肖由出生年份决定，构成年柱，代表你的外在个性与生俱来的核心能量。'
  },
  'four-pillars': {
    icon: '柱',
    title_en: 'Four Pillars of Destiny',
    title_zh: '四柱八字',
    body_en: 'The Four Pillars (八字 Bāzì — "Eight Characters") are Year, Month, Day, and Hour. Each pillar has a Heavenly Stem on top and an Earthly Branch below. These 8 characters form the complete map of your destiny.',
    body_zh: '四柱即年、月、日、时，每柱含天干与地支各一字，合为八字，是命运的完整蓝图。'
  },
  'daily-fortune': {
    icon: '📅',
    title_en: 'Daily Fortune',
    title_zh: '日运势',
    body_en: 'Every day is governed by one of the 12 Earthly Branches. When today\'s ruling animal is compatible with yours, energy flows your way. When they clash, tread carefully and conserve your power.',
    body_zh: '每天由十二地支之一掌管。当日生肖与你相合则万事顺遂；相冲时宜谨慎行事，保存能量。'
  },
  'element-balance': {
    icon: '⬠',
    title_en: 'Element Balance',
    title_zh: '五行平衡',
    body_en: 'The Five Elements — Wood, Fire, Earth, Metal, Water — are Chinese cosmology\'s foundation. Your eight birth characters each carry an element. The balance (or imbalance) shapes your strengths and blind spots.',
    body_zh: '五行（木火土金水）是宇宙的基础。八字中每个字都带有五行属性，其平衡或偏颇决定你的优势与盲点。'
  },
  'fortune-cards': {
    icon: '🔮',
    title_en: 'Life Fortune',
    title_zh: '命运分值',
    body_en: 'These four scores reflect the intrinsic energy patterns in your birth chart across Love, Career, Health, and Wealth. They represent your lifetime baseline — not a single year — shaped by your elements and animal.',
    body_zh: '四项分值反映命盘中爱情、事业、健康与财富的内在能量格局，代表终身基础运势，由五行与生肖共同塑造。'
  },
  'career-archetype': {
    icon: '🎭',
    title_en: 'Career Archetype',
    title_zh: '职业原型',
    body_en: 'Your dominant element determines your natural professional archetype — the type of work where your energy flows most freely and you\'re most likely to achieve mastery and fulfilment.',
    body_zh: '主导五行决定你的职业原型——最能发挥天赋、最易达到卓越与满足感的工作方向。'
  },
  'power-season': {
    icon: '🌸',
    title_en: 'Power Season',
    title_zh: '旺季',
    body_en: 'Each element rules a season. Your power season is when your dominant element peaks in nature, amplifying your natural qi. Use this window for your biggest decisions and boldest moves.',
    body_zh: '五行各主一季。你的旺季是主导五行在自然界能量最强的时节，此时气场加持，是做出重大决策的最佳时机。'
  },
  'yin-yang': {
    icon: '☯',
    title_en: 'Yin · Yang Balance',
    title_zh: '阴阳平衡',
    body_en: 'Yin (阴) is receptive, inward, reflective energy. Yang (阳) is active, outward, expressive. The balance in your chart reveals whether you naturally move through life more inwardly or outwardly.',
    body_zh: '阴为内敛接纳之能，阳为主动外放之能。命盘中阴阳的比例，揭示你天生的处世方式。'
  },
  'compatibility': {
    icon: '💫',
    title_en: 'Compatibility',
    title_zh: '生肖相合',
    body_en: 'Based on the ancient San He (三合) and Liu He (六合) harmony systems. Compatible animals create flowing, supportive energy. Challenging pairings create friction — but also the heat that drives growth.',
    body_zh: '依据三合、六合古法。相合生肖带来流畅相助的能量，相冲生肖虽摩擦，却也是激发成长的动力。'
  },
  'lucky-vibes': {
    icon: '✨',
    title_en: 'Lucky Vibes',
    title_zh: '吉祥元素',
    body_en: 'Your lucky colors, numbers, and compass direction are derived from your animal\'s elemental essence. Surrounding yourself with these creates resonance between your environment and your innate energy.',
    body_zh: '吉祥色彩、数字与方位由生肖五行属性决定，以此布置环境，有助于与天生能量共鸣。'
  },
  'forecast-2026': {
    icon: '🔮',
    title_en: '2026 Annual Forecast',
    title_zh: '2026年运势',
    body_en: '2026 is 丙午 (Bǐng Wǔ) — the Year of the Fire Horse. This score shows how your birth chart interacts with the Horse\'s blazing, free-spirited energy. Fire Horse years reward boldness and punish hesitation.',
    body_zh: '2026年为丙午年——火马之年。分数反映命盘与火马奔放能量的互动。火马年奖励大胆者，惩罚犹豫者。'
  },
  'love-section': {
    icon: '❤️',
    title_en: 'Love & Relationships',
    title_zh: '爱情与关系',
    body_en: 'Your love forecast blends your zodiac\'s natural romantic energy with how the 2026 Fire Horse year activates the heart. The archetype reveals how you give and receive love — shaped by your dominant element.',
    body_zh: '爱情运融合了生肖天然的感情能量与2026年火马年对情感的激活。爱情原型揭示了你基于主导五行的给予与接受爱的方式。'
  },
};

/* ── Tooltip Functions ── */
function showTip(key) {
  const tip = TIPS[key];
  if (!tip) return;
  haptic(8);
  document.getElementById('tip-icon').textContent     = tip.icon;
  document.getElementById('tip-title-en').textContent = tip.title_en;
  document.getElementById('tip-title-zh').textContent = tip.title_zh;
  document.getElementById('tip-body-en').textContent  = tip.body_en;
  document.getElementById('tip-body-zh').textContent  = tip.body_zh;
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
  const v = () => Math.floor(Math.random() * 10) - 5;
  const aspects = {
    career: Math.min(95, Math.max(25, base + v() + (dominant === 'Fire'  ? 5 : 0))),
    love:   Math.min(95, Math.max(25, base + v() + (dominant === 'Wood'  ? 4 : 0))),
    wealth: Math.min(95, Math.max(25, base + v() + (dominant === 'Earth' ? 5 : 0))),
    health: Math.min(95, Math.max(25, base + v() + (dominant === 'Metal' ? 4 : 0))),
  };
  return { overall: base, aspects };
}

function gen2026Monthly(base) {
  // Fire Horse peaks in summer; dips in winter
  const boost = [-6, -8, -2, 4, 8, 14, 12, 9, 4, 0, -4, -5];
  return boost.map(b => Math.min(98, Math.max(22,
    Math.round(base + b + (Math.random() * 8 - 4))
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

  const ASPECT_META = [
    { key:'career', label:'Career', icon:'💼', color:'#8b5cf6' },
    { key:'love',   label:'Love',   icon:'❤️',  color:'#f43f5e' },
    { key:'wealth', label:'Wealth', icon:'💰',  color:'#f59e0b' },
    { key:'health', label:'Health', icon:'🌿',  color:'#22c55e' },
  ];

  const maxM = Math.max(...months);
  const MLABELS = ['J','F','M','A','M','J','J','A','S','O','N','D'];
  const barsHTML = months.map((v, i) => {
    const isHigh = v === maxM;
    const h = Math.round(8 + (v / maxM) * 48);
    return `<div class="month-bar-col">
      <div class="month-bar" id="mbar-${i}"
        style="height:4px;background:${isHigh ? '#f0c040' : EL_COLOR['Fire']+'88'}"
        data-h="${h}"></div>
      <div class="month-bar-label">${MLABELS[i]}</div>
    </div>`;
  }).join('');

  const aspectsHTML = ASPECT_META.map(m => `
    <div class="aspect-item">
      <div class="aspect-header">
        <div class="aspect-name">${m.icon} ${m.label}</div>
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
        <div class="forecast-sublabel en">Your 2026 Fortune Score</div>
        <div class="forecast-sublabel zh hide">2026年运势综合评分</div>
      </div>
      <div class="forecast-aspects">${aspectsHTML}</div>
      <div class="forecast-monthly">
        <div class="forecast-monthly-title">Monthly Energy · 月份运势</div>
        <div class="month-bars">${barsHTML}</div>
      </div>
      <div class="forecast-insight">
        <span class="en">${insightEn}</span>
        <div class="forecast-insight-zh zh hide">${insightZh}</div>
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
    // Month bars
    months.forEach((_, i) => {
      const bar = document.getElementById(`mbar-${i}`);
      if (bar) bar.style.height = bar.dataset.h + 'px';
    });
  }, 500);
}

/* ── Init ── */
buildStars();
initDateInputs();
initTooltips();

