// Cesta: src/shared/context/NotificationContext.jsx
// Notifikační systém portovaný z PaymentsPro

import React, { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const timeoutRefs = useRef({});

  const removeNotification = useCallback((id) => {
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
      delete timeoutRefs.current[id];
    }
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback(
    (message, severity, title) => {
      const id = Date.now() + Math.random();
      setNotifications((prev) => [...prev, { id, message, severity, title }]);

      const isMuted = false; // false = zvuk ZAPNUTÝ
      if (!isMuted) {
        try {
          const audio = new Audio('/sounds/notification.mp3');

          // Přidáme error handling pro autoplay policy
          const playPromise = audio.play();

          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                // Zvuk se přehrál úspěšně
                console.log('🔊 Notifikační zvuk přehrán');
              })
              .catch((error) => {
                // Autoplay blokován - to je normální při prvním načtení
                if (error.name === 'NotAllowedError') {
                  console.log('🔇 Zvuk blokován prohlížečem - klikni někam na stránku pro povolení');
                } else {
                  console.error('Chyba při přehrávání zvuku:', error);
                }
              });
          }
        } catch (error) {
          console.error('Chyba při vytváření audio objektu:', error);
        }
      }

      const timeoutId = setTimeout(() => {
        removeNotification(id);
      }, 5000);

      timeoutRefs.current[id] = timeoutId;
    },
    [removeNotification]
  );

  // Efekt pro vyčištění všech běžících časovačů, když se komponenta odpojí
  useEffect(() => {
    const refs = timeoutRefs.current;
    return () => {
      Object.values(refs).forEach(clearTimeout);
    };
  }, []);

  // Pomocné funkce pro snadné volání
  const showSuccess = useCallback((title, message) => addNotification(message, 'success', title), [addNotification]);
  const showError = useCallback((title, message) => addNotification(message, 'error', title), [addNotification]);
  const showInfo = useCallback((title, message) => addNotification(message, 'info', title), [addNotification]);
  const showWarning = useCallback((title, message) => addNotification(message, 'warning', title), [addNotification]);

  // Stabilní hodnota kontextu díky useMemo
  const value = useMemo(
    () => ({
      notifications,
      showSuccess,
      showError,
      showInfo,
      showWarning,
      removeNotification,
    }),
    [notifications, showSuccess, showError, showInfo, showWarning, removeNotification]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

// Hook pro snadné použití kontextu v jiných komponentách
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
