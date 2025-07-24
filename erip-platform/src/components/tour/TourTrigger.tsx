import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, Play } from 'lucide-react';
import { useOnboarding } from './OnboardingFlow';

interface TourTriggerProps {
  tourType: 'dashboard' | 'trust-score';
  variant?: 'button' | 'icon' | 'link';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TourTrigger: React.FC<TourTriggerProps> = ({ 
  tourType, 
  variant = 'button',
  size = 'md',
  className = ''
}) => {
  const { startDashboardTour, startTrustScoreTour } = useOnboarding();

  const handleStartTour = () => {
    switch (tourType) {
      case 'dashboard':
        startDashboardTour();
        break;
      case 'trust-score':
        startTrustScoreTour();
        break;
    }
  };

  const getTourLabel = () => {
    switch (tourType) {
      case 'dashboard':
        return 'Take Dashboard Tour';
      case 'trust-score':
        return 'Take Trust Score Tour';
      default:
        return 'Take Tour';
    }
  };

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleStartTour}
        className={`p-2 ${className}`}
        title={getTourLabel()}
      >
        <HelpCircle className="h-4 w-4" />
      </Button>
    );
  }

  if (variant === 'link') {
    return (
      <button
        onClick={handleStartTour}
        className={`text-sm text-blue-600 hover:text-blue-700 underline flex items-center gap-1 ${className}`}
      >
        <Play className="h-3 w-3" />
        {getTourLabel()}
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      size={size}
      onClick={handleStartTour}
      className={`flex items-center gap-2 ${className}`}
    >
      <Play className="h-4 w-4" />
      {getTourLabel()}
    </Button>
  );
};