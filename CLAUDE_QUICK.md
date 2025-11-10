# ⚡ CLAUDE QUICK - Kritická pravidla pro AI asistenta

> **Účel**: Rychlý přehled nejdůležitějších pravidel. Pro detaily viz CLAUDE.md

**Poslední update**: 10. listopadu 2025 - Session #13
**Pro full dokumentaci**: Čti CLAUDE.md (ale JEN když potřebuješ detaily!)

---

## 🚨 KRITICKÁ PRAVIDLA - VŽDY DODRŽUJ

### 1. 🎨 MODULAR ICON SYSTEM - icons.js (Session #13)

**⚠️ NOVÉ PRAVIDLO (10.11.2025)** - **CENTRALIZED ICONS**

**PRAVIDLO - VŽDY používej icons.js, NIKDY direct imports:**

```javascript
// ❌ NIKDY direct imports v pages/components
import { Library, Folder, Layers, Calendar } from 'lucide-react';

// ✅ VŽDY centrální konfigurace
import { NAVIGATION_ICONS, STATS_ICONS, DASHBOARD_ICONS, SETTINGS_ICONS } from '@shared/constants/icons';

// Destructure for readability
const MaterialsIcon = NAVIGATION_ICONS.materials;  // Library
const ProgramsIcon = NAVIGATION_ICONS.programs;    // Folder
const CardsIcon = NAVIGATION_ICONS.cards;          // Layers

// Render
<MaterialsIcon size={40} />
<NAVIGATION_ICONS.dashboard size={20} />
```

**Kategorie ikon:**
```javascript
// NAVIGATION_ICONS - NavigationFloatingMenu
{
  dashboard: Home,
  sessions: Calendar,
  materials: Library,      // Knihovna materiálů
  programs: Folder,        // Programy
  cards: Layers,           // Koučovací karty
  clients: Users,
  testers: UserCheck,
}

// SETTINGS_ICONS - FloatingMenu
{
  profile: User,
  lightMode: Sun,
  darkMode: Moon,
  betaInfo: Info,
  help: HelpCircle,
  logout: LogOut,
  settings: Settings,
  close: X,
}

// DASHBOARD_ICONS - Dashboard components
{
  sessions: Calendar,
  materials: Library,
  programs: Folder,
  cards: Layers,
  clients: Users,
  profile: User,
}

// STATS_ICONS - Stats cards
{
  sessions: Calendar,
  materials: Library,
  programs: Folder,
  cards: Layers,
  clients: Users,
}
```

**Benefits**:
- ✅ Single source of truth - změna na 1 místě
- ✅ 100% konzistence ikon napříč appem
- ✅ IntelliSense autocomplete
- ✅ Snadná údržba (1 soubor místo 5+)
- ✅ Lepší tree-shaking

