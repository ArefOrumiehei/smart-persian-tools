<div align="left">

<a href="./README.md">English</a>

</div>

# Smart-Persian-Tools

<div align="center">

![CI](https://github.com/ArefOrumiehei/smart-persian-tools/actions/workflows/ci.yml/badge.svg)
![npm version](https://img.shields.io/npm/v/smart-persian-tools)
![downloads](https://img.shields.io/npm/dm/smart-persian-tools)
![License](https://img.shields.io/npm/l/smart-persian-tools)
![typescript](https://img.shields.io/badge/TypeScript-Ready-blue)
![tests](https://img.shields.io/badge/tests-passing-brightgreen)

</div>

پکیجی جامع و سبک که بیشترین نیازهای توسعه‌دهندگان برای تبدیل، نرمال‌سازی و اعتبارسنجی داده‌های فارسی را پوشش می‌دهد.

شامل:

* تبدیل اعداد فارسی / عربی / انگلیسی
* ابزارهای شماره موبایل و تلفن ایران
* اعتبارسنجی کد ملی
* ابزارهای پولی و تومان / ریال
* ابزارهای تاریخ جلالی (شمسی)

مناسب برای:

* فرانت‌اند
* بک‌اند
* پنل‌های ادمین
* فروشگاه‌ها
* فین‌تک
* داشبوردهای CRM
* اپلیکیشن‌های فارسی

---

## ویژگی‌ها

<div align="right">

* ☀ تبدیل و نرمال‌سازی اعداد فارسی، عربی و انگلیسی
* 📱 ابزارهای کامل شماره موبایل و تلفن ثابت ایران
* 🔍 اعتبارسنجی و پردازش کد ملی
* 💰 فرمت و تبدیل تومان / ریال
* 📅 ابزارهای تاریخ شمسی و جلالی
* ⚡ بدون وابستگی (Zero Dependency)
* 🔒 پشتیبانی کامل از TypeScript
* 🌍 قابل استفاده در Browser و Node.js
* 🧪 دارای تست کامل

</div>

---

# نصب

```bash id="epxwyo"
npm install smart-persian-tools
```

```bash id="sx44e5"
yarn add smart-persian-tools
```

```bash id="h2yvcn"
pnpm add smart-persian-tools
```

---

# شروع سریع

```ts id="ltl68v"
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

# ابزارهای اعداد (Digits)

ابزارهایی برای تبدیل، تشخیص و نرمال‌سازی اعداد فارسی، عربی و انگلیسی.

## ایمپورت

```ts id="77d3wp"
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

## مثال‌ها

### تبدیل اعداد انگلیسی به فارسی

```ts id="ek1n7c"
toPersianDigits(123456);
// ۱۲۳۴۵۶
```

---

### تبدیل اعداد فارسی به انگلیسی

```ts id="k0v0om"
toEnglishDigits('۱۲۳۴۵۶');
// 123456
```

---

### نرمال‌سازی اعداد ترکیبی

```ts id="8uy5fr"
normalizeDigits('۱۲٣45');
// 12345
```

---

### تشخیص نوع اعداد

```ts id="1sp1pq"
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

### استخراج اعداد

```ts id="z8f9ef"
extractDigits('Phone: ۰۹۱۲۱۲۳۴۵۶۷');
// 09121234567
```

---

### padStart فارسی

```ts id="o0pr2d"
persianPadStart(25, 4);
// ۰۰۲۵
```

---

# ابزارهای شماره تلفن

ابزارهای کامل شماره موبایل و تلفن ثابت ایران.

## ایمپورت

```ts id="ezqg7g"
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

## مثال‌ها

### اعتبارسنجی شماره موبایل

```ts id="f3m68x"
validateIranianPhoneNumber('09121234567');
// true
```

---

### نرمال‌سازی شماره

```ts id="7m1l4j"
normalizeIranianPhoneNumber('+989121234567');
// 09121234567
```

---

### فرمت شماره موبایل

```ts id="3f9c4n"
formatIranianPhoneNumber('09121234567');
// 0912-123-4567
```

---

### تشخیص اپراتور

```ts id="px6r7q"
getOperator('09121234567');
// Hamrah Aval
```

---

### فرمت بین‌المللی

```ts id="2fajit"
toInternationalFormat('09121234567');
// +98 912 123 4567
```

---

### فرمت E164

```ts id="q0rnnm"
toE164Format('09121234567');
// +989121234567
```

---

### دریافت اطلاعات کامل شماره

```ts id="c9np0u"
getPhoneInfo('09121234567');
```

خروجی:

```ts id="6zkc0t"
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

### استخراج شماره‌ها از متن

```ts id="sl3td8"
extractPhoneNumbers(`
Call me:
09121234567
or +989351112233
`);
```

---

# ابزارهای کد ملی

اعتبارسنجی، فرمت و پردازش کد ملی ایران.

## ایمپورت

```ts id="3u4az9"
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

## مثال‌ها

### اعتبارسنجی کد ملی

```ts id="1k8ftn"
validateIranianNationalCode('0010350829');
// true
```

---

### فرمت کد ملی

```ts id="r2n6vl"
formatNationalCode('0010350829');
// 001-035-0829
```

---

### کاور کردن کد ملی

```ts id="z5r3w4"
maskNationalCode('0010350829');
// 001***0829
```

---

### نرمال‌سازی کد ملی

```ts id="1rjvsh"
normalizeNationalCode('۱۲۳۴۵۶۷۸۹');
// 0123456789
```

---

### تبدیل به اعداد فارسی

```ts id="uj1q9i"
toPersianNationalCode('0010350829');
// ۰۰۱۰۳۵۰۸۲۹
```

---

### استخراج کد ملی از متن

```ts id="j8f80t"
extractNationalCodes(`
codes:
0010350829
0084575948
`);
```

---

### اطلاعات کامل کد ملی

```ts id="q1s5ws"
getNationalCodeInfo('0010350829');
```

---

# ابزارهای پولی و مالی

ابزارهای تومان، ریال و محاسبات مالی.

## ایمپورت

```ts id="c5l7oq"
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

## مثال‌ها

### تبدیل ریال به تومان

```ts id="j4otxk"
rialToToman(100000);
// 10000
```

---

### فرمت پول

```ts id="jlwm9h"
formatCurrency(1500000);
// ۱٬۵۰۰٬۰۰۰ تومان
```

---

### فرمت خوانا

```ts id="9r0o9g"
formatCurrencyHuman(2500000);
// ۲.۵ میلیون تومان
```

---

### تبدیل متن پول به عدد

```ts id="m6f84h"
parseCurrencyString('۱٬۵۰۰٬۰۰۰ تومان');
// 1500000
```

---

### تشخیص نوع ارز

```ts id="o8h8ay"
detectCurrency('۵۰۰ هزار تومان');
// toman
```

---

### اعمال تخفیف

```ts id="s4uj5k"
applyDiscount(1000000, 20);
```

خروجی:

```ts id="bq4x90"
{
  amount: 800000,
  saved: 200000
}
```

---

### اطلاعات کامل پول

```ts id="1ud0a9"
getCurrencyInfo(1500000);
```

---

خروجی:

```ts id="1ud0a9-out"
{
  amount: 1500000,
  formatted: '۱٬۵۰۰٬۰۰۰ تومان',
  humanReadable: '۱.۵ میلیون تومان',
  currency: 'toman',
  inRial: 15000000
}
```

# ابزارهای تاریخ جلالی

ابزارهای تاریخ شمسی و تقویم جلالی.

## ایمپورت

```ts id="sjwr31"
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

## مثال‌ها

### تاریخ شمسی امروز

```ts id="6y2y98"
getCurrentJalaliDate();
// ۱۴۰۵/۰۲/۲۹
```

---

### تبدیل میلادی به شمسی

```ts id="7lkjqt"
toJalaliDate(new Date('2024-03-20'));
```

خروجی:

```ts id="mmbw69"
{
  year: 1403,
  month: 1,
  day: 1
}
```

---

### فرمت سفارشی تاریخ

```ts id="gkdhx3"
formatJalaliPattern(
  new Date(),
  'WD DD Month YYYY'
);

// دوشنبه ۲۹ اردیبهشت ۱۴۰۵
```

---

### تشخیص فصل

```ts id="c2g7od"
getJalaliSeason(new Date());
// بهار
```

---

### تشخیص تعطیلی

```ts id="1j51n7"
isIranianHoliday(new Date('2024-03-20'));
// true
```

---

### تاریخ نسبی

```ts id="q0v3k5"
getRelativeJalaliDate(
  new Date(Date.now() + 86400000)
);

// فردا
```

---

### اطلاعات کامل تاریخ

```ts id="fhd2h1"
getJalaliDateInfo();
```

---

# آخرین ویژگی ها
# تبدیل تاریخ
تبدیل تاریخ بین جلالی و میلادی

```
// Jalali string → result
 convertDate('1403/01/01', { from: 'jalali', to: 'gregorian' })

 // Gregorian string → result
 convertDate('2024-03-20', { from: 'gregorian', to: 'jalali' })

 // JalaliDate object → result
 convertDate({ year: 1403, month: 1, day: 1 }, { from: 'jalali', to: 'gregorian' })

 // JS Date → result
 convertDate(new Date(), { from: 'gregorian', to: 'jalali' })

 // Persian digit string → result
 convertDate('۱۴۰۳/۰۱/۰۱', { from: 'jalali', to: 'gregorian' })
```

---

# پشتیبانی TypeScript

تمام کتابخانه با TypeScript نوشته شده و دارای type definitions کامل است.

```ts id="4vcf8o"
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

# پشتیبانی محیط‌ها

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

# همکاری در توسعه

خوشحال میشم توی توسعه این پکیج کمکم کنید و باهم همکاری داشته باشیم

```bash id="awt8qk"
git clone https://github.com/ArefOrumiehei/smart-persian-tools.git
```

```bash id="1bxm0x"
npm install
```

```bash id="8y7u0p"
npm run test
```

---

# License

MIT © Aref Orumiehei
