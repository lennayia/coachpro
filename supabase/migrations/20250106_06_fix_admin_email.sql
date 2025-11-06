-- =====================================================
-- Migration: Fix Admin Email in RLS Policies
-- Date: 2025-01-06
-- Purpose: Change admin email from lenkaroubalka@gmail.com to lenna@online-byznys.cz
-- =====================================================

-- Drop existing admin policies
DROP POLICY IF EXISTS "Admin can read all testers" ON testers;
DROP POLICY IF EXISTS "Admin can update testers" ON testers;
DROP POLICY IF EXISTS "Admin can delete testers" ON testers;

-- Recreate policies with CORRECT admin email
-- Admin = lenna@online-byznys.cz (NOT lenkaroubalka@gmail.com!)

-- Policy 1: Admin can read all testers
CREATE POLICY "Admin can read all testers"
ON testers
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email = 'lenna@online-byznys.cz'
  )
);

-- Policy 2: Admin can update testers
CREATE POLICY "Admin can update testers"
ON testers
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email = 'lenna@online-byznys.cz'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email = 'lenna@online-byznys.cz'
  )
);

-- Policy 3: Admin can delete testers
CREATE POLICY "Admin can delete testers"
ON testers
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email = 'lenna@online-byznys.cz'
  )
);

-- Comments
COMMENT ON POLICY "Admin can read all testers" ON testers
IS 'Admin (lenna@online-byznys.cz) can view all tester registrations';

COMMENT ON POLICY "Admin can update testers" ON testers
IS 'Admin (lenna@online-byznys.cz) can update tester records';

COMMENT ON POLICY "Admin can delete testers" ON testers
IS 'Admin (lenna@online-byznys.cz) can delete tester records';
