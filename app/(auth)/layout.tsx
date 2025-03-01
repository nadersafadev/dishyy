import React from 'react';
import { Background } from '@/components/ui/background';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Background />
      <div className="w-full max-w-[400px] space-y-4">{children}</div>
    </div>
  );
}
