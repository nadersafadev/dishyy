-- First, drop all constraints on join_requests
DO $$ 
BEGIN
    EXECUTE (
        SELECT 'ALTER TABLE join_requests DROP CONSTRAINT ' || string_agg(quote_ident(conname), ', ')
        FROM pg_constraint
        WHERE conrelid = 'join_requests'::regclass
        AND contype = 'u'
    );
END $$;

-- Then add our new constraint
ALTER TABLE "join_requests" ADD CONSTRAINT "join_requests_userId_partyId_createdAt_key" 
    UNIQUE ("userId", "partyId", "createdAt"); 