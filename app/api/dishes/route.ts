import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

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
})

// GET all dishes
export async function GET() {
  try {
    const dishes = await prisma.dish.findMany({
      orderBy: {
        name: 'asc',
      },
    })
    return NextResponse.json(dishes)
  } catch (error) {
    console.error('Error fetching dishes:', error)
    return NextResponse.json(
      { error: 'Error fetching dishes' },
      { status: 500 }
    )
  }
}

// CREATE a new dish
export async function POST(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get the user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user || user.role !== 'ADMIN') {
      return new NextResponse('Only admins can create dishes', { status: 403 })
    }

    const body = await req.json()
    const validatedData = dishSchema.parse(body)

    // Check if dish already exists
    const existingDish = await prisma.dish.findUnique({
      where: { name: validatedData.name },
    })

    if (existingDish) {
      return NextResponse.json(
        { error: 'A dish with this name already exists' },
        { status: 400 }
      )
    }

    const dish = await prisma.dish.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || '',
        imageUrl: validatedData.imageUrl || null,
        unit: validatedData.unit,
      },
    })

    return NextResponse.json(dish)
  } catch (error) {
    console.error('Error creating dish:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
