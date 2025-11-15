# CoachPro - Architecture & Context Overview

**Aktualizováno:** Session #16 (15.11.2025) - Dashboard Redesign & Gamification

---

## 🏗️ Architektura Projektu

### Modular Design Pattern (Session #14-16)

```
Utils (reusable functions)
  ↓
Shared Components (universal, props-based)
  ↓
Page Components (specific implementations)
```

**Příklad Session #16 - FlipCard System:**
```
FlipCard.jsx (shared component) → 3D flip animation
  ↓
WelcomeScreen.jsx (universal component) → FlipCard integration
  ↓
ClientWelcome.jsx, TesterWelcome.jsx → specific implementations
```

**Příklad Session #15 - Validation:**
```
validation.js (utils) → isValidEmail, formatPhone, formatSocialUrl
  ↓
ProfileScreen.jsx (universal component) → validace + auto-formátování
  ↓
ProfilePage.jsx (coach/tester), ClientProfile.jsx (client) → specific implementations
```

**Příklad Session #14 - Photo Upload:**
```
imageCompression.js + photoStorage.js (utils)
  ↓
PhotoUpload.jsx (shared component)
  ↓
ClientProfile.jsx, ProfilePage.jsx (pages)
```

---

## 📂 Struktura Souborů (Session #16 Update)

```
src/
├── modules/coach/
│   ├── pages/
│   │   ├── Tester.jsx                  # Registrace testerů
│   │   ├── TesterWelcome.jsx           # Welcome screen (uses WelcomeScreen)
│   │   ├── CoachLogin.jsx              # Login (3 auth methods)
│   │   ├── ClientWelcome.jsx           # Client welcome (uses WelcomeScreen + FlipCard)
│   │   ├── ClientWelcomeEnhanced.jsx   # ⭐ NEW Session #16 - Proof of concept
│   │   ├── ClientProfile.jsx           # Client profile
│   │   ├── ProfilePage.jsx             # Coach profile
│   │   └── ...
│   └── components/
│       └── SessionCard.jsx             # Session display
│
└── shared/
    ├── components/
    │   ├── WelcomeScreen.jsx           # ⭐ UPGRADED Session #16 - FlipCard integration
    │   ├── FloatingMenu.jsx            # Settings menu (Rozcestník)
    │   ├── NavigationFloatingMenu.jsx  # Navigation menu
    │   ├── RegisterForm.jsx            # Universal registration
    │   ├── PhotoUpload.jsx             # Universal photo upload
    │   ├── ClientAuthGuard.jsx         # Client auth protection
    │   ├── TesterAuthGuard.jsx         # Tester auth protection
    │   │
    │   ├── cards/
    │   │   ├── FlipCard.jsx            # ⭐ NEW Session #16 - 3D flip animation
    │   │   └── BaseCard.jsx            # Foundation for all cards
    │   │
    │   └── effects/
    │       └── AnimatedGradient.jsx    # ⭐ NEW Session #16 - Animated backgrounds
    │
    ├── context/
    │   ├── TesterAuthContext.jsx       # Tester authentication state
    │   ├── ClientAuthContext.jsx       # Client authentication state
    │   └── NotificationContext.jsx     # Notifications
    │
    ├── utils/
    │   ├── sessions.js                 # Session management (402 lines)
    │   ├── photoStorage.js             # Supabase Storage operations
    │   ├── imageCompression.js         # WebP compression
    │   ├── czechGrammar.js             # getVocative(), getFirstName()
    │   ├── storage.js                  # Programs, materials, cards
    │   └── generateCode.js             # Share code generation
    │
    ├── hooks/
    │   ├── useSoundFeedback.js         # ⭐ NEW Session #16 - Web Audio API sounds
    │   └── useModernEffects.js         # useGlassCard()
    │
    ├── styles/
    │   ├── animations.js               # ⭐ UPDATED Session #16 - Added glow
    │   ├── borderRadius.js             # BORDER_RADIUS constants
    │   └── modernEffects.js            # Glass card effects
    │
    └── constants/
        └── icons.js                    # ⭐ UPDATED Session #16 - Signpost icon
```

---

## 🎴 FlipCard Architecture (Session #16)

### Component Hierarchy

