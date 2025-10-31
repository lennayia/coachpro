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
  Paperclip,
  Share2,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDuration, formatFileSize, getCategoryLabel } from '@shared/utils/helpers';
import { deleteMaterial, getCurrentUser, getPrograms, setCurrentClient } from '../../utils/storage';
import { generateUUID } from '../../utils/generateCode';
import ServiceLogo from '../shared/ServiceLogo';
import PreviewModal from '../shared/PreviewModal';
import AddMaterialModal from './AddMaterialModal';
import BORDER_RADIUS from '@styles/borderRadius';
import { createBackdrop, createGlassDialog, createIconButton } from '../../../../shared/styles/modernEffects';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import { QuickTooltip } from '@shared/components/AppTooltip';

const MaterialCard = ({
  material,
  onUpdate
}) => {
  const navigate = useNavigate();
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

  // Klientská preview - zobrazí materiál v klientském rozhraní
  const handleClientPreview = () => {
    const currentUser = getCurrentUser();

    // Vytvoř dočasný program s pouze tímto materiálem
    const tempProgram = {
      id: generateUUID(),
      coachId: currentUser?.id,
      title: `Preview: ${material.title}`,
      description: 'Náhled materiálu v klientském rozhraní',
      duration: 1,
      shareCode: 'PREVIEW',
      isActive: true,
      days: [
        {
          dayNumber: 1,
          title: material.title,
          description: material.description || '',
          materialIds: [material.id],
          instruction: ''
        }
      ],
      createdAt: new Date().toISOString()
    };

    // Vytvoř admin preview session
    const adminClient = {
      id: generateUUID(),
      name: 'Preview (Koučka)',
      programCode: 'PREVIEW',
      programId: tempProgram.id,
      startedAt: new Date().toISOString(),
      currentDay: 1,
      streak: 0,
      longestStreak: 0,
      moodLog: [],
      completedDays: [],
      completedAt: null,
      certificateGenerated: false,
      isAdmin: true,
      _previewProgram: tempProgram // Uložíme dočasný program pro DailyView
    };

    // Ulož do session storage
    setCurrentClient(adminClient);

    // Přesměruj na klientskou zónu
    navigate('/client/daily');
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
            p: { xs: 1.5, sm: 2, md: 3 },
            '&:last-child': { pb: { xs: 1.5, sm: 2, md: 3 } }
          }}
        >
          {/* Horní řádek: Kategorie chip + Ikona/Logo (proklikávací) */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={isVeryNarrow ? 0.75 : 1}>
            <Chip
              label={getCategoryLabel(material.category)}
              size="small"
              sx={{
                height: isVeryNarrow ? 16 : 18,
                fontSize: isVeryNarrow ? '0.6rem' : '0.65rem',
                fontWeight: 400,
                backgroundColor: 'transparent',
                border: '1px solid',
                borderColor: isDark ? 'rgba(139, 188, 143, 0.3)' : 'rgba(139, 188, 143, 0.4)',
                color: isDark ? 'rgba(139, 188, 143, 0.9)' : 'primary.main',
                '& .MuiChip-label': {
                  px: isVeryNarrow ? 0.5 : 0.75,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }
              }}
            />

            {/* Ikona/Logo v pravém rohu - PROKLIKÁVACÍ (otevře přímo) */}
            <QuickTooltip title={
              material.type === 'link' && material.linkMeta?.label
                ? `Otevřít na ${material.linkMeta.label}`
                : material.type === 'audio'
                ? 'Otevřít audio soubor'
                : material.type === 'video'
                ? 'Otevřít video'
                : material.type === 'pdf'
                ? 'Otevřít PDF'
                : material.type === 'image'
                ? 'Otevřít obrázek'
                : material.type === 'document'
                ? 'Otevřít dokument'
                : 'Otevřít textový dokument'
            }>
              <IconButton
                size="small"
                component="a"
                href={material.content}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  p: 0,
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(139, 188, 143, 0.1)' : 'rgba(139, 188, 143, 0.08)',
                  }
                }}
              >
                {renderIcon()}
              </IconButton>
            </QuickTooltip>
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
                {/* Řádek 1: URL nebo fileName (vždy přítomen, i když prázdný) */}
                <Box
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                  sx={{
                    minWidth: 0,
                    overflow: 'hidden',
                    minHeight: '1.2em',
                  }}
                >
                  {(material.type === 'link' && material.content) ? (
                    <>
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
                    </>
                  ) : material.fileName ? (
                    <>
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
                    </>
                  ) : (
                    <Typography variant="caption" sx={{ visibility: 'hidden', fontSize: '0.7rem' }}>
                      &nbsp;
                    </Typography>
                  )}
                </Box>

                {/* Řádek 2: Velikost souboru (vždy přítomen, i když prázdný) */}
                <Box
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                  sx={{ minHeight: '1.2em' }}
                >
                  {material.fileSize ? (
                    <>
                      <HardDrive
                        size={isVeryNarrow ? 11 : 12}
                        style={{ flexShrink: 0 }}
                        color={theme.palette.text.secondary}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.7rem',
                        }}
                      >
                        {formatFileSize(material.fileSize)}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="caption" sx={{ visibility: 'hidden', fontSize: '0.7rem' }}>
                      &nbsp;
                    </Typography>
                  )}
                </Box>

                {/* Řádek 3: Duration nebo počet stran (vždy přítomen, i když prázdný) */}
                <Box
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                  sx={{ minHeight: '1.2em' }}
                >
                  {material.duration ? (
                    <>
                      <Clock
                        size={isVeryNarrow ? 11 : 12}
                        style={{ flexShrink: 0 }}
                        color={theme.palette.text.secondary}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.7rem',
                        }}
                      >
                        {formatDuration(material.duration)}
                      </Typography>
                    </>
                  ) : material.pageCount ? (
                    <>
                      <FileText
                        size={isVeryNarrow ? 11 : 12}
                        style={{ flexShrink: 0 }}
                        color={theme.palette.text.secondary}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.7rem',
                        }}
                      >
                        {material.pageCount} {material.pageCount === 1 ? 'strana' : material.pageCount < 5 ? 'strany' : 'stran'}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="caption" sx={{ visibility: 'hidden', fontSize: '0.7rem' }}>
                      &nbsp;
                    </Typography>
                  )}
                </Box>

                {/* 4. Název materiálu */}
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: isVeryNarrow ? '0.95rem' : { xs: '0.95rem', sm: '1rem' },
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
                    mt: 0.5,
                  }}
                >
                  {material.title}
                </Typography>

                {/* 5. Popis */}
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: isVeryNarrow ? '0.75rem' : { xs: '0.8rem', sm: '0.825rem' },
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-word',
                    hyphens: 'auto',
                    minWidth: 0,
                    minHeight: '4.2em', // 3 řádky × 1.4 lineHeight
                  }}
                >
                  {material.description || '\u00A0'}
                </Typography>

                {/* Tlačítko "Jak to vidí klientka" */}
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<User size={16} />}
                  onClick={handleClientPreview}
                  sx={{
                    mt: 1.5,
                    py: 0.5,
                    px: 1.5,
                    fontSize: '0.75rem',
                    borderRadius: BORDER_RADIUS.small,
                    borderColor: isDark
                      ? 'rgba(139, 188, 143, 0.3)'
                      : 'rgba(139, 188, 143, 0.4)',
                    color: isDark
                      ? 'rgba(139, 188, 143, 0.9)'
                      : 'primary.main',
                    backgroundColor: 'transparent',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: isDark
                        ? 'rgba(139, 188, 143, 0.08)'
                        : 'rgba(139, 188, 143, 0.08)',
                    },
                  }}
                >
                  Jak to vidí klientka
                </Button>
            </Box>

            {/* Pravý sloupec: Akční ikony */}
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-end"
              gap={isVeryNarrow ? 0.5 : 1}
              sx={{
                flexShrink: 0,
                height: '100%',
                justifyContent: 'flex-start'
              }}
            >
              {/* Otevřít v novém okně - PRO VŠECHNY materiály */}
              <QuickTooltip title="Otevřít v novém okně nebo kartě">
                <IconButton
                  size="small"
                  component="a"
                  href={material.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    ...createIconButton('secondary', isDark, 'small'),
                    minWidth: 44,
                    minHeight: 44
                  }}
                >
                  <ExternalLink size={isVeryNarrow ? 20 : 18} />
                </IconButton>
              </QuickTooltip>

              {/* Náhled */}
              <QuickTooltip title="Otevřít v náhledu">
                <IconButton
                  size="small"
                  onClick={() => setPreviewOpen(true)}
                  sx={{
                    ...createIconButton('secondary', isDark, 'small'),
                    minWidth: 44,
                    minHeight: 44
                  }}
                >
                  <Eye size={isVeryNarrow ? 20 : 18} />
                </IconButton>
              </QuickTooltip>

              {/* Sdílet s klientkou */}
              <QuickTooltip title="Sdílet s klientkou">
                <IconButton
                  size="small"
                  onClick={() => {/* TODO: Implementovat sdílení */}}
                  sx={{
                    ...createIconButton('secondary', isDark, 'small'),
                    minWidth: 44,
                    minHeight: 44
                  }}
                >
                  <Share2 size={isVeryNarrow ? 20 : 18} />
                </IconButton>
              </QuickTooltip>

              {/* Editace */}
              <QuickTooltip title="Upravit materiál">
                <IconButton
                  size="small"
                  onClick={() => setEditOpen(true)}
                  sx={{
                    ...createIconButton('secondary', isDark, 'small'),
                    minWidth: 44,
                    minHeight: 44
                  }}
                >
                  <Pencil size={isVeryNarrow ? 20 : 18} />
                </IconButton>
              </QuickTooltip>

              {/* Smazat - separované dole */}
              <QuickTooltip title="Smazat materiál">
                <IconButton
                  size="small"
                  onClick={handleDeleteClick}
                  sx={{
                    ...createIconButton('error', isDark, 'small'),
                    mt: 'auto',
                    pt: 2,
                    minWidth: 44,
                    minHeight: 44
                  }}
                >
                  <Trash2 size={isVeryNarrow ? 20 : 18} />
                </IconButton>
              </QuickTooltip>
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