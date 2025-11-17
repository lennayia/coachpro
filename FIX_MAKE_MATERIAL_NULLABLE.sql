-- =====================================================
-- Fix: Make material/program JSONB columns nullable
-- Issue: Trigger can't provide full material data
-- =====================================================

-- Make material column nullable in shared_materials
ALTER TABLE coachpro_shared_materials
ALTER COLUMN material DROP NOT NULL;

-- Make program column nullable in shared_programs
ALTER TABLE coachpro_shared_programs
ALTER COLUMN program DROP NOT NULL;

-- Verify
SELECT
  column_name,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'coachpro_shared_materials'
  AND column_name = 'material'
UNION ALL
SELECT
  column_name,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'coachpro_shared_programs'
  AND column_name = 'program';
