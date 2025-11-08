# ⚡ Quick Context pro Auto-Compact Sessions

> **Účel**: Rychlý přehled pro Claude při auto-compactu, aby nemusel číst velké soubory

---

## 📚 DŮLEŽITÉ: Nová dokumentační struktura

**Pro rychlou práci**: Čti `CLAUDE_QUICK.md` (400+ řádků) místo CLAUDE.md (9000+ řádků)!

**Dokumentace:**
- `CLAUDE_QUICK.md` - Kritická pravidla, quick patterns (ZAČNI TADY!)
- `CLAUDE.md` - Kompletní historie (JEN když potřebuješ detaily)
- `summary9.md` - Changelog Session #9 (8.11.2025 odpoledne) ⭐ NOVÝ!
- `summary8.md` - Changelog Session #8 (8.11.2025 odpoledne)
- `summary7.md` - Changelog (6.11.2025 večer)
- `summary6.md` - Changelog (6.11.2025 ráno)
- `MASTER_TODO_V3.md` - TODO list (archived)
- `MASTER_TODO_V4.md` - TODO list (AKTUÁLNÍ) ⭐

---

## 🎯 Aktuální Práce (8.11.2025, odpoledne - Session #9)

**Aktuální task**: RLS Security & Multi-Admin Fix
**Status**: ✅ COMPLETED
**Branch**: `fix/rls-security-auth-user-id` (merged to main)

### Co bylo hotové v TÉTO session (8.11.2025 odpoledne):

**1. CRITICAL RLS Security Fix ✅ 🔥**
- Problem: Testers viděli materiály/programy od VŠECH koučů
- Root Cause: RLS policies `USING (true)` - permissive, žádné filtrování
- Solution:
  - Migration #1: Added `auth_user_id UUID` column to coachpro_coaches
  - Migration #2: Fixed RLS policies with coach-scoped filtering
  - Pattern:
    ```sql
    USING (
      -- Admins see everything
      EXISTS (
        SELECT 1 FROM coachpro_coaches
        WHERE id = (SELECT id FROM coachpro_coaches WHERE auth_user_id = auth.uid() LIMIT 1)
        AND is_admin = true
      )
      OR
      -- Regular coaches see only their own
      coach_id IN (
        SELECT id FROM coachpro_coaches WHERE auth_user_id = auth.uid()
      )
    )
    ```
- Benefit: Coaches see ONLY their own data, admins see all ✅

**2. Multi-Admin Support ✅**
- Problem: Only `lenna@online-byznys.cz` worked as admin (hardcoded)
- Solution:
  - AdminLogin.jsx: `ADMIN_EMAIL` → `ADMIN_EMAILS` array
  - RootRedirect.jsx: Dynamic check via `auth_user_id` + `is_admin` flag
- Benefit: Unlimited admin accounts via database configuration ✅

**3. AdminLogin.jsx Bug Fix ✅**
- Problem: Admin login overwrote `isTester` and `testerId` fields
- Solution: Added tester profile check, preserved existing fields
- Pattern:
  ```javascript
  const { data: testerProfile } = await supabase
    .from('testers').select('id').eq('email', email).maybeSingle();

  const adminUser = {
    ...existingCoach,
    auth_user_id: authData.user.id,
    isAdmin: true,
    isTester: existingCoach?.is_tester || !!testerProfile,
    testerId: existingCoach?.tester_id || testerProfile?.id || null,
  };
  ```
- Benefit: Admins who are also testers retain both roles ✅

**4. DashboardOverview.jsx Context Error Fix ✅**
- Problem: `useTesterAuth must be used within TesterAuthProvider` crash
- Solution: Added try-catch wrapper with localStorage fallback
- Files: DashboardOverview.jsx (lines 29-39)
- Benefit: No crash when Context unavailable ✅

