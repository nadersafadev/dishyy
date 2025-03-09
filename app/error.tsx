'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-grid-small-black/[0.2] relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background pointer-events-none" />

      <div className="relative">
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
          className="absolute -top-32 left-1/2 -translate-x-1/2"
        >
          <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-destructive" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8 relative z-10"
        >
          {/* Main Content */}
          <div className="space-y-4 px-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-destructive to-destructive/50">
              Something went wrong
            </h1>
            <p className="text-muted-foreground text-lg max-w-[500px] mx-auto">
              {error.message || 'An unexpected error occurred'}
            </p>
          </div>

          {/* Button Group */}
          <div className="flex justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={reset}
                size="lg"
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw size={16} className="animate-spin-slow" />
                Try Again
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild size="lg" variant="default">
                <Link href="/">Go home</Link>
              </Button>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -z-10 blur-3xl opacity-20 bg-gradient-to-br from-destructive to-orange-500 w-[200px] h-[200px] rounded-full -top-20 -left-20" />
          <div className="absolute -z-10 blur-3xl opacity-20 bg-gradient-to-br from-orange-500 to-destructive w-[200px] h-[200px] rounded-full -bottom-20 -right-20" />
        </motion.div>
      </div>
    </div>
  );
}
