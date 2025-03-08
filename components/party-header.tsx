'use client';

import { Badge } from '@/components/ui/badge';
import { CalendarIcon, MapPinIcon, UsersIcon } from 'lucide-react';
import { PartyActions } from '@/components/party-actions';
import { EditPartyDialog } from '@/components/edit-party-dialog';
import { ShareParty } from '@/components/share-party';
import { DeletePartyDialog } from '@/components/delete-party-dialog';
import { Party, Privacy } from '@prisma/client';
import { PrivacySelector } from '@/components/party/privacy/PrivacySelector';
import { JoinRequestList } from '@/components/party/privacy/JoinRequestList';
import { usePartyPrivacyStore } from '@/store/partyPrivacyStore';
import { PartyPrivacyStatus, JoinRequest } from '@/lib/types/party';
import { useEffect } from 'react';

interface PartyHeaderProps {
  party: {
    id: string;
    name: string;
    description: string | null;
    date: Date;
    maxParticipants: number | null;
    privacy: Privacy;
    createdBy: {
      name: string;
    };
  };
  totalParticipants: number;
  hasMaxParticipants: boolean;
  isFull: boolean;
  isAdmin: boolean;
  isParticipant: boolean;
  joinRequests: JoinRequest[];
  userId: string;
}

// Map Prisma Privacy enum to our PartyPrivacyStatus
const mapPrivacyStatus = (privacy: Privacy): PartyPrivacyStatus => {
  switch (privacy) {
    case Privacy.PRIVATE:
      return PartyPrivacyStatus.PRIVATE;
    case Privacy.CLOSED:
      return PartyPrivacyStatus.CLOSED;
    default:
      return PartyPrivacyStatus.PUBLIC;
  }
};

export function PartyHeader({
  party,
  totalParticipants,
  hasMaxParticipants,
  isFull,
  isAdmin,
  isParticipant,
  joinRequests,
  userId,
}: PartyHeaderProps) {
  const {
    initializeJoinRequests,
    setPartyParticipants,
    setPartyPrivacy,
    setPartyAdmin,
  } = usePartyPrivacyStore();

  // Initialize privacy settings and join requests
  useEffect(() => {
    setPartyPrivacy(party.id, party.privacy);
    initializeJoinRequests(party.id, joinRequests);
  }, [
    party.id,
    party.privacy,
    joinRequests,
    initializeJoinRequests,
    setPartyPrivacy,
  ]);

  // Initialize participants and admin in the privacy store
  useEffect(() => {
    setPartyParticipants(party.id, isParticipant ? [userId] : []);
    if (isAdmin) {
      setPartyAdmin(party.id, userId);
    }
  }, [
    party.id,
    isParticipant,
    isAdmin,
    userId,
    setPartyParticipants,
    setPartyAdmin,
  ]);

  return (
    <div className="flex flex-col gap-4 bg-card rounded-xl p-4 sm:p-6 shadow-sm border">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {party.name}
            </h1>
            <PrivacySelector
              partyId={party.id}
              currentStatus={party.privacy}
              isHost={isAdmin}
            />
          </div>
          <p className="text-muted-foreground">{party.description}</p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <ShareParty
            partyId={party.id}
            partyName={party.name}
            isAdmin={isAdmin}
            isParticipant={isParticipant}
          />
          {isAdmin && (
            <>
              <EditPartyDialog party={party as any} />
              <DeletePartyDialog partyId={party.id} partyName={party.name} />
            </>
          )}
          <PartyActions
            partyId={party.id}
            partyName={party.name}
            isParticipant={isParticipant}
            isFull={isFull}
            isAdmin={isAdmin}
            maxParticipants={party.maxParticipants}
            currentParticipants={totalParticipants}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>
              {new Date(party.date).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
            <span>
              {totalParticipants} participant
              {totalParticipants !== 1 && 's'}
              {hasMaxParticipants && ` / ${party.maxParticipants}`}
            </span>
            {isFull && (
              <Badge variant="destructive" className="ml-2">
                Full
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPinIcon className="h-4 w-4 text-muted-foreground" />
            <span>Hosted by {party.createdBy.name}</span>
          </div>
        </div>
      </div>

      {/* Show join requests for non-public parties and admins */}
      {party.privacy !== Privacy.PUBLIC && isAdmin && (
        <div className="mt-4">
          <JoinRequestList partyId={party.id} isHost={isAdmin} />
        </div>
      )}
    </div>
  );
}
