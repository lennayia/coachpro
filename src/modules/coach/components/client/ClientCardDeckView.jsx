import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  useTheme,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack as BackIcon, CheckCircle as CheckIcon } from '@mui/icons-material';
import BORDER_RADIUS from '@styles/borderRadius';
import { staggerContainer, staggerItem } from '@shared/styles/animations';
import CardViewer from './CardViewer';
import { supabase } from '@shared/config/supabase';

const CYKLUS_COLORS = {
  Jaro: { main: '#A8D5BA', dark: '#78BC92' },
  Léto: { main: '#FFB84D', dark: '#F59E1F' },
  Podzim: { main: '#C17B5C', dark: '#A5624B' },
  Zima: { main: '#B3D9E8', dark: '#8AC4D9' },
};

const ClientCardDeckView = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [deckData, setDeckData] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [usedCardIds, setUsedCardIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeck();
  }, [code]);

  const loadDeck = async () => {
    try {
      // Načti z sessionStorage (uloženo v ClientCardDeckEntry)
      const cached = sessionStorage.getItem('currentCardDeck');
      if (cached) {
        const data = JSON.parse(cached);
        setDeckData(data);

        // Načti usage pro tracking
        await loadUsage(data.id);
      }
    } catch (error) {
      console.error('Error loading deck:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsage = async (sharedDeckId) => {
    try {
      const { data, error } = await supabase
        .from('coachpro_card_usage')
        .select('card_id, completed')
        .eq('shared_deck_id', sharedDeckId)
        .eq('completed', true);

      if (error) throw error;
      setUsedCardIds(data.map((u) => u.card_id));
    } catch (error) {
      console.error('Error loading usage:', error);
    }
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleCloseViewer = () => {
    setSelectedCard(null);
    // Reload usage po zavření (mohla uložit kartu)
    if (deckData) loadUsage(deckData.id);
  };

  if (loading || !deckData) {
    return <Typography sx={{ p: 4 }}>Načítám balíček...</Typography>;
  }

  const color = CYKLUS_COLORS[deckData.deck.cyklus];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: { xs: 2, sm: 4 },
        background: isDark
          ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
          : 'linear-gradient(135deg, #f5f7fa 0%, #e8f0f7 100%)',
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <IconButton onClick={() => navigate('/client/cards')} sx={{ mb: 2 }}>
          <BackIcon />
        </IconButton>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: color.main,
          }}
        >
          {deckData.deck.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {deckData.deck.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          📚 {deckData.cards.length} karet • {usedCardIds.length} dokončených
        </Typography>
      </Box>

      {/* Grid karet */}
      <Grid
        container
        spacing={3}
        component={motion.div}
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {deckData.cards.map((card) => {
          const isUsed = usedCardIds.includes(card.id);

          return (
            <Grid item xs={6} sm={4} md={3} key={card.id}>
              <motion.div variants={staggerItem}>
                <Card
                  onClick={() => handleCardClick(card)}
                  sx={{
                    cursor: 'pointer',
                    position: 'relative',
                    borderRadius: BORDER_RADIUS.card,
                    transition: 'all 0.3s',
                    border: `2px solid ${isUsed ? color.main : 'transparent'}`,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 12px 24px ${color.main}40`,
                    },
                  }}
                >
                  {/* Čtvercový obrázek */}
                  <CardMedia
                    component="img"
                    image={card.image_path || '/images/karty/placeholder.jpg'}
                    alt={card.nazev_karty}
                    sx={{
                      aspectRatio: '1/1',
                      objectFit: 'cover',
                    }}
                  />

                  {/* Název karty */}
                  <CardContent sx={{ p: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        mb: 0.5,
                        fontSize: 14,
                        lineHeight: 1.3,
                      }}
                    >
                      {card.nazev_karty}
                    </Typography>
                    <Chip
                      label={card.primarni_emoce}
                      size="small"
                      sx={{
                        fontSize: 11,
                        height: 20,
                        backgroundColor: `${color.main}20`,
                        color: color.main,
                      }}
                    />
                  </CardContent>

                  {/* Badge pokud dokončeno */}
                  {isUsed && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: color.main,
                        borderRadius: '50%',
                        p: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CheckIcon sx={{ fontSize: 20, color: '#fff' }} />
                    </Box>
                  )}
                </Card>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>

      {/* Card Viewer (fullscreen) */}
      {selectedCard && (
        <CardViewer
          card={selectedCard}
          sharedDeckId={deckData.id}
          onClose={handleCloseViewer}
        />
      )}
    </Box>
  );
};

export default ClientCardDeckView;
