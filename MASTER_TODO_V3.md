# 🎯 MASTER TODO V3 - CoachPro
**Status**: ✅ Aktivní master list POUZE nehotových úkolů
**Vytvořeno**: 3. listopadu 2025
**Zdroj**: MASTER_TODO_V2.md (8,926 řádků) - systematicky zkontrolováno
**Metodika**: Vše neodškrtnuté nebo nejasné z V2 přesunuto sem s NOVÝM číslováním sprintů

---

## 📋 OBSAH

- **Sprint 1a**: Bug Fixes - MOV Conversion
- **Sprint 2a**: Data Persistence & Supabase Integration
- **Sprint 3a**: DigiPro Modularita - Sdílené komponenty
- **Sprint 4a**: Coach & Client Profile System
- **Sprint 5a**: Admin Systém - Client Management
- **Sprint 6a**: Klientské Rozhraní - Kompletní Layout
- **Sprint 7a**: Email Workflow System
- **Sprint 8a**: Náhledy služeb (Canva, Figma, Miro)
- **Sprint 9a**: Material Edit - Full Replacement
- **Sprint 10a**: Veřejný Coach Profile + 2 Úrovně
- **Sprint 11a**: Nové Typy Materiálů (20+ typů)
- **Sprint 12a**: Sdílení Materiálů - Individual Share
- **Sprint 13a**: Balíčky Služeb (Service Packages)
- **Sprint 14a**: Klientka - Onboarding & Notes
- **Sprint 15a**: Klientka - Úkoly & Zpětná Vazba
- **Sprint 16a**: Certifikát - Upgrade s Podpisem
- **Sprint 17a**: File Management - Limits & Duplicity
- **Sprint 18a**: UX Improvements - Theming & Dark Mode
- **Sprint 18b**: Button Modularity System - Responsive & Consistent
- **Sprint 19a**: Dashboard - Quick Actions & Dates
- **Sprint 20a**: Production Deployment - Pending Tasks
- **Sprint 21a**: Material Workflow System (Audio, Document, Worksheet, Video, Reflection)
- **Sprint 22a**: Client Dashboard & Engagement Features
- **Sprint 23a**: Tabulky & Prezentace Support
- **Sprint 24a**: Tooltips - Application-Wide Implementation
- **Sprint 25a**: Editor Poznámek (Rich Text)
- **Sprint 26a**: Cíle, Vize, Plán - Goal Setting System
- **Sprint 27a**: Session Notes - Zápisky ze Sezení
- **Sprint 28a**: Live Preview při zadání kódu
- **Sprint 29a**: Migrace tester → platící zákazník
- **Sprint 30a**: Poznámky v Detailu Materiálu i Programu
- **Sprint 31a**: Seznam Sdílení - Share History
- **Sprint 32a**: Gamifikace - Odznaky & Odměny
- **Sprint 33a**: Vykání/Tykání - Personalizace Jazyka
- **Sprint 34a**: Ochrana proti smazání - Active Usage Protection
- **Sprint 35a**: Kontrola Duplicit - Validation System
- **Sprint 36a**: Průvodce Druhy Koučinku - Informační Stránka
- **Sprint 37a**: AI Checklisty Generator (Optional)

---

## 📝 CHANGELOG - Completed Sessions (1.-5. listopadu 2025)

### Koučovací Karty - Coach Interface (5.1.2025, večer)

**Kontext:** Implementace coach rozhraní pro koučovací karty (Browse + Share). Refactor ShareCardDeckModal na výběr konkrétní klientky místo jen jména.

**Implementováno:**
- ✅ **BrowseCardDeckModal.jsx** (nový soubor, 146 řádků)
  - Grid layout karet v balíčku (xs=6, sm=4, md=3)
  - Square images (aspectRatio: 1/1)
  - Framer Motion stagger animations
  - Barvy podle cyklu (Jaro/Léto/Podzim/Zima)

- ✅ **ShareCardDeckModal.jsx** - refactor client selection
  - Autocomplete výběr z `coachpro_clients` (místo TextField)
  - Ukládání `client_id` + `client_name` do DB (nullable foreign key)
  - Email sharing přes `mailto:` link
  - Fix duplicate keys warning (`getOptionKey`)

- ✅ **CardDecksLibrary.jsx**
  - Eye icon fix (lucide-react místo MUI)
  - BrowseModal integration (import + state + handler)

- ✅ **DialogTitle HTML nesting fix**
  - Typography `component="div"` v obou modalech
  - Oprava invalid HTML nesting warnings

- ✅ **Database migrace** `20250105_05_add_client_id_to_shared_decks.sql`
  - `client_id TEXT REFERENCES coachpro_clients(id)` - nullable
  - Index pro rychlé vyhledávání
  - Podporuje 2 režimy: registrovaná klientka + nová klientka (budoucí)

**Key Patterns:**
```javascript
// Autocomplete duplicate keys fix
<Autocomplete
  getOptionKey={(option) => option.id}
  isOptionEqualToValue={(option, value) => option.id === value.id}
/>

// DialogTitle Typography nesting
<Typography component="div" variant="h6">Title</Typography>

// Mailto link pattern
const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
window.location.href = mailtoLink;
```

**Soubory změněné:** 5 (2 nové, 3 upravené)

**Status:** ✅ Coach interface complete, ready for testing
**Pending:** Spustit migraci v Supabase, vložit obrázky karet, implementovat client interface

---

### MaterialCard Layout Reorganization (5.11.2025, večer)

**Kontext:** Icon overflow v rozmezí 500-572px - ikona koše nebyla viditelná. User odmítla intermediate breakpoint, zvolila kompletní reorganizaci layoutu.

**Implementováno:**
- ✅ **MaterialCard.jsx** - kompletní layout reorganization
  - **Row 1**: Velká ikona (vlevo) + Chip kategorie + Datum "Přidáno 📅 5. 11. 2025" (vpravo)
  - **Row 2**: Všechny akční ikony (Eye, Pencil, Copy, Share2, Trash2) - NOVÝ řádek
  - **Row 3**: Metadata (velikost souboru, délka, počet stran) - horizontálně, ODSTRANĚNO datum
  - **Rows 4-8**: URL/fileName, Název, Popis, Taxonomy chips, Preview button
  - **Row 9**: Reflexe wrapper - ALWAYS present s minHeight: '2em'

- ✅ **responsive.js** - nový CARD_PADDING modul
  - `p: { xs: 1.5, sm: 2.5 }` - zvětšen z 2 na 2.5 (20px) na desktopu
  - `pr: { xs: 1.25, sm: 2 }` - zvětšen z 1.75 na 2 (16px)
  - Export pro centralizované použití

- ✅ **modernEffects.js** - createIconButton responsive touch targets
  - `minWidth: { xs: 36, sm: 44 }` - 36px mobil (prevence overflow)
  - `minHeight: { xs: 36, sm: 44 }` - 44px desktop (Apple HIG standard)

- ✅ **Alignment fixes s negative margins**
  - Row 1 velká ikona: `ml: -0.5` (push k levému okraji)
  - Row 2 akční ikony: `mr: -1` (push k pravému okraji)
  - Row 3 metadata: `mr: -1` (konzistentní s row 2)
  - Datum přidání: ŽÁDNÝ negative margin (user chtěla více prostoru)

- ✅ **Visual consistency - minHeight pro všechny rows**
  - Rows 3-9: minHeight zajišťuje konzistentní vertikální pozice
  - Row 3 metadata: `minHeight: '1.5em'`
  - Row 9 reflexe wrapper: `minHeight: '2em'` - vždy přítomný i když prázdný

- ✅ **Icon gap optimization**
  - `gap={{ xs: 0.5, sm: 0.75 }}` - 4px mobil (5 ikon × 36px + 4 × 4px = 196px)
  - 6px desktop pro více breathability

**Creation Date Changes:**
- Přidáno: Calendar ikona, "Přidáno" label, datum
- Format změněn: "5. listopadu 2025" → "5. 11. 2025" (numeric month)
- Position: Row 1, `ml="auto"` (right-aligned)

**Metadata Reordering:**
- Nové pořadí: fileSize → duration → pageCount
- Změněno z conditional (duration OR pageCount) na separate conditions
- Horizontální layout s gap: 1.5 (12px)

**Padding Journey:**
1. Initial: User chtěla menší padding → testováno
2. Result: Příliš cramped, user vrátila změny
3. Final: VĚTŠÍ padding na desktopu (sm: 2.5) pro více breathability

**Soubory upraveny:** 3
- `MaterialCard.jsx` - layout reorganization (~200 lines changed)
- `responsive.js` - CARD_PADDING export (lines 19-22)
- `modernEffects.js` - responsive touch targets (lines 270-299)

**Benefit:**
- ✅ Icon overflow vyřešen (500-572px range)
- ✅ Všech 5 action ikon má dostatek prostoru
- ✅ Konzistentní vertical alignment napříč kartami
- ✅ Touch targets optimalizované (36px/44px)
- ✅ Row 9 vždy přítomný → eliminuje height mismatch

**Git:**
- Commit: `d8eef24`
- Branch: `feature/sprint18c-basecard-modularity`
- Push: ✅ Completed

**Status**: ✅ MaterialCard production-ready, layout optimalizován

---

### Sprint 18c: BaseCard Feedback Modularity Fix (5.11.2025)

**Kontext:** User identifikoval kritickou modularity violation: "k čemu ale máme baseCard.jsx, když to pak napíšeš natvrdo do ProgramCard?"

**Implementováno:**
- ✅ **BaseCard.jsx** - přidán feedback jako built-in feature
  - Nové props: `feedbackData` (array), `onFeedbackClick` (handler)
  - Automatické zobrazení feedback buttonu když data existují
  - MessageSquare ikona, kompaktní design, primary barva
  - Footer condition rozšířena: `(onClientPreview || feedbackData || footer)`

- ✅ **ProgramCard.jsx** - refactored na modular řešení
  - ODSTRANĚNO: 47 řádků hardcoded footer (lines 193-240)
  - NAHRAZENO: 2 props (`feedbackData`, `onFeedbackClick`)
  - Odebrán unused MessageSquare import
  - Plně modular, žádné duplicity

**Discovery:**
- ⚠️ **MaterialCard.jsx** - nepoužívá BaseCard
  - Má vlastní Card implementaci z MUI
  - Obsahuje hardcoded feedback button (lines 677-724)
  - Vyžaduje major refactor na BaseCard (pending user decision)

**Soubory:**
- `BaseCard.jsx` - feedback feature (50+ lines added)
- `ProgramCard.jsx` - modular refactor (47 lines deleted)
- `MaterialCard.jsx` - technical debt identified

**Benefit:**
- Feedback UI změny na jednom místě (BaseCard)
- ProgramCard o 47 řádků kratší
- Consistency napříč kartami (když MaterialCard bude refactored)

**Status**: ✅ ProgramCard modular, MaterialCard pending refactor

---

### UI Polish & Modularity Cleanup (4.11.2025, večer)

**Implementováno:**
- ✅ **Layout.jsx** - odstraněn backdrop strip (90px) a starý Sidebar
  - Removed: 90px white strip, Sidebar component, hamburger menu
  - Updated: responsive padding na modular `PAGE_PADDING` konstantu

- ✅ **responsive.js** - nový modular spacing system
  - `PAGE_PADDING`: { px: { xs: 1.25, xsm: 1.875, md: 3 }, py: 3 }
  - `SECTION_PADDING`: { px: { xs: 0.5, sm: 1, md: 2 } }
  - `createTextEllipsis(lines)` - multi-line ellipsis funkce

- ✅ **MaterialCardSkeleton.jsx** - kompletní refactor
  - Přepsán z 2-column na single-column 8-row layout
  - Odpovídá novému MaterialCard designu (Session 11c)
  - Modular BORDER_RADIUS, responsive sizes

- ✅ **MaterialsLibrary.jsx** - button responsive fix
  - "Přidat materiál" button: nikdy fullWidth
  - Responsive padding: `px: { xs: 2, sm: 3 }, py: { xs: 0.75, sm: 1 }`
  - `alignSelf: 'flex-start'`, `minWidth: 'fit-content'`

- ✅ **Sidebar.jsx** - přesunut do `_deprecated/`

- ✅ **useModernEffects.js** - sidebar preset zakomentován

**Benefit:**
- Konzistentní responsive padding napříč aplikací
- Skeleton loader odpovídá aktuálnímu designu
- Kompaktní buttons (ne fullWidth)
- Token saving díky modularitě

**Soubory upraveny:** 6
- `Layout.jsx` - cleanup + modular padding
- `Header.jsx` - removed hamburger menu
- `responsive.js` - nový modular system ✨
- `MaterialCardSkeleton.jsx` - 8-row layout
- `MaterialsLibrary.jsx` - button fix
- `useModernEffects.js` - sidebar deprecated

**Status**: ✅ UI cleanup & modularity dokončeno

---

### Sprint 21.1: Material Feedback System - Modulární (4.11.2025)

**Implementováno:**
- ✅ **BaseFeedbackModal.jsx** - nová base komponenta pro všechny feedback typy
  - Shared props: open, onClose, onSubmit, title, description, emoji
  - Modular system pro audio, material, program feedback
  - Glassmorphism design, rating (1-5 hvězdiček), text area

- ✅ **MaterialFeedbackModal.jsx** - zpětná vazba k materiálu
  - Used v DailyView po dokončení materiálu
  - Submit uloží feedback do `material_feedback` array v client objektu

- ✅ **ProgramEndFeedbackModal.jsx** - zpětná vazba na konci programu
  - Zobrazí se po dokončení posledního dne
  - Submit uloží feedback do `program_feedback` v client objektu

- ✅ **ClientFeedbackModal.jsx** - view feedback pro kouče
  - Coach může vidět všechny feedback od klientek
  - Zobrazení v ClientsList nebo ClientCard detail

**Soubory:**
- `BaseFeedbackModal.jsx` - nový ✨
- `MaterialFeedbackModal.jsx` - přepsán na modular base
- `ProgramEndFeedbackModal.jsx` - nový ✨
- `ClientFeedbackModal.jsx` - nový ✨
- `DailyView.jsx` - integrace feedback modals
- `storage.js` - feedback save funkce

**Status**: ✅ Modulární feedback systém production ready

---

### SQL Migrations: Idempotence Fix (4.11.2025)

**Implementováno:**
- ✅ **IF NOT EXISTS** přidáno do všech SQL migrations
  - Prevence chyb při opakovaném spuštění
  - Safe pro production deployment

**Soubory:**
- `20250103_01_add_coach_name_to_programs.sql`
- `20250103_02_add_coach_name_to_shared_materials.sql`
- `20250103_03_add_taxonomy_columns.sql`
- `20250103_04_add_access_dates_to_clients.sql`
- `20250103_add_access_dates_to_shared_materials.sql`

**Dokumentace:** CLAUDE.md aktualizován s best practices

---

### CRITICAL Fix: Foreign Key Constraints (3-4.11.2025)

**Problém:** Coach nebyl uložen do Supabase před vytvořením materiálu → foreign key violation

**Řešení:**
- ✅ **TesterLogin.jsx** - save coach při přihlášení
- ✅ **AddMaterialModal.jsx** - null currentUser protection
- ✅ **storage.js** - await keywords u všech async funkcí

**CLAUDE.md:** Přidáno KRITICKÉ pravidlo - vždy ensure coach exists PŘED save material/program

**Status**: ✅ Bug opravený, preventivní pravidla dokumentována

---

### SQL Migrations: Reorganization (3.11.2025)

**Implementováno:**
- ✅ Vytvořena `/supabase/migrations/` složka
- ✅ Přesunuty všechny SQL soubory s timestampem (20250103_01 až 05)
- ✅ Smazány duplicity z root
- ✅ V root jen dokumentační soubory (schema, testers)

**Benefit:** Centralizace, verzování, jasná struktura

---

### Time-Limited Access Control (3.11.2025)

**Implementováno:**
- ✅ **DatePickers v ShareMaterialModal a ShareProgramModal**
  - accessStartDate, accessEndDate (TIMESTAMPTZ)
  - UI polish s modular functions

- ✅ **4 nové modular funkce v modernEffects.js**:
  - `createPrimaryModalButton(isDark)`
  - `createFormTextField(isDark)`
  - `createCancelButton(isDark)`
  - `createSubmitButton(isDark)`

- ✅ **SQL migration** - `add_access_dates_to_shared_materials.sql`
  - Sloupce: access_start_date, access_end_date
  - Index pro rychlé vyhledávání

- ✅ **storage.js** - localStorage fallback s date fields

**Status**: ✅ Time-limited access ready for phase 2

---

### Production Deployment (3.11.2025)

**Implementováno:**
- ✅ **Vercel deployment**
  - Production URL: `https://coachpro-weld.vercel.app/`
  - Auto-deployment z main branch
  - SPA routing (vercel.json)

- ✅ **Email Integration (Resend.com)**
  - Serverless API: `/api/send-access-code.js`
  - Access code email při registraci
  - Domain: `beta@online-byznys.cz`
  - Beta workaround (všechny maily na admin)

- ✅ **Login System Split**
  - TesterLogin.jsx - `/tester/login` - Access code
  - AdminLogin.jsx - `/lenna` - Heslo `lenna2025`
  - Admin loads oldest coach z localStorage

- ✅ **DNS Configuration**
  - Domain: `online-byznys.cz`
  - DKIM, SPF, MX, DMARC records

**Status**: ✅ Production live, email funguje

---

### Sprint 10: Critical Bug Fixes & Performance (3.11.2025)

**Implementováno:**
- ✅ **DailyView fix** - undefined moodLog/completedDays operations
- ✅ **MaterialView fix** - missing await, undefined coach reference
- ✅ **Performance optimization** - Coach name denormalization
  - `coach_name` sloupec v `coachpro_shared_materials`
  - `coach_name` sloupec v `coachpro_programs`
  - SQL migrace vytvořeny a spuštěny
  - 50% redukce DB dotazů (2 → 1)

- ✅ **Live preview enhancement**
  - Coach name zobrazeno v MaterialEntry.jsx
  - Coach name zobrazeno v ClientEntry.jsx

- ✅ **Dashboard statistika** - "Celkem programů" karta
- ✅ **Grid layout** - 4 karty vedle sebe (md={3})

**Status**: ✅ Všechny runtime errors opraveny, performance boost

---

### Supabase Migration: localStorage → PostgreSQL (3.11.2025)

**Implementováno:**
- ✅ **storage.js refactor** - async/await pattern
- ✅ **Supabase client** - všechny CRUD operace
- ✅ **RLS policies** - bezpečnostní pravidla
- ✅ **Fallback na localStorage** - když Supabase není dostupný
- ✅ **Missing await keywords** - fix async bugs

**Tables:**
- `coachpro_coaches`
- `coachpro_clients`
- `coachpro_materials`
- `coachpro_programs`
- `coachpro_shared_materials`
- `coachpro_testers`

**Status**: ✅ Hybrid systém (Supabase + localStorage fallback)

---

### Sprint 13: Beta Tester Access System (2.11.2025)

**Implementováno:**
- ✅ **Supabase Testers Table** - SQL schema + RLS policies
- ✅ **TesterSignup.jsx** - registrace s access code
  - GDPR consent checkboxes
  - Access code generation (TEST-XXXX)
  - IP tracking
- ✅ **PrivacyPolicy.jsx** - GDPR-compliant policy
- ✅ **TesterLogin.jsx** - přihlášení přes access code
- ✅ **MailerLite Classic API** - email integration (CORS blocked)

**Status**: ✅ Beta tester flow funkční

---

### Sprint 12: Coaching Taxonomy System (2.11.2025)

**Implementováno:**
- ✅ **4-dimensionální taxonomie**:
  1. Coaching Area (POVINNÉ) - 8 oblastí
  2. Topics (VOLITELNÉ) - 30+ témat
  3. Coaching Style (VOLITELNÉ) - 8 stylů
  4. Coaching Authority (VOLITELNÉ) - 11 certifikací

