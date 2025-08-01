import { useState, useEffect } from 'react';

export interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number; // Exchange rate relative to USD
  locale: string;
}

// Currency mapping by country
const currencyMap: Record<string, CurrencyInfo> = {
  // Europe
  AT: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'de-AT' },
  BE: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'fr-BE' },
  BG: { code: 'BGN', symbol: 'лв', rate: 1.80, locale: 'bg-BG' },
  HR: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'hr-HR' },
  CY: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'el-CY' },
  CZ: { code: 'CZK', symbol: 'Kč', rate: 23.25, locale: 'cs-CZ' },
  DK: { code: 'DKK', symbol: 'kr', rate: 6.86, locale: 'da-DK' },
  EE: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'et-EE' },
  FI: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'fi-FI' },
  FR: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'fr-FR' },
  DE: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'de-DE' },
  GR: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'el-GR' },
  HU: { code: 'HUF', symbol: 'Ft', rate: 366.50, locale: 'hu-HU' },
  IE: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'en-IE' },
  IT: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'it-IT' },
  LV: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'lv-LV' },
  LT: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'lt-LT' },
  LU: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'fr-LU' },
  MT: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'mt-MT' },
  NL: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'nl-NL' },
  PL: { code: 'PLN', symbol: 'zł', rate: 4.08, locale: 'pl-PL' },
  PT: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'pt-PT' },
  RO: { code: 'RON', symbol: 'lei', rate: 4.57, locale: 'ro-RO' },
  SK: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'sk-SK' },
  SI: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'sl-SI' },
  ES: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'es-ES' },
  SE: { code: 'SEK', symbol: 'kr', rate: 10.73, locale: 'sv-SE' },
  
  // Other major currencies
  US: { code: 'USD', symbol: '€', rate: 1, locale: 'en-US' },
  GB: { code: 'GBP', symbol: '£', rate: 0.79, locale: 'en-GB' },
  CH: { code: 'CHF', symbol: 'CHF', rate: 0.89, locale: 'de-CH' },
  NO: { code: 'NOK', symbol: 'kr', rate: 10.82, locale: 'nb-NO' },
  IS: { code: 'ISK', symbol: 'kr', rate: 139.50, locale: 'is-IS' },
  CA: { code: 'CAD', symbol: '€', rate: 1.37, locale: 'en-CA' },
  AU: { code: 'AUD', symbol: '€', rate: 1.52, locale: 'en-AU' },
  NZ: { code: 'NZD', symbol: '€', rate: 1.63, locale: 'en-NZ' },
  JP: { code: 'JPY', symbol: '¥', rate: 149.50, locale: 'ja-JP' },
  CN: { code: 'CNY', symbol: '¥', rate: 7.24, locale: 'zh-CN' },
  IN: { code: 'INR', symbol: '₹', rate: 83.12, locale: 'en-IN' },
  KR: { code: 'KRW', symbol: '₩', rate: 1325.50, locale: 'ko-KR' },
  SG: { code: 'SGD', symbol: '€', rate: 1.35, locale: 'en-SG' },
  HK: { code: 'HKD', symbol: '€', rate: 7.83, locale: 'zh-HK' },
  ZA: { code: 'ZAR', symbol: 'R', rate: 18.95, locale: 'en-ZA' },
  BR: { code: 'BRL', symbol: 'R€', rate: 4.97, locale: 'pt-BR' },
  MX: { code: 'MXN', symbol: '€', rate: 17.85, locale: 'es-MX' },
  AE: { code: 'AED', symbol: 'د.إ', rate: 3.67, locale: 'ar-AE' },
  SA: { code: 'SAR', symbol: 'ر.س', rate: 3.75, locale: 'ar-SA' },
  IL: { code: 'ILS', symbol: '₪', rate: 3.72, locale: 'he-IL' },
  TR: { code: 'TRY', symbol: '₺', rate: 32.45, locale: 'tr-TR' },
  RU: { code: 'RUB', symbol: '₽', rate: 92.50, locale: 'ru-RU' }
};

// Default currency (USD)
const defaultCurrency: CurrencyInfo = {
  code: 'USD',
  symbol: '€',
  rate: 1,
  locale: 'en-US'
};

export const useCurrency = () => {
  const [currency, setCurrency] = useState<CurrencyInfo>(defaultCurrency);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectCurrency = async () => {
      try {
        // First, try to get saved preference
        const savedCurrency = localStorage.getItem('preferredCurrency');
        if (savedCurrency) {
          const parsed = JSON.parse(savedCurrency);
          setCurrency(parsed);
          setIsLoading(false);
          return;
        }

        // Try multiple IP geolocation services for redundancy
        const geoServices = [
          { url: 'https://ipapi.co/json/', parser: (data: any) => data.country_code },
          { url: 'https://ip-api.com/json/', parser: (data: any) => data.countryCode },
          { url: 'https://geolocation-db.com/json/', parser: (data: any) => data.country_code },
          { url: 'https://api.ipgeolocation.io/ipgeo?apiKey=demo', parser: (data: any) => data.country_code2 }
        ];

        let countryCode = null;
        
        for (const service of geoServices) {
          try {
            const response = await fetch(service.url, {
              signal: AbortSignal.timeout(3000) // 3 second timeout
            });
            
            if (response.ok) {
              const data = await response.json();
              countryCode = service.parser(data);
              if (countryCode) break;
            }
          } catch {
            // Try next service
            continue;
          }
        }

        // If geolocation fails, try to detect from browser language
        if (!countryCode) {
          const browserLang = navigator.language || navigator.languages?.[0];
          if (browserLang) {
            // Extract country from locale (e.g., 'en-US' -> 'US')
            const parts = browserLang.split('-');
            if (parts.length > 1) {
              countryCode = parts[1].toUpperCase();
            }
          }
        }

        // Set currency based on country
        if (countryCode && currencyMap[countryCode]) {
          setCurrency(currencyMap[countryCode]);
        } else {
          // Fallback to USD
          setCurrency(defaultCurrency);
        }

      } catch (err) {
        console.error('Currency detection error:', err);
        setError('Failed to detect currency');
        setCurrency(defaultCurrency);
      } finally {
        setIsLoading(false);
      }
    };

    detectCurrency();
  }, []);

  const setCurrencyPreference = (currencyInfo: CurrencyInfo) => {
    setCurrency(currencyInfo);
    localStorage.setItem('preferredCurrency', JSON.stringify(currencyInfo));
  };

  const formatPrice = (usdPrice: number): string => {
    const localPrice = usdPrice * currency.rate;
    
    // Format based on locale
    try {
      return new Intl.NumberFormat(currency.locale, {
        style: 'currency',
        currency: currency.code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(localPrice);
    } catch {
      // Fallback formatting
      return `€{currency.symbol}€{Math.round(localPrice).toLocaleString()}`;
    }
  };

  const convertPrice = (usdPrice: number): number => {
    return Math.round(usdPrice * currency.rate);
  };

  return {
    currency,
    isLoading,
    error,
    formatPrice,
    convertPrice,
    setCurrencyPreference,
    availableCurrencies: Object.values(currencyMap).filter(
      (v, i, a) => a.findIndex(c => c.code === v.code) === i
    ).sort((a, b) => a.code.localeCompare(b.code))
  };
};