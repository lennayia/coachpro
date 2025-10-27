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

const Header = ({ onMenuClick }) => {
  const { mode, toggleTheme } = useThemeMode();
  const currentUser = getCurrentUser();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(15, 15, 15, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        {/* Menu button (mobile) */}
        <IconButton
          edge="start"
          color="inherit"
          onClick={onMenuClick}
          sx={{
            mr: 2,
            display: { md: 'none' },
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #8FBC8F 0%, #556B2F 100%)'
                : 'linear-gradient(135deg, #556B2F 0%, #228B22 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          CoachPro 🌿
        </Typography>

        {/* Theme toggle */}
        <Tooltip title={mode === 'dark' ? 'Světlý režim' : 'Tmavý režim'}>
          <IconButton onClick={toggleTheme} color="inherit" sx={{ mr: 2 }}>
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