- ✅ **coachingTaxonomy.js** - centrální modul (311 lines)
- ✅ **Material Schema** - nové fields
- ✅ **MaterialCard Row 7** - taxonomy chips s barevnou hierarchií
- ✅ **MaterialsLibrary Filtering** - 4 nové filtry + topics multi-select
- ✅ **AddMaterialModal** - 4 taxonomy selektory + validace

**Status**: ✅ Taxonomy systém production ready

---

### Session 11c: MaterialCard Single-Column Layout (2.11.2025)

**Implementováno:**
- ✅ **8-row single-column layout**
  - Row 1: Large icon + action icons
  - Row 2: Category chip
  - Row 3: Metadata horizontal
  - Row 4: URL/fileName s ellipsis
  - Row 5: Title (2 lines)
  - Row 6: Description (3 lines)
  - Row 7: Taxonomy chips
  - Row 8: "Jak to vidí klientka" button

- ✅ **Ellipsis system** - `createTextEllipsis()` funkce
- ✅ **responsive.js modul** - nový soubor pro responsive utilities
- ✅ **Custom breakpoint xsm: 480px** - 2 karty od 480px
- ✅ **Responsiveness 320px+** - zachována

**Debugging:** 7 pokusů na ellipsis (minWidth: 0 cascade)

**Status**: ✅ MaterialCard production ready

---

### Session 11b: Modularity Cleanup & UI Polish (1.11.2025)

**Implementováno:**
- ✅ **NavigationFloatingMenu** - nové plovoucí navigační menu
  - Logo CoachPro (bílé: `filter: brightness(0) invert(1)`)
  - 4 navigační ikony (Dashboard, Materiály, Programy, Klientky)
  - Position: `right: 80` (vedle FloatingMenu)
  - Primary-secondary gradienty, shine efekty

- ✅ **FloatingMenu & NavigationFloatingMenu** - vzájemné zavírání
  - Controlled components (isOpen prop, onToggle callback)
  - Header.jsx spravuje oba stavy (`navigationMenuOpen`, `settingsMenuOpen`)
  - Když se otevře jedno menu, druhé se automaticky zavře

- ✅ **Glassmorphism backdrop** - blur celé stránky
  - Layout.jsx renderuje backdrop když je jakékoliv menu otevřené
  - Blur(8px) + kouřový efekt (radial gradienty)
  - zIndex: 1200 (menu mají 1300)

- ✅ **CLAUDE_QUICK.md** - nová dokumentační struktura
  - 200 řádků místo 9000+ (CLAUDE.md)
  - Všechna kritická pravidla
  - Modulární systémy (6 systémů včetně notifikací a floating menu)
  - Quick patterns
  - 98% úspora tokenů při čtení dokumentace

- ✅ **CONTEXT_QUICK.md** - aktualizován
  - Odkaz na novou dokumentační strukturu
  - Upozornění: čti CLAUDE_QUICK.md jako primární zdroj

**Soubory upravené:**
- `NavigationFloatingMenu.jsx` - logo bílé, controlled component
- `FloatingMenu.jsx` - controlled component
- `Header.jsx` - mutual exclusion logic
- `Layout.jsx` - glassmorphism backdrop
- `CLAUDE_QUICK.md` - nový soubor ✨
- `CONTEXT_QUICK.md` - aktualizován

**Čas**: ~30 minut
**Status**: ✅ Production ready

---

## 🐛 Sprint 1a: Bug Fixes - MOV Conversion

**Zdroj**: Bug #4 z MASTER_TODO_V2.md (neúplně dokončen)
**Priorita**: MEDIUM
**Odhad**: 2-3 hodiny

### 1.1 MOV Video Conversion
**Problém**: iPhone/Mac MOV videa mají špatnou detekci MIME typu

- [ ] **AddMaterialModal.jsx - fix MOV detection**
  - Přidat explicitní check pro `.mov` extension
  - MIME type fallback: `video/quicktime` nebo `video/mp4`

- [ ] **Testování**:
  - [ ] Upload MOV souboru z iPhone
  - [ ] Verify correct MIME type detection
  - [ ] Verify preview funguje
  - [ ] Verify playback v DailyView

**Soubory k úpravě**:
- `AddMaterialModal.jsx` (lines ~180-220)

---

## 🗄️ Sprint 2a: Data Persistence & Supabase Integration

**Zdroj**: Sprint 10.1 z MASTER_TODO_V2.md (zcela nedokončeno)
**Priorita**: CRITICAL
**Odhad**: 4-6 hodin
**Poznámka**: User řekla "Já totiž teď úplně nevím, co jsme mysleli tímto - Supabase Storage aktivace a debugging, Auto-sync do cloudu, Backup & Recovery systém"

### 2.1 Supabase Database Tables

- [ ] **Vytvořit SQL migrace pro všechny tabulky**:
  - [ ] `coachpro_coaches` (id, name, email, profilePhoto, bio, atd.)
  - [ ] `coachpro_clients` (id, name, email, programId, completedDays, atd.)
  - [ ] `coachpro_materials` (id, coachId, type, title, content, category, atd.)
  - [ ] `coachpro_programs` (id, coachId, title, duration, days, shareCode, atd.)
  - [ ] `coachpro_shared_materials` (už existuje, ale zkontrolovat)
  - [ ] `coachpro_testers` (už existuje - OK ✅)

- [ ] **RLS (Row Level Security) politiky**:
  - [ ] Coaches: SELECT own, INSERT own, UPDATE own
  - [ ] Clients: SELECT where programCode match
  - [ ] Materials: SELECT where coachId = current_user
  - [ ] Programs: SELECT where active OR coachId = current_user

### 2.2 Supabase Storage - Aktivace & Debugging

- [ ] **Zkontrolovat storage bucket konfigurace**:
  - [ ] Bucket `materials-coach` existuje?
  - [ ] Public read access enabled?
  - [ ] RLS politiky pro upload/delete

- [ ] **supabaseStorage.js - debugging**:
  - [ ] Přidat lepší error handling
  - [ ] Přidat retry logic pro failed uploads
  - [ ] Přidat progress callback pro velké soubory

- [ ] **Testování**:
  - [ ] Upload PDF → verify URL
  - [ ] Upload Audio → verify playback
  - [ ] Upload Video → verify playback
  - [ ] Delete file → verify removal from bucket

### 2.3 Auto-sync Pattern (localStorage ↔ Supabase)

- [ ] **storage.js - implementovat auto-sync**:
  ```javascript
  // Pattern:
  1. Save to localStorage (okamžitě)
  2. Queue sync to Supabase (debounced 5s)
  3. On success: mark as synced
  4. On fail: retry 3x, pak show error
  ```

- [ ] **Sync funkce**:
  - [ ] `syncMaterialToSupabase(materialId)`
  - [ ] `syncProgramToSupabase(programId)`
  - [ ] `syncClientToSupabase(clientId)`
  - [ ] `syncAllPendingChanges()` - při online/offline events

- [ ] **Offline support**:
  - [ ] Detect online/offline status
  - [ ] Queue changes when offline
  - [ ] Sync when back online
  - [ ] Show indicator: "Neuložené změny (offline)"

### 2.4 Backup & Recovery System

- [ ] **Manual backup button**:
  - [ ] Export all data as JSON
  - [ ] Download file: `coachpro-backup-YYYY-MM-DD.json`
  - [ ] Include: coaches, materials, programs, clients

- [ ] **Manual restore**:
  - [ ] Upload JSON backup file
  - [ ] Validate structure
  - [ ] Merge with existing data (conflict resolution)
  - [ ] Show preview before import

- [ ] **Automatic daily backup to Supabase**:
  - [ ] Backup table: `coachpro_backups`
  - [ ] Store compressed JSON
  - [ ] Retention: 30 days
  - [ ] Recovery UI in Settings

**Soubory k vytvoření**:
- `supabase/migrations/20250103_05_create_all_tables.sql`
- `/src/modules/coach/utils/syncManager.js`

**Soubory k úpravě**:
- `storage.js` (add sync logic)
- `supabaseStorage.js` (debugging)

---

## 🧩 Sprint 3a: DigiPro Modularita - Sdílené Komponenty

**Zdroj**: Sprint 10.2 z MASTER_TODO_V2.md
**Priorita**: HIGH
**Odhad**: 6-8 hodin
**Cíl**: Vytvořit `/src/shared/digipro/` strukturu pro znovupoužitelné komponenty

### 3.1 DigiPro Folder Structure

- [ ] **Vytvořit base strukturu**:
  ```
  /src/shared/digipro/
    /components/
      /Auth/
        LoginForm.jsx
        RegisterForm.jsx
      /Forms/
        DigiTextField.jsx
        DigiSelect.jsx
        DigiUpload.jsx
    /hooks/
      useProfile.js
      usePhotoUpload.js
      useAdmin.js
    /utils/
      profileHelpers.js
      adminHelpers.js
    /styles/
      digiproTheme.js
  ```

### 3.2 Modulární Funkce

- [ ] **Authentication**:
  - [ ] Login funkce
  - [ ] Register funkce
  - [ ] Logout funkce
  - [ ] Password Reset (připraveno na Supabase Auth)

- [ ] **User Management**:
  - [ ] CRUD operace (Create, Read, Update, Delete)
  - [ ] Role management (coach, client, admin)

- [ ] **File Upload**:
  - [ ] Image upload (s compress + crop)
  - [ ] PDF upload
  - [ ] Audio upload
  - [ ] Video upload
  - [ ] Všechny s Supabase Storage integrací

- [ ] **Notifications**:
  - [ ] Toast notifications (už máme - zkontrolovat)
  - [ ] Push notifications (budoucnost)
  - [ ] Email notifications (budoucnost)

- [ ] **Search**:
  - [ ] Global search funkce
  - [ ] Filters komponenta
  - [ ] Sorting utils

- [ ] **Settings**:
  - [ ] Profile settings
  - [ ] Preferences (theme, notifications)
  - [ ] Theme switcher

- [ ] **Analytics** (budoucnost):
  - [ ] Tracking utils
  - [ ] Charts komponenty
  - [ ] Reports generator

- [ ] **Comments/Feedback**:
  - [ ] Rating komponenta
  - [ ] Reviews komponenta

- [ ] **Calendar**:
  - [ ] Events komponenta
  - [ ] Reminders system

- [ ] **Chat** (budoucnost):
  - [ ] Real-time messaging

### 3.3 DigiPro Design System

- [ ] **Jednotná color palette**:
  - [ ] Definovat primary, secondary, accent colors
  - [ ] Gradient patterns
  - [ ] Dark mode variants

- [ ] **Border-radius hodnoty** (už máme - zkontrolovat konzistenci):
  - [ ] Verify BORDER_RADIUS.js používán všude

- [ ] **Spacing systém**:
  - [ ] 4, 8, 12, 16, 24, 32, 48, 64px konstanty

- [ ] **Typography**:
  - [ ] Font sizes
  - [ ] Font weights
  - [ ] Line heights

- [ ] **Glassmorphism patterns** (už máme - zkontrolovat):
  - [ ] Import z CoachPro modernEffects.js

- [ ] **Animation patterns**:
  - [ ] Import z CoachPro animations.js

**Soubory k vytvoření**:
- Celá `/src/shared/digipro/` struktura (~30+ souborů)

---

## 👤 Sprint 4a: Coach & Client Profile System

**Zdroj**: Sprint 10.3 & 10.4 z MASTER_TODO_V2.md
**Priorita**: HIGH
**Odhad**: 5-7 hodin
**Cíl**: Kompletní profily s fotkami (jako PaymentsPro)

### 4.1 Coach Profile Components

- [ ] **CoachProfileCard.jsx** (read-only view):
  - [ ] Fotka (200×200px kruhová)
  - [ ] Jméno, email, telefon
  - [ ] Bio/Tagline
  - [ ] Sociální sítě (Instagram, LinkedIn, Website, Facebook)
  - [ ] Kvalifikace (education, certifications)
  - [ ] Tlačítko "Upravit profil"

- [ ] **CoachProfileEditor.jsx** (edit mode):
  - [ ] Upload fotky (drag & drop nebo kliknutí)
  - [ ] Crop tool (react-easy-crop)
  - [ ] Compress image před uploadem
  - [ ] Vše editovatelné
  - [ ] Auto-save (debounced 5s)
  - [ ] Toast feedback

- [ ] **ProfilePhotoUpload.jsx** (reusable):
  - [ ] Drag & drop zone
  - [ ] Preview před uploadem
  - [ ] Crop & rotate
  - [ ] Compress (max 500KB)
  - [ ] Upload do Supabase Storage (`coach-photos/`)
  - [ ] Fallback: Default avatar (iniciály)

### 4.2 Coach Object - Rozšíření

- [ ] **Přidat nová pole do Coach schema**:
  ```javascript
  {
    // Základní (už máme)
    id: "uuid",
    name: "Lenka Nováková",
    email: "lenka@example.com",

    // NOVÉ - Profil
    profilePhoto: {
      url: "https://supabase.../coach-photos/uuid.jpg",
      thumbnail: "https://supabase.../coach-photos/uuid_thumb.jpg",
      uploadedAt: "ISO timestamp"
    },
    phone: "+420 xxx xxx xxx",
    bio: "Koučka pro ženy v podnikání...",
    tagline: "Najdi sílu v sobě",

    // Sociální sítě
    socialLinks: {
      instagram: "",
      linkedin: "",
      website: "",
      facebook: ""
    },

    // Kvalifikace
    education: "ICF akreditace, XYZ škola",
    certifications: [
      { title: "ICF ACC", year: "2023" }
    ],

    // Settings
    preferences: {
      theme: "nature",
      notifications: true,
      language: "cs"
    },

    // Meta
    createdAt: "ISO timestamp",
    updatedAt: "ISO timestamp"
  }
  ```

### 4.3 Storage.js - Update

- [ ] **Přidat funkce pro profil**:
  - [ ] `updateCoachProfile(coachId, updates)` - uložit změny
  - [ ] `uploadCoachPhoto(coachId, file)` - nahrát fotku
  - [ ] `getCoachProfile(coachId)` - načíst profil

### 4.4 Navigace - Profil Stránka

- [ ] **Route**: `/coach/profile`
- [ ] **Menu item v Sidebar**: "Profil"
- [ ] **Zobrazit**: CoachProfileCard + Edit button

### 4.5 Client Profile Components

- [ ] **ClientProfileCard.jsx** (read-only):
  - [ ] Stejný layout jako CoachProfileCard
  - [ ] Fotka, jméno, email, telefon
  - [ ] Bio (volitelné)

- [ ] **ClientProfileEditor.jsx** (edit mode):
  - [ ] Použít STEJNÝ ProfilePhotoUpload komponentu (modularita!)
  - [ ] Auto-save
  - [ ] Toast feedback

### 4.6 Client Object - Rozšíření

- [ ] **Přidat nová pole**:
  ```javascript
  {
    // Základní (už máme)
    id: "uuid",
    name: "Jana Nováková",
    email: "jana@example.com",

    // NOVÉ - Profil
    profilePhoto: {
      url: "https://supabase.../client-photos/uuid.jpg",
      thumbnail: "https://supabase.../client-photos/uuid_thumb.jpg"
    },
    phone: "+420 xxx xxx xxx",
    bio: "Moje cesta...", // volitelné

    // Moje PROČ (už máme)
    whyStatement: {
      why: "...",
      expectations: "...",
      direction: "..."
    },

    // Program info (už máme)
    programId: "uuid",
    startedAt: "ISO timestamp",
    completedDays: [1, 2, 3],

    // Meta
    createdAt: "ISO timestamp",
    updatedAt: "ISO timestamp"
  }
  ```

### 4.7 Navigace - Client Profile

- [ ] **Route**: `/client/profile`
- [ ] **Menu item v Sidebar**: "Profil"

**Soubory k vytvoření**:
- `CoachProfileCard.jsx`
- `CoachProfileEditor.jsx`
- `ProfilePhotoUpload.jsx`
- `CoachProfile.jsx` (page)
- `ClientProfileCard.jsx`
- `ClientProfileEditor.jsx`
- `ClientProfile.jsx` (page)

**Soubory k úpravě**:
- `storage.js` (přidat profil funkce)
- `supabaseStorage.js` (upload fotky)
- `CoachDashboard.jsx` (přidat Profil link)

**Dependencies k instalaci**:
- `react-easy-crop` (pro crop fotky)
- `browser-image-compression` (pro compress)

---

## 🔧 Sprint 5a: Admin Systém - Client Management

**Zdroj**: Sprint 10.5 z MASTER_TODO_V2.md
**Priorita**: HIGH
**Odhad**: 4-5 hodin
**Problém**: Klientka se musí umět registrovat SAMA + koučka musí umět přidat ručně

### 5.1 ClientsList - UPGRADE

- [ ] **Tlačítko "Přidat klientku ručně"** ← NOVÉ!
  - [ ] Otevře AdminAddClientModal
  - [ ] Koučka vyplní: Jméno, Email, Telefon
  - [ ] Vybere program
  - [ ] Volitelně: Vygenerovat přístupový kód nebo poslat email

- [ ] **Batch operace**:
  - [ ] Multi-select klientek (checkbox na každé kartě)
  - [ ] Hromadné odeslání emailu
  - [ ] Hromadné přiřazení programu
  - [ ] Hromadné smazání (s potvrzením!)

- [ ] **Pokročilé filtry**:
  - [ ] Status: Aktivní, Dokončené, Neaktivní
  - [ ] Program (dropdown)
  - [ ] Datum registrace (date range picker)
  - [ ] Poslední aktivita (date range picker)

### 5.2 AdminAddClientModal Komponenta

- [ ] **Formulář**:
  - [ ] Jméno (required)
  - [ ] Email (required, validace)
  - [ ] Telefon (optional)
  - [ ] Program (dropdown, required)
  - [ ] Způsob přístupu:
    - [ ] Checkbox: Vygenerovat kód (6 znaků)
    - [ ] Checkbox: Poslat email s odkazem
    - [ ] Checkbox: Obojí
  - [ ] Poznámka pro koučku (optional, textarea)

- [ ] **Validace**:
  - [ ] Email regex
  - [ ] Duplicita emailu (warning)

- [ ] **Success screen**:
  - [ ] Zobrazit vygenerovaný kód
  - [ ] Tlačítko "Zkopírovat kód"
  - [ ] Tlačítko "Poslat email klientce"

### 5.3 Dva Způsoby Registrace Klientky

**A) Samo-registrace (už máme, upgrade):**
- [ ] Klientka zadá kód programu nebo naskenuje QR
- [ ] Vyplní jméno + email
- [ ] Automaticky se vytvoří účet
- [ ] Redirect na program

**B) Koučka přidá ručně (NOVÉ):**
- [ ] Koučka vyplní AdminAddClientModal
- [ ] Klientka dostane email s linkem
- [ ] Klikne na link → nastaví heslo (volitelné)
- [ ] Redirect na program

### 5.4 Email Notifikace pro Klientku

- [ ] **Email template** (mock zatím, později Supabase/Resend):
  ```
  Subject: Tvoje koučka tě přidala do programu! 🌿

  Ahoj {{name}},

  Koučka {{coachName}} tě přidala do programu "{{programName}}".

  Tvůj přístupový kód: {{code}}
  Nebo klikni přímo: {{link}}

  Těším se na společnou cestu!
  {{coachName}}
  ```

### 5.5 Modularita - ClientAdmin Systém

- [ ] **Vytvořit `/src/shared/digipro/components/Admin/ClientAdmin/`**:
  - [ ] `ClientsList.jsx` (tabulka/grid)
  - [ ] `ClientDetail.jsx` (detail klientky)
  - [ ] `ClientEditor.jsx` (editace)
  - [ ] `ClientInvite.jsx` (pozvání emailem)
  - [ ] `ClientBulkActions.jsx` (hromadné akce)

**Soubory k vytvoření**:
- `AdminAddClientModal.jsx`
- `/src/shared/digipro/components/Admin/ClientAdmin/` (5 souborů)

**Soubory k úpravě**:
- `ClientsList.jsx` (add admin features)

---

## 💻 Sprint 6a: Klientské Rozhraní - Kompletní Layout

**Zdroj**: Sprint 11 (9.1) z MASTER_TODO_V2.md
**Priorita**: HIGH
**Odhad**: 5-6 hodin

