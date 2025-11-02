-- CreateEnum (if it doesn't exist)
DO $$ BEGIN
    CREATE TYPE "RealmRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateTable (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Realm') THEN
        CREATE TABLE "Realm" (
            "id" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "code" TEXT NOT NULL,
            "ownerId" TEXT NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            
            CONSTRAINT "Realm_pkey" PRIMARY KEY ("id")
        );
    END IF;
END $$;

-- CreateTable (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'RealmMember') THEN
        CREATE TABLE "RealmMember" (

            "id" TEXT NOT NULL,
            "realmId" TEXT NOT NULL,
            "userId" TEXT NOT NULL,
            "role" "RealmRole" NOT NULL DEFAULT 'MEMBER',
            "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            
            CONSTRAINT "RealmMember_pkey" PRIMARY KEY ("id")
        );
    END IF;
END $$;

-- Add realmId columns as nullable first (only if tables exist)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Resource') THEN
        ALTER TABLE "Resource" ADD COLUMN IF NOT EXISTS "realmId" TEXT;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'City') THEN
        ALTER TABLE "City" ADD COLUMN IF NOT EXISTS "realmId" TEXT;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Army') THEN
        ALTER TABLE "Army" ADD COLUMN IF NOT EXISTS "realmId" TEXT;
    END IF;
END $$;

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
    
    -- If no users exist, skip the data migration
    IF default_owner_id IS NULL THEN
        RETURN;
    END IF;

    -- Check if "Imperium Fragmentum" realm already exists
    IF NOT EXISTS (SELECT 1 FROM "Realm" WHERE "name" = 'Imperium Fragmentum' OR "code" = default_realm_code) THEN
        -- Ensure code is unique
        WHILE EXISTS (SELECT 1 FROM "Realm" WHERE "code" = default_realm_code) LOOP
            default_realm_code := SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6);
        END LOOP;
        
        -- Create the default "Imperium Fragmentum" realm
        INSERT INTO "Realm" ("id", "name", "code", "ownerId", "createdAt", "updatedAt")
        VALUES (default_realm_id, 'Imperium Fragmentum', default_realm_code, default_owner_id, NOW(), NOW())
        ON CONFLICT DO NOTHING;
    ELSE
        -- Get the existing realm ID
        SELECT "id" INTO default_realm_id FROM "Realm" WHERE "name" = 'Imperium Fragmentum' OR "code" = default_realm_code LIMIT 1;
    END IF;

    -- Make all existing users members of the default realm (only if not already members)
    INSERT INTO "RealmMember" ("id", "realmId", "userId", "role", "joinedAt")
    SELECT gen_random_uuid()::TEXT, default_realm_id, "id", 'MEMBER', NOW()
    FROM "User"
    WHERE NOT EXISTS (
        SELECT 1 FROM "RealmMember" rm 
        WHERE rm."realmId" = default_realm_id AND rm."userId" = "User"."id"
    )
    ON CONFLICT DO NOTHING;

    -- The realm owner should be OWNER role
    UPDATE "RealmMember" 
    SET "role" = 'OWNER' 
    WHERE "realmId" = default_realm_id AND "userId" = default_owner_id;

    -- For each existing Resource, create a new one in the realm (or update if strategy allows)
    -- Since we're migrating existing data, we'll move the existing resource to the realm
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Resource') THEN
        UPDATE "Resource" SET "realmId" = default_realm_id WHERE "realmId" IS NULL;

        -- Create resources for users who don't have any yet
        INSERT INTO "Resource" ("id", "userId", "realmId", "wood", "stone", "food", "currency", "metal", "livestock")
        SELECT 
            gen_random_uuid()::TEXT,
            u."id",
            default_realm_id,
            0, 0, 0, 0, 0, 0
        FROM "User" u
        WHERE NOT EXISTS (
            SELECT 1 FROM "Resource" res 
            WHERE res."userId" = u."id" AND res."realmId" = default_realm_id
        );
    END IF;

    -- Update all existing Cities to point to this realm
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'City') THEN
        UPDATE "City" SET "realmId" = default_realm_id WHERE "realmId" IS NULL;
    END IF;

    -- Update all existing Armies to point to this realm
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Army') THEN
        UPDATE "Army" SET "realmId" = default_realm_id WHERE "realmId" IS NULL;
    END IF;

    -- Now make realmId columns required (only if they're still nullable)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Resource') THEN
        -- Ensure all Resources have a realmId
        UPDATE "Resource" SET "realmId" = default_realm_id WHERE "realmId" IS NULL;
        
        -- Only make NOT NULL if column is still nullable
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Resource' AND column_name = 'realmId' AND is_nullable = 'YES') THEN
            ALTER TABLE "Resource" ALTER COLUMN "realmId" SET NOT NULL;
        END IF;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'City') THEN
        -- Ensure all Cities have a realmId
        UPDATE "City" SET "realmId" = default_realm_id WHERE "realmId" IS NULL;
        
        -- Only make NOT NULL if column is still nullable
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'City' AND column_name = 'realmId' AND is_nullable = 'YES') THEN
            ALTER TABLE "City" ALTER COLUMN "realmId" SET NOT NULL;
        END IF;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Army') THEN
        -- Ensure all Armies have a realmId
        UPDATE "Army" SET "realmId" = default_realm_id WHERE "realmId" IS NULL;
        
        -- Only make NOT NULL if column is still nullable
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Army' AND column_name = 'realmId' AND is_nullable = 'YES') THEN
            ALTER TABLE "Army" ALTER COLUMN "realmId" SET NOT NULL;
        END IF;
    END IF;
END $$;

-- CreateIndex (if they don't exist)
CREATE INDEX IF NOT EXISTS "RealmMember_userId_idx" ON "RealmMember"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "RealmMember_realmId_idx" ON "RealmMember"("realmId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "RealmMember_realmId_userId_key" ON "RealmMember"("realmId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Realm_code_key" ON "Realm"("code");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Resource_realmId_userId_key" ON "Resource"("realmId", "userId");

-- Drop old unique constraint on Resource.userId if it exists
ALTER TABLE "Resource" DROP CONSTRAINT IF EXISTS "Resource_userId_key";

-- AddForeignKey (if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'Realm_ownerId_fkey' AND table_name = 'Realm') THEN
        ALTER TABLE "Realm" ADD CONSTRAINT "Realm_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'RealmMember_realmId_fkey' AND table_name = 'RealmMember') THEN
        ALTER TABLE "RealmMember" ADD CONSTRAINT "RealmMember_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'RealmMember_userId_fkey' AND table_name = 'RealmMember') THEN
        ALTER TABLE "RealmMember" ADD CONSTRAINT "RealmMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'Resource_realmId_fkey' AND table_name = 'Resource') THEN
        ALTER TABLE "Resource" ADD CONSTRAINT "Resource_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'City_realmId_fkey' AND table_name = 'City') THEN
        ALTER TABLE "City" ADD CONSTRAINT "City_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'Army_realmId_fkey' AND table_name = 'Army') THEN
        ALTER TABLE "Army" ADD CONSTRAINT "Army_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

