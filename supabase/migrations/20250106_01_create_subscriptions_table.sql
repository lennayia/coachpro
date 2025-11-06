-- =====================================================
-- Migration: Create Subscriptions Table
-- Date: 2025-11-06
-- Purpose: User subscription management for coaches and clients
-- =====================================================

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS coachpro_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('client', 'coach', 'tester')),

  -- Subscription details
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'trial', 'basic', 'pro', 'enterprise')),
  active BOOLEAN NOT NULL DEFAULT true,
  trial_ends_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,

  -- Payment integration (Stripe)
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  last_payment_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  UNIQUE(user_id, role)
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON coachpro_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_active ON coachpro_subscriptions(active);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expires_at ON coachpro_subscriptions(expires_at);

-- Enable Row Level Security
ALTER TABLE coachpro_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- 1. Users can read their own subscriptions
DROP POLICY IF EXISTS "Users can read own subscriptions" ON coachpro_subscriptions;
CREATE POLICY "Users can read own subscriptions"
  ON coachpro_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- 2. Users can insert their own subscription (during signup)
DROP POLICY IF EXISTS "Users can insert own subscription" ON coachpro_subscriptions;
CREATE POLICY "Users can insert own subscription"
  ON coachpro_subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Users can update their own subscription (payment info)
DROP POLICY IF EXISTS "Users can update own subscription" ON coachpro_subscriptions;
CREATE POLICY "Users can update own subscription"
  ON coachpro_subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 4. Service role can manage all subscriptions (for admin/webhooks)
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON coachpro_subscriptions;
CREATE POLICY "Service role can manage all subscriptions"
  ON coachpro_subscriptions
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS trigger_update_subscriptions_updated_at ON coachpro_subscriptions;
CREATE TRIGGER trigger_update_subscriptions_updated_at
  BEFORE UPDATE ON coachpro_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscriptions_updated_at();

-- Create function to check if subscription is valid
CREATE OR REPLACE FUNCTION is_subscription_active(p_user_id UUID, p_role TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_subscription RECORD;
BEGIN
  SELECT * INTO v_subscription
  FROM coachpro_subscriptions
  WHERE user_id = p_user_id
    AND role = p_role
  LIMIT 1;

  -- No subscription found
  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Check if active
  IF NOT v_subscription.active THEN
    RETURN false;
  END IF;

  -- Check if expired
  IF v_subscription.expires_at IS NOT NULL AND v_subscription.expires_at < NOW() THEN
    RETURN false;
  END IF;

  -- Check if trial ended
  IF v_subscription.plan = 'trial' AND v_subscription.trial_ends_at IS NOT NULL AND v_subscription.trial_ends_at < NOW() THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helper function to get subscription status
CREATE OR REPLACE FUNCTION get_subscription_status(p_user_id UUID, p_role TEXT)
RETURNS TABLE (
  has_subscription BOOLEAN,
  is_active BOOLEAN,
  plan TEXT,
  expires_at TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ,
  days_remaining INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    true AS has_subscription,
    s.active AS is_active,
    s.plan,
    s.expires_at,
    s.trial_ends_at,
    CASE
      WHEN s.expires_at IS NOT NULL THEN EXTRACT(DAY FROM s.expires_at - NOW())::INTEGER
      WHEN s.trial_ends_at IS NOT NULL THEN EXTRACT(DAY FROM s.trial_ends_at - NOW())::INTEGER
      ELSE NULL
    END AS days_remaining
  FROM coachpro_subscriptions s
  WHERE s.user_id = p_user_id
    AND s.role = p_role
  LIMIT 1;

  -- Return default if no subscription found
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, false, 'none'::TEXT, NULL::TIMESTAMPTZ, NULL::TIMESTAMPTZ, NULL::INTEGER;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments for documentation
COMMENT ON TABLE coachpro_subscriptions IS 'User subscription management for coaches and clients';
COMMENT ON COLUMN coachpro_subscriptions.role IS 'User role: client, coach, or tester (testers are free forever)';
COMMENT ON COLUMN coachpro_subscriptions.plan IS 'Subscription plan: free, trial, basic, pro, enterprise';
COMMENT ON COLUMN coachpro_subscriptions.active IS 'Whether subscription is currently active';
COMMENT ON COLUMN coachpro_subscriptions.trial_ends_at IS 'When trial period ends (NULL if not on trial)';
COMMENT ON COLUMN coachpro_subscriptions.expires_at IS 'When paid subscription expires (NULL for free/lifetime)';
COMMENT ON FUNCTION is_subscription_active IS 'Check if user has valid active subscription';
COMMENT ON FUNCTION get_subscription_status IS 'Get detailed subscription status for a user';