### 6.1 Menu + Sidebar (Client)

- [ ] **Stejný layout jako u koučky, jiná data**:
  - [ ] Navigace: Dashboard, Můj program, Materiály, Profil
  - [ ] Logo + jméno klientky
  - [ ] Logout tlačítko

### 6.2 Dashboard pro Klientku

- [ ] **Aktuální program** (progress bar, streak 🔥):
  - [ ] Progress bar (X/Y dní dokončeno)
  - [ ] Streak counter (např. "5 dní v řadě 🔥")
  - [ ] Motivační zpráva

- [ ] **Dnešní úkoly** (checklist):
  - [ ] Seznam úkolů pro aktuální den
  - [ ] Checkbox pro každý úkol
  - [ ] Progress: "2/5 dokončeno"

- [ ] **Moje PROČ** (připomenutí):
  - [ ] Card s textem "Proč jdeš do koučinku?"
  - [ ] Zobrazit whyStatement z onboardingu
  - [ ] Tlačítko "Upravit"

- [ ] **Motivační citát**:
  - [ ] Random citát z databáze
  - [ ] Refresh button
  - [ ] Krásný design

- [ ] **Statistiky**:
  - [ ] Dokončené dny
  - [ ] Celkový čas strávený (odhad)
  - [ ] Materiály zhlédnuté

### 6.3 Stránka "Můj Program"

- [ ] **Seznam dnů s progress**:
  - [ ] Grid/list dnů programu
  - [ ] Progress indikátor pro každý den
  - [ ] Kliknutelné → detail dne

- [ ] **Detail dne**:
  - [ ] Materiály (seznam)
  - [ ] Instrukce od koučky
  - [ ] Poznámky klientky (textarea)

- [ ] **Navigation mezi dny**:
  - [ ] "Předchozí den" / "Další den" buttons
  - [ ] Disable pro nedostupné dny

### 6.4 Stránka "Materiály"

- [ ] **Všechny materiály z programu**:
  - [ ] Grid cards (podobně jako MaterialsLibrary)
  - [ ] Preview tlačítko

- [ ] **Filtr podle typu/kategorie**:
  - [ ] Dropdown: Všechny typy / Audio / PDF / Video atd.
  - [ ] Dropdown: Všechny kategorie

- [ ] **Search**:
  - [ ] TextField s magnifying glass ikonou
  - [ ] Filter po názvu/popisu

### 6.5 Stránka "Profil" (Client)

- [ ] **Jméno, email**:
  - [ ] Read-only nebo editovatelné (podle nastavení)

- [ ] **Moje PROČ** (editovatelné):
  - [ ] Textarea s auto-save
  - [ ] Toast feedback

- [ ] **Změna hesla** (připraveno na Supabase):
  - [ ] Formulář: Staré heslo, Nové heslo, Potvrzení
  - [ ] Validace (min 8 znaků atd.)

- [ ] **Certifikáty** (seznam dokončených programů):
  - [ ] Grid/list certifikátů
  - [ ] Tlačítko "Stáhnout"

**Soubory k vytvoření**:
- `ClientSidebar.jsx`
- `ClientDashboard.jsx`
- `MyProgram.jsx`
- `ClientMaterials.jsx`

**Soubory k úpravě**:
- `ClientProfile.jsx` (expand with password change + certificates)

---

## 📧 Sprint 7a: Email Workflow System

**Zdroj**: Sprint 11 (9.3) z MASTER_TODO_V2.md
**Priorita**: MEDIUM
**Odhad**: 6-8 hodin
**Cíl**: Koučka může vytvářet automatické workflow pro posílání programů po dokončení

### 7.1 Datová Struktura - EmailWorkflow

- [ ] **EmailWorkflow object**:
  ```javascript
  {
    id: "uuid",
    coachId: "uuid",
    name: "Onboarding workflow",
    triggers: [
      {
        type: "program_completed", // trigger event
        programId: "uuid", // který program dokončen
      }
    ],
    actions: [
      {
        type: "send_email",
        delay: 0, // okamžitě nebo za X dní
        emailTemplate: {
          subject: "Gratulujeme! 🎉 Máme pro tebe další program",
          body: "...",
        },
        attachProgramId: "uuid", // další program k poslání
      }
    ],
    active: true,
    createdAt: "ISO timestamp"
  }
  ```

### 7.2 WorkflowBuilder Stránka (Coach)

- [ ] **Route**: `/coach/workflows`

- [ ] **Vytvoř workflow**:
  - [ ] Step 1: Vyber trigger
    - [ ] Dropdown: "Dokončen program X"
    - [ ] Multi-select programů

  - [ ] Step 2: Vyber akci
    - [ ] Dropdown: "Pošli e-mail s programem Y"
    - [ ] Select program Y

  - [ ] Step 3: Vyber delay
    - [ ] Radio buttons: Okamžitě / Za 1 den / Za 7 dní / Custom
    - [ ] NumberInput pro custom delay

  - [ ] Step 4: Email template editor
    - [ ] Subject field
    - [ ] Body textarea (s placeholders: {{clientName}}, {{programName}})
    - [ ] Preview

- [ ] **Uložit workflow**:
  - [ ] Validation
  - [ ] Save to localStorage/Supabase
  - [ ] Toast: "Workflow vytvořen!"

### 7.3 Workflow Execution

- [ ] **Poslech na event "program_completed"**:
  - [ ] Listener v storage.js nebo nový eventManager.js
  - [ ] Při dokončení programu: trigger workflows

- [ ] **Trigger workflow**:
  - [ ] Find všechny workflows s matching trigger
  - [ ] For each workflow:
    - [ ] Check delay
    - [ ] If delay = 0: execute okamžitě
    - [ ] If delay > 0: schedule execution (setTimeout nebo cron)

- [ ] **Odeslání e-mailu** (zatím mock/console.log, později Supabase):
  - [ ] Replace placeholders v template
  - [ ] Log: "Email sent to {{clientEmail}}"
  - [ ] Toast (coach): "Email odeslán klientce {{clientName}}"

### 7.4 Seznam Workflows

- [ ] **WorkflowsList.jsx**:
  - [ ] Grid/List view všech workflows
  - [ ] Aktivovat/deaktivovat (toggle switch)
  - [ ] Editovat (otevře WorkflowBuilder v edit mode)
  - [ ] Smazat (s potvrzením)
  - [ ] Statistiky: "Spuštěno: 15× za poslední měsíc"

**Soubory k vytvoření**:
- `WorkflowBuilder.jsx`
- `WorkflowsList.jsx`
- `/src/modules/coach/utils/eventManager.js`

**Soubory k úpravě**:
- `storage.js` (trigger workflow on program completion)

---

## 🖼️ Sprint 8a: Náhledy Služeb (Canva, Figma, Miro)

**Zdroj**: Sprint 11 (9.4) z MASTER_TODO_V2.md
**Priorita**: MEDIUM
**Odhad**: 3-4 hodiny

### 8.1 Update linkDetection.js

- [ ] **Přidat Canva detection**:
  - [ ] Regex pattern: `canva.com/design/...`
  - [ ] linkType: `'canva'`
  - [ ] embedSupport: `true` nebo `false` (testovat)

- [ ] **Přidat Figma detection**:
  - [ ] Regex pattern: `figma.com/file/...`
  - [ ] linkType: `'figma'`
  - [ ] embedSupport: `true`

- [ ] **Přidat Miro detection**:
  - [ ] Regex pattern: `miro.com/app/board/...`
  - [ ] linkType: `'miro'`
  - [ ] embedSupport: `true`

### 8.2 GetEmbedUrl() - Update

- [ ] **Canva embed URL format**:
  - [ ] Research embed API (možná nutný API key?)
  - [ ] Fallback: otevřít v novém okně

- [ ] **Figma embed URL format**:
  - [ ] Format: `https://www.figma.com/embed?embed_host=coachpro&url=...`

- [ ] **Miro embed URL format**:
  - [ ] Format: `https://miro.com/app/live-embed/...`

### 8.3 Správná Loga Služeb

- [ ] **Canva logo**:
  - [ ] SVG nebo PNG
  - [ ] Vícebarevné (Canva brand colors)

- [ ] **Figma logo**:
  - [ ] SVG
  - [ ] Black & white nebo vícebarevné

- [ ] **Miro logo**:
  - [ ] SVG
  - [ ] Yellow brand color

- [ ] **Update linkMeta.icon** pro všechny služby:
  - [ ] Canva: `<Canva />` komponenta
  - [ ] Figma: `<Figma />` komponenta
  - [ ] Miro: `<Miro />` komponenta

### 8.4 Testovat Náhledy

- [ ] **Safari, Chrome, Firefox**:
  - [ ] Embed funguje?
  - [ ] Fallback funguje?

- [ ] **Mobile vs. Desktop**:
  - [ ] Responsive?
  - [ ] Touch controls?

- [ ] **Fallback na external link**:
  - [ ] Pokud embed nefunguje → tlačítko "Otevřít v novém okně"

**Soubory k vytvoření**:
- `/src/assets/service-logos/Canva.jsx`
- `/src/assets/service-logos/Figma.jsx`
- `/src/assets/service-logos/Miro.jsx`

**Soubory k úpravě**:
- `linkDetection.js`
- `PreviewModal.jsx` (add Canva/Figma/Miro rendering)
- `DailyView.jsx` (add Canva/Figma/Miro rendering)

---

## ✏️ Sprint 9a: Material Edit - Full Replacement

**Zdroj**: Sprint 11 (9.5) z MASTER_TODO_V2.md
**Priorita**: MEDIUM
**Odhad**: 2-3 hodiny
**Problém**: V edit modu nelze nahradit soubor novým (jen změnit metadata)

### 9.1 AddMaterialModal - Rozšíření

- [ ] **Pokud isEditMode && file-based typ (audio/video/pdf/image/document)**:
  - [ ] Zobrazit current file info (název, velikost)
  - [ ] Tlačítko "Smazat soubor a nahradit novým"
  - [ ] Potvrzení: "Opravdu chceš smazat tento soubor?"

- [ ] **Po smazání**:
  - [ ] Smazat ze Supabase Storage (pokud tam je)
  - [ ] Zobrazit upload zone
  - [ ] Umožnit nahrát nový soubor
  - [ ] Update material.content, fileSize, fileName, duration, pageCount atd.

### 9.2 Zachovat Metadata

- [ ] **Logika**:
  - [ ] Pokud koučka mění jen text/link → zachovat původní soubor
  - [ ] Pokud koučka nahrává nový soubor → přepsat vše

- [ ] **Validace**:
  - [ ] Nový soubor musí být stejného typu (audio → audio, PDF → PDF)
  - [ ] Error: "Nelze nahrát PDF místo audio souboru. Zvol správný typ."

**Soubory k úpravě**:
- `AddMaterialModal.jsx` (lines ~400-600)

---

## 🌐 Sprint 10a: Veřejný Coach Profile + 2 Úrovně

**Zdroj**: Sprint 10 (9.2, 9.3, 9.4, 9.5, 9.6) z MASTER_TODO_V2.md
**Priorita**: HIGH
**Odhad**: 8-12 hodin
**Cíl**: Veřejná landing page kouče + Info o koučce uvnitř programu + WordPress integrace

### 10.1 Datová Struktura - Coach Object (Rozšíření)

- [ ] **Přidat nová pole**:
  ```javascript
  {
    // Základní info (rozšíření)
    urlSlug: "lenna-novakova",
    profilePhoto: "base64 nebo Supabase URL",
    tagline: "Koučka pro ženy v podnikání",
    bio: "Dlouhý text o mně (800 znaků)",
    story: "Můj příběh - jak jsem se stala koučkou (1500 znaků)", // ← NOVÉ!

    // Kvalifikace
    education: "ICF akreditace, XYZ škola",
    experience: "300+ hodin koučinku, 5 let praxe",
    certifications: [
      { title: "ICF ACC", image: "base64/URL", year: "2023" }
    ],
    authorityMemberships: [ // ← NOVÉ!
      "ICF Česká republika",
      "Asociace koučů ČR"
    ],

    // Oblasti koučinku
    coachingAreas: ["career", "business", "confidence"],

    // Sociální sítě
    socialLinks: {
      instagram: "",
      linkedin: "",
      website: "",
      facebook: ""
    },

    // Kontakt a dostupnost
    contactInfo: { // ← NOVÉ!
      email: "lenna@example.com",
      phone: "+420 xxx xxx xxx",
      whatsapp: "+420 xxx xxx xxx",
      availability: "Po-Pá 9-17h",
      timezone: "Europe/Prague"
    },

    // Kalendář (pro budoucnost)
    calendarLink: "https://calendly.com/lenna", // ← NOVÉ!

    // Lead magnet
    leadMagnetProgramId: "uuid",

    // Tier & balíčky
    tier: "free", // "free" nebo "pro"
    trialEndsAt: "ISO timestamp",
    servicePackages: [ // ← NOVÉ!
      {
        id: "uuid",
        name: "Základní",
        description: "7 dní programu + 1x zpětná vazba",
        price: 1500,
        currency: "CZK",
        includes: {
          programAccess: true,
          feedbackCount: 1,
          feedbackType: "text", // "text", "voice", "video"
          whatsappSupport: false,
          customMaterials: false
        }
      }
    ],

    // Digitální podpis (pro certifikáty)
    signatureImage: "base64", // ← NOVÉ!
    signatureVisibleInProfile: false // nepublikovat podpis
  }
  ```

- [ ] **Aktualizovat storage.js** s novými fieldy
- [ ] **Migrace dat** - pokud už existují koučky v localStorage

### 10.2 CoachOnboarding - 6kroková (Rozšíření)

- [ ] **Krok 1: Základní info**:
  - [ ] Fotka (upload + preview)
  - [ ] Jméno, email, telefon
  - [ ] URL slug (auto-generate z jména)

- [ ] **Krok 2: O mně**:
  - [ ] Tagline (80 znaků)
  - [ ] Bio (800 znaků)
  - [ ] **Můj příběh** (1500 znaků) - NOVÉ!
  - [ ] Sociální sítě (Instagram, LinkedIn, Website, Facebook)

- [ ] **Krok 3: Kvalifikace**:
  - [ ] Kde studovala (text)
  - [ ] Zkušenosti (text)
  - [ ] Certifikáty (upload multiple)
  - [ ] **Členství v autoritách** (multi-select: ICF, ČAKO atd.) - NOVÉ!

- [ ] **Krok 4: Oblasti koučinku**:
  - [ ] Multi-select z 15+ oblastí (viz COACHING_AREAS)

- [ ] **Krok 5: Kontakt & Dostupnost** - NOVÉ!:
  - [ ] Email, telefon, WhatsApp
  - [ ] Dostupnost (text: "Po-Pá 9-17h")
  - [ ] Časová zóna (dropdown)
  - [ ] Kalendář link (Calendly atd.)

- [ ] **Krok 6: Digitální podpis** - NOVÉ!:
  - [ ] Upload podpisu (pro certifikáty)
  - [ ] Náhled: "Takto bude vypadat na certifikátech"
  - [ ] Info: "Podpis nebude veřejný"

- [ ] **Uložení + redirect na Dashboard**

### 10.3 PublicCoachProfile - Veřejná Landing Page (Rozšíření)

- [ ] **Route**: `/coach/:urlSlug` (např. `/coach/lenna-novakova`)

- [ ] **Hero sekce**:
  - [ ] Velká fotka (200×200px)
  - [ ] Jméno + tagline
  - [ ] Bio text
  - [ ] Sociální sítě (ikony s linky)

- [ ] **Můj příběh** - NOVÉ!:
  - [ ] Rozbalovací sekce (accordion nebo plná stránka)
  - [ ] Emotivní text - proč dělám koučink
  - [ ] Možnost přidat fotky z cesty

- [ ] **Oblasti koučinku**:
  - [ ] Grid karet s ikonami
  - [ ] **Rozšířit na 15+ oblastí** (viz rešerše níže)

- [ ] **Kvalifikace**:
  - [ ] Vzdělání
  - [ ] Zkušenosti
  - [ ] Certifikáty (galerie)
  - [ ] **Členství v autoritách** (ICF logo atd.) - NOVÉ!

- [ ] **Edukační sekce "Co je koučink?"**:
  - [ ] 3 otázky:
    - [ ] Co je to koučink a jak funguje?
    - [ ] K čemu je koučink dobrý?
    - [ ] **K čemu koučink NENÍ určený** - důraz na terapii!

- [ ] **Balíčky služeb** - NOVÉ!:
  - [ ] Card pro každý balíček
  - [ ] Cena, popis, co zahrnuje
  - [ ] CTA: "Mám zájem"

- [ ] **Lead magnet program**:
  - [ ] Zdarma "ochutnávka"
  - [ ] Registrační formulář

- [ ] **Kontakt & Dostupnost** - NOVÉ!:
  - [ ] Email, telefon, WhatsApp (tlačítka s linky)
  - [ ] Dostupnost: "Po-Pá 9-17h"
  - [ ] **Kalendář pro rezervaci** - iframe nebo link

- [ ] **Kontaktní formulář**

- [ ] **Responsive design**

### 10.4 Info o Koučce UVNITŘ Programu - NOVÉ!

- [ ] **"O koučce" karta v DailyView**:
  - [ ] Mini profil koučky
  - [ ] Fotka + jméno
  - [ ] Tlačítko "Kontaktovat koučku"
  - [ ] Tlačítko "Rezervovat termín"

- [ ] **"O koučce" modal** - rozbalit:
  - [ ] Celý profil (stejný jako PublicCoachProfile)
  - [ ] Kontakty, balíčky, certifikáty

- [ ] **Sticky kontakt tlačítko** (mobile):
  - [ ] Vždy viditelné
  - [ ] Rychlý přístup k WhatsApp/Email

### 10.5 WordPress Prodejní Stránka - Příprava

- [ ] **Specifikace pro WP dev**:
  - [ ] Landing page s USP pro koučky
  - [ ] "Jak to funguje" sekce
  - [ ] Pricing tabulka (Free vs. Pro)
  - [ ] Testimonials od kouček
  - [ ] CTA: "Vyzkoušet zdarma"
  - [ ] Integrace s CoachPro (iframe nebo redirecty)

- [ ] **API endpoint pro WP → CoachPro**:
  - [ ] Registrace koučky z WP
  - [ ] Automatické vytvoření účtu v CoachPro
  - [ ] Email s přístupem

### 10.6 VOP, GDPR, O Aplikaci

- [ ] **VOP.jsx** - placeholder text
- [ ] **GDPR.jsx** - detailní info
- [ ] **O aplikaci** - nová stránka!:
  - [ ] Co je CoachProApp
  - [ ] Pro koho je určená
  - [ ] Jak funguje
  - [ ] Kontakty
  - [ ] Changelog (historie verzí)

- [ ] **Footer na všech stránkách**:
  - [ ] O aplikaci | VOP | GDPR
  - [ ] © 2025 CoachPro • Vytvořeno s 💚 a Claude AI
  - [ ] info@coachpro.cz

**Soubory k vytvoření**:
- `CoachOnboarding.jsx` (upgrade)
- `PublicCoachProfile.jsx`
- `VOP.jsx`
- `GDPR.jsx`
- `AboutApp.jsx`
- `Footer.jsx`

**Soubory k úpravě**:
- `storage.js` (Coach object schema)
- `DailyView.jsx` (add "O koučce" card)

---

## 🎁 Sprint 11a: Nové Typy Materiálů (20+ typů)

**Zdroj**: Sprint 10 (9.1, 9.2, 9.3) z MASTER_TODO_V2.md
**Priorita**: MEDIUM
**Odhad**: 10-15 hodin
**Aktuálně máme**: Audio, PDF, Text, Link, Image, Video, Document

### 11.1 Rozšíření Typů Materiálů

**Přidat 20+ nových typů**:

- [ ] **Úkoly (Tasks)**:
  - [ ] Checkbox list
  - [ ] Klientka odškrtává
  - [ ] Koučka vidí completion

- [ ] **Kvízy (Quizzes)**:
  - [ ] Multiple choice otázky
  - [ ] Správné/špatné odpovědi (volitelné)
  - [ ] Vyhodnocení na konci
  - [ ] Export výsledků pro koučku

