import { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Alert,
  Link as MuiLink,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeIn, fadeInUp } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import { useTheme } from '@mui/material';
import GoogleSignInButton from '@shared/components/GoogleSignInButton';

const ClientSignup = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const glassCardStyles = useGlassCard('subtle');

  const [error, setError] = useState('');

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
              <Box mb={2}>
                <GoogleSignInButton
                  variant="contained"
                  redirectTo="/client/profile"
                  showDivider={false}
                  buttonText="Pokračovat s Google"
                  showSuccessToast={true}
                  onError={(err, errorMsg) => setError(errorMsg)}
                />
              </Box>

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
                onClick={() => navigate('/client')}
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