**Icon Size:**
- Lucide: `size={40}` prop (NOT MUI's `sx={{ fontSize: 40 }}`)
- Color: `color` prop or `style={{ color: theme.palette.primary.main }}`

### 2. 📸 SESSION MANAGEMENT - sessions.js Utils (Session #12)

**⚠️ NOVÉ PRAVIDLO (9.11.2025)** - **MODULAR SESSION SYSTEM**

**PRAVIDLO - VŽDY používej sessions.js utils, NIKDY custom queries:**

```javascript
// ❌ NIKDY custom queries v pages/components
const { data } = await supabase
  .from('coachpro_sessions')
  .select('*')
  .eq('client_id', clientId);

// ✅ VŽDY sessions.js utils
import { getNextSession, getClientSessions, getCoachSessions } from '@shared/utils/sessions';

const session = await getNextSession(clientId);
const upcoming = await getClientSessions(clientId, { upcoming: true });
const coachSessions = await getCoachSessions(coachId, { upcoming: true });
```

**Key Functions**:
- `getNextSession(clientId)` - Příští sezení
- `getClientSessions(clientId, { upcoming: true })` - Nadcházející sezení
- `getClientSessions(clientId, { past: true })` - Minulá sezení
- `getCoachSessions(coachId, options)` - Koučková sezení
- `createSession(sessionData)` - Vytvoření sezení
- `cancelSession(sessionId)` - Zrušení
- `completeSession(sessionId, summary)` - Dokončení
- `getTimeUntilSession(date)` - "za 2 dny" (Czech locale)
- `formatSessionDate(date, format)` - Czech formátování
- `isSessionNow(session)` - Je právě teď?
- `getSessionStatusLabel(status)` - { label, color }

**Benefits**:
- ✅ Single source of truth pro session logiku
- ✅ Automatické mapování coach/client details
- ✅ Consistent Czech locale formátování
- ✅ Reusable pro klientky i koučky

### 2. 📷 PHOTO UPLOAD - Modular Pattern (Session #12)

**⚠️ NOVÉ PRAVIDLO (9.11.2025)** - **3-LAYER PHOTO SYSTEM**

**PRAVIDLO - 3 vrstvy: compression → storage → component:**

```javascript
// Layer 1: imageCompression.js - WebP compression
import { compressToWebP, validateImageFile } from '@shared/utils/imageCompression';

const validation = validateImageFile(file, { maxSizeBytes: 2 * 1024 * 1024 });
if (!validation.valid) return showError(validation.error);

const blob = await compressToWebP(file, {
  maxWidth: 800,
  maxHeight: 800,
  quality: 0.85
});

// Layer 2: photoStorage.js - Supabase Storage
import { uploadPhoto, deletePhoto, PHOTO_BUCKETS } from '@shared/utils/photoStorage';

const { url } = await uploadPhoto(compressedFile, {
  bucket: PHOTO_BUCKETS.CLIENT_PHOTOS,
  userId: user.id,
  fileName: 'photo.webp'
});

// Layer 3: PhotoUpload.jsx - Reusable component
import PhotoUpload from '@shared/components/PhotoUpload';

<PhotoUpload
  photoUrl={photoUrl}
  onPhotoChange={setPhotoUrl}
  userId={user?.id}
  bucket={PHOTO_BUCKETS.CLIENT_PHOTOS}
  size={120}
  maxSizeMB={2}
  quality={0.85}
/>
```

**Benefits**:
- ✅ Reusable pro všechny foto uploady (client, coach, materials, programs)
- ✅ Automatická WebP komprese
- ✅ Consistent file management
- ✅ Easy to test each layer independently

### 3. 🚫 NO .single() ON EMPTY TABLES (Session #12)

**⚠️ KRITICKÉ** - `.single()` způsobuje 406 error na prázdné tabulce!

**PRAVIDLO - Array response + check length:**

```javascript
// ❌ NIKDY .single() na potenciálně prázdné tabulky
const { data } = await supabase
  .from('coachpro_sessions')
  .select('*')
  .eq('client_id', clientId)
  .single();  // ❌ 406 error pokud 0 rows!

// ✅ VŽDY array response + check
const { data } = await supabase
  .from('coachpro_sessions')
  .select('*')
  .eq('client_id', clientId)
  .limit(1);

if (!data || data.length === 0) return null;
const session = data[0];
```

**Exception**: Use `.maybeSingle()` for optional lookups (returns null if 0 rows)

### 4. 🚫 NO EMBEDDED RESOURCES WITH RLS (Session #12)

**⚠️ KRITICKÉ** - Embedded resources (`:` syntax) nefungují správně s RLS!

**PRAVIDLO - Separate queries + client-side mapping:**

```javascript
// ❌ NIKDY embedded resources
const { data } = await supabase
  .from('coachpro_sessions')
  .select('*, coach:coachpro_coaches(*)');  // ❌ RLS issues!

// ✅ VŽDY separátní queries
const { data: sessions } = await supabase
  .from('coachpro_sessions')
  .select('*')
  .eq('client_id', clientId);

// Načti coach details separátně
const coachIds = [...new Set(sessions.map(s => s.coach_id))];
const { data: coaches } = await supabase
  .from('coachpro_coaches')
  .select('*')
  .in('id', coachIds);

// Map na klientovi
const coachMap = {};
coaches.forEach(c => coachMap[c.id] = c);
sessions.forEach(s => s.coach = coachMap[s.coach_id]);
```

### 5. ⚠️ SUPABASE FOREIGN KEY CONSTRAINTS

**PŘED každým `saveMaterial()`, `saveProgram()`, `createSharedMaterial()` MUSÍŠ:**

```javascript
if (material.coachId) {
  let coach = await getCoachById(material.coachId);
  if (!coach) {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === material.coachId) {
      await saveCoach(currentUser);
    }
  }
}
// Teprve TEĎ save material/program
```

**Proč**: Coach musí existovat v DB PŘED vytvořením materiálu (foreign key constraint)

### 2. 🎨 BORDER_RADIUS Systém

**NIKDY hardcoded hodnoty:**
```javascript
// ❌ ŠPATNĚ:
borderRadius: 2
borderRadius: '20px'

// ✅ SPRÁVNĚ:
import BORDER_RADIUS from '@styles/borderRadius';
borderRadius: BORDER_RADIUS.card
```

**Hodnoty:**
- `minimal: 8px` - Progress bary
- `small: 12px` - Menu items
- `compact: 16px` - Buttons, inputs
- `card: 20px` - Karty (default)
- `premium: 24px` - Velké prvky

### 3. 🔧 PATH ALIASES

**VŽDY používej:**
```javascript
✅ import BORDER_RADIUS from '@styles/borderRadius';
✅ import { useGlassCard } from '@shared/hooks/useModernEffects';
❌ import BORDER_RADIUS from '../../../styles/borderRadius';
```

### 4. 📦 MODULÁRNÍ SYSTÉMY (6 systémů)

Při KAŽDÉ nové komponentě kontroluj:

1. **BORDER_RADIUS** - import a použití konstant
2. **Glassmorphism** - `createBackdrop()`, `createGlassDialog()`
3. **QuickTooltip** - všechny IconButtons wrapped
4. **Toast notifications** - `useNotification()` hook
5. **Touch handlers** - swipe, long-press
6. **Path aliases** - @styles, @shared

**Gold Standard**: `MaterialCard.jsx` - plně implementuje všech 6

### 5. 🔔 NOTIFIKACE - Modulární systém

```javascript
import { useNotification } from '@shared/context/NotificationContext';
const { showSuccess, showError, showInfo, showWarning } = useNotification();

showSuccess('Hotovo!', 'Akce byla úspěšná');
showError('Chyba', 'Něco se pokazilo');
```

**Features:**
- Glassmorphism design
- Audio feedback (notification.mp3)
- Auto-dismiss 5s
- Position: top right

### 6. 🎯 FLOATING MENU - Dva menu

**FloatingMenu** (settings, vpravo `right: 16`):
- User, Theme, Beta Info, Help, Logout
- Primary-secondary gradienty
- Shine efekty

**NavigationFloatingMenu** (navigace, vpravo `right: 80`):
- Logo CoachPro (bílé: `filter: brightness(0) invert(1)`)
- Dashboard, Materiály, Programy, Klientky
- Mutual exclusion (otevře se jen jedno)

**Mutual exclusion v Header.jsx:**
```javascript
const [navigationMenuOpen, setNavigationMenuOpen] = useState(false);
const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

// Když otevřeš jedno, druhé se zavře
```

### 7. 🎨 DESIGN PREFERENCE

**Uživatelka CHCE:**
- ✅ Kompaktní design
- ✅ Glassmorphism efekty
- ✅ Minimalistický styl
- ✅ Proporcionální zakulacení

**Uživatelka NECHCE:**
- ❌ Emoji v UI (jen v textu/content)
- ❌ Velká tlačítka (fullWidth jen když nutné)
- ❌ Příliš velké mezery
- ❌ Nekonzistentní styling

### 8. 🔒 MAZÁNÍ STARÉHO KÓDU

**VŽDY SMAZAT, NE KOMENTOVAT:**
```javascript
// ❌ ŠPATNĚ:
// const oldFunction = () => { ... };
const newFunction = () => { ... };

// ✅ SPRÁVNĚ:
const newFunction = () => { ... };
```

### 9. 🌍 KOMUNIKACE

**VŽDY ČESKY** - uživatelka je česká!

### 10. 🎯 PRODUCTION STATUS AWARENESS

**KRITICKÉ - VŽDY SI PAMATUJ:**

✅ **PROJEKT JE V PRODUKCI NA SUPABASE!** (od 3.11.2025)

**Uživatelka zdůraznila (4.11.2025)**:
- "A Supabase už přece máme!"
- "my už jsme v produkčním režimu na supabase, to přece už musíš vědět za tu dobu!"

**Co to znamená:**
- ❌ NENAVRHUJ "future Supabase integration" - UŽ JE integrovaný!
- ❌ NEŘÍKEJ "až budeme mít Supabase" - UŽ MÁME!
- ✅ 300ms delay v MaterialsLibrary = simulace async, NE "čekání na Supabase"

### 11. 🔄 INLINE VS MODULAR TRADE-OFFS

**Někdy je lepší RYCHLÉ ŘEŠENÍ než VELKÝ REFACTOR:**

**Příklad z 4.11.2025:**
- Problém: Button není responsive
- Option A: Inline fix (5 minut)
- Option B: Full button modularity system (6-8 hodin)

**User rozhodnutí**: "no, jenže to bychom zas měli opravdu hodně práce s tím, viď?"

**Řešení:**
```javascript
// Inline responsive padding
sx={{
  px: { xs: 2, sm: 3 },
  py: { xs: 0.75, sm: 1 }
}}
```

**Pattern:**
- Zeptej se na scope (inline vs modular)
- Když time constraint → inline solution
- Dokumentuj full refactor jako FUTURE TASK
- Explicitně označ trade-off

### 12. 📝 DOCUMENTATION PATTERN

**COMPLETED vs FUTURE WORK - oddělit!**

**User feedback (4.11.2025)**:
> "já jsem ale chtěla, abys tam zapsal, že musíme udělat modularitu pro tlačítka a popsal, jak - jako úkol na později"

**Správný pattern:**

```markdown
## Session Work (4.11.2025) ✅
- MaterialCardSkeleton refactor
- Button inline fix
- Sprint 18b dokumentace

## Sprint 18b: Button Modularity (FUTURE) ⏳
- Status: Pending
- Odhad: 6-8 hodin
- 5 functions to create
- 3 implementation phases
```

**KEY**: Hotovou práci ✅ vs budoucí úkoly ⏳ - VŽDY oddělit!

### 13. 🛠️ USER INSTRUCTIONS PATTERN

**Kdy poskytnout INSTRUKCE místo AUTOMATICKÉ OPRAVY:**

**User říká**: "ukaž jak, opravím sama"

**Příklad (4.11.2025)**:
```
User: "Beta badge by mělo být secondary color. Pokud stačí, ukaž jak, opravím sama."

AI: Header.jsx:
- Line 133: backgroundColor: '#FF9800' → 'secondary.main'
- Line 138: backgroundColor: '#F57C00' → 'secondary.dark'
```

**Pattern:** Respektuj user autonomii - někdy chce opravit sama!

### 14. 🎯 BASECARD MODULARITY - KRITICKÉ!

**⚠️ NOVÉ PRAVIDLO (5.11.2025)**

**User feedback**: "k čemu ale máme baseCard.jsx, když to pak napíšeš natvrdo do ProgramCard?"

**PRAVIDLO:**
- ❌ NIKDY hardcodovat UI do specific cards (ProgramCard, MaterialCard, ClientCard)
- ✅ VŽDY implementovat features v BaseCard.jsx
- ✅ Specific cards JEN předávají data (props), ne UI

**Příklad - Feedback Button:**

```javascript
// ❌ ŠPATNĚ - hardcoded v ProgramCard (47 řádků)
const footer = program.programFeedback && program.programFeedback.length > 0 ? (
  <Box onClick={...} sx={{ ... 40 řádků styling }}>
    <MessageSquare />
    <Typography>{program.programFeedback.length}× reflexe</Typography>
  </Box>
) : null;

// ✅ SPRÁVNĚ - modular v BaseCard
<BaseCard
  feedbackData={program.programFeedback}
  onFeedbackClick={() => setFeedbackModalOpen(true)}
/>
```

**Benefit:**
- Změny UI na JEDNOM místě (BaseCard)
- Automatické propagování všude
- Consistency napříč kartami
- DRY princip dodržen

**Tech Debt Discovery:**
- MaterialCard.jsx NEpoužívá BaseCard → identifikováno jako tech debt
- Čeká na user rozhodnutí: quick fix vs. proper refactor

### 15. 🔐 CONTEXT API & AUTH GUARDS - KRITICKÉ!

**⚠️ NOVÉ PRAVIDLO (6.11.2025)**

**User feedback**: "možná to nebyl dobrý nápad pořád se přihlašovat dokola přes Google" + "a šetříme tím dotazy na databázi?"

**PRAVIDLO - ALWAYS use Context for shared state:**

```javascript
// ❌ NIKDY duplicate auth checks v každé stránce
useEffect(() => {
  const { data } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from(...);
}, []);

// ✅ VŽDY Context API
<ClientAuthProvider>
  <Routes>
    <Route path="/welcome" element={<ClientWelcome />} />
  </Routes>
</ClientAuthProvider>

// Usage (1 řádek!):
const { user, profile, loading, logout } = useClientAuth();
```

**PRAVIDLO - Component Guards > Hook Guards:**

```javascript
// ❌ NIKDY hook-based guards (can't render, manual loading checks)
const useAuthGuard = (requireProfile) => { ... }

// ✅ VŽDY component-based guards
<ClientAuthGuard requireProfile={true}>
  {/* Auto-handles loading, redirects, errors */}
</ClientAuthGuard>
```

**PRAVIDLO - displayName Pattern:**

```javascript
// Multi-source names (Google OAuth + DB):
setProfile({
  ...profileData,
  displayName: googleName || profileData.name || '' // ⭐ Priority!
});

// Usage:
{getVocative(profile?.displayName || '')}
```

**PRAVIDLO - Auto-redirect Logic:**

```javascript
// VŽDY na entry pages:
useEffect(() => {
  if (!loading && user && profile) {
    navigate('/dashboard'); // Skip login screen ⭐
  }
}, [loading, user, profile, navigate]);
```

**PRAVIDLO - Czech Vocative = JEN PRVNÍ JMÉNO:**

```javascript
// ✅ SPRÁVNĚ - ONLY [0] = first name!
const firstName = fullName.trim().split(' ')[0]; // ⭐
if (firstName.endsWith('a')) return firstName.slice(0, -1) + 'o';

// Příklad:
"Lenka Penka Podkolenka" → "Lenko"  // JEN první jméno!
```

**Benefits:**
- **Performance**: 67% fewer DB queries (6 → 2)
- **Code Quality**: 90% reduction in duplication
- **UX**: No repeated OAuth prompts

**Implementace:**
- `ClientAuthContext.jsx` - Context provider (131 lines)
- `ClientAuthGuard.jsx` - Component guard (76 lines)
- `czechGrammar.js` - Vocative utility (32 lines)
- `ClientWelcome.jsx` - Welcome screen + logout button
- `ClientDashboard.jsx` - Client zone (4 cards)

---

### 16. 🔐 OAUTH ROOT REDIRECT - KRITICKÉ!

**⚠️ NOVÉ PRAVIDLO (6.11.2025 večer)**

**Problem**: Supabase má limit 8 redirect URLs

**PRAVIDLO - ALWAYS redirect OAuth to `/` (root):**

```javascript
// ❌ NIKDY specific pages
<GoogleSignInButton redirectTo="/client/welcome" />
<GoogleSignInButton redirectTo="/coach/dashboard" />

// ✅ VŽDY root (RootRedirect handles routing)
<GoogleSignInButton redirectTo="/" />
// nebo použij default (je to `/`)
<GoogleSignInButton />
```

**PRAVIDLO - ALWAYS use account picker:**

```javascript
// ✅ VŽDY force account selection
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/`,
    queryParams: {
      prompt: 'select_account',  // ← KRITICKÉ!
    },
  },
});
```

**PRAVIDLO - RootRedirect je Single Source of Truth:**

```javascript
// RootRedirect.jsx - Universal OAuth entry point
const { data: { user } } = await supabase.auth.getUser();

