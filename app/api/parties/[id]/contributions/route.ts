import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const contributionSchema = z.object({
  dishId: z.string().min(1, 'Dish ID is required'),
  amount: z.number().positive('Amount must be positive'),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
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

    // Check if user is a participant in the party
    const participant = await prisma.partyParticipant.findUnique({
      where: {
        userId_partyId: {
          userId: user.id,
          partyId: params.id,
        },
      },
    });

    if (!participant) {
      return new NextResponse(
        'You must be a participant to contribute dishes',
        {
          status: 403,
        }
      );
    }

    const body = await req.json();
    const validatedData = contributionSchema.parse(body);

    // Get the party dish and all current contributions
    const [partyDish, allContributions] = await Promise.all([
      prisma.partyDish.findUnique({
        where: {
          partyId_dishId: {
            partyId: params.id,
            dishId: validatedData.dishId,
          },
        },
        include: {
          party: {
            include: {
              participants: true,
            },
          },
        },
      }),
      prisma.participantDishContribution.findMany({
        where: {
          dishId: validatedData.dishId,
          participant: {
            partyId: params.id,
          },
        },
      }),
    ]);

    if (!partyDish) {
      return NextResponse.json(
        { error: 'Dish not found in party' },
        { status: 404 }
      );
    }

    // Calculate total needed and current contributions
    const totalParticipants = partyDish.party.participants.reduce(
      (sum, p) => sum + 1 + p.numGuests,
      0
    );
    const totalNeeded = partyDish.amountPerPerson * totalParticipants;
    const currentContributions = allContributions.reduce(
      (sum, c) => sum + c.amount,
      0
    );

    // Get the user's current contribution if it exists
    const existingContribution = allContributions.find(
      c => c.participantId === participant.id
    );
    const userCurrentAmount = existingContribution?.amount || 0;

    // Calculate how much more can be contributed
    const remainingNeeded = Math.max(
      0,
      totalNeeded - currentContributions + userCurrentAmount
    );

    // Check if the new contribution would exceed the needed amount
    if (validatedData.amount > remainingNeeded) {
      return NextResponse.json(
        {
          error: `Cannot contribute more than needed. Maximum allowed: ${remainingNeeded.toFixed(
            1
          )}`,
        },
        { status: 400 }
      );
    }

    // Create or update the contribution
    const contribution = await prisma.participantDishContribution.upsert({
      where: {
        participantId_dishId: {
          participantId: participant.id,
          dishId: validatedData.dishId,
        },
      },
      update: {
        amount: validatedData.amount,
      },
      create: {
        participantId: participant.id,
        dishId: validatedData.dishId,
        amount: validatedData.amount,
      },
      include: {
        dish: {
          select: {
            name: true,
            unit: true,
          },
        },
      },
    });

    return NextResponse.json(contribution);
  } catch (error) {
    console.error('Error adding dish contribution:', error);
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

// Get all contributions for a party
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const contributions = await prisma.participantDishContribution.findMany({
      where: {
        participant: {
          partyId: params.id,
        },
      },
      include: {
        participant: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        dish: {
          select: {
            name: true,
            unit: true,
          },
        },
      },
    });

    return NextResponse.json(contributions);
  } catch (error) {
    console.error('Error fetching contributions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
