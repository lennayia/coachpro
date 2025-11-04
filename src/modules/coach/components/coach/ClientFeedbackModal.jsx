import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import { X } from 'lucide-react';
import { formatDate } from '@shared/utils/helpers';
import BORDER_RADIUS from '@styles/borderRadius';
import { createBackdrop, createGlassDialog } from '../../../../shared/styles/modernEffects';

const MOOD_EMOJIS = ['😫', '😐', '😊', '😄', '🥳'];

const ClientFeedbackModal = ({ open, onClose, material }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (!material || !material.clientFeedback) return null;

  const feedbacks = material.clientFeedback.slice().reverse(); // Nejnovější nahoře

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
              Reflexe klientek
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {material.title}
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
            {feedbacks.map((feedback, index) => {
              const moodEmoji = MOOD_EMOJIS[feedback.moodAfter - 1];

              return (
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
                  {/* Header: emoji + datum */}
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={1.5}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h5">
                        {moodEmoji}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: 'primary.main',
                          }}
                        >
                          Nálada: {feedback.moodAfter}/5
                        </Typography>
                        {feedback.clientName && (
                          <>
                            <Typography variant="caption" color="text.secondary">
                              •
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 500,
                                color: 'text.secondary',
                              }}
                            >
                              {feedback.clientName}
                            </Typography>
                          </>
                        )}
                      </Box>
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

                  {/* TODO: Coach response section (Sprint 21.3) */}
                  {/* <Box mt={2}>
                    <Button size="small" startIcon={<MessageSquare size={14} />}>
                      Reagovat
                    </Button>
                  </Box> */}
                </Box>
              );
            })}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClientFeedbackModal;
