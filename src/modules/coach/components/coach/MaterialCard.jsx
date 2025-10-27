import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import {
  Headphones,
  Video,
  FileText,
  Image as ImageLucide,
  FileSpreadsheet,
  Type,
  Link2
} from 'lucide-react';
import { useState } from 'react';
import { deleteMaterial } from '../../utils/storage';
import {
  getIconByType,
  getCategoryLabel,
  formatDuration,
  formatFileSize,
  formatPageCount,
} from '@shared/utils/helpers';
import PreviewModal from '../shared/PreviewModal';
import ServiceLogo from '../shared/ServiceLogo';
import AddMaterialModal from './AddMaterialModal';

const MaterialCard = ({ material, onUpdate }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMaterial(material.id);
      onUpdate();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting material:', error);
      // Still close dialog and refresh
      setDeleteDialogOpen(false);
      onUpdate();
    }
  };

  return (
    <>
      <Card
        sx={{
          minHeight: 280,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: (theme) => theme.shadows[4],
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header - kategorie vlevo, logo + chip vpravo */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            {/* Levá strana - kategorie chip */}
            <Chip
              label={getCategoryLabel(material.category).replace(/^.+ /, '')}
              size="small"
              color="primary"
              variant="outlined"
              sx={{
                height: 24,
                '& .MuiChip-label': {
                  px: 1,
                  py: 0.5,
                },
              }}
            />

            {/* Pravá strana - ikona/logo (+ chip jen pro linky se známou službou) */}
            <Box display="flex" alignItems="center" gap={1}>
              {/* Chip s názvem služby - jen pro linky se známou službou */}
              {material.type === 'link' && material.linkType && material.linkType !== 'generic' && (
                <Chip
                  label={material.linkMeta?.label || 'Odkaz'}
                  size="small"
                  sx={{
                    height: 24,
                    bgcolor: `${material.linkMeta?.color || '#757575'}15`,
                    color: material.linkMeta?.color || '#757575',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    '& .MuiChip-label': {
                      px: 1,
                      py: 0.5,
                    },
                  }}
                />
              )}
              {/* Ikona/Logo */}
              <Box sx={{ opacity: 0.8, display: 'flex', alignItems: 'center', height: 32, color: 'text.secondary' }}>
                {(() => {
                  // Link materiály
                  if (material.type === 'link') {
                    // Generic nebo neznámý linkType → ikona odkazu
                    if (!material.linkType || material.linkType === 'generic') {
                      return <Link2 size={28} strokeWidth={1.5} />;
                    }
                    // Známá služba → logo (barevné)
                    return <ServiceLogo linkType={material.linkType} size={32} />;
                  }

                  // Ostatní typy (audio, video, pdf, image, document, text) - šedé ikony
                  switch (material.type) {
                    case 'audio':
                      return <Headphones size={28} strokeWidth={1.5} />;
                    case 'video':
                      return <Video size={28} strokeWidth={1.5} />;
                    case 'pdf':
                      return <FileText size={28} strokeWidth={1.5} />;
                    case 'image':
                      return <ImageLucide size={28} strokeWidth={1.5} />;
                    case 'document':
                      return <FileSpreadsheet size={28} strokeWidth={1.5} />;
                    case 'text':
                      return <Type size={28} strokeWidth={1.5} />;
                    default:
                      return <Link2 size={28} strokeWidth={1.5} />;
                  }
                })()}
              </Box>
            </Box>
          </Box>

          {/* Title */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            {material.title}
          </Typography>

          {/* Description - jen pokud existuje a není prázdný */}
          {material.description && material.description.toString().trim() !== '' && material.description !== '0' && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {material.description}
            </Typography>
          )}

          {/* Název souboru */}
          {material.fileName && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                fontStyle: 'italic',
                fontSize: '0.875rem',
              }}
            >
              📎 {material.fileName}
            </Typography>
          )}

          {/* Meta info - jen pokud existuje */}
          {(material.duration || material.fileSize || material.pageCount) && (
            <Box display="flex" gap={2} flexWrap="wrap" alignItems="center" mt="auto">
              {material.duration && (
                <Typography variant="caption" color="text.secondary">
                  ⏱️ {formatDuration(material.duration)}
                </Typography>
              )}
              {material.pageCount && (
                <Typography variant="caption" color="text.secondary">
                  📄 {formatPageCount(material.pageCount)}
                </Typography>
              )}
              {material.fileSize && (
                <Typography variant="caption" color="text.secondary">
                  📦 {formatFileSize(material.fileSize)}
                </Typography>
              )}
            </Box>
          )}
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 0.5, justifyContent: 'space-between' }}>
          <Button
            size="small"
            startIcon={<PlayIcon />}
            onClick={() => setPreviewOpen(true)}
            sx={{ minWidth: 0, color: 'primary.main' }}
          >
            Náhled
          </Button>

          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => setEditModalOpen(true)}
            sx={{ minWidth: 0, color: 'primary.main' }}
          >
            Upravit
          </Button>

          {material.type === 'link' && (
            <Button
              size="small"
              startIcon={<OpenInNewIcon />}
              href={material.content}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ minWidth: 0, color: 'primary.main' }}
            >
              Otevřít
            </Button>
          )}

          <Button
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
            sx={{
              minWidth: 0,
              color: 'error.main',
              '&:hover': {
                bgcolor: 'error.lighter',
              }
            }}
          >
            Smazat
          </Button>
        </CardActions>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Smazat materiál?</DialogTitle>
        <DialogContent>
          <Typography>
            Opravdu chceš smazat materiál "{material.title}"? Tato akce je nevratná.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Zrušit</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Smazat
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Modal */}
      <PreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        material={material}
      />

      {/* Edit Modal */}
      <AddMaterialModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={() => {
          setEditModalOpen(false);
          onUpdate();
        }}
        editMaterial={material}
      />
    </>
  );
};

export default MaterialCard;
