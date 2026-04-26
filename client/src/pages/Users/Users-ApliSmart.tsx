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
  Toolbar
} from '@mui/material';
import {
  People,
  Add,
  Search,
  Edit,
  Delete,
  MoreVert,
  FileDownload,
  FileUpload,
  Print,
  ContentCopy,
  LocationOn,
  Phone,
  Email,
  Person,
  CheckCircle,
  Warning,
  Block,
  Business
} from '@mui/icons-material';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  nombre: string;
  documento: string;
  laboral: string;
  acceso: string;
  contacto: string;
  estado: 'activo' | 'pendiente' | 'bloqueado';
  rol: string;
  email: string;
  telefono: string;
  sede: string;
}

interface UserStats {
  total: number;
  activos: number;
  pendientes: number;
  bloqueados: number;
}

const UsersApliSmart: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    total: 0,
    activos: 0,
    pendientes: 0,
    bloqueados: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simular datos de usuarios (en producción vendrían de la API)
      const mockUsers: User[] = [
        {
          id: '1',
          nombre: 'PRUEBA BOOT',
          documento: '0999992256',
          laboral: 'Vuela Matriz VISTA Personal Administrativo',
          acceso: 'prueba2256 vitomen@gmail.com Administración y configuración',
          contacto: '0952631452 Sin foto',
          estado: 'activo',
          rol: 'Personal Administrativo',
          email: 'prueba2256@vitomen.com',
          telefono: '0952631452',
          sede: 'Vuela Matriz'
        },
        {
          id: '2',
          nombre: 'Leidy Narvaez',
          documento: '099999999',
          laboral: 'Vuela Matriz Administrativo Gerente',
          acceso: 'leidynarvaez9999 artec.supervisora@gmail.com Control ejecutivo total',
          contacto: '0968219664 Sin foto',
          estado: 'activo',
          rol: 'Gerente',
          email: 'leidynarvaez9999@artec.supervisora.com',
          telefono: '0968219664',
          sede: 'Vuela Matriz'
        },
        {
          id: '3',
          nombre: 'Juan Pérez',
          documento: '0987654321',
          laboral: 'Vuela Sucursal Norte Operativo Técnico',
          acceso: 'juanperez@vuela.com Mantenimiento y reparación',
          contacto: '0971234567 Sin foto',
          estado: 'activo',
          rol: 'Técnico',
          email: 'juanperez@vuela.com',
          telefono: '0971234567',
          sede: 'Vuela Sucursal Norte'
        },
        {
          id: '4',
          nombre: 'María González',
          documento: '0955557777',
          laboral: 'Vuela Matriz Administrativo Asistente',
          acceso: 'mariagonzalez@vuela.com Soporte administrativo',
          contacto: '0998889999 Sin foto',
          estado: 'pendiente',
          rol: 'Asistente',
          email: 'mariagonzalez@vuela.com',
          telefono: '0998889999',
          sede: 'Vuela Matriz'
        }
      ];

      setUsers(mockUsers);
      
      // Calcular estadísticas
      const stats = mockUsers.reduce((acc, user) => {
        acc.total++;
        if (user.estado === 'activo') acc.activos++;
        else if (user.estado === 'pendiente') acc.pendientes++;
        else if (user.estado === 'bloqueado') acc.bloqueados++;
        return acc;
      }, { total: 0, activos: 0, pendientes: 0, bloqueados: 0 });

      setUserStats(stats);

    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError('Error al cargar los usuarios');
      toast.error('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleEditUser = () => {
    if (selectedUser) {
      toast.success(`Editar usuario: ${selectedUser.nombre}`);
    }
    handleMenuClose();
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      toast.success(`Eliminar usuario: ${selectedUser.nombre}`);
    }
    handleMenuClose();
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'bloqueado':
        return 'error';
      default:
        return 'default';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'activo':
        return <CheckCircle sx={{ fontSize: 16 }} />;
      case 'pendiente':
        return <Warning sx={{ fontSize: 16 }} />;
      case 'bloqueado':
        return <Block sx={{ fontSize: 16 }} />;
      default:
        return <Person sx={{ fontSize: 16 }} />;
    }
  };

  const filteredUsers = users.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.documento.includes(searchTerm) ||
    user.laboral.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Cargando usuarios...
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
        <Link color="inherit" href="/access">
          Accesos
        </Link>
        <Typography color="text.primary">Usuarios</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: '#333' }}>
          Usuarios
        </Typography>
      </Box>

      {/* Description */}
      <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
        Alta más compacta de colaboradores y credenciales, conectada al catálogo real de sedes.
      </Typography>

      {/* Tarjetas de Estadísticas */}
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
                    Usuarios
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {userStats.total}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Base total
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  width: 56, 
                  height: 56 
                }}>
                  <People sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                    Activos
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {userStats.activos}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Operación diaria
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  width: 56, 
                  height: 56 
                }}>
                  <CheckCircle sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                    Pendientes
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {userStats.pendientes}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Falta completar alta
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
            background: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                    Bloqueados
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {userStats.bloqueados}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Acceso suspendido
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  width: 56, 
                  height: 56 
                }}>
                  <Block sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Base de colaboradores */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {/* Toolbar */}
          <Toolbar sx={{ 
            backgroundColor: '#f8f9fa', 
            borderBottom: '1px solid #e0e0e0',
            minHeight: 64
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                sx={{ 
                  backgroundColor: '#4caf50',
                  '&:hover': { backgroundColor: '#45a049' }
                }}
              >
                Nuevo colaborador
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Business />}
                sx={{ borderColor: '#2196f3', color: '#2196f3' }}
              >
                Gestionar sedes
              </Button>

              <Box sx={{ flexGrow: 1 }} />

              <Tooltip title="Copiar">
                <IconButton>
                  <ContentCopy />
                </IconButton>
              </Tooltip>

              <Tooltip title="Exportar CSV">
                <IconButton>
                  <FileDownload />
                </IconButton>
              </Tooltip>

              <Tooltip title="Exportar Excel">
                <IconButton>
                  <FileDownload />
                </IconButton>
              </Tooltip>

              <Tooltip title="Exportar PDF">
                <IconButton>
                  <FileDownload />
                </IconButton>
              </Tooltip>

              <Tooltip title="Imprimir">
                <IconButton>
                  <Print />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>

          {/* Search */}
          <Box sx={{ p: 2, backgroundColor: '#fafafa' }}>
            <TextField
              fullWidth
              placeholder="Buscar por documento, nombre, sede o c..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: 2
                }
              }}
            />
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Colaborador</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Documento</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Laboral</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Acceso</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Contacto</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: '#1976d2' }}>
                          {user.nombre.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {user.nombre}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.documento}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {user.laboral}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                          {user.email}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {user.rol}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone sx={{ fontSize: 14, color: '#666' }} />
                        <Typography variant="body2">
                          {user.telefono}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#999' }}>
                          Sin foto
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getEstadoIcon(user.estado)}
                        label={user.estado.charAt(0).toUpperCase() + user.estado.slice(1)}
                        size="small"
                        color={getEstadoColor(user.estado) as any}
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, user)}
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

      {/* Menu Actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 150 }
        }}
      >
        <MenuItem onClick={handleEditUser}>
          <Edit sx={{ mr: 2, fontSize: 20 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={handleDeleteUser}>
          <Delete sx={{ mr: 2, fontSize: 20 }} />
          Eliminar
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UsersApliSmart;
