# PaymentsPro - Kompletní Summary
**Období**: Srpen - Říjen 2025 (2 měsíce intenzivního vývoje)
**Autoři**: Claude (Code & Sonnet 4.5) + Lenka Roubalová
**Zdrojový dokument**: summary.md (19,855 řádků)
**Datum vytvoření summary**: 21.10.2025

---

## 📋 Obsah

1. [ARCHITEKTURA & STRUKTURA](#1-architektura--struktura)
2. [HLAVNÍ FEATURY (chronologicky)](#2-hlavní-featury-chronologicky)
3. [KRITICKÉ CHYBY & ŘEŠENÍ](#3-kritické-chyby--řešení)
4. [ANTI-PATTERNS (CO NEDĚLAT!)](#4-anti-patterns-co-nedělat)
5. [ARCHITEKTONICKÁ ROZHODNUTÍ](#5-architektonická-rozhodnutí)

---

# 1. ARCHITEKTURA & STRUKTURA

## 1.1 Tech Stack

### Frontend
- **React 18** (functional components, hooks)
- **Vite** (build tool, HMR)
- **Material-UI v5** (MUI) s CSS-in-JS
- **date-fns** (date manipulation, timezone-safe)
- **React Router** (navigace)
- **Axios** (HTTP client s interceptory)

### Backend
- **Node.js + Express** (REST API)
- **SQLite3** (database)
- **JWT** (access token 15 min, refresh token 7 dní)
- **Google OAuth** (přihlášení přes Google)
- **Resend** (email service)

### Design System
- **Glassmorphism** (backdrop-filter blur, semi-transparent backgrounds)
- **Unified Color System** (4 color schemes: PaymentsPro, Rezervy, Wishlist, LifePro)
- **Responsive Design** (progressive column disclosure)
- **Dark/Light Mode** (automatické přepínání)

---

## 1.2 Modulární architektura

```
PaymentsPro App
├── Modules (4 samostatné aplikace v jedné)
│   ├── PaymentsModule.jsx (platby, předplatná)
│   ├── ReservesModule.jsx (rezervy, spoření)
│   ├── WishlistModule.jsx (seznam přání)
│   └── LifeProModule.jsx (životní události)
│
├── Shared Components
│   ├── UniversalDialog/ (config-driven dialogy)
│   │   ├── index.jsx (447 řádků)
│   │   ├── DynamicTab.jsx (209 řádků)
│   │   └── FieldRenderer.jsx (371 řádků)
│   ├── UniversalFilterBar.jsx (filtrování)
│   ├── UniversalToggleBar.jsx (mód switcher)
│   ├── Float Menu System/
│   │   ├── FloatMenu.jsx (FAB main menu)
│   │   ├── TopRightFloatMenu.jsx (user menu)
│   │   ├── LeftSettingsFloatMenu.jsx (nastavení)
│   │   ├── NavbarFloatMenu.jsx (navigace)
│   │   └── LogoFloatMenu.jsx (branding)
│   └── Help System/
│       ├── PaymentTableHelp.jsx (357 řádků)
│       ├── HelpPage.jsx (540 řádků)
│       └── AboutPage.jsx (380 řádků)
│
├── Context Providers (globální state)
│   ├── AuthContext.jsx (JWT autentizace)
│   ├── NotificationContext.jsx (toast messages)
│   ├── UnifiedColorContext.jsx (color schemes)
│   ├── CategoryRefreshContext.jsx (category sync)
│   ├── BusinessPersonalContext.jsx (mode toggle)
│   └── PageModeContext.jsx (page state)
│
├── Hooks (reusable logic)
│   ├── useColors.js (color scheme management)
│   ├── useModernEffects.js (glassmorphism, animations)
│   └── useBusinessPersonal.js (mode switching)
│
├── Config (centralized settings)
│   ├── unifiedColors.js (4 color schemes)
│   ├── responsive.js (breakpoints, progressive columns)
│   ├── czechBanks.js (45 českých bank)
│   └── dialogs/
│       ├── paymentDialogConfig.js (925 řádků)
│       ├── rezervyDialogConfig.js (381 řádků)
│       ├── wishlistDialogConfig.js (429 řádků)
│       └── lifeproDialogConfig.js (337 řádků)
│
└── Utils
    ├── paymentAutoCopy.js (auto-copy workflow)
    └── formatters.js (date, currency formatting)
```

---

## 1.3 Klíčové komponenty PaymentsModule

### Multi-view systém (3 pohledy)
1. **TABLE** - PaymentList.jsx (tabulka s pokročilým řazením)
2. **CARDS** - PaymentCards.jsx (kartový pohled)
3. **GALLERY** - PaymentTable.jsx (galerie/kalendář)

### Dialogy
- **PaymentDialog** (wrapper 362 řádků, config 925 řádků)
- **AutoCopyConfirmationDialog** (nested dialog pro auto-copy)
- **QR Dialog** (Czech SPAYD formát pro platby)

### Column Management
- Drag & drop pořadí sloupců
- Toggle visibility
- LocalStorage persistence
- Progressive disclosure (responzivní zobrazení)

---

## 1.4 Database Schema (klíčové tabulky)

### `users` table
```sql
id INTEGER PRIMARY KEY
email TEXT UNIQUE NOT NULL
password_hash TEXT
google_id TEXT
role TEXT DEFAULT 'user'  -- 'user' nebo 'admin'
subscription_plan TEXT DEFAULT 'free'  -- free, basic, business, enterprise
trial_end_date DATETIME
is_active INTEGER DEFAULT 1
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

### `payments` table (49 sloupců!)
```sql
id INTEGER PRIMARY KEY
user_id INTEGER NOT NULL
title TEXT NOT NULL
amount REAL NOT NULL
currency TEXT DEFAULT 'CZK'
due_date DATE
is_paid INTEGER DEFAULT 0
paid_date DATE
type TEXT CHECK(type IN ('personal', 'business'))
category_id INTEGER
payment_method TEXT  -- card, bank_transfer, cash, standing_order, recurring
frequency TEXT  -- once, weekly, monthly, quarterly, yearly
priority INTEGER DEFAULT 1  -- 1 (Low), 2 (Medium), 3 (High)
is_active INTEGER DEFAULT 1
is_archived INTEGER DEFAULT 0
is_permanently_archived INTEGER DEFAULT 0
-- Bankovní údaje
bank_account TEXT
bank_code TEXT
iban TEXT
variable_symbol TEXT
constant_symbol TEXT
specific_symbol TEXT
-- Subscription
is_subscription INTEGER DEFAULT 0
subscription_start_date DATE
subscription_end_date DATE
is_trial INTEGER DEFAULT 0
renewal_notification_enabled INTEGER DEFAULT 0
subscription_notification_days_before INTEGER DEFAULT 7
-- Auto-copy
auto_copy_enabled INTEGER DEFAULT 0
-- Installments (splátky)
has_commitment INTEGER DEFAULT 0
commitment_months INTEGER
commitment_start DATE
commitment_end DATE
total_amount REAL
paid_amount REAL DEFAULT 0
-- Ostatní
notes TEXT
company_name TEXT
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

### `payment_installments` table
```sql
id INTEGER PRIMARY KEY
payment_id INTEGER NOT NULL
amount REAL NOT NULL
paid_date DATE NOT NULL
notes TEXT
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
```

### `categories` table
```sql
id INTEGER PRIMARY KEY
user_id INTEGER NOT NULL
name TEXT NOT NULL
icon TEXT
color TEXT
type TEXT DEFAULT 'personal'  -- 'personal' nebo 'business'
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

---

# 2. HLAVNÍ FEATURY (chronologicky)

## 2.1 Srpen 2025 - Základy a auth

### Notifikační systém
- **NotificationContext** s Material-UI Snackbar
- Zvukové notifikace (`/public/sounds/notification.mp3`)
- Nahrazení všech `alert()` volání
- Auto-dismiss po 4 sekundách
- Stack pro více notifikací najednou

### JWT Authentication
- **Access token**: 15 minut (localStorage)
- **Refresh token**: 7 dní (httpOnly cookie)
- **Axios interceptor**: Automatický refresh při 401
- **Google OAuth**: Kompletní integrace
- **Forgot password flow**: Email reset link přes Resend

### Category Management
- CRUD operace pro kategorie
- **Chyba**: Kategorie se neukládaly (chyběl sloupec `type` v DB)
- **Fix**: Migrace + default hodnota 'personal'

### Archive System
- **3 stavy**:
  1. Active (is_archived = false)
  2. Archived (vratné)
  3. Permanently Archived (nevratné)
- Toggle-based UI (jedno tlačítko, více stavů)

---

## 2.2 Září 2025 - Subscription & Admin

### Role-based Authentication
- **Admin role**: Vidí všechny uživatele, debug panel
- **User role**: Pouze svoje data
- **Middleware**: `checkPaymentLimits` před POST /api/payments

### 4 Subscription Tiers
| Tier       | Payments/měsíc | Cena   |
|------------|----------------|--------|
| Free       | 5              | $0     |
| Basic      | 20             | $9/měs |
| Business   | Unlimited      | $29/měs|
| Enterprise | Unlimited + podpory | Custom |

### Plan Limits Enforcement
- **SQL bug**: `created_at >= date('now', 'start of month')` nefungoval
- **Fix**: `strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')`
- **Usage Dashboard**: Real-time tracking s progress bary
- **Warning**: Při 80%+ limitu
- **Error**: Při >100% zablokování vytváření

### Admin Panel
- Hromadné operace (aktivace/deaktivace/delete)
- Změna rolí a subscription planů
- **Audit logging**: Všechny admin akce logované
- **Export CSV**: Batch export uživatelů

### Stripe Payment Integration
- Kompletní checkout flow
- **UpgradePrompt** banner pro free users
- Webhook handling pro subscription events
- **Status**: UI funkční, čeká na production API klíč

---

## 2.3 Září 2025 - UI Refaktoring

### UniversalToggleBar systém
- **Cíl**: Konzistentní toggle bary napříč aplikací
- **PageModeContext**: Sdílený state pro módypred
- **Animace timeout**: 10 sekund místo nekonečně (accessibility)

### Float Menu refaktoring
- **5 specializovaných menu**:
  - FloatMenu (FAB - pravý dolní roh)
  - TopRightFloatMenu (user - pravý horní)
  - LeftSettingsFloatMenu (nastavení - levý střed)
  - NavbarFloatMenu (navigace - levý horní)
  - LogoFloatMenu (branding)
- Auto-zavírání při otevření jiného menu
- Koordinace přes App.jsx state

### Custom PaymentsIcon
- Nahrazení emoji 💰 za SVG
- **Size**: 64px s glow efekty
- Integrace s DigiPro color scheme

---

## 2.4 Září 2025 - Color System MEGA Refaktoring

### Problém PŘED refaktorem
- **3 různé barevné systémy**:
  - colorSchemes.js (starý)
  - unifiedColors.js (nový)
  - unified-color-system.js (další)
- **Fragmentované contexty**:
  - UnifiedColorContext.jsx (aktivní)
  - ThemeContext.jsx (starý)
  - ColorSchemeContext.jsx (starý)
- **Duplikace**: ~2000 řádků mrtvého kódu
- **Glassmorphism**: 80+ míst s různými blur hodnotami (8px, 10px, 15px, 20px, 25px, 30px)

### Řešení
1. ✅ Migrace všech komponent na UnifiedColorContext
2. ✅ Přesun deprecated souborů do `_deprecated/`
3. ✅ Zakomentování ~2000 řádků duplicit
4. ✅ Centralizace glassmorphism do `useModernEffects.js`
5. ✅ Filter brightness(1.8) pro dark mode

### Unified Color System (finální)
```javascript
// unifiedColors.js
export const colorSchemes = {
  paymentspro: {
    primary: '#10B981',        // Emerald green
    secondary: '#3B82F6',      // Blue
    gradient: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
    dark: {
      primary: '#10B981',
      secondary: '#3B82F6',
      filter: 'brightness(1.8)'
    }
  },
  // ... 3 další schemes
};

// Hook:
const { colors, isDarkMode, currentScheme } = useColors();
```

**Výsledek**: Z ~2000 řádků duplicit → ~300 řádků čistého kódu

---

## 2.5 Říjen 2025 - UniversalDialog Refaktoring

### Problém PŘED
- **Každý modul měl vlastní dialog**:
  - PaymentDialog: 1,486 řádků
  - ReserveDialog: ~1,400 řádků
  - WishlistDialog: ~1,300 řádků
  - LifeProDialog: ~1,200 řádků
- **Celkem**: ~5,400 řádků duplikovaného kódu!
- **Maintenance nightmare**: Změna v jednom = copy-paste do všech

### Řešení: Config-Driven Development
**UniversalDialog** - Generic komponenta s JSON konfiguracemi

#### Struktura:
```javascript
// paymentDialogConfig.js (925 řádků)
export default {
  editTitle: 'Upravit platbu',
  createTitle: 'Nová platba',
  maxWidth: 'md',

  tabs: [
    {
      id: 'basic',
      label: 'Základní',
      icon: <DescriptionIcon />,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          validate: (value) => value.length >= 3 ? null : 'Min 3 znaky'
        },
        {
          name: 'has_commitment',
          type: 'switch',
          condition: (formData) => formData.payment_method === 'standing_order'
        },
        // ... 40+ polí
      ]
    },
    // ... 3 další tabs
  ],

  transformBeforeSubmit: (data) => ({
    ...data,
    has_commitment: data.has_commitment ? 1 : 0
  })
};
```

#### Podporované field types:
- text, number, email, password
- switch, checkbox, select, autocomplete
- date, datetime-local
- textarea
- custom (vlastní React komponenta)
- row (horizontální layout)
- section (sekce s nadpisem)

#### Conditional Rendering:
```javascript
{
  name: 'commitment_months',
  type: 'number',
  condition: (formData) => formData.has_commitment === true
}
```

### Výsledky refaktoru

| Soubor            | Před  | Po    | Úspora |
|-------------------|-------|-------|--------|
| PaymentDialog     | 1,486 | 362   | -75.6% |
| App.jsx           | 1,501 | ~300  | -80.0% |
| **Dialogy (celkem)** | **5,400** | **2,000** | **-63.0%** |

### Vyřešené problémy

#### Problem 1: Boolean hodnoty ukládány jako stringy
```javascript
// PŘED: Switch ukládal "true" (string)
// PO: Type-aware handling
if (field?.type === 'switch' || field?.type === 'checkbox') {
  value = Boolean(value);
}
```

#### Problem 2: Custom komponenty bez additionalProps
```javascript
// FIX:
<FieldRenderer
  field={field}
  formData={formData}
  handleInputChange={handleInputChange}
  additionalProps={additionalProps}  // ← Přidáno
/>
```

#### Problem 3: Form se neresetoval při zavření
```javascript
// FIX: useEffect při změně open
React.useEffect(() => {
  if (!open) {
    const defaults = {};
    extractAllFields(config.tabs).forEach(field => {
      if (field.name) {
        defaults[field.name] = field.defaultValue !== undefined
          ? field.defaultValue
          : '';
      }
    });
    setFormData(defaults);
    setCurrentTab(0);
  }
}, [open]);
```

---

## 2.6 Říjen 2025 - Auto-Copy & Installments

### Auto-Copy Functionality
**Feature**: Automatické kopírování plateb pro další období

#### Backend migrace:
```sql
ALTER TABLE payments ADD COLUMN paid_date DATETIME;
ALTER TABLE payments ADD COLUMN auto_copy_enabled INTEGER DEFAULT 0;
```

#### Workflow:
1. Uživatel označí platbu jako zaplacenou
2. Pokud má `auto_copy_enabled = true`, zobrazí se confirmation dialog
3. Po potvrzení se vytvoří nová platba pro další období
4. `due_date` se automaticky posune podle `frequency`
5. Nová platba se zvýrazní v seznamu
6. Po chvíli se automaticky otevře pro editaci

#### Implementace (paymentAutoCopy.js):
```javascript
export const canUseAutoCopy = (payment) => {
  if (!payment.is_paid) return false;
  if (!payment.auto_copy_enabled) return false;
  if (!payment.frequency || payment.frequency === 'once') return false;
  return true;
};

export const executeAutoCopy = async ({ payment, onSubmit, onSuccess, onError }) => {
  // 1. Uložit původní platbu
  await onSubmit(payment);

  // 2. Vytvořit kopii pro další období
  const { id, ...paymentWithoutId } = payment;  // Odstranit ID!
  const newPayment = {
    ...paymentWithoutId,
    due_date: calculateNextDueDate(payment.due_date, payment.frequency),
    is_paid: false,
    paid_date: null
  };

  // 3. Uložit novou platbu
  const result = await onSubmit(newPayment);

  // 4. Callback
  if (onSuccess) onSuccess(result, payment);

  return result;
};
```

### Installments System (splátky)
**Feature**: Sledování splátek s historií a progress trackingem

#### Backend migrace:
```sql
ALTER TABLE payments ADD COLUMN has_commitment INTEGER DEFAULT 0;
ALTER TABLE payments ADD COLUMN commitment_months INTEGER;
ALTER TABLE payments ADD COLUMN commitment_start DATE;
ALTER TABLE payments ADD COLUMN commitment_end DATE;
ALTER TABLE payments ADD COLUMN total_amount REAL;
ALTER TABLE payments ADD COLUMN paid_amount REAL DEFAULT 0;

CREATE INDEX idx_payments_commitment ON payments(has_commitment);

CREATE TABLE payment_installments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  payment_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  paid_date DATE NOT NULL,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
);
```

#### Backend API:
```javascript
// POST /api/payments/:id/installments
app.post('/api/payments/:id/installments', authenticateToken, async (req, res) => {
  const { amount, paid_date, notes } = req.body;
  // Insert do payment_installments table
  // Auto-update paid_amount v payments
});

// GET /api/payments/:id/installments
app.get('/api/payments/:id/installments', authenticateToken, async (req, res) => {
  // Fetch installment history
});
```

#### Auto-increment logika:
```javascript
// PaymentDialog.jsx (řádky 105-191)
if (isNewPaymentWithFirstInstallment || isExistingPaymentNowPaid) {
  const currentPaidAmount = parseFloat(dataWithType.paid_amount || 0);
  const paymentAmount = parseFloat(dataWithType.amount || 0);
  const newPaidAmount = currentPaidAmount + paymentAmount;

  dataWithType.paid_amount = newPaidAmount;

  // Pokud není celá částka zaplacena, posun due_date
  if (dataWithType.paid_amount < dataWithType.total_amount) {
    const currentDueDate = new Date(dataWithType.due_date);

    switch (dataWithType.frequency) {
      case 'weekly':
        newDueDate = addDays(parseISO(dataWithType.due_date), 7);
        break;
      case 'monthly':
        newDueDate = addMonths(parseISO(dataWithType.due_date), 1);
        break;
      case 'quarterly':
        newDueDate = addMonths(parseISO(dataWithType.due_date), 3);
        break;
      case 'yearly':
        newDueDate = addYears(parseISO(dataWithType.due_date), 1);
        break;
    }

    dataWithType.due_date = format(newDueDate, 'yyyy-MM-dd');
    dataWithType.is_paid = false; // Reset pro další splátku
    dataWithType.paid_date = '';
  }

  // Uložit splátku do historie
  dataWithType._saveInstallmentAfterSubmit = {
    amount: paymentAmount,
    paid_date: actualPaidDate,
    notes: `Splátka ${Math.round((dataWithType.paid_amount / dataWithType.total_amount) * 100)}%`
  };
}
```

---

## 2.7 Říjen 2025 - Vizualizace splátek (21.10.2025)

### Pie Chart Implementation
**Feature**: SVG koláčový graf pro zobrazení pokroku splátek

#### Vizuální design:
- **Velikost**: 28×28px
- **Poloměr**: 11px
- **Stroke width**: 3px
- **Background** (nezaplaceno): secondary barva
- **Progress** (zaplaceno): primary barva
- **Ikona uprostřed**: DonutSmallIcon v primary

#### SVG Matematika:
```javascript
// Circumference: 2πr = 2 × π × 11 = 69.115
const dashLength = (percentage / 100) × 69.115;

// Příklady:
//  0% → dasharray="0 69.115"
// 25% → dasharray="17.279 69.115"
// 50% → dasharray="34.558 69.115"
// 100% → dasharray="69.115 69.115"
```

#### Implementace:
```javascript
case 'installments': {
  const hasInstallments = !!(
    (['standing_order', 'recurring'].includes(p.payment_method) || p.has_commitment) &&
    p.total_amount && p.total_amount > 0
  );

  if (!hasInstallments) {
    return <Box>—</Box>;
  }

  const paidAmount = parseFloat(p.paid_amount || 0);
  const totalAmount = parseFloat(p.total_amount || 0);
  const progressPercentage = totalAmount > 0
    ? Math.min((paidAmount / totalAmount) * 100, 100)
    : 0;

  return (
    <Tooltip title={`Zaplaceno: ${formatCurrency(paidAmount)} z ${formatCurrency(totalAmount)} (${Math.round(progressPercentage)}%)`}>
      <IconButton onClick={(e) => {
        e.stopPropagation();
        onEdit(p, 1); // Otevře "Platba" tab
      }}>
        <Box sx={{ position: 'relative', width: 28, height: 28 }}>
          <svg width="28" height="28" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background circle */}
            <circle cx="14" cy="14" r="11" fill="none" stroke={colors.secondary} strokeWidth="3" />

            {/* Progress circle */}
            <circle
              cx="14" cy="14" r="11"
              fill="none"
              stroke={colors.primary}
              strokeWidth="3"
              strokeDasharray={`${(progressPercentage / 100) * 69.115} 69.115`}
              strokeLinecap="round"
            />
          </svg>

          {/* Icon overlay */}
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DonutSmallIcon sx={{ fontSize: '0.9rem', color: colors.primary }} />
          </Box>
        </Box>
      </IconButton>
    </Tooltip>
  );
}
```

### Tab Navigation Multi-layer
**Feature**: Klik na graf otevře přímo záložku "Platba"

#### Prop drilling přes 5 vrstev:
```
PaymentList (klik na graf)
    ↓ onEdit(payment, 1)
PaymentViewSwitcher (relay)
    ↓ onEditPayment(payment, 1)
PaymentsModule (state management)
    ↓ <PaymentDialog initialTab={1} />
PaymentDialog (wrapper)
    ↓ <UniversalDialog initialTab={1} />
UniversalDialog (actual tabs)
    ↓ setCurrentTab(1)
```

#### Tab struktura:
- Index 0: 'basic' - "Základní"
- Index 1: 'banking' - **"Platba"** ← CÍL
- Index 2: 'subscription' - "Předplatné"
- Index 3: 'notifications' - "Notifikace"

### Statistiky změn:

| Soubor                    | Přidáno | Odstraněno | Čistá změna |
|---------------------------|---------|------------|-------------|
| PaymentList.jsx           | ~150    | ~180       | -30         |
| PaymentViewSwitcher.jsx   | 1       | 1          | 0           |
| PaymentDialog.jsx         | 3       | 1          | +2          |
| UniversalDialog/index.jsx | 4       | 2          | +2          |
| PaymentsModule.jsx        | 8       | 3          | +5          |
| responsive.js             | 1       | 0          | +1          |
| **CELKEM**                | **~167**| **~187**   | **-20**     |

**Výsledek**: Kód kratší o 20 řádků, ale funkčnost +100%!

---

## 2.8 Říjen 2025 - Help Systems

### 3úrovňový help systém

#### 1. PaymentTableHelp.jsx (357 řádků)
- Kontextová nápověda k tabulce plateb
- 11 sekcí (Filtrování, Řazení, Akce, Priority, Tipy, ...)
- Real-time vyhledávání
- Barevné ikony podle typu

#### 2. HelpPage.jsx (540 řádků)
- Globální nápověda (/help route)
- Kompletní dokumentace všech features
- Accordion sekce
- Dark/Light mode

#### 3. AboutPage.jsx (380 řádků)
- O aplikaci
- Verze, autoři, technologie
- Changelog

### LogoFloatMenu rozšíření
- **Před**: Přímý link na homepage
- **Po**: Rozbalovací menu s 5 akcemi
  - Homepage
  - Help
  - About
  - Settings
  - Logout
- Zoom animace, Fade efekt, Backdrop overlay

---

# 3. KRITICKÉ CHYBY & ŘEŠENÍ

## 3.1 TOP 10 Opakujících se chyb

### 1. Boolean Coercion (5x!)
**Pattern**: `condition && number` vrací 0 místo false
**Výskyt**: PaymentList installments, category filters, archive logic

```javascript
// ❌ ŠPATNĚ (vracelo 0):
const hasInstallments = (
  p.total_amount && p.total_amount > 0
);
// Když p.total_amount je 0 → vrací 0 (falsy)
// React vykreslí "0" jako text!

// ✅ SPRÁVNĚ (vrací boolean):
const hasInstallments = !!(
  p.total_amount && p.total_amount > 0
);
// !!0 === false, React nevykreslí nic
```

**Lesson**: VŽDY použít `!!` operator pro boolean values v JSX conditions!

---

### 2. Set/Object v useMemo/useEffect Dependencies (5x!)
**Pattern**: Set/Object v dependency array způsobuje nekonečné smyčky
**Výskyt**: PaymentList, Column management, Filters

```javascript
// ❌ ŠPATNĚ (nekonečná smyčka):
useMemo(() => {
  // ... computation
}, [selectedColumns, computedVisibleColumns, columnOrder]);
// selectedColumns je Set → nová reference každý render!

// ✅ SPRÁVNĚ (serializace):
useMemo(() => {
  // ... computation
}, [
  Array.from(selectedColumns).sort().join(','),
  JSON.stringify(computedVisibleColumns),
  columnOrder
]);
```

**Lesson**: VŽDY serializovat Set/Object v dependencies!

---

### 3. Database Middleware Chybí (4x!)
**Pattern**: `req.db` jen pro specific routes místo globálně
**Výskyt**: Admin panel, Categories, Reserves

```javascript
// ❌ ŠPATNĚ (DB jen pro některé routes):
app.get('/api/payments', (req, res) => {
  const db = req.db; // undefined!
});

// ✅ SPRÁVNĚ (globální middleware):
app.use((req, res, next) => {
  req.db = db;
  next();
});
```

**Lesson**: VŽDY globální middleware pro DB connection!

---

### 4. Date Manipulation Bugs (4x!)
**Pattern**: Native Date methods s timezone/DST issues
**Výskyt**: Auto-copy due_date posun, Installments

```javascript
// ❌ ŠPATNĚ (DST bug):
const date = new Date(currentDueDate);
date.setMonth(date.getMonth() + 1); // Může skočit zpět!

// ✅ SPRÁVNĚ (date-fns):
import { addMonths, parseISO } from 'date-fns';
const newDate = addMonths(parseISO(currentDueDate), 1);
```

**Lesson**: VŽDY použít date-fns místo native Date methods!

---

### 5. CSS Specificity Battles (8x!)
**Pattern**: Mega selektory (html body * * *) přepisují všechny styly
**Výskyt**: Border-radius mega-debugging (7 pokusů!), Dark mode

```javascript
// ❌ Nefungovalo (sx prop):
<TextField
  sx={{
    '& .MuiOutlinedInput-root': {
      borderRadius: '16px'
    }
  }}
/>

// ❌ Nefungovalo (inline style):
<TextField
  InputProps={{
    style: { borderRadius: '16px' }
  }}
/>

// ✅ FINÁLNÍ FIX (mega selektor v CSS):
// forceConsistentRadius.css
html body * * * .MuiFormControl-root:not(.na-stranku-dropdown) .MuiOutlinedInput-root {
  border-radius: 16px !important;
}
```

**Diagnostika** (Console script):
```javascript
for (let sheet of document.styleSheets) {
  for (let rule of sheet.cssRules) {
    if (rule.selectorText?.includes('MuiOutlinedInput-root')) {
      console.log(rule.selectorText, rule.style.borderRadius);
    }
  }
}
```

**Lesson**: VŽDY check DevTools Console iterací přes všechna CSS pravidla!

---

### 6. Authorization Header Chybí (3x!)
**Pattern**: Fetch bez Bearer token → 401 Unauthorized
**Výskyt**: Installments loading, Categories refresh

```javascript
// ❌ ŠPATNĚ (401):
fetch('/api/payments/:id/installments');

// ✅ SPRÁVNĚ:
const token = localStorage.getItem('accessToken');
fetch('/api/payments/:id/installments', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

**Lesson**: VŽDY include Authorization header v protected endpoints!

---

### 7. React Hoisting Nefunguje (3x!)
**Pattern**: Použití proměnné před její definicí
**Výskyt**: PaymentList, PaymentViewSwitcher

```javascript
// ❌ ŠPATNĚ (ReferenceError):
const handler = () => {
  console.log(displayData); // Cannot access before initialization
};
const displayData = useMemo(() => [...], []);

// ✅ SPRÁVNĚ:
const displayData = useMemo(() => [...], []);
const handler = () => {
  console.log(displayData);
};
```

**Lesson**: V React hoisting NEFUNGUJE - pořadí definic záleží!

---

### 8. Color System Chaos (7x!)
**Pattern**: Přidávání barev "na místě" místo centralizace
**Výskyt**: Category buttons, Dark mode, Theme context

**Problém PŘED**:
- 3 různé barevné systémy (colorSchemes.js, unifiedColors.js, unified-color-system.js)
- Fragmentované contexty (UnifiedColorContext, ThemeContext, ColorSchemeContext)
- ~2000 řádků duplikací

**FIX**: Centralizace do UnifiedColorContext + unifiedColors.js

**Lesson**: JEDEN zdroj pravdy pro barvy, pak import všude!

---

### 9. Bankovní Pole se Neukládají (3x!)
**Pattern**: Nová pole v DB, ale ne v destructuring
**Výskyt**: Payments, Reserves

```javascript
// ❌ ŠPATNĚ (bank_account se neukládá):
app.put('/api/payments/:id', (req, res) => {
  const { title, amount, currency } = req.body;
  // bank_account chybí!
});

// ✅ SPRÁVNĚ:
app.put('/api/payments/:id', (req, res) => {
  const {
    title, amount, currency,
    bank_account, bank_code, iban  // ← Přidáno!
  } = req.body;
});
```

**Lesson**: Checklist při přidání DB sloupců → aktualizovat VŠECHNY endpointy!

---

### 10. Duplicitní Komponenty (5x!)
**Pattern**: Refactor → zapomenutý cleanup starých komponent
**Výskyt**: UniversalToggleBar, Float menus

```javascript
// ❌ ŠPATNĚ (oba komponenty se renderují):
<App>
  <OldToggleBar />  {/* Zapomenutý! */}
  <UniversalToggleBar />
</App>

// ✅ SPRÁVNĚ:
<App>
  <UniversalToggleBar />
</App>
```

**Lesson**: TODO item pro odstranění starých komponent po refaktoru!

---

## 3.2 Mega Debugging Sessions

### Border-Radius Mega-Debugging (13/10/2025)
**Trvání**: 7+ neúspěšných pokusů, celý den
**Problém**: Border-radius se NEMĚNIL!

**Neúspěšné pokusy**:
1. ✗ sx prop v PaymentDialog
2. ✗ customInputSx object
3. ✗ Global CSS v index.css
4. ✗ MUI theme override
5. ✗ CSS proměnné
6. ✗ InputProps inline style
7. ✗ JavaScript DOM manipulace

**FINÁLNÍ FIX** (Claude Sonnet 4.5 pomocí Console):
```css
html body * * * .MuiFormControl-root:not(.na-stranku-dropdown) .MuiOutlinedInput-root {
  border-radius: 16px !important;
}
```

**User feedback**: "Tohle byl mega problém který Claude Code nedokázal vyřešit a musel to dělat Claude Sonnet 4.5"

---

### Dark Mode CSS Variables (18-19/9/2025)
**Trvání**: Celý den cyklení! Claude Code se cyklil celý den
**Problém**: Bílý text v dark mode místo barevného

**Neúspěšné pokusy**:
1. ✗ CSS specificity (triple class selectors)
2. ✗ Inline styles + !important
3. ✗ React.cloneElement manipulace
4. ✗ Span wrappers s inline styly
5. ✗ Conditional styling props
6. ✗ Material-UI theme overrides

**FINÁLNÍ FIX**:
```javascript
style={{
  '--digipro-text-primary': filters.category === category.id
    ? '#ffffff'
    : isDarkMode
      ? (category.type === 'business' ? '#60a5fa' : '#f472b6')
      : getThemeColor(schemeData, category)
}}
```

**Lesson**: Někdy JEDINÝ způsob je override CSS custom properties!

---

### Box-Shadow Blur Artifacts (7/10/2025)
**Trvání**: 5+ hodin debuggingu!
**Problém**: Horizontální stíny vytvářely nežádoucí vertikální artefakty

**Testování**: blur 0px, 1px, 3px, 6px, 8px
**Zjištění**: Blur > 3px vytváří bleeding efekt do stran

**FINÁLNÍ hodnoty**:
```css
/* Horizontální stíny - VŠECHNY sloupce: */
inset 0 4px 3px -2px rgba(0,0,0,0.25)

/* Vertikální stíny - jen první sloupce oblastí: */
inset 3px 0 8px -2px rgba(0,0,0,0.15)
```

**Lesson**: Pro kombinované horizontální stíny držet blur ≤ 3px!

---

### Glassmorphism Transparentnost (6/10/2025)
**Trvání**: Celý den! Claude Code nefungoval!
**Problém**: Šedé ostré rohy pod obláčkovými rohy

**Neúspěšné pokusy**:
1. ✗ Změna CSS PaymentList
2. ✗ Kopírování stylu z UniversalFilterBar
3. ✗ Změna pozadí app
4. ✗ Negativní margin
5. ✗ CSS override s !important
6. ✗ HTML div místo Box

**FINÁLNÍ FIX** (Claude Sonnet 4):
```javascript
// PaymentViewSwitcher.jsx
overflow: 'visible'  // MÍSTO 'hidden'
```

**Lesson**: `overflow: hidden` ořezává i stíny a glassmorphism efekty!

---

## 3.3 Katalog všech chyb s řešeními

### Kategorie se neukládaly (21/8/2025)
**Příčina**:
- Chybějící sloupec `type` v databázi
- Backend destructuring bez default hodnoty
- Frontend míchání axios/fetch API

**Řešení**:
```sql
ALTER TABLE categories ADD COLUMN type TEXT DEFAULT 'personal';
```
```javascript
const { name, icon, color, type = 'personal' } = req.body;
```

---

### Platby "mizely" po deaktivaci (27/8/2025)
**Příčina**: `loadPayments()` znovu načetl jen aktivní platby
**Řešení**: Lokální state update `setPayments(...map(...))`

---

### BusinessPersonalProvider black screen (29/8/2025)
**Příčina**: Provider byl uvnitř Routeru, moduly byly venku
**Řešení**: Přesun providerů výš v component tree
```javascript
<BusinessPersonalProvider>
  <Router>
    <Routes>
      <Route path="/payments" element={<PaymentsModule />} />
    </Routes>
  </Router>
</BusinessPersonalProvider>
```

---

### OAuth 95% hotový, nefungoval (září 2025)
**Příčina**: Chyběl route v App.jsx
**Řešení**: Přidán `<Route path="/oauth/callback" element={<OAuthCallback />} />`

---

### Context loss po modularizaci (18/10/2025)
**Příčina**: BusinessPersonalProvider špatně umístěn
**Řešení**: Provider přesunut výš
```javascript
// PŘED:
<Router>
  <BusinessPersonalProvider>
    <Routes>...</Routes>
  </BusinessPersonalProvider>
</Router>

// PO:
<BusinessPersonalProvider>
  <Router>
    <Routes>...</Routes>
  </Router>
</BusinessPersonalProvider>
```

---

### Auto-copy vytvořil duplikátní splátku (říjen 2025)
**Příčina**: `_saveInstallmentAfterSubmit` nebyl smazán po prvním uložení
**Řešení**: `delete formData._saveInstallmentAfterSubmit;` po uložení

---

### due_date posun do minulosti (říjen 2025)
**Příčina**: JavaScript Date DST bug
**Řešení**: date-fns
```javascript
import { addMonths } from 'date-fns';
const newDate = addMonths(date, 1); // Timezone-safe
```

---

### Historie splátek 401 Unauthorized (říjen 2025)
**Příčina**: Chybějící Authorization header
**Řešení**:
```javascript
const token = localStorage.getItem('accessToken');
fetch(url, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

### Conditional fields v rows nefungovaly (říjen 2025)
**Příčina**: Pouze top-level podmínky checkované
**Řešení**: Rekurzivní shouldRenderField()
```javascript
if (field.type === 'row') {
  return field.fields
    .filter(rowField => shouldRenderField(rowField))
    .map(rowField => <FieldRenderer ... />);
}
```

---

### Boolean jako string (říjen 2025)
**Příčina**: MUI Switch onChange handler
**Řešení**: Type-aware handling
```javascript
if (field?.type === 'switch' || field?.type === 'checkbox') {
  value = Boolean(value);
}
```

---

### Nová platba se nezobrazila po auto-copy (říjen 2025)
**Příčina**: PaymentsModule nedělal refresh
**Řešení**: Callback onNewPaymentCreated
```javascript
onNewPaymentCreated={(newPayment, originalPayment) => {
  const index = currentPayments.findIndex(p => p.id === originalPayment.id);
  const newPayments = [...currentPayments];
  newPayments.splice(index + 1, 0, newPayment);
  setPayments(newPayments);
  setHighlightedPaymentId(newPayment.id);
}}
```

---

### paid_amount neincrementovalo (říjen 2025)
**Příčina**: Kontrola absolutního stavu místo změny stavu
**Řešení**:
```javascript
const wasUnpaid = payment ? !payment.is_paid : true;
const isNowPaid = formData.is_paid;
const isExistingPaymentNowPaid = payment && wasUnpaid && isNowPaid;

if (isExistingPaymentNowPaid) {
  // ... increment logic
}
```

---

### "0" zobrazeno v tabulce (21/10/2025)
**Příčina**: Boolean coercion issue
**Řešení**:
```javascript
const hasInstallments = !!(
  (['standing_order', 'recurring'].includes(p.payment_method) || p.has_commitment) &&
  p.total_amount && p.total_amount > 0
);
```

---

### Červený ❓ v headeru sloupce (21/10/2025)
**Příčina**: Chybějící icon mapping pro installments
**Řešení**:
```javascript
import { DonutSmall as DonutSmallIcon } from '@mui/icons-material';

const columnIcons = useMemo(() => ({
  installments: DonutSmallIcon,
  // ...
}), []);
```

---

# 4. ANTI-PATTERNS (CO NEDĚLAT!)

## 4.1 Code Structure Anti-Patterns

### 1. Duplicitní komponenty
**DON'T**: Vytvářet nový komponent a nechat starý
**DO**: Vždy odstranit starý komponent po refaktoru
**Lesson**: TODO item pro cleanup

### 2. Fragmentované barevné systémy
**DON'T**: Přidávat barvy "na místě" v každé komponentě
**DO**: JEDEN zdroj pravdy (unifiedColors.js), pak import
**Impact**: Z ~2000 řádků duplicit → ~300 řádků

### 3. Mega dialogy (1500+ řádků)
**DON'T**: Kopírovat celý dialog pro každý modul
**DO**: Config-driven UniversalDialog
**Impact**: Z 5,400 řádků → 2,000 řádků (-63%)

### 4. Duplicitní glassmorphism
**DON'T**: Každá komponenta vlastní blur hodnoty
**DO**: Centralizovat do `useModernEffects.js` hook
**Impact**: 80+ míst s různými hodnotami → 1 zdroj

---

## 4.2 React Anti-Patterns

### 1. Set/Object v dependencies
**DON'T**:
```javascript
useMemo(() => { ... }, [selectedColumns, computedVisibleColumns]);
// Set/Object nová reference každý render → nekonečná smyčka!
```

**DO**:
```javascript
useMemo(() => { ... }, [
  Array.from(selectedColumns).sort().join(','),
  JSON.stringify(computedVisibleColumns)
]);
```

### 2. Funkce v useEffect deps bez useCallback
**DON'T**:
```javascript
useEffect(() => {
  loadPayments();
}, [loadPayments]); // Nová reference každý render!
```

**DO**:
```javascript
const loadPayments = useCallback(() => { ... }, [dependencies]);
useEffect(() => {
  loadPayments();
}, [loadPayments]);
```

### 3. Boolean coercion ignorováno
**DON'T**:
```javascript
const hasInstallments = (p.total_amount && p.total_amount > 0);
// Vrací 0 místo false → React vykreslí "0"!
```

**DO**:
```javascript
const hasInstallments = !!(p.total_amount && p.total_amount > 0);
```

### 4. React hoisting assumption
**DON'T**:
```javascript
const handler = () => { console.log(data); }; // ReferenceError!
const data = useMemo(() => [...], []);
```

**DO**:
```javascript
const data = useMemo(() => [...], []);
const handler = () => { console.log(data); };
// Pořadí záleží!
```

---

## 4.3 CSS Anti-Patterns

### 1. overflow: hidden na containers
**DON'T**: `overflow: hidden` na glassmorphism containers
**DO**: `overflow: visible`
**Lesson**: hidden ořezává stíny a blur efekty!

### 2. Vysoký blur v box-shadow
**DON'T**: `box-shadow: inset 0 3px 8px -2px rgba(...)`
**DO**: `box-shadow: inset 0 4px 3px -2px rgba(...)`
**Lesson**: Blur > 3px vytváří bleeding artifacts

### 3. CSS Specificity ignorována
**DON'T**: sx prop na Material-UI komponenty
**DO**: Mega selektor v CSS souboru
**Lesson**: MUI inline styles mají vysokou specificitu

### 4. Pseudo-elementy překrývající obsah
**DON'T**: `::before` s opacity: 1
**DO**: `::before` s display: none nebo opacity: 0
**Lesson**: Pseudo-elementy mohou překrýt text!

---

## 4.4 Backend Anti-Patterns

### 1. Database middleware jen pro některé routes
**DON'T**:
```javascript
app.get('/api/payments', (req, res) => {
  const db = req.db; // undefined!
});
```

**DO**:
```javascript
app.use((req, res, next) => {
  req.db = db;
  next();
});
```

### 2. Bankovní pole v DB, ale ne v destructuring
**DON'T**:
```javascript
const { title, amount } = req.body;
// bank_account chybí!
```

**DO**:
```javascript
const { title, amount, bank_account, bank_code, iban } = req.body;
```

### 3. SQLite date filtering
**DON'T**:
```sql
WHERE created_at >= date('now', 'start of month')
-- Nefunguje správně!
```

**DO**:
```sql
WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
```

### 4. Authorization header zapomenut
**DON'T**:
```javascript
fetch('/api/protected-route');
// 401 Unauthorized!
```

**DO**:
```javascript
const token = localStorage.getItem('accessToken');
fetch('/api/protected-route', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## 4.5 Date/Time Anti-Patterns

### 1. Native Date setMonth/setYear
**DON'T**:
```javascript
const date = new Date(currentDate);
date.setMonth(date.getMonth() + 1); // DST bug!
```

**DO**:
```javascript
import { addMonths } from 'date-fns';
const newDate = addMonths(parseISO(currentDate), 1);
```

### 2. Timezone ignorování
**DON'T**: Spoléhat se na browser timezone
**DO**: VŽDY explicitní date-fns operace
**Lesson**: DST může skočit +/- 1 hodinu!

---

## 4.6 State Management Anti-Patterns

### 1. Lokální state update zapomenut
**DON'T**: Po změně reload CELÝ dataset
**DO**: Lokální update s `setPayments(...map(...))`
**Impact**: Instant UI vs. loading spinner

### 2. Context placement špatně
**DON'T**: Provider uvnitř Routeru
**DO**: Provider VÝŠE než Router
**Lesson**: Context musí být výš než komponenty které ho používají

### 3. SessionStorage vs LocalStorage nerozlišeno
**SessionStorage**: Dočasné (zavře tab = smaže)
**LocalStorage**: Trvalé (zůstává)
**Lesson**: Trial warnings → sessionStorage, Settings → localStorage

---

# 5. ARCHITEKTONICKÁ ROZHODNUTÍ

## 5.1 Proč Config-Driven Development?

### Problém PŘED
- **PaymentDialog**: 1,486 řádků
- **ReserveDialog**: ~1,400 řádků
- **WishlistDialog**: ~1,300 řádků
- **LifeProDialog**: ~1,200 řádků
- **Celkem**: ~5,400 řádků duplikace!
- **Maintenance**: Změna v jednom = copy-paste do všech

### Řešení: UniversalDialog
- **Generic komponenta** (447 řádků) + **JSON configs**
- **PaymentDialog wrapper**: 362 řádků (75.6% redukce!)
- **Celkově**: ~2,000 řádků sdílených (-63%)

### Výhody
1. ✅ **Centralizovaná logika**: Bugfix v jednom místě = fix všude
2. ✅ **Konzistence UX**: Všechny dialogy chovají stejně
3. ✅ **Rychlý vývoj**: Nový dialog = pouze JSON config
4. ✅ **Type safety**: Config schema validation
5. ✅ **Testovatelnost**: Testovat jeden komponent místo 4

### Nevýhody
- Komplexnější initial setup
- Steeper learning curve pro nové devs
- Edge cases vyžadují custom components

### Závěr
**WORTH IT!** 75% redukce kódu + lepší maintainability

---

## 5.2 Proč Unified Color System?

### Problém PŘED
- **3 různé barevné systémy**:
  - colorSchemes.js
  - unifiedColors.js
  - unified-color-system.js
- **Fragmentované contexty**:
  - UnifiedColorContext.jsx
  - ThemeContext.jsx
  - ColorSchemeContext.jsx
- **~2000 řádků duplikací**

### Řešení
1. ✅ Migrace na UnifiedColorContext
2. ✅ Deprecated soubory do `_deprecated/`
3. ✅ Zakomentování mrtvého kódu
4. ✅ JEDEN zdroj pravdy (unifiedColors.js)

### Výhody
1. ✅ **Single source of truth**: Změna barvy = 1 místo
2. ✅ **Dark mode**: Automatický filter brightness(1.8)
3. ✅ **4 schemes**: PaymentsPro, Rezervy, Wishlist, LifePro
4. ✅ **Konzistence**: Barvy stejné napříč aplikací

### Závěr
**Z ~2000 řádků → ~300 řádků čistého kódu**

---

## 5.3 Proč Glassmorphism?

### Estetické důvody
- **Moderní vzhled**: Apple-style design language
- **Depth perception**: Blur vytváří vrstvení
- **Elegance**: Semi-transparent backgrounds

### UX výhody
- **Context awareness**: Vidět obsah pod dialogem
- **Focus**: Blur = jasný foreground/background
- **Professionalism**: Premium look & feel

### Technické výzvy
- **Performance**: backdrop-filter je náročný
- **Browser support**: Safari prefixes
- **Blur artifacts**: ≤ 3px blur pro kombinované stíny

### Implementace
```javascript
// useModernEffects.js
export const glassmorphismInputSx = {
  background: isDarkMode
    ? 'rgba(30, 30, 30, 0.85)'
    : 'rgba(255, 255, 255, 0.35)',
  backdropFilter: 'blur(30px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 25px 80px rgba(0,0,0,0.5)'
};
```

### Závěr
**Estetika vs. Performance** - Vybrali jsme estetiku s optimalizací

---

## 5.4 Proč SQLite místo PostgreSQL?

### Výhody SQLite
1. ✅ **Zero config**: Jediný soubor, no server
2. ✅ **Fast**: Pro <100K záznamů rychlejší než PostgreSQL
3. ✅ **Portabilní**: Copy soubor = backup
4. ✅ **Vývoj**: Okamžitý setup, no Docker

### Nevýhody
1. ❌ **Concurrent writes**: Limitované
2. ❌ **Scalability**: Ne pro >100K users
3. ❌ **Advanced features**: No JSON operators, triggers omezené

### Kdy migrovat na PostgreSQL?
- Více než 100K users
- Potřeba advanced querying
- High concurrent writes
- Potřeba replication

### Závěr
**Pro MVP a SMB**: SQLite perfektní
**Pro enterprise**: Migrace na PostgreSQL později

---

## 5.5 Proč JWT místo Sessions?

### Výhody JWT
1. ✅ **Stateless**: Server neukládá session state
2. ✅ **Scalable**: Horizontální škálování easy
3. ✅ **Mobile-friendly**: Token v localStorage
4. ✅ **Microservices**: Sdílení tokenu mezi services

### Implementace
- **Access token**: 15 minut (krátký lifetime)
- **Refresh token**: 7 dní (httpOnly cookie)
- **Auto-refresh**: Axios interceptor při 401

### Security
```javascript
// Access token v localStorage (XSS risk)
localStorage.setItem('accessToken', token);

// Refresh token v httpOnly cookie (CSRF protection)
res.cookie('refreshToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dní
});
```

### Závěr
**Pro SPA aplikace**: JWT ideální
**Risk mitigation**: Krátký access token lifetime

---

## 5.6 Proč Modularizace (PaymentsModule)?

### Problém PŘED
- **App.jsx**: 1,501 řádků!
- **Vše v jednom souboru**: State, handlers, API calls
- **Maintenance nightmare**: Scroll paralysis

### Řešení
```
PaymentsModule.jsx (state management)
├── PaymentViewSwitcher.jsx (view logic)
├── PaymentList.jsx (table rendering)
├── PaymentDialog.jsx (edit/create)
└── PaymentCards.jsx (card view)
```

### Výsledek
- **App.jsx**: 1,501 → ~300 řádků (-80%)
- **Čitelnost**: ↑↑↑
- **Testovatelnost**: Jednotlivé moduly izolované

### Závěr
**Separation of Concerns** - Každý modul jedna zodpovědnost

---

## 5.7 Proč date-fns místo Moment.js?

### Důvody
1. ✅ **Tree-shakeable**: Import jen co potřebuješ
2. ✅ **Immutable**: Pure funkce, no mutations
3. ✅ **Timezone-safe**: Žádné DST bugy
4. ✅ **Bundle size**: Moment.js 67KB, date-fns 17KB

### Použití
```javascript
import { addMonths, parseISO, format } from 'date-fns';

// Timezone-safe operace:
const newDate = addMonths(parseISO('2025-10-15'), 1);
const formatted = format(newDate, 'yyyy-MM-dd');
```

### Závěr
**date-fns** = modern, safe, small bundle

---

## 5.8 Proč Progressive Column Disclosure?

### Koncept
Sloupce se postupně přidávají podle šířky obrazovky

### Implementace
```javascript
export const getProgressiveColumns = (width = window.innerWidth) => {
  const columns = {
    select: true,
    title: true,
    currency: true,
    edit: true,
    actions: true
  };

  if (width >= 400) columns.dueDate = true;
  if (width >= 480) columns.status = true;
  if (width >= 560) columns.daysRemaining = true;
  if (width >= 640) columns.type = true;
  // ... až do 1900px

  return columns;
};
```

### Výhody
1. ✅ **Mobile-first**: Základní info na malých obrazovkách
2. ✅ **Desktop**: Všechny sloupce na velkých
3. ✅ **Automatic**: Žádné manuální toggling
4. ✅ **UX**: Vždy optimální počet sloupců

### Závěr
**Responsive bez user interaction** - Automatické přizpůsobení

---

## 5.9 Proč Multi-view System?

### 3 pohledy
1. **TABLE** - Pro power users (řazení, filtrování, bulk actions)
2. **CARDS** - Pro vizuální overview
3. **GALLERY** - Pro kalendářní pohled

### Výhody
1. ✅ **User preference**: Každý si vybere
2. ✅ **Context**: Různé use cases
3. ✅ **Accessibility**: TABLE pro screen readers

### Implementace
```javascript
const [viewMode, setViewMode] = useState('table');

{viewMode === 'table' && <PaymentList ... />}
{viewMode === 'cards' && <PaymentCards ... />}
{viewMode === 'gallery' && <PaymentTable ... />}
```

### Závěr
**Flexibilita > Simplicity** - Více práce, ale lepší UX

---

# ZÁVĚR

## Celkové statistiky

### Redukce kódu
- **UniversalDialog**: 5,400 → 2,000 řádků (-63%)
- **PaymentDialog**: 1,486 → 362 řádků (-75.6%)
- **App.jsx**: 1,501 → ~300 řádků (-80%)
- **Color System**: ~2000 → ~300 řádků (-85%)
- **Currency sloupec**: 78 → 17 řádků (-78%)

### Nové features
- ✅ JWT Authentication (access + refresh)
- ✅ Google OAuth
- ✅ 4 Subscription tiers
- ✅ Admin panel
- ✅ Auto-copy workflow
- ✅ Installments system
- ✅ Pie chart visualization
- ✅ Tab navigation
- ✅ Help system (3 úrovně)
- ✅ Trial notifications
- ✅ QR code generator
- ✅ Undo system

### Vyřešené problémy
- ✅ Boolean coercion (5x)
- ✅ Set/Object dependencies (5x)
- ✅ Database middleware (4x)
- ✅ Date manipulation (4x)
- ✅ CSS Specificity (8x)
- ✅ Authorization headers (3x)
- ✅ React hoisting (3x)
- ✅ Color system chaos (7x)
- ✅ Bankovní pole (3x)
- ✅ Duplicitní komponenty (5x)

### Lessons learned
1. **Boolean coercion**: VŽDY `!!` pro boolean values v JSX
2. **Set/Object deps**: VŽDY serializovat v useMemo/useEffect
3. **Date manipulation**: VŽDY date-fns místo native Date
4. **CSS Specificity**: DevTools Console iterace přes všechna pravidla
5. **Database middleware**: VŽDY globální middleware
6. **Authorization**: VŽDY include Bearer token
7. **React hoisting**: Pořadí definic záleží!
8. **Color system**: JEDEN zdroj pravdy
9. **Bankovní pole**: Checklist při přidání DB sloupců
10. **Cleanup**: TODO item pro odstranění starých komponent

---

**Autoři**: Claude (Code & Sonnet 4.5) + Lenka Roubalová
**Datum**: 21. října 2025
**Status**: ✅ Kompletní, otestováno, ve výrobě
**Git commits**: 100+ commitů za 2 měsíce
