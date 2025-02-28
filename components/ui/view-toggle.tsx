import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
      <Button
        variant="ghost"
        size="sm"
        className={`p-2 h-8 ${
          view === 'grid' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
        }`}
        onClick={() => onViewChange('grid')}
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="sr-only">Grid view</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`p-2 h-8 ${
          view === 'list' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
        }`}
        onClick={() => onViewChange('list')}
      >
        <List className="h-4 w-4" />
        <span className="sr-only">List view</span>
      </Button>
    </div>
  );
}
