import React from 'react';
import { Box, Typography, Card, CardContent, useTheme, IconButton } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import BORDER_RADIUS from '@styles/borderRadius';
import {
  CARD_MOTIFS,
  CARD_MOTIF_LABELS,
  CARD_MOTIF_ICONS,
  CARD_MOTIF_DESCRIPTIONS,
  CARD_DECK_LABELS,
  getCardTheme,
  createCardGlassEffect,
} from '@shared/constants/cardDeckThemes';
import { QuickTooltip } from '@shared/components/AppTooltip';

/**
 * MotifSelector - Výběr motivu karet (Člověk, Příroda, Abstrakt, Mix)
 *
 * Zobrazí 4 karty reprezentující motivy
 * Po kliknutí na motiv se přejde na grid karet
 */
const MotifSelector = ({ selectedDeck, onSelectMotif, onBack, selectedMotif = null }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const motifs = [
    {
      id: CARD_MOTIFS.HUMAN,
      icon: CARD_MOTIF_ICONS[CARD_MOTIFS.HUMAN],
      preview: '🧡', // Emoji preview
    },
    {
      id: CARD_MOTIFS.NATURE,
      icon: CARD_MOTIF_ICONS[CARD_MOTIFS.NATURE],
      preview: '💚',
    },
    {
      id: CARD_MOTIFS.ABSTRACT,
      icon: CARD_MOTIF_ICONS[CARD_MOTIFS.ABSTRACT],
      preview: '💜',
    },
    {
      id: CARD_MOTIFS.MIX,
      icon: CARD_MOTIF_ICONS[CARD_MOTIFS.MIX],
      preview: '🌈',
    },
  ];

  return (
    <Box>
      {/* Nadpis + Zpět button */}
      <Box mb={4} position="relative">
        {/* Zpět button */}
        <QuickTooltip title="Zpět na výběr balíčku">
          <IconButton
            onClick={onBack}
            sx={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
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
        <Box textAlign="center">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: isDark
                ? 'linear-gradient(135deg, #52B788 0%, #E07A5F 50%, #B185DB 100%)'
                : 'linear-gradient(135deg, #40916C 0%, #D6654F 50%, #9966CC 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {selectedDeck ? CARD_DECK_LABELS[selectedDeck] : 'Vyberte motiv'}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontSize: '1rem',
            }}
          >
            Vyberte vizuální motiv karet
          </Typography>
        </Box>
      </Box>

      {/* Grid motivů */}
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        gap={3}
      >
        {motifs.map((motif) => {
          const isSelected = selectedMotif === motif.id;
          const motifTheme = getCardTheme(motif.id, isDark);

          return (
            <Card
              key={motif.id}
              onClick={() => onSelectMotif(motif.id)}
              elevation={0}
              sx={{
                ...createCardGlassEffect(motif.id, isDark),
                borderRadius: BORDER_RADIUS.card,
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                border: isSelected
                  ? `2px solid ${motifTheme.primary}`
                  : `1px solid ${motifTheme.cardBorder}`,
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-12px) scale(1.03)',
                  boxShadow: `0 24px 48px ${motifTheme.glow}`,
                  borderColor: motifTheme.primary,
                },
                // Animated background gradient
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: motifTheme.background,
                  opacity: 0.15,
                  zIndex: 0,
                  transition: 'opacity 0.4s',
                },
                '&:hover::before': {
                  opacity: 0.25,
                },
              }}
            >
              <CardContent
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  minHeight: 240,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {/* Velký emoji icon */}
                <Box
                  sx={{
                    fontSize: '5rem',
                    lineHeight: 1,
                    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
                    transition: 'transform 0.4s',
                    '&:hover': {
                      transform: 'scale(1.1) rotate(5deg)',
                    },
                  }}
                >
                  {motif.icon}
                </Box>

                {/* Preview emoji */}
                <Box
                  sx={{
                    fontSize: '2rem',
                    lineHeight: 1,
                    opacity: 0.7,
                  }}
                >
                  {motif.preview}
                </Box>

                {/* Název */}
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    textAlign: 'center',
                    textShadow: isDark
                      ? `0 0 20px ${motifTheme.glow}`
                      : 'none',
                  }}
                >
                  {CARD_MOTIF_LABELS[motif.id]}
                </Typography>

                {/* Popis */}
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                  }}
                >
                  {CARD_MOTIF_DESCRIPTIONS[motif.id]}
                </Typography>

                {/* Barevná linka na spodu */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: motifTheme.primary,
                    opacity: isSelected ? 1 : 0.5,
                    transition: 'opacity 0.3s',
                  }}
                />
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default MotifSelector;
