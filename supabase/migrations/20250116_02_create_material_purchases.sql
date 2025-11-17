-- =====================================================
-- Migration: Material/Program Purchases (Pay with Contact)
-- Date: 2025-01-16
-- Purpose: Track when clients "buy" materials/programs with their contact info
-- =====================================================

-- Table: Material/Program purchases (beta = pay with contact, later = pay with money)
CREATE TABLE IF NOT EXISTS coachpro_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- What was purchased
  item_type TEXT NOT NULL CHECK (item_type IN ('material', 'program', 'card-deck')),
  item_id TEXT NOT NULL, -- Reference to material/program/card ID

  -- Who purchased
  client_id UUID REFERENCES coachpro_client_profiles(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,

  -- From which coach
  coach_id TEXT NOT NULL REFERENCES coachpro_coaches(id) ON DELETE CASCADE,

  -- Payment info (beta = contact, later = money)
  payment_method TEXT DEFAULT 'contact' CHECK (payment_method IN ('contact', 'stripe', 'paypal', 'bank')),
  payment_status TEXT DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  amount DECIMAL(10, 2) DEFAULT 0, -- Beta: 0, Later: actual price
  currency TEXT DEFAULT 'CZK',

  -- Metadata
  access_granted BOOLEAN DEFAULT true, -- Auto-grant in beta, later after payment
  purchased_at TIMESTAMPTZ DEFAULT now(),

  -- Notes from client (optional)
  client_message TEXT, -- "Zajímá mě toto, protože..."

  -- Indexes
  CONSTRAINT unique_purchase UNIQUE(client_email, item_type, item_id)
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_purchases_client_id ON coachpro_purchases(client_id);
CREATE INDEX IF NOT EXISTS idx_purchases_coach_id ON coachpro_purchases(coach_id);
CREATE INDEX IF NOT EXISTS idx_purchases_client_email ON coachpro_purchases(client_email);
CREATE INDEX IF NOT EXISTS idx_purchases_item ON coachpro_purchases(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_purchases_purchased_at ON coachpro_purchases(purchased_at DESC);

-- RLS Policies
ALTER TABLE coachpro_purchases ENABLE ROW LEVEL SECURITY;

-- Policy 1: Clients can insert their own purchases (buy with contact)
CREATE POLICY "Clients can create purchases"
ON coachpro_purchases
FOR INSERT
TO authenticated
WITH CHECK (
  client_id IN (
    SELECT id FROM coachpro_client_profiles WHERE auth_user_id = auth.uid()
  )
);

-- Policy 2: Clients can read their own purchases
CREATE POLICY "Clients can read own purchases"
ON coachpro_purchases
FOR SELECT
TO authenticated
USING (
  client_id IN (
    SELECT id FROM coachpro_client_profiles WHERE auth_user_id = auth.uid()
  )
);

-- Policy 3: Coaches can read purchases of their materials/programs
CREATE POLICY "Coaches can read their item purchases"
ON coachpro_purchases
FOR SELECT
TO authenticated
USING (
  coach_id IN (
    SELECT id FROM coachpro_coaches WHERE auth_user_id = auth.uid()
  )
);

-- Comments
COMMENT ON TABLE coachpro_purchases IS 'Tracks material/program purchases - Beta: pay with contact, Later: pay with money';
COMMENT ON COLUMN coachpro_purchases.payment_method IS 'contact = beta (free with contact info), stripe/paypal/bank = later paid versions';
COMMENT ON COLUMN coachpro_purchases.amount IS 'Beta: 0 CZK, Later: actual price';
COMMENT ON COLUMN coachpro_purchases.client_message IS 'Optional message from client explaining interest';

-- =====================================================
-- Auto-share materials/programs after purchase
-- =====================================================

-- Function: Auto-share material after purchase
CREATE OR REPLACE FUNCTION auto_share_after_purchase()
RETURNS TRIGGER AS $$
BEGIN
  -- Only auto-share if access is granted (should always be true in beta)
  IF NEW.access_granted = true THEN

    -- Share material
    IF NEW.item_type = 'material' THEN
      INSERT INTO coachpro_shared_materials (coach_id, material_id, client_email, shared_at)
      VALUES (NEW.coach_id, NEW.item_id, NEW.client_email, NOW())
      ON CONFLICT (coach_id, material_id, client_email) DO NOTHING;
    END IF;

    -- Share program
    IF NEW.item_type = 'program' THEN
      INSERT INTO coachpro_shared_programs (coach_id, program_id, client_email, shared_at)
      VALUES (NEW.coach_id, NEW.item_id, NEW.client_email, NOW())
      ON CONFLICT (coach_id, program_id, client_email) DO NOTHING;
    END IF;

    -- Share card deck (TODO: when card sharing table exists)
    -- IF NEW.item_type = 'card-deck' THEN ... END IF;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Auto-share after purchase
DROP TRIGGER IF EXISTS trigger_auto_share_after_purchase ON coachpro_purchases;
CREATE TRIGGER trigger_auto_share_after_purchase
AFTER INSERT ON coachpro_purchases
FOR EACH ROW
EXECUTE FUNCTION auto_share_after_purchase();

-- Comments
COMMENT ON FUNCTION auto_share_after_purchase IS 'Automatically shares material/program with client after purchase';
