-- CreateIndex
CREATE INDEX "join_requests_userId_partyId_createdAt_idx" ON "join_requests"("userId", "partyId", "createdAt");
