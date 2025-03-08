'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';

export type ViewMode = 'grid' | 'list';

interface ViewSwitcherProps {
  currentView: ViewMode;
}

export function ViewSwitcher({ currentView }: ViewSwitcherProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createViewURL = (view: ViewMode) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('view', view);
    return `?${params.toString()}`;
  };

  const handleViewChange = (view: ViewMode) => {
    router.push(createViewURL(view));
  };

  return (
    <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
      <Button
        variant="ghost"
        size="sm"
        className={`p-2 h-8 ${
          currentView === 'grid'
            ? 'bg-background shadow-sm'
            : 'hover:bg-primary'
        }`}
        onClick={() => handleViewChange('grid')}
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="sr-only">Grid view</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`p-2 h-8 ${
          currentView === 'list'
            ? 'bg-background shadow-sm'
            : 'hover:bg-primary'
        }`}
        onClick={() => handleViewChange('list')}
      >
        <List className="h-4 w-4" />
        <span className="sr-only">List view</span>
      </Button>
    </div>
  );
}
