import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, ArrowLeft, CheckCircle as CheckIcon, Key as KeyIcon, Users as UsersIcon, BookOpen as BookOpenIcon, LogIn as LogInIcon } from 'lucide-react';
import { fadeIn, fadeInUp } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import { useNotification } from '@shared/context/NotificationContext';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import { useTheme } from '@mui/material';
import { useClientAuth } from '@shared/context/ClientAuthContext';
import ClientAuthGuard from '@shared/components/ClientAuthGuard';
import { getVocative } from '@shared/utils/czechGrammar';
import {
  getProgramByCode,
  getMaterialByCode,
  getCardDeckByCode,
} from '../utils/storage';
import { isValidShareCode } from '../utils/generateCode';

const ClientWelcome = () => {
  const navigate = useNavigate();
  const { showError } = useNotification();
  const theme = useTheme();
  const glassCardStyles = useGlassCard('subtle');
  const { profile, logout } = useClientAuth();

  // Code entry state
  const [code, setCode] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [detectedType, setDetectedType] = useState(null);

  // Auto-detect code type
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
          return;
        }

        // Try material
        const material = await getMaterialByCode(code);
        if (material) {
          setPreviewData({ title: material.title, type: 'Materiál' });
          setDetectedType('material');
          return;
        }

        // Try card deck
        const cardDeck = await getCardDeckByCode(code);
        if (cardDeck) {
          setPreviewData({ title: cardDeck.deck_name || 'Koučovací karty', type: 'Karty' });
          setDetectedType('card-deck');
          return;
        }

        // Not found
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
      showError('Neplatný kód', 'Kód musí obsahovat přesně 6 znaků');
      return;
    }

    if (!isValidShareCode(code)) {
      showError('Neplatný kód', 'Neplatný formát kódu');
      return;
    }

    setCodeLoading(true);

    try {
      // Program entry
      if (detectedType === 'program') {
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
      showError('Chyba', 'Nepodařilo se zpracovat kód. Zkuste to prosím znovu.');
    } finally {
      setCodeLoading(false);
    }
  };

  return (
    <ClientAuthGuard requireProfile={true}>
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
        style={{ width: '100%', maxWidth: 800 }}
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
          <Box p={4} position="relative">
            {/* Back arrow - top left (logout) */}
            <IconButton
              onClick={async () => {
                await logout();
                navigate('/client');
              }}
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'rgba(139, 188, 143, 0.08)',
                },
              }}
            >
              <ArrowLeft size={20} />
            </IconButton>

            {/* Welcome Header */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              <Box textAlign="center" mb={5} mt={4}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 90,
                    height: 90,
                    borderRadius: '50%',
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(139, 188, 143, 0.2) 0%, rgba(85, 107, 47, 0.15) 100%)'
                        : 'linear-gradient(135deg, rgba(139, 188, 143, 0.2) 0%, rgba(85, 107, 47, 0.1) 100%)',
                    border: '2px solid',
                    borderColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(139, 188, 143, 0.3)'
                        : 'rgba(85, 107, 47, 0.2)',
                    mb: 2.5,
                  }}
                >
                  <UserIcon size={44} color={theme.palette.primary.main} />
                </Box>
                <Typography variant="h4" fontWeight={600} gutterBottom sx={{ mb: 1.5 }}>
                  Vítejte zpátky, {getVocative(profile?.displayName || '')}!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
                  Těšíme se, že tu jste.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Připraveni pokračovat ve své cestě k osobnímu růstu?
                </Typography>
              </Box>
            </motion.div>

            {/* Action Cards */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <Grid container spacing={2.5}>
                {/* Card 1: Zadejte kód */}
                <Grid item xs={12}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: BORDER_RADIUS.card,
                      background: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, rgba(139, 188, 143, 0.08) 0%, rgba(85, 107, 47, 0.05) 100%)'
                          : 'linear-gradient(135deg, rgba(139, 188, 143, 0.12) 0%, rgba(85, 107, 47, 0.08) 100%)',
                      border: '1px solid',
                      borderColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(139, 188, 143, 0.15)'
                          : 'rgba(85, 107, 47, 0.2)',
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(139, 188, 143, 0.2)'
                              : 'rgba(85, 107, 47, 0.15)',
                        }}
                      >
                        <KeyIcon size={20} color={theme.palette.primary.main} />
                      </Box>
                      <Typography variant="h6" fontWeight={600}>
                        Máte kód od své koučky?
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" mb={2}>
                      Zadejte 6-místný kód a získejte okamžitý přístup k vašemu programu, materiálu nebo kartám.
                    </Typography>

                    <TextField
                      fullWidth
                      label="Zadejte kód"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
                      InputProps={{
                        endAdornment: previewData ? (
                          <InputAdornment position="end">
                            <CheckIcon size={20} color={theme.palette.success.main} />
                          </InputAdornment>
                        ) : null,
                        sx: { borderRadius: BORDER_RADIUS.compact },
                      }}
                      placeholder="ABC123"
                      disabled={codeLoading}
                      helperText="Kód vám otevře program, materiál nebo karty"
                      sx={{ mb: 2 }}
                    />

                    {previewData && (
                      <Alert
                        severity="success"
                        icon={<CheckIcon size={20} />}
                        sx={{
                          mb: 2,
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

                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      onClick={handleCodeSubmit}
                      disabled={code.length !== 6 || !detectedType || codeLoading}
                      sx={{
                        py: 1.5,
                        borderRadius: BORDER_RADIUS.compact,
                      }}
                    >
                      {codeLoading ? <CircularProgress size={24} /> : 'Vstoupit do programu'}
                    </Button>
                  </Card>
                </Grid>

                {/* Card 2: Vstup do klientské zóny */}
                <Grid item xs={12} sm={6}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 3,
                      height: '100%',
                      borderRadius: BORDER_RADIUS.card,
                      border: '1px solid',
                      borderColor: 'divider',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-4px)',
                        boxShadow: (theme) =>
                          theme.palette.mode === 'dark'
                            ? '0 8px 24px rgba(139, 188, 143, 0.15)'
                            : '0 8px 24px rgba(85, 107, 47, 0.15)',
                      },
                    }}
                    onClick={() => navigate('/client/dashboard')}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(139, 188, 143, 0.15)'
                            : 'rgba(85, 107, 47, 0.1)',
                        mb: 2,
                      }}
                    >
                      <LogInIcon size={24} color={theme.palette.primary.main} />
                    </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Vstup do klientské zóny
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pokračujte ve svém programu a prohlížejte materiály
                    </Typography>
                  </Card>
                </Grid>

                {/* Card 3: Vyberte si koučku */}
                <Grid item xs={12} sm={6}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 3,
                      height: '100%',
                      borderRadius: BORDER_RADIUS.card,
                      border: '1px solid',
                      borderColor: 'divider',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-4px)',
                        boxShadow: (theme) =>
                          theme.palette.mode === 'dark'
                            ? '0 8px 24px rgba(139, 188, 143, 0.15)'
                            : '0 8px 24px rgba(85, 107, 47, 0.15)',
                      },
                    }}
                    onClick={() => navigate('/coaches')}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(139, 188, 143, 0.15)'
                            : 'rgba(85, 107, 47, 0.1)',
                        mb: 2,
                      }}
                    >
                      <UsersIcon size={24} color={theme.palette.primary.main} />
                    </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Vyberte si koučku
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Prozkoumejte naše kouče a vyberte si toho pravého pro vaši cestu
                    </Typography>
                  </Card>
                </Grid>

                {/* Card 4: O koučinku */}
                <Grid item xs={12} sm={6}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: BORDER_RADIUS.card,
                      border: '1px solid',
                      borderColor: 'divider',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-4px)',
                        boxShadow: (theme) =>
                          theme.palette.mode === 'dark'
                            ? '0 8px 24px rgba(139, 188, 143, 0.15)'
                            : '0 8px 24px rgba(85, 107, 47, 0.15)',
                      },
                    }}
                    onClick={() => navigate('/coach-types-guide')}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(139, 188, 143, 0.15)'
                            : 'rgba(85, 107, 47, 0.1)',
                        mb: 2,
                      }}
                    >
                      <BookOpenIcon size={24} color={theme.palette.primary.main} />
                    </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      O koučinku
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Zjistěte více o různých typech koučinku a metodách
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </motion.div>
          </Box>
        </Card>
      </motion.div>
    </Box>
    </ClientAuthGuard>
  );
};

export default ClientWelcome;
