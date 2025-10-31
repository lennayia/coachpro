import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import MaterialCard from './MaterialCard';
import MaterialCardSkeleton from './MaterialCardSkeleton';
import AddMaterialModal from './AddMaterialModal';
import { getCurrentUser, getMaterials } from '../../utils/storage';
import { staggerContainer, staggerItem } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';

const MaterialsLibrary = () => {
  const currentUser = getCurrentUser();
  const [materials, setMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load materials on mount
  useEffect(() => {
    const loadMaterials = async () => {
      setLoading(true);
      // Simulate async loading (for future Supabase integration)
      await new Promise(resolve => setTimeout(resolve, 300));
      setMaterials(getMaterials(currentUser?.id));
      setLoading(false);
    };

    loadMaterials();
  }, [currentUser?.id]);

  // Refresh materials
  const refreshMaterials = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setMaterials(getMaterials(currentUser?.id));
    setLoading(false);
  };

  // Filtrované a prohledané materiály
  const filteredMaterials = useMemo(() => {
    return materials.filter(material => {
      // Filtr podle kategorie
      if (filterCategory !== 'all' && material.category !== filterCategory) {
        return false;
      }

      // Filtr podle search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          material.title.toLowerCase().includes(query) ||
          material.description?.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [materials, searchQuery, filterCategory]);

  return (
  <Box sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}> {/* ✅ Větší padding */}
    {/* Header */}
    <Box mb={4}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        Knihovna materiálů
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Spravujte své video i audio nahrávky, textové i PDF dokumenty a další materiály
      </Typography>
    </Box>

    {/* Top bar - Search, Filter, Add */}
    <Box
      display="flex"
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent="space-between"
      gap={2}
      mb={4}
    >
      {/* Search */}
      <TextField
        placeholder="Hledat materiály..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ flex: 1, maxWidth: { md: 400 } }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Filter + Add button */}
      <Box display="flex" gap={2} flexWrap="wrap"> {/* ✅ Přidán flexWrap */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Kategorie</InputLabel>
          <Select
            value={filterCategory}
            label="Kategorie"
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <MenuItem value="all">Všechny kategorie</MenuItem>
            <MenuItem value="meditation">Meditace</MenuItem>
            <MenuItem value="affirmation">Afirmace</MenuItem>
            <MenuItem value="exercise">Cvičení</MenuItem>
            <MenuItem value="reflection">Reflexe</MenuItem>
            <MenuItem value="template">Šablona</MenuItem>
            <MenuItem value="worksheet">Pracovní list</MenuItem>
            <MenuItem value="workbook">Pracovní sešit</MenuItem>
            <MenuItem value="question">Otázky</MenuItem>
            <MenuItem value="feedback">Zpětná vazba</MenuItem>
            <MenuItem value="other">Ostatní</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddModalOpen(true)}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Přidat materiál
        </Button>
      </Box>
    </Box>

    {/* Grid materiálů */}
    {loading ? (
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
        {[...Array(8)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <MaterialCardSkeleton />
          </Grid>
        ))}
      </Grid>
    ) : filteredMaterials.length === 0 ? (
      <Box
        py={8}
        textAlign="center"
        sx={{
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: BORDER_RADIUS.compact,
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {searchQuery || filterCategory !== 'all'
            ? 'Žádné materiály nenalezeny'
            : 'Zatím nemáš žádné materiály'}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          {searchQuery || filterCategory !== 'all'
            ? 'Zkus změnit filtr nebo vyhledávání'
            : 'Začni přidáním prvního materiálu'}
        </Typography>
        {!searchQuery && filterCategory === 'all' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddModalOpen(true)}
          >
            Přidat první materiál
          </Button>
        )}
      </Box>
    ) : (
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
          {filteredMaterials.map((material) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={material.id}>
              <motion.div variants={staggerItem} style={{ height: '100%' }}>
                <MaterialCard
                  material={material}
                  onUpdate={refreshMaterials}
                />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    )}

    {/* Add Material Modal */}
    <AddMaterialModal
      open={addModalOpen}
      onClose={() => setAddModalOpen(false)}
      onSuccess={refreshMaterials}
    />
  </Box>
);
};

export default MaterialsLibrary;