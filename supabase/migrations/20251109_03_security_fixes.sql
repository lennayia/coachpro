-- Migration: 20251109_03 - Security fixes for token tables and views
-- Author: Claude Code
-- Date: 2025-11-09
-- Description: Fix Security Advisor errors

-- ============================================================================
-- PART 1: Fix client_next_sessions view (Security Definer → Security Invoker)
-- ============================================================================

-- Drop and recreate view as Security Invoker
DROP VIEW IF EXISTS client_next_sessions;

CREATE VIEW client_next_sessions
WITH (security_invoker=true)
AS
SELECT DISTINCT ON (client_id)
  s.id,
  s.client_id,
  s.coach_id,
  s.session_date,
  s.duration_minutes,
  s.location,
  s.status,
  c.name as coach_name,
  c.email as coach_email,
  c.phone as coach_phone
FROM coachpro_sessions s
JOIN coachpro_coaches c ON s.coach_id = c.id
WHERE s.status = 'scheduled'
  AND s.session_date >= now()
ORDER BY client_id, s.session_date ASC;

COMMENT ON VIEW client_next_sessions IS 'Next scheduled session for each client (Security Invoker - respects RLS)';

-- ============================================================================
-- PART 2: Enable RLS for email_verification_tokens
-- ============================================================================

ALTER TABLE email_verification_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert tokens (for registration)
DROP POLICY IF EXISTS "Anyone can create email verification tokens" ON email_verification_tokens;
CREATE POLICY "Anyone can create email verification tokens"
ON email_verification_tokens
FOR INSERT
WITH CHECK (true);

-- Policy: Users can read their own tokens (by user_id)
DROP POLICY IF EXISTS "Users can read own email tokens" ON email_verification_tokens;
CREATE POLICY "Users can read own email tokens"
ON email_verification_tokens
FOR SELECT
USING (user_id = auth.uid());

-- Policy: Users can update their own tokens (mark as used)
DROP POLICY IF EXISTS "Users can update own email tokens" ON email_verification_tokens;
CREATE POLICY "Users can update own email tokens"
ON email_verification_tokens
FOR UPDATE
USING (user_id = auth.uid());

-- Policy: Automatically delete used tokens
DROP POLICY IF EXISTS "System can delete email tokens" ON email_verification_tokens;
CREATE POLICY "System can delete email tokens"
ON email_verification_tokens
FOR DELETE
USING (true);

COMMENT ON POLICY "Anyone can create email verification tokens" ON email_verification_tokens IS 'Allow token creation during registration (before auth)';
COMMENT ON POLICY "Users can read own email tokens" ON email_verification_tokens IS 'Users can only read tokens for their user_id';

-- ============================================================================
-- PART 3: Enable RLS for password_reset_tokens
-- ============================================================================

ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert tokens (for password reset)
DROP POLICY IF EXISTS "Anyone can create password reset tokens" ON password_reset_tokens;
CREATE POLICY "Anyone can create password reset tokens"
ON password_reset_tokens
FOR INSERT
WITH CHECK (true);

-- Policy: Users can read their own tokens (by user_id)
DROP POLICY IF EXISTS "Users can read own reset tokens" ON password_reset_tokens;
CREATE POLICY "Users can read own reset tokens"
ON password_reset_tokens
FOR SELECT
USING (user_id = auth.uid());

-- Policy: Users can update their own tokens (mark as used)
DROP POLICY IF EXISTS "Users can update own reset tokens" ON password_reset_tokens;
CREATE POLICY "Users can update own reset tokens"
ON password_reset_tokens
FOR UPDATE
USING (user_id = auth.uid());

-- Policy: Automatically delete used tokens
DROP POLICY IF EXISTS "System can delete reset tokens" ON password_reset_tokens;
CREATE POLICY "System can delete reset tokens"
ON password_reset_tokens
FOR DELETE
USING (true);

COMMENT ON POLICY "Anyone can create password reset tokens" ON password_reset_tokens IS 'Allow token creation during password reset (before auth)';
COMMENT ON POLICY "Users can read own reset tokens" ON password_reset_tokens IS 'Users can only read tokens for their user_id';

-- ============================================================================
-- PART 4: Add automatic cleanup for expired tokens (optional but recommended)
-- ============================================================================

-- Function to clean up expired email verification tokens
CREATE OR REPLACE FUNCTION cleanup_expired_email_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM email_verification_tokens
  WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired password reset tokens
CREATE OR REPLACE FUNCTION cleanup_expired_reset_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM password_reset_tokens
  WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION cleanup_expired_email_tokens() IS 'Cleanup expired email verification tokens (run periodically)';
COMMENT ON FUNCTION cleanup_expired_reset_tokens() IS 'Cleanup expired password reset tokens (run periodically)';

-- Note: You can schedule these functions to run periodically using pg_cron or Supabase Edge Functions

-- ============================================================================
-- DONE - All Security Advisor errors should be resolved
-- ============================================================================
