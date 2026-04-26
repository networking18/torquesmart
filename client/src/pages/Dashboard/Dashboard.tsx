import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  DirectionsCar,
  Build,
  AttachMoney,
  Warning,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface DashboardStats {
  total_vehiculos: number;
  vehiculos_activos: number;
  vehiculos_mantenimiento: number;
  vehiculos_inactivos: number;
  kilometraje_promedio: number;
  por_tipo_combustible: Array<{ tipo_combustible: string; count: number }>;
  por_anio: Array<{ anio: number; count: number }>;
}

interface MaintenanceStats {
  total_mantenimientos: number;
  mantenimientos_completados: number;
  mantenimientos_pendientes: number;
  mantenimientos_en_progreso: number;
  costo_total: number;
  por_tipo: Array<{ nombre: string; count: number; total_cost: number }>;
  por_mes: Array<{ month: string; count: number; total_cost: number }>;
}

interface ExpenseStats {
  total_gastado: number;
  total_transacciones: number;
  por_tipo: Array<{ tipo_gasto: string; total: number; count: number }>;
  por_mes: Array<{ month: string; total: number; count: number }>;
}

interface RecentActivity {
  tipo: string;
  descripcion: string;
  fecha: string;
  placa: string;
  estado: string;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [maintenanceStats, setMaintenanceStats] = useState<MaintenanceStats | null>(null);
  const [expenseStats, setExpenseStats] = useState<ExpenseStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          fleetResponse,
          maintenanceResponse,
          expensesResponse,
          overviewResponse
        ] = await Promise.all([
          api.get('/vehicles/stats/overview'),
          api.get('/maintenance/stats/overview'),
          api.get('/expenses/stats/overview'),
          api.get('/reports/fleet/overview')
        ]);

        setDashboardStats(fleetResponse.data.data);
        setMaintenanceStats(maintenanceResponse.data.data);
        setExpenseStats(expensesResponse.data.data);
        setRecentActivity(overviewResponse.data.data.actividad_reciente);

      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError('Error al cargar los datos del dashboard');
        toast.error('Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'success';
      case 'mantenimiento':
        return 'warning';
      case 'inactivo':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'urgente':
        return 'error';
      case 'alta':
        return 'warning';
      case 'media':
        return 'info';
      case 'baja':
        return 'success';
      default:
        return 'default';
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Cargando dashboard...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard General
      </Typography>

      {/* Tarjetas de Estadísticas Principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <DirectionsCar color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Vehículos Totales
                  </Typography>
                  <Typography variant="h4">
                    {dashboardStats?.total_vehiculos || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Build color="secondary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Mantenimientos Pendientes
                  </Typography>
                  <Typography variant="h4">
                    {maintenanceStats?.mantenimientos_pendientes || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AttachMoney sx={{ mr: 2, fontSize: 40, color: 'green' }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Costo Total Mantenimientos
                  </Typography>
                  <Typography variant="h4">
                    ${maintenanceStats?.costo_total?.toFixed(2) || '0.00'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Warning sx={{ mr: 2, fontSize: 40, color: 'orange' }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Km Promedio
                  </Typography>
                  <Typography variant="h4">
                    {dashboardStats?.kilometraje_promedio?.toLocaleString() || '0'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Gráfico de Vehículos por Estado */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vehículos por Estado
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Activos', value: dashboardStats?.vehiculos_activos || 0 },
                      { name: 'En Mantenimiento', value: dashboardStats?.vehiculos_mantenimiento || 0 },
                      { name: 'Inactivos', value: dashboardStats?.vehiculos_inactivos || 0 }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Mantenimientos por Mes */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mantenimientos por Mes
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={maintenanceStats?.por_mes || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actividad Reciente */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Actividad Reciente
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Vehículo</TableCell>
                      <TableCell>Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentActivity.slice(0, 5).map((activity, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Chip 
                            label={activity.tipo === 'mantenimiento' ? 'Mantenimiento' : 'Gasto'}
                            size="small"
                            color={activity.tipo === 'mantenimiento' ? 'primary' : 'secondary'}
                          />
                        </TableCell>
                        <TableCell>{activity.descripcion}</TableCell>
                        <TableCell>{activity.placa}</TableCell>
                        <TableCell>
                          <Chip 
                            label={activity.estado}
                            size="small"
                            color={getEstadoColor(activity.estado) as any}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Gastos por Tipo */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Gastos por Tipo
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseStats?.por_tipo || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ tipo_gasto, percent }) => `${tipo_gasto} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
