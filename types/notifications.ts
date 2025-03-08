import { ToastVariant } from '@/types/toast';

export interface NotificationProps {
  title: string;
  description?: string;
}

export interface NotificationState {
  notifications: NotificationProps[];
  addNotification: (notification: NotificationProps) => void;
  removeNotification: (index: number) => void;
  clearNotifications: () => void;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

export interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationIds: string[]) => Promise<void>;
}
