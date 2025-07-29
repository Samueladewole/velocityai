import React from 'react';
import { Badge } from '@/components/ui/badge';

interface RiskBadgeProps {
  level: 'minimal' | 'low' | 'limited' | 'medium' | 'high' | 'critical' | 'unacceptable';
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, className = '' }) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'unacceptable':
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'limited':
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'minimal':
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Badge className={`${getRiskColor(level)} ${className}`}>
      {level.toUpperCase()}
    </Badge>
  );
};