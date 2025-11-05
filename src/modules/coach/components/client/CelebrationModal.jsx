import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Grid,
  Button,
  Stack,
  TextField,
  Alert,
} from '@mui/material';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Share as ShareIcon, EmojiEvents as TrophyIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material';
import { createBackdrop, createGlassDialog } from '../../../../shared/styles/modernEffects';
import BORDER_RADIUS from '@styles/borderRadius';
import { addProgramFeedback } from '../../utils/storage';
import { useNotification } from '@shared/context/NotificationContext';

const CelebrationModal = ({ open, onClose, program, client }) => {
  const { width, height } = useWindowSize();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { showSuccess, showError } = useNotification();
  const [reflection, setReflection] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  // Přehrát zvuk při otevření (jen při dokončení celého programu)
useEffect(() => {
  if (open && client?.completedDays?.length === program?.duration) {
    const audio = new Audio('/sounds/celebration.mp3');
    audio.volume = 0.5; // 50% hlasitost
    audio.play().catch(err => console.error('Audio play failed:', err));
  }
}, [open, client, program]);

  if (!program || !client) return null;

  const handleComplete = async () => {
    console.log('🔍 handleComplete called');
    console.log('  reflection:', reflection);
    console.log('  client.isAdmin:', client.isAdmin);
    console.log('  program.id:', program.id);

    // Uložit reflexi (pokud je zadána a NENÍ to admin preview)
    if (reflection.trim() && !client.isAdmin) {
      console.log('✅ Ukládám reflexi...');
      setIsSaving(true);
      try {
        const feedback = {
          clientId: client.id,
          clientName: client.name,
          reflection: reflection.trim(),
          timestamp: new Date().toISOString(),
        };

        console.log('📝 Feedback objekt:', feedback);
        const updatedProgram = await addProgramFeedback(program.id, feedback);
        console.log('✅ Program po uložení:', updatedProgram);
        console.log('✅ programFeedback pole:', updatedProgram.programFeedback);
        showSuccess('Uloženo!', 'Tvoje reflexe byla uložena 💚');
      } catch (error) {
        console.error('❌ Error saving reflection:', error);
        showError('Chyba', 'Nepodařilo se uložit reflexi. Zkus to prosím znovu.');
        setIsSaving(false);
        return;
      }
      setIsSaving(false);
    } else {
      console.log('⏭️ Reflexe se neukládá (prázdná nebo admin preview)');
    }

    // Zavřít modal
    onClose();
  };

  const handleShare = () => {
    const text = `🎉 Dokončila jsem program "${program.title}" v aplikaci CoachPro!

✨ ${program.duration} dní intenzivního růstu
🔥 Nejdelší série: ${client.longestStreak} dní
💪 100% dokončeno

Jsem na sebe pyšná! 💚`;

    if (navigator.share) {
      navigator
        .share({
          title: 'Dokončený program',
          text: text,
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            console.error('Share error:', err);
          }
        });
    } else {
      navigator.clipboard.writeText(text);
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
      {/* Confetti */}
      {open && (
        <Confetti
  width={width}
  height={height}
  recycle={true}  // ← Konfety budou padat dokola
  numberOfPieces={800}  // ← Víc kusů (bylo 500)
  duration={5000}  // ← 5 sekund (pak zmizí)
/>
      )}

      <DialogContent sx={{ textAlign: 'center', p: 4 }}>
        {/* Trophy icon */}
        <Box fontSize={80} mb={2}>
          🎉
        </Box>

        <Typography variant="h4" mb={2} sx={{ fontWeight: 700 }}>
          Gratulujeme! 🌟
        </Typography>

        <Typography variant="h6" color="text.secondary" mb={4}>
          Dokončila jsi program "{program.title}"
        </Typography>

        {/* Stats */}
        <Grid container spacing={2} mb={4}>
          <Grid item xs={4}>
            <Box>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                {program.duration}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                dní
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box>
              <Typography variant="h5" color="success.main" sx={{ fontWeight: 700 }}>
                {client.longestStreak}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                nejdelší série
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box>
              <Typography variant="h5" color="secondary.main" sx={{ fontWeight: 700 }}>
                100%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                dokončeno
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="body1" mb={4} color="text.secondary">
          Jsi úžasná! 💚 Tvá koučka je na tebe pyšná.
        </Typography>

        {/* Reflexe input */}
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Napiš nám, jak ses během programu cítila a co sis z něj odnesla... (volitelné)"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          sx={{ mb: client.isAdmin ? 1 : 3 }}
          disabled={client.isAdmin}
        />

        {/* Admin preview info */}
        {client.isAdmin && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: BORDER_RADIUS.compact }}>
            Jsi v admin preview režimu. Reflexe se neuloží.
          </Alert>
        )}

        {/* Actions */}
        <Stack spacing={2}>
          <Button
            variant="contained"
            size="large"
            startIcon={<TrophyIcon />}
            onClick={handleComplete}
            disabled={isSaving}
          >
            {isSaving ? 'Ukládám...' : 'Dokončit'}
          </Button>

          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={handleShare}
          >
            Sdílet úspěch
          </Button>
        </Stack>

        <Typography variant="caption" color="text.secondary" display="block" mt={3}>
          Certifikát dokončení bude implementován v další verzi
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default CelebrationModal;