- [ ] **Šablony (Templates/Worksheets)**:
  - [ ] PDF ke stažení
  - [ ] Editovatelné (fillable PDF)
  - [ ] Příklady: Kolo života, SMART goals, Values assessment

- [ ] **Journal prompts (Výzvy k psaní)**:
  - [ ] Otázky k reflexi
  - [ ] Klientka píše odpovědi
  - [ ] Možnost sdílet s koučkou

- [ ] **Motivační zprávy**:
  - [ ] Krátké texty (max 500 znaků)
  - [ ] Emoji support
  - [ ] Kategorie: Ráno, Večer, Během dne

- [ ] **Dechová cvičení (Breathing exercises)**:
  - [ ] Animovaný guide (např. 4-7-8)
  - [ ] Audio nápověda (volitelné)
  - [ ] Timer

- [ ] **Body scan meditace**:
  - [ ] Speciální kategorie audio
  - [ ] Časová osa (10/20/30 min)

- [ ] **Guided visualizations (Řízené vizualizace)**:
  - [ ] Audio nebo video
  - [ ] Témata: Úspěch, Klid, Síla atd.

- [ ] **Goal trackers (Sledování cílů)**:
  - [ ] Definuj cíl
  - [ ] Milníky
  - [ ] Progress bar
  - [ ] Oslavy při dosažení

- [ ] **Habit trackers (Sledování návyků)**:
  - [ ] Denní checkbox
  - [ ] Streak counter
  - [ ] Vizuální kalendář

- [ ] **Gratitude journal (Deník vděčnosti)**:
  - [ ] Denní 3 věci, za které jsem vděčná
  - [ ] Historie záznamů
  - [ ] Export

- [ ] **Vision board (Vizuální tabule)**:
  - [ ] Upload obrázků
  - [ ] Drag&drop layout
  - [ ] Inspirace pro budoucnost

- [ ] **Action plans (Akční plány)**:
  - [ ] Krok 1, 2, 3...
  - [ ] Deadline pro každý krok
  - [ ] Checkbox completion

- [ ] **Decision matrix**:
  - [ ] Výhody vs. Nevýhody
  - [ ] Skóre pro každou možnost
  - [ ] Doporučení

- [ ] **Energy management tool**:
  - [ ] Zaznamenej energii během dne (1-10)
  - [ ] Graf energie v čase
  - [ ] Insights: "Tvoje peak je v 10h"

- [ ] **Time audit (Audit času)**:
  - [ ] Jak trávím čas (kategorie)
  - [ ] Koláčový graf
  - [ ] Doporučení pro optimalizaci

- [ ] **Self-care checklist**:
  - [ ] Denní/týdenní úkoly
  - [ ] Tělo, mysl, vztahy, radost
  - [ ] Odškrtávání

- [ ] **Confidence builders**:
  - [ ] Seznam úspěchů
  - [ ] Pozitivní afirmace
  - [ ] "Bank síly" - čerpat v těžkých chvílích

### 11.2 Kategorie Materiálů (Rozšířit)

- [ ] **Meditace → rozdělit**:
  - [ ] Body scan
  - [ ] Mindfulness
  - [ ] Loving-kindness

- [ ] **Afirmace → rozdělit**:
  - [ ] Ráno
  - [ ] Večer
  - [ ] Před výzvou

- [ ] **Cvičení → rozdělit**:
  - [ ] Physical
  - [ ] Mental
  - [ ] Emotional

- [ ] **Reflexe → rozdělit**:
  - [ ] Journal prompts
  - [ ] Questions
  - [ ] Worksheets

- [ ] **Ostatní**

### 11.3 Datová Struktura pro Nové Typy

- [ ] **Aktualizovat Material schema**:
  ```javascript
  {
    id: "uuid",
    type: "quiz", // nové typy
    title: "Kvíz: Jaký typ klientky jsi?",
    description: "Zjisti svůj typ",
    content: { // složitější struktura pro kvízy atd.
      questions: [
        {
          question: "Text otázky",
          options: ["A", "B", "C"],
          correctAnswer: 0 // index (volitelné)
        }
      ]
    },
    category: "reflection",
    subCategory: "quiz", // nové
    duration: 300, // odhadovaný čas (sekundy)
    difficulty: "beginner", // beginner, intermediate, advanced
    tags: ["sebevědomí", "osobnost"], // nové!
    createdAt: "ISO timestamp",
    updatedAt: "ISO timestamp" // nové!
  }
  ```

- [ ] **AddMaterialModal - multi-step wizard**:
  - [ ] Krok 1: Vyber typ
  - [ ] Krok 2: Nahrát/vyplnit (podle typu)
  - [ ] Krok 3: Metadata (název, popis, kategorie, tagy)
  - [ ] Krok 4: Náhled

### 11.4 Renderování Nových Typů

- [ ] **QuizRenderer komponenta**:
  - [ ] Otázky po jedné
  - [ ] Progress bar
  - [ ] Vyhodnocení na konci

- [ ] **TaskListRenderer**:
  - [ ] Checkbox list
  - [ ] Odškrtávání s animací
  - [ ] Progress: "3/10 dokončeno"

- [ ] **JournalPromptRenderer**:
  - [ ] Otázka + textarea
  - [ ] Auto-save
  - [ ] Možnost sdílet s koučkou

- [ ] **HabitTrackerRenderer**:
  - [ ] Kalendář view
  - [ ] Streak counter
  - [ ] Oslavy při milestone (7, 30, 100 dní)

- [ ] **GoalTrackerRenderer**:
  - [ ] Progress bar
  - [ ] Milníky s checkpointy
  - [ ] Motivační zprávy

**Soubory k vytvoření**:
- `QuizRenderer.jsx`
- `TaskListRenderer.jsx`
- `JournalPromptRenderer.jsx`
- `HabitTrackerRenderer.jsx`
- `GoalTrackerRenderer.jsx`
- ... (~15+ renderer komponent)

**Soubory k úpravě**:
- `storage.js` (Material schema)
- `AddMaterialModal.jsx` (multi-step wizard)
- `MaterialRenderer.jsx` (switch case pro nové typy)

---

## 🔗 Sprint 12a: Sdílení Materiálů - Individual Share

**Zdroj**: Sprint 10 (9.1) z MASTER_TODO_V2.md
**Priorita**: HIGH (částečně hotové - sdílení existuje, ale tracking ne)
**Odhad**: 2-3 hodiny
**Status**: Share button a modal již existuje, ale chybí public view a tracking

### 12.1 Public Material View - DOPLNIT

**Status**: ✅ Route `/client/material/:code` již existuje, ale potřebuje upgrady

- [ ] **Přidat tracking**:
  - [ ] Počet otevření materiálu (increment při load)
  - [ ] Timestamp každého otevření
  - [ ] IP address (optional, GDPR compliance)

- [ ] **CTA na konci**:
  - [ ] "Chceš víc? Kontaktuj koučku"
  - [ ] Tlačítko "Kontaktovat"
  - [ ] Tlačítko "Prohlédnout programy"

### 12.2 MaterialShareModal - DOPLNIT

**Status**: ✅ Modal již existuje, ale chybí historie sdílení

- [ ] **Historie sdílení**:
  - [ ] Seznam všech sdílených instancí tohoto materiálu
  - [ ] Pro každou instanci: Datum, Počet otevření
  - [ ] Tlačítko "Deaktivovat" (zneplatnit shareCode)

### 12.3 Tracking Dashboard (Coach)

- [ ] **MaterialCard - zobrazit statistiky**:
  - [ ] Badge: "Sdíleno: 3×"
  - [ ] Tooltip: "Celkem 45 otevření"

- [ ] **MaterialDetail modal - statistiky**:
  - [ ] Graf otevření v čase
  - [ ] Top 3 klientky podle otevření

**Soubory k úpravě**:
- `MaterialView.jsx` (add tracking)
- `ShareMaterialModal.jsx` (add history)
- `MaterialCard.jsx` (add stats badge)
- `storage.js` (add tracking functions)

---

## 💼 Sprint 13a: Balíčky Služeb (Service Packages)

**Zdroj**: Sprint 10 (9.2) z MASTER_TODO_V2.md
**Priorita**: MEDIUM
**Odhad**: 5-6 hodin
**Status**: Zcela nedokončeno

### 13.1 Datová Struktura

- [ ] **ServicePackage object**:
  ```javascript
  {
    id: "uuid",
    coachId: "uuid",
    name: "Základní balíček",
    description: "7 dní programu + 1x zpětná vazba",
    price: 1500,
    currency: "CZK",
    duration: 7, // dní
    includes: {
      programAccess: true,
      programIds: ["uuid"], // které programy zahrnuje
      feedbackCount: 1, // kolik zpětných vazeb
      feedbackType: "text", // "text", "voice", "video", "call"
      feedbackDeadline: "24h", // do kdy odpovíme
      whatsappSupport: false,
      emailSupport: true,
      customMaterials: false, // může klientka požádat o custom materiály
      liveSessions: 0, // počet live callů
      liveSessionDuration: 0, // minuty
      extras: [
        "Přístup k privátní FB skupině",
        "Měsíční newsletter"
      ]
    },
    active: true,
    createdAt: "ISO timestamp"
  }
  ```

### 13.2 PackagesList Stránka (Coach)

- [ ] **Route**: `/coach/packages`

- [ ] **Grid balíčků**:
  - [ ] Card pro každý balíček
  - [ ] Cena prominentně
  - [ ] Co zahrnuje (bullet list)
  - [ ] Tlačítko "Upravit"
  - [ ] Tlačítko "Smazat"
  - [ ] Toggle "Aktivní"

- [ ] **Přidat balíček**:
  - [ ] Floating Action Button
  - [ ] Otevře AddPackageModal

### 13.3 AddPackageModal

- [ ] **Formulář**:
  - [ ] Název (required)
  - [ ] Popis (textarea, 500 znaků)
  - [ ] Cena (NumberInput)
  - [ ] Měna (dropdown: CZK, EUR, USD)
  - [ ] Délka (NumberInput, dny)

- [ ] **Co zahrnuje (checkboxy)**:
  - [ ] Přístup k programu
  - [ ] Počet zpětných vazeb (NumberInput)
  - [ ] Typ zpětné vazby (radio: text/voice/video/call)
  - [ ] Deadline zpětné vazby (text: "24h", "48h")
  - [ ] WhatsApp support (checkbox)
  - [ ] Email support (checkbox)
  - [ ] Custom materiály (checkbox)
  - [ ] Live sessions (NumberInput: počet)
  - [ ] Délka live session (NumberInput: minuty)

- [ ] **Extras (volitelné)**:
  - [ ] Textarea pro list extras (např. "Přístup k FB skupině")

- [ ] **Vyber programy**:
  - [ ] Multi-select programů

- [ ] **Preview**:
  - [ ] Jak bude vypadat na PublicCoachProfile

### 13.4 PublicCoachProfile - Zobrazit Balíčky

**Status**: PublicCoachProfile ještě neexistuje (Sprint 10a)

- [ ] **Pricing sekce**:
  - [ ] Grid pricing cards (3 sloupce max)
  - [ ] Highlighted doporučený balíček
  - [ ] "Mám zájem" CTA
  - [ ] Kontaktní formulář s výběrem balíčku

### 13.5 Klientka si Vybere Balíček při Registraci

- [ ] **ClientEntry - upgrade**:
  - [ ] Po zadání kódu programu:
    - [ ] Zobrazit dostupné balíčky
    - [ ] Klientka vybere balíček
    - [ ] Uložit `packageId` do Client object

- [ ] **Client object - přidat pole**:
  ```javascript
  {
    packageId: "uuid",
    packageName: "Základní balíček",
    feedbackCredits: 1, // zbývající počet zpětných vazeb
  }
  ```

- [ ] **DailyView - zobrazit info o balíčku**:
  - [ ] Card: "Tvůj balíček: Základní"
  - [ ] Co zahrnuje (bullet list)
  - [ ] Zbývající feedback credits

**Soubory k vytvoření**:
- `PackagesList.jsx`
- `AddPackageModal.jsx`

**Soubory k úpravě**:
- `storage.js` (ServicePackage schema)
- `ClientEntry.jsx` (package selection)
- `DailyView.jsx` (show package info)

---

## 💭 Sprint 14a: Klientka - Onboarding & Notes

**Zdroj**: Sprint 12 (10.1, 10.2) z MASTER_TODO_V2.md
**Priorita**: HIGH
**Odhad**: 4-5 hodin

### 14.1 Onboarding Klientky - "Moje PROČ"

- [ ] **ClientOnboarding komponenta**:
  - [ ] **Krok 1: Základní info**:
    - [ ] Jméno (required)
    - [ ] Email (required, validace)

  - [ ] **Krok 2: Definuj svoje PROČ**:
    - [ ] "Proč jdeš do koučinku?" (textarea, 500 znaků)
    - [ ] "Co očekáváš?" (textarea, 300 znaků)
    - [ ] "Kam směřuješ?" (textarea, 300 znaků)

  - [ ] **Krok 3: Vstup do programu**:
    - [ ] Redirect na DailyView

- [ ] **Uložit do Client object**:
  ```javascript
  {
    whyStatement: {
      why: "Text...",
      expectations: "Text...",
      direction: "Text..."
    }
  }
  ```

- [ ] **Zobrazit v Dashboard klientky**:
  - [ ] Card "Moje PROČ"
  - [ ] Zobrazit whyStatement
  - [ ] Možnost upravit (otevře modal)
  - [ ] Připomenutí v těžkých chvílích (motivační popup?)

### 14.2 Poznámky Klientky

- [ ] **Notes komponenta v DailyView**:
  - [ ] Textarea pro poznámky
  - [ ] Auto-save (debounced 5s)
  - [ ] Indikátor: "Uloženo" / "Ukládám..."
  - [ ] Historie poznámek (podle dne)

- [ ] **Notes archive stránka**:
  - [ ] Route: `/client/notes`
  - [ ] Všechny poznámky (timeline view)
  - [ ] Filtrovat podle data/programu
  - [ ] Exportovat jako PDF
  - [ ] Vyhledávání (full-text search)

- [ ] **Sdílení poznámek s koučkou** (volitelné):
  - [ ] Checkbox: "Sdílet s koučkou"
  - [ ] Koučka vidí v ClientDetail
  - [ ] Možnost komentovat (budoucnost)

**Soubory k vytvoření**:
- `ClientOnboarding.jsx`
- `NotesComponent.jsx`
- `NotesArchive.jsx`

**Soubory k úpravě**:
- `storage.js` (Client object - whyStatement, notes)
- `DailyView.jsx` (add Notes component)
- `ClientDashboard.jsx` (add "Moje PROČ" card)

---

## ✅ Sprint 15a: Klientka - Úkoly & Zpětná Vazba

**Zdroj**: Sprint 12 (10.3) z MASTER_TODO_V2.md
**Priorita**: HIGH
**Odhad**: 6-8 hodin

### 15.1 Task System

- [ ] **Task object**:
  ```javascript
  {
    id: "uuid",
    programId: "uuid",
    dayNumber: 1,
    title: "Napiš si 3 cíle na tento měsíc",
    description: "Použij SMART framework",
    isRequired: true, // povinný úkol
    createdAt: "ISO timestamp"
  }
  ```

- [ ] **Koučka přiřadí úkol k dni**:
  - [ ] ProgramEditor - Add Task button
  - [ ] Modal: Název, popis, povinný?
  - [ ] Uložit task do Program.days[x].tasks

- [ ] **Klientka vyplní odpověď**:
  - [ ] DailyView - zobrazit úkoly
  - [ ] Textarea pro odpověď
  - [ ] Tlačítko "Uložit odpověď"

- [ ] **Tlačítko "Požádat o zpětnou vazbu"**:
  - [ ] Visible po uložení odpovědi
  - [ ] Otevře FeedbackRequestModal

### 15.2 Žádost o Zpětnou Vazbu

- [ ] **FeedbackRequestModal**:
  - [ ] Úkol (pre-filled, read-only)
  - [ ] Moje odpověď (pre-filled, read-only)
  - [ ] Konkrétní otázka pro koučku (textarea, optional)
  - [ ] Tlačítko "Poslat žádost"

- [ ] **Podle balíčku - kontrola credits**:
  - [ ] Zkontrolovat `client.feedbackCredits`
  - [ ] Pokud 0 → Error: "Nemáš žádné zbývající zpětné vazby. Kontaktuj koučku."
  - [ ] Pokud > 0 → Odečíst 1 credit

- [ ] **FeedbackRequest object**:
  ```javascript
  {
    id: "uuid",
    clientId: "uuid",
    coachId: "uuid",
    taskId: "uuid",
    taskTitle: "...",
    clientAnswer: "...",
    clientQuestion: "...",
    status: "pending", // "pending", "answered"
    requestedAt: "ISO timestamp",
    deadline: "ISO timestamp", // podle balíčku (24h, 48h)
    coachResponse: {
      type: "text", // "text", "voice", "video"
      content: "...",
      answeredAt: "ISO timestamp"
    }
  }
  ```

### 15.3 Notifikace pro Koučku

- [ ] **Dashboard widget**:
  - [ ] Card: "Čekající žádosti o zpětnou vazbu"
  - [ ] Počet: "3 nové"
  - [ ] Tlačítko "Zobrazit všechny"

- [ ] **FeedbackRequests stránka (Coach)**:
  - [ ] Route: `/coach/feedback-requests`
  - [ ] List všech žádostí
  - [ ] Filter: Pending / Answered
  - [ ] Sort: By deadline (nejstarší first)

### 15.4 Koučka Odpovídá

- [ ] **FeedbackRequestDetail modal**:
  - [ ] Zobrazit úkol, odpověď klientky, otázku
  - [ ] Typ odpovědi (radio: text/voice/video)

- [ ] **Text odpověď**:
  - [ ] Textarea (500 znaků)
  - [ ] Tlačítko "Poslat"

- [ ] **Voice note odpověď**:
  - [ ] Audio recorder (browser API)
  - [ ] Max 5 minut
  - [ ] Upload do Supabase Storage

- [ ] **Video odpověď**:
  - [ ] Video recorder (browser API) nebo
  - [ ] Upload video file
  - [ ] Max 50 MB

- [ ] **Deadline podle balíčku**:
  - [ ] Zobrazit countdown timer
  - [ ] Warning pokud deadline blízko (< 6h)

- [ ] **Oznámení klientce**:
  - [ ] Email notification (budoucnost)
  - [ ] In-app notification: "Koučka odpověděla!"
  - [ ] Badge v Dashboard

**Soubory k vytvoření**:
- `FeedbackRequestModal.jsx`
- `FeedbackRequests.jsx` (Coach page)
- `FeedbackRequestDetail.jsx`
- `AudioRecorder.jsx`
- `VideoRecorder.jsx`

**Soubory k úpravě**:
- `storage.js` (Task, FeedbackRequest objects)
- `DailyView.jsx` (show tasks + feedback button)
- `CoachDashboard.jsx` (add widget)
- `ProgramEditor.jsx` (add Task assignment)

---

## 🏆 Sprint 16a: Certifikát - Upgrade s Podpisem

**Zdroj**: Sprint 12 (10.4) z MASTER_TODO_V2.md
**Priorita**: MEDIUM
**Odhad**: 3-4 hodiny
**Status**: Certifikát již existuje, ale chybí podpis kouče

### 16.1 Certificate Generator - Upgrade

- [ ] **Šablona s branding CoachPro**:
  - [ ] Logo CoachPro (top)
  - [ ] Certifikát rám (elegantní border)
  - [ ] Background: jemný gradient nebo watermark

- [ ] **Pole**:
  - [ ] Jméno klientky (velké, prominentní)
  - [ ] Název programu
  - [ ] Datum dokončení
  - [ ] **Podpis koučky** (z profilu) - NOVÉ!
  - [ ] Koučka: Jméno + certifikace (pod podpisem)
  - [ ] QR kód (pro verifikaci - budoucnost)

- [ ] **Export jako PNG/PDF**:
  - [ ] PNG pro social media sharing
  - [ ] PDF pro archivaci

