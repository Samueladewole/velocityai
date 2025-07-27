/**
 * Tooltip Component
 * Simple tooltip implementation for the enhanced template system
 */
import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  children: React.ReactNode;
}

interface TooltipTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface TooltipContentProps {
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

interface TooltipProviderProps {
  children: React.ReactNode;
  delayDuration?: number;
}

const TooltipContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  delayDuration: number;
}>({
  isOpen: false,
  setIsOpen: () => {},
  delayDuration: 500
});

export const TooltipProvider: React.FC<TooltipProviderProps> = ({ 
  children, 
  delayDuration = 500 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TooltipContext.Provider value={{ isOpen, setIsOpen, delayDuration }}>
      {children}
    </TooltipContext.Provider>
  );
};

export const Tooltip: React.FC<TooltipProps> = ({ children }) => {
  return <div className="relative inline-block">{children}</div>;
};

export const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ 
  children, 
  asChild = false 
}) => {
  const { setIsOpen, delayDuration } = React.useContext(TooltipContext);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, delayDuration);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    });
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export const TooltipContent: React.FC<TooltipContentProps> = ({ 
  children, 
  side = 'top',
  className = ''
}) => {
  const { isOpen } = React.useContext(TooltipContext);

  if (!isOpen) return null;

  const sideClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div
      className={`
        absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 
        rounded shadow-lg whitespace-nowrap animate-in fade-in-0 zoom-in-95
        ${sideClasses[side]} ${className}
      `}
    >
      {children}
    </div>
  );
};