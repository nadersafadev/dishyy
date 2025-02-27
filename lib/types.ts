export enum Unit {
  GRAMS = 'GRAMS',
  KILOS = 'KILOS',
  QUANTITY = 'QUANTITY',
  MILLILITERS = 'MILLILITERS',
  LITERS = 'LITERS',
  PIECES = 'PIECES',
}

export const unitLabels: Record<Unit, string> = {
  [Unit.GRAMS]: 'Grams',
  [Unit.KILOS]: 'Kilos',
  [Unit.QUANTITY]: 'Quantity',
  [Unit.MILLILITERS]: 'Milliliters',
  [Unit.LITERS]: 'Liters',
  [Unit.PIECES]: 'Pieces',
}

export interface Dish {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  imageId: string | null
  unit: Unit
  _count?: {
    parties: number
  }
}
