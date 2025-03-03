-- CreateTable
CREATE TABLE "participant_dish_contributions" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "dishId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "participant_dish_contributions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "participant_dish_contributions_participantId_dishId_key" ON "participant_dish_contributions"("participantId", "dishId");

-- AddForeignKey
ALTER TABLE "participant_dish_contributions" ADD CONSTRAINT "participant_dish_contributions_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "party_participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participant_dish_contributions" ADD CONSTRAINT "participant_dish_contributions_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "dishes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
