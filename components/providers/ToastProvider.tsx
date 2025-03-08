'use client';

import { Toaster } from 'sonner';
import { useTheme } from 'next-themes';
import { TOAST_STYLES, TOAST_CLASSNAMES } from '@/lib/constants/toast';

export function ToastProvider() {
  const { theme } = useTheme();

  return (
    <Toaster
      position="top-right"
      theme={theme as 'light' | 'dark' | 'system'}
      toastOptions={{
        style: TOAST_STYLES,
        classNames: TOAST_CLASSNAMES,
      }}
    />
  );
}