if (!user) navigate('/tester/signup');  // No auth

const clientProfile = await getProfile(user.id);
if (clientProfile) {
  navigate(clientProfile.complete ? '/client/welcome' : '/client/profile');
} else {
  navigate('/client/profile');  // New signup
}
```

**Supabase Configuration:**
```
Site URL: https://coachpro-weld.vercel.app

Redirect URLs (jen 2!):
✅ https://coachpro-weld.vercel.app/
✅ http://localhost:3000/
```

**Benefits:**
- ✅ Unlimited user types (koučky, admin) - scalable!
- ✅ Centralized routing + business logic
- ✅ Better UX (account picker vždy)
- ✅ Security (can't bypass checks via deep links)

**Files:**
- `RootRedirect.jsx` (NEW - 115 lines)
- `App.jsx` - Route `/` uses RootRedirect
- `GoogleSignInButton.jsx` - Default redirectTo `/` + account picker

**Common Pitfalls (❌ NIKDY):**
1. Duplicate auth checks v každé stránce
2. Hook-based auth guards (use components!)
3. Vocative na všechna jména (jen první!)
4. Manual loading state management (use Context!)
5. Ignorovat auto-redirect logic

---

## 📁 DŮLEŽITÉ SOUBORY

**Kritické - NIKDY nemazat:**
- `/src/styles/borderRadius.js` - Border-radius systém
- `/src/shared/styles/modernEffects.js` - Glassmorphism funkce
- `/src/shared/styles/responsive.js` - Responsive utilities (createTextEllipsis)
- `/src/shared/constants/icons.js` - 🎨 Icon system (Session #13, 88 lines)
- `/src/shared/components/cards/BaseCard.jsx` - ⚠️ FOUNDATION pro všechny karty (Program, Material, Client)
- `/src/shared/components/FloatingMenu.jsx` - Settings menu
- `/src/shared/components/NavigationFloatingMenu.jsx` - Navigace
- `/src/shared/context/NotificationContext.jsx` - Toast systém
- `/src/shared/context/ClientAuthContext.jsx` - ⭐ Client auth state (NEW 6.11.2025)
- `/src/shared/components/ClientAuthGuard.jsx` - ⭐ Route protection (NEW 6.11.2025)
- `/src/shared/utils/czechGrammar.js` - ⭐ Vocative case utility (NEW 6.11.2025)
- `/src/shared/utils/sessions.js` - ⭐ Session management (Session #12, 402 lines)
- `/src/shared/utils/photoStorage.js` - ⭐ Photo operations (Session #12)
- `/src/shared/utils/imageCompression.js` - ⭐ WebP compression (Session #12)
- `/src/modules/coach/utils/storage.js` - LocalStorage + Supabase
- `/src/modules/coach/utils/supabaseStorage.js` - Supabase upload/delete
- `/src/modules/coach/components/coach/MaterialCardSkeleton.jsx` - 8-row loading pattern

**Dokumentační:**
- `CLAUDE.md` - Kompletní dokumentace (10,000+ řádků)
- `CLAUDE_QUICK.md` - Tento soubor
- `CONTEXT_QUICK.md` - Aktuální kontext
- `summary6.md` - Changelog (6.11.2025) ⭐
- `MASTER_TODO_V3.md` - TODO list (archived)
- `MASTER_TODO_V4.md` - TODO list (AKTUÁLNÍ) ⭐

---

## 🎨 QUICK PATTERNS

### Glassmorphism Dialog:
```javascript
import { createBackdrop, createGlassDialog } from '@shared/styles/modernEffects';
import BORDER_RADIUS from '@styles/borderRadius';

