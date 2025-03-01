'use client';

interface DishProgressBarProps {
  progressPercentage: number;
}

export function DishProgressBar({ progressPercentage }: DishProgressBarProps) {
  return (
    <div className="px-5 pb-3">
      <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-primary transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}
