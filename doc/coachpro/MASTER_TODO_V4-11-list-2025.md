# MASTER TODO V4 - CoachPro

**Poslední update:** 11. listopadu 2025
**Status:** Session #13 dokončena ✅ (AUTH TROUBLESHOOTING)

---

## 🎉 SESSION #13 COMPLETED (11.11.2025) ✅

**FOCUS:** Authentication Analysis & Troubleshooting Documentation

- [x] **Auth System Analysis**
  - Identified 3 types of authentication (OAuth, Email+Password, Access Code)
  - Discovered root cause: Access code users have NO auth_user_id
  - Analyzed tester registration flow (/tester signup form)
  - Confirmed RLS requires auth_user_id for materials access

- [x] **Troubleshooting Documentation (CRITICAL)**
  - Created `docs/TROUBLESHOOTING_AUTH.md` (350+ lines)
  - 5-step diagnostika process
  - 4 common problems with SQL fixes
  - Comprehensive diagnostic queries
  - Prevention checklist

- [x] **Architecture Planning**
  - Planned VARIANTA A: Auto-create auth accounts during tester registration
  - Designed new registration flow (form → create auth → generate code)
  - Benefits: RLS works for ALL users, data never disappears

- [x] **Documentation Updates**
  - Updated CLAUDE.md with auth section and critical warnings
  - Created summary13.md (complete session documentation)
  - Added auth_user_id best practices
  - Added troubleshooting quick reference

- [x] **Code Review (No Changes)**
  - Verified AdminLogin.jsx saves auth_user_id correctly
  - Verified Tester.jsx preserves auth_user_id
  - Verified storage.js doesn't overwrite is_admin
  - Confirmed ShareCardDeckModal already has Share button

---

## 🎉 SESSION #12 COMPLETED (9.11.2025) ✅

- [x] **Photo Upload System (Modular)**
  - WebP compression (imageCompression.js)
  - Supabase Storage (photoStorage.js)
  - Reusable PhotoUpload component
  - Storage bucket + RLS policies

- [x] **Extended Client Profile**
  - Photo upload in header
  - 7 new fields (timezone, preferred_contact, client_notes, coach_id, etc.)
  - Coach info display
  - Vocative case fix

- [x] **Session Management (Fully Modular)**
  - sessions.js utils (402 lines, CRUD + formatters)
  - SessionCard component (universal client/coach)
  - ClientDashboard widget (next session)
  - ClientSessions page (upcoming/past tabs)
  - Database table + trigger + indexes

- [x] **Security Fixes (3 issues)**
  - Security Definer → Invoker (client_next_sessions view)
  - RLS enabled for email_verification_tokens
  - RLS enabled for password_reset_tokens

- [x] **Bug Fixes (5 issues)**
  - Photo state sync (useEffect fix)
  - 406 error (.single() → array response)
  - Embedded resources (separate queries)
  - Migration constraints (DO blocks)
  - Token table policies (user_id vs email)

---

## 🔥 HOTFIX (Session #11 - COMPLETED ✅)

- [x] **CRITICAL: Auth bugy po migraci karet**
  - Admin status reset `true` → `false` při refreshi
  - Tester ID reset `UUID` → `NULL`
  - TesterAuthGuard přepisoval databázi
  - **FIX**: Guard je READ-ONLY, jen localStorage
  - **FIX**: Preserve DB values, never override
  - **FIX**: Race condition (2 useEffects → 1)

- [x] **REFACTORING: Duplicitní auth kód**
  - 462 řádků duplicity (TesterAuth + ClientAuth)
  - **FIX**: GenericAuthContext (factory pattern)
  - **FIX**: GenericAuthGuard (base component)
  - **RESULT**: 73% redukce kódu (462 → 125 lines)

- [x] **CLEANUP**
  - Deprecated složka smazána
  - DEBUG soubory smazány
  - Production build tested ✅

---

## 📋 TODO LISTS (Prioritizované)

### ⚠️ CRITICAL: Auth System Fix (HIGHEST PRIORITY) 🚨
- [ ] **VARIANTA A: Auto-create auth accounts**
  - [ ] Find tester registration page (TesterSignup.jsx or similar)
  - [ ] Implement auto auth account creation during registration
  - [ ] Test new registration flow (form → auth account → code)
  - [ ] Verify RLS works for new testers
  - [ ] Consider migrating existing testers (create auth accounts retroactively)
  - [ ] **Impact:** Fixes 90% of "can't see materials" issues
  - [ ] **Documentation:** `docs/TROUBLESHOOTING_AUTH.md`

