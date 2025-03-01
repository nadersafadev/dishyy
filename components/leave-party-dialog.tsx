'use client';

import { useRouter } from 'next/navigation';
import { DeleteEntityDialog } from '@/components/ui/delete-entity-dialog';
import { toast } from 'sonner';

interface LeavePartyDialogProps {
  // Required props
  partyId: string;
  partyName: string;
  // Optional props
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function LeavePartyDialog({
  partyId,
  partyName,
  trigger,
  open,
  onOpenChange,
}: LeavePartyDialogProps) {
  const router = useRouter();

  const handleSuccess = () => {
    toast.success('Successfully left the party');
    router.refresh();
  };

  // Custom warning message
  const warnings = [
    {
      type: 'info' as const,
      title: 'You can rejoin later',
      message: "You can always join again later if there's still space.",
    },
  ];

  return (
    <DeleteEntityDialog
      entityId={partyId}
      entityName={partyName}
      entityType="Party"
      deleteEndpoint={`/api/parties/${partyId}/leave`}
      title="Leave Party"
      confirmText="Leave Party"
      cancelText="Cancel"
      warnings={warnings}
      onSuccess={handleSuccess}
      open={open}
      onOpenChange={onOpenChange}
      trigger={trigger}
    />
  );
}
