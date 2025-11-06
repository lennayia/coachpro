import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@shared/config/supabase';

const ClientAuthContext = createContext(null);

export const useClientAuth = () => {
  const context = useContext(ClientAuthContext);
  if (!context) {
    throw new Error('useClientAuth must be used within ClientAuthProvider');
  }
  return context;
};

export const ClientAuthProvider = ({ children }) => {
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
        .from('coachpro_client_profiles')
        .select('*')
        .eq('auth_user_id', authUser.id)
        .single();

      if (!profileError && profileData) {
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
      console.error('Auth load error:', err);
      setUser(null);
      setProfile(null);
      setLoading(false);
    }
  };

  // Refresh profile (call after profile update)
  const refreshProfile = async () => {
    if (!user) return;

    try {
      const { data: profileData } = await supabase
        .from('coachpro_client_profiles')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      if (profileData) {
        const googleName = user.user_metadata?.full_name || user.user_metadata?.name || '';
        setProfile({
          ...profileData,
          displayName: googleName || profileData.name || '',
        });
      }
    } catch (err) {
      console.error('Profile refresh error:', err);
    }
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
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
    <ClientAuthContext.Provider value={value}>
      {children}
    </ClientAuthContext.Provider>
  );
};

export default ClientAuthContext;
