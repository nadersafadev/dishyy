'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-grid-small-black/[0.2] relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background pointer-events-none" />

      <div className="relative">
        {/* 404 Large Background Text */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 text-9xl font-bold text-muted-foreground/10 select-none">
          404
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8 relative z-10"
        >
          {/* Main Content */}
          <div className="space-y-4 px-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
              Page Not Found
            </h1>
            <p className="text-muted-foreground text-lg max-w-[500px] mx-auto">
              Oops! It seems you've ventured into uncharted territory. The page
              you're looking for has gone missing.
            </p>
          </div>

          {/* Button Group */}
          <div className="flex justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild size="lg" variant="default">
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft size={16} />
                  Back to Home
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -z-10 blur-3xl opacity-20 bg-gradient-to-br from-primary to-secondary w-[200px] h-[200px] rounded-full -top-20 -left-20" />
          <div className="absolute -z-10 blur-3xl opacity-20 bg-gradient-to-br from-secondary to-primary w-[200px] h-[200px] rounded-full -bottom-20 -right-20" />
        </motion.div>
      </div>
    </div>
  );
}
