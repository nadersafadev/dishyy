import { Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'default' | 'large' | 'xl';
}

export function Logo({ variant = 'dark', size = 'default' }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <Utensils
        className={cn('text-primary', {
          'w-6 h-6': size === 'default',
          'w-8 h-8': size === 'large',
          'w-12 h-12': size === 'xl',
        })}
      />
      <span
        className={cn(
          'font-bold',
          {
            'text-xl': size === 'default',
            'text-2xl': size === 'large',
            'text-4xl': size === 'xl',
          },
          variant === 'light' ? 'text-white' : 'text-foreground'
        )}
      >
        Dishyy
      </span>
    </div>
  );
}
