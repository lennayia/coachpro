# CoachPro - Architecture & Context Overview

**Aktualizováno:** Session #20 (17.01.2025) - Lead Magnets & Multi-tenant Architecture

---

## 🏗️ Multi-tenant Architecture (Session #20)

### ProApp Structure

```
ProApp (Supabase projekt)
│
├── public (schema) - Sdílené pro všechny aplikace
│   ├── user_profiles (extends auth.users)
│   ├── subscriptions (per-app subscriptions)
│   ├── payments (transaction log)
│   ├── notifications (cross-app)
│   ├── organizations (multi-tenant)
│   └── audit_logs (security)
│
├── coachpro (schema) - CoachPro specifické
│   ├── coachpro_coaches
│   ├── coachpro_client_profiles
│   ├── coachpro_materials (+ pricing fields)
│   ├── coachpro_programs (+ pricing fields)
│   ├── coachpro_sessions
│   ├── coachpro_shared_materials
│   ├── coachpro_shared_programs
│   ├── coachpro_purchases (NEW Session #20)
│   └── ... 13 tabulek celkem
│
├── lifepro (schema) - Future
│   └── life_goals, milestones, reflections
│
└── digipro (schema) - Future
```

**Schema Alias (Zero Code Changes):**
```javascript
// src/supabaseClient.js
export const supabase = createClient(url, key, {
  db: { schema: 'coachpro' }
});
```

---

## 📋 Lead Magnet System (Session #20)

### 3-tier Access Model

1. **🔒 Private** - Shared via code/club only
2. **🎁 Lead Magnet** - Free for contact (beta)
3. **💰 Paid** - Stripe payments (future)

### Purchase Flow

```
Client → CoachDetail (public catalog)
  ↓
Clicks "Získat zdarma"
  ↓
PayWithContactModal (name, email, phone)
  ↓
INSERT coachpro_purchases
  ↓
Trigger auto_share_after_purchase()
  ↓
INSERT coachpro_shared_materials
  ↓
Material appears in ClientMaterials
```

### Key Components (Session #20)

- **PayWithContactModal.jsx** (265 lines) - Contact form for "purchase"
- **publicCatalog.js** (180 lines) - Public catalog utilities
- **CoachDetail.jsx** - Enhanced with pricing chips & buy buttons

---

## 🏛️ Modular Design Pattern

### Architecture Layers

```
Utils (reusable functions)
  ↓
Shared Components (universal, props-based)
  ↓
Page Components (specific implementations)
```

**Example Session #20 - Lead Magnets:**
```
publicCatalog.js (utils) → getEnrichedCatalog, hasAccess
  ↓
PayWithContactModal.jsx (shared component) → Contact form
  ↓
CoachDetail.jsx (page) → Public catalog display
```

**Example Session #16 - FlipCard:**
```
FlipCard.jsx (shared component) → 3D flip animation
  ↓
WelcomeScreen.jsx (universal component) → FlipCard integration
  ↓
ClientWelcome.jsx → Specific implementation
```

---

## 📂 File Structure (Session #20 Update)

