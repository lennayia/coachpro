import { useState } from 'react';
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
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ProgramEditor from './ProgramEditor';
import ShareProgramModal from './ShareProgramModal';
import { getCurrentUser, getPrograms, deleteProgram, getClients } from '../../utils/storage';
import { staggerContainer, staggerItem } from '@shared/styles/animations';
import { formatDate, pluralize } from '@shared/utils/helpers';
import BORDER_RADIUS from '@styles/borderRadius';

const ProgramsList = () => {
  const currentUser = getCurrentUser();
  const [programs, setPrograms] = useState(getPrograms(currentUser?.id));
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuProgram, setMenuProgram] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);

  const refreshPrograms = () => {
    setPrograms(getPrograms(currentUser?.id));
  };

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

  const handleDeleteClick = (program) => {
    setProgramToDelete(program);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (programToDelete) {
      deleteProgram(programToDelete.id);
      refreshPrograms();
      setDeleteDialogOpen(false);
      setProgramToDelete(null);
    }
  };

  const getProgramClients = (programCode) => {
    const allClients = getClients();
    return allClients.filter(c => c.programCode === programCode);
  };

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap={2}
      >
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Moje programy
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Vytvárej a spravuj programy pro své klientky
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNew}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Vytvořit program
        </Button>
      </Box>

      {/* Programs grid */}
      {programs.length === 0 ? (
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
            {programs.map((program) => {
              const clients = getProgramClients(program.shareCode);
              const activeClients = clients.filter(c => !c.completedAt).length;

              return (
                <Grid item xs={12} sm={6} md={4} key={program.id}>
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

                      <CardActions>
                        <Button
                          size="small"
                          startIcon={<ShareIcon />}
                          onClick={() => handleShare(program)}
                        >
                          Sdílet
                        </Button>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEdit(program)}
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
          <Button onClick={() => setDeleteDialogOpen(false)}>Zrušit</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Smazat
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
