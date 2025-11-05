# ⚡ CLAUDE QUICK - Kritická pravidla pro AI asistenta

> **Účel**: Rychlý přehled nejdůležitějších pravidel. Pro detaily viz CLAUDE.md

**Poslední update**: 5. listopadu 2025 (večer)
**Pro full dokumentaci**: Čti CLAUDE.md (ale JEN když potřebuješ detaily!)

---

## 🚨 KRITICKÁ PRAVIDLA - VŽDY DODRŽUJ

### 1. ⚠️ SUPABASE FOREIGN KEY CONSTRAINTS

**PŘED každým `saveMaterial()`, `saveProgram()`, `createSharedMaterial()` MUSÍŠ:**

```javascript
if (material.coachId) {
  let coach = await getCoachById(material.coachId);
  if (!coach) {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === material.coachId) {
      await saveCoach(currentUser);
    }
  }
}
// Teprve TEĎ save material/program
```

**Proč**: Coach musí existovat v DB PŘED vytvořením materiálu (foreign key constraint)

### 2. 🎨 BORDER_RADIUS Systém

**NIKDY hardcoded hodnoty:**
```javascript
// ❌ ŠPATNĚ:
borderRadius: 2
borderRadius: '20px'

// ✅ SPRÁVNĚ:
import BORDER_RADIUS from '@styles/borderRadius';
borderRadius: BORDER_RADIUS.card
```

**Hodnoty:**
- `minimal: 8px` - Progress bary
- `small: 12px` - Menu items
- `compact: 16px` - Buttons, inputs
- `card: 20px` - Karty (default)
- `premium: 24px` - Velké prvky

### 3. 🔧 PATH ALIASES

**VŽDY používej:**
```javascript
✅ import BORDER_RADIUS from '@styles/borderRadius';
✅ import { useGlassCard } from '@shared/hooks/useModernEffects';
❌ import BORDER_RADIUS from '../../../styles/borderRadius';
```

### 4. 📦 MODULÁRNÍ SYSTÉMY (6 systémů)

Při KAŽDÉ nové komponentě kontroluj:

1. **BORDER_RADIUS** - import a použití konstant
2. **Glassmorphism** - `createBackdrop()`, `createGlassDialog()`
3. **QuickTooltip** - všechny IconButtons wrapped
4. **Toast notifications** - `useNotification()` hook
5. **Touch handlers** - swipe, long-press
6. **Path aliases** - @styles, @shared

**Gold Standard**: `MaterialCard.jsx` - plně implementuje všech 6

### 5. 🔔 NOTIFIKACE - Modulární systém

```javascript
import { useNotification } from '@shared/context/NotificationContext';
const { showSuccess, showError, showInfo, showWarning } = useNotification();

showSuccess('Hotovo!', 'Akce byla úspěšná');
showError('Chyba', 'Něco se pokazilo');
```

**Features:**
- Glassmorphism design
- Audio feedback (notification.mp3)
- Auto-dismiss 5s
- Position: top right

### 6. 🎯 FLOATING MENU - Dva menu

**FloatingMenu** (settings, vpravo `right: 16`):
- User, Theme, Beta Info, Help, Logout
- Primary-secondary gradienty
- Shine efekty

**NavigationFloatingMenu** (navigace, vpravo `right: 80`):
- Logo CoachPro (bílé: `filter: brightness(0) invert(1)`)
- Dashboard, Materiály, Programy, Klientky
- Mutual exclusion (otevře se jen jedno)

**Mutual exclusion v Header.jsx:**
```javascript
const [navigationMenuOpen, setNavigationMenuOpen] = useState(false);
const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

// Když otevřeš jedno, druhé se zavře
```

### 7. 🎨 DESIGN PREFERENCE

**Uživatelka CHCE:**
- ✅ Kompaktní design
- ✅ Glassmorphism efekty
- ✅ Minimalistický styl
- ✅ Proporcionální zakulacení

**Uživatelka NECHCE:**
- ❌ Emoji v UI (jen v textu/content)
- ❌ Velká tlačítka (fullWidth jen když nutné)
- ❌ Příliš velké mezery
- ❌ Nekonzistentní styling

### 8. 🔒 MAZÁNÍ STARÉHO KÓDU

**VŽDY SMAZAT, NE KOMENTOVAT:**
```javascript
// ❌ ŠPATNĚ:
// const oldFunction = () => { ... };
const newFunction = () => { ... };

// ✅ SPRÁVNĚ:
const newFunction = () => { ... };
```

### 9. 🌍 KOMUNIKACE

**VŽDY ČESKY** - uživatelka je česká!

### 10. 🎯 PRODUCTION STATUS AWARENESS

**KRITICKÉ - VŽDY SI PAMATUJ:**

✅ **PROJEKT JE V PRODUKCI NA SUPABASE!** (od 3.11.2025)

**Uživatelka zdůraznila (4.11.2025)**:
- "A Supabase už přece máme!"
- "my už jsme v produkčním režimu na supabase, to přece už musíš vědět za tu dobu!"

