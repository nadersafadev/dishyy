import { ToastVariant } from '@/types/toast';

export interface NotificationProps {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface NotificationState {
  notifications: NotificationProps[];
  addNotification: (notification: NotificationProps) => void;
  removeNotification: (index: number) => void;
  clearNotifications: () => void;
}
