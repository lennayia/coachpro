import { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createNatureTheme } from '@shared/themes/natureTheme';

// Pages - budeme vytvářet postupně
import CoachView from '@modules/coach/pages/CoachView';
import ClientView from '@modules/coach/pages/ClientView';
import TesterView from '@modules/coach/pages/TesterView';
import AdminLogin from '@modules/coach/pages/AdminLogin';
import PrivacyPolicy from '@modules/coach/pages/PrivacyPolicy';
import TermsOfService from '@modules/coach/pages/TermsOfService';
import RootRedirect from '@shared/components/RootRedirect';

// Context pro theme mode
import { createContext, useContext } from 'react';

// Notification system
import { NotificationProvider } from '@shared/context/NotificationContext';
import { NotificationContainer } from '@shared/components/NotificationContainer';

// Error boundary
import ErrorBoundary from '@shared/components/ErrorBoundary';

export const ThemeModeContext = createContext({
  mode: 'light',
  toggleTheme: () => {},
});

function App() {
  const [mode, setMode] = useState('light');

  const theme = useMemo(() => createNatureTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <NotificationProvider>
          <CssBaseline />
          <BrowserRouter>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<RootRedirect />} />
                <Route path="/lenna" element={<AdminLogin />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/coach/*" element={<ErrorBoundary><CoachView /></ErrorBoundary>} />
                <Route path="/client/*" element={<ErrorBoundary><ClientView /></ErrorBoundary>} />
                <Route path="/tester/*" element={<ErrorBoundary><TesterView /></ErrorBoundary>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ErrorBoundary>
          </BrowserRouter>
          <NotificationContainer />
        </NotificationProvider>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export default App;

// Custom hook pro použití theme mode
export const useThemeMode = () => useContext(ThemeModeContext);