### Sprint 2a-extended: Sharing System (HIGH) 🎯
- [ ] 2a.5: Add email field to ShareMaterialModal (personalized sharing)
- [ ] 2a.6: Implement email validation for personalized sharing
- [ ] 2a.7: Complete public sharing system (coachpro_shared_programs table)
- [ ] 2a.8: Email collection for public shares

### Sprint 12a: Coach Session Management (HIGH) 🎯
- [ ] 12a.1: Coach session creation UI (`/coach/sessions/new`)
  - Form pro vytvoření sezení
  - Výběr klientky ze seznamu
  - Datum/čas picker (date-fns)
  - Trvání, lokace, notes
- [ ] 12a.2: Coach session list (`/coach/sessions`)
  - Upcoming/Past tabs
  - SessionCard s viewMode="coach"
  - Bulk operations (cancel multiple)
- [ ] 12a.3: Assign client to coach
  - UI pro přiřazení klientky ke koučce
  - Update client profile coach_id
- [ ] 12a.4: Session notifications
  - Email notifikace (24h, 1h před sezením)
  - In-app notifications
- [ ] 12a.5: Calendar integration
  - .ics export
  - Google Calendar sync (optional)

### Sprint 2a: Klientské Rozhraní (MEDIUM) 🎯
- [ ] 2a.1: Materials page (`/client/materials`) - zobrazení sdílených materiálů
- [ ] 2a.2: Coach profil v materials (Lenka R., phone, email)
- [ ] 2a.3: Help page (`/client/help`) - kontakt na Lenku
- [ ] 2a.4: Natálka OAuth access (LOW priority - čeká na user request)

### Sprint 6a: Koučovací Karty - Klientská část (MEDIUM) 🎴  
- [ ] 6a.1: Client interface pro karty (`/client/cards`)
- [ ] 6a.2: Share balíčků karet (obdobně jako materiály)
- [ ] 6a.3: Client může třídit karty a psát poznámky

### Sprint 18b: Button Modularity (FUTURE) ⏳
- [ ] Status: Pending
- [ ] Odhad: 6-8 hodin
- [ ] Create 5 functions: sizing, variant, color, icons, responsive
- [ ] Phase 1: Extract patterns
- [ ] Phase 2: Create helper functions
- [ ] Phase 3: Apply globally

### Sprint 18c: MaterialCard → BaseCard (FUTURE) ⏳
- [ ] Status: Pending (tech debt)
- [ ] MaterialCard.jsx NEpoužívá BaseCard
- [ ] Refactor na BaseCard pattern (jako ProgramCard)

---

## ✅ HOTOVO (Recent)

### Session #12 (9.11.2025) - Session Management & Photo Upload ✅
- ✅ Modular photo upload (imageCompression.js, photoStorage.js, PhotoUpload.jsx)
- ✅ Extended client profile (7 new fields, coach assignment)
- ✅ Full session management system (sessions.js utils, SessionCard component)
- ✅ Client dashboard session widget + ClientSessions page
- ✅ Database: coachpro_sessions table + trigger + indexes
- ✅ Fixed 3 Security Advisor errors (RLS policies, security invoker)
- ✅ Fixed 5 bugs (photo sync, 406 error, migration constraints)
- ✅ Documentation (summary12.md, claude.md updated)

### Session #11 (9.11.2025) - Auth Refactoring ✅
- ✅ Fixed critical auth bugs (admin reset, tester ID reset)
- ✅ Refactored duplicated auth code (73% reduction)
- ✅ Created GenericAuthContext + GenericAuthGuard
- ✅ Fixed race conditions (merged useEffects)
- ✅ Cleaned up deprecated files
- ✅ Production build tested
- ✅ Documentation (summary11.md, REFACTORING_SUMMARY.md)

### Session #10 (8.11.2025) - Koučovací Karty ✅
- ✅ Database migration (coachpro_cards_v2, card_notes_v2)
- ✅ Frontend card system (DeckSelector, MotifSelector, CardGrid, CardFlipView)
- ✅ Visual enhancements (CSS filters, watermarks)
- ✅ Technical fixes (type mismatch, deck case sensitivity)

### Session #9 (8.11.2025) - RLS Security ✅
- ✅ RLS policies for coaches (coach-scoped)
- ✅ Multi-admin support
- ✅ Admin exception handling

### Session #8 (8.11.2025) - Security Audit ✅
- ✅ DashboardOverview personalized greeting
- ✅ RLS security audit (identified vulnerability)

