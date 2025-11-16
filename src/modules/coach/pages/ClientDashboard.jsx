import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Alert, Chip, LinearProgress } from '@mui/material';
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
import { getCoachById, getClientCoaches } from '@shared/utils/coaches';
import CoachCard from '@shared/components/CoachCard';
import { DASHBOARD_ICONS, STATS_ICONS } from '@shared/constants/icons';
import { getClientStats } from '@shared/utils/clientStats';
import { getClientOpenItems } from '@shared/utils/clientOpenItems';
import { setCurrentClient, saveClient } from '../utils/storage';
import { Sprout, TrendingUp, BookOpen, Heart, Sparkles, Compass, Calendar, FileText, FolderOpen } from 'lucide-react';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { profile } = useClientAuth();
  const [nextSession, setNextSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [coaches, setCoaches] = useState([]);
  const [loadingCoaches, setLoadingCoaches] = useState(true);
  const [stats, setStats] = useState({
    materialsCount: 0,
    programsCount: 0,
    scheduledSessionsCount: 0,
    completedSessionsCount: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [openItems, setOpenItems] = useState({
    openPrograms: [],
    recentMaterials: [],
    upcomingSessions: [],
  });
  const [loadingOpenItems, setLoadingOpenItems] = useState(true);

  // Calculate activity level based on stats
  const getActivityLevel = () => {
    const totalSeeds = stats.materialsCount * 5 + stats.completedSessionsCount * 10;
    const hasActivePrograms = stats.programsCount > 0;

    // High activity: 30+ seeds or 3+ completed sessions
    if (totalSeeds >= 30 || stats.completedSessionsCount >= 3) {
      return {
        level: 'high',
        icon: Heart,
        color: '#E91E63',
        title: 'Vedete si skvěle, jen tak dál!',
        iconBg: 'rgba(233, 30, 99, 0.1)',
      };
    }

    // Medium activity: some engagement (10+ seeds or active programs)
    if (totalSeeds >= 10 || hasActivePrograms) {
      return {
        level: 'medium',
        icon: Sparkles,
        color: '#FF9800',
        title: 'Dobrá práce, jste na dobré cestě',
        iconBg: 'rgba(255, 152, 0, 0.1)',
      };
    }

    // Low activity: just starting or inactive
    return {
      level: 'low',
      icon: Compass,
      color: '#2196F3',
      title: 'Vaše cesta začíná - objevte, co pro vás máme',
      iconBg: 'rgba(33, 150, 243, 0.1)',
    };
  };

  const activityLevel = getActivityLevel();

  // Destructure icons from centralized config
  const SessionsIcon = STATS_ICONS.sessions;
  const MaterialsIcon = STATS_ICONS.materials;
  const ProgramsIcon = STATS_ICONS.programs;
  const CardsIcon = DASHBOARD_ICONS.cards;
  const ProfileIcon = DASHBOARD_ICONS.profile;
  const HelpIcon = DASHBOARD_ICONS.help;

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

  // Load all coaches working with this client
  useEffect(() => {
    const loadCoaches = async () => {
      if (!profile?.id) {
        setLoadingCoaches(false);
        return;
      }

      setLoadingCoaches(true);
      try {
        const clientCoaches = await getClientCoaches(profile.id);
        setCoaches(clientCoaches);
      } catch (error) {
        console.error('Error loading coaches:', error);
      } finally {
        setLoadingCoaches(false);
      }
    };

    loadCoaches();
  }, [profile?.id]);

  // Load client statistics
  useEffect(() => {
    const loadStats = async () => {
      if (!profile?.id && !profile?.email) {
        setLoadingStats(false);
        return;
      }

      setLoadingStats(true);
      try {
        const clientStats = await getClientStats(profile.id, profile.email);
        setStats(clientStats);
      } catch (error) {
        console.error('Error loading client stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, [profile?.id, profile?.email]);

  // Load open items (programs, materials, sessions)
  useEffect(() => {
    const loadOpenItems = async () => {
      if (!profile?.id && !profile?.email) {
        setLoadingOpenItems(false);
        return;
      }

      setLoadingOpenItems(true);
      try {
        const items = await getClientOpenItems(profile.id, profile.email);
        setOpenItems(items);
      } catch (error) {
        console.error('Error loading open items:', error);
      } finally {
        setLoadingOpenItems(false);
      }
    };

    loadOpenItems();
  }, [profile?.id, profile?.email]);

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

        {/* Otevřené položky - Na čem právě pracujete */}
        {!loadingOpenItems && (
          openItems.openPrograms.length > 0 ||
          openItems.recentMaterials.length > 0 ||
          openItems.upcomingSessions.length > 0
        ) && (
          <Box mb={4}>
            <Typography variant="h5" fontWeight={600} mb={2}>
              Na čem právě pracujete
            </Typography>
            <Grid container spacing={2}>
              {/* Otevřené programy */}
              {openItems.openPrograms.map((program, index) => (
                <Grid item xs={12} sm={6} md={4} key={`program-${index}`}>
                  <motion.div
                    variants={staggerItem}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      onClick={async () => {
                        try {
                          console.log('🎯 Program clicked:', program.shareCode);
                          console.log('📦 Program data available:', program.program ? 'YES' : 'NO');
                          console.log('📦 Full program object:', program);

                          const clientData = {
                            id: profile.id,
                            name: profile.displayName || profile.name || profile.email,
                            programCode: program.shareCode,
                            programId: program.programId,
                            coachId: program.coachId,
                            currentDay: program.currentDay || 1,
                            completedDays: program.completedDays || [],
                            moodChecks: program.moodChecks || [],
                            streak: program.streak || 0,
                            longestStreak: program.longestStreak || 0,
                            startedAt: program.startedAt || new Date().toISOString(),
                            completedAt: program.completedAt || null,
                            certificateGenerated: program.certificateGenerated || false,
                            auth_user_id: profile.authUserId,
                            _previewProgram: program.program, // Embed program data to avoid DB lookup
                          };

                          console.log('📦 _previewProgram:', clientData._previewProgram ? 'SET' : 'NULL');

                          console.log('📦 Client data prepared:', clientData);

                          // Save to sessionStorage
                          setCurrentClient(clientData);
                          console.log('✅ Saved to sessionStorage');

                          // Save to Supabase (create record if it doesn't exist)
                          console.log('💾 Saving to Supabase...');
                          await saveClient(clientData);
                          console.log('✅ Saved to Supabase, navigating to daily view...');

                          navigate('/client/daily');
                        } catch (error) {
                          console.error('❌ Error opening program:', error);
                          alert('Chyba při otevírání programu: ' + error.message);
                        }
                      }}
                      sx={{
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease-in-out',
                        border: '2px solid',
                        borderColor: 'primary.main',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: (theme) => theme.shadows[8],
                        },
                      }}
                    >
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: BORDER_RADIUS.compact,
                              backgroundColor: 'rgba(107, 142, 35, 0.1)',
                              color: '#6B8E23',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2,
                            }}
                          >
                            <FolderOpen size={24} />
                          </Box>
                          <Box flex={1}>
                            <Typography variant="subtitle2" fontWeight={600} noWrap>
                              {program.program?.name || 'Program'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Den {program.currentDay || 1} z {program.program?.duration || '?'}
                            </Typography>
                          </Box>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={
                            program.program?.duration
                              ? Math.round(
                                  ((program.completedDays?.length || 0) / program.program.duration) * 100
                                )
                              : 0
                          }
                          sx={{
                            height: 6,
                            borderRadius: BORDER_RADIUS.compact,
                            backgroundColor: 'rgba(107, 142, 35, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#6B8E23',
                            },
                          }}
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}

              {/* Nadcházející sezení */}
              {openItems.upcomingSessions.map((session, index) => (
                <Grid item xs={12} sm={6} md={4} key={`session-${index}`}>
                  <motion.div
                    variants={staggerItem}
                    initial="hidden"
                    animate="visible"
                    transition={{
                      delay: (openItems.openPrograms.length + index) * 0.1,
                    }}
                  >
                    <Card
                      onClick={() => navigate('/client/sessions')}
                      sx={{
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease-in-out',
                        border: '2px solid',
                        borderColor: 'rgba(34, 139, 34, 0.5)',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: (theme) => theme.shadows[8],
                        },
                      }}
                    >
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: BORDER_RADIUS.compact,
                              backgroundColor: 'rgba(34, 139, 34, 0.1)',
                              color: '#228B22',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2,
                            }}
                          >
                            <Calendar size={24} />
                          </Box>
                          <Box flex={1}>
                            <Typography variant="subtitle2" fontWeight={600} noWrap>
                              Sezení
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {session.session_date
                                ? new Date(session.session_date).toLocaleDateString('cs-CZ', {
                                    day: 'numeric',
                                    month: 'long',
                                  })
                                : 'Naplánováno'}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          label="Nadcházející"
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(34, 139, 34, 0.2)',
                            color: '#228B22',
                            fontSize: '0.7rem',
                          }}
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Stats karty */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 3,
            color: (theme) => theme.palette.text.primary,
          }}
        >
          Máte aktivní
        </Typography>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3} mb={4}>
            {/* Stat 1: Materiály */}
            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={staggerItem}>
                <Card
                  onClick={() => navigate('/client/materials')}
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
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
                      {loadingStats ? '...' : stats.materialsCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sdílené materiály
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Stat 2: Programy */}
            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={staggerItem}>
                <Card
                  onClick={() => navigate('/client/programs')}
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
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
                      {loadingStats ? '...' : stats.programsCount}
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
          {loadingCoaches ? (
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" py={2}>
                <CircularProgress size={32} />
              </Box>
            </Grid>
          ) : coaches.length === 0 ? (
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
            <Grid item xs={12} md={coaches.length > 0 ? 12 : 6}>
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

        {/* Coaches Info Widget - show all coaches working with this client */}
        {coaches.length > 0 && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.05 }}
          >
            <Box mb={4}>
              <Typography variant="h5" fontWeight={600} mb={2}>
                {coaches.length === 1 ? 'Vaše koučka' : 'Vaše koučky'}
              </Typography>
              <Grid container spacing={2}>
                {coaches.map((coach, index) => (
                  <Grid item xs={12} md={coaches.length === 1 ? 12 : 6} key={coach.id}>
                    <motion.div
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.05 + index * 0.05 }}
                    >
                      <Box
                        onClick={() => {
                          // Create slug from coach name
                          const slug = coach.name
                            .toLowerCase()
                            .normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
                            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with -
                            .replace(/^-+|-+$/g, ''); // Remove leading/trailing -

                          navigate(`/client/coach/${slug}`, { state: { coachId: coach.id } });
                        }}
                        sx={{
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                          },
                        }}
                      >
                        <CoachCard coach={coach} compact={false} />
                      </Box>
                      {/* Show what services this coach provides */}
                      <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {coach.activities?.hasSessions && (
                          <Chip
                            label="Sezení"
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(85, 107, 47, 0.1)',
                              color: 'primary.main',
                              fontSize: '0.75rem'
                            }}
                          />
                        )}
                        {coach.activities?.hasMaterials && (
                          <Chip
                            label="Materiály"
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(139, 188, 143, 0.1)',
                              color: 'primary.main',
                              fontSize: '0.75rem'
                            }}
                          />
                        )}
                        {coach.activities?.hasPrograms && (
                          <Chip
                            label="Programy"
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(107, 142, 35, 0.1)',
                              color: 'primary.main',
                              fontSize: '0.75rem'
                            }}
                          />
                        )}
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
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

        {/* Motivační sekce - dynamický název */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" gap={1.5} mb={2}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: activityLevel.iconBg,
              }}
            >
              <activityLevel.icon size={20} style={{ color: activityLevel.color }} />
            </Box>
            <Typography variant="h5" fontWeight={600} sx={{ color: activityLevel.color }}>
              {activityLevel.title}
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {/* Semínka růstu */}
            <Grid item xs={12} md={4}>
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
                    border: '2px solid',
                    borderColor: 'success.main',
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 188, 143, 0.05) 100%)'
                        : 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(139, 188, 143, 0.1) 100%)',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: '50%',
                          backgroundColor: 'success.main',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                        }}
                      >
                        <Sprout size={24} />
                      </Box>
                      <Box>
                        <Typography variant="h4" fontWeight={700} color="success.main">
                          {stats.materialsCount * 5 + stats.completedSessionsCount * 10}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Semínka růstu
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Sbírejte semínka za každý dokončený materiál (+5) a sezení (+10). Vaše zahrada osobního růstu kvete! 🌱
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Rozpracované aktivity */}
            <Grid item xs={12} md={4}>
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                <Card
                  onClick={() => navigate('/client/programs')}
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
                      boxShadow: (theme) => theme.shadows[4],
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: '50%',
                          backgroundColor: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(139, 188, 143, 0.15)'
                              : 'rgba(85, 107, 47, 0.1)',
                          color: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                        }}
                      >
                        <TrendingUp size={24} />
                      </Box>
                      <Box>
                        <Typography variant="h4" fontWeight={700}>
                          {stats.programsCount}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Aktivních programů
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Máte rozpracované programy, které čekají na váš pokrok. Pokračujte v růstu!
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Doporučení */}
            <Grid item xs={12} md={4}>
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
              >
                <Card
                  onClick={() => navigate('/client/materials')}
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
                      boxShadow: (theme) => theme.shadows[4],
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: '50%',
                          backgroundColor: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(139, 188, 143, 0.15)'
                              : 'rgba(85, 107, 47, 0.1)',
                          color: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                        }}
                      >
                        <BookOpen size={24} />
                      </Box>
                      <Box>
                        <Typography variant="h4" fontWeight={700}>
                          {stats.materialsCount}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Nových materiálů
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Vaše koučka pro vás připravila nové materiály k prostudování. Prozkoumejte je!
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        {/* Rychlé odkazy */}
        <Typography variant="h5" fontWeight={600} mb={2} mt={2}>
          Rychlé odkazy
        </Typography>
        <Grid container spacing={3}>
          {/* Card 1: Můj profil */}
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

          {/* Card 2: Nápověda */}
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
                    <HelpIcon size={28} style={{ color: theme.palette.primary.main }} />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Nápověda
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pomoc a často kladené otázky
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
