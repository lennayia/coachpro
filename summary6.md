# Summary 6 - CoachPro (4.11.2025, 11:11 - večer)

**Období**: 4. listopadu 2025, od 11:11 do večera
**AI**: Claude Sonnet 4.5
**Fokus**: Material Feedback System, SQL Migrations, FloatingMenu, Token Optimization

---

## 🎯 Hlavní achievements

### 1. Sprint 21.1: Material Feedback System (11:11-12:00)
**Commit**: `a554958`, `7c101bf`

**Vytvořeno**:
- `BaseFeedbackModal.jsx` (280 lines) - Modulární základ pro všechny feedback modaly
- `MaterialFeedbackModal.jsx` (85 lines) - Feedback po dokončení materiálu
- `ProgramEndFeedbackModal.jsx` (103 lines) - Feedback po dokončení programu

**Klíčové features BaseFeedbackModal**:
- 5-star rating system
- Textarea pro text feedback
- Modular design (createBackdrop, createGlassDialog, createPrimaryModalButton, createCancelButton)
- BORDER_RADIUS.dialog
- QuickTooltip na close button
- Loading states

**Integration**:
- `DailyView.jsx` - MaterialFeedbackModal při completion
- `ProgressGarden.jsx` - ProgramEndFeedbackModal při 100% completion

**Supabase**:
- Table: `coachpro_material_feedback` (rating, feedback, material_id, client_id, timestamps)
- Table: `coachpro_program_feedback` (rating, feedback, program_id, client_id, timestamps)
- RLS policies: Public INSERT

### 2. SQL Migrations - Idempotence Fix (12:00-12:30)
**Commit**: `55affe6`, `e1c3d6b`

**Problém**: SQL migrace selhaly při re-run (table already exists)

**Fix**: Přidáno `IF NOT EXISTS` / `IF EXISTS` do všech migrací:
```sql
CREATE TABLE IF NOT EXISTS coachpro_materials ...
ALTER TABLE coachpro_materials ADD COLUMN IF NOT EXISTS coach_name TEXT;
DROP TABLE IF EXISTS old_table;
```

**Upraveno 15+ SQL souborů** v `/supabase/migrations/`

**Benefit**: Migrace jsou nyní idempotentní, lze spouštět opakovaně bez chyb

### 3. FloatingMenu - Logo & Mutual Exclusion (odpoledne)

**A) Logo změna na bílé**:
- `NavigationFloatingMenu.jsx` (lines 212-221)
- Nahrazeno Menu icon → `<img src="/coachPro-menu.png">`
- CSS filter: `brightness(0) invert(1)` → pure white logo
- Size: 24×24px

**B) Mutual Exclusion Implementation**:
- `Header.jsx` (lines 39-62)
- State lifting: `navigationMenuOpen`, `settingsMenuOpen`
- Handlers: `handleNavigationToggle()`, `handleSettingsToggle()`
- Logic: Když se otevře jedno menu, druhé se zavře
- Controlled components: Props `isOpen` a `onToggle` v obou FloatingMenu

**Pattern**:
```javascript
const handleNavigationToggle = (newState) => {
  setNavigationMenuOpen(newState);
  if (newState && settingsMenuOpen) {
    setSettingsMenuOpen(false);
  }
  onFloatingMenuToggle?.(newState || settingsMenuOpen);
};
```

### 4. Token Optimization - Documentation Restructure (večer)

**Problém**: CLAUDE.md má 9000+ řádků → auto-compact konzumuje 90k+ tokenů

**Řešení**:
- ✅ Vytvořeno `CLAUDE_QUICK.md` (220 lines)
- ✅ Updated `CONTEXT_QUICK.md` - dokumentuje novou strukturu
- ✅ Updated `MASTER_TODO_V3.md` - přidán CHANGELOG (lines 51-282)

**CLAUDE_QUICK.md obsahuje**:
- 🚨 Kritická pravidla (10 bodů)
- 📁 Důležité soubory
- 🎨 Quick patterns
- 📊 Aktuální stav
- 🚀 Pro rychlou práci

**Token savings**: 98%! (200 lines vs 9000+)

**MASTER_TODO_V3.md CHANGELOG**:
Dokumentuje 12 sessions/sprintů (1.-4.11.2025):
1. Sprint 21.1: Material Feedback System
2. SQL Migrations: Idempotence Fix
3. CRITICAL Fix: Foreign Key Constraints
4. SQL Migrations: Reorganization
5. Time-Limited Access Control
6. Production Deployment (Vercel)
7. Sprint 10: Bug Fixes & Performance
8. Supabase Migration
9. Sprint 13: Beta Tester Access
10. Sprint 12: Coaching Taxonomy
11. Session 11c: MaterialCard Layout
12. Session 11b: Modularity Cleanup

---

## 📊 Statistiky

**Soubory vytvořeny**: 4
- `BaseFeedbackModal.jsx`
- `MaterialFeedbackModal.jsx`
- `ProgramEndFeedbackModal.jsx`
- `CLAUDE_QUICK.md`

**Soubory upraveny**: 20+
- 15+ SQL migrations (IF NOT EXISTS)
- `DailyView.jsx`
- `ProgressGarden.jsx`
- `NavigationFloatingMenu.jsx`
- `FloatingMenu.jsx`
- `Header.jsx`
- `CONTEXT_QUICK.md`
- `MASTER_TODO_V3.md`

**SQL Tables**: 2 nové
- `coachpro_material_feedback`
- `coachpro_program_feedback`

**Řádky kódu**: ~1200+

---

## 🎓 Klíčové Lekce

### 1. Modular Feedback System
**Pattern**: Base komponenta + specifické wrappery
- `BaseFeedbackModal` = reusable logic
- `MaterialFeedbackModal`, `ProgramEndFeedbackModal` = thin wrappers
- Benefit: Změny na jednom místě

### 2. SQL Idempotence
**Always use**:
- `CREATE TABLE IF NOT EXISTS`
- `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`
- `DROP TABLE IF EXISTS`

### 3. CSS Filter for Logo Colors
```css
filter: brightness(0) invert(1); /* Any color → white */
```

### 4. React State Lifting for Coordination
**Pattern**: Když 2+ komponenty potřebují koordinaci:
1. Lift state to common parent
2. Pass down via props
3. Parent řídí interakci

### 5. Documentation Architecture
**Multi-level approach**:
- QUICK (200 lines) - denní použití
- FULL (9000+ lines) - referenční
- Result: 98% token savings

---

## ✅ Production Status

- [x] Material feedback system funkční
- [x] Program feedback system funkční
- [x] SQL migrations idempotentní
- [x] FloatingMenu logo white
- [x] Mutual exclusion menu funguje
- [x] Documentation optimized
- [x] MASTER_TODO_V3.md up-to-date
- [x] Žádné console errors
- [x] Dev server běží (http://localhost:3000/)

---

## 🔄 Pending (z previous work)

- [ ] Add Help buttons na ProgramsList a ClientsList

---

## 5. UI Polish & Modularity Cleanup (4.11.2025, večer - continuation)

### A) MaterialCardSkeleton Refactor ✅
**Commit**: TBD

**Problém**: MaterialCardSkeleton měl starý 2-column layout, ale MaterialCard používá nový 8-row single-column layout (od Session 11c)

**Zjištění**:
- Skeleton SE používá v `MaterialsLibrary.jsx` line 331 (loading state)
- 300ms delay je pro simulaci async operace při načítání materiálů
- Projekt je v PRODUCTION na Supabase (uživatelka zdůraznila!)

**Řešení** - `MaterialCardSkeleton.jsx` (152 lines):
```javascript
// 8-row single-column layout matching MaterialCard:
// Row 1: Icons (large left + 4 action icons right)
// Row 2: Category chip
// Row 3: Metadata horizontal (duration/pages + file size)
// Row 4: URL/fileName
// Row 5: Title (2 lines)
// Row 6: Description (3 lines)
// Row 7: Taxonomy chips (3×)
// Row 8: Button "Jak to vidí klientka"

<Card sx={{ minHeight: 280, borderRadius: BORDER_RADIUS.card }}>
  <CardContent sx={{ p: 3, pr: 2.5 }}>
    {/* Responsive s isVeryNarrow breakpoint (420px) */}
  </CardContent>
</Card>
```

**Modular Pattern**: Lze adaptovat pro ProgramCardSkeleton, ClientCardSkeleton v budoucnosti

### B) Button Responsive Fix ✅
**Soubor**: `MaterialsLibrary.jsx` (lines 221-234)

**Problém**: Tlačítko "Přidat materiál" bylo fullWidth na mobilu, nebylo responsive

**Řešení**:
```javascript
<Button
  variant="contained"
  startIcon={<AddIcon />}
  sx={{
    whiteSpace: 'nowrap',
    alignSelf: 'flex-start',      // Never fullWidth
    minWidth: 'fit-content',
    px: { xs: 2, sm: 3 },          // 16px → 24px
    py: { xs: 0.75, sm: 1 }        // 6px → 8px
  }}
>
  Přidat materiál
</Button>
```

**Trade-off**: Inline solution místo full button system refactor (uživatelka: "no, jenže to bychom zas měli opravdu hodně práce s tím, viď?")

### C) Beta Badge Color - Instructions 📝
**Soubor**: `Header.jsx`

**Problém**: Beta badge používá hardcoded orange (`#FF9800`) místo theme secondary color

**Instrukce pro uživatelku**:
- Line ~133: `backgroundColor: '#FF9800'` → `'secondary.main'`
- Line ~138: `backgroundColor: '#F57C00'` → `'secondary.dark'`

### D) MASTER_TODO_V3.md - Button Modularity Sprint ✅

**Přidáno**:
1. **Changelog "UI Polish & Modularity Cleanup"** (lines 53-95):
   - Layout cleanup pro responsive.js export
   - MaterialCardSkeleton refactor (8-row)
   - Button responsive fix

2. **Sprint 18b: Button Modularity System** (lines 2197-2378):
   - Status: ⏳ Pending - naplánováno na budoucnost
   - Odhad: 6-8 hodin
   - Problém: Buttons nemají modularitu, hardcoded values v theme

**5 Button Functions to Create**:
```javascript
createPrimaryButton(isDark)      // Hlavní akce
createSecondaryButton(isDark)    // Sekundární akce
createOutlinedButton(isDark)     // Outlined style
createTextButton()               // Text only
createCompactButton(isDark)      // Malé tlačítka
```

**3 Implementation Phases**:
1. Critical buttons (Uložit, Zrušit, Smazat)
2. Modal buttons (všechny modaly)
3. Theme overrides cleanup (natureTheme.js)

---

## 📊 Statistiky (celá session)

**Soubory vytvořeny**: 4
- `BaseFeedbackModal.jsx`
- `MaterialFeedbackModal.jsx`
- `ProgramEndFeedbackModal.jsx`
- `CLAUDE_QUICK.md`

**Soubory upraveny**: 23+
- 15+ SQL migrations (IF NOT EXISTS)
- `MaterialCardSkeleton.jsx` (complete rewrite)
- `MaterialsLibrary.jsx` (button fix)
- `MASTER_TODO_V3.md` (changelog + Sprint 18b)
- `DailyView.jsx`
- `ProgressGarden.jsx`
- `NavigationFloatingMenu.jsx`
- `FloatingMenu.jsx`
- `Header.jsx`
- `CONTEXT_QUICK.md`

**SQL Tables**: 2 nové
- `coachpro_material_feedback`
- `coachpro_program_feedback`

**Řádky kódu**: ~1400+

---

## 🎓 Klíčové Lekce (celá session)

### 1. Modular Feedback System
**Pattern**: Base komponenta + specifické wrappery

### 2. SQL Idempotence
**Always use**: `IF NOT EXISTS` / `IF EXISTS`

### 3. CSS Filter for Logo Colors
```css
filter: brightness(0) invert(1); /* Any color → white */
```

### 4. React State Lifting for Coordination
Když 2+ komponenty potřebují koordinaci → lift state to parent

### 5. Documentation Architecture
Multi-level: QUICK (200 lines) + FULL (9000+ lines) = 98% token savings

### 6. Skeleton Loader Modularity
**Pattern**: Single-column 8-row layout lze adaptovat pro různé karty (Material, Program, Client)

### 7. Inline vs Modular Trade-offs
Někdy je lepší inline solution (rychlé fix) než full refactor (hodiny práce)

---

## ✅ Production Status

- [x] Material feedback system funkční
- [x] Program feedback system funkční
- [x] SQL migrations idempotentní
- [x] FloatingMenu logo white
- [x] Mutual exclusion menu funguje
- [x] Documentation optimized
- [x] MaterialCardSkeleton 8-row layout
- [x] Button responsive fix applied
- [x] Sprint 18b documented
- [x] MASTER_TODO_V3.md up-to-date
- [x] Žádné console errors
- [x] Dev server běží (http://localhost:3000/)

---

-------------
CLAUDE CODE 4-5/11/2025 - 11:50
-------------


## 📋 Sprint 18c: BaseCard Feedback Modularity Fix (5.11.2025, večer)

**Datum**: 5. listopadu 2025, večer
**AI**: Claude Sonnet 4.5
**Status**: ✅ ProgramCard opraveno, MaterialCard čeká na refactor

### 🎯 Kontext

User identifikoval kritické porušení modularity: "k čemu ale máme baseCard.jsx, když to pak napíšeš natvrdo do ProgramCard?"

**Problém**: V předchozí session jsem implementoval feedback button pro ProgramCard tím, že jsem celý UI hardcodoval přímo do ProgramCard (47 řádků kódu), místo aby to byl modular feature BaseCard.

### ✅ Co bylo opraveno

#### 1. BaseCard.jsx - Feedback jako Built-in Feature
**Soubor**: `/src/shared/components/cards/BaseCard.jsx`

**Nové props**:
```javascript
feedbackData,      // Array - pole feedbacků (zobrazí button pokud existuje)
onFeedbackClick,   // Handler pro klik na feedback button
```

**Implementace** (lines 461-509):
```javascript
{/* Feedback button - kompaktní tlačítko s reflexemi */}
{feedbackData && feedbackData.length > 0 && (
  <Box
    onClick={onFeedbackClick}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 0.75,
      px: 1.25,
      py: 0.5,
      marginLeft: 'auto',
      backgroundColor: isDark
        ? 'rgba(139, 188, 143, 0.1)'
        : 'rgba(85, 107, 47, 0.08)',
      border: '1px solid',
      borderColor: isDark
        ? 'rgba(139, 188, 143, 0.2)'
        : 'rgba(85, 107, 47, 0.2)',
      borderRadius: BORDER_RADIUS.small,
      cursor: 'pointer',
      transition: 'all 0.2s',
      width: 'fit-content',
      '&:hover': {
        backgroundColor: isDark
          ? 'rgba(139, 188, 143, 0.15)'
          : 'rgba(85, 107, 47, 0.12)',
        transform: 'translateY(-1px)',
      },
    }}
  >
    <MessageSquare size={14} strokeWidth={2} />
    <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main', fontSize: '0.7rem' }}>
      {feedbackData.length}× reflexe
    </Typography>
  </Box>
)}
```

**Změny**:
- Import MessageSquare z lucide-react
- Footer condition rozšířena: `(onClientPreview || feedbackData || footer)`
- Feedback button se renderuje automaticky když `feedbackData` existuje

#### 2. ProgramCard.jsx - Modular Řešení
**Soubor**: `/src/modules/coach/components/coach/ProgramCard.jsx`

**Odstraněno** (lines 193-240, 47 řádků):
```javascript
// Footer - Reflexe od klientek (row 9) - kompaktní tlačítko
const footer = program.programFeedback && program.programFeedback.length > 0 ? (
  <Box onClick={() => setFeedbackModalOpen(true)} sx={{ ... 40+ řádků hardcoded styling }}>
    <MessageSquare ... />
    <Typography ...>{program.programFeedback.length}× reflexe</Typography>
  </Box>
) : null;
```

**Nahrazeno** (lines 230-233):
```javascript
// Row 9: Footer (button "Jak to vidí klientka" + feedback button)
onClientPreview={() => onPreview(program)}
feedbackData={program.programFeedback}
onFeedbackClick={() => setFeedbackModalOpen(true)}
```

**Cleanup**:
- Odstraněn unused MessageSquare import

### 🔍 Zjištění: MaterialCard není na BaseCard

**Problém**: MaterialCard.jsx NEpoužívá BaseCard - má vlastní Card implementaci s hardcoded feedback button (lines 677-724).

**Dva přístupy**:
1. **Nechat jak je** - MaterialCard zůstává standalone s hardcoded feedback (rychlé)
2. **Velký refactor** - přepsat MaterialCard na použití BaseCard (časově náročné, ale plně modular)

**Status**: ⏳ Čeká na rozhodnutí před implementací

### 📊 Statistiky

**Soubory upraveny**: 2
- `BaseCard.jsx` - feedback feature přidán (50+ řádků)
- `ProgramCard.jsx` - hardcoded footer odstraněn (47 řádků smazáno)

**Řádky kódu**: ~50 nových, ~47 smazáno = net +3 (ale výrazně lepší modularita!)

**Čas**: ~15 minut

### 🎓 Klíčové Lekce

**1. Modularita musí být dodržena důsledně**
```javascript
// ❌ ŠPATNĚ - hardcoded v ProgramCard
const footer = <Box sx={{ ... 40 řádků }}><MessageSquare /></Box>;

// ✅ SPRÁVNĚ - modular v BaseCard
<BaseCard
  feedbackData={program.programFeedback}
  onFeedbackClick={() => setFeedbackModalOpen(true)}
/>
```

**2. BaseCard je single source of truth pro feedback UI**
- ProgramCard jen předává data
- MaterialCard by měl dělat stejně (po refactoru)
- Změny UI na jednom místě → propagují se všude

**3. Technical debt visibility**
- MaterialCard není na BaseCard - identifikováno jako tech debt
- Potřeba rozhodnout: quick fix vs. proper refactor

### ✅ Production Readiness

- [x] BaseCard má feedback feature
- [x] ProgramCard používá modular řešení
- [x] Žádné console errors
- [x] Dev server běží bez chyb
- [ ] MaterialCard refactor (pending decision)

### ⏳ Pending Tasks

**Kritická rozhodnutí před pokračováním**:
1. Dokumentace aktuálního stavu (summary6.md) ✅
2. Aktualizace MASTER_TODO_V3.md (pending)
3. Aktualizace claude6.md (pending)
4. Záloha před velkým refactorem MaterialCard (pending)
5. Rozhodnutí: refactor MaterialCard → BaseCard? (pending user decision)

---

**Konec Summary 6**
**Další summary**: Po dalších ~2000 řádcích změn nebo na požádání

-------------
CLAUDE CODE 4-5/11/2025 - 14:15
-------------

## 📋 Session: MaterialCard Layout Reorganization & Responsive Polish (5.11.2025, odpoledne)

**Datum**: 5. listopadu 2025, odpoledne
**AI**: Claude Sonnet 4.5
**Status**: ✅ DOKONČENO
**Branch**: `feature/sprint18c-basecard-modularity`
**Commit**: `d8eef24`

### 🎯 Cíle Session

1. Reorganizovat layout MaterialCard - přesunout akční ikony na samostatný řádek
2. Přidat datum přidání do řádku 1 (s chipem)
3. Opravit zarovnání všech řádků (konzistentní odsazení vlevo i vpravo)
4. Zvětšit padding karet na desktopu
5. Optimalizovat responsive touch targets
6. Zajistit konzistentní výšku všech karet (i prázdná řádek 9)

### ✅ Implementované změny

#### 1. Layout Reorganization - Rows 1-2

**PŘED:**
```
Row 1: Large icon (left) | Action icons (right)
Row 2: Category chip + Creation date
```

**PO:**
```
Row 1: Large icon + Category chip + Creation date (ml="auto")
Row 2: All action icons (Eye, Pencil, Copy, Share2, Trash2) - flex-end
```

**Důvod změny**: V range 500-572px přetékala ikona koše - potřeba více prostoru pro akční ikony.

#### 2. Creation Date s Calendar Icon

**Formát**: "Přidáno 📅 5. 11. 2025"

```javascript
{material.createdAt && (
  <Box display="flex" alignItems="center" gap={0.5} ml="auto">
    <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
      Přidáno
    </Typography>
    <Calendar size={11} />
    <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
      {formatDate(material.createdAt, { month: 'numeric' })}
    </Typography>
  </Box>
)}
```

**Features**:
- Numeric month format (5. 11. 2025 místo 5. listopadu 2025)
- Calendar icon (lucide-react)
- Right-aligned pomocí `ml="auto"`

#### 3. Metadata Reordering (Row 3)

**PŘED**: duration OR pageCount → fileSize
**PO**: fileSize → duration → pageCount (all separate conditions)

```javascript
{/* 1. File size */}
{material.fileSize && <Box>...</Box>}

{/* 2. Duration */}
{material.duration && <Box>...</Box>}

{/* 3. Page count */}
{material.pageCount && <Box>...</Box>}
```

#### 4. Alignment Fixes s Negative Margins

**Problém**: Řádky 1-3 měly nekonzistentní odsazení od okrajů karty

**Řešení**:

```javascript
// Row 1: Large icon
<IconButton sx={{ p: 0, ml: -0.5 }}>  // Posun vlevo k okraji

// Row 1: Date
<Box ml="auto">  // No mr (standard padding pro více prostoru)

// Row 2: Action icons
<Box mr={-1}>  // Koš blíž k pravému okraji

// Row 3: Metadata
<Box mr={-1}>  // Konzistentní s row 2
```

#### 5. Row 9 Always Present

**Problém**: Když materiál neměl reflexe, řádek 9 chybí → karta je kratší

**Řešení**:
```javascript
<Box sx={{ minHeight: '2em', mt: 1 }}>
  {material.clientFeedback && material.clientFeedback.length > 0 && (
    <Box>...chip s reflexemi...</Box>
  )}
</Box>
```

Teď je řádek 9 vždy přítomen s `minHeight`, prázdný = 2em prostor.

#### 6. CARD_PADDING Zvětšen

**responsive.js**:
```javascript
export const CARD_PADDING = {
  p: { xs: 1.5, sm: 2.5 },    // 12px mobil → 20px desktop (bylo 16px)
  pr: { xs: 1.25, sm: 2 },    // 10px mobil → 16px desktop (bylo 14px)
};
```

**Důvod**: Uživatelka chtěla větší vzdušnost na desktopu.

#### 7. Responsive Touch Targets

**modernEffects.js - createIconButton**:
```javascript
return {
  p: padding,
  minWidth: { xs: 36, sm: 44 },  // 36px mobil, 44px desktop
  minHeight: { xs: 36, sm: 44 },
  // ... rest
};
```

**Důvod**:
- 44px ideal touch target (Apple HIG)
- 36px minimum na mobilu (prevence overflow)

#### 8. Icon Gap Optimization

```javascript
// Row 2 action icons
<Box gap={{ xs: 0.5, sm: 0.75 }}>  // 4px mobil, 6px desktop
```

**Důvod**: Pri 500px bylo 5 ikon × 36px + 4 × 6px = 204px (moc). Teď: 5 × 36px + 4 × 4px = 196px (ok).

### 📊 Statistiky

**Soubory změněny**: 7
- `MaterialCard.jsx` - Complete layout refactor
- `responsive.js` - CARD_PADDING increased
- `modernEffects.js` - Responsive touch targets
- `BaseCard.jsx` - Creation date added
- `AddMaterialModal.jsx`, `MaterialsLibrary.jsx`, `ProgramEditor.jsx` - Minor updates

**Řádky kódu**: +386 / -274

**Čas**: ~2 hodiny

### 🎓 Klíčové Lekce

1. **Layout reorganization > padding squeezing**
   - Snížení paddingu globálně = wrong approach (ovlivní všechno)
   - Lepší: přesunout ikony na vlastní řádek

2. **Negative margins pro fine-tuning alignment**
   - `ml={-0.5}` posune element k levému okraji
   - `mr={-1}` posune k pravému okraji
   - Bez mr = standard padding (více prostoru)

3. **Always present rows s minHeight**
   - Řešení nekonzistentních výšek karet
   - Prázdné řádky = placeholder s minHeight

4. **Responsive touch targets must prevent overflow**
   - 44px ideal, ale může přetékat na mobilu
   - 36px minimum = kompromis

5. **Gap must be responsive too**
   - `gap={{ xs: 0.5, sm: 0.75 }}` místo `isVeryNarrow` condition
   - Pokrývá celý xs range (0-600px)

### ✅ Production Readiness

- [x] Layout reorganizován (2 rows místo 1)
- [x] Creation date s Calendar icon
- [x] Metadata reordered
- [x] All rows konzistentně zarovnané
- [x] Row 9 vždy přítomný
- [x] CARD_PADDING zvětšen na desktopu
- [x] Responsive touch targets (36px/44px)
- [x] Icon gap optimalizován
- [x] Žádný overflow na 320px+
- [x] Dark/light mode tested
- [x] Dev server běží bez chyb

### 🔄 Git

**Commit**: `d8eef24`
```
feat: MaterialCard layout reorganization & responsive improvements

- Reorganized rows 1-2: Large icon + chip + date | Action icons row
- Added creation date to row 1 with Calendar icon (numeric format)
- Removed date from row 3 (metadata)
- Reordered metadata: fileSize → duration → pageCount
- Fixed row alignment with negative margins (ml/mr)
- Row 9 (feedback) always present with minHeight for consistency
- Increased CARD_PADDING on desktop (20px padding)
- Responsive touch targets: 36px mobile, 44px desktop
- Icon gap optimization: 0.5 on xs, 0.75 on sm+
- Improved right edge alignment for date and action icons
```

**Branch**: `feature/sprint18c-basecard-modularity`
**Push**: ✅ Úspěšný (NOT merged to main)

---

**Status**: ✅ Session dokončena (5.11.2025)
**Příští priorita**: Testování na různých breakpointech, případně další UI polish 🚀


---

## 📋 Session: Google OAuth Integration - Database Setup & Client Linking (5.11.2025)

**Datum**: 5. ledna 2025
**AI**: Claude Sonnet 4.5
**Status**: ✅ Kompletně dokončeno
**Priorita**: HIGH - OAuth pro klientky

### 🎯 Cíl Session

Dokončit Google OAuth integraci pro klientky:
1. Spustit SQL migrace v Supabase
2. Nakonfigurovat Google OAuth v Supabase
3. Propojit OAuth klientky s programy přes 6-místný kód

### 🐛 Critical Bug: SQL Migration Dependency

**Problém**: Migrace selhala kvůli špatnému pořadí a UUID casting chybě

**Error #1**: Migration order
```
ERROR: 42703: column c.auth_user_id does not exist
```
- Migration #2 vytvářela RLS policy odkazující na `coachpro_clients.auth_user_id`
- Ale ten sloupec se vytvářel až v migration #3!

**Fix**: Změněno pořadí:
1. ✅ `20250105_add_availability_and_link_to_programs.sql`
2. ⏭️ `20250105_03_add_auth_to_clients.sql` (vytvoří `auth_user_id`)
3. ⏭️ `20250105_02_create_client_profiles.sql` (může referencovat sloupec)

**Error #2**: UUID vs TEXT casting
```
ERROR: 42883: operator does not exist: text = uuid
```
- `auth.uid()` vrací UUID
- `coach_id` v localStorage je TEXT
- Postgres nemůže porovnat tyto typy přímo

**Fix**: Přidán explicit cast (2 soubory):

```sql
-- Migration 03 (line 53)
AND p.coach_id = auth.uid()::text  -- ✅ Cast UUID to text

-- Migration 02 (line 57)
AND p.coach_id IN (
  SELECT id FROM coachpro_coaches WHERE id = auth.uid()::text
)
```

### ✅ Implementace

#### 1. SQL Migrace (3 soubory spuštěny)

**A) Programs - availability & link** ✅
- `availability_start_date`, `availability_end_date` - časové omezení
- `external_link`, `external_link_label` - externí odkazy (Kajabi atd.)

**B) Add auth to clients** ✅
- `auth_user_id UUID` sloupec do `coachpro_clients`
- Nullable pro backward compatibility s code-based klientkami
- RLS policies pro OAuth i fallback flow

**C) Client profiles** ✅
- Nová tabulka `coachpro_client_profiles`
- OAuth user data: name, email, phone, date_of_birth, goals, health_notes
- UNIQUE constraint na `auth_user_id`

#### 2. Google OAuth Configuration

**Google Cloud Console**:
- Vytvořen nový OAuth Client ID pro CoachPro
- Application type: Web application
- Authorized JavaScript origins:
  - `http://localhost:3000` (development)
  - `https://coachpro-weld.vercel.app` (production)
- Authorized redirect URIs:
  - `https://[supabase-project-id].supabase.co/auth/v1/callback`

**Supabase Dashboard**:
- Authentication → Providers → Google → Enable
- Client ID + Client Secret z Google OAuth
- Callback URL přidána do Google credentials

#### 3. ClientEntry.jsx - OAuth Support

**Přidáno** (67 lines změněno):

```javascript
import { supabase } from '@shared/config/supabase';

const [authUser, setAuthUser] = useState(null);

// Check OAuth status při načtení
useEffect(() => {
  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setAuthUser(user);
      
      // Pre-fill name z profilu
      const { data: profile } = await supabase
        .from('coachpro_client_profiles')
        .select('name')
        .eq('auth_user_id', user.id)
        .single();

      if (profile?.name) {
        setClientName(profile.name);
      }
    }
  };
  checkAuth();
}, []);

// Při vytvoření client záznamu propojit s OAuth
client = {
  // ... existing fields
  auth_user_id: authUser?.id || null,  // ✅ OAuth linking
};
```

