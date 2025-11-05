import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  User,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
  Activity,
} from 'lucide-react';
import { formatDate } from '@shared/utils/helpers';
import BORDER_RADIUS from '@styles/borderRadius';
import { createBackdrop, createGlassDialog } from '@shared/styles/modernEffects';
import BaseCard from '@shared/components/cards/BaseCard';
import { isTouchDevice, createSwipeHandlers, createLongPressHandler } from '@shared/utils/touchHandlers';

/**
 * ClientCard - Reusable komponenta pro zobrazení karty klientky
 * Refactorováno na BaseCard pattern (5.11.2025)
 */
const ClientCard = ({ client, program, onViewDetails }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isTouch = isTouchDevice();
  const [detailOpen, setDetailOpen] = useState(false);

  // Calculate progress
  const totalDays = program?.duration || 0;
  const completedDays = client?.completedDays?.length || 0;
  const progressPercent = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
  const isCompleted = completedDays === totalDays && totalDays > 0;

  // Status
  const getStatus = () => {
    if (isCompleted) return { label: 'Dokončeno', color: 'success', active: true };
    if (completedDays === 0) return { label: 'Nová', color: 'secondary', active: true };
    if (completedDays > 0) return { label: 'Aktivní', color: 'primary', active: true };
    return { label: 'Neaktivní', color: 'primary', active: false };
  };

  const status = getStatus();

  // Touch gestures - Long press pro detail
  const longPressHandlers = createLongPressHandler({
    onLongPress: () => {
      if (isTouch) {
        setDetailOpen(true);
      }
    },
    delay: 600,
  });

  // Row 1: User avatar (large icon)
  const largeIcon = (
    <IconButton
      sx={{
        p: 0,
        ml: -0.5,
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: isDark
          ? 'rgba(139, 188, 143, 0.15)'
          : 'rgba(85, 107, 47, 0.1)',
      }}
    >
      <User size={24} color={theme.palette.primary.main} />
    </IconButton>
  );

  // Row 2: Datum začátku s Calendar ikonou (vpravo)
  const startDateChip = {
    label: formatDate(client?.startedAt, { month: 'numeric', year: 'numeric' }) || 'Neznámé',
    icon: <Calendar size={14} />,
    color: 'secondary',
  };

  // Row 3: Metadata
  const metadataItems = [
    {
      label: `Den ${client?.currentDay || 1}`,
    },
    {
      label: `${client?.completedDays?.length || 0}× série`,
    },
    {
      label: `${completedDays}/${totalDays} dní`,
    },
  ];

  // Row 5: Title = Jméno klientky
  const title = client?.name || 'Nepojmenovaná klientka';

  // Row 6: Description = Název programu
  const description = program?.title || 'Neznámý program';

  // Row 7: Progress bar jako taxonomy chips area
  const progressBar = (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={0.5}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
          Postup
        </Typography>
        <Typography variant="caption" fontWeight={600} sx={{ fontSize: '0.7rem' }}>
          {Math.round(progressPercent)}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progressPercent}
        sx={{
          height: 6,
          borderRadius: BORDER_RADIUS.minimal,
          backgroundColor: isDark
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)',
          '& .MuiLinearProgress-bar': {
            borderRadius: BORDER_RADIUS.minimal,
            background: isCompleted
              ? 'linear-gradient(90deg, #8FBC8F 0%, #6B8E23 100%)'
              : 'linear-gradient(90deg, #8FBC8F 0%, #9ACD32 100%)',
          },
        }}
      />
    </Box>
  );

  return (
    <>
      <BaseCard
        // Row 1: User avatar (vlevo) + Status chip + Datum začátku (vpravo)
        largeIcon={largeIcon}
        chips={[status, startDateChip]}

        // Row 3: Metadata
        metadata={metadataItems}

        // Row 4: Link/File (prázdné)
        linkOrFile={null}

        // Row 5: Title (jméno klientky)
        title={title}

        // Row 6: Description (název programu)
        description={description}

        // Row 7: Progress bar
        taxonomyOrAvailability={progressBar}

        // Row 8: Detail button
        onClientPreview={() => setDetailOpen(true)}

        // Row 9: Feedback (prázdné zatím)
        feedbackData={null}

        // Other props
        longPressHandlers={longPressHandlers}
        minHeight={280}
        glassEffect="subtle"
      />

      {/* Detail Dialog */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        maxWidth="sm"
        fullWidth
        BackdropProps={{ sx: createBackdrop() }}
        PaperProps={{ sx: createGlassDialog(isDark, BORDER_RADIUS.dialog) }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1.5}>
            <User size={24} color={theme.palette.primary.main} />
            <Box>
              <Typography variant="h6">{client?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Detail klientky
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ py: 3 }}>
          {/* Program Info */}
          <Box mb={3}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Program
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {program?.title || 'Neznámý program'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {program?.description || 'Bez popisu'}
            </Typography>
          </Box>

          {/* Progress */}
          <Box mb={3}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Postup
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <LinearProgress
                variant="determinate"
                value={progressPercent}
                sx={{
                  flex: 1,
                  height: 10,
                  borderRadius: BORDER_RADIUS.small,
                }}
              />
              <Typography variant="body2" fontWeight={600}>
                {Math.round(progressPercent)}%
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {completedDays} z {totalDays} dní dokončeno
            </Typography>
          </Box>

          {/* Dates */}
          <Box mb={3}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Data
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <Calendar size={16} color={theme.palette.text.secondary} />
                <Typography variant="body2">
                  Začátek: {formatDate(client?.startedAt, { month: 'numeric', year: 'numeric' }) || 'Neznámé'}
                </Typography>
              </Box>
              {client?.completedAt && (
                <Box display="flex" alignItems="center" gap={1}>
                  <CheckCircle2 size={16} color={theme.palette.success.main} />
                  <Typography variant="body2">
                    Dokončení: {formatDate(client?.completedAt, { month: 'numeric', year: 'numeric' })}
                  </Typography>
                </Box>
              )}
              <Box display="flex" alignItems="center" gap={1}>
                <Activity size={16} color={theme.palette.text.secondary} />
                <Typography variant="body2">
                  Aktuální den: {client?.currentDay || 1}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Mood Checks */}
          {client?.moodChecks && client.moodChecks.length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Nálady ({client.moodChecks.length})
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                {client.moodChecks.slice(-3).map((mood, index) => (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                      p: 1.5,
                      borderRadius: BORDER_RADIUS.small,
                      backgroundColor: isDark
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.03)',
                    }}
                  >
                    <Typography variant="body2">Den {mood.day}</Typography>
                    <Box display="flex" gap={2}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Typography variant="body2" color="text.secondary">
                          Před:
                        </Typography>
                        <Typography variant="h6">{mood.before}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Typography variant="body2" color="text.secondary">
                          Po:
                        </Typography>
                        <Typography variant="h6">{mood.after}</Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDetailOpen(false)}
            variant="outlined"
            sx={{ borderRadius: BORDER_RADIUS.compact }}
          >
            Zavřít
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClientCard;
