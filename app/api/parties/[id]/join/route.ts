import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const joinSchema = z.object({
  numGuests: z.number().min(0, 'Number of guests cannot be negative'),
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
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = joinSchema.parse(body);

    // Get party and check if it exists
    const party = await prisma.party.findUnique({
      where: { id: params.id },
      include: {
        participants: true,
      },
    });

    if (!party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 });
    }

    // Check if party is full
    if (party.maxParticipants !== null) {
      const totalParticipants = party.participants.reduce(
        (sum, p) => sum + 1 + p.numGuests,
        0
      );
      const wouldExceedMax =
        totalParticipants + 1 + validatedData.numGuests > party.maxParticipants;

      if (wouldExceedMax) {
        return NextResponse.json(
          { error: 'Party has reached maximum participants' },
          { status: 400 }
        );
      }
    }

    // Check if user is already a participant
    const existingParticipant = await prisma.partyParticipant.findUnique({
      where: {
        userId_partyId: {
          userId: user.id,
          partyId: party.id,
        },
      },
    });

    if (existingParticipant) {
      return NextResponse.json(
        { error: 'Already joined this party' },
        { status: 400 }
      );
    }

    // Join the party
    const participant = await prisma.partyParticipant.create({
      data: {
        userId: user.id,
        partyId: party.id,
        numGuests: validatedData.numGuests,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(participant);
  } catch (error) {
    console.error('Error joining party:', error);
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