```
src/
├── modules/
│   ├── coach/
│   │   ├── pages/
│   │   │   ├── Tester.jsx
│   │   │   ├── TesterWelcome.jsx
│   │   │   ├── CoachLogin.jsx
│   │   │   ├── ClientWelcome.jsx
│   │   │   ├── ClientProfile.jsx
│   │   │   ├── ClientPrograms.jsx        # Session #16B
│   │   │   ├── ClientCoachSelection.jsx  # Session #17, #20 (fixed)
│   │   │   ├── CoachSessions.jsx         # Session #19
│   │   │   ├── LandingPage.jsx           # Session #19
│   │   │   ├── ClientDashboard.jsx       # Session #19
│   │   │   ├── ProfilePage.jsx
│   │   │   └── CoachDetail.jsx           # Session #17, #20 (enhanced)
│   │   └── components/
│   │       └── SessionCard.jsx
│   │
│   └── client/
│       └── pages/
│
└── shared/
    ├── components/
    │   ├── WelcomeScreen.jsx
    │   ├── FloatingMenu.jsx
    │   ├── NavigationFloatingMenu.jsx
    │   ├── RegisterForm.jsx
    │   ├── PhotoUpload.jsx
    │   ├── PayWithContactModal.jsx    # ⭐ NEW Session #20 (265 lines)
    │   │
    │   ├── cards/
    │   │   ├── FlipCard.jsx           # Session #16
    │   │   ├── CoachCard.jsx          # Session #17
    │   │   └── BaseCard.jsx
    │   │
    │   └── effects/
    │       └── AnimatedGradient.jsx   # Session #16
    │
    ├── context/
    │   ├── TesterAuthContext.jsx      # Auto-sync Google photo
    │   ├── ClientAuthContext.jsx
    │   └── NotificationContext.jsx
    │
    ├── utils/
    │   ├── sessions.js
    │   ├── googleCalendar.js          # Session #19
    │   ├── publicCatalog.js           # ⭐ NEW Session #20 (180 lines)
    │   ├── photoStorage.js
    │   ├── imageCompression.js
    │   ├── storage.js                 # Enhanced with getSharedPrograms
    │   └── validation.js
    │
    ├── hooks/
    │   └── useSoundFeedback.js        # Session #16
    │
    ├── styles/
    │   ├── animations.js              # Framer Motion variants
    │   ├── modernEffects.js
    │   └── borderRadius.js
    │
    └── constants/
        └── icons.js                   # Lucide React icons
```

---

## 🗄️ Database Schema (Session #20)

### Core Tables (coachpro schema)

**coachpro_coaches** (17 columns)
- Basic: id, name, email, phone, photo_url
- Profile: bio, education, certifications, specializations, years_of_experience
- Social: linkedin, instagram, facebook, website, whatsapp, telegram
- Auth: auth_user_id, created_at

