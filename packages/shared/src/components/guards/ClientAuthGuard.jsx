import GenericAuthGuard from './GenericAuthGuard.jsx';

/**
 * Client authentication guard component
 * Protects routes that require client authentication
 *
 * @param {object} props
 * @param {function} props.useAuth - Auth hook from createClientAuthContext (REQUIRED)
 * @param {React.ReactNode} props.children - Protected content
 * @param {boolean} props.requireProfile - Whether profile is required (default: true)
 * @param {string} props.redirectOnNoAuth - Where to redirect if not authenticated
 * @param {string} props.redirectOnNoProfile - Where to redirect if no profile
 * @param {boolean} props.showError - Whether to show error notification
 *
 * @example
 * // In CoachPro:
 * import { createClientAuthContext } from '@proapp/shared/context';
 * import { ClientAuthGuard } from '@proapp/shared/components';
 * import { supabase } from '@/config/supabase';
 *
 * const { useClientAuth } = createClientAuthContext({
 *   supabaseClient: supabase,
 *   tableName: 'coachpro_client_profiles',
 * });
 *
 * <ClientAuthGuard useAuth={useClientAuth}>
 *   <ClientDashboard />
 * </ClientAuthGuard>
 */
const ClientAuthGuard = ({
  useAuth,
  children,
  requireProfile = true,
  redirectOnNoAuth = '/client',
  redirectOnNoProfile = '/client',
  showError = true,
}) => {
  if (!useAuth) {
    throw new Error('ClientAuthGuard: useAuth prop is required. Pass the useAuth hook from createClientAuthContext.');
  }

  const auth = useAuth();

  return (
    <GenericAuthGuard
      auth={auth}
      requireProfile={requireProfile}
      redirectOnNoAuth={redirectOnNoAuth}
      redirectOnNoProfile={redirectOnNoProfile}
      showError={showError}
    >
      {children}
    </GenericAuthGuard>
  );
};

export default ClientAuthGuard;
