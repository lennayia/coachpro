// Cesta: src/shared/components/LoadingState.jsx
// Univerzální loading komponenty pro celou aplikaci

import { Box, CircularProgress, Typography, Skeleton } from '@mui/material';

/**
 * Základní loading spinner
 * Použití: <LoadingSpinner />
 */
export const LoadingSpinner = ({ size = 40, message }) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    gap={2}
    py={4}
  >
    <CircularProgress size={size} />
    {message && (
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    )}
  </Box>
);

/**
 * Full-page loading overlay
 * Použití: <LoadingOverlay />
 */
export const LoadingOverlay = ({ message = 'Načítání...' }) => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 9999,
    }}
  >
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: '24px',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        minWidth: 200,
      }}
    >
      <CircularProgress />
      <Typography variant="body1">{message}</Typography>
    </Box>
  </Box>
);

/**
 * Inline loading state (pro malé komponenty)
 * Použití: <InlineLoader />
 */
export const InlineLoader = ({ size = 20 }) => (
  <CircularProgress size={size} sx={{ display: 'inline-block', verticalAlign: 'middle' }} />
);

/**
 * Skeleton loader pro karty
 * Použití: <CardSkeleton />
 */
export const CardSkeleton = ({ count = 1, height = 200 }) => (
  <Box display="flex" flexDirection="column" gap={2}>
    {Array.from({ length: count }).map((_, index) => (
      <Skeleton
        key={index}
        variant="rectangular"
        height={height}
        sx={{ borderRadius: '24px' }}
        animation="wave"
      />
    ))}
  </Box>
);

/**
 * Skeleton loader pro seznam
 * Použití: <ListSkeleton count={5} />
 */
export const ListSkeleton = ({ count = 3 }) => (
  <Box display="flex" flexDirection="column" gap={1.5}>
    {Array.from({ length: count }).map((_, index) => (
      <Box key={index} display="flex" gap={2} alignItems="center">
        <Skeleton variant="circular" width={40} height={40} />
        <Box flex={1}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </Box>
      </Box>
    ))}
  </Box>
);

/**
 * Skeleton loader pro text
 * Použití: <TextSkeleton lines={3} />
 */
export const TextSkeleton = ({ lines = 1, width = '100%' }) => (
  <Box display="flex" flexDirection="column" gap={0.5}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        variant="text"
        width={index === lines - 1 ? '80%' : width}
      />
    ))}
  </Box>
);

/**
 * Wrapper komponenta pro conditional rendering s loading
 * Použití:
 *   <LoadingWrapper loading={isLoading} fallback={<LoadingSpinner />}>
 *     <MyContent />
 *   </LoadingWrapper>
 */
export const LoadingWrapper = ({ loading, children, fallback = <LoadingSpinner /> }) => {
  if (loading) {
    return fallback;
  }

  return children;
};
