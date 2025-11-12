import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@shared/config/supabase';
import { useNotification } from '@shared/context/NotificationContext';
import { useClientAuth } from '@shared/context/ClientAuthContext';
import ClientAuthGuard from '@shared/components/ClientAuthGuard';
import ProfileScreen from '@shared/components/ProfileScreen';
import { PHOTO_BUCKETS } from '@shared/utils/photoStorage';

/**
 * ClientProfile - Client profile using universal ProfileScreen
 *
 * @refactored 11.11.2025 - Session #15 - Uses ProfileScreen
 */
const ClientProfile = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();
  const { user, profile, loading: authLoading, refreshProfile } = useClientAuth();

  const [metadata, setMetadata] = useState({});

  // Load coach info helper
  const loadCoachInfo = async (coachId) => {
    try {
      const { data, error } = await supabase
        .from('coachpro_coaches')
        .select('id, name, email, phone')
        .eq('id', coachId)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error loading coach info:', err);
      return null;
    }
  };

  // Load metadata (registration date, etc.)
  useEffect(() => {
    if (profile) {
      setMetadata({
        registrationDate: profile.created_at || null,
        appVersion: '1.0',
        loadCoachInfo,
      });
    }
  }, [profile]);

  const handleSave = async (profileData) => {
    try {
      // Filter only fields that exist in coachpro_client_profiles
      const clientFields = {
        auth_user_id: profileData.auth_user_id,
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        photo_url: profileData.photo_url,
        date_of_birth: profileData.date_of_birth,
        current_situation: profileData.current_situation,
        goals: profileData.goals,
        vision: profileData.vision,
        health_notes: profileData.health_notes,
        client_notes: profileData.client_notes,
        preferred_contact: profileData.preferred_contact,
        timezone: profileData.timezone,
        linkedin: profileData.linkedin,
        instagram: profileData.instagram,
        facebook: profileData.facebook,
        website: profileData.website,
        whatsapp: profileData.whatsapp,
        telegram: profileData.telegram,
      };

      const { data, error } = await supabase
        .from('coachpro_client_profiles')
        .upsert(clientFields, {
          onConflict: 'auth_user_id',
        })
        .select();

      if (error) throw error;

      // Small delay to ensure database write completes
      await new Promise(resolve => setTimeout(resolve, 500));

      // Refresh profile in context
      await refreshProfile();

      showSuccess(
        'Profil uložen',
        'Váš profil byl úspěšně aktualizován.'
      );

      // Navigate back to welcome
      setTimeout(() => {
        navigate('/client/welcome');
      }, 1500);

    } catch (err) {
      console.error('Profile save error:', err);
      throw new Error(err.message || 'Nepodařilo se uložit profil. Zkuste to prosím znovu.');
    }
  };

  const handleBack = () => {
    navigate('/client/welcome');
  };

  return (
    <ClientAuthGuard requireProfile={false}>
      <ProfileScreen
        profile={profile}
        user={user}
        onSave={handleSave}
        onBack={handleBack}
        userType="client"
        photoBucket={PHOTO_BUCKETS.CLIENT_PHOTOS}
        showPhotoUpload={true}
        editableFields={[
          'name',
          'email',
          'phone',
          'dateOfBirth',
          'currentSituation',
          'goals',
          'vision',
          'healthNotes',
          'preferredContact',
          'timezone',
          'clientNotes',
          'linkedin',
          'instagram',
          'facebook',
          'website',
          'whatsapp',
          'telegram',
        ]}
        metadata={metadata}
        loading={authLoading}
      />
    </ClientAuthGuard>
  );
};

export default ClientProfile;
