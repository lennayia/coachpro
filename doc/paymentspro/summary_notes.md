# Summary Notes - Strukturované poznámky pro Summary1

## Metadata
- **Datum analýzy**: 21.10.2025
- **Zdrojový soubor**: summary.md (19,855 řádků)
- **Cíl**: Vytvořit summary1.md s kompletní historií projektu

## 📋 Cílová struktura Summary1.md
1. **ARCHITEKTURA & STRUKTURA** - Jak je projekt postavený, komponenty, role
2. **HLAVNÍ FEATURY** (chronologicky) - Co jsme implementovali a jak
3. **KRITICKÉ CHYBY & ŘEŠENÍ** - Opakující se chyby, příčiny, řešení
4. **ANTI-PATTERNS** - Co NEDĚLAT a proč
5. **ARCHITEKTONICKÁ ROZHODNUTÍ** - Proč jsme zvolili určitý přístup, důsledky

---

## ČÁST 1: Základní architektura (řádky 1-2000)

### Tech Stack
- **Frontend**: React 18 + Vite + Material-UI
- **Backend**: Node.js + Express + SQLite3
- **Auth**: JWT (access + refresh tokens), Google OAuth
- **Email**: Resend service
- **Date handling**: date-fns

### Klíčové komponenty (řádek ~30-60)
- `PaymentViewSwitcher.jsx` - Main component
- `PaymentTable.jsx` - Excel-like table
- `PaymentCards.jsx` - Card view
- `PaymentDialog.jsx` - Add/Edit dialog
- `PaymentsList.jsx` - List view

### První iterace - Notifikační systém (řádek ~450)
- Implementace NotificationContext
- Zvukové notifikace s `/public/sounds/notification.mp3`
- Nahrazení alert() systému
- Problem: CategoryManager nedokončený (řádek 474)

### Auth systém (řádek ~585-844)
- JWT access (15 min) + refresh (7 dní)
- Google OAuth implementace
- Forgot password flow
- Problem: OAuth 95% hotový, chyběl route (řádek 953)

---

## ČÁST 2: Kritické chyby a opravy

### CHYBA 1: Kategorie se neukládaly (řádek ~988-1216)
**Datum**: 21.8.2025
**Problém**: HTTP 500 při PUT `/api/categories/:id`
**Příčina**:
  - Chybějící sloupec `type` v databázi
  - Backend destructuring bez default hodnoty
  - Frontend míchání axios/fetch API
**Řešení**:
  - `ALTER TABLE categories ADD COLUMN type TEXT DEFAULT 'personal'`
  - `const { name, icon, color, type = 'personal' } = req.body;`
  - Pure axios místo axios+fetch mix

### CHYBA 2: Platby "mizely" po deaktivaci (řádek ~1221-1245)
**Datum**: 27.8.2025
**Problém**: Po zneaktivnění platba zmizela z přehledu
**Příčina**: `loadPayments()` znovu načetl jen aktivní platby
**Řešení**: Lokální state update `setPayments(...map(...))`

### CHYBA 3: Auto token refresh (řádek ~1235-1240)
**Problém**: 403 Forbidden po vypršení accessToken
**Řešení**: Axios interceptor s `/api/auth/refresh`

---

## ČÁST 3: Priority systém & Business/Personal toggle (řádek ~1325-1450)

### Priority System (29/8/2025)
- **Změna škály**: 1-10 → 1-3 (Low/Medium/High)
- **Color coding**: Green (1), Orange (2), Red (3)
- **Default**: 1 (Low) místo 3
- **Anti-pattern**: Původní škála 1-10 byla příliš granulární

### Toggle systém
- **3-button toggle**: All/Personal/Business
- **CHYBA**: BusinessPersonalProvider byl špatně umístěný → black screen
- **FIX**: Provider přesunut výš v component tree

### Czech Banks Integration
- **45 českých bank** s kódy a názvy
- Soubor `czechBanks.js`
- Dual UX: manual input + dropdown

---

## ČÁST 4: Kritické opravy - Render loops & Mobile (řádek ~1250-1640)

### OPAKUJÍCÍ SE CHYBA: Nekonečné renderování
**Výskyt**: PaymentList, PaymentCards, PaymentTable
**Příčina**: Funkce v dependency arrays bez useCallback
**Řešení**:
```javascript
const loadPayments = useCallback(() => { ... }, [dependencies]);
```
**Pattern**: VŽDY wrap funkce v useCallback když jsou v useEffect deps

### Archive systém (29/8/2025)
- Toggle-based UI (same button, different states)
- **CHYBA**: `is_archived` chybělo v PUT endpoint
- **FIX**: Přidáno do destructuring, SQL UPDATE, params array

### Mobile responsiveness
- **Breakpoint změna**: 900px → 768px
- **Cards layout**: sm={6} → sm={12} (1 karta místo 2)
- **Touch targets**: Min 44px

---

## ČÁST 5: Rezervy systém (řádek ~1750-1953)

### Kompletní CRUD rezerv (30/8/2025)
- Progress tracking s vizuálními bary
- Automatické výpočty měsíčních příspěvků
- QR kód pro platby (Czech SPAYD formát)
- Transakční historie

### OPAKUJÍCÍ SE PATTERN: Bankovní údaje se neukládaly
**Stejný problém jako u plateb!**
**Příčina**: POST/PUT endpointy neměly bankovní pole v destructuring
**Řešení**: Přidat všechna pole do server.js
**Lesson learned**: Zkontrolovat VŠECHNY endpointy při přidání nových polí

---

## ČÁST 6: Subscription & OAuth systém (řádek 1953-4140, září 2025)

### KRITICKÁ IMPLEMENTACE: Role-based auth (4/9/2025)
- **Admin role**: Vidí vše pro debugging
- **User role**: Jen svoje rozhraní
- **OPAKUJÍCÍ SE CHYBA**: Database middleware chybí
  - **Příčina**: `req.db` pouze pro specific routes, ne globální
  - **FIX**: `app.use((req, res, next) => { req.db = db; next(); })`
  - **Pattern**: VŽDY set global middleware pro DB

### 4 subscription tiers
- Free (5 plateb/měsíc), Basic (20), Business (unlimited), Enterprise
- **CHYBA**: Plan limits se nevynutily
- **Řešení**: Middleware `checkPaymentLimits` před POST /api/payments

### OPAKUJÍCÍ SE PROBLÉM: Autentizační redirect (3h debugging!)
**Příčina**: Chyběl explicit `navigate('/')` v LoginForm
**FIX**: Přidán useNavigate + redirect po login
**Lesson**: VŽDY explicit redirect po auth action

### OAuth implementace
- Google OAuth ✅ funkční
- Apple OAuth 🚧 připraveno (vyžaduje Apple Dev account $99/rok)

### Stripe payment system
- Kompletní payment flow
- **UpgradePrompt** banner pro free users
- **PROBLÉM**: Stripe API klíč placeholder
- **Status**: UI funguje, čeká na reálný klíč

---

## ČÁST 7: Admin systém & Plan enforcement (září 2025)

### Bulk operace pro admin
- Hromadná aktivace/deaktivace uživatelů
- Změna rolí, export CSV, mazání
- **Audit logging** všech admin akcí

