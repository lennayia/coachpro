# 🎨 Interaktivní komponenty - CoachPro

**Vytvořeno:** 12.11.2025
**Účel:** Modulární systém pro vytvoření nejlepší koučovací aplikace na světě

## 📦 Co bylo vytvořeno

### 1. **FlipCard** - 3D otáčitelné karty
📍 `src/shared/components/cards/FlipCard.jsx`

**Co dělá:**
- Otáčitelná karta s přední a zadní stranou
- 3D animace při otočení (horizontal/vertical)
- Hover efekty (elevace + scale)
- Automatické nebo manuální otáčení

**Použití:**
```jsx
<FlipCard
  frontContent={<Box>Přední strana</Box>}
  backContent={<Box>Zadní strana</Box>}
  gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  onFlip={(isFlipped) => playSound(isFlipped ? 'flip' : 'flipBack')}
  minHeight={200}
/>
```

**Props:**
- `frontContent` - Obsah přední strany
- `backContent` - Obsah zadní strany
- `autoFlip` - Otočit při hover (default: false)
- `clickToFlip` - Otočit při kliknutí (default: true)
- `flipDirection` - 'horizontal' | 'vertical'
- `flipDuration` - Délka animace v sekundách
- `gradient` - Gradient pro pozadí
- `minHeight` - Minimální výška
- `onFlip` - Callback při otočení

---

### 2. **AnimatedGradient** - Živé barevné přechody
📍 `src/shared/components/effects/AnimatedGradient.jsx`

**Co dělá:**
- Animované gradient pozadí
- 4 typy animací: pulse, wave, rotate, shimmer
- Blur efekt
- Podporuje children jako overlay

**Použití:**
```jsx
<AnimatedGradient
  colors={['#667eea', '#764ba2', '#f093fb']}
  animation="wave"
  duration={5}
  blur={false}
>
  <Typography>Obsah nad gradientem</Typography>
</AnimatedGradient>
```

**Props:**
- `colors` - Pole barev (min 2)
- `animation` - 'pulse' | 'wave' | 'rotate' | 'shimmer'
- `duration` - Délka jednoho cyklu v sekundách
- `direction` - Směr gradientu ('135deg', '45deg', atd.)
- `opacity` - Průhlednost 0-1
- `blur` - Přidat blur efekt
- `children` - Obsah nad gradientem

---

### 3. **useSoundFeedback** - Zvukový feedback hook
📍 `src/shared/hooks/useSoundFeedback.js`

**Co dělá:**
- Jemné zvuky pro UI interakce
- Programově generované (Web Audio API)
- Žádné audio soubory potřeba!
- Volume control + enable/disable

**Použití:**
```jsx
const { playClick, playFlip, playSuccess, setEnabled, enabled } = useSoundFeedback({
  volume: 0.3,
  enabled: true
});

<Button onClick={() => {
  playClick();
  handleAction();
}}>
  Click me
</Button>
```

**Dostupné zvuky:**
- `playClick()` - Krátký click (800Hz, 0.05s)
- `playFlip()` - Sweep pro otočení karty (400-800Hz, 0.3s)
- `playSuccess()` - Příjemný chord (C major)
- `playError()` - Disonantní zvuk pro chyby
- `playHover()` - Subtilní hover (600Hz, 0.03s)
- `playWhoosh()` - Sweep pro přechody (200-100Hz)

**Nastavení:**
- `setVolume(0-1)` - Hlasitost
- `setEnabled(boolean)` - Zapnout/vypnout

---

### 4. **Nové animace** v animations.js
📍 `src/shared/styles/animations.js`

**Přidáno:**
- `cardFlip` - 3D card flip (rotateY 180°)
- `pulse` - Pulsování (scale 1 → 1.05 → 1)
- `shimmer` - Shimmer efekt (loading state)
- `float` - Levitace (y: 0 → -10 → 0)
- `glow` - Glow/svícení efekt
- `bounceIn` - Bounce in animace (spring)
- `rotate` - Rotace (0 → 360°)

**Použití:**
```jsx
import { pulse, glow } from '@shared/styles/animations';

<motion.div animate={pulse}>
  <Avatar />
</motion.div>
```

---

## 🎯 Demo implementace

### **ClientWelcomeEnhanced** - Vylepšená welcome page
📍 `src/modules/coach/pages/ClientWelcomeEnhanced.jsx`

**✨ Co obsahuje:**

1. **AnimatedGradient pozadí**
   - Wave animace (8s cyklus)
   - Barvy podle dark/light mode
   - Noise texture overlay

2. **Glowing avatar**
   - Glow animace kolem avatara
   - Hover scale efekt
   - Klikatelný → navigace na profil

3. **Sound feedback**
   - Click při všech akcích
   - Flip při otočení karty
   - Success při detekci kódu
   - Hover při hover na buttons
   - Volume toggle v top-right

4. **FlipCard action cards**
   - 3 karty: Klientská zóna, Výběr koučky, O koučinku
   - **Přední strana:** Ikona + název + subtitle
   - **Zadní strana:** Detaily + features + tlačítko "Přejít"
   - Gradient podle každé karty
   - Sound při flip

5. **Smooth animations**
   - FadeIn pro celou stránku
   - FadeInUp pro sekce
   - Stagger pro karty

---

## 🚀 Jak to vyzkoušet

