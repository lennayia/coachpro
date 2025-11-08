# 🚀 CoachPro - Deployment Guide

Průvodce nasazením aplikace CoachPro na Vercel

---

## ✅ Před nasazením - Checklist

- [x] Supabase databáze vytvořena a nakonfigurována
- [x] Tabulka `testers` existuje s RLS policies
- [x] Kód commitnutý v Git (branch: `feature/sprint13-beta-tester-access`)
- [ ] Vercel účet vytvořen
- [ ] Environment variables připraveny

---

## 📋 Potřebné údaje

Před nasazením si připrav tyto údaje:

### 1. Supabase Credentials
Najdeš v: https://supabase.com/dashboard/project/_/settings/api

```
VITE_SUPABASE_URL=https://твůj-projekt.supabase.co
VITE_SUPABASE_ANON_KEY=tvůj_anon_key (long string starting with 'eyJ...')
```

### 2. YouTube API (volitelné)
Najdeš v: https://console.cloud.google.com/apis/credentials

```
VITE_YOUTUBE_API_KEY=tvůj-youtube-api-key
```

### 3. MailerLite API (volitelné, pro budoucnost)
Najdeš v: https://dashboard.mailerlite.com/integrations/api

```
VITE_MAILERLITE_API_TOKEN=tvůj-mailerlite-token
```

---

## 🚀 Krok 1: Vytvoř Vercel účet

1. Jdi na https://vercel.com/signup
2. Vyber "Continue with GitHub"
3. Povolení přístup k GitHub repozitáři

---

## 🔗 Krok 2: Import projektu

1. V Vercel dashboardu klikni **"Add New..."** → **"Project"**
2. Najdi svůj GitHub repozitář `lennayia/coachpro`
3. Klikni **"Import"**

---

## ⚙️ Krok 3: Konfigurace projektu

### Framework Preset
- **Framework**: Vite
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)

### Environment Variables
Klikni **"Environment Variables"** a přidej:

```bash
# Povinné (Supabase)
VITE_SUPABASE_URL = https://tvůj-projekt.supabase.co
VITE_SUPABASE_ANON_KEY = tvůj_anon_key_zacina_eyJ...

# Volitelné (YouTube)
VITE_YOUTUBE_API_KEY = tvůj-youtube-api-key

# Volitelné (MailerLite - disabled for beta)
VITE_MAILERLITE_API_TOKEN = tvůj-mailerlite-token
```

**⚠️ DŮLEŽITÉ**: Zkopíruj hodnoty z tvého lokálního `.env` souboru!

---

## 🎯 Krok 4: Deploy!

1. Zkontroluj všechny nastavení
2. Klikni **"Deploy"**
3. Počkej ~2-3 minuty na build

**Vercel automaticky:**
- Nainstaluje dependencies (`npm install`)
- Spustí build (`npm run build`)
- Optimalizuje pro production
- Nasadí na globální CDN

---

## ✅ Krok 5: Ověření

Po úspěšném deployi:

1. **Otevři deployment URL** (např. `coachpro-xxx.vercel.app`)
2. **Testuj registration flow**:
   - Jdi na `/tester-signup`
   - Vyplň formulář
   - Získej access code
3. **Testuj login**:
   - Jdi na `/` (login page)
   - Zadej access code
   - Měla by ses dostat na dashboard
4. **Zkontroluj Supabase**:
   - Otevři Supabase Table Editor
   - Tabulka `testers` by měla obsahovat nový záznam

---

## 🌍 Krok 6: Vlastní doména (volitelné)

### Přidat doménu v Vercel

1. V Vercel projektu jdi na **"Settings"** → **"Domains"**
2. Přidej svou doménu (např. `app.coachpro.cz`)
3. Vercel ti ukáže DNS záznamy k nastavení

### Nastavení DNS

U svého domain providera (např. Wedos, Active24) přidej DNS záznamy:

