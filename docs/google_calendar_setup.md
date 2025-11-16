# Google Calendar API Setup - Instrukce

## 1. Supabase Dashboard Konfigurace

### Krok 1: Přidat Calendar API scope
1. Otevři [Supabase Dashboard](https://app.supabase.com/)
2. Vyber projekt **CoachPro**
3. Naviguj na: **Authentication** → **Providers** → **Google**
4. V poli **"Scopes"** přidej:
   ```
   email profile https://www.googleapis.com/auth/calendar.readonly
   ```
5. Klikni **Save**

### Krok 2: Google Cloud Console - Povolit Calendar API
1. Otevři [Google Cloud Console](https://console.cloud.google.com/)
2. Vyber projekt, který používáš pro OAuth (měl by být stejný jako v Supabase)
3. Naviguj na: **APIs & Services** → **Library**
4. Vyhledej **"Google Calendar API"**
5. Klikni na **Google Calendar API**
6. Klikni **Enable** (Povolit)

### Krok 3: Zkontroluj OAuth Consent Screen
1. V Google Cloud Console: **APIs & Services** → **OAuth consent screen**
2. Zkontroluj, že máš přidaný scope:
   - `https://www.googleapis.com/auth/calendar.readonly`
3. Pokud tam není, klikni **Edit App** → **Add or Remove Scopes**
4. Vyhledej a přidej:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `.../auth/calendar.readonly` ✅
5. **Save and Continue**

## 2. Test Funkcionality

### Krok 1: Odhlášení a Opětovné Přihlášení
1. V aplikaci se **odhlaste**
2. Klikněte **Přihlásit se přes Google**
3. Google by měl **požádat o nová oprávnění** (včetně přístupu ke kalendáři)
4. Povolte všechna oprávnění

### Krok 2: Test Synchronizace
1. Navigujte na `/coach/sessions`
2. Klikněte **"Synchronizovat Google Calendar"**
3. Měli byste vidět dialog s výsledky:
   - **Vytvořeno:** X nových sezení
   - **Přeskočeno:** Y událostí (už existují)
   - **Chyby:** 0 (ideálně)

## 3. Troubleshooting

### Chyba: 403 - Insufficient Permissions
**Důvod:** Token nemá scope pro Calendar API

**Řešení:**
1. Zkontroluj, že jsi přidal scope do Supabase
2. Zkontroluj, že jsi povolil Calendar API v Google Cloud Console
3. Odhlásit se a znovu přihlásit (nový token se scopes)

### Chyba: 401 - Invalid Credentials
**Důvod:** Access token vypršel nebo je neplatný

**Řešení:**
1. Odhlásit se a znovu přihlásit
2. Zkontroluj, že `access_type: 'offline'` je v `GoogleSignInButton.jsx`

### Žádné události se nesynchronizují
**Důvod:** Možná nemáš události v kalendáři od **teď do budoucna**

**Řešení:**
1. Vytvoř testovací událost v Google Calendar (budoucí datum)
2. Zkus synchronizaci znovu

### Duplikáty v databázi
**Důvod:** Migrace `add_google_event_id_to_sessions.sql` nebyla spuštěna

**Řešení:**
1. Spusť migraci v Supabase SQL Editor
2. Smaž duplikáty ručně:
   ```sql
   DELETE FROM coachpro_sessions
   WHERE google_event_id IS NULL
   AND created_at > '2025-11-16';
   ```

## 4. Verification Checklist

- [ ] Supabase má scope: `https://www.googleapis.com/auth/calendar.readonly`
- [ ] Google Calendar API je **Enabled** v Google Cloud Console
- [ ] OAuth Consent Screen má calendar.readonly scope
- [ ] Migrace `add_google_event_id_to_sessions.sql` spuštěna
- [ ] Odhlášení + Opětovné přihlášení provedeno
- [ ] Test synchronizace úspěšný (0 chyb)

## 5. Screenshots (Pro Debug)

### Supabase Provider Settings
![Supabase Google Provider](./screenshots/supabase_google_scopes.png)

**Expected:**
```
Scopes: email profile https://www.googleapis.com/auth/calendar.readonly
```

### Google Cloud Console - Calendar API
![Google Calendar API Enabled](./screenshots/google_calendar_api_enabled.png)

**Status:** ✅ **Enabled**

---

**Poslední update:** 16.11.2025
**Status:** ⚠️ Requires manual Supabase + Google Cloud configuration
