// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Grid,
  Fade,
  Slide,
  Container,
  Tooltip,
  Menu,
  MenuItem,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material';
import {
  Person,
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  FilterList,
  MoreVert,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Email,
  Phone,
  AdminPanelSettings,
  Settings
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  documentType: 'dni' | 'passport' | 'license';
  documentNumber: string;
  role: 'admin' | 'operator' | 'mechanic';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin?: string;
}

class UserStorage {
  static getUsers(): User[] {
    const users = localStorage.getItem('torquesmart_users');
    return users ? JSON.parse(users) : this.getDefaultUsers();
  }

  static saveUser(user: Omit<User, 'id' | 'createdAt'>) {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('torquesmart_users', JSON.stringify(users));
  }

  static updateUser(id: string, updates: Partial<User>) {
    const users = this.getUsers();
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem('torquesmart_users', JSON.stringify(users));
    }
  }

  static deleteUser(id: string) {
    const users = this.getUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    localStorage.setItem('torquesmart_users', JSON.stringify(filteredUsers));
  }

  static getUserStats() {
    const users = this.getUsers();
    return {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      inactive: users.filter(u => u.status === 'inactive').length,
      pending: users.filter(u => u.status === 'pending').length,
      admins: users.filter(u => u.role === 'admin').length,
      operators: users.filter(u => u.role === 'operator').length,
      mechanics: users.filter(u => u.role === 'mechanic').length
    };
  }

  static getDefaultUsers(): User[] {
    return [
      {
        id: '1',
        name: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@torquesmart.com',
        phone: '+1 234-567-8901',
        address: 'Calle Principal #123',
        city: 'Ciudad Central',
        country: 'Argentina',
        dateOfBirth: '1985-06-15',
        gender: 'male',
        documentType: 'dni',
        documentNumber: '20.123.456',
        role: 'admin',
        status: 'active',
        createdAt: '2024-01-15T10:00:00Z',
        lastLogin: '2024-04-25T09:30:00Z'
      },
      {
        id: '2',
        name: 'María',
        lastName: 'González',
        email: 'maria.gonzalez@torquesmart.com',
        phone: '+1 234-567-8902',
        address: 'Avenida Secundaria #456',
        city: 'Ciudad Norte',
        country: 'Argentina',
        dateOfBirth: '1990-03-22',
        gender: 'female',
        documentType: 'dni',
        documentNumber: '25.789.012',
        role: 'operator',
        status: 'active',
        createdAt: '2024-02-20T14:15:00Z',
        lastLogin: '2024-04-24T16:45:00Z'
      },
      {
        id: '3',
        name: 'Carlos',
        lastName: 'Rodríguez',
        email: 'carlos.rodriguez@torquesmart.com',
        phone: '+1 234-567-8903',
        address: 'Boulevard Este #789',
        city: 'Ciudad Sur',
        country: 'Argentina',
        dateOfBirth: '1988-11-08',
        gender: 'male',
        documentType: 'dni',
        documentNumber: '30.456.789',
        role: 'mechanic',
        status: 'pending',
        createdAt: '2024-03-10T11:30:00Z'
      }
    ];
  }
}

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUserDialogOpen, setNewUserDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    documentType: 'dni' as 'dni' | 'passport' | 'license',
    documentNumber: '',
    role: 'operator' as 'admin' | 'operator' | 'mechanic',
    status: 'active' as 'active' | 'inactive' | 'pending'
  });

  useEffect(() => {
    loadUsers();
    
    // Listen for custom event to open new user dialog
    const handleOpenDialog = () => {
      setNewUserDialogOpen(true);
    };
    
    window.addEventListener('openNewUserDialog', handleOpenDialog);
    
    return () => {
      window.removeEventListener('openNewUserDialog', handleOpenDialog);
    };
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterStatus, filterRole]);

  const loadUsers = () => {
    setLoading(true);
    try {
      const storedUsers = UserStorage.getUsers();
      setUsers(storedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => user.status === filterStatus);
    }

    // Filter by role
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    setFilteredUsers(filtered);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      UserStorage.deleteUser(selectedUser.id);
      loadUsers();
      handleMenuClose();
    }
  };

  const handleNewUser = () => {
    setNewUserDialogOpen(true);
  };

  const handleNewUserClose = () => {
    setNewUserDialogOpen(false);
    setFormData({
      name: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      dateOfBirth: '',
      gender: 'male',
      documentType: 'dni',
      documentNumber: '',
      role: 'operator',
      status: 'active'
    });
  };

  const handleSaveNewUser = () => {
    // Validate required fields
    if (!formData.name || !formData.lastName || !formData.email || !formData.phone || 
        !formData.address || !formData.city || !formData.country || !formData.dateOfBirth ||
        !formData.documentNumber) {
      alert('Por favor complete todos los campos obligatorios: Nombre, Apellido, Email, Teléfono, Dirección, Ciudad, País, Fecha de Nacimiento y Número de Documento');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Por favor ingrese un email válido');
      return;
    }

    // Validate age (must be at least 18 years old)
    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      alert('El usuario debe ser mayor de 18 años');
      return;
    }

    // Create new user object
    const newUser = {
      ...formData,
      id: Date.now().toString(), // Generate unique ID
      createdAt: new Date().toISOString()
    };

    try {
      UserStorage.saveUser(newUser);
      loadUsers(); // Refresh the user list
      handleNewUserClose(); // Close dialog
      
      // Show success message
      alert('¡Usuario registrado exitosamente!');
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error al guardar el usuario. Por favor intente nuevamente.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#6bcf7f';
      case 'inactive': return '#ff6b6b';
      case 'pending': return '#ffa726';
      default: return '#868e96';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle fontSize="small" />;
      case 'inactive': return <ErrorIcon fontSize="small" />;
      case 'pending': return <Warning fontSize="small" />;
      default: return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#ff6b6b';
      case 'operator': return '#00ff88';
      case 'mechanic': return '#00ccff';
      default: return '#868e96';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'operator': return 'Operador';
      case 'mechanic': return 'Mecánico';
      default: return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <AdminPanelSettings fontSize="small" />;
      case 'operator': return <Person fontSize="small" />;
      case 'mechanic': return <Settings fontSize="small" />;
      default: return null;
    }
  };

  const stats = UserStorage.getUserStats();

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
        }
      }}
    >
      {/* Animated Background Elements */}
      <Box sx={{ position: 'relative', zIndex: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ 
            color: '#fff', 
            fontWeight: 700, 
            mb: 2,
            background: 'linear-gradient(45deg, #00ff88, #00cc6a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Gestión de Usuarios
          </Typography>
          <Typography variant="body1" sx={{ color: '#888', maxWidth: 600 }}>
            Administra los usuarios del sistema y controla el acceso a las diferentes funcionalidades
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'rgba(26, 26, 26, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 255, 136, 0.2)',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0, 255, 136, 0.2)',
                }
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Avatar sx={{ 
                  bgcolor: '#00ff88', 
                  color: '#000', 
                  mx: 'auto', 
                  mb: 2,
                  width: 56,
                  height: 56
                }}>
                  <Person />
                </Avatar>
                <Typography variant="h4" sx={{ color: '#00ff88', fontWeight: 700 }}>
                  {stats.total}
                </Typography>
                <Typography variant="body2" sx={{ color: '#888' }}>
                  Total Usuarios
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'rgba(26, 26, 26, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(107, 207, 127, 0.2)',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(107, 207, 127, 0.2)',
                }
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Avatar sx={{ 
                  bgcolor: '#6bcf7f', 
                  color: '#000', 
                  mx: 'auto', 
                  mb: 2,
                  width: 56,
                  height: 56
                }}>
                  <CheckCircle />
                </Avatar>
                <Typography variant="h4" sx={{ color: '#6bcf7f', fontWeight: 700 }}>
                  {stats.active}
                </Typography>
                <Typography variant="body2" sx={{ color: '#888' }}>
                  Usuarios Activos
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'rgba(26, 26, 26, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 167, 38, 0.2)',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(255, 167, 38, 0.2)',
                }
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Avatar sx={{ 
                  bgcolor: '#ffa726', 
                  color: '#000', 
                  mx: 'auto', 
                  mb: 2,
                  width: 56,
                  height: 56
                }}>
                  <Warning />
                </Avatar>
                <Typography variant="h4" sx={{ color: '#ffa726', fontWeight: 700 }}>
                  {stats.pending}
                </Typography>
                <Typography variant="body2" sx={{ color: '#888' }}>
                  Pendientes
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'rgba(26, 26, 26, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 107, 107, 0.2)',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(255, 107, 107, 0.2)',
                }
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Avatar sx={{ 
                  bgcolor: '#ff6b6b', 
                  color: '#000', 
                  mx: 'auto', 
                  mb: 2,
                  width: 56,
                  height: 56
                }}>
                  <AdminPanelSettings />
                </Avatar>
                <Typography variant="h4" sx={{ color: '#ff6b6b', fontWeight: 700 }}>
                  {stats.admins}
                </Typography>
                <Typography variant="body2" sx={{ color: '#888' }}>
                  Administradores
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Actions */}
        <Fade in={true} timeout={800}>
          <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                flexGrow: 1,
                maxWidth: 400,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                },
                '& .MuiInputLabel-root': { color: '#888' },
                '& .MuiInputBase-input': { color: '#fff' },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#888' }} />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{
                minWidth: 150,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                },
                '& .MuiInputLabel-root': { color: '#888' },
                '& .MuiInputBase-input': { color: '#fff' },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterList sx={{ color: '#888' }} />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="active">Activos</MenuItem>
              <MenuItem value="inactive">Inactivos</MenuItem>
              <MenuItem value="pending">Pendientes</MenuItem>
            </TextField>

            <TextField
              select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              sx={{
                minWidth: 150,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                },
                '& .MuiInputLabel-root': { color: '#888' },
                '& .MuiInputBase-input': { color: '#fff' },
              }}
            >
              <MenuItem value="all">Todos los roles</MenuItem>
              <MenuItem value="admin">Administradores</MenuItem>
              <MenuItem value="operator">Operadores</MenuItem>
              <MenuItem value="mechanic">Mecánicos</MenuItem>
            </TextField>

            <Button
              variant="contained"
              onClick={handleNewUser}
              sx={{
                background: 'linear-gradient(45deg, #00ff88 0%, #00cc6a 100%)',
                color: '#000',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                borderRadius: 2,
                '&:hover': {
                  background: 'linear-gradient(45deg, #00cc6a 0%, #00ff88 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0, 255, 136, 0.3)',
                }
              }}
              startIcon={<Add />}
            >
              Nuevo Usuario
            </Button>
          </Box>
        </Fade>

        {/* Users Table */}
        <Slide direction="up" in={true} timeout={1000}>
          <Card
            sx={{
              background: 'rgba(26, 26, 26, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            {loading && <LinearProgress />}
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ '& th': { color: '#00ff88', fontWeight: 600 } }}>
                      <TableCell>Usuario</TableCell>
                      <TableCell>Contacto</TableCell>
                      <TableCell>Rol</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Último Acceso</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(0, 255, 136, 0.05)',
                          },
                          '& td': { color: '#fff', borderColor: 'rgba(255, 255, 255, 0.1)' },
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              sx={{
                                bgcolor: getRoleColor(user.role),
                                color: '#000',
                                width: 40,
                                height: 40,
                                mr: 2,
                              }}
                            >
                              {user.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {user.name} {user.lastName}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#888' }}>
                                {user.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <Phone sx={{ fontSize: 16, mr: 1, color: '#888' }} />
                              <Typography variant="body2">{user.phone}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Email sx={{ fontSize: 16, mr: 1, color: '#888' }} />
                              <Typography variant="caption" sx={{ color: '#888' }}>
                                {user.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getRoleIcon(user.role)}
                            <Typography
                              variant="body2"
                              sx={{
                                color: getRoleColor(user.role),
                                fontWeight: 600,
                              }}
                            >
                              {getRoleLabel(user.role)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getStatusIcon(user.status)}
                            <Typography
                              variant="body2"
                              sx={{
                                color: getStatusColor(user.status),
                                fontWeight: 600,
                              }}
                            >
                              {getStatusLabel(user.status)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ color: '#888' }}>
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Nunca'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title="Ver detalles">
                              <IconButton
                                size="small"
                                onClick={() => {/* Handle view */}}
                                sx={{
                                  color: '#888',
                                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                                }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Más opciones">
                              <IconButton
                                size="small"
                                onClick={(e) => handleMenuClick(e, user)}
                                sx={{
                                  color: '#888',
                                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                                }}
                              >
                                <MoreVert fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Slide>

        {/* Context Menu */}
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
          <MenuItem
            onClick={handleMenuClose}
            sx={{
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(0, 255, 136, 0.1)' },
            }}
          >
            <Visibility sx={{ mr: 2, color: '#00ff88' }} />
            Ver Detalles
          </MenuItem>
          <MenuItem
            onClick={handleMenuClose}
            sx={{
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(0, 255, 136, 0.1)' },
            }}
          >
            <Edit sx={{ mr: 2, color: '#00ff88' }} />
            Editar
          </MenuItem>
          <MenuItem
            onClick={handleDeleteUser}
            sx={{
              color: '#ff6b6b',
              '&:hover': { bgcolor: 'rgba(255, 107, 107, 0.1)' },
            }}
          >
            <Delete sx={{ mr: 2 }} />
            Eliminar
          </MenuItem>
        </Menu>

        {/* New User Dialog */}
        <Dialog
          open={newUserDialogOpen}
          onClose={handleNewUserClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: 'rgba(26, 26, 26, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              borderRadius: 3,
            }
          }}
        >
          <DialogTitle sx={{ color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Nuevo Usuario
              </Typography>
              <IconButton onClick={handleNewUserClose} sx={{ color: '#fff' }}>
                ×
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                    },
                    '& .MuiInputLabel-root': { color: '#888' },
                    '& .MuiInputBase-input': { color: '#fff' },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Apellido"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                    },
                    '& .MuiInputLabel-root': { color: '#888' },
                    '& .MuiInputBase-input': { color: '#fff' },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                    },
                    '& .MuiInputLabel-root': { color: '#888' },
                    '& .MuiInputBase-input': { color: '#fff' },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                    },
                    '& .MuiInputLabel-root': { color: '#888' },
                    '& .MuiInputBase-input': { color: '#fff' },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Dirección"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                    },
                    '& .MuiInputLabel-root': { color: '#888' },
                    '& .MuiInputBase-input': { color: '#fff' },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ciudad"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                    },
                    '& .MuiInputLabel-root': { color: '#888' },
                    '& .MuiInputBase-input': { color: '#fff' },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="País"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                    },
                    '& .MuiInputLabel-root': { color: '#888' },
                    '& .MuiInputBase-input': { color: '#fff' },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha de Nacimiento"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  InputLabelProps={{
                    shrink: true,
                    sx: { color: '#888' }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                    },
                    '& .MuiInputBase-input': { color: '#fff' },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#888' }}>Género</InputLabel>
                  <Select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value as 'male' | 'female' | 'other'})}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: '#000000',
                          backdropFilter: 'blur(25px)',
                          border: '1px solid rgba(0, 255, 136, 0.3)',
                          borderRadius: 2,
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                        }
                      }
                    }}
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
                    }}
                  >
                    <MenuItem value="male" sx={{ color: '#fff' }}>Masculino</MenuItem>
                    <MenuItem value="female" sx={{ color: '#fff' }}>Femenino</MenuItem>
                    <MenuItem value="other" sx={{ color: '#fff' }}>Otro</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#888' }}>Tipo de Documento</InputLabel>
                  <Select
                    value={formData.documentType}
                    onChange={(e) => setFormData({...formData, documentType: e.target.value as 'dni' | 'passport' | 'license'})}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: '#000000',
                          backdropFilter: 'blur(25px)',
                          border: '1px solid rgba(0, 255, 136, 0.3)',
                          borderRadius: 2,
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                        }
                      }
                    }}
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
                    }}
                  >
                    <MenuItem value="dni" sx={{ color: '#fff' }}>DNI</MenuItem>
                    <MenuItem value="passport" sx={{ color: '#fff' }}>Pasaporte</MenuItem>
                    <MenuItem value="license" sx={{ color: '#fff' }}>Licencia</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Número de Documento"
                  value={formData.documentNumber}
                  onChange={(e) => setFormData({...formData, documentNumber: e.target.value})}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                    },
                    '& .MuiInputLabel-root': { color: '#888' },
                    '& .MuiInputBase-input': { color: '#fff' },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#888' }}>Rol</InputLabel>
                  <Select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as 'admin' | 'operator' | 'mechanic'})}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: '#000000',
                          backdropFilter: 'blur(25px)',
                          border: '1px solid rgba(0, 255, 136, 0.3)',
                          borderRadius: 2,
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                        }
                      }
                    }}
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
                    }}
                  >
                    <MenuItem value="admin" sx={{ color: '#fff' }}>Administrador</MenuItem>
                    <MenuItem value="operator" sx={{ color: '#fff' }}>Operador</MenuItem>
                    <MenuItem value="mechanic" sx={{ color: '#fff' }}>Mecánico</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#888' }}>Estado</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive' | 'pending'})}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: '#000000',
                          backdropFilter: 'blur(25px)',
                          border: '1px solid rgba(0, 255, 136, 0.3)',
                          borderRadius: 2,
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                        }
                      }
                    }}
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
                    }}
                  >
                    <MenuItem value="active" sx={{ color: '#fff' }}>Activo</MenuItem>
                    <MenuItem value="inactive" sx={{ color: '#fff' }}>Inactivo</MenuItem>
                    <MenuItem value="pending" sx={{ color: '#fff' }}>Pendiente</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Button onClick={handleNewUserClose} sx={{ color: '#888' }}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveNewUser}
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #00ff88 0%, #00cc6a 100%)',
                color: '#000',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(45deg, #00cc6a 0%, #00ff88 100%)',
                }
              }}
            >
              Guardar Usuario
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Users;
