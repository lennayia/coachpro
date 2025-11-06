-- =====================================================
-- Debug: Check Current RLS Policies
-- =====================================================

-- List all policies on coachpro_client_profiles
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

-- Check if RLS is enabled
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'coachpro_client_profiles';
