# Google OAuth Setup pro CoachPro

**Datum**: 5. ledna 2025
**Účel**: Nastavení Google OAuth pro přihlášení klientek

---

## 1. Vytvoř Google Cloud projekt

1. Jdi na [Google Cloud Console](https://console.cloud.google.com/)
2. Vytvoř nový projekt nebo vyber existující
3. Pojmenuj projekt např. "CoachPro"

---

## 2. Aktivuj Google+ API

1. V Google Cloud Console → **APIs & Services** → **Library**
2. Vyhledej "**Google+ API**"
3. Klikni **Enable**

---

## 3. Vytvoř OAuth 2.0 Credentials

1. V Google Cloud Console → **APIs & Services** → **Credentials**
2. Klikni **Create Credentials** → **OAuth client ID**
3. Pokud to vyžaduje, nakonfiguruj **OAuth consent screen**:
   - User type: **External**
   - App name: **CoachPro**
   - User support email: tvůj email
   - Developer contact: tvůj email
   - Scopes: Žádné extra scopes (jen basic profile)
   - Test users: Přidej svůj email pro testování

4. Po nastavení consent screen, vytvoř credentials:
   - Application type: **Web application**
   - Name: **CoachPro Client**
   - Authorized JavaScript origins:
     - `http://localhost:3000` (development)
     - `https://coachpro-weld.vercel.app` (production)
   - Authorized redirect URIs:
     - `https://[YOUR-SUPABASE-PROJECT-ID].supabase.co/auth/v1/callback`
     - Najdeš v Supabase Dashboard → Authentication → Providers → Google

5. Klikni **Create**
6. **Zkopíruj Client ID a Client Secret** - budeš je potřebovat v dalším kroku

---

## 4. Nakonfiguruj v Supabase

1. Jdi do [Supabase Dashboard](https://supabase.com/dashboard)
2. Vyber CoachPro projekt
3. V levé liště → **Authentication** → **Providers**
4. Najdi **Google** a klikni **Enable**
5. Vlož:
   - **Client ID** (z Google Cloud Console)
   - **Client Secret** (z Google Cloud Console)
6. Zkopíruj **Callback URL** (začíná `https://[project-id].supabase.co/auth/v1/callback`)
7. Klikni **Save**

---

## 5. Přidej Callback URL do Google

1. Zpět v Google Cloud Console → **Credentials**
2. Klikni na tvůj OAuth client
3. Přidej do **Authorized redirect URIs**:
   - `https://[YOUR-SUPABASE-PROJECT-ID].supabase.co/auth/v1/callback`
4. Klikni **Save**

---

## 6. Spusť SQL migrace

V Supabase SQL Editor spusť v tomto pořadí:

```sql
-- 1. Program availability & external link
\i supabase/migrations/20250105_add_availability_and_link_to_programs.sql

-- 2. Client profiles
\i supabase/migrations/20250105_02_create_client_profiles.sql

-- 3. Add auth to clients
\i supabase/migrations/20250105_03_add_auth_to_clients.sql
```

Nebo zkopíruj SQL z každého souboru a spusť manuálně.

---

## 7. Testování

1. Restartuj dev server: `npm run dev`
2. Jdi na `http://localhost:3000/client/signup`
3. Klikni **Přihlásit přes Google**
4. Mělo by tě to přesměrovat na Google přihlášení
5. Po přihlášení zpět na CoachPro → profil klientky

---

## Troubleshooting

### Error: redirect_uri_mismatch
- **Příčina**: Callback URL v Google Cloud nesouhlasí se Supabase
- **Řešení**: Zkontroluj, že callback URL jsou identické v obou místech

### Error: unauthorized_client
- **Příčina**: OAuth consent screen není nakonfigurován
- **Řešení**: Dokončit OAuth consent screen setup (krok 3)

### Error: access_denied
- **Příčina**: Uživatel není test user v development mode
- **Řešení**: Přidat email do test users v OAuth consent screen

---

## Production Checklist

Před nasazením do produkce:

- [ ] Změnit OAuth consent screen z "Testing" na "In production"
- [ ] Přidat production URL do authorized origins
- [ ] Otestovat signup flow na production URL
- [ ] Zkontrolovat RLS policies v Supabase

---

**Hotovo!** 🎉 Google OAuth je nyní nakonfigurován pro CoachPro klientky.
