/* ═══════════════════════════════════════
   WoBazi engine fixtures
   Expected stems/branches from lunar-javascript 1.6.12
   (寿星天文历 节气 + Exact2 day + Exact hour / 夜子时).
   That stack is the same 排盘 bar as BaZi Lab when true solar
   time is off: 立春 year, 节 month, civil-midnight day, early-子
   hour stem from the next civil day.

   If a fixture disagrees with BaZi Lab, the usual causes are:
   - true solar time / longitude (Phase 2 — we do not apply it)
   - 早晚子时 toggle (we use 夜子时: day stays, hour stem rolls)
═══════════════════════════════════════ */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const bazi = require('../bazi-engine');

function gz(result) {
  return result.pillars.map(p => {
    if (!p.known) return '??';
    return p.stem.char + p.branch.char;
  });
}

function chart(opts) {
  return gz(bazi.calcBaziAccurate(opts));
}

describe('calcBaziAccurate vs 6tail / BaZi Lab 排盘', () => {
  it('2000-01-07 is 甲子 day (sexagenary epoch)', () => {
    const r = bazi.calcBaziAccurate({ year: 2000, month: 1, day: 7, hour: 12 });
    assert.equal(r.pillars[2].stem.char + r.pillars[2].branch.char, '甲子');
  });

  it('year changes at 立春, not Jan 1: 1990-01-01 is 己巳 not 庚午', () => {
    // 1990 Lichun ≈ Feb 4. Jan 1 is still 己巳 (Snake 1989).
    assert.deepEqual(
      chart({ year: 1990, month: 1, day: 1, hour: 12 }),
      ['己巳', '丙子', '丙寅', '甲午']
    );
  });

  it('date near 立春 2024: 10:00 still 癸卯/乙丑, 18:00 is 甲辰/丙寅', () => {
    // 6tail 立春 2024-02-04 16:27 CST. Meeus ≈ 16:20. Both sit between 10:00 and 18:00.
    assert.deepEqual(
      chart({ year: 2024, month: 2, day: 4, hour: 10 }),
      ['癸卯', '乙丑', '戊戌', '丁巳']
    );
    assert.deepEqual(
      chart({ year: 2024, month: 2, day: 4, hour: 18 }),
      ['甲辰', '丙寅', '戊戌', '辛酉']
    );
  });

  it('春节 is not the year boundary: 2023-01-22 (CNY) is still 壬寅', () => {
    assert.deepEqual(
      chart({ year: 2023, month: 1, day: 22, hour: 8 }),
      ['壬寅', '癸丑', '庚辰', '庚辰']
    );
  });

  it('date near 节气 month change: 清明 2024-04-04', () => {
    // 6tail 清明 15:02. Meeus ≈ 14:54. 10:00 still 卯, 18:00 is 辰.
    assert.deepEqual(
      chart({ year: 2024, month: 4, day: 4, hour: 10 }),
      ['甲辰', '丁卯', '戊戌', '丁巳']
    );
    assert.deepEqual(
      chart({ year: 2024, month: 4, day: 4, hour: 18 }),
      ['甲辰', '戊辰', '戊戌', '辛酉']
    );
  });

  it('early 子时 23:30: day stays, hour stem from next civil day', () => {
    // 2024-06-15 23:30 → day 庚戌 (not 辛亥), hour 戊子 (from 辛亥 stem)
    assert.deepEqual(
      chart({ year: 2024, month: 6, day: 15, hour: 23, minute: 30 }),
      ['甲辰', '庚午', '庚戌', '戊子']
    );
  });

  it('late 子时 00:30: day has rolled, same 戊子 hour', () => {
    assert.deepEqual(
      chart({ year: 2024, month: 6, day: 16, hour: 0, minute: 30 }),
      ['甲辰', '庚午', '辛亥', '戊子']
    );
  });

  it('hour unknown omits the hour pillar', () => {
    const r = bazi.calcBaziAccurate({ year: 1995, month: 7, day: 20, hour: null });
    assert.deepEqual(gz(r).slice(0, 3), ['乙亥', '癸未', '壬子']);
    assert.equal(r.pillars[3].known, false);
  });

  it('lunar leap month 2020 闰四月初一 → solar 2020-05-23 → 庚子 辛巳 丙寅', () => {
    const r = bazi.calcBaziAccurate({
      year: 2020, month: 4, day: 1, hour: 12,
      calendar: 'lunar', leapMonth: true,
    });
    assert.deepEqual(gz(r), ['庚子', '辛巳', '丙寅', '甲午']);
    assert.deepEqual(r.solar, { year: 2020, month: 5, day: 23, hour: 12, minute: 0 });
  });

  it('tight 立春 window 2012-02-04 18:00 is still before Lichun (~18:22)', () => {
    assert.deepEqual(
      chart({ year: 2012, month: 2, day: 4, hour: 18 }),
      ['辛卯', '辛丑', '乙未', '乙酉']
    );
  });

  it('2025-02-03 20:00 before Lichun (~22:10); 02-04 00:00 after', () => {
    assert.deepEqual(
      chart({ year: 2025, month: 2, day: 3, hour: 20 }),
      ['甲辰', '丁丑', '癸卯', '壬戌']
    );
    assert.deepEqual(
      chart({ year: 2025, month: 2, day: 4, hour: 0 }),
      ['乙巳', '戊寅', '甲辰', '甲子']
    );
  });

  it('legacy calcBazi(y, month0, d, h) still returns four pillars', () => {
    // month 0-indexed: Feb = 1
    const pillars = bazi.calcBazi(2024, 1, 4, 18);
    assert.equal(pillars.length, 4);
    assert.equal(pillars[0].stem.char + pillars[0].branch.char, '甲辰');
  });
});

