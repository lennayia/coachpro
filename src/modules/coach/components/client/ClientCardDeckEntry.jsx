import { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Key as KeyIcon, CheckCircle as CheckIcon } from '@mui/icons-material';
import { fadeIn, fadeInUp } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import { isValidShareCode } from '../../utils/generateCode';
import { useNotification } from '@shared/context/NotificationContext';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import { useTheme } from '@mui/material';
import { supabase } from '@shared/config/supabase';

const ClientCardDeckEntry = () => {
  const navigate = useNavigate();
  const { showError } = useNotification();
  const theme = useTheme();
  const glassCardStyles = useGlassCard('subtle');

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewDeck, setPreviewDeck] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);

  // Lookup deck po zadání kódu (debounce)
  const handleCodeChange = async (newCode) => {
    setCode(newCode.toUpperCase());
    setError('');
    setPreviewDeck(null);

    if (newCode.length === 6 && isValidShareCode(newCode)) {
      setLookupLoading(true);

      try {
        // Najdi shared deck
        const { data: sharedDeck, error: sharedError } = await supabase
          .from('coachpro_shared_card_decks')
          .select('*, coachpro_card_decks(*)')
          .eq('share_code', newCode.toUpperCase())
          .single();

        if (sharedError || !sharedDeck) {
          setError('Neplatný kód. Zkontroluj, jestli je zadán správně.');
          return;
        }

        // Kontrola access dates
        const now = new Date();
        const startDate = sharedDeck.access_start_date ? new Date(sharedDeck.access_start_date) : null;
        const endDate = sharedDeck.access_end_date ? new Date(sharedDeck.access_end_date) : null;

        if (startDate && now < startDate) {
          setError(`Tento balíček bude dostupný od ${startDate.toLocaleDateString('cs-CZ')}`);
          return;
        }

        if (endDate && now > endDate) {
          setError(`Přístup k tomuto balíčku vypršel ${endDate.toLocaleDateString('cs-CZ')}`);
          return;
        }

        // Načti karty z balíčku
        const cardIds = sharedDeck.coachpro_card_decks.card_ids;

        const { data: cards, error: cardsError } = await supabase
          .from('coachpro_cards')
          .select('*')
          .in('id', cardIds);

        if (cardsError) throw cardsError;

        // Ukaž preview
        setPreviewDeck({
          ...sharedDeck,
          deck: sharedDeck.coachpro_card_decks,
          cards: cards || [],
        });
      } catch (err) {
        console.error('Error fetching deck:', err);
        setError('Nepodařilo se načíst balíček. Zkus to prosím znovu.');
      } finally {
        setLookupLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!code || code.length !== 6) {
      showError('Chyba', 'Zadej 6místný kód');
      return;
    }

    setLoading(true);

    try {
      // Ulož do sessionStorage pro zobrazení
      sessionStorage.setItem('currentCardDeck', JSON.stringify(previewDeck));

      // Přesměruj na zobrazení balíčku
      navigate(`/client/card-deck/${code}`);
    } catch (err) {
      console.error('Error accessing deck:', err);
      showError('Chyba', 'Nepodařilo se otevřít balíček. Zkus to prosím znovu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
          : 'linear-gradient(135deg, #f5f7fa 0%, #e8f0f7 100%)',
      }}
    >
      <Card
        component={motion.div}
        variants={fadeIn}
        initial="initial"
        animate="animate"
        sx={{
          ...glassCardStyles,
          maxWidth: 500,
          width: '100%',
          p: 4,
          borderRadius: BORDER_RADIUS.card,
        }}
      >
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <img
            src="/logo.png"
            alt="CoachPro"
            style={{
              height: 60,
              marginBottom: 16,
              filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'none',
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 1,
              background:
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #8BC98F 0%, #6FB876 100%)'
                  : 'linear-gradient(135deg, #417530 0%, #5A9A48 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Koučovací karty
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Zadej kód od koučky pro přístup k balíčku karet
          </Typography>
        </Box>

        {/* Vstup kódu */}
        <Box sx={{ mb: 3 }}>
          <TextField
            label="6místný kód"
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            fullWidth
            autoFocus
            inputProps={{
              maxLength: 6,
              style: { textTransform: 'uppercase', letterSpacing: 4 },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <KeyIcon />
                </InputAdornment>
              ),
              endAdornment: lookupLoading && (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ),
            }}
            disabled={loading}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: BORDER_RADIUS.compact }}>
              {error}
            </Alert>
          )}
        </Box>

        {/* Preview balíčku */}
        {previewDeck && (
          <motion.div variants={fadeInUp} initial="initial" animate="animate">
            <Box
              sx={{
                p: 3,
                mb: 3,
                background:
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(139, 188, 143, 0.1) 0%, rgba(111, 184, 118, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(65, 117, 47, 0.1) 0%, rgba(90, 154, 72, 0.1) 100%)',
                borderRadius: BORDER_RADIUS.card,
                border: `1px solid ${
                  theme.palette.mode === 'dark'
                    ? 'rgba(139, 188, 143, 0.3)'
                    : 'rgba(65, 117, 47, 0.3)'
                }`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {previewDeck.deck.title}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {previewDeck.deck.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                📚 {previewDeck.cards.length} karet • Pro {previewDeck.client_name}
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Tlačítko Pokračovat */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleSubmit}
          disabled={!previewDeck || loading}
          sx={{
            py: 1.5,
            borderRadius: BORDER_RADIUS.compact,
            background:
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #8BC98F 0%, #6FB876 100%)'
                : 'linear-gradient(135deg, #417530 0%, #5A9A48 100%)',
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          {loading ? <CircularProgress size={24} /> : 'Otevřít balíček'}
        </Button>

        {/* Nápověda */}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
          Kód najdeš v e-mailu nebo zprávě od koučky
        </Typography>
      </Card>
    </Box>
  );
};

export default ClientCardDeckEntry;