```
FlipCard.jsx (3D animation logic)
  ↓ props: frontContent, backContent, gradient, onFlip
WelcomeScreen.jsx (universal welcome)
  ↓ uses FlipCard for action cards
ClientWelcome.jsx / TesterWelcome.jsx
  ↓ provide actionCards data
```

### FlipCard Props API

```javascript
<FlipCard
  frontContent={ReactNode}     // Přední strana
  backContent={ReactNode}      // Zadní strana
  clickToFlip={boolean}        // default: true
  flipDuration={number}        // default: 0.6s
  gradient={string}            // optional gradient
  minHeight={number}           // default: 200px
  onFlip={(isFlipped) => {}}   // callback
  sx={object}                  // MUI sx styles
/>
```

### Technical Pattern

**CSS-based (NOT Framer Motion for flip):**
```jsx
<Box sx={{ perspective: '1000px' }}>
  <Box sx={{
    transformStyle: 'preserve-3d',
    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
  }}>
    <Box sx={{ backfaceVisibility: 'hidden' }}>{front}</Box>
    <Box sx={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>{back}</Box>
  </Box>
</Box>
```

**Why CSS over Framer Motion?**
- Better performance (60fps)
- Simpler debugging
- No complex motion variants
- Proven by CardFlipView.jsx

---

## 🎨 Interactive Features (Session #16)

### 1. Sound Feedback System

**Architecture:**
```
useSoundFeedback.js (Web Audio API)
  ↓ provides: playClick, playFlip, playHover, etc.
WelcomeScreen.jsx
  ↓ uses sounds on interactions
```

**Sounds Generated:**
- `playClick()` - 800Hz, 0.05s
- `playFlip()` - 400→800Hz sweep, 0.3s
- `playSuccess()` - C major chord
- `playHover()` - 600Hz, 0.03s

**Benefits:**
- No audio files needed
- ~2KB bundle impact
- Instant playback (<50ms latency)

### 2. Animated Gradients

**AnimatedGradient.jsx:**
```jsx
<AnimatedGradient
  colors={['#0a0f0a', '#1a2410', '#0f140a']}
  animation="wave"
  duration={8}
  opacity={1}
/>
```

**Animations:** pulse, wave, rotate, shimmer

### 3. Avatar Glow Effect

**Pattern:**
```javascript
import { glow } from '@shared/styles/animations';

<Box component={motion.div} animate={glow}>
  <Avatar />
</Box>
```

**Effect:** Continuous pulsating shadow (2s loop)

---

## 🗄️ Database Architecture

### Core Tables

```sql
auth.users (Supabase Auth)
  ↓
├── testers (beta testers)
│     ↓
│   coachpro_coaches (is_tester = true)
│
└── coachpro_client_profiles (clients)
      ↓
    coachpro_sessions (coaching sessions)
```

### Key Relationships

```
coachpro_client_profiles.coach_id → coachpro_coaches.id
coachpro_sessions.client_id → coachpro_client_profiles.id
coachpro_sessions.coach_id → coachpro_coaches.id
coachpro_coaches.tester_id → testers.id (optional)
```

---

## 🔐 Autentizace Flow

### User Types & Auth Methods

```
┌─────────────────────────────────────────────────────┐
│                  CoachPro Users                      │
├─────────────────────────────────────────────────────┤
│                                                       │
│  Testers (Beta testers)                              │
│    → RegisterForm (Tester.jsx)                       │
│    → Email+Password + Google OAuth                   │
│    → Has: TesterWelcome with FlipCards (Session #16)│
│                                                       │
│  Clients (End users)                                 │
│    → Register via /client/signup                     │
│    → Email+Password                                  │
│    → Has: ClientWelcome with FlipCards (Session #16)│
│                                                       │
│  Coaches (Future - not yet implemented)              │
│    → Will use RegisterForm                           │
│    → Full coach functionality                        │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

## 🧩 Component Reusability Matrix (Session #16)

### WelcomeScreen (Universal + FlipCards)

| User Type | Uses WelcomeScreen | FlipCard Support | Sounds |
|-----------|-------------------|------------------|--------|
| Tester | ✅ TesterWelcome.jsx | ✅ Session #16 | ✅ |
| Client | ✅ ClientWelcome.jsx | ✅ Session #16 | ✅ |
| Coach | 🚧 Future | 🚧 TBD | 🚧 |

### FlipCard (Universal)

| Used In | Purpose | Gradient |
|---------|---------|----------|
| WelcomeScreen | Action cards (dashboard, materials...) | Soft 35%→25% |
| CoachingCardsPage | Card deck (existing, different pattern) | None |
| Future | Material cards, program cards | TBD |

### RegisterForm (Universal)

| User Type | Page | onSuccess Callback |
|-----------|------|-------------------|
| Tester | Tester.jsx | Insert testers + coaches |
| Client | ClientSignup.jsx | Insert client_profiles |
| Coach | 🚧 Future | Insert coaches |

---

## 🎯 Design System (Session #16 Update)

### 1. Border Radius

```javascript
import BORDER_RADIUS from '@styles/borderRadius';

