import { useState } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link,
  IconButton,
} from '@mui/material';
import { Key, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@shared/config/supabase';
import { setCurrentUser, saveCoach } from '../utils/storage';
import { useNotification } from '@shared/context/NotificationContext';
import BORDER_RADIUS from '@styles/borderRadius';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import GoogleSignInButton from '@shared/components/GoogleSignInButton';

const TesterLogin = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const glassCardStyles = useGlassCard('subtle');

  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate
    if (!accessCode.trim()) {
      setError('Vyplňte, prosím, access kód');
      showError('Chyba', 'Access kód je povinný');
      return;
    }

    setLoading(true);

    try {
      // Find tester by access code in Supabase
      const { data: tester, error: supabaseError } = await supabase
        .from('testers')
        .select('*')
        .eq('access_code', accessCode.trim().toUpperCase())
        .maybeSingle(); // Returns null if not found, no 406 error

      if (supabaseError) {
        console.error('Error looking up access code:', supabaseError);
        setError('Chyba při ověřování kódu. Zkuste to prosím znovu.');
        showError('Chyba', 'Nepodařilo se ověřit access kód');
        setLoading(false);
        return;
      }

      if (!tester) {
        setError('Access kód nebyl nalezen. Zkontrolujte, prosím, že jste zadala správný kód.');
        showError('Neplatný kód', 'Access kód nebyl nalezen');
        setLoading(false);
        return;
      }

      // Create coach session
      const coachUser = {
        id: `tester-${tester.id}`,
        name: tester.name,
        email: tester.email,
        isTester: true,
        testerId: tester.id,
        isAdmin: false, // CRITICAL: Testers are NOT admins
        createdAt: new Date().toISOString(),
      };

      // ⚠️ CRITICAL: Save coach to Supabase at login time
      // This prevents foreign key errors when creating materials/programs
      console.log('🔵 Ukládám coach do Supabase při přihlášení...');

      try {
        await saveCoach(coachUser);
        console.log('✅ Coach úspěšně uložen do Supabase');
      } catch (coachError) {
        console.error('❌ Selhalo uložení coach do Supabase:', coachError);
        setError('Nepodařilo se uložit tvoje data. Zkus se přihlásit znovu nebo kontaktuj podporu.');
        showError('Chyba při přihlášení', 'Nepodařilo se uložit coach data do databáze.');
        setLoading(false);
        return; // Zastavit přihlášení
      }

      setCurrentUser(coachUser);

      showSuccess('Přihlášení úspěšné! 🎉', `Vítejte zpátky, ${tester.name}`);

      // Redirect to coach dashboard
      navigate('/coach/dashboard');

    } catch (err) {
      console.error('Login error:', err);
      setError('Něco se pokazilo. Zkuste to, prosím, znovu.');
      showError('Chyba', 'Přihlášení se nezdařilo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card
        sx={{
          ...glassCardStyles,
          borderRadius: '32px',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Back Button */}
          <Box mb={2}>
            <IconButton
              onClick={() => navigate('/')}
              sx={{
                '&:hover': {
                  background: 'rgba(85, 107, 47, 0.1)',
                },
              }}
            >
              <ArrowLeft size={20} />
            </IconButton>
          </Box>

          {/* Header */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(139, 188, 143, 0.2) 0%, rgba(85, 107, 47, 0.1) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <Key size={32} color="#8FBC8F" />
            </Box>

            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Přihlášení testera
            </Typography>

            <Typography variant="body1" color="text.secondary" align="center">
              Zadejte svůj access kód, který jste obdržela při registraci
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: BORDER_RADIUS.compact }}
            >
              {error}
            </Alert>
          )}

          {/* Google OAuth Sign In */}
          <GoogleSignInButton
            variant="contained"
            redirectTo="/?intent=tester"
            buttonText="Přihlásit se přes Google"
            showDivider={false}
          />

          {/* Divider */}
          <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
            <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
            <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
              nebo pomocí access kódu
            </Typography>
            <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Access Kód"
              fullWidth
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              placeholder="Např. TEST-A1B2"
              disabled={loading}
              autoFocus
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: BORDER_RADIUS.compact,
                }
              }}
              inputProps={{
                style: {
                  textTransform: 'uppercase',
                  fontFamily: 'monospace',
                  letterSpacing: '2px',
                  fontSize: '1.1rem',
                }
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading || !accessCode.trim()}
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowRight size={20} />}
              sx={{
                borderRadius: BORDER_RADIUS.button,
                py: 1.5,
              }}
            >
              {loading ? 'Přihlašuji...' : 'Přihlásit se'}
            </Button>
          </form>

          {/* Footer Links */}
          <Box mt={3} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Ještě nemáte access kód?{' '}
              <Link href="/tester/signup" underline="hover" sx={{ fontWeight: 600 }}>
                Zaregistrujte se
              </Link>
            </Typography>
          </Box>

          {/* Help */}
          <Alert
            severity="info"
            sx={{ mt: 3, borderRadius: BORDER_RADIUS.compact }}
          >
            💡 <strong>Tip:</strong> Access kód by měl být v emailu, který jste obdržela po registraci.
            Pokud ho nemůžete najít, kontaktujte {' '}
            <Link href="mailto:lenna@online-byznys.cz" sx={{ fontWeight: 600 }}>
              lenna@online-byznys.cz
            </Link>
          </Alert>
        </CardContent>
      </Card>
    </Container>
  );
};

export default TesterLogin;
