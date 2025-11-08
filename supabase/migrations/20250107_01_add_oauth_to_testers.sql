-- Add OAuth support to testers table
-- Migration: 20250107_01 - Enable Google OAuth for testers

-- Add auth_user_id column (nullable for backward compatibility with access_code testers)
ALTER TABLE testers
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create unique index for auth_user_id (replaces constraint - supports IF NOT EXISTS)
CREATE UNIQUE INDEX IF NOT EXISTS idx_testers_auth_user_unique
ON testers(auth_user_id);

-- Create index for fast auth lookups (non-unique, for RLS)
CREATE INDEX IF NOT EXISTS idx_testers_auth_user
ON testers(auth_user_id);

-- Update RLS policies to support both OAuth and access_code testers

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public signup" ON testers;
DROP POLICY IF EXISTS "Allow public select by access_code" ON testers;
DROP POLICY IF EXISTS "Allow public update last_login" ON testers;
DROP POLICY IF EXISTS "Anyone can signup as tester" ON testers;
DROP POLICY IF EXISTS "Testers can read own data" ON testers;
DROP POLICY IF EXISTS "Testers can update own data" ON testers;
DROP POLICY IF EXISTS "Admin can read all testers" ON testers;

-- New policies

-- Policy: Anyone can insert (for both OAuth and access_code signup)
CREATE POLICY "Anyone can signup as tester"
ON testers
FOR INSERT
WITH CHECK (true);

-- Policy: Testers can read their own data (OAuth or by access_code)
CREATE POLICY "Testers can read own data"
ON testers
FOR SELECT
USING (
  auth_user_id = auth.uid() -- OAuth tester
  OR access_code IS NOT NULL -- Access code tester (for login verification)
);

-- Policy: Testers can update their own data
CREATE POLICY "Testers can update own data"
ON testers
FOR UPDATE
USING (
  auth_user_id = auth.uid()
);

-- Policy: Admin can read all testers (for TesterManagement)
CREATE POLICY "Admin can read all testers"
ON testers
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM coachpro_coaches
    WHERE id = auth.uid()::text
    AND is_admin = true
  )
);

-- Comments
COMMENT ON COLUMN testers.auth_user_id IS 'Reference to Supabase auth.users (null for access_code testers)';

-- Grant permissions (ensure OAuth users can access)
GRANT SELECT, INSERT, UPDATE ON testers TO authenticated;
GRANT SELECT, INSERT ON testers TO anon;
