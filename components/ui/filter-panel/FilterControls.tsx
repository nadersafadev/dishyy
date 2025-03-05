import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterControlsProps {
  isOpen: boolean;
  onToggle: () => void;
  hasActiveFilters: boolean;
  onReset: () => void;
}

export function FilterControls({
  isOpen,
  onToggle,
  hasActiveFilters,
  onReset,
}: FilterControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        title="Advanced filters and sorting"
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span className="sr-only">Advanced filters</span>
      </Button>
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          title="Reset all filters"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="sr-only">Reset filters</span>
        </Button>
      )}
    </div>
  );
}
