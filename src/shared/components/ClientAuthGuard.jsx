import { useClientAuth } from '@shared/context/ClientAuthContext';
import GenericAuthGuard from './GenericAuthGuard';

/**
 * Client authentication guard component
 * Protects routes that require client authentication
 *
 * Supports:
 * - OAuth authentication (Google Sign-In)
 * - NO localStorage fallback (clients must use OAuth)
 */
const ClientAuthGuard = ({
  children,
  requireProfile = true,
  redirectOnNoAuth = '/client',
  redirectOnNoProfile = '/client',
  showError = true,
}) => {
  const auth = useClientAuth();

  return (
    <GenericAuthGuard
      auth={auth}
      requireProfile={requireProfile}
      allowLocalStorageFallback={false} // Clients must use OAuth
      redirectOnNoAuth={redirectOnNoAuth}
      redirectOnNoProfile={redirectOnNoProfile}
      showError={showError}
    >
      {children}
    </GenericAuthGuard>
  );
};

export default ClientAuthGuard;
