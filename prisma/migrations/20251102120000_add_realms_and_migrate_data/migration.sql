-- CreateEnum (if it doesn't exist)
DO $$ BEGIN
    CREATE TYPE "RealmRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateTable
CREATE TABLE "Realm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Realm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RealmMember" (
    "id" TEXT NOT NULL,
    "realmId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "RealmRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RealmMember_pkey" PRIMARY KEY ("id")
);

-- Add realmId columns as nullable first
ALTER TABLE "Resource" ADD COLUMN IF NOT EXISTS "realmId" TEXT;
ALTER TABLE "City" ADD COLUMN IF NOT EXISTS "realmId" TEXT;
ALTER TABLE "Army" ADD COLUMN IF NOT EXISTS "realmId" TEXT;

-- Get the first user to be the owner of the default realm
-- We'll use a subquery to get the first user's ID
DO $$
DECLARE
    default_owner_id TEXT;
    default_realm_id TEXT := gen_random_uuid()::TEXT;
    default_realm_code TEXT := 'IMPERI';
BEGIN
    -- Get the first user (or create a placeholder - this should never be null)
    SELECT "id" INTO default_owner_id FROM "User" LIMIT 1;
    
    -- If no users exist, skip the data migration (shadow database or empty database)
    IF default_owner_id IS NULL THEN
        RETURN;
    END IF;

    -- Create the default "Imperium Fragmentum" realm
    INSERT INTO "Realm" ("id", "name", "code", "ownerId", "createdAt", "updatedAt")
    VALUES (default_realm_id, 'Imperium Fragmentum', default_realm_code, default_owner_id, NOW(), NOW());

    -- Make all existing users members of the default realm
    INSERT INTO "RealmMember" ("id", "realmId", "userId", "role", "joinedAt")
    SELECT gen_random_uuid()::TEXT, default_realm_id, "id", 'MEMBER', NOW()
    FROM "User";

    -- The realm owner should be OWNER role
    UPDATE "RealmMember" 
    SET "role" = 'OWNER' 
    WHERE "realmId" = default_realm_id AND "userId" = default_owner_id;

    -- Update all existing Resources to point to this realm
    UPDATE "Resource" SET "realmId" = default_realm_id WHERE "realmId" IS NULL;

    -- Create resources for users who don't have any yet
    INSERT INTO "Resource" ("id", "userId", "realmId", "wood", "stone", "food", "currency", "metal", "livestock")
    SELECT 
        gen_random_uuid()::TEXT,
        u."id",
        default_realm_id,
        COALESCE((SELECT "wood" FROM "Resource" WHERE "userId" = u."id" AND "realmId" IS NULL LIMIT 1), 0),
        COALESCE((SELECT "stone" FROM "Resource" WHERE "userId" = u."id" AND "realmId" IS NULL LIMIT 1), 0),
        COALESCE((SELECT "food" FROM "Resource" WHERE "userId" = u."id" AND "realmId" IS NULL LIMIT 1), 0),
        COALESCE((SELECT "currency" FROM "Resource" WHERE "userId" = u."id" AND "realmId" IS NULL LIMIT 1), 0),
        COALESCE((SELECT "metal" FROM "Resource" WHERE "userId" = u."id" AND "realmId" IS NULL LIMIT 1), 0),
        COALESCE((SELECT "livestock" FROM "Resource" WHERE "userId" = u."id" AND "realmId" IS NULL LIMIT 1), 0)
    FROM "User" u
    WHERE NOT EXISTS (
        SELECT 1 FROM "Resource" res 
        WHERE res."userId" = u."id" AND res."realmId" = default_realm_id
    );

    -- Update all existing Cities to point to this realm
    UPDATE "City" SET "realmId" = default_realm_id WHERE "realmId" IS NULL;

    -- Update all existing Armies to point to this realm
    UPDATE "Army" SET "realmId" = default_realm_id WHERE "realmId" IS NULL;

    -- Now make realmId columns required
    ALTER TABLE "Resource" ALTER COLUMN "realmId" SET NOT NULL;
    ALTER TABLE "City" ALTER COLUMN "realmId" SET NOT NULL;
    ALTER TABLE "Army" ALTER COLUMN "realmId" SET NOT NULL;
END $$;

-- CreateIndex
CREATE INDEX "RealmMember_userId_idx" ON "RealmMember"("userId");

-- CreateIndex
CREATE INDEX "RealmMember_realmId_idx" ON "RealmMember"("realmId");

-- CreateIndex
CREATE UNIQUE INDEX "RealmMember_realmId_userId_key" ON "RealmMember"("realmId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Realm_code_key" ON "Realm"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_realmId_userId_key" ON "Resource"("realmId", "userId");

-- Drop old unique constraint on Resource.userId if it exists
ALTER TABLE "Resource" DROP CONSTRAINT IF EXISTS "Resource_userId_key";

-- AddForeignKey
ALTER TABLE "Realm" ADD CONSTRAINT "Realm_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealmMember" ADD CONSTRAINT "RealmMember_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealmMember" ADD CONSTRAINT "RealmMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Army" ADD CONSTRAINT "Army_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

