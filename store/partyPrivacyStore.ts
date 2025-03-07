import { create } from 'zustand';
import {
  PartyPrivacyStatus,
  JoinRequest,
  PartyPrivacySettings,
  PARTY_ACCESS_MATRIX,
  PartyAccessControl,
} from '@/lib/types/party';
import { JoinRequestStatus } from '@prisma/client';

interface PartyPrivacyStore {
  // State
  privacySettings: Record<string, PartyPrivacySettings>; // partyId -> settings
  joinRequests: Record<string, JoinRequest[]>; // partyId -> requests
  participants: Record<string, string[]>; // partyId -> userIds
  adminUsers: Record<string, string[]>; // partyId -> userIds

  // Actions
  setPartyPrivacy: (partyId: string, status: PartyPrivacyStatus) => void;
  updatePrivacySettings: (
    partyId: string,
    settings: Partial<PartyPrivacySettings>
  ) => void;
  initializeJoinRequests: (partyId: string, requests: JoinRequest[]) => void;
  addJoinRequest: (request: JoinRequest) => void;
  updateJoinRequest: (
    partyId: string,
    requestId: string,
    updates: Partial<JoinRequest>
  ) => void;
  setPartyParticipants: (partyId: string, userIds: string[]) => void;
  setPartyAdmin: (partyId: string, userId: string) => void;

  // Getters
  getPartyAccess: (partyId: string, userId?: string) => PartyAccessControl;
  getPartyJoinRequests: (partyId: string) => JoinRequest[];
}

export const usePartyPrivacyStore = create<PartyPrivacyStore>((set, get) => ({
  // Initial state
  privacySettings: {},
  joinRequests: {},
  participants: {},
  adminUsers: {},

  // Actions
  setPartyPrivacy: (partyId, status) =>
    set(state => ({
      privacySettings: {
        ...state.privacySettings,
        [partyId]: {
          ...state.privacySettings[partyId],
          status,
        },
      },
    })),

  updatePrivacySettings: (partyId, settings) =>
    set(state => ({
      privacySettings: {
        ...state.privacySettings,
        [partyId]: {
          ...state.privacySettings[partyId],
          ...settings,
        },
      },
    })),

  initializeJoinRequests: (partyId, requests) =>
    set(state => ({
      joinRequests: {
        ...state.joinRequests,
        [partyId]: requests,
      },
    })),

  addJoinRequest: request =>
    set(state => {
      const existingRequests = state.joinRequests[request.partyId] || [];
      // Check if request already exists
      if (existingRequests.some(r => r.id === request.id)) {
        return state;
      }
      return {
        joinRequests: {
          ...state.joinRequests,
          [request.partyId]: [...existingRequests, request],
        },
      };
    }),

  updateJoinRequest: (partyId, requestId, updates) =>
    set(state => ({
      joinRequests: {
        ...state.joinRequests,
        [partyId]:
          state.joinRequests[partyId]?.map(request =>
            request.id === requestId ? { ...request, ...updates } : request
          ) || [],
      },
    })),

  setPartyParticipants: (partyId, userIds) =>
    set(state => ({
      participants: {
        ...state.participants,
        [partyId]: userIds,
      },
    })),

  setPartyAdmin: (partyId, userId) =>
    set(state => ({
      adminUsers: {
        ...state.adminUsers,
        [partyId]: [...(state.adminUsers[partyId] || []), userId],
      },
    })),

  // Getters
  getPartyAccess: (partyId, userId) => {
    const settings = get().privacySettings[partyId];
    const participants = get().participants[partyId] || [];
    const admins = get().adminUsers[partyId] || [];

    // If user is an admin, they get full access regardless of participant status
    if (userId && admins.includes(userId)) {
      return {
        canViewParty: true,
        canJoinDirectly: true,
        canViewParticipants: true,
        canViewDishes: true,
        canViewAmountPerPerson: true,
      };
    }

    // If user is a participant, they get full access regardless of privacy settings
    if (userId && participants.includes(userId)) {
      return {
        canViewParty: true,
        canJoinDirectly: false, // Already a participant
        canViewParticipants: true,
        canViewDishes: true,
        canViewAmountPerPerson: true,
      };
    }

    // Default to most restrictive if no settings
    if (!settings) return PARTY_ACCESS_MATRIX[PartyPrivacyStatus.PRIVATE];
    return PARTY_ACCESS_MATRIX[settings.status];
  },

  getPartyJoinRequests: partyId => {
    return get().joinRequests[partyId] || [];
  },
}));
