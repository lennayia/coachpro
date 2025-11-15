import { useState, useMemo, useEffect } from 'react';
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
import { User as UserIcon, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ProgramEditor from './ProgramEditor';
import ProgramCardSkeleton from './ProgramCardSkeleton';
import ShareProgramModal from './ShareProgramModal';
import { getCurrentUser, getPrograms, deleteProgram, getClients, setCurrentClient, getMaterials } from '../../utils/storage';
import { generateUUID } from '../../utils/generateCode';
import { staggerContainer, staggerItem } from '@shared/styles/animations';
import { formatDate, pluralize } from '@shared/utils/helpers';
import BORDER_RADIUS from '@styles/borderRadius';
import { createPreviewButton, createActionButton, createIconButton, createBackdrop, createGlassDialog } from '@shared/styles/modernEffects';
import { SECTION_PADDING } from '@shared/styles/responsive';
import HelpDialog from '@shared/components/HelpDialog';
import QuickTooltip from '@shared/components/AppTooltip';
import { useNotification } from '@shared/context/NotificationContext';
import ProgramCard from './ProgramCard';

const ProgramsList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const currentUser = getCurrentUser();
  const { showSuccess, showError } = useNotification();
  const [programs, setPrograms] = useState([]);
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
  const [loading, setLoading] = useState(true);
  const [clientsByProgramCode, setClientsByProgramCode] = useState({});
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [materials, setMaterials] = useState([]);

  // Load programs and materials on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      const [programsData, materialsData] = await Promise.all([
        getPrograms(currentUser?.id),
        getMaterials(currentUser?.id)
      ]);
      setPrograms(programsData);
      setMaterials(materialsData);
      setLoading(false);
    };

    loadData();
  }, [currentUser?.id]);

  // Load clients for all programs
  useEffect(() => {
    const loadClients = async () => {
      const clientsMap = {};
      await Promise.all(
        programs.map(async (program) => {
          const clients = await getClients();
          clientsMap[program.shareCode] = clients.filter(c => c.programCode === program.shareCode);
        })
      );
      setClientsByProgramCode(clientsMap);
    };

    if (programs.length > 0) {
      loadClients();
    }
  }, [programs]);

  const refreshPrograms = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setPrograms(await getPrograms(currentUser?.id));
    setLoading(false);
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
      _returnUrl: window.location.pathname // Uložíme odkud přišla
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
        showSuccess('Smazáno!', `Program "${programToDelete.title}" byl úspěšně smazán`);
        await refreshPrograms();
        setDeleteDialogOpen(false);
        setProgramToDelete(null);
      } catch (error) {
        console.error('Failed to delete program:', error);
        showError('Chyba', 'Nepodařilo se smazat program. Zkus to prosím znovu.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleDuplicate = (program) => {
    // Vytvoř kopii programu s novým názvem a ID
    const duplicatedProgram = {
      ...program,
      id: null, // ProgramEditor vygeneruje nové ID
      title: `${program.title} (kopie)`,
      shareCode: null, // Vygeneruje se nový
      qrCode: null, // Vygeneruje se nový
      createdAt: null, // Nastaví se current date
    };

    showSuccess('Duplikováno!', `Program "${program.title}" byl zkopírován`);
    setEditingProgram(duplicatedProgram);
    setEditorOpen(true);
  };

  return (
    <Box sx={{ ...SECTION_PADDING }}>
      {/* Header */}
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Moje programy
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Vytvářejte a spravujte programy pro své klientky
          </Typography>
        </Box>

        {/* Help Button */}
        <QuickTooltip title="Nápověda k programům">
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
              <MenuItem value="active">Aktivní</MenuItem>
              <MenuItem value="inactive">Neaktivní</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
            sx={{
              whiteSpace: 'nowrap',
              alignSelf: 'flex-start',
              minWidth: 'fit-content',
              px: { xs: 2, sm: 3 },
              py: { xs: 0.75, sm: 1 }
            }}
          >
            Vytvořit program
          </Button>
        </Box>
      </Box>

      {/* Programs grid */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} xsm={6} sm={6} md={4} lg={3} key={index} sx={{ minWidth: 0 }}>
              <ProgramCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : filteredPrograms.length === 0 ? (
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
              const clients = clientsByProgramCode[program.shareCode] || [];
              const activeClients = clients.filter(c => !c.completedAt).length;

              return (
                <Grid item xs={12} xsm={6} sm={6} md={4} lg={3} key={program.id} sx={{ minWidth: 0 }}>
                  <motion.div variants={staggerItem}>
                    <ProgramCard
                      program={program}
                      clients={clients}
                      materials={materials}
                      onPreview={handlePreview}
                      onDuplicate={() => handleDuplicate(program)}
                      onShare={handleShare}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                      onMenuOpen={handleMenuOpen}
                    />
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
        BackdropProps={{
          sx: createBackdrop()
        }}
        PaperProps={{
          sx: createGlassDialog(isDark, BORDER_RADIUS.dialog)
        }}
      >
        <DialogTitle>Smazat program?</DialogTitle>
        <DialogContent>
          <Typography>
            Opravdu chceš smazat program "{programToDelete?.title}"?
            {(clientsByProgramCode[programToDelete?.shareCode] || []).length > 0 && (
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
          if (!editingProgram) {
            showSuccess('Hotovo!', `Program "${program.title}" byl úspěšně vytvořen 🎉`);
          } else {
            showSuccess('Uloženo!', `Program "${program.title}" byl úspěšně upraven`);
          }
          refreshPrograms();
          setEditorOpen(false);
          setEditingProgram(null);
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

      {/* Help Dialog */}
      <HelpDialog
        open={helpDialogOpen}
        onClose={() => setHelpDialogOpen(false)}
        initialPage="programs"
      />
    </Box>
  );
};

export default ProgramsList;
