# ⚡ CLAUDE QUICK - Kritická pravidla pro AI asistenta

> **Účel**: Rychlý přehled nejdůležitějších pravidel a aktuálního stavu projektu
> **Pro full dokumentaci**: Čti CLAUDE.md

**Poslední update**: 11. listopadu 2025 - Session #13
**Projekt**: CoachPro - Online Coaching Platform
**Tech Stack**: React 18 + Vite, Material-UI v6, Supabase, date-fns

---

## 🚨 KRITICKÉ - VŽDY ČTEŠ PRVNÍ!

### 1. 🔐 AUTH_USER_ID PROBLÉM (Session #13) - NEJVYŠŠÍ PRIORITA

**CRITICAL ISSUE:**
- 90% testerů nemá `auth_user_id` v databázi
- Důvod: Registrovali se formulářem, nevytvořil se Supabase Auth účet
- Impact: RLS je blokuje → nevidí materiály, nemohou přidat materiály (403 Forbidden)

**TROUBLESHOOTING:**
→ Čti `docs/TROUBLESHOOTING_AUTH.md` (350+ lines) při jakémkoliv auth problému!

**SYMPTOMY:**
- Uživatel nevidí materiály (prázdná stránka)
- 403 Forbidden při přidání materiálu
- Admin ztratil admin práva
- `auth_user_id` je NULL po přihlášení

**DIAGNOSTIKA (Quick):**
```javascript
// 1. Check sessionStorage
JSON.parse(sessionStorage.getItem('coachpro_currentUser'))

// 2. Check DB
SELECT id, email, auth_user_id, is_admin FROM coachpro_coaches WHERE email = '...';

// 3. Check auth.users
SELECT id, email FROM auth.users WHERE email = '...';
```

**KRITICKÉ SOUBORY (NIKDY NEDĚLAT CHYBY!):**

**`src/modules/coach/utils/storage.js:85-87`**
```javascript
// ✅ SPRÁVNĚ - Neruší is_admin
...(coach.isAdmin !== undefined && { is_admin: coach.isAdmin }),

// ❌ ŠPATNĚ - Přepisuje is_admin na false!
is_admin: coach.isAdmin || false,
```

**`src/modules/coach/pages/AdminLogin.jsx:97-98`**
```javascript
// MUSÍ být zavoláno pro uložení auth_user_id!
await saveCoach(adminUser);
```

**`src/modules/coach/pages/Tester.jsx:105-130`**
```javascript
// MUSÍ zahrnovat auth_user_id
const coachUser = {
  auth_user_id: authUserId,  // <-- CRITICAL!
  // ...
};
```

**NEXT STEP (VARIANTA A):**
1. Najít TesterSignup.jsx (registrační stránka)
2. Implementovat auto-vytváření auth účtu při registraci
3. Test + migrace existujících testerů
4. **Estimated:** 4-6 hodin
5. **Impact:** Opraví 90% problémů s materiály

---

## 🎯 FILOZOFIE PROJEKTU

### 1. MODULARITA JE KLÍČ
- **VŽDY** vytváříme reusable utility funkce
- **VŽDY** komponenty rozdělujeme na shared/specific
- **NIKDY** nereplikujeme logiku napříč soubory
- Pattern: `utils → components → pages`

### 2. CZECH FIRST
- Všechny UI texty v češtině
- date-fns s Czech locale (`cs`)
- Používat 5. pád (vocative) pro oslovení: `getVocative()`
- **ŽÁDNÉ emoji** v produkčním kódu (pokud user explicitně nežádá)

### 3. BEZPEČNOST
- **VŽDY** zapnout RLS pro nové tabulky
- **VŽDY** kontrolovat Security Advisor
- **RLS vyžaduje auth_user_id** - pokud NULL → blokuje přístup
- Views: Preferovat `security_invoker` over `security_definer`

### 4. SUPABASE BEST PRACTICES
- **NIKDY** `.single()` na prázdné tabulky → použij array + check length
- **NIKDY** embedded resources (`:` syntax) s RLS → separátní queries
- `.maybeSingle()` pro optional data (share code lookups)

---

## 🔧 KLÍČOVÉ UTILS (Modular Systems)

### 1. `icons.js` (88 lines) - Session #13
**Centralizovaný icon systém - Single Source of Truth**

```javascript
import { NAVIGATION_ICONS, DASHBOARD_ICONS, STATS_ICONS, SETTINGS_ICONS } from '@shared/constants/icons';

// Usage
const MaterialsIcon = NAVIGATION_ICONS.materials;  // Library
<MaterialsIcon size={40} />
```

**NIKDY direct imports** z lucide-react v pages/components!

### 2. `sessions.js` (402 lines) - Session #12
**Modular session management pro koučky i klientky**