### 16.2 Certificate Modal po Dokončení

- [ ] **Oslava s konfety** (už máme ✅):
  - [ ] Zkontrolovat, že funguje

- [ ] **Náhled certifikátu**:
  - [ ] Zobrazit generated certifikát
  - [ ] Zoom funkce (optional)

- [ ] **Tlačítko "Stáhnout"**:
  - [ ] Download PNG
  - [ ] Download PDF

- [ ] **Sdílet na sociálních sítích**:
  - [ ] Share buttons: Facebook, Instagram, LinkedIn
  - [ ] Pre-filled text: "Dokončila jsem program {{programName}}! 🎉"

### 16.3 Certificate Gallery pro Klientku

- [ ] **Route**: `/client/certificates`

- [ ] **Stránka se všemi certifikáty**:
  - [ ] Grid všech certifikátů
  - [ ] Thumbnail preview
  - [ ] Click → full-size modal

- [ ] **Historie úspěchů**:
  - [ ] Timeline view
  - [ ] Datum dokončení
  - [ ] Program název

**Soubory k úpravě**:
- `CelebrationModal.jsx` (upgrade certificate generation)
- `storage.js` (save certificates)

**Soubory k vytvoření**:
- `CertificateGallery.jsx`

---

## 📂 Sprint 17a: File Management - Limits & Duplicity

**Zdroj**: Sprint 13 (11.1, 11.2, 11.3) z MASTER_TODO_V2.md
**Priorita**: HIGH
**Odhad**: 4-5 hodin

### 17.1 Omezení Velikosti Souborů

- [ ] **Nastavit limity podle tiers**:
  - [ ] **Free tier**:
    - [ ] Max 10 MB per soubor
    - [ ] Max 100 MB celkem
  - [ ] **Pro tier**:
    - [ ] Max 50 MB per soubor
    - [ ] Max 1 GB celkem (Supabase)
  - [ ] **Test tier** (beta testers):
    - [ ] Max 5 MB per soubor
    - [ ] Max 50 MB celkem

- [ ] **Validace před uploadem**:
  - [ ] Zkontrolovat velikost souboru
  - [ ] Zkontrolovat celkové využití (sum všech materials)
  - [ ] Error: "Překročen limit. Zvažte upgrade nebo smažte stará data."

- [ ] **Progress bar při uploadu**:
  - [ ] Procenta (0-100%)
  - [ ] Velikost (MB/MB)
  - [ ] Tlačítko "Zrušit upload"

- [ ] **Storage Usage Widget (Coach Dashboard)**:
  - [ ] Zobrazit využití: "45 MB / 100 MB (45%)"
  - [ ] Progress bar
  - [ ] Warning pokud > 80%
  - [ ] CTA: "Upgrade na Pro" pokud free tier

### 17.2 Motivace k Cloud Storage

- [ ] **Toast po uploadu velkého souboru (> 5 MB)**:
  - [ ] "Tip: Uložte videa na YouTube nebo Google Drive a přidejte link 💡"
  - [ ] Tlačítko "Jak na to?"

- [ ] **Info card v AddMaterialModal**:
  - [ ] "💡 Doporučujeme nahrávat velké soubory na cloud:"
  - [ ] YouTube (videa)
  - [ ] Google Drive (PDF, audio)
  - [ ] Spotify (audio)
  - [ ] Odkaz: "Jak na to?" → tutorial

- [ ] **Tutorial: Jak nahrát na cloud**:
  - [ ] Step-by-step návod
  - [ ] Screenshots
  - [ ] Video tutorial (Loom)

### 17.3 Kontrola Duplicity

- [ ] **Detekce duplicitních materiálů**:
  - [ ] Stejný název + typ
  - [ ] Warning: "Materiál s tímto názvem už existuje. Chceš pokračovat?"
  - [ ] Možnost přejmenovat
  - [ ] Možnost "Nahradit existující"

- [ ] **Detekce duplicitních programů**:
  - [ ] Stejný název
  - [ ] Warning: "Program s tímto názvem už existuje."
  - [ ] Možnost klonovat program místo vytváření duplicity

- [ ] **Detekce duplicitních souborů (hash)**:
  - [ ] Pokud 2 soubory mají stejný MD5 hash
  - [ ] Info: "Tento soubor už je nahraný jako 'Meditace ranní'. Chceš použít ten?"
  - [ ] Možnost vytvořit alias (1 soubor, 2 materiály)

**Soubory k vytvoření**:
- `StorageUsageWidget.jsx`
- `CloudStorageTutorial.jsx`

**Soubory k úpravě**:
- `AddMaterialModal.jsx` (validation, progress bar, duplicity check)
- `storage.js` (tier limits, hash generation)
- `CoachDashboard.jsx` (add StorageUsageWidget)

---

## 🎨 Sprint 18a: UX Improvements - Theming & Dark Mode

**Zdroj**: Sprint 14 (14.1, 14.2, 14.3) z MASTER_TODO_V2.md
**Priorita**: MEDIUM
**Odhad**: 4-5 hodin
**Status**: Dark mode už máme ✅, ale theming systém ne

### 18.1 Systém Barevných Schémat (jako PaymentsPro)

- [ ] **ThemeContext - import z PaymentsPro**:
  - [ ] Použít stejný systém jako v my-paymentspro-app
  - [ ] Color palettes: `nature`, `ocean`, `sunset`, `minimal`, atd.
  - [ ] Support pro custom barvy

- [ ] **Theme switcher v Settings**:
  - [ ] Dropdown s náhledy barevných schémat
  - [ ] Live preview (okamžitá změna)
  - [ ] Uložit volbu do localStorage

- [ ] **Aplikovat themes**:
  - [ ] Všechny komponenty používají theme colors
  - [ ] Primary, secondary, accent colors
  - [ ] Gradient backgrounds
  - [ ] Border radius z theme

### 18.2 Dark Mode - Upgrade

**Status**: Dark mode již existuje ✅, ale needs improvements

- [ ] **Dark mode toggle**:
  - [ ] Switch v Settings nebo Header (už máme ✅)
  - [ ] Ikona: Slunce (light) / Měsíc (dark) (už máme ✅)
  - [ ] Uložit preference do localStorage (už máme ✅)

- [ ] **Dark mode theme - zkontrolovat konzistenci**:
  - [ ] Dark backgrounds (grays, near-black) - zkontrolovat všechny stránky
  - [ ] Light text colors - zkontrolovat čitelnost
  - [ ] Adjusted shadows a borders - zkontrolovat všechny karty
  - [ ] Glassmorphism v dark mode - zkontrolovat všechny modaly

- [ ] **Auto-detect system preference**:
  - [ ] `prefers-color-scheme: dark`
  - [ ] Možnost override (force light/dark)

### 18.3 Dashboard - Rychlé Akce na 1 Klik

- [ ] **Quick actions na Dashboard**:
  - [ ] "Přidat materiál" → otevře AddMaterialModal rovnou
  - [ ] "Vytvořit program" → otevře ProgramEditor rovnou
  - [ ] "Přidat klientku" → otevře AdminAddClientModal
  - [ ] Místo navigace na další stránku → okamžitá akce

- [ ] **Floating Action Button (FAB)**:
  - [ ] Sticky button v pravém dolním rohu
  - [ ] Hlavní akce podle kontextu stránky:
    - [ ] Dashboard → "Přidat materiál"
    - [ ] MaterialsLibrary → "Přidat materiál"
    - [ ] ProgramsList → "Vytvořit program"
    - [ ] ClientsList → "Přidat klientku"
  - [ ] Mobile-friendly

**Soubory k vytvoření**:
- `ThemeContext.jsx`
- `ThemeSwitcher.jsx`
- `FloatingActionButton.jsx`

**Soubory k úpravě**:
- `CoachDashboard.jsx` (add quick actions)
- `natureTheme.js` (expand with multiple themes)

---

## 🔘 Sprint 18b: Button Modularity System - Responsive & Consistent

**Zdroj**: Session 4.11.2025 večer - zjištěno při práci na MaterialsLibrary
**Priorita**: MEDIUM
**Odhad**: 6-8 hodin (refactor všech buttons napříč aplikací)
**Problém**: Buttons nemají modulární systém → hodně duplicitního kódu, nekonzistentní responsive behavior

### 18b.1 Současný Stav - Co Je Problém

**Theme overrides v `natureTheme.js` (lines 195-210)**:
```javascript
MuiButton: {
  styleOverrides: {
    root: {
      borderRadius: 8,  // ❌ Hardcoded, mělo by být BORDER_RADIUS.compact
      padding: '10px 24px',  // ❌ Hardcoded, není responsive
      fontSize: '0.875rem',
      fontWeight: 500,
    }
  }
}
```

**Aktuální inline řešení** (MaterialsLibrary.jsx, řádek 221-234):
```javascript
<Button
  variant="contained"
  sx={{
    whiteSpace: 'nowrap',
    alignSelf: 'flex-start',
    minWidth: 'fit-content',
    px: { xs: 2, sm: 3 },     // ❌ Inline, ne modular
    py: { xs: 0.75, sm: 1 }   // ❌ Inline, ne modular
  }}
>
```

**Co už máme modular** (funguje dobře):
- ✅ `createClientPreviewButton(isDark)` - MaterialCard.jsx
- ✅ `createIconButton(variant, isDark, size)` - modernEffects.js
- ✅ `createPrimaryModalButton(isDark)` - ShareMaterialModal, ShareProgramModal
- ✅ `createCancelButton(isDark)` - modaly
- ✅ `createSubmitButton(isDark)` - modaly

### 18b.2 Řešení - Modular Button System

**Vytvořit v `modernEffects.js`**:

```javascript
// Primary action button (hlavní akce - Přidat, Uložit, atd.)
export const createPrimaryButton = (isDark = false) => ({
  px: { xs: 2, sm: 3 },      // 16px → 24px
  py: { xs: 0.75, sm: 1 },   // 6px → 8px
  borderRadius: BORDER_RADIUS.compact,  // 16px
  whiteSpace: 'nowrap',
  fontWeight: 600,
  textTransform: 'none',
  background: isDark
    ? 'linear-gradient(135deg, rgba(139, 188, 143, 0.9) 0%, rgba(85, 107, 47, 0.85) 100%)'
    : 'linear-gradient(135deg, rgba(139, 188, 143, 0.95) 0%, rgba(85, 107, 47, 0.9) 100%)',
  boxShadow: '0 2px 8px rgba(85, 107, 47, 0.3)',
  transition: 'all 0.3s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 16px rgba(85, 107, 47, 0.4)',
  },
});

// Secondary button (vedlejší akce - Zrušit, Zavřít, atd.)
export const createSecondaryButton = (isDark = false) => ({
  px: { xs: 2, sm: 3 },
  py: { xs: 0.75, sm: 1 },
  borderRadius: BORDER_RADIUS.compact,
  whiteSpace: 'nowrap',
  fontWeight: 500,
  textTransform: 'none',
  border: '2px solid',
  borderColor: 'divider',
  backgroundColor: 'transparent',
  transition: 'all 0.3s',
  '&:hover': {
    borderColor: 'text.secondary',
    backgroundColor: isDark
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.05)',
  },
});

// Outlined button (alternativa k secondary)
export const createOutlinedButton = (isDark = false) => ({
  px: { xs: 2, sm: 3 },
  py: { xs: 0.75, sm: 1 },
  borderRadius: BORDER_RADIUS.compact,
  whiteSpace: 'nowrap',
  fontWeight: 500,
  textTransform: 'none',
});

// Text button (minimální styl - jen text)
export const createTextButton = () => ({
  px: { xs: 1.5, sm: 2 },
  py: { xs: 0.5, sm: 0.75 },
  fontWeight: 500,
  textTransform: 'none',
  minWidth: 'fit-content',
});

// Compact button (menší tlačítka pro UI s omezeným prostorem)
export const createCompactButton = (isDark = false) => ({
  px: { xs: 1.5, sm: 2 },
  py: { xs: 0.5, sm: 0.75 },
  fontSize: { xs: '0.75rem', sm: '0.8rem' },
  borderRadius: BORDER_RADIUS.small,  // 12px
  whiteSpace: 'nowrap',
  minWidth: 'fit-content',
});
```

### 18b.3 Aplikace Napříč Aplikací

**Fáze 1 - Kritické buttons** (2-3 hodiny):
- [ ] MaterialsLibrary.jsx - "Přidat materiál", "Vyčistit filtry"
- [ ] ProgramsList.jsx - "Vytvořit program"
- [ ] ClientsList.jsx - "Přidat klientku"
- [ ] CoachDashboard.jsx - všechna quick action tlačítka
- [ ] AddMaterialModal.jsx - "Zrušit", "Uložit změny"
- [ ] ProgramEditor.jsx - "Zrušit", "Uložit program"

**Fáze 2 - Modaly & Dialogy** (2-3 hodiny):
- [ ] ShareProgramModal.jsx - všechna tlačítka
- [ ] ShareMaterialModal.jsx - všechna tlačítka
- [ ] Delete dialogs - "Zrušit", "Smazat"
- [ ] Všechny confirmation dialogs

**Fáze 3 - Theme Overrides Fix** (1-2 hodiny):
- [ ] `natureTheme.js` - opravit MuiButton overrides:
  - [ ] `borderRadius: BORDER_RADIUS.compact` místo hardcoded 8
  - [ ] Responsive padding pomocí breakpoints
  - [ ] Zachovat základní styly (fontWeight, transition)

### 18b.4 Benefits

**Konzistence**:
- ✅ Všechna tlačítka vypadají stejně
- ✅ Stejný responsive behavior všude
- ✅ Jednotné hover efekty, transitions

**Maintenance**:
- ✅ Změna na jednom místě = změní se všude
- ✅ Snadné testování (změnit padding jen v jedné funkci)
- ✅ Token saving (méně duplicit)

**UX**:
- ✅ Lepší na touch zařízeních (větší touch targets na mobile)
- ✅ Konzistentní spacing
- ✅ Profesionální vzhled

### 18b.5 Testing Checklist

Po dokončení zkontrolovat:
- [ ] Všechna primary buttons mají stejný styl
- [ ] Všechna secondary buttons mají stejný styl
- [ ] Responsive padding funguje (xs → sm → md)
- [ ] Touch targets jsou dostatečné (min 44px na mobile)
- [ ] Hover efekty fungují konzistentně
- [ ] Dark/light mode support
- [ ] Žádné hardcoded values v komponentách

**Soubory k vytvoření**:
- Žádné (vše v existujících souborech)

**Soubory k úpravě**:
- `modernEffects.js` - přidat 5 button funkcí
- `natureTheme.js` - opravit MuiButton overrides
- 15+ komponent - aplikovat modular functions

**Dependencies**:
- Žádné nové

**Status**: ⏳ Pending - naplánováno na budoucnost

---

## 📅 Sprint 19a: Dashboard - Quick Actions & Dates

**Zdroj**: Sprint 14 (14.4, 14.5) z MASTER_TODO_V2.md
**Priorita**: LOW
**Odhad**: 2-3 hodiny

### 19.1 Automatické Datum - Materiály

- [ ] **Material object - přidat pole** (už máme ✅):
  ```javascript
  {
    createdAt: "ISO timestamp",  // už máme ✅
    updatedAt: "ISO timestamp",  // už máme ✅
  }
  ```

- [ ] **Zobrazit datum na MaterialCard**:
  - [ ] "Přidáno: 28. 10. 2025"
  - [ ] Nebo relativní: "před 2 dny"
  - [ ] Malý text pod názvem

- [ ] **Filtr podle data**:
  - [ ] V MaterialsLibrary
  - [ ] Dropdown: Nejnovější / Nejstarší
  - [ ] Date range picker: Tento týden / měsíc

### 19.2 Automatické Datum - Programy

- [ ] **Program object - přidat pole**:
  ```javascript
  {
    createdAt: "ISO timestamp",  // již máme ✅
    updatedAt: "ISO timestamp",  // přidat
  }
  ```

- [ ] **Zobrazit datum na ProgramCard**:
  - [ ] "Vytvořeno: 1. 11. 2025"
  - [ ] Nebo relativní: "před týdnem"

- [ ] **Filtr podle data v ProgramsList**:
  - [ ] Dropdown: Nejnovější / Nejstarší
  - [ ] Date range picker

**Soubory k úpravě**:
- `MaterialCard.jsx` (show date)
- `MaterialsLibrary.jsx` (date filter)
- `ProgramCard.jsx` (show date)
- `ProgramsList.jsx` (date filter)

---

## 🚀 Sprint 20a: Production Deployment - Pending Tasks

**Zdroj**: Production Deployment section z MASTER_TODO_V2.md (řádky 7169-7212)
**Priorita**: CRITICAL 🔥
**Odhad**: 4-6 hodin (Supabase migrace), + 2-3 hodiny (testing & checklist)

### 20.1 DNS Propagation & Email Verification

- [ ] **DNS propagace** (5-30 minut):
  - [ ] Zkontrolovat DKIM, SPF, MX, DMARC records
  - [ ] Ověřit domain: `online-byznys.cz`
  - [ ] Test email delivery z `beta@online-byznys.cz`

- [ ] **Resend.com - Production Mode**:
  - [ ] Změnit z beta workaround (všechny maily na admin)
  - [ ] Povolit posílání na real tester emails
  - [ ] Test: Registrace → email s access code

### 20.2 Supabase Database Migration 🔥 CRITICAL

**Čas**: 4-6 hodin
**Důvod**: localStorage se maže při změně browseru/domény → potřeba cloud database

- [ ] **Migrace tabulek**:
  - [ ] `coachpro_coaches` - z localStorage do Supabase
  - [ ] `coachpro_materials` - migrace file references
  - [ ] `coachpro_programs` - migrace program dat
  - [ ] `coachpro_clients` - migrace client progress
  - [ ] `coachpro_shared_materials` - migrace share codes
  - [ ] Check foreign key constraints (CRITICAL - viz Sprint 1 warning!)

- [ ] **Data migrace script**:
  ```javascript
  // Přečíst všechna data z localStorage
  const coaches = JSON.parse(localStorage.getItem('coachpro_users'));
  const materials = JSON.parse(localStorage.getItem('coachpro_materials'));

  // Batch insert do Supabase
  await supabase.from('coachpro_coaches').insert(coaches);
  await supabase.from('coachpro_materials').insert(materials);
  ```

- [ ] **Update storage.js**:
  - [ ] Změnit primary source: Supabase (ne localStorage)
  - [ ] localStorage = cache only
  - [ ] Sync pattern: Cloud-first, localStorage fallback

- [ ] **Testing po migraci**:
  - [ ] Přihlášení funguje
  - [ ] Materiály se načítají
  - [ ] Programy se načítají
  - [ ] Sdílení funguje
  - [ ] QR kódy fungují

### 20.3 Production Checklist

- [ ] **Performance**:
  - [ ] Lighthouse score > 90
  - [ ] Bundle size < 500 KB (gzip)
  - [ ] First Contentful Paint < 1.5s

- [ ] **SEO**:
  - [ ] Meta tags (title, description, og:image)
  - [ ] Robots.txt
  - [ ] Sitemap.xml

- [ ] **Security**:
  - [ ] HTTPS only
  - [ ] No exposed API keys v client code
  - [ ] RLS policies aktivní (Supabase)
  - [ ] CORS nastavení

- [ ] **Monitoring**:
  - [ ] Vercel Analytics zapnuto
  - [ ] Error tracking (Sentry optional)
  - [ ] Uptime monitoring

**Soubory k úpravě**:
- `storage.js` - cloud-first architecture
- `/api/send-access-code.js` - remove beta workaround
- Všechny SQL migrace v `/supabase/migrations/`

---

## 🔄 Sprint 21a: Material Workflow System

**Zdroj**: Material Workflow System z MASTER_TODO_V2.md (řádky 7343-7639)
**Priorita**: HIGH
**Odhad**: 21-28 hodin celkem

### 21.1 Audio/Meditace Workflow (5-7 hodin)

- [ ] **Před poslechem**:
  - [ ] Alert box: "Připrav si tichý prostor, pohodlné místo na sezení"
  - [ ] Checklist (volitelný): ☐ Zavřené oči ☐ Pohodlné sezení ☐ 10 minut času
  - [ ] "Jsem připravená" button → unlock play

