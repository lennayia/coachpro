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
} from '@mui/material';
import { Shield, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setCurrentUser } from '../utils/storage';
import { useNotification } from '@shared/context/NotificationContext';
import BORDER_RADIUS from '@styles/borderRadius';
import { useGlassCard } from '@shared/hooks/useModernEffects';

const ADMIN_PASSWORD = 'lenna2025'; // TODO: Move to env variable in production

const AdminLogin = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const glassCardStyles = useGlassCard('subtle');

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Vyplň prosím heslo');
      showError('Chyba', 'Heslo je povinné');
      return;
    }

    if (password !== ADMIN_PASSWORD) {
      setError('Nesprávné heslo');
      showError('Chyba', 'Nesprávné heslo');
      return;
    }

    // Create admin session
    const adminUser = {
      id: 'admin-lenna',
      name: 'Lenka Roubalová',
      email: 'lenkaroubalka@gmail.com',
      isAdmin: true,
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(adminUser);
    showSuccess('Vítej zpět! 🎉', 'Admin přihlášení úspěšné');
    navigate('/coach/dashboard');
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
              label="Heslo"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
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
              disabled={!password.trim()}
              endIcon={<ArrowRight size={20} />}
              sx={{
                borderRadius: BORDER_RADIUS.button,
                py: 1.5,
              }}
            >
              Přihlásit se
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
