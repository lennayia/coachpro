-- =====================================================
-- Migration: Add Profile Fields to coachpro_coaches
-- Date: 2025-11-11
-- Session: #15
-- Purpose: Add photo_url and professional fields to coaches table
-- =====================================================

-- =====================================
-- 1. Add photo_url column
-- =====================================

ALTER TABLE coachpro_coaches
ADD COLUMN IF NOT EXISTS photo_url TEXT;

COMMENT ON COLUMN coachpro_coaches.photo_url
IS 'URL fotky profilu kouče v Supabase Storage (bucket: coach-photos)';

-- =====================================
-- 2. Add professional fields
-- =====================================

ALTER TABLE coachpro_coaches
ADD COLUMN IF NOT EXISTS education TEXT,
ADD COLUMN IF NOT EXISTS certifications TEXT,
ADD COLUMN IF NOT EXISTS specializations TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS years_of_experience INTEGER;

COMMENT ON COLUMN coachpro_coaches.education
IS 'Vzdělání kouče (kterou prošel koučovací školou, atd.)';

COMMENT ON COLUMN coachpro_coaches.certifications
IS 'Certifikace kouče (ICF, AC, atd.)';

COMMENT ON COLUMN coachpro_coaches.specializations
IS 'Specializace kouče (life coaching, business coaching, atd.)';

COMMENT ON COLUMN coachpro_coaches.bio
IS 'Krátká biografická informace o koučovi';

COMMENT ON COLUMN coachpro_coaches.years_of_experience
IS 'Počet let zkušeností s koučováním';

-- =====================================
-- 3. Add social media fields
-- =====================================

ALTER TABLE coachpro_coaches
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS facebook TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS whatsapp TEXT,
ADD COLUMN IF NOT EXISTS telegram TEXT;

COMMENT ON COLUMN coachpro_coaches.linkedin
IS 'LinkedIn profil URL';

COMMENT ON COLUMN coachpro_coaches.instagram
IS 'Instagram profil URL nebo handle';

COMMENT ON COLUMN coachpro_coaches.facebook
IS 'Facebook profil URL';

COMMENT ON COLUMN coachpro_coaches.website
IS 'Osobní webové stránky';

COMMENT ON COLUMN coachpro_coaches.whatsapp
IS 'WhatsApp číslo (pro kontakt)';

COMMENT ON COLUMN coachpro_coaches.telegram
IS 'Telegram username (pro kontakt)';

-- =====================================
-- 4. Verification Query
-- =====================================

-- Uncomment to verify:
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'coachpro_coaches'
-- ORDER BY ordinal_position;
