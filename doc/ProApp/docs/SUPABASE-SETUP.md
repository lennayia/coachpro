# 🚀 Supabase Setup Guide - DigiPro Ecosystem

## ⏱ Celkový čas: 15-20 minut

---

## 📋 KROK 1: Vytvoření Supabase projektu (5 min)

### 1.1 Registrace a vytvoření projektu

1. Jdi na: **https://supabase.com**
2. Klikni na **"Start your project"**
3. Přihlaš se:
   - GitHub (doporučeno - rychlejší)
   - Nebo email
4. Klikni **"New project"**
5. Vyplň údaje:
   ```
   Name: digipro-ecosystem
   Database Password: [Vygeneruj silné heslo!]
   Region: Central EU (Frankfurt)
   ```
6. **DŮLEŽITÉ**: Ulož si heslo databáze! (Budeš ho potřebovat)
7. Klikni **"Create new project"**
8. ⏳ Počkej 2-3 minuty na inicializaci projektu

---

## 🔑 KROK 2: Získání API klíčů (2 min)

### 2.1 Najdi API sekci

1. V Supabase dashboardu klikni na **⚙️ Settings** (ozubené kolečko dole vlevo)
2. Klikni na **API** v levém menu

### 2.2 Zkopíruj klíče

Najdeš tam:

#### **Project URL**
```
https://abcdefghijklmnop.supabase.co
```
✅ Zkopíruj toto

#### **anon public** (API Key section)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
```
✅ Zkopíruj toto (bude velmi dlouhé)

#### **service_role** (API Key section, secret!)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
```
✅ Zkopíruj toto (také velmi dlouhé)
⚠️ **POZOR**: Tento klíč NIKDY nesdílej! Je jako admin heslo.

---

## 📝 KROK 3: Vytvoření .env souborů (5 min)

### 3.1 Vytvoř hlavní .env

V rootu projektu vytvoř soubor `.env`:

```bash
cd /Users/lenkaroubalova/Documents/Projekty/lifepro-original
cp .env.example .env
```

### 3.2 Otevři .env a vyplň

```bash
code .env
# nebo
nano .env
```

Vyplň tyto hodnoty:

```env
# Supabase (zkopíruj z Supabase dashboardu)
SUPABASE_URL=https://tvuj-projekt.supabase.co
SUPABASE_ANON_KEY=eyJhbG...tvuj-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...tvuj-service-role-key

# JWT Secret (vygeneruj náhodný string)
JWT_SECRET=zde-vloz-nahodny-string-min-32-znaku

# Server
PORT=3001
NODE_ENV=development

# Email (Seznam.cz)
SMTP_HOST=smtp.seznam.cz
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=lenkaroubalova@seznam.cz
SMTP_PASS=tvoje-email-heslo

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000,https://prosystem.space,https://proapp.cz

# Domains
FRONTEND_URL=https://prosystem.space
BACKEND_URL=https://api.prosystem.space

# Admin
ADMIN_EMAIL=lenkaroubalova@seznam.cz
```

### 3.3 Vygeneruj JWT Secret

**Option A: Použij OpenSSL (Mac/Linux)**
```bash
openssl rand -base64 32
```

**Option B: Použij Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option C: Použij online generátor**
Jdi na: https://generate-secret.vercel.app/32

Zkopíruj výsledek do `JWT_SECRET=...`

### 3.4 Frontend .env.local

Pro LifePro frontend:

```bash
cd lifepro-app
cp .env.example .env.local
code .env.local
```

Vyplň:

```env
# Supabase (JEN public klíče!)
VITE_SUPABASE_URL=https://tvuj-projekt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...tvuj-anon-key

# Backend API
VITE_API_URL=http://localhost:3001

# App config
VITE_APP_NAME=LifePro
VITE_DOMAIN=prosystem.space
```

⚠️ **POZOR**: Na frontendu NIKDY nepoužívej `service_role` klíč!

