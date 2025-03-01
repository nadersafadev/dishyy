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
  categoryId: z.string().optional().nullable(),
});

// GET all dishes with filtering, sorting and pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination params
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Filtering params
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || undefined;
    const hasCategory = searchParams.get('hasCategory') || undefined;
    const hasImage = searchParams.get('hasImage') || undefined;

    // Sorting params
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Build where clause for filtering
    const where: any = {};

    // Search by name or description
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by category
    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId;
    }

    // Filter by category status
    if (hasCategory === 'true') {
      where.categoryId = { not: null };
    } else if (hasCategory === 'false') {
      where.categoryId = null;
    }

    // Filter by image status
    if (hasImage === 'true') {
      where.imageUrl = { not: null };
    } else if (hasImage === 'false') {
      where.imageUrl = null;
    }

    // Build sort object - validate sortBy to prevent injection
    const validSortFields = ['name', 'createdAt', 'updatedAt', 'usageCount'];
    let orderBy: any = {};

    if (validSortFields.includes(sortBy)) {
      if (sortBy === 'usageCount') {
        // For usage count, we need to use a different approach
        // Get dishes with their counts first, then sort manually
        const dishes = await prisma.dish.findMany({
          where,
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            _count: {
              select: {
                parties: true,
              },
            },
          },
          skip,
          take: limit,
        });

        // Sort the results manually by usage count
        dishes.sort((a, b) => {
          const countA = a._count.parties;
          const countB = b._count.parties;

          if (sortOrder === 'asc') {
            return countA - countB;
          } else {
            return countB - countA;
          }
        });

        // Calculate pagination metadata
        const totalCount = await prisma.dish.count({ where });
        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        return NextResponse.json({
          dishes,
          pagination: {
            page,
            limit,
            totalCount,
            totalPages,
            hasNextPage,
            hasPreviousPage,
          },
        });
      } else {
        orderBy[sortBy] = sortOrder;
      }
    } else {
      // Default sorting
      orderBy.name = 'asc';
    }

    // Get total count for pagination
    const totalCount = await prisma.dish.count({ where });

    // Get dishes with filtering, sorting and pagination
    const dishes = await prisma.dish.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            parties: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      dishes,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    });
  } catch (error) {
    console.error('Error fetching dishes:', error);
    return NextResponse.json(
      { error: 'Error fetching dishes' },
      { status: 500 }
    );
  }
}

// CREATE a new dish
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get the user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user || user.role !== 'ADMIN') {
      return new NextResponse('Only admins can create dishes', { status: 403 });
    }

    const body = await req.json();
    const validatedData = dishSchema.parse(body);

    // Check if dish already exists
    const existingDish = await prisma.dish.findUnique({
      where: { name: validatedData.name },
    });

    if (existingDish) {
      return NextResponse.json(
        { error: 'A dish with this name already exists' },
        { status: 400 }
      );
    }

    // If categoryId is provided, check if the category exists
    if (validatedData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: validatedData.categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 400 }
        );
      }
    }

    const dish = await prisma.dish.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || '',
        imageUrl: validatedData.imageUrl || null,
        unit: validatedData.unit,
        categoryId: validatedData.categoryId || null,
      },
    });

    return NextResponse.json(dish);
  } catch (error) {
    console.error('Error creating dish:', error);
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
