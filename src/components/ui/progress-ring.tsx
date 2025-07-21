import { cn } from "@/lib/utils"

interface ProgressRingProps {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  className?: string
  showValue?: boolean
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  className,
  showValue = true,
  color = 'blue'
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  const colorClasses = {
    blue: 'stroke-blue-600',
    green: 'stroke-green-600',
    red: 'stroke-red-600',
    yellow: 'stroke-yellow-600',
    purple: 'stroke-purple-600'
  }

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-200"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn(
            "transition-all duration-1000 ease-out",
            colorClasses[color]
          )}
        />
      </svg>
      
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-slate-900">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  )
}