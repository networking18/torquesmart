// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  IconButton,
  Fade,
  Slide,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider
} from '@mui/material';
import {
  Person,
  DirectionsCar,
  ArrowBack,
  Save,
  CheckCircle,
  Error as ErrorIcon,
  Warning,
  Assignment,
  Phone,
  Email,
  LocationOn,
  Badge
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import VehicleStorage, { Vehicle } from '../../utils/vehicleStorage';
import { Driver } from './Drivers';

const DriverAssignment: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [assignments, setAssignments] = useState<{driverId: string, vehicleId: string}[]>([]);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      // Load drivers from localStorage
      const storedDrivers = localStorage.getItem('torquesmart_drivers');
      const driversData = storedDrivers ? JSON.parse(storedDrivers) : getDefaultDrivers();
      setDrivers(driversData);

      // Load vehicles from VehicleStorage
      const vehiclesData = VehicleStorage.getVehicles();
      setVehicles(vehiclesData);

      // Load existing assignments
      const storedAssignments = localStorage.getItem('torquesmart_assignments');
      if (storedAssignments) {
        setAssignments(JSON.parse(storedAssignments));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultDrivers = () => {
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
  };

  const handleAssignDriver = () => {
    if (!selectedDriver || !selectedVehicle) {
      setErrorDialogOpen(true);
      return;
    }

    try {
      // Update driver assignment
      const updatedDrivers = drivers.map(driver => {
        if (driver.id === selectedDriver) {
          return { ...driver, assignedVehicle: selectedVehicle };
        }
        return driver;
      });
      localStorage.setItem('torquesmart_drivers', JSON.stringify(updatedDrivers));

      // Update vehicle driver
      const selectedDriverData = drivers.find(d => d.id === selectedDriver);
      const updatedVehicles = vehicles.map(vehicle => {
        if (vehicle.id === selectedVehicle) {
          return { ...vehicle, driver: `${selectedDriverData?.name} ${selectedDriverData?.lastName}` };
        }
        return vehicle;
      });
      VehicleStorage.saveVehicles(updatedVehicles);

      // Save assignment record
      const newAssignment = { driverId: selectedDriver, vehicleId: selectedVehicle };
      const updatedAssignments = [...assignments, newAssignment];
      localStorage.setItem('torquesmart_assignments', JSON.stringify(updatedAssignments));

      setSuccessDialogOpen(true);
      setSelectedDriver('');
      setSelectedVehicle('');
      loadData();
    } catch (error) {
      console.error('Error assigning driver:', error);
      setErrorDialogOpen(true);
    }
  };

  const getDriverById = (id: string) => {
    return drivers.find(d => d.id === id);
  };

  const getVehicleById = (id: string) => {
    return vehicles.find(v => v.id === id);
  };

  const getAvailableVehicles = () => {
    const assignedVehicleIds = assignments.map(a => a.vehicleId);
    return vehicles.filter(v => !assignedVehicleIds.includes(v.id));
  };

  const getAvailableDrivers = () => {
    const assignedDriverIds = assignments.map(a => a.driverId);
    return drivers.filter(d => !assignedDriverIds.includes(d.id) && d.status === 'active');
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

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
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <IconButton
                onClick={() => navigate('/drivers')}
                sx={{
                  color: '#00ff88',
                  mr: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                  }
                }}
              >
                <ArrowBack />
              </IconButton>
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
                <Assignment />
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>
                  Asignar Conductor a Vehículo
                </Typography>
                <Typography variant="body2" sx={{ color: '#888' }}>
                  Selecciona un conductor y un vehículo para crear la asignación
                </Typography>
              </Box>
            </Box>
          </Box>
        </Fade>

        {/* Assignment Form */}
        <Slide direction="up" in={true} timeout={1000}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  background: 'rgba(26, 26, 26, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 255, 136, 0.2)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: '#00ff88', mb: 2, fontWeight: 600 }}>
                    Seleccionar Conductor
                  </Typography>
                  
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel sx={{ color: '#888' }}>Conductor</InputLabel>
                    <Select
                      value={selectedDriver}
                      onChange={(e) => setSelectedDriver(e.target.value)}
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
                      {getAvailableDrivers().map((driver) => (
                        <MenuItem key={driver.id} value={driver.id} sx={{ color: '#fff' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Avatar sx={{ bgcolor: '#00ff88', color: '#000', width: 32, height: 32, mr: 2 }}>
                              <Person fontSize="small" />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {driver.name} {driver.lastName}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#888' }}>
                                {driver.license} • {driver.experience}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {selectedDriver && (
                    <Box sx={{ p: 2, bgcolor: 'rgba(0, 255, 136, 0.1)', borderRadius: 2 }}>
                      {(() => {
                        const driver = getDriverById(selectedDriver);
                        return driver ? (
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Avatar sx={{ bgcolor: '#00ff88', color: '#000', width: 40, height: 40, mr: 2 }}>
                                <Person />
                              </Avatar>
                              <Box>
                                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                                  {driver.name} {driver.lastName}
                                </Typography>
                                <Chip
                                  icon={<CheckCircle fontSize="small" />}
                                  label="Activo"
                                  size="small"
                                  sx={{
                                    bgcolor: '#6bcf7f20',
                                    color: '#6bcf7f',
                                    border: '1px solid #6bcf7f40',
                                    fontWeight: 500,
                                  }}
                                />
                              </Box>
                            </Box>
                            
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <Phone sx={{ fontSize: 16, mr: 1, color: '#888' }} />
                                  <Typography variant="body2" sx={{ color: '#fff' }}>
                                    {driver.phone}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <Email sx={{ fontSize: 16, mr: 1, color: '#888' }} />
                                  <Typography variant="body2" sx={{ color: '#fff' }}>
                                    {driver.email}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Badge sx={{ fontSize: 16, mr: 1, color: '#888' }} />
                                  <Typography variant="body2" sx={{ color: '#fff' }}>
                                    {driver.license} • {driver.licenseType}
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        ) : null;
                      })()}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  background: 'rgba(26, 26, 26, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 255, 136, 0.2)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: '#00ff88', mb: 2, fontWeight: 600 }}>
                    Seleccionar Vehículo
                  </Typography>
                  
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel sx={{ color: '#888' }}>Vehículo</InputLabel>
                    <Select
                      value={selectedVehicle}
                      onChange={(e) => setSelectedVehicle(e.target.value)}
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
                      {getAvailableVehicles().map((vehicle) => (
                        <MenuItem key={vehicle.id} value={vehicle.id} sx={{ color: '#fff' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Avatar sx={{ bgcolor: '#00ff88', color: '#000', width: 32, height: 32, mr: 2 }}>
                              <DirectionsCar fontSize="small" />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {vehicle.plate}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#888' }}>
                                {vehicle.brand} {vehicle.model} • {vehicle.year}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {selectedVehicle && (
                    <Box sx={{ p: 2, bgcolor: 'rgba(0, 255, 136, 0.1)', borderRadius: 2 }}>
                      {(() => {
                        const vehicle = getVehicleById(selectedVehicle);
                        return vehicle ? (
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Avatar sx={{ bgcolor: '#00ff88', color: '#000', width: 40, height: 40, mr: 2 }}>
                                <DirectionsCar />
                              </Avatar>
                              <Box>
                                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                                  {vehicle.plate}
                                </Typography>
                                <Chip
                                  label={vehicle.status === 'active' ? 'Disponible' : 'Ocupado'}
                                  size="small"
                                  sx={{
                                    bgcolor: vehicle.status === 'active' ? '#6bcf7f20' : '#ffd93d20',
                                    color: vehicle.status === 'active' ? '#6bcf7f' : '#ffd93d',
                                    border: `1px solid ${vehicle.status === 'active' ? '#6bcf7f40' : '#ffd93d40'}`,
                                    fontWeight: 500,
                                  }}
                                />
                              </Box>
                            </Box>
                            
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" sx={{ color: '#fff' }}>
                                  <strong>Marca:</strong> {vehicle.brand}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" sx={{ color: '#fff' }}>
                                  <strong>Modelo:</strong> {vehicle.model}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" sx={{ color: '#fff' }}>
                                  <strong>Año:</strong> {vehicle.year}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" sx={{ color: '#fff' }}>
                                  <strong>Kilometraje:</strong> {parseInt(vehicle.mileage || '0').toLocaleString()} km
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        ) : null;
                      })()}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card
                sx={{
                  background: 'rgba(26, 26, 26, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 255, 136, 0.2)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#00ff88', mb: 2, fontWeight: 600 }}>
                    Confirmar Asignación
                  </Typography>
                  
                  {selectedDriver && selectedVehicle ? (
                    <Box>
                      <Typography variant="body1" sx={{ color: '#fff', mb: 2 }}>
                        ¿Estás seguro de asignar{' '}
                        <strong>{getDriverById(selectedDriver)?.name} {getDriverById(selectedDriver)?.lastName}</strong>
                        {' '}al vehículo{' '}
                        <strong>{getVehicleById(selectedVehicle)?.plate}</strong>?
                      </Typography>
                      
                      <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleAssignDriver}
                        sx={{
                          background: 'linear-gradient(45deg, #00ff88 0%, #00cc6a 100%)',
                          color: '#000',
                          fontWeight: 600,
                          px: 4,
                          '&:hover': {
                            background: 'linear-gradient(45deg, #00cc6a 0%, #00ff88 100%)',
                          },
                        }}
                      >
                        Confirmar Asignación
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="body2" sx={{ color: '#888', mb: 2 }}>
                        Por favor selecciona un conductor y un vehículo para continuar
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        {!selectedDriver && (
                          <Chip
                            icon={<Person />}
                            label="Selecciona un conductor"
                            sx={{
                              bgcolor: 'rgba(255, 107, 107, 0.2)',
                              color: '#ff6b6b',
                              border: '1px solid rgba(255, 107, 107, 0.4)',
                            }}
                          />
                        )}
                        {!selectedVehicle && (
                          <Chip
                            icon={<DirectionsCar />}
                            label="Selecciona un vehículo"
                            sx={{
                              bgcolor: 'rgba(255, 107, 107, 0.2)',
                              color: '#ff6b6b',
                              border: '1px solid rgba(255, 107, 107, 0.4)',
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Slide>

        {/* Success Dialog */}
        <Dialog
          open={successDialogOpen}
          onClose={() => setSuccessDialogOpen(false)}
          PaperProps={{
            sx: {
              bgcolor: 'rgba(26, 26, 26, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(107, 207, 127, 0.2)',
              borderRadius: 3,
            }
          }}
        >
          <DialogTitle sx={{ color: '#fff', textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <CheckCircle sx={{ color: '#6bcf7f', mr: 2, fontSize: 32 }} />
              <Typography variant="h6" sx={{ color: '#6bcf7f' }}>
                ¡Asignación Exitosa!
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2" sx={{ color: '#fff' }}>
              El conductor ha sido asignado correctamente al vehículo.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
            <Button
              onClick={() => setSuccessDialogOpen(false)}
              sx={{
                background: 'linear-gradient(45deg, #6bcf7f 0%, #4caf50 100%)',
                color: '#fff',
                fontWeight: 600,
              }}
            >
              Entendido
            </Button>
          </DialogActions>
        </Dialog>

        {/* Error Dialog */}
        <Dialog
          open={errorDialogOpen}
          onClose={() => setErrorDialogOpen(false)}
          PaperProps={{
            sx: {
              bgcolor: 'rgba(26, 26, 26, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 107, 107, 0.2)',
              borderRadius: 3,
            }
          }}
        >
          <DialogTitle sx={{ color: '#fff', textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <ErrorIcon sx={{ color: '#ff6b6b', mr: 2, fontSize: 32 }} />
              <Typography variant="h6" sx={{ color: '#ff6b6b' }}>
                Error en la Asignación
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2" sx={{ color: '#fff' }}>
              Debes seleccionar tanto un conductor como un vehículo para realizar la asignación.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
            <Button
              onClick={() => setErrorDialogOpen(false)}
              sx={{
                background: 'linear-gradient(45deg, #ff6b6b 0%, #ff5252 100%)',
                color: '#fff',
                fontWeight: 600,
              }}
            >
              Entendido
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

export default DriverAssignment;
