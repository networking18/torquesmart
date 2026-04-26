import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Build,
  ArrowBack,
  Search,
  Edit,
  Delete,
  Visibility,
  DirectionsCar
} from '@mui/icons-material';

interface Engine {
  id: string;
  marca: string;
  modelo: string;
  serial: string;
  tipoCombustible: string;
  cilindraje: string;
  potencia: string;
  anio: string;
  vehiculoAsignado: string;
  estado: string;
  fechaInstalacion: string;
  observaciones: string;
  createdAt: string;
}

const EngineList: React.FC = () => {
  const navigate = useNavigate();
  const [engines, setEngines] = useState<Engine[]>([]);
  const [filteredEngines, setFilteredEngines] = useState<Engine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEngine, setSelectedEngine] = useState<Engine | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    loadEngines();
  }, []);

  useEffect(() => {
    filterEngines();
  }, [engines, searchTerm]);

  const loadEngines = () => {
    const saved = JSON.parse(localStorage.getItem('torquesmart_engines') || '[]');
    setEngines(saved);
  };

  const filterEngines = () => {
    let filtered = [...engines];
    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.vehiculoAsignado.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredEngines(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Operativo': return '#4caf50';
      case 'En Reparación': return '#ff9800';
      case 'Fuera de Servicio': return '#f44336';
      case 'Reserva': return '#2196f3';
      default: return '#888';
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este motor?')) {
      const updated = engines.filter(e => e.id !== id);
      localStorage.setItem('torquesmart_engines', JSON.stringify(updated));
      setEngines(updated);
    }
  };

  const handleViewDetails = (engine: Engine) => {
    setSelectedEngine(engine);
    setDetailOpen(true);
  };

  const stats = {
    total: engines.length,
    operativos: engines.filter(e => e.estado === 'Operativo').length,
    reparacion: engines.filter(e => e.estado === 'En Reparación').length,
    fueraServicio: engines.filter(e => e.estado === 'Fuera de Servicio').length
  };

  return (
    <Box sx={{ p: 3, background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)', minHeight: '100vh' }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/dashboard')} sx={{ color: '#9c27b0', background: 'rgba(156, 39, 176, 0.1)', '&:hover': { background: 'rgba(156, 39, 176, 0.2)' } }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ color: '#9c27b0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Build />
          Lista de Motores
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(26, 26, 26, 0.8)', border: '1px solid rgba(156, 39, 176, 0.3)', borderRadius: 2, textAlign: 'center', py: 2 }}>
            <Typography variant="h4" sx={{ color: '#9c27b0', fontWeight: 700 }}>{stats.total}</Typography>
            <Typography variant="body2" sx={{ color: '#888' }}>Total</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(26, 26, 26, 0.8)', border: '1px solid rgba(76, 175, 80, 0.3)', borderRadius: 2, textAlign: 'center', py: 2 }}>
            <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 700 }}>{stats.operativos}</Typography>
            <Typography variant="body2" sx={{ color: '#888' }}>Operativos</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(26, 26, 26, 0.8)', border: '1px solid rgba(255, 152, 0, 0.3)', borderRadius: 2, textAlign: 'center', py: 2 }}>
            <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 700 }}>{stats.reparacion}</Typography>
            <Typography variant="body2" sx={{ color: '#888' }}>En Reparación</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(26, 26, 26, 0.8)', border: '1px solid rgba(244, 67, 54, 0.3)', borderRadius: 2, textAlign: 'center', py: 2 }}>
            <Typography variant="h4" sx={{ color: '#f44336', fontWeight: 700 }}>{stats.fueraServicio}</Typography>
            <Typography variant="body2" sx={{ color: '#888' }}>Fuera de Servicio</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Search + Add */}
      <Card sx={{ background: 'rgba(26, 26, 26, 0.8)', border: '1px solid rgba(156, 39, 176, 0.2)', borderRadius: 2, mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField fullWidth placeholder="Buscar por marca, modelo, serial..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <Search sx={{ color: '#888', mr: 1 }} /> }} sx={{ '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(156, 39, 176, 0.3)' }, '&:hover fieldset': { borderColor: 'rgba(156, 39, 176, 0.5)' }, '&.Mui-focused fieldset': { borderColor: '#9c27b0' } } }} />
            </Grid>
            <Grid item xs={12} md={4}>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Table */}
      <Card sx={{ background: 'rgba(26, 26, 26, 0.8)', border: '1px solid rgba(156, 39, 176, 0.2)', borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <TableContainer component={Paper} sx={{ background: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#9c27b0', fontWeight: 600 }}>Marca / Modelo</TableCell>
                  <TableCell sx={{ color: '#9c27b0', fontWeight: 600 }}>Serial</TableCell>
                  <TableCell sx={{ color: '#9c27b0', fontWeight: 600 }}>Combustible</TableCell>
                  <TableCell sx={{ color: '#9c27b0', fontWeight: 600 }}>Vehículo</TableCell>
                  <TableCell sx={{ color: '#9c27b0', fontWeight: 600 }}>Estado</TableCell>
                  <TableCell sx={{ color: '#9c27b0', fontWeight: 600 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEngines.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ color: '#888', textAlign: 'center', py: 4 }}>
                      No hay motores registrados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEngines.map((engine) => (
                    <TableRow key={engine.id} sx={{ '&:hover': { background: 'rgba(156, 39, 176, 0.05)' } }}>
                      <TableCell sx={{ color: '#fff' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{engine.marca} {engine.modelo}</Typography>
                        <Typography variant="caption" sx={{ color: '#888' }}>{engine.anio && `Año: ${engine.anio}`}</Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#fff' }}>{engine.serial}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{engine.tipoCombustible}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>
                        {engine.vehiculoAsignado || 'Sin asignar'}
                      </TableCell>
                      <TableCell>
                        <Chip label={engine.estado} size="small" sx={{ backgroundColor: getStatusColor(engine.estado) + '20', color: getStatusColor(engine.estado), border: `1px solid ${getStatusColor(engine.estado)}`, fontWeight: 600 }} />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" onClick={() => handleViewDetails(engine)} sx={{ color: '#9c27b0', '&:hover': { background: 'rgba(156, 39, 176, 0.1)' } }}>
                            <Visibility />
                          </IconButton>
                          <IconButton size="small" sx={{ color: '#ff9800', '&:hover': { background: 'rgba(255, 152, 0, 0.1)' } }}>
                            <Edit />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDelete(engine.id)} sx={{ color: '#f44336', '&:hover': { background: 'rgba(244, 67, 54, 0.1)' } }}>
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { background: 'rgba(26, 26, 26, 0.95)', border: '1px solid rgba(156, 39, 176, 0.3)', borderRadius: 2 } }}>
        <DialogTitle sx={{ color: '#9c27b0', fontWeight: 600 }}>Detalle del Motor</DialogTitle>
        <DialogContent>
          {selectedEngine && (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}><Typography sx={{ color: '#888' }}>Marca:</Typography><Typography sx={{ color: '#fff', fontWeight: 600 }}>{selectedEngine.marca}</Typography></Grid>
                <Grid item xs={6}><Typography sx={{ color: '#888' }}>Modelo:</Typography><Typography sx={{ color: '#fff', fontWeight: 600 }}>{selectedEngine.modelo}</Typography></Grid>
                <Grid item xs={6}><Typography sx={{ color: '#888' }}>Serial:</Typography><Typography sx={{ color: '#fff', fontWeight: 600 }}>{selectedEngine.serial}</Typography></Grid>
                <Grid item xs={6}><Typography sx={{ color: '#888' }}>Combustible:</Typography><Typography sx={{ color: '#fff', fontWeight: 600 }}>{selectedEngine.tipoCombustible}</Typography></Grid>
                <Grid item xs={6}><Typography sx={{ color: '#888' }}>Cilindraje:</Typography><Typography sx={{ color: '#fff', fontWeight: 600 }}>{selectedEngine.cilindraje || 'N/A'} cc</Typography></Grid>
                <Grid item xs={6}><Typography sx={{ color: '#888' }}>Potencia:</Typography><Typography sx={{ color: '#fff', fontWeight: 600 }}>{selectedEngine.potencia || 'N/A'} HP</Typography></Grid>
                <Grid item xs={6}><Typography sx={{ color: '#888' }}>Año:</Typography><Typography sx={{ color: '#fff', fontWeight: 600 }}>{selectedEngine.anio || 'N/A'}</Typography></Grid>
                <Grid item xs={6}><Typography sx={{ color: '#888' }}>Estado:</Typography><Chip label={selectedEngine.estado} size="small" sx={{ backgroundColor: getStatusColor(selectedEngine.estado) + '20', color: getStatusColor(selectedEngine.estado), border: `1px solid ${getStatusColor(selectedEngine.estado)}`, fontWeight: 600 }} /></Grid>
                <Grid item xs={6}><Typography sx={{ color: '#888' }}>Vehículo:</Typography><Typography sx={{ color: '#fff', fontWeight: 600 }}>{selectedEngine.vehiculoAsignado || 'Sin asignar'}</Typography></Grid>
                <Grid item xs={6}><Typography sx={{ color: '#888' }}>Fecha Instalación:</Typography><Typography sx={{ color: '#fff', fontWeight: 600 }}>{selectedEngine.fechaInstalacion}</Typography></Grid>
                {selectedEngine.observaciones && (
                  <Grid item xs={12}><Typography sx={{ color: '#888' }}>Observaciones:</Typography><Typography sx={{ color: '#fff' }}>{selectedEngine.observaciones}</Typography></Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDetailOpen(false)} sx={{ color: '#9c27b0' }}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EngineList;
