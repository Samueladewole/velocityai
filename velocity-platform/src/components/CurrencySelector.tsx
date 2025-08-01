import React from 'react';
import { Globe } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getCurrencySymbol } from '@/utils/currency';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const availableCurrencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
];

export const CurrencySelector: React.FC<{ className?: string }> = ({ className }) => {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className={`flex items-center gap-2 €{className}`}>
      <Globe className="w-4 h-4 text-gray-500" />
      <Select value={currency} onValueChange={setCurrency}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {availableCurrencies.map((curr) => (
            <SelectItem key={curr.code} value={curr.code}>
              <span className="flex items-center gap-2">
                <span className="font-mono">{getCurrencySymbol(curr.code)}</span>
                <span>{curr.code}</span>
                <span className="text-gray-500 text-sm">({curr.name})</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySelector;