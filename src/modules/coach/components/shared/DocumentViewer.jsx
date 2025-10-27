import { Box, Button, Typography } from '@mui/material';
import {
  Download as DownloadIcon,
  Description as DocumentIcon,
} from '@mui/icons-material';

const DocumentViewer = ({ src, title }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    // Get extension from data URL or use default
    const extension = getExtensionFromDataURL(src);
    link.download = `${title || 'document'}${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getExtensionFromDataURL = (dataURL) => {
    if (!dataURL) return '';

    // Extract MIME type from data URL
    const match = dataURL.match(/data:([^;]+);/);
    if (!match) return '';

    const mimeType = match[1];

    // Map MIME types to extensions
    const mimeToExt = {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
      'application/vnd.oasis.opendocument.text': '.odt',
      'application/vnd.oasis.opendocument.spreadsheet': '.ods',
      'application/vnd.oasis.opendocument.presentation': '.odp',
      'application/msword': '.doc',
      'application/vnd.ms-excel': '.xls',
      'application/vnd.ms-powerpoint': '.ppt',
    };

    return mimeToExt[mimeType] || '';
  };

  const getFileTypeLabel = (dataURL) => {
    const ext = getExtensionFromDataURL(dataURL);
    return ext.toUpperCase().replace('.', '');
  };

  return (
    <Box>
      {/* Document info */}
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 2,
          mb: 2,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.02)',
        }}
      >
        <DocumentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {getFileTypeLabel(src)} dokument
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Klikni na tlačítko níže pro stažení
        </Typography>
      </Box>

      {/* Download button */}
      <Button
        variant="contained"
        startIcon={<DownloadIcon />}
        onClick={handleDownload}
        fullWidth
      >
        Stáhnout dokument
      </Button>
    </Box>
  );
};

export default DocumentViewer;
