'use client';

import { Button } from '@/components/ui/button';

export function SignInPrompt() {
  return (
    <div className="text-center space-y-4">
      <p className="text-muted-foreground">
        Please sign in to accept this invitation
      </p>
      <Button
        onClick={() => {
          const currentUrl = window.location.href;
          window.location.href = `/sign-in?redirect_url=${encodeURIComponent(currentUrl)}`;
        }}
      >
        Sign In
      </Button>
    </div>
  );
}
