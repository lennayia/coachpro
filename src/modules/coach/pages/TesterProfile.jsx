import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  IconButton,
  CircularProgress,
  Container,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, ArrowLeft, Save as SaveIcon } from 'lucide-react';
import { fadeIn, fadeInUp } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import { useNotification } from '@shared/context/NotificationContext';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import { useTheme } from '@mui/material';
import { supabase } from '@shared/config/supabase';
import { useTesterAuth } from '@shared/context/TesterAuthContext';

const TesterProfile = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();
  const theme = useTheme();
  const glassCardStyles = useGlassCard('subtle');
  const { user, profile, loading: authLoading, refreshProfile } = useTesterAuth();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');

  // Ref to track if profile was loaded (prevent infinite loop)
  const profileLoaded = useRef(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/tester/signup');
    }
  }, [authLoading, user, navigate]);

  // Load profile from context (run ONCE)
  useEffect(() => {
    if (!authLoading && user && !profileLoaded.current) {
      profileLoaded.current = true; // Mark as loaded

      // Get name from Google OAuth (PRIORITY!)
      const googleName = user.user_metadata?.full_name || user.user_metadata?.name || '';

      // Pre-fill email from OAuth
      const userEmail = user.email || '';

      if (profile) {
        // Load existing profile
        setName(googleName || profile.name || '');
        setEmail(profile.email || '');
        setPhone(profile.phone || '');
        setReason(profile.reason || '');
      } else {
        // New user - pre-fill name from Google
        if (googleName) {
          setName(googleName);
        }
        if (userEmail) {
          setEmail(userEmail);
        }
      }
    }
  }, [authLoading, user, profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Jméno je povinné');
      return;
    }

    if (!email.trim()) {
      setError('Email je povinný');
      return;
    }

    setSaving(true);
    setError('');

    try {
      // OAuth testers don't get access codes (only form signup testers do)
      const accessCode = profile?.access_code || null;

      const profileData = {
        auth_user_id: user.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || null,
        reason: reason.trim() || null,
        access_code: accessCode, // null for OAuth testers
        terms_accepted: true,
        terms_accepted_date: new Date().toISOString(),
      };

      const { error: upsertError } = await supabase
        .from('testers')
        .upsert(profileData, {
          onConflict: 'auth_user_id',
        });

      if (upsertError) throw upsertError;

      // Refresh profile in context
      await refreshProfile();

      showSuccess(
        'Profil uložen',
        'Váš profil byl úspěšně aktualizován.'
      );

      // Navigate to welcome
      setTimeout(() => {
        navigate('/tester/welcome');
      }, 1500);

    } catch (err) {
      console.error('Profile save error:', err);
      const errorMsg = err.message || 'Nepodařilo se uložit profil. Zkuste to prosím znovu.';
      setError(errorMsg);
      showError('Chyba', errorMsg);
    } finally {
      setSaving(false);
    }
  };

  // Show loading while auth is loading or redirecting
  if (authLoading || !user) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
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
        p: 2,
      }}
    >
        <Container maxWidth="sm">
          <motion.div {...fadeIn}>
            <Card
              sx={{
                ...glassCardStyles,
                borderRadius: BORDER_RADIUS.premium,
                p: 4,
              }}
            >
              {/* Header */}
              <Box display="flex" alignItems="center" mb={3}>
                <IconButton
                  onClick={() => navigate(-1)}
                  sx={{ mr: 2 }}
                >
                  <ArrowLeft size={20} />
                </IconButton>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(143, 188, 143, 0.3) 0%, rgba(85, 107, 47, 0.2) 100%)'
                      : 'linear-gradient(135deg, rgba(143, 188, 143, 0.6) 0%, rgba(85, 107, 47, 0.4) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  <UserIcon size={24} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Profil testera
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" mb={3}>
                Vyplňte své údaje pro dokončení registrace
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: BORDER_RADIUS.compact }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Celé jméno *"
                      fullWidth
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={saving}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: BORDER_RADIUS.compact,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Email *"
                      type="email"
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={saving}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: BORDER_RADIUS.compact,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Telefon (volitelné)"
                      fullWidth
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={saving}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: BORDER_RADIUS.compact,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Proč chcete testovat CoachPro? (volitelné)"
                      fullWidth
                      multiline
                      rows={3}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      disabled={saving}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: BORDER_RADIUS.compact,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={saving}
                      startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon size={20} />}
                      sx={{
                        borderRadius: BORDER_RADIUS.compact,
                        py: 1.5,
                      }}
                    >
                      {saving ? 'Ukládám...' : 'Uložit profil'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Card>
          </motion.div>
        </Container>
      </Box>
  );
};

export default TesterProfile;
