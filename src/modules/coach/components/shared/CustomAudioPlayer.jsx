import { useRef, useEffect, useState } from 'react';
import { Box, IconButton, Typography, LinearProgress } from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Replay10 as Replay10Icon,
  Forward10 as Forward10Icon,
} from '@mui/icons-material';
import BORDER_RADIUS from '@styles/borderRadius';
import { useNotification } from '@shared/context/NotificationContext';

// Note: wavesurfer.js se použije později - zatím jednoduchý HTML5 audio player
const CustomAudioPlayer = ({ src, title }) => {
  const audioRef = useRef(null);
  const { showError } = useNotification();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setLoading(true);
    setError(null);

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = (e) => {
      console.error('Audio error:', e);
      const errorMsg = 'Nepodařilo se načíst audio soubor';
      setError(errorMsg);
      showError('Chyba přehrávače', errorMsg);
      setLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [src]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkip = (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Box>
      <audio key={src} ref={audioRef} src={src} preload="metadata" />

      {/* Error message */}
      {error && (
        <Box mb={2} p={2} sx={{ backgroundColor: 'error.light', borderRadius: BORDER_RADIUS.small }}>
          <Typography variant="body2" color="error.dark">
            {error}
          </Typography>
        </Box>
      )}

      {/* Progress bar */}
      <Box mb={2}>
        <LinearProgress
          variant={loading ? 'indeterminate' : 'determinate'}
          value={progress}
          sx={{
            height: 8,
            borderRadius: BORDER_RADIUS.minimal,
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.1)',
          }}
        />
      </Box>

      {/* Controls */}
      <Box display="flex" alignItems="center" gap={1}>
        {/* Skip -10s */}
        <IconButton
          onClick={() => handleSkip(-10)}
          size="small"
          disabled={loading}
        >
          <Replay10Icon />
        </IconButton>

        {/* Play/Pause */}
        <IconButton
          onClick={handlePlayPause}
          disabled={loading}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' },
            '&:disabled': {
              bgcolor: 'action.disabledBackground',
              color: 'action.disabled',
            },
          }}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </IconButton>

        {/* Skip +10s */}
        <IconButton
          onClick={() => handleSkip(10)}
          size="small"
          disabled={loading}
        >
          <Forward10Icon />
        </IconButton>

        {/* Time */}
        <Box flexGrow={1} textAlign="right">
          <Typography variant="caption" color="text.secondary">
            {formatTime(currentTime)} / {formatTime(duration)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CustomAudioPlayer;
