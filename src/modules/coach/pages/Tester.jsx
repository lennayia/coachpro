import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Alert,
  Checkbox,
  FormControlLabel,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { fadeIn, fadeInUp } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import { supabase } from '@shared/config/supabase';
import { useNotification } from '@shared/context/NotificationContext';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import { useTheme } from '@mui/material';
import GoogleSignInButton from '@shared/components/GoogleSignInButton';
import { useTesterAuth } from '@shared/context/TesterAuthContext';
import { setCurrentUser, saveCoach, getCoachById } from '../utils/storage';

const Tester = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const theme = useTheme();
  const glassCardStyles = useGlassCard('subtle');
  const { user, profile, loading: authLoading } = useTesterAuth();

  // Auto-redirect if already authenticated with profile
  useEffect(() => {
    if (!authLoading && user && profile) {
      navigate('/coach/dashboard');
    }
  }, [authLoading, user, profile, navigate]);

  // Access code login state
  const [accessCode, setAccessCode] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);

  // Signup form state
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  // Common state
  const [error, setError] = useState('');

  // Generate access code (format: TEST-XXXX)
  const generateAccessCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'TEST-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Handle access code login
  const handleCodeLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!accessCode.trim()) {
      setError('Vyplňte, prosím, access kód');
      return;
    }

    setCodeLoading(true);

    try {
      const { data: tester, error: supabaseError } = await supabase
        .from('testers')
        .select('*')
        .eq('access_code', accessCode.trim().toUpperCase())
        .maybeSingle();

      if (supabaseError) {
        console.error('Error looking up access code:', supabaseError);
        setError('Chyba při ověřování kódu. Zkuste to prosím znovu.');
        setCodeLoading(false);
        return;
      }

      if (!tester) {
        setError('Access kód nebyl nalezen. Zkontrolujte, prosím, že jste zadala správný kód.');
        setCodeLoading(false);
        return;
      }

      // Check if coach already exists in DB (to preserve is_admin and auth_user_id)
      const existingCoach = await getCoachById(`tester-${tester.id}`);

      // Check if tester has an auth account by email
      let authUserId = existingCoach?.auth_user_id || null;
      if (!authUserId && tester.email) {
        const { data: authUser } = await supabase
          .from('auth.users')
          .select('id')
          .eq('email', tester.email)
          .maybeSingle();
        authUserId = authUser?.id || null;
      }

      // Create coach session
      const coachUser = {
        id: `tester-${tester.id}`,
        auth_user_id: authUserId,
        name: tester.name,
        email: tester.email,
        isTester: true,
        testerId: tester.id,
        // SECURITY: Preserve is_admin if coach already exists
        isAdmin: existingCoach?.is_admin || false,
        createdAt: existingCoach?.created_at || new Date().toISOString(),
      };

      // Save coach to Supabase
      await saveCoach(coachUser);
      setCurrentUser(coachUser);

      showSuccess('Přihlášení úspěšné! 🎉', `Vítejte zpátky, ${tester.name}`);
      navigate('/coach/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Něco se pokazilo. Zkuste to, prosím, znovu.');
    } finally {
      setCodeLoading(false);
    }
  };

  // Validate signup form
  const validateSignupForm = () => {
    if (!firstName.trim()) {
      setError('Vyplň prosím své křestní jméno');
      return false;
    }
    if (!lastName.trim()) {
      setError('Vyplň prosím své příjmení');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Vyplň prosím platný email');
      return false;
    }
    if (!termsAccepted) {
      setError('Pro pokračování musíš souhlasit s podmínkami testování');
      return false;
    }
    return true;
  };

  // Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateSignupForm()) {
      return;
    }

    setSignupLoading(true);

    try {
      const code = generateAccessCode();

      // Get IP address (optional)
      let ipAddress = null;
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        ipAddress = ipData.ip;
      } catch (error) {
        console.warn('Could not fetch IP address:', error);
      }

      // Insert into Supabase
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      const { data: tester, error: supabaseError } = await supabase
        .from('testers')
        .insert([
          {
            name: fullName,
            email: email.trim().toLowerCase(),
            phone: phone.trim() || null,
            reason: reason.trim() || null,
            access_code: code,
            marketing_consent: marketingConsent,
            marketing_consent_date: marketingConsent ? new Date().toISOString() : null,
            terms_accepted: termsAccepted,
            terms_accepted_date: new Date().toISOString(),
            ip_address: ipAddress,
            user_agent: navigator.userAgent,
          },
        ])
        .select()
        .single();

      if (supabaseError) {
        if (supabaseError.code === '23505') {
          throw new Error('Tento email je již registrován. Pokud jsi ztratila svůj access code, kontaktuj nás.');
        }
        throw supabaseError;
      }

      // Send access code email
      try {
        const emailResponse = await fetch('/api/send-access-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            name: firstName.trim(),
            accessCode: code,
          }),
        });

        if (!emailResponse.ok) {
          console.error('Failed to send email:', await emailResponse.text());
          showError('Upozornění', 'Registrace proběhla, ale email se nepodařilo odeslat. Ulož si access code!');
        }
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }

      setGeneratedCode(code);
      setSuccess(true);
      showSuccess('Registrace úspěšná!', `Tvůj access code: ${code}`);
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Něco se pokazilo. Zkus to prosím znovu.');
    } finally {
      setSignupLoading(false);
    }
  };

  // Success view after signup
  if (success) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, #0a0f0a 0%, #1a2410 100%)`
              : `linear-gradient(135deg, #e8ede5 0%, #d4ddd0 100%)`,
          p: 2,
        }}
      >
        <Card sx={{ maxWidth: 500, borderRadius: BORDER_RADIUS.card, textAlign: 'center', p: 4 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'rgba(139, 188, 143, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <CheckCircle size={48} color="#8FBC8F" />
          </Box>

          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Vítej v beta testu! 🎉
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={3}>
            Tvůj access code pro přihlášení:
          </Typography>

          <Box
            sx={{
              p: 2,
              backgroundColor: 'rgba(139, 188, 143, 0.1)',
              borderRadius: BORDER_RADIUS.compact,
              mb: 3,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontFamily: 'monospace',
                letterSpacing: '2px',
                color: 'primary.main',
              }}
            >
              {generatedCode}
            </Typography>
          </Box>

          <Alert severity="success" sx={{ mb: 3, borderRadius: BORDER_RADIUS.compact }}>
            📧 <strong>Email byl odeslán!</strong> Zkontroluj si schránku na <strong>{email}</strong>.
          </Alert>

          <Alert severity="info" sx={{ mb: 3, borderRadius: BORDER_RADIUS.compact }}>
            💡 Pokud email neuvidíš do 5 minut, zkontroluj SPAM nebo nám napiš na lenna@online-byznys.cz
          </Alert>

          <Button
            variant="contained"
            size="large"
            onClick={() => {
              setSuccess(false);
              setAccessCode(generatedCode);
            }}
            fullWidth
            sx={{ borderRadius: BORDER_RADIUS.button }}
          >
            Přihlásit se s tímto kódem
          </Button>
        </Card>
      </Box>
    );
  }

  // Main view
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
        style={{ width: '100%', maxWidth: 500 }}
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
                  Beta test CoachPro
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {showSignupForm ? 'Registrace testera' : 'Přihlášení testera'}
                </Typography>
              </Box>
            </motion.div>

            {/* Error */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {!showSignupForm ? (
              <>
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
                    buttonText="Pokračovat s Google"
                    showSuccessToast={false}
                    onError={(err, errorMsg) => setError(errorMsg)}
                  />
                </motion.div>

                {/* Divider */}
                <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
                  <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
                  <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
                    nebo pomocí access kódu
                  </Typography>
                  <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
                </Box>

                {/* Access Code Login */}
                <form onSubmit={handleCodeLogin}>
                  <TextField
                    label="Access Kód"
                    fullWidth
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    placeholder="Např. TEST-A1B2"
                    disabled={codeLoading}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: BORDER_RADIUS.compact,
                      },
                    }}
                    inputProps={{
                      style: {
                        textTransform: 'uppercase',
                        fontFamily: 'monospace',
                        letterSpacing: '2px',
                        fontSize: '1.1rem',
                      },
                    }}
                  />

                  <Alert severity="info" sx={{ mb: 3, borderRadius: BORDER_RADIUS.compact }}>
                    💡 <strong>Tip:</strong> Access kód by měl být v emailu, který jste obdržela po registraci.
                    Pokud ho nemůžete najít, kontaktujte {' '}
                    <Link href="mailto:lenna@online-byznys.cz" sx={{ fontWeight: 600 }}>
                      lenna@online-byznys.cz
                    </Link>
                  </Alert>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={codeLoading || !accessCode.trim()}
                    endIcon={codeLoading ? <CircularProgress size={20} color="inherit" /> : <ArrowRight size={20} />}
                    sx={{
                      borderRadius: BORDER_RADIUS.button,
                      py: 1.5,
                      mb: 3,
                    }}
                  >
                    {codeLoading ? 'Přihlašuji...' : 'Přihlásit se'}
                  </Button>
                </form>

                {/* Toggle to Signup */}
                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Ještě nemáš access kód?
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => setShowSignupForm(true)}
                    sx={{ borderRadius: BORDER_RADIUS.button }}
                  >
                    Zaregistruj se
                  </Button>
                </Box>
              </>
            ) : (
              <>
                {/* Signup Form */}
                <form onSubmit={handleSignup}>
                  <TextField
                    label="Křestní jméno *"
                    fullWidth
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    sx={{ mb: 2 }}
                    disabled={signupLoading}
                  />

                  <TextField
                    label="Příjmení *"
                    fullWidth
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    sx={{ mb: 2 }}
                    disabled={signupLoading}
                  />

                  <TextField
                    label="Email *"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2 }}
                    disabled={signupLoading}
                  />

                  <TextField
                    label="Telefon (volitelné)"
                    fullWidth
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    sx={{ mb: 2 }}
                    disabled={signupLoading}
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField
                    label="Proč chceš testovat CoachPro? (volitelné)"
                    fullWidth
                    multiline
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    sx={{ mb: 3 }}
                    disabled={signupLoading}
                    InputLabelProps={{ shrink: true }}
                  />

                  {/* GDPR Consent */}
                  <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          disabled={signupLoading}
                        />
                      }
                      label={
                        <Typography variant="body2">
                          Souhlasím se{' '}
                          <Link href="/privacy-policy" target="_blank" underline="hover">
                            zpracováním osobních údajů
                          </Link>{' '}
                          pro účely beta testování *
                        </Typography>
                      }
                    />
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={marketingConsent}
                          onChange={(e) => setMarketingConsent(e.target.checked)}
                          disabled={signupLoading}
                        />
                      }
                      label={
                        <Typography variant="body2">
                          Souhlasím se zasíláním novinek, tipů a nabídek týkajících se CoachPro (volitelné)
                        </Typography>
                      }
                    />
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={signupLoading}
                    sx={{
                      borderRadius: BORDER_RADIUS.button,
                      py: 1.5,
                      mb: 2,
                    }}
                  >
                    {signupLoading ? <CircularProgress size={24} color="inherit" /> : 'Zaregistrovat se'}
                  </Button>

                  {/* Back to Login */}
                  <Box textAlign="center">
                    <Button
                      variant="text"
                      onClick={() => setShowSignupForm(false)}
                      sx={{ textTransform: 'none' }}
                    >
                      ← Zpět na přihlášení
                    </Button>
                  </Box>
                </form>
              </>
            )}
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Tester;
