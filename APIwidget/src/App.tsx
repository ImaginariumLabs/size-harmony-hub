import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/MockAuthContext';
import { ApiProviderProvider } from './contexts/ApiProviderContext';
import { DashboardWidgetProvider } from './contexts/DashboardWidgetContext';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import ModernDashboard from './pages/ModernDashboard';
import ApiKeySettings from './pages/ApiKeySettings';
import ProviderDetail from './pages/ProviderDetail';
import OpenAIProviderDetail from './pages/providers/OpenAIProviderDetail';
import ClaudeProviderDetail from './pages/providers/ClaudeProviderDetail';
import GeminiProviderDetail from './pages/providers/GeminiProviderDetail';
import WidgetGalleryPage from './pages/WidgetGalleryPage';
import FloatingWidgetsPage from './pages/FloatingWidgetsPage';
import { isElectron } from './services/electronService';
import ModernElectronApp from './components/app/ModernElectronApp';
import './App.css';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

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
