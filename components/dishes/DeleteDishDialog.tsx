'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
import { DeleteEntityDialog } from '@/components/ui/delete-entity-dialog';

interface DeleteDishDialogProps {
  dishId: string;
  dishName: string;
  inMenuCount: number;
  trigger: React.ReactNode;
  onSuccess?: () => void;
}

export function DeleteDishDialog({
  dishId,
  dishName,
  inMenuCount,
  trigger,
  onSuccess,
}: DeleteDishDialogProps) {
  // Use the reusable DeleteEntityDialog component
  const warnings =
    inMenuCount > 0
      ? [
          {
            type: 'warning' as const,
            title: 'This dish is used in parties',
            message: `This dish is currently used in ${inMenuCount} ${inMenuCount === 1 ? 'party' : 'parties'}. Deleting it will remove it from those parties.`,
          },
        ]
      : [];

  return (
    <DeleteEntityDialog
      entityId={dishId}
      entityName={dishName}
      entityType="Dish"
      deleteEndpoint={`/api/dishes/${dishId}`}
      warnings={warnings}
      trigger={trigger}
      onSuccess={() => {
        toast.success(`"${dishName}" has been deleted`);
        if (onSuccess) {
          onSuccess();
        }
      }}
    />
  );
}
