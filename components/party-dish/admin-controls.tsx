'use client';

import { UpdateDishQuantity } from '@/components/update-dish-quantity';
import { RemovePartyDish } from '@/components/remove-party-dish';
import { Unit } from '@/lib/types';

interface AdminControlsProps {
  isAdmin: boolean;
  partyId: string;
  dishId: string;
  dishName: string;
  unit: Unit;
  amountPerPerson: number;
}

export function AdminControls({
  isAdmin,
  partyId,
  dishId,
  dishName,
  unit,
  amountPerPerson,
}: AdminControlsProps) {
  if (!isAdmin) return null;

  return (
    <div className="absolute top-3 right-10 flex items-center gap-2 z-10 bg-background/80 backdrop-blur-sm py-1 px-2 rounded-md shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
      <UpdateDishQuantity
        partyId={partyId}
        dishId={dishId}
        dishName={dishName}
        unit={unit}
        currentAmount={amountPerPerson}
        isAdmin={isAdmin}
      />
      <RemovePartyDish
        partyId={partyId}
        dishId={dishId}
        dishName={dishName}
        isAdmin={isAdmin}
      />
    </div>
  );
}
