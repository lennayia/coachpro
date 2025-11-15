import React, { useState, useEffect } from 'react';
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
  User,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDuration, formatFileSize, getCategoryLabel, formatDate } from '@shared/utils/helpers';
import { deleteMaterial, getCurrentUser, getPrograms, setCurrentClient, createSharedMaterial, getSharedMaterials, validateClientExists } from '../../utils/storage';
import { getAreaLabel, getAreaIcon, getStyleLabel, getAuthorityLabel } from '@shared/constants/coachingTaxonomy';
import { supabase } from '@shared/config/supabase';
import { generateUUID } from '../../utils/generateCode';
import ServiceLogo from '../shared/ServiceLogo';
import PreviewModal from '../shared/PreviewModal';
import AddMaterialModal from './AddMaterialModal';
import ClientFeedbackModal from './ClientFeedbackModal';
import BORDER_RADIUS from '@styles/borderRadius';
import { createBackdrop, createGlassDialog, createIconButton, createClientPreviewButton } from '../../../../shared/styles/modernEffects';
import { createTextEllipsis } from '../../../../shared/styles/responsive';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import { QuickTooltip } from '@shared/components/AppTooltip';
import { useNotification } from '@shared/context/NotificationContext';
import { isTouchDevice, createSwipeHandlers, createLongPressHandler } from '@shared/utils/touchHandlers';
import BaseCard from '@shared/components/cards/BaseCard';
import PublicShareCode from '@shared/components/sharing/PublicShareCode';
import ShareWithClientModal from '@shared/components/sharing/ShareWithClientModal';

