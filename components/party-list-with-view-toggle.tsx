'use client';

import { useState } from 'react';
import type { Party, PartyDish, PartyParticipant } from '@prisma/client';
import PartyList from './PartyList';
import { ViewToggle } from './ui/view-toggle';

interface PartyWithDetails extends Party {
  participants: PartyParticipant[];
  dishes: (PartyDish & {
    dish: {
      name: string;
      unit: string;
    };
  })[];
}

interface PartyListWithViewToggleProps {
  parties: PartyWithDetails[];
  title?: string;
  description?: string;
}

export function PartyListWithViewToggle({
  parties,
  title,
  description,
}: PartyListWithViewToggleProps) {
  const [view, setView] = useState<'grid' | 'list'>('list');

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {(title || description) && (
          <div className="space-y-1">
            {title && <h2 className="text-xl font-medium">{title}</h2>}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        <div className="shrink-0 self-start sm:self-center">
          <ViewToggle view={view} onViewChange={setView} />
        </div>
      </div>
      <PartyList parties={parties} view={view} />
    </div>
  );
}
