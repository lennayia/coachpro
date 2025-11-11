# Session #13 - Troubleshooting Auth & Plán Nového Systému

**Datum:** 2025-11-11
**Trvání:** ~2 hodiny
**Fokus:** Analýza autentizačního systému, troubleshooting dokumentace

---

## 🎯 Hlavní Cíle Session

1. ✅ Pokračovat z předchozí session (z summary)
2. ✅ Analyzovat současný stav autentizace
3. ✅ Vytvořit troubleshooting dokumentaci
4. ⏳ Připravit plán pro VARIANTA A (auto-vytváření auth účtů)

---

## 📋 Co Bylo Uděláno

### 1. Analýza Současného Systému Autentizace

**Zjištění:**
- Existují 3 typy přihlášení:
  1. **Google OAuth** → má auth_user_id ✅
  2. **Email + Heslo (Admin)** → má auth_user_id ✅
  3. **Access kód (Tester)** → NEMÁ auth_user_id ❌

**Tabulky a jejich stav:**

#### `coachpro_coaches`
- 4 uživatelé mají `auth_user_id`:
  - 2 admini (email+heslo)
  - 2 OAuth uživatelé (Google)
- Ostatní mají `auth_user_id = NULL`

#### `testers`
- 2 uživatelé mají `auth_user_id` (Google OAuth)
- Ostatní mají `auth_user_id = NULL`

#### `auth.users` (Supabase Auth)
- Pouze OAuth uživatelé a admini
- Testeré s access kódem NEMAJÍ auth účet

### 2. Identifikace Root Cause

**Problém:** Testeré, kteří se zaregistrovali jen formulářem (jméno, příjmení, email) a dostali access kód, NEMAJÍ auth účet v `auth.users`.

**Důsledky:**
- `auth.uid()` = NULL
- RLS politiky je blokují
- Nevidí své materiály
- Nemohou přidat materiály (403 Forbidden)

### 3. Registrační Flow Testera (Současný Systém)

**Stránky:**
1. `/tester` - Přihlášení pomocí access kódu
2. Tlačítko "Zaregistruj se" → registrační formulář
3. **Formulář:**
   - Křestní jméno *
   - Příjmení *
   - Email *
   - Telefon (volitelné)
   - Proč chceš testovat CoachPro? (volitelné)
   - Checkbox: Souhlas se zpracováním údajů *
   - Checkbox: Souhlas se zasíláním novinek (volitelné)
4. Po registraci → zobrazí se access kód na obrazovce
5. Tester si uloží kód a příště se přihlásí na `/tester` tímto kódem

**Problém:** Tento flow NEVYTVÁŘÍ auth účet v Supabase Auth!

### 4. Troubleshooting Dokumentace

**Vytvořeno:** `docs/TROUBLESHOOTING_AUTH.md`

**Obsah:**
- 🔍 Diagnostika krok za krokem (5 kroků)
- 🛠️ Opravy 4 běžných problémů
- 📊 Komplexní diagnostický SQL query
- 🎯 Prevence - checklist
- 🚀 Plán nového systému (VARIANTA A)

**Diagnostické kroky:**
1. Zjisti, kdo je přihlášený (sessionStorage)
2. Zkontroluj `coachpro_coaches` tabulku
3. Zkontroluj `testers` tabulku
4. Zkontroluj `auth.users`
5. Zkontroluj RLS politiky

**Řešené problémy:**
- Admin ztratil admin práva
- auth_user_id je NULL po přihlášení
- Uživatel nevidí materiály (403 Forbidden)
- Nemůže přidat materiál (RLS INSERT blokuje)

---

## 🚀 Plán - VARIANTA A (Připraveno k implementaci)

### Cíl
Při registraci testera automaticky vytvořit auth účet, aby RLS fungoval pro všechny.

### Jak to bude fungovat

**1. Tester vyplní registrační formulář**
- Jméno, příjmení, email (povinné)
- Telefon, motivace (volitelné)

