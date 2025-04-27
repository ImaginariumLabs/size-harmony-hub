import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ApiKeySettings from './pages/ApiKeySettings';
import ProviderDetail from './pages/ProviderDetail';
import { isElectron } from './services/electronService';
import ElectronApp from './components/app/ElectronApp';
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

  // If running in Electron, use the Electron-specific app
  if (isElectronApp) {
    return <ElectronApp />;
  }

  // Otherwise, use the web app with authentication
  return (
    <AuthProvider>
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
            <Route index element={<Dashboard />} />
            <Route path="settings/api-keys" element={<ApiKeySettings />} />
            <Route path="settings/api-keys/new" element={<ApiKeySettings />} />
            <Route path="provider/:providerId" element={<ProviderDetail />} />

            {/* Add more routes as needed */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App
