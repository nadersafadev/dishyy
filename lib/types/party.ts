import { JoinRequestStatus } from '@prisma/client';

export enum PartyPrivacyStatus {
  PUBLIC = 'PUBLIC',
  CLOSED = 'CLOSED',
  PRIVATE = 'PRIVATE',
}

export interface JoinRequest {
  id: string;
  userId: string;
  partyId: string;
  status: JoinRequestStatus;
  message: string | null;
  numGuests: number;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    name: string;
  };
}

export interface PartyPrivacySettings {
  status: PartyPrivacyStatus;
  allowJoinRequests: boolean;
  requireApproval: boolean;
}

export interface PartyAccessControl {
  canViewParty: boolean;
  canJoinDirectly: boolean;
  canViewParticipants: boolean;
  canViewDishes: boolean;
  canViewAmountPerPerson: boolean;
}

// Matrix defining access rights for different privacy statuses
export const PARTY_ACCESS_MATRIX: Record<
  PartyPrivacyStatus,
  PartyAccessControl
> = {
  [PartyPrivacyStatus.PUBLIC]: {
    canViewParty: true,
    canJoinDirectly: true,
    canViewParticipants: true,
    canViewDishes: true,
    canViewAmountPerPerson: true,
  },
  [PartyPrivacyStatus.CLOSED]: {
    canViewParty: true,
    canJoinDirectly: false,
    canViewParticipants: true,
    canViewDishes: true,
    canViewAmountPerPerson: true,
  },
  [PartyPrivacyStatus.PRIVATE]: {
    canViewParty: true,
    canJoinDirectly: false,
    canViewParticipants: false,
    canViewDishes: false,
    canViewAmountPerPerson: false,
  },
};
