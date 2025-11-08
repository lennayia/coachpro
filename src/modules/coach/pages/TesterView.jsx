import { Routes, Route } from 'react-router-dom';
import { TesterAuthProvider } from '@shared/context/TesterAuthContext';
import Tester from './Tester';
import TesterWelcome from './TesterWelcome';
import TesterProfileSimple from './TesterProfileSimple';

/**
 * TesterView - Tester routes with auth provider
 *
 * Note: Provider wraps all routes (like ClientView) to allow auth hooks everywhere
 */
const TesterView = () => {
  return (
    <TesterAuthProvider>
      <Routes>
        <Route path="/" element={<Tester />} />
        <Route path="/welcome" element={<TesterWelcome />} />
        <Route path="/profile" element={<TesterProfileSimple />} />
      </Routes>
    </TesterAuthProvider>
  );
};

export default TesterView;
