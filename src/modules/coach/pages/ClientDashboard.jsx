import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, HelpCircle, Calendar, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeIn, fadeInUp } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import { useTheme } from '@mui/material';
import { useClientAuth } from '@shared/context/ClientAuthContext';
import ClientAuthGuard from '@shared/components/ClientAuthGuard';
import { getVocative } from '@shared/utils/czechGrammar';
import SessionCard from '@shared/components/SessionCard';
import { getNextSession } from '@shared/utils/sessions';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { profile } = useClientAuth();
  const [nextSession, setNextSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // Load next session
  useEffect(() => {
    const loadNextSession = async () => {
      if (!profile?.id) return;

      setLoadingSession(true);
      try {
        const session = await getNextSession(profile.id);
        setNextSession(session);
      } catch (err) {
        console.error('Error loading next session:', err);
      } finally {
        setLoadingSession(false);
      }
    };

    loadNextSession();
  }, [profile?.id]);

  return (
    <ClientAuthGuard requireProfile={true}>
    <Box
      sx={{
        minHeight: '100vh',
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
        p: 3,
        pr: 15, // Space for FloatingMenu
      }}
    >
      <motion.div variants={fadeIn} initial="hidden" animate="visible">
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Vítejte, {getVocative(profile?.displayName || '')}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tohle je Vaše osobní koučovací zóna
          </Typography>
        </Box>

        {/* Next Session Widget */}
        {loadingSession ? (
          <Box display="flex" justifyContent="center" py={4} mb={4}>
            <CircularProgress />
          </Box>
        ) : nextSession ? (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <Box mb={4}>
              <Typography variant="h5" fontWeight={600} mb={2}>
                Příští sezení
              </Typography>
              <SessionCard
                session={nextSession}
                viewMode="client"
                onClick={() => navigate('/client/sessions')}
                showCountdown={true}
              />
            </Box>
          </motion.div>
        ) : (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <Alert severity="info" sx={{ mb: 4, borderRadius: BORDER_RADIUS.compact }}>
              Nemáte naplánované žádné sezení. Vaše koučka vám brzy naplánuje první schůzku.
            </Alert>
          </motion.div>
        )}

        {/* Dashboard Cards */}
        <Grid container spacing={3}>
          {/* Card 1: Můj profil */}
          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: BORDER_RADIUS.card,
                  border: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '0 8px 24px rgba(139, 188, 143, 0.15)'
                        : '0 8px 24px rgba(85, 107, 47, 0.15)',
                  },
                }}
                onClick={() => navigate('/client/profile')}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(139, 188, 143, 0.15)'
                          : 'rgba(85, 107, 47, 0.1)',
                      mb: 2,
                    }}
                  >
                    <UserIcon size={28} color={theme.palette.primary.main} />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Můj profil
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upravte svoje osobní údaje a nastavení
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Card 2: Moje programy */}
          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: BORDER_RADIUS.card,
                  border: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '0 8px 24px rgba(139, 188, 143, 0.15)'
                        : '0 8px 24px rgba(85, 107, 47, 0.15)',
                  },
                }}
                onClick={() => navigate('/client/daily')}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(139, 188, 143, 0.15)'
                          : 'rgba(85, 107, 47, 0.1)',
                      mb: 2,
                    }}
                  >
                    <Calendar size={28} color={theme.palette.primary.main} />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Moje programy
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Přístup k vašim koučovacím programům
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Card 3: Materiály */}
          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: BORDER_RADIUS.card,
                  border: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '0 8px 24px rgba(139, 188, 143, 0.15)'
                        : '0 8px 24px rgba(85, 107, 47, 0.15)',
                  },
                }}
                onClick={() => navigate('/client/materials')}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(139, 188, 143, 0.15)'
                          : 'rgba(85, 107, 47, 0.1)',
                      mb: 2,
                    }}
                  >
                    <FileText size={28} color={theme.palette.primary.main} />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Materiály
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Prohlížejte sdílené materiály od koučky
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Card 4: Nápověda */}
          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: BORDER_RADIUS.card,
                  border: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '0 8px 24px rgba(139, 188, 143, 0.15)'
                        : '0 8px 24px rgba(85, 107, 47, 0.15)',
                  },
                }}
                onClick={() => navigate('/client/help')}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(139, 188, 143, 0.15)'
                          : 'rgba(85, 107, 47, 0.1)',
                      mb: 2,
                    }}
                  >
                    <HelpCircle size={28} color={theme.palette.primary.main} />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Nápověda
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Kontakt na koučku a časté otázky
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
    </ClientAuthGuard>
  );
};

export default ClientDashboard;
