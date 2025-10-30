import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import MaterialSelector from './MaterialSelector';
import { getCurrentUser, saveProgram, getMaterialById } from '../../utils/storage';
import { generateUUID, generateShareCode, generateQRCode } from '../../utils/generateCode';
import { useNotification } from '@shared/context/NotificationContext';
import { useTheme } from '@mui/material';
import { createBackdrop, createGlassDialog } from '../../../../shared/styles/modernEffects';

const DURATION_OPTIONS = [7, 14, 21, 30];

const ProgramEditor = ({ open, onClose, onSuccess, program }) => {
  const currentUser = getCurrentUser();
  const isEditing = Boolean(program);
  const { showSuccess, showError } = useNotification();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Step 1 - Basic info
  const [activeStep, setActiveStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(7);

  // Step 2 - Days
  const [days, setDays] = useState([]);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-save
  const autoSaveTimeoutRef = useRef(null);
  const draftKey = `draft_program_${program?.id || 'new'}`;

  // Save draft to localStorage
  const saveDraft = useCallback(() => {
    const draftData = {
      title,
      description,
      duration,
      days,
      programId: program?.id,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(draftKey, JSON.stringify(draftData));
    showSuccess('Auto-save', 'Změny uloženy ✓');
  }, [title, description, duration, days, draftKey, program?.id, showSuccess]);

  // Load draft from localStorage
  const loadDraft = useCallback(() => {
    const draft = localStorage.getItem(draftKey);
    if (draft) {
      try {
        const draftData = JSON.parse(draft);
        // Only load if draft is recent (less than 24 hours old)
        const draftAge = new Date() - new Date(draftData.timestamp);
        if (draftAge < 24 * 60 * 60 * 1000) {
          return draftData;
        }
      } catch (e) {
        console.error('Failed to parse draft:', e);
      }
    }
    return null;
  }, [draftKey]);

  // Clear draft
  const clearDraft = useCallback(() => {
    localStorage.removeItem(draftKey);
  }, [draftKey]);

  // Initialize form when editing
  useEffect(() => {
    if (program) {
      setTitle(program.title || '');
      setDescription(program.description || '');
      setDuration(program.duration || 7);
      setDays(program.days || []);
      setActiveStep(0);
    } else {
      // Reset form and create days for new program
      setTitle('');
      setDescription('');
      const initialDuration = 7;
      setDuration(initialDuration);

      // Create days immediately for new program
      const newDays = Array.from({ length: initialDuration }, (_, index) => ({
        dayNumber: index + 1,
        title: '',
        description: '',
        materialIds: [],
        instruction: '',
      }));
      setDays(newDays);
      setActiveStep(0);
    }
    setError('');
  }, [program, open]);

  // Update days when duration changes (for both new and editing)
  useEffect(() => {
    if (duration > 0 && open) {
      setDays((prevDays) => {
        // If duration increases: add new empty days at the end
        // If duration decreases: remove days from the end
        // Always preserve existing day data
        const newDays = Array.from({ length: duration }, (_, index) => ({
          dayNumber: index + 1,
          title: prevDays[index]?.title || '',
          description: prevDays[index]?.description || '',
          materialIds: prevDays[index]?.materialIds || [],
          instruction: prevDays[index]?.instruction || '',
        }));
        return newDays;
      });
    }
  }, [duration, open]);

  // Auto-save: Debounced save to localStorage (5 seconds after last change)
  useEffect(() => {
    if (!open || !title) return; // Don't auto-save if modal is closed or no title yet

    // Clear previous timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for 5 seconds
    autoSaveTimeoutRef.current = setTimeout(() => {
      saveDraft();
    }, 5000);

    // Cleanup
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [title, description, duration, days, open, saveDraft]);

  const handleNext = () => {
    // Validace Step 1
    if (activeStep === 0) {
      if (!title.trim()) {
        const errorMsg = 'Název programu je povinný';
        setError(errorMsg);
        showError('Chyba validace', errorMsg);
        return;
      }
      if (!description.trim()) {
        const errorMsg = 'Popis programu je povinný';
        setError(errorMsg);
        showError('Chyba validace', errorMsg);
        return;
      }
      setError('');
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  const updateDay = (index, field, value) => {
    const newDays = [...days];
    newDays[index] = { ...newDays[index], [field]: value };
    setDays(newDays);
  };

  const openMaterialSelector = (dayIndex) => {
    setSelectedDayIndex(dayIndex);
    setSelectorOpen(true);
  };

  const handleMaterialsSelected = (selectedMaterialIds) => {
    if (selectedDayIndex !== null) {
      updateDay(selectedDayIndex, 'materialIds', selectedMaterialIds);
    }
    setSelectorOpen(false);
    setSelectedDayIndex(null);
  };

  const removeMaterial = (dayIndex, materialId) => {
    const newMaterialIds = days[dayIndex].materialIds.filter(id => id !== materialId);
    updateDay(dayIndex, 'materialIds', newMaterialIds);
  };

  const handleSave = async () => {
    setError('');
    setLoading(true);

    try {
      // Validace - přidat default názvy pro dny bez názvu
      const processedDays = days.map((day, index) => ({
        ...day,
        title: day.title.trim() || `Den ${index + 1}`,
      }));

      let shareCode = program?.shareCode;
      let qrCode = program?.qrCode;

      // Generuj share code a QR jen pro nové programy
      if (!isEditing) {
        shareCode = generateShareCode();
        qrCode = await generateQRCode(shareCode);
      }

      const programData = {
        id: program?.id || generateUUID(),
        coachId: currentUser.id,
        title,
        description,
        duration,
        shareCode,
        qrCode,
        days: processedDays,
        isActive: program?.isActive !== undefined ? program.isActive : true,
        createdAt: program?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      saveProgram(programData);

      // Clear draft after successful save
      clearDraft();

      showSuccess(
        'Hotovo!',
        isEditing ? 'Program byl úspěšně upraven' : 'Program byl úspěšně vytvořen'
      );
      onSuccess(programData);
    } catch (err) {
      const errorMsg = err.message || 'Něco se pokazilo. Zkus to znovu.';
      setError(errorMsg);
      showError('Chyba', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const steps = ['Základní informace', 'Nastavení dnů'];

  return (
    <>
      <Dialog
  open={open}
  onClose={handleClose}
  maxWidth="md"
  fullWidth
  fullScreen={window.innerWidth < 600}
  BackdropProps={{ sx: createBackdrop() }}
  PaperProps={{ sx: createGlassDialog(isDark, '20px') }}
>
        <DialogContent sx={{ p: 0 }}>
          {/* Header */}
          <Box
            p={3}
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {isEditing ? 'Upravit program' : 'Vytvořit nový program'}
            </Typography>

            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ mt: 3 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Error */}
          {error && (
            <Box px={3} pt={2}>
              <Alert severity="error" onClose={() => setError('')}>
                {error}
              </Alert>
            </Box>
          )}

          {/* Content */}
          <Box p={3} sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {/* Step 1: Basic info */}
            {activeStep === 0 && (
              <Box>
                <TextField
                  fullWidth
                  label="Název programu"
                  placeholder="např. 7 dní k sebevědomí"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  margin="normal"
                  required
                />

                <TextField
                  fullWidth
                  label="Popis"
                  placeholder="Co účastnice v programu čeká..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  multiline
                  rows={4}
                  margin="normal"
                  required
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel>Délka programu</InputLabel>
                  <Select value={duration} label="Délka programu" onChange={(e) => setDuration(e.target.value)}>
                    {DURATION_OPTIONS.map((days) => (
                      <MenuItem key={days} value={days}>
                        {days} dní
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {isEditing && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Můžeš změnit délku programu. Existující dny zůstanou zachovány, nové dny budou přidány na konec.
                  </Alert>
                )}
              </Box>
            )}

            {/* Step 2: Days */}
            {activeStep === 1 && (
              <Box>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Nastav obsah pro každý den programu. Přidej materiály a instrukce pro své klientky.
                </Typography>

                {days.map((day, index) => (
                  <Accordion key={index} defaultExpanded={index === 0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box display="flex" alignItems="center" gap={2} width="100%">
                        <Chip label={`Den ${day.dayNumber}`} color="primary" size="small" />
                        <Typography sx={{ flexGrow: 1 }}>
                          {day.title || 'Název dne'}
                        </Typography>
                        {day.materialIds.length > 0 && (
                          <Chip
                            label={`${day.materialIds.length} ${day.materialIds.length === 1 ? 'materiál' : 'materiály'}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </AccordionSummary>

                    <AccordionDetails>
                      <TextField
                        fullWidth
                        label="Název dne"
                        placeholder="např. Den 1: Uvědomění"
                        value={day.title}
                        onChange={(e) => updateDay(index, 'title', e.target.value)}
                        margin="normal"
                        required
                      />

                      <TextField
                        fullWidth
                        label="Popis dne"
                        placeholder="Co dnes klientku čeká..."
                        value={day.description}
                        onChange={(e) => updateDay(index, 'description', e.target.value)}
                        multiline
                        rows={2}
                        margin="normal"
                      />

                      <Typography variant="subtitle2" mt={2} mb={1}>
                        Materiály pro tento den
                      </Typography>

                      {/* Selected materials */}
                      <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                        {day.materialIds.map((matId) => {
                          const material = getMaterialById(matId);
                          if (!material) return null;
                          return (
                            <Chip
                              key={matId}
                              label={material.title}
                              onDelete={() => removeMaterial(index, matId)}
                              size="small"
                            />
                          );
                        })}
                      </Box>

                      <Button
                        startIcon={<AddIcon />}
                        onClick={() => openMaterialSelector(index)}
                        variant="outlined"
                        size="small"
                      >
                        {day.materialIds.length > 0 ? 'Upravit materiály' : 'Přidat materiály'}
                      </Button>

                      <TextField
                        fullWidth
                        label="Instrukce pro klientku"
                        placeholder="např. Dnes si ráno pusť meditaci a večer si přečti afirmace..."
                        value={day.instruction}
                        onChange={(e) => updateDay(index, 'instruction', e.target.value)}
                        multiline
                        rows={2}
                        margin="normal"
                      />
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
          </Box>

          {/* Actions */}
          <Box
            p={3}
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Button onClick={handleClose} disabled={loading}>
              Zrušit
            </Button>

            <Box display="flex" gap={2}>
              {activeStep > 0 && (
                <Button onClick={handleBack} disabled={loading}>
                  Zpět
                </Button>
              )}

              {activeStep < steps.length - 1 ? (
                <Button variant="contained" onClick={handleNext}>
                  Pokračovat
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} />}
                >
                  {loading ? 'Ukládám...' : isEditing ? 'Uložit změny' : 'Vytvořit program'}
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Material Selector */}
      <MaterialSelector
        open={selectorOpen}
        onClose={() => {
          setSelectorOpen(false);
          setSelectedDayIndex(null);
        }}
        selectedMaterialIds={selectedDayIndex !== null ? days[selectedDayIndex]?.materialIds : []}
        onConfirm={handleMaterialsSelected}
        dayNumber={selectedDayIndex !== null ? days[selectedDayIndex]?.dayNumber : null}
      />
    </>
  );
};

export default ProgramEditor;
