import GenericAuthGuard from './GenericAuthGuard.jsx';

/**
 * Tester authentication guard component
 * Protects routes that require tester authentication
 *
 * @param {object} props
 * @param {function} props.useAuth - Auth hook from createTesterAuthContext (REQUIRED)
 * @param {React.ReactNode} props.children - Protected content
 * @param {boolean} props.requireProfile - Whether profile is required (default: true)
 * @param {string} props.redirectOnNoAuth - Where to redirect if not authenticated
 * @param {string} props.redirectOnNoProfile - Where to redirect if no profile
 * @param {boolean} props.showError - Whether to show error notification
 *
 * @example
 * // In CoachPro:
 * import { createTesterAuthContext } from '@proapp/shared/context';
 * import { TesterAuthGuard } from '@proapp/shared/components';
 * import { supabase } from '@/config/supabase';
 *
 * const { useTesterAuth } = createTesterAuthContext({
 *   supabaseClient: supabase,
 *   tableName: 'testers',
 *   onProfileLoaded: loadCoachSession,
 * });
 *
 * <TesterAuthGuard useAuth={useTesterAuth}>
 *   <TesterDashboard />
 * </TesterAuthGuard>
 */
const TesterAuthGuard = ({
  useAuth,
  children,
  requireProfile = true,
  redirectOnNoAuth = '/tester',
  redirectOnNoProfile = '/tester/profile',
  showError = true,
}) => {
  if (!useAuth) {
    throw new Error('TesterAuthGuard: useAuth prop is required. Pass the useAuth hook from createTesterAuthContext.');
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

export default TesterAuthGuard;
