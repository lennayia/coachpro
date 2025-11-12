# 🚀 DigiPro Ecosystem - START HERE!

## ✅ CO VYTVÁŘÍME TEĎKA

### **CENTRÁLNÍ CORE SYSTÉM** (ne moduly!)

```
DigiPro Ecosystem Core
├── 👤 User Management
│   ├── Registrace/Login
│   ├── OAuth (Google, Apple)
│   └── Profile management
│
├── 💳 Subscription Management
│   ├── Plány (Free, Basic, Premium, Business)
│   ├── Stripe integrace
│   └── Trial periody
│
├── 🔐 Module Access Control
│   ├── Registr modulů
│   ├── Přístupová práva
│   └── Module switcher
│
└── 👑 Admin Panel
    ├── User management
    ├── Module management
    ├── Subscription overview
    └── Audit logs
```

### **MODULY PŘIDÁME POZDĚJI:**
```
modules/
├── paymentspro/     ← Když budeme migrovat PaymentsPro
├── lifepro/         ← Když budeme dělat LifePro
└── digipro/         ← Budoucnost
```

---

## 🎯 PROČ TAK?

### **1. Vytvořme ZÁKLAD:**
- ✅ Auth systém
- ✅ User management
- ✅ Subscription systém
- ✅ Module access control

### **2. Pak PŘIDÁME PaymentsPro:**
- Vezmeme tvůj hotový PaymentsPro backend
- Přidáme jako modul
- Funguje samostatně i v ekosystému

### **3. Pak PŘIDÁME LifePro:**
- Vytvoříme LifePro modul
- Používá centrální auth
- Funguje samostatně i v ekosystému

---

## 📋 CO UDĚLÁŠ TEĎKA

### **KROK 1: Vytvoř Supabase projekt** (5 min)
1. Jdi na: https://supabase.com
2. Vytvoř projekt: `digipro-ecosystem`
3. Region: Central EU (Frankfurt)
4. Ulož si databázové heslo!

### **KROK 2: Spusť CORE schéma** (3 min)
1. Otevři Supabase → SQL Editor
2. Otevři soubor `supabase-core-schema.sql`
3. Zkopíruj CELÝ obsah
4. Vlož do SQL Editoru
5. Klikni RUN
6. ✅ Success!

**⚠️ POZOR: Použij `supabase-core-schema.sql`, NE `supabase-complete-schema.sql`!**

### **KROK 3: Vytvoř .env soubory** (5 min)

#### Backend .env:
```bash
cd /Users/lenkaroubalova/Documents/Projekty/lifepro-original
cp .env.example .env
code .env
```

Vyplň:
```env
SUPABASE_URL=https://tvuj-projekt.supabase.co
SUPABASE_ANON_KEY=tvuj-anon-key
SUPABASE_SERVICE_ROLE_KEY=tvuj-service-role-key
JWT_SECRET=$(openssl rand -base64 32)
# ... atd
```

### **KROK 4: Řekni "Hotovo!"**

---

## 🏗 CO BUDE DÁL

### **FÁZE 1: Core Backend** (2-3 dny)
Vytvořím:
```
backend/
├── routes/
│   ├── auth.js           # Login, register, OAuth
│   ├── users.js          # User CRUD
│   ├── subscriptions.js  # Subscription management
│   ├── modules.js        # Module access
│   └── admin.js          # Admin endpoints
├── middleware/
│   ├── auth.js           # JWT validation
│   ├── moduleAccess.js   # Check module access
│   └── adminOnly.js      # Admin guard
├── lib/
│   └── supabase.js       # Supabase client
└── server.js             # Main Express app
```

### **FÁZE 2: Core Frontend** (3-4 dny)
```
frontend/
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx      # Module switcher
│   └── Admin.jsx          # Admin panel
├── components/
│   ├── ModuleSwitcher.jsx
│   ├── UserProfile.jsx
│   └── SubscriptionCard.jsx
└── layouts/
    └── MainLayout.jsx
```

### **FÁZE 3: Přidání PaymentsPro jako modul** (3-5 dní)
- Vezmeme tvůj PaymentsPro backend
- Refactor → modul
- Integrace s core

### **FÁZE 4: Přidání LifePro jako modul** (5-7 dní)
- Vytvoříme LifePro modul
- Integrace s core
- Admin rozhraní

---

## 📊 CO JE V CORE DATABÁZI

### **Tabulky (jen core, bez modulů!):**

#### **Auth & Users:**
- `users` - Uživatelé
- `user_sessions` - Active sessions
- `email_verification_tokens` - Email ověření
- `password_reset_tokens` - Reset hesla

#### **Subscriptions:**
- `subscription_plans` - Plány (Free, Basic, ...)
- `user_subscriptions` - User předplatné

#### **Modules:**
- `modules` - Registr modulů (PaymentsPro, LifePro, ...)
- `user_module_access` - Kdo má přístup ke kterým modulům

#### **System:**
- `audit_logs` - Log všech změn
- `notifications` - System notifikace

**CELKEM: 11 tabulek (jen core!)**

---

## 🎯 Timeline

| Fáze | Co | Čas |
|------|-----|-----|
| **Dnes** | Supabase core setup | TY - 15 min |
| **Dnes-zítra** | Core backend | JÁ - 2 dny |
| **+2-3 dny** | Core frontend | JÁ - 3 dny |
| **+3-5 dní** | PaymentsPro modul | MY - 4 dny |
| **+5-7 dní** | LifePro modul | MY - 6 dní |
| **CELKEM** | **Hotový ekosystém** | **~18 dní** |

---

## 💡 KLÍČOVÝ ROZDÍL

### ❌ ŠPATNĚ (co jsem navrhl předtím):
```
Vytvoříme všechno najednou:
- Core + PaymentsPro + LifePro
- Obrovské schéma
- Složité
```

### ✅ SPRÁVNĚ (co děláme teď):
```
1. CORE (základ) ← TEĎKA
2. + PaymentsPro modul ← POZDĚJI
3. + LifePro modul ← JEŠTĚ POZDĚJI
```

**= Postupné budování, jednodušší, čistší!**

---

## 📁 Důležité soubory

### **PRO TEBE TEĎKA:**
- `supabase-core-schema.sql` ← TENHLE spusť v Supabase!
- `.env.example` ← Zkopíruj jako `.env` a vyplň
- `SUPABASE-SETUP.md` ← Detailní návod

### **IGNORUJ TEĎKA:**
- `supabase-complete-schema.sql` ← Starý, s moduly
- `lifepro-app/supabase-schema.sql` ← Jen LifePro

---

## 🚀 Začni!

1. Založ Supabase projekt
2. Spusť `supabase-core-schema.sql`
3. Vytvoř `.env`
4. Řekni mi "Hotovo!"

**A já začnu stavět core systém! 💪**

---

**Díky za upřesnění! Teď to dává smysl! 🎯**
