import React, { createContext, useContext, useEffect, useState } from 'react';
import { detectCurrency, formatCurrencySync, convertCurrency } from '@/utils/currency';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  isLoading: boolean;
  formatAmount: (amount: number) => string;
  convertFrom: (amount: number, fromCurrency: string) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<string>('USD');
  const [isLoading, setIsLoading] = useState(false); // Start with false to avoid loading state

  useEffect(() => {
    const loadCurrency = async () => {
      setIsLoading(true);
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

    // Delay currency detection to avoid blocking initial render
    const timer = setTimeout(() => {
      loadCurrency();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const formatAmount = (amount: number) => formatCurrencySync(amount, currency);
  
  const convertFrom = (amount: number, fromCurrency: string) => 
    convertCurrency(amount, fromCurrency, currency);

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      isLoading,
      formatAmount,
      convertFrom
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};