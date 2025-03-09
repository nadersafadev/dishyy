'use client';

import { Badge } from '@/components/ui/badge';
import {
  UtensilsCrossedIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from 'lucide-react';
import { CollapsibleTrigger } from '@/components/ui/collapsible';

interface DishHeaderProps {
  name: string;
  unit: string;
  imageUrl: string | null;
  amountPerPerson: number;
  totalContributed: number;
  totalNeeded: number;
  isOpen: boolean;
}

export function DishHeader({
  name,
  unit,
  imageUrl,
  amountPerPerson,
  totalContributed,
  totalNeeded,
  isOpen,
}: DishHeaderProps) {
  return (
    <CollapsibleTrigger className="w-full text-left p-5 flex items-start justify-between gap-4 group cursor-pointer">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="relative w-14 h-14 rounded-md overflow-hidden shrink-0 bg-muted shadow-sm">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
              <UtensilsCrossedIcon className="w-8 h-8" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-base truncate">{name}</span>
            <Badge variant="outline" className="shrink-0">
              {['QUANTITY', 'PIECES'].includes(unit) ? 'QTY' : unit}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <span>{amountPerPerson} per person</span>
            <span className="mx-1">•</span>
            <span className="font-medium">
              {['QUANTITY', 'PIECES'].includes(unit)
                ? `${totalContributed}/${Math.ceil(totalNeeded)}`
                : `${totalContributed.toFixed(1)}/${totalNeeded.toFixed(1)}`}
            </span>
          </div>
        </div>
      </div>
      <div className="text-muted-foreground">
        {isOpen ? (
          <ChevronDownIcon className="h-5 w-5" />
        ) : (
          <ChevronRightIcon className="h-5 w-5" />
        )}
      </div>
    </CollapsibleTrigger>
  );
}
