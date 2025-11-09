import { TesterAuthProvider } from '@shared/context/TesterAuthContext';
import CoachDashboard from './CoachDashboard';

/**
 * CoachView - Wrapper for Coach routes with TesterAuthProvider
 *
 * Provides OAuth authentication context for coaches who log in via Google
 * Similar to ClientView and TesterView pattern
 */
const CoachView = () => {
  return (
    <TesterAuthProvider>
      <CoachDashboard />
    </TesterAuthProvider>
  );
};

export default CoachView;
