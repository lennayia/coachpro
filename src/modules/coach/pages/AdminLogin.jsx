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
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Shield, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@shared/config/supabase';
import { setCurrentUser } from '../utils/storage';
import { useNotification } from '@shared/context/NotificationContext';
import BORDER_RADIUS from '@styles/borderRadius';
import { useGlassCard } from '@shared/hooks/useModernEffects';

const ADMIN_EMAIL = 'lenna@online-byznys.cz';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const glassCardStyles = useGlassCard('subtle');

  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Vyplň email a heslo');
      showError('Chyba', 'Email a heslo jsou povinné');
      return;
    }

    if (email.trim() !== ADMIN_EMAIL) {
      setError('Nesprávný email. Admin = lenna@online-byznys.cz');
      showError('Chyba', 'Nesprávný email');
      return;
    }

    setLoading(true);

    try {
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('Nesprávné heslo');
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Přihlášení selhalo - žádný uživatel');
      }

      // Debug: Check if session exists
      console.log('🔵 Auth successful, session:', authData.session);
      console.log('🔵 User:', authData.user.email);

      // Find existing coach record to get correct ID (data is linked to this ID!)
      const { data: existingCoach } = await supabase
        .from('coachpro_coaches')
        .select('id, name')
        .eq('email', ADMIN_EMAIL)
        .single();

      // Create admin user object using existing coach ID (not auth.user.id!)
      const adminUser = {
        id: existingCoach?.id || authData.user.id, // Use existing coach ID if found
        name: existingCoach?.name || 'Lenka Roubalová',
        email: ADMIN_EMAIL,
        isAdmin: true,
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage (for getCurrentUser())
      setCurrentUser(adminUser);

      // Note: Admin already exists in coachpro_coaches, no need to update on every login

      showSuccess('Vítej zpět! 🎉', 'Přihlášena jako admin');
      navigate('/coach/dashboard');
    } catch (err) {
      console.error('Admin login error:', err);
      setError(err.message || 'Přihlášení selhalo');
      showError('Chyba', err.message || 'Přihlášení selhalo');
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
              <Shield size={32} color="#8FBC8F" />
            </Box>

            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Admin přihlášení
            </Typography>

            <Typography variant="body2" color="text.secondary" align="center">
              Vítej zpět, Lenko! 👋
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

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              disabled={loading}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: BORDER_RADIUS.compact,
                }
              }}
            />

            <TextField
              label="Heslo"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: BORDER_RADIUS.compact,
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading || !email.trim() || !password.trim()}
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowRight size={20} />}
              sx={{
                borderRadius: BORDER_RADIUS.button,
                py: 1.5,
              }}
            >
              {loading ? 'Přihlašuji...' : 'Přihlásit se'}
            </Button>
          </form>

          {/* Info */}
          <Alert
            severity="info"
            sx={{ mt: 3, borderRadius: BORDER_RADIUS.compact }}
          >
            🔒 Toto je administrátorské rozhraní s plným přístupem ke všem funkcím.
          </Alert>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdminLogin;
