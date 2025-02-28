import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { prisma } from './prisma';

export async function syncUserRole() {
  const { userId } = await auth();
  if (!userId) return null;

  // Get user from Clerk
  const clerkUser = await clerkClient.users.getUser(userId);

  // Get or create user in database
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) {
    // Create new user with default role
    return await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${clerkUser.firstName} ${clerkUser.lastName}`,
        email: clerkUser.emailAddresses[0].emailAddress,
        role: 'INDIVIDUAL',
      },
    });
  }

  // Sync role to Clerk's private metadata if it doesn't match
  const currentRole = clerkUser.privateMetadata.role;
  if (currentRole !== dbUser.role) {
    await clerkClient.users.updateUser(userId, {
      privateMetadata: { role: dbUser.role },
    });
  }

  return dbUser;
}

export async function updateUserRole(
  userId: string,
  role: 'ADMIN' | 'INDIVIDUAL'
) {
  // Update role in database
  const updatedUser = await prisma.user.update({
    where: { clerkId: userId },
    data: { role },
  });

  // Sync with Clerk
  await clerkClient.users.updateUser(userId, {
    privateMetadata: { role },
  });

  return updatedUser;
}
