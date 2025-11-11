import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  Grid,
  Divider,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Key, Edit2, Save, X } from 'lucide-react';
import { getCurrentUser, saveCoach, getCoaches } from '../utils/storage';
import { useNotification } from '@shared/context/NotificationContext';
import { formatDate } from '@shared/utils/helpers';
import BORDER_RADIUS from '@styles/borderRadius';
import BetaInfoContent from '@shared/components/BetaInfoContent';
import { FULL_BETA_INFO, getBetaConfig } from '@shared/constants/betaInfo';

/**
 * ProfilePage - Profil kouče + kompletní Beta Info
 *
 * @created 4.11.2025
 */
const ProfilePage = () => {
  const { showSuccess, showError } = useNotification();
  const betaConfig = getBetaConfig();

  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');

  // Najít access code z tester dat (pokud existuje)
  const testerData = JSON.parse(localStorage.getItem('tester_data') || 'null');
  const accessCode = testerData?.access_code || '—';

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(currentUser?.name || '');
    setEmail(currentUser?.email || '');
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showError('Chyba', 'Vyplň prosím jméno');
      return;
    }
    if (!email.trim()) {
      showError('Chyba', 'Vyplň prosím email');
      return;
    }

    try {
      const updatedUser = {
        ...currentUser,
        name: name.trim(),
        email: email.trim(),
      };

      // Uložit do Supabase
      const result = await saveCoach(updatedUser);

      // Update sessionStorage with fresh data from DB
      const freshUser = {
        ...updatedUser,
        isAdmin: result.is_admin,
        isTester: result.is_tester,
        testerId: result.tester_id,
      };
      sessionStorage.setItem('coachpro_currentUser', JSON.stringify(freshUser));

      // Update local state to show changes immediately
      setCurrentUser(freshUser);
      setName(freshUser.name);
      setEmail(freshUser.email);

      setIsEditing(false);
      showSuccess('Hotovo!', 'Profil byl úspěšně aktualizován');
    } catch (error) {
      console.error('Error saving profile:', error);
      showError('Chyba', `Nepodařilo se uložit profil: ${error.message}`);
    }
  };

  return (
    <Box>
      {/* Page title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
          Můj Profil
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card sx={{ borderRadius: BORDER_RADIUS.card }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                {/* Avatar */}
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    margin: '0 auto 24px',
                    bgcolor: 'primary.main',
                    fontSize: '3rem',
                  }}
                >
                  {currentUser?.name?.[0] || 'U'}
                </Avatar>

                {/* Name */}
                {isEditing ? (
                  <TextField
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tvoje jméno"
                    sx={{ mb: 2 }}
                  />
                ) : (
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {currentUser?.name || 'Koučka'}
                  </Typography>
                )}

                {/* Email */}
                {isEditing ? (
                  <TextField
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tvůj email"
                    type="email"
                    sx={{ mb: 2 }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {currentUser?.email || '—'}
                  </Typography>
                )}

                {/* Action buttons */}
                {isEditing ? (
                  <Box display="flex" gap={1} justifyContent="center">
                    <Button
                      variant="contained"
                      startIcon={<Save size={18} />}
                      onClick={handleSave}
                      sx={{ borderRadius: BORDER_RADIUS.compact }}
                    >
                      Uložit
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<X size={18} />}
                      onClick={handleCancel}
                      sx={{ borderRadius: BORDER_RADIUS.compact }}
                    >
                      Zrušit
                    </Button>
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<Edit2 size={18} />}
                    onClick={handleEdit}
                    sx={{ borderRadius: BORDER_RADIUS.compact }}
                  >
                    Upravit profil
                  </Button>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Account Info */}
                <Box sx={{ textAlign: 'left' }}>
                  {/* Access Code */}
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Key size={18} color="gray" />
                    <Box flex={1}>
                      <Typography variant="caption" color="text.secondary">
                        Access kód
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                        {accessCode}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Registration Date */}
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Calendar size={18} color="gray" />
                    <Box flex={1}>
                      <Typography variant="caption" color="text.secondary">
                        Registrace
                      </Typography>
                      <Typography variant="body2">
                        {currentUser?.createdAt
                          ? formatDate(currentUser.createdAt)
                          : '—'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Beta Badge */}
                  <Box mt={2}>
                    <Chip
                      label="BETA TESTER"
                      size="small"
                      sx={{
                        width: '100%',
                        fontWeight: 700,
                        backgroundColor: '#FF9800',
                        color: '#fff',
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Beta Info Card */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              sx={{
                borderRadius: BORDER_RADIUS.card,
                maxHeight: '80vh',
                overflow: 'auto',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                  🧪 Beta Testing - Kompletní Informace
                </Typography>

                {/* Full Beta Info */}
                <BetaInfoContent variant="full" data={FULL_BETA_INFO} />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