- [ ] **Play interface**:
  - [ ] CustomAudioPlayer (už máme ✅)
  - [ ] Progress bar s time stamps
  - [ ] Zobrazit zůstávající čas

- [ ] **Po dokončení**:
  - [ ] Auto-show modal: "Jak se teď cítíš?"
  - [ ] Mood slider (😫 → 😐 → 😊 → 😄 → 🥳)
  - [ ] Reflexní prompt: "Co sis všimla během meditace?" (textarea)
  - [ ] Save do `material.clientFeedback` array

### 21.2 Document/PDF Workflow (4-6 hodin)

- [ ] **Reading experience**:
  - [ ] Estimated reading time (words ÷ 200 wpm)
  - [ ] Progress indicator: "Přečteno 40%"
  - [ ] Scroll tracking (optional)

- [ ] **Po přečtení**:
  - [ ] Modal: "3 věci, které zkusím implementovat"
  - [ ] 3× TextField (numbered: 1., 2., 3.)
  - [ ] Save jako checklist do `material.clientActionItems`

- [ ] **Follow-up (za týden)**:
  - [ ] Reminder: "Jak jsi pokročila s těmito 3 věcmi?"
  - [ ] Checkbox review: ☐ Hotovo ☐ V procesu ☐ Zatím ne

### 21.3 Worksheet (Pracovní List) Workflow (5-7 hodin)

- [ ] **Před začátkem**:
  - [ ] Instrukce: "Vezmi si papír a tužku nebo otevři Notes app"
  - [ ] Estimated time: "15-30 minut"
  - [ ] "Začít" button

- [ ] **During work**:
  - [ ] Display worksheet content (může být PDF, image, nebo text)
  - [ ] Pause/Resume button
  - [ ] Save draft responses (pokud je to digital form)

- [ ] **Po dokončení**:
  - [ ] Modal: "Co jsi zjistila o sobě?"
  - [ ] Textarea pro insights
  - [ ] "Nahrát vyplněný list" (optional) - file upload
  - [ ] Save do `material.worksheetResults`

### 21.4 Video Workflow (3-4 hodin)

- [ ] **Video player**:
  - [ ] HTML5 video nebo iframe embed
  - [ ] Watch progress tracking (% watched)
  - [ ] Resume od posledního místa

- [ ] **Po shlédnutí**:
  - [ ] Modal: "Hlavní takeaway z videa?"
  - [ ] Textarea (200 znaků)
  - [ ] Rating: 1-5 stars (optional)

### 21.5 Reflection (Reflexe) Workflow (4-6 hodin)

- [ ] **Guided prompts**:
  - [ ] Display prompt (může být text nebo audio)
  - [ ] Timer: 5-10-15 minut options
  - [ ] Textová oblast pro psaní odpovědí

- [ ] **Reflexní otázky (examples)**:
  - "Co mě dnes nejvíc posunulo?"
  - "Kde jsem zaznamenala odpor?"
  - "Co bych chtěla zítra zkusit jinak?"

- [ ] **Save responses**:
  - [ ] Do `material.reflectionEntries` (array s timestamps)
  - [ ] Možnost prohlédnout historii reflexí

**Soubory k vytvoření**:
- `MaterialWorkflowWrapper.jsx` - wrapper pro různé typy workflow
- `AudioWorkflow.jsx`, `DocumentWorkflow.jsx`, `WorksheetWorkflow.jsx`, `VideoWorkflow.jsx`, `ReflectionWorkflow.jsx`

**Soubory k úpravě**:
- `storage.js` - přidat fields: `clientFeedback`, `clientActionItems`, `worksheetResults`, `reflectionEntries`
- `MaterialRenderer.jsx` - wrap do WorkflowWrapper
- `DailyView.jsx` - integrate workflow system

---

## 📊 Sprint 22a: Client Dashboard & Engagement Features

**Zdroj**: Client Dashboard Enhancement z MASTER_TODO_V2.md (řádky 7504-7639)
**Priorita**: MEDIUM-HIGH
**Odhad**: 12-16 hodin

### 22.1 Client Dashboard Page (5-7 hodin)

- [ ] **Vytvoř novou stránku**: `/client/dashboard`

- [ ] **Sections**:
  ```javascript
  1. Hero: "Vítej zpět, [jméno]!" + current streak
  2. My Programs (grid):
     - Active programs (in progress)
     - Completed programs (s certifikátem)
     - Favorite materials (bookmarked)
  3. Today's Task:
     - Current day material preview
     - "Pokračovat" button → /client/daily
  4. Progress Overview:
     - Total materials consumed
     - Total hours spent
     - Achievement badges (optional)
  5. Quick Actions:
     - "Procházet materiály"
     - "Zobrazit certifikáty"
     - "Kontaktovat koučku"
  ```

### 22.2 Certifikát Generator (3-4 hodiny)

- [ ] **Certificate design**:
  - [ ] HTML/CSS template (A4 page)
  - [ ] Coach name, client name, program name
  - [ ] Completion date
  - [ ] "Gratulujeme! Úspěšně jsi dokončila program..."
  - [ ] Coach signature (image optional)

- [ ] **Generate PDF**:
  - [ ] Use library: `jspdf` nebo `html2canvas` + `jspdf`
  - [ ] Download button: "Stáhnout certifikát (PDF)"

- [ ] **When to generate**:
  - [ ] Po dokončení posledního dne programu
  - [ ] Automaticky nabídnout download
  - [ ] Uložit do `client.certificateGenerated = true`

### 22.3 Notes & Bookmarks (2-3 hodiny)

- [ ] **Material object - add fields**:
  ```javascript
  {
    isBookmarked: false,  // toggle bookmark
    clientNotes: "",      // personal notes
  }
  ```

- [ ] **Bookmark button**:
  - [ ] Heart icon na MaterialCard (pro klientku)
  - [ ] Toggle on/off
  - [ ] Filter: "Oblíbené materiály"

- [ ] **Notes field**:
  - [ ] Textarea pod materiálem
  - [ ] "Moje poznámky k tomuto materiálu"
  - [ ] Auto-save (debounced 2s)

### 22.4 Calendar View (2-3 hodiny)

- [ ] **Calendar komponenta**:
  - [ ] Use MUI Date Calendar nebo custom
  - [ ] Highlight days: ✅ completed, 🔵 current, ⚪ upcoming
  - [ ] Click day → jump to that day's material

- [ ] **Program timeline view**:
  - [ ] Horizontal timeline (Den 1 → Den 7)
  - [ ] Visual progress indicator

**Soubory k vytvoření**:
- `ClientDashboard.jsx`
- `CertificateGenerator.jsx`
- `MaterialBookmarkButton.jsx`
- `ProgramCalendarView.jsx`

**Soubory k úpravě**:
- `storage.js` - add `isBookmarked`, `clientNotes` fields
- `ClientView.jsx` - add /dashboard route

---

## 📎 Sprint 23a: Tabulky & Prezentace Support

**Zdroj**: Rozšíření typů materiálů z MASTER_TODO_V2.md (řádky 7643-7704)
**Priorita**: MEDIUM
**Odhad**: 8-12 hodin

### 23.1 Excel Support (.xlsx, .xls)

- [ ] **Upload handling**:
  - [ ] Detect MIME type: `application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
  - [ ] Upload to Supabase Storage
  - [ ] Type: `spreadsheet`

- [ ] **Preview v MaterialCard**:
  - [ ] Ikona: 📊 (table icon z lucide-react)
  - [ ] Label: "Excel tabulka"

- [ ] **Rendering v DailyView**:
  - [ ] Embed Google Sheets viewer:
    ```javascript
    <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`} />
    ```
  - [ ] Fallback: Download button

### 23.2 Google Sheets Support

- [ ] **Link detection**:
  - [ ] Pattern: `docs.google.com/spreadsheets/d/`
  - [ ] Type: `spreadsheet`
  - [ ] ServiceLogo: GoogleSheets (vytvořit nové logo)

- [ ] **Embed rendering**:
  ```javascript
  const sheetId = extractGoogleSheetsId(url);
  const embedUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/preview`;
  <iframe src={embedUrl} width="100%" height="600px" />
  ```

### 23.3 PowerPoint Support (.pptx, .ppt)

- [ ] **Upload handling**:
  - [ ] MIME types: `application/vnd.ms-powerpoint`, `application/vnd.openxmlformats-officedocument.presentationml.presentation`
  - [ ] Type: `presentation`

- [ ] **Rendering**:
  - [ ] Office Web Viewer:
    ```javascript
    <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`} />
    ```
  - [ ] Fallback: Download button

### 23.4 Google Slides Support

- [ ] **Link detection**:
  - [ ] Pattern: `docs.google.com/presentation/d/`
  - [ ] Type: `presentation`

- [ ] **Embed rendering**:
  ```javascript
  const slideId = extractGoogleSlidesId(url);
  const embedUrl = `https://docs.google.com/presentation/d/${slideId}/embed`;
  <iframe src={embedUrl} width="100%" height="600px" />
  ```

**Soubory k vytvoření**:
- `/src/assets/service-logos/GoogleSheets.jsx`
- `/src/assets/service-logos/GoogleSlides.jsx`

**Soubory k úpravě**:
- `MATERIAL_TYPES` array (add `spreadsheet`, `presentation`)
- `linkDetection.js` (add Google Sheets/Slides patterns)
- `MaterialRenderer.jsx` (add rendering for spreadsheet/presentation)
- `AddMaterialModal.jsx` (add Excel/PowerPoint file types)

---

## 💬 Sprint 24a: Tooltips - Application-Wide

**Zdroj**: Additional Features z MASTER_TODO_V2.md (řádky 7707-7737)
**Priorita**: LOW
**Odhad**: 3-4 hodiny

### 24.1 Audit stránek bez tooltips

- [ ] **CoachDashboard.jsx**:
  - [ ] Statistics cards - tooltip s vysvětlením metriky
  - [ ] Quick action buttons - tooltip s akcí

- [ ] **ProgramsList.jsx**:
  - [ ] Program card actions (edit, share, delete)
  - [ ] Status badges (active, completed)

- [ ] **ClientsList.jsx**:
  - [ ] Client card actions
  - [ ] Progress indicators

- [ ] **MaterialsLibrary.jsx**:
  - [ ] Filter dropdowns - tooltip "Filtrovat podle kategorie"
  - [ ] Search bar - tooltip "Hledat v názvech a popisech"

### 24.2 Implementace Pattern

```javascript
import QuickTooltip from '@shared/components/AppTooltip';

// Všechny IconButtons wrap v QuickTooltip:
<QuickTooltip title="Upravit program">
  <IconButton onClick={handleEdit}>
    <Pencil size={18} />
  </IconButton>
</QuickTooltip>
```

### 24.3 Special Tooltips

- [ ] **Help icons** (ℹ️):
  - [ ] Vedle složitých funkcí
  - [ ] Tooltip s delším vysvětlením
  - [ ] Např. "Coaching Area - Vyber oblast, ve které koučuješ"

- [ ] **Validation tooltips**:
  - [ ] Červený border + tooltip s chybou
  - [ ] Např. "Název programu musí mít minimálně 3 znaky"

**Soubory k úpravě**:
- `CoachDashboard.jsx`
- `ProgramsList.jsx`
- `ClientsList.jsx`
- `MaterialsLibrary.jsx`
- Všechny komponenty s IconButtons

---

## 📄 Sprint 25a: Textové soubory v novém okně

**Zdroj**: Additional Features z MASTER_TODO_V2.md (řádky 7740-7761)
**Priorita**: LOW
**Odhad**: 1-2 hodiny

### 25.1 .txt File Support

- [ ] **Upload handling**:
  - [ ] MIME type: `text/plain`
  - [ ] Upload to Supabase Storage
  - [ ] Type: `text` (already exists ✅)

- [ ] **Preview v MaterialCard**:
  - [ ] Ikona: 📝 FileText
  - [ ] První 100 znaků jako description

### 25.2 Rendering - New Window

- [ ] **Open button**:
  - [ ] ExternalLink ikona (už máme ✅)
  - [ ] `target="_blank"`
  - [ ] Opens .txt file URL v novém okně

- [ ] **Browser handling**:
  - [ ] Browser auto-renders .txt files
  - [ ] Žádný custom viewer potřeba

**Soubory k úpravě**:
- `AddMaterialModal.jsx` - accept .txt files
- `MaterialCard.jsx` - .txt files use ExternalLink (already done ✅)

---

## ✏️ Sprint 26a: Editor Poznámek (Rich Text)

**Zdroj**: Additional Features z MASTER_TODO_V2.md (řádky 7764-7825)
**Priorita**: MEDIUM
**Odhad**: 8-12 hodin

### 26.1 Material Notes - Coach & Client

- [ ] **Material object - přidat fields**:
  ```javascript
  {
    coachNotes: "",   // Poznámky kouče (soukromé)
    clientNotes: "",  // Poznámky klientky (vidí jen ona)
  }
  ```

- [ ] **UI v MaterialCard/PreviewModal**:
  - [ ] Tab "Poznámky" (pro koučku: vidí obě sekce)
  - [ ] Section 1: "Moje poznámky (soukromé)" - `coachNotes`
  - [ ] Section 2: "Poznámky pro klientku" - zobrazí se v DailyView

### 26.2 Rich Text Editor

- [ ] **Library**: TipTap nebo Quill.js
  - [ ] TipTap = lightweight, moderní
  - [ ] Quill.js = mature, hodně features

- [ ] **Features**:
  - [ ] **Bold**, *italic*, underline
  - [ ] Headings (H2, H3)
  - [ ] Bulleted & numbered lists
  - [ ] Links
  - [ ] Blockquotes
  - [ ] Code blocks (optional)

- [ ] **Styling**:
  - [ ] Glassmorphism toolbar
  - [ ] Dark mode support
  - [ ] Border-radius: BORDER_RADIUS.compact

### 26.3 Program Notes

- [ ] **Program object - přidat fields**:
  ```javascript
  {
    coachNotes: "",   // Celkové poznámky k programu
    days: [
      {
        dayNumber: 1,
        coachNotes: "",  // Poznámky ke konkrétnímu dni
        // ... existing fields
      }
    ]
  }
  ```

- [ ] **UI v ProgramEditor**:
  - [ ] Tab "Poznámky" vedle "Dny"
  - [ ] Rich text editor pro celkový program
  - [ ] Pro každý den: malá textarea nebo expandable rich text

### 26.4 Auto-Save

- [ ] **Debounced save**:
  - [ ] 2 sekundy po posledním keystroke
  - [ ] Toast: "Poznámky uloženy ✓" (subtle)

- [ ] **localStorage + Supabase sync**:
  - [ ] Immediate save to localStorage
  - [ ] Debounced sync to Supabase

**Soubory k vytvoření**:
- `RichTextEditor.jsx` - reusable editor component
- `MaterialNotesTab.jsx`
- `ProgramNotesTab.jsx`

**Soubory k úpravě**:
- `storage.js` - add notes fields
- `MaterialCard.jsx` nebo `PreviewModal.jsx` - add Notes tab
- `ProgramEditor.jsx` - add Notes tab

**Dependencies**:
```bash
npm install @tiptap/react @tiptap/starter-kit
```

---

## 🎯 Sprint 27a: Cíle, Vize, Plán - Goal Setting

**Zdroj**: Additional Features z MASTER_TODO_V2.md (řádky 7828-7926)
**Priorita**: MEDIUM-HIGH
**Odhad**: 10-15 hodin

### 27.1 Client Goals System

- [ ] **Client object - add fields**:
  ```javascript
  {
    goals: [
      {
        id: 'uuid',
        title: 'Zlepšit sebevědomí v obchodních jednáních',
        description: 'Chci být assertivní a klidná',
        category: 'career', // nebo custom
        targetDate: '2025-12-31',
        status: 'in_progress', // not_started, in_progress, completed
        milestones: [
          { text: 'Absolvovat program Assertivita', completed: true },
          { text: '5 úspěšných jednání', completed: false }
        ],
        relatedMaterials: ['mat-id-1', 'mat-id-2'],
        relatedPrograms: ['prog-id-1'],
        createdAt: 'ISO timestamp',
        completedAt: null,
      }
    ],
    vision: "Dlouhý text - kam směřuji za 1-5 let",
    plan: "Action plan - konkrétní kroky k vizi",
  }
  ```

### 27.2 Goals Dashboard (Client)

- [ ] **Stránka**: `/client/goals`

- [ ] **Sections**:
  ```javascript
  1. My Vision (expandable card):
     - Display client.vision
     - Edit button → modal s textarea
  2. My Plan (expandable card):
     - Display client.plan
     - Edit button
  3. Active Goals (grid):
     - Goal cards s progress bars
     - Status badges
     - "Přidat nový cíl" button
  4. Completed Goals (collapsed section):
     - Archive completed goals
  ```

### 27.3 Goal Card Component

- [ ] **Design**:
  - [ ] Title, description
  - [ ] Progress bar (milestones completed / total)
  - [ ] Target date (with countdown: "Zbývá 45 dní")
  - [ ] Action buttons: Edit, Mark Complete, Delete

- [ ] **Milestones checklist**:
  - [ ] ☐ Checkbox items
  - [ ] Toggle complete/incomplete
  - [ ] Auto-update goal progress

### 27.4 Integrate with Materials & Programs

- [ ] **Material object - add field**:
  ```javascript
  {
    relatedGoals: ['goal-id-1', 'goal-id-2'],
  }
  ```

- [ ] **UI v MaterialCard/PreviewModal**:
  - [ ] Section: "Tento materiál pomůže s:"
  - [ ] Chips s názvy cílů
  - [ ] Click chip → navigate to goal detail

- [ ] **Program object - add field**:
  ```javascript
  {
    relatedGoals: ['goal-id-1'],
  }
  ```

- [ ] **Suggest goals**:
  - [ ] Po dokončení programu:
    "Tento program ti pomohl s cílem X. Chceš ho označit jako splněný?"

### 27.5 Coach Goals Management (Optional)

- [ ] **Coach může vidět client goals** (pokud client sdílí):
  - [ ] ClientDetail page → tab "Cíle"
  - [ ] Read-only view nebo s možností přidat komentáře

**Soubory k vytvoření**:
- `ClientGoals.jsx` (page)
- `GoalCard.jsx`
- `AddGoalModal.jsx`
- `VisionEditor.jsx`
- `PlanEditor.jsx`

**Soubory k úpravě**:
- `storage.js` - add goals, vision, plan fields
- `MaterialCard.jsx` - show related goals
- `ProgramEditor.jsx` - add relatedGoals field

---

## 📝 Sprint 28a: Session Notes - Zápisky ze Sezení

**Zdroj**: Additional Features z MASTER_TODO_V2.md (řádky 7931-8008)
**Priorita**: MEDIUM
**Odhad**: 6-9 hodin

### 28.1 Session Notes Schema

- [ ] **Nový objekt v localStorage/Supabase**:
  ```javascript
  // localStorage key: 'coachpro_session_notes'
  {
    id: 'uuid',
    coachId: 'coach-id',
    clientId: 'client-id',
    sessionDate: '2025-11-03T10:00:00Z',
    duration: 60, // minutes
    topic: 'Assertivita v jednáních',
    notes: "Rich text HTML - co jsme probírali, insights, homework",
    actionItems: [
      { text: 'Přečíst kapitolu 3', completed: false },
      { text: 'Vyzkoušet techniku DEAR', completed: true }
    ],
    mood: {
      before: 3,  // 1-5 scale
      after: 4,
    },
    attachedMaterials: ['mat-id-1'],
    tags: ['assertivita', 'komunikace'],
    isPrivate: false, // pokud false, client může vidět
    createdAt: 'ISO timestamp',
    updatedAt: 'ISO timestamp',
  }
  ```

### 28.2 Coach: Session Notes List

- [ ] **Stránka**: `/coach/session-notes`

- [ ] **UI**:
  - [ ] Table/List view s filtrací:
    - [ ] Filter by client
    - [ ] Filter by date range
    - [ ] Filter by tags
  - [ ] "Nová poznámka" button → AddSessionNoteModal

- [ ] **Session Note Card**:
  - [ ] Client name, date, duration
  - [ ] Topic (heading)
  - [ ] Truncated notes (first 150 chars)
  - [ ] Actions: Edit, Delete, Share with client

### 28.3 Add/Edit Session Note Modal

- [ ] **Form fields**:
  - [ ] Client dropdown (select from ClientsList)
  - [ ] Date & time picker
  - [ ] Duration slider (15, 30, 45, 60, 90 min)
  - [ ] Topic (TextField)
  - [ ] Notes (Rich Text Editor - use TipTap from Sprint 26a)
  - [ ] Action items (dynamic list)
  - [ ] Mood before/after (sliders)
  - [ ] Attached materials (multi-select)
  - [ ] Tags (Autocomplete)
  - [ ] Privacy toggle: "Sdílet s klientkou?"

### 28.4 Client View - Session History

- [ ] **Stránka**: `/client/sessions`

- [ ] **Display**:
  - [ ] Timeline view (chronological)
  - [ ] Each session card:
    - [ ] Date, topic
    - [ ] Notes (if coach shared)
    - [ ] Action items (checkboxes)
    - [ ] "Poznámky kouče" badge

- [ ] **Pokud coach nesdílel**:
  - [ ] Zobrazit jen: Date, topic, duration
  - [ ] "Detaily jsou soukromé" text

### 28.5 Integrace s Client Profile

- [ ] **ClientCard nebo ClientDetail**:
  - [ ] Section: "Poslední sezení"
  - [ ] Date, topic, quick summary
  - [ ] "Zobrazit všechny zápisky" link → /coach/session-notes?client=[id]

**Soubory k vytvoření**:
- `SessionNotesList.jsx` (coach page)
- `SessionNoteCard.jsx`
- `AddSessionNoteModal.jsx`
- `ClientSessionHistory.jsx` (client page)

**Soubory k úpravě**:
- `storage.js` - add STORAGE_KEYS.SESSION_NOTES
- `ClientCard.jsx` nebo `ClientDetail.jsx` - add latest session preview

---

## 🔍 Sprint 29a: AI Checklisty Generator (Optional)

**Zdroj**: Additional Features z MASTER_TODO_V2.md (řádky 8012-8084)
**Priorita**: LOW (Optional feature)
**Odhad**: 15-20 hodin

⚠️ **ZÁVISLOST**: Vyžaduje AI API (OpenAI, Anthropic, nebo local model)

### 29.1 AI Integration Setup

- [ ] **Výběr AI providera**:
  - [ ] OpenAI GPT-4 API (paid)
  - [ ] Anthropic Claude API (paid)
  - [ ] Local model (Ollama) - free but slower

- [ ] **Environment variables**:
  ```bash
  VITE_AI_PROVIDER=openai  # nebo anthropic, ollama
  VITE_OPENAI_API_KEY=sk-...
  ```

### 29.2 Checklist Generator - Materials

- [ ] **UI v AddMaterialModal**:
  - [ ] Button: "✨ Vygenerovat checklist pomocí AI"
  - [ ] Input: Describe material purpose (textarea)
  - [ ] Click → API call

- [ ] **API call**:
  ```javascript
  const prompt = `
  Vytvoř checklist pro koučovací materiál typu ${type}.
  Účel materiálu: ${purpose}

  Vygeneruj 3-5 bodů, které by měla klientka udělat před/během/po použití tohoto materiálu.
  Format: JSON array ["krok 1", "krok 2", ...]
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  const checklist = JSON.parse(response.choices[0].message.content);
  ```

