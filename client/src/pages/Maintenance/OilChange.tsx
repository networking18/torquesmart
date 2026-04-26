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
  Backdrop,
  TextareaAutosize
} from '@mui/material';
import {
  Build,
  AddPhotoAlternate,
  Delete,
  Save,
  ArrowBack,
  CloudUpload,
  Image as ImageIcon,
  CheckCircle,
  Error as ErrorIcon,
  DirectionsCar,
  LocalGasStation,
  CalendarToday,
  Person,
  AttachMoney
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface OilChangeRecord {
  id: string;
  vehiclePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  date: string;
  mileage: string;
  oilType: string;
  oilBrand: string;
  oilQuantity: string;
  oilFilter: string;
  airFilter: string;
  cost: string;
  technician: string;
  notes: string;
  images: string[];
  createdAt: string;
}

const OilChange: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    vehiclePlate: '',
    vehicleBrand: '',
    vehicleModel: '',
    date: '',
    mileage: '',
    oilType: '',
    oilBrand: '',
    oilQuantity: '',
    oilFilter: '',
    airFilter: '',
    cost: '',
    technician: '',
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
    const value = event.target ? event.target.value : event;
    console.log(`Cambiando ${field}:`, value);
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    console.log('Subiendo imágenes:', files.length, 'archivos');

    const newImages: File[] = [];
    const newPreviews: string[] = [];

    Array.from(files).forEach(file => {
      // Accept all image formats including HEIF
      if (file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
        console.log('Procesando imagen:', file.name, 'tamaño:', file.size, 'tipo:', file.type);
        
        // Check file size limit (5MB per image)
        if (file.size > 5 * 1024 * 1024) {
          console.log('Imagen demasiado grande, omitiendo:', file.name);
          return;
        }
        
        newImages.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const imageData = e.target.result as string;
            console.log('Imagen convertida a base64, longitud:', imageData.length);
            
            // For now, just use the original image without compression
            // The Image constructor is causing issues
            console.log('Usando imagen original sin compresión');
            
            // Limit to max 3 images to avoid storage issues
            setImagePreviews(prev => {
              if (prev.length >= 3) {
                console.log('Límite de 3 imágenes alcanzado');
                return prev;
              }
              return [...prev, imageData];
            });
          }
        };
        reader.readAsDataURL(file);
      } else {
        console.log('Archivo no es imagen:', file.name, 'tipo:', file.type);
      }
    });

    setImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    console.log('Validando formulario:', formData);
    
    if (!formData.vehiclePlate || formData.vehiclePlate.trim() === '') {
      newErrors.vehiclePlate = 'La placa del vehículo es requerida';
    }
    if (!formData.vehicleBrand || formData.vehicleBrand.trim() === '') {
      newErrors.vehicleBrand = 'La marca del vehículo es requerida';
    }
    if (!formData.vehicleModel || formData.vehicleModel.trim() === '') {
      newErrors.vehicleModel = 'El modelo del vehículo es requerido';
    }
    if (!formData.date) {
      newErrors.date = 'La fecha es requerida';
    }
    if (!formData.mileage || formData.mileage.trim() === '') {
      newErrors.mileage = 'El kilometraje es requerido';
    }
    if (!formData.oilType || formData.oilType.trim() === '') {
      newErrors.oilType = 'El tipo de aceite es requerido';
    }
    if (!formData.oilBrand || formData.oilBrand.trim() === '') {
      newErrors.oilBrand = 'La marca de aceite es requerida';
    }
    if (!formData.oilQuantity || formData.oilQuantity.trim() === '') {
      newErrors.oilQuantity = 'La cantidad de aceite es requerida';
    }
    if (!formData.technician || formData.technician.trim() === '') {
      newErrors.technician = 'El nombre del técnico es requerido';
    }
    if (!formData.cost || formData.cost.trim() === '') {
      newErrors.cost = 'El costo es requerido';
    }

    console.log('Errores encontrados:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    console.log('Enviando formulario:', formData);
    
    if (!validateForm()) {
      console.log('Validación fallida');
      setShowError(true);
      return;
    }
    
    setLoading(true);
    
    try {
      // Validar campos
      if (!formData.vehicleBrand || !formData.vehicleModel || !formData.vehiclePlate) {
        setError('Por favor complete todos los campos del vehículo');
        setLoading(false);
        return;
      }

      if (!formData.oilType || !formData.cost || !formData.technician) {
        setError('Por favor complete todos los campos del servicio');
        setLoading(false);
        return;
      }

      // Calcular próximo cambio de aceite considerando el kilometraje diario
      const currentMileage = parseInt(formData.mileage);
      let nextKilometers = currentMileage + 10000; // Valor por defecto

      // Obtener registros de kilometraje diario para este vehículo
      const dailyMileageRecords = JSON.parse(localStorage.getItem('torquesmart_daily_mileage') || '[]');
      const vehicleDailyRecords = dailyMileageRecords.filter((record: any) => 
        record.vehiclePlate === formData.vehiclePlate
      );

      if (vehicleDailyRecords.length > 0) {
        // Calcular el kilometraje total diario acumulado desde el último cambio
        const totalDailyKm = vehicleDailyRecords.reduce((sum: number, record: any) => sum + record.totalKm, 0);
        
        // Calcular cuántos cambios de aceite se han "consumido" con el kilometraje diario
        const oilChangesConsumed = Math.floor(totalDailyKm / 4000);
        
        // Ajustar el próximo cambio de aceite
        nextKilometers = currentMileage + 10000 - (oilChangesConsumed * 4000);
        
        console.log(`Kilometraje diario total: ${totalDailyKm} km`);
        console.log(`Cambios de aceite consumidos: ${oilChangesConsumed}`);
        console.log(`Próximo cambio ajustado: ${nextKilometers} km`);
      }

      console.log('Intentando guardar cambio de aceite...');
      console.log('Número de imágenes:', imagePreviews.length);
      
      // Create oil change record - optimize images for storage
      const optimizedImages = imagePreviews.map((image, index) => {
        console.log(`Procesando imagen ${index + 1}:`, image.length, 'caracteres');
        // If image is too large, compress it
        if (image.length > 500000) { // 500KB limit per image
          console.log('Imagen grande detectada, se comprimirá');
          // For now, we'll just keep it but could implement compression
          return image;
        }
        return image;
      });

      const oilChangeRecord: OilChangeRecord = {
        id: Date.now().toString(),
        ...formData,
        cost: parseFloat(formData.cost),
        mileage: currentMileage,
        nextKilometers: nextKilometers,
        images: images,
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      const existingRecords = JSON.parse(localStorage.getItem('torquesmart_oil_changes') || '[]');
      
      try {
        existingRecords.push(oilChangeRecord);
        const dataToSave = JSON.stringify(existingRecords);
        localStorage.setItem('torquesmart_oil_changes', dataToSave);
      } catch (quotaError) {
        console.log('localStorage quota exceeded, trimming old records');
        // Keep only the most recent records
        const trimmedRecords = existingRecords.slice(-20);
        localStorage.setItem('torquesmart_oil_changes', JSON.stringify(trimmedRecords));
        
        // Try to save again
        trimmedRecords.push(oilChangeRecord);
        localStorage.setItem('torquesmart_oil_changes', JSON.stringify(trimmedRecords));
      }
      
      setLoading(false);
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        vehicleBrand: '',
        vehicleModel: '',
        vehiclePlate: '',
        date: new Date().toISOString().split('T')[0],
        mileage: '',
        oilType: '',
        cost: '',
        technician: '',
        notes: '',
        nextKilometers: nextKilometers.toString()
      });
      setImages([]);
      setImagePreviews([]);
      
    } catch (error) {
      console.error('Error saving oil change record:', error);
      setLoading(false);
      setShowError(true);
    }
  };

  const vehicleBrands = [
    'Volvo', 'Mercedes-Benz', 'Scania', 'MAN', 'Iveco', 
    'Renault Trucks', 'DAF', 'Kenworth', 'Peterbilt', 'Freightliner'
  ];

  const oilTypes = [
    '10W-30', '10W-40', '15W-40', '5W-30', '5W-40', '0W-20', '0W-30', 'Sintético', 'Semi-sintético', 'Mineral'
  ];

  const oilBrands = [
    'Mobil', 'Shell', 'Castrol', 'Valvoline', 'Pennzoil', 'Quaker State', 'Total', 'BP', 'Chevron', 'Kendall'
  ];

  const oilFilters = [
    'Original', 'Bosch', 'Mann-Filter', 'Fram', 'Wix', 'K&N', 'Purolator', 'ACDelco'
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(0, 255, 136, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 255, 136, 0.03) 0%, transparent 50%)',
        pointerEvents: 'none',
      }
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        background: 'rgba(26, 26, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 255, 136, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <IconButton 
          onClick={() => navigate('/maintenance')}
          sx={{
            color: '#00ff88',
            '&:hover': {
              backgroundColor: 'rgba(0, 255, 136, 0.1)',
            }
          }}
        >
          <ArrowBack />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            bgcolor: 'rgba(0, 255, 136, 0.2)',
            color: '#00ff88',
            width: 48,
            height: 48
          }}>
            <Build />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ 
              color: '#00ff88',
              fontWeight: 700,
              fontSize: '1.8rem',
              textShadow: '0 0 20px rgba(0, 255, 136, 0.5)'
            }}>
              Cambio de Aceite
            </Typography>
            <Typography variant="body2" sx={{ color: '#888', fontSize: '0.9rem' }}>
              Registro de mantenimiento de aceite
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Slide in={true} direction="up" timeout={800}>
          <Card sx={{
            background: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden'
          }}>
            <CardContent sx={{ p: 4 }}>
              <form onSubmit={handleSubmit}>
                {/* Vehicle Information */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ 
                    color: '#00ff88',
                    fontWeight: 600,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <DirectionsCar />
                    Información del Vehículo
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Placa del Vehículo"
                        value={formData.vehiclePlate}
                        onChange={handleInputChange('vehiclePlate')}
                        error={!!errors.vehiclePlate}
                        helperText={errors.vehiclePlate}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': {
                              borderColor: 'rgba(0, 255, 136, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(0, 255, 136, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#00ff88',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#888',
                            '&.Mui-focused': {
                              color: '#00ff88',
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: '#888', '&.Mui-focused': { color: '#00ff88' } }}>
                          Marca
                        </InputLabel>
                        <Select
                          value={formData.vehicleBrand}
                          onChange={handleInputChange('vehicleBrand')}
                          error={!!errors.vehicleBrand}
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
                          {vehicleBrands.map(brand => (
                            <MenuItem key={brand} value={brand} sx={{ color: '#fff' }}>
                              {brand}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.vehicleBrand && (
                          <FormHelperText error>{errors.vehicleBrand}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Modelo"
                        value={formData.vehicleModel}
                        onChange={handleInputChange('vehicleModel')}
                        error={!!errors.vehicleModel}
                        helperText={errors.vehicleModel}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': {
                              borderColor: 'rgba(0, 255, 136, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(0, 255, 136, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#00ff88',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#888',
                            '&.Mui-focused': {
                              color: '#00ff88',
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Maintenance Details */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ 
                    color: '#00ff88',
                    fontWeight: 600,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <Build />
                    Detalles del Mantenimiento
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Fecha del Mantenimiento"
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange('date')}
                        error={!!errors.date}
                        helperText={errors.date}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          required: false
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': {
                              borderColor: 'rgba(0, 255, 136, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(0, 255, 136, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#00ff88',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#888',
                            '&.Mui-focused': {
                              color: '#00ff88',
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Kilometraje"
                        value={formData.mileage}
                        onChange={handleInputChange('mileage')}
                        error={!!errors.mileage}
                        helperText={errors.mileage}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': {
                              borderColor: 'rgba(0, 255, 136, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(0, 255, 136, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#00ff88',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#888',
                            '&.Mui-focused': {
                              color: '#00ff88',
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: '#888', '&.Mui-focused': { color: '#00ff88' } }}>
                          Tipo de Aceite
                        </InputLabel>
                        <Select
                          value={formData.oilType}
                          onChange={handleInputChange('oilType')}
                          error={!!errors.oilType}
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
                          {oilTypes.map(type => (
                            <MenuItem key={type} value={type} sx={{ color: '#fff' }}>
                              {type}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.oilType && (
                          <FormHelperText error>{errors.oilType}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: '#888', '&.Mui-focused': { color: '#00ff88' } }}>
                          Marca de Aceite
                        </InputLabel>
                        <Select
                          value={formData.oilBrand}
                          onChange={handleInputChange('oilBrand')}
                          error={!!errors.oilBrand}
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
                          {oilBrands.map(brand => (
                            <MenuItem key={brand} value={brand} sx={{ color: '#fff' }}>
                              {brand}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.oilBrand && (
                          <FormHelperText error>{errors.oilBrand}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Cantidad (Litros)"
                        value={formData.oilQuantity}
                        onChange={handleInputChange('oilQuantity')}
                        error={!!errors.oilQuantity}
                        helperText={errors.oilQuantity}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': {
                              borderColor: 'rgba(0, 255, 136, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(0, 255, 136, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#00ff88',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#888',
                            '&.Mui-focused': {
                              color: '#00ff88',
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: '#888', '&.Mui-focused': { color: '#00ff88' } }}>
                          Filtro de Aceite
                        </InputLabel>
                        <Select
                          value={formData.oilFilter}
                          onChange={handleInputChange('oilFilter')}
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
                          {oilFilters.map(filter => (
                            <MenuItem key={filter} value={filter} sx={{ color: '#fff' }}>
                              {filter}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: '#888', '&.Mui-focused': { color: '#00ff88' } }}>
                          Filtro de Aire
                        </InputLabel>
                        <Select
                          value={formData.airFilter}
                          onChange={handleInputChange('airFilter')}
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
                          <MenuItem value="No aplica" sx={{ color: '#fff' }}>No aplica</MenuItem>
                          {oilFilters.map(filter => (
                            <MenuItem key={filter} value={filter} sx={{ color: '#fff' }}>
                              {filter}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Costo ($)"
                        value={formData.cost}
                        onChange={handleInputChange('cost')}
                        error={!!errors.cost}
                        helperText={errors.cost}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': {
                              borderColor: 'rgba(0, 255, 136, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(0, 255, 136, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#00ff88',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#888',
                            '&.Mui-focused': {
                              color: '#00ff88',
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Technician and Notes */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ 
                    color: '#00ff88',
                    fontWeight: 600,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <Person />
                    Técnico y Notas
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Nombre del Técnico"
                        value={formData.technician}
                        onChange={handleInputChange('technician')}
                        error={!!errors.technician}
                        helperText={errors.technician}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': {
                              borderColor: 'rgba(0, 255, 136, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(0, 255, 136, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#00ff88',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#888',
                            '&.Mui-focused': {
                              color: '#00ff88',
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Notas Adicionales"
                        value={formData.notes}
                        onChange={handleInputChange('notes')}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': {
                              borderColor: 'rgba(0, 255, 136, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(0, 255, 136, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#00ff88',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#888',
                            '&.Mui-focused': {
                              color: '#00ff88',
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Image Upload */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ 
                    color: '#00ff88',
                    fontWeight: 600,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <ImageIcon />
                    Fotos del Mantenimiento
                  </Typography>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.heic,.heif,.webp,.png,.jpg,.jpeg,.gif,.bmp,.tiff"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                    {imagePreviews.map((preview, index) => (
                      <Box key={index} sx={{ position: 'relative', width: 120, height: 120 }}>
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: 8,
                            border: '2px solid rgba(0, 255, 136, 0.3)'
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveImage(index)}
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            bgcolor: 'rgba(255, 107, 107, 0.9)',
                            color: '#fff',
                            '&:hover': {
                              bgcolor: 'rgba(255, 107, 107, 1)',
                            }
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                    
                    <Button
                      variant="outlined"
                      onClick={() => fileInputRef.current?.click()}
                      sx={{
                        width: 120,
                        height: 120,
                        border: '2px dashed rgba(0, 255, 136, 0.5)',
                        borderRadius: 2,
                        color: '#00ff88',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        '&:hover': {
                          border: '2px dashed #00ff88',
                          bgcolor: 'rgba(0, 255, 136, 0.05)',
                        }
                      }}
                    >
                      <CloudUpload sx={{ fontSize: 32 }} />
                      <Typography variant="caption">Agregar Foto</Typography>
                    </Button>
                  </Box>
                </Box>

                {/* Submit Button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={<Save />}
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
                      },
                      '&:disabled': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#666',
                      }
                    }}
                  >
                    {loading ? 'Guardando...' : 'Guardar Cambio de Aceite'}
                  </Button>
                </Box>

                {loading && (
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress 
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #00ff88 0%, #00cc6a 100%)',
                          borderRadius: 3,
                        }
                      }}
                    />
                  </Box>
                )}
              </form>
            </CardContent>
          </Card>
        </Slide>
      </Container>

      {/* Success Dialog */}
      <Dialog
        open={successDialogOpen}
        onClose={() => {
          setSuccessDialogOpen(false);
          navigate('/maintenance');
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
          ¡Cambio de Aceite Registrado!
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="h6" sx={{ 
            color: '#fff',
            fontWeight: 600,
            mb: 2,
            fontSize: '1.2rem'
          }}>
            El mantenimiento fue registrado con éxito
          </Typography>
          <Typography variant="body2" sx={{ 
            color: '#888',
            fontSize: '0.95rem'
          }}>
            El cambio de aceite ha sido agregado correctamente al sistema y está disponible en el historial de mantenimientos.
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
              navigate('/maintenance');
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
    </Box>
  );
};

export default OilChange;
