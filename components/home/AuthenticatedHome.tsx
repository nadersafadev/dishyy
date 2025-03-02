'use client';

import { SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle,
  LogOut,
  Plus,
  UserCircle,
} from 'lucide-react';

interface AuthenticatedHomeProps {
  userData: {
    firstName?: string | null;
    imageUrl?: string | null;
    email?: string | null;
    createdAt?: Date | null;
  } | null;
}

export default function AuthenticatedHome({
  userData,
}: AuthenticatedHomeProps) {
  // Determine if user is new (created within last 24 hours)
  const isNewUser = userData?.createdAt
    ? Date.now() - new Date(userData.createdAt).getTime() < 24 * 60 * 60 * 1000
    : false;

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0">
          <img
            src="https://res.cloudinary.com/daqvjcynu/image/upload/c_fill,g_auto,h_250,w_970/b_rgb:000000,e_gradient_fade,y_-0.50/v1740601952/cld-sample-4.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/30 backdrop-blur-lg"></div>
        </div>
      </div>

      {/* Content */}
      <div className="container relative z-10 py-10 flex items-center justify-center">
        <div className="w-full max-w-3xl">
          <div className="rounded-2xl border border-white/30 bg-white/40 backdrop-blur-xl shadow-xl overflow-hidden ring-1 ring-white/20 ring-inset">
            {/* Top gradient accent */}
            <div className="h-2 bg-gradient-to-r from-primary via-primary-600 to-primary-700"></div>

            <div className="p-8 sm:p-10 text-center space-y-8">
              <div className="flex justify-center">
                <Logo size="xl" variant="dark" />
              </div>

              {/* Welcome message */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {isNewUser
                    ? `Welcome to Dishyy, ${userData?.firstName || 'there'}!`
                    : `Welcome back, ${userData?.firstName || 'there'}!`}
                </h1>
                <p className="text-xl text-muted-foreground">
                  {isNewUser
                    ? "Let's get you started with your food sharing journey"
                    : 'Ready to create or join a dish party?'}
                </p>
              </div>

              {/* New User Onboarding - Only shown to new users */}
              {isNewUser && (
                <div className="rounded-xl bg-white/50 border border-primary-100 p-6 space-y-4">
                  <h2 className="text-lg font-medium text-primary-700">
                    Quick Start Guide
                  </h2>

                  <div className="space-y-3 text-left">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-6 w-6 text-primary mt-0.5">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">Create your first party</h3>
                        <p className="text-sm text-muted-foreground">
                          Invite friends to bring dishes and organize a potluck!
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-6 w-6 text-primary mt-0.5">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          Browse available parties
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Find events in your area and contribute your favorite
                          dishes.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-6 w-6 text-primary mt-0.5">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">Complete your profile</h3>
                        <p className="text-sm text-muted-foreground">
                          Add your preferences and dietary restrictions.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button asChild className="gap-2">
                      <Link href="/dashboard">
                        Go to Dashboard <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}

              {/* Stats cards - Only shown to returning users */}
              {!isNewUser && (
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 rounded-xl bg-white/20 border border-white/30 backdrop-blur-sm">
                    <div className="font-bold text-3xl text-primary">0</div>
                    <div className="text-sm text-muted-foreground">
                      Your Parties
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/20 border border-white/30 backdrop-blur-sm">
                    <div className="font-bold text-3xl text-primary">0</div>
                    <div className="text-sm text-muted-foreground">
                      Shared Dishes
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="default"
                  className="w-full h-14 gap-2"
                >
                  <Link href="/parties/new">
                    <Plus className="h-5 w-5" />
                    Create New Party
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant={isNewUser ? 'secondary' : 'outline'}
                  className={`w-full h-14 gap-2 ${!isNewUser ? 'bg-white/50 border-white/40' : ''}`}
                >
                  <Link href={isNewUser ? '/dashboard' : '/parties'}>
                    {isNewUser ? (
                      <>
                        <UserCircle className="h-5 w-5" />
                        Explore Dashboard
                      </>
                    ) : (
                      <>
                        <CalendarDays className="h-5 w-5" />
                        View My Parties
                      </>
                    )}
                  </Link>
                </Button>
              </div>

              {/* Extra links */}
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button asChild variant="ghost" size="sm" className="gap-1.5">
                  <Link href="/profile">
                    <UserCircle className="h-4 w-4" />
                    My Profile
                  </Link>
                </Button>
                <SignOutButton>
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </SignOutButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
