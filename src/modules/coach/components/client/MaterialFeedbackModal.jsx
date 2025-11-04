import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Slider,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material';
import { useNotification } from '@shared/context/NotificationContext';
import {
  createBackdrop,
  createGlassDialog,
  createSubmitButton,
  createCancelButton,
} from '../../../../shared/styles/modernEffects';
import BORDER_RADIUS from '@styles/borderRadius';

const MOOD_MARKS = [
  { value: 1, label: '😫' },
  { value: 2, label: '😐' },
  { value: 3, label: '😊' },
  { value: 4, label: '😄' },
  { value: 5, label: '🥳' },
];

const MaterialFeedbackModal = ({ open, onClose, material, client, onSave }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { showSuccess, showError } = useNotification();

  const [moodAfter, setMoodAfter] = useState(3);
  const [reflection, setReflection] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    // Validace
    if (!reflection.trim()) {
      showError('Chyba', 'Napiš prosím alespoň pár slov reflexe');
      return;
    }

    setLoading(true);
    try {
      const feedback = {
        clientId: client?.id || null,
        clientName: client?.name || 'Neznámá klientka',
        moodAfter,
        reflection: reflection.trim(),
        timestamp: new Date().toISOString(),
      };

      await onSave(feedback);
      showSuccess('Uloženo! ✓', 'Tvoje reflexe byla uložena');

      // Reset form
      setMoodAfter(3);
      setReflection('');
      onClose();
    } catch (error) {
      console.error('Failed to save feedback:', error);
      showError('Chyba', 'Nepodařilo se uložit reflexi. Zkus to prosím znovu.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setMoodAfter(3);
      setReflection('');
      onClose();
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
        <Box display="flex" alignItems="center" gap={1.5}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Jak se teď cítíš?
          </Typography>
          <Typography variant="h5">🌿</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Material title */}
          {material && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, fontStyle: 'italic' }}
            >
              Po poslechu: {material.title}
            </Typography>
          )}

          {/* Mood Slider */}
          <Typography variant="body1" gutterBottom sx={{ mb: 2, fontWeight: 500 }}>
            Tvoje nálada po poslechu:
          </Typography>
          <Slider
            value={moodAfter}
            onChange={(e, newValue) => setMoodAfter(newValue)}
            min={1}
            max={5}
            step={1}
            marks={MOOD_MARKS}
            disabled={loading}
            sx={{
              mb: 5,
              '& .MuiSlider-markLabel': {
                fontSize: '1.5rem',
                top: 32,
              },
              '& .MuiSlider-mark': {
                display: 'none',
              },
            }}
          />

          {/* Reflection */}
          <TextField
            label="Co sis všimla během meditace?"
            multiline
            rows={5}
            fullWidth
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Např. Všimla jsem si, že mé myšlenky byly klidnější než obvykle..."
            disabled={loading}
            helperText={`${reflection.length}/500 znaků`}
            inputProps={{ maxLength: 500 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: BORDER_RADIUS.compact,
              },
            }}
          />
        </Box>
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
          onClick={handleSave}
          disabled={loading || !reflection.trim()}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={createSubmitButton(isDark)}
        >
          {loading ? 'Ukládám...' : 'Uložit reflexi'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MaterialFeedbackModal;
