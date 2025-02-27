/*
  Warnings:

  - Added the required column `amountPerPerson` to the `party_dishes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('GRAMS', 'KILOS', 'QUANTITY', 'MILLILITERS', 'LITERS', 'PIECES');

-- AlterTable
ALTER TABLE "dishes" ADD COLUMN     "unit" "Unit" NOT NULL DEFAULT 'QUANTITY';

-- AlterTable
ALTER TABLE "party_dishes" ADD COLUMN     "amountPerPerson" DOUBLE PRECISION NOT NULL DEFAULT 1.0;
