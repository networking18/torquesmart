import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const Alerts: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Sistema de Alertas
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>
          Módulo de alertas y notificaciones - En desarrollo
        </Typography>
      </Paper>
    </Box>
  );
};

export default Alerts;
