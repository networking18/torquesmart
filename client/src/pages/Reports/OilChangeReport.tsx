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
  ImageList,
  ImageListItem,
  ImageListItemBar
} from '@mui/material';
import {
  Build,
  TrendingUp,
  TrendingDown,
  LocalGasStation,
  AttachMoney,
  CalendarToday,
  FilterList,
  Download,
  Refresh,
  Assessment,
  Speed,
  Warning,
  Image,
  ZoomIn,
  Visibility
} from '@mui/icons-material';

const OilChangeReport: React.FC = () => {
  const [oilChanges, setOilChanges] = useState(() => {
    const savedRecords = JSON.parse(localStorage.getItem('torquesmart_oil_changes') || '[]');
    return savedRecords.map((record, index) => ({
      id: record.id || index + 1,
      vehicle: record.vehicleName || record.vehicleBrand + ' ' + record.vehicleModel || 'Vehículo no especificado',
      plate: record.vehiclePlate || 'N/A',
      date: record.date || new Date().toISOString().split('T')[0],
      kilometers: parseInt(record.mileage) || 0,
      oilType: record.oilType || 'No especificado',
      cost: parseFloat(record.cost) || 0,
      technician: record.technician || 'No asignado',
      status: record.status || 'Completado',
      nextChange: parseInt(record.nextKilometers) || (parseInt(record.mileage) + 10000),
      notes: record.notes || '',
      photos: record.images || record.photos || []
    }));
  });

  const [filteredData, setFilteredData] = useState(oilChanges);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  // Update filtered data when oilChanges changes
  useEffect(() => {
    setFilteredData(oilChanges);
  }, [oilChanges]);

  const handleViewImages = (images: string[]) => {
    setSelectedImages(images);
    setImageDialogOpen(true);
  };

  const handleViewDetail = (record: any) => {
    setSelectedRecord(record);
    setDetailDialogOpen(true);
  };

  const [filter, setFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [chartData, setChartData] = useState({
    totalChanges: 0,
    totalCost: 0,
    averageCost: 0,
    monthlyTrend: []
  });

  useEffect(() => {
    const filtered = oilChanges.filter(item => {
      const matchesFilter = !filter || 
        item.vehicle.toLowerCase().includes(filter.toLowerCase()) ||
        item.plate.toLowerCase().includes(filter.toLowerCase()) ||
        item.technician.toLowerCase().includes(filter.toLowerCase());
      
      return matchesFilter;
    });

    setFilteredData(filtered);

    // Calculate statistics
    const totalChanges = filtered.length;
    const totalCost = filtered.reduce((sum, item) => sum + item.cost, 0);
    const averageCost = totalChanges > 0 ? totalCost / totalChanges : 0;

    setChartData({
      totalChanges,
      totalCost,
      averageCost,
      monthlyTrend: calculateMonthlyTrend(filtered)
    });
  }, [oilChanges, filter, dateRange]);

  const calculateMonthlyTrend = (data: any[]) => {
    const monthlyData: { [key: string]: number } = {};
    
    data.forEach(item => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, changes]) => ({
        month,
        changes,
        cost: data
          .filter(item => item.date.startsWith(month))
          .reduce((sum, item) => sum + item.cost, 0)
      }));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completado':
        return '#4caf50';
      case 'pendiente':
        return '#ff9800';
      case 'cancelado':
        return '#f44336';
      default:
        return '#2196f3';
    }
  };

  const renderChart = () => {
    const data = chartData.monthlyTrend;
    
    if (data.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography sx={{ color: '#888' }}>No hay datos disponibles para mostrar</Typography>
        </Box>
      );
    }

    // Encontrar el valor máximo para la escala
    const maxChanges = Math.max(...data.map(item => item.changes));
    const scaleHeight = 200; // Altura máxima de la escala

    return (
      <Box sx={{ py: 2 }}>
        {/* Escala Y */}
        <Box sx={{ display: 'flex', alignItems: 'flex-end', height: scaleHeight + 40, mb: 2 }}>
          <Box sx={{ width: 60, pr: 2, textAlign: 'right' }}>
            {[maxChanges, Math.round(maxChanges * 0.75), Math.round(maxChanges * 0.5), Math.round(maxChanges * 0.25), 0].map((value, index) => (
              <Typography key={index} variant="caption" sx={{ 
                color: '#888', 
                fontSize: '0.75rem',
                position: 'absolute',
                bottom: (value / maxChanges) * scaleHeight,
                transform: 'translateY(-50%)'
              }}>
                {value}
              </Typography>
            ))}
          </Box>
          
          {/* Líneas de la escala */}
          <Box sx={{ flex: 1, position: 'relative', height: scaleHeight }}>
            {[maxChanges, Math.round(maxChanges * 0.75), Math.round(maxChanges * 0.5), Math.round(maxChanges * 0.25), 0].map((value, index) => (
              <Box
                key={index}
                sx={{
                  position: 'absolute',
                  bottom: (value / maxChanges) * scaleHeight,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'rgba(0, 255, 136, 0.1)',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    left: -10,
                    right: 0,
                    height: '1px',
                    background: 'rgba(0, 255, 136, 0.2)'
                  }
                }}
              />
            ))}
            
            {/* Barras del gráfico */}
            <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%', gap: 1, px: 1 }}>
              {data.map((item, index) => {
                const barHeight = (item.changes / maxChanges) * scaleHeight;
                return (
                  <Box key={item.month} sx={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    height: '100%'
                  }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: barHeight,
                        background: 'linear-gradient(180deg, #00ff88 0%, #00cc6a 100%)',
                        borderRadius: '4px 4px 0 0',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(180deg, #00ffaa 0%, #00ff88 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)'
                        },
                        '&::after': {
                          content: `"${item.changes}"`,
                          position: 'absolute',
                          top: -20,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          color: '#00ff88',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        },
                        '&:hover::after': {
                          opacity: 1
                        }
                      }}
                    />
                    <Typography variant="caption" sx={{ 
                      color: '#fff', 
                      fontSize: '0.7rem',
                      mt: 1,
                      textAlign: 'center',
                      transform: 'rotate(-45deg)',
                      transformOrigin: 'top left',
                      whiteSpace: 'nowrap'
                    }}>
                      {item.month}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
        
        {/* Etiqueta del eje Y */}
        <Typography variant="caption" sx={{ 
          color: '#888', 
          fontSize: '0.75rem',
          textAlign: 'center',
          display: 'block',
          mt: 1
        }}>
          Número de Cambios de Aceite
        </Typography>
      </Box>
    );
  };

  const exportToCSV = () => {
    const headers = ['Vehículo', 'Placa', 'Fecha', 'Kilómetros', 'Tipo de Aceite', 'Costo', 'Técnico', 'Estado'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        item.vehicle,
        item.plate,
        item.date,
        item.kilometers,
        item.oilType,
        item.cost,
        item.technician,
        item.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oil-changes-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
      <Box sx={{ 
        p: 3, 
        background: 'radial-gradient(circle at 20% 50%, rgba(0, 255, 136, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 255, 136, 0.03) 0%, transparent 50%), linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
        minHeight: '100vh',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0, 255, 136, 0.01) 35px, rgba(0, 255, 136, 0.01) 70px)',
          pointerEvents: 'none',
        }
      }}>
        {/* Animated Background Elements */}
        <Box sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(0, 255, 136, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'pulse 4s ease-in-out infinite',
        }} />
        <Box sx={{
          position: 'absolute',
          top: '60%',
          right: '10%',
          width: 150,
          height: 150,
          background: 'radial-gradient(circle, rgba(0, 255, 136, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'pulse 3s ease-in-out infinite 1s',
        }} />

        {/* Header */}
        <Box sx={{ 
          mb: 4, 
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <Box sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
            mb: 2,
            px: 4,
            py: 2,
            background: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: '50px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 255, 136, 0.1)',
          }}>
            <Build sx={{ fontSize: 40, color: '#00ff88' }} />
            <Typography variant="h4" sx={{ 
              color: '#00ff88', 
              fontWeight: 700,
              textShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
              background: 'linear-gradient(45deg, #00ff88, #00cc6a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Reporte de Cambios de Aceite
            </Typography>
            <Assessment sx={{ fontSize: 40, color: '#00ff88' }} />
          </Box>
          <Typography variant="body1" sx={{ 
            color: '#888',
            fontSize: '1.1rem',
            fontWeight: 300,
            letterSpacing: '0.5px'
          }}>
            Análisis avanzado del mantenimiento de aceite del fleet
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4, position: 'relative', zIndex: 1 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(42, 42, 42, 0.9) 100%)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: 3,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #00ff88, #00cc6a, #00ff88)',
                animation: 'shimmer 2s ease-in-out infinite',
              },
              '&:hover': {
                transform: 'translateY(-8px) scale(1.02)',
                boxShadow: '0 25px 50px rgba(0, 255, 136, 0.3), 0 0 40px rgba(0, 255, 136, 0.1)',
                border: '1px solid rgba(0, 255, 136, 0.5)',
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 4, position: 'relative', zIndex: 1 }}>
                <Box sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 70,
                  height: 70,
                  background: 'radial-gradient(circle, rgba(0, 255, 136, 0.2) 0%, rgba(0, 255, 136, 0.05) 70%)',
                  borderRadius: '50%',
                  mb: 2,
                  boxShadow: '0 0 30px rgba(0, 255, 136, 0.3)',
                }}>
                  <LocalGasStation sx={{ fontSize: 36, color: '#00ff88' }} />
                </Box>
                <Typography variant="h3" sx={{ 
                  color: '#00ff88', 
                  fontWeight: 700,
                  mb: 1,
                  fontSize: '2.2rem',
                  textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
                }}>
                  {chartData.totalChanges}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#aaa',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  letterSpacing: '0.5px'
                }}>
                  Total Cambios
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(42, 42, 42, 0.9) 100%)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: 3,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #00ff88, #00cc6a, #00ff88)',
                animation: 'shimmer 2s ease-in-out infinite 0.5s',
              },
              '&:hover': {
                transform: 'translateY(-8px) scale(1.02)',
                boxShadow: '0 25px 50px rgba(0, 255, 136, 0.3), 0 0 40px rgba(0, 255, 136, 0.1)',
                border: '1px solid rgba(0, 255, 136, 0.5)',
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 4, position: 'relative', zIndex: 1 }}>
                <Box sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 70,
                  height: 70,
                  background: 'radial-gradient(circle, rgba(0, 255, 136, 0.2) 0%, rgba(0, 255, 136, 0.05) 70%)',
                  borderRadius: '50%',
                  mb: 2,
                  boxShadow: '0 0 30px rgba(0, 255, 136, 0.3)',
                }}>
                  <AttachMoney sx={{ fontSize: 36, color: '#00ff88' }} />
                </Box>
                <Typography variant="h3" sx={{ 
                  color: '#00ff88', 
                  fontWeight: 700,
                  mb: 1,
                  fontSize: '2.2rem',
                  textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
                }}>
                  ${chartData.totalCost.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#aaa',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  letterSpacing: '0.5px'
                }}>
                  Costo Total
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(42, 42, 42, 0.9) 100%)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: 3,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #00ff88, #00cc6a, #00ff88)',
                animation: 'shimmer 2s ease-in-out infinite 1s',
              },
              '&:hover': {
                transform: 'translateY(-8px) scale(1.02)',
                boxShadow: '0 25px 50px rgba(0, 255, 136, 0.3), 0 0 40px rgba(0, 255, 136, 0.1)',
                border: '1px solid rgba(0, 255, 136, 0.5)',
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 4, position: 'relative', zIndex: 1 }}>
                <Box sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 70,
                  height: 70,
                  background: 'radial-gradient(circle, rgba(0, 255, 136, 0.2) 0%, rgba(0, 255, 136, 0.05) 70%)',
                  borderRadius: '50%',
                  mb: 2,
                  boxShadow: '0 0 30px rgba(0, 255, 136, 0.3)',
                }}>
                  <TrendingUp sx={{ fontSize: 36, color: '#00ff88' }} />
                </Box>
                <Typography variant="h3" sx={{ 
                  color: '#00ff88', 
                  fontWeight: 700,
                  mb: 1,
                  fontSize: '2.2rem',
                  textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
                }}>
                  ${chartData.averageCost.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#aaa',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  letterSpacing: '0.5px'
                }}>
                  Costo Promedio
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(42, 42, 42, 0.9) 100%)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: 3,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #00ff88, #00cc6a, #00ff88)',
                animation: 'shimmer 2s ease-in-out infinite 1.5s',
              },
              '&:hover': {
                transform: 'translateY(-8px) scale(1.02)',
                boxShadow: '0 25px 50px rgba(0, 255, 136, 0.3), 0 0 40px rgba(0, 255, 136, 0.1)',
                border: '1px solid rgba(0, 255, 136, 0.5)',
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 4, position: 'relative', zIndex: 1 }}>
                <Box sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 70,
                  height: 70,
                  background: 'radial-gradient(circle, rgba(0, 255, 136, 0.2) 0%, rgba(0, 255, 136, 0.05) 70%)',
                  borderRadius: '50%',
                  mb: 2,
                  boxShadow: '0 0 30px rgba(0, 255, 136, 0.3)',
                }}>
                  <Speed sx={{ fontSize: 36, color: '#00ff88' }} />
                </Box>
                <Typography variant="h3" sx={{ 
                  color: '#00ff88', 
                  fontWeight: 700,
                  mb: 1,
                  fontSize: '2.2rem',
                  textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
                }}>
                  {filteredData.length > 0 ? Math.round(filteredData.reduce((acc, item) => acc + item.kilometers, 0) / filteredData.length) : 0}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#aaa',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  letterSpacing: '0.5px'
                }}>
                  Km Promedio
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
          mb: 4,
          position: 'relative',
          zIndex: 1
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ 
              color: '#00ff88', 
              fontWeight: 600, 
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <TrendingUp />
              Tendencia Mensual de Cambios de Aceite
            </Typography>
            {renderChart()}
          </CardContent>
        </Card>

        {/* Filters and Actions */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 3, 
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1
        }}>
          <TextField
            placeholder="Buscar por vehículo, placa o técnico..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{
              flex: 1,
              minWidth: 250,
              background: 'rgba(26, 26, 26, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
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
          
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={exportToCSV}
            sx={{
              borderColor: 'rgba(0, 255, 136, 0.5)',
              color: '#00ff88',
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 136, 0.1)',
                borderColor: '#00ff88',
              }
            }}
          >
            Exportar CSV
          </Button>
        </Box>

        {/* Data Table */}
        <Card sx={{
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(42, 42, 42, 0.9) 100%)',
          border: '1px solid rgba(0, 255, 136, 0.2)',
          borderRadius: 2,
          backdropFilter: 'blur(10px)',
          position: 'relative',
          zIndex: 1
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
              <Assessment />
              Historial de Cambios de Aceite
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Vehículo</TableCell>
                    <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Placa</TableCell>
                    <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Fecha</TableCell>
                    <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Kilómetros</TableCell>
                    <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Tipo de Aceite</TableCell>
                    <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Costo</TableCell>
                    <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Técnico</TableCell>
                    <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Fotos</TableCell>
                    <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Estado</TableCell>
                    <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Detalles</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id} sx={{ 
                      '&:hover': { 
                        background: 'rgba(0, 255, 136, 0.05)' 
                      },
                      transition: 'background 0.3s ease'
                    }}>
                      <TableCell sx={{ color: '#fff' }}>{item.vehicle}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{item.plate}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{item.date}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{item.kilometers.toLocaleString()} km</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{item.oilType}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>${item.cost.toLocaleString()}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{item.technician}</TableCell>
                      <TableCell>
                        {item.photos && item.photos.length > 0 ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              icon={<Image />}
                              label={`${item.photos.length} fotos`}
                              size="small"
                              clickable
                              onClick={() => handleViewImages(item.photos)}
                              sx={{
                                backgroundColor: 'rgba(0, 255, 136, 0.2)',
                                color: '#00ff88',
                                border: '1px solid rgba(0, 255, 136, 0.5)',
                                fontWeight: 600,
                                '&:hover': {
                                  backgroundColor: 'rgba(0, 255, 136, 0.3)',
                                }
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleViewImages(item.photos)}
                              sx={{
                                color: '#00ff88',
                                '&:hover': {
                                  backgroundColor: 'rgba(0, 255, 136, 0.1)',
                                }
                              }}
                            >
                              <Visibility />
                            </IconButton>
                          </Box>
                        ) : (
                          <Typography variant="body2" sx={{ color: '#888' }}>
                            Sin fotos
                          </Typography>
                        )}
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
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleViewDetail(item)}
                          sx={{
                            borderColor: 'rgba(0, 255, 136, 0.5)',
                            color: '#00ff88',
                            fontSize: '0.75rem',
                            padding: '4px 8px',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 255, 136, 0.1)',
                              borderColor: '#00ff88',
                            }
                          }}
                        >
                          Ver Detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

      {/* Image Viewer Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
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
        <DialogTitle sx={{ 
          color: '#00ff88', 
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Image />
          Fotos del Mantenimiento
        </DialogTitle>
        <DialogContent>
          <ImageList
            sx={{ 
              width: '100%', 
              height: 400,
              '& .MuiImageListItem-img': {
                border: '2px solid rgba(0, 255, 136, 0.3)',
                borderRadius: 1,
              }
            }}
            cols={3}
            rowHeight={164}
          >
            {selectedImages.map((image, index) => (
              <ImageListItem key={index}>
                <img
                  src={image}
                  alt={`Maintenance photo ${index + 1}`}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <ImageListItemBar
                  title={`Foto ${index + 1}`}
                  position="below"
                  sx={{
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: '#fff',
                    '& .MuiImageListItemBar-title': {
                      fontSize: '0.8rem',
                    }
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setImageDialogOpen(false)}
            sx={{
              color: '#00ff88',
              borderColor: 'rgba(0, 255, 136, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 136, 0.1)',
              }
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail View Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(42, 42, 42, 0.95) 100%)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#00ff88', 
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Build />
          Detalles del Cambio de Aceite
        </DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Box sx={{ p: 2 }}>
              {/* Basic Information */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ color: '#00ff88', fontWeight: 600, mb: 1 }}>
                    Información del Vehículo
                  </Typography>
                  <Box sx={{ background: 'rgba(0, 255, 136, 0.05)', p: 2, borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      <strong>Vehículo:</strong> {selectedRecord.vehicle}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      <strong>Placa:</strong> {selectedRecord.plate}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      <strong>Kilometraje:</strong> {selectedRecord.kilometers?.toLocaleString()} km
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ color: '#00ff88', fontWeight: 600, mb: 1 }}>
                    Información del Servicio
                  </Typography>
                  <Box sx={{ background: 'rgba(0, 255, 136, 0.05)', p: 2, borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      <strong>Fecha:</strong> {selectedRecord.date}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      <strong>Tipo de Aceite:</strong> {selectedRecord.oilType}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      <strong>Costo:</strong> ${selectedRecord.cost?.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Technician and Status */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ color: '#00ff88', fontWeight: 600, mb: 1 }}>
                    Técnico y Estado
                  </Typography>
                  <Box sx={{ background: 'rgba(0, 255, 136, 0.05)', p: 2, borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      <strong>Técnico:</strong> {selectedRecord.technician}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      <strong>Estado:</strong> {selectedRecord.status}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      <strong>Próximo Cambio:</strong> {selectedRecord.nextChange?.toLocaleString()} km
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ color: '#00ff88', fontWeight: 600, mb: 1 }}>
                    Notas Adicionales
                  </Typography>
                  <Box sx={{ background: 'rgba(0, 255, 136, 0.05)', p: 2, borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      {selectedRecord.notes || 'Sin notas adicionales'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Photos Section */}
              {selectedRecord.photos && selectedRecord.photos.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: '#00ff88', fontWeight: 600, mb: 2 }}>
                    Fotos del Mantenimiento ({selectedRecord.photos.length})
                  </Typography>
                  <ImageList
                    sx={{ 
                      width: '100%', 
                      height: 300,
                      '& .MuiImageListItem-img': {
                        border: '2px solid rgba(0, 255, 136, 0.3)',
                        borderRadius: 1,
                      }
                    }}
                    cols={3}
                    rowHeight={100}
                  >
                    {selectedRecord.photos.map((photo: string, index: number) => (
                      <ImageListItem key={index}>
                        <img
                          src={photo}
                          alt={`Maintenance photo ${index + 1}`}
                          loading="lazy"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleViewImages([photo])}
                        />
                        <ImageListItemBar
                          title={`Foto ${index + 1}`}
                          position="below"
                          sx={{
                            background: 'rgba(0, 0, 0, 0.7)',
                            color: '#fff',
                            '& .MuiImageListItemBar-title': {
                              fontSize: '0.7rem',
                            }
                          }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDetailDialogOpen(false)}
            sx={{
              color: '#00ff88',
              borderColor: 'rgba(0, 255, 136, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 136, 0.1)',
              }
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
  );
};

export default OilChangeReport;
