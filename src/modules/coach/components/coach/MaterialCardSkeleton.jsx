import { Card, CardContent, Box, Skeleton, useTheme, useMediaQuery } from '@mui/material';
import BORDER_RADIUS from '@styles/borderRadius';

const MaterialCardSkeleton = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isVeryNarrow = useMediaQuery('(max-width:420px)');

  return (
    <Card
      elevation={1}
      sx={{
        height: '100%',
        minHeight: 280,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s',
        borderRadius: BORDER_RADIUS.card,
        backgroundColor: isDark
          ? 'rgba(255, 255, 255, 0.02)'
          : 'rgba(0, 0, 0, 0.01)',
        border: '1px solid',
        borderColor: isDark
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(0, 0, 0, 0.08)',
      }}
    >
      <CardContent
        sx={{
          flexGrow: 1,
          p: 3,
          pr: 2.5,
          '&:last-child': { pb: 3 }
        }}
      >
        {/* Row 1: Icons (velká ikona vlevo + action ikony vpravo) */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
          {/* Velká ikona vlevo */}
          <Skeleton
            variant="circular"
            width={isVeryNarrow ? 28 : 40}
            height={isVeryNarrow ? 28 : 40}
          />

          {/* Action ikony vpravo */}
          <Box display="flex" alignItems="center" gap={isVeryNarrow ? 0.5 : 0.75}>
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                variant="circular"
                width={isVeryNarrow ? 20 : 22}
                height={isVeryNarrow ? 20 : 22}
              />
            ))}
          </Box>
        </Box>

        {/* Row 2: Category chip */}
        <Box mb={1}>
          <Skeleton
            variant="rounded"
            width={80}
            height={isVeryNarrow ? 14 : 16}
            sx={{ borderRadius: '12px' }}
          />
        </Box>

        {/* Row 3: Metadata horizontal (duration/pages + file size) */}
        <Box display="flex" alignItems="center" gap={1.5} mb={1}>
          <Skeleton
            variant="text"
            width={isVeryNarrow ? 50 : 60}
            height={isVeryNarrow ? 14 : 16}
          />
          <Skeleton
            variant="text"
            width={isVeryNarrow ? 40 : 50}
            height={isVeryNarrow ? 14 : 16}
          />
        </Box>

        {/* Row 4: URL/fileName */}
        <Box sx={{ minHeight: '1.2em', mb: 1 }}>
          <Skeleton
            variant="text"
            width="70%"
            height={isVeryNarrow ? 14 : 16}
          />
        </Box>

        {/* Row 5: Title (2 řádky) */}
        <Box sx={{ minHeight: '2.6em', mb: 1 }}>
          <Skeleton
            variant="text"
            width="90%"
            height={isVeryNarrow ? 18 : 20}
          />
          <Skeleton
            variant="text"
            width="70%"
            height={isVeryNarrow ? 18 : 20}
          />
        </Box>

        {/* Row 6: Description (3 řádky) */}
        <Box sx={{ minHeight: '4.2em', mb: 1 }}>
          <Skeleton
            variant="text"
            width="100%"
            height={14}
          />
          <Skeleton
            variant="text"
            width="95%"
            height={14}
          />
          <Skeleton
            variant="text"
            width="60%"
            height={14}
          />
        </Box>

        {/* Row 7: Taxonomy chips */}
        <Box display="flex" flexWrap="wrap" gap={0.5} mb={1.5}>
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              width={isVeryNarrow ? 60 : 70}
              height={isVeryNarrow ? 16 : 18}
              sx={{ borderRadius: '12px' }}
            />
          ))}
        </Box>

        {/* Row 8: Button "Jak to vidí klientka" */}
        <Box mt={1.5}>
          <Skeleton
            variant="rounded"
            width={isVeryNarrow ? 140 : 160}
            height={isVeryNarrow ? 28 : 32}
            sx={{ borderRadius: BORDER_RADIUS.compact }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default MaterialCardSkeleton;
