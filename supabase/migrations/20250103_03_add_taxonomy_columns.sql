-- Add coaching taxonomy columns to coachpro_materials table
ALTER TABLE coachpro_materials
ADD COLUMN coaching_area TEXT DEFAULT 'life',
ADD COLUMN topics JSONB DEFAULT '[]'::jsonb,
ADD COLUMN coaching_style TEXT,
ADD COLUMN coaching_authority TEXT;

-- Add comments for documentation
COMMENT ON COLUMN coachpro_materials.coaching_area IS 'Oblast koučování (life, business, relationship, health, mindfulness)';
COMMENT ON COLUMN coachpro_materials.topics IS 'Array témat (JSONB)';
COMMENT ON COLUMN coachpro_materials.coaching_style IS 'Styl koučování (volitelné)';
COMMENT ON COLUMN coachpro_materials.coaching_authority IS 'Koučovací škola/přístup (ICF, NLP, Ontologický, atd.) - volitelné';
