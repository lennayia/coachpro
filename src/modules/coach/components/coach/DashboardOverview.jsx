import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Stack, Chip, IconButton, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import {
  People as PeopleIcon,
  LibraryBooks as MaterialsIcon,
  Assignment as ProgramsIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getMaterials, getPrograms, getClientsByCoachId } from '../../utils/storage';
import { formatDate, formatRelativeTime } from '@shared/utils/helpers';
import { staggerContainer, staggerItem } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import OnboardingModal from '@shared/components/OnboardingModal';
import WelcomeBanner from '@shared/components/WelcomeBanner';
import HelpDialog from '@shared/components/HelpDialog';
import QuickTooltip from '@shared/components/AppTooltip';
import { getBetaConfig } from '@shared/constants/betaInfo';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const currentUser = getCurrentUser();
  const [materials, setMaterials] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [clients, setClients] = useState([]);

  // Beta onboarding state
  const config = getBetaConfig();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  // Check if onboarding was completed
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem(config.onboardingLocalStorageKey);
    if (!onboardingCompleted) {
      setShowOnboarding(true);
    }
  }, [config.onboardingLocalStorageKey]);

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    localStorage.setItem(config.onboardingLocalStorageKey, 'true');
  };

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      if (currentUser?.id) {
        setMaterials(await getMaterials(currentUser.id));
        setPrograms(await getPrograms(currentUser.id));
        setClients(await getClientsByCoachId(currentUser.id));
      }
    };
    loadData();
  }, [currentUser?.id]);

  // Statistiky
  const activeClients = clients.filter(c => !c.completedAt).length;
  const completedThisMonth = clients.filter(c => {
    if (!c.completedAt) return false;
    const completedDate = new Date(c.completedAt);
    const now = new Date();
    return completedDate.getMonth() === now.getMonth() &&
           completedDate.getFullYear() === now.getFullYear();
  }).length;

  // Stats karty
  const stats = [
    {
      id: 'clients',
      label: 'Aktivní klientky',
      value: activeClients,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#556B2F',
      bgColor: 'rgba(85, 107, 47, 0.1)',
    },
    {
      id: 'completed',
      label: 'Dokončeno tento měsíc',
      value: completedThisMonth,
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: '#228B22',
      bgColor: 'rgba(34, 139, 34, 0.1)',
    },
    {
      id: 'materials',
      label: 'Celkem materiálů',
      value: materials.length,
      icon: <MaterialsIcon sx={{ fontSize: 40 }} />,
      color: '#8FBC8F',
      bgColor: 'rgba(143, 188, 143, 0.1)',
    },
    {
      id: 'programs',
      label: 'Celkem programů',
      value: programs.length,
      icon: <ProgramsIcon sx={{ fontSize: 40 }} />,
      color: '#6B8E23',
      bgColor: 'rgba(107, 142, 35, 0.1)',
    },
  ];

  // Poslední aktivita
  const recentActivities = clients
    .filter(c => c.completedDays.length > 0)
    .map(c => {
      const program = programs.find(p => p.id === c.programId);
      const lastCompletedDay = Math.max(...c.completedDays);
      return {
        clientName: c.name || 'Klientka',
        action: `dokončila Den ${lastCompletedDay}`,
        program: program?.title || 'Program',
        timestamp: c.completedAt || c.startedAt,
      };
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  return (
    <Box>
      {/* Beta Onboarding Modal - při prvním přihlášení */}
      <OnboardingModal open={showOnboarding} onClose={handleOnboardingClose} />

      {/* Welcome Banner - zobrazí se 3× */}
      <WelcomeBanner />

      {/* Uvítání */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box mb={4} display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Ahoj {currentUser?.name || 'koučko'}, hezký den!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {formatDate(new Date().toISOString(), {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              {activeClients > 0 && ` • ${activeClients} aktivních klientek`}
            </Typography>
          </Box>

          {/* Help Button */}
          <QuickTooltip title="Nápověda k Dashboardu">
            <IconButton
              onClick={() => setHelpDialogOpen(true)}
              sx={{
                width: 48,
                height: 48,
                backgroundColor: isDark
                  ? 'rgba(120, 188, 143, 0.15)'
                  : 'rgba(65, 117, 47, 0.15)',
                color: isDark
                  ? 'rgba(120, 188, 143, 0.9)'
                  : 'rgba(65, 117, 47, 0.9)',
                transition: 'all 0.3s',
                '&:hover': {
                  backgroundColor: isDark
                    ? 'rgba(120, 188, 143, 0.25)'
                    : 'rgba(65, 117, 47, 0.25)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              <HelpCircle size={24} />
            </IconButton>
          </QuickTooltip>
        </Box>
      </motion.div>

      {/* Stats karty */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={3} mb={4}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.id}>
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
                          backgroundColor: stat.bgColor,
                          color: stat.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {stat.icon}
                      </Box>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      <Grid container spacing={3}>
        {/* Quick actions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Rychlé akce
              </Typography>
              <Stack spacing={1.5} mt={2} alignItems="flex-start">
                <Button
                  variant="contained"
                  size="medium"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/coach/materials')}
                  sx={{ py: 1 }}
                >
                  Přidat materiál
                </Button>
                <Button
                  variant="outlined"
                  size="medium"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/coach/programs')}
                  sx={{ py: 1 }}
                >
                  Vytvořit program
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Poslední aktivita */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Poslední aktivita
              </Typography>

              {recentActivities.length === 0 ? (
                <Box py={3} textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    Zatím žádná aktivita klientek
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2} mt={2}>
                  {recentActivities.map((activity, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        borderRadius: BORDER_RADIUS.small,
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.02)',
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {activity.clientName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {activity.action}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {activity.program} • {formatRelativeTime(activity.timestamp)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Help Dialog */}
      <HelpDialog
        open={helpDialogOpen}
        onClose={() => setHelpDialogOpen(false)}
        initialPage="dashboard"
      />
    </Box>
  );
};

export default DashboardOverview;
