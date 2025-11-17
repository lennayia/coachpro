import { createAuthContext } from './GenericAuthContext.jsx';

/**
 * Factory function to create Client Auth Context
 * Module must provide supabaseClient and optional callbacks
 *
 * @param {object} config - Configuration object
 * @param {object} config.supabaseClient - Supabase client instance
 * @param {string} config.tableName - Profile table name (default: 'coachpro_client_profiles')
 * @param {function} config.onLogout - Optional logout callback
 *
 * @example
 * // In CoachPro App.jsx:
 * import { supabase } from '@/config/supabase';
 * import { createClientAuthContext } from '@proapp/shared/context';
 * import { clearCurrentUser } from '@/utils/storage';
 *
 * const { ClientAuthProvider, useClientAuth } = createClientAuthContext({
 *   supabaseClient: supabase,
 *   tableName: 'coachpro_client_profiles',
 *   onLogout: clearCurrentUser
 * });
 */
export function createClientAuthContext({
  supabaseClient,
  tableName = 'coachpro_client_profiles',
  onLogout = null
}) {
  const { AuthContext, useAuth, AuthProvider } = createAuthContext({
    contextName: 'ClientAuth',
    tableName,
    supabaseClient,
    allowMissing: false, // Throws error if not found (single)
    onProfileLoaded: null, // No special callback for clients
    onLogout,
  });

  return {
    ClientAuthContext: AuthContext,
    useClientAuth: useAuth,
    ClientAuthProvider: AuthProvider,
  };
}
