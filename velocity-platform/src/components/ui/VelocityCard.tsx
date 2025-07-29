import React from 'react'
import { cn } from '@/lib/utils'

interface VelocityCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gradient' | 'glow' | 'metric'
  hover?: boolean
  shimmer?: boolean
  children: React.ReactNode
}

export function VelocityCard({
  className,
  variant = 'default',
  hover = false,
  shimmer = false,
  children,
  ...props
}: VelocityCardProps) {
  const variants = {
    default: 'glass-card',
    gradient: 'glass-card velocity-gradient-border',
    glow: 'glass-card velocity-glow',
    metric: 'metric-card'
  }

  return (
    <div
      className={cn(
        variants[variant],
        hover && 'card-hover-glow',
        shimmer && 'velocity-shimmer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface VelocityCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export function VelocityCardHeader({
  title,
  description,
  icon,
  action,
  className,
  ...props
}: VelocityCardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between mb-4', className)} {...props}>
      <div className="flex items-start space-x-3">
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}

interface VelocityCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function VelocityCardContent({
  className,
  children,
  ...props
}: VelocityCardContentProps) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

interface VelocityCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function VelocityCardFooter({
  className,
  children,
  ...props
}: VelocityCardFooterProps) {
  return (
    <div className={cn('mt-6 pt-4 border-t border-white/10', className)} {...props}>
      {children}
    </div>
  )
}