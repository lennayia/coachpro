// Cesta: src/shared/components/NotificationContainer.jsx
// Notifikační systém portovaný z PaymentsPro, přizpůsobený CoachPro designu

import React from 'react';
import { Alert, AlertTitle, IconButton } from '@mui/material';
import { useNotification } from '../../context/NotificationContext';
import {
  CheckCircleOutline,
  ErrorOutline,
  InfoOutlined,
  WarningAmberOutlined,
  Close as CloseIcon,
} from '@mui/icons-material';
import { BORDER_RADIUS } from '../../styles/responsive.js';
import './Notification.css';

const customIcons = {
  success: <CheckCircleOutline fontSize="inherit" />,
  error: <ErrorOutline fontSize="inherit" />,
  info: <InfoOutlined fontSize="inherit" />,
  warning: <WarningAmberOutlined fontSize="inherit" />,
};

export const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  const baseAlertStyle = {
    borderRadius: BORDER_RADIUS.premium,  // 24px - modulární konstanta
    color: '#fff',
    backgroundColor: '#1e1e2f',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    backdropFilter: 'blur(20px) saturate(180%)',  // Glassmorphism efekt
    overflow: 'hidden',
    minWidth: '320px',
    '& .MuiAlert-icon': { color: 'inherit' },
    '& .MuiAlertTitle-root': { fontWeight: 'bold', color: '#fff' },
    '& .MuiAlert-message': { color: 'rgba(255, 255, 255, 0.85)' },
    '& .MuiAlert-action .MuiIconButton-root': { color: 'rgba(255, 255, 255, 0.7)' },
  };

  const severityStyles = {
    success: { color: '#8FBC8F' }, // CoachPro primary color (lighter green)
    error: { color: '#ff5555' },
    info: { color: '#82aaff' },
    warning: { color: '#ffb86c' },
  };

  return (
    <div className="notification-wrapper">
      {notifications.map((notification) => {
        const nodeRef = React.createRef(null);
        return (
          <div
            key={notification.id}
            ref={nodeRef}
            className="notification-item"
          >
            <Alert
              severity={notification.severity}
              iconMapping={customIcons}
              sx={{ ...baseAlertStyle, ...severityStyles[notification.severity] }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => removeNotification(notification.id)}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {notification.title && <AlertTitle>{notification.title}</AlertTitle>}
              {notification.message}
            </Alert>
          </div>
        );
      })}
    </div>
  );
};
