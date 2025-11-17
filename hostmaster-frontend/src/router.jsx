import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hostmaster/hooks/useAuth';
import Login from './hostmaster/pages/Login';
import Register from './hostmaster/pages/Register';
import Dashboard from './hostmaster/pages/Dashboard';
import Rooms from './hostmaster/pages/Rooms';
import Reservations from './hostmaster/pages/Reservations';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Carregando...</div>;
  return user ? children : <Navigate to="/login" />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/rooms" element={<PrivateRoute><Rooms /></PrivateRoute>} />
      <Route path="/reservations" element={<PrivateRoute><Reservations /></PrivateRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}
