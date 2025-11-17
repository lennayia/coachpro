# 🎁 Lead Magnet Feature - Migrace databáze

## Přehled

Nová funkce: **Klientky mohou získat materiály/programy zdarma za kontakt nebo později zaplatit**.

---

## 📋 Migrace k aplikaci (v pořadí)

### 1. Purchases table

**Soubor:** `supabase/migrations/20250116_02_create_material_purchases.sql`

**Co dělá:**
- Vytvoří tabulku `coachpro_purchases`
- Sleduje "nákupy" (beta = kontakt, později = platba)
- Auto-sdílí materiál po "koupi" (trigger)

### 2. Pricing fields

**Soubor:** `supabase/migrations/20250116_03_add_pricing_to_materials_programs.sql`

**Co dělá:**
- Přidá sloupce do `coachpro_materials` a `coachpro_programs`:
  - `is_public` - Viditelné v katalogu
  - `price` - NULL = zdarma, >0 = placené
  - `currency` - CZK/EUR/USD
  - `is_lead_magnet` - True = zdarma za kontakt
- Vytvoří funkci `get_coach_public_catalog()`

---

## 🚀 Jak aplikovat

### Supabase Dashboard:

1. Otevřete https://supabase.com/dashboard → Váš projekt
2. **SQL Editor** → **New query**
3. **Zkopírujte celý obsah** z `20250116_02_create_material_purchases.sql`
4. Klikněte **Run**
5. Počkejte na "Success"
6. **Opakujte pro** `20250116_03_add_pricing_to_materials_programs.sql`

---

## ✅ Ověření

Spusťte v SQL Editor:

```sql
-- Check purchases table
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'coachpro_purchases'
ORDER BY ordinal_position;

-- Check materials pricing fields
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'coachpro_materials'
AND column_name IN ('is_public', 'price', 'currency', 'is_lead_magnet');

-- Check trigger exists
SELECT trigger_name
FROM information_schema.triggers
WHERE trigger_name = 'trigger_auto_share_after_purchase';
```

Měli byste vidět:
- ✅ Tabulka `coachpro_purchases` s ~15 sloupci
- ✅ 4 nové sloupce v `coachpro_materials`
- ✅ Trigger `trigger_auto_share_after_purchase`

---

## 🧪 Testování

### 1. Označit materiál jako lead magnet (SQL):

```sql
-- Najděte své materiály
SELECT id, title, is_public, is_lead_magnet, price
FROM coachpro_materials
WHERE coach_id = 'VASE_COACH_ID'
LIMIT 5;

-- Označte jeden jako lead magnet
UPDATE coachpro_materials
SET
  is_public = true,
  is_lead_magnet = true,
  price = NULL
WHERE id = 'MATERIAL_ID';
```

### 2. Test v aplikaci (jako klientka):

1. Jděte na **"Vyberte si koučku"**
2. Klikněte na koučku
3. Tab **"Materiály"**
4. Měli byste vidět materiály s:
   - 🎁 Badge "Zdarma za kontakt"
   - Tlačítko **"Získat zdarma"**
5. Klikněte **"Získat zdarma"**
6. Zadejte kontakt → **"Získat přístup"**
7. Materiál by se měl objevit v **Moje materiály**

### 3. Ověřit v databázi:

```sql
-- Zkontrolovat purchases
SELECT *
FROM coachpro_purchases
ORDER BY purchased_at DESC
LIMIT 5;

-- Zkontrolovat auto-share
SELECT *
FROM coachpro_shared_materials
WHERE client_email = 'EMAIL_KLIENTKY'
ORDER BY shared_at DESC
LIMIT 5;
```

---

## 🎯 Co teď funguje

✅ **Klientka může:**
- Vidět veřejné materiály/programy koučky
- Rozlišit zdarma (🎁) vs placené (💰)
- "Koupit" materiál za kontakt
- Automaticky získat přístup

✅ **Kouč může:**
- Sledovat "nákupy" (kdo si vzal jeho lead magnety)
- Získat kontakty zájemců
- (Později: nastavit ceny pro placený obsah)

❌ **Co zatím chybí:**
- UI pro koučky: "Označit jako lead magnet" při vytváření materiálu
- Dashboard pro kouče: "Kdo si vzal mé lead magnety?"
- Placené materiály (Stripe integrace)

---

## 📊 Příklad dat

**Materiál - Lead Magnet:**
```json
{
  "id": "mat-abc123",
  "title": "7 tipů pro lepší ranní rutinu",
  "description": "Bezplatný PDF s prověřenými tipy",
  "is_public": true,
  "is_lead_magnet": true,
  "price": null,
  "currency": "CZK"
}
```

**Materiál - Placený:**
```json
{
  "id": "mat-xyz789",
  "title": "Kompletní 30denní program",
  "description": "Detailní pracovní sešit",
  "is_public": true,
  "is_lead_magnet": false,
  "price": 599,
  "currency": "CZK"
}
```

**Purchase záznam:**
```json
{
  "id": "uuid",
  "item_type": "material",
  "item_id": "mat-abc123",
  "client_name": "Jana Nováková",
  "client_email": "jana@example.com",
  "client_phone": "+420123456789",
  "coach_id": "lenka-roubalova",
  "payment_method": "contact",
  "payment_status": "completed",
  "amount": 0,
  "access_granted": true,
  "purchased_at": "2025-11-16T23:00:00Z"
}
```

---

*Vytvořeno: 16.11.2025*
*Feature: Lead Magnets - Pay with Contact*
