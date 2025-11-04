import { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LibraryBooks as MaterialsIcon,
  Assignment as ProgramsIcon,
  People as ClientsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import BORDER_RADIUS from '../../styles/borderRadius';

const DRAWER_WIDTH = 200;

const menuItems = [
  {
    id: 'dashboard',
    label: 'Přehled',
    icon: <DashboardIcon />,
    path: '/coach/dashboard',
  },
  {
    id: 'materials',
    label: 'Materiály',
    icon: <MaterialsIcon />,
    path: '/coach/materials',
  },
  {
    id: 'programs',
    label: 'Programy',
    icon: <ProgramsIcon />,
    path: '/coach/programs',
  },
  {
    id: 'clients',
    label: 'Klientky',
    icon: <ClientsIcon />,
    path: '/coach/clients',
  },
];

const Sidebar = ({ open, onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ overflow: 'auto', mt: 10 }}>
      <List dense sx={{ py: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.id} disablePadding sx={{ px: 3, mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: BORDER_RADIUS.small,
                  minHeight: '40px',
                  px: 1.5,
                  py: 1,
                  backgroundColor: isActive
                    ? theme.palette.mode === 'dark'
                      ? 'rgba(143, 188, 143, 0.15)'
                      : 'rgba(85, 107, 47, 0.1)'
                    : 'transparent',
                  '&:hover': {
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(143, 188, 143, 0.1)'
                        : 'rgba(85, 107, 47, 0.05)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive
                      ? 'primary.main'
                      : theme.palette.text.secondary,
                    minWidth: 36,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.875rem',
                    color: isActive ? 'primary.main' : 'text.primary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return isMobile ? (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  ) : (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
