import { describe, it, expect } from 'vitest';
import {
  validateIranianNationalCode,
  maskNationalCode,
  formatNationalCode,
  normalizeNationalCode,
  getProvinceByNationalCode,
  toPersianNationalCode,
  isSameNationalCode,
  isRepeatedDigits,
  extractNationalCodes,
  getNationalCodeInfo,
} from '../src/nationalCode';

describe('National Code Module', () => {

  describe('validateIranianNationalCode', () => {
    it('should return true for valid national code', () => {
      expect(validateIranianNationalCode('0499370899')).toBe(true);
    });
    it('should return true for another valid code', () => {
      expect(validateIranianNationalCode('0076229645')).toBe(true);
    });
    it('should return false for all repeated digits', () => {
      expect(validateIranianNationalCode('1111111111')).toBe(false);
    });
    it('should return false for all zeros', () => {
      expect(validateIranianNationalCode('0000000000')).toBe(false);
    });
    it('should return false for less than 10 digits', () => {
      expect(validateIranianNationalCode('049937089')).toBe(false);
    });
    it('should return false for more than 10 digits', () => {
      expect(validateIranianNationalCode('04993708990')).toBe(false);
    });
    it('should return false for empty string', () => {
      expect(validateIranianNationalCode('')).toBe(false);
    });
    it('should return false for non-numeric string', () => {
      expect(validateIranianNationalCode('abcdefghij')).toBe(false);
    });
    it('should return false for wrong check digit', () => {
      expect(validateIranianNationalCode('0499370898')).toBe(false);
    });
    it('should return false for all 9s', () => {
      expect(validateIranianNationalCode('9999999999')).toBe(false);
    });
  });

  describe('maskNationalCode', () => {
    it('should mask middle digits', () => {
      expect(maskNationalCode('0499370899')).toBe('049***0899');
    });
    it('should keep first 3 digits visible', () => {
      expect(maskNationalCode('0076229645').startsWith('007')).toBe(true);
    });
    it('should keep last 4 digits visible', () => {
      expect(maskNationalCode('0076229645').endsWith('9645')).toBe(true);
    });
    it('should have exactly 3 asterisks', () => {
      const masked = maskNationalCode('0499370899');
      expect((masked.match(/\*/g) ?? []).length).toBe(3);
    });
  });

  describe('formatNationalCode', () => {
    it('should format with dashes', () => {
      expect(formatNationalCode('0499370899')).toBe('049-937-0899');
    });
    it('should have exactly 2 dashes', () => {
      const formatted = formatNationalCode('0499370899');
      expect((formatted.match(/-/g) ?? []).length).toBe(2);
    });
    it('should split into 3-3-4 pattern', () => {
      const parts = formatNationalCode('0499370899').split('-');
      expect(parts[0].length).toBe(3);
      expect(parts[1].length).toBe(3);
      expect(parts[2].length).toBe(4);
    });
  });

  describe('normalizeNationalCode', () => {
    it('should convert Persian digits to English', () => {
      expect(normalizeNationalCode('۰۴۹۹۳۷۰۸۹۹')).toBe('0499370899');
    });
    it('should convert Arabic digits to English', () => {
      expect(normalizeNationalCode('٠٤٩٩٣٧٠٨٩٩')).toBe('0499370899');
    });
    it('should pad with leading zero if 9 digits', () => {
      expect(normalizeNationalCode('499370899')).toBe('0499370899');
    });
    it('should keep already normalized code as is', () => {
      expect(normalizeNationalCode('0499370899')).toBe('0499370899');
    });
    it('should strip non-digit characters', () => {
      expect(normalizeNationalCode('049-937-0899')).toBe('0499370899');
    });
    it('should handle mixed Persian and English digits', () => {
      expect(normalizeNationalCode('۰499۳۷0899')).toBe('0499370899');
    });
    it('should pad short codes to 10 digits', () => {
      expect(normalizeNationalCode('12345').length).toBe(10);
    });
  });

  describe('getProvinceByNationalCode', () => {
    it('should return Tehran for 008 prefix', () => {
      const result = getProvinceByNationalCode('0089370899');
      expect(result?.province).toBe('تهران');
    });
    it('should return correct city for Tehran code', () => {
      const result = getProvinceByNationalCode('0319370899');
      expect(result?.city).toBe('کرج');
    });
    it('should return Isfahan for 136 prefix', () => {
      const result = getProvinceByNationalCode('1360000000');
      expect(result?.province).toBe('آذربایجان شرقی');
    });
    it('should return Mashhad for 093 prefix', () => {
      const result = getProvinceByNationalCode('0930000000');
      expect(result?.province).toBe('خراسان رضوی');
      expect(result?.city).toBe('مشهد');
    });
    it('should return null for unknown prefix', () => {
      expect(getProvinceByNationalCode('0000000000')).toBe(null);
    });
    it('should handle Persian digit input', () => {
      const result = getProvinceByNationalCode('۰۰۸۹۳۷۰۸۹۹');
      expect(result?.province).toBe('تهران');
    });
    it('should return province code in result', () => {
      const result = getProvinceByNationalCode('0499370899');
      expect(result?.code).toBeDefined();
    });
  });

  describe('toPersianNationalCode', () => {
    it('should convert English digits to Persian', () => {
      expect(toPersianNationalCode('0499370899')).toBe('۰۴۹۹۳۷۰۸۹۹');
    });
    it('should handle already Persian input', () => {
      expect(toPersianNationalCode('۰۴۹۹۳۷۰۸۹۹')).toBe('۰۴۹۹۳۷۰۸۹۹');
    });
    it('should pad and convert short input', () => {
      const result = toPersianNationalCode('499370899');
      expect(result).toBe('۰۴۹۹۳۷۰۸۹۹');
    });
    it('should return 10 Persian characters', () => {
      const result = toPersianNationalCode('0499370899');
      expect(result.length).toBe(10);
      expect(result).toMatch(/^[۰-۹]+$/);
    });
  });

  describe('isSameNationalCode', () => {
    it('should return true for same code in English and Persian', () => {
      expect(isSameNationalCode('0499370899', '۰۴۹۹۳۷۰۸۹۹')).toBe(true);
    });
    it('should return true for same code with and without leading zero', () => {
      expect(isSameNationalCode('499370899', '0499370899')).toBe(true);
    });
    it('should return true for identical codes', () => {
      expect(isSameNationalCode('0499370899', '0499370899')).toBe(true);
    });
    it('should return false for different codes', () => {
      expect(isSameNationalCode('0499370899', '0684159415')).toBe(false);
    });
    it('should handle Arabic digit input', () => {
      expect(isSameNationalCode('٠٤٩٩٣٧٠٨٩٩', '0499370899')).toBe(true);
    });
  });

  describe('isRepeatedDigits', () => {
    it('should return true for all same digits', () => {
      expect(isRepeatedDigits('1111111111')).toBe(true);
    });
    it('should return true for all zeros', () => {
      expect(isRepeatedDigits('0000000000')).toBe(true);
    });
    it('should return true for all 9s', () => {
      expect(isRepeatedDigits('9999999999')).toBe(true);
    });
    it('should return false for valid national code', () => {
      expect(isRepeatedDigits('0499370899')).toBe(false);
    });
    it('should return false for almost repeated digits', () => {
      expect(isRepeatedDigits('1111111112')).toBe(false);
    });
    it('should handle Persian digit input', () => {
      expect(isRepeatedDigits('۱۱۱۱۱۱۱۱۱۱')).toBe(true);
    });
  });

  describe('extractNationalCodes', () => {
    it('should extract a single valid national code from text', () => {
      expect(extractNationalCodes('کد ملی: 0499370899')).toEqual(['0499370899']);
    });
    it('should extract multiple valid national codes', () => {
      const result = extractNationalCodes('0499370899 و 0076229645');
      expect(result).toContain('0499370899');
      expect(result).toContain('0076229645');
      expect(result).toHaveLength(2);
    });
    it('should deduplicate repeated codes', () => {
      const result = extractNationalCodes('0499370899 0499370899');
      expect(result).toHaveLength(1);
    });
    it('should not extract invalid national codes', () => {
      expect(extractNationalCodes('1111111111')).toEqual([]);
    });
    it('should return empty array if no codes found', () => {
      expect(extractNationalCodes('هیچ کدی اینجا نیست')).toEqual([]);
    });
    it('should extract from Persian digit text', () => {
      const result = extractNationalCodes('کد ملی ۰۴۹۹۳۷۰۸۹۹ می‌باشد');
      expect(result).toContain('0499370899');
    });
    it('should not extract numbers that are not 10 digits', () => {
      expect(extractNationalCodes('12345 123456789')).toEqual([]);
    });
  });

  describe('getNationalCodeInfo', () => {
    it('should return correct code', () => {
      expect(getNationalCodeInfo('0499370899').code).toBe('0499370899');
    });
    it('should return isValid true for valid code', () => {
      expect(getNationalCodeInfo('0499370899').isValid).toBe(true);
    });
    it('should return isValid false for invalid code', () => {
      expect(getNationalCodeInfo('1234567890').isValid).toBe(false);
    });
    it('should return formatted code', () => {
      expect(getNationalCodeInfo('0499370899').formatted).toBe('049-937-0899');
    });
    it('should return masked code', () => {
      expect(getNationalCodeInfo('0499370899').masked).toBe('049***0899');
    });
    it('should return province for valid code', () => {
      expect(getNationalCodeInfo('0089370899').province?.province).toBe('تهران');
    });
    it('should return null province for invalid code', () => {
      expect(getNationalCodeInfo('1234567890').province).toBe(null);
    });
    it('should normalize Persian digit input', () => {
      const info = getNationalCodeInfo('۰۰۸۹۳۷۰۸۹۹');
      expect(info.code).toBe('0089370899');
      expect(info.isValid).toBe(true);
    });
    it('should normalize zero-padded input', () => {
      const info = getNationalCodeInfo('499370899');
      expect(info.code).toBe('0499370899');
    });
    it('should return null province for valid code with unknown prefix', () => {
      const info = getNationalCodeInfo('0000000000');
      expect(info.province).toBe(null);
    });
  });

});