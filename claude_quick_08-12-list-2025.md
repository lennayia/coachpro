# Claude Quick Reference - Recent Sessions

**Datum:** 16.11.2025
**Branch:** `main`
**Sessions:** #16 FlipCard | #16B Dashboard | #17 Coach Profiles

---

## 🎯 Co jsme vytvořili

### 1. FlipCard Component
**Cesta:** `/src/shared/components/cards/FlipCard.jsx`

```jsx
<FlipCard
  frontContent={<Box>Přední strana</Box>}
  backContent={<Box>Zadní strana</Box>}
  gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  flipDuration={0.6}
  onFlip={(isFlipped) => console.log(isFlipped)}
/>
```

**Props:**
- `frontContent` - Obsah přední strany
- `backContent` - Obsah zadní strany
- `clickToFlip` - Otočit kliknutím (default: true)
- `flipDuration` - Délka animace v sekundách (default: 0.6)
- `gradient` - Gradient pozadí (optional)
- `minHeight` - Minimální výška v px (default: 200)
- `onFlip` - Callback při otočení
- `sx` - MUI sx styly

### 2. Sound Feedback Hook
**Cesta:** `/src/shared/hooks/useSoundFeedback.js`

```jsx
const { playClick, playFlip, playHover, enabled, setEnabled } = useSoundFeedback({
  volume: 0.3,
  enabled: true
});

<Button onClick={() => { playClick(); /* akce */ }}>
  Klikni
</Button>
```

**Dostupné zvuky:**
- `playClick()` - Krátké kliknutí
- `playFlip()` - Zvuk otočení karty
- `playSuccess()` - Úspěšná akce
- `playError()` - Chyba
- `playHover()` - Hover efekt
- `playWhoosh()` - Rychlý pohyb

### 3. AnimatedGradient
**Cesta:** `/src/shared/components/effects/AnimatedGradient.jsx`

```jsx
<AnimatedGradient
  colors={['#0a0f0a', '#1a2410', '#0f140a']}
  animation="wave"
  duration={8}
  opacity={1}
/>
```

---

## 🔧 Hlavní změny v existujících souborech

### WelcomeScreen.jsx
- ✓ Integrované FlipCard pro akční karty
- ✓ AnimatedGradient pozadí s vlnovou animací
- ✓ Zvuková zpětná vazba na všechny interakce
- ✓ Glow efekt na avataru (kontinuální pulzování)
- ✓ Sparkles ikona u uvítacího textu
- ✓ maxWidth fixní na 900px
- ✓ createSoftGradient helper s optimalizovanou průhledností (35%→25%)

### FloatingMenu.jsx
- ✓ Přidáno tlačítko "Rozcestník" pro klienty
- ✓ Ikona změněna z Home na Signpost (rozcestník)
- ✓ Navigace na /client/welcome pro klienty

### ClientView.jsx
- ✓ Welcome stránky se renderují bez Layout (bez hlavičky)
- ✓ Fullscreen zážitek pro onboarding

### icons.js
- ✓ SETTINGS_ICONS.welcome změněno z Home na Signpost

### animations.js
- ✓ Přidána glow animace pro avatar

---

## 💡 Klíčové technické poznatky

### 3D Flip Animace
**Důležité:** Jednoduché CSS transitions fungují lépe než složité Framer Motion varianty.

```jsx
// Parent Box - perspektiva
<Box sx={{ perspective: '1000px' }}>

  // Rotating container
  <Box sx={{
    transformStyle: 'preserve-3d',
    transition: 'transform 0.6s',
    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
  }}>

    // Přední strana
    <Box sx={{ backfaceVisibility: 'hidden' }}>
      <Card>{frontContent}</Card>
    </Box>

    // Zadní strana
    <Box sx={{
      backfaceVisibility: 'hidden',
      transform: 'rotateY(180deg)' // Statické!
    }}>
      <Card>{backContent}</Card>
    </Box>

  </Box>
</Box>
```

