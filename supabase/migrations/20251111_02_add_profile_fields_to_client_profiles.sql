-- =====================================================
-- Migration: Add Profile Fields to coachpro_client_profiles
-- Date: 2025-11-11
-- Session: #15
-- Purpose: Add current_situation, vision, and social media fields
-- =====================================================

-- =====================================
-- 1. Add client-specific goal fields
-- =====================================

ALTER TABLE coachpro_client_profiles
ADD COLUMN IF NOT EXISTS current_situation TEXT,
ADD COLUMN IF NOT EXISTS vision TEXT;

COMMENT ON COLUMN coachpro_client_profiles.current_situation
IS 'Co klient aktuálně potřebuje vyřešit / jeho současná situace';

COMMENT ON COLUMN coachpro_client_profiles.vision
IS 'Vize klienta / kam se chce posunout';

-- =====================================
-- 2. Add social media fields
-- =====================================

ALTER TABLE coachpro_client_profiles
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS facebook TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS whatsapp TEXT,
ADD COLUMN IF NOT EXISTS telegram TEXT;

COMMENT ON COLUMN coachpro_client_profiles.linkedin
IS 'LinkedIn profil URL';

COMMENT ON COLUMN coachpro_client_profiles.instagram
IS 'Instagram profil URL nebo handle';

COMMENT ON COLUMN coachpro_client_profiles.facebook
IS 'Facebook profil URL';

COMMENT ON COLUMN coachpro_client_profiles.website
IS 'Osobní webové stránky';

COMMENT ON COLUMN coachpro_client_profiles.whatsapp
IS 'WhatsApp číslo (pro kontakt)';

COMMENT ON COLUMN coachpro_client_profiles.telegram
IS 'Telegram username (pro kontakt)';

-- =====================================
-- 3. Verification Query
-- =====================================

-- Uncomment to verify:
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'coachpro_client_profiles'
-- ORDER BY ordinal_position;
