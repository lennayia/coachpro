// Cesta: src/shared/components/AppTooltip.jsx
// Jednotná komponenta pro tooltips napříč celou aplikací

import { Tooltip } from '@mui/material';

/**
 * AppTooltip - konzistentní tooltip pro celou aplikaci
 *
 * Použití:
 *   <AppTooltip title="Popis">
 *     <IconButton>...</IconButton>
 *   </AppTooltip>
 *
 *   <AppTooltip title="Popis" placement="right" arrow>
 *     <Button>...</Button>
 *   </AppTooltip>
 */
export const AppTooltip = ({
  children,
  title,
  placement = 'top',
  arrow = true,
  enterDelay = 500,
  leaveDelay = 0,
  disableInteractive = false,
  ...props
}) => {
  // Pokud není title, nezobrazvuj tooltip
  if (!title) {
    return children;
  }

  return (
    <Tooltip
      title={title}
      placement={placement}
      arrow={arrow}
      enterDelay={enterDelay}
      leaveDelay={leaveDelay}
      disableInteractive={disableInteractive}
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(30, 30, 30, 0.95)'
                : 'rgba(50, 50, 50, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            fontSize: '0.875rem',
            padding: '8px 12px',
            maxWidth: 300,
          },
        },
        arrow: {
          sx: {
            color: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(30, 30, 30, 0.95)'
                : 'rgba(50, 50, 50, 0.95)',
          },
        },
      }}
      {...props}
    >
      {children}
    </Tooltip>
  );
};

/**
 * Tooltip s rychlejším zobrazením (pro ikony)
 */
export const QuickTooltip = (props) => (
  <AppTooltip enterDelay={200} {...props} />
);

/**
 * Tooltip s delším zobrazením (pro nápovědu)
 */
export const InfoTooltip = (props) => (
  <AppTooltip enterDelay={800} disableInteractive={false} {...props} />
);

export default AppTooltip;
