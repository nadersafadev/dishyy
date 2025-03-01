'use client';

import { DeleteEntityDialog } from '@/components/ui/delete-entity-dialog';

interface DeleteCategoryDialogProps {
  categoryId: string;
  // Required props
  categoryName: string;
  // Optional props
  dishesCount?: number;
  isParent?: boolean;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteCategoryDialog({
  categoryId,
  categoryName,
  dishesCount = 0,
  isParent = false,
  trigger,
  open,
  onOpenChange,
  onSuccess,
}: DeleteCategoryDialogProps) {
  // Prepare warnings based on available data
  const warnings = [];

  if (dishesCount > 0) {
    warnings.push({
      type: 'warning' as const,
      title: 'Warning',
      message: `This category has ${dishesCount} ${dishesCount === 1 ? 'dish' : 'dishes'} associated with it. Deleting this category will remove the connection to these dishes.`,
    });
  }

  if (isParent) {
    warnings.push({
      type: 'info' as const,
      title: 'Note',
      message:
        'This is a parent category. Any child categories will be disconnected from this parent.',
    });
  }

  return (
    <DeleteEntityDialog
      entityId={categoryId}
      entityName={categoryName}
      entityType="Category"
      deleteEndpoint={`/api/categories/${categoryId}`}
      warnings={warnings}
      confirmText="Delete Category"
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
      onSuccess={onSuccess}
    />
  );
}
