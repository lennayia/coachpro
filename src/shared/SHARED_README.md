# CoachPro Shared Modules - Dokumentace

Tento dokument popisuje všechny sdílené moduly, hooks a utility funkce v CoachPro aplikaci.

## 📋 Obsah

- [Hooks](#hooks)
- [Komponenty](#komponenty)
- [Utilities](#utilities)
- [Styly](#styly)
- [Context](#context)

---

## Hooks

### `useResponsive`

Hook pro responsive design s konzistentními breakpointy.

**Lokace:** `/src/shared/hooks/useResponsive.js`

**Použití:**
```javascript
import { useResponsive } from '@shared/hooks/useResponsive';

function MyComponent() {
  const { isMobile, isTablet, isDesktop, isVeryNarrow } = useResponsive();

  return (
    <Box>
      {isMobile ? <MobileView /> : <DesktopView />}
    </Box>
  );
}
```

**API:**
- `isMobile` - < 900px
- `isTablet` - 900px - 1200px
- `isDesktop` - >= 1200px
- `isVeryNarrow` - < 600px
- `up(breakpoint)` - >= breakpoint
- `down(breakpoint)` - < breakpoint
- `between(start, end)` - mezi breakpointy
- `only(breakpoint)` - jen daný breakpoint
- `isPortrait` - portrétová orientace
- `isLandscape` - krajinná orientace
- `isTouchDevice` - touch zařízení

---

### `useAsync`

Hook pro správu asynchronních operací s loading a error stavy.

**Lokace:** `/src/shared/hooks/useAsync.js`

**Použití:**
```javascript
import { useAsync } from '@shared/hooks/useAsync';

function MyComponent() {
  const { execute, loading, error, data } = useAsync(fetchData, {
    onSuccess: (data) => console.log('Success!', data),
    showSuccessToast: true,
    successMessage: 'Data načtena!'
  });

  return (
    <Button onClick={execute} disabled={loading}>
      {loading ? 'Načítání...' : 'Načíst data'}
    </Button>
  );
}
```

**Utility funkce:**
- `safeAsync(fn, options)` - bezpečné volání async funkcí
- `withRetry(fn, options)` - retry logika s exponential backoff

---

### `useModal`

Hook pro jednoduchou správu dialogů a modálů.

**Lokace:** `/src/shared/hooks/useModal.js`

**Použití:**
```javascript
import { useModal } from '@shared/hooks/useModal';

function MyComponent() {
  const modal = useModal();

  return (
    <>
      <Button onClick={() => modal.open({ userId: 123 })}>
        Otevřít modal
      </Button>
      <Dialog open={modal.isOpen} onClose={modal.close}>
        <DialogTitle>Detail uživatele {modal.data?.userId}</DialogTitle>
      </Dialog>
    </>
  );
}
```

**Další hooks:**
- `useWizard(totalSteps)` - multi-step dialogy
- `useConfirm()` - confirmation dialogy

---

## Komponenty

### `NotificationContainer` + `NotificationContext`

Notifikační systém portovaný z PaymentsPro.

**Lokace:** `/src/shared/context/NotificationContext.jsx`, `/src/shared/components/NotificationContainer.jsx`

**Použití:**
```javascript
import { useNotification } from '@shared/context/NotificationContext';

function MyComponent() {
  const { showSuccess, showError, showInfo, showWarning } = useNotification();

  const handleSave = () => {
    showSuccess('Hotovo!', 'Program byl úspěšně uložen');
  };

  return <Button onClick={handleSave}>Uložit</Button>;
}
```

**API:**
- `showSuccess(title, message)` - zelená notifikace
- `showError(title, message)` - červená notifikace
- `showInfo(title, message)` - modrá notifikace
- `showWarning(title, message)` - oranžová notifikace

---

### `LoadingState`

Univerzální loading komponenty.

**Lokace:** `/src/shared/components/LoadingState.jsx`

**Komponenty:**
- `LoadingSpinner` - základní spinner
- `LoadingOverlay` - full-page overlay
- `InlineLoader` - inline loader
- `CardSkeleton` - skeleton pro karty
- `ListSkeleton` - skeleton pro seznamy
- `TextSkeleton` - skeleton pro text
- `LoadingWrapper` - conditional rendering wrapper

**Použití:**
```javascript
import { LoadingSpinner, LoadingOverlay, CardSkeleton } from '@shared/components/LoadingState';

// Základní spinner
<LoadingSpinner message="Načítání dat..." />

// Full-page overlay
{loading && <LoadingOverlay message="Ukládání..." />}

// Skeleton pro karty
<CardSkeleton count={3} height={200} />
```

---

### `AppTooltip`

Jednotná komponenta pro tooltips.

**Lokace:** `/src/shared/components/AppTooltip.jsx`

**Použití:**
```javascript
import AppTooltip, { QuickTooltip, InfoTooltip } from '@shared/components/AppTooltip';

// Základní tooltip
<AppTooltip title="Popis akce">
  <IconButton><DeleteIcon /></IconButton>
</AppTooltip>

// Rychlý tooltip (pro ikony)
<QuickTooltip title="Upravit">
  <IconButton><EditIcon /></IconButton>
</QuickTooltip>

// Info tooltip (s delším delay)
<InfoTooltip title="Toto je podrobná nápověda...">
  <HelpIcon />
</InfoTooltip>
```

---

## Utilities

### `glassmorphism.js`

Glassmorphism utility funkce pro konzistentní design.

**Lokace:** `/src/shared/styles/glassmorphism.js`

**Použití:**
```javascript
import {
  glassmorphism,
  glassmorphismWithGradient,
  glassmorphismLight,
  shineAnimation,
  radialGlow,
} from '@shared/styles/glassmorphism';

// Základní glassmorphism
<Card sx={{ ...glassmorphism() }}>Content</Card>

// S radiálním gradientem
<Card sx={{ ...glassmorphismWithGradient() }}>Content</Card>

// Lehčí varianta (pro vnořené boxy)
<Box sx={{ ...glassmorphismLight({ borderRadius: '32px' }) }}>Content</Box>

// S shine animací
<Button sx={{ ...shineAnimation() }}>Animované tlačítko</Button>
```

**Dostupné funkce:**
- `glassmorphism(options)` - základní efekt
- `glassmorphismWithGradient(options)` - s radiálním gradientem
- `glassmorphismLight(options)` - lehčí varianta
- `glassmorphismToast(options)` - pro notifikace
- `glassmorphismHover(options)` - hover stav
- `shineAnimation()` - shine efekt
- `radialGlow(color)` - radial glow
- `insetHighlight(options)` - 3D vzhled

---

### `touchHandlers.js`

Touch handling utilities pro mobilní zařízení.

**Lokace:** `/src/shared/utils/touchHandlers.js`

**Použití:**
```javascript
import {
  isTouchDevice,
  createSwipeHandlers,
  createLongPressHandler,
} from '@shared/utils/touchHandlers';

// Detekce touch zařízení
if (isTouchDevice()) {
  // mobile-specific code
}

// Swipe handlers
const swipe = createSwipeHandlers({
  onSwipeLeft: () => console.log('Swipe left'),
  onSwipeRight: () => console.log('Swipe right'),
  threshold: 50
});

<div {...swipe}>Swipeable content</div>

// Long press handler
const longPress = createLongPressHandler({
  onLongPress: () => console.log('Long press'),
  delay: 500
});

<button {...longPress}>Press me</button>
```

---

### `animations.js`

Předpřipravené animace pro framer-motion.

**Lokace:** `/src/shared/utils/animations.js`

**Použití:**
```javascript
import { motion } from 'framer-motion';
import {
  fadeIn,
  slideInRight,
  scaleIn,
  staggerContainer,
  staggerItem,
  hoverScale,
  cardHover,
} from '@shared/utils/animations';

// Fade in
<motion.div {...fadeIn}>Content</motion.div>

// Slide in zprava
<motion.div {...slideInRight}>Content</motion.div>

// Stagger list
<motion.div {...staggerContainer}>
  {items.map(item => (
    <motion.div key={item.id} {...staggerItem}>
      {item.name}
    </motion.div>
  ))}
</motion.div>

// Card s hover efektem
<motion.div {...cardHover}>
  <Card>Content</Card>
</motion.div>
```

**Dostupné animace:**
- `fadeIn`, `slideInRight`, `slideInLeft`, `slideInTop`, `slideInBottom`
- `scaleIn`, `staggerContainer`, `staggerItem`
- `hoverScale`, `buttonPress`, `cardHover`
- `shake`, `bounce`, `pulse`, `rotate`
- `pageTransition`, `modalOverlay`, `modalContent`

---

## Styly

### `borderRadius.js`

Centralizované nastavení border radius.

**Lokace:** `/src/styles/borderRadius.js`

**Použití:**
```javascript
import BORDER_RADIUS, { borderRadius, responsiveBorderRadius } from '@styles/borderRadius';

// V komponentě
<Card sx={{ borderRadius: BORDER_RADIUS.card }}>Content</Card>

// Pomocná funkce
<Box sx={{ ...borderRadius('premium') }}>Content</Box>

// Responsive
<Box sx={{ ...responsiveBorderRadius('card') }}>Content</Box>
```

**Hodnoty:**
- `standard`: 20px
- `compact`: 16px
- `premium`: 24px
- `small`: 12px
- `minimal`: 8px

---

## Context

### `NotificationContext`

Context pro notifikační systém (viz Komponenty výše).

**Lokace:** `/src/shared/context/NotificationContext.jsx`

---

## 🎯 Best Practices

1. **Používej moduly konzistentně** - Vždy používej sdílené moduly místo vytváření vlastních variant
2. **Nevytvářej duplicity** - Pokud potřebuješ novou funkcionalitu, přidej ji do příslušného modulu
3. **Dokumentuj změny** - Při úpravě modulů aktualizuj tento README
4. **Testuj na mobilech** - Používej touch handling a responsive hooks pro mobilní zařízení
5. **Používej TypeScript typy** - Všechny moduly mají JSDoc komentáře pro lepší autocomplete

---

## 📦 Struktura souborů

```
src/shared/
├── components/
│   ├── AppTooltip.jsx
│   ├── LoadingState.jsx
│   └── NotificationContainer.jsx
├── context/
│   └── NotificationContext.jsx
├── hooks/
│   ├── useAsync.js
│   ├── useModal.js
│   └── useResponsive.js
├── styles/
│   └── glassmorphism.js
├── utils/
│   ├── animations.js
│   └── touchHandlers.js
└── SHARED_README.md (tento soubor)
```

---

## 🔄 Migrace starého kódu

Při refaktoringu starého kódu nahraď:

- ❌ Vlastní `isMobile` logiku → ✅ `useResponsive()`
- ❌ Inline try/catch bloky → ✅ `useAsync()` nebo `safeAsync()`
- ❌ Vlastní modal state → ✅ `useModal()`
- ❌ Duplikovaný glassmorphism CSS → ✅ `glassmorphism()`
- ❌ `alert()` volání → ✅ `useNotification()`
- ❌ Vlastní loading komponenty → ✅ `LoadingState`
- ❌ Inline animace → ✅ předpřipravené animace z `animations.js`
