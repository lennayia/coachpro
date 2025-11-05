import { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Link as MuiLink,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Google as GoogleIcon } from '@mui/icons-material';
import { fadeIn, fadeInUp } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import { useNotification } from '@shared/context/NotificationContext';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import { useTheme } from '@mui/material';
import { supabase } from '@shared/config/supabase';

const ClientSignup = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();
  const theme = useTheme();
  const glassCardStyles = useGlassCard('subtle');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/client/profile`,
        },
      });

      if (error) throw error;

      showSuccess('Přesměrování', 'Přesměrovávám vás na Google přihlášení...');
    } catch (err) {
      console.error('Google sign-in error:', err);
      const errorMsg = 'Nepodařilo se přihlásit přes Google. Zkuste to prosím znovu.';
      setError(errorMsg);
      showError('Chyba přihlášení', errorMsg);
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
                    CoachPro 🌿
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Vítejte v CoachPro!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Registrujte se pro přístup ke svému koučovacímu programu
                </Typography>
              </Box>
            </motion.div>

            {/* Error */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Google Sign In Button */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleGoogleSignIn}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <GoogleIcon />}
                sx={{
                  py: 1.5,
                  mb: 2,
                  backgroundColor: '#4285F4',
                  color: '#ffffff',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  borderRadius: BORDER_RADIUS.compact,
                  '&:hover': {
                    backgroundColor: '#357ae8',
                    boxShadow: '0 8px 24px rgba(66, 133, 244, 0.4)',
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(66, 133, 244, 0.6)',
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              >
                {loading ? 'Přihlašuji...' : 'Pokračovat s Google'}
              </Button>

              <Alert severity="info" sx={{ mb: 3, borderRadius: BORDER_RADIUS.compact }}>
                Po přihlášení budete moci vyplnit svůj profil a získat přístup k programům.
              </Alert>
            </motion.div>

            {/* Divider */}
            <Divider sx={{ my: 3 }}>
              <Typography variant="caption" color="text.secondary">
                NEBO
              </Typography>
            </Divider>

            {/* Fallback - Code-based entry */}
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Máte již kód od své koučky?
              </Typography>
              <MuiLink
                onClick={() => navigate('/client/entry')}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Vstup přes kód →
              </MuiLink>
            </Box>

            {/* Privacy Info */}
            <Box mt={3}>
              <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center"
                display="block"
              >
                Registrací souhlasíte s{' '}
                <MuiLink
                  href="/privacy-policy"
                  target="_blank"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  zpracováním osobních údajů
                </MuiLink>
                .
              </Typography>
            </Box>
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
};

export default ClientSignup;