### Plan limits enforcement - KRITICKÁ FEATURE
**SQL bug oprava**:
```sql
-- ŠPATNĚ (nefunguje):
WHERE created_at >= date('now', 'start of month')

-- SPRÁVNĚ:
WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
```

### Usage Dashboard
- Real-time tracking limitů
- Progress bary s color coding (zelená/oranžová/červená)
- Warning při 80%+ limitu
- Error při >100%

### OPAKUJÍCÍ SE PATTERN: SQLite serialization
**Problém**: Database objekty místo plain objektů
**Fix**: Explicitně konvertovat DB rows na plain objects
**Pattern**: Vždy use `JSON.parse(JSON.stringify(rows))` nebo spread

---

## ČÁST 8: Rezervy vylepšení (5/9/2025)

### Nová pole
- `company_name` - název firmy (nepovinné)
- `purchase_url` - odkaz na nákup

### OPAKUJÍCÍ SE BUG: Data persistence
**Symptomy**: Nová pole se neuložila do DB
**Debug process**:
1. Přidán console.log v backend
2. Ověřena SQL migrace
3. Zjištěno: Frontend neposílal pole
4. **FIX**: Přidat pole do dialogu + API payload

### Table features
- Column management (toggle visibility)
- Pagination (Material-UI)
- Responsive column display

---

## ČÁST 9: UI Refaktoring - Toggle bars & Float menu (7/9/2025)

### UniversalToggleBar systém
- **Cíl**: Konzistentní toggle bary napříč aplikací
- **Implementace**: UniversalToggleBar + PageModeContext
- **Animace timeout**: 10 sekund místo nekonečně (citliví uživatelé)

### OPAKUJÍCÍ SE PROBLÉM: Duplicitní komponenty
**Symptomy**: Staré i nové komponenty se zobrazují současně
**Příčina**: Nedokončený cleanup po refaktorování
**Pattern**: VŽDY odstranit staré instance po přidání nových

### Float menu refaktoring
- Přesun settings menu z top-right → bottom-right
- Auto-zavírání menu systém (koordinace přes App.jsx)
- **PROBLÉM**: Komunikační nedorozumění o zarovnání
- **Lesson**: Konkrétní pixel hodnoty > slovní popisy

### Custom ikona PaymentsIcon
- Nahrazení emoji 💰 za SVG s platební kartou
- **Size**: 64px s glow efekty
- Integration s DigiPro color scheme

---

## ČÁST 10: Table Responsiveness & Border-radius (zář

í 2025)

### KRITICKÝ PROBLÉM: Table layout nefungoval
**Iterace 1**: Skrývání sloupců - nedostatečné
**Iterace 2**: Procentuální šířky - statická tabulka
**Iterace 3**: localStorage override - konflikt s dynamikou
**Iterace 4**: ✅ `table-layout: fixed` + procenta = FUNGUJE

**Lesson**: Kombinace CSS vlastností je kritická
```css
table-layout: fixed;  /* Klíč k natahovací tabulce */
width: 100%;
```

### Border-radius unifikace
**Problém**: Nekonzistentní zakulacení napříč UI
**Řešení**: Centrální !important overrides pro MUI
**Anti-pattern**: Material-UI inline styles mají vysokou specifičnost

---

## ČÁST 11: Color system refaktoring (září 2025)

### OPAKUJÍCÍ SE MEGA PROBLÉM: Barevný systém 🔥
**Symptomy**: Nečitelné barvy v dark mode, duplikace kódu
**Iterací**: Minimálně 6-7 pokusů o fix
**Příčiny**:
1. Duplicitní color definice (4-5 míst!)
2. UnifiedColorContext vs. DigiProThemeContext konflikty
3. Dark mode override nekonzistentní
4. Glassmorphism duplikace všude

### Finální refaktoring (20-21/9/2025)
**Řešení**:
- Centralizace do `unifiedColors.js`
- Filter brightness(1.8) pro dark mode
- Odstranění 90% duplikací
- Konzistentní gradient system

**KRITICKÁ LESSON**:
- JEDINÝ zdroj pravdy pro barvy
- VŽDY začít refaktorem PŘED přidáním features
- Duplikace = technický dluh exponenciálně roste

---

## ČÁST 12: Latest fixes (říjen 2025)

### Highlighting system
**Feature**: Zvýraznění nově přidané platby
**PROBLÉM**: Řazení rozbilo highlighting
**FIX**: Skip reload param + setHighlightedPaymentId před data insert

### Pagination padding
**Problém**: Nekonzistentní spacing
**Řešení**: Glassmorphism wrapper + responzivní padding

### Port conflict
**CHYBA**: Backend běžel na 3001, konflikt
**FIX**: Změna na port 3002

---

## 🎯 TOP OPAKUJÍCÍ SE CHYBY (CRITICAL!)

### 1. Database middleware chybí (4x!)
**Pattern**: `req.db` jen pro specific routes
**FIX**: VŽDY globální middleware

### 2. Bankovní pole se neukládají (3x!)
**Pattern**: Nová pole v DB, ale ne v destructuring
**FIX**: Checklist při přidání polí do všech endpointů

### 3. Duplicitní komponenty (5x!)
**Pattern**: Refactor → zapomenutý cleanup
**FIX**: TODO item pro odstranění starých

### 4. Color system chaos (7x!)
**Pattern**: Přidávání barev "na místě" místo centralizace
**FIX**: JEDEN zdroj pravdy, pak import

### 5. Nekonečné renderování (4x!)
**Pattern**: Funkce v useEffect deps bez useCallback
**FIX**: VŽDY wrap v useCallback

### 6. Auth redirect chybí (3x!)
**Pattern**: Login úspěšný, ale bez explicit navigate
**FIX**: useNavigate + redirect po každé auth action

---



## ČÁST 13-17: Kompletní přehled (září-říjen 2025)

### Dark mode CSS variables fix (18/9/2025 - celý den!)
- Problém s bílými texty v dark mode  
- 7+ neúspěšných pokusů
- Finální fix: Override `--digipro-text-primary`

### Responzivní tabulka - Progressive disclosure (říjen 2025)
- 6 iterací než fungovalo
- Finální pattern: getProgressiveColumns()
- Postupné přidávání sloupců podle šířky

### UniversalDialog refaktoring (říjen 2025)
- 5,400 → 2,000 řádků kódu
- Config-driven systém
- 75% redukce duplikace

### Auto-copy & Installments (říjen 2025)
- Automatické kopírování plateb
- Historie splátek s vizuálním trackingem
- SVG pie chart (28×28px)

---



## POZNÁMKY: sum_5995-7936 (detailně přečteno)

### MEGA PROBLÉM: Dark mode CSS variables (18-19/9/2025)
**Celý den cyklení!** Claude Code se cyklil celý den, nefungoval!

**Symptomy**: Bílý text v dark mode místo barevného
**Pokusů**: 7+ různých přístupů
**Neúspěšné**:
1. ✗ CSS specificity (triple class selectors) 
2. ✗ Inline styles + !important
3. ✗ React.cloneElement manipulace
4. ✗ Span wrappers s inline styly
5. ✗ Conditional styling props
6. ✗ Material-UI theme overrides

