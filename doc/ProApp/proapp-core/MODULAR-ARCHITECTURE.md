# 🏗 Modulární Architektura - DigiPro Ecosystem

## 🎯 Vize: Jeden systém, tři produkty

Vytvoříme **modulární ekosystém**, kde:
- **PaymentsPro** = Správa plateb
- **LifePro** = Nalezení poslání
- **DigiPro** = (budoucí další modul)

Každý produkt funguje **samostatně** i jako **součást celku**.

---

## 📊 Co už máme v PaymentsPro (NEMĚNÍME!)

### ✅ Backend (Express + SQLite)
- ✅ **Auth systém** (local + Google OAuth + Apple)
- ✅ **Middleware** (auth, moduleAccess, planLimits, auditLog)
- ✅ **Routes** (auth, admin, payments, subscription, sso)
- ✅ **Database** (SQLite3)
- ✅ **Email service** (nodemailer)
- ✅ **Subscriptions** (Stripe integration)

### ✅ Frontend (React + Vite + MUI)
- ✅ **Auth komponenty** (LoginForm, RegisterForm, GoogleLogin, AppleLogin)
- ✅ **Common komponenty** (UniversalFilterBar, UniversalToggleBar, ControlPanel)
- ✅ **Theme systém** (DigiPro glassmorphism)
- ✅ **Color schemes** (barevné schémata)
- ✅ **Services** (API communication, axios)
- ✅ **Contexts** (ColorScheme, Auth)

---

## 🎨 Nová Architektura - Tři vrstvy

```
digipro-ecosystem/
│
├── shared/                        # 🔧 SDÍLENÁ VRSTVA (core)
│   ├── frontend/
│   │   ├── components/
│   │   │   ├── auth/              # Login, Register, OAuth
│   │   │   ├── common/            # UniversalFilterBar, ControlPanel
│   │   │   ├── layout/            # Header, Footer, Navigation
│   │   │   └── ui/                # Buttons, Inputs, Cards
│   │   ├── theme/                 # DigiPro theme
│   │   ├── hooks/                 # useAuth, useApi, useTheme
│   │   ├── contexts/              # Auth, Theme, ColorScheme
│   │   ├── services/              # API, localStorage
│   │   └── utils/                 # helpers, validators
│   │
│   └── backend/
│       ├── middleware/            # auth, moduleAccess, planLimits
│       ├── routes/                # auth, admin, subscription
│       ├── services/              # emailService, stripeService
│       ├── database/              # migrations, seeds
│       └── utils/                 # helpers, validators
│
├── modules/                       # 📦 MODULY (produkty)
│   ├── paymentspro/               # PaymentsPro modul
│   │   ├── frontend/
│   │   │   ├── components/
│   │   │   │   └── payments/     # Payment-specific komponenty
│   │   │   ├── pages/
│   │   │   └── services/
│   │   └── backend/
│   │       ├── routes/            # payments routes
│   │       ├── database/          # payments schema
│   │       └── services/          # payment logic
│   │
│   ├── lifepro/                   # LifePro modul
│   │   ├── frontend/
│   │   │   ├── components/
│   │   │   │   ├── questionnaire/ # Questionnaire flow
│   │   │   │   ├── results/       # Results visualization
│   │   │   │   └── admin/         # Content management
│   │   │   ├── pages/
│   │   │   └── services/
│   │   └── backend/
│   │       ├── routes/            # lifepro routes
│   │       ├── database/          # lifepro schema (Supabase)
│   │       └── services/          # AI analysis
│   │
│   └── digipro/                   # DigiPro modul (budoucnost)
│       └── ...
│
└── apps/                          # 🚀 APLIKACE (sestavené produkty)
    ├── standalone/
    │   ├── paymentspro-app/       # Samostatný PaymentsPro
    │   ├── lifepro-app/           # Samostatný LifePro
    │   └── digipro-app/           # Samostatný DigiPro
    │
    └── combined/
        └── digipro-suite/         # Všechny moduly dohromady
```

---

## 🔄 Jak to funguje?

### **1. Sdílená vrstva (shared/)**
- **Frontend**: Komponenty, theme, hooks, contexts
- **Backend**: Auth, middleware, common routes
- **Všechny moduly** to používají

### **2. Moduly (modules/)**
- Každý modul má svůj frontend + backend
- Import ze sdílené vrstvy
- Nezávislé na sobě

