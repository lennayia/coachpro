import { Routes, Route, Navigate } from 'react-router-dom';
import ClientEntry from '../components/client/ClientEntry';
import MaterialEntry from '../components/client/MaterialEntry';
import DailyView from '../components/client/DailyView';
import MaterialView from './MaterialView';
import ClientSignup from './ClientSignup';
import ClientProfile from './ClientProfile';
import ClientCardDeckEntry from '../components/client/ClientCardDeckEntry';
import ClientCardDeckView from '../components/client/ClientCardDeckView';

const ClientView = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/client/entry" replace />} />
      <Route path="/entry" element={<ClientEntry />} />
      <Route path="/signup" element={<ClientSignup />} />
      <Route path="/profile" element={<ClientProfile />} />
      <Route path="/material-entry" element={<MaterialEntry />} />
      <Route path="/daily" element={<DailyView />} />
      <Route path="/material/:code" element={<MaterialView />} />
      <Route path="/cards" element={<ClientCardDeckEntry />} />
      <Route path="/card-deck/:code" element={<ClientCardDeckView />} />
    </Routes>
  );
};

export default ClientView;
