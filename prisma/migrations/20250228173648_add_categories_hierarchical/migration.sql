/*
  Warnings:

  - You are about to drop the `dishes_on_categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "dishes_on_categories" DROP CONSTRAINT "dishes_on_categories_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "dishes_on_categories" DROP CONSTRAINT "dishes_on_categories_dishId_fkey";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "parentId" TEXT;

-- AlterTable
ALTER TABLE "dishes" ADD COLUMN     "categoryId" TEXT;

-- DropTable
DROP TABLE "dishes_on_categories";

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dishes" ADD CONSTRAINT "dishes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
