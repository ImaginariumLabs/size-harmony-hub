import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider, CssBaseline, Box, Typography } from '@mui/material';
import '../../styles/electron.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardWidgetProvider } from '../../contexts/DashboardWidgetContext';
import { ApiProviderProvider } from '../../contexts/ApiProviderContext';
import { AuthProvider } from '../../contexts/AuthContext';
import ProtectedRoute from '../routing/ProtectedRoute';
import AdminRoute from '../routing/AdminRoute';
import ModernDashboard from '../../pages/ModernDashboard';
import ApiKeySettings from '../../pages/ApiKeySettings';
import ProviderDetail from '../../pages/ProviderDetail';
import OpenAIProviderDetail from '../../pages/providers/OpenAIProviderDetail';
import ClaudeProviderDetail from '../../pages/providers/ClaudeProviderDetail';
import GeminiProviderDetail from '../../pages/providers/GeminiProviderDetail';
import WidgetGalleryPage from '../../pages/WidgetGalleryPage';
import FloatingWidgetsPage from '../../pages/FloatingWidgetsPage';
import UsagePage from '../../pages/UsagePage';
import HistoryPage from '../../pages/HistoryPage';
import HelpPage from '../../pages/HelpPage';
import Login from '../../pages/Login';
// Settings pages
import AlertSettings from '../../components/settings/AlertSettings';
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
                <Routes>
                  {/* Public Routes - No authentication required */}
                  <Route path="/login" element={<Login />} />

                  {/* Regular Routes - Protected but available in both platforms */}
                  <Route path="/" element={
                    <ProtectedRoute>
                      <ModernDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings/api-keys" element={
                    <ProtectedRoute>
                      <ApiKeySettings />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings/api-keys/:providerId" element={
                    <ProtectedRoute>
                      <ApiKeySettings />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings/api-keys/new" element={
                    <ProtectedRoute>
                      <ApiKeySettings />
                    </ProtectedRoute>
                  } />
                  <Route path="/provider/:providerId" element={
                    <ProtectedRoute>
                      <ProviderDetail />
                    </ProtectedRoute>
                  } />
                  <Route path="/provider/openai" element={
                    <ProtectedRoute>
                      <OpenAIProviderDetail />
                    </ProtectedRoute>
                  } />
                  <Route path="/provider/claude" element={
                    <ProtectedRoute>
                      <ClaudeProviderDetail />
                    </ProtectedRoute>
                  } />
                  <Route path="/provider/google" element={
                    <ProtectedRoute>
                      <GeminiProviderDetail />
                    </ProtectedRoute>
                  } />
                  <Route path="/widgets" element={
                    <ProtectedRoute>
                      <WidgetGalleryPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/floating-widgets" element={
                    <ProtectedRoute>
                      <FloatingWidgetsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/usage" element={
                    <ProtectedRoute>
                      <UsagePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/history" element={
                    <ProtectedRoute>
                      <HistoryPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/help" element={
                    <ProtectedRoute>
                      <HelpPage />
                    </ProtectedRoute>
                  } />
                  {/* Notifications page temporarily removed */}
                  <Route path="/settings/alerts" element={
                    <ProtectedRoute>
                      <AlertSettings />
                    </ProtectedRoute>
                  } />

                  {/* Admin Routes - Only available in web mode and for admin users */}
                  {/* Admin Dashboard temporarily removed */}
                  {/* Admin routes temporarily disabled until components are implemented */}
                  <Route path="/admin/*" element={
                    <AdminRoute>
                      <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h5">Admin Panel</Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                          Admin functionality is currently under development.
                        </Typography>
                      </Box>
                    </AdminRoute>
                  } />

                  {/* Fallback Route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </ElectronAppLayout>
            </Router>
          </DashboardWidgetProvider>
        </ApiProviderProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default ModernElectronApp;