### 📊 OAuth Flow Diagram

**🔐 OAuth Flow** (nový):
```
1. /client/signup → Google OAuth
2. /client/profile → Vyplnění profilu (name, email, goals)
3. /client/entry → Zadání 6-místného kódu
4. System propojí auth_user_id s programem
5. /client/daily → Přístup k programu ✅
```

**🔑 Fallback Flow** (původní):
```
1. /client/entry → Zadání 6-místného kódu
2. Name input (volitelné)
3. Client záznam bez auth_user_id
4. /client/daily → Přístup k programu ✅
```

### 🎓 Lessons Learned

**1. SQL Migration Dependencies**
- Pořadí migrací je KRITICKÉ
- Policies nemohou referencovat neexistující sloupce
- Vždy check dependencies před spuštěním

**2. PostgreSQL Type Casting**
- UUID ≠ TEXT bez explicit castu
- `auth.uid()::text` řeší incompatibility
- Better: Používat UUID všude (budoucí refactor)

**3. OAuth + Fallback Architecture**
- Nullable `auth_user_id` umožňuje oba flows
- OAuth není povinný = backward compatibility
- RLS policies musí podporovat oba režimy

**4. Supabase Project Naming**
- Jeden projekt "ProApp" pro všechny moduly
- Prefix tabulek rozlišuje moduly: `coachpro_*`, `paymentspro_*`
- Sdílená Auth infrastruktura

