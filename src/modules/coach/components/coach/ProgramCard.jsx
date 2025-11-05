import React, { useState } from 'react';
import {
  Typography,
  Box,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Calendar, Link2 } from 'lucide-react';
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

  // Row 2: Dostupnost s Calendar ikonou
  const availabilityChip = (() => {
    let label;
    if (program.availabilityStartDate && program.availabilityEndDate) {
      const start = formatDate(program.availabilityStartDate, { month: 'numeric', year: 'numeric' });
      const end = formatDate(program.availabilityEndDate, { month: 'numeric', year: 'numeric' });
      label = `${start} - ${end}`;
    } else if (program.availabilityStartDate && !program.availabilityEndDate) {
      const start = formatDate(program.availabilityStartDate, { month: 'numeric', year: 'numeric' });
      label = `${start} - Neomezeně`;
    } else if (!program.availabilityStartDate && program.availabilityEndDate) {
      const end = formatDate(program.availabilityEndDate, { month: 'numeric', year: 'numeric' });
      label = `Ihned - ${end}`;
    } else {
      label = 'Ihned - Neomezeně';
    }

    return {
      label,
      icon: <Calendar size={14} />,
      color: 'secondary',
    };
  })();

  // Row 3: Metadata (bez dostupnosti, prázdný řádek pokud nejsou data)
  const metadataItems = [
    {
      label: pluralize(program.duration, 'den', 'dny', 'dní'),
    },
    {
      label: pluralize(totalMaterials, 'materiál', 'materiály', 'materiálů'),
    },
    ...(activeClients > 0 ? [{
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

  // Row 4: External link s Link2 ikonou nebo prázdno
  const linkOrFile = program.externalLink ? (
    <Box display="flex" alignItems="center" gap={0.5} sx={{ minWidth: 0, maxWidth: '100%' }}>
      <Link2 size={isVeryNarrow ? 11 : 12} color={theme.palette.text.secondary} style={{ flexShrink: 0 }} />
      <Typography
        component="a"
        href={program.externalLink}
        target="_blank"
        rel="noopener noreferrer"
        variant="caption"
        sx={{
          color: 'text.secondary',
          fontSize: isVeryNarrow ? '0.65rem' : '0.7rem',
          minWidth: 0,
          ...createTextEllipsis(1),
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
            color: 'primary.main',
          },
        }}
      >
        {program.externalLinkLabel || program.externalLink}
      </Typography>
    </Box>
  ) : null;

  // Row 7: Material type chips
  const materialTypes = (() => {
    const allMaterialIds = program.days.flatMap(day => day.materialIds || []);
    const types = allMaterialIds
      .map(id => materials.find(m => m.id === id)?.type)
      .filter(Boolean);
    return [...new Set(types)]; // Unique types
  })();

  const materialTypeLabels = {
    audio: 'Audio',
    video: 'Video',
    pdf: 'PDF',
    image: 'Obrázek',
    document: 'Dokument',
    text: 'Text',
    link: 'Odkaz',
  };

  const materialTypeChips = materialTypes.length > 0 ? (
    <>
      {materialTypes.map((type, index) => (
        <Chip
          key={index}
          label={materialTypeLabels[type] || type}
          size="small"
          sx={{
            height: isVeryNarrow ? 14 : 16,
            fontSize: isVeryNarrow ? '0.55rem' : '0.6rem',
            fontWeight: 500,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
            color: 'text.secondary',
            border: 'none',
          }}
        />
      ))}
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

        // Row 2: Dostupnost chip s Calendar ikonou
        chips={[availabilityChip]}

        // Row 3: Metadata
        metadata={metadataItems}

        // Row 4: Link/File
        linkOrFile={linkOrFile}

        // Row 5: Title
        title={program.title}

        // Row 6: Description
        description={program.description}

        // Row 7: Material type chips
        taxonomyOrAvailability={materialTypeChips}

        // Row 8-9: Footer (button "Jak to vidí klientka" + feedback)
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
