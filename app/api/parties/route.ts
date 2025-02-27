import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const partySchema = z.object({
  name: z.string().min(1, 'Party name is required'),
  description: z.string().optional(),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid date',
  }),
  maxParticipants: z.number().min(1).optional(),
  dishes: z
    .array(
      z.object({
        dishId: z.string(),
        amountPerPerson: z.number().positive('Amount must be greater than 0'),
      })
    )
    .min(1, 'At least one dish is required'),
});

// GET all parties
export async function GET() {
  try {
    const parties = await prisma.party.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(parties);
  } catch (error) {
    console.error('Error fetching parties:', error);
    return NextResponse.json(
      { error: 'Error fetching parties' },
      { status: 500 }
    );
  }
}

// CREATE a new party
export async function POST(req: Request) {
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
    const validatedData = partySchema.parse(body);

    // Verify all dishes exist
    const dishes = await prisma.dish.findMany({
      where: {
        id: {
          in: validatedData.dishes.map(d => d.dishId),
        },
      },
    });

    if (dishes.length !== validatedData.dishes.length) {
      return NextResponse.json(
        { error: 'One or more dishes not found' },
        { status: 400 }
      );
    }

    const party = await prisma.party.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || '',
        date: new Date(validatedData.date),
        maxParticipants: validatedData.maxParticipants,
        createdById: user.id,
        dishes: {
          create: validatedData.dishes.map(({ dishId, amountPerPerson }) => ({
            dish: {
              connect: { id: dishId },
            },
            amountPerPerson,
          })),
        },
      },
      include: {
        createdBy: true,
        dishes: {
          include: {
            dish: true,
          },
        },
      },
    });

    return NextResponse.json(party);
  } catch (error) {
    console.error('Error creating party:', error);
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