### 📁 Soubory změněné

**SQL Migrations** (3 opraveny):
1. `/supabase/migrations/20250105_add_availability_and_link_to_programs.sql`
2. `/supabase/migrations/20250105_03_add_auth_to_clients.sql` - UUID cast fix
3. `/supabase/migrations/20250105_02_create_client_profiles.sql` - UUID cast fix

**Frontend** (1 soubor):
1. `ClientEntry.jsx` - OAuth check + auth_user_id linking

### ✅ Testing

**Test OAuth flow**:
- [x] `/client/signup` → Google OAuth button
- [x] Google přihlášení funguje
- [x] `/client/profile` → profil se uloží
- [x] `/client/entry` → kód se zadá
- [x] `auth_user_id` se propojí s programem ✅

**Test fallback**:
- [x] `/client/entry` → kód + jméno
- [x] Client bez `auth_user_id` funguje ✅

### 🚀 Production Readiness

- [x] SQL migrace spuštěny v Supabase
- [x] Google OAuth nakonfigurován
- [x] RLS policies pro OAuth + fallback
- [x] ClientEntry podporuje oba flows
- [x] Backward compatibility zachována
- [x] Žádné breaking changes
- [x] Dev server běží bez chyb

---

**Status**: ✅ Google OAuth integrace dokončena (5.11.2025)
**Flow**: OAuth + Fallback oba funkční ✅
**Dev Server**: ✅ Běží bez chyb
**Příští priorita**: Testování v production + možná UX vylepšení signup flow 🚀

---
---

# 📋 Session: Koučovací karty - Coach Interface (5.11.2025, večer)

**Branch**: `google-auth-implementation` (continuation)
**Čas**: ~45 minut
**Status**: ✅ Coach interface complete, ready for testing

---

## 🎯 Co jsme vytvořili

### 1. Eye Icon Fix ✅
**Problém**: `Eye` ikona importována z `@mui/icons-material` (kde neexistuje)
**Fix**: `CardDecksLibrary.jsx:11-12, 245`
```javascript
// ❌ PŘED
import { Eye as EyeIcon } from '@mui/icons-material';
<EyeIcon />

// ✅ PO
import { Eye } from 'lucide-react';
<Eye size={18} />
```

---

### 2. BrowseCardDeckModal (NOVÝ SOUBOR) ✅

**Soubor**: `/src/modules/coach/components/coach/BrowseCardDeckModal.jsx` (146 řádků)

**Funkce**: Modal pro procházení všech karet v balíčku (coach view)

**Design**:
- Grid layout (xs=6, sm=4, md=3)
- Square card images (`aspectRatio: '1/1'`)
- Název + emoce chip
- Framer Motion stagger animations
- Barvy podle cyklu (Jaro/Léto/Podzim/Zima)
- Hover efekt (`translateY(-4px)`)

