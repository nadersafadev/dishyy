'use client';

import { DeleteEntityDialog } from '@/components/ui/delete-entity-dialog';

interface DeleteUnitDialogProps {
  unitId: string;
  // Required props
  unitName: string;
  // Optional props
  dishesCount?: number;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteUnitDialog({
  unitId,
  unitName,
  dishesCount = 0,
  trigger,
  open,
  onOpenChange,
  onSuccess,
}: DeleteUnitDialogProps) {
  // Prepare warnings based on available data
  const warnings = [];

  if (dishesCount > 0) {
    warnings.push({
      type: 'warning' as const,
      title: 'Warning',
      message: `This unit is used by ${dishesCount} ${dishesCount === 1 ? 'dish' : 'dishes'}. Deleting this unit will affect these dishes.`,
    });
  }

  return (
    <DeleteEntityDialog
      entityId={unitId}
      entityName={unitName}
      entityType="Unit"
      deleteEndpoint={`/api/units/${unitId}`}
      warnings={warnings}
      confirmText="Delete Unit"
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
      onSuccess={onSuccess}
    />
  );
}
