-- Drop existing constraints
DO $$ 
BEGIN
    EXECUTE (
        SELECT 'ALTER TABLE join_requests DROP CONSTRAINT ' || string_agg(quote_ident(conname), ', ')
        FROM pg_constraint
        WHERE conrelid = 'join_requests'::regclass
        AND contype = 'u'
    );
END $$;

-- Drop existing indexes
DROP INDEX IF EXISTS "join_requests_userId_partyId_createdAt_idx";

-- Recreate the table with proper constraints
ALTER TABLE "join_requests" 
    ADD COLUMN IF NOT EXISTS "numGuests" INTEGER NOT NULL DEFAULT 0,
    ADD CONSTRAINT "join_requests_userId_partyId_createdAt_key" 
    UNIQUE ("userId", "partyId", "createdAt"),
    ADD INDEX "join_requests_userId_partyId_createdAt_idx" 
    ("userId", "partyId", "createdAt"); 