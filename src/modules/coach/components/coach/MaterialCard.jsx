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
import { createBackdrop, createGlassDialog } from '../../../../shared/styles/modernEffects';
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
  const isVeryNarrow = useMediaQuery('(max-width:420px)');

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteMaterial(material.id);
    onUpdate();
    setDeleteDialogOpen(false);
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
            px: isVeryNarrow ? 1 : { xs: 1, sm: 2 },
            py: isVeryNarrow ? 1.5 : { xs: 1.5, sm: 2 },
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: isVeryNarrow ? 1 : { xs: 1, sm: 1.5 },
            '&:last-child': { pb: isVeryNarrow ? 1.5 : { xs: 1.5, sm: 2 } }
          }}
        >
          {/* Horní řádek: Kategorie chip + Service logo (jen pro links) */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
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

            {/* Logo služby v pravém rohu (jen pro link typy) */}
            {material.type === 'link' && material.linkType && (
              <ServiceLogo 
                linkType={material.linkType} 
                size={isVeryNarrow ? 28 : 32}
              />
            )}
          </Box>

          {/* Hlavní content: Ikona + Text obsah | Akční ikony */}
          <Box
            display="flex"
            gap={isVeryNarrow ? 0.75 : 1}
            alignItems="flex-start"
            flex={1}
          >
            {/* Levý sloupec: Ikona + Text obsah */}
            <Box
              display="flex"
              gap={isVeryNarrow ? 0.75 : { xs: 1, sm: 1.5 }}
              alignItems="flex-start"
              sx={{
                flex: '1 1 0px',
                minWidth: 0,
                width: 0,
                overflow: 'hidden',
              }}
            >
              {/* Velká ikona materiálu */}
              <Box flexShrink={0}>
                {renderIcon()}
              </Box>

              {/* Text obsah */}
              <Box
                display="flex"
                flexDirection="column"
                gap={0.5}
                sx={{
                  flex: 1,
                  minWidth: 0,
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
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-word',
                    hyphens: 'auto',
                    minWidth: 0,
                  }}
                >
                  {material.title}
                </Typography>

                {/* Popis */}
                {material.description && (
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
                    }}
                  >
                    {material.description}
                  </Typography>
                )}

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

                {/* Chip "Náhled" pro link materiály s embed supportem */}
                {material.type === 'link' && material.linkMeta?.embedSupport && (
                  <Chip
                    label="Náhled"
                    size="small"
                    sx={{
                      height: isVeryNarrow ? 18 : 20,
                      width: 'fit-content',
                      fontSize: isVeryNarrow ? '0.65rem' : '0.7rem',
                      fontWeight: 500,
                      backgroundColor: material.linkMeta?.color 
                        ? `${material.linkMeta.color}15`
                        : 'rgba(139, 188, 143, 0.15)',
                      color: material.linkMeta?.color || 'primary.main',
                      '& .MuiChip-label': {
                        px: isVeryNarrow ? 0.75 : 1,
                      }
                    }}
                  />
                )}
              </Box>
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
                sx={{
                  p: isVeryNarrow ? 0.25 : 0.5,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: isDark ? 'rgba(139, 188, 143, 0.1)' : 'rgba(139, 188, 143, 0.08)'
                  }
                }}
              >
                <Eye size={isVeryNarrow ? 14 : 18} />
              </IconButton>

              {/* Editace */}
              <IconButton
                size="small"
                onClick={() => setEditOpen(true)}
                sx={{
                  p: isVeryNarrow ? 0.25 : 0.5,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: isDark ? 'rgba(139, 188, 143, 0.1)' : 'rgba(139, 188, 143, 0.08)'
                  }
                }}
              >
                <Pencil size={isVeryNarrow  ? 14 : 18} />
              </IconButton>

              {/* Otevřít (jen pro link materiály) */}
              {material.type === 'link' && (
                <IconButton
                  size="small"
                  component="a"
                  href={material.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    p: isVeryNarrow ? 0.25 : 0.5,
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: isDark ? 'rgba(139, 188, 143, 0.1)' : 'rgba(139, 188, 143, 0.08)'
                    }
                  }}
                >
                  <ExternalLink size={isVeryNarrow ? 14 : 18} />
                </IconButton>
              )}

              {/* Smazat */}
              <IconButton
  size="small"
  onClick={handleDeleteClick}
  sx={{
    p: isVeryNarrow ? 0.25 : 0.5,
    color: 'error.main',  // ← ČERVENÁ BARVA
    '&:hover': {
      color: 'error.dark',
      backgroundColor: isDark ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.08)'
    }
  }}
>
  <Trash2 size={18} />  {/* ← STEJNÁ VELIKOST JAKO OSTATNÍ */}
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
            sx={{ borderRadius: BORDER_RADIUS.button }}
          >
            Zrušit
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            color="error"
            sx={{ borderRadius: BORDER_RADIUS.button }}
          >
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