import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { getCurrentUser, getMaterials } from '../../utils/storage';
import { getIconByType, getCategoryLabel, formatDuration } from '@shared/utils/helpers';

const MaterialSelector = ({ open, onClose, selectedMaterialIds = [], onConfirm, dayNumber }) => {
  const currentUser = getCurrentUser();
  const materials = getMaterials(currentUser?.id);

  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Initialize selected materials when dialog opens
  useEffect(() => {
    if (open) {
      setSelected([...selectedMaterialIds]);
    }
  }, [open, selectedMaterialIds]);

  // Filter materials
  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      // Filter by category
      if (filterCategory !== 'all' && material.category !== filterCategory) {
        return false;
      }

      // Filter by search query
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

  const handleToggle = (materialId) => {
    if (selected.includes(materialId)) {
      setSelected(selected.filter((id) => id !== materialId));
    } else {
      setSelected([...selected, materialId]);
    }
  };

  const handleConfirm = () => {
    onConfirm(selected);
    handleClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    setFilterCategory('all');
    onClose();
  };

  const isSelected = (materialId) => selected.includes(materialId);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Vybrat materiály {dayNumber && `pro Den ${dayNumber}`}
      </DialogTitle>

      <DialogContent>
        {/* Search & Filter */}
        <Box display="flex" gap={2} mb={3} flexDirection={{ xs: 'column', sm: 'row' }}>
          <TextField
            placeholder="Hledat materiály..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flex: 1 }}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Kategorie</InputLabel>
            <Select
              value={filterCategory}
              label="Kategorie"
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <MenuItem value="all">Všechny</MenuItem>
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
        </Box>

        {/* Selected count */}
        {selected.length > 0 && (
          <Box mb={2}>
            <Chip
              label={`Vybráno: ${selected.length} ${selected.length === 1 ? 'materiál' : selected.length < 5 ? 'materiály' : 'materiálů'}`}
              color="primary"
            />
          </Box>
        )}

        {/* Materials grid */}
        {filteredMaterials.length === 0 ? (
          <Box py={4} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              {searchQuery || filterCategory !== 'all'
                ? 'Žádné materiály nenalezeny'
                : 'Nemáš žádné materiály. Nejdřív nějaké vytvoř.'}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {filteredMaterials.map((material) => {
              const selected = isSelected(material.id);

              return (
                <Grid item xs={12} sm={6} key={material.id}>
                  <Card
                    onClick={() => handleToggle(material.id)}
                    sx={{
                      cursor: 'pointer',
                      border: 2,
                      borderColor: selected ? 'primary.main' : 'divider',
                      backgroundColor: selected
                        ? (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(143, 188, 143, 0.1)'
                              : 'rgba(85, 107, 47, 0.05)'
                        : 'background.paper',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="start" gap={2}>
                        <Checkbox
                          checked={selected}
                          onChange={() => handleToggle(material.id)}
                          onClick={(e) => e.stopPropagation()}
                        />

                        <Box flexGrow={1}>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Box fontSize={20}>{getIconByType(material.type)}</Box>
                            <Chip
                              label={getCategoryLabel(material.category).replace(/^.+ /, '')}
                              size="small"
                              variant="outlined"
                            />
                          </Box>

                          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {material.title}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {material.description}
                          </Typography>

                          {material.duration && (
                            <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                              ⏱️ {formatDuration(material.duration)}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Zrušit</Button>
        <Button onClick={handleConfirm} variant="contained">
          Potvrdit ({selected.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MaterialSelector;
