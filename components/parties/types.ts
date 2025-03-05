import type { Party, PartyDish, PartyParticipant } from '@prisma/client';

export interface PartyWithDetails extends Party {
  participants: PartyParticipant[];
  dishes: (PartyDish & {
    dish: {
      name: string;
      unit: string;
    };
  })[];
}

export interface PartyFiltersProps {
  search: string;
  sortBy: 'name' | 'date' | 'createdAt' | 'participantsCount';
  sortOrder: 'asc' | 'desc';
  dateFrom?: string;
  dateTo?: string;
}

export interface FilterFormValues {
  search: string;
  dateFrom?: Date;
  dateTo?: Date;
}