**FINÁLNÍ FIX** (konečně funguje!):
```javascript
style={{
  '--digipro-text-primary': filters.category === category.id
    ? '#ffffff'  
    : isDarkMode
      ? (category.type === 'business' ? '#60a5fa' : '#f472b6')
      : getThemeColor(schemeData, category)
}}
```

**LESSON**: Někdy JEDINÝ způsob je override CSS custom properties!

---

### MEGA REFAKTORING: Barevný systém (20-21/9/2025)

**Problém před**: 3 různé barevné systémy!
- colorSchemes.js (starý)
- unifiedColors.js (nový)
- unified-color-system.js (další)

**Fragmentované contexty**:
- UnifiedColorContext.jsx (aktivní)
- ThemeContext.jsx (starý)
- ColorSchemeContext.jsx (starý)

**Provedeno**:
1. ✅ Migrace všech komponent na UnifiedColorContext
2. ✅ Přesun deprecated souborů do _deprecated/
3. ✅ Zakomentování ~2000 řádků mrtvého kódu
4. ✅ Sjednocení na JEDEN zdroj pravdy

**Výsledek**: Z ~2000 řádků duplicit → ~300 řádků čistého kódu

---

### Glassmorphism duplicity analýza (21/9/2025)

**Nalezeno**: 80+ míst s blur efekty!
**Různé hodnoty**: 8px, 10px, 15px, 20px, 25px, 30px
**Animace**: 485 výskytů napříč 46 soubory!

**Plán modularizace** (připraveno, ale nerealizováno):
```javascript
// config/modernEffects.js
export const glassmorphism = {
  light: { backdrop: 'blur(20px)', background: 'rgba(255,255,255,0.1)' },
  strong: { backdrop: 'blur(30px)', background: 'rgba(255,255,255,0.15)' },
  subtle: { backdrop: 'blur(10px)', background: 'rgba(255,255,255,0.05)' }
}
```

---

### Performance fix - Duplicitní API volání (21/9/2025)

**Problém**: React Strict Mode → double mounting → duplicitní API calls
**Před**: 6+ API volání při načtení
**Po**: 4 optimální volání

**Opravy**:
1. React Strict Mode vypnut (dočasně)
2. useEffect logika opravena
3. Vite cache vyčištěna

---

## ANTI-PATTERNS z této části:

### 1. CSS Custom Properties ignorovány
Přidávání inline styles místo použití existujících CSS vars

### 2. Fragmentované barevné systémy
3 různé systémy dělaly totéž → maintenance nightmare

### 3. Duplicitní glassmorphism
Každá komponenta vlastní blur hodnoty

### 4. React Strict Mode debugging
Zapomenutý v produkci → fake performance issues

---



## POZNÁMKY: sum_7937-9942 (detailně přečteno ✅)

### Glassmorphism modernizace (22/9/2025)
**Feature**: Centralizace modern effects do useModernEffects.js
**Před**: 80+ blur definitions duplicitních
**Po**: Centrální hook systém
**Výsledek**: Aplikace moderních efektů na 26 polí v PaymentDialog

### Auto-copy & paid_date implementation (27/9/2025)
**Backend migrace**:
```sql
ALTER TABLE payments ADD COLUMN paid_date DATETIME;
ALTER TABLE payments ADD COLUMN auto_copy_enabled INTEGER DEFAULT 0;
```

**Frontend**: Switch pro auto-copy + TextField pro paid_date (podmíněné renderování)

---

### OPAKUJÍCÍ SE PROBLÉM: Ikony hlavičky měly špatnou barvu
**Symptom**: Černé ikony místo primary
**Příčina**: `color: 'inherit'` v TableSortLabel dědilo špatně
**FIX**: Explicitní `color: colors.primary`
**Lesson**: TableSortLabel má vlastní logiku pro barvy

---

### Highlighting & řazení konflikt (27/9/2025)
**Problém**: Nově přidaná platba nebyla zvýrazněná kvůli řazení
**Příčina**: `loadPayments()` se zavolal před `setHighlightedPaymentId`
**FIX**: 
- Řešení: Úplné přeskočení řazení když je highlightedPaymentId aktivní
- Řešení: Přidán parametr skipReload do handleCreatePayment()
- Řešení: Vkládání dat a nastavení highlighting současně

---

### KRITICKÁ oprava řazení (28/9/2025)
**MEGA PROBLÉM**: Řazení fungovalo JEN na aktuální stránce!
**Příčina**: 
1. Řazení se přeskakovalo při highlightedPaymentId
2. Špatná logika porovnávání (null values nezpracovány)

**FIX**:
```javascript
// OPRAVENO:
// 1. Odstraněno přeskakování řazení
// 2. Handling null hodnot ve sort funkci
// 3. České locale: localeCompare('cs-CZ') pro diakritiku
// 4. Specializované řazení pro currency (amount pole)
// 5. Specializované řazení pro paymentMethod (logické pořadí)
// 6. Specializované řazení pro bankAccount (kod+cislo)
```

---

### Responzivita - finální vyladění (29-30/9/2025)
**Problém**: Komponenty neměly konzistentní padding
**Iterací**: Minimálně 4-5 pokusů

**Finální hierarchie**:
```
PaymentViewSwitcher (px: 2)
└── Child komponenty
    ├── Glassmorphism wrapper (py: 1.5, žádný px)
    └── Vnitřní obsah (px: 2)
```

**Breakpointy**:
- >770px: px: 2, py: 1.5
- ≤770px: px: 1, py: 1
- ≤640px: px: 0.5, py: 0.5
- ≤400px: px: 0.5, py: 0.5

**Checkbox sloupec**: Fixní 40px šířka

---

## ANTI-PATTERNS z této části:

### 1. Duplicitní glassmorphism
Každá komponenta vlastní blur hodnoty → centralizováno do hooku

### 2. color: 'inherit' v MUI
TableSortLabel má vlastní logiku, `inherit` nefunguje jak čekáme

### 3. Řazení jen na page
Zapomenutí na global sort → data se řadila jen v displayedPayments

### 4. Null handling v sort
Nezpracované null/undefined → špatné pořadí

### 5. Padding hierarchie
Duplicitní px padding na více úrovních → vizuální chaos

---



## POZNÁMKY: sum_9944-12037 (detailně přečteno ✅) - 2094 řádků

### OPAKUJÍCÍ SE MEGA PROBLÉM: Nekonečné smyčky v useMemo/useEffect (30/9/2025)
**Celkem 5 různých problémů\!**

#### Problem 1: Nekonečná smyčka - Set/Object v dependencies
**Příčina**: `selectedColumns` (Set) a `computedVisibleColumns` (Object) v dependencies
**FIX**: 
```javascript
// ❌ ŠPATNĚ:
}, [selectedColumns, computedVisibleColumns, columnOrder]);

// ✅ SPRÁVNĚ:
}, [Array.from(selectedColumns).sort().join(','), JSON.stringify(computedVisibleColumns), columnOrder]);
```

