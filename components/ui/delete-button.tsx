'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { ActionButtonProps } from '@/components/ui/action-button';

export function DeleteButton({
  onClick,
  className,
  label = 'Delete',
  ...props
}: ActionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={`h-8 w-8 hover:bg-destructive hover:text-destructive-foreground ${className ?? ''}`}
      {...props}
    >
      <Trash2 className="h-4 w-4" />
      <span className="sr-only">{label}</span>
    </Button>
  );
}