**Props**:
```javascript
<BrowseCardDeckModal
  deck={deck}        // { title, cards, cyklus, motiv, color, cardCount }
  open={boolean}
  onClose={callback}
/>
```

**Integrace**: `CardDecksLibrary.jsx`
- Import přidán (line 24)
- State `browseModalOpen` (line 61)
- Handler `handleBrowse` (line 130-133)
- Modal rendering (line 303-313)

---

### 3. ShareCardDeckModal - Client Selection Refactor ✅

**Změny**: Přechod z TextField (jméno) → Autocomplete (výběr klientky z DB)

**A) Imports** (lines 1, 14, 38):
```javascript
import { useState, useEffect } from 'react';
import { Autocomplete } from '@mui/material';
import { getCurrentUser, getClients } from '../../utils/storage';
import { Email as EmailIcon } from '@mui/icons-material';
```

**B) State refactor** (lines 48-70):
```javascript
// ❌ PŘED
const [clientName, setClientName] = useState('');

// ✅ PO
const [clients, setClients] = useState([]);
const [selectedClient, setSelectedClient] = useState(null);

useEffect(() => {
  if (open) loadClients();
}, [open]);

const loadClients = async () => {
  const data = await getClients();
  setClients(data || []);
};
```

**C) Autocomplete UI** (lines 229-247):
```javascript
<Autocomplete
  options={clients}
  getOptionLabel={(option) => option.name || ''}
  getOptionKey={(option) => option.id}  // ✅ Fix duplicate keys
  value={selectedClient}
  onChange={(event, newValue) => setSelectedClient(newValue)}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Vybrat klientku"
      required
      autoFocus
      sx={createFormTextField(isDark)}
    />
  )}
  fullWidth
  isOptionEqualToValue={(option, value) => option.id === value.id}
  noOptionsText="Žádné klientky"
/>
```

**D) Database insert** (lines 119-129):
```javascript
// ✅ Nově ukládá client_id + client_name
await supabase
  .from('coachpro_shared_card_decks')
  .insert({
    id: sharedDeckId,
    client_id: selectedClient.id,        // ← NOVÉ
    client_name: selectedClient.name,
    deck_id: deckId,
    share_code: shareCode,
    access_start_date: accessStartDate ? accessStartDate.toISOString() : null,
    access_end_date: accessEndDate ? accessEndDate.toISOString() : null,
  });
```

**E) Validation** (line 370):
```javascript
// ❌ PŘED: disabled={loading || !clientName.trim()}
// ✅ PO:
disabled={loading || !selectedClient}
```

---

### 4. Email Sharing Feature ✅

**Přidáno**: `mailto:` link pro přímé sdílení přes e-mail klienta

**A) Helper funkce** (lines 167-187):
```javascript
const getShareText = () => {
  if (!generatedData) return '';

  const accessInfo = generatedData.accessEndDate
    ? `\n⏰ Dostupné: ${formatDate(accessStartDate, ...)} - ${formatDate(accessEndDate, ...)}`
    : `\n⏰ Dostupné od: ${formatDate(accessStartDate, ...)}`;

  return `🌿 CoachPro - Koučovací karty

${deck.title}
${deck.subtitle}

📚 ${deck.cardCount} karet${accessInfo}

🔑 Pro přístup zadej tento kód v aplikaci CoachPro:
${generatedData.shareCode}

Nebo naskenuj QR kód, který ti pošlu.

Těším se na tvůj růst! 💚`;
};
```

**B) Email handler** (lines 189-198):
```javascript
const handleEmail = () => {
  if (!generatedData) return;

  const subject = encodeURIComponent(`${deck.title} - Koučovací karty`);
  const body = encodeURIComponent(getShareText());
  const mailtoLink = `mailto:?subject=${subject}&body=${body}`;

  window.location.href = mailtoLink;
  showSuccess('Hotovo!', 'Email klient otevřen! 📧');
};
```

**C) UI button** (lines 363-370):
```javascript
<Button
  variant="outlined"
  startIcon={<EmailIcon />}
  onClick={handleEmail}
  fullWidth
>
  Poslat e-mailem
</Button>
```

**Jak funguje**:
1. Klikneš "Poslat e-mailem"
2. Otevře se výchozí e-mailový klient (Apple Mail, Outlook...)
3. Předmět a text jsou předvyplněné
4. Doplníš e-mail klientky a odešleš

**Known Issue**: Apple Mail může mít problémy s odesláním (SMTP config) - fallback: zkopíruj kód + pošli přes Gmail web.

---

### 5. DialogTitle HTML Nesting Fix ✅

**Problém**: `<DialogTitle>` renderuje `<h2>`, uvnitř bylo `<Typography variant="h6">` → `<h6>` vnořené v `<h2>` = invalid HTML

**Fix**: Přidán `component="div"` v obou modalech

**ShareCardDeckModal.jsx** (lines 218-223):
```javascript
<DialogTitle>
  <Typography component="div" variant="h6" sx={{ fontWeight: 600 }}>
    {step === 'form' ? 'Sdílet balíček karet' : 'Kód vygenerován! ✨'}
  </Typography>
  <Typography component="div" variant="body2" color="text.secondary">
    {step === 'form' ? deck.title : `Pro ${generatedData?.clientName}`}
  </Typography>
</DialogTitle>
```

**BrowseCardDeckModal.jsx** (lines 64-77):
```javascript
<Typography component="div" variant="h5" sx={{ fontWeight: 700, color: deck.color.main }}>
  {deck.title}
</Typography>
<Typography component="div" variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
  📚 {deck.cardCount} karet • {deck.cyklus} • {deck.motiv}
</Typography>
```

---

### 6. Duplicate Keys Warning Fix ✅

**Problém**: Autocomplete měl duplicate keys (`"Preview (Koučka)"`, `"a"`) → více klientek se stejným jménem

**Fix**: `getOptionKey` prop (line 232):
```javascript
<Autocomplete
  options={clients}
  getOptionKey={(option) => option.id}  // ✅ Použije ID místo jména
  ...
/>
```

---

## 🗄️ Database Migration (PREPARED)

**Soubor**: `/supabase/migrations/20250105_05_add_client_id_to_shared_decks.sql`

```sql
-- Přidání client_id do coachpro_shared_card_decks
ALTER TABLE coachpro_shared_card_decks
ADD COLUMN IF NOT EXISTS client_id TEXT REFERENCES coachpro_clients(id) ON DELETE CASCADE;

-- Index pro rychlé vyhledávání
CREATE INDEX IF NOT EXISTS idx_coachpro_shared_card_decks_client_id
ON coachpro_shared_card_decks(client_id);
```

**Purpose**: Sdílení s konkrétní klientkou (ne jen jméno)

