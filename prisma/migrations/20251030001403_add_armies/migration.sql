-- CreateTable
CREATE TABLE "Army" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Army_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArmyUnit" (
    "id" TEXT NOT NULL,
    "armyId" TEXT NOT NULL,
    "unitType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArmyUnit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Army" ADD CONSTRAINT "Army_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArmyUnit" ADD CONSTRAINT "ArmyUnit_armyId_fkey" FOREIGN KEY ("armyId") REFERENCES "Army"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
