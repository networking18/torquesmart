import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const Expenses: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Gastos
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>
          Módulo de gestión de gastos - En desarrollo
        </Typography>
      </Paper>
    </Box>
  );
};

export default Expenses;
