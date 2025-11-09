import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@shared/config/supabase';
import { clearCurrentUser, setCurrentUser } from '../../modules/coach/utils/storage';

/**
 * Generic OAuth authentication context factory
 *
 * @param {string} contextName - Name for error messages (e.g., "TesterAuth", "ClientAuth")
 * @param {string} tableName - Supabase table name (e.g., "testers", "coachpro_client_profiles")
 * @param {boolean} allowMissing - Whether to allow missing profiles (maybeSingle vs single)
 * @param {function} onProfileLoaded - Optional callback after profile loads (e.g., loadCoachSession for testers)
 */
export function createAuthContext({
  contextName,
  tableName,
  allowMissing = false,
  onProfileLoaded = null
}) {
  const AuthContext = createContext(null);

  const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error(`use${contextName} must be used within ${contextName}Provider`);
    }
    return context;
  };

  const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load auth user and profile
    const loadAuth = async () => {
      try {
        setLoading(true);

        // Get OAuth user
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

        if (authError || !authUser) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        setUser(authUser);

        // Get profile from DB
        const query = supabase
          .from(tableName)
          .select('*')
          .eq('auth_user_id', authUser.id);

        const { data: profileData, error: profileError } = allowMissing
          ? await query.maybeSingle()
          : await query.single();

        if (profileError && !allowMissing) {
          console.error(`Error loading ${contextName} profile:`, profileError);
        }

        if (profileData) {
          // Get name from Google OAuth (PRIORITY!)
          const googleName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || '';

          const enrichedProfile = {
            ...profileData,
            displayName: googleName || profileData.name || '',
          };

          setProfile(enrichedProfile);

          // Call optional callback (e.g., loadCoachSession for testers)
          if (onProfileLoaded) {
            await onProfileLoaded(authUser, enrichedProfile);
          }
        } else {
          setProfile(null);
        }

        setLoading(false);
      } catch (err) {
        console.error(`${contextName} load error:`, err);
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    };

    // Refresh profile (call after profile update)
    const refreshProfile = async () => {
      if (!user) return;

      try {
        const query = supabase
          .from(tableName)
          .select('*')
          .eq('auth_user_id', user.id);

        const { data: profileData, error } = allowMissing
          ? await query.maybeSingle()
          : await query.single();

        if (error && !allowMissing) {
          console.error(`Error refreshing ${contextName} profile:`, error);
          return;
        }

        if (profileData) {
          const googleName = user.user_metadata?.full_name || user.user_metadata?.name || '';
          setProfile({
            ...profileData,
            displayName: googleName || profileData.name || '',
          });
        }
      } catch (err) {
        console.error(`${contextName} profile refresh error:`, err);
      }
    };

    // Logout
    const logout = async () => {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      clearCurrentUser();
    };

    // Initial load
    useEffect(() => {
      loadAuth();

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          loadAuth();
        } else {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }, []);

    const value = {
      user,
      profile,
      loading,
      refreshProfile,
      logout,
      isAuthenticated: !!user,
      hasProfile: !!profile,
    };

    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
  };

  return { AuthContext, useAuth, AuthProvider };
}
