'use client';

import { Button } from '@/components/ui/button';

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
}

export function SettingItem({
  icon,
  title,
  description,
  actionLabel,
  onClick,
  variant = 'outline',
}: SettingItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="text-muted-foreground">{icon}</div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <Button variant={variant} size="sm" onClick={onClick}>
        {actionLabel}
      </Button>
    </div>
  );
}
