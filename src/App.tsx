import React, { ErrorInfo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ApiProviderProvider } from './contexts/ApiProviderContext';
import { DashboardWidgetProvider } from './contexts/DashboardWidgetContext';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
// These imports use relative paths from the workspace root
import ResetPassword from './pages/ResetPassword';
import Register from './pages/Register';
import TestAuth from './pages/TestAuth';
import TestPage from './pages/TestPage';
import ModernDashboard from './pages/ModernDashboard';
import ApiKeySettings from './pages/ApiKeySettings';
import ProviderDetail from './pages/ProviderDetail';
import OpenAIProviderDetail from './pages/providers/OpenAIProviderDetail';
import ClaudeProviderDetail from './pages/providers/ClaudeProviderDetail';
import GeminiProviderDetail from './pages/providers/GeminiProviderDetail';
import WidgetGalleryPage from './pages/WidgetGalleryPage';
import FloatingWidgetsPage from './pages/FloatingWidgetsPage';
import UsagePage from './pages/UsagePage';
import HistoryPage from './pages/HistoryPage';
import HelpPage from './pages/HelpPage';
import { isPlatform } from './utils/platformUtils';
import { logEnvInfo } from './utils/environmentUtils';
import ModernElectronApp from './components/app/ModernElectronApp';
import ProtectedRoute from './components/routing/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
// Import the test report component
import TestReport from './components/diagnostics/TestReport';
// Import error boundary component
import ErrorBoundary from './components/common/ErrorBoundary';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import SystemSettings from './pages/admin/SystemSettings';
import ApiProviderManagement from './pages/admin/ApiProviderManagement';
import UsageAnalytics from './pages/admin/UsageAnalytics';
import ProviderUsageAnalytics from './pages/admin/ProviderUsageAnalytics';
import AdminAlerts from './pages/admin/AdminAlerts';
import './App.css';

