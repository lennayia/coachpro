# 🔄 Reset Coach Assignment - Pro testování

## Problém
Klientka už má `coach_id` přiřazené, takže se zobrazuje browsing mode místo assignment mode.

## Řešení - Reset coach_id na NULL

### Způsob 1: Supabase SQL Editor (DOPORUČUJI)

1. Otevřete https://supabase.com/dashboard
2. Jděte do **SQL Editor** → **New query**
3. Vložte tento SQL:

```sql
-- Najděte svou klientku
SELECT id, name, email, coach_id
FROM coachpro_client_profiles
WHERE email = 'VÁŠE_KLIENT_EMAIL';  -- Změňte na email klientky

-- Reset coach_id na NULL
UPDATE coachpro_client_profiles
SET coach_id = NULL
WHERE email = 'VÁŠE_KLIENT_EMAIL';  -- Změňte na email klientky

-- Ověření
SELECT id, name, email, coach_id
FROM coachpro_client_profiles
WHERE email = 'VÁŠE_KLIENT_EMAIL';  -- Změňte na email klientky
```

4. **Změňte** `'VÁŠE_KLIENT_EMAIL'` na skutečný email (např. `'test@example.com'`)
5. Klikněte **Run**

### Způsob 2: Pomocí Console v aplikaci

1. Otevřete aplikaci jako klientka
2. Otevřete Console (F12)
3. Vložte tento kód:

```javascript
// Reset coach_id
const { data, error } = await supabase
  .from('coachpro_client_profiles')
  .update({ coach_id: null })
  .eq('id', '7eb30a6c-81e9-468e-9e77-84e5a96f0473')  // ID z console logu
  .select();

console.log('Reset result:', data, error);
```

4. Stiskněte Enter
5. **Refresh stránku** (Cmd+R)

---

## Po resetu

1. **Odhlaste se** a **přihlaste znovu** (důležité pro refresh profilu!)
2. Jděte na **"Vyberte si koučku"**
3. Console by měl ukázat:
   ```
   profileCoachId: null
   hasPrimaryCoach: false
   browsingMode: false
   ```
4. Klikněte na koučku → měl by se zobrazit **confirmation dialog**!

---

## Pro budoucí testování

Pokud chcete testovat assignment znovu, vždy resetujte `coach_id` na NULL.

Nebo vytvořte nový test účet (jiný email).