describe('hidden stems and ten gods', () => {
  it('attaches 藏干 to each known branch', () => {
    const r = bazi.calcBaziAccurate({ year: 2024, month: 2, day: 4, hour: 18 });
    r.pillars.forEach(p => {
      if (p.known) assert.ok(p.hidden.length >= 1);
    });
    // 寅 → 甲丙戊
    const monthHidden = r.pillars[1].hidden.map(h => h.stem.char).join('');
    assert.equal(monthHidden, '甲丙戊');
  });

  it('ten gods include zero-value gods and sum near 100%', () => {
    const r = bazi.calcBaziAccurate({ year: 2024, month: 2, day: 4, hour: 18 });
    assert.equal(r.tenGods.list.length, 10);
    const sum = r.tenGods.list.reduce((s, g) => s + g.percent, 0);
    assert.ok(sum > 99 && sum < 101);
    const zeros = r.tenGods.list.filter(g => g.percent === 0);
    assert.ok(zeros.length >= 0); // stay in the list either way
  });
});

describe('monthly forecast uniqueness', () => {
  it('12 love titles are unique and adjacent months do not share title or subtitle', () => {
    const r = bazi.calcBaziAccurate({ year: 1990, month: 1, day: 1, hour: 12 });
    const fc = bazi.calcMonthlyForecast({
      year: 2026,
      domain: 'love',
      pillars: r.pillars,
      dayMaster: r.dayMaster,
      userId: 'fixture-1990-0101',
    });
    const titles = fc.months.map(m => m.title_en);
    const subs = fc.months.map(m => m.sub_en);
    assert.equal(new Set(titles).size, 12, 'repeating titles: ' + titles.join(' | '));
    assert.equal(new Set(subs).size, 12);
    for (let i = 1; i < 12; i++) {
      assert.notEqual(titles[i], titles[i - 1], 'adjacent title repeat at month ' + (i + 1));
      assert.notEqual(subs[i], subs[i - 1], 'adjacent sub repeat at month ' + (i + 1));
    }
    assert.notEqual(titles[7], titles[3], 'AUG must differ from APR');
    assert.notEqual(titles[7], titles[11], 'AUG must differ from DEC');
    const banned = [
      'Make the first move', 'Say yes to everything', 'Put yourself out there',
      'Be bold — act now', 'Stars are aligned in your favour',
      'High chance of getting what you want', 'A meaningful connection is very close',
      'Your energy is magnetic right now',
    ];
    titles.concat(subs).forEach(s => {
      banned.forEach(b => assert.equal(s.includes(b), false, 'banned: ' + s));
    });
    // Print for the wrap-up report
    console.log('\n12 love titles (1990-01-01 / 2026):');
    fc.months.forEach(m => console.log('  ' + m.month + ' ' + m.emoji + ' ' + m.title_en + ' — ' + m.sub_en + ' [' + m.tone + '/' + m.pillar + '/' + m.god + ']'));
  });

  it('is deterministic for the same seed', () => {
    const r = bazi.calcBaziAccurate({ year: 1990, month: 1, day: 1, hour: 12 });
    const a = bazi.calcMonthlyForecast({ year: 2026, domain: 'love', pillars: r.pillars, dayMaster: r.dayMaster, userId: 'x' });
    const b = bazi.calcMonthlyForecast({ year: 2026, domain: 'love', pillars: r.pillars, dayMaster: r.dayMaster, userId: 'x' });
    assert.deepEqual(a.months.map(m => m.title_en), b.months.map(m => m.title_en));
  });
});

