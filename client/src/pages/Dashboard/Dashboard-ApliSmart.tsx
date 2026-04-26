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
  Alert,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  DirectionsCar,
  Build,
  Warning,
  LocalGasStation,
  Event,
  Schedule,
  Refresh,
  TrendingUp,
  AccessTime,
  CheckCircle,
  Error as ErrorIcon
} from '@mui/icons-material';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface DashboardStats {
  total_vehiculos: number;
  vehiculos_activos: number;
  vehiculos_mantenimiento: number;
  vehiculos_inactivos: number;
  kilometraje_promedio: number;
}

interface RecentActivity {
  tipo: string;
  descripcion: string;
  fecha: string;
  placa: string;
  estado: string;
}

interface Alert {
  id: string;
  titulo: string;
  descripcion: string;
  tipo_alerta: string;
  prioridad: string;
  fecha_alerta: string;
  leida: boolean;
}

interface UpcomingMaintenance {
  id: string;
  unidad: string;
  servicio: string;
  fecha: string;
  estado: string;
}

const DashboardApliSmart: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [upcomingMaintenance, setUpcomingMaintenance] = useState<UpcomingMaintenance[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      setRefreshing(true);

      const [fleetResponse, overviewResponse] = await Promise.all([
        api.get('/vehicles/stats/overview'),
        api.get('/reports/fleet/overview')
      ]);

      setDashboardStats(fleetResponse.data.data);
      setRecentActivity(overviewResponse.data.data.actividad_reciente || []);

      // Simular alertas y mantenimientos próximos (en producción vendrían de la API)
      setAlerts([
        {
          id: '1',
          titulo: 'Mantenimiento vencido',
          descripcion: 'Vehículo ABC-123 requiere mantenimiento urgente',
          tipo_alerta: 'mantenimiento',
          prioridad: 'alta',
          fecha_alerta: '2026-04-25',
          leida: false
        },
        {
          id: '2',
          titulo: 'Kilometraje alcanzado',
          descripcion: 'Vehículo XYZ-789 alcanzó 50,000 km',
          tipo_alerta: 'kilometraje',
          prioridad: 'media',
          fecha_alerta: '2026-04-24',
          leida: false
        }
      ]);

      setUpcomingMaintenance([
        {
          id: '1',
          unidad: 'ABC-123',
          servicio: 'Cambio de aceite',
          fecha: '2026-04-28',
          estado: 'Programado'
        },
        {
          id: '2',
          unidad: 'XYZ-789',
          servicio: 'Revisión general',
          fecha: '2026-05-02',
          estado: 'Pendiente'
        },
        {
          id: '3',
          unidad: 'DEF-456',
          servicio: 'Rotación de llantas',
          fecha: '2026-05-05',
          estado: 'Programado'
        }
      ]);

    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError('Error al cargar los datos del dashboard');
      toast.error('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo':
      case 'completado':
      case 'Programado':
        return 'success';
      case 'mantenimiento':
      case 'en_progreso':
      case 'Pendiente':
        return 'warning';
      case 'inactivo':
      case 'cancelado':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'urgente':
      case 'alta':
        return 'error';
      case 'media':
        return 'warning';
      case 'baja':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPrioridadIcon = (prioridad: string) => {
    switch (prioridad) {
      case 'urgente':
      case 'alta':
        return <ErrorIcon sx={{ fontSize: 16 }} />;
      case 'media':
        return <Warning sx={{ fontSize: 16 }} />;
      case 'baja':
        return <CheckCircle sx={{ fontSize: 16 }} />;
      default:
        return <AccessTime sx={{ fontSize: 16 }} />;
    }
  };

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
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: '#333' }}>
          ApliSmart Motors Dashboard
        </Typography>
        <IconButton onClick={fetchDashboardData} disabled={refreshing}>
          <Refresh />
        </IconButton>
      </Box>

      {/* Tarjetas de Resumen */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                    Vehículos
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {dashboardStats?.total_vehiculos || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    vehículos registrados
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  width: 56, 
                  height: 56 
                }}>
                  <DirectionsCar sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                    Mantenimientos
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {dashboardStats?.vehiculos_mantenimiento || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    órdenes registradas
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  width: 56, 
                  height: 56 
                }}>
                  <Build sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                    Alertas
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {alerts.filter(a => !a.leida).length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    alertas activas
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  width: 56, 
                  height: 56 
                }}>
                  <Warning sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                    Combustible
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    0 L
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    sin consumos registrados
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  width: 56, 
                  height: 56 
                }}>
                  <LocalGasStation sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Contenido Principal */}
      <Grid container spacing={3}>
        {/* Actividad Reciente */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '400px' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Actividad reciente
                </Typography>
                <Tooltip title="Eventos recientes del sistema">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <TrendingUp fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              
              {recentActivity.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8, color: '#666' }}>
                  <Schedule sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography variant="body1">
                    No hay actividad reciente
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Los eventos aparecerán cuando se creen vehículos, conductores, mantenimientos o asignaciones
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
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
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Alertas Recientes */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '400px' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Alertas recientes
                </Typography>
                <Tooltip title="Notificaciones del sistema">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <Warning fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              
              {alerts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8, color: '#666' }}>
                  <Warning sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography variant="body1">
                    No hay alertas recientes
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Se mostrarán vencimientos, novedades o alertas manuales en esta sección
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                  {alerts.map((alert) => (
                    <Box key={alert.id} sx={{ 
                      p: 2, 
                      mb: 1, 
                      border: `1px solid ${getPrioridadColor(alert.prioridad)}40`,
                      borderRadius: 2,
                      backgroundColor: `${getPrioridadColor(alert.prioridad)}08`
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {getPrioridadIcon(alert.prioridad)}
                        <Typography variant="subtitle2" sx={{ ml: 1, fontWeight: 600 }}>
                          {alert.titulo}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                        {alert.descripcion}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip 
                          label={alert.prioridad.toUpperCase()}
                          size="small"
                          color={getPrioridadColor(alert.prioridad) as any}
                        />
                        <Typography variant="caption" sx={{ color: '#999' }}>
                          {alert.fecha_alerta}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Próximos Mantenimientos */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Próximos mantenimientos
                </Typography>
                <Tooltip title="Planificación semanal de mantenimientos">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <Event fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                Anticipa la planificación semanal de mantenimientos
              </Typography>
              
              {upcomingMaintenance.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4, color: '#666' }}>
                  <Build sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography variant="body1">
                    No hay mantenimientos programados
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Unidad</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Servicio</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {upcomingMaintenance.map((maintenance) => (
                        <TableRow key={maintenance.id} hover>
                          <TableCell sx={{ fontWeight: 500 }}>
                            {maintenance.unidad}
                          </TableCell>
                          <TableCell>{maintenance.servicio}</TableCell>
                          <TableCell>{maintenance.fecha}</TableCell>
                          <TableCell>
                            <Chip 
                              label={maintenance.estado}
                              size="small"
                              color={getEstadoColor(maintenance.estado) as any}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardApliSmart;
