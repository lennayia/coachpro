# CONTEXT QUICK - Aktuální stav projektu

**Poslední update:** 9. listopadu 2025 (Session #11)  
**Status:** ✅ Production-ready  
**Branch:** `fix/client-route-consolidation`

---

## 🎯 CO SE PRÁVĚ STALO (Session #11)

### KRITICKÁ OPRAVA - Auth System Breakdown 🚨

**Problem:**
- Po Session #10 (migrace karet) se rozbila autentizace
- Admin status `true` → `false` při každém refreshi
- Tester ID `UUID` → `NULL`
- Materiály/programy nebyly vidět (počty = 0)

**Root Cause:**
```javascript
// TesterAuthGuard.jsx - PROBLÉM!
await saveCoach(coachUser);  // ← PŘEPISOVALO DATABÁZI při každém načtení!
```

**Fix:**
```javascript
// Guard je READ-ONLY
setCurrentUser(coachUser);  // ← Jen localStorage, NE databáze!
```

**Výsledek:**
- ✅ Admin status se už NEzmění
- ✅ Tester ID zachován
- ✅ Databáze protected
- ✅ 3 kritické bugy opraveny

---

### VELKÝ REFACTORING - 73% Code Reduction 🏗️

**Before:**
- TesterAuthContext: 145 řádků
- ClientAuthContext: 115 řádků  
- TesterAuthGuard: 125 řádků
- ClientAuthGuard: 77 řádků
- **TOTAL**: 462 řádků (95% duplicity!)

**After:**
- GenericAuthContext: 170 řádků (factory)
- GenericAuthGuard: 87 řádků (base)
- TesterAuthContext: 40 řádků (-72%)
- ClientAuthContext: 12 řádků (-90%)
- TesterAuthGuard: 35 řádků (-72%)
- ClientAuthGuard: 35 řádků (-54%)
- **TOTAL**: 379 řádků (including generic)

**Benefit:** Změny v auth logice jen na 1 místě!

---

## 📊 AKTUÁLNÍ STAV APLIKACE

### ✅ CO FUNGUJE

**Authentication:**
- ✅ Google OAuth (klientky, testers)
- ✅ Supabase Auth (admin email/password)
- ✅ Access code fallback (klientky bez OAuth)
- ✅ Multi-admin support (Lenka + Natálka)
- ✅ RLS security (client profiles, testers)

**Features (Coach):**
- ✅ Materials library (create, edit, share)
- ✅ Programs library (create, edit, share)
- ✅ Client management
- ✅ Coaching cards (Deck A - 18 karet)
- ✅ Tester management (admin only)
- ✅ Profile management

**Features (Client):**
- ✅ Welcome screen + dashboard
- ✅ Profile management
- ✅ Access code entry
- ✅ Daily motivation view
- ⏳ Materials page (PENDING - Sprint 2a)
- ⏳ Coaching cards (PENDING - Sprint 6a)

---

### 🏗️ ARCHITEKTURA

**Auth System:**
```
GenericAuthContext (factory)
├── TesterAuthContext (OAuth + coach session)
└── ClientAuthContext (OAuth only)

GenericAuthGuard (base)
├── TesterAuthGuard (+ localStorage fallback)
└── ClientAuthGuard (OAuth only)
```

**Key Patterns:**
- Factory pattern pro contexts
- Wrapper pattern pro guards
- Single Source of Truth (databáze)
- Separation of Concerns (Guard ≠ Data Loading)

---

## 🔐 AUTH FLOWS

### 1. OAuth Tester (Google)
1. `/tester/signup` → Google OAuth
2. RootRedirect → Supabase `testers` lookup
3. TesterAuthContext → Load profile
4. TesterAuthContext → **Load coach session** (if coach)
5. Navigate `/tester/welcome` nebo `/coach/dashboard`

### 2. Admin Login (Email/Password)
1. `/lenna` → AdminLogin form
2. Supabase Auth `signInWithPassword()`
3. Load from `coachpro_coaches` table
4. `setCurrentUser({ isAdmin: true })`
5. Navigate `/coach/dashboard`

### 3. OAuth Client (Google)
1. `/client` → Google OAuth
2. RootRedirect → `coachpro_client_profiles` lookup
3. ClientAuthContext → Load profile
4. Navigate `/client/welcome` nebo `/client/dashboard`

### 4. Client Access Code
1. `/client` → 6-digit code entry
2. Optional name input
3. Lookup in `coachpro_clients` (no OAuth)
4. Navigate `/client/dashboard`

---

## 📁 KLÍČOVÉ SOUBORY

### Authentication (NEW/REFACTORED)
- `GenericAuthContext.jsx` - Factory pro auth contexts (NEW)
- `GenericAuthGuard.jsx` - Base guard component (NEW)
- `TesterAuthContext.jsx` - 40 lines (was 145)
- `ClientAuthContext.jsx` - 12 lines (was 115)
- `TesterAuthGuard.jsx` - 35 lines (was 125)
- `ClientAuthGuard.jsx` - 35 lines (was 77)
- `CoachView.jsx` - Wrapper s TesterAuthProvider (NEW)

### Core Systems
- `storage.js` - Supabase + localStorage utils
- `supabaseStorage.js` - File upload/delete
- `borderRadius.js` - Border-radius konstant
- `modernEffects.js` - Glassmorphism
- `NotificationContext.jsx` - Toast system

### Cards
- `CoachingCardsPage.jsx` - Main coach interface
- `cardDeckThemes.js` - Color schemes
- `cardImageFilters.js` - CSS filters

---

## ⚠️ KRITICKÁ PRAVIDLA

### 1. Guards jsou READ-ONLY
```javascript
// ❌ NIKDY
await saveCoach(coachUser);

// ✅ VŽDY
setCurrentUser(coachUser);  // localStorage only!
```

### 2. Preserve DB Values
```javascript
// ❌ NIKDY hardcode
isAdmin: false

// ✅ VŽDY z DB
isAdmin: existingCoach.is_admin
```

### 3. Single useEffect (no race conditions)
```javascript
// ✅ Merge multiple effects
useEffect(() => {
  let isMounted = true;
  const handleAuth = async () => {
    await loadSession();  // First
    if (!isMounted) return;
    checkAuth();          // Then
  };
  handleAuth();
  return () => { isMounted = false; };
}, [deps]);
```

---

## 📊 TECH STACK

- **Frontend:** React 18, MUI v6, Vite
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Deployment:** Vercel
- **Auth:** Google OAuth + Supabase Auth
- **Storage:** Supabase Storage (images) + PostgreSQL

---

## 🚀 NEXT STEPS

**Priorita #1:** Sprint 2a - Klientské Rozhraní
- [ ] Materials page (`/client/materials`)
- [ ] Coach profil
- [ ] Help page

**Priorita #2:** Sprint 6a - Koučovací Karty (Client)
- [ ] Client card interface
- [ ] Share balíčků
- [ ] Client notes

---

## 📖 DOKUMENTACE

- `summary11.md` - Session #11 changelog (620+ lines)
- `REFACTORING_SUMMARY.md` - Refactoring details
- `CLAUDE_QUICK.md` - Critical rules
- `MASTER_TODO_V4.md` - Full TODO list
- `MASTER_TODO_priority.md` - Priority tasks

---

**Pro session history:** Viz `summary11.md`  
**Pro critical rules:** Viz `CLAUDE_QUICK.md`  
**Pro TODO:** Viz `MASTER_TODO_priority.md`
