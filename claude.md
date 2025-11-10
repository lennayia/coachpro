# Claude Code - CoachPro Project Instructions

**Last Updated:** 2025-11-10 (Session 13)
**Project:** CoachPro - Online Coaching Platform
**Tech Stack:** React 18 + Vite, Material-UI v6, Supabase, date-fns, Lucide React (icons)

---

## 🎯 Filozofie Projektu

### 1. MODULARITA JE KLÍČ
- **VŽDY** vytváříme reusable utility funkce
- **VŽDY** komponenty rozdělujeme na shared/specific
- **NIKDY** nereplikujeme logiku napříč soubory
- Pattern: `utils → components → pages`

**Příklad:**
```javascript
// ✅ SPRÁVNĚ
imageCompression.js (utils)
  ↓
photoStorage.js (utils)
  ↓
PhotoUpload.jsx (shared component)
  ↓
ClientProfile.jsx, CoachProfile.jsx (pages)

// ❌ ŠPATNĚ
// Stejná logika v ClientProfile.jsx a CoachProfile.jsx
```

### 2. CZECH FIRST
- Všechny UI texty v češtině
- date-fns s Czech locale (`cs`)
- Používat 5. pád (vocative) pro oslovení: `getVocative()`
- Žádné emoji v produkčním kódu (pokud user explicitně nežádá)

### 3. BEZPEČNOST
- **VŽDY** zapnout RLS pro nové tabulky
- **VŽDY** kontrolovat Security Advisor
- Token tabulky: Anyone can INSERT, Users can SELECT/UPDATE own
- Views: Preferovat `security_invoker` over `security_definer`

### 4. SUPABASE BEST PRACTICES
- **NIKDY** nepoužívat embedded resources (`:` syntax) s RLS
- Separátní queries → klientské mapování
- `.single()` = problém na prázdných tabulkách → použít array + check length
- `.maybeSingle()` pro optional data

---

## 📁 Struktura Projektu

```
coachpro/
├── src/
│   ├── modules/
│   │   └── coach/
│   │       ├── pages/          # Stránky (Client*, Coach*)
│   │       └── components/     # Module-specific components
│   ├── shared/
│   │   ├── components/         # Reusable components
│   │   ├── context/            # React Context providers
│   │   ├── hooks/              # Custom hooks
│   │   ├── styles/             # Theme, animations, colors
│   │   └── utils/              # Utility functions (DŮLEŽITÉ!)
│   └── App.jsx
├── supabase/
│   └── migrations/             # SQL migrace
└── docs/                       # Dokumentace (summary*.md)
```

---

## 🔧 Klíčové Utils (Aktuální Stav)

### 1. `src/shared/utils/sessions.js` (402 řádků)
**Plně modular session management pro koučky i klientky**

```javascript
// CRUD Operations
getNextSession(clientId)              // Příští sezení
getClientSessions(clientId, options)  // Všechna sezení klientky
getCoachSessions(coachId, options)    // Všechna sezení koučky
createSession(sessionData)            // Vytvoř sezení
updateSession(sessionId, updates)     // Update sezení
cancelSession(sessionId)              // Zruš sezení
completeSession(sessionId, summary)   // Označ jako dokončené

// Formatovac & Helpers
getTimeUntilSession(date)             // "za 2 dny"
formatSessionDate(date, format)       // Czech locale formátování
isSessionNow(session)                 // Je právě teď?
isSessionPast(date)                   // Je v minulosti?
getSessionStatusLabel(status)         // { label, color }
getSessionLocationLabel(location)     // { label, icon }
```

**Použití:**
```javascript
// Client dashboard
const session = await getNextSession(profile.id);

// Sessions page
const upcoming = await getClientSessions(profile.id, { upcoming: true });
const past = await getClientSessions(profile.id, { past: true });

// Coach (future)
const coachSessions = await getCoachSessions(coach.id, { upcoming: true });
```

### 2. `src/shared/utils/photoStorage.js`
**Supabase Storage operace (reusable pro všechny foto uploady)**

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

### 3. `src/shared/utils/imageCompression.js`
**WebP komprese a validace**

```javascript
compressToWebP(file, { maxWidth, maxHeight, quality })
validateImageFile(file, { maxSizeBytes, allowedTypes })
getImageDimensions(file)
getCompressionStats(originalSize, compressedSize)
```

### 4. `src/shared/utils/czechGrammar.js`
**České pády a formátování**

```javascript
getVocative(name)          // "Lenka" → "Enko"
getFirstName(fullName)     // "Lenka Roubalová" → "Lenka"
```

### 5. `src/shared/constants/icons.js` (88 řádků) - **NEW Session #13**
**Centralizovaný systém ikon - Single Source of Truth**

