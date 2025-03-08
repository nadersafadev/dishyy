'use client';

import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Notification } from '@/types/notifications';
import { cn } from '@/lib/utils';

interface NotificationListProps {
  notifications: Notification[];
}

export function NotificationList({ notifications }: NotificationListProps) {
  const router = useRouter();

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No notifications yet
      </div>
    );
  }

  const handleNotificationClick = (notification: Notification) => {
    if (notification.data?.partyId) {
      router.push(`/parties/${notification.data.partyId}`);
    }
  };

  return (
    <div className="space-y-2">
      {notifications.map(notification => (
        <button
          key={notification.id}
          onClick={() => handleNotificationClick(notification)}
          className={cn(
            'w-full text-left p-3 rounded-lg transition-colors',
            'hover:bg-muted/50',
            !notification.read && 'bg-muted/30'
          )}
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-start justify-between gap-2">
              <span className="font-medium">{notification.title}</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {notification.message}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
