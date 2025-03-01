import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

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

    if (!isContributionOwner && !isPartyAdmin) {
      return NextResponse.json(
        {
          error:
            'You can only delete your own contributions or as a party admin',
        },
        { status: 403 }
      );
    }

    // Delete the contribution
    await prisma.participantDishContribution.delete({
      where: {
        id: params.contributionId,
      },
    });

    return NextResponse.json({
      message: 'Contribution successfully deleted',
      dishName: contribution.dish.name,
    });
  } catch (error) {
    console.error('Error deleting contribution:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
