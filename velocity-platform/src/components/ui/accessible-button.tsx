import React, { forwardRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface AccessibleButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  role?: string;
  tooltip?: string;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ 
    loading = false,
    loadingText = 'Loading...',
    ariaLabel,
    ariaDescribedBy,
    role,
    tooltip,
    children,
    className,
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;
    
    return (
      <Button
        ref={ref}
        disabled={isDisabled}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-busy={loading}
        role={role}
        title={tooltip}
        className={cn(
          'relative',
          'focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none',
          'transition-all duration-200',
          loading && 'cursor-not-allowed',
          className
        )}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="sr-only">{loadingText}</span>
          </span>
        )}
        <span className={loading ? 'opacity-0' : 'opacity-100'}>
          {children}
        </span>
      </Button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';