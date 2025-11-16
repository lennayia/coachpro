# Google OAuth Verification - Texty pro Consent Screen

## 📋 OAuth Consent Screen - Požadované informace

### 1. App Name (Název aplikace)
```
CoachPro
```

### 2. User Support Email (Podpora pro uživatele)
```
[tvůj email - např. lenka@coachpro.cz nebo tvůj osobní Gmail]
```

### 3. App Logo (Logo aplikace)
- **Formát:** PNG, JPG
- **Velikost:** 120x120 px (doporučeno: 512x512 px)
- **Pozadí:** Průhledné nebo bílé
- **Soubor:** Použij logo CoachPro (ikona "C" v zeleném kruhu)

---

## 📝 Application Home Page (Domovská stránka)

```
https://coachpro.vercel.app
```

Nebo pokud máš vlastní doménu:
```
https://www.coachpro.cz
```

---

## 🔒 Privacy Policy URL (Zásady ochrany osobních údajů)

**DŮLEŽITÉ:** Google vyžaduje veřejně dostupnou Privacy Policy.

### Možnosti:

#### Varianta A: Vytvořit jednoduchý `/privacy` page
```
https://coachpro.vercel.app/privacy
```

**Obsah Privacy Policy (níže připravím)**

#### Varianta B: Použít Termly/TermsFeed generátor
- https://www.termsfeed.com/privacy-policy-generator/
- Vyplníš info o aplikaci, vygeneruje se automaticky

---

## 📄 Terms of Service URL (Podmínky použití) - Optional

```
https://coachpro.vercel.app/terms
```

**Obsah Terms of Service (níže připravím)**

---

## 📱 Application Description (Popis aplikace)

### English (povinný pro Google)

**App Homepage Description (krátký - cca 100-150 znaků):**
```
CoachPro is a coaching management platform that helps coaches organize programs, materials, and sessions with their clients.
```

**Detailed Description (pro verification form - 200-500 znaků):**
```
CoachPro is a comprehensive coaching management application designed for professional coaches and their clients. The platform enables coaches to:

• Create and manage coaching programs
• Share materials, worksheets, and resources
• Schedule and track coaching sessions
• Monitor client progress and engagement
• Sync Google Calendar events to automatically create coaching sessions

Clients can access their personalized dashboard to view programs, download materials, track their progress, and manage upcoming sessions with their coaches.

The application uses Google Calendar API to help coaches efficiently manage their session schedules by syncing calendar events directly into the platform.
```

### Czech (pro marketing/LP)

**Krátký popis (elevator pitch):**
```
CoachPro je aplikace pro kouče a jejich klientky, která zjednodušuje správu programů, materiálů a sezení na jednom místě.
```

**Detailní popis (pro landing page):**
```
CoachPro je kompletní platforma pro správu koučování navržená pro profesionální kouče a jejich klienty.

Pro kouče:
• Vytvářejte a spravujte koučovací programy
• Sdílejte materiály, pracovní listy a zdroje
• Plánujte a sledujte koučovací sezení
• Monitorujte pokrok a zapojení klientů
• Synchronizujte Google Calendar události pro automatické vytváření sezení

Pro klienty:
• Přístup k personalizovanému dashboardu
• Sledování vlastních programů a pokroku
• Stahování materiálů a pracovních listů
• Přehled nadcházejících sezení s koučkami
• Gamifikace s motivačním systémem "Semínka růstu"

Aplikace využívá Google Calendar API pro snadnou synchronizaci událostí z vašeho kalendáře přímo do platformy, čímž šetří čas a eliminuje duplikaci dat.
```

---

## 🔐 Scopes Justification (Odůvodnění oprávnění)

Google vyžaduje, abys vysvětlila, **proč** potřebuješ každý scope.

### 1. Email & Profile (základní)
**Scope:**
```
email
profile
openid
```

**Justification (English):**
```
We use Google Sign-In to authenticate users (coaches and clients). Email is used to identify users and send notifications. Profile information (name, photo) is displayed in the user dashboard.
```

**Odůvodnění (Czech):**
```
Používáme Google přihlášení pro autentizaci uživatelů (kouči a klienti). Email slouží k identifikaci uživatelů a zasílání notifikací. Profilové informace (jméno, fotka) se zobrazují v uživatelském dashboardu.
```

### 2. Google Calendar (readonly)
**Scope:**
```
https://www.googleapis.com/auth/calendar.readonly
```

**Justification (English):**
```
We request read-only access to Google Calendar to allow coaches to sync their existing calendar events into CoachPro as coaching sessions. This eliminates manual data entry and ensures coaches' schedules are always up-to-date in the platform. We only READ events - we never modify or delete calendar entries. The sync is triggered manually by the coach via a "Sync Calendar" button.
```

**Odůvodnění (Czech):**
```
Vyžadujeme readonly přístup ke Google Calendar, aby koučové mohli synchronizovat své existující kalendářové události do CoachPro jako koučovací sezení. Tím se eliminuje manuální zadávání dat a zajišťuje aktuálnost rozvrhu. Pouze ČTEME události - nikdy je neměníme ani nemažeme. Synchronizace se spouští manuálně koučem pomocí tlačítka "Synchronizovat kalendář".
```

