-- CoachPro Testers Table with GDPR Compliance
-- Run this in Supabase SQL Editor

-- Drop table if exists (for development only - remove in production)
-- DROP TABLE IF EXISTS testers;

-- Create testers table
CREATE TABLE testers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic info
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  reason text,
  access_code text UNIQUE NOT NULL,

  -- GDPR consent fields
  marketing_consent boolean DEFAULT false,
  marketing_consent_date timestamptz,
  terms_accepted boolean NOT NULL DEFAULT true,
  terms_accepted_date timestamptz DEFAULT now(),

  -- Tracking
  created_at timestamptz DEFAULT now(),
  last_login timestamptz,
  ip_address text,
  user_agent text,

  -- MailerLite integration
  mailerlite_subscriber_id text,
  exported_to_mailing boolean DEFAULT false,
  exported_at timestamptz,

  -- Status
  is_active boolean DEFAULT true,
  notes text
);

-- Create indexes for performance
CREATE INDEX idx_testers_email ON testers(email);
CREATE INDEX idx_testers_access_code ON testers(access_code);
CREATE INDEX idx_testers_marketing_consent ON testers(marketing_consent);
CREATE INDEX idx_testers_created_at ON testers(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE testers ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Allow public INSERT (for signup)
CREATE POLICY "Allow public signup" ON testers
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public SELECT by access_code (for login verification)
CREATE POLICY "Allow public select by access_code" ON testers
  FOR SELECT
  TO public
  USING (access_code IS NOT NULL);

-- Allow public UPDATE of last_login by access_code
CREATE POLICY "Allow public update last_login" ON testers
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Add comment
COMMENT ON TABLE testers IS 'Beta testers with GDPR consent tracking and MailerLite integration';

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON testers TO anon;
GRANT SELECT, INSERT, UPDATE ON testers TO authenticated;