#### Problem 2: Duplicate imports
**Příčina**: `VisibilityOff` a `Visibility` importovány 2x
**FIX**: Použít aliases místo duplicitního importu

#### Problem 3: Variable naming konflikt
**Příčina**: Lokální `visibleColumns` zastínil externí props
**FIX**: Přejmenovat na `computedVisibleColumns`

#### Problem 4: Nekonečná smyčka při resize
**Příčina**: `screenWidth` v deps měnil hodnotu každý pixel\!
**FIX**: `Math.floor(screenWidth / 100) * 100` - změna jen po 100px

#### Problem 5: Priorita logiky sloupců
**Problém**: Responzivní tlačítko vs Eye button konflikt
**FIX**: `columnsToUse = externalVisibleColumns || computedVisibleColumns`

**LESSON**: Set a Object v dependencies VŽDY serializovat\!

---

### Hierarchické menu pro správu sloupců (5/10/2025)
**Feature**: Expandovatelné oblasti s počítadly
```
ZÁKLADNÍ ▶ 2/5  [👁] [↻]
├─ ☑ Název
├─ ☐ Firma
└─ ☑ Částka
```

**Funkce**:
- Ikona oka: toggle celé oblasti
- Ikona reset: obnovit default sloupce oblasti
- Checkboxy: individuální kontrola

---

### Undo systém (6/10/2025)
**Feature**: Ctrl+Z pro vrácení akcí zpět
**Implementation**:
```javascript
const [undoStack, setUndoStack] = useState([]);

useEffect(() => {
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      performUndo();
    }
  };
  window.addEventListener('keydown', handleKeyDown);
}, [undoStack]);
```

**Funguje pro**: archive, activate, deactivate, hide
**Nezvratné**: delete

---

### KRITICKÁ oprava: Aktivace archivovaných plateb (6/10/2025)
**Problém**: Tlačítko "Aktivovat" neodarchivovalo platby\!
**Příčina**: Chyběla podmínka `|| payment.is_archived`
**FIX**:
```javascript
// PŘED:
if (payment && \!payment.is_active) { ... }

// PO:
if (payment && (\!payment.is_active || payment.is_archived)) {
  updatedPaymentData = {
    is_active: true,
    is_archived: false,  // ← KLÍČ\!
    is_permanently_archived: false
  };
}
```

---

### Glassmorphism transparentnost issues (6/10/2025)
**Problém**: Šedé ostré rohy pod obláčkovými rohy
**Debugging**: Celý den\! Claude Code nefungoval\!
**Neúspěšné pokusy**:
1. ✗ Změna CSS PaymentList
2. ✗ Kopírování stylu z UniversalFilterBar
3. ✗ Změna pozadí app
4. ✗ Negativní margin
5. ✗ CSS override s \!important
6. ✗ HTML div místo Box

**FINÁLNÍ FIX (Claude Sonnet 4)**: 
```javascript
// PaymentViewSwitcher.jsx
overflow: 'visible'  // MÍSTO 'hidden'
```

**LESSON**: `overflow: hidden` ořezává i stíny a glassmorphism efekty\!

---

### Box-shadow blur artifacts (7/10/2025)
**MEGA DEBUGGING - 5+ hodin\!**

**Problém**: Horizontální stíny vytvářely vertikální artefakty
**Příčina**: Blur > 3px vytváří "bleeding" efekt do stran
**Řešení**:
```css
/* PŘED (blur 8px - nefunguje): */
box-shadow: inset 0 3px 8px -2px rgba(0,0,0,0.12);

/* PO (blur 3px - funguje): */
box-shadow: inset 0 4px 3px -2px rgba(0,0,0,0.25);
```

**LESSON**: Pro kombinované horizontální stíny držet blur ≤ 3px\!

---

## ANTI-PATTERNS z této části:

### 1. Set/Object v useMemo dependencies
Způsobuje nekonečné smyčky → VŽDY serializovat

### 2. Variable naming conflicts
Lokální proměnná zastíní props → používat prefix (computed, local, etc.)

### 3. screenWidth v každém pixelu
Změna hodnoty při každém resize → throttle nebo round to 100px

### 4. overflow: hidden na containers
Ořezává stíny a efekty → použít overflow: visible

### 5. Vysoký blur v box-shadow
Vytváří bleeding artifacts → držet ≤ 3px pro kombinované stíny

### 6. Zapomenout na archivované platby
Podmínky jen na is_active → VŽDY check i is_archived

---



## POZNÁMKY: sum_12038-13882 (detailně přečteno ✅) - 1844 řádků

### Modernizace paginace (7/10/2025)

**Glassmorphism efekty**:
```javascript
.MuiPaginationItem-root {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border-radius: 16px; // User změnil z 18px
}
```

**Pseudo-elementy**:
- `::before` - gradient overlay (opacity 0 → 1 při hover)
- `::after` - ripple efekt (expanduje při hover)

**KRITICKÝ PROBLÉM**: Bílý text v selected stavu (10+ pokusů!)
**Neúspěšné**:
1. ✗ `color: white !important`
2. ✗ Agresivnější CSS selektory
3. ✗ ThemeProvider approach
4. ✗ CSS proměnné `--wl-text`

**FINÁLNÍ FIX (Claude Sonnet 4.5)**:
```javascript
'&::before': { opacity: '0 !important', display: 'none !important' },
'&::after': { opacity: '0 !important', display: 'none !important' }
```
**Příčina**: Pseudo-elementy překrývaly text!

---

### Box-shadow blur artifacts - MEGA DEBUGGING (7/10/2025)
**5+ hodin debuggingu!**

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

**LESSON**: Pro kombinované horizontální stíny držet blur ≤ 3px!

---

### Help systém - Kompletní implementace (7-8/10/2025)

**3 úrovně nápovědy**:
1. **PaymentTableHelp.jsx** (357 řádků) - Kontextová nápověda k tabulce
2. **HelpPage.jsx** (540 řádků) - Globální nápověda (/help route)
3. **AboutPage.jsx** (380 řádků) - O aplikaci (/about route)

**Funkce**:
- Real-time vyhledávání
- Accordion sekce (11 sekcí v každé)
- Barevné ikony podle typu (feature, action, filter, priority, tip)
- Glassmorphism design
- Dark/Light mode

**LogoFloatMenu rozšíření**:
- Z přímého linku → rozbalovací menu s 5 akcemi
- Zoom animace, Fade efekt
- Backdrop overlay

---

### OPAKUJÍCÍ SE PROBLÉM: Filter category persistence (9/10/2025)

**Symptomy**: Po změně status filtru zůstával category filtr aktivní
**Příčina**: `clearAllFilters()` neresetovala `category`
**FIX**:
```javascript
onFilterChange({
  search: '',
  status: 'all',
  category: 'all',  // ← CHYBĚLO!
  period: 'all',
  //...
});
```

---

### Animace ikona - Unifikace (9/10/2025)

**Problém**: 13 nepoužitých importů ikon, špatná viditelnost
**Řešení**: Pouze `DonutLarge` ikona

