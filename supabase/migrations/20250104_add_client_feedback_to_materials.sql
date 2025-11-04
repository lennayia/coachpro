-- Add client_feedback column to coachpro_materials table
-- Sprint 21.1: Audio Workflow - TEXT reflection after meditation

ALTER TABLE coachpro_materials
ADD COLUMN IF NOT EXISTS client_feedback JSONB DEFAULT '[]'::jsonb;

-- Add comment
COMMENT ON COLUMN coachpro_materials.client_feedback IS 'Array of client feedback objects: {clientId: uuid, clientName: string, moodAfter: 1-5, reflection: string, timestamp: ISO string}';

-- Create index for faster queries on feedback
CREATE INDEX IF NOT EXISTS idx_materials_client_feedback ON coachpro_materials USING GIN (client_feedback);