<Dialog
  BackdropProps={{ sx: createBackdrop() }}
  PaperProps={{ sx: createGlassDialog(isDark, BORDER_RADIUS.dialog) }}
>
```

### Toast Notification:
```javascript
import { useNotification } from '@shared/context/NotificationContext';
const { showSuccess, showError } = useNotification();

showSuccess('Hotovo!', 'Akce byla úspěšná');
showError('Chyba', 'Něco se pokazilo');
```

### QuickTooltip:
```javascript
import QuickTooltip from '@shared/components/AppTooltip';

<QuickTooltip title="Popis akce">
  <IconButton onClick={handleClick}>
    <Icon size={18} />
  </IconButton>
</QuickTooltip>
```

### Skeleton Loader (8-row pattern):
```javascript
// MaterialCardSkeleton pattern - lze adaptovat pro Program/Client
<Card sx={{ minHeight: 280, borderRadius: BORDER_RADIUS.card }}>
  <CardContent sx={{ p: 3, pr: 2.5 }}>
    {/* Row 1: Icons (large left + 4 action right) */}
    <Box display="flex" justifyContent="space-between" mb={1.5}>
      <Skeleton variant="circular" width={40} height={40} />
      <Box display="flex" gap={0.75}>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} variant="circular" width={22} height={22} />
        ))}
      </Box>
    </Box>

    {/* Rows 2-8: Chip, Metadata, URL, Title, Desc, Taxonomy, Button */}
    {/* See MaterialCardSkeleton.jsx pro full pattern */}
  </CardContent>
