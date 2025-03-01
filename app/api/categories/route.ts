import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  parentId: z.string().optional().nullable(),
});

// Query params validation schema
const getCategoriesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z
    .enum(['name', 'createdAt', 'updatedAt', 'dishCount'])
    .default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  search: z.string().optional(),
  parentId: z.string().optional(),
  hasParent: z.enum(['true', 'false']).optional(),
  hasDishes: z.enum(['true', 'false']).optional(),
});

// GET categories with pagination, sorting, and filtering
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    // Parse and validate query params
    const queryParams = getCategoriesQuerySchema.parse({
      page: url.searchParams.get('page') || 1,
      limit: url.searchParams.get('limit') || 20,
      sortBy: url.searchParams.get('sortBy') || 'name',
      sortOrder: url.searchParams.get('sortOrder') || 'asc',
      search: url.searchParams.get('search') || undefined,
      parentId: url.searchParams.get('parentId') || undefined,
      hasParent: url.searchParams.get('hasParent') || undefined,
      hasDishes: url.searchParams.get('hasDishes') || undefined,
    });

    // Calculate pagination
    const skip = (queryParams.page - 1) * queryParams.limit;

    // Build where conditions for filtering
    const whereConditions: any = {};

    // Search by name
    if (queryParams.search) {
      whereConditions.name = {
        contains: queryParams.search,
        mode: 'insensitive', // Case-insensitive search
      };
    }

    // Filter by parentId
    if (queryParams.parentId) {
      whereConditions.parentId = queryParams.parentId;
    }

    // Filter by hasParent
    if (queryParams.hasParent) {
      whereConditions.parentId =
        queryParams.hasParent === 'true' ? { not: null } : null;
    }

    // Filter by hasDishes (need to use a separate function for this)
    let hasDishesFilter = undefined;
    if (queryParams.hasDishes) {
      hasDishesFilter = queryParams.hasDishes === 'true';
    }

    // Build orderBy
    let orderBy: any = {};
    switch (queryParams.sortBy) {
      case 'name':
      case 'createdAt':
      case 'updatedAt':
        orderBy[queryParams.sortBy] = queryParams.sortOrder;
        break;
      case 'dishCount':
        // Special case handled below
        break;
      default:
        orderBy.name = 'asc';
    }

    // Get categories with their parent relation and count of dishes
    const categoriesPromise = prisma.category.findMany({
      where: whereConditions,
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: { dishes: true },
        },
      },
      orderBy: queryParams.sortBy === 'dishCount' ? undefined : orderBy,
      skip,
      take: queryParams.limit,
    });

    // Get total count for pagination
    const totalCountPromise = prisma.category.count({
      where: whereConditions,
    });

    // Execute both promises simultaneously
    const [categories, totalCount] = await Promise.all([
      categoriesPromise,
      totalCountPromise,
    ]);

    // Apply hasDishes filter post-query if needed
    let filteredCategories = categories;
    if (hasDishesFilter !== undefined) {
      filteredCategories = categories.filter(
        category => category._count?.dishes > 0 === hasDishesFilter
      );
    }

    // Sort by dishCount if needed (done post-query since it's based on relations)
    if (queryParams.sortBy === 'dishCount') {
      filteredCategories.sort((a, b) => {
        const countA = a._count?.dishes || 0;
        const countB = b._count?.dishes || 0;
        return queryParams.sortOrder === 'asc'
          ? countA - countB
          : countB - countA;
      });
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / queryParams.limit);
    const hasNextPage = queryParams.page < totalPages;
    const hasPreviousPage = queryParams.page > 1;

    return NextResponse.json({
      categories: filteredCategories,
      pagination: {
        page: queryParams.page,
        limit: queryParams.limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error fetching categories' },
      { status: 500 }
    );
  }
}

// CREATE a new category
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
      return new NextResponse('Only admins can create categories', {
        status: 403,
      });
    }

    const body = await req.json();
    const validatedData = categorySchema.parse(body);

    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name: validatedData.name },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 400 }
      );
    }

    // If parentId is provided, check if parent category exists
    if (validatedData.parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: validatedData.parentId },
      });

      if (!parentCategory) {
        return NextResponse.json(
          { error: 'Parent category not found' },
          { status: 400 }
        );
      }
    }

    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || '',
        parentId: validatedData.parentId || null,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
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
