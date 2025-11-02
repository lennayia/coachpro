import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  Box,
  Typography,
  useTheme,
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
  Autocomplete,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
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
import { createBackdrop, createGlassDialog } from '../../../../shared/styles/modernEffects';
import BORDER_RADIUS from '@styles/borderRadius';
import { COACHING_AREAS, TOPICS, COACHING_STYLES, COACHING_AUTHORITIES, getAreaLabel, getAreaIcon, getStyleLabel, getAuthorityLabel } from '@shared/constants/coachingTaxonomy';

const MATERIAL_TYPES = [
  { value: 'audio', label: 'Audio', icon: <AudioIcon sx={{ fontSize: 32 }} /> },
  { value: 'video', label: 'Video', icon: <VideoIcon sx={{ fontSize: 32 }} /> },
  { value: 'pdf', label: 'PDF', icon: <PdfIcon sx={{ fontSize: 32 }} /> },
  { value: 'image', label: 'Obrázek', icon: <ImageIcon sx={{ fontSize: 32 }} /> },
  { value: 'document', label: 'Dokument', icon: <DocumentIcon sx={{ fontSize: 32 }} /> },
  { value: 'text', label: 'Text', icon: <TextIcon sx={{ fontSize: 32 }} /> },
  { value: 'link', label: 'Odkaz', icon: <LinkIcon sx={{ fontSize: 32 }} /> },
];

