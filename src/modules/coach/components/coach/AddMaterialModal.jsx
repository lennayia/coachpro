import { useState, useRef, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Headphones as AudioIcon,
  PictureAsPdf as PdfIcon,
  TextFields as TextIcon,
  Link as LinkIcon,
  CloudUpload as CloudUploadIcon,
  Description as DocumentIcon,
  Image as ImageIcon,
  Videocam as VideoIcon,
} from '@mui/icons-material';
import { getCurrentUser, saveMaterial } from '../../utils/storage';
import { generateUUID } from '../../utils/generateCode';
import {
  fileToBase64,
  getAudioDuration,
  getVideoDuration,
  getPdfPageCount,
  estimateTextPageCount,
  getAcceptString,
  getFileTypeHint,
  convertHeicToJpeg,
} from '@shared/utils/helpers';
import { detectLinkType, getEmbedUrl, isValidUrl, getThumbnailUrl, getYouTubeMetadata } from '../../utils/linkDetection';
import { uploadFileToSupabase, isSupabaseConfigured } from '../../utils/supabaseStorage';
import { useNotification } from '@shared/context/NotificationContext';

const MATERIAL_TYPES = [
  { value: 'audio', label: 'Audio', icon: <AudioIcon sx={{ fontSize: 40 }} /> },
  { value: 'video', label: 'Video', icon: <VideoIcon sx={{ fontSize: 40 }} /> },
  { value: 'pdf', label: 'PDF', icon: <PdfIcon sx={{ fontSize: 40 }} /> },
  { value: 'image', label: 'Obrázek', icon: <ImageIcon sx={{ fontSize: 40 }} /> },
  { value: 'document', label: 'Dokument', icon: <DocumentIcon sx={{ fontSize: 40 }} /> },
  { value: 'text', label: 'Text', icon: <TextIcon sx={{ fontSize: 40 }} /> },
  { value: 'link', label: 'Odkaz', icon: <LinkIcon sx={{ fontSize: 40 }} /> },
];

