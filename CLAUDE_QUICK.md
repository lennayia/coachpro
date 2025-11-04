# ⚡ CLAUDE QUICK - Kritická pravidla pro AI asistenta

> **Účel**: Rychlý přehled nejdůležitějších pravidel. Pro detaily viz CLAUDE.md

**Poslední update**: 4. listopadu 2025
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

---

## 📁 DŮLEŽITÉ SOUBORY

**Kritické - NIKDY nemazat:**
- `/src/styles/borderRadius.js` - Border-radius systém
- `/src/shared/styles/modernEffects.js` - Glassmorphism funkce
- `/src/shared/components/FloatingMenu.jsx` - Settings menu
- `/src/shared/components/NavigationFloatingMenu.jsx` - Navigace
- `/src/shared/context/NotificationContext.jsx` - Toast systém
- `/src/modules/coach/utils/storage.js` - LocalStorage + Supabase
- `/src/modules/coach/utils/supabaseStorage.js` - Supabase upload/delete

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

---

## 📊 AKTUÁLNÍ STAV (4.11.2025)

**Sprint**: Session 11b - Modularity Cleanup
**Status**: ✅ Logo změněno na bílé (filter: brightness(0) invert(1))
**Pending**: Help buttons na ProgramsList a ClientsList

**Tech Stack**: React 18, MUI v6, Vite, Supabase
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
