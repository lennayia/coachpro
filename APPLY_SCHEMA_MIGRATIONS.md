# 🏗️ ProApp Multi-tenant Schema Migration Guide

**Cíl:** Připravit ProApp Supabase projekt pro multiple aplikace (CoachPro, ContentPro, PaymentsPro, StudyPro, LifePro, DigiPro)

**Metoda:** PostgreSQL schemas pro separaci dat

**Status:** ✅ Dokončeno 17.01.2025

---

## 📋 Prerequisites

- [x] Supabase projekt "ProApp" běží ✅
- [x] CoachPro aplikace funguje ✅
- [x] Máš backup dat (nebo jsi v dev prostředí) ✅
- [x] SQL Editor v Supabase je otevřený ✅

---

## 🚀 Migration Steps

### 1️⃣ Vytvoř Schema Strukturu

**Soubor:** `supabase/migrations/20250117_01_create_schema_structure.sql`

**Co dělá:**
- Vytvoří schemas: `public`, `coachpro`, `lifepro`, `digipro`
- Nastaví permissions pro authenticated/anon users
- Nastaví search path

**Aplikace:**
```sql
-- Zkopíruj CELÝ obsah 20250117_01_create_schema_structure.sql
-- Spusť v Supabase SQL Editor
```

**Ověření:**
```sql
SELECT schema_name
FROM information_schema.schemata
WHERE schema_name IN ('public', 'coachpro', 'lifepro', 'digipro')
ORDER BY schema_name;
```

**Očekávaný výsledek:**
```
schema_name
-----------
coachpro
contentpro
digipro
lifepro
paymentspro
public
studypro
```

✅ **Status:** Dokončeno 17.01.2025

---

### 2️⃣ Přesuň CoachPro Tabulky

**Soubor:** `supabase/migrations/20250117_02_move_tables_to_coachpro_schema.sql`

**Co dělá:**
- Přesune všechny `coachpro_*` tabulky z `public` do `coachpro` schema
- Přesune trigger functions
- Zaktualizuje triggers

**Aplikace:**
```sql
-- Zkopíruj CELÝ obsah 20250117_02_move_tables_to_coachpro_schema.sql
-- Spusť v Supabase SQL Editor
```

**Ověření:**
```sql
-- Zobraz všechny tabulky v coachpro schema
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'coachpro'
ORDER BY table_name;

-- Počet tabulek per schema
SELECT
  table_schema,
  COUNT(*) as table_count
FROM information_schema.tables
WHERE table_schema IN ('public', 'coachpro')
GROUP BY table_schema;
```

**Očekávaný výsledek:**
```
table_schema | table_count
-------------|------------
coachpro     | 28 (všechny CoachPro tabulky)
public       | 0 (před Migration 03)
```

✅ **Status:** Dokončeno 17.01.2025
**Poznámka:** Přesunuto 28 tabulek včetně těch bez coachpro_ prefixu (testers, users, atd.)

---

### 3️⃣ Vytvoř Sdílené Tabulky

**Soubor:** `supabase/migrations/20250117_03_create_shared_tables.sql`

**Co dělá:**
- Vytvoří tabulky v `public` schema pro sdílené věci:
  - `organizations` (future multi-tenant)
  - `user_profiles` (extends auth.users)
  - `subscriptions` (per-app subscriptions)
  - `payments` (transaction log)
  - `notifications` (cross-app)
  - `audit_logs` (security)

**Aplikace:**
```sql
-- Zkopíruj CELÝ obsah 20250117_03_create_shared_tables.sql
-- Spusť v Supabase SQL Editor
```

**Ověření:**
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'organizations',
    'user_profiles',
    'subscriptions',
    'payments',
    'notifications',
    'audit_logs'
  )
ORDER BY table_name;
```

**Očekávaný výsledek:**
```
table_name
--------------
audit_logs
notifications
organizations
payments
subscriptions
user_profiles
```

✅ **Status:** Dokončeno 17.01.2025
**Poznámka:** Všechny tabulky podporují 6 modulů (coachpro, contentpro, paymentspro, studypro, lifepro, digipro)

**Podrobná dokumentace:** [docs/MIGRATION_03_SHARED_TABLES.md](docs/MIGRATION_03_SHARED_TABLES.md)

---

### 4️⃣ Update CoachPro Kód

**Dvě možnosti:**

#### Option A: Schema Alias (DOPORUČENO - žádná změna kódu)

Edituj `src/supabaseClient.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'coachpro', // ✅ Default schema
  },
});
```

**Benefit:** Všechny `.from('coachpro_coaches')` fungují BEZ změny!

✅ **Status:** Aplikováno v `src/shared/config/supabase.js` - 17.01.2025

---

#### Option B: Explicit Schema (pro plnou kontrolu)

Find & Replace všude v `src/`:

```javascript
// PŘED
.from('coachpro_coaches')

