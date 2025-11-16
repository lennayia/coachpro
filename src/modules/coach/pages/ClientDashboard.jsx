import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Alert, Chip, LinearProgress, Button, Avatar } from '@mui/material';
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
import { setCurrentClient, saveClient, getSharedPrograms, getSharedMaterials } from '../utils/storage';
import { supabase } from '@shared/config/supabase';
import { Sprout, TrendingUp, BookOpen, Heart, Sparkles, Compass, Calendar, FileText, FolderOpen, Mail, Phone } from 'lucide-react';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { profile } = useClientAuth();
  const [nextSession, setNextSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [coaches, setCoaches] = useState([]);
  const [loadingCoaches, setLoadingCoaches] = useState(true);
  const [coachStats, setCoachStats] = useState({}); // { coachId: { programs, materials, sessions } }
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

        // Load stats for each coach
        if (profile?.email && profile?.id) {
          const statsPromises = clientCoaches.map(async (coach) => {
            const programs = await getSharedPrograms(coach.id, profile.email);
            const materials = await getSharedMaterials(coach.id, profile.email);
            const { data: sessions } = await supabase
              .from('coachpro_sessions')
              .select('id')
              .eq('client_id', profile.id)
              .eq('coach_id', coach.id);

            return {
              coachId: coach.id,
              stats: {
                programs: programs?.length || 0,
                materials: materials?.length || 0,
                sessions: sessions?.length || 0,
              },
            };
          });

          const statsResults = await Promise.all(statsPromises);
          const statsMap = {};
          statsResults.forEach(({ coachId, stats }) => {
            statsMap[coachId] = stats;
          });
          setCoachStats(statsMap);
        }
      } catch (error) {
        console.error('Error loading coaches:', error);
      } finally {
        setLoadingCoaches(false);
      }
    };

    loadCoaches();
  }, [profile?.id, profile?.email]);

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

  // Helper: Get items for specific coach
  const getCoachItems = (coachId) => {
    return {
      programs: openItems.openPrograms.filter(p => p.coachId === coachId),
      materials: openItems.recentMaterials?.filter(m => m.coachId === coachId) || [],
      sessions: openItems.upcomingSessions?.filter(s => s.coach_id === coachId) || [],
    };
  };

  // Helper: Get next session for specific coach
  const getCoachNextSession = (coachId) => {
    if (!nextSession || nextSession.coach_id !== coachId) return null;
    return nextSession;
  };

  // Helper: Get stats for specific coach
  const getCoachStats = async (coachId) => {
    if (!profile?.email || !profile?.id) return { programs: 0, materials: 0, sessions: 0 };

    const programs = await getSharedPrograms(coachId, profile.email);
    const materials = await getSharedMaterials(coachId, profile.email);
    const { data: sessions } = await supabase
      .from('coachpro_sessions')
      .select('id')
      .eq('client_id', profile.id)
      .eq('coach_id', coachId);

    return {
      programs: programs?.length || 0,
      materials: materials?.length || 0,
      sessions: sessions?.length || 0,
    };
  };

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

        {/* SEKCE 1: Vaše koučky - PRVNÍ SEKCE */}
        <Typography variant="h5" fontWeight={600} mb={3}>
          {loadingCoaches ? '...' : coaches.length === 0 ? 'Vaše koučky' : coaches.length === 1 ? 'Vaše koučka' : 'Vaše koučky'}
        </Typography>

        {/* Koučky s 4 kartami */}
        {loadingCoaches ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress size={48} />
          </Box>
        ) : coaches.length === 0 ? (
          <Alert severity="warning" sx={{ mb: 4, borderRadius: BORDER_RADIUS.card }}>
            <Typography variant="body1" fontWeight={600}>
              Nemáte přiřazenou žádnou koučku
            </Typography>
            <Typography variant="body2">
              Kontaktujte nás pro přiřazení koučky nebo si vyberte z naší nabídky.
            </Typography>
          </Alert>
        ) : (
          coaches.map((coach, coachIndex) => {
            const items = getCoachItems(coach.id);
            const coachNextSession = openItems.upcomingSessions?.find(s => s.coach_id === coach.id);
            const statsData = coachStats[coach.id] || { programs: 0, materials: 0, sessions: 0 };

            return (
              <Box key={coach.id} mb={4}>
                <Grid container spacing={2}>
                  {/* Karta 1: Profil koučky - MODERNÍ DESIGN */}
                  <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
                    <motion.div
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: coachIndex * 0.1 }}
                      style={{ width: '100%', display: 'flex' }}
                    >
                      <Card
                        onClick={() => {
                          const slug = coach.name
                            .toLowerCase()
                            .normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '')
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-+|-+$/g, '');
                          navigate(`/client/coach/${slug}`, { state: { coachId: coach.id } });
                        }}
                        elevation={0}
                        sx={{
                          height: '100%',
                          width: '100%',
                          cursor: 'pointer',
                          borderRadius: BORDER_RADIUS.card,
                          position: 'relative',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          background: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'linear-gradient(135deg, rgba(139, 188, 143, 0.1) 0%, rgba(85, 107, 47, 0.05) 100%)'
                              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(143, 188, 143, 0.05) 100%)',
                          backdropFilter: 'blur(10px)',
                          border: '2px solid',
                          borderColor: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(139, 188, 143, 0.2)'
                              : 'rgba(85, 107, 47, 0.15)',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-8px) scale(1.02)',
                            borderColor: 'primary.main',
                            boxShadow: (theme) =>
                              theme.palette.mode === 'dark'
                                ? '0 20px 40px rgba(139, 188, 143, 0.25), 0 0 0 1px rgba(139, 188, 143, 0.1)'
                                : '0 20px 40px rgba(85, 107, 47, 0.2), 0 0 0 1px rgba(85, 107, 47, 0.1)',
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: (theme) =>
                              theme.palette.mode === 'dark'
                                ? 'linear-gradient(90deg, #8FBC8F, #556B2F, #8FBC8F)'
                                : 'linear-gradient(90deg, #556B2F, #8FBC8F, #556B2F)',
                            backgroundSize: '200% 100%',
                            animation: 'gradientShift 3s ease infinite',
                          },
                          '@keyframes gradientShift': {
                            '0%': { backgroundPosition: '0% 50%' },
                            '50%': { backgroundPosition: '100% 50%' },
                            '100%': { backgroundPosition: '0% 50%' },
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                          {/* Avatar s ring efektem */}
                          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <Box
                              sx={{
                                position: 'relative',
                                '&::before': {
                                  content: '""',
                                  position: 'absolute',
                                  inset: -4,
                                  borderRadius: '50%',
                                  padding: '4px',
                                  background: (theme) =>
                                    theme.palette.mode === 'dark'
                                      ? 'linear-gradient(135deg, #8FBC8F, #556B2F)'
                                      : 'linear-gradient(135deg, #556B2F, #8FBC8F)',
                                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                  WebkitMaskComposite: 'xor',
                                  maskComposite: 'exclude',
                                },
                              }}
                            >
                              <Avatar
                                src={coach.photo_url}
                                sx={{
                                  width: 80,
                                  height: 80,
                                  bgcolor: 'primary.main',
                                  fontSize: 32,
                                  fontWeight: 600,
                                  boxShadow: (theme) =>
                                    theme.palette.mode === 'dark'
                                      ? '0 8px 16px rgba(139, 188, 143, 0.3)'
                                      : '0 8px 16px rgba(85, 107, 47, 0.2)',
                                }}
                              >
                                {!coach.photo_url && coach.name?.charAt(0)}
                              </Avatar>
                            </Box>
                          </Box>

                          {/* Jméno - FIXNÍ VÝŠKA (max 2 řádky) */}
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            textAlign="center"
                            gutterBottom
                            sx={{
                              background: (theme) =>
                                theme.palette.mode === 'dark'
                                  ? 'linear-gradient(135deg, #8FBC8F, #fff)'
                                  : 'linear-gradient(135deg, #556B2F, #2c3e2c)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                              mb: 2,
                              minHeight: '2.6em',
                              maxHeight: '2.6em',
                              lineHeight: 1.3,
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {coach.name}
                          </Typography>

                          {/* Kontaktní údaje - FIXNÍ VÝŠKA */}
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minHeight: '48px' }}>
                            {/* Email - vždy zabírá prostor */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minHeight: '20px' }}>
                              {coach.email ? (
                                <>
                                  <Mail size={14} color={theme.palette.text.secondary} />
                                  <Typography variant="caption" color="text.secondary" noWrap>
                                    {coach.email}
                                  </Typography>
                                </>
                              ) : (
                                <Typography variant="caption" color="transparent">
                                  &nbsp;
                                </Typography>
                              )}
                            </Box>

                            {/* Telefon - vždy zabírá prostor */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minHeight: '20px' }}>
                              {coach.phone ? (
                                <>
                                  <Phone size={14} color={theme.palette.text.secondary} />
                                  <Typography variant="caption" color="text.secondary">
                                    {coach.phone}
                                  </Typography>
                                </>
                              ) : (
                                <Typography variant="caption" color="transparent">
                                  &nbsp;
                                </Typography>
                              )}
                            </Box>
                          </Box>

                          {/* Specializace chipy - FIXNÍ VÝŠKA */}
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2, minHeight: '24px' }}>
                            {coach.specializations ? (
                              (typeof coach.specializations === 'string'
                                ? coach.specializations.split(',').map(s => s.trim())
                                : coach.specializations
                              )
                                .slice(0, 2)
                                .map((spec, idx) => (
                                  <Chip
                                    key={idx}
                                    label={spec}
                                    size="small"
                                    sx={{
                                      fontSize: '0.7rem',
                                      height: 20,
                                      background: (theme) =>
                                        theme.palette.mode === 'dark'
                                          ? 'rgba(139, 188, 143, 0.2)'
                                          : 'rgba(85, 107, 47, 0.1)',
                                      color: 'primary.main',
                                      fontWeight: 600,
                                      border: '1px solid',
                                      borderColor: (theme) =>
                                        theme.palette.mode === 'dark'
                                          ? 'rgba(139, 188, 143, 0.3)'
                                          : 'rgba(85, 107, 47, 0.2)',
                                    }}
                                  />
                                ))
                            ) : (
                              <Typography variant="caption" color="transparent">
                                &nbsp;
                              </Typography>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>

                  {/* Karta 2: Příští sezení */}
                  <Grid item xs={12} sm={6} md={3}>
                    <motion.div
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: coachIndex * 0.1 + 0.05 }}
                    >
                      <Card
                        elevation={0}
                        sx={{
                          borderRadius: BORDER_RADIUS.card,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Příští sezení
                          </Typography>
                          {coachNextSession ? (
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {new Date(coachNextSession.session_date).toLocaleDateString('cs-CZ', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {coachNextSession.session_time || 'Čas bude upřesněn'}
                              </Typography>
                            </Box>
                          ) : (
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Žádné naplánované sezení
                              </Typography>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                  if (coach.booking_url) {
                                    window.open(coach.booking_url, '_blank', 'noopener,noreferrer');
                                  } else {
                                    navigate('/client/sessions');
                                  }
                                }}
                                sx={{ textTransform: 'none' }}
                              >
                                Naplánovat
                              </Button>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>

                  {/* Karta 3: Právě pracujete */}
                  <Grid item xs={12} sm={6} md={3}>
                    <motion.div
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: coachIndex * 0.1 + 0.1 }}
                    >
                      <Card
                        elevation={0}
                        sx={{
                          borderRadius: BORDER_RADIUS.card,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Právě pracujete
                          </Typography>
                          {items.programs.length > 0 ? (
                            <Box>
                              {items.programs.slice(0, 2).map((program, idx) => (
                                <Typography key={idx} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                  • {program.program?.name || 'Program'}
                                </Typography>
                              ))}
                            </Box>
                          ) : (
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Žádné rozpracované programy
                              </Typography>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                  const slug = coach.name
                                    .toLowerCase()
                                    .normalize('NFD')
                                    .replace(/[\u0300-\u036f]/g, '')
                                    .replace(/[^a-z0-9]+/g, '-')
                                    .replace(/^-+|-+$/g, '');
                                  navigate(`/client/coach/${slug}`, { state: { coachId: coach.id } });
                                }}
                                sx={{ textTransform: 'none' }}
                              >
                                Prozkoumat
                              </Button>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>

                  {/* Karta 4: Aktivní obsah */}
                  <Grid item xs={12} sm={6} md={3}>
                    <motion.div
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: coachIndex * 0.1 + 0.15 }}
                    >
                      <Card
                        elevation={0}
                        sx={{
                          borderRadius: BORDER_RADIUS.card,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Aktivní obsah
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                              📚 {statsData.programs} {statsData.programs === 1 ? 'program' : statsData.programs < 5 ? 'programy' : 'programů'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              📄 {statsData.materials} {statsData.materials === 1 ? 'materiál' : statsData.materials < 5 ? 'materiály' : 'materiálů'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              🗓️ {statsData.sessions} {statsData.sessions === 1 ? 'sezení' : 'sezení'}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                </Grid>
              </Box>
            );
          })
        )}

        {/* SEKCE 2: Celkové statistiky */}
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

        {/* SEKCE 3: Motivační sekce - dynamický název */}
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
