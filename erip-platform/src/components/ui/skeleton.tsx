import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'shimmer' | 'none';
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ 
    className, 
    variant = 'default',
    width,
    height,
    animation = 'pulse',
    style,
    ...props 
  }, ref) => {
    const baseClasses = 'bg-muted relative overflow-hidden';
    
    const animationClasses = {
      pulse: 'animate-pulse',
      shimmer: 'skeleton-shimmer',
      none: '',
    };
    
    const variantClasses = {
      default: 'rounded-md',
      text: 'rounded h-4 w-full',
      circular: 'rounded-full',
      rectangular: 'rounded-none',
    };
    
    const dimensions = {
      width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
      height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          animationClasses[animation],
          variantClasses[variant],
          className
        )}
        style={{
          ...dimensions,
          ...style,
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// Pre-built skeleton components for common use cases
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 3, 
  className 
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '80%' : '100%'}
        />
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('rounded-xl border bg-card p-6', className)}>
      <div className="space-y-4">
        <Skeleton variant="rectangular" height={200} className="rounded-lg" />
        <div className="space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" />
          <Skeleton variant="text" width="80%" />
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="text" width="50%" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number; columns?: number; className?: string }> = ({ 
  rows = 5, 
  columns = 4,
  className 
}) => {
  return (
    <div className={cn('w-full', className)}>
      <div className="border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="border-b bg-muted/50 p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} variant="text" height={20} />
            ))}
          </div>
        </div>
        {/* Body */}
        <div className="divide-y">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="p-4">
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <Skeleton 
                    key={colIndex} 
                    variant="text" 
                    height={16}
                    width={colIndex === 0 ? '60%' : '80%'}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SkeletonMetric: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('space-y-2', className)}>
      <Skeleton variant="text" width="40%" height={16} />
      <Skeleton variant="text" width="60%" height={32} />
      <Skeleton variant="text" width="50%" height={14} />
    </div>
  );
};

export const SkeletonAvatar: React.FC<{ size?: number; className?: string }> = ({ 
  size = 40,
  className 
}) => {
  return (
    <Skeleton 
      variant="circular" 
      width={size} 
      height={size}
      className={className}
    />
  );
};

export const SkeletonButton: React.FC<{ width?: string | number; className?: string }> = ({ 
  width = 120,
  className 
}) => {
  return (
    <Skeleton 
      variant="default" 
      width={width} 
      height={40}
      className={cn('rounded-lg', className)}
    />
  );
};

export const SkeletonChart: React.FC<{ height?: number; className?: string }> = ({ 
  height = 300,
  className 
}) => {
  return (
    <div className={cn('w-full', className)}>
      <Skeleton 
        variant="rectangular" 
        height={height}
        className="rounded-lg"
      />
    </div>
  );
};

export { Skeleton };