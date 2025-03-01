import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateGuestsSchema = z.object({
  numGuests: z.number().min(0, 'Number of guests cannot be negative'),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; participantId: string } }
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
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse and validate the request body
    const body = await req.json();
    const validatedData = updateGuestsSchema.parse(body);

    // Fetch the participant to check if it exists
    const participant = await prisma.partyParticipant.findUnique({
      where: {
        id: params.participantId,
      },
      include: {
        party: {
          include: {
            participants: true,
          },
        },
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }

    // Check if the participant is in the requested party
    if (participant.partyId !== params.id) {
      return NextResponse.json(
        { error: 'Participant does not belong to this party' },
        { status: 400 }
      );
    }

    // Check if user is updating their own guests or if they are an admin
    const isAdmin = user.role === 'ADMIN';
    const isOwn = participant.userId === user.id;

    if (!isOwn && !isAdmin) {
      return NextResponse.json(
        { error: 'Not authorized to update guests for this participant' },
        { status: 403 }
      );
    }

    // Check if the party has a maximum participant limit
    if (participant.party.maxParticipants !== null) {
      // Calculate total participants with the new guest count
      const currentGuestCount = participant.numGuests;
      const guestDiff = validatedData.numGuests - currentGuestCount;

      const totalParticipantsAfterUpdate =
        participant.party.participants.reduce(
          (sum, p) =>
            sum +
            1 +
            (p.id === participant.id ? validatedData.numGuests : p.numGuests),
          0
        );

      if (totalParticipantsAfterUpdate > participant.party.maxParticipants) {
        return NextResponse.json(
          {
            error: `Cannot add more guests. The party has a limit of ${participant.party.maxParticipants} participants.`,
          },
          { status: 400 }
        );
      }
    }

    // Update the participant's number of guests
    const updatedParticipant = await prisma.partyParticipant.update({
      where: {
        id: params.participantId,
      },
      data: {
        numGuests: validatedData.numGuests,
      },
    });

    return NextResponse.json(updatedParticipant);
  } catch (error) {
    console.error('Error updating participant guests:', error);

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