### Session #6-7 (6.11.2025) - Google OAuth ✅
- ✅ ClientAuthContext + ClientAuthGuard
- ✅ RootRedirect (universal OAuth entry)
- ✅ Czech vocative case (czechGrammar.js)

---

## 🚧 KNOWN ISSUES / TECH DEBT

- 🚨 **CRITICAL: Access code testers have NO auth_user_id**
  - Impact: Cannot see materials (RLS blocks them)
  - Impact: Cannot add materials (403 Forbidden)
  - Affected: ~90% of testers who registered via form
  - Fix: VARIANTA A (auto-create auth accounts)
  - Status: **HIGHEST PRIORITY**

- ⚠️ MaterialCard.jsx NEpoužívá BaseCard (Sprint 18c)
- ⏳ Button modularity (Sprint 18b - 6-8 hours)
- ⏳ Large chunks in build (heic2any = 1.3MB, pdf = 439KB)

---

## 📁 FILES CHANGED (Session #13)

**Created (2 files)**:
- `docs/TROUBLESHOOTING_AUTH.md` - Auth troubleshooting guide (350+ lines)
- `docs/summary13.md` - Session #13 documentation

**Modified (1 file)**:
- `CLAUDE.md` - Added auth section, warnings, troubleshooting references

**Analyzed (8 files - No changes)**:
- `src/modules/coach/pages/AdminLogin.jsx` - Verified auth_user_id save
- `src/modules/coach/pages/Tester.jsx` - Verified auth_user_id preservation
- `src/modules/coach/pages/ProfilePage.jsx` - Verified async handling
- `src/modules/coach/utils/storage.js` - Verified is_admin protection
- `src/modules/coach/components/coach/ShareCardDeckModal.jsx` - Confirmed Share button exists
- `src/modules/coach/components/coach/ShareMaterialModal.jsx` - Identified missing email field
- `src/modules/coach/components/coach/CardDecksLibrary.jsx` - Verified Share functionality
- `src/modules/coach/components/client/ClientCardDeckEntry.jsx` - Verified auto-assign

---

## 📁 FILES CHANGED (Session #12)

**Created (9 files)**:
- `src/shared/utils/imageCompression.js` - WebP compression utilities
- `src/shared/utils/photoStorage.js` - Supabase Storage operations
- `src/shared/utils/sessions.js` - Session CRUD & formatting (402 lines)
- `src/shared/components/PhotoUpload.jsx` - Reusable photo upload
- `src/shared/components/SessionCard.jsx` - Universal session card
- `src/modules/coach/pages/ClientSessions.jsx` - Sessions history page
- `supabase/migrations/20251109_01_extend_client_profiles_and_add_sessions.sql`
- `supabase/migrations/20251109_02_fix_sessions_rls.sql`
- `supabase/migrations/20251109_03_security_fixes.sql`

**Modified (6 files)**:
- `src/modules/coach/pages/ClientProfile.jsx` - Photo upload, new fields
- `src/modules/coach/pages/ClientDashboard.jsx` - Next session widget
- `src/modules/coach/pages/ClientWelcome.jsx` - Avatar with photo
- `src/modules/coach/pages/ClientView.jsx` - Route /client/sessions
- `src/shared/components/RoleSelector.jsx` - Vocative case fix
- `claude.md` - Updated with new patterns (495 lines)

**Statistics**:
- Added ~2700 lines of code
- Fixed 5 bugs
- Resolved 3 security issues
- 0 Security Advisor errors ✅

---

**Pro detaily**: Viz `summary12.md` (334 lines)

---

## 📁 FILES CHANGED (Session #11)

**Created (3 files)**:
- `src/shared/context/GenericAuthContext.jsx` (170 lines)
- `src/shared/components/GenericAuthGuard.jsx` (87 lines)
- `REFACTORING_SUMMARY.md` (documentation)

**Refactored (6 files)**:
- `src/shared/context/TesterAuthContext.jsx` (145 → 40 lines)
- `src/shared/context/ClientAuthContext.jsx` (115 → 12 lines)
- `src/shared/components/TesterAuthGuard.jsx` (125 → 35 lines)
- `src/shared/components/ClientAuthGuard.jsx` (77 → 35 lines)
- `src/modules/coach/pages/CoachView.jsx` (created wrapper)
- `src/App.jsx` (changed CoachDashboard → CoachView)

**Deleted (3 items)**:
- `src/shared/components/_deprecated/` (entire folder)
- `DEBUG_check_coaches.sql`
- `DEBUG_localStorage.js`

---

**Pro detaily**: Viz `summary11.md` (620+ lines)
