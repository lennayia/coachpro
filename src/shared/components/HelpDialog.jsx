import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import { X } from 'lucide-react';
import { HELP_CONTENT } from '../constants/helpContent';
import BORDER_RADIUS from '@styles/borderRadius';

/**
 * HelpDialog - Zobrazení kontextové nápovědy
 *
 * @param {boolean} open - Stav otevření dialogu
 * @param {function} onClose - Handler pro zavření
 * @param {string} initialPage - Výchozí stránka nápovědy (dashboard, materials, atd.)
 *
 * @created 4.11.2025
 */
const HelpDialog = ({ open, onClose, initialPage = 'general' }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [currentPage, setCurrentPage] = useState(initialPage);

  const helpPages = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'materials', label: 'Materiály' },
    { key: 'programs', label: 'Programy' },
    { key: 'clients', label: 'Klientky' },
    { key: 'profile', label: 'Profil' },
    { key: 'general', label: 'Obecné' },
    { key: 'shortcuts', label: 'Zkratky' },
  ];

  const currentHelp = HELP_CONTENT[currentPage] || HELP_CONTENT.general;

  const handleTabChange = (event, newValue) => {
    setCurrentPage(newValue);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: BORDER_RADIUS.dialog,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          backgroundColor: isDark
            ? 'rgba(26, 26, 26, 0.85)'
            : 'rgba(255, 255, 255, 0.85)',
          boxShadow: isDark
            ? '0 8px 32px rgba(139, 188, 143, 0.2), 0 4px 16px rgba(0, 0, 0, 0.4)'
            : '0 8px 32px rgba(85, 107, 47, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
          maxHeight: '90vh',
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {currentHelp.icon} {currentHelp.title}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      {/* Tabs pro přepínání mezi stránkami */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs
          value={currentPage}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minHeight: 48,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
            },
          }}
        >
          {helpPages.map((page) => (
            <Tab key={page.key} label={page.label} value={page.key} />
          ))}
        </Tabs>
      </Box>

      <DialogContent sx={{ py: 3, px: 4 }}>
        {/* Renderování jednotlivých sekcí */}
        {currentHelp.sections.map((section, index) => (
          <Box key={index} mb={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 1.5,
                color: 'primary.main',
              }}
            >
              {section.title}
            </Typography>

            {/* Content text (pokud existuje) */}
            {section.content && (
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  lineHeight: 1.7,
                  color: isDark ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
                }}
              >
                {section.content}
              </Typography>
            )}

            {/* Items list (pokud existují) */}
            {section.items && section.items.length > 0 && (
              <List dense sx={{ pl: 0 }}>
                {section.items.map((item, itemIndex) => (
                  <ListItem
                    key={itemIndex}
                    sx={{
                      py: 0.5,
                      px: 0,
                      alignItems: 'flex-start',
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            lineHeight: 1.6,
                            color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                            '&::before': {
                              content: '"• "',
                              color: 'primary.main',
                              fontWeight: 700,
                              marginRight: 1,
                            },
                          }}
                        >
                          {item}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;
