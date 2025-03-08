import { create } from 'zustand';
import {
  NotificationProps,
  NotificationState,
  NotificationsState,
  Notification,
} from '@/types/notifications';
import { toast } from '@/lib/toast';

export const useNotificationStore = create<NotificationState>(set => ({
  notifications: [],
  addNotification: (notification: NotificationProps) => {
    const { title, description } = notification;

    set(state => ({
      notifications: [...state.notifications, notification],
    }));

    toast.show({
      title,
      description,
    });
  },
  removeNotification: (index: number) =>
    set(state => ({
      notifications: state.notifications.filter((_, i) => i !== index),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  fetchNotifications: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/notifications');
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const notifications: Notification[] = await response.json();
      set({
        notifications,
        unreadCount: notifications.filter(n => !n.read).length,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch notifications',
      });
    } finally {
      set({ isLoading: false });
    }
  },
  markAsRead: async (notificationIds: string[]) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark notifications as read');
      }

      set(state => ({
        notifications: state.notifications.map(notification =>
          notificationIds.includes(notification.id)
            ? { ...notification, read: true }
            : notification
        ),
        unreadCount: state.notifications.filter(
          n => !n.read && !notificationIds.includes(n.id)
        ).length,
      }));
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  },
}));
