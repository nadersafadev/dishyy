'use client';

import { DeleteEntityDialog } from '@/components/ui/delete-entity-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface DeleteDishContributionDialogProps {
  // Required props
  contributionId: string;
  partyId: string;
  dishName: string;
  amount: number;
  unit: string;
  // Optional props
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteDishContributionDialog({
  contributionId,
  partyId,
  dishName,
  amount,
  unit,
  trigger,
  open,
  onOpenChange,
  onSuccess,
}: DeleteDishContributionDialogProps) {
  const entityName = `${amount.toFixed(1)} ${unit.toLowerCase()} of ${dishName}`;

  // Custom trigger if none provided
  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
    >
      <Trash2 className="h-4 w-4" />
      <span className="sr-only">Delete contribution</span>
    </Button>
  );

  return (
    <DeleteEntityDialog
      entityId={contributionId}
      entityName={entityName}
      entityType="Contribution"
      deleteEndpoint={`/api/parties/${partyId}/contributions/${contributionId}`}
      confirmText="Remove Contribution"
      title="Remove Contribution"
      trigger={trigger || defaultTrigger}
      open={open}
      onOpenChange={onOpenChange}
      onSuccess={onSuccess}
    />
  );
}
