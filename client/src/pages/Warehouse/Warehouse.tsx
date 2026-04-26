import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Inventory,
  Add,
  Delete,
  Edit,
  ArrowBack,
  Search,
  TrendingUp,
  Warning,
  CheckCircle
} from '@mui/icons-material';

interface WarehouseItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  unit: string;
  location: string;
  supplier: string;
  lastUpdated: string;
  status: 'normal' | 'low' | 'critical' | 'overstock';
  notes: string;
}

const Warehouse: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<WarehouseItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<WarehouseItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WarehouseItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    minQuantity: '',
    maxQuantity: '',
    unit: '',
    location: '',
    supplier: '',
    notes: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const categories = [
    'Repuestos', 'Aceites', 'Filtros', 'Neumáticos', 
    'Baterías', 'Herramientas', 'Lubricantes', 'Limpiadores',
    'Seguridad', 'Otros'
  ];

  useEffect(() => {
    loadWarehouseData();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm, selectedCategory]);

  const loadWarehouseData = () => {
    const savedData = JSON.parse(localStorage.getItem('torquesmart_warehouse') || '[]');
    setItems(savedData);
  };

  const filterItems = () => {
    let filtered = [...items];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return '#f44336';
      case 'low': return '#ff9800';
      case 'overstock': return '#2196f3';
      default: return '#4caf50';
    }
  };

  const calculateStatus = (item: WarehouseItem): 'normal' | 'low' | 'critical' | 'overstock' => {
    if (item.quantity <= item.minQuantity) return 'critical';
    if (item.quantity <= item.minQuantity * 1.5) return 'low';
    if (item.quantity >= item.maxQuantity) return 'overstock';
    return 'normal';
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.quantity || !formData.unit) {
      setShowError(true);
      return;
    }

    const itemData = {
      id: editingItem?.id || Date.now().toString(),
      ...formData,
      quantity: parseInt(formData.quantity),
      minQuantity: parseInt(formData.minQuantity) || 0,
      maxQuantity: parseInt(formData.maxQuantity) || 100,
      lastUpdated: new Date().toISOString(),
      status: 'normal' as const
    };

    let updatedItems;
    if (editingItem) {
      updatedItems = items.map(item => item.id === editingItem.id ? itemData : item);
    } else {
      updatedItems = [...items, itemData];
    }

    // Update status for all items
    updatedItems = updatedItems.map(item => ({
      ...item,
      status: calculateStatus(item)
    }));

    localStorage.setItem('torquesmart_warehouse', JSON.stringify(updatedItems));
    setItems(updatedItems);
    setDialogOpen(false);
    setShowSuccess(true);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      quantity: '',
      minQuantity: '',
      maxQuantity: '',
      unit: '',
      location: '',
      supplier: '',
      notes: ''
    });
    setEditingItem(null);
  };

  const handleEdit = (item: WarehouseItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity.toString(),
      minQuantity: item.minQuantity.toString(),
      maxQuantity: item.maxQuantity.toString(),
      unit: item.unit,
      location: item.location,
      supplier: item.supplier,
      notes: item.notes
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este item?')) {
      const updatedItems = items.filter(item => item.id !== id);
      localStorage.setItem('torquesmart_warehouse', JSON.stringify(updatedItems));
      setItems(updatedItems);
    }
  };

  const calculateStats = () => {
    const total = items.length;
    const critical = items.filter(item => item.status === 'critical').length;
    const low = items.filter(item => item.status === 'low').length;
    const normal = items.filter(item => item.status === 'normal').length;
    const overstock = items.filter(item => item.status === 'overstock').length;

    return { total, critical, low, normal, overstock };
  };

  const stats = calculateStats();

  return (
    <Box sx={{ 
      p: 3, 
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)', 
      minHeight: '100vh' 
    }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton 
          onClick={() => navigate('/dashboard')}
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
          <Inventory />
          Bodega / Stock
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={2.4}>
          <Card sx={{
            background: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': { transform: 'translateY(-5px)' }
          }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Inventory sx={{ fontSize: 40, color: '#00ff88', mb: 2 }} />
              <Typography variant="h5" sx={{ color: '#00ff88', fontWeight: 700 }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888' }}>
                Total Items
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card sx={{
            background: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(244, 67, 54, 0.3)',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': { transform: 'translateY(-5px)' }
          }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Warning sx={{ fontSize: 40, color: '#f44336', mb: 2 }} />
              <Typography variant="h5" sx={{ color: '#f44336', fontWeight: 700 }}>
                {stats.critical}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888' }}>
                Críticos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card sx={{
            background: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 152, 0, 0.3)',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': { transform: 'translateY(-5px)' }
          }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <TrendingUp sx={{ fontSize: 40, color: '#ff9800', mb: 2 }} />
              <Typography variant="h5" sx={{ color: '#ff9800', fontWeight: 700 }}>
                {stats.low}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888' }}>
                Bajo Stock
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card sx={{
            background: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': { transform: 'translateY(-5px)' }
          }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <CheckCircle sx={{ fontSize: 40, color: '#4caf50', mb: 2 }} />
              <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 700 }}>
                {stats.normal}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888' }}>
                Normal
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Card sx={{
            background: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(33, 150, 243, 0.3)',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': { transform: 'translateY(-5px)' }
          }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <TrendingUp sx={{ fontSize: 40, color: '#2196f3', mb: 2 }} />
              <Typography variant="h5" sx={{ color: '#2196f3', fontWeight: 700 }}>
                {stats.overstock}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888' }}>
                Sobre Stock
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Actions */}
      <Card sx={{
        background: 'rgba(26, 26, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        borderRadius: 2,
        mb: 4
      }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Buscar items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: '#888', mr: 1 }} />,
                }}
                sx={{
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
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                },
                '& .MuiInputLabel-root': { color: '#888' },
              }}>
                <InputLabel sx={{ color: '#888' }}>Categoría</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Categoría"
                >
                  <MenuItem value="all">Todas</MenuItem>
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={5}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setDialogOpen(true)}
                fullWidth
                sx={{
                  background: 'linear-gradient(45deg, #00ff88, #00cc6a)',
                  color: '#000',
                  fontWeight: 600,
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #00ffaa, #00ff88)',
                  }
                }}
              >
                Agregar Item
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Items Table */}
      <Card sx={{
        background: 'rgba(26, 26, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        borderRadius: 2,
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
            <Inventory />
            Inventario de Bodega
          </Typography>
          
          <TableContainer component={Paper} sx={{ background: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Nombre</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Categoría</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Cantidad</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Ubicación</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Estado</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id} sx={{ '&:hover': { background: 'rgba(0, 255, 136, 0.05)' } }}>
                    <TableCell sx={{ color: '#fff' }}>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#888' }}>
                          {item.supplier}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#fff' }}>{item.category}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#fff' }}>
                          {item.quantity} {item.unit}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#888' }}>
                          Min: {item.minQuantity} | Max: {item.maxQuantity}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#fff' }}>{item.location}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.status === 'critical' ? 'Crítico' : 
                              item.status === 'low' ? 'Bajo' :
                              item.status === 'overstock' ? 'Sobre Stock' : 'Normal'}
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
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(item)}
                          sx={{
                            color: '#00ff88',
                            '&:hover': { background: 'rgba(0, 255, 136, 0.1)' }
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(item.id)}
                          sx={{
                            color: '#f44336',
                            '&:hover': { background: 'rgba(244, 67, 54, 0.1)' }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          resetForm();
        }}
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
          <Inventory />
          {editingItem ? 'Editar Item' : 'Agregar Nuevo Item'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre del Item"
                value={formData.name}
                onChange={handleInputChange('name')}
                sx={{
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
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(0, 255, 136, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                },
                '& .MuiInputLabel-root': { color: '#888' },
              }}>
                <InputLabel sx={{ color: '#888' }}>Categoría</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  label="Categoría"
                >
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Cantidad"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange('quantity')}
                sx={{
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
            
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Unidad"
                value={formData.unit}
                onChange={handleInputChange('unit')}
                sx={{
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
            
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Cantidad Mínima"
                type="number"
                value={formData.minQuantity}
                onChange={handleInputChange('minQuantity')}
                sx={{
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
            
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Cantidad Máxima"
                type="number"
                value={formData.maxQuantity}
                onChange={handleInputChange('maxQuantity')}
                sx={{
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
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ubicación"
                value={formData.location}
                onChange={handleInputChange('location')}
                sx={{
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
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Proveedor"
                value={formData.supplier}
                onChange={handleInputChange('supplier')}
                sx={{
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
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notas"
                multiline
                rows={3}
                value={formData.notes}
                onChange={handleInputChange('notes')}
                sx={{
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
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setDialogOpen(false);
              resetForm();
            }}
            sx={{
              color: '#00ff88',
              borderColor: 'rgba(0, 255, 136, 0.5)',
              '&:hover': { background: 'rgba(0, 255, 136, 0.1)' }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            sx={{
              background: 'linear-gradient(45deg, #00ff88, #00cc6a)',
              color: '#000',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(45deg, #00ffaa, #00ff88)',
              }
            }}
          >
            {editingItem ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbars */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="success" sx={{ backgroundColor: '#4caf50', color: '#fff' }}>
          Operación exitosa
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={3000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="error" sx={{ backgroundColor: '#f44336', color: '#fff' }}>
          Complete todos los campos requeridos
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Warehouse;
