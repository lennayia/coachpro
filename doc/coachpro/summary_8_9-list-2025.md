# Summary 12 - Session Management & Security Fixes

**Datum:** 2025-11-09
**Session:** #12
**Trvání:** ~4 hodiny

---

## 🎯 Hlavní úkoly

### 1. ✅ Photo Upload s WebP kompresí (Modular)
- **Vytvořeno:**
  - `src/shared/utils/imageCompression.js` - WebP komprese, validace, dimension checking
  - `src/shared/utils/photoStorage.js` - Supabase Storage operace (upload/delete/update)
  - `src/shared/components/PhotoUpload.jsx` - Reusable component
  - Storage bucket: `client-photos` s RLS policies

- **Features:**
  - Automatická komprese do WebP (0.85 quality, 800px max dimension)
  - Upload s progress tracking
  - Delete funkce
  - Preview s sync na prop changes
  - Compression stats zobrazení

- **Integrace:**
  - ClientProfile: Photo upload v headeru
  - ClientWelcome: Avatar s fotkou místo UserIcon
  - Připraveno pro Coach profiles, Material images, atd.

### 2. ✅ Rozšířený Client Profile
- **Nová pole v databázi:**
  - `photo_url` - URL fotky v Supabase Storage
  - `coach_id` - Přiřazená koučka (foreign key)
  - `started_at` - Začátek koučování
  - `sessions_completed` - Počet dokončených sezení (auto-update trigger)
  - `preferred_contact` - Email/Phone/WhatsApp
  - `timezone` - Časová zóna klientky
  - `client_notes` - Soukromé poznámky (visible only to client)

- **UI změny:**
  - Photo upload component v headeru
  - Select pro preferred contact
  - Select pro timezone (5 běžných zón)
  - Textarea pro client notes
  - Zobrazení coach info (když je přiřazená)
  - Fix vocative case v RoleSelector

### 3. ✅ Session Management (Fully Modular!)
**Architektura:**
```
sessions.js (utils)
  ↓
SessionCard.jsx (component)
  ↓
ClientDashboard + ClientSessions (pages)
  ↓
CoachDashboard + CoachSessions (future)
```

**Vytvořeno:**
- **`src/shared/utils/sessions.js`** (402 řádků, plně reusable)
  - `getNextSession()` - Načte příští sezení
  - `getClientSessions()` - Načte všechna sezení klientky (filtry: upcoming/past/status)
  - `getCoachSessions()` - Načte všechna sezení koučky (pro future use)
  - `createSession()` - Vytvoří nové sezení
  - `updateSession()` - Update sezení
  - `cancelSession()` - Zruší sezení
  - `completeSession()` - Označí jako dokončené
  - `getTimeUntilSession()` - Countdown ("za 2 dny")
  - `formatSessionDate()` - Formátování s Czech locale
  - `isSessionNow()` - Je sezení právě teď?
  - `getSessionStatusLabel()` - Status chip (scheduled/completed/cancelled/rescheduled)
  - `getSessionLocationLabel()` - Location icon (online/in-person/phone)

- **`src/shared/components/SessionCard.jsx`**
  - Univerzální komponenta pro zobrazení sezení
  - Props: `viewMode` ('client' nebo 'coach')
  - Zobrazuje: datum, čas, trvání, lokaci, status
  - Countdown timer pro nadcházející sezení
  - "Probíhá nyní" badge
  - Session summary pro dokončená sezení
  - Avatar s fotkou koučky/klientky

- **`src/modules/coach/pages/ClientDashboard.jsx`**
  - Widget příštího sezení na dashboardu
  - Načítá přes `getNextSession()`
  - Zobrazuje SessionCard s countdown
  - Alert pokud nejsou naplánovaná žádná sezení
  - Click naviguje na `/client/sessions`

- **`src/modules/coach/pages/ClientSessions.jsx`**
  - Nová stránka pro historii sezení
  - Tabs: Nadcházející / Minulá
  - Grid layout s SessionCard komponenty
  - Načítá přes `getClientSessions()`
  - Back button na dashboard

