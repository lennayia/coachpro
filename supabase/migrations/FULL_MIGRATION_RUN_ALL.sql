-- ============================================
-- COACHPRO - FULL MIGRATION SCRIPT
-- ============================================
-- Spusť tento script v Supabase SQL Editoru
-- Všechny ALTER TABLE mají IF NOT EXISTS - bezpečné spustit vícekrát
-- ============================================

-- MIGRATION 1: Add coach_name to programs
-- Performance optimization - denormalized coach name
ALTER TABLE coachpro_programs
ADD COLUMN IF NOT EXISTS coach_name TEXT;

COMMENT ON COLUMN coachpro_programs.coach_name IS 'Jméno kouče pro rychlé zobrazení (bez nutnosti JOIN)';

-- MIGRATION 2: Add coach_name to shared_materials
ALTER TABLE coachpro_shared_materials
ADD COLUMN IF NOT EXISTS coach_name TEXT;

COMMENT ON COLUMN coachpro_shared_materials.coach_name IS 'Jméno kouče pro rychlé zobrazení (bez nutnosti JOIN)';

-- MIGRATION 3: Add coaching taxonomy columns to materials
-- Sprint 12: 4-dimensional coaching taxonomy system
ALTER TABLE coachpro_materials
ADD COLUMN IF NOT EXISTS coaching_area TEXT DEFAULT 'life',
ADD COLUMN IF NOT EXISTS topics JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS coaching_style TEXT,
ADD COLUMN IF NOT EXISTS coaching_authority TEXT;

COMMENT ON COLUMN coachpro_materials.coaching_area IS 'Oblast koučování (life, business, relationship, health, mindfulness)';
COMMENT ON COLUMN coachpro_materials.topics IS 'Array témat (JSONB)';
COMMENT ON COLUMN coachpro_materials.coaching_style IS 'Styl koučování (volitelné)';
COMMENT ON COLUMN coachpro_materials.coaching_authority IS 'Koučovací škola/přístup (ICF, NLP, Ontologický, atd.) - volitelné';

-- MIGRATION 4: Add access dates to clients
-- Time-limited program access for clients
ALTER TABLE coachpro_clients
ADD COLUMN IF NOT EXISTS access_start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS access_end_date TIMESTAMPTZ;

COMMENT ON COLUMN coachpro_clients.access_start_date IS 'Datum začátku přístupu k programu (volitelné, pro časově omezený přístup)';
COMMENT ON COLUMN coachpro_clients.access_end_date IS 'Datum konce přístupu k programu (volitelné, pro časově omezený přístup)';

-- Create index for faster date range queries
CREATE INDEX IF NOT EXISTS idx_clients_access_dates ON coachpro_clients(access_start_date, access_end_date);

-- MIGRATION 5: Add access dates to shared_materials
-- Time-limited material sharing
ALTER TABLE coachpro_shared_materials
ADD COLUMN IF NOT EXISTS access_start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS access_end_date TIMESTAMPTZ;

COMMENT ON COLUMN coachpro_shared_materials.access_start_date IS 'Datum začátku přístupu k materiálu (volitelné)';
COMMENT ON COLUMN coachpro_shared_materials.access_end_date IS 'Datum konce přístupu k materiálu (volitelné)';

-- Create index for faster date range queries
CREATE INDEX IF NOT EXISTS idx_shared_materials_access_dates ON coachpro_shared_materials(access_start_date, access_end_date);

-- MIGRATION 6: Add client_feedback to materials
-- Sprint 21.1: Material Feedback System - client reflections after using material
ALTER TABLE coachpro_materials
ADD COLUMN IF NOT EXISTS client_feedback JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN coachpro_materials.client_feedback IS 'Array of client feedback objects: {clientId: uuid, clientName: string, moodAfter: 1-5, reflection: string, timestamp: ISO string}';

-- Create GIN index for faster JSONB queries
CREATE INDEX IF NOT EXISTS idx_materials_client_feedback ON coachpro_materials USING GIN (client_feedback);

-- MIGRATION 7: Add program_feedback to programs
-- Sprint 21.2: Program End Feedback - client reflections after completing entire program
ALTER TABLE coachpro_programs
ADD COLUMN IF NOT EXISTS program_feedback JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN coachpro_programs.program_feedback IS 'Array of program feedback objects: {clientId: uuid, clientName: string, moodAfter: 1-5, reflection: string, timestamp: ISO string}';

-- Create GIN index for faster JSONB queries
CREATE INDEX IF NOT EXISTS idx_programs_program_feedback ON coachpro_programs USING GIN (program_feedback);

-- ============================================
-- END OF MIGRATIONS
-- ============================================
-- ✅ Všechny migrace dokončeny!
-- ✅ Sloupce které už existují byly přeskočeny (IF NOT EXISTS)
-- ✅ Indexy vytvořeny pro lepší výkon
-- ============================================
