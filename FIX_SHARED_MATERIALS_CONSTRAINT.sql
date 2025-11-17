-- =====================================================
-- Fix: Add UNIQUE constraint to shared materials/programs
-- Issue: ON CONFLICT requires unique constraint
-- =====================================================

-- Add UNIQUE constraint to coachpro_shared_materials
-- (prevents duplicate shares of same material to same client)
ALTER TABLE coachpro_shared_materials
DROP CONSTRAINT IF EXISTS unique_shared_material;

ALTER TABLE coachpro_shared_materials
ADD CONSTRAINT unique_shared_material
UNIQUE (coach_id, material_id, client_email);

-- Add UNIQUE constraint to coachpro_shared_programs
ALTER TABLE coachpro_shared_programs
DROP CONSTRAINT IF EXISTS unique_shared_program;

ALTER TABLE coachpro_shared_programs
ADD CONSTRAINT unique_shared_program
UNIQUE (coach_id, program_id, client_email);

-- Verify
SELECT constraint_name, table_name
FROM information_schema.table_constraints
WHERE table_name IN ('coachpro_shared_materials', 'coachpro_shared_programs')
  AND constraint_type = 'UNIQUE';