**Vylepšení viditelnosti**:
```javascript
// PŘED:
opacity: animationsDisabled ? 0.3 : 0.9

// PO:
opacity: animationsDisabled ? 0.85 : 0.9
filter: animationsDisabled 
  ? 'contrast(1.5) brightness(1.1)'  // ← Přidáno!
  : 'drop-shadow(...)'
```

---

### Help ikony - Kompletní standardizace (9/10/2025)

**Referenční pattern**:
```javascript
{
  width: '44px',
  height: '44px',
  padding: '2px',
  borderRadius: '15px',
  fontSize: '2.4rem',
  '&::before': { /* gradient background */ },
  '&::after': { /* radial glow */ },
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.05) translateY(-2px)'
  },
  '&:active': {
    transform: 'scale(0.95) translateY(1px)'
  }
}
```

**Aplikováno**: UFB, UTB, PaymentList - všechny stejné!

---

### UniversalToggleBarHelp - Dialog místo stránky (9/10/2025)

**ZMĚNA**: Z navigate('/help?section=panel4') → Dialog
**Důvod**: Konzistence s UFB a PaymentList

**Vylepšení**:
- Pořadová čísla místo "1/10" → jen "1"
- Backdrop průhlednost: 40% + blur(8px)
- Plně neprůhledné pozadí dialogu pro čitelnost
- Mobilní optimalizace (padding: 3 → 1.5)
- 56 detailních bodů (vs původních 6!)

---

## ANTI-PATTERNS z této části:

### 1. Pseudo-elementy překrývající obsah
**Problem**: `::before` s opacity: 1 překrýval text v pagination
**Lesson**: VŽDY check z-index a display u pseudo-elementů

### 2. Box-shadow s vysokým blur
**Problem**: Blur > 3px vytváří bleeding artifacts
**Lesson**: Kombinované stíny max 3px blur

### 3. Filter kategorie zapomenut v reset
**Problem**: clearAllFilters() nemazal všechny filtry
**Lesson**: VŽDY check všechna filter pole

### 4. Nekonzistentní help systém
**Problem**: Některé nápovědy Dialog, jiné navigace
**Lesson**: Unifikovat UX pattern napříč aplikací

### 5. Opacity příliš nízká (0.3)
**Problem**: Ikona špatně viditelná
**Lesson**: Min opacity 0.7-0.85 pro interaktivní prvky

---



## POZNÁMKY: sum_13883-15956 (detailně přečteno ✅) - 2072 řádků

### Unifikace nápověd - Dialog systém (9-10/10/2025)

**MEGA REFAKTORING**: Všechny help komponenty na Dialog
**Před**: UTB měl samostatnou stránku (/help?section=panel4)
**Po**: Dialog konzistentní s UFB a PaymentList

**Změny**:
- Backdrop: 40% průhlednost (ze 95-98%)
- Dialog pozadí: 100% neprůhlednost (perfektní čitelnost)
- Gradient header: primary → secondary
- Chip číslování: 1,2,3 místo "1/10" nebo počtu tipů
- Zavírací ikona: VisibilityOffIcon s hover rotací 90°
- **56 detailních bodů** v UTB nápovědě (vs původních 6!)

**Mobilní optimalizace**:
- Padding: 3 → 1.5
- Font: 0.95rem → 0.85rem
- Icon minWidth: 40px → 32px

---

### Dark Mode Table Styling - EPICKÝ BOJ (10/10/2025)

**Problem**: Box-shadow blur bleeding
- Blur > 3px vytváří artefakty ve všech směrech
- **NEFUNGUJE**: `inset 3px 0 8px -2px` pro vertikální stíny

**Řešení**: Linear-gradient místo box-shadow
```css
background-image: linear-gradient(
  to right,
  rgba(255,255,255,0.25),
  rgba(255,255,255,0.18) 2px,
  rgba(255,255,255,0.10) 5px,
  rgba(255,255,255,0.05) 10px
);
```

**CSS Specificity battle**:
- MUI sx prop > inline styles
- !important nestačil
- **FINÁLNÍ FIX (Claude Sonnet 4.5)**: `forceConsistentRadius.css`

```css
table.MuiTable-root.payment-list-table {
  border-collapse: collapse !important;
  border-spacing: 0 !important;
}

body.dark-mode table.payment-list-table td {
  border-right: 1px solid rgba(60, 60, 60, 0.5) !important;
  border-bottom: 1px solid rgba(60, 60, 60, 0.5) !important;
}
```

**Lesson**: Tmavá barva na tmavém pozadí > světlá barva!

---

### Glassmorphism PaymentDialog (12-13/10/2025)

**Oprava backdrop**: Odstraněn ::before pseudoelement
**Border-radius**: 12px → 16px

**KRITICKÝ PROBLÉM**: Border-radius se neměnil!
**7 neúspěšných pokusů**:
1. ✗ sx prop
2. ✗ customInputSx
3. ✗ index.css
4. ✗ theme.js
5. ✗ CSS proměnné
6. ✗ InputProps
7. ✗ DOM manipulace

**FINÁLNÍ FIX (Claude Sonnet 4.5)**:
```css
html body * * * .MuiFormControl-root:not(.na-stranku-dropdown) .MuiOutlinedInput-root {
  border-radius: 16px !important;
}
```

**Problém**: Mega specifický selektor v `forceConsistentRadius.css`
**Specificita**: (0,0,2,5) - 2 elementy + 5 univerzálních selektorů

**Diagnostika pomocí Console**:
```javascript
for (let sheet of document.styleSheets) {
  for (let rule of sheet.cssRules) {
    if (rule.selectorText?.includes('MuiOutlinedInput-root')) {
      console.log(rule.selectorText, rule.style.borderRadius);
    }
  }
}
```

**LESSON**: DevTools Console je neocenitelný! VŽDY check mega selektory!

---

### Trial Subscription Notifications (13/10/2025)

**Feature**: Červené blikání pro trial platby, které vyprší za 1 den

**Backend**: Přidána pole
```sql
renewal_notification_enabled INTEGER DEFAULT 0
subscription_notification_days_before INTEGER DEFAULT 7
```

**Frontend**: CSS animace
```css
@keyframes trial-warning-pulse {
  0%   { background: rgba(211,47,47,0.15); box-shadow: 0 0 20px rgba(211,47,47,0.6); }
  50%  { background: rgba(211,47,47,0.35); box-shadow: 0 0 50px rgba(211,47,47,0.9); }
  100% { background: rgba(211,47,47,0.15); box-shadow: 0 0 20px rgba(211,47,47,0.6); }
}
```

**Session-based disable**:
- Bulk action: Dočasně vypne upozornění (sessionStorage)
- Po refresh se obnoví
- Dialog: Trvale vypne (renewal_notification_enabled = false)

---

## ANTI-PATTERNS z této části:

### 1. Box-shadow pro směrové blur
**Problem**: Blur radius není směrový → bleeding
**Lesson**: Použít linear-gradient

### 2. CSS Specificity ignorována
**Problem**: Mega selektory přepisují vše
**Lesson**: VŽDY check DevTools Console pro všechna pravidla

### 3. Pseudo-elementy překrývající obsah
**Problem**: ::before s opacity přepisoval text
**Lesson**: Check z-index a display

