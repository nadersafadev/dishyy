import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { joinSchema } from '@/app/types/party';
import { checkPartyPrivacy, checkPartyCapacity } from '@/app/utils/party';
import { z } from 'zod';

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

    // Check privacy and permissions
    const privacyCheck = await checkPartyPrivacy(params.id, user.id);
    if (!privacyCheck.canJoin) {
      return NextResponse.json({ error: privacyCheck.error }, { status: 403 });
    }

    // Check party capacity
    const capacityCheck = await checkPartyCapacity(
      params.id,
      validatedData.numGuests
    );
    if (!capacityCheck.canJoin) {
      return NextResponse.json({ error: capacityCheck.error }, { status: 400 });
    }

    // Check if user is already a participant
    const existingParticipant = await prisma.partyParticipant.findUnique({
      where: {
        userId_partyId: {
          userId: user.id,
          partyId: params.id,
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
        partyId: params.id,
        numGuests: validatedData.numGuests,
      },
      include: {
        user: true,
      },
    });

    // Update invitation usage if applicable
    if (privacyCheck.invitation) {
      await prisma.partyInvitation.update({
        where: { id: privacyCheck.invitation.id },
        data: {
          currentUses: { increment: 1 },
        },
      });
    }

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
