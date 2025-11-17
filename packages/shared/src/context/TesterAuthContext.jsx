import { createAuthContext } from './GenericAuthContext.jsx';

/**
 * Factory function to create Tester Auth Context
 * Module must provide supabaseClient and optional callbacks
 *
 * @param {object} config - Configuration object
 * @param {object} config.supabaseClient - Supabase client instance
 * @param {string} config.tableName - Tester table name (default: 'testers')
 * @param {function} config.onProfileLoaded - Optional callback after profile loads (e.g., loadCoachSession)
 * @param {function} config.onLogout - Optional logout callback
 *
 * @example
 * // In CoachPro App.jsx:
 * import { supabase } from '@/config/supabase';
 * import { createTesterAuthContext } from '@proapp/shared/context';
 * import { clearCurrentUser, setCurrentUser } from '@/utils/storage';
 *
 * // Optional: Load coach session for testers who are also coaches
 * const loadCoachSession = async (authUser, profileData) => {
 *   const { getCoaches } = await import('@/modules/coach/utils/storage');
 *   const coaches = await getCoaches();
 *   const existingCoach = coaches.find(c => c.email === profileData.email);
 *   if (existingCoach) {
 *     // Sync Google photo
 *     const googlePhotoUrl = authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture;
 *     if (googlePhotoUrl && googlePhotoUrl !== existingCoach.photo_url) {
 *       await supabase
 *         .from('coachpro_coaches')
 *         .update({ photo_url: googlePhotoUrl })
 *         .eq('id', existingCoach.id);
 *     }
 *     setCurrentUser({ ...existingCoach, ... });
 *   }
 * };
 *
 * const { TesterAuthProvider, useTesterAuth } = createTesterAuthContext({
 *   supabaseClient: supabase,
 *   tableName: 'testers',
 *   onProfileLoaded: loadCoachSession,
 *   onLogout: clearCurrentUser
 * });
 */
export function createTesterAuthContext({
  supabaseClient,
  tableName = 'testers',
  onProfileLoaded = null,
  onLogout = null
}) {
  const { AuthContext, useAuth, AuthProvider } = createAuthContext({
    contextName: 'TesterAuth',
    tableName,
    supabaseClient,
    allowMissing: true, // Returns null if not found (maybeSingle)
    onProfileLoaded,
    onLogout,
  });

  return {
    TesterAuthContext: AuthContext,
    useTesterAuth: useAuth,
    TesterAuthProvider: AuthProvider,
  };
}
