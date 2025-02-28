import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const dishSchema = z.object({
  name: z.string().min(1, 'Dish name is required'),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  unit: z.enum([
    'GRAMS',
    'KILOS',
    'QUANTITY',
    'MILLILITERS',
    'LITERS',
    'PIECES',
  ]),
});

// GET a single dish
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const dish = await prisma.dish.findUnique({
      where: { id: params.id },
    });

    if (!dish) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 });
    }

    return NextResponse.json(dish);
  } catch (error) {
    console.error('Error fetching dish:', error);
    return NextResponse.json({ error: 'Error fetching dish' }, { status: 500 });
  }
}

// UPDATE a dish
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

    if (!user || user.role !== 'ADMIN') {
      return new NextResponse('Only admins can update dishes', { status: 403 });
    }

    const body = await req.json();
    const validatedData = dishSchema.parse(body);

    // Check if new name conflicts with existing dish
    if (validatedData.name) {
      const existingDish = await prisma.dish.findFirst({
        where: {
          name: validatedData.name,
          NOT: {
            id: params.id,
          },
        },
      });

      if (existingDish) {
        return NextResponse.json(
          { error: 'A dish with this name already exists' },
          { status: 400 }
        );
      }
    }

    const updatedDish = await prisma.dish.update({
      where: { id: params.id },
      data: {
        name: validatedData.name,
        description: validatedData.description || '',
        imageUrl: validatedData.imageUrl || null,
        unit: validatedData.unit,
      },
    });

    return NextResponse.json(updatedDish);
  } catch (error) {
    console.error('Error updating dish:', error);
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

// DELETE a dish
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

    if (!user || user.role !== 'ADMIN') {
      return new NextResponse('Only admins can delete dishes', { status: 403 });
    }

    // Check if dish is being used in any parties
    const dishInUse = await prisma.partyDish.findFirst({
      where: { dishId: params.id },
    });

    if (dishInUse) {
      return NextResponse.json(
        { error: 'Cannot delete a dish that is being used in parties' },
        { status: 400 }
      );
    }

    // Get the dish to delete (to get the image ID if exists)
    const dish = await prisma.dish.findUnique({
      where: { id: params.id },
    });

    if (!dish) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 });
    }

    await prisma.dish.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting dish:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
