'use client';

import { useToast } from '@/hooks/use-toast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastProps,
} from '@/components/ui/toast';
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export function Toaster() {
  const { toasts } = useToast();

  const getIcon = (variant: ToastProps['variant']) => {
    const iconProps = { className: 'h-5 w-5' };

    switch (variant) {
      case 'destructive':
        return (
          <AlertCircle
            {...iconProps}
            className={`${iconProps.className} text-destructive`}
          />
        );
      case 'success':
        return (
          <CheckCircle2
            {...iconProps}
            className={`${iconProps.className} text-green-500`}
          />
        );
      case 'warning':
        return (
          <AlertTriangle
            {...iconProps}
            className={`${iconProps.className} text-yellow-500`}
          />
        );
      case 'info':
        return (
          <Info
            {...iconProps}
            className={`${iconProps.className} text-blue-500`}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        variant,
        ...props
      }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex gap-3">
              {getIcon(variant)}
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
