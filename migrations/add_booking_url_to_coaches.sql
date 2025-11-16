-- Migration: Add booking_url column to coachpro_coaches table
-- Date: 2025-11-16
-- Purpose: Allow coaches to add their booking system URL (Calendly, Cal.com, etc.)

-- Add booking_url column
ALTER TABLE coachpro_coaches
ADD COLUMN IF NOT EXISTS booking_url TEXT;

-- Add comment
COMMENT ON COLUMN coachpro_coaches.booking_url IS 'URL to external booking system (Calendly, Cal.com, etc.) for self-service session booking';