---

## 🗄️ KROK 4: Spuštění databázového schématu (5 min)

### 4.1 Otevři SQL Editor v Supabase

1. V Supabase dashboardu klikni na **🔧 SQL Editor** (levý panel)
2. Klikni **+ New query**

### 4.2 Spusť schema script

1. Otevři soubor `supabase-complete-schema.sql` z projektu
2. **Zkopíruj CELÝ obsah** souboru (Cmd+A, Cmd+C)
3. **Vlož** do SQL Editoru (Cmd+V)
4. Klikni **RUN** (nebo Cmd+Enter)
5. ⏳ Počkej 10-20 sekund
6. ✅ Měl bys vidět: **"Success. No rows returned"**

### 4.3 Ověř že tabulky existují

1. V levém menu klikni na **🗂️ Table Editor**
2. Měl bys vidět tabulky:
   - ✅ users
   - ✅ payments
   - ✅ categories
   - ✅ lifepro_categories
   - ✅ lifepro_questions
   - ✅ ... a další

---

## ✅ KROK 5: Ověření (2 min)

### 5.1 Test připojení

V terminálu v rootu projektu:

```bash
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
supabase.from('users').select('count').then(console.log);
"
```

Pokud vidíš výsledek (třeba `{ count: 0 }`) = **funguje!** ✅

### 5.2 Checklist

- [ ] Supabase projekt vytvořen
- [ ] API klíče zkopírovány
- [ ] `.env` soubor vytvořen a vyplněn
- [ ] `.env.local` vytvořen (pro frontend)
- [ ] SQL schéma spuštěno v Supabase
- [ ] Tabulky viditelné v Table Editoru
- [ ] `.env` přidán do `.gitignore`

---

## 🔒 BEZPEČNOST - DŮLEŽITÉ!

### ✅ CO DĚLAT:
- ✅ `.env` soubory jsou v `.gitignore`
- ✅ Service role klíč jen na serveru (backend)
- ✅ Anon klíč je OK pro frontend (je veřejný)
- ✅ Zálohuj si všechny klíče někam bezpečně (1Password, atd.)

### ❌ CO NEDĚLAT:
- ❌ NIKDY necommituj `.env` do Gitu
- ❌ NIKDY nesdílej `service_role` klíč
- ❌ NIKDY nepoužívej `service_role` na frontendu
- ❌ NIKDY neposílej klíče přes email/chat

---

## 🆘 Troubleshooting

### Problém: "Missing Supabase environment variables"

**Řešení:**
1. Zkontroluj že `.env` soubor existuje
2. Zkontroluj že jsou správně vyplněné hodnoty
3. Zkontroluj že v hodnotách nejsou mezery navíc
4. Restartuj server (`npm run dev`)

### Problém: "Connection refused" nebo "Invalid API key"

**Řešení:**
1. Zkontroluj že URL je správně (musí končit `.supabase.co`)
2. Zkontroluj že klíče jsou zkopírované celé (jsou VELMI dlouhé)
3. Zkontroluj že Supabase projekt běží (jdi na dashboard)

### Problém: "Relation does not exist" (tabulka neexistuje)

**Řešení:**
1. Jdi do Supabase → SQL Editor
2. Spusť `supabase-complete-schema.sql` znovu
3. Zkontroluj chyby v konzoli

### Problém: RLS Policy errors

**Řešení:**
- Pro testování můžeš dočasně vypnout RLS:
```sql
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
```
- Ale v produkci VŽDY zapni:
```sql
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
```

---

## 🎉 Hotovo!

Máš připravený Supabase! Nyní můžeš:

1. ✅ Spustit backend server
2. ✅ Připojit frontend
3. ✅ Začít migrovat PaymentsPro data
4. ✅ Implementovat LifePro modul

---

## 📞 Další kroky

Viz: `MIGRATION-GUIDE.md` pro instrukce k migraci dat z SQLite.
