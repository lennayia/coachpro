import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Eye, Copy, Edit, Share2, Trash2, User, MessageSquare } from 'lucide-react';
import BORDER_RADIUS from '@styles/borderRadius';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import { createTextEllipsis } from '@shared/styles/responsive';
import { createIconButton, createClientPreviewButton } from '@shared/styles/modernEffects';
import { isTouchDevice } from '@shared/utils/touchHandlers';
import { QuickTooltip } from '@shared/components/AppTooltip';

/**
 * BaseCard - Sdílená základní komponenta pro všechny karty v aplikaci
 *
 * 9-řádkový layout:
 * 1. Velká ikona vlevo + akční ikony vpravo
 * 2. Chipy (aktivní/meditace...)
 * 3. Datum vytvoření + přístupnost od/do (VŽDY přítomen i když prázdný!)
 * 4. Metadata (specifické podle typu karty)
 * 5. Odkaz/soubor nebo seznam materiálů
 * 6. Nadpis (2 řádky)
 * 7. Popis (3 řádky)
 * 8. Taxonomy chipy nebo dostupnost
 * 9. Footer (button + custom content)
 *
 * Používá:
 * - MaterialCard pro zobrazení materiálů
 * - ProgramCard pro zobrazení programů
 * - ClientCard pro zobrazení klientek (budoucí)
 */
const BaseCard = ({
  // Řádek 1: Velká ikona (levá strana) + Action ikony (pravá strana)
  largeIcon, // ReactNode - velká ikona/logo/kód programu

  // Standard action handlers (generují ikony automaticky)
  onPreview, // Handler pro náhled (Eye ikona)
  onDuplicate, // Handler pro duplikaci (Copy ikona) - VŽDY zobrazená
  onShare, // Handler pro sdílení (Share2 ikona)
  onEdit, // Handler pro editaci (Edit ikona)
  onDelete, // Handler pro smazání (Trash2 ikona)

  // Řádek 2: Chipy (množné číslo)
  chips, // Array of { label, icon, color, active }

  // Řádek 3: Data (VŽDY přítomen i když prázdný!)
  creationDate, // string nebo null
  accessFromDate, // string nebo null
  accessToDate, // string nebo null

  // Řádek 4: Metadata
  metadata, // Array of { icon, label }

  // Řádek 5: Odkaz/soubor/materiály
  linkOrFile, // ReactNode nebo string

  // Řádek 6: Nadpis (2 řádky)
  title,

  // Řádek 7: Popis (3 řádky)
  description,

  // Řádek 7.5: Material type chips (např. audio, text, pdf)
  materialTypeChips, // ReactNode - chipy typů materiálů v programu

  // Řádek 8: Taxonomy nebo dostupnost
  taxonomyOrAvailability, // ReactNode (chipy taxonomy nebo dostupnost)

  // Řádek 9: Footer (button "Jak to vidí klientka" + feedback button + custom content)
  onClientPreview, // Handler pro tlačítko "Jak to vidí klientka" (zobrazí button pokud je předán)
  feedbackData, // Array - pole feedbacků (zobrazí feedback button pokud existuje)
  onFeedbackClick, // Handler pro klik na feedback button
  footer, // ReactNode - custom footer content (např. reflexe)

  // Styling
  minHeight = 280,
  glassEffect = 'subtle', // 'subtle' | 'normal' | 'strong'

  // Touch handlers
  swipeHandlers = {},
  longPressHandlers = {},

  // Other
  onClick,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const glassCardStyles = useGlassCard(glassEffect);
  const isVeryNarrow = useMediaQuery('(max-width:420px)');
  const isTouch = isTouchDevice();

  // Generování action ikon z handlerů
  const actionIcons = [
    // 1. Preview (volitelné)
    onPreview && (
      <QuickTooltip key="preview" title="Náhled">
        <IconButton
          onClick={onPreview}
          sx={createIconButton('secondary', isDark, 'small')}
        >
          <Eye size={isVeryNarrow ? 16 : 18} />
        </IconButton>
      </QuickTooltip>
    ),
    // 2. Upravit (volitelné) - HNED ZA OČIČKO
    onEdit && (
      <QuickTooltip key="edit" title="Upravit">
        <IconButton
          onClick={onEdit}
          sx={createIconButton('secondary', isDark, 'small')}
        >
          <Edit size={isVeryNarrow ? 16 : 18} />
        </IconButton>
      </QuickTooltip>
    ),
    // 3. Duplikovat (VŽDY zobrazená)
    <QuickTooltip key="duplicate" title="Duplikovat">
      <IconButton
        onClick={onDuplicate}
        sx={createIconButton('secondary', isDark, 'small')}
      >
        <Copy size={isVeryNarrow ? 16 : 18} />
      </IconButton>
    </QuickTooltip>,
    // 4. Sdílet (volitelné)
    onShare && (
      <QuickTooltip key="share" title="Sdílet">
        <IconButton
          onClick={onShare}
          sx={createIconButton('secondary', isDark, 'small')}
        >
          <Share2 size={isVeryNarrow ? 16 : 18} />
        </IconButton>
      </QuickTooltip>
    ),
    // 5. Smazat (volitelné)
    onDelete && (
      <QuickTooltip key="delete" title="Smazat">
        <IconButton
          onClick={onDelete}
          sx={createIconButton('error', isDark, 'small')}
        >
          <Trash2 size={isVeryNarrow ? 16 : 18} />
        </IconButton>
      </QuickTooltip>
    ),
  ].filter(Boolean); // Odfiltrovat null/undefined

  // Chip color mapping funkce
  const getChipStyles = (chip) => {
    if (!chip) return {};

    const { color = 'primary', active = true } = chip;

    if (color === 'primary' && active) {
      return {
        backgroundColor: isDark
          ? 'rgba(139, 188, 143, 0.15)'
          : 'rgba(139, 188, 143, 0.12)',
        color: isDark
          ? 'rgba(139, 188, 143, 0.95)'
          : 'rgba(85, 107, 47, 0.95)',
      };
    }

    if (color === 'primary' && !active) {
      return {
        backgroundColor: isDark
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(0, 0, 0, 0.06)',
        color: 'text.secondary',
      };
    }

    // Default neutral
    return {
      backgroundColor: isDark
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.06)',
      color: 'text.secondary',
    };
  };

  return (
    <Card
      onClick={onClick}
      {...swipeHandlers}
      {...longPressHandlers}
      elevation={0}
      sx={{
        ...glassCardStyles,
        height: '100%',
        minHeight,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: BORDER_RADIUS.card,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: onClick ? 'pointer' : 'default',

        // Hover efekt jen pro non-touch zařízení
        '&:hover': isTouch ? {} : {
          transform: onClick ? 'translateY(-4px)' : 'none',
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
        {/* Řádek 1: Velká ikona vlevo + akční ikony vpravo */}
        {(largeIcon || actionIcons) && (
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
            {/* Velká ikona (levá strana) */}
            {largeIcon && (
              <Box>{largeIcon}</Box>
            )}

            {/* Action ikony (pravá strana) */}
            {actionIcons && actionIcons.length > 0 && (
              <Box display="flex" alignItems="center" gap={isVeryNarrow ? 0.5 : 0.75}>
                {actionIcons}
              </Box>
            )}
          </Box>
        )}

        {/* Řádek 2: Chipy (aktivní, meditace...) */}
        {chips && chips.length > 0 && (
          <Box display="flex" alignItems="center" gap={0.75} mb={1} flexWrap="wrap">
            {chips.map((chip, index) => (
              <Chip
                key={index}
                icon={chip.icon}
                label={chip.label}
                size="small"
                sx={{
                  height: isVeryNarrow ? 14 : 16,
                  fontSize: isVeryNarrow ? '0.55rem' : '0.6rem',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  ...getChipStyles(chip),
                  border: 'none',
                  '& .MuiChip-label': {
                    px: isVeryNarrow ? 0.5 : 0.75,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  },
                  '& .MuiChip-icon': {
                    marginLeft: '6px',
                    color: 'inherit',
                  }
                }}
              />
            ))}
          </Box>
        )}

        {/* Řádek 3: Datum vytvoření + přístupnost (VŽDY přítomen!) */}
        <Box
          display="flex"
          alignItems="center"
          gap={1.5}
          mb={1}
          flexWrap="wrap"
          sx={{ minHeight: '1.2em' }} // Zajistí výšku i když prázdný
        >
          {creationDate && (
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.7rem',
              }}
            >
              Vytvořeno: {creationDate}
            </Typography>
          )}
          {accessFromDate && (
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.7rem',
              }}
            >
              Od: {accessFromDate}
            </Typography>
          )}
          {accessToDate && (
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.7rem',
              }}
            >
              Do: {accessToDate}
            </Typography>
          )}
          {/* Prázdný prostor když žádné datum není */}
          {!creationDate && !accessFromDate && !accessToDate && (
            <Typography
              variant="caption"
              sx={{
                color: 'transparent',
                fontSize: '0.7rem',
              }}
            >
              &nbsp;
            </Typography>
          )}
        </Box>

        {/* Řádek 4: Metadata (specifické podle typu karty) */}
        {metadata && metadata.length > 0 && (
          <Box display="flex" alignItems="center" gap={1.5} mb={1} flexWrap="wrap">
            {metadata.map((item, index) => (
              <Box key={index} display="flex" alignItems="center" gap={0.5}>
                {item.icon}
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.7rem',
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Řádek 5: Odkaz/soubor nebo seznam materiálů */}
        {linkOrFile && (
          <Box mb={1}>
            {typeof linkOrFile === 'string' ? (
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.7rem',
                }}
              >
                {linkOrFile}
              </Typography>
            ) : (
              linkOrFile
            )}
          </Box>
        )}

        {/* Řádek 6: Nadpis (2 řádky) */}
        {title && (
          <Typography
            variant="h6"
            sx={{
              fontSize: isVeryNarrow ? '0.95rem' : { xs: '0.95rem', sm: '1rem' },
              fontWeight: 600,
              color: 'text.primary',
              lineHeight: 1.3,
              minHeight: '2.6em', // 2 řádky × 1.3 lineHeight
              mt: 0.5,
              mb: 1,
              ...createTextEllipsis(2),
            }}
          >
            {title}
          </Typography>
        )}

        {/* Řádek 7: Popis (3 řádky) */}
        {description !== undefined && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: isVeryNarrow ? '0.75rem' : { xs: '0.8rem', sm: '0.825rem' },
              lineHeight: 1.4,
              minHeight: '4.2em', // 3 řádky × 1.4 lineHeight
              mb: 1,
              ...createTextEllipsis(3),
            }}
          >
            {description || '\u00A0'}
          </Typography>
        )}

        {/* Řádek 7.5: Material type chips */}
        {materialTypeChips && (
          <Box
            display="flex"
            gap={0.75}
            mb={1.5}
            flexWrap="wrap"
          >
            {materialTypeChips}
          </Box>
        )}

        {/* Řádek 8: Taxonomy chipy (fixně 4 pozice pro stejnou výšku karet) */}
        <Box
          display="flex"
          gap={0.75}
          mb={1.5}
          flexWrap={{ xs: 'wrap', sm: 'nowrap' }}
          sx={{ minHeight: isVeryNarrow ? '14px' : '16px' }} // Zajistí výšku i když prázdný
        >
          {taxonomyOrAvailability ? (
            taxonomyOrAvailability
          ) : (
            // Prázdné placeholder chipy pro zachování výšky
            <>
              <Box sx={{ width: '1px', height: isVeryNarrow ? '14px' : '16px', visibility: 'hidden' }} />
              <Box sx={{ width: '1px', height: isVeryNarrow ? '14px' : '16px', visibility: 'hidden' }} />
              <Box sx={{ width: '1px', height: isVeryNarrow ? '14px' : '16px', visibility: 'hidden' }} />
              <Box sx={{ width: '1px', height: isVeryNarrow ? '14px' : '16px', visibility: 'hidden' }} />
            </>
          )}
        </Box>

        {/* Řádek 9: Footer (button "Jak to vidí klientka" + feedback button + custom content) */}
        {(onClientPreview || feedbackData || footer) && (
          <Box mt="auto">
            {/* Tlačítko "Jak to vidí klientka" */}
            {onClientPreview && (
              <Button
                variant="contained"
                size="small"
                startIcon={<User size={14} />}
                onClick={onClientPreview}
                sx={{
                  mb: (feedbackData || footer) ? 1.5 : 0, // Margin bottom pokud je feedback nebo custom footer
                  ...createClientPreviewButton(isDark)
                }}
              >
                Jak to vidí klientka
              </Button>
            )}

            {/* Feedback button - kompaktní tlačítko s reflexemi */}
            {feedbackData && feedbackData.length > 0 && (
              <Box
                onClick={onFeedbackClick}
                sx={{
                  mt: onClientPreview ? 0 : 0, // Žádný margin top pokud je nad ním client preview button
                  mb: footer ? 1.5 : 0, // Margin bottom pokud je pod ním custom footer
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.25,
                  py: 0.5,
                  marginLeft: 'auto',
                  backgroundColor: isDark
                    ? 'rgba(139, 188, 143, 0.1)'
                    : 'rgba(85, 107, 47, 0.08)',
                  border: '1px solid',
                  borderColor: isDark
                    ? 'rgba(139, 188, 143, 0.2)'
                    : 'rgba(85, 107, 47, 0.2)',
                  borderRadius: BORDER_RADIUS.small,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  width: 'fit-content',
                  '&:hover': {
                    backgroundColor: isDark
                      ? 'rgba(139, 188, 143, 0.15)'
                      : 'rgba(85, 107, 47, 0.12)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                <MessageSquare
                  size={14}
                  strokeWidth={2}
                  style={{ color: isDark ? 'rgba(139, 188, 143, 0.9)' : 'rgba(85, 107, 47, 0.9)' }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: 'primary.main',
                    fontSize: '0.7rem',
                  }}
                >
                  {feedbackData.length}× reflexe
                </Typography>
              </Box>
            )}

            {/* Custom footer content (např. reflexe) */}
            {footer}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default BaseCard;
