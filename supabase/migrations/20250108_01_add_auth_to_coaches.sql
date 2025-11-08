-- =====================================================
-- Migration: Add auth_user_id to coachpro_coaches
-- Date: 2025-01-08
-- Purpose: Link coaches to Supabase Auth for RLS filtering
-- =====================================================

-- =====================================
-- 1. Add auth_user_id column (if not exists)
-- =====================================

DO $$
BEGIN
  -- Check if column already exists
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'coachpro_coaches'
    AND column_name = 'auth_user_id'
  ) THEN
    -- Add column
    ALTER TABLE coachpro_coaches
    ADD COLUMN auth_user_id UUID REFERENCES auth.users(id);

    -- Create index for faster lookups
    CREATE INDEX idx_coachpro_coaches_auth_user_id
    ON coachpro_coaches(auth_user_id);

    -- Add comment
    COMMENT ON COLUMN coachpro_coaches.auth_user_id
    IS 'Link to Supabase Auth user (for OAuth testers/admins). Nullable for access-code based testers.';
  END IF;
END $$;

-- =====================================
-- 2. Verification Query (uncomment to test)
-- =====================================

-- Check column was added:
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'coachpro_coaches'
-- AND column_name = 'auth_user_id';

-- Check index was created:
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename = 'coachpro_coaches'
-- AND indexname = 'idx_coachpro_coaches_auth_user_id';
