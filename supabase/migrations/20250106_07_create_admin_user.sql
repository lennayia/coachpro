-- =====================================================
-- Migration: Create Admin User in Supabase Auth
-- Date: 2025-01-06
-- Purpose: Create lenna@online-byznys.cz with email/password auth
-- =====================================================

-- Delete existing user if exists (cleanup)
DELETE FROM auth.users WHERE email = 'lenna@online-byznys.cz';

-- Create admin user in auth.users
-- Password: lenna2025
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'lenna@online-byznys.cz',
  crypt('lenna2025', gen_salt('bf')), -- Password: lenna2025
  NOW(), -- Email already confirmed
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"],"isAdmin":true}'::jsonb,
  '{"isAdmin":true,"name":"Lenka Roubalová"}'::jsonb,
  false,
  '',
  ''
);

-- Create identity record (required for email/password login)
INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  provider,
  identity_data,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  id,
  id::text, -- provider_id = user_id for email provider
  'email',
  jsonb_build_object(
    'sub', id::text,
    'email', email,
    'email_verified', true,
    'phone_verified', false
  ),
  NOW(),
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'lenna@online-byznys.cz';

-- Verify creation
SELECT
  id,
  email,
  email_confirmed_at,
  raw_user_meta_data->>'isAdmin' as is_admin,
  created_at
FROM auth.users
WHERE email = 'lenna@online-byznys.cz';
