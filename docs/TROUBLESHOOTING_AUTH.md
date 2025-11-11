# CoachPro - Troubleshooting Autentizace a Materiály

**Vytvořeno:** 2025-11-11
**Účel:** Diagnostika a řešení problémů s přihlašováním, admin právy a přístupem k materiálům

---

## 🚨 Časté Problémy

### 1. Admin ztratil admin práva (`is_admin = false`)
### 2. Uživatel nevidí své materiály
### 3. Uživatel nemůže přidat materiál (403 Forbidden)
### 4. Auth_user_id je NULL po přihlášení

---

## 🔍 Diagnostika - Krok za Krokem

### KROK 1: Zjisti, kdo je přihlášený

```javascript
// V prohlížeči (Console)
JSON.parse(sessionStorage.getItem('coachpro_currentUser'))
```

**Co hledáš:**
- `id` - ID koučky
- `auth_user_id` - ID v auth.users (pokud NULL = problém!)
- `email` - Email uživatele
- `isAdmin` - Admin práva
- `isTester` - Je tester?

---

### KROK 2: Zkontroluj databázi - Tabulka `coachpro_coaches`

```sql
-- Zobraz kouče podle emailu
SELECT
  id,
  name,
  email,
  auth_user_id,
  is_admin,
  is_tester,
  tester_id,
  created_at,
  updated_at
FROM coachpro_coaches
WHERE email = 'EMAIL_UZIVATELE';
```

**Co kontrolovat:**
- ✅ `auth_user_id` NENÍ NULL (mělo by být UUID)
- ✅ `is_admin` je TRUE pro adminy (lenna@online-byznys.cz, lenkaroubalka@seznam.cz)
- ✅ `is_tester` je TRUE pro testery
- ✅ `tester_id` je vyplněný pro testery

---

### KROK 3: Zkontroluj tabulku `testers` (pokud je uživatel tester)

```sql
-- Zobraz testera podle emailu
SELECT
  id,
  name,
  email,
  auth_user_id,
  access_code,
  is_active,
  created_at
FROM testers
WHERE email = 'EMAIL_UZIVATELE';
```

**Co kontrolovat:**
- ✅ `auth_user_id` NENÍ NULL (mělo by být stejné jako v `coachpro_coaches`)
- ✅ `access_code` je vyplněný
- ✅ `is_active` je TRUE

---

### KROK 4: Zkontroluj auth.users (Supabase Auth)

```sql
-- Zobraz auth účet podle emailu
SELECT
  id,
  email,
  created_at,
  last_sign_in_at,
  email_confirmed_at
FROM auth.users
WHERE email = 'EMAIL_UZIVATELE';
```

**Co kontrolovat:**
- ✅ Účet existuje
- ✅ `id` (UUID) se shoduje s `auth_user_id` v `coachpro_coaches`
- ✅ `last_sign_in_at` je nedávné datum

**Pokud účet NEEXISTUJE:**
- Uživatel se zaregistroval jen přes access kód (formulář)
- NEMÁ auth účet → RLS nebude fungovat
- **Řešení:** Vytvořit auth účet (viz níže)

---

### KROK 5: Zkontroluj RLS politiky

```sql
-- Zobraz RLS politiky pro materiály
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'coachpro_materials';
```

**Očekávané politiky:**

**SELECT (číst):**
```sql
-- Uživatel vidí své materiály
USING (
  EXISTS (
    SELECT 1 FROM coachpro_coaches
    WHERE coachpro_coaches.id = coachpro_materials.coach_id
    AND coachpro_coaches.auth_user_id = auth.uid()
  )
)
```

**INSERT (vytvořit):**
```sql
-- Uživatel může vytvořit materiál pro sebe
WITH CHECK (
  EXISTS (
    SELECT 1 FROM coachpro_coaches
    WHERE coachpro_coaches.id = coachpro_materials.coach_id
    AND coachpro_coaches.auth_user_id = auth.uid()
  )
)
```

---

## 🛠️ Opravy - Běžné Problémy

### Problém 1: Admin ztratil admin práva

**Příčina:** `storage.js:saveCoach()` přepisoval `is_admin` na `false`

**Jak zjistit:**
```sql
SELECT email, is_admin FROM coachpro_coaches WHERE email IN ('lenna@online-byznys.cz', 'lenkaroubalka@seznam.cz');
```

