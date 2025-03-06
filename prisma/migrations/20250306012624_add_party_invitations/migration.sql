-- CreateTable
CREATE TABLE "party_invitations" (
    "id" TEXT NOT NULL,
    "partyId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "maxUses" INTEGER NOT NULL DEFAULT 1,
    "currentUses" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "party_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "party_invitations_token_key" ON "party_invitations"("token");

-- AddForeignKey
ALTER TABLE "party_invitations" ADD CONSTRAINT "party_invitations_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "parties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
