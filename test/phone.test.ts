import { describe, it, expect } from 'vitest';
import {
  normalizeIranianPhoneNumber,
  validateIranianPhoneNumber,
  formatIranianPhoneNumber,
  getOperator,
  isLandline,
  isMobile,
  getPhoneType,
  getLandlineProvince,
  toInternationalFormat,
  toE164Format,
  getPhoneInfo,
  maskPhoneNumber,
  isSamePhoneNumber,
  extractPhoneNumbers,
} from '../src/phone';

describe('Phone Module', () => {

  describe('normalizeIranianPhoneNumber', () => {
    it('should keep already normalized number as is', () => {
      expect(normalizeIranianPhoneNumber('09121234567')).toBe('09121234567');
    });
    it('should convert +98 prefix to 0', () => {
      expect(normalizeIranianPhoneNumber('+989121234567')).toBe('09121234567');
    });
    it('should convert 98 prefix to 0', () => {
      expect(normalizeIranianPhoneNumber('989121234567')).toBe('09121234567');
    });
    it('should convert 0098 prefix to 0', () => {
      expect(normalizeIranianPhoneNumber('00989121234567')).toBe('09121234567');
    });
    it('should strip dashes and spaces', () => {
      expect(normalizeIranianPhoneNumber('0912-123-4567')).toBe('09121234567');
    });
    it('should strip parentheses', () => {
      expect(normalizeIranianPhoneNumber('(0912) 123 4567')).toBe('09121234567');
    });
  });

  describe('validateIranianPhoneNumber', () => {
    it('should return true for valid mobile number', () => {
      expect(validateIranianPhoneNumber('09121234567')).toBe(true);
    });
    it('should return true for +98 format', () => {
      expect(validateIranianPhoneNumber('+989121234567')).toBe(true);
    });
    it('should return false for landline number', () => {
      expect(validateIranianPhoneNumber('02112345678')).toBe(false);
    });
    it('should return false for too short number', () => {
      expect(validateIranianPhoneNumber('0912123456')).toBe(false);
    });
    it('should return false for too long number', () => {
      expect(validateIranianPhoneNumber('091212345678')).toBe(false);
    });
    it('should return false for empty string', () => {
      expect(validateIranianPhoneNumber('')).toBe(false);
    });
    it('should return false for non-numeric string', () => {
      expect(validateIranianPhoneNumber('abcdefghijk')).toBe(false);
    });
  });

  describe('formatIranianPhoneNumber', () => {
    it('should format a valid mobile number', () => {
      expect(formatIranianPhoneNumber('09121234567')).toBe('0912-123-4567');
    });
    it('should format a +98 number', () => {
      expect(formatIranianPhoneNumber('+989121234567')).toBe('0912-123-4567');
    });
    it('should return original string for invalid number', () => {
      expect(formatIranianPhoneNumber('invalid')).toBe('invalid');
    });
    it('should return original for too short number', () => {
      expect(formatIranianPhoneNumber('0912123')).toBe('0912123');
    });
  });

  describe('getOperator', () => {
    it('should return Hamrah Aval for 0912', () => {
      expect(getOperator('09121234567')).toBe('Hamrah Aval');
    });
    it('should return Hamrah Aval for 0911', () => {
      expect(getOperator('09111234567')).toBe('Hamrah Aval');
    });
    it('should return Irancell for 0930', () => {
      expect(getOperator('09301234567')).toBe('Irancell');
    });
    it('should return Irancell for 0901', () => {
      expect(getOperator('09011234567')).toBe('Irancell');
    });
    it('should return Rightel for 0920', () => {
      expect(getOperator('09201234567')).toBe('Rightel');
    });
    it('should return Shatel for 0998', () => {
      expect(getOperator('09981234567')).toBe('Shatel');
    });
    it('should return Samantel for 09999', () => {
      expect(getOperator('09999123456')).toBe('Samantel');
    });
    it('should return Aptel for 0999', () => {
      expect(getOperator('09991234567')).toBe('Aptel');
    });
    it('should return Unknown for unrecognized prefix', () => {
      expect(getOperator('09601234567')).toBe('Unknown');
    });
  });

  describe('isLandline', () => {
    it('should return true for Tehran landline', () => {
      expect(isLandline('02112345678')).toBe(true);
    });
    it('should return true for Isfahan landline', () => {
      expect(isLandline('03112345678')).toBe(true);
    });
    it('should return false for mobile number', () => {
      expect(isLandline('09121234567')).toBe(false);
    });
    it('should return false for empty string', () => {
      expect(isLandline('')).toBe(false);
    });
  });

  describe('isMobile', () => {
    it('should return true for valid mobile', () => {
      expect(isMobile('09121234567')).toBe(true);
    });
    it('should return false for landline', () => {
      expect(isMobile('02112345678')).toBe(false);
    });
    it('should return false for invalid number', () => {
      expect(isMobile('123')).toBe(false);
    });
  });

  describe('getPhoneType', () => {
    it('should return mobile for mobile number', () => {
      expect(getPhoneType('09121234567')).toBe('mobile');
    });
    it('should return landline for landline number', () => {
      expect(getPhoneType('02112345678')).toBe('landline');
    });
    it('should return unknown for invalid number', () => {
      expect(getPhoneType('123')).toBe('unknown');
    });
    it('should return unknown for empty string', () => {
      expect(getPhoneType('')).toBe('unknown');
    });
  });

  describe('getLandlineProvince', () => {
    it('should return Tehran for 021', () => {
      expect(getLandlineProvince('02112345678')).toBe('تهران');
    });
    it('should return Isfahan for 031', () => {
      expect(getLandlineProvince('03112345678')).toBe('اصفهان');
    });
    it('should return Azarbaijan Sharghi for 041', () => {
      expect(getLandlineProvince('04112345678')).toBe('آذربایجان شرقی');
    });
    it('should return Khorasan Razavi for 051', () => {
      expect(getLandlineProvince('05112345678')).toBe('خراسان رضوی');
    });
    it('should return null for mobile number', () => {
      expect(getLandlineProvince('09121234567')).toBe(null);
    });
    it('should return null for unknown area code', () => {
      expect(getLandlineProvince('09912345678')).toBe(null);
    });
  });

  describe('toInternationalFormat', () => {
    it('should convert valid mobile to international format', () => {
      expect(toInternationalFormat('09121234567')).toBe('+98 912 123 4567');
    });
    it('should handle +98 input', () => {
      expect(toInternationalFormat('+989121234567')).toBe('+98 912 123 4567');
    });
    it('should return null for invalid number', () => {
      expect(toInternationalFormat('invalid')).toBe(null);
    });
    it('should return null for landline', () => {
      expect(toInternationalFormat('02112345678')).toBe(null);
    });
  });

  describe('toE164Format', () => {
    it('should convert valid mobile to E.164', () => {
      expect(toE164Format('09121234567')).toBe('+989121234567');
    });
    it('should handle 0098 input', () => {
      expect(toE164Format('00989121234567')).toBe('+989121234567');
    });
    it('should return null for invalid number', () => {
      expect(toE164Format('invalid')).toBe(null);
    });
    it('should return null for landline', () => {
      expect(toE164Format('02112345678')).toBe(null);
    });
  });

  describe('getPhoneInfo', () => {
    it('should return full info for valid mobile', () => {
      const info = getPhoneInfo('09121234567');
      expect(info.isValid).toBe(true);
      expect(info.type).toBe('mobile');
      expect(info.operator).toBe('Hamrah Aval');
      expect(info.normalized).toBe('09121234567');
      expect(info.formatted).toBe('0912-123-4567');
      expect(info.province).toBe(null);
    });
    it('should return full info for landline', () => {
      const info = getPhoneInfo('02112345678');
      expect(info.isValid).toBe(false);
      expect(info.type).toBe('landline');
      expect(info.operator).toBe(null);
      expect(info.province).toBe('تهران');
    });
    it('should return isValid false for invalid number', () => {
      const info = getPhoneInfo('123');
      expect(info.isValid).toBe(false);
      expect(info.type).toBe('unknown');
      expect(info.operator).toBe(null);
      expect(info.province).toBe(null);
    });
    it('should preserve original input', () => {
      const info = getPhoneInfo('+989121234567');
      expect(info.original).toBe('+989121234567');
    });
  });

  describe('maskPhoneNumber', () => {
    it('should mask middle digits with default char', () => {
      expect(maskPhoneNumber('09121234567')).toBe('0912***4567');
    });
    it('should mask with custom char', () => {
      expect(maskPhoneNumber('09121234567', 'X')).toBe('0912XXX4567');
    });
    it('should return original for invalid number', () => {
      expect(maskPhoneNumber('invalid')).toBe('invalid');
    });
    it('should handle +98 format', () => {
      expect(maskPhoneNumber('+989121234567')).toBe('0912***4567');
    });
  });

  describe('isSamePhoneNumber', () => {
    it('should return true for same number in different formats', () => {
      expect(isSamePhoneNumber('09121234567', '+989121234567')).toBe(true);
    });
    it('should return true for 0098 vs 09', () => {
      expect(isSamePhoneNumber('00989121234567', '09121234567')).toBe(true);
    });
    it('should return false for different numbers', () => {
      expect(isSamePhoneNumber('09121234567', '09351234567')).toBe(false);
    });
    it('should return false for invalid vs valid', () => {
      expect(isSamePhoneNumber('invalid', '09121234567')).toBe(false);
    });
  });

  describe('extractPhoneNumbers', () => {
    it('should extract a single phone number from text', () => {
      expect(extractPhoneNumbers('call me at 09121234567')).toEqual(['09121234567']);
    });
    it('should extract multiple phone numbers', () => {
      const result = extractPhoneNumbers('09121234567 and 09351234567');
      expect(result).toContain('09121234567');
      expect(result).toContain('09351234567');
      expect(result).toHaveLength(2);
    });
    it('should deduplicate repeated numbers', () => {
      const result = extractPhoneNumbers('09121234567 and 09121234567');
      expect(result).toHaveLength(1);
    });
    it('should extract +98 format from text', () => {
      expect(extractPhoneNumbers('contact: +989121234567')).toEqual(['09121234567']);
    });
    it('should return empty array if no numbers found', () => {
      expect(extractPhoneNumbers('no numbers here')).toEqual([]);
    });
    it('should handle mixed formats in same text', () => {
      const result = extractPhoneNumbers('+989121234567 or 00989121234567');
      expect(result).toHaveLength(1);
      expect(result[0]).toBe('09121234567');
    });
  });

});