**Klíčové vlastnosti:**
- `perspective: 1000px` na rodiči pro 3D prostor
- `transformStyle: 'preserve-3d'` na otáčejícím se kontejneru
- `backfaceVisibility: 'hidden'` na obou stranách
- Zadní strana má **statický** `rotateY(180deg)`

### Jemné gradienty
```javascript
const createSoftGradient = (color1, color2, angle = 135) => {
  const hexToRgba = (hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };
  return `linear-gradient(${angle}deg, ${hexToRgba(color1, 0.35)} 0%, ${hexToRgba(color2, 0.25)} 100%)`;
};
```

**Použití:**
```jsx
gradient={createSoftGradient(theme.palette.primary.main, theme.palette.secondary.main)}
```

---

## 🐛 Vyřešené problémy

### 1. Karty mizí při otočení
**Problém:** Karta začne rotovat a zmizí v půlce animace.
**Řešení:** Zkopírována struktura z fungující `CardFlipView.jsx` - čisté CSS transitions bez složitých motion.div vrstev.

### 2. Příliš silné gradienty
**Problém:** Primary/secondary gradienty na 70% opacity příliš výrazné.
**Řešení:** Sníženo na 35%→25% opacity pomocí createSoftGradient helperu.

### 3. Nečitelný text
**Problém:** Světlý text na světlých gradientech v light mode.
**Řešení:** Theme-aware barvy - tmavý text v light mode, bílý v dark mode.

### 4. Duplicitní Home ikony
**Problém:** Rozcestník i Dashboard používaly Home ikonu.
**Řešení:** Rozcestník změněn na Signpost ikonu.

### 5. Layout nesrovnalosti
**Problém:** Různé maxWidth hodnoty mezi Enhanced a běžným WelcomeScreen.
**Řešení:** Fixní maxWidth 900px napříč všemi welcome obrazovkami.

### 6. Welcome stránky s hlavičkou
**Problém:** Welcome stránky zobrazovaly navigační hlavičku.
**Řešení:** Upravený routing v ClientView.jsx - welcome stránky bez Layout.

---

## 📦 Vytvořené soubory (4)

1. `/src/shared/components/cards/FlipCard.jsx` - 3D otáčitelná karta
2. `/src/shared/components/effects/AnimatedGradient.jsx` - Animované gradienty
3. `/src/shared/hooks/useSoundFeedback.js` - Systém zvukové zpětné vazby
4. `/src/modules/coach/pages/ClientWelcomeEnhanced.jsx` - Proof of concept

## 📝 Upravené soubory (6)

1. `/src/shared/components/WelcomeScreen.jsx` - FlipCard, zvuky, animace
2. `/src/modules/coach/pages/ClientWelcome.jsx` - backTitle prop
3. `/src/shared/components/FloatingMenu.jsx` - Rozcestník tlačítko
4. `/src/modules/coach/pages/ClientView.jsx` - Welcome bez Layout
5. `/src/shared/constants/icons.js` - Signpost ikona
6. `/src/shared/styles/animations.js` - Glow animace

---

## ⚡ Performance tipy

1. **CSS > Framer Motion** pro jednoduché flip animace
2. **Web Audio API** efektivnější než audio soubory
3. **Nízká opacity** gradientů šetří GPU
4. **Refs v sound hooku** zamezují zbytečným re-renderům

---

## 🎨 Design System

