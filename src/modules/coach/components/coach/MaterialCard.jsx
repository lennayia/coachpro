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
import { deleteMaterial, getCurrentUser, getPrograms, setCurrentClient, createSharedMaterial } from '../../utils/storage';
import { generateUUID } from '../../utils/generateCode';
import ServiceLogo from '../shared/ServiceLogo';
import PreviewModal from '../shared/PreviewModal';
import AddMaterialModal from './AddMaterialModal';
import ShareMaterialModal from './ShareMaterialModal';
import BORDER_RADIUS from '@styles/borderRadius';
import { createBackdrop, createGlassDialog, createIconButton, createClientPreviewButton } from '../../../../shared/styles/modernEffects';
import { createTextEllipsis } from '../../../../shared/styles/responsive';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import { QuickTooltip } from '@shared/components/AppTooltip';
import { useNotification } from '@shared/context/NotificationContext';
import { isTouchDevice, createSwipeHandlers, createLongPressHandler } from '@shared/utils/touchHandlers';

const MaterialCard = ({
  material,
  onUpdate
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const glassCardStyles = useGlassCard('subtle');
  const { showSuccess, showError } = useNotification();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sharedMaterialData, setSharedMaterialData] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const isVeryNarrow = useMediaQuery('(max-width:420px)');
  const isTouch = isTouchDevice();

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteMaterial(material.id);
      showSuccess('Smazáno!', `Materiál "${material.title}" byl úspěšně smazán`);
      onUpdate();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete material:', error);
      showError('Chyba', 'Nepodařilo se smazat materiál. Zkus to prosím znovu.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Sdílení materiálu s klientkou
  const handleShareMaterial = async () => {
    setIsSharing(true);
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        console.error('No current user found');
        showError('Chyba', 'Nejsi přihlášená. Zkus se znovu přihlásit.');
        setIsSharing(false);
        return;
      }

      // Vytvoř sdílený materiál s QR kódem a share code
      const shared = await createSharedMaterial(material, currentUser.id);
      setSharedMaterialData(shared);
      setShareModalOpen(true);
      showSuccess('Připraveno!', `Materiál "${material.title}" je připraven ke sdílení 🎉`);
    } catch (error) {
      console.error('Failed to create shared material:', error);
      showError('Chyba', 'Nepodařilo se připravit materiál ke sdílení. Zkus to prosím znovu.');
    } finally {
      setIsSharing(false);
    }
  };

  // Touch gestures - Swipe handlers
  const swipeHandlers = createSwipeHandlers({
    onSwipeLeft: () => {
      // Swipe left = smazat (destructive action)
      if (isTouch) {
        handleDeleteClick();
      }
    },
    onSwipeRight: () => {
      // Swipe right = sdílet (positive action)
      if (isTouch) {
        handleShareMaterial();
      }
    },
    threshold: 80, // Větší threshold pro prevenci nechtěného triggeru
  });

  // Touch gestures - Long press handler
  const longPressHandlers = createLongPressHandler({
    onLongPress: () => {
      // Long press = preview (explorační akce)
      if (isTouch) {
        setPreviewOpen(true);
      }
    },
    delay: 600, // 600ms pro long press
  });

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
      _previewProgram: tempProgram, // Uložíme dočasný program pro DailyView
      _returnUrl: window.location.pathname // Uložíme odkud přišla
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
        {...swipeHandlers}
        {...longPressHandlers}
        sx={{
          ...glassCardStyles,
          height: '100%',
          minHeight: 280,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: BORDER_RADIUS.card,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          // Hover efekt jen pro non-touch zařízení
          '&:hover': isTouch ? {} : {
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
            p: 3,
            pr: 2.5,
            minWidth: 0,
            overflow: 'hidden',
            '&:last-child': { pb: 3 }
          }}
        >
          {/* Řádek 1: Velká ikona vlevo + Akční ikony vpravo */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
            {/* Velká ikona/logo VLEVO - PROKLIKÁVACÍ */}
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

            {/* Akční ikony VPRAVO */}
            <Box display="flex" alignItems="center" gap={isVeryNarrow ? 0.5 : 0.75}>
              <QuickTooltip title="Zobrazit detail">
                <IconButton
                  onClick={() => setPreviewOpen(true)}
                  sx={createIconButton('secondary', isDark, 'small')}
                >
                  <Eye size={isVeryNarrow ? 16 : 18} />
                </IconButton>
              </QuickTooltip>

              <QuickTooltip title="Upravit materiál">
                <IconButton
                  onClick={() => setEditOpen(true)}
                  sx={createIconButton('secondary', isDark, 'small')}
                >
                  <Pencil size={isVeryNarrow ? 16 : 18} />
                </IconButton>
              </QuickTooltip>

              <QuickTooltip title="Sdílet s klientkou">
                <IconButton
                  onClick={handleShareMaterial}
                  disabled={isSharing}
                  sx={createIconButton('secondary', isDark, 'small')}
                >
                  <Share2 size={isVeryNarrow ? 16 : 18} />
                </IconButton>
              </QuickTooltip>

              <QuickTooltip title="Smazat materiál">
                <IconButton
                  onClick={handleDeleteClick}
                  sx={createIconButton('error', isDark, 'small')}
                >
                  <Trash2 size={isVeryNarrow ? 16 : 18} />
                </IconButton>
              </QuickTooltip>
            </Box>
          </Box>

          {/* Řádek 2: Chip kategorie */}
          <Box mb={1}>
            <Chip
              label={getCategoryLabel(material.category)}
              size="small"
              sx={{
                height: isVeryNarrow ? 14 : 16,
                fontSize: isVeryNarrow ? '0.55rem' : '0.6rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                backgroundColor: isDark
                  ? 'rgba(139, 188, 143, 0.15)'
                  : 'rgba(139, 188, 143, 0.12)',
                border: 'none',
                color: isDark ? 'rgba(139, 188, 143, 0.95)' : 'rgba(85, 107, 47, 0.95)',
                '& .MuiChip-label': {
                  px: isVeryNarrow ? 0.5 : 0.75,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }
              }}
            />
          </Box>

          {/* Řádek 3: Metadata vedle sebe */}
          <Box display="flex" alignItems="center" gap={1.5} mb={1} flexWrap="wrap">
            {/* Duration nebo počet stran */}
            {(material.duration || material.pageCount) && (
              <Box display="flex" alignItems="center" gap={0.5}>
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
                ) : (
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
                )}
              </Box>
            )}

            {/* Velikost souboru */}
            {material.fileSize && (
              <Box display="flex" alignItems="center" gap={0.5}>
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
              </Box>
            )}
          </Box>

          {/* Řádek 4: URL nebo název souboru */}
          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            mb={1}
            sx={{
              minHeight: '1.2em',
              minWidth: 0,
              maxWidth: '100%',
              width: '100%',
              overflow: 'hidden'
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
                    flex: 1,
                    ...createTextEllipsis(1),
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
                    flex: 1,
                    ...createTextEllipsis(1),
                  }}
                >
                  {material.fileName}
                </Typography>
              </>
            ) : null}
          </Box>

          {/* Řádek 5: Název materiálu */}
          <Typography
            variant="h6"
            sx={{
              fontSize: isVeryNarrow ? '0.95rem' : { xs: '0.95rem', sm: '1rem' },
              fontWeight: 600,
              color: 'text.primary',
              lineHeight: 1.3,
              minHeight: '2.6em',
              mt: 0.5,
              mb: 1,
              ...createTextEllipsis(2),
            }}
          >
            {material.title}
          </Typography>

          {/* Řádek 6: Popis */}
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: isVeryNarrow ? '0.75rem' : { xs: '0.8rem', sm: '0.825rem' },
              lineHeight: 1.4,
              minHeight: '4.2em',
              mb: 1,
              ...createTextEllipsis(3),
            }}
          >
            {material.description || '\u00A0'}
          </Typography>

          {/* Řádek 7: Taxonomy chips - TODO: implementovat až bude taxonomy systém */}

          {/* Řádek 8: Tlačítko "Jak to vidí klientka" */}
          <Button
            variant="contained"
            size="small"
            startIcon={<User size={14} />}
            onClick={handleClientPreview}
            sx={{
              mt: 1.5,
              ...createClientPreviewButton(isDark)
            }}
          >
            Jak to vidí klientka
          </Button>

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

      {/* Share Material Modal */}
      <ShareMaterialModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        sharedMaterial={sharedMaterialData}
      />
    </>
  );
};

export default MaterialCard;