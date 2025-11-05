import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Close as CloseIcon, BookmarkAdd as SaveIcon } from '@mui/icons-material';
import BORDER_RADIUS from '@styles/borderRadius';
import { useNotification } from '@shared/context/NotificationContext';
import { supabase } from '@shared/config/supabase';
import { generateUUID } from '../../utils/generateCode';
import { fadeInUp } from '@shared/styles/animations';

const CYKLUS_COLORS = {
  Jaro: { main: '#A8D5BA', dark: '#78BC92' },
  Léto: { main: '#FFB84D', dark: '#F59E1F' },
  Podzim: { main: '#C17B5C', dark: '#A5624B' },
  Zima: { main: '#B3D9E8', dark: '#8AC4D9' },
};

const CardViewer = ({ card, sharedDeckId, onClose, onSave }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { showSuccess } = useNotification();

  const [activeStep, setActiveStep] = useState(0);
  const [usageId, setUsageId] = useState(null);

  const steps = ['Před', 'Praxe', 'Po'];
  const color = CYKLUS_COLORS[card.cyklus];

  // Track usage při otevření
  useEffect(() => {
    trackUsage('pred');
  }, []);

  const trackUsage = async (step) => {
    try {
      const id = usageId || generateUUID();

      const { error } = await supabase.from('coachpro_card_usage').upsert({
        id,
        shared_deck_id: sharedDeckId,
        card_id: card.id,
        client_name: sessionStorage.getItem('clientName') || 'Neznámá klientka',
        step_reached: step,
        completed: step === 'po',
      });

      if (error) throw error;
      if (!usageId) setUsageId(id);
    } catch (error) {
      console.error('Error tracking usage:', error);
    }
  };

  const handleNext = () => {
    const nextStep = activeStep + 1;
    setActiveStep(nextStep);

    // Track krok
    if (nextStep === 1) trackUsage('praxe');
    if (nextStep === 2) trackUsage('po');
  };

  const handleSave = async () => {
    try {
      // Update usage jako completed
      await supabase
        .from('coachpro_card_usage')
        .update({ completed: true, notes: '' })
        .eq('id', usageId);

      showSuccess('Hotovo! 🎉', 'Karta uložena do tvých karet');
      if (onSave) onSave(card);
      onClose();
    } catch (error) {
      console.error('Error saving card:', error);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1300,
        background: isDark
          ? 'rgba(0, 0, 0, 0.9)'
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        overflow: 'auto',
        p: { xs: 2, sm: 4 },
      }}
    >
      {/* Close button */}
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: 'text.primary',
          backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          '&:hover': {
            backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      <Box
        sx={{
          maxWidth: 800,
          mx: 'auto',
          py: 4,
        }}
      >
        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Card Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Card
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: BORDER_RADIUS.card,
                background: isDark
                  ? `linear-gradient(135deg, rgba(${parseInt(color.main.slice(1, 3), 16)}, ${parseInt(color.main.slice(3, 5), 16)}, ${parseInt(color.main.slice(5, 7), 16)}, 0.1) 0%, rgba(${parseInt(color.dark.slice(1, 3), 16)}, ${parseInt(color.dark.slice(3, 5), 16)}, ${parseInt(color.dark.slice(5, 7), 16)}, 0.1) 100%)`
                  : `linear-gradient(135deg, ${color.main}15 0%, ${color.dark}15 100%)`,
                border: `2px solid ${color.main}50`,
              }}
            >
              {/* Obrázek karty */}
              <Box
                component="img"
                src={card.image_path || '/images/karty/placeholder.jpg'}
                alt={card.nazev_karty}
                sx={{
                  width: '100%',
                  maxWidth: 400,
                  height: 'auto',
                  aspectRatio: '1/1',
                  mx: 'auto',
                  display: 'block',
                  borderRadius: BORDER_RADIUS.card,
                  mb: 4,
                  boxShadow: `0 8px 24px ${color.main}40`,
                }}
              />

              {/* Krok 1: PŘED */}
              {activeStep === 0 && (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      color: color.main,
                      fontWeight: 600,
                    }}
                  >
                    {card.nazev_karty}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 4,
                      fontSize: { xs: 16, sm: 18 },
                      lineHeight: 1.8,
                      fontStyle: 'italic',
                    }}
                  >
                    "{card.poznamka_pred}"
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleNext}
                    sx={{
                      px: 6,
                      py: 1.5,
                      borderRadius: BORDER_RADIUS.compact,
                      background: `linear-gradient(135deg, ${color.main} 0%, ${color.dark} 100%)`,
                      fontWeight: 600,
                      fontSize: 16,
                    }}
                  >
                    Ano, to je ono →
                  </Button>
                </Box>
              )}

              {/* Krok 2: PRAXE */}
              {activeStep === 1 && (
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 3,
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: { xs: 22, sm: 28 },
                      color: color.main,
                      lineHeight: 1.4,
                    }}
                  >
                    {card.afirmace}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 4,
                      fontSize: { xs: 16, sm: 18 },
                      lineHeight: 1.8,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {card.koucovaci_text}
                  </Typography>
                  <Box sx={{ textAlign: 'center' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleNext}
                      sx={{
                        px: 6,
                        py: 1.5,
                        borderRadius: BORDER_RADIUS.compact,
                        background: `linear-gradient(135deg, ${color.main} 0%, ${color.dark} 100%)`,
                        fontWeight: 600,
                        fontSize: 16,
                      }}
                    >
                      Dokončil/a jsem →
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Krok 3: PO */}
              {activeStep === 2 && (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      fontSize: { xs: 16, sm: 18 },
                      lineHeight: 1.8,
                      fontStyle: 'italic',
                    }}
                  >
                    "{card.poznamka_po}"
                  </Typography>
                  <Box
                    sx={{
                      p: 3,
                      mb: 4,
                      background: `${color.main}20`,
                      borderRadius: BORDER_RADIUS.card,
                      border: `1px solid ${color.main}50`,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Cílový stav
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: color.main,
                      }}
                    >
                      {card.cilovy_stav}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={onClose}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: BORDER_RADIUS.compact,
                        borderColor: color.main,
                        color: color.main,
                        '&:hover': {
                          borderColor: color.dark,
                          backgroundColor: `${color.main}15`,
                        },
                      }}
                    >
                      Zavřít
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: BORDER_RADIUS.compact,
                        background: `linear-gradient(135deg, ${color.main} 0%, ${color.dark} 100%)`,
                        fontWeight: 600,
                      }}
                    >
                      Uložit kartu
                    </Button>
                  </Box>
                </Box>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default CardViewer;
