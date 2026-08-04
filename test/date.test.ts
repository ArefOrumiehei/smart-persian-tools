import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  getCurrentJalaliDate,
  getPersianWeekday,
  getPersianMonthName,
  formatJalaliDate,
  toJalaliDate,
  formatJalaliPattern,
  getJalaliSeason,
  isIranianWeekend,
  isIranianHoliday,
  getDaysInJalaliMonth,
  isJalaliLeapYear,
  getRelativeJalaliDate,
  getJalaliDateInfo,
  getJalaliMonthRange,
  jalaliDateDiff,
  PERSIAN_MONTHS,
  convertDate,
} from '../src/date';

describe('Date Module', () => {
  const mockDate = new Date('2026-05-19T12:00:00Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getCurrentJalaliDate', () => {
    it('should return current jalali date as string', () => {
      const result = getCurrentJalaliDate();

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getPersianWeekday', () => {
    it('should return persian weekday', () => {
      const result = getPersianWeekday(mockDate);

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getPersianMonthName', () => {
    it('should return persian month name', () => {
      const result = getPersianMonthName(mockDate);

      expect(PERSIAN_MONTHS).toContain(result);
    });
  });

  describe('formatJalaliDate', () => {
    it('should format jalali date', () => {
      const result = formatJalaliDate(mockDate);

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('toJalaliDate', () => {
    it('should convert gregorian date to jalali object', () => {
      const result = toJalaliDate(mockDate);

      expect(result).toHaveProperty('year');
      expect(result).toHaveProperty('month');
      expect(result).toHaveProperty('day');

      expect(typeof result.year).toBe('number');
      expect(typeof result.month).toBe('number');
      expect(typeof result.day).toBe('number');
    });

    it('should return valid month range', () => {
      const result = toJalaliDate(mockDate);

      expect(result.month).toBeGreaterThanOrEqual(1);
      expect(result.month).toBeLessThanOrEqual(12);
    });

    it('should return valid day range', () => {
      const result = toJalaliDate(mockDate);

      expect(result.day).toBeGreaterThanOrEqual(1);
      expect(result.day).toBeLessThanOrEqual(31);
    });
  });

  describe('formatJalaliPattern', () => {
    it('should format with YYYY/MM/DD pattern', () => {
      const result = formatJalaliPattern(
        mockDate,
        'YYYY/MM/DD'
      );

      expect(result).toContain('/');
    });

    it('should replace Month token', () => {
      const result = formatJalaliPattern(
        mockDate,
        'DD Month YYYY'
      );

      const hasMonth = PERSIAN_MONTHS.some(month =>
        result.includes(month)
      );

      expect(hasMonth).toBe(true);
    });

    it('should replace weekday token', () => {
      const result = formatJalaliPattern(
        mockDate,
        'WD'
      );

      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getJalaliSeason', () => {
    it('should return valid season name', () => {
      const result = getJalaliSeason(mockDate);

      expect([
        'بهار',
        'تابستان',
        'پاییز',
        'زمستان'
      ]).toContain(result);
    });
  });

  describe('isIranianWeekend', () => {
    it('should detect friday as weekend', () => {
      const friday = new Date('2026-05-15');

      expect(isIranianWeekend(friday)).toBe(true);
    });

    it('should detect non-friday as not weekend', () => {
      const monday = new Date('2026-05-16');

      expect(isIranianWeekend(monday)).toBe(false);
    });
  });

  describe('isIranianHoliday', () => {
    it('should detect known holiday', () => {
      // 1405/01/01
      const nowruz = new Date('2026-03-21');

      expect(isIranianHoliday(nowruz)).toBe(true);
    });

    it('should detect non-holiday', () => {
      const normalDay = new Date('2026-05-19');

      expect(isIranianHoliday(normalDay)).toBe(false);
    });
  });

  describe('getDaysInJalaliMonth', () => {
    it('should return 31 for first 6 months', () => {
      expect(getDaysInJalaliMonth(1403, 1)).toBe(31);
      expect(getDaysInJalaliMonth(1403, 6)).toBe(31);
    });

    it('should return 30 for months 7-11', () => {
      expect(getDaysInJalaliMonth(1403, 7)).toBe(30);
      expect(getDaysInJalaliMonth(1403, 11)).toBe(30);
    });

    it('should return 29 or 30 for esfand', () => {
      const result = getDaysInJalaliMonth(1403, 12);

      expect([29, 30]).toContain(result);
    });
  });

  describe('isJalaliLeapYear', () => {
    it('should return boolean', () => {
      const result = isJalaliLeapYear(1403);

      expect(typeof result).toBe('boolean');
    });

    it('should detect known leap year', () => {
      expect(isJalaliLeapYear(1399)).toBe(true);
    });

    it('should detect known non-leap year', () => {
      expect(isJalaliLeapYear(1400)).toBe(false);
    });
  });

  describe('getRelativeJalaliDate', () => {
    it('should return امروز for same day', () => {
      const result = getRelativeJalaliDate(
        mockDate,
        mockDate
      );

      expect(result).toBe('امروز');
    });

    it('should return فردا for next day', () => {
      const tomorrow = new Date(mockDate);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const result = getRelativeJalaliDate(
        tomorrow,
        mockDate
      );

      expect(result).toBe('فردا');
    });

    it('should return دیروز for previous day', () => {
      const yesterday = new Date(mockDate);
      yesterday.setDate(yesterday.getDate() - 1);

      const result = getRelativeJalaliDate(
        yesterday,
        mockDate
      );

      expect(result).toBe('دیروز');
    });

    it('should return relative days for larger ranges', () => {
      const future = new Date(mockDate);
      future.setDate(future.getDate() + 5);

      const result = getRelativeJalaliDate(
        future,
        mockDate
      );

      expect(result).toContain('روز');
    });
  });

  describe('getJalaliDateInfo', () => {
    it('should return complete jalali info object', () => {
      const result = getJalaliDateInfo(mockDate);

      expect(result).toHaveProperty('jalali');
      expect(result).toHaveProperty('formatted');
      expect(result).toHaveProperty('monthName');
      expect(result).toHaveProperty('weekday');
      expect(result).toHaveProperty('isHoliday');
      expect(result).toHaveProperty('isWeekend');
      expect(result).toHaveProperty('season');
    });

    it('should return valid nested jalali object', () => {
      const result = getJalaliDateInfo(mockDate);

      expect(result.jalali).toHaveProperty('year');
      expect(result.jalali).toHaveProperty('month');
      expect(result.jalali).toHaveProperty('day');
    });
  });

  describe('getJalaliMonthRange', () => {
    it('should return start and end dates', () => {
      const result = getJalaliMonthRange(1403, 1);

      expect(result).toHaveProperty('start');
      expect(result).toHaveProperty('end');

      expect(result.start).toBeInstanceOf(Date);
      expect(result.end).toBeInstanceOf(Date);
    });

    it('should return end date after start date', () => {
      const result = getJalaliMonthRange(1403, 1);

      expect(
        result.end.getTime()
      ).toBeGreaterThanOrEqual(
        result.start.getTime()
      );
    });
  });

  describe('jalaliDateDiff', () => {
    it('should calculate date difference', () => {
      const from = new Date('2026-01-01');
      const to = new Date('2026-01-10');

      const result = jalaliDateDiff(from, to);

      expect(result).toHaveProperty('days');
      expect(result).toHaveProperty('months');
      expect(result).toHaveProperty('years');
      expect(result).toHaveProperty('label');
    });

    it('should calculate correct days', () => {
      const from = new Date('2026-01-01');
      const to = new Date('2026-01-11');

      const result = jalaliDateDiff(from, to);

      expect(result.days).toBe(10);
    });

    it('should return همین روز for same dates', () => {
      const result = jalaliDateDiff(
        mockDate,
        mockDate
      );

      expect(result.label).toBe('همین روز');
    });

    it('should return label with روز', () => {
      const from = new Date('2026-01-01');
      const to = new Date('2026-01-05');

      const result = jalaliDateDiff(from, to);

      expect(result.label).toContain('روز');
    });
  });
});

// ─── Known reference points ────────────────────────────────────
// These are verified Jalali ↔ Gregorian pairs used across tests
const REFS = {
  nowruz1403: {
    jalali:     { year: 1403, month: 1,  day: 1  },
    gregorian:  { year: 2024, month: 3,  day: 20 },
    iso:        '2024-03-20',
    jalaliStr:  '1403/01/01',
  },
  nowruz1400: {
    jalali:     { year: 1400, month: 1,  day: 1  },
    gregorian:  { year: 2021, month: 3,  day: 21 },
    iso:        '2021-03-21',
    jalaliStr:  '1400/01/01',
  },
  midYear1403: {
    jalali:     { year: 1403, month: 6,  day: 31 }, // last day of Shahrivar
    gregorian:  { year: 2024, month: 9,  day: 21 },
    iso:        '2024-09-21',
    jalaliStr:  '1403/06/31',
  },
  esfand1402: {
    jalali:     { year: 1402, month: 12, day: 29 }, // last day of non-leap year
    gregorian:  { year: 2024, month: 3,  day: 19 },
    iso:        '2024-03-19',
    jalaliStr:  '1402/12/29',
  },
  leapDay1399: {
    jalali:     { year: 1399, month: 12, day: 30 }, // leap day
    gregorian:  { year: 2021, month: 3,  day: 20 },
    iso:        '2021-03-20',
    jalaliStr:  '1399/12/30',
  },
} as const;

describe('convertDate', () => {

  // ─── from: jalali, input: string ──────────────────────────────
  describe('Jalali string → Gregorian', () => {
    it('should convert Nowruz 1403 correctly', () => {
      const result = convertDate('1403/01/01', { from: 'jalali', to: 'gregorian' });
      expect(result.gregorian.year).toBe(2024);
      expect(result.gregorian.month).toBe(3);
      expect(result.gregorian.day).toBe(20);
    });

    it('should convert mid-year date correctly', () => {
      const result = convertDate('1403/06/31', { from: 'jalali', to: 'gregorian' });
      expect(result.gregorian.year).toBe(2024);
      expect(result.gregorian.month).toBe(9);
      expect(result.gregorian.day).toBe(21);
    });

    it('should handle dash separator', () => {
      const result = convertDate('1403-01-01', { from: 'jalali', to: 'gregorian' });
      console.log(result);
      expect(result.gregorian.year).toBe(2024);
      expect(result.gregorian.month).toBe(3);
      expect(result.gregorian.day).toBe(20);
    });

    it('should handle space separator', () => {
      const result = convertDate('1403 01 01', { from: 'jalali', to: 'gregorian' });
      expect(result.gregorian.year).toBe(2024);
      expect(result.gregorian.month).toBe(3);
      expect(result.gregorian.day).toBe(20);
    });

    it('should handle day/month/year format', () => {
      const result = convertDate('01/01/1403', { from: 'jalali', to: 'gregorian' });
      expect(result.gregorian.year).toBe(2024);
      expect(result.gregorian.month).toBe(3);
      expect(result.gregorian.day).toBe(20);
    });

    it('should handle Persian digit string', () => {
      const result = convertDate('۱۴۰۳/۰۱/۰۱', { from: 'jalali', to: 'gregorian' });
      expect(result.gregorian.year).toBe(2024);
      expect(result.gregorian.month).toBe(3);
      expect(result.gregorian.day).toBe(20);
    });

    it('should handle mixed Persian and English digits', () => {
      const result = convertDate('۱۴۰۳/01/01', { from: 'jalali', to: 'gregorian' });
      expect(result.gregorian.year).toBe(2024);
      expect(result.gregorian.month).toBe(3);
      expect(result.gregorian.day).toBe(20);
    });

    it('should handle last day of non-leap Esfand', () => {
      const result = convertDate('1402/12/29', { from: 'jalali', to: 'gregorian' });
      expect(result.gregorian.year).toBe(2024);
      expect(result.gregorian.month).toBe(3);
      expect(result.gregorian.day).toBe(19);
    });

    it('should handle leap day (30 Esfand 1399)', () => {
      const result = convertDate('1399/12/30', { from: 'jalali', to: 'gregorian' });
      expect(result.gregorian.year).toBe(2021);
      expect(result.gregorian.month).toBe(3);
      expect(result.gregorian.day).toBe(20);
    });

    it('should throw for invalid string', () => {
      expect(() => convertDate('not-a-date', { from: 'jalali', to: 'gregorian' })).toThrow();
    });

    it('should throw for invalid month', () => {
      expect(() => convertDate('1403/13/01', { from: 'jalali', to: 'gregorian' })).toThrow();
    });

    it('should throw for invalid day', () => {
      expect(() => convertDate('1403/01/32', { from: 'jalali', to: 'gregorian' })).toThrow();
    });
  });

  // ─── from: jalali, input: JalaliDate object ───────────────────
  describe('JalaliDate object → Gregorian', () => {
    it('should convert Nowruz 1403', () => {
      const result = convertDate(
        { year: 1403, month: 1, day: 1 },
        { from: 'jalali', to: 'gregorian' }
      );
      expect(result.gregorian.year).toBe(2024);
      expect(result.gregorian.month).toBe(3);
      expect(result.gregorian.day).toBe(20);
    });

    it('should convert mid-year Jalali object', () => {
      const result = convertDate(
        { year: 1403, month: 6, day: 31 },
        { from: 'jalali', to: 'gregorian' }
      );
      expect(result.gregorian.year).toBe(2024);
      expect(result.gregorian.month).toBe(9);
      expect(result.gregorian.day).toBe(21);
    });

    it('should convert last day of Esfand', () => {
      const result = convertDate(
        { year: 1402, month: 12, day: 29 },
        { from: 'jalali', to: 'gregorian' }
      );
      expect(result.gregorian.year).toBe(2024);
      expect(result.gregorian.month).toBe(3);
      expect(result.gregorian.day).toBe(19);
    });
  });

  // ─── from: jalali, input: JS Date ─────────────────────────────
  describe('JS Date (treated as Gregorian) → Jalali', () => {
    it('should convert JS Date to Jalali', () => {
      const result = convertDate(
        new Date(2024, 2, 20), // March 20, 2024
        { from: 'gregorian', to: 'jalali' }
      );
      expect(result.jalali.year).toBe(1403);
      expect(result.jalali.month).toBe(1);
      expect(result.jalali.day).toBe(1);
    });

    it('should handle JS Date passed to jalali from', () => {
      // When JS Date is passed with from:'jalali', it is used as-is (already Gregorian)
      const date = new Date(2024, 2, 20);
      const result = convertDate(date, { from: 'jalali', to: 'gregorian' });
      expect(result.gregorian.year).toBe(2024);
      expect(result.gregorian.month).toBe(3);
      expect(result.gregorian.day).toBe(20);
    });
  });

  // ─── from: gregorian, input: string ───────────────────────────
  describe('Gregorian string → Jalali', () => {
    it('should convert ISO date to Jalali', () => {
      const result = convertDate('2024-03-20', { from: 'gregorian', to: 'jalali' });
      expect(result.jalali.year).toBe(1403);
      expect(result.jalali.month).toBe(1);
      expect(result.jalali.day).toBe(1);
    });

    it('should convert slash-separated Gregorian', () => {
      const result = convertDate('2024/03/20', { from: 'gregorian', to: 'jalali' });
      expect(result.jalali.year).toBe(1403);
      expect(result.jalali.month).toBe(1);
      expect(result.jalali.day).toBe(1);
    });

    it('should convert day/month/year format', () => {
      const result = convertDate('20/03/2024', { from: 'gregorian', to: 'jalali' });
      expect(result.jalali.year).toBe(1403);
      expect(result.jalali.month).toBe(1);
      expect(result.jalali.day).toBe(1);
    });

    it('should convert mid-year Gregorian date', () => {
      const result = convertDate('2024-09-21', { from: 'gregorian', to: 'jalali' });
      expect(result.jalali.year).toBe(1403);
      expect(result.jalali.month).toBe(6);
      expect(result.jalali.day).toBe(31);
    });

    it('should convert last day before Nowruz', () => {
      const result = convertDate('2024-03-19', { from: 'gregorian', to: 'jalali' });
      expect(result.jalali.year).toBe(1402);
      expect(result.jalali.month).toBe(12);
      expect(result.jalali.day).toBe(29);
    });

    it('should throw for completely invalid string', () => {
      expect(() => convertDate('hello world', { from: 'gregorian', to: 'jalali' })).toThrow();
    });
  });

  // ─── from: gregorian, input: JS Date ──────────────────────────
  describe('JS Date → Jalali', () => {
    it('should convert March 20 2024 to Nowruz', () => {
      const result = convertDate(
        new Date('2024-03-20'),
        { from: 'gregorian', to: 'jalali' }
      );
      expect(result.jalali.year).toBe(1403);
      expect(result.jalali.month).toBe(1);
      expect(result.jalali.day).toBe(1);
    });

    it('should convert September 21 2024', () => {
      const result = convertDate(
        new Date('2024-09-21'),
        { from: 'gregorian', to: 'jalali' }
      );
      expect(result.jalali.year).toBe(1403);
      expect(result.jalali.month).toBe(6);
      expect(result.jalali.day).toBe(31);
    });
  });

  // ─── ConversionResult shape ────────────────────────────────────
  describe('ConversionResult shape', () => {
    it('should always return a valid JS Date', () => {
      const result = convertDate('1403/01/01', { from: 'jalali', to: 'gregorian' });
      expect(result.date).toBeInstanceOf(Date);
      expect(isNaN(result.date.getTime())).toBe(false);
    });

    it('should always include both jalali and gregorian', () => {
      const result = convertDate('2024-03-20', { from: 'gregorian', to: 'jalali' });
      expect(result.jalali).toHaveProperty('year');
      expect(result.jalali).toHaveProperty('month');
      expect(result.jalali).toHaveProperty('day');
      expect(result.gregorian).toHaveProperty('year');
      expect(result.gregorian).toHaveProperty('month');
      expect(result.gregorian).toHaveProperty('day');
    });

    it('should return formatted.jalali in Persian digits', () => {
      const result = convertDate('2024-03-20', { from: 'gregorian', to: 'jalali' });
      expect(result.formatted.jalali).toMatch(/^[۰-۹/]+$/);
    });

    it('should return formatted.jalali as YYYY/MM/DD', () => {
      const result = convertDate('2024-03-20', { from: 'gregorian', to: 'jalali' });
      expect(result.formatted.jalali).toBe('۱۴۰۳/۰۱/۰۱');
    });

    it('should return formatted.gregorian as YYYY-MM-DD', () => {
      const result = convertDate('1403/01/01', { from: 'jalali', to: 'gregorian' });
      expect(result.formatted.gregorian).toBe('2024-03-20');
    });

    it('should return formatted.jalaliLong containing month name', () => {
      const result = convertDate('1403/01/01', { from: 'jalali', to: 'gregorian' });
      expect(result.formatted.jalaliLong).toContain('فروردین');
    });

    it('should return formatted.jalaliLong containing weekday', () => {
      const result = convertDate('1403/01/01', { from: 'jalali', to: 'gregorian' });
      expect(result.formatted.jalaliLong).toContain('چهارشنبه');
    });

    it('should return formatted.gregorianLong in English', () => {
      const result = convertDate('1403/01/01', { from: 'jalali', to: 'gregorian' });
      expect(result.formatted.gregorianLong).toContain('March');
      expect(result.formatted.gregorianLong).toContain('2024');
    });
  });

  // ─── Roundtrip consistency ─────────────────────────────────────
  describe('Roundtrip consistency', () => {
    it('Jalali → Gregorian → Jalali should return same date', () => {
      const step1 = convertDate('1403/01/01', { from: 'jalali', to: 'gregorian' });
      const step2 = convertDate(step1.date, { from: 'gregorian', to: 'jalali' });
      expect(step2.jalali.year).toBe(1403);
      expect(step2.jalali.month).toBe(1);
      expect(step2.jalali.day).toBe(1);
    });

    it('Gregorian → Jalali → Gregorian should return same date', () => {
      const step1 = convertDate('2024-03-20', { from: 'gregorian', to: 'jalali' });
      const step2 = convertDate(step1.jalali, { from: 'jalali', to: 'gregorian' });
      expect(step2.gregorian.year).toBe(2024);
      expect(step2.gregorian.month).toBe(3);
      expect(step2.gregorian.day).toBe(20);
    });

    it('should be consistent across all REFS', () => {
      for (const [, ref] of Object.entries(REFS)) {
        const toGreg = convertDate(ref.jalaliStr, { from: 'jalali', to: 'gregorian' });
        expect(toGreg.gregorian.year).toBe(ref.gregorian.year);
        expect(toGreg.gregorian.month).toBe(ref.gregorian.month);
        expect(toGreg.gregorian.day).toBe(ref.gregorian.day);

        const toJal = convertDate(ref.iso, { from: 'gregorian', to: 'jalali' });
        expect(toJal.jalali.year).toBe(ref.jalali.year);
        expect(toJal.jalali.month).toBe(ref.jalali.month);
        expect(toJal.jalali.day).toBe(ref.jalali.day);
      }
    });

    it('same-calendar conversion should not change the date', () => {
      const result = convertDate('2024-03-20', { from: 'gregorian', to: 'gregorian' });
      expect(result.gregorian.year).toBe(2024);
      expect(result.gregorian.month).toBe(3);
      expect(result.gregorian.day).toBe(20);
    });
  });

  // ─── Edge cases ────────────────────────────────────────────────
  describe('Edge cases', () => {
    it('should handle Nowruz boundary (last moment of year)', () => {
      const result = convertDate('1402/12/29', { from: 'jalali', to: 'gregorian' });
      const next   = convertDate('1403/01/01', { from: 'jalali', to: 'gregorian' });
      expect(next.gregorian.day - result.gregorian.day).toBe(1);
    });

    it('should handle leap year day (30 Esfand 1399)', () => {
      const result = convertDate('1399/12/30', { from: 'jalali', to: 'gregorian' });
      expect(result.jalali.day).toBe(30);
      expect(result.jalali.month).toBe(12);
      expect(result.jalali.year).toBe(1399);
    });

    it('should handle first day of each month correctly', () => {
      const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      for (const month of months) {
        const str = `1403/${String(month).padStart(2, '0')}/01`;
        const result = convertDate(str, { from: 'jalali', to: 'gregorian' });
        expect(result.jalali.month).toBe(month);
        expect(result.jalali.day).toBe(1);
      }
    });

    it('should handle last day of first 6 months (31 days)', () => {
      for (let month = 1; month <= 6; month++) {
        const str = `1403/${String(month).padStart(2, '0')}/31`;
        const result = convertDate(str, { from: 'jalali', to: 'gregorian' });
        expect(result.jalali.day).toBe(31);
      }
    });

    it('should handle last day of months 7-11 (30 days)', () => {
      for (let month = 7; month <= 11; month++) {
        const str = `1403/${String(month).padStart(2, '0')}/30`;
        const result = convertDate(str, { from: 'jalali', to: 'gregorian' });
        expect(result.jalali.day).toBe(30);
      }
    });

    it('should handle Persian digit input in all ref dates', () => {
      const persianStr = '۱۴۰۳/۰۶/۳۱';
      const result = convertDate(persianStr, { from: 'jalali', to: 'gregorian' });
      expect(result.gregorian.year).toBe(2024);
      expect(result.gregorian.month).toBe(9);
      expect(result.gregorian.day).toBe(21);
    });

    it('result.date should be a midnight-ish Date (no time drift)', () => {
      const result = convertDate('1403/01/01', { from: 'jalali', to: 'gregorian' });
      // The returned date should represent the correct calendar day
      const j = result.jalali;
      expect(j.year).toBe(1403);
      expect(j.month).toBe(1);
      expect(j.day).toBe(1);
    });
  });

});