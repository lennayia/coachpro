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
  Link as MuiLink,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Key as KeyIcon, CheckCircle as CheckIcon } from '@mui/icons-material';
import { fadeIn, fadeInUp } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import { getSharedMaterialByCode } from '../../utils/storage';
import { isValidShareCode } from '../../utils/generateCode';
import { useNotification } from '@shared/context/NotificationContext';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import { useTheme } from '@mui/material';

const MaterialEntry = () => {
  const navigate = useNavigate();
  const { showError } = useNotification();
  const theme = useTheme();
  const glassCardStyles = useGlassCard('subtle');

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewSharedMaterial, setPreviewSharedMaterial] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);

  // Live lookup - když uživatel zadá 6 znaků
  useEffect(() => {
    const lookupMaterial = async () => {
      if (code.length !== 6) {
        setPreviewSharedMaterial(null);
        return;
      }

      setLookupLoading(true);
      try {
        const sharedMaterial = await getSharedMaterialByCode(code);
        if (sharedMaterial && sharedMaterial.material) {
          setPreviewSharedMaterial(sharedMaterial);
        } else {
          setPreviewSharedMaterial(null);
        }
      } catch (err) {
        setPreviewSharedMaterial(null);
      } finally {
        setLookupLoading(false);
      }
    };

    const timeoutId = setTimeout(lookupMaterial, 300); // Debounce 300ms
    return () => clearTimeout(timeoutId);
  }, [code]);

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
        const errorMsg = 'Kód musí mít 6 znaků';
        showError('Chyba validace', errorMsg);
        throw new Error(errorMsg);
      }

      if (!isValidShareCode(code)) {
        const errorMsg = 'Neplatný formát kódu. Očekáváno: ABC123';
        showError('Chyba validace', errorMsg);
        throw new Error(errorMsg);
      }

      // Najdi sdílený materiál podle kódu
      const sharedMaterial = await getSharedMaterialByCode(code);
      if (!sharedMaterial) {
        const errorMsg = 'Materiál s tímto kódem neexistuje. Zkontroluj ho a zkus znovu.';
        showError('Materiál nenalezen', errorMsg);
        throw new Error(errorMsg);
      }

      // Přesměruj na MaterialView
      navigate(`/client/material/${code}`);
    } catch (err) {
      setError(err.message);
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
                  Zadejte kód pro přístup k jednotlivému materiálu
                </Typography>
              </Box>
            </motion.div>

            {/* Kód Input */}
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
                placeholder="HTM043"
                disabled={loading}
                error={!!error}
                helperText="Zadejte kód, který jste dostala od své koučky"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon />
                    </InputAdornment>
                  ),
                  endAdornment: lookupLoading ? (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  ) : previewSharedMaterial ? (
                    <InputAdornment position="end">
                      <CheckIcon color="success" />
                    </InputAdornment>
                  ) : null,
                  sx: {
                    fontFamily: 'monospace',
                    fontSize: '1.2rem',
                    letterSpacing: '0.2em',
                    textAlign: 'center',
                  },
                }}
                sx={{ mb: 2 }}
              />

              {/* Live Preview - Název materiálu + Kouč */}
              {previewSharedMaterial && (
                <Alert
                  severity="success"
                  icon={<CheckIcon />}
                  sx={{
                    mb: 2,
                    borderRadius: BORDER_RADIUS.compact,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Materiál: {previewSharedMaterial.material.title}
                  </Typography>
                  {previewSharedMaterial.coachName && (
                    <Typography variant="caption" sx={{ fontWeight: 500, color: 'primary.main' }}>
                      Od kouče: {previewSharedMaterial.coachName}
                    </Typography>
                  )}
                  {previewSharedMaterial.material.description && (
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                      {previewSharedMaterial.material.description}
                    </Typography>
                  )}
                </Alert>
              )}

              {/* Error Alert */}
              {error && (
                <Alert
                  severity="error"
                  onClose={() => setError('')}
                  sx={{
                    mb: 2,
                    borderRadius: BORDER_RADIUS.compact,
                  }}
                >
                  {error}
                </Alert>
              )}

              {/* Pokračovat tlačítko */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleCodeSubmit}
                disabled={loading || code.length !== 6 || !previewSharedMaterial}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: BORDER_RADIUS.compact,
                }}
              >
                {loading ? 'Načítám...' : 'Pokračovat'}
              </Button>

              {/* Link na program entry */}
              <Box mt={3} textAlign="center">
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Potřebujete přístup do programu?
                </Typography>
                <MuiLink
                  onClick={() => navigate('/client/entry')}
                  sx={{
                    cursor: 'pointer',
                    fontWeight: 600, 
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Vstup do programu →
                </MuiLink>
              </Box>

              {/* Nemáte kód? */}
              <Typography
                variant="caption"
                align="center"
                color="text.secondary"
                display="block"
                sx={{ mt: 3 }}
              >
                Nemáte kód? Kontaktujte svoji koučku.
              </Typography>
            </motion.div>
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
};

export default MaterialEntry;
