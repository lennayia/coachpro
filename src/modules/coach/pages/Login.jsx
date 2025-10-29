import { useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { School as CoachIcon, Person as ClientIcon } from '@mui/icons-material';
import { fadeIn, fadeInUp } from '@shared/styles/animations';
import { setCurrentUser, initializeDemoData } from '../utils/storage';

const Login = () => {
  const navigate = useNavigate();

  // Inicializuj demo data pokud neexistují
  useEffect(() => {
    initializeDemoData();
  }, []);

  const handleCoachLogin = () => {
    // Vytvoř demo koučku
    const coach = {
      id: 'demo-coach-1',
      name: 'Demo Koučka',
      email: 'demo@coachpro.cz',
      avatar: null,
      branding: {
        primaryColor: '#556B2F',
        logo: null
      },
      createdAt: new Date().toISOString()
    };

    setCurrentUser({
      ...coach,
      role: 'coach'
    });

    navigate('/coach/dashboard');
  };

  const handleClientLogin = () => {
    navigate('/client/entry');
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
      >
        <Card
          elevation={0}
          sx={{
            maxWidth: 500,
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '32px',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(26, 26, 26, 0.6)'
                : 'rgba(255, 255, 255, 0.7)',
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(255, 255, 255, 0.6)',
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 20px 60px 0 rgba(0, 0, 0, 0.5)'
                : '0 20px 60px 0 rgba(85, 107, 47, 0.12)',
          }}
        >
          <CardContent sx={{ p: 5 }}>
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
                      // Fallback pokud logo neexistuje
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <Typography
                    variant="h3"
                    sx={{
                      display: 'none', // Zobrazí se jen pokud logo neexistuje
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
                <Typography variant="body1" color="text.secondary">
                  Aplikace pro koučky a jejich klientky
                </Typography>
              </Box>
            </motion.div>

            {/* Buttons */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<CoachIcon />}
                  onClick={handleCoachLogin}
                  sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    background: (theme) =>
                      `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    '&:hover': {
                      background: (theme) =>
                        `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                      transform: 'translateY(-2px)',
                      boxShadow: (theme) =>
                        theme.palette.mode === 'dark'
                          ? '0 12px 32px rgba(143, 188, 143, 0.3)'
                          : '0 12px 32px rgba(85, 107, 47, 0.3)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  Jsem koučka
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ClientIcon />}
                  onClick={handleClientLogin}
                  sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderWidth: 2,
                    borderColor: 'secondary.main',
                    color: 'secondary.main',
                    '&:hover': {
                      borderWidth: 2,
                      borderColor: 'secondary.dark',
                      backgroundColor: 'secondary.main',
                      color: 'white',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  Jsem klientka
                </Button>
              </Stack>
            </motion.div>

            {/* Footer text */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center"
                display="block"
                mt={4}
              >
                Vyber svou roli pro pokračování
              </Typography>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Login;