```javascript
// NAVIGATION_ICONS - Pro NavigationFloatingMenu
export const NAVIGATION_ICONS = {
  dashboard: Home,
  sessions: Calendar,
  materials: Library,      // Knihovna materiálů
  programs: Folder,        // Programy
  cards: Layers,           // Koučovací karty
  clients: Users,
  testers: UserCheck,
};

// SETTINGS_ICONS - Pro FloatingMenu
export const SETTINGS_ICONS = {
  profile: User,
  lightMode: Sun,
  darkMode: Moon,
  betaInfo: Info,
  help: HelpCircle,
  logout: LogOut,
  settings: Settings,
  close: X,
};

// DASHBOARD_ICONS - Pro dashboard komponenty
export const DASHBOARD_ICONS = {
  sessions: Calendar,
  materials: Library,
  programs: Folder,
  cards: Layers,
  clients: Users,
  profile: User,
};

// STATS_ICONS - Pro stats/overview cards
export const STATS_ICONS = {
  sessions: Calendar,
  materials: Library,
  programs: Folder,
  cards: Layers,
  clients: Users,
};

// Helper function
export const getFeatureIcon = (feature) => {
  return DASHBOARD_ICONS[feature] || Home;
};
```

**Použití:**
```javascript
// Import category
import { NAVIGATION_ICONS, STATS_ICONS } from '@shared/constants/icons';

// Destructure (optional, for readability)
const MaterialsIcon = STATS_ICONS.materials;
const CardsIcon = DASHBOARD_ICONS.cards;

// Render
<MaterialsIcon size={40} />
<NAVIGATION_ICONS.dashboard size={20} />
```

**Benefits:**
- ✅ **Single source of truth** - změna na 1 místě
- ✅ **Consistency** - nemožné použít špatnou ikonu
- ✅ **IntelliSense** - autocomplete pro dostupné ikony
- ✅ **Maintainability** - 1 soubor místo 5+ souborů
- ✅ **Scalability** - snadné přidání nových ikon
- ✅ **Bundle optimization** - lepší tree-shaking

**Ikony použity:**
- **Library** (Knihovna) - Pro materiály (was FileText)
- **Folder** - Pro programy
- **Layers** (Vrstvy) - Pro koučovací karty
- **Calendar** - Pro sezení
- **Users** - Pro klientky
- **Home** - Pro dashboard
- **User** - Pro profil

---

## 🧩 Klíčové Komponenty

### 1. `SessionCard.jsx` (Universal)
**Props:**
- `session` - session object (s coach/client details)
- `viewMode` - 'client' nebo 'coach'
- `onClick` - Optional handler
- `compact` - Menší verze
- `showCountdown` - Zobrazit countdown

**Features:**
- Avatar koučky/klientky (podle viewMode)
- Datum, čas, trvání, lokace
- Status chip (scheduled/completed/cancelled/rescheduled)
- Countdown timer ("za 2 dny")
- "Probíhá nyní" badge
- Session summary pro completed

### 2. `PhotoUpload.jsx` (Universal)
**Props:**
- `photoUrl` - Current URL
- `onPhotoChange` - Callback (url|null)
- `userId` - Pro storage path
- `bucket` - PHOTO_BUCKETS constant
- `size` - Avatar size (default 120)
- `maxSizeMB`, `quality`, `maxDimension`

**Features:**
- Click to upload
- Auto WebP compression
- Preview s delete button
- Loading states
- Compression stats zobrazení

### 3. `ClientAuthGuard.jsx`
**Props:**
- `requireProfile` - true/false (redirect pokud profil neexistuje)
- `children` - Wrapped content

---

## 🗄️ Database Schema (Aktuální)

### Tables

#### `coachpro_client_profiles`
```sql
- id (uuid, PK)
- auth_user_id (uuid, FK → auth.users, UNIQUE)
- name, email, phone
- date_of_birth, goals, health_notes
- photo_url (URL v Supabase Storage)
- coach_id (text, FK → coachpro_coaches)
- started_at, sessions_completed (auto-updated via trigger)
- preferred_contact (email|phone|whatsapp)
- timezone (Europe/Prague, ...)
- client_notes (visible only to client)
- created_at, updated_at
```

#### `coachpro_sessions` (NEW!)
```sql
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

#### `coachpro_coaches`
```sql
- id (text, PK, generated from name)
- auth_user_id (uuid, FK → auth.users)
- name, email, phone
- is_admin (boolean)
- created_at, updated_at
```

### Views

#### `client_next_sessions` (security_invoker)
```sql
-- Next scheduled session for each client with coach details
SELECT DISTINCT ON (client_id)
  s.*, c.name, c.email, c.phone
FROM coachpro_sessions s
JOIN coachpro_coaches c ON s.coach_id = c.id
WHERE s.status = 'scheduled' AND s.session_date >= now()
ORDER BY client_id, s.session_date ASC
```

### Triggers

#### `update_sessions_completed`
```sql
-- Auto-update sessions_completed count in client profile
-- Fires on: UPDATE coachpro_sessions.status
```

---

## 🔐 RLS Policies (Vzory)

### Client Profiles
```sql
-- Clients can view own profile
USING (auth_user_id = auth.uid())

-- Coaches can view assigned clients
USING (
  coach_id IN (
    SELECT id FROM coachpro_coaches
    WHERE auth_user_id = auth.uid()
  )
)
```

### Sessions
```sql
-- Clients can view own sessions
USING (
  EXISTS (
    SELECT 1 FROM coachpro_client_profiles
    WHERE id = coachpro_sessions.client_id
    AND auth_user_id = auth.uid()
  )
)

