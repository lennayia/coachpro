-- =====================================================
-- Migration: Add UNIQUE constraint on auth_user_id
-- Date: 2025-11-11
-- Session: #15
-- Purpose: Enable UPSERT on coaches table using auth_user_id
-- =====================================================

-- Add UNIQUE constraint to auth_user_id
-- This allows upsert with onConflict: 'auth_user_id'
ALTER TABLE coachpro_coaches
ADD CONSTRAINT coachpro_coaches_auth_user_id_key
UNIQUE (auth_user_id);

COMMENT ON CONSTRAINT coachpro_coaches_auth_user_id_key ON coachpro_coaches
IS 'Ensures one coach record per auth user - enables UPSERT with onConflict';

-- =====================================================
-- Verification Query
-- =====================================================
-- SELECT constraint_name, constraint_type
-- FROM information_schema.table_constraints
-- WHERE table_name = 'coachpro_coaches'
-- AND constraint_name = 'coachpro_coaches_auth_user_id_key';
