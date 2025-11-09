import React, { useState, useEffect } from 'react';
import { Box, Container, useTheme, CircularProgress, Typography } from '@mui/material';
import DeckSelector from '@shared/components/cards/DeckSelector';
import MotifSelector from '@shared/components/cards/MotifSelector';
import CardGrid from '@shared/components/cards/CardGrid';
import CardFlipView from '@shared/components/cards/CardFlipView';
import { getCardTheme } from '@shared/constants/cardDeckThemes';
import { supabase } from '@shared/config/supabase';

/**
 * CoachingCardsPage - Hlavní stránka pro koučovací karty
 *
 * Řídí celý flow:
 * 1. DeckSelector - Výběr balíčku (A/B/C/D)
 * 2. MotifSelector - Výběr motivu (Člověk/Příroda/Abstrakt/Mix)
 * 3. CardGrid - Grid rozmíchaných karet
 * 4. CardFlipView - Full-screen viewer s flip a poznámkami
 */
const CoachingCardsPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // State pro navigation flow
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [selectedMotif, setSelectedMotif] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  // State pro karty z databáze
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Načíst karty z databáze podle deck + motif
  useEffect(() => {
    if (!selectedDeck || !selectedMotif) {
      setCards([]);
      return;
    }

    const fetchCards = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('coachpro_cards_v2')
          .select('*')
          .eq('deck', selectedDeck)
          .eq('motif', selectedMotif)
          .order('title', { ascending: true });

        if (fetchError) throw fetchError;

        // Transformovat data do formátu pro frontend
        const transformedCards = data.map((card) => ({
          id: card.id,
          title: card.title,
          image: card.image_url,
          description: card.description,
          notes: '', // Poznámky se načtou později (pro konkrétního klienta)
        }));

        setCards(transformedCards);
      } catch (err) {
        console.error('Error fetching cards:', err);
        setError('Nepodařilo se načíst karty. Zkuste to prosím znovu.');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [selectedDeck, selectedMotif]);

  // Background gradient podle zvoleného motivu
  const backgroundStyle = selectedMotif
    ? {
        background: getCardTheme(selectedMotif, isDark).background,
        minHeight: '100vh',
        transition: 'background 0.6s ease-in-out',
      }
    : {
        background: isDark
          ? 'linear-gradient(135deg, #0a0f0a 0%, #1a2410 100%)'
          : 'linear-gradient(135deg, #e8ede5 0%, #d4ddd0 100%)',
        minHeight: '100vh',
        transition: 'background 0.6s ease-in-out',
      };

  // Handlers
  const handleSelectDeck = (deckId) => {
    setSelectedDeck(deckId);
  };

  const handleSelectMotif = (motifId) => {
    setSelectedMotif(motifId);
  };

  const handleBackToDeckSelector = () => {
    setSelectedDeck(null);
    setSelectedMotif(null);
    setSelectedCard(null);
  };

  const handleBackToMotifSelector = () => {
    setSelectedMotif(null);
    setSelectedCard(null);
  };

  const handleSelectCard = (card) => {
    const index = cards.findIndex((c) => c.id === card.id);
    setCurrentCardIndex(index);
    setSelectedCard(card);
  };

  const handleCloseCardViewer = () => {
    setSelectedCard(null);
  };

  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      const nextIndex = currentCardIndex + 1;
      setCurrentCardIndex(nextIndex);
      setSelectedCard(cards[nextIndex]);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      const prevIndex = currentCardIndex - 1;
      setCurrentCardIndex(prevIndex);
      setSelectedCard(cards[prevIndex]);
    }
  };

  const handleUpdateNotes = (cardId, notes) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, notes } : card
      )
    );
  };

  return (
    <Box sx={backgroundStyle}>
      <Container maxWidth="xl" sx={{ py: { xs: 4, sm: 6 } }}>
        {/* Step 1: Deck Selector */}
        {!selectedDeck && (
          <DeckSelector
            onSelectDeck={handleSelectDeck}
            selectedDeck={selectedDeck}
          />
        )}

        {/* Step 2: Motif Selector */}
        {selectedDeck && !selectedMotif && (
          <MotifSelector
            selectedDeck={selectedDeck}
            onSelectMotif={handleSelectMotif}
            onBack={handleBackToDeckSelector}
            selectedMotif={selectedMotif}
          />
        )}

        {/* Step 3: Card Grid */}
        {selectedDeck && selectedMotif && (
          <>
            {loading && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '60vh',
                  gap: 2,
                }}
              >
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ color: getCardTheme(selectedMotif, isDark).text }}>
                  Načítám karty...
                </Typography>
              </Box>
            )}

            {error && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '60vh',
                  gap: 2,
                }}
              >
                <Typography variant="h6" sx={{ color: 'error.main' }}>
                  {error}
                </Typography>
              </Box>
            )}

            {!loading && !error && cards.length > 0 && (
              <CardGrid
                selectedDeck={selectedDeck}
                selectedMotif={selectedMotif}
                cards={cards}
                onSelectCard={handleSelectCard}
                onBack={handleBackToMotifSelector}
              />
            )}

            {!loading && !error && cards.length === 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '60vh',
                  gap: 2,
                }}
              >
                <Typography variant="h6" sx={{ color: getCardTheme(selectedMotif, isDark).text }}>
                  Zatím nejsou dostupné žádné karty pro tento balíček a motiv.
                </Typography>
              </Box>
            )}
          </>
        )}

        {/* Step 4: Card Flip View (Dialog) */}
        <CardFlipView
          open={!!selectedCard}
          card={selectedCard}
          currentIndex={currentCardIndex}
          totalCards={cards.length}
          selectedMotif={selectedMotif}
          onClose={handleCloseCardViewer}
          onNext={handleNextCard}
          onPrev={handlePrevCard}
          onUpdateNotes={handleUpdateNotes}
        />
      </Container>
    </Box>
  );
};

export default CoachingCardsPage;