### Krok 1: Přidat routu
Do `src/App.jsx` (nebo kde máš routing):

```jsx
import ClientWelcomeEnhanced from '@modules/coach/pages/ClientWelcomeEnhanced';

// Přidat routu:
<Route path="/client/welcome-enhanced" element={<ClientWelcomeEnhanced />} />
```

### Krok 2: Otevřít v prohlížeči
```
http://localhost:3000/client/welcome-enhanced
```

### Krok 3: Vyzkoušej:
1. **Klikni na action karty** → otočí se a ukážou víc info
2. **Klikni na tlačítka** → slyšíš jemný click
3. **Zadej 6-místný kód** → slyšíš success při detekci
4. **Hover na buttons** → slyšíš hover sound
5. **Klikni na ikonu zvuku (top-right)** → vypni/zapni zvuky
6. **Klikni na avatar** → glow efekt

---

## 🎨 Jak použít na dalších stránkách

### Programy (ProgramsList)
```jsx
import FlipCard from '@shared/components/cards/FlipCard';

// Místo stávající ProgramCard použij FlipCard:
<FlipCard
  frontContent={
    <Box p={3}>
      <Typography variant="h6">{program.title}</Typography>
      <Chip label={`${program.duration} dní`} />
    </Box>
  }
  backContent={
    <Box p={3}>
      <Typography variant="body2">{program.description}</Typography>
      <Button onClick={() => handleEdit(program)}>Upravit</Button>
      <Button onClick={() => handleShare(program)}>Sdílet</Button>
    </Box>
  }
  onFlip={playFlip}
/>
```

### Materiály (MaterialsList)
```jsx
<FlipCard
  frontContent={<MaterialPreview material={material} />}
  backContent={<MaterialDetails material={material} />}
  gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
/>
```

### Dashboard stats
```jsx
<AnimatedGradient
  colors={['#8FBC8F', '#556B2F']}
  animation="pulse"
  duration={3}
>
  <Box p={3}>
    <Typography variant="h3">{stats.activeClients}</Typography>
    <Typography>Aktivních klientek</Typography>
  </Box>
</AnimatedGradient>
```

---

## 🎯 Best practices

### Zvuky
- **Používej jemně** - volume max 0.3
- **Click** pro všechny tlačítka
- **Success** pro pozitivní akce (save, complete)
- **Hover** jen pro důležité prvky (ne všechno)
- **Vždy dej možnost vypnout** (Volume toggle)

### AnimatedGradient
- **Wave/Pulse** pro pozadí (dlouhé duraci 5-10s)
- **Shimmer** pro loading states (krátká durace 1-2s)
- **Rotate** pro spin loadery
- **Blur** pokud chceš soft pozadí pod obsahem

### FlipCard
- **Front:** Quick info (název, ikona, krátký popis)
- **Back:** Detaily, akce, tlačítka
- **MinHeight:** Nastav pevnou výšku (200-300px)
- **Gradient:** Použij konzistentní paletu
- **Sound:** Vždy playFlip() při onFlip

---

## 📊 Výkon

### FlipCard
- ✅ Hardware-accelerated (transform3D)
- ✅ 60 FPS animace
- ✅ Žádné reflows

### AnimatedGradient
- ⚠️ Background animace může být náročná
- 💡 Použij pro pozadí, ne pro každý element
- 💡 Dlouhá duration (5-10s) je lepší než krátká

### SoundFeedback
- ✅ Web Audio API (nízká latence)
- ✅ Žádné audio soubory
- ✅ Programově generované
- ⚠️ Neuděláš příliš mnoho zvuků najednou

---

## 🔮 Další možnosti

### Co můžeš přidat:
1. **Particles system** (confetti, stars)
2. **Ripple efekt** při kliknutí
3. **Hover trail** (myš zanechává stopu)
4. **Parallax scrolling**
5. **Morphing shapes**
6. **Loading skeletons** s shimmer
7. **Haptic feedback** (vibrace na mobilu)
8. **Keyboard shortcuts** se sound feedback

### Inspirace:
- Stripe.com (gradient animations)
- Linear.app (smooth transitions)
- Notion.so (hover states)
- Apple.com (product cards)

---

## 🐛 Troubleshooting

### Zvuky nefungují
- Zkontroluj konzoli pro AudioContext chyby
- Některé prohlížeče blokují autoplay → první interakce musí být user-initiated
- Safari má omezení na Web Audio API

### FlipCard se netočí správně
- Zkontroluj `perspective` na parent elementu
- Musí mít `transformStyle: 'preserve-3d'`
- Zkontroluj z-index

### AnimatedGradient laguje
- Zredukuj počet barev (max 3-4)
- Zvyš duration (min 5s)
- Použij `will-change: background` pro optimalizaci

---

## 📝 TODO - Další vylepšení

- [ ] Přidat Particle system komponentu
- [ ] Ripple effect na click
- [ ] Keyboard shortcuts handler
- [ ] Haptic feedback pro mobily
- [ ] Loading skeleton komponenty
- [ ] Ilustrované empty states
- [ ] Toast notifications s animacemi
- [ ] Progress indicators s animacemi

---

**Vytvořeno s ❤️ pro nejlepší koučovací aplikaci na světě**

Pro otázky nebo návrhy: Konzultuj s vývojářem nebo Claudem 🤖
