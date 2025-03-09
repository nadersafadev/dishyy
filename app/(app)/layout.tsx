import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

async function syncUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

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
      // Create new user with default role
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
          email: userEmail,
          role: 'INDIVIDUAL',
        },
      });
    }
  }

  return dbUser;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sync user before rendering the layout
  await syncUser();

  return (
    <>
      <SignedIn>
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <main className="flex-1 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
          <Footer />
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <ToastProvider />
    </>
  );
}