### 4. MUI sx prop vs CSS
**Problem**: sx má nižší specificitu než mega selektory
**Lesson**: Centralizovat do CSS s !important

### 5. Inline styles s !important
**Problem**: React inline styles nepodporují !important
**Lesson**: Použít CSS soubor

---



## POZNÁMKY: sum_15957-17936 (detailně přečteno ✅) - 1978 řádků

### KOMPLETNÍ PŘEHLED: Celé období 13-21.10.2025

**Git statistiky**:
- 49 souborů změněno
- +16,100 řádků přidáno
- -3,903 řádků odstraněno
- **Netto: +12,197 řádků**

---

### MEGA Lessons Learned (všechny opakující se chyby):

#### 1. Boolean Coercion (4x\!)
```javascript
// ❌ ŠPATNĚ: Vrací 0 místo false
const result = (condition && someNumber);

// ✅ SPRÁVNĚ: Vždy boolean
const result = \!\!(condition && someNumber);
```

#### 2. React Hoisting (3x\!)
**LESSON**: V React hoisting NEFUNGUJE - pořadí definic záleží\!
```javascript
// ❌ ŠPATNĚ:
const handler = () => { console.log(displayData); }; // ReferenceError
const displayData = useMemo(() => [...], []);

// ✅ SPRÁVNĚ:
const displayData = useMemo(() => [...], []);
const handler = () => { console.log(displayData); };
```

#### 3. Date Manipulation (3x\!)
**LESSON**: JavaScript Date má timezone/DST bug\!
```javascript
// ❌ ŠPATNĚ:
date.setMonth(date.getMonth() + 1); // DST issue

// ✅ SPRÁVNĚ:
import { addMonths } from 'date-fns';
const newDate = addMonths(date, 1); // Timezone-safe
```

#### 4. Prop Spreading kopíruje ID (2x\!)
```javascript
// ❌ Kopíruje i id → UNIQUE constraint error
const newObj = { ...oldObj };

// ✅ Explicitní odstranění
const { id, ...newObj } = oldObj;
```

#### 5. SessionStorage vs LocalStorage
- **SessionStorage**: Dočasné (zavře tab = smaže)
- **LocalStorage**: Trvalé (zůstává)

#### 6. Authorization Header (2x\!)
```javascript
// ❌ ŠPATNĚ: 401 Unauthorized
fetch(url);

// ✅ SPRÁVNĚ:
const token = localStorage.getItem('accessToken');
fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
```

---

### Auto-Copy Problémy a Řešení:

#### Problem 1: Nová platba se nezobrazila
**Fix**: Callback onNewPaymentCreated → vlož do seznamu + highlight

#### Problem 2: Špatné datum
**Fix**: Explicitní `new Date(string)` před manipulací

#### Problem 3: Kopírování ID
**Fix**: Destructure `const { id, ...rest } = payment`

---

### Splátky Problémy a Řešení:

#### Problem 1: Duplikátní splátka při auto-copy
**Fix**: `delete formData._saveInstallmentAfterSubmit` po uložení

#### Problem 2: paid_amount neincrementovalo
**Fix**: Kontrola změny stavu, ne absolutního stavu

#### Problem 3: due_date posun do minulosti
**Fix**: date-fns místo native setMonth()

#### Problem 4: Historie se nenačetla (401)
**Fix**: Přidat Authorization header

---

### UniversalDialog Problémy:

#### Problem 1: Conditional fields v rows nefungovaly
**Fix**: Rekurzivní shouldRenderField() pro nested fields

#### Problem 2: Boolean jako string
**Fix**: Type-aware handleInputChange()

#### Problem 3: Custom komponenty bez additionalProps
**Fix**: Spread {...additionalProps} v FieldRenderer

#### Problem 4: Reset formuláře
**Fix**: useEffect při open změně

---

### Modularizace Problémy:

#### Problem 1: Context loss
**Fix**: Přesun providerů výš v component tree

#### Problem 2: Duplikace API volání
**Fix**: SessionStorage cache s timestampem

---

### KLÍČOVÉ REDUKCE KÓDU:

| Soubor            | Před  | Po   | Úspora |
|-------------------|-------|------|--------|
| PaymentDialog     | 1,486 | 362  | -75.6% |
| App.jsx           | 1,501 | ~300 | -80.0% |
| Dialogy (celkem)  | 5,400 | 2,000| -63.0% |

---

### Config-Driven Development Pattern:

**Výhody**:
1. ✅ 75% redukce duplikace
2. ✅ Centralizovaná logika
3. ✅ Snadná údržba
4. ✅ Konzistence UX

**Struktura**:
- UniversalDialog (447 řádků) - Generic wrapper
- DynamicTab (209 řádků) - Tab rendering
- FieldRenderer (371 řádků) - Field rendering
- Config files (925+ řádků každý) - JSON definice

---



## POZNÁMKY: sum_17937-19853 (detailně přečteno ✅) - 1915 řádků

### KOMPLETNÍ REFAKTORING: Vizualizace splátek (21/10/2025)
**Session**: ~3 hodiny intenzivní práce
**Soubory**: 6 změněno
**Čistá změna**: -20 řádků (ale +100% funkčnosti!)

---

### ČÁST 1: Oprava "0" bugu v tabulce (řádky 722-765)

**KRITICKÝ BUG**: Sloupec installments zobrazoval "0" místo prázdného pole
**Příčina**: Boolean coercion issue!
```javascript
// ❌ ŠPATNĚ (vracelo 0):
const hasInstallmentsForActions = (
  (['standing_order', 'recurring'].includes(p.payment_method) || p.has_commitment) &&
  p.total_amount &&
  p.total_amount > 0
);

// ✅ SPRÁVNĚ (vrací boolean):
const hasInstallmentsForActions = !!(
  (['standing_order', 'recurring'].includes(p.payment_method) || p.has_commitment) &&
  p.total_amount &&
  p.total_amount > 0
);
```

**Vysvětlení**:
- Když `p.total_amount` je 0, JS vrací 0 (falsy)
- Ale React vykreslí "0" jako text!
- `!!` konvertuje na boolean (false), React nevykreslí nic

**Soubor**: PaymentList.jsx:2850

---

### ČÁST 2: Velkbý refaktoring - 5 hlavních změn (řádky 814-1031)

#### 2.1 Odstranění progress baru ze sloupce měny (řádky 826-870)
**Před**: 78 řádků komplexní logiky s LinearProgress
**Po**: 17 řádků čisté Typography
**Úspora**: -78% kódu!

```javascript
// FINÁLNÍ implementace:
case 'currency':
  return (
    <Typography
      fontWeight="600"
      sx={{
        fontSize: screenWidth < 800 ? '0.7rem' : '0.8rem',
        whiteSpace: 'nowrap',
        textAlign: 'right',
        width: '100%'
      }}
    >
      {formatCurrency(p.amount, p.currency)}
    </Typography>
  );
```

**Soubor**: PaymentList.jsx:2435-2451

---

#### 2.2 Přesun sloupce splátek na 2. pozici (řádky 873-890)
**Změna**: installments z 8. → 7. pozice (hned za currency)

