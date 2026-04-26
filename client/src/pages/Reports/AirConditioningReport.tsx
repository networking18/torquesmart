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
  AcUnit,
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
  Error,
  Thermostat
} from '@mui/icons-material';

const AirConditioningReport: React.FC = () => {
  const [acMaintenance, setAcMaintenance] = useState(() => {
    const savedRecords = JSON.parse(localStorage.getItem('torquesmart_air_conditioning') || '[]');
    return savedRecords.map((record, index) => ({
      id: record.id || index + 1,
      vehicle: record.vehicleName || 'Vehículo no especificado',
      plate: record.vehiclePlate || 'N/A',
      serviceDate: record.serviceDate || new Date().toISOString().split('T')[0],
      serviceType: record.serviceType || 'Mantenimiento AC',
      refrigerantType: record.refrigerantType || 'R-134a',
      refrigerantAmount: record.refrigerantAmount || 0,
      status: record.status || 'Pendiente',
      cost: record.cost || 0,
      technician: record.technician || 'No asignado',
      nextService: record.nextServiceDate || '',
      issuesFound: record.issuesFound || 'No especificado',
      compressorHours: record.compressorHours || 0,
      temperatureBefore: record.temperatureBefore || 0,
      temperatureAfter: record.temperatureAfter || 0,
      notes: record.notes || '',
      photos: record.photos || []
    }));
  });

  const [filteredData, setFilteredData] = useState(acMaintenance);

  // Update filtered data when acMaintenance changes
  useEffect(() => {
    setFilteredData(acMaintenance);
  }, [acMaintenance]);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
  const [chartData, setChartData] = useState({
    totalServices: 0,
    completedServices: 0,
    pendingServices: 0,
    totalCost: 0,
    averageCost: 0,
    totalRefrigerant: 0,
    averageTemperatureDrop: 0,
    monthlyData: []
  });

  useEffect(() => {
    calculateStatistics();
  }, [filteredData]);

  const calculateStatistics = () => {
    const totalServices = filteredData.length;
    const completedServices = filteredData.filter(item => item.status === 'Completado').length;
    const pendingServices = filteredData.filter(item => item.status !== 'Completado').length;
    const totalCost = filteredData.reduce((sum, item) => sum + item.cost, 0);
    const averageCost = completedServices > 0 ? totalCost / completedServices : 0;
    const totalRefrigerant = filteredData.reduce((sum, item) => sum + item.refrigerantAmount, 0);
    const completedWithTempData = filteredData.filter(item => item.temperatureBefore > 0 && item.temperatureAfter > 0);
    const averageTemperatureDrop = completedWithTempData.length > 0 
      ? completedWithTempData.reduce((sum, item) => sum + (item.temperatureBefore - item.temperatureAfter), 0) / completedWithTempData.length 
      : 0;
    
    // Simulate monthly data
    const monthlyData = [
      { month: 'Ene', services: 12, cost: 28000, refrigerant: 28.5, avgTempDrop: 17 },
      { month: 'Feb', services: 15, cost: 35000, refrigerant: 35.2, avgTempDrop: 18 },
      { month: 'Mar', services: 18, cost: 42000, refrigerant: 42.8, avgTempDrop: 16 },
      { month: 'Abr', services: 14, cost: 32000, refrigerant: 31.5, avgTempDrop: 19 },
      { month: 'May', services: 20, cost: 48000, refrigerant: 48.3, avgTempDrop: 17 },
      { month: 'Jun', services: 16, cost: 38000, refrigerant: 38.7, avgTempDrop: 18 }
    ];

    setChartData({
      totalServices,
      completedServices,
      pendingServices,
      totalCost,
      averageCost,
      totalRefrigerant,
      averageTemperatureDrop,
      monthlyData
    });
  };

  const handleFilter = () => {
    let filtered = acMaintenance;
    
    if (filter) {
      filtered = filtered.filter(item => 
        item.vehicle.toLowerCase().includes(filter.toLowerCase()) ||
        item.plate.toLowerCase().includes(filter.toLowerCase()) ||
        item.technician.toLowerCase().includes(filter.toLowerCase()) ||
        item.serviceType.toLowerCase().includes(filter.toLowerCase()) ||
        item.issuesFound.toLowerCase().includes(filter.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    if (serviceTypeFilter !== 'all') {
      filtered = filtered.filter(item => item.serviceType === serviceTypeFilter);
    }
    
    setFilteredData(filtered);
  };

  const handleExport = () => {
    const csvContent = [
      ['Vehículo', 'Placa', 'Fecha Servicio', 'Tipo de Servicio', 'Tipo de Refrigerante', 'Cantidad (kg)', 'Estado', 'Costo', 'Técnico', 'Próximo Servicio', 'Problemas Encontrados', 'Horas Compresor', 'Temp Antes (°C)', 'Temp Después (°C)'],
      ...filteredData.map(item => [
        item.vehicle,
        item.plate,
        item.serviceDate,
        item.serviceType,
        item.refrigerantType,
        item.refrigerantAmount,
        item.status,
        item.cost,
        item.technician,
        item.nextService,
        item.issuesFound,
        item.compressorHours,
        item.temperatureBefore,
        item.temperatureAfter
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reporte_aire_acondicionado.csv';
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

  const getServiceTypeColor = (serviceType: string) => {
    switch (serviceType) {
      case 'Recarga de Gas': return '#4caf50';
      case 'Reparación de Fuga': return '#f44336';
      case 'Mantenimiento Preventivo': return '#2196f3';
      case 'Cambio de Compresor': return '#ff9800';
      case 'Limpieza de Sistema': return '#9c27b0';
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
                background: 'linear-gradient(180deg, #00bcd4 0%, #0097a7 100%)',
                borderRadius: '4px 4px 0 0',
                mb: 1,
                position: 'relative',
                '&:hover': {
                  background: 'linear-gradient(180deg, #4dd0e1 0%, #00bcd4 100%)',
                  transform: 'scaleY(1.05)',
                  transition: 'all 0.3s ease'
                }
              }}
            />
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
              {item.month}
            </Typography>
            <Typography variant="caption" sx={{ color: '#888' }}>
              {item.services} servicios
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  const renderTemperatureChart = () => {
    const maxValue = Math.max(...chartData.monthlyData.map(item => item.avgTempDrop));
    
    return (
      <Box sx={{ height: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', p: 2 }}>
        {chartData.monthlyData.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <Typography variant="caption" sx={{ color: '#888', mb: 1 }}>
              {item.avgTempDrop}°C
            </Typography>
            <Box
              sx={{
                width: '30px',
                height: `${(item.avgTempDrop / maxValue) * 120}px`,
                background: 'linear-gradient(180deg, #03a9f4 0%, #0288d1 100%)',
                borderRadius: '4px 4px 0 0',
                mb: 1,
                '&:hover': {
                  background: 'linear-gradient(180deg, #29b6f6 0%, #03a9f4 100%)',
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
        📊 Reporte de Aire Acondicionado
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, rgba(0, 188, 212, 0.1) 0%, rgba(0, 188, 212, 0.05) 100%)',
            border: '1px solid rgba(0, 188, 212, 0.3)',
            borderRadius: 2,
            backdropFilter: 'blur(10px)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AcUnit sx={{ color: '#00bcd4', fontSize: 32, mr: 2 }} />
                <Typography variant="h6" sx={{ color: '#00bcd4', fontWeight: 600 }}>
                  Total Servicios
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
                {chartData.totalServices}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', mt: 1 }}>
                Realizados
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
                {chartData.completedServices}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', mt: 1 }}>
                Finalizados
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
            background: 'linear-gradient(135deg, rgba(3, 169, 244, 0.1) 0%, rgba(3, 169, 244, 0.05) 100%)',
            border: '1px solid rgba(3, 169, 244, 0.3)',
            borderRadius: 2,
            backdropFilter: 'blur(10px)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Thermostat sx={{ color: '#03a9f4', fontSize: 32, mr: 2 }} />
                <Typography variant="h6" sx={{ color: '#03a9f4', fontWeight: 600 }}>
                  Reducción Promedio
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
                {chartData.averageTemperatureDrop.toFixed(1)}°C
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', mt: 1 }}>
                De temperatura
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
                💰 Costo Mensual de Servicios AC
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
                🌡️ Reducción de Temperatura Mensual
              </Typography>
              {renderTemperatureChart()}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Actions */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Buscar por vehículo, placa, técnico, tipo de servicio..."
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

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel sx={{ color: '#888' }}>Tipo de Servicio</InputLabel>
          <Select
            value={serviceTypeFilter}
            onChange={(e) => setServiceTypeFilter(e.target.value)}
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
            <MenuItem value="Recarga de Gas">Recarga de Gas</MenuItem>
            <MenuItem value="Reparación de Fuga">Reparación de Fuga</MenuItem>
            <MenuItem value="Mantenimiento Preventivo">Mantenimiento Preventivo</MenuItem>
            <MenuItem value="Cambio de Compresor">Cambio de Compresor</MenuItem>
            <MenuItem value="Limpieza de Sistema">Limpieza de Sistema</MenuItem>
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
            setServiceTypeFilter('all');
            setFilteredData(acMaintenance);
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
            📋 Detalle de Servicios de Aire Acondicionado
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Vehículo</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Placa</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Tipo de Servicio</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Fecha</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Refrigerante</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Estado</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Costo</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Técnico</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Temp. Antes</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Temp. Después</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id} sx={{ '&:hover': { background: 'rgba(0, 255, 136, 0.05)' } }}>
                    <TableCell sx={{ color: '#fff' }}>{item.vehicle}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{item.plate}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.serviceType}
                        size="small"
                        sx={{
                          backgroundColor: getServiceTypeColor(item.serviceType) + '20',
                          color: getServiceTypeColor(item.serviceType),
                          border: `1px solid ${getServiceTypeColor(item.serviceType)}`,
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#fff' }}>{item.serviceDate}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>
                      {item.refrigerantType} ({item.refrigerantAmount} kg)
                    </TableCell>
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
                    <TableCell sx={{ color: '#fff' }}>${item.cost.toLocaleString()}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{item.technician}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>
                      {item.temperatureBefore > 0 ? `${item.temperatureBefore}°C` : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ color: '#fff' }}>
                      {item.temperatureAfter > 0 ? `${item.temperatureAfter}°C` : 'N/A'}
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

export default AirConditioningReport;
