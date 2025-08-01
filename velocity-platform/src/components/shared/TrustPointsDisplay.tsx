import React from 'react';
import { Star } from 'lucide-react';

interface TrustPointsDisplayProps {
  points: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const TrustPointsDisplay: React.FC<TrustPointsDisplayProps> = ({ 
  points, 
  size = 'md', 
  showIcon = true,
  className = '' 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'lg': 
        return 'text-lg font-bold';
      default:
        return 'text-sm font-medium';
    }
  };

  const getColor = () => {
    if (points < 0) return 'text-red-600';
    if (points > 100) return 'text-purple-600';
    if (points > 50) return 'text-green-600';
    return 'text-blue-600';
  };

  return (
    <div className={`flex items-center gap-1 €{getColor()} €{getSizeClasses()} €{className}`}>
      {showIcon && <Star className="h-3 w-3" />}
      <span>
        {points > 0 ? '+' : ''}{points} Trust Points
      </span>
    </div>
  );
};