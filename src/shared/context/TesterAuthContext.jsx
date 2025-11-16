import { setCurrentUser } from '../../modules/coach/utils/storage';
import { createAuthContext } from './GenericAuthContext';
import { supabase } from '@shared/config/supabase';

// Load coach session from database (for OAuth testers who are also coaches)
const loadCoachSession = async (authUser, profileData) => {
  try {
    const { getCoaches } = await import('../../modules/coach/utils/storage');
    const coaches = await getCoaches();
    const existingCoach = coaches.find(c => c.email === profileData.email);

    if (existingCoach) {
      // Sync Google photo to coach profile if available (always update to get latest)
      const googlePhotoUrl = authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture;

      if (googlePhotoUrl && googlePhotoUrl !== existingCoach.photo_url) {
        // Update coach profile with latest Google photo
        await supabase
          .from('coachpro_coaches')
          .update({ photo_url: googlePhotoUrl })
          .eq('id', existingCoach.id);
      }

      const coachUser = {
        id: existingCoach.id,
        auth_user_id: existingCoach.auth_user_id,
        name: existingCoach.name,
        email: existingCoach.email,
        phone: existingCoach.phone,
        isTester: existingCoach.is_tester,
        testerId: existingCoach.tester_id,
        isAdmin: existingCoach.is_admin,
        accessCode: existingCoach.access_code,
        createdAt: existingCoach.created_at,
      };
      setCurrentUser(coachUser);
    }
  } catch (err) {
    console.error('Error loading coach session:', err);
  }
};

// Create Tester Auth Context
const { AuthContext: TesterAuthContext, useAuth: useTesterAuth, AuthProvider: TesterAuthProvider } = createAuthContext({
  contextName: 'TesterAuth',
  tableName: 'testers',
  allowMissing: true, // Returns null if not found (maybeSingle)
  onProfileLoaded: loadCoachSession, // Load coach session for OAuth testers
});

export { useTesterAuth, TesterAuthProvider };
export default TesterAuthContext;
