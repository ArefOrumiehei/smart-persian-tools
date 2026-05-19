import { describe, it, expect } from 'vitest';
import {
  rialToToman,
  tomanToRial,
  formatCurrency,
  addCurrencySuffix,
  toHumanReadable,
  formatCurrencyHuman,
  parseCurrencyString,
  detectCurrency,
  convertCurrency,
  calculatePercent,
  withTax,
  withoutTax,
  applyDiscount,
  getCurrencyInfo,
} from '../src/currency';

describe('Currency Module', () => {

  describe('rialToToman', () => {
    it('should convert rial to toman', () => {
      expect(rialToToman(10_000)).toBe(1_000);
    });
    it('should handle zero', () => {
      expect(rialToToman(0)).toBe(0);
    });
    it('should handle large numbers', () => {
      expect(rialToToman(1_000_000_000)).toBe(100_000_000);
    });
    it('should return float for non-divisible by 10', () => {
      expect(rialToToman(15)).toBe(1.5);
    });
  });

  describe('tomanToRial', () => {
    it('should convert toman to rial', () => {
      expect(tomanToRial(1_000)).toBe(10_000);
    });
    it('should handle zero', () => {
      expect(tomanToRial(0)).toBe(0);
    });
    it('should handle large numbers', () => {
      expect(tomanToRial(100_000_000)).toBe(1_000_000_000);
    });
    it('should handle floats', () => {
      expect(tomanToRial(1.5)).toBe(15);
    });
  });

  describe('formatCurrency', () => {
    it('should format toman by default', () => {
      expect(formatCurrency(1_500_000)).toContain('تومان');
    });
    it('should format rial when specified', () => {
      expect(formatCurrency(1_500_000, 'rial')).toContain('ریال');
    });
    it('should use Persian digits', () => {
      const result = formatCurrency(1_000);
      expect(result).toMatch(/[۰-۹]/);
    });
    it('should handle zero', () => {
      expect(formatCurrency(0)).toContain('تومان');
    });
    it('should not contain toman when rial is specified', () => {
      expect(formatCurrency(1_000, 'rial')).not.toContain('تومان');
    });
    it('should not contain rial when toman is specified', () => {
      expect(formatCurrency(1_000, 'toman')).not.toContain('ریال');
    });
  });

  describe('addCurrencySuffix', () => {
    it('should behave identical to formatCurrency for toman', () => {
      expect(addCurrencySuffix(1_000)).toBe(formatCurrency(1_000, 'toman'));
    });
    it('should behave identical to formatCurrency for rial', () => {
      expect(addCurrencySuffix(1_000, 'rial')).toBe(formatCurrency(1_000, 'rial'));
    });
  });

  describe('toHumanReadable', () => {
    it('should format millions', () => {
      expect(toHumanReadable(1_000_000)).toContain('میلیون');
    });
    it('should format billions', () => {
      expect(toHumanReadable(1_000_000_000)).toContain('میلیارد');
    });
    it('should format thousands', () => {
      expect(toHumanReadable(1_000)).toContain('هزار');
    });
    it('should format trillions', () => {
      expect(toHumanReadable(1_000_000_000_000)).toContain('هزار میلیارد');
    });
    it('should handle 1.5 million', () => {
      expect(toHumanReadable(1_500_000)).toContain('۱.۵');
      expect(toHumanReadable(1_500_000)).toContain('میلیون');
    });
    it('should handle 2.3 billion', () => {
      expect(toHumanReadable(2_300_000_000)).toContain('۲.۳');
      expect(toHumanReadable(2_300_000_000)).toContain('میلیارد');
    });
    it('should return Persian digits for small numbers', () => {
      expect(toHumanReadable(500)).toMatch(/[۰-۹]/);
    });
    it('should handle zero', () => {
      expect(toHumanReadable(0)).toBe('۰');
    });
    it('should use Persian digits in output', () => {
      expect(toHumanReadable(1_000_000)).toMatch(/[۰-۹]/);
    });
    it('should format exact million without decimal', () => {
      const result = toHumanReadable(2_000_000);
      expect(result).not.toContain('.');
      expect(result).toContain('میلیون');
    });
  });

  describe('formatCurrencyHuman', () => {
    it('should include toman suffix by default', () => {
      expect(formatCurrencyHuman(1_500_000)).toContain('تومان');
    });
    it('should include rial suffix when specified', () => {
      expect(formatCurrencyHuman(1_500_000, 'rial')).toContain('ریال');
    });
    it('should include human readable scale', () => {
      expect(formatCurrencyHuman(1_500_000)).toContain('میلیون');
    });
    it('should combine scale and currency correctly', () => {
      const result = formatCurrencyHuman(1_000_000);
      expect(result).toContain('میلیون');
      expect(result).toContain('تومان');
    });
  });

  describe('parseCurrencyString', () => {
    it('should parse Persian formatted currency string', () => {
      expect(parseCurrencyString('۱٬۵۰۰٬۰۰۰ تومان')).toBe(1_500_000);
    });
    it('should parse English formatted currency string', () => {
      expect(parseCurrencyString('1,500,000')).toBe(1_500_000);
    });
    it('should parse plain number string', () => {
      expect(parseCurrencyString('1500000')).toBe(1_500_000);
    });
    it('should parse Persian digits without commas', () => {
      expect(parseCurrencyString('۱۵۰۰')).toBe(1_500);
    });
    it('should return 0 for non-numeric string', () => {
      expect(parseCurrencyString('تومان')).toBe(0);
    });
    it('should return 0 for empty string', () => {
      expect(parseCurrencyString('')).toBe(0);
    });
    it('should handle rial suffix', () => {
      expect(parseCurrencyString('۱۰۰۰۰ ریال')).toBe(10_000);
    });
  });

  describe('detectCurrency', () => {
    it('should detect toman', () => {
      expect(detectCurrency('۱۵۰۰ تومان')).toBe('toman');
    });
    it('should detect rial by word', () => {
      expect(detectCurrency('۱۵۰۰۰ ریال')).toBe('rial');
    });
    it('should detect rial by symbol', () => {
      expect(detectCurrency('۱۵۰۰۰ ﷼')).toBe('rial');
    });
    it('should return null for no currency indicator', () => {
      expect(detectCurrency('۱۵۰۰')).toBe(null);
    });
    it('should return null for empty string', () => {
      expect(detectCurrency('')).toBe(null);
    });
    it('should detect currency in a sentence', () => {
      expect(detectCurrency('قیمت: ۱۵۰۰ تومان است')).toBe('toman');
    });
  });

  describe('convertCurrency', () => {
    it('should convert rial to toman', () => {
      const result = convertCurrency(10_000, 'rial', 'toman');
      expect(result).toContain('تومان');
    });
    it('should convert toman to rial', () => {
      const result = convertCurrency(1_000, 'toman', 'rial');
      expect(result).toContain('ریال');
    });
    it('should return same currency if from equals to', () => {
      const result = convertCurrency(1_000, 'toman', 'toman');
      expect(result).toContain('تومان');
    });
    it('should use Persian digits in output', () => {
      expect(convertCurrency(10_000, 'rial', 'toman')).toMatch(/[۰-۹]/);
    });
  });

  describe('calculatePercent', () => {
    it('should calculate 10% of 1,000,000', () => {
      expect(calculatePercent(1_000_000, 10)).toBe(100_000);
    });
    it('should calculate 9% VAT', () => {
      expect(calculatePercent(1_000_000, 9)).toBe(90_000);
    });
    it('should calculate 0%', () => {
      expect(calculatePercent(1_000_000, 0)).toBe(0);
    });
    it('should calculate 100%', () => {
      expect(calculatePercent(1_000_000, 100)).toBe(1_000_000);
    });
    it('should round result', () => {
      expect(calculatePercent(1_000, 3)).toBe(30);
    });
    it('should handle zero amount', () => {
      expect(calculatePercent(0, 9)).toBe(0);
    });
  });

  describe('withTax', () => {
    it('should add 9% VAT', () => {
      expect(withTax(1_000_000, 9)).toBe(1_090_000);
    });
    it('should add 0% tax (no change)', () => {
      expect(withTax(1_000_000, 0)).toBe(1_000_000);
    });
    it('should handle zero amount', () => {
      expect(withTax(0, 9)).toBe(0);
    });
    it('should add 100% tax (double)', () => {
      expect(withTax(1_000_000, 100)).toBe(2_000_000);
    });
  });

  describe('withoutTax', () => {
    it('should remove 9% VAT from tax-included amount', () => {
      expect(withoutTax(1_090_000, 9)).toBe(1_000_000);
    });
    it('should handle 0% tax', () => {
      expect(withoutTax(1_000_000, 0)).toBe(1_000_000);
    });
    it('should handle zero amount', () => {
      expect(withoutTax(0, 9)).toBe(0);
    });
    it('should be inverse of withTax', () => {
      const original = 500_000;
      const withVat = withTax(original, 9);
      expect(withoutTax(withVat, 9)).toBe(original);
    });
  });

  describe('applyDiscount', () => {
    it('should apply 20% discount', () => {
      const result = applyDiscount(1_000_000, 20);
      expect(result.amount).toBe(800_000);
      expect(result.saved).toBe(200_000);
    });
    it('should apply 0% discount', () => {
      const result = applyDiscount(1_000_000, 0);
      expect(result.amount).toBe(1_000_000);
      expect(result.saved).toBe(0);
    });
    it('should apply 100% discount', () => {
      const result = applyDiscount(1_000_000, 100);
      expect(result.amount).toBe(0);
      expect(result.saved).toBe(1_000_000);
    });
    it('amount + saved should equal original', () => {
      const original = 750_000;
      const result = applyDiscount(original, 15);
      expect(result.amount + result.saved).toBe(original);
    });
    it('should handle zero amount', () => {
      const result = applyDiscount(0, 20);
      expect(result.amount).toBe(0);
      expect(result.saved).toBe(0);
    });
  });

  describe('getCurrencyInfo', () => {
    it('should return correct amount', () => {
      expect(getCurrencyInfo(1_500_000).amount).toBe(1_500_000);
    });
    it('should return correct currency', () => {
      expect(getCurrencyInfo(1_500_000, 'toman').currency).toBe('toman');
      expect(getCurrencyInfo(1_500_000, 'rial').currency).toBe('rial');
    });
    it('should return formatted string with toman suffix', () => {
      expect(getCurrencyInfo(1_500_000, 'toman').formatted).toContain('تومان');
    });
    it('should return human readable string', () => {
      expect(getCurrencyInfo(1_500_000).humanReadable).toContain('میلیون');
    });
    it('should return correct inRial for toman input', () => {
      expect(getCurrencyInfo(1_000, 'toman').inRial).toBe(10_000);
    });
    it('should return correct inToman for rial input', () => {
      expect(getCurrencyInfo(10_000, 'rial').inToman).toBe(1_000);
    });
    it('should return same inRial and amount when currency is rial', () => {
      const info = getCurrencyInfo(10_000, 'rial');
      expect(info.inRial).toBe(info.amount);
    });
    it('should return same inToman and amount when currency is toman', () => {
      const info = getCurrencyInfo(1_000, 'toman');
      expect(info.inToman).toBe(info.amount);
    });
    it('should default to toman', () => {
      expect(getCurrencyInfo(1_000).currency).toBe('toman');
    });
  });

});