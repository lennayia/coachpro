import { useTesterAuth } from '@shared/context/TesterAuthContext';
import GenericAuthGuard from './GenericAuthGuard';

/**
 * Tester authentication guard component
 * Protects routes that require tester authentication
 *
 * Supports:
 * - OAuth authentication (Google Sign-In)
 * - LocalStorage session fallback (for admins who log in via Supabase Auth)
 */
const TesterAuthGuard = ({
  children,
  requireProfile = true,
  redirectOnNoAuth = '/tester',
  redirectOnNoProfile = '/tester/profile',
  showError = true,
}) => {
  const auth = useTesterAuth();

  return (
    <GenericAuthGuard
      auth={auth}
      requireProfile={requireProfile}
      allowLocalStorageFallback={true} // Allow admin login via localStorage
      redirectOnNoAuth={redirectOnNoAuth}
      redirectOnNoProfile={redirectOnNoProfile}
      showError={showError}
    >
      {children}
    </GenericAuthGuard>
  );
};

export default TesterAuthGuard;
