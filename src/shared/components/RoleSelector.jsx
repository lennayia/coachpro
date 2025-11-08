import { Box, Card, Typography, Container, Grid, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, UserCheck, Heart, Shield } from 'lucide-react';
import { fadeIn, fadeInUp } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import { useTheme } from '@mui/material';

/**
 * Role Selector - For multi-role users
 *
 * Shows available roles based on user's profiles:
 * - Admin (is_admin in coachpro_coaches)
 * - Klient (coachpro_client_profiles)
 * - Tester (testers)
 * - Kouč (coachpro_coaches, not admin)
 */
const RoleSelector = ({ availableRoles = [], user }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const glassCardStyles = useGlassCard('subtle');

  const roleConfig = {
    admin: {
      title: 'Admin',
      description: 'Správa systému a testerů',
      icon: Shield,
      color: '#DC143C',
      gradient: 'linear-gradient(135deg, #DC143C 0%, #8B0000 100%)',
      path: '/coach/dashboard',
    },
    client: {
      title: 'Klientka',
      description: 'Koučovací programy',
      icon: Heart,
      color: theme.palette.primary.main,
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
      path: '/client/welcome',
    },
    tester: {
      title: 'Testerka',
      description: 'Beta testování',
      icon: UserCheck,
      color: theme.palette.secondary.main,
      gradient: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
      path: '/coach/dashboard',
    },
    coach: {
      title: 'Koučka',
      description: 'Správa programů',
      icon: User,
      color: '#8FBC8F',
      gradient: 'linear-gradient(135deg, #8FBC8F 0%, #556B2F 100%)',
      path: '/coach/dashboard',
    },
  };

  const roles = availableRoles.map(roleKey => roleConfig[roleKey]).filter(Boolean);

  // Extract first name from user metadata
  const getFirstName = () => {
    const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || '';
    return fullName.split(' ')[0] || 'Vítejte';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
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
      }}
    >
      <Container maxWidth="md">
        <Box>
          {/* Header */}
          <Box textAlign="center" mb={6}>
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
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Ahoj, {getFirstName()}! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Vyberte roli pro dnešní práci
            </Typography>
          </Box>

          {/* Role Cards */}
          <Grid container spacing={3}>
            {roles.map((role, index) => (
              <Grid item xs={12} sm={6} md={roles.length === 2 ? 6 : 4} key={role.title}>
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
                    <Box p={3} textAlign="center">
                      {/* Icon */}
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
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

                      {/* Title */}
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {role.title}
                      </Typography>

                      {/* Description */}
                      <Typography variant="body2" color="text.secondary">
                        {role.description}
                      </Typography>
                    </Box>
                  </Card>
              </Grid>
            ))}
          </Grid>

          {/* Logout Link */}
          <Box textAlign="center" mt={4}>
            <Button
              onClick={() => {
                // Clear session and redirect to landing
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = '/';
              }}
              sx={{
                color: 'text.secondary',
                fontSize: '0.875rem',
                textTransform: 'none',
                '&:hover': {
                  background: 'transparent',
                  color: 'error.main',
                },
              }}
            >
              Odhlásit se
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default RoleSelector;
