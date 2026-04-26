// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Button,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Dashboard,
  DirectionsCar,
  People,
  LocalGasStation,
  Assessment,
  Warning,
  Add,
  MenuOpen,
  Notifications,
  Speed,
  Build,
  TrendingUp,
  Logout,
  Settings,
  ExpandMore,
  List,
  Person,
  BuildCircle,
  Schedule,
  AcUnit,
  TireRepair,
  SettingsEthernet,
  AccountCircle
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutFullScreenProps {
  children: React.ReactNode;
}

const LayoutFullScreen: React.FC<LayoutFullScreenProps> = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [vehiclesMenuAnchor, setVehiclesMenuAnchor] = useState<null | HTMLElement>(null);
  const [driversMenuAnchor, setDriversMenuAnchor] = useState<null | HTMLElement>(null);
  const [accessMenuAnchor, setAccessMenuAnchor] = useState<null | HTMLElement>(null);
  const [maintenanceMenuAnchor, setMaintenanceMenuAnchor] = useState<null | HTMLElement>(null);
  const [reportsMenuAnchor, setReportsMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotifications = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleDriversMenu = (event: React.MouseEvent<HTMLElement>) => {
    setDriversMenuAnchor(event.currentTarget);
  };

  const handleDriversMenuClose = () => {
    setDriversMenuAnchor(null);
  };

  const handleNewDriver = () => {
    navigate('/drivers');
    handleDriversMenuClose();
  };

  const handleOpenNewDriverDialog = () => {
    navigate('/drivers');
    // Trigger the new driver dialog after navigation
    setTimeout(() => {
      const event = new CustomEvent('openNewDriverDialog');
      window.dispatchEvent(event);
    }, 100);
    handleDriversMenuClose();
  };

  const handleAssignDriver = () => {
    navigate('/drivers/assign');
    handleDriversMenuClose();
  };

  const handleAccessMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAccessMenuAnchor(event.currentTarget);
  };

  const handleAccessMenuClose = () => {
    setAccessMenuAnchor(null);
  };

  const handleCreateUser = () => {
    navigate('/users');
    // Trigger the new user dialog after navigation
    setTimeout(() => {
      const event = new CustomEvent('openNewUserDialog');
      window.dispatchEvent(event);
    }, 100);
    handleAccessMenuClose();
  };

  const handleUserList = () => {
    navigate('/users');
    handleAccessMenuClose();
  };

  const handleCreateRoles = () => {
    navigate('/roles');
    handleAccessMenuClose();
  };

  const handleMaintenanceMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMaintenanceMenuAnchor(event.currentTarget);
  };

  const handleMaintenanceMenuClose = () => {
    setMaintenanceMenuAnchor(null);
  };

  const handleOilChange = () => {
    navigate('/maintenance/oil-change');
    handleMaintenanceMenuClose();
  };

  const handlePreventive = () => {
    navigate('/maintenance/preventive');
    handleMaintenanceMenuClose();
  };

  const handleCorrective = () => {
    navigate('/maintenance/corrective');
    handleMaintenanceMenuClose();
  };

  const handleAirConditioning = () => {
    navigate('/maintenance/air-conditioning');
    handleMaintenanceMenuClose();
  };

  const handleTireChange = () => {
    navigate('/maintenance/tire-change');
    handleMaintenanceMenuClose();
  };

  const handleTimingBelt = () => {
    navigate('/maintenance/timing-belt');
    handleMaintenanceMenuClose();
  };

  const handleReportsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setReportsMenuAnchor(event.currentTarget);
  };

  const handleReportsMenuClose = () => {
    setReportsMenuAnchor(null);
  };

  const handleOilChangeReport = () => {
    navigate('/reports/oil-change');
    handleReportsMenuClose();
  };

  const handlePreventiveReport = () => {
    navigate('/reports/preventive');
    handleReportsMenuClose();
  };

  const handleCorrectiveReport = () => {
    navigate('/reports/corrective');
    handleReportsMenuClose();
  };

  const handleAirConditioningReport = () => {
    navigate('/reports/air-conditioning');
    handleReportsMenuClose();
  };

  const handleTireChangeReport = () => {
    navigate('/reports/tire-change');
    handleReportsMenuClose();
  };

  const handleVehiclesMenu = (event: React.MouseEvent<HTMLElement>) => {
    setVehiclesMenuAnchor(event.currentTarget);
  };

  const handleVehiclesMenuClose = () => {
    setVehiclesMenuAnchor(null);
  };

  const handleNewVehicle = () => {
    navigate('/vehicles/new');
    handleVehiclesMenuClose();
  };

  const handleVehicleList = () => {
    navigate('/vehicles');
    handleVehiclesMenuClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Speed /> },
    { path: '/vehicles', label: 'Vehículos', icon: <DirectionsCar /> },
    { path: '/drivers', label: 'Conductores', icon: <Person /> },
    { path: '/engines', label: 'Motores', icon: <Build /> },
    { path: '/access', label: 'Accesos', icon: <People /> },
    { path: '/maintenance', label: 'Mantenimiento', icon: <Build /> },
    { path: '/expenses', label: 'Gastos', icon: <LocalGasStation /> },
    { path: '/reports', label: 'Reportes', icon: <Assessment /> },
    { path: '/alerts', label: 'Alertas', icon: <Warning /> },
  ];

  const notifications = [
    { id: 1, title: 'Mantenimiento Programado', description: 'Camión VOLVO FH16 - Cambio de aceite', time: 'Hace 2 horas', type: 'maintenance' },
    { id: 2, title: 'Alerta de Combustible', description: 'Vehículo MTR-001 con bajo nivel', time: 'Hace 4 horas', type: 'warning' },
    { id: 3, title: 'Mantenimiento Completado', description: 'Camión MERCEDES ACTROS - Revisión', time: 'Hace 6 horas', type: 'success' },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Left Navigation Sidebar */}
      <Box
        sx={{
          width: 240,
          background: 'linear-gradient(180deg, rgba(26, 26, 26, 0.95) 0%, rgba(42, 42, 42, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(0, 255, 136, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
        }}
      >
        {/* Logo Section */}
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: '#00ff88',
                color: '#000',
                fontSize: '20px',
                fontWeight: 'bold',
                mr: 2,
                boxShadow: '0 4px 16px rgba(0, 255, 136, 0.3)',
              }}
            >
              T
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00ff88', lineHeight: 1.2 }}>
                Torquesmart
              </Typography>
              <Typography variant="caption" sx={{ color: '#888', fontSize: '0.7rem' }}>
                Fleet System
              </Typography>
            </Box>
          </Box>
          
          {/* Status Chip */}
          <Chip
            label="Operación estable"
            size="small"
            sx={{
              bgcolor: '#00ff8820',
              color: '#00ff88',
              border: '1px solid #00ff8840',
              fontSize: '0.7rem',
              height: 24,
              width: '100%',
            }}
          />
        </Box>

        {/* Navigation Items */}
        <Box sx={{ flexGrow: 1, py: 2, overflow: 'hidden' }}>
          {navigationItems.map((item, index) => (
            <React.Fragment key={item.path}>
              {item.path === '/vehicles' ? (
                <>
                  <Button
                    onClick={handleVehiclesMenu}
                    sx={{
                      color: (location.pathname === '/vehicles' || location.pathname === '/vehicles/new') ? '#00ff88' : '#ccc',
                      backgroundColor: (location.pathname === '/vehicles' || location.pathname === '/vehicles/new') ? 'rgba(0, 255, 136, 0.1)' : 'transparent',
                      borderRadius: 0,
                      px: 3,
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      transition: 'all 0.2s ease',
                      justifyContent: 'space-between',
                      width: '100%',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 255, 136, 0.1)',
                        color: '#00ff88',
                      },
                      borderLeft: (location.pathname === '/vehicles' || location.pathname === '/vehicles/new') ? '3px solid #00ff88' : '3px solid transparent',
                    }}
                    startIcon={item.icon}
                    endIcon={<ExpandMore sx={{ fontSize: 20 }} />}
                  >
                    {item.label}
                  </Button>
                  
                  {/* Vehicles Dropdown Menu */}
                  <Menu
                    anchorEl={vehiclesMenuAnchor}
                    open={Boolean(vehiclesMenuAnchor)}
                    onClose={handleVehiclesMenuClose}
                    PaperProps={{
                      sx: {
                        bgcolor: '#000000',
                        backdropFilter: 'blur(25px)',
                        border: '1px solid rgba(0, 255, 136, 0.3)',
                        borderRadius: 2,
                        mt: 1,
                        ml: 1,
                        minWidth: 220,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                        '& .MuiList-root': {
                          padding: '8px 0',
                        }
                      }
                    }}
                  >
                    <MenuItem
                      onClick={handleVehicleList}
                      sx={{
                        color: '#fff',
                        py: 1.2,
                        px: 2.5,
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'linear-gradient(45deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 204, 106, 0.15) 100%)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ 
                        color: '#00ff88', 
                        minWidth: 40,
                        '& svg': {
                          fontSize: 20,
                        }
                      }}>
                        <List />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Lista de Vehículos" 
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#fff',
                          letterSpacing: 0.2
                        }}
                      />
                    </MenuItem>
                    <MenuItem
                      onClick={handleNewVehicle}
                      sx={{
                        color: '#fff',
                        py: 1.2,
                        px: 2.5,
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'linear-gradient(45deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 204, 106, 0.15) 100%)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ 
                        color: '#00ff88', 
                        minWidth: 40,
                        '& svg': {
                          fontSize: 20,
                        }
                      }}>
                        <Add />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Nuevo Vehículo" 
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#fff',
                          letterSpacing: 0.2
                        }}
                      />
                    </MenuItem>
                  </Menu>
                </>
              ) : item.path === '/drivers' ? (
                <>
                  <Button
                    onClick={handleDriversMenu}
                    sx={{
                      color: (location.pathname === '/drivers' || location.pathname === '/drivers/assign') ? '#00ff88' : '#ccc',
                      backgroundColor: (location.pathname === '/drivers' || location.pathname === '/drivers/assign') ? 'rgba(0, 255, 136, 0.1)' : 'transparent',
                      borderRadius: 0,
                      px: 3,
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      transition: 'all 0.2s ease',
                      justifyContent: 'space-between',
                      width: '100%',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 255, 136, 0.1)',
                        color: '#00ff88',
                      },
                      borderLeft: (location.pathname === '/drivers' || location.pathname === '/drivers/assign') ? '3px solid #00ff88' : '3px solid transparent',
                    }}
                    startIcon={item.icon}
                    endIcon={<ExpandMore sx={{ fontSize: 20 }} />}
                  >
                    {item.label}
                  </Button>
                  
                  {/* Drivers Dropdown Menu */}
                  <Menu
                    anchorEl={driversMenuAnchor}
                    open={Boolean(driversMenuAnchor)}
                    onClose={handleDriversMenuClose}
                    PaperProps={{
                      sx: {
                        bgcolor: '#000000',
                        backdropFilter: 'blur(25px)',
                        border: '1px solid rgba(0, 255, 136, 0.3)',
                        borderRadius: 2,
                        mt: 1,
                        ml: 1,
                        minWidth: 220,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                        '& .MuiList-root': {
                          padding: '8px 0',
                        }
                      }
                    }}
                  >
                    <MenuItem
                      onClick={handleNewDriver}
                      sx={{
                        color: '#fff',
                        py: 1.2,
                        px: 2.5,
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'linear-gradient(45deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 204, 106, 0.15) 100%)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ 
                        color: '#00ff88', 
                        minWidth: 40,
                        '& svg': {
                          fontSize: 20,
                        }
                      }}>
                        <Person />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Lista de Conductores" 
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#fff',
                          letterSpacing: 0.2
                        }}
                      />
                    </MenuItem>
                    <MenuItem
                      onClick={handleOpenNewDriverDialog}
                      sx={{
                        color: '#fff',
                        py: 1.2,
                        px: 2.5,
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'linear-gradient(45deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 204, 106, 0.15) 100%)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ 
                        color: '#00ff88', 
                        minWidth: 40,
                        '& svg': {
                          fontSize: 20,
                        }
                      }}>
                        <Add />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Nuevo Conductor" 
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#fff',
                          letterSpacing: 0.2
                        }}
                      />
                    </MenuItem>
                    <MenuItem
                      onClick={handleAssignDriver}
                      sx={{
                        color: '#fff',
                        py: 1.2,
                        px: 2.5,
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'linear-gradient(45deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 204, 106, 0.15) 100%)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ 
                        color: '#00ff88', 
                        minWidth: 40,
                        '& svg': {
                          fontSize: 20,
                        }
                      }}>
                        <DirectionsCar />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Asignar Conductor a Vehículo" 
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#fff',
                          letterSpacing: 0.2
                        }}
                      />
                    </MenuItem>
                  </Menu>
                </>
              ) : item.path === '/access' ? (
                <>
                  <Button
                    onClick={handleAccessMenu}
                    sx={{
                      color: (location.pathname === '/access' || location.pathname === '/users' || location.pathname === '/roles') ? '#00ff88' : '#ccc',
                      backgroundColor: (location.pathname === '/access' || location.pathname === '/users' || location.pathname === '/roles') ? 'rgba(0, 255, 136, 0.1)' : 'transparent',
                      borderRadius: 0,
                      px: 3,
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      transition: 'all 0.2s ease',
                      justifyContent: 'space-between',
                      width: '100%',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 255, 136, 0.1)',
                        color: '#00ff88',
                      },
                      borderLeft: (location.pathname === '/access' || location.pathname === '/users' || location.pathname === '/roles') ? '3px solid #00ff88' : '3px solid transparent',
                    }}
                    startIcon={item.icon}
                    endIcon={<ExpandMore sx={{ fontSize: 20 }} />}
                  >
                    {item.label}
                  </Button>
                  
                  {/* Access Dropdown Menu */}
                  <Menu
                    anchorEl={accessMenuAnchor}
                    open={Boolean(accessMenuAnchor)}
                    onClose={handleAccessMenuClose}
                    PaperProps={{
                      sx: {
                        bgcolor: '#000000',
                        backdropFilter: 'blur(25px)',
                        border: '1px solid rgba(0, 255, 136, 0.3)',
                        borderRadius: 2,
                        mt: 1,
                        ml: 1,
                        minWidth: 220,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                        '& .MuiList-root': {
                          padding: '8px 0',
                        }
                      }
                    }}
                  >
                    <MenuItem
                      onClick={handleCreateUser}
                      sx={{
                        color: '#fff',
                        py: 1.2,
                        px: 2.5,
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'linear-gradient(45deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 204, 106, 0.15) 100%)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ 
                        color: '#00ff88', 
                        minWidth: 40,
                        '& svg': {
                          fontSize: 20,
                        }
                      }}>
                        <Add />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Crear Usuarios" 
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#fff',
                          letterSpacing: 0.2
                        }}
                      />
                    </MenuItem>
                    <MenuItem
                      onClick={handleUserList}
                      sx={{
                        color: '#fff',
                        py: 1.2,
                        px: 2.5,
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'linear-gradient(45deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 204, 106, 0.15) 100%)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ 
                        color: '#00ff88', 
                        minWidth: 40,
                        '& svg': {
                          fontSize: 20,
                        }
                      }}>
                        <List />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Lista de Usuarios" 
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#fff',
                          letterSpacing: 0.2
                        }}
                      />
                    </MenuItem>
                    <MenuItem
                      onClick={handleCreateRoles}
                      sx={{
                        color: '#fff',
                        py: 1.2,
                        px: 2.5,
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'linear-gradient(45deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 204, 106, 0.15) 100%)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ 
                        color: '#00ff88', 
                        minWidth: 40,
                        '& svg': {
                          fontSize: 20,
                        }
                      }}>
                        <Settings />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Crear Roles" 
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#fff',
                          letterSpacing: 0.2
                        }}
                      />
                    </MenuItem>
                  </Menu>
                </>
              ) : item.path === '/maintenance' ? (
                <>
                  <Button
                    onClick={handleMaintenanceMenu}
                    sx={{
                      color: (location.pathname.startsWith('/maintenance')) ? '#00ff88' : '#ccc',
                      backgroundColor: (location.pathname.startsWith('/maintenance')) ? 'rgba(0, 255, 136, 0.1)' : 'transparent',
                      borderRadius: 0,
                      px: 3,
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      transition: 'all 0.2s ease',
                      justifyContent: 'space-between',
                      width: '100%',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 255, 136, 0.1)',
                        color: '#00ff88',
                      },
                      borderLeft: (location.pathname.startsWith('/maintenance')) ? '3px solid #00ff88' : '3px solid transparent',
                    }}
                    startIcon={item.icon}
                    endIcon={<ExpandMore sx={{ fontSize: 20 }} />}
                  >
                    {item.label}
                  </Button>
                  
                  {/* Maintenance Dropdown Menu */}
                  <Menu
                    anchorEl={maintenanceMenuAnchor}
                    open={Boolean(maintenanceMenuAnchor)}
                    onClose={handleMaintenanceMenuClose}
                    PaperProps={{
                      sx: {
                        bgcolor: '#000000',
                        backdropFilter: 'blur(25px)',
                        border: '1px solid rgba(0, 255, 136, 0.3)',
                        borderRadius: 2,
                        mt: 1,
                        ml: 1,
                        minWidth: 280,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                      }
                    }}
                  >
                    <MenuItem
                      onClick={handleOilChange}
                      sx={{
                        color: '#fff',
                        py: 1.2,
                        px: 2.5,
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'linear-gradient(45deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 204, 106, 0.15) 100%)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ 
                        color: '#00ff88', 
                        minWidth: 40,
                        '& svg': {
                          fontSize: 20,
                        }
                      }}>
                        <Build />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Cambios de Aceite" 
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#fff',
                          letterSpacing: 0.2
                        }}
                      />
                    </MenuItem>
                    <MenuItem
                      onClick={handlePreventive}
                      sx={{
                        color: '#fff',
                        py: 1.2,
                        px: 2.5,
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'linear-gradient(45deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 204, 106, 0.15) 100%)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ 
                        color: '#00ff88', 
                        minWidth: 40,
                        '& svg': {
                          fontSize: 20,
                        }
                      }}>
                        <Schedule />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Preventivo" 
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#fff',
                          letterSpacing: 0.2
                        }}
                      />
                    </MenuItem>
                    <MenuItem
                      onClick={handleCorrective}
                      sx={{
                        color: '#fff',
                        py: 1.2,
                        px: 2.5,
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'linear-gradient(45deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 204, 106, 0.15) 100%)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ 
                        color: '#00ff88', 
                        minWidth: 40,
                        '& svg': {
                          fontSize: 20,
                        }
                      }}>
                        <BuildCircle />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Correctivo" 
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#fff',
                          letterSpacing: 0.2
                        }}
                      />
                    </MenuItem>
                    <MenuItem
                      onClick={handleAirConditioning}
                      sx={{
                        color: '#fff',
                        py: 1.2,
                        px: 2.5,
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'linear-gradient(45deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 204, 106, 0.15) 100%)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ 
                        color: '#00ff88', 
                        minWidth: 40,
                        '& svg': {
                          fontSize: 20,
                        }
                      }}>
                        <AcUnit />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Aire Acondicionado" 
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#fff',
                          letterSpacing: 0.2
                        }}
                      />
                    </MenuItem>
                    <MenuItem
                      onClick={handleTireChange}
                      sx={{
                        color: '#fff',
                        py: 1.2,
                        px: 2.5,
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'linear-gradient(45deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 204, 106, 0.15) 100%)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ 
                        color: '#00ff88', 
                        minWidth: 40,
                        '& svg': {
                          fontSize: 20,
                        }
                      }}>
                        <TireRepair />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Cambio de Llantas" 
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#fff',
                          letterSpacing: 0.2
                        }}
                      />
                    </MenuItem>
                    <MenuItem
                      onClick={handleTimingBelt}
                      sx={{
                        color: '#fff',
                        py: 1.2,
                        px: 2.5,
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'linear-gradient(45deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 204, 106, 0.15) 100%)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ 
                        color: '#00ff88', 
                        minWidth: 40,
                        '& svg': {
                          fontSize: 20,
                        }
                      }}>
                        <SettingsEthernet />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Bandas de Distribución" 
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#fff',
                          letterSpacing: 0.2
                        }}
                      />
                    </MenuItem>
                  </Menu>
                </>
              ) : item.path === '/reports' ? (
                <>
                  <Button
                    onClick={handleReportsMenu}
                    sx={{
                      color: (location.pathname.startsWith('/reports')) ? '#00ff88' : '#ccc',
                      backgroundColor: (location.pathname.startsWith('/reports')) ? 'rgba(0, 255, 136, 0.1)' : 'transparent',
                      borderRadius: 0,
                      px: 3,
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      transition: 'all 0.2s ease',
                      justifyContent: 'space-between',
                      width: '100%',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 255, 136, 0.1)',
                        color: '#00ff88',
                      },
                      borderLeft: (location.pathname.startsWith('/reports')) ? '3px solid #00ff88' : '3px solid transparent',
                    }}
                    startIcon={item.icon}
                    endIcon={<ExpandMore sx={{ fontSize: 20 }} />}
                  >
                    {item.label}
                  </Button>
                  
                  {/* Reports Dropdown Menu */}
                  <Menu
                    anchorEl={reportsMenuAnchor}
                    open={Boolean(reportsMenuAnchor)}
                    onClose={handleReportsMenuClose}
                    PaperProps={{
                      sx: {
                        bgcolor: '#000000',
                        backdropFilter: 'blur(25px)',
                        border: '1px solid rgba(0, 255, 136, 0.3)',
                        borderRadius: 2,
                        mt: 1,
                        ml: 1,
                        minWidth: 280,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                      }
                    }}
                  >
                    <MenuItem
                      onClick={handleOilChangeReport}
                      sx={{
                        color: '#fff',
                        py: 1.2,
                        px: 2.5,
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'linear-gradient(45deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 204, 106, 0.15) 100%)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ 
                        color: '#00ff88', 
                        minWidth: 40,
                        '& svg': {
                          fontSize: 20,
                        }
                      }}>
                        <Build />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Cambios de Aceite" 
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#fff',
                          letterSpacing: 0.2
                        }}
                      />
                    </MenuItem>
                    <MenuItem
                      onClick={handlePreventiveReport}
                      sx={{
                        color: '#fff',
                        py: 1.2,
                        px: 2.5,
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'linear-gradient(45deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 204, 106, 0.15) 100%)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ 
                        color: '#00ff88', 
                        minWidth: 40,
                        '& svg': {
                          fontSize: 20,
                        }
                      }}>
                        <Schedule />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Mantenimiento Preventivo" 
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#fff',
                          letterSpacing: 0.2
                        }}
                      />
                    </MenuItem>
                    <MenuItem
                      onClick={handleCorrectiveReport}
                      sx={{
                        color: '#fff',
                        py: 1.2,
                        px: 2.5,
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'linear-gradient(45deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 204, 106, 0.15) 100%)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ 
                        color: '#00ff88', 
                        minWidth: 40,
                        '& svg': {
                          fontSize: 20,
                        }
                      }}>
                        <BuildCircle />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Mantenimiento Correctivo" 
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#fff',
                          letterSpacing: 0.2
                        }}
                      />
                    </MenuItem>
                    <MenuItem
                      onClick={handleAirConditioningReport}
                      sx={{
                        color: '#fff',
                        py: 1.2,
                        px: 2.5,
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'linear-gradient(45deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 204, 106, 0.15) 100%)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ 
                        color: '#00ff88', 
                        minWidth: 40,
                        '& svg': {
                          fontSize: 20,
                        }
                      }}>
                        <AcUnit />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Aire Acondicionado" 
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#fff',
                          letterSpacing: 0.2
                        }}
                      />
                    </MenuItem>
                    <MenuItem
                      onClick={handleTireChangeReport}
                      sx={{
                        color: '#fff',
                        py: 1.2,
                        px: 2.5,
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'linear-gradient(45deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 204, 106, 0.15) 100%)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ 
                        color: '#00ff88', 
                        minWidth: 40,
                        '& svg': {
                          fontSize: 20,
                        }
                      }}>
                        <TireRepair />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Cambio de Llantas" 
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#fff',
                          letterSpacing: 0.2
                        }}
                      />
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: location.pathname === item.path ? '#00ff88' : '#ccc',
                    backgroundColor: location.pathname === item.path ? 'rgba(0, 255, 136, 0.1)' : 'transparent',
                    borderRadius: 0,
                    px: 3,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    justifyContent: 'flex-start',
                    width: '100%',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 255, 136, 0.1)',
                      color: '#00ff88',
                    },
                    borderLeft: location.pathname === item.path ? '3px solid #00ff88' : '3px solid transparent',
                  }}
                  startIcon={item.icon}
                >
                  {item.label}
                </Button>
              )}
            </React.Fragment>
          ))}
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <AppBar
          position="static"
          sx={{
            background: 'linear-gradient(90deg, rgba(26, 26, 26, 0.95) 0%, rgba(42, 42, 42, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(0, 255, 136, 0.2)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
          }}
        >
          <Toolbar>
            <Box sx={{ flexGrow: 1 }} />
            
            {/* Notifications */}
            <Box sx={{ mr: 2 }}>
              <IconButton
                onClick={handleNotifications}
                sx={{
                  color: '#ccc',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    color: '#00ff88',
                  },
                }}
              >
                <Notifications />
              </IconButton>
            </Box>

            {/* User Profile */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                onClick={handleMenu}
                sx={{
                  color: '#ccc',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    color: '#00ff88',
                  },
                }}
              >
                <AccountCircle />
              </IconButton>
              
              {/* User Profile Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    bgcolor: '#000000',
                    backdropFilter: 'blur(25px)',
                    border: '1px solid rgba(0, 255, 136, 0.3)',
                    borderRadius: 2,
                    mt: 1.5,
                    minWidth: 200,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                  }
                }}
              >
                <MenuItem
                  onClick={() => navigate('/profile')}
                  sx={{
                    color: '#fff',
                    '&:hover': {
                      bgcolor: 'rgba(0, 255, 136, 0.1)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: '#00ff88', minWidth: 40 }}>
                    <AccountCircle />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Perfil" 
                    primaryTypographyProps={{ 
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#fff'
                    }}
                  />
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    color: '#ff6b6b',
                    '&:hover': {
                      bgcolor: 'rgba(255, 107, 107, 0.1)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: '#ff6b6b', minWidth: 40 }}>
                    <Logout />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Cerrar Sesión" 
                    primaryTypographyProps={{ 
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#ff6b6b'
                    }}
                  />
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationsAnchor}
          open={Boolean(notificationsAnchor)}
          onClose={handleNotificationsClose}
          PaperProps={{
            sx: {
              bgcolor: '#000000',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: 2,
              mt: 1.5,
              minWidth: 320,
              maxHeight: 400,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
            }
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
              Notificaciones
            </Typography>
          </Box>
          {notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={handleNotificationsClose}
              sx={{
                color: '#fff',
                py: 1.5,
                px: 2,
                '&:hover': {
                  bgcolor: 'rgba(0, 255, 136, 0.1)',
                },
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                  {notification.title}
                </Typography>
                <Typography variant="caption" sx={{ color: '#888', mb: 0.5 }}>
                  {notification.description}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>

        {/* Page Content */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default LayoutFullScreen;
