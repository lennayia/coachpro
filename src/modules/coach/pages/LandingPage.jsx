import { Box, Card, Typography, Container, Grid, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Heart } from 'lucide-react';
import BORDER_RADIUS from '@styles/borderRadius';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import Footer from '@shared/components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const glassCardStyles = useGlassCard('subtle');

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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
        py: { xs: 4, sm: 6 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="md">
        <Box>
          <Box textAlign="center" mb={{ xs: 3, sm: 4 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: { xs: 1, sm: 1.5 },
              }}
            >
              <img
                src="/coachPro.png"
                alt="CoachPro"
                style={{
                  width: '100%',
                  maxWidth: '70px',
                  height: 'auto',
                  objectFit: 'contain',
                }}
              />
            </Box>
            <Typography
              variant="h6"
              fontWeight={600}
              gutterBottom
              sx={{
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
            >
              Vítejte v CoachProApp
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.8rem', sm: '0.875rem' }
              }}
            >
              Vyberte svoji roli pro vstup
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
            {roles.map((role, index) => (
              <Grid item xs={12} sm={6} key={role.title}>
                <Card
                    sx={{
                      ...glassCardStyles,
                      borderRadius: BORDER_RADIUS.premium,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: theme.palette.mode === 'dark'
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

          <Box mt={{ xs: 4, sm: 6 }}>
            <Footer />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
