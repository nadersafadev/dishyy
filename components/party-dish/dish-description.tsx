'use client';

interface DishDescriptionProps {
  description: string | null;
}

export function DishDescription({ description }: DishDescriptionProps) {
  if (!description) return null;

  return (
    <div className="px-5 pb-4">
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
