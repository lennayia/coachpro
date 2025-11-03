import { Routes, Route, Navigate } from 'react-router-dom';
import ClientEntry from '../components/client/ClientEntry';
import MaterialEntry from '../components/client/MaterialEntry';
import DailyView from '../components/client/DailyView';
import MaterialView from './MaterialView';

const ClientView = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/client/entry" replace />} />
      <Route path="/entry" element={<ClientEntry />} />
      <Route path="/material-entry" element={<MaterialEntry />} />
      <Route path="/daily" element={<DailyView />} />
      <Route path="/material/:code" element={<MaterialView />} />
    </Routes>
  );
};

export default ClientView;
