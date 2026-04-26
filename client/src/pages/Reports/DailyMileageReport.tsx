// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
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
  TextField,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Speed,
  DirectionsCar,
  CalendarToday,
  TrendingUp,
  FilterList,
  Download,
  Visibility,
  ArrowBack
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

const DailyMileageReport: React.FC = () => {
  const navigate = useNavigate();
  const [mileageRecords, setMileageRecords] = useState<DailyMileageRecord[]>([]);
  const [filteredData, setFilteredData] = useState<DailyMileageRecord[]>([]);
  const [filter, setFilter] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DailyMileageRecord | null>(null);

  useEffect(() => {
    loadMileageRecords();
  }, []);

  useEffect(() => {
    filterData();
  }, [mileageRecords, filter, selectedVehicle, selectedDriver, dateRange]);

  const loadMileageRecords = () => {
    const savedRecords = JSON.parse(localStorage.getItem('torquesmart_daily_mileage') || '[]');
    setMileageRecords(savedRecords);
  };

  const filterData = () => {
    let filtered = [...mileageRecords];

    // Filter by search text
    if (filter) {
      filtered = filtered.filter(record =>
        record.vehiclePlate.toLowerCase().includes(filter.toLowerCase()) ||
        record.vehicleBrand.toLowerCase().includes(filter.toLowerCase()) ||
        record.vehicleModel.toLowerCase().includes(filter.toLowerCase()) ||
        record.driver.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // Filter by vehicle
    if (selectedVehicle) {
      filtered = filtered.filter(record => record.vehiclePlate === selectedVehicle);
    }

    // Filter by driver
    if (selectedDriver) {
      filtered = filtered.filter(record => record.driver === selectedDriver);
    }

    // Filter by date range
    if (dateRange.start) {
      filtered = filtered.filter(record => record.date >= dateRange.start);
    }
    if (dateRange.end) {
      filtered = filtered.filter(record => record.date <= dateRange.end);
    }

    setFilteredData(filtered);
  };

  const handleViewDetails = (record: DailyMileageRecord) => {
    setSelectedRecord(record);
    setDetailDialogOpen(true);
  };

  const exportToCSV = () => {
    const headers = ['Vehículo', 'Placa', 'Fecha', 'Conductor', 'Km Inicial', 'Km Final', 'Total Km', 'Notas'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        `${item.vehicleBrand} ${item.vehicleModel}`,
        item.vehiclePlate,
        item.date,
        item.driver,
        item.startMileage,
        item.endMileage,
        item.totalKm,
        `"${item.notes || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-mileage-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const calculateStats = () => {
    const totalRecords = filteredData.length;
    const totalKm = filteredData.reduce((sum, record) => sum + record.totalKm, 0);
    const avgKm = totalRecords > 0 ? Math.round(totalKm / totalRecords) : 0;
    
    // Get unique vehicles and drivers
    const uniqueVehicles = [...new Set(filteredData.map(r => r.vehiclePlate))].length;
    const uniqueDrivers = [...new Set(filteredData.map(r => r.driver))].length;

    return { totalRecords, totalKm, avgKm, uniqueVehicles, uniqueDrivers };
  };

  const stats = calculateStats();

  // Calculate monthly data for each vehicle
  const calculateMonthlyData = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Get all unique vehicles
    const vehicles = [...new Set(mileageRecords.map(r => r.vehiclePlate))];
    
    const monthlyData = vehicles.map(vehicle => {
      // Get all records for this vehicle in current month
      const vehicleRecords = mileageRecords.filter(record => {
        const recordDate = new Date(record.date);
        return record.vehiclePlate === vehicle && 
               recordDate.getMonth() === currentMonth && 
               recordDate.getFullYear() === currentYear;
      });

      // Calculate daily totals
      const dailyTotals: { [date: string]: number } = {};
      
      vehicleRecords.forEach(record => {
        if (!dailyTotals[record.date]) {
          dailyTotals[record.date] = 0;
        }
        dailyTotals[record.date] += record.totalKm;
      });

      // Get all days in current month
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const dailyData = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dailyData.push({
          date,
          day,
          totalKm: dailyTotals[date] || 0,
          records: vehicleRecords.filter(r => r.date === date)
        });
      }

      return {
        vehicle,
        dailyData,
        totalMonthlyKm: dailyData.reduce((sum, day) => sum + day.totalKm, 0),
        activeDays: dailyData.filter(day => day.totalKm > 0).length
      };
    });

    return monthlyData;
  };

  const monthlyData = calculateMonthlyData();

  // Get unique vehicles and drivers for filters
  const vehicles = [...new Set(mileageRecords.map(r => r.vehiclePlate))];
  const drivers = [...new Set(mileageRecords.map(r => r.driver))];

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
      {/* Header */}
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        position: 'relative',
        zIndex: 1
      }}>
        <IconButton 
          onClick={() => navigate('/reports')}
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
      <Grid container spacing={3} sx={{ mb: 4, position: 'relative', zIndex: 1 }}>
        <Grid item xs={12} md={2.4}>
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
                width: 60,
                height: 60,
                background: 'radial-gradient(circle, rgba(0, 255, 136, 0.2) 0%, rgba(0, 255, 136, 0.05) 70%)',
                borderRadius: '50%',
                mb: 2,
                boxShadow: '0 0 30px rgba(0, 255, 136, 0.3)',
              }}>
                <DirectionsCar sx={{ fontSize: 30, color: '#00ff88' }} />
              </Box>
              <Typography variant="h4" sx={{ 
                color: '#00ff88', 
                fontWeight: 700,
                mb: 1,
                fontSize: '1.8rem',
                textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
              }}>
                {stats.totalRecords}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: '#aaa',
                fontSize: '0.8rem',
                fontWeight: 500,
                letterSpacing: '0.5px'
              }}>
                Total Registros
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
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
                width: 60,
                height: 60,
                background: 'radial-gradient(circle, rgba(0, 255, 136, 0.2) 0%, rgba(0, 255, 136, 0.05) 70%)',
                borderRadius: '50%',
                mb: 2,
                boxShadow: '0 0 30px rgba(0, 255, 136, 0.3)',
              }}>
                <Speed sx={{ fontSize: 30, color: '#00ff88' }} />
              </Box>
              <Typography variant="h4" sx={{ 
                color: '#00ff88', 
                fontWeight: 700,
                mb: 1,
                fontSize: '1.8rem',
                textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
              }}>
                {stats.totalKm.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: '#aaa',
                fontSize: '0.8rem',
                fontWeight: 500,
                letterSpacing: '0.5px'
              }}>
                Km Totales
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
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
                width: 60,
                height: 60,
                background: 'radial-gradient(circle, rgba(0, 255, 136, 0.2) 0%, rgba(0, 255, 136, 0.05) 70%)',
                borderRadius: '50%',
                mb: 2,
                boxShadow: '0 0 30px rgba(0, 255, 136, 0.3)',
              }}>
                <TrendingUp sx={{ fontSize: 30, color: '#00ff88' }} />
              </Box>
              <Typography variant="h4" sx={{ 
                color: '#00ff88', 
                fontWeight: 700,
                mb: 1,
                fontSize: '1.8rem',
                textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
              }}>
                {stats.avgKm.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: '#aaa',
                fontSize: '0.8rem',
                fontWeight: 500,
                letterSpacing: '0.5px'
              }}>
                Promedio Diario
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
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
                width: 60,
                height: 60,
                background: 'radial-gradient(circle, rgba(0, 255, 136, 0.2) 0%, rgba(0, 255, 136, 0.05) 70%)',
                borderRadius: '50%',
                mb: 2,
                boxShadow: '0 0 30px rgba(0, 255, 136, 0.3)',
              }}>
                <DirectionsCar sx={{ fontSize: 30, color: '#00ff88' }} />
              </Box>
              <Typography variant="h4" sx={{ 
                color: '#00ff88', 
                fontWeight: 700,
                mb: 1,
                fontSize: '1.8rem',
                textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
              }}>
                {stats.uniqueVehicles}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: '#aaa',
                fontSize: '0.8rem',
                fontWeight: 500,
                letterSpacing: '0.5px'
              }}>
                Vehículos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
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
              animation: 'shimmer 2s ease-in-out infinite 0.3s',
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
                width: 60,
                height: 60,
                background: 'radial-gradient(circle, rgba(0, 255, 136, 0.2) 0%, rgba(0, 255, 136, 0.05) 70%)',
                borderRadius: '50%',
                mb: 2,
                boxShadow: '0 0 30px rgba(0, 255, 136, 0.3)',
              }}>
                <CalendarToday sx={{ fontSize: 30, color: '#00ff88' }} />
              </Box>
              <Typography variant="h4" sx={{ 
                color: '#00ff88', 
                fontWeight: 700,
                mb: 1,
                fontSize: '1.8rem',
                textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
              }}>
                {stats.uniqueDrivers}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: '#aaa',
                fontSize: '0.8rem',
                fontWeight: 500,
                letterSpacing: '0.5px'
              }}>
                Conductores
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{
        background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(42, 42, 42, 0.9) 100%)',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        borderRadius: 2,
        backdropFilter: 'blur(10px)',
        mb: 4,
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
            <FilterList />
            Filtros y Búsqueda
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Buscar por vehículo, placa o conductor..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                sx={{
                  background: 'rgba(26, 26, 26, 0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                  },
                  '& .MuiInputLabel-root': { color: '#888' },
                }}
                InputProps={{
                  startAdornment: <FilterList sx={{ color: '#888', mr: 1 }} />,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
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
                >
                  <MenuItem value="">Todos</MenuItem>
                  {vehicles.map(vehicle => (
                    <MenuItem key={vehicle} value={vehicle}>{vehicle}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                },
                '& .MuiInputLabel-root': { color: '#888' },
              }}>
                <InputLabel sx={{ color: '#888' }}>Conductor</InputLabel>
                <Select
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  label="Conductor"
                >
                  <MenuItem value="">Todos</MenuItem>
                  {drivers.map(driver => (
                    <MenuItem key={driver} value={driver}>{driver}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                type="date"
                label="Fecha Inicio"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                sx={{
                  background: 'rgba(26, 26, 26, 0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
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
            
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                type="date"
                label="Fecha Fin"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                sx={{
                  background: 'rgba(26, 26, 26, 0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
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
            
            <Grid item xs={12} md={1}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={exportToCSV}
                fullWidth
                sx={{
                  height: '56px',
                  borderColor: 'rgba(0, 255, 136, 0.5)',
                  color: '#00ff88',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    borderColor: '#00ff88',
                  }
                }}
              >
                Exportar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Monthly Daily View */}
      <Card sx={{
        background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(42, 42, 42, 0.9) 100%)',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        borderRadius: 2,
        backdropFilter: 'blur(10px)',
        position: 'relative',
        zIndex: 1,
        mb: 4
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
            <CalendarToday />
            Registro Diario del Mes por Vehículo
          </Typography>
          
          {monthlyData.map((vehicleData) => (
            <Box key={vehicleData.vehicle} sx={{ mb: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 2,
                p: 2,
                background: 'rgba(0, 255, 136, 0.05)',
                borderRadius: 2,
                border: '1px solid rgba(0, 255, 136, 0.2)'
              }}>
                <Typography variant="h6" sx={{ color: '#00ff88', fontWeight: 600 }}>
                  {vehicleData.vehicle}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography variant="body2" sx={{ color: '#fff' }}>
                    Total: {vehicleData.totalMonthlyKm.toLocaleString()} km
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#888' }}>
                    Días activos: {vehicleData.activeDays}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                gap: 1,
                maxHeight: 200,
                overflowY: 'auto'
              }}>
                {vehicleData.dailyData.map((dayData) => (
                  <Box
                    key={dayData.date}
                    sx={{
                      p: 1,
                      background: dayData.totalKm > 0 
                        ? 'rgba(0, 255, 136, 0.2)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: dayData.totalKm > 0 
                        ? '1px solid rgba(0, 255, 136, 0.5)' 
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 1,
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        background: dayData.totalKm > 0 
                          ? 'rgba(0, 255, 136, 0.3)' 
                          : 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#888', fontSize: '0.7rem' }}>
                      {dayData.day}
                    </Typography>
                    {dayData.totalKm > 0 && (
                      <>
                        <Typography variant="body2" sx={{ 
                          color: '#00ff88', 
                          fontSize: '0.8rem', 
                          fontWeight: 600 
                        }}>
                          {dayData.totalKm}
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: '#aaa', 
                          fontSize: '0.6rem' 
                        }}>
                          km
                        </Typography>
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </CardContent>
      </Card>

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
            <Speed />
            Historial de Kilometraje Diario
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
                {filteredData.map((record) => (
                  <TableRow key={record.id} sx={{ 
                    '&:hover': { 
                      background: 'rgba(0, 255, 136, 0.05)' 
                    },
                    transition: 'background 0.3s ease'
                  }}>
                    <TableCell sx={{ color: '#fff' }}>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                          {record.vehicleBrand} {record.vehicleModel}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#888' }}>
                          Placa: {record.vehiclePlate}
                        </Typography>
                      </Box>
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

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
        <DialogTitle sx={{ 
          color: '#00ff88', 
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Speed />
          Detalles del Registro de Kilometraje
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
        <DialogActions sx={{ p: 2 }}>
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
    </Box>
  );
};

export default DailyMileageReport;
