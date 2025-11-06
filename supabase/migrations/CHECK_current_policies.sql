-- =====================================================
-- Check Current RLS Policies
-- Date: 2025-01-06
-- Purpose: Verify which policies are currently active
-- =====================================================

-- Check all policies on coachpro_client_profiles
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'coachpro_client_profiles'
ORDER BY policyname;

-- Check all policies on testers table
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'testers'
ORDER BY policyname;

-- Check if RLS is enabled
SELECT
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('coachpro_client_profiles', 'testers');
