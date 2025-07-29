/**
 * ERIP Layout Components
 * Standardized layout components for consistent visual alignment across all pages
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
}

/**
 * Container component for consistent page width and padding
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = 'xl',
  padding = true,
  ...props
}) => {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div
      className={cn(
        'mx-auto w-full',
        sizeClasses[size],
        padding && 'px-4 sm:px-6 lg:px-8',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'default' | 'muted' | 'gradient' | 'dark';
}

/**
 * Section component for consistent vertical spacing
 */
export const Section: React.FC<SectionProps> = ({
  children,
  className,
  spacing = 'lg',
  background = 'default',
  ...props
}) => {
  const spacingClasses = {
    sm: 'py-8 sm:py-12',
    md: 'py-12 sm:py-16',
    lg: 'py-16 sm:py-20',
    xl: 'py-20 sm:py-24'
  };

  const backgroundClasses = {
    default: 'bg-white',
    muted: 'bg-slate-50',
    gradient: 'bg-gradient-to-br from-slate-50 to-blue-50',
    dark: 'bg-slate-900 text-white'
  };

  return (
    <section
      className={cn(
        spacingClasses[spacing],
        backgroundClasses[background],
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
};

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  centered?: boolean;
}

/**
 * PageHeader component for consistent page titles
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  actions,
  centered = false
}) => {
  return (
    <div className={cn(
      'mb-8',
      centered && 'text-center'
    )}>
      {badge && (
        <div className="mb-4">
          {badge}
        </div>
      )}
      <div className={cn(
        'flex flex-col gap-4',
        !centered && 'sm:flex-row sm:items-center sm:justify-between'
      )}>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-lg text-slate-600">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className={cn(
            'flex items-center gap-3',
            centered && 'justify-center'
          )}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  responsive?: boolean;
}

/**
 * Grid component for consistent layouts
 */
export const Grid: React.FC<GridProps> = ({
  children,
  className,
  cols = 3,
  gap = 'md',
  responsive = true,
  ...props
}) => {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  };

  const colClasses = {
    1: '',
    2: responsive ? 'sm:grid-cols-2' : 'grid-cols-2',
    3: responsive ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-3',
    4: responsive ? 'sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-4'
  };

  return (
    <div
      className={cn(
        'grid',
        gapClasses[gap],
        colClasses[cols],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  direction?: 'vertical' | 'horizontal';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

/**
 * Stack component for consistent spacing between elements
 */
export const Stack: React.FC<StackProps> = ({
  children,
  className,
  spacing = 'md',
  direction = 'vertical',
  align = 'stretch',
  ...props
}) => {
  const spacingClasses = {
    xs: direction === 'vertical' ? 'space-y-2' : 'space-x-2',
    sm: direction === 'vertical' ? 'space-y-3' : 'space-x-3',
    md: direction === 'vertical' ? 'space-y-4' : 'space-x-4',
    lg: direction === 'vertical' ? 'space-y-6' : 'space-x-6',
    xl: direction === 'vertical' ? 'space-y-8' : 'space-x-8'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  return (
    <div
      className={cn(
        'flex',
        direction === 'vertical' ? 'flex-col' : 'flex-row',
        spacingClasses[spacing],
        alignClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end' | 'between';
  spacing?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

/**
 * ButtonGroup component for consistent button alignment
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className,
  align = 'start',
  spacing = 'md',
  fullWidth = false,
  ...props
}) => {
  const alignClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  };

  const spacingClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4'
  };

  return (
    <div
      className={cn(
        'flex flex-wrap items-center',
        alignClasses[align],
        spacingClasses[spacing],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) => (
        <div className={fullWidth ? 'flex-1' : ''}>
          {child}
        </div>
      ))}
    </div>
  );
};

interface CardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * CardGrid component for consistent card layouts
 */
export const CardGrid: React.FC<CardGridProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'grid gap-6 sm:grid-cols-2 lg:grid-cols-3',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

/**
 * EmptyState component for consistent empty states
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && (
        <div className="mb-4 text-slate-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-slate-600">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
};