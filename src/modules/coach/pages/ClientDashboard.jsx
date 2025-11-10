import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeIn, fadeInUp, staggerContainer, staggerItem } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import { useTheme } from '@mui/material';
import { useClientAuth } from '@shared/context/ClientAuthContext';
import ClientAuthGuard from '@shared/components/ClientAuthGuard';
import { getVocative } from '@shared/utils/czechGrammar';
import SessionCard from '@shared/components/SessionCard';
import { getNextSession } from '@shared/utils/sessions';
import { getCoachById } from '@shared/utils/coaches';
import CoachCard from '@shared/components/CoachCard';
import { DASHBOARD_ICONS, STATS_ICONS } from '@shared/constants/icons';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { profile } = useClientAuth();
  const [nextSession, setNextSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [coachInfo, setCoachInfo] = useState(null);
  const [loadingCoach, setLoadingCoach] = useState(true);

  // Destructure icons from centralized config
  const SessionsIcon = STATS_ICONS.sessions;
  const MaterialsIcon = STATS_ICONS.materials;
  const ProgramsIcon = STATS_ICONS.programs;
  const CardsIcon = DASHBOARD_ICONS.cards;
  const ProfileIcon = DASHBOARD_ICONS.profile;

  // Load next session
  useEffect(() => {
    const loadNextSession = async () => {
      if (!profile?.id) return;

      setLoadingSession(true);
      try {
        const session = await getNextSession(profile.id);
        setNextSession(session);
      } finally {
        setLoadingSession(false);
      }
    };

    loadNextSession();
  }, [profile?.id]);

  // Load coach info
  useEffect(() => {
    const loadCoach = async () => {
      if (!profile?.coach_id) {
        setLoadingCoach(false);
        return;
      }

      setLoadingCoach(true);
      try {
        const coach = await getCoachById(profile.coach_id);
        setCoachInfo(coach);
      } catch (error) {
        // Error handled by UI - shows "Nemáte přiřazenou koučku" alert
      } finally {
        setLoadingCoach(false);
      }
    };

    loadCoach();
  }, [profile?.coach_id]);

  return (
    <ClientAuthGuard requireProfile={true}>
    <Box>
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

        {/* Stats karty */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3} mb={4}>
            {/* Stat 1: Dokončená sezení */}
            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={staggerItem}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: (theme) => theme.shadows[4],
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: BORDER_RADIUS.compact,
                          backgroundColor: 'rgba(85, 107, 47, 0.1)',
                          color: '#556B2F',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <SessionsIcon size={40} />
                      </Box>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {profile?.sessions_completed || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Dokončených sezení
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Stat 2: Příští sezení */}
            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={staggerItem}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: (theme) => theme.shadows[4],
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: BORDER_RADIUS.compact,
                          backgroundColor: 'rgba(34, 139, 34, 0.1)',
                          color: '#228B22',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <SessionsIcon size={40} />
                      </Box>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {nextSession ? '1' : '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Naplánované sezení
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Stat 3: Materiály */}
            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={staggerItem}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: (theme) => theme.shadows[4],
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: BORDER_RADIUS.compact,
                          backgroundColor: 'rgba(143, 188, 143, 0.1)',
                          color: '#8FBC8F',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <MaterialsIcon size={40} />
                      </Box>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                      0
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sdílené materiály
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Stat 4: Programy */}
            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={staggerItem}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: (theme) => theme.shadows[4],
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: BORDER_RADIUS.compact,
                          backgroundColor: 'rgba(107, 142, 35, 0.1)',
                          color: '#6B8E23',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ProgramsIcon size={40} />
                      </Box>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                      0
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Aktivní programy
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>

        {/* Alerts - Coach & Session Info */}
        <Grid container spacing={2} mb={3}>
          {/* Coach Info Alert */}
          {loadingCoach ? (
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" py={2}>
                <CircularProgress size={32} />
              </Box>
            </Grid>
          ) : !coachInfo ? (
            <Grid item xs={12} md={6}>
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.05 }}
              >
                <Alert severity="warning" sx={{ borderRadius: BORDER_RADIUS.compact }}>
                  <Typography variant="body2" fontWeight={600}>
                    Nemáte přiřazenou koučku
                  </Typography>
                </Alert>
              </motion.div>
            </Grid>
          ) : null}

          {/* Session Info Alert */}
          {loadingSession ? (
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" py={2}>
                <CircularProgress size={32} />
              </Box>
            </Grid>
          ) : !nextSession ? (
            <Grid item xs={12} md={coachInfo ? 12 : 6}>
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
              >
                <Alert severity="info" sx={{ borderRadius: BORDER_RADIUS.compact }}>
                  <Typography variant="body2">
                    Nemáte naplánované žádné sezení. Vaše koučka vám brzy naplánuje první schůzku.
                  </Typography>
                </Alert>
              </motion.div>
            </Grid>
          ) : null}
        </Grid>

        {/* Coach Info Widget - only if coach exists */}
        {coachInfo && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.05 }}
          >
            <Box mb={4}>
              <Typography variant="h5" fontWeight={600} mb={2}>
                Vaše koučka
              </Typography>
              <CoachCard coach={coachInfo} compact={false} />
            </Box>
          </motion.div>
        )}

        {/* Next Session Widget - only if session exists */}
        {nextSession && (
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
        )}

        {/* Dashboard Cards - odpovídají menu položkám */}
        <Grid container spacing={3}>
          {/* Card 1: Moje sezení (odpovídá Calendar v menu) */}
          <Grid item xs={12} sm={6} md={3}>
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
                onClick={() => navigate('/client/sessions')}
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
                    <SessionsIcon size={28} style={{ color: theme.palette.primary.main }} />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Moje sezení
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Přehled všech vašich sezení s koučkou
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Card 2: Materiály (odpovídá FileText v menu) */}
          <Grid item xs={12} sm={6} md={3}>
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
                    <MaterialsIcon size={28} style={{ color: theme.palette.primary.main }} />
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

          {/* Card 3: Koučovací karty (odpovídá Layers v menu) */}
          <Grid item xs={12} sm={6} md={3}>
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
                onClick={() => navigate('/client/cards')}
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
                    <CardsIcon size={28} style={{ color: theme.palette.primary.main }} />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Koučovací karty
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Přístup ke koučovacím kartám
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Card 4: Můj profil */}
          <Grid item xs={12} sm={6} md={3}>
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
                    <ProfileIcon size={28} style={{ color: theme.palette.primary.main }} />
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
        </Grid>
      </motion.div>
    </Box>
    </ClientAuthGuard>
  );
};

export default ClientDashboard;
