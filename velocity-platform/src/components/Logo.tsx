/**
 * Logo Component
 * 
 * A customizable logo component for ERIP that combines a shield icon with text.
 * The logo can be used in different sizes and colors.
 */

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string
  textClassName?: string
  showText?: boolean
  clickable?: boolean
}

export function Logo({
  className,
  textClassName,
  showText = true,
  clickable = true,
  ...props
}: LogoProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (clickable) {
      navigate('/')
    }
  }

  return (
    <div 
      className={cn(
        "flex items-center gap-2",
        clickable && "cursor-pointer hover:opacity-80 transition-opacity"
      )}
      onClick={handleClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (clickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 32 32" 
        className={cn("h-8 w-8 flex-shrink-0", className)}
        fill="none"
        {...props}
      >
        {/* Main shield outline - bold */}
        <path 
          d="M16 2L6 8v6c0 6.627 4.477 12 10 12s10-5.373 10-12V8L16 2z" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        {/* Vertical centerline - bold */}
        <path 
          d="M16 8v14" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        {/* Horizontal crossbar - bold */}
        <path 
          d="M10 18h12" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        {/* Top section - bold with partial fill */}
        <path 
          d="M10 8h12v4a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8z" 
          stroke="currentColor" 
          strokeWidth="2" 
          fill="currentColor"
          fillOpacity="0.15"
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      
      {showText && (
        <span
          className={cn(
            "font-bold text-2xl tracking-tight text-foreground",
            textClassName
          )}
        >
          ERIP
        </span>
      )}
    </div>
  )
}