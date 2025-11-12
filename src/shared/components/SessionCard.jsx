import { Box, Card, Typography, Chip, Avatar } from '@mui/material';
import { Calendar, Clock, MapPin, Video, Phone } from 'lucide-react';
import { useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import BORDER_RADIUS from '@styles/borderRadius';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import {
  formatSessionDate,
  getTimeUntilSession,
  getSessionStatusLabel,
  getSessionLocationLabel,
  isSessionNow,
} from '@shared/utils/sessions';

/**
 * SessionCard - Reusable session card component
 *
 * Used across:
 * - Client dashboard (next session widget)
 * - Client sessions page (session history)
 * - Coach dashboard (upcoming sessions)
 * - Coach sessions page (all sessions)
 *
 * Props:
 * - session: Object - Session object from database (with coach/client details)
 * - viewMode: string - 'client' or 'coach' (determines which person to show)
 * - onClick: Function - Optional click handler
 * - compact: boolean - Compact mode (smaller card)
 * - showCountdown: boolean - Show countdown timer (default: true)
 */
const SessionCard = ({
  session,
  viewMode = 'client',
  onClick,
  compact = false,
  showCountdown = true,
}) => {
  const theme = useTheme();
  const glassCardStyles = useGlassCard('subtle');

  if (!session) return null;

  // Determine who to show (coach or client)
  const person = viewMode === 'client' ? session.coach : session.client;
  const personLabel = viewMode === 'client' ? 'Koučka' : 'Klientka';

  // Session status
  const statusInfo = getSessionStatusLabel(session.status);
  const locationInfo = getSessionLocationLabel(session.location);
  const isNow = isSessionNow(session);

  // Icons for location
  const LocationIcon = {
    Video: Video,
    Phone: Phone,
    MapPin: MapPin,
  }[locationInfo.icon] || Calendar;

  return (
    <motion.div
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        elevation={0}
        onClick={onClick}
        sx={{
          ...glassCardStyles,
          cursor: onClick ? 'pointer' : 'default',
          borderRadius: BORDER_RADIUS.compact,
          overflow: 'hidden',
          position: 'relative',
          border: isNow ? `2px solid ${theme.palette.primary.main}` : undefined,
        }}
      >
        {/* "Probíhá nyní" badge */}
        {isNow && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: 'primary.main',
              color: 'white',
              px: 2,
              py: 0.5,
              borderRadius: BORDER_RADIUS.compact,
              fontSize: '0.75rem',
              fontWeight: 600,
              zIndex: 1,
            }}
          >
            Probíhá nyní
          </Box>
        )}

        <Box p={compact ? 2 : 3}>
          {/* Header with person info */}
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Avatar
              src={person?.photo_url}
              imgProps={{
                referrerPolicy: 'no-referrer',
                loading: 'eager'
              }}
              sx={{
                width: compact ? 48 : 56,
                height: compact ? 48 : 56,
                bgcolor: 'primary.main',
              }}
            >
              {!person?.photo_url && (person?.name?.charAt(0) || '?')}
            </Avatar>

            <Box flex={1}>
              <Typography variant="caption" color="text.secondary" display="block">
                {personLabel}
              </Typography>
              <Typography variant={compact ? 'body1' : 'h6'} fontWeight={600}>
                {person?.name || 'Neznámý'}
              </Typography>
            </Box>

            <Chip
              label={statusInfo.label}
              color={statusInfo.color}
              size="small"
              sx={{ fontWeight: 500 }}
            />
          </Box>

          {/* Session date & time */}
          <Box display="flex" alignItems="center" gap={1} mb={1.5}>
            <Calendar size={18} color={theme.palette.text.secondary} />
            <Typography variant="body2" color="text.secondary">
              {formatSessionDate(session.session_date, 'EEEE, d. MMMM yyyy')}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={1.5}>
            <Clock size={18} color={theme.palette.text.secondary} />
            <Typography variant="body2" color="text.secondary">
              {formatSessionDate(session.session_date, 'HH:mm')} ({session.duration_minutes || 60} min)
            </Typography>
          </Box>

          {/* Location */}
          <Box display="flex" alignItems="center" gap={1} mb={showCountdown ? 2 : 0}>
            <LocationIcon size={18} color={theme.palette.text.secondary} />
            <Typography variant="body2" color="text.secondary">
              {locationInfo.label}
            </Typography>
          </Box>

          {/* Countdown */}
          {showCountdown && session.status === 'scheduled' && (
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography
                variant={compact ? 'body2' : 'body1'}
                fontWeight={600}
                color="primary.main"
                textAlign="center"
              >
                {getTimeUntilSession(session.session_date)}
              </Typography>
            </Box>
          )}

          {/* Session summary (for completed sessions) */}
          {session.status === 'completed' && session.session_summary && (
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                Shrnutí sezení
              </Typography>
              <Typography variant="body2" color="text.primary">
                {session.session_summary}
              </Typography>
            </Box>
          )}
        </Box>
      </Card>
    </motion.div>
  );
};

export default SessionCard;
