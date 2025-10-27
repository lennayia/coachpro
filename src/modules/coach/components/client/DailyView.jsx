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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckIcon,
  ArrowForward as NextIcon,
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
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import MoodCheck from './MoodCheck';
import ProgressGarden from './ProgressGarden';
import CustomAudioPlayer from '../shared/CustomAudioPlayer';
import PDFViewer from '../shared/PDFViewer';
import DocumentViewer from '../shared/DocumentViewer';
import CelebrationModal from './CelebrationModal';
import {
  getCurrentClient,
  setCurrentClient,
  saveClient,
  getProgramById,
  getMaterialById,
} from '../../utils/storage';
import { getIconByType } from '@shared/utils/helpers';
import { fadeIn, fadeInUp } from '../../utils/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import { getEmbedUrl } from '../../utils/linkDetection';

const DailyView = () => {
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

  // Load data
  useEffect(() => {
    const loadedClient = getCurrentClient();
    if (!loadedClient) {
      navigate('/client/entry');
      return;
    }

    const loadedProgram = getProgramById(loadedClient.programId);
    if (!loadedProgram) {
      navigate('/client/entry');
      return;
    }

    setClient(loadedClient);
    setProgram(loadedProgram);

    // Get current day data
    const dayData = loadedProgram.days?.[loadedClient.currentDay - 1];

    if (!dayData) {
      console.error('Day data not found for day', loadedClient.currentDay);
      navigate('/client/entry');
      return;
    }

    setCurrentDayData(dayData);

    // Load materials
    const loadedMaterials = (dayData.materialIds || [])
      .map((id) => getMaterialById(id))
      .filter(Boolean);
    setMaterials(loadedMaterials);

    // Check mood and completion status
    setMoodChecked(
      loadedClient.moodLog.some((m) => m.day === loadedClient.currentDay)
    );
    setDayCompleted(loadedClient.completedDays.includes(loadedClient.currentDay));
  }, [navigate]);

  const handleMoodSelected = (mood) => {
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

    saveClient(updatedClient);
    setClient(updatedClient);
    setMoodChecked(true);
  };

  const handleCompleteDay = () => {
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
    }

    saveClient(updatedClient);
    setClient(updatedClient);
    setDayCompleted(true);

    // Show confetti
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const handleNextDay = () => {
    if (!client || client.currentDay >= program.duration) return;

    const updatedClient = {
      ...client,
      currentDay: client.currentDay + 1,
    };

    saveClient(updatedClient);
    setCurrentClient(updatedClient); // Update session storage
    window.location.reload(); // Reload to show next day
  };

  const handleBack = () => {
    navigate('/client/entry');
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
      <AppBar position="sticky" color="transparent" elevation={0}>
        <Toolbar>
          <IconButton edge="start" onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>

          <Box flexGrow={1}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              CoachPro 🌿
            </Typography>
          </Box>

          <Box sx={{ minWidth: 150, textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Den {client.currentDay} z {program.duration}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{ height: 6, borderRadius: BORDER_RADIUS.minimal, mt: 0.5 }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <motion.div variants={fadeIn} initial="hidden" animate="visible">
          {/* Mood check */}
          {!moodChecked && <MoodCheck onMoodSelected={handleMoodSelected} />}

          {/* Day header */}
          <Card sx={{ mb: 3, textAlign: 'center' }}>
            <CardContent sx={{ py: 4 }}>
              <Typography variant="overline" color="text.secondary">
                Den {client.currentDay}
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
                <Card>
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
                    </Box>

                    {/* Render by type */}
                    {material.type === 'audio' && (
                      <CustomAudioPlayer
                        src={material.content}
                        title={material.title}
                      />
                    )}

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

                    {material.type === 'pdf' && (
                      <PDFViewer src={material.content} title={material.title} />
                    )}

                    {material.type === 'document' && (
                      <DocumentViewer src={material.content} title={material.title} />
                    )}

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

                    {material.type === 'link' && (
                      <Box>
                        {/* YouTube embed */}
                        {material.linkType === 'youtube' && (
                          <Box
                            sx={{
                              position: 'relative',
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

                        {/* Ostatní služby - tlačítko pro otevření */}
                        {!['youtube', 'vimeo', 'spotify', 'soundcloud', 'instagram'].includes(
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
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Stack>

          {/* Complete day button */}
          {!dayCompleted ? (
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<CheckIcon />}
              onClick={handleCompleteDay}
              sx={{ mb: 4 }}
            >
              Označit den jako hotový
            </Button>
          ) : (
            <Alert severity="success" sx={{ mb: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <AlertTitle>Skvělá práce! 🎉</AlertTitle>
                  Den dokončen
                  {client.streak > 1 && (
                    <Chip
                      label={`🔥 ${client.streak} dní v řadě!`}
                      size="small"
                      color="warning"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>
                {client.currentDay < program.duration && (
                  <Button
                    variant="text"
                    endIcon={<NextIcon />}
                    onClick={handleNextDay}
                  >
                    Den {client.currentDay + 1}
                  </Button>
                )}
              </Box>
            </Alert>
          )}

          {/* Progress Garden */}
          <ProgressGarden
            currentDay={client.currentDay}
            totalDays={program.duration}
            completedDays={client.completedDays}
            streak={client.streak}
          />
        </motion.div>
      </Container>

      {/* Celebration Modal */}
      <CelebrationModal
        open={celebrationOpen}
        onClose={() => setCelebrationOpen(false)}
        program={program}
        client={client}
      />
    </Box>
  );
};

export default DailyView;
