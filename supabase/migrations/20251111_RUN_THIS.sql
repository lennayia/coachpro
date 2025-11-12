-- =====================================================
-- Session #15 - Profile Fields Migration
-- Date: 2025-11-11
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- PART 1: Add fields to coachpro_coaches
-- =====================================================

-- Photo URL
ALTER TABLE coachpro_coaches
ADD COLUMN IF NOT EXISTS photo_url TEXT;

COMMENT ON COLUMN coachpro_coaches.photo_url
IS 'URL fotky profilu kouče v Supabase Storage (bucket: coach-photos)';

-- Professional fields
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

-- Social media fields
ALTER TABLE coachpro_coaches
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS facebook TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS whatsapp TEXT,
ADD COLUMN IF NOT EXISTS telegram TEXT;

COMMENT ON COLUMN coachpro_coaches.linkedin IS 'LinkedIn profil URL';
COMMENT ON COLUMN coachpro_coaches.instagram IS 'Instagram profil URL nebo handle';
COMMENT ON COLUMN coachpro_coaches.facebook IS 'Facebook profil URL';
COMMENT ON COLUMN coachpro_coaches.website IS 'Osobní webové stránky';
COMMENT ON COLUMN coachpro_coaches.whatsapp IS 'WhatsApp číslo (pro kontakt)';
COMMENT ON COLUMN coachpro_coaches.telegram IS 'Telegram username (pro kontakt)';

-- =====================================================
-- PART 2: Add fields to coachpro_client_profiles
-- =====================================================

-- Client-specific goal fields
ALTER TABLE coachpro_client_profiles
ADD COLUMN IF NOT EXISTS current_situation TEXT,
ADD COLUMN IF NOT EXISTS vision TEXT;

COMMENT ON COLUMN coachpro_client_profiles.current_situation
IS 'Co klient aktuálně potřebuje vyřešit / jeho současná situace';

COMMENT ON COLUMN coachpro_client_profiles.vision
IS 'Vize klienta / kam se chce posunout';

-- Social media fields
ALTER TABLE coachpro_client_profiles
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS facebook TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS whatsapp TEXT,
ADD COLUMN IF NOT EXISTS telegram TEXT;

COMMENT ON COLUMN coachpro_client_profiles.linkedin IS 'LinkedIn profil URL';
COMMENT ON COLUMN coachpro_client_profiles.instagram IS 'Instagram profil URL nebo handle';
COMMENT ON COLUMN coachpro_client_profiles.facebook IS 'Facebook profil URL';
COMMENT ON COLUMN coachpro_client_profiles.website IS 'Osobní webové stránky';
COMMENT ON COLUMN coachpro_client_profiles.whatsapp IS 'WhatsApp číslo (pro kontakt)';
COMMENT ON COLUMN coachpro_client_profiles.telegram IS 'Telegram username (pro kontakt)';

-- =====================================================
-- DONE! ✅
-- =====================================================

-- Verification queries (uncomment to check):
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'coachpro_coaches' ORDER BY ordinal_position;
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'coachpro_client_profiles' ORDER BY ordinal_position;
