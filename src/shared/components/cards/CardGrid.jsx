import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardMedia, useTheme, IconButton, Fade } from '@mui/material';
import { ArrowLeft, Shuffle } from 'lucide-react';
import BORDER_RADIUS from '@styles/borderRadius';
import {
  CARD_DECK_LABELS,
  CARD_MOTIF_LABELS,
  CARD_MOTIFS,
  getCardTheme,
  createCardGlassEffect,
} from '@shared/constants/cardDeckThemes';
import { getCardImageStyles } from '@shared/constants/cardImageFilters';
import { QuickTooltip } from '@shared/components/AppTooltip';

/**
 * CardGrid - Grid rozmíchaných karet
 *
 * Zobrazí karty v motivu jako rozmíchaný balíček
 * Kliknutí na kartu otevře CardFlipView
 *
 * @param {string} selectedDeck - ID vybraného balíčku
 * @param {string} selectedMotif - ID vybraného motivu
 * @param {array} cards - Pole karet { id, title, image, description }
 * @param {function} onSelectCard - Handler pro výběr karty
 * @param {function} onBack - Handler pro zpět
 */
const CardGrid = ({
  selectedDeck,
  selectedMotif,
  cards = [],
  onSelectCard,
  onBack,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const motifTheme = getCardTheme(selectedMotif, isDark);
  const imageStyles = getCardImageStyles(selectedMotif, false, isDark);

  const [shuffledCards, setShuffledCards] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);

  // Shuffle funkce (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initial shuffle při načtení
  useEffect(() => {
    if (cards.length > 0) {
      setShuffledCards(shuffleArray(cards));
    }
  }, [cards]);

  // Shuffle handler
  const handleShuffle = () => {
    setIsShuffling(true);
    setTimeout(() => {
      setShuffledCards(shuffleArray(cards));
      setIsShuffling(false);
    }, 300);
  };

  return (
    <Box>
      {/* Nadpis + Akce */}
      <Box mb={4} display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
        {/* Zpět button */}
        <QuickTooltip title="Zpět na výběr motivu">
          <IconButton
            onClick={onBack}
            sx={{
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.06)',
              '&:hover': {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.12)'
                  : 'rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <ArrowLeft size={24} />
          </IconButton>
        </QuickTooltip>

        {/* Nadpis */}
        <Box flex="1" textAlign="center">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              color: motifTheme.text,
              textShadow: isDark ? `0 0 20px ${motifTheme.glow}` : 'none',
            }}
          >
            {CARD_DECK_LABELS[selectedDeck]} - {CARD_MOTIF_LABELS[selectedMotif]}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.9rem',
            }}
          >
            {shuffledCards.length} karet k dispozici
          </Typography>
        </Box>

        {/* Shuffle button */}
        <QuickTooltip title="Zamíchat karty">
          <IconButton
            onClick={handleShuffle}
            disabled={isShuffling}
            sx={{
              backgroundColor: motifTheme.primary,
              color: '#fff',
              '&:hover': {
                backgroundColor: motifTheme.secondary,
                transform: 'rotate(180deg)',
              },
              '&:disabled': {
                backgroundColor: 'rgba(0, 0, 0, 0.12)',
              },
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <Shuffle size={24} />
          </IconButton>
        </QuickTooltip>
      </Box>

      {/* Grid karet */}
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(5, 1fr)',
        }}
        gap={2}
      >
        {shuffledCards.map((card, index) => (
          <Fade
            key={card.id}
            in={!isShuffling}
            timeout={300}
            style={{ transitionDelay: `${index * 30}ms` }}
          >
            <Card
              onClick={() => onSelectCard(card)}
              elevation={0}
              sx={{
                ...createCardGlassEffect(selectedMotif, isDark),
                borderRadius: BORDER_RADIUS.compact,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                aspectRatio: '2 / 3', // Poměr kartičky (poker card ratio)
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.05)',
                  boxShadow: `0 16px 32px ${motifTheme.glow}`,
                  borderColor: motifTheme.primary,
                  zIndex: 10,
                },
                '&:active': {
                  transform: 'translateY(-4px) scale(1.02)',
                },
              }}
            >
              {/* Obrázek karty s filtrem podle motivu */}
              {card.image ? (
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                  }}
                >
                  {/* Obrázek s CSS filtrem */}
                  <CardMedia
                    component="img"
                    image={card.image}
                    alt={card.title}
                    loading="lazy"
                    decoding="async"
                    sx={{
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
                      bottom: 4,
                      left: 4,
                      right: 4,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                    }}
                  >
                    {/* Logo CoachProApp */}
                    <Typography
                      sx={{
                        fontSize: '0.48rem',
                        fontWeight: 400,
                        color: '#fff',
                        lineHeight: 1,
                        letterSpacing: '0.2px',
                        textShadow: '0 1px 4px rgba(0, 0, 0, 0.8), 0 0 2px rgba(0, 0, 0, 0.6)',
                      }}
                    >
                      CoachProApp
                    </Typography>

                    {/* Copyright */}
                    <Typography
                      sx={{
                        fontSize: '0.48rem',
                        fontWeight: 400,
                        color: '#fff',
                        lineHeight: 1,
                        letterSpacing: '0.2px',
                        textShadow: '0 1px 4px rgba(0, 0, 0, 0.8), 0 0 2px rgba(0, 0, 0, 0.6)',
                      }}
                    >
                      © online-byznys.cz
                    </Typography>
                  </Box>
                </Box>
              ) : (
                // Placeholder pokud není obrázek
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    background: motifTheme.background,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 1,
                    p: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: motifTheme.text,
                      fontWeight: 600,
                      textAlign: 'center',
                      fontSize: { xs: '0.8rem', sm: '1rem' },
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: motifTheme.textSecondary,
                      textAlign: 'center',
                      fontSize: '0.65rem',
                    }}
                  >
                    #{index + 1}
                  </Typography>
                </Box>
              )}

              {/* Číslo karty (overlay) */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: motifTheme.cardBg,
                  backdropFilter: 'blur(10px)',
                  borderRadius: '50%',
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${motifTheme.cardBorder}`,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: motifTheme.primary,
                }}
              >
                {index + 1}
              </Box>
            </Card>
          </Fade>
        ))}
      </Box>

      {/* Empty state */}
      {shuffledCards.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              mb: 1,
            }}
          >
            Žádné karty k dispozici
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
            }}
          >
            Karty pro tento balíček a motiv ještě nebyly přidány
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CardGrid;
