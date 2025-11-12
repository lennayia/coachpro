import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Container, Card, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BORDER_RADIUS from '@styles/borderRadius';
import { useTesterAuth } from '@shared/context/TesterAuthContext';
import { useNotification } from '@shared/context/NotificationContext';
import { supabase } from '@shared/config/supabase';

const TesterProfileSimple = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();
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

  // Pre-fill from OAuth (run ONCE)
  useEffect(() => {
    if (!authLoading && user && !profileLoaded.current) {
      profileLoaded.current = true; // Mark as loaded

      const googleName = user.user_metadata?.full_name || '';
      const userEmail = user.email || '';

      if (profile) {
        // Load existing profile
        setName(googleName || profile.name || '');
        setEmail(profile.email || '');
        setPhone(profile.phone || '');
        setReason(profile.reason || '');
      } else {
        // New user - pre-fill from Google
        if (googleName) setName(googleName);
        if (userEmail) setEmail(userEmail);
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
      const profileData = {
        auth_user_id: user.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || null,
        reason: reason.trim() || null,
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

  if (authLoading || !user) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ p: 4, borderRadius: BORDER_RADIUS.card }}>
          <Typography variant="h4" gutterBottom>
            Profil testera
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            Vyplňte své údaje pro dokončení registrace
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: BORDER_RADIUS.compact }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Celé jméno *"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Email *"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={saving}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Telefon (volitelné)"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={saving}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Proč chcete testovat CoachPro? (volitelné)"
              fullWidth
              multiline
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={saving}
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={saving}
            >
              {saving ? 'Ukládám...' : 'Uložit profil'}
            </Button>
          </form>
        </Card>
      </Container>
    </Box>
  );
};

export default TesterProfileSimple;
