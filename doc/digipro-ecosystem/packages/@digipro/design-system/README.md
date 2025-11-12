# @digipro/design-system

Unified design system for DigiPro ecosystem - integrating DigiPro and PaymentsPro applications.

## 🎨 Features

- **Unified Theme System** - Light/Dark mode with seamless switching
- **CSS Variables** - For compatibility with existing applications
- **Material-UI Integration** - Enhanced MUI components with DigiPro styling
- **Glassmorphism Effects** - Modern glass-like UI elements
- **Responsive Design** - Mobile-first approach with consistent breakpoints
- **TypeScript Ready** - Full TypeScript support (planned)
- **Tree Shakable** - Import only what you need

## 📦 Installation

```bash
npm install @digipro/design-system
```

### Peer Dependencies

```bash
npm install react react-dom @mui/material @emotion/react @emotion/styled
```

## 🚀 Quick Start

### 1. Wrap your app with ThemeProvider

```jsx
import { DigiProThemeProvider } from '@digipro/design-system';

function App() {
  return (
    <DigiProThemeProvider initialMode="light" enableSystemTheme>
      <YourApp />
    </DigiProThemeProvider>
  );
}
```

### 2. Use DigiPro components

```jsx
import { Button, Card, useDigiProTheme } from '@digipro/design-system';

function MyComponent() {
  const { mode, toggleMode } = useDigiProTheme();

  return (
    <Card elevation="md" glassmorphism interactive>
      <h2>Welcome to DigiPro</h2>
      <p>Current theme: {mode}</p>
      
      <Button 
        variant="contained" 
        onClick={toggleMode}
        size="large"
      >
        Toggle Theme
      </Button>
    </Card>
  );
}
```

## 🎯 Design Tokens

### Colors

```js
import { colors, semanticColors } from '@digipro/design-system';

// Access color palette
colors.primary[500]  // #64748b
colors.accent[600]   // #c026d3
colors.success[500]  // #22c55e

// Semantic colors (theme-aware)
semanticColors.light.textPrimary    // #18181b
semanticColors.dark.textPrimary     // #fafafa
```

### Typography

```js
import { typography, textStyles } from '@digipro/design-system';

// Font system
typography.fonts.primary    // 'Inter', ...
typography.fontSize.lg      // 1.125rem

// Predefined text styles
textStyles.h1              // Complete heading style
textStyles.body            // Body text style
textStyles.button          // Button text style
```

### Spacing & Layout

```js
import { spacing, breakpoints, shadows } from '@digipro/design-system';

spacing[4]              // 1rem (16px)
breakpoints.md         // 768px
shadows.cardHover      // Elevated card shadow
```

## 🧩 Components

### Button

```jsx
import { Button, IconButton, ButtonGroup } from '@digipro/design-system';

// Basic button
<Button variant="contained" size="large">
  Primary Action
</Button>

// With loading state
<Button loading variant="outlined">
  Save Changes
</Button>

// Icon button
<IconButton size="medium">
  <EditIcon />
</IconButton>

// Button group
<ButtonGroup spacing={2}>
  <Button variant="outlined">Cancel</Button>
  <Button variant="contained">Save</Button>
</ButtonGroup>
```

### Card

```jsx
import { Card, CardWithHeader, CompactCard } from '@digipro/design-system';

// Basic card
<Card elevation="md" interactive onClick={handleClick}>
  <h3>Card Title</h3>
  <p>Card content...</p>
</Card>

// Glassmorphism effect
<Card glassmorphism elevation="lg">
  <p>Modern glass effect</p>
</Card>

// Card with progress
<Card progress={75} progressColor="success">
  <p>75% Complete</p>
</Card>

// Compact dashboard card
<CompactCard
  icon={<DashboardIcon />}
  title="Total Revenue"
  value="$12,345"
  change="+12.5%"
  changeType="positive"
/>
```

## 🎨 Theme Customization

### Using the Theme Hook

```jsx
import { useDigiProTheme } from '@digipro/design-system';

function ThemeControls() {
  const { 
    mode, 
    toggleMode, 
    setMode, 
    colors, 
    spacing,
    isLight,
    isDark 
  } = useDigiProTheme();

  return (
    <div>
      <p>Current mode: {mode}</p>
      <button onClick={toggleMode}>
        Switch to {isLight ? 'Dark' : 'Light'}
      </button>
      <button onClick={() => setMode('light')}>
        Force Light Mode
      </button>
    </div>
  );
}
```

### CSS Variables Integration

The theme system automatically injects CSS variables for compatibility:

```css
/* Available in your CSS */
.custom-component {
  background: var(--surface);
  color: var(--text-primary);
  border: 1px solid var(--border-light);
}
```

## 🔧 Integration with Existing Apps

### PaymentsPro Integration

```jsx
// In your existing PaymentsPro app
import { DigiProThemeProvider, Card, Button } from '@digipro/design-system';

// Wrap existing app
<DigiProThemeProvider>
  <PaymentsApp />
</DigiProThemeProvider>

// Update components gradually
function PaymentCard({ payment }) {
  return (
    <Card elevation="md" interactive>
      <h3>{payment.title}</h3>
      <p>{payment.amount}</p>
      
      <Button variant="outlined" size="small">
        Edit Payment
      </Button>
    </Card>
  );
}
```

### DigiPro Integration

```jsx
// In your existing DigiPro app
import { DigiProThemeProvider } from '@digipro/design-system';

// Replace existing theme provider
<DigiProThemeProvider>
  <DigiProApp />
</DigiProThemeProvider>
```

## 🏗️ Development

### Building the Package

```bash
npm run build     # Build for production
npm run dev       # Watch mode for development
```

### Folder Structure

```
@digipro/design-system/
├── themes/           # Design tokens
│   ├── colors.js     # Color palette & semantic colors
│   ├── typography.js # Font system & text styles
│   └── spacing.js    # Spacing, breakpoints, shadows
├── components/       # React components
│   ├── Button/       # Button components
│   ├── Card/         # Card components
│   ├── Table/        # Table components (planned)
│   └── StatusChip/   # Status indicators (planned)
├── utils/           # Utilities
│   └── ThemeProvider.jsx # Main theme provider
└── index.js         # Main export file
```

## 🚧 Roadmap

- [ ] **Table Component** - Enhanced data tables with sorting, filtering
- [ ] **StatusChip Component** - Status indicators with consistent styling
- [ ] **Layout Components** - Sidebar, Navbar, Page layouts
- [ ] **Form Components** - Enhanced form elements
- [ ] **Data Visualization** - Chart components integration
- [ ] **TypeScript Support** - Full TypeScript definitions
- [ ] **Storybook Documentation** - Interactive component documentation
- [ ] **Testing Suite** - Comprehensive component tests

## 📝 Migration Guide

### From DigiPro Theme

```jsx
// Before
import { createTheme } from '@mui/material/styles';

// After
import { DigiProThemeProvider } from '@digipro/design-system';
```

### From PaymentsPro Custom Styling

```jsx
// Before
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: { primary: { main: '#1976d2' } }
});

// After
import { DigiProThemeProvider } from '@digipro/design-system';
// Unified theme automatically applied
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/new-component`
2. Make changes and add tests
3. Update documentation
4. Submit pull request

## 📄 License

MIT License - see LICENSE file for details.