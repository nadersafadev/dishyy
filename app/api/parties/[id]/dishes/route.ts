import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const addDishSchema = z.object({
  dishId: z.string().min(1, 'Dish ID is required'),
  amountPerPerson: z
    .number()
    .min(0.1, 'Amount per person must be greater than 0'),
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

    if (!user || user.role !== 'ADMIN') {
      return new NextResponse('Only admins can add dishes to parties', {
        status: 403,
      });
    }

    const body = await req.json();
    const validatedData = addDishSchema.parse(body);

    // Check if party exists
    const party = await prisma.party.findUnique({
      where: { id: params.id },
      include: {
        dishes: true,
      },
    });

    if (!party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 });
    }

    // Check if dish is already in party
    const existingDish = party.dishes.find(
      d => d.dishId === validatedData.dishId
    );
    if (existingDish) {
      return NextResponse.json(
        { error: 'This dish is already in the party' },
        { status: 400 }
      );
    }

    // Add dish to party
    const partyDish = await prisma.partyDish.create({
      data: {
        partyId: params.id,
        dishId: validatedData.dishId,
        amountPerPerson: validatedData.amountPerPerson,
      },
      include: {
        dish: true,
      },
    });

    return NextResponse.json(partyDish);
  } catch (error) {
    console.error('Error adding dish to party:', error);
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
