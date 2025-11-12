import { useNavigate } from 'react-router-dom';
import { Library, Folder, Users, User, BookOpen, Calendar } from 'lucide-react';
import { useTesterAuth } from '@shared/context/TesterAuthContext';
import TesterAuthGuard from '@shared/components/TesterAuthGuard';
import WelcomeScreen from '@shared/components/WelcomeScreen';
import { useTheme } from '@mui/material';
import { getUserPhotoUrl } from '@shared/utils/avatarHelper';

/**
 * TesterWelcome - Welcome/landing page for testers
 *
 * Uses universal WelcomeScreen component with tester-specific configuration
 *
 * @created 11.11.2025 - Refactored to use WelcomeScreen
 */
const TesterWelcome = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { profile, user, logout } = useTesterAuth();

  // Get correct photo URL (custom or Google)
  const photoUrl = getUserPhotoUrl(profile, user);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Action cards for testers
  const actionCards = [
    {
      title: 'Dashboard',
      subtitle: 'Přejít na hlavní stránku',
      icon: <BookOpen size={24} />,
      onClick: () => navigate('/coach/dashboard'),
      gradient:
        theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, rgba(143, 188, 143, 0.3) 0%, rgba(85, 107, 47, 0.25) 100%)'
          : 'linear-gradient(135deg, rgba(143, 188, 143, 0.8) 0%, rgba(85, 107, 47, 0.7) 100%)',
    },
    {
      title: 'Klientky',
      subtitle: 'Správa klientek',
      icon: <Users size={24} />,
      onClick: () => navigate('/coach/clients'),
      gradient:
        theme.palette.mode === 'dark'
          ? 'linear-gradient(120deg, rgba(85, 107, 47, 0.25) 0%, rgba(143, 188, 143, 0.3) 100%)'
          : 'linear-gradient(120deg, rgba(85, 107, 47, 0.7) 0%, rgba(143, 188, 143, 0.8) 100%)',
    },
    {
      title: 'Kalendář sezení',
      subtitle: 'Nadcházející schůzky',
      icon: <Calendar size={24} />,
      onClick: () => navigate('/coach/sessions'),
      gradient:
        theme.palette.mode === 'dark'
          ? 'linear-gradient(150deg, rgba(143, 188, 143, 0.25) 0%, rgba(107, 142, 107, 0.3) 100%)'
          : 'linear-gradient(150deg, rgba(143, 188, 143, 0.7) 0%, rgba(107, 142, 107, 0.8) 100%)',
    },
    {
      title: 'Materiály',
      subtitle: 'Správa materiálů',
      icon: <Library size={24} />,
      onClick: () => navigate('/coach/materials'),
      gradient:
        theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, rgba(107, 142, 107, 0.3) 0%, rgba(143, 188, 143, 0.25) 100%)'
          : 'linear-gradient(135deg, rgba(107, 142, 107, 0.8) 0%, rgba(143, 188, 143, 0.7) 100%)',
    },
    {
      title: 'Programy',
      subtitle: 'Správa programů',
      icon: <Folder size={24} />,
      onClick: () => navigate('/coach/programs'),
      gradient:
        theme.palette.mode === 'dark'
          ? 'linear-gradient(120deg, rgba(143, 188, 143, 0.25) 0%, rgba(85, 107, 47, 0.3) 100%)'
          : 'linear-gradient(120deg, rgba(143, 188, 143, 0.7) 0%, rgba(85, 107, 47, 0.8) 100%)',
    },
    {
      title: 'Upravit profil',
      subtitle: 'Nahrát fotku, změnit údaje',
      icon: <User size={24} />,
      onClick: () => navigate('/coach/profile'),
      gradient:
        theme.palette.mode === 'dark'
          ? 'linear-gradient(150deg, rgba(85, 107, 47, 0.25) 0%, rgba(107, 142, 107, 0.3) 100%)'
          : 'linear-gradient(150deg, rgba(85, 107, 47, 0.7) 0%, rgba(107, 142, 107, 0.8) 100%)',
    },
  ];

  // Optional: Add clients card if tester has clients
  // TODO: Fetch client count from DB
  // if (hasClients) {
  //   actionCards.push({
  //     title: 'Klientky',
  //     subtitle: 'Správa klientek',
  //     icon: <Users size={24} />,
  //     onClick: () => navigate('/coach/clients'),
  //   });
  // }

  return (
    <TesterAuthGuard requireProfile={true}>
      <WelcomeScreen
        profile={{ ...profile, photo_url: photoUrl }}
        onLogout={handleLogout}
        userType="tester"
        subtitle="Beta tester CoachPro"
        actionCards={actionCards}
        showCodeEntry={false}
        showStats={false}
        onAvatarClick={() => navigate('/coach/profile')}
        avatarTooltip="Klikni pro úpravu profilu a nahrání fotky"
      />
    </TesterAuthGuard>
  );
};

export default TesterWelcome;