**Co to znamená:**
- ❌ NENAVRHUJ "future Supabase integration" - UŽ JE integrovaný!
- ❌ NEŘÍKEJ "až budeme mít Supabase" - UŽ MÁME!
- ✅ 300ms delay v MaterialsLibrary = simulace async, NE "čekání na Supabase"

### 11. 🔄 INLINE VS MODULAR TRADE-OFFS

**Někdy je lepší RYCHLÉ ŘEŠENÍ než VELKÝ REFACTOR:**

**Příklad z 4.11.2025:**
- Problém: Button není responsive
- Option A: Inline fix (5 minut)
- Option B: Full button modularity system (6-8 hodin)

**User rozhodnutí**: "no, jenže to bychom zas měli opravdu hodně práce s tím, viď?"

**Řešení:**
```javascript
// Inline responsive padding
sx={{
  px: { xs: 2, sm: 3 },
  py: { xs: 0.75, sm: 1 }
}}
```

**Pattern:**
- Zeptej se na scope (inline vs modular)
- Když time constraint → inline solution
- Dokumentuj full refactor jako FUTURE TASK
- Explicitně označ trade-off

### 12. 📝 DOCUMENTATION PATTERN

**COMPLETED vs FUTURE WORK - oddělit!**

**User feedback (4.11.2025)**:
> "já jsem ale chtěla, abys tam zapsal, že musíme udělat modularitu pro tlačítka a popsal, jak - jako úkol na později"

**Správný pattern:**

```markdown
## Session Work (4.11.2025) ✅
- MaterialCardSkeleton refactor
- Button inline fix
- Sprint 18b dokumentace

## Sprint 18b: Button Modularity (FUTURE) ⏳
- Status: Pending
- Odhad: 6-8 hodin
- 5 functions to create
- 3 implementation phases
```

**KEY**: Hotovou práci ✅ vs budoucí úkoly ⏳ - VŽDY oddělit!

### 13. 🛠️ USER INSTRUCTIONS PATTERN

**Kdy poskytnout INSTRUKCE místo AUTOMATICKÉ OPRAVY:**

**User říká**: "ukaž jak, opravím sama"

**Příklad (4.11.2025)**:
```
User: "Beta badge by mělo být secondary color. Pokud stačí, ukaž jak, opravím sama."

AI: Header.jsx:
- Line 133: backgroundColor: '#FF9800' → 'secondary.main'
- Line 138: backgroundColor: '#F57C00' → 'secondary.dark'
```

**Pattern:** Respektuj user autonomii - někdy chce opravit sama!

### 14. 🎯 BASECARD MODULARITY - KRITICKÉ!

**⚠️ NOVÉ PRAVIDLO (5.11.2025)**

**User feedback**: "k čemu ale máme baseCard.jsx, když to pak napíšeš natvrdo do ProgramCard?"

**PRAVIDLO:**
- ❌ NIKDY hardcodovat UI do specific cards (ProgramCard, MaterialCard, ClientCard)
- ✅ VŽDY implementovat features v BaseCard.jsx
- ✅ Specific cards JEN předávají data (props), ne UI

**Příklad - Feedback Button:**

```javascript
// ❌ ŠPATNĚ - hardcoded v ProgramCard (47 řádků)
const footer = program.programFeedback && program.programFeedback.length > 0 ? (
  <Box onClick={...} sx={{ ... 40 řádků styling }}>
    <MessageSquare />
    <Typography>{program.programFeedback.length}× reflexe</Typography>
  </Box>
) : null;

// ✅ SPRÁVNĚ - modular v BaseCard
<BaseCard
  feedbackData={program.programFeedback}
  onFeedbackClick={() => setFeedbackModalOpen(true)}
/>
```

**Benefit:**
- Změny UI na JEDNOM místě (BaseCard)
- Automatické propagování všude
- Consistency napříč kartami
- DRY princip dodržen

**Tech Debt Discovery:**
- MaterialCard.jsx NEpoužívá BaseCard → identifikováno jako tech debt
- Čeká na user rozhodnutí: quick fix vs. proper refactor

---

## 📁 DŮLEŽITÉ SOUBORY

**Kritické - NIKDY nemazat:**
- `/src/styles/borderRadius.js` - Border-radius systém
- `/src/shared/styles/modernEffects.js` - Glassmorphism funkce
- `/src/shared/styles/responsive.js` - Responsive utilities (createTextEllipsis)
- `/src/shared/components/cards/BaseCard.jsx` - ⚠️ FOUNDATION pro všechny karty (Program, Material, Client)
- `/src/shared/components/FloatingMenu.jsx` - Settings menu
- `/src/shared/components/NavigationFloatingMenu.jsx` - Navigace
- `/src/shared/context/NotificationContext.jsx` - Toast systém
- `/src/modules/coach/utils/storage.js` - LocalStorage + Supabase
- `/src/modules/coach/utils/supabaseStorage.js` - Supabase upload/delete
- `/src/modules/coach/components/coach/MaterialCardSkeleton.jsx` - 8-row loading pattern