**Oprava v databázi:**
```sql
UPDATE coachpro_coaches
SET is_admin = true
WHERE email IN ('lenna@online-byznys.cz', 'lenkaroubalka@seznam.cz');
```

**Prevence:**
- Zkontroluj `src/modules/coach/utils/storage.js:85-87`
- Musí být: `...(coach.isAdmin !== undefined && { is_admin: coach.isAdmin })`
- NESMÍ být: `is_admin: coach.isAdmin || false` ❌

---

### Problém 2: auth_user_id je NULL po přihlášení

**Příčina:** Login kód neuložil `auth_user_id` do databáze

**Soubory k ověření:**

#### AdminLogin.jsx (lines 97-98)
```javascript
// IMPORTANT: Save to Supabase to update auth_user_id
await saveCoach(adminUser);
```

#### Tester.jsx (lines 105-130)
```javascript
// Check if tester has an auth account by email
let authUserId = existingCoach?.auth_user_id || null;
if (!authUserId && tester.email) {
  const { data: authUser } = await supabase
    .from('auth.users')
    .select('id')
    .eq('email', tester.email)
    .maybeSingle();
  authUserId = authUser?.id || null;
}

const coachUser = {
  id: `tester-${tester.id}`,
  auth_user_id: authUserId,  // <-- MUST be included
  // ...
};
```

**Manuální oprava:**
```sql
-- Najdi auth_user_id podle emailu
SELECT id FROM auth.users WHERE email = 'EMAIL_UZIVATELE';

-- Aktualizuj coachpro_coaches
UPDATE coachpro_coaches
SET auth_user_id = 'UUID_Z_AUTH_USERS'
WHERE email = 'EMAIL_UZIVATELE';

-- Pokud je tester, aktualizuj i testers
UPDATE testers
SET auth_user_id = 'UUID_Z_AUTH_USERS'
WHERE email = 'EMAIL_UZIVATELE';
```

---

### Problém 3: Uživatel nevidí materiály (403 Forbidden)

**Příčina:** RLS politika blokuje přístup kvůli NULL `auth_user_id`

**Diagnostika:**
```sql
-- 1. Zkontroluj auth_user_id
SELECT id, email, auth_user_id FROM coachpro_coaches WHERE email = 'EMAIL';

-- 2. Zkontroluj, jestli má materiály
SELECT id, title, coach_id FROM coachpro_materials WHERE coach_id = 'COACH_ID';

-- 3. Test RLS (jako superuser)
SET ROLE postgres;
SELECT * FROM coachpro_materials WHERE coach_id = 'COACH_ID';
RESET ROLE;
```

**Oprava:**
1. Ujisti se, že `auth_user_id` není NULL (viz Problém 2)
2. Zkontroluj RLS politiky (viz KROK 5)
3. Ověř, že uživatel je přihlášený v Supabase Auth

**Test v browseru:**
```javascript
// Zkontroluj Supabase session
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
// session.user.id musí odpovídat auth_user_id v DB
```

---

### Problém 4: Nemůže přidat materiál (RLS INSERT blokuje)

**Příčina:** `auth_user_id` NULL nebo INSERT politika chybí

**Ověření RLS politiky:**
```sql
SELECT policyname, cmd, with_check
FROM pg_policies
WHERE tablename = 'coachpro_materials' AND cmd = 'INSERT';
```

**Oprava:**
```sql
-- Vytvoř INSERT politiku (pokud chybí)
CREATE POLICY "Coaches can insert own materials"
ON coachpro_materials
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM coachpro_coaches
    WHERE coachpro_coaches.id = coachpro_materials.coach_id
    AND coachpro_coaches.auth_user_id = auth.uid()
  )
);
```

---

## 📊 Komplexní Diagnostický Query

```sql
-- Zobraz úplný přehled uživatele
WITH user_data AS (
  SELECT
    c.id AS coach_id,
    c.name,
    c.email,
    c.auth_user_id,
    c.is_admin,
    c.is_tester,
    c.tester_id,
    t.access_code,
    t.is_active AS tester_active,
    au.id AS auth_id,
    au.last_sign_in_at
  FROM coachpro_coaches c
  LEFT JOIN testers t ON c.tester_id = t.id
  LEFT JOIN auth.users au ON c.email = au.email
  WHERE c.email = 'EMAIL_UZIVATELE'
)
SELECT * FROM user_data;
```

