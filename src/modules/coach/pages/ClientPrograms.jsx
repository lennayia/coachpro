import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  LinearProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { ArrowLeft, Phone, Mail } from 'lucide-react';
import { NAVIGATION_ICONS } from '@shared/constants/icons';
import { motion } from 'framer-motion';
import { fadeIn, fadeInUp } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import { useTheme } from '@mui/material';
import { useClientAuth } from '@shared/context/ClientAuthContext';
import ClientAuthGuard from '@shared/components/ClientAuthGuard';
import { formatDate } from '@shared/utils/helpers';

const ClientPrograms = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { profile } = useClientAuth();
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [coachInfo, setCoachInfo] = useState(null);

  useEffect(() => {
    if (profile?.email) {
      loadPrograms();
    }
  }, [profile?.email]);

  useEffect(() => {
    // Filter programs based on selected tab
    if (filter === 'all') {
      setFilteredPrograms(programs);
    } else if (filter === 'active') {
      setFilteredPrograms(programs.filter(p => !p.completedAt));
    } else if (filter === 'completed') {
      setFilteredPrograms(programs.filter(p => p.completedAt));
    }
  }, [filter, programs]);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!profile?.email) {
        setPrograms([]);
        setFilteredPrograms([]);
        setLoading(false);
        return;
      }

      // Import the function dynamically to get shared programs for this client
      const { getSharedPrograms } = await import('../utils/storage');
      const sharedPrograms = await getSharedPrograms(null, profile.email);

      // Deduplicate by program_id - keep only the latest share of each program
      const uniquePrograms = [];
      const seenProgramIds = new Set();

      sharedPrograms.forEach((sharedProgram) => {
        const programId = sharedProgram.programId || sharedProgram.program?.id;
        if (programId && !seenProgramIds.has(programId)) {
          seenProgramIds.add(programId);
          uniquePrograms.push(sharedProgram);
        }
      });

      // Extract coach info from first program
      if (uniquePrograms.length > 0) {
        const firstProgram = uniquePrograms[0];
        setCoachInfo({
          name: firstProgram.coachName || firstProgram.coach?.name || 'Koučka',
          phone: firstProgram.coach?.phone || null,
          email: firstProgram.coach?.email || firstProgram.coachEmail || null,
          website: firstProgram.coach?.website || null,
        });
      }

      setPrograms(uniquePrograms);
      setFilteredPrograms(uniquePrograms);
      setLoading(false);
    } catch (err) {
      console.error('Error loading programs:', err);
      setError('Nepodařilo se načíst programy. Zkus to prosím znovu.');
      setLoading(false);
    }
  };

  const handleProgramClick = (program) => {
    // Set current client session and navigate to daily view
    const { setCurrentClient } = require('../utils/storage');

    setCurrentClient({
      id: program.clientId || profile.id,
      name: profile.name || profile.email,
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
    });

    navigate('/client/daily');
  };

  const calculateProgress = (program) => {
    const totalDays = program.program?.duration || program.duration || 0;
    const completedDays = program.completedDays?.length || 0;
    return totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
  };

  if (loading) {
    return (
      <ClientAuthGuard requireProfile={true}>
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
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
              Načítám programy...
            </Typography>
          </Box>
        </Box>
      </ClientAuthGuard>
    );
  }

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
          {/* Header with Back Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <IconButton
              onClick={() => navigate('/client/dashboard')}
              sx={{
                mr: 2,
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(139, 188, 143, 0.15)'
                      : 'rgba(85, 107, 47, 0.1)',
                },
              }}
            >
              <ArrowLeft size={24} />
            </IconButton>
            <Box>
              <Typography variant="h3" fontWeight={700}>
                Moje Programy
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sdílené programy od vaší koučky
              </Typography>
            </Box>
          </Box>

          {/* Coach Profile Card */}
          {coachInfo && (
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              <Card
                elevation={0}
                sx={{
                  mb: 4,
                  borderRadius: BORDER_RADIUS.card,
                  border: '1px solid',
                  borderColor: 'divider',
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(26, 36, 16, 0.8)'
                      : 'rgba(255, 255, 255, 0.95)',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(139, 188, 143, 0.15)'
                            : 'rgba(85, 107, 47, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      <Typography variant="h4" fontWeight={700} color="primary.main">
                        {coachInfo.name.charAt(0)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {coachInfo.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {coachInfo.website}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {coachInfo.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone size={16} color={theme.palette.text.secondary} />
                        <Typography variant="body2" color="text.secondary">
                          {coachInfo.phone}
                        </Typography>
                      </Box>
                    )}
                    {coachInfo.email && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Mail size={16} color={theme.palette.text.secondary} />
                        <Typography variant="body2" color="text.secondary">
                          {coachInfo.email}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: BORDER_RADIUS.compact }}>
              {error}
            </Alert>
          )}

          {/* Filter Tabs */}
          <Box sx={{ mb: 3 }}>
            <Tabs
              value={filter}
              onChange={(e, newValue) => setFilter(newValue)}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                },
              }}
            >
              <Tab label="Všechny programy" value="all" />
              <Tab label={`Aktivní (${programs.filter(p => !p.completedAt).length})`} value="active" />
              <Tab label={`Dokončené (${programs.filter(p => p.completedAt).length})`} value="completed" />
            </Tabs>
          </Box>

          {/* Programs Grid */}
          {filteredPrograms.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <NAVIGATION_ICONS.programs size={64} color={theme.palette.text.disabled} />
              <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                {filter === 'completed'
                  ? 'Nemáte žádné dokončené programy'
                  : filter === 'active'
                  ? 'Nemáte žádné aktivní programy'
                  : 'Zatím nemáte žádné sdílené programy'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Vaše koučka vám brzy sdílí programy pro vaše koučování
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredPrograms.map((program, index) => {
                const programData = program.program || program;
                const progress = calculateProgress(program);
                const isCompleted = !!program.completedAt;

                return (
                  <Grid item xs={12} sm={6} md={4} key={program.id}>
                    <motion.div
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        elevation={0}
                        sx={{
                          height: '100%',
                          borderRadius: BORDER_RADIUS.card,
                          border: '1px solid',
                          borderColor: isCompleted ? 'success.main' : 'divider',
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
                        onClick={() => handleProgramClick(program)}
                      >
                        <CardContent sx={{ p: 3 }}>
                          {/* Status Chip */}
                          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Chip
                              label={isCompleted ? 'Dokončeno' : 'Aktivní'}
                              size="small"
                              sx={{
                                backgroundColor: (theme) =>
                                  isCompleted
                                    ? theme.palette.mode === 'dark'
                                      ? 'rgba(76, 175, 80, 0.15)'
                                      : 'rgba(76, 175, 80, 0.1)'
                                    : theme.palette.mode === 'dark'
                                    ? 'rgba(139, 188, 143, 0.15)'
                                    : 'rgba(85, 107, 47, 0.1)',
                                color: isCompleted ? 'success.main' : 'primary.main',
                                fontWeight: 600,
                              }}
                            />
                            <Chip
                              label={`${programData.duration || 0} dní`}
                              size="small"
                              sx={{
                                backgroundColor: (theme) =>
                                  theme.palette.mode === 'dark'
                                    ? 'rgba(139, 188, 143, 0.15)'
                                    : 'rgba(85, 107, 47, 0.1)',
                                color: 'primary.main',
                                fontWeight: 600,
                              }}
                            />
                          </Box>

                          {/* Title */}
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            {programData.title || 'Bez názvu'}
                          </Typography>

                          {/* Description */}
                          {programData.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                mb: 2,
                              }}
                            >
                              {programData.description}
                            </Typography>
                          )}

                          {/* Progress */}
                          <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                Postup
                              </Typography>
                              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                {progress}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={progress}
                              sx={{
                                height: 8,
                                borderRadius: 1,
                                backgroundColor: (theme) =>
                                  theme.palette.mode === 'dark'
                                    ? 'rgba(139, 188, 143, 0.1)'
                                    : 'rgba(85, 107, 47, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                  borderRadius: 1,
                                  background: isCompleted
                                    ? 'linear-gradient(90deg, #4CAF50 0%, #66BB6A 100%)'
                                    : `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                },
                              }}
                            />
                          </Box>

                          {/* Stats */}
                          <Box sx={{ display: 'flex', gap: 2, mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Materiálů
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {programData.days?.reduce((acc, day) => acc + (day.materialIds?.length || 0), 0) || 0}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Dokončeno dnů
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {program.completedDays?.length || 0} / {programData.duration || 0}
                              </Typography>
                            </Box>
                            {program.streak > 0 && (
                              <Box>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  Šňůra
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                  🔥 {program.streak}
                                </Typography>
                              </Box>
                            )}
                          </Box>

                          {/* Start Date */}
                          {program.startedAt && (
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
                              Začátek: {formatDate(program.startedAt, { day: 'numeric', month: 'long', year: 'numeric' })}
                            </Typography>
                          )}

                          {/* Completion Date */}
                          {program.completedAt && (
                            <Typography variant="caption" color="success.main" display="block" fontWeight={600}>
                              Dokončeno: {formatDate(program.completedAt, { day: 'numeric', month: 'long', year: 'numeric' })}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </motion.div>
      </Box>
    </ClientAuthGuard>
  );
};

export default ClientPrograms;
