import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fadeIn, fadeInUp } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import { useClientAuth } from '@shared/context/ClientAuthContext';
import ClientAuthGuard from '@shared/components/ClientAuthGuard';
import SessionCard from '@shared/components/SessionCard';
import { getClientSessions } from '@shared/utils/sessions';

const ClientSessions = () => {
  const navigate = useNavigate();
  const { profile } = useClientAuth();

  const [tab, setTab] = useState(0); // 0 = Nadcházející, 1 = Minulá
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load sessions
  useEffect(() => {
    const loadSessions = async () => {
      if (!profile?.id) return;

      setLoading(true);
      try {
        // Load both upcoming and past sessions in parallel
        const [upcoming, past] = await Promise.all([
          getClientSessions(profile.id, { upcoming: true }),
          getClientSessions(profile.id, { past: true }),
        ]);

        setUpcomingSessions(upcoming);
        setPastSessions(past);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [profile?.id]);

  const currentSessions = tab === 0 ? upcomingSessions : pastSessions;

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
          {/* Header with back button */}
          <Box display="flex" alignItems="center" gap={2} mb={4}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'rgba(139, 188, 143, 0.08)',
                },
              }}
            >
              <ArrowLeft size={24} />
            </IconButton>

            <Box>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                Moje sezení
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Historie a nadcházející schůzky s koučkou
              </Typography>
            </Box>
          </Box>

          {/* Tabs */}
          <Box mb={4}>
            <Tabs
              value={tab}
              onChange={(e, newValue) => setTab(newValue)}
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                },
              }}
            >
              <Tab label={`Nadcházející (${upcomingSessions.length})`} />
              <Tab label={`Minulá (${pastSessions.length})`} />
            </Tabs>
          </Box>

          {/* Sessions Grid */}
          {loading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress />
            </Box>
          ) : currentSessions.length === 0 ? (
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <Alert
                severity="info"
                sx={{ borderRadius: BORDER_RADIUS.compact }}
              >
                {tab === 0
                  ? 'Nemáte žádná nadcházející sezení. Vaše koučka vám brzy naplánuje další schůzku.'
                  : 'Zatím jste neabsolvovali žádné sezení.'}
              </Alert>
            </motion.div>
          ) : (
            <Grid container spacing={3}>
              {currentSessions.map((session, index) => (
                <Grid item xs={12} md={6} lg={4} key={session.id}>
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.05 }}
                  >
                    <SessionCard
                      session={session}
                      viewMode="client"
                      showCountdown={tab === 0}
                    />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </motion.div>
      </Box>
    </ClientAuthGuard>
  );
};

export default ClientSessions;
