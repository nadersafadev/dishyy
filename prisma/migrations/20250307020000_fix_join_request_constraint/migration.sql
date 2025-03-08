-- Drop the existing unique constraint
ALTER TABLE "join_requests" DROP CONSTRAINT IF EXISTS "join_requests_userId_partyId_key";

-- Add the new unique constraint including createdAt
ALTER TABLE "join_requests" ADD CONSTRAINT "join_requests_userId_partyId_createdAt_key" UNIQUE ("userId", "partyId", "createdAt"); 