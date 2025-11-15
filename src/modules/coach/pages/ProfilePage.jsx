import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@shared/config/supabase';
import { useNotification } from '@shared/context/NotificationContext';
import { useTesterAuth } from '@shared/context/TesterAuthContext';
import TesterAuthGuard from '@shared/components/TesterAuthGuard';
import ProfileScreen from '@shared/components/ProfileScreen';
import { PHOTO_BUCKETS } from '@shared/utils/photoStorage';

/**
 * ProfilePage - Coach/Tester profile using universal ProfileScreen
 *
 * @created 4.11.2025
 * @refactored 11.11.2025 - Session #15 - Uses ProfileScreen
 */
const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useNotification();
  const { user, profile: testerProfile, loading: authLoading } = useTesterAuth();

  const [coachProfile, setCoachProfile] = useState(null);
  const [metadata, setMetadata] = useState({});
  const [loading, setLoading] = useState(true);

  // Get the "from" path from navigation state
  const fromPath = location.state?.from;

  // Load coach profile from coachpro_coaches table
  useEffect(() => {
    const loadCoachProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('coachpro_coaches')
          .select('*')
          .eq('auth_user_id', user.id)
          .single();

        if (error) throw error;

        setCoachProfile(data);
        setMetadata({
          registrationDate: data.created_at || null,
          appVersion: 'Beta',
        });
      } catch (err) {
        console.error('Error loading coach profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCoachProfile();
  }, [user]);

  const handleSave = async (profileData) => {
    try {
      // Update coach record (coach already exists from registration)
      const coachUpdateData = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        photo_url: profileData.photo_url,
        education: profileData.education,
        certifications: profileData.certifications,
        specializations: profileData.specializations,
        bio: profileData.bio,
        years_of_experience: profileData.years_of_experience,
        linkedin: profileData.linkedin,
        instagram: profileData.instagram,
        facebook: profileData.facebook,
        website: profileData.website,
        whatsapp: profileData.whatsapp,
        telegram: profileData.telegram,
      };

      const { data: coachData, error: coachError } = await supabase
        .from('coachpro_coaches')
        .update(coachUpdateData)
        .eq('auth_user_id', user.id)
        .select()
        .single();

      if (coachError) throw coachError;

      // ALSO update tester record (since tester auth context loads from testers table)
      // Note: Only basic fields - testers table doesn't have social media or professional fields
      const testerUpdateData = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
      };

      const { error: testerError } = await supabase
        .from('testers')
        .update(testerUpdateData)
        .eq('auth_user_id', user.id)
        .select()
        .single();

      // Don't throw if tester update fails (might not exist)
      if (testerError) {
        console.warn('Tester update failed (might not be a tester):', testerError);
      }

      // Reload coach profile from database
      const { data: updatedCoach, error: reloadError } = await supabase
        .from('coachpro_coaches')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      if (!reloadError && updatedCoach) {
        setCoachProfile(updatedCoach);
      }

      showSuccess(
        'Profil uložen',
        'Váš profil byl úspěšně aktualizován.'
      );

      // Navigate back to where we came from, or to welcome
      setTimeout(() => {
        if (fromPath) {
          navigate(fromPath);
        } else {
          navigate('/tester/welcome');
        }
      }, 1500);

    } catch (err) {
      console.error('Profile save error:', err);
      throw new Error(err.message || 'Nepodařilo se uložit profil');
    }
  };

  // Determine user type based on current route
  const isCoachRoute = location.pathname.startsWith('/coach');
  const userType = isCoachRoute ? 'coach' : 'tester';

  const handleBack = () => {
    // If we came from another page, go back there
    if (fromPath) {
      navigate(fromPath);
    } else {
      // Default: go to appropriate welcome page based on user type
      navigate(isCoachRoute ? '/tester/welcome' : '/tester/welcome');
    }
  };

  return (
    <TesterAuthGuard requireProfile={false}>
      <ProfileScreen
        profile={coachProfile}
        user={user}
        onSave={handleSave}
        onBack={handleBack}
        userType={userType}
        photoBucket={PHOTO_BUCKETS.COACH_PHOTOS}
        showPhotoUpload={true}
        editableFields={[
          'name',
          'email',
          'phone',
          'education',
          'certifications',
          'specializations',
          'bio',
          'yearsOfExperience',
          'linkedin',
          'instagram',
          'facebook',
          'website',
          'whatsapp',
          'telegram',
        ]}
        metadata={metadata}
        loading={loading || authLoading}
      />
    </TesterAuthGuard>
  );
};

export default ProfilePage;
