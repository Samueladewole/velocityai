import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface VelocityButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}

export function VelocityButton({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  disabled,
  children,
  ...props
}: VelocityButtonProps) {
  const variants = {
    primary: 'btn-velocity-primary',
    secondary: 'btn-velocity-secondary',
    ghost: 'btn-velocity-ghost',
    danger: 'btn-velocity bg-red-600/20 text-red-300 hover:bg-red-600/30',
    success: 'btn-velocity bg-green-600/20 text-green-300 hover:bg-green-600/30'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  return (
    <button
      className={cn(
        variants[variant],
        sizes[size],
        'relative',
        loading && 'cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      <span
        className={cn(
          'flex items-center justify-center gap-2',
          loading && 'opacity-0'
        )}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </span>
      )}
    </button>
  )
}

interface VelocityIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon: React.ReactNode
  label: string
}

export function VelocityIconButton({
  className,
  variant = 'ghost',
  size = 'md',
  loading = false,
  icon,
  label,
  disabled,
  ...props
}: VelocityIconButtonProps) {
  const variants = {
    primary: 'btn-velocity-primary',
    secondary: 'btn-velocity-secondary',
    ghost: 'btn-velocity-ghost'
  }

  const sizes = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  }

  return (
    <button
      className={cn(
        variants[variant],
        sizes[size],
        'rounded-lg',
        loading && 'cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      aria-label={label}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
    </button>
  )
}