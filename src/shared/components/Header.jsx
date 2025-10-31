import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useThemeMode } from '../../App';
import { getCurrentUser } from '../../modules/coach/utils/storage';
import { useHeader } from '../hooks/useModernEffects';

const Header = ({ onMenuClick }) => {
  const { mode, toggleTheme } = useThemeMode();
  const currentUser = getCurrentUser();
  const headerStyles = useHeader();

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
        {/* Menu button (mobile) */}
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{
            mr: 2,
            display: { md: 'none' },
            color: mode === 'dark' ? 'inherit' : 'rgba(0, 0, 0, 0.87)',
          }}
        >
          <MenuIcon />
        </IconButton>

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
        </Box>

        {/* Theme toggle */}
        <Tooltip title={mode === 'dark' ? 'Světlý režim' : 'Tmavý režim'}>
          <IconButton
            onClick={toggleTheme}
            sx={{
              mr: 2,
              color: mode === 'dark' ? 'inherit' : 'rgba(0, 0, 0, 0.87)',
            }}
          >
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>

        {/* User avatar */}
        {currentUser && (
          <Tooltip title={currentUser.name || 'Uživatel'}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 40,
                height: 40,
                cursor: 'pointer',
              }}
            >
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} />
              ) : (
                currentUser.name?.[0] || 'U'
              )}
            </Avatar>
          </Tooltip>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
