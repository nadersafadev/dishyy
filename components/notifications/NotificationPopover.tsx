'use client';

import * as React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotificationsStore } from '@/store/notifications';
import { NotificationList } from './NotificationList';

interface NotificationPopoverProps {
  children: React.ReactNode;
}

export function NotificationPopover({ children }: NotificationPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const { notifications, unreadCount, markAsRead } = useNotificationsStore();

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && unreadCount > 0) {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      markAsRead(unreadIds);
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <ScrollArea className="h-[500px]">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium">Notifications</h4>
            <NotificationList notifications={notifications} />
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
