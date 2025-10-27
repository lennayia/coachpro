import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { LocalFireDepartment as FireIcon } from '@mui/icons-material';
import BORDER_RADIUS from '@styles/borderRadius';

const ProgressGarden = ({ currentDay, totalDays, completedDays, streak }) => {
  const getDayIcon = (dayNum) => {
    const isCompleted = completedDays.includes(dayNum);
    const isCurrent = dayNum === currentDay;
    const isFuture = dayNum > currentDay;

    if (isCompleted) return '🌸'; // Completed - flower
    if (isCurrent) return '🌱'; // Current - sprout
    if (isFuture) return '🌰'; // Future - seed
    return '🌿'; // Default
  };

  const getDayColor = (dayNum) => {
    const isCompleted = completedDays.includes(dayNum);
    const isCurrent = dayNum === currentDay;

    if (isCompleted) return 'success.light';
    if (isCurrent) return 'primary.light';
    return 'action.hover';
  };

  return (
    <Card>
      <CardContent>
        <Typography
          variant="h6"
          mb={2}
          textAlign="center"
          sx={{ fontWeight: 600 }}
        >
          Tvoje zahrada růstu 🌱
        </Typography>

        {/* Streak badge */}
        {streak > 0 && (
          <Box textAlign="center" mb={3}>
            <Chip
              icon={<FireIcon />}
              label={`${streak} ${streak === 1 ? 'den' : streak < 5 ? 'dny' : 'dní'} v řadě!`}
              color="warning"
              sx={{ fontSize: 16, py: 2.5, px: 1 }}
            />
          </Box>
        )}

        {/* Garden grid */}
        <Box
          display="grid"
          gridTemplateColumns={`repeat(${Math.min(totalDays, 7)}, 1fr)`}
          gap={1.5}
          mb={2}
        >
          {Array.from({ length: totalDays }).map((_, index) => {
            const dayNum = index + 1;
            const isCompleted = completedDays.includes(dayNum);
            const isCurrent = dayNum === currentDay;

            return (
              <Box
                key={dayNum}
                sx={{
                  aspectRatio: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: BORDER_RADIUS.compact,
                  bgcolor: getDayColor(dayNum),
                  border: isCurrent ? 2 : 0,
                  borderColor: 'primary.main',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                {/* Icon */}
                <Box fontSize={{ xs: 24, sm: 32 }}>{getDayIcon(dayNum)}</Box>

                {/* Day number */}
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: isCurrent ? 700 : 500,
                    fontSize: { xs: 10, sm: 12 },
                  }}
                >
                  {dayNum}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Legend */}
        <Box display="flex" justifyContent="center" gap={3} mt={2} flexWrap="wrap">
          <Box display="flex" alignItems="center" gap={0.5}>
            <Box fontSize={18}>🌰</Box>
            <Typography variant="caption" color="text.secondary">
              Budoucí
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Box fontSize={18}>🌱</Box>
            <Typography variant="caption" color="text.secondary">
              Aktuální
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Box fontSize={18}>🌸</Box>
            <Typography variant="caption" color="text.secondary">
              Dokončené
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProgressGarden;
