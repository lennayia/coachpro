-- Fix RLS policy for client_profiles SELECT
-- Migration: 20251115 - Allow coaches to read all client profiles (needed for validation)

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Coaches can read client profiles" ON coachpro_client_profiles;

-- Create new policy: Coaches can read all client profiles
-- (Needed for validating client existence when sharing content)
CREATE POLICY "Coaches can read all client profiles"
ON coachpro_client_profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM coachpro_coaches
    WHERE auth_user_id = auth.uid()
  )
);

COMMENT ON POLICY "Coaches can read all client profiles" ON coachpro_client_profiles
IS 'Allows coaches to read all client profiles for validation when sharing content';
