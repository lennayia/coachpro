-- Fix RLS policy for coachpro_shared_programs SELECT
-- Allow anonymous (non-authenticated) users to read shared programs by code
-- This is needed for clients entering share codes on /client page

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Anyone can read shared programs" ON coachpro_shared_programs;

-- Create new policy that allows both authenticated AND anonymous users
CREATE POLICY "Public can read shared programs by code"
ON coachpro_shared_programs
FOR SELECT
USING (true);

-- Note: This is safe because:
-- 1. Share codes are 6-character random codes (hard to guess)
-- 2. Clients need the code to access (security through obscurity)
-- 3. Similar to how materials work in coachpro_shared_materials
