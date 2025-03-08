import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; requestId: string } }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { status } = await req.json();

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return new NextResponse('Invalid status', { status: 400 });
    }

    // Get the user's database ID
    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!dbUser) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Check if the user is the party host
    const party = await prisma.party.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        createdById: true,
        maxParticipants: true,
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    if (!party) {
      return new NextResponse('Party not found', { status: 404 });
    }

    if (party.createdById !== dbUser.id) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Get the join request
    const joinRequest = await prisma.joinRequest.findUnique({
      where: { id: params.requestId },
      select: {
        id: true,
        userId: true,
        status: true,
        numGuests: true,
      },
    });

    if (!joinRequest) {
      return new NextResponse('Join request not found', { status: 404 });
    }

    if (joinRequest.status !== 'PENDING') {
      return new NextResponse('Join request already processed', {
        status: 400,
      });
    }

    // If approving, check if party has enough capacity for the user and their guests
    if (status === 'APPROVED') {
      const totalNewParticipants = 1 + joinRequest.numGuests; // User + guests
      if (
        party.maxParticipants &&
        party._count.participants + totalNewParticipants > party.maxParticipants
      ) {
        return new NextResponse(
          'Party does not have enough capacity for you and your guests',
          { status: 400 }
        );
      }
    }

    // Update the join request status
    const updatedRequest = await prisma.joinRequest.update({
      where: { id: params.requestId },
      data: { status },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // If approved, add the user as a participant
    if (status === 'APPROVED') {
      await prisma.partyParticipant.create({
        data: {
          userId: joinRequest.userId,
          partyId: party.id,
          numGuests: joinRequest.numGuests,
        },
      });

      // Create a notification for the user
      await prisma.notification.create({
        data: {
          userId: joinRequest.userId,
          type: 'JOIN_REQUEST_APPROVED',
          title: 'Join Request Approved',
          message: `Your request to join the party has been approved!${
            joinRequest.numGuests > 0
              ? ` You will be joined with ${joinRequest.numGuests} guest${
                  joinRequest.numGuests > 1 ? 's' : ''
                }.`
              : ''
          }`,
          data: {
            partyId: party.id,
          },
        },
      });
    } else if (status === 'REJECTED') {
      // Create a notification for the user
      await prisma.notification.create({
        data: {
          userId: joinRequest.userId,
          type: 'JOIN_REQUEST_REJECTED',
          title: 'Join Request Rejected',
          message: `Your request to join the party has been rejected.`,
          data: {
            partyId: party.id,
          },
        },
      });
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('[JOIN_REQUEST_RESPONSE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
