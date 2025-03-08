import { cn } from '@/lib/utils';
import type { ToastClassNames, ToastStyles } from '@/types/toast';

export const TOAST_STYLES: ToastStyles = {
  background: 'hsl(var(--background))',
  border: '1px solid hsl(var(--border))',
};

export const TOAST_CLASSNAMES: ToastClassNames = {
  success: cn(
    'group border-green-500 bg-green-500/10',
    'data-[type=success]:border-green-500',
    'data-[type=success]:dark:border-green-500'
  ),
  error: cn(
    'group border-destructive bg-destructive/10',
    'data-[type=error]:border-destructive',
    'data-[type=error]:dark:border-destructive'
  ),
  warning: cn(
    'group border-yellow-500 bg-yellow-500/10',
    'data-[type=warning]:border-yellow-500',
    'data-[type=warning]:dark:border-yellow-500'
  ),
  info: cn(
    'group border-blue-500 bg-blue-500/10',
    'data-[type=info]:border-blue-500',
    'data-[type=info]:dark:border-blue-500'
  ),
  toast: cn(
    'group toast rounded-lg border p-4 shadow-lg',
    'data-[state=open]:animate-in',
    'data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-80',
    'data-[state=open]:slide-in-from-top-full',
    'data-[state=open]:sm:slide-in-from-bottom-full'
  ),
  title: 'text-foreground font-semibold',
  description: 'text-muted-foreground text-sm',
};
