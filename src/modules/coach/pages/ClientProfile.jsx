import { useState, useEffect } from 'react';
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
  MenuItem,
  Divider,
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import cs from 'date-fns/locale/cs';
import { useClientAuth } from '@shared/context/ClientAuthContext';
import ClientAuthGuard from '@shared/components/ClientAuthGuard';
import PhotoUpload from '@shared/components/PhotoUpload';
import { PHOTO_BUCKETS } from '@shared/utils/photoStorage';

const ClientProfile = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();
  const theme = useTheme();
  const glassCardStyles = useGlassCard('subtle');
  const { user, profile, loading: authLoading, refreshProfile } = useClientAuth();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [goals, setGoals] = useState('');
  const [healthNotes, setHealthNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState(null);
  const [preferredContact, setPreferredContact] = useState('email');
  const [timezone, setTimezone] = useState('Europe/Prague');
  const [clientNotes, setClientNotes] = useState('');
  const [coachInfo, setCoachInfo] = useState(null);

  // Load profile from context
  useEffect(() => {
    if (!authLoading && user) {
      // Get name from Google OAuth (PRIORITY!)
      const googleName = user.user_metadata?.full_name || user.user_metadata?.name || '';

      // Pre-fill email from OAuth
      setEmail(user.email || '');

      if (profile) {
        // Load existing profile

        setName(googleName || profile.name || '');
        setEmail(profile.email || '');
        setPhone(profile.phone || '');
        setDateOfBirth(profile.date_of_birth ? new Date(profile.date_of_birth) : null);
        setGoals(profile.goals || '');
        setHealthNotes(profile.health_notes || '');

        // Only update photo if profile photo is different (avoid overwriting unsaved changes)
        if (profile.photo_url !== photoUrl) {
          setPhotoUrl(profile.photo_url || null);
        } else {
        }

        setPreferredContact(profile.preferred_contact || 'email');
        setTimezone(profile.timezone || 'Europe/Prague');
        setClientNotes(profile.client_notes || '');

        // Load coach info if assigned
        if (profile.coach_id) {
          loadCoachInfo(profile.coach_id);
        }
      } else {
        // New user - pre-fill name from Google
        if (googleName) {
          setName(googleName);
        }
      }
    }
  }, [authLoading, user, profile]);

  const loadCoachInfo = async (coachId) => {
    try {
      const { data, error } = await supabase
        .from('coachpro_coaches')
        .select('id, name, email, phone')
        .eq('id', coachId)
        .single();

      if (error) throw error;
      setCoachInfo(data);
    } catch (err) {
      console.error('Error loading coach info:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Jméno je povinné');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const profileData = {
        auth_user_id: user.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        date_of_birth: dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : null,
        goals: goals.trim(),
        health_notes: healthNotes.trim(),
        photo_url: photoUrl,
        preferred_contact: preferredContact,
        timezone: timezone,
        client_notes: clientNotes.trim(),
      };


      const { data: upsertData, error: upsertError } = await supabase
        .from('coachpro_client_profiles')
        .upsert(profileData, {
          onConflict: 'auth_user_id',
        })
        .select();

      if (upsertError) throw upsertError;


      // Small delay to ensure database write completes
      await new Promise(resolve => setTimeout(resolve, 500));

      // Refresh profile in context
      await refreshProfile();

      showSuccess(
        'Profil uložen',
        'Váš profil byl úspěšně aktualizován.'
      );

      // Navigate back to welcome
      setTimeout(() => {
        navigate('/client/welcome');
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

  return (
    <ClientAuthGuard requireProfile={false}>
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
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
        },
      }}
    >
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        style={{ width: '100%', maxWidth: 700 }}
      >
        <Card
          elevation={0}
          sx={{
            ...glassCardStyles,
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '32px',
          }}
        >
          <Box p={4} position="relative">
            {/* Back arrow - top left */}
            <IconButton
              onClick={() => navigate('/client/welcome')}
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'rgba(139, 188, 143, 0.08)',
                },
              }}
            >
              <ArrowLeft size={20} />
            </IconButton>

            {/* Error */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, mt: 5 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Header */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              <Box textAlign="center" mb={4} mt={5}>
                {/* Photo Upload */}
                <PhotoUpload
                  photoUrl={photoUrl}
                  onPhotoChange={setPhotoUrl}
                  userId={user?.id}
                  bucket={PHOTO_BUCKETS.CLIENT_PHOTOS}
                  size={120}
                />

                <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 3 }}>
                  Váš profil
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Upravte svoje osobní údaje
                </Typography>
              </Box>
            </motion.div>

            {/* Form */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Name */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Jméno a příjmení"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={saving}
                      InputProps={{
                        sx: { borderRadius: BORDER_RADIUS.compact },
                      }}
                    />
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={saving}
                      InputProps={{
                        sx: { borderRadius: BORDER_RADIUS.compact },
                      }}
                    />
                  </Grid>

                  {/* Phone */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Telefon"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={saving}
                      InputProps={{
                        sx: { borderRadius: BORDER_RADIUS.compact },
                      }}
                    />
                  </Grid>

                  {/* Date of Birth */}
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={cs}>
                      <DatePicker
                        label="Datum narození"
                        value={dateOfBirth}
                        onChange={(newValue) => setDateOfBirth(newValue)}
                        disabled={saving}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            InputProps: {
                              sx: { borderRadius: BORDER_RADIUS.compact },
                            },
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>

                  {/* Goals */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Vaše cíle"
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                      disabled={saving}
                      placeholder="Co chcete dosáhnout? Jaké jsou vaše osobní cíle?"
                      InputProps={{
                        sx: { borderRadius: BORDER_RADIUS.compact },
                      }}
                    />
                  </Grid>

                  {/* Health Notes */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Zdravotní poznámky"
                      value={healthNotes}
                      onChange={(e) => setHealthNotes(e.target.value)}
                      disabled={saving}
                      placeholder="Informace, které by měla vaše koučka vědět (volitelné)"
                      InputProps={{
                        sx: { borderRadius: BORDER_RADIUS.compact },
                      }}
                    />
                  </Grid>

                  {/* Divider */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>

                  {/* Preferred Contact Method */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Preferovaný způsob kontaktu"
                      value={preferredContact}
                      onChange={(e) => setPreferredContact(e.target.value)}
                      disabled={saving}
                      InputProps={{
                        sx: { borderRadius: BORDER_RADIUS.compact },
                      }}
                    >
                      <MenuItem value="email">Email</MenuItem>
                      <MenuItem value="phone">Telefon</MenuItem>
                      <MenuItem value="whatsapp">WhatsApp</MenuItem>
                    </TextField>
                  </Grid>

                  {/* Timezone */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Časová zóna"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      disabled={saving}
                      InputProps={{
                        sx: { borderRadius: BORDER_RADIUS.compact },
                      }}
                    >
                      <MenuItem value="Europe/Prague">Praha (CET/CEST)</MenuItem>
                      <MenuItem value="Europe/London">Londýn (GMT/BST)</MenuItem>
                      <MenuItem value="America/New_York">New York (EST/EDT)</MenuItem>
                      <MenuItem value="America/Los_Angeles">Los Angeles (PST/PDT)</MenuItem>
                      <MenuItem value="Asia/Tokyo">Tokio (JST)</MenuItem>
                    </TextField>
                  </Grid>

                  {/* Client Notes */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Moje poznámky"
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      disabled={saving}
                      placeholder="Soukromé poznámky (vidíte pouze vy)"
                      InputProps={{
                        sx: { borderRadius: BORDER_RADIUS.compact },
                      }}
                    />
                  </Grid>

                  {/* Coach Info (if assigned) */}
                  {coachInfo && (
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          p: 3,
                          borderRadius: BORDER_RADIUS.compact,
                          border: '1px solid',
                          borderColor: 'divider',
                          bgcolor: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(139, 188, 143, 0.05)'
                              : 'rgba(85, 107, 47, 0.03)',
                        }}
                      >
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          Vaše koučka
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Jméno:</strong> {coachInfo.name}
                        </Typography>
                        {coachInfo.email && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>Email:</strong> {coachInfo.email}
                          </Typography>
                        )}
                        {coachInfo.phone && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>Telefon:</strong> {coachInfo.phone}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  )}

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="center" mt={2}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={saving}
                        startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon size={20} />}
                        sx={{
                          px: 4,
                          py: 1.5,
                          borderRadius: BORDER_RADIUS.compact,
                        }}
                      >
                        {saving ? 'Ukládám...' : 'Uložit profil'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </motion.div>
          </Box>
        </Card>
      </motion.div>
    </Box>
    </ClientAuthGuard>
  );
};

export default ClientProfile;