</Card>
```

### Responsive Button Padding:
```javascript
// Inline solution pro responsive buttons
sx={{
  px: { xs: 2, sm: 3 },   // 16px → 24px
  py: { xs: 0.75, sm: 1 }  // 6px → 8px
}}
```

### Autocomplete Duplicate Keys Fix:
```javascript
// ✅ Používat getOptionKey pro unique keys
<Autocomplete
  options={clients}
  getOptionLabel={(option) => option.name || ''}
  getOptionKey={(option) => option.id}  // ← Fix duplicate keys!
  isOptionEqualToValue={(option, value) => option.id === value.id}
/>
```

### DialogTitle Typography Nesting:
```javascript
// ✅ component="div" předchází HTML nesting warnings
<DialogTitle>
  <Typography component="div" variant="h6">Title</Typography>
  <Typography component="div" variant="body2">Subtitle</Typography>
</DialogTitle>
```

### Mailto Link Pattern:
```javascript
const handleEmail = () => {
  const subject = encodeURIComponent('Subject');
  const body = encodeURIComponent('Body\nWith newlines');
  const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
  window.location.href = mailtoLink;  // Opens email client
};
```

### Czech Vocative Case (5. pád):
```javascript
// ✅ Extract ONLY first name and apply vocative
const getVocative = (fullName) => {
  if (!fullName) return '';

  // Extract first name only (Lenka Penka Podkolenka → Lenka)
  const firstName = fullName.trim().split(' ')[0];

  // Ženská jména končící na -a → -o (Jana → Jano, Lenka → Lenko)
  if (firstName.endsWith('a') && firstName.length > 1) {
    return firstName.slice(0, -1) + 'o';
  }

  return firstName;
};

// Usage: Vítejte zpět, {getVocative(name)}!
```

### Google OAuth Name Priority:
```javascript
// ✅ VŽDY prioritizovat Google name nad DB name
const googleName = user.user_metadata?.full_name || user.user_metadata?.name || '';

// Use Google name if available, fallback to profile name
setName(googleName || existingProfile.name || '');
```

---

### 19. 🔐 GUARDS NESMÍ MODIFIKOVAT DATABÁZI - KRITICKÉ!

**⚠️ NOVÉ PRAVIDLO (9.11.2025)** - **KLÍČOVÁ LEKCE ZE SESSION #11**

**Problem**: TesterAuthGuard volal `saveCoach()` a **přepisoval databázi** při každém načtení stránky!

**PRAVIDLO - Guards jsou READ-ONLY:**

```javascript
// ❌ NIKDY zapisovat do databáze v guardu
useEffect(() => {
  const coachUser = {
    isAdmin: false,  // ← Hardcoded! Přepisuje admin status
    testerId: profile.id,  // ← Google ID místo DB ID
  };
  await saveCoach(coachUser);  // ← PŘEPISUJE DATABÁZI! ❌❌❌
}, [user, profile]);

// ✅ VŽDY jen číst z DB a ukládat do localStorage
useEffect(() => {
  const coaches = await getCoaches();  // ✅ READ from DB
  const existingCoach = coaches.find(c => c.email === profile.email);

  if (existingCoach) {
    // ✅ Preserve ALL values from database
    const coachUser = {
      isAdmin: existingCoach.is_admin,  // ✅ From DB
      testerId: existingCoach.tester_id,  // ✅ From DB
      // ... all other fields from DB
    };
    setCurrentUser(coachUser);  // ✅ localStorage ONLY!
  }
}, [user, profile]);
```

**Co se stalo v Session #11**:
1. Po migraci Koučovacích Karet (Session #10) se rozbila autentizace
2. Admin status se měnil `true` → `false` při každém refreshi
3. Tester ID se měnil `UUID` → `NULL`
4. Guard běžel 3x za sebou → 3x přepsal databázi!

**Root cause**: Guard volal `saveCoach()` → UPSERT do Supabase!

**Separation of Concerns**:
- **Guard** = Kontrola autentizace (READ ONLY)
- **Context** = Načítání a synchronizace dat (CAN WRITE)

**NIKDY**:
- ❌ Guard nesmí volat `saveCoach()`, `saveMaterial()`, atd.
- ❌ Guard nesmí měnit databázová data
- ❌ Guard nesmí mít side-effects kromě redirectů

**VŽDY**:
- ✅ Guard jen čte z DB
- ✅ Guard ukládá do localStorage (session)
- ✅ Guard redirectuje pokud auth fails

---

### 20. 🏗️ GENERIC COMPONENTS - DRY Principle

**⚠️ NOVÉ PRAVIDLO (9.11.2025)** - **REFACTORING PATTERN ZE SESSION #11**

**Problem**: 95% duplicitní kód mezi TesterAuthContext a ClientAuthContext (462 řádků!)

**PRAVIDLO - Use Factory Pattern pro duplicitní logiku:**

**Before** (462 řádků duplicity):
```javascript
// TesterAuthContext.jsx - 145 řádků
const loadAuth = async () => { /* 70 lines of auth logic */ };
const refreshProfile = async () => { /* 30 lines */ };
// ...

