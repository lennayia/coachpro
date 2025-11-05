import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon } from 'lucide-react';
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

const ClientProfile = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();
  const theme = useTheme();
  const glassCardStyles = useGlassCard('subtle');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [goals, setGoals] = useState('');
  const [healthNotes, setHealthNotes] = useState('');

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          showError('Nepřihlášen', 'Nejste přihlášen. Přesměrovávám na registraci...');
          navigate('/client/signup');
          return;
        }

        setUser(user);

        // Pre-fill email from OAuth
        setEmail(user.email || '');

        // Check if profile already exists
        const { data: existingProfile, error: profileError } = await supabase
          .from('coachpro_client_profiles')
          .select('*')
          .eq('auth_user_id', user.id)
          .single();

        if (existingProfile) {
          // Profile already exists - load it
          setName(existingProfile.name || '');
          setEmail(existingProfile.email || '');
          setPhone(existingProfile.phone || '');
          setDateOfBirth(existingProfile.date_of_birth ? new Date(existingProfile.date_of_birth) : null);
          setGoals(existingProfile.goals || '');
          setHealthNotes(existingProfile.health_notes || '');
        }

        setLoading(false);
      } catch (err) {
        console.error('Auth check error:', err);
        setError('Chyba při načítání profilu.');
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, showError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      // Validation
      if (!name.trim()) {
        throw new Error('Vyplňte prosím své jméno');
      }

      if (!email.trim()) {
        throw new Error('Vyplňte prosím svůj email');
      }

      // Prepare data
      const profileData = {
        auth_user_id: user.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        date_of_birth: dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : null,
        goals: goals.trim() || null,
        health_notes: healthNotes.trim() || null,
        updated_at: new Date().toISOString(),
      };

      // Upsert profile
      const { error: upsertError } = await supabase
        .from('coachpro_client_profiles')
        .upsert(profileData, {
          onConflict: 'auth_user_id',
        });

      if (upsertError) throw upsertError;

      showSuccess('Hotovo!', 'Profil byl úspěšně uložen');

      // Redirect to program entry
      setTimeout(() => {
        navigate('/client/entry');
      }, 1000);

    } catch (err) {
      console.error('Profile save error:', err);
      const errorMsg = err.message || 'Nepodařilo se uložit profil. Zkuste to prosím znovu.';
      setError(errorMsg);
      showError('Chyba', errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
          <Box p={4}>
            {/* Header */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              <Box textAlign="center" mb={4}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(139, 188, 143, 0.15)'
                        : 'rgba(85, 107, 47, 0.1)',
                    mb: 2,
                  }}
                >
                  <UserIcon size={40} color={theme.palette.primary.main} />
                </Box>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Váš profil
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Vyplňte prosím své údaje pro personalizaci programu
                </Typography>
              </Box>
            </motion.div>

            {/* Error */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

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
                      required
                      type="email"
                      label="Email"
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
                      type="tel"
                      label="Telefon (volitelné)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={saving}
                      InputProps={{
                        sx: { borderRadius: BORDER_RADIUS.compact },
                      }}
                    />
                  </Grid>

                  {/* Date of birth */}
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={cs}>
                      <DatePicker
                        label="Datum narození (volitelné)"
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
                      label="Vaše cíle (volitelné)"
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                      disabled={saving}
                      helperText="Co chcete v programu dosáhnout?"
                      InputProps={{
                        sx: { borderRadius: BORDER_RADIUS.compact },
                      }}
                    />
                  </Grid>

                  {/* Health notes */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Zdravotní poznámky (volitelné)"
                      value={healthNotes}
                      onChange={(e) => setHealthNotes(e.target.value)}
                      disabled={saving}
                      helperText="Máte nějaká zdravotní omezení, o kterých by měla koučka vědět?"
                      InputProps={{
                        sx: { borderRadius: BORDER_RADIUS.compact },
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Submit button */}
                <Box display="flex" justifyContent="center" mt={4}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={saving}
                    startIcon={saving && <CircularProgress size={20} sx={{ color: '#ffffff' }} />}
                    sx={{
                      px: 6,
                      py: 1.5,
                      color: '#ffffff !important',
                      background: (theme) =>
                        `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      borderRadius: BORDER_RADIUS.compact,
                      '&:hover': {
                        background: (theme) =>
                          `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                        boxShadow: (theme) =>
                          theme.palette.mode === 'dark'
                            ? '0 12px 32px rgba(143, 188, 143, 0.3)'
                            : '0 12px 32px rgba(85, 107, 47, 0.3)',
                      },
                    }}
                  >
                    {saving ? 'Ukládám...' : 'Pokračovat'}
                  </Button>
                </Box>
              </form>
            </motion.div>

            {/* Info */}
            <Typography
              variant="caption"
              color="text.secondary"
              textAlign="center"
              display="block"
              mt={3}
            >
              Po uložení profilu budete přesměrováni na vstup do programu.
            </Typography>
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
};

export default ClientProfile;
