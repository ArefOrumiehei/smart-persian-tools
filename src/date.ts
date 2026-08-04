import { toEnglishDigits, toPersianDigits } from './digits';

export interface JalaliDate {
  year: number;
  month: number;
  day: number;
}

export interface GregorianDate {
  year: number;
  month: number;
  day: number;
}

export interface JalaliDateInfo {
  jalali: JalaliDate;
  formatted: string;
  monthName: string;
  weekday: string;
  isHoliday: boolean;
  isWeekend: boolean;
  season: string;
}

export type CalendarType = 'jalali' | 'gregorian';

export type DateInput = string | Date | JalaliDate;

export interface ConvertDateOptions {
  from: CalendarType;
  to: CalendarType;
}

export interface ConversionResult {
  date: Date;                    // always a JS Date (Gregorian)
  jalali: JalaliDate;            // always available
  gregorian: GregorianDate;      // always available
  formatted: {
    jalali: string;              // e.g. '۱۴۰۳/۰۱/۰۱'
    gregorian: string;           // e.g. '2024-03-20'
    jalaliLong: string;          // e.g. 'چهارشنبه، ۱ فروردین ۱۴۰۳'
    gregorianLong: string;       // e.g. 'Wednesday, March 20, 2024'
  };
}

export const PERSIAN_WEEKDAYS = [
  'شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'
];

export const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد',
  'تیر',     'مرداد',    'شهریور',
  'مهر',     'آبان',     'آذر',
  'دی',      'بهمن',     'اسفند',
];

export const PERSIAN_SEASONS = [
  { name: 'بهار', months: [1, 2, 3] },
  { name: 'تابستان', months: [4, 5, 6] },
  { name: 'پاییز', months: [7, 8, 9] },
  { name: 'زمستان', months: [10, 11, 12] },
];

export const IRANIAN_HOLIDAYS: [number, number][] = [
  [1, 1],   // نوروز
  [1, 2],   // نوروز
  [1, 3],   // نوروز
  [1, 4],   // نوروز
  [1, 12],  // روز جمهوری اسلامی
  [1, 13],  // روز طبیعت
  [3, 14],  // رحلت امام خمینی
  [3, 15],  // قیام ۱۵ خرداد
  [11, 22], // پیروزی انقلاب اسلامی
  [12, 29], // ملی شدن صنعت نفت
];

export const getCurrentJalaliDate = (): string => {
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());
};

export const getPersianWeekday = (date: Date = new Date()): string => {
  return new Intl.DateTimeFormat('fa-IR', { weekday: 'long' }).format(date);
};

export const getPersianMonthName = (date: Date = new Date()): string => {
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', { month: 'long' }).format(date);
};

export const formatJalaliDate = (date: Date): string => {
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian').format(date);
};

export const toJalaliDate = (date: Date = new Date()): JalaliDate => {
  const parts = new Intl.DateTimeFormat(
    'fa-IR-u-ca-persian',
    {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }
  ).formatToParts(date);

  const get = (type: string): number => {
    const value =
      parts.find(p => p.type === type)?.value ?? '0';

    return Number(toEnglishDigits(value));
  };

  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
  };
};

export const formatJalaliPattern = (date: Date, pattern: string): string => {
  const { year, month, day } = toJalaliDate(date);
  const monthName = PERSIAN_MONTHS[month - 1];
  const weekday = getPersianWeekday(date);

  return pattern
    .replace('YYYY', toPersianDigits(year))
    .replace('MM',   toPersianDigits(String(month).padStart(2, '0')))
    .replace('DD',   toPersianDigits(String(day).padStart(2, '0')))
    .replace('Month', monthName)
    .replace('WD',   weekday);
};

export const getJalaliSeason = (date: Date = new Date()): string => {
  const { month } = toJalaliDate(date);
  return PERSIAN_SEASONS.find(s => s.months.includes(month))?.name ?? '';
};

export const isIranianWeekend = (date: Date = new Date()): boolean => {
  return date.getDay() === 5; // Friday
};

export const isIranianHoliday = (date: Date = new Date()): boolean => {
  const { month, day } = toJalaliDate(date);
  return IRANIAN_HOLIDAYS.some(([m, d]) => m === month && d === day);
};

export const getDaysInJalaliMonth = (year: number, month: number): number => {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  return isJalaliLeapYear(year) ? 30 : 29;
};

export const isJalaliLeapYear = (year: number): boolean => {
  const mod = (((year - 474) % 2820) + 2820) % 2820 + 474;
  return (((mod + 38) * 682) % 2816) < 682;
};

