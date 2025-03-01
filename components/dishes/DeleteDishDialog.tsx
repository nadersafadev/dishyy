'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DeleteEntityDialog } from '@/components/ui/delete-entity-dialog';
import type { Dish } from '@/lib/types';

interface DeleteDishDialogProps {
  dishId: string;
  dishName: string;
  inMenuCount?: number;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteDishDialog({
  dishId,
  dishName,
  inMenuCount = 0,
  trigger,
  open,
  onOpenChange,
  onSuccess,
}: DeleteDishDialogProps) {
  // Prepare warnings based on available data
  const warnings = [];

  if (inMenuCount > 0) {
    warnings.push({
      type: 'warning' as const,
      title: 'Warning',
      message: `This dish is used in ${inMenuCount} ${inMenuCount === 1 ? 'menu' : 'menus'}. Deleting this dish will remove it from these menus.`,
    });
  }

  return (
    <DeleteEntityDialog
      entityId={dishId}
      entityName={dishName}
      entityType="Dish"
      deleteEndpoint={`/api/dishes/${dishId}`}
      warnings={warnings}
      confirmText="Delete Dish"
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
      onSuccess={onSuccess}
    />
  );
}
