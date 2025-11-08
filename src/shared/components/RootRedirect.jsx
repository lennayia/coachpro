import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { supabase } from '@shared/config/supabase';
import RoleSelector from './RoleSelector';
import LandingPage from '../../modules/coach/pages/LandingPage';

const RootRedirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const intent = searchParams.get('intent');

        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

        if (authError || !authUser) {
          setShowLanding(true);
          setChecking(false);
          return;
        }

        setUser(authUser);

        const [adminCheck, clientCheck, testerCheck] = await Promise.all([
          supabase.from('coachpro_coaches').select('*').eq('auth_user_id', authUser.id).eq('is_admin', true).maybeSingle(),
          supabase.from('coachpro_client_profiles').select('*').eq('auth_user_id', authUser.id).maybeSingle(),
          supabase.from('testers').select('*').eq('auth_user_id', authUser.id).maybeSingle(),
        ]);

        const roles = [];

        if (adminCheck.data) {
          roles.push('admin');

          const { setCurrentUser } = await import('../../modules/coach/utils/storage');
          setCurrentUser({
            id: adminCheck.data.id,
            auth_user_id: adminCheck.data.auth_user_id,
            name: adminCheck.data.name,
            email: adminCheck.data.email,
            isAdmin: true,
            isTester: adminCheck.data.is_tester || false,
            testerId: adminCheck.data.tester_id || null,
            createdAt: adminCheck.data.created_at,
          });
        }

        if (clientCheck.data) {
          const hasName = clientCheck.data.name && clientCheck.data.name.trim();
          const hasEmail = clientCheck.data.email && clientCheck.data.email.trim();

          if (!hasName || !hasEmail) {
            navigate('/client/profile', { replace: true });
            return;
          }

          roles.push('client');
        }

        if (testerCheck.data) {
          const hasName = testerCheck.data.name && testerCheck.data.name.trim();
          const hasEmail = testerCheck.data.email && testerCheck.data.email.trim();

          if (!hasName || !hasEmail) {
            navigate('/tester/profile', { replace: true });
            return;
          }

          roles.push('tester');
        }

        if (intent) {
          if (intent === 'tester') {
            if (roles.includes('tester')) {
              navigate('/coach/dashboard', { replace: true });
            } else {
              navigate('/tester/profile', { replace: true });
            }
            return;
          }

          if (intent === 'client') {
            if (roles.includes('client')) {
              navigate('/client/welcome', { replace: true });
            } else {
              navigate('/client/profile', { replace: true });
            }
            return;
          }
        }

        if (roles.length === 0) {
          navigate('/client/profile', { replace: true });
          return;
        }

        if (roles.length === 1) {
          const roleMap = {
            admin: '/coach/dashboard',
            client: '/client/welcome',
            tester: '/coach/dashboard',
          };

          navigate(roleMap[roles[0]], { replace: true });
          return;
        }

        setAvailableRoles(roles);
        setShowRoleSelector(true);
        setChecking(false);

      } catch (error) {
        setShowLanding(true);
        setChecking(false);
      }
    };

    checkAuthAndRedirect();
  }, [navigate, searchParams]);

  if (showLanding) {
    return <LandingPage />;
  }

  if (showRoleSelector) {
    return <RoleSelector availableRoles={availableRoles} user={user} />;
  }

  if (checking && !showLanding && !showRoleSelector) {
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
            color: (theme) => theme.palette.mode === 'dark' ? '#8FBC8F' : '#556B2F',
          }}
        />
      </Box>
    );
  }

  return null;
};

export default RootRedirect;
