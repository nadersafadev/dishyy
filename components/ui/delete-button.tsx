'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { ActionButtonProps } from '@/components/ui/action-button';

export const DeleteButton = React.forwardRef<
  HTMLButtonElement,
  ActionButtonProps
>(({ onClick, className, label = 'Delete', ...props }, ref) => {
  return (
    <Button
      ref={ref}
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
});

DeleteButton.displayName = 'DeleteButton';