// ClientAuthContext.jsx - 115 řádků
const loadAuth = async () => { /* 70 lines STEJNÝ KÓD! */ };
const refreshProfile = async () => { /* 30 lines STEJNÝ KÓD! */ };
// ...
```

**After** (379 řádků total, včetně generic):
```javascript
// GenericAuthContext.jsx - 170 řádků (eliminuje 260 řádků duplikace)
export function createAuthContext({
  contextName,      // "TesterAuth" | "ClientAuth"
  tableName,        // "testers" | "coachpro_client_profiles"
  allowMissing,     // true = maybeSingle(), false = single()
  onProfileLoaded   // Optional callback
}) {
  // ... shared logic
  return { AuthContext, useAuth, AuthProvider };
}

// TesterAuthContext.jsx - 40 řádků (-72%)
const { useAuth, AuthProvider } = createAuthContext({
  contextName: 'TesterAuth',
  tableName: 'testers',
  allowMissing: true,
  onProfileLoaded: loadCoachSession  // Special callback for coaches
});

// ClientAuthContext.jsx - 12 řádků (-90%)
const { useAuth, AuthProvider } = createAuthContext({
  contextName: 'ClientAuth',
  tableName: 'coachpro_client_profiles',
  allowMissing: false,
  onProfileLoaded: null
});
```

**Benefits**:
- **-73% kódu** na údržbu (462 → 125 řádků)
- **1x místo 2x** - změny v auth logice jen na jednom místě
- **Snadné přidání** nových auth typů (Coach OAuth, Admin OAuth)
- **DRY principle** dodržen

**Pattern aplikován na**:
1. ✅ AuthContext (GenericAuthContext.jsx)
2. ✅ AuthGuard (GenericAuthGuard.jsx)

**Files**:
- `GenericAuthContext.jsx` - 170 lines (factory)
- `GenericAuthGuard.jsx` - 87 lines (base component)
- `TesterAuthContext.jsx` - 40 lines (was 145)
- `ClientAuthContext.jsx` - 12 lines (was 115)
- `TesterAuthGuard.jsx` - 35 lines (was 125)
- `ClientAuthGuard.jsx` - 35 lines (was 77)

---

### 21. ⚡ RACE CONDITIONS - Single useEffect Pattern

**⚠️ NOVÉ PRAVIDLO (9.11.2025)** - **BUG FIX ZE SESSION #11**

**Problem**: 2 useEffects běžící paralelně → data not available when needed

**Before** (race condition):
```javascript
// useEffect #1 - Load session (async)
useEffect(() => {
  loadCoachSession();  // Asynchronní operace
}, [user, profile]);

