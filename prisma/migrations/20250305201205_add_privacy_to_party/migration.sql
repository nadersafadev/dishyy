-- CreateEnum
CREATE TYPE "Privacy" AS ENUM ('PRIVATE', 'PUBLIC', 'CLOSED');

-- AlterTable
ALTER TABLE "parties" ADD COLUMN     "privacy" "Privacy" NOT NULL DEFAULT 'PUBLIC';