export const getRelativeJalaliDate = (date: Date, base: Date = new Date()): string => {
  const diffMs   = date.getTime() - base.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0)  return 'امروز';
  if (diffDays === -1) return 'دیروز';
  if (diffDays === 1)  return 'فردا';
  if (diffDays === -2) return 'پریروز';
  if (diffDays === 2)  return 'پس‌فردا';

  if (diffDays < 0) {
    if (diffDays >= -7)  return `${toPersianDigits(Math.abs(diffDays))} روز پیش`;
    if (diffDays >= -30) return `${toPersianDigits(Math.ceil(Math.abs(diffDays) / 7))} هفته پیش`;
    if (diffDays >= -365) return `${toPersianDigits(Math.ceil(Math.abs(diffDays) / 30))} ماه پیش`;
    return `${toPersianDigits(Math.ceil(Math.abs(diffDays) / 365))} سال پیش`;
  }

  if (diffDays <= 7)   return `${toPersianDigits(diffDays)} روز دیگر`;
  if (diffDays <= 30)  return `${toPersianDigits(Math.ceil(diffDays / 7))} هفته دیگر`;
  if (diffDays <= 365) return `${toPersianDigits(Math.ceil(diffDays / 30))} ماه دیگر`;
  return `${toPersianDigits(Math.ceil(diffDays / 365))} سال دیگر`;
};

export const getJalaliDateInfo = (date: Date = new Date()): JalaliDateInfo => {
  const jalali = toJalaliDate(date);

  return {
    jalali,
    formatted: formatJalaliDate(date),
    monthName: PERSIAN_MONTHS[jalali.month - 1],
    weekday: getPersianWeekday(date),
    isHoliday: isIranianHoliday(date),
    isWeekend: isIranianWeekend(date),
    season: getJalaliSeason(date),
  };
};

// Get start and end of a Jalali month as Gregorian Date objects
export const getJalaliMonthRange = (
  year: number,
  month: number
): { start: Date; end: Date } => {
  const daysInMonth = getDaysInJalaliMonth(year, month);

  // Use Intl to find what Gregorian dates correspond to Jalali month boundaries
  // We do this by iterating from an approximate start date
  const approxStart = new Date(year - 579, (month - 1 + 2) % 12, 1);

  // Find exact start
  let start = approxStart;
  for (let i = -5; i <= 5; i++) {
    const candidate = new Date(approxStart);
    candidate.setDate(approxStart.getDate() + i);
    const j = toJalaliDate(candidate);
    if (j.year === year && j.month === month && j.day === 1) {
      start = candidate;
      break;
    }
  }

  const end = new Date(start);
  end.setDate(start.getDate() + daysInMonth - 1);

  return { start, end };
};

export const jalaliDateDiff = (
  from: Date,
  to: Date
): { days: number; months: number; years: number; label: string } => {
  const diffMs = Math.abs(to.getTime() - from.getTime());
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let label: string;
  if (days === 0) label = 'همین روز';
  else if (days < 30) label = `${toPersianDigits(days)} روز`;
  else if (months < 12) label = `${toPersianDigits(months)} ماه`;
  else label = `${toPersianDigits(years)} سال`;

  return { days, months, years, label };
};


/**
 * Parse a Jalali date string in common formats to a JalaliDate object
 * Supported formats:
 *   '1403/01/01'
 *   '1403-01-01'
 *   '1403 01 01'
 *   '01/01/1403'  (day/month/year — auto detected when year is not first)
 *   '۱۴۰۳/۰۱/۰۱' (Persian digits)
 */
const parseJalaliString = (input: string): JalaliDate => {
  const trimmed = input.trim();
  const normalized = toEnglishDigits(trimmed).replace(/[.\s،, \-]+/g, '/');
  const parts = normalized.split('/').map(Number);

  if (parts.length !== 3 || parts.some(isNaN)) {
    throw new Error(`Invalid Jalali date string: "${input}"`);
  }

  // Detect if year is first or last
  // Jalali years are 4 digits (1300-1500 range), days/months are 1-2 digits
  let year: number, month: number, day: number;

  if (parts[0] > 31) {
    // year/month/day
    [year, month, day] = parts;
  } else if (parts[2] > 31) {
    // day/month/year
    [day, month, year] = parts;
  } else {
    throw new Error(`Cannot determine year in Jalali date string: "${input}"`);
  }

  if (month < 1 || month > 12) throw new Error(`Invalid month: ${month}`);
  if (day < 1 || day > 31)     throw new Error(`Invalid day: ${day}`);

  return { year, month, day };
};

/**
 * Parse a Gregorian date string in common formats
 * Supported:
 *   '2024-03-20'  (ISO)
 *   '2024/03/20'
 *   '20/03/2024'  (day/month/year)
 *   '03/20/2024'  (month/day/year — US format, ambiguous, treated as M/D/Y when middle <= 12)
 */
const parseGregorianString = (input: string): Date => {
  const trimmed = input.trim();

  const native = new Date(trimmed);
  if (!isNaN(native.getTime()) && trimmed.includes('-')) return native;

  const normalized = trimmed.replace(/[.\s،,]+/g, '/');
  const parts = normalized.split('/').map(Number);

  if (parts.length !== 3 || parts.some(isNaN)) {
    throw new Error(`Invalid Gregorian date string: "${input}"`);
  }

  let year: number, month: number, day: number;

  if (parts[0] > 31) {
    // year/month/day
    [year, month, day] = parts;
  } else if (parts[2] > 31) {
    // day/month/year or month/day/year
    // if parts[0] > 12, it must be day
    if (parts[0] > 12) {
      [day, month, year] = parts;
    } else {
      // ambiguous — default to day/month/year (more common internationally)
      [day, month, year] = parts;
    }
  } else {
    throw new Error(`Cannot determine year in Gregorian date string: "${input}"`);
  }

  const result = new Date(year, month - 1, day);
  if (isNaN(result.getTime())) {
    throw new Error(`Invalid Gregorian date: "${input}"`);
  }
  return result;
};

/**
 * Convert a JalaliDate to a JS Date (Gregorian)
 * Uses an iterative approach based on Intl — no external library needed
 */
const jalaliToGregorianDate = (jalali: JalaliDate): Date => {
  // Approximate Gregorian year (Jalali year + 621 or 622)
  const approxYear = jalali.year + 621;
  const approxDate = new Date(approxYear, jalali.month - 1, jalali.day);

  // Search within a ±2 day window to find exact match
  for (let offset = -2; offset <= 400; offset++) {
    const candidate = new Date(approxDate);
    candidate.setDate(approxDate.getDate() + offset);
    const j = toJalaliDate(candidate);
    if (j.year === jalali.year && j.month === jalali.month && j.day === jalali.day) {
      return candidate;
    }
  }

  throw new Error(`Could not convert Jalali date: ${jalali.year}/${jalali.month}/${jalali.day}`);
};

const toGregorianDate = (date: Date): GregorianDate => ({
  year:  date.getFullYear(),
  month: date.getMonth() + 1,
  day:   date.getDate(),
});

const formatGregorianShort = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatGregorianLong = (date: Date): string =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }).format(date);


const formatJalaliShort = (jalali: JalaliDate): string =>
  toPersianDigits(
    `${jalali.year}/${String(jalali.month).padStart(2, '0')}/${String(jalali.day).padStart(2, '0')}`
  );


const formatJalaliLong = (jalali: JalaliDate, date: Date): string => {
  const weekday   = getPersianWeekday(date);
  const monthName = PERSIAN_MONTHS[jalali.month - 1];
  return `${weekday}، ${toPersianDigits(jalali.day)} ${monthName} ${toPersianDigits(jalali.year)}`;
};

const normalizeJalaliInput = (input: DateInput): Date => {
  if (input instanceof Date)   return input;
  if (typeof input === 'string') return jalaliToGregorianDate(parseJalaliString(input));
  if (typeof input === 'object' && 'year' in input) return jalaliToGregorianDate(input);
  throw new Error('Invalid input for Jalali date');
};

const normalizeGregorianInput = (input: DateInput): Date => {
  if (input instanceof Date)   return input;
  if (typeof input === 'string') return parseGregorianString(input);
  if (typeof input === 'object' && 'year' in input) {
    const { year, month, day } = input as GregorianDate;
    return new Date(year, month - 1, day);
  }
  throw new Error('Invalid input for Gregorian date');
};

const buildResult = (date: Date): ConversionResult => {
  const jalali     = toJalaliDate(date);
  const gregorian  = toGregorianDate(date);

  return {
    date,
    jalali,
    gregorian,
    formatted: {
      jalali:        formatJalaliShort(jalali),
      gregorian:     formatGregorianShort(date),
      jalaliLong:    formatJalaliLong(jalali, date),
      gregorianLong: formatGregorianLong(date),
    },
  };
};

export const convertDate = (input: DateInput, options: ConvertDateOptions): ConversionResult => {
  const { from } = options;

  const date = from === 'jalali' ? normalizeJalaliInput(input) : normalizeGregorianInput(input);

  return buildResult(date);
};