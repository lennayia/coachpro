import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@shared/components/Layout';

// Pages - budeme vytvářet postupně
import DashboardOverview from '../components/coach/DashboardOverview';
import MaterialsLibrary from '../components/coach/MaterialsLibrary';
import ProgramsList from '../components/coach/ProgramsList';
import ClientsList from '../components/coach/ClientsList';

const CoachDashboard = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/coach/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardOverview />} />
        <Route path="/materials" element={<MaterialsLibrary />} />
        <Route path="/programs" element={<ProgramsList />} />
        <Route path="/clients" element={<ClientsList />} />
      </Routes>
    </Layout>
  );
};

export default CoachDashboard;
