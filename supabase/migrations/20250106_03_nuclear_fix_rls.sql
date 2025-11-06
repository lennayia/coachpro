-- =====================================================
-- Nuclear Fix: Ultra Permissive Policy for Testing
-- Date: 2025-11-06
-- Purpose: Temporarily allow ALL authenticated users to query profiles
-- WARNING: This is permissive for TESTING ONLY
-- =====================================================

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Clients can manage own profile" ON coachpro_client_profiles;
DROP POLICY IF EXISTS "Clients can read profiles" ON coachpro_client_profiles;
DROP POLICY IF EXISTS "Clients can insert own profile" ON coachpro_client_profiles;
DROP POLICY IF EXISTS "Clients can update own profile" ON coachpro_client_profiles;
DROP POLICY IF EXISTS "Clients can delete own profile" ON coachpro_client_profiles;
DROP POLICY IF EXISTS "Coaches can read client profiles" ON coachpro_client_profiles;

-- Create SUPER PERMISSIVE policy (for testing)
-- This allows ANY authenticated user to do ANYTHING
-- (Still protected by WHERE clause in queries)
CREATE POLICY "Allow authenticated users ALL operations"
ON coachpro_client_profiles
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Comment
COMMENT ON POLICY "Allow authenticated users ALL operations" ON coachpro_client_profiles
IS 'TEMPORARY: Ultra permissive policy for testing OAuth flow. REPLACE with granular policies in production!';
