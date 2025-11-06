import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { supabase } from '@shared/config/supabase';

/**
 * Smart Root Redirect Component
 *
 * Handles OAuth callback and routes users to correct destination based on:
 * - Authentication state (OAuth session)
 * - User role (client, coach, tester)
 * - Profile completion status
 * - Subscription status (future: payment checks)
 *
 * Flow:
 * 1. Check if user is authenticated (OAuth session)
 * 2. Load user profile from database
 * 3. Determine role and redirect accordingly
 * 4. Fallback to tester signup if no auth
 */
const RootRedirect = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        // 1. Check OAuth session
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        // No OAuth session → default signup flow
        if (authError || !user) {
          console.log('No OAuth session, redirecting to tester signup');
          navigate('/tester/signup', { replace: true });
          return;
        }

        console.log('OAuth user found:', user.id);

        // 2. Check if user is a CLIENT (has profile in coachpro_client_profiles)
        const { data: clientProfile, error: clientError } = await supabase
          .from('coachpro_client_profiles')
          .select('*')
          .eq('auth_user_id', user.id)
          .single();

        if (clientProfile && !clientError) {
          console.log('Client profile found:', clientProfile);

          // Check if profile is completed
          const hasName = clientProfile.name && clientProfile.name.trim();
          const hasEmail = clientProfile.email && clientProfile.email.trim();

          if (!hasName || !hasEmail) {
            // Profile incomplete → finish profile
            console.log('Profile incomplete, redirecting to profile form');
            navigate('/client/profile', { replace: true });
            return;
          }

          // Profile complete → welcome page
          console.log('Profile complete, redirecting to welcome');
          navigate('/client/welcome', { replace: true });
          return;
        }

        // 3. Check if user is a COACH (future: coachpro_coaches table)
        // TODO: When OAuth for coaches is implemented, check coachpro_coaches table
        // const { data: coachProfile } = await supabase
        //   .from('coachpro_coaches')
        //   .select('*')
        //   .eq('auth_user_id', user.id)
        //   .single();
        //
        // if (coachProfile) {
        //   navigate('/coach/dashboard', { replace: true });
        //   return;
        // }

        // 4. User has OAuth but no profile → new client signup
        // This happens when:
        // - User signs in with Google for first time
        // - User needs to create client profile
        console.log('OAuth user without profile, redirecting to client profile creation');
        navigate('/client/profile', { replace: true });

      } catch (error) {
        console.error('Error in root redirect:', error);
        // On error, fallback to tester signup
        navigate('/tester/signup', { replace: true });
      } finally {
        setChecking(false);
      }
    };

    checkAuthAndRedirect();
  }, [navigate]);

  // Show loading spinner while checking
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0a0f0a 0%, #1a2410 100%)'
            : 'linear-gradient(135deg, #e8ede5 0%, #d4ddd0 100%)',
      }}
    >
      <CircularProgress
        size={48}
        sx={{
          color: (theme) =>
            theme.palette.mode === 'dark' ? '#8FBC8F' : '#556B2F',
        }}
      />
    </Box>
  );
};

export default RootRedirect;