-- Coaches can manage sessions for their clients
USING (
  EXISTS (
    SELECT 1 FROM coachpro_coaches
    WHERE id = coachpro_sessions.coach_id
    AND auth_user_id = auth.uid()
  )
)
```

### Token Tables (email_verification_tokens, password_reset_tokens)
```sql
-- Anyone can INSERT (registration/reset)
FOR INSERT WITH CHECK (true)

-- Users can SELECT/UPDATE own tokens
FOR SELECT USING (user_id = auth.uid())
FOR UPDATE USING (user_id = auth.uid())

-- System can DELETE
FOR DELETE USING (true)
```

---

## 🎨 UI/UX Standards

### 1. Animace
```javascript
import { fadeIn, fadeInUp } from '@shared/styles/animations';

<motion.div
  variants={fadeInUp}
  initial="hidden"
  animate="visible"
  transition={{ delay: 0.1 }}
>
```

### 2. Border Radius
```javascript
import BORDER_RADIUS from '@styles/borderRadius';

sx={{ borderRadius: BORDER_RADIUS.compact }}  // Běžné karty
sx={{ borderRadius: BORDER_RADIUS.card }}     // Velké karty
```

### 3. Glass Card Effect
```javascript
import { useGlassCard } from '@shared/hooks/useModernEffects';

const glassCardStyles = useGlassCard('subtle');
<Card sx={{ ...glassCardStyles }} />
```

### 4. Theme
- Primary color: Green tones (#8FBC8F, #556B2F)
- Dark mode: Supported
- Responsive: Mobile-first

---

## 🚨 Časté Chyby & Řešení

### 1. 406 (Not Acceptable) Error
**Příčina:** `.single()` na prázdné tabulce nebo embedded resources s RLS

**Fix:**
```javascript
// ❌ ŠPATNĚ
const { data } = await supabase
  .from('sessions')
  .select('*, coach:coaches(*)')  // Embedded resource
  .eq('client_id', id)
  .single();  // Fail na empty table

// ✅ SPRÁVNĚ
const { data } = await supabase
  .from('sessions')
  .select('*')
  .eq('client_id', id)
  .limit(1);

if (!data || data.length === 0) return null;
const session = data[0];

// Načti coach separátně
const { data: coach } = await supabase
  .from('coaches')
  .select('*')
  .eq('id', session.coach_id)
  .maybeSingle();

session.coach = coach;
```

### 2. State Sync Issues (React)
**Problém:** Lokální state se neaktualizuje když se změní prop

**Fix:**
```javascript
// PhotoUpload.jsx
const [preview, setPreview] = useState(photoUrl);

useEffect(() => {
  setPreview(photoUrl);
}, [photoUrl]);
```

### 3. RLS Policy Fail
**Problém:** Vnořené SELECT v USING klauzuli

**Fix:**
```sql
-- ❌ ŠPATNĚ
USING (
  client_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
)

-- ✅ SPRÁVNĚ
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = sessions.client_id
    AND profiles.auth_user_id = auth.uid()
  )
)
```

---

## 📝 Commit Message Template

```
feat: brief description

Detailed explanation:
- What was added
- What was changed
- What was fixed

Architecture notes:
- Modular design decisions
- Reusability benefits

Fixes:
- Issue #1 description
- Issue #2 description

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## 🔄 Workflow

### 1. Nová Feature
1. Začni s utils (modular functions)
2. Vytvoř reusable component
3. Implementuj do pages
4. Migrace + RLS policies
5. Test v prohlížeči
6. Check Security Advisor
7. Commit

### 2. Bug Fix
1. Reprodukuj error
2. Debuguj s console.log
3. Fix v utils/components
4. Verify fix
5. Remove debug logs
6. Commit

### 3. End of Session
1. Summary.md (detail všeho co bylo uděláno)
2. Update claude.md (nové patterns, utils, components)
3. Update MASTER_TODO_V4.md (co zbývá)
4. Update MASTER_TODO_priority.md (priority na příští session)
5. CLAUDE_QUICK.md (quick ref pro Claude)
6. CONTEXT_QUICK.md (architektura overview)

---

## 💡 Pro-Tips

1. **Vždy** kontroluj Security Advisor po změnách v DB
2. **Vždy** testuj na prázdné i plné tabulce
3. **Nikdy** necommituj debug logs
4. **Vždy** používej Czech locale pro date-fns
5. **Modularita** > DRY > Performance
6. **Security** > Features
7. Když nevíš strukturu tabulky → `information_schema.columns`
8. Views s RLS → preferuj `security_invoker`

---

## 📚 Reference Links

- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
- [date-fns Czech Locale](https://date-fns.org/v2.29.3/docs/Locale)
- [Material-UI v6](https://mui.com/material-ui/)
- [Framer Motion](https://www.framer.com/motion/)

---

**Remember:** Modularita, česká lokalizace, bezpečnost. V tomto pořadí.
