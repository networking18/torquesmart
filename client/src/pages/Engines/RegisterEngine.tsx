import React, { useState } from 'react';
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
  Build,
  ArrowBack,
  Save
} from '@mui/icons-material';

const RegisterEngine: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    serial: '',
    tipoCombustible: '',
    cilindraje: '',
    potencia: '',
    anio: '',
    vehiculoAsignado: '',
    estado: 'Operativo',
    fechaInstalacion: new Date().toISOString().split('T')[0],
    observaciones: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectChange = (field: string) => (e: any) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!formData.marca || !formData.modelo || !formData.serial || !formData.tipoCombustible) {
      setShowError(true);
      return;
    }

    const newEngine = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    const existingEngines = JSON.parse(localStorage.getItem('torquesmart_engines') || '[]');
    existingEngines.push(newEngine);
    localStorage.setItem('torquesmart_engines', JSON.stringify(existingEngines));

    setShowSuccess(true);
    setFormData({
      marca: '',
      modelo: '',
      serial: '',
      tipoCombustible: '',
      cilindraje: '',
      potencia: '',
      anio: '',
      vehiculoAsignado: '',
      estado: 'Operativo',
      fechaInstalacion: new Date().toISOString().split('T')[0],
      observaciones: ''
    });
  };

  return (
    <Box sx={{ p: 3, background: '#0a0a0a', minHeight: '100vh' }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/engines/list')} sx={{ color: '#9c27b0', background: 'rgba(156, 39, 176, 0.1)', '&:hover': { background: 'rgba(156, 39, 176, 0.2)' } }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ color: '#9c27b0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Build />
          Registrar Motor
        </Typography>
      </Box>

      <Card sx={{ background: '#1a1a1a', border: '1px solid rgba(156, 39, 176, 0.3)', borderRadius: 2, maxWidth: 800, mx: 'auto' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ color: '#9c27b0', fontWeight: 600, mb: 3 }}>
            Datos del Motor
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Marca" value={formData.marca} onChange={handleChange('marca')} sx={{ '& .MuiOutlinedInput-root': { color: '#fff', backgroundColor: '#2a2a2a', '& fieldset': { borderColor: 'rgba(156, 39, 176, 0.3)' }, '&:hover fieldset': { borderColor: 'rgba(156, 39, 176, 0.5)' }, '&.Mui-focused fieldset': { borderColor: '#9c27b0' } }, '& .MuiInputLabel-root': { color: '#888' } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Modelo" value={formData.modelo} onChange={handleChange('modelo')} sx={{ '& .MuiOutlinedInput-root': { color: '#fff', backgroundColor: '#2a2a2a', '& fieldset': { borderColor: 'rgba(156, 39, 176, 0.3)' }, '&:hover fieldset': { borderColor: 'rgba(156, 39, 176, 0.5)' }, '&.Mui-focused fieldset': { borderColor: '#9c27b0' } }, '& .MuiInputLabel-root': { color: '#888' } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Serial" value={formData.serial} onChange={handleChange('serial')} sx={{ '& .MuiOutlinedInput-root': { color: '#fff', backgroundColor: '#2a2a2a', '& fieldset': { borderColor: 'rgba(156, 39, 176, 0.3)' }, '&:hover fieldset': { borderColor: 'rgba(156, 39, 176, 0.5)' }, '&.Mui-focused fieldset': { borderColor: '#9c27b0' } }, '& .MuiInputLabel-root': { color: '#888' } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { color: '#fff', backgroundColor: '#2a2a2a', '& fieldset': { borderColor: 'rgba(156, 39, 176, 0.3)' }, '&:hover fieldset': { borderColor: 'rgba(156, 39, 176, 0.5)' }, '&.Mui-focused fieldset': { borderColor: '#9c27b0' } }, '& .MuiInputLabel-root': { color: '#888' } }}>
                <InputLabel>Tipo de Combustible</InputLabel>
                <Select value={formData.tipoCombustible} onChange={handleSelectChange('tipoCombustible')} label="Tipo de Combustible">
                  <MenuItem value="Diésel">Diésel</MenuItem>
                  <MenuItem value="Gasolina">Gasolina</MenuItem>
                  <MenuItem value="Gas Natural">Gas Natural</MenuItem>
                  <MenuItem value="Híbrido">Híbrido</MenuItem>
                  <MenuItem value="Eléctrico">Eléctrico</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Cilindraje (cc)" value={formData.cilindraje} onChange={handleChange('cilindraje')} sx={{ '& .MuiOutlinedInput-root': { color: '#fff', backgroundColor: '#2a2a2a', '& fieldset': { borderColor: 'rgba(156, 39, 176, 0.3)' }, '&:hover fieldset': { borderColor: 'rgba(156, 39, 176, 0.5)' }, '&.Mui-focused fieldset': { borderColor: '#9c27b0' } }, '& .MuiInputLabel-root': { color: '#888' } }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Potencia (HP)" value={formData.potencia} onChange={handleChange('potencia')} sx={{ '& .MuiOutlinedInput-root': { color: '#fff', backgroundColor: '#2a2a2a', '& fieldset': { borderColor: 'rgba(156, 39, 176, 0.3)' }, '&:hover fieldset': { borderColor: 'rgba(156, 39, 176, 0.5)' }, '&.Mui-focused fieldset': { borderColor: '#9c27b0' } }, '& .MuiInputLabel-root': { color: '#888' } }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Año" value={formData.anio} onChange={handleChange('anio')} sx={{ '& .MuiOutlinedInput-root': { color: '#fff', backgroundColor: '#2a2a2a', '& fieldset': { borderColor: 'rgba(156, 39, 176, 0.3)' }, '&:hover fieldset': { borderColor: 'rgba(156, 39, 176, 0.5)' }, '&.Mui-focused fieldset': { borderColor: '#9c27b0' } }, '& .MuiInputLabel-root': { color: '#888' } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Vehículo Asignado" value={formData.vehiculoAsignado} onChange={handleChange('vehiculoAsignado')} sx={{ '& .MuiOutlinedInput-root': { color: '#fff', backgroundColor: '#2a2a2a', '& fieldset': { borderColor: 'rgba(156, 39, 176, 0.3)' }, '&:hover fieldset': { borderColor: 'rgba(156, 39, 176, 0.5)' }, '&.Mui-focused fieldset': { borderColor: '#9c27b0' } }, '& .MuiInputLabel-root': { color: '#888' } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { color: '#fff', backgroundColor: '#2a2a2a', '& fieldset': { borderColor: 'rgba(156, 39, 176, 0.3)' }, '&:hover fieldset': { borderColor: 'rgba(156, 39, 176, 0.5)' }, '&.Mui-focused fieldset': { borderColor: '#9c27b0' } }, '& .MuiInputLabel-root': { color: '#888' } }}>
                <InputLabel>Estado</InputLabel>
                <Select value={formData.estado} onChange={handleSelectChange('estado')} label="Estado">
                  <MenuItem value="Operativo">Operativo</MenuItem>
                  <MenuItem value="En Reparación">En Reparación</MenuItem>
                  <MenuItem value="Fuera de Servicio">Fuera de Servicio</MenuItem>
                  <MenuItem value="Reserva">Reserva</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Fecha de Instalación" type="date" value={formData.fechaInstalacion} onChange={handleChange('fechaInstalacion')} InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { color: '#fff', backgroundColor: '#2a2a2a', '& fieldset': { borderColor: 'rgba(156, 39, 176, 0.3)' }, '&:hover fieldset': { borderColor: 'rgba(156, 39, 176, 0.5)' }, '&.Mui-focused fieldset': { borderColor: '#9c27b0' } }, '& .MuiInputLabel-root': { color: '#888' } }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Observaciones" multiline rows={3} value={formData.observaciones} onChange={handleChange('observaciones')} sx={{ '& .MuiOutlinedInput-root': { color: '#fff', backgroundColor: '#2a2a2a', '& fieldset': { borderColor: 'rgba(156, 39, 176, 0.3)' }, '&:hover fieldset': { borderColor: 'rgba(156, 39, 176, 0.5)' }, '&.Mui-focused fieldset': { borderColor: '#9c27b0' } }, '& .MuiInputLabel-root': { color: '#888' } }} />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" fullWidth startIcon={<Save />} onClick={handleSubmit} sx={{ background: 'linear-gradient(45deg, #9c27b0, #7b1fa2)', color: '#fff', fontWeight: 600, py: 1.5, '&:hover': { background: 'linear-gradient(45deg, #ab47bc, #9c27b0)' } }}>
                Guardar Motor
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Snackbar open={showSuccess} autoHideDuration={3000} onClose={() => setShowSuccess(false)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert severity="success" sx={{ backgroundColor: '#4caf50', color: '#fff' }}>¡Motor registrado exitosamente!</Alert>
      </Snackbar>
      <Snackbar open={showError} autoHideDuration={3000} onClose={() => setShowError(false)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert severity="error" sx={{ backgroundColor: '#f44336', color: '#fff' }}>Complete los campos requeridos: Marca, Modelo, Serial, Tipo de Combustible</Alert>
      </Snackbar>
    </Box>
  );
};

export default RegisterEngine;
