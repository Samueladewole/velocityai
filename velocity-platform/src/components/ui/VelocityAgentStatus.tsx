import React from 'react'
import { cn } from '@/lib/utils'
import { Activity, AlertCircle, CheckCircle2, Pause, Power, Loader2 } from 'lucide-react'

type AgentStatus = 'created' | 'starting' | 'running' | 'paused' | 'stopped' | 'error' | 'terminated'

interface VelocityAgentStatusProps {
  status: AgentStatus
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  showIcon?: boolean
  animated?: boolean
  className?: string
}

export function VelocityAgentStatus({
  status,
  size = 'md',
  showLabel = true,
  showIcon = true,
  animated = true,
  className
}: VelocityAgentStatusProps) {
  const statusConfig = {
    created: {
      label: 'Created',
      icon: Power,
      color: 'text-gray-400',
      bgColor: 'bg-gray-400/10',
      borderColor: 'border-gray-400/20',
      pulse: false
    },
    starting: {
      label: 'Starting',
      icon: Loader2,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-400/20',
      pulse: true,
      iconAnimation: 'animate-spin'
    },
    running: {
      label: 'Running',
      icon: CheckCircle2,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/20',
      pulse: true
    },
    paused: {
      label: 'Paused',
      icon: Pause,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-400/20',
      pulse: false
    },
    stopped: {
      label: 'Stopped',
      icon: Power,
      color: 'text-gray-400',
      bgColor: 'bg-gray-400/10',
      borderColor: 'border-gray-400/20',
      pulse: false
    },
    error: {
      label: 'Error',
      icon: AlertCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      borderColor: 'border-red-400/20',
      pulse: true
    },
    terminated: {
      label: 'Terminated',
      icon: Power,
      color: 'text-gray-600',
      bgColor: 'bg-gray-600/10',
      borderColor: 'border-gray-600/20',
      pulse: false
    }
  }

  const sizeConfig = {
    sm: {
      container: 'px-2 py-1 text-xs',
      icon: 'h-3 w-3',
      gap: 'gap-1'
    },
    md: {
      container: 'px-3 py-1.5 text-sm',
      icon: 'h-4 w-4',
      gap: 'gap-1.5'
    },
    lg: {
      container: 'px-4 py-2 text-base',
      icon: 'h-5 w-5',
      gap: 'gap-2'
    }
  }

  const config = statusConfig[status]
  const sizes = sizeConfig[size]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg border',
        sizes.container,
        sizes.gap,
        config.color,
        config.bgColor,
        config.borderColor,
        animated && config.pulse && 'status-active',
        className
      )}
    >
      {showIcon && (
        <Icon className={cn(sizes.icon, config.iconAnimation)} />
      )}
      {showLabel && <span className="font-medium">{config.label}</span>}
    </div>
  )
}

interface VelocityAgentAvatarProps {
  agentType: string
  status?: AgentStatus
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function VelocityAgentAvatar({
  agentType,
  status = 'stopped',
  size = 'md',
  className
}: VelocityAgentAvatarProps) {
  const sizeConfig = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg'
  }

  const getAgentInitials = (type: string) => {
    const parts = type.split('-')
    if (parts.length >= 2) {
      return parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
    }
    return type.substring(0, 2).toUpperCase()
  }

  const statusColors = {
    running: 'ring-green-400',
    error: 'ring-red-400',
    paused: 'ring-yellow-400',
    starting: 'ring-blue-400',
    created: 'ring-gray-400',
    stopped: 'ring-gray-400',
    terminated: 'ring-gray-600'
  }

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-xl velocity-gradient font-bold',
        sizeConfig[size],
        status === 'running' && 'animate-pulse',
        'ring-2 ring-offset-2 ring-offset-background',
        statusColors[status],
        className
      )}
    >
      {getAgentInitials(agentType)}
      {status === 'running' && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping" />
      )}
    </div>
  )
}

interface VelocityAgentHealthProps {
  cpu: number
  memory: number
  responseTime: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function VelocityAgentHealth({
  cpu,
  memory,
  responseTime,
  size = 'md',
  className
}: VelocityAgentHealthProps) {
  const getHealthColor = (value: number, type: 'cpu' | 'memory' | 'responseTime') => {
    if (type === 'responseTime') {
      if (value < 100) return 'text-green-400'
      if (value < 500) return 'text-yellow-400'
      return 'text-red-400'
    } else {
      if (value < 50) return 'text-green-400'
      if (value < 80) return 'text-yellow-400'
      return 'text-red-400'
    }
  }

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div className="flex items-center gap-1">
        <Activity className="h-4 w-4 text-muted-foreground" />
        <span className={cn('text-sm font-medium', getHealthColor(cpu, 'cpu'))}>
          {cpu.toFixed(1)}%
        </span>
      </div>
      <div className="flex items-center gap-1">
        <div className="h-4 w-4 rounded bg-muted flex items-center justify-center text-xs">
          M
        </div>
        <span className={cn('text-sm font-medium', getHealthColor(memory, 'memory'))}>
          {memory.toFixed(0)}MB
        </span>
      </div>
      <div className="flex items-center gap-1">
        <div className="h-4 w-4 rounded bg-muted flex items-center justify-center text-xs">
          T
        </div>
        <span className={cn('text-sm font-medium', getHealthColor(responseTime, 'responseTime'))}>
          {responseTime}ms
        </span>
      </div>
    </div>
  )
}