# CONTEXT QUICK - Architecture Overview

**Last Updated:** 9. listopadu 2025 (Session #12)
**Purpose:** Quick architecture reference for Claude Code

---

## 🏗️ PROJECT ARCHITECTURE

### Tech Stack
- **Frontend:** React 18 + Vite
- **UI:** Material-UI v6
- **Backend:** Supabase (PostgreSQL + Storage + Auth)
- **Date/Time:** date-fns with Czech locale (`cs`)
- **Animations:** Framer Motion
- **Build:** Vite (production-ready)

### Production Status
- ✅ **LIVE ON SUPABASE** (since 3.11.2025)
- ✅ **VERCEL DEPLOYMENT:** https://coachpro-weld.vercel.app
- ✅ **Local Dev:** http://localhost:3000

---

## 📁 FOLDER STRUCTURE

```
coachpro/
├── src/
│   ├── modules/
│   │   └── coach/
│   │       ├── pages/          # Feature pages (Client*, Coach*)
│   │       ├── components/     # Module-specific components
│   │       └── utils/          # Module-specific utils
│   ├── shared/
│   │   ├── components/         # Reusable components
│   │   │   ├── cards/         # BaseCard, SessionCard
│   │   │   ├── FloatingMenu.jsx
│   │   │   └── PhotoUpload.jsx
│   │   ├── context/            # React Context providers
│   │   │   ├── GenericAuthContext.jsx (factory)
│   │   │   ├── ClientAuthContext.jsx
│   │   │   └── TesterAuthContext.jsx
│   │   ├── hooks/              # Custom hooks
│   │   ├── styles/             # Theme, animations, effects
│   │   └── utils/              # ⭐ CRITICAL REUSABLE LOGIC
│   │       ├── sessions.js     # Session CRUD + formatters (402 lines)
│   │       ├── photoStorage.js # Supabase Storage ops
│   │       ├── imageCompression.js # WebP compression
│   │       └── czechGrammar.js # Vocative case
│   └── App.jsx
├── supabase/
│   └── migrations/             # SQL migrations (timestamped)
├── public/
│   └── images/
└── docs/
    ├── summary*.md             # Session summaries
    ├── claude.md               # Full instructions (495 lines)
    ├── CLAUDE_QUICK.md         # Quick ref (1100+ lines)
    ├── CONTEXT_QUICK.md        # This file
    ├── MASTER_TODO_V4.md       # Current TODO
    └── MASTER_TODO_priority.md # Prioritized tasks
```

---

## 🗄️ DATABASE SCHEMA (Key Tables)

### `coachpro_client_profiles`
**Purpose:** Client data + coaching assignments

```sql
Key fields:
- id (uuid, PK)
- auth_user_id (uuid, FK → auth.users, UNIQUE)
- name, email, phone, photo_url
- coach_id (text, FK → coachpro_coaches) -- Assignment
- date_of_birth, goals, health_notes, client_notes
- preferred_contact (email|phone|whatsapp)
- timezone (Europe/Prague, ...)
- sessions_completed (auto-updated via trigger)
- started_at, created_at, updated_at
```

**RLS:**
- Clients view own profile (`auth_user_id = auth.uid()`)
- Coaches view assigned clients (`coach_id = their id`)

### `coachpro_sessions`
**Purpose:** Coaching sessions (scheduled/completed/cancelled)

```sql
Key fields:
- id (uuid, PK)
- client_id (uuid, FK → coachpro_client_profiles)
- coach_id (text, FK → coachpro_coaches)
- session_date (timestamptz)
- duration_minutes (int, default 60)
- status (scheduled|completed|cancelled|rescheduled)
- location (online|in-person|phone)
- coach_notes (text, coach only)
- client_notes (text, visible to both)
- session_summary (text, visible to both)
- created_at, updated_at, created_by
```

**RLS:**
- Clients view own sessions
- Coaches view their sessions

**Indexes:**
- `idx_sessions_client_id`
- `idx_sessions_coach_id`
- `idx_sessions_date`
- `idx_sessions_status`
- `idx_sessions_client_upcoming` (composite)

**Trigger:**
- `update_sessions_completed()` - Auto-updates client profile

### `coachpro_coaches`
**Purpose:** Coach profiles + admin status

```sql
Key fields:
- id (text, PK, generated from name)
- auth_user_id (uuid, FK → auth.users)
- name, email, phone
- is_admin (boolean)
- created_at, updated_at
```

**RLS:** Coach-scoped + admin exception

### `coachpro_materials`, `coachpro_programs`
**Purpose:** Coaching resources

```sql
Key fields:
- id (uuid, PK)
- coach_id (text, FK → coachpro_coaches)
- title, description, url, image_url
- type, category, tags
- share_code (unique, 6-digit)
- created_at, updated_at
```

### Token Tables
- `email_verification_tokens`
- `password_reset_tokens`

**RLS:**
- Anyone can INSERT (registration/reset)
- Users can SELECT/UPDATE own tokens (`user_id = auth.uid()`)
- System can DELETE expired tokens

### Views
- `client_next_sessions` (security_invoker) - Next session for each client with coach details

---

## 🔐 AUTHENTICATION SYSTEM

### Auth Flow (3 types)

#### 1. **Client Auth** (Google OAuth)
```
ClientSignup → Google OAuth → RootRedirect
  ↓
Profile complete? YES → ClientWelcome
                  NO  → ClientProfile
```

**Key Files:**
- `ClientAuthContext.jsx` - Context provider (12 lines, uses GenericAuthContext)
- `ClientAuthGuard.jsx` - Route protection (35 lines)
- `RootRedirect.jsx` - Universal OAuth entry point

#### 2. **Tester/Coach Auth** (Google OAuth)
```
TesterLogin → Google OAuth → TesterDashboard
  ↓
loadCoachSession() → localStorage (coach data)
```

**Key Files:**
- `TesterAuthContext.jsx` - Context provider (40 lines)
- `TesterAuthGuard.jsx` - Route protection (35 lines)

#### 3. **Admin Auth** (Password)
```
AdminLogin → Email/Password → CoachDashboard
```

### Generic Auth System (Factory Pattern)
**Key Innovation:** 73% code reduction (462 → 125 lines)

```javascript
// GenericAuthContext.jsx - Factory function
export function createAuthContext({
  contextName,      // "ClientAuth" | "TesterAuth"
  tableName,        // Profile table name
  allowMissing,     // true = maybeSingle, false = single
  onProfileLoaded   // Optional callback
}) {
  // ... shared auth logic
  return { AuthContext, useAuth, AuthProvider };
}
```

**Pattern:**
- Guards are READ-ONLY (never modify database!)
- Contexts can WRITE (sync with DB)
- Single useEffect (no race conditions)

---

## 🔑 KEY UTILS (Session #12)

### `sessions.js` (402 lines) - Session Management
**Purpose:** Complete CRUD + formatting for coaching sessions

**Key Functions:**
```javascript
// Read operations
getNextSession(clientId)                    // Next scheduled session
getClientSessions(clientId, { upcoming })   // All client sessions
getCoachSessions(coachId, { past })         // All coach sessions

// Write operations
createSession(sessionData)                  // Create new session
updateSession(sessionId, updates)           // Update session
cancelSession(sessionId)                    // Cancel session
completeSession(sessionId, summary)         // Mark completed

// Formatters & Helpers
getTimeUntilSession(date)                   // "za 2 dny" (Czech)
formatSessionDate(date, format)             // Czech locale format
isSessionNow(session)                       // Is happening now?
isSessionPast(date)                         // Is in past?
getSessionStatusLabel(status)               // { label, color }
getSessionLocationLabel(location)           // { label, icon }
```

**Features:**
- ✅ Automatic coach/client mapping (separate queries, no embedded)
- ✅ Czech locale date formatting
- ✅ RLS-compatible (no `.single()` on empty tables)
- ✅ Reusable for client AND coach views

### `photoStorage.js` - Supabase Storage Operations
**Purpose:** Upload/delete photos across entire ecosystem

**Key Functions:**
```javascript
uploadPhoto(file, { bucket, userId, fileName })
deletePhoto(photoUrl, bucket)
updatePhoto(newFile, oldPhotoUrl, options)
getPhotoUrl(bucket, path)
photoExists(bucket, path)

// Bucket constants
PHOTO_BUCKETS = {
  CLIENT_PHOTOS: 'client-photos',
  COACH_PHOTOS: 'coach-photos',
  MATERIAL_IMAGES: 'material-images',
  PROGRAM_IMAGES: 'program-images'
}
```

### `imageCompression.js` - WebP Compression
**Purpose:** Compress images before upload

**Key Functions:**
```javascript
compressToWebP(file, { maxWidth, maxHeight, quality })
validateImageFile(file, { maxSizeBytes, allowedTypes })
getImageDimensions(file)
getCompressionStats(originalSize, compressedSize)
```

**Default Settings:**
- Max dimension: 800px
- Quality: 0.85
- Format: WebP
- Max size: 2MB

### `czechGrammar.js` - Czech Vocative Case
**Purpose:** Proper Czech greeting (5. pád)

```javascript
getVocative('Lenka') → 'Enko'
getFirstName('Lenka Roubalová') → 'Lenka'
```

**Pattern:** Only first name gets vocative transformation!

---

## 🧩 KEY COMPONENTS

### `<SessionCard />` (Universal)
**Path:** `src/shared/components/SessionCard.jsx`

**Purpose:** Display session for clients OR coaches

**Props:**
```javascript
<SessionCard
  session={sessionObject}       // Must have coach/client populated
  viewMode="client"              // or "coach"
  onClick={() => {}}             // Optional click handler
  showCountdown={true}           // Show "za 2 dny" countdown
  compact={false}                // Smaller version
/>
```

**Features:**
- Avatar with photo (coach or client depending on viewMode)
- Date/time/duration/location display
- Status chip (scheduled/completed/cancelled/rescheduled)
- Countdown timer ("za 2 dny")
- "Probíhá nyní" badge
- Session summary for completed sessions

### `<PhotoUpload />` (Universal)
**Path:** `src/shared/components/PhotoUpload.jsx`

**Purpose:** Photo upload with WebP compression

**Props:**
```javascript
<PhotoUpload
  photoUrl={currentUrl}          // Current photo URL
  onPhotoChange={(url) => {}}    // Callback when changed
  userId={user.id}               // For storage path
  bucket={PHOTO_BUCKETS.CLIENT_PHOTOS}
  size={120}                     // Avatar size
  maxSizeMB={2}
  quality={0.85}
  maxDimension={800}
/>
```

**Features:**
- Click to upload
- Auto WebP compression
- Preview with delete button
- Loading states
- Compression stats display

### `<BaseCard />` (Foundation)
**Path:** `src/shared/components/cards/BaseCard.jsx`

**Purpose:** Base card for Material/Program/Client cards

**CRITICAL:** All specific cards (MaterialCard, ProgramCard) should USE BaseCard, not duplicate UI!

### `<ClientAuthGuard />` & `<TesterAuthGuard />`
**Path:** `src/shared/components/`

**Purpose:** Route protection

```javascript
<ClientAuthGuard requireProfile={true}>
  <ProtectedPage />
</ClientAuthGuard>
```

**Features:**
- Loading states
- Auto-redirects
- Error handling
- Read-only (never modifies DB)

---

## 🎨 DESIGN SYSTEM

### Border Radius System
**Path:** `src/styles/borderRadius.js`

```javascript
import BORDER_RADIUS from '@styles/borderRadius';

BORDER_RADIUS.minimal  // 8px - Progress bars
BORDER_RADIUS.small    // 12px - Menu items
BORDER_RADIUS.compact  // 16px - Buttons, inputs
BORDER_RADIUS.card     // 20px - Cards (default)
BORDER_RADIUS.premium  // 24px - Large elements
```

**NEVER hardcode border radius!**

### Glassmorphism Effects
**Path:** `src/shared/styles/modernEffects.js`

```javascript
import { createBackdrop, createGlassDialog } from '@shared/styles/modernEffects';

<Dialog
  BackdropProps={{ sx: createBackdrop() }}
  PaperProps={{ sx: createGlassDialog(isDark, BORDER_RADIUS.dialog) }}
/>
```

### Toast Notifications
**Path:** `src/shared/context/NotificationContext.jsx`

```javascript
import { useNotification } from '@shared/context/NotificationContext';
const { showSuccess, showError, showInfo, showWarning } = useNotification();

showSuccess('Hotovo!', 'Akce byla úspěšná');
showError('Chyba', 'Něco se pokazilo');
```

### Date Formatting (Czech)
```javascript
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';

format(date, 'PPPp', { locale: cs });  // "středa, 9. listopadu 2025 v 14:30"
format(date, 'EEEE', { locale: cs });  // "středa"
format(date, 'd. MMMM yyyy', { locale: cs });  // "9. listopadu 2025"
```

---

## 🚨 CRITICAL PATTERNS

### 1. Modular Architecture
**ALWAYS:** utils → components → pages

```
imageCompression.js
  ↓ uses
photoStorage.js
  ↓ uses
PhotoUpload.jsx
  ↓ uses
ClientProfile.jsx, CoachProfile.jsx
```

### 2. NO .single() on Empty Tables
```javascript
// ❌ WRONG
.single()  // 406 error on empty table

// ✅ CORRECT
.limit(1)
// Check data.length === 0
```

### 3. NO Embedded Resources with RLS
```javascript
// ❌ WRONG
.select('*, coach:coaches(*)')

// ✅ CORRECT
const sessions = await supabase.from('sessions').select('*');
const coaches = await supabase.from('coaches').select('*').in('id', coachIds);
// Map on client
```

### 4. Guards are READ-ONLY
**NEVER:**
- Call `saveCoach()`, `saveMaterial()` in guards
- Modify database in guards
- Side effects (except redirects)

**ALWAYS:**
- Just read from DB
- Save to localStorage only
- Redirect if auth fails

### 5. Czech Locale EVERYWHERE
- date-fns with `cs` locale
- Vocative case for greetings
- Czech UI text

---

## 📊 CURRENT STATUS (9.11.2025)

**Session #12:** Session Management & Photo Upload ✅
**Session #11:** Auth Refactoring ✅
**Session #10:** Koučovací Karty ✅

**Next Priority:**
1. Coach Session Management UI (Sprint 12a)
2. Client Materials/Help pages (Sprint 2a)

**Tech Debt:**
- MaterialCard.jsx doesn't use BaseCard (Sprint 18c)
- Button modularity system (Sprint 18b)

**Security:**
- ✅ 0 Security Advisor errors
- ✅ RLS enabled on all critical tables
- ✅ Token tables protected

---

## 🔗 QUICK LINKS

- **Full Docs:** `claude.md` (495 lines)
- **Quick Rules:** `CLAUDE_QUICK.md` (1100+ lines)
- **Session Summary:** `summary12.md` (334 lines)
- **Master TODO:** `MASTER_TODO_V4.md`
- **Priorities:** `MASTER_TODO_priority.md`

---

**Remember:** Modularita, česká lokalizace, bezpečnost. V tomto pořadí.
