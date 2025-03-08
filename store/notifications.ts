import { create } from 'zustand';
import { NotificationProps, NotificationState } from '@/types/notifications';
import { toast } from '@/lib/toast';

export const useNotificationStore = create<NotificationState>(set => ({
  notifications: [],
  addNotification: (notification: NotificationProps) => {
    const {
      title,
      description,
      variant = 'default',
      duration = 3000,
      action,
    } = notification;

    set(state => ({
      notifications: [...state.notifications, notification],
    }));

    toast.show({
      title,
      description,
      variant,
      duration,
      action,
    });
  },
  removeNotification: (index: number) =>
    set(state => ({
      notifications: state.notifications.filter((_, i) => i !== index),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));
