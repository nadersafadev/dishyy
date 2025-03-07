'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Share2, Copy, Mail, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InvitationForm } from '@/components/party/invitation-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePartyPrivacyStore } from '@/store/partyPrivacyStore';
import { PartyPrivacyStatus } from '@/lib/types/party';

interface SharePartyProps {
  partyId: string;
  partyName: string;
  isAdmin?: boolean;
  isParticipant?: boolean;
}

export function ShareParty({
  partyId,
  partyName,
  isAdmin = false,
  isParticipant = false,
}: SharePartyProps) {
  const { toast } = useToast();
  const { getPartyAccess } = usePartyPrivacyStore();
  const access = getPartyAccess(partyId);

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/parties/${partyId}`;
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Link copied!',
        description: 'Party link has been copied to your clipboard.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy link to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const handleWhatsAppShare = () => {
    const url = `${window.location.origin}/parties/${partyId}`;
    const text = `Join my party: ${partyName}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      '_blank'
    );
  };

  const handleEmailShare = () => {
    const url = `${window.location.origin}/parties/${partyId}`;
    const subject = `Join my party: ${partyName}`;
    const body = `I've invited you to join my party! Click the link below to join:\n\n${url}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  // Show share button for admins (always), participants, or if the party can be joined directly
  if (!isAdmin && !isParticipant && !access.canJoinDirectly) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 focus:ring-0"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem
            onClick={handleCopyLink}
            className="gap-2 cursor-pointer focus:bg-accent focus:text-accent-foreground"
          >
            <Copy className="h-4 w-4" />
            Copy Link
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleWhatsAppShare}
            className="gap-2 cursor-pointer focus:bg-accent focus:text-accent-foreground"
          >
            <svg
              className="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleEmailShare}
            className="gap-2 cursor-pointer focus:bg-accent focus:text-accent-foreground"
          >
            <Mail className="h-4 w-4" />
            Email
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Show invitation creation button for admins only */}
      {isAdmin && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 focus:ring-0"
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Invitation Link</DialogTitle>
            </DialogHeader>
            <InvitationForm partyId={partyId} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