describe('viral verdicts', () => {
  const V = require('../share/verdict');
  it('never uses mixed/maybe and encodes round-trip', () => {
    const v = V.build({
      kind: 'today',
      tone: 'roast',
      lang: 'en',
      facts: { todayRel: 'clash', dmChar: '壬', dmEl: 'Water', todayChars: '甲子', dayChars: '壬申' }
    });
    assert.equal(v.claimId, 'today_clash');
    assert.equal(v.weather, 'Friction');
    assert.equal(/maybe|might|perhaps|mixed|balanced/i.test(v.hook + v.body + v.dare), false);
    const id = V.encodePayload(v);
    const back = V.decodePayload(id);
    assert.equal(back.hook, v.hook);
    assert.equal(back.dmChar, '壬');
  });
  it('does not invent a clash when relation is neutral', () => {
    const v = V.build({ kind: 'today', tone: 'oracle', lang: 'en', facts: { dmChar: '甲', dmEl: 'Wood' } });
    assert.equal(v.claimId, 'dm_fallback');
  });
});

describe('natal nobles, peach blossom, overlay', () => {
  it('甲 day stem lists 天乙 as Ox and Goat', () => {
    const r = bazi.calcBaziAccurate({ year: 2000, month: 1, day: 7, hour: 12 });
    assert.equal(r.pillars[2].stem.char, '甲');
    const nobles = bazi.getNatalNobles(r.pillars);
    assert.deepEqual(nobles.tianyiBranches.map(b => b.animal).sort(), ['Goat', 'Ox']);
  });

  it('子 day peach blossom is 酉 Rooster', () => {
    const r = bazi.calcBaziAccurate({ year: 2000, month: 1, day: 7, hour: 12 });
    assert.equal(r.pillars[2].branch.char, '子');
    const pb = bazi.getPeachBlossom(r.pillars);
    assert.equal(pb.animal, 'Rooster');
    assert.equal(pb.branch, '酉');
  });

  it('now overlay returns year and month pillars', () => {
    const r = bazi.calcBaziAccurate({ year: 2000, month: 1, day: 7, hour: 12 });
    const now = bazi.analyzeNowOverlay(r.pillars, r.dayMaster);
    assert.ok(now.year && now.year.stem && now.month && now.month.stem);
    assert.ok(now.monthLine && now.monthLine.kind);
  });
});