### 4. ✅ Database - Sessions Table
**Tabulka `coachpro_sessions`:**
```sql
- id (uuid, primary key)
- client_id (uuid, foreign key → coachpro_client_profiles)
- coach_id (text, foreign key → coachpro_coaches)
- session_date (timestamptz)
- duration_minutes (int, default 60)
- status (text: scheduled/completed/cancelled/rescheduled)
- location (text: online/in-person/phone)
- coach_notes (text, visible to coach only)
- client_notes (text, visible to both)
- session_summary (text, visible to both)
- created_at, updated_at, created_by
```

**Indexy:**
- `idx_sessions_client_id` - rychlé vyhledání sezení klientky
- `idx_sessions_coach_id` - rychlé vyhledání sezení koučky
- `idx_sessions_date` - řazení podle data
- `idx_sessions_status` - filtrování podle statusu
- `idx_sessions_client_upcoming` - composite index pro nadcházející sezení

**Trigger:**
- `update_sessions_completed()` - auto-update počtu dokončených sezení v profilu

**View:**
- `client_next_sessions` - příští sezení pro každou klientku (s coach detaily)

### 5. ✅ Security Fixes (3 chyby vyřešeny)
**Migrace: `20251109_03_security_fixes.sql`**

1. **Fix Security Definer View**
   - `client_next_sessions` změněn z `security_definer` na `security_invoker`
   - Nyní respektuje RLS politiky underlying tabulek

2. **RLS pro `email_verification_tokens`**
   - Zapnut RLS
   - Policies:
     - Anyone can INSERT (pro registraci)
     - Users can SELECT/UPDATE own tokens (by user_id)
     - System can DELETE expired tokens

3. **RLS pro `password_reset_tokens`**
   - Zapnut RLS
   - Policies:
     - Anyone can INSERT (pro reset hesla)
     - Users can SELECT/UPDATE own tokens (by user_id)
     - System can DELETE expired tokens

4. **Bonus: Cleanup funkce**
   - `cleanup_expired_email_tokens()`
   - `cleanup_expired_reset_tokens()`
   - Pro periodické mazání expirovaných tokenů

---

## 🐛 Opravené Chyby

### 1. Fotka se neuložila (ClientProfile)
**Problém:** PhotoUpload component měl lokální `preview` state, který se neinicializoval při změně `photoUrl` prop.

**Fix:**
```javascript
useEffect(() => {
  setPreview(photoUrl);
}, [photoUrl]);
```

### 2. Chyba 406 (Not Acceptable) při query na coachpro_sessions
**Problém:**
- `.single()` způsoboval 406 error na prázdné tabulce
- Embedded resources (`:` syntax pro JOIN) nefungovaly s RLS

**Fix:**
- Odstraněn `.single()` → array response + check `data.length`
- Změněno na separátní queries místo embedded resources
- `.maybeSingle()` pro optional data (coach details)

### 3. Vocative case v uvítání
**Problém:** "Ahoj, Lenka!" místo "Ahoj, Enko!"

**Fix:** Použití `getVocative()` funkce v RoleSelector a ClientWelcome.

---

## 📦 Nové Soubory

### Utils (Modular, Reusable)
1. `src/shared/utils/imageCompression.js` - WebP compression utilities
2. `src/shared/utils/photoStorage.js` - Supabase Storage operations
3. `src/shared/utils/sessions.js` - Session CRUD & formatting (402 řádků)

### Components (Reusable)
1. `src/shared/components/PhotoUpload.jsx` - Photo upload s WebP compression
2. `src/shared/components/SessionCard.jsx` - Universal session card

### Pages
1. `src/modules/coach/pages/ClientSessions.jsx` - Historie sezení

### Database Migrations
1. `supabase/migrations/20251109_01_extend_client_profiles_and_add_sessions.sql`
2. `supabase/migrations/20251109_02_fix_sessions_rls.sql`
3. `supabase/migrations/20251109_03_security_fixes.sql`

