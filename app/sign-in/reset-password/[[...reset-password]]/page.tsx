import { SignIn } from '@clerk/nextjs';
import { Background } from '@/components/ui/background';
import { Logo } from '@/components/ui/logo';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Background />
      <div className="w-full max-w-[400px] space-y-4">
        <div className="flex justify-center">
          <Logo />
        </div>
        <SignIn
          path="/sign-in/reset-password"
          routing="path"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
}
