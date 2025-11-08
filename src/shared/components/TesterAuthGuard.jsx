import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useTesterAuth } from '@shared/context/TesterAuthContext';
import { useNotification } from '@shared/context/NotificationContext';

/**
 * Tester authentication guard component
 * Protects routes that require authentication and/or profile
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Content to render when authenticated
 * @param {boolean} props.requireProfile - Whether profile is required (default: true)
 * @param {string} props.redirectOnNoAuth - Where to redirect if not authenticated (default: '/tester/signup')
 * @param {string} props.redirectOnNoProfile - Where to redirect if no profile (default: '/tester/profile')
 * @param {boolean} props.showError - Whether to show error notification on redirect (default: true)
 */
const TesterAuthGuard = ({
  children,
  requireProfile = true,
  redirectOnNoAuth = '/tester/signup',
  redirectOnNoProfile = '/tester/profile',
  showError: showErrorProp = true,
}) => {
  const navigate = useNavigate();
  const { showError } = useNotification();
  const { user, profile, loading } = useTesterAuth();

  useEffect(() => {
    if (!loading) {
      // Not authenticated
      if (!user) {
        if (showErrorProp) {
          showError('Nepřihlášen', 'Nejste přihlášen. Přesměrovávám...');
        }
        navigate(redirectOnNoAuth);
        return;
      }

      // No profile (if required)
      if (requireProfile && !profile) {
        if (showErrorProp) {
          showError('Chybí profil', 'Nejprve si vyplňte profil.');
        }
        navigate(redirectOnNoProfile);
        return;
      }
    }
  }, [loading, user, profile, requireProfile, navigate, redirectOnNoAuth, redirectOnNoProfile, showError, showErrorProp]);

  // Show loading state
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

  // Check auth before rendering
  if (!user || (requireProfile && !profile)) {
    return null; // Will redirect in useEffect
  }

  // Render protected content
  return <>{children}</>;
};

export default TesterAuthGuard;
