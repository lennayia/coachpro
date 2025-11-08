import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@shared/config/supabase';
import { clearCurrentUser } from '../../modules/coach/utils/storage';

const TesterAuthContext = createContext(null);

export const useTesterAuth = () => {
  const context = useContext(TesterAuthContext);
  if (!context) {
    throw new Error('useTesterAuth must be used within TesterAuthProvider');
  }
  return context;
};

export const TesterAuthProvider = ({ children }) => {
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
      const { data: profileData, error: profileError } = await supabase
        .from('testers')
        .select('*')
        .eq('auth_user_id', authUser.id)
        .maybeSingle(); // Returns null if not found, no 406 error

      if (profileError) {
        console.error('Error loading tester profile:', profileError);
      }

      if (profileData) {
        // Get name from Google OAuth (PRIORITY!)
        const googleName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || '';

        setProfile({
          ...profileData,
          displayName: googleName || profileData.name || '',
        });
      } else {
        setProfile(null);
      }

      setLoading(false);
    } catch (err) {
      console.error('Tester auth load error:', err);
      setUser(null);
      setProfile(null);
      setLoading(false);
    }
  };

  // Refresh profile (call after profile update)
  const refreshProfile = async () => {
    if (!user) return;

    try {
      const { data: profileData, error } = await supabase
        .from('testers')
        .select('*')
        .eq('auth_user_id', user.id)
        .maybeSingle(); // Returns null if not found, no 406 error

      if (error) {
        console.error('Error refreshing tester profile:', error);
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
      console.error('Tester profile refresh error:', err);
    }
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);

    // CRITICAL: Clear localStorage to prevent admin flag from persisting
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
    <TesterAuthContext.Provider value={value}>
      {children}
    </TesterAuthContext.Provider>
  );
};

export default TesterAuthContext;
