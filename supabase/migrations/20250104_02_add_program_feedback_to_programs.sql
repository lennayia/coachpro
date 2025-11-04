-- Add program_feedback column to coachpro_programs table
-- Sprint 21.2: Program End Feedback - TEXT reflection after completing entire program

ALTER TABLE coachpro_programs
ADD COLUMN IF NOT EXISTS program_feedback JSONB DEFAULT '[]'::jsonb;

-- Add comment
COMMENT ON COLUMN coachpro_programs.program_feedback IS 'Array of program feedback objects: {clientId: uuid, clientName: string, moodAfter: 1-5, reflection: string, timestamp: ISO string}';

-- Create index for faster queries on feedback
CREATE INDEX IF NOT EXISTS idx_programs_program_feedback ON coachpro_programs USING GIN (program_feedback);
