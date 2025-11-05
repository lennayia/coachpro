import React, { useMemo, useState } from 'react';
import {
  Typography,
  Box,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
} from '@mui/icons-material';
import { formatDate, pluralize } from '@shared/utils/helpers';
import BORDER_RADIUS from '@styles/borderRadius';
import { createTextEllipsis } from '@shared/styles/responsive';
import { isTouchDevice, createSwipeHandlers, createLongPressHandler } from '@shared/utils/touchHandlers';
import BaseCard from '@shared/components/cards/BaseCard';
import ProgramFeedbackModal from './ProgramFeedbackModal';

const ProgramCard = ({
  program,
  clients = [],
  materials = [], // Přidán prop pro materiály
  onPreview,
  onShare,
  onEdit,
  onDuplicate,
  onDelete,
  onMenuOpen
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isVeryNarrow = useMediaQuery('(max-width:420px)');
  const isTouch = isTouchDevice();
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const activeClients = clients.filter(c => !c.completedAt).length;
  const totalMaterials = program.days.reduce((acc, day) => acc + (day.materialIds?.length || 0), 0);

  // Získání unikátních typů materiálů v programu
  const materialTypes = useMemo(() => {
    const materialIds = program.days.flatMap(day => day.materialIds || []);
    const programMaterials = materials.filter(m => materialIds.includes(m.id));

    // Získat unikátní typy
    const types = [...new Set(programMaterials.map(m => m.type))];
    return types;
  }, [program.days, materials]);

  // Touch gestures - Swipe handlers
  const swipeHandlers = createSwipeHandlers({
    onSwipeLeft: () => {
      if (isTouch) {
        onEdit(program);
      }
    },
    onSwipeRight: () => {
      if (isTouch) {
        onShare(program);
      }
    },
    threshold: 80,
  });

  // Touch gestures - Long press handler
  const longPressHandlers = createLongPressHandler({
    onLongPress: () => {
      if (isTouch) {
        onPreview(program);
      }
    },
    delay: 600,
  });

  // Chip configuration for BaseCard (row 2)
  const chipConfig = {
    label: program.isActive ? 'Aktivní' : 'Neaktivní',
    icon: program.isActive ? <ActiveIcon /> : <InactiveIcon />,
    color: 'primary',
    active: program.isActive,
  };

  // Metadata configuration for BaseCard (row 4)
  const metadataItems = [
    {
      label: pluralize(program.duration, 'den', 'dny', 'dní'),
    },
    {
      label: pluralize(totalMaterials, 'materiál', 'materiály', 'materiálů'),
    },
    ...(clients.length > 0 ? [{
      label: pluralize(activeClients, 'aktivní klientka', 'aktivní klientky', 'aktivních klientek'),
    }] : []),
  ];

  // Large icon - Kód programu (row 1, left side)
  const largeIcon = (
    <Box
      sx={{
        backgroundColor: isDark
          ? 'rgba(139, 188, 143, 0.15)'
          : 'rgba(139, 188, 143, 0.1)',
        borderRadius: BORDER_RADIUS.small,
        px: 1.5,
        py: 0.75,
        textAlign: 'center',
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          display: 'block',
          fontSize: '0.65rem',
          mb: 0.25,
        }}
      >
        Kód
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 700,
          letterSpacing: 1.5,
          fontSize: isVeryNarrow ? '0.75rem' : '0.85rem',
          color: isDark
            ? 'rgba(139, 188, 143, 0.95)'
            : 'rgba(85, 107, 47, 0.95)',
        }}
      >
        {program.shareCode}
      </Typography>
    </Box>
  );

  // Link/File section - Seznam materiálů (row 5)
  const linkOrFile = totalMaterials > 0 ? (
    <Typography
      variant="caption"
      sx={{
        color: 'text.secondary',
        fontSize: '0.7rem',
      }}
    >
      {pluralize(totalMaterials, 'materiál', 'materiály', 'materiálů')} • {pluralize(program.duration, 'den', 'dny', 'dní')}
    </Typography>
  ) : null;

  // Material type chips (row 7.5)
  const materialTypeChips = materialTypes.length > 0 ? (
    <>
      {materialTypes.map((type) => {
        const typeLabels = {
          audio: 'Audio',
          video: 'Video',
          pdf: 'PDF',
          image: 'Obrázek',
          document: 'Dokument',
          text: 'Text',
          link: 'Odkaz',
        };

        return (
          <Chip
            key={type}
            label={typeLabels[type] || type}
            size="small"
            sx={{
              height: isVeryNarrow ? 14 : 16,
              fontSize: isVeryNarrow ? '0.55rem' : '0.6rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.06)',
              color: 'text.secondary',
              border: 'none',
              '& .MuiChip-label': {
                px: isVeryNarrow ? 0.5 : 0.75,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              },
            }}
          />
        );
      })}
    </>
  ) : null;

  return (
    <>
      <BaseCard
        // Row 1: Large icon (left) + action icons (right)
        largeIcon={largeIcon}
        onPreview={() => onPreview(program)}
        onDuplicate={onDuplicate}
        onShare={() => onShare(program)}
        onEdit={() => onEdit(program)}
        onDelete={() => onDelete(program)}

        // Row 2: Chips
        chips={[chipConfig]}

        // Row 3: Dates (programs don't have access dates yet)
        creationDate={program.createdAt ? formatDate(program.createdAt, { day: 'numeric', month: 'numeric', year: 'numeric' }) : null}
        accessFromDate={null}
        accessToDate={null}

        // Row 4: Metadata
        metadata={metadataItems}

        // Row 5: Link/File
        linkOrFile={linkOrFile}

        // Row 6: Title
        title={program.title}

        // Row 7: Description
        description={program.description}

        // Row 7.5: Material type chips
        materialTypeChips={materialTypeChips}

        // Row 8: Taxonomy (programs don't have taxonomy yet)
        taxonomyOrAvailability={null}

        // Row 9: Footer (button "Jak to vidí klientka" + feedback button)
        onClientPreview={() => onPreview(program)}
        feedbackData={program.programFeedback}
        onFeedbackClick={() => setFeedbackModalOpen(true)}

        // Other props
        swipeHandlers={swipeHandlers}
        longPressHandlers={longPressHandlers}
        minHeight={280}
        glassEffect="subtle"
      />

      {/* Program Feedback Modal */}
      <ProgramFeedbackModal
        open={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        program={program}
      />
    </>
  );
};

export default ProgramCard;
