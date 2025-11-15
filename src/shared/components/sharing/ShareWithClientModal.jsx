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
import { createBackdrop, createGlassDialog, createPrimaryModalButton, createFormTextField, createCancelButton, createSubmitButton } from '@shared/styles/modernEffects';

/**
 * ShareWithClientModal - Universal modal for sharing content with specific clients
 *
 * Works for materials, programs, card decks with identical logic
 * Based on ShareMaterialModal pattern (the polished reference implementation)
 *
 * @param {boolean} open - Whether modal is open
 * @param {function} onClose - Close handler
 * @param {object} content - Content to share (material, program, or card deck)
 * @param {string} contentType - Type: 'material', 'program', or 'cardDeck'
 * @param {function} onShare - Share handler: (data) => Promise<sharedContent>
 *   - data includes: clientName, clientEmail, accessStartDate, accessEndDate
 *   - Returns: { shareCode, qrCode, ...otherData }
 * @param {function} getShareText - Function to generate share text: (sharedContent) => string
 * @param {function} getContentInfo - Function to get content info display: (content) => { title, subtitle }
 * @param {array} existingShares - Existing shares for duplicate checking (optional)
 * @param {function} checkDuplicate - Custom duplicate checker: (email, content) => existingShare | null
 * @param {function} validateClient - Validates that client exists: (email) => Promise<boolean>
 *
 * @example Material
 * <ShareWithClientModal
 *   open={open}
 *   onClose={onClose}
 *   content={material}
 *   contentType="material"
 *   onShare={async (data) => {
 *     const shared = await createSharedMaterial(material, coachId, data.accessStartDate, data.accessEndDate, data.clientEmail);
 *     return shared;
 *   }}
 *   getShareText={(shared) => `Kód: ${shared.shareCode}`}
 *   getContentInfo={(mat) => ({ title: mat.title, subtitle: mat.type })}
 *   existingShares={allSharedMaterials}
 *   checkDuplicate={(email, mat) => allSharedMaterials.find(sm => sm.materialId === mat.id && sm.clientEmail === email)}
 * />
 */
