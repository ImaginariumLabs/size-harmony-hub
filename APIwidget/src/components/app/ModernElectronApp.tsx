import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  createTheme,
  ThemeProvider,
  CssBaseline,
  IconButton,
  Tooltip
} from '@mui/material';
import { DashboardWidgetProvider } from '../../contexts/DashboardWidgetContext';
import { ApiProviderProvider } from '../../contexts/ApiProviderContext';
import ModernDashboard from '../../pages/ModernDashboard';
import {
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Api as ApiIcon
} from '@mui/icons-material';
import { isElectron } from '../../services/electronService';

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

const ModernElectronApp: React.FC = () => {
  const [showWidget, setShowWidget] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isElectronEnv, setIsElectronEnv] = useState(false);

  // Check if running in Electron
  useEffect(() => {
    const electronEnvironment = isElectron();
    setIsElectronEnv(electronEnvironment);

    // Log environment information
    console.log('Environment:', {
      isElectron: electronEnvironment,
      userAgent: navigator.userAgent,
      platform: navigator.platform
    });

    // Add electron-specific class to body if in Electron
    if (electronEnvironment) {
      document.body.classList.add('electron-environment');
    }

    // Debug message to Electron main process
    if (electronEnvironment && window.electronAPI?.debug) {
      window.electronAPI.debug({
        component: 'ModernElectronApp',
        event: 'initialized',
        data: { electronEnvironment }
      });
    }
  }, []);

  // Toggle widget visibility through Electron API
  const toggleWidgetVisibility = () => {
    if (window.electronAPI) {
      window.electronAPI.toggleWidgetVisibility()
        .then((isVisible) => {
          setShowWidget(isVisible);
        })
        .catch((error) => {
          console.error('Error toggling widget visibility:', error);
        });
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ApiProviderProvider>
        <DashboardWidgetProvider>
          <Box className="electron-app" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Header */}
            <Box
              sx={{
                p: 2,
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(30, 30, 30, 0.7)',
                backdropFilter: 'blur(10px)',
                position: 'sticky',
                top: 0,
                zIndex: 1100,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  color="inherit"
                  onClick={toggleSidebar}
                  sx={{ display: { xs: 'block', md: 'none' } }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                  APIwidget
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showWidget}
                      onChange={() => toggleWidgetVisibility()}
                      color="primary"
                    />
                  }
                  label="Show Floating Widget"
                />
                <Tooltip title="Notifications">
                  <IconButton color="inherit">
                    <NotificationsIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Settings">
                  <IconButton color="inherit">
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Account">
                  <IconButton color="inherit">
                    <AccountCircleIcon />
                  </IconButton>
                </Tooltip>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ApiIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #64b5f6, #2196f3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2196f3, #1976d2)',
                    }
                  }}
                >
                  Add API Key
                </Button>
              </Box>
            </Box>

            {/* Main Content */}
            <Box className="content-area" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
              <ModernDashboard />
            </Box>
          </Box>
        </DashboardWidgetProvider>
      </ApiProviderProvider>
    </ThemeProvider>
  );
};

export default ModernElectronApp;
