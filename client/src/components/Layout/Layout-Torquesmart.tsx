import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  Chip,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Build as BuildIcon,
  Power as PowerIcon,
  AcUnit as AcUnitIcon,
  Checklist as ChecklistIcon,
  DirectionsCar as VehiclesIcon,
  Inventory as InventoryIcon,
  Notifications as NotificationsIcon,
  AccountCircle as ProfileIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
  ListAlt as ListAltIcon,
  AddCircle as AddCircleIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 260;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', color: '#00ff88' },
  { text: 'Accesos', icon: <PeopleIcon />, path: '/access', color: '#2196f3' },
  { text: 'Gestión', icon: <SettingsIcon />, path: '/management', color: '#ff9800' },
  { 
    text: 'Motores', 
    icon: <BuildIcon />, 
    path: '/engines', 
    color: '#9c27b0',
    submenu: [
      { text: 'Registrar Motor', icon: <AddCircleIcon />, path: '/engines/register', color: '#ab47bc' },
      { text: 'Lista de Motores', icon: <ListAltIcon />, path: '/engines/list', color: '#ce93d8' }
    ]
  },
  { text: 'Generadores', icon: <PowerIcon />, path: '/generators', color: '#f44336',
    submenu: [
      { text: 'Registrar Generador', icon: <AddCircleIcon />, path: '/generators/register', color: '#ef5350' },
      { text: 'Lista de Generadores', icon: <ListAltIcon />, path: '/generators/list', color: '#e57373' }
    ]
  },
  { text: 'Aires Acondicionados', icon: <AcUnitIcon />, path: '/air-conditioning', color: '#00bcd4',
    submenu: [
      { text: 'Registrar AC', icon: <AddCircleIcon />, path: '/air-conditioning/register', color: '#26c6da' },
      { text: 'Lista de AC', icon: <ListAltIcon />, path: '/air-conditioning/list', color: '#4dd0e1' }
    ]
  },
  { text: 'Stock', icon: <InventoryIcon />, path: '/warehouse', color: '#ff5722',
    submenu: [
      { text: 'Registrar Item', icon: <AddCircleIcon />, path: '/warehouse/register', color: '#ff7043' },
      { text: 'Lista de Stock', icon: <ListAltIcon />, path: '/warehouse', color: '#ff8a65' }
    ]
  },
  { text: 'Checklist', icon: <ChecklistIcon />, path: '/checklist', color: '#607d8b' },
];

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutTorquesmart: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleProfileMenuClose();
  };

  const drawer = (
    <div>
      <Box sx={{ p: 2, textAlign: 'center', backgroundColor: '#1a1a1a' }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#00ff88', mb: 1 }}>
          Torquesmart
        </Typography>
        <Typography variant="caption" display="block" sx={{ color: '#888' }}>
          Potencia y control en tu flota vehicular
        </Typography>
      </Box>
      <Divider sx={{ borderColor: '#333' }} />
      <List sx={{ p: 1, backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
        {menuItems.map((item) => {
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const isExpanded = expandedMenus[item.text] || false;
          const isParentActive = hasSubmenu && item.submenu.some((sub: any) => location.pathname === sub.path);
          const isItemActive = location.pathname === item.path;

          return (
            <React.Fragment key={item.text}>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={isItemActive || isParentActive}
                  onClick={() => {
                    if (hasSubmenu) {
                      setExpandedMenus(prev => ({ ...prev, [item.text]: !prev[item.text] }));
                    } else {
                      navigate(item.path);
                      if (isMobile) setMobileOpen(false);
                    }
                  }}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    '&.Mui-selected': {
                      backgroundColor: `${item.color}25`,
                      borderLeft: `4px solid ${item.color}`,
                      '&:hover': {
                        backgroundColor: `${item.color}35`,
                      }
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.05)',
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: (isItemActive || isParentActive) ? item.color : '#aaa',
                    minWidth: 40
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                      '& .MuiListItemText-primary': {
                        fontWeight: (isItemActive || isParentActive) ? 600 : 400,
                        color: (isItemActive || isParentActive) ? item.color : '#ccc'
                      }
                    }}
                  />
                  {hasSubmenu && (isExpanded ? <ExpandLess sx={{ color: item.color }} /> : <ExpandMore sx={{ color: '#aaa' }} />)}
                </ListItemButton>
              </ListItem>
              
              {hasSubmenu && isExpanded && item.submenu.map((subItem: any) => (
                <ListItem key={subItem.text} disablePadding sx={{ mb: 0.3 }}>
                  <ListItemButton
                    selected={location.pathname === subItem.path}
                    onClick={() => {
                      navigate(subItem.path);
                      if (isMobile) setMobileOpen(false);
                    }}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      pl: 4,
                      '&.Mui-selected': {
                        backgroundColor: `${subItem.color}25`,
                        borderLeft: `4px solid ${subItem.color}`,
                        '&:hover': {
                          backgroundColor: `${subItem.color}35`,
                        }
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.05)',
                      }
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: location.pathname === subItem.path ? subItem.color : '#888',
                      minWidth: 36
                    }}>
                      {subItem.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={subItem.text} 
                      sx={{ 
                        '& .MuiListItemText-primary': {
                          fontWeight: location.pathname === subItem.path ? 600 : 400,
                          color: location.pathname === subItem.path ? subItem.color : '#aaa',
                          fontSize: '0.9rem'
                        }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </React.Fragment>
          );
        })}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: '#0a0a0a' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: '#1a1a1a',
          color: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          borderBottom: '1px solid #333'
        }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' }, color: '#fff' }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Company Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#fff' }}>
              Torquesmart Fleet
            </Typography>
            <Chip 
              label="Operación estable" 
              size="small" 
              sx={{ 
                ml: 1, 
                bgcolor: '#00ff8820', 
                color: '#00ff88',
                border: '1px solid #00ff8840',
                fontSize: '0.7rem',
                height: 24
              }} 
            />
          </Box>

          {/* Alertas Badge */}
          <IconButton color="inherit" onClick={() => navigate('/alerts')} sx={{ mr: 2, color: '#fff' }}>
            <Badge badgeContent={0} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Perfil de Usuario */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ textAlign: 'right', mr: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.2, color: '#fff' }}>
                {user?.nombre || 'Usuario'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#aaa', lineHeight: 1 }}>
                Personal Administrativo
              </Typography>
            </Box>
            <IconButton
              size="small"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              sx={{ color: '#fff' }}
            >
              <Avatar sx={{ width: 36, height: 36, bgcolor: '#00ff88', color: '#000' }}>
                {user?.nombre?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              PaperProps={{
                sx: { 
                  mt: 1, 
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
              <MenuItem onClick={handleProfile}>
                <ListItemIcon sx={{ color: '#fff' }}>
                  <ProfileIcon fontSize="small" />
                </ListItemIcon>
                Mi Perfil
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon sx={{ color: '#fff' }}>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Cerrar Sesión
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: '#1a1a1a',
              borderRight: '1px solid #333'
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: '#1a1a1a',
              borderRight: '1px solid #333'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: '#0a0a0a'
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default LayoutTorquesmart;
