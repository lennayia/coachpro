import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Stack,
  Alert,
  Chip,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  ContentCopy as ContentCopyIcon,
  QrCode2 as QrCodeIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { downloadQRCode, getCategoryLabel } from '@shared/utils/helpers';
import BORDER_RADIUS from '@styles/borderRadius';
import { useNotification } from '@shared/context/NotificationContext';
import { useTheme } from '@mui/material';
import { createBackdrop, createGlassDialog } from '../../../../shared/styles/modernEffects';

const ShareMaterialModal = ({ open, onClose, sharedMaterial }) => {
  const { showSuccess, showError } = useNotification();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (!sharedMaterial) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sharedMaterial.shareCode);
    showSuccess('Hotovo!', 'Kód zkopírován do schránky! 📋');
  };

  const handleDownloadQR = () => {
    if (sharedMaterial.qrCode) {
      downloadQRCode(sharedMaterial.qrCode, `${sharedMaterial.material.title}-qr-code`);
      showSuccess('Hotovo!', 'QR kód stažen! 📥');
    }
  };

  const handleShare = () => {
    const material = sharedMaterial.material;
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
🏷️ Kategorie: ${getCategoryLabel(material.category)}

🔑 Pro přístup zadej tento kód v aplikaci CoachPro:
${sharedMaterial.shareCode}

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
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(text);
      showSuccess('Hotovo!', 'Text zkopírován! Pošli ho klientce. 📋');
    }
  };

  const material = sharedMaterial.material;

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
          Materiál připraven ke sdílení!
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Pošli tento kód své klientce, aby mohla materiál zobrazit
        </Typography>

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
        {sharedMaterial.qrCode && (
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
              src={sharedMaterial.qrCode}
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
            Kód materiálu
          </Typography>
          <Typography
            variant="h3"
            sx={{
              letterSpacing: 8,
              fontWeight: 'bold',
              color: 'primary.main',
            }}
          >
            {sharedMaterial.shareCode}
          </Typography>
        </Box>

        {/* Info */}
        <Alert severity="info" sx={{ textAlign: 'left', mb: 3 }}>
          Klientka zadá tento kód v aplikaci CoachPro pro přístup k materiálu. Kód můžeš poslat přes
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

          {sharedMaterial.qrCode && (
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
            Sdílet materiál
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

export default ShareMaterialModal;
