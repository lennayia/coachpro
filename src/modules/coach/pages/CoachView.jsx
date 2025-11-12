import { Routes, Route } from 'react-router-dom';
import { TesterAuthProvider } from '@shared/context/TesterAuthContext';
import CoachDashboard from './CoachDashboard';
import CoachLogin from './CoachLogin';

/**
 * CoachView - Wrapper for Coach routes with TesterAuthProvider
 *
 * Provides OAuth authentication context for coaches who log in via Google
 * Similar to ClientView and TesterView pattern
 */
const CoachView = () => {
  return (
    <TesterAuthProvider>
      <Routes>
        <Route path="/login" element={<CoachLogin />} />
        <Route path="/*" element={<CoachDashboard />} />
      </Routes>
    </TesterAuthProvider>
  );
};

export default CoachView;
