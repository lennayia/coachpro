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

## 🎯 Aktuální Práce (6.11.2025, večer)

**Aktuální task**: Google OAuth Cleanup & Smart Client Flow - DOKONČENO ✅
**Commit**: TBD
**Branch**: `google-auth-implementation` (continuation)

### Co bylo hotové v této session:
- ✅ GoogleSignInButton.jsx (modulární komponenta, 134 řádků)
- ✅ Client.jsx (nová čistá vstupní stránka, 440 řádků)
- ✅ ClientProfile.jsx - 3-state UI (welcome screen, 720 řádků)
- ✅ Vokativ (5. pád) - jen první jméno (Lenka → Lenko)
- ✅ Google jméno má prioritu nad DB jménem
- ✅ URL cleanup - /client (ne /client/entry)
- ✅ getMaterialByCode() + getCardDeckByCode() v storage.js
- ✅ 8 souborů opraveno (odkazy na staré routes)

### Předchozí sessions:
- ✅ Koučovací karty - Coach Interface (5.11.2025, večer)
- ✅ Google OAuth integration (5.11.2025, ráno)
- ✅ MaterialCard Layout Reorganization (5.11.2025)
- ⚠️ MaterialCard.jsx NEpoužívá BaseCard (tech debt zůstává)

---

## 📁 Klíčové Soubory

### Client Flow (OAuth + Kód)
- ✅ `/src/modules/coach/pages/Client.jsx` - Čistá vstupní stránka (440 řádků)
- ✅ `/src/modules/coach/pages/ClientProfile.jsx` - 3-state UI (720 řádků)
- ✅ `/src/shared/components/GoogleSignInButton.jsx` - Modulární OAuth button (134 řádků)
- ✅ `/src/modules/coach/utils/storage.js` - getMaterialByCode, getCardDeckByCode

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

---

## 🔐 OAuth Integration Update (5.11.2025)

**Features Added**:
- Google OAuth pro klientky
- Dual flow: OAuth + Fallback (code-based)
- `auth_user_id` nullable v `coachpro_clients`

**Client Profiles**:
```
coachpro_client_profiles:
- auth_user_id (UNIQUE)
- name, email, phone
- date_of_birth
- goals, health_notes
```

**RLS Policies**: Podporují OAuth i fallback

**Frontend**: ClientEntry.jsx checks OAuth status, links via auth_user_id

**Production**: ✅ Ready (SQL migrations run, Google OAuth configured)

---

## 🎴 Koučovací Karty - Key Patterns (5.11.2025)

### Autocomplete Duplicate Keys Fix
```javascript
<Autocomplete
  options={clients}
  getOptionLabel={(option) => option.name || ''}
  getOptionKey={(option) => option.id}  // ← DŮLEŽITÉ pro unique keys!
  isOptionEqualToValue={(option, value) => option.id === value.id}
/>
```

### DialogTitle Typography Nesting
```javascript
// ✅ SPRÁVNĚ - component="div" předchází HTML nesting warnings
<DialogTitle>
  <Typography component="div" variant="h6">Title</Typography>
  <Typography component="div" variant="body2">Subtitle</Typography>
</DialogTitle>
```

### Mailto Link Pattern
```javascript
const handleEmail = () => {
  const subject = encodeURIComponent('Subject');
  const body = encodeURIComponent('Body\nWith newlines');
  const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
  window.location.href = mailtoLink;
};
```

### Nullable Foreign Keys Design
```sql
-- Podporuje 2 režimy: registrovaná + nová klientka
ALTER TABLE coachpro_shared_card_decks
ADD COLUMN client_id TEXT REFERENCES coachpro_clients(id);  -- nullable!

-- Režim 1: client_id = "uuid-123", client_name = "Jana"
-- Režim 2: client_id = null, client_name = "Eva"
```

### Pending Tasks
- [ ] Spustit migraci `20250105_05_add_client_id_to_shared_decks.sql`
- [ ] Vložit obrázky karet do `/public/images/karty/`
- [ ] Client interface (ClientCardDeckEntry, ClientCardDeckView, CardViewer)
- [ ] Modularizace sdílení (Universal ShareModal pro materiály + programy + karty)