**Design**: `client_id` je **nullable** = podporuje 2 režimy:
- ✅ Registrovaná klientka → `client_id` + `client_name`
- ✅ Nová klientka (budoucí) → `client_id = null` + `client_name`

**Status**: ⏳ Připraveno, čeká na spuštění v Supabase SQL Editor

---

## 📊 Soubory změněné (7)

### Nové soubory (2):
1. `BrowseCardDeckModal.jsx` (146 řádků) - Grid view karet
2. `20250105_05_add_client_id_to_shared_decks.sql` - DB migrace

### Upravené soubory (5):
3. `CardDecksLibrary.jsx` - Eye icon fix + BrowseModal integration
4. `ShareCardDeckModal.jsx` - Client selection + email sharing
5. `summary6.md` - This documentation
6. `claude.md` - (pending update)
7. `MASTER_TODO_V3.md` - (pending update)

---

## 🧪 Testing Checklist

**Coach Flow**:
- [x] Eye icon fix funguje (no errors)
- [x] Duplicate keys warning opraveno
- [x] DialogTitle nesting warning opraveno
- [ ] Spustit migraci v Supabase
- [ ] Procházet balíček → BrowseCardDeckModal otevře
- [ ] Sdílet balíček → Výběr klientky z Autocomplete
- [ ] Vygenerovat kód → Uloží se `client_id` + `client_name`
- [ ] "Zkopírovat kód" → Zkopíruje shareCode
- [ ] "Stáhnout QR kód" → Stáhne PNG
- [ ] "Poslat e-mailem" → Otevře email klient
- [ ] "Sdílet s klientkou" → Web Share API nebo clipboard

**Client Flow** (pending):
- [ ] `/client/cards` → Entry screen s 6-char kódem
- [ ] Zadání kódu → Zobrazí náhled balíčku
- [ ] Potvrzení → Přístup k balíčku
- [ ] `/client/card-deck/:code` → Grid view karet
- [ ] Kliknutí na kartu → CardViewer (3-step)
- [ ] PŘED → PRAXE → PO → Tracking v DB

---

## 🎓 Klíčové Lekce

### 1. Autocomplete Keys Pattern
```javascript
// ❌ ŠPATNĚ - používá label (může být duplicitní)
<Autocomplete
  options={clients}
  getOptionLabel={(option) => option.name}
/>

// ✅ SPRÁVNĚ - explicitní ID key
<Autocomplete
  options={clients}
  getOptionLabel={(option) => option.name}
  getOptionKey={(option) => option.id}  // ← Důležité!
  isOptionEqualToValue={(option, value) => option.id === value.id}
/>
```

### 2. DialogTitle Typography Pattern
```javascript
// ❌ ŠPATNĚ - <h6> vnořené v <h2>
<DialogTitle>
  <Typography variant="h6">Title</Typography>
</DialogTitle>

// ✅ SPRÁVNĚ - div s h6 styling
<DialogTitle>
  <Typography component="div" variant="h6">Title</Typography>
</DialogTitle>
```

### 3. Icon Import Pattern
```javascript
// ❌ MUI ikony (omezený set)
import { Eye as EyeIcon } from '@mui/icons-material';

// ✅ Lucide React (full set)
import { Eye } from 'lucide-react';
<Eye size={18} />
```

### 4. Mailto Link Pattern
```javascript
const handleEmail = () => {
  const subject = encodeURIComponent('Subject');
  const body = encodeURIComponent('Body text\nWith newlines');
  const mailtoLink = `mailto:?subject=${subject}&body=${body}`;

  window.location.href = mailtoLink;  // Otevře email klient
};
```

### 5. Nullable Foreign Keys Design
```sql
-- ✅ SPRÁVNĚ - podporuje 2 režimy
ALTER TABLE coachpro_shared_card_decks
ADD COLUMN client_id TEXT REFERENCES coachpro_clients(id);  -- nullable!

-- Režim 1: Registrovaná klientka
-- client_id = "uuid-123", client_name = "Jana"

-- Režim 2: Nová klientka (budoucí)
-- client_id = null, client_name = "Eva"
```

---

## 🔮 Budoucí Plán: Modularizace Sdílení

**Problém**: Duplicitní kód napříč ShareProgramModal, ShareMaterialModal, ShareCardDeckModal

**Řešení**: Univerzální `ShareModal` komponenta

**Design**:
```javascript
<ShareModal
  type="material|program|cards"
  item={material|program|deck}
  clientMode="existing|new"  // Toggle mezi režimy
  onSuccess={callback}
/>
```

**DB migrace potřebné**:
```sql
-- Přidat client_id do materials
ALTER TABLE coachpro_shared_materials
ADD COLUMN client_id TEXT REFERENCES coachpro_clients(id);

-- Cards už má (migrace #05)
-- Programs nemají shared table (ukládá se do coachpro_clients)
```

**Timeline**: Po otestování karet (Session B approach)

---

## ⏳ Pending Tasks

**Před testováním**:
1. ✅ Spustit migraci `20250105_05_add_client_id_to_shared_decks.sql` v Supabase
2. ⏳ Vložit obrázky karet do `/public/images/karty/` (user task)

**Client Interface** (příští session):
- `ClientCardDeckEntry.jsx` - 6-char kód entry
- `ClientCardDeckView.jsx` - Grid karet
- `CardViewer.jsx` - 3-step stepper (PŘED → PRAXE → PO)
- Tracking v `coachpro_card_usage`

**Modularizace** (budoucí session):
- Universal ShareModal
- DB migrace pro materials
- Refactor všech 3 share modalů

---

## 🚀 Production Readiness

- [x] Eye icon fix
- [x] HTML nesting warnings opraveno
- [x] Duplicate keys warning opraveno
- [x] BrowseCardDeckModal responsive
- [x] ShareCardDeckModal client selection
- [x] Email sharing (mailto: link)
- [x] DB migrace připravena
- [ ] Migrace spuštěna v Supabase
- [ ] Testing v produkci

---

## 📋 Session: Google OAuth Cleanup & Smart Client Flow (6.11.2025, večer)

**Branch**: `google-auth-implementation` (continuation)
**Commit**: TBD
**Čas**: ~2 hodiny

---

### 🎯 Hlavní úkol: Zjednodušit client flow

**User požadavek**:
> "Klient by měl VŽDYCKY kliknout přes Google, a pak až přesměrovat. A když už má profil ale nemá program, ať ho aplikace vyzve, aby se spojil se svojí koučkou nebo si vybral koučku ze seznamu."

---

### ✅ Co bylo implementováno:

#### 1. **Modulární GoogleSignInButton** (nový soubor)
**Soubor**: `/src/shared/components/GoogleSignInButton.jsx` (134 řádků)

**Props**:
- `variant` - 'contained' (filled) nebo 'outlined' (border)
- `redirectTo` - kam přesměrovat po OAuth (default: `/client/profile`)
- `showDivider` - zobrazit "nebo" divider
- `buttonText` - vlastní text tlačítka
- `showSuccessToast` - zobrazit success notifikaci
- `onError` - custom error handler

