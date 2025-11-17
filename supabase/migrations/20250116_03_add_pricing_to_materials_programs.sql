-- =====================================================
-- Migration: Add pricing & public access to materials/programs
-- Date: 2025-01-16
-- Purpose: Enable lead magnets (free for contact) and paid content
-- =====================================================

-- ============================================
-- MATERIALS - Add pricing fields
-- ============================================

ALTER TABLE coachpro_materials
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'CZK',
ADD COLUMN IF NOT EXISTS is_lead_magnet BOOLEAN DEFAULT false;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_materials_is_public ON coachpro_materials(is_public);
CREATE INDEX IF NOT EXISTS idx_materials_is_lead_magnet ON coachpro_materials(is_lead_magnet);

-- Comments
COMMENT ON COLUMN coachpro_materials.is_public IS 'If true, visible in public catalog (not just shared clients)';
COMMENT ON COLUMN coachpro_materials.price IS 'NULL = free (lead magnet), > 0 = paid';
COMMENT ON COLUMN coachpro_materials.currency IS 'Currency for price (CZK, EUR, USD)';
COMMENT ON COLUMN coachpro_materials.is_lead_magnet IS 'True = free for contact info, False = requires payment or share code';

-- ============================================
-- PROGRAMS - Add pricing fields
-- ============================================

ALTER TABLE coachpro_programs
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'CZK',
ADD COLUMN IF NOT EXISTS is_lead_magnet BOOLEAN DEFAULT false;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_programs_is_public ON coachpro_programs(is_public);
CREATE INDEX IF NOT EXISTS idx_programs_is_lead_magnet ON coachpro_programs(is_lead_magnet);

-- Comments
COMMENT ON COLUMN coachpro_programs.is_public IS 'If true, visible in public catalog';
COMMENT ON COLUMN coachpro_programs.price IS 'NULL = free (lead magnet), > 0 = paid';
COMMENT ON COLUMN coachpro_programs.currency IS 'Currency for price';
COMMENT ON COLUMN coachpro_programs.is_lead_magnet IS 'True = free for contact, False = paid or code-only';

-- ============================================
-- RLS - Allow public to READ public materials
-- ============================================

-- Drop old overly-permissive policies if they exist
DROP POLICY IF EXISTS "Anyone can read materials" ON coachpro_materials;
DROP POLICY IF EXISTS "Anyone can read programs" ON coachpro_programs;

-- New policy: Public can read PUBLIC materials
CREATE POLICY "Public can read public materials"
ON coachpro_materials
FOR SELECT
TO public
USING (is_public = true);

-- Authenticated users can read their coach's materials (existing shared logic)
CREATE POLICY "Authenticated can read own materials"
ON coachpro_materials
FOR SELECT
TO authenticated
USING (true); -- Will be filtered by application logic (shared materials, purchases, etc.)

-- Same for programs
CREATE POLICY "Public can read public programs"
ON coachpro_programs
FOR SELECT
TO public
USING (is_public = true);

CREATE POLICY "Authenticated can read programs"
ON coachpro_programs
FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- Helper function: Get coach's public catalog
-- ============================================

-- Function: Get all public materials/programs from a coach
CREATE OR REPLACE FUNCTION get_coach_public_catalog(p_coach_id TEXT)
RETURNS TABLE (
  item_id TEXT,
  item_type TEXT,
  title TEXT,
  description TEXT,
  price DECIMAL(10, 2),
  currency TEXT,
  is_lead_magnet BOOLEAN,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  -- Materials
  SELECT
    m.id AS item_id,
    'material'::TEXT AS item_type,
    m.title,
    m.description,
    m.price,
    m.currency,
    m.is_lead_magnet,
    m.created_at
  FROM coachpro_materials m
  WHERE m.coach_id = p_coach_id
    AND m.is_public = true

  UNION ALL

  -- Programs
  SELECT
    p.id AS item_id,
    'program'::TEXT AS item_type,
    p.title,
    p.description,
    p.price,
    p.currency,
    p.is_lead_magnet,
    p.created_at
  FROM coachpro_programs p
  WHERE p.coach_id = p_coach_id
    AND p.is_public = true

  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_coach_public_catalog IS 'Get all public (lead magnet + paid) materials/programs from a coach';
