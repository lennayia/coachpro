import { Box, Typography, IconButton } from '@mui/material';
import { Copy } from 'lucide-react';
import { useTheme } from '@mui/material';
import { useNotification } from '@shared/context/NotificationContext';
import BORDER_RADIUS from '@styles/borderRadius';
import { createIconButton } from '@shared/styles/modernEffects';
import { QuickTooltip } from '@shared/components/AppTooltip';
import SocialShareMenu from './SocialShareMenu';

/**
 * PublicShareCode - Universal public share code display component
 *
 * Displays a public share code with copy button and social sharing menu
 * Can be used for materials, programs, card decks, or any shareable content
 *
 * @param {string} code - The public share code to display
 * @param {string} shareText - Text to share on social media
 * @param {string} shareTitle - Title for social sharing (default: 'CoachPro')
 * @param {string} copyTooltip - Tooltip for copy button (default: "Zkopírovat veřejný kód")
 *
 * @example
 * <PublicShareCode
 *   code="ABC123"
 *   shareText="Podívejte se na tento skvělý materiál! Kód: ABC123"
 *   shareTitle="CoachPro - Materiál"
 * />
 */
const PublicShareCode = ({
  code,
  shareText,
  shareTitle = 'CoachPro',
  copyTooltip = 'Zkopírovat veřejný kód',
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { showSuccess } = useNotification();

  if (!code) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      showSuccess('Zkopírováno!', 'Veřejný kód zkopírován do schránky 📋');
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1.5,
        py: 0.5,
        borderRadius: BORDER_RADIUS.compact,
        backgroundColor: isDark
          ? 'rgba(139, 188, 143, 0.1)'
          : 'rgba(85, 107, 47, 0.08)',
        border: `1px solid ${isDark ? 'rgba(139, 188, 143, 0.2)' : 'rgba(85, 107, 47, 0.15)'}`,
        width: 'fit-content',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontFamily: 'monospace',
          fontWeight: 600,
          letterSpacing: '0.1em',
          color: 'primary.main',
          fontSize: '0.85rem',
        }}
      >
        {code}
      </Typography>

      <QuickTooltip title={copyTooltip}>
        <IconButton
          size="small"
          onClick={handleCopyCode}
          sx={{
            p: 0.5,
            ml: 0.5,
            ...createIconButton(isDark),
          }}
        >
          <Copy size={14} />
        </IconButton>
      </QuickTooltip>

      <SocialShareMenu
        shareText={shareText}
        shareTitle={shareTitle}
        iconSize={14}
      />
    </Box>
  );
};

export default PublicShareCode;
