/*
  Warnings:

  - You are about to drop the column `ducats` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `food` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `wood` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "ducats",
DROP COLUMN "food",
DROP COLUMN "stone",
DROP COLUMN "wood";

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wood" INTEGER NOT NULL DEFAULT 0,
    "stone" INTEGER NOT NULL DEFAULT 0,
    "food" INTEGER NOT NULL DEFAULT 0,
    "ducats" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Resource_userId_key" ON "Resource"("userId");

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
