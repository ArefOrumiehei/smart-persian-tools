export type PhoneOperator = 'Hamrah Aval' | 'Irancell' | 'Rightel' | 'Shatel' | 'Samantel' | 'Aptel' | 'Unknown';
export type PhoneType = 'mobile' | 'landline' | 'unknown';

export interface PhoneInfo {
  original: string;
  normalized: string;
  formatted: string;
  isValid: boolean;
  type: PhoneType;
  operator: PhoneOperator | null;
  prefix: string;
  province: string | null;
}

const OPERATOR_PREFIX_5: Record<string, PhoneOperator> = {
  '09999': 'Samantel',
};

const OPERATOR_PREFIX_4: Record<string, PhoneOperator> = {
  '0910': 'Hamrah Aval', '0911': 'Hamrah Aval', '0912': 'Hamrah Aval',
  '0913': 'Hamrah Aval', '0914': 'Hamrah Aval', '0915': 'Hamrah Aval',
  '0916': 'Hamrah Aval', '0917': 'Hamrah Aval', '0918': 'Hamrah Aval',
  '0919': 'Hamrah Aval',
  '0901': 'Irancell', '0902': 'Irancell', '0903': 'Irancell',
  '0930': 'Irancell', '0933': 'Irancell', '0935': 'Irancell',
  '0936': 'Irancell', '0937': 'Irancell', '0938': 'Irancell',
  '0939': 'Irancell',
  '0920': 'Rightel', '0921': 'Rightel', '0922': 'Rightel',
  '0998': 'Shatel',
  '0999': 'Aptel',
}

const LANDLINE_PROVINCES: Record<string, string> = {
  '021': 'تهران',
  '026': 'البرز',
  '031': 'اصفهان',
  '035': 'یزد',
  '038': 'چهارمحال و بختیاری',
  '041': 'آذربایجان شرقی',
  '044': 'آذربایجان غربی',
  '045': 'اردبیل',
  '051': 'خراسان رضوی',
  '054': 'سیستان و بلوچستان',
  '056': 'خراسان جنوبی',
  '058': 'خراسان شمالی',
  '061': 'خوزستان',
  '066': 'لرستان',
  '071': 'فارس',
  '074': 'کهگیلویه و بویراحمد',
  '076': 'هرمزگان',
  '077': 'بوشهر',
  '081': 'همدان',
  '083': 'کرمانشاه',
  '084': 'ایلام',
  '086': 'مرکزی',
  '087': 'کردستان',
  '034': 'کرمان',
  '024': 'زنجان',
  '023': 'سمنان',
  '013': 'گیلان',
  '017': 'گلستان',
  '025': 'قم',
  '028': 'قزوین',
  '018': 'مازندران — غرب',
  '011': 'مازندران — شرق',
};

export const normalizeIranianPhoneNumber = (phone: string): string => {
  let normalized = phone.replace(/\D/g, '');

  if (normalized.startsWith('98')) normalized = '0' + normalized.slice(2);
  if (normalized.startsWith('0098')) normalized = '0' + normalized.slice(4);

  return normalized;
};

export const validateIranianPhoneNumber = (phone: string): boolean => {
  const normalized = normalizeIranianPhoneNumber(phone);
  return /^09\d{9}$/.test(normalized);
};

export const formatIranianPhoneNumber = (phone: string): string => {
  const normalized = normalizeIranianPhoneNumber(phone);
  if (!validateIranianPhoneNumber(normalized)) return phone;

  return `${normalized.slice(0,4)}-${normalized.slice(4,7)}-${normalized.slice(7)}`;
};

export const getOperator = (phone: string): PhoneOperator => {
  const normalized = normalizeIranianPhoneNumber(phone);

  // Always check longer prefixes first
  return (
    OPERATOR_PREFIX_5[normalized.slice(0, 5)] ??
    OPERATOR_PREFIX_4[normalized.slice(0, 4)] ??
    'Unknown'
  );
};

export const isLandline = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '');
  const normalized = digits.startsWith('98') ? '0' + digits.slice(2) : digits;
  return /^0[1-8]\d{9}$/.test(normalized);
};

export const isMobile = (phone: string): boolean => {
  return validateIranianPhoneNumber(phone);
};

export const getPhoneType = (phone: string): PhoneType => {
  if (isMobile(phone)) return 'mobile';
  if (isLandline(phone)) return 'landline';
  return 'unknown';
};

export const getLandlineProvince = (phone: string): string | null => {
  const digits = phone.replace(/\D/g, '');
  const normalized = digits.startsWith('98') ? '0' + digits.slice(2) : digits;
  const areaCode = normalized.slice(0, 3);
  return LANDLINE_PROVINCES[areaCode] ?? null;
};

export const toInternationalFormat = (phone: string): string | null => {
  const normalized = normalizeIranianPhoneNumber(phone);
  if (!validateIranianPhoneNumber(normalized)) return null;
  return `+98 ${normalized.slice(1, 4)} ${normalized.slice(4, 7)} ${normalized.slice(7)}`;
};

export const toE164Format = (phone: string): string | null => {
  const normalized = normalizeIranianPhoneNumber(phone);
  if (!validateIranianPhoneNumber(normalized)) return null;
  return `+98${normalized.slice(1)}`;
};

export const getPhoneInfo = (phone: string): PhoneInfo => {
  const normalized = normalizeIranianPhoneNumber(phone);
  const isValid = validateIranianPhoneNumber(normalized);
  const type = getPhoneType(phone);
  const prefix = normalized.slice(0, 4);

  return {
    original: phone,
    normalized,
    formatted: formatIranianPhoneNumber(phone),
    isValid,
    type,
    operator: isValid ? getOperator(phone) : null,
    prefix,
    province: type === 'landline' ? getLandlineProvince(phone) : null,
  };
};

export const maskPhoneNumber = (phone: string, char = '*'): string => {
  const normalized = normalizeIranianPhoneNumber(phone);
  if (!validateIranianPhoneNumber(normalized)) return phone;
  return `${normalized.slice(0, 4)}${char.repeat(3)}${normalized.slice(7)}`;
};

export const isSamePhoneNumber = (a: string, b: string): boolean => {
  return normalizeIranianPhoneNumber(a) === normalizeIranianPhoneNumber(b);
};

/** Extract all phone numbers found in a block of text */
export const extractPhoneNumbers = (text: string): string[] => {
  const pattern = /(?:\+98|0098|98|0)9\d{9}/g;
  const matches = text.match(pattern) ?? [];
  return [...new Set(matches.map(normalizeIranianPhoneNumber))];
};