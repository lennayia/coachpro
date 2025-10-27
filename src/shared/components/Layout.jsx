import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header onMenuClick={handleDrawerToggle} />
      <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - 200px)` },
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark'
              ? theme.palette.background.default
              : '#fafafa',
          minHeight: '100vh',
        }}
      >
        {/* Toolbar spacer */}
        <Toolbar />

        {/* Page content */}
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