**2. Systém automaticky:**
```javascript
// 1. Vytvoří auth účet v Supabase Auth
const { data: authData, error } = await supabase.auth.signUp({
  email: email,
  password: generateRandomPassword(), // Random 20 znaků
  options: {
    emailRedirectTo: null, // Neposílat potvrzovací email
    data: {
      name: `${firstName} ${lastName}`,
      is_tester: true
    }
  }
});

// 2. Vygeneruje access kód
const accessCode = generateAccessCode(); // např. TEST-A3F9

// 3. Uloží do testers s auth_user_id
await supabase.from('testers').insert({
  id: generateUUID(),
  name: `${firstName} ${lastName}`,
  email: email,
  phone: phone,
  access_code: accessCode,
  auth_user_id: authData.user.id, // ✅ Důležité!
  is_active: true,
  created_at: new Date().toISOString()
});

// 4. Vytvoří záznam v coachpro_coaches
await supabase.from('coachpro_coaches').insert({
  id: `tester-${testerId}`,
  name: `${firstName} ${lastName}`,
  email: email,
  auth_user_id: authData.user.id, // ✅ Důležité!
  is_tester: true,
  tester_id: testerId,
  created_at: new Date().toISOString()
});
```

**3. Tester dostane:**
- Access kód zobrazený na obrazovce
- Email s access kódem a instrukcemi

**4. Tester se může příště přihlásit:**
- ✅ Access kódem na `/tester` (jednoduchý způsob)
- ✅ Emailem + heslo (po resetu hesla)
- ✅ Google OAuth (pokud email odpovídá)

### Výhody
- ✅ RLS funguje pro všechny uživatele
- ✅ Data nikdy nezmizí (vždy mají auth_user_id)
- ✅ Jednoduchý access kód funguje dál
- ✅ Možnost přihlásit se emailem (pokud resetuje heslo)
- ✅ Bezpečné a konzistentní

### Soubory k Úpravě

**1. Registrační stránka testera**
- Pravděpodobně `/src/modules/coach/pages/TesterSignup.jsx` nebo podobná
- Potřebujeme najít a upravit

**2. `src/modules/coach/pages/Tester.jsx`**
- Už funguje správně (ukládá auth_user_id při OAuth)

**3. `src/modules/coach/utils/storage.js`**
- `saveCoach()` už funguje správně (neruší is_admin)

---

## 📊 Statistiky Session

### Soubory Vytvořené
1. `docs/TROUBLESHOOTING_AUTH.md` - Troubleshooting dokumentace (350+ řádků)

### Soubory Analyzované
1. `src/modules/coach/pages/AdminLogin.jsx`
2. `src/modules/coach/pages/ProfilePage.jsx`
3. `src/modules/coach/pages/Tester.jsx`
4. `src/modules/coach/utils/storage.js`
5. `src/modules/coach/components/coach/ShareCardDeckModal.jsx`
6. `src/modules/coach/components/coach/ShareMaterialModal.jsx`
7. `src/modules/coach/components/coach/CardDecksLibrary.jsx`
8. `src/modules/coach/components/client/ClientCardDeckEntry.jsx`

### SQL Queries Vytvořené
- 15+ diagnostických dotazů
- 8+ opravných dotazů
- 2 komplexní analytické dotazy

---

## 🎓 Technické Poznatky

### 1. Tři Typy Autentizace v CoachPro

| Typ | auth_user_id | Tabulky | RLS Funguje? |
|-----|--------------|---------|--------------|
| Google OAuth | ✅ Má | auth.users, coachpro_coaches, testers | ✅ Ano |
| Email + Heslo | ✅ Má | auth.users, coachpro_coaches | ✅ Ano |
| Access kód (starý) | ❌ NULL | testers, coachpro_coaches | ❌ Ne |
| Access kód (nový) | ✅ Má | auth.users, testers, coachpro_coaches | ✅ Ano |

### 2. RLS Politiky Vyžadují auth.uid()

**SELECT politika:**
```sql
USING (
  EXISTS (
    SELECT 1 FROM coachpro_coaches
    WHERE coachpro_coaches.id = coachpro_materials.coach_id
    AND coachpro_coaches.auth_user_id = auth.uid()
  )
)
```

**Pokud `auth.uid() = NULL`:**
- EXISTS vrátí false
- RLS blokuje přístup
- 403 Forbidden

### 3. Důležitost Konzistence auth_user_id

**Musí být stejný v:**
- `auth.users.id`
- `coachpro_coaches.auth_user_id`
- `testers.auth_user_id` (pokud je tester)

