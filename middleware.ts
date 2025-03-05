import {
  clerkMiddleware,
  createRouteMatcher,
  getAuth,
} from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['(app)/(.*)']);

export default clerkMiddleware(async (_, req) => {
  // Handle URL normalization (www and http redirects) only in production
  const url = req.nextUrl;
  const hostname = url.hostname;
  const protocol = url.protocol;
  const isProduction = process.env.NODE_ENV === 'production';

  // Only apply redirects in production
  if (isProduction && (hostname === 'www.dishyy.com' || protocol === 'http:')) {
    const canonicalUrl = new URL(
      url.pathname + url.search,
      'https://dishyy.com'
    );
    return NextResponse.redirect(canonicalUrl);
  }

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