### **3. Aplikace (apps/)**
- **Standalone**: Jeden modul = jedna aplikace
- **Combined**: Více modulů = suite

---

## 📦 Package Structure (Monorepo)

Použijeme **npm workspaces** nebo **pnpm workspaces**:

```json
// package.json (root)
{
  "name": "digipro-ecosystem",
  "workspaces": [
    "shared/frontend",
    "shared/backend",
    "modules/paymentspro/frontend",
    "modules/paymentspro/backend",
    "modules/lifepro/frontend",
    "modules/lifepro/backend",
    "apps/standalone/*",
    "apps/combined/*"
  ]
}
```

---

## 🎯 Praktický Příklad - LifePro používá PaymentsPro komponenty

### **LifePro Frontend**
```typescript
// modules/lifepro/frontend/pages/Dashboard.jsx

// Import ze sdílené vrstvy
import { UniversalFilterBar } from '@digipro/shared-frontend/components/common'
import { useAuth } from '@digipro/shared-frontend/hooks'
import { theme } from '@digipro/shared-frontend/theme'

// Import z vlastního modulu
import { QuestionnaireProgress } from '../components/questionnaire'

function LifeProDashboard() {
  const { user } = useAuth()

  return (
    <Box sx={{ theme: theme.digipro }}>
      <UniversalFilterBar /> {/* Z PaymentsPro! */}
      <QuestionnaireProgress user={user} />
    </Box>
  )
}
```

### **LifePro Backend**
```javascript
// modules/lifepro/backend/routes/questionnaire.js

// Import ze sdílené vrstvy
import { authenticateToken } from '@digipro/shared-backend/middleware/auth'
import { checkModuleAccess } from '@digipro/shared-backend/middleware/moduleAccess'

// Import z vlastního modulu
import { saveUserResponse } from '../services/questionnaire'

router.post('/responses',
  authenticateToken,           // Z PaymentsPro!
  checkModuleAccess('lifepro'), // Z PaymentsPro!
  async (req, res) => {
    // LifePro logika
    await saveUserResponse(req.user.id, req.body)
    res.json({ success: true })
  }
)
```

---

## 🔧 Migration Plán - Jak to udělat?

### **FÁZE 1: Vytvořit shared/ strukturu (1 týden)**

1. **Vytvořit novou strukturu**
```bash
mkdir -p digipro-ecosystem/{shared,modules,apps}
```

