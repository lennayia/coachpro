-- Add coach_name column to coachpro_programs table
ALTER TABLE coachpro_programs
ADD COLUMN coach_name TEXT;

-- Add comment for documentation
COMMENT ON COLUMN coachpro_programs.coach_name IS 'Jméno kouče pro rychlé zobrazení (bez nutnosti JOIN)';
