import { prisma } from '@/lib/prisma';
import { PartyPrivacyCheckResult } from '@/app/types/party';

export async function checkPartyPrivacy(
  partyId: string,
  userId: string
): Promise<PartyPrivacyCheckResult> {
  const party = await prisma.party.findUnique({
    where: { id: partyId },
    include: {
      joinRequests: {
        where: {
          userId,
          status: 'APPROVED',
        },
      },
    },
  });

  if (!party) {
    return { canJoin: false, error: 'Party not found' };
  }

  if (party.privacy === 'PUBLIC') {
    return { canJoin: true };
  }

  const hasApprovedRequest = party.joinRequests.length > 0;
  const invitation = await prisma.partyInvitation.findFirst({
    where: {
      partyId: party.id,
      currentUses: { lt: prisma.partyInvitation.fields.maxUses },
      OR: [{ expiresAt: { gt: new Date() } }, { expiresAt: null }],
    },
  });

  if (!hasApprovedRequest && !invitation) {
    return {
      canJoin: false,
      error:
        'Not authorized to join this party directly. Please request to join or use an invitation.',
    };
  }

  return { canJoin: true, invitation };
}

export async function checkPartyCapacity(
  partyId: string,
  additionalGuests: number
): Promise<{ canJoin: boolean; error?: string }> {
  const party = await prisma.party.findUnique({
    where: { id: partyId },
    include: {
      participants: true,
    },
  });

  if (!party) {
    return { canJoin: false, error: 'Party not found' };
  }

  if (party.maxParticipants === null) {
    return { canJoin: true };
  }

  const totalParticipants = party.participants.reduce(
    (sum, p) => sum + 1 + p.numGuests,
    0
  );
  const wouldExceedMax =
    totalParticipants + 1 + additionalGuests > party.maxParticipants;

  if (wouldExceedMax) {
    return { canJoin: false, error: 'Party has reached maximum participants' };
  }

  return { canJoin: true };
}
