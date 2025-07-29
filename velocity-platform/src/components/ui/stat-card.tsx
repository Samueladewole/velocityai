import * as React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: string
    direction: 'up' | 'down' | 'neutral'
  }
  className?: string
  variant?: 'default' | 'gradient' | 'glass'
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  className,
  variant = 'default'
}: StatCardProps) {
  const baseClasses = "p-6 transition-all duration-300 hover:-translate-y-1"
  
  const variantClasses = {
    default: "bg-white shadow-sm hover:shadow-md border",
    gradient: "bg-gradient-to-br from-white to-slate-50/80 border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50",
    glass: "bg-white/60 backdrop-blur-sm border border-white/20 shadow-xl"
  }

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-slate-600'
  }

  return (
    <Card className={cn(baseClasses, variantClasses[variant], className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          {trend && (
            <p className={cn("text-sm font-medium", trendColors[trend.direction])}>
              {trend.value}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}