'use client';

import { Badge } from '@/components/ui/badge';
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  LockIcon,
  GlobeIcon,
  UserIcon,
} from 'lucide-react';
import { PartyActions } from '@/components/party-actions';
import { EditPartyDialog } from '@/components/edit-party-dialog';
import { ShareParty } from '@/components/share-party';
import { DeletePartyDialog } from '@/components/delete-party-dialog';
import { Party, Privacy } from '@prisma/client';

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
}

const getPrivacyIcon = (privacy: Privacy) => {
  switch (privacy) {
    case Privacy.PRIVATE:
      return <LockIcon className="h-4 w-4" />;
    case Privacy.CLOSED:
      return <UserIcon className="h-4 w-4" />;
    default:
      return <GlobeIcon className="h-4 w-4" />;
  }
};

const getPrivacyLabel = (privacy: Privacy) => {
  switch (privacy) {
    case Privacy.PRIVATE:
      return 'Private';
    case Privacy.CLOSED:
      return 'Closed';
    default:
      return 'Public';
  }
};

export function PartyHeader({
  party,
  totalParticipants,
  hasMaxParticipants,
  isFull,
  isAdmin,
  isParticipant,
}: PartyHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-card rounded-xl p-6 shadow-sm border">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {party.name}
          </h1>
          <Badge variant="outline" className="flex items-center gap-1">
            {getPrivacyIcon(party.privacy)}
            {getPrivacyLabel(party.privacy)}
          </Badge>
        </div>
        <p className="text-muted-foreground">{party.description}</p>
        <div className="flex flex-wrap gap-4 pt-2">
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
      <div className="flex items-center gap-2 self-start mt-4 sm:mt-0">
        <ShareParty partyId={party.id} partyName={party.name} />
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
        />
      </div>
    </div>
  );
}
