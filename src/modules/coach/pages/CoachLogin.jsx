import { useState, useEffect } from 'react';
import { Box, Card, Typography, TextField, Button, Alert, CircularProgress, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { fadeIn, fadeInUp } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import { supabase } from '@shared/config/supabase';
import { useNotification } from '@shared/context/NotificationContext';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import GoogleSignInButton from '@shared/components/GoogleSignInButton';
import { useTesterAuth } from '@shared/context/TesterAuthContext';

const CoachLogin = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const glassCardStyles = useGlassCard('subtle');
  const { user, profile, loading: authLoading } = useTesterAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [showMagicLink, setShowMagicLink] = useState(false);

  // Auto-redirect if already authenticated with profile
  useEffect(() => {
    if (!authLoading && user && profile) {
      navigate('/coach/dashboard');
    }
  }, [authLoading, user, profile, navigate]);

  // Handle magic link
  const handleMagicLink = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Vyplň prosím email');
      return;
    }

    setLoading(true);

    try {
      const { error: magicLinkError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: window.location.origin + '/coach/dashboard',
        },
      });

      if (magicLinkError) {
        throw new Error(magicLinkError.message);
      }

      setMagicLinkSent(true);
      showSuccess('Email odeslán! 📧', 'Zkontroluj si schránku a klikni na přihlašovací link.');
    } catch (err) {
      setError(err.message || 'Něco se pokazilo. Zkus to prosím znovu.');
      showError('Chyba při odesílání emailu', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Vyplň prosím email');
      return;
    }

    if (!password) {
      setError('Vyplň prosím heslo');
      return;
    }

    setLoading(true);

    try {
      // Sign in with email + password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (signInError) {
        if (signInError.message?.includes('Invalid login credentials')) {
          throw new Error('Nesprávný email nebo heslo');
        }
        if (signInError.message?.includes('Email not confirmed')) {
          throw new Error('Prosím potvrď svůj email. Zkontroluj si schránku.');
        }
        throw new Error(signInError.message);
      }

      if (!data.user) {
        throw new Error('Nepodařilo se přihlásit. Zkus to prosím znovu.');
      }

      showSuccess('Přihlášení úspěšné! 🎉', 'Vítej zpátky!');

      // Navigate will happen automatically via TesterAuthContext
      // when it detects the auth session
      navigate('/coach/dashboard');
    } catch (err) {
      setError(err.message || 'Něco se pokazilo. Zkus to prosím znovu.');
      showError('Chyba při přihlášení', err.message);
    } finally {
      setLoading(false);
    }
  };

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
        style={{ width: '100%', maxWidth: 450 }}
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

            {/* Logo */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              <Box textAlign="center" mb={4}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <img
                    src="/coachPro.png"
                    alt="CoachPro"
                    style={{
                      height: '80px',
                      width: 'auto',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </Box>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Přihlášení
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Vítej zpátky v CoachPro!
                </Typography>
              </Box>
            </motion.div>

            {/* Error */}
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: BORDER_RADIUS.compact }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Google OAuth Sign In */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <GoogleSignInButton
                variant="contained"
                redirectTo="/?intent=tester"
                showDivider={false}
                buttonText="Přihlásit se přes Google"
                showSuccessToast={false}
                onError={(err, errorMsg) => setError(errorMsg)}
              />
            </motion.div>

            {/* Divider */}
            <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
              <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
              <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
                nebo pomocí emailu
              </Typography>
              <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
            </Box>

            {/* Success - Magic Link Sent */}
            {magicLinkSent ? (
              <Alert severity="success" sx={{ borderRadius: BORDER_RADIUS.compact }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Email odeslán!</strong>
                </Typography>
                <Typography variant="body2">
                  Zkontroluj si schránku na <strong>{email}</strong> a klikni na přihlašovací link.
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontSize: '0.875rem', color: 'text.secondary' }}>
                  Pokud email neuvidíš, zkontroluj SPAM složku.
                </Typography>
              </Alert>
            ) : (
              <>
                {/* Toggle between password and magic link */}
                {showMagicLink ? (
                  /* Magic Link Form */
                  <form onSubmit={handleMagicLink}>
                    <TextField
                      label="Email"
                      type="email"
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      autoComplete="email"
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: BORDER_RADIUS.compact,
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={loading}
                      endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowRight size={20} />}
                      sx={{
                        borderRadius: BORDER_RADIUS.button,
                        py: 1.5,
                        mb: 2,
                      }}
                    >
                      {loading ? 'Odesílám...' : 'Poslat přihlašovací link'}
                    </Button>

                    <Button
                      variant="text"
                      fullWidth
                      onClick={() => setShowMagicLink(false)}
                      disabled={loading}
                      sx={{ textTransform: 'none' }}
                    >
                      ← Zpět na přihlášení s heslem
                    </Button>
                  </form>
                ) : (
                  /* Password Login Form */
                  <form onSubmit={handleLogin}>
                    <TextField
                      label="Email"
                      type="email"
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      autoComplete="email"
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: BORDER_RADIUS.compact,
                        },
                      }}
                    />

                    <TextField
                      label="Heslo"
                      type="password"
                      fullWidth
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      autoComplete="current-password"
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: BORDER_RADIUS.compact,
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={loading}
                      endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowRight size={20} />}
                      sx={{
                        borderRadius: BORDER_RADIUS.button,
                        py: 1.5,
                        mb: 2,
                      }}
                    >
                      {loading ? 'Přihlašuji...' : 'Přihlásit se'}
                    </Button>

                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => setShowMagicLink(true)}
                      disabled={loading}
                      sx={{
                        borderRadius: BORDER_RADIUS.button,
                        mb: 2,
                        textTransform: 'none',
                      }}
                    >
                      Nebo přihlásit bez hesla (email link)
                    </Button>
                  </form>
                )}
              </>
            )}

            {/* Forgot password */}
            <Box textAlign="center" mb={2}>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: 'primary.main',
                  },
                }}
                onClick={() => navigate('/forgot-password')}
              >
                Zapomněla jsi heslo?
              </Typography>
            </Box>

            {/* Sign up link */}
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Ještě nemáš účet?{' '}
                <Typography
                  component="span"
                  variant="body2"
                  sx={{
                    color: 'primary.main',
                    cursor: 'pointer',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                  onClick={() => navigate('/tester')}
                >
                  Zaregistruj se
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
};

export default CoachLogin;
