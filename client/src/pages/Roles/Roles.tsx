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
  FormHelperText,
  Checkbox,
  ListItemText
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
  Security,
  AdminPanelSettings,
  Settings,
  Group,
  Shield
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

class RoleStorage {
  static getRoles(): Role[] {
    const roles = localStorage.getItem('torquesmart_roles');
    return roles ? JSON.parse(roles) : this.getDefaultRoles();
  }

  static saveRole(role: Omit<Role, 'id' | 'createdAt'>) {
    const roles = this.getRoles();
    const newRole: Role = {
      ...role,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    roles.push(newRole);
    localStorage.setItem('torquesmart_roles', JSON.stringify(roles));
  }

  static updateRole(id: string, updates: Partial<Role>) {
    const roles = this.getRoles();
    const index = roles.findIndex(role => role.id === id);
    if (index !== -1) {
      roles[index] = { ...roles[index], ...updates };
      localStorage.setItem('torquesmart_roles', JSON.stringify(roles));
    }
  }

  static deleteRole(id: string) {
    const roles = this.getRoles();
    const filteredRoles = roles.filter(role => role.id !== id);
    localStorage.setItem('torquesmart_roles', JSON.stringify(filteredRoles));
  }

  static getRoleStats() {
    const roles = this.getRoles();
    return {
      total: roles.length,
      active: roles.filter(r => r.status === 'active').length,
      inactive: roles.filter(r => r.status === 'inactive').length,
      totalUsers: roles.reduce((sum, role) => sum + role.userCount, 0)
    };
  }

  static getDefaultRoles(): Role[] {
    return [
      {
        id: '1',
        name: 'Administrador',
        description: 'Acceso completo al sistema',
        permissions: ['dashboard', 'vehicles', 'drivers', 'engines', 'access', 'maintenance', 'expenses', 'reports', 'alerts'],
        userCount: 2,
        status: 'active',
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        name: 'Operador',
        description: 'Acceso limitado a operaciones diarias',
        permissions: ['dashboard', 'vehicles', 'drivers', 'maintenance', 'expenses'],
        userCount: 5,
        status: 'active',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '3',
        name: 'Mecánico',
        description: 'Acceso a mantenimiento y vehículos',
        permissions: ['vehicles', 'maintenance'],
        userCount: 3,
        status: 'active',
        createdAt: '2024-01-16T09:00:00Z'
      }
    ];
  }

  static getPermissions(): Permission[] {
    return [
      { id: 'dashboard', name: 'Dashboard', description: 'Ver panel principal', category: 'General' },
      { id: 'vehicles', name: 'Vehículos', description: 'Gestionar vehículos', category: 'Operaciones' },
      { id: 'drivers', name: 'Conductores', description: 'Gestionar conductores', category: 'Operaciones' },
      { id: 'engines', name: 'Motores', description: 'Gestionar motores', category: 'Operaciones' },
      { id: 'access', name: 'Accesos', description: 'Gestionar usuarios y roles', category: 'Administración' },
      { id: 'maintenance', name: 'Mantenimiento', description: 'Gestionar mantenimiento', category: 'Operaciones' },
      { id: 'expenses', name: 'Gastos', description: 'Gestionar gastos', category: 'Finanzas' },
      { id: 'reports', name: 'Reportes', description: 'Ver reportes', category: 'Reportes' },
      { id: 'alerts', name: 'Alertas', description: 'Gestionar alertas', category: 'Operaciones' }
    ];
  }
}

const Roles: React.FC = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [newRoleDialogOpen, setNewRoleDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    loadRoles();
  }, []);

  useEffect(() => {
    filterRoles();
  }, [roles, searchTerm, filterStatus]);

  const loadRoles = () => {
    setLoading(true);
    try {
      const storedRoles = RoleStorage.getRoles();
      setRoles(storedRoles);
    } catch (error) {
      console.error('Error loading roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRoles = () => {
    let filtered = roles;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(role => role.status === filterStatus);
    }

    setFilteredRoles(filtered);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, role: Role) => {
    setAnchorEl(event.currentTarget);
    setSelectedRole(role);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRole(null);
  };

  const handleDeleteRole = () => {
    if (selectedRole) {
      RoleStorage.deleteRole(selectedRole.id);
      loadRoles();
      handleMenuClose();
    }
  };

  const handleNewRole = () => {
    setNewRoleDialogOpen(true);
  };

  const handleNewRoleClose = () => {
    setNewRoleDialogOpen(false);
    setFormData({
      name: '',
      description: '',
      permissions: [],
      status: 'active'
    });
  };

  const handleSaveNewRole = () => {
    if (formData.name && formData.description && formData.permissions.length > 0) {
      RoleStorage.saveRole(formData);
      loadRoles();
      handleNewRoleClose();
      alert('¡Rol creado exitosamente!');
    } else {
      alert('Por favor complete todos los campos obligatorios');
    }
  };

  const handlePermissionChange = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#6bcf7f';
      case 'inactive': return '#ff6b6b';
      default: return '#868e96';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle fontSize="small" />;
      case 'inactive': return <ErrorIcon fontSize="small" />;
      default: return null;
    }
  };

  const stats = RoleStorage.getRoleStats();

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
            Gestión de Roles
          </Typography>
          <Typography variant="body1" sx={{ color: '#888', maxWidth: 600 }}>
            Administra los roles y permisos del sistema para controlar el acceso de los usuarios
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
                  <Security />
                </Avatar>
                <Typography variant="h4" sx={{ color: '#00ff88', fontWeight: 700 }}>
                  {stats.total}
                </Typography>
                <Typography variant="body2" sx={{ color: '#888' }}>
                  Total Roles
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
                  Roles Activos
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
                  <ErrorIcon />
                </Avatar>
                <Typography variant="h4" sx={{ color: '#ff6b6b', fontWeight: 700 }}>
                  {stats.inactive}
                </Typography>
                <Typography variant="body2" sx={{ color: '#888' }}>
                  Roles Inactivos
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'rgba(26, 26, 26, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 204, 255, 0.2)',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0, 204, 255, 0.2)',
                }
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Avatar sx={{ 
                  bgcolor: '#00ccff', 
                  color: '#000', 
                  mx: 'auto', 
                  mb: 2,
                  width: 56,
                  height: 56
                }}>
                  <Group />
                </Avatar>
                <Typography variant="h4" sx={{ color: '#00ccff', fontWeight: 700 }}>
                  {stats.totalUsers}
                </Typography>
                <Typography variant="body2" sx={{ color: '#888' }}>
                  Total Usuarios
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Actions */}
        <Fade in={true} timeout={800}>
          <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Buscar roles..."
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
            </TextField>

            <Button
              variant="contained"
              onClick={handleNewRole}
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
              Nuevo Rol
            </Button>
          </Box>
        </Fade>

        {/* Roles Table */}
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
                      <TableCell>Rol</TableCell>
                      <TableCell>Permisos</TableCell>
                      <TableCell>Usuarios</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRoles.map((role) => (
                      <TableRow
                        key={role.id}
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
                                bgcolor: '#00ff88',
                                color: '#000',
                                width: 40,
                                height: 40,
                                mr: 2,
                              }}
                            >
                              <Shield />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {role.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#888' }}>
                                {role.description}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {role.permissions.slice(0, 3).map((permission) => (
                              <Chip
                                key={permission}
                                label={permission}
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(0, 255, 136, 0.1)',
                                  color: '#00ff88',
                                  border: '1px solid rgba(0, 255, 136, 0.3)',
                                  fontSize: '0.7rem',
                                }}
                              />
                            ))}
                            {role.permissions.length > 3 && (
                              <Chip
                                label={`+${role.permissions.length - 3}`}
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                                  color: '#888',
                                  fontSize: '0.7rem',
                                }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {role.userCount} usuarios
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getStatusIcon(role.status)}
                            <Typography
                              variant="body2"
                              sx={{
                                color: getStatusColor(role.status),
                                fontWeight: 600,
                              }}
                            >
                              {getStatusLabel(role.status)}
                            </Typography>
                          </Box>
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
                                onClick={(e) => handleMenuClick(e, role)}
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
            onClick={handleDeleteRole}
            sx={{
              color: '#ff6b6b',
              '&:hover': { bgcolor: 'rgba(255, 107, 107, 0.1)' },
            }}
          >
            <Delete sx={{ mr: 2 }} />
            Eliminar
          </MenuItem>
        </Menu>

        {/* New Role Dialog */}
        <Dialog
          open={newRoleDialogOpen}
          onClose={handleNewRoleClose}
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
                Nuevo Rol
              </Typography>
              <IconButton onClick={handleNewRoleClose} sx={{ color: '#fff' }}>
                ×
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre del Rol"
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
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#888' }}>Estado</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
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
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
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
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                  Permisos
                </Typography>
                <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                  {RoleStorage.getPermissions().map((permission) => (
                    <MenuItem key={permission.id} sx={{ p: 0 }}>
                      <Checkbox
                        checked={formData.permissions.includes(permission.id)}
                        onChange={() => handlePermissionChange(permission.id)}
                        sx={{
                          color: '#00ff88',
                          '&.Mui-checked': { color: '#00ff88' },
                        }}
                      />
                      <ListItemText
                        primary={permission.name}
                        secondary={permission.description}
                        primaryTypographyProps={{ color: '#fff' }}
                        secondaryTypographyProps={{ color: '#888' }}
                      />
                    </MenuItem>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Button onClick={handleNewRoleClose} sx={{ color: '#888' }}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveNewRole}
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
              Guardar Rol
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Roles;
