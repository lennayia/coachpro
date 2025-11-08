import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle as CheckIcon } from '@mui/icons-material';
import { ArrowLeft } from 'lucide-react';
import { fadeIn, fadeInUp } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import {
  getProgramByCode,
  getSharedMaterialByCode,
  getCardDeckByCode,
  getClientByProgramCode,
  saveClient,
  setCurrentClient,
} from '../utils/storage';
import { generateUUID, isValidShareCode } from '../utils/generateCode';
import { useNotification } from '@shared/context/NotificationContext';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import { useTheme } from '@mui/material';
import GoogleSignInButton from '@shared/components/GoogleSignInButton';
import { useClientAuth } from '@shared/context/ClientAuthContext';

const Client = () => {
  const navigate = useNavigate();
  const { showError } = useNotification();
  const theme = useTheme();
  const glassCardStyles = useGlassCard('subtle');
  const { user, profile, loading: authLoading } = useClientAuth();

  const [code, setCode] = useState('');
  const [clientName, setClientName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewData, setPreviewData] = useState(null);
  const [detectedType, setDetectedType] = useState(null); // 'program', 'material', 'card-deck'

  // Auto-redirect if already authenticated with profile
  useEffect(() => {
    if (!authLoading && user && profile) {
      navigate('/client/welcome');
    }
  }, [authLoading, user, profile, navigate]);

  const handleCodeChange = (e) => {
    const value = e.target.value.toUpperCase().slice(0, 6);
    setCode(value);
    setError('');
  };

  // Auto-detect type when 6-digit code is entered
  useEffect(() => {
    const detectType = async () => {
      if (code.length !== 6 || !isValidShareCode(code)) {
        setPreviewData(null);
        setDetectedType(null);
        return;
      }

      try {
        // Try program first
        const program = await getProgramByCode(code);
        if (program) {
          setPreviewData({ title: program.title, coachName: program.coachName });
          setDetectedType('program');
          setShowNameInput(true);
          return;
        }

        // Try material
        const material = await getSharedMaterialByCode(code);
        if (material) {
          setPreviewData({ title: material.title, type: 'Materiál' });
          setDetectedType('material');
          setShowNameInput(false);
          return;
        }

        // Try card deck
        const cardDeck = await getCardDeckByCode(code);
        if (cardDeck) {
          setPreviewData({ title: cardDeck.deck_name || 'Koučovací karty', type: 'Karty' });
          setDetectedType('card-deck');
          setShowNameInput(false);
          return;
        }

        // Not found
        setError('Kód nebyl nalezen. Zkontrolujte prosím správnost kódu.');
        setPreviewData(null);
        setDetectedType(null);
      } catch (err) {
        console.error('Code detection error:', err);
      }
    };

    const debounce = setTimeout(detectType, 300);
    return () => clearTimeout(debounce);
  }, [code]);

  const handleCodeSubmit = async () => {
    if (code.length !== 6) {
      setError('Kód musí obsahovat přesně 6 znaků');
      return;
    }

    if (!isValidShareCode(code)) {
      setError('Neplatný formát kódu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Program entry
      if (detectedType === 'program') {
        const program = await getProgramByCode(code);
        if (!program) {
          throw new Error('Program nebyl nalezen');
        }

        // Check if client already exists
        let client = await getClientByProgramCode(code);

        if (!client) {
          // Create new client
          client = {
            id: generateUUID(),
            name: clientName || 'Klientka',
            programCodes: [code],
            programIds: [program.id],
            coachId: program.coachId,
            createdAt: new Date().toISOString(),
            auth_user_id: user?.id || null, // Link to OAuth user if logged in
          };
          await saveClient(client);
        } else if (user && !client.auth_user_id) {
          // Link existing client to OAuth user
          client.auth_user_id = user.id;
          await saveClient(client);
        }

        setCurrentClient(client);
        navigate('/client/daily');
        return;
      }

      // Material entry
      if (detectedType === 'material') {
        navigate(`/client/material/${code}`);
        return;
      }

      // Card deck entry
      if (detectedType === 'card-deck') {
        navigate(`/client/card-deck/${code}`);
        return;
      }

      throw new Error('Nepodařilo se určit typ obsahu');
    } catch (err) {
      console.error('Code submit error:', err);
      setError(err.message || 'Nastala chyba při zpracování kódu');
      showError('Chyba', 'Nepodařilo se zpracovat kód. Zkuste to prosím znovu.');
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
        position: 'relative',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? `
              radial-gradient(circle at 20% 20%, rgba(143, 188, 143, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(85, 107, 47, 0.15) 0%, transparent 50%),
              linear-gradient(135deg, #0a0f0a 0%, #1a2410 100%)
            `
            : `
              radial-gradient(circle at 20% 20%, rgba(143, 188, 143, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(85, 107, 47, 0.3) 0%, transparent 50%),
              linear-gradient(135deg, #e8ede5 0%, #d4ddd0 100%)
            `,
        p: 2,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
        },
      }}
    >
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        style={{ width: '100%', maxWidth: 500 }}
      >
        <Card
          elevation={0}
          sx={{
            ...glassCardStyles,
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '32px',
          }}
        >
          <Box p={4}>
            {/* Back Button */}
            <Box mb={2}>
              <IconButton
                onClick={() => navigate('/')}
                sx={{
                  '&:hover': {
                    background: 'rgba(85, 107, 47, 0.1)',
                  },
                }}
              >
                <ArrowLeft size={20} />
              </IconButton>
            </Box>

            {/* Logo */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              <Box textAlign="center" mb={4}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <img
                    src="/coachPro.png"
                    alt="CoachProApp"
                    style={{
                      height: '80px',
                      width: 'auto',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <Typography
                    variant="h3"
                    sx={{
                      display: 'none',
                      fontWeight: 700,
                      background: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, #8FBC8F 0%, #556B2F 100%)'
                          : 'linear-gradient(135deg, #556B2F 0%, #228B22 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    CoachPro
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Vítejte v CoachProApp
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Přihlaste se nebo zadejte kód ke svému programu
                </Typography>
              </Box>
            </motion.div>

            {/* Error */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Google Sign In */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <GoogleSignInButton
                variant="contained"
                redirectTo="/?intent=client"
                showDivider={false}
                buttonText="Pokračovat s Google"
                showSuccessToast={false}
                onError={(err, errorMsg) => setError(errorMsg)}
              />
            </motion.div>

            {/* Divider */}
            <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
              <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
              <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
                nebo
              </Typography>
              <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
            </Box>

            {/* Code Entry */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 1 }}>
                Máte kód od své koučky?
              </Typography>

              <TextField
                fullWidth
                label="Zadejte kód"
                value={code}
                onChange={handleCodeChange}
                InputProps={{
                  endAdornment: previewData ? (
                    <InputAdornment position="end">
                      <CheckIcon color="success" />
                    </InputAdornment>
                  ) : null,
                }}
                placeholder="ABC123"
                margin="normal"
                disabled={loading}
                helperText="6-místný kód vám otevře program, materiál nebo karty"
              />

              {/* Preview */}
              {previewData && (
                <Alert
                  severity="success"
                  icon={<CheckIcon />}
                  sx={{
                    mt: 2,
                    mb: 1,
                    borderRadius: BORDER_RADIUS.compact,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {previewData.title}
                  </Typography>
                  {previewData.coachName && (
                    <Typography variant="caption" sx={{ fontWeight: 500, color: 'primary.main' }}>
                      Od kouče: {previewData.coachName}
                    </Typography>
                  )}
                  {previewData.type && (
                    <Typography variant="caption" color="text.secondary">
                      Typ: {previewData.type}
                    </Typography>
                  )}
                </Alert>
              )}

              {/* Name input for programs */}
              {showNameInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <TextField
                    fullWidth
                    label="Vaše jméno (volitelné)"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    margin="normal"
                    disabled={loading}
                    helperText="Pomůže nám to personalizovat Váš zážitek"
                  />
                </motion.div>
              )}

              <Button
                variant="contained"
                size="large"
                onClick={handleCodeSubmit}
                disabled={code.length !== 6 || !detectedType || loading}
                sx={{
                  mt: 3,
                  px: { xs: 3, sm: 4 },
                  py: 1.5,
                  minWidth: 'fit-content',
                  alignSelf: 'flex-start',
                }}
              >
                {loading ? <CircularProgress size={24} /> : detectedType === 'program' ? 'Vstoupit do programu' : 'Vstoupit'}
              </Button>
            </motion.div>
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Client;
