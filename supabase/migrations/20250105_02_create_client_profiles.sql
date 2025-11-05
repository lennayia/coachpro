-- Create client_profiles table for OAuth authenticated clients
-- Migration: 20250105_02 - Client profiles with Google OAuth support

-- Create table
CREATE TABLE IF NOT EXISTS coachpro_client_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Supabase Auth linkage
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,

  -- Program-related
  goals TEXT, -- Cíle klientky v programu
  health_notes TEXT, -- Zdravotní omezení
  coach_notes TEXT, -- Poznámky koučky (jen pro koučku)

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Constraints
  CONSTRAINT unique_auth_user UNIQUE(auth_user_id)
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_client_profiles_auth_user
ON coachpro_client_profiles(auth_user_id);

CREATE INDEX IF NOT EXISTS idx_client_profiles_email
ON coachpro_client_profiles(email);

-- RLS Policies
ALTER TABLE coachpro_client_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Client can read and update their own profile
CREATE POLICY "Clients can manage own profile"
ON coachpro_client_profiles
FOR ALL
USING (auth.uid() = auth_user_id);

-- Policy: Coaches can read profiles of their clients
-- (We'll refine this later when we add coach-client relationship)
CREATE POLICY "Coaches can read client profiles"
ON coachpro_client_profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM coachpro_clients c
    INNER JOIN coachpro_programs p ON c.program_id = p.id
    WHERE c.auth_user_id = coachpro_client_profiles.auth_user_id
    AND p.coach_id IN (
      SELECT id FROM coachpro_coaches WHERE id = auth.uid()::text
    )
  )
);

-- Comments
COMMENT ON TABLE coachpro_client_profiles IS 'Client profiles with OAuth authentication';
COMMENT ON COLUMN coachpro_client_profiles.auth_user_id IS 'Reference to Supabase auth.users';
COMMENT ON COLUMN coachpro_client_profiles.goals IS 'Client goals in the program';
COMMENT ON COLUMN coachpro_client_profiles.health_notes IS 'Health limitations or notes';
COMMENT ON COLUMN coachpro_client_profiles.coach_notes IS 'Private notes visible only to coach';
