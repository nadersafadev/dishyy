'use client';

import { useRouter } from 'next/navigation';
import { DeleteButton } from '@/components/ui/delete-button';
import { DeleteEntityDialog } from '@/components/ui/delete-entity-dialog';
import { toast } from '@/lib/toast';

interface DeletePartyDialogProps {
  partyId: string;
  partyName: string;
}

export function DeletePartyDialog({
  partyId,
  partyName,
}: DeletePartyDialogProps) {
  const router = useRouter();

  const handleSuccess = () => {
    toast.success('Success', 'Party deleted successfully');
    router.push('/parties');
  };

  const warnings = [
    {
      type: 'warning' as const,
      title: 'This action is permanent',
      message:
        'Once deleted, you cannot recover this party or any of its data.',
    },
    {
      type: 'warning' as const,
      title: 'All party data will be removed',
      message:
        'This includes participants, dishes, and all other associated data.',
    },
  ];

  return (
    <DeleteEntityDialog
      entityId={partyId}
      entityName={partyName}
      entityType="Party"
      deleteEndpoint={`/api/parties/${partyId}`}
      title="Delete Party"
      confirmText="Delete Party"
      cancelText="Cancel"
      requireConfirmation={true}
      warnings={warnings}
      onSuccess={handleSuccess}
      trigger={
        <DeleteButton
          variant="destructive"
          className="h-9 w-9"
          label="Delete party"
        />
      }
    />
  );
}
