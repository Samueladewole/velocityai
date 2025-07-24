import React, { createContext, useContext, useState, useCallback } from 'react';

interface TourStep {
  id: string;
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
  optional?: boolean;
}

interface TourContextType {
  isActive: boolean;
  currentStep: number;
  steps: TourStep[];
  startTour: (tourSteps: TourStep[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  endTour: () => void;
  showTooltip: (element: string, content: string, title?: string) => void;
  hideTooltip: () => void;
  tooltip: {
    show: boolean;
    element: string;
    content: string;
    title?: string;
  };
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

interface TourProviderProps {
  children: React.ReactNode;
}

export const TourProvider: React.FC<TourProviderProps> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<TourStep[]>([]);
  const [tooltip, setTooltip] = useState({
    show: false,
    element: '',
    content: '',
    title: undefined as string | undefined
  });

  const startTour = useCallback((tourSteps: TourStep[]) => {
    setSteps(tourSteps);
    setCurrentStep(0);
    setIsActive(true);
    
    // Execute the first step's action if it exists
    if (tourSteps[0]?.action) {
      tourSteps[0].action();
    }
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      
      // Execute the next step's action if it exists
      if (steps[nextStepIndex]?.action) {
        steps[nextStepIndex].action();
      }
    } else {
      endTour();
    }
  }, [currentStep, steps]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const skipTour = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    setSteps([]);
  }, []);

  const endTour = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    setSteps([]);
  }, []);

  const showTooltip = useCallback((element: string, content: string, title?: string) => {
    setTooltip({
      show: true,
      element,
      content,
      title
    });
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltip({
      show: false,
      element: '',
      content: '',
      title: undefined
    });
  }, []);

  const value: TourContextType = {
    isActive,
    currentStep,
    steps,
    startTour,
    nextStep,
    prevStep,
    skipTour,
    endTour,
    showTooltip,
    hideTooltip,
    tooltip
  };

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
};