-- =====================================================
-- Migration: Add coach_id to client_profiles
-- Date: 2025-01-16
-- Purpose: Enable client-coach relationship tracking
-- =====================================================

-- Add coach_id column to coachpro_client_profiles
ALTER TABLE coachpro_client_profiles
ADD COLUMN IF NOT EXISTS coach_id TEXT REFERENCES coachpro_coaches(id) ON DELETE SET NULL;

-- Create index for fast coach-client lookups
CREATE INDEX IF NOT EXISTS idx_client_profiles_coach_id
ON coachpro_client_profiles(coach_id);

-- Add comment
COMMENT ON COLUMN coachpro_client_profiles.coach_id IS 'Primary coach assigned to this client (optional - clients can have multiple coaches via sessions/materials)';

-- Update RLS policy: Coaches can read profiles of their assigned clients
DROP POLICY IF EXISTS "Coaches can read assigned client profiles" ON coachpro_client_profiles;

CREATE POLICY "Coaches can read assigned client profiles"
ON coachpro_client_profiles
FOR SELECT
TO authenticated
USING (
  -- Coach can read if they are assigned as primary coach
  coach_id IN (
    SELECT id FROM coachpro_coaches WHERE auth_user_id = auth.uid()
  )
  OR
  -- Coach can read if they have shared materials/programs/sessions with this client
  EXISTS (
    SELECT 1 FROM coachpro_shared_materials sm
    INNER JOIN coachpro_coaches c ON sm.coach_id = c.id
    WHERE sm.client_email = coachpro_client_profiles.email
    AND c.auth_user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM coachpro_sessions s
    INNER JOIN coachpro_coaches c ON s.coach_id = c.id
    WHERE s.client_id = coachpro_client_profiles.id
    AND c.auth_user_id = auth.uid()
  )
);
