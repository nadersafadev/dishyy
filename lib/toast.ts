import { toast as sonnerToast } from 'sonner';
import type { ToastVariant } from '@/types/toast';

interface ToastOptions {
  title: string;
  description?: string;
}

const createToast = (
  title: string,
  description?: string,
  variant?: ToastVariant
) => {
  const options = { description };

  switch (variant) {
    case 'success':
      return sonnerToast.success(title, options);
    case 'error':
      return sonnerToast.error(title, options);
    case 'warning':
      return sonnerToast.warning(title, options);
    case 'info':
      return sonnerToast.info(title, options);
    default:
      return sonnerToast(title, options);
  }
};

export const toast = {
  show: ({ title, description }: ToastOptions) =>
    createToast(title, description),
  success: (title: string, description?: string) =>
    createToast(title, description, 'success'),
  error: (title: string, description?: string) =>
    createToast(title, description, 'error'),
  info: (title: string, description?: string) =>
    createToast(title, description, 'info'),
  warning: (title: string, description?: string) =>
    createToast(title, description, 'warning'),
};
