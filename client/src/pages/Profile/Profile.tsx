import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const Profile: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Mi Perfil
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>
          Perfil de usuario - En desarrollo
        </Typography>
      </Paper>
    </Box>
  );
};

export default Profile;
