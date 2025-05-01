import React, { useEffect } from 'react';
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material';
import FloatingWidgetManager from '../components/widgets/FloatingWidgetManager';
import { useNavigate } from 'react-router-dom';
import { useDashboardWidgets } from '../contexts/DashboardWidgetContext';
import { useApiProviders } from '../contexts/ApiProviderContext';
import { isElectron } from '../services/electronService';

const FloatingWidgetsPage: React.FC = () => {
  const navigate = useNavigate();
  const { widgets } = useDashboardWidgets();
  const { providers } = useApiProviders();

  const configuredProviders = providers.filter(p => p.isConfigured);
  const hasVisibleWidgets = widgets.some(w => w.isVisible);

  // Add electron-environment class to body when in Electron
  useEffect(() => {
    if (isElectron()) {
      document.body.classList.add('electron-environment');
      console.log('Added electron-environment class to body in FloatingWidgetsPage');

      // Force a re-render to ensure proper display in Electron
      const timer = setTimeout(() => {
        console.log('Forcing re-render in FloatingWidgetsPage');
      }, 500);

      return () => {
        document.body.classList.remove('electron-environment');
        clearTimeout(timer);
      };
    }
  }, []);

  return (
    <Box sx={{ height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative' }}>
      {/* Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'background.default',
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(30, 144, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(106, 90, 205, 0.05) 0%, transparent 50%)',
          zIndex: -1
        }}
      />

      {/* Floating Widgets */}
      <FloatingWidgetManager />

      {/* Help Message (shown when no widgets are visible) */}
      {!hasVisibleWidgets && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            maxWidth: 500,
            p: 3
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              background: 'rgba(30, 30, 30, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Typography variant="h5" gutterBottom>
              No Floating Widgets
            </Typography>

            {configuredProviders.length === 0 ? (
              <>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  You need to configure API providers before adding widgets.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/settings/api-keys')}
                  sx={{ mt: 2 }}
                >
                  Configure API Keys
                </Button>
              </>
            ) : (
              <>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Click the + button in the bottom right corner to add widgets.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  You can drag widgets to position them, and use the layout buttons to arrange them automatically.
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate('/dashboard')}
                  sx={{ mt: 2 }}
                >
                  Return to Dashboard
                </Button>
              </>
            )}
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default FloatingWidgetsPage;