---

## 🎥 Demo Video (Pro verifikaci)

Google může požadovat **demo video** (YouTube, max 5 min), které ukazuje:

1. **Google Sign-In flow** (přihlášení přes Google)
2. **Consent screen** (obrazovka s oprávněními)
3. **Calendar sync** (jak funguje synchronizace kalendáře)
4. **Data usage** (jak se data zobrazují v aplikaci)

**Scénář videa:**
```
0:00 - Úvodní obrazovka CoachPro
0:10 - Kliknutí "Přihlásit se přes Google"
0:15 - Google consent screen (zobrazení požadovaných oprávnění)
0:25 - Po přihlášení: Dashboard kouče
0:35 - Navigace na "Správa sezení" (/coach/sessions)
0:45 - Kliknutí "Synchronizovat Google Calendar"
1:00 - Zobrazení výsledků synchronizace (vytvořeno X sezení)
1:15 - Návrat na dashboard - zobrazení synchronizovaných sezení
1:30 - Ukázka, že kalendář v Googlu zůstal nezměněn (readonly)
```

**Nemusíš natáčet sebe** - stačí screen recording s komentářem nebo titulky.

---

## 📸 Screenshots (Pro verifikaci)

Google požaduje **3-5 screenshotů** aplikace:

1. **Login screen** - Přihlašovací stránka s Google tlačítkem
2. **Consent screen** - Google obrazovka s oprávněními
3. **Coach dashboard** - Dashboard kouče s přehledem
4. **Sessions sync** - Stránka synchronizace kalendáře
5. **Client dashboard** - Dashboard klienta (ukázka použití dat)

**Formát:**
- PNG nebo JPG
- Min. 1280x720 px
- Jasné, čitelné UI

---

## 🌐 Privacy Policy - Připravený Text

Vytvořím ti jednoduchý Privacy Policy template:

### Privacy Policy for CoachPro

**Last Updated:** November 16, 2025

#### 1. Introduction
CoachPro ("we", "our", "us") is a coaching management platform that helps coaches and their clients organize programs, materials, and sessions.

#### 2. Information We Collect
When you use Google Sign-In, we collect:
- **Email address** - To identify your account and send notifications
- **Name** - Displayed in your profile and dashboard
- **Profile photo** - Displayed in your profile (from Google account)
- **Google Calendar events** (coaches only) - To sync coaching sessions (read-only access)

#### 3. How We Use Your Information
- **Authentication** - To verify your identity and provide secure access
- **Profile Display** - To personalize your dashboard experience
- **Calendar Sync** - To help coaches import existing calendar events as coaching sessions
- **Notifications** - To send email updates about programs and sessions (optional)

#### 4. Data Storage
Your data is stored securely using Supabase (cloud database provider). We use industry-standard encryption and security practices.

#### 5. Google Calendar API
We use Google Calendar API with **read-only** access. We:
- ✅ READ your calendar events (coaches only)
- ❌ DO NOT modify or delete your calendar events
- ❌ DO NOT share your calendar with others
- ❌ DO NOT access calendars other than yours

Calendar sync is triggered manually by you via the "Sync Calendar" button.

#### 6. Data Sharing
We do NOT sell or share your data with third parties, except:
- **Supabase** (our database provider) - for data storage
- **Google** (for authentication only)

Coaches and clients can see each other's basic info (name, email) only if they are connected in a coaching relationship.

#### 7. Your Rights
You can:
- Access your data anytime via your profile
- Delete your account and all associated data
- Revoke Google Calendar access at https://myaccount.google.com/permissions

#### 8. Contact Us
For privacy questions, contact: **[tvůj email]**

---

## ✅ Checklist pro Google Verification

- [ ] **OAuth Consent Screen** vyplněn:
  - [ ] App name: CoachPro
  - [ ] User support email: [tvůj email]
  - [ ] App logo (120x120 px) nahrán
  - [ ] Application home page URL
  - [ ] Privacy policy URL (vytvořit `/privacy` page)
  - [ ] Terms of service URL (optional)

- [ ] **Scopes Justification** napsán (viz výše)

- [ ] **Demo Video** natočen a nahrán na YouTube (unlisted)

- [ ] **Screenshots** (3-5 screenshotů) připraveny

- [ ] **Google Calendar API** povoleno v APIs & Services → Library

- [ ] **Test users** přidáni (pro testování před schválením)

- [ ] **Submit for Verification** (v Google Auth Platform → Verification Center)

---

## 🚀 Mezitím: Testování s Test Users

**Nemusíš čekat na verifikaci!** Můžeš testovat hned:

1. **Audience** → **Add test users**
2. Přidej své Google emaily (tvůj + případně pár testerů)
3. Test users můžou používat Calendar API i bez verifikace
4. Limit: 100 test users

**Verifikaci** udělej, až budeš ready pro veřejné spuštění.

---

Chceš, abych ti pomohl vytvořit `/privacy` page v aplikaci? Nebo máš otázky k verifikaci? 😊
