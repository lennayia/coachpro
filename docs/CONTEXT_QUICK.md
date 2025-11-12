# CoachPro - Architecture Overview

**Aktualizováno:** Session #15 (11.11.2025)

---

## 🏗️ Architektura Projektu

### Modular Design Pattern (Session #14 + #15)

```
Utils (reusable functions)
  ↓
Shared Components (universal, props-based)
  ↓
Page Components (specific implementations)
```

**Příklad Session #15:**
```
validation.js (utils) → isValidEmail, formatPhone, formatSocialUrl
  ↓
ProfileScreen.jsx (universal component) → validace + auto-formátování
  ↓
ProfilePage.jsx (coach/tester), ClientProfile.jsx (client) → specific implementations
```

**Příklad Session #14:**
```
imageCompression.js + photoStorage.js (utils)
  ↓
PhotoUpload.jsx (shared component)
  ↓
ClientProfile.jsx, ProfilePage.jsx (pages)
```

---

## 📂 Struktura Souborů

```
src/
├── modules/coach/
│   ├── pages/
│   │   ├── Tester.jsx                  # Registrace testerů (uses RegisterForm)
│   │   ├── TesterWelcome.jsx           # Welcome screen (uses WelcomeScreen)
│   │   ├── CoachLogin.jsx              # Login (3 auth methods)
│   │   ├── ClientWelcome.jsx           # Client welcome (uses WelcomeScreen)
│   │   ├── ClientProfile.jsx           # Client profile (HAS PhotoUpload ✅)
│   │   ├── ProfilePage.jsx             # Coach profile (MISSING PhotoUpload ❌)
│   │   ├── ClientMaterials.jsx         # Client materials view
│   │   └── ...
│   └── components/
│       └── SessionCard.jsx             # Session display (universal)
│
└── shared/
    ├── components/
    │   ├── WelcomeScreen.jsx           # ⭐ NEW Session #14 - Universal welcome
    │   ├── RegisterForm.jsx            # ⭐ NEW Session #14 - Universal registration
    │   ├── PhotoUpload.jsx             # Universal photo upload
    │   ├── FloatingMenu.jsx            # Settings menu (has "Rozcestník")
    │   ├── ClientAuthGuard.jsx         # Client auth protection
    │   └── TesterAuthGuard.jsx         # Tester auth protection
    │
    ├── context/
    │   ├── TesterAuthContext.jsx       # Tester authentication state
    │   ├── ClientAuthContext.jsx       # Client authentication state
    │   └── NotificationContext.jsx     # Notifications
    │
    ├── utils/
    │   ├── sessions.js                 # ⭐ Session management (402 lines)
    │   ├── photoStorage.js             # ⭐ Supabase Storage operations
    │   ├── imageCompression.js         # WebP compression
    │   ├── czechGrammar.js             # getVocative(), getFirstName()
    │   ├── storage.js                  # Programs, materials, cards
    │   └── generateCode.js             # Share code generation
    │
    ├── styles/
    │   ├── animations.js               # fadeIn, fadeInUp
    │   ├── borderRadius.js             # BORDER_RADIUS constants
    │   └── modernEffects.js            # Glass card effects
    │
    └── hooks/
        └── useModernEffects.js         # useGlassCard()
```

---

## 🔐 Autentizace Flow (Session #14)

### User Types & Auth Methods

```
┌─────────────────────────────────────────────────────┐
│                  CoachPro Users                      │
├─────────────────────────────────────────────────────┤
│                                                       │
│  Testers (Beta testers)                              │
│    → RegisterForm (Tester.jsx)                       │
│    → Email+Password + Google OAuth                   │
│    → Creates: testers + coachpro_coaches record      │
│    → Has: TesterWelcome (rozcestník)                 │
│                                                       │
│  Clients (End users)                                 │
│    → Register via /client/signup                     │
│    → Email+Password                                  │
│    → Creates: coachpro_client_profiles               │
│    → Has: ClientWelcome (code entry)                 │
│                                                       │
│  Coaches (Future - not yet implemented)              │
│    → Will use RegisterForm                           │
│    → Full coach functionality                        │
│                                                       │
└─────────────────────────────────────────────────────┘
```

### Registration Flow (KRITICKÉ!)

```javascript
// 1. Supabase Auth account
const { data: authData } = await supabase.auth.signUp({...});

// 2. DB inserts (while session active!)
await onSuccess({
  authUserId: authData.user.id,  // ← RLS potřebuje aktivní session!
  ...
});

// 3. Sign out (MUSÍ být až nakonec!)
await supabase.auth.signOut();

// 4. Email confirmation required
```

---

## 🗄️ Database Architecture

### Core Tables

```sql
auth.users (Supabase Auth)
  ↓
├── testers (beta testers)
│     ↓
│   coachpro_coaches (is_tester = true)
│
└── coachpro_client_profiles (clients)
      ↓
    coachpro_sessions (coaching sessions)
```

### Key Relationships

