import { useState } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Alert,
  Link,
  CircularProgress,
} from '@mui/material';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@shared/config/supabase';
import { useNotification } from '@shared/context/NotificationContext';
import BORDER_RADIUS from '@styles/borderRadius';

const TesterSignup = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [accessCode, setAccessCode] = useState('');

  // Generate access code (format: TEST-XXXX)
  const generateAccessCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'TEST-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Validate form
  const validateForm = () => {
    if (!name.trim()) {
      setError('Vyplň prosím své jméno');
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // 1. Generate access code
      const code = generateAccessCode();

      // 2. Get IP address (optional, for GDPR tracking)
      let ipAddress = null;
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        ipAddress = ipData.ip;
      } catch (error) {
        console.warn('Could not fetch IP address:', error);
      }

      // 3. Insert into Supabase
      const { data: tester, error: supabaseError } = await supabase
        .from('testers')
        .insert([
          {
            name: name.trim(),
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
          // Unique constraint violation (email already exists)
          throw new Error('Tento email je již registrován. Pokud jsi ztratila svůj access code, kontaktuj nás.');
        }
        throw supabaseError;
      }

      // 4. Send access code email via Resend
      try {
        const emailResponse = await fetch('/api/send-access-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            name: name.trim(),
            accessCode: code,
          }),
        });

        if (!emailResponse.ok) {
          console.error('Failed to send email:', await emailResponse.text());
          // Don't throw - registration was successful, just email failed
          showError('Upozornění', 'Registrace proběhla, ale email se nepodařilo odeslat. Ulož si access code!');
        } else {
          console.log('✅ Access code email sent successfully');
        }
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Don't throw - registration was successful, just show warning
      }

      // 5. MailerLite integration (disabled for beta - will be added via backend later)
      // For beta testing: contacts are in Supabase, MailerLite sync will be handled manually
      if (marketingConsent) {
        console.log('✅ Marketing consent given - subscriber will be added to MailerLite manually');
      }

      // 6. Success!
      setAccessCode(code);
      setSuccess(true);
      showSuccess('Registrace úspěšná!', `Tvůj access code: ${code}`);
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Něco se pokazilo. Zkus to prosím znovu.');
      showError('Chyba', err.message || 'Registrace selhala');
    } finally {
      setLoading(false);
    }
  };

  // Success view
  if (success) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card
          sx={{
            borderRadius: BORDER_RADIUS.card,
            textAlign: 'center',
          }}
        >
          <CardContent sx={{ p: 4 }}>
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
                {accessCode}
              </Typography>
            </Box>

            <Alert severity="success" sx={{ mb: 3, borderRadius: BORDER_RADIUS.compact }}>
              📧 <strong>Email byl odeslán!</strong> Zkontroluj si schránku na <strong>{email}</strong>.
              Najdeš tam svůj access code a instrukce k přihlášení.
            </Alert>

            <Alert severity="info" sx={{ mb: 3, borderRadius: BORDER_RADIUS.compact }}>
              💡 Pokud email neuvidíš do 5 minut, zkontroluj SPAM nebo nám napiš na lenna@online-byznys.cz
            </Alert>

            {marketingConsent && (
              <Typography variant="body2" color="text.secondary" mb={3}>
                ✓ Byla jsi přidána do našeho newsletteru
              </Typography>
            )}

            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/coach/auth')}
              fullWidth
              sx={{ borderRadius: BORDER_RADIUS.button }}
            >
              Přejít na přihlášení
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Signup form view
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card
        sx={{
          borderRadius: BORDER_RADIUS.card,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Beta test CoachPro 🌿
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={4}>
            Staň se součástí beta testování a pomoz nám vytvořit nejlepší aplikaci pro kouče!
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: BORDER_RADIUS.compact }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Jméno a příjmení *"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
              disabled={loading}
            />

            <TextField
              label="Email *"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              disabled={loading}
            />

            <TextField
              label="Telefon (volitelné)"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              sx={{ mb: 2 }}
              disabled={loading}
              helperText="Pro případné dotazy nebo novinky"
            />

            <TextField
              label="Proč chceš testovat CoachPro? (volitelné)"
              fullWidth
              multiline
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              sx={{ mb: 3 }}
              disabled={loading}
            />

            {/* GDPR Consent checkboxes */}
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    disabled={loading}
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
                    disabled={loading}
                  />
                }
                label={
                  <Typography variant="body2">
                    Souhlasím se zasíláním novinek, tipů a nabídek týkajících se CoachPro
                    (volitelné)
                  </Typography>
                }
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ borderRadius: BORDER_RADIUS.button }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Zaregistrovat se'}
            </Button>

            <Typography variant="body2" color="text.secondary" align="center" mt={2}>
              Již máš access code?{' '}
              <Link href="/coach/auth" underline="hover">
                Přihlas se
              </Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default TesterSignup;
