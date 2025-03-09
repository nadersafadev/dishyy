import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { DishesContent } from './party-content';
import { PartyDishAmounts } from '@/components/party-dishes-amounts';
import { generateMetadata as baseGenerateMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { PartyParticipants } from '@/components/party-participants';
import { PartyHeader } from '@/components/party-header';
import { InvitationList } from '@/components/party/invitation-list';
import {
  getPartyDetails,
  getCategories,
  calculatePartyStats,
  enhancePartyWithCategories,
  type PartyWithDetails,
} from '@/lib/services/party';
import { ParticipantContributions } from '@/components/party/ParticipantContributions';

export default async function PartyPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('User ID not found');
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, role: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const party = await getPartyDetails(params.id);

  if (!party) {
    notFound();
  }

  const isHost = party.createdById === user.id;
  const isParticipant = party.participants.some(p => p.userId === user.id);
  const participantIds = party.participants.map(p => p.userId);

  // Get all unique category IDs from dishes
  const categoryIds = [
    ...new Set(party.dishes.map(d => d.dish.categoryId).filter(Boolean)),
  ];

  // Fetch categories and create category map
  const categories = await getCategories(categoryIds);
  const categoryMap = categories.reduce(
    (map, category) => {
      map[category.id] = category;
      return map;
    },
    {} as Record<string, { id: string; name: string; parentId: string | null }>
  );

  // Enhance party data with categories
  const { dishesWithCategories, participantsWithContributions } =
    enhancePartyWithCategories(party, categoryMap);

  // Calculate party stats
  const { totalParticipants, hasMaxParticipants, isFull } =
    calculatePartyStats(party);

  return (
    <div className="mx-auto space-y-8 py-6">
      {/* Header */}
      <PartyHeader
        party={party}
        totalParticipants={totalParticipants}
        hasMaxParticipants={hasMaxParticipants}
        isFull={isFull}
        isAdmin={isHost}
        isParticipant={isParticipant}
        joinRequests={party.joinRequests}
        userId={user.id}
      />

      {/* Two-column layout for content sections */}
      <div className="grid grid-cols-1 md:grid-cols-8 gap-8">
        {/* Left column */}
        <div className="md:col-span-5 space-y-8">
          {/* Amount Per Person Section */}
          <PartyDishAmounts
            dishes={dishesWithCategories}
            isAdmin={isHost}
            userId={user.id}
            partyId={party.id}
            participantIds={participantIds}
          />

          {/* Participant Contributions Section - Only show for participants */}
          {isParticipant && (
            <ParticipantContributions
              participants={participantsWithContributions}
              isParticipant={isParticipant}
              currentUserId={user.id}
              partyId={party.id}
            />
          )}
        </div>

        {/* Right column */}
        <div className="md:col-span-3 space-y-8">
          {/* Participants Section */}
          <PartyParticipants
            participants={participantsWithContributions}
            isAdmin={isHost}
            partyId={party.id}
            currentUserId={user.id}
            participantIds={participantIds}
          />

          {/* Invitation List - Only show for host */}
          {isHost && <InvitationList partyId={party.id} />}
        </div>
      </div>

      {/* Dishes Section - Full Width */}
      <div data-dishes-section>
        <DishesContent
          dishes={dishesWithCategories}
          participants={participantsWithContributions}
          isParticipant={isParticipant}
          totalParticipants={totalParticipants}
          isAdmin={isHost}
          currentUserId={user.id}
          partyId={party.id}
          participantIds={participantIds}
        />
      </div>
    </div>
  );
}

// Generate dynamic metadata for the party page
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const party = await prisma.party.findUnique({
    where: { id: params.id },
    select: { name: true, description: true },
  });

  if (!party) {
    return baseGenerateMetadata(
      'Party Not Found',
      'The requested party could not be found'
    );
  }

  return baseGenerateMetadata(
    party.name,
    party.description || `Details about ${party.name}`
  );
}