```javascript
import { getNextSession, getClientSessions, createSession } from '@shared/utils/sessions';

const session = await getNextSession(clientId);
const upcoming = await getClientSessions(clientId, { upcoming: true });
```

**Key functions:**
- CRUD: `getNextSession`, `getClientSessions`, `createSession`, `cancelSession`, `completeSession`
- Formatters: `getTimeUntilSession`, `formatSessionDate`, `getSessionStatusLabel`

### 3. Photo Upload System (Session #12)
**3-layer system: compression → storage → component**

```javascript
// Layer 1: imageCompression.js
import { compressToWebP, validateImageFile } from '@shared/utils/imageCompression';

// Layer 2: photoStorage.js
import { uploadPhoto, PHOTO_BUCKETS } from '@shared/utils/photoStorage';

// Layer 3: PhotoUpload.jsx
<PhotoUpload
  photoUrl={url}
  onPhotoChange={setUrl}
  bucket={PHOTO_BUCKETS.CLIENT_PHOTOS}
  userId={user.id}
/>
```

### 4. Czech Grammar
```javascript
import { getVocative, getFirstName } from '@shared/utils/czechGrammar';

getVocative('Lenka') → 'Enko'
getFirstName('Lenka Roubalová') → 'Lenka'
```

---

## 🚫 NIKDY NEDĚLEJ

### 1. NO .single() ON EMPTY TABLES
```javascript
// ❌ ŠPATNĚ - 406 error na prázdné tabulce
.single()

// ✅ SPRÁVNĚ
.limit(1)
if (!data || data.length === 0) return null;
```

### 2. NO EMBEDDED RESOURCES WITH RLS
```javascript
// ❌ ŠPATNĚ
.select('*, coach:coaches(*)')

// ✅ SPRÁVNĚ - separátní queries
const sessions = await supabase.from('sessions').select('*');
const coaches = await supabase.from('coaches').select('*').in('id', ids);
// Map na klientovi
```

### 3. GUARDS ARE READ-ONLY
**NIKDY v guards:**
- Volat `saveCoach()`, `saveMaterial()`
- Modifikovat databázi
- Side effects (kromě redirects)

**VŽDY v guards:**
- Jen číst z DB
- Ukládat do localStorage
- Redirectovat pokud auth fails

### 4. NIKDY PŘEPISOVAT is_admin BEZ KONTROLY
```javascript
// ❌ NIKDY
is_admin: coach.isAdmin || false,

// ✅ VŽDY
...(coach.isAdmin !== undefined && { is_admin: coach.isAdmin }),
```

### 5. NIKDY HARDCODED HODNOTY
```javascript
// ❌ NIKDY
borderRadius: '20px'
import { Calendar } from 'lucide-react';

// ✅ VŽDY
import BORDER_RADIUS from '@styles/borderRadius';
import { NAVIGATION_ICONS } from '@shared/constants/icons';
borderRadius: BORDER_RADIUS.card
```

---

## 🎨 DESIGN SYSTEM

### Border Radius
```javascript
import BORDER_RADIUS from '@styles/borderRadius';

BORDER_RADIUS.compact  // 16px - Buttons, inputs
BORDER_RADIUS.card     // 20px - Cards
BORDER_RADIUS.premium  // 24px - Large elements
```

### Glassmorphism
```javascript
import { createBackdrop, createGlassDialog } from '@shared/styles/modernEffects';

<Dialog
  BackdropProps={{ sx: createBackdrop() }}
  PaperProps={{ sx: createGlassDialog(isDark, BORDER_RADIUS.dialog) }}
/>
```

### Toast Notifications
```javascript
import { useNotification } from '@shared/context/NotificationContext';
const { showSuccess, showError } = useNotification();

showSuccess('Hotovo!', 'Akce byla úspěšná');
showError('Chyba', 'Něco se pokazilo');
```

### Path Aliases
```javascript
✅ import BORDER_RADIUS from '@styles/borderRadius';
✅ import { useGlassCard } from '@shared/hooks/useModernEffects';
❌ import BORDER_RADIUS from '../../../styles/borderRadius';
```

---

## 🗄️ DATABASE SCHEMA (Kritické Tabulky)

### `coachpro_coaches`
```sql
- id (text, PK)
- auth_user_id (uuid, FK → auth.users) ⚠️ MŮŽE být NULL!
- name, email, phone
- is_admin (boolean) ⚠️ NIKDY nepřepisovat!
- is_tester (boolean)
- tester_id (uuid, FK → testers)
```

### `testers`
```sql
- id (uuid, PK)
- auth_user_id (uuid, FK → auth.users) ⚠️ MŮŽE být NULL!
- name, email, phone
- access_code (text, UNIQUE)
- is_active (boolean)
```

