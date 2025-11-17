-- =====================================================
-- Fix: Make ALL optional columns nullable
-- Issue: Multiple NOT NULL constraints blocking trigger
-- =====================================================

-- shared_materials - make optional columns nullable
ALTER TABLE coachpro_shared_materials
ALTER COLUMN material DROP NOT NULL,
ALTER COLUMN share_code DROP NOT NULL,
ALTER COLUMN qr_code DROP NOT NULL;

-- shared_programs - make optional columns nullable
ALTER TABLE coachpro_shared_programs
ALTER COLUMN program DROP NOT NULL,
ALTER COLUMN share_code DROP NOT NULL,
ALTER COLUMN qr_code DROP NOT NULL;

-- Verify all are now nullable
SELECT
  table_name,
  column_name,
  is_nullable
FROM information_schema.columns
WHERE table_name IN ('coachpro_shared_materials', 'coachpro_shared_programs')
  AND column_name IN ('material', 'program', 'share_code', 'qr_code')
ORDER BY table_name, column_name;
