import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  TextField,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { X, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import BORDER_RADIUS from '@styles/borderRadius';
import { getCardTheme, createCardGlassEffect, CARD_MOTIFS } from '@shared/constants/cardDeckThemes';
import { getCardImageStyles } from '@shared/constants/cardImageFilters';
import { QuickTooltip } from '@shared/components/AppTooltip';
import { createSwipeHandlers } from '@shared/utils/touchHandlers';

/**
 * CardFlipView - 3D flip karty s poznámkami
 *
 * Full-screen viewer s:
 * - 3D flip animací (klik na kartu)
 * - Swipe left/right pro další/předchozí kartu
 * - Keyboard navigation (←/→)
 * - Poznámky na zadní straně
 *
 * @param {boolean} open - Dialog otevřen/zavřen
 * @param {object} card - Aktuální karta { id, title, image, description, notes }
 * @param {number} currentIndex - Index aktuální karty
 * @param {number} totalCards - Celkový počet karet
 * @param {string} selectedMotif - ID vybraného motivu
 * @param {function} onClose - Handler pro zavření
 * @param {function} onNext - Handler pro další kartu
 * @param {function} onPrev - Handler pro předchozí kartu
 * @param {function} onUpdateNotes - Handler pro uložení poznámek
 */
const CardFlipView = ({
  open,
  card,
  currentIndex = 0,
  totalCards = 0,
  selectedMotif,
  onClose,
  onNext,
  onPrev,
  onUpdateNotes,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const motifTheme = getCardTheme(selectedMotif, isDark);
  const imageStyles = getCardImageStyles(selectedMotif, true, isDark); // isFullScreen = true

  const [isFlipped, setIsFlipped] = useState(false);
  const [notes, setNotes] = useState(card?.notes || '');

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (!open) return;

      if (e.key === 'ArrowLeft') {
        onPrev();
        setIsFlipped(false);
      } else if (e.key === 'ArrowRight') {
        onNext();
        setIsFlipped(false);
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped(!isFlipped);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [open, isFlipped, onNext, onPrev, onClose]);

  // Swipe handlers
  const swipeHandlers = createSwipeHandlers({
    onSwipeLeft: () => {
      onNext();
      setIsFlipped(false);
    },
    onSwipeRight: () => {
      onPrev();
      setIsFlipped(false);
    },
    threshold: 50,
  });

  // Update notes když se změní karta
  React.useEffect(() => {
    if (card) {
      setNotes(card.notes || '');
      setIsFlipped(false);
    }
  }, [card]);

  // Save notes
  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    if (onUpdateNotes) {
      onUpdateNotes(card.id, newNotes);
    }
  };

  if (!card) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullScreen={isSmallScreen}
      PaperProps={{
        sx: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          overflow: 'hidden',
        },
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: isDark
            ? 'rgba(0, 0, 0, 0.9)'
            : 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
        },
      }}
    >
      <DialogContent
        sx={{
          p: { xs: 2, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          minHeight: isSmallScreen ? '100vh' : '80vh',
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: { xs: 8, sm: 16 },
            right: { xs: 8, sm: 16 },
            backgroundColor: motifTheme.cardBg,
            backdropFilter: 'blur(10px)',
            color: motifTheme.text,
            zIndex: 1000,
            '&:hover': {
              backgroundColor: motifTheme.hover,
            },
          }}
        >
          <X size={24} />
        </IconButton>

        {/* Card counter */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 8, sm: 16 },
            left: { xs: 8, sm: 16 },
            backgroundColor: motifTheme.cardBg,
            backdropFilter: 'blur(10px)',
            px: 2,
            py: 1,
            borderRadius: BORDER_RADIUS.compact,
            border: `1px solid ${motifTheme.cardBorder}`,
            zIndex: 1000,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: motifTheme.text,
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            {currentIndex + 1} / {totalCards}
          </Typography>
        </Box>

        {/* Flip indicator */}
        <QuickTooltip title={isFlipped ? "Klikni pro otočení zpět" : "Klikni pro otočení karty"}>
          <IconButton
            onClick={() => setIsFlipped(!isFlipped)}
            sx={{
              position: 'absolute',
              bottom: { xs: 80, sm: 100 },
              right: { xs: 8, sm: 16 },
              backgroundColor: motifTheme.primary,
              color: '#fff',
              zIndex: 1000,
              '&:hover': {
                backgroundColor: motifTheme.secondary,
                transform: 'rotate(180deg)',
              },
              transition: 'all 0.4s',
            }}
          >
            <RotateCw size={24} />
          </IconButton>
        </QuickTooltip>

        {/* Navigation buttons */}
        {currentIndex > 0 && (
          <IconButton
            onClick={() => {
              onPrev();
              setIsFlipped(false);
            }}
            sx={{
              position: 'absolute',
              left: { xs: 8, sm: 16 },
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: motifTheme.cardBg,
              backdropFilter: 'blur(10px)',
              color: motifTheme.text,
              zIndex: 1000,
              '&:hover': {
                backgroundColor: motifTheme.hover,
              },
            }}
          >
            <ChevronLeft size={32} />
          </IconButton>
        )}

        {currentIndex < totalCards - 1 && (
          <IconButton
            onClick={() => {
              onNext();
              setIsFlipped(false);
            }}
            sx={{
              position: 'absolute',
              right: { xs: 8, sm: 16 },
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: motifTheme.cardBg,
              backdropFilter: 'blur(10px)',
              color: motifTheme.text,
              zIndex: 1000,
              '&:hover': {
                backgroundColor: motifTheme.hover,
              },
            }}
          >
            <ChevronRight size={32} />
          </IconButton>
        )}

        {/* Card with flip animation */}
        <Box
          {...swipeHandlers}
          onClick={() => setIsFlipped(!isFlipped)}
          sx={{
            width: { xs: '90%', sm: '500px' },
            height: { xs: 'auto', sm: '700px' },
            aspectRatio: '2 / 3',
            perspective: '1000px',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Front side - Obrázek */}
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                ...createCardGlassEffect(selectedMotif, isDark),
                borderRadius: BORDER_RADIUS.card,
                overflow: 'hidden',
                boxShadow: `0 20px 60px ${motifTheme.glow}`,
              }}
            >
              {card.image ? (
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  {/* Obrázek s CSS filtrem (full-screen = více detailů) */}
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="eager"
                    decoding="async"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: imageStyles.filter,
                      transition: 'filter 0.3s',
                    }}
                  />

                  {/* Barevný overlay podle motivu */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        selectedMotif === CARD_MOTIFS.MIX
                          ? imageStyles.overlayBackground
                          : motifTheme.primary,
                      opacity: imageStyles.overlayOpacity,
                      mixBlendMode: 'multiply',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Watermark container - zarovnané na baseline */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      right: 8,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                    }}
                  >
                    {/* Logo CoachProApp */}
                    <Typography
                      sx={{
                        fontSize: '0.7rem',
                        fontWeight: 400,
                        color: '#fff',
                        lineHeight: 1,
                        letterSpacing: '0.3px',
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.7), 0 0 4px rgba(0, 0, 0, 0.5)',
                      }}
                    >
                      CoachProApp
                    </Typography>

                    {/* Copyright */}
                    <Typography
                      sx={{
                        fontSize: '0.7rem',
                        fontWeight: 400,
                        color: '#fff',
                        lineHeight: 1,
                        letterSpacing: '0.3px',
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.7), 0 0 4px rgba(0, 0, 0, 0.5)',
                      }}
                    >
                      © online-byznys.cz
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    background: motifTheme.background,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      color: motifTheme.text,
                      fontWeight: 700,
                      textAlign: 'center',
                    }}
                  >
                    {card.title}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Back side - Poznámky */}
            <Box
              onClick={(e) => e.stopPropagation()} // Prevent flip when clicking on notes
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                ...createCardGlassEffect(selectedMotif, isDark),
                borderRadius: BORDER_RADIUS.card,
                overflow: 'hidden',
                boxShadow: `0 20px 60px ${motifTheme.glow}`,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              {/* Název karty */}
              <Typography
                variant="h5"
                sx={{
                  color: motifTheme.text,
                  fontWeight: 700,
                  textAlign: 'center',
                  mb: 1,
                }}
              >
                {card.title}
              </Typography>

              {/* Popis */}
              {card.description && (
                <Typography
                  variant="body2"
                  sx={{
                    color: motifTheme.textSecondary,
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    mb: 2,
                  }}
                >
                  {card.description}
                </Typography>
              )}

              {/* Poznámky */}
              <Box flex="1" display="flex" flexDirection="column">
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: motifTheme.text,
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  Vaše poznámky:
                </Typography>
                <TextField
                  multiline
                  rows={isSmallScreen ? 8 : 12}
                  value={notes}
                  onChange={handleNotesChange}
                  placeholder="Zapište si své myšlenky, pocity a reflexe..."
                  variant="outlined"
                  fullWidth
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: motifTheme.cardBg,
                      color: motifTheme.text,
                      '& fieldset': {
                        borderColor: motifTheme.cardBorder,
                      },
                      '&:hover fieldset': {
                        borderColor: motifTheme.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: motifTheme.primary,
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: motifTheme.text,
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: motifTheme.textSecondary,
                      opacity: 0.7,
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Instructions (bottom) */}
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 8, sm: 16 },
            textAlign: 'center',
            backgroundColor: motifTheme.cardBg,
            backdropFilter: 'blur(10px)',
            px: 3,
            py: 1.5,
            borderRadius: BORDER_RADIUS.compact,
            border: `1px solid ${motifTheme.cardBorder}`,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: motifTheme.textSecondary,
              fontSize: '0.75rem',
            }}
          >
            {isSmallScreen
              ? 'Swipe → další | Klikni → otoč'
              : 'Šipky ← → navigace | Klikni/Enter/Space → otoč | Esc → zavřít'}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CardFlipView;