```
coachpro_client_profiles.coach_id → coachpro_coaches.id
coachpro_sessions.client_id → coachpro_client_profiles.id
coachpro_sessions.coach_id → coachpro_coaches.id
coachpro_coaches.tester_id → testers.id (optional)
```

### RLS Strategy

- **Testers:** Anyone INSERT, own SELECT/UPDATE
- **Clients:** Own SELECT/UPDATE, coach can view assigned
- **Sessions:** Client + coach can view/manage
- **Tokens:** Anyone INSERT, own SELECT/UPDATE

---

## 🧩 Component Reusability Matrix

### WelcomeScreen (Universal)

| User Type | Uses WelcomeScreen | Custom Props |
|-----------|-------------------|--------------|
| Tester | ✅ TesterWelcome.jsx | actionCards (dashboard, clients, sessions...) |
| Client | ✅ ClientWelcome.jsx | customCodeEntry, getVocative() |
| Coach | 🚧 Future | TBD |

### RegisterForm (Universal)

| User Type | Page | onSuccess Callback |
|-----------|------|-------------------|
| Tester | Tester.jsx | Insert testers + coaches |
| Client | ClientSignup.jsx | Insert client_profiles |
| Coach | 🚧 Future | Insert coaches |

### PhotoUpload (Universal)

| User Type | Page | Bucket |
|-----------|------|--------|
| Client | ClientProfile.jsx | CLIENT_PHOTOS |
| Coach | ProfilePage.jsx | COACH_PHOTOS (⚠️ MISSING!) |
| Tester | TesterProfile.jsx | COACH_PHOTOS (⚠️ MISSING!) |

---

## 🚧 Known Gaps (Priority Tasks)

### 1. ProfileScreen Component (MISSING)
**Problem:** 3 different profile pages with duplicated code
**Solution:** Create universal ProfileScreen.jsx

```
ProfileScreen.jsx (to create)
  ↓
├── ProfilePage.jsx (/coach/profile) - REFACTOR
├── TesterProfileSimple.jsx (/tester/profile) - REFACTOR
└── ClientProfile.jsx (/client/profile) - REFACTOR
```

### 2. PhotoUpload Missing on Coach/Tester Profiles
**Problem:** Only ClientProfile has PhotoUpload
**Solution:** Use ProfileScreen with PhotoUpload

---

## 📊 Code Metrics (Session #14)

### Lines Removed
- Access code system: 300+ lines
- TesterWelcome duplication: 62 lines (-34%)
- ClientWelcome duplication: 208 lines (-41%)

### Lines Added
- RegisterForm.jsx: 331 lines (replaces 300+)
- WelcomeScreen.jsx: 330 lines (replaces 689)
- CoachLogin.jsx: 436 lines (new)

**Net Result:** More features, less code, better modularity

---

## 🎯 Design Principles

### 1. Modularita
- Utils first, then components, then pages
- No logic duplication across files
- Props-based configuration

### 2. Czech First
- All UI in Czech
- date-fns with `cs` locale
- Vocative case (5. pád) for greetings

### 3. Security
- RLS on all tables
- Email confirmation required
- auth_user_id always populated
- No access codes (removed Session #14)

### 4. User Experience
- Animations (framer-motion)
- Glass card effects
- Dark mode support
- Responsive mobile-first

---

## 🔄 Data Flow Examples

### Client Login → Dashboard → Profile

```
1. ClientWelcome.jsx
   ↓ (code entry or login)
2. ClientAuthContext validates
   ↓
3. ClientAuthGuard protects routes
   ↓
4. ClientDashboard.jsx
   ↓ (uses getNextSession)
5. SessionCard displays next session
   ↓ (avatar click)
6. ClientProfile.jsx
   ↓ (uses PhotoUpload)
7. photoStorage.js + imageCompression.js
```

### Tester Registration → Welcome → Edit Profile

```
1. Tester.jsx (RegisterForm)
   ↓
2. Email confirmation
   ↓
3. CoachLogin.jsx
   ↓
4. TesterWelcome.jsx (WelcomeScreen)
   ↓ (Rozcestník - FloatingMenu)
5. ProfilePage.jsx
   ⚠️ MISSING PhotoUpload!
```

---

## 📚 Session History

- **Session #12:** Sessions management, triggers, views
- **Session #13:** Auth troubleshooting, RLS fixes
- **Session #14:** Complete auth overhaul
  - Removed access codes
  - Added RegisterForm, WelcomeScreen
  - Email confirmation
  - Google OAuth + Magic Link
  - Modular architecture

---

## 🔗 Related Docs

- `CLAUDE.md` - Complete project instructions
- `CLAUDE_QUICK_V1.md` - Quick reference
- `docs/summary14.md` - Session #14 detailed docs
- `MASTER_TODO_V4.md` - All pending tasks
- `MASTER_TODO_priority.md` - Priority tasks

---

**Architecture Motto:** Utils → Components → Pages. Always.
