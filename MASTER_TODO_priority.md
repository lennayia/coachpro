# 🎯 MASTER TODO - PRIORITY

**TOP PRIORITY podle uživatelky**
**Poslední update:** 9. listopadu 2025 (Session #12)

---

## ✅ HOTOVO (Session #12)

**Session Management & Photo Upload** 📸
- [x] Modular photo upload system (WebP compression, Storage) → **DONE**
- [x] Extended client profile (7 new fields, coach assignment) → **DONE**
- [x] Session management utils (sessions.js, 402 lines) → **DONE**
- [x] SessionCard component (universal client/coach) → **DONE**
- [x] ClientDashboard session widget → **DONE**
- [x] ClientSessions page (upcoming/past tabs) → **DONE**
- [x] Database: coachpro_sessions table + RLS → **DONE**
- [x] Fixed 3 Security Advisor errors → **FIXED ✅**
- [x] Fixed 5 bugs (photo sync, 406 error, etc.) → **FIXED**

## ✅ HOTOVO (Session #11)

**Auth Refactoring & Critical Bugfixes** 🔐
- [x] TesterAuthGuard přepisoval databázi → **FIXED**
- [x] Admin status reset při refreshi → **FIXED**
- [x] Race conditions v guards → **FIXED**
- [x] Refactoring duplicitního kódu (73% redukce) → **DONE**
- [x] Production build test → **PASSED ✅**

---

## 🔥 HIGH PRIORITY

### 1. Coach Session Management (Sprint 12a) 🎯

**Status:** Pending (Backend ready ✅)
**Context:** Client session viewing done, now need coach management UI

**Tasks:**
- [ ] **Coach session creation** (`/coach/sessions/new`)
  - Form pro vytvoření sezení
  - Výběr klientky ze seznamu (dropdown)
  - Datum/čas picker s Czech locale
  - Trvání (default 60 min), lokace (online/in-person/phone)
  - Coach notes field
  - Použít `createSession()` z sessions.js

- [ ] **Coach session list** (`/coach/sessions`)
  - Upcoming/Past tabs (stejný pattern jako ClientSessions)
  - SessionCard s viewMode="coach"
  - Bulk operations (zrušit více sezení najednou)
  - Použít `getCoachSessions()` z sessions.js

- [ ] **Assign client to coach**
  - UI pro přiřazení klientky ke koučce
  - Update client profile coach_id field
  - Zobrazit seznam unassigned clients

- [ ] **Session notifications** (optional, MEDIUM)
  - Email notifikace před sezením (24h, 1h)
  - In-app notifications
  - Edge Functions nebo pg_cron

**Odhad:** 6-8 hodin
**Priorita:** 🔥 HIGH
**Dependencies:** ✅ sessions.js, ✅ SessionCard, ✅ Database schema

---

### 2. Klientské Rozhraní (Sprint 2a) 🎯

**Status:** Pending
**Uživatelka říká:** "tohle bych potřebovala prioritně"

**Tasks:**
- [ ] **Materials page** (`/client/materials`)
  - Zobrazení sdílených materiálů od Lenky
  - Filtrace (all/favorites)
  - Material detail view

- [ ] **Coach profil v materials**
  - Jméno: Lenka Roubalová
  - Telefon: +420 123 456 789
  - Email: lenka@online-byznys.cz
  - Text: "Online Byznys - koučování"

- [ ] **Help page** (`/client/help`)
  - Kontakt na Lenku
  - FAQ
  - Odkaz na privacy policy

**Odhad:** 4-6 hodin
**Priorita:** 🔥 HIGH

---

## 🎴 MEDIUM PRIORITY

### 2. Koučovací Karty - Klientská část (Sprint 6a)

**Status:** Backend hotov ✅, frontend pending  
**Prerekvizity:** Sprint 2a (materials page pattern)

**Tasks:**
- [ ] Client interface (`/client/cards`)
- [ ] Share balíčků (obdobně jako materiály)
- [ ] Client notes na kartách

**Odhad:** 6-8 hodin  
**Priorita:** 🟡 MEDIUM

---

## ⏳ FUTURE (LOW PRIORITY)

### 3. Button Modularity (Sprint 18b)

**Odhad:** 6-8 hodin  
**Status:** Tech debt, neblokující

### 4. MaterialCard → BaseCard (Sprint 18c)

**Odhad:** 3-4 hodiny  
**Status:** Tech debt, neblokující

### 5. Natálka OAuth Access (Sprint 2a.4)

**Status:** Čeká na user request  
**Priorita:** ⬇️ LOW

---

## 📊 PROGRESS TRACKER

| Sprint | Status | Priority | Est. Time | Completion |
|--------|--------|----------|-----------|------------|
| Session #12 (Sessions) | ✅ DONE | 🔥 HIGH | 4h | 100% |
| Session #11 (Auth) | ✅ DONE | 🔥 CRITICAL | 6h | 100% |
| Sprint 12a (Coach Sessions) | ⏳ Pending | 🔥 HIGH | 6-8h | 0% |
| Sprint 2a (Client UI) | ⏳ Pending | 🔥 HIGH | 4-6h | 0% |
| Sprint 6a (Client Cards) | ⏳ Pending | 🟡 MEDIUM | 6-8h | 0% |
| Sprint 18b (Buttons) | ⏳ Future | 🔵 LOW | 6-8h | 0% |
| Sprint 18c (MaterialCard) | ⏳ Future | 🔵 LOW | 3-4h | 0% |

---

**Next Session:** Sprint 12a (Coach Session Management) 🎯
**Alternative:** Sprint 2a (Client Materials/Help) - depends on user priority
