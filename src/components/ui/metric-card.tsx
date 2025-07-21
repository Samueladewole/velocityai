import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon?: React.ReactNode
  description?: string
  className?: string
  premium?: boolean
}

export function MetricCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  description,
  className,
  premium = false
}: MetricCardProps) {
  const changeIcon = {
    increase: ArrowUpRight,
    decrease: ArrowDownRight,
    neutral: Minus
  }[changeType]

  const changeColor = {
    increase: 'text-green-700',
    decrease: 'text-red-700',
    neutral: 'text-slate-600'
  }[changeType]

  const ChangeIcon = changeIcon

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:-translate-y-1",
        premium 
          ? "border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50" 
          : "hover:shadow-md",
        className
      )}
    >
      {premium && (
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
      )}
      
      <CardHeader className={cn(
        "relative flex flex-row items-center justify-between space-y-0",
        premium ? "pb-3" : "pb-2"
      )}>
        <CardTitle className={cn(
          "text-sm font-semibold",
          premium ? "text-slate-700" : "text-slate-600"
        )}>
          {title}
        </CardTitle>
        {icon && (
          <div className={cn(
            "flex items-center justify-center rounded-xl transition-all duration-300",
            premium 
              ? "h-10 w-10 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 group-hover:from-blue-50 group-hover:to-blue-100 group-hover:text-blue-600"
              : "h-8 w-8 text-slate-500"
          )}>
            {icon}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="relative">
        <div className={cn(
          "font-bold mb-2",
          premium ? "text-3xl text-slate-900" : "text-2xl text-slate-800"
        )}>
          {value}
        </div>
        
        {change && (
          <div className={cn("flex items-center gap-1 text-sm font-medium", changeColor)}>
            <ChangeIcon className="h-4 w-4" />
            <span>{change}</span>
            {description && (
              <span className="text-slate-500 font-normal">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}