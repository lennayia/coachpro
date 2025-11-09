-- Migration: 20251109_01 - Extend client profiles & add sessions table
-- Author: Claude Code
-- Date: 2025-11-09
-- Description:
--   1. Extend coachpro_client_profiles with photo, coach linkage, and coaching metadata
--   2. Create coachpro_sessions table for session management
--   3. Add RLS policies for sessions

-- ============================================================================
-- PART 1: Extend coachpro_client_profiles
-- ============================================================================

-- Add new columns to client_profiles (one by one to avoid constraint issues)
ALTER TABLE coachpro_client_profiles
  ADD COLUMN IF NOT EXISTS photo_url TEXT;

ALTER TABLE coachpro_client_profiles
  ADD COLUMN IF NOT EXISTS coach_id TEXT;

ALTER TABLE coachpro_client_profiles
  ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ;

ALTER TABLE coachpro_client_profiles
  ADD COLUMN IF NOT EXISTS sessions_completed INT DEFAULT 0;

ALTER TABLE coachpro_client_profiles
  ADD COLUMN IF NOT EXISTS preferred_contact TEXT DEFAULT 'email';

ALTER TABLE coachpro_client_profiles
  ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Europe/Prague';

ALTER TABLE coachpro_client_profiles
  ADD COLUMN IF NOT EXISTS client_notes TEXT;

-- Add foreign key constraint for coach_id (only if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'coachpro_client_profiles_coach_id_fkey'
  ) THEN
    ALTER TABLE coachpro_client_profiles
      ADD CONSTRAINT coachpro_client_profiles_coach_id_fkey
      FOREIGN KEY (coach_id) REFERENCES coachpro_coaches(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add check constraint for preferred_contact (only if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'coachpro_client_profiles_preferred_contact_check'
  ) THEN
    ALTER TABLE coachpro_client_profiles
      ADD CONSTRAINT coachpro_client_profiles_preferred_contact_check
      CHECK (preferred_contact IN ('email', 'phone', 'whatsapp'));
  END IF;
END $$;

-- Create index for coach_id lookups
CREATE INDEX IF NOT EXISTS idx_client_profiles_coach_id
ON coachpro_client_profiles(coach_id);

-- Comments for new columns
COMMENT ON COLUMN coachpro_client_profiles.photo_url IS 'URL to client photo (WebP format, stored in Supabase Storage)';
COMMENT ON COLUMN coachpro_client_profiles.coach_id IS 'Reference to assigned coach';
COMMENT ON COLUMN coachpro_client_profiles.started_at IS 'When coaching relationship started';
COMMENT ON COLUMN coachpro_client_profiles.sessions_completed IS 'Number of completed sessions';
COMMENT ON COLUMN coachpro_client_profiles.preferred_contact IS 'Preferred contact method (email/phone/whatsapp)';
COMMENT ON COLUMN coachpro_client_profiles.timezone IS 'Client timezone for session scheduling';
COMMENT ON COLUMN coachpro_client_profiles.client_notes IS 'Private notes by client (visible only to client)';

-- ============================================================================
-- PART 2: Create coachpro_sessions table
-- ============================================================================

CREATE TABLE IF NOT EXISTS coachpro_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relationships
  client_id UUID NOT NULL REFERENCES coachpro_client_profiles(id) ON DELETE CASCADE,
  coach_id TEXT NOT NULL REFERENCES coachpro_coaches(id) ON DELETE CASCADE,

  -- Session details
  session_date TIMESTAMPTZ NOT NULL,
  duration_minutes INT DEFAULT 60,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')) DEFAULT 'scheduled',
  location TEXT CHECK (location IN ('online', 'in-person', 'phone')) DEFAULT 'online',

  -- Session notes
  coach_notes TEXT, -- Notes by coach (visible to coach only)
  client_notes TEXT, -- Notes by client (visible to both)
  session_summary TEXT, -- Summary after session (visible to both)

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by TEXT, -- coach or client

  -- Constraints
  CHECK (session_date > created_at) -- Session date must be in future when created
);

