// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Fade,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Chip,
  LinearProgress,
  Stack
} from '@mui/material';
import {
  Close,
  GetApp,
  Smartphone,
  OfflineBolt,
  Notifications,
  Speed,
  CheckCircle
} from '@mui/icons-material';
import PWAUtils, { BeforeInstallPromptEvent } from '../../utils/pwaUtils';

interface PWAInstallPromptProps {
  className?: string;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ className }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [supportedFeatures, setSupportedFeatures] = useState<any>(null);

  useEffect(() => {
    // Initialize PWA utilities
    PWAUtils.init();

    // Check if already installed
    setIsInstalled(PWAUtils.isPWA());

    // Get device info and supported features
    setDeviceInfo(PWAUtils.getDeviceInfo());
    setSupportedFeatures(PWAUtils.getSupportedFeatures());

    // Show install prompt if can install
    const checkInstallable = () => {
      if (PWAUtils.canInstall()) {
        setShowPrompt(true);
      }
    };

    // Check after a delay to allow for proper initialization
    const timer = setTimeout(checkInstallable, 3000);
    
    // Also check on user interaction
    const handleUserInteraction = () => {
      if (PWAUtils.canInstall() && !showPrompt) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('click', handleUserInteraction, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  const handleInstall = async () => {
    try {
      const installed = await PWAUtils.showInstallPrompt();
      if (installed) {
        setIsInstalled(true);
        setShowPrompt(false);
        setShowDialog(false);
        
        // Show success notification
        await PWAUtils.showNotification('¡Torquesmart instalado!', {
          body: 'La aplicación ha sido instalada exitosamente en tu dispositivo.',
          icon: '/icons/icon-192x192.png'
        });
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  const handleLearnMore = () => {
    setShowDialog(true);
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <>
      {/* Floating Install Prompt */}
      <Fade in={showPrompt}>
        <Card
          className={className}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            maxWidth: 320,
            background: 'rgba(26, 26, 26, 0.95)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ 
                  bgcolor: 'rgba(0, 255, 136, 0.2)',
                  color: '#00ff88',
                  width: 40,
                  height: 40
                }}>
                  <GetApp />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ 
                    color: '#00ff88',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}>
                    Instalar Torquesmart
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#888', fontSize: '0.75rem' }}>
                    App nativa gratis
                  </Typography>
                </Box>
              </Box>
              <IconButton 
                size="small" 
                onClick={handleDismiss}
                sx={{ 
                  color: '#888',
                  '&:hover': { color: '#fff' }
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>

            {/* Features */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#fff', mb: 1.5, fontSize: '0.85rem' }}>
                Instala la app para acceder offline y recibir notificaciones:
              </Typography>
              
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <OfflineBolt sx={{ fontSize: 16, color: '#00ff88' }} />
                  <Typography variant="caption" sx={{ color: '#ccc', fontSize: '0.8rem' }}>
                    Funciona sin internet
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Notifications sx={{ fontSize: 16, color: '#00ff88' }} />
                  <Typography variant="caption" sx={{ color: '#ccc', fontSize: '0.8rem' }}>
                    Alertas instantáneas
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Speed sx={{ fontSize: 16, color: '#00ff88' }} />
                  <Typography variant="caption" sx={{ color: '#ccc', fontSize: '0.8rem' }}>
                    Inicio rápido
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                onClick={handleInstall}
                startIcon={<GetApp />}
                sx={{
                  flex: 1,
                  background: 'linear-gradient(45deg, #00ff88 0%, #00cc6a 100%)',
                  color: '#000',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #00cc6a 0%, #00ff88 100%)',
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                Instalar
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleLearnMore}
                sx={{
                  color: '#00ff88',
                  borderColor: 'rgba(0, 255, 136, 0.3)',
                  fontSize: '0.8rem',
                  '&:hover': {
                    borderColor: '#00ff88',
                    bgcolor: 'rgba(0, 255, 136, 0.05)',
                  }
                }}
              >
                Más info
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Fade>

      {/* Learn More Dialog */}
      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(26, 26, 26, 0.95)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center',
          color: '#00ff88',
          fontWeight: 700,
          fontSize: '1.3rem',
          pb: 1
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Smartphone sx={{ 
              fontSize: 48, 
              color: '#00ff88',
              filter: 'drop-shadow(0 0 20px rgba(0, 255, 136, 0.5))'
            }} />
          </Box>
          Instalar Torquesmart como App
        </DialogTitle>
        
        <DialogContent sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body1" sx={{ 
            color: '#fff',
            fontWeight: 500,
            mb: 3,
            fontSize: '1rem'
          }}>
            Transforma tu experiencia con una aplicación nativa
          </Typography>

          {/* Feature Highlights */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <Card sx={{ 
              background: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              p: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <OfflineBolt sx={{ color: '#00ff88', fontSize: 24 }} />
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="subtitle2" sx={{ color: '#00ff88', fontWeight: 600 }}>
                    Acceso Offline
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#ccc' }}>
                    Trabaja sin conexión a internet
                  </Typography>
                </Box>
              </Box>
            </Card>

            <Card sx={{ 
              background: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              p: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Notifications sx={{ color: '#00ff88', fontSize: 24 }} />
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="subtitle2" sx={{ color: '#00ff88', fontWeight: 600 }}>
                    Notificaciones Push
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#ccc' }}>
                    Alertas de mantenimiento y recordatorios
                  </Typography>
                </Box>
              </Box>
            </Card>

            <Card sx={{ 
              background: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              p: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Speed sx={{ color: '#00ff88', fontSize: 24 }} />
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="subtitle2" sx={{ color: '#00ff88', fontWeight: 600 }}>
                    Rendimiento Superior
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#ccc' }}>
                    Inicio instantáneo y navegación fluida
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Box>

          {/* Device Compatibility */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
              Compatible con tu dispositivo:
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label="Chrome" 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(0, 255, 136, 0.2)',
                  color: '#00ff88',
                  fontSize: '0.75rem'
                }} 
              />
              <Chip 
                label="Edge" 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(0, 255, 136, 0.2)',
                  color: '#00ff88',
                  fontSize: '0.75rem'
                }} 
              />
              <Chip 
                label="Safari" 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(0, 255, 136, 0.2)',
                  color: '#00ff88',
                  fontSize: '0.75rem'
                }} 
              />
              <Chip 
                label="Firefox" 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(0, 255, 136, 0.2)',
                  color: '#00ff88',
                  fontSize: '0.75rem'
                }} 
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ 
          justifyContent: 'center',
          p: 3,
          gap: 2
        }}>
          <Button
            onClick={() => setShowDialog(false)}
            variant="outlined"
            sx={{
              color: '#888',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                borderColor: '#fff',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
              }
            }}
          >
            Ahora no
          </Button>
          <Button
            onClick={handleInstall}
            variant="contained"
            startIcon={<GetApp />}
            sx={{
              background: 'linear-gradient(45deg, #00ff88 0%, #00cc6a 100%)',
              color: '#000',
              fontWeight: 600,
              px: 3,
              '&:hover': {
                background: 'linear-gradient(45deg, #00cc6a 0%, #00ff88 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0, 255, 136, 0.3)',
              }
            }}
          >
            Instalar App
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PWAInstallPrompt;
