-- Migration: Add google_event_id to coachpro_sessions table
-- Date: 2025-11-16
-- Purpose: Track which sessions were synced from Google Calendar to avoid duplicates

-- Add google_event_id column
ALTER TABLE coachpro_sessions
ADD COLUMN IF NOT EXISTS google_event_id TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_coachpro_sessions_google_event_id
ON coachpro_sessions(google_event_id);

-- Add comment
COMMENT ON COLUMN coachpro_sessions.google_event_id IS 'Google Calendar event ID for synced sessions';
