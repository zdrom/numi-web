import { CurrencyRate } from '../types';

export const currencySymbols: Record<string, string> = {
  '$': 'USD',
  '€': 'EUR',
  '£': 'GBP',
  '¥': 'JPY',
  '₹': 'INR',
  '₽': 'RUB',
  '₩': 'KRW',
  '₪': 'ILS',
  '₺': 'TRY',
  '₴': 'UAH',
  'A$': 'AUD',
  'C$': 'CAD',
  'CA$': 'CAD',
  'NZ$': 'NZD',
  'HK$': 'HKD',
  'S$': 'SGD',
};

export const currencyNames: Record<string, string> = {
  'dollar': 'USD',
  'dollars': 'USD',
  'euro': 'EUR',
  'euros': 'EUR',
  'pound': 'GBP',
  'pounds': 'GBP',
  'yen': 'JPY',
  'yuan': 'CNY',
  'rupee': 'INR',
  'rupees': 'INR',
  'ruble': 'RUB',
  'rubles': 'RUB',
  'won': 'KRW',
  'franc': 'CHF',
  'francs': 'CHF',
};

let exchangeRates: Record<string, number> = {
  'USD': 1,
  'EUR': 0.92,
  'GBP': 0.79,
  'JPY': 149.50,
  'AUD': 1.53,
  'CAD': 1.39,
  'CHF': 0.88,
  'CNY': 7.24,
  'INR': 83.12,
  'RUB': 92.50,
  'KRW': 1310.00,
  'MXN': 17.08,
  'BRL': 4.97,
  'ZAR': 18.62,
  'SEK': 10.68,
  'NOK': 10.89,
  'DKK': 6.86,
  'SGD': 1.34,
  'HKD': 7.83,
  'NZD': 1.67,
  'TRY': 34.20,
  'ILS': 3.64,
  'UAH': 41.20,
};

let lastUpdated = new Date();

export async function updateExchangeRates(): Promise<void> {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    if (data.rates) {
      exchangeRates = { USD: 1, ...data.rates };
      lastUpdated = new Date();
    }
  } catch (error) {
    console.warn('Failed to update exchange rates, using cached rates', error);
  }
}

export function convertCurrency(amount: number, from: string, to: string): number {
  const fromCode = from.toUpperCase();
  const toCode = to.toUpperCase();

  const fromRate = exchangeRates[fromCode];
  const toRate = exchangeRates[toCode];

  if (!fromRate || !toRate) {
    throw new Error(`Unknown currency: ${!fromRate ? fromCode : toCode}`);
  }

  return (amount / fromRate) * toRate;
}

export function getExchangeRate(code: string): CurrencyRate | null {
  const upperCode = code.toUpperCase();
  const rate = exchangeRates[upperCode];

  if (!rate) return null;

  return {
    code: upperCode,
    rate,
    lastUpdated,
  };
}

export function isCurrencyCode(text: string): boolean {
  return text.toUpperCase() in exchangeRates;
}
