import { Routes, Route, useLocation } from 'react-router-dom';
import { ClientAuthProvider, useClientAuth } from '@shared/context/ClientAuthContext';
import Layout from '@shared/components/Layout';
import Client from './Client';
import ClientWelcome from './ClientWelcome';
import ClientDashboard from './ClientDashboard';
import ClientProfile from './ClientProfile';
import MaterialEntry from '../components/client/MaterialEntry';
import DailyView from '../components/client/DailyView';
import MaterialView from './MaterialView';
import ClientMaterials from './ClientMaterials';
import ClientHelp from './ClientHelp';
import ClientSessions from './ClientSessions';
import ClientCardDeckEntry from '../components/client/ClientCardDeckEntry';
import ClientCardDeckView from '../components/client/ClientCardDeckView';
import ClientCoachSelection from './ClientCoachSelection';

// Wrapper component to access ClientAuth context
const ClientViewContent = () => {
  const location = useLocation();
  const { logout } = useClientAuth();

  // Don't show layout on login page
  const isLoginPage = location.pathname.endsWith('/client') || location.pathname === '/client/';

  // If login page, render without layout
  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/" element={<Client />} />
      </Routes>
    );
  }

  // For all other pages, use universal Layout with userType="client"
  return (
    <Layout userType="client" logoutHandler={logout}>
      <Routes>
        <Route path="/welcome" element={<ClientWelcome />} />
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/profile" element={<ClientProfile />} />
        <Route path="/sessions" element={<ClientSessions />} />
        <Route path="/material-entry" element={<MaterialEntry />} />
        <Route path="/daily" element={<DailyView />} />
        <Route path="/materials" element={<ClientMaterials />} />
        <Route path="/material/:code" element={<MaterialView />} />
        <Route path="/help" element={<ClientHelp />} />
        <Route path="/select-coach" element={<ClientCoachSelection />} />
        <Route path="/cards" element={<ClientCardDeckEntry />} />
        <Route path="/card-deck/:code" element={<ClientCardDeckView />} />
      </Routes>
    </Layout>
  );
};

const ClientView = () => {
  return (
    <ClientAuthProvider>
      <ClientViewContent />
    </ClientAuthProvider>
  );
};

export default ClientView;
