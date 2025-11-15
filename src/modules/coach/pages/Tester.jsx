import { useEffect } from 'react';
import { Box, Card, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeIn, fadeInUp } from '@shared/styles/animations';
import { useNotification } from '@shared/context/NotificationContext';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import { useTesterAuth } from '@shared/context/TesterAuthContext';
import { supabase } from '@shared/config/supabase';
import { saveCoach, setCurrentUser } from '../utils/storage';
import RegisterForm from '@shared/components/RegisterForm';
import Breadcrumbs from '@shared/components/Breadcrumbs';

const Tester = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const glassCardStyles = useGlassCard('subtle');
  const { user, profile, loading: authLoading } = useTesterAuth();

  // Auto-redirect if already authenticated with profile
  useEffect(() => {
    if (!authLoading && user && profile) {
      navigate('/coach/dashboard');
    }
  }, [authLoading, user, profile, navigate]);

  // Handle successful registration
  const handleRegistrationSuccess = async (registrationData) => {
    const { authUserId, email, name, phone, marketingConsent, termsAccepted } = registrationData;

    try {
      // Get IP address (optional)
      let ipAddress = null;
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        ipAddress = ipData.ip;
      } catch (error) {
        // IP fetch failed - non-critical, continue
      }

      // Insert into testers table (for tracking/analytics)
      const { data: tester, error: testerError } = await supabase
        .from('testers')
        .insert([
          {
            auth_user_id: authUserId,
            name: name,
            email: email,
            phone: phone,
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

      if (testerError) {
        // Non-critical error - continue with coach record creation
      }

      // Create coach record (is_tester=true)
      const coachId = tester ? `tester-${tester.id}` : `tester-${authUserId}`;
      const { error: coachError } = await supabase.from('coachpro_coaches').insert([
        {
          id: coachId,
          auth_user_id: authUserId,
          name: name,
          email: email,
          phone: phone,
          is_tester: true,
          is_admin: false,
          tester_id: tester?.id || null,
        },
      ]);

      if (coachError) {
        throw new Error('Nepodařilo se dokončit registraci. Zkus to prosím znovu.');
      }

      // Save to localStorage (for compatibility with existing code)
      const coachUser = {
        id: coachId,
        auth_user_id: authUserId,
        name: name,
        email: email,
        phone: phone,
        isTester: true,
        testerId: tester?.id || null,
        isAdmin: false,
        createdAt: new Date().toISOString(),
      };

      await saveCoach(coachUser);
      setCurrentUser(coachUser);

      // Don't navigate - user must confirm email first
      // Success message is shown by RegisterForm
    } catch (err) {
      showError('Chyba při registraci', err.message || 'Něco se pokazilo. Zkus to prosím znovu.');
      throw err;
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
            {/* Breadcrumbs */}
            <Breadcrumbs
              customBreadcrumbs={[
                { label: 'Domů', path: '/' },
                { label: 'Přihlášení', path: '/coach/login' },
                { label: 'Registrace' },
              ]}
            />

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
                  Zaregistruj se a otestuj novou platformu pro koučování
                </Typography>
              </Box>
            </motion.div>

            {/* Registration Form */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <RegisterForm
                onSuccess={handleRegistrationSuccess}
                userType="tester"
                redirectTo="/?intent=tester"
              />
            </motion.div>

            {/* Already have account */}
            <Box textAlign="center" mt={3}>
              <Typography variant="body2" color="text.secondary">
                Už máš účet?{' '}
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
                  onClick={() => navigate('/coach/login')}
                >
                  Přihlas se
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Tester;
