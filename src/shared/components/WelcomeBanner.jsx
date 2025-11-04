import React, { useState, useEffect } from 'react';
import { Alert, Box, Button, IconButton, Collapse, useTheme } from '@mui/material';
import { Close } from '@mui/icons-material';
import BORDER_RADIUS from '@styles/borderRadius';
import BetaInfoContent from './BetaInfoContent';
import { getWelcomeBannerContent, getBetaConfig } from '../constants/betaInfo';

/**
 * WelcomeBanner - Dismissable beta banner (zobrazí se 3×)
 *
 * Používá localStorage pro tracking:
 * - coachpro_banner_show_count: počet zobrazení
 *
 * @created 4.11.2025
 */
const WelcomeBanner = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const bannerContent = getWelcomeBannerContent();
  const config = getBetaConfig();

  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check localStorage pro počet zobrazení
    const showCount = parseInt(localStorage.getItem(config.bannerLocalStorageKey) || '0', 10);

    if (showCount < config.bannerShowCount) {
      setShowBanner(true);
      // Increment counter
      localStorage.setItem(config.bannerLocalStorageKey, (showCount + 1).toString());
    }
  }, [config.bannerLocalStorageKey, config.bannerShowCount]);

  const handleDismiss = () => {
    setShowBanner(false);
    // Set counter to max (won't show again)
    localStorage.setItem(config.bannerLocalStorageKey, config.bannerShowCount.toString());
  };

  if (!showBanner) return null;

  return (
    <Collapse in={showBanner}>
      <Alert
        severity="info"
        icon={false}
        sx={{
          mb: 3,
          borderRadius: BORDER_RADIUS.card,
          backgroundColor: isDark ? 'rgba(66, 165, 245, 0.1)' : 'rgba(66, 165, 245, 0.05)',
          border: '1px solid',
          borderColor: isDark ? 'rgba(66, 165, 245, 0.3)' : 'rgba(66, 165, 245, 0.2)',
          position: 'relative',
        }}
        action={
          <Box display="flex" alignItems="flex-start" gap={1}>
            <Button
              variant="contained"
              size="small"
              onClick={handleDismiss}
              sx={{
                borderRadius: BORDER_RADIUS.compact,
                fontWeight: 600,
                textTransform: 'none',
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(139, 188, 143, 0.95) 0%, rgba(85, 107, 47, 0.9) 100%)'
                    : 'linear-gradient(135deg, rgba(85, 107, 47, 0.95) 0%, rgba(139, 188, 143, 0.9) 100%)',
                boxShadow: '0 2px 8px rgba(85, 107, 47, 0.2)',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(85, 107, 47, 0.3)',
                },
              }}
            >
              {bannerContent.buttonText}
            </Button>
            <IconButton onClick={handleDismiss} size="small">
              <Close fontSize="small" />
            </IconButton>
          </Box>
        }
      >
        <BetaInfoContent variant="banner" data={bannerContent} />
      </Alert>
    </Collapse>
  );
};

export default WelcomeBanner;
