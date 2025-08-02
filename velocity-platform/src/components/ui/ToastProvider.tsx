import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Toast, 
  ToastProvider as RadixToastProvider, 
  ToastViewport, 
  ToastTitle, 
  ToastDescription, 
  ToastClose 
} from '@/components/ui/toast';
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toasts, dismiss } = useToast();

  const icons = {
    default: Info,
    destructive: AlertCircle,
    success: CheckCircle,
    warning: AlertTriangle,
    info: Info,
  };

  return (
    <RadixToastProvider>
      {children}
      {toasts.map((toast) => {
        const Icon = icons[toast.variant || 'default'];
        
        return (
          <Toast 
            key={toast.id} 
            variant={toast.variant}
            onOpenChange={(open) => {
              if (!open) {
                dismiss(toast.id);
              }
            }}
          >
            <div className="flex items-start space-x-3">
              <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="grid gap-1">
                {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
                {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
              </div>
            </div>
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </RadixToastProvider>
  );
};

export default ToastProvider;