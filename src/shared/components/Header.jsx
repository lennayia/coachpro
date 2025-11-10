import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Tooltip,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { useThemeMode } from '../../App';
import { getCurrentUser } from '../../modules/coach/utils/storage';
import { useHeader } from '../hooks/useModernEffects';
import { createBackdrop, createGlassDialog } from '../styles/modernEffects';
import BORDER_RADIUS from '@styles/borderRadius';
import BetaInfoContent from './BetaInfoContent';
import { getBetaBadgeInfo } from '../constants/betaInfo';
import FloatingMenu from './FloatingMenu';
import NavigationFloatingMenu from './NavigationFloatingMenu';

const Header = ({ onFloatingMenuToggle, userType = 'coach', logoutHandler = null }) => {
  const { mode, toggleTheme } = useThemeMode();
  const currentUser = getCurrentUser();
  const headerStyles = useHeader();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [betaDialogOpen, setBetaDialogOpen] = useState(false);
  const [navigationMenuOpen, setNavigationMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const betaBadgeInfo = getBetaBadgeInfo();

  // Handler pro NavigationFloatingMenu - zavře settings menu
  const handleNavigationToggle = (newState) => {
    setNavigationMenuOpen(newState);
    if (newState && settingsMenuOpen) {
      setSettingsMenuOpen(false);
    }
    // Notify Layout about any menu being open
    onFloatingMenuToggle?.(newState || settingsMenuOpen);
  };

  // Handler pro FloatingMenu (settings) - zavře navigation menu
  const handleSettingsToggle = (newState) => {
    setSettingsMenuOpen(newState);
    if (newState && navigationMenuOpen) {
      setNavigationMenuOpen(false);
    }
    // Notify Layout about any menu being open
    onFloatingMenuToggle?.(newState || navigationMenuOpen);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        ...headerStyles,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        {/* Logo */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <img
            src="/coachPro.png"
            alt="CoachProApp"
            style={{
              height: '48px',
              width: 'auto',
            }}
          />
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                lineHeight: 1.2,
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #8FBC8F 0%, #556B2F 100%)'
                    : 'linear-gradient(135deg, #556B2F 0%, #228B22 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              CoachPro
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: 'text.secondary',
                fontSize: '0.7rem',
                mt: -0.5,
              }}
            >
              Aplikace pro koučky
            </Typography>
          </Box>

          {/* Beta Badge */}
          <Tooltip title="Klikni pro víc info o beta testování">
            <Chip
              label="BETA"
              size="small"
              onClick={() => setBetaDialogOpen(true)}
              sx={{
                ml: 1.5,
                height: 24,
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: 0.5,
                cursor: 'pointer',
                backgroundColor: 'secondary.main',
                color: '#fff',
                border: 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'secondary.dark',
                  transform: 'scale(1.05)',
                },
              }}
            />
          </Tooltip>
        </Box>

        {/* Navigation Floating Menu (Left) */}
        <NavigationFloatingMenu
          isOpen={navigationMenuOpen}
          onToggle={handleNavigationToggle}
          userType={userType}
        />

        {/* Floating Menu (Right) */}
        <FloatingMenu
          isOpen={settingsMenuOpen}
          onToggle={handleSettingsToggle}
          userType={userType}
          logoutHandler={logoutHandler}
        />
      </Toolbar>

      {/* Beta Info Dialog */}
      <Dialog
        open={betaDialogOpen}
        onClose={() => setBetaDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        BackdropProps={{ sx: createBackdrop() }}
        PaperProps={{ sx: createGlassDialog(isDark, BORDER_RADIUS.dialog) }}
      >
        <DialogContent sx={{ py: 3 }}>
          <BetaInfoContent variant="dialog" data={betaBadgeInfo} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setBetaDialogOpen(false)}
            variant="contained"
            sx={{
              px: 4,
              py: 1,
              borderRadius: BORDER_RADIUS.compact,
              fontWeight: 600,
              textTransform: 'none',
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(139, 188, 143, 0.95) 0%, rgba(85, 107, 47, 0.9) 100%)'
                  : 'linear-gradient(135deg, rgba(85, 107, 47, 0.95) 0%, rgba(139, 188, 143, 0.9) 100%)',
              boxShadow: '0 4px 12px rgba(85, 107, 47, 0.3)',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(85, 107, 47, 0.4)',
              },
            }}
          >
            Rozumím ✓
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Header;
