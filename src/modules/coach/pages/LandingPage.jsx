import { Box, Container, Typography, Button, Grid, Card, CardContent, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  Sparkles,
  UserCheck,
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BORDER_RADIUS from '@styles/borderRadius';
import { fadeIn } from '@shared/styles/animations';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import Footer from '@shared/components/Footer';

/**
 * LandingPage - Public homepage for CoachPro
 *
 * @created 16.11.2025
 * @purpose Google OAuth verification requirement - explain app purpose
 */
const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const glassCardStyles = useGlassCard('subtle');

  const features = [
    {
      icon: <BookOpen size={40} />,
      title: 'Koučovací programy',
      description: 'Vytvářejte a spravujte strukturované programy pro vaše klienty',
    },
    {
      icon: <Calendar size={40} />,
      title: 'Správa sezení',
      description: 'Synchronizace s Google Calendar, přehled nadcházejících sezení',
    },
    {
      icon: <Users size={40} />,
      title: 'Klienti & Koučové',
      description: 'Propojení koučů s klienty, sledování pokroku a zapojení',
    },
    {
      icon: <TrendingUp size={40} />,
      title: 'Gamifikace',
      description: 'Motivační systém "Semínka růstu" pro sledování aktivity',
    },
  ];

  const benefits = [
    'Centralizace všech materiálů a programů na jednom místě',
    'Automatická synchronizace s Google Calendar',
    'Sledování pokroku klientů v reálném čase',
    'Personalizované dashboardy pro kouče i klienty',
    'Sdílení materiálů, pracovních listů a zdrojů',
    'Bezpečné přihlášení přes Google účet',
  ];

  const roles = [
    {
      title: 'Jsem klientka',
      description: 'Přístup ke koučovacím programům',
      icon: Heart,
      color: theme.palette.primary.main,
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
      path: '/client',
    },
    {
      title: 'Jsem koučka-testerka',
      description: 'Beta testování nových funkcí',
      icon: UserCheck,
      color: theme.palette.secondary.main,
      gradient: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
      path: '/tester',
    },
  ];

  const scrollToLogin = () => {
    const loginSection = document.getElementById('login-section');
    if (loginSection) {
      loginSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0a0f0a 0%, #1a2410 100%)'
            : 'linear-gradient(135deg, #f5f5f0 0%, #e8f5e9 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Background with App Screenshot */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {/* Subtle Gradient Base */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? `
                  radial-gradient(at 20% 30%, rgba(139, 188, 143, 0.15) 0%, transparent 60%),
                  radial-gradient(at 80% 70%, rgba(85, 107, 47, 0.15) 0%, transparent 60%)
                `
                : `
                  radial-gradient(at 20% 30%, rgba(139, 188, 143, 0.2) 0%, transparent 60%),
                  radial-gradient(at 80% 70%, rgba(85, 107, 47, 0.2) 0%, transparent 60%)
                `,
          }}
        />

        {/* Dashboard Screenshot - Můžeš přidat cestu k reálnému screenshotu */}
        <Box
          component={motion.div}
          animate={{
            scale: [0.95, 1, 0.95],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '95%',
            maxWidth: '1400px',
            height: '80%',
            borderRadius: BORDER_RADIUS.card,
            // Až budeš mít screenshot, použij:
            // backgroundImage: 'url(/screenshots/dashboard.png)',
            // backgroundSize: 'cover',
            // backgroundPosition: 'center',
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? `
                  linear-gradient(135deg,
                    rgba(143, 188, 143, 0.08) 0%,
                    rgba(85, 107, 47, 0.05) 50%,
                    rgba(143, 188, 143, 0.08) 100%
                  )
                `
                : `
                  linear-gradient(135deg,
                    rgba(143, 188, 143, 0.12) 0%,
                    rgba(85, 107, 47, 0.08) 50%,
                    rgba(143, 188, 143, 0.12) 100%
                  )
                `,
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(139, 188, 143, 0.15)'
                : 'rgba(139, 188, 143, 0.2)',
            filter: 'blur(8px)',
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 30px 80px rgba(0, 0, 0, 0.4)'
                : '0 30px 80px rgba(139, 188, 143, 0.15)',
          }}
        />
      </Box>
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <motion.div variants={fadeIn} initial="hidden" animate="visible">
          <Box textAlign="center" mb={8}>
            {/* Logo and App Name */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <img
                src="/coachPro.png"
                alt="CoachPro"
                style={{
                  width: '80px',
                  height: 'auto',
                  objectFit: 'contain',
                  marginBottom: '16px',
                }}
              />
              <Typography
                variant="h4"
                fontWeight={600}
                color="primary"
                sx={{ mb: 2 }}
              >
                CoachPro
              </Typography>
            </Box>

            <Typography
              variant="h2"
              fontWeight={700}
              gutterBottom
              sx={{
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #8FBC8F, #556B2F)'
                    : 'linear-gradient(135deg, #556B2F, #8FBC8F)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Platforma pro kouče a jejich klienty
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}>
              Zjednodušte správu koučovacích programů, materiálů a sezení na jednom místě
            </Typography>
            <Button
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variant="contained"
              size="large"
              onClick={scrollToLogin}
              startIcon={<Sparkles size={20} />}
              sx={{
                textTransform: 'none',
                fontSize: '1.1rem',
                py: 1.5,
                px: 4,
                borderRadius: BORDER_RADIUS.compact,
                background: 'linear-gradient(135deg, #8FBC8F 0%, #556B2F 100%)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  transition: 'left 0.5s',
                },
                '&:hover::before': {
                  left: '100%',
                },
                '&:hover': {
                  background: 'linear-gradient(135deg, #556B2F 0%, #8FBC8F 100%)',
                  boxShadow: '0 8px 24px rgba(139, 188, 143, 0.4)',
                },
              }}
            >
              Začít zdarma
            </Button>
          </Box>

          {/* Features Grid */}
          <Box mb={8}>
            <Typography variant="h4" fontWeight={600} textAlign="center" mb={4}>
              Klíčové funkce
            </Typography>
            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    component={motion.div}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{
                      scale: 1.05,
                      rotateY: 5,
                    }}
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: BORDER_RADIUS.card,
                      background: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(143, 188, 143, 0.05)'
                          : 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: (theme) =>
                          theme.palette.mode === 'dark'
                            ? '0 12px 32px rgba(139, 188, 143, 0.3)'
                            : '0 12px 32px rgba(85, 107, 47, 0.2)',
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Box
                        component={motion.div}
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        sx={{
                          color: 'primary.main',
                          mb: 2,
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* How It Works */}
          <Box mb={8}>
            <Typography variant="h4" fontWeight={600} textAlign="center" mb={4}>
              Jak to funguje
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card
                  component={motion.div}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  elevation={0}
                  sx={{
                    borderRadius: BORDER_RADIUS.card,
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(143, 188, 143, 0.05)'
                        : 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid',
                    borderColor: 'divider',
                    backdropFilter: 'blur(10px)',
                    p: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: (theme) =>
                        theme.palette.mode === 'dark'
                          ? '0 8px 24px rgba(139, 188, 143, 0.2)'
                          : '0 8px 24px rgba(85, 107, 47, 0.15)',
                    },
                  }}
                >
                  <Typography variant="h5" fontWeight={600} gutterBottom color="primary">
                    Pro kouče
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <li>
                      <Typography variant="body1" paragraph>
                        Vytvářejte koučovací programy a sdílejte je s klienty
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body1" paragraph>
                        Nahrávejte materiály, pracovní listy a zdroje
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body1" paragraph>
                        Synchronizujte Google Calendar pro správu sezení
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body1" paragraph>
                        Sledujte pokrok a zapojení klientů
                      </Typography>
                    </li>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card
                  component={motion.div}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  elevation={0}
                  sx={{
                    borderRadius: BORDER_RADIUS.card,
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(143, 188, 143, 0.05)'
                        : 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid',
                    borderColor: 'divider',
                    backdropFilter: 'blur(10px)',
                    p: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: (theme) =>
                        theme.palette.mode === 'dark'
                          ? '0 8px 24px rgba(139, 188, 143, 0.2)'
                          : '0 8px 24px rgba(85, 107, 47, 0.15)',
                    },
                  }}
                >
                  <Typography variant="h5" fontWeight={600} gutterBottom color="primary">
                    Pro klienty
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <li>
                      <Typography variant="body1" paragraph>
                        Přístup k personalizovanému dashboardu
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body1" paragraph>
                        Sledování vlastních programů a pokroku
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body1" paragraph>
                        Stahování materiálů a pracovních listů
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body1" paragraph>
                        Přehled nadcházejících sezení s koučkami
                      </Typography>
                    </li>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Benefits */}
          <Box mb={8}>
            <Typography variant="h4" fontWeight={600} textAlign="center" mb={4}>
              Proč CoachPro?
            </Typography>
            <Card
              component={motion.div}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              elevation={0}
              sx={{
                borderRadius: BORDER_RADIUS.card,
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(143, 188, 143, 0.08)'
                    : 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                border: '1px solid',
                borderColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(139, 188, 143, 0.2)'
                    : 'rgba(139, 188, 143, 0.3)',
                p: 4,
                boxShadow: (theme) =>
                  theme.palette.mode === 'dark'
                    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                    : '0 8px 32px rgba(139, 188, 143, 0.1)',
              }}
            >
              <Grid container spacing={2}>
                {benefits.map((benefit, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CheckCircle size={20} style={{ color: '#8FBC8F' }} />
                      <Typography variant="body1">{benefit}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Box>

          {/* CTA before Login */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            sx={{
              textAlign: 'center',
              py: 8,
              mb: 6,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120%',
                height: '120%',
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'radial-gradient(circle, rgba(139, 188, 143, 0.15) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(139, 188, 143, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                zIndex: 0,
              },
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <motion.div
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Typography
                  variant="h3"
                  fontWeight={700}
                  gutterBottom
                  sx={{
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #8FBC8F, #556B2F)'
                        : 'linear-gradient(135deg, #556B2F, #8FBC8F)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Připraveni začít?
                </Typography>
              </motion.div>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}
              >
                Přihlaste se pomocí Google účtu a začněte využívat CoachPro ještě dnes
              </Typography>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Typography
                  variant="body1"
                  color="primary"
                  sx={{ fontWeight: 600, fontSize: '1.2rem' }}
                >
                  ↓ Vyberte svoji roli níže ↓
                </Typography>
              </motion.div>
            </Box>
          </Box>

          {/* Login Section - Original Role Selector */}
          <Box id="login-section" mb={8}>
            <Box textAlign="center" mb={4}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Vítejte v CoachProApp
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Vyberte svoji roli pro vstup
              </Typography>
            </Box>

            <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
              {roles.map((role) => (
                <Grid item xs={12} sm={6} key={role.title}>
                  <Card
                    sx={{
                      ...glassCardStyles,
                      borderRadius: BORDER_RADIUS.premium,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow:
                          theme.palette.mode === 'dark'
                            ? `0 12px 40px ${role.color}40`
                            : `0 12px 40px ${role.color}30`,
                      },
                    }}
                    onClick={() => navigate(role.path)}
                  >
                    <Box p={{ xs: 2.5, sm: 3 }} textAlign="center">
                      <Box
                        sx={{
                          width: { xs: 56, sm: 64 },
                          height: { xs: 56, sm: 64 },
                          borderRadius: '50%',
                          background: role.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 16px',
                        }}
                      >
                        <role.icon size={32} color="white" />
                      </Box>

                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {role.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {role.description}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Original Footer */}
          <Box mt={{ xs: 4, sm: 6 }}>
            <Footer />
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LandingPage;
