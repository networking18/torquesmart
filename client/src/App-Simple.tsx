import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from './contexts/AuthContext';
import LayoutTorquesmart from './components/Layout/Layout-Torquesmart';
import Login from './pages/Auth/Login';
import DashboardApliSmart from './pages/Dashboard/Dashboard-ApliSmart';
import UsersApliSmart from './pages/Users/Users-ApliSmart';
import EnginesTorquesmart from './pages/Engines/Engines-Torquesmart';
import Vehicles from './pages/Vehicles/Vehicles';
import VehicleDetail from './pages/Vehicles/VehicleDetail';
import Maintenance from './pages/Maintenance/Maintenance';
import MaintenanceDetail from './pages/Maintenance/MaintenanceDetail';
import Expenses from './pages/Expenses/Expenses';
import Reports from './pages/Reports/Reports';
import Alerts from './pages/Alerts/Alerts';
import Profile from './pages/Profile/Profile';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Cargando...</div>
      </Box>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <LayoutTorquesmart>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardApliSmart />} />
        <Route path="/access" element={<UsersApliSmart />} />
        <Route path="/users" element={<UsersApliSmart />} />
        <Route path="/engines" element={<EnginesTorquesmart />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/vehicles/:id" element={<VehicleDetail />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/maintenance/:id" element={<MaintenanceDetail />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </LayoutTorquesmart>
  );
}

export default App;