### `auth.users` (Supabase Auth)
```sql
- id (uuid, PK)
- email (text, UNIQUE)
- encrypted_password
```

### RLS Pattern
```sql
-- Pokud auth.uid() = NULL → RLS vrátí FALSE → BLOKUJE
USING (
  EXISTS (
    SELECT 1 FROM coachpro_coaches
    WHERE coachpro_coaches.id = coachpro_materials.coach_id
    AND coachpro_coaches.auth_user_id = auth.uid()
  )
)
```

---

## 🔄 WORKFLOW

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
2. Check `docs/TROUBLESHOOTING_AUTH.md` (pokud auth related)
3. Debuguj s console.log
4. Fix v utils/components
5. Verify fix
6. Remove debug logs
7. Commit

### 3. Auth Problém
1. **VŽDY** čti `docs/TROUBLESHOOTING_AUTH.md` PRVNÍ!
2. Check auth_user_id v DB
3. Verify RLS policies
4. Check AdminLogin.jsx, Tester.jsx, storage.js
5. Test as authenticated user

---

## 📊 AKTUÁLNÍ STAV (11.11.2025)

### Session #13 ✅ - Authentication Analysis & Troubleshooting
**Dokončeno:**
- Auth system analysis (3 typy)
- `docs/TROUBLESHOOTING_AUTH.md` (350+ lines)
- `docs/summary13.md` (kompletní dokumentace)
- Plán VARIANTA A
- Updated CLAUDE.md, MASTER_TODO_V4.md, MASTER_TODO_priority.md

### Session #12 ✅ - Session Management & Photo Upload
- Modular photo upload (3-layer system)
- Extended client profile (7 fields)
- Session management (`sessions.js`, `SessionCard.jsx`)
- Security fixes (3 issues)

### Session #11 ✅ - Auth Refactoring
- GenericAuthContext (factory pattern, 73% code reduction)
- Fixed critical auth bugs
- Guards are READ-ONLY pattern

### Session #10 ✅ - Koučovací Karty
- Database migration (cards_v2, notes_v2)
- Frontend card system

---

## 🎯 NEXT SESSION - PRIORITY

### 🚨 CRITICAL (Nejvyšší Priorita)
**VARIANTA A: Auto-create auth accounts při registraci**
- Find `TesterSignup.jsx` nebo podobnou stránku
- Implement `auth.users` creation
- Test registration → login → materials access
- Consider migration for existing testers
- **Estimated:** 4-6 hodin
- **Impact:** Opraví 90% problémů s materiály

### 🔥 HIGH Priority
1. Sharing system (email fields + validation)
2. Coach Session Management UI
3. Client Materials/Help pages

---

## 📚 DOKUMENTACE - ODKAZY

**Kritické soubory:**
- `docs/TROUBLESHOOTING_AUTH.md` - Auth troubleshooting (350+ lines) **←NOVÝ!**
- `docs/summary13.md` - Session #13 dokumentace **←NOVÝ!**
- `CLAUDE.md` - Full dokumentace (updated Session #13)
- `CONTEXT_QUICK.md` - Architecture overview (updated Session #13)
- `MASTER_TODO_V4.md` - TODO list (updated Session #13)
- `MASTER_TODO_priority.md` - Priorities (updated Session #13)

---

## 💡 PRO-TIPS

1. **Auth problém?** → Čti `docs/TROUBLESHOOTING_AUTH.md` PRVNÍ!
2. **Vždy** kontroluj Security Advisor po změnách v DB
3. **Vždy** testuj na prázdné i plné tabulce
4. **Nikdy** necommituj debug logs
5. **Vždy** používej Czech locale pro date-fns
6. **Modularita** > DRY > Performance
7. **Security** > Features
8. **is_admin se přepsal?** → Zkontroluj `storage.js:saveCoach()`
9. **Guards** jsou READ-ONLY, nikdy nemodifikují DB!
10. **Používej path aliases** (@styles, @shared, @modules)

---

## 🌍 PRODUCTION STATUS

**Status:** ✅ V PRODUKCI (od 3.11.2025)
**URL:** https://coachpro-weld.vercel.app
**Dev:** http://localhost:3000

**Supabase:**
- Project: CoachPro Production
- Auth: Google OAuth + Email/Password + Access Codes
- Storage: 4 buckets (client-photos, coach-photos, material-images, program-images)
- RLS: ⚠️ Enabled, ale blokuje uživatele bez auth_user_id

---

**Remember:** Modularita, česká lokalizace, bezpečnost. V tomto pořadí.

**Pro detaily:** Čti `CLAUDE.md` nebo `docs/summary13.md`
