import { auth, currentUser } from '@clerk/nextjs/server'
import { SignOutButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { LogOut } from 'lucide-react'

export default async function Home() {
  const { userId } = await auth()
  const user = await currentUser()
  const isAuthenticated = !!userId

  return (
    <main className='min-h-screen flex flex-col relative'>
      {/* Background image with overlay */}
      <div className='fixed inset-0 -z-10'>
        {/* White overlay with opacity */}
        <div className='absolute inset-0 bg-white/60 backdrop-blur-sm' />

        {/* Background image */}
        <img
          src='https://res.cloudinary.com/daqvjcynu/image/upload/w_2000,h_1200,c_fill,g_auto/v1740601952/cld-sample-4.jpg'
          alt='Background'
          className='h-full w-full object-cover'
        />
      </div>

      {/* Main content centered vertically and horizontally */}
      <div className='flex-1 flex flex-col items-center justify-center p-6 sm:p-24'>
        {/* Card wrapper */}
        <div className='relative w-full max-w-2xl rounded-xl border border-border/50 bg-white/60 backdrop-blur-md shadow-lg p-8 sm:p-12'>
          <div className='text-center space-y-12'>
            {/* Logo */}
            <div className='flex justify-center'>
              <Logo size='xl' variant='dark' />
            </div>

            <div className='space-y-4'>
              <h1 className='text-4xl sm:text-5xl font-bold tracking-tight'>
                {isAuthenticated
                  ? `Welcome back, ${user?.firstName || 'there'}!`
                  : 'Welcome to Dishy'}
              </h1>
              <p className='text-xl text-muted-foreground'>
                Where Flavors Unite and Friendships Simmer
              </p>
            </div>

            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              {isAuthenticated ? (
                <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto'>
                  <Link
                    href='/dashboard'
                    className='btn-primary px-6 py-3 rounded-lg font-medium w-full sm:w-auto'
                  >
                    Go to Dashboard
                  </Link>
                  <SignOutButton>
                    <button className='flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium border border-input hover:bg-accent hover:text-accent-foreground hover-transition w-full sm:w-auto'>
                      <LogOut className='w-4 h-4' />
                      Sign Out
                    </button>
                  </SignOutButton>
                </div>
              ) : (
                <>
                  <Link
                    href='/sign-in'
                    className='btn-primary px-6 py-3 rounded-lg font-medium w-full sm:w-auto'
                  >
                    Sign In
                  </Link>
                  <Link
                    href='/sign-up'
                    className='px-6 py-3 rounded-lg font-medium border border-input hover:bg-accent hover:text-accent-foreground hover-transition w-full sm:w-auto'
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>

            <div>
              <p className='text-sm text-muted-foreground'>
                {isAuthenticated
                  ? 'Ready to create or join a dish party?'
                  : 'Join our community of food enthusiasts and share your culinary journey'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className='py-6 border-t border-border/40'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <p className='text-sm text-muted-foreground text-center'>
            © {new Date().getFullYear()} Dishy. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
