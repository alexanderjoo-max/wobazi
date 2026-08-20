/* Remaining inner-page copy EN / TH / ZH */
(function () {
  var C = {
    'page.compat.sub': {
      en: 'Discover relationship harmony through Chinese astrology. Analyze zodiac clashes, element balance, and pillar interactions between two birth charts.',
      th: 'ค้นหาความกลมกลืนในความสัมพันธ์ผ่านโหราศาสตร์จีน วิเคราะห์ปะทะนักษัตร สมดุลธาตุ และปฏิสัมพันธ์เสาระหว่างสองแผนภูมิเกิด',
      zh: '借中国术数看关系和谐。分析两盘的生肖冲合、五行比重与柱间往来。'
    },
    'cp.h1': { en: 'What is BaZi Compatibility?', th: 'ความเข้ากันทางปาจื้อคืออะไร?', zh: '什么是八字合婚？' },
    'cp.p1': {
      en: 'BaZi compatibility (合婚 he hun) is the traditional Chinese method of assessing relationship harmony between two people. Rooted in thousands of years of metaphysical practice, it was historically consulted before marriage arrangements to ensure a balanced union.',
      th: 'ความเข้ากันทางปาจื้อ (合婚) คือวิธีจีนดั้งเดิมในการดูความกลมกลืนระหว่างสองคน ฝังในการปฏิบัติอภิปรัชญานับพันปี เคยใช้ก่อนจัดแต่งงานเพื่อให้คู่สมดุล',
      zh: '八字合婚是衡量两人关系和谐的传统方法。源自千年术数，历史上常在议婚前请教，以求匹配平衡。'
    },
    'cp.elbal': { en: 'Element Balance', th: 'สมดุลธาตุ', zh: '五行平衡' },
    'cp.pillarint': { en: 'Pillar Interactions', th: 'ปฏิสัมพันธ์เสา', zh: '柱间往来' },
    'cp.zodyharm': { en: 'Zodiac Harmony', th: 'ความกลมกลืนนักษัตร', zh: '生肖和合' },
    'cp.p2': {
      en: 'A full compatibility reading analyzes both partners\' birth charts across all four pillars, comparing element strengths, identifying clashes and combinations, and determining whether the Day Masters support or challenge each other.',
      th: 'การอ่านความเข้ากันเต็มวิเคราะห์แผนภูมิเกิดทั้งสี่เสาของทั้งคู่ เทียบความแข็งธาตุ หาปะทะและการรวม และดูว่าวันมาสเตอร์เกื้อหรือท้าทายกัน',
      zh: '完整合婚读两盘四柱：比五行强弱、找冲合、看两日主是相生还是相克。'
    },
    'cp.call1': {
      en: '<strong>In Chinese tradition, compatibility readings were essential before marriage arrangements.</strong> Families would consult a BaZi master to ensure the union of two birth charts would produce harmony, prosperity, and healthy descendants.',
      th: '<strong>ในประเพณีจีน การอ่านความเข้ากันสำคัญก่อนจัดแต่งงาน</strong> ครอบครัวปรึกษาอาจารย์ปาจื้อเพื่อให้การรวมสองแผนภูมิเกิดนำความกลมกลืน ความมั่งคั่ง และทายาทที่แข็งแรง',
      zh: '<strong>传统上，议婚前合婚是必要步骤。</strong>家庭会请命师，确认两盘结合能带来和谐、兴旺与健康后代。'
    },
    'cp.h2': { en: 'The Six Clashes (六冲)', th: 'หกปะทะ (六冲)', zh: '六冲' },
    'cp.p3': {
      en: 'The Six Clashes represent the strongest zodiac oppositions. When two animals sit directly across the zodiac wheel, their energies collide — creating friction, tension, and transformation.',
      th: 'หกปะทะคือการตรงข้ามนักษัตรที่แรงสุด เมื่อสองสัตว์อยู่ตรงข้ามวงล้อ พลังชนกัน — สร้างแรงเสียด ความตึง และการแปร',
      zh: '六冲是最强的生肖对冲。两兽在轮上正对，气便相撞——摩擦、张力与转化随之而来。'
    },
    'cp.h3': { en: 'The Six Combinations (六合)', th: 'หกการรวม (六合)', zh: '六合' },
    'cp.p4': {
      en: 'The Six Combinations are the most naturally harmonious zodiac pairings. These animals share complementary energies that create mutual support, understanding, and attraction.',
      th: 'หกการรวมคือคู่กลมกลืนตามธรรมชาติที่สุด สัตว์เหล่านี้แบ่งพลังเสริมที่สร้างการเกื้อ ความเข้าใจ และแรงดึงดูด',
      zh: '六合是最自然和谐的生肖配对。气互补，彼此支持、理解、吸引。'
    },
    'cp.h4': { en: 'Three Harmony Groups (三合)', th: 'กลุ่มสามฮาร์โมนี (三合)', zh: '三合' },
    'cp.p5': {
      en: 'The Three Harmonies are triangular alliances of three zodiac animals that share the same elemental affinity. When all three appear in a relationship or family, they amplify that element\'s energy.',
      th: 'สามฮาร์โมนีคือพันธมิตรสามเหลี่ยมของสามนักษัตรที่แบ่งธาตุเดียวกัน เมื่อทั้งสามปรากฏในความสัมพันธ์หรือครอบครัว พวกมันขยายพลังธาตุนั้น',
      zh: '三合是三只同五行的生肖三角同盟。若同现于一段关系或家庭，便放大该行的气。'
    },
    'cp.firetrio': { en: 'FIRE TRIO', th: 'สามไฟ', zh: '火局' },
    'cp.woodtrio': { en: 'WOOD TRIO', th: 'สามไม้', zh: '木局' },
    'cp.metaltrio': { en: 'METAL TRIO', th: 'สามโลหะ', zh: '金局' },
    'cp.watertrio': { en: 'WATER TRIO', th: 'สามน้ำ', zh: '水局' },
    'cp.h5': { en: 'Types of Compatibility Analysis', th: 'ประเภทการวิเคราะห์ความเข้ากัน', zh: '合婚的几种读法' },
    'cp.p6': {
      en: 'BaZi compatibility extends beyond romance. The same framework reveals dynamics in any relationship where two charts interact.',
      th: 'ความเข้ากันทางปาจื้อเกินกว่ารัก กรอบเดียวกันเผยพลวัตในทุกความสัมพันธ์ที่สองแผนภูมิมาพบกัน',
      zh: '八字合婚不止于爱情。凡两盘相交的关系，同一框架都能看见动态。'
    },
    'cp.rom': { en: 'Romance', th: 'ความรัก', zh: '感情' },
    'cp.rom.p': { en: 'Element harmony, Day Master compatibility, and emotional resonance between partners. Reveals chemistry, long-term potential, and areas needing conscious effort.', th: 'ความกลมกลืนธาตุ ความเข้ากันของวันมาสเตอร์ และคลื่นอารมณ์ระหว่างคู่ เผยเคมี ศักยภาพระยะยาว และจุดที่ต้องใส่ใจ', zh: '五行和谐、日主相配、情感共鸣。显出化学反应、长期可能，以及需要用心之处。' },
    'cp.biz': { en: 'Business', th: 'ธุรกิจ', zh: '事业' },
    'cp.biz.p': { en: 'Professional partnerships assessed through complementary strengths, wealth element alignment, and leadership dynamics. Identifies who leads and who supports.', th: 'หุ้นส่วนอาชีพดูจากจุดแข็งที่เติมกัน การเรียงธาตุทรัพย์ และพลวัตผู้นำ บอกว่าใครนำ ใครเกื้อ', zh: '从互补长处、财星配合与领导动态看合伙。谁主谁辅，一目了然。' },
    'cp.fam': { en: 'Family', th: 'ครอบครัว', zh: '家庭' },
    'cp.fam.p': { en: 'Parent-child and sibling dynamics through generational pillar analysis. Understand nurturing styles, communication gaps, and inherited element patterns.', th: 'พลวัตพ่อแม่ลูกและพี่น้องผ่านเสารุ่น เข้าใจสไตล์เลี้ยงดู ช่องว่างการสื่อสาร และลายธาตุที่สืบทอด', zh: '以世代之柱看亲子与手足。理解养育方式、沟通落差与继承而来的五行格局。' },
    'cp.h6': { en: 'Element Compatibility (五行相生相克)', th: 'ความเข้ากันของธาตุ (五行相生相克)', zh: '五行生克合婚' },
    'cp.p7': {
      en: 'The Five Elements interact in two fundamental cycles that shape every relationship. Understanding these dynamics reveals the natural energy flow between two people.',
      th: 'ห้าธาตุมีปฏิสัมพันธ์ในสองวงจรพื้นฐานที่หล่อทุกความสัมพันธ์ การเข้าใจพลวัตนี้เผยการไหลของพลังระหว่างสองคน',
      zh: '五行以生克两环塑造每段关系。懂这些动态，就看见两人之间气如何走。'
    },
    'cp.prod.t': { en: 'Producing Relationship (相生)', th: 'ความสัมพันธ์เกื้อ (相生)', zh: '相生关系' },
    'cp.ctrl.t': { en: 'Controlling Relationship (相克)', th: 'ความสัมพันธ์ข่ม (相克)', zh: '相克关系' },
    'cp.same.t': { en: 'Same Element', th: 'ธาตุเดียวกัน', zh: '同气' },
    'cp.same.p': {
      en: 'Deep understanding and shared wavelength, but potentially competitive. Two people with the same Day Master element may mirror each other\'s strengths — and blind spots.',
      th: 'เข้าใจลึกและคลื่นเดียวกัน แต่แข่งขันได้ คนสองคนที่วันมาสเตอร์ธาตุเดียวกันอาจสะท้อนจุดแข็ง — และจุดบอด ของกันและกัน',
      zh: '深契同频，也可能互竞。日主同气的两人，常互映长处——也互映盲点。'
    },
    'cp.call2': {
      en: '<strong>True BaZi compatibility goes far beyond just comparing zodiac animals.</strong> While zodiac clashes and combinations are widely known, they only examine the Year Branch — one of eight characters in a full BaZi chart.',
      th: '<strong>ความเข้ากันทางปาจื้อที่แท้ไกลกว่าการเทียบนักษัตร</strong> แม้ปะทะและการรวมนักษัตรเป็นที่รู้กัน แต่ดูเพียงกิ่งปี — หนึ่งในแปดตัวของแผนภูมิเต็ม',
      zh: '<strong>真正的八字合婚远不止比生肖。</strong>冲合人人会说，却只看年支——完整八字里的八分之一。'
    },
    'cp.h7': { en: 'Beyond Zodiac Signs', th: 'ไกลกว่านักษัตร', zh: '不止生肖' },
    'cp.p8': {
      en: 'A complete compatibility analysis compares all four pillars between two people — Year, Month, Day, and Hour. Each pillar governs different life domains:',
      th: 'การวิเคราะห์ความเข้ากันที่ครบเทียบทั้งสี่เสาระหว่างสองคน — ปี เดือน วัน ชั่วโมง แต่ละเสาครองโดเมนชีวิตต่างกัน:',
      zh: '完整合婚比较两人四柱——年、月、日、时。每柱主一片人生：'
    },
    'cp.year.d': { en: 'Social image & family background', th: 'ภาพสังคมและพื้นครอบครัว', zh: '社会形象与家世' },
    'cp.month.d': { en: 'Career & parents', th: 'อาชีพและพ่อแม่', zh: '事业与父母' },
    'cp.day.d': { en: 'Core self & marriage', th: 'แก่นตนและการสมรส', zh: '核心自我与婚姻' },
    'cp.hour.d': { en: 'Inner emotions & children', th: 'อารมณ์ภายในและลูก', zh: '内在情感与子女' },
    'cp.p9': {
      en: 'The <strong>Day Master</strong> — the Heavenly Stem of the Day Pillar — is the most important factor in compatibility. It represents your core identity, and its relationship to your partner\'s Day Master reveals the fundamental dynamic of the partnership.',
      th: '<strong>วันมาสเตอร์</strong> — ก้านฟ้าของเสาวัน — คือปัจจัยสำคัญสุดในความเข้ากัน มันแทนแก่นตัวตน และความสัมพันธ์กับวันมาสเตอร์ของคู่เผยพลวัตพื้นฐานของหุ้นส่วน',
      zh: '<strong>日主</strong>——日柱天干——是合婚最要紧的因素。它代表核心身份，与对方日主的关系，显出这段配对的底层动态。'
    },
    'cp.faq.q1': { en: 'Can BaZi predict if a relationship will work?', th: 'ปาจื้อทำนายได้ไหมว่าความสัมพันธ์จะไปได้?', zh: '八字能预知一段关系成不成吗？' },
    'cp.faq.a1': {
      en: 'BaZi compatibility analysis reveals the natural dynamic between two people — areas of harmony and potential friction. It doesn\'t predict success or failure, but highlights strengths to nurture and challenges to navigate. A clash doesn\'t doom a relationship, and a perfect match doesn\'t guarantee one.',
      th: 'การอ่านความเข้ากันเผยพลวัตธรรมชาติระหว่างสองคน — จุดกลมกลืนและจุดเสียดสี ไม่ได้ทำนายสำเร็จหรือล้มเหลว แต่ชี้จุดแข็งที่ควรเพาะและโจทย์ที่ต้องเดิน ปะทะไม่ได้ตัดสินความสัมพันธ์ และคู่เพอร์เฟกต์ก็ไม่รับประกัน',
      zh: '合婚显出两人之间的自然动态——和谐处与摩擦处。它不预报成败，只标出该养的长处和该过的关。有冲未必完，全美也未必成。'
    },
    'cp.faq.q2': { en: 'What if our zodiac signs clash?', th: 'ถ้านักษัตรปะทะกันล่ะ?', zh: '生肖相冲怎么办？' },
    'cp.faq.a2': {
      en: 'A zodiac clash (such as Rat vs Horse) indicates areas of natural tension, but it\'s only one factor among many. Full BaZi compatibility examines all four pillars, element balance, and Day Master harmony. Many successful relationships have zodiac clashes offset by strong compatibility elsewhere in the chart.',
      th: 'ปะทะนักษัตร (เช่น หนูกับม้า) ชี้จุดตึงตามธรรมชาติ แต่เป็นแค่หนึ่งปัจจัย การอ่านเต็มดูทั้งสี่เสา สมดุลธาตุ และความกลมกลืนวันมาสเตอร์ ความสัมพันธ์สำเร็จหลายคู่มีปะทะนักษัตรที่ถูกชดเชยด้วยความเข้ากันที่อื่นในแผนภูมิ',
      zh: '生肖冲（如鼠马）显出天生张力，却只是众多因素之一。完整合婚看四柱、五行与日主。许多成功关系里有冲，却被盘中别处的强合抵过。'
    },
    'cp.faq.q3': { en: 'Is BaZi compatibility the same as zodiac compatibility?', th: 'ความเข้ากันทางปาจื้อเหมือนนักษัตรหรือ?', zh: '八字合婚等于生肖配对吗？' },
    'cp.faq.a3': {
      en: 'No. Zodiac compatibility only considers the year animal, which is just one of eight characters in a BaZi chart. True BaZi compatibility analyzes both partners\' complete Four Pillars — including Day Master, element balance, and all pillar interactions — for a far more nuanced and accurate assessment.',
      th: 'ไม่ ความเข้ากันนักษัตรดูแค่สัตว์ปี ซึ่งเป็นแค่หนึ่งในแปดตัว ความเข้ากันทางปาจื้อที่แท้วิเคราะห์สี่เสาครบของทั้งคู่ — รวมวันมาสเตอร์ สมดุลธาตุ และปฏิสัมพันธ์เสาทั้งหมด — เพื่อการประเมินที่ละเอียดและแม่นกว่า',
      zh: '不是。生肖配对只看年支，八字的八分之一。真正合婚读双方完整四柱——日主、五行、柱间往来——细得多，也准得多。'
    },
    'cp.faq.q4': { en: 'How important is birth time for compatibility?', th: 'เวลาเกิดสำคัญแค่ไหนต่อความเข้ากัน?', zh: '合婚一定要出生时辰吗？' },
    'cp.faq.a4': {
      en: 'Birth time determines the Hour Pillar, which represents inner emotions and private life — crucial for understanding romantic compatibility. Without birth time, you can still assess three of the four pillars, but the Hour Pillar adds significant depth to the analysis, especially for intimate relationships.',
      th: 'เวลาเกิดกำหนดเสาชั่วโมง ซึ่งแทนอารมณ์ภายในและชีวิตส่วนตัว — สำคัญต่อการเข้าใจความเข้ากันเชิงรัก ถ้าไม่มีเวลาเกิด ยังประเมินได้สามในสี่เสา แต่เสาชั่วโมงเติมความลึก โดยเฉพาะความสัมพันธ์ใกล้ชิด',
      zh: '时辰定出时柱，主内在情感与私密生活——对感情合婚很关键。不知时辰仍可读三柱，但时柱会加深分析，尤其亲密关系。'
    },

    'page.daymaster.sub': {
      en: 'Your Day Master is the heart of your BaZi chart. Learn what it reveals about your core identity, personality, and destiny.',
      th: 'วันมาสเตอร์คือหัวใจของแผนภูมิปาจื้อ เรียนรู้ว่ามันเผยอะไรเรื่องแก่นตัวตน นิสัย และโชคชะตา',
      zh: '日主是八字盘的心脏。看它如何显出核心身份、性情与命运。'
    },
    'dm.h1': { en: 'What Is a Day Master?', th: 'วันมาสเตอร์คืออะไร?', zh: '何为日主？' },
    'dm.p1': {
      en: 'The Day Master (日主) is the Heavenly Stem of your Day Pillar in a BaZi chart. Of the four pillars that make up your chart, the Day Pillar is the one that represents you.',
      th: 'วันมาสเตอร์ (日主) คือก้านฟ้าของเสาวันในแผนภูมิปาจื้อ ในสี่เสา เสาวันคือเสาที่แทนคุณ',
      zh: '日主是日柱天干。四柱之中，日柱代表你。'
    },
    'dm.call1': {
      en: '<strong>Key insight:</strong> Your Day Master is the single most important element in your entire BaZi chart. It defines your core identity, personality traits, and how you naturally approach life.',
      th: '<strong>ข้อคิดสำคัญ:</strong> วันมาสเตอร์คือองค์ประกอบสำคัญที่สุดในแผนภูมิทั้งหมด มันกำหนดแก่นตัวตน นิสัย และวิธีที่คุณเข้าหาชีวิต',
      zh: '<strong>要点：</strong>日主是整盘最要紧的一行。它定下核心身份、性情，以及你天生如何对待人生。'
    },
    'dm.p2': {
      en: 'There are 10 possible Day Masters — one for each of the 10 Heavenly Stems. Each carries a unique combination of element (Wood, Fire, Earth, Metal, or Water) and polarity (Yin or Yang).',
      th: 'มีวันมาสเตอร์ได้ 10 แบบ — หนึ่งต่อก้านฟ้า แต่ละแบบเป็นการผสมธาตุ (ไม้ ไฟ ดิน โลหะ น้ำ) และขั้ว (หยินหรือหยาง) ที่ไม่ซ้ำ',
      zh: '日主有十种可能——对应十天干。各带一行（木火土金水）与一极（阴阳）。'
    },
    'dm.h2': { en: 'Where Is the Day Master?', th: 'วันมาสเตอร์อยู่ที่ไหน?', zh: '日主在哪里？' },
    'dm.p3': {
      en: 'Your BaZi chart has four pillars. The Day Master sits at the top of the Day Pillar — highlighted below in gold.',
      th: 'แผนภูมิปาจื้อมีสี่เสา วันมาสเตอร์อยู่บนสุดของเสาวัน — ไฮไลต์ทองด้านล่าง',
      zh: '八字有四柱。日主在日柱最上——下方以金标出。'
    },
    'dm.call2': {
      en: '<strong>Day Master:</strong> In this example, the Day Master is 壬 (Rén) — Yang Water. It sits at the Heavenly Stem position of the Day Pillar.',
      th: '<strong>วันมาสเตอร์:</strong> ในตัวอย่างนี้คือ 壬 (Rén) — น้ำหยาง อยู่ตำแหน่งก้านฟ้าของเสาวัน',
      zh: '<strong>日主：</strong>此例为壬——阳水。在日柱天干之位。'
    },
    'dm.h3': { en: 'The 10 Day Masters', th: 'สิบวันมาสเตอร์', zh: '十日主' },
    'dm.p4': { en: 'Each Day Master has a distinct personality archetype. Find yours below.', th: 'แต่ละวันมาสเตอร์มีต้นแบบนิสัยต่างกัน หาของคุณด้านล่าง', zh: '每个日主都有独特原型。在下方找你的。' },
    'dm.jia': { en: 'The mighty tree. Leadership, growth, ambition. Stands tall and grows upward relentlessly.', th: 'ต้นไม้ยิ่งใหญ่ ภาวะผู้นำ การเติบโต ความทะเยอทะยาน ยืนสูงและโตขึ้นไม่หยุด', zh: '大树。领导、生长、志向。直立向上，不肯停。' },
    'dm.yi': { en: 'The graceful vine. Flexible, diplomatic, resilient. Bends without breaking.', th: 'เถาวัลย์งาม ยืดหยุ่น ทางการทูต ทน งอได้โดยไม่หัก', zh: '藤蔓。柔韧、圆融、有弹性。弯而不折。' },
    'dm.bing': { en: 'The blazing sun. Generous, warm, radiant. Illuminates everything around them.', th: 'ดวงอาทิตย์แผด ใจกว้าง อบอุ่น ส่องสว่าง ส่องทุกอย่างรอบตัว', zh: '烈日。慷慨、温暖、光华。照亮四周。' },
    'dm.ding': { en: 'The candle flame. Thoughtful, passionate, precise. Gentle light that guides.', th: 'เปลวเทียน ใคร่ครวญ มีไฟ แม่นยำ แสงอ่อนที่นำทาง', zh: '烛火。深思、热忱、精细。柔光指路。' },
    'dm.wu': { en: 'The mountain. Stable, trustworthy, immovable. A foundation others build upon.', th: 'ภูเขา มั่นคง น่าเชื่อถือ ไม่ขยับ รากฐานที่คนอื่นสร้างทับ', zh: '山。稳、可信、难移。别人可倚的地基。' },
    'dm.ji': { en: 'The fertile soil. Nurturing, adaptable, resourceful. Grows abundance from within.', th: 'ดินอุดม เลี้ยงดู ปรับตัว ฉลาดใช้ของ งอกความอุดมจากภายใน', zh: '沃土。养人、善变通、有办法。从内里长出丰盛。' },
    'dm.geng': { en: 'The sword. Decisive, brave, righteous. Cuts through problems with clarity.', th: 'ดาบ เด็ดขาด กล้า เที่ยงธรรม ฟันปัญหาด้วยความชัด', zh: '剑。决断、勇、正。以清明斩开难题。' },
    'dm.xin': { en: 'The jewel. Refined, elegant, sensitive. Shines with inner beauty.', th: 'อัญมณี ประณีต สง่างาม อ่อนไหว ส่องด้วยความงามภายใน', zh: '珠玉。精致、优雅、敏锐。内美自光。' },
    'dm.ren': { en: 'The ocean. Wise, powerful, adventurous. Flows with unstoppable force.', th: 'มหาสมุทร ฉลาด ทรงพลัง ผจญภัย ไหลด้วยแรงที่ห้ามไม่ได้', zh: '海。智、力、敢闯。流势难挡。' },
    'dm.gui': { en: 'The morning dew. Intuitive, gentle, perceptive. Nourishes silently.', th: 'น้ำค้างเช้า สัญชาตญาณ อ่อนโยน รับรู้ บำรุงอย่างเงียบ', zh: '朝露。直觉、柔、敏锐。默默滋养。' },
    'dm.h4': { en: 'How to Find Your Day Master', th: 'หาวันมาสเตอร์อย่างไร', zh: '如何找出日主' },
    'dm.p5': { en: 'Follow these three simple steps to discover your Day Master.', th: 'ทำตามสามขั้นง่ายๆ เพื่อค้นพบวันมาสเตอร์', zh: '三步找出你的日主。' },
    'dm.s1t': { en: 'Know your exact birth date', th: 'รู้วันเกิดที่แม่น', zh: '知道精确出生日期' },
    'dm.s1p': { en: 'You need the year, month, and day. Birth time improves accuracy but is not required for the Day Master.', th: 'ต้องการปี เดือน วัน เวลาเกิดช่วยความแม่น แต่ไม่จำเป็นสำหรับวันมาสเตอร์', zh: '需要年、月、日。时辰更准，但日主不必时辰。' },
    'dm.s2t': { en: 'Calculate or look up the Day Pillar', th: 'คำนวณหรือค้นเสาวัน', zh: '排出或查出日柱' },
    'dm.s2p': { en: 'Use a BaZi calculator to convert your birth date into the Four Pillars. The Day Pillar contains two characters: a Heavenly Stem and an Earthly Branch.', th: 'ใช้เครื่องคำนวณปาจื้อแปลงวันเกิดเป็นสี่เสา เสาวันมีสองตัว: ก้านฟ้าและกิ่งดิน', zh: '用八字计算器把出生日期转成四柱。日柱两字：一天干、一地支。' },
    'dm.s3t': { en: 'Identify the Heavenly Stem', th: 'ระบุก้านฟ้า', zh: '认出天干' },
    'dm.s3p': { en: 'The top character of the Day Pillar is your Day Master. It will be one of the 10 Heavenly Stems listed above.', th: 'ตัวบนของเสาวันคือวันมาสเตอร์ จะเป็นหนึ่งในสิบก้านฟ้าด้านบน', zh: '日柱最上那个字就是日主。必是上列十天干之一。' },
    'dm.h5': { en: 'Day Master Relationships', th: 'ความสัมพันธ์ของวันมาสเตอร์', zh: '日主的五种关系' },
    'dm.p6': {
      en: 'Your Day Master does not exist in isolation. It constantly interacts with the other elements in your chart through five key relationships.',
      th: 'วันมาสเตอร์ไม่ได้อยู่โดดๆ มันมีปฏิสัมพันธ์กับธาตุอื่นในแผนภูมิผ่านห้าความสัมพันธ์หลัก',
      zh: '日主不是孤立的。它透过五种关系，不断与盘中其余五行往来。'
    },
    'dm.res': { en: 'Resource — produces you', th: 'ทรัพยากร — ให้กำเนิดคุณ', zh: '印星 — 生你' },
    'dm.res.p': { en: 'The element that generates your Day Master. Represents support, knowledge, and nurturing energy.', th: 'ธาตุที่ให้กำเนิดวันมาสเตอร์ แทนการเกื้อ ความรู้ และพลังเลี้ยงดู', zh: '生你日主的那一行。代表支持、学问与滋养。' },
    'dm.out': { en: 'Output — you produce', th: 'ผลผลิต — คุณให้กำเนิด', zh: '食伤 — 你所生' },
    'dm.out.p': { en: 'The element your Day Master creates. Represents expression, talent, and creativity.', th: 'ธาตุที่วันมาสเตอร์สร้าง แทนการแสดงออก พรสวรรค์ และความคิดสร้างสรรค์', zh: '日主所生的那一行。代表表达、才华与创造。' },
    'dm.wea': { en: 'Wealth — you control', th: 'ทรัพย์ — คุณข่ม', zh: '财星 — 你所克' },
    'dm.wea.p': { en: 'The element your Day Master overcomes. Represents material gain, ambition, and drive.', th: 'ธาตุที่วันมาสเตอร์ข่ม แทนผลกำไรทางวัตถุ ความทะเยอทะยาน และแรงขับ', zh: '日主所克的那一行。代表财、志向与驱力。' },
    'dm.pow': { en: 'Power — controls you', th: 'อำนาจ — ข่มคุณ', zh: '官杀 — 克你' },
    'dm.pow.p': { en: 'The element that overcomes your Day Master. Represents authority, discipline, and pressure.', th: 'ธาตุที่ข่มวันมาสเตอร์ แทนอำนาจ วินัย และแรงกด', zh: '克你日主的那一行。代表权柄、纪律与压力。' },
    'dm.com': { en: 'Companion — same element', th: 'เพื่อน — ธาตุเดียวกัน', zh: '比劫 — 同气' },
    'dm.com.p': { en: 'Elements matching your Day Master. Represents peers, competition, and self-confidence.', th: 'ธาตุที่ตรงวันมาสเตอร์ แทนเพื่อน การแข่งขัน และความมั่นใจ', zh: '与日主同气的那一行。代表同辈、竞争与自信。' },
    'dm.call3': {
      en: '<strong>Balance is everything.</strong> A well-balanced chart has a healthy mix of all five relationships. Too much of any one relationship creates imbalance — too much Power overwhelms, too much Wealth exhausts, and too many Companions create rivalry.',
      th: '<strong>สมดุลคือทุกอย่าง</strong> แผนภูมิที่ดีมีห้าความสัมพันธ์คละกันพอดี มากไปด้านใดด้านหนึ่งเสียสมดุล — อำนาจมากท่วม ทับทรัพย์มากหมดแรง เพื่อนมากสร้างการแข่ง',
      zh: '<strong>平衡就是一切。</strong>好盘五种关系都有。任何一种太多就会偏——官杀太过压人，财太多耗气，比劫太多成争。'
    },
    'dm.faq.q1': { en: 'How do I find my Day Master?', th: 'หาวันมาสเตอร์อย่างไร?', zh: '如何找出日主？' },
    'dm.faq.a1': {
      en: 'You need your exact birth date (year, month, day). Enter it into a BaZi calculator, which converts the date into the Four Pillars using the Chinese Sexagenary Cycle. The Heavenly Stem of your Day Pillar is your Day Master. You can use our free BaZi calculator to find yours instantly.',
      th: 'ต้องการวันเกิดที่แม่น (ปี เดือน วัน) กรอกในเครื่องคำนวณปาจื้อ ซึ่งแปลงวันที่เป็นสี่เสาด้วยรอบหกสิบปีจีน ก้านฟ้าของเสาวันคือวันมาสเตอร์ ใช้เครื่องคำนวณฟรีของเราหาได้ทันที',
      zh: '需要精确出生年月日。输入八字计算器，按六十甲子转成四柱。日柱天干即日主。可用我们的免费计算器立刻查出。'
    },
    'dm.faq.q2': { en: 'What does my Day Master mean?', th: 'วันมาสเตอร์หมายถึงอะไร?', zh: '日主代表什么？' },
    'dm.faq.a2': {
      en: 'Your Day Master reveals your fundamental nature — your personality, strengths, and how you engage with the world. For example, a Yang Wood (Jia) Day Master suggests a leadership-oriented person who grows steadily, while a Yin Water (Gui) Day Master indicates someone intuitive and perceptive. The Day Master also determines how every other element in your chart relates to you.',
      th: 'วันมาสเตอร์เผยธรรมชาติพื้นฐาน — นิสัย จุดแข็ง และวิธีเกี่ยวข้องกับโลก เช่น ไม้หยาง (Jia) ชี้คนแนวผู้นำที่โตอย่างมั่นคง ส่วนน้ำหยิน (Gui) ชี้คนสัญชาตญาณและรับรู้ วันมาสเตอร์ยังกำหนดว่าธาตุอื่นในแผนภูมิสัมพันธ์กับคุณอย่างไร',
      zh: '日主显出根本性情——性格、长处、与世界往来的方式。例如阳木（甲）日主偏领导、稳步向上；阴水（癸）日主偏直觉与敏锐。盘中其余五行如何对你，也由日主来定。'
    },
    'dm.faq.q3': { en: 'Can my Day Master change?', th: 'วันมาสเตอร์เปลี่ยนได้ไหม?', zh: '日主会变吗？' },
    'dm.faq.a3': {
      en: 'No. Your Day Master is permanently fixed at the moment of your birth. While 10-Year Luck Pillars and annual cycles bring changing influences throughout your life, your Day Master — the Heavenly Stem of the Day Pillar — never changes. It is the one constant in your entire BaZi chart.',
      th: 'ไม่ได้ วันมาสเตอร์ถูกตรึงถาวรตอนเกิด แม้เสาโชคสิบปีและรอบปีจะนำอิทธิพลที่เลื่อน วันมาสเตอร์ — ก้านฟ้าของเสาวัน — ไม่เคยเปลี่ยน มันคือค่าคงที่เดียวในแผนภูมิทั้งแผง',
      zh: '不会。日主在出生那一刻永久固定。十年大运与流年会带来变动的影响，但日柱天干永不改。它是整盘唯一的常数。'
    },
    'dm.faq.q4': { en: 'What is the strongest Day Master?', th: 'วันมาสเตอร์ที่แข็งที่สุดคืออะไร?', zh: '哪个日主最强？' },
    'dm.faq.a4': {
      en: 'No single Day Master is inherently the strongest. Strength depends on contextual factors: the season of birth, support from other pillars, and overall element balance. A Day Master born in a season that matches its element is naturally stronger. However, in BaZi, strength alone is not always desirable — a weaker Day Master in a well-balanced chart can be more favorable than an overly strong one.',
      th: 'ไม่มีวันมาสเตอร์ใดแข็งที่สุดในตัว ความแข็งขึ้นกับบริบท: ฤดูเกิด การเกื้อจากเสาอื่น และสมดุลธาตุรวม วันมาสเตอร์ที่เกิดในฤดูตรงธาตุย่อมแข็งกว่า แต่ในปาจื้อ ความแข็งอย่างเดียวไม่ใช่สิ่งพึงเสมอ — วันมาสเตอร์อ่อนในแผงสมดุลอาจดีกว่าที่แข็งเกินไป',
      zh: '没有天生最强的日主。强弱看出生季节、他柱生扶与整体五行。得令 naturally 更旺。但八字里旺不一定好——弱而平衡，往往胜过过旺。'
    },

    'page.astrology.sub': {
      en: 'Explore the ancient Chinese metaphysical systems that have guided billions of lives for over three millennia — from BaZi and the Chinese Zodiac to Five Element theory and Yin-Yang philosophy.',
      th: 'สำรวจระบบอภิปรัชญาจีนโบราณที่ชี้นำชีวิตหลายพันล้านคนกว่าสามสหัสวรรษ — จากปาจื้อและนักษัตร ถึงทฤษฎีห้าธาตุและปรัชญาหยินหยาง',
      zh: '探索三千年来引导亿万人的中国术数——从八字、生肖，到五行与阴阳。'
    },
    'as.h1': { en: 'What Is Chinese Astrology?', th: 'โหราศาสตร์จีนคืออะไร?', zh: '何为中国术数？' },
    'as.p1': {
      en: 'Chinese astrology is one of the world\'s oldest and most comprehensive divination systems, spanning more than 3,000 years of continuous practice. Unlike casual horoscopes, Chinese astrology encompasses a family of interconnected disciplines — each offering a unique lens into destiny, personality, timing, and spatial harmony.',
      th: 'โหราศาสตร์จีนเป็นหนึ่งในระบบทำนายที่เก่าแก่และครอบคลุมที่สุดในโลก ยาวนานกว่า 3,000 ปีของการปฏิบัติต่อเนื่อง ต่างจากดวงทั่วไป มันครอบคลุมครอบครัววิชาที่เชื่อมกัน — แต่ละวิชาให้เลนส์เฉพาะสู่โชคชะตา นิสัย จังหวะ และความกลมกลืนของพื้นที่',
      zh: '中国术数是世上最古老、最整全的推演系统之一，连续实践超过三千年。不同于随手星座运势，它是一组彼此相连的学问——各自打开命运、性情、时机与空间和谐的一扇窗。'
    },
    'as.call1': {
      en: '<strong>Key difference from Western astrology:</strong> Chinese astrology is built on the lunar calendar, the Five Elements (Wood, Fire, Earth, Metal, Water), and the dynamic interplay of Yin & Yang — rather than solar months and planetary positions.',
      th: '<strong>ข้อต่างจากโหราศาสตร์ตะวันตก:</strong> โหราศาสตร์จีนสร้างบนปฏิทินจันทรคติ ห้าธาตุ และการเล่นของหยินหยาง — ไม่ใช่เดือนสุริยะและตำแหน่งดาวเคราะห์',
      zh: '<strong>与西方占星的关键差别：</strong>中国术数建立在阴历、五行与阴阳往来上——而非太阳月与行星位置。'
    },
    'as.p2': {
      en: 'At its core, Chinese astrology views the universe as an interconnected web of cyclical energies. Your birth moment captures a unique snapshot of these energies — your personal cosmic blueprint — which skilled practitioners can decode to reveal your strengths, challenges, relationships, and life trajectory.',
      th: 'แก่นของโหราศาสตร์จีนมองจักรวาลเป็นใยพลังงานเป็นรอบที่เชื่อมกัน วินาทีเกิดจับภาพเฉพาะของพลังเหล่านี้ — แบบแปลนจักรวาลส่วนตัว — ที่ผู้ชำนาญถอดได้เพื่อเผยจุดแข็ง ความท้าทาย ความสัมพันธ์ และเส้นทางชีวิต',
      zh: '其核心把宇宙看成循环之气的互联之网。出生那一刻，拍下这些气的独特快照——你的个人宇宙蓝图——熟练者可解码，看见长短、关系与人生轨迹。'
    }
  };

  if (window.WoBaziI18n && typeof window.WoBaziI18n.add === 'function') {
    window.WoBaziI18n.add(C);
  } else {
    window.__WOBAZI_I18N_PENDING = Object.assign(window.__WOBAZI_I18N_PENDING || {}, C);
  }
})();
