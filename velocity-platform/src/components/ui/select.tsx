/**
 * Select UI Component
 * Dropdown select component for PRISM
 */
import React, { createContext, useContext, useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface SelectContextType {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}

const SelectContext = createContext<SelectContextType | undefined>(undefined)

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

export function Select({ value = '', onValueChange, children }: SelectProps) {
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState(value)

  const currentValue = value || internalValue
  const handleValueChange = (newValue: string) => {
    if (onValueChange) {
      onValueChange(newValue)
    } else {
      setInternalValue(newValue)
    }
    setOpen(false)
  }

  return (
    <SelectContext.Provider value={{ 
      value: currentValue, 
      onValueChange: handleValueChange, 
      open, 
      setOpen 
    }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

interface SelectTriggerProps {
  className?: string
  children: React.ReactNode
}

export function SelectTrigger({ className, children }: SelectTriggerProps) {
  const context = useContext(SelectContext)
  if (!context) {
    throw new Error('SelectTrigger must be used within a Select component')
  }

  return (
    <button
      type="button"
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      onClick={() => context.setOpen(!context.open)}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
}

interface SelectValueProps {
  placeholder?: string
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const context = useContext(SelectContext)
  if (!context) {
    throw new Error('SelectValue must be used within a Select component')
  }

  return (
    <span className={cn(!context.value && 'text-gray-500')}>
      {context.value || placeholder}
    </span>
  )
}

interface SelectContentProps {
  className?: string
  children: React.ReactNode
}

export function SelectContent({ className, children }: SelectContentProps) {
  const context = useContext(SelectContext)
  if (!context) {
    throw new Error('SelectContent must be used within a Select component')
  }

  if (!context.open) return null

  return (
    <div
      className={cn(
        'absolute top-full z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg',
        className
      )}
    >
      {children}
    </div>
  )
}

interface SelectItemProps {
  value: string
  className?: string
  children: React.ReactNode
}

export function SelectItem({ value, className, children }: SelectItemProps) {
  const context = useContext(SelectContext)
  if (!context) {
    throw new Error('SelectItem must be used within a Select component')
  }

  return (
    <div
      className={cn(
        'cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100',
        context.value === value && 'bg-blue-100 text-blue-900',
        className
      )}
      onClick={() => context.onValueChange(value)}
    >
      {children}
    </div>
  )
}