import { Box, Typography } from '@mui/material';

const TesterProfileTest = () => {
  console.log('🟢 TesterProfileTest rendering!');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'primary.main',
      }}
    >
      <Typography variant="h1" color="white">
        TEST PROFILE WORKS!
      </Typography>
    </Box>
  );
};

export default TesterProfileTest;
