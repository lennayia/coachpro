import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  LinearProgress,
  Card,
  CardContent,
  Button,
  Alert,
  AlertTitle,
  Stack,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  TextField,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckIcon,
  ArrowForward as NextIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import {
  Headphones,
  Video,
  FileText,
  Image as ImageLucide,
  FileSpreadsheet,
  Type,
  Link2,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import MoodCheck from './MoodCheck';
import ProgressGarden from './ProgressGarden';
import CustomAudioPlayer from '../shared/CustomAudioPlayer';
import PDFViewer from '../shared/PDFViewer';
import DocumentViewer from '../shared/DocumentViewer';
import CelebrationModal from './CelebrationModal';
import MaterialFeedbackModal from './MaterialFeedbackModal';
import ProgramEndFeedbackModal from './ProgramEndFeedbackModal';
import {
  getCurrentClient,
  setCurrentClient,
  saveClient,
  getProgramById,
  getMaterialById,
  addMaterialFeedback,
  addProgramFeedback,
} from '../../utils/storage';
import { getIconByType } from '@shared/utils/helpers';
import { fadeIn, fadeInUp } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import { getEmbedUrl } from '../../utils/linkDetection';
import useModernEffects from '@shared/hooks/useModernEffects';
import { createIconButtonHover, createOutlinedButton } from '../../../../shared/styles/modernEffects';

const DailyView = () => {
  const { presets, isDarkMode } = useModernEffects();
  const navigate = useNavigate();
  const { width, height } = useWindowSize();

  const [client, setClient] = useState(null);
  const [program, setProgram] = useState(null);
  const [currentDayData, setCurrentDayData] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [moodChecked, setMoodChecked] = useState(false);
  const [dayCompleted, setDayCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [viewingDay, setViewingDay] = useState(null); // For reviewing past days
  const [programNotes, setProgramNotes] = useState('');
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackMaterial, setFeedbackMaterial] = useState(null);
  const [programEndFeedbackOpen, setProgramEndFeedbackOpen] = useState(false);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      const loadedClient = getCurrentClient();
      if (!loadedClient) {
        navigate('/client');
        return;
      }

      // Check if this is a preview with embedded program data
      const loadedProgram = loadedClient._previewProgram || await getProgramById(loadedClient.programId);
      if (!loadedProgram) {
        navigate('/client');
        return;
      }

      setClient(loadedClient);
      setProgram(loadedProgram);

      // Get day data (either current day or viewing day)
      const dayToShow = viewingDay || loadedClient.currentDay;
      const dayData = loadedProgram.days?.[dayToShow - 1];

      if (!dayData) {
        console.error('Day data not found for day', dayToShow);
        navigate('/client');
        return;
      }

      setCurrentDayData(dayData);

      // Load materials
      const materialPromises = (dayData.materialIds || []).map((id) => getMaterialById(id));
      const loadedMaterials = await Promise.all(materialPromises);
      setMaterials(loadedMaterials.filter(Boolean));

      // Check mood and completion status
      setMoodChecked(
        (loadedClient.moodLog || []).some((m) => m.day === dayToShow)
      );
      setDayCompleted((loadedClient.completedDays || []).includes(dayToShow));
    };

    loadData();
  }, [navigate, viewingDay]);

  const handleMoodSelected = async (mood) => {
    const updatedClient = {
      ...client,
      moodLog: [
        ...client.moodLog,
        {
          day: client.currentDay,
          mood,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    await saveClient(updatedClient);
    setClient(updatedClient);
    setMoodChecked(true);
  };

  const handleCompleteDay = async () => {
    if (!client || dayCompleted) return;

    const updatedClient = { ...client };

    // Add to completed days
    if (!updatedClient.completedDays.includes(client.currentDay)) {
      updatedClient.completedDays.push(client.currentDay);
    }

    // Update streak
    const yesterday = client.currentDay - 1;
    if (yesterday === 0 || updatedClient.completedDays.includes(yesterday)) {
      updatedClient.streak += 1;
      if (updatedClient.streak > updatedClient.longestStreak) {
        updatedClient.longestStreak = updatedClient.streak;
      }
    } else {
      updatedClient.streak = 1;
    }

    // Check if it's the last day
    if (client.currentDay === program.duration) {
      updatedClient.completedAt = new Date().toISOString();
      setCelebrationOpen(true);
      // Trigger program end feedback modal after celebration
      setProgramEndFeedbackOpen(true);
    }

    await saveClient(updatedClient);
    setClient(updatedClient);
    setDayCompleted(true);

    // Show confetti
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const handleNextDay = async () => {
    if (!client || client.currentDay >= program.duration) return;

    const updatedClient = {
      ...client,
      currentDay: client.currentDay + 1,
    };

    await saveClient(updatedClient);
    setCurrentClient(updatedClient); // Update session storage
    window.location.reload(); // Reload to show next day
  };

  const handleOpenFeedback = (material) => {
    if (!viewingDay) {
      setFeedbackMaterial(material);
      setFeedbackModalOpen(true);
    }
  };

  const handleSaveFeedback = async (feedback) => {
    if (!feedbackMaterial) return;

    try {
      await addMaterialFeedback(feedbackMaterial.id, feedback);

      // Reload materials to show updated feedback
      const dayData = program.days?.[client.currentDay - 1];
      const materialPromises = (dayData.materialIds || []).map((id) => getMaterialById(id));
      const loadedMaterials = await Promise.all(materialPromises);
      setMaterials(loadedMaterials.filter(Boolean));
    } catch (error) {
      console.error('Failed to save feedback:', error);
      throw error; // Let modal handle error display
    }
  };

  const handleSaveProgramFeedback = async (feedback) => {
    if (!program) return;

    try {
      await addProgramFeedback(program.id, feedback);

      // Reload program to show updated feedback
      const updatedProgram = await getProgramById(program.id);
      setProgram(updatedProgram);
    } catch (error) {
      console.error('Failed to save program feedback:', error);
      throw error; // Let modal handle error display
    }
  };

  const handleBack = () => {
    navigate('/client');
  };

  // Open material in new tab (same as PreviewModal)
  const handleOpenMaterialInNewTab = (material) => {
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

      case 'text':
        previewWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${material.title}</title>
              <meta charset="UTF-8">
              <style>${baseStyles} .text-content { white-space: pre-wrap; line-height: 1.6; }</style>
            </head>
            <body>
              <div class="container">
                <h1>📝 ${material.title}</h1>
                <div class="text-content">${material.content}</div>
              </div>
            </body>
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

  if (!client || !program || !currentDayData) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography>Načítám...</Typography>
      </Box>
    );
  }

  const progressPercent = (client.currentDay / program.duration) * 100;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {/* Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          ...presets.navbar(),
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton edge="start" onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
            <img
              src="/coachPro.png"
              alt="CoachPro"
              style={{
                height: '40px',
                width: 'auto',
              }}
            />
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.2,
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #8FBC8F 0%, #556B2F 100%)'
                      : 'linear-gradient(135deg, #556B2F 0%, #228B22 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                CoachPro
              </Typography>
            </Box>

            {/* Admin режim indikátor + exit button */}
            {client?.isAdmin && (
              <Button
                size="medium"
                variant="outlined"
                onClick={() => navigate(client._returnUrl || '/coach/programs')}
                startIcon={<Eye size={14} />}
                sx={{
                  ml: 2,
                  px: 3,
                  py: 1,
                  ...createOutlinedButton(isDarkMode),
                }}
              >
                Admin
              </Button>
            )}
          </Box>

          <Box sx={{ minWidth: 150, textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Den {viewingDay || client.currentDay} z {program.duration}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{
                height: 6,
                borderRadius: BORDER_RADIUS.minimal,
                mt: 0.5,
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: 'primary.main',
                }
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <motion.div variants={fadeIn} initial="hidden" animate="visible">
          {/* Viewing mode navigation */}
          {viewingDay && (
            <Card sx={{ mb: 3, bgcolor: 'primary.main', color: 'white', borderRadius: BORDER_RADIUS.card }}>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="body2" textAlign="center">
                    Prohlížíš si den {viewingDay} z {program.duration}
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="center">
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={viewingDay === 1}
                      onClick={() => setViewingDay(viewingDay - 1)}
                      sx={{ color: 'white', borderColor: 'white', '&:disabled': { color: 'grey.400', borderColor: 'grey.400' } }}
                    >
                      Předchozí
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={viewingDay === program.duration}
                      onClick={() => setViewingDay(viewingDay + 1)}
                      sx={{ color: 'white', borderColor: 'white', '&:disabled': { color: 'grey.400', borderColor: 'grey.400' } }}
                    >
                      Další
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => setViewingDay(null)}
                      sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                    >
                      Ukončit prohlížení
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Mood check - only if program not completed and not in viewing mode */}
          {!moodChecked && !viewingDay && client.currentDay < program.duration && (
            <MoodCheck onMoodSelected={handleMoodSelected} />
          )}

          {/* Day header */}
          <Card sx={{ mb: 3, textAlign: 'center', borderRadius: BORDER_RADIUS.dayHeader }}>
            <CardContent sx={{ py: 4 }}>
              <Typography variant="overline" color="text.secondary">
                Den {viewingDay || client.currentDay}
              </Typography>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                {currentDayData.title}
              </Typography>
              {currentDayData.description && (
                <Typography variant="body1" color="text.secondary">
                  {currentDayData.description}
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          {currentDayData.instruction && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>Dnešní instrukce</AlertTitle>
              {currentDayData.instruction}
            </Alert>
          )}

          {/* Materials */}
          <Stack spacing={3} mb={4}>
            {materials.map((material, index) => (
              <motion.div
                key={material.id}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <Card sx={{ borderRadius: BORDER_RADIUS.dayHeader }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Box sx={{ color: 'text.secondary' }}>
                        {(() => {
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
                              return <Link2 size={32} strokeWidth={1.5} />;
                            default:
                              return <Link2 size={32} strokeWidth={1.5} />;
                          }
                        })()}
                      </Box>
                      <Box flexGrow={1}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {material.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {material.description}
                        </Typography>
                      </Box>

                      {/* Otevřít v nové kartě */}
                      <IconButton
                        size="small"
                        onClick={() => {
                          if (material.type === 'link') {
                            // Pro linky otevři přímo URL
                            window.open(material.content, '_blank', 'noopener,noreferrer');
                          } else {
                            // Pro ostatní typy použij handleOpenMaterialInNewTab
                            handleOpenMaterialInNewTab(material);
                          }
                        }}
                        title="Otevřít v nové kartě"
                        sx={{
                          color: 'primary.main',
                          ...createIconButtonHover('primary', isDarkMode),
                        }}
                      >
                        <OpenInNewIcon />
                      </IconButton>
                    </Box>

                    {/* Render by type */}
                    {material.type === 'audio' && (
                      <>
                        <CustomAudioPlayer
                          src={material.content}
                          title={material.title}
                          onEnded={() => handleOpenFeedback(material)}
                        />
                        {!viewingDay && (
                          <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleOpenFeedback(material)}
                              sx={{
                                borderRadius: BORDER_RADIUS.compact,
                                textTransform: 'none',
                              }}
                            >
                              💬 Napsat reflexi
                            </Button>
                          </Box>
                        )}
                      </>
                    )}

                    {material.type === 'video' && (
                      <>
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
                        {!viewingDay && (
                          <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleOpenFeedback(material)}
                              sx={{
                                borderRadius: BORDER_RADIUS.compact,
                                textTransform: 'none',
                              }}
                            >
                              💬 Napsat reflexi
                            </Button>
                          </Box>
                        )}
                      </>
                    )}

                    {material.type === 'image' && (
                      <>
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
                        {!viewingDay && (
                          <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleOpenFeedback(material)}
                              sx={{
                                borderRadius: BORDER_RADIUS.compact,
                                textTransform: 'none',
                              }}
                            >
                              💬 Napsat reflexi
                            </Button>
                          </Box>
                        )}
                      </>
                    )}

                    {material.type === 'pdf' && (
                      <>
                        <PDFViewer src={material.content} title={material.title} />
                        {!viewingDay && (
                          <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleOpenFeedback(material)}
                              sx={{
                                borderRadius: BORDER_RADIUS.compact,
                                textTransform: 'none',
                              }}
                            >
                              💬 Napsat reflexi
                            </Button>
                          </Box>
                        )}
                      </>
                    )}

                    {material.type === 'document' && (
                      <>
                        <DocumentViewer src={material.content} title={material.title} />
                        {!viewingDay && (
                          <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleOpenFeedback(material)}
                              sx={{
                                borderRadius: BORDER_RADIUS.compact,
                                textTransform: 'none',
                              }}
                            >
                              💬 Napsat reflexi
                            </Button>
                          </Box>
                        )}
                      </>
                    )}

                    {material.type === 'text' && (
                      <>
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
                        {!viewingDay && (
                          <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleOpenFeedback(material)}
                              sx={{
                                borderRadius: BORDER_RADIUS.compact,
                                textTransform: 'none',
                              }}
                            >
                              💬 Napsat reflexi
                            </Button>
                          </Box>
                        )}
                      </>
                    )}

                    {material.type === 'link' && (
                      <>
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

                        {/* Ostatní služby - tlačítko pro otevření */}
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
                        {!viewingDay && (
                          <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleOpenFeedback(material)}
                              sx={{
                                borderRadius: BORDER_RADIUS.compact,
                                textTransform: 'none',
                              }}
                            >
                              💬 Napsat reflexi
                            </Button>
                          </Box>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Stack>

          {/* Complete day button / Program completion */}
          {!viewingDay && client.currentDay === program.duration && dayCompleted ? (
            // Program completed - show completion summary
            <Card
              elevation={0}
              sx={{
                mb: 4,
                ...presets.glassCard('normal'),
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  py: 6,
                  px: 4,
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="h3"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: 'text.primary',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Program dokončen
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: 'primary.main',
                  }}
                >
                  {program.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}>
                  Prošla jsi celým {program.duration}-denním programem. Skvělá práce.
                </Typography>

                {client.streak > 1 && (
                  <Box
                    sx={{
                      mt: 4,
                      p: 3,
                      ...presets.glassCard('subtle'),
                      borderRadius: BORDER_RADIUS.streakBox,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontWeight: 600,
                      }}
                    >
                      Aktuální série
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 700,
                        color: 'primary.main',
                        mt: 1,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {client.streak}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {client.streak === 1 ? 'den' : client.streak < 5 ? 'dny' : 'dní'} v řadě
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ p: 3, pt: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleBack}
                  sx={{
                    px: 5,
                    py: 1.75,
                    borderRadius: BORDER_RADIUS.standard,
                    fontWeight: 600,
                    textTransform: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    backdropFilter: 'blur(30px)',
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(139, 188, 143, 0.95) 0%, rgba(85, 107, 47, 0.9) 100%)'
                        : 'linear-gradient(135deg, rgba(85, 107, 47, 0.95) 0%, rgba(139, 188, 143, 0.9) 100%)',
                    border: '1px solid',
                    borderColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(139, 188, 143, 0.5)'
                        : 'rgba(85, 107, 47, 0.6)',
                    boxShadow: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '0 8px 32px rgba(139, 188, 143, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                        : '0 8px 32px rgba(85, 107, 47, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                      transition: 'left 0.6s ease-in-out',
                    },
                    '&:hover': {
                      transform: 'translateY(-4px) scale(1.02)',
                      boxShadow: (theme) =>
                        theme.palette.mode === 'dark'
                          ? '0 12px 48px rgba(139, 188, 143, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                          : '0 12px 48px rgba(85, 107, 47, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                      borderColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(139, 188, 143, 0.8)'
                          : 'rgba(85, 107, 47, 0.8)',
                      '&::before': {
                        left: '100%',
                      },
                    },
                    '&:active': {
                      transform: 'translateY(-2px) scale(0.98)',
                    },
                  }}
                >
                  Zpět na výběr programu
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => setViewingDay(1)}
                  sx={{
                    px: 5,
                    py: 1.75,
                    borderRadius: BORDER_RADIUS.standard,
                    fontWeight: 500,
                    textTransform: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    backdropFilter: 'blur(30px)',
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(255, 255, 255, 0.6)',
                    borderWidth: 2,
                    borderColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.2)'
                        : 'rgba(0, 0, 0, 0.15)',
                    color: 'text.primary',
                    boxShadow: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        : '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      background: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'radial-gradient(circle at center, rgba(139, 188, 143, 0.15) 0%, transparent 70%)'
                          : 'radial-gradient(circle at center, rgba(85, 107, 47, 0.1) 0%, transparent 70%)',
                      opacity: 0,
                      transition: 'opacity 0.4s',
                    },
                    '&:hover': {
                      transform: 'translateY(-4px) scale(1.02)',
                      borderWidth: 2,
                      borderColor: 'primary.main',
                      background: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(139, 188, 143, 0.15)'
                          : 'rgba(85, 107, 47, 0.12)',
                      boxShadow: (theme) =>
                        theme.palette.mode === 'dark'
                          ? '0 8px 32px rgba(139, 188, 143, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                          : '0 8px 32px rgba(85, 107, 47, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                      '&::before': {
                        opacity: 1,
                      },
                    },
                    '&:active': {
                      transform: 'translateY(-2px) scale(0.98)',
                    },
                  }}
                >
                  Prohlédnout si program znovu
                </Button>
              </Box>
            </Card>
          ) : !viewingDay && !dayCompleted ? (
            <Box display="flex" justifyContent="center" mb={4}>
              <Button
                variant="contained"
                size="large"
                startIcon={<CheckIcon />}
                onClick={handleCompleteDay}
                sx={{
                  px: 5,
                  py: 1.75,
                  fontWeight: 600,
                  textTransform: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(30px)',
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(139, 188, 143, 0.95) 0%, rgba(85, 107, 47, 0.9) 100%)'
                      : 'linear-gradient(135deg, rgba(85, 107, 47, 0.95) 0%, rgba(139, 188, 143, 0.9) 100%)',
                  border: '1px solid',
                  borderColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(139, 188, 143, 0.5)'
                      : 'rgba(85, 107, 47, 0.6)',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 8px 32px rgba(139, 188, 143, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                      : '0 8px 32px rgba(85, 107, 47, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                    transition: 'left 0.6s ease-in-out',
                  },
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.02)',
                    boxShadow: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '0 12px 48px rgba(139, 188, 143, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                        : '0 12px 48px rgba(85, 107, 47, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                    borderColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(139, 188, 143, 0.8)'
                        : 'rgba(85, 107, 47, 0.8)',
                    '&::before': {
                      left: '100%',
                    },
                  },
                  '&:active': {
                    transform: 'translateY(-2px) scale(0.98)',
                  },
                }}
              >
                Označit den jako hotový
              </Button>
            </Box>
          ) : !viewingDay && dayCompleted ? (
            <Alert
              severity="success"
              sx={{
                mb: 4,
                borderRadius: BORDER_RADIUS.premium,
                '& .MuiAlert-message': {
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }
              }}
            >
              <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                  <AlertTitle sx={{ textAlign: 'center' }}>Skvělá práce! Den je dokončený.</AlertTitle>

                  {client.streak > 1 && (
                    <Chip
                      label={`Počet dní v řadě: ${client.streak}`}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        borderRadius: BORDER_RADIUS.small,
                        backgroundColor: (theme) => `${theme.palette.secondary.main}CC`,
                        color: 'rgba(255, 255, 255, 0.9)',
                      }}
                    />
                  )}
                </Box>
                <Button
                  variant="text"
                  endIcon={<NextIcon />}
                  onClick={handleNextDay}
                >
                  Pokračovat na Den {client.currentDay + 1}
                </Button>
              </Box>
            </Alert>
          ) : null}

          {/* Progress Garden */}
          <ProgressGarden
            currentDay={client.currentDay}
            totalDays={program.duration}
            completedDays={client.completedDays}
            streak={client.streak}
          />
        </motion.div>
      </Container>

      {/* Material Feedback Modal - Univerzální pro všechny typy materiálů */}
      <MaterialFeedbackModal
        open={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        material={feedbackMaterial}
        client={client}
        onSave={handleSaveFeedback}
      />

      {/* Celebration Modal */}
      <CelebrationModal
        open={celebrationOpen}
        onClose={() => setCelebrationOpen(false)}
        program={program}
        client={client}
      />

      {/* Program End Feedback Modal */}
      <ProgramEndFeedbackModal
        open={programEndFeedbackOpen}
        onClose={() => setProgramEndFeedbackOpen(false)}
        program={program}
        client={client}
        onSave={handleSaveProgramFeedback}
      />
    </Box>
  );
};

export default DailyView;
