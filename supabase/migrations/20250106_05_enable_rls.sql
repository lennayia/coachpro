-- =====================================================
-- Migration: Enable RLS on Client Profiles
-- Date: 2025-01-06
-- Purpose: Turn ON Row Level Security (was disabled by nuclear fix)
-- =====================================================

-- Enable RLS on coachpro_client_profiles
ALTER TABLE coachpro_client_profiles ENABLE ROW LEVEL SECURITY;

-- Verify
SELECT
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'coachpro_client_profiles';