function App() {
  // Check if running in Electron
  const isElectronApp = isPlatform.electron;

  // Log environment information
  logEnvInfo();

  // Log detection information
  if (process.env.NODE_ENV === 'development') {
    console.log('App.tsx - Environment detection:', {
      isElectronApp,
      isWeb: isPlatform.web,
      isDevelopment: isPlatform.development(),
      userAgent: navigator.userAgent,
      windowElectronAPI: window.electronAPI ? 'Available' : 'Not Available',
    });
  }

  // Handle global errors
  const handleGlobalError = (error: Error, errorInfo: ErrorInfo) => {
    if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
      console.error('Global error caught by App.tsx error boundary:', error, errorInfo);
    }

    // In a production app, you would send this to your error reporting service
    // For example: errorReportingService.reportError({ error, errorInfo });
  };

  // If running in Electron, use the Electron-specific app
  if (isElectronApp) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Loading ModernElectronApp component');
    }
    return (
      <ErrorBoundary onError={handleGlobalError} componentName="ModernElectronApp">
        <ModernElectronApp />
      </ErrorBoundary>
    );
  }

  // Otherwise, use the web app with authentication
  return (
    <ErrorBoundary onError={handleGlobalError} componentName="WebApp">
      <AuthProvider>
        <ApiProviderProvider>
          <DashboardWidgetProvider>
            <Router>
              <Routes>
                <Route
                  path="/login"
                  element={
                    <ErrorBoundary componentName="Login">
                      <Login />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <ErrorBoundary componentName="Register">
                      <Register />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/reset-password"
                  element={
                    <ErrorBoundary componentName="ResetPassword">
                      <ResetPassword />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/test-auth"
                  element={
                    <ErrorBoundary componentName="TestAuth">
                      <TestAuth />
                    </ErrorBoundary>
                  }
                />

                <Route
                  path="/"
                  element={
                    <ErrorBoundary componentName="ProtectedRoute">
                      <ProtectedRoute>
                        <ErrorBoundary componentName="AppLayout">
                          <AppLayout />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    </ErrorBoundary>
                  }
                >
                  <Route
                    index
                    element={
                      <ErrorBoundary componentName="ModernDashboard">
                        <ModernDashboard />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="settings/api-keys"
                    element={
                      <ErrorBoundary componentName="ApiKeySettings">
                        <ApiKeySettings />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="settings/api-keys/:providerId"
                    element={
                      <ErrorBoundary componentName="ApiKeySettings">
                        <ApiKeySettings />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="settings/api-keys/new"
                    element={
                      <ErrorBoundary componentName="ApiKeySettings">
                        <ApiKeySettings />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="provider/openai"
                    element={
                      <ErrorBoundary componentName="OpenAIProviderDetail">
                        <OpenAIProviderDetail />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="provider/claude"
                    element={
                      <ErrorBoundary componentName="ClaudeProviderDetail">
                        <ClaudeProviderDetail />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="provider/google"
                    element={
                      <ErrorBoundary componentName="GeminiProviderDetail">
                        <GeminiProviderDetail />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="provider/:providerId"
                    element={
                      <ErrorBoundary componentName="ProviderDetail">
                        <ProviderDetail />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="widgets"
                    element={
                      <ErrorBoundary componentName="WidgetGalleryPage">
                        <WidgetGalleryPage />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="floating-widgets"
                    element={
                      <ErrorBoundary componentName="FloatingWidgetsPage">
                        <FloatingWidgetsPage />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="usage"
                    element={
                      <ErrorBoundary componentName="UsagePage">
                        <UsagePage />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="history"
                    element={
                      <ErrorBoundary componentName="HistoryPage">
                        <HistoryPage />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="help"
                    element={
                      <ErrorBoundary componentName="HelpPage">
                        <HelpPage />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="test"
                    element={
                      <ErrorBoundary componentName="TestPage">
                        <TestPage />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="diagnostics"
                    element={
                      <ErrorBoundary componentName="TestReport">
                        <TestReport />
                      </ErrorBoundary>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="admin"
                    element={
                      <ErrorBoundary componentName="AdminRoute">
                        <AdminRoute>
                          <ErrorBoundary componentName="AdminDashboard">
                            <AdminDashboard />
                          </ErrorBoundary>
                        </AdminRoute>
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="admin/users"
                    element={
                      <ErrorBoundary componentName="AdminRoute">
                        <AdminRoute>
                          <ErrorBoundary componentName="UserManagement">
                            <UserManagement />
                          </ErrorBoundary>
                        </AdminRoute>
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="admin/settings"
                    element={
                      <ErrorBoundary componentName="AdminRoute">
                        <AdminRoute>
                          <ErrorBoundary componentName="SystemSettings">
                            <SystemSettings />
                          </ErrorBoundary>
                        </AdminRoute>
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="admin/api-providers"
                    element={
                      <ErrorBoundary componentName="AdminRoute">
                        <AdminRoute>
                          <ErrorBoundary componentName="ApiProviderManagement">
                            <ApiProviderManagement />
                          </ErrorBoundary>
                        </AdminRoute>
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="admin/analytics"
                    element={
                      <ErrorBoundary componentName="AdminRoute">
                        <AdminRoute>
                          <ErrorBoundary componentName="UsageAnalytics">
                            <UsageAnalytics />
                          </ErrorBoundary>
                        </AdminRoute>
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="admin/provider-analytics"
                    element={
                      <ErrorBoundary componentName="AdminRoute">
                        <AdminRoute>
                          <ErrorBoundary componentName="ProviderUsageAnalytics">
                            <ProviderUsageAnalytics />
                          </ErrorBoundary>
                        </AdminRoute>
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="admin/provider-analytics/:providerId"
                    element={
                      <ErrorBoundary componentName="AdminRoute">
                        <AdminRoute>
                          <ErrorBoundary componentName="ProviderUsageAnalytics">
                            <ProviderUsageAnalytics />
                          </ErrorBoundary>
                        </AdminRoute>
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="admin/alerts"
                    element={
                      <ErrorBoundary componentName="AdminRoute">
                        <AdminRoute>
                          <ErrorBoundary componentName="AdminAlerts">
                            <AdminAlerts />
                          </ErrorBoundary>
                        </AdminRoute>
                      </ErrorBoundary>
                    }
                  />

                  {/* Add more routes as needed */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </Router>
          </DashboardWidgetProvider>
        </ApiProviderProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