**5. TesterAuthGuard.jsx Enhancement ✅**
- Problem: OAuth testers didn't have `auth_user_id` in coaches table
- Solution: Added useEffect to create coach record when OAuth user enters
- Files: TesterAuthGuard.jsx (lines 30-60)
- Benefit: Automatic linking for OAuth testers ✅

**6. Code Cleanup ✅**
- Removed 11+ debug console.log() calls
- Removed unnecessary comments
- Kept console.error() for error handling
- Files: storage.js, AdminLogin.jsx, TesterAuthGuard.jsx, RootRedirect.jsx

**7. Documentation Complete ✅**
- summary9.md (475 lines) - Full session documentation
- MASTER_TODO_V4.md - Marked Sprints 2a.1, 2a.2, 2a.3 as COMPLETED
- CLAUDE_QUICK.md, CONTEXT_QUICK.md - Updated (THIS file)

**Impact**:
- Security: ✅ CRITICAL VULNERABILITY FIXED (coaches see only own data)
- Multi-admin: ✅ Scalable admin system via database
- Bug fixes: ✅ AdminLogin preserves tester fields, DashboardOverview no crash
- Code quality: ✅ Clean, production-ready code (no debug logs)

### Co bylo hotové v předchozí mini-session (6.11.2025 pozdě večer):

**1. TesterSignup.jsx - Form Improvements**
- Split name: firstName/lastName (pro české oslovení)
- UI polish: Logo, centrované texty, modular button

**2. TesterManagement.jsx (NEW 310 řádků)** - Admin view
- Stats cards, search, table
- 2-level security (UI + route guard)

**3. RLS Security Restore** ⚠️ CRITICAL
- **BUG FOUND**: RLS disabled, policies ignored!
- Fix: Created policies + **ENABLE RLS**
- User caught it: "ještě že mě máš, viď?"

### Co bylo hotové v předchozí session (večer):

**1. ClientAuthContext.jsx (131 řádků)** - Centralized auth state
- Single source of truth (user + profile + loading)
- **67% reduction v DB queries** (6 → 2)
- Auto-refresh při auth state change
- displayName property (Google name > DB name)
- Provides: user, profile, loading, logout(), refreshProfile()

### Co bylo hotové v TÉTO session (večer):

**1. RootRedirect.jsx (115 řádků) - NOVÝ** - Universal OAuth entry point
- Auto-detects user role (client, coach, tester)
- Handles profile completion status
- Prepared for subscription checks
- Loading spinner + console logging

**2. Build Fix** - Import errors
- `getMaterialByCode` → `getSharedMaterialByCode` (fix)
- `getCardDeckByCode()` placeholder added (returns null)
- Files: Client.jsx, ClientWelcome.jsx, storage.js

**3. OAuth Improvements**
- Google account picker: `prompt: 'select_account'`
- Universal redirect: All OAuth → `/` (jen 2 URLs v Supabase!)
- Files: GoogleSignInButton.jsx, Client.jsx, ClientSignup.jsx

**4. RLS Fix (Nuclear)**
- Disabled RLS on client_profiles (temporary)
- SQL: `20250106_03_nuclear_fix_rls.sql`

**5. Subscriptions Table (Future)**
- Schema created for payment checks
- Helper functions ready
- SQL: `20250106_01_create_subscriptions_table.sql`

**6. Logout Icon**
- ArrowLeft (←) → Power (⏻) icon
- File: ClientWelcome.jsx

**2. ClientAuthGuard.jsx (76 řádků)** - Component-based route protection
- Props: requireProfile, redirectOnNoAuth, redirectOnNoProfile, showError
- Auto-handles loading state
- Declarative, visible v JSX

**3. czechGrammar.js (32 řádků)** - Shared utility
- getVocative() eliminates duplication ve 3 souborech
- Czech 5. pád (vocative case)
- **JEN PRVNÍ JMÉNO**: "Lenka Penka Podkolenka" → "Lenko"

