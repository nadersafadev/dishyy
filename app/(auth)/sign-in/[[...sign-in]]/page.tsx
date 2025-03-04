import { SignIn } from '@clerk/nextjs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Dishyy',
  description: 'Sign in to your Dishyy account',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function SignInPage({
  searchParams,
}: {
  searchParams?: { redirect_url?: string };
}) {
  // Get the redirect URL from search params or use dashboard as default
  const redirectUrl = searchParams?.redirect_url || '/dashboard';

  return (
    <SignIn
      appearance={{
        elements: {
          formButtonPrimary:
            'bg-primary hover:bg-primary/90 text-primary-foreground',
          card: 'bg-card shadow-none',
          headerTitle: 'text-foreground',
          headerSubtitle: 'text-muted-foreground',
          socialButtonsBlockButton:
            'text-foreground border-border hover:bg-muted',
          formFieldLabel: 'text-foreground',
          formFieldInput: 'bg-background border-input',
          footerActionLink: 'text-primary hover:text-primary/90',
        },
      }}
      path="/sign-in"
      signUpUrl="/sign-up"
      fallbackRedirectUrl={redirectUrl}
      routing="path"
    />
  );
}
