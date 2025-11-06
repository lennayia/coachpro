import { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createNatureTheme } from '@shared/themes/natureTheme';

// Pages - budeme vytvářet postupně
import CoachDashboard from '@modules/coach/pages/CoachDashboard';
import ClientView from '@modules/coach/pages/ClientView';
import TesterSignup from '@modules/coach/pages/TesterSignup';
import TesterLogin from '@modules/coach/pages/TesterLogin';
import AdminLogin from '@modules/coach/pages/AdminLogin';
import PrivacyPolicy from '@modules/coach/pages/PrivacyPolicy';

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
                <Route path="/" element={<Navigate to="/tester" replace />} />
                <Route path="/lenna" element={<AdminLogin />} />
                <Route path="/tester" element={<TesterLogin />} />
                <Route path="/tester/signup" element={<TesterSignup />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/coach/*" element={<ErrorBoundary><CoachDashboard /></ErrorBoundary>} />
                <Route path="/client/*" element={<ErrorBoundary><ClientView /></ErrorBoundary>} />
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
