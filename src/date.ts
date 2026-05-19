import { toEnglishDigits, toPersianDigits } from './digits';

export interface JalaliDate {
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