/**
 * Nothing in this app charges a card for real, so there's no FX
 * conversion between currencies — the same ticket/membership numbers are
 * just labelled in whichever currency the visitor's browser locale
 * suggests, falling back to AUD (Heritage Museum's home currency) when
 * that can't be determined (server render, or an unrecognised locale).
 */
export type CurrencyCode = 'AUD' | 'GBP' | 'USD' | 'EUR' | 'NZD' | 'CAD';

export const DEFAULT_CURRENCY: CurrencyCode = 'AUD';

const REGION_CURRENCY: Record<string, CurrencyCode> = {
  AU: 'AUD',
  GB: 'GBP',
  US: 'USD',
  NZ: 'NZD',
  CA: 'CAD',
  IE: 'EUR',
  FR: 'EUR',
  DE: 'EUR',
  ES: 'EUR',
  IT: 'EUR',
  NL: 'EUR',
  PT: 'EUR',
  BE: 'EUR',
  AT: 'EUR',
  FI: 'EUR',
  GR: 'EUR',
};

/** Reads the browser's locale preferences (most-preferred first) and maps
 *  the first recognised region to a currency. Returns the AUD default on
 *  the server, where there's no visitor locale yet, or when nothing in
 *  the list maps to a currency we support. */
export function detectCurrency(): CurrencyCode {
  if (typeof navigator === 'undefined') return DEFAULT_CURRENCY;
  const locales = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const locale of locales) {
    const region = locale.split('-')[1]?.toUpperCase();
    const currency = region ? REGION_CURRENCY[region] : undefined;
    if (currency) return currency;
  }
  return DEFAULT_CURRENCY;
}

export function formatMoney(value: number, currency: CurrencyCode = DEFAULT_CURRENCY): string {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(value);
}

/** Just the symbol ("A$", "£", ...) — for placeholder/static copy that
 *  isn't formatting a real number. */
export function currencySymbol(currency: CurrencyCode = DEFAULT_CURRENCY): string {
  const part = new Intl.NumberFormat(undefined, { style: 'currency', currency })
    .formatToParts(0)
    .find((p) => p.type === 'currency');
  return part?.value ?? '';
}
