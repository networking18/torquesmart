// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Grid,
  Fade,
  Slide,
  Container,
  Tooltip,
  Menu,
  MenuItem,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material';
import {
  Person,
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  FilterList,
  MoreVert,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Phone,
  Email,
  LocationOn,
  Badge
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Driver {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  license: string;
  licenseType: string;
  status: string;
  assignedVehicle: string;
  address: string;
  city: string;
  experience: string;
  createdAt: string;
}

class DriverStorage {
  private static readonly STORAGE_KEY = 'torquesmart_drivers';

  static getDrivers(): Driver[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultDrivers();
    } catch (error) {
      console.error('Error loading drivers:', error);
      return this.getDefaultDrivers();
    }
  }

  static saveDriver(driverData: Omit<Driver, 'id' | 'createdAt'>): Driver {
    const drivers = this.getDrivers();
    const newDriver: Driver = {
      ...driverData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    drivers.push(newDriver);
    this.saveDrivers(drivers);
    return newDriver;
  }

  static updateDriver(id: string, updates: Partial<Driver>): Driver | null {
    const drivers = this.getDrivers();
    const index = drivers.findIndex(d => d.id === id);
    
    if (index === -1) return null;
    
    drivers[index] = { ...drivers[index], ...updates };
    this.saveDrivers(drivers);
    return drivers[index];
  }

  static deleteDriver(id: string): boolean {
    const drivers = this.getDrivers();
    const filteredDrivers = drivers.filter(d => d.id !== id);
    
    if (filteredDrivers.length === drivers.length) return false;
    
    this.saveDrivers(filteredDrivers);
    return true;
  }

  static getDriverById(id: string): Driver | null {
    const drivers = this.getDrivers();
    return drivers.find(d => d.id === id) || null;
  }

  private static saveDrivers(drivers: Driver[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(drivers));
    } catch (error) {
      console.error('Error saving drivers:', error);
    }
  }

  private static getDefaultDrivers(): Driver[] {
    return [
      {
        id: '1',
        name: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@torquesmart.com',
        phone: '+1 234-567-8901',
        license: 'LIC-2023-001',
        licenseType: 'Comercial',
        status: 'active',
        assignedVehicle: 'ABC-123',
        address: 'Calle Principal #123',
        city: 'Ciudad Central',
        experience: '5 años',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        name: 'Carlos',
        lastName: 'Rodríguez',
        email: 'carlos.rodriguez@torquesmart.com',
        phone: '+1 234-567-8902',
        license: 'LIC-2022-002',
        licenseType: 'Comercial',
        status: 'active',
        assignedVehicle: 'DEF-456',
        address: 'Avenida Secundaria #456',
        city: 'Ciudad Norte',
        experience: '8 años',
        createdAt: '2024-02-20T14:15:00Z'
      },
      {
        id: '3',
        name: 'María',
        lastName: 'González',
        email: 'maria.gonzalez@torquesmart.com',
        phone: '+1 234-567-8903',
        license: 'LIC-2023-003',
        licenseType: 'Comercial',
        status: 'inactive',
        assignedVehicle: 'Ninguno',
        address: 'Boulevard Este #789',
        city: 'Ciudad Sur',
        experience: '3 años',
        createdAt: '2024-03-10T09:45:00Z'
      }
    ];
  }

  static getDriverStats() {
    const drivers = this.getDrivers();
    return {
      total: drivers.length,
      active: drivers.filter(d => d.status === 'active').length,
      inactive: drivers.filter(d => d.status === 'inactive').length,
      assigned: drivers.filter(d => d.assignedVehicle && d.assignedVehicle !== 'Ninguno').length
    };
  }
}

