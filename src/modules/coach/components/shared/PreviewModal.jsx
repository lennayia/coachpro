import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Button,
  Typography,
} from '@mui/material';
import {
  Close as CloseIcon,
  OpenInNew as OpenInNewIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import {
  Headphones,
  Video,
  FileText,
  Image as ImageLucide,
  FileSpreadsheet,
  Type,
  Link2
} from 'lucide-react';
import CustomAudioPlayer from './CustomAudioPlayer';
import PDFViewer from './PDFViewer';
import DocumentViewer from './DocumentViewer';
import BORDER_RADIUS from '@styles/borderRadius';
import { getEmbedUrl } from '../../utils/linkDetection';
import { useModal } from '@shared/hooks/useModernEffects';
import { createBackdrop } from '../../../../shared/styles/modernEffects';

const PreviewModal = ({ open, onClose, material }) => {
  const modalStyles = useModal();

  if (!material) return null;

  const handleOpenInNewTab = () => {
    const previewWindow = window.open('', '_blank');
    if (!previewWindow) return;

    const baseStyles = `
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        max-width: 1000px;
        margin: 0 auto;
        padding: 40px 20px;
        background: #f5f5f5;
      }
      .container {
        background: white;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      h1 {
        color: #556B2F;
        border-bottom: 2px solid #8FBC8F;
        padding-bottom: 10px;
        margin-top: 0;
      }
    `;

    switch (material.type) {
      case 'audio':
        previewWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${material.title}</title>
              <meta charset="UTF-8">
              <style>${baseStyles}</style>
            </head>
            <body>
              <div class="container">
                <h1>🎧 ${material.title}</h1>
                <audio controls autoplay style="width: 100%; margin-top: 20px;">
                  <source src="${material.content}" type="audio/mpeg">
                </audio>
              </div>
            </body>
          </html>
        `);
        break;

      case 'video':
        previewWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${material.title}</title>
              <meta charset="UTF-8">
              <style>${baseStyles}</style>
            </head>
            <body>
              <div class="container">
                <h1>🎬 ${material.title}</h1>
                <video controls autoplay style="width: 100%; margin-top: 20px; background: #000; border-radius: 8px;">
                  <source src="${material.content}">
                  Tvůj prohlížeč nepodporuje přehrávání videa.
                </video>
              </div>
            </body>
          </html>
        `);
        break;

      case 'image':
        previewWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${material.title}</title>
              <meta charset="UTF-8">
              <style>${baseStyles}</style>
            </head>
            <body>
              <div class="container">
                <h1>🖼️ ${material.title}</h1>
                <img src="${material.content}" alt="${material.title}" style="width: 100%; height: auto; margin-top: 20px; border-radius: 8px;">
              </div>
            </body>
          </html>
        `);
        break;

      case 'pdf':
        previewWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${material.title}</title>
              <style>body { margin: 0; } iframe { width: 100vw; height: 100vh; border: none; }</style>
            </head>
            <body><iframe src="${material.content}"></iframe></body>
          </html>
        `);
        break;

      default:
        window.open(material.content, '_blank');
        previewWindow.close();
        return;
    }

    previewWindow.document.close();
  };

  const renderContent = () => {
    switch (material.type) {
      case 'audio':
        return (
          <Box>
            <CustomAudioPlayer src={material.content} title={material.title} />
          </Box>
        );

      case 'video':
        // Detekce MIME typu podle URL/base64
        const getVideoType = (src) => {
          if (src.includes('data:video/')) {
            return src.split(';')[0].replace('data:', '');
          }
          if (src.toLowerCase().includes('.mov')) {
            return 'video/quicktime';
          }
          if (src.toLowerCase().includes('.mp4')) {
            return 'video/mp4';
          }
          if (src.toLowerCase().includes('.webm')) {
            return 'video/webm';
          }
          return 'video/mp4'; // fallback
        };

        return (
          <Box
            sx={{
              borderRadius: BORDER_RADIUS.compact,
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              backgroundColor: '#000',
            }}
          >
            <video
              controls
              autoPlay
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            >
              <source src={material.content} type={getVideoType(material.content)} />
              Tvůj prohlížeč nepodporuje přehrávání videa.
            </video>
          </Box>
        );

      case 'image':
        return (
          <Box
            sx={{
              borderRadius: BORDER_RADIUS.compact,
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              textAlign: 'center',
            }}
          >
            <img
              src={material.content}
              alt={material.title}
              style={{
                maxWidth: '100%',
                height: 'auto',
                display: 'block',
                margin: '0 auto',
              }}
            />
          </Box>
        );

      case 'pdf':
        return <PDFViewer src={material.content} title={material.title} />;

      case 'document':
        return <DocumentViewer src={material.content} title={material.title} />;

      case 'text':
        return (
          <Box
            sx={{
              p: 3,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.02)',
              borderRadius: BORDER_RADIUS.compact,
              maxHeight: '60vh',
              overflow: 'auto',
            }}
          >
            <Typography
              variant="body1"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                lineHeight: 1.7,
              }}
            >
              {material.content}
            </Typography>
          </Box>
        );

      case 'link':
        const embedUrl = material.linkType ? getEmbedUrl(material.content, material.linkType) : null;

        return (
          <Box>
            {/* YouTube embed */}
            {material.linkType === 'youtube' && (
              <Box
                sx={{
                  aspectRatio: '16/9',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  background: '#000',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {embedUrl ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={embedUrl}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ display: 'block' }}
                    title={material.title}
                  />
                ) : (
                  <Box sx={{ p: 4, color: 'white', textAlign: 'center' }}>
                    <Typography>Nepodařilo se načíst náhled. URL: {material.content}</Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* Vimeo embed */}
            {material.linkType === 'vimeo' && (
              <Box
                sx={{
                  aspectRatio: '16/9',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  background: '#000',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={getEmbedUrl(material.content, 'vimeo')}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  style={{ display: 'block' }}
                  title={material.title}
                />
              </Box>
            )}

            {/* Spotify embed */}
            {material.linkType === 'spotify' && (
              <Box
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(29,185,84,0.2)',
                  background: '#000',
                }}
              >
                <iframe
                  src={getEmbedUrl(material.content, 'spotify')}
                  width="100%"
                  height="380"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  style={{ display: 'block' }}
                  title={material.title}
                />
              </Box>
            )}

            {/* SoundCloud embed */}
            {material.linkType === 'soundcloud' && (
              <Box
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(255,85,0,0.2)',
                }}
              >
                <iframe
                  width="100%"
                  height="166"
                  scrolling="no"
                  frameBorder="no"
                  allow="autoplay"
                  src={getEmbedUrl(material.content, 'soundcloud')}
                  style={{ display: 'block' }}
                  title={material.title}
                />
              </Box>
            )}

            {/* Instagram embed */}
            {material.linkType === 'instagram' && (
              <Box
                sx={{
                  maxWidth: 540,
                  mx: 'auto',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(228,64,95,0.2)',
                }}
              >
                <iframe
                  src={getEmbedUrl(material.content, 'instagram')}
                  width="100%"
                  height="600"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency="true"
                  style={{ display: 'block' }}
                  title={material.title}
                />
              </Box>
            )}

            {/* Google Drive embed */}
            {material.linkType === 'google-drive' && (() => {
              const embedUrl = getEmbedUrl(material.content, 'google-drive');

              return embedUrl ? (
                <Box
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(66,133,244,0.2)',
                    background: '#fff',
                    border: '1px solid rgba(66,133,244,0.2)',
                    height: '600px',
                  }}
                >
                  <iframe
                    src={embedUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ display: 'block' }}
                    title={material.title}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #4285f415, #4285f405)',
                    border: '2px solid #4285f440',
                    textAlign: 'center',
                  }}
                >
                  <Box sx={{ fontSize: 56, mb: 2 }}>📁</Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Google Drive
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Tento soubor se otevře v novém okně
                  </Typography>
                  <Button
                    variant="contained"
                    href={material.content}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="large"
                    sx={{
                      py: 1.5,
                      px: 4,
                      bgcolor: '#4285f4',
                      fontWeight: 600,
                      fontSize: '1rem',
                      '&:hover': {
                        bgcolor: '#4285f4',
                        opacity: 0.9,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 16px #4285f440',
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    Otevřít Google Drive
                  </Button>
                </Box>
              );
            })()}

            {/* Ostatní služby - tlačítko pro otevření */}
            {!['youtube', 'vimeo', 'spotify', 'soundcloud', 'instagram', 'google-drive'].includes(
              material.linkType
            ) && (
              <Box
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${material.linkMeta?.color || '#757575'}15, ${material.linkMeta?.color || '#757575'}05)`,
                  border: `2px solid ${material.linkMeta?.color || '#757575'}40`,
                  textAlign: 'center',
                }}
              >
                <Box sx={{ fontSize: 56, mb: 2 }}>
                  {material.linkMeta?.icon || '🔗'}
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  {material.linkMeta?.label || 'Externí odkaz'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Tento odkaz se otevře v novém okně
                </Typography>
                <Button
                  variant="contained"
                  href={material.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="large"
                  sx={{
                    py: 1.5,
                    px: 4,
                    bgcolor: material.linkMeta?.color || '#757575',
                    fontWeight: 600,
                    fontSize: '1rem',
                    '&:hover': {
                      bgcolor: material.linkMeta?.color || '#757575',
                      opacity: 0.9,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 16px ${material.linkMeta?.color || '#757575'}40`,
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  Otevřít {material.linkMeta?.label || 'odkaz'}
                </Button>
              </Box>
            )}
          </Box>
        );

      default:
        return <Typography>Náhled není k dispozici</Typography>;
    }
  };

  const getIcon = () => {
    switch (material.type) {
      case 'audio':
        return <Headphones size={32} strokeWidth={1.5} />;
      case 'video':
        return <Video size={32} strokeWidth={1.5} />;
      case 'pdf':
        return <FileText size={32} strokeWidth={1.5} />;
      case 'image':
        return <ImageLucide size={32} strokeWidth={1.5} />;
      case 'document':
        return <FileSpreadsheet size={32} strokeWidth={1.5} />;
      case 'text':
        return <Type size={32} strokeWidth={1.5} />;
      case 'link':
        // Pro linky ponecháme emoji z linkMeta (barevné)
        return <Box fontSize={32}>{material.linkMeta?.icon || '🔗'}</Box>;
      default:
        return <Link2 size={32} strokeWidth={1.5} />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          ...modalStyles,
          borderRadius: BORDER_RADIUS.dialog,
        },
      }}
      BackdropProps={{ sx: createBackdrop() }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          pb: 2,
          borderBottom: (theme) =>
            theme.palette.mode === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box sx={{ fontSize: 32, color: 'text.secondary' }}>{getIcon()}</Box>
        <Box flexGrow={1}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {material.title}
          </Typography>
          {material.description && (
            <Typography variant="body2" color="text.secondary">
              {material.description}
            </Typography>
          )}
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ pt: 3 }}>
        {renderContent()}

        {/* Actions */}
        <Box display="flex" gap={2} mt={3} justifyContent="flex-end">
          {(material.type === 'audio' ||
            material.type === 'video' ||
            material.type === 'pdf' ||
            material.type === 'image' ||
            (material.type === 'link' && material.linkMeta?.embedSupport)) && (
            <Button
              variant="outlined"
              startIcon={<OpenInNewIcon />}
              onClick={handleOpenInNewTab}
              sx={{
                borderRadius: BORDER_RADIUS.button,
                textTransform: 'none',
                borderColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(143, 188, 143, 0.1)'
                      : 'rgba(85, 107, 47, 0.05)',
                },
              }}
            >
              Otevřít v nové kartě
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;
