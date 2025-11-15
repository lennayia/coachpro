import { useEffect } from 'react';
import { Box, Card, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeIn, fadeInUp } from '@shared/styles/animations';
import { useNotification } from '@shared/context/NotificationContext';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import RegisterForm from '@shared/components/RegisterForm';
import Breadcrumbs from '@shared/components/Breadcrumbs';
import { useClientAuth } from '@shared/context/ClientAuthContext';

/**
 * ClientRegister - Registrační stránka pro klientky
 *
 * Features:
 * - Registrace (email/heslo, Google OAuth)
 * - Redirect na login po úspěšné registraci
 */
const ClientRegister = () => {
  const navigate = useNavigate();
  const { showSuccess } = useNotification();
  const glassCardStyles = useGlassCard('subtle');
  const { user, profile, loading: authLoading } = useClientAuth();

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user && profile) {
      navigate('/client/daily');
    }
  }, [authLoading, user, profile, navigate]);

  // Handle successful registration
  const handleRegistrationSuccess = () => {
    showSuccess('Registrace dokončena! 🎉', 'Nyní se můžeš přihlásit');
    navigate('/client/login');
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
        style={{ width: '100%', maxWidth: 450 }}
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
            {/* Breadcrumbs */}
            <Breadcrumbs
              customBreadcrumbs={[
                { label: 'Domů', path: '/' },
                { label: 'Klientský vstup', path: '/client' },
                { label: 'Přihlášení', path: '/client/login' },
                { label: 'Registrace' },
              ]}
            />

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
                    alt="CoachPro"
                    style={{
                      height: '80px',
                      width: 'auto',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </Box>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Registrace
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Vytvořte si svůj účet
                </Typography>
              </Box>
            </motion.div>

            {/* Register Form */}
            <RegisterForm
              userType="client"
              redirectTo="/client/daily"
              onSuccess={handleRegistrationSuccess}
            />
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
};

export default ClientRegister;
