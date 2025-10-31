import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Clock,
  HardDrive,
  FileText,
  Eye,
  Trash2,
  Pencil,
  ExternalLink,
  Music,
  FileVideo,
  Image as ImageIcon,
  FileType,
  Link2,
  Paperclip
} from 'lucide-react';
import { formatDuration, formatFileSize, getCategoryLabel } from '@shared/utils/helpers';
import { deleteMaterial } from '../../utils/storage';
import ServiceLogo from '../shared/ServiceLogo';
import PreviewModal from '../shared/PreviewModal';
import AddMaterialModal from './AddMaterialModal';
import BORDER_RADIUS from '@styles/borderRadius';
import { createBackdrop, createGlassDialog, createIconButton } from '../../../../shared/styles/modernEffects';
import { useGlassCard } from '@shared/hooks/useModernEffects';

const MaterialCard = ({
  material,
  onUpdate
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const glassCardStyles = useGlassCard('subtle');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isVeryNarrow = useMediaQuery('(max-width:420px)');

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteMaterial(material.id);
      onUpdate();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete material:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Ikona podle typu materiálu
  const renderIcon = () => {
    const iconSize = isVeryNarrow ? 28 : 40;
    const iconProps = {
      size: iconSize,
      strokeWidth: 1.5,
      color: theme.palette.primary.main
    };

    // Pro link typy použij vícebarevné logo služby
    if (material.type === 'link' && material.linkType) {
      return (
        <ServiceLogo 
          linkType={material.linkType} 
          size={isVeryNarrow ? 32 : 40}
        />
      );
    }

    switch (material.type) {
      case 'audio':
        return <Music {...iconProps} />;
      case 'video':
        return <FileVideo {...iconProps} />;
      case 'pdf':
        return <FileType {...iconProps} />;
      case 'image':
        return <ImageIcon {...iconProps} />;
      case 'document':
        return <FileType {...iconProps} />;
      case 'text':
        return <FileText {...iconProps} />;
      default:
        return <FileText {...iconProps} />;
    }
  };

  // Metadata podle typu
  const renderMetadata = () => {
    const metadata = [];
    const iconSize = isVeryNarrow ? 12 : 14;

    // Duration (audio/video)
    if (material.duration) {
      metadata.push({
        icon: <Clock size={iconSize} />,
        text: formatDuration(material.duration)
      });
    }

    // File size (všechny file-based typy)
    if (material.fileSize) {
      metadata.push({
        icon: <HardDrive size={iconSize} />,
        text: formatFileSize(material.fileSize)
      });
    }

    // Page count (PDF, text)
    if (material.pageCount) {
      metadata.push({
        icon: <FileText size={iconSize} />,
        text: `${material.pageCount} ${material.pageCount === 1 ? 'strana' : material.pageCount < 5 ? 'strany' : 'stran'}`
      });
    }

    return metadata;
  };

  const metadata = renderMetadata();

  return (
    <>
      <Card
        elevation={0}
        sx={{
          ...glassCardStyles,
          height: '100%',
          minHeight: 280,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: BORDER_RADIUS.card,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: isDark
              ? '0 12px 24px rgba(0, 0, 0, 0.4)'
              : '0 12px 24px rgba(0, 0, 0, 0.15)',
          }
        }}
      >
        <CardContent
          sx={{
            flexGrow: 1,
            px: isVeryNarrow ? 1 : { xs: 1, sm: 2 },
            py: isVeryNarrow ? 1.5 : { xs: 1.5, sm: 2 },
            '&:last-child': { pb: isVeryNarrow ? 1.5 : { xs: 1.5, sm: 2 } }
          }}
        >
          {/* Horní řádek: Kategorie chip + Ikona/Logo (proklikávací) */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={isVeryNarrow ? 1 : { xs: 1, sm: 1.5 }}>
            <Chip
              label={getCategoryLabel(material.category)}
              size="small"
              sx={{
                height: isVeryNarrow ? 18 : 20,
                fontSize: isVeryNarrow ? '0.65rem' : '0.7rem',
                fontWeight: 500,
                backgroundColor: isDark ? 'rgba(139, 188, 143, 0.2)' : 'rgba(139, 188, 143, 0.15)',
                color: 'primary.main',
                '& .MuiChip-label': {
                  px: isVeryNarrow ? 0.75 : 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }
              }}
            />

            {/* Ikona/Logo v pravém rohu - PROKLIKÁVACÍ (otevře preview) */}
            <IconButton
              size="small"
              onClick={() => setPreviewOpen(true)}
              sx={{
                p: 0.5,
                '&:hover': {
                  backgroundColor: isDark ? 'rgba(139, 188, 143, 0.1)' : 'rgba(139, 188, 143, 0.08)',
                }
              }}
            >
              {renderIcon()}
            </IconButton>
          </Box>

          {/* Hlavní content: Text obsah | Akční ikony */}
          <Box
            display="flex"
            gap={isVeryNarrow ? 0.75 : 1}
            alignItems="flex-start"
            flex={1}
          >
            {/* Levý sloupec: Text obsah (plná šířka) */}
            <Box
              display="flex"
              flexDirection="column"
              gap={0.5}
              sx={{
                flex: '1 1 0px',
                minWidth: 0,
                width: 0,
                overflow: 'hidden',
              }}
            >
                {/* Název materiálu */}
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: isVeryNarrow ? '1rem' : { xs: '1rem', sm: '1.1rem' },
                    fontWeight: 600,
                    color: 'text.primary',
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-word',
                    hyphens: 'auto',
                    minWidth: 0,
                    minHeight: '2.6em', // 2 řádky × 1.3 lineHeight
                  }}
                >
                  {material.title}
                </Typography>

                {/* Popis - VŽDY zobrazený (i prázdný) */}
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: isVeryNarrow ? '0.8rem' : { xs: '0.85rem', sm: '0.875rem' },
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-word',
                    hyphens: 'auto',
                    minWidth: 0,
                    minHeight: '2.8em', // 2 řádky × 1.4 lineHeight
                  }}
                >
                  {material.description || '\u00A0'}
                </Typography>

                {/* URL nebo fileName (jen pro link a file-based typy) */}
                {material.type === 'link' && material.content && (
                  <Box display="flex" alignItems="center" gap={0.5} sx={{ minWidth: 0, overflow: 'hidden' }}>
                    <Link2 
                      size={isVeryNarrow ? 11 : 12} 
                      style={{ flexShrink: 0 }}
                      color={theme.palette.text.secondary}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.7rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        minWidth: 0,
                      }}
                    >
                      {material.content}
                    </Typography>
                  </Box>
                )}

                {material.fileName && (
                  <Box display="flex" alignItems="center" gap={0.5} sx={{ minWidth: 0, overflow: 'hidden' }}>
                    <Paperclip 
                      size={isVeryNarrow ? 11 : 12} 
                      style={{ flexShrink: 0 }}
                      color={theme.palette.text.secondary}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.7rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        minWidth: 0,
                      }}
                    >
                      {material.fileName}
                    </Typography>
                  </Box>
                )}

                {/* Metadata (duration, file size, page count) */}
                {metadata.length > 0 && (
                  <Box display="flex" gap={isVeryNarrow ? 1 : 1.5} flexWrap="wrap">
                    {metadata.map((item, index) => (
                      <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                      >
                        <Box sx={{ color: 'text.secondary', display: 'flex' }}>
                          {item.icon}
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.7rem',
                          }}
                        >
                          {item.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
            </Box>

            {/* Pravý sloupec: Akční ikony */}
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={isVeryNarrow ? 0.5 : 1}
              sx={{
                minWidth: isVeryNarrow ? 36 : { xs: 40, sm: 56 },
                maxWidth: isVeryNarrow ? 36 : { xs: 40, sm: 56 },
                width: isVeryNarrow ? 36 : { xs: 40, sm: 56 },
                flexShrink: 0
              }}
            >
              {/* Náhled */}
              <IconButton
                size="small"
                onClick={() => setPreviewOpen(true)}
                sx={createIconButton('secondary', isDark, 'small')}
              >
                <Eye size={isVeryNarrow ? 14 : 18} />
              </IconButton>

              {/* Editace */}
              <IconButton
                size="small"
                onClick={() => setEditOpen(true)}
                sx={createIconButton('secondary', isDark, 'small')}
              >
                <Pencil size={isVeryNarrow ? 14 : 18} />
              </IconButton>

              {/* Otevřít (jen pro link materiály) */}
              {material.type === 'link' && (
                <IconButton
                  size="small"
                  component="a"
                  href={material.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={createIconButton('secondary', isDark, 'small')}
                >
                  <ExternalLink size={isVeryNarrow ? 14 : 18} />
                </IconButton>
              )}

              {/* Smazat */}
              <IconButton
                size="small"
                onClick={handleDeleteClick}
                sx={createIconButton('error', isDark, 'small')}
              >
                <Trash2 size={isVeryNarrow ? 14 : 18} />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Delete Dialog s glassmorphism */}
<Dialog 
  open={deleteDialogOpen} 
  onClose={() => setDeleteDialogOpen(false)}
  BackdropProps={{ sx: createBackdrop() }}
  PaperProps={{ sx: createGlassDialog(isDark, BORDER_RADIUS.dialog) }}
>
        <DialogTitle>Smazat materiál?</DialogTitle>
        <DialogContent>
          <Typography>
            Opravdu chceš smazat materiál <strong>{material.title}</strong>?
            Tato akce je nevratná.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={isDeleting}
            sx={{ borderRadius: BORDER_RADIUS.button }}
          >
            Zrušit
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ borderRadius: BORDER_RADIUS.button }}
          >
            {isDeleting ? 'Mazání...' : 'Smazat'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Modal */}
      <PreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        material={material}
      />

      {/* Edit Material Modal */}
      <AddMaterialModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={() => {
          setEditOpen(false);
          onUpdate();
        }}
        editMaterial={material}
      />
    </>
  );
};

export default MaterialCard;