describe('择日 — personal date selection', () => {
  // 1995-04-29 08:45 → 乙亥 庚辰 庚寅 庚辰 (year branch 亥 Pig, Day Master 庚)
  const natal = bazi.calcBaziAccurate({ year: 1995, month: 4, day: 29, hour: 8, minute: 45 }).pillars;

  it('day officer starts at 建 when the day branch equals the month branch', () => {
    const o = bazi.dayOfficer(4, 4);
    assert.equal(o.char, '建');
    assert.equal(bazi.dayOfficer(5, 4).char, '除');
    assert.equal(bazi.dayOfficer(4 + 6, 4).char, '破');
  });

  it('never recommends a day that clashes the natal year branch (冲太岁)', () => {
    const days = bazi.bestDatesInMonth({ year: 2026, month: 10, pillars: natal });
    const clashing = days.filter(d => d.clashYear);
    assert.ok(clashing.length > 0, 'expected some clash days in a month');
    // 亥 clashes 巳 — every flagged day must be a Snake day, and never recommended
    for (const d of clashing) {
      assert.equal(d.animal, 'Snake');
      assert.equal(d.tier, 'avoid');
      assert.ok(d.reasons.some(r => r.code === 'clash-year'));
    }
  });

  it('scores a full calendar month', () => {
    assert.equal(bazi.bestDatesInMonth({ year: 2026, month: 2, pillars: natal }).length, 28);
    assert.equal(bazi.bestDatesInMonth({ year: 2024, month: 2, pillars: natal }).length, 29);
  });

  it('treats 破 days as avoid even when nothing clashes', () => {
    const days = bazi.bestDatesInMonth({ year: 2026, month: 10, pillars: natal });
    const po = days.filter(d => d.officer.char === '破');
    assert.ok(po.length > 0);
    for (const d of po) assert.equal(d.tier, 'avoid');
  });

  it('every objective belongs to a group and never favours 破 or 闭 days', () => {
    const inGroups = bazi.DATE_OBJECTIVE_GROUPS.flatMap(g => g.objectives);
    for (const [key, o] of Object.entries(bazi.DATE_OBJECTIVES)) {
      assert.ok(inGroups.includes(key), key + ' is not in a group');
      assert.ok(!o.officers.includes(6) && !o.officers.includes(11), key + ' favours a bad officer');
    }
    for (const k of inGroups) assert.ok(bazi.DATE_OBJECTIVES[k], k + ' is not an objective');
  });

  it('marks only matching officers as fitting an objective, and never for "For you"', () => {
    const pitch = bazi.bestDatesInMonth({ year: 2026, month: 10, pillars: natal, purpose: 'pitch' });
    for (const d of pitch) {
      const fit = d.reasons.some(r => r.code === 'purpose-fit');
      assert.equal(fit, bazi.DATE_OBJECTIVES.pitch.officers.includes(d.officer.idx) && d.officer.quality !== 'bad');
    }
    const personal = bazi.bestDatesInMonth({ year: 2026, month: 10, pillars: natal, purpose: 'personal' });
    assert.ok(personal.every(d => !d.reasons.some(r => r.code === 'purpose-fit')));
  });

  it('weights Nobleman days more for people-facing objectives', () => {
    const opts = { year: 2026, month: 10, pillars: natal };
    const noble = bazi.bestDatesInMonth(Object.assign({ purpose: 'pitch' }, opts)).find(d => d.noble && !d.clashYear);
    assert.ok(noble, 'expected a Nobleman day in the month');
    const renovate = bazi.scoreDayForChart(Object.assign({ day: noble.day, purpose: 'renovate' }, opts));
    const pitchFit = noble.reasons.some(r => r.code === 'purpose-fit') ? 10 : 0;
    const renoFit = renovate.reasons.some(r => r.code === 'purpose-fit') ? 10 : 0;
    assert.ok(noble.score - pitchFit > renovate.score - renoFit || noble.score === 100);
  });

  it('explains every reason in plain words', () => {
    const days = bazi.bestDatesInMonth({ year: 2026, month: 10, pillars: natal, purpose: 'contract' });
    for (const r of days.flatMap(d => d.reasons)) {
      assert.ok(r.short && r.short.en && r.short.zh && r.short.th, r.code + ' missing short label');
      assert.ok(r.hint && r.hint.en && r.hint.zh && r.hint.th, r.code + ' missing hint');
    }
  });

  it('shows a relation once when it hits both the year and day branch', () => {
    // 1978-07-07 is 戊午 year, 午 day: 午 self-punishes on 午 days for both branches.
    const horse = bazi.calcBaziAccurate({ year: 1978, month: 7, day: 7, hour: 12 }).pillars;
    assert.strictEqual(horse[0].branch.char + horse[2].branch.char, '午午');
    const d = bazi.scoreDayForChart({ year: 2026, month: 9, day: 17, pillars: horse });
    const punish = d.reasons.filter(r => r.short.en === 'Punishment');
    assert.strictEqual(punish.length, 1);
    assert.strictEqual(punish[0].code, 'punish-year-day');
    for (let day = 1; day <= 30; day++) {
      const labels = bazi.scoreDayForChart({ year: 2026, month: 9, day, pillars: horse }).reasons.map(r => r.short.en);
      assert.strictEqual(new Set(labels).size, labels.length, 'repeated reason on 2026-09-' + day);
    }
  });

  it('reads favourable elements from the Day Master balance', () => {
    const fav = bazi.favorableElements(natal);
    assert.ok(Array.isArray(fav.favorable) && fav.favorable.length > 0);
    for (const el of fav.favorable) assert.ok(!fav.unfavorable.includes(el));
  });
});

