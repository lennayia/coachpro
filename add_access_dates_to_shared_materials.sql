-- Add access date columns to coachpro_shared_materials table
-- Umožňuje koučce nastavit individuální časové omezení přístupu pro každé sdílení materiálu

ALTER TABLE coachpro_shared_materials
ADD COLUMN IF NOT EXISTS access_start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS access_end_date TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN coachpro_shared_materials.access_start_date IS 'Datum od kdy je materiál dostupný (nastavuje koučka)';
COMMENT ON COLUMN coachpro_shared_materials.access_end_date IS 'Datum do kdy je materiál dostupný (null = neomezeno)';

-- Index pro rychlé vyhledávání aktivních sdílení
CREATE INDEX IF NOT EXISTS idx_coachpro_shared_materials_access_dates
ON coachpro_shared_materials(access_start_date, access_end_date);
