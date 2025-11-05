import { useState, useEffect } from 'react';
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
  Autocomplete,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  ContentCopy as ContentCopyIcon,
  QrCode2 as QrCodeIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { cs } from 'date-fns/locale';
import { downloadQRCode, formatDate } from '@shared/utils/helpers';
import BORDER_RADIUS from '@styles/borderRadius';
import { useNotification } from '@shared/context/NotificationContext';
import { useTheme } from '@mui/material';
import {
  createBackdrop,
  createGlassDialog,
  createFormTextField,
  createCancelButton,
  createSubmitButton,
} from '@shared/styles/modernEffects';
import { generateUUID, generateShareCode, generateQRCode } from '../../utils/generateCode';
import { getCurrentUser, getClients } from '../../utils/storage';
import { supabase } from '@shared/config/supabase';

const ShareCardDeckModal = ({ open, onClose, deck }) => {
  const { showSuccess, showError } = useNotification();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const currentUser = getCurrentUser();

  const [step, setStep] = useState('form'); // 'form' or 'success'
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [accessStartDate, setAccessStartDate] = useState(new Date());
  const [accessEndDate, setAccessEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);

  // Načti klientky při otevření
  useEffect(() => {
    if (open) {
      loadClients();
    }
  }, [open]);

  const loadClients = async () => {
    try {
      const data = await getClients();
      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
      showError('Chyba', 'Nepodařilo se načíst klientky');
    }
  };

  if (!deck) return null;

  const handleClose = () => {
    setStep('form');
    setSelectedClient(null);
    setAccessStartDate(new Date());
    setAccessEndDate(null);
    setGeneratedData(null);
    onClose();
  };

  const handleGenerateCode = async () => {
    // Validace
    if (!selectedClient) {
      showError('Chyba', 'Vyber klientku');
      return;
    }

    setLoading(true);
    try {
      // 1. Generuj shareCode a QR
      const shareCode = generateShareCode();
      const qrCode = await generateQRCode(shareCode);

      // 2. Vytvoř deck záznam (pokud ještě neexistuje)
      const deckId = `deck-${deck.id}-${Date.now()}`;

      const { error: deckError } = await supabase
        .from('coachpro_card_decks')
        .insert({
          id: deckId,
          coach_id: currentUser.id,
          title: deck.title,
          description: deck.subtitle,
          motiv: deck.motiv,
          cyklus: deck.cyklus,
          card_ids: deck.cards.map((c) => c.id),
          share_code: shareCode,
          qr_code: qrCode,
          is_active: true,
        });

      if (deckError) throw deckError;

      // 3. Vytvoř shared deck záznam
      const sharedDeckId = generateUUID();

      const { error: sharedError } = await supabase
        .from('coachpro_shared_card_decks')
        .insert({
          id: sharedDeckId,
          client_id: selectedClient.id,
          client_name: selectedClient.name,
          deck_id: deckId,
          share_code: shareCode,
          access_start_date: accessStartDate ? accessStartDate.toISOString() : null,
          access_end_date: accessEndDate ? accessEndDate.toISOString() : null,
        });

      if (sharedError) throw sharedError;

      // 4. Ulož pro zobrazení
      setGeneratedData({
        shareCode,
        qrCode,
        clientName: selectedClient.name,
        deckId,
        sharedDeckId,
      });

      setStep('success');
      showSuccess('Hotovo! 🎉', `Kód pro ${selectedClient.name} byl vytvořen`);
    } catch (error) {
      console.error('Failed to share deck:', error);
      showError('Chyba', 'Nepodařilo se vytvořit kód. Zkus to prosím znovu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (generatedData) {
      navigator.clipboard.writeText(generatedData.shareCode);
      showSuccess('Hotovo!', 'Kód zkopírován do schránky! 📋');
    }
  };

  const handleDownloadQR = () => {
    if (generatedData?.qrCode) {
      downloadQRCode(generatedData.qrCode, `${deck.title}-${generatedData.clientName}-qr`);
      showSuccess('Hotovo!', 'QR kód stažen! 📥');
    }
  };

  const getShareText = () => {
    if (!generatedData) return '';

    const accessInfo = generatedData.accessEndDate
      ? `\n⏰ Dostupné: ${formatDate(accessStartDate, { day: 'numeric', month: 'numeric', year: 'numeric' })} - ${formatDate(accessEndDate, { day: 'numeric', month: 'numeric', year: 'numeric' })}`
      : `\n⏰ Dostupné od: ${formatDate(accessStartDate, { day: 'numeric', month: 'numeric', year: 'numeric' })}`;

    return `🌿 CoachPro - Koučovací karty

${deck.title}
${deck.subtitle}

📚 ${deck.cardCount} karet${accessInfo}

🔑 Pro přístup zadej tento kód v aplikaci CoachPro:
${generatedData.shareCode}

Nebo naskenuj QR kód, který ti pošlu.

Těším se na tvůj růst! 💚`;
  };

  const handleEmail = () => {
    if (!generatedData) return;

    const subject = encodeURIComponent(`${deck.title} - Koučovací karty`);
    const body = encodeURIComponent(getShareText());
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;
    showSuccess('Hotovo!', 'Email klient otevřen! 📧');
  };

  const handleShare = () => {
    if (!generatedData) return;

    const text = getShareText();

    if (navigator.share) {
      navigator
        .share({
          title: deck.title,
          text: text,
        })
        .then(() => {
          showSuccess('Hotovo!', 'Balíček sdílen! 📤');
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            console.error('Share error:', err);
            showError('Chyba', 'Sdílení se nezdařilo');
          }
        });
    } else {
      navigator.clipboard.writeText(text);
      showSuccess('Hotovo!', 'Text zkopírován do schránky!');
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
      <DialogTitle>
        <Typography component="div" variant="h6" sx={{ fontWeight: 600 }}>
          {step === 'form' ? 'Sdílet balíček karet' : 'Kód vygenerován! ✨'}
        </Typography>
        <Typography component="div" variant="body2" color="text.secondary">
          {step === 'form' ? deck.title : `Pro ${generatedData?.clientName}`}
        </Typography>
      </DialogTitle>

      <DialogContent>
        {step === 'form' ? (
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Autocomplete
              options={clients}
              getOptionLabel={(option) => option.name || ''}
              getOptionKey={(option) => option.id}
              value={selectedClient}
              onChange={(event, newValue) => setSelectedClient(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Vybrat klientku"
                  required
                  autoFocus
                  sx={createFormTextField(isDark)}
                />
              )}
              fullWidth
              isOptionEqualToValue={(option, value) => option.id === value.id}
              noOptionsText="Žádné klientky"
            />

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={cs}>
              <DatePicker
                label="Přístup od"
                value={accessStartDate}
                onChange={setAccessStartDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: createFormTextField(isDark),
                  },
                }}
              />

              <DatePicker
                label="Přístup do (volitelné)"
                value={accessEndDate}
                onChange={setAccessEndDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: createFormTextField(isDark),
                  },
                }}
              />
            </LocalizationProvider>

            <Alert severity="info" sx={{ borderRadius: BORDER_RADIUS.compact }}>
              Balíček obsahuje <strong>{deck.cardCount} karet</strong>. Klientka bude moci karty
              opakovaně otevírat a pracovat s nimi.
            </Alert>
          </Stack>
        ) : (
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Kód */}
            <Box
              sx={{
                p: 3,
                background: isDark
                  ? 'linear-gradient(135deg, rgba(139, 188, 143, 0.1) 0%, rgba(111, 184, 118, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(65, 117, 47, 0.1) 0%, rgba(90, 154, 72, 0.1) 100%)',
                borderRadius: BORDER_RADIUS.card,
                border: `1px solid ${isDark ? 'rgba(139, 188, 143, 0.3)' : 'rgba(65, 117, 47, 0.3)'}`,
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Sdílený kód
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  letterSpacing: 4,
                  color: isDark ? '#8BC98F' : '#417530',
                }}
              >
                {generatedData?.shareCode}
              </Typography>
            </Box>

            {/* QR kód */}
            {generatedData?.qrCode && (
              <Box sx={{ textAlign: 'center' }}>
                <img
                  src={generatedData.qrCode}
                  alt="QR Code"
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: BORDER_RADIUS.card,
                    border: `2px solid ${isDark ? 'rgba(139, 188, 143, 0.3)' : 'rgba(65, 117, 47, 0.3)'}`,
                  }}
                />
              </Box>
            )}

            {/* Akční tlačítka */}
            <Stack spacing={1}>
              <Button
                variant="outlined"
                startIcon={<ContentCopyIcon />}
                onClick={handleCopyCode}
                fullWidth
              >
                Zkopírovat kód
              </Button>

              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadQR}
                fullWidth
              >
                Stáhnout QR kód
              </Button>

              <Button
                variant="outlined"
                startIcon={<EmailIcon />}
                onClick={handleEmail}
                fullWidth
              >
                Poslat e-mailem
              </Button>

              <Button
                variant="contained"
                startIcon={<ShareIcon />}
                onClick={handleShare}
                fullWidth
                sx={{
                  background: isDark
                    ? 'linear-gradient(135deg, #8BC98F 0%, #6FB876 100%)'
                    : 'linear-gradient(135deg, #417530 0%, #5A9A48 100%)',
                }}
              >
                Sdílet s klientkou
              </Button>
            </Stack>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {step === 'form' ? (
          <>
            <Button onClick={handleClose} sx={createCancelButton(isDark)}>
              Zrušit
            </Button>
            <Button
              onClick={handleGenerateCode}
              disabled={loading || !selectedClient}
              sx={createSubmitButton(isDark)}
              startIcon={loading ? <CircularProgress size={16} /> : <CheckCircleIcon />}
            >
              {loading ? 'Vytvářím...' : 'Vygenerovat kód'}
            </Button>
          </>
        ) : (
          <Button onClick={handleClose} fullWidth sx={createSubmitButton(isDark)}>
            Zavřít
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ShareCardDeckModal;