**Co hledáš:**
- ✅ `auth_user_id` = `auth_id` (musí se shodovat)
- ✅ `is_admin` = true (pro adminy)
- ✅ `access_code` je vyplněný (pro testery)
- ✅ `tester_active` = true (pro testery)
- ✅ `last_sign_in_at` je nedávné

---

## 🔐 Typy Přihlášení a auth_user_id

| Typ přihlášení | auth_user_id | Tabulka testers | Poznámka |
|---|---|---|---|
| **Google OAuth** | ✅ Má | ✅ Má (pokud je tester) | Vytvoří se při prvním přihlášení |
| **Email + Heslo** (Admin) | ✅ Má | ❌ Nemá | Jen pro adminy |
| **Access kód** (starý systém) | ❌ NULL | ✅ Má | **PROBLÉM** - RLS nefunguje |
| **Access kód** (nový systém) | ✅ Má | ✅ Má | Auto-vytvoří se při registraci |

---

## 🎯 Prevence - Jak zabránit opakování problémů

### 1. NIKDY nepřepisuj is_admin bez kontroly
```javascript
// ✅ SPRÁVNĚ
...(coach.isAdmin !== undefined && { is_admin: coach.isAdmin }),

// ❌ ŠPATNĚ
is_admin: coach.isAdmin || false,
```

### 2. VŽDY ukládej auth_user_id při přihlášení
```javascript
// AdminLogin.jsx, Tester.jsx, OAuth callback
await saveCoach(adminUser); // Toto MUSÍ být zavoláno
```

### 3. VŽDY testuj RLS politiky po změnách v DB
```sql
-- Test jako authenticated user
SET ROLE authenticated;
SET request.jwt.claims.sub TO 'AUTH_USER_ID';
SELECT * FROM coachpro_materials WHERE coach_id = 'COACH_ID';
RESET ROLE;
```

### 4. Pravidelně kontroluj konzistenci dat
```sql
-- Najdi kouče bez auth_user_id
SELECT id, name, email
FROM coachpro_coaches
WHERE auth_user_id IS NULL;

-- Najdi nesrovnalosti mezi testers a coaches
SELECT
  t.email,
  t.auth_user_id AS tester_auth_id,
  c.auth_user_id AS coach_auth_id
FROM testers t
JOIN coachpro_coaches c ON c.tester_id = t.id
WHERE t.auth_user_id != c.auth_user_id OR t.auth_user_id IS NULL;
```

---

## 📝 Checklist po každé změně přihlášení

- [ ] Zkontrolovat `storage.js:saveCoach()` - nemění `is_admin` nečekaně?
- [ ] Ověřit AdminLogin.jsx - volá `await saveCoach()`?
- [ ] Ověřit Tester.jsx - ukládá `auth_user_id`?
- [ ] Test: Admin se přihlásí a zůstane admin
- [ ] Test: Admin vidí všechny materiály
- [ ] Test: Tester s OAuth vidí své materiály
- [ ] Test: Tester s access kódem vidí své materiály
- [ ] Zkontrolovat Supabase Security Advisor
- [ ] Zkontrolovat RLS politiky pro všechny tabulky

---

## 🚀 Nový Systém (VARIANTA A) - Plán

**Cíl:** Všichni uživatelé mají auth_user_id, RLS funguje pro všechny

### Změny v registraci testera:

1. **Tester vyplní formulář** (jméno, příjmení, email)
2. **Systém automaticky:**
   - Vytvoří auth účet v `auth.users` (email + random heslo)
   - Vygeneruje access kód
   - Uloží do `testers` s `auth_user_id`
   - Vytvoří záznam v `coachpro_coaches` s `auth_user_id`
3. **Tester dostane:**
   - Access kód (zobrazí se na obrazovce)
   - Email s access kódem
4. **Tester se může přihlásit:**
   - Access kódem (jednoduchý způsob) ✅
   - Emailem + heslo (po resetu hesla) ✅
   - Google OAuth (pokud email odpovídá) ✅

### Výhody:
- ✅ RLS funguje pro všechny
- ✅ Data nikdy nezmizí
- ✅ Jednoduchý access kód funguje dál
- ✅ Možnost přihlásit se emailem (pokud chce)
- ✅ Bezpečné

---

**Autor:** Claude Code
**Poslední update:** 2025-11-11