**Jinak:**
- Data zmizí
- Uživatel ztratí přístup
- RLS nefunguje

---

## 🔄 Todo - Co Zbývá Udělat

### Vysoká Priorita
1. ⏳ **Najít registrační stránku testera** (`TesterSignup.jsx` nebo podobná)
2. ⏳ **Implementovat VARIANTA A** - Auto-vytváření auth účtu při registraci
3. ⏳ **Otestovat nový registrační flow**
4. ⏳ **Vytvořit migraci pro existující testery** (optional - vytvořit auth účty zpětně)

### Střední Priorita
5. ⏳ Přidat email pole do ShareMaterialModal
6. ⏳ Implementovat email validaci pro veřejné sdílení
7. ⏳ Dokončit public sharing systém (coachpro_shared_programs)

### Nízká Priorita
8. ⏳ Automatické emaily s access kódem po registraci
9. ⏳ Password reset flow pro testery

---

## 🐛 Známé Issues

### Issue 1: Testeré bez auth_user_id nevidí materiály
- **Status:** Analyzováno, řešení připraveno
- **Fix:** Implementovat VARIANTA A
- **Affected:** ~90% testerů (kteří se registrovali formulářem)

### Issue 2: ShareMaterialModal nemá email pole
- **Status:** Identifikováno, čeká na implementaci
- **Priority:** Střední
- **File:** `src/modules/coach/components/coach/ShareMaterialModal.jsx`

---

## 📝 Architektonické Poznámky

### Access Kód vs Auth Účet

**Před (současný systém):**
```
Registrace → Vygeneruj access kód → Ulož do testers
Přihlášení → Ověř access kód → Vytvoř session (bez auth účtu)
```

**Po (VARIANTA A):**
```
Registrace → Vytvoř auth účet → Vygeneruj access kód → Ulož auth_user_id
Přihlášení → Ověř access kód → Načti auth_user_id → Vytvoř Supabase session
```

**Klíčový rozdíl:** Nový systém vytváří auth účet IHNED při registraci, nejen při OAuth přihlášení.

---

## 🎯 Session Highlights

### Co Fungovalo Dobře
- ✅ Systematická diagnostika problému
- ✅ Vytvoření kompletní troubleshooting dokumentace
- ✅ Jasný plán řešení (VARIANTA A)
- ✅ Pochopení současného registračního flow

### Co Bylo Náročné
- 🔍 Rozlišení mezi 3 typy autentizace
- 🔍 Pochopení, proč někteří uživatelé mají auth_user_id a jiní ne
- 🔍 Identifikace všech míst, kde se auth_user_id ukládá/neukládá

### Learnings
- 💡 RLS je mocný nástroj, ale vyžaduje konzistentní auth_user_id
- 💡 Access kód může fungovat VEDLE auth účtu, ne MÍSTO něj
- 💡 Troubleshooting dokumentace šetří čas při opakujících se problémech
- 💡 Důležité ptát se uživatele na kontext před kódováním

---

## 🔜 Příští Session - Plán

1. Najít a analyzovat registrační stránku testera
2. Implementovat automatické vytváření auth účtu při registraci
3. Otestovat celý flow (registrace → přihlášení → materiály)
4. Zvážit migraci existujících testerů

---

## 📚 Reference

### Dokumenty Vytvořené/Aktualizované
- `docs/TROUBLESHOOTING_AUTH.md` - Nový troubleshooting guide

### Klíčové SQL Tabulky
- `auth.users` - Supabase Auth účty
- `coachpro_coaches` - Kouči/testeré (main)
- `testers` - Beta testeré (metadata)
- `coachpro_materials` - Materiály s RLS

### Důležité Soubory
- `src/modules/coach/pages/AdminLogin.jsx`
- `src/modules/coach/pages/Tester.jsx`
- `src/modules/coach/utils/storage.js:saveCoach()`

---

**Session zakončena:** 2025-11-11
**Čas strávený:** ~2 hodiny
**Produktivita:** Vysoká - jasný plán a troubleshooting dokumentace
**Příští krok:** Implementace VARIANTA A

---

**Autor:** Claude Code + Lenka
**Verze:** 1.0
