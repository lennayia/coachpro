import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BORDER_RADIUS from '@styles/borderRadius';

/**
 * ErrorBoundary - Catches React errors and displays user-friendly fallback
 *
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 *
 * @created 4.11.2025
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console (in production, send to error tracking service)
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

/**
 * ErrorFallback - User-friendly error UI
 */
const ErrorFallback = ({ error, onReset }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    onReset();
    navigate('/coach/dashboard');
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(45, 45, 45, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(245, 245, 245, 0.95) 0%, rgba(255, 255, 255, 0.95) 100%)',
        px: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          width: '100%',
          borderRadius: BORDER_RADIUS.card,
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0, 0, 0, 0.4)'
              : '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          {/* Icon */}
          <Box mb={3}>
            <AlertTriangle
              size={64}
              color="#FF9800"
              strokeWidth={1.5}
            />
          </Box>

          {/* Title */}
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Jejda, něco se pokazilo
          </Typography>

          {/* Description */}
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Narazili jsme na neočekávanou chybu. Omlouváme se za nepříjemnosti.
          </Typography>

          {/* Error details (development only) */}
          {import.meta.env.DEV && error && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: BORDER_RADIUS.compact,
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 0, 0, 0.1)'
                    : 'rgba(255, 0, 0, 0.05)',
                border: '1px solid',
                borderColor: 'error.main',
                textAlign: 'left',
              }}
            >
              <Typography
                variant="caption"
                component="pre"
                sx={{
                  overflow: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {error.toString()}
              </Typography>
            </Box>
          )}

          {/* Action buttons */}
          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<RefreshCw size={18} />}
              onClick={handleReload}
              sx={{
                px: 3,
                py: 1,
                borderRadius: BORDER_RADIUS.compact,
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              Obnovit stránku
            </Button>
            <Button
              variant="outlined"
              startIcon={<Home size={18} />}
              onClick={handleGoHome}
              sx={{
                px: 3,
                py: 1,
                borderRadius: BORDER_RADIUS.compact,
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              Zpět na úvod
            </Button>
          </Box>

          {/* Contact info */}
          <Box mt={4}>
            <Typography variant="body2" color="text.secondary">
              Pokud problém přetrvává, napiš nám prosím na
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: 'primary.main',
                mt: 0.5,
              }}
            >
              beta@online-byznys.cz
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ErrorBoundary;