// PO
.from('coachpro.coachpro_coaches')
```

**Důležité soubory:**
- `src/shared/utils/storage.js`
- `src/shared/utils/publicCatalog.js`
- `src/contexts/*.jsx`
- `src/modules/*/pages/*.jsx`

---

### 5️⃣ Testování

**Testing Checklist:**

- [x] Dev server běží (`npm run dev`) ✅
- [x] Coach login funguje ✅
- [x] Client login funguje ✅
- [x] Material list se načítá ✅
- [x] Program list se načítá ✅
- [x] Purchase flow funguje (lead magnets) ✅
- [x] Session management funguje ✅
- [x] Card decks fungují ✅
- [x] No console errors ✅

✅ **Status:** Všechny testy prošly - 17.01.2025

**Test query v browser console:**
```javascript
const { data, error } = await supabase
  .from('coachpro_coaches')
  .select('*')
  .limit(1);

console.log('Data:', data);
console.log('Error:', error);
```

**Očekávaný výsledek:** Data se načte BEZ erroru

---

## 🎯 Finální Struktura

```
ProApp (Supabase projekt)
│
├── public (schema)
│   ├── organizations
│   ├── user_profiles
│   ├── subscriptions
│   ├── payments
│   ├── notifications
│   └── audit_logs
│
├── coachpro (schema)
│   ├── coachpro_coaches
│   ├── coachpro_client_profiles
│   ├── coachpro_materials
│   ├── coachpro_programs
│   ├── coachpro_sessions
│   ├── coachpro_shared_materials
│   ├── coachpro_shared_programs
│   ├── coachpro_purchases
│   ├── coachpro_card_decks
│   ├── coachpro_cards
│   ├── coachpro_shared_card_decks
│   ├── coachpro_program_sessions
│   └── coachpro_daily_programs
│
├── contentpro (schema)
│   └── (future ContentPro tables)
│
├── paymentspro (schema)
│   └── (future PaymentsPro tables)
│
├── studypro (schema)
│   └── (future StudyPro tables)
│
├── lifepro (schema)
│   └── (future LifePro tables)
│
└── digipro (schema)
    └── (future DigiPro tables)
```

---

## 🔄 Rollback (pokud něco nefunguje)

```sql
-- 1. Přesuň tabulky zpět do public
ALTER TABLE coachpro.coachpro_coaches SET SCHEMA public;
ALTER TABLE coachpro.coachpro_client_profiles SET SCHEMA public;
ALTER TABLE coachpro.coachpro_materials SET SCHEMA public;
ALTER TABLE coachpro.coachpro_programs SET SCHEMA public;
ALTER TABLE coachpro.coachpro_sessions SET SCHEMA public;
ALTER TABLE coachpro.coachpro_shared_materials SET SCHEMA public;
ALTER TABLE coachpro.coachpro_shared_programs SET SCHEMA public;
ALTER TABLE coachpro.coachpro_purchases SET SCHEMA public;
ALTER TABLE coachpro.coachpro_card_decks SET SCHEMA public;
ALTER TABLE coachpro.coachpro_cards SET SCHEMA public;
ALTER TABLE coachpro.coachpro_shared_card_decks SET SCHEMA public;
ALTER TABLE coachpro.coachpro_program_sessions SET SCHEMA public;
ALTER TABLE coachpro.coachpro_daily_programs SET SCHEMA public;

-- 2. Přesuň trigger function zpět
ALTER FUNCTION coachpro.auto_share_after_purchase() SET SCHEMA public;

-- 3. Smaž prázdné schemas
DROP SCHEMA IF EXISTS coachpro CASCADE;
DROP SCHEMA IF EXISTS lifepro CASCADE;
DROP SCHEMA IF EXISTS digipro CASCADE;

-- 4. Smaž shared tables (pokud nejsou potřeba)
DROP TABLE IF EXISTS public.organizations CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
```

---

## ✅ Success Criteria

- [x] Všechny tabulky v `coachpro` schema (28 tabulek) ✅
- [x] Sdílené tabulky v `public` schema (6 tabulek) ✅
- [x] CoachPro app funguje BEZ změny kódu (s schema alias) ✅
- [x] Ready pro všechny moduly (contentpro, paymentspro, studypro, lifepro, digipro) ✅
- [x] Zero console errors ✅
- [x] All features working ✅

**🎉 Migration úspěšně dokončena: 17.01.2025**

---

## 🚀 Next Steps

### Pro LifePro:

1. Vytvoř nový React projekt nebo složku `lifepro/`
2. Vytvoř nový Supabase klient:

```javascript
// src/lifeproClient.js
import { createClient } from '@supabase/supabase-js';

export const lifeproClient = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY,
  {
    db: { schema: 'lifepro' }
  }
);
```

3. Vytvoř tabulky v `lifepro` schema:

```sql
CREATE TABLE lifepro.life_goals (...);
CREATE TABLE lifepro.milestones (...);
CREATE TABLE lifepro.reflections (...);
```

4. Build! 🎉
