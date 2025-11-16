-- ============================================================================
-- COACHPRO DATABASE SCHEMA - Supabase PostgreSQL
-- ============================================================================
-- Created: 3. listopadu 2025
-- Purpose: Migrate from localStorage to Supabase Database
-- Tables: coachpro_coaches, coachpro_materials, coachpro_programs,
--         coachpro_clients, coachpro_shared_materials
-- Note: Part of ProApp ecosystem - uses coachpro_ prefix
-- ============================================================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. COACHES TABLE
-- ============================================================================
-- Stores coach/tester accounts
-- ============================================================================

CREATE TABLE IF NOT EXISTS coachpro_coaches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  photo_url TEXT,
  is_admin BOOLEAN DEFAULT false,
  is_tester BOOLEAN DEFAULT false,
  tester_id UUID REFERENCES testers(id) ON DELETE SET NULL,
  access_code TEXT,
  auth_user_id UUID,
  -- Profile fields
  bio TEXT,
  education TEXT,
  certifications TEXT,
  specializations TEXT,
  years_of_experience INTEGER,
  -- Social media & contact
  linkedin TEXT,
  instagram TEXT,
  facebook TEXT,
  website TEXT,
  whatsapp TEXT,
  telegram TEXT,
  -- Booking & scheduling
  booking_url TEXT, -- Calendly, Cal.com, or other booking system URL
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for coaches
CREATE INDEX IF NOT EXISTS idx_coachpro_coaches_email ON coachpro_coaches(email);
CREATE INDEX IF NOT EXISTS idx_coachpro_coaches_tester_id ON coachpro_coaches(tester_id);
CREATE INDEX IF NOT EXISTS idx_coachpro_coaches_created_at ON coachpro_coaches(created_at DESC);

-- RLS Policies for coaches
ALTER TABLE coachpro_coaches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read coaches"
  ON coachpro_coaches FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert coaches"
  ON coachpro_coaches FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update coaches"
  ON coachpro_coaches FOR UPDATE
  TO public
  USING (true);

-- ============================================================================
-- 2. MATERIALS TABLE
-- ============================================================================
-- Stores all material types: audio, video, pdf, image, document, text, link
-- ============================================================================

