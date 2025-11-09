import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@shared/components/Layout';
import TesterAuthGuard from '@shared/components/TesterAuthGuard';

// Pages - budeme vytvářet postupně
import DashboardOverview from '../components/coach/DashboardOverview';
import MaterialsLibrary from '../components/coach/MaterialsLibrary';
import ProgramsList from '../components/coach/ProgramsList';
import ClientsList from '../components/coach/ClientsList';
import ProfilePage from './ProfilePage';
import CoachingCardsPage from './CoachingCardsPage';
import TesterManagement from '../components/coach/TesterManagement';

const CoachDashboard = () => {
  return (
    <TesterAuthGuard requireProfile={true}>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/coach/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/materials" element={<MaterialsLibrary />} />
          <Route path="/programs" element={<ProgramsList />} />
          <Route path="/clients" element={<ClientsList />} />
          <Route path="/cards" element={<CoachingCardsPage />} />
          <Route path="/testers" element={<TesterManagement />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Layout>
    </TesterAuthGuard>
  );
};

export default CoachDashboard;
