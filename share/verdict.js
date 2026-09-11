/* Wobazi viral verdicts — fight or flourish, never 5/10.
   UMD: used by the app and the /s/:id server. No birth data. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.WobaziVerdict = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var TONES = ['oracle', 'roast', 'power'];
  var KINDS = ['today', 'year'];

  var WEATHER = {
    Peak:     { en: 'Peak',     zh: '巅峰', th: 'จุดสูงสุด' },
    Open:     { en: 'Open',     zh: '开运', th: 'เปิด' },
    Friction: { en: 'Friction', zh: '冲',   th: 'เสียด' },
    Hidden:   { en: 'Hidden',   zh: '暗助', th: 'ซ่อน' }
  };

  var GOD_FAMILY = {
    direct_officer: 'officer', seven_killings: 'officer',
    direct_wealth: 'wealth', indirect_wealth: 'wealth',
    eating_god: 'output', hurting_officer: 'output',
    direct_resource: 'resource', indirect_resource: 'resource',
    friend: 'peer', rob_wealth: 'peer'
  };

  function loc(pack, lang) {
    if (!pack) return '';
    return pack[lang] || pack.en || '';
  }

  /* Claim id → weather + 3 tones × 3 langs. One claim, three voices. */
  var CLAIMS = {
    today_clash: {
      weather: 'Friction',
      oracle: {
        hook: { en: 'Clash day. If it breaks, it was already cracked.', zh: '冲日。碎了，说明早裂了。', th: 'วันชง. ถ้าพัง มันร้าวอยู่แล้ว.' },
        body: { en: 'Today’s animal is in opposition to your chart. Do not glue what wants to split.', zh: '今日生肖冲你的盘。别去粘已经要裂的东西。', th: 'สัตว์วันนี้ชงแผนคุณ อย่าปะสิ่งที่อยากแยก' },
        dare: { en: 'Let it crack. Then choose.', zh: '让它裂。然后再选。', th: 'ให้มันร้าว แล้วค่อยเลือก' }
      },
      roast: {
        hook: { en: 'Today’s animal is picking a fight with your chart.', zh: '今日生肖在找你的盘打架。', th: 'สัตว์วันนี้มาหาเรื่องแผนคุณ' },
        body: { en: 'Do not pick it back. Save the speech. Save the send.', zh: '别接架。别演讲。别按下发送。', th: 'อย่าเอาคืน เก็บคำพูด เก็บการส่ง' },
        dare: { en: 'Walk away before you write the paragraph.', zh: '在你写成一段话之前走开。', th: 'เดินออกก่อนจะพิมพ์ย่อหน้า' }
      },
      power: {
        hook: { en: 'Friction is a door. Walk through it armed.', zh: '冲是一扇门。武装着走进去。', th: 'แรงเสียดคือประตู เดินผ่านแบบมีอาวุธ' },
        body: { en: 'A clash day rewards the person who cuts, not the one who soothes.', zh: '冲日奖赏会砍的人，不是会哄的人。', th: 'วันชงให้รางวัลคนที่ตัด ไม่ใช่คนที่ปลอบ' },
        dare: { en: 'End one thing that was already dying.', zh: '结束一件早就在死的事。', th: 'จบสิ่งที่กำลังตายอยู่แล้ว' }
      }
    },
    today_officer: {
      weather: 'Friction',
      oracle: {
        hook: { en: 'Your Officer star is loud today.', zh: '今日官星很响。', th: 'ดาวเจ้าหน้าที่ดังวันนี้' },
        body: { en: 'Authority is in the room. Do not send the polite email.', zh: '权威在场。别发那封客气的邮件。', th: 'อำนาจอยู่ในห้อง อย่าส่งอีเมลสุภาพ' },
        dare: { en: 'Say the real sentence. Once.', zh: '说那句真的。一遍。', th: 'พูดประโยคจริง ครั้งเดียว' }
      },
      roast: {
        hook: { en: 'The universe wants a receipt today.', zh: '今天宇宙要收据。', th: 'จักรวาลขอใบเสร็จวันนี้' },
        body: { en: 'Your Officer star does not do soft. Stop drafting the version that keeps everyone comfortable.', zh: '官星不做柔软。别再改那版让所有人都舒服的。', th: 'ดาวเจ้าหน้าที่ไม่ทำนุ่ม เลิกฉบับที่ทุกคนสบาย' },
        dare: { en: 'Send the honest one. Delete the rest.', zh: '发诚实的那封。删掉其余。', th: 'ส่งฉบับจริง ลบที่เหลือ' }
      },
      power: {
        hook: { en: 'Authority is watching. Make the move they cannot ignore.', zh: '权威在看。做出他们无法忽视的一步。', th: 'อำนาจกำลังดู เดินที่พวกเขาเพิกเฉยไม่ได้' },
        body: { en: 'Officer days reward precision, not volume. One clean strike.', zh: '官日奖赏精准，不奖赏音量。一击干净。', th: 'วันเจ้าหน้าที่ให้ความแม่น ไม่ใช่เสียง ดัง หนึ่งจังหวะสะอาด' },
        dare: { en: 'Put your name on the decision.', zh: '把名字签在决定上。', th: 'เซ็นชื่อบนการตัดสินใจ' }
      }
    },
    today_wealth: {
      weather: 'Peak',
      oracle: {
        hook: { en: 'Your wealth star is present. Your patience is not.', zh: '财星在。耐心不在。', th: 'ดาวทรัพย์อยู่ ความอดทนไม่อยู่' },
        body: { en: 'Money can hear you today. Ask like you already earned the answer.', zh: '今天钱听得见你。像已经配得上答案那样开口。', th: 'เงินได้ยินคุณวันนี้ ถามแบบสมควรได้คำตอบแล้ว' },
        dare: { en: 'Name the number. Out loud.', zh: '把数字说出来。大声。', th: 'เอ่ยตัวเลข ดังๆ' }
      },
      roast: {
        hook: { en: 'Money can hear you. Stop whispering.', zh: '钱听得见。别再耳语。', th: 'เงินได้ยิน เลิกกระซิบ' },
        body: { en: 'You keep rehearsing the ask like it is a crime. It is not. It is Tuesday.', zh: '你把开口练得像犯罪。不是。只是星期二。', th: 'คุณซ้อมคำขอเหมือนอาชญากรรม ไม่ใช่ มันวันอังคาร' },
        dare: { en: 'Send the invoice. Make the ask.', zh: '开票。开口。', th: 'ส่งใบแจ้งหนี้ ขอเลย' }
      },
      power: {
        hook: { en: 'Collect. This day does not reward waiting.', zh: '收。今日不奖赏等待。', th: 'เก็บ วันนี้ไม่ให้รางวัลการรอ' },
        body: { en: 'Wealth qi is in the room. Move cash, close the loop, take the meeting.', zh: '财气在场。动钱，闭环，把会面拿下。', th: 'พลังทรัพย์อยู่ในห้อง ขยับเงิน ปิดลูป นัดให้ได้' },
        dare: { en: 'Close one loop before sunset.', zh: '日落前关掉一个环。', th: 'ปิดหนึ่งลูปก่อนพระอาทิตย์ตก' }
      }
    },
    today_output: {
      weather: 'Peak',
      oracle: {
        hook: { en: 'Your output star is writing the day for you.', zh: '食伤在替你写这一天。', th: 'ดาวแสดงกำลังเขียนวันนี้ให้คุณ' },
        body: { en: 'Publish. Perform. Do not workshop it into nothing.', zh: '发表。上场。别研讨到消失。', th: 'ปล่อย แสดง อย่าประชุมจนหาย' },
        dare: { en: 'Ship the draft you are hiding.', zh: '把藏着的草稿发出去。', th: 'ส่งฉบับที่คุณซ่อน' }
      },
      roast: {
        hook: { en: 'You have a voice today. Using it is optional. Winning is not.', zh: '今天你有声音。用不用是选项。赢不是。', th: 'วันนี้คุณมีเสียง จะใช้หรือไม่เป็นตัวเลือก การชนะไม่ใช่' },
        body: { en: 'Another polish pass is how good ideas die in committee.', zh: '再改一版，是好主意在委员会里死掉的方式。', th: 'ขัดอีกครั้ง คือวิธีที่ไอเดียดีตายในที่ประชุม' },
        dare: { en: 'Post it before you get tasteful.', zh: '在你变得得体之前发出去。', th: 'โพสต์ก่อนจะสุภาพเกินไป' }
      },
      power: {
        hook: { en: 'Speak as if the room already belongs to you.', zh: '像房间已是你的那样说话。', th: 'พูดเหมือนห้องเป็นของคุณแล้ว' },
        body: { en: 'Output days compound. One visible move beats ten private ones.', zh: '食伤日会复利。一个可见的动作胜过十个私下的。', th: 'วันแสดงทบต้น หนึ่งการเคลื่อนที่เห็นได้ชนะสิบแบบลับ' },
        dare: { en: 'Make it public before noon.', zh: '中午前公开。', th: 'ทำให้สาธารณะก่อนเที่ยง' }
      }
    },
    today_peach: {
      weather: 'Open',
      oracle: {
        hook: { en: 'Peach blossom is on. Silence will cost you.', zh: '桃花开了。沉默会要价。', th: '桃花เปิด ความเงียบจะคิดเงินคุณ' },
        body: { en: 'Do not date the comfortable option. The spark is the assignment.', zh: '别跟最舒服的选项谈。火花才是功课。', th: 'อย่าเดตตัวเลือกที่สบาย ประกายคืองานที่ต้องทำ' },
        dare: { en: 'Say the unsayable. Tonight.', zh: '说出不能说的。今晚。', th: 'พูดสิ่งที่พูดไม่ได้ คืนนี้' }
      },
      roast: {
        hook: { en: 'The comfortable option is a trap with good lighting.', zh: '舒服的选项是陷阱，灯光很好。', th: 'ตัวเลือกสบายคือกับดักที่มีไฟสวย' },
        body: { en: 'Peach blossom does not do slow burns this week. It does doors.', zh: '这周桃花不做慢热。它做门。', th: '桃花สัปดาห์นี้ไม่ค่อยๆ เผา มันทำประตู' },
        dare: { en: 'Text first. Be embarrassing on purpose.', zh: '先发讯。故意尴尬一次。', th: 'ทักก่อน ตั้งใจให้อึดอัด' }
      },
      power: {
        hook: { en: 'Attraction is a strategy today. Use it.', zh: '今日吸引是策略。用。', th: 'แรงดึงดูดคือกลยุทธ์วันนี้ ใช้มัน' },
        body: { en: 'The window is not polite. Neither are you, if you are honest.', zh: '窗口不客气。诚实的你也不。', th: 'หน้าต่างไม่สุภาพ คุณก็ไม่ ถ้าจริงใจ' },
        dare: { en: 'Walk toward the voltage.', zh: '走向电压。', th: 'เดินเข้าหาแรงดัน' }
      }
    },
    today_noble: {
      weather: 'Hidden',
      oracle: {
        hook: { en: 'A noble is in the room. Let them find you.', zh: '贵人在场。让他们找到你。', th: '贵人อยู่ในห้อง ให้พวกเขาเจอคุณ' },
        body: { en: 'Helpful people cannot help a closed door. Open one.', zh: '贵人帮不了一扇关着的门。开一扇。', th: 'คนช่วยช่วยประตูปิดไม่ได้ เปิดสักบาน' },
        dare: { en: 'Ask the person who already wants to help.', zh: '去问那个已经想帮你的人。', th: 'ถามคนที่อยากช่วยอยู่แล้ว' }
      },
      roast: {
        hook: { en: 'Stop doing it alone. That is not noble. That is stubborn.', zh: '别再一个人扛。那不叫贵人运。那叫倔。', th: 'เลิกทำคนเดียว นั่นไม่ใช่贵人 นั่นคือดื้อ' },
        body: { en: 'Your 天乙贵人 is on the board. You keep pretending you do not need a board.', zh: '天乙贵人在桌上。你还装不需要一张桌子。', th: '天乙贵人อยู่บนกระดาน คุณแสร้งว่าไม่ต้องการกระดาน' },
        dare: { en: 'Send the ask you have been rewriting for a week.', zh: '把改了一周的那句请求发出去。', th: 'ส่งคำขอที่แก้มาทั้งอาทิตย์' }
      },
      power: {
        hook: { en: 'Allies compound faster than hustle today.', zh: '今天盟友比苦干更快复利。', th: 'พันธมิตรทบต้นเร็วกว่าฮึดวันนี้' },
        body: { en: 'One introduction is worth ten solo hours. Make the call.', zh: '一个引荐抵十小时单干。打电话。', th: 'หนึ่งการแนะนำคุ้มสิบชั่วโมงคนเดียว โทรเลย' },
        dare: { en: 'Name who you need. Then tell them.', zh: '说出你需要谁。然后告诉他们。', th: 'เอ่ยว่าคุณต้องการใคร แล้วบอกพวกเขา' }
      }
    },
    today_combine: {
      weather: 'Open',
      oracle: {
        hook: { en: 'Today combines with your chart. Do not waste the weather.', zh: '今日合你的盘。别浪费这天气。', th: 'วันนี้合กับแผนคุณ อย่าทิ้งอากาศนี้' },
        body: { en: 'Agreements stick. Hands shake. The door that was stuck is moving.', zh: '约定会粘住。手会握上。卡住的门在动。', th: 'ข้อตกลงติด มือจับ ประตูที่ติดกำลังขยับ' },
        dare: { en: 'Sign it while the ink still wants you.', zh: '趁墨还想要你的时候签。', th: 'เซ็นตอนหมึกยังอยากได้คุณ' }
      },
      roast: {
        hook: { en: 'The day is on your side. You, mysteriously, are stalling.', zh: '日子站你这边。你却神秘地在拖。', th: 'วันนี้เข้าข้างคุณ คุณดันชักช้าอย่างลึกลับ' },
        body: { en: 'Harmony is not a spa day. It is a closing window.', zh: '合不是水疗日。是正在关上的窗。', th: '合ไม่ใช่วันสปา คือหน้าต่างที่กำลังปิด' },
        dare: { en: 'Book the thing you have been “circling back on.”', zh: '把你一直说回头再谈的事定下来。', th: 'จองสิ่งที่คุณ“จะกลับมาคุย”' }
      },
      power: {
        hook: { en: 'Open day. Lock the alliance.', zh: '开运日。锁住同盟。', th: 'วันเปิด ล็อกพันธมิตร' },
        body: { en: 'People say yes faster today. Ask bigger than is polite.', zh: '今天人们更快说好。问得比礼貌更大。', th: 'วันนี้คนพูดตกลงเร็วกว่า ขอใหญ่กว่าที่สุภาพ' },
        dare: { en: 'Make one pact before midnight.', zh: '午夜前定一个约。', th: 'ทำหนึ่งพันธะก่อนเที่ยงคืน' }
      }
    },
    year_clash: {
      weather: 'Friction',
      oracle: {
        hook: { en: 'Clash year. If it breaks, it was already cracked.', zh: '冲年。碎了，说明早裂了。', th: 'ปีชง. ถ้าพัง มันร้าวอยู่แล้ว.' },
        body: { en: 'This 流年 did not come to soothe you. It came to show the hairline fractures.', zh: '这步流年不是来安慰你的。是来照出发丝裂的。', th: '流年นี้ไม่ได้มาปลอบ มันมาโชว์รอยร้าวเส้นผม' },
        dare: { en: 'Stop renovating a life that wants a demolition.', zh: '别再装修一栋想被拆的房子。', th: 'เลิกรีโนเวทชีวิตที่อยากถูกรื้อ' }
      },
      roast: {
        hook: { en: 'This year did not come to soothe you.', zh: '今年不是来哄你的。', th: 'ปีนี้ไม่ได้มาปลอบคุณ' },
        body: { en: 'You can keep calling it a rough patch. Or you can admit the plot twist already happened.', zh: '你可以继续叫它低潮。或者承认剧情已经转了。', th: 'จะเรียกว่าช่วงยากต่อไปก็ได้ หรือยอมรับว่าพล็อตพลิกแล้ว' },
        dare: { en: 'Drop the identity that only works in even years.', zh: '丢掉只在偶数年好用的身份。', th: 'ทิ้งตัวตนที่ใช้ได้แค่ปีคู่' }
      },
      power: {
        hook: { en: 'Burn the plan that was already dying.', zh: '烧掉那份早就在死的计划。', th: 'เผาแผนที่กำลังตายอยู่แล้ว' },
        body: { en: 'Clash years mint new people. Be one of them on purpose.', zh: '冲年铸造新人。故意成为其中一个。', th: 'ปีชงหล่อคนใหม่ จงเป็นหนึ่งในนั้นแบบตั้งใจ' },
        dare: { en: 'Quit the role you were overacting.', zh: '辞掉你演过头的那个角色。', th: 'เลิกบทที่คุณแสดงเกิน' }
      }
    },
    year_wealth: {
      weather: 'Peak',
      oracle: {
        hook: { en: 'Your wealth star is present. Your patience is not.', zh: '财星在。耐心不在。', th: 'ดาวทรัพย์อยู่ ความอดทนไม่อยู่' },
        body: { en: 'This 流年 pays the person who names the price, not the one who waits to be discovered.', zh: '这步流年付钱给标价的人，不给等着被发现的人。', th: '流年นี้จ่ายคนที่ตั้งราคา ไม่ใช่คนที่รอให้ถูกค้นพบ' },
        dare: { en: 'Raise the number. This year can hear it.', zh: '把数字抬高。今年听得见。', th: 'ยกตัวเลข ปีนี้ได้ยิน' }
      },
      roast: {
        hook: { en: 'The year is holding money. You are holding a mood.', zh: '年份握着钱。你握着情绪。', th: 'ปีถือเงิน คุณถืออารมณ์' },
        body: { en: 'Charming. Unbillable. Fix that.', zh: '迷人。开不了票。改掉。', th: 'มีเสน่ห์ เรียกเก็บเงินไม่ได้ แก้ซะ' },
        dare: { en: 'Put a price on the thing you do for free.', zh: '给你白做的事标价。', th: 'ติดราคาสิ่งที่คุณทำฟรี' }
      },
      power: {
        hook: { en: 'Collect. This year does not reward waiting.', zh: '收。今年不奖赏等待。', th: 'เก็บ ปีนี้ไม่ให้รางวัลการรอ' },
        body: { en: 'Wealth qi is seasonal. Harvest while the stem is still hot.', zh: '财气有季节。趁天干还热着收割。', th: 'พลังทรัพย์มีฤดู เก็บตอนก้านยังร้อน' },
        dare: { en: 'Close the deal you have been “feeling out.”', zh: '敲定你一直在试探的那单。', th: 'ปิดดีลที่คุณ“ลองเชิง”' }
      }
    },
    year_officer: {
      weather: 'Friction',
      oracle: {
        hook: { en: 'This year rewards the person you are pretending not to be.', zh: '今年奖赏你假装不是的那个人。', th: 'ปีนี้ให้รางวัลคนที่คุณแสร้งว่าไม่ใช่' },
        body: { en: 'Officer qi wants a spine. Soft power is still power. Use it.', zh: '官气要一条脊梁。柔软的力量仍是力量。用。', th: 'พลังเจ้าหน้าที่ต้องการกระดูกสันหลัง อำนาจอ่อนยังเป็นอำนาจ ใช้มัน' },
        dare: { en: 'Take the seat. Stop waiting to be invited.', zh: '坐下。别再等邀请。', th: 'นั่งลง เลิกรอคำเชิญ' }
      },
      roast: {
        hook: { en: 'You keep auditioning for a job you already have.', zh: '你一直在面试一份你已经有的工作。', th: 'คุณยังออดิชันงานที่มีอยู่แล้ว' },
        body: { en: 'The year is not confused about your rank. You are.', zh: '年份对你的位置不糊涂。糊涂的是你。', th: 'ปีไม่สับสนเรื่องตำแหน่งคุณ คุณต่างหาก' },
        dare: { en: 'Act like the title is already on the door.', zh: '像门上已经有头衔那样做事。', th: 'ทำเหมือนตำแหน่งติดประตูแล้ว' }
      },
      power: {
        hook: { en: 'Do not play it safe. Safe is how you stay replaceable.', zh: '别求稳。稳是让你可被替换的方式。', th: 'อย่าเล่นปลอดภัย ปลอดภัยคือวิธีให้คนแทนที่ได้' },
        body: { en: 'Officer years promote the visible. Hide and you donate the promotion.', zh: '官年提拔看得见的人。躲起来等于捐出升迁。', th: 'ปีเจ้าหน้าที่เลื่อนคนที่เห็นได้ ซ่อนคือบริจาคโปรโมชัน' },
        dare: { en: 'Put your name on the ambitious version.', zh: '把名字写在那个野心版本上。', th: 'ใส่ชื่อบนฉบับทะเยอทะยาน' }
      }
    },
    year_drain: {
      weather: 'Friction',
      oracle: {
        hook: { en: 'This 流年 drinks from your Day Master. Guard the well.', zh: '这步流年在喝你的日主。守住井。', th: '流年นี้ดื่มจากวันมาสเตอร์คุณ เฝ้าบ่อ' },
        body: { en: 'Output without intake is how strong charts get tired. Choose fewer battles.', zh: '只出不进，是强盘变累的方式。少打几场。', th: 'ออกโดยไม่เข้า คือแผนแข็งเหนื่อย เลือกศึกให้น้อย' },
        dare: { en: 'Say no to one elegant drain.', zh: '对一个优雅的消耗说不。', th: 'ปฏิเสธหนึ่งการถอนที่ดูดี' }
      },
      roast: {
        hook: { en: 'The year is using you as a battery. Unplug something.', zh: '年份把你当电池。拔掉一样。', th: 'ปีใช้คุณเป็นแบต ถอดอะไรสักอย่าง' },
        body: { en: 'You call it generosity. Your Day Master calls it theft.', zh: '你叫它慷慨。日主叫它偷窃。', th: 'คุณเรียกว่าใจกว้าง วันมาสเตอร์เรียกว่าขโมย' },
        dare: { en: 'Cancel the meeting that only takes.', zh: '取消那个只索取的会。', th: 'ยกเลิกประชุมที่เอาอย่างเดียว' }
      },
      power: {
        hook: { en: 'Conserve to strike. This is not the year of leaking.', zh: '蓄力再击。今年不是泄漏年。', th: 'เก็บเพื่อฟาด ปีนี้ไม่ใช่ปีรั่ว' },
        body: { en: 'A draining 流年 still crowns the person who rations heat.', zh: '泄的流年仍给会分配热量的人加冕。', th: '流年ที่ถอนยังสวมมงให้คนแบ่งไฟ' },
        dare: { en: 'Keep one fire private.', zh: '留一簇火给自己。', th: 'เก็บไฟหนึ่งกองเป็นเรื่องส่วนตัว' }
      }
    },
    year_feed: {
      weather: 'Peak',
      oracle: {
        hook: { en: 'This year feeds your Day Master. Do not diet on it.', zh: '今年在养你的日主。别节食。', th: 'ปีนี้เลี้ยงวันมาสเตอร์คุณ อย่าไดเอต' },
        body: { en: 'Supportive 流年 is not a spa. It is fuel. Spend it on the real work.', zh: '生助的流年不是水疗。是燃料。花在真事上。', th: '流年ที่เกื้อไม่ใช่สปา คือเชื้อเพลิง ใช้กับงานจริง' },
        dare: { en: 'Start the thing you swore you would start “next year.”', zh: '开始你发誓“明年”才开始的那件事。', th: 'เริ่มสิ่งที่สาบานว่า“ปีหน้า”' }
      },
      roast: {
        hook: { en: 'The year is handing you a match. You are still looking for a lighter.', zh: '年份递给你火柴。你还在找打火机。', th: 'ปียื่นไม้ขีด คุณยังหาไฟแช็ก' },
        body: { en: 'Help arrived. You filed it under “someday.” Cute.', zh: '帮助到了。你把它归档到“有一天”。可爱。', th: 'ความช่วยเหลือมาแล้ว คุณใส่โฟลเดอร์“วันหนึ่ง” น่ารัก' },
        dare: { en: 'Use the tailwind before you get humble.', zh: '在你变得谦虚之前用掉顺风。', th: 'ใช้ลมท้ายก่อนจะถ่อม' }
      },
      power: {
        hook: { en: 'A feeding year belongs to the greedy with taste.', zh: '养生之年属于有品味的贪心。', th: 'ปีที่เลี้ยงเป็นของคนตะกละที่มีรสนิยม' },
        body: { en: 'Scale now. The stem is producing you. That is not an accident.', zh: '现在放大。天干在生你。不是意外。', th: 'ขยายตอนนี้ ก้านกำลังผลิตคุณ นั่นไม่ใช่อุบัติเหตุ' },
        dare: { en: 'Double the bet that already works.', zh: '把已经奏效的赌注加倍。', th: 'เพิ่มเดิมพันที่ใช้ได้แล้วเป็นสองเท่า' }
      }
    },
    luck_shift: {
      weather: 'Peak',
      oracle: {
        hook: { en: 'Your 10-year luck just changed rooms. Act like it.', zh: '十年大运刚换了房间。表现得像。', th: '大运สิบปีเพิ่งย้ายห้อง ทำเหมือนมัน' },
        body: { en: 'You are still decorating the old decade. The furniture has already moved.', zh: '你还在布置上一个十年。家具已经搬走了。', th: 'คุณยังแต่งทศวรรษเก่า เฟอร์นิเจอร์ย้ายแล้ว' },
        dare: { en: 'Leave the room that ended.', zh: '离开那个已经结束的房间。', th: 'ออกจากห้องที่จบแล้ว' }
      },
      roast: {
        hook: { en: 'You are still decorating the old decade.', zh: '你还在装修上一个十年。', th: 'คุณยังแต่งทศวรรษเก่า' },
        body: { en: '大运 changed the lighting. You keep posing for the previous photo.', zh: '大运换了灯光。你还在为上一张照片摆姿势。', th: '大运เปลี่ยนแสง คุณยังโพสท่าให้รูปเก่า' },
        dare: { en: 'Update the plot. The extras already left.', zh: '更新剧情。群众演员已经走了。', th: 'อัปเดตพล็อต ตัวประกอบไปแล้ว' }
      },
      power: {
        hook: { en: 'New room. Bigger table. Sit down.', zh: '新房间。更大的桌子。坐下。', th: 'ห้องใหม่ โต๊ะใหญ่กว่า นั่งลง' },
        body: { en: 'A luck-cycle shift is a promotion the calendar already signed. Cash it.', zh: '大运换挡是日历已经签字的升迁。兑现。', th: 'การย้ายรอบโชคคือโปรโมชันที่ปฏิทินเซ็นแล้ว ขึ้นเงิน' },
        dare: { en: 'Introduce yourself as the next chapter.', zh: '用下一章的名字自我介绍。', th: 'แนะนำตัวเองเป็นบทถัดไป' }
      }
    },
    dm_fallback: {
      weather: 'Open',
      oracle: {
        hook: { en: 'Your Day Master did not come here to blend in.', zh: '你的日主不是来融入的。', th: 'วันมาสเตอร์คุณไม่ได้มาเพื่อกลืน' },
        body: { en: 'Lead with the element you already are. Imitation is a slow leak.', zh: '用你本来的五行带头。模仿是慢漏。', th: 'นำด้วยธาตุที่เป็นอยู่แล้ว การเลียนแบบคือรั่วช้า' },
        dare: { en: 'Stop borrowing someone else’s weather.', zh: '别再借别人的天气。', th: 'เลิกยืมอากาศของคนอื่น' }
      },
      roast: {
        hook: { en: 'You keep apologizing for the chart you paid to read.', zh: '你一直在为你花钱排的盘道歉。', th: 'คุณยังขอโทษแผนที่จ่ายเงินให้อ่าน' },
        body: { en: 'The Day Master is not a mood. It is the assignment.', zh: '日主不是心情。是功课。', th: 'วันมาสเตอร์ไม่ใช่อารมณ์ คืองานที่ต้องทำ' },
        dare: { en: 'Be obvious about what you are.', zh: '对自己是什么这件事明显一点。', th: 'ชัดเจนว่าคุณเป็นอะไร' }
      },
      power: {
        hook: { en: 'Lead with what you already are.', zh: '用你已经是的那部分带头。', th: 'นำด้วยสิ่งที่เป็นอยู่แล้ว' },
        body: { en: 'Copying a safer element is how strong years get wasted.', zh: '去抄一个更安全的五行，是浪费强年的方式。', th: 'ลอกธาตุที่ปลอดภัยกว่า คือวิธีทิ้งปีแข็ง' },
        dare: { en: 'Make one move only you would make.', zh: '做一个只有你会做的动作。', th: 'เคลื่อนที่แบบมีแค่คุณที่จะทำ' }
      }
    }
  };

  function pickClaim(kind, facts) {
    if (kind === 'today') {
      if (facts.todayRel === 'clash') return 'today_clash';
      if (facts.todayGodFamily === 'officer') return 'today_officer';
      if (facts.peach) return 'today_peach';
      if (facts.todayGodFamily === 'wealth') return 'today_wealth';
      if (facts.nobleToday) return 'today_noble';
      if (facts.todayRel === 'combine' || facts.todayRel === 'harmony') return 'today_combine';
      if (facts.todayGodFamily === 'output') return 'today_output';
      return 'dm_fallback';
    }
    if (facts.yearRel === 'clash') return 'year_clash';
    if (facts.luckPhase) return 'luck_shift';
    if (facts.yearGodFamily === 'wealth') return 'year_wealth';
    if (facts.yearGodFamily === 'officer') return 'year_officer';
    if (facts.yearLink === 'produced_by' || facts.yearLink === 'controls') return 'year_drain';
    if (facts.yearLink === 'produces' || facts.yearLink === 'same') return 'year_feed';
    return 'dm_fallback';
  }

  function build(input) {
    var kind = input.kind === 'year' ? 'year' : 'today';
    var tone = TONES.indexOf(input.tone) >= 0 ? input.tone : 'oracle';
    var lang = input.lang === 'zh' || input.lang === 'th' ? input.lang : 'en';
    var facts = input.facts || {};
    var claimId = pickClaim(kind, facts);
    var claim = CLAIMS[claimId] || CLAIMS.dm_fallback;
    var pack = claim[tone] || claim.oracle;
    var weatherKey = claim.weather;
    var weather = WEATHER[weatherKey] || WEATHER.Open;
    return {
      kind: kind,
      tone: tone,
      lang: lang,
      claimId: claimId,
      weather: weatherKey,
      weatherLabel: loc(weather, lang),
      hook: loc(pack.hook, lang),
      body: loc(pack.body, lang),
      dare: loc(pack.dare, lang),
      dmChar: facts.dmChar || '',
      dmEl: facts.dmEl || '',
      dayChars: facts.dayChars || '',
      yearChars: facts.yearNatalChars || '',
      flowYearChars: facts.flowYearChars || '',
      todayChars: facts.todayChars || '',
      yearLabel: facts.yearLabel || '',
      luckPhase: facts.luckPhase || '',
      name: (facts.name || '').slice(0, 24),
      accentEl: facts.dmEl || 'Metal'
    };
  }

  function caption(verdict, url) {
    var lang = verdict.lang;
    var hook = verdict.hook;
    var year = {
      en: 'The year just called me out. ' + hook,
      zh: '这一年当面点我。' + hook,
      th: 'ปีนี้ทักฉันตรงๆ ' + hook
    };
    var today = {
      en: 'Today just called me out. ' + hook,
      zh: '今天当面点我。' + hook,
      th: 'วันนี้ทักฉันตรงๆ ' + hook
    };
    var pack = verdict.kind === 'year' ? year : today;
    var tags = '#wobazi #bazi #八字 #ดวงวันนี้';
    var text = (pack[lang] || pack.en).slice(0, 120);
    return text + ' — wobazi.com\n' + tags;
  }

  function encodePayload(v) {
    var p = {
      v: 1,
      k: v.kind === 'year' ? 'y' : (v.kind === 'both' ? 'b' : 't'),
      t: v.tone === 'roast' ? 'r' : (v.tone === 'power' ? 'p' : 'o'),
      l: v.lang,
      c: v.claimId,
      w: v.weather,
      h: v.hook,
      b: v.body,
      d: v.dare,
      dm: v.dmChar,
      el: v.dmEl,
      dp: v.dayChars,
      yp: v.yearChars,
      fp: v.flowYearChars,
      tp: v.todayChars,
      yl: v.yearLabel,
      lp: v.luckPhase,
      n: v.name || ''
    };
    var json = JSON.stringify(p);
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(json, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    return btoa(unescape(encodeURIComponent(json))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function decodePayload(id) {
    try {
      var b64 = String(id || '').replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      var json = typeof Buffer !== 'undefined'
        ? Buffer.from(b64, 'base64').toString('utf8')
        : decodeURIComponent(escape(atob(b64)));
      var p = JSON.parse(json);
      var tone = p.t === 'r' ? 'roast' : (p.t === 'p' ? 'power' : 'oracle');
      var kind = p.k === 'y' ? 'year' : (p.k === 'b' ? 'both' : 'today');
      var lang = p.l === 'zh' || p.l === 'th' ? p.l : 'en';
      var weather = WEATHER[p.w] ? p.w : 'Open';
      return {
        kind: kind,
        tone: tone,
        lang: lang,
        claimId: p.c,
        weather: weather,
        weatherLabel: loc(WEATHER[weather], lang),
        hook: p.h || '',
        body: p.b || '',
        dare: p.d || '',
        dmChar: p.dm || '',
        dmEl: p.el || '',
        dayChars: p.dp || '',
        yearChars: p.yp || '',
        flowYearChars: p.fp || '',
        todayChars: p.tp || '',
        yearLabel: p.yl || '',
        luckPhase: p.lp || '',
        name: p.n || '',
        accentEl: p.el || 'Metal'
      };
    } catch (e) {
      return null;
    }
  }

  return {
    TONES: TONES,
    KINDS: KINDS,
    WEATHER: WEATHER,
    GOD_FAMILY: GOD_FAMILY,
    CLAIMS: CLAIMS,
    build: build,
    pickClaim: pickClaim,
    caption: caption,
    encodePayload: encodePayload,
    decodePayload: decodePayload
  };
}));
