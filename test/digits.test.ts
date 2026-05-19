import { describe, it, expect } from 'vitest';
import {
  toPersianDigits,
  toEnglishDigits,
  containsPersianDigits,
  containsEnglishDigits,
  containsArabicDigits,
  arabicToPersianDigits,
  arabicToEnglishDigits,
  normalizeDigits,
  detectDigitType,
  removeDigits,
  extractDigits,
  isDigitsOnly,
  persianPadStart,
} from '../src/digits';

describe('Digits Module', () => {

  describe('toPersianDigits', () => {
    it('should convert English number to Persian', () => {
      expect(toPersianDigits(123)).toBe('۱۲۳');
    });
    it('should convert English string digits to Persian', () => {
      expect(toPersianDigits('456')).toBe('۴۵۶');
    });
    it('should handle zero', () => {
      expect(toPersianDigits(0)).toBe('۰');
    });
    it('should handle mixed string (digits + letters)', () => {
      expect(toPersianDigits('phone: 09121234567')).toBe('phone: ۰۹۱۲۱۲۳۴۵۶۷');
    });
    it('should return empty string for empty input', () => {
      expect(toPersianDigits('')).toBe('');
    });
  });

  describe('toEnglishDigits', () => {
    it('should convert Persian digits to English', () => {
      expect(toEnglishDigits('۱۲۳')).toBe('123');
    });
    it('should leave English digits unchanged', () => {
      expect(toEnglishDigits('123')).toBe('123');
    });
    it('should handle mixed Persian and non-digit characters', () => {
      expect(toEnglishDigits('قیمت: ۱۵۰۰ تومان')).toBe('قیمت: 1500 تومان');
    });
    it('should handle empty string', () => {
      expect(toEnglishDigits('')).toBe('');
    });
    it('should NOT convert Arabic digits (not in scope)', () => {
      expect(toEnglishDigits('١٢٣')).toBe('١٢٣');
    });
  });

  describe('containsPersianDigits', () => {
    it('should return true for Persian digits', () => {
      expect(containsPersianDigits('۱۲۳')).toBe(true);
    });
    it('should return false for English digits', () => {
      expect(containsPersianDigits('123')).toBe(false);
    });
    it('should return true for mixed string with at least one Persian digit', () => {
      expect(containsPersianDigits('hello ۱')).toBe(true);
    });
    it('should return false for string with no digits', () => {
      expect(containsPersianDigits('سلام')).toBe(false);
    });
    it('should return false for empty string', () => {
      expect(containsPersianDigits('')).toBe(false);
    });
  });

  describe('containsEnglishDigits', () => {
    it('should return true for English digits', () => {
      expect(containsEnglishDigits('123')).toBe(true);
    });
    it('should return false for Persian digits', () => {
      expect(containsEnglishDigits('۱۲۳')).toBe(false);
    });
    it('should return true for mixed string with at least one English digit', () => {
      expect(containsEnglishDigits('abc 9')).toBe(true);
    });
    it('should return false for empty string', () => {
      expect(containsEnglishDigits('')).toBe(false);
    });
  });

  describe('containsArabicDigits', () => {
    it('should return true for Arabic digits', () => {
      expect(containsArabicDigits('١٢٣')).toBe(true);
    });
    it('should return false for Persian digits', () => {
      expect(containsArabicDigits('۱۲۳')).toBe(false);
    });
    it('should return false for English digits', () => {
      expect(containsArabicDigits('123')).toBe(false);
    });
    it('should return false for empty string', () => {
      expect(containsArabicDigits('')).toBe(false);
    });
  });

  describe('arabicToPersianDigits', () => {
    it('should convert Arabic digits to Persian', () => {
      expect(arabicToPersianDigits('١٢٣')).toBe('۱۲۳');
    });
    it('should leave Persian digits unchanged', () => {
      expect(arabicToPersianDigits('۱۲۳')).toBe('۱۲۳');
    });
    it('should leave English digits unchanged', () => {
      expect(arabicToPersianDigits('123')).toBe('123');
    });
    it('should handle mixed Arabic and text', () => {
      expect(arabicToPersianDigits('رقم: ١٢٣')).toBe('رقم: ۱۲۳');
    });
    it('should handle all Arabic digits 0-9', () => {
      expect(arabicToPersianDigits('٠١٢٣٤٥٦٧٨٩')).toBe('۰۱۲۳۴۵۶۷۸۹');
    });
  });

  describe('arabicToEnglishDigits', () => {
    it('should convert Arabic digits to English', () => {
      expect(arabicToEnglishDigits('١٢٣')).toBe('123');
    });
    it('should leave English digits unchanged', () => {
      expect(arabicToEnglishDigits('123')).toBe('123');
    });
    it('should handle all Arabic digits 0-9', () => {
      expect(arabicToEnglishDigits('٠١٢٣٤٥٦٧٨٩')).toBe('0123456789');
    });
  });

  describe('normalizeDigits', () => {
    it('should convert Persian digits to English', () => {
      expect(normalizeDigits('۱۲۳')).toBe('123');
    });
    it('should convert Arabic digits to English', () => {
      expect(normalizeDigits('١٢٣')).toBe('123');
    });
    it('should handle mixed Persian, Arabic, and English digits', () => {
      expect(normalizeDigits('۱١1')).toBe('111');
    });
    it('should leave non-digit characters intact', () => {
      expect(normalizeDigits('قیمت: ۱۵۰۰ تومان')).toBe('قیمت: 1500 تومان');
    });
    it('should handle empty string', () => {
      expect(normalizeDigits('')).toBe('');
    });
  });

  describe('detectDigitType', () => {
    it('should detect Persian digits', () => {
      expect(detectDigitType('۱۲۳')).toBe('persian');
    });
    it('should detect English digits', () => {
      expect(detectDigitType('123')).toBe('english');
    });
    it('should detect Arabic digits', () => {
      expect(detectDigitType('١٢٣')).toBe('arabic');
    });
    it('should detect mixed digits', () => {
      expect(detectDigitType('۱23')).toBe('mixed');
    });
    it('should return none for string with no digits', () => {
      expect(detectDigitType('سلام دنیا')).toBe('none');
    });
    it('should return none for empty string', () => {
      expect(detectDigitType('')).toBe('none');
    });
    it('should return mixed for Persian + Arabic', () => {
      expect(detectDigitType('۱١')).toBe('mixed');
    });
  });

  describe('removeDigits', () => {
    it('should remove English digits', () => {
      expect(removeDigits('abc123')).toBe('abc');
    });
    it('should remove Persian digits', () => {
      expect(removeDigits('سلام۱۲۳')).toBe('سلام');
    });
    it('should remove Arabic digits', () => {
      expect(removeDigits('test١٢٣')).toBe('test');
    });
    it('should remove all digit types from mixed string', () => {
      expect(removeDigits('a۱b١c1')).toBe('abc');
    });
    it('should return empty string if input is all digits', () => {
      expect(removeDigits('123۴۵٦')).toBe('');
    });
    it('should return same string if no digits present', () => {
      expect(removeDigits('سلام')).toBe('سلام');
    });
  });

  describe('extractDigits', () => {
    it('should extract English digits only', () => {
      expect(extractDigits('abc123def')).toBe('123');
    });
    it('should extract and normalize Persian digits', () => {
      expect(extractDigits('قیمت ۱۵۰۰ تومان')).toBe('1500');
    });
    it('should extract and normalize Arabic digits', () => {
      expect(extractDigits('رقم ١٢٣')).toBe('123');
    });
    it('should extract from mixed digit types', () => {
      expect(extractDigits('a۱b١c1')).toBe('111');
    });
    it('should return empty string if no digits found', () => {
      expect(extractDigits('سلام')).toBe('');
    });
  });

  describe('isDigitsOnly', () => {
    it('should return true for English digits only', () => {
      expect(isDigitsOnly('123')).toBe(true);
    });
    it('should return true for Persian digits only', () => {
      expect(isDigitsOnly('۱۲۳')).toBe(true);
    });
    it('should return true for Arabic digits only', () => {
      expect(isDigitsOnly('١٢٣')).toBe(true);
    });
    it('should return true for mixed digit scripts', () => {
      expect(isDigitsOnly('۱١1')).toBe(true);
    });
    it('should return false if any non-digit character exists', () => {
      expect(isDigitsOnly('۱۲۳abc')).toBe(false);
    });
    it('should return false for empty string', () => {
      expect(isDigitsOnly('')).toBe(false);
    });
  });

  describe('persianPadStart', () => {
    it('should pad a number with Persian zeros', () => {
      expect(persianPadStart(5, 3)).toBe('۰۰۵');
    });
    it('should pad a string number with Persian zeros', () => {
      expect(persianPadStart('۷', 3)).toBe('۰۰۷');
    });
    it('should not pad if already at target length', () => {
      expect(persianPadStart(123, 3)).toBe('۱۲۳');
    });
    it('should not truncate if longer than target length', () => {
      expect(persianPadStart(12345, 3)).toBe('۱۲۳۴۵');
    });
    it('should handle zero', () => {
      expect(persianPadStart(0, 2)).toBe('۰۰');
    });
  });

});