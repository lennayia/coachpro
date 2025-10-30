import { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  User,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
  Activity,
  Eye,
} from 'lucide-react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import BORDER_RADIUS from '@styles/borderRadius';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import { createBackdrop, createGlassDialog } from '../../../../shared/styles/modernEffects';

/**
 * ClientCard - Reusable komponenta pro zobrazení karty klientky
 *
 * @param {Object} client - Client object z localStorage
 * @param {Object} program - Program object (pro zobrazení názvu programu)
 * @param {Function} onViewDetails - Callback při kliknutí na detail
 */
const ClientCard = ({ client, program, onViewDetails }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery('(max-width:600px)');
  const [detailOpen, setDetailOpen] = useState(false);

  // Calculate progress
  const totalDays = program?.duration || 0;
  const completedDays = client?.completedDays?.length || 0;
  const progressPercent = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
  const isCompleted = completedDays === totalDays && totalDays > 0;

  // Calculate streak
  const currentStreak = client?.completedDays?.length || 0;

  // Status
  const getStatus = () => {
    if (isCompleted) return { label: 'Dokončeno', color: 'success' };
    if (currentStreak === 0) return { label: 'Nová', color: 'info' };
    if (currentStreak > 0) return { label: 'Aktivní', color: 'primary' };
    return { label: 'Neaktivní', color: 'default' };
  };

  const status = getStatus();

  // Format dates
  const startedDate = client?.startedAt
    ? format(new Date(client.startedAt), 'd. MMMM yyyy', { locale: cs })
    : 'Neznámé';

  const completedDate = client?.completedAt
    ? format(new Date(client.completedAt), 'd. MMMM yyyy', { locale: cs })
    : null;

  // Handle card click
  const handleCardClick = () => {
    setDetailOpen(true);
    if (onViewDetails) {
      onViewDetails(client);
    }
  };

  return (
    <>
      <Card
        onClick={handleCardClick}
        sx={{
          cursor: 'pointer',
          borderRadius: BORDER_RADIUS.card,
          transition: 'all 0.3s ease',
          border: '1px solid',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: isDark
              ? '0 8px 24px rgba(139, 188, 143, 0.25)'
              : '0 8px 24px rgba(85, 107, 47, 0.2)',
            borderColor: 'primary.main',
          },
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Header: Name + Status */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: isDark
                    ? 'rgba(139, 188, 143, 0.15)'
                    : 'rgba(85, 107, 47, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <User size={24} color={theme.palette.primary.main} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {client?.name || 'Nepojmenovaná klientka'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {program?.title || 'Neznámý program'}
                </Typography>
              </Box>
            </Box>

            <Chip
              label={status.label}
              color={status.color}
              size="small"
              sx={{ borderRadius: BORDER_RADIUS.button }}
            />
          </Box>

          {/* Progress Bar */}
          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="body2" color="text.secondary">
                Postup
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {completedDays}/{totalDays} dní
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{
                height: 8,
                borderRadius: BORDER_RADIUS.small,
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: BORDER_RADIUS.small,
                  background: isCompleted
                    ? 'linear-gradient(90deg, #8FBC8F 0%, #6B8E23 100%)'
                    : 'linear-gradient(90deg, #8FBC8F 0%, #9ACD32 100%)',
                },
              }}
            />
          </Box>

          {/* Stats Row */}
          <Box display="flex" gap={2} flexWrap="wrap">
            {/* Current Day */}
            <Box display="flex" alignItems="center" gap={0.5}>
              <Calendar size={16} color={theme.palette.text.secondary} />
              <Typography variant="body2" color="text.secondary">
                Den {client?.currentDay || 1}
              </Typography>
            </Box>

            {/* Streak */}
            <Box display="flex" alignItems="center" gap={0.5}>
              <TrendingUp size={16} color={theme.palette.text.secondary} />
              <Typography variant="body2" color="text.secondary">
                {currentStreak}x série
              </Typography>
            </Box>

            {/* Started date */}
            <Box display="flex" alignItems="center" gap={0.5}>
              <Clock size={16} color={theme.palette.text.secondary} />
              <Typography variant="body2" color="text.secondary">
                {startedDate}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

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
                  Začátek: {startedDate}
                </Typography>
              </Box>
              {completedDate && (
                <Box display="flex" alignItems="center" gap={1}>
                  <CheckCircle2 size={16} color={theme.palette.success.main} />
                  <Typography variant="body2">
                    Dokončení: {completedDate}
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
          <Button onClick={() => setDetailOpen(false)} variant="outlined">
            Zavřít
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClientCard;
