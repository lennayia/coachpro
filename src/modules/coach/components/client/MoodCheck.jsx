import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import { motion } from 'framer-motion';

const moods = [
  { emoji: '😊', label: 'Šťastná' },
  { emoji: '💪', label: 'Silná' },
  { emoji: '🌟', label: 'Inspirovaná' },
  { emoji: '😌', label: 'V klidu' },
  { emoji: '🤔', label: 'Zamyšlená' },
  { emoji: '😔', label: 'Unavená' },
  { emoji: '😰', label: 'Nervózní' },
  { emoji: '😤', label: 'Frustrovaná' },
];

const MoodCheck = ({ onMoodSelected }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Jak se dneska máš? 💚
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Klikni na emoji, které nejlépe vystihuje tvůj dnešní pocit
          </Typography>

          <Box
            display="flex"
            justifyContent="center"
            gap={1}
            flexWrap="wrap"
            sx={{ maxWidth: 500, mx: 'auto' }}
          >
            {moods.map((mood) => (
              <IconButton
                key={mood.emoji}
                onClick={() => onMoodSelected(mood.emoji)}
                sx={{
                  fontSize: 40,
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'scale(1.3)',
                    backgroundColor: 'transparent',
                  },
                }}
                title={mood.label}
              >
                {mood.emoji}
              </IconButton>
            ))}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MoodCheck;