const Drivers: React.FC = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [newDriverDialogOpen, setNewDriverDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    license: '',
    licenseType: 'Comercial',
    status: 'active',
    address: '',
    city: '',
    experience: ''
  });

  useEffect(() => {
    loadDrivers();
    
    // Listen for custom event to open new driver dialog
    const handleOpenDialog = () => {
      setNewDriverDialogOpen(true);
    };
    
    window.addEventListener('openNewDriverDialog', handleOpenDialog);
    
    return () => {
      window.removeEventListener('openNewDriverDialog', handleOpenDialog);
    };
  }, []);

  useEffect(() => {
    filterDrivers();
  }, [drivers, searchTerm, filterStatus]);

  const loadDrivers = () => {
    setLoading(true);
    try {
      const storedDrivers = DriverStorage.getDrivers();
      setDrivers(storedDrivers);
    } catch (error) {
      console.error('Error loading drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDrivers = () => {
    let filtered = drivers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(driver =>
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.phone.includes(searchTerm) ||
        driver.license.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(driver => driver.status === filterStatus);
    }

    setFilteredDrivers(filtered);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, driver: Driver) => {
    setAnchorEl(event.currentTarget);
    setSelectedDriver(driver);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDriver(null);
  };

  const handleDeleteDriver = () => {
    if (selectedDriver) {
      DriverStorage.deleteDriver(selectedDriver.id);
      loadDrivers();
      handleMenuClose();
    }
  };

  const handleNewDriver = () => {
    setNewDriverDialogOpen(true);
  };

  const handleNewDriverClose = () => {
    setNewDriverDialogOpen(false);
    setFormData({
      name: '',
      lastName: '',
      email: '',
      phone: '',
      license: '',
      licenseType: 'Comercial',
      status: 'active',
      address: '',
      city: '',
      experience: ''
    });
  };

  const handleSaveNewDriver = () => {
    // Validate required fields
    if (!formData.name || !formData.lastName || !formData.email || !formData.phone) {
      alert('Por favor complete los campos obligatorios: Nombre, Apellido, Email y Teléfono');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Por favor ingrese un email válido');
      return;
    }

    // Create new driver object
    const newDriver = {
      ...formData,
      id: Date.now().toString(), // Generate unique ID
      createdAt: new Date().toISOString(),
      assignedVehicle: 'Ninguno'
    };

    try {
      DriverStorage.saveDriver(newDriver);
      loadDrivers(); // Refresh the driver list
      handleNewDriverClose(); // Close dialog
      
      // Show success message
      alert('¡Conductor registrado exitosamente!');
    } catch (error) {
      console.error('Error saving driver:', error);
      alert('Error al guardar el conductor. Por favor intente nuevamente.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#6bcf7f';
      case 'inactive': return '#ff6b6b';
      default: return '#868e96';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle fontSize="small" />;
      case 'inactive': return <ErrorIcon fontSize="small" />;
      default: return null;
    }
  };

  const stats = DriverStorage.getDriverStats();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 80% 20%, rgba(0, 255, 136, 0.05) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(0, 255, 136, 0.03) 0%, transparent 50%)',
        }
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          right: '5%',
          width: 150,
          height: 150,
          background: 'radial-gradient(circle, rgba(0, 255, 136, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 10s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '8%',
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(0, 255, 136, 0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 12s ease-in-out infinite reverse',
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 3 }}>
        {/* Header */}
        <Fade in={true} timeout={800}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  sx={{
                    bgcolor: '#00ff88',
                    color: '#000',
                    width: 48,
                    height: 48,
                    mr: 2,
                    boxShadow: '0 4px 16px rgba(0, 255, 136, 0.3)',
                  }}
                >
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>
                    Gestión de Conductores
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#888' }}>
                    Administra y asigna conductores a los vehículos
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleNewDriver}
                sx={{
                  background: 'linear-gradient(45deg, #00ff88 0%, #00cc6a 100%)',
                  color: '#000',
                  fontWeight: 600,
                  px: 3,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #00cc6a 0%, #00ff88 100%)',
                  },
                }}
              >
                Nuevo Conductor
              </Button>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    background: 'rgba(26, 26, 26, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0, 255, 136, 0.2)',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
                          {stats.total}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#888' }}>
                          Total Conductores
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: '#00ff88', color: '#000' }}>
                        <Person />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    background: 'rgba(26, 26, 26, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(107, 207, 127, 0.2)',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
                          {stats.active}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#888' }}>
                          Activos
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: '#6bcf7f', color: '#000' }}>
                        <CheckCircle />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    background: 'rgba(26, 26, 26, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 107, 107, 0.2)',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
                          {stats.inactive}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#888' }}>
                          Inactivos
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: '#ff6b6b', color: '#fff' }}>
                        <ErrorIcon />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    background: 'rgba(26, 26, 26, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 217, 61, 0.2)',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
                          {stats.assigned}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#888' }}>
                          Asignados
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: '#ffd93d', color: '#000' }}>
                        <Badge />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Search and Filter */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                placeholder="Buscar por nombre, apellido, email, teléfono o licencia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  flexGrow: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                  },
                  '& .MuiInputLabel-root': { color: '#888' },
                  '& .MuiInputBase-input': { color: '#fff' },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#888' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                sx={{
                  minWidth: 150,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                  },
                  '& .MuiInputLabel-root': { color: '#888' },
                  '& .MuiInputBase-input': { color: '#fff' },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterList sx={{ color: '#888' }} />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="active">Activos</MenuItem>
                <MenuItem value="inactive">Inactivos</MenuItem>
              </TextField>
            </Box>
          </Box>
        </Fade>

        {/* Drivers Table */}
        <Slide direction="up" in={true} timeout={1000}>
          <Card
            sx={{
              background: 'rgba(26, 26, 26, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            {loading && <LinearProgress />}
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ '& th': { color: '#00ff88', fontWeight: 600 } }}>
                      <TableCell>Conductor</TableCell>
                      <TableCell>Contacto</TableCell>
                      <TableCell>Licencia</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Vehículo Asignado</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDrivers.map((driver) => (
                      <TableRow
                        key={driver.id}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(0, 255, 136, 0.05)',
                          },
                          '& td': { color: '#fff', borderColor: 'rgba(255, 255, 255, 0.1)' },
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              sx={{
                                bgcolor: '#00ff88',
                                color: '#000',
                                width: 40,
                                height: 40,
                                mr: 2,
                              }}
                            >
                              <Person />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {driver.name} {driver.lastName}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#888' }}>
                                {driver.experience} de experiencia
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <Phone sx={{ fontSize: 16, mr: 1, color: '#888' }} />
                              <Typography variant="body2">{driver.phone}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Email sx={{ fontSize: 16, mr: 1, color: '#888' }} />
                              <Typography variant="caption" sx={{ color: '#888' }}>
                                {driver.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {driver.license}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#888' }}>
                              {driver.licenseType}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(driver.status)}
                            label={getStatusLabel(driver.status)}
                            size="small"
                            sx={{
                              bgcolor: `${getStatusColor(driver.status)}20`,
                              color: getStatusColor(driver.status),
                              border: `1px solid ${getStatusColor(driver.status)}40`,
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {driver.assignedVehicle || 'No asignado'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Ver detalles">
                              <IconButton
                                size="small"
                                sx={{
                                  color: '#00ff88',
                                  '&:hover': { backgroundColor: 'rgba(0, 255, 136, 0.1)' }
                                }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <IconButton
                                size="small"
                                sx={{
                                  color: '#888',
                                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Más opciones">
                              <IconButton
                                size="small"
                                onClick={(e) => handleMenuClick(e, driver)}
                                sx={{
                                  color: '#888',
                                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                                }}
                              >
                                <MoreVert fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Slide>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              bgcolor: 'rgba(26, 26, 26, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
            }
          }}
        >
          <MenuItem
            onClick={handleMenuClose}
            sx={{
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(0, 255, 136, 0.1)' },
            }}
          >
            <Visibility sx={{ mr: 2, color: '#00ff88' }} />
            Ver Detalles
          </MenuItem>
          <MenuItem
            onClick={handleMenuClose}
            sx={{
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(0, 255, 136, 0.1)' },
            }}
          >
            <Edit sx={{ mr: 2, color: '#00ff88' }} />
            Editar
          </MenuItem>
          <MenuItem
            onClick={handleDeleteDriver}
            sx={{
              color: '#ff6b6b',
              '&:hover': { bgcolor: 'rgba(255, 107, 107, 0.1)' },
            }}
          >
            <Delete sx={{ mr: 2 }} />
            Eliminar
          </MenuItem>
        </Menu>

        {/* New Driver Dialog */}
        <Dialog
          open={newDriverDialogOpen}
          onClose={handleNewDriverClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: 'rgba(26, 26, 26, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              borderRadius: 3,
            }
          }}
        >
          <DialogTitle sx={{ color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Nuevo Conductor
              </Typography>
              <IconButton onClick={handleNewDriverClose} sx={{ color: '#fff' }}>
                ×
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                    },
                    '& .MuiInputLabel-root': { color: '#888' },
                    '& .MuiInputBase-input': { color: '#fff' },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Apellido"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                    },
                    '& .MuiInputLabel-root': { color: '#888' },
                    '& .MuiInputBase-input': { color: '#fff' },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                    },
                    '& .MuiInputLabel-root': { color: '#888' },
                    '& .MuiInputBase-input': { color: '#fff' },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                    },
                    '& .MuiInputLabel-root': { color: '#888' },
                    '& .MuiInputBase-input': { color: '#fff' },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Licencia"
                  value={formData.license}
                  onChange={(e) => setFormData({...formData, license: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                    },
                    '& .MuiInputLabel-root': { color: '#888' },
                    '& .MuiInputBase-input': { color: '#fff' },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#888' }}>Tipo de Licencia</InputLabel>
                  <Select
                    value={formData.licenseType}
                    onChange={(e) => setFormData({...formData, licenseType: e.target.value})}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: '#000000',
                          backdropFilter: 'blur(25px)',
                          border: '1px solid rgba(0, 255, 136, 0.3)',
                          borderRadius: 2,
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                        }
                      }
                    }}
                    sx={{
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 255, 136, 0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 255, 136, 0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00ff88',
                      },
                    }}
                  >
                    <MenuItem value="Comercial" sx={{ color: '#fff' }}>Comercial</MenuItem>
                    <MenuItem value="Particular" sx={{ color: '#fff' }}>Particular</MenuItem>
                    <MenuItem value="Motocicleta" sx={{ color: '#fff' }}>Motocicleta</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#888' }}>Estado</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: '#000000',
                          backdropFilter: 'blur(25px)',
                          border: '1px solid rgba(0, 255, 136, 0.3)',
                          borderRadius: 2,
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                        }
                      }
                    }}
                    sx={{
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 255, 136, 0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 255, 136, 0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00ff88',
                      },
                    }}
                  >
                    <MenuItem value="active" sx={{ color: '#fff' }}>Activo</MenuItem>
                    <MenuItem value="inactive" sx={{ color: '#fff' }}>Inactivo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Dirección"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                    },
                    '& .MuiInputLabel-root': { color: '#888' },
                    '& .MuiInputBase-input': { color: '#fff' },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ciudad"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                    },
                    '& .MuiInputLabel-root': { color: '#888' },
                    '& .MuiInputBase-input': { color: '#fff' },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Experiencia"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                    },
                    '& .MuiInputLabel-root': { color: '#888' },
                    '& .MuiInputBase-input': { color: '#fff' },
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', p: 2 }}>
            <Button onClick={handleNewDriverClose} sx={{ color: '#888' }}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveNewDriver}
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #00ff88 0%, #00cc6a 100%)',
                color: '#000',
                fontWeight: 600,
              }}
            >
              Guardar Conductor
            </Button>
          </DialogActions>
        </Dialog>
      </Container>

      {/* Global Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </Box>
  );
};

export default Drivers;
