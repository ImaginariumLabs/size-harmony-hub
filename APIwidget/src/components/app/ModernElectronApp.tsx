import React, { useState, useEffect } from 'react';
import {
  createTheme,
  ThemeProvider,
  CssBaseline
} from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import { DashboardWidgetProvider } from '../../contexts/DashboardWidgetContext';
import { ApiProviderProvider } from '../../contexts/ApiProviderContext';
import { AuthProvider } from '../../contexts/MockAuthContext';
import ModernDashboard from '../../pages/ModernDashboard';
import ElectronAppLayout from '../layout/ElectronAppLayout';
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

  // Check if running in Electron
  useEffect(() => {
    const electronEnvironment = isElectron();

    // Log environment information
    console.log('Environment:', {
      isElectron: electronEnvironment,
      userAgent: navigator.userAgent,
      windowElectronAPI: window.electronAPI ? 'Available' : 'Not Available',
      windowInnerWidth: window.innerWidth,
      windowInnerHeight: window.innerHeight
    });

    // Add electron-specific class to body if in Electron
    if (electronEnvironment) {
      document.body.classList.add('electron-environment');
      console.log('Added electron-environment class to body');
    }

    // Debug message to Electron main process
    if (electronEnvironment && window.electronAPI?.debug) {
      window.electronAPI.debug({
        component: 'ModernElectronApp',
        event: 'initialized',
        data: { electronEnvironment }
      });
      console.log('Sent debug message to Electron main process');
    } else if (electronEnvironment) {
      console.log('Electron environment detected but debug API not available');
    }

    // Force render update to ensure proper detection
    setShowWidget(store => !store);
    setTimeout(() => setShowWidget(store => !store), 100);
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

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <ApiProviderProvider>
          <DashboardWidgetProvider>
            <Router>
              <ElectronAppLayout
                title="APIwidget"
                onToggleWidget={toggleWidgetVisibility}
                showWidget={showWidget}
              >
                <ModernDashboard />
              </ElectronAppLayout>
            </Router>
          </DashboardWidgetProvider>
        </ApiProviderProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default ModernElectronApp;
