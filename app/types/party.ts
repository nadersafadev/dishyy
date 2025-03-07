import { z } from 'zod';

export const joinSchema = z.object({
  numGuests: z.number().min(0, 'Number of guests cannot be negative'),
});

export type JoinPartyRequest = z.infer<typeof joinSchema>;

export type PartyPrivacyCheckResult = {
  canJoin: boolean;
  invitation?: {
    id: string;
    currentUses: number;
  } | null;
  error?: string;
};
