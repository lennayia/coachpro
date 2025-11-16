import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  Chip,
  Button,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import { Heart, ArrowLeft, Phone, Mail, Globe } from 'lucide-react';
import { NAVIGATION_ICONS } from '@shared/constants/icons';
import { motion } from 'framer-motion';
import { fadeIn, fadeInUp } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import { useTheme } from '@mui/material';
import { useClientAuth } from '@shared/context/ClientAuthContext';
import ClientAuthGuard from '@shared/components/ClientAuthGuard';
import { getSharedMaterials } from '../utils/storage';
import { getCategoryLabel } from '@shared/utils/helpers';

const ClientMaterials = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { profile } = useClientAuth();
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'favorites'
  const [coachInfo, setCoachInfo] = useState(null);

  useEffect(() => {
    if (profile?.email) {
      loadMaterials();
    }
  }, [profile?.email]);

  useEffect(() => {
    // Filter materials based on selected tab
    if (filter === 'all') {
      setFilteredMaterials(materials);
    } else if (filter === 'favorites') {
      // TODO: Implement favorites functionality
      setFilteredMaterials(materials.filter(m => m.isFavorite));
    }
  }, [filter, materials]);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!profile?.email) {
        setMaterials([]);
        setFilteredMaterials([]);
        setLoading(false);
        return;
      }

      // Načti POUZE individuálně sdílené materiály pro tuto klientku
      // (materiály s client_email = email klientky)
      // Veřejné materiály (client_email = NULL) se zobrazují přes share code bez přihlášení
      const sharedMaterials = await getSharedMaterials(null, profile.email);

      // Deduplicate by material_id - keep only the latest share of each material
      const uniqueMaterials = [];
      const seenMaterialIds = new Set();

      sharedMaterials.forEach((sharedMaterial) => {
        const materialId = sharedMaterial.materialId || sharedMaterial.material?.id;
        if (materialId && !seenMaterialIds.has(materialId)) {
          seenMaterialIds.add(materialId);
          uniqueMaterials.push(sharedMaterial);
        }
      });

      // Extrahuj informace o koučce z prvního materiálu
      if (uniqueMaterials.length > 0) {
        const firstMaterial = uniqueMaterials[0];
        setCoachInfo({
          name: firstMaterial.coachName || firstMaterial.coach?.name || 'Koučka',
          phone: firstMaterial.coach?.phone || null,
          email: firstMaterial.coach?.email || firstMaterial.coachEmail || null,
          website: firstMaterial.coach?.website || null,
        });
      }

      setMaterials(uniqueMaterials);
      setFilteredMaterials(uniqueMaterials);
      setLoading(false);
    } catch (err) {
      console.error('Error loading materials:', err);
      setError('Nepodařilo se načíst materiály. Zkus to prosím znovu.');
      setLoading(false);
    }
  };

  const handleMaterialClick = (material) => {
    navigate(`/client/material/${material.shareCode}`);
  };

  if (loading) {
    return (
      <ClientAuthGuard requireProfile={true}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
              Načítám materiály...
            </Typography>
          </Box>
        </Box>
      </ClientAuthGuard>
    );
  }

  return (
    <ClientAuthGuard requireProfile={true}>
      <Box
        sx={{
          minHeight: '100vh',
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
          p: 3,
          pr: 15, // Space for FloatingMenu
        }}
      >
        <motion.div variants={fadeIn} initial="hidden" animate="visible">
          {/* Header with Back Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                mr: 2,
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(139, 188, 143, 0.15)'
                      : 'rgba(85, 107, 47, 0.1)',
                },
              }}
            >
              <ArrowLeft size={24} />
            </IconButton>
            <Box>
              <Typography variant="h3" fontWeight={700}>
                Moje Materiály
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sdílené materiály od vaší koučky
              </Typography>
            </Box>
          </Box>

          {/* Coach Profile Card */}
          {coachInfo && (
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              <Card
                elevation={0}
                sx={{
                  mb: 4,
                  borderRadius: BORDER_RADIUS.card,
                  border: '1px solid',
                  borderColor: 'divider',
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(26, 36, 16, 0.8)'
                      : 'rgba(255, 255, 255, 0.95)',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(139, 188, 143, 0.15)'
                            : 'rgba(85, 107, 47, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      <Typography variant="h4" fontWeight={700} color="primary.main">
                        {coachInfo.name.charAt(0)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {coachInfo.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {coachInfo.website}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone size={16} color={theme.palette.text.secondary} />
                      <Typography variant="body2" color="text.secondary">
                        {coachInfo.phone}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Mail size={16} color={theme.palette.text.secondary} />
                      <Typography variant="body2" color="text.secondary">
                        {coachInfo.email}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: BORDER_RADIUS.compact }}>
              {error}
            </Alert>
          )}

          {/* Filter Tabs */}
          <Box sx={{ mb: 3 }}>
            <Tabs
              value={filter}
              onChange={(e, newValue) => setFilter(newValue)}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                },
              }}
            >
              <Tab label="Všechny materiály" value="all" />
              <Tab label={`Oblíbené (${materials.filter(m => m.isFavorite).length})`} value="favorites" />
            </Tabs>
          </Box>

          {/* Materials Grid */}
          {filteredMaterials.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <NAVIGATION_ICONS.materials size={64} color={theme.palette.text.disabled} />
              <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                {filter === 'favorites'
                  ? 'Nemáte žádné oblíbené materiály'
                  : 'Zatím nemáte žádné sdílené materiály'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Vaše koučka vám brzy sdílí materiály pro vaše koučování
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredMaterials.map((material, index) => (
                <Grid item xs={12} sm={6} md={4} key={material.id}>
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        borderRadius: BORDER_RADIUS.card,
                        border: '1px solid',
                        borderColor: 'divider',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': {
                          borderColor: 'primary.main',
                          transform: 'translateY(-4px)',
                          boxShadow: (theme) =>
                            theme.palette.mode === 'dark'
                              ? '0 8px 24px rgba(139, 188, 143, 0.15)'
                              : '0 8px 24px rgba(85, 107, 47, 0.15)',
                        },
                      }}
                      onClick={() => handleMaterialClick(material)}
                    >
                      {/* Material Image */}
                      {material.material?.imageUrl && (
                        <CardMedia
                          component="img"
                          height="200"
                          image={material.material.imageUrl}
                          alt={material.material.title}
                          sx={{ objectFit: 'cover' }}
                        />
                      )}

                      <CardContent sx={{ p: 3 }}>
                        {/* Category Chip */}
                        {material.material?.category && (
                          <Chip
                            label={getCategoryLabel(material.material.category)}
                            size="small"
                            sx={{
                              mb: 2,
                              backgroundColor: (theme) =>
                                theme.palette.mode === 'dark'
                                  ? 'rgba(139, 188, 143, 0.15)'
                                  : 'rgba(85, 107, 47, 0.1)',
                              color: 'primary.main',
                              fontWeight: 600,
                            }}
                          />
                        )}

                        {/* Title */}
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {material.material?.title || 'Bez názvu'}
                        </Typography>

                        {/* Description */}
                        {material.material?.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {material.material.description}
                          </Typography>
                        )}

                        {/* Favorite Icon */}
                        {material.isFavorite && (
                          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Heart size={16} fill={theme.palette.error.main} color={theme.palette.error.main} />
                            <Typography variant="caption" color="error.main">
                              Oblíbené
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </motion.div>
      </Box>
    </ClientAuthGuard>
  );
};

export default ClientMaterials;