const AddMaterialModal = ({ open, onClose, onSuccess, editMaterial = null }) => {
  const currentUser = getCurrentUser();
  const fileInputRef = useRef(null);
  const isEditMode = Boolean(editMaterial);
  const { showSuccess, showError } = useNotification();

  const [selectedType, setSelectedType] = useState('');
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('meditation');
  const [linkUrl, setLinkUrl] = useState('');
  const [textContent, setTextContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [detectedService, setDetectedService] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Prevent default drag behavior on entire window
  useEffect(() => {
    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    if (open) {
      window.addEventListener('dragover', preventDefaults);
      window.addEventListener('drop', preventDefaults);
    }

    return () => {
      window.removeEventListener('dragover', preventDefaults);
      window.removeEventListener('drop', preventDefaults);
    };
  }, [open]);

  // Předvyplnění formuláře při editaci
  useEffect(() => {
    if (editMaterial && open) {
      setSelectedType(editMaterial.type);
      setTitle(editMaterial.title);
      setDescription(editMaterial.description || '');
      setCategory(editMaterial.category);

      if (editMaterial.type === 'link') {
        setLinkUrl(editMaterial.content);
        // Detekce služby pro preview
        const detected = detectLinkType(editMaterial.content);
        setDetectedService(detected);
        if (detected.embedSupport) {
          const embedUrl = getEmbedUrl(editMaterial.content, detected.type);
          setPreviewUrl(embedUrl);
        }
      } else if (editMaterial.type === 'text') {
        setTextContent(editMaterial.content);
      }
      // Pro file-based typy (audio, pdf, document) zobrazíme info, že je již nahraný
    }
  }, [editMaterial, open]);

  const handleReset = () => {
    setDragActive(false);
    setSelectedType('');
    setFile(null);
    setTitle('');
    setDescription('');
    setCategory('meditation');
    setLinkUrl('');
    setTextContent('');
    setError('');
    setDetectedService(null);
    setPreviewUrl(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
    }
  };

  const handleSave = async () => {
    setError('');
    setLoading(true);

    try {
      let content = '';
      let duration = null;
      let fileSize = null;
      let fileName = null;
      let pageCount = null;
      let linkType = null;
      let linkMeta = null;
      let thumbnail = null;
      let storagePath = null;

      // Validace
      if (!title) {
        const errorMsg = 'Název materiálu je povinný';
        showError('Chyba validace', errorMsg);
        throw new Error(errorMsg);
      }

      // Zpracování podle typu
      if (selectedType === 'link') {
        if (!linkUrl) {
          const errorMsg = 'URL je povinná';
          showError('Chyba validace', errorMsg);
          throw new Error(errorMsg);
        }

        // Validace URL
        if (!isValidUrl(linkUrl)) {
          const errorMsg = 'Zadej platnou URL adresu';
          showError('Chyba validace', errorMsg);
          throw new Error(errorMsg);
        }

        content = linkUrl;

        // Detekuj typ a metadata
        const detected = detectLinkType(linkUrl);
        linkType = detected.type;
        linkMeta = {
          icon: detected.icon,
          label: detected.label,
          color: detected.color,
          embedSupport: detected.embedSupport,
        };

        // Pokus se získat metadata (jen pro YouTube)
        if (detected.type === 'youtube') {
          thumbnail = getThumbnailUrl(linkUrl, detected.type);

          // Získej duration z YouTube API (pokud je nakonfigurován)
          try {
            const metadata = await getYouTubeMetadata(linkUrl);
            if (metadata.duration) {
              duration = metadata.duration;
            }
          } catch (error) {
            console.warn('Failed to fetch YouTube metadata:', error);
            // Pokračovat bez duration
          }
        }
      } else if (selectedType === 'text') {
        if (!textContent) {
          const errorMsg = 'Text je povinný';
          showError('Chyba validace', errorMsg);
          throw new Error(errorMsg);
        }
        content = textContent;
        // Odhadni počet stran
        pageCount = estimateTextPageCount(textContent);
      } else {
        // File-based types (audio, video, pdf, image, document)
        if (file) {
          // Nový soubor byl nahrán

          // Konverze HEIC → JPEG pro obrázky
          let processedFile = file;
          if (selectedType === 'image') {
            try {
              processedFile = await convertHeicToJpeg(file);
              // Pokud byl konvertován, aktualizuj typ na 'image' (už to je)
            } catch (conversionError) {
              const errorMsg = 'Nepodařilo se zpracovat obrázek. Zkus použít jiný formát (JPG, PNG).';
              showError('Chyba zpracování', errorMsg);
              throw new Error(errorMsg);
            }
          }

          fileSize = processedFile.size;
          fileName = processedFile.name;

          // Get audio duration
          if (selectedType === 'audio') {
            duration = await getAudioDuration(processedFile);
          }

          // Get video duration
          if (selectedType === 'video') {
            duration = await getVideoDuration(processedFile);
          }

          // Get PDF page count
          if (selectedType === 'pdf') {
            pageCount = await getPdfPageCount(processedFile);
          }

          // Upload to Supabase if configured, otherwise use base64
          if (isSupabaseConfigured()) {
            try {
              const { url, path } = await uploadFileToSupabase(processedFile, currentUser.id, selectedType);
              content = url; // Store Supabase URL
              storagePath = path; // Store path for potential deletion later
            } catch (uploadError) {
              console.error('Supabase upload failed, falling back to base64:', uploadError);
              content = await fileToBase64(processedFile);
            }
          } else {
            // Fallback to base64 (localStorage)
            content = await fileToBase64(processedFile);
          }
        } else if (isEditMode) {
          // Editace - použij existující soubor
          content = editMaterial.content;
          fileSize = editMaterial.fileSize || null;
          fileName = editMaterial.fileName || null;
          duration = editMaterial.duration || null;
          pageCount = editMaterial.pageCount || null;
        } else {
          // Nový materiál - soubor je povinný
          const errorMsg = 'Soubor je povinný';
          showError('Chyba validace', errorMsg);
          throw new Error(errorMsg);
        }
      }

      // Create material object
      const materialData = {
        id: isEditMode ? editMaterial.id : generateUUID(),
        coachId: currentUser.id,
        type: selectedType,
        title,
        description,
        content,
        category,
        duration,
        fileSize,
        fileName,
        pageCount,
        storagePath, // Supabase storage path (if uploaded)
        createdAt: isEditMode ? editMaterial.createdAt : new Date().toISOString(),
        updatedAt: isEditMode ? new Date().toISOString() : undefined,
      };

      // Přidej link-specific fields pokud je to link
      if (selectedType === 'link') {
        materialData.linkType = linkType;
        materialData.linkMeta = linkMeta;
        if (thumbnail) {
          materialData.thumbnail = thumbnail;
        }
      }

      // Save to localStorage
      saveMaterial(materialData);

      // Success
      showSuccess(
        'Hotovo!',
        isEditMode ? 'Materiál byl úspěšně upraven' : 'Materiál byl úspěšně přidán'
      );
      onSuccess();
      handleClose();
    } catch (err) {
      const errorMsg = err.message || 'Něco se pokazilo. Zkus to znovu.';
      setError(errorMsg);
      // Toast už byl zobrazen při throw new Error(), takže zobrazíme jen při obecné chybě
      if (!err.message || err.message === 'Něco se pokazilo. Zkus to znovu.') {
        showError('Chyba', errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const canSave = () => {
    if (!title) return false;
    if (selectedType === 'link') return linkUrl;
    if (selectedType === 'text') return textContent;
    // Pro file-based typy: při editaci nemusí být nový soubor
    if (isEditMode && (selectedType === 'audio' || selectedType === 'video' || selectedType === 'pdf' || selectedType === 'image' || selectedType === 'document')) {
      return true; // Už má uložený soubor
    }
    return file;
  };

  return (
    <Drawer
  anchor="right"
  open={open}
  onClose={handleClose}
  BackdropProps={{
    sx: {
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    }
  }}
  PaperProps={{
    sx: {
      width: { xs: '100%', sm: 500 },
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      backgroundColor: (theme) => theme.palette.mode === 'dark'
        ? 'rgba(26, 26, 26, 0.85)'
        : 'rgba(255, 255, 255, 0.85)',
      boxShadow: (theme) => theme.palette.mode === 'dark'
      ? '-4px 0 32px rgba(139, 188, 143, 0.15), 0 8px 32px rgba(0, 0, 0, 0.37)'
      : '-4px 0 32px rgba(85, 107, 47, 0.1), 0 8px 32px rgba(0, 0, 0, 0.1)',
    },
  }}
>
      <Box px={2} py={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
  <Typography variant="h5" mb={3} sx={{ fontWeight: 700 }}>
    {isEditMode ? 'Upravit materiál' : 'Přidat nový materiál'}
  </Typography>

  {error && (
    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
      {error}
    </Alert>
  )}

  <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1 }}> 
    {/* Krok 1: Výběr typu */}
    <Typography variant="subtitle2" mb={2} sx={{ fontWeight: 600 }}>
      Typ materiálu
    </Typography>

    {/* Info při editaci file-based materiálů */}
    {isEditMode && (selectedType === 'audio' || selectedType === 'video' || selectedType === 'pdf' || selectedType === 'image' || selectedType === 'document') && (
      <Alert severity="info" sx={{ mb: 2 }}>
        Typ materiálu nelze změnit. Můžeš ale nahradit soubor novým.
      </Alert>
    )}

    <Grid container spacing={2} mb={3}>
      {MATERIAL_TYPES.map((type) => {
              // V edit modu pro file-based typy: disable všechny karty kromě aktuálního typu
              const isFileBasedType = (t) => ['audio', 'video', 'pdf', 'image', 'document'].includes(t);
              const isDisabled = isEditMode && isFileBasedType(editMaterial?.type) && type.value !== selectedType;

              return (
                <Grid item xs={6} key={type.value}>
                  <Card
                  elevation={0}
  onClick={() => !isDisabled && setSelectedType(type.value)}
  sx={{
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  border: 'none !important',
  outline: 'none !important',
  margin: 0,
  boxShadow: selectedType === type.value 
  ? '0 0 12px 2px rgba(139, 188, 143, 0.6) !important'  // ← Glow kolem dokola
  : '0 2px 8px rgba(0, 0, 0, 0.15) !important',
    transition: 'all 0.2s',
    opacity: isDisabled ? 0.4 : 1,
    '&:hover': !isDisabled ? {
      boxShadow: selectedType === type.value
        ? '0 0 0 2px rgba(139, 188, 143, 0.6), 0 6px 16px rgba(139, 188, 143, 0.25)'
        : '0 4px 12px rgba(0, 0, 0, 0.12)',
      transform: 'translateY(-2px)',
    } : {},
  }}
>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Box color={selectedType === type.value ? 'primary.main' : 'text.secondary'}>
                        {type.icon}
                      </Box>
                      <Typography
                        variant="body2"
                        mt={1}
                        sx={{
                          fontWeight: selectedType === type.value ? 600 : 400,
                          color: selectedType === type.value ? 'primary.main' : 'text.primary',
                        }}
                      >
                        {type.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Krok 2: Upload/Input podle typu */}
          {selectedType && (
            <>
              {/* File upload (audio, video, pdf, image, document) */}
              {(selectedType === 'audio' || selectedType === 'video' || selectedType === 'pdf' || selectedType === 'image' || selectedType === 'document') && (
                <>
                  <Typography variant="subtitle2" mb={2} sx={{ fontWeight: 600 }}>
                    {isEditMode && !file ? 'Nahraný soubor' : 'Nahrát soubor'}
                  </Typography>

                  {/* Info o existujícím souboru při editaci */}
                  {isEditMode && !file && (
                    <Box
                      p={2}
                      mb={2}
                      sx={{
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(143, 188, 143, 0.1)'
                            : 'rgba(85, 107, 47, 0.05)',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        ✓ Soubor je již nahraný
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Pokud chceš nahradit soubor, přetáhni sem nový nebo klikni níže
                      </Typography>
                    </Box>
                  )}

                  <Box
                    sx={{
                      border: '2px dashed',
                      borderColor: dragActive ? 'primary.main' : 'divider',
                      borderRadius: 2,
                      p: 4,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: (theme) =>
                        dragActive
                          ? theme.palette.mode === 'dark'
                            ? 'rgba(143, 188, 143, 0.1)'
                            : 'rgba(85, 107, 47, 0.05)'
                          : 'transparent',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(143, 188, 143, 0.05)'
                            : 'rgba(85, 107, 47, 0.02)',
                      },
                      mb: 2,
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      accept={getAcceptString(selectedType)}
                      onChange={handleFileSelect}
                    />
                    <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" gutterBottom>
                      Přetáhni soubor sem nebo klikni pro výběr
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {getFileTypeHint(selectedType)}
                    </Typography>
                  </Box>

                  {file && (
                    <Box
                      p={2}
                      mb={3}
                      sx={{
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(143, 188, 143, 0.1)'
                            : 'rgba(85, 107, 47, 0.05)',
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2">
                        ✓ {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </Typography>
                    </Box>
                  )}
                </>
              )}

              {/* Link input */}
              {selectedType === 'link' && (
                <>
                  <Typography variant="subtitle2" mb={2} sx={{ fontWeight: 600 }}>
                    Odkaz na materiál
                  </Typography>

                  <TextField
  fullWidth
  label="URL adresa"
  placeholder="https://youtube.com/watch?v=..."
  value={linkUrl}
  onChange={(e) => {
    const url = e.target.value;
    setLinkUrl(url);

    // Auto-detect typ služby
    if (isValidUrl(url)) {
      const detected = detectLinkType(url);
      setDetectedService(detected);

      // Pokud má embed support, načti náhled
      if (detected.embedSupport) {
        const embedUrl = getEmbedUrl(url, detected.type);
        setPreviewUrl(embedUrl);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setDetectedService(null);
      setPreviewUrl(null);
    }
  }}
  margin="normal"
  error={linkUrl && !isValidUrl(linkUrl)}
  helperText={
    linkUrl && !isValidUrl(linkUrl)
      ? 'Zadej platnou URL adresu'
      : 'Podporuje YouTube, Spotify, Google Drive, iCloud a další'
  }
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderWidth: '1px',
        borderColor: 'divider',
      },
      '&:hover fieldset': {
        borderColor: 'primary.main',
        borderWidth: '1px',
      },
      '&.Mui-focused fieldset': {
        borderWidth: '1px',
        borderColor: 'primary.main',
      },
    },
  }}
  InputProps={{
    startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />,
  }}
/>

                  {/* Detected service badge */}
                  {detectedService && (
                    <Box
  sx={{
    mt: 3,
    p: 3,
    borderRadius: 3,
    background: `linear-gradient(135deg, ${detectedService.color}15, ${detectedService.color}05)`,
    boxShadow: `0 4px 16px ${detectedService.color}20, 0 0 0 1px ${detectedService.color}15`,  // ← Jemný glow
  }}
>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Box
                          sx={{
                            fontSize: 40,
                            width: 60,
                            height: 60,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: `${detectedService.color}20`,
                          }}
                        >
                          {detectedService.icon}
                        </Box>
                        <Box flexGrow={1}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: detectedService.color }}>
                            {detectedService.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Služba byla automaticky rozpoznána
                          </Typography>
                        </Box>
                        {detectedService.embedSupport && (
                          <Chip
                            label="Náhled podporován"
                            size="small"
                            sx={{
                              bgcolor: `${detectedService.color}30`,
                              color: detectedService.color,
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>

                      {/* Preview pro embed-podporované služby */}
                      {previewUrl && detectedService.embedSupport && (
                        <Box
                          sx={{
                            position: 'relative',
                            aspectRatio: detectedService.type === 'spotify' ? 'auto' : '16/9',
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: 3,
                            background: '#000',
                          }}
                        >
                          <iframe
                            width="100%"
                            height={detectedService.type === 'spotify' ? '352px' : '100%'}
                            src={previewUrl}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ display: 'block' }}
                            title="Link preview"
                          />
                        </Box>
                      )}

                      {/* Info pro služby bez embed supportu */}
                      {!detectedService.embedSupport && (
                        <Alert
  severity="info"
  sx={{
    bgcolor: 'transparent',
    border: 'none',
    boxShadow: `0 2px 8px ${detectedService.color}15`,
    '& .MuiAlert-icon': {
      color: detectedService.color,
    },
  }}
>
                          <Typography variant="body2">
                            Klientky budou přesměrovány na {detectedService.label} po kliknutí na odkaz.
                          </Typography>
                        </Alert>
                      )}
                    </Box>
                  )}
                </>
              )}

              {/* Text input */}
              {selectedType === 'text' && (
                <TextField
                  fullWidth
                  label="Textový obsah"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  multiline
                  rows={6}
                  margin="normal"
                  required
                />
              )}

              {/* Krok 3: Metadata */}
              <TextField
                fullWidth
                label="Název materiálu"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Popis"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                margin="normal"
                multiline
                rows={3}
                placeholder="Krátký popis materiálu..."
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Kategorie</InputLabel>
                <Select value={category} label="Kategorie" onChange={(e) => setCategory(e.target.value)}>
                  <MenuItem value="meditation">🧘‍♀️ Meditace</MenuItem>
                  <MenuItem value="affirmation">💫 Afirmace</MenuItem>
                  <MenuItem value="exercise">💪 Cvičení</MenuItem>
                  <MenuItem value="reflection">📝 Reflexe</MenuItem>
                  <MenuItem value="other">📦 Ostatní</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </Box>

        {/* Action buttons */}
        <Box display="flex" gap={2} mt={3}>
          <Button onClick={handleClose} fullWidth disabled={loading}>
            Zrušit
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            fullWidth
            disabled={!canSave() || loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Ukládám...' : (isEditMode ? 'Uložit změny' : 'Uložit materiál')}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AddMaterialModal;
