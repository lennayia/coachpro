-- Create shared programs table for public sharing
-- Similar to coachpro_shared_materials, allows coaches to share programs via code

CREATE TABLE IF NOT EXISTS coachpro_shared_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES coachpro_programs(id) ON DELETE CASCADE,
  coach_id TEXT NOT NULL REFERENCES coachpro_coaches(id) ON DELETE CASCADE,
  coach_name TEXT,
  share_code TEXT NOT NULL UNIQUE,
  qr_code TEXT,
  access_start_date TIMESTAMP WITH TIME ZONE,
  access_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE coachpro_shared_programs IS 'Public sharing of programs - one code can be used by anyone';
COMMENT ON COLUMN coachpro_shared_programs.program_id IS 'Reference to the program being shared';
COMMENT ON COLUMN coachpro_shared_programs.coach_id IS 'Coach who created the share';
COMMENT ON COLUMN coachpro_shared_programs.coach_name IS 'Coach name for display (denormalized)';
COMMENT ON COLUMN coachpro_shared_programs.share_code IS '6-character share code (e.g., ABC123)';
COMMENT ON COLUMN coachpro_shared_programs.qr_code IS 'Base64 encoded QR code image';
COMMENT ON COLUMN coachpro_shared_programs.access_start_date IS 'Optional: when access starts';
COMMENT ON COLUMN coachpro_shared_programs.access_end_date IS 'Optional: when access expires';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_shared_programs_share_code ON coachpro_shared_programs(share_code);
CREATE INDEX IF NOT EXISTS idx_shared_programs_coach_id ON coachpro_shared_programs(coach_id);
CREATE INDEX IF NOT EXISTS idx_shared_programs_program_id ON coachpro_shared_programs(program_id);
CREATE INDEX IF NOT EXISTS idx_shared_programs_access_dates ON coachpro_shared_programs(access_start_date, access_end_date);

-- Enable RLS
ALTER TABLE coachpro_shared_programs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- SELECT: Anyone can read shared programs (for code lookup)
CREATE POLICY "Anyone can read shared programs"
ON coachpro_shared_programs
FOR SELECT
TO authenticated
USING (true);

-- INSERT: Coaches can create shares for their own programs
CREATE POLICY "Coaches can create program shares"
ON coachpro_shared_programs
FOR INSERT
TO authenticated
WITH CHECK (
  coach_id IN (
    SELECT id FROM coachpro_coaches
    WHERE auth_user_id = auth.uid()
  )
);

-- UPDATE: Coaches can update their own shares
CREATE POLICY "Coaches can update own program shares"
ON coachpro_shared_programs
FOR UPDATE
TO authenticated
USING (
  coach_id IN (
    SELECT id FROM coachpro_coaches
    WHERE auth_user_id = auth.uid()
  )
)
WITH CHECK (
  coach_id IN (
    SELECT id FROM coachpro_coaches
    WHERE auth_user_id = auth.uid()
  )
);

-- DELETE: Coaches can delete their own shares
CREATE POLICY "Coaches can delete own program shares"
ON coachpro_shared_programs
FOR DELETE
TO authenticated
USING (
  coach_id IN (
    SELECT id FROM coachpro_coaches
    WHERE auth_user_id = auth.uid()
  )
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_shared_programs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_shared_programs_updated_at_trigger
BEFORE UPDATE ON coachpro_shared_programs
FOR EACH ROW
EXECUTE FUNCTION update_shared_programs_updated_at();
