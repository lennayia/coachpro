import { Alert, Typography } from '@mui/material';
import { CheckCircle as CheckIcon } from '@mui/icons-material';
import BORDER_RADIUS from '@styles/borderRadius';

/**
 * ShareCodePreview - Universal preview component for shared content
 *
 * Displays preview information when user enters a valid share code
 * Works for programs, materials, card decks, etc.
 *
 * @param {Object} props
 * @param {Object} props.data - Preview data object
 * @param {string} props.data.title - Content title
 * @param {string} [props.data.coachName] - Coach name (optional)
 * @param {string} [props.data.clientEmail] - Client email for individual sharing (optional)
 * @param {string} [props.data.type] - Content type (optional)
 * @param {string} [props.data.subtitle] - Additional subtitle (optional)
 * @param {string} [props.severity] - Alert severity (default: 'success')
 * @param {React.ReactNode} [props.icon] - Custom icon (default: CheckIcon)
 */
const ShareCodePreview = ({
  data,
  severity = 'success',
  icon = <CheckIcon />,
}) => {
  if (!data) return null;

  return (
    <Alert
      severity={severity}
      icon={icon}
      sx={{
        mt: 2,
        mb: 1,
        borderRadius: BORDER_RADIUS.compact,
      }}
    >
      {/* Title */}
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {data.title}
      </Typography>

      {/* Subtitle (optional) */}
      {data.subtitle && (
        <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }} color="text.secondary">
          {data.subtitle}
        </Typography>
      )}

      {/* Coach Name */}
      {data.coachName && (
        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontWeight: 500, color: 'primary.main' }}>
          Od kouče: {data.coachName}
        </Typography>
      )}

      {/* Client Email (for individual sharing) */}
      {data.clientEmail && (
        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontWeight: 500, color: 'secondary.main' }}>
          Sdíleno pro: {data.clientEmail}
        </Typography>
      )}

      {/* Category (e.g., Meditace, Afirmace) */}
      {data.category && (
        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontWeight: 500 }} color="primary.main">
          📂 {data.category}
        </Typography>
      )}

      {/* Format (e.g., Audio, Video, PDF) */}
      {data.format && (
        <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }} color="text.secondary">
          {data.format}
        </Typography>
      )}

      {/* Duration (for programs) */}
      {data.duration && (
        <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }} color="text.secondary">
          Délka programu: {data.duration} dní
        </Typography>
      )}

      {/* Description (optional) */}
      {data.description && (
        <Typography variant="caption" sx={{ display: 'block', mt: 1 }} color="text.secondary">
          {data.description}
        </Typography>
      )}
    </Alert>
  );
};

export default ShareCodePreview;
