import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Add schema for updating contribution
const updateContributionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
});

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; contributionId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Fetch the contribution to check if it exists and belongs to the user
    const contribution = await prisma.participantDishContribution.findUnique({
      where: {
        id: params.contributionId,
      },
      include: {
        participant: {
          include: {
            party: true,
            user: true,
          },
        },
        dish: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!contribution) {
      return NextResponse.json(
        { error: 'Contribution not found' },
        { status: 404 }
      );
    }

    // Check if the contribution is in the requested party
    if (contribution.participant.partyId !== params.id) {
      return NextResponse.json(
        { error: 'Contribution does not belong to this party' },
        { status: 400 }
      );
    }

    // Get the party to check admin
    const party = await prisma.party.findUnique({
      where: {
        id: params.id,
      },
      select: {
        createdById: true,
      },
    });

    if (!party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 });
    }

    // Check if the user is the owner of the contribution or the party admin
    const isPartyAdmin = party.createdById === user.id;
    const isContributionOwner = contribution.participant.userId === user.id;

    if (!isPartyAdmin && !isContributionOwner) {
      return NextResponse.json(
        { error: 'Not authorized to delete this contribution' },
        { status: 403 }
      );
    }

    // Delete the contribution
    await prisma.participantDishContribution.delete({
      where: {
        id: params.contributionId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting contribution:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add PATCH method to update a contribution
export async function PATCH(
  req: Request,
  { params }: { params: { id: string; contributionId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Parse and validate the request body
    const body = await req.json();
    const validatedData = updateContributionSchema.parse(body);

    // Fetch the contribution to check if it exists and belongs to the user
    const contribution = await prisma.participantDishContribution.findUnique({
      where: {
        id: params.contributionId,
      },
      include: {
        participant: {
          include: {
            party: {
              include: {
                dishes: {
                  where: {
                    dishId: { equals: undefined }, // Will be set with actual dishId below
                  },
                  include: {
                    dish: true,
                  },
                },
                participants: true,
              },
            },
          },
        },
        dish: true,
      },
    });

    if (!contribution) {
      return NextResponse.json(
        { error: 'Contribution not found' },
        { status: 404 }
      );
    }

    // Check if the contribution is in the requested party
    if (contribution.participant.partyId !== params.id) {
      return NextResponse.json(
        { error: 'Contribution does not belong to this party' },
        { status: 400 }
      );
    }

    // Check if the user owns this contribution
    if (contribution.participant.userId !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to update this contribution' },
        { status: 403 }
      );
    }

    // Now that we have the dishId, fetch the party dish and all contributions for calculations
    const partyDish = await prisma.partyDish.findUnique({
      where: {
        partyId_dishId: {
          partyId: params.id,
          dishId: contribution.dishId,
        },
      },
    });

    if (!partyDish) {
      return NextResponse.json(
        { error: 'Dish not found in party' },
        { status: 404 }
      );
    }

    // Get all participants in this party
    const participants = await prisma.partyParticipant.findMany({
      where: {
        partyId: params.id,
      },
    });

    // Calculate the total participants (including guests)
    const totalParticipants = participants.reduce(
      (sum, p) => sum + 1 + p.numGuests,
      0
    );

    // Get all contributions for this dish in the party except the current one
    const otherContributions =
      await prisma.participantDishContribution.findMany({
        where: {
          participant: {
            partyId: params.id,
          },
          dishId: contribution.dishId,
          id: {
            not: params.contributionId,
          },
        },
      });

    // Calculate total already contributed by others
    const totalContributedByOthers = otherContributions.reduce(
      (sum, c) => sum + c.amount,
      0
    );

    // Calculate how much is needed total for this dish
    const totalNeeded = partyDish.amountPerPerson * totalParticipants;

    // Check if the new amount would exceed the maximum needed
    const newTotalContributed = totalContributedByOthers + validatedData.amount;

    if (newTotalContributed > totalNeeded) {
      return NextResponse.json(
        {
          error: `Your contribution would exceed the needed amount. Maximum you can contribute is ${(
            totalNeeded - totalContributedByOthers
          ).toFixed(1)} ${contribution.dish.unit.toLowerCase()}`,
        },
        { status: 400 }
      );
    }

    // Update the contribution
    const updatedContribution = await prisma.participantDishContribution.update(
      {
        where: {
          id: params.contributionId,
        },
        data: {
          amount: validatedData.amount,
        },
        include: {
          dish: true,
        },
      }
    );

    return NextResponse.json(updatedContribution);
  } catch (error) {
    console.error('Error updating contribution:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
