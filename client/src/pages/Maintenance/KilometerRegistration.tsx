import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Speed,
  ArrowBack,
  Save,
  DirectionsCar
} from '@mui/icons-material';

interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: string;
}

interface KilometerRecord {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  mileage: number;
  date: string;
  createdAt: string;
}

const KilometerRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [mileage, setMileage] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = () => {
    // Cargar vehículos desde localStorage o API
    const savedVehicles = JSON.parse(localStorage.getItem('torquesmart_vehicles') || '[]');
    setVehicles(savedVehicles);
  };

  const validateForm = () => {
    if (!selectedVehicle) {
      setErrorMessage('Por favor seleccione un vehículo');
      return false;
    }
    if (!mileage || isNaN(Number(mileage)) || Number(mileage) <= 0) {
      setErrorMessage('Por favor ingrese un kilometraje válido');
      return false;
    }
    if (!date) {
      setErrorMessage('Por favor seleccione una fecha');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setShowError(true);
      return;
    }

    setLoading(true);
    setShowError(false);

    try {
      const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);
      
      if (!selectedVehicleData) {
        setErrorMessage('Vehículo no encontrado');
        setShowError(true);
        setLoading(false);
        return;
      }

      const newRecord: KilometerRecord = {
        id: Date.now().toString(),
        vehicleId: selectedVehicle,
        vehiclePlate: selectedVehicleData.plate,
        vehicleBrand: selectedVehicleData.brand,
        vehicleModel: selectedVehicleData.model,
        mileage: Number(mileage),
        date: date,
        createdAt: new Date().toISOString()
      };

      // Guardar en localStorage (preparado para futura conexión con BD)
      const existingRecords = JSON.parse(localStorage.getItem('torquesmart_kilometer_records') || '[]');
      existingRecords.push(newRecord);
      localStorage.setItem('torquesmart_kilometer_records', JSON.stringify(existingRecords));

      // Resetear formulario
      setSelectedVehicle('');
      setMileage('');
      setDate(new Date().toISOString().split('T')[0]);
      
      setShowSuccess(true);
      setLoading(false);
    } catch (error) {
      console.error('Error al guardar registro:', error);
      setErrorMessage('Error al guardar el registro');
      setShowError(true);
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/maintenance');
  };

  return (
    <Box sx={{ 
      p: 3, 
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)', 
      minHeight: '100vh' 
    }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton 
          onClick={handleBack}
          sx={{ 
            color: '#00ff88',
            background: 'rgba(0, 255, 136, 0.1)',
            '&:hover': { background: 'rgba(0, 255, 136, 0.2)' }
          }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ 
          color: '#00ff88', 
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Speed />
          Registro de Kilometraje
        </Typography>
      </Box>

      {/* Form Card */}
      <Card sx={{
        background: 'rgba(26, 26, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 255, 136, 0.3)',
        borderRadius: 2,
        maxWidth: 600,
        mx: 'auto',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 20px 40px rgba(0, 255, 136, 0.1)',
          border: '1px solid rgba(0, 255, 136, 0.5)'
        }
      }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ 
            color: '#00ff88', 
            fontWeight: 600, 
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <DirectionsCar />
            Registrar Kilometraje del Vehículo
          </Typography>

          <Grid container spacing={3}>
            {/* Selector de Vehículo */}
            <Grid item xs={12}>
              <FormControl fullWidth sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                },
                '& .MuiInputLabel-root': { color: '#888' },
              }}>
                <InputLabel sx={{ color: '#888' }}>Vehículo</InputLabel>
                <Select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  label="Vehículo"
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    <em>Seleccione un vehículo...</em>
                  </MenuItem>
                  {vehicles.map((vehicle) => (
                    <MenuItem key={vehicle.id} value={vehicle.id}>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                          {vehicle.brand} {vehicle.model}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#888', ml: 1 }}>
                          ({vehicle.plate})
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Campo de Kilometraje */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Kilometraje"
                type="number"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="Ingrese el kilometraje actual"
                InputProps={{
                  startAdornment: <Speed sx={{ color: '#888', mr: 1 }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                  },
                  '& .MuiInputLabel-root': { color: '#888' },
                }}
              />
            </Grid>

            {/* Selector de Fecha */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                  },
                  '& .MuiInputLabel-root': { color: '#888' },
                }}
              />
            </Grid>

            {/* Botón Guardar */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Save />}
                onClick={handleSubmit}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(45deg, #00ff88, #00cc6a)',
                  color: '#000',
                  fontWeight: 600,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #00ffaa, #00ff88)',
                  },
                  '&:disabled': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#666',
                  }
                }}
              >
                {loading ? 'Guardando...' : 'Guardar Registro'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{
              background: 'rgba(26, 26, 26, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: 2,
              textAlign: 'center',
              py: 2,
            }}>
              <Typography variant="h4" sx={{ color: '#00ff88', fontWeight: 700 }}>
                {vehicles.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888' }}>
                Vehículos Disponibles
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{
              background: 'rgba(26, 26, 26, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: 2,
              textAlign: 'center',
              py: 2,
            }}>
              <Typography variant="h4" sx={{ color: '#00cc6a', fontWeight: 700 }}>
                {JSON.parse(localStorage.getItem('torquesmart_kilometer_records') || '[]').length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888' }}>
                Registros Totales
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{
              background: 'rgba(26, 26, 26, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: 2,
              textAlign: 'center',
              py: 2,
            }}>
              <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 700 }}>
                {new Date().toLocaleDateString('es-ES', { month: 'long' })}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888' }}>
                Mes Actual
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Alertas */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="success" sx={{ backgroundColor: '#4caf50', color: '#fff' }}>
          ¡Registro guardado exitosamente!
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={5000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="error" sx={{ backgroundColor: '#f44336', color: '#fff' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default KilometerRegistration;
