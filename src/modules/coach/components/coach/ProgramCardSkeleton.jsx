import {
  Card,
  CardContent,
  CardActions,
  Box,
  Skeleton,
  useTheme,
} from '@mui/material';
import BORDER_RADIUS from '@styles/borderRadius';

const ProgramCardSkeleton = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: isDark
          ? 'rgba(255, 255, 255, 0.02)'
          : 'rgba(0, 0, 0, 0.01)',
        border: '1px solid',
        borderColor: isDark
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(0, 0, 0, 0.08)',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header - Chip + Menu */}
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
          <Skeleton
            variant="rounded"
            width={80}
            height={24}
            sx={{ borderRadius: '12px' }}
          />
          <Skeleton variant="circular" width={24} height={24} />
        </Box>

        {/* Title */}
        <Skeleton
          variant="text"
          width="85%"
          height={28}
          sx={{ mb: 1 }}
        />

        {/* Description (2 řádky) */}
        <Box sx={{ mb: 2 }}>
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="75%" height={20} />
        </Box>

        {/* Meta info (3 řádky) */}
        <Box display="flex" flexDirection="column" gap={1} mb={2}>
          <Skeleton variant="text" width="40%" height={16} />
          <Skeleton variant="text" width="50%" height={16} />
          <Skeleton variant="text" width="60%" height={16} />
        </Box>

        {/* Share code box */}
        <Box
          p={1.5}
          sx={{
            backgroundColor: isDark
              ? 'rgba(143, 188, 143, 0.1)'
              : 'rgba(85, 107, 47, 0.05)',
            borderRadius: BORDER_RADIUS.small,
            textAlign: 'center',
          }}
        >
          <Skeleton
            variant="text"
            width={80}
            height={16}
            sx={{ mx: 'auto', mb: 0.5 }}
          />
          <Skeleton
            variant="text"
            width={100}
            height={24}
            sx={{ mx: 'auto' }}
          />
        </Box>
      </CardContent>

      <CardActions sx={{ flexWrap: 'wrap', gap: 1 }}>
        <Skeleton
          variant="rounded"
          width={160}
          height={32}
          sx={{ borderRadius: BORDER_RADIUS.button }}
        />
        <Skeleton
          variant="rounded"
          width={70}
          height={32}
          sx={{ borderRadius: BORDER_RADIUS.button }}
        />
        <Skeleton
          variant="rounded"
          width={70}
          height={32}
          sx={{ borderRadius: BORDER_RADIUS.button }}
        />
      </CardActions>
    </Card>
  );
};

export default ProgramCardSkeleton;
