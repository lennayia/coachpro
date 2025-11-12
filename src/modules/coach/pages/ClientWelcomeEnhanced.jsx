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
  Grid,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle as CheckIcon,
  Key as KeyIcon,
  Power,
  User as UserIcon,
  ArrowRight,
  Sparkles,
  Volume2,
  VolumeX,
  Home,
  Users,
  BookOpen,
} from 'lucide-react';
import BORDER_RADIUS from '@styles/borderRadius';
import { useNotification } from '@shared/context/NotificationContext';
import { useTheme } from '@mui/material';
import { useClientAuth } from '@shared/context/ClientAuthContext';
import ClientAuthGuard from '@shared/components/ClientAuthGuard';
import FlipCard from '@shared/components/cards/FlipCard';
import AnimatedGradient from '@shared/components/effects/AnimatedGradient';
import useSoundFeedback from '@shared/hooks/useSoundFeedback';
import { fadeIn, fadeInUp, staggerContainer, staggerItem, glow } from '@shared/styles/animations';
import { getVocative } from '@shared/utils/czechGrammar';
import { getUserPhotoUrl } from '@shared/utils/avatarHelper';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import {
  getProgramByCode,
  getSharedMaterialByCode,
  getCardDeckByCode,
} from '../utils/storage';
import { isValidShareCode } from '../utils/generateCode';

/**
 * ClientWelcomeEnhanced - Enhanced welcome page with FlipCards, animations, and sound
 *
 * ✨ PROOF OF CONCEPT - Vylepšená verze s:
 * - 3D FlipCard action cards (kliknutím se otáčí a ukazují více info)
 * - AnimatedGradient pozadí
 * - Sound feedback system
 * - Glow effects na avatar
 * - Smooth animations everywhere
 *
 * @created 12.11.2025 - Enhanced version for demo
 */
