-- Temporary fix: Set coach_id for Lenka's client profile
-- This will enable testing of dashboard widget and sessions list

-- Step 1: Update client profile with coach_id
UPDATE coachpro_client_profiles
SET coach_id = 'tester-4debbbb6-9dae-46fd-9f0f-2552b5d678f7'
WHERE id = 'c6f7f0e5-90cf-44a0-b6c6-88dbb12498a8';

-- Step 2: Create test session for testing dashboard widget
-- Session scheduled for tomorrow at 14:00
INSERT INTO coachpro_sessions (
  id,
  client_id,
  coach_id,
  session_date,
  duration_minutes,
  location,
  status,
  coach_notes,
  created_by,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'c6f7f0e5-90cf-44a0-b6c6-88dbb12498a8',
  'tester-4debbbb6-9dae-46fd-9f0f-2552b5d678f7',
  (NOW() + INTERVAL '1 day')::date + TIME '14:00:00',
  60,
  'online',
  'scheduled',
  'První koučovací sezení - úvodní konzultace',
  'coach',
  NOW(),
  NOW()
);

-- Step 3: Create another test session for next week
INSERT INTO coachpro_sessions (
  id,
  client_id,
  coach_id,
  session_date,
  duration_minutes,
  location,
  status,
  coach_notes,
  created_by,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'c6f7f0e5-90cf-44a0-b6c6-88dbb12498a8',
  'tester-4debbbb6-9dae-46fd-9f0f-2552b5d678f7',
  (NOW() + INTERVAL '7 days')::date + TIME '15:00:00',
  90,
  'in-person',
  'scheduled',
  'Následující sezení - pokračování práce na cílech',
  'coach',
  NOW(),
  NOW()
);

-- Step 4: Create a past completed session for testing history
INSERT INTO coachpro_sessions (
  id,
  client_id,
  coach_id,
  session_date,
  duration_minutes,
  location,
  status,
  coach_notes,
  session_summary,
  created_by,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'c6f7f0e5-90cf-44a0-b6c6-88dbb12498a8',
  'tester-4debbbb6-9dae-46fd-9f0f-2552b5d678f7',
  (NOW() - INTERVAL '3 days')::date + TIME '10:00:00',
  60,
  'online',
  'completed',
  'Úvodní sezení - zjišťování cílů',
  'Výborné první sezení. Klientka je motivovaná a má jasné cíle.',
  'coach',
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days'
);
