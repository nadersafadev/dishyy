'use client';

import { UtensilsCrossed } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AppLoading() {
  return (
    <div className="min-h-[300px] sm:min-h-[400px] w-full flex flex-col items-center justify-center bg-grid-small-black/[0.2] relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background pointer-events-none" />

      {/* Animated Background Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      </motion.div>

      <div className="relative flex flex-col items-center px-4">
        {/* Loading Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
          className="mb-4 sm:mb-8"
        >
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
            <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
              <UtensilsCrossed className="w-8 h-8 sm:w-12 sm:h-12 text-primary animate-pulse" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center space-y-2 sm:space-y-4"
        >
          {/* Main Content */}
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/50 leading-tight sm:leading-tight">
              Loading
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground max-w-[300px] sm:max-w-[500px] mx-auto leading-relaxed sm:leading-relaxed">
              Preparing your delicious content...
            </p>
          </div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute -z-10"
          >
            <div className="blur-3xl opacity-20 bg-gradient-to-br from-primary to-secondary w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] rounded-full -top-10 sm:-top-20 -left-10 sm:-left-20 animate-pulse" />
            <div className="blur-3xl opacity-20 bg-gradient-to-br from-secondary to-primary w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] rounded-full -bottom-10 sm:-bottom-20 -right-10 sm:-right-20 animate-pulse delay-1000" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
