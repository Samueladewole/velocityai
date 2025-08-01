import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTour } from './TourProvider';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Skip, 
  Play,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const TourOverlay: React.FC = () => {
  const { isActive, currentStep, steps, nextStep, prevStep, skipTour, endTour } = useTour();
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [overlayStyle, setOverlayStyle] = useState({});

  const currentTourStep = steps[currentStep];

  useEffect(() => {
    if (!isActive || !currentTourStep) {
      setTargetElement(null);
      return;
    }

    const element = document.querySelector(currentTourStep.target) as HTMLElement;
    if (element) {
      setTargetElement(element);
      
      // Scroll element into view
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
      });

      // Calculate overlay position
      const rect = element.getBoundingClientRect();
      const padding = 8;
      
      setOverlayStyle({
        position: 'fixed',
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + (padding * 2),
        height: rect.height + (padding * 2),
        borderRadius: '8px',
        border: '2px solid #3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        zIndex: 9999,
        pointerEvents: 'none',
        transition: 'all 0.3s ease'
      });
    }
  }, [isActive, currentStep, currentTourStep]);

  if (!isActive || !currentTourStep) {
    return null;
  }

  const getTooltipPosition = () => {
    if (!targetElement) return { top: '50%', left: '50%' };

    const rect = targetElement.getBoundingClientRect();
    const placement = currentTourStep.placement || 'bottom';
    
    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = rect.top - 20;
        left = rect.left + rect.width / 2;
        break;
      case 'bottom':
        top = rect.bottom + 20;
        left = rect.left + rect.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - 20;
        break;
      case 'right':
        top = rect.top + rect.height / 2;
        left = rect.right + 20;
        break;
    }

    return { top: `€{top}px`, left: `€{left}px` };
  };

  const tooltipPosition = getTooltipPosition();

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-[9998]" />
      
      {/* Target Highlight */}
      {targetElement && (
        <div style={overlayStyle} />
      )}

      {/* Tooltip */}
      <Card 
        className="fixed z-[10000] w-80 shadow-2xl border-0 bg-white"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-blue-100">
                <Play className="h-4 w-4 text-blue-600" />
              </div>
              <CardTitle className="text-lg">{currentTourStep.title}</CardTitle>
            </div>
            <button
              onClick={skipTour}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-slate-700 leading-relaxed">{currentTourStep.content}</p>
          
          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `€{((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
            <span className="text-sm text-slate-500 font-medium">
              {currentStep + 1} of {steps.length}
            </span>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={skipTour}
                className="text-slate-600"
              >
                Skip Tour
              </Button>
            </div>

            <Button
              size="sm"
              onClick={nextStep}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Finish
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};