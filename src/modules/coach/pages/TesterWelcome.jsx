import { Box, Card, Typography, Button, IconButton, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Power, Key as KeyIcon, LogIn as LogInIcon, User as UserIcon } from 'lucide-react';
import { fadeIn } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import { useTheme } from '@mui/material';
import { useTesterAuth } from '@shared/context/TesterAuthContext';
import TesterAuthGuard from '@shared/components/TesterAuthGuard';
import { getVocative } from '@shared/utils/czechGrammar';

const TesterWelcome = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const glassCardStyles = useGlassCard('subtle');
  const { profile, logout } = useTesterAuth();

  return (
    <TesterAuthGuard requireProfile={true}>
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
          style={{ width: '100%', maxWidth: 600 }}
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
              {/* Logout button - top left */}
              <IconButton
                onClick={async () => {
                  await logout();
                  navigate('/');
                }}
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'error.main',
                    backgroundColor: 'rgba(211, 47, 47, 0.08)',
                  },
                }}
              >
                <Power size={20} />
              </IconButton>

              {/* Header - User Icon */}
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mb={4}
                mt={2}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background:
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(143, 188, 143, 0.3) 0%, rgba(85, 107, 47, 0.2) 100%)'
                        : 'linear-gradient(135deg, rgba(143, 188, 143, 0.6) 0%, rgba(85, 107, 47, 0.4) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  <UserIcon size={40} />
                </Box>

                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    textAlign: 'center',
                    background:
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #8FBC8F 0%, #78BC8F 100%)'
                        : 'linear-gradient(135deg, #556B2F 0%, #41752F 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Vítej zpátky, {getVocative(profile?.displayName || '')}!
                </Typography>

                <Typography variant="body1" color="text.secondary" textAlign="center">
                  Beta tester CoachPro
                </Typography>
              </Box>

              {/* Access Code Display */}
              {profile?.access_code && (
                <Alert
                  severity="info"
                  icon={<KeyIcon size={20} />}
                  sx={{
                    mb: 3,
                    borderRadius: BORDER_RADIUS.compact,
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(143, 188, 143, 0.1)'
                        : 'rgba(143, 188, 143, 0.15)',
                  }}
                >
                  <Typography variant="body2" gutterBottom>
                    Tvůj access kód:
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: 'monospace',
                      letterSpacing: '2px',
                      fontWeight: 700,
                      color: theme.palette.mode === 'dark' ? '#8FBC8F' : '#556B2F',
                    }}
                  >
                    {profile.access_code}
                  </Typography>
                </Alert>
              )}

              {/* Action Button */}
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<LogInIcon size={20} />}
                onClick={() => navigate('/coach/dashboard')}
                sx={{
                  borderRadius: BORDER_RADIUS.compact,
                  py: 1.5,
                  background:
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(143, 188, 143, 0.3) 0%, rgba(85, 107, 47, 0.25) 100%)'
                      : 'linear-gradient(135deg, rgba(143, 188, 143, 0.8) 0%, rgba(85, 107, 47, 0.7) 100%)',
                  '&:hover': {
                    background:
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(143, 188, 143, 0.4) 0%, rgba(85, 107, 47, 0.35) 100%)'
                        : 'linear-gradient(135deg, rgba(143, 188, 143, 0.9) 0%, rgba(85, 107, 47, 0.8) 100%)',
                  },
                }}
              >
                Vstoupit do aplikace
              </Button>

              {/* Edit Profile Link */}
              <Box textAlign="center" mt={2}>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => navigate('/tester/profile')}
                  sx={{ textTransform: 'none' }}
                >
                  Upravit profil
                </Button>
              </Box>
            </Box>
          </Card>
        </motion.div>
      </Box>
    </TesterAuthGuard>
  );
};

export default TesterWelcome;
