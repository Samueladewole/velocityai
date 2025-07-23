/**
 * Slider UI Component
 * Range slider component for PRISM
 */
import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface SliderProps {
  value?: number[]
  onValueChange?: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  className?: string
}

export function Slider({ 
  value = [0], 
  onValueChange, 
  min = 0, 
  max = 100, 
  step = 1, 
  className 
}: SliderProps) {
  const [internalValue, setInternalValue] = useState(value)
  
  const currentValue = value || internalValue
  const percentage = ((currentValue[0] - min) / (max - min)) * 100

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = [parseFloat(event.target.value)]
    if (onValueChange) {
      onValueChange(newValue)
    } else {
      setInternalValue(newValue)
    }
  }

  return (
    <div className={cn('relative w-full', className)}>
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-blue-600 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue[0]}
          onChange={handleChange}
          className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
        />
        <div 
          className="absolute top-1/2 w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow transform -translate-y-1/2"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
    </div>
  )
}