**4. ClientWelcome.jsx (509 řádků)** - Welcome screen
- Personalized greeting s vocative case
- Code entry s auto-detection
- 4 action cards (Dashboard, Coaches, About)
- **Logout button** na šipce zpět

**5. ClientDashboard.jsx (287 řádků)** - Client zone
- 4 dashboard cards (Profile, Programs, Materials, About)
- FloatingMenu spacing (pr: 15)

**6. Refactored pages (5 souborů)**:
- ClientProfile.jsx - removed 50+ řádků duplicate logic
- Client.jsx - auto-redirect když authenticated
- ClientView.jsx - wrapped routes v provider
- ClientSignup.jsx - redirect fix
- GoogleSignInButton.jsx - default redirect fix

**Impact**:
- Performance: 67% fewer DB queries ✅
- Code Quality: 90% reduction in duplication ✅
- UX: No repeated OAuth prompts ✅

### Předchozí sessions (6.11.2025):
- ✅ Google OAuth Cleanup & Smart Client Flow (ráno)
  - GoogleSignInButton.jsx, Client.jsx, ClientProfile.jsx
  - Czech vocative + Google name priority
  - URL cleanup (/client)

### Předchozí sessions (5.11.2025):
- ✅ Koučovací karty - Coach Interface
- ✅ Google OAuth integration
- ✅ MaterialCard Layout Reorganization
- ✅ BaseCard feedback modularity

### Tech Debt:
- ⚠️ MaterialCard.jsx NEpoužívá BaseCard (zůstává standalone)

### Předchozí session (#8, 8.11.2025 odpoledne):
- ✅ DashboardOverview.jsx - Personalized greeting fix (TesterAuthContext)
- ✅ RLS Security Audit - Identified CRITICAL vulnerability (permissive policies)
- ✅ Migration plan prepared (summary8.md)

---

## 🔐 RLS Security Pattern (Session #9) - KRITICKÉ!

**⚠️ NOVÉ PRAVIDLO (8.11.2025)**

**ALWAYS use coach-scoped RLS policies:**

```sql
-- ❌ NIKDY permissive policies
CREATE POLICY "Anyone can read materials"
ON coachpro_materials FOR SELECT
USING (true);  -- ❌ Everyone sees EVERYTHING!

-- ✅ VŽDY coach-scoped filtering + admin exception
CREATE POLICY "Coaches can read own materials"
ON coachpro_materials FOR SELECT TO authenticated
USING (
  -- Admins see everything
  EXISTS (
    SELECT 1 FROM coachpro_coaches
    WHERE id = (SELECT id FROM coachpro_coaches WHERE auth_user_id = auth.uid() LIMIT 1)
    AND is_admin = true
  )
  OR
  -- Regular coaches see only their own
  coach_id IN (
    SELECT id FROM coachpro_coaches WHERE auth_user_id = auth.uid()
  )
);
```

**auth_user_id Pattern:**

```javascript
// VŽDY save auth_user_id v coaches table
const coachData = {
  id: coach.id,
  auth_user_id: coach.auth_user_id || null, // ← CRITICAL for RLS
  name: coach.name,
  // ...
};
```

**Multi-Admin Pattern:**

```javascript
// ❌ NIKDY hardcoded email
const ADMIN_EMAIL = 'lenna@online-byznys.cz';
if (authUser.email === ADMIN_EMAIL) { ... }

// ✅ VŽDY database-driven
const { data: adminCheck } = await supabase
  .from('coachpro_coaches')
  .select('*')
  .eq('auth_user_id', authUser.id)
  .eq('is_admin', true)
  .maybeSingle();

if (adminCheck) {
  // User is admin
}
```

**Benefits:**
- ✅ Data security (coaches can't see others' data)
- ✅ Scalable admin system (unlimited admins)
- ✅ No hardcoded credentials
- ✅ Production-ready RLS

**Files:**
- `supabase/migrations/20250108_01_add_auth_to_coaches.sql` (NEW)
- `supabase/migrations/20250108_02_fix_materials_programs_rls.sql` (NEW)
- `storage.js` - saveCoach() includes auth_user_id
- `AdminLogin.jsx` - Multi-admin support, preserve tester fields
- `RootRedirect.jsx` - Dynamic admin check
- `TesterAuthGuard.jsx` - Creates coach record with auth_user_id

---

## 📁 Klíčové Soubory

### RLS Security & Multi-Admin (NEW 8.11.2025) 🔥
- ⭐ `/supabase/migrations/20250108_01_add_auth_to_coaches.sql` - auth_user_id column (NEW)
- ⭐ `/supabase/migrations/20250108_02_fix_materials_programs_rls.sql` - Coach-scoped RLS (NEW)
- ⭐ `/src/modules/coach/pages/AdminLogin.jsx` - Multi-admin support, preserve tester fields
- ⭐ `/src/shared/components/RootRedirect.jsx` - Dynamic admin check
- ⭐ `/src/shared/components/TesterAuthGuard.jsx` - OAuth auth_user_id linking
- ⭐ `/src/modules/coach/utils/storage.js` - saveCoach() with auth_user_id
- ⭐ `/src/modules/coach/components/coach/DashboardOverview.jsx` - Try-catch Context fix

### Client Auth System (NEW 6.11.2025) ⭐
- ⭐ `/src/shared/context/ClientAuthContext.jsx` - Auth state provider (131 řádků)
- ⭐ `/src/shared/components/ClientAuthGuard.jsx` - Route protection (76 řádků)
- ⭐ `/src/shared/utils/czechGrammar.js` - Vocative utility (32 řádků)
- ⭐ `/src/modules/coach/pages/ClientWelcome.jsx` - Welcome screen (509 řádků)
- ⭐ `/src/modules/coach/pages/ClientDashboard.jsx` - Client zone (287 řádků)

### Client Flow (OAuth + Kód)
- ✅ `/src/modules/coach/pages/Client.jsx` - Entry page + auto-redirect (440 řádků)
- ✅ `/src/modules/coach/pages/ClientProfile.jsx` - Profile form (refactored)
- ✅ `/src/shared/components/GoogleSignInButton.jsx` - OAuth button (134 řádků)
- ✅ `/src/modules/coach/utils/storage.js` - getMaterialByCode, getCardDeckByCode

### Komponenty s Help Systémem
- ✅ `/src/shared/constants/helpContent.js` - VYTVOŘENO (417 lines)
- ✅ `/src/shared/components/HelpDialog.jsx` - VYTVOŘENO (190 lines)
- ✅ `/src/modules/coach/components/coach/DashboardOverview.jsx` - Help button přidán
- ✅ `/src/modules/coach/components/coach/MaterialsLibrary.jsx` - Help button přidán
- ⏳ `/src/modules/coach/components/coach/ProgramsList.jsx` - ČEKÁ na help button
- ⏳ `/src/modules/coach/components/coach/ClientsList.jsx` - ČEKÁ na help button

### FloatingMenu
- `/src/shared/components/FloatingMenu.jsx` - Position: absolute, right: 16, top: 50%
- `/src/shared/components/Header.jsx` - FloatingMenu na řádku 138, prop onFloatingMenuToggle
- `/src/shared/components/Layout.jsx` - State floatingMenuOpen, glassmorphism backdrop

---

## 🐛 Známé Problémy

1. **DailyView.jsx line 962** - JSX closing tag error (PRE-EXISTING, nesouvisí s current work)

---

## 🔧 Modular Systems (VŽDY POUŽÍT!)

1. **BORDER_RADIUS** - `import BORDER_RADIUS from '@styles/borderRadius'`
2. **Glassmorphism** - `import { createBackdrop, createGlassDialog } from '@shared/styles/modernEffects'`
3. **QuickTooltip** - `import QuickTooltip from '@shared/components/AppTooltip'`
4. **Toast** - `import { useNotification } from '@shared/context/NotificationContext'`

---

## 📊 Help System Pattern

```javascript
// Import
import { IconButton, useTheme } from '@mui/material';
import { HelpCircle } from 'lucide-react';
import HelpDialog from '@shared/components/HelpDialog';
import QuickTooltip from '@shared/components/AppTooltip';

// State
const [helpDialogOpen, setHelpDialogOpen] = useState(false);
const theme = useTheme();
const isDark = theme.palette.mode === 'dark';

// Button (48x48px, CoachPro greens)
<QuickTooltip title="Nápověda k [Page Name]">
  <IconButton
    onClick={() => setHelpDialogOpen(true)}
    sx={{
      width: 48,
      height: 48,
      backgroundColor: isDark ? 'rgba(120, 188, 143, 0.15)' : 'rgba(65, 117, 47, 0.15)',
      color: isDark ? 'rgba(120, 188, 143, 0.9)' : 'rgba(65, 117, 47, 0.9)',
      transition: 'all 0.3s',
      '&:hover': {
        backgroundColor: isDark ? 'rgba(120, 188, 143, 0.25)' : 'rgba(65, 117, 47, 0.25)',
        transform: 'scale(1.05)',
      },
    }}
  >
    <HelpCircle size={24} />
  </IconButton>
</QuickTooltip>

// Dialog
<HelpDialog
  open={helpDialogOpen}
  onClose={() => setHelpDialogOpen(false)}
  initialPage="dashboard" // nebo "materials", "programs", atd.
/>
```

---

## 🎨 FloatingMenu Specs - Ultramoderní Design

**Position**: `absolute` v Header.jsx, `right: 16`, `top: '50%'`
**Sizes**: 48×48px buttons, 20px icons
**Tooltips**: QuickTooltip, placement="left" (ne bottom!)
**Menu Items**: User, Theme Toggle, Beta Info, Help, Logout

**Moderní Efekty (VŠECHNY ikony)**:
- Primary-secondary gradienty (green → pink)
- Shine animation (::before pseudo-element)
- Inset highlights (3D dojem)
- Border s theme colors
- Backdropfilter blur(10px)
- Scale 1.1× on hover + translateX(-4px)

**Glassmorphism Backdrop (když otevřené)**:
- V Layout.jsx jako direct child root Box (před Header/Sidebar)
- Fixed position, fullscreen
- Blur(8px) + kouřový efekt (radial gradienty)
- zIndex: 1200 (menu má 1300)
- pointerEvents: none
- State lifting: FloatingMenu → Header → Layout

**Backdrop Strip v Layout.jsx**:
- Width: 90px, jemný gradient pozadí
- Position: absolute, right: 0
- Main content má `pr: 15` (120px padding)

---

## 🚀 Rychlé Akce

**Zkontrolovat FloatingMenu tooltips**:
```bash
grep -n "QuickTooltip" src/shared/components/FloatingMenu.jsx
```

**Zkontrolovat MaterialLibrary padding**:
```bash
grep -n "px:" src/modules/coach/components/coach/MaterialsLibrary.jsx | head -5
```

---

## 💡 Pro Budoucí Claude

1. Přečti TENTO soubor NEJDŘÍV při auto-compactu
2. Pokud potřebuješ detaily, teprve pak čti velké soubory
3. CLAUDE.md má kompletní dokumentaci projektu (ale je 9000+ řádků)
4. summary.md má changelog (ale je také velký)

---

**Poslední update**: 6. ledna 2025, pozdě večer
**Autor**: Lenka + Claude Sonnet 4.5

---

## 🔐 Client Auth Pattern (NEW 6.11.2025)

### Context API Usage
```javascript
import { useClientAuth } from '@shared/context/ClientAuthContext';

const { user, profile, loading, logout, refreshProfile } = useClientAuth();

// user = Supabase OAuth user
// profile = DB profile s displayName (Google name > DB name)
// loading = boolean loading state
```

### Component Guard Pattern
```javascript
import ClientAuthGuard from '@shared/components/ClientAuthGuard';

// Requires profile
<ClientAuthGuard requireProfile={true}>
  <ClientWelcome />
</ClientAuthGuard>

// Only auth (profile creation)
<ClientAuthGuard requireProfile={false}>
  <ClientProfile />
</ClientAuthGuard>
```

### Czech Vocative Case
```javascript
import { getVocative } from '@shared/utils/czechGrammar';

// JEN PRVNÍ JMÉNO!
getVocative("Lenka Penka Podkolenka") // → "Lenko"
getVocative("Jana Nováková") // → "Jano"

// Usage:
<Typography>Vítejte zpátky, {getVocative(profile?.displayName || '')}!</Typography>
```

### Auto-redirect Logic
```javascript
// V entry pages (Client.jsx):
useEffect(() => {
  if (!loading && user && profile) {
    navigate('/client/welcome'); // Skip login ⭐
  }
}, [loading, user, profile, navigate]);
```

### Key Principles
1. ✅ Context API pro shared state (>2 components)
2. ✅ Component guards > Hook guards
3. ✅ displayName = Google name > DB name
4. ✅ Auto-redirect prevents repeated OAuth
5. ✅ Czech vocative = **JEN PRVNÍ JMÉNO** (.split(' ')[0])

---

## 🔐 OAuth Integration Update (5.11.2025)

**Features Added**:
- Google OAuth pro klientky
- Dual flow: OAuth + Fallback (code-based)
- `auth_user_id` nullable v `coachpro_clients`

**Client Profiles**:
```
coachpro_client_profiles:
- auth_user_id (UNIQUE)
- name, email, phone
- date_of_birth
- goals, health_notes
```

**RLS Policies**: Podporují OAuth i fallback

**Frontend**: ClientEntry.jsx checks OAuth status, links via auth_user_id

**Production**: ✅ Ready (SQL migrations run, Google OAuth configured)

---

## 🎴 Koučovací Karty - Key Patterns (5.11.2025)

### Autocomplete Duplicate Keys Fix
```javascript
<Autocomplete
  options={clients}
  getOptionLabel={(option) => option.name || ''}
  getOptionKey={(option) => option.id}  // ← DŮLEŽITÉ pro unique keys!
  isOptionEqualToValue={(option, value) => option.id === value.id}
/>
```

### DialogTitle Typography Nesting
```javascript
// ✅ SPRÁVNĚ - component="div" předchází HTML nesting warnings
<DialogTitle>
  <Typography component="div" variant="h6">Title</Typography>
  <Typography component="div" variant="body2">Subtitle</Typography>
</DialogTitle>
```

### Mailto Link Pattern
```javascript
const handleEmail = () => {
  const subject = encodeURIComponent('Subject');
  const body = encodeURIComponent('Body\nWith newlines');
  const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
  window.location.href = mailtoLink;
};
```

### Nullable Foreign Keys Design
```sql
-- Podporuje 2 režimy: registrovaná + nová klientka
ALTER TABLE coachpro_shared_card_decks
ADD COLUMN client_id TEXT REFERENCES coachpro_clients(id);  -- nullable!

-- Režim 1: client_id = "uuid-123", client_name = "Jana"
-- Režim 2: client_id = null, client_name = "Eva"
```

### Pending Tasks
- [ ] Spustit migraci `20250105_05_add_client_id_to_shared_decks.sql`
- [ ] Vložit obrázky karet do `/public/images/karty/`
- [ ] Client interface (ClientCardDeckEntry, ClientCardDeckView, CardViewer)
- [ ] Modularizace sdílení (Universal ShareModal pro materiály + programy + karty)


---

**Poslední update**: 8.11.2025, odpoledne (Session #9 - RLS Security & Multi-Admin Fix)
**Autor**: Lenka + Claude Sonnet 4.5
