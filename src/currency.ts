import { toPersianDigits, normalizeDigits } from './digits';

export type Currency = 'toman' | 'rial';

export interface CurrencyInfo {
  amount: number;
  currency: Currency;
  formatted: string;
  humanReadable: string;
  inRial: number;
  inToman: number;
}

const SCALES = [
  { value: 1_000_000_000_000, label: 'هزار میلیارد' },
  { value: 1_000_000_000,     label: 'میلیارد' },
  { value: 1_000_000,         label: 'میلیون' },
  { value: 1_000,             label: 'هزار' },
];

export const rialToToman = (rial: number): number => rial / 10;
export const tomanToRial = (toman: number): number => toman * 10;

export const formatCurrency = (amount: number, currency: Currency = 'toman'): string => {
  const formatted = amount.toLocaleString('fa-IR');
  return currency === 'toman' ? `${formatted} تومان` : `${formatted} ریال`;
};

export const addCurrencySuffix = (
  amount: number,
  currency: Currency = 'toman'
): string => formatCurrency(amount, currency);

export const toHumanReadable = (amount: number): string => {
  for (const { value, label } of SCALES) {
    if (amount >= value) {
      const result = amount / value;
      const formatted = toPersianDigits(
        Number.isInteger(result) ? result : result.toFixed(1)
      );
      return `${formatted} ${label}`;
    }
  }
  return toPersianDigits(amount);
};

export const formatCurrencyHuman = (
  amount: number,
  currency: Currency = 'toman'
): string => {
  const suffix = currency === 'toman' ? 'تومان' : 'ریال';
  return `${toHumanReadable(amount)} ${suffix}`;
};

export const parseCurrencyString = (input: string): number => {
  const digitsOnly = normalizeDigits(input).replace(/[^0-9.]/g, '');
  return parseFloat(digitsOnly) || 0;
};

export const detectCurrency = (input: string): Currency | null => {
  if (/تومان/.test(input)) return 'toman';
  if (/ریال|﷼/.test(input)) return 'rial';
  return null;
};

export const convertCurrency = (
  amount: number,
  from: Currency,
  to: Currency
): string => {
  if (from === to) return formatCurrency(amount, to);
  const converted = from === 'rial' ? rialToToman(amount) : tomanToRial(amount);
  return formatCurrency(converted, to);
};


export const calculatePercent = (amount: number, percent: number): number =>
  Math.round((amount * percent) / 100);

export const withTax = (amount: number, taxPercent: number): number =>
  amount + calculatePercent(amount, taxPercent);

export const withoutTax = (amount: number, taxPercent: number): number =>
  Math.round(amount / (1 + taxPercent / 100));

export const applyDiscount = (
  amount: number,
  discountPercent: number
): { amount: number; saved: number } => {
  const saved = calculatePercent(amount, discountPercent);
  return { amount: amount - saved, saved };
};

export const getCurrencyInfo = (
  amount: number,
  currency: Currency = 'toman'
): CurrencyInfo => ({
  amount,
  currency,
  formatted:     formatCurrency(amount, currency),
  humanReadable: formatCurrencyHuman(amount, currency),
  inRial:        currency === 'rial' ? amount : tomanToRial(amount),
  inToman:       currency === 'toman' ? amount : rialToToman(amount),
});