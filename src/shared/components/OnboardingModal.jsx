import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Button,
  IconButton,
  useTheme,
  MobileStepper,
} from '@mui/material';
import { ChevronLeft, ChevronRight, Close } from '@mui/icons-material';
import { createBackdrop, createGlassDialog } from '../styles/modernEffects';
import BORDER_RADIUS from '@styles/borderRadius';
import BetaInfoContent from './BetaInfoContent';
import { getOnboardingSlides } from '../constants/betaInfo';

/**
 * OnboardingModal - 3-slide beta onboarding při prvním přihlášení
 *
 * Props:
 * - open: boolean
 * - onClose: function
 *
 * @created 4.11.2025
 */
const OnboardingModal = ({ open, onClose }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const slides = getOnboardingSlides();

  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = slides.length;

  const handleNext = () => {
    if (activeStep === maxSteps - 1) {
      // Last slide - finish onboarding
      onClose();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleSkip}
      maxWidth="sm"
      fullWidth
      BackdropProps={{ sx: createBackdrop() }}
      PaperProps={{
        sx: {
          ...createGlassDialog(isDark, BORDER_RADIUS.dialog),
          minHeight: 500,
        },
      }}
    >
      {/* Close button */}
      <Box position="absolute" top={16} right={16} zIndex={1}>
        <IconButton onClick={handleSkip} size="small">
          <Close />
        </IconButton>
      </Box>

      <DialogContent sx={{ py: 4, px: 4 }}>
        {/* Slide content */}
        <Box minHeight={350} display="flex" flexDirection="column" justifyContent="center">
          <BetaInfoContent variant="slide" data={slides[activeStep]} />
        </Box>

        {/* Progress dots */}
        <MobileStepper
          variant="dots"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          sx={{
            background: 'transparent',
            justifyContent: 'center',
            mt: 3,
            '& .MuiMobileStepper-dot': {
              width: 12,
              height: 12,
              mx: 0.5,
            },
            '& .MuiMobileStepper-dotActive': {
              backgroundColor: 'primary.main',
            },
          }}
          nextButton={<Box />}
          backButton={<Box />}
        />

        {/* Navigation buttons */}
        <Box display="flex" justifyContent="space-between" mt={3} gap={2}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            startIcon={<ChevronLeft />}
            sx={{
              visibility: activeStep === 0 ? 'hidden' : 'visible',
              px: 3,
              py: 1,
              borderRadius: BORDER_RADIUS.compact,
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Zpět
          </Button>

          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={activeStep < maxSteps - 1 ? <ChevronRight /> : null}
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
            {activeStep === maxSteps - 1 ? 'Rozumím, začínám! ✓' : 'Další'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
