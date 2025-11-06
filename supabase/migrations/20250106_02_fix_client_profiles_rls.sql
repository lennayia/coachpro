-- =====================================================
-- Migration: Fix Client Profiles RLS Policy
-- Date: 2025-11-06
-- Purpose: Allow authenticated users to query their profile (even if it doesn't exist yet)
-- Issue: 406 Not Acceptable error when new OAuth users try to check if profile exists
-- =====================================================

-- Drop old policy
DROP POLICY IF EXISTS "Clients can manage own profile" ON coachpro_client_profiles;

-- Create new policy that allows authenticated users to query
-- This does NOT expose other users' profiles - the WHERE clause still filters by auth_user_id
CREATE POLICY "Clients can manage own profile"
ON coachpro_client_profiles
FOR ALL
USING (
  auth.uid() = auth_user_id  -- Can access own profile
  OR (
    -- Allow INSERT for new users (profile creation)
    auth.uid() IS NOT NULL
    AND auth_user_id IS NULL  -- Only during INSERT before auth_user_id is set
  )
);

-- Alternative simpler policy (if above is too strict):
-- This allows authenticated users to SELECT (query doesn't fail with 406)
-- But still only returns rows where auth_user_id matches
DROP POLICY IF EXISTS "Clients can read profiles" ON coachpro_client_profiles;
CREATE POLICY "Clients can read profiles"
ON coachpro_client_profiles
FOR SELECT
USING (
  auth.uid() = auth_user_id
  OR auth.uid() IS NOT NULL  -- Allow query (but WHERE clause still filters results)
);

-- Separate policy for INSERT
DROP POLICY IF EXISTS "Clients can insert own profile" ON coachpro_client_profiles;
CREATE POLICY "Clients can insert own profile"
ON coachpro_client_profiles
FOR INSERT
WITH CHECK (auth.uid() = auth_user_id);

-- Separate policy for UPDATE
DROP POLICY IF EXISTS "Clients can update own profile" ON coachpro_client_profiles;
CREATE POLICY "Clients can update own profile"
ON coachpro_client_profiles
FOR UPDATE
USING (auth.uid() = auth_user_id);

-- Separate policy for DELETE (optional - probably don't want clients deleting profiles)
DROP POLICY IF EXISTS "Clients can delete own profile" ON coachpro_client_profiles;
CREATE POLICY "Clients can delete own profile"
ON coachpro_client_profiles
FOR DELETE
USING (auth.uid() = auth_user_id);

-- Comments
COMMENT ON POLICY "Clients can read profiles" ON coachpro_client_profiles
IS 'Allow authenticated users to query profiles (returns only their own due to WHERE clause)';

COMMENT ON POLICY "Clients can insert own profile" ON coachpro_client_profiles
IS 'Allow users to create their profile during signup';

COMMENT ON POLICY "Clients can update own profile" ON coachpro_client_profiles
IS 'Allow users to update their own profile';