**Pro subdoménu (doporučeno):**
```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

**Pro root doménu:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Počkej 5-60 minut** na propagaci DNS.

---

## 🔄 Automatické nasazení (CI/CD)

Vercel automaticky nasadí:

- ✅ **Production**: Každý push do `main` branch
- 🔶 **Preview**: Každý push do jiných branches (např. `feature/sprint13-beta-tester-access`)

### Jak mergovat do production

```bash
# 1. Přepni na main branch
git checkout main

# 2. Mergni feature branch
git merge feature/sprint13-beta-tester-access

# 3. Pushni na GitHub
git push origin main

# 4. Vercel automaticky nasadí!
```

---

## 🐛 Řešení problémů

### Build Failed - Dependencies Error
**Problém**: `npm install` selhal
**Řešení**: Zkontroluj `package.json` - všechny dependencies musí mít validní verzi

### Build Failed - Environment Variables
**Problém**: `VITE_SUPABASE_URL is not defined`
**Řešení**:
1. Jdi na Vercel → Settings → Environment Variables
2. Přidej chybějící proměnnou
3. Redeploy (Settings → Deployments → tři tečky → Redeploy)

### 404 on Refresh
**Problém**: Při refreshi stránky (např. `/coach/dashboard`) dostaneš 404
**Řešení**: Vercel potřebuje `vercel.json` pro SPA routing (viz níže)

### Supabase Connection Failed
**Problém**: `Failed to connect to Supabase`
**Řešení**: Zkontroluj:
1. VITE_SUPABASE_URL je správná (bez trailing slash)
2. VITE_SUPABASE_ANON_KEY je správný (long string starting with 'eyJ')
3. Supabase RLS policies jsou správně nastaveny

---

## 📁 Vercel Configuration File

Vytvoř `vercel.json` v root složce pro správný SPA routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Co to dělá**: Všechny requesty přesměruje na `index.html`, aby fungoval React Router.

---

## 🔒 Bezpečnost

### Environment Variables
✅ **Správně**: V Vercel dashboard (Settings → Environment Variables)
❌ **ŠPATNĚ**: V kódu nebo commitnuté v Gitu

### Supabase RLS Policies
✅ Zkontroluj, že RLS policies jsou enabled na všech tabulkách
✅ Public access jen na potřebné operace (signup, select by access_code)

### CORS
✅ Vercel automaticky nastaví správné CORS headers
✅ Supabase má CORS enabled pro všechny origins (lze omezit v Supabase settings)

---

## 📊 Monitoring

### Vercel Analytics
1. V Vercel projektu jdi na **"Analytics"**
2. Vidíš:
   - Page views
   - Unique visitors
   - Top pages
   - Performance metrics

### Supabase Logs
1. V Supabase projektu jdi na **"Logs"**
2. Sleduj:
   - Database queries
   - API requests
   - Errors

---

## 💰 Cenový plán

### Vercel Hobby (Free)
- ✅ **Unlimited** personal projects
- ✅ **100 GB** bandwidth/měsíc
- ✅ **Automatic** HTTPS
- ✅ **Global CDN**
- ✅ **Git** integration

**Pro CoachPro Beta**: Hobby plan je naprosto dostačující!

### Supabase Free Tier
- ✅ **500 MB** database space
- ✅ **1 GB** file storage
- ✅ **2 GB** bandwidth/měsíc
- ✅ **50,000** monthly active users

**Pro CoachPro Beta**: Free tier je naprosto dostačující!

---

## 📞 Podpora

### Vercel Docs
https://vercel.com/docs

### Supabase Docs
https://supabase.com/docs

### CoachPro Issues
https://github.com/lennayia/coachpro/issues

---

## ✨ Hotovo!

Po dokončení kroků výše máš:

✅ CoachPro nasazeno na Vercel
✅ Automatické deploymenty z GitHubu
✅ HTTPS certifikát (automaticky)
✅ Globální CDN (rychlé načítání všude)
✅ Beta tester registration funkční
✅ Access code login funkční

**Production URL**: `https://tvůj-projekt.vercel.app`

---

**Vytvořeno**: 3. listopadu 2025
**Verze**: 1.0.0
**Sprint**: 13 - Beta Tester Access System