---

## 🔄 Upravené Soubory

### Client Pages
1. `ClientProfile.jsx` - Photo upload, nová pole (timezone, preferred_contact, client_notes, coach info)
2. `ClientDashboard.jsx` - Widget příštího sezení
3. `ClientWelcome.jsx` - Avatar s fotkou místo UserIcon, updated text
4. `ClientView.jsx` - Route `/client/sessions`

### Shared Components
1. `RoleSelector.jsx` - Fix vocative case, removed emoji

---

## 🎨 Architektonické Výhody

### 1. Plná Modularita
```
imageCompression.js
  ↓ používá
PhotoUpload.jsx
  ↓ používá
ClientProfile, CoachProfile, MaterialUpload, atd.
```

### 2. Reusable Session Management
```
sessions.js (všechny CRUD operace)
  ↓ používá
SessionCard.jsx (univerzální zobrazení)
  ↓ používá
ClientDashboard, ClientSessions, CoachDashboard, CoachSessions
```

### 3. Single Source of Truth
- Veškerá session logika v `sessions.js`
- Všechny photo operace v `photoStorage.js` + `imageCompression.js`
- SessionCard může zobrazit sezení z pohledu koučky i klientky (viewMode prop)

### 4. Testovatelnost
- Utils jsou pure functions
- Lze testovat samostatně
- Components mají clear props API

---

## 📊 Statistiky

- **Počet commitů:** 2
- **Přidáno řádků:** ~2700
- **Nových souborů:** 9
- **Upraveno souborů:** 6
- **Opraveno chyb:** 5
- **Security issues fixed:** 3

---

## 🔜 Co Zbývá (Pro Příště)

### High Priority
1. **Coach Session Management**
   - UI pro vytváření/správu sezení
   - Formulář pro nové sezení
   - Přiřazení klientky ke koučce
   - Bulk operations (zrušit více sezení najednou)

2. **Session Notifications**
   - Email notifikace před sezením (24h, 1h)
   - In-app notifikace
   - Calendar sync (.ics export)

3. **Floating Menu Update**
   - Přidat "Sezení" tlačítko pro klientku
   - Badge s počtem nadcházejících sezení

### Medium Priority
4. **Session Notes Enhancement**
   - Rich text editor pro notes
   - Attachments (dokumenty, obrázky)
   - Tagging system

5. **Session Analytics**
   - Statistiky pro koučku (počet sezení, attendance rate)
   - Timeline view (kalendář)
   - Export do CSV/PDF

### Low Priority
6. **Advanced Features**
   - Video call integration (Zoom/Meet)
   - Recording links
   - Automatic session summary generation (AI?)

---

## 💡 Lessons Learned

1. **RLS a Embedded Resources**
   - PostgREST má problém s `:` syntax pro JOINy když je RLS zapnutý
   - Lepší je dělat separátní queries a mapovat data klientsky

2. **`.single()` na prázdné tabulce**
   - Způsobuje 406 error
   - Použít array response + check `data.length`

3. **React State Sync**
   - Lokální state (`preview`) potřebuje `useEffect` pro sync s props
   - Props změny neaktualizují automaticky `useState` initial value

4. **Security Definer vs Security Invoker**
   - Security Definer = view běží s oprávněními vlastníka (bypass RLS)
   - Security Invoker = view běží s oprávněními current usera (respects RLS)
   - Pro bezpečnost preferovat Security Invoker

---

## 🚀 Deployment Checklist

- [x] SQL migrace spuštěny v Supabase
- [x] RLS zapnut pro všechny citlivé tabulky
- [x] Security Advisor bez chyb (0 errors)
- [x] Storage buckets vytvořeny s RLS policies
- [x] Photo upload funguje
- [x] Session widget funguje (i na prázdné tabulce)
- [x] All commits pushed to repository
- [ ] Production deployment (pending)

---

**Status:** ✅ Session dokončena
**Next Session:** Coach session management + notifications
