// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  Schedule,
  TrendingUp,
  TrendingDown,
  Build,
  AttachMoney,
  CalendarToday,
  FilterList,
  Download,
  Refresh,
  Assessment,
  Speed,
  Warning,
  CheckCircle,
  Pending,
  Error
} from '@mui/icons-material';

const PreventiveReport: React.FC = () => {
  const [preventiveMaintenance, setPreventiveMaintenance] = useState(() => {
    const savedRecords = JSON.parse(localStorage.getItem('torquesmart_preventive_maintenance') || '[]');
    return savedRecords.map((record, index) => ({
      id: record.id || index + 1,
      vehicle: record.vehicleName || 'Vehículo no especificado',
      plate: record.vehiclePlate || 'N/A',
      scheduledDate: record.scheduledDate || new Date().toISOString().split('T')[0],
      completedDate: record.completedDate || null,
      type: record.maintenanceType || 'Mantenimiento Preventivo',
      status: record.status || 'Pendiente',
      cost: record.cost || 0,
      technician: record.technician || 'No asignado',
      nextMaintenance: record.nextMaintenanceDate || '',
      priority: record.priority || 'Media',
      completionRate: record.completionRate || 0,
      notes: record.notes || '',
      photos: record.photos || []
    }));
  });

  const [filteredData, setFilteredData] = useState(preventiveMaintenance);

  // Update filtered data when preventiveMaintenance changes
  useEffect(() => {
    setFilteredData(preventiveMaintenance);
  }, [preventiveMaintenance]);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [chartData, setChartData] = useState({
    totalMaintenance: 0,
    completedMaintenance: 0,
    pendingMaintenance: 0,
    totalCost: 0,
    averageCost: 0,
    completionRate: 0,
    monthlyData: []
  });

  useEffect(() => {
    calculateStatistics();
  }, [filteredData]);

  const calculateStatistics = () => {
    const totalMaintenance = filteredData.length;
    const completedMaintenance = filteredData.filter(item => item.status === 'Completado').length;
    const pendingMaintenance = filteredData.filter(item => item.status === 'Pendiente').length;
    const totalCost = filteredData.reduce((sum, item) => sum + item.cost, 0);
    const averageCost = completedMaintenance > 0 ? totalCost / completedMaintenance : 0;
    const completionRate = totalMaintenance > 0 ? (completedMaintenance / totalMaintenance) * 100 : 0;
    
    // Simulate monthly data
    const monthlyData = [
      { month: 'Ene', scheduled: 15, completed: 12, pending: 3, cost: 45000 },
      { month: 'Feb', scheduled: 18, completed: 14, pending: 4, cost: 52000 },
      { month: 'Mar', scheduled: 20, completed: 16, pending: 4, cost: 58000 },
      { month: 'Abr', scheduled: 22, completed: 18, pending: 4, cost: 62000 },
      { month: 'May', scheduled: 25, completed: 20, pending: 5, cost: 70000 },
      { month: 'Jun', scheduled: 19, completed: 15, pending: 4, cost: 55000 }
    ];

    setChartData({
      totalMaintenance,
      completedMaintenance,
      pendingMaintenance,
      totalCost,
      averageCost,
      completionRate,
      monthlyData
    });
  };

  const handleFilter = () => {
    let filtered = preventiveMaintenance;
    
    if (filter) {
      filtered = filtered.filter(item => 
        item.vehicle.toLowerCase().includes(filter.toLowerCase()) ||
        item.plate.toLowerCase().includes(filter.toLowerCase()) ||
        item.technician.toLowerCase().includes(filter.toLowerCase()) ||
        item.type.toLowerCase().includes(filter.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    setFilteredData(filtered);
  };

  const handleExport = () => {
    const csvContent = [
      ['Vehículo', 'Placa', 'Fecha Programada', 'Fecha Completada', 'Tipo', 'Estado', 'Costo', 'Técnico', 'Próximo Mantenimiento', 'Prioridad', '% Completado'],
      ...filteredData.map(item => [
        item.vehicle,
        item.plate,
        item.scheduledDate,
        item.completedDate || 'N/A',
        item.type,
        item.status,
        item.cost,
        item.technician,
        item.nextMaintenance,
        item.priority,
        `${item.completionRate}%`
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reporte_mantenimiento_preventivo.csv';
    a.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completado': return '#00ff88';
      case 'Pendiente': return '#ff9800';
      case 'En Progreso': return '#2196f3';
      case 'Cancelado': return '#ff6b6b';
      default: return '#888';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return '#f44336';
      case 'Media': return '#ff9800';
      case 'Baja': return '#4caf50';
      default: return '#888';
    }
  };

  const renderCompletionChart = () => {
    const maxValue = Math.max(...chartData.monthlyData.map(item => item.completed));
    
    return (
      <Box sx={{ height: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', p: 2 }}>
        {chartData.monthlyData.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <Typography variant="caption" sx={{ color: '#888', mb: 1 }}>
              {item.completed}/{item.scheduled}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: 1 }}>
              <Box
                sx={{
                  width: '20px',
                  height: `${(item.completed / maxValue) * 180}px`,
                  background: 'linear-gradient(180deg, #00ff88 0%, #00cc70 100%)',
                  borderRadius: '4px 4px 0 0',
                  '&:hover': {
                    background: 'linear-gradient(180deg, #00ffaa 0%, #00ff88 100%)',
                    transform: 'scaleY(1.05)',
                    transition: 'all 0.3s ease'
                  }
                }}
              />
              <Box
                sx={{
                  width: '20px',
                  height: `${(item.pending / maxValue) * 180}px`,
                  background: 'linear-gradient(180deg, #ff9800 0%, #f57c00 100%)',
                  borderRadius: '4px 4px 0 0',
                  '&:hover': {
                    background: 'linear-gradient(180deg, #ffb74d 0%, #ff9800 100%)',
                    transform: 'scaleY(1.05)',
                    transition: 'all 0.3s ease'
                  }
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, mt: 1 }}>
              {item.month}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Box sx={{ width: 12, height: 12, backgroundColor: '#00ff88', borderRadius: 2 }} />
              <Typography variant="caption" sx={{ color: '#888' }}>
                Completado
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, backgroundColor: '#ff9800', borderRadius: 2 }} />
              <Typography variant="caption" sx={{ color: '#888' }}>
                Pendiente
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3, background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ color: '#00ff88', fontWeight: 700, mb: 4 }}>
        📊 Reporte de Mantenimiento Preventivo
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 255, 136, 0.05) 100%)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: 2,
            backdropFilter: 'blur(10px)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Schedule sx={{ color: '#00ff88', fontSize: 32, mr: 2 }} />
                <Typography variant="h6" sx={{ color: '#00ff88', fontWeight: 600 }}>
                  Total Mantenimientos
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
                {chartData.totalMaintenance}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', mt: 1 }}>
                Programados
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: 2,
            backdropFilter: 'blur(10px)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ color: '#4caf50', fontSize: 32, mr: 2 }} />
                <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 600 }}>
                  Completados
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
                {chartData.completedMaintenance}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', mt: 1 }}>
                Realizados
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%)',
            border: '1px solid rgba(255, 152, 0, 0.3)',
            borderRadius: 2,
            backdropFilter: 'blur(10px)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Pending sx={{ color: '#ff9800', fontSize: 32, mr: 2 }} />
                <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 600 }}>
                  Pendientes
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
                {chartData.pendingMaintenance}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', mt: 1 }}>
                Por realizar
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)',
            border: '1px solid rgba(33, 150, 243, 0.3)',
            borderRadius: 2,
            backdropFilter: 'blur(10px)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ color: '#2196f3', fontSize: 32, mr: 2 }} />
                <Typography variant="h6" sx={{ color: '#2196f3', fontWeight: 600 }}>
                  Tasa de Completado
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
                {chartData.completionRate.toFixed(1)}%
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', mt: 1 }}>
                Eficiencia
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart Section */}
      <Card sx={{ 
        background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(42, 42, 42, 0.9) 100%)',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        borderRadius: 2,
        backdropFilter: 'blur(10px)',
        mb: 4
      }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#00ff88', fontWeight: 600, mb: 3 }}>
            📈 Tendencia Mensual de Mantenimiento Preventivo
          </Typography>
          {renderCompletionChart()}
        </CardContent>
      </Card>

      {/* Filters and Actions */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Buscar por vehículo, placa, técnico o tipo..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{
            flex: 1,
            minWidth: 250,
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
            },
          }}
          InputProps={{
            startAdornment: <FilterList sx={{ color: '#888', mr: 1 }} />,
          }}
        />
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel sx={{ color: '#888' }}>Estado</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
              '& .MuiSvgIcon-root': {
                color: '#fff',
              },
            }}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="Completado">Completado</MenuItem>
            <MenuItem value="Pendiente">Pendiente</MenuItem>
            <MenuItem value="En Progreso">En Progreso</MenuItem>
          </Select>
        </FormControl>
        
        <Button
          variant="contained"
          onClick={handleFilter}
          sx={{
            background: 'linear-gradient(45deg, #00ff88 0%, #00cc70 100%)',
            color: '#000',
            fontWeight: 600,
            '&:hover': {
              background: 'linear-gradient(45deg, #00ffaa 0%, #00ff88 100%)',
            }
          }}
        >
          Filtrar
        </Button>
        
        <Button
          variant="outlined"
          onClick={() => {
            setFilter('');
            setStatusFilter('all');
            setFilteredData(preventiveMaintenance);
          }}
          sx={{
            borderColor: 'rgba(0, 255, 136, 0.5)',
            color: '#00ff88',
            '&:hover': {
              borderColor: '#00ff88',
              background: 'rgba(0, 255, 136, 0.1)',
            }
          }}
        >
          <Refresh sx={{ mr: 1 }} />
          Limpiar
        </Button>
        
        <Button
          variant="contained"
          onClick={handleExport}
          sx={{
            background: 'linear-gradient(45deg, #2196f3 0%, #1976d2 100%)',
            color: '#fff',
            fontWeight: 600,
            '&:hover': {
              background: 'linear-gradient(45deg, #42a5f5 0%, #2196f3 100%)',
            }
          }}
        >
          <Download sx={{ mr: 1 }} />
          Exportar
        </Button>
      </Box>

      {/* Data Table */}
      <Card sx={{ 
        background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(42, 42, 42, 0.9) 100%)',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        borderRadius: 2,
        backdropFilter: 'blur(10px)'
      }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#00ff88', fontWeight: 600, mb: 3 }}>
            📋 Detalle de Mantenimiento Preventivo
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Vehículo</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Placa</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Tipo</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Fecha Programada</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Fecha Completada</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Estado</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Prioridad</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Costo</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Técnico</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Progreso</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id} sx={{ '&:hover': { background: 'rgba(0, 255, 136, 0.05)' } }}>
                    <TableCell sx={{ color: '#fff' }}>{item.vehicle}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{item.plate}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{item.type}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{item.scheduledDate}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{item.completedDate || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(item.status) + '20',
                          color: getStatusColor(item.status),
                          border: `1px solid ${getStatusColor(item.status)}`,
                          fontWeight: 600
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.priority}
                        size="small"
                        sx={{
                          backgroundColor: getPriorityColor(item.priority) + '20',
                          color: getPriorityColor(item.priority),
                          border: `1px solid ${getPriorityColor(item.priority)}`,
                          fontWeight: 600
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#fff' }}>${item.cost.toLocaleString()}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{item.technician}</TableCell>
                    <TableCell sx={{ width: 150 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={item.completionRate}
                          sx={{
                            flex: 1,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: item.completionRate === 100 ? '#00ff88' : 
                                              item.completionRate > 0 ? '#2196f3' : '#ff9800',
                              borderRadius: 4,
                            },
                          }}
                        />
                        <Typography variant="caption" sx={{ color: '#fff', minWidth: 35 }}>
                          {item.completionRate}%
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PreventiveReport;
