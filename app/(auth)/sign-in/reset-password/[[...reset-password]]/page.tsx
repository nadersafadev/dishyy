import { SignIn } from '@clerk/nextjs';
import { generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata(
  'Reset Password',
  'Reset your Dishyy account password'
);

export default function ResetPasswordPage() {
  return (
    <SignIn
      path="/sign-in/reset-password"
      routing="path"
      signUpUrl="/sign-up"
      appearance={{
        elements: {
          formButtonPrimary:
            'bg-primary hover:bg-primary/90 text-primary-foreground',
          card: 'bg-card shadow-none',
          headerTitle: 'text-foreground',
          headerSubtitle: 'text-muted-foreground',
          formFieldLabel: 'text-foreground',
          formFieldInput: 'bg-background border-input',
          footerActionLink: 'text-primary hover:text-primary/90',
        },
      }}
    />
  );
}
