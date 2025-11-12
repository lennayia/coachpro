// @digipro/design-system/components/Card/Card.jsx
// Universal card component with glassmorphism effects

import React from 'react';
import { Card as MuiCard, CardContent, CardActions, CardHeader } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDigiProTheme } from '../../utils/ThemeProvider.jsx';

// Styled card with DigiPro styling and glassmorphism
const StyledCard = styled(MuiCard)(({ 
  theme, 
  $variant, 
  $elevation, 
  $interactive,
  $glassmorphism 
}) => ({
  // Base styling
  borderRadius: theme.spacing(2), // 16px
  border: $variant === 'outlined' ? `1px solid ${theme.palette.divider}` : 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',

  // Elevation variants
  ...$elevation === 'none' && {
    boxShadow: 'none',
  },
  
  ...$elevation === 'sm' && {
    boxShadow: theme.shadows[1],
  },
  
  ...$elevation === 'md' && {
    boxShadow: theme.shadows[3],
  },
  
  ...$elevation === 'lg' && {
    boxShadow: theme.shadows[6],
  },

  // Glassmorphism effect
  ...$glassmorphism && {
    background: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: `1px solid ${theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 255, 255, 0.3)'
    }`,
  },

  // Interactive states
  ...$interactive && {
    cursor: 'pointer',
    
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[8],
      
      ...$glassmorphism && {
        background: theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(255, 255, 255, 0.9)',
      },
    },

    '&:active': {
      transform: 'translateY(-1px)',
    },

    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: '2px',
    },
  },

  // Variant styles
  ...$variant === 'filled' && {
    backgroundColor: theme.palette.background.paper,
  },

  ...$variant === 'outlined' && {
    backgroundColor: 'transparent',
    borderColor: theme.palette.divider,
  },
}));

// Styled card content
const StyledCardContent = styled(CardContent)(({ theme, $padding }) => ({
  // Padding variants
  ...$padding === 'none' && {
    padding: 0,
    '&:last-child': {
      paddingBottom: 0,
    },
  },
  
  ...$padding === 'sm' && {
    padding: theme.spacing(2),
    '&:last-child': {
      paddingBottom: theme.spacing(2),
    },
  },
  
  ...$padding === 'md' && {
    padding: theme.spacing(3),
    '&:last-child': {
      paddingBottom: theme.spacing(3),
    },
  },
  
  ...$padding === 'lg' && {
    padding: theme.spacing(4),
    '&:last-child': {
      paddingBottom: theme.spacing(4),
    },
  },
}));

// Progress indicator for loading states
const ProgressBar = styled('div')(({ theme, $progress = 0, $color = 'primary' }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '3px',
  width: `${$progress}%`,
  backgroundColor: theme.palette[$color]?.main || theme.palette.primary.main,
  transition: 'width 0.3s ease',
  borderRadius: '0 0 2px 0',
}));

// Status indicator
const StatusIndicator = styled('div')(({ theme, $status = 'default' }) => {
  const statusColors = {
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
    info: theme.palette.info?.main || theme.palette.primary.main,
    default: theme.palette.grey[400],
  };

  return {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: statusColors[$status],
  };
});

// Main Card component
export const Card = React.forwardRef(({
  children,
  variant = 'filled',        // filled | outlined
  elevation = 'md',          // none | sm | md | lg
  padding = 'md',            // none | sm | md | lg
  interactive = false,       // Makes card clickable/hoverable
  glassmorphism = false,     // Enables glassmorphism effect
  progress,                  // Progress percentage (0-100)
  progressColor = 'primary', // Progress bar color
  status,                    // Status indicator (success | warning | error | info)
  onClick,
  className,
  sx,
  ...props
}, ref) => {
  const { isDark } = useDigiProTheme();

  const handleClick = (event) => {
    if (interactive && onClick) {
      onClick(event);
    }
  };

  const handleKeyDown = (event) => {
    if (interactive && onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick(event);
    }
  };

  return (
    <StyledCard
      ref={ref}
      variant={variant === 'outlined' ? 'outlined' : 'elevation'}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      className={className}
      sx={sx}
      $variant={variant}
      $elevation={elevation}
      $interactive={interactive}
      $glassmorphism={glassmorphism}
      {...props}
    >
      {/* Progress indicator */}
      {typeof progress === 'number' && (
        <ProgressBar $progress={progress} $color={progressColor} />
      )}
      
      {/* Status indicator */}
      {status && <StatusIndicator $status={status} />}
      
      {/* Card content */}
      <StyledCardContent $padding={padding}>
        {children}
      </StyledCardContent>
    </StyledCard>
  );
});

// Card with header
export const CardWithHeader = React.forwardRef(({
  title,
  subtitle,
  avatar,
  action,
  children,
  ...cardProps
}, ref) => {
  return (
    <Card ref={ref} padding="none" {...cardProps}>
      <CardHeader
        avatar={avatar}
        action={action}
        title={title}
        subheader={subtitle}
        sx={{ pb: 0 }}
      />
      <StyledCardContent $padding="md">
        {children}
      </StyledCardContent>
    </Card>
  );
});

// Card with actions
export const CardWithActions = React.forwardRef(({
  children,
  actions,
  actionAlignment = 'right', // left | center | right | space-between
  ...cardProps
}, ref) => {
  return (
    <Card ref={ref} padding="none" {...cardProps}>
      <StyledCardContent $padding="md">
        {children}
      </StyledCardContent>
      
      {actions && (
        <CardActions 
          sx={{ 
            justifyContent: actionAlignment === 'space-between' 
              ? 'space-between' 
              : `flex-${actionAlignment === 'right' ? 'end' : actionAlignment === 'left' ? 'start' : 'center'}`,
            px: 3,
            pb: 2,
          }}
        >
          {actions}
        </CardActions>
      )}
    </Card>
  );
});

// Compact card for dashboard widgets
export const CompactCard = React.forwardRef(({
  icon,
  title,
  value,
  change,
  changeType = 'neutral', // positive | negative | neutral
  ...cardProps
}, ref) => {
  return (
    <Card ref={ref} padding="md" {...cardProps}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {icon && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--surface-elevated, rgba(0,0,0,0.05))',
          }}>
            {icon}
          </div>
        )}
        
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontSize: '0.875rem', 
            color: 'var(--text-secondary)', 
            marginBottom: '4px' 
          }}>
            {title}
          </div>
          
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: 600, 
            color: 'var(--text-primary)',
            marginBottom: change ? '4px' : 0,
          }}>
            {value}
          </div>
          
          {change && (
            <div style={{ 
              fontSize: '0.75rem',
              color: changeType === 'positive' ? '#16a34a' : 
                     changeType === 'negative' ? '#dc2626' : 
                     'var(--text-tertiary)',
            }}>
              {change}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
});

Card.displayName = 'DigiProCard';
CardWithHeader.displayName = 'DigiProCardWithHeader';
CardWithActions.displayName = 'DigiProCardWithActions';
CompactCard.displayName = 'DigiProCompactCard';

export default Card;