-- Add program_feedback column to coachpro_programs table
-- This column stores client reflections/feedback when they complete the program

ALTER TABLE coachpro_programs
ADD COLUMN IF NOT EXISTS program_feedback JSONB DEFAULT '[]'::jsonb;

-- Add index for faster queries on programs with feedback
CREATE INDEX IF NOT EXISTS idx_programs_feedback
ON coachpro_programs USING gin(program_feedback);

-- Add comment for documentation
COMMENT ON COLUMN coachpro_programs.program_feedback IS
'Array of client feedback objects: [{ clientId, clientName, reflection, timestamp }]';
