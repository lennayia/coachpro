-- =====================================================
-- Move CoachPro Tables to coachpro Schema
-- =====================================================
-- Moves all CoachPro tables from public schema to coachpro schema
-- Handles both prefixed (coachpro_*) and non-prefixed tables

-- =====================================================
-- Tables WITH coachpro_ prefix
-- =====================================================

ALTER TABLE IF EXISTS public.coachpro_coaches SET SCHEMA coachpro;
ALTER TABLE IF EXISTS public.coachpro_client_profiles SET SCHEMA coachpro;
ALTER TABLE IF EXISTS public.coachpro_materials SET SCHEMA coachpro;
ALTER TABLE IF EXISTS public.coachpro_programs SET SCHEMA coachpro;
ALTER TABLE IF EXISTS public.coachpro_sessions SET SCHEMA coachpro;
ALTER TABLE IF EXISTS public.coachpro_shared_materials SET SCHEMA coachpro;
ALTER TABLE IF EXISTS public.coachpro_shared_programs SET SCHEMA coachpro;
ALTER TABLE IF EXISTS public.coachpro_purchases SET SCHEMA coachpro;
ALTER TABLE IF EXISTS public.coachpro_card_decks SET SCHEMA coachpro;
ALTER TABLE IF EXISTS public.coachpro_cards SET SCHEMA coachpro;
ALTER TABLE IF EXISTS public.coachpro_shared_card_decks SET SCHEMA coachpro;
ALTER TABLE IF EXISTS public.coachpro_program_sessions SET SCHEMA coachpro;
ALTER TABLE IF EXISTS public.coachpro_daily_programs SET SCHEMA coachpro;

-- =====================================================
-- Tables WITHOUT prefix (if any exist)
-- =====================================================
-- Add any non-prefixed CoachPro tables here
-- Example:
-- ALTER TABLE IF EXISTS public.coaches SET SCHEMA coachpro;
-- ALTER TABLE IF EXISTS public.materials SET SCHEMA coachpro;

-- =====================================================
-- Move Functions and Triggers
-- =====================================================

-- Move trigger function to coachpro schema
ALTER FUNCTION IF EXISTS public.auto_share_after_purchase() SET SCHEMA coachpro;

-- Recreate trigger with new schema reference
DROP TRIGGER IF EXISTS trigger_auto_share_after_purchase ON coachpro.coachpro_purchases;

CREATE TRIGGER trigger_auto_share_after_purchase
AFTER INSERT ON coachpro.coachpro_purchases
FOR EACH ROW
EXECUTE FUNCTION coachpro.auto_share_after_purchase();

-- =====================================================
-- Update RLS Policies (they move automatically with tables)
-- =====================================================
-- RLS policies are automatically moved with tables
-- No additional action needed

-- =====================================================
-- Verification
-- =====================================================

-- List all tables in coachpro schema
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'coachpro'
ORDER BY table_name;

-- Count tables in each schema
SELECT
  table_schema,
  COUNT(*) as table_count
FROM information_schema.tables
WHERE table_schema IN ('public', 'coachpro', 'lifepro')
GROUP BY table_schema
ORDER BY table_schema;
