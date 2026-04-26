import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton
} from '@mui/material';
import {
  Build,
  LocalGasStation,
  Speed,
  Add,
  ArrowBack
} from '@mui/icons-material';

const Maintenance: React.FC = () => {
  const navigate = useNavigate();

  const maintenanceOptions = [
    {
      title: 'Cambio de Aceite',
      description: 'Registrar cambios de aceite del fleet',
      icon: <LocalGasStation sx={{ fontSize: 40 }} />,
      color: '#00ff88',
      route: '/maintenance/oil-change'
    },
    {
      title: 'Registro KM Diario',
      description: 'Reportar kilometraje diario de vehículos',
      icon: <Speed sx={{ fontSize: 40 }} />,
      color: '#00cc6a',
      route: '/maintenance/daily-mileage'
    },
    {
      title: 'Otros Mantenimientos',
      description: 'Registrar otros tipos de mantenimiento',
      icon: <Build sx={{ fontSize: 40 }} />,
      color: '#00aa55',
      route: '/maintenance/other'
    }
  ];

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
          <Build />
          Gestión de Mantenimientos
        </Typography>
      </Box>

      {/* Maintenance Options */}
      <Grid container spacing={3}>
        {maintenanceOptions.map((option, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{
                background: 'rgba(26, 26, 26, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 255, 136, 0.2)',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                height: '100%',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 20px 40px rgba(0, 255, 136, 0.2)',
                  border: '1px solid rgba(0, 255, 136, 0.5)'
                }
              }}
              onClick={() => navigate(option.route)}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Box sx={{ 
                  color: option.color, 
                  mb: 2,
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  {option.icon}
                </Box>
                <Typography variant="h6" sx={{ 
                  color: '#fff', 
                  fontWeight: 600, 
                  mb: 2 
                }}>
                  {option.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#888', mb: 3 }}>
                  {option.description}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  sx={{
                    borderColor: `${option.color}66`,
                    color: option.color,
                    '&:hover': {
                      background: `${option.color}22`,
                      borderColor: option.color
                    }
                  }}
                >
                  Acceder
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Stats */}
      <Paper sx={{
        background: 'rgba(26, 26, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        borderRadius: 2,
        p: 3,
        mt: 4
      }}>
        <Typography variant="h6" sx={{ 
          color: '#00ff88', 
          fontWeight: 600, 
          mb: 3 
        }}>
          Resumen de Mantenimientos
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: '#00ff88', fontWeight: 700 }}>
                {JSON.parse(localStorage.getItem('torquesmart_oil_changes') || '[]').length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888' }}>
                Cambios de Aceite
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: '#00cc6a', fontWeight: 700 }}>
                {JSON.parse(localStorage.getItem('torquesmart_daily_mileage') || '[]').length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888' }}>
                Registros de Kilometraje
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: '#00aa55', fontWeight: 700 }}>
                0
              </Typography>
              <Typography variant="body2" sx={{ color: '#888' }}>
                Otros Mantenimientos
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Maintenance;
