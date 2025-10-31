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
          p: { xs: 1.5, sm: 2, md: 3 },
          '&:last-child': { pb: { xs: 1.5, sm: 2, md: 3 } }
        }}
      >
        <Box display="flex" gap={isVeryNarrow ? 0.75 : 1.5}>
          {/* Levý sloupec - obsah */}
          <Box
            display="flex"
            flexDirection="column"
            gap={0.5}
            sx={{
              flex: '1 1 0px',
              minWidth: 0,
              width: 0,
              overflow: 'hidden',
            }}
          >
            {/* Řádek 1: Chip */}
            <Skeleton
              variant="rounded"
              width={80}
              height={isVeryNarrow ? 16 : 18}
              sx={{ borderRadius: '12px' }}
            />

            {/* Řádek 2: URL/Filename */}
            <Skeleton
              variant="text"
              width="70%"
              height={isVeryNarrow ? 14 : 16}
              sx={{ minHeight: '1.2em' }}
            />

            {/* Řádek 3: File size */}
            <Skeleton
              variant="text"
              width="40%"
              height={isVeryNarrow ? 14 : 16}
              sx={{ minHeight: '1.2em' }}
            />

            {/* Řádek 4: Duration/page count */}
            <Skeleton
              variant="text"
              width="50%"
              height={isVeryNarrow ? 14 : 16}
              sx={{ minHeight: '1.2em' }}
            />

            {/* Title (2 řádky) */}
            <Box sx={{ mt: 0.5 }}>
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

            {/* Description (3 řádky) */}
            <Box>
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
          </Box>

          {/* Pravý sloupec - ikony */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-end"
            gap={isVeryNarrow ? 0.5 : 1}
            sx={{
              flexShrink: 0,
              height: '100%',
              justifyContent: 'flex-start'
            }}
          >
            {/* Velká ikona */}
            <Skeleton
              variant="circular"
              width={isVeryNarrow ? 28 : { xs: 36, sm: 44 }}
              height={isVeryNarrow ? 28 : { xs: 36, sm: 44 }}
            />

            {/* Action ikony (5×) */}
            {[...Array(5)].map((_, i) => (
              <Skeleton
                key={i}
                variant="circular"
                width={isVeryNarrow ? 20 : 18}
                height={isVeryNarrow ? 20 : 18}
              />
            ))}

            {/* Trash ikona - separovaná */}
            <Box sx={{ mt: 'auto', pt: 2 }}>
              <Skeleton
                variant="circular"
                width={isVeryNarrow ? 20 : 18}
                height={isVeryNarrow ? 20 : 18}
              />
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MaterialCardSkeleton;
