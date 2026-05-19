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