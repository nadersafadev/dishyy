import { SignIn } from '@clerk/nextjs';
import { generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata(
  'Sign In',
  'Sign in to your Dishyy account'
);

export default function SignInPage() {
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
      forceRedirectUrl="/dashboard"
      routing="path"
    />
  );
}
