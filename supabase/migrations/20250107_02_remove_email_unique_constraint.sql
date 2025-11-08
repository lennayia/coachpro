-- Remove email unique constraint from testers table
-- Migration: 20250107_02 - Allow same email in both client_profiles and testers
--
-- REASON: One person can be both a client and a tester with the same email
-- The unique constraint should only be on auth_user_id, not email

-- Drop the email unique constraint if it exists
ALTER TABLE testers
DROP CONSTRAINT IF EXISTS testers_email_key;

-- Drop any unique index on email if it exists
DROP INDEX IF EXISTS testers_email_key;
DROP INDEX IF EXISTS idx_testers_email_unique;

-- Verify: Email should NOT be unique, auth_user_id SHOULD be unique
-- (auth_user_id unique constraint was added in previous migration)

COMMENT ON COLUMN testers.email IS 'Email address (not unique - same email can be client and tester)';
