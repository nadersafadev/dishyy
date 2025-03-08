export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastStyles {
  [key: string]: string;
}

export interface ToastClassNames {
  success: string;
  error: string;
  warning: string;
  info: string;
  toast: string;
  title: string;
  description: string;
}
