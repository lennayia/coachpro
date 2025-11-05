-- Add availability dates and external link to coachpro_programs table
-- Migration: 20250105 - Add availability_start_date, availability_end_date, external_link, external_link_label

ALTER TABLE coachpro_programs
ADD COLUMN IF NOT EXISTS availability_start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS availability_end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS external_link TEXT,
ADD COLUMN IF NOT EXISTS external_link_label TEXT;

-- Add index for availability date queries
CREATE INDEX IF NOT EXISTS idx_programs_availability_dates
ON coachpro_programs(availability_start_date, availability_end_date);

-- Add comment explaining the columns
COMMENT ON COLUMN coachpro_programs.availability_start_date IS 'Kdy je program dostupný od (null = ihned)';
COMMENT ON COLUMN coachpro_programs.availability_end_date IS 'Kdy je program dostupný do (null = neomezeně)';
COMMENT ON COLUMN coachpro_programs.external_link IS 'Externí odkaz na program (např. Kajabi kurz)';
COMMENT ON COLUMN coachpro_programs.external_link_label IS 'Popisek pro externí odkaz';
