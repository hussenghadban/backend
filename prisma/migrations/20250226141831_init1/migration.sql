/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Subcategory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subcategory" DROP CONSTRAINT "Subcategory_categoryId_fkey";

-- AlterTable
ALTER TABLE "Subcategory" DROP COLUMN "categoryId";
