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
  Chip,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  ContentCopy as ContentCopyIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { cs } from 'date-fns/locale';
import { downloadQRCode, formatDate, getCategoryLabel } from '@shared/utils/helpers';
import BORDER_RADIUS from '@styles/borderRadius';
import { useNotification } from '@shared/context/NotificationContext';
import { useTheme } from '@mui/material';
import { createBackdrop, createGlassDialog, createPrimaryModalButton, createFormTextField, createCancelButton, createSubmitButton } from '../../../../shared/styles/modernEffects';
import { generateShareCode, generateQRCode } from '../../utils/generateCode';
import { createSharedMaterial, getCurrentUser } from '../../utils/storage';

const ShareMaterialModal = ({ open, onClose, material }) => {
  const { showSuccess, showError } = useNotification();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [step, setStep] = useState('form'); // 'form' or 'success'
  const [clientName, setClientName] = useState('');
  const [accessStartDate, setAccessStartDate] = useState(new Date());
  const [accessEndDate, setAccessEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatedSharedMaterial, setGeneratedSharedMaterial] = useState(null);

  if (!material) return null;

  const handleClose = () => {
    setStep('form');
    setClientName('');
    setAccessStartDate(new Date());
    setAccessEndDate(null);
    setGeneratedSharedMaterial(null);
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
      const currentUser = getCurrentUser();
      if (!currentUser) {
        showError('Chyba', 'Není přihlášený žádný kouč');
        return;
      }

      // Vytvoř sdílený materiál s časovým omezením
      const sharedMaterial = await createSharedMaterial(
        material,
        currentUser.id,
        accessStartDate ? accessStartDate.toISOString() : null,
        accessEndDate ? accessEndDate.toISOString() : null
      );

      // Ulož pro zobrazení
      setGeneratedSharedMaterial(sharedMaterial);
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
    if (generatedSharedMaterial) {
      navigator.clipboard.writeText(generatedSharedMaterial.shareCode);
      showSuccess('Hotovo!', 'Kód zkopírován do schránky! 📋');
    }
  };

  const handleDownloadQR = () => {
    if (generatedSharedMaterial?.qrCode) {
      downloadQRCode(generatedSharedMaterial.qrCode, `${material.title}-${clientName}-qr`);
      showSuccess('Hotovo!', 'QR kód stažen! 📥');
    }
  };

  const handleShare = () => {
    if (!generatedSharedMaterial) return;

    const accessInfo = generatedSharedMaterial.accessEndDate
      ? `\n⏰ Dostupné: ${formatDate(generatedSharedMaterial.accessStartDate, { day: 'numeric', month: 'numeric', year: 'numeric' })} - ${formatDate(generatedSharedMaterial.accessEndDate, { day: 'numeric', month: 'numeric', year: 'numeric' })}`
      : `\n⏰ Dostupné od: ${formatDate(generatedSharedMaterial.accessStartDate, { day: 'numeric', month: 'numeric', year: 'numeric' })}`;

    const typeLabel = {
      audio: '🎵 Audio',
      video: '🎬 Video',
      pdf: '📄 PDF',
      document: '📎 Dokument',
      image: '🖼️ Obrázek',
      text: '📝 Text',
      link: '🔗 Odkaz',
    }[material.type] || material.type;

    const text = `🌿 CoachPro Materiál

${material.title}
${material.description || ''}

📚 Typ: ${typeLabel}
🏷️ Kategorie: ${getCategoryLabel(material.category)}${accessInfo}

🔑 Pro přístup zadej tento kód v aplikaci CoachPro:
${generatedSharedMaterial.shareCode}

Nebo naskenuj QR kód, který ti pošlu.

Těším se na tvůj růst! 💚`;

    if (navigator.share) {
      navigator
        .share({
          title: material.title,
          text: text,
        })
        .then(() => {
          showSuccess('Hotovo!', 'Materiál sdílen! 📤');
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            console.error('Share error:', err);
            showError('Chyba', 'Nepodařilo se sdílet materiál');
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
          <DialogTitle>Sdílet materiál s klientkou</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              {/* Material info */}
              <Alert severity="info" sx={{ borderRadius: BORDER_RADIUS.compact }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {material.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {getCategoryLabel(material.category)}
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
              Pošli tento kód klientce <strong>{clientName}</strong>
            </Typography>

            {/* Časové omezení info */}
            {generatedSharedMaterial && (
              <Alert severity="info" sx={{ mb: 3, borderRadius: BORDER_RADIUS.compact }}>
                <Typography variant="caption">
                  ⏰ Dostupné od: {formatDate(generatedSharedMaterial.accessStartDate, { day: 'numeric', month: 'numeric', year: 'numeric' })}
                  {generatedSharedMaterial.accessEndDate && (
                    <> do: {formatDate(generatedSharedMaterial.accessEndDate, { day: 'numeric', month: 'numeric', year: 'numeric' })}</>
                  )}
                  {!generatedSharedMaterial.accessEndDate && <> (neomezeno)</>}
                </Typography>
              </Alert>
            )}

            {/* Material info */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {material.title}
              </Typography>
              {material.description && (
                <Typography variant="body2" color="text.secondary" mb={1}>
                  {material.description}
                </Typography>
              )}
              <Box display="flex" gap={1} justifyContent="center">
                <Chip
                  label={getCategoryLabel(material.category)}
                  size="small"
                  sx={{ borderRadius: BORDER_RADIUS.small }}
                />
              </Box>
            </Box>

            {/* QR kód */}
            {generatedSharedMaterial?.qrCode && (
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
                  src={generatedSharedMaterial.qrCode}
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
                Kód materiálu
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  letterSpacing: 4,
                  fontFamily: 'monospace',
                }}
              >
                {generatedSharedMaterial?.shareCode}
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

export default ShareMaterialModal;
