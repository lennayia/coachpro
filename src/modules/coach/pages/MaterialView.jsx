import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  Chip,
  Button,
  CircularProgress,
} from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import MaterialRenderer from '../components/shared/MaterialRenderer';
import { getSharedMaterialByCode } from '../utils/storage';
import { getCategoryLabel } from '@shared/utils/helpers';
import BORDER_RADIUS from '@styles/borderRadius';
import useModernEffects from '@shared/hooks/useModernEffects';

const MaterialView = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { presets, isDarkMode } = useModernEffects();
  const [loading, setLoading] = useState(true);
  const [sharedMaterial, setSharedMaterial] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMaterial = async () => {
      try {
        setLoading(true);
        setError(null);

        // Najdi sdílený materiál podle kódu
        const shared = await getSharedMaterialByCode(code);

        if (!shared) {
          setError('Materiál s tímto kódem nebyl nalezen. Zkontroluj, že jsi zadal správný kód.');
          setLoading(false);
          return;
        }

        // ⏰ Kontrola časového omezení přístupu
        const now = new Date();

        if (shared.accessStartDate) {
          const startDate = new Date(shared.accessStartDate);
          if (now < startDate) {
            const { formatDate } = await import('@shared/utils/helpers');
            setError(`Přístup k tomuto materiálu je možný od ${formatDate(shared.accessStartDate, { day: 'numeric', month: 'numeric', year: 'numeric' })}`);
            setLoading(false);
            return;
          }
        }

        if (shared.accessEndDate) {
          const endDate = new Date(shared.accessEndDate);
          if (now > endDate) {
            const { formatDate } = await import('@shared/utils/helpers');
            setError(`Přístup k tomuto materiálu skončil ${formatDate(shared.accessEndDate, { day: 'numeric', month: 'numeric', year: 'numeric' })}`);
            setLoading(false);
            return;
          }
        }

        // Coach name is already in shared material (no need for additional query)
        setSharedMaterial(shared);
        setLoading(false);
      } catch (err) {
        console.error('Error loading material:', err);
        setError('Nastala chyba při načítání materiálu. Zkus to prosím znovu.');
        setLoading(false);
      }
    };

    if (code) {
      loadMaterial();
    }
  }, [code]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} sx={{ color: 'primary.main' }} />
        <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
          Načítám materiál...
        </Typography>
      </Container>
    );
  }

  if (error || !sharedMaterial) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3, borderRadius: BORDER_RADIUS.compact }}>
          {error || 'Materiál nebyl nalezen'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowLeft />}
          onClick={() => navigate('/client')}
        >
          Zpět na vstup
        </Button>
      </Container>
    );
  }

  // Guard: Ensure material exists
  if (!sharedMaterial?.material) {
    return null;
  }

  const { material } = sharedMaterial;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            variant="text"
            startIcon={<ArrowLeft />}
            onClick={() => navigate('/client')}
            sx={{ mb: 2 }}
          >
            Zpět
          </Button>

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {material.title}
          </Typography>

          {material.description && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {material.description}
            </Typography>
          )}

          <Box display="flex" gap={1} flexWrap="wrap">
            <Chip
              label={getCategoryLabel(material.category)}
              size="small"
              sx={{ borderRadius: BORDER_RADIUS.small }}
            />
            {sharedMaterial.coachName && (
              <Chip
                label={`Od: ${sharedMaterial.coachName}`}
                size="small"
                variant="outlined"
                sx={{ borderRadius: BORDER_RADIUS.small }}
              />
            )}
          </Box>
        </Box>

        {/* Material Content */}
        <Card
          elevation={0}
          sx={{
            ...presets.glassCard('normal'),
            mb: 4,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <MaterialRenderer material={material} />
          </CardContent>
        </Card>

        {/* Info */}
        <Alert severity="info" sx={{ borderRadius: BORDER_RADIUS.compact }}>
          Tento materiál byl s tebou sdílen pomocí aplikace CoachPro.
          {sharedMaterial.coachName && ` Kouč: ${sharedMaterial.coachName}.`}
        </Alert>
      </motion.div>
    </Container>
  );
};

export default MaterialView;
