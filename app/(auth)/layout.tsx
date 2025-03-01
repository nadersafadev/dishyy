import React from 'react';
import { Background } from '@/components/ui/background';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Background />
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-4">
        <div className="w-full max-w-[400px] mx-auto">{children}</div>
      </div>
    </div>
  );
}
