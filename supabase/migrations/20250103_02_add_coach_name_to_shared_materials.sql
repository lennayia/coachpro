-- Add coach_name column to coachpro_shared_materials table
ALTER TABLE coachpro_shared_materials
ADD COLUMN IF NOT EXISTS coach_name TEXT;

-- Add comment for documentation
COMMENT ON COLUMN coachpro_shared_materials.coach_name IS 'Jméno kouče pro rychlé zobrazení (bez nutnosti JOIN)';
