import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const acceptInvitationSchema = z.object({
  numGuests: z.number().min(0),
  message: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: { token: string } }
) {
  console.log('[INVITATION_ACCEPT] Received request for token:', params.token);

  try {
    const { userId: clerkId } = await auth();
    console.log('[INVITATION_ACCEPT] User ID:', clerkId);

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user's ID from our database
    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    // If user doesn't exist in our database, try to find them by email or create them
    if (!user) {
      console.log(
        '[INVITATION_ACCEPT] User not found by clerkId, checking email'
      );
      const clerkUser = await currentUser();

      if (!clerkUser) {
        return NextResponse.json(
          { error: 'User not found in Clerk' },
          { status: 404 }
        );
      }

      const email = clerkUser.emailAddresses[0]?.emailAddress;
      if (!email) {
        return NextResponse.json(
          { error: 'User email not found' },
          { status: 400 }
        );
      }

      // Try to find existing user by email
      user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        // Update existing user with new clerkId
        console.log(
          '[INVITATION_ACCEPT] Found existing user by email, updating clerkId'
        );
        user = await prisma.user.update({
          where: { id: user.id },
          data: { clerkId },
        });
      } else {
        // Create new user
        console.log('[INVITATION_ACCEPT] Creating new user in database');
        user = await prisma.user.create({
          data: {
            clerkId,
            name: clerkUser.firstName
              ? `${clerkUser.firstName}${clerkUser.lastName ? ` ${clerkUser.lastName}` : ''}`
              : 'Anonymous User',
            email,
          },
        });
      }
    }

    const body = await req.json();
    console.log('[INVITATION_ACCEPT] Request body:', body);

    const validatedData = acceptInvitationSchema.parse(body);

    // Get the invitation with party details
    const invitation = await prisma.partyInvitation.findUnique({
      where: { token: params.token },
      include: {
        party: {
          include: {
            participants: true,
          },
        },
      },
    });

    if (!invitation) {
      console.log('[INVITATION_ACCEPT] Invitation not found');
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    // Check if invitation is expired
    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      console.log('[INVITATION_ACCEPT] Invitation has expired');
      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 400 }
      );
    }

    // Check if invitation has reached max uses
    if (invitation.currentUses >= invitation.maxUses) {
      console.log('[INVITATION_ACCEPT] Invitation has reached maximum uses');
      return NextResponse.json(
        { error: 'Invitation has reached maximum uses' },
        { status: 400 }
      );
    }

    // Check if user is already a participant
    const existingParticipant = await prisma.partyParticipant.findUnique({
      where: {
        userId_partyId: {
          userId: user.id,
          partyId: invitation.partyId,
        },
      },
    });

    if (existingParticipant) {
      console.log('[INVITATION_ACCEPT] User is already a participant');
      return NextResponse.json(
        {
          error: 'You are already a participant in this party',
          type: 'ALREADY_PARTICIPANT',
        },
        { status: 400 }
      );
    }

    // Check party capacity
    const currentParticipants = invitation.party.participants.length;
    const totalGuests = invitation.party.participants.reduce(
      (sum, p) => sum + p.numGuests,
      0
    );
    const newTotalGuests =
      currentParticipants + totalGuests + validatedData.numGuests + 1;

    if (
      invitation.party.maxParticipants &&
      newTotalGuests > invitation.party.maxParticipants
    ) {
      console.log('[INVITATION_ACCEPT] Party has reached maximum capacity');
      return NextResponse.json(
        {
          error: `This party can only accommodate ${invitation.party.maxParticipants} people in total. With your ${validatedData.numGuests + 1} guests, it would exceed the limit.`,
          type: 'CAPACITY_EXCEEDED',
          maxParticipants: invitation.party.maxParticipants,
          currentGuests: validatedData.numGuests + 1,
        },
        { status: 400 }
      );
    }

    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async tx => {
      // Increment the current uses of the invitation
      await tx.partyInvitation.update({
        where: { id: invitation.id },
        data: { currentUses: { increment: 1 } },
      });

      // Add the user as a participant
      const participant = await tx.partyParticipant.create({
        data: {
          userId: user.id,
          partyId: invitation.partyId,
          numGuests: validatedData.numGuests,
        },
      });

      // Update party status if it reaches max capacity
      if (
        invitation.party.maxParticipants &&
        newTotalGuests >= invitation.party.maxParticipants
      ) {
        await tx.party.update({
          where: { id: invitation.partyId },
          data: { status: 'FULL' },
        });
      }

      // If there's a message, create a notification for the host
      if (validatedData.message) {
        await tx.notification.create({
          data: {
            userId: invitation.party.createdById,
            type: 'INVITATION_ACCEPTED',
            title: 'Invitation Accepted',
            message: `${user.name} has accepted your invitation to ${invitation.party.name}${
              validatedData.message
                ? ` with message: "${validatedData.message}"`
                : ''
            }`,
            data: {
              partyId: invitation.partyId,
              participantId: participant.id,
            },
          },
        });
      }

      return participant;
    });

    console.log('[INVITATION_ACCEPT] Successfully added participant');
    return NextResponse.json(result);
  } catch (error) {
    console.error('[INVITATION_ACCEPT] Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
