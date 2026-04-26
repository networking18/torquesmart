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
  BuildCircle,
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
  Error,
  CheckCircle,
  Pending,
  Schedule
} from '@mui/icons-material';

const CorrectiveReport: React.FC = () => {
  const [correctiveMaintenance, setCorrectiveMaintenance] = useState(() => {
    const savedRecords = JSON.parse(localStorage.getItem('torquesmart_corrective_maintenance') || '[]');
    return savedRecords.map((record, index) => ({
      id: record.id || index + 1,
      vehicle: record.vehicleName || 'Vehículo no especificado',
      plate: record.vehiclePlate || 'N/A',
      failureDate: record.failureDate || new Date().toISOString().split('T')[0],
      reportedIssue: record.reportedIssue || 'Problema no especificado',
      diagnosis: record.diagnosis || 'Diagnóstico pendiente',
      repairDate: record.repairDate || null,
      status: record.status || 'Pendiente',
      cost: record.cost || 0,
      technician: record.technician || 'No asignado',
      downtime: record.downtime || 0,
      partsReplaced: record.partsReplaced || 'No especificado',
      severity: record.severity || 'Media',
      repairTime: record.repairTime || 0,
      notes: record.notes || '',
      photos: record.photos || []
    }));
  });

  const [filteredData, setFilteredData] = useState(correctiveMaintenance);

  // Update filtered data when correctiveMaintenance changes
  useEffect(() => {
    setFilteredData(correctiveMaintenance);
  }, [correctiveMaintenance]);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [chartData, setChartData] = useState({
    totalRepairs: 0,
    completedRepairs: 0,
    pendingRepairs: 0,
    totalCost: 0,
    averageCost: 0,
    totalDowntime: 0,
    averageDowntime: 0,
    monthlyData: []
  });

  useEffect(() => {
    calculateStatistics();
  }, [filteredData]);

  const calculateStatistics = () => {
    const totalRepairs = filteredData.length;
    const completedRepairs = filteredData.filter(item => item.status === 'Completado').length;
    const pendingRepairs = filteredData.filter(item => item.status !== 'Completado').length;
    const totalCost = filteredData.reduce((sum, item) => sum + item.cost, 0);
    const averageCost = completedRepairs > 0 ? totalCost / completedRepairs : 0;
    const totalDowntime = filteredData.reduce((sum, item) => sum + item.downtime, 0);
    const averageDowntime = completedRepairs > 0 ? totalDowntime / completedRepairs : 0;
    
    // Simulate monthly data
    const monthlyData = [
      { month: 'Ene', repairs: 8, cost: 45000, downtime: 12, severity: { alta: 3, media: 3, baja: 2 } },
      { month: 'Feb', repairs: 12, cost: 72000, downtime: 18, severity: { alta: 5, media: 5, baja: 2 } },
      { month: 'Mar', repairs: 10, cost: 58000, downtime: 15, severity: { alta: 4, media: 4, baja: 2 } },
      { month: 'Abr', repairs: 14, cost: 85000, downtime: 22, severity: { alta: 6, media: 5, baja: 3 } },
      { month: 'May', repairs: 11, cost: 68000, downtime: 16, severity: { alta: 4, media: 5, baja: 2 } },
      { month: 'Jun', repairs: 9, cost: 52000, downtime: 14, severity: { alta: 3, media: 4, baja: 2 } }
    ];

    setChartData({
      totalRepairs,
      completedRepairs,
      pendingRepairs,
      totalCost,
      averageCost,
      totalDowntime,
      averageDowntime,
      monthlyData
    });
  };

  const handleFilter = () => {
    let filtered = correctiveMaintenance;
    
    if (filter) {
      filtered = filtered.filter(item => 
        item.vehicle.toLowerCase().includes(filter.toLowerCase()) ||
        item.plate.toLowerCase().includes(filter.toLowerCase()) ||
        item.technician.toLowerCase().includes(filter.toLowerCase()) ||
        item.reportedIssue.toLowerCase().includes(filter.toLowerCase()) ||
        item.diagnosis.toLowerCase().includes(filter.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    if (severityFilter !== 'all') {
      filtered = filtered.filter(item => item.severity === severityFilter);
    }
    
    setFilteredData(filtered);
  };

  const handleExport = () => {
    const csvContent = [
      ['Vehículo', 'Placa', 'Fecha Falla', 'Problema Reportado', 'Diagnóstico', 'Fecha Reparación', 'Estado', 'Severidad', 'Costo', 'Técnico', 'Tiempo Inactivo', 'Repuestos', 'Tiempo de Reparación'],
      ...filteredData.map(item => [
        item.vehicle,
        item.plate,
        item.failureDate,
        item.reportedIssue,
        item.diagnosis,
        item.repairDate || 'N/A',
        item.status,
        item.severity,
        item.cost,
        item.technician,
        `${item.downtime} días`,
        item.partsReplaced,
        `${item.repairTime} horas`
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reporte_mantenimiento_correctivo.csv';
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Alta': return '#f44336';
      case 'Media': return '#ff9800';
      case 'Baja': return '#4caf50';
      default: return '#888';
    }
  };

  const renderCostChart = () => {
    const maxValue = Math.max(...chartData.monthlyData.map(item => item.cost));
    
    return (
      <Box sx={{ height: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', p: 2 }}>
        {chartData.monthlyData.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <Typography variant="caption" sx={{ color: '#888', mb: 1 }}>
              ${item.cost.toLocaleString()}
            </Typography>
            <Box
              sx={{
                width: '40px',
                height: `${(item.cost / maxValue) * 200}px`,
                background: 'linear-gradient(180deg, #f44336 0%, #d32f2f 100%)',
                borderRadius: '4px 4px 0 0',
                mb: 1,
                position: 'relative',
                '&:hover': {
                  background: 'linear-gradient(180deg, #ff6659 0%, #f44336 100%)',
                  transform: 'scaleY(1.05)',
                  transition: 'all 0.3s ease'
                }
              }}
            />
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
              {item.month}
            </Typography>
            <Typography variant="caption" sx={{ color: '#888' }}>
              {item.repairs} reparaciones
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  const renderDowntimeChart = () => {
    const maxValue = Math.max(...chartData.monthlyData.map(item => item.downtime));
    
    return (
      <Box sx={{ height: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', p: 2 }}>
        {chartData.monthlyData.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <Typography variant="caption" sx={{ color: '#888', mb: 1 }}>
              {item.downtime} días
            </Typography>
            <Box
              sx={{
                width: '30px',
                height: `${(item.downtime / maxValue) * 120}px`,
                background: 'linear-gradient(180deg, #ff9800 0%, #f57c00 100%)',
                borderRadius: '4px 4px 0 0',
                mb: 1,
                '&:hover': {
                  background: 'linear-gradient(180deg, #ffb74d 0%, #ff9800 100%)',
                  transform: 'scaleY(1.05)',
                  transition: 'all 0.3s ease'
                }
              }}
            />
            <Typography variant="caption" sx={{ color: '#fff' }}>
              {item.month}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3, background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ color: '#00ff88', fontWeight: 700, mb: 4 }}>
        📊 Reporte de Mantenimiento Correctivo
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)',
            border: '1px solid rgba(244, 67, 54, 0.3)',
            borderRadius: 2,
            backdropFilter: 'blur(10px)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BuildCircle sx={{ color: '#f44336', fontSize: 32, mr: 2 }} />
                <Typography variant="h6" sx={{ color: '#f44336', fontWeight: 600 }}>
                  Total Reparaciones
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
                {chartData.totalRepairs}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', mt: 1 }}>
                Registradas
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
                  Completadas
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
                {chartData.completedRepairs}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', mt: 1 }}>
                Realizadas
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
                <AttachMoney sx={{ color: '#ff9800', fontSize: 32, mr: 2 }} />
                <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 600 }}>
                  Costo Total
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
                ${chartData.totalCost.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', mt: 1 }}>
                Acumulado
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
                <Schedule sx={{ color: '#2196f3', fontSize: 32, mr: 2 }} />
                <Typography variant="h6" sx={{ color: '#2196f3', fontWeight: 600 }}>
                  Tiempo Inactivo
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
                {chartData.totalDowntime} días
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', mt: 1 }}>
                Total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(42, 42, 42, 0.9) 100%)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            borderRadius: 2,
            backdropFilter: 'blur(10px)'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#00ff88', fontWeight: 600, mb: 3 }}>
                💰 Costo Mensual de Reparaciones
              </Typography>
              {renderCostChart()}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(42, 42, 42, 0.9) 100%)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            borderRadius: 2,
            backdropFilter: 'blur(10px)'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#00ff88', fontWeight: 600, mb: 3 }}>
                ⏱️ Tiempo Inactivo Mensual
              </Typography>
              {renderDowntimeChart()}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Actions */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Buscar por vehículo, placa, técnico, problema o diagnóstico..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{
            flex: 1,
            minWidth: 300,
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
        
        <FormControl sx={{ minWidth: 120 }}>
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

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel sx={{ color: '#888' }}>Severidad</InputLabel>
          <Select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
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
            <MenuItem value="all">Todas</MenuItem>
            <MenuItem value="Alta">Alta</MenuItem>
            <MenuItem value="Media">Media</MenuItem>
            <MenuItem value="Baja">Baja</MenuItem>
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
            setSeverityFilter('all');
            setFilteredData(correctiveMaintenance);
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
            📋 Detalle de Mantenimiento Correctivo
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Vehículo</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Placa</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Problema Reportado</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Diagnóstico</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Fecha Falla</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Estado</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Severidad</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Costo</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Tiempo Inactivo</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Técnico</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id} sx={{ '&:hover': { background: 'rgba(0, 255, 136, 0.05)' } }}>
                    <TableCell sx={{ color: '#fff' }}>{item.vehicle}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{item.plate}</TableCell>
                    <TableCell sx={{ color: '#fff', maxWidth: 200 }}>
                      <Tooltip title={item.reportedIssue}>
                        <Typography variant="body2" sx={{ 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }}>
                          {item.reportedIssue}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ color: '#fff', maxWidth: 200 }}>
                      <Tooltip title={item.diagnosis}>
                        <Typography variant="body2" sx={{ 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }}>
                          {item.diagnosis}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ color: '#fff' }}>{item.failureDate}</TableCell>
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
                        label={item.severity}
                        size="small"
                        sx={{
                          backgroundColor: getSeverityColor(item.severity) + '20',
                          color: getSeverityColor(item.severity),
                          border: `1px solid ${getSeverityColor(item.severity)}`,
                          fontWeight: 600
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#fff' }}>${item.cost.toLocaleString()}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{item.downtime} días</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{item.technician}</TableCell>
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

export default CorrectiveReport;
