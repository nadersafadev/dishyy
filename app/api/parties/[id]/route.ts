import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Privacy } from '@/lib/enums';

const updatePartySchema = z.object({
  name: z.string().min(1, 'Party name is required'),
  description: z.string().optional(),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid date',
  }),
  maxParticipants: z.number().min(1).nullable(),
  privacy: z.nativeEnum(Privacy).optional(),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const party = await prisma.party.findUnique({
      where: { id: params.id },
      include: {
        createdBy: true,
        dishes: {
          include: {
            dish: true,
          },
        },
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 });
    }

    return NextResponse.json(party);
  } catch (error) {
    console.error('Error fetching party:', error);
    return NextResponse.json(
      { error: 'Error fetching party' },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    const party = await prisma.party.findUnique({
      where: { id: params.id },
      include: {
        createdBy: true,
      },
    });

    if (!party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 });
    }

    if (party.createdById !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You are not authorized to update this party' },
        { status: 403 }
      );
    }

    const body = await req.json();
    console.log('Update party request body:', body);

    try {
      const validatedData = updatePartySchema.parse(body);
      console.log('Validated data:', validatedData);

      // Create update data object, only including fields that are present
      const updateData: any = {
        name: validatedData.name,
        description: validatedData.description || '',
        date: new Date(validatedData.date),
      };

      // Only include maxParticipants if it's provided
      if (validatedData.maxParticipants !== undefined) {
        updateData.maxParticipants = validatedData.maxParticipants;
      }

      // Only include privacy if it's provided
      if (validatedData.privacy !== undefined) {
        updateData.privacy = validatedData.privacy;
      }

      const updatedParty = await prisma.party.update({
        where: { id: params.id },
        data: updateData,
        include: {
          createdBy: true,
          dishes: {
            include: {
              dish: true,
            },
          },
        },
      });

      return NextResponse.json(updatedParty);
    } catch (validationError) {
      console.error('Validation error:', validationError);
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid data', details: validationError.errors },
          { status: 400 }
        );
      }
      throw validationError;
    }
  } catch (error) {
    console.error('Error updating party:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Check if user is the party host or an admin
    const party = await prisma.party.findUnique({
      where: { id: params.id },
      select: { createdById: true },
    });

    if (!party) {
      return new NextResponse('Party not found', { status: 404 });
    }

    if (party.createdById !== user.id && user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    await prisma.party.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting party:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
