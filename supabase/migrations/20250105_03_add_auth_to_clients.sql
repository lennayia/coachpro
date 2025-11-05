-- Add OAuth support to coachpro_clients table
-- Migration: 20250105_03 - Link clients to auth users

-- Add auth_user_id column (nullable for backward compatibility with code-based clients)
ALTER TABLE coachpro_clients
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for fast auth lookups
CREATE INDEX IF NOT EXISTS idx_clients_auth_user
ON coachpro_clients(auth_user_id);

-- Update RLS policies to support both OAuth and code-based clients

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can insert clients" ON coachpro_clients;
DROP POLICY IF EXISTS "Public can select clients" ON coachpro_clients;
DROP POLICY IF EXISTS "Public can update clients" ON coachpro_clients;

-- New policies

-- Policy: Anyone can insert (for both OAuth and code-based signup)
CREATE POLICY "Anyone can create client"
ON coachpro_clients
FOR INSERT
WITH CHECK (true);

-- Policy: Clients can read their own data (OAuth or by matching id in session)
CREATE POLICY "Clients can read own data"
ON coachpro_clients
FOR SELECT
USING (
  auth_user_id = auth.uid() -- OAuth client
  OR id::text = current_setting('request.jwt.claims', true)::json->>'client_id' -- Code-based client (session)
);

-- Policy: Clients can update their own data
CREATE POLICY "Clients can update own data"
ON coachpro_clients
FOR UPDATE
USING (
  auth_user_id = auth.uid()
  OR id::text = current_setting('request.jwt.claims', true)::json->>'client_id'
);

-- Policy: Coaches can read their clients
CREATE POLICY "Coaches can read their clients"
ON coachpro_clients
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM coachpro_programs p
    WHERE p.id = coachpro_clients.program_id
    AND p.coach_id = auth.uid()::text
  )
);

-- Comments
COMMENT ON COLUMN coachpro_clients.auth_user_id IS 'Reference to Supabase auth.users (null for code-based clients)';
