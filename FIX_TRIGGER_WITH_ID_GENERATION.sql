-- =====================================================
-- Fix: Auto-share trigger WITH id generation
-- Issue: id column has no default, must be generated
-- =====================================================

-- Drop old trigger and function
DROP TRIGGER IF EXISTS trigger_auto_share_after_purchase ON coachpro_purchases;
DROP FUNCTION IF EXISTS auto_share_after_purchase();

-- Recreate function with UUID generation for id
CREATE OR REPLACE FUNCTION auto_share_after_purchase()
RETURNS TRIGGER AS $$
BEGIN
  -- Only auto-share if access is granted (should always be true in beta)
  IF NEW.access_granted = true THEN

    -- Share material (generate UUID for id)
    IF NEW.item_type = 'material' THEN
      INSERT INTO coachpro_shared_materials (
        id,
        coach_id,
        material_id,
        client_email,
        share_code,
        material
      )
      VALUES (
        gen_random_uuid()::text,  -- Generate UUID for id
        NEW.coach_id,
        NEW.item_id,
        NEW.client_email,
        NULL,  -- share_code can be NULL
        NULL   -- material JSONB can be NULL
      )
      ON CONFLICT (coach_id, material_id, client_email) DO NOTHING;
    END IF;

    -- Share program (generate UUID for id)
    IF NEW.item_type = 'program' THEN
      INSERT INTO coachpro_shared_programs (
        id,
        coach_id,
        program_id,
        client_email,
        share_code,
        program
      )
      VALUES (
        gen_random_uuid()::text,
        NEW.coach_id,
        NEW.item_id,
        NEW.client_email,
        NULL,
        NULL
      )
      ON CONFLICT (coach_id, program_id, client_email) DO NOTHING;
    END IF;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER trigger_auto_share_after_purchase
AFTER INSERT ON coachpro_purchases
FOR EACH ROW
EXECUTE FUNCTION auto_share_after_purchase();

-- Comments
COMMENT ON FUNCTION auto_share_after_purchase IS 'Automatically shares material/program with client after purchase (with UUID generation)';
