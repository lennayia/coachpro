# MASTER TODO V4 - CoachPro

**Poslední update:** 9. listopadu 2025
**Status:** Session #11 dokončena ✅

---

## 🔥 HOTFIX (Aktuální session #11 - COMPLETED ✅)

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

### Sprint 2a: Klientské Rozhraní (HIGH) 🎯
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

- ⚠️ MaterialCard.jsx NEpoužívá BaseCard (Sprint 18c)
- ⏳ Button modularity (Sprint 18b - 6-8 hours)
- ⏳ Large chunks in build (heic2any = 1.3MB, pdf = 439KB)

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