describe('FengshuiX reference — 1995-04-29 08:45', () => {
  const opts = { year: 1995, month: 4, day: 29, hour: 8, minute: 45 };

  it('natal pillars: 乙亥 庚辰 庚寅 庚辰', () => {
    assert.deepEqual(chart(opts), ['乙亥', '庚辰', '庚寅', '庚辰']);
  });

  it('read as a lunar date it becomes a different chart (solar 1995-05-28)', () => {
    assert.deepEqual(chart(Object.assign({}, opts, { calendar: 'lunar' })), ['乙亥', '辛巳', '己未', '戊辰']);
  });

  it('female 大运 runs forward from 2 yrs 4 mo: 辛巳 1997, 壬午 2007, 癸未 2017, 甲申 2027', () => {
    const r = bazi.calcBaziAccurate(Object.assign({}, opts, { gender: 'F' }));
    assert.equal(r.luck.forward, true);
    assert.equal(r.luck.startYears, 2);
    assert.equal(r.luck.startMonths, 4);
    assert.equal(r.luck.pillars.length, 9);
    assert.deepEqual(
      r.luck.pillars.slice(0, 4).map(p => p.stem.char + p.branch.char + ' ' + p.startYear),
      ['辛巳 1997', '壬午 2007', '癸未 2017', '甲申 2027']
    );
    assert.equal(r.luck.pillars[0].stemGod, 'rob_wealth');
  });

  it('male 大运 runs backward from the month pillar', () => {
    const r = bazi.calcBaziAccurate(Object.assign({}, opts, { gender: 'M' }));
    assert.equal(r.luck.forward, false);
    assert.deepEqual(r.luck.pillars.slice(0, 2).map(p => p.stem.char + p.branch.char), ['己卯', '戊寅']);
  });

  it('no gender → no luck pillars', () => {
    assert.equal(bazi.calcBaziAccurate(opts).luck, null);
  });
});

describe('Twins (双胞胎)', () => {
  const base = { year: 1995, month: 4, day: 29, hour: 8, minute: 45, gender: 'F' };

  it('older twin keeps the natal chart', () => {
    const r = bazi.calcBaziAccurate(Object.assign({}, base, { twin: { enabled: true, order: 'elder', method: 'luck' } }));
    assert.deepEqual(gz(r), ['乙亥', '庚辰', '庚寅', '庚辰']);
    assert.equal(r.twin.applied, false);
  });

  it('younger twin, 大运法: first luck pillar becomes the month; luck starts one step on', () => {
    const r = bazi.calcBaziAccurate(Object.assign({}, base, { twin: { enabled: true, order: 'younger', method: 'luck' } }));
    assert.deepEqual(gz(r), ['乙亥', '辛巳', '庚寅', '庚辰']);
    assert.equal(r.twin.applied, true);
    assert.equal(r.pillars[1].twinShifted, true);
    assert.equal(r.luck.pillars[0].stem.char + r.luck.pillars[0].branch.char, '壬午');
    assert.equal(r.luck.pillars[8].stem.char + r.luck.pillars[8].branch.char, '庚寅');
    assert.equal(r.luck.startYears, 2);
  });

  it('younger twin, 时柱法: hour moves to the next 时辰', () => {
    const r = bazi.calcBaziAccurate(Object.assign({}, base, { twin: { enabled: true, order: 'younger', method: 'hour' } }));
    assert.deepEqual(gz(r), ['乙亥', '庚辰', '庚寅', '辛巳']);
  });

  it('大运法 without gender is not applied', () => {
    const r = bazi.calcBaziAccurate({ year: 1995, month: 4, day: 29, hour: 8, twin: { enabled: true, order: 'younger', method: 'luck' } });
    assert.deepEqual(gz(r), ['乙亥', '庚辰', '庚寅', '庚辰']);
    assert.equal(r.twin.reason, 'needs_gender');
  });

  it('Ten Gods follow the adjusted chart', () => {
    const natal = bazi.calcBaziAccurate(base).tenGods;
    const younger = bazi.calcBaziAccurate(Object.assign({}, base, { twin: { enabled: true, order: 'younger', method: 'luck' } })).tenGods;
    assert.notDeepEqual(natal.list.map(g => g.percent), younger.list.map(g => g.percent));
  });
});
