<div align="right">

<a href="./README.fa.md">فارسی</a>

</div>

# Smart-Persian-Tools

<div align="center">

<!-- ![CI](https://github.com/ArefOrumiehei/smart-persian-tools/actions/workflows/ci.yml/badge.svg) -->
![npm version](https://img.shields.io/npm/v/smart-persian-tools)
![downloads](https://img.shields.io/npm/dm/smart-persian-tools)
![license](https://img.shields.io/npm/l/smart-persian-tools)
![typescript](https://img.shields.io/badge/TypeScript-Ready-blue)
![tests](https://img.shields.io/badge/tests-passing-brightgreen)

</div>

A modern TypeScript utility library for Iranian applications.
Includes Persian digit tools, Iranian phone utilities, national code validation, currency helpers, and Jalali date utilities.

Built for:

* Frontend apps
* Backend services
* Admin panels
* Fintech products
* E-commerce systems
* CRM dashboards
* Persian/Farsi applications

---

## Features

* ☀ Persian / Arabic / English digit conversion
* 📱 Iranian mobile & landline utilities
* 🔍 Iranian national code validation
* 💰 Rial / Toman formatting & conversion
* 📅 Jalali (Persian) date utilities
* 🔒 TypeScript support
* ⚡ Zero dependencies
* 🌍 Browser & Node.js compatible
* 🧪 Fully tested

---

## Installation

```bash
npm install smart-persian-tools
```

```bash
yarn add smart-persian-tools
```

```bash
pnpm add smart-persian-tools
```

---

# Quick Start

```ts
import {
  toPersianDigits,
  validateIranianPhoneNumber,
  validateIranianNationalCode,
  formatCurrency,
  formatJalaliDate,
} from 'smart-persian-tools';

console.log(toPersianDigits(123456));
// ۱۲۳۴۵۶

console.log(validateIranianPhoneNumber('09121234567'));
// true

console.log(validateIranianNationalCode('0010350829'));
// true

console.log(formatCurrency(1500000));
// ۱٬۵۰۰٬۰۰۰ تومان

console.log(formatJalaliDate(new Date()));
// ۱۴۰۵/۰۲/۲۹
```

---

# Modules

---

# Digits Utilities

Utilities for converting and detecting Persian, Arabic, and English digits.

## Import

```ts
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
} from 'smart-persian-tools';
```

---

## Examples

### Convert English digits to Persian

```ts
toPersianDigits(123456);
// ۱۲۳۴۵۶
```

---

### Convert Persian digits to English

```ts
toEnglishDigits('۱۲۳۴۵۶');
// 123456
```

---

### Normalize mixed digits

```ts
normalizeDigits('۱۲٣45');
// 12345
```

---

### Detect digit type

```ts
detectDigitType('۱۲۳');
// persian

detectDigitType('123');
// english

detectDigitType('١٢٣');
// arabic

detectDigitType('۱۲3');
// mixed
```

---

### Extract digits

```ts
extractDigits('Phone: ۰۹۱۲۱۲۳۴۵۶۷');
// 09121234567
```

---

### Persian pad start

```ts
persianPadStart(25, 4);
// ۰۰۲۵
```

---

# Phone Utilities

Utilities for Iranian mobile and landline numbers.

## Import

```ts
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
} from 'smart-persian-tools';
```

---

## Examples

### Validate mobile number

```ts
validateIranianPhoneNumber('09121234567');
// true
```

---

### Normalize phone number

```ts
normalizeIranianPhoneNumber('+989121234567');
// 09121234567
```

---

### Format phone number

```ts
formatIranianPhoneNumber('09121234567');
// 0912-123-4567
```

---

### Detect operator

```ts
getOperator('09121234567');
// Hamrah Aval
```

---

### Convert to international format

```ts
toInternationalFormat('09121234567');
// +98 912 123 4567
```

---

### Convert to E164 format

```ts
toE164Format('09121234567');
// +989121234567
```

---

### Get phone info

```ts
getPhoneInfo('09121234567');
```

Returns:

```ts
{
  original: '09121234567',
  normalized: '09121234567',
  formatted: '0912-123-4567',
  isValid: true,
  type: 'mobile',
  operator: 'Hamrah Aval',
  prefix: '0912',
  province: null
}
```

---

### Extract phone numbers from text

```ts
extractPhoneNumbers(`
Call me:
09121234567
or +989351112233
`);
```

Returns:

```ts
[
  '09121234567',
  '09351112233'
]
```

---

# National Code Utilities

Iranian national code validation and formatting helpers.

## Import

```ts
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
} from 'smart-persian-tools';
```

---

## Examples

### Validate national code

```ts
validateIranianNationalCode('0010350829');
// true
```

---

### Format national code

```ts
formatNationalCode('0010350829');
// 001-035-0829
```

---

### Mask national code

```ts
maskNationalCode('0010350829');
// 001***0829
```

---

### Normalize national code

```ts
normalizeNationalCode('۱۲۳۴۵۶۷۸۹');
// 0123456789
```

---

### Convert to Persian digits

```ts
toPersianNationalCode('0010350829');
// ۰۰۱۰۳۵۰۸۲۹
```

---

### Extract national codes from text

```ts
extractNationalCodes(`
codes:
0010350829
0084575948
`);
```

---

### Get national code info

```ts
getNationalCodeInfo('0010350829');
```

Returns:

```ts
{
  code: '0010350829',
  isValid: true,
  formatted: '001-035-0829',
  masked: '001***0829',
  province: {
    name: 'Tehran'
  }
}
```

---

# Currency Utilities

Rial and Toman helpers for Iranian applications.

## Import

```ts
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
} from 'smart-persian-tools';
```

---

## Examples

### Convert Rial to Toman

```ts
rialToToman(100000);
// 10000
```

---

### Format currency

```ts
formatCurrency(1500000);
// ۱٬۵۰۰٬۰۰۰ تومان
```

---

### Human readable currency

```ts
formatCurrencyHuman(2500000);
// ۲.۵ میلیون تومان
```

---

### Parse currency string

```ts
parseCurrencyString('۱٬۵۰۰٬۰۰۰ تومان');
// 1500000
```

---

### Detect currency type

```ts
detectCurrency('۵۰۰ هزار تومان');
// toman
```

---

### Apply discount

```ts
applyDiscount(1000000, 20);
```

Returns:

```ts
{
  amount: 800000,
  saved: 200000
}
```

---

### Get currency info

```ts
getCurrencyInfo(1500000);
```

Returns:

```ts
{
  amount: 1500000,
  currency: 'toman',
  formatted: '۱٬۵۰۰٬۰۰۰ تومان',
  humanReadable: '۱.۵ میلیون تومان',
  inRial: 15000000,
  inToman: 1500000
}
```

---

# Jalali Date Utilities

Persian calendar and Jalali date helpers.

## Import

```ts
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
} from 'smart-persian-tools';
```

---

## Examples

### Get current Jalali date

```ts
getCurrentJalaliDate();
// ۱۴۰۵/۰۲/۲۹
```

---

### Convert Gregorian to Jalali

```ts
toJalaliDate(new Date('2024-03-20'));
```

Returns:

```ts
{
  year: 1403,
  month: 1,
  day: 1
}
```

---

### Format Jalali pattern

```ts
formatJalaliPattern(
  new Date(),
  'WD DD Month YYYY'
);

// دوشنبه ۲۹ اردیبهشت ۱۴۰۵
```

---

### Detect season

```ts
getJalaliSeason(new Date());
// بهار
```

---

### Check holiday

```ts
isIranianHoliday(new Date('2024-03-20'));
// true
```

---

### Relative date

```ts
getRelativeJalaliDate(
  new Date(Date.now() + 86400000)
);

// فردا
```

---

### Get Jalali date info

```ts
getJalaliDateInfo();
```

Returns:

```ts
{
  jalali: {
    year: 1405,
    month: 2,
    day: 29
  },
  formatted: '۱۴۰۵/۰۲/۲۹',
  monthName: 'اردیبهشت',
  weekday: 'دوشنبه',
  isHoliday: false,
  isWeekend: false,
  season: 'بهار'
}
```

---

# TypeScript Support

Fully written in TypeScript with complete type definitions.

```ts
import type {
  Currency,
  CurrencyInfo,
  JalaliDate,
  JalaliDateInfo,
  PhoneInfo,
  PhoneOperator,
  PhoneType,
} from 'smart-persian-tools';
```

---

# Environment Support

* Node.js
* Bun
* Deno
* Browser
* React
* Next.js
* Vue
* Nuxt
* React Native

---

# Contributing

Contributions, issues, and feature requests are welcome.

```bash
git clone https://github.com/ArefOrumiehei/smart-persian-tools.git
```

```bash
npm install
```

```bash
npm run test
```

---

# License

MIT © Aref Orumiehei
