-- Test script for auto-assign coach functionality
-- Run this to prepare test environment

-- Step 1: Remove coach_id from test client (to test auto-assign)
UPDATE coachpro_client_profiles
SET coach_id = NULL
WHERE id = 'c6f7f0e5-90cf-44a0-b6c6-88dbb12498a8';

-- Step 2: Verify test coach exists
-- SELECT * FROM coachpro_coaches WHERE id = 'tester-4debbbb6-9dae-46fd-9f0f-2552b5d678f7';

-- Step 3: Create a test shared material with coach_id (if not exists)
-- First check if material exists
-- SELECT * FROM coachpro_materials LIMIT 1;

-- Note: You'll need to create a shared material manually from the coach interface
-- or run this after you have at least one material in the database

-- To verify coach was auto-assigned after using a code:
-- SELECT id, name, coach_id FROM coachpro_client_profiles WHERE id = 'c6f7f0e5-90cf-44a0-b6c6-88dbb12498a8';
