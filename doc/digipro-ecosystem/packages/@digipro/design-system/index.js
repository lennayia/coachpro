// @digipro/design-system/index.js
// Main export file for DigiPro Design System

// Theme system
export {
  DigiProThemeProvider,
  useDigiProTheme,
  default as ThemeProvider,
} from './utils/ThemeProvider.jsx';

// Design tokens
export { colors, semanticColors, generateCSSVariables } from './themes/colors.js';
export { typography, textStyles } from './themes/typography.js';
export { spacing, breakpoints, containers, borderRadius, shadows, layouts } from './themes/spacing.js';

// Components
export {
  Button,
  IconButton,
  ButtonGroup,
} from './components/Button/Button.jsx';

export {
  Card,
  CardWithHeader,
  CardWithActions,
  CompactCard,
} from './components/Card/Card.jsx';

// Component indexes (will be created)
// export * from './components/Table';
// export * from './components/StatusChip';
// export * from './components/Layout';

// Utility exports
export const version = '1.0.0';

// Re-export commonly used MUI components with DigiPro styling
export {
  // Layout
  Container,
  Grid,
  Box,
  Stack,
  // Typography
  Typography,
  // Form components
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  // Feedback
  Alert,
  Snackbar,
  // Navigation
  Tabs,
  Tab,
  // Data display
  Chip,
  Avatar,
  Badge,
  // Utils
  Tooltip,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

// Export theme creation utilities
export const createDigiProTheme = (mode = 'light') => {
  // This would be moved from ThemeProvider for external use
  console.warn('createDigiProTheme should be used via DigiProThemeProvider');
};

export default {
  ThemeProvider: DigiProThemeProvider,
  useTheme: useDigiProTheme,
  Button,
  Card,
  colors,
  spacing,
  typography,
};