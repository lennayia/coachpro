# ProApp Ecosystem - Complete Architecture Guide

**Last Updated:** 17.01.2025
**Version:** 1.0
**Status:** ✅ Production Architecture - Migrations Complete (3/3)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Database Structure](#database-structure)
4. [Storage Structure](#storage-structure)
5. [Authentication](#authentication)
6. [Domain Setup](#domain-setup)
7. [Cross-Module Integration](#cross-module-integration)
8. [Shared Functions](#shared-functions)
9. [Module Creation Guide](#module-creation-guide)
10. [Migration Guide](#migration-guide)
11. [Best Practices](#best-practices)

---

## 🌐 Overview

### What is ProApp?

**ProApp** is an **umbrella Supabase project** that hosts multiple interconnected applications:

- 🎯 **CoachPro** - Coaching management platform
- 📰 **ContentPro** - Content creation & publishing
- 💳 **PaymentsPro** - Payment & billing system
- 🎓 **StudyPro** - Online learning platform
- 🌱 **LifePro** - Life purpose discovery
- 💼 **DigiPro** - Digital products marketplace

### Key Principles

1. ✅ **Single Authentication** - One user account across all modules
2. ✅ **Shared Resources** - Common user profiles, payments, notifications
3. ✅ **Data Isolation** - Each module has isolated database schema
4. ✅ **Modular Architecture** - Add new modules without affecting existing ones
5. ✅ **Cross-Module Integration** - Modules can read/link each other's data

---

## 🏗️ Architecture

### High-Level Structure

```
ProApp (Supabase Project)
│
├── Database (PostgreSQL)
│   ├── public schema (shared)
│   ├── coachpro schema (isolated)
│   ├── contentpro schema (isolated)
│   ├── paymentspro schema (isolated)
│   ├── studypro schema (isolated)
│   ├── lifepro schema (isolated)
│   └── digipro schema (isolated)
│
├── Storage (Supabase Storage)
│   ├── shared/ (common files)
│   ├── coachpro/ (module-specific)
│   ├── contentpro/ (module-specific)
│   ├── paymentspro/ (module-specific)
│   ├── studypro/ (module-specific)
│   ├── lifepro/ (module-specific)
│   └── digipro/ (module-specific)
│
└── Auth (Supabase Auth)
    ├── Google OAuth
    ├── Email/Password
    └── Session management
```

### Visual Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ProApp Ecosystem                          │
│                  (Single Supabase Project)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  🌐 proapp.cz                                                │
│  ├── Landing Page                                            │
│  ├── Unified Login                                           │
│  └── Module Dashboard                                        │
│                                                               │
├───────────────┬───────────────┬───────────────┬──────────────┤
│               │               │               │              │
│  CoachPro     │  ContentPro   │  PaymentsPro  │  StudyPro    │
│  .proapp.cz   │  .proapp.cz   │  .proapp.cz   │  .proapp.cz  │
│               │               │               │              │
│  coachpro.cz  │  contentpro.cz│ paymentspro.cz│ studypro.cz  │
│  (redirect)   │  (redirect)   │  (redirect)   │  (redirect)  │
│               │               │               │              │
└───────────────┴───────────────┴───────────────┴──────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │   Shared Supabase Resources    │
        ├────────────────────────────────┤
        │  • Auth (Google OAuth)         │
        │  • public.user_profiles        │
        │  • public.subscriptions        │
        │  • public.payments             │
        │  • public.notifications        │
        │  • shared/ storage bucket      │
        └────────────────────────────────┘
```

---

## 🗄️ Database Structure

### Current Status (17.01.2025)

✅ **Production Database:**
- **7 schemas** created and active
- **34 total tables** (6 shared + 28 coachpro)
- **All migrations completed** (3/3)
- **Zero breaking changes** to CoachPro application

| Schema | Tables | Status |
|--------|--------|--------|
| **public** | 6 | ✅ Shared across all modules |
| **coachpro** | 28 | ✅ Active (CoachPro production) |
| **contentpro** | 0 | 🚧 Ready for development |
| **paymentspro** | 0 | 🚧 Ready for development |
| **studypro** | 0 | 🚧 Ready for development |
| **lifepro** | 0 | 🚧 Ready for development |
| **digipro** | 0 | 🚧 Ready for development |

---

### PostgreSQL Schemas

**ProApp uses PostgreSQL schemas for namespace isolation:**

```sql
-- Shared schema (cross-module resources)
public
├── user_profiles          -- Universal user data
├── organizations          -- Multi-tenant support
├── subscriptions          -- Per-module subscriptions
├── payments               -- Transaction log (all modules)
├── notifications          -- Cross-module notifications
└── audit_logs             -- Security & compliance

-- CoachPro schema (isolated) - 28 tables ✅
coachpro
├── coachpro_coaches
├── coachpro_client_profiles
├── coachpro_clients
├── coachpro_materials
├── coachpro_programs
├── coachpro_sessions
├── coachpro_purchases
├── coachpro_shared_materials
├── coachpro_shared_programs
├── coachpro_card_decks
├── coachpro_cards
├── coachpro_cards_v2
├── coachpro_card_usage
├── coachpro_card_notes_v2
├── coachpro_shared_card_decks
├── coachpro_program_sessions
├── coachpro_daily_programs
├── coachpro_subscriptions
├── audit_logs
├── client_next_sessions
├── email_verification_tokens
├── modules
├── notifications
├── password_reset_tokens
├── subscription_plans
├── testers
├── users
├── user_module_access
└── user_sessions

-- ContentPro schema (ready for development) 🚧
contentpro
├── (example tables - not yet created)
├── contentpro_articles
├── contentpro_media
├── contentpro_categories
├── contentpro_tags
├── contentpro_comments
└── contentpro_bookmarks

-- PaymentsPro schema (ready for development) 🚧
paymentspro
├── (example tables - not yet created)
├── paymentspro_invoices
├── paymentspro_transactions
├── paymentspro_payment_methods
├── paymentspro_subscriptions
└── paymentspro_refunds

-- StudyPro schema (ready for development) 🚧
studypro
├── (example tables - not yet created)
├── studypro_courses
├── studypro_lessons
├── studypro_enrollments
├── studypro_progress
├── studypro_certificates
└── studypro_quizzes

-- LifePro schema (ready for development) 🚧
lifepro
├── (example tables - not yet created)
├── lifepro_goals
├── lifepro_milestones
├── lifepro_reflections
├── lifepro_values
└── lifepro_vision_boards

-- DigiPro schema (ready for development) 🚧
digipro
├── (example tables - not yet created)
├── digipro_products
├── digipro_downloads
├── digipro_licenses
└── digipro_reviews
```

---

### Shared Tables (public schema)

#### 1. user_profiles

**Purpose:** Universal user data across all modules

```sql
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  photo_url TEXT,

  -- Module activation flags
  has_coachpro BOOLEAN DEFAULT false,
  has_contentpro BOOLEAN DEFAULT false,
  has_paymentspro BOOLEAN DEFAULT false,
  has_studypro BOOLEAN DEFAULT false,
  has_lifepro BOOLEAN DEFAULT false,
  has_digipro BOOLEAN DEFAULT false,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_login TIMESTAMPTZ,

  -- Profile settings
  timezone TEXT DEFAULT 'Europe/Prague',
  language TEXT DEFAULT 'cs',

  -- Marketing
  newsletter_subscribed BOOLEAN DEFAULT false,
  referral_code TEXT UNIQUE
);

-- RLS Policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### 2. subscriptions

**Purpose:** Per-module subscription tracking

```sql
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Which module
  app TEXT NOT NULL CHECK (app IN (
    'coachpro', 'contentpro', 'paymentspro',
    'studypro', 'lifepro', 'digipro'
  )),

  -- Plan details
  plan TEXT NOT NULL CHECK (plan IN ('free', 'basic', 'pro', 'enterprise')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'expired')),

  -- Billing
  price DECIMAL(10, 2),
  currency TEXT DEFAULT 'CZK',
  billing_period TEXT CHECK (billing_period IN ('monthly', 'yearly', 'lifetime')),

  -- Dates
  started_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,

  -- Metadata
  trial_ends_at TIMESTAMPTZ,
  auto_renew BOOLEAN DEFAULT true,

  -- Unique constraint
  CONSTRAINT unique_user_app_subscription UNIQUE(user_id, app)
);

-- Index for queries
CREATE INDEX idx_subscriptions_user_app ON public.subscriptions(user_id, app);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

-- RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);
```

#### 3. payments

**Purpose:** Transaction log for all modules

```sql
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Transaction details
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'CZK',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),

  -- Source
  source_module TEXT CHECK (source_module IN (
    'coachpro', 'contentpro', 'paymentspro',
    'studypro', 'lifepro', 'digipro'
  )),
  description TEXT,

  -- Payment method
  payment_method TEXT CHECK (payment_method IN ('card', 'bank_transfer', 'paypal', 'stripe', 'contact')),

  -- External references
  stripe_payment_id TEXT,
  invoice_id UUID,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  metadata JSONB
);

-- Indexes
CREATE INDEX idx_payments_user ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_source_module ON public.payments(source_module);
CREATE INDEX idx_payments_created_at ON public.payments(created_at DESC);

-- RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);
```

#### 4. notifications

**Purpose:** Cross-module notification system

```sql
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Notification content
  title TEXT NOT NULL,
  message TEXT NOT NULL,

  -- Source
  source_module TEXT CHECK (source_module IN (
    'proapp', 'coachpro', 'contentpro', 'paymentspro',
    'studypro', 'lifepro', 'digipro'
  )),

  -- Type & Priority
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),

  -- Status
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,

  -- Action
  action_url TEXT,
  action_label TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  metadata JSONB
);

-- Indexes
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, read) WHERE read = false;
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);
```

#### 5. organizations

**Purpose:** Multi-tenant support (future)

```sql
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,

  -- Settings
  logo_url TEXT,
  website TEXT,
  description TEXT,

  -- Billing
  billing_email TEXT,
  tax_id TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  owner_id UUID REFERENCES auth.users(id),

  -- Settings
  settings JSONB DEFAULT '{}'::jsonb
);

-- Organization members
CREATE TABLE public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'guest')),

  joined_at TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT unique_org_member UNIQUE(organization_id, user_id)
);

-- RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
```

#### 6. audit_logs

**Purpose:** Security & compliance tracking

```sql
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),

  -- Action details
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,

  -- Source
  source_module TEXT,
  ip_address INET,
  user_agent TEXT,

  -- Changes
  old_values JSONB,
  new_values JSONB,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB
);

-- Indexes
CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- RLS (admin only)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
```

---

## 📦 Storage Structure

### Supabase Storage Buckets

```
ProApp Storage
│
├── shared/                          ← Shared across all modules
│   ├── avatars/                     ← User profile pictures
│   │   └── {user_id}.jpg
│   ├── company-logos/               ← Organization logos
│   │   └── {org_id}.png
│   ├── public-assets/               ← Branding, icons
│   │   ├── logo.svg
│   │   └── favicon.ico
│   └── temp/                        ← Temporary uploads
│
├── coachpro/                        ← CoachPro specific
│   ├── materials/                   ← PDF, docs
│   │   └── {material_id}/
│   ├── programs/                    ← Program resources
│   │   └── {program_id}/
│   ├── card-decks/                  ← Card images
│   │   └── {deck_id}/
│   └── session-notes/               ← Private notes
│
├── contentpro/                      ← ContentPro specific
│   ├── articles/                    ← Article images
│   │   └── {article_id}/
│   ├── media/                       ← Videos, audio
│   │   └── {media_id}/
│   ├── templates/                   ← Content templates
│   └── drafts/                      ← Draft content
│
├── paymentspro/                     ← PaymentsPro specific
│   ├── invoices/                    ← Generated invoices
│   │   └── {invoice_id}.pdf
│   ├── receipts/                    ← Payment receipts
│   └── reports/                     ← Financial reports
│
├── studypro/                        ← StudyPro specific
│   ├── courses/                     ← Course materials
│   │   └── {course_id}/
│   ├── lessons/                     ← Lesson videos
│   │   └── {lesson_id}/
│   ├── certificates/                ← Generated certificates
│   │   └── {certificate_id}.pdf
│   └── assignments/                 ← Student submissions
│
├── lifepro/                         ← LifePro specific
│   ├── vision-boards/               ← Vision board images
│   │   └── {board_id}/
│   ├── reflections/                 ← Reflection notes
│   └── goals/                       ← Goal attachments
│
└── digipro/                         ← DigiPro specific
    ├── products/                    ← Digital products
    │   └── {product_id}/
    ├── downloads/                   ← Downloadable files
    └── previews/                    ← Product previews
```

### Storage Access Patterns

```javascript
// Shared avatar (accessible from any module)
const avatarUrl = supabase.storage
  .from('shared')
  .getPublicUrl(`avatars/${userId}.jpg`);

// Module-specific file (only from that module)
const materialUrl = supabase.storage
  .from('coachpro')
  .getPublicUrl(`materials/${materialId}/document.pdf`);

// Cross-module access with RLS
const { data, error } = await supabase.storage
  .from('contentpro')
  .download(`articles/${articleId}/cover.jpg`);
```

---

## 🔐 Authentication

### Unified Auth Across All Modules

**Supabase Auth Configuration:**

```javascript
// Shared across ALL modules (proapp.cz, coachpro.proapp.cz, etc.)
const supabase = createClient(
  'https://qrnsrhrgjzijqphgehra.supabase.co',  // Same URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',   // Same key
  {
    auth: {
      storage: customCookieStorage,           // Cookie-based for cross-domain
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    cookieOptions: {
      domain: '.proapp.cz',                   // Shared across subdomains
      path: '/',
      sameSite: 'lax'
    }
  }
);
```

### Cookie-Based Storage (Cross-Domain Auth)

```javascript
// src/shared/utils/cookieStorage.js
const customCookieStorage = {
  getItem: (key) => {
    const cookies = document.cookie.split(';');
    const item = cookies.find(c => c.trim().startsWith(`${key}=`));
    return item ? item.split('=')[1] : null;
  },

  setItem: (key, value) => {
    document.cookie = `${key}=${value}; domain=.proapp.cz; path=/; max-age=604800; SameSite=Lax`;
  },

  removeItem: (key) => {
    document.cookie = `${key}=; domain=.proapp.cz; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};
```

### Auth Flow

```
1. User visits ANY domain:
   - proapp.cz
   - coachpro.proapp.cz
   - contentpro.proapp.cz

2. Clicks "Login"
   ↓
3. Google OAuth / Email login
   ↓
4. Supabase Auth creates session
   ↓
5. Session stored in cookie with domain=.proapp.cz
   ↓
6. Cookie accessible from ALL subdomains
   ↓
7. User authenticated everywhere!
```

### Login Implementation

```javascript
// ANY module can use this
const handleLogin = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/dashboard',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  });
};

// Check current session
const { data: { session } } = await supabase.auth.getSession();

// Get user profile
const { data: profile } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('id', session.user.id)
  .single();
```

---

## 🌍 Domain Setup

### Domain Architecture

```
Primary domains → Redirects → Subdomains
───────────────────────────────────────────

proapp.cz         →  (primary)      → proapp.cz
coachpro.cz       →  301 redirect   → coachpro.proapp.cz
contentpro.cz     →  301 redirect   → contentpro.proapp.cz
paymentspro.cz    →  301 redirect   → paymentspro.proapp.cz
studypro.cz       →  301 redirect   → studypro.proapp.cz
lifepro.cz        →  301 redirect   → lifepro.proapp.cz
digipro.cz        →  301 redirect   → digipro.proapp.cz
```

### DNS Configuration

```
# Primary domain
proapp.cz
  A record → Vercel/Netlify IP

# Subdomains (CNAME)
coachpro.proapp.cz
  CNAME → vercel-deployment.vercel.app

contentpro.proapp.cz
  CNAME → vercel-deployment.vercel.app

# Redirect domains
coachpro.cz
  301 redirect → https://coachpro.proapp.cz
```

### Vercel Configuration

```json
// vercel.json
{
  "redirects": [
    {
      "source": "/:path*",
      "destination": "https://coachpro.proapp.cz/:path*",
      "permanent": true
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🔗 Cross-Module Integration

### 1. Shared User Profile

**Every module reads from public.user_profiles:**

```javascript
// CoachPro
const { data: coach } = await supabase
  .from('coachpro_coaches')
  .select(`
    *,
    profile:user_profiles!auth_user_id (
      full_name,
      photo_url,
      email
    )
  `)
  .eq('id', coachId)
  .single();

// ContentPro
const { data: author } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('id', authorId)
  .single();

// StudyPro
const { data: student } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('id', studentId)
  .single();

// → SAME user_profile across all modules!
```

### 2. Cross-Module Queries

**ContentPro can read CoachPro programs:**

```javascript
// contentpro/utils/relatedContent.js
export async function getRelatedCoachProgram(programId) {
  const { data } = await supabase
    .from('coachpro_programs')  // From different schema!
    .select('id, title, description')
    .eq('id', programId)
    .eq('is_public', true)  // Only public programs
    .single();

  return data;
}

// In article component
const relatedProgram = await getRelatedCoachProgram(article.related_program_id);
```

### 3. Unified Notifications

**Send notification from any module:**

```javascript
// shared/utils/notifications.js
export async function sendNotification({
  userId,
  title,
  message,
  sourceModule,
  actionUrl,
  priority = 'normal'
}) {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      title,
      message,
      source_module: sourceModule,
      action_url: actionUrl,
      priority,
      read: false
    })
    .select()
    .single();

  return { data, error };
}

// CoachPro usage
await sendNotification({
  userId: clientId,
  title: 'Nové sezení',
  message: 'Máte naplánované sezení 18.1. v 14:00',
  sourceModule: 'coachpro',
  actionUrl: 'https://coachpro.proapp.cz/sessions/123'
});

// ContentPro usage
await sendNotification({
  userId: followerId,
  title: 'Nový článek',
  message: 'Lenka publikovala nový článek',
  sourceModule: 'contentpro',
  actionUrl: 'https://contentpro.proapp.cz/articles/456'
});
```

### 4. Cross-Module Analytics

**ProApp Dashboard combines data from all modules:**

```javascript
// proapp/utils/analytics.js
export async function getUserActivity(userId) {
  // CoachPro
  const { data: sessions } = await supabase
    .from('coachpro_sessions')
    .select('id, datetime')
    .eq('client_id', userId)
    .order('datetime', { ascending: false });

  // ContentPro
  const { data: articles } = await supabase
    .from('contentpro_articles')
    .select('id, title, created_at')
    .eq('author_id', userId)
    .order('created_at', { ascending: false });

  // StudyPro
  const { data: enrollments } = await supabase
    .from('studypro_enrollments')
    .select('id, course_id, progress')
    .eq('student_id', userId);

  return {
    coachpro: {
      sessions: sessions?.length || 0,
      lastSession: sessions?.[0]?.datetime
    },
    contentpro: {
      articles: articles?.length || 0,
      lastArticle: articles?.[0]?.created_at
    },
    studypro: {
      courses: enrollments?.length || 0,
      averageProgress: calculateAverage(enrollments)
    }
  };
}
```

### 5. Linked Products

**Create product bundles across modules:**

```javascript
// Example: Coach program with content and course
const createProductBundle = async ({
  coachProgramId,
  contentArticleIds,
  studyCourseId
}) => {
  // Link content articles to coach program
  await supabase
    .from('contentpro_articles')
    .update({ related_coachpro_program: coachProgramId })
    .in('id', contentArticleIds);

  // Link study course to coach program
  await supabase
    .from('studypro_courses')
    .update({ related_coachpro_program: coachProgramId })
    .eq('id', studyCourseId);

  return {
    program: coachProgramId,
    articles: contentArticleIds,
    course: studyCourseId
  };
};

// Fetch complete bundle
const getProductBundle = async (programId) => {
  const [program, articles, course] = await Promise.all([
    supabase.from('coachpro_programs').select('*').eq('id', programId).single(),
    supabase.from('contentpro_articles').select('*').eq('related_coachpro_program', programId),
    supabase.from('studypro_courses').select('*').eq('related_coachpro_program', programId).single()
  ]);

  return {
    program: program.data,
    articles: articles.data,
    course: course.data
  };
};
```

---

## 🛠️ Shared Functions

### ProApp Shared Package

**Create monorepo package for shared utilities:**

```
packages/
└── proapp-shared/
    ├── package.json
    ├── src/
    │   ├── index.js
    │   ├── supabaseClient.js
    │   ├── utils/
    │   │   ├── userProfile.js
    │   │   ├── notifications.js
    │   │   ├── storage.js
    │   │   ├── formatting.js
    │   │   └── validation.js
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   ├── useProfile.js
    │   │   └── useNotifications.js
    │   └── components/
    │       ├── Avatar.jsx
    │       ├── ModuleSwitcher.jsx
    │       └── NotificationBell.jsx
    └── README.md
```

#### Shared Utilities

**packages/proapp-shared/src/utils/userProfile.js:**

```javascript
import { supabase } from '../supabaseClient';

export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId, updates) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function activateModule(userId, moduleName) {
  const columnName = `has_${moduleName}`;

  const { data, error } = await supabase
    .from('user_profiles')
    .update({ [columnName]: true })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

**packages/proapp-shared/src/utils/notifications.js:**

```javascript
import { supabase } from '../supabaseClient';

export async function sendNotification({
  userId,
  title,
  message,
  sourceModule,
  type = 'info',
  priority = 'normal',
  actionUrl,
  actionLabel
}) {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      title,
      message,
      source_module: sourceModule,
      type,
      priority,
      action_url: actionUrl,
      action_label: actionLabel,
      read: false
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUnreadNotifications(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('read', false)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function markNotificationRead(notificationId) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true, read_at: new Date() })
    .eq('id', notificationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

**packages/proapp-shared/src/utils/storage.js:**

```javascript
import { supabase } from '../supabaseClient';

export async function uploadAvatar(userId, file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('shared')
    .upload(`avatars/${fileName}`, file, { upsert: true });

  if (error) throw error;

  // Update user profile
  const { data: url } = supabase.storage
    .from('shared')
    .getPublicUrl(`avatars/${fileName}`);

  await supabase
    .from('user_profiles')
    .update({ photo_url: url.publicUrl })
    .eq('id', userId);

  return url.publicUrl;
}

export async function uploadFile(bucket, path, file) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);

  if (error) throw error;
  return data;
}

export function getPublicUrl(bucket, path) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
}
```

#### Shared Hooks

**packages/proapp-shared/src/hooks/useAuth.js:**

```javascript
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId) => {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    setProfile(data);
    setLoading(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return {
    user,
    profile,
    loading,
    signOut,
    isAuthenticated: !!user
  };
}
```

**packages/proapp-shared/src/hooks/useNotifications.js:**

```javascript
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    loadNotifications();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications(prev => [payload.new, ...prev]);
            setUnreadCount(prev => prev + 1);
          } else if (payload.eventType === 'UPDATE') {
            setNotifications(prev =>
              prev.map(n => n.id === payload.new.id ? payload.new : n)
            );
            if (payload.new.read) {
              setUnreadCount(prev => Math.max(0, prev - 1));
            }
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const loadNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    setNotifications(data || []);
    setUnreadCount(data?.filter(n => !n.read).length || 0);
    setLoading(false);
  };

  const markAsRead = async (notificationId) => {
    await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date() })
      .eq('id', notificationId);
  };

  const markAllAsRead = async () => {
    await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date() })
      .eq('user_id', userId)
      .eq('read', false);

    loadNotifications();
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refresh: loadNotifications
  };
}
```

#### Shared Components

**packages/proapp-shared/src/components/ModuleSwitcher.jsx:**

```javascript
import { Box, Chip } from '@mui/material';
import { Home, BookOpen, CreditCard, GraduationCap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const MODULES = [
  { key: 'proapp', name: 'ProApp', url: 'https://proapp.cz', icon: Home },
  { key: 'coachpro', name: 'CoachPro', url: 'https://coachpro.proapp.cz', icon: BookOpen },
  { key: 'contentpro', name: 'ContentPro', url: 'https://contentpro.proapp.cz', icon: BookOpen },
  { key: 'paymentspro', name: 'PaymentsPro', url: 'https://paymentspro.proapp.cz', icon: CreditCard },
  { key: 'studypro', name: 'StudyPro', url: 'https://studypro.proapp.cz', icon: GraduationCap }
];

export function ModuleSwitcher() {
  const { profile } = useAuth();

  const activeModules = MODULES.filter(module => {
    if (module.key === 'proapp') return true;
    return profile?.[`has_${module.key}`];
  });

  const handleModuleClick = (url) => {
    window.location.href = url;
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, p: 1, borderBottom: '1px solid #ddd' }}>
      {activeModules.map(module => {
        const Icon = module.icon;
        return (
          <Chip
            key={module.key}
            label={module.name}
            icon={<Icon size={16} />}
            onClick={() => handleModuleClick(module.url)}
            clickable
          />
        );
      })}
    </Box>
  );
}
```

---

## 📘 Module Creation Guide

### Step-by-Step: Creating a New Module

#### 1. Create Schema in Supabase

```sql
-- Create schema
CREATE SCHEMA IF NOT EXISTS newmodule;

-- Grant permissions
GRANT USAGE ON SCHEMA newmodule TO authenticated;
GRANT USAGE ON SCHEMA newmodule TO anon;

-- Update search path
ALTER ROLE authenticated SET search_path TO public, coachpro, contentpro, newmodule;

-- Add comment
COMMENT ON SCHEMA newmodule IS 'NewModule - Description';
```

#### 2. Create Tables

```sql
-- Example table
CREATE TABLE newmodule.newmodule_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE newmodule.newmodule_items ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can read own items"
  ON newmodule.newmodule_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own items"
  ON newmodule.newmodule_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

#### 3. Create Storage Bucket

```sql
-- Via Supabase Dashboard or SQL
INSERT INTO storage.buckets (id, name, public)
VALUES ('newmodule', 'newmodule', false);

-- Set RLS policies for bucket
CREATE POLICY "Users can upload own files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'newmodule' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

#### 4. Update user_profiles

```sql
-- Add activation flag
ALTER TABLE public.user_profiles
ADD COLUMN has_newmodule BOOLEAN DEFAULT false;
```

#### 5. Create React App

```bash
# Create new React app
npm create vite@latest newmodule-app -- --template react

# Install dependencies
cd newmodule-app
npm install @supabase/supabase-js @mui/material @emotion/react @emotion/styled
npm install @proapp/shared  # Shared package
npm install lucide-react framer-motion

# Project structure
src/
├── modules/
│   └── newmodule/
│       ├── pages/
│       ├── components/
│       └── utils/
├── shared/  # From @proapp/shared
├── supabaseClient.js
└── App.jsx
```

#### 6. Configure Supabase Client

```javascript
// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import { customCookieStorage } from '@proapp/shared/utils/cookieStorage';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    db: {
      schema: 'newmodule'  // Default schema
    },
    auth: {
      storage: customCookieStorage,
      autoRefreshToken: true,
      persistSession: true
    }
  }
);
```

#### 7. Deploy to Vercel

```bash
# Connect to Vercel
vercel

# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Deploy
vercel --prod
```

#### 8. Configure Domain

```
# DNS records
newmodule.proapp.cz
  CNAME → vercel-deployment.vercel.app

# Optional: Redirect from primary domain
newmodule.cz
  301 → https://newmodule.proapp.cz
```

---

## 🗺️ Migration Guide

### ✅ Completed Migrations

**CoachPro Migration to ProApp Architecture** - Completed 17.01.2025

1. **Migration 01: Schema Structure** ✅
   - Created 7 schemas (public, coachpro, contentpro, paymentspro, studypro, lifepro, digipro)
   - Set permissions and search paths

2. **Migration 02: Move CoachPro Tables** ✅
   - Moved 28 tables from public → coachpro schema
   - Migrated triggers and functions

3. **Migration 03: Shared Tables** ✅
   - Created 6 shared tables in public schema
   - organizations, user_profiles, subscriptions, payments, notifications, audit_logs

**📚 Detailed Documentation:**
- [APPLY_SCHEMA_MIGRATIONS.md](APPLY_SCHEMA_MIGRATIONS.md) - Complete migration guide
- [docs/MIGRATION_03_SHARED_TABLES.md](docs/MIGRATION_03_SHARED_TABLES.md) - Migration 03 details
- [docs/SESSION_21_MIGRATION_03_SUMMARY.md](docs/SESSION_21_MIGRATION_03_SUMMARY.md) - Session summary

---

### Migrating New Module to ProApp

#### Phase 1: Schema Migration

```sql
-- 1. Create new schema
CREATE SCHEMA IF NOT EXISTS yourmodule;

-- 2. Move tables
ALTER TABLE public.yourmodule_table1 SET SCHEMA yourmodule;
ALTER TABLE public.yourmodule_table2 SET SCHEMA yourmodule;

-- 3. Move functions
ALTER FUNCTION public.your_function() SET SCHEMA yourmodule;

-- 4. Recreate triggers if needed
DROP TRIGGER IF EXISTS your_trigger ON yourmodule.yourmodule_table1;
CREATE TRIGGER your_trigger
  AFTER INSERT ON yourmodule.yourmodule_table1
  FOR EACH ROW EXECUTE FUNCTION yourmodule.your_function();
```

#### Phase 2: Update Code

```javascript
// Before
const { data } = await supabase.from('yourmodule_table').select('*');

// After (with schema alias)
export const supabase = createClient(url, key, {
  db: { schema: 'yourmodule' }  // Default to yourmodule schema
});

// Queries work the same!
const { data } = await supabase.from('yourmodule_table').select('*');
```

#### Phase 3: Migrate Users

```sql
-- Copy users to public.user_profiles
INSERT INTO public.user_profiles (
  id, email, full_name, photo_url, has_yourmodule, created_at
)
SELECT
  auth_user_id,
  email,
  name,
  photo_url,
  true,
  created_at
FROM yourmodule.yourmodule_users
ON CONFLICT (id) DO UPDATE SET
  has_yourmodule = true;
```

#### Phase 4: Storage Migration

```bash
# Move files to new bucket structure
# Example script
const migrateStorage = async () => {
  const { data: oldFiles } = await supabase.storage
    .from('old-bucket')
    .list();

  for (const file of oldFiles) {
    const { data: fileData } = await supabase.storage
      .from('old-bucket')
      .download(file.name);

    await supabase.storage
      .from('yourmodule')
      .upload(`migrated/${file.name}`, fileData);
  }
};
```

---

## ✅ Best Practices

### 1. Schema Naming

```
✅ DO:
- coachpro_coaches
- contentpro_articles
- studypro_courses

❌ DON'T:
- coaches (too generic)
- articles (too generic)
- cp_coaches (unclear abbreviation)
```

### 2. Foreign Keys Across Schemas

```sql
-- ✅ DO: Reference public.user_profiles
CREATE TABLE yourmodule.yourmodule_items (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),  -- Supabase auth
  ...
);

-- Get user data via JOIN
SELECT i.*, u.full_name, u.photo_url
FROM yourmodule.yourmodule_items i
JOIN public.user_profiles u ON u.id = i.user_id;

-- ❌ DON'T: Duplicate user data in module schema
CREATE TABLE yourmodule.yourmodule_users (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT  -- Duplicates public.user_profiles!
);
```

### 3. RLS Policies

```sql
-- ✅ DO: Use auth.uid() for user-specific data
CREATE POLICY "Users can read own items"
  ON yourmodule.yourmodule_items FOR SELECT
  USING (auth.uid() = user_id);

-- ✅ DO: Use is_public for shareable content
CREATE POLICY "Anyone can read public items"
  ON yourmodule.yourmodule_items FOR SELECT
  USING (is_public = true);

-- ❌ DON'T: Overly permissive
CREATE POLICY "Anyone can read all items"
  ON yourmodule.yourmodule_items FOR SELECT
  USING (true);  -- Too open!
```

### 4. Storage Organization

```
✅ DO:
shared/avatars/{user_id}.jpg
yourmodule/items/{item_id}/file.pdf

❌ DON'T:
files/{random_name}.jpg  (no organization)
yourmodule/{user_id}_{item_id}_file.pdf  (hard to query)
```

### 5. Notification Best Practices

```javascript
// ✅ DO: Include action URL
await sendNotification({
  userId,
  title: 'Nová zpráva',
  message: 'Máte novou zprávu od Lenky',
  sourceModule: 'yourmodule',
  actionUrl: `https://yourmodule.proapp.cz/messages/123`,  // ← Important!
  priority: 'normal'
});

// ❌ DON'T: Vague notifications
await sendNotification({
  userId,
  title: 'Update',
  message: 'Something happened',  // Too vague!
  sourceModule: 'yourmodule'
  // No action URL - user can't act on it
});
```

### 6. Cross-Module Queries

```javascript
// ✅ DO: Use RLS and public flags
const { data } = await supabase
  .from('coachpro_programs')
  .select('*')
  .eq('is_public', true);  // Respect privacy

// ❌ DON'T: Query private data from other modules
const { data } = await supabase
  .from('coachpro_sessions')  // Private data!
  .select('*');  // Will fail with RLS
```

### 7. Shared Package Usage

```javascript
// ✅ DO: Import from shared package
import { getUserProfile, sendNotification } from '@proapp/shared';

// ❌ DON'T: Duplicate functions in each module
// yourmodule/utils/userProfile.js
async function getUserProfile(userId) {
  // Duplicate code!
}
```

### 8. Error Handling

```javascript
// ✅ DO: Handle errors gracefully
try {
  const profile = await getUserProfile(userId);
  if (!profile) {
    console.error('Profile not found');
    return null;
  }
  return profile;
} catch (error) {
  console.error('Failed to load profile:', error);
  showUserFriendlyError('Nepodařilo se načíst profil');
  return null;
}

// ❌ DON'T: Silent failures
const profile = await getUserProfile(userId);
// What if it fails? No error handling!
```

---

## 📊 Architecture Diagrams

### User Journey Flow

```
                    ┌─────────────────┐
                    │   User visits   │
                    │   proapp.cz     │
                    └────────┬────────┘
                             │
                   ┌─────────▼─────────┐
                   │  Clicks "Login"   │
                   └─────────┬─────────┘
                             │
                ┌────────────▼────────────┐
                │   Google OAuth Login    │
                └────────────┬────────────┘
                             │
                ┌────────────▼────────────┐
                │  Session stored in      │
                │  cookie (.proapp.cz)    │
                └────────────┬────────────┘
                             │
                ┌────────────▼────────────┐
                │  Load user_profiles     │
                │  Check has_* flags      │
                └────────────┬────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐     ┌──────────────┐    ┌──────────────┐
│  CoachPro    │     │  ContentPro  │    │  StudyPro    │
│  (active)    │     │  (active)    │    │  (inactive)  │
│  [Enter]     │     │  [Enter]     │    │  [Activate]  │
└──────┬───────┘     └──────┬───────┘    └──────────────┘
       │                    │
       │                    │
       ▼                    ▼
coachpro.proapp.cz   contentpro.proapp.cz
```

### Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                  ProApp Database                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  public (shared)                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ user_profiles                                     │  │
│  │ ┌──────────────────────────────────────────────┐ │  │
│  │ │ id: uuid-123                                 │ │  │
│  │ │ email: user@example.com                      │ │  │
│  │ │ has_coachpro: true                           │ │  │
│  │ │ has_contentpro: true                         │ │  │
│  │ │ photo_url: shared/avatars/uuid-123.jpg       │ │  │
│  │ └──────────────────────────────────────────────┘ │  │
│  └────────────┬────────────────┬────────────────────┘  │
│               │                │                        │
│  ┌────────────▼──────┐   ┌────▼──────────────────┐    │
│  │ coachpro schema   │   │ contentpro schema     │    │
│  ├───────────────────┤   ├───────────────────────┤    │
│  │ coachpro_coaches  │   │ contentpro_articles   │    │
│  │ ┌───────────────┐ │   │ ┌───────────────────┐ │    │
│  │ │ user_id: ─────┼─┼───┼─┤ author_id: ───────┼─┼──┐ │
│  │ │ uuid-123      │ │   │ │ uuid-123          │ │  │ │
│  │ └───────────────┘ │   │ └───────────────────┘ │  │ │
│  └───────────────────┘   └───────────────────────┘  │ │
│                                                      │ │
│  Same user ID across ALL modules! ◄─────────────────┘ │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 🎯 Quick Reference

### Environment Variables

```bash
# .env (ALL modules)
VITE_SUPABASE_URL=https://qrnsrhrgjzijqphgehra.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Common Queries

```javascript
// Get user profile
const { data: profile } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('id', userId)
  .single();

// Get user's active modules
const activeModules = Object.keys(profile)
  .filter(key => key.startsWith('has_') && profile[key])
  .map(key => key.replace('has_', ''));

// Send notification
await supabase.from('notifications').insert({
  user_id: userId,
  title: 'Title',
  message: 'Message',
  source_module: 'yourmodule'
});

// Upload to storage
await supabase.storage
  .from('yourmodule')
  .upload(`path/${file.name}`, file);

// Get public URL
const { data } = supabase.storage
  .from('shared')
  .getPublicUrl(`avatars/${userId}.jpg`);
```

---

## 📝 Summary

### Key Takeaways

1. ✅ **One Supabase Project** = ProApp hosts all modules
2. ✅ **PostgreSQL Schemas** = Namespace isolation per module
3. ✅ **Shared public Schema** = Universal user_profiles, payments, notifications
4. ✅ **Cookie-Based Auth** = Session shared across all subdomains
5. ✅ **Cross-Module Integration** = Modules can read each other's public data
6. ✅ **Shared Package** = `@proapp/shared` for common utilities
7. ✅ **Domain Strategy** = `module.proapp.cz` + redirect from `module.cz`
8. ✅ **Storage Buckets** = Shared + per-module organization

### Contact

For questions or support, contact: **lenka@proapp.cz**

---

*Last Updated: 17.01.2025*
*Version: 1.0*
*Status: ✅ Production Architecture Design*
