import { Box, Typography, Button } from '@mui/material';
import CustomAudioPlayer from './CustomAudioPlayer';
import PDFViewer from './PDFViewer';
import DocumentViewer from './DocumentViewer';
import { getEmbedUrl } from '../../utils/linkDetection';
import BORDER_RADIUS from '@styles/borderRadius';

/**
 * MaterialRenderer - Sdílená komponenta pro renderování materiálů
 * Používá se v DailyView i MaterialView
 *
 * @param {Object} material - Materiál k zobrazení
 * @param {boolean} showTitle - Zobrazit název materiálu (default: false)
 */
const MaterialRenderer = ({ material, showTitle = false }) => {
  if (!material) return null;

  return (
    <Box>
      {showTitle && (
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {material.title}
        </Typography>
      )}

      {/* Audio */}
      {material.type === 'audio' && (
        <CustomAudioPlayer
          src={material.content}
          title={material.title}
        />
      )}

      {/* Video */}
      {material.type === 'video' && (
        <Box
          sx={{
            borderRadius: BORDER_RADIUS.small,
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            backgroundColor: '#000',
          }}
        >
          <video
            controls
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          >
            <source src={material.content} />
            Tvůj prohlížeč nepodporuje přehrávání videa.
          </video>
        </Box>
      )}

      {/* Image */}
      {material.type === 'image' && (
        <Box
          sx={{
            borderRadius: BORDER_RADIUS.small,
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <img
            src={material.content}
            alt={material.title}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
        </Box>
      )}

      {/* PDF */}
      {material.type === 'pdf' && (
        <PDFViewer src={material.content} title={material.title} />
      )}

      {/* Document */}
      {material.type === 'document' && (
        <DocumentViewer src={material.content} title={material.title} />
      )}

      {/* Text */}
      {material.type === 'text' && (
        <Box
          sx={{
            p: 2,
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.02)',
            borderRadius: BORDER_RADIUS.small,
            whiteSpace: 'pre-wrap',
          }}
        >
          <Typography variant="body1">{material.content}</Typography>
        </Box>
      )}

      {/* Link - External services */}
      {material.type === 'link' && (
        <Box sx={{ borderRadius: BORDER_RADIUS.dayHeader, overflow: 'hidden' }}>
          {/* YouTube embed */}
          {material.linkType === 'youtube' && (
            <Box
              sx={{
                position: 'relative',
                aspectRatio: '16/9',
                borderRadius: BORDER_RADIUS.dayHeader,
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                background: '#000',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <iframe
                width="100%"
                height="100%"
                src={getEmbedUrl(material.content, 'youtube')}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ display: 'block' }}
                title={material.title}
              />
            </Box>
          )}

          {/* Vimeo embed */}
          {material.linkType === 'vimeo' && (
            <Box
              sx={{
                position: 'relative',
                aspectRatio: '16/9',
                borderRadius: BORDER_RADIUS.dayHeader,
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
                borderRadius: BORDER_RADIUS.dayHeader,
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
                borderRadius: BORDER_RADIUS.dayHeader,
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
                borderRadius: BORDER_RADIUS.dayHeader,
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

          {/* Other services - fallback button */}
          {!['youtube', 'vimeo', 'spotify', 'soundcloud', 'instagram'].includes(
            material.linkType
          ) && (
            <Box
              sx={{
                p: 4,
                borderRadius: BORDER_RADIUS.dayHeader,
                background: `linear-gradient(135deg, ${material.linkMeta?.color || '#757575'}15, ${material.linkMeta?.color || '#757575'}05)`,
                border: `2px solid ${material.linkMeta?.color || '#757575'}40`,
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  fontSize: 56,
                  mb: 2,
                }}
              >
                {material.linkMeta?.icon || '🔗'}
              </Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                {material.linkMeta?.label || 'Externí odkaz'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Tento materiál se otevře v novém okně
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
      )}
    </Box>
  );
};

export default MaterialRenderer;
