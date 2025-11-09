import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useNotification } from '@shared/context/NotificationContext';
import { loadFromStorage, STORAGE_KEYS } from '../../modules/coach/utils/storage';

/**
 * Generic authentication guard component
 * Protects routes that require authentication and/or profile
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Content to render when authenticated
 * @param {object} props.auth - Auth context object { user, profile, loading }
 * @param {boolean} props.requireProfile - Whether profile is required (default: true)
 * @param {boolean} props.allowLocalStorageFallback - Allow localStorage session as fallback (default: false)
 * @param {string} props.redirectOnNoAuth - Where to redirect if not authenticated (default: '/client')
 * @param {string} props.redirectOnNoProfile - Where to redirect if no profile (default: '/client')
 * @param {boolean} props.showError - Whether to show error notification on redirect (default: true)
 */
const GenericAuthGuard = ({
  children,
  auth,
  requireProfile = true,
  allowLocalStorageFallback = false,
  redirectOnNoAuth = '/client',
  redirectOnNoProfile = '/client',
  showError: showErrorProp = true,
}) => {
  const navigate = useNavigate();
  const { showError } = useNotification();
  const { user, profile, loading } = auth;

  useEffect(() => {
    if (loading) return;

    const currentUser = allowLocalStorageFallback ? loadFromStorage(STORAGE_KEYS.CURRENT_USER) : null;

    // Not authenticated (no OAuth AND no localStorage session)
    if (!user && !currentUser) {
      if (showErrorProp) {
        showError('Nepřihlášen', 'Nejste přihlášen. Přesměrovávám...');
      }
      navigate(redirectOnNoAuth);
      return;
    }

    // For OAuth users: check if profile is required
    if (user && requireProfile && !profile && !currentUser) {
      if (showErrorProp) {
        showError('Chybí profil', 'Nejprve si vyplňte profil.');
      }
      navigate(redirectOnNoProfile);
    }
  }, [loading, user, profile, requireProfile, navigate, redirectOnNoAuth, redirectOnNoProfile, showError, showErrorProp, allowLocalStorageFallback]);

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
  const currentUser = allowLocalStorageFallback ? loadFromStorage(STORAGE_KEYS.CURRENT_USER) : null;

  if (!user && !currentUser) {
    return null; // Will redirect in useEffect
  }

  if (user && requireProfile && !profile && !currentUser) {
    return null; // Will redirect in useEffect
  }

  // Render protected content
  return <>{children}</>;
};

export default GenericAuthGuard;
