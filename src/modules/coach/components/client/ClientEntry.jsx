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
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { QrCode2 as QrCodeIcon, Key as KeyIcon } from '@mui/icons-material';
import { fadeIn, fadeInUp } from '../../utils/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import {
  getProgramByCode,
  getClientByProgramCode,
  saveClient,
  setCurrentClient,
} from '../../utils/storage';
import { generateUUID, isValidShareCode } from '../../utils/generateCode';

const ClientEntry = () => {
  const navigate = useNavigate();

  const [entryMethod, setEntryMethod] = useState('code'); // 'code' | 'qr'
  const [code, setCode] = useState('');
  const [clientName, setClientName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCodeChange = (e) => {
    const value = e.target.value.toUpperCase().slice(0, 6);
    setCode(value);
    setError('');
  };

  const handleCodeSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      // Validace kódu
      if (code.length !== 6) {
        throw new Error('Kód musí mít 6 znaků');
      }

      if (!isValidShareCode(code)) {
        throw new Error('Neplatný formát kódu. Očekáváno: ABC123');
      }

      // Najdi program podle kódu
      const program = getProgramByCode(code);
      if (!program) {
        throw new Error('Program s tímto kódem neexistuje. Zkontroluj ho a zkus znovu.');
      }

      if (!program.isActive) {
        throw new Error('Tento program už není aktivní.');
      }

      // Zkontroluj, zda klientka už není zaregistrovaná
      let client = getClientByProgramCode(code);

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

        saveClient(client);
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #065f46 0%, #134e4a 50%, #0f172a 100%)'
            : 'linear-gradient(135deg, #065f46 0%, #134e4a 50%, #10b981 100%)',
        p: 2,
      }}
    >
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        style={{ width: '100%', maxWidth: 500 }}
      >
        <Card
          sx={{
            width: '100%',
            backdropFilter: 'blur(20px)',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(26, 26, 26, 0.8)'
                : 'rgba(255, 255, 255, 0.9)',
            border: (theme) =>
              `1px solid ${
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(255, 255, 255, 0.3)'
              }`,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
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
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #8FBC8F 0%, #556B2F 100%)'
                        : 'linear-gradient(135deg, #556B2F 0%, #228B22 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Vítej v CoachPro 🌿
                </Typography>
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
            {entryMethod === 'code' && (
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

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleCodeSubmit}
                  disabled={code.length !== 6 || loading}
                  sx={{ mt: 3 }}
                  startIcon={loading && <CircularProgress size={20} />}
                >
                  {loading
                    ? 'Ověřuji...'
                    : showNameInput
                    ? 'Začít program'
                    : 'Pokračovat'}
                </Button>
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
