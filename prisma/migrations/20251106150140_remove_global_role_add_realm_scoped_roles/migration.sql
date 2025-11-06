-- Step 1: Add BASIC to RealmRole enum if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'BASIC' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'RealmRole')
  ) THEN
    ALTER TYPE "RealmRole" ADD VALUE 'BASIC';
  END IF;
END $$;

-- Step 2: Update existing RealmMember roles from MEMBER to BASIC
-- We use a function to work around the enum transaction limitation
CREATE OR REPLACE FUNCTION update_member_to_basic() RETURNS void AS $$
BEGIN
  UPDATE "RealmMember" 
  SET role = 'BASIC'::text::"RealmRole"
  WHERE role::text = 'MEMBER';
END;
$$ LANGUAGE plpgsql;

SELECT update_member_to_basic();
DROP FUNCTION update_member_to_basic();

-- Step 3: Ensure realm owners have OWNER role in RealmMember
-- First, create RealmMember entries for owners who don't have one
INSERT INTO "RealmMember" (id, "realmId", "userId", role, "joinedAt")
SELECT 
  gen_random_uuid()::text,
  r.id,
  r."ownerId",
  'OWNER',
  r."createdAt"
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

-- Step 4: Drop the role column from User table
ALTER TABLE "User" DROP COLUMN IF EXISTS role;

