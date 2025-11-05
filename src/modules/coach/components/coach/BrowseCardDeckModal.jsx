import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  useTheme,
} from '@mui/material';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import BORDER_RADIUS from '@styles/borderRadius';
import { createBackdrop } from '@shared/styles/modernEffects';
import { staggerContainer, staggerItem } from '@shared/styles/animations';

/**
 * BrowseCardDeckModal - Modal pro procházení karet v balíčku (coach view)
 *
 * @param {Object} deck - Balíček karet (cyklus, motiv, cards)
 * @param {boolean} open - Stav otevření
 * @param {Function} onClose - Handler zavření
 */
const BrowseCardDeckModal = ({ deck, open, onClose }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (!deck) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: BORDER_RADIUS.dialog,
          background: isDark
            ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
            : 'linear-gradient(135deg, #f5f7fa 0%, #e8f0f7 100%)',
        },
      }}
      slotProps={{
        backdrop: {
          sx: createBackdrop(isDark),
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
        }}
      >
        <Box>
          <Typography
            component="div"
            variant="h5"
            sx={{
              fontWeight: 700,
              color: deck.color.main,
            }}
          >
            {deck.title}
          </Typography>
          <Typography component="div" variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            📚 {deck.cardCount} karet • {deck.cyklus} • {deck.motiv}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      {/* Grid karet */}
      <DialogContent sx={{ pt: 1 }}>
        <Grid
          container
          spacing={2}
          component={motion.div}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {deck.cards.map((card) => (
            <Grid item xs={6} sm={4} md={3} key={card.id}>
              <motion.div variants={staggerItem}>
                <Card
                  sx={{
                    borderRadius: BORDER_RADIUS.card,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 16px ${deck.color.main}30`,
                    },
                  }}
                >
                  {/* Čtvercový obrázek */}
                  <CardMedia
                    component="img"
                    image={card.image_path || '/images/karty/placeholder.jpg'}
                    alt={card.nazev_karty}
                    sx={{
                      aspectRatio: '1/1',
                      objectFit: 'cover',
                    }}
                  />

                  {/* Název + emoce */}
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        mb: 0.5,
                        fontSize: 13,
                        lineHeight: 1.3,
                      }}
                    >
                      {card.nazev_karty}
                    </Typography>
                    <Chip
                      label={card.primarni_emoce}
                      size="small"
                      sx={{
                        fontSize: 10,
                        height: 18,
                        backgroundColor: `${deck.color.main}20`,
                        color: deck.color.main,
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default BrowseCardDeckModal;
