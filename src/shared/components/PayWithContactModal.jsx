/**
 * PayWithContactModal - Beta "payment" modal
 *
 * Client "pays" with contact info (name, email, phone)
 * Later will be replaced with real payment (Stripe, etc.)
 *
 * @created 16.11.2025
 */
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Gift, Mail, User, Phone } from 'lucide-react';
import { useTheme } from '@mui/material';
import BORDER_RADIUS from '@styles/borderRadius';
import { supabase } from '@shared/config/supabase';
import { useNotification } from '@shared/context/NotificationContext';
import { useClientAuth } from '@shared/context/ClientAuthContext';

/**
 * @param {Object} props
 * @param {boolean} props.open - Dialog open state
 * @param {function} props.onClose - Close handler
 * @param {Object} props.item - Item to purchase { id, title, type: 'material'|'program'|'card-deck' }
 * @param {Object} props.coach - Coach selling the item { id, name }
 * @param {function} props.onSuccess - Called after successful purchase
 */
const PayWithContactModal = ({ open, onClose, item, coach, onSuccess }) => {
  const theme = useTheme();
  const { showError, showSuccess } = useNotification();
  const { profile } = useClientAuth();

  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.email) {
      showError('Vyplňte povinná pole', 'Jméno a email jsou povinné');
      return;
    }

    setLoading(true);

    try {
      // Create purchase record
      const { data, error } = await supabase
        .from('coachpro_purchases')
        .insert({
          item_type: item.type,
          item_id: item.id,
          client_id: profile?.id,
          client_name: formData.name,
          client_email: formData.email,
          client_phone: formData.phone || null,
          client_message: formData.message || null,
          coach_id: coach.id,
          payment_method: 'contact',
          payment_status: 'completed',
          amount: 0,
          access_granted: true,
        })
        .select()
        .single();

      if (error) {
        // Check for duplicate purchase
        if (error.code === '23505') {
          showError(
            'Již máte přístup',
            `Tento ${item.type === 'material' ? 'materiál' : 'program'} už máte ve svém seznamu.`
          );
          setLoading(false);
          onClose();
          return;
        }
        throw error;
      }

      showSuccess(
        'Úspěch! 🎉',
        `${item.type === 'material' ? 'Materiál' : 'Program'} "${item.title}" byl přidán do vašeho seznamu.`
      );

      // Call success callback
      if (onSuccess) onSuccess(data);

      // Close modal
      onClose();
    } catch (err) {
      console.error('Error creating purchase:', err);
      showError('Chyba', 'Nepodařilo se získat přístup. Zkuste to prosím znovu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: BORDER_RADIUS.card,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(26, 36, 16, 0.98)'
              : 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Gift size={28} color={theme.palette.primary.main} />
          Získat přístup
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Beta notice */}
        <Alert
          severity="info"
          icon={<Gift size={20} />}
          sx={{
            mb: 3,
            borderRadius: BORDER_RADIUS.compact,
          }}
        >
          <Typography variant="body2" fontWeight={600} gutterBottom>
            Beta verze - Zdarma za kontakt! 🎁
          </Typography>
          <Typography variant="caption">
            Sdílejte s námi své kontaktní údaje a získejte okamžitý přístup k tomuto obsahu.
            V budoucnu zde bude možnost platby.
          </Typography>
        </Alert>

        {/* Item info */}
        <Box
          sx={{
            p: 2,
            mb: 3,
            borderRadius: BORDER_RADIUS.compact,
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(139, 188, 143, 0.08)'
                : 'rgba(139, 188, 143, 0.12)',
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(139, 188, 143, 0.2)'
                : 'rgba(85, 107, 47, 0.2)',
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {item.type === 'material' ? 'Materiál' : 'Program'}
          </Typography>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Od koučky: <strong>{coach.name}</strong>
          </Typography>
        </Box>

        {/* Contact form */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Jméno a příjmení *"
            value={formData.name}
            onChange={handleChange('name')}
            InputProps={{
              startAdornment: (
                <User
                  size={20}
                  style={{ marginRight: 8, color: theme.palette.text.secondary }}
                />
              ),
            }}
            sx={{ borderRadius: BORDER_RADIUS.compact }}
          />

          <TextField
            fullWidth
            label="Email *"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            InputProps={{
              startAdornment: (
                <Mail
                  size={20}
                  style={{ marginRight: 8, color: theme.palette.text.secondary }}
                />
              ),
            }}
            sx={{ borderRadius: BORDER_RADIUS.compact }}
          />

          <TextField
            fullWidth
            label="Telefon (volitelné)"
            value={formData.phone}
            onChange={handleChange('phone')}
            InputProps={{
              startAdornment: (
                <Phone
                  size={20}
                  style={{ marginRight: 8, color: theme.palette.text.secondary }}
                />
              ),
            }}
            sx={{ borderRadius: BORDER_RADIUS.compact }}
          />

          <TextField
            fullWidth
            label="Zpráva koučce (volitelné)"
            multiline
            rows={3}
            value={formData.message}
            onChange={handleChange('message')}
            placeholder="Zajímá mě toto, protože..."
            sx={{ borderRadius: BORDER_RADIUS.compact }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: 'text.secondary',
          }}
        >
          Zrušit
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.name || !formData.email}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            minWidth: 120,
          }}
        >
          {loading ? <CircularProgress size={24} /> : 'Získat přístup'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PayWithContactModal;
