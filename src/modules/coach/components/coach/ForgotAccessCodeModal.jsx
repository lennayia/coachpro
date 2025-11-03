import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { X as CloseIcon, Key as KeyIcon } from 'lucide-react';
import { supabase } from '@shared/config/supabase';
import { useNotification } from '@shared/context/NotificationContext';
import { useTheme } from '@mui/material';
import { createBackdrop, createGlassDialog } from '../../../../shared/styles/modernEffects';
import BORDER_RADIUS from '@styles/borderRadius';

const ForgotAccessCodeModal = ({ open, onClose }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { showSuccess, showError } = useNotification();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [foundCode, setFoundCode] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFoundCode(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Vyplň prosím platný email');
      return;
    }

    setLoading(true);

    try {
      // Najdi testera v Supabase podle emailu
      const { data: tester, error: supabaseError } = await supabase
        .from('testers')
        .select('access_code, name, email')
        .eq('email', email.trim().toLowerCase())
        .single();

      if (supabaseError || !tester) {
        setError('Email nebyl nalezen v databázi testerek. Zkontroluj prosím, že jsi zadala správný email.');
        showError('Email nenalezen', 'Tento email není registrován jako beta testerka');
        setLoading(false);
        return;
      }

      // Úspěch - zobraz access code
      setFoundCode(tester.access_code);
      showSuccess('Nalezeno! 🎉', `Access code pro ${tester.name} byl nalezen`);
    } catch (err) {
      console.error('Error finding access code:', err);
      setError('Něco se pokazilo. Zkus to prosím znovu.');
      showError('Chyba', 'Nepodařilo se najít access code');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(foundCode);
    showSuccess('Zkopírováno!', 'Access code byl zkopírován do schránky 📋');
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setFoundCode(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      BackdropProps={{
        sx: createBackdrop()
      }}
      PaperProps={{
        sx: createGlassDialog(isDark, BORDER_RADIUS.dialog)
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={600}>
            Zapomněl jsem access kód
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {!foundCode ? (
          // Form pro zadání emailu
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Zadej email, se kterým ses registrovala. Zobrazíme ti tvůj access code.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: BORDER_RADIUS.compact }}>
                {error}
              </Alert>
            )}

            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="tvuj@email.cz"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: BORDER_RADIUS.compact,
                }
              }}
            />

            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button
                onClick={handleClose}
                disabled={loading}
                sx={{
                  borderRadius: BORDER_RADIUS.compact,
                }}
              >
                Zrušit
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !email.trim()}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <KeyIcon size={20} />}
                sx={{
                  borderRadius: BORDER_RADIUS.compact,
                }}
              >
                {loading ? 'Hledám...' : 'Najít kód'}
              </Button>
            </Box>
          </Box>
        ) : (
          // Zobrazení nalezeného kódu
          <Box>
            <Alert severity="success" sx={{ mb: 3, borderRadius: BORDER_RADIUS.compact }}>
              Tvůj access code byl nalezen! 🎉
            </Alert>

            <Typography variant="body2" color="text.secondary" mb={2}>
              Tvůj access code pro přihlášení:
            </Typography>

            <Box
              sx={{
                p: 3,
                backgroundColor: isDark
                  ? 'rgba(139, 188, 143, 0.15)'
                  : 'rgba(139, 188, 143, 0.1)',
                borderRadius: BORDER_RADIUS.card,
                mb: 3,
                textAlign: 'center',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  letterSpacing: '3px',
                  color: 'primary.main',
                }}
              >
                {foundCode}
              </Typography>
            </Box>

            <Alert severity="warning" sx={{ mb: 3, borderRadius: BORDER_RADIUS.compact }}>
              ⚠️ <strong>Ulož si ho tentokrát!</strong> Doporučujeme uložit do poznámek nebo vyfotit.
            </Alert>

            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={handleCopyCode}
                sx={{
                  borderRadius: BORDER_RADIUS.compact,
                }}
              >
                Zkopírovat kód
              </Button>
              <Button
                variant="contained"
                onClick={handleClose}
                sx={{
                  borderRadius: BORDER_RADIUS.compact,
                }}
              >
                Zavřít
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotAccessCodeModal;
