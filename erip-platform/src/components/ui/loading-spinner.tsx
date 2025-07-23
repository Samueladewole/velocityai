import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const spinnerVariants = cva(
  "animate-spin rounded-full border-2 border-current border-t-transparent",
  {
    variants: {
      size: {
        default: "h-6 w-6",
        sm: "h-4 w-4",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
      },
      variant: {
        default: "text-primary",
        white: "text-white",
        muted: "text-muted-foreground",
        success: "text-green-600",
        warning: "text-yellow-600",
        destructive: "text-red-600",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

const LoadingSpinner = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof spinnerVariants>
>(({ className, size, variant, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(spinnerVariants({ size, variant, className }))}
      {...props}
    />
  )
})

LoadingSpinner.displayName = "LoadingSpinner"

export { LoadingSpinner, spinnerVariants }