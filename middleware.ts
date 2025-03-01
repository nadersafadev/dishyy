import {
  clerkMiddleware,
  createRouteMatcher,
  getAuth,
} from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dishes/(.*)',
  '/categories/(.*)',
  '/parties/(.*)/dishes/(.*)',
]);

export default clerkMiddleware(async (_, req) => {
  // Check if the route is protected
  if (isProtectedRoute(req)) {
    // Get auth data using getAuth helper
    const { userId } = getAuth(req);

    // If not logged in, redirect to sign-in with the return URL
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
