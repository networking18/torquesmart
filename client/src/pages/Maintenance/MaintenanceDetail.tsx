import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const MaintenanceDetail: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Detalles del Mantenimiento
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>
          Detalles del mantenimiento - En desarrollo
        </Typography>
      </Paper>
    </Box>
  );
};

export default MaintenanceDetail;
