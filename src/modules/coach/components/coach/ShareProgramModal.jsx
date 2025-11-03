import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  ContentCopy as ContentCopyIcon,
  QrCode2 as QrCodeIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { cs } from 'date-fns/locale';
import { downloadQRCode, formatDate } from '@shared/utils/helpers';
import BORDER_RADIUS from '@styles/borderRadius';
import { useNotification } from '@shared/context/NotificationContext';
import { useTheme } from '@mui/material';
import { createBackdrop, createGlassDialog, createPrimaryModalButton, createFormTextField, createCancelButton, createSubmitButton } from '../../../../shared/styles/modernEffects';
import { generateUUID, generateShareCode, generateQRCode } from '../../utils/generateCode';
import { saveClient } from '../../utils/storage';

const ShareProgramModal = ({ open, onClose, program }) => {
  const { showSuccess, showError } = useNotification();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [step, setStep] = useState('form'); // 'form' or 'success'
  const [clientName, setClientName] = useState('');
  const [accessStartDate, setAccessStartDate] = useState(new Date());
  const [accessEndDate, setAccessEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatedClient, setGeneratedClient] = useState(null);

  if (!program) return null;

  const handleClose = () => {
    setStep('form');
    setClientName('');
    setAccessStartDate(new Date());
    setAccessEndDate(null);
    setGeneratedClient(null);
    onClose();
  };

  const handleGenerateCode = async () => {
    // Validace
    if (!clientName.trim()) {
      showError('Chyba', 'Vyplň jméno klientky');
      return;
    }

    setLoading(true);
    try {
      // Vygeneruj shareCode a QR
      const shareCode = generateShareCode();
      const qrCode = await generateQRCode(shareCode);

      // Vytvoř client záznam
      const newClient = {
        id: generateUUID(),
        name: clientName.trim(),
        programCode: shareCode,
        programId: program.id,
        currentDay: 1,
        completedDays: [],
        moodChecks: [],
        streak: 0,
        longestStreak: 0,
        startedAt: new Date().toISOString(),
        completedAt: null,
        certificateGenerated: false,
        accessStartDate: accessStartDate ? accessStartDate.toISOString() : null,
        accessEndDate: accessEndDate ? accessEndDate.toISOString() : null,
      };

      // Ulož do databáze
      await saveClient(newClient);

      // Ulož pro zobrazení včetně QR
      setGeneratedClient({ ...newClient, programCode: shareCode, qrCode });
      setStep('success');

      showSuccess('Hotovo! 🎉', `Kód pro ${clientName} byl vytvořen`);
    } catch (error) {
      console.error('Failed to generate code:', error);
      showError('Chyba', 'Nepodařilo se vytvořit kód. Zkus to prosím znovu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (generatedClient) {
      navigator.clipboard.writeText(generatedClient.programCode);
      showSuccess('Hotovo!', 'Kód zkopírován do schránky! 📋');
    }
  };

  const handleDownloadQR = () => {
    if (generatedClient?.qrCode) {
      downloadQRCode(generatedClient.qrCode, `${program.title}-${generatedClient.name}-qr`);
      showSuccess('Hotovo!', 'QR kód stažen! 📥');
    }
  };

  const handleShare = () => {
    if (!generatedClient) return;

    const accessInfo = generatedClient.accessEndDate
      ? `\n⏰ Dostupné: ${formatDate(generatedClient.accessStartDate, { day: 'numeric', month: 'numeric', year: 'numeric' })} - ${formatDate(generatedClient.accessEndDate, { day: 'numeric', month: 'numeric', year: 'numeric' })}`
      : `\n⏰ Dostupné od: ${formatDate(generatedClient.accessStartDate, { day: 'numeric', month: 'numeric', year: 'numeric' })}`;

    const text = `🌿 CoachPro Program

${program.title}
${program.description}

⏱️ Délka: ${program.duration} dní
📚 ${program.days.reduce((acc, day) => acc + (day.materialIds?.length || 0), 0)} materiálů${accessInfo}

🔑 Pro přístup zadej tento kód v aplikaci CoachPro:
${generatedClient.programCode}

Nebo naskenuj QR kód, který ti pošlu.

Těším se na tvůj růst! 💚`;

    if (navigator.share) {
      navigator
        .share({
          title: program.title,
          text: text,
        })
        .then(() => {
          showSuccess('Hotovo!', 'Program sdílen! 📤');
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            console.error('Share error:', err);
            showError('Chyba', 'Nepodařilo se sdílet program');
          }
        });
    } else {
      navigator.clipboard.writeText(text);
      showSuccess('Hotovo!', 'Text zkopírován! Pošli ho klientce. 📋');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      BackdropProps={{ sx: createBackdrop() }}
      PaperProps={{ sx: createGlassDialog(isDark, BORDER_RADIUS.dialog) }}
    >
      {step === 'form' ? (
        <>
          {/* KROK 1: Formulář */}
          <DialogTitle>Sdílet program s klientkou</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              {/* Program info */}
              <Alert severity="info" sx={{ borderRadius: BORDER_RADIUS.compact }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {program.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {program.duration} dní • {program.days.reduce((acc, day) => acc + (day.materialIds?.length || 0), 0)} materiálů
                </Typography>
              </Alert>

              {/* Jméno klientky */}
              <TextField
                label="Jméno klientky"
                fullWidth
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="např. Jana Nová"
                disabled={loading}
                sx={createFormTextField(isDark)}
              />

              {/* Date pickery */}
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={cs}>
                <DatePicker
                  label="Dostupné od"
                  value={accessStartDate}
                  onChange={(newValue) => setAccessStartDate(newValue)}
                  disabled={loading}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      sx: createFormTextField(isDark)
                    }
                  }}
                />

                <DatePicker
                  label="Dostupné do (volitelné)"
                  value={accessEndDate}
                  onChange={(newValue) => setAccessEndDate(newValue)}
                  disabled={loading}
                  minDate={accessStartDate}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      helperText: 'Pokud nevyplníš, přístup bude neomezený',
                      sx: createFormTextField(isDark)
                    }
                  }}
                />
              </LocalizationProvider>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={handleClose}
              disabled={loading}
              sx={createCancelButton(isDark)}
            >
              Zrušit
            </Button>
            <Button
              variant="contained"
              onClick={handleGenerateCode}
              disabled={loading || !clientName.trim()}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              sx={createSubmitButton(isDark)}
            >
              {loading ? 'Vytvářím...' : 'Vygenerovat kód'}
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          {/* KROK 2: Success obrazovka */}
          <DialogContent sx={{ textAlign: 'center', p: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />

            <Typography variant="h5" mb={1} sx={{ fontWeight: 700 }}>
              Kód je vytvořený a je k klientce k dispozici!
            </Typography>

            <Typography variant="body2" color="text.secondary" mb={2}>
              Pošli tento kód klientce <strong>{generatedClient?.name}</strong>
            </Typography>

            {/* Časové omezení info */}
            {generatedClient && (
              <Alert severity="info" sx={{ mb: 3, borderRadius: BORDER_RADIUS.compact }}>
                <Typography variant="caption">
                  ⏰ Dostupné od: {formatDate(generatedClient.accessStartDate, { day: 'numeric', month: 'numeric', year: 'numeric' })}
                  {generatedClient.accessEndDate && (
                    <> do: {formatDate(generatedClient.accessEndDate, { day: 'numeric', month: 'numeric', year: 'numeric' })}</>
                  )}
                  {!generatedClient.accessEndDate && <> (neomezeno)</>}
                </Typography>
              </Alert>
            )}

            {/* QR kód */}
            {generatedClient?.qrCode && (
              <Box
                sx={{
                  p: 3,
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  borderRadius: BORDER_RADIUS.compact,
                  mb: 3,
                }}
              >
                <Box
                  component="img"
                  src={generatedClient.qrCode}
                  alt="QR kód"
                  sx={{
                    width: 200,
                    height: 200,
                    border: '8px solid white',
                    borderRadius: BORDER_RADIUS.small,
                  }}
                />
              </Box>
            )}

            {/* Číselný kód */}
            <Box
              sx={{
                p: 2,
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(139, 188, 143, 0.1)'
                    : 'rgba(85, 107, 47, 0.05)',
                borderRadius: BORDER_RADIUS.compact,
                mb: 3,
              }}
            >
              <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                Kód programu
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  letterSpacing: 4,
                  fontFamily: 'monospace',
                }}
              >
                {generatedClient?.programCode}
              </Typography>
            </Box>

            {/* Action buttons */}
            <Stack direction="row" spacing={1} justifyContent="center">
              <Button
                variant="outlined"
                size="small"
                startIcon={<ContentCopyIcon />}
                onClick={handleCopyCode}
                sx={{
                  borderRadius: BORDER_RADIUS.compact,
                  textTransform: 'none',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  px: 2,
                  py: 0.75,
                }}
              >
                Kopírovat
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadQR}
                sx={{
                  borderRadius: BORDER_RADIUS.compact,
                  textTransform: 'none',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  px: 2,
                  py: 0.75,
                }}
              >
                Stáhnout QR
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ShareIcon />}
                onClick={handleShare}
                sx={{
                  borderRadius: BORDER_RADIUS.compact,
                  textTransform: 'none',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  px: 2,
                  py: 0.75,
                }}
              >
                Sdílet
              </Button>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={handleClose}
              sx={createPrimaryModalButton(isDark)}
            >
              Hotovo
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default ShareProgramModal;
