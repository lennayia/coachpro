import React from 'react';
import { Box, Typography, Button } from '@mui/material';

// Test imports from @proapp/shared
import { BORDER_RADIUS } from '@proapp/shared/styles';
import { FlipCard } from '@proapp/shared/components';
import { useSoundFeedback } from '@proapp/shared/hooks';
import { SETTINGS_ICONS } from '@proapp/shared/constants';

/**
 * Test component for @proapp/shared package
 * Verifies all imports work correctly
 */
const TestSharedPackage = () => {
  const { playClick, playSuccess } = useSoundFeedback({ volume: 0.3 });

  return (
    <Box sx={{ p: 4, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        ✅ @proapp/shared Package Test
      </Typography>

      {/* Test styles */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Styles (BORDER_RADIUS):
        </Typography>
        <Box
          sx={{
            p: 2,
            borderRadius: BORDER_RADIUS.standard,
            background: 'rgba(139, 188, 143, 0.1)',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Basic values:
          </Typography>
          <Typography variant="body2">• standard: {BORDER_RADIUS.standard}</Typography>
          <Typography variant="body2">• compact: {BORDER_RADIUS.compact}</Typography>
          <Typography variant="body2">• premium: {BORDER_RADIUS.premium}</Typography>
          <Typography variant="body2">• small: {BORDER_RADIUS.small}</Typography>
          <Typography variant="body2">• minimal: {BORDER_RADIUS.minimal}</Typography>

          <Typography variant="body2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
            Component-specific:
          </Typography>
          <Typography variant="body2">• button: {BORDER_RADIUS.button}</Typography>
          <Typography variant="body2">• card: {BORDER_RADIUS.card}</Typography>
          <Typography variant="body2">• input: {BORDER_RADIUS.input}</Typography>
          <Typography variant="body2">• dialog: {BORDER_RADIUS.dialog}</Typography>

          <Typography variant="body2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
            Glassmorphism:
          </Typography>
          <Typography variant="body2">• glassPanel: {BORDER_RADIUS.glassPanel}</Typography>
          <Typography variant="body2">• modal: {BORDER_RADIUS.modal}</Typography>
        </Box>
      </Box>

      {/* Test hooks */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Hooks (useSoundFeedback):
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={playClick}>
            Play Click
          </Button>
          <Button variant="outlined" onClick={playSuccess}>
            Play Success
          </Button>
        </Box>
      </Box>

      {/* Test constants */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Constants (SETTINGS_ICONS):
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <SETTINGS_ICONS.welcome size={24} />
          <SETTINGS_ICONS.profile size={24} />
          <SETTINGS_ICONS.help size={24} />
        </Box>
      </Box>

      {/* Test components */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Components (FlipCard):
        </Typography>
        <FlipCard
          frontContent={
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">Front Side</Typography>
              <Typography variant="body2">Click to flip</Typography>
            </Box>
          }
          backContent={
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">Back Side</Typography>
              <Typography variant="body2">FlipCard works! ✅</Typography>
            </Box>
          }
          gradient="linear-gradient(135deg, rgba(139,188,143,0.35), rgba(85,107,47,0.25))"
          minHeight={150}
        />
      </Box>

      <Box
        sx={{
          p: 2,
          borderRadius: BORDER_RADIUS.standard,
          background: 'rgba(139, 188, 143, 0.1)',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" color="success.main">
          ✅ All @proapp/shared imports successful!
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Package is working correctly
        </Typography>
      </Box>
    </Box>
  );
};

export default TestSharedPackage;
