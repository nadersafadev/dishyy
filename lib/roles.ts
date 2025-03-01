import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { prisma } from './prisma';

export async function syncUserRole() {
  const { userId } = await auth();
  if (!userId) return null;

  // Get user from Clerk
  const clerkUser = await clerkClient.users.getUser(userId);
  const userEmail = clerkUser.emailAddresses[0].emailAddress;

  // First check if user exists by clerkId
  let dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) {
    // Then check if a user with the same email already exists
    const existingUserWithEmail = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (existingUserWithEmail) {
      // Update the existing user with the correct clerkId
      dbUser = await prisma.user.update({
        where: { id: existingUserWithEmail.id },
        data: { clerkId: userId },
      });
    } else {
      // Create new user with default role if no user exists with this email
      try {
        dbUser = await prisma.user.create({
          data: {
            clerkId: userId,
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
            email: userEmail,
            role: 'INDIVIDUAL',
          },
        });
      } catch (error) {
        console.error('Error creating user:', error);
        // If there's still an error, try to find the user by email again (race condition)
        dbUser = await prisma.user.findUnique({
          where: { email: userEmail },
        });

        if (dbUser && dbUser.clerkId !== userId) {
          // Update the clerkId if it doesn't match
          dbUser = await prisma.user.update({
            where: { id: dbUser.id },
            data: { clerkId: userId },
          });
        }
      }
    }
  }

  // Sync role to Clerk's private metadata if it doesn't match
  const currentRole = clerkUser.privateMetadata.role;
  if (dbUser && currentRole !== dbUser.role) {
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