**Dokumentační:**
- `CLAUDE.md` - Kompletní dokumentace (9000+ řádků)
- `CLAUDE_QUICK.md` - Tento soubor
- `CONTEXT_QUICK.md` - Aktuální kontext
- `summary.md` - Changelog všech sprintů
- `MASTER_TODO_V3.md` - TODO list (AKTUÁLNÍ)

---

## 🎨 QUICK PATTERNS

### Glassmorphism Dialog:
```javascript
import { createBackdrop, createGlassDialog } from '@shared/styles/modernEffects';
import BORDER_RADIUS from '@styles/borderRadius';

<Dialog
  BackdropProps={{ sx: createBackdrop() }}
  PaperProps={{ sx: createGlassDialog(isDark, BORDER_RADIUS.dialog) }}
>
```

### Toast Notification:
```javascript
import { useNotification } from '@shared/context/NotificationContext';
const { showSuccess, showError } = useNotification();

showSuccess('Hotovo!', 'Akce byla úspěšná');
showError('Chyba', 'Něco se pokazilo');
```

### QuickTooltip:
```javascript
import QuickTooltip from '@shared/components/AppTooltip';

<QuickTooltip title="Popis akce">
  <IconButton onClick={handleClick}>
    <Icon size={18} />
  </IconButton>
</QuickTooltip>
```

### Skeleton Loader (8-row pattern):
```javascript
// MaterialCardSkeleton pattern - lze adaptovat pro Program/Client
<Card sx={{ minHeight: 280, borderRadius: BORDER_RADIUS.card }}>
  <CardContent sx={{ p: 3, pr: 2.5 }}>
    {/* Row 1: Icons (large left + 4 action right) */}
    <Box display="flex" justifyContent="space-between" mb={1.5}>
      <Skeleton variant="circular" width={40} height={40} />
      <Box display="flex" gap={0.75}>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} variant="circular" width={22} height={22} />
        ))}
      </Box>
    </Box>

    {/* Rows 2-8: Chip, Metadata, URL, Title, Desc, Taxonomy, Button */}
    {/* See MaterialCardSkeleton.jsx pro full pattern */}
  </CardContent>
</Card>
```

### Responsive Button Padding:
```javascript
// Inline solution pro responsive buttons
sx={{
  px: { xs: 2, sm: 3 },   // 16px → 24px
  py: { xs: 0.75, sm: 1 }  // 6px → 8px
}}
```

---

## 📊 AKTUÁLNÍ STAV (5.11.2025, odpoledne)

**Session**: MaterialCard Layout Reorganization
**Commit**: `d8eef24`
**Branch**: `feature/sprint18c-basecard-modularity`

**Dokončeno**:
- ✅ MaterialCard layout reorganized (Row 1: icon+chip+date | Row 2: actions)
- ✅ Creation date s Calendar icon (numeric: 5. 11. 2025)
- ✅ Metadata reordered: fileSize → duration → pageCount
- ✅ Alignment fixes s negative margins (ml/mr)
- ✅ Row 9 always present (minHeight pro konzistenci)
- ✅ CARD_PADDING zvětšen na desktopu (20px)
- ✅ Responsive touch targets (36px mobil, 44px desktop)
- ✅ Icon gap optimization (4px xs, 6px sm+)
- ✅ Overflow ikony koše vyřešen (500-572px range)

**Předchozí (Sprint 18c)**:
- ✅ BaseCard.jsx - feedback jako built-in feature
- ✅ ProgramCard.jsx - refactored na modular

**Tech Debt**:
- ⚠️ MaterialCard.jsx NEpoužívá BaseCard (zůstává standalone)

**Pending**:
- [ ] Help buttons na ProgramsList a ClientsList
- [ ] Sprint 18b: Button Modularity System (6-8 hodin)

**Tech Stack**: React 18, MUI v6, Vite, Supabase
**Status**: ✅ V PRODUKCI na Supabase (od 3.11.2025)
**Dev Server**: `http://localhost:3000/`
**Production**: `https://coachpro-weld.vercel.app/`

---

## 🚀 PRO RYCHLOU PRÁCI

1. **Vždy začni checklistem** - 6 modulárních systémů
2. **Podívej se na MaterialCard.jsx** - jak to implementuje?
3. **Používej path aliases**
4. **Testuj v obou režimech** - light + dark
5. **Dokumentuj změny** - summary.md, MASTER_TODO_V3.md

---

**Pro full dokumentaci**: Čti `CLAUDE.md` (ale JEN když potřebuješ detaily o konkrétním sprintu!)
**Pro sprint history**: Čti `summary.md`
**Pro aktuální kontext**: Čti `CONTEXT_QUICK.md`
**Pro TODO**: Čti `MASTER_TODO_V3.md`
