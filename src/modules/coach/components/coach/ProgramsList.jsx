import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  useTheme,
  TextField,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  QrCode2 as QrCodeIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ProgramEditor from './ProgramEditor';
import ShareProgramModal from './ShareProgramModal';
import { getCurrentUser, getPrograms, deleteProgram, getClients, setCurrentClient } from '../../utils/storage';
import { generateUUID } from '../../utils/generateCode';
import { staggerContainer, staggerItem } from '@shared/styles/animations';
import { formatDate, pluralize } from '@shared/utils/helpers';
import BORDER_RADIUS from '@styles/borderRadius';
import { createPreviewButton, createActionButton, createIconButton } from '../../../../shared/styles/modernEffects';

const ProgramsList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const currentUser = getCurrentUser();
  const [programs, setPrograms] = useState(getPrograms(currentUser?.id));
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuProgram, setMenuProgram] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const refreshPrograms = () => {
    setPrograms(getPrograms(currentUser?.id));
  };

  // Filtrované a prohledané programy
  const filteredPrograms = useMemo(() => {
    return programs.filter(program => {
      // Filtr podle statusu
      if (filterStatus !== 'all') {
        const isActive = filterStatus === 'active';
        if (program.isActive !== isActive) {
          return false;
        }
      }

      // Filtr podle search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          program.title.toLowerCase().includes(query) ||
          program.description?.toLowerCase().includes(query) ||
          program.shareCode.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [programs, searchQuery, filterStatus]);

  const handleMenuOpen = (event, program) => {
    setAnchorEl(event.currentTarget);
    setMenuProgram(program);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuProgram(null);
  };

  const handleCreateNew = () => {
    setEditingProgram(null);
    setEditorOpen(true);
  };

  const handleEdit = (program) => {
    setEditingProgram(program);
    setEditorOpen(true);
    handleMenuClose();
  };

  const handleShare = (program) => {
    setSelectedProgram(program);
    setShareModalOpen(true);
    handleMenuClose();
  };

  const handlePreview = (program) => {
    // Vytvoř admin preview session
    const adminClient = {
      id: generateUUID(),
      name: 'Preview (Koučka)',
      programCode: program.shareCode,
      programId: program.id,
      startedAt: new Date().toISOString(),
      currentDay: 1,
      streak: 0,
      longestStreak: 0,
      moodLog: [],
      completedDays: [],
      completedAt: null,
      certificateGenerated: false,
      isAdmin: true, // 🔑 admin preview režim
    };

    // Ulož do session storage
    setCurrentClient(adminClient);

    // Přesměruj na klientskou zónu
    navigate('/client/daily');
    handleMenuClose();
  };

  const handleDeleteClick = (program) => {
    setProgramToDelete(program);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (programToDelete) {
      setIsDeleting(true);
      try {
        await deleteProgram(programToDelete.id);
        refreshPrograms();
        setDeleteDialogOpen(false);
        setProgramToDelete(null);
      } catch (error) {
        console.error('Failed to delete program:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getProgramClients = (programCode) => {
    const allClients = getClients();
    return allClients.filter(c => c.programCode === programCode);
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Moje programy
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Vytvářejte a spravujte programy pro své klientky
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
          placeholder="Hledat programy..."
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
        <Box display="flex" gap={2} flexWrap="wrap">
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">Všechny programy</MenuItem>
              <MenuItem value="active">✅ Aktivní</MenuItem>
              <MenuItem value="inactive">⏸️ Neaktivní</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Vytvořit program
          </Button>
        </Box>
      </Box>

      {/* Programs grid */}
      {filteredPrograms.length === 0 ? (
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
            Zatím nemáš žádné programy
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Začni vytvořením prvního programu pro své klientky
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
          >
            Vytvořit první program
          </Button>
        </Box>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3}>
            {filteredPrograms.map((program) => {
              const clients = getProgramClients(program.shareCode);
              const activeClients = clients.filter(c => !c.completedAt).length;

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={program.id}>
                  <motion.div variants={staggerItem}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: (theme) => theme.shadows[4],
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        {/* Header */}
                        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                          <Chip
                            icon={program.isActive ? <ActiveIcon /> : <InactiveIcon />}
                            label={program.isActive ? 'Aktivní' : 'Neaktivní'}
                            size="small"
                            color={program.isActive ? 'success' : 'default'}
                          />
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, program)}
                            sx={{
                              ...createIconButton('error', isDark, 'small'),
                              color: 'error.main',
                            }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Box>

                        {/* Title */}
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          {program.title}
                        </Typography>

                        {/* Description */}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {program.description}
                        </Typography>

                        {/* Meta info */}
                        <Box display="flex" flexDirection="column" gap={1}>
                          <Typography variant="caption" color="text.secondary">
                            ⏱️ {pluralize(program.duration, 'den', 'dny', 'dní')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            📚 {pluralize(
                              program.days.reduce((acc, day) => acc + (day.materialIds?.length || 0), 0),
                              'materiál',
                              'materiály',
                              'materiálů'
                            )}
                          </Typography>
                          {clients.length > 0 && (
                            <Typography variant="caption" color="primary.main" sx={{ fontWeight: 600 }}>
                              👥 {pluralize(activeClients, 'aktivní klientka', 'aktivní klientky', 'aktivních klientek')}
                            </Typography>
                          )}
                        </Box>

                        {/* Share code */}
                        <Box
                          mt={2}
                          p={1.5}
                          sx={{
                            backgroundColor: (theme) =>
                              theme.palette.mode === 'dark'
                                ? 'rgba(143, 188, 143, 0.1)'
                                : 'rgba(85, 107, 47, 0.05)',
                            borderRadius: BORDER_RADIUS.small,
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="caption" color="text.secondary" display="block">
                            Kód programu
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, letterSpacing: 2 }}
                          >
                            {program.shareCode}
                          </Typography>
                        </Box>
                      </CardContent>

                      <CardActions sx={{ flexWrap: 'wrap', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<UserIcon size={16} />}
                          onClick={() => handlePreview(program)}
                          sx={createPreviewButton(isDark, BORDER_RADIUS.button)}
                        >
                          Náhled jako klientka
                        </Button>
                        <Button
                          size="small"
                          startIcon={<ShareIcon />}
                          onClick={() => handleShare(program)}
                          sx={createActionButton('text', BORDER_RADIUS.button)}
                        >
                          Sdílet
                        </Button>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEdit(program)}
                          sx={createActionButton('text', BORDER_RADIUS.button)}
                        >
                          Upravit
                        </Button>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        </motion.div>
      )}

      {/* Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handlePreview(menuProgram)}>
          <UserIcon size={18} style={{ marginRight: 8 }} />
          Náhled jako klientka
        </MenuItem>
        <MenuItem onClick={() => handleShare(menuProgram)}>
          <QrCodeIcon fontSize="small" sx={{ mr: 1 }} />
          Sdílet
        </MenuItem>
        <MenuItem onClick={() => handleEdit(menuProgram)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Upravit
        </MenuItem>
        <MenuItem
          onClick={() => handleDeleteClick(menuProgram)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Smazat
        </MenuItem>
      </Menu>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Smazat program?</DialogTitle>
        <DialogContent>
          <Typography>
            Opravdu chceš smazat program "{programToDelete?.title}"?
            {getProgramClients(programToDelete?.shareCode).length > 0 && (
              <strong> Pozor: Program má aktivní klientky!</strong>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={isDeleting}
          >
            Zrušit
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isDeleting ? 'Mazání...' : 'Smazat'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Program Editor */}
      <ProgramEditor
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setEditingProgram(null);
        }}
        onSuccess={(program) => {
          refreshPrograms();
          setEditorOpen(false);
          setEditingProgram(null);
          // Otevři share modal pro nový program
          if (!editingProgram) {
            setSelectedProgram(program);
            setShareModalOpen(true);
          }
        }}
        program={editingProgram}
      />

      {/* Share Program Modal */}
      <ShareProgramModal
        open={shareModalOpen}
        onClose={() => {
          setShareModalOpen(false);
          setSelectedProgram(null);
        }}
        program={selectedProgram}
      />
    </Box>
  );
};

export default ProgramsList;
