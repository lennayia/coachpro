import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  useTheme,
} from '@mui/material';
import { X } from 'lucide-react';
import { formatDate } from '@shared/utils/helpers';
import BORDER_RADIUS from '@styles/borderRadius';
import { createBackdrop, createGlassDialog } from '../../../../shared/styles/modernEffects';

const ProgramFeedbackModal = ({ open, onClose, program }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (!program || !program.programFeedback) return null;

  const feedbacks = program.programFeedback.slice().reverse(); // Nejnovější nahoře

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      BackdropProps={{ sx: createBackdrop() }}
      PaperProps={{ sx: createGlassDialog(isDark, BORDER_RADIUS.dialog) }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Reflexe klientek z programu
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {program.title}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {feedbacks.length === 0 ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            py={4}
          >
            <Typography color="text.secondary">
              Zatím žádné reflexe
            </Typography>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {feedbacks.map((feedback, index) => (
              <Box
                key={feedback.timestamp || index}
                sx={{
                  p: 2,
                  backgroundColor: isDark
                    ? 'rgba(139, 188, 143, 0.08)'
                    : 'rgba(85, 107, 47, 0.05)',
                  border: '1px solid',
                  borderColor: isDark
                    ? 'rgba(139, 188, 143, 0.15)'
                    : 'rgba(85, 107, 47, 0.15)',
                  borderRadius: BORDER_RADIUS.compact,
                }}
              >
                {/* Header: jméno klientky + datum */}
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1.5}
                >
                  <Box display="flex" alignItems="center" gap={0.5}>
                    {feedback.clientName && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: 'primary.main',
                        }}
                      >
                        {feedback.clientName}
                      </Typography>
                    )}
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: '0.7rem' }}
                  >
                    {formatDate(feedback.timestamp, {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Box>

                {/* Reflexe text */}
                <Typography
                  variant="body2"
                  sx={{
                    lineHeight: 1.6,
                    color: 'text.primary',
                  }}
                >
                  {feedback.reflection}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProgramFeedbackModal;
