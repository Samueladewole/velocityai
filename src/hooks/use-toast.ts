// Simple toast hook for demo purposes
import { useState } from 'react'

interface ToastProps {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (props: ToastProps) => {
    console.log('Toast:', props.title, props.description)
    setToasts(prev => [...prev, props])
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.slice(1))
    }, 3000)
  }

  return { toast, toasts }
}