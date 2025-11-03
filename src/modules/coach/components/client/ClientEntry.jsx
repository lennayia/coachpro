import { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { QrCode2 as QrCodeIcon, Key as KeyIcon } from '@mui/icons-material';
import { fadeIn, fadeInUp } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import {
  getProgramByCode,
  getClientByProgramCode,
  saveClient,
  setCurrentClient,
  getPrograms,
} from '../../utils/storage';
import { generateUUID, isValidShareCode } from '../../utils/generateCode';
import { useNotification } from '@shared/context/NotificationContext';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import { useTheme } from '@mui/material';

const ClientEntry = () => {
  const navigate = useNavigate();
  const { showError } = useNotification();
  const theme = useTheme();
  const glassCardStyles = useGlassCard('subtle');

  const [entryMethod, setEntryMethod] = useState('code'); // 'code' | 'qr'
  const [code, setCode] = useState('');
  const [clientName, setClientName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Admin mode
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [allPrograms, setAllPrograms] = useState([]);

  const handleCodeChange = (e) => {
    const value = e.target.value.toUpperCase().slice(0, 6);
    setCode(value);
    setError('');
  };

  const handleCodeSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      // 🔑 ADMIN MODE - speciální kód pro testování
      if (code === 'ADMIN1') {
        const programs = await getPrograms();
        if (programs.length === 0) {
          const errorMsg = 'Žádné programy k dispozici. Vytvoř nejdřív nějaký program.';
          showError('Admin režim', errorMsg);
          throw new Error(errorMsg);
        }
        setAllPrograms(programs);
        setIsAdminMode(true);
        setLoading(false);
        return;
      }

      // Validace kódu
      if (code.length !== 6) {
        const errorMsg = 'Kód musí mít 6 znaků';
        showError('Chyba validace', errorMsg);
        throw new Error(errorMsg);
      }

      if (!isValidShareCode(code)) {
        const errorMsg = 'Neplatný formát kódu. Očekáváno: ABC123';
        showError('Chyba validace', errorMsg);
        throw new Error(errorMsg);
      }

      // Najdi program podle kódu
      const program = await getProgramByCode(code);
      if (!program) {
        const errorMsg = 'Program s tímto kódem neexistuje. Zkontroluj ho a zkus znovu.';
        showError('Program nenalezen', errorMsg);
        throw new Error(errorMsg);
      }

      if (!program.isActive) {
        const errorMsg = 'Tento program už není aktivní.';
        showError('Program neaktivní', errorMsg);
        throw new Error(errorMsg);
      }

      // Zkontroluj, zda klientka už není zaregistrovaná
      let client = await getClientByProgramCode(code);

      if (!client) {
        // Nová klientka - zobraz name input
        if (!showNameInput) {
          setShowNameInput(true);
          setLoading(false);
          return;
        }

        // Vytvoř novou klientku
        client = {
          id: generateUUID(),
          name: clientName.trim() || null,
          programCode: code,
          programId: program.id,
          startedAt: new Date().toISOString(),
          currentDay: 1,
          streak: 0,
          longestStreak: 0,
          moodLog: [],
          completedDays: [],
          completedAt: null,
          certificateGenerated: false,
        };

        await saveClient(client);
      }

      // Ulož do session storage
      setCurrentClient(client);

      // Přesměruj na denní přehled
      navigate('/client/daily');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = (scannedCode) => {
    setCode(scannedCode);
    setEntryMethod('code');
    handleCodeSubmit();
  };

  // Admin: Vstup do vybraného programu
  const handleAdminProgramSelect = () => {
    if (!selectedProgramId) return;

    setLoading(true);
    try {
      const program = allPrograms.find(p => p.id === selectedProgramId);
      if (!program) {
        throw new Error('Program nenalezen');
      }

      // Vytvoř admin klientku
      const adminClient = {
        id: generateUUID(),
        name: 'Admin Preview',
        programCode: program.shareCode,
        programId: program.id,
        startedAt: new Date().toISOString(),
        currentDay: 1,
        streak: 0,
        longestStreak: 0,
        moodLog: [],
        completedDays: [],
        completedAt: null,
        certificateGenerated: false,
        isAdmin: true, // 🔑 označení admin session
      };

      // Ulož do session storage (NE localStorage - nechceme ukládat admin klientky)
      setCurrentClient(adminClient);

      // Přesměruj na denní přehled
      navigate('/client/daily');
    } catch (err) {
      setError(err.message);
      showError('Chyba', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? `
              radial-gradient(circle at 20% 20%, rgba(143, 188, 143, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(85, 107, 47, 0.15) 0%, transparent 50%),
              linear-gradient(135deg, #0a0f0a 0%, #1a2410 100%)
            `
            : `
              radial-gradient(circle at 20% 20%, rgba(143, 188, 143, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(85, 107, 47, 0.3) 0%, transparent 50%),
              linear-gradient(135deg, #e8ede5 0%, #d4ddd0 100%)
            `,
        p: 2,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
        },
      }}
    >
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        style={{ width: '100%', maxWidth: 500 }}
      >
        <Card
  elevation={0}
  sx={{
    ...glassCardStyles,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '32px',
  }}
>
          <Box p={4}>
            {/* Logo */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              <Box textAlign="center" mb={4}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <img
                    src="/coachPro.png"
                    alt="CoachProApp"
                    style={{
                      height: '80px',
                      width: 'auto',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <Typography
                    variant="h3"
                    sx={{
                      display: 'none',
                      fontWeight: 700,
                      background: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, #8FBC8F 0%, #556B2F 100%)'
                          : 'linear-gradient(135deg, #556B2F 0%, #228B22 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    CoachPro 🌿
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  Zadej kód od své koučky pro přístup k programu
                </Typography>
              </Box>
            </motion.div>

            {/* Tabs */}
            <Tabs
              value={entryMethod}
              onChange={(e, v) => setEntryMethod(v)}
              centered
              sx={{ mb: 3 }}
            >
              <Tab icon={<KeyIcon />} label="Zadej kód" value="code" />
              <Tab icon={<QrCodeIcon />} label="Naskenuj QR" value="qr" disabled />
            </Tabs>

            {/* Error */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Code input */}
            {entryMethod === 'code' && !isAdminMode && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                <TextField
                  fullWidth
                  label="6místný kód"
                  value={code}
                  onChange={handleCodeChange}
                  inputProps={{
                    maxLength: 6,
                    style: {
                      textAlign: 'center',
                      fontSize: 24,
                      letterSpacing: 8,
                      fontWeight: 'bold',
                    },
                  }}
                  placeholder="ABC123"
                  margin="normal"
                  disabled={loading}
                  helperText="Zadej kód, který jsi dostala od své koučky"
                />

                {/* Name input (po validaci kódu) */}
                {showNameInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <TextField
                      fullWidth
                      label="Tvoje jméno (volitelné)"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      margin="normal"
                      disabled={loading}
                      helperText="Pomůže nám to personalizovat tvůj zážitek"
                    />
                  </motion.div>
                )}

                <Box display="flex" justifyContent="center">
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleCodeSubmit}
                    disabled={code.length !== 6 || loading}
                    sx={{
                      mt: 3,
                      px: 4,
                      py: 1.5,
                      color: '#ffffff !important',
                      background: (theme) =>
                        `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      '&:hover': {
                        background: (theme) =>
                          `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                        boxShadow: (theme) =>
                          theme.palette.mode === 'dark'
                            ? '0 12px 32px rgba(143, 188, 143, 0.3)'
                            : '0 12px 32px rgba(85, 107, 47, 0.3)',
                      },
                      '& .MuiButton-label': {
                        color: '#ffffff',
                      },
                    }}
                    startIcon={loading && <CircularProgress size={20} sx={{ color: '#ffffff' }} />}
                  >
                    {loading
                      ? 'Ověřuji...'
                      : showNameInput
                      ? 'Začít program'
                      : 'Pokračovat'}
                  </Button>
                </Box>
              </motion.div>
            )}

            {/* Admin Mode - Select Program */}
            {isAdminMode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert severity="info" sx={{ mb: 3 }}>
                  🔑 <strong>Admin režim aktivní</strong> - Vyber program pro náhled
                </Alert>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Vyber program</InputLabel>
                  <Select
                    value={selectedProgramId}
                    onChange={(e) => setSelectedProgramId(e.target.value)}
                    label="Vyber program"
                    disabled={loading}
                  >
                    {allPrograms.map((program) => (
                      <MenuItem key={program.id} value={program.id}>
                        <Box display="flex" alignItems="center" gap={1} width="100%">
                          <Typography>{program.title}</Typography>
                          <Chip
                            label={`${program.duration} dní`}
                            size="small"
                            sx={{ ml: 'auto' }}
                          />
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box display="flex" justifyContent="center" gap={2} mt={3}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setIsAdminMode(false);
                      setCode('');
                      setSelectedProgramId('');
                      setAllPrograms([]);
                    }}
                    disabled={loading}
                  >
                    Zpět
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleAdminProgramSelect}
                    disabled={!selectedProgramId || loading}
                    sx={{
                      px: 4,
                      py: 1.5,
                      color: '#ffffff !important',
                      background: (theme) =>
                        `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    }}
                    startIcon={loading && <CircularProgress size={20} sx={{ color: '#ffffff' }} />}
                  >
                    {loading ? 'Načítám...' : 'Zobrazit náhled'}
                  </Button>
                </Box>
              </motion.div>
            )}

            {/* QR Scanner (placeholder) */}
            {entryMethod === 'qr' && (
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: BORDER_RADIUS.compact,
                  p: 6,
                  textAlign: 'center',
                }}
              >
                <QrCodeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  QR scanner bude implementován v další verzi
                </Typography>
              </Box>
            )}

            {/* Info */}
            <Typography
              variant="caption"
              color="text.secondary"
              textAlign="center"
              display="block"
              mt={3}
            >
              Nemáš kód? Kontaktuj svou koučku.
            </Typography>
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
};

export default ClientEntry;
