const persianDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
const englishDigits = ['0','1','2','3','4','5','6','7','8','9'];
const arabicDigits  = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];

export const toPersianDigits = (input: string | number): string => {
  return input.toString().replace(/\d/g, d => persianDigits[+d]);
};

export const toEnglishDigits = (input: string): string => {
  return input.replace(/[۰-۹]/g, d => englishDigits[persianDigits.indexOf(d)]);
};

export const containsPersianDigits = (input: string): boolean => {
  return /[۰-۹]/.test(input);
};

export const containsEnglishDigits = (input: string): boolean => {
  return /[0-9]/.test(input);
};

export const containsArabicDigits = (input: string): boolean => {
  return /[٠-٩]/.test(input);
};

export const arabicToPersianDigits = (input: string): string =>
  input.replace(/[٠-٩]/g, d => persianDigits[arabicDigits.indexOf(d)]);

export const arabicToEnglishDigits = (input: string): string =>
  input.replace(/[٠-٩]/g, d => englishDigits[arabicDigits.indexOf(d)]);

export const normalizeDigits = (input: string): string =>
  toEnglishDigits(arabicToEnglishDigits(input));

export const detectDigitType = (input: string): 'persian' | 'arabic' | 'english' | 'mixed' | 'none' => {
  const hasPersian = containsPersianDigits(input);
  const hasArabic  = containsArabicDigits(input);
  const hasEnglish = containsEnglishDigits(input);

  const count = [hasPersian, hasArabic, hasEnglish].filter(Boolean).length;
  if (count === 0) return 'none';
  if (count > 1)   return 'mixed';
  if (hasPersian)  return 'persian';
  if (hasArabic)   return 'arabic';
  return 'english';
};

export const removeDigits = (input: string): string =>
  input.replace(/[0-9۰-۹٠-٩]/g, '');

export const extractDigits = (input: string): string =>
  normalizeDigits(input).replace(/\D/g, '');

export const isDigitsOnly = (input: string): boolean =>
  /^[0-9۰-۹٠-٩]+$/.test(input);

export const persianPadStart = (input: string | number, length: number): string =>
  toPersianDigits(input).padStart(length, '۰');