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
  IconButton,
  InputAdornment,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, LogOut, CheckCircle as CheckIcon } from 'lucide-react';
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
import {
  getProgramByCode,
  getMaterialByCode,
  getCardDeckByCode,
  getClientByProgramCode,
  saveClient,
  setCurrentClient,
} from '../utils/storage';
import { generateUUID, isValidShareCode } from '../utils/generateCode';

// Helper: Convert name to vocative case (5. pád - oslovení)
const getVocative = (fullName) => {
  if (!fullName) return '';

  // Extract first name only (Lenka Penka Podkolenka → Lenka)
  const firstName = fullName.trim().split(' ')[0];

  // Ženská jména končící na -a → -o (Jana → Jano, Lenka → Lenko)
  if (firstName.endsWith('a') && firstName.length > 1) {
    return firstName.slice(0, -1) + 'o';
  }

  return firstName;
};

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

  // Profile status
  const [hasProfile, setHasProfile] = useState(false);
  const [hasProgram, setHasProgram] = useState(false);

  // Code entry for "waiting" state
  const [code, setCode] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [detectedType, setDetectedType] = useState(null);

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          showError('Nepřihlášen', 'Nejste přihlášen. Přesměrovávám...');
          navigate('/client');
          return;
        }

        setUser(user);

        // Get name from Google OAuth (PRIORITY!)
        const googleName = user.user_metadata?.full_name || user.user_metadata?.name || '';

        // Pre-fill email from OAuth
        setEmail(user.email || '');

        // Check if profile already exists
        const { data: existingProfile } = await supabase
          .from('coachpro_client_profiles')
          .select('*')
          .eq('auth_user_id', user.id)
          .single();

        if (existingProfile && existingProfile.name) {
          setHasProfile(true);

          // Use Google name if available, otherwise use profile name
          setName(googleName || existingProfile.name || '');
          setEmail(existingProfile.email || '');
          setPhone(existingProfile.phone || '');
          setDateOfBirth(existingProfile.date_of_birth ? new Date(existingProfile.date_of_birth) : null);
          setGoals(existingProfile.goals || '');
          setHealthNotes(existingProfile.health_notes || '');

          // Check if they have a program
          const { data: clients } = await supabase
            .from('coachpro_clients')
            .select('*')
            .eq('auth_user_id', user.id)
            .limit(1);

          if (clients && clients.length > 0) {
            // Has profile + program → redirect to daily view
            setHasProgram(true);
            showSuccess('Vítejte zpět!', `Dobrý den, ${existingProfile.name}!`);
            navigate('/client/daily');
            return;
          }

          // Has profile but NO program → show "waiting" UI (stay on this page)
          setHasProgram(false);
        } else {
          // New user - pre-fill name from Google
          if (googleName) {
            setName(googleName);
          }
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

  // Auto-detect code type
  useEffect(() => {
    const detectType = async () => {
      if (code.length !== 6 || !isValidShareCode(code)) {
        setPreviewData(null);
        setDetectedType(null);
        return;
      }

      try {
        // Try program
        const program = await getProgramByCode(code);
        if (program) {
          setPreviewData({ title: program.title, coachName: program.coachName });
          setDetectedType('program');
          return;
        }

        // Try material
        const material = await getMaterialByCode(code);
        if (material) {
          setPreviewData({ title: material.title, type: 'Materiál' });
          setDetectedType('material');
          return;
        }

        // Try card deck
        const cardDeck = await getCardDeckByCode(code);
        if (cardDeck) {
          setPreviewData({ title: cardDeck.deck_name || 'Koučovací karty', type: 'Karty' });
          setDetectedType('card-deck');
          return;
        }

        setError('Kód nebyl nalezen.');
        setPreviewData(null);
        setDetectedType(null);
      } catch (err) {
        console.error('Code detection error:', err);
      }
    };

    const debounce = setTimeout(detectType, 300);
    return () => clearTimeout(debounce);
  }, [code]);

  const handleCodeSubmit = async () => {
    if (code.length !== 6) {
      setError('Kód musí obsahovat přesně 6 znaků');
      return;
    }

    setCodeLoading(true);
    setError('');

    try {
      // Program entry
      if (detectedType === 'program') {
        const program = await getProgramByCode(code);
        if (!program) throw new Error('Program nebyl nalezen');

        let client = await getClientByProgramCode(code);

        if (!client) {
          client = {
            id: generateUUID(),
            name: name,
            programCodes: [code],
            programIds: [program.id],
            coachId: program.coachId,
            createdAt: new Date().toISOString(),
            auth_user_id: user.id,
          };
          await saveClient(client);
        } else if (!client.auth_user_id) {
          client.auth_user_id = user.id;
          await saveClient(client);
        }

        setCurrentClient(client);
        navigate('/client/daily');
        return;
      }

      // Material entry
      if (detectedType === 'material') {
        navigate(`/client/material/${code}`);
        return;
      }

      // Card deck entry
      if (detectedType === 'card-deck') {
        navigate(`/client/card-deck/${code}`);
        return;
      }

      throw new Error('Nepodařilo se určit typ obsahu');
    } catch (err) {
      console.error('Code submit error:', err);
      setError(err.message || 'Nastala chyba při zpracování kódu');
      showError('Chyba', 'Nepodařilo se zpracovat kód.');
    } finally {
      setCodeLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/client');
    } catch (err) {
      console.error('Logout error:', err);
      showError('Chyba', 'Nepodařilo se odhlásit');
    }
  };

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

      showSuccess(
        `Vítejte, ${getVocative(name.trim())}!`,
        'Váš profil byl úspěšně vytvořen. Nyní můžete zadat kód od své koučky.'
      );

      // Redirect back to client entry
      setTimeout(() => {
        navigate('/client');
      }, 2000);

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
          <Box p={4} position="relative">
            {/* Logout button - show if has profile */}
            {hasProfile && (
              <IconButton
                onClick={handleLogout}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'error.main',
                    backgroundColor: 'rgba(211, 47, 47, 0.08)',
                  },
                }}
              >
                <LogOut size={20} />
              </IconButton>
            )}

            {/* Error */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Conditional render: Welcome Back UI vs Profile Form */}
            {hasProfile && !hasProgram ? (
              /* Welcome Back - No Program */
              <>
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
                      Vítejte zpět, {getVocative(name)}!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Jak se dneska máte? Pro přístup k programům se spojte se svojí koučkou nebo zadejte kód.
                    </Typography>
                  </Box>
                </motion.div>

                {/* Code Entry */}
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom mb={2}>
                    Máte kód od své koučky?
                  </Typography>

                  <TextField
                    fullWidth
                    label="Zadejte 6-místný kód"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
                    InputProps={{
                      endAdornment: previewData ? (
                        <InputAdornment position="end">
                          <CheckIcon size={20} color={theme.palette.success.main} />
                        </InputAdornment>
                      ) : null,
                      sx: { borderRadius: BORDER_RADIUS.compact },
                    }}
                    placeholder="ABC123"
                    disabled={codeLoading}
                    helperText="Kód vám otevře program, materiál nebo karty"
                    sx={{ mb: 2 }}
                  />

                  {/* Preview */}
                  {previewData && (
                    <Alert
                      severity="success"
                      icon={<CheckIcon size={20} />}
                      sx={{
                        mb: 2,
                        borderRadius: BORDER_RADIUS.compact,
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {previewData.title}
                      </Typography>
                      {previewData.coachName && (
                        <Typography variant="caption" sx={{ fontWeight: 500, color: 'primary.main' }}>
                          Od kouče: {previewData.coachName}
                        </Typography>
                      )}
                      {previewData.type && (
                        <Typography variant="caption" color="text.secondary">
                          Typ: {previewData.type}
                        </Typography>
                      )}
                    </Alert>
                  )}

                  <Box display="flex" justifyContent="center" mb={3}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleCodeSubmit}
                      disabled={code.length !== 6 || !detectedType || codeLoading}
                      sx={{
                        px: 4,
                        py: 1.5,
                      }}
                    >
                      {codeLoading ? <CircularProgress size={24} /> : 'Vstoupit'}
                    </Button>
                  </Box>

                  {/* Options */}
                  <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary" textAlign="center" mb={2}>
                      Nebo se spojte se svojí koučkou pro přístup k programům
                    </Typography>
                    <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
                      Kouč vám poskytne kód pro přístup k personalizovanému programu
                    </Typography>
                  </Box>
                </motion.div>
              </>
            ) : (
              /* Profile Form - New User */
              <>
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
              </>
            )}
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
};

export default ClientProfile;
