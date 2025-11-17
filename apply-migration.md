# 🔧 Jak aplikovat migraci - přidat coach_id do client_profiles

## Problém
Klientky se nemohou spojit s koučkami, protože v databázi chybí sloupec `coach_id` v tabulce `coachpro_client_profiles`.

## Řešení
Spusťte SQL migraci v Supabase dashboard.

---

## 📋 Postup (Supabase Dashboard)

### 1. Otevřete Supabase SQL Editor

1. Jděte na https://supabase.com/dashboard
2. Vyberte projekt **CoachPro**
3. V levém menu klikněte na **SQL Editor**
4. Klikněte **New query**

### 2. Vložte SQL kód

Zkopírujte a vložte celý obsah souboru:
```
supabase/migrations/20250116_01_add_coach_id_to_client_profiles.sql
```

### 3. Spusťte migraci

1. Klikněte **Run** (nebo Ctrl+Enter / Cmd+Enter)
2. Počkejte na potvrzení "Success"

### 4. Ověřte změny

Spusťte kontrolní query:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'coachpro_client_profiles'
ORDER BY ordinal_position;
```

Měli byste vidět nový sloupec `coach_id` typu `text`.

---

## ✅ Co migrace dělá

1. **Přidá sloupec `coach_id`** do tabulky `coachpro_client_profiles`
   - Typ: `TEXT` (reference na `coachpro_coaches.id`)
   - Nullable: Ano (klientky mohou být bez koučky)
   - ON DELETE: SET NULL (pokud se kouč smaže, klientka zůstane)

2. **Vytvoří index** pro rychlé vyhledávání klientek podle koučky
   ```sql
   idx_client_profiles_coach_id
   ```

3. **Aktualizuje RLS polícy** - Koučky mohou číst profily svých klientek:
   - Klientky přiřazené jako primary coach (coach_id)
   - Klientky se sdílenými materiály
   - Klientky se zarezervovanými sezeními

---

## 🧪 Po migraci - testování

1. **Odhlaste se** z aplikace
2. **Přihlaste se** znovu (refresh auth session)
3. **Jako klientka:**
   - Jděte na `/client/welcome`
   - Klikněte "Vybrat koučku"
   - Vyberte koučku a potvrďte
4. **Zkontrolujte dashboard:**
   - Měla by se zobrazit karta koučky
   - Statistiky, materiály, sezení

---

## 🐛 Řešení problémů

### Chyba: "column already exists"
Sloupec už existuje → migrace už byla aplikována → ignorujte

### Chyba: "permission denied"
Přihlaste se jako **Owner** projektu v Supabase dashboard

### Koučka se stále nepřiřadí
1. Otevřete browser console (F12)
2. Zkuste přiřadit koučku
3. Zkopírujte error message a pošlete mi

---

## 📊 Kontrolní query (volitelně)

Zkontrolovat, jestli máte klientky s koučkami:
```sql
SELECT
  cp.name AS client_name,
  cp.email AS client_email,
  c.name AS coach_name,
  c.email AS coach_email
FROM coachpro_client_profiles cp
LEFT JOIN coachpro_coaches c ON cp.coach_id = c.id
ORDER BY cp.created_at DESC
LIMIT 10;
```

---

*Vytvořeno: 16.11.2025*
*Migrace: `20250116_01_add_coach_id_to_client_profiles.sql`*
