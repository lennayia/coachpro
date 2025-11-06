# ⚡ CLAUDE QUICK - Kritická pravidla pro AI asistenta

> **Účel**: Rychlý přehled nejdůležitějších pravidel. Pro detaily viz CLAUDE.md

**Poslední update**: 6. listopadu 2025 (večer)
**Pro full dokumentaci**: Čti CLAUDE.md (ale JEN když potřebuješ detaily!)

---

## 🚨 KRITICKÁ PRAVIDLA - VŽDY DODRŽUJ

### 1. ⚠️ SUPABASE FOREIGN KEY CONSTRAINTS

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
- `/src/shared/components/cards/BaseCard.jsx` - ⚠️ FOUNDATION pro všechny karty (Program, Material, Client)
- `/src/shared/components/FloatingMenu.jsx` - Settings menu
- `/src/shared/components/NavigationFloatingMenu.jsx` - Navigace
- `/src/shared/context/NotificationContext.jsx` - Toast systém
- `/src/shared/context/ClientAuthContext.jsx` - ⭐ Client auth state (NEW 6.11.2025)
- `/src/shared/components/ClientAuthGuard.jsx` - ⭐ Route protection (NEW 6.11.2025)
- `/src/shared/utils/czechGrammar.js` - ⭐ Vocative case utility (NEW 6.11.2025)
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

## 📊 AKTUÁLNÍ STAV (6.11.2025, večer)

**Session**: Client Auth Modularity Refactor
**Commits**: 4 (0838433, 0a83633, f95abbf, c033ef1)
**Branch**: `client-flow-refactor` (4 commits ahead, not pushed)

**Dokončeno v této session**:
- ✅ ClientAuthContext.jsx - Centralized auth state (131 řádků)
  - 67% reduction v DB queries (6 → 2)
  - Single source of truth (user + profile + loading)
- ✅ ClientAuthGuard.jsx - Component-based route protection (76 řádků)
- ✅ czechGrammar.js - Vocative utility (32 řádků)
- ✅ ClientWelcome.jsx - Welcome screen + logout button (509 řádků)
- ✅ ClientDashboard.jsx - Client zone (4 cards, 287 řádků)
- ✅ Refactored 5 pages (ClientProfile, Client, ClientView, ClientSignup, GoogleSignInButton)
- ✅ Bug fix: CircularProgress import

**Předchozí sessions (6.11.2025)**:
- ✅ Google OAuth Cleanup & Smart Client Flow (ráno)
  - GoogleSignInButton.jsx (134 řádků)
  - Client.jsx (440 řádků)
  - ClientProfile.jsx 3-state UI (720 řádků)
  - Czech vocative + Google name priority

**Předchozí sessions (5.11.2025)**:
- ✅ Koučovací karty - Coach Interface (večer)
- ✅ Google OAuth integration (ráno)
- ✅ MaterialCard layout reorganization
- ✅ BaseCard feedback modularity

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

**Tech Stack**: React 18, MUI v6, Vite, Supabase
**Status**: ✅ V PRODUKCI na Supabase (od 3.11.2025)
**Dev Server**: `http://localhost:3000/`
**Production**: `https://coachpro-weld.vercel.app/`

**Next Step**: Push branch `client-flow-refactor` → Merge → Production testing

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
