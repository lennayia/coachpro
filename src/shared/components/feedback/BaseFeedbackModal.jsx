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
} from '../../styles/modernEffects';
import BORDER_RADIUS from '@styles/borderRadius';

const MOOD_MARKS = [
  { value: 1, label: '😫' },
  { value: 2, label: '😐' },
  { value: 3, label: '😊' },
  { value: 4, label: '😄' },
  { value: 5, label: '🥳' },
];

/**
 * BaseFeedbackModal - Sdílená komponenta pro sběr zpětné vazby
 *
 * @param {boolean} open - Modal open state
 * @param {function} onClose - Close handler
 * @param {object} client - Client object
 * @param {function} onSave - Save handler (receives feedback object)
 * @param {string} title - Dialog title
 * @param {string} emoji - Emoji in title
 * @param {string} contextLabel - Context prefix ("Po poslechu:", "Po dokončení programu:")
 * @param {string} contextValue - Context value (material.title, program.title)
 * @param {string} moodLabel - Mood slider label
 * @param {string} textFieldLabel - TextField label
 * @param {string} textFieldPlaceholder - TextField placeholder
 * @param {number} textFieldRows - TextField rows (default: 5)
 * @param {number} maxLength - Max character length (default: 500)
 * @param {string} successTitle - Success toast title
 * @param {string} successMessage - Success toast message
 * @param {string} buttonText - Submit button text
 */
const BaseFeedbackModal = ({
  open,
  onClose,
  client,
  onSave,
  title,
  emoji,
  contextLabel,
  contextValue,
  moodLabel,
  textFieldLabel,
  textFieldPlaceholder,
  textFieldRows = 5,
  maxLength = 500,
  successTitle,
  successMessage,
  buttonText,
}) => {
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
      showSuccess(successTitle, successMessage);

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
            {title}
          </Typography>
          <Typography variant="h5">{emoji}</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Context */}
          {contextValue && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, fontStyle: 'italic' }}
            >
              {contextLabel} {contextValue}
            </Typography>
          )}

          {/* Mood Slider */}
          <Typography variant="body1" gutterBottom sx={{ mb: 2, fontWeight: 500 }}>
            {moodLabel}
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
            label={textFieldLabel}
            multiline
            rows={textFieldRows}
            fullWidth
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder={textFieldPlaceholder}
            disabled={loading}
            helperText={`${reflection.length}/${maxLength} znaků`}
            inputProps={{ maxLength }}
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
          {loading ? 'Ukládám...' : buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BaseFeedbackModal;
