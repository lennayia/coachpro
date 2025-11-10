/**
 * CoachCard Component
 * Reusable card for displaying coach information
 * Used in coach selection, coach listing, etc.
 */

import { Card, CardContent, Box, Typography, Avatar, IconButton } from '@mui/material';
import { Phone, Mail } from 'lucide-react';
import { useTheme } from '@mui/material';
import BORDER_RADIUS from '@styles/borderRadius';
import { formatPhoneNumber, getCoachInitials } from '@shared/utils/coaches';

const CoachCard = ({ coach, onClick, compact = false }) => {
  const theme = useTheme();

  if (!coach) return null;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: BORDER_RADIUS.card,
        border: '1px solid',
        borderColor: 'divider',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(26, 36, 16, 0.8)'
            : 'rgba(255, 255, 255, 0.95)',
        '&:hover': onClick
          ? {
              borderColor: 'primary.main',
              transform: 'translateY(-4px)',
              boxShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? '0 8px 24px rgba(139, 188, 143, 0.15)'
                  : '0 8px 24px rgba(85, 107, 47, 0.15)',
            }
          : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: compact ? 2 : 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Avatar */}
          <Avatar
            sx={{
              width: compact ? 56 : 72,
              height: compact ? 56 : 72,
              bgcolor: 'primary.main',
              fontSize: compact ? 20 : 28,
              fontWeight: 600,
              border: '2px solid',
              borderColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(139, 188, 143, 0.3)'
                  : 'rgba(85, 107, 47, 0.2)',
            }}
          >
            {getCoachInitials(coach.name)}
          </Avatar>

          {/* Info */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant={compact ? 'h6' : 'h5'}
              fontWeight={600}
              gutterBottom
              sx={{ mb: compact ? 0.5 : 1 }}
            >
              {coach.name}
            </Typography>

            {/* Contact Info */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {coach.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Mail
                    size={compact ? 14 : 16}
                    color={theme.palette.text.secondary}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: compact ? '0.8rem' : '0.875rem' }}
                  >
                    {coach.email}
                  </Typography>
                </Box>
              )}

              {coach.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone
                    size={compact ? 14 : 16}
                    color={theme.palette.text.secondary}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: compact ? '0.8rem' : '0.875rem' }}
                  >
                    {formatPhoneNumber(coach.phone)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Action buttons (if interactive) */}
          {onClick && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {coach.email && (
                <IconButton
                  size="small"
                  href={`mailto:${coach.email}`}
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(139, 188, 143, 0.15)'
                          : 'rgba(85, 107, 47, 0.1)',
                    },
                  }}
                >
                  <Mail size={18} />
                </IconButton>
              )}

              {coach.phone && (
                <IconButton
                  size="small"
                  href={`tel:${coach.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(139, 188, 143, 0.15)'
                          : 'rgba(85, 107, 47, 0.1)',
                    },
                  }}
                >
                  <Phone size={18} />
                </IconButton>
              )}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CoachCard;
