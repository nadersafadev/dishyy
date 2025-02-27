import { SignUp } from '@clerk/nextjs';
import { Background } from '@/components/ui/background';
import { Logo } from '@/components/ui/logo';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Background />
      <div className="w-full max-w-[400px] space-y-4">
        <div className="flex justify-center">
          <Logo variant="light" size="large" />
        </div>
        <SignUp
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
          path="/sign-up"
          forceRedirectUrl="/dashboard"
          signInUrl="/sign-in"
          routing="path"
        />
      </div>
    </div>
  );
}
