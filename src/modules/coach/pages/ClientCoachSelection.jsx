/**
 * ClientCoachSelection Page
 * Allows clients to browse and select a coach
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Grid,
  CircularProgress,
  Alert,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { ArrowLeft, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeIn, fadeInUp } from '@shared/styles/animations';
import { useTheme } from '@mui/material';
import ClientAuthGuard from '@shared/components/ClientAuthGuard';
import CoachCard from '@shared/components/CoachCard';
import { getActiveCoaches, updateClientCoach } from '@shared/utils/coaches';
import { useNotification } from '@shared/context/NotificationContext';
import { useClientAuth } from '@shared/context/ClientAuthContext';

const ClientCoachSelection = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { showError, showSuccess } = useNotification();
  const { profile, refreshProfile } = useClientAuth();

  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    loadCoaches();
  }, []);

  const loadCoaches = async () => {
    setLoading(true);
    try {
      const data = await getActiveCoaches({ excludeTesters: false });
      setCoaches(data);
    } catch (error) {
      console.error('Error loading coaches:', error);
      showError('Chyba', 'Nepodařilo se načíst seznam koučů');
    } finally {
      setLoading(false);
    }
  };

  const handleCoachSelect = (coach) => {
    setSelectedCoach(coach);
    setConfirmOpen(true);
  };

  const handleConfirmAssignment = async () => {
    if (!profile?.id || !selectedCoach?.id) return;

    setAssigning(true);
    try {
      await updateClientCoach(profile.id, selectedCoach.id);

      // Refresh profile to get updated coach_id
      await refreshProfile();

      showSuccess(
        'Koučka přiřazena',
        `Vaší koučkou je nyní ${selectedCoach.name}. Brzy vás bude kontaktovat.`
      );

      // Navigate to dashboard
      setTimeout(() => {
        navigate('/client/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error assigning coach:', error);
      showError(
        'Chyba při přiřazení',
        'Nepodařilo se přiřadit koučku. Zkuste to prosím znovu.'
      );
    } finally {
      setAssigning(false);
      setConfirmOpen(false);
    }
  };

  const handleCancelAssignment = () => {
    setConfirmOpen(false);
    setSelectedCoach(null);
  };

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
        }}
      >
        <Container maxWidth="lg">
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            {/* Header with Back Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <IconButton
                onClick={() => navigate('/client/welcome')}
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
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                  <Users size={32} color={theme.palette.primary.main} />
                  <Typography variant="h3" fontWeight={700}>
                    Vyberte si koučku
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  Prozkoumejte naše kouče a vyberte si toho pravého pro vaši cestu
                </Typography>
              </Box>
            </Box>

            {/* Loading State */}
            {loading && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '400px',
                }}
              >
                <CircularProgress size={48} />
              </Box>
            )}

            {/* Empty State */}
            {!loading && coaches.length === 0 && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
              >
                <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto' }}>
                  <Typography variant="body1" fontWeight={600} gutterBottom>
                    Zatím tu není žádný kouč
                  </Typography>
                  <Typography variant="body2">
                    Momentálně nemáme žádné kouče k dispozici. Zkuste to prosím později.
                  </Typography>
                </Alert>
              </motion.div>
            )}

            {/* Coaches Grid */}
            {!loading && coaches.length > 0 && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
              >
                <Grid container spacing={3}>
                  {coaches.map((coach, index) => (
                    <Grid item xs={12} md={6} lg={4} key={coach.id}>
                      <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.1 + index * 0.05 }}
                      >
                        <CoachCard
                          coach={coach}
                          onClick={() => handleCoachSelect(coach)}
                        />
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>

                {/* Info Alert */}
                <Box sx={{ mt: 4 }}>
                  <Alert
                    severity="info"
                    sx={{
                      maxWidth: 800,
                      mx: 'auto',
                      borderRadius: '16px',
                    }}
                  >
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                      Jak vybrat koučku?
                    </Typography>
                    <Typography variant="body2">
                      Kontaktujte koučku přímo pomocí telefonu nebo emailu. Domluvte si
                      úvodní konzultaci a zjistěte, zda je to ten pravý kouč pro vás.
                    </Typography>
                  </Alert>
                </Box>
              </motion.div>
            )}
          </motion.div>
        </Container>

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmOpen}
          onClose={handleCancelAssignment}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(26, 36, 16, 0.95)'
                  : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
            Potvrdit výběr koučky
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" color="text.secondary" paragraph>
              Opravdu chcete jako svou koučku vybrat{' '}
              <strong>{selectedCoach?.name}</strong>?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Po potvrzení vás koučka bude moci kontaktovat a plánovat s vámi koučovací sezení.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={handleCancelAssignment}
              disabled={assigning}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: 'text.secondary',
              }}
            >
              Zrušit
            </Button>
            <Button
              onClick={handleConfirmAssignment}
              variant="contained"
              disabled={assigning}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                minWidth: 120,
              }}
            >
              {assigning ? 'Přiřazuji...' : 'Potvrdit'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ClientAuthGuard>
  );
};

export default ClientCoachSelection;
