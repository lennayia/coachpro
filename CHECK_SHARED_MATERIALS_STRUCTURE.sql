-- Check the structure of coachpro_shared_materials table
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'coachpro_shared_materials'
ORDER BY ordinal_position;