BORDER_RADIUS.minimal   // 8px - Progress bars
BORDER_RADIUS.small     // 12px - Menu items
BORDER_RADIUS.compact   // 16px - Buttons, inputs
BORDER_RADIUS.card      // 20px - Cards (default)
BORDER_RADIUS.premium   // 24px - Large elements
BORDER_RADIUS.dialog    // 24px - Dialogs
```

### 2. Icons (Modular System)

```javascript
import { NAVIGATION_ICONS, SETTINGS_ICONS } from '@shared/constants/icons';

// Session #16: Changed welcome from Home to Signpost
SETTINGS_ICONS.welcome  // Signpost (rozcestník)
NAVIGATION_ICONS.dashboard  // Home
```

**Důvod změny:** Eliminace duplicity Home ikony v Dashboard a Rozcestníku

### 3. Gradients (Soft Pattern)

**Session #16 Discovery:** Standard gradients moc silné na velkých plochách

```javascript
const createSoftGradient = (color1, color2, angle = 135) => {
  const hexToRgba = (hex, opacity) => {
    // Conversion logic
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };
  return `linear-gradient(${angle}deg,
    ${hexToRgba(color1, 0.35)} 0%,
    ${hexToRgba(color2, 0.25)} 100%)`;
};
```

**Použití:**
```jsx
gradient={createSoftGradient(
  theme.palette.primary.main,
  theme.palette.secondary.main
)}
```

### 4. Animations

```javascript
import { glow, fadeIn, fadeInUp, staggerContainer, staggerItem } from '@shared/styles/animations';

// Session #16: NEW glow animation
<Box component={motion.div} animate={glow}>
  {/* Continuous pulsating shadow */}
</Box>
```

### 5. Sound Feedback

```javascript
import useSoundFeedback from '@shared/hooks/useSoundFeedback';

const { playClick, playFlip, enabled, setEnabled } = useSoundFeedback({
  volume: 0.3,
  enabled: true
});
```

---

## 🚧 Known Patterns & Best Practices

### 1. FlipCard Integration Pattern

**✅ CORRECT:**
```jsx
// WelcomeScreen - reusable component
<FlipCard
  frontContent={<CardFront icon={item.icon} title={item.title} />}
  backContent={<CardBack button={<Button onClick={item.onClick} />} />}
  gradient={createSoftGradient(...)}
  onFlip={(flipped) => playFlip()}
/>
```

**❌ WRONG:**
```jsx
// Don't hardcode UI in specific pages
const [isFlipped, setIsFlipped] = useState(false);
// 50 lines of flip animation logic here...
```

### 2. Sound Feedback Pattern

**✅ CORRECT:**
```jsx
const { playClick } = useSoundFeedback({ volume: 0.3 });

<Button onClick={() => {
  playClick();
  handleAction();
}}>
```

**❌ WRONG:**
```jsx
// Don't load audio files
<audio ref={audioRef} src="/sounds/click.mp3" />
```

### 3. Gradient Opacity Pattern

**✅ CORRECT:**
```jsx
// Soft gradients for large surfaces (35%→25%)
gradient={createSoftGradient(primary, secondary)}
```

**❌ WRONG:**
```jsx
// Too strong for cards
background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`
```

### 4. Icon Modularity Pattern

**✅ CORRECT:**
```jsx
import { SETTINGS_ICONS } from '@shared/constants/icons';
<SETTINGS_ICONS.welcome size={20} />
```

