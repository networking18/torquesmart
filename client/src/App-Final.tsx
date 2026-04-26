// @ts-nocheck
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from './contexts/AuthContext';
import LayoutTorquesmart from './components/Layout/Layout-FullScreen';
import Login from './pages/Auth/Login-Professional';
import DashboardApliSmart from './pages/Dashboard/Dashboard-Professional';
import UsersApliSmart from './pages/Users/Users-ApliSmart';
import EnginesTorquesmart from './pages/Engines/Engines-Torquesmart';
import Vehicles from './pages/Vehicles/Vehicles';
import NewVehicle from './pages/Vehicles/NewVehicle';
import VehicleDetail from './pages/Vehicles/VehicleDetail';
import Drivers from './pages/Drivers/Drivers';
import DriverAssignment from './pages/Drivers/DriverAssignment';
import Users from './pages/Users/Users';
import Roles from './pages/Roles/Roles';
import OilChange from './pages/Maintenance/OilChange';
import Maintenance from './pages/Maintenance/Maintenance';
import MaintenanceDetail from './pages/Maintenance/MaintenanceDetail';
import Expenses from './pages/Expenses/Expenses';
import Reports from './pages/Reports/Reports';
import OilChangeReport from './pages/Reports/OilChangeReport';
import PreventiveReport from './pages/Reports/PreventiveReport';
import CorrectiveReport from './pages/Reports/CorrectiveReport';
import AirConditioningReport from './pages/Reports/AirConditioningReport';
import TireChangeReport from './pages/Reports/TireChangeReport';
import Alerts from './pages/Alerts/Alerts';
import Profile from './pages/Profile/Profile';
import PWAInstallPrompt from './components/PWA/PWAInstallPrompt';
import PWAUtils from './utils/pwaUtils';

function App() {
  const { user, loading } = useAuth();

  // Initialize PWA functionality
  useEffect(() => {
    PWAUtils.init();
  }, []);

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
    <>
      <LayoutTorquesmart>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardApliSmart />} />
          <Route path="/access" element={<UsersApliSmart />} />
          <Route path="/users" element={<UsersApliSmart />} />
          <Route path="/engines" element={<EnginesTorquesmart />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/vehicles/new" element={<NewVehicle />} />
          <Route path="/vehicles/:id" element={<VehicleDetail />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/drivers/assign" element={<DriverAssignment />} />
          <Route path="/users" element={<Users />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/maintenance/:id" element={<MaintenanceDetail />} />
          <Route path="/maintenance/oil-change" element={<OilChange />} />
          <Route path="/maintenance/preventive" element={<Maintenance />} />
          <Route path="/maintenance/corrective" element={<Maintenance />} />
          <Route path="/maintenance/air-conditioning" element={<Maintenance />} />
          <Route path="/maintenance/tire-change" element={<Maintenance />} />
          <Route path="/maintenance/timing-belt" element={<Maintenance />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/oil-change" element={<OilChangeReport />} />
          <Route path="/reports/preventive" element={<PreventiveReport />} />
          <Route path="/reports/corrective" element={<CorrectiveReport />} />
          <Route path="/reports/air-conditioning" element={<AirConditioningReport />} />
          <Route path="/reports/tire-change" element={<TireChangeReport />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </LayoutTorquesmart>
      <PWAInstallPrompt />
    </>
  );
}

export default App;
