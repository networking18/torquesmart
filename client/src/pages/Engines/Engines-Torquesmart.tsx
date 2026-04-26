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
  Button,
  TextField,
  IconButton,
  Chip,
  LinearProgress,
  Alert,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Breadcrumbs,
  Link,
  InputAdornment,
  Toolbar,
  Tabs,
  Tab,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Divider
} from '@mui/material';
import {
  Build,
  Add,
  Search,
  Edit,
  Delete,
  MoreVert,
  History,
  Settings,
  List,
  Power,
  Speed,
  LocalGasStation,
  Warning,
  CheckCircle,
  Schedule,
  Close,
  Save,
  Cancel
} from '@mui/icons-material';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface Engine {
  id: string;
  codigo: string;
  tipo: string;
  marca: string;
  modelo: string;
  potencia: string;
  estado: string;
  kilometraje: number;
  fechaInstalacion: string;
  ultimoMantenimiento: string;
  proximoMantenimiento: string;
  vehiculoAsignado: string;
}

interface MaintenanceRecord {
  id: string;
  motorId: string;
  tipoMantenimiento: string;
  fecha: string;
  descripcion: string;
  costo: number;
  tecnico: string;
  kilometraje: number;
  estado: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`engine-tabpanel-${index}`}
      aria-labelledby={`engine-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const EnginesTorquesmart: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [engines, setEngines] = useState<Engine[]>([]);
  const [maintenanceHistory, setMaintenanceHistory] = useState<MaintenanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEngine, setSelectedEngine] = useState<Engine | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newEngineDialog, setNewEngineDialog] = useState(false);
  const [maintenanceDialog, setMaintenanceDialog] = useState(false);

  // Form states
  const [newEngine, setNewEngine] = useState({
    codigo: '',
    tipo: '',
    marca: '',
    modelo: '',
    potencia: '',
    kilometraje: 0,
    vehiculoAsignado: ''
  });

  const [newMaintenance, setNewMaintenance] = useState({
    tipoMantenimiento: '',
    descripcion: '',
    costo: 0,
    tecnico: '',
    kilometraje: 0
  });

  useEffect(() => {
    fetchEngines();
    fetchMaintenanceHistory();
  }, []);

  const fetchEngines = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simular datos de motores
      const mockEngines: Engine[] = [
        {
          id: '1',
          codigo: 'MTR-001',
          tipo: 'Diésel',
          marca: 'Cummins',
          modelo: 'ISX15',
          potencia: '600 HP',
          estado: 'activo',
          kilometraje: 125000,
          fechaInstalacion: '2022-01-15',
          ultimoMantenimiento: '2024-03-10',
          proximoMantenimiento: '2024-06-10',
          vehiculoAsignado: 'VOLVO FH16-001'
        },
        {
          id: '2',
          codigo: 'MTR-002',
          tipo: 'Gasolina',
          marca: 'Caterpillar',
          modelo: 'C13',
          potencia: '450 HP',
          estado: 'mantenimiento',
          kilometraje: 98000,
          fechaInstalacion: '2022-03-20',
          ultimoMantenimiento: '2024-04-05',
          proximoMantenimiento: '2024-05-05',
          vehiculoAsignado: 'KENWORTH T680-002'
        },
        {
          id: '3',
          codigo: 'MTR-003',
          tipo: 'Diésel',
          marca: 'Detroit',
          modelo: 'DD15',
          potencia: '500 HP',
          estado: 'activo',
          kilometraje: 87000,
          fechaInstalacion: '2022-06-10',
          ultimoMantenimiento: '2024-02-20',
          proximoMantenimiento: '2024-05-20',
          vehiculoAsignado: 'FREIGHTLINER CASCA-003'
        },
        {
          id: '4',
          codigo: 'MTR-004',
          tipo: 'Híbrido',
          marca: 'Volvo',
          modelo: 'D13TC',
          potencia: '550 HP',
          estado: 'activo',
          kilometraje: 65000,
          fechaInstalacion: '2023-01-05',
          ultimoMantenimiento: '2024-03-25',
          proximoMantenimiento: '2024-06-25',
          vehiculoAsignado: 'VOLVO VNL-004'
        }
      ];

      setEngines(mockEngines);

    } catch (err: any) {
      console.error('Error fetching engines:', err);
      setError('Error al cargar los motores');
      toast.error('Error al cargar los motores');
    } finally {
      setLoading(false);
    }
  };

  const fetchMaintenanceHistory = async () => {
    try {
      // Simular historial de mantenimientos
      const mockHistory: MaintenanceRecord[] = [
        {
          id: '1',
          motorId: '1',
          tipoMantenimiento: 'Mantenimiento Preventivo',
          fecha: '2024-03-10',
          descripcion: 'Cambio de aceite y filtros',
          costo: 850,
          tecnico: 'Juan Pérez',
          kilometraje: 120000,
          estado: 'completado'
        },
        {
          id: '2',
          motorId: '2',
          tipoMantenimiento: 'Reparación Mayor',
          fecha: '2024-04-05',
          descripcion: 'Reparación de sistema de inyección',
          costo: 2500,
          tecnico: 'Carlos Rodríguez',
          kilometraje: 95000,
          estado: 'en_progreso'
        },
        {
          id: '3',
          motorId: '3',
          tipoMantenimiento: 'Inspección General',
          fecha: '2024-02-20',
          descripcion: 'Inspección completa del motor',
          costo: 450,
          tecnico: 'María González',
          kilometraje: 85000,
          estado: 'completado'
        }
      ];

      setMaintenanceHistory(mockHistory);

    } catch (err: any) {
      console.error('Error fetching maintenance history:', err);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, engine: Engine) => {
    setAnchorEl(event.currentTarget);
    setSelectedEngine(engine);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEngine(null);
  };

  const handleNewEngine = () => {
    setNewEngineDialog(true);
  };

  const handleNewMaintenance = () => {
    setMaintenanceDialog(true);
  };

  const handleSaveEngine = () => {
    toast.success('Motor guardado exitosamente');
    setNewEngineDialog(false);
    setNewEngine({
      codigo: '',
      tipo: '',
      marca: '',
      modelo: '',
      potencia: '',
      kilometraje: 0,
      vehiculoAsignado: ''
    });
  };

  const handleSaveMaintenance = () => {
    toast.success('Mantenimiento programado exitosamente');
    setMaintenanceDialog(false);
    setNewMaintenance({
      tipoMantenimiento: '',
      descripcion: '',
      costo: 0,
      tecnico: '',
      kilometraje: 0
    });
  };

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

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'activo':
        return <CheckCircle sx={{ fontSize: 16 }} />;
      case 'mantenimiento':
        return <Build sx={{ fontSize: 16 }} />;
      case 'inactivo':
        return <Warning sx={{ fontSize: 16 }} />;
      default:
        return <Power sx={{ fontSize: 16 }} />;
    }
  };

  const filteredEngines = engines.filter(engine =>
    engine.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    engine.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    engine.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    engine.vehiculoAsignado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Cargando motores...
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
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Typography color="text.primary">Motores</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: '#fff' }}>
          Gestión de Motores
        </Typography>
      </Box>

      {/* Tabs Navigation */}
      <Box sx={{ 
        backgroundColor: '#1a1a1a', 
        borderRadius: 2, 
        mb: 3,
        border: '1px solid #333'
      }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#00ff88',
            },
            '& .MuiTab-root': {
              color: '#ccc',
              '&.Mui-selected': {
                color: '#00ff88',
              }
            }
          }}
        >
          <Tab 
            icon={<List />} 
            label="Lista de Motores" 
            iconPosition="start"
          />
          <Tab 
            icon={<Add />} 
            label="Nuevo Motor" 
            iconPosition="start"
          />
          <Tab 
            icon={<Build />} 
            label="Mantenimiento de Motor" 
            iconPosition="start"
          />
          <Tab 
            icon={<History />} 
            label="Historial de Motor" 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={activeTab} index={0}>
        {/* Lista de Motores */}
        <Card sx={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
          <CardContent sx={{ p: 0 }}>
            {/* Toolbar */}
            <Toolbar sx={{ 
              backgroundColor: '#2a2a2a', 
              borderBottom: '1px solid #333',
              minHeight: 64
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleNewEngine}
                  sx={{ 
                    backgroundColor: '#00ff88',
                    color: '#000',
                    '&:hover': { backgroundColor: '#00cc6a' }
                  }}
                >
                  Nuevo Motor
                </Button>

                <Box sx={{ flexGrow: 1 }} />

                <Tooltip title="Exportar">
                  <IconButton sx={{ color: '#fff' }}>
                    <Power />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Imprimir">
                  <IconButton sx={{ color: '#fff' }}>
                    <Settings />
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>

            {/* Search */}
            <Box sx={{ p: 2, backgroundColor: '#0a0a0a' }}>
              <TextField
                fullWidth
                placeholder="Buscar por código, marca, modelo o vehículo asignado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#888' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#1a1a1a',
                    color: '#fff',
                    border: '1px solid #333',
                    borderRadius: 2,
                    '&:hover': {
                      border: '1px solid #555',
                    },
                    '&.Mui-focused': {
                      border: '1px solid #00ff88',
                    }
                  }
                }}
              />
            </Box>

            {/* Table */}
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#2a2a2a' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Código</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Tipo</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Marca/Modelo</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Potencia</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Kilometraje</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Estado</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Vehículo</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEngines.map((engine) => (
                    <TableRow key={engine.id} hover sx={{ '&:hover': { backgroundColor: '#1a1a1a' } }}>
                      <TableCell sx={{ color: '#ccc', fontWeight: 500 }}>
                        {engine.codigo}
                      </TableCell>
                      <TableCell sx={{ color: '#ccc' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Power sx={{ fontSize: 16, color: '#00ff88' }} />
                          {engine.tipo}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#ccc' }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {engine.marca}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#888' }}>
                            {engine.modelo}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#ccc' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Speed sx={{ fontSize: 16, color: '#ff9800' }} />
                          {engine.potencia}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#ccc' }}>
                        <Typography variant="body2">
                          {engine.kilometraje.toLocaleString()} km
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getEstadoIcon(engine.estado)}
                          label={engine.estado.charAt(0).toUpperCase() + engine.estado.slice(1)}
                          size="small"
                          color={getEstadoColor(engine.estado) as any}
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#ccc' }}>
                        {engine.vehiculoAsignado}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, engine)}
                          sx={{ color: '#fff' }}
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        {/* Nuevo Motor */}
        <Card sx={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
              Registrar Nuevo Motor
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Código del Motor"
                  value={newEngine.codigo}
                  onChange={(e) => setNewEngine({...newEngine, codigo: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2a2a2a',
                      color: '#fff',
                      '& fieldset': {
                        borderColor: '#333',
                      },
                      '&:hover fieldset': {
                        borderColor: '#555',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00ff88',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#888',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#00ff88',
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#888' }}>Tipo de Motor</InputLabel>
                  <Select
                    value={newEngine.tipo}
                    onChange={(e) => setNewEngine({...newEngine, tipo: e.target.value})}
                    sx={{
                      backgroundColor: '#2a2a2a',
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#333',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#555',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00ff88',
                      },
                    }}
                  >
                    <MenuItem value="Diésel">Diésel</MenuItem>
                    <MenuItem value="Gasolina">Gasolina</MenuItem>
                    <MenuItem value="Híbrido">Híbrido</MenuItem>
                    <MenuItem value="Eléctrico">Eléctrico</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Marca"
                  value={newEngine.marca}
                  onChange={(e) => setNewEngine({...newEngine, marca: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2a2a2a',
                      color: '#fff',
                      '& fieldset': {
                        borderColor: '#333',
                      },
                      '&:hover fieldset': {
                        borderColor: '#555',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00ff88',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#888',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#00ff88',
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Modelo"
                  value={newEngine.modelo}
                  onChange={(e) => setNewEngine({...newEngine, modelo: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2a2a2a',
                      color: '#fff',
                      '& fieldset': {
                        borderColor: '#333',
                      },
                      '&:hover fieldset': {
                        borderColor: '#555',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00ff88',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#888',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#00ff88',
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Potencia"
                  value={newEngine.potencia}
                  onChange={(e) => setNewEngine({...newEngine, potencia: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2a2a2a',
                      color: '#fff',
                      '& fieldset': {
                        borderColor: '#333',
                      },
                      '&:hover fieldset': {
                        borderColor: '#555',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00ff88',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#888',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#00ff88',
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Kilometraje Actual"
                  type="number"
                  value={newEngine.kilometraje}
                  onChange={(e) => setNewEngine({...newEngine, kilometraje: parseInt(e.target.value)})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2a2a2a',
                      color: '#fff',
                      '& fieldset': {
                        borderColor: '#333',
                      },
                      '&:hover fieldset': {
                        borderColor: '#555',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00ff88',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#888',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#00ff88',
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Vehículo Asignado"
                  value={newEngine.vehiculoAsignado}
                  onChange={(e) => setNewEngine({...newEngine, vehiculoAsignado: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2a2a2a',
                      color: '#fff',
                      '& fieldset': {
                        borderColor: '#333',
                      },
                      '&:hover fieldset': {
                        borderColor: '#555',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00ff88',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#888',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#00ff88',
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={() => setNewEngineDialog(false)}
                    sx={{ 
                      borderColor: '#555', 
                      color: '#ccc',
                      '&:hover': { borderColor: '#777' }
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSaveEngine}
                    sx={{ 
                      backgroundColor: '#00ff88',
                      color: '#000',
                      '&:hover': { backgroundColor: '#00cc6a' }
                    }}
                  >
                    Guardar Motor
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        {/* Mantenimiento de Motor */}
        <Card sx={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
              Programar Mantenimiento de Motor
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#888' }}>Seleccionar Motor</InputLabel>
                  <Select
                    value={selectedEngine?.id || ''}
                    onChange={(e) => {
                      const engine = engines.find(m => m.id === e.target.value);
                      setSelectedEngine(engine || null);
                    }}
                    sx={{
                      backgroundColor: '#2a2a2a',
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#333',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#555',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00ff88',
                      },
                    }}
                  >
                    {engines.map((engine) => (
                      <MenuItem key={engine.id} value={engine.id}>
                        {engine.codigo} - {engine.marca} {engine.modelo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#888' }}>Tipo de Mantenimiento</InputLabel>
                  <Select
                    value={newMaintenance.tipoMantenimiento}
                    onChange={(e) => setNewMaintenance({...newMaintenance, tipoMantenimiento: e.target.value})}
                    sx={{
                      backgroundColor: '#2a2a2a',
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#333',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#555',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00ff88',
                      },
                    }}
                  >
                    <MenuItem value="preventivo">Mantenimiento Preventivo</MenuItem>
                    <MenuItem value="correctivo">Mantenimiento Correctivo</MenuItem>
                    <MenuItem value="inspeccion">Inspección General</MenuItem>
                    <MenuItem value="reparacion">Reparación Mayor</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción del Mantenimiento"
                  multiline
                  rows={4}
                  value={newMaintenance.descripcion}
                  onChange={(e) => setNewMaintenance({...newMaintenance, descripcion: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2a2a2a',
                      color: '#fff',
                      '& fieldset': {
                        borderColor: '#333',
                      },
                      '&:hover fieldset': {
                        borderColor: '#555',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00ff88',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#888',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#00ff88',
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Costo Estimado"
                  type="number"
                  value={newMaintenance.costo}
                  onChange={(e) => setNewMaintenance({...newMaintenance, costo: parseFloat(e.target.value)})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2a2a2a',
                      color: '#fff',
                      '& fieldset': {
                        borderColor: '#333',
                      },
                      '&:hover fieldset': {
                        borderColor: '#555',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00ff88',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#888',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#00ff88',
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Técnico Asignado"
                  value={newMaintenance.tecnico}
                  onChange={(e) => setNewMaintenance({...newMaintenance, tecnico: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2a2a2a',
                      color: '#fff',
                      '& fieldset': {
                        borderColor: '#333',
                      },
                      '&:hover fieldset': {
                        borderColor: '#555',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00ff88',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#888',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#00ff88',
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Kilometraje Actual"
                  type="number"
                  value={newMaintenance.kilometraje}
                  onChange={(e) => setNewMaintenance({...newMaintenance, kilometraje: parseInt(e.target.value)})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2a2a2a',
                      color: '#fff',
                      '& fieldset': {
                        borderColor: '#333',
                      },
                      '&:hover fieldset': {
                        borderColor: '#555',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00ff88',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#888',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#00ff88',
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={() => setMaintenanceDialog(false)}
                    sx={{ 
                      borderColor: '#555', 
                      color: '#ccc',
                      '&:hover': { borderColor: '#777' }
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSaveMaintenance}
                    sx={{ 
                      backgroundColor: '#00ff88',
                      color: '#000',
                      '&:hover': { backgroundColor: '#00cc6a' }
                    }}
                  >
                    Programar Mantenimiento
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        {/* Historial de Motor */}
        <Card sx={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
          <CardContent sx={{ p: 0 }}>
            <Toolbar sx={{ 
              backgroundColor: '#2a2a2a', 
              borderBottom: '1px solid #333',
              minHeight: 64
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                <Typography variant="h6" sx={{ color: '#fff' }}>
                  Historial de Mantenimientos
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                
                <Tooltip title="Exportar Historial">
                  <IconButton sx={{ color: '#fff' }}>
                    <History />
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>

            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#2a2a2a' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Fecha</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Motor</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Tipo</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Descripción</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Técnico</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Kilometraje</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Costo</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {maintenanceHistory.map((record) => (
                    <TableRow key={record.id} hover sx={{ '&:hover': { backgroundColor: '#1a1a1a' } }}>
                      <TableCell sx={{ color: '#ccc' }}>
                        {record.fecha}
                      </TableCell>
                      <TableCell sx={{ color: '#ccc' }}>
                        {engines.find(e => e.id === record.motorId)?.codigo || 'N/A'}
                      </TableCell>
                      <TableCell sx={{ color: '#ccc' }}>
                        <Chip 
                          label={record.tipoMantenimiento}
                          size="small"
                          sx={{ 
                            backgroundColor: '#00ff8820',
                            color: '#00ff88',
                            border: '1px solid #00ff8840'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#ccc' }}>
                        {record.descripcion}
                      </TableCell>
                      <TableCell sx={{ color: '#ccc' }}>
                        {record.tecnico}
                      </TableCell>
                      <TableCell sx={{ color: '#ccc' }}>
                        {record.kilometraje.toLocaleString()} km
                      </TableCell>
                      <TableCell sx={{ color: '#ccc' }}>
                        ${record.costo.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={record.estado === 'completado' ? 'Completado' : record.estado === 'en_progreso' ? 'En Progreso' : 'Pendiente'}
                          size="small"
                          color={record.estado === 'completado' ? 'success' : record.estado === 'en_progreso' ? 'warning' : 'default'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          backgroundColor: '#00ff88',
          color: '#000',
          '&:hover': { backgroundColor: '#00cc6a' }
        }}
        onClick={() => {
          if (activeTab === 0) handleNewEngine();
          else if (activeTab === 2) handleNewMaintenance();
        }}
      >
        <Add />
      </Fab>

      {/* Menu Actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { 
            minWidth: 180,
            backgroundColor: '#2a2a2a',
            color: '#fff',
            '& .MuiMenuItem-root': {
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.05)'
              }
            }
          }
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <Edit sx={{ mr: 2, fontSize: 20 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Build sx={{ mr: 2, fontSize: 20 }} />
          Mantenimiento
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <History sx={{ mr: 2, fontSize: 20 }} />
          Ver Historial
        </MenuItem>
        <Divider sx={{ backgroundColor: '#333' }} />
        <MenuItem onClick={handleMenuClose}>
          <Delete sx={{ mr: 2, fontSize: 20 }} />
          Eliminar
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default EnginesTorquesmart;
