-- =====================================================
-- Migration: Fix RLS Policies for Materials & Programs
-- Date: 2025-01-08
-- Purpose: Replace permissive policies with coach-scoped filtering
-- =====================================================

-- =====================================
-- CRITICAL SECURITY FIX
-- =====================================
-- BEFORE: USING (true) = everyone sees everything
-- AFTER: USING (coach_id matches auth.uid()) = see only own data

-- =====================================
-- 1. MATERIALS - Drop Permissive Policies
-- =====================================

DROP POLICY IF EXISTS "Anyone can read materials" ON coachpro_materials;
DROP POLICY IF EXISTS "Anyone can insert materials" ON coachpro_materials;
DROP POLICY IF EXISTS "Anyone can update materials" ON coachpro_materials;
DROP POLICY IF EXISTS "Anyone can delete materials" ON coachpro_materials;

-- =====================================
-- 2. MATERIALS - Create Coach-Scoped Policies
-- =====================================

-- SELECT: Coaches can read ONLY their own materials
CREATE POLICY "Coaches can read own materials"
ON coachpro_materials
FOR SELECT
TO authenticated
USING (
  coach_id IN (
    SELECT id FROM coachpro_coaches
    WHERE auth_user_id = auth.uid()
  )
);

-- INSERT: Coaches can insert materials for themselves
CREATE POLICY "Coaches can insert own materials"
ON coachpro_materials
FOR INSERT
TO authenticated
WITH CHECK (
  coach_id IN (
    SELECT id FROM coachpro_coaches
    WHERE auth_user_id = auth.uid()
  )
);

-- UPDATE: Coaches can update ONLY their own materials
CREATE POLICY "Coaches can update own materials"
ON coachpro_materials
FOR UPDATE
TO authenticated
USING (
  coach_id IN (
    SELECT id FROM coachpro_coaches
    WHERE auth_user_id = auth.uid()
  )
)
WITH CHECK (
  coach_id IN (
    SELECT id FROM coachpro_coaches
    WHERE auth_user_id = auth.uid()
  )
);

-- DELETE: Coaches can delete ONLY their own materials
CREATE POLICY "Coaches can delete own materials"
ON coachpro_materials
FOR DELETE
TO authenticated
USING (
  coach_id IN (
    SELECT id FROM coachpro_coaches
    WHERE auth_user_id = auth.uid()
  )
);

-- =====================================
-- 3. PROGRAMS - Drop Permissive Policies
-- =====================================

DROP POLICY IF EXISTS "Anyone can read programs" ON coachpro_programs;
DROP POLICY IF EXISTS "Anyone can insert programs" ON coachpro_programs;
DROP POLICY IF EXISTS "Anyone can update programs" ON coachpro_programs;
DROP POLICY IF EXISTS "Anyone can delete programs" ON coachpro_programs;

-- =====================================
-- 4. PROGRAMS - Create Coach-Scoped Policies
-- =====================================

-- SELECT: Coaches can read ONLY their own programs
CREATE POLICY "Coaches can read own programs"
ON coachpro_programs
FOR SELECT
TO authenticated
USING (
  coach_id IN (
    SELECT id FROM coachpro_coaches
    WHERE auth_user_id = auth.uid()
  )
);

-- INSERT: Coaches can insert programs for themselves
CREATE POLICY "Coaches can insert own programs"
ON coachpro_programs
FOR INSERT
TO authenticated
WITH CHECK (
  coach_id IN (
    SELECT id FROM coachpro_coaches
    WHERE auth_user_id = auth.uid()
  )
);

-- UPDATE: Coaches can update ONLY their own programs
CREATE POLICY "Coaches can update own programs"
ON coachpro_programs
FOR UPDATE
TO authenticated
USING (
  coach_id IN (
    SELECT id FROM coachpro_coaches
    WHERE auth_user_id = auth.uid()
  )
)
WITH CHECK (
  coach_id IN (
    SELECT id FROM coachpro_coaches
    WHERE auth_user_id = auth.uid()
  )
);

-- DELETE: Coaches can delete ONLY their own programs
CREATE POLICY "Coaches can delete own programs"
ON coachpro_programs
FOR DELETE
TO authenticated
USING (
  coach_id IN (
    SELECT id FROM coachpro_coaches
    WHERE auth_user_id = auth.uid()
  )
);

-- =====================================
-- 5. Comments
-- =====================================

COMMENT ON POLICY "Coaches can read own materials" ON coachpro_materials
IS 'Coaches can only read materials they created (filtered by auth.uid() -> coach_id)';

COMMENT ON POLICY "Coaches can read own programs" ON coachpro_programs
IS 'Coaches can only read programs they created (filtered by auth.uid() -> coach_id)';

-- =====================================
-- 6. Verification Queries (uncomment to test)
-- =====================================

-- Check new policies exist:
-- SELECT policyname, cmd, qual
-- FROM pg_policies
-- WHERE tablename IN ('coachpro_materials', 'coachpro_programs')
-- ORDER BY tablename, policyname;

-- Test as authenticated user (should see ONLY own materials):
-- SELECT id, title, coach_id FROM coachpro_materials;
-- SELECT id, title, coach_id FROM coachpro_programs;