const MaterialCard = ({
  material,
  onUpdate,
  onDuplicate
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
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
  const handleShareMaterial = () => {
    setShareModalOpen(true);
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

  // Metadata podle typu - POŘADÍ: fileSize → duration → pageCount
  const renderMetadata = () => {
    const metadata = [];
    const iconSize = isVeryNarrow ? 12 : 14;

    // File size (všechny file-based typy) - PRVNÍ
    if (material.fileSize) {
      metadata.push({
        icon: <HardDrive size={iconSize} />,
        label: formatFileSize(material.fileSize)
      });
    }

    // Duration (audio/video) - DRUHÝ
    if (material.duration) {
      metadata.push({
        icon: <Clock size={iconSize} />,
        label: formatDuration(material.duration)
      });
    }

    // Page count (PDF, text) - TŘETÍ
    if (material.pageCount) {
      metadata.push({
        icon: <FileText size={iconSize} />,
        label: `${material.pageCount} ${material.pageCount === 1 ? 'strana' : material.pageCount < 5 ? 'strany' : 'stran'}`
      });
    }

    return metadata;
  };

  const metadata = renderMetadata();

  // Generate share text for public code sharing
  const getShareText = () => {
    const typeLabel = {
      audio: '🎵 Audio',
      video: '🎬 Video',
      pdf: '📄 PDF',
      document: '📎 Dokument',
      image: '🖼️ Obrázek',
      text: '📝 Text',
      link: '🔗 Odkaz',
    }[material.type] || material.type;

    return `🌿 CoachPro - ${material.title}

${material.description || ''}

📚 Typ: ${typeLabel}
🏷️ ${getCategoryLabel(material.category)}

🔑 Pro přístup k materiálu zadej tento kód v aplikaci CoachPro:
${material.publicShareCode}

Těším se na tvůj růst! 💚`;
  };

  // BaseCard props
  const largeIcon = (
    <IconButton
      size="small"
      component="a"
      href={material.content}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        p: 0,
        ml: -0.5,
        '&:hover': {
          backgroundColor: isDark ? 'rgba(139, 188, 143, 0.1)' : 'rgba(139, 188, 143, 0.08)',
        }
      }}
    >
      {renderIcon()}
    </IconButton>
  );

  // Public share code footer (pod reflexemi, zarovnané vlevo)
  const publicCodeFooter = material.publicShareCode ? (
    <PublicShareCode
      code={material.publicShareCode}
      shareText={getShareText()}
      shareTitle={`CoachPro - ${material.title}`}
    />
  ) : null;

  const chipConfig = {
    label: getCategoryLabel(material.category),
    color: 'primary',
  };

  const linkOrFile = (material.type === 'link' && material.content) ? (
    <Box display="flex" alignItems="center" gap={0.5} sx={{ minWidth: 0, maxWidth: '100%' }}>
      <Link2 size={isVeryNarrow ? 11 : 12} color={theme.palette.text.secondary} style={{ flexShrink: 0 }} />
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          fontSize: isVeryNarrow ? '0.65rem' : '0.7rem',
          minWidth: 0,
          ...createTextEllipsis(1),
        }}
      >
        {material.content}
      </Typography>
    </Box>
  ) : material.fileName ? (
    <Box display="flex" alignItems="center" gap={0.5} sx={{ minWidth: 0, maxWidth: '100%' }}>
      <Paperclip size={isVeryNarrow ? 11 : 12} color={theme.palette.text.secondary} style={{ flexShrink: 0 }} />
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          fontSize: isVeryNarrow ? '0.65rem' : '0.7rem',
          minWidth: 0,
          ...createTextEllipsis(1),
        }}
      >
        {material.fileName}
      </Typography>
    </Box>
  ) : null;

  return (
    <>
      <BaseCard
        largeIcon={largeIcon}
        onPreview={() => setPreviewOpen(true)}
        onEdit={() => setEditOpen(true)}
        onDuplicate={() => onDuplicate && onDuplicate(material)}
        onShare={handleShareMaterial}
        onDelete={handleDeleteClick}
        chips={[chipConfig]}
        creationDate={material.createdAt ? formatDate(material.createdAt, { month: 'numeric' }) : null}
        metadata={metadata}
        linkOrFile={linkOrFile}
        title={material.title}
        description={material.description}
        taxonomyData={{
          coachingArea: material.coachingArea,
          topics: material.topics,
          coachingStyle: material.coachingStyle,
          coachingAuthority: material.coachingAuthority
        }}
        onClientPreview={handleClientPreview}
        feedbackData={material.clientFeedback}
        onFeedbackClick={() => setFeedbackModalOpen(true)}
        footer={publicCodeFooter}
        swipeHandlers={swipeHandlers}
        longPressHandlers={longPressHandlers}
        minHeight={280}
        glassEffect="subtle"
      />

      {/* Modals */}

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
      <ShareWithClientModal
        open={shareModalOpen}
        onClose={() => {
          setShareModalOpen(false);
          onUpdate(); // Refresh materials after modal closes
        }}
        content={material}
        contentType="material"
        onShare={async (data) => {
          const currentUser = getCurrentUser();
          if (!currentUser) {
            throw new Error('Není přihlášený žádný kouč');
          }

          const sharedMaterial = await createSharedMaterial(
            material,
            currentUser.id,
            data.accessStartDate,
            data.accessEndDate,
            data.clientEmail
          );

          // Don't refresh here - it will be refreshed when modal closes
          // onUpdate();

          return sharedMaterial;
        }}
        getShareText={(shared) => {
          const typeLabel = {
            audio: '🎵 Audio',
            video: '🎬 Video',
            pdf: '📄 PDF',
            document: '📎 Dokument',
            image: '🖼️ Obrázek',
            text: '📝 Text',
            link: '🔗 Odkaz',
          }[material.type] || material.type;

          return `🌿 CoachPro - ${material.title}

${material.description || ''}

📚 Typ: ${typeLabel}
🏷️ ${getCategoryLabel(material.category)}

🔑 Pro přístup k materiálu zadej tento kód v aplikaci CoachPro:
${shared.shareCode}

Těším se na tvůj růst! 💚`;
        }}
        getContentInfo={(mat) => ({
          title: mat.title,
          subtitle: getCategoryLabel(mat.category)
        })}
        checkDuplicate={async (email, mat) => {
          const currentUser = getCurrentUser();
          if (!currentUser) return null;

          const allSharedMaterials = await getSharedMaterials(currentUser.id);
          return allSharedMaterials.find(
            sm => sm.materialId === mat.id &&
                  sm.clientEmail &&
                  sm.clientEmail.toLowerCase() === email.toLowerCase()
          );
        }}
        validateClient={validateClientExists}
      />

      {/* Client Feedback Modal */}
      <ClientFeedbackModal
        open={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        material={material}
      />
    </>
  );
};

export default MaterialCard;