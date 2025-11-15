import { useState, useEffect } from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MessageSquare,
  Share2,
} from 'lucide-react';
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '@shared/context/NotificationContext';
import { supabase } from '@shared/config/supabase';
import BORDER_RADIUS from '@styles/borderRadius';
import { createGlassDialog, createIconButton } from '@shared/styles/modernEffects';
import { QuickTooltip } from '@shared/components/AppTooltip';
import { getCurrentUser } from '../../../modules/coach/utils/storage';

/**
 * SocialShareMenu - Universal social media sharing component
 *
 * Displays a menu with social media sharing options
 * Automatically loads coach's social media profiles from database
 * Redirects to profile if social media link is missing
 *
 * @param {string} shareText - Text to share on social media
 * @param {string} shareTitle - Title for sharing (optional)
 * @param {number} iconSize - Size of the share icon (default: 14)
 * @param {object} iconButtonSx - Custom styles for icon button
 * @param {string} tooltip - Tooltip text (default: "Sdílet na sociálních sítích")
 *
 * @example
 * <SocialShareMenu
 *   shareText="Podívejte se na tento skvělý materiál!"
 *   shareTitle="CoachPro Materiál"
 * />
 */
const SocialShareMenu = ({
  shareText,
  shareTitle = 'CoachPro',
  iconSize = 14,
  iconButtonSx = {},
  tooltip = 'Sdílet na sociálních sítích',
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [anchorEl, setAnchorEl] = useState(null);
  const [coachProfile, setCoachProfile] = useState(null);

  // Load coach profile with social media links
  useEffect(() => {
    const loadCoachProfile = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser?.id) return;

      try {
        const { data, error } = await supabase
          .from('coachpro_coaches')
          .select('facebook, instagram, linkedin, whatsapp, telegram, website')
          .eq('id', currentUser.id)
          .single();

        if (error) throw error;
        setCoachProfile(data);
      } catch (err) {
        console.error('Error loading coach profile:', err);
      }
    };

    loadCoachProfile();
  }, []); // Empty dependency array - load only once on mount

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleShareFacebook = async () => {
    if (!coachProfile?.facebook) {
      showError('Chybí Facebook profil', 'Pro sdílení na Facebook nejdřív vyplň URL svého Facebook profilu v nastavení.');
      navigate('/coach/profile', { state: { from: window.location.pathname } });
      handleMenuClose();
      return;
    }

    try {
      await navigator.clipboard.writeText(shareText);
      window.open(coachProfile.facebook, '_blank');
      showSuccess('Otevřeno!', 'Facebook profil otevřen. Text zkopírován - vlož ho do příspěvku 📋');
    } catch (err) {
      window.open(coachProfile.facebook, '_blank');
      showSuccess('Otevřeno!', 'Facebook profil otevřen 📘');
    }
    handleMenuClose();
  };

  const handleShareInstagram = async () => {
    if (!coachProfile?.instagram) {
      showError('Chybí Instagram profil', 'Pro sdílení na Instagram nejdřív vyplň URL svého Instagram profilu v nastavení.');
      navigate('/coach/profile', { state: { from: window.location.pathname } });
      handleMenuClose();
      return;
    }

    try {
      await navigator.clipboard.writeText(shareText);
      window.open(coachProfile.instagram, '_blank');
      showSuccess('Otevřeno!', 'Instagram profil otevřen. Text zkopírován - vlož ho do příspěvku 📋');
    } catch (err) {
      window.open(coachProfile.instagram, '_blank');
      showSuccess('Otevřeno!', 'Instagram profil otevřen 📸');
    }
    handleMenuClose();
  };

  const handleShareLinkedIn = async () => {
    if (!coachProfile?.linkedin) {
      showError('Chybí LinkedIn profil', 'Pro sdílení na LinkedIn nejdřív vyplň URL svého LinkedIn profilu v nastavení.');
      navigate('/coach/profile', { state: { from: window.location.pathname } });
      handleMenuClose();
      return;
    }

    try {
      await navigator.clipboard.writeText(shareText);
      window.open(coachProfile.linkedin, '_blank');
      showSuccess('Otevřeno!', 'LinkedIn profil otevřen. Text zkopírován - vlož ho do příspěvku 📋');
    } catch (err) {
      window.open(coachProfile.linkedin, '_blank');
      showSuccess('Otevřeno!', 'LinkedIn profil otevřen 💼');
    }
    handleMenuClose();
  };

  const handleShareWhatsApp = () => {
    if (coachProfile?.whatsapp) {
      const whatsappNumber = coachProfile.whatsapp.replace(/[\s-]/g, '');
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
      showSuccess('Otevřeno!', 'WhatsApp otevřen s připraveným textem 💬');
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
      showSuccess('Otevřeno!', 'WhatsApp otevřen 💬');
    }
    handleMenuClose();
  };

  const handleShareEmail = () => {
    const subject = shareTitle;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareText)}`;
    window.location.href = mailtoUrl;
    handleMenuClose();
  };

  const handleShareGeneric = () => {
    if (navigator.share) {
      navigator
        .share({
          title: shareTitle,
          text: shareText,
        })
        .then(() => {
          showSuccess('Sdíleno!', 'Obsah úspěšně sdílen 📤');
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            console.error('Share error:', err);
            navigator.clipboard.writeText(shareText);
            showSuccess('Zkopírováno!', 'Text zkopírován do schránky 📋');
          }
        });
    } else {
      navigator.clipboard.writeText(shareText);
      showSuccess('Zkopírováno!', 'Text zkopírován do schránky 📋');
    }
    handleMenuClose();
  };

  return (
    <>
      <QuickTooltip title={tooltip}>
        <IconButton
          size="small"
          onClick={handleMenuOpen}
          sx={{
            p: 0.5,
            ...createIconButton(isDark),
            ...iconButtonSx,
          }}
        >
          <Share2 size={iconSize} />
        </IconButton>
      </QuickTooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            ...createGlassDialog(isDark, BORDER_RADIUS.compact),
            mt: 1,
            minWidth: 200,
          },
        }}
      >
        <MenuItem onClick={handleShareFacebook}>
          <ListItemIcon>
            <Facebook size={18} />
          </ListItemIcon>
          <ListItemText>Facebook</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleShareInstagram}>
          <ListItemIcon>
            <Instagram size={18} />
          </ListItemIcon>
          <ListItemText>Instagram</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleShareLinkedIn}>
          <ListItemIcon>
            <Linkedin size={18} />
          </ListItemIcon>
          <ListItemText>LinkedIn</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleShareWhatsApp}>
          <ListItemIcon>
            <MessageSquare size={18} />
          </ListItemIcon>
          <ListItemText>WhatsApp</ListItemText>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleShareEmail}>
          <ListItemIcon>
            <Mail size={18} />
          </ListItemIcon>
          <ListItemText>E-mail</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleShareGeneric}>
          <ListItemIcon>
            <Share2 size={18} />
          </ListItemIcon>
          <ListItemText>Obecné sdílení</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default SocialShareMenu;
