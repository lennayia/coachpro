import { Routes, Route } from 'react-router-dom';
import Client from './Client';
import MaterialEntry from '../components/client/MaterialEntry';
import DailyView from '../components/client/DailyView';
import MaterialView from './MaterialView';
import ClientProfile from './ClientProfile';
import ClientCardDeckEntry from '../components/client/ClientCardDeckEntry';
import ClientCardDeckView from '../components/client/ClientCardDeckView';

const ClientView = () => {
  return (
    <Routes>
      <Route path="/" element={<Client />} />
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
