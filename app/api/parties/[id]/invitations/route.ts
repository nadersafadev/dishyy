import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import crypto from 'crypto';

const createInvitationSchema = z.object({
  maxUses: z.number().min(1).optional(),
  expiresAt: z.string().datetime().optional(),
  name: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get the user's ID from our database
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const body = await req.json();
    const validatedData = createInvitationSchema.parse(body);

    // Check if user owns the party
    const party = await prisma.party.findUnique({
      where: {
        id: params.id,
        createdById: user.id,
      },
    });

    if (!party) {
      return new NextResponse('Party not found or unauthorized', {
        status: 404,
      });
    }

    const invitation = await prisma.partyInvitation.create({
      data: {
        partyId: params.id,
        token: crypto.randomBytes(32).toString('hex'),
        maxUses: validatedData.maxUses ?? 1,
        expiresAt: validatedData.expiresAt
          ? new Date(validatedData.expiresAt)
          : null,
        name: validatedData.name || null,
      },
    });

    return NextResponse.json(invitation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid request data', { status: 400 });
    }
    console.error('[PARTY_INVITATION_CREATE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get the user's ID from our database
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Check if user owns the party
    const party = await prisma.party.findUnique({
      where: {
        id: params.id,
        createdById: user.id,
      },
    });

    if (!party) {
      return new NextResponse('Party not found or unauthorized', {
        status: 404,
      });
    }

    const invitations = await prisma.partyInvitation.findMany({
      where: {
        partyId: params.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(invitations);
  } catch (error) {
    console.error('[PARTY_INVITATIONS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
