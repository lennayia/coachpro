# 🏗️ ProApp Multi-tenant Schema Migration Guide

**Cíl:** Připravit ProApp Supabase projekt pro multiple aplikace (CoachPro, LifePro, DigiPro)

**Metoda:** PostgreSQL schemas pro separaci dat

---

## 📋 Prerequisites

- [ ] Supabase projekt "ProApp" běží
- [ ] CoachPro aplikace funguje
- [ ] Máš backup dat (nebo jsi v dev prostředí)
- [ ] SQL Editor v Supabase je otevřený

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
digipro
lifepro
public
```

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
coachpro     | 13
public       | 0 (nebo jen auth tabulky)
```

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

- [ ] Dev server běží (`npm run dev`)
- [ ] Coach login funguje
- [ ] Client login funguje
- [ ] Material list se načítá
- [ ] Program list se načítá
- [ ] Purchase flow funguje (lead magnets)
- [ ] Session management funguje
- [ ] Card decks fungují
- [ ] No console errors

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

- [x] Všechny tabulky v `coachpro` schema
- [x] Sdílené tabulky v `public` schema
- [x] CoachPro app funguje BEZ změny kódu (s schema alias)
- [x] Ready pro LifePro vývoj (nový schema připraven)
- [x] Zero console errors
- [x] All features working

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
