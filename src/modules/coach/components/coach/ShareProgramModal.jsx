import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Stack,
  Alert,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  ContentCopy as ContentCopyIcon,
  QrCode2 as QrCodeIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { downloadQRCode } from '@shared/utils/helpers';
import BORDER_RADIUS from '@styles/borderRadius';
import { useNotification } from '@shared/context/NotificationContext';
import { useTheme } from '@mui/material';
import { createBackdrop, createGlassDialog } from '../../../../shared/styles/modernEffects';

const ShareProgramModal = ({ open, onClose, program }) => {
  const { showSuccess, showError } = useNotification();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  if (!program) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(program.shareCode);
    showSuccess('Hotovo!', 'Kód zkopírován do schránky! 📋');
  };

  const handleDownloadQR = () => {
    if (program.qrCode) {
      downloadQRCode(program.qrCode, `${program.title}-qr-code`);
      showSuccess('Hotovo!', 'QR kód stažen! 📥');
    }
  };

  const handleShare = () => {
    const text = `🌿 CoachPro Program

${program.title}
${program.description}

⏱️ Délka: ${program.duration} dní
📚 ${program.days.reduce((acc, day) => acc + (day.materialIds?.length || 0), 0)} materiálů

🔑 Pro přístup zadej tento kód v aplikaci CoachPro:
${program.shareCode}

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
          // User cancelled or error - ignore
          if (err.name !== 'AbortError') {
            console.error('Share error:', err);
            showError('Chyba', 'Nepodařilo se sdílet program');
          }
        });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(text);
      showSuccess('Hotovo!', 'Text zkopírován! Pošli ho klientce. 📋');
    }
  };

  return (
    <Dialog 
  open={open} 
  onClose={onClose} 
  maxWidth="sm" 
  fullWidth
  BackdropProps={{ sx: createBackdrop() }}
  PaperProps={{ sx: createGlassDialog(isDark, BORDER_RADIUS.dialog) }}
>
        <DialogContent sx={{ textAlign: 'center', p: 4 }}>
          {/* Success icon */}
          <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />

          <Typography variant="h5" mb={1} sx={{ fontWeight: 700 }}>
            Program vytvořen! 🎉
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={4}>
            Pošli tento kód své klientce, aby mohla program zahájit
          </Typography>

          {/* QR kód */}
          {program.qrCode && (
            <Box
              sx={{
                p: 3,
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                borderRadius: BORDER_RADIUS.compact,
                mb: 3,
              }}
            >
              <img
                src={program.qrCode}
                alt="QR kód"
                style={{
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
              p: 3,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(143, 188, 143, 0.15)'
                  : 'rgba(85, 107, 47, 0.1)',
              borderRadius: BORDER_RADIUS.compact,
              mb: 3,
            }}
          >
            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
              Kód programu
            </Typography>
            <Typography
              variant="h3"
              sx={{
                letterSpacing: 8,
                fontWeight: 'bold',
                color: 'primary.main',
              }}
            >
              {program.shareCode}
            </Typography>
          </Box>

          {/* Info */}
          <Alert severity="info" sx={{ textAlign: 'left', mb: 3 }}>
            Klientka zadá tento kód v aplikaci CoachPro pro přístup k programu. Kód můžete poslat přes
            WhatsApp, email nebo jinou komunikační platformu.
          </Alert>

          {/* Akce */}
          <Stack spacing={2}>
            <Button
              variant="contained"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopyCode}
              fullWidth
            >
              Zkopírovat kód
            </Button>

            {program.qrCode && (
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadQR}
                fullWidth
              >
                Stáhnout QR kód
              </Button>
            )}

            <Button variant="outlined" startIcon={<ShareIcon />} onClick={handleShare} fullWidth>
              Sdílet program
            </Button>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} fullWidth>
            Zavřít
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default ShareProgramModal;
