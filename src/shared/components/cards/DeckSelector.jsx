import React from 'react';
import { Box, Typography, Card, CardContent, useTheme } from '@mui/material';
import { Package } from 'lucide-react';
import BORDER_RADIUS from '@styles/borderRadius';
import {
  CARD_DECKS,
  CARD_DECK_LABELS,
  CARD_DECK_DESCRIPTIONS,
  getCardTheme,
  createCardGlassEffect,
} from '@shared/constants/cardDeckThemes';

/**
 * DeckSelector - Výběr balíčku karet (A, B, C, D)
 *
 * Zobrazí 4 karty reprezentující balíčky
 * Po kliknutí na balíček se přejde na výběr motivu
 */
const DeckSelector = ({ onSelectDeck, selectedDeck = null }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const decks = [
    { id: CARD_DECKS.A, letter: 'A', color: '#52B788' },
    { id: CARD_DECKS.B, letter: 'B', color: '#E07A5F' },
    { id: CARD_DECKS.C, letter: 'C', color: '#B185DB' },
    { id: CARD_DECKS.D, letter: 'D', color: '#F4A261' },
  ];

  return (
    <Box>
      {/* Nadpis */}
      <Box mb={4} textAlign="center">
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
          Koučovací karty
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontSize: '1rem',
          }}
        >
          Vyberte balíček karet pro práci s klientkou
        </Typography>
      </Box>

      {/* Grid balíčků */}
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        }}
        gap={3}
      >
        {decks.map((deck) => {
          const isSelected = selectedDeck === deck.id;
          const deckTheme = getCardTheme('nature', isDark); // Default nature theme pro deck selector

          return (
            <Card
              key={deck.id}
              onClick={() => onSelectDeck(deck.id)}
              elevation={0}
              sx={{
                ...createCardGlassEffect('nature', isDark),
                borderRadius: BORDER_RADIUS.card,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: isSelected
                  ? `2px solid ${deck.color}`
                  : `1px solid ${deckTheme.cardBorder}`,
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.03)',
                  boxShadow: `0 20px 40px rgba(0, 0, 0, 0.2), 0 0 20px ${deck.color}40`,
                  borderColor: deck.color,
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
                  minHeight: 200,
                }}
              >
                {/* Ikona balíčku */}
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${deck.color}20 0%, ${deck.color}40 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid ${deck.color}60`,
                    transition: 'all 0.3s',
                  }}
                >
                  <Package size={40} style={{ color: deck.color }} />
                </Box>

                {/* Písmeno balíčku */}
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    fontSize: '3rem',
                    color: deck.color,
                    textShadow: isDark
                      ? `0 0 20px ${deck.color}60`
                      : `0 0 10px ${deck.color}40`,
                  }}
                >
                  {deck.letter}
                </Typography>

                {/* Název */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    textAlign: 'center',
                  }}
                >
                  {CARD_DECK_LABELS[deck.id]}
                </Typography>

                {/* Popis */}
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    lineHeight: 1.4,
                  }}
                >
                  {CARD_DECK_DESCRIPTIONS[deck.id]}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default DeckSelector;
