/* ═══════════════════════════════════════
   WOBAZI — Relationship archetypes (fixed catalog)
   relationships/archetypes.js

   Names are chosen in code, never by the LLM, so the same pair always gets the same
   shareable name. Descriptions here are neutral (third person) and are the ones shown
   on public share pages; the personal headline text comes from the LLM.
═══════════════════════════════════════ */

'use strict';

/* One-line archetype per Day Master stem (list rows, invite teaser). */
const DAY_MASTER = {
  '甲': { name: { en: 'The Pioneer', zh: '开拓者', th: 'ผู้บุกเบิก' },
    line: { en: 'Grows toward a goal in a straight line and pulls others along.', zh: '朝目标笔直生长，带着身边的人一起前进。', th: 'มุ่งตรงไปหาเป้าหมายและพาคนรอบข้างไปด้วย' } },
  '乙': { name: { en: 'The Networker', zh: '连接者', th: 'นักเชื่อมโยง' },
    line: { en: 'Adapts, finds the way around obstacles, and grows through people.', zh: '灵活变通，绕过障碍，靠人脉成长。', th: 'ปรับตัวเก่ง หาทางอ้อมอุปสรรค และเติบโตผ่านผู้คน' } },
  '丙': { name: { en: 'The Spotlight', zh: '聚光灯', th: 'สปอตไลต์' },
    line: { en: 'Warm, visible and energising; does best when seen.', zh: '热情、显眼、带动气氛；被看见时状态最好。', th: 'อบอุ่น โดดเด่น เติมพลัง และทำได้ดีที่สุดเมื่อมีคนเห็น' } },
  '丁': { name: { en: 'The Guide', zh: '引路人', th: 'ผู้นำทาง' },
    line: { en: 'Focused warmth; notices the details and the people others miss.', zh: '专注的温度，留意别人忽略的细节与人。', th: 'อบอุ่นแบบตั้งใจ สังเกตรายละเอียดและคนที่คนอื่นมองข้าม' } },
  '戊': { name: { en: 'The Mountain', zh: '山', th: 'ขุนเขา' },
    line: { en: 'Steady and protective; slow to move, hard to shake.', zh: '稳重可靠，不轻易动，也不容易被撼动。', th: 'มั่นคงและปกป้อง เคลื่อนช้า แต่สั่นคลอนยาก' } },
  '己': { name: { en: 'The Cultivator', zh: '耕耘者', th: 'ผู้เพาะปลูก' },
    line: { en: 'Practical care; makes resources and people go further.', zh: '务实照顾，让资源与人发挥更大作用。', th: 'ดูแลแบบลงมือจริง ทำให้ทรัพยากรและผู้คนไปได้ไกลขึ้น' } },
  '庚': { name: { en: 'The Blade', zh: '利刃', th: 'ใบมีด' },
    line: { en: 'Direct and decisive; holds a hard line when it matters.', zh: '直接果断，关键时刻守得住底线。', th: 'ตรงและเด็ดขาด ยืนหยัดเมื่อถึงเวลาสำคัญ' } },
  '辛': { name: { en: 'The Jeweller', zh: '珠宝匠', th: 'ช่างอัญมณี' },
    line: { en: 'Precise and image-aware, with high standards for self and others.', zh: '精准、在意形象，对自己和别人都高标准。', th: 'ละเอียด ใส่ใจภาพลักษณ์ และตั้งมาตรฐานสูงทั้งกับตัวเองและคนอื่น' } },
  '壬': { name: { en: 'The Current', zh: '洪流', th: 'กระแสน้ำ' },
    line: { en: 'Big-picture and restless; moves fast and carries others with it.', zh: '看大局、闲不住，行动快，带动他人。', th: 'มองภาพใหญ่ อยู่นิ่งไม่ได้ เคลื่อนเร็วและพาคนอื่นไปด้วย' } },
  '癸': { name: { en: 'The Mist', zh: '雾', th: 'สายหมอก' },
    line: { en: 'Perceptive and quiet; reads what is not being said.', zh: '敏锐安静，读得出没说出口的话。', th: 'ช่างสังเกตและเงียบ อ่านสิ่งที่ไม่ได้พูดออกมาได้' } },
};

