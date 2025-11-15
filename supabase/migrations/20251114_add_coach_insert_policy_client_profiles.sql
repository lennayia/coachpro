-- Add policy for coaches to create client profiles
-- Migration: 20251114 - Allow coaches to create client profiles for their paid clients

-- Policy: Coaches can create client profiles (for paid clients with membership/program access)
CREATE POLICY "Coaches can create client profiles"
ON coachpro_client_profiles
FOR INSERT
TO authenticated
WITH CHECK (
  -- Check that the user is a coach
  EXISTS (
    SELECT 1 FROM coachpro_coaches
    WHERE auth_user_id = auth.uid()
  )
);

COMMENT ON POLICY "Coaches can create client profiles" ON coachpro_client_profiles
IS 'Allows coaches to create client profiles for their paid clients (membership/program access)';
