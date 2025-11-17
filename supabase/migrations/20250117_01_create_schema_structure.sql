-- =====================================================
-- ProApp Multi-tenant Schema Structure
-- =====================================================
-- Creates separate schemas for each application
-- and shared resources across all apps

-- =====================================================
-- 1. Create Schemas
-- =====================================================

-- Shared schema for cross-app resources
CREATE SCHEMA IF NOT EXISTS public;

-- CoachPro application schema
CREATE SCHEMA IF NOT EXISTS coachpro;

-- LifePro application schema
CREATE SCHEMA IF NOT EXISTS lifepro;

-- DigiPro application schema (future)
CREATE SCHEMA IF NOT EXISTS digipro;

-- =====================================================
-- 2. Grant Permissions
-- =====================================================

-- Allow authenticated users to use all schemas
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA coachpro TO authenticated;
GRANT USAGE ON SCHEMA lifepro TO authenticated;
GRANT USAGE ON SCHEMA digipro TO authenticated;

-- Allow anon users to read public schema (for landing pages, etc.)
GRANT USAGE ON SCHEMA public TO anon;

-- =====================================================
-- 3. Set Default Search Path (optional)
-- =====================================================
-- This allows queries without schema prefix when accessing public tables
-- Example: SELECT * FROM users instead of SELECT * FROM public.users

-- For each role, set search path
ALTER ROLE authenticated SET search_path TO public, coachpro, lifepro, digipro;
ALTER ROLE anon SET search_path TO public;

-- =====================================================
-- 4. Comments
-- =====================================================

COMMENT ON SCHEMA public IS 'Shared resources across all ProApp applications (auth, payments, notifications)';
COMMENT ON SCHEMA coachpro IS 'CoachPro - Coaching management platform';
COMMENT ON SCHEMA lifepro IS 'LifePro - Life purpose discovery platform';
COMMENT ON SCHEMA digipro IS 'DigiPro - Digital products platform (future)';

-- =====================================================
-- Verification
-- =====================================================

-- List all schemas
SELECT schema_name
FROM information_schema.schemata
WHERE schema_name IN ('public', 'coachpro', 'lifepro', 'digipro')
ORDER BY schema_name;
