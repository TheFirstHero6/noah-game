-- Step 2: Update existing RealmMember roles from MEMBER to BASIC
-- This runs in a separate transaction after BASIC enum value is committed
DO $$
BEGIN
  -- Check if we need to update (MEMBER exists and BASIC exists)
  IF EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'MEMBER' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'RealmRole')
  ) AND EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'BASIC' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'RealmRole')
  ) THEN
    -- Use text casting through a temporary approach
    -- First, change the column type temporarily to text
    ALTER TABLE "RealmMember" ALTER COLUMN "role" TYPE TEXT USING role::TEXT;
    -- Update the values
    UPDATE "RealmMember" SET "role" = 'BASIC' WHERE "role" = 'MEMBER';
    -- Change back to enum
    ALTER TABLE "RealmMember" ALTER COLUMN "role" TYPE "RealmRole" USING "role"::"RealmRole";
  END IF;
END $$;

