'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Check, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';

interface Invitation {
  id: string;
  token: string;
  maxUses: number;
  currentUses: number;
  expiresAt: string | null;
  createdAt: string;
}

interface InvitationListProps {
  partyId: string;
}

export function InvitationList({ partyId }: InvitationListProps) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchInvitations();
  }, [partyId]);

  async function fetchInvitations() {
    try {
      const response = await fetch(`/api/parties/${partyId}/invitations`);
      if (!response.ok) {
        throw new Error('Failed to fetch invitations');
      }
      const data = await response.json();
      setInvitations(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load invitations',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function copyInvitationLink(token: string) {
    try {
      const invitationUrl = `${window.location.origin}/invite/${token}`;
      await navigator.clipboard.writeText(invitationUrl);
      setCopiedToken(token);
      toast({
        title: 'Success',
        description: 'Invitation link copied to clipboard!',
      });
      setTimeout(() => setCopiedToken(null), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy link',
        variant: 'destructive',
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No invitations created yet.
      </div>
    );
  }

  const displayedInvitations = showAll ? invitations : invitations.slice(0, 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Invitations</h3>
        {invitations.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-muted-foreground hover:text-foreground hover:bg-transparent hover:ring-0 p-0 h-auto font-normal"
          >
            {showAll ? (
              <>
                Show Less
                <ChevronUp className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Show All ({invitations.length})
                <ChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>

      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Created</TableHead>
              <TableHead>Uses</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedInvitations.map(invitation => (
              <TableRow key={invitation.id}>
                <TableCell>
                  {format(new Date(invitation.createdAt), 'PPP')}
                </TableCell>
                <TableCell>
                  <span className="font-medium">{invitation.currentUses}</span>
                  <span className="text-muted-foreground">
                    {' '}
                    / {invitation.maxUses}
                  </span>
                </TableCell>
                <TableCell>
                  {invitation.expiresAt
                    ? format(new Date(invitation.expiresAt), 'PPP')
                    : 'Never'}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyInvitationLink(invitation.token)}
                    className="hover:bg-transparent hover:ring-0"
                  >
                    {copiedToken === invitation.token ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="sm:hidden space-y-4">
        {displayedInvitations.map(invitation => (
          <Card key={invitation.id}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(invitation.createdAt), 'PPP')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyInvitationLink(invitation.token)}
                    className="hover:bg-transparent hover:ring-0"
                  >
                    {copiedToken === invitation.token ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Uses</p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">
                      {invitation.currentUses}
                    </span>
                    {' / '}
                    {invitation.maxUses}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Expires</p>
                  <p className="text-sm text-muted-foreground">
                    {invitation.expiresAt
                      ? format(new Date(invitation.expiresAt), 'PPP')
                      : 'Never'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
