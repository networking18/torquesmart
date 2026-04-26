// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  Divider,
  Fade,
  Slide,
  Grow,
  Container,
  Tooltip,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  Skeleton
} from '@mui/material';
import {
  DirectionsCar,
  Build,
  Warning,
  TrendingUp,
  Speed,
  LocalGasStation,
  Settings,
  Notifications,
  MoreVert,
  Refresh,
  FilterList,
  Download,
  Assessment,
  Timeline,
  CheckCircle,
  Error,
  Info,
  ArrowUpward,
  ArrowDownward,
  AccessTime,
  Person,
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material';

const DashboardProfessional: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const statsCards = [
    {
      title: 'Vehículos Activos',
      value: '24',
      icon: <DirectionsCar />,
      color: '#00ff88',
      trend: '+12%',
      trendUp: true,
      subtitle: 'De 25 totales'
    },
    {
      title: 'Mantenimientos',
      value: '8',
      icon: <Build />,
      color: '#ff6b6b',
      trend: '+3',
      trendUp: true,
      subtitle: 'Pendientes'
    },
    {
      title: 'Alertas Críticas',
      value: '3',
      icon: <Warning />,
      color: '#ffd93d',
      trend: '-2',
      trendUp: false,
      subtitle: 'Requieren atención'
    },
    {
      title: 'Eficiencia',
      value: '94%',
      icon: <TrendingUp />,
      color: '#6bcf7f',
      trend: '+5%',
      trendUp: true,
      subtitle: 'Rendimiento general'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'maintenance',
      title: 'Mantenimiento Programado',
      description: 'Camión VOLVO FH16 - Cambio de aceite',
      time: 'Hace 2 horas',
      status: 'scheduled',
      icon: <Build />
    },
    {
      id: 2,
      type: 'alert',
      title: 'Alerta de Combustible',
      description: 'Vehículo MTR-001 con bajo nivel de combustible',
      time: 'Hace 4 horas',
      status: 'warning',
      icon: <LocalGasStation />
    },
    {
      id: 3,
      type: 'completed',
      title: 'Mantenimiento Completado',
      description: 'Camión MERCEDES ACTROS - Revisión general',
      time: 'Hace 6 horas',
      status: 'completed',
      icon: <CheckCircle />
    },
    {
      id: 4,
      type: 'alert',
      title: 'Alerta de Kilometraje',
      description: 'Vehículo SCANIA R740 alcanzó 10,000 km',
      time: 'Hace 8 horas',
      status: 'info',
      icon: <Speed />
    }
  ];

  const upcomingMaintenance = [
    {
      vehicle: 'VOLVO FH16',
      type: 'Cambio de Aceite',
      date: '2024-01-15',
      priority: 'high',
      estimatedCost: '$250'
    },
    {
      vehicle: 'MERCEDES ACTROS',
      type: 'Revisión de Frenos',
      date: '2024-01-18',
      priority: 'medium',
      estimatedCost: '$450'
    },
    {
      vehicle: 'SCANIA R740',
      type: 'Rotación de Neumáticos',
      date: '2024-01-20',
      priority: 'low',
      estimatedCost: '$180'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return '#ffd93d';
      case 'warning': return '#ff6b6b';
      case 'completed': return '#6bcf7f';
      case 'info': return '#4dabf7';
      default: return '#868e96';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffd93d';
      case 'low': return '#6bcf7f';
      default: return '#868e96';
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 80% 20%, rgba(0, 255, 136, 0.05) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(0, 255, 136, 0.03) 0%, transparent 50%)',
          animation: 'pulse 8s ease-in-out infinite',
        }
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          right: '5%',
          width: 150,
          height: 150,
          background: 'radial-gradient(circle, rgba(0, 255, 136, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 10s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '8%',
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(0, 255, 136, 0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 12s ease-in-out infinite reverse',
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 3 }}>
        {/* Header */}
        <Fade in={true} timeout={1000}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', mb: 1 }}>
                  Dashboard Torquesmart
                </Typography>
                <Typography variant="h6" sx={{ color: '#888', fontWeight: 400 }}>
                  Panel de Control de Flota Vehicular
                </Typography>
              </Box>
              <Stack direction="row" spacing={2}>
                <Chip 
                  label="Última actualización: Hace 5 min" 
                  sx={{ 
                    bgcolor: 'rgba(0, 255, 136, 0.1)', 
                    color: '#00ff88', 
                    border: '1px solid rgba(0, 255, 136, 0.3)',
                    fontWeight: 500
                  }} 
                />
                <IconButton
                  onClick={handleRefresh}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    '&:hover': {
                      bgcolor: 'rgba(0, 255, 136, 0.2)',
                    }
                  }}
                >
                  <Refresh sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
                </IconButton>
                <IconButton
                  onClick={handleMenuClick}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    '&:hover': {
                      bgcolor: 'rgba(0, 255, 136, 0.2)',
                    }
                  }}
                >
                  <MoreVert />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      bgcolor: 'rgba(26, 26, 26, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(0, 255, 136, 0.2)',
                    }
                  }}
                >
                  {['24h', '7d', '30d', '90d'].map((range) => (
                    <MenuItem
                      key={range}
                      onClick={() => {
                        setSelectedTimeRange(range);
                        handleMenuClose();
                      }}
                      sx={{ color: '#fff' }}
                    >
                      Últimos {range === '24h' ? '24 horas' : range === '7d' ? '7 días' : range === '30d' ? '30 días' : '90 días'}
                    </MenuItem>
                  ))}
                </Menu>
              </Stack>
            </Box>
          </Box>
        </Fade>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statsCards.map((card, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Slide direction="up" in={true} timeout={800 + index * 100}>
                <Card
                  sx={{
                    background: 'rgba(26, 26, 26, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0, 255, 136, 0.2)',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 16px 48px rgba(0, 255, 136, 0.2)',
                      border: '1px solid rgba(0, 255, 136, 0.4)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: card.color,
                          color: '#000',
                          width: 48,
                          height: 48,
                          boxShadow: `0 4px 16px ${card.color}40`,
                        }}
                      >
                        {card.icon}
                      </Avatar>
                      <Box sx={{ textAlign: 'right' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          {card.trendUp ? (
                            <ArrowUpward sx={{ fontSize: 16, color: '#6bcf7f', mr: 0.5 }} />
                          ) : (
                            <ArrowDownward sx={{ fontSize: 16, color: '#ff6b6b', mr: 0.5 }} />
                          )}
                          <Typography variant="body2" sx={{ 
                            color: card.trendUp ? '#6bcf7f' : '#ff6b6b',
                            fontWeight: 600
                          }}>
                            {card.trend}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>
                      {loading ? <Skeleton width={60} /> : card.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      {card.subtitle}
                    </Typography>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
          ))}
        </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Recent Activities */}
          <Grid item xs={12} lg={6}>
            <Grow in={true} timeout={1000}>
              <Card
                sx={{
                  background: 'rgba(26, 26, 26, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 255, 136, 0.2)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  height: '100%',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                      Actividad Reciente
                    </Typography>
                    <IconButton size="small" sx={{ color: '#888' }}>
                      <FilterList />
                    </IconButton>
                  </Box>
                  <List sx={{ p: 0 }}>
                    {recentActivities.map((activity, index) => (
                      <Slide direction="right" in={true} timeout={1200 + index * 100} key={activity.id}>
                        <ListItem
                          sx={{
                            px: 0,
                            py: 2,
                            borderBottom: index < recentActivities.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: 'rgba(0, 255, 136, 0.05)',
                              borderRadius: 2,
                            }
                          }}
                        >
                          <ListItemIcon>
                            <Avatar
                              sx={{
                                bgcolor: getStatusColor(activity.status),
                                color: '#000',
                                width: 40,
                                height: 40,
                                fontSize: 20,
                              }}
                            >
                              {activity.icon}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body1" sx={{ color: '#fff', fontWeight: 500 }}>
                                {activity.title}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" sx={{ color: '#888', mb: 0.5 }}>
                                  {activity.description}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#666' }}>
                                  {activity.time}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      </Slide>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Upcoming Maintenance */}
          <Grid item xs={12} lg={6}>
            <Grow in={true} timeout={1200}>
              <Card
                sx={{
                  background: 'rgba(26, 26, 26, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 255, 136, 0.2)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  height: '100%',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                      Mantenimiento Programado
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        color: '#00ff88',
                        borderColor: 'rgba(0, 255, 136, 0.3)',
                        '&:hover': {
                          borderColor: '#00ff88',
                          bgcolor: 'rgba(0, 255, 136, 0.1)',
                        }
                      }}
                    >
                      Ver Todos
                    </Button>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: '#888', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            Vehículo
                          </TableCell>
                          <TableCell sx={{ color: '#888', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            Tipo
                          </TableCell>
                          <TableCell sx={{ color: '#888', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            Fecha
                          </TableCell>
                          <TableCell sx={{ color: '#888', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            Costo
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {upcomingMaintenance.map((maintenance, index) => (
                          <Slide direction="left" in={true} timeout={1400 + index * 100} key={index}>
                            <TableRow
                              sx={{
                                '&:hover': {
                                  bgcolor: 'rgba(0, 255, 136, 0.05)',
                                },
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <DirectionsCar sx={{ mr: 1, color: '#00ff88', fontSize: 20 }} />
                                  {maintenance.vehicle}
                                </Box>
                              </TableCell>
                              <TableCell sx={{ color: '#ccc', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                {maintenance.type}
                              </TableCell>
                              <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                <Chip
                                  label={maintenance.date}
                                  size="small"
                                  sx={{
                                    bgcolor: 'rgba(0, 255, 136, 0.1)',
                                    color: '#00ff88',
                                    border: '1px solid rgba(0, 255, 136, 0.3)',
                                    fontSize: '0.75rem',
                                  }}
                                />
                              </TableCell>
                              <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography sx={{ mr: 1 }}>{maintenance.estimatedCost}</Typography>
                                  <Chip
                                    label={maintenance.priority}
                                    size="small"
                                    sx={{
                                      bgcolor: `${getPriorityColor(maintenance.priority)}20`,
                                      color: getPriorityColor(maintenance.priority),
                                      border: `1px solid ${getPriorityColor(maintenance.priority)}40`,
                                      fontSize: '0.7rem',
                                      textTransform: 'capitalize',
                                    }}
                                  />
                                </Box>
                              </TableCell>
                            </TableRow>
                          </Slide>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Performance Chart */}
          <Grid item xs={12}>
            <Grow in={true} timeout={1400}>
              <Card
                sx={{
                  background: 'rgba(26, 26, 26, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 255, 136, 0.2)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                      Rendimiento de la Flota
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <IconButton size="small" sx={{ color: '#888' }}>
                        <Download />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#888' }}>
                        <Assessment />
                      </IconButton>
                    </Stack>
                  </Box>
                  
                  {/* Mock Chart Area */}
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Timeline sx={{ fontSize: 48, color: '#00ff88', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                        Gráfico de Rendimiento
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#888' }}>
                        Visualización de métricas de rendimiento de la flota
                      </Typography>
                      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Chip label="Eficiencia: 94%" sx={{ bgcolor: '#6bcf7f20', color: '#6bcf7f', border: '1px solid #6bcf7f40' }} />
                        <Chip label="Disponibilidad: 96%" sx={{ bgcolor: '#4dabf720', color: '#4dabf7', border: '1px solid #4dabf740' }} />
                        <Chip label="Costo/km: $0.45" sx={{ bgcolor: '#ffd93d20', color: '#ffd93d', border: '1px solid #ffd93d40' }} />
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>
      </Container>

      {/* Global Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
};

export default DashboardProfessional;
