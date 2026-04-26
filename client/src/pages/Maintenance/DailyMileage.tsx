// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add,
  Delete,
  Save,
  ArrowBack,
  Speed,
  DirectionsCar,
  CalendarToday,
  Edit,
  Visibility
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface DailyMileageRecord {
  id: string;
  vehiclePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  date: string;
  startMileage: number;
  endMileage: number;
  totalKm: number;
  driver: string;
  notes: string;
  createdAt: string;
}

const DailyMileage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vehiclePlate: '',
    vehicleBrand: '',
    vehicleModel: '',
    date: new Date().toISOString().split('T')[0],
    startMileage: '',
    endMileage: '',
    driver: '',
    notes: ''
  });

  const [mileageRecords, setMileageRecords] = useState<DailyMileageRecord[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DailyMileageRecord | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  useEffect(() => {
    loadMileageRecords();
  }, []);

  const loadMileageRecords = () => {
    const savedRecords = JSON.parse(localStorage.getItem('torquesmart_daily_mileage') || '[]');
    setMileageRecords(savedRecords);
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.vehiclePlate.trim()) {
      newErrors.vehiclePlate = 'La placa del vehículo es requerida';
    }
    if (!formData.vehicleBrand.trim()) {
      newErrors.vehicleBrand = 'La marca del vehículo es requerida';
    }
    if (!formData.vehicleModel.trim()) {
      newErrors.vehicleModel = 'El modelo del vehículo es requerido';
    }
    if (!formData.date) {
      newErrors.date = 'La fecha es requerida';
    }
    if (!formData.startMileage || isNaN(Number(formData.startMileage))) {
      newErrors.startMileage = 'El kilometraje inicial es requerido y debe ser un número';
    }
    if (!formData.endMileage || isNaN(Number(formData.endMileage))) {
      newErrors.endMileage = 'El kilometraje final es requerido y debe ser un número';
    }
    if (Number(formData.startMileage) >= Number(formData.endMileage)) {
      newErrors.endMileage = 'El kilometraje final debe ser mayor al inicial';
    }
    if (!formData.driver.trim()) {
      newErrors.driver = 'El nombre del conductor es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setShowError(true);
      return;
    }
    
    setLoading(true);
    
    try {
      const startKm = Number(formData.startMileage);
      const endKm = Number(formData.endMileage);
      const totalKm = endKm - startKm;

      const mileageRecord: DailyMileageRecord = {
        id: Date.now().toString(),
        ...formData,
        startMileage: startKm,
        endMileage: endKm,
        totalKm,
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      const existingRecords = JSON.parse(localStorage.getItem('torquesmart_daily_mileage') || '[]');
      
      try {
        existingRecords.push(mileageRecord);
        const dataToSave = JSON.stringify(existingRecords);
        localStorage.setItem('torquesmart_daily_mileage', dataToSave);
      } catch (quotaError) {
        // If quota exceeded, remove oldest records
        const trimmedRecords = existingRecords.slice(-50);
        localStorage.setItem('torquesmart_daily_mileage', JSON.stringify(trimmedRecords));
        
        trimmedRecords.push(mileageRecord);
        localStorage.setItem('torquesmart_daily_mileage', JSON.stringify(trimmedRecords));
      }
      
      setLoading(false);
      setShowSuccess(true);
      setSuccessDialogOpen(true);
      
      // Reset form
      setFormData({
        vehiclePlate: '',
        vehicleBrand: '',
        vehicleModel: '',
        date: new Date().toISOString().split('T')[0],
        startMileage: '',
        endMileage: '',
        driver: '',
        notes: ''
      });
      
      loadMileageRecords();
      
    } catch (error) {
      console.error('Error saving mileage record:', error);
      setLoading(false);
      setShowError(true);
    }
  };

  const handleDeleteRecord = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este registro?')) {
      const updatedRecords = mileageRecords.filter(record => record.id !== id);
      localStorage.setItem('torquesmart_daily_mileage', JSON.stringify(updatedRecords));
      setMileageRecords(updatedRecords);
    }
  };

  const handleViewDetails = (record: DailyMileageRecord) => {
    setSelectedRecord(record);
    setDetailDialogOpen(true);
  };

  const calculateStats = () => {
    const totalRecords = mileageRecords.length;
    const totalKm = mileageRecords.reduce((sum, record) => sum + record.totalKm, 0);
    const avgKm = totalRecords > 0 ? Math.round(totalKm / totalRecords) : 0;
    
    return { totalRecords, totalKm, avgKm };
  };

  const stats = calculateStats();

  return (
    <Box sx={{ 
      p: 3, 
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)', 
      minHeight: '100vh' 
    }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton 
          onClick={() => navigate('/maintenance')}
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
          Reporte de Kilometraje Diario
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{
            background: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            borderRadius: 2,
          }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <DirectionsCar sx={{ fontSize: 40, color: '#00ff88', mb: 2 }} />
              <Typography variant="h5" sx={{ color: '#00ff88', fontWeight: 700 }}>
                {stats.totalRecords}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888' }}>
                Total de Registros
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{
            background: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            borderRadius: 2,
          }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Speed sx={{ fontSize: 40, color: '#00ff88', mb: 2 }} />
              <Typography variant="h5" sx={{ color: '#00ff88', fontWeight: 700 }}>
                {stats.totalKm.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888' }}>
                Kilómetros Totales
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{
            background: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            borderRadius: 2,
          }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <CalendarToday sx={{ fontSize: 40, color: '#00ff88', mb: 2 }} />
              <Typography variant="h5" sx={{ color: '#00ff88', fontWeight: 700 }}>
                {stats.avgKm.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888' }}>
                Promedio Diario
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Form Section */}
      <Card sx={{
        background: 'rgba(26, 26, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        borderRadius: 2,
        mb: 4
      }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ 
            color: '#00ff88', 
            fontWeight: 600, 
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Add />
            Nuevo Registro de Kilometraje
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
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
                      '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                    },
                    '& .MuiInputLabel-root': { color: '#888' },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Marca del Vehículo"
                  value={formData.vehicleBrand}
                  onChange={handleInputChange('vehicleBrand')}
                  error={!!errors.vehicleBrand}
                  helperText={errors.vehicleBrand}
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
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Modelo del Vehículo"
                  value={formData.vehicleModel}
                  onChange={handleInputChange('vehicleModel')}
                  error={!!errors.vehicleModel}
                  helperText={errors.vehicleModel}
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
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Conductor"
                  value={formData.driver}
                  onChange={handleInputChange('driver')}
                  error={!!errors.driver}
                  helperText={errors.driver}
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
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Fecha"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange('date')}
                  error={!!errors.date}
                  helperText={errors.date}
                  InputLabelProps={{ shrink: true }}
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
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Kilometraje Inicial"
                  type="number"
                  value={formData.startMileage}
                  onChange={handleInputChange('startMileage')}
                  error={!!errors.startMileage}
                  helperText={errors.startMileage}
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
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Kilometraje Final"
                  type="number"
                  value={formData.endMileage}
                  onChange={handleInputChange('endMileage')}
                  error={!!errors.endMileage}
                  helperText={errors.endMileage}
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
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notas Adicionales"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange('notes')}
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
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  startIcon={<Save />}
                  sx={{
                    background: 'linear-gradient(45deg, #00ff88, #00cc6a)',
                    color: '#000',
                    fontWeight: 600,
                    py: 1.5,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #00ffaa, #00ff88)',
                    },
                    '&:disabled': {
                      background: 'rgba(0, 255, 136, 0.3)',
                    }
                  }}
                >
                  {loading ? 'Guardando...' : 'Guardar Registro'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card sx={{
        background: 'rgba(26, 26, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        borderRadius: 2,
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ 
            color: '#00ff88', 
            fontWeight: 600, 
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <DirectionsCar />
            Historial de Registros
          </Typography>
          
          <TableContainer component={Paper} sx={{ background: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Vehículo</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Fecha</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Conductor</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Km Inicial</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Km Final</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Total Km</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mileageRecords.map((record) => (
                  <TableRow key={record.id} sx={{ '&:hover': { background: 'rgba(0, 255, 136, 0.05)' } }}>
                    <TableCell sx={{ color: '#fff' }}>
                      {record.vehicleBrand} {record.vehicleModel}
                      <Typography variant="caption" sx={{ color: '#888', display: 'block' }}>
                        Placa: {record.vehiclePlate}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: '#fff' }}>{record.date}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{record.driver}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{record.startMileage.toLocaleString()}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{record.endMileage.toLocaleString()}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>
                      <Chip
                        label={`${record.totalKm.toLocaleString()} km`}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(0, 255, 136, 0.2)',
                          color: '#00ff88',
                          border: '1px solid rgba(0, 255, 136, 0.5)',
                          fontWeight: 600
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(record)}
                          sx={{
                            color: '#00ff88',
                            '&:hover': { background: 'rgba(0, 255, 136, 0.1)' }
                          }}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteRecord(record.id)}
                          sx={{
                            color: '#ff6b6b',
                            '&:hover': { background: 'rgba(255, 107, 107, 0.1)' }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog
        open={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(42, 42, 42, 0.95) 100%)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ color: '#00ff88', fontWeight: 600 }}>
          ¡Registro Guardado Exitosamente!
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#fff' }}>
            El registro de kilometraje diario ha sido guardado correctamente.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setSuccessDialogOpen(false)}
            sx={{
              color: '#00ff88',
              borderColor: 'rgba(0, 255, 136, 0.5)',
              '&:hover': { background: 'rgba(0, 255, 136, 0.1)' }
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(42, 42, 42, 0.95) 100%)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ color: '#00ff88', fontWeight: 600 }}>
          Detalles del Registro
        </DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ color: '#00ff88', fontWeight: 600 }}>
                    Vehículo:
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#fff' }}>
                    {selectedRecord.vehicleBrand} {selectedRecord.vehicleModel}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ color: '#00ff88', fontWeight: 600 }}>
                    Placa:
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#fff' }}>
                    {selectedRecord.vehiclePlate}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ color: '#00ff88', fontWeight: 600 }}>
                    Fecha:
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#fff' }}>
                    {selectedRecord.date}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ color: '#00ff88', fontWeight: 600 }}>
                    Conductor:
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#fff' }}>
                    {selectedRecord.driver}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" sx={{ color: '#00ff88', fontWeight: 600 }}>
                    Km Inicial:
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#fff' }}>
                    {selectedRecord.startMileage.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" sx={{ color: '#00ff88', fontWeight: 600 }}>
                    Km Final:
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#fff' }}>
                    {selectedRecord.endMileage.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" sx={{ color: '#00ff88', fontWeight: 600 }}>
                    Total Km:
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#00ff88', fontWeight: 700 }}>
                    {selectedRecord.totalKm.toLocaleString()}
                  </Typography>
                </Grid>
                {selectedRecord.notes && (
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ color: '#00ff88', fontWeight: 600 }}>
                      Notas:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#fff' }}>
                      {selectedRecord.notes}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDetailDialogOpen(false)}
            sx={{
              color: '#00ff88',
              borderColor: 'rgba(0, 255, 136, 0.5)',
              '&:hover': { background: 'rgba(0, 255, 136, 0.1)' }
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbars */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="success" sx={{ backgroundColor: '#4caf50', color: '#fff' }}>
          Registro guardado exitosamente
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={3000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="error" sx={{ backgroundColor: '#f44336', color: '#fff' }}>
          Error al guardar el registro
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DailyMileage;
