import React from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { VelocityCard } from './VelocityCard'

interface VelocityMetricCardProps {
  title: string
  value: string | number
  unit?: string
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  loading?: boolean
  className?: string
}

export function VelocityMetricCard({
  title,
  value,
  unit,
  change,
  changeLabel,
  icon,
  loading = false,
  className
}: VelocityMetricCardProps) {
  const getTrendIcon = () => {
    if (change === undefined || change === 0) return <Minus className="h-4 w-4" />
    if (change > 0) return <TrendingUp className="h-4 w-4" />
    return <TrendingDown className="h-4 w-4" />
  }

  const getTrendColor = () => {
    if (change === undefined || change === 0) return 'text-gray-400'
    if (change > 0) return 'text-green-400'
    return 'text-red-400'
  }

  if (loading) {
    return (
      <VelocityCard variant="metric" className={className}>
        <div className="animate-pulse">
          <div className="h-4 w-24 bg-white/10 rounded mb-3" />
          <div className="h-10 w-32 bg-white/10 rounded mb-2" />
          <div className="h-3 w-20 bg-white/10 rounded" />
        </div>
      </VelocityCard>
    )
  }

  return (
    <VelocityCard variant="metric" className={className}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="metric-label flex items-center gap-2">
            {icon && <span className="text-purple-400">{icon}</span>}
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="metric-value">{value}</span>
            {unit && <span className="text-xl text-muted-foreground">{unit}</span>}
          </div>
          {change !== undefined && (
            <div className={cn('flex items-center gap-1 mt-2', getTrendColor())}>
              {getTrendIcon()}
              <span className="text-sm font-medium">
                {change > 0 && '+'}
                {change}%
              </span>
              {changeLabel && (
                <span className="text-sm text-muted-foreground">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </VelocityCard>
  )
}

interface VelocityMetricGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function VelocityMetricGrid({
  children,
  columns = 4,
  className
}: VelocityMetricGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {children}
    </div>
  )
}