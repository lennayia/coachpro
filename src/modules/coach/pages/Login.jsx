import { useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { School as CoachIcon, Person as ClientIcon } from '@mui/icons-material';
import { fadeIn, fadeInUp } from '../utils/animations';
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
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #065f46 0%, #134e4a 50%, #0f172a 100%)'
            : 'linear-gradient(135deg, #065f46 0%, #134e4a 50%, #10b981 100%)',
        p: 2,
      }}
    >
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
      >
        <Card
          sx={{
            maxWidth: 500,
            width: '100%',
            backdropFilter: 'blur(20px)',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(26, 26, 26, 0.8)'
                : 'rgba(255, 255, 255, 0.9)',
            border: (theme) =>
              `1px solid ${
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(255, 255, 255, 0.3)'
              }`,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
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
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
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
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #8FBC8F 0%, #556B2F 100%)'
                        : 'linear-gradient(135deg, #556B2F 0%, #228B22 100%)',
                    '&:hover': {
                      background: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, #9FCC9F 0%, #667B3F 100%)'
                          : 'linear-gradient(135deg, #667B3F 0%, #32AB32 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(85, 107, 47, 0.4)',
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
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderWidth: 2,
                      borderColor: 'primary.dark',
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(143, 188, 143, 0.1)'
                          : 'rgba(85, 107, 47, 0.05)',
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
