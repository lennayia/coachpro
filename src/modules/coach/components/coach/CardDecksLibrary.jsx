import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add as AddIcon, Share as ShareIcon } from '@mui/icons-material';
import { HelpCircle, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import BaseCard from '@shared/components/cards/BaseCard';
import { getCurrentUser } from '../../utils/storage';
import { supabase } from '@shared/config/supabase';
import { staggerContainer, staggerItem } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import { SECTION_PADDING } from '@shared/styles/responsive';
import HelpDialog from '@shared/components/HelpDialog';
import QuickTooltip from '@shared/components/AppTooltip';
import { useNotification } from '@shared/context/NotificationContext';
import ShareCardDeckModal from './ShareCardDeckModal';
import BrowseCardDeckModal from './BrowseCardDeckModal';

// Barvy podle cyklů
const CYKLUS_COLORS = {
  Jaro: { main: '#A8D5BA', dark: '#78BC92' },
  Léto: { main: '#FFB84D', dark: '#F59E1F' },
  Podzim: { main: '#C17B5C', dark: '#A5624B' },
  Zima: { main: '#B3D9E8', dark: '#8AC4D9' },
};

// Metadata pro balíčky
const DECK_META = {
  Jaro: { title: 'Laskavé začátky', subtitle: 'Růst, zrození, začátky' },
  Léto: { title: 'Jemná síla', subtitle: 'Energie, síla, naplnění' },
  Podzim: { title: 'Vědomé bytí', subtitle: 'Sklizeň, reflexe, odpouštění' },
  Zima: { title: 'Klidné vlny', subtitle: 'Klid, introspekce, obnova' },
};

const MOTIV_ICONS = {
  Člověk: '🧍',
  Příroda: '🌿',
  Abstrakt: '🎨',
  Mix: '🎲',
};

const CardDecksLibrary = () => {
  const currentUser = getCurrentUser();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { showSuccess, showError } = useNotification();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [cards, setCards] = useState([]);
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [browseModalOpen, setBrowseModalOpen] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState(null);

  // Načti karty z Supabase
  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('coachpro_cards')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      setCards(data || []);

      // Vytvoř balíčky (4 cykly × 3 motivy = 12 balíčků)
      const generatedDecks = generateDecks(data || []);
      setDecks(generatedDecks);
    } catch (error) {
      console.error('Error loading cards:', error);
      showError('Chyba', 'Nepodařilo se načíst karty');
    } finally {
      setLoading(false);
    }
  };

  // Generuj balíčky ze všech karet
  const generateDecks = (allCards) => {
    const cykly = ['Jaro', 'Léto', 'Podzim', 'Zima'];
    const motivy = ['Člověk', 'Příroda', 'Abstrakt'];
    const decks = [];

    cykly.forEach((cyklus) => {
      motivy.forEach((motiv) => {
        const deckCards = allCards.filter(
          (card) => card.cyklus === cyklus && card.motiv === motiv
        );

        if (deckCards.length > 0) {
          const meta = DECK_META[cyklus];
          decks.push({
            id: `${cyklus}-${motiv}`,
            cyklus,
            motiv,
            title: `${meta.title} - ${motiv}`,
            subtitle: meta.subtitle,
            cards: deckCards,
            cardCount: deckCards.length,
            color: CYKLUS_COLORS[cyklus],
            previewImage: deckCards[0]?.image_path, // První karta jako preview
          });
        }
      });
    });

    return decks;
  };

  const handleShare = (deck) => {
    setSelectedDeck(deck);
    setShareModalOpen(true);
  };

  const handleBrowse = (deck) => {
    setSelectedDeck(deck);
    setBrowseModalOpen(true);
  };

  return (
    <Box sx={{ ...SECTION_PADDING, pb: 10 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              background: isDark
                ? 'linear-gradient(135deg, #8BC98F 0%, #6FB876 100%)'
                : 'linear-gradient(135deg, #417530 0%, #5A9A48 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Koučovací karty
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {decks.length} balíčků • {cards.length} karet celkem
          </Typography>
        </Box>

        {/* Help button */}
        <QuickTooltip title="Nápověda k Koučovacím kartám">
          <IconButton
            onClick={() => setHelpDialogOpen(true)}
            sx={{
              width: 48,
              height: 48,
              backgroundColor: isDark
                ? 'rgba(120, 188, 143, 0.15)'
                : 'rgba(65, 117, 47, 0.15)',
              color: isDark ? 'rgba(120, 188, 143, 0.9)' : 'rgba(65, 117, 47, 0.9)',
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: isDark
                  ? 'rgba(120, 188, 143, 0.25)'
                  : 'rgba(65, 117, 47, 0.25)',
                transform: 'scale(1.05)',
              },
            }}
          >
            <HelpCircle size={24} />
          </IconButton>
        </QuickTooltip>
      </Box>

      {/* Grid balíčků */}
      {loading ? (
        <Typography>Načítám karty...</Typography>
      ) : (
        <Grid container spacing={3} component={motion.div} variants={staggerContainer}>
          {decks.map((deck) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={deck.id}>
              <motion.div variants={staggerItem}>
                <BaseCard
                  // Preview image
                  icon={
                    <Box
                      component="img"
                      src={deck.previewImage || '/images/karty/placeholder.jpg'}
                      alt={deck.title}
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: BORDER_RADIUS.card,
                        mb: 2,
                      }}
                    />
                  }
                  // Title
                  title={
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {MOTIV_ICONS[deck.motiv]} {deck.cyklus}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: deck.color.main,
                          mb: 0.5,
                        }}
                      >
                        {deck.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {deck.subtitle}
                      </Typography>
                    </Box>
                  }
                  // Description
                  description={`${deck.cardCount} karet`}
                  // Footer - tlačítka
                  footer={
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Eye size={18} />}
                        onClick={() => handleBrowse(deck)}
                        sx={{
                          flex: 1,
                          borderColor: deck.color.main,
                          color: deck.color.main,
                          '&:hover': {
                            borderColor: deck.color.dark,
                            backgroundColor: `${deck.color.main}15`,
                          },
                        }}
                      >
                        Procházet
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<ShareIcon />}
                        onClick={() => handleShare(deck)}
                        sx={{
                          flex: 1,
                          backgroundColor: deck.color.main,
                          '&:hover': {
                            backgroundColor: deck.color.dark,
                          },
                        }}
                      >
                        Sdílet
                      </Button>
                    </Box>
                  }
                />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Help Dialog */}
      <HelpDialog
        open={helpDialogOpen}
        onClose={() => setHelpDialogOpen(false)}
        initialPage="cards"
      />

      {/* Share Modal */}
      {selectedDeck && (
        <ShareCardDeckModal
          open={shareModalOpen}
          onClose={() => {
            setShareModalOpen(false);
            setSelectedDeck(null);
          }}
          deck={selectedDeck}
        />
      )}

      {/* Browse Modal */}
      {selectedDeck && (
        <BrowseCardDeckModal
          open={browseModalOpen}
          onClose={() => {
            setBrowseModalOpen(false);
            setSelectedDeck(null);
          }}
          deck={selectedDeck}
        />
      )}
    </Box>
  );
};

export default CardDecksLibrary;
