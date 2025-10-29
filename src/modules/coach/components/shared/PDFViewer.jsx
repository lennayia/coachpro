import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import {
  OpenInNew as OpenIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useNotification } from '@shared/context/NotificationContext';

const PDFViewer = ({ src, title }) => {
  const [error, setError] = useState(false);
  const { showError } = useNotification();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `${title || 'document'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpen = () => {
    window.open(src, '_blank');
  };

  const handleIframeError = () => {
    setError(true);
    showError('Chyba PDF', 'Nepodařilo se načíst PDF. Zkus stáhnout nebo otevřít v novém okně.');
  };

  return (
    <Box>
      {/* Error message */}
      {error && (
        <Box mb={2} p={2} sx={{ backgroundColor: 'error.light', borderRadius: 1 }}>
          <Typography variant="body2" color="error.dark">
            Nepodařilo se načíst PDF. Zkus stáhnout nebo otevřít v novém okně.
          </Typography>
        </Box>
      )}

      {/* PDF Preview (iframe) */}
      <Box
        sx={{
          width: '100%',
          height: 400,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
          mb: 2,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.02)',
        }}
      >
        <iframe
          key={src}
          src={src}
          title={title}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          onError={handleIframeError}
        />
      </Box>

      {/* Actions */}
      <Box display="flex" gap={1}>
        <Button
          variant="outlined"
          startIcon={<OpenIcon />}
          onClick={handleOpen}
          size="small"
        >
          Otevřít
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          size="small"
        >
          Stáhnout
        </Button>
      </Box>
    </Box>
  );
};

export default PDFViewer;