// useEffect #2 - Check auth (sync)
useEffect(() => {
  const currentUser = loadFromStorage();  // Běží PŘED dokončením #1!
  if (!currentUser) navigate('/login');
}, [loading, user, profile]);
```

**Problem**: useEffect #2 běží PŘED tím, než useEffect #1 dokončí → `currentUser` je `null`!

**PRAVIDLO - Merge multiple useEffects into one:**

```javascript
// ✅ SPRÁVNĚ - Single useEffect s proper sequencing
useEffect(() => {
  let isMounted = true;  // ← Cleanup flag

  const handleAuth = async () => {
    if (loading) return;

    // 1. Load session FIRST (async)
    if (user && profile) {
      await loadCoachSession();  // ← Wait for completion
    }

    // 2. Check auth AFTER loading (sync)
    if (!isMounted) return;  // ← Cleanup check

    const currentUser = loadFromStorage();
    if (!user && !currentUser) {
      navigate('/login');
    }
  };

  handleAuth();

  return () => {
    isMounted = false;  // ← Cleanup on unmount
  };
}, [loading, user, profile]);
```

**Key Patterns**:
1. **`isMounted` flag** - Prevents setState after unmount
2. **Async wrapper** - `const handleAuth = async () => {}`
3. **Sequential execution** - await before checks
4. **Cleanup return** - `return () => { isMounted = false }`

**Benefits**:
- ✅ No race conditions
- ✅ Proper data availability
- ✅ No memory leaks
- ✅ Predictable execution order

---

## 📊 AKTUÁLNÍ STAV (10.11.2025)

**Session**: Modular Icon System & Code Cleanup (#13) 🎨
**Status**: ✅ COMPLETED
**Branch**: `fix/client-route-consolidation` (pokračování)

**Dokončeno v této session (#13)** 🎨:
- ✅ **Modular Icon System**
  - icons.js - Centralized icon configuration (88 lines)
  - 4 categories: NAVIGATION, SETTINGS, DASHBOARD, STATS
  - Updated 5 components to use centralized icons
  - Icon consistency: Library (materials), Folder (programs), Layers (cards)
- ✅ **Code Cleanup**
  - Removed console.error from ClientDashboard.jsx
  - Fixed 3 icon bugs (wrong icons in cards and pages)
  - Clean code, production-ready
- ✅ **Documentation**
  - summary13.md (complete session documentation)
  - Updated CLAUDE.md, MASTER_TODO_V4.md, MASTER_TODO_priority.md, CLAUDE_QUICK.md, CONTEXT_QUICK.md

**Session**: Session Management & Photo Upload (#12) 📸
**Status**: ✅ COMPLETED

**Dokončeno v této session (#12)** 📸:
- ✅ **Photo Upload System (Modular)**
  - imageCompression.js - WebP compression utilities
  - photoStorage.js - Supabase Storage operations
  - PhotoUpload.jsx - Reusable component
  - Storage bucket: client-photos + RLS policies
- ✅ **Extended Client Profile**
  - Photo upload v headeru
  - 7 new fields (timezone, preferred_contact, client_notes, coach_id, etc.)
  - Coach info display
  - Vocative case fix v RoleSelector
- ✅ **Session Management (Fully Modular!)**
  - sessions.js utils (402 lines, complete CRUD + formatters)
  - SessionCard component (universal client/coach)
  - ClientDashboard session widget
  - ClientSessions page (upcoming/past tabs)
  - Database: coachpro_sessions table + trigger + indexes
- ✅ **Security Fixes (3 issues)**
  - Security Definer → Invoker (client_next_sessions view)
  - RLS enabled for email_verification_tokens
  - RLS enabled for password_reset_tokens
- ✅ **Bug Fixes (5 issues)**
  - Photo state sync (useEffect fix)
  - 406 error (.single() → array response)
  - Embedded resources (separate queries)
  - Migration constraints (DO blocks)
  - Token table policies (user_id vs email)
- ✅ **Documentation**
  - summary12.md (334 lines)
  - claude.md updated (495 lines)
  - MASTER_TODO_V4.md updated
  - MASTER_TODO_priority.md updated

**Session**: Authentication Refactoring & Bug Fixes (#11) 🔐
**Status**: ✅ COMPLETED

**Předchozí session (#10, 8.11.2025)**:
- ✅ Koučovací Karty System
- ⚠️ Po migraci se rozbila autentizace!

**Dokončeno v této session (#10)** 🎴:
- ✅ **Database Migration (Supabase)**
  - Created `coachpro_cards_v2` (18 seed karet - Deck A)
  - Created `coachpro_card_notes_v2` (poznámky klientek)
  - RLS policies: Public read (karty), Client-scoped (poznámky)
  - Safe migration: Staré tabulky zachovány jako backup
- ✅ **Frontend - Modular Card System**
  - DeckSelector.jsx - Step 1: Výběr balíčku (A/B/C/D)
  - MotifSelector.jsx - Step 2: Výběr motivu (Člověk/Příroda/Abstrakt/Mix)
  - CardGrid.jsx - Step 3: Shuffleable grid s lazy loading
  - CardFlipView.jsx - Step 4: 3D flip + poznámky
  - CoachingCardsPage.jsx - Main orchestrator + Supabase integration
- ✅ **Visual Enhancements**
  - CSS filtry pro B&W obrázky (sepia, duotone podle motivu)
  - Watermark system (CoachProApp + © online-byznys.cz)
  - Glassmorphism efekty + barevné gradienty
- ✅ **Technical Fixes**
  - Type mismatch: client_id TEXT → UUID
  - Deck case sensitivity: 'deck-a' → 'A'
  - Logo watermark: obrázek → text (čitelnější)
  - Baseline alignment: flex container pro perfect align
- ✅ **Documentation**
  - summary10.md (620+ lines)
  - SUPABASE_CARDS_CHECKLIST.md (step-by-step guide)
  - public/images/karty/README.md (WebP upload guide)
  - MASTER_TODO_priority.md (user's TOP priority)

**Files Created (11 files)**:
- `supabase/migrations/20251108_03_create_cards_v2_safe.sql` (bezpečná migrace)
- `src/shared/constants/cardDeckThemes.js` (barevné schémata)
- `src/shared/constants/cardImageFilters.js` (CSS filtry)
- `src/shared/components/cards/DeckSelector.jsx`
- `src/shared/components/cards/MotifSelector.jsx`
- `src/shared/components/cards/CardGrid.jsx`
- `src/shared/components/cards/CardFlipView.jsx`
- `src/modules/coach/pages/CoachingCardsPage.jsx`
- `SUPABASE_CARDS_CHECKLIST.md`
- `public/images/karty/README.md`
- `MASTER_TODO_priority.md`

**Files Modified (2 files)**:
- `src/modules/coach/pages/CoachDashboard.jsx` (route na CoachingCardsPage)
- `src/shared/constants/cardDeckThemes.js` (deck values fix)

**Předchozí session (#8, 8.11.2025)**:
- ✅ DashboardOverview.jsx - Personalized greeting fix
- ✅ RLS Security Audit (identified CRITICAL vulnerability)
- ✅ Migration plan prepared (summary8.md)

**Předchozí sessions (6.11.2025)**:
- ✅ Google OAuth Cleanup & Smart Client Flow
- ✅ RootRedirect.jsx (universal OAuth entry point)
- ✅ ClientAuthContext/Guard implementation

**Tech Debt**:
- ⚠️ MaterialCard.jsx NEpoužívá BaseCard (zůstává standalone)

**Pending (Sprint 6a - Klientské Rozhraní)**:
- [ ] Materials page (`/client/materials`)
- [ ] Coaches directory (`/coaches`)
- [ ] Help page integration

**Pending (Other)**:
- [ ] Test production OAuth flow
- [ ] MaterialCard refactor na BaseCard (Sprint 18c)
- [ ] Button Modularity System (Sprint 18b, 6-8 hodin)
- [ ] Spustit migraci `20250105_05_add_client_id_to_shared_decks.sql`
- [ ] Client interface pro coaching karty
- [ ] Natálka OAuth access (Sprint 2a.4, LOW priority)

**Tech Stack**: React 18, MUI v6, Vite, Supabase
**Status**: ✅ V PRODUKCI na Supabase (od 3.11.2025)
**Dev Server**: `http://localhost:3000/`
**Production**: `https://coachpro-weld.vercel.app/`

**Next Step**: Deploy to production → Test RLS filtering

---

## 🚀 PRO RYCHLOU PRÁCI

1. **Vždy začni checklistem** - 6 modulárních systémů
2. **Podívej se na MaterialCard.jsx** - jak to implementuje?
3. **Používej path aliases**
4. **Testuj v obou režimech** - light + dark
5. **Dokumentuj změny** - summary.md, MASTER_TODO_V3.md

---

**Pro full dokumentaci**: Čti `CLAUDE.md` (ale JEN když potřebuješ detaily o konkrétním sprintu!)
**Pro sprint history**: Čti `summary.md`
**Pro aktuální kontext**: Čti `CONTEXT_QUICK.md`
**Pro TODO**: Čti `MASTER_TODO_V3.md`

---

## 🔐 Google OAuth Integration (5.1.2025)

**Status**: ✅ DOKONČENO

### Critical Fixes Applied

**Bug #1: SQL Migration Order**
- Problem: Migration #2 referencovala sloupec z migration #3
- Fix: Změněno pořadí 1→3→2 místo 1→2→3

**Bug #2: UUID vs TEXT Casting**
- Problem: `auth.uid()` (UUID) vs `coach_id` (TEXT) nešel porovnat
- Fix: Explicit cast `auth.uid()::text` v obou migracích

### OAuth + Fallback Architecture

**OAuth Flow**:
- ClientSignup → Google OAuth
- ClientProfile → Data entry  
- ClientEntry → 6-digit code → Linked via auth_user_id