- [ ] **Insert do materiálu**:
  - [ ] `material.aiGeneratedChecklist = checklist`
  - [ ] Display v DailyView před materiálem
  - [ ] Checkbox items (can be edited by coach)

### 29.3 Checklist Generator - Programs

- [ ] **UI v ProgramEditor**:
  - [ ] Button u každého dne: "✨ AI checklist pro tento den"
  - [ ] Input: Day topic/theme

- [ ] **Generate**:
  - [ ] AI creates checklist based on day materials
  - [ ] Insert do `day.aiGeneratedChecklist`

### 29.4 AI Suggestions - Content Ideas

- [ ] **Suggest related materials**:
  ```javascript
  // Při vytváření programu
  "Na základě tématu 'Assertivita' doporučuji tyto typy materiálů:
  - Audio meditace: 'Klidná mysl před jednáním'
  - PDF: 'DEAR technika komunikace'
  - Worksheet: 'Moje komunikační hranice'"
  ```

- [ ] **Suggest coaching exercises**:
  - [ ] Pro daný Coaching Area + Topic
  - [ ] Generate worksheet prompts

### 29.5 Fallback & Error Handling

- [ ] **Pokud AI API selže**:
  - [ ] Fallback na pre-made templates
  - [ ] Error toast: "AI není dostupné, použij šablonu"

- [ ] **Rate limiting**:
  - [ ] Max 10 AI calls per coach per day (free tier)
  - [ ] Display counter: "Zbývá 7 AI generací dnes"

**Soubory k vytvoření**:
- `/api/ai-generate-checklist.js` (serverless function)
- `AIChecklistButton.jsx`
- `aiService.js` (client-side wrapper)

**Soubory k úpravě**:
- `AddMaterialModal.jsx` - add AI button
- `ProgramEditor.jsx` - add AI button per day
- `.env.example` - document AI variables

**Dependencies**:
```bash
npm install openai  # nebo @anthropic-ai/sdk
```

---

## 👁️ Sprint 30a: Live Preview při zadání kódu

**Zdroj**: Additional Features z MASTER_TODO_V2.md (řádky 8087-8137)
**Priorita**: MEDIUM
**Odhad**: 4-6 hodin

### 30.1 ClientEntry - Live Preview

- [ ] **Současný stav**:
  - [ ] User zadá kód → submit → error nebo navigate

- [ ] **Nový stav - Live Preview**:
  - [ ] User zadává kód (každý keystroke)
  - [ ] Po 6 znacích → auto-check validity
  - [ ] Pokud valid → zobrazit preview

### 30.2 Preview Card

- [ ] **Design**:
  ```javascript
  <Card sx={{ mt: 3, ...glassCardStyles }}>
    {/* Header */}
    <Box display="flex" alignItems="center" gap={1.5}>
      <CheckCircle color="success" />
      <Typography variant="h6">Nalezen program!</Typography>
    </Box>

    {/* Content */}
    <Box mt={2}>
      <Typography variant="h5">{program.title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {program.description}
      </Typography>

      {/* Coach info */}
      <Chip
        label={`Od kouče: ${coach.name}`}
        size="small"
        avatar={<Avatar src={coach.profilePhoto} />}
      />

      {/* Duration */}
      <Typography variant="caption">
        📅 Délka programu: {program.duration} dní
      </Typography>
    </Box>

    {/* Action */}
    <Button
      variant="contained"
      onClick={handleEnter}
      sx={{ mt: 2 }}
    >
      Začít program
    </Button>
  </Card>
  ```

### 30.3 API Call Pattern

- [ ] **Debounced validation**:
  ```javascript
  const [code, setCode] = useState('');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (code.length === 6) {
      const timer = setTimeout(async () => {
        setLoading(true);
        const program = await getProgramByCode(code);
        if (program) {
          const coach = await getCoachById(program.coachId);
          setPreview({ program, coach });
        } else {
          setPreview(null);
        }
        setLoading(false);
      }, 300); // debounce 300ms

      return () => clearTimeout(timer);
    }
  }, [code]);
  ```

### 30.4 Error States

- [ ] **Invalid code**:
  - [ ] Po 6 znacích + delay → "Kód nebyl nalezen"
  - [ ] Červený border na TextField
  - [ ] Suggestion: "Zkontroluj překlepy nebo požádej koučku o nový kód"

- [ ] **Loading state**:
  - [ ] CircularProgress během validace
  - [ ] Placeholder skeleton pro preview card

### 30.5 Share Material Preview (BONUS)

- [ ] **Stejný pattern pro ShareMaterialModal**:
  - [ ] User zadá share code (6 chars)
  - [ ] Live preview materiálu
  - [ ] Show: title, type, coach name
  - [ ] "Zobrazit materiál" button

**Soubory k úpravě**:
- `ClientEntry.jsx` - add live preview logic
- `MaterialView.jsx` - add live preview (optional)

---

## 💳 Sprint 31a: Migrace tester → platící zákazník

**Zdroj**: Additional Features z MASTER_TODO_V2.md (řádky 8140-8186)
**Priorita**: HIGH (pre-production)
**Odhad**: 5-7 hodin

### 31.1 Tester Upgrade Flow

- [ ] **Kdy nabídnout upgrade**:
  - [ ] Po X dnech beta testování (např. 30 dní)
  - [ ] Po dokončení Y programů (např. 3 programy)
  - [ ] Manuální trigger od admin (Lenka)

- [ ] **Upgrade prompt**:
  ```javascript
  <Alert severity="info" sx={{ mb: 3 }}>
    🎉 Tvoje beta testování skončilo!
    Chceš pokračovat s CoachPro? Přejdi na placenou verzi za [cena] Kč/měsíc.

    <Button onClick={handleUpgrade}>Chci pokračovat</Button>
  </Alert>
  ```

### 31.2 Payment Integration (Stripe)

- [ ] **Stripe setup**:
  - [ ] Create Stripe account
  - [ ] Get API keys (publishable + secret)
  - [ ] Create product: "CoachPro Coach Plan"
  - [ ] Price: 299 Kč/měsíc (nebo custom)

- [ ] **Checkout page**: `/upgrade`
  ```javascript
  import { loadStripe } from '@stripe/stripe-js';
  import { Elements, CardElement } from '@stripe/react-stripe-js';

  const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY);

  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
  ```

- [ ] **Serverless payment endpoint**: `/api/create-checkout-session.js`
  ```javascript
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price: 'price_xxx', // Stripe price ID
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: `${process.env.VITE_APP_URL}/success`,
    cancel_url: `${process.env.VITE_APP_URL}/cancel`,
    client_reference_id: coachId,
  });

  return { sessionId: session.id };
  ```

### 31.3 Subscription Management

- [ ] **Coach object - add fields**:
  ```javascript
  {
    subscription: {
      status: 'beta' | 'active' | 'canceled' | 'past_due',
      plan: 'beta' | 'monthly' | 'yearly',
      stripeCustomerId: 'cus_xxx',
      stripeSubscriptionId: 'sub_xxx',
      currentPeriodEnd: '2025-12-03',
    }
  }
  ```

- [ ] **Restrict features pro beta**:
  ```javascript
  if (coach.subscription.status === 'beta') {
    // Show upgrade prompt
    // Limit materials/programs count (optional)
  }
  ```

### 31.4 Post-Payment Webhook

- [ ] **Stripe webhook**: `/api/stripe-webhook.js`
  ```javascript
  // Handle events:
  - checkout.session.completed → upgrade user to 'active'
  - invoice.payment_succeeded → extend subscription
  - invoice.payment_failed → mark 'past_due'
  - customer.subscription.deleted → mark 'canceled'

  const event = stripe.webhooks.constructEvent(
    req.body, signature, process.env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const coachId = session.client_reference_id;

    // Update coach subscription status
    await supabase
      .from('coachpro_coaches')
      .update({
        subscription: {
          status: 'active',
          plan: 'monthly',
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
        }
      })
      .eq('id', coachId);
  }
  ```

### 31.5 Billing Dashboard (Optional)

- [ ] **Stránka**: `/coach/billing`
  - [ ] Current plan info
  - [ ] Payment history (invoices)
  - [ ] "Update payment method" button
  - [ ] "Cancel subscription" button (with confirmation)

**Soubory k vytvoření**:
- `/pages/Upgrade.jsx`
- `/api/create-checkout-session.js`
- `/api/stripe-webhook.js`
- `BillingDashboard.jsx` (optional)