const ClientWelcomeEnhanced = () => {
  const navigate = useNavigate();
  const { showError } = useNotification();
  const theme = useTheme();
  const { profile, user, logout } = useClientAuth();
  const glassCardStyles = useGlassCard('subtle');

  // Sound feedback
  const { playClick, playFlip, playSuccess, playHover, enabled, setEnabled } = useSoundFeedback({
    volume: 0.3,
    enabled: true,
  });

  // Get correct photo URL
  const photoUrl = getUserPhotoUrl(profile, user);

  // Code entry state
  const [code, setCode] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [detectedType, setDetectedType] = useState(null);

  const handleLogout = async () => {
    playClick();
    await logout();
    navigate('/');
  };

  // Auto-detect code type
  useEffect(() => {
    const detectType = async () => {
      if (code.length !== 6 || !isValidShareCode(code)) {
        setPreviewData(null);
        setDetectedType(null);
        return;
      }

      try {
        const program = await getProgramByCode(code);
        if (program) {
          setPreviewData({ title: program.title, coachName: program.coachName });
          setDetectedType('program');
          playSuccess();
          return;
        }

        const material = await getSharedMaterialByCode(code);
        if (material) {
          setPreviewData({ title: material.title, type: 'Materiál' });
          setDetectedType('material');
          playSuccess();
          return;
        }

        const cardDeck = await getCardDeckByCode(code);
        if (cardDeck) {
          setPreviewData({ title: cardDeck.deck_name || 'Koučovací karty', type: 'Karty' });
          setDetectedType('card-deck');
          playSuccess();
          return;
        }

        setPreviewData(null);
        setDetectedType(null);
      } catch (err) {
        // Silent fail
      }
    };

    const debounce = setTimeout(detectType, 300);
    return () => clearTimeout(debounce);
  }, [code, playSuccess]);

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
    playClick();

    try {
      if (detectedType === 'program') {
        navigate('/client/daily');
        return;
      }

      if (detectedType === 'material') {
        navigate(`/client/material/${code}`);
        return;
      }

      if (detectedType === 'card-deck') {
        navigate(`/client/card-deck/${code}`);
        return;
      }

      throw new Error('Nepodařilo se určit typ obsahu');
    } catch (err) {
      showError('Chyba', 'Nepodařilo se zpracovat kód. Zkuste to prosím znovu.');
    } finally {
      setCodeLoading(false);
    }
  };

  // Helper function to create softer gradients for large cards
  const createSoftGradient = (color1, color2, angle = 135) => {
    // Convert hex to rgba with opacity for softer look on large surfaces
    const hexToRgba = (hex, opacity) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    return `linear-gradient(${angle}deg, ${hexToRgba(color1, 0.35)} 0%, ${hexToRgba(color2, 0.25)} 100%)`;
  };

  // FlipCard action cards definitions - softer gradients for large card surfaces
  const flipActionCards = [
    {
      title: 'Vstup do klientské zóny',
      subtitle: 'Pokračujte ve svém programu',
      icon: <Home size={32} />,
      onClick: () => {
        playClick();
        navigate('/client/dashboard');
      },
      gradient: createSoftGradient(theme.palette.primary.main, theme.palette.secondary.main, 135),
      backTitle: 'Klientská zóna',
      backDescription: 'Zde najdete všechny vaše programy, materiály a průběh vašeho koučování.',
      backFeatures: ['Váš pokrok', 'Materiály', 'Denní úkoly'],
    },
    {
      title: 'Vyberte si koučku',
      subtitle: 'Najděte tu pravou',
      icon: <Users size={32} />,
      onClick: () => {
        playClick();
        navigate('/client/select-coach');
      },
      gradient: createSoftGradient(theme.palette.secondary.light, theme.palette.primary.dark, 120),
      backTitle: 'Naše kouče',
      backDescription: 'Prozkoumejte profily našich certifikovaných koučů a vyberte si toho pravého.',
      backFeatures: ['Profily koučů', 'Hodnocení', 'Dostupnost'],
    },
    {
      title: 'O koučinku',
      subtitle: 'Zjistěte více',
      icon: <BookOpen size={32} />,
      onClick: () => {
        playClick();
        navigate('/coach-types-guide');
      },
      gradient: createSoftGradient(theme.palette.primary.light, theme.palette.secondary.dark, 150),
      backTitle: 'Koučinkový průvodce',
      backDescription: 'Naučte se více o různých typech koučování a metodách osobního rozvoje.',
      backFeatures: ['Metodiky', 'Vzdělání', 'Tipy'],
    },
  ];

  return (
    <ClientAuthGuard requireProfile={true}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          p: 2,
        }}
      >
        {/* Animated Background */}
        <AnimatedGradient
          colors={[
            theme.palette.mode === 'dark' ? '#0a0f0a' : '#e8ede5',
            theme.palette.mode === 'dark' ? '#1a2410' : '#d4ddd0',
            theme.palette.mode === 'dark' ? '#0f140a' : '#e0e8dd',
          ]}
          animation="wave"
          duration={8}
          opacity={1}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
          }}
        />

        {/* Noise texture overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Main content */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          style={{ width: '100%', maxWidth: 900, position: 'relative', zIndex: 2 }}
        >
          <Card
            elevation={0}
            sx={{
              ...glassCardStyles,
              width: '100%',
              borderRadius: '32px',
              overflow: 'visible',
            }}
          >
            <Box p={4} position="relative">
              {/* Top bar - Logout + Sound toggle */}
              <Box display="flex" justifyContent="space-between" mb={2}>
                <IconButton
                  onClick={handleLogout}
                  onMouseEnter={playHover}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'error.main',
                      backgroundColor: 'rgba(211, 47, 47, 0.08)',
                    },
                  }}
                >
                  <Power size={20} />
                </IconButton>

                <IconButton
                  onClick={() => {
                    setEnabled(!enabled);
                    playClick();
                  }}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'rgba(139, 188, 143, 0.08)',
                    },
                  }}
                >
                  {enabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </IconButton>
              </Box>

              {/* Welcome Header with glowing avatar */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
              >
                <Box textAlign="center" mb={4} mt={2}>
                  <motion.div animate={glow}>
                    <Box
                      component="img"
                      src={photoUrl}
                      onClick={() => {
                        playClick();
                        navigate('/client/profile');
                      }}
                      sx={{
                        width: 90,
                        height: 90,
                        borderRadius: '50%',
                        margin: '0 auto',
                        mb: 2.5,
                        border: '3px solid',
                        borderColor: 'primary.main',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        objectFit: 'cover',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </motion.div>

                  <Typography variant="h4" fontWeight={600} gutterBottom sx={{ mb: 1.5 }}>
                    <Sparkles size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                    Vítejte zpátky, {getVocative(profile?.displayName || '')}!
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Těšíme se, že tu jste a že jste připravená pokračovat ve své cestě k osobnímu
                    růstu.
                  </Typography>
                </Box>
              </motion.div>

              {/* Code Entry Section */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                <Card
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: BORDER_RADIUS.card,
                    background:
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(139, 188, 143, 0.08) 0%, rgba(85, 107, 47, 0.05) 100%)'
                        : 'linear-gradient(135deg, rgba(139, 188, 143, 0.12) 0%, rgba(85, 107, 47, 0.08) 100%)',
                    border: '1px solid',
                    borderColor:
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
                        backgroundColor:
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
                    Zadejte 6-místný kód a získejte okamžitý přístup k vašemu programu, materiálu
                    nebo kartám.
                  </Typography>

                  <TextField
                    fullWidth
                    label="Zadejte kód"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase().slice(0, 6));
                      playClick();
                    }}
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
                    onMouseEnter={playHover}
                    disabled={code.length !== 6 || !detectedType || codeLoading}
                    sx={{
                      py: 1.5,
                      borderRadius: BORDER_RADIUS.compact,
                    }}
                  >
                    {codeLoading ? <CircularProgress size={24} /> : 'Vstoupit do programu'}
                  </Button>
                </Card>
              </motion.div>

              {/* FlipCard Action Cards */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                style={{ marginTop: 16 }}
              >
                <Grid container spacing={3}>
                  {flipActionCards.map((card, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <motion.div variants={staggerItem}>
                        <FlipCard
                          minHeight={240}
                          gradient={card.gradient}
                          onFlip={(isFlipped) => {
                            if (isFlipped) {
                              playFlip();
                            }
                          }}
                          frontContent={
                            <Box
                              p={3}
                              display="flex"
                              flexDirection="column"
                              justifyContent="center"
                              alignItems="center"
                              textAlign="center"
                              height="100%"
                            >
                              <Box
                                sx={{
                                  width: 60,
                                  height: 60,
                                  borderRadius: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  bgcolor: 'rgba(255, 255, 255, 0.4)',
                                  color: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.7)',
                                  mb: 2,
                                }}
                              >
                                {card.icon}
                              </Box>
                              <Typography
                                variant="h6"
                                fontWeight={600}
                                gutterBottom
                                sx={{
                                  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.85)'
                                }}
                              >
                                {card.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.7)'
                                }}
                              >
                                {card.subtitle}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  mt: 2,
                                  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
                                }}
                              >
                                Klikni pro více info ↻
                              </Typography>
                            </Box>
                          }
                          backContent={
                            <Box
                              p={3}
                              display="flex"
                              flexDirection="column"
                              justifyContent="space-between"
                              height="100%"
                            >
                              <Box>
                                <Typography
                                  variant="h6"
                                  fontWeight={600}
                                  gutterBottom
                                  sx={{
                                    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.85)'
                                  }}
                                >
                                  {card.backTitle}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  mb={2}
                                  sx={{
                                    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.7)'
                                  }}
                                >
                                  {card.backDescription}
                                </Typography>
                                <Box>
                                  {card.backFeatures.map((feature, idx) => (
                                    <Typography
                                      key={idx}
                                      variant="body2"
                                      display="block"
                                      sx={{
                                        mb: 0.5,
                                        ml: 1,
                                        color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.65)'
                                      }}
                                    >
                                      • {feature}
                                    </Typography>
                                  ))}
                                </Box>
                              </Box>
                              <Button
                                variant="contained"
                                fullWidth
                                onClick={card.onClick}
                                onMouseEnter={playHover}
                                endIcon={<ArrowRight size={18} />}
                                sx={{
                                  mt: 2,
                                }}
                              >
                                Přejít
                              </Button>
                            </Box>
                          }
                        />
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </Box>
          </Card>
        </motion.div>
      </Box>
    </ClientAuthGuard>
  );
};

export default ClientWelcomeEnhanced;
