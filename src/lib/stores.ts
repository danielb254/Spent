import { writable } from 'svelte/store';

export interface CurrencySettings {
  code: string;
  symbol: string;
  position: 'before' | 'after';
  locale: string;
}

const defaultCurrency: CurrencySettings = {
  code: 'USD',
  symbol: '$',
  position: 'before',
  locale: 'en-US'
};

function loadCurrency(): CurrencySettings {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('spent_currency');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored currency:', e);
      }
    }
  }
  return defaultCurrency;
}

export const currencySettings = writable<CurrencySettings>(loadCurrency());

currencySettings.subscribe(value => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('spent_currency', JSON.stringify(value));
  }
});

export const currencyOptions = [
  { code: 'USD', symbol: '$', name: 'US Dollar', position: 'before' as const, locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', position: 'after' as const, locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', position: 'before' as const, locale: 'en-GB' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', position: 'before' as const, locale: 'ja-JP' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', position: 'before' as const, locale: 'en-CA' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', position: 'before' as const, locale: 'en-AU' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', position: 'before' as const, locale: 'de-CH' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', position: 'before' as const, locale: 'zh-CN' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', position: 'before' as const, locale: 'en-IN' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', position: 'before' as const, locale: 'pt-BR' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso', position: 'before' as const, locale: 'es-MX' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', position: 'before' as const, locale: 'en-ZA' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', position: 'before' as const, locale: 'ko-KR' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', position: 'after' as const, locale: 'sv-SE' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', position: 'after' as const, locale: 'nb-NO' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone', position: 'after' as const, locale: 'da-DK' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Złoty', position: 'after' as const, locale: 'pl-PL' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', position: 'after' as const, locale: 'ru-RU' },
];

export function formatCurrency(cents: number, settings: CurrencySettings): string {
  const dollars = Math.abs(cents) / 100;
  const sign = cents < 0 ? '−' : '';
  
  const formatted = new Intl.NumberFormat(settings.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(dollars);
  
  if (settings.position === 'before') {
    return `${sign}${settings.symbol}${formatted}`;
  } else {
    return `${sign}${formatted} ${settings.symbol}`;
  }
}
