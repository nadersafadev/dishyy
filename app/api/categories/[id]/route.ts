import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  parentId: z.string().optional().nullable(),
});

// GET a single category
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
          },
        },
        dishes: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Error fetching category' },
      { status: 500 }
    );
  }
}

// UPDATE a category
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
      return new NextResponse('Only admins can update categories', {
        status: 403,
      });
    }

    const body = await req.json();
    const validatedData = categorySchema.parse(body);

    // Check if the category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if new name conflicts with existing category
    if (validatedData.name !== existingCategory.name) {
      const nameConflict = await prisma.category.findFirst({
        where: {
          name: validatedData.name,
          NOT: {
            id: params.id,
          },
        },
      });

      if (nameConflict) {
        return NextResponse.json(
          { error: 'A category with this name already exists' },
          { status: 400 }
        );
      }
    }

    // Check for circular reference - a category cannot be its own ancestor
    if (validatedData.parentId) {
      // Don't allow a category to be its own parent
      if (validatedData.parentId === params.id) {
        return NextResponse.json(
          { error: 'A category cannot be its own parent' },
          { status: 400 }
        );
      }

      // Check if the assigned parent exists
      const parentCategory = await prisma.category.findUnique({
        where: { id: validatedData.parentId },
      });

      if (!parentCategory) {
        return NextResponse.json(
          { error: 'Parent category not found' },
          { status: 400 }
        );
      }

      // Check for circular reference by looking up the chain
      let currentParentId = validatedData.parentId;
      const ancestorIds = new Set<string>();

      while (currentParentId) {
        if (ancestorIds.has(currentParentId)) {
          // We've seen this parent before - circular reference detected
          return NextResponse.json(
            { error: 'Circular reference detected in category hierarchy' },
            { status: 400 }
          );
        }

        ancestorIds.add(currentParentId);

        const parent = await prisma.category.findUnique({
          where: { id: currentParentId },
          select: { parentId: true },
        });

        if (!parent) break;

        // If we find the current category in the ancestor chain, it's a circular reference
        if (parent.parentId === params.id) {
          return NextResponse.json(
            { error: 'Circular reference detected in category hierarchy' },
            { status: 400 }
          );
        }

        // If parentId is null, we've reached the top of the hierarchy
        if (!parent.parentId) break;

        // Otherwise, move up the chain
        currentParentId = parent.parentId;
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id: params.id },
      data: {
        name: validatedData.name,
        description: validatedData.description || '',
        parentId: validatedData.parentId ?? null,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
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

// DELETE a category
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
      return new NextResponse('Only admins can delete categories', {
        status: 403,
      });
    }

    // Check if the category exists
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        dishes: true,
        children: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if the category has dishes
    if (category.dishes.length > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete a category that has dishes. Reassign or delete the dishes first.',
        },
        { status: 400 }
      );
    }

    // Check if the category has subcategories
    if (category.children.length > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete a category that has subcategories. Delete or reassign the subcategories first.',
        },
        { status: 400 }
      );
    }

    // Delete the category
    await prisma.category.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
