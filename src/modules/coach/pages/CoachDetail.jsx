import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  Tabs,
  Tab,
  LinearProgress,
} from '@mui/material';
import { Calendar, FileText, FolderOpen, CreditCard } from 'lucide-react';
import { ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { fadeIn, fadeInUp, staggerContainer, staggerItem } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import { useClientAuth } from '@shared/context/ClientAuthContext';
import { getCoachById } from '@shared/utils/coaches';
import { getSharedPrograms, getSharedMaterials, setCurrentClient, saveClient } from '../utils/storage';
import CoachCard from '@shared/components/CoachCard';

const CoachDetail = () => {
  const { coachId: coachSlug } = useParams(); // This is now a slug (name), not ID
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useClientAuth();
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [programs, setPrograms] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    loadCoachData();
  }, [coachSlug, profile]);

  const loadCoachData = async () => {
    try {
      setLoading(true);

      // Get coach ID from navigation state (if available) or find by name
      let coachId = location.state?.coachId;

      if (!coachId) {
        // If no ID in state, we need to find coach by slug
        // For now, get all client's coaches and find by slug
        const { getClientCoaches } = await import('@shared/utils/coaches');
        const clientCoaches = await getClientCoaches(profile?.email);

        const foundCoach = clientCoaches.find(c => {
          const slug = c.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
          return slug === coachSlug;
        });

        if (!foundCoach) {
          setLoading(false);
          return;
        }
        coachId = foundCoach.id;
      }

      // Load coach info
      const coachData = await getCoachById(coachId);
      setCoach(coachData);

      if (!profile?.email) return;

      // Load programs from this coach
      const allPrograms = await getSharedPrograms(coachId, profile.email);
      setPrograms(allPrograms || []);

      // Load materials from this coach
      const allMaterials = await getSharedMaterials(coachId, profile.email);
      setMaterials(allMaterials || []);

      // TODO: Load sessions from this coach
      // TODO: Load cards from this coach

      setLoading(false);
    } catch (error) {
      console.error('Error loading coach data:', error);
      setLoading(false);
    }
  };

  const handleProgramClick = async (program) => {
    try {
      const clientData = {
        id: profile.id,
        name: profile.displayName || profile.name || profile.email,
        programCode: program.shareCode,
        programId: program.programId,
        coachId: program.coachId,
        currentDay: 1,
        completedDays: [],
        moodChecks: [],
        streak: 0,
        longestStreak: 0,
        startedAt: new Date().toISOString(),
        completedAt: null,
        certificateGenerated: false,
        auth_user_id: profile.authUserId,
        _previewProgram: program.program,
      };

      setCurrentClient(clientData);
      await saveClient(clientData);
      navigate('/client/daily');
    } catch (error) {
      console.error('Error opening program:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!coach) {
    return (
      <Box p={3}>
        <Alert severity="error">Koučka nebyla nalezena</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header with back button */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" fontWeight={600}>
          {coach.name || 'Detail koučky'}
        </Typography>
      </Box>

      {/* Coach Profile Card */}
      <motion.div variants={fadeIn} initial="hidden" animate="visible">
        <CoachCard coach={coach} compact={false} showFullProfile={true} />
      </motion.div>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4, mb: 3 }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
          <Tab
            icon={<FolderOpen size={20} />}
            label={`Programy (${programs.length})`}
            iconPosition="start"
          />
          <Tab
            icon={<FileText size={20} />}
            label={`Materiály (${materials.length})`}
            iconPosition="start"
          />
          <Tab
            icon={<Calendar size={20} />}
            label={`Sezení (${sessions.length})`}
            iconPosition="start"
          />
          <Tab
            icon={<CreditCard size={20} />}
            label={`Karty (${cards.length})`}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Tab content */}
      <motion.div
        key={currentTab}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        {/* Programs tab */}
        {currentTab === 0 && (
          <Grid container spacing={2}>
            {programs.length === 0 ? (
              <Grid item xs={12}>
                <Alert severity="info">Žádné programy od této koučky</Alert>
              </Grid>
            ) : (
              programs.map((program, index) => (
                <Grid item xs={12} sm={6} md={4} key={program.id}>
                  <Card
                    onClick={() => handleProgramClick(program)}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: (theme) => theme.shadows[8],
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} mb={1}>
                        {program.program?.name || 'Program'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {program.program?.duration} dní
                      </Typography>
                      <Chip
                        label={program.shareCode}
                        size="small"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}

        {/* Materials tab */}
        {currentTab === 1 && (
          <Grid container spacing={2}>
            {materials.length === 0 ? (
              <Grid item xs={12}>
                <Alert severity="info">Žádné materiály od této koučky</Alert>
              </Grid>
            ) : (
              materials.map((material, index) => (
                <Grid item xs={12} sm={6} md={4} key={material.id}>
                  <Card
                    onClick={() => navigate(`/client/material/${material.shareCode}`)}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: (theme) => theme.shadows[8],
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} mb={1}>
                        {material.material?.name || 'Materiál'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {material.material?.category || 'Kategorie'}
                      </Typography>
                      <Chip
                        label={material.shareCode}
                        size="small"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}

        {/* Sessions tab */}
        {currentTab === 2 && (
          <Alert severity="info">Sezení budou dostupná brzy</Alert>
        )}

        {/* Cards tab */}
        {currentTab === 3 && (
          <Alert severity="info">Karty budou dostupné brzy</Alert>
        )}
      </motion.div>
    </Box>
  );
};

export default CoachDetail;
