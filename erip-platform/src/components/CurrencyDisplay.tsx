import React from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface CurrencyDisplayProps {
  amount: number;
  baseCurrency?: string;
  className?: string;
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({ 
  amount, 
  baseCurrency = 'USD',
  className = '' 
}) => {
  const { currency, formatAmount, convertFrom, isLoading } = useCurrency();

  // Convert from base currency to user's currency if needed
  const convertedAmount = baseCurrency !== currency 
    ? convertFrom(amount, baseCurrency)
    : amount;

  return (
    <span className={className}>
      {formatAmount(convertedAmount)}
    </span>
  );
};

export default CurrencyDisplay;