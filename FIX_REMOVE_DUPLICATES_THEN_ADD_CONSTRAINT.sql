-- =====================================================
-- Fix: Remove duplicates, then add UNIQUE constraint
-- =====================================================

-- Step 1: Find and remove duplicates from coachpro_shared_materials
-- Keep only the OLDEST record (by created_at or id)

-- Delete duplicates (keep first occurrence)
DELETE FROM coachpro_shared_materials a
USING coachpro_shared_materials b
WHERE a.id > b.id  -- Keep older record (smaller ID)
  AND a.coach_id = b.coach_id
  AND a.material_id = b.material_id
  AND a.client_email = b.client_email;

-- Step 2: Add UNIQUE constraint
ALTER TABLE coachpro_shared_materials
DROP CONSTRAINT IF EXISTS unique_shared_material;

ALTER TABLE coachpro_shared_materials
ADD CONSTRAINT unique_shared_material
UNIQUE (coach_id, material_id, client_email);

-- Step 3: Same for programs
DELETE FROM coachpro_shared_programs a
USING coachpro_shared_programs b
WHERE a.id > b.id
  AND a.coach_id = b.coach_id
  AND a.program_id = b.program_id
  AND a.client_email = b.client_email;

ALTER TABLE coachpro_shared_programs
DROP CONSTRAINT IF EXISTS unique_shared_program;

ALTER TABLE coachpro_shared_programs
ADD CONSTRAINT unique_shared_program
UNIQUE (coach_id, program_id, client_email);

-- Step 4: Verify
SELECT
  'shared_materials' as table_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT (coach_id, material_id, client_email)) as unique_combinations
FROM coachpro_shared_materials
UNION ALL
SELECT
  'shared_programs',
  COUNT(*),
  COUNT(DISTINCT (coach_id, program_id, client_email))
FROM coachpro_shared_programs;

-- Show constraints
SELECT constraint_name, table_name
FROM information_schema.table_constraints
WHERE table_name IN ('coachpro_shared_materials', 'coachpro_shared_programs')
  AND constraint_type = 'UNIQUE';
