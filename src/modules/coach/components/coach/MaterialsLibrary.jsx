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
  Autocomplete,
  Chip,
  IconButton,
  useTheme,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, FilterListOff as ClearIcon } from '@mui/icons-material';
import { HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import MaterialCard from './MaterialCard';
import MaterialCardSkeleton from './MaterialCardSkeleton';
import AddMaterialModal from './AddMaterialModal';
import { getCurrentUser, getMaterials } from '../../utils/storage';
import { staggerContainer, staggerItem } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import { SECTION_PADDING } from '@shared/styles/responsive';
import HelpDialog from '@shared/components/HelpDialog';
import QuickTooltip from '@shared/components/AppTooltip';
import {
  COACHING_AREAS,
  TOPICS,
  COACHING_STYLES,
  COACHING_AUTHORITIES,
} from '@shared/constants/coachingTaxonomy';

const MaterialsLibrary = () => {
  const currentUser = getCurrentUser();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [materials, setMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  // Taxonomy filters (Session 12 - KROK 4)
  const [filterCoachingArea, setFilterCoachingArea] = useState('all');
  const [filterTopics, setFilterTopics] = useState([]);
  const [filterCoachingStyle, setFilterCoachingStyle] = useState('all');
  const [filterCoachingAuthority, setFilterCoachingAuthority] = useState('all');

  // Load materials on mount
  useEffect(() => {
    const loadMaterials = async () => {
      setLoading(true);
      // Simulate async loading (for future Supabase integration)
      await new Promise(resolve => setTimeout(resolve, 300));
      setMaterials(await getMaterials(currentUser?.id));
      setLoading(false);
    };

    loadMaterials();
  }, [currentUser?.id]);

  // Refresh materials
  const refreshMaterials = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setMaterials(await getMaterials(currentUser?.id));
    setLoading(false);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setFilterCategory('all');
    setFilterCoachingArea('all');
    setFilterTopics([]);
    setFilterCoachingStyle('all');
    setFilterCoachingAuthority('all');
  };

  // Filtrované a prohledané materiály
  const filteredMaterials = useMemo(() => {
    return materials.filter(material => {
      // Filtr podle kategorie
      if (filterCategory !== 'all' && material.category !== filterCategory) {
        return false;
      }

      // Filtr podle coaching area
      if (filterCoachingArea !== 'all' && material.coachingArea !== filterCoachingArea) {
        return false;
      }

      // Filtr podle topics (materiál musí obsahovat všechny vybrané topics)
      if (filterTopics.length > 0) {
        const materialTopics = material.topics || [];
        const hasAllTopics = filterTopics.every(topic =>
          materialTopics.includes(topic)
        );
        if (!hasAllTopics) {
          return false;
        }
      }

      // Filtr podle coaching style
      if (filterCoachingStyle !== 'all' && material.coachingStyle !== filterCoachingStyle) {
        return false;
      }

      // Filtr podle coaching authority
      if (filterCoachingAuthority !== 'all' && material.coachingAuthority !== filterCoachingAuthority) {
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
  }, [materials, searchQuery, filterCategory, filterCoachingArea, filterTopics, filterCoachingStyle, filterCoachingAuthority]);

  return (
  <Box sx={{ ...SECTION_PADDING }}>
    {/* Header */}
    <Box mb={4} display="flex" justifyContent="space-between" alignItems="flex-start">
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Knihovna materiálů
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Spravujte své video i audio nahrávky, textové i PDF dokumenty a další materiály
        </Typography>
      </Box>

      {/* Help Button */}
      <QuickTooltip title="Nápověda ke Knihovně materiálů">
        <IconButton
          onClick={() => setHelpDialogOpen(true)}
          sx={{
            width: 48,
            height: 48,
            backgroundColor: isDark
              ? 'rgba(120, 188, 143, 0.15)'
              : 'rgba(65, 117, 47, 0.15)',
            color: isDark
              ? 'rgba(120, 188, 143, 0.9)'
              : 'rgba(65, 117, 47, 0.9)',
            transition: 'all 0.3s',
            '&:hover': {
              backgroundColor: isDark
                ? 'rgba(120, 188, 143, 0.25)'
                : 'rgba(65, 117, 47, 0.25)',
              transform: 'scale(1.05)',
            },
          }}
        >
          <HelpCircle size={24} />
        </IconButton>
      </QuickTooltip>
    </Box>

    {/* Top bar - Search, Topics, Add */}
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

      {/* Topics - Multi-select Autocomplete */}
      <Autocomplete
        multiple
        options={TOPICS}
        value={filterTopics}
        onChange={(event, newValue) => setFilterTopics(newValue)}
        sx={{ flex: 1, maxWidth: { md: 400 } }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Témata"
            placeholder="Vyber témata"
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              label={option}
              size="small"
              {...getTagProps({ index })}
            />
          ))
        }
      />

      {/* Add button */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setAddModalOpen(true)}
        sx={{
          whiteSpace: 'nowrap',
          alignSelf: 'flex-start',
          minWidth: 'fit-content',
          px: { xs: 2, sm: 3 },
          py: { xs: 0.75, sm: 1 }
        }}
      >
        Přidat materiál
      </Button>
    </Box>

    {/* Taxonomy Filters (Session 12 - KROK 4) */}
    <Box
      display="flex"
      flexWrap="wrap"
      gap={2}
      mb={4}
      alignItems="center"
    >
      {/* Kategorie */}
      <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
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

      {/* Coaching Area */}
      <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
        <InputLabel>Oblast koučinku</InputLabel>
        <Select
          value={filterCoachingArea}
          label="Oblast koučinku"
          onChange={(e) => setFilterCoachingArea(e.target.value)}
        >
          <MenuItem value="all">Všechny oblasti</MenuItem>
          {COACHING_AREAS.map((area) => (
            <MenuItem key={area.value} value={area.value}>
              {area.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Coaching Style */}
      <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
        <InputLabel>Koučovací přístup</InputLabel>
        <Select
          value={filterCoachingStyle}
          label="Koučovací přístup"
          onChange={(e) => setFilterCoachingStyle(e.target.value)}
        >
          <MenuItem value="all">Všechny přístupy</MenuItem>
          {COACHING_STYLES.map((style) => (
            <MenuItem key={style.value} value={style.value}>
              {style.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Coaching Authority */}
      <FormControl sx={{ minWidth: { xs: '100%', sm: 250 } }}>
        <InputLabel>Certifikace</InputLabel>
        <Select
          value={filterCoachingAuthority}
          label="Certifikace"
          onChange={(e) => setFilterCoachingAuthority(e.target.value)}
        >
          <MenuItem value="all">Všechny certifikace</MenuItem>
          {COACHING_AUTHORITIES.map((authority) => (
            <MenuItem key={authority.value} value={authority.value}>
              {authority.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Vyčistit filtry tlačítko */}
      <Button
        variant="outlined"
        startIcon={<ClearIcon />}
        onClick={clearAllFilters}
        sx={{
          whiteSpace: 'nowrap',
          minWidth: { xs: '100%', sm: 'auto' },
        }}
      >
        Vyčistit filtry
      </Button>
    </Box>

    {/* Grid materiálů */}
    {loading ? (
      <Grid container spacing={3}>
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
        <Grid container spacing={3}>
          {filteredMaterials.map((material) => (
            <Grid item xs={12} xsm={6} sm={6} md={4} lg={3} key={material.id} sx={{ minWidth: 0 }}>
              <motion.div variants={staggerItem} style={{ height: '100%', minWidth: 0 }}>
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

    {/* Help Dialog */}
    <HelpDialog
      open={helpDialogOpen}
      onClose={() => setHelpDialogOpen(false)}
      initialPage="materials"
    />
  </Box>
);
};

export default MaterialsLibrary;