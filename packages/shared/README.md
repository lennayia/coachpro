# @proapp/shared

Shared components, hooks, and utilities for the ProApp ecosystem.

**Version:** 1.0.0
**Status:** ✅ Production-ready

---

## 🎯 Quick Start

```bash
# Install (after monorepo migration)
npm install @proapp/shared

# Import components
import { FlipCard, GoogleSignInButton } from '@proapp/shared/components';
import { useSoundFeedback } from '@proapp/shared/hooks';
import { BORDER_RADIUS } from '@proapp/shared/styles';
import { createClientAuthContext } from '@proapp/shared/context';
```

---

## 📦 What's Included

### 🎨 Components
- **FlipCard** - 3D flip card with animations
- **AnimatedGradient** - Animated gradient backgrounds
- **Breadcrumbs** - Navigation breadcrumbs
- **GoogleSignInButton** - OAuth sign-in button (parametrized)
- **Auth Guards** - Route protection (ClientAuthGuard, TesterAuthGuard)
- **LoadingState** - 7 loading variants (Spinner, Overlay, Skeleton, etc.)
- **NotificationContainer** - Toast notifications
- **ErrorBoundary** - Error handling
- **PhotoUpload** - Photo upload with preview
- **AppTooltip** - Styled tooltips

### 🪝 Hooks
- **useSoundFeedback** - Web Audio API sound effects
- **useAsync** - Async operations with loading states
- **useModal** - Modal state management
- **useResponsive** - Responsive breakpoints
- **useModernEffects** - Modern UI effects (glassmorphism, etc.)

### 🎨 Styles
- **BORDER_RADIUS** - Complete border radius system
- **animations** - Framer Motion animations
- **modernEffects** - Glassmorphism, gradients
- **responsive** - Breakpoints, media queries

### 🛠️ Utils
- **validation** - Form validation helpers
- **helpers** - Generic utility functions
- **imageCompression** - Image compression
- **photoStorage** - Photo storage factory (parametrized)
- **czechGrammar** - Czech language helpers (vocative, plurals)
- **avatarHelper** - Avatar utilities
- **touchHandlers** - Touch/swipe handlers

### 🎭 Context
- **NotificationContext** - Universal notification system
- **createAuthContext** - Generic auth context factory
- **createClientAuthContext** - Client auth factory
- **createTesterAuthContext** - Tester auth factory

### 🎨 Themes
- **natureTheme** - MUI nature theme (green palette)

---

## 🔑 Key Feature: Factory Pattern

Module-specific dependencies (Supabase client, table names) are **passed as parameters**:

```javascript
import { createClientAuthContext } from '@proapp/shared/context';
import { supabase } from '@/config/supabase';

// CoachPro
const { ClientAuthProvider, useClientAuth } = createClientAuthContext({
  supabaseClient: supabase,
  tableName: 'coachpro_client_profiles',
  onLogout: clearCurrentUser
});

// ContentPro
const { ClientAuthProvider, useClientAuth } = createClientAuthContext({
  supabaseClient: supabase,
  tableName: 'contentpro_user_profiles'
});
```

---

## 📖 Examples

### FlipCard
```javascript
import { FlipCard } from '@proapp/shared/components';

<FlipCard
  frontContent={<div>Click to flip!</div>}
  backContent={<div>Back side</div>}
  gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  onFlip={(isFlipped) => console.log('Flipped:', isFlipped)}
/>
```

### Sound Feedback
```javascript
import { useSoundFeedback } from '@proapp/shared/hooks';

const { playClick, playSuccess, playFlip } = useSoundFeedback({
  volume: 0.3,
  enabled: true
});

<Button onClick={() => {
  playClick();
  handleAction();
}}>
  Click Me
</Button>
```

### Auth Context
```javascript
import { createClientAuthContext } from '@proapp/shared/context';
import { ClientAuthGuard } from '@proapp/shared/components';

const { ClientAuthProvider, useClientAuth } = createClientAuthContext({
  supabaseClient: supabase,
  tableName: 'coachpro_client_profiles'
});

<ClientAuthProvider>
  <ClientAuthGuard useAuth={useClientAuth}>
    <Dashboard />
  </ClientAuthGuard>
</ClientAuthProvider>
```

### Photo Storage
```javascript
import { createPhotoStorage, PHOTO_BUCKETS } from '@proapp/shared/utils';

const { uploadPhoto, deletePhoto } = createPhotoStorage(supabase);

const { url } = await uploadPhoto(file, {
  bucket: PHOTO_BUCKETS.CLIENT_PHOTOS,
  userId: profile.id
});
```

---

## 📚 Documentation

- **[PROAPP_SHARED_PACKAGE.md](../../docs/PROAPP_SHARED_PACKAGE.md)** - Complete documentation
- **[PROAPP_MONOREPO_MIGRATION.md](../../docs/PROAPP_MONOREPO_MIGRATION.md)** - Monorepo migration guide

---

## 📊 Statistics

- **37 files** - ~5000+ lines of code
- **Components:** 14 files
- **Hooks:** 5 files
- **Utils:** 7 files
- **Styles:** 4 files
- **Context:** 4 files
- **Themes:** 1 file
- **Constants:** 2 files

---

**License:** MIT
**Author:** ProApp Team
