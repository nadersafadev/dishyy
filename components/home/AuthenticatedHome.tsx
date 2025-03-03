'use client';

import { SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
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
    stats?: {
      partyCount: number;
      contributionCount: number;
    };
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
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"></div>
        </div>
      </div>

      {/* Content */}
      <div className="container relative z-10 py-10 flex items-center justify-center">
        <div className="w-full max-w-3xl">
          <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm shadow-xl overflow-hidden ring-1 ring-white/10 ring-inset">
            {/* Top gradient accent */}
            <div className="h-2 bg-gradient-to-r from-primary via-primary-600 to-primary-700"></div>

            <div className="p-8 sm:p-10 text-center space-y-8">
              <div className="flex justify-center">
                <Image
                  src="/logo-white.png"
                  alt="Dishyy Logo"
                  width={180}
                  height={48}
                  priority
                />
              </div>

              {/* Welcome message */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                  {isNewUser
                    ? `Welcome to Dishyy, ${userData?.firstName || 'there'}!`
                    : `Welcome back, ${userData?.firstName || 'there'}!`}
                </h1>
                <p className="text-xl text-zinc-200">
                  {isNewUser
                    ? "Let's get you started with your food sharing journey"
                    : 'Ready to create or join a dish party?'}
                </p>
              </div>

              {/* New User Onboarding - Only shown to new users */}
              {isNewUser && (
                <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-6 space-y-4">
                  <h2 className="text-lg font-medium text-emerald-400">
                    Quick Start Guide
                  </h2>

                  <div className="space-y-3 text-left">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-6 w-6 text-emerald-400 mt-0.5">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">
                          Create your first party
                        </h3>
                        <p className="text-sm text-zinc-200">
                          Invite friends to bring dishes and organize a potluck!
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-6 w-6 text-emerald-400 mt-0.5">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">
                          Browse available parties
                        </h3>
                        <p className="text-sm text-zinc-200">
                          Find events in your area and contribute your favorite
                          dishes.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-6 w-6 text-emerald-400 mt-0.5">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">
                          Complete your profile
                        </h3>
                        <p className="text-sm text-zinc-200">
                          Add your preferences and dietary restrictions.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      asChild
                      className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
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
                  <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
                    <div className="font-bold text-3xl text-emerald-400">
                      {userData?.stats?.partyCount || 0}
                    </div>
                    <div className="text-sm text-zinc-200">Your Parties</div>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
                    <div className="font-bold text-3xl text-emerald-400">
                      {userData?.stats?.contributionCount || 0}
                    </div>
                    <div className="text-sm text-zinc-200">Shared Dishes</div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="default"
                  className="w-full h-14 gap-2 bg-emerald-600 hover:bg-emerald-500 text-white"
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
                  className={`w-full h-14 gap-2 ${!isNewUser ? 'bg-zinc-900/50 border-zinc-800 text-white hover:bg-zinc-800/50' : 'text-white hover:text-white bg-zinc-900/50 hover:bg-zinc-800/50'}`}
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
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-zinc-200 hover:text-white hover:bg-zinc-800/50"
                >
                  <Link href="/profile">
                    <UserCircle className="h-4 w-4" />
                    My Profile
                  </Link>
                </Button>
                <SignOutButton>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-zinc-200 hover:text-white hover:bg-zinc-800/50"
                  >
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
