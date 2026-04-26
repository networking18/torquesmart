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
  Backdrop
} from '@mui/material';
import {
  DirectionsCar,
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
  PhotoCamera,
  ZoomIn
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import VehicleStorage, { Vehicle } from '../../utils/vehicleStorage';

const Vehicles: React.FC = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [vehicles, searchTerm, filterStatus]);

  const loadVehicles = () => {
    setLoading(true);
    try {
      const storedVehicles = VehicleStorage.getVehicles();
      setVehicles(storedVehicles);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterVehicles = () => {
    let filtered = vehicles;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.driver?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.status === filterStatus);
    }

    setFilteredVehicles(filtered);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, vehicle: Vehicle) => {
    setAnchorEl(event.currentTarget);
    setSelectedVehicle(vehicle);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVehicle(null);
  };

  const handleDeleteVehicle = () => {
    if (selectedVehicle) {
      VehicleStorage.deleteVehicle(selectedVehicle.id);
      loadVehicles();
      handleMenuClose();
    }
  };

  const handleViewImages = (vehicle: Vehicle) => {
    if (vehicle.images && vehicle.images.length > 0) {
      setSelectedImages(vehicle.images);
      setCurrentImageIndex(0);
      setImageModalOpen(true);
    }
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
    setSelectedImages([]);
    setCurrentImageIndex(0);
  };

  const handleNextImage = () => {
    if (currentImageIndex < selectedImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#6bcf7f';
      case 'maintenance': return '#ffd93d';
      case 'inactive': return '#ff6b6b';
      default: return '#868e96';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'maintenance': return 'En Mantenimiento';
      case 'inactive': return 'Inactivo';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle fontSize="small" />;
      case 'maintenance': return <Warning fontSize="small" />;
      case 'inactive': return <ErrorIcon fontSize="small" />;
      default: return null;
    }
  };

  const stats = VehicleStorage.getVehicleStats();

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
                  <DirectionsCar />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>
                    Lista de Vehículos
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#888' }}>
                    Gestiona y monitorea toda la flota de vehículos
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/vehicles/new')}
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
                Nuevo Vehículo
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
                          Total Vehículos
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: '#00ff88', color: '#000' }}>
                        <DirectionsCar />
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
                    border: '1px solid rgba(255, 217, 61, 0.2)',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
                          {stats.maintenance}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#888' }}>
                          Mantenimiento
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: '#ffd93d', color: '#000' }}>
                        <Warning />
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
                      <Avatar sx={{ bgcolor: '#ff6b6b', color: '#000' }}>
                        <ErrorIcon />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Search and Filter */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                placeholder="Buscar por placa, marca, modelo o conductor..."
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
                <MenuItem value="maintenance">Mantenimiento</MenuItem>
                <MenuItem value="inactive">Inactivos</MenuItem>
              </TextField>
            </Box>
          </Box>
        </Fade>

        {/* Vehicles Table */}
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
                      <TableCell>Vehículo</TableCell>
                      <TableCell>Información</TableCell>
                      <TableCell>Conductor</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Kilometraje</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredVehicles.map((vehicle) => (
                      <TableRow
                        key={vehicle.id}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(0, 255, 136, 0.05)',
                          },
                          '& td': { color: '#fff', borderColor: 'rgba(255, 255, 255, 0.1)' },
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {vehicle.images && vehicle.images.length > 0 ? (
                              <Box sx={{ position: 'relative', mr: 2 }}>
                                <Avatar
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    cursor: 'pointer',
                                    '&:hover': {
                                      transform: 'scale(1.05)',
                                      transition: 'transform 0.2s ease'
                                    }
                                  }}
                                  onClick={() => handleViewImages(vehicle)}
                                  src={vehicle.images[0]}
                                >
                                  <DirectionsCar />
                                </Avatar>
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    bottom: -2,
                                    right: -2,
                                    bgcolor: '#00ff88',
                                    color: '#000',
                                    borderRadius: '50%',
                                    width: 16,
                                    height: 16,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '10px',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {vehicle.images.length}
                                </Box>
                              </Box>
                            ) : (
                              <Avatar
                                sx={{
                                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                                  color: '#888',
                                  width: 40,
                                  height: 40,
                                  mr: 2,
                                }}
                              >
                                <PhotoCamera />
                              </Avatar>
                            )}
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {vehicle.plate}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#888' }}>
                                {vehicle.brand} {vehicle.model}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {vehicle.year} • {vehicle.color}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#888' }}>
                              VIN: {vehicle.vin}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {vehicle.driver || 'No asignado'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(vehicle.status)}
                            label={getStatusLabel(vehicle.status)}
                            size="small"
                            sx={{
                              bgcolor: `${getStatusColor(vehicle.status)}20`,
                              color: getStatusColor(vehicle.status),
                              border: `1px solid ${getStatusColor(vehicle.status)}40`,
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {parseInt(vehicle.mileage || '0').toLocaleString()} km
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {vehicle.images && vehicle.images.length > 0 && (
                              <Tooltip title="Ver imágenes">
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewImages(vehicle)}
                                  sx={{
                                    color: '#00ff88',
                                    '&:hover': { backgroundColor: 'rgba(0, 255, 136, 0.1)' }
                                  }}
                                >
                                  <ZoomIn fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Ver detalles">
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/vehicles/${vehicle.id}`)}
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
                                onClick={(e) => handleMenuClick(e, vehicle)}
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
            onClick={() => {
              handleMenuClose();
              if (selectedVehicle) {
                navigate(`/vehicles/${selectedVehicle.id}`);
              }
            }}
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
            onClick={handleDeleteVehicle}
            sx={{
              color: '#ff6b6b',
              '&:hover': { bgcolor: 'rgba(255, 107, 107, 0.1)' },
            }}
          >
            <Delete sx={{ mr: 2 }} />
            Eliminar
          </MenuItem>
        </Menu>

        {/* Image Preview Modal */}
        <Dialog
          open={imageModalOpen}
          onClose={handleCloseImageModal}
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
                Galería de Imágenes ({currentImageIndex + 1} / {selectedImages.length})
              </Typography>
              <IconButton onClick={handleCloseImageModal} sx={{ color: '#fff' }}>
                ×
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 2, minHeight: 400 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
              {selectedImages.length > 1 && (
                <>
                  <IconButton
                    onClick={handlePrevImage}
                    disabled={currentImageIndex === 0}
                    sx={{
                      position: 'absolute',
                      left: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(0, 255, 136, 0.2)',
                      color: '#00ff88',
                      '&:hover': { bgcolor: 'rgba(0, 255, 136, 0.3)' },
                      '&:disabled': { color: '#666', bgcolor: 'rgba(255, 255, 255, 0.05)' }
                    }}
              >
                    ‹
                  </IconButton>
                  <IconButton
                    onClick={handleNextImage}
                    disabled={currentImageIndex === selectedImages.length - 1}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(0, 255, 136, 0.2)',
                      color: '#00ff88',
                      '&:hover': { bgcolor: 'rgba(0, 255, 136, 0.3)' },
                      '&:disabled': { color: '#666', bgcolor: 'rgba(255, 255, 255, 0.05)' }
                    }}
                  >
                    ›
                  </IconButton>
                </>
              )}
              <Box
                component="img"
                src={selectedImages[currentImageIndex]}
                alt={`Vehicle image ${currentImageIndex + 1}`}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '500px',
                  borderRadius: 2,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                }}
              />
            </Box>
            
            {/* Thumbnail Navigation */}
            {selectedImages.length > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                {selectedImages.map((image, index) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: index === currentImageIndex ? '2px solid #00ff88' : '2px solid transparent',
                      opacity: index === currentImageIndex ? 1 : 0.6,
                      '&:hover': { opacity: 1 }
                    }}
                  >
                    <Box
                      component="img"
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', p: 2 }}>
            <Typography variant="body2" sx={{ color: '#888', mr: 2 }}>
              {selectedImages.length} {selectedImages.length === 1 ? 'imagen' : 'imágenes'}
            </Typography>
            <Button onClick={handleCloseImageModal} sx={{ color: '#00ff88' }}>
              Cerrar
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

export default Vehicles;
