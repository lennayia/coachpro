// @digipro/design-system/components/Button/Button.jsx
// Universal button component with DigiPro styling

import React from 'react';
import { Button as MuiButton, IconButton as MuiIconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDigiProTheme } from '../../utils/ThemeProvider.jsx';

// Styled button with enhanced DigiPro styling
const StyledButton = styled(MuiButton)(({ theme, $variant, $size, $fullWidth }) => ({
  // Base styling
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.button.fontWeight,
  textTransform: 'none',
  borderRadius: theme.spacing(1.5), // 12px
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Size variants
  ...$size === 'small' && {
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    fontSize: '0.75rem',
    minHeight: '32px',
  },
  
  ...$size === 'medium' && {
    padding: `${theme.spacing(1.5)} ${theme.spacing(3)}`,
    fontSize: '0.875rem',
    minHeight: '40px',
  },
  
  ...$size === 'large' && {
    padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
    fontSize: '1rem',
    minHeight: '48px',
  },

  // Full width
  ...$fullWidth && {
    width: '100%',
  },

  // Hover effects
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: theme.shadows[4],
  },

  '&:active': {
    transform: 'translateY(0)',
  },

  // Focus state
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
  },
}));

// Icon button styling
const StyledIconButton = styled(MuiIconButton)(({ theme, $size, $color }) => ({
  borderRadius: theme.spacing(1),
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  
  ...$size === 'small' && {
    padding: theme.spacing(1),
    '& .MuiSvgIcon-root': {
      fontSize: '1.1rem',
    },
  },
  
  ...$size === 'medium' && {
    padding: theme.spacing(1.5),
    '& .MuiSvgIcon-root': {
      fontSize: '1.25rem',
    },
  },
  
  ...$size === 'large' && {
    padding: theme.spacing(2),
    '& .MuiSvgIcon-root': {
      fontSize: '1.5rem',
    },
  },

  '&:hover': {
    transform: 'scale(1.05)',
  },

  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
  },
}));

// Loading spinner component
const LoadingSpinner = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none"
    style={{ animation: 'spin 1s linear infinite' }}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeDasharray="31.416"
      strokeDashoffset="31.416"
      style={{
        animation: 'dash 2s ease-in-out infinite alternate'
      }}
    />
    <style jsx>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes dash {
        0% { stroke-dasharray: 1, 31.416; }
        50% { stroke-dasharray: 15.708, 15.708; }
        100% { stroke-dasharray: 31.416, 1; }
      }
    `}</style>
  </svg>
);

// Main Button component
export const Button = React.forwardRef(({
  children,
  variant = 'contained', // contained | outlined | text
  size = 'medium',      // small | medium | large
  color = 'primary',    // primary | secondary | success | warning | error
  fullWidth = false,
  disabled = false,
  loading = false,
  startIcon,
  endIcon,
  onClick,
  type = 'button',
  href,
  className,
  sx,
  ...props
}, ref) => {
  const { isDark } = useDigiProTheme();

  // Handle loading state
  const isDisabled = disabled || loading;
  const displayStartIcon = loading ? <LoadingSpinner /> : startIcon;
  const displayChildren = loading ? 'Loading...' : children;

  // If href is provided, render as link
  const component = href ? 'a' : 'button';

  return (
    <StyledButton
      ref={ref}
      component={component}
      variant={variant}
      color={color}
      size={size}
      disabled={isDisabled}
      startIcon={displayStartIcon}
      endIcon={!loading ? endIcon : null}
      onClick={onClick}
      type={href ? undefined : type}
      href={href}
      className={className}
      sx={sx}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      {...props}
    >
      {displayChildren}
    </StyledButton>
  );
});

// Icon Button component
export const IconButton = React.forwardRef(({
  children,
  size = 'medium',
  color = 'primary',
  disabled = false,
  onClick,
  className,
  sx,
  ...props
}, ref) => {
  return (
    <StyledIconButton
      ref={ref}
      size={size}
      color={color}
      disabled={disabled}
      onClick={onClick}
      className={className}
      sx={sx}
      $size={size}
      $color={color}
      {...props}
    >
      {children}
    </StyledIconButton>
  );
});

// Button group for related actions
export const ButtonGroup = ({ 
  children, 
  spacing = 2, 
  direction = 'row',
  sx,
  ...props 
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction,
        gap: `${spacing * 8}px`,
        ...sx,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

Button.displayName = 'DigiProButton';
IconButton.displayName = 'DigiProIconButton';
ButtonGroup.displayName = 'DigiProButtonGroup';

export default Button;