-- =====================================================
-- Migration: Restore Proper RLS Policies
-- Date: 2025-01-06
-- Purpose: Replace ultra-permissive policy with proper granular RLS
-- =====================================================

-- =====================================
-- 1. CLIENT PROFILES - Granular Policies
-- =====================================

-- Drop ultra-permissive testing policy
DROP POLICY IF EXISTS "Allow authenticated users ALL operations" ON coachpro_client_profiles;

-- Policy 1: SELECT - Clients can read own profile
CREATE POLICY "Clients can read own profile"
ON coachpro_client_profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = auth_user_id
);

-- Policy 2: INSERT - Clients can create own profile
CREATE POLICY "Clients can insert own profile"
ON coachpro_client_profiles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = auth_user_id
);

-- Policy 3: UPDATE - Clients can update own profile
CREATE POLICY "Clients can update own profile"
ON coachpro_client_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = auth_user_id)
WITH CHECK (auth.uid() = auth_user_id);

-- Policy 4: DELETE - Clients can delete own profile (optional)
CREATE POLICY "Clients can delete own profile"
ON coachpro_client_profiles
FOR DELETE
TO authenticated
USING (auth.uid() = auth_user_id);

-- =====================================
-- 2. TESTERS TABLE - Admin Access
-- =====================================

-- Enable RLS on testers table
ALTER TABLE testers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Admins can manage testers" ON testers;
DROP POLICY IF EXISTS "Public can insert testers" ON testers;

-- Policy 1: Allow public INSERT (for signup form)
CREATE POLICY "Public can insert testers"
ON testers
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy 2: Allow admin to read ALL testers
-- Admin = user with email 'lenkaroubalka@gmail.com'
CREATE POLICY "Admin can read all testers"
ON testers
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email = 'lenkaroubalka@gmail.com'
  )
);

-- Policy 3: Allow admin to update testers
CREATE POLICY "Admin can update testers"
ON testers
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email = 'lenkaroubalka@gmail.com'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email = 'lenkaroubalka@gmail.com'
  )
);

-- Policy 4: Allow admin to delete testers
CREATE POLICY "Admin can delete testers"
ON testers
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email = 'lenkaroubalka@gmail.com'
  )
);

-- Comments
COMMENT ON POLICY "Clients can read own profile" ON coachpro_client_profiles
IS 'Clients can only read their own profile';

COMMENT ON POLICY "Clients can insert own profile" ON coachpro_client_profiles
IS 'Clients can create their profile during signup';

COMMENT ON POLICY "Clients can update own profile" ON coachpro_client_profiles
IS 'Clients can update their own profile';

COMMENT ON POLICY "Public can insert testers" ON testers
IS 'Allow public signup form to create tester records';

COMMENT ON POLICY "Admin can read all testers" ON testers
IS 'Admin (lenkaroubalka@gmail.com) can view all tester registrations';

-- Verification Query (uncomment to test after running):
-- SELECT * FROM coachpro_client_profiles WHERE auth_user_id = auth.uid();
-- SELECT * FROM testers; -- Should work ONLY for admin
