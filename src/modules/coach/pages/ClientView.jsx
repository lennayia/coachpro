import { Routes, Route, Navigate } from 'react-router-dom';
import ClientEntry from '../components/client/ClientEntry';
import DailyView from '../components/client/DailyView';

const ClientView = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/client/entry" replace />} />
      <Route path="/entry" element={<ClientEntry />} />
      <Route path="/daily" element={<DailyView />} />
    </Routes>
  );
};

export default ClientView;
