import { Card, CardContent, Typography, Box } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import BORDER_RADIUS from '@styles/borderRadius';
import { useGlassCard, useNatureCard } from '@shared/hooks/useModernEffects';

const ProgressGarden = ({ currentDay, totalDays, completedDays, streak }) => {
  const glassCard = useGlassCard('normal');
  const natureCardLight = useNatureCard('light');
  const getDayStatus = (dayNum) => {
    const isCompleted = completedDays.includes(dayNum);
    const isCurrent = dayNum === currentDay;
    const isFuture = dayNum > currentDay;

    if (isCompleted) return 'completed';
    if (isCurrent) return 'current';
    if (isFuture) return 'future';
    return 'default';
  };

  return (
    <Card
      elevation={0}
      sx={{
        ...glassCard,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'radial-gradient(circle at 20% 80%, rgba(139, 188, 143, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(188, 143, 143, 0.1) 0%, transparent 50%)'
              : 'radial-gradient(circle at 20% 80%, rgba(85, 107, 47, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(188, 143, 143, 0.06) 0%, transparent 50%)',
          opacity: 0.6,
          pointerEvents: 'none',
        },
      }}
    >
      <CardContent sx={{ py: 4 }}>
        <Typography
          variant="h6"
          mb={4}
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            letterSpacing: '-0.01em',
          }}
        >
          Postup programu
        </Typography>

        {/* Streak info */}
        {streak > 0 && (
          <Box
            mb={4}
            sx={{
              ...natureCardLight,
              p: 3,
              borderRadius: '32px',
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}
            >
              Aktuální série
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mt: 0.5,
                letterSpacing: '-0.02em',
              }}
            >
              {streak}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {streak === 1 ? 'den' : streak < 5 ? 'dny' : 'dní'} v řadě
            </Typography>
          </Box>
        )}

        {/* Progress grid */}
        <Box
          display="grid"
          gridTemplateColumns={`repeat(${Math.min(totalDays, 7)}, 1fr)`}
          gap={2}
        >
          {Array.from({ length: totalDays }).map((_, index) => {
            const dayNum = index + 1;
            const status = getDayStatus(dayNum);
            const isCompleted = status === 'completed';
            const isCurrent = status === 'current';
            const isFuture = status === 'future';

            return (
              <Box
                key={dayNum}
                sx={{
                  aspectRatio: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '32px',
                  position: 'relative',
                  backdropFilter: 'blur(10px)',
                  background: (theme) => {
                    if (isCompleted) {
                      return theme.palette.mode === 'dark'
                        ? 'rgba(139, 188, 143, 0.15)'
                        : 'rgba(85, 107, 47, 0.08)';
                    }
                    if (isCurrent) {
                      return theme.palette.mode === 'dark'
                        ? 'rgba(139, 188, 143, 0.1)'
                        : 'rgba(85, 107, 47, 0.06)';
                    }
                    return theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.03)'
                      : 'rgba(0, 0, 0, 0.02)';
                  },
                  border: '1px solid',
                  borderColor: (theme) => {
                    if (isCompleted) {
                      return theme.palette.mode === 'dark'
                        ? 'rgba(139, 188, 143, 0.3)'
                        : 'rgba(85, 107, 47, 0.2)';
                    }
                    if (isCurrent) {
                      return theme.palette.mode === 'dark'
                        ? 'rgba(139, 188, 143, 0.4)'
                        : 'rgba(85, 107, 47, 0.3)';
                    }
                    return theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.06)';
                  },
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: isCompleted ? 'default' : 'default',
                  '&:hover': {
                    background: (theme) => {
                      if (isCompleted) {
                        return theme.palette.mode === 'dark'
                          ? 'rgba(139, 188, 143, 0.2)'
                          : 'rgba(85, 107, 47, 0.12)';
                      }
                      if (isCurrent) {
                        return theme.palette.mode === 'dark'
                          ? 'rgba(139, 188, 143, 0.15)'
                          : 'rgba(85, 107, 47, 0.1)';
                      }
                      return theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.04)';
                    },
                  },
                }}
              >
                {/* Completed checkmark */}
                {isCompleted && (
                  <CheckCircle
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      fontSize: 14,
                      color: 'primary.main',
                      opacity: 0.8,
                    }}
                  />
                )}

                {/* Day number */}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isCompleted || isCurrent ? 600 : 400,
                    fontSize: { xs: 13, sm: 14 },
                    color: isCompleted || isCurrent ? 'primary.main' : 'text.secondary',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {dayNum}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Legend */}
        <Box display="flex" justifyContent="center" gap={4} mt={4}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(0, 0, 0, 0.15)',
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              Budoucí
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                opacity: 0.6,
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              Aktuální
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <CheckCircle
              sx={{
                fontSize: 12,
                color: 'primary.main',
                opacity: 0.8,
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              Dokončené
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProgressGarden;
