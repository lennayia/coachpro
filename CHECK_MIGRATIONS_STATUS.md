# 🔍 Kontrola stavu migrací - Session #19-20

## 📋 Migrace k aplikaci

Máte **3 migrace** připravené k aplikaci. Zkontrolujeme, které už jsou v databázi.

---

## 1️⃣ Migration: Add coach_id to client_profiles

**Soubor:** `supabase/migrations/20250116_01_add_coach_id_to_client_profiles.sql`

**Co dělá:**
- Přidá sloupec `coach_id` do `coachpro_client_profiles`
- Umožní přiřadit klientce primary koučku

**✅ Kontrola v Supabase SQL Editor:**
```sql
-- Zkontrolovat, jestli sloupec existuje
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'coachpro_client_profiles'
  AND column_name = 'coach_id';
```

**Očekávaný výsledek:**
- **Pokud vrátí řádek:** ✅ Migrace JIŽ APLIKOVÁNA
- **Pokud vrátí prázdno:** ❌ POTŘEBA APLIKOVAT

---

## 2️⃣ Migration: Material/Program Purchases

**Soubor:** `supabase/migrations/20250116_02_create_material_purchases.sql`

**Co dělá:**
- Vytvoří tabulku `coachpro_purchases`
- Vytvoří trigger pro auto-share po purchase

**✅ Kontrola:**
```sql
-- Zkontrolovat, jestli tabulka existuje
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'coachpro_purchases';
```

**Očekávaný výsledek:**
- **Pokud vrátí řádek:** ✅ JIŽ APLIKOVÁNA
- **Pokud vrátí prázdno:** ❌ POTŘEBA APLIKOVAT

---

## 3️⃣ Migration: Pricing fields

**Soubor:** `supabase/migrations/20250116_03_add_pricing_to_materials_programs.sql`

**Co dělá:**
- Přidá `is_public`, `price`, `currency`, `is_lead_magnet` do materials/programs

**✅ Kontrola:**
```sql
-- Zkontrolovat pricing fieldy
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'coachpro_materials'
  AND column_name IN ('is_public', 'price', 'currency', 'is_lead_magnet');
```

**Očekávaný výsledek:**
- **Pokud vrátí 4 řádky:** ✅ JIŽ APLIKOVÁNA
- **Pokud vrátí méně:** ❌ POTŘEBA APLIKOVAT

---

## 🚀 Postup aplikace

### Krok 1: Zkontrolujte status

1. Otevřete **Supabase SQL Editor**
2. Spusťte všechny 3 kontrolní queries výše
3. Zapište si výsledky:

```
Migration #1 (coach_id):     ☐ Hotovo  ☐ Potřeba aplikovat
Migration #2 (purchases):    ☐ Hotovo  ☐ Potřeba aplikovat
Migration #3 (pricing):      ☐ Hotovo  ☐ Potřeba aplikovat
```

### Krok 2: Aplikujte chybějící migrace

**Pouze pro migrace označené jako "Potřeba aplikovat":**

1. Otevřete příslušný `.sql` soubor
2. Zkopírujte **CELÝ obsah**
3. Vložte do SQL Editor
4. Klikněte **Run**
5. Počkejte na "Success"

### Krok 3: Re-check

Spusťte kontrolní queries znovu - všechny 3 by měly vrátit "Hotovo" ✅

---

## 🎯 Zkratka - Aplikovat všechny najednou (pokud žádná není hotová)

Pokud všechny 3 kontroly vrátí "Potřeba aplikovat", můžete je aplikovat najednou:

```sql
-- Zkopírujte VŠECHEN obsah z těchto souborů v pořadí:
-- 1. 20250116_01_add_coach_id_to_client_profiles.sql
-- 2. 20250116_02_create_material_purchases.sql
-- 3. 20250116_03_add_pricing_to_materials_programs.sql

-- A spusťte je DOHROMADY v jednom SQL query
```

**⚠️ POZOR:** Pokud některá migrace UŽ je aplikována, nespouštějte ji znovu!
SQL obsahuje `IF NOT EXISTS`, takže by nemělo dojít k chybě, ale raději zkontrolujte status nejdřív.

---

## 📊 Po aplikaci - Test

Po úspěšné aplikaci všech 3 migrací:

### Test 1: Client-Coach Assignment
```sql
-- Otestovat přiřazení koučky klientce
UPDATE coachpro_client_profiles
SET coach_id = 'YOUR_COACH_ID'
WHERE email = 'TEST_CLIENT_EMAIL';

-- Zkontrolovat
SELECT name, email, coach_id
FROM coachpro_client_profiles
WHERE email = 'TEST_CLIENT_EMAIL';
```

### Test 2: Lead Magnet Material
```sql
-- Označit materiál jako lead magnet
UPDATE coachpro_materials
SET
  is_public = true,
  is_lead_magnet = true,
  price = NULL
WHERE id = 'SOME_MATERIAL_ID'
LIMIT 1;

-- Zkontrolovat
SELECT title, is_public, is_lead_magnet, price
FROM coachpro_materials
WHERE is_public = true;
```

### Test 3: Purchase Flow
V aplikaci jako klientka:
1. Jděte na detail koučky
2. Měli byste vidět veřejné materiály
3. Klikněte "Získat zdarma"
4. Zkontrolujte `coachpro_purchases` tabulku

---

*Vytvořeno: 16.11.2025*
*Sessions: #19-20*