const AddMaterialModal = ({ open, onClose, onSuccess, editMaterial = null }) => {
  const currentUser = getCurrentUser();
  const fileInputRef = useRef(null);
  const isEditMode = Boolean(editMaterial);
  const { showSuccess, showError } = useNotification();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

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

  // Taxonomy fields (Session 12)
  const [coachingArea, setCoachingArea] = useState('life'); // Default: Životní koučink
  const [topics, setTopics] = useState([]); // Array of topic strings
  const [coachingStyle, setCoachingStyle] = useState(''); // Optional
  const [coachingAuthority, setCoachingAuthority] = useState(''); // Optional

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

      // Taxonomy fields (Session 12)
      setCoachingArea(editMaterial.coachingArea || 'life');
      setTopics(editMaterial.topics || []);
      setCoachingStyle(editMaterial.coachingStyle || '');
      setCoachingAuthority(editMaterial.coachingAuthority || '');

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

    // Reset taxonomy fields (Session 12)
    setCoachingArea('life');
    setTopics([]);
    setCoachingStyle('');
    setCoachingAuthority('');
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

      if (!title) {
        const errorMsg = 'Název materiálu je povinný';
        showError('Chyba validace', errorMsg);
        throw new Error(errorMsg);
      }

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

        // Coaching Taxonomy (Session 12):
        coachingArea, // From state (default: 'life')
        topics, // From state (default: [])
        coachingStyle: coachingStyle || undefined, // From state (optional)
        coachingAuthority: coachingAuthority || undefined, // From state (optional)

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

      saveMaterial(materialData);

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
    <Dialog
  open={open}
  onClose={handleClose}
  maxWidth="lg"
  fullWidth
  BackdropProps={{ sx: createBackdrop() }}
  PaperProps={{
    sx: {
      ...createGlassDialog(isDark),
      maxHeight: '90vh',
    },
  }}
>
      <Box px={3} py={3} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
  {/* Header s X tlačítkem */}
  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
    <Typography variant="h5" sx={{ fontWeight: 700 }}>
      {isEditMode ? 'Upravit materiál' : 'Přidat nový materiál'}
    </Typography>
    <IconButton onClick={handleClose} size="small">
      <CloseIcon />
    </IconButton>
  </Box>

  {error && (
    <Alert severity="error" sx={{ mb: 3, borderRadius: BORDER_RADIUS.compact }} onClose={() => setError('')}>
      {error}
    </Alert>
  )}

  <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1 }}>
    {/* 1. TYP MATERIÁLU - Horizontal row */}
    <Typography variant="subtitle2" mb={2} sx={{ fontWeight: 600 }}>
      Typ materiálu
    </Typography>

    <Box
      display="flex"
      gap={2}
      mb={3}
      sx={{
        overflowX: 'auto',
        pb: 1,
        '&::-webkit-scrollbar': { height: 8 },
        '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 4 }
      }}
    >
      {MATERIAL_TYPES.map((type) => {
        const isFileBasedType = (t) => ['audio', 'video', 'pdf', 'image', 'document'].includes(t);
        const isDisabled = isEditMode && isFileBasedType(editMaterial?.type) && type.value !== selectedType;

        return (
          <Card
            key={type.value}
            elevation={0}
            onClick={() => !isDisabled && setSelectedType(type.value)}
            sx={{
              minWidth: 100,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              border: 'none !important',
              outline: 'none !important',
              boxShadow: selectedType === type.value
                ? '0 0 12px 2px rgba(139, 188, 143, 0.6) !important'
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
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Box color={selectedType === type.value ? 'primary.main' : 'text.secondary'}>
                {type.icon}
              </Box>
              <Typography
                variant="caption"
                mt={1}
                sx={{
                  fontWeight: selectedType === type.value ? 600 : 400,
                  color: selectedType === type.value ? 'primary.main' : 'text.primary',
                  display: 'block'
                }}
              >
                {type.label}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>

    {selectedType && (
      <>
        {/* 2. NÁZEV + KATEGORIE row */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Název materiálu"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Kategorie</InputLabel>
              <Select value={category} label="Kategorie" onChange={(e) => setCategory(e.target.value)}>
                <MenuItem value="meditation">Meditace</MenuItem>
                <MenuItem value="affirmation">Afirmace</MenuItem>
                <MenuItem value="exercise">Cvičení</MenuItem>
                <MenuItem value="reflection">Reflexe</MenuItem>
                <MenuItem value="template">Šablona</MenuItem>
                <MenuItem value="worksheet">Pracovní list</MenuItem>
                <MenuItem value="workbook">Pracovní sešit</MenuItem>
                <MenuItem value="question">Otázky</MenuItem>
                <MenuItem value="feedback">Zpětná vazba</MenuItem>
                <MenuItem value="other">Ostatní</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* 3. POPIS - full width, více řádků */}
        <TextField
          fullWidth
          label="Popis"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={4}
          placeholder="Krátký popis materiálu..."
          sx={{ mb: 3 }}
        />

        {/* 4. DVA SLOUPCE - Upload/Link/Text vlevo, Taxonomy vpravo */}
        <Grid container spacing={3}>
          {/* LEVÝ SLOUPEC - Odkaz na materiál */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Odkaz na materiál
            </Typography>

            {/* File upload (audio, video, pdf, image, document) */}
              {(selectedType === 'audio' || selectedType === 'video' || selectedType === 'pdf' || selectedType === 'image' || selectedType === 'document') && (
                <>
                  {/* Alert při editaci file-based materiálů */}
                  {isEditMode && !file && (
                    <Alert severity="info" sx={{ mb: 2, borderRadius: BORDER_RADIUS.compact }}>
                      Typ materiálu nelze změnit. Můžeš ale nahradit soubor novým.
                    </Alert>
                  )}

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
                        borderRadius: BORDER_RADIUS.card,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        ✓ Soubor je již nahraný
                      </Typography>
                      {editMaterial?.fileName && (
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                          📎 {editMaterial.fileName}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        Pokud chceš nahradit soubor, přetáhni sem nový nebo klikni níže
                      </Typography>
                    </Box>
                  )}

                  <Box
                    sx={{
                      border: '2px dashed',
                      borderColor: dragActive ? 'primary.main' : 'divider',
                      borderRadius: BORDER_RADIUS.card,
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
                        borderRadius: BORDER_RADIUS.small,
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

                  {/* Info o existující URL při editaci */}
                  {isEditMode && editMaterial?.content && (
                    <Box
                      p={2}
                      mb={2}
                      sx={{
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(143, 188, 143, 0.1)'
                            : 'rgba(85, 107, 47, 0.05)',
                        borderRadius: BORDER_RADIUS.card,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        ✓ Aktuální odkaz
                      </Typography>
                      <Typography
                        component="a"
                        href={editMaterial.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          wordBreak: 'break-all',
                          color: 'primary.main',
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        🔗 {editMaterial.content}
                      </Typography>
                      {editMaterial?.linkMeta && (
                        <Chip
                          label={editMaterial.linkMeta.label}
                          size="small"
                          sx={{
                            mt: 1,
                            borderRadius: BORDER_RADIUS.small,
                            backgroundColor: `${editMaterial.linkMeta.color}20`,
                            color: editMaterial.linkMeta.color,
                            fontWeight: 600
                          }}
                        />
                      )}
                      <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                        Pokud chceš změnit odkaz, zadej nový níže
                      </Typography>
                    </Box>
                  )}

                  <TextField
  fullWidth
  label="URL adresa"
  placeholder="https://youtube.com/watch?v=..."
  value={linkUrl}
  onChange={(e) => {
    const url = e.target.value;
    setLinkUrl(url);

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
    borderRadius: BORDER_RADIUS.premium,
    background: (theme) =>
      theme.palette.mode === 'dark'
        ? 'rgba(139, 188, 143, 0.08)'
        : 'rgba(85, 107, 47, 0.05)',
    border: '1px solid',
    borderColor: (theme) =>
      theme.palette.mode === 'dark'
        ? 'rgba(139, 188, 143, 0.15)'
        : 'rgba(85, 107, 47, 0.15)',
  }}
>
                      <Box mb={2}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {detectedService.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Služba byla automaticky rozpoznána
                        </Typography>
                      </Box>

                      {/* Preview pro embed-podporované služby */}
                      {previewUrl && detectedService.embedSupport && (
                        <Box
                          sx={{
                            position: 'relative',
                            aspectRatio: detectedService.type === 'spotify' ? 'auto' : '16/9',
                            borderRadius: BORDER_RADIUS.premium,
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
    borderRadius: BORDER_RADIUS.compact,
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
          </Grid>

        {/* PRAVÝ SLOUPEC - Koučovací taxonomie */}
        <Grid item xs={12} md={6}>
          {selectedType && (
            <>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Koučovací taxonomie
              </Typography>

              {/* Coaching Area */}
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Oblast koučinku</InputLabel>
                <Select
                  value={coachingArea}
                  label="Oblast koučinku"
                  onChange={(e) => setCoachingArea(e.target.value)}
                >
                  {COACHING_AREAS.map((area) => {
                    const AreaIcon = area.icon;
                    return (
                      <MenuItem key={area.value} value={area.value}>
                        <Box display="flex" alignItems="center" gap={1}>
                          {React.createElement(AreaIcon, { size: 16 })}
                          <span>{area.label}</span>
                        </Box>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              {/* Topics - Autocomplete with multi-select */}
              <Autocomplete
                multiple
                fullWidth
                options={TOPICS}
                value={topics}
                onChange={(event, newValue) => setTopics(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Témata"
                    placeholder="Vyber témata (doporučeno 3-5)"
                    margin="normal"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      size="small"
                      {...getTagProps({ index })}
                    />
                  ))
                }
                sx={{ mt: 2 }}
              />

              {/* Coaching Style - Optional */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Koučovací škola/přístup (volitelné)</InputLabel>
                <Select
                  value={coachingStyle}
                  label="Koučovací škola/přístup (volitelné)"
                  onChange={(e) => setCoachingStyle(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Není specifikováno</em>
                  </MenuItem>
                  {COACHING_STYLES.map((style) => (
                    <MenuItem key={style.value} value={style.value}>
                      {style.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Coaching Authority - Optional */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Certifikace/akreditace (volitelné)</InputLabel>
                <Select
                  value={coachingAuthority}
                  label="Certifikace/akreditace (volitelné)"
                  onChange={(e) => setCoachingAuthority(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Není specifikováno</em>
                  </MenuItem>
                  {COACHING_AUTHORITIES.map((authority) => (
                    <MenuItem key={authority.value} value={authority.value}>
                      {authority.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </Grid>
      </Grid>
      </>
    )}
  </Box>

  {/* Action buttons */}
        <Box display="flex" gap={2} mt={3} justifyContent="flex-end">
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: BORDER_RADIUS.compact,
              border: '2px solid',
              borderColor: 'divider',
              color: 'text.primary',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'text.secondary',
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.02)',
              },
            }}
          >
            Zrušit
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!canSave() || loading}
            startIcon={loading && <CircularProgress size={20} />}
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: BORDER_RADIUS.compact,
              position: 'relative',
              overflow: 'hidden',
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(139, 188, 143, 0.95) 0%, rgba(85, 107, 47, 0.9) 100%)'
                  : 'linear-gradient(135deg, rgba(85, 107, 47, 0.95) 0%, rgba(139, 188, 143, 0.9) 100%)',
              boxShadow: '0 4px 12px rgba(85, 107, 47, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                transition: 'left 0.5s ease',
              },
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(85, 107, 47, 0.4)',
                '&::before': {
                  left: '100%',
                },
              },
              '&:disabled': {
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(139, 188, 143, 0.3)'
                    : 'rgba(85, 107, 47, 0.3)',
              },
            }}
          >
            {loading ? 'Ukládám...' : (isEditMode ? 'Uložit změny' : 'Uložit materiál')}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AddMaterialModal;
