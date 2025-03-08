import { usePartyPrivacyStore } from '@/store/partyPrivacyStore';
import { JoinRequest } from '@/lib/types/party';
import { JoinRequestStatus } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/lib/toast';

interface JoinRequestListProps {
  partyId: string;
  isHost: boolean;
}

export function JoinRequestList({ partyId, isHost }: JoinRequestListProps) {
  const router = useRouter();
  const { getPartyJoinRequests, updateJoinRequest } = usePartyPrivacyStore();
  const requests = getPartyJoinRequests(partyId).filter(
    request => request.status === JoinRequestStatus.PENDING
  );

  if (!isHost) {
    return null;
  }

  if (requests.length === 0) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground text-center">
          No pending join requests
        </p>
      </Card>
    );
  }

  const handleRequestAction = async (
    requestId: string,
    status: JoinRequestStatus
  ) => {
    try {
      const response = await fetch(
        `/api/parties/${partyId}/join-request/${requestId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update join request');
      }

      // Update local store after successful API call
      updateJoinRequest(partyId, requestId, { status });

      toast.success('Success', `Request ${status.toLowerCase()} successfully`);

      // Refresh the page to update participant status if request was approved
      if (status === JoinRequestStatus.APPROVED) {
        router.refresh();
      }
    } catch (error) {
      toast.error(
        'Error',
        error instanceof Error ? error.message : 'An error occurred'
      );
    }
  };

  return (
    <Card className="p-4">
      <h3 className="font-medium mb-4">Join Requests</h3>
      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {requests.map(request => (
            <JoinRequestItem
              key={request.id}
              request={request}
              onAction={handleRequestAction}
            />
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

interface JoinRequestItemProps {
  request: JoinRequest;
  onAction: (requestId: string, status: JoinRequestStatus) => Promise<void>;
}

function JoinRequestItem({ request, onAction }: JoinRequestItemProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (status: JoinRequestStatus) => {
    setIsLoading(true);
    try {
      await onAction(request.id, status);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-2 border rounded-lg">
      <div className="space-y-1 flex-1 min-w-0">
        <p className="font-medium truncate">
          {request.user?.name || 'Unknown User'}
        </p>
        {request.message && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {request.message}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{new Date(request.createdAt).toLocaleDateString()}</span>
          {request.numGuests > 0 && (
            <span>
              • {request.numGuests} guest{request.numGuests > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-2 ml-4">
        <Button
          size="sm"
          variant="outline"
          className="text-green-600"
          onClick={() => handleAction(JoinRequestStatus.APPROVED)}
          disabled={isLoading}
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-red-600"
          onClick={() => handleAction(JoinRequestStatus.REJECTED)}
          disabled={isLoading}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
