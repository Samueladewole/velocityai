import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useTour } from './TourProvider';
import { Info, X } from 'lucide-react';

export const Tooltip: React.FC = () => {
  const { tooltip, hideTooltip } = useTour();
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!tooltip.show || !tooltip.element) {
      setTargetElement(null);
      return;
    }

    const element = document.querySelector(tooltip.element) as HTMLElement;
    setTargetElement(element);
  }, [tooltip.show, tooltip.element]);

  if (!tooltip.show || !targetElement) {
    return null;
  }

  const rect = targetElement.getBoundingClientRect();
  const tooltipPosition = {
    top: rect.bottom + 8,
    left: rect.left + rect.width / 2
  };

  return (
    <Card 
      className="fixed z-50 w-64 shadow-xl border-slate-200 bg-white"
      style={{
        top: `€{tooltipPosition.top}px`,
        left: `€{tooltipPosition.left}px`,
        transform: 'translateX(-50%)'
      }}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              {tooltip.title && (
                <h4 className="font-semibold text-slate-900 text-sm mb-1">
                  {tooltip.title}
                </h4>
              )}
              <p className="text-sm text-slate-700 leading-relaxed">
                {tooltip.content}
              </p>
            </div>
          </div>
          <button
            onClick={hideTooltip}
            className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};