// Currency utilities with automatic location detection
import React from 'react';

interface CurrencyConfig {
  code: string;
  symbol: string;
  locale: string;
  format: Intl.NumberFormatOptions;
}

const currencyConfigs: Record<string, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    locale: 'en-US',
    format: {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    locale: 'de-DE',
    format: {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    locale: 'en-GB',
    format: {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    locale: 'en-CA',
    format: {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    locale: 'en-AU',
    format: {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }
  }
};

// Currency conversion rates (simplified - in production, use live rates)
const exchangeRates: Record<string, number> = {
  USD: 1.0,
  EUR: 0.91,
  GBP: 0.79,
  CAD: 1.35,
  AUD: 1.52
};

// Detect currency based on user location
export const detectCurrency = async (): Promise<string> => {
  try {
    // First try to detect from browser timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const currencyFromTimezone = getCurrencyFromTimezone(timezone);
    if (currencyFromTimezone) {
      return currencyFromTimezone;
    }

    // Try to detect from browser language
    const language = navigator.language || navigator.languages?.[0];
    const currencyFromLanguage = getCurrencyFromLanguage(language);
    if (currencyFromLanguage) {
      return currencyFromLanguage;
    }

    // Try geolocation API if available
    if ('geolocation' in navigator) {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const currency = await getCurrencyFromCoordinates(
                position.coords.latitude,
                position.coords.longitude
              );
              resolve(currency);
            } catch (error) {
              console.warn('Failed to get currency from coordinates:', error);
              resolve('USD'); // fallback
            }
          },
          () => {
            resolve('USD'); // fallback on geolocation error
          },
          { timeout: 5000, enableHighAccuracy: false }
        );
      });
    }

    // Try IP-based detection (requires external service)
    try {
      const ipCurrency = await getCurrencyFromIP();
      return ipCurrency;
    } catch (error) {
      console.warn('IP currency detection failed:', error);
      return 'USD'; // fallback
    }

  } catch (error) {
    console.warn('Currency detection failed:', error);
    return 'USD'; // fallback
  }
};

// Get currency from timezone
const getCurrencyFromTimezone = (timezone: string): string | null => {
  const timezoneMap: Record<string, string> = {
    // European timezones
    'Europe/London': 'GBP',
    'Europe/Dublin': 'EUR',
    'Europe/Berlin': 'EUR',
    'Europe/Paris': 'EUR',
    'Europe/Madrid': 'EUR',
    'Europe/Rome': 'EUR',
    'Europe/Amsterdam': 'EUR',
    'Europe/Brussels': 'EUR',
    'Europe/Vienna': 'EUR',
    'Europe/Zurich': 'EUR',
    'Europe/Stockholm': 'EUR',
    'Europe/Copenhagen': 'EUR',
    'Europe/Helsinki': 'EUR',
    'Europe/Oslo': 'EUR',
    'Europe/Warsaw': 'EUR',
    'Europe/Prague': 'EUR',
    'Europe/Budapest': 'EUR',
    'Europe/Athens': 'EUR',
    'Europe/Lisbon': 'EUR',
    
    // North American timezones
    'America/New_York': 'USD',
    'America/Chicago': 'USD',
    'America/Denver': 'USD',
    'America/Los_Angeles': 'USD',
    'America/Phoenix': 'USD',
    'America/Anchorage': 'USD',
    'America/Hawaii': 'USD',
    'America/Toronto': 'CAD',
    'America/Vancouver': 'CAD',
    'America/Montreal': 'CAD',
    'America/Edmonton': 'CAD',
    'America/Winnipeg': 'CAD',
    
    // Other regions
    'Australia/Sydney': 'AUD',
    'Australia/Melbourne': 'AUD',
    'Australia/Brisbane': 'AUD',
    'Australia/Perth': 'AUD'
  };

  return timezoneMap[timezone] || null;
};

// Get currency from browser language
const getCurrencyFromLanguage = (language: string): string | null => {
  const languageMap: Record<string, string> = {
    'en-US': 'USD',
    'en-CA': 'CAD',
    'en-GB': 'GBP',
    'en-AU': 'AUD',
    'de': 'EUR',
    'de-DE': 'EUR',
    'fr': 'EUR',
    'fr-FR': 'EUR',
    'es': 'EUR',
    'es-ES': 'EUR',
    'it': 'EUR',
    'it-IT': 'EUR',
    'nl': 'EUR',
    'nl-NL': 'EUR',
    'pt': 'EUR',
    'pt-PT': 'EUR'
  };

  // Try exact match first
  if (languageMap[language]) {
    return languageMap[language];
  }

  // Try language code without region
  const languageCode = language.split('-')[0];
  return languageMap[languageCode] || null;
};

// Get currency from coordinates (simplified)
const getCurrencyFromCoordinates = async (lat: number, lon: number): Promise<string> => {
  // Simple coordinate-based detection (can be enhanced with actual reverse geocoding)
  
  // Europe (rough boundaries)
  if (lat > 35 && lat < 72 && lon > -10 && lon < 40) {
    // UK and Ireland
    if ((lat > 50 && lat < 61 && lon > -10 && lon < 2)) {
      return 'GBP';
    }
    return 'EUR';
  }
  
  // North America
  if (lat > 25 && lat < 72 && lon > -170 && lon < -50) {
    // Canada (rough)
    if (lat > 45) {
      return 'CAD';
    }
    return 'USD';
  }
  
  // Australia (rough)
  if (lat > -45 && lat < -10 && lon > 110 && lon < 155) {
    return 'AUD';
  }
  
  return 'USD'; // fallback
};

// Get currency from IP address (requires external service)
const getCurrencyFromIP = async (): Promise<string> => {
  try {
    // Using a free IP geolocation service
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    }).catch(() => null);
    
    if (response && response.ok) {
      const data = await response.json();
      const countryCode = data.country_code;
      
      const countryToCurrency: Record<string, string> = {
        'US': 'USD',
        'CA': 'CAD',
        'GB': 'GBP',
        'AU': 'AUD',
        // EU countries
        'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR',
        'NL': 'EUR', 'BE': 'EUR', 'AT': 'EUR', 'PT': 'EUR',
        'IE': 'EUR', 'FI': 'EUR', 'LU': 'EUR', 'SI': 'EUR',
        'SK': 'EUR', 'EE': 'EUR', 'LV': 'EUR', 'LT': 'EUR',
        'CY': 'EUR', 'MT': 'EUR', 'GR': 'EUR'
      };
      
      return countryToCurrency[countryCode] || 'USD';
    }
  } catch (error) {
    console.warn('IP-based currency detection failed:', error);
  }
  
  return 'USD';
};

// Format currency with automatic detection
export const formatCurrency = async (amount: number, forceCurrency?: string): Promise<string> => {
  const currency = forceCurrency || await detectCurrency();
  const config = currencyConfigs[currency] || currencyConfigs.USD;
  
  return new Intl.NumberFormat(config.locale, config.format).format(amount);
};

// Synchronous currency formatting (requires pre-detected currency)
export const formatCurrencySync = (amount: number, currency: string = 'USD'): string => {
  const config = currencyConfigs[currency] || currencyConfigs.USD;
  return new Intl.NumberFormat(config.locale, config.format).format(amount);
};

// Convert amount between currencies
export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / exchangeRates[fromCurrency];
  return usdAmount * exchangeRates[toCurrency];
};

// Get currency symbol
export const getCurrencySymbol = (currency: string): string => {
  return currencyConfigs[currency]?.symbol || '$';
};

// Get all supported currencies
export const getSupportedCurrencies = (): CurrencyConfig[] => {
  return Object.values(currencyConfigs);
};

// React hook for currency detection
export const useCurrency = () => {
  const [currency, setCurrency] = React.useState<string>('USD');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadCurrency = async () => {
      try {
        const detectedCurrency = await detectCurrency();
        setCurrency(detectedCurrency);
      } catch (error) {
        console.warn('Failed to detect currency:', error);
        setCurrency('USD');
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrency();
  }, []);

  return {
    currency,
    setCurrency,
    isLoading,
    formatAmount: (amount: number) => formatCurrencySync(amount, currency),
    convertFrom: (amount: number, fromCurrency: string) => 
      convertCurrency(amount, fromCurrency, currency)
  };
};

export default {
  detectCurrency,
  formatCurrency,
  formatCurrencySync,
  convertCurrency,
  getCurrencySymbol,
  getSupportedCurrencies,
  useCurrency
};