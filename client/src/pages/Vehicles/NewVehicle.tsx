// @ts-nocheck
import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Avatar,
  Chip,
  Paper,
  Divider,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  LinearProgress,
  Fade,
  Slide,
  Container,
  Stack,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Backdrop
} from '@mui/material';
import {
  DirectionsCar,
  AddPhotoAlternate,
  Delete,
  Save,
  ArrowBack,
  CloudUpload,
  Image,
  CheckCircle,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import VehicleStorage from '../../utils/vehicleStorage';

const NewVehicle: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    plate: '',
    brand: '',
    model: '',
    year: '',
    color: '',
    vin: '',
    engineType: '',
    fuelType: '',
    capacity: '',
    mileage: '',
    status: 'active',
    driver: '',
    insurance: '',
    registration: '',
    notes: ''
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string) => (event: any) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
        setImages(prev => [...prev, file]);
      }
    });
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.plate.trim()) newErrors.plate = 'La placa es requerida';
    if (!formData.brand.trim()) newErrors.brand = 'La marca es requerida';
    if (!formData.model.trim()) newErrors.model = 'El modelo es requerido';
    if (!formData.year.trim()) newErrors.year = 'El año es requerido';
    if (!formData.vin.trim()) newErrors.vin = 'El VIN es requerido';
    if (!formData.engineType.trim()) newErrors.engineType = 'El tipo de motor es requerido';
    if (!formData.fuelType.trim()) newErrors.fuelType = 'El tipo de combustible es requerido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      setShowError(true);
      return;
    }
    
    setLoading(true);
    
    try {
      // Save vehicle to storage
      const savedVehicle = VehicleStorage.saveVehicle(formData, imagePreviews);
      
      setLoading(false);
      
      // Show success dialog
      setSuccessDialogOpen(true);
    } catch (error) {
      console.error('Error saving vehicle:', error);
      setLoading(false);
      setShowError(true);
    }
  };

  const vehicleBrands = [
    'Volvo', 'Mercedes-Benz', 'Scania', 'MAN', 'Iveco', 
    'Renault Trucks', 'DAF', 'Kenworth', 'Peterbilt', 'Freightliner'
  ];

  const engineTypes = [
    'Diésel', 'Gasolina', 'Eléctrico', 'Híbrido', 'Gas Natural'
  ];

  const fuelTypes = [
    'Diésel', 'Gasolina', 'Eléctrico', 'Gas Natural', 'Híbrido'
  ];

  const vehicleStatuses = [
    { value: 'active', label: 'Activo' },
    { value: 'maintenance', label: 'En Mantenimiento' },
    { value: 'inactive', label: 'Inactivo' }
  ];

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

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 3 }}>
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
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>
                  Registrar Nuevo Vehículo
                </Typography>
                <Typography variant="body2" sx={{ color: '#888' }}>
                  Complete la información para agregar un nuevo vehículo a la flota
                </Typography>
              </Box>
            </Box>
          </Box>
        </Fade>

        {/* Main Form */}
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
            <CardContent sx={{ p: 4 }}>
              {loading && <LinearProgress sx={{ mb: 3 }} />}
              
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Basic Information */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ color: '#00ff88', mb: 2, fontWeight: 600 }}>
                      Información Básica
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Placa"
                      value={formData.plate}
                      onChange={handleInputChange('plate')}
                      error={!!errors.plate}
                      helperText={errors.plate}
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
                  
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth error={!!errors.brand}>
                      <InputLabel sx={{ color: '#888' }}>Marca</InputLabel>
                      <Select
                        value={formData.brand}
                        onChange={handleInputChange('brand')}
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
                        {vehicleBrands.map((brand) => (
                          <MenuItem key={brand} value={brand} sx={{ color: '#fff' }}>
                            {brand}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.brand && <FormHelperText>{errors.brand}</FormHelperText>}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Modelo"
                      value={formData.model}
                      onChange={handleInputChange('model')}
                      error={!!errors.model}
                      helperText={errors.model}
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
                  
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Año"
                      value={formData.year}
                      onChange={handleInputChange('year')}
                      error={!!errors.year}
                      helperText={errors.year}
                      type="number"
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

                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Color"
                      value={formData.color}
                      onChange={handleInputChange('color')}
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
                  
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="VIN"
                      value={formData.vin}
                      onChange={handleInputChange('vin')}
                      error={!!errors.vin}
                      helperText={errors.vin}
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

                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth error={!!errors.engineType}>
                      <InputLabel sx={{ color: '#888' }}>Tipo de Motor</InputLabel>
                      <Select
                        value={formData.engineType}
                        onChange={handleInputChange('engineType')}
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
                        {engineTypes.map((type) => (
                          <MenuItem key={type} value={type} sx={{ color: '#fff' }}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.engineType && <FormHelperText>{errors.engineType}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth error={!!errors.fuelType}>
                      <InputLabel sx={{ color: '#888' }}>Tipo de Combustible</InputLabel>
                      <Select
                        value={formData.fuelType}
                        onChange={handleInputChange('fuelType')}
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
                        {fuelTypes.map((type) => (
                          <MenuItem key={type} value={type} sx={{ color: '#fff' }}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.fuelType && <FormHelperText>{errors.fuelType}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  {/* Technical Information */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ color: '#00ff88', mb: 2, fontWeight: 600, mt: 2 }}>
                      Información Técnica
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Capacidad (toneladas)"
                      value={formData.capacity}
                      onChange={handleInputChange('capacity')}
                      type="number"
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
                  
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Kilometraje"
                      value={formData.mileage}
                      onChange={handleInputChange('mileage')}
                      type="number"
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
                  
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: '#888' }}>Estado</InputLabel>
                      <Select
                        value={formData.status}
                        onChange={handleInputChange('status')}
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
                        {vehicleStatuses.map((status) => (
                          <MenuItem key={status.value} value={status.value} sx={{ color: '#fff' }}>
                            {status.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Conductor Asignado"
                      value={formData.driver}
                      onChange={handleInputChange('driver')}
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

                  {/* Images Section */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ color: '#00ff88', mb: 2, fontWeight: 600, mt: 2 }}>
                      Imágenes del Vehículo
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Paper
                      sx={{
                        p: 3,
                        border: '2px dashed rgba(0, 255, 136, 0.3)',
                        borderRadius: 2,
                        textAlign: 'center',
                        background: 'rgba(0, 255, 136, 0.02)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'rgba(0, 255, 136, 0.6)',
                          background: 'rgba(0, 255, 136, 0.05)',
                        }
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <CloudUpload sx={{ fontSize: 48, color: '#00ff88', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                        Subir Imágenes
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#888' }}>
                        Click para seleccionar imágenes o arrastrar y soltar
                      </Typography>
                    </Paper>
                  </Grid>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                        {imagePreviews.map((preview, index) => (
                          <Box
                            key={index}
                            sx={{
                              position: 'relative',
                              width: 120,
                              height: 120,
                              borderRadius: 2,
                              overflow: 'hidden',
                              border: '2px solid rgba(0, 255, 136, 0.3)',
                            }}
                          >
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => removeImage(index)}
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                bgcolor: 'rgba(255, 0, 0, 0.8)',
                                color: '#fff',
                                '&:hover': {
                                  bgcolor: 'rgba(255, 0, 0, 1)',
                                },
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  )}

                  {/* Additional Information */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ color: '#00ff88', mb: 2, fontWeight: 600, mt: 2 }}>
                      Información Adicional
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Póliza de Seguro"
                      value={formData.insurance}
                      onChange={handleInputChange('insurance')}
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
                      label="Matrícula"
                      value={formData.registration}
                      onChange={handleInputChange('registration')}
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
                      label="Notas"
                      value={formData.notes}
                      onChange={handleInputChange('notes')}
                      multiline
                      rows={3}
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

                  {/* Action Buttons */}
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/vehicles')}
                        sx={{
                          color: '#ccc',
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          '&:hover': {
                            borderColor: '#fff',
                            color: '#fff',
                          },
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        startIcon={<Save />}
                        sx={{
                          background: 'linear-gradient(45deg, #00ff88 0%, #00cc6a 100%)',
                          color: '#000',
                          fontWeight: 600,
                          px: 3,
                          '&:hover': {
                            background: 'linear-gradient(45deg, #00cc6a 0%, #00ff88 100%)',
                          },
                          '&:disabled': {
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: '#666',
                          },
                        }}
                      >
                        {loading ? 'Guardando...' : 'Registrar Vehículo'}
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Slide>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity="success"
          icon={<CheckCircle />}
          sx={{
            bgcolor: 'rgba(0, 255, 136, 0.9)',
            color: '#000',
            '& .MuiAlert-message': {
              fontWeight: 600,
            },
          }}
        >
          Vehículo registrado exitosamente
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={3000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity="error"
          icon={<ErrorIcon />}
          sx={{
            bgcolor: 'rgba(255, 107, 107, 0.9)',
            color: '#fff',
            '& .MuiAlert-message': {
              fontWeight: 600,
            },
          }}
        >
          Por favor complete todos los campos requeridos
        </Alert>
      </Snackbar>

      {/* Success Dialog */}
      <Dialog
        open={successDialogOpen}
        onClose={() => {
          setSuccessDialogOpen(false);
          navigate('/vehicles');
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(26, 26, 26, 0.95)',
            backdropFilter: 'blur(25px)',
            border: '2px solid rgba(0, 255, 136, 0.3)',
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
          }
        }}
        BackdropComponent={Backdrop}
        BackdropProps={{
          sx: {
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center',
          color: '#00ff88',
          fontWeight: 700,
          fontSize: '1.5rem',
          pb: 1
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <CheckCircle sx={{ 
              fontSize: 60, 
              color: '#00ff88',
              filter: 'drop-shadow(0 0 20px rgba(0, 255, 136, 0.5))'
            }} />
          </Box>
          ¡Vehículo Registrado!
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="h6" sx={{ 
            color: '#fff',
            fontWeight: 600,
            mb: 2,
            fontSize: '1.2rem'
          }}>
            Su vehículo fue registrado con éxito
          </Typography>
          <Typography variant="body2" sx={{ 
            color: '#888',
            fontSize: '0.95rem'
          }}>
            El vehículo ha sido agregado correctamente al sistema y ya está disponible en la lista de vehículos.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ 
          justifyContent: 'center',
          p: 3,
          pt: 1
        }}>
          <Button
            onClick={() => {
              setSuccessDialogOpen(false);
              navigate('/vehicles');
            }}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #00ff88 0%, #00cc6a 100%)',
              color: '#000',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontSize: '1rem',
              '&:hover': {
                background: 'linear-gradient(45deg, #00cc6a 0%, #00ff88 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0, 255, 136, 0.3)',
              }
            }}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

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

export default NewVehicle;
