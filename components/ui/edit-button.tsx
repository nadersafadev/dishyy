'use client';

import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';
import { ActionButtonProps } from '@/components/ui/action-button';

export function EditButton({
  onClick,
  className,
  label = 'Edit',
  ...props
}: ActionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={`h-8 w-8 hover:bg-primary hover:text-primary-foreground ${className ?? ''}`}
      {...props}
    >
      <Edit2 className="h-4 w-4" />
      <span className="sr-only">{label}</span>
    </Button>
  );
}
