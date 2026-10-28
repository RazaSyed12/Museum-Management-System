'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_CURRENCY, detectCurrency, formatMoney, currencySymbol, type CurrencyCode } from './currency';

/** AUD on the first render (matches the server), then the visitor's
 *  locale-derived currency once the browser is available to read. */
export function useCurrency() {
  const [currency, setCurrency] = useState<CurrencyCode>(DEFAULT_CURRENCY);

  useEffect(() => {
    setCurrency(detectCurrency());
  }, []);

  return {
    currency,
    format: (value: number) => formatMoney(value, currency),
    symbol: currencySymbol(currency),
  };
}