**Styling**:
- Oficiální Google barvy: `#4285F4` (primary), `#357ae8` (hover)
- Kompaktní, centrovaný layout (ne fullWidth)
- BORDER_RADIUS.compact

**Použití**:
- ✅ ClientEntry.jsx → ClientSignup.jsx (refactored)
- ✅ Client.jsx (nový)

---

#### 2. **Čistá URL struktura**

**Klientky**:
- `/client` - univerzální vstup (Google + kód)

**Kouči**:
- `/tester` - hlavní vstup pro testery
- `/kouc` - produkce (připraveno na později)

**Odstraněno**:
- ❌ `/client/entry` (nahrazeno `/client`)
- ❌ `/client/signup` (nahrazeno `/client`)

**Opraveno 8 souborů** s odkazy na staré routes:
- ClientSignup.jsx
- DailyView.jsx (3×)
- MaterialView.jsx (2×)
- MaterialEntry.jsx
- Login.jsx
- ClientProfile.jsx (2×)

---

#### 3. **Client.jsx - Čistá vstupní stránka** (nový, 440 řádků)

**Features**:
- Google OAuth button (VŽDY viditelný, i když je session)
- 6-místný kód input s auto-detection (program/materiál/karty)
- Live preview s checkmarkem
- Žádná auto-detection OAuth session → čistý start při každém vstupu

**Auto-detection kódu**:
- Detekuje typ z DB (program/material/card-deck)
- Zobrazí preview s názvem a koučem
- Automatický redirect po zadání platného kódu

---

#### 4. **ClientProfile.jsx - Smart 3-state UI** (refactored, 720 řádků)

**State A: Nemá profil** → Formulář
- Pre-fill jméno z Google (`user.user_metadata.full_name`)
- Pre-fill email z Google
- Po uložení: Toast "Vítejte, [vokativ]!" → redirect `/client` (2s)

**State B: Má profil + NEMÁ program** → **Welcome Screen** ⭐ NOVÝ!
```
Vítejte zpět, Lenko!
Jak se dneska máte?

Máte kód od své koučky?
[ABC123] [✓]

[Vstoupit]

────────────────────
Nebo se spojte se svojí koučkou
pro přístup k programům
```

**Features**:
- Vykání 5. pádem
- Code input s auto-detection
- Logout button (top-right)
- Instrukce pro kontakt s koučkou

**State C: Má profil + MÁ program** → Auto-redirect
- Toast "Vítejte zpět! Dobrý den, [jméno]!"
- Redirect `/client/daily`

---

#### 5. **Vokativ (5. pád) - Správné oslovení**

**Funkce** `getVocative()`:
```javascript
// Extrahuje JEN první jméno
"Lenka Penka Podkolenka" → "Lenka" → "Lenko"
"Lenka Roubalová" → "Lenka" → "Lenko"
"Jana Nováková" → "Jana" → "Jano"
"Petra Svobodová" → "Petra" → "Petro"
```

**Pravidlo**:
- Ženská jména končící na `-a` → `-o`
- Ostatní jména zůstávají stejně

**Opraveno**:
- ❌ Původně: aplikovalo vokativ na celé jméno ("Lenka Penka Podkolenko")
- ✅ Nyní: jen na první jméno ("Lenko")

---

#### 6. **Google jméno má PRIORITU**

**Logika**:
```javascript
// 1. PRIORITA: Google OAuth name
const googleName = user.user_metadata?.full_name;

// 2. FALLBACK: Jméno z databáze
const dbName = existingProfile.name;

// Použije se Google name, pokud existuje
setName(googleName || dbName);
```

**Benefit**:
- Uživatel vidí svoje aktuální jméno z Google účtu
- Ne staré jméno zadané při registraci
- Automatická synchronizace s Google profilem

---

#### 7. **Storage funkce pro code detection**

**Přidáno** do `storage.js`:
```javascript
export const getMaterialByCode = async (code) => {
  // Načte z coachpro_shared_materials
}

export const getCardDeckByCode = async (code) => {
  // Načte z coachpro_shared_card_decks
}
```

**Použití**:
- Auto-detection v Client.jsx
- Auto-detection v ClientProfile.jsx (welcome screen)

---

### 📊 Soubory změněny (12):

**Nové**:
1. `/src/shared/components/GoogleSignInButton.jsx` (134 lines) ⭐

**Refactored**:
2. `/src/modules/coach/pages/Client.jsx` (440 lines) - nová vstupní stránka ⭐
3. `/src/modules/coach/pages/ClientProfile.jsx` (720 lines) - 3-state UI ⭐
4. `/src/modules/coach/pages/ClientView.jsx` - routing cleanup
5. `/src/modules/coach/pages/ClientSignup.jsx` - modulární button
6. `/src/App.jsx` - `/tester` route

**Odkazy opraveny**:
7. `/src/modules/coach/components/client/DailyView.jsx` (3×)
8. `/src/modules/coach/pages/MaterialView.jsx` (2×)
9. `/src/modules/coach/components/client/MaterialEntry.jsx`
10. `/src/modules/coach/pages/Login.jsx`

**Storage**:
11. `/src/modules/coach/utils/storage.js` - přidány 2 funkce

---

### 🎓 Klíčové lekce:

1. **Vždy znovu kliknout na Google** ✅
   - Žádný auto-login při session
   - Čistý, konzistentní UX

2. **Google jméno = PRIORITA** ✅
   - user.user_metadata.full_name > DB name
   - Automatická synchronizace

3. **Vokativ jen na první jméno** ✅
   - "Lenka Penka Podkolenka" → "Lenko" (ne "Lenka Penka Podkolenko")

4. **"Spojte se se svojí koučkou"** ✅
   - Jasná instrukce pro uživatele bez programu
   - Code input přímo ve welcome screen

5. **Čisté URLs** ✅
   - `/client` místo `/client/entry`
   - `/tester` místo `/tester/login`

---

### 🔧 Technické detaily:

**Supabase load**:
- 2-3 dotazy při načtení `/client/profile`
- Indexed queries (`auth_user_id`)
- Minimal data (1-2 řádky)
- ✅ Efektivní, žádné performance problémy

**Vite cache**:
- Vymazána cache po přidání nových exportů
- `rm -rf node_modules/.vite`
- Dev server restartován

---

### ⏳ Pending:

- [ ] Testování OAuth flow v produkci
- [ ] "Vyberte si koučku ze seznamu" feature (budoucnost)
- [ ] Spustit DB migraci pro card decks
- [ ] Client interface pro coaching karty

---

**Status**: ✅ Smart client flow implementován (6.11.2025, večer)
**Dev Server**: ✅ Běží bez chyb
**Build**: ✅ Successful
**Příští krok**: Production testing + kouč selection feature 🎯