### Barvy
- **Primary:** Olivová/zemité tóny (#556B2F)
- **Secondary:** Světle zelená/šalvějová (#8BBC8F)
- **Použití:** Vždy míchat primary + secondary v gradientech

### Border Radius
- `BORDER_RADIUS.card` - Pro karty
- `BORDER_RADIUS.compact` - Pro tlačítka
- `BORDER_RADIUS.dialog` - Pro dialogy

### Animace
- **Flip Duration:** 0.6s (default)
- **Hover Transitions:** 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- **Sound Duration:** 0.03s-0.5s podle typu zvuku

### Ikony
- **Knihovna:** Lucide React
- **Import:** Z `/src/shared/constants/icons.js`
- **NIKDY** neimportovat přímo z lucide-react

---

## ✅ Checklist před mergem

- [x] Všechen kód commitnutý
- [x] Žádné console.log
- [x] Žádné TODO/DEBUG komentáře
- [x] Žádná duplicita kódu
- [x] Dokumentace vytvořena
- [ ] Testováno na více zařízeních
- [ ] Testováno v různých prohlížečích
- [ ] User acceptance testing
- [ ] Merge do main

---

## 🚀 Příští kroky

### Testování
1. Test na mobilních zařízeních (iOS, Android)
2. Test v různých prohlížečích (Safari, Firefox, Edge)
3. Test zvuků na mobilech
4. Ověření accessibility (reduced motion)

### Budoucí vylepšení
1. Haptická zpětná vazba pro mobily
2. Více zvukových témat
3. Více variant flip animací
4. Předpřipravené card šablony

---

## 📞 Quick Commands

```bash
# Spuštění dev serveru
npm run dev

# Build
npm run build

# Kontrola TypeScript
npm run type-check

# Lint
npm run lint
```

---

## 🔍 Kde hledat

**FlipCard problém?** → `CardFlipView.jsx` (fungující reference)
**Zvuky nefungují?** → Web Audio API potřebuje user interaction
**Gradienty moc silné?** → Použij `createSoftGradient` helper
**Ikony?** → `/src/shared/constants/icons.js`
**Animace?** → `/src/shared/styles/animations.js`

---

## 🎯 Session #16B: Dashboard & Gamification (15.11.2025)

### ClientPrograms Page
**Cesta:** `/src/modules/coach/pages/ClientPrograms.jsx` (680 lines)

```jsx
// Filter tabs: All / Active / Completed
<Tabs value={filterTab}>
  <Tab label="Všechny programy" />
  <Tab label="Aktivní" />
  <Tab label="Dokončené" />
</Tabs>

// Progress tracking
<LinearProgress variant="determinate" value={progress} />

// Click to open
onClick={() => navigate(`/client/daily-view/${program.id}`)}
```

### Gamification "Semínka růstu"
```jsx
const totalSeeds = (materialsCount * 5) + (sessionsCount * 10);

// Green accent card
<Card sx={{ background: 'linear-gradient(135deg, #8BC34A, #4CAF50)' }}>
  <Sprout size={40} />
  <Typography variant="h3">{totalSeeds}</Typography>
  <Typography>Semínka růstu</Typography>
</Card>
```

### 3-Level Motivational Messaging
```javascript
// High activity: 30+ seeds OR 3+ sessions
{ icon: Heart, color: '#ec4899', message: 'Vedete si skvěle!' }

// Medium activity: 10+ seeds OR active programs
{ icon: Sparkles, color: '#f97316', message: 'Dobrá práce!' }

// Low activity: starting
{ icon: Compass, color: '#3b82f6', message: 'Vaše cesta začíná!' }
```

### Clickable Stats Pattern
```jsx
// Before: Stats + Navigation cards (duplicate)
// After: Stats ARE navigation

<Card onClick={() => navigate('/client/materials')} sx={{ cursor: 'pointer' }}>
  <Typography variant="h4">{materialsCount}</Typography>
  <Typography>Materiály</Typography>
</Card>
```

### Navigation Reordering
```javascript
// New order (Programs moved below Materials):
const clientItems = [
  { label: 'Dashboard', path: '/client/dashboard' },
  { label: 'Sezení', path: '/client/sessions' },
  { label: 'Materiály', path: '/client/materials' },
  { label: 'Programy', path: '/client/programs' },  // ← Moved here
  { label: 'Karty', path: '/client/cards' },
];
```

---

## 🎯 Session #17: Coach Profiles & Selection (16.11.2025)

### CoachCard Refactor
**Cesta:** `/src/shared/components/CoachCard.jsx`

```jsx
<CoachCard
  coach={coach}
  onClick={() => handleCoachSelect(coach)}
  showFullProfile={true}
  counts={{ programs: 5, materials: 12, sessions: 3 }}
/>
```

**Fixed Heights Pattern:**
```jsx
// Name: 2 lines (2.6em)
<Typography sx={{
  minHeight: '2.6em',
  maxHeight: '2.6em',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
}}>
  {coach.name}
</Typography>

// Specializations: 1 line each (1.2em)
{specs.slice(0, 3).map(spec => (
  <Chip label={spec} sx={{ minHeight: '1.2em', maxHeight: '1.2em' }} />
))}

// Bio preview: 3 lines (3.2em)
<Typography sx={{
  minHeight: '3.2em',
  maxHeight: '3.2em',
  WebkitLineClamp: 3,
}}>
  {coach.bio}
</Typography>
```

### Uniform Card Heights (Flexbox)
```jsx
<Grid item xs={12} md={6} lg={4} sx={{ display: 'flex' }}>
  <motion.div style={{
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  }}>
    <CoachCard ... />
  </motion.div>
</Grid>
```

### Dual-Purpose ClientCoachSelection
```javascript
// Assignment mode: First coach selection
const clientCoaches = await getClientCoaches(profile?.id);
const hasManyCoaches = clientCoaches && clientCoaches.length > 0;

if (hasManyCoaches) {
  // Browsing mode: Show counts, navigate to detail
  navigate(`/client/coach/${slug}`, { state: { coachId: coach.id } });
} else {
  // Assignment mode: Confirm dialog → assign
  await updateClientCoach(profile.id, selectedCoach.id);
}
```

### Slug-Based Routing
```javascript
const slug = coach.name
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')  // Remove diacritics
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

// Result: "Lenka Roubalová" → "lenka-roubalova"
```

### Google OAuth Photo Auto-Sync
**Cesta:** `/src/shared/context/TesterAuthContext.jsx`

```javascript
const googlePhotoUrl = authUser.user_metadata?.avatar_url ||
                       authUser.user_metadata?.picture;

if (googlePhotoUrl && googlePhotoUrl !== existingCoach.photo_url) {
  await supabase
    .from('coachpro_coaches')
    .update({ photo_url: googlePhotoUrl })
    .eq('id', existingCoach.id);
}
```

### Social Media with Branded Colors
```javascript
const SOCIAL_COLORS = {
  linkedin: '#0A66C2',
  instagram: 'linear-gradient(45deg, #F58529, #DD2A7B, #8134AF)',
  facebook: '#1877F2',
  website: theme.palette.primary.main,
  whatsapp: '#25D366',
  telegram: '#0088cc',
};

// Smart URL builder
const buildSocialUrl = (platform, value) => {
  if (value.startsWith('http')) return value;
  return `https://${platform}.com/${value}`;
};
```

### Specializations Parser (Universal)
```javascript
const parseSpecializations = (specializations) => {
  if (!specializations) return [];
  if (Array.isArray(specializations)) return specializations;
  if (typeof specializations === 'string') {
    return specializations.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
};
```

---

## 📦 Nové soubory

### Session #16B (1)
1. `/src/modules/coach/pages/ClientPrograms.jsx` - 680 lines

### Session #17 (1)
1. `/src/modules/client/pages/CoachDetail.jsx` - 580 lines

---

## 📝 Upravené soubory

### Session #16B (3)
1. `storage.js` - getSharedPrograms()
2. `ClientDashboard.jsx` - Gamification + clickable stats
3. `NavigationFloatingMenu.jsx` - Reordered menu

### Session #17 (5)
1. `CoachCard.jsx` - Complete refactor
2. `ClientCoachSelection.jsx` - Dual-purpose logic
3. `TesterAuthContext.jsx` - Google photo sync
4. `ProfilePage.jsx` - Save profile fields
5. `Breadcrumbs.jsx` - Coach detail labels

---

*Rychlá reference pro Sessions #16, #16B, #17*
*Poslední aktualizace: 16.11.2025*
