// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Button,
  Avatar,
  Chip,
  IconButton,
  Fade,
  Slide,
  Container,
  Divider,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  DirectionsCar,
  ArrowBack,
  Edit,
  Delete,
  PhotoCamera,
  ZoomIn,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Person,
  Speed,
  LocalGasStation,
  CalendarToday,
  Description,
  Security,
  Assignment,
  NavigateBefore,
  NavigateNext
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import VehicleStorage, { Vehicle } from '../../utils/vehicleStorage';

const VehicleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      loadVehicle(id);
    }
  }, [id]);

  const loadVehicle = (vehicleId: string) => {
    setLoading(true);
    try {
      const foundVehicle = VehicleStorage.getVehicleById(vehicleId);
      setVehicle(foundVehicle || null);
    } catch (error) {
      console.error('Error loading vehicle:', error);
      setVehicle(null);
    } finally {
      setLoading(false);
    }
  };

  const handleViewImage = (index: number) => {
    setCurrentImageIndex(index);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
  };

  const handleNextImage = () => {
    if (vehicle && currentImageIndex < vehicle.images.length - 1) {
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

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (!vehicle) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container>
          <Card
            sx={{
              background: 'rgba(26, 26, 26, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 107, 107, 0.2)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" sx={{ color: '#ff6b6b', mb: 2 }}>
                Vehículo No Encontrado
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', mb: 3 }}>
                El vehículo que buscas no existe o ha sido eliminado.
              </Typography>
              <Button
                variant="contained"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/vehicles')}
                sx={{
                  background: 'linear-gradient(45deg, #00ff88 0%, #00cc6a 100%)',
                  color: '#000',
                  fontWeight: 600,
                }}
              >
                Volver a la Lista
              </Button>
            </CardContent>
          </Card>
        </Container>
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
                onClick={() => navigate('/vehicles')}
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
                <DirectionsCar />
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>
                  {vehicle.plate}
                </Typography>
                <Typography variant="body2" sx={{ color: '#888' }}>
                  {vehicle.brand} {vehicle.model} • {vehicle.year}
                </Typography>
              </Box>
              <Chip
                icon={getStatusIcon(vehicle.status)}
                label={getStatusLabel(vehicle.status)}
                sx={{
                  bgcolor: `${getStatusColor(vehicle.status)}20`,
                  color: getStatusColor(vehicle.status),
                  border: `1px solid ${getStatusColor(vehicle.status)}40`,
                  fontWeight: 600,
                }}
              />
            </Box>
          </Box>
        </Fade>

        <Grid container spacing={3}>
          {/* Vehicle Images Gallery */}
          <Grid item xs={12} md={8}>
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
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: '#00ff88', mb: 2, fontWeight: 600 }}>
                    Galería de Imágenes
                  </Typography>
                  
                  {vehicle.images && vehicle.images.length > 0 ? (
                    <Box>
                      {/* Main Image Display */}
                      <Box
                        sx={{
                          position: 'relative',
                          mb: 2,
                          borderRadius: 2,
                          overflow: 'hidden',
                          bgcolor: 'rgba(0, 0, 0, 0.3)',
                          minHeight: 300,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Box
                          component="img"
                          src={vehicle.images[currentImageIndex]}
                          alt={`Vehicle image ${currentImageIndex + 1}`}
                          sx={{
                            maxWidth: '100%',
                            maxHeight: 400,
                            objectFit: 'contain',
                          }}
                        />
                        
                        {vehicle.images.length > 1 && (
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
                              <NavigateBefore />
                            </IconButton>
                            <IconButton
                              onClick={handleNextImage}
                              disabled={currentImageIndex === vehicle.images.length - 1}
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
                              <NavigateNext />
                            </IconButton>
                          </>
                        )}
                        
                        <IconButton
                          onClick={() => handleViewImage(currentImageIndex)}
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            bgcolor: 'rgba(0, 255, 136, 0.2)',
                            color: '#00ff88',
                            '&:hover': { bgcolor: 'rgba(0, 255, 136, 0.3)' }
                          }}
                        >
                          <ZoomIn />
                        </IconButton>
                      </Box>
                      
                      {/* Image Counter */}
                      <Typography variant="body2" sx={{ color: '#888', textAlign: 'center', mb: 2 }}>
                        Imagen {currentImageIndex + 1} de {vehicle.images.length}
                      </Typography>
                      
                      {/* Thumbnail Gallery */}
                      {vehicle.images.length > 1 && (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                          {vehicle.images.map((image, index) => (
                            <Box
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              sx={{
                                width: 80,
                                height: 80,
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
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        textAlign: 'center',
                        py: 8,
                        bgcolor: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: 2,
                      }}
                    >
                      <PhotoCamera sx={{ fontSize: 64, color: '#666', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: '#888', mb: 1 }}>
                        Sin Imágenes
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Este vehículo no tiene imágenes registradas
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Slide>
          </Grid>

          {/* Vehicle Information */}
          <Grid item xs={12} md={4}>
            <Slide direction="up" in={true} timeout={1200}>
              <Card
                sx={{
                  background: 'rgba(26, 26, 26, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 255, 136, 0.2)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  mb: 3,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: '#00ff88', mb: 2, fontWeight: 600 }}>
                    Información General
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DirectionsCar sx={{ color: '#00ff88', mr: 2, fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#888' }}>Placa</Typography>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                          {vehicle.plate}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Speed sx={{ color: '#00ff88', mr: 2, fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#888' }}>Marca y Modelo</Typography>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                          {vehicle.brand} {vehicle.model}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarToday sx={{ color: '#00ff88', mr: 2, fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#888' }}>Año</Typography>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                          {vehicle.year}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Description sx={{ color: '#00ff88', mr: 2, fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#888' }}>Color</Typography>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                          {vehicle.color}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Slide>

            <Slide direction="up" in={true} timeout={1400}>
              <Card
                sx={{
                  background: 'rgba(26, 26, 26, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 255, 136, 0.2)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  mb: 3,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: '#00ff88', mb: 2, fontWeight: 600 }}>
                    Información Técnica
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocalGasStation sx={{ color: '#00ff88', mr: 2, fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#888' }}>Tipo de Motor</Typography>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                          {vehicle.engineType}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Speed sx={{ color: '#00ff88', mr: 2, fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#888' }}>Combustible</Typography>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                          {vehicle.fuelType}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Assignment sx={{ color: '#00ff88', mr: 2, fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#888' }}>Capacidad</Typography>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                          {vehicle.capacity} toneladas
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Speed sx={{ color: '#00ff88', mr: 2, fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#888' }}>Kilometraje</Typography>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                          {parseInt(vehicle.mileage || '0').toLocaleString()} km
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Slide>

            <Slide direction="up" in={true} timeout={1600}>
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
                    Asignación y Documentación
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Person sx={{ color: '#00ff88', mr: 2, fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#888' }}>Conductor</Typography>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                          {vehicle.driver || 'No asignado'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Security sx={{ color: '#00ff88', mr: 2, fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#888' }}>Póliza de Seguro</Typography>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                          {vehicle.insurance || 'No registrada'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Assignment sx={{ color: '#00ff88', mr: 2, fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#888' }}>Matrícula</Typography>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                          {vehicle.registration || 'No registrada'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Slide>
          </Grid>
        </Grid>

        {/* Full Image Modal */}
        <Dialog
          open={imageModalOpen}
          onClose={handleCloseImageModal}
          maxWidth="lg"
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
                Imagen del Vehículo ({currentImageIndex + 1} / {vehicle.images.length})
              </Typography>
              <IconButton onClick={handleCloseImageModal} sx={{ color: '#fff' }}>
                ×
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 2, minHeight: 400 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
              {vehicle.images.length > 1 && (
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
                    <NavigateBefore />
                  </IconButton>
                  <IconButton
                    onClick={handleNextImage}
                    disabled={currentImageIndex === vehicle.images.length - 1}
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
                    <NavigateNext />
                  </IconButton>
                </>
              )}
              <Box
                component="img"
                src={vehicle.images[currentImageIndex]}
                alt={`Vehicle image ${currentImageIndex + 1}`}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  borderRadius: 2,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', p: 2 }}>
            <Typography variant="body2" sx={{ color: '#888', mr: 2 }}>
              {vehicle.images.length} {vehicle.images.length === 1 ? 'imagen' : 'imágenes'}
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

export default VehicleDetail;
