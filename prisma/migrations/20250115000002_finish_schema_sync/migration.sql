-- Step 3: Update default value for RealmMember.role to BASIC
ALTER TABLE "RealmMember" ALTER COLUMN "role" SET DEFAULT 'BASIC';

-- Step 4: Ensure realm owners have OWNER role in RealmMember
-- First, create RealmMember entries for owners who don't have one
INSERT INTO "RealmMember" (id, "realmId", "userId", role, "joinedAt")
SELECT 
  gen_random_uuid()::text,
  r.id,
  r."ownerId",
  'OWNER',
  COALESCE(r."createdAt", NOW())
FROM "Realm" r
WHERE NOT EXISTS (
  SELECT 1 FROM "RealmMember" rm 
  WHERE rm."realmId" = r.id AND rm."userId" = r."ownerId"
)
ON CONFLICT DO NOTHING;

-- Update existing memberships for owners to OWNER role
UPDATE "RealmMember" rm
SET role = 'OWNER'
FROM "Realm" r
WHERE rm."realmId" = r.id 
  AND rm."userId" = r."ownerId"
  AND rm.role != 'OWNER';

-- Step 5: Add Realm.logo column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Realm' AND column_name = 'logo'
  ) THEN
    ALTER TABLE "Realm" ADD COLUMN "logo" TEXT;
  END IF;
END $$;

-- Step 6: Remove User.role column if it exists (we're using realm-scoped roles only)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'User' AND column_name = 'role'
  ) THEN
    ALTER TABLE "User" DROP COLUMN "role";
  END IF;
END $$;

-- Step 7: Drop Role enum if it exists and is no longer used
DO $$
BEGIN
  -- Check if Role enum exists and has no dependencies
  IF EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'Role'
  ) THEN
    -- Check if any table columns reference it
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE udt_name = 'Role'
    ) THEN
      DROP TYPE "Role";
    END IF;
  END IF;
END $$;

