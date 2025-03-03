'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { DeleteEntityDialog } from '@/components/ui/delete-entity-dialog';

interface DeleteDishDialogProps {
  dishId: string;
  dishName: string;
  inMenuCount: number;
  trigger: React.ReactNode;
}

export function DeleteDishDialog({
  dishId,
  dishName,
  inMenuCount,
  trigger,
}: DeleteDishDialogProps) {
  const router = useRouter();
  const { toast } = useToast();

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
        toast({
          title: 'Dish Deleted',
          description: `${dishName} has been successfully deleted.`,
        });
        router.refresh();
      }}
    />
  );
}
