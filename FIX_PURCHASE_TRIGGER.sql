-- =====================================================
-- Fix: Auto-share trigger (remove shared_at column)
-- Issue: shared_at doesn't exist in shared_materials/programs
-- =====================================================

-- Drop old trigger and function
DROP TRIGGER IF EXISTS trigger_auto_share_after_purchase ON coachpro_purchases;
DROP FUNCTION IF EXISTS auto_share_after_purchase();

-- Recreate function without shared_at
CREATE OR REPLACE FUNCTION auto_share_after_purchase()
RETURNS TRIGGER AS $$
BEGIN
  -- Only auto-share if access is granted (should always be true in beta)
  IF NEW.access_granted = true THEN

    -- Share material (WITHOUT shared_at - column doesn't exist)
    IF NEW.item_type = 'material' THEN
      INSERT INTO coachpro_shared_materials (coach_id, material_id, client_email)
      VALUES (NEW.coach_id, NEW.item_id, NEW.client_email)
      ON CONFLICT (coach_id, material_id, client_email) DO NOTHING;
    END IF;

    -- Share program (WITHOUT shared_at)
    IF NEW.item_type = 'program' THEN
      INSERT INTO coachpro_shared_programs (coach_id, program_id, client_email)
      VALUES (NEW.coach_id, NEW.item_id, NEW.client_email)
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
COMMENT ON FUNCTION auto_share_after_purchase IS 'Automatically shares material/program with client after purchase (fixed - no shared_at column)';
