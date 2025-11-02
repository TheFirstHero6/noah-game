-- Production migration: Add realms system while preserving all existing data
-- This migration safely adds realms to production database

-- Step 1: Create RealmRole enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "RealmRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 2: Create Realm table if it doesn't exist
CREATE TABLE IF NOT EXISTS "Realm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Realm_pkey" PRIMARY KEY ("id")
);

-- Step 3: Create RealmMember table if it doesn't exist
CREATE TABLE IF NOT EXISTS "RealmMember" (
    "id" TEXT NOT NULL,
    "realmId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "RealmRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RealmMember_pkey" PRIMARY KEY ("id")
);

-- Step 4: Add realmId columns as nullable (if they don't exist)
DO $$ 
BEGIN
    -- Add realmId to Resource if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Resource' AND column_name = 'realmId') THEN
        ALTER TABLE "Resource" ADD COLUMN "realmId" TEXT;
    END IF;
    
    -- Add realmId to City if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'City' AND column_name = 'realmId') THEN
        ALTER TABLE "City" ADD COLUMN "realmId" TEXT;
    END IF;
    
    -- Add realmId to Army if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Army' AND column_name = 'realmId') THEN
        ALTER TABLE "Army" ADD COLUMN "realmId" TEXT;
    END IF;
END $$;

-- Step 5: Migrate existing data to default "Imperium Fragmentum" realm
DO $$
DECLARE
    default_owner_id TEXT;
    default_realm_id TEXT;
    default_realm_code TEXT := 'IMPERI';
    realm_exists BOOLEAN;
BEGIN
    -- Check if any users exist
    SELECT "id" INTO default_owner_id FROM "User" LIMIT 1;
    
    -- If no users exist, skip data migration
    IF default_owner_id IS NULL THEN
        RAISE NOTICE 'No users found, skipping data migration';
        RETURN;
    END IF;
    
    -- Check if "Imperium Fragmentum" realm already exists
    SELECT EXISTS(SELECT 1 FROM "Realm" WHERE "name" = 'Imperium Fragmentum' OR "code" = default_realm_code) INTO realm_exists;
    
    IF NOT realm_exists THEN
        -- Generate a unique realm ID
        default_realm_id := gen_random_uuid()::TEXT;
        
        -- Ensure code is unique (in case IMPERI is taken)
        WHILE EXISTS(SELECT 1 FROM "Realm" WHERE "code" = default_realm_code) LOOP
            default_realm_code := SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6);
        END LOOP;
        
        -- Create the default "Imperium Fragmentum" realm
        INSERT INTO "Realm" ("id", "name", "code", "ownerId", "createdAt", "updatedAt")
        VALUES (default_realm_id, 'Imperium Fragmentum', default_realm_code, default_owner_id, NOW(), NOW())
        ON CONFLICT DO NOTHING;
        
        -- Make all existing users members of the default realm
        -- Use INSERT ... ON CONFLICT to avoid duplicates
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
        
        -- Update all existing Resources to point to this realm (only if realmId is NULL)
        UPDATE "Resource" 
        SET "realmId" = default_realm_id 
        WHERE "realmId" IS NULL;
        
        -- Create resources for users who don't have any yet in this realm
        INSERT INTO "Resource" ("id", "userId", "realmId", "wood", "stone", "food", "currency", "metal", "livestock")
        SELECT 
            gen_random_uuid()::TEXT,
            u."id",
            default_realm_id,
            COALESCE((SELECT "wood" FROM "Resource" WHERE "userId" = u."id" AND "realmId" IS NULL LIMIT 1), 0),
            COALESCE((SELECT "stone" FROM "Resource" WHERE "userId" = u."id" AND "realmId" IS NULL LIMIT 1), 0),
            COALESCE((SELECT "food" FROM "Resource" WHERE "userId" = u."id" AND "realmId" IS NULL LIMIT 1), 0),
            COALESCE((SELECT "currency" FROM "Resource" WHERE "userId" = u."id" AND "realmId" IS NULL LIMIT 1), 0.0),
            COALESCE((SELECT "metal" FROM "Resource" WHERE "userId" = u."id" AND "realmId" IS NULL LIMIT 1), 0),
            COALESCE((SELECT "livestock" FROM "Resource" WHERE "userId" = u."id" AND "realmId" IS NULL LIMIT 1), 0)
        FROM "User" u
        WHERE NOT EXISTS (
            SELECT 1 FROM "Resource" res 
            WHERE res."userId" = u."id" AND res."realmId" = default_realm_id
        );
        
        -- Update all existing Cities to point to this realm (only if realmId is NULL)
        UPDATE "City" 
        SET "realmId" = default_realm_id 
        WHERE "realmId" IS NULL;
        
        -- Update all existing Armies to point to this realm (only if realmId is NULL)
        UPDATE "Army" 
        SET "realmId" = default_realm_id 
        WHERE "realmId" IS NULL;
        
        RAISE NOTICE 'Created default realm and migrated existing data';
    ELSE
        RAISE NOTICE 'Imperium Fragmentum realm already exists, skipping creation';
    END IF;
