import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { JoinRequestStatus } from '@prisma/client';

// Schema for request validation
const requestSchema = z.object({
  message: z.string().optional(),
  numGuests: z.number().int().min(0).default(0),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate party ID
    if (!params.id) {
      return NextResponse.json(
        { error: 'Party ID is required' },
        { status: 400 }
      );
    }

    // Authenticate user
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    let requestData;
    try {
      const body = await req.json();
      requestData = requestSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid request data', details: error.errors },
          { status: 400 }
        );
      }
      console.error('[JOIN_REQUEST] Request parsing error:', error);
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true, name: true },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User account not found' },
        { status: 404 }
      );
    }

    // Get party and check if it exists
    const party = await prisma.party.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        createdById: true,
        privacy: true,
        maxParticipants: true,
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    if (!party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 });
    }

    // Check if user is trying to join their own party
    if (party.createdById === dbUser.id) {
      return NextResponse.json(
        { error: 'Cannot request to join your own party' },
        { status: 400 }
      );
    }

    // Check if party has enough capacity for the user and their guests
    const totalNewParticipants = 1 + requestData.numGuests; // User + guests
    if (
      party.maxParticipants &&
      party._count.participants + totalNewParticipants > party.maxParticipants
    ) {
      return NextResponse.json(
        {
          error: 'Party does not have enough capacity for you and your guests',
        },
        { status: 400 }
      );
    }

    // Check if user is already a participant
    const existingParticipant = await prisma.partyParticipant.findUnique({
      where: {
        userId_partyId: {
          userId: dbUser.id,
          partyId: party.id,
        },
      },
    });

    if (existingParticipant) {
      return NextResponse.json(
        { error: 'Already a participant in this party' },
        { status: 400 }
      );
    }

    // Check for any pending requests
    const pendingRequest = await prisma.joinRequest.findFirst({
      where: {
        userId: dbUser.id,
        partyId: party.id,
        status: JoinRequestStatus.PENDING,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (pendingRequest) {
      return NextResponse.json(
        { error: 'Already have a pending join request' },
        { status: 400 }
      );
    }

    // Create new join request
    const joinRequest = await prisma.joinRequest.create({
      data: {
        userId: dbUser.id,
        partyId: party.id,
        message: requestData.message,
        numGuests: requestData.numGuests,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // Create a notification for the host
    await prisma.notification.create({
      data: {
        userId: party.createdById,
        type: 'NEW_JOIN_REQUEST',
        title: 'New Join Request',
        message: `${dbUser.name} has requested to join ${party.name}${
          requestData.message ? `: "${requestData.message}"` : ''
        }${requestData.numGuests > 0 ? ` with ${requestData.numGuests} guest${requestData.numGuests > 1 ? 's' : ''}` : ''}`,
        data: {
          partyId: party.id,
          requestId: joinRequest.id,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: joinRequest,
      message: 'Join request submitted successfully',
    });
  } catch (error) {
    console.error('[JOIN_REQUEST] Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}
