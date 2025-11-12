import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Avatar,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Power, User as UserIcon } from 'lucide-react';
import { fadeIn, fadeInUp } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import { useNotification } from '@shared/context/NotificationContext';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import { useTheme } from '@mui/material';
import { getVocative } from '@shared/utils/czechGrammar';

/**
 * WelcomeScreen - Universal welcome/dashboard landing page
 *
 * Modular component used by both testers and clients
 * Combines avatar, greeting, optional code entry, stats, and action cards
 *
 * @param {Object} props
 * @param {Object} props.profile - User profile data { displayName, photo_url, ... }
 * @param {Function} props.onLogout - Logout handler
 * @param {string} props.userType - 'tester' | 'client'
 * @param {boolean} props.showCodeEntry - Show code entry section (default: false)
 * @param {Function} props.onCodeSubmit - Handler for code submission (codeData) => void
 * @param {boolean} props.showStats - Show statistics section (default: false)
 * @param {Array} props.stats - Statistics to display [{ label, value, icon }, ...]
 * @param {Array} props.actionCards - Action cards [{ title, subtitle, icon, onClick, gradient }, ...]
 * @param {string} props.welcomeText - Custom welcome text (optional)
 * @param {string} props.subtitle - Subtitle under name (e.g., "Beta tester CoachPro")
 * @param {Function} props.onAvatarClick - Handler for avatar click (navigate to profile)
 * @param {string} props.avatarTooltip - Tooltip for avatar hover (default: "Upravit profil")
 * @param {ReactNode} props.customCodeEntry - Custom code entry UI (overrides default)
 *
 * @created 11.11.2025
 */
const WelcomeScreen = ({
  profile,
  onLogout,
  userType = 'client',
  showCodeEntry = false,
  onCodeSubmit = null,
  showStats = false,
  stats = [],
  actionCards = [],
  welcomeText = null,
  subtitle = null,
  onAvatarClick = null,
  avatarTooltip = 'Upravit profil',
  customCodeEntry = null,
}) => {
  const navigate = useNavigate();
  const { showError } = useNotification();
  const theme = useTheme();
  const glassCardStyles = useGlassCard('subtle');

  // Code entry state
  const [code, setCode] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const defaultWelcomeText = welcomeText || `Vítejte zpátky, ${getVocative(profile?.displayName || '')}!`;

  const handleCodeChange = (e) => {
    const value = e.target.value.toUpperCase().trim();
    setCode(value);
  };

  const handleCodeSubmit = async () => {
    if (!onCodeSubmit) return;

    setCodeLoading(true);
    try {
      await onCodeSubmit({ code, previewData });
    } catch (err) {
      showError('Chyba', err.message || 'Nepodařilo se zpracovat kód');
    } finally {
      setCodeLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? `
              radial-gradient(circle at 20% 20%, rgba(143, 188, 143, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(85, 107, 47, 0.15) 0%, transparent 50%),
              linear-gradient(135deg, #0a0f0a 0%, #1a2410 100%)
            `
            : `
              radial-gradient(circle at 20% 20%, rgba(143, 188, 143, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(85, 107, 47, 0.3) 0%, transparent 50%),
              linear-gradient(135deg, #e8ede5 0%, #d4ddd0 100%)
            `,
        p: 2,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
        },
      }}
    >
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        style={{ width: '100%', maxWidth: showCodeEntry || showStats ? 800 : 600 }}
      >
        <Card
          elevation={0}
          sx={{
            ...glassCardStyles,
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '32px',
          }}
        >
          <Box p={4} position="relative">
            {/* Logout button - top left */}
            <IconButton
              onClick={onLogout}
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                color: 'text.secondary',
                '&:hover': {
                  color: 'error.main',
                  backgroundColor: 'rgba(211, 47, 47, 0.08)',
                },
              }}
            >
              <Power size={20} />
            </IconButton>

            {/* Welcome Header */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              <Box textAlign="center" mb={showCodeEntry || showStats ? 4 : 3} mt={4}>
                <Avatar
                  src={profile?.photo_url}
                  onClick={onAvatarClick}
                  title={onAvatarClick ? avatarTooltip : undefined}
                  imgProps={{
                    referrerPolicy: 'no-referrer',
                    loading: 'eager'
                  }}
                  sx={{
                    width: 90,
                    height: 90,
                    margin: '0 auto',
                    mb: 2.5,
                    bgcolor: 'primary.main',
                    fontSize: 36,
                    border: '2px solid',
                    borderColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(139, 188, 143, 0.3)'
                        : 'rgba(85, 107, 47, 0.2)',
                    cursor: onAvatarClick ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    '&:hover': onAvatarClick ? {
                      transform: 'scale(1.05)',
                      borderColor: 'primary.main',
                    } : {},
                  }}
                >
                  {!profile?.photo_url && <UserIcon size={44} />}
                </Avatar>
                <Typography variant="h4" fontWeight={600} gutterBottom sx={{ mb: 1.5 }}>
                  {defaultWelcomeText}
                </Typography>
                {subtitle && (
                  <Typography variant="body1" color="text.secondary">
                    {subtitle}
                  </Typography>
                )}
              </Box>
            </motion.div>

            {/* Statistics Section */}
            {showStats && stats.length > 0 && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.15 }}
              >
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {stats.map((stat, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <Card
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          background:
                            theme.palette.mode === 'dark'
                              ? 'rgba(143, 188, 143, 0.05)'
                              : 'rgba(143, 188, 143, 0.1)',
                          borderRadius: BORDER_RADIUS.compact,
                        }}
                      >
                        {stat.icon && (
                          <Box sx={{ mb: 1, color: 'primary.main' }}>{stat.icon}</Box>
                        )}
                        <Typography variant="h5" fontWeight={600}>
                          {stat.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {stat.label}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            )}

            {/* Code Entry Section */}
            {(showCodeEntry || customCodeEntry) && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                {customCodeEntry || (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                      Vstup kódem
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Zadejte 6-místný kód"
                      value={code}
                      onChange={handleCodeChange}
                      disabled={codeLoading}
                      inputProps={{ maxLength: 6 }}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: BORDER_RADIUS.compact,
                        },
                      }}
                    />
                    {previewData && (
                      <Alert severity="success" sx={{ mb: 2, borderRadius: BORDER_RADIUS.compact }}>
                        <Typography variant="body2">
                          <strong>{previewData.title}</strong>
                          {previewData.type && ` • ${previewData.type}`}
                          {previewData.coachName && ` • ${previewData.coachName}`}
                        </Typography>
                      </Alert>
                    )}
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleCodeSubmit}
                      disabled={code.length !== 6 || codeLoading}
                      sx={{ borderRadius: BORDER_RADIUS.button, py: 1.5 }}
                    >
                      {codeLoading ? <CircularProgress size={24} /> : 'Pokračovat'}
                    </Button>
                  </Box>
                )}
              </motion.div>
            )}

            {/* Action Cards */}
            {actionCards.length > 0 && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: showCodeEntry ? 0.3 : 0.2 }}
              >
                <Grid container spacing={2.5}>
                  {actionCards.map((card, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Card
                        onClick={card.onClick}
                        sx={{
                          p: 3,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          background: card.gradient || 'transparent',
                          borderRadius: BORDER_RADIUS.card,
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4,
                          },
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={2}>
                          {card.icon && (
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                              }}
                            >
                              {card.icon}
                            </Box>
                          )}
                          <Box flex={1}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                              {card.title}
                            </Typography>
                            {card.subtitle && (
                              <Typography variant="body2" color="text.secondary">
                                {card.subtitle}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            )}
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
};

export default WelcomeScreen;