END $$;

-- Step 6: Drop old unique constraint on Resource.userId if it exists
-- This must happen BEFORE we make realmId NOT NULL
DO $$ 
BEGIN
    -- Drop constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'Resource_userId_key' AND table_name = 'Resource'
    ) THEN
        ALTER TABLE "Resource" DROP CONSTRAINT "Resource_userId_key";
        RAISE NOTICE 'Dropped old Resource_userId_key constraint';
    END IF;
    
    -- Drop unique index if it exists
    IF EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'Resource_userId_key' AND tablename = 'Resource'
    ) THEN
        DROP INDEX IF EXISTS "Resource_userId_key";
        RAISE NOTICE 'Dropped old Resource_userId_key index';
    END IF;
END $$;

-- Step 7: Make realmId columns required (only if they're still nullable)
DO $$ 
BEGIN
    -- Check and make Resource.realmId NOT NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Resource' AND column_name = 'realmId' AND is_nullable = 'YES'
    ) THEN
        -- First ensure all rows have a realmId
        UPDATE "Resource" SET "realmId" = (
            SELECT "id" FROM "Realm" WHERE "name" = 'Imperium Fragmentum' LIMIT 1
        ) WHERE "realmId" IS NULL;
        
        ALTER TABLE "Resource" ALTER COLUMN "realmId" SET NOT NULL;
        RAISE NOTICE 'Made Resource.realmId NOT NULL';
    END IF;
    
    -- Check and make City.realmId NOT NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'City' AND column_name = 'realmId' AND is_nullable = 'YES'
    ) THEN
        -- First ensure all rows have a realmId
        UPDATE "City" SET "realmId" = (
            SELECT "id" FROM "Realm" WHERE "name" = 'Imperium Fragmentum' LIMIT 1
        ) WHERE "realmId" IS NULL;
        
        ALTER TABLE "City" ALTER COLUMN "realmId" SET NOT NULL;
        RAISE NOTICE 'Made City.realmId NOT NULL';
    END IF;
    
    -- Check and make Army.realmId NOT NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Army' AND column_name = 'realmId' AND is_nullable = 'YES'
    ) THEN
        -- First ensure all rows have a realmId
        UPDATE "Army" SET "realmId" = (
            SELECT "id" FROM "Realm" WHERE "name" = 'Imperium Fragmentum' LIMIT 1
        ) WHERE "realmId" IS NULL;
        
        ALTER TABLE "Army" ALTER COLUMN "realmId" SET NOT NULL;
        RAISE NOTICE 'Made Army.realmId NOT NULL';
    END IF;
END $$;

-- Step 8: Create indexes (if they don't exist)
CREATE INDEX IF NOT EXISTS "RealmMember_userId_idx" ON "RealmMember"("userId");
CREATE INDEX IF NOT EXISTS "RealmMember_realmId_idx" ON "RealmMember"("realmId");
CREATE UNIQUE INDEX IF NOT EXISTS "RealmMember_realmId_userId_key" ON "RealmMember"("realmId", "userId");
CREATE UNIQUE INDEX IF NOT EXISTS "Realm_code_key" ON "Realm"("code");
CREATE UNIQUE INDEX IF NOT EXISTS "Resource_realmId_userId_key" ON "Resource"("realmId", "userId");

-- Step 9: Add foreign key constraints (if they don't exist)
DO $$ 
BEGIN
    -- Realm.ownerId foreign key
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'Realm_ownerId_fkey' AND table_name = 'Realm'
    ) THEN
        ALTER TABLE "Realm" ADD CONSTRAINT "Realm_ownerId_fkey" 
            FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
    
    -- RealmMember foreign keys
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'RealmMember_realmId_fkey' AND table_name = 'RealmMember'
    ) THEN
        ALTER TABLE "RealmMember" ADD CONSTRAINT "RealmMember_realmId_fkey" 
            FOREIGN KEY ("realmId") REFERENCES "Realm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'RealmMember_userId_fkey' AND table_name = 'RealmMember'
    ) THEN
        ALTER TABLE "RealmMember" ADD CONSTRAINT "RealmMember_userId_fkey" 
            FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    
    -- Resource.realmId foreign key
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'Resource_realmId_fkey' AND table_name = 'Resource'
    ) THEN
        ALTER TABLE "Resource" ADD CONSTRAINT "Resource_realmId_fkey" 
            FOREIGN KEY ("realmId") REFERENCES "Realm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    
    -- City.realmId foreign key
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'City_realmId_fkey' AND table_name = 'City'
    ) THEN
        ALTER TABLE "City" ADD CONSTRAINT "City_realmId_fkey" 
            FOREIGN KEY ("realmId") REFERENCES "Realm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    
    -- Army.realmId foreign key
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'Army_realmId_fkey' AND table_name = 'Army'
    ) THEN
        ALTER TABLE "Army" ADD CONSTRAINT "Army_realmId_fkey" 
            FOREIGN KEY ("realmId") REFERENCES "Realm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

