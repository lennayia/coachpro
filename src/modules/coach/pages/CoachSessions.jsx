import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, RefreshCw } from 'lucide-react';
import { fadeIn } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import { useTesterAuth } from '@shared/context/TesterAuthContext';
import TesterAuthGuard from '@shared/components/TesterAuthGuard';
import { useNotification } from '@shared/context/NotificationContext';
import { syncGoogleCalendarToSessions } from '@shared/utils/googleCalendar';
import { supabase } from '@shared/config/supabase';

/**
 * CoachSessions - Manage coach sessions with Google Calendar sync
 *
 * @created 16.11.2025
 * @purpose Allow coaches to sync sessions from Google Calendar
 */
const CoachSessions = () => {
  const navigate = useNavigate();
  const { profile, user } = useTesterAuth();
  const { showSuccess, showError } = useNotification();

  const [syncing, setSyncing] = useState(false);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [syncResults, setSyncResults] = useState(null);

  const handleSync = async () => {
    if (!user || !profile?.id) {
      showError('Chyba', 'Nejste přihlášeni');
      return;
    }

    // Get Google access token from Supabase session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      showError('Chyba', 'Nelze získat přihlašovací údaje');
      return;
    }

    const accessToken = session.provider_token;

    if (!accessToken) {
      showError(
        'Google Calendar není připojen',
        'Odhlaste se a znovu se přihlaste pomocí Google účtu pro synchronizaci kalendáře'
      );
      return;
    }

    setSyncing(true);

    try {
      const results = await syncGoogleCalendarToSessions(accessToken, profile.id, {
        timeMin: new Date().toISOString(), // From now
        maxResults: 50,
      });

      setSyncResults(results);
      setSyncDialogOpen(true);

      if (results.created > 0) {
        showSuccess(
          'Synchronizace dokončena',
          `Vytvořeno ${results.created} nových sezení`
        );
      } else if (results.skipped > 0) {
        showSuccess(
          'Synchronizace dokončena',
          'Žádná nová sezení k synchronizaci'
        );
      }
    } catch (error) {
      console.error('Sync error:', error);

      // Check if it's a permissions error (403)
      if (error.message && error.message.includes('403')) {
        showError(
          'Chybí oprávnění',
          'Nemáte povolený přístup k Google Calendar. Odhlaste se a znovu se přihlaste přes Google.'
        );
      } else {
        showError(
          'Chyba synchronizace',
          error.message || 'Nepodařilo se synchronizovat Google Calendar'
        );
      }
    } finally {
      setSyncing(false);
    }
  };

  return (
    <TesterAuthGuard requireProfile={true}>
      <Box
        sx={{
          minHeight: '100vh',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, #0a0f0a 0%, #1a2410 100%)`
              : `linear-gradient(135deg, #e8ede5 0%, #d4ddd0 100%)`,
          p: 3,
        }}
      >
        <motion.div variants={fadeIn} initial="hidden" animate="visible">
          {/* Header with back button */}
          <Box display="flex" alignItems="center" gap={2} mb={4}>
            <IconButton
              onClick={() => navigate('/tester/welcome')}
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
                Správa sezení
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Synchronizace událostí z Google Calendar
              </Typography>
            </Box>
          </Box>

          {/* Sync Section */}
          <Box
            sx={{
              maxWidth: 800,
              mx: 'auto',
              mt: 4,
            }}
          >
            <Alert severity="info" sx={{ mb: 3, borderRadius: BORDER_RADIUS.card }}>
              <Typography variant="body2" gutterBottom fontWeight={600}>
                Jak funguje synchronizace:
              </Typography>
              <Typography variant="body2" component="div">
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  <li>Klikněte na tlačítko "Synchronizovat Google Calendar"</li>
                  <li>Načtou se všechny nadcházející události z vašeho Google Calendar</li>
                  <li>Automaticky se vytvoří sezení pro každou událost</li>
                  <li>Pokud je v události pozván host (klientka), připojí se email</li>
                </ul>
              </Typography>
            </Alert>

            <Box
              sx={{
                p: 4,
                borderRadius: BORDER_RADIUS.card,
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(143, 188, 143, 0.05)'
                    : 'rgba(255, 255, 255, 0.8)',
                border: '1px solid',
                borderColor: 'divider',
                textAlign: 'center',
              }}
            >
              <Calendar size={48} style={{ marginBottom: 16, color: '#8FBC8F' }} />
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Google Calendar Sync
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Synchronizujte vaše kalendářové události do aplikace
              </Typography>

              <Button
                variant="contained"
                size="large"
                onClick={handleSync}
                disabled={syncing}
                startIcon={syncing ? <CircularProgress size={20} /> : <RefreshCw size={20} />}
                sx={{
                  textTransform: 'none',
                  fontSize: '1rem',
                  py: 1.5,
                  px: 4,
                }}
              >
                {syncing ? 'Synchronizuji...' : 'Synchronizovat Google Calendar'}
              </Button>
            </Box>
          </Box>

          {/* Sync Results Dialog */}
          <Dialog
            open={syncDialogOpen}
            onClose={() => setSyncDialogOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Výsledky synchronizace</DialogTitle>
            <DialogContent>
              {syncResults && (
                <Box>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Vytvořeno:</strong> {syncResults.created} nových sezení
                    </Typography>
                  </Alert>

                  {syncResults.skipped > 0 && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        <strong>Přeskočeno:</strong> {syncResults.skipped} událostí (už existují nebo nejsou vhodné)
                      </Typography>
                    </Alert>
                  )}

                  {syncResults.errors.length > 0 && (
                    <Alert severity="warning">
                      <Typography variant="body2" gutterBottom>
                        <strong>Chyby:</strong> {syncResults.errors.length}
                      </Typography>
                      {syncResults.errors.slice(0, 3).map((err, idx) => (
                        <Typography key={idx} variant="caption" display="block">
                          • {err.event}: {err.error}
                        </Typography>
                      ))}
                    </Alert>
                  )}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSyncDialogOpen(false)}>Zavřít</Button>
            </DialogActions>
          </Dialog>
        </motion.div>
      </Box>
    </TesterAuthGuard>
  );
};

export default CoachSessions;