```javascript
const [columnOrder, setColumnOrder] = useState([
  'select', 'title', 'company', 'type', 'categoryName',
  'currency', 'installments', // ← PŘESUNUTO
  'frequency', 'paymentMethod', 'isPaid', ...
]);
```

**Soubor**: PaymentViewSwitcher.jsx:320-324

---

#### 2.3 Přidání DonutSmall ikony (řádky 892-918)
**Problém**: Červený ❓ v headeru sloupce (fallback pro nezmapované)
**Fix**: Import + mapping

```javascript
// Řádek 23:
import { DonutSmall as DonutSmallIcon } from '@mui/icons-material';

// Řádek 1271:
const columnIcons = useMemo(() => ({
  installments: DonutSmallIcon,
  // ...
}), []);
```

**Soubor**: PaymentList.jsx:23, 1271

---

#### 2.4 SVG Pie Chart implementace (řádky 920-1029)
**KLÍČOVÁ FEATURE**: Koláčový graf místo expandable sekce

**Vizuální design**:
- Velikost: 28×28px
- Poloměr: 11px
- Stroke width: 3px
- Background (nezaplaceno): secondary
- Progress (zaplaceno): primary
- Ikona uprostřed: DonutSmallIcon primary

**SVG Matematika**:
```javascript
// Circumference: 2πr = 2 × π × 11 = 69.115
const dashLength = (percentage / 100) × 69.115;
strokeDasharray={`${dashLength} 69.115`}

// Příklady:
//  0% → dasharray="0 69.115"
// 25% → dasharray="17.279 69.115"
// 50% → dasharray="34.558 69.115"
// 100% → dasharray="69.115 69.115"
```

**Rotace**: `transform: rotate(-90deg)` → start z 12:00 (nahoře)

**Color scheme iterace**:
```javascript
// VERZE 1 (zamítnuta uživatelem):
stroke={progressPercentage === 100 ? colors.primary : colors.secondary}
// User: "zadrž. Vrať to zpátky."

// VERZE 2 (finální):
// Background arc: colors.secondary (celý kruh)
// Progress arc: colors.primary (jen zaplacená část)
// Icon: colors.primary (vždy)
```

**Tooltip**:
```javascript
title={`Zaplaceno: ${formatCurrency(paidAmount, p.currency)} z ${formatCurrency(totalAmount, p.currency)} (${Math.round(progressPercentage)}%) - Klikni pro detail`}
```

**Soubor**: PaymentList.jsx:2756-2852

---

#### 2.5 Odstranění expandable sekce z tabulky (řádky 1031-1080)
**Odstraněno**: 103 řádků expandable history row
**Důvod**: Historie nyní přímo v detailu platby (klik na graf)

**Soubor**: PaymentList.jsx:3244-3347 (smazáno)

---

### ČÁST 3: Responsive breakpoint (řádky 1083-1108)
**Přidáno**: Breakpoint 1250px pro installments sloupec

```javascript
if (width >= 1250) columns.installments = true; // ← NOVÉ
```

**Soubor**: responsive.js:369

---

### ČÁST 4: Tab Navigation - Multi-layer implementace (řádky 1110-1313)

**Problém**: Klik na graf otevíral dialog na "Základní" místo "Platba"
**Řešení**: Prop drilling initialTab přes 5 vrstev!

**Hierarchie**:
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

**Tab struktura** (paymentDialogConfig.js):
- Index 0: 'basic' - "Základní"
- Index 1: 'banking' - "Platba" ← CÍL
- Index 2: 'subscription' - "Předplatné"
- Index 3: 'notifications' - "Notifikace"

#### Implementace po vrstvách:

**1. UniversalDialog.jsx** (řádky 1130-1167):
```javascript
// Řádek 46: Přidán prop
function UniversalDialog({
  open, onClose, onSubmit, config, initialData = null,
  title, additionalProps = {},
  initialTab = 0  // ← PŘIDÁNO
}) {

// Řádek 50: Použití v state
const [currentTab, setCurrentTab] = useState(initialTab);

// Řádek 110: Přidáno do dependency array
}, [initialData, open, initialTab]);
```

**2. PaymentDialog.jsx** (řádky 1169-1200):
```javascript
// Řádek 33: Přidán prop
function PaymentDialog({
  open, onClose, onSubmit, payment = null,
  categories = [], refreshTrigger, onNewPaymentCreated,
  initialTab = 0  // ← PŘIDÁNO
}) {

// Řádek 345: Předání do UniversalDialog
<UniversalDialog
  initialTab={initialTab}  // ← PŘEDÁNO
  // ...
/>
```

**3. PaymentsModule.jsx** (řádky 1202-1237):
```javascript
// Řádek 72: State pro initialTab
const [initialTab, setInitialTab] = useState(0);

// Řádky 407-411: Handler s parametrem
const handleEditPayment = (payment, initialTab = 0) => {
  setEditingPayment(payment);
  setInitialTab(initialTab); // ← Nastav záložku
  setDialogOpen(true);
};

// Řádky 457-461: Reset při zavření
const handleDialogClose = () => {
  setDialogOpen(false);
  setEditingPayment(null);
  setInitialTab(0); // ← Reset
};

// Řádek 836: Předání propu
<PaymentDialog initialTab={initialTab} />
```

**4. PaymentList.jsx** (řádky 1239-1250):
```javascript
// Řádek 2786: Trigger
onClick={(e) => {
  e.stopPropagation();
  onEdit(p, 1); // ← Zavolá s indexem 1
}}
```

**Flow normálního otevření**:
1. Klik Edit button → onEdit(payment)
2. handleEditPayment(payment, 0) - default
3. Dialog na "Základní" (index 0)

**Flow přes koláčový graf**:
1. Klik graf → onEdit(payment, 1)
2. handleEditPayment(payment, 1)
3. Dialog na "Platba" (index 1) ✨

---

### ČÁST 5: Testovací scénáře - Kompletní sada (řádky 1464-1513)

**Test 1: Zobrazení grafu**
- ✅ Graf pouze u payment_method = standing_order/recurring
- ✅ NEBO has_commitment = true
- ✅ A ZÁROVEŇ total_amount > 0
- ✅ Jinak "—"

**Test 2: Výpočet procent**
- ✅ 0 Kč z 1000 Kč = 0%
- ✅ 250 Kč z 1000 Kč = 25%
- ✅ 500 Kč z 1000 Kč = 50%
- ✅ 1000 Kč z 1000 Kč = 100%
- ✅ 1200 Kč z 1000 Kč = 100% (cap na 100%)

**Test 3: Barvy**
- ✅ Interior icon vždy primary
- ✅ Background arc vždy secondary
- ✅ Progress arc vždy primary
- ✅ Hover: scale 1.1, background rgba(33, 150, 243, 0.1)

**Test 4: Tooltip**
- ✅ Formát: "Zaplaceno: {paid} z {total} ({%}) - Klikni pro detail"
- ✅ Částky formátované podle měny

**Test 5: Tab navigace**
- ✅ Graf → záložka "Platba" (1)
- ✅ Edit button → záložka "Základní" (0)
- ✅ Zavření → reset na 0