**Fallback Flow**:
- ClientEntry → 6-digit code → Optional name → No auth_user_id

**Key**: Nullable `auth_user_id` v `coachpro_clients` podporuje oba režimy.

### Files Changed
- `20250105_03_add_auth_to_clients.sql` - UUID cast
- `20250105_02_create_client_profiles.sql` - UUID cast
- `ClientEntry.jsx` - OAuth check + linking (67 lines)

**Next**: Production testing, UX improvements

---

## 🔒 RLS Security (6.1.2025) - CRITICAL LESSONS

**Status**: ✅ ENABLED v production (after near-disaster!)

### ⚠️ CRITICAL: RLS ENABLE vs CREATE POLICY

**THE BUG**:
```sql
-- ❌ THIS DOES **NOTHING** WITHOUT ENABLE!
CREATE POLICY "xyz" ON table USING (...);

-- ✅ CORRECT - ENABLE is MANDATORY!
CREATE POLICY "xyz" ON table USING (...);
ALTER TABLE table ENABLE ROW LEVEL SECURITY;
```

**What happened**:
1. Created granular policies (`20250106_04_restore_proper_rls.sql`)
2. **FORGOT TO ENABLE RLS** (`rowsecurity = false`)
3. Policies were **ignored** - database **completely unprotected**!
4. User caught it: "ještě že mě máš, viď?" - saved production!

**Fix**: `20250106_05_enable_rls.sql`

### RLS Verification Checklist (ALWAYS Before Production)

```sql
-- 1. Check RLS is ENABLED
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'xyz';
-- Must show: rowsecurity = true

-- 2. Check policies exist
SELECT * FROM pg_policies WHERE tablename = 'xyz';

-- 3. Test query as user
-- Try SELECT in Supabase SQL editor as client
```

### Current RLS Status

✅ **PROTECTED**:
- `coachpro_client_profiles` - RLS ENABLED
- `testers` - RLS ENABLED (admin-only)

❌ **UNPROTECTED** (HIGH PRIORITY TODO):
- `coachpro_coaches` - NO RLS
- `coachpro_programs` - NO RLS
- `coachpro_materials` - NO RLS
- `coachpro_clients` - NO RLS

**Action**: Když implementujeme Coach OAuth, MUSÍME přidat RLS policies!

---

## 🛡️ Admin-Only Features - 2-Level Security

**Pattern** (from TesterManagement.jsx):

```javascript
// Level 1: UI Hiding (NavigationFloatingMenu.jsx)
const currentUser = getCurrentUser();
const isAdmin = currentUser?.isAdmin === true;
const menuItems = isAdmin ? [...base, ...admin] : base;

// Level 2: Route Guard (Component)
useEffect(() => {
  if (!isAdmin) {
    showError('Přístup odepřen', 'Admin only');
    navigate('/coach/dashboard', { replace: true });
  }
}, [isAdmin]);

// Return null during redirect
if (!isAdmin) return null;
```

**Why 2 levels**:
- UI hiding = UX (don't show unavailable options)
- Route guard = Security (prevent direct URL access)
- **Never trust frontend alone**!

**Admin Detection**:
- Set in `AdminLogin.jsx`: `{ ...user, isAdmin: true }`
- Check with: `currentUser?.isAdmin === true`

---

## 📝 firstName/lastName Split (Czech Vocative)

**Problem**: Czech vocative (5. pád) needs ONLY first name:
- "Lenka Penka Podkolenka" → "Lenko" (NOT "Lenko Penko Podkolinko")

**Pattern**:
```javascript
// Form - 2 fields
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');

// DB - combined
const fullName = `${firstName.trim()} ${lastName.trim()}`;

// Email - ONLY firstName
name: firstName.trim() // For personal greeting
```

**Applied to**:
- ✅ TesterSignup.jsx
- ✅ Client profiles (via czechGrammar.js)
- ⏳ Future: Coach profiles

---

---

### 17. 🔍 SUPABASE LOOKUPS - .maybeSingle() Pattern

**⚠️ NOVÉ PRAVIDLO (7.11.2025)**

**Problem**: `.single()` throws 406 error when no rows found → scary errors v konzoli

**PRAVIDLO - Share code lookups = ALWAYS `.maybeSingle()`:**

```javascript
// ❌ NIKDY .single() pro optional lookups
const { data, error } = await supabase
  .from('coachpro_programs')
  .select('*')
  .eq('share_code', code)
  .single();  // ❌ Throws error if 0 rows!

// ✅ VŽDY .maybeSingle() pro lookups
const { data, error } = await supabase
  .from('coachpro_programs')
  .select('*')
  .eq('share_code', code)
  .maybeSingle();  // ✅ Returns null if 0 rows, NO error

if (error) throw error;
if (!data) return null;  // ← Explicit null check!
return convertFromDB(data);
```

**When to use each**:
- `.single()` - When record MUST exist (fetch by ID)
- `.maybeSingle()` - When record MAY exist (lookup by share_code)

**Impact**: Clean console, professional UX, no false alarms

**Applied in**:
- `getProgramByCode()` - storage.js:576
- `getSharedMaterialByCode()` - storage.js:891
- Future: Apply pattern to all share_code lookups

---

### 18. 🛤️ ROUTE CONSOLIDATION - Single Canonical Route

**⚠️ NOVÉ PRAVIDLO (7.11.2025)**

**Problem**: Duplicitní routes (`/client` + `/client/entry`) → confusion, maintenance

**PRAVIDLO - ONE route per resource:**

```javascript
// ❌ NIKDY duplicate routes
<Route path="/" element={<Client />} />
<Route path="/entry" element={<Client />} />  // ← REMOVE!

// ✅ VŽDY single canonical route
<Route path="/" element={<Client />} />

// All navigations use ONLY canonical route:
navigate('/client');  // ✅
navigate('/client/entry');  // ❌ NO!
```

**Benefits**:
- Simpler mental model
- Less maintenance
- No URL confusion
- Better SEO (no duplicate content)

**Applied**: Removed `/client/entry` (8 replacements, 5 files)

---

**Poslední update**: 8. listopadu 2025, odpoledne (Session #9)
**Status**: Production-safe ✅ (RLS security fixed, multi-admin support added)