**❌ WRONG:**
```jsx
import { Signpost } from 'lucide-react';
<Signpost size={20} />
```

---

## 🔄 Data Flow Examples (Session #16 Update)

### Client Journey with FlipCards

```
1. ClientWelcome.jsx (uses WelcomeScreen)
   ↓ (FlipCard: "Vstup do klientské zóny")
2. FlipCard.jsx handles 3D animation
   ↓ (playFlip() on flip)
3. useSoundFeedback generates audio
   ↓ (onClick → navigate)
4. ClientAuthContext validates
   ↓
5. ClientAuthGuard protects routes
   ↓
6. ClientDashboard.jsx
```

### Tester Journey with Enhanced Welcome

```
1. TesterWelcome.jsx (uses WelcomeScreen)
   ↓ (AnimatedGradient background)
2. Avatar with glow animation
   ↓ (FlipCard action cards)
3. Sound feedback on interactions
   ↓ (Rozcestník via FloatingMenu)
4. Navigate to dashboard/materials/etc.
```

---

## 📊 Code Metrics (Session #16)

### Files Created (4)
- FlipCard.jsx: 127 lines
- AnimatedGradient.jsx: 95 lines
- useSoundFeedback.js: 158 lines
- ClientWelcomeEnhanced.jsx: 124 lines

**Total:** 504 new lines

### Files Modified (6)
- WelcomeScreen.jsx: +180 lines (FlipCard integration)
- ClientWelcome.jsx: +12 lines (backTitle prop)
- FloatingMenu.jsx: +8 lines (Rozcestník button)
- ClientView.jsx: +5 lines (welcome without layout)
- icons.js: 1 change (Home → Signpost)
- animations.js: +8 lines (glow animation)

**Total Changes:** ~213 lines modified/added

### Code Quality
- ✅ Zero console.log
- ✅ Zero TODO/DEBUG comments
- ✅ Zero duplication (extracted cardStyles)
- ✅ 100% modular

---

## 📚 Session History

- **Session #12:** Sessions management, triggers, views
- **Session #13:** Icon system, auth troubleshooting
- **Session #14:** Complete auth overhaul
  - Removed access codes
  - Added RegisterForm, WelcomeScreen
  - Email confirmation, Google OAuth
- **Session #15:** Universal ProfileScreen, validation system
- **Session #16:** Client Dashboard Redesign & Gamification 🎮
  - ClientPrograms.jsx page (680 lines - was completely missing!)
  - Clickable statistical cards (eliminate redundancy)
  - Gamification system "Semínka růstu" (Materials +5, Sessions +10)
  - Dynamic 3-level motivational messaging (Heart/Sparkles/Compass)
  - Navigation menu reordered (Programs below Materials)
  - Dashboard reorganization (removed duplicate cards)

---

## 🎯 Design Principles (Updated Session #16)

### 1. Modularita
- Utils first, then components, then pages
- No logic duplication across files
- Props-based configuration

### 2. Interaktivita (NEW Session #16)
- 3D animations for engagement
- Sound feedback for actions
- Animated backgrounds
- Smooth transitions (0.6s flip, 0.3s hover)

### 3. Performance
- CSS > Framer Motion for simple animations
- Web Audio API > audio files
- Low opacity gradients to reduce GPU load
- Refs in hooks to avoid re-renders

### 4. Czech First
- All UI in Czech
- date-fns with `cs` locale
- Vocative case (5. pád) for greetings

### 5. Security
- RLS on all tables
- Email confirmation required
- auth_user_id always populated

### 6. User Experience
- Glassmorphism effects
- Dark mode support
- Responsive mobile-first
- Accessibility (needs reduced-motion support)

---

## 🔗 Related Docs

- `summary.md` - Session #16 complete summary
- `master_todo.md` - All tasks and future work
- `claude_quick_08-12-list-2025.md` - Quick reference
- `claude.md` - Detailed documentation
- `CLAUDE.md` - Complete project instructions (archived)
- `MASTER_TODO_V4.md` - All pending tasks (archived)

---

**Architecture Motto:** Utils → Components → Pages. Always.

**Session #16 Motto:** Stats as Navigation. Gamification = Engagement. Personalization Wins.

---

**Poslední update:** 15. listopadu 2025 - Session #16: Dashboard Redesign & Gamification
