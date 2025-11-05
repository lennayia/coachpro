# ⚡ Quick Context pro Auto-Compact Sessions

> **Účel**: Rychlý přehled pro Claude při auto-compactu, aby nemusel číst velké soubory

---

## 📚 DŮLEŽITÉ: Nová dokumentační struktura

**Pro rychlou práci**: Čti `CLAUDE_QUICK.md` (200 řádků) místo CLAUDE.md (9000+ řádků)!

**Dokumentace:**
- `CLAUDE_QUICK.md` - Kritická pravidla, quick patterns (ZAČNI TADY!)
- `CLAUDE.md` - Kompletní historie (JEN když potřebuješ detaily)
- `summary.md` - Changelog sprintů
- `MASTER_TODO_V3.md` - TODO list (AKTUÁLNÍ)

---

## 🎯 Aktuální Práce (5.11.2025)

**Aktuální task**: Sprint 18c - BaseCard Feedback Modularity Fix - DOKONČENO ✅
**Status**: ✅ BaseCard.jsx - feedback jako built-in feature (feedbackData, onFeedbackClick props)
**Status**: ✅ ProgramCard.jsx - refactored na modular řešení (47 řádků odstraněno)
**Status**: ✅ Dokumentace aktualizována (summary6.md, MASTER_TODO_V3.md, claude.md)
**Discovery**: ⚠️ MaterialCard.jsx NEpoužívá BaseCard - tech debt (čeká na rozhodnutí)
**Pending**: MaterialCard refactor na BaseCard (pending user decision)

---

## 📁 Klíčové Soubory

### Komponenty s Help Systémem
- ✅ `/src/shared/constants/helpContent.js` - VYTVOŘENO (417 lines)
- ✅ `/src/shared/components/HelpDialog.jsx` - VYTVOŘENO (190 lines)
- ✅ `/src/modules/coach/components/coach/DashboardOverview.jsx` - Help button přidán
- ✅ `/src/modules/coach/components/coach/MaterialsLibrary.jsx` - Help button přidán
- ⏳ `/src/modules/coach/components/coach/ProgramsList.jsx` - ČEKÁ na help button
- ⏳ `/src/modules/coach/components/coach/ClientsList.jsx` - ČEKÁ na help button

### FloatingMenu
- `/src/shared/components/FloatingMenu.jsx` - Position: absolute, right: 16, top: 50%
- `/src/shared/components/Header.jsx` - FloatingMenu na řádku 138, prop onFloatingMenuToggle
- `/src/shared/components/Layout.jsx` - State floatingMenuOpen, glassmorphism backdrop

---

## 🐛 Známé Problémy

1. **DailyView.jsx line 962** - JSX closing tag error (PRE-EXISTING, nesouvisí s current work)

---

## 🔧 Modular Systems (VŽDY POUŽÍT!)

1. **BORDER_RADIUS** - `import BORDER_RADIUS from '@styles/borderRadius'`
2. **Glassmorphism** - `import { createBackdrop, createGlassDialog } from '@shared/styles/modernEffects'`
3. **QuickTooltip** - `import QuickTooltip from '@shared/components/AppTooltip'`
4. **Toast** - `import { useNotification } from '@shared/context/NotificationContext'`

---

## 📊 Help System Pattern

```javascript
// Import
import { IconButton, useTheme } from '@mui/material';
import { HelpCircle } from 'lucide-react';
import HelpDialog from '@shared/components/HelpDialog';
import QuickTooltip from '@shared/components/AppTooltip';

// State
const [helpDialogOpen, setHelpDialogOpen] = useState(false);
const theme = useTheme();
const isDark = theme.palette.mode === 'dark';

// Button (48x48px, CoachPro greens)
<QuickTooltip title="Nápověda k [Page Name]">
  <IconButton
    onClick={() => setHelpDialogOpen(true)}
    sx={{
      width: 48,
      height: 48,
      backgroundColor: isDark ? 'rgba(120, 188, 143, 0.15)' : 'rgba(65, 117, 47, 0.15)',
      color: isDark ? 'rgba(120, 188, 143, 0.9)' : 'rgba(65, 117, 47, 0.9)',
      transition: 'all 0.3s',
      '&:hover': {
        backgroundColor: isDark ? 'rgba(120, 188, 143, 0.25)' : 'rgba(65, 117, 47, 0.25)',
        transform: 'scale(1.05)',
      },
    }}
  >
    <HelpCircle size={24} />
  </IconButton>
</QuickTooltip>

// Dialog
<HelpDialog
  open={helpDialogOpen}
  onClose={() => setHelpDialogOpen(false)}
  initialPage="dashboard" // nebo "materials", "programs", atd.
/>
```

---

## 🎨 FloatingMenu Specs - Ultramoderní Design

**Position**: `absolute` v Header.jsx, `right: 16`, `top: '50%'`
**Sizes**: 48×48px buttons, 20px icons
**Tooltips**: QuickTooltip, placement="left" (ne bottom!)
**Menu Items**: User, Theme Toggle, Beta Info, Help, Logout

**Moderní Efekty (VŠECHNY ikony)**:
- Primary-secondary gradienty (green → pink)
- Shine animation (::before pseudo-element)
- Inset highlights (3D dojem)
- Border s theme colors
- Backdropfilter blur(10px)
- Scale 1.1× on hover + translateX(-4px)

**Glassmorphism Backdrop (když otevřené)**:
- V Layout.jsx jako direct child root Box (před Header/Sidebar)
- Fixed position, fullscreen
- Blur(8px) + kouřový efekt (radial gradienty)
- zIndex: 1200 (menu má 1300)
- pointerEvents: none
- State lifting: FloatingMenu → Header → Layout

**Backdrop Strip v Layout.jsx**:
- Width: 90px, jemný gradient pozadí
- Position: absolute, right: 0
- Main content má `pr: 15` (120px padding)

---

## 🚀 Rychlé Akce

**Zkontrolovat FloatingMenu tooltips**:
```bash
grep -n "QuickTooltip" src/shared/components/FloatingMenu.jsx
```

**Zkontrolovat MaterialLibrary padding**:
```bash
grep -n "px:" src/modules/coach/components/coach/MaterialsLibrary.jsx | head -5
```

---

## 💡 Pro Budoucí Claude

1. Přečti TENTO soubor NEJDŘÍV při auto-compactu
2. Pokud potřebuješ detaily, teprve pak čti velké soubory
3. CLAUDE.md má kompletní dokumentaci projektu (ale je 9000+ řádků)
4. summary.md má changelog (ale je také velký)

---

**Poslední update**: 5.11.2025, večer
**Autor**: Lenka + Claude Sonnet 4.5
