import React, { useState, useEffect, ErrorInfo } from 'react';
import { createTheme, ThemeProvider, CssBaseline, Box, Typography } from '@mui/material';
import '../../styles/electron.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardWidgetProvider } from '../../contexts/DashboardWidgetContext';
import { ApiProviderProvider } from '../../contexts/ApiProviderContext';
import { AuthProvider } from '../../contexts/AuthContext';
import ProtectedRoute from '../routing/ProtectedRoute';
import AdminRoute from '../auth/AdminRoute';
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
import { isElectron } from '../../services/environmentService';
// Import the test report component
import TestReport from '../diagnostics/TestReport';
// Import error boundary components
import ErrorBoundary from '../common/ErrorBoundary';

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
    if (process.env.NODE_ENV === 'development') {
      console.log('Environment:', {
        isElectron: electronEnvironment,
        userAgent: navigator.userAgent,
        windowElectronAPI: window.electronAPI ? 'Available' : 'Not Available',
        windowInnerWidth: window.innerWidth,
        windowInnerHeight: window.innerHeight,
      });
    }

    // Add electron-specific class to body if in Electron
    if (electronEnvironment) {
      document.body.classList.add('electron-environment');
      if (process.env.NODE_ENV === 'development') {
        console.log('Added electron-environment class to body');
      }
    }

    // Debug message to Electron main process
    if (electronEnvironment && window.electronAPI?.debug) {
      window.electronAPI.debug({
        component: 'ModernElectronApp',
        event: 'initialized',
        data: { electronEnvironment },
      });
      if (process.env.NODE_ENV === 'development') {
        console.log('Sent debug message to Electron main process');
      }
    } else if (electronEnvironment) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Electron environment detected but debug API not available');
      }
    }

    // Force render update to ensure proper detection
    setShowWidget(store => !store);
    setTimeout(() => setShowWidget(store => !store), 100);
  }, []);

  // Toggle widget visibility through Electron API
  const toggleWidgetVisibility = () => {
    if (window.electronAPI) {
      window.electronAPI
        .toggleWidgetVisibility()
        .then(isVisible => {
          setShowWidget(isVisible);
        })
        .catch(error => {
          if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
            console.error('Error toggling widget visibility:', error);
          }
        });
    }
  };

  // Handle global errors
  const handleGlobalError = (error: Error, errorInfo: ErrorInfo) => {
    if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
      console.error('Global error caught by ModernElectronApp error boundary:', error, errorInfo);
    }

    // In a production app, you would send this to your error reporting service
    // For example: errorReportingService.reportError({ error, errorInfo });

    // Log to Electron main process if available
    if (window.electronAPI?.debug) {
      try {
        window.electronAPI.debug({
          component: 'ModernElectronApp',
          event: 'error',
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
        });
      } catch (debugError) {
        if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
          console.error('Failed to send error to Electron main process:', debugError);
        }
      }
    }
  };

  return (
    <ErrorBoundary onError={handleGlobalError} componentName="ModernElectronApp">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <AuthProvider>
          <ApiProviderProvider>
            <DashboardWidgetProvider>
              <Router>
                <ErrorBoundary componentName="ElectronAppLayout">
                  <ElectronAppLayout
                    title="APIwidget"
                    onToggleWidget={toggleWidgetVisibility}
                    showWidget={showWidget}
                  >
                    <Routes>
                      {/* Public Routes - No authentication required */}
                      <Route
                        path="/login"
                        element={
                          <ErrorBoundary componentName="Login">
                            <Login />
                          </ErrorBoundary>
                        }
                      />

                      {/* Regular Routes - Protected but available in both platforms */}
                      <Route
                        path="/"
                        element={
                          <ErrorBoundary componentName="ProtectedRoute">
                            <ProtectedRoute>
                              <ErrorBoundary componentName="ModernDashboard">
                                <ModernDashboard />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/settings/api-keys"
                        element={
                          <ErrorBoundary componentName="ProtectedRoute">
                            <ProtectedRoute>
                              <ErrorBoundary componentName="ApiKeySettings">
                                <ApiKeySettings />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/settings/api-keys/:providerId"
                        element={
                          <ErrorBoundary componentName="ProtectedRoute">
                            <ProtectedRoute>
                              <ErrorBoundary componentName="ApiKeySettings">
                                <ApiKeySettings />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/settings/api-keys/new"
                        element={
                          <ErrorBoundary componentName="ProtectedRoute">
                            <ProtectedRoute>
                              <ErrorBoundary componentName="ApiKeySettings">
                                <ApiKeySettings />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/provider/openai"
                        element={
                          <ErrorBoundary componentName="ProtectedRoute">
                            <ProtectedRoute>
                              <ErrorBoundary componentName="OpenAIProviderDetail">
                                <OpenAIProviderDetail />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/provider/claude"
                        element={
                          <ErrorBoundary componentName="ProtectedRoute">
                            <ProtectedRoute>
                              <ErrorBoundary componentName="ClaudeProviderDetail">
                                <ClaudeProviderDetail />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/provider/google"
                        element={
                          <ErrorBoundary componentName="ProtectedRoute">
                            <ProtectedRoute>
                              <ErrorBoundary componentName="GeminiProviderDetail">
                                <GeminiProviderDetail />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/provider/:providerId"
                        element={
                          <ErrorBoundary componentName="ProtectedRoute">
                            <ProtectedRoute>
                              <ErrorBoundary componentName="ProviderDetail">
                                <ProviderDetail />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/widgets"
                        element={
                          <ErrorBoundary componentName="ProtectedRoute">
                            <ProtectedRoute>
                              <ErrorBoundary componentName="WidgetGalleryPage">
                                <WidgetGalleryPage />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/floating-widgets"
                        element={
                          <ErrorBoundary componentName="ProtectedRoute">
                            <ProtectedRoute>
                              <ErrorBoundary componentName="FloatingWidgetsPage">
                                <FloatingWidgetsPage />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/usage"
                        element={
                          <ErrorBoundary componentName="ProtectedRoute">
                            <ProtectedRoute>
                              <ErrorBoundary componentName="UsagePage">
                                <UsagePage />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/history"
                        element={
                          <ErrorBoundary componentName="ProtectedRoute">
                            <ProtectedRoute>
                              <ErrorBoundary componentName="HistoryPage">
                                <HistoryPage />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/help"
                        element={
                          <ErrorBoundary componentName="ProtectedRoute">
                            <ProtectedRoute>
                              <ErrorBoundary componentName="HelpPage">
                                <HelpPage />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/diagnostics"
                        element={
                          <ErrorBoundary componentName="ProtectedRoute">
                            <ProtectedRoute>
                              <ErrorBoundary componentName="TestReport">
                                <TestReport />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          </ErrorBoundary>
                        }
                      />
                      {/* Notifications page temporarily removed */}
                      <Route
                        path="/settings/alerts"
                        element={
                          <ErrorBoundary componentName="ProtectedRoute">
                            <ProtectedRoute>
                              <ErrorBoundary componentName="AlertSettings">
                                <AlertSettings />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          </ErrorBoundary>
                        }
                      />

                      {/* Admin Routes - Only available in web mode and for admin users */}
                      {/* Admin routes are defined in App.tsx */}

                      {/* Fallback Route */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </ElectronAppLayout>
                </ErrorBoundary>
              </Router>
            </DashboardWidgetProvider>
          </ApiProviderProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default ModernElectronApp;