const ShareWithClientModal = ({
  open,
  onClose,
  content,
  contentType = 'material',
  onShare,
  getShareText,
  getContentInfo,
  existingShares = [],
  checkDuplicate,
  validateClient,
}) => {
  const { showSuccess, showError } = useNotification();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [step, setStep] = useState('form'); // 'form' or 'success'
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [accessStartDate, setAccessStartDate] = useState(new Date());
  const [accessEndDate, setAccessEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sharedContent, setSharedContent] = useState(null);
  const [clientValidationFailed, setClientValidationFailed] = useState(false);

  if (!content) return null;

  const contentInfo = getContentInfo ? getContentInfo(content) : { title: content.title || '', subtitle: '' };

  const handleClose = () => {
    setStep('form');
    setClientName('');
    setClientEmail('');
    setAccessStartDate(new Date());
    setAccessEndDate(null);
    setSharedContent(null);
    setClientValidationFailed(false);
    onClose();
  };

  const handleAddClient = async () => {
    // Import createClientProfile dynamically
    const { createClientProfile } = await import('../../../modules/coach/utils/storage');

    setLoading(true);
    try {
      await createClientProfile(clientName.trim(), clientEmail.trim().toLowerCase());
      showSuccess('Hotovo!', `Klientka ${clientName.trim()} byla přidána do databáze`);
      setClientValidationFailed(false);
      // Now continue with code generation, skip validation and duplicate check (new client, first share)
      await handleGenerateCode(true, true); // Pass skipValidation and skipDuplicateCheck flags
    } catch (error) {
      console.error('Failed to add client:', error);
      showError('Chyba', error.message || 'Nepodařilo se přidat klientku');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCode = async (skipValidation = false, skipDuplicateCheck = false) => {
    // Validation - jméno
    if (!clientName.trim()) {
      showError('Chyba', 'Vyplň jméno klientky');
      return;
    }

    // Validation - e-mail (POVINNÝ pro ověření nároku na přístup k platenému obsahu)
    if (!clientEmail.trim()) {
      showError('Chyba', 'Vyplň e-mail klientky - je potřeba pro ověření nároku na přístup k platenému obsahu');
      return;
    }

    const normalizedEmail = clientEmail.trim().toLowerCase();

    // E-mail format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      showError('Chyba', 'Zadej platnou e-mailovou adresu');
      return;
    }

    // Client existence validation - klientka MUSÍ existovat v databázi (má zaplaceno členství/program)
    // Skip validation if we just created the client
    if (!skipValidation && validateClient) {
      const clientExists = await validateClient(normalizedEmail);
      if (!clientExists) {
        setClientValidationFailed(true);
        showError(
          'Klientka neexistuje',
          `Klientka s e-mailem ${normalizedEmail} není v databázi. Klikni na "Přidat klientku" pro přidání do systému.`
        );
        setLoading(false);
        return;
      }
    }

    // Reset validation flag if it was set before
    setClientValidationFailed(false);

    // Duplicate check - kontrola, jestli už není sdíleno s touto klientkou
    // Skip duplicate check if we just created the client (first share with new client)
    if (!skipDuplicateCheck && checkDuplicate) {
      const existingShare = await checkDuplicate(normalizedEmail, content);
      if (existingShare) {
        showError(
          `${contentType === 'material' ? 'Materiál' : contentType === 'program' ? 'Program' : 'Balíček karet'} už je sdílený`,
          `S touto klientkou (${normalizedEmail}) už máš sdílený tento obsah. Kód: ${existingShare.shareCode}`
        );
        return;
      }
    }

    setLoading(true);
    try {
      // Call parent's share handler
      const shared = await onShare({
        clientName: clientName.trim(),
        clientEmail: normalizedEmail,
        accessStartDate: accessStartDate ? accessStartDate.toISOString() : null,
        accessEndDate: accessEndDate ? accessEndDate.toISOString() : null,
      });

      setSharedContent(shared);
      setStep('success');
      showSuccess('Hotovo! 🎉', `Kód pro ${clientName.trim()} byl vytvořen`);
    } catch (error) {
      console.error('Failed to generate code:', error);
      showError('Chyba', error.message || 'Nepodařilo se vytvořit kód. Zkus to prosím znovu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (sharedContent?.shareCode) {
      navigator.clipboard.writeText(sharedContent.shareCode);
      showSuccess('Hotovo!', 'Kód zkopírován do schránky! 📋');
    }
  };

  const handleDownloadQR = () => {
    if (sharedContent?.qrCode) {
      const filename = `${content.title || 'shared'}-${clientName}-qr`;
      downloadQRCode(sharedContent.qrCode, filename);
      showSuccess('Hotovo!', 'QR kód stažen! 📥');
    }
  };

  const handleShare = () => {
    if (!sharedContent) return;

    const text = getShareText ? getShareText(sharedContent) : `Kód: ${sharedContent.shareCode}`;

    if (navigator.share) {
      navigator
        .share({
          title: contentInfo.title,
          text: text,
        })
        .then(() => {
          showSuccess('Hotovo!', 'Obsah sdílen! 📤');
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            console.error('Share error:', err);
            showError('Chyba', 'Nepodařilo se sdílet obsah');
          }
        });
    } else {
      navigator.clipboard.writeText(text);
      showSuccess('Hotovo!', 'Text zkopírován! Pošli ho klientce. 📋');
    }
  };

  const contentTypeLabel = {
    material: 'materiál',
    program: 'program',
    cardDeck: 'balíček karet',
  }[contentType] || 'obsah';

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      key={`share-modal-${content?.id || 'new'}`}
      BackdropProps={{ sx: createBackdrop() }}
      PaperProps={{ sx: createGlassDialog(isDark, BORDER_RADIUS.dialog) }}
    >
      {step === 'form' ? (
        <>
          {/* KROK 1: Formulář */}
          <DialogTitle>Sdílet {contentTypeLabel} s klientkou</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              {/* Content info */}
              <Alert severity="info" sx={{ borderRadius: BORDER_RADIUS.compact }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {contentInfo.title}
                </Typography>
                {contentInfo.subtitle && (
                  <Typography variant="caption" color="text.secondary">
                    {contentInfo.subtitle}
                  </Typography>
                )}
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

              {/* E-mail klientky (POVINNÝ) */}
              <TextField
                label="E-mail klientky"
                fullWidth
                required
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="jana@example.com"
                disabled={loading}
                helperText="Povinný pro ověření nároku na přístup k platenému obsahu"
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

            {/* Show "Add Client" button if validation failed */}
            {clientValidationFailed && (
              <Button
                variant="outlined"
                onClick={handleAddClient}
                disabled={loading || !clientName.trim() || !clientEmail.trim()}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{
                  borderRadius: BORDER_RADIUS.compact,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  borderColor: isDark ? 'rgba(139, 188, 143, 0.3)' : 'rgba(85, 107, 47, 0.3)',
                  color: isDark ? 'rgba(139, 188, 143, 0.95)' : 'rgba(85, 107, 47, 0.95)',
                  '&:hover': {
                    borderColor: isDark ? 'rgba(139, 188, 143, 0.5)' : 'rgba(85, 107, 47, 0.5)',
                    backgroundColor: isDark ? 'rgba(139, 188, 143, 0.08)' : 'rgba(85, 107, 47, 0.08)',
                  },
                }}
              >
                {loading ? 'Přidávám...' : 'Přidat klientku'}
              </Button>
            )}

            <Button
              variant="contained"
              onClick={() => handleGenerateCode()}
              disabled={loading || !clientName.trim() || !clientEmail.trim()}
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
              Kód je vytvořený!
            </Typography>

            <Typography variant="body2" color="text.secondary" mb={2}>
              Pošli tento kód klientce <strong>{sharedContent?.clientName || clientName}</strong>
            </Typography>

            {/* Časové omezení info */}
            {sharedContent && (
              <Alert severity="info" sx={{ mb: 3, borderRadius: BORDER_RADIUS.compact }}>
                <Typography variant="caption">
                  ⏰ Dostupné od: {formatDate(sharedContent.accessStartDate || accessStartDate, { day: 'numeric', month: 'numeric', year: 'numeric' })}
                  {(sharedContent.accessEndDate || accessEndDate) && (
                    <> do: {formatDate(sharedContent.accessEndDate || accessEndDate, { day: 'numeric', month: 'numeric', year: 'numeric' })}</>
                  )}
                  {!(sharedContent.accessEndDate || accessEndDate) && <> (neomezeno)</>}
                </Typography>
              </Alert>
            )}

            {/* QR kód */}
            {sharedContent?.qrCode && (
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
                  src={sharedContent.qrCode}
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
                Kód {contentTypeLabel}u
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  letterSpacing: 4,
                  fontFamily: 'monospace',
                }}
              >
                {sharedContent?.shareCode}
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
              {sharedContent?.qrCode && (
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
              )}
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

export default ShareWithClientModal;
