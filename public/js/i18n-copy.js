/* Full-page copy for EN / TH / ZH. Merged into WoBaziI18n. */
(function () {
  var C = {
    'el.wood': { en: 'Wood', th: 'ไม้', zh: '木' },
    'el.fire': { en: 'Fire', th: 'ไฟ', zh: '火' },
    'el.earth': { en: 'Earth', th: 'ดิน', zh: '土' },
    'el.metal': { en: 'Metal', th: 'โลหะ', zh: '金' },
    'el.water': { en: 'Water', th: 'น้ำ', zh: '水' },
    'pol.yang': { en: 'Yang', th: 'หยาง', zh: '阳' },
    'pol.yin': { en: 'Yin', th: 'หยิน', zh: '阴' },
    'label.stem': { en: 'Stem', th: 'ก้านฟ้า', zh: '天干' },
    'label.branch': { en: 'Branch', th: 'กิ่งดิน', zh: '地支' },
    'label.year': { en: 'Year', th: 'ปี', zh: '年' },
    'label.month': { en: 'Month', th: 'เดือน', zh: '月' },
    'label.day': { en: 'Day', th: 'วัน', zh: '日' },
    'label.hour': { en: 'Hour', th: 'ชั่วโมง', zh: '时' },
    'tbl.hash': { en: '#', th: '#', zh: '#' },
    'tbl.char': { en: 'Character', th: 'ตัวอักษร', zh: '字' },
    'tbl.pinyin': { en: 'Pinyin', th: 'พินอิน', zh: '拼音' },
    'tbl.element': { en: 'Element', th: 'ธาตุ', zh: '五行' },
    'tbl.polarity': { en: 'Polarity', th: 'ขั้ว', zh: '阴阳' },
    'tbl.animal': { en: 'Animal', th: 'สัตว์', zh: '生肖' },
    'animal.rat': { en: 'Rat', th: 'หนู', zh: '鼠' },
    'animal.ox': { en: 'Ox', th: 'วัว', zh: '牛' },
    'animal.tiger': { en: 'Tiger', th: 'เสือ', zh: '虎' },
    'animal.rabbit': { en: 'Rabbit', th: 'กระต่าย', zh: '兔' },
    'animal.dragon': { en: 'Dragon', th: 'มังกร', zh: '龙' },
    'animal.snake': { en: 'Snake', th: 'งู', zh: '蛇' },
    'animal.horse': { en: 'Horse', th: 'ม้า', zh: '马' },
    'animal.goat': { en: 'Goat', th: 'แพะ', zh: '羊' },
    'animal.monkey': { en: 'Monkey', th: 'ลิง', zh: '猴' },
    'animal.rooster': { en: 'Rooster', th: 'ไก่', zh: '鸡' },
    'animal.dog': { en: 'Dog', th: 'สุนัข', zh: '狗' },
    'animal.pig': { en: 'Pig', th: 'หมู', zh: '猪' },
    'faq.title': { en: 'Frequently Asked Questions', th: 'คำถามที่พบบ่อย', zh: '常见问题' },

    'home.lead1': {
      en: 'BaZi (八字) literally means <strong>Eight Characters</strong>. It converts your exact birth date and time into a chart of eight Chinese characters — a cosmic blueprint of who you are, refined over a thousand years of Chinese metaphysics.',
      th: 'ปาจื้อ (八字) แปลตรงตัวว่า <strong>แปดตัวอักษร</strong> ระบบนี้แปลงวันและเวลาเกิดให้เป็นแผนภูมิแปดตัวอักษรจีน — แบบแปลนจักรวาลของตัวคุณ ที่ถูกขัดเกลาในวิชาอภิปรัชญาจีนมานับพันปี',
      zh: '八字字面意思是<strong>八个字</strong>。它把你精确的出生日期与时辰，转成八个汉字组成的命盘——一份关于你是谁的宇宙蓝图，历经千年中国术数打磨。'
    },
    'home.lead2': {
      en: 'Those characters sit across four pillars. Each has a Heavenly Stem above and an Earthly Branch below. The Day Stem is your <strong>Day Master</strong> — the essence of your core self.',
      th: 'ตัวอักษรเหล่านั่งบนสี่เสา แต่ละเสามีก้านฟ้าอยู่บนและกิ่งดินอยู่ล่าง ก้านของวันคือ <strong>วันมาสเตอร์</strong> — แก่นของตัวคุณ',
      zh: '这八个字分列四柱。每柱上为天干、下为地支。日干就是你的<strong>日主</strong>——核心自我的本质。'
    },
    'home.year.p': { en: 'Ancestry, social identity, the generational energy you carry', th: 'บรรพบุรุษ ตัวตนทางสังคม พลังรุ่นที่คุณถืออยู่', zh: '祖荫、社会身份、你所携带的世代之气' },
    'home.month.p': { en: 'Career climate, parents, the season that shaped you', th: 'บรรยากาศอาชีพ พ่อแม่ ฤดูที่หล่อหลอมคุณ', zh: '事业气候、父母、塑造你的时令' },
    'home.day.p': { en: 'Your Day Master — the single character that is you', th: 'วันมาสเตอร์ — ตัวอักษรเดียวที่เป็นคุณ', zh: '你的日主——那个代表你的字' },
    'home.hour.p': { en: 'Inner world, later years, the life you build after 40', th: 'โลกภายใน บั้นปลายชีวิต ชีวิตที่สร้างหลัง 40', zh: '内在世界、晚年、四十岁之后你所建立的人生' },
    'home.callout': {
      en: 'BaZi is a weather forecast, not a prison sentence. The chart shows the terrain — you still choose how to walk it.',
      th: 'ปาจื้อคือพยากรณ์อากาศ ไม่ใช่คำพิพากษา แผนภูมิชี้ภูมิประเทศ — คุณยังเลือกวิธีเดินเอง',
      zh: '八字是天气预报，不是无期徒刑。盘显示地形——怎么走，仍由你选。'
    },
    'form.name': { en: 'Name', th: 'ชื่อ', zh: '姓名' },
    'form.name.opt': { en: 'personalize your reading', th: 'ปรับการอ่านให้เป็นของคุณ', zh: '个性化你的命理' },
    'form.name.ph': { en: 'What do we call you?', th: 'เราเรียกคุณว่าอะไร?', zh: '怎么称呼你？' },
    'form.dob': { en: 'Date of Birth', th: 'วันเกิด', zh: '出生日期' },
    'form.required': { en: '*Required', th: '*จำเป็น', zh: '*必填' },
    'form.time': { en: 'Time', th: 'เวลา', zh: '时间' },
    'form.city': { en: 'Birth City', th: 'เมืองเกิด', zh: '出生城市' },
    'form.city.opt': { en: 'geographic energy', th: 'พลังงานภูมิศาสตร์', zh: '地理能量' },
    'form.city.ph': { en: 'Start typing a city...', th: 'พิมพ์ชื่อเมือง...', zh: '开始输入城市…' },
    'form.blood': { en: 'Blood Type', th: 'หมู่เลือด', zh: '血型' },
    'form.blood.opt': { en: 'personality traits', th: 'ลักษณะนิสัย', zh: '性格特征' },
    'form.gender': { en: 'Gender', th: 'เพศ', zh: '性别' },
    'form.male': { en: 'Male', th: 'ชาย', zh: '男' },
    'form.female': { en: 'Female', th: 'หญิง', zh: '女' },
    'form.unknown': { en: 'Unknown', th: 'ไม่ทราบ', zh: '未知' },
    'form.submit': { en: 'Reveal My Destiny', th: 'เปิดเผยโชคชะตา', zh: '揭示我的命运' },
    'form.time.opt': { en: 'Four Pillars', th: 'สี่เสา', zh: '四柱命盘' },

    'what.h.overview': { en: 'BaZi: The Eight Characters', th: 'ปาจื้อ: แปดตัวอักษร', zh: '八字：八个字' },
    'what.overview.p1': {
      en: 'BaZi (八字) literally means <strong>"Eight Characters"</strong> in Chinese. It is one of the oldest and most respected systems of Chinese metaphysics, with roots stretching back over a thousand years to the Tang and Song dynasties. At its core, BaZi converts your exact birth date and time into a chart of eight Chinese characters that together form a cosmic blueprint of who you are.',
      th: 'ปาจื้อ (八字) แปลตรงตัวว่า <strong>“แปดตัวอักษร”</strong> เป็นหนึ่งในระบบอภิปรัชญาจีนที่เก่าแก่และเป็นที่ยกย่องที่สุด มีรากยาวกว่าพันปีถึงราชวงศ์ถังและซ่ง แก่นของปาจื้อคือการแปลงวันและเวลาเกิดให้เป็นแผนภูมิแปดตัวอักษรที่เป็นแบบแปลนจักรวาลของตัวคุณ',
      zh: '八字字面意为<strong>“八个字”</strong>。它是中国术数中最古老、最受尊崇的体系之一，可上溯至唐宋。核心做法是把精确出生日期与时辰，转成八个汉字，合为你是谁的宇宙蓝图。'
    },
    'what.overview.p2': {
      en: 'These eight characters are arranged across <strong>Four Pillars</strong> — Year, Month, Day, and Hour — each consisting of a <em>Heavenly Stem</em> on top and an <em>Earthly Branch</em> below. Every character carries elemental energy (Wood, Fire, Earth, Metal, or Water) and a Yin or Yang polarity. The interplay between these elements reveals your innate personality, strengths, challenges, career aptitudes, relationship dynamics, and the timing of major life events.',
      th: 'แปดตัวอักษรจัดเป็น <strong>สี่เสา</strong> — ปี เดือน วัน ชั่วโมง — แต่ละเสามี <em>ก้านฟ้า</em> อยู่บนและ <em>กิ่งดิน</em> อยู่ล่าง ทุกตัวพกพลังธาตุ (ไม้ ไฟ ดิน โลหะ น้ำ) และขั้วหยินหรือหยาง การเล่นกันของธาตุเหล่านี้เผยนิสัย จุดแข็ง ความท้าทาย ทางอาชีพ ความสัมพันธ์ และจังหวะเหตุการณ์ใหญ่ในชีวิต',
      zh: '这八个字分列<strong>四柱</strong>——年、月、日、时——每柱上为<em>天干</em>、下为<em>地支</em>。每个字都带五行（木火土金水）与阴阳。五行往来，显出性情、长短、事业倾向、关系格局与重大节点的时机。'
    },
    'what.overview.p3': {
      en: 'Unlike Western astrology, which is primarily based on the position of the Sun relative to constellations, BaZi is a <strong>calendar-based system</strong> rooted in the cycles of the Chinese lunisolar calendar. It does not rely on planetary observation but rather on the deep cyclical patterns of time itself — patterns that the ancient Chinese meticulously recorded and interpreted over millennia.',
      th: 'ต่างจากโหราศาสตร์ตะวันตกที่อิงตำแหน่งดวงอาทิตย์ต่อกลุ่มดาว ปาจื้อเป็น <strong>ระบบปฏิทิน</strong> ที่ฝังในวงจรจันทรคติ-สุริยคติจีน ไม่พึ่งการเฝ้าดาวเคราะห์ แต่พึ่งลวดลายวัฏจักรของเวลาที่ชาวจีนโบราณบันทึกและตีความมานับพันปี',
      zh: '与主要依据太阳相对星座位置的西方占星不同，八字是<strong>历法体系</strong>，根植于中国阴阳合历的周期。它不靠观星，而靠时间本身的深层循环——古人千年记录与解读的那些节律。'
    },
    'what.h.pillars': { en: 'The Four Pillars (四柱 Sìzhù)', th: 'สี่เสา (四柱 Sìzhù)', zh: '四柱（Sìzhù）' },
    'what.pillars.p1': {
      en: 'Your birth data maps onto four "pillars." Each pillar has two characters — a <strong>Heavenly Stem</strong> (天干) on top and an <em>Earthly Branch</em> (地支) below. Four pillars × two characters = eight characters.',
      th: 'ข้อมูลเกิดของคุณวางลงบนสี่ “เสา” แต่ละเสามีสองตัว — <strong>ก้านฟ้า</strong> (天干) อยู่บนและ <em>กิ่งดิน</em> (地支) อยู่ล่าง สี่เสา × สองตัว = แปดตัวอักษร',
      zh: '出生数据映射为四“柱”。每柱两个字——上为<strong>天干</strong>，下为<em>地支</em>。四柱×两字＝八字。'
    },
    'what.pillars.p2': {
      en: 'The <strong>Year Pillar</strong> reflects your social identity, ancestral heritage, and the broad generational energy you carry. The <strong>Month Pillar</strong> represents your career, your parents\' influence, and the primary elemental climate of your birth season. The <strong>Day Pillar</strong> is the most personal — the Heavenly Stem of this pillar is your <em>Day Master</em>, the single character that represents your core self. The <strong>Hour Pillar</strong> relates to your inner thoughts, aspirations, and the energy that shapes your later years and legacy.',
      th: '<strong>เสาปี</strong> สะท้อนตัวตนทางสังคม มรดกบรรพบุรุษ และพลังรุ่น <strong>เสาเดือน</strong> คืออาชีพ อิทธิพลพ่อแม่ และภูมิอากาศธาตุของฤดูเกิด <strong>เสาวัน</strong> เป็นส่วนส่วนตัวที่สุด — ก้านฟ้าของเสานี้คือ <em>วันมาสเตอร์</em> ตัวอักษรเดียวที่เป็นแก่นคุณ <strong>เสาชั่วโมง</strong> เกี่ยวกับความคิดภายใน ความใฝ่ฝัน และพลังที่หล่อบั้นปลายกับมรดก',
      zh: '<strong>年柱</strong>反映社会身份、祖荫与世代之气。<strong>月柱</strong>主事业、父母影响与出生季节的五行气候。<strong>日柱</strong>最私密——此柱天干即<em>日主</em>，那个代表核心自我的字。<strong>时柱</strong>关乎内念、志向，以及塑造晚年与遗产的气。'
    },
    'what.h.stems': { en: 'The 10 Heavenly Stems (天干 Tiāngān)', th: 'สิบก้านฟ้า (天干 Tiāngān)', zh: '十天干（Tiāngān）' },
    'what.stems.p': {
      en: 'The ten Heavenly Stems cycle through the Five Elements in Yin-Yang pairs. Each Stem carries a distinct elemental quality and polarity that colors the pillar it occupies.',
      th: 'สิบก้านฟ้าวนผ่านห้าธาตุเป็นคู่หยิน-หยาง แต่ละก้านมีคุณภาพธาตุและขั้วเฉพาะที่ระบายสีเสาที่มันอยู่',
      zh: '十天干按五行、阴阳成对循环。每干都有独特的五行气质与极性，为所在之柱着色。'
    },
    'what.h.branches': { en: 'The 12 Earthly Branches (地支 Dìzhī)', th: 'สิบสองกิ่งดิน (地支 Dìzhī)', zh: '十二地支（Dìzhī）' },
    'what.branches.p': {
      en: 'The twelve Earthly Branches correspond to the twelve Chinese zodiac animals. Each Branch occupies a two-hour window within the day and a specific month within the year.',
      th: 'สิบสองกิ่งดินตรงกับสิบสองนักษัตร แต่ละกิ่งครองหน้าต่างสองชั่วโมงในวัน และเดือนเฉพาะในปี',
      zh: '十二地支对应十二生肖。每支占一日中两个时辰、一年中特定月份。'
    },
    'what.h.elements': { en: 'The Five Elements (五行 Wǔxíng)', th: 'ห้าธาตุ (五行 Wǔxíng)', zh: '五行（Wǔxíng）' },
    'what.elements.p1': {
      en: 'The Five Elements are the energetic building blocks of the BaZi system. Every character in your chart belongs to one of five elemental families, and the way these elements interact with each other reveals the fundamental dynamics of your personality and life trajectory.',
      th: 'ห้าธาตุคืออิฐพลังงานของระบบปาจื้อ ทุกตัวในแผนภูมิสังกัดหนึ่งในห้าตระกูลธาตุ และวิธีที่ธาตุมีปฏิสัมพันธ์กันเผยพลวัตพื้นฐานของนิสัยและเส้นทางชีวิต',
      zh: '五行是八字的能量砌块。盘中每个字都属于五行之家，它们如何往来，显出性情与人生轨迹的底层动力学。'
    },
    'what.h.prod': { en: 'Production Cycle (相生 Xiāngshēng)', th: 'วงจรเกื้อ (相生 Xiāngshēng)', zh: '相生（Xiāngshēng）' },
    'what.prod.p1': {
      en: 'In the Production Cycle, each element nurtures and gives rise to the next in a continuous loop of creation:',
      th: 'ในวงจรเกื้อ แต่ละธาตุบำรุงและให้กำเนิดธาตุถัดไปเป็นวงสร้างที่ไม่ขาด:',
      zh: '相生之中，每一行滋养并生出下一行，形成不断的创生环：'
    },
    'what.prod.p2': {
      en: 'When an element in your chart is supported by its "mother" element (the one that produces it), that area of life tends to flourish naturally. A strong Production flow indicates talents that develop effortlessly.',
      th: 'เมื่อธาตุในแผนภูมิได้แม่ธาตุเกื้อ (ธาตุที่ให้กำเนิดมัน) ด้านนั้นของชีวิตมักผลิบานเอง กระแสเกื้อที่แข็งแปลว่าพรสวรรค์ที่งอกโดยไม่ฝืน',
      zh: '盘中一行若得其“母”（生它的那一行）相助，那一块人生往往自然兴旺。相生流畅，表示不费力就能长成的才能。'
    },
    'what.h.ctrl': { en: 'Control Cycle (相克 Xiāngkè)', th: 'วงจรข่ม (相克 Xiāngkè)', zh: '相克（Xiāngkè）' },
    'what.ctrl.p1': {
      en: 'The Control Cycle represents restraint and discipline — each element keeps another in check:',
      th: 'วงจรข่มคือการยั้งและวินัย — แต่ละธาตุเหนี่ยวธาตุอื่นไว้:',
      zh: '相克代表约束与纪律——每一行制衡另一行：'
    },
    'what.ctrl.p2': {
      en: 'Control is not inherently negative — it provides necessary structure and balance. A chart with healthy control relationships shows a person who can handle challenges with discipline. However, excessive control on a weak element can indicate areas of struggle or blockage.',
      th: 'การข่มไม่ใช่เรื่องเลวในตัว — มันให้โครงและสมดุล แผนภูมิที่มีการข่มที่พอดีแสดงคนที่รับความท้าทายด้วยวินัย แต่ถ้าข่มมากเกินไปบนธาตุอ่อน อาจชี้จุดติดขัด',
      zh: '克并非天生负面——它提供必要的结构与平衡。克泄得宜的盘，显出能以纪律应事的人。但弱行若被过度克制，往往就是卡关之处。'
    },
    'what.h.yy': { en: 'Yin & Yang (阴阳 Yīnyáng)', th: 'หยินและหยาง (阴阳 Yīnyáng)', zh: '阴阳（Yīnyáng）' },
    'what.yy.p1': {
      en: 'Every element in BaZi appears in two polarities — <strong>Yang</strong> (阳) and <strong>Yin</strong> (阴). Yang energy is outward, active, and expansive; Yin energy is inward, receptive, and subtle. The same element expresses itself very differently depending on its polarity.',
      th: 'ทุกธาตุในปาจื้อมีสองขั้ว — <strong>หยาง</strong> (阳) และ <strong>หยิน</strong> (阴) หยางออกนอก ขยัน ขยาย หยินเข้าใน รับ และละเอียด ธาตุเดียวกันแสดงตนต่างกันมากตามขั้ว',
      zh: '八字里每一行都有两极——<strong>阳</strong>与<strong>阴</strong>。阳外向、主动、开张；阴内收、受纳、细微。同一行因极性不同，活法大不一样。'
    },
    'what.yy.p2': {
      en: 'For example, <strong>Yang Wood</strong> (甲 Jiǎ) is like a towering oak tree — strong, upright, and unyielding. <strong>Yin Wood</strong> (乙 Yǐ) is like a climbing vine — flexible, adaptive, and graceful. Both are Wood, but their character is fundamentally different.',
      th: 'เช่น <strong>ไม้หยาง</strong> (甲 Jiǎ) เหมือนต้นโอ๊กสูง — แข็ง ตั้งตรง ไม่ยอมงอ <strong>ไม้หยิน</strong> (乙 Yǐ) เหมือนเถาวัลย์ — ยืดหยุ่น ปรับตัว งาม ทั้งคู่เป็นไม้ แต่บุคลิกต่างกันโดยราก',
      zh: '例如<strong>阳木</strong>（甲）如参天大树——刚直不屈。<strong>阴木</strong>（乙）如藤蔓——柔韧、善变、有姿。同为木，性情根本不同。'
    },
    'what.yy.p3': {
      en: 'This Yin-Yang distinction doubles the nuance of the Five Elements, giving BaZi ten distinct Day Master archetypes rather than just five. The balance of Yin and Yang across your chart also reveals whether you tend toward assertive action or reflective strategy — and where you may need to cultivate the opposite quality for greater harmony.',
      th: 'ขั้วหยินหยางทำให้ห้าธาตุละเอียดขึ้นเป็นสิบต้นแบบวันมาสเตอร์ ไม่ใช่แค่ห้า สมดุลหยินหยางทั่วแผนภูมิยังบอกว่าคุณโน้มไปทางลงมือชัด หรือกลยุทธ์ใคร่ครวญ — และจุดที่ควรเพาะคุณภาพตรงข้ามเพื่อความกลมกลืน',
      zh: '这一阴阳之分，把五行的层次加倍，使日主有十种原型而非五种。盘中阴阳的比重，也显出你更倾向进取还是内省——以及何处需要补上另一极，以求更和谐。'
    },
    'what.yang.sub': { en: 'Active, Expansive, Outward<br>Bold, Direct, Initiating', th: 'คล่อง ขยาย ออกนอก<br>กล้า ตรง ริเริ่ม', zh: '主动、开张、向外<br>果敢、直接、开创' },
    'what.yin.sub': { en: 'Receptive, Subtle, Inward<br>Flexible, Reflective, Nurturing', th: 'รับ ละเอียด เข้าใน<br>ยืดหยุ่น พินิจ เลี้ยงดู', zh: '受纳、细微、向内<br>柔韧、内省、滋养' },
    'what.h.zodiac': { en: 'The Chinese Zodiac (十二生肖 Shí\'èr Shēngxiào)', th: 'นักษัตรจีน (十二生肖)', zh: '十二生肖' },
    'what.zodiac.p1': {
      en: 'The twelve Chinese zodiac animals correspond directly to the twelve Earthly Branches. Your zodiac animal is determined by your Year Branch, though animals also appear in your Month, Day, and Hour pillars — giving each person up to four animal energies in their chart.',
      th: 'สิบสองนักษัตรตรงกับสิบสองกิ่งดิน สัตว์ปีของคุณมาจากกิ่งปี แต่สัตว์ยังอยู่ในเสาเดือน วัน และชั่วโมง — คนหนึ่งอาจมีได้ถึงสี่พลังสัตว์ในแผนภูมิ',
      zh: '十二生肖直接对应十二地支。年支定你的生肖，但月、日、时支也会藏动物——一个人盘里最多可有四种动物之气。'
    },
    'what.zodiac.p2': {
      en: 'Each animal carries distinct personality traits, compatibility patterns, and lucky attributes. The twelve-year cycle means each animal returns every twelve years, but the elemental overlay (Wood Rat vs. Fire Rat, for example) creates a full sixty-year grand cycle before any combination repeats.',
      th: 'แต่ละสัตว์มีนิสัย แพทเทิร์นความเข้ากัน และของมงคลเป็นของตน รอบสิบสองปีทำให้สัตว์กลับมาทุกสิบสองปี แต่ชั้นธาตุทับ (หนูไม้กับหนูไฟ) ทำให้ครบหกสิบปีกว่าคู่ใดจะซ้ำ',
      zh: '每种动物自有性情、合冲与吉祥属性。十二年一回头，但五行叠加（木鼠不同于火鼠）要满六十年，组合才会重来。'
    },
    'what.h.dm': { en: 'The Day Master (日主 Rìzhǔ)', th: 'วันมาสเตอร์ (日主 Rìzhǔ)', zh: '日主（Rìzhǔ）' },
    'what.dm.p1': {
      en: 'Of the eight characters in your BaZi chart, the single most important one is the <strong>Heavenly Stem of your Day Pillar</strong> — known as the Day Master. This character is considered the essence of who you are. It determines your elemental identity and serves as the reference point for interpreting every other character in the chart.',
      th: 'ในแปดตัวอักษร ตัวสำคัญที่สุดคือ <strong>ก้านฟ้าของเสาวัน</strong> — วันมาสเตอร์ ถือเป็นแก่นของตัวคุณ กำหนดอัตลักษณ์ธาตุ และเป็นจุดอ้างอิงในการอ่านตัวอื่นทั้งหมด',
      zh: '八个字里最要紧的，是<strong>日柱天干</strong>——日主。它被当作你是谁的本质，定下五行身份，也是解读盘中其余字的参照。'
    },
    'what.dm.p2': { en: 'There are ten possible Day Masters, one for each Heavenly Stem. Each carries its own archetype:', th: 'มีวันมาสเตอร์ได้สิบแบบ หนึ่งต่อก้านฟ้า แต่ละแบบมีต้นแบบของตน:', zh: '日主有十种可能，各应一天干，各有原型：' },
    'what.dm.p3': {
      en: 'Your Day Master\'s strength — whether it is well-supported or depleted by surrounding elements — determines the overall strategy for interpreting your chart. A strong Day Master benefits from elements that challenge and channel its energy, while a weak Day Master thrives when it receives support and nourishment from allies.',
      th: 'ความแข็งของวันมาสเตอร์ — ว่าได้เกื้อหรือถูกพร่องจากธาตุรอบข้าง — กำหนดกลยุทธ์การอ่านทั้งแผง วันมาสเตอร์แข็งได้ประโยชน์จากธาตุที่ท้าทายและระบายพลัง ส่วนที่อ่อนรุ่งเมื่อได้เกื้อและบำรุงจากพันธมิตร',
      zh: '日主强弱——四周是帮还是泄——决定整盘的解读策略。日主强，宜有克泄疏通；日主弱，宜有生扶来养。'
    },
    'what.dm.link': { en: 'Explore the full Day Master guide →', th: 'อ่านคู่มือวันมาสเตอร์ฉบับเต็ม →', zh: '阅读完整日主指南 →' },
    'what.h.compat': { en: 'BaZi Compatibility (合婚 Héhūn)', th: 'ความเข้ากันทางปาจื้อ (合婚 Héhūn)', zh: '八字合婚（Héhūn）' },
    'what.compat.p1': {
      en: 'BaZi compatibility analysis has been used for centuries to evaluate the harmony between two individuals — whether for romantic relationships, business partnerships, or friendships. Rather than simply matching zodiac animals, a thorough compatibility reading compares the <em>full elemental profiles</em> of both charts.',
      th: 'การอ่านความเข้ากันด้วยปาจื้อใช้มานานหลายศตวรรษ เพื่อดูความกลมกลืนระหว่างสองคน — รัก ธุรกิจ หรือมิตรภาพ ไม่ใช่แค่จับคู่นักษัตร การอ่านที่ครบเทียบ <em>โปรไฟล์ธาตุทั้งแผง</em> ของทั้งสองดวง',
      zh: '八字合婚用了数百年，衡量两人之间的和谐——爱情、事业或友情。真正细读不是只配生肖，而是比较两盘的<em>完整五行结构</em>。'
    },
    'what.compat.p2': { en: 'Key factors in compatibility analysis include:', th: 'ปัจจัยสำคัญในการอ่านความเข้ากัน ได้แก่:', zh: '合婚细读通常看：' },
    'what.compat.li1': { en: '<strong>Elemental balance:</strong> Do the two charts complement each other\'s elemental excesses and deficiencies?', th: '<strong>สมดุลธาตุ:</strong> สองแผนภูมิเติมส่วนเกินและส่วนขาดของกันและกันหรือไม่?', zh: '<strong>五行平衡：</strong>两盘是否互补过与不及？' },
    'what.compat.li2': { en: '<strong>Day Master interaction:</strong> How do the two Day Masters relate — do they support, control, or clash?', th: '<strong>ปฏิสัมพันธ์วันมาสเตอร์:</strong> สองวันมาสเตอร์เกื้อ ข่ม หรือปะทะกัน?', zh: '<strong>日主往来：</strong>两日主是生、克，还是冲？' },
    'what.compat.li3': { en: '<strong>Zodiac harmony:</strong> Traditional animal compatibility and clash relationships (e.g., Rat and Ox are allies; Rat and Horse clash).', th: '<strong>ความกลมกลืนนักษัตร:</strong> คู่และปะทะตามประเพณี (เช่น หนูกับวัวเป็นพันธมิตร หนูกับม้าปะทะ)', zh: '<strong>生肖和合：</strong>传统合冲（如鼠牛合、鼠马冲）。' },
    'what.compat.li4': { en: '<strong>Branch combinations:</strong> Certain Branch pairings create powerful elemental bonds known as "Six Harmonies" or "Three Harmonies."', th: '<strong>การรวมกิ่ง:</strong> คู่กิ่งบางคู่สร้างพันธะธาตุแรง เรียก “หกฮาร์โมนี” หรือ “สามฮาร์โมนี”', zh: '<strong>地支会合：</strong>某些支会成六合或三合，结成强五行纽带。' },
    'what.compat.link': { en: 'Check your compatibility →', th: 'ตรวจความเข้ากันของคุณ →', zh: '查看合婚 →' },
    'what.h.how': { en: 'How a BaZi Reading Works', th: 'การอ่านปาจื้อทำอย่างไร', zh: '八字如何起盘' },
    'what.how.p': {
      en: 'Whether you consult a traditional BaZi master or use a modern calculator, the process follows the same fundamental steps:',
      th: 'ไม่ว่าจะปรึกษาอาจารย์ปาจื้อดั้งเดิมหรือใช้เครื่องคำนวณสมัยใหม่ ขั้นตอนพื้นฐานเหมือนกัน:',
      zh: '无论问传统命师还是用现代排盘，步骤本质相同：'
    },
    'what.how.1t': { en: 'Enter Your Birth Data', th: 'กรอกข้อมูลเกิด', zh: '填写出生资料' },
    'what.how.1p': { en: 'Provide your exact date of birth (year, month, day) and, if known, your birth hour. The more precise the data, the more accurate the reading — especially the Hour Pillar.', th: 'ให้วันเกิดที่แม่น (ปี เดือน วัน) และชั่วโมงถ้าทราบ ยิ่งแม่น การอ่านยิ่งตรง โดยเฉพาะเสาชั่วโมง', zh: '提供精确出生年月日，若知时辰更好。资料越准，盘越准——尤其时柱。' },
    'what.how.2t': { en: 'Chart Calculation', th: 'คำนวณแผนภูมิ', zh: '起盘' },
    'what.how.2p': { en: 'Your birth data is converted into the Chinese calendar system. The Heavenly Stems and Earthly Branches for each of the Four Pillars are determined using traditional astronomical algorithms.', th: 'ข้อมูลเกิดถูกแปลงเข้าปฏิทินจีน ก้านฟ้าและกิ่งดินของทั้งสี่เสาคำนวณด้วยอัลกอริทึมดาราศาสตร์ดั้งเดิม', zh: '把出生数据转入中国历法。四柱天干地支，按传统历算排出。' },
    'what.how.3t': { en: 'Identify Your Day Master', th: 'ระบุวันมาสเตอร์', zh: '定日主' },
    'what.how.3p': { en: 'The Heavenly Stem of your Day Pillar becomes the anchor of the entire reading. Its element and polarity define your core archetype.', th: 'ก้านฟ้าของเสาวันเป็นหลักสมอของการอ่านทั้งชุด ธาตุและขั้วของมันกำหนดต้นแบบแก่นคุณ', zh: '日柱天干成为整盘之锚。其五行与阴阳，定下你的核心原型。' },
    'what.how.4t': { en: 'Elemental Analysis', th: 'วิเคราะห์ธาตุ', zh: '五行分析' },
    'what.how.4p': { en: 'Count and weigh the distribution of the Five Elements across all eight characters. Identify which elements dominate, which are missing, and how the production and control cycles flow through the chart.', th: 'นับและชั่งห้าธาตุทั้งแปดตัว ดูว่าธาตุใดเด่น ธาตุใดขาด และวงจรเกื้อ-ข่มไหลในแผนภูมิอย่างไร', zh: '计八字中五行的轻重。看何行旺、何行缺，以及生克如何在盘中走动。' },
    'what.how.5t': { en: 'Interpretation & Guidance', th: 'ตีความและคำแนะนำ', zh: '解读与指引' },
    'what.how.5p': { en: 'Synthesize the elemental interactions into actionable insights about personality, relationships, career direction, health tendencies, and the timing of opportunities and challenges through Luck Pillars and annual cycles.', th: 'สังเคราะห์ปฏิสัมพันธ์ธาตุเป็นข้อคิดที่ใช้ได้จริงเรื่องนิสัย ความสัมพันธ์ ทิศทางอาชีพ แนวโน้มสุขภาพ และจังหวะโอกาส-อุปสรรคผ่านเสาโชคสิบปีและปีรายปี', zh: '把五行往来收成可行动的洞察：性情、关系、事业方向、健康倾向，以及大运流年里机会与考验的时机。' },
    'what.faq.q1': { en: 'What does BaZi mean?', th: 'ปาจื้อแปลว่าอะไร?', zh: '八字是什么意思？' },
    'what.faq.a1': {
      en: 'BaZi (八字) literally translates to "Eight Characters" in Chinese. It refers to the eight Chinese characters — two for each of the Four Pillars (Year, Month, Day, Hour) — derived from your exact date and time of birth. Together, these characters form a cosmic blueprint of your personality, strengths, challenges, and life path.',
      th: 'ปาจื้อ (八字) แปลว่า “แปดตัวอักษร” คือแปดตัวอักษรจีน — สองตัวต่อเสาในสี่เสา (ปี เดือน วัน ชั่วโมง) — ได้จากวันและเวลาเกิด รวมกันเป็นแบบแปลนจักรวาลของนิสัย จุดแข็ง ความท้าทาย และเส้นทางชีวิต',
      zh: '八字字面即“八个字”。指由精确出生日期与时辰推出的八个汉字——四柱（年月日时）各两字。合在一起，就是性情、长短、课题与人生路径的宇宙蓝图。'
    },
    'what.faq.q2': { en: 'How is a BaZi chart calculated?', th: 'แผนภูมิปาจื้อคำนวณอย่างไร?', zh: '八字盘如何排出？' },
    'what.faq.a2': {
      en: 'A BaZi chart is calculated by converting your birth date and time into the traditional Chinese calendar system. Each of the Four Pillars (Year, Month, Day, Hour) is expressed as a pair of characters: one Heavenly Stem and one Earthly Branch. The Heavenly Stems cycle through ten characters linked to the Five Elements and Yin/Yang polarity, while the Earthly Branches cycle through twelve characters associated with the Chinese zodiac animals.',
      th: 'แผนภูมิปาจื้อคำนวณโดยแปลงวันและเวลาเกิดเข้าปฏิทินจีนดั้งเดิม แต่ละเสาในสี่เสาเป็นคู่ตัวอักษร: ก้านฟ้าหนึ่งและกิ่งดินหนึ่ง ก้านฟ้าวนสิบตัวที่ผูกห้าธาตุและหยินหยาง กิ่งดินวนสิบสองตัวที่ผูกนักษัตร',
      zh: '把出生日期与时辰转入传统历法。四柱各以一对字表示：一天干、一地支。天干十个，配五行阴阳；地支十二个，配生肖。'
    },
    'what.faq.q3': { en: 'What are the Five Elements in BaZi?', th: 'ห้าธาตุในปาจื้อคืออะไร?', zh: '八字里的五行是什么？' },
    'what.faq.a3': {
      en: 'The Five Elements (五行 Wuxing) are Wood, Fire, Earth, Metal, and Water. They form two key cycles: the Production Cycle, where each element nourishes the next, and the Control Cycle, where each element restrains another. The balance or imbalance of these elements in your chart reveals core aspects of your personality and fortune.',
      th: 'ห้าธาตุ (五行) คือไม้ ไฟ ดิน โลหะ น้ำ มีสองวงจรหลัก: วงจรเกื้อที่ธาตุบำรุงธาตุถัดไป และวงจรข่มที่ธาตุเหนี่ยวอีกธาตุ สมดุลหรือไม่สมดุลในแผนภูมิเผยแก่นนิสัยและโชค',
      zh: '五行是木火土金水。有两个关键循环：相生（一行养下一行）与相克（一行制约另一行）。盘中五行的平与偏，显出性情与运势的底色。'
    },
    'what.faq.q4': { en: 'What is a Day Master in BaZi?', th: 'วันมาสเตอร์ในปาจื้อคืออะไร?', zh: '什么是日主？' },
    'what.faq.a4': {
      en: 'The Day Master (日主 Rizhu) is the Heavenly Stem of your Day Pillar. It is considered the most important single character in your entire BaZi chart because it represents your core self — your innate personality, temperament, and how you relate to the world. All other elements in the chart are interpreted in relation to your Day Master.',
      th: 'วันมาสเตอร์ (日主) คือก้านฟ้าของเสาวัน ถือเป็นตัวอักษรสำคัญที่สุดในแผนภูมิ เพราะแทนแก่นคุณ — นิสัยโดยกำเนิด อารมณ์ และวิธีสัมพันธ์กับโลก ธาตุอื่นทั้งหมดถูกอ่านเทียบกับวันมาสเตอร์',
      zh: '日主是日柱天干。它被看作整盘最要紧的一个字，代表核心自我——性情、气质、与世界往来的方式。盘中其余字，都相对日主来读。'
    },
    'what.faq.q5': { en: 'Can BaZi predict compatibility between two people?', th: 'ปาจื้อทำนายความเข้ากันของสองคนได้ไหม?', zh: '八字能看两人合不合吗？' },
    'what.faq.a5': {
      en: 'Yes. BaZi compatibility analysis compares the charts of two individuals by examining how their elements interact. Complementary elemental balances often indicate harmony — for example, if one person has an excess of Wood and the other needs Wood, they naturally support each other. The Chinese zodiac animals in each chart also carry traditional compatibility and clash relationships that provide further insight into relationship dynamics.',
      th: 'ได้ การอ่านความเข้ากันเทียบแผนภูมิสองคนว่าธาตุมีปฏิสัมพันธ์อย่างไร สมดุลที่เติมกันมักชี้ความกลมกลืน — เช่น คนหนึ่งไม้เกิน อีกคนต้องการไม้ ทั้งคู่เกื้อกันตามธรรมชาติ นักษัตรในแต่ละแผงยังมีคู่และปะทะตามประเพณีที่ให้มุมเพิ่มเรื่องพลวัตความสัมพันธ์',
      zh: '可以。合婚是比较两盘五行如何往来。互补的过与不及往往显和谐——例如一人木旺、一人需木，便自然相帮。各盘生肖还有传统合冲，再补一层关系线索。'
    },

    'fp.hero.sub': {
      en: 'The complete guide to BaZi — the ancient Chinese system that decodes your personality, relationships, career, and life cycles from eight characters derived from your birth date and time.',
      th: 'คู่มือปาจื้อฉบับเต็ม — ระบบจีนโบราณที่ถอดนิสัย ความสัมพันธ์ อาชีพ และรอบชีวิต จากแปดตัวอักษรที่ได้จากวันและเวลาเกิด',
      zh: '八字全解——以出生日期与时辰推出的八个字，解读性情、关系、事业与人生周期的古代中国体系。'
    },
    'fp.h1': { en: 'What Are the Four Pillars?', th: 'สี่เสาคืออะไร?', zh: '何为四柱？' },
    'fp.s1.p1': {
      en: 'The Four Pillars of Destiny, known as BaZi (八字) in Chinese, is one of the most sophisticated systems in Chinese metaphysics. Rooted in over 3,000 years of observation and refinement, it transforms the exact moment of your birth into a structured energetic blueprint composed of four pillars — Year, Month, Day, and Hour.',
      th: 'สี่เสาแห่งโชคชะตา หรือปาจื้อ (八字) เป็นระบบที่ละเอียดที่สุดในอภิปรัชญาจีนระบบหนึ่ง ฝังในการสังเกตและขัดเกลาสามพันปี มันแปลงวินาทีเกิดให้เป็นพิมพ์เขียวพลังงานสี่เสา — ปี เดือน วัน ชั่วโมง',
      zh: '四柱命理，中文称八字，是中国术数里最精密的体系之一。历经三千余年观察与打磨，把出生那一刻收成四柱——年、月、日、时——的能量蓝图。'
    },
    'fp.s1.call': {
      en: '<strong>八字 (BaZi) literally means "Eight Characters."</strong> Each of the four pillars contains two characters — a Heavenly Stem and an Earthly Branch — producing eight characters total. These eight characters encode the elemental forces that shape your destiny.',
      th: '<strong>八字 (ปาจื้อ) แปลว่า “แปดตัวอักษร”</strong> แต่ละเสามีสองตัว — ก้านฟ้ากับกิ่งดิน — รวมแปดตัว แปดตัวนี้เข้ารหัสแรงธาตุที่หล่อโชคชะตา',
      zh: '<strong>八字字面即“八个字”。</strong>四柱各含两字——天干与地支——共八字。这八字编码塑造命运的五行之力。'
    },
    'fp.s1.p2': {
      en: 'Unlike Western astrology, which maps planets against constellations, BaZi is grounded in the Chinese calendar and the Five Elements (Wood, Fire, Earth, Metal, Water). Every element interacts through cycles of production and control, creating a dynamic portrait of strengths, weaknesses, and life timing.',
      th: 'ต่างจากโหราศาสตร์ตะวันตกที่วางดาวเคราะห์บนกลุ่มดาว ปาจื้อยึดปฏิทินจีนและห้าธาตุ ทุกธาตุมีปฏิสัมพันธ์ผ่านวงจรเกื้อและข่ม สร้างภาพเคลื่อนของจุดแข็ง จุดอ่อน และจังหวะชีวิต',
      zh: '与把行星对照星座的西方占星不同，八字立足中国历法与五行。生克循环里，长短与人生时机的动态肖像得以成形。'
    },
    'fp.h2': { en: 'The Four Pillars Explained', th: 'อธิบายสี่เสา', zh: '四柱分说' },
    'fp.s2.p': {
      en: 'Each pillar governs a different domain of life and corresponds to a specific age range. Together, the four pillars create a complete map of your energetic inheritance, social role, core identity, and hidden potential.',
      th: 'แต่ละเสาครองโดเมนชีวิตต่างกันและช่วงอายุต่างกัน รวมกันเป็นแผนที่มรดกพลังงาน บทบาทสังคม แก่นตัวตน และศักยภาพซ่อน',
      zh: '每柱主一片人生、一段年龄。四柱合起来，是能量祖荫、社会角色、核心身份与潜藏可能的全图。'
    },
    'fp.year.t': { en: 'Year Pillar', th: 'เสาปี', zh: '年柱' },
    'fp.year.s': { en: 'Ancestors & Heritage', th: 'บรรพบุรุษและมรดก', zh: '祖荫与背景' },
    'fp.year.p': { en: 'Governs family background, social environment, and early influences. Reflects the energy you inherited.', th: 'ครองพื้นครอบครัว สภาพสังคม และอิทธิพลวัยต้น สะท้อนพลังที่คุณได้รับมา', zh: '主家世、社会环境与早年影响。映出你所继承的气。' },
    'fp.year.a': { en: 'Ages 1–16', th: 'อายุ 1–16', zh: '1–16 岁' },
    'fp.month.t': { en: 'Month Pillar', th: 'เสาเดือน', zh: '月柱' },
    'fp.month.s': { en: 'Career & Authority', th: 'อาชีพและอำนาจ', zh: '事业与权柄' },
    'fp.month.p': { en: 'Governs parents, career path, and social standing. Often considered the strongest pillar for professional destiny.', th: 'ครองพ่อแม่ เส้นทางอาชีพ และฐานะทางสังคม มักถือเป็นเสาที่แรงสุดเรื่องชะตาอาชีพ', zh: '主父母、事业与社会地位。常被视为事业命运最强的一柱。' },
    'fp.month.a': { en: 'Ages 17–32', th: 'อายุ 17–32', zh: '17–32 岁' },
    'fp.day.t': { en: 'Day Pillar', th: 'เสาวัน', zh: '日柱' },
    'fp.day.s': { en: 'Self & Spouse', th: 'ตนและคู่', zh: '自我与配偶' },
    'fp.day.p': { en: 'The Day Stem is your Day Master — your true elemental identity. The Day Branch reveals your relationship with your spouse or partner.', th: 'ก้านวันคือวันมาสเตอร์ — อัตลักษณ์ธาตุแท้ กิ่งวันเผยความสัมพันธ์กับคู่', zh: '日干即日主——真正的五行身份。日支显与配偶或伴侣的关系。' },
    'fp.day.a': { en: 'Ages 33–48', th: 'อายุ 33–48', zh: '33–48 岁' },
    'fp.hour.t': { en: 'Hour Pillar', th: 'เสาชั่วโมง', zh: '时柱' },
    'fp.hour.s': { en: 'Children & Subconscious', th: 'ลูกและจิตใต้สำนึก', zh: '子女与潜意识' },
    'fp.hour.p': { en: 'Governs your inner world, aspirations, children, and legacy. It reveals the deepest layer of your character and later life path.', th: 'ครองโลกภายใน ความใฝ่ฝัน ลูก และมรดก เผยชั้นลึกสุดของนิสัยและเส้นทางบั้นปลาย', zh: '主内心、志向、子女与遗产。显性格最深层与晚年路。' },
    'fp.hour.a': { en: 'Ages 49+', th: 'อายุ 49+', zh: '49 岁以后' },
    'fp.h3': { en: 'The Ten Heavenly Stems (天干)', th: 'สิบก้านฟ้า (天干)', zh: '十天干' },
    'fp.s3.p': {
      en: 'The Heavenly Stems represent celestial energy flowing downward. There are ten stems — two for each of the Five Elements, one Yang (active, expansive) and one Yin (receptive, refined). Your Day Stem is your Day Master, the single most important character in your entire chart.',
      th: 'ก้านฟ้าคือพลังสวรรค์ที่ไหลลง มีสิบก้าน — สองต่อธาตุ หนึ่งหยาง (คล่อง ขยาย) หนึ่งหยิน (รับ ประณีต) ก้านวันคือวันมาสเตอร์ ตัวสำคัญที่สุดในแผนภูมิ',
      zh: '天干是自上而下的天气。十干——五行各二，一阳一阴。日干即日主，整盘最要紧的一个字。'
    },
    'fp.h4': { en: 'The Twelve Earthly Branches (地支)', th: 'สิบสองกิ่งดิน (地支)', zh: '十二地支' },
    'fp.s4.p': {
      en: 'The Earthly Branches represent terrestrial energy rising upward. Each branch corresponds to one of the twelve Chinese zodiac animals and carries its own elemental charge. The interplay between Stems above and Branches below is the foundation of BaZi analysis.',
      th: 'กิ่งดินคือพลังปฐพีที่พุ่งขึ้น แต่ละกิ่งตรงนักษัตรหนึ่งและมีประจุธาตุของตน การเล่นกันระหว่างก้านบนกับกิ่งล่างคือรากฐานการอ่านปาจื้อ',
      zh: '地支是自下而上的地气。十二支各应一生肖，各带五行。上干下支的往来，是八字分析的地基。'
    },
    'fp.h5': { en: 'How Pillars Interact', th: 'เสามีปฏิสัมพันธ์อย่างไร', zh: '柱与柱如何往来' },
    'fp.s5.p': {
      en: 'A BaZi chart is far more than eight isolated characters. The stems and branches within and across pillars form dynamic relationships — combinations that enhance energy and clashes that create tension. Understanding these interactions is what separates a surface reading from a deep one.',
      th: 'แผนภูมิปาจื้อไม่ใช่แปดตัวโดดๆ ก้านและกิ่งในเสาและข้ามเสาสร้างความสัมพันธ์เคลื่อน — การรวมที่เสริมพลัง และการปะทะที่สร้างแรงตึง การเข้าใจปฏิสัมพันธ์นี้แยกการอ่านผิวจากการอ่านลึก',
      zh: '八字远不止八个孤立的字。柱内柱间的干支会合成冲，增强或制造张力。懂这些往来，才从皮相读到深处。'
    },
    'fp.stemcomb': { en: 'Stem Combinations', th: 'การรวมก้าน', zh: '天干化合' },
    'fp.s5.p2': {
      en: 'Certain Heavenly Stem pairs merge to produce a new element when they appear together in a chart. These transformations can dramatically shift the elemental balance — a chart that looks Fire-heavy on the surface may actually be producing Earth through stem combination.',
      th: 'คู่ก้านฟ้าบางคู่รวมกันเกิดธาตุใหม่เมื่อปรากฏด้วยกัน การแปรนี้ขยับสมดุลธาตุได้มาก — แผงที่ดูไฟหนักผิวอาจกำลังผลิตดินผ่านการรวมก้าน',
      zh: '某些天干成对出现会化合出新一行。这种变化能大幅改写五行比重——表面火旺的盘，或因合化而在生土。'
    },
    'fp.clashes.cap': { en: 'The Six Clashes (六冲) — Branch pairs that create friction and disruption', th: 'หกปะทะ (六冲) — คู่กิ่งที่สร้างแรงเสียดและสะดุด', zh: '六冲——造成摩擦与扰动的地支对' },
    'fp.harmonies': {
      en: '<strong>Six Harmonies (六合) — Branch Combinations.</strong> When specific branch pairs appear together, they harmonize and may transform into a new element: 子丑 (Water), 寅亥 (Wood), 卯戌 (Fire), 辰酉 (Metal), 巳申 (Water), 午未 (Fire). These combinations strengthen chart flow and reveal hidden alliances between pillars.',
      th: '<strong>หกฮาร์โมนี (六合) — การรวมกิ่ง</strong> เมื่อคู่กิ่งเฉพาะปรากฏด้วยกัน พวกมันกลมกลืนและอาจแปรเป็นธาตุใหม่: 子丑 (น้ำ) 寅亥 (ไม้) 卯戌 (ไฟ) 辰酉 (โลหะ) 巳申 (น้ำ) 午未 (ไฟ) การรวมนี้เสริมการไหลของแผนภูมิและเผยพันธมิตรซ่อนระหว่างเสา',
      zh: '<strong>六合——地支会合。</strong>特定支对同见，便谐调，或化出新一行：子丑水、寅亥木、卯戌火、辰酉金、巳申水、午未火。这些会合加强盘的流通，也显柱与柱间的暗盟。'
    },
    'fp.h6': { en: '10-Year Luck Pillars (大运)', th: 'เสาโชคสิบปี (大运)', zh: '十年大运' },
    'fp.s6.p': {
      en: 'Your natal chart is a snapshot of birth — but life is not static. The 10-Year Luck Pillars overlay a shifting energetic environment on top of your fixed chart, creating distinct decades with unique themes, opportunities, and challenges.',
      th: 'แผนภูมิจุติเป็นภาพถ่ายตอนเกิด — แต่ชีวิตไม่นิ่ง เสาโชคสิบปีวางสภาพแวดล้อมพลังงานที่เลื่อนทับแผงคงที่ สร้างทศวรรษที่มีธีม โอกาส และโจทย์ต่างกัน',
      zh: '本命盘是出生的快照——人生并不静止。十年大运在固定盘上叠一层移动的气场，造成主题、机会与考验各异的十年。'
    },
    'fp.luck.1t': { en: 'Starting Point', th: 'จุดเริ่ม', zh: '起运' },
    'fp.luck.1p': { en: 'Your Luck Pillars begin from the Month Pillar of your natal chart. The starting age depends on your gender and the polarity (Yin or Yang) of your Year Stem — typically between ages 1 and 9.', th: 'เสาโชคเริ่มจากเสาเดือนของแผงเกิด อายุเริ่มต้นขึ้นกับเพศและขั้ว (หยินหรือหยาง) ของก้านปี — โดยปกติระหว่าง 1 ถึง 9 ปี', zh: '大运从月柱起。起运岁数视性别与年干阴阳而定——多在一至九岁之间。' },
    'fp.luck.2t': { en: 'Decade Themes', th: 'ธีมทศวรรษ', zh: '十年主题' },
    'fp.luck.2p': { en: 'Each 10-year period carries a new Stem-Branch pair that interacts with your natal chart. A Luck Pillar that brings your favorable element can trigger career breakthroughs, strong relationships, or robust health.', th: 'แต่ละสิบปีพกคู่ก้าน-กิ่งใหม่ที่ปฏิสัมพันธ์กับแผงเกิด เสาโชคที่นำธาตุเกื้ออาจจุดพลิกอาชีพ ความสัมพันธ์แน่น หรือสุขภาพแข็ง', zh: '每十年一对新干支，与本命盘往来。运来喜用，可触发事业突破、关系走强或身体健康。' },
    'fp.luck.3t': { en: 'Layered Timing', th: 'จังหวะซ้อนชั้น', zh: '层层定时' },
    'fp.luck.3p': { en: 'The Luck Pillar combines with the Annual Pillar (流年) of each year, creating a layered timing system. The best windows for major decisions happen when both the Luck Pillar and Annual Pillar align favorably with your natal chart.', th: 'เสาโชครวมกับเสารายปี (流年) ของแต่ละปี เป็นระบบจังหวะซ้อนชั้น หน้าต่างดีสุดสำหรับตัดสินใจใหญ่เกิดเมื่อทั้งเสาโชคและเสารายปีสอดคล้องกับแผงเกิด', zh: '大运再叠每年流年，形成层层定时。重大抉择最好落在大运与流年都与本命相宜的窗口。' },
    'fp.luck.4t': { en: 'Clashes & Transformations', th: 'ปะทะและการแปร', zh: '冲与变' },
    'fp.luck.4p': { en: 'When a Luck Pillar clashes with a natal pillar, it often triggers major life changes — relocations, career shifts, or relationship turning points. These are not inherently negative; they are catalysts for transformation.', th: 'เมื่อเสาโชคปะทะเสาเกิด มักจุดการเปลี่ยนใหญ่ — ย้ายที่ เปลี่ยนงาน หรือจุดพลิกความสัมพันธ์ สิ่งเหล่านี้ไม่เลวในตัว เป็นตัวเร่งการแปรเปลี่ยน', zh: '大运冲本命柱，常触发搬家、转职或感情转折。未必是坏事；它们是转化的催化剂。' },
    'fp.h7': { en: 'Reading Your Chart', th: 'อ่านแผนภูมิของคุณ', zh: '如何读盘' },
    'fp.s7.p': {
      en: 'A complete BaZi reading follows a structured process — moving from raw data to deep interpretation. Here are the five essential steps practiced by BaZi consultants worldwide.',
      th: 'การอ่านปาจื้อที่ครบมีขั้นตอน — จากข้อมูลดิบสู่การตีความลึก นี่คือห้าขั้นที่ที่ปรึกษาปาจื้อทั่วโลกใช้',
      zh: '完整八字细读有步骤——从原始数据到深层解读。以下是全球命理师常用的五步。'
    },
    'fp.read.1t': { en: 'Calculate Your Four Pillars', th: 'คำนวณสี่เสา', zh: '排出四柱' },
    'fp.read.1p': { en: 'Convert your birth year, month, day, and hour into the traditional Chinese calendar to derive four Stem-Branch pairs. Each pair maps to a specific energetic combination from the sixty Jiazi (甲子) cycle.', th: 'แปลงปี เดือน วัน ชั่วโมงเกิดเข้าปฏิทินจีน เพื่อได้สี่คู่ก้าน-กิ่ง แต่ละคู่ตรงกับการรวมพลังงานเฉพาะในรอบหกสิบเจียจื่อ (甲子)', zh: '把出生年月日时转入传统历法，得四对干支。每对对应六十甲子中的一种气。' },
    'fp.read.2t': { en: 'Identify Your Day Master', th: 'ระบุวันมาสเตอร์', zh: '定日主' },
    'fp.read.2p': { en: 'The Day Stem is your Day Master — the element that represents you. Determine whether your Day Master is strong (well-supported by surrounding elements) or weak (drained or controlled), as this shapes the entire interpretation.', th: 'ก้านวันคือวันมาสเตอร์ — ธาตุที่แทนคุณ ดูว่าแข็ง (ได้เกื้อจากรอบข้าง) หรืออ่อน (ถูกพร่องหรือข่ม) เพราะสิ่งนี้หล่อการตีความทั้งแผง', zh: '日干即日主——代表你的那一行。先判明日主得助还是被泄被克，整盘解读由此定调。' },
    'fp.read.3t': { en: 'Analyze Element Balance', th: 'วิเคราะห์สมดุลธาตุ', zh: '看五行平衡' },
    'fp.read.3p': { en: 'Count the Five Elements across all eight characters. Identify which elements are in excess, which are deficient, and which are entirely absent. This balance reveals personality tendencies, health risks, and the types of environments where you thrive.', th: 'นับห้าธาตุทั้งแปดตัว ดูว่าธาตุใดเกิน ธาตุใดพร่อง ธาตุใดหายไปหมด สมดุลนี้เผยแนวโน้มนิสัย ความเสี่ยงสุขภาพ และสภาพแวดล้อมที่คุณรุ่ง', zh: '计八字五行。何行太过、何行不及、何行全无。这平衡显出性情倾向、健康风险，以及你在何种环境里容易兴旺。' },
    'fp.read.4t': { en: 'Check Pillar Interactions', th: 'ตรวจปฏิสัมพันธ์เสา', zh: '看柱间往来' },
    'fp.read.4p': { en: 'Examine combinations, clashes, harms, and punishments between branches. Look for stem combinations that produce new elements. These interactions modify the raw element count and reveal hidden dynamics in relationships, career, and health.', th: 'ดูการรวม ปะทะ โทษ และทัณฑ์ระหว่างกิ่ง มองการรวมก้านที่เกิดธาตุใหม่ ปฏิสัมพันธ์เหล่านี้ปรับการนับธาตุดิบ และเผยพลวัตซ่อนในความสัมพันธ์ อาชีพ และสุขภาพ', zh: '看地支会合刑冲害，看天干合化。这些往来改写表面五行计数，也显关系、事业与健康里的暗流。' },
    'fp.read.5t': { en: 'Map Luck Pillars for Timing', th: 'วางเสาโชคเพื่อจังหวะ', zh: '排大运定时' },
    'fp.read.5p': { en: 'Calculate your 10-Year Luck Pillars and overlay them against your natal chart. Identify which decades bring supportive energy and which bring challenges. Combine with Annual Pillars for year-by-year precision on major decisions.', th: 'คำนวณเสาโชคสิบปีแล้วทับบนแผงเกิด ดูทศวรรษใดเกื้อ ทศวรรษใดท้าทาย รวมกับเสารายปีเพื่อความแม่นรายปีในการตัดสินใจใหญ่', zh: '排出十年大运，叠在本命盘上。看哪十年来生扶、哪十年来考验。再配流年，重大抉择可以细到年份。' },
    'fp.h8': { en: 'The Five Elements at a Glance', th: 'ห้าธาตุในพริบตา', zh: '五行一览' },
    'fp.s8.p': {
      en: 'Every character in a BaZi chart belongs to one of the Five Elements. These elements interact through the Production Cycle (generating) and the Control Cycle (restraining), creating the dynamic tension that defines your chart.',
      th: 'ทุกตัวในแผนภูมิปาจื้อสังกัดหนึ่งในห้าธาตุ ธาตุเหล่านี้มีปฏิสัมพันธ์ผ่านวงจรเกื้อ (ให้กำเนิด) และวงจรข่ม (เหนี่ยว) สร้างแรงตึงที่กำหนดแผนภูมิ',
      zh: '盘中每个字都属于五行之一。相生与相克的往来，造成定义整盘的张力。'
    },
    'fp.prod.line': { en: 'Production: Wood feeds Fire, Fire creates Earth, Earth bears Metal, Metal collects Water, Water nourishes Wood', th: 'เกื้อ: ไม้เลี้ยงไฟ ไฟสร้างดิน ดินให้โลหะ โลหะรวบน้ำ น้ำบำรุงไม้', zh: '相生：木生火，火生土，土生金，金生水，水生木' },
    'fp.ctrl.line': { en: 'Control: Wood parts Earth, Earth dams Water, Water quenches Fire, Fire melts Metal, Metal chops Wood', th: 'ข่ม: ไม้แยกดิน ดินกั้นน้ำ น้ำดับไฟ ไฟหลอมโลหะ โลหะฟันไม้', zh: '相克：木克土，土克水，水克火，火克金，金克木' },
    'fp.cta': {
      en: '<strong>Ready to discover your Four Pillars?</strong> Calculate your complete BaZi chart in seconds — Day Master, element balance, fortune scores, and zodiac insights, all from your birth date.',
      th: '<strong>พร้อมค้นพบสี่เสาของคุณแล้วหรือ?</strong> คำนวณแผนภูมิปาจื้อครบในไม่กี่วินาที — วันมาสเตอร์ สมดุลธาตุ คะแนนโชค และนักษัตร จากวันเกิด',
      zh: '<strong>准备好看见自己的四柱了吗？</strong>几秒排出完整八字——日主、五行比重、运势分数与生肖，全从出生日期而来。'
    },
    'fp.faq.q1': { en: 'What if I don\'t know my birth time?', th: 'ถ้าไม่รู้เวลาเกิดล่ะ?', zh: '不知道出生时辰怎么办？' },
    'fp.faq.a1': {
      en: 'Without a birth time, the Hour Pillar cannot be calculated. You will still have three of the four pillars (Year, Month, Day), which provide substantial insight into your personality, career potential, and relationships. The Hour Pillar adds detail about your inner self and later life, but a three-pillar reading remains highly valuable.',
      th: 'ถ้าไม่มีเวลาเกิด เสาชั่วโมงคำนวณไม่ได้ คุณยังมีสามในสี่เสา (ปี เดือน วัน) ซึ่งให้มุมนิสัย ศักยภาพอาชีพ และความสัมพันธ์ได้มาก เสาชั่วโมงเติมรายละเอียดโลกภายในและบั้นปลาย แต่การอ่านสามเสายังมีค่าสูง',
      zh: '不知时辰则时柱无法排出。仍有年、月、日三柱，对性情、事业与关系已有大量信息。时柱补内在与晚年的细节，但三柱之盘依然很有价值。'
    },
    'fp.faq.q2': { en: 'How accurate is BaZi?', th: 'ปาจื้อแม่นแค่ไหน?', zh: '八字准吗？' },
    'fp.faq.a2': {
      en: 'BaZi has been refined over thousands of years by Chinese metaphysical scholars. Its accuracy depends on precise birth data and the skill of interpretation. It excels at identifying personality patterns, elemental strengths and weaknesses, and the timing of major life themes through Luck Pillars. It is not a rigid prediction system but rather a framework for understanding cyclical energy patterns.',
      th: 'ปาจื้อถูกขัดเกลาหลายพันปีโดยนักปราชญ์จีน ความแม่นขึ้นกับข้อมูลเกิดที่ตรงและฝีมือตีความ จุดแข็งคือลายนิสัย จุดแข็ง-อ่อนของธาตุ และจังหวะธีมใหญ่ผ่านเสาโชค ไม่ใช่ระบบทำนายตายตัว แต่เป็นกรอบเข้าใจลวดลายพลังงานเป็นรอบ',
      zh: '八字经术数家千年打磨。准否取决于出生资料是否精确、解读是否到位。它长于看性情格局、五行强弱，以及大运里重大主题的时机。它不是死预测，而是理解周期性能量的框架。'
    },
    'fp.faq.q3': { en: 'Can BaZi predict the future?', th: 'ปาจื้อทำนายอนาคตได้ไหม?', zh: '八字能预测未来吗？' },
    'fp.faq.a3': {
      en: 'BaZi does not predict specific events. Instead, it maps the energetic landscape of your life — revealing which periods favor career growth, relationships, health, or caution. Think of it as a weather forecast for your personal energy: it tells you when conditions are favorable or challenging, but your choices still determine the outcome.',
      th: 'ปาจื้อไม่ได้ทำนายเหตุการณ์เฉพาะ แต่แผนที่ภูมิทัศน์พลังงานของชีวิต — ว่าช่วงใดเอื้ออาชีพ ความสัมพันธ์ สุขภาพ หรือความระวัง เหมือนพยากรณ์อากาศของพลังคุณ: บอกว่าเมื่อใดสภาพเอื้อหรือท้าทาย แต่คุณยังเลือกผลลัพธ์',
      zh: '八字不预报具体事件。它画的是人生的能量地形——哪些阶段宜事业、感情、健康或谨慎。把它当作你个人气场的天气预报：它告诉你何时顺、何时难，结果仍由选择决定。'
    },
    'fp.faq.q4': { en: 'What is the difference between BaZi and Chinese Zodiac?', th: 'ปาจื้อต่างจากนักษัตรจีนอย่างไร?', zh: '八字和生肖有何不同？' },
    'fp.faq.a4': {
      en: 'The Chinese Zodiac assigns one animal sign based on your birth year. BaZi is far more detailed — it uses four pillars (Year, Month, Day, Hour), each containing a Heavenly Stem and Earthly Branch, producing eight characters total. While the zodiac animal comes from the Year Branch alone, BaZi analyzes all eight characters and their elemental interactions for a complete personality and destiny profile.',
      th: 'นักษัตรจีนกำหนดสัตว์หนึ่งจากปีเกิด ปาจื้อละเอียดกว่ามาก — ใช้สี่เสา แต่ละเสามีก้านฟ้ากับกิ่งดิน รวมแปดตัว สัตว์ปีมาจากกิ่งปีเพียงอย่างเดียว แต่ปาจื้อวิเคราะห์ทั้งแปดตัวและปฏิสัมพันธ์ธาตุเพื่อโปรไฟล์นิสัยและโชคชะตาที่ครบ',
      zh: '生肖只按出生年份给一个动物。八字细得多——四柱，每柱天干地支，共八个字。生肖只来自年支，八字则读尽八字及其五行往来，才有完整性情与命运画像。'
    }
  };

  if (window.WoBaziI18n && typeof window.WoBaziI18n.add === 'function') {
    window.WoBaziI18n.add(C);
  } else {
    window.__WOBAZI_I18N_PENDING = Object.assign(window.__WOBAZI_I18N_PENDING || {}, C);
  }
})();
