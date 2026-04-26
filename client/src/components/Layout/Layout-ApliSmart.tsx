import React from 'react';
import { Box } from '@mui/material';

const LayoutApliSmart: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Box>Layout ApliSmart - Componente funcional</Box>
      {children}
    </Box>
  );
};

export default LayoutApliSmart;
