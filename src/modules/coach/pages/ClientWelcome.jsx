import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle as CheckIcon,
  Key as KeyIcon,
  LogIn as LogInIcon,
  Users as UsersIcon,
  BookOpen as BookOpenIcon,
} from 'lucide-react';
import BORDER_RADIUS from '@styles/borderRadius';
import { useNotification } from '@shared/context/NotificationContext';
import { useTheme } from '@mui/material';
import { useClientAuth } from '@shared/context/ClientAuthContext';
import ClientAuthGuard from '@shared/components/ClientAuthGuard';
import WelcomeScreen from '@shared/components/WelcomeScreen';
import { getVocative } from '@shared/utils/czechGrammar';
import { getUserPhotoUrl } from '@shared/utils/avatarHelper';
import {
  getProgramByCode,
  getSharedMaterialByCode,
  getCardDeckByCode,
} from '../utils/storage';
import { isValidShareCode } from '../utils/generateCode';

/**
 * ClientWelcome - Welcome/landing page for clients
 *
 * Uses universal WelcomeScreen with custom code entry and action cards
 * Refactored from 509 lines to use modular components
 *
 * @created 11.11.2025 - Refactored to use WelcomeScreen
 */
const ClientWelcome = () => {
  const navigate = useNavigate();
  const { showError } = useNotification();
  const theme = useTheme();
  const { profile, user, logout } = useClientAuth();

  // Get correct photo URL (custom or Google)
  const photoUrl = getUserPhotoUrl(profile, user);

  // Code entry state
  const [code, setCode] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [detectedType, setDetectedType] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Auto-detect code type
  useEffect(() => {
    const detectType = async () => {
      if (code.length !== 6 || !isValidShareCode(code)) {
        setPreviewData(null);
        setDetectedType(null);
        return;
      }

      try {
        // Try program first
        const program = await getProgramByCode(code);
        if (program) {
          setPreviewData({ title: program.title, coachName: program.coachName });
          setDetectedType('program');
          return;
        }

        // Try material
        const material = await getSharedMaterialByCode(code);
        if (material) {
          setPreviewData({ title: material.title, type: 'Materiál' });
          setDetectedType('material');
          return;
        }

        // Try card deck
        const cardDeck = await getCardDeckByCode(code);
        if (cardDeck) {
          setPreviewData({ title: cardDeck.deck_name || 'Koučovací karty', type: 'Karty' });
          setDetectedType('card-deck');
          return;
        }

        // Not found
        setPreviewData(null);
        setDetectedType(null);
      } catch (err) {
        // Silent fail - don't show error for detection
      }
    };

    const debounce = setTimeout(detectType, 300);
    return () => clearTimeout(debounce);
  }, [code]);

  const handleCodeSubmit = async () => {
    if (code.length !== 6) {
      showError('Neplatný kód', 'Kód musí obsahovat přesně 6 znaků');
      return;
    }

    if (!isValidShareCode(code)) {
      showError('Neplatný kód', 'Neplatný formát kódu');
      return;
    }

    setCodeLoading(true);

    try {
      // Program entry
      if (detectedType === 'program') {
        navigate('/client/daily');
        return;
      }

      // Material entry
      if (detectedType === 'material') {
        navigate(`/client/material/${code}`);
        return;
      }

      // Card deck entry
      if (detectedType === 'card-deck') {
        navigate(`/client/card-deck/${code}`);
        return;
      }

      throw new Error('Nepodařilo se určit typ obsahu');
    } catch (err) {
      showError('Chyba', 'Nepodařilo se zpracovat kód. Zkuste to prosím znovu.');
    } finally {
      setCodeLoading(false);
    }
  };

  // Custom code entry UI (richer than default WelcomeScreen)
  const customCodeEntry = (
    <Card
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: BORDER_RADIUS.card,
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(139, 188, 143, 0.08) 0%, rgba(85, 107, 47, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(139, 188, 143, 0.12) 0%, rgba(85, 107, 47, 0.08) 100%)',
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark' ? 'rgba(139, 188, 143, 0.15)' : 'rgba(85, 107, 47, 0.2)',
      }}
    >
      <Box display="flex" alignItems="center" gap={1.5} mb={2}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(139, 188, 143, 0.2)'
                : 'rgba(85, 107, 47, 0.15)',
          }}
        >
          <KeyIcon size={20} color={theme.palette.primary.main} />
        </Box>
        <Typography variant="h6" fontWeight={600}>
          Máte kód od své koučky?
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" mb={2}>
        Zadejte 6-místný kód a získejte okamžitý přístup k vašemu programu, materiálu nebo kartám.
      </Typography>

      <TextField
        fullWidth
        label="Zadejte kód"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
        InputProps={{
          endAdornment: previewData ? (
            <InputAdornment position="end">
              <CheckIcon size={20} color={theme.palette.success.main} />
            </InputAdornment>
          ) : null,
          sx: { borderRadius: BORDER_RADIUS.compact },
        }}
        placeholder="ABC123"
        disabled={codeLoading}
        helperText="Kód vám otevře program, materiál nebo karty"
        sx={{ mb: 2 }}
      />

      {previewData && (
        <Alert
          severity="success"
          icon={<CheckIcon size={20} />}
          sx={{
            mb: 2,
            borderRadius: BORDER_RADIUS.compact,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {previewData.title}
          </Typography>
          {previewData.coachName && (
            <Typography variant="caption" sx={{ fontWeight: 500, color: 'primary.main' }}>
              Od kouče: {previewData.coachName}
            </Typography>
          )}
          {previewData.type && (
            <Typography variant="caption" color="text.secondary">
              Typ: {previewData.type}
            </Typography>
          )}
        </Alert>
      )}

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={handleCodeSubmit}
        disabled={code.length !== 6 || !detectedType || codeLoading}
        sx={{
          py: 1.5,
          borderRadius: BORDER_RADIUS.compact,
        }}
      >
        {codeLoading ? <CircularProgress size={24} /> : 'Vstoupit do programu'}
      </Button>
    </Card>
  );

  // Action cards for clients
  const actionCards = [
    {
      title: 'Vstup do klientské zóny',
      subtitle: 'Pokračujte ve svém programu a prohlížejte materiály',
      backTitle: 'Klientská zóna',
      icon: <LogInIcon size={24} />,
      onClick: () => navigate('/client/dashboard'),
      gradient:
        theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, rgba(143, 188, 143, 0.15) 0%, rgba(85, 107, 47, 0.1) 100%)'
          : 'linear-gradient(135deg, rgba(143, 188, 143, 0.3) 0%, rgba(85, 107, 47, 0.2) 100%)',
    },
    {
      title: 'Vyberte si koučku',
      subtitle: 'Prozkoumejte naše kouče a vyberte si toho pravého pro vaši cestu',
      backTitle: 'Naše koučky',
      icon: <UsersIcon size={24} />,
      onClick: () => navigate('/client/select-coach'),
      gradient:
        theme.palette.mode === 'dark'
          ? 'linear-gradient(120deg, rgba(85, 107, 47, 0.1) 0%, rgba(143, 188, 143, 0.15) 100%)'
          : 'linear-gradient(120deg, rgba(85, 107, 47, 0.2) 0%, rgba(143, 188, 143, 0.3) 100%)',
    },
    {
      title: 'O koučinku',
      subtitle: 'Zjistěte více o různých typech koučinku a metodách',
      backTitle: 'Průvodce koučinkem',
      icon: <BookOpenIcon size={24} />,
      onClick: () => navigate('/coach-types-guide'),
      gradient:
        theme.palette.mode === 'dark'
          ? 'linear-gradient(150deg, rgba(143, 188, 143, 0.1) 0%, rgba(107, 142, 107, 0.15) 100%)'
          : 'linear-gradient(150deg, rgba(143, 188, 143, 0.2) 0%, rgba(107, 142, 107, 0.3) 100%)',
    },
  ];

  return (
    <ClientAuthGuard requireProfile={true}>
      <WelcomeScreen
        profile={{ ...profile, photo_url: photoUrl }}
        onLogout={handleLogout}
        userType="client"
        welcomeText={`Vítejte zpátky, ${getVocative(profile?.displayName || '')}!`}
        subtitle="Těšíme se, že tu jste a že jste připravená pokračovat ve své cestě k osobnímu růstu."
        customCodeEntry={customCodeEntry}
        actionCards={actionCards}
        showCodeEntry={false}
        showStats={false}
        onAvatarClick={() => navigate('/client/profile')}
        avatarTooltip="Klikni pro úpravu profilu a nahrání fotky"
      />
    </ClientAuthGuard>
  );
};

export default ClientWelcome;