CREATE TABLE IF NOT EXISTS coachpro_materials (
  id TEXT PRIMARY KEY,
  coach_id TEXT NOT NULL REFERENCES coachpro_coaches(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('audio', 'video', 'pdf', 'image', 'document', 'text', 'link')),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL, -- Base64 for files, URL for links, text content for text type
  category TEXT CHECK (category IN ('meditation', 'affirmation', 'exercise', 'reflection', 'other', 'template', 'worksheet', 'workbook', 'question', 'feedback')),

  -- File metadata
  file_name TEXT,
  file_size INTEGER,
  page_count INTEGER,
  duration INTEGER, -- seconds for audio/video
  storage_path TEXT, -- Supabase Storage path

  -- Link metadata (for type='link')
  link_type TEXT, -- youtube, spotify, google-drive, etc.
  link_meta JSONB, -- { icon, label, color, embedSupport }
  thumbnail TEXT, -- Thumbnail URL (mainly for YouTube)

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for materials
CREATE INDEX IF NOT EXISTS idx_coachpro_materials_coach_id ON coachpro_materials(coach_id);
CREATE INDEX IF NOT EXISTS idx_coachpro_materials_type ON coachpro_materials(type);
CREATE INDEX IF NOT EXISTS idx_coachpro_materials_category ON coachpro_materials(category);
CREATE INDEX IF NOT EXISTS idx_coachpro_materials_created_at ON coachpro_materials(created_at DESC);

-- RLS Policies for materials
ALTER TABLE coachpro_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read materials"
  ON coachpro_materials FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert materials"
  ON coachpro_materials FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update materials"
  ON coachpro_materials FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Anyone can delete materials"
  ON coachpro_materials FOR DELETE
  TO public
  USING (true);

-- ============================================================================
-- 3. PROGRAMS TABLE
-- ============================================================================
-- Stores programs (collections of daily materials)
-- ============================================================================

CREATE TABLE IF NOT EXISTS coachpro_programs (
  id TEXT PRIMARY KEY,
  coach_id TEXT NOT NULL REFERENCES coachpro_coaches(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL CHECK (duration > 0), -- Number of days
  share_code TEXT UNIQUE NOT NULL, -- 6-char code (e.g. ABC123)
  qr_code TEXT, -- Base64 QR code image
  is_active BOOLEAN DEFAULT true,
  days JSONB NOT NULL, -- Array of day objects: [{ dayNumber, title, description, materialIds[], instruction }]
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for programs
CREATE INDEX IF NOT EXISTS idx_coachpro_programs_coach_id ON coachpro_programs(coach_id);
CREATE INDEX IF NOT EXISTS idx_coachpro_programs_share_code ON coachpro_programs(share_code);
CREATE INDEX IF NOT EXISTS idx_coachpro_programs_is_active ON coachpro_programs(is_active);
CREATE INDEX IF NOT EXISTS idx_coachpro_programs_created_at ON coachpro_programs(created_at DESC);

-- RLS Policies for programs
ALTER TABLE coachpro_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read programs"
  ON coachpro_programs FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert programs"
  ON coachpro_programs FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update programs"
  ON coachpro_programs FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Anyone can delete programs"
  ON coachpro_programs FOR DELETE
  TO public
  USING (true);

-- ============================================================================
-- 4. CLIENTS TABLE
-- ============================================================================
-- Stores client progress through programs
-- ============================================================================

CREATE TABLE IF NOT EXISTS coachpro_clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  program_code TEXT NOT NULL, -- Reference to programs.share_code
  program_id TEXT REFERENCES coachpro_programs(id) ON DELETE CASCADE,
  current_day INTEGER DEFAULT 1 CHECK (current_day > 0),
  completed_days JSONB DEFAULT '[]', -- Array of day numbers: [1, 2, 3]
  mood_checks JSONB DEFAULT '[]', -- Array of mood check objects: [{ day, before, after, timestamp }]
  streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  certificate_generated BOOLEAN DEFAULT false
);

-- Indexes for clients
CREATE INDEX IF NOT EXISTS idx_coachpro_clients_program_code ON coachpro_clients(program_code);
CREATE INDEX IF NOT EXISTS idx_coachpro_clients_program_id ON coachpro_clients(program_id);
CREATE INDEX IF NOT EXISTS idx_coachpro_clients_started_at ON coachpro_clients(started_at DESC);

-- RLS Policies for clients
ALTER TABLE coachpro_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read clients"
  ON coachpro_clients FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert clients"
  ON coachpro_clients FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update clients"
  ON coachpro_clients FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Anyone can delete clients"
  ON coachpro_clients FOR DELETE
  TO public
  USING (true);

-- ============================================================================
-- 5. SHARED_MATERIALS TABLE
-- ============================================================================
-- Stores individually shared materials (separate from programs)
-- ============================================================================

CREATE TABLE IF NOT EXISTS coachpro_shared_materials (
  id TEXT PRIMARY KEY,
  material_id TEXT NOT NULL REFERENCES coachpro_materials(id) ON DELETE CASCADE,
  material JSONB NOT NULL, -- Full material object snapshot
  share_code TEXT UNIQUE NOT NULL, -- 6-char code (e.g. ABC123)
  qr_code TEXT, -- Base64 QR code image
  coach_id TEXT NOT NULL REFERENCES coachpro_coaches(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for shared_materials
CREATE INDEX IF NOT EXISTS idx_coachpro_shared_materials_material_id ON coachpro_shared_materials(material_id);
CREATE INDEX IF NOT EXISTS idx_coachpro_shared_materials_share_code ON coachpro_shared_materials(share_code);
CREATE INDEX IF NOT EXISTS idx_coachpro_shared_materials_coach_id ON coachpro_shared_materials(coach_id);
CREATE INDEX IF NOT EXISTS idx_coachpro_shared_materials_created_at ON coachpro_shared_materials(created_at DESC);

-- RLS Policies for shared_materials
ALTER TABLE coachpro_shared_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read shared_materials"
  ON coachpro_shared_materials FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert shared_materials"
  ON coachpro_shared_materials FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can delete shared_materials"
  ON coachpro_shared_materials FOR DELETE
  TO public
  USING (true);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_coachpro_coaches_updated_at
  BEFORE UPDATE ON coachpro_coaches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coachpro_materials_updated_at
  BEFORE UPDATE ON coachpro_materials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coachpro_programs_updated_at
  BEFORE UPDATE ON coachpro_programs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED DATA (Optional - for testing)
-- ============================================================================

-- Uncomment below to add sample data for testing:

-- INSERT INTO coachpro_coaches (id, name, email, is_admin) VALUES
--   ('admin-lenna', 'Lenka Roubalová', 'lenkaroubalka@gmail.com', true);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check if tables were created:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check table structures:
-- \d coachpro_coaches
-- \d coachpro_materials
-- \d coachpro_programs
-- \d coachpro_clients
-- \d coachpro_shared_materials

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