**coachpro_client_profiles** (8 columns)
- id, name, email, photo_url
- **coach_id** (Session #20 - Primary coach)
- auth_user_id, created_at, updated_at

**coachpro_materials** (11 columns)
- id, title, description, content (JSONB)
- coach_id, category, tags, created_at
- **is_public, price, currency, is_lead_magnet** (Session #20)

**coachpro_programs** (11 columns)
- Same as materials + pricing fields

**coachpro_purchases** (13 columns) - ⭐ NEW Session #20
- id, item_type, item_id
- client_id, client_name, client_email, client_phone, client_message
- coach_id
- payment_method, payment_status, amount, currency
- access_granted, purchased_at

**coachpro_sessions** (9 columns)
- id, title, description, datetime, duration
- coach_id, client_id
- google_calendar_id (Session #19)
- created_at

**coachpro_shared_materials** (7 columns)
- id, coach_id, material_id, client_email
- share_code, qr_code
- material (JSONB - nullable)

**coachpro_shared_programs** (7 columns)
- Same as shared_materials

**coachpro_card_decks, coachpro_cards, coachpro_shared_card_decks**
**coachpro_program_sessions, coachpro_daily_programs**

### Shared Tables (public schema) - Session #20

**user_profiles** - Cross-app user data
**subscriptions** - Per-app subscriptions
**payments** - Transaction log
**notifications** - Cross-app notifications
**organizations** - Multi-tenant support
**audit_logs** - Security/compliance

---

## 🔑 Key Technical Patterns

### 1. Progressive Enhancement (Session #20)
- Build infrastructure FIRST
- Integrate LATER when needed
- Example: Shared tables created but not integrated yet

### 2. Schema Isolation (Session #20)
- Each app has own PostgreSQL schema
- Shared resources in public schema
- Zero namespace conflicts

### 3. Defensive Error Handling
```javascript
if (error.code === '23505') {
  // Duplicate purchase
  showError('Již máte přístup');
  return;
}
```

### 4. Auto-sync with Triggers (Session #20)
```sql
CREATE TRIGGER trigger_auto_share_after_purchase
AFTER INSERT ON coachpro_purchases
FOR EACH ROW
EXECUTE FUNCTION auto_share_after_purchase();
```

### 5. Iterative Debugging (Session #20)
- Fix errors one by one
- Test after each fix
- Document all fixes
- Example: 6 trigger fixes for nullable columns

---

## 🎨 Design System

### Color Palette
- **Primary:** Olive/Earth (85, 107, 47)
- **Secondary:** Light Green/Sage (139, 188, 143)
- **Usage:** Gradients with 35%→25% opacity

### Component Patterns
- **FlipCard:** CSS 3D transforms (60fps)
- **AnimatedGradient:** Framer Motion backgrounds
- **Sound Feedback:** Web Audio API
- **Photo Upload:** Client-side compression
- **Validation:** Real-time with auto-formatting

---

## 📊 Session Timeline

### Session #20 (17.01.2025) - Lead Magnets & Multi-tenant
- Lead magnet system (purchases table, auto-share trigger)
- Multi-tenant architecture (PostgreSQL schemas)
- Client-coach connection fix
- 10 bugs fixed iteratively
- 15 files created, 3 modified

### Session #19 (16-17.01.2025) - Google Calendar & Dashboard
- Google Calendar sync integration
- Landing page redesign (OAuth verification)
- ClientDashboard refactor (4 cards per coach)

### Session #18 (15-16.01.2025) - Multiple Coaches
- Multiple coaches support
- Lead magnet concept design
- Slug-based routing

### Session #17 (16.11.2025) - Coach Profiles
- 12 new profile columns
- CoachCard refactor with accordion
- Google OAuth photo auto-sync
- Social media integration

### Session #16B (15.11.2025) - Dashboard Gamification
- ClientPrograms page
- Gamification "Semínka růstu"
- 3-level motivational messaging
- Clickable stats cards

### Session #16 (12.11.2025) - FlipCard
- FlipCard component (CSS 3D)
- useSoundFeedback hook
- AnimatedGradient component
- WelcomeScreen enhancements

---

## 🚀 Best Practices

### Code Organization
✅ Modular components (shared → pages)
✅ Utility functions (reusable logic)
✅ Context for state management
✅ Constants for centralized config

### Database
✅ RLS policies for security
✅ Triggers for automation
✅ UNIQUE constraints for integrity
✅ Indexes for performance

### Performance
✅ CSS animations (60fps)
✅ Image compression before upload
✅ Lazy loading for routes
✅ Schema alias (zero overhead)

### User Experience
✅ Sound feedback (optional)
✅ Loading states everywhere
✅ Error messages user-friendly
✅ Theme-aware styling

---

## 📚 Documentation

### Main Files
- **CLAUDE.md** - Complete project instructions (1787 lines)
- **master_todo.md** - TODO list & session summaries (473 lines)
- **docs/sessions/summary20.md** - Session #20 details (500+ lines)

### Migration Guides
- **APPLY_SCHEMA_MIGRATIONS.md** - Schema migration guide
- **APPLY_LEAD_MAGNET_MIGRATIONS.md** - Lead magnet setup
- **UPDATE_CODE_FOR_SCHEMAS.md** - Code update instructions

### Database
- **supabase/migrations/** - All migration files
- **supabase_database_schema.sql** - Complete schema

---

## 🎯 Current Status

**Branch:** main
**Production:** Ready (after schema migrations)
**Sessions Completed:** 20
**Total Lines Added:** ~7,400+
**Files Created:** 40+
**Bugs Fixed:** 20+

**Pending:**
- [ ] Apply schema migrations 01-03
- [ ] Update supabaseClient.js
- [ ] Test after migration
- [ ] Coach UI for pricing
- [ ] Purchase flow testing

---

*Last Updated: 17.01.2025*
*Status: ✅ Production-Ready (pending schema migrations)*
