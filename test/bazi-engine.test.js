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
