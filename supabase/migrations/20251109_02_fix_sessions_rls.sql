-- Migration: 20251109_02 - Fix RLS policies for coachpro_sessions
-- Author: Claude Code
-- Date: 2025-11-09
-- Description: Fix 406 error by simplifying RLS policies

-- Drop existing policies
DROP POLICY IF EXISTS "Clients can view own sessions" ON coachpro_sessions;
DROP POLICY IF EXISTS "Clients can update own session notes" ON coachpro_sessions;
DROP POLICY IF EXISTS "Coaches can manage own client sessions" ON coachpro_sessions;

-- Simpler policy for clients to view sessions
CREATE POLICY "Clients can view own sessions"
ON coachpro_sessions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM coachpro_client_profiles
    WHERE coachpro_client_profiles.id = coachpro_sessions.client_id
    AND coachpro_client_profiles.auth_user_id = auth.uid()
  )
);

-- Simpler policy for clients to update their notes
CREATE POLICY "Clients can update own session notes"
ON coachpro_sessions
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM coachpro_client_profiles
    WHERE coachpro_client_profiles.id = coachpro_sessions.client_id
    AND coachpro_client_profiles.auth_user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM coachpro_client_profiles
    WHERE coachpro_client_profiles.id = coachpro_sessions.client_id
    AND coachpro_client_profiles.auth_user_id = auth.uid()
  )
);

-- Policy for coaches to manage sessions
CREATE POLICY "Coaches can manage own client sessions"
ON coachpro_sessions
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM coachpro_coaches
    WHERE coachpro_coaches.id = coachpro_sessions.coach_id
    AND coachpro_coaches.auth_user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM coachpro_coaches
    WHERE coachpro_coaches.auth_user_id = auth.uid()
    AND coachpro_coaches.is_admin = true
  )
);

-- Add index for better RLS performance
CREATE INDEX IF NOT EXISTS idx_client_profiles_auth_user
ON coachpro_client_profiles(auth_user_id);

CREATE INDEX IF NOT EXISTS idx_coaches_auth_user
ON coachpro_coaches(auth_user_id);

COMMENT ON POLICY "Clients can view own sessions" ON coachpro_sessions IS 'Clients can view sessions where they are the client (via auth_user_id match)';
COMMENT ON POLICY "Coaches can manage own client sessions" ON coachpro_sessions IS 'Coaches can manage sessions for their clients, admins can manage all';
