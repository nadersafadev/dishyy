-- AlterTable
ALTER TABLE "join_requests" ADD COLUMN IF NOT EXISTS "numGuests" INTEGER NOT NULL DEFAULT 0; 