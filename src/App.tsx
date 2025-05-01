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
import { isElectron } from './services/electronService';
import ModernElectronApp from './components/app/ModernElectronApp';
import ProtectedRoute from './components/routing/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

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
  const isElectronApp = isElectron();

  // Log detection information
  console.log('App.tsx - Electron detection:', {
    isElectronApp,
    userAgent: navigator.userAgent,
    windowElectronAPI: window.electronAPI ? 'Available' : 'Not Available'
  });

  // If running in Electron, use the Electron-specific app
  if (isElectronApp) {
    console.log('Loading ModernElectronApp component');
    return <ModernElectronApp />;
  }

  // Otherwise, use the web app with authentication
  return (
    <AuthProvider>
      <ApiProviderProvider>
        <DashboardWidgetProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/test-auth" element={<TestAuth />} />

              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<ModernDashboard />} />
                <Route path="settings/api-keys" element={<ApiKeySettings />} />
                <Route path="settings/api-keys/:providerId" element={<ApiKeySettings />} />
                <Route path="settings/api-keys/new" element={<ApiKeySettings />} />
                <Route path="provider/:providerId" element={<ProviderDetail />} />
                <Route path="provider/openai" element={<OpenAIProviderDetail />} />
                <Route path="provider/claude" element={<ClaudeProviderDetail />} />
                <Route path="provider/google" element={<GeminiProviderDetail />} />
                <Route path="widgets" element={<WidgetGalleryPage />} />
                <Route path="floating-widgets" element={<FloatingWidgetsPage />} />
                <Route path="usage" element={<UsagePage />} />
                <Route path="history" element={<HistoryPage />} />
                <Route path="help" element={<HelpPage />} />
                <Route path="test" element={<TestPage />} />

                {/* Admin Routes */}
                <Route path="admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
                <Route path="admin/users" element={
                  <AdminRoute>
                    <UserManagement />
                  </AdminRoute>
                } />
                <Route path="admin/settings" element={
                  <AdminRoute>
                    <SystemSettings />
                  </AdminRoute>
                } />
                <Route path="admin/api-providers" element={
                  <AdminRoute>
                    <ApiProviderManagement />
                  </AdminRoute>
                } />
                <Route path="admin/analytics" element={
                  <AdminRoute>
                    <UsageAnalytics />
                  </AdminRoute>
                } />
                <Route path="admin/provider-analytics" element={
                  <AdminRoute>
                    <ProviderUsageAnalytics />
                  </AdminRoute>
                } />
                <Route path="admin/provider-analytics/:providerId" element={
                  <AdminRoute>
                    <ProviderUsageAnalytics />
                  </AdminRoute>
                } />
                <Route path="admin/alerts" element={
                  <AdminRoute>
                    <AdminAlerts />
                  </AdminRoute>
                } />

                {/* Add more routes as needed */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </Router>
        </DashboardWidgetProvider>
      </ApiProviderProvider>
    </AuthProvider>
  );
}

export default App
