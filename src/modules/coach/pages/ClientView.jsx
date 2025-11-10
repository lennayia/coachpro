import { Routes, Route } from 'react-router-dom';
import { ClientAuthProvider } from '@shared/context/ClientAuthContext';
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

const ClientView = () => {
  return (
    <ClientAuthProvider>
      <Routes>
        <Route path="/" element={<Client />} />
        <Route path="/welcome" element={<ClientWelcome />} />
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/profile" element={<ClientProfile />} />
        <Route path="/sessions" element={<ClientSessions />} />
        <Route path="/material-entry" element={<MaterialEntry />} />
        <Route path="/daily" element={<DailyView />} />
        <Route path="/materials" element={<ClientMaterials />} />
        <Route path="/material/:code" element={<MaterialView />} />
        <Route path="/help" element={<ClientHelp />} />
        <Route path="/cards" element={<ClientCardDeckEntry />} />
        <Route path="/card-deck/:code" element={<ClientCardDeckView />} />
      </Routes>
    </ClientAuthProvider>
  );
};

export default ClientView;
