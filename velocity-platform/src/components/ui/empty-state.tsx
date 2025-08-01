import React from 'react';
import { cn } from '@/lib/utils';
import { AccessibleButton } from './accessible-button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'illustration';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = 'md',
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'py-8 px-4',
    md: 'py-12 px-6',
    lg: 'py-16 px-8'
  };

  const iconSizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const titleSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const descriptionSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div 
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizeClasses[size],
        variant === 'minimal' && 'bg-transparent',
        variant === 'default' && 'bg-slate-50/50 rounded-lg border border-slate-100',
        variant === 'illustration' && 'bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 shadow-sm',
        className
      )}
      role="status"
      aria-live="polite"
    >
      {/* Icon */}
      {icon && (
        <div className={cn(
          'flex items-center justify-center rounded-full mb-4',
          iconSizeClasses[size],
          variant === 'default' && 'text-slate-400',
          variant === 'minimal' && 'text-slate-400',
          variant === 'illustration' && 'text-slate-500 bg-slate-100 p-3'
        )}>
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className={cn(
        'font-semibold text-slate-900 mb-2',
        titleSizeClasses[size]
      )}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className={cn(
          'text-slate-600 mb-6 max-w-sm',
          descriptionSizeClasses[size]
        )}>
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {action && (
            <AccessibleButton
              onClick={action.onClick}
              loading={action.loading}
              variant={action.variant || 'default'}
              size={size === 'sm' ? 'sm' : 'default'}
              ariaLabel={`€{action.label} - €{title}`}
            >
              {action.label}
            </AccessibleButton>
          )}
          
          {secondaryAction && (
            <AccessibleButton
              onClick={secondaryAction.onClick}
              variant={secondaryAction.variant || 'outline'}
              size={size === 'sm' ? 'sm' : 'default'}
              ariaLabel={`€{secondaryAction.label} - €{title}`}
            >
              {secondaryAction.label}
            </AccessibleButton>
          )}
        </div>
      )}
    </div>
  );
};

// Pre-built empty state components for common scenarios
export const NoDataFound: React.FC<{ 
  onRefresh?: () => void; 
  className?: string;
  message?: string;
}> = ({ onRefresh, className, message = "No data available at the moment." }) => (
  <EmptyState
    icon={
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    }
    title="No Data Found"
    description={message}
    action={onRefresh ? {
      label: 'Refresh',
      onClick: onRefresh
    } : undefined}
    className={className}
  />
);

export const SearchNotFound: React.FC<{ 
  searchTerm: string;
  onClear?: () => void;
  className?: string;
}> = ({ searchTerm, onClear, className }) => (
  <EmptyState
    icon={
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    }
    title="No Results Found"
    description={`We couldn't find anything matching "€{searchTerm}". Try adjusting your search terms.`}
    action={onClear ? {
      label: 'Clear Search',
      onClick: onClear,
      variant: 'outline'
    } : undefined}
    className={className}
  />
);

export const ErrorState: React.FC<{ 
  onRetry?: () => void;
  error?: string;
  className?: string;
}> = ({ onRetry, error, className }) => (
  <EmptyState
    icon={
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    }
    title="Something Went Wrong"
    description={error || "An unexpected error occurred. Please try again."}
    action={onRetry ? {
      label: 'Try Again',
      onClick: onRetry
    } : undefined}
    variant="illustration"
    className={className}
  />
);

export const UnderConstruction: React.FC<{ 
  feature: string;
  className?: string;
  expectedDate?: string;
}> = ({ feature, className, expectedDate }) => (
  <EmptyState
    icon={
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    }
    title={`€{feature} Coming Soon`}
    description={`We're working hard to bring you €{feature.toLowerCase()}. €{expectedDate ? `Expected launch: €{expectedDate}` : 'Stay tuned for updates!'}`}
    variant="illustration"
    className={className}
  />
);

export const NoPermissions: React.FC<{ 
  resource: string;
  onContact?: () => void;
  className?: string;
}> = ({ resource, onContact, className }) => (
  <EmptyState
    icon={
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    }
    title="Access Restricted"
    description={`You don't have permission to view €{resource}. Please contact your administrator for access.`}
    action={onContact ? {
      label: 'Request Access',
      onClick: onContact,
      variant: 'outline'
    } : undefined}
    variant="illustration"
    className={className}
  />
);

export const FirstTimeSetup: React.FC<{ 
  feature: string;
  onGetStarted: () => void;
  className?: string;
  loading?: boolean;
}> = ({ feature, onGetStarted, className, loading }) => (
  <EmptyState
    icon={
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    }
    title={`Welcome to €{feature}`}
    description={`Get started by setting up your €{feature.toLowerCase()} configuration. It only takes a few minutes!`}
    action={{
      label: 'Get Started',
      onClick: onGetStarted,
      loading
    }}
    variant="illustration"
    size="lg"
    className={className}
  />
);