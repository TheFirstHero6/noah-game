/*
  Warnings:

  - You are about to drop the column `ducats` on the `Resource` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "ducats",
ADD COLUMN     "currency" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "livestock" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "metal" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "theme" TEXT NOT NULL DEFAULT 'royal-court';
