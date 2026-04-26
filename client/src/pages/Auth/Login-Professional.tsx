// @ts-nocheck
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Avatar,
  Container,
  Grid,
  Fade,
  Slide,
  IconButton,
  InputAdornment,
  LinearProgress,
  Alert,
  Paper,
  Divider,
  Chip,
  Stack
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login as LoginIcon,
  Speed,
  Build,
  Settings,
  TrendingUp,
  GetApp,
  Android,
  Apple
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const LoginProfessional: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Por favor complete todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      toast.success('¡Bienvenido a Torquesmart!');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      toast.error('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(0, 255, 136, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 255, 136, 0.05) 0%, transparent 50%)',
          animation: 'pulse 4s ease-in-out infinite',
        }
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(0, 255, 136, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(0, 255, 136, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Branding */}
          <Grid item xs={12} md={6}>
            <Slide direction="right" in={true} timeout={1000}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' }, color: '#fff' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: '#00ff88',
                      color: '#000',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      mr: 2,
                      boxShadow: '0 8px 32px rgba(0, 255, 136, 0.3)',
                    }}
                  >
                    T
                  </Avatar>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#00ff88', mb: 0.5 }}>
                      Torquesmart
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#888', fontWeight: 400 }}>
                      Fleet Management System
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                  Potencia y Control en tu Flota Vehicular
                </Typography>

                <Typography variant="body1" sx={{ color: '#ccc', mb: 4, lineHeight: 1.8 }}>
                  Sistema integral de gestión de flota con monitoreo en tiempo real, 
                  mantenimiento predictivo y análisis avanzado de rendimiento.
                </Typography>

                <Stack spacing={3} sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#00ff88' }}>
                    <Speed sx={{ mr: 2, fontSize: 28 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>Monitoreo en Tiempo Real</Typography>
                      <Typography variant="body2" sx={{ color: '#888' }}>Seguimiento 24/7 de tu flota</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#00ff88' }}>
                    <Build sx={{ mr: 2, fontSize: 28 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>Mantenimiento Predictivo</Typography>
                      <Typography variant="body2" sx={{ color: '#888' }}>Alertas inteligentes y programación</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#00ff88' }}>
                    <TrendingUp sx={{ mr: 2, fontSize: 28 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>Análisis Avanzado</Typography>
                      <Typography variant="body2" sx={{ color: '#888' }}>Reportes y métricas detalladas</Typography>
                    </Box>
                  </Box>
                </Stack>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Chip 
                    label="Seguridad de Nivel Enterprise" 
                    sx={{ 
                      bgcolor: '#00ff8820', 
                      color: '#00ff88', 
                      border: '1px solid #00ff8840',
                      fontWeight: 500
                    }} 
                  />
                  <Chip 
                    label="99.9% Uptime" 
                    sx={{ 
                      bgcolor: '#00ff8820', 
                      color: '#00ff88', 
                      border: '1px solid #00ff8840',
                      fontWeight: 500
                    }} 
                  />
                </Box>
              </Box>
            </Slide>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
            <Slide direction="left" in={true} timeout={1000}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card
                  sx={{
                    width: '100%',
                    maxWidth: 480,
                    background: 'rgba(26, 26, 26, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0, 255, 136, 0.2)',
                    borderRadius: 4,
                    boxShadow: '0 24px 64px rgba(0, 0, 0, 0.4), 0 0 120px rgba(0, 255, 136, 0.1)',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: 4,
                      background: 'linear-gradient(90deg, #00ff88 0%, #00cc6a 50%, #00ff88 100%)',
                      backgroundSize: '200% 100%',
                      animation: 'gradient 3s ease infinite',
                    }}
                  />
                  
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          bgcolor: '#00ff88',
                          color: '#000',
                          margin: '0 auto 16px',
                          fontSize: '24px',
                          fontWeight: 'bold',
                          boxShadow: '0 8px 32px rgba(0, 255, 136, 0.3)',
                        }}
                      >
                        <LoginIcon sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 1 }}>
                        Bienvenido de Nuevo
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#888' }}>
                        Ingresa tus credenciales para acceder al sistema
                      </Typography>
                    </Box>

                    {error && (
                      <Fade in={!!error}>
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                          {error}
                        </Alert>
                      </Fade>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
                      <TextField
                        fullWidth
                        label="Correo Electrónico"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{
                          mb: 3,
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                              borderRadius: 2,
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(0, 255, 136, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#00ff88',
                              boxShadow: '0 0 0 3px rgba(0, 255, 136, 0.1)',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#888',
                            '&.Mui-focused': {
                              color: '#00ff88',
                            },
                          },
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email sx={{ color: '#888', fontSize: 20 }} />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Contraseña"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{
                          mb: 3,
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                              borderRadius: 2,
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(0, 255, 136, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#00ff88',
                              boxShadow: '0 0 0 3px rgba(0, 255, 136, 0.1)',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#888',
                            '&.Mui-focused': {
                              color: '#00ff88',
                            },
                          },
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock sx={{ color: '#888', fontSize: 20 }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleTogglePasswordVisibility}
                                edge="end"
                                sx={{ color: '#888' }}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />

                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? null : <LoginIcon />}
                        sx={{
                          py: 1.5,
                          fontSize: '16px',
                          fontWeight: 600,
                          background: 'linear-gradient(45deg, #00ff88 0%, #00cc6a 100%)',
                          color: '#000',
                          borderRadius: 2,
                          textTransform: 'none',
                          boxShadow: '0 8px 24px rgba(0, 255, 136, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #00cc6a 0%, #00ff88 100%)',
                            boxShadow: '0 12px 32px rgba(0, 255, 136, 0.4)',
                          },
                          '&:disabled': {
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: '#666',
          }
                        }}
                      >
                        {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
                      </Button>
                    </Box>

                    {loading && (
                      <LinearProgress
                        sx={{
                          mb: 2,
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #00ff88 0%, #00cc6a 100%)',
                          },
                        }}
                      />
                    )}

                    <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                      <Typography variant="body2" sx={{ color: '#888' }}>
                        Información de Acceso
                      </Typography>
                    </Divider>

                    <Paper
                      sx={{
                        p: 2,
                        background: 'rgba(0, 255, 136, 0.05)',
                        border: '1px solid rgba(0, 255, 136, 0.2)',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>
                        <strong>Email:</strong> admin@fleet.com
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#ccc' }}>
                        <strong>Contraseña:</strong> admin123
                      </Typography>
                    </Paper>

                    {/* Download App Section */}
                    <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                      <Typography variant="body2" sx={{ color: '#888' }}>
                        Descargar App Móvil
                      </Typography>
                    </Divider>

                    <Stack spacing={2} sx={{ mb: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={<Android />}
                        onClick={async (e) => {
                          e.preventDefault();
                          console.log('Botón Android presionado');
                          
                          // Debug: Mostrar información del dispositivo
                          const userAgent = navigator.userAgent;
                          const isAndroid = /Android/.test(userAgent);
                          console.log('UserAgent:', userAgent);
                          console.log('Es Android:', isAndroid);
                          
                          // Mostrar mensaje inmediato para confirmar que funciona
                          alert('🤖 Botón Android funcionando. Procesando...');
                          
                          // Abrir directamente la URL para Android
                          const url = 'http://192.168.0.18:8080';
                          
                          try {
                            // Intentar abrir en nueva ventana
                            const newWindow = window.open(url, '_blank');
                            
                            if (newWindow && !newWindow.closed) {
                              console.log('Ventana abierta exitosamente');
                              
                              // Mostrar instrucciones después de abrir
                              setTimeout(() => {
                                const instructions = `
🤖 INSTALAR EN ANDROID:

1️⃣ Abre CHROME en tu celular Android
2️⃣ Visita: ${url}
3️⃣ Toca los 3 PUNTOS (⋮) arriba derecha
4️⃣ Selecciona "Instalar aplicación" o "Add to Home screen"
5️⃣ Toca "Instalar" o "Add"

✅ La app aparecerá en tu pantalla de inicio
✅ Funciona sin conexión a internet
✅ Recibirás notificaciones push
✅ Acceso a cámara y GPS

⚠️ IMPORTANTE: Usa CHROME (no otro navegador)
⚠️ Conecta a la misma WiFi que la computadora
                                `;
                                
                                navigator.clipboard.writeText(instructions);
                                alert('📋 Instrucciones copiadas al portapapeles. Sigue los pasos en Chrome.');
                              }, 1000);
                            } else {
                              // Si no se puede abrir nueva ventana, redirigir
                              console.log('Redirigiendo a la URL...');
                              window.location.href = url;
                            }
                          } catch (error) {
                            console.error('Error al abrir:', error);
                            // Fallback: redirigir directamente
                            window.location.href = url;
                          }
                        }}
                        sx={{
                          background: 'linear-gradient(45deg, #4CAF50 0%, #45a049 100%)',
                          color: '#fff',
                          fontWeight: 600,
                          py: 1.5,
                          borderRadius: 2,
                          fontSize: '1rem',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #45a049 0%, #4CAF50 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)',
                          }
                        }}
                      >
                        Descargar para Android
                      </Button>

                      <Button
                        variant="contained"
                        startIcon={<Apple />}
                        onClick={() => {
                          // iOS-specific installation process
                          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                          
                          if (isIOS) {
                            // For iOS devices - show detailed instructions
                            const instructions = `
📱 INSTALAR EN iOS:

1️⃣ Abre SAFARI en tu iPhone/iPad
2️⃣ Visita: http://192.168.0.18:8080
3️⃣ Toca el ícono de COMPARTIR (📤) abajo
4️⃣ Selecciona "Agregar a pantalla de inicio"
5️⃣ Toca "Agregar" para confirmar

✅ La app aparecerá en tu pantalla de inicio
✅ Funciona sin conexión a internet
✅ Recibirás notificaciones push

⚠️ IMPORTANTE: Usa SAFARI (no Chrome)
⚠️ Conecta a la misma WiFi que la computadora
                            `;
                            
                            // Copy instructions to clipboard for easy reference
                            navigator.clipboard.writeText(instructions);
                            alert('Instrucciones copiadas al portapapeles. Ahora abre Safari y sigue los pasos.');
                            
                            // Open in Safari (iOS devices)
                            window.location.href = 'http://192.168.0.18:8080';
                          } else {
                            // For non-iOS devices - show iOS instructions
                            const instructions = `
📱 PARA INSTALAR EN iOS:

1️⃣ En un iPhone/iPad, abre SAFARI
2️⃣ Visita: http://192.168.0.18:8080
3️⃣ Toca COMPARTIR (📤) → "Agregar a pantalla de inicio"
4️⃣ Confirma y listo!

✅ App nativa gratuita
✅ Funciona offline
✅ Notificaciones y cámara
                            `;
                            alert(instructions);
                          }
                        }}
                        sx={{
                          background: 'linear-gradient(45deg, #000000 0%, #1a1a1a 100%)',
                          color: '#fff',
                          fontWeight: 600,
                          py: 1.5,
                          borderRadius: 2,
                          fontSize: '1rem',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #1a1a1a 0%, #000000 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                          }
                        }}
                      >
                        Descargar para iOS
                      </Button>
                    </Stack>

                    <Paper
                      sx={{
                        p: 2,
                        background: 'rgba(0, 255, 136, 0.05)',
                        border: '1px solid rgba(0, 255, 136, 0.2)',
                        borderRadius: 2,
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="body2" sx={{ color: '#00ff88', mb: 1, fontWeight: 600 }}>
                        📱 App Nativa Gratuita
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#ccc', display: 'block', mb: 1 }}>
                        Funciona offline • Notificaciones • Cámara • GPS
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#888', mb: 1 }}>
                        Conecta tu celular a la misma red WiFi
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#ff6b6b', fontWeight: 600, display: 'block', mb: 0.5 }}>
                        ⚠️ iOS: Usa SAFARI (no Chrome)
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#4CAF50', fontWeight: 600 }}>
                        ⚠️ Android: Usa CHROME (no otro navegador)
                      </Typography>
                    </Paper>

                  </CardContent>
                </Card>
              </Box>
            </Slide>
          </Grid>
        </Grid>
      </Container>

      {/* Global Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </Box>
  );
};

export default LoginProfessional;
