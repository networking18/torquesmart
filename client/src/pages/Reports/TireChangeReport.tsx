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
  TireRepair,
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
  RotateRight
} from '@mui/icons-material';

const TireChangeReport: React.FC = () => {
  const [tireChanges, setTireChanges] = useState(() => {
    const savedRecords = JSON.parse(localStorage.getItem('torquesmart_tire_changes') || '[]');
    return savedRecords.map((record, index) => ({
      id: record.id || index + 1,
      vehicle: record.vehicleName || 'Vehículo no especificado',
      plate: record.vehiclePlate || 'N/A',
      changeDate: record.changeDate || new Date().toISOString().split('T')[0],
      tireType: record.tireType || 'No especificado',
      brand: record.tireBrand || 'No especificado',
      model: record.tireModel || 'No especificado',
      quantity: record.quantity || 0,
      status: record.status || 'Pendiente',
      cost: record.cost || 0,
      technician: record.technician || 'No asignado',
      nextChange: record.nextChangeDate || '',
      treadDepth: record.treadDepth || 0,
      oldTreadDepth: record.oldTreadDepth || 0,
      reason: record.reason || 'No especificado',
      kilometers: record.kilometers || 0,
      notes: record.notes || '',
      photos: record.photos || []
    }));
  });

  const [filteredData, setFilteredData] = useState(tireChanges);

  // Update filtered data when tireChanges changes
  useEffect(() => {
    setFilteredData(tireChanges);
  }, [tireChanges]);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tireTypeFilter, setTireTypeFilter] = useState('all');
  const [chartData, setChartData] = useState({
    totalChanges: 0,
    completedChanges: 0,
    pendingChanges: 0,
    totalCost: 0,
    averageCost: 0,
    totalTires: 0,
    averageTreadDepth: 0,
    monthlyData: []
  });

  useEffect(() => {
    calculateStatistics();
  }, [filteredData]);

  const calculateStatistics = () => {
    const totalChanges = filteredData.length;
    const completedChanges = filteredData.filter(item => item.status === 'Completado').length;
    const pendingChanges = filteredData.filter(item => item.status !== 'Completado').length;
    const totalCost = filteredData.reduce((sum, item) => sum + item.cost, 0);
    const averageCost = completedChanges > 0 ? totalCost / completedChanges : 0;
    const totalTires = filteredData.reduce((sum, item) => sum + item.quantity, 0);
    const completedWithTreadData = filteredData.filter(item => item.treadDepth > 0);
    const averageTreadDepth = completedWithTreadData.length > 0 
      ? completedWithTreadData.reduce((sum, item) => sum + item.treadDepth, 0) / completedWithTreadData.length 
      : 0;
    
    // Simulate monthly data
    const monthlyData = [
      { month: 'Ene', changes: 8, cost: 28000, tires: 24, avgTreadDepth: 13.2 },
      { month: 'Feb', changes: 12, cost: 42000, tires: 36, avgTreadDepth: 13.5 },
      { month: 'Mar', changes: 10, cost: 35000, tires: 30, avgTreadDepth: 12.8 },
      { month: 'Abr', changes: 15, cost: 52500, tires: 45, avgTreadDepth: 13.7 },
      { month: 'May', changes: 11, cost: 38500, tires: 33, avgTreadDepth: 13.1 },
      { month: 'Jun', changes: 9, cost: 31500, tires: 27, avgTreadDepth: 13.4 }
    ];

    setChartData({
      totalChanges,
      completedChanges,
      pendingChanges,
      totalCost,
      averageCost,
      totalTires,
      averageTreadDepth,
      monthlyData
    });
  };

  const handleFilter = () => {
    let filtered = tireChanges;
    
    if (filter) {
      filtered = filtered.filter(item => 
        item.vehicle.toLowerCase().includes(filter.toLowerCase()) ||
        item.plate.toLowerCase().includes(filter.toLowerCase()) ||
        item.technician.toLowerCase().includes(filter.toLowerCase()) ||
        item.brand.toLowerCase().includes(filter.toLowerCase()) ||
        item.reason.toLowerCase().includes(filter.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    if (tireTypeFilter !== 'all') {
      filtered = filtered.filter(item => item.tireType === tireTypeFilter);
    }
    
    setFilteredData(filtered);
  };

  const handleExport = () => {
    const csvContent = [
      ['Vehículo', 'Placa', 'Fecha Cambio', 'Tipo de Llanta', 'Marca', 'Modelo', 'Cantidad', 'Estado', 'Costo', 'Técnico', 'Próximo Cambio', 'Profundidad Actual (mm)', 'Profundidad Anterior (mm)', 'Motivo', 'Kilómetros'],
      ...filteredData.map(item => [
        item.vehicle,
        item.plate,
        item.changeDate,
        item.tireType,
        item.brand,
        item.model,
        item.quantity,
        item.status,
        item.cost,
        item.technician,
        item.nextService,
        item.treadDepth,
        item.oldTreadDepth,
        item.reason,
        item.kilometers
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reporte_cambios_llantas.csv';
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

  const getTireTypeColor = (tireType: string) => {
    switch (tireType) {
      case 'Delanteras': return '#4caf50';
      case 'Traseras': return '#ff9800';
      case 'Completas': return '#2196f3';
      case 'Repuesto': return '#9c27b0';
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
                background: 'linear-gradient(180deg, #795548 0%, #5d4037 100%)',
                borderRadius: '4px 4px 0 0',
                mb: 1,
                position: 'relative',
                '&:hover': {
                  background: 'linear-gradient(180deg, #8d6e63 0%, #795548 100%)',
                  transform: 'scaleY(1.05)',
                  transition: 'all 0.3s ease'
                }
              }}
            />
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
              {item.month}
            </Typography>
            <Typography variant="caption" sx={{ color: '#888' }}>
              {item.changes} cambios
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  const renderTreadDepthChart = () => {
    const maxValue = Math.max(...chartData.monthlyData.map(item => item.avgTreadDepth));
    
    return (
      <Box sx={{ height: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', p: 2 }}>
        {chartData.monthlyData.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <Typography variant="caption" sx={{ color: '#888', mb: 1 }}>
              {item.avgTreadDepth.toFixed(1)}mm
            </Typography>
            <Box
              sx={{
                width: '30px',
                height: `${(item.avgTreadDepth / maxValue) * 120}px`,
                background: 'linear-gradient(180deg, #ff5722 0%, #e64a19 100%)',
                borderRadius: '4px 4px 0 0',
                mb: 1,
                '&:hover': {
                  background: 'linear-gradient(180deg, #ff7043 0%, #ff5722 100%)',
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
        📊 Reporte de Cambios de Llantas
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, rgba(121, 85, 72, 0.1) 0%, rgba(121, 85, 72, 0.05) 100%)',
            border: '1px solid rgba(121, 85, 72, 0.3)',
            borderRadius: 2,
            backdropFilter: 'blur(10px)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TireRepair sx={{ color: '#795548', fontSize: 32, mr: 2 }} />
                <Typography variant="h6" sx={{ color: '#795548', fontWeight: 600 }}>
                  Total Cambios
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
                {chartData.totalChanges}
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
                {chartData.completedChanges}
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
            background: 'linear-gradient(135deg, rgba(255, 87, 34, 0.1) 0%, rgba(255, 87, 34, 0.05) 100%)',
            border: '1px solid rgba(255, 87, 34, 0.3)',
            borderRadius: 2,
            backdropFilter: 'blur(10px)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RotateRight sx={{ color: '#ff5722', fontSize: 32, mr: 2 }} />
                <Typography variant="h6" sx={{ color: '#ff5722', fontWeight: 600 }}>
                  Total Llantas
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
                {chartData.totalTires}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', mt: 1 }}>
                Cambiadas
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
                💰 Costo Mensual de Cambios de Llantas
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
                📏 Profundidad de Rodadura Mensual
              </Typography>
              {renderTreadDepthChart()}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Actions */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Buscar por vehículo, placa, técnico, marca o motivo..."
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
          <InputLabel sx={{ color: '#888' }}>Tipo de Llanta</InputLabel>
          <Select
            value={tireTypeFilter}
            onChange={(e) => setTireTypeFilter(e.target.value)}
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
            <MenuItem value="Delanteras">Delanteras</MenuItem>
            <MenuItem value="Traseras">Traseras</MenuItem>
            <MenuItem value="Completas">Completas</MenuItem>
            <MenuItem value="Repuesto">Repuesto</MenuItem>
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
            setTireTypeFilter('all');
            setFilteredData(tireChanges);
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
            📋 Detalle de Cambios de Llantas
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Vehículo</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Placa</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Tipo</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Marca/Modelo</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Cantidad</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Fecha</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Estado</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Costo</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Profundidad</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Motivo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id} sx={{ '&:hover': { background: 'rgba(0, 255, 136, 0.05)' } }}>
                    <TableCell sx={{ color: '#fff' }}>{item.vehicle}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{item.plate}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.tireType}
                        size="small"
                        sx={{
                          backgroundColor: getTireTypeColor(item.tireType) + '20',
                          color: getTireTypeColor(item.tireType),
                          border: `1px solid ${getTireTypeColor(item.tireType)}`,
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#fff' }}>
                      {item.brand} {item.model}
                    </TableCell>
                    <TableCell sx={{ color: '#fff' }}>{item.quantity}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{item.changeDate}</TableCell>
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
                    <TableCell sx={{ color: '#fff' }}>
                      {item.treadDepth > 0 ? `${item.treadDepth}mm` : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ color: '#fff', maxWidth: 150 }}>
                      <Tooltip title={item.reason}>
                        <Typography variant="body2" sx={{ 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }}>
                          {item.reason}
                        </Typography>
                      </Tooltip>
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

export default TireChangeReport;