/* Pair archetypes: Day Master dynamic × branch tone (harmony | mixed | tension). */
const PAIR = {
  combine: {
    harmony: { name: { en: 'The Magnetic Pair', zh: '磁吸组合', th: 'คู่แม่เหล็ก' },
      desc: 'A natural pull. These two lock in quickly and cover for each other without being asked.' },
    mixed: { name: { en: 'The Close Orbit', zh: '近轨组合', th: 'วงโคจรชิดกัน' },
      desc: 'Strong attraction with a few sharp edges. Closeness comes easily; space has to be planned.' },
    tension: { name: { en: 'The Tangle', zh: '缠绕组合', th: 'ปมพันกัน' },
      desc: 'Hard to walk away from, hard to keep smooth. Works best with clear roles and honest check-ins.' },
  },
  same: {
    harmony: { name: { en: 'The Mirror Team', zh: '镜像队友', th: 'ทีมกระจกเงา' },
      desc: 'Same operating system. Easy understanding, shared instincts, and a real risk of shared blind spots.' },
    mixed: { name: { en: 'The Parallel Lines', zh: '平行线', th: 'เส้นขนาน' },
      desc: 'Similar drive, different timing. They move well side by side when each has their own lane.' },
    tension: { name: { en: 'The Rival Twins', zh: '对手双生', th: 'คู่แฝดคู่แข่ง' },
      desc: 'Alike enough to compete. The friction sharpens both when the goal is shared rather than contested.' },
  },
  produces: {
    harmony: { name: { en: 'The Mentor Loop', zh: '导师循环', th: 'วงพี่เลี้ยง' },
      desc: 'One naturally fuels the other, and the support comes back in trust and growth.' },
    mixed: { name: { en: 'The Generous Current', zh: '给予之流', th: 'กระแสผู้ให้' },
      desc: 'Energy flows mostly one way. It works well when the giver names what they need in return.' },
    tension: { name: { en: 'The Overextended Giver', zh: '透支的给予者', th: 'ผู้ให้ที่หมดแรง' },
      desc: 'Lots of giving, uneven receiving. Sustainable once limits are said out loud.' },
  },
  produced_by: {
    harmony: { name: { en: 'The Tailwind', zh: '顺风', th: 'ลมส่ง' },
      desc: 'Support that arrives before it is requested. A pairing that makes big moves feel lighter.' },
    mixed: { name: { en: 'The Steady Supply', zh: '稳定补给', th: 'เสบียงสม่ำเสมอ' },
      desc: 'Reliable backing with occasional friction over pace and control.' },
    tension: { name: { en: 'The Borrowed Battery', zh: '借来的电池', th: 'แบตเตอรี่ยืม' },
      desc: 'Real support mixed with pressure. Works when the help is acknowledged and returned.' },
  },
  controls: {
    harmony: { name: { en: 'The Sculptor', zh: '雕塑师', th: 'ช่างปั้น' },
      desc: 'One gives shape and structure, the other gains focus. Productive when feedback stays kind.' },
    mixed: { name: { en: 'The Coach', zh: '教练', th: 'โค้ช' },
      desc: 'High standards meet raw potential. Growth is real; so is the need to ease off sometimes.' },
    tension: { name: { en: 'The Pressure Cooker', zh: '高压锅', th: 'หม้ออัดแรงดัน' },
      desc: 'Strong push, strong pushback. Great results under clear agreements, heat without them.' },
  },
  controlled_by: {
    harmony: { name: { en: 'The Anchor', zh: '锚', th: 'สมอเรือ' },
      desc: 'One steadies the other. Structure that feels like safety rather than limits.' },
    mixed: { name: { en: 'The Whetstone', zh: '磨刀石', th: 'หินลับมีด' },
      desc: 'Challenge that sharpens. Best when the pressure is about the work, not the person.' },
    tension: { name: { en: 'The Tug of War', zh: '拔河', th: 'ชักเย่อ' },
      desc: 'Two strong pulls in different directions. Manageable with agreed decision rules.' },
  },
};

function dayMasterArchetype(stemChar) {
  return DAY_MASTER[stemChar] || null;
}

function pairArchetype(dynamic, tone) {
  const group = PAIR[dynamic] || PAIR.same;
  const a = group[tone] || group.mixed;
  return { key: `${dynamic}.${tone}`, name: a.name, desc: a.desc };
}

module.exports = { DAY_MASTER, PAIR, dayMasterArchetype, pairArchetype };