2. **Zkopírovat PaymentsPro do modules/**
```bash
cp -r payments/my-paymentspro-app modules/paymentspro
```

3. **Extrahovat sdílené komponenty**
- Auth komponenty → `shared/frontend/components/auth/`
- Common komponenty → `shared/frontend/components/common/`
- Theme → `shared/frontend/theme/`
- Auth middleware → `shared/backend/middleware/`

### **FÁZE 2: Refactor PaymentsPro (2-3 dny)**

1. **Změnit importy** v PaymentsPro
```javascript
// Před
import { LoginForm } from './components/auth/LoginForm'

// Po
import { LoginForm } from '@digipro/shared-frontend/components/auth'
```

2. **Otestovat** že PaymentsPro stále funguje

### **FÁZE 3: Přidat LifePro modul (1 týden)**

1. **Vytvořit LifePro modul**
```bash
mkdir -p modules/lifepro/{frontend,backend}
```

2. **Přidat LifePro kod**
- Frontend: React komponenty pro questionnaire
- Backend: Routes pro LifePro (nebo použít Supabase)

3. **Import sdílených komponent**
```javascript
import { UniversalFilterBar } from '@digipro/shared-frontend'
import { useAuth } from '@digipro/shared-frontend'
```

### **FÁZE 4: Sestavit aplikace (2-3 dny)**

1. **Standalone apps**
```bash
# PaymentsPro standalone
cd apps/standalone/paymentspro-app
# Import pouze paymentspro modul + shared

# LifePro standalone
cd apps/standalone/lifepro-app
# Import pouze lifepro modul + shared
```

2. **Combined app**
```bash
# DigiPro Suite
cd apps/combined/digipro-suite
# Import všechny moduly + shared
```

---

## 🎨 Jak uživatel vidí moduly?

### **Standalone aplikace**
```
┌─────────────────────────────┐
│ 💰 PaymentsPro              │
├─────────────────────────────┤
│ Dashboard                   │
│ Platby                      │
│ Statistiky                  │
│ Nastavení                   │
└─────────────────────────────┘
```

### **Combined suite**
```
┌─────────────────────────────┐
│ 🚀 DigiPro Suite            │
├─────────────────────────────┤
│ 📊 Dashboard (přehled všeho)│
│                             │
│ Moduly:                     │
│ [💰 PaymentsPro] ────────┐  │
│ [🎯 LifePro]     ────────┤  │
│ [📱 DigiPro]     ────────┘  │
│                             │
│ Profil                      │
│ Nastavení                   │
│ Předplatné                  │
└─────────────────────────────┘
```

Uživatel si **koupí** moduly které chce:
- Jen PaymentsPro: €9/měsíc
- Jen LifePro: €15/měsíc
- Oba moduly: €20/měsíc (sleva!)

---

## 🔐 Sdílený přístup & Subscriptions

### **Jeden uživatel, více modulů**
```javascript
// Database (shared)
users {
  id, email, password, ...
}

user_subscriptions {
  user_id,
  module_name,      // 'paymentspro', 'lifepro', 'digipro'
  plan_type,        // 'free', 'basic', 'premium'
  status,           // 'active', 'cancelled', 'expired'
  expires_at
}
```

### **Module Access Middleware** (už máte!)
```javascript
// shared/backend/middleware/moduleAccess.js

function checkModuleAccess(moduleName) {
  return async (req, res, next) => {
    const hasAccess = await checkUserHasModule(req.user.id, moduleName)
    if (!hasAccess) {
      return res.status(403).json({ error: 'Module not available' })
    }
    next()
  }
}

// Použití
app.use('/api/lifepro', checkModuleAccess('lifepro'), lifeProRoutes)
app.use('/api/payments', checkModuleAccess('paymentspro'), paymentsRoutes)
```

---

## 📊 Database Strategy

### **Option A: Jedna databáze pro vše** (jednodušší)
```sql
-- Shared tables
users
subscriptions
sessions
audit_logs

-- PaymentsPro tables
payments
payment_categories

-- LifePro tables
categories
sections
questions
user_responses
```

### **Option B: Hybridní** (flexibilnější)
```
Shared: SQLite (PaymentsPro model)
├── users, auth, subscriptions

PaymentsPro: SQLite
└── payments, categories

LifePro: Supabase (PostgreSQL)
└── questionnaire data, AI analyses
```

**Doporučuji Option B** protože:
- LifePro už má Supabase schéma připravené
- PaymentsPro zůstává nezměněný
- Sdílený auth v SQLite

---

## 🚀 Výhody tohoto přístupu

✅ **PaymentsPro zůstává beze změn** - jen přesuneme sdílené věci
✅ **LifePro může začít rychle** - používá hotové komponenty
✅ **Flexibilní prodej** - moduly samostatně nebo dohromady
✅ **Snadná údržba** - změna v shared → všude
✅ **Škálovatelnost** - přidávání dalších modulů
✅ **DRY principle** - žádná duplikace kódu

---

## 📝 Next Steps

1. **Schválit architekturu** ✋
2. **Vytvořit digipro-ecosystem/ strukturu**
3. **Extrahovat shared/ z PaymentsPro**
4. **Refactor PaymentsPro importů**
5. **Přidat LifePro modul**
6. **Otestovat oba moduly**
7. **Vytvořit combined app**

**Odhad: 2-3 týdny celkem**

---

## 🎯 Co řešíme?

### ❓ Jak to nasadit?
- **Standalone**: Každá app na vlastní doméně
  - paymentspro.app
  - lifepro.app
- **Combined**: Suite na jedné doméně
  - digipro.app (všechny moduly)

### ❓ Jak to testovat lokálně?
```bash
# Terminal 1: Shared backend
cd shared/backend && npm run dev

# Terminal 2: PaymentsPro backend
cd modules/paymentspro/backend && npm run dev

# Terminal 3: LifePro backend (nebo Supabase)
cd modules/lifepro/backend && npm run dev

# Terminal 4: Frontend (standalone nebo combined)
cd apps/standalone/lifepro-app && npm run dev
```

### ❓ Jak to verzovat?
- Každý modul má vlastní verzi
- Shared má vlastní verzi
- Apps mají vlastní verze

```json
{
  "@digipro/shared-frontend": "1.0.0",
  "@digipro/paymentspro-frontend": "2.5.0",
  "@digipro/lifepro-frontend": "1.0.0"
}
```

---

Máte dotazy? Můžeme diskutovat každou část! 🚀