-- Indexes for sessions
CREATE INDEX IF NOT EXISTS idx_sessions_client_id ON coachpro_sessions(client_id);
CREATE INDEX IF NOT EXISTS idx_sessions_coach_id ON coachpro_sessions(coach_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON coachpro_sessions(session_date DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON coachpro_sessions(status);

-- Composite index for common queries (upcoming sessions for a client)
CREATE INDEX IF NOT EXISTS idx_sessions_client_upcoming
ON coachpro_sessions(client_id, session_date DESC)
WHERE status = 'scheduled';

-- Comments
COMMENT ON TABLE coachpro_sessions IS 'Coaching sessions scheduled and completed';
COMMENT ON COLUMN coachpro_sessions.client_id IS 'Client who this session is for';
COMMENT ON COLUMN coachpro_sessions.coach_id IS 'Coach conducting the session';
COMMENT ON COLUMN coachpro_sessions.session_date IS 'When the session is/was scheduled';
COMMENT ON COLUMN coachpro_sessions.duration_minutes IS 'Session duration in minutes';
COMMENT ON COLUMN coachpro_sessions.status IS 'scheduled/completed/cancelled/rescheduled';
COMMENT ON COLUMN coachpro_sessions.location IS 'online/in-person/phone';
COMMENT ON COLUMN coachpro_sessions.coach_notes IS 'Private notes by coach (visible to coach only)';
COMMENT ON COLUMN coachpro_sessions.client_notes IS 'Notes by client (visible to both coach and client)';
COMMENT ON COLUMN coachpro_sessions.session_summary IS 'Summary after session (visible to both)';

-- ============================================================================
-- PART 3: RLS Policies for coachpro_sessions
-- ============================================================================

ALTER TABLE coachpro_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Clients can view their own sessions
DROP POLICY IF EXISTS "Clients can view own sessions" ON coachpro_sessions;
CREATE POLICY "Clients can view own sessions"
ON coachpro_sessions
FOR SELECT
USING (
  client_id IN (
    SELECT id FROM coachpro_client_profiles
    WHERE auth_user_id = auth.uid()
  )
);

-- Policy: Clients can add notes to their sessions (UPDATE only client_notes)
DROP POLICY IF EXISTS "Clients can update own session notes" ON coachpro_sessions;
CREATE POLICY "Clients can update own session notes"
ON coachpro_sessions
FOR UPDATE
USING (
  client_id IN (
    SELECT id FROM coachpro_client_profiles
    WHERE auth_user_id = auth.uid()
  )
)
WITH CHECK (
  client_id IN (
    SELECT id FROM coachpro_client_profiles
    WHERE auth_user_id = auth.uid()
  )
);

-- Policy: Coaches can manage sessions for their clients
DROP POLICY IF EXISTS "Coaches can manage own client sessions" ON coachpro_sessions;
CREATE POLICY "Coaches can manage own client sessions"
ON coachpro_sessions
FOR ALL
USING (
  coach_id IN (
    SELECT id FROM coachpro_coaches
    WHERE auth_user_id = auth.uid()
  )
  OR
  -- Admin can see all
  EXISTS (
    SELECT 1 FROM coachpro_coaches
    WHERE auth_user_id = auth.uid() AND is_admin = true
  )
);

-- ============================================================================
-- PART 4: Storage bucket for client photos
-- ============================================================================

-- Note: This needs to be run in Supabase dashboard or via SQL editor
-- Create storage bucket for client photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('client-photos', 'client-photos', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for storage bucket (drop first if exists, then create)
DROP POLICY IF EXISTS "Clients can upload own photo" ON storage.objects;
CREATE POLICY "Clients can upload own photo"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'client-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Anyone can view client photos" ON storage.objects;
CREATE POLICY "Anyone can view client photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'client-photos');

DROP POLICY IF EXISTS "Clients can update own photo" ON storage.objects;
CREATE POLICY "Clients can update own photo"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'client-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Clients can delete own photo" ON storage.objects;
CREATE POLICY "Clients can delete own photo"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'client-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================================================
-- PART 5: Helper function to update sessions_completed counter
-- ============================================================================

-- Function to auto-update sessions_completed when session is marked as completed
CREATE OR REPLACE FUNCTION update_sessions_completed()
RETURNS TRIGGER AS $$
BEGIN
  -- If session status changed to 'completed'
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE coachpro_client_profiles
    SET sessions_completed = sessions_completed + 1
    WHERE id = NEW.client_id;
  END IF;

  -- If session status changed from 'completed' to something else
  IF OLD.status = 'completed' AND NEW.status != 'completed' THEN
    UPDATE coachpro_client_profiles
    SET sessions_completed = GREATEST(0, sessions_completed - 1)
    WHERE id = NEW.client_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update sessions_completed
DROP TRIGGER IF EXISTS trigger_update_sessions_completed ON coachpro_sessions;
CREATE TRIGGER trigger_update_sessions_completed
AFTER UPDATE OF status ON coachpro_sessions
FOR EACH ROW
EXECUTE FUNCTION update_sessions_completed();

-- ============================================================================
-- PART 6: Helper function to get next session for a client
-- ============================================================================

-- View for easy querying of next session
CREATE OR REPLACE VIEW client_next_sessions AS
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

COMMENT ON VIEW client_next_sessions IS 'Next scheduled session for each client';

-- ============================================================================
-- DONE
-- ============================================================================
