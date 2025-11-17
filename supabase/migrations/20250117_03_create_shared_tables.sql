-- =====================================================
-- Shared Tables for ProApp Multi-tenant Architecture
-- =====================================================
-- Tables in public schema shared across all applications
-- (CoachPro, LifePro, DigiPro, etc.)

-- =====================================================
-- 1. Organizations (optional - for future multi-org support)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read organizations"
ON public.organizations FOR SELECT
TO public
USING (true);

-- =====================================================
-- 2. User Profiles (extends auth.users)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  photo_url TEXT,
  phone TEXT,
  bio TEXT,
  timezone TEXT DEFAULT 'Europe/Prague',
  locale TEXT DEFAULT 'cs',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- App memberships (which apps user has access to)
  has_coachpro BOOLEAN DEFAULT false,
  has_lifepro BOOLEAN DEFAULT false,
  has_digipro BOOLEAN DEFAULT false
);

-- RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
ON public.user_profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.user_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- =====================================================
-- 3. Subscriptions (future - for paid plans)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app TEXT NOT NULL CHECK (app IN ('coachpro', 'lifepro', 'digipro')),
  plan TEXT NOT NULL CHECK (plan IN ('free', 'basic', 'pro', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
  trial_ends_at TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ DEFAULT now(),
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT unique_user_app_subscription UNIQUE(user_id, app)
);

-- RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscriptions"
ON public.subscriptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- =====================================================
-- 4. Payments (future - transaction log)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app TEXT NOT NULL CHECK (app IN ('coachpro', 'lifepro', 'digipro')),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'CZK',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT CHECK (payment_method IN ('stripe', 'paypal', 'bank', 'contact')),
  stripe_payment_id TEXT,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own payments"
ON public.payments FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- =====================================================
-- 5. Notifications (cross-app notifications)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app TEXT NOT NULL CHECK (app IN ('coachpro', 'lifepro', 'digipro')),
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast queries
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- =====================================================
-- 6. Audit Logs (optional - for security/compliance)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  app TEXT NOT NULL CHECK (app IN ('coachpro', 'lifepro', 'digipro')),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id TEXT,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for queries
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- RLS (admin only)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- No policies yet - only backend functions can write
-- Future: Add admin read policy

-- =====================================================
-- Comments
-- =====================================================

COMMENT ON TABLE public.organizations IS 'Organizations/teams (future multi-tenant support)';
COMMENT ON TABLE public.user_profiles IS 'Extended user profiles across all ProApp applications';
COMMENT ON TABLE public.subscriptions IS 'User subscriptions per app (free/paid plans)';
COMMENT ON TABLE public.payments IS 'Payment transaction log across all apps';
COMMENT ON TABLE public.notifications IS 'Cross-app notification system';
COMMENT ON TABLE public.audit_logs IS 'Security audit trail for compliance';

-- =====================================================
-- Verification
-- =====================================================

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('organizations', 'user_profiles', 'subscriptions', 'payments', 'notifications', 'audit_logs')
ORDER BY table_name;
