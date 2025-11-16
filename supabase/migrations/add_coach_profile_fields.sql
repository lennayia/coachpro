-- Add profile fields to coachpro_coaches table
-- Created: 2025-11-16
-- Purpose: Add bio, education, certifications, specializations, and social media fields

ALTER TABLE coachpro_coaches
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS education TEXT,
ADD COLUMN IF NOT EXISTS certifications TEXT,
ADD COLUMN IF NOT EXISTS specializations TEXT,
ADD COLUMN IF NOT EXISTS years_of_experience INTEGER,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS facebook TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS whatsapp TEXT,
ADD COLUMN IF NOT EXISTS telegram TEXT;

-- Add comment
COMMENT ON COLUMN coachpro_coaches.bio IS 'Coach biography/about me text';
COMMENT ON COLUMN coachpro_coaches.education IS 'Education background';
COMMENT ON COLUMN coachpro_coaches.certifications IS 'Professional certifications';
COMMENT ON COLUMN coachpro_coaches.specializations IS 'Areas of specialization';
COMMENT ON COLUMN coachpro_coaches.years_of_experience IS 'Years of coaching experience';