**Dependencies**:
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js stripe
```

---

## 📝 Sprint 32a: Poznámky v Detailu Materiálu i Programu

**Zdroj**: Additional Features z MASTER_TODO_V2.md (řádky 8189-8215)
**Priorita**: MEDIUM
**Odhad**: 3-4 hodiny

⚠️ **POZNÁMKA**: Částečně překrývá Sprint 26a (Editor Poznámek). Možná sloučit nebo upravit.

### 32.1 Material Detail - Notes Section

- [ ] **UI v PreviewModal nebo MaterialCard**:
  - [ ] Tab "Poznámky" (už navrženo v Sprint 26a ✅)
  - [ ] Pro koučku: 2 sekce
    - [ ] "Moje poznámky (soukromé)"
    - [ ] "Poznámky pro klientku" (viditelné v DailyView)

- [ ] **Client view**:
  - [ ] V DailyView pod materiálem
  - [ ] Section: "💬 Poznámka od koučky"
  - [ ] Display `material.clientNotes` (read-only)

### 32.2 Program Detail - Notes Tab

- [ ] **UI v ProgramEditor**:
  - [ ] Tab "Poznámky" vedle "Dny" (už navrženo v Sprint 26a ✅)
  - [ ] Rich text editor

- [ ] **Per-day notes** (NOVÉ - není v Sprint 26a):
  - [ ] Každý den má vlastní `coachNotes` field
  - [ ] V ProgramEditor → expand day card → notes textarea
  - [ ] Client vidí poznámku v DailyView pro aktuální den

### 32.3 Notes Template System (BONUS)

- [ ] **Pre-made templates**:
  ```javascript
  const NOTE_TEMPLATES = [
    {
      name: "Reflexe po audiích",
      content: `
      Po poslechu si odpověz na tyto otázky:
      1. Co sis všimla?
      2. Jak se teď cítíš?
      3. Co zkusíš implementovat?
      `
    },
    {
      name: "Pracovní list - instrukce",
      content: `
      Vezmi si 15-30 minut klidu.
      Pracuj postupně, nesnaž se spěchat.
      Zapiš si první věci, co tě napadnou.
      `
    }
  ];
  ```

- [ ] **UI**:
  - [ ] Dropdown "Použít šablonu" v notes editoru
  - [ ] Insert template → can edit

**Soubory k úpravě**:
- `PreviewModal.jsx` nebo `MaterialCard.jsx` - notes tab (Sprint 26a)
- `ProgramEditor.jsx` - per-day notes field
- `DailyView.jsx` - zobrazit coach notes pro aktuální den

---

## 📜 Sprint 33a: Seznam Sdílení - Share History

**Zdroj**: Additional Features z MASTER_TODO_V2.md (řádky 8218-8258)
**Priorita**: MEDIUM
**Odhad**: 4-6 hodin

### 33.1 Share History Page

- [ ] **Stránka**: `/coach/share-history`

- [ ] **Zobrazit všechna sdílení**:
  - [ ] Materials shared
  - [ ] Programs shared

- [ ] **Table columns**:
  ```
  | Typ | Název | Klientka | Share Code | Vytvořeno | Expiruje | Status | Akce |
  |-----|-------|----------|------------|-----------|----------|--------|------|
  | 📄  | PDF   | Jana N.  | ABC123     | 1.11.2025 | -        | Active | View, Revoke |
  | 📦  | Program| Petra K.| XYZ789     | 28.10.2025| 10.11.2025| Active | View, Revoke |
  ```

### 33.2 Filtry & Vyhledávání

- [ ] **Filters**:
  - [ ] By type: All, Materials, Programs
  - [ ] By status: All, Active, Expired, Revoked
  - [ ] By date range
  - [ ] By client name (search)

- [ ] **Sort**:
  - [ ] Newest first (default)
  - [ ] Oldest first
  - [ ] Expiring soon

### 33.3 Akce na Sdílení

- [ ] **View**:
  - [ ] Modal s detaily sdílení:
    - [ ] Share code, QR code
    - [ ] Client name (pokud známe)
    - [ ] Access dates (start, end)
    - [ ] View count (kolikrát klient otevřel)
    - [ ] Last accessed (timestamp)

- [ ] **Revoke (odvolat)**:
  - [ ] Confirmation: "Opravdu chceš odvolat sdílení pro [client]?"
  - [ ] Set status: `revoked = true`
  - [ ] Client error: "Tento kód již není platný. Kontaktuj koučku."

- [ ] **Extend (prodloužit)**:
  - [ ] Pokud má `accessEndDate`
  - [ ] Modal: Date picker pro nové datum
  - [ ] Update `accessEndDate`

### 33.4 Tracking Usage

- [ ] **SharedMaterial/SharedProgram - add fields**:
  ```javascript
  {
    viewCount: 0,
    lastAccessedAt: null,
    revoked: false,
  }
  ```

- [ ] **Increment view count**:
  - [ ] V MaterialView.jsx nebo DailyView.jsx při načtení
  - [ ] `viewCount++`, update `lastAccessedAt`

**Soubory k vytvoření**:
- `ShareHistory.jsx` (page)
- `ShareHistoryTable.jsx`
- `ShareDetailModal.jsx`
- `RevokeShareDialog.jsx`
- `ExtendShareDialog.jsx`

**Soubory k úpravě**:
- `storage.js` - add viewCount, lastAccessedAt, revoked fields
- `MaterialView.jsx` - increment view count
- `DailyView.jsx` - increment view count (for programs)

---

## 🏆 Sprint 34a: Gamifikace - Odznaky & Odměny

**Zdroj**: Additional Features z MASTER_TODO_V2.md (řádky 8261-8310)
**Priorita**: LOW (nice-to-have)
**Odhad**: 8-12 hodin

### 34.1 Badge System

- [ ] **Badge types**:
  ```javascript
  const BADGES = [
    {
      id: 'first-program',
      name: 'První Krok',
      description: 'Dokončil jsi první program',
      icon: '🌱',
      criteria: (client) => client.completedDays.length >= 7,
    },
    {
      id: 'streak-7',
      name: 'Týden v Řadě',
      description: '7 dní v řadě',
      icon: '🔥',
      criteria: (client) => client.streak >= 7,
    },
    {
      id: 'early-bird',
      name: 'Ranní Ptáče',
      description: 'Dokončil materiál před 8:00',
      icon: '🐦',
      criteria: (client) => {
        // Check if last completion was before 8 AM
      },
    },
    {
      id: 'bookworm',
      name: 'Knihomol',
      description: 'Přečetl 10+ PDF materiálů',
      icon: '📚',
      criteria: (client) => {
        // Count PDF materials consumed
      },
    },
  ];
  ```

- [ ] **Client object - add field**:
  ```javascript
  {
    badges: ['first-program', 'streak-7'], // earned badge IDs
  }
  ```

### 34.2 Badge Earning Logic

- [ ] **Check criteria after actions**:
  ```javascript
  // V DailyView po dokončení dne
  const checkAndAwardBadges = (client) => {
    BADGES.forEach(badge => {
      if (!client.badges.includes(badge.id) && badge.criteria(client)) {
        // Award badge
        client.badges.push(badge.id);
        updateClient(client);

        // Show celebration
        showBadgeEarnedModal(badge);
      }
    });
  };
  ```

- [ ] **Badge Earned Modal**:
  - [ ] Confetti animation
  - [ ] Badge icon (large)
  - [ ] "Gratulujeme! Získala jsi odznak: [name]"
  - [ ] Description
  - [ ] "Pokračovat" button

### 34.3 Badges Display

- [ ] **Client Dashboard**:
  - [ ] Section: "Moje odznaky"
  - [ ] Grid s badges (earned + locked)
  - [ ] Locked badges: grayscale + "Jak získat: [criteria]"

- [ ] **Badge Detail Modal**:
  - [ ] Click badge → detail
  - [ ] Name, description, date earned
  - [ ] Progress k dalším badges

### 34.4 Rewards System (Optional)

- [ ] **Points system**:
  - [ ] Earn points for actions:
    - [ ] Complete day: +10 points
    - [ ] Maintain streak: +5 points/day
    - [ ] Finish program: +100 points
  - [ ] Display total points na Dashboard

- [ ] **Unlockables**:
  - [ ] Custom avatars
  - [ ] Dashboard themes
  - [ ] Special certificates

**Soubory k vytvoření**:
- `badgesConfig.js` - badge definitions
- `BadgeEarnedModal.jsx`
- `BadgesDisplay.jsx`
- `badgeUtils.js` - criteria checking logic

**Soubory k úpravě**:
- `storage.js` - add badges field
- `DailyView.jsx` - check badges after completion
- `ClientDashboard.jsx` - display badges section

---

## 💬 Sprint 35a: Vykání/Tykání - Personalizace Jazyka

**Zdroj**: Additional Features z MASTER_TODO_V2.md (řádky 8313-8347)
**Priorita**: MEDIUM
**Odhad**: 6-8 hodin

### 35.1 Language Preference Setting

- [ ] **Client object - add field**:
  ```javascript
  {
    languagePreference: 'tykani' | 'vykani', // default: tykani
  }
  ```

- [ ] **Settings page**: `/client/settings`
  - [ ] Toggle nebo Radio buttons:
    - [ ] ○ Tykání (neformální) - "Začni program"
    - [ ] ○ Vykání (formální) - "Začněte program"

### 35.2 Language Utility Functions

- [ ] **Vytvořit helper**: `/src/shared/utils/language.js`
  ```javascript
  export const t = (client, variants) => {
    const pref = client?.languagePreference || 'tykani';
    return variants[pref];
  };

  // Usage:
  const text = t(client, {
    tykani: "Začni program",
    vykani: "Začněte program"
  });
  ```

### 35.3 Apply Throughout App

- [ ] **Buttons**:
  ```javascript
  <Button>
    {t(client, {
      tykani: "Pokračovat",
      vykani: "Pokračujte"
    })}
  </Button>
  ```

- [ ] **Messages**:
  ```javascript
  <Typography>
    {t(client, {
      tykani: "Gratulujeme! Dokončila jsi den.",
      vykani: "Gratulujeme! Dokončila jste den."
    })}
  </Typography>
  ```

- [ ] **Instructions**:
  ```javascript
  // MaterialWorkflow prompts
  {t(client, {
    tykani: "Připrav si tichý prostor",
    vykani: "Připravte si tichý prostor"
  })}
  ```

### 35.4 Pre-defined Translations

- [ ] **Často používané fráze**:
  ```javascript
  export const COMMON_PHRASES = {
    start_program: {
      tykani: "Začít program",
      vykani: "Začít program" // same (infinitive)
    },
    continue: {
      tykani: "Pokračovat",
      vykani: "Pokračovat"
    },
    congratulations: {
      tykani: "Gratulujeme! Dokončila jsi tento den.",
      vykani: "Gratulujeme! Dokončila jste tento den."
    },
    how_do_you_feel: {
      tykani: "Jak se teď cítíš?",
      vykani: "Jak se teď cítíte?"
    },
  };
  ```

### 35.5 Coach Preference (Optional)

- [ ] **Coach může nastavit default**:
  - [ ] Coach object: `defaultLanguagePreference: 'tykani' | 'vykani'`
  - [ ] Všichni noví klienti dostanou tento default
  - [ ] Klient může změnit v Settings

**Soubory k vytvoření**:
- `/src/shared/utils/language.js`
- `/src/shared/constants/commonPhrases.js`
- `ClientSettings.jsx` (pokud neexistuje)

**Soubory k úpravě**:
- Všechny client-facing stránky (DailyView, ClientDashboard, atd.)
- Všechny texty v MaterialWorkflow komponentách
- Všechny modaly (CelebrationModal, MoodCheck, atd.)

---

## 🛡️ Sprint 36a: Ochrana proti smazání - Active Usage Protection

**Zdroj**: Additional Features z MASTER_TODO_V2.md (řádky 8350-8388)
**Priorita**: MEDIUM
**Odhad**: 3-4 hodiny

### 36.1 Material Delete Protection

- [ ] **Check před smazáním**:
  ```javascript
  const handleDeleteMaterial = (materialId) => {
    // 1. Check if material is used in any programs
    const programs = getPrograms(coachId);
    const usedInPrograms = programs.filter(program =>
      program.days.some(day => day.materialIds.includes(materialId))
    );

    if (usedInPrograms.length > 0) {
      // Show warning dialog
      showDeleteWarningDialog(materialId, usedInPrograms);
    } else {
      // Safe to delete
      deleteMaterial(materialId);
    }
  };
  ```

- [ ] **Warning Dialog**:
  ```javascript
  <Dialog open={warningOpen}>
    <DialogTitle>⚠️ Materiál je používán</DialogTitle>
    <DialogContent>
      <Typography>
        Tento materiál je součástí {usedInPrograms.length} programů:
      </Typography>
      <List>
        {usedInPrograms.map(program => (
          <ListItem key={program.id}>
            • {program.title}
          </ListItem>
        ))}
      </List>
      <Typography color="error">
        Pokud ho smažeš, tyto programy budou mít chybějící materiál.
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCancel}>Zrušit</Button>
      <Button onClick={handleForceDelete} color="error">
        Smazat i tak
      </Button>
    </DialogActions>
  </Dialog>
  ```

### 36.2 Program Delete Protection

- [ ] **Check před smazáním**:
  ```javascript
  const handleDeleteProgram = (programId) => {
    // Check if program has active clients
    const clients = getClients(coachId);
    const activeClients = clients.filter(client =>
      client.programId === programId && !client.completedAt
    );

    if (activeClients.length > 0) {
      showProgramDeleteWarning(programId, activeClients);
    } else {
      deleteProgram(programId);
    }
  };
  ```

- [ ] **Warning Dialog**:
  ```javascript
  <Alert severity="error">
    Tento program má {activeClients.length} aktivních klientek:
    {activeClients.map(client => (
      <Chip label={client.name} size="small" />
    ))}
  </Alert>
  <Typography>
    Pokud ho smažeš, ztratí přístup k programu.
  </Typography>
  ```

### 36.3 Soft Delete (Optional)

- [ ] **Místo tvrdého smazání → archivace**:
  ```javascript
  {
    isArchived: true,
    archivedAt: '2025-11-03T12:00:00Z',
  }
  ```

- [ ] **Archived materials/programs**:
  - [ ] Skryté z hlavního listu
  - [ ] Zobrazit v "Archiv" sekci
  - [ ] Možnost obnovit: "Restore"
  - [ ] Možnost permanent delete po 30 dnech

**Soubory k úpravě**:
- `MaterialCard.jsx` - add delete protection check
- `ProgramCard.jsx` - add delete protection check
- `storage.js` - add isArchived field (optional)

---

## ✅ Sprint 37a: Kontrola Duplicit - Validation System

**Zdroj**: Additional Features z MASTER_TODO_V2.md (řádky 8391-8432)
**Priorita**: LOW
**Odhad**: 2-3 hodiny

### 37.1 Material Duplicity Check

- [ ] **Kontrola při uploadu**:
  ```javascript
  const checkDuplicateMaterial = (newMaterial, existingMaterials) => {
    return existingMaterials.find(mat =>
      mat.title.toLowerCase() === newMaterial.title.toLowerCase() &&
      mat.type === newMaterial.type
    );
  };
  ```

- [ ] **Warning dialog**:
  ```javascript
  <Alert severity="warning">
    ⚠️ Již máš materiál s názvem "{newMaterial.title}" typu {newMaterial.type}.
    Chceš přesto přidat duplikát?
  </Alert>
  <DialogActions>
    <Button onClick={handleCancel}>Zrušit</Button>
    <Button onClick={handleContinue}>Přidat i tak</Button>
  </DialogActions>
  ```

### 37.2 Program Duplicity Check

- [ ] **Kontrola názvu**:
  ```javascript
  const duplicate = programs.find(prog =>
    prog.title.toLowerCase() === newProgram.title.toLowerCase()
  );

  if (duplicate) {
    // Show warning
  }
  ```

### 37.3 Share Code Uniqueness

- [ ] **Ensure unique share codes**:
  ```javascript
  const generateUniqueShareCode = (existingCodes) => {
    let code;
    do {
      code = generateShareCode(); // ABC123 format
    } while (existingCodes.includes(code));
    return code;
  };
  ```

- [ ] **Check při vytvoření sdílení**:
  - [ ] Query all existing share codes
  - [ ] Regenerate if collision (unlikely ale možné)

### 37.4 Client Name Duplicity (Optional)

- [ ] **Warning při přidání klientky**:
  ```javascript
  const existingClient = clients.find(c =>
    c.name.toLowerCase() === newClient.name.toLowerCase()
  );

  if (existingClient) {
    <Alert severity="info">
      Již máš klientku se jménem "{newClient.name}".
      Jedná se o stejnou osobu nebo jinou?
    </Alert>
  }
  ```

**Soubory k úpravě**:
- `AddMaterialModal.jsx` - duplicate check before save
- `ProgramEditor.jsx` - duplicate check before save
- `storage.js` - generateUniqueShareCode function
- `ClientsList.jsx` nebo `AddClientModal.jsx` - name duplicate warning

---

## 📚 Sprint 38a: Průvodce Druhy Koučinku - Informační Stránka

**Zdroj**: Průvodce Druhy Koučinku z MASTER_TODO_V2.md (řádky 8435-8926)
**Priorita**: LOW
**Odhad**: 9-11 hodin

### 38.1 Page Structure

- [ ] **Stránka**: `/coach-types-guide`
  - [ ] Public page (nemusí být přihlášený)
  - [ ] SEO friendly (meta tags, headings)

- [ ] **Sections**:
  ```
  1. Hero
  2. Co je koučink? (Úvod)
  3. Podle oblasti klienta (Life, Career, Business, atd.)
  4. Podle školy/přístupu (ICF, NLP, Ontologický, atd.)
  5. Podle autority/certifikace (ICF, EMCC, AC, atd.)
  6. FAQ
  7. CTA: Začni s CoachPro
  ```

### 38.2 Content - Podle Oblast (Coaching Areas)

- [ ] **Life Coaching**:
  ```markdown
  ## Life Coaching (Osobní Rozvoj)

  ### Co to je?
  Zaměřuje se na **osobní život** klienta - vztahy, zdraví, životní balance, spokojenost.

  ### Kdy použít?
  - Klient chce zlepšit work-life balance
  - Hledá smysl a směr v životě
  - Řeší vztahové problémy

  ### Typické otázky:
  - "Co ve svém životě opravdu chci?"
  - "Jak si nastavit hranice?"
  - "Jak najít životní rovnováhu?"

  ### Doporučené metody:
  - Wheel of Life
  - Values clarification
  - Goal setting
  ```

- [ ] **Career Coaching** (podobně)
- [ ] **Business/Executive Coaching**
- [ ] **Relationship Coaching**
- [ ] **Health & Wellness Coaching**
- [ ] **Leadership Coaching**
- [ ] **Confidence & Self-Esteem**
- [ ] **Creativity Coaching**

### 38.3 Content - Podle Školy (Coaching Styles)

- [ ] **ICF (International Coaching Federation)**:
  ```markdown
  ## ICF Přístup

  ### Co to je?
  Nejrozšířenější mezinárodní standard. Zaměřuje se na **klienta jako experta** na jeho život.

  ### Principy:
  - Kouč se neptá, ale klade otázky
  - Klient má odpovědi v sobě
  - Proces je partnerský, ne direktivní

  ### Core Competencies:
  1. Ethics & Standards
  2. Embodies a Coaching Mindset
  3. Establishes & Maintains Agreements
  4. Cultivates Trust & Safety
  ... (11 kompetencí celkem)

  ### Certifikace:
  - ACC (Associate Certified Coach) - 100 hodin
  - PCC (Professional) - 500 hodin
  - MCC (Master) - 2500 hodin
  ```

- [ ] **NLP Coaching** (Neuro-Linguistic Programming)
- [ ] **Ontologický Koučink**
- [ ] **Systemický Koučink**
- [ ] **Positive Psychology Coaching**
- [ ] **Mindfulness-Based Coaching**
- [ ] **Solution-Focused Coaching**
- [ ] **Gestalt Coaching**

### 38.4 Content - Podle Autority (Certifikace)

- [ ] **ICF** (už v 38.3 ✅)
- [ ] **EMCC (European Mentoring & Coaching Council)**
- [ ] **AC (Association for Coaching)**
- [ ] **Erickson Coaching International**
- [ ] **Co-Active (CTI)**
- [ ] **NLP University**
- [ ] **Other: Ontological Coaching, Gestalt Coaching**

### 38.5 Visual Design

- [ ] **Icons**:
  - [ ] Každá oblast má ikonu (Heart, Briefcase, Users, atd.)
  - [ ] Každá škola má logo/symbol

- [ ] **Accordion komponenty**:
  ```javascript
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMore />}>
      <Heart size={24} />
      <Typography variant="h6">Life Coaching</Typography>
    </AccordionSummary>
    <AccordionDetails>
      {/* Content */}
    </AccordionDetails>
  </Accordion>
  ```

- [ ] **Comparison table** (optional):
  ```
  | Přístup      | Kdy použít           | Typ klienta        | Délka        |
  |--------------|----------------------|--------------------|--------------|
  | ICF          | Široké spektrum      | Jakýkoli           | 6-12 sezení  |
  | NLP          | Rychlá změna vzorců  | Pragmatický        | 3-6 sezení   |
  | Ontologický  | Hluboká transformace | Filosoficky laděný | 12+ sezení   |
  ```

### 38.6 SEO & Meta Tags

- [ ] **Meta tags**:
  ```html
  <title>Průvodce Druhy Koučinku | CoachPro</title>
  <meta name="description" content="Kompletní průvodce typy koučinku - Life, Career, Business coaching. ICF, NLP, Ontologický přístup. Najdi správný styl pro své klienty.">
  <meta property="og:title" content="Průvodce Druhy Koučinku">
  <meta property="og:image" content="[URL náhledového obrázku]">
  ```

- [ ] **Structured data** (optional):
  ```json
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Průvodce Druhy Koučinku",
    "author": {
      "@type": "Organization",
      "name": "CoachPro"
    }
  }
  ```

### 38.7 CTA (Call to Action)

- [ ] **Na konci stránky**:
  ```javascript
  <Box textAlign="center" py={8} sx={{ background: 'linear-gradient(...)' }}>
    <Typography variant="h4" mb={2}>
      Připravena začít s CoachPro?
    </Typography>
    <Typography variant="body1" mb={4}>
      Vytvoř si účet zdarma a vyzkoušej 30 dní beta verzi.
    </Typography>
    <Button
      variant="contained"
      size="large"
      onClick={() => navigate('/tester-signup')}
    >
      Začít zdarma
    </Button>
  </Box>
  ```

**Soubory k vytvoření**:
- `CoachTypesGuide.jsx` (page)
- `CoachingAreaSection.jsx`
- `CoachingStyleSection.jsx`
- `CoachingAuthoritySection.jsx`
- `CoachTypesHero.jsx`
- `CoachTypesFAQ.jsx`

**Soubory k úpravě**:
- `App.jsx` - add route `/coach-types-guide`
- SEO meta tags v `index.html` nebo Helmet component

---

## 📊 FINÁLNÍ STATISTIKY MASTER_TODO_V3.md

**Celkem sprintů**: 38 (1a-38a)
**Zdroj**: MASTER_TODO_V2.md (8,926 řádků) - kompletně systematicky zpracováno

### Priorita Breakdown:

- **CRITICAL** 🔥: 2 sprinty
  - Sprint 1a (Foreign Key Fix)
  - Sprint 20a (Production Deployment)

- **HIGH**: 9 sprintů
  - Sprint 2a, 3a, 4a, 5a, 6a, 7a, 10a, 21a, 31a

- **MEDIUM**: 15 sprintů
  - Sprint 8a, 9a, 11a, 14a, 16a, 17a, 18a, 22a, 23a, 26a, 27a, 28a, 30a, 32a, 35a, 36a

- **LOW**: 12 sprintů
  - Sprint 12a, 13a, 15a, 19a, 24a, 25a, 29a, 33a, 34a, 37a, 38a
  - Sprint 29a (AI Checklisty) - optional feature

### Odhad celkem:

**Hodiny**: ~350-500 hodin (závisí na rozsahu implementace)

**Fáze**:
1. **Kritické bugfixy** (Sprint 1a, 20a): 6-8 hodin
2. **Production ready** (Sprint 2a-7a, 31a): 40-60 hodin
3. **Client Experience** (Sprint 21a, 22a, 27a, 28a): 50-70 hodin
4. **Advanced Features** (Sprint 8a-19a, 23a-38a): 250-360 hodin

---

**Status**: ✅ KOMPLETNĚ DOKONČENO
**Poslední update**: 3. listopadu 2025
**Verze**: 3.0 FINAL
**AI asistent**: Claude Sonnet 4.5
**Zpracováno**: 8,926 / 8,926 řádků (100%)

---

## ✅ Session Update: 5.1.2025 - Google OAuth Integration Complete

**Dokončeno**:
- [x] SQL migrace (3) spuštěny v Supabase (opraveno pořadí + UUID casting)
- [x] Google OAuth nakonfigurován v Supabase
- [x] ClientEntry.jsx aktualizován pro OAuth + fallback flow
- [x] OAuth klientky propojeny s programy přes auth_user_id
- [x] Backward compatibility s code-based flow zachována

**OAuth Flow**: ✅ Funkční
```
Signup → Profile → Entry (6-digit code) → Program access
```

**Fallback Flow**: ✅ Funkční
```
Entry (6-digit code) → Optional name → Program access
```

---

## ✅ Session Update: 6.11.2025 - Google OAuth Cleanup & Smart Client Flow

**Dokončeno**:
- [x] GoogleSignInButton.jsx - Modulární komponenta (134 řádků)
  - Google brand colors (#4285F4, #357ae8)
  - Props: variant, redirectTo, showDivider, buttonText, showSuccessToast, onError
  - Reusable across multiple entry points
- [x] Client.jsx - Nová vstupní stránka (440 řádků)
  - Unified entry point: Google OAuth + 6-digit code
  - Auto-detection code typu (program/material/card-deck)
  - Clean UX bez auto-login detection
- [x] ClientProfile.jsx - 3-state smart UI (720 řádků)
  - State A: No profile → Registration form
  - State B: Has profile, NO program → Welcome screen + code input
  - State C: Has profile, HAS program → Auto-redirect to /client/daily
- [x] Czech Vocative Case (5. pád) implementace
  - Pouze první jméno (Lenka Penka Podkolenka → Lenko)
  - getVocative() helper funkce
- [x] Google OAuth name priority
  - user.user_metadata.full_name má prioritu nad DB name
  - Auto-synchronizace jména z Google účtu
- [x] URL restructuring
  - /client (nová hlavní entry point)
  - /tester (coach entry)
  - Odstraněny: /client/signup, /client/entry
- [x] Storage functions rozšířeny
  - getMaterialByCode()
  - getCardDeckByCode()
- [x] Route references fixes (8 souborů)
  - ClientSignup.jsx, DailyView.jsx, MaterialView.jsx, MaterialEntry.jsx
  - Login.jsx, ClientProfile.jsx, ClientView.jsx, App.jsx

**Client Flow**: ✅ Plně funkční
```
1. User navigates to /client
2. Either:
   a) Click "Pokračovat s Google" → /client/profile (3-state UI)
   b) Enter 6-digit code → Auto-detect type → Redirect to content

3. ClientProfile 3-state logic:
   - No profile? → Show registration form
   - Has profile but NO program? → Welcome screen "Vítejte zpět, [Vocative]!"
   - Has profile AND program? → Auto-redirect to /client/daily
```

**Technical Highlights**:
- Vocative: "Lenka" → "Lenko" (jen první jméno!)
- Google name sync: user.user_metadata.full_name priorita
- Efficient Supabase queries (2-3 per page load, indexed)
- Auto-detection: program vs material vs card-deck

**Files Modified**: 12 souborů
- New: GoogleSignInButton.jsx (134), Client.jsx (440)
- Refactored: ClientProfile.jsx (720)
- Updated: storage.js (2 new functions)
- Fixed routes: 8 files

**Pending**:
- [ ] Test production OAuth flow
- [ ] Choose coach from list feature (State B enhancement)
- [ ] Card deck client interface

**Příští priorita**: Testování v production, UX vylepšení