**Test 6: Responsive**
- ✅ Sloupec viditelný od 1250px
- ✅ Mobile (≤767px) má tlačítko pro historii

**Test 7: "0" chyba**
- ✅ Platby bez splátek: "—" (ne "0")
- ✅ Boolean coercion funguje

---

### ČÁST 6: Vyřešené problémy a edge cases (řádky 1515-1531)

**✅ Vyřešeno**:
1. ❌ "0" zobrazování → ✅ Boolean coercion
2. ❌ Červený ❓ v hlavičce → ✅ DonutSmall ikona
3. ❌ Progress bar redundance → ✅ Odstraněn
4. ❌ Nesprávná záložka → ✅ initialTab

**🟡 Možná budoucí vylepšení**:
1. Animace přechodu mezi procenty (CSS transition)
2. Konfigurovatelná velikost (small/medium/large)
3. Alternativní vizualizace (bar/donut/pie)
4. Click-to-edit přímo v grafu
5. Drag-and-drop pořadí splátek

---

### ČÁST 7: Performance srovnání (řádky 1533-1548)

**Před optimalizací**:
- Sloupec měny: 78 řádků (s progress barem)
- Expandable sekce: 103 řádků
- Re-renders: Časté kvůli komplexní logice

**Po optimalizaci**:
- Sloupec měny: 17 řádků (-78%)
- Expandable sekce: 0 řádků (odstraněno)
- Re-renders: Méně (useMemo na columnIcons)
- SVG rendering: Hardware-accelerated
- Bundle size: -20 řádků celkově

---

### ČÁST 8: Statistiky změn (řádky 1344-1354)

| Soubor                    | Přidáno | Odstraněno | Čistá změna |
|---------------------------|---------|------------|-------------|
| PaymentList.jsx           | ~150    | ~180       | -30         |
| PaymentViewSwitcher.jsx   | 1       | 1          | 0           |
| PaymentDialog.jsx         | 3       | 1          | +2          |
| UniversalDialog/index.jsx | 4       | 2          | +2          |
| PaymentsModule.jsx        | 8       | 3          | +5          |
| responsive.js             | 1       | 0          | +1          |
| **CELKEM**                | **~167**| **~187**   | **-20**     |

**Výsledek**: Kód kratší, ale funkčnost +100%!

---

### ČÁST 9: Technické detaily - Deep dive (řádky 1357-1463)

**SVG Circle Progress matematika**:
```javascript
// Základní vzorec
C = 2πr = 2 × 3.14159 × 11 = 69.115 px

// Výpočet dasharray
const dashLength = (percentage / 100) × 69.115;
strokeDasharray={`${dashLength} 69.115`}

// Rotace kruhu
transform: 'rotate(-90deg)'  // Start na 12:00 místo 3:00
```

**Color scheme logika**:
```javascript
// Background circle - VŽDY secondary (celý kruh 360°)
<circle stroke={colors.secondary} strokeWidth="3" />

// Progress circle - POUZE zaplacená část v primary
<circle
  stroke={colors.primary}
  strokeWidth="3"
  strokeDasharray={`${progress} ${circumference}`}
/>

// Icon - VŽDY primary
<DonutSmallIcon sx={{ color: colors.primary }} />
```

**Boolean coercion - důkladné vysvětlení**:
```javascript
// JavaScript falsy hodnoty:
false, 0, -0, 0n, "", null, undefined, NaN

// Problém v praxi:
const total = 0;
const hasInstallments = (true && total && total > 0);
console.log(hasInstallments); // 0 (ne false!)

// V JSX:
{hasInstallments && <Component />}
// Pokud hasInstallments je 0, React vykreslí "0"!

// Řešení - double negation:
const hasInstallments = !!(true && total && total > 0);
console.log(hasInstallments); // false (boolean!)
```

---

### ČÁST 10: Závěr a měřitelné výsledky (řádky 1550-1580)

**Dosažené cíle**:
- ✅ Oprava "0" chyby
- ✅ Odstranění redundantního progress baru
- ✅ Přesun sloupce na prominentní pozici
- ✅ Kompaktní koláčový graf
- ✅ Odstranění expandable sekce
- ✅ Tab navigace pro lepší UX
- ✅ Responsive breakpointy
- ✅ Dark mode kompatibilita
- ✅ Tooltip s detaily
- ✅ Hover animace

**Klíčové technologie**:
- React useState, useEffect, useMemo
- Material-UI komponenty
- SVG pro grafiku
- CSS transforms a transitions
- Boolean coercion pattern
- Prop drilling (5 vrstev!)

**Měřitelné výsledky**:
- **-20 řádků** kódu celkově
- **-78%** kódu ve sloupci měny
- **+100% UX** díky přímému přístupu k záložce "Platba"
- **28×28 px** kompaktní vizualizace
- **1 kliknutí** místo 2 pro přístup k historii

**Session metadata**:
- Datum: 21. října 2025
- Trvání: ~3 hodiny
- Počet změn: 6 souborů
- Status: ✅ Kompletní, otestováno, funkční
- Autor: Claude (Sonnet 4.5)
- Spolupráce: Lenka Roubalová

---

## 🎯 FINÁLNÍ TOP OPAKUJÍCÍ SE CHYBY (aktualizováno po všech částech)

### 1. Boolean coercion (5x!) ← PŘIDÁNO +1
**Pattern**: `condition && number` vrací 0 místo false
**FIX**: VŽDY použít `!!` operator
**Výskyt**: PaymentList installments, category filters, archive logic

### 2. Database middleware chybí (4x!)
**Pattern**: `req.db` jen pro specific routes
**FIX**: VŽDY globální middleware

### 3. Bankovní pole se neukládají (3x!)
**Pattern**: Nová pole v DB, ale ne v destructuring
**FIX**: Checklist při přidání polí do všech endpointů

### 4. Duplicitní komponenty (5x!)
**Pattern**: Refactor → zapomenutý cleanup
**FIX**: TODO item pro odstranění starých

### 5. Color system chaos (7x!)
**Pattern**: Přidávání barev "na místě"
**FIX**: JEDEN zdroj pravdy

### 6. Nekonečné renderování (5x!) ← AKTUALIZOVÁNO
**Pattern**: Set/Object v useEffect deps bez serialization
**FIX**: VŽDY serializovat `JSON.stringify()` nebo `Array.from().join()`

### 7. Date manipulation bugs (4x!) ← PŘIDÁNO +1
**Pattern**: Native Date methods s timezone/DST issues
**FIX**: VŽDY použít date-fns (addMonths, addDays, etc.)

### 8. Authorization header chybí (3x!) ← PŘIDÁNO +1
**Pattern**: Fetch bez Bearer token
**FIX**: VŽDY include `Authorization: Bearer ${token}`

### 9. React hoisting (3x!)
**Pattern**: Použití proměnné před její definicí
**FIX**: Pořadí definic záleží! useMemo/useState PŘED handlers

### 10. CSS Specificity battles (8x!) ← PŘIDÁNO +1
**Pattern**: Mega selektory (html body * * *) přepisují vše
**FIX**: DevTools Console iterace přes všechna pravidla